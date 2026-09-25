/* eslint-disable */
// content-scripts/translate.js
//
// AI-powered in-place page translation.
//
// How this stays layout-safe: the ONLY DOM mutation this script ever performs is
// setting `.nodeValue` on existing Text nodes it already walked and read. No element
// is created, removed, reordered, or reparented. Every element's structure, classes,
// and styles are left completely untouched -- only the literal characters inside text
// nodes change. Reverting just restores the original strings onto those same nodes.
//
// Flow:
//   1. On document_idle, ask the background for this site's saved policy
//      ("ask" | "always" | "never") plus global settings.
//   2. If "never" or globally disabled -> do nothing.
//   3. Detect the page's language with chrome.i18n.detectLanguage (ships with Chrome,
//      no network call). If it already matches the target language, do nothing.
//   4. "always" -> translate immediately. "ask" -> show a small shadow-DOM banner
//      offering Translate / Always / Never / dismiss, and only translate on demand.
//   5. Walk visible text nodes, batch them, send to the background
//      (scalemax_translate_batch), and write results back onto the SAME node
//      references in the SAME order the batch was sent -- this ordering guarantee is
//      what makes the zip-back safe.
//   6. A MutationObserver catches text added after the initial pass (SPA navigation,
//      lazy-loaded content) and translates it too, debounced so it doesn't fire a
//      request per DOM mutation.
(function () {
  if (window.__TRANSLATE_HELPER_INITIALIZED__) return;
  window.__TRANSLATE_HELPER_INITIALIZED__ = true;

  // Reported on the ping reply so a future background version can detect a stale
  // resident copy of this script after an extension update (see accessibility-tree-helper.js
  // and props-agent.js for the same convention).
  const PROTOCOL_VERSION = 1;

  // Only run in the top frame. Translating every iframe independently (ads, embeds,
  // widgets) would multiply API calls for content the user usually doesn't care about;
  // the visible page text is what matters.
  if (window !== window.top) return;

  const SKIP_TAGS = new Set([
    'SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'CODE', 'PRE', 'TEXTAREA',
    'INPUT', 'SELECT', 'OPTION', 'SVG', 'CANVAS', 'IFRAME', 'OBJECT', 'EMBED',
  ]);

  const state = {
    originals: new Map(), // Text node -> original string, so we can revert.
    // Text node -> the exact string this script left in it after translating. If the
    // node's current nodeValue still equals this, the text is ours (skip it); if it
    // differs, the PAGE rewrote it since, so it is fresh original text again.
    translatedNodes: new Map(),
    inFlight: new Set(), // Text nodes collected by a pass whose translation hasn't landed yet.
    generation: 0, // Bumped on revert, so late responses from before it are discarded.
    dirtyRoots: new Set(), // Elements queued by the MutationObserver for the next pass.
    flushTimer: null,
    touchedElements: new Set(), // Parent elements whose text we changed (for layout mitigation).
    growth: new Map(), // Element -> { before, after } char counts, to detect big expansions.
    measured: new Set(), // Elements already put through the mitigation pass, so incremental
    // MutationObserver passes on an SPA don't re-measure the whole page every time.
    active: false, // true once a translation pass has run for this page load.
    targetLang: 'en',
    detectedLang: null,
    observer: null,
    banner: null,
    pending: false,
  };

  function log(...args) {
    console.debug('[scalemax-translate]', ...args);
  }

  // ---------------------------------------------------------------------------
  // Messaging helpers
  // ---------------------------------------------------------------------------

  function sendMessage(message) {
    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
            resolve({ ok: false, error: chrome.runtime.lastError.message });
            return;
          }
          resolve(response || { ok: false, error: 'no response' });
        });
      } catch (e) {
        resolve({ ok: false, error: String(e && e.message ? e.message : e) });
      }
    });
  }

  function getHostname() {
    try {
      return location.hostname;
    } catch (e) {
      return '';
    }
  }

  // ---------------------------------------------------------------------------
  // Text-node collection
  // ---------------------------------------------------------------------------

  /**
   * True if `node` is a text node worth translating: has non-whitespace content, its
   * nearest element ancestor is visible and not explicitly opted out via the standard
   * `translate="no"` attribute or Google-Translate-style `notranslate` class (both are
   * widely recognized conventions, so respecting them avoids re-translating things
   * sites already marked as intentionally untranslated, e.g. code samples, brand
   * names, or embedded widgets).
   */
  function isTranslatableTextNode(node) {
    if (node.nodeType !== Node.TEXT_NODE) return false;
    const text = node.nodeValue;
    if (!text || !/\S/.test(text)) return false;
    // Skip strings that are purely numeric/symbolic -- nothing to translate, and
    // sending them just wastes a slot in the batch.
    if (!/[A-Za-z\u00C0-\u1FFF\u2C00-\uD7FF]/.test(text)) return false;
    let el = node.parentElement;
    while (el) {
      if (SKIP_TAGS.has(el.tagName)) return false;
      const translateAttr = el.getAttribute && el.getAttribute('translate');
      if (translateAttr === 'no') return false;
      if (el.classList && el.classList.contains('notranslate')) return false;
      if (el.isContentEditable) return false;
      el = el.parentElement;
    }
    return true;
  }

  function isElementVisible(el) {
    try {
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      // Zero-size elements are usually visually hidden (off-screen menus, etc.); skip
      // them so we don't spend translation budget on content the user can't see yet.
      // (They'll still be caught by the MutationObserver if/when they become visible
      // and their text actually changes, or on the next full pass.)
      const rect = el.getBoundingClientRect();
      return rect.width > 0 || rect.height > 0;
    } catch (e) {
      return true;
    }
  }

  /**
   * Collect translatable text nodes under `root` (defaults to the whole document).
   * Returns an array of Text node references -- NOT copies, NOT wrapped, the actual
   * nodes -- because writing the translation back means setting `.nodeValue` directly
   * on these same objects.
   */
  function collectTextNodes(root) {
    const nodes = [];
    const walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!isTranslatableTextNode(node)) return NodeFilter.FILTER_REJECT;
        const el = node.parentElement;
        if (el && !isElementVisible(el)) return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let n;
    while ((n = walker.nextNode())) {
      // Already queued/sent by another pass -- don't translate it twice.
      if (state.inFlight.has(n)) continue;
      if (state.translatedNodes.has(n)) {
        // Still holding our translation: nothing to do.
        if (state.translatedNodes.get(n) === n.nodeValue) continue;
        // The page replaced our translated text since; its current text is the new
        // original, so forget the stale bookkeeping and translate it afresh.
        state.translatedNodes.delete(n);
        state.originals.delete(n);
      }
      nodes.push(n);
    }
    return nodes;
  }

  function isOurText(node) {
    return state.translatedNodes.has(node) && state.translatedNodes.get(node) === node.nodeValue;
  }

  // ---------------------------------------------------------------------------
  // Translation pass
  // ---------------------------------------------------------------------------

  /**
   * Translate a list of text nodes: batch their current text, send to the background,
   * and on response write each translated string back onto the SAME node it came from
   * by array index. The background guarantees the returned array is the same length
   * and order as the input, and falls back to echoing the original string per-entry on
   * any failure -- so even a partial provider failure never desyncs the zip-back or
   * leaves a node blank.
   */
  async function translateNodes(nodes) {
    if (!nodes.length) return;
    const generation = state.generation;
    const texts = nodes.map((n) => n.nodeValue);
    let response;
    try {
      response = await sendMessage({
        type: 'scalemax_translate_batch',
        texts,
        targetLang: state.targetLang,
        sourceLang: state.detectedLang,
      });
    } finally {
      // Release these nodes (claimed in runTranslationPass). After a revert, inFlight
      // was already reset, so leave it alone in case a newer pass claimed them.
      if (generation === state.generation) {
        for (const n of nodes) state.inFlight.delete(n);
      }
    }
    // Reverted ("Show original") while this batch was in flight: drop the result.
    if (generation !== state.generation) return;
    const translations = Array.isArray(response.translations) ? response.translations : texts;
    const changedByPage = [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      // A node can be detached from the document by the time an async response
      // arrives (e.g. the page re-rendered that section) -- isConnected guards
      // against writing into a node nobody can see anymore.
      if (!node.isConnected) continue;
      // The page rewrote this node while the request was in flight: the result is a
      // translation of text that is no longer there. Don't write it; re-queue the
      // node so its new text gets translated instead.
      if (node.nodeValue !== texts[i]) {
        changedByPage.push(node);
        continue;
      }
      if (!state.originals.has(node)) state.originals.set(node, texts[i]);
      const translated = translations[i];
      if (typeof translated === 'string' && translated !== node.nodeValue) {
        const before = node.nodeValue;
        // Plain text only: nodeValue never parses markup, so provider output can't
        // inject HTML into the page.
        node.nodeValue = translated;
        // Track per-element text growth so the mitigation pass can tell "this
        // heading got 4x longer" apart from "this paragraph is about the same".
        const el = node.parentElement;
        if (el) {
          const prev = state.growth.get(el) || { before: 0, after: 0 };
          prev.before += (before || '').length;
          prev.after += translated.length;
          state.growth.set(el, prev);
          state.touchedElements.add(el);
        }
      }
      state.translatedNodes.set(node, node.nodeValue);
    }
    if (changedByPage.length && state.observer) {
      queueDirtyRoots(changedByPage.map((node) => node.parentElement));
    }
    if (response.ok === false && response.error) {
      log('translateBatch reported an error (falling back to original text):', response.error);
      showToast('Translation unavailable: ' + response.error, true);
    }
  }

  /**
   * Split nodes into "roughly on screen" and "everything else". Translating the
   * visible part first and painting it before the rest comes back is what makes this
   * feel fast — the user sees translated text in one round trip instead of waiting
   * for the entire document.
   */
  function partitionByViewport(nodes) {
    const inView = [];
    const rest = [];
    const vh = window.innerHeight || 800;
    for (const node of nodes) {
      const el = node.parentElement;
      if (!el) {
        rest.push(node);
        continue;
      }
      let top = Infinity;
      try {
        top = el.getBoundingClientRect().top;
      } catch (e) {
        top = Infinity;
      }
      // One extra screen of lookahead, so scrolling slightly doesn't immediately hit
      // untranslated text.
      if (top > -vh && top < vh * 2) inView.push(node);
      else rest.push(node);
    }
    return { inView, rest };
  }

  async function runTranslationPass(root) {
    const nodes = collectTextNodes(root);
    if (!nodes.length) return;
    const generation = state.generation;
    // Mark every collected node (both phases) as in flight up front, so an
    // overlapping pass -- e.g. a MutationObserver pass on a nested root, or a manual
    // "Translate now" -- skips them instead of sending them a second time.
    // translateNodes() releases each phase's nodes once its response is back.
    for (const n of nodes) state.inFlight.add(n);
    const { inView, rest } = partitionByViewport(nodes);
    let restSent = false;
    try {
      // One message per phase, not per chunk: the background splits it into small
      // chunks and fans those out concurrently (bounded), which is much faster than
      // this script awaiting a sequence of batches itself.
      if (inView.length) {
        await translateNodes(inView);
        if (generation !== state.generation) return;
        applyLayoutMitigations();
      }
      if (rest.length) {
        restSent = true;
        await translateNodes(rest);
        if (generation !== state.generation) return;
        applyLayoutMitigations();
      }
    } finally {
      // If we bailed out before sending the second phase, release its nodes here.
      if (!restSent && generation === state.generation) {
        for (const n of rest) state.inFlight.delete(n);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Layout mitigation
  // ---------------------------------------------------------------------------
  //
  // Replacing text in place cannot break the DOM, but it CAN break visual layout:
  // translating a compact language (Chinese/Japanese/Korean) into a verbose one
  // (English) routinely makes a string 3-5x longer, and the page's CSS was sized
  // around the original. Concretely that shows up as `white-space: nowrap` nav
  // items overlapping each other, flex children overflowing their track instead of
  // shrinking, and oversized headlines wrapping to many more lines than the design
  // allowed for.
  //
  // Rather than blanket-overriding page CSS (which would break as many layouts as
  // it fixes), this MEASURES which specific elements actually overflow after
  // translation and only relaxes those, via attributes on the elements we already
  // touched. Reads are batched before writes to avoid layout thrashing.

  const MITIGATION_STYLE_ID = '__scalemax_translate_fit__';

  function ensureMitigationStyles() {
    if (document.getElementById(MITIGATION_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = MITIGATION_STYLE_ID;
    // Note: this is the one element this script inserts into the page. A <style> in
    // <head> is not rendered and takes part in no layout flow, so it cannot shift
    // anything by existing; revertAll() removes it again.
    style.textContent = `
      [data-sx-wrap] { white-space: normal !important; }
      [data-sx-shrink] { min-width: 0 !important; }
      [data-sx-break] { overflow-wrap: break-word !important; word-break: normal !important; }
      [data-sx-fit="1"] { font-size: 92% !important; }
      [data-sx-fit="2"] { font-size: 84% !important; }
      [data-sx-fit="3"] { font-size: 74% !important; }
      [data-sx-fit] { letter-spacing: normal !important; }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function applyLayoutMitigations() {
    // Only elements we haven't already measured — incremental passes from the
    // MutationObserver would otherwise re-measure the entire page on every DOM
    // change, which gets expensive on a long-lived SPA.
    const els = Array.from(state.touchedElements).filter((el) => el.isConnected && !state.measured.has(el));
    if (!els.length) return;
    ensureMitigationStyles();

    // --- Phase 1: read only. No DOM writes in this loop. ---
    const plans = [];
    for (const el of els) {
      let cs;
      try {
        cs = window.getComputedStyle(el);
      } catch (e) {
        continue;
      }
      if (!cs || cs.display === 'none') continue;
      let parentDisplay = '';
      try {
        parentDisplay = el.parentElement ? window.getComputedStyle(el.parentElement).display : '';
      } catch (e) {
        parentDisplay = '';
      }
      const g = state.growth.get(el) || { before: 0, after: 0 };
      plans.push({
        el,
        overflowsX: el.scrollWidth > el.clientWidth + 1,
        nowrap: cs.whiteSpace === 'nowrap' || cs.whiteSpace === 'pre',
        isFlexOrGridChild: /flex|grid/.test(parentDisplay),
        fontSize: parseFloat(cs.fontSize) || 0,
        growthRatio: g.before > 0 ? g.after / g.before : 1,
      });
    }

    // --- Phase 2: write the cheap, safe relaxations. ---
    for (const p of plans) {
      // nowrap + actual overflow is the nav-items-overlapping case.
      if (p.nowrap && p.overflowsX) p.el.setAttribute('data-sx-wrap', '');
      // A flex/grid child defaults to min-width:auto, which makes it refuse to
      // shrink below its content and blow out the track instead.
      if (p.isFlexOrGridChild && p.overflowsX) p.el.setAttribute('data-sx-shrink', '');
      // Long unbroken translated words (URLs, compounds) overflowing a container.
      if (p.overflowsX) p.el.setAttribute('data-sx-break', '');
    }

    // --- Phase 3: re-measure once, then scale down only what still overflows. ---
    // Single deterministic pass rather than an iterative shrink loop, to keep the
    // cost bounded on text-heavy pages.
    const fits = [];
    for (const p of plans) {
      const stillOverflows = p.el.scrollWidth > p.el.clientWidth + 1;
      const ratio = p.el.clientWidth > 0 ? p.el.scrollWidth / p.el.clientWidth : 1;
      // Large headings that grew a lot don't overflow horizontally (they wrap), but
      // they do consume far more vertical space than the design allowed. Pull those
      // back modestly too.
      const bigHeadingBlowout = p.fontSize >= 28 && p.growthRatio >= 1.6;
      if (stillOverflows) {
        fits.push([p.el, ratio > 1.4 ? 3 : ratio > 1.18 ? 2 : 1]);
      } else if (bigHeadingBlowout) {
        fits.push([p.el, p.growthRatio >= 2.6 ? 2 : 1]);
      }
    }
    for (const [el, level] of fits) el.setAttribute('data-sx-fit', String(level));
    for (const p of plans) state.measured.add(p.el);
  }

  function clearLayoutMitigations() {
    for (const el of state.touchedElements) {
      if (!el.isConnected) continue;
      el.removeAttribute('data-sx-wrap');
      el.removeAttribute('data-sx-shrink');
      el.removeAttribute('data-sx-break');
      el.removeAttribute('data-sx-fit');
    }
    const style = document.getElementById(MITIGATION_STYLE_ID);
    if (style) style.remove();
  }

  function revertAll() {
    // Invalidate any in-flight batches so they can't re-apply translations after this.
    state.generation++;
    for (const [node, original] of state.originals) {
      // Only restore nodes that still hold OUR translation. If the page has rewritten
      // a node since, its current text is newer than our saved original and must win.
      if (node.isConnected && isOurText(node)) node.nodeValue = original;
    }
    clearLayoutMitigations();
    state.originals.clear();
    state.translatedNodes.clear();
    state.inFlight.clear();
    state.touchedElements.clear();
    state.growth.clear();
    state.measured.clear();
    state.active = false;
  }

  // ---------------------------------------------------------------------------
  // Dynamic content: MutationObserver, debounced
  // ---------------------------------------------------------------------------

  function queueDirtyRoots(roots) {
    for (const root of roots) state.dirtyRoots.add(root || document.body);
    if (state.flushTimer) clearTimeout(state.flushTimer);
    state.flushTimer = setTimeout(flushDirtyRoots, 600);
  }

  function flushDirtyRoots() {
    state.flushTimer = null;
    const roots = Array.from(state.dirtyRoots).filter((root) => root && root.isConnected);
    state.dirtyRoots.clear();
    // Collapse nested roots: a root inside another queued root is already covered by
    // that ancestor's walk, so running both would translate its text twice.
    // (Ancestor walk against a Set rather than pairwise contains(), which would be
    // quadratic on big SPA mutation bursts.)
    const queued = new Set(roots);
    const unique = roots.filter((root) => {
      for (let p = root.parentNode; p; p = p.parentNode) {
        if (queued.has(p)) return false;
      }
      return true;
    });
    for (const root of unique) {
      runTranslationPass(root).catch((e) => log('pass failed', e));
    }
  }

  // Callers start observing BEFORE their first runTranslationPass(), so content the
  // page adds while that pass is in flight isn't missed; our own nodeValue writes are
  // recognized via isOurText() and ignored.
  function startObserving() {
    if (state.observer) return;
    state.observer = new MutationObserver((mutations) => {
      const roots = [];
      for (const m of mutations) {
        if (m.type === 'childList' && m.addedNodes.length) {
          for (const added of m.addedNodes) {
            if (added.nodeType === Node.ELEMENT_NODE || added.nodeType === Node.TEXT_NODE) {
              roots.push(added.parentElement || document.body);
            }
          }
        } else if (m.type === 'characterData') {
          const node = m.target;
          // A node still holding exactly the text we wrote is our OWN write, not new
          // page content -- don't re-queue it, or we'd translate our own output. If
          // the page changed it afterwards, the value differs and it is re-queued.
          if (isOurText(node)) continue;
          // Already being translated; translateNodes re-queues it if its text changed.
          if (state.inFlight.has(node)) continue;
          roots.push(node.parentElement || document.body);
        }
      }
      if (roots.length) queueDirtyRoots(roots);
    });
    state.observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function stopObserving() {
    if (state.observer) {
      state.observer.disconnect();
      state.observer = null;
    }
    // Drop any pending debounced pass too, so nothing is translated after a revert.
    if (state.flushTimer) {
      clearTimeout(state.flushTimer);
      state.flushTimer = null;
    }
    state.dirtyRoots.clear();
  }

  // ---------------------------------------------------------------------------
  // Banner UI (shadow DOM, so page CSS cannot bleed in or be bled onto)
  // ---------------------------------------------------------------------------

  function ensureBannerHost() {
    if (state.banner) return state.banner;
    const host = document.createElement('div');
    host.id = '__scalemax_translate_host__';
    // Fixed positioning on a dedicated host element, appended to <html> not <body>, so
    // it cannot be caught by a page's `overflow:hidden`/transform on <body> and cannot
    // shift any existing layout -- it is not part of the page's flow at all.
    host.style.position = 'fixed';
    host.style.zIndex = '2147483647';
    host.style.top = '12px';
    host.style.right = '12px';
    host.style.left = 'auto';
    host.style.bottom = 'auto';
    host.style.margin = '0';
    host.style.padding = '0';
    host.style.width = '0';
    host.style.height = '0';
    document.documentElement.appendChild(host);
    const shadow = host.attachShadow({ mode: 'closed' });
    const style = document.createElement('style');
    style.textContent = `
      :host { all: initial; }
      .banner {
        position: absolute;
        top: 0; right: 0;
        display: flex;
        align-items: center;
        gap: 8px;
        background: #1a1a1a;
        color: #fff;
        font: 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 10px 12px;
        border-radius: 10px;
        box-shadow: 0 6px 24px -4px rgba(0,0,0,0.35);
        white-space: nowrap;
        animation: scalemax-fade-in 150ms ease-out;
      }
      @keyframes scalemax-fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      button {
        font: inherit;
        border: none;
        border-radius: 6px;
        padding: 6px 10px;
        cursor: pointer;
        background: #2a2a2a;
        color: #fff;
      }
      button.primary { background: #d97757; }
      button.primary:hover { background: #c4664a; }
      button:hover { background: #3a3a3a; }
      button:focus-visible { outline: 2px solid #d97757; outline-offset: 2px; }
      .close {
        background: transparent;
        padding: 4px 6px;
        font-size: 15px;
        line-height: 1;
      }
      .toast {
        position: absolute;
        top: 0; right: 0;
        background: #1a1a1a;
        color: #fff;
        font: 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 8px 12px;
        border-radius: 8px;
        max-width: 280px;
        box-shadow: 0 6px 24px -4px rgba(0,0,0,0.35);
      }
      .toast.error { background: #7a2020; }
      @media (prefers-reduced-motion: reduce) {
        .banner { animation: none; }
      }
    `;
    shadow.appendChild(style);
    state.banner = { host, shadow };
    return state.banner;
  }

  function showToast(message, isError) {
    const { shadow } = ensureBannerHost();
    const existing = shadow.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast' + (isError ? ' error' : '');
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    shadow.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  function showAskBanner(langLabel) {
    const { shadow } = ensureBannerHost();
    const existing = shadow.querySelector('.banner');
    if (existing) existing.remove();
    const banner = document.createElement('div');
    banner.className = 'banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Translate this page');

    const label = document.createElement('span');
    label.textContent = `Translate this page from ${langLabel}?`;

    const translateBtn = document.createElement('button');
    translateBtn.className = 'primary';
    translateBtn.textContent = 'Translate';
    translateBtn.addEventListener('click', async () => {
      banner.remove();
      state.active = true;
      // Remember this domain for the rest of the browsing session, so navigating
      // around the same site keeps translating without re-prompting on every page.
      sendMessage({ type: 'scalemax_translate_session_auto_set', hostname: getHostname(), on: true });
      startObserving();
      await runTranslationPass();
    });

    const alwaysBtn = document.createElement('button');
    alwaysBtn.textContent = 'Always translate this site';
    alwaysBtn.addEventListener('click', async () => {
      banner.remove();
      await sendMessage({ type: 'scalemax_translate_site_policy_set', hostname: getHostname(), policy: 'always' });
      state.active = true;
      startObserving();
      await runTranslationPass();
    });

    const neverBtn = document.createElement('button');
    neverBtn.textContent = 'Never translate this site';
    neverBtn.addEventListener('click', async () => {
      banner.remove();
      await sendMessage({ type: 'scalemax_translate_site_policy_set', hostname: getHostname(), policy: 'never' });
    });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close';
    closeBtn.textContent = '\u00D7';
    closeBtn.setAttribute('aria-label', 'Dismiss');
    closeBtn.addEventListener('click', () => banner.remove());

    banner.appendChild(label);
    banner.appendChild(translateBtn);
    banner.appendChild(alwaysBtn);
    banner.appendChild(neverBtn);
    banner.appendChild(closeBtn);
    shadow.appendChild(banner);
  }

  function showActiveIndicator() {
    // A small persistent affordance so the user can revert/re-check status without
    // needing the popup, once a page has actually been translated.
    const { shadow } = ensureBannerHost();
    const existing = shadow.querySelector('.banner');
    if (existing) existing.remove();
    const banner = document.createElement('div');
    banner.className = 'banner';
    const label = document.createElement('span');
    label.textContent = 'Translated';
    const revertBtn = document.createElement('button');
    revertBtn.textContent = 'Show original';
    revertBtn.addEventListener('click', () => {
      revertAll();
      stopObserving();
      // Clear the session flag too, otherwise the next page on this domain would
      // immediately re-translate and reverting would feel like it didn't stick.
      sendMessage({ type: 'scalemax_translate_session_auto_set', hostname: getHostname(), on: false });
      banner.remove();
    });
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close';
    closeBtn.textContent = '\u00D7';
    closeBtn.setAttribute('aria-label', 'Dismiss');
    closeBtn.addEventListener('click', () => banner.remove());
    banner.appendChild(label);
    banner.appendChild(revertBtn);
    banner.appendChild(closeBtn);
    shadow.appendChild(banner);
    setTimeout(() => { if (banner.isConnected) banner.remove(); }, 6000);
  }

  // ---------------------------------------------------------------------------
  // Bootstrap
  // ---------------------------------------------------------------------------

  async function detectPageLanguage() {
    // chrome.i18n.detectLanguage samples the page's own text; feed it a chunk of body
    // text rather than the raw HTML so markup doesn't skew detection.
    const sample = (document.body && document.body.innerText || '').slice(0, 1000).trim();
    if (!sample) return null;
    try {
      const result = await new Promise((resolve) => {
        chrome.i18n.detectLanguage(sample, resolve);
      });
      if (!result || !Array.isArray(result.languages) || !result.languages.length) return null;
      const top = result.languages.reduce((a, b) => (a.percentage >= b.percentage ? a : b));
      if (!result.isReliable && top.percentage < 40) return null;
      return top.language;
    } catch (e) {
      log('detectLanguage failed', e);
      return null;
    }
  }

  async function bootstrap() {
    const hostname = getHostname();
    if (!hostname) return;

    const policyResp = await sendMessage({ type: 'scalemax_translate_site_policy_get', hostname });
    if (!policyResp || policyResp.ok === false) return;
    const settings = policyResp.settings || { enabled: true, targetLang: 'en' };
    if (!settings.enabled) return;
    state.targetLang = settings.targetLang || 'en';
    const policy = policyResp.policy || 'ask';
    if (policy === 'never') return;

    // Same-domain continuation: if this hostname was translated earlier in this
    // browsing session, translate straight away instead of asking again. Detection is
    // skipped entirely here — it's a round trip we don't need, and the answer can't
    // have changed for a page the user already chose to translate on this domain.
    if (policy !== 'always' && policyResp.sessionAuto) {
      state.active = true;
      startObserving();
      await runTranslationPass();
      return;
    }

    const detected = await detectPageLanguage();
    state.detectedLang = detected;
    // 'und' is chrome.i18n's "undetermined" code; treat it like "no confident
    // detection" rather than a real language, so we don't prompt on it.
    if (!detected || detected === 'und') return;
    if (detected === state.targetLang) return;

    if (policy === 'always') {
      state.active = true;
      startObserving();
      await runTranslationPass();
      return;
    }

    // policy === 'ask'
    if (!TRANSLATE_LANGUAGE_NAMES_CS[detected] && detected.length > 6) return; // sanity guard against garbage codes
    const langLabel = TRANSLATE_LANGUAGE_NAMES_CS[detected] || detected.toUpperCase();
    showAskBanner(langLabel);
  }

  // Small local copy of the same language-name map the background uses, purely for
  // display in the banner prompt -- kept intentionally short since this is UI copy
  // only, not used for any translation logic (the background's copy is authoritative
  // for that).
  const TRANSLATE_LANGUAGE_NAMES_CS = {
    en: 'English', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian',
    pt: 'Portuguese', nl: 'Dutch', ru: 'Russian', ja: 'Japanese', ko: 'Korean',
    zh: 'Chinese', 'zh-TW': 'Chinese (Traditional)', ar: 'Arabic', hi: 'Hindi',
    tr: 'Turkish', pl: 'Polish', vi: 'Vietnamese', th: 'Thai', id: 'Indonesian',
    sv: 'Swedish', da: 'Danish', fi: 'Finnish', no: 'Norwegian', el: 'Greek',
    he: 'Hebrew', cs: 'Czech', ro: 'Romanian', hu: 'Hungarian', uk: 'Ukrainian',
  };

  // ---------------------------------------------------------------------------
  // Message handlers (ping + on-demand actions from the popup/settings page)
  // ---------------------------------------------------------------------------

  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request && request.action === 'translate_ping') {
      sendResponse({ status: 'pong', v: PROTOCOL_VERSION, script: 'translate' });
      return false;
    }
    if (request && request.action === 'translate_now') {
      (async () => {
        const detected = state.detectedLang || (await detectPageLanguage());
        state.detectedLang = detected;
        state.targetLang = request.targetLang || state.targetLang;
        state.active = true;
        // Manual translate also opts this domain in for the session, same as the
        // banner's Translate button.
        sendMessage({ type: 'scalemax_translate_session_auto_set', hostname: getHostname(), on: true });
        startObserving();
        await runTranslationPass();
        sendResponse({ success: true });
      })();
      return true;
    }
    if (request && request.action === 'translate_revert') {
      revertAll();
      stopObserving();
      sendMessage({ type: 'scalemax_translate_session_auto_set', hostname: getHostname(), on: false });
      sendResponse({ success: true });
      return false;
    }
    if (request && request.action === 'translate_status') {
      sendResponse({
        success: true,
        active: state.active,
        detectedLang: state.detectedLang,
        targetLang: state.targetLang,
        hostname: getHostname(),
      });
      return false;
    }
    return false;
  });

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    bootstrap().catch((e) => log('bootstrap failed', e));
  } else {
    document.addEventListener('DOMContentLoaded', () => bootstrap().catch((e) => log('bootstrap failed', e)), { once: true });
  }

  // Stop the MutationObserver when the page is being navigated away from/closed, so
  // it isn't left running against a document that's being torn down. `pagehide` is
  // used rather than the deprecated `unload` event, which many sites block via a
  // `Permissions-Policy: unload=()` header.
  window.addEventListener('pagehide', () => {
    stopObserving();
  });
  // Restored from the back/forward cache: this script doesn't run again, so resume
  // watching for new content if the page is still in translated mode.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted && state.active) startObserving();
  });
})();
