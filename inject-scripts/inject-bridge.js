/* eslint-disable */

// The IIFE's return value (this file's completion value) is the per-injection channel
// nonce; the background reads it from chrome.scripting.executeScript's InjectionResult
// and hands it only to the MAIN-world script it injects next (see CHANNEL NONCE below).
(() => {
  // Prevent duplicate injection of the bridge itself (report the live bridge's nonce).
  if (window.__INJECT_SCRIPT_TOOL_UNIVERSAL_BRIDGE_LOADED__)
    return window.__INJECT_SCRIPT_TOOL_UNIVERSAL_BRIDGE_NONCE__;
  window.__INJECT_SCRIPT_TOOL_UNIVERSAL_BRIDGE_LOADED__ = true;
  const EVENT_NAME = {
    RESPONSE: 'scalemax:response',
    CLEANUP: 'scalemax:cleanup',
    EXECUTE: 'scalemax:execute',
  };

  // Keep in sync with the 30000ms convention used in inject-scripts/network-helper.js.
  const REQUEST_TIMEOUT_MS = 30000;

  /**
   * SECURITY NOTE — the MAIN world is inherently UNTRUSTED.
   *
   * This bridge lives in the ISOLATED world and talks to the MAIN world over
   * `window` CustomEvents. Page scripts share that MAIN world, so they can
   * observe every `scalemax:execute` event (including its requestId) and can
   * synthesise `scalemax:response` events. There is no browser primitive that
   * lets an ISOLATED-world listener prove a CustomEvent came from our own
   * MAIN-world handler rather than from page code, so this channel CANNOT be
   * made fully authentic.
   *
   * The checks below are therefore hardening, not authentication:
   *   - malformed / cross-target events are dropped,
   *   - requestIds are unguessable (crypto.randomUUID) and single-use,
   *   - responses must carry the per-injection channel nonce (below); note a
   *     hostile page that listens for `scalemax:response` can still learn it
   *     from the first legitimate response,
   *   - page-dispatched `scalemax:cleanup` events cannot tear the bridge down,
   *   - every request is bounded by a timeout so nothing leaks.
   *
   * The real mitigation lives upstream: the background MUST treat every value
   * returned through this bridge as untrusted, attacker-controlled input and
   * must never hand it to the LLM (or to privileged APIs) as if it were
   * extension-authored data.
   */
  /**
   * CHANNEL NONCE — generated here in the ISOLATED world (invisible to page
   * scripts) and returned to the background as this file's executeScript
   * result. The background passes it only to the MAIN-world script it injects,
   * which must echo it as `detail.nonce` on every `scalemax:response`. Responses
   * without the nonce are ignored. Lifecycle (cleanup) is driven exclusively by
   * the background over chrome.runtime, never by window events, so page scripts
   * cannot tear the bridge down.
   */
  const randomToken = () => {
    try {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
      }
      if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
        const bytes = crypto.getRandomValues(new Uint8Array(16));
        return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) {
      // Fall through to the legacy scheme below.
    }
    return `${Date.now()}-${Math.random()}-${Math.random()}`;
  };
  const channelNonce = randomToken();
  window.__INJECT_SCRIPT_TOOL_UNIVERSAL_BRIDGE_NONCE__ = channelNonce;

  // requestId -> { sendResponse, timeoutId }
  const pendingRequests = new Map();

  const newRequestId = () => `req-${randomToken()}`;

  /**
   * Atomically remove a pending entry and clear its timer.
   * Deleting BEFORE the caller invokes sendResponse makes each requestId
   * single-use: a second (possibly forged) response for the same id is a no-op.
   * @returns {((response: any) => void) | null}
   */
  const takePending = (requestId) => {
    const entry = pendingRequests.get(requestId);
    if (!entry) return null;
    pendingRequests.delete(requestId);
    clearTimeout(entry.timeoutId);
    return entry.sendResponse;
  };

  /** Settle every outstanding request so no sendResponse callback is retained. */
  const settleAllPending = (reason) => {
    for (const requestId of Array.from(pendingRequests.keys())) {
      const sendResponse = takePending(requestId);
      if (!sendResponse) continue;
      try {
        sendResponse({ error: reason });
      } catch (e) {
        // The message channel may already be gone; nothing to do.
      }
    }
  };

  const messageHandler = (request, _sender, sendResponse) => {
    // --- Lifecycle Command ---
    if (request.type === EVENT_NAME.CLEANUP) {
      // Let the MAIN-world script release its resources, then tear the bridge down.
      window.dispatchEvent(new CustomEvent(EVENT_NAME.CLEANUP));
      cleanupBridge();
      // Acknowledge cleanup signal received, but don't hold the connection.
      sendResponse({ success: true });
      return false;
    }

    // --- Execution Command for MAIN world ---
    if (request.targetWorld === 'MAIN') {
      const requestId = newRequestId();

      // Without this timer a MAIN world that never answers (no handler, page
      // error, hostile page) would retain sendResponse forever and the
      // background's `await chrome.tabs.sendMessage(...)` would never settle.
      const timeoutId = setTimeout(() => {
        const cb = takePending(requestId);
        if (!cb) return;
        try {
          cb({ error: `MAIN world did not respond within ${REQUEST_TIMEOUT_MS}ms` });
        } catch (e) {
          // The message channel may already be gone; nothing to do.
        }
      }, REQUEST_TIMEOUT_MS);

      pendingRequests.set(requestId, { sendResponse, timeoutId });

      window.dispatchEvent(
        new CustomEvent(EVENT_NAME.EXECUTE, {
          detail: {
            action: request.action,
            payload: request.payload,
            requestId: requestId,
          },
        }),
      );
      return true; // Async response is expected.
    }
    // Note: Requests for ISOLATED world are handled by the user's isolatedWorldCode script directly.
    // This listener won't process them unless it's the only script in ISOLATED world.
  };

  chrome.runtime.onMessage.addListener(messageHandler);

  // Listen for responses coming back from the MAIN world.
  // See the SECURITY NOTE above: these guards reduce the attack surface but
  // cannot establish authenticity of the sender.
  const responseHandler = (event) => {
    // Only accept a real CustomEvent with a usable detail object.
    if (!(event instanceof CustomEvent)) return;
    const detail = event.detail;
    if (detail === null || typeof detail !== 'object') return;

    // Same-document check: require the event to have been dispatched directly
    // on this document's `window`, not bubbled up from some element (or relayed
    // from another target) inside the page.
    if (event.target !== window) return;

    // Only the MAIN-world script the background injected knows the channel nonce.
    if (detail.nonce !== channelNonce) return;

    const requestId = detail.requestId;
    if (typeof requestId !== 'string' || requestId === '') return;

    // Unknown / already-settled / replayed ids resolve to null and are ignored.
    const sendResponse = takePending(requestId);
    if (!sendResponse) return;

    try {
      sendResponse({ data: detail.data, error: detail.error });
    } catch (e) {
      // The message channel may already be gone; nothing to do.
    }
  };
  window.addEventListener(EVENT_NAME.RESPONSE, responseHandler);

  // A navigation (or bfcache eviction) tears down the MAIN world handler, so any
  // outstanding request can never be answered. Settle them here rather than
  // leaking the callbacks.
  const pagehideHandler = () => {
    settleAllPending('Page navigated away before the MAIN world responded');
  };
  window.addEventListener('pagehide', pagehideHandler);

  // --- Self Cleanup ---
  // Invoked only from the chrome.runtime cleanup command above. A `scalemax:cleanup`
  // window event is NOT honoured here: page scripts can dispatch those at will.
  function cleanupBridge() {
    settleAllPending('Bridge was cleaned up before the MAIN world responded');
    chrome.runtime.onMessage.removeListener(messageHandler);
    window.removeEventListener(EVENT_NAME.RESPONSE, responseHandler);
    window.removeEventListener('pagehide', pagehideHandler);
    delete window.__INJECT_SCRIPT_TOOL_UNIVERSAL_BRIDGE_LOADED__;
    delete window.__INJECT_SCRIPT_TOOL_UNIVERSAL_BRIDGE_NONCE__;
  }

  return channelNonce;
})();
