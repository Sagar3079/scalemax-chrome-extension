/* eslint-disable */

(() => {
  // Prevent duplicate injection of the bridge itself.
  if (window.__INJECT_SCRIPT_TOOL_UNIVERSAL_BRIDGE_LOADED__) return;
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
   *   - every request is bounded by a timeout so nothing leaks.
   *
   * The real mitigation lives upstream: the background MUST treat every value
   * returned through this bridge as untrusted, attacker-controlled input and
   * must never hand it to the LLM (or to privileged APIs) as if it were
   * extension-authored data.
   */
  // requestId -> { sendResponse, timeoutId }
  const pendingRequests = new Map();

  const newRequestId = () => {
    try {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return `req-${crypto.randomUUID()}`;
      }
    } catch (e) {
      // Fall through to the legacy scheme below.
    }
    return `req-${Date.now()}-${Math.random()}`;
  };

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
      window.dispatchEvent(new CustomEvent(EVENT_NAME.CLEANUP));
      // Acknowledge cleanup signal received, but don't hold the connection.
      sendResponse({ success: true });
      return true;
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
  // When the cleanup signal arrives, this bridge must also clean itself up.
  const cleanupHandler = () => {
    settleAllPending('Bridge was cleaned up before the MAIN world responded');
    chrome.runtime.onMessage.removeListener(messageHandler);
    window.removeEventListener(EVENT_NAME.RESPONSE, responseHandler);
    window.removeEventListener('pagehide', pagehideHandler);
    window.removeEventListener(EVENT_NAME.CLEANUP, cleanupHandler);
    delete window.__INJECT_SCRIPT_TOOL_UNIVERSAL_BRIDGE_LOADED__;
  };
  window.addEventListener(EVENT_NAME.CLEANUP, cleanupHandler);
})();
