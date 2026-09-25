// translate-settings.js
// Standalone settings page for the AI-powered translate feature. Plain script, no
// build step, no framework -- matches the CSP (`script-src 'self'`, no inline scripts)
// and is fully independent of the Vue chunks, so it cannot be broken by (or break)
// anything in chunks/.
//
// Message contract with background.js (must match registerTranslateMessaging exactly):
//   scalemax_translate_settings_get  -> { ok, settings: { enabled, targetLang, defaultSitePolicy } }
//   scalemax_translate_settings_set  -> { patch } -> { ok, settings }
//   scalemax_translate_site_prefs_list -> { ok, prefs: { [hostname]: "always"|"never" } }
//   scalemax_translate_site_policy_set -> { hostname, policy } -> { ok }
//
// Opened in its own tab as `translate-settings.html?tabId=<id>`; the "Current tab"
// card targets that tab (see resolveTargetTab below), not this settings tab.
//
// Message contract with content-scripts/translate.js (via chrome.tabs.sendMessage):
//   { action: "translate_now", targetLang } -> { success }
//   { action: "translate_revert" }          -> { success }
//   { action: "translate_status" }          -> { success, active, detectedLang, targetLang, hostname }

(function () {
  const LANGUAGE_NAMES = {
    en: "English", es: "Spanish", fr: "French", de: "German", it: "Italian",
    pt: "Portuguese", nl: "Dutch", ru: "Russian", ja: "Japanese", ko: "Korean",
    zh: "Chinese (Simplified)", "zh-TW": "Chinese (Traditional)", ar: "Arabic",
    hi: "Hindi", tr: "Turkish", pl: "Polish", vi: "Vietnamese", th: "Thai",
    id: "Indonesian", sv: "Swedish", da: "Danish", fi: "Finnish", no: "Norwegian",
    el: "Greek", he: "Hebrew", cs: "Czech", ro: "Romanian", hu: "Hungarian", uk: "Ukrainian",
  };

  const els = {
    enabledToggle: document.getElementById("enabled-toggle"),
    targetLang: document.getElementById("target-lang"),
    defaultPolicy: document.getElementById("default-policy"),
    statusMsg: document.getElementById("status-msg"),
    refreshSites: document.getElementById("refresh-sites"),
    sitesEmpty: document.getElementById("sites-empty"),
    sitesTable: document.getElementById("sites-table"),
    sitesTbody: document.getElementById("sites-tbody"),
    currentTabInfo: document.getElementById("current-tab-info"),
    translateNowBtn: document.getElementById("translate-now-btn"),
    revertNowBtn: document.getElementById("revert-now-btn"),
  };

  let statusTimer = null;
  function setStatus(message, ok) {
    els.statusMsg.textContent = message;
    els.statusMsg.className = "status " + (ok ? "ok" : "err");
    if (statusTimer) clearTimeout(statusTimer);
    if (message) statusTimer = setTimeout(() => { els.statusMsg.textContent = ""; els.statusMsg.className = "status"; }, 4000);
  }

  function sendBackground(message) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          resolve({ ok: false, error: chrome.runtime.lastError.message });
          return;
        }
        resolve(response || { ok: false, error: "no response" });
      });
    });
  }

  function sendToTab(tabId, message) {
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          resolve({ success: false, error: chrome.runtime.lastError.message });
          return;
        }
        resolve(response || { success: false, error: "no response" });
      });
    });
  }

  function populateLanguageSelect(selectEl) {
    selectEl.innerHTML = "";
    Object.keys(LANGUAGE_NAMES).sort((a, b) => LANGUAGE_NAMES[a].localeCompare(LANGUAGE_NAMES[b])).forEach((code) => {
      const opt = document.createElement("option");
      opt.value = code;
      opt.textContent = LANGUAGE_NAMES[code];
      selectEl.appendChild(opt);
    });
  }

  // ---------------------------------------------------------------------------
  // General settings
  // ---------------------------------------------------------------------------

  async function loadGeneralSettings() {
    const res = await sendBackground({ type: "scalemax_translate_settings_get" });
    if (!res || res.ok === false) {
      setStatus("Could not load settings: " + (res && res.error || "unknown error"), false);
      return;
    }
    const s = res.settings || {};
    els.enabledToggle.checked = s.enabled !== false;
    els.targetLang.value = s.targetLang || "en";
    els.defaultPolicy.value = s.defaultSitePolicy || "ask";
  }

  async function saveGeneralSettings(patch) {
    const res = await sendBackground({ type: "scalemax_translate_settings_set", patch });
    if (!res || res.ok === false) {
      setStatus("Save failed: " + (res && res.error || "unknown error"), false);
      return;
    }
    setStatus("Saved.", true);
  }

  els.enabledToggle.addEventListener("change", () => {
    saveGeneralSettings({ enabled: els.enabledToggle.checked });
  });
  els.targetLang.addEventListener("change", () => {
    saveGeneralSettings({ targetLang: els.targetLang.value });
  });
  els.defaultPolicy.addEventListener("change", () => {
    saveGeneralSettings({ defaultSitePolicy: els.defaultPolicy.value });
  });

  // ---------------------------------------------------------------------------
  // Per-site rules
  // ---------------------------------------------------------------------------

  async function loadSitePrefs() {
    const res = await sendBackground({ type: "scalemax_translate_site_prefs_list" });
    if (!res || res.ok === false) {
      setStatus("Could not load site rules: " + (res && res.error || "unknown error"), false);
      return;
    }
    renderSitePrefs(res.prefs || {});
  }

  function renderSitePrefs(prefs) {
    const hosts = Object.keys(prefs).sort();
    els.sitesTbody.innerHTML = "";
    if (!hosts.length) {
      els.sitesEmpty.hidden = false;
      els.sitesTable.hidden = true;
      return;
    }
    els.sitesEmpty.hidden = true;
    els.sitesTable.hidden = false;
    for (const host of hosts) {
      const policy = prefs[host];
      if (policy !== "always" && policy !== "never") continue; // "ask" entries aren't stored, but guard anyway
      const tr = document.createElement("tr");

      const hostTd = document.createElement("td");
      hostTd.textContent = host;
      tr.appendChild(hostTd);

      const ruleTd = document.createElement("td");
      const badge = document.createElement("span");
      badge.className = "rule-badge " + policy;
      badge.textContent = policy;
      ruleTd.appendChild(badge);
      tr.appendChild(ruleTd);

      const actionsTd = document.createElement("td");
      const actions = document.createElement("div");
      actions.className = "row-actions";

      const otherPolicy = policy === "always" ? "never" : "always";
      const switchBtn = document.createElement("button");
      switchBtn.type = "button";
      switchBtn.className = "btn-small";
      switchBtn.textContent = "Switch to " + otherPolicy;
      switchBtn.addEventListener("click", () => setHostPolicy(host, otherPolicy));

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn-small danger";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => setHostPolicy(host, "ask"));

      actions.appendChild(switchBtn);
      actions.appendChild(removeBtn);
      actionsTd.appendChild(actions);
      tr.appendChild(actionsTd);

      els.sitesTbody.appendChild(tr);
    }
  }

  async function setHostPolicy(hostname, policy) {
    const res = await sendBackground({ type: "scalemax_translate_site_policy_set", hostname, policy });
    if (!res || res.ok === false) {
      setStatus("Could not update rule for " + hostname + ": " + (res && res.error || "unknown error"), false);
      return;
    }
    setStatus(policy === "ask" ? "Removed rule for " + hostname + "." : "Set " + hostname + " to " + policy + ".", true);
    loadSitePrefs();
  }

  els.refreshSites.addEventListener("click", loadSitePrefs);

  // ---------------------------------------------------------------------------
  // Current tab controls
  // ---------------------------------------------------------------------------

  // This page is opened in its own tab (the popup calls chrome.tabs.create), so
  // `chrome.tabs.query({ active: true, currentWindow: true })` would return this
  // settings tab itself. Instead, target the tab the user came from: the popup
  // passes it as `?tabId=<id>`; otherwise fall back to the most recently used
  // web (http/https) tab, preferring this window.
  let activeTabId = null;
  const requestedTabId = (() => {
    try {
      const raw = new URLSearchParams(location.search).get("tabId");
      const n = raw == null ? NaN : Number(raw);
      return Number.isInteger(n) && n >= 0 ? n : null;
    } catch (e) {
      return null;
    }
  })();
  let targetTabId = null;

  function isWebUrl(url) {
    return /^https?:\/\//i.test(url || "");
  }

  function getTab(tabId) {
    return new Promise((resolve) => {
      chrome.tabs.get(tabId, (tab) => {
        if (chrome.runtime.lastError) { resolve(null); return; }
        resolve(tab || null);
      });
    });
  }

  function queryTabs(queryInfo) {
    return new Promise((resolve) => {
      chrome.tabs.query(queryInfo, (tabs) => {
        if (chrome.runtime.lastError) { resolve([]); return; }
        resolve(tabs || []);
      });
    });
  }

  function getSelfTabId() {
    return new Promise((resolve) => {
      try {
        chrome.tabs.getCurrent((tab) => {
          if (chrome.runtime.lastError) { resolve(null); return; }
          resolve(tab && typeof tab.id === "number" ? tab.id : null);
        });
      } catch (e) {
        resolve(null);
      }
    });
  }

  function pickMostRecentWebTab(tabs, selfTabId) {
    let best = null;
    for (const t of tabs) {
      if (!t || typeof t.id !== "number" || t.id === selfTabId) continue;
      if (!isWebUrl(t.url)) continue;
      if (!best || (t.lastAccessed || 0) > (best.lastAccessed || 0)) best = t;
    }
    return best;
  }

  async function resolveTargetTab() {
    if (typeof requestedTabId === "number") {
      const tab = await getTab(requestedTabId);
      if (tab) { targetTabId = tab.id; return tab; }
      // The tab we were opened for has been closed; fall back below.
    }
    const selfTabId = await getSelfTabId();
    const tab =
      pickMostRecentWebTab(await queryTabs({ currentWindow: true }), selfTabId) ||
      pickMostRecentWebTab(await queryTabs({}), selfTabId);
    targetTabId = tab ? tab.id : null;
    return tab;
  }

  let refreshSeq = 0;
  async function refreshCurrentTab() {
    const seq = ++refreshSeq;
    const stale = () => seq !== refreshSeq;
    els.translateNowBtn.disabled = true;
    els.revertNowBtn.disabled = true;
    try {
      const tab = await resolveTargetTab();
      if (stale()) return;
      if (!tab || typeof tab.id !== "number") {
        activeTabId = null;
        els.currentTabInfo.textContent = "No web page tab found. Open the page you want to translate, then reopen this page from the extension popup.";
        return;
      }
      activeTabId = tab.id;
      let hostname = "";
      try { hostname = new URL(tab.url || "").hostname; } catch (e) {}
      if (!hostname || !isWebUrl(tab.url)) {
        els.currentTabInfo.textContent = "This page can't be translated (browser-internal page).";
        return;
      }
      const status = await sendToTab(activeTabId, { action: "translate_status" });
      if (stale()) return;
      if (!status || status.success === false) {
        els.currentTabInfo.textContent = hostname + " — translation not available on this page (try reloading it after installing this update).";
        els.translateNowBtn.disabled = false;
        return;
      }
      const detected = status.detectedLang && status.detectedLang !== "und" ? (LANGUAGE_NAMES[status.detectedLang] || status.detectedLang) : "not yet detected";
      els.currentTabInfo.textContent = hostname + " — detected language: " + detected + (status.active ? " — currently translated" : "");
      els.translateNowBtn.disabled = false;
      els.revertNowBtn.disabled = !status.active;
    } catch (e) {
      if (stale()) return;
      els.currentTabInfo.textContent = "Could not read the active tab: " + (e && e.message || e);
    }
  }

  // Keep the "Current tab" card in sync when the target tab navigates/reloads,
  // is closed, or when the user switches back to this settings tab.
  let refreshTimer = null;
  function scheduleRefresh() {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => { refreshTimer = null; refreshCurrentTab(); }, 250);
  }
  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (tabId !== targetTabId) return;
    if (changeInfo.url || changeInfo.status === "complete") scheduleRefresh();
  });
  chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabId !== targetTabId) return;
    scheduleRefresh();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") scheduleRefresh();
  });

  els.translateNowBtn.addEventListener("click", async () => {
    if (typeof activeTabId !== "number") return;
    els.translateNowBtn.disabled = true;
    const res = await sendToTab(activeTabId, { action: "translate_now", targetLang: els.targetLang.value });
    if (res && res.success) setStatus("Translating…", true);
    else setStatus("Could not start translation: " + (res && res.error || "unknown error"), false);
    refreshCurrentTab();
  });

  els.revertNowBtn.addEventListener("click", async () => {
    if (typeof activeTabId !== "number") return;
    els.revertNowBtn.disabled = true;
    const res = await sendToTab(activeTabId, { action: "translate_revert" });
    if (res && res.success) setStatus("Reverted to original text.", true);
    else setStatus("Could not revert: " + (res && res.error || "unknown error"), false);
    refreshCurrentTab();
  });

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------

  populateLanguageSelect(els.targetLang);
  loadGeneralSettings();
  loadSitePrefs();
  refreshCurrentTab();
})();
