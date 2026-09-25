var quickPanel = (function() {
	//#region ../../node_modules/.pnpm/wxt@0.20.27_@types+node@22._c13784526c76306bd4ecdeabada10fa4/node_modules/wxt/dist/utils/define-content-script.mjs
	function defineContentScript(definition) {
		return definition;
	}
	//#endregion
	//#region common/message-types.ts
	var BACKGROUND_MESSAGE_TYPES = {
		SWITCH_SEMANTIC_MODEL: "switch_semantic_model",
		GET_MODEL_STATUS: "get_model_status",
		UPDATE_MODEL_STATUS: "update_model_status",
		GET_STORAGE_STATS: "get_storage_stats",
		CLEAR_ALL_DATA: "clear_all_data",
		GET_SERVER_STATUS: "get_server_status",
		REFRESH_SERVER_STATUS: "refresh_server_status",
		SERVER_STATUS_CHANGED: "server_status_changed",
		INITIALIZE_SEMANTIC_ENGINE: "initialize_semantic_engine",
		RR_START_RECORDING: "rr_start_recording",
		RR_STOP_RECORDING: "rr_stop_recording",
		RR_PAUSE_RECORDING: "rr_pause_recording",
		RR_RESUME_RECORDING: "rr_resume_recording",
		RR_GET_RECORDING_STATUS: "rr_get_recording_status",
		RR_LIST_FLOWS: "rr_list_flows",
		RR_FLOWS_CHANGED: "rr_flows_changed",
		RR_GET_FLOW: "rr_get_flow",
		RR_DELETE_FLOW: "rr_delete_flow",
		RR_PUBLISH_FLOW: "rr_publish_flow",
		RR_UNPUBLISH_FLOW: "rr_unpublish_flow",
		RR_RUN_FLOW: "rr_run_flow",
		RR_SAVE_FLOW: "rr_save_flow",
		RR_EXPORT_FLOW: "rr_export_flow",
		RR_EXPORT_ALL: "rr_export_all",
		RR_IMPORT_FLOW: "rr_import_flow",
		RR_LIST_RUNS: "rr_list_runs",
		RR_LIST_TRIGGERS: "rr_list_triggers",
		RR_SAVE_TRIGGER: "rr_save_trigger",
		RR_DELETE_TRIGGER: "rr_delete_trigger",
		RR_REFRESH_TRIGGERS: "rr_refresh_triggers",
		RR_SCHEDULE_FLOW: "rr_schedule_flow",
		RR_UNSCHEDULE_FLOW: "rr_unschedule_flow",
		RR_LIST_SCHEDULES: "rr_list_schedules",
		ELEMENT_MARKER_LIST_ALL: "element_marker_list_all",
		ELEMENT_MARKER_LIST_FOR_URL: "element_marker_list_for_url",
		ELEMENT_MARKER_SAVE: "element_marker_save",
		ELEMENT_MARKER_UPDATE: "element_marker_update",
		ELEMENT_MARKER_DELETE: "element_marker_delete",
		ELEMENT_MARKER_VALIDATE: "element_marker_validate",
		ELEMENT_MARKER_START: "element_marker_start_from_popup",
		ELEMENT_PICKER_UI_EVENT: "element_picker_ui_event",
		ELEMENT_PICKER_FRAME_EVENT: "element_picker_frame_event",
		WEB_EDITOR_TOGGLE: "web_editor_toggle",
		WEB_EDITOR_APPLY: "web_editor_apply",
		WEB_EDITOR_STATUS_QUERY: "web_editor_status_query",
		WEB_EDITOR_APPLY_BATCH: "web_editor_apply_batch",
		WEB_EDITOR_TX_CHANGED: "web_editor_tx_changed",
		WEB_EDITOR_HIGHLIGHT_ELEMENT: "web_editor_highlight_element",
		WEB_EDITOR_REVERT_ELEMENT: "web_editor_revert_element",
		WEB_EDITOR_SELECTION_CHANGED: "web_editor_selection_changed",
		WEB_EDITOR_CLEAR_SELECTION: "web_editor_clear_selection",
		WEB_EDITOR_CANCEL_EXECUTION: "web_editor_cancel_execution",
		WEB_EDITOR_PROPS_REGISTER_EARLY_INJECTION: "web_editor_props_register_early_injection",
		WEB_EDITOR_OPEN_SOURCE: "web_editor_open_source",
		QUICK_PANEL_SEND_TO_AI: "quick_panel_send_to_ai",
		QUICK_PANEL_CANCEL_AI: "quick_panel_cancel_ai",
		QUICK_PANEL_TABS_QUERY: "quick_panel_tabs_query",
		QUICK_PANEL_TAB_ACTIVATE: "quick_panel_tab_activate",
		QUICK_PANEL_TAB_CLOSE: "quick_panel_tab_close"
	};
	var TOOL_MESSAGE_TYPES = {
		SCREENSHOT_PREPARE_PAGE_FOR_CAPTURE: "preparePageForCapture",
		SCREENSHOT_GET_PAGE_DETAILS: "getPageDetails",
		SCREENSHOT_GET_ELEMENT_DETAILS: "getElementDetails",
		SCREENSHOT_SCROLL_PAGE: "scrollPage",
		SCREENSHOT_RESET_PAGE_AFTER_CAPTURE: "resetPageAfterCapture",
		WEB_FETCHER_GET_HTML_CONTENT: "getHtmlContent",
		WEB_FETCHER_GET_TEXT_CONTENT: "getTextContent",
		CLICK_ELEMENT: "clickElement",
		FILL_ELEMENT: "fillElement",
		SIMULATE_KEYBOARD: "simulateKeyboard",
		GET_INTERACTIVE_ELEMENTS: "getInteractiveElements",
		GENERATE_ACCESSIBILITY_TREE: "generateAccessibilityTree",
		RESOLVE_REF: "resolveRef",
		ENSURE_REF_FOR_SELECTOR: "ensureRefForSelector",
		VERIFY_FINGERPRINT: "verifyFingerprint",
		DISPATCH_HOVER_FOR_REF: "dispatchHoverForRef",
		NETWORK_SEND_REQUEST: "sendPureNetworkRequest",
		WAIT_FOR_TEXT: "waitForText",
		SIMILARITY_ENGINE_INIT: "similarityEngineInit",
		SIMILARITY_ENGINE_COMPUTE_BATCH: "similarityEngineComputeBatch",
		RR_RECORDER_CONTROL: "rr_recorder_control",
		RR_RECORDER_EVENT: "rr_recorder_event",
		RR_TIMELINE_UPDATE: "rr_timeline_update",
		QUICK_PANEL_AI_EVENT: "quick_panel_ai_event",
		SET_DOM_TRIGGERS: "set_dom_triggers",
		DOM_TRIGGER_FIRED: "dom_trigger_fired",
		COLLECT_VARIABLES: "collectVariables",
		ELEMENT_MARKER_START: "element_marker_start",
		ELEMENT_PICKER_START: "elementPickerStart",
		ELEMENT_PICKER_STOP: "elementPickerStop",
		ELEMENT_PICKER_SET_ACTIVE_REQUEST: "elementPickerSetActiveRequest",
		ELEMENT_PICKER_UI_PING: "elementPickerUiPing",
		ELEMENT_PICKER_UI_SHOW: "elementPickerUiShow",
		ELEMENT_PICKER_UI_UPDATE: "elementPickerUiUpdate",
		ELEMENT_PICKER_UI_HIDE: "elementPickerUiHide"
	};
	//#endregion
	//#region \0@oxc-project+runtime@0.146.0/helpers/esm/typeof.js
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	//#endregion
	//#region \0@oxc-project+runtime@0.146.0/helpers/esm/toPrimitive.js
	function toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	//#endregion
	//#region \0@oxc-project+runtime@0.146.0/helpers/esm/toPropertyKey.js
	function toPropertyKey(t) {
		var i = toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	//#endregion
	//#region \0@oxc-project+runtime@0.146.0/helpers/esm/defineProperty.js
	function _defineProperty(e, r, t) {
		return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
			value: t,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = t, e;
	}
	//#endregion
	//#region \0@oxc-project+runtime@0.146.0/helpers/esm/asyncToGenerator.js
	function asyncGeneratorStep(n, t, e, r, o, a, c) {
		try {
			var i = n[a](c), u = i.value;
		} catch (n) {
			e(n);
			return;
		}
		i.done ? t(u) : Promise.resolve(u).then(r, o);
	}
	function _asyncToGenerator(n) {
		return function() {
			var t = this, e = arguments;
			return new Promise(function(r, o) {
				var a = n.apply(t, e);
				function _next(n) {
					asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
				}
				function _throw(n) {
					asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
				}
				_next(void 0);
			});
		};
	}
	//#endregion
	//#region shared/quick-panel/core/agent-bridge.ts
	var LOG_PREFIX$2 = "[QuickPanelAgentBridge]";
	var DEFAULT_MAX_BUFFERED_EVENTS = 200;
	/** Delay before cleaning up request state after terminal event (allows late subscribers) */
	var TERMINAL_CLEANUP_DELAY_MS = 3e4;
	/**
	* Bridge for Quick Panel to communicate with the background agent handler.
	*
	* Responsibilities:
	* 1. Send instructions to AI via background
	* 2. Receive and dispatch streaming events
	* 3. Buffer events for late-subscribing listeners
	* 4. Manage request lifecycle and cleanup
	*/
	var QuickPanelAgentBridge = class {
		constructor(options) {
			var _options$maxBufferedE;
			_defineProperty(
				this,
				/** Listeners organized by requestId */
				"listenersByRequestId",
				/* @__PURE__ */ new Map()
			);
			_defineProperty(
				this,
				/** Event buffer for handling race conditions where events arrive before listeners */
				"bufferByRequestId",
				/* @__PURE__ */ new Map()
			);
			_defineProperty(
				this,
				/** Pending cleanup timers for delayed terminal cleanup */
				"cleanupTimers",
				/* @__PURE__ */ new Map()
			);
			_defineProperty(
				this,
				/** Maximum events to buffer per request */
				"maxBufferedEvents",
				void 0
			);
			_defineProperty(
				this,
				/** Message handler bound to this instance */
				"boundMessageHandler",
				void 0
			);
			_defineProperty(
				this,
				/** Disposed state flag */
				"disposed",
				false
			);
			this.maxBufferedEvents = (_options$maxBufferedE = options === null || options === void 0 ? void 0 : options.maxBufferedEvents) !== null && _options$maxBufferedE !== void 0 ? _options$maxBufferedE : DEFAULT_MAX_BUFFERED_EVENTS;
			this.boundMessageHandler = this.handleMessage.bind(this);
			chrome.runtime.onMessage.addListener(this.boundMessageHandler);
		}
		/**
		* Clean up all resources and unregister listeners.
		* Should be called when Quick Panel is closing.
		*/
		dispose() {
			if (this.disposed) return;
			this.disposed = true;
			chrome.runtime.onMessage.removeListener(this.boundMessageHandler);
			this.listenersByRequestId.clear();
			this.bufferByRequestId.clear();
			for (const timer of this.cleanupTimers.values()) clearTimeout(timer);
			this.cleanupTimers.clear();
		}
		/**
		* Check if the bridge has been disposed.
		*/
		isDisposed() {
			return this.disposed;
		}
		/**
		* Subscribe to RealtimeEvents for a specific requestId.
		*
		* @param requestId - The request ID to subscribe to
		* @param listener - Callback function for events
		* @returns Unsubscribe function
		*
		* @remarks
		* Events that arrived before subscription are flushed immediately.
		* This handles the race condition where background sends events
		* before the UI has finished setting up listeners.
		*/
		onRequestEvent(requestId, listener) {
			if (this.disposed) {
				console.warn(`${LOG_PREFIX$2} Cannot subscribe - bridge is disposed`);
				return () => {};
			}
			const id = requestId.trim();
			if (!id) {
				console.warn(`${LOG_PREFIX$2} Invalid requestId`);
				return () => {};
			}
			let listeners = this.listenersByRequestId.get(id);
			if (!listeners) {
				listeners = /* @__PURE__ */ new Set();
				this.listenersByRequestId.set(id, listeners);
			}
			listeners.add(listener);
			const buffer = this.bufferByRequestId.get(id);
			if (buffer && buffer.length > 0) {
				for (const event of buffer) this.safeInvokeListener(listener, event);
				this.bufferByRequestId.delete(id);
			}
			return () => {
				const set = this.listenersByRequestId.get(id);
				if (!set) return;
				set.delete(listener);
				if (set.size === 0) this.listenersByRequestId.delete(id);
			};
		}
		/**
		* Send a new instruction to the selected AgentChat session.
		*
		* The background layer will:
		* 1. Read the selected session ID
		* 2. Open SSE subscription
		* 3. POST /act to start the request
		* 4. Stream events back via QUICK_PANEL_AI_EVENT
		*
		* @param payload - The instruction and optional context
		* @returns Promise resolving to success with requestId/sessionId, or failure with error
		*/
		sendToAI(payload) {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (_this.disposed) return {
					success: false,
					error: "Bridge is disposed"
				};
				try {
					return yield chrome.runtime.sendMessage({
						type: BACKGROUND_MESSAGE_TYPES.QUICK_PANEL_SEND_TO_AI,
						payload
					});
				} catch (err) {
					return {
						success: false,
						error: (err instanceof Error ? err.message : String(err)) || "Failed to send message"
					};
				}
			})();
		}
		/**
		* Cancel an active AI request.
		*
		* @param requestId - The request ID to cancel
		* @param sessionId - Optional session ID for fallback (useful if background state was lost)
		* @returns Promise resolving to success or failure
		*
		* @remarks
		* Prefer passing sessionId when available for resilience against
		* MV3 Service Worker restarts that may clear background state.
		*/
		cancelRequest(requestId, sessionId) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				if (_this2.disposed) return {
					success: false,
					error: "Bridge is disposed"
				};
				try {
					return yield chrome.runtime.sendMessage({
						type: BACKGROUND_MESSAGE_TYPES.QUICK_PANEL_CANCEL_AI,
						payload: {
							requestId,
							sessionId
						}
					});
				} catch (err) {
					return {
						success: false,
						error: (err instanceof Error ? err.message : String(err)) || "Failed to cancel request"
					};
				}
			})();
		}
		/**
		* Check if there are active listeners for a request.
		* Useful for determining if UI is still interested in events.
		*/
		hasListeners(requestId) {
			const listeners = this.listenersByRequestId.get(requestId);
			return listeners !== void 0 && listeners.size > 0;
		}
		/**
		* Get the number of active requests being tracked.
		* Useful for debugging and monitoring.
		*/
		getActiveRequestCount() {
			return this.listenersByRequestId.size + this.bufferByRequestId.size;
		}
		/**
		* Handle incoming messages from background.
		*/
		handleMessage(message) {
			if (this.disposed) return;
			const msg = message;
			if (!msg || msg.action !== TOOL_MESSAGE_TYPES.QUICK_PANEL_AI_EVENT) return;
			const requestId = typeof msg.requestId === "string" ? msg.requestId : "";
			const event = msg.event;
			if (!requestId || !event) return;
			const listeners = this.listenersByRequestId.get(requestId);
			if (listeners && listeners.size > 0) for (const listener of listeners) this.safeInvokeListener(listener, event);
			else this.bufferEvent(requestId, event);
			if (this.isTerminalEvent(event, requestId)) this.scheduleDelayedCleanup(requestId);
		}
		/**
		* Safely invoke a listener, catching and logging any errors.
		*/
		safeInvokeListener(listener, event) {
			try {
				listener(event);
			} catch (err) {
				console.warn(`${LOG_PREFIX$2} Listener error:`, err);
			}
		}
		/**
		* Buffer an event for a request that doesn't have listeners yet.
		*/
		bufferEvent(requestId, event) {
			let buffer = this.bufferByRequestId.get(requestId);
			if (!buffer) {
				buffer = [];
				this.bufferByRequestId.set(requestId, buffer);
			}
			buffer.push(event);
			if (buffer.length > this.maxBufferedEvents) buffer.splice(0, buffer.length - this.maxBufferedEvents);
		}
		/**
		* Check if an event represents a terminal state for the request.
		*
		* Terminal events include:
		* - status events with terminal status (completed, error, cancelled)
		* - error events (type: 'error')
		*/
		isTerminalEvent(event, requestId) {
			if (event.type === "error") return true;
			if (event.type === "status") {
				const data = event.data;
				if ((data === null || data === void 0 ? void 0 : data.requestId) !== requestId) return false;
				const status = data.status;
				return status === "completed" || status === "error" || status === "cancelled";
			}
			return false;
		}
		/**
		* Clean up all state associated with a request.
		* Called after delay to allow late subscribers to receive terminal events.
		*/
		cleanupRequest(requestId) {
			const existingTimer = this.cleanupTimers.get(requestId);
			if (existingTimer) {
				clearTimeout(existingTimer);
				this.cleanupTimers.delete(requestId);
			}
			this.bufferByRequestId.delete(requestId);
			this.listenersByRequestId.delete(requestId);
		}
		/**
		* Schedule delayed cleanup for a request after terminal event.
		* This allows late subscribers to still receive the terminal event.
		*/
		scheduleDelayedCleanup(requestId) {
			if (this.cleanupTimers.has(requestId)) return;
			const timer = setTimeout(() => {
				this.cleanupTimers.delete(requestId);
				this.cleanupRequest(requestId);
			}, TERMINAL_CLEANUP_DELAY_MS);
			this.cleanupTimers.set(requestId, timer);
		}
	};
	/**
	* Create a new agent bridge instance.
	* Prefer creating a single instance per Quick Panel lifecycle.
	*/
	function createAgentBridge(options) {
		return new QuickPanelAgentBridge(options);
	}
	//#endregion
	//#region entrypoints/web-editor-v2/utils/disposables.ts
	/**
	* Manages a collection of disposable resources.
	* Resources are disposed in reverse order (LIFO).
	*/
	var Disposer = class {
		constructor() {
			_defineProperty(this, "disposed", false);
			_defineProperty(this, "disposers", []);
		}
		/** Whether this disposer has already been disposed */
		get isDisposed() {
			return this.disposed;
		}
		/**
		* Add a dispose function to be called during cleanup.
		* If already disposed, the function is called immediately.
		*/
		add(dispose) {
			if (this.disposed) {
				try {
					dispose();
				} catch (_unused) {}
				return;
			}
			this.disposers.push(dispose);
		}
		listen(target, type, listener, options) {
			target.addEventListener(type, listener, options);
			this.add(() => target.removeEventListener(type, listener, options));
		}
		/**
		* Add a ResizeObserver and automatically disconnect it on dispose.
		*/
		observeResize(target, callback, options) {
			const observer = new ResizeObserver(callback);
			observer.observe(target, options);
			this.add(() => observer.disconnect());
			return observer;
		}
		/**
		* Add a MutationObserver and automatically disconnect it on dispose.
		*/
		observeMutation(target, callback, options) {
			const observer = new MutationObserver(callback);
			observer.observe(target, options);
			this.add(() => observer.disconnect());
			return observer;
		}
		/**
		* Add a requestAnimationFrame and automatically cancel it on dispose.
		* Returns a function to manually cancel the frame.
		*/
		requestAnimationFrame(callback) {
			const id = requestAnimationFrame(callback);
			let cancelled = false;
			const cancel = () => {
				if (cancelled) return;
				cancelled = true;
				cancelAnimationFrame(id);
			};
			this.add(cancel);
			return cancel;
		}
		/**
		* Dispose all registered resources in reverse order.
		* Safe to call multiple times.
		*/
		dispose() {
			if (this.disposed) return;
			this.disposed = true;
			for (let i = this.disposers.length - 1; i >= 0; i--) try {
				this.disposers[i]();
			} catch (_unused2) {}
			this.disposers.length = 0;
		}
	};
	//#endregion
	//#region shared/quick-panel/ui/styles.ts
	/**
	* Quick Panel AI Chat Styles
	*
	* This stylesheet is injected into the Quick Panel's Shadow DOM (content script).
	* It intentionally reuses AgentChat token names (--ac-*) to maintain visual consistency
	* with the sidepanel AgentChat component.
	*
	* Design System:
	* - Source of truth: app/chrome-extension/entrypoints/sidepanel/styles/agent-chat.css
	* - This file extracts a minimal token + utility subset for content script use
	* - Liquid Glass styling follows quick-panel-prd.md V6 spec
	*
	* Note: Content Script Shadow DOM cannot directly import sidepanel CSS (not web_accessible).
	* We maintain a synced subset here to balance visual consistency with bundle size.
	*/
	var QUICK_PANEL_STYLES = `
  /* ============================================================
   * Reset & Box Sizing
   * ============================================================ */

  :host {
    all: initial;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  [hidden] {
    display: none !important;
  }

  /* ============================================================
   * Root Container & Theme Tokens
   * Subset of AgentChat tokens for Quick Panel use
   * ============================================================ */

  .qp-root {
    position: fixed;
    inset: 0;
    pointer-events: none;
    font-family: var(--ac-font-body, ui-sans-serif, system-ui);
    color: var(--ac-text, #111827);
    line-height: 1.4;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .qp-root.agent-theme {
    /* ===========================================
     * Font Stacks
     * =========================================== */
    --ac-font-sans:
      'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial,
      'Apple Color Emoji', 'Segoe UI Emoji';
    --ac-font-serif: 'Newsreader', ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
    --ac-font-mono:
      'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
      'Courier New', monospace;
    --ac-font-grotesk:
      'Space Grotesk', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial;

    --ac-font-body: var(--ac-font-sans);
    --ac-font-heading: var(--ac-font-serif);
    --ac-font-code: var(--ac-font-mono);

    /* ===========================================
     * Geometry & Spacing
     * =========================================== */
    --ac-border-width: 1px;
    --ac-border-width-strong: 2px;
    --ac-radius-container: 0px;
    --ac-radius-card: 12px;
    --ac-radius-inner: 8px;
    --ac-radius-button: 8px;

    /* ===========================================
     * Motion
     * =========================================== */
    --ac-motion-fast: 120ms;
    --ac-motion-normal: 180ms;

    /* ===========================================
     * Warm Editorial Theme (Default)
     * =========================================== */
    --ac-bg: transparent;
    --ac-bg-pattern: none;
    --ac-bg-pattern-size: 16px 16px;

    --ac-header-bg: rgba(253, 252, 248, 0.95);
    --ac-header-border: rgba(245, 245, 244, 0.5);

    --ac-surface: #ffffff;
    --ac-surface-muted: #f2f0eb;
    --ac-surface-inset: #f2f0eb;

    --ac-text: #1a1a1a;
    --ac-text-muted: #6e6e6e;
    --ac-text-subtle: #a8a29e;
    --ac-text-inverse: #ffffff;
    --ac-text-placeholder: #a8a29e;

    --ac-border: #e7e5e4;
    --ac-border-strong: #d6d3d1;

    --ac-hover-bg: #f5f5f4;
    --ac-hover-bg-subtle: #fafaf9;

    --ac-accent: #d97757;
    --ac-accent-hover: #c4664a;
    --ac-accent-subtle: rgba(217, 119, 87, 0.12);
    --ac-accent-contrast: #ffffff;

    --ac-link: var(--ac-accent);
    --ac-link-hover: var(--ac-accent-hover);

    --ac-selection-bg: #ffedd5;
    --ac-selection-text: #7c2d12;

    --ac-shadow-card: 0 1px 3px rgba(0, 0, 0, 0.08);
    --ac-shadow-float: 0 4px 20px -2px rgba(0, 0, 0, 0.05);

    --ac-focus-ring: rgba(214, 211, 209, 0.9);

    --ac-timeline-node-pulse-shadow:
      0 0 0 2px rgba(217, 119, 87, 0.25), 0 0 12px rgba(217, 119, 87, 0.2);

    /* Status Colors */
    --ac-success: #22c55e;
    --ac-warning: #f59e0b;
    --ac-danger: #ef4444;

    /* Scrollbar */
    --ac-scrollbar-size: 4px;
    --ac-scrollbar-thumb: rgba(0, 0, 0, 0.25);
    --ac-scrollbar-thumb-hover: rgba(0, 0, 0, 0.4);

    /* ===========================================
     * Quick Panel Solid Tokens (Editorial Style)
     * No glassmorphism - solid backgrounds for clarity
     * =========================================== */
    --qp-panel-bg: var(--ac-surface);
    --qp-panel-border: var(--ac-border);
    --qp-panel-shadow: var(--ac-shadow-card), 0 25px 50px -12px rgba(0, 0, 0, 0.15);
    --qp-divider: var(--ac-border);
    --qp-input-bg: var(--ac-surface);
    --qp-input-border: var(--ac-border);
  }

  /* ===========================================
   * Dark Console Theme
   * =========================================== */
  .qp-root.agent-theme[data-agent-theme='dark-console'] {
    --ac-font-body: var(--ac-font-mono);
    --ac-font-heading: var(--ac-font-mono);
    --ac-font-code: var(--ac-font-mono);

    --ac-surface: #0f1117;
    --ac-surface-muted: #0a0c10;
    --ac-surface-inset: #1a1d26;

    --ac-text: #e5e7eb;
    --ac-text-muted: #9ca3af;
    --ac-text-subtle: #6b7280;
    --ac-text-inverse: #0a0c10;
    --ac-text-placeholder: #4b5563;

    --ac-border: #1f2937;
    --ac-border-strong: #374151;

    --ac-hover-bg: rgba(255, 255, 255, 0.06);
    --ac-hover-bg-subtle: rgba(255, 255, 255, 0.04);

    --ac-accent: #d97757;
    --ac-accent-hover: #e8956f;
    --ac-accent-subtle: rgba(217, 119, 87, 0.18);
    --ac-accent-contrast: #ffffff;

    --ac-focus-ring: rgba(217, 119, 87, 0.4);
    --ac-timeline-node-pulse-shadow:
      0 0 0 2px rgba(217, 119, 87, 0.35), 0 0 14px rgba(217, 119, 87, 0.25);

    --ac-scrollbar-thumb: rgba(255, 255, 255, 0.12);
    --ac-scrollbar-thumb-hover: rgba(255, 255, 255, 0.22);

    --qp-panel-bg: var(--ac-surface);
    --qp-panel-border: var(--ac-border);
    --qp-panel-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    --qp-divider: var(--ac-border);
    --qp-input-bg: var(--ac-surface-inset);
    --qp-input-border: var(--ac-border);
  }

  .qp-root ::selection {
    background: var(--ac-selection-bg);
    color: var(--ac-selection-text);
  }

  /* ============================================================
   * Utility Classes (AgentChat Subset)
   * ============================================================ */

  /* Scrollbar Styling */
  .qp-root .ac-scroll {
    scrollbar-width: thin;
    scrollbar-color: var(--ac-scrollbar-thumb) transparent;
  }

  .qp-root .ac-scroll::-webkit-scrollbar {
    width: var(--ac-scrollbar-size);
    height: var(--ac-scrollbar-size);
  }

  .qp-root .ac-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .qp-root .ac-scroll::-webkit-scrollbar-thumb {
    background-color: var(--ac-scrollbar-thumb);
    border-radius: 999px;
  }

  .qp-root .ac-scroll::-webkit-scrollbar-thumb:hover {
    background-color: var(--ac-scrollbar-thumb-hover);
  }

  /* Focus Ring */
  .qp-root .ac-focus-ring:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--ac-focus-ring);
  }

  /* Button Base */
  .qp-root .ac-btn {
    transition:
      background-color var(--ac-motion-fast),
      color var(--ac-motion-fast);
  }

  .qp-root .ac-btn:hover {
    background-color: var(--ac-hover-bg);
  }

  /* Pulse Animation (Streaming Indicator) */
  @keyframes ac-pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .qp-root .ac-pulse {
    animation: ac-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .qp-root .ac-pulse {
      animation: none;
    }
  }

  /* Text Shimmer (Streaming Status) */
  .qp-root .text-shimmer {
    background: linear-gradient(
      90deg,
      var(--ac-accent, #d97757) 0%,
      var(--ac-accent-hover, #ffcab0) 50%,
      var(--ac-accent, #d97757) 100%
    );
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: ac-shimmer 3s linear infinite;
  }

  @keyframes ac-shimmer {
    to {
      background-position: 200% center;
    }
  }

  /* ============================================================
   * Liquid Glass Panel (PRD V6)
   * ============================================================ */

  .qp-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    pointer-events: auto;
  }

  .qp-panel {
    width: min(760px, calc(100vw - 48px));
    max-height: min(720px, calc(100vh - 48px));
    display: flex;
    flex-direction: column;
    border-radius: 24px;
    overflow: hidden;
    pointer-events: auto;

    background: var(--qp-panel-bg);
    border: var(--ac-border-width) solid var(--qp-panel-border);
    box-shadow: var(--qp-panel-shadow);
  }

  /* ============================================================
   * AI Chat Layout Components
   * ============================================================ */

  /* Header */
  .qp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    border-bottom: var(--ac-border-width) solid var(--qp-divider);
  }

  .qp-header-left {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .qp-brand {
    width: 34px;
    height: 34px;
    border-radius: var(--ac-radius-inner);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--ac-accent-subtle);
    color: var(--ac-accent);
    font-size: 24px;
  }

  .qp-title {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .qp-title-name {
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.2px;
    color: var(--ac-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .qp-title-sub {
    font-size: 11px;
    color: var(--ac-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .qp-header-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: none;
  }

  .qp-stream-indicator {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--ac-text-muted);
    user-select: none;
  }

  .qp-stream-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--ac-accent);
    box-shadow: var(--ac-timeline-node-pulse-shadow);
  }

  /* Buttons */
  .qp-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: var(--ac-border-width) solid var(--qp-divider);
    background: var(--ac-hover-bg);
    color: var(--ac-text);
    border-radius: var(--ac-radius-button);
    padding: 8px 10px;
    font-size: 11px;
    cursor: pointer;
    user-select: none;
    font-family: inherit;
    transition: background-color var(--ac-motion-fast);
  }

  .qp-btn:hover:not(:disabled) {
    background: var(--ac-hover-bg-subtle);
  }

  .qp-btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .qp-btn--primary {
    background: var(--ac-accent);
    border-color: var(--ac-accent);
    color: var(--ac-accent-contrast);
  }

  .qp-btn--primary:hover:not(:disabled) {
    background: var(--ac-accent-hover);
  }

  .qp-btn--danger {
    background: var(--ac-danger);
    border-color: var(--ac-danger);
    color: #ffffff;
  }

  /* Content Area */
  .qp-content {
    flex: 1;
    overflow: auto;
    padding: 14px;
    min-height: 0;
  }

  .qp-messages {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* Message Bubbles */
  .qp-msg {
    display: flex;
    gap: 10px;
  }

  .qp-msg--user {
    justify-content: flex-end;
  }

  .qp-msg--assistant {
    justify-content: flex-start;
  }

  .qp-bubble {
    max-width: 90%;
    border-radius: var(--ac-radius-card);
    border: var(--ac-border-width) solid var(--ac-border);
    box-shadow: var(--ac-shadow-card);
    padding: 10px 12px;
    background: var(--ac-surface);
  }

  .qp-bubble--user {
    background: color-mix(in srgb, var(--ac-accent-subtle) 80%, transparent);
    border-color: color-mix(in srgb, var(--ac-border) 70%, transparent);
  }

  .qp-msg-text {
    font-size: 13px;
    white-space: pre-wrap;
    word-break: break-word;
    color: var(--ac-text);
  }

  .qp-msg-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-top: 6px;
    font-size: 10px;
    color: var(--ac-text-subtle);
  }

  .qp-msg-meta code {
    font-family: var(--ac-font-code);
    font-size: 10px;
  }

  .qp-msg-stream-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--ac-accent);
    box-shadow: var(--ac-timeline-node-pulse-shadow);
    flex: none;
  }

  /* Status Indicators */
  .qp-status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 999px;
    border: var(--ac-border-width) solid var(--ac-border);
    background: var(--ac-surface-muted);
    color: var(--ac-text-muted);
    font-size: 11px;
    user-select: none;
    align-self: center;
  }

  .qp-status--error {
    border-color: color-mix(in srgb, var(--ac-danger) 55%, var(--ac-border));
    color: var(--ac-danger);
    background: color-mix(in srgb, var(--ac-danger) 12%, transparent);
  }

  .qp-status--success {
    border-color: color-mix(in srgb, var(--ac-success) 55%, var(--ac-border));
    color: color-mix(in srgb, var(--ac-success) 85%, var(--ac-text));
    background: color-mix(in srgb, var(--ac-success) 10%, transparent);
  }

  .qp-status--warning {
    border-color: color-mix(in srgb, var(--ac-warning) 55%, var(--ac-border));
    color: color-mix(in srgb, var(--ac-warning) 85%, var(--ac-text));
    background: color-mix(in srgb, var(--ac-warning) 10%, transparent);
  }

  /* Composer */
  .qp-composer {
    padding: 12px 14px;
    border-top: 1px solid var(--qp-divider);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .qp-textarea {
    width: 100%;
    min-height: 42px;
    max-height: 160px;
    resize: none;
    padding: 10px 10px;
    border-radius: var(--ac-radius-card);
    border: 1px solid var(--qp-input-border);
    background: var(--qp-input-bg);
    color: var(--ac-text);
    font-family: var(--ac-font-body);
    font-size: 13px;
    line-height: 1.35;
    outline: none;
  }

  .qp-textarea::placeholder {
    color: var(--ac-text-placeholder);
  }

  .qp-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .qp-actions-left {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 11px;
    color: var(--ac-text-subtle);
    user-select: none;
  }

  .qp-actions-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .qp-kbd {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: var(--ac-border-width) solid var(--qp-divider);
    background: var(--ac-surface-muted);
    padding: 4px 8px;
    border-radius: 999px;
    font-family: var(--ac-font-code);
    font-size: 10px;
    color: var(--ac-text-muted);
  }

  /* Empty State */
  .qp-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 40px 20px;
    text-align: center;
    color: var(--ac-text-muted);
  }

  .qp-empty-icon {
    font-size: 32px;
    opacity: 0.6;
  }

  .qp-empty-text {
    font-size: 13px;
    line-height: 1.5;
  }

  /* ============================================================
   * Search UI (Phase 1)
   * ============================================================ */

  /* Search Input Container */
  .qp-search {
    min-width: 0;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* Scope Chip */
  .qp-scope-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--qp-divider);
    background: rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    padding: 6px 10px;
    color: var(--ac-text);
    font-family: var(--ac-font-body);
    font-size: 12px;
    cursor: pointer;
    user-select: none;
    flex: none;
    transition: background-color var(--ac-motion-fast);
  }

  .qp-scope-chip:hover {
    background: rgba(255, 255, 255, 0.18);
  }

  .qp-scope-chip__icon {
    font-size: 12px;
    line-height: 1;
  }

  .qp-scope-chip__label {
    font-weight: 600;
    letter-spacing: 0.2px;
    white-space: nowrap;
  }

  .qp-scope-chip__prefix {
    font-family: var(--ac-font-code);
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 999px;
    border: 1px solid var(--qp-divider);
    background: rgba(255, 255, 255, 0.1);
    color: var(--ac-text-muted);
  }

  /* Search Input */
  .qp-search-input {
    flex: 1;
    min-width: 0;
    height: 38px;
    padding: 0 12px;
    border-radius: var(--ac-radius-card);
    border: 1px solid var(--qp-input-border);
    background: var(--qp-input-bg);
    color: var(--ac-text);
    font-family: var(--ac-font-body);
    font-size: 14px;
    line-height: 1.2;
    outline: none;
    transition: border-color var(--ac-motion-fast);
  }

  .qp-search-input:focus {
    border-color: var(--ac-accent);
  }

  .qp-search-input::placeholder {
    color: var(--ac-text-placeholder);
  }

  /* Icon Button (Clear, Close, Action, etc.) */
  .qp-icon-btn {
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: var(--ac-border-width) solid var(--qp-divider);
    background: transparent;
    color: var(--ac-text-muted);
    border-radius: var(--ac-radius-button);
    cursor: pointer;
    user-select: none;
    flex: none;
    transition: background-color var(--ac-motion-fast), color var(--ac-motion-fast), border-color var(--ac-motion-fast);
  }

  .qp-icon-btn:hover:not(:disabled) {
    background: var(--ac-hover-bg);
    color: var(--ac-text);
  }

  .qp-icon-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .qp-icon-btn svg {
    width: 16px;
    height: 16px;
  }

  /* Action button variant (send/stop) */
  .qp-icon-btn--action {
    width: 32px;
    height: 32px;
  }

  .qp-icon-btn--action svg {
    width: 16px;
    height: 16px;
  }

  .qp-icon-btn--primary {
    background: var(--ac-accent);
    border-color: var(--ac-accent);
    color: var(--ac-accent-contrast);
  }

  .qp-icon-btn--primary:hover:not(:disabled) {
    background: var(--ac-accent-hover);
    border-color: var(--ac-accent-hover);
    color: var(--ac-accent-contrast);
  }

  .qp-icon-btn--danger {
    background: var(--ac-danger);
    border-color: var(--ac-danger);
    color: #ffffff;
  }

  .qp-icon-btn--danger:hover:not(:disabled) {
    background: color-mix(in srgb, var(--ac-danger) 85%, #000);
    color: #ffffff;
  }

  /* Quick Entries Grid */
  .qp-entries {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    padding: 10px 2px;
  }

  .qp-entry {
    border: var(--ac-border-width) solid var(--qp-divider);
    background: var(--ac-surface);
    border-radius: var(--ac-radius-card);
    padding: 14px 10px;
    cursor: pointer;
    user-select: none;
    color: var(--ac-text);
    font-family: var(--ac-font-body);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    transition:
      background-color var(--ac-motion-fast),
      border-color var(--ac-motion-fast),
      box-shadow var(--ac-motion-fast);
  }

  .qp-entry:hover {
    background: var(--ac-hover-bg);
    box-shadow: var(--ac-shadow-card);
  }

  .qp-entry:active {
    box-shadow: none;
  }

  .qp-entry:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .qp-entry[data-active='true'] {
    border-color: var(--ac-accent);
    background: var(--ac-accent-subtle);
  }

  .qp-entry__icon {
    width: 40px;
    height: 40px;
    border-radius: var(--ac-radius-inner);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--ac-surface-muted);
    border: var(--ac-border-width) solid var(--qp-divider);
    font-size: 16px;
  }

  .qp-entry__label {
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.2px;
  }

  .qp-entry__prefix {
    font-family: var(--ac-font-code);
    font-size: 10px;
    color: var(--ac-text-muted);
    border: var(--ac-border-width) solid var(--qp-divider);
    border-radius: 999px;
    padding: 2px 8px;
    background: var(--ac-surface-muted);
  }

  /* View Mount Points */
  .qp-header-mount,
  .qp-header-right-mount,
  .qp-content-mount,
  .qp-footer-mount {
    display: contents;
  }

  .qp-header-mount[hidden],
  .qp-header-right-mount[hidden],
  .qp-content-mount[hidden],
  .qp-footer-mount[hidden] {
    display: none;
  }

  /* Footer Hints */
  .qp-footer-hints {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 8px 0;
    font-size: 11px;
    color: var(--ac-text-muted);
  }

  .qp-footer-hint {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  /* ============================================================
   * Markdown Content Styles (for markstream-vue)
   * ============================================================ */

  .qp-markdown-content {
    font-size: 13px;
    line-height: 1.5;
    color: var(--ac-text);
  }

  .qp-markdown-content pre {
    background-color: var(--ac-surface-muted);
    border: var(--ac-border-width) solid var(--ac-border);
    border-radius: var(--ac-radius-inner);
    padding: 12px;
    overflow-x: auto;
    margin: 0.5em 0;
  }

  .qp-markdown-content code {
    font-family: var(--ac-font-code);
    font-size: 0.875em;
    color: var(--ac-text);
  }

  .qp-markdown-content :not(pre) > code {
    background-color: var(--ac-surface-muted);
    padding: 0.125em 0.25em;
    border-radius: 4px;
  }

  .qp-markdown-content p {
    margin: 0.5em 0;
  }

  .qp-markdown-content p:first-child {
    margin-top: 0;
  }

  .qp-markdown-content p:last-child {
    margin-bottom: 0;
  }

  .qp-markdown-content ul,
  .qp-markdown-content ol {
    margin: 0.5em 0;
    padding-left: 1.5em;
  }

  .qp-markdown-content li {
    margin: 0.25em 0;
  }

  .qp-markdown-content h1,
  .qp-markdown-content h2,
  .qp-markdown-content h3,
  .qp-markdown-content h4,
  .qp-markdown-content h5,
  .qp-markdown-content h6 {
    margin: 0.75em 0 0.5em;
    font-weight: 600;
    line-height: 1.3;
  }

  .qp-markdown-content h1 { font-size: 1.5em; }
  .qp-markdown-content h2 { font-size: 1.3em; }
  .qp-markdown-content h3 { font-size: 1.15em; }
  .qp-markdown-content h4 { font-size: 1em; }

  .qp-markdown-content blockquote {
    border-left: 3px solid var(--ac-border-strong);
    padding-left: 1em;
    margin: 0.5em 0;
    color: var(--ac-text-muted);
  }

  .qp-markdown-content a {
    color: var(--ac-link);
    text-decoration: underline;
  }

  .qp-markdown-content a:hover {
    color: var(--ac-link-hover);
  }

  .qp-markdown-content table {
    border-collapse: collapse;
    margin: 0.5em 0;
    width: 100%;
    font-size: 0.9em;
  }

  .qp-markdown-content th,
  .qp-markdown-content td {
    border: var(--ac-border-width) solid var(--ac-border);
    padding: 0.5em;
    text-align: left;
  }

  .qp-markdown-content th {
    background-color: var(--ac-surface-muted);
    font-weight: 600;
  }

  .qp-markdown-content hr {
    border: none;
    border-top: var(--ac-border-width) solid var(--ac-border);
    margin: 1em 0;
  }

  .qp-markdown-content img {
    max-width: 100%;
    height: auto;
    border-radius: var(--ac-radius-inner);
  }

  .qp-markdown-content strong {
    font-weight: 600;
  }

  .qp-markdown-content em {
    font-style: italic;
  }
`;
	//#endregion
	//#region shared/quick-panel/ui/shadow-host.ts
	/**
	* Quick Panel Shadow Host
	*
	* Creates an isolated Shadow DOM container for the Quick Panel AI Chat UI.
	* This module runs in a content script context and provides:
	*
	* - Style isolation via Shadow DOM (no CSS bleed in/out)
	* - Event isolation (UI events don't bubble to the host page)
	* - Theme synchronization with AgentChat (via chrome.storage)
	*
	* Architecture:
	* - Host element attached to documentElement with highest z-index
	* - Shadow root contains styles + UI container
	* - Theme is synced from chrome.storage.local['agentTheme']
	*/
	var DEFAULT_HOST_ID = "__mcp_quick_panel_host__";
	var UI_CONTAINER_ID = "__mcp_quick_panel_ui__";
	var ROOT_ID = "__mcp_quick_panel_root__";
	/** Highest possible z-index to ensure Quick Panel is on top */
	var DEFAULT_Z_INDEX = 2147483647;
	/** Storage key for AgentChat theme (owned by sidepanel) */
	var THEME_STORAGE_KEY = "agentTheme";
	/** Default theme if none is set */
	var DEFAULT_THEME_ID = "warm-editorial";
	/** Dark theme ID for dark mode */
	var DARK_THEME_ID = "dark-console";
	/** Valid theme IDs (subset supported by Quick Panel) */
	var VALID_THEME_IDS = /* @__PURE__ */ new Set([
		"warm-editorial",
		"blueprint-architect",
		"zen-journal",
		"neo-pop",
		"dark-console",
		"swiss-grid"
	]);
	/** Light theme IDs that should switch to dark in dark mode */
	var LIGHT_THEME_IDS = /* @__PURE__ */ new Set([
		"warm-editorial",
		"blueprint-architect",
		"zen-journal",
		"neo-pop",
		"swiss-grid"
	]);
	/** Events to stop from propagating to the host page */
	var BLOCKED_EVENT_TYPES = [
		"pointerdown",
		"pointerup",
		"pointermove",
		"pointerenter",
		"pointerleave",
		"pointercancel",
		"mousedown",
		"mouseup",
		"mousemove",
		"mouseenter",
		"mouseleave",
		"click",
		"dblclick",
		"contextmenu",
		"keydown",
		"keyup",
		"keypress",
		"touchstart",
		"touchmove",
		"touchend",
		"touchcancel",
		"wheel",
		"focus",
		"blur",
		"input",
		"change"
	];
	/**
	* Set a CSS property with !important to override page styles.
	*/
	function setImportantStyle(element, property, value) {
		element.style.setProperty(property, value, "important");
	}
	/**
	* Normalize and validate a theme ID.
	*/
	function normalizeThemeId(value) {
		if (typeof value !== "string") return DEFAULT_THEME_ID;
		const trimmed = value.trim();
		return VALID_THEME_IDS.has(trimmed) ? trimmed : DEFAULT_THEME_ID;
	}
	/**
	* Check if system prefers dark mode.
	*/
	function systemPrefersDark() {
		try {
			var _globalThis$matchMedi, _globalThis$matchMedi2, _globalThis;
			return (_globalThis$matchMedi = (_globalThis$matchMedi2 = (_globalThis = globalThis).matchMedia) === null || _globalThis$matchMedi2 === void 0 ? void 0 : _globalThis$matchMedi2.call(_globalThis, "(prefers-color-scheme: dark)").matches) !== null && _globalThis$matchMedi !== void 0 ? _globalThis$matchMedi : false;
		} catch (_unused) {
			return false;
		}
	}
	/**
	* Get effective theme ID considering system dark mode preference.
	* If system is in dark mode and the theme is a light theme, switch to dark-console.
	*/
	function getEffectiveThemeId(baseThemeId) {
		if (systemPrefersDark() && LIGHT_THEME_IDS.has(baseThemeId)) return DARK_THEME_ID;
		return baseThemeId;
	}
	/**
	* Read the stored theme ID from chrome.storage.
	*/
	function readStoredThemeId() {
		return _readStoredThemeId.apply(this, arguments);
	}
	function _readStoredThemeId() {
		_readStoredThemeId = _asyncToGenerator(function* () {
			try {
				var _chrome;
				if (!((_chrome = chrome) === null || _chrome === void 0 || (_chrome = _chrome.storage) === null || _chrome === void 0 ? void 0 : _chrome.local)) return DEFAULT_THEME_ID;
				return normalizeThemeId((yield chrome.storage.local.get(THEME_STORAGE_KEY))[THEME_STORAGE_KEY]);
			} catch (_unused2) {
				return DEFAULT_THEME_ID;
			}
		});
		return _readStoredThemeId.apply(this, arguments);
	}
	/**
	* Apply a theme ID to the root element, considering system dark mode preference.
	*/
	function applyThemeId(root, themeId) {
		const effectiveTheme = getEffectiveThemeId(normalizeThemeId(themeId));
		root.dataset.agentTheme = effectiveTheme;
	}
	/**
	* Mount the Quick Panel Shadow DOM host.
	*
	* @param options - Configuration options
	* @returns Manager interface for the shadow host
	*
	* @example
	* ```typescript
	* const shadowHost = mountQuickPanelShadowHost();
	* const elements = shadowHost.getElements();
	*
	* if (elements) {
	*   // Mount UI into elements.root
	*   mountQuickPanelAiChatPanel({
	*     mount: elements.root,
	*     agentBridge,
	*   });
	* }
	*
	* // Cleanup when done
	* shadowHost.dispose();
	* ```
	*/
	function mountQuickPanelShadowHost(options = {}) {
		var _options$hostId, _options$zIndex, _document$documentEle;
		const disposer = new Disposer();
		let elements = null;
		const hostId = (_options$hostId = options.hostId) !== null && _options$hostId !== void 0 ? _options$hostId : DEFAULT_HOST_ID;
		const zIndex = (_options$zIndex = options.zIndex) !== null && _options$zIndex !== void 0 ? _options$zIndex : DEFAULT_Z_INDEX;
		const existing = document.getElementById(hostId);
		if (existing) try {
			existing.remove();
		} catch (_unused3) {}
		const host = document.createElement("div");
		host.id = hostId;
		host.setAttribute("data-mcp-quick-panel", "true");
		setImportantStyle(host, "position", "fixed");
		setImportantStyle(host, "inset", "0");
		setImportantStyle(host, "z-index", String(zIndex));
		setImportantStyle(host, "pointer-events", "none");
		setImportantStyle(host, "contain", "layout style paint");
		setImportantStyle(host, "isolation", "isolate");
		const shadowRoot = host.attachShadow({ mode: "open" });
		const styleEl = document.createElement("style");
		styleEl.textContent = QUICK_PANEL_STYLES;
		shadowRoot.append(styleEl);
		const uiRoot = document.createElement("div");
		uiRoot.id = UI_CONTAINER_ID;
		setImportantStyle(uiRoot, "position", "fixed");
		setImportantStyle(uiRoot, "inset", "0");
		setImportantStyle(uiRoot, "pointer-events", "none");
		shadowRoot.append(uiRoot);
		const root = document.createElement("div");
		root.id = ROOT_ID;
		root.className = "agent-theme qp-root";
		const initialTheme = getEffectiveThemeId(DEFAULT_THEME_ID);
		root.dataset.agentTheme = initialTheme;
		uiRoot.append(root);
		((_document$documentEle = document.documentElement) !== null && _document$documentEle !== void 0 ? _document$documentEle : document.body).append(host);
		disposer.add(() => host.remove());
		elements = {
			host,
			shadowRoot,
			uiRoot,
			root
		};
		const stopPropagation = (event) => {
			event.stopPropagation();
		};
		for (const eventType of BLOCKED_EVENT_TYPES) disposer.listen(root, eventType, stopPropagation);
		_asyncToGenerator(function* () {
			const themeId = yield readStoredThemeId();
			applyThemeId(root, themeId);
		})();
		let currentStoredThemeId = DEFAULT_THEME_ID;
		_asyncToGenerator(function* () {
			currentStoredThemeId = yield readStoredThemeId();
		})();
		const handleStorageChange = (changes, areaName) => {
			if (areaName !== "local") return;
			const change = changes[THEME_STORAGE_KEY];
			if (!change) return;
			currentStoredThemeId = normalizeThemeId(change.newValue);
			applyThemeId(root, currentStoredThemeId);
		};
		try {
			var _chrome2;
			(_chrome2 = chrome) === null || _chrome2 === void 0 || (_chrome2 = _chrome2.storage) === null || _chrome2 === void 0 || (_chrome2 = _chrome2.onChanged) === null || _chrome2 === void 0 || _chrome2.addListener(handleStorageChange);
			disposer.add(() => {
				var _chrome3;
				return (_chrome3 = chrome) === null || _chrome3 === void 0 || (_chrome3 = _chrome3.storage) === null || _chrome3 === void 0 || (_chrome3 = _chrome3.onChanged) === null || _chrome3 === void 0 ? void 0 : _chrome3.removeListener(handleStorageChange);
			});
		} catch (_unused4) {}
		try {
			var _globalThis$matchMedi3, _globalThis2;
			const darkModeMediaQuery = (_globalThis$matchMedi3 = (_globalThis2 = globalThis).matchMedia) === null || _globalThis$matchMedi3 === void 0 ? void 0 : _globalThis$matchMedi3.call(_globalThis2, "(prefers-color-scheme: dark)");
			if (darkModeMediaQuery) {
				const handleDarkModeChange = () => {
					applyThemeId(root, currentStoredThemeId);
				};
				if (typeof darkModeMediaQuery.addEventListener === "function") {
					darkModeMediaQuery.addEventListener("change", handleDarkModeChange);
					disposer.add(() => darkModeMediaQuery.removeEventListener("change", handleDarkModeChange));
				}
			}
		} catch (_unused5) {}
		const isOverlayElement = (node) => {
			if (!(node instanceof Node)) return false;
			if (node === host) return true;
			const rootNode = typeof node.getRootNode === "function" ? node.getRootNode() : null;
			return rootNode instanceof ShadowRoot && rootNode.host === host;
		};
		const isEventFromUi = (event) => {
			try {
				if (typeof event.composedPath === "function") return event.composedPath().some((el) => isOverlayElement(el));
			} catch (_unused6) {}
			return isOverlayElement(event.target);
		};
		return {
			getElements: () => elements,
			isOverlayElement,
			isEventFromUi,
			dispose: () => {
				elements = null;
				disposer.dispose();
			}
		};
	}
	//#endregion
	//#region \0@oxc-project+runtime@0.146.0/helpers/esm/objectSpread2.js
	function ownKeys(e, r) {
		var t = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var o = Object.getOwnPropertySymbols(e);
			r && (o = o.filter(function(r) {
				return Object.getOwnPropertyDescriptor(e, r).enumerable;
			})), t.push.apply(t, o);
		}
		return t;
	}
	function _objectSpread2(e) {
		for (var r = 1; r < arguments.length; r++) {
			var t = null != arguments[r] ? arguments[r] : {};
			r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
				_defineProperty(e, r, t[r]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
				Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
			});
		}
		return e;
	}
	//#endregion
	//#region shared/quick-panel/ui/markdown-renderer.ts
	/**
	* Create a markdown renderer instance that mounts to a container element.
	* Currently renders as plain text - markdown support pending.
	*
	* @param container - The DOM element to render content into
	* @returns Markdown renderer instance with setContent and dispose methods
	*/
	function createMarkdownRenderer(container) {
		let currentContent = "";
		const contentEl = document.createElement("div");
		contentEl.className = "qp-markdown-content";
		container.appendChild(contentEl);
		return {
			setContent(newContent, _streaming = false) {
				currentContent = newContent;
				contentEl.textContent = newContent;
			},
			getContent() {
				return currentContent;
			},
			dispose() {
				try {
					contentEl.remove();
				} catch (_unused) {}
			}
		};
	}
	//#endregion
	//#region shared/quick-panel/ui/message-renderer.ts
	var DEFAULT_AUTO_SCROLL_THRESHOLD_PX = 96;
	/** Maximum length for truncated request ID display */
	var REQUEST_ID_DISPLAY_LENGTH = 10;
	function isNonEmptyString$1(value) {
		return typeof value === "string" && value.trim().length > 0;
	}
	function joinClasses(...parts) {
		return parts.filter(Boolean).join(" ");
	}
	function formatMessageTime(isoString) {
		const date = new Date(isoString);
		if (Number.isNaN(date.getTime())) return "";
		try {
			return date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			});
		} catch (_unused) {
			return "";
		}
	}
	function isStreamingMessage(message) {
		return message.isStreaming === true && message.isFinal !== true;
	}
	function getWrapperClassName(role) {
		return role === "user" ? "qp-msg qp-msg--user" : "qp-msg qp-msg--assistant";
	}
	function getBubbleClassName(role) {
		return joinClasses("qp-bubble", role === "user" && "qp-bubble--user");
	}
	function formatRequestIdForDisplay(requestId) {
		const full = requestId.trim();
		return {
			short: full.length <= REQUEST_ID_DISPLAY_LENGTH ? full : full.slice(0, REQUEST_ID_DISPLAY_LENGTH),
			full
		};
	}
	/**
	* Get a label prefix for special message types
	*/
	function getMessageTypeLabel(message) {
		if (message.role === "tool") return "Tool";
		if (message.role === "system") return "System";
		if (message.messageType === "tool_use") return "Tool";
		if (message.messageType === "tool_result") return "Result";
		return null;
	}
	function createMetaLeftElement() {
		const container = document.createElement("div");
		Object.assign(container.style, {
			display: "inline-flex",
			alignItems: "center",
			gap: "6px",
			minWidth: "0"
		});
		const streamDot = document.createElement("span");
		streamDot.className = "qp-msg-stream-dot ac-pulse";
		streamDot.hidden = true;
		const time = document.createElement("span");
		container.append(streamDot, time);
		return {
			container,
			streamDot,
			time
		};
	}
	function createMetaRightElement() {
		const container = document.createElement("span");
		container.hidden = true;
		const requestId = document.createElement("code");
		container.append(requestId);
		return {
			container,
			requestId
		};
	}
	function createMessageEntry(messageId, message) {
		const wrapper = document.createElement("div");
		wrapper.className = getWrapperClassName(message.role);
		wrapper.dataset.messageId = messageId;
		wrapper.dataset.role = message.role;
		wrapper.dataset.messageType = message.messageType;
		const bubble = document.createElement("div");
		bubble.className = getBubbleClassName(message.role);
		const textEl = document.createElement("div");
		textEl.className = "qp-msg-text";
		const metaEl = document.createElement("div");
		metaEl.className = "qp-msg-meta";
		const metaLeft = createMetaLeftElement();
		const metaRight = createMetaRightElement();
		metaEl.append(metaLeft.container, metaRight.container);
		bubble.append(textEl, metaEl);
		wrapper.append(bubble);
		let markdownRenderer = null;
		if (message.role === "assistant") markdownRenderer = createMarkdownRenderer(textEl);
		return {
			wrapper,
			bubble,
			textEl,
			metaEl,
			metaLeftEl: metaLeft.container,
			streamDotEl: metaLeft.streamDot,
			timeEl: metaLeft.time,
			metaRightEl: metaRight.container,
			requestIdEl: metaRight.requestId,
			markdownRenderer
		};
	}
	function updateMessageEntry(entry, messageId, message) {
		var _message$content;
		const wrapperClass = getWrapperClassName(message.role);
		if (entry.wrapper.className !== wrapperClass) entry.wrapper.className = wrapperClass;
		entry.wrapper.dataset.role = message.role;
		entry.wrapper.dataset.messageType = message.messageType;
		entry.wrapper.dataset.messageId = messageId;
		const bubbleClass = getBubbleClassName(message.role);
		if (entry.bubble.className !== bubbleClass) entry.bubble.className = bubbleClass;
		const textContent = (_message$content = message.content) !== null && _message$content !== void 0 ? _message$content : "";
		if (message.role === "assistant" && entry.markdownRenderer) entry.markdownRenderer.setContent(textContent, isStreamingMessage(message));
		else if (entry.textEl.textContent !== textContent) entry.textEl.textContent = textContent;
		const typeLabel = getMessageTypeLabel(message);
		const timeText = formatMessageTime(message.createdAt) || "—";
		entry.timeEl.textContent = typeLabel ? `${typeLabel} \u2022 ${timeText}` : timeText;
		entry.streamDotEl.hidden = !isStreamingMessage(message);
		const rawRequestId = isNonEmptyString$1(message.requestId) ? message.requestId.trim() : "";
		if (rawRequestId) {
			const formatted = formatRequestIdForDisplay(rawRequestId);
			entry.requestIdEl.textContent = formatted.short;
			entry.requestIdEl.title = formatted.full;
			entry.metaRightEl.hidden = false;
		} else {
			entry.requestIdEl.textContent = "";
			entry.requestIdEl.title = "";
			entry.metaRightEl.hidden = true;
		}
	}
	/**
	* Create a message renderer instance for the Quick Panel AI Chat.
	*
	* @example
	* ```typescript
	* const renderer = createQuickPanelMessageRenderer({
	*   container: messagesEl,
	*   scrollContainer: contentEl,
	* });
	*
	* // Render streaming message
	* renderer.upsert(message);
	*
	* // Clean up
	* renderer.dispose();
	* ```
	*/
	function createQuickPanelMessageRenderer(options) {
		var _options$scrollContai, _options$autoScroll, _options$autoScrollTh;
		const container = options.container;
		const scrollContainer = (_options$scrollContai = options.scrollContainer) !== null && _options$scrollContai !== void 0 ? _options$scrollContai : null;
		const autoScroll = (_options$autoScroll = options.autoScroll) !== null && _options$autoScroll !== void 0 ? _options$autoScroll : true;
		const thresholdPx = (_options$autoScrollTh = options.autoScrollThresholdPx) !== null && _options$autoScrollTh !== void 0 ? _options$autoScrollTh : DEFAULT_AUTO_SCROLL_THRESHOLD_PX;
		/** Map of messageId -> DOM entry */
		const entries = /* @__PURE__ */ new Map();
		let disposed = false;
		function isNearBottom() {
			if (!scrollContainer) return true;
			const { scrollHeight, scrollTop, clientHeight } = scrollContainer;
			return scrollHeight - scrollTop - clientHeight <= thresholdPx;
		}
		function scrollToBottom() {
			if (!scrollContainer) return;
			try {
				scrollContainer.scrollTo({ top: scrollContainer.scrollHeight });
			} catch (_unused2) {
				scrollContainer.scrollTop = scrollContainer.scrollHeight;
			}
		}
		function upsert(message) {
			var _message$id;
			if (disposed) return;
			const messageId = (_message$id = message.id) === null || _message$id === void 0 ? void 0 : _message$id.trim();
			if (!messageId) return;
			const shouldAutoScroll = autoScroll && isNearBottom();
			let entry = entries.get(messageId);
			if (!entry) {
				entry = createMessageEntry(messageId, message);
				entries.set(messageId, entry);
				container.append(entry.wrapper);
			}
			updateMessageEntry(entry, messageId, message);
			if (shouldAutoScroll) scrollToBottom();
		}
		function remove(messageId) {
			if (disposed) return;
			const id = messageId === null || messageId === void 0 ? void 0 : messageId.trim();
			if (!id) return;
			const entry = entries.get(id);
			if (!entry) return;
			entries.delete(id);
			if (entry.markdownRenderer) entry.markdownRenderer.dispose();
			try {
				entry.wrapper.remove();
			} catch (_unused3) {
				var _entry$wrapper$parent;
				(_entry$wrapper$parent = entry.wrapper.parentElement) === null || _entry$wrapper$parent === void 0 || _entry$wrapper$parent.removeChild(entry.wrapper);
			}
		}
		function clear() {
			if (disposed) return;
			for (const entry of entries.values()) if (entry.markdownRenderer) entry.markdownRenderer.dispose();
			entries.clear();
			container.textContent = "";
		}
		function setMessages(messages) {
			if (disposed) return;
			for (const entry of entries.values()) if (entry.markdownRenderer) entry.markdownRenderer.dispose();
			entries.clear();
			container.textContent = "";
			for (const msg of messages) {
				var _msg$id;
				const id = (_msg$id = msg.id) === null || _msg$id === void 0 ? void 0 : _msg$id.trim();
				if (!id) continue;
				const entry = createMessageEntry(id, msg);
				entries.set(id, entry);
				updateMessageEntry(entry, id, msg);
				container.append(entry.wrapper);
			}
			scrollToBottom();
		}
		function getMessageCount() {
			return entries.size;
		}
		function dispose() {
			if (disposed) return;
			disposed = true;
			for (const entry of entries.values()) if (entry.markdownRenderer) entry.markdownRenderer.dispose();
			entries.clear();
			container.textContent = "";
		}
		return {
			upsert,
			remove,
			clear,
			setMessages,
			getMessageCount,
			scrollToBottom,
			dispose
		};
	}
	//#endregion
	//#region shared/quick-panel/ui/ai-chat-panel.ts
	var LOG_PREFIX$1 = "[QuickPanelAiChatPanel]";
	var DEFAULT_TITLE = "Agent";
	var DEFAULT_SUBTITLE = "Quick Panel";
	var DEFAULT_PLACEHOLDER = "Ask the agent...";
	/** Max chars for selected text context to avoid payload bloat */
	var MAX_SELECTED_TEXT_CHARS = 3e3;
	/** Max chars for error message display */
	var MAX_ERROR_DISPLAY_CHARS = 600;
	var TEXTAREA_MIN_HEIGHT_PX = 42;
	var TEXTAREA_MAX_HEIGHT_PX = 160;
	/** Auto-hide duration for success/warning banners */
	var BANNER_AUTO_HIDE_MS = 2400;
	var ICON_CLOSE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
	var ICON_SEND = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`;
	var ICON_STOP = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>`;
	function isNonEmptyString(value) {
		return typeof value === "string" && value.trim().length > 0;
	}
	function truncateText(text, maxChars) {
		const trimmed = text.trim();
		if (trimmed.length <= maxChars) return trimmed;
		return `${trimmed.slice(0, Math.max(0, maxChars - 1)).trimEnd()}\u2026`;
	}
	function safeFocus(element) {
		try {
			element.focus();
		} catch (_unused) {}
	}
	function isTerminalStatus(status) {
		return status === "completed" || status === "error" || status === "cancelled";
	}
	/**
	* Collect default context from the current page
	*/
	function collectDefaultContext() {
		var _globalThis$location;
		const context = { pageUrl: (_globalThis$location = globalThis.location) === null || _globalThis$location === void 0 ? void 0 : _globalThis$location.href };
		try {
			var _globalThis$getSelect, _globalThis, _selection$toString$t, _selection$toString;
			const selection = (_globalThis$getSelect = (_globalThis = globalThis).getSelection) === null || _globalThis$getSelect === void 0 ? void 0 : _globalThis$getSelect.call(_globalThis);
			const selectedText = (_selection$toString$t = selection === null || selection === void 0 || (_selection$toString = selection.toString()) === null || _selection$toString === void 0 ? void 0 : _selection$toString.trim()) !== null && _selection$toString$t !== void 0 ? _selection$toString$t : "";
			if (selectedText) context.selectedText = truncateText(selectedText, MAX_SELECTED_TEXT_CHARS);
		} catch (_unused2) {}
		return context;
	}
	/**
	* Build a local user message for optimistic rendering
	*/
	function buildLocalUserMessage(sessionId, requestId, instruction) {
		return {
			id: `local-user:${requestId}`,
			sessionId,
			role: "user",
			content: instruction,
			messageType: "chat",
			requestId,
			isStreaming: false,
			isFinal: true,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
	}
	/**
	* Format usage stats for display
	*/
	function formatUsageStats(usage) {
		if (!usage) return null;
		const parts = [];
		const inputTokens = Number.isFinite(usage.inputTokens) ? usage.inputTokens : 0;
		const outputTokens = Number.isFinite(usage.outputTokens) ? usage.outputTokens : 0;
		parts.push(`in ${inputTokens}`, `out ${outputTokens}`);
		if (Number.isFinite(usage.durationMs) && usage.durationMs > 0) {
			const seconds = Math.max(1, Math.round(usage.durationMs / 1e3));
			parts.push(`${seconds}s`);
		}
		if (Number.isFinite(usage.totalCostUsd) && usage.totalCostUsd > 0) parts.push(`$${usage.totalCostUsd.toFixed(4)}`);
		return parts.join(" • ");
	}
	function buildPanelDOM(options) {
		var _options$title, _options$subtitle, _options$placeholder;
		const title = ((_options$title = options.title) === null || _options$title === void 0 ? void 0 : _options$title.trim()) || DEFAULT_TITLE;
		const subtitle = ((_options$subtitle = options.subtitle) === null || _options$subtitle === void 0 ? void 0 : _options$subtitle.trim()) || DEFAULT_SUBTITLE;
		const placeholder = ((_options$placeholder = options.placeholder) === null || _options$placeholder === void 0 ? void 0 : _options$placeholder.trim()) || DEFAULT_PLACEHOLDER;
		const overlay = document.createElement("div");
		overlay.className = "qp-overlay";
		overlay.setAttribute("data-mcp-quick-panel-ai-chat", "true");
		const panel = document.createElement("div");
		panel.className = "qp-panel";
		panel.setAttribute("role", "dialog");
		panel.setAttribute("aria-modal", "true");
		panel.setAttribute("aria-label", title);
		const header = document.createElement("div");
		header.className = "qp-header";
		const headerLeft = document.createElement("div");
		headerLeft.className = "qp-header-left";
		const brand = document.createElement("div");
		brand.className = "qp-brand";
		brand.textContent = "✦";
		const titleWrap = document.createElement("div");
		titleWrap.className = "qp-title";
		const titleNameEl = document.createElement("div");
		titleNameEl.className = "qp-title-name";
		titleNameEl.textContent = title;
		const titleSubEl = document.createElement("div");
		titleSubEl.className = "qp-title-sub";
		titleSubEl.textContent = subtitle;
		titleWrap.append(titleNameEl, titleSubEl);
		headerLeft.append(brand, titleWrap);
		const headerRight = document.createElement("div");
		headerRight.className = "qp-header-right";
		const streamIndicator = document.createElement("div");
		streamIndicator.className = "qp-stream-indicator";
		streamIndicator.hidden = true;
		const streamDot = document.createElement("span");
		streamDot.className = "qp-stream-dot ac-pulse";
		const streamText = document.createElement("span");
		streamText.textContent = "Streaming";
		streamIndicator.append(streamDot, streamText);
		const closeBtn = document.createElement("button");
		closeBtn.type = "button";
		closeBtn.className = "qp-icon-btn ac-focus-ring";
		closeBtn.innerHTML = ICON_CLOSE;
		closeBtn.setAttribute("aria-label", "Close Quick Panel");
		headerRight.append(streamIndicator, closeBtn);
		header.append(headerLeft, headerRight);
		const contentEl = document.createElement("div");
		contentEl.className = "qp-content ac-scroll";
		const emptyEl = document.createElement("div");
		emptyEl.className = "qp-empty";
		const emptyIcon = document.createElement("div");
		emptyIcon.className = "qp-empty-icon";
		emptyIcon.textContent = "✦";
		const emptyText = document.createElement("div");
		emptyText.className = "qp-empty-text";
		emptyText.textContent = "Ask about this page. Streaming replies appear here.";
		emptyEl.append(emptyIcon, emptyText);
		const messagesEl = document.createElement("div");
		messagesEl.className = "qp-messages";
		contentEl.append(emptyEl, messagesEl);
		const composer = document.createElement("div");
		composer.className = "qp-composer";
		const banner = document.createElement("div");
		banner.className = "qp-status";
		banner.hidden = true;
		const textarea = document.createElement("textarea");
		textarea.className = "qp-textarea ac-focus-ring";
		textarea.placeholder = placeholder;
		textarea.rows = 1;
		const actions = document.createElement("div");
		actions.className = "qp-actions";
		const actionsLeft = document.createElement("div");
		actionsLeft.className = "qp-actions-left";
		for (const hint of [
			{
				key: "Enter",
				label: "Send"
			},
			{
				key: "Shift+Enter",
				label: "New line"
			},
			{
				key: "Esc",
				label: "Close"
			}
		]) {
			const keyEl = document.createElement("span");
			keyEl.className = "qp-kbd";
			keyEl.textContent = hint.key;
			const labelEl = document.createElement("span");
			labelEl.textContent = hint.label;
			actionsLeft.append(keyEl, labelEl);
		}
		const actionsRight = document.createElement("div");
		actionsRight.className = "qp-actions-right";
		const actionBtn = document.createElement("button");
		actionBtn.type = "button";
		actionBtn.className = "qp-icon-btn qp-icon-btn--action qp-icon-btn--primary ac-focus-ring";
		actionBtn.innerHTML = ICON_SEND;
		actionBtn.setAttribute("aria-label", "Send message");
		actionBtn.dataset.action = "send";
		actionsRight.append(actionBtn);
		actions.append(actionsLeft, actionsRight);
		composer.append(banner, textarea, actions);
		panel.append(header, contentEl, composer);
		overlay.append(panel);
		return {
			overlay,
			panel,
			titleSubEl,
			streamIndicator,
			streamText,
			closeBtn,
			contentEl,
			emptyEl,
			messagesEl,
			banner,
			textarea,
			actionBtn
		};
	}
	/**
	* Mount the Quick Panel AI Chat interface.
	*
	* @example
	* ```typescript
	* const chatPanel = mountQuickPanelAiChatPanel({
	*   mount: shadowHostElements.root,
	*   agentBridge,
	*   onRequestClose: () => quickPanel.hide(),
	* });
	*
	* // Later: clean up
	* chatPanel.dispose();
	* ```
	*/
	function mountQuickPanelAiChatPanel(options) {
		var _options$subtitle2;
		const disposer = new Disposer();
		const mount = options.mount;
		const agentBridge = options.agentBridge;
		const defaultSubtitle = ((_options$subtitle2 = options.subtitle) === null || _options$subtitle2 === void 0 ? void 0 : _options$subtitle2.trim()) || DEFAULT_SUBTITLE;
		try {
			var _mount$querySelector;
			const existing = (_mount$querySelector = mount.querySelector) === null || _mount$querySelector === void 0 ? void 0 : _mount$querySelector.call(mount, "[data-mcp-quick-panel-ai-chat=\"true\"]");
			if (existing instanceof HTMLElement) existing.remove();
		} catch (_unused3) {}
		let disposed = false;
		let requestUnsubscribe = null;
		let bannerTimer = null;
		let state = {
			sending: false,
			streaming: false,
			cancelling: false,
			currentRequestId: null,
			sessionId: null,
			lastStatus: null,
			lastUsage: null,
			errorMessage: null
		};
		const dom = buildPanelDOM(options);
		mount.append(dom.overlay);
		disposer.add(() => dom.overlay.remove());
		const renderer = createQuickPanelMessageRenderer({
			container: dom.messagesEl,
			scrollContainer: dom.contentEl,
			autoScroll: true,
			autoScrollThresholdPx: 96
		});
		disposer.add(() => renderer.dispose());
		function clearBannerTimer() {
			if (bannerTimer) {
				clearTimeout(bannerTimer);
				bannerTimer = null;
			}
		}
		function hideBanner() {
			clearBannerTimer();
			dom.banner.hidden = true;
			dom.banner.className = "qp-status";
			dom.banner.textContent = "";
		}
		function showBanner(tone, message, autoHideMs) {
			clearBannerTimer();
			dom.banner.hidden = false;
			dom.banner.className = "qp-status";
			if (tone === "error") dom.banner.classList.add("qp-status--error");
			if (tone === "success") dom.banner.classList.add("qp-status--success");
			if (tone === "warning") dom.banner.classList.add("qp-status--warning");
			dom.banner.textContent = message;
			if (autoHideMs && autoHideMs > 0) bannerTimer = setTimeout(hideBanner, autoHideMs);
		}
		function resizeTextarea() {
			try {
				dom.textarea.style.height = "auto";
				const targetHeight = Math.min(TEXTAREA_MAX_HEIGHT_PX, Math.max(TEXTAREA_MIN_HEIGHT_PX, dom.textarea.scrollHeight));
				dom.textarea.style.height = `${targetHeight}px`;
			} catch (_unused4) {}
		}
		function renderEmptyState() {
			const hasMessages = renderer.getMessageCount() > 0;
			dom.emptyEl.hidden = hasMessages;
			dom.messagesEl.hidden = !hasMessages;
		}
		function renderHeaderSubtitle() {
			if (state.errorMessage) {
				dom.titleSubEl.textContent = "Error";
				return;
			}
			if (state.streaming) {
				dom.titleSubEl.textContent = "Streaming…";
				return;
			}
			if (state.sending) {
				dom.titleSubEl.textContent = "Sending…";
				return;
			}
			const usageText = formatUsageStats(state.lastUsage);
			dom.titleSubEl.textContent = usageText ? `Last: ${usageText}` : defaultSubtitle;
		}
		function renderControls() {
			const inputText = dom.textarea.value.trim();
			const isLoading = state.sending || state.streaming || state.cancelling;
			const canSend = inputText.length > 0 && !isLoading;
			const canCancel = state.currentRequestId !== null && !state.cancelling;
			if (isLoading) {
				dom.actionBtn.innerHTML = ICON_STOP;
				dom.actionBtn.setAttribute("aria-label", "Stop request");
				dom.actionBtn.dataset.action = "stop";
				dom.actionBtn.disabled = !canCancel;
				dom.actionBtn.classList.remove("qp-icon-btn--primary");
				dom.actionBtn.classList.add("qp-icon-btn--danger");
			} else {
				dom.actionBtn.innerHTML = ICON_SEND;
				dom.actionBtn.setAttribute("aria-label", "Send message");
				dom.actionBtn.dataset.action = "send";
				dom.actionBtn.disabled = !canSend;
				dom.actionBtn.classList.remove("qp-icon-btn--danger");
				dom.actionBtn.classList.add("qp-icon-btn--primary");
			}
			dom.streamIndicator.hidden = !isLoading;
			if (state.cancelling) dom.streamText.textContent = "Cancelling";
			else if (state.sending) dom.streamText.textContent = "Sending";
			else dom.streamText.textContent = "Streaming";
			dom.textarea.disabled = state.sending || state.cancelling;
			renderHeaderSubtitle();
			renderEmptyState();
		}
		function setState(patch) {
			state = _objectSpread2(_objectSpread2({}, state), patch);
			renderControls();
		}
		function cleanupActiveSubscription() {
			if (requestUnsubscribe) {
				try {
					requestUnsubscribe();
				} catch (_unused5) {}
				requestUnsubscribe = null;
			}
		}
		function resolveContext() {
			return _resolveContext.apply(this, arguments);
		}
		function _resolveContext() {
			_resolveContext = _asyncToGenerator(function* () {
				try {
					if (options.getContext) {
						const provided = yield options.getContext();
						if (provided && typeof provided === "object") return provided;
					}
				} catch (err) {
					console.warn(`${LOG_PREFIX$1} getContext failed:`, err);
				}
				const fallback = collectDefaultContext();
				if (!isNonEmptyString(fallback.pageUrl) && !isNonEmptyString(fallback.selectedText)) return;
				return fallback;
			});
			return _resolveContext.apply(this, arguments);
		}
		function sendCurrentInput() {
			return _sendCurrentInput.apply(this, arguments);
		}
		function _sendCurrentInput() {
			_sendCurrentInput = _asyncToGenerator(function* () {
				if (disposed) return;
				if (state.sending || state.streaming || state.cancelling) return;
				const instruction = dom.textarea.value.trim();
				if (!instruction) return;
				setState({
					errorMessage: null,
					lastUsage: null,
					lastStatus: null
				});
				hideBanner();
				const savedInput = dom.textarea.value;
				dom.textarea.value = "";
				resizeTextarea();
				setState({ sending: true });
				const context = yield resolveContext();
				if (disposed) return;
				const payload = {
					instruction,
					context: context !== null && context !== void 0 ? context : void 0
				};
				const result = yield agentBridge.sendToAI(payload);
				if (disposed) return;
				if (!result.success) {
					dom.textarea.value = savedInput;
					resizeTextarea();
					const errorMsg = truncateText(result.error, MAX_ERROR_DISPLAY_CHARS);
					setState({
						sending: false,
						errorMessage: errorMsg
					});
					showBanner("error", errorMsg);
					return;
				}
				renderer.upsert(buildLocalUserMessage(result.sessionId, result.requestId, instruction));
				renderer.scrollToBottom();
				setState({
					sending: false,
					streaming: true,
					currentRequestId: result.requestId,
					sessionId: result.sessionId,
					lastStatus: "starting"
				});
				cleanupActiveSubscription();
				requestUnsubscribe = agentBridge.onRequestEvent(result.requestId, (event) => {
					if (disposed) return;
					handleRequestEvent(event);
				});
			});
			return _sendCurrentInput.apply(this, arguments);
		}
		function cancelCurrentRequest() {
			return _cancelCurrentRequest.apply(this, arguments);
		}
		function _cancelCurrentRequest() {
			_cancelCurrentRequest = _asyncToGenerator(function* () {
				if (disposed) return;
				if (!state.currentRequestId) return;
				if (state.cancelling) return;
				const requestId = state.currentRequestId;
				const sessionId = state.sessionId || void 0;
				setState({ cancelling: true });
				const result = yield agentBridge.cancelRequest(requestId, sessionId);
				if (disposed) return;
				if (!result.success) {
					const errorMsg = truncateText(result.error, MAX_ERROR_DISPLAY_CHARS);
					setState({
						cancelling: false,
						errorMessage: errorMsg
					});
					showBanner("error", errorMsg);
					return;
				}
				setState({ cancelling: false });
			});
			return _cancelCurrentRequest.apply(this, arguments);
		}
		function handleTerminal(status, message) {
			cleanupActiveSubscription();
			setState({
				streaming: false,
				sending: false,
				cancelling: false,
				currentRequestId: null,
				sessionId: null,
				lastStatus: status
			});
			if (status === "completed") {
				const usageText = formatUsageStats(state.lastUsage);
				showBanner("success", usageText ? `Completed \u2022 ${usageText}` : "Completed", BANNER_AUTO_HIDE_MS);
				return;
			}
			if (status === "cancelled") {
				showBanner("warning", "Cancelled", BANNER_AUTO_HIDE_MS);
				return;
			}
			if (status === "error") {
				const errorMsg = truncateText(message || state.errorMessage || "Request failed", MAX_ERROR_DISPLAY_CHARS);
				setState({ errorMessage: errorMsg });
				showBanner("error", errorMsg);
			}
		}
		/**
		* Handle incoming RealtimeEvent with runtime guards for malformed data.
		*/
		function handleRequestEvent(event) {
			if (disposed) return;
			if (!event || typeof event !== "object" || !("type" in event)) {
				console.warn(`${LOG_PREFIX$1} Invalid event structure:`, event);
				return;
			}
			try {
				switch (event.type) {
					case "message": {
						const msg = event.data;
						if (!msg || typeof msg !== "object" || typeof msg.id !== "string") {
							console.warn(`${LOG_PREFIX$1} Invalid message data:`, msg);
							return;
						}
						if (msg.role === "user") {
							const localUserId = `local-user:${msg.requestId}`;
							renderer.remove(localUserId);
						}
						renderer.upsert(msg);
						if (msg.isStreaming === true && !msg.isFinal) setState({ streaming: true });
						return;
					}
					case "status": {
						const statusData = event.data;
						if (!statusData || typeof statusData !== "object" || typeof statusData.status !== "string") {
							console.warn(`${LOG_PREFIX$1} Invalid status data:`, statusData);
							return;
						}
						setState({ lastStatus: statusData.status });
						if (statusData.status === "starting" || statusData.status === "ready" || statusData.status === "running") {
							setState({ streaming: true });
							return;
						}
						if (isTerminalStatus(statusData.status)) handleTerminal(statusData.status, statusData.message);
						return;
					}
					case "usage":
						setState({ lastUsage: event.data });
						return;
					case "error": {
						const errorMsg = truncateText(event.error || "Unknown error", MAX_ERROR_DISPLAY_CHARS);
						setState({ errorMessage: errorMsg });
						showBanner("error", errorMsg);
						cleanupActiveSubscription();
						setState({
							streaming: false,
							sending: false,
							cancelling: false,
							currentRequestId: null,
							sessionId: null,
							lastStatus: "error"
						});
						return;
					}
					case "connected":
					case "heartbeat": return;
				}
			} catch (err) {
				console.warn(`${LOG_PREFIX$1} Error handling event:`, err, event);
			}
		}
		disposer.listen(dom.overlay, "click", (ev) => {
			if (disposed) return;
			if (ev.target === dom.overlay) close();
		});
		disposer.listen(dom.closeBtn, "click", () => close());
		disposer.listen(dom.actionBtn, "click", () => {
			if (disposed) return;
			if (dom.actionBtn.dataset.action === "stop") cancelCurrentRequest();
			else sendCurrentInput();
		});
		disposer.listen(dom.textarea, "input", () => {
			if (disposed) return;
			resizeTextarea();
			renderControls();
		});
		disposer.listen(dom.textarea, "keydown", (ev) => {
			if (disposed) return;
			if (ev.key === "Escape" && !ev.isComposing) {
				ev.preventDefault();
				close();
				return;
			}
			if (ev.key === "Enter" && !ev.shiftKey && !ev.isComposing) {
				ev.preventDefault();
				sendCurrentInput();
			}
		});
		function focusInput() {
			if (disposed) return;
			safeFocus(dom.textarea);
		}
		function clearMessages() {
			if (disposed) return;
			renderer.clear();
			hideBanner();
			setState({
				lastUsage: null,
				lastStatus: null,
				errorMessage: null
			});
		}
		function close() {
			if (disposed) return;
			if (state.currentRequestId) cancelCurrentRequest();
			try {
				var _options$onRequestClo;
				(_options$onRequestClo = options.onRequestClose) === null || _options$onRequestClo === void 0 || _options$onRequestClo.call(options);
			} catch (err) {
				console.warn(`${LOG_PREFIX$1} onRequestClose failed:`, err);
			}
			dispose();
		}
		function dispose() {
			if (disposed) return;
			disposed = true;
			cleanupActiveSubscription();
			clearBannerTimer();
			disposer.dispose();
		}
		resizeTextarea();
		renderControls();
		if (options.autoFocus !== false) focusInput();
		return {
			getState: () => _objectSpread2({}, state),
			focusInput,
			clearMessages,
			close,
			dispose
		};
	}
	//#endregion
	//#region shared/quick-panel/index.ts
	/**
	* Quick Panel Entry Point
	*
	* This module provides the main controller for Quick Panel functionality.
	* It orchestrates:
	* - Shadow DOM host management
	* - AI Chat panel lifecycle
	* - Agent bridge communication
	* - Keyboard shortcut handling (external)
	*
	* Usage in content script:
	* ```typescript
	* import { createQuickPanelController } from './quick-panel';
	*
	* const controller = createQuickPanelController();
	*
	* // Show panel (e.g., on keyboard shortcut)
	* controller.show();
	*
	* // Hide panel
	* controller.hide();
	*
	* // Toggle visibility
	* controller.toggle();
	*
	* // Cleanup on unload
	* controller.dispose();
	* ```
	*/
	var LOG_PREFIX = "[QuickPanelController]";
	/**
	* Create a Quick Panel controller instance.
	*
	* The controller manages the full lifecycle of the Quick Panel UI,
	* including Shadow DOM isolation, AI chat interface, and background
	* communication.
	*
	* @example
	* ```typescript
	* // In content script
	* const quickPanel = createQuickPanelController();
	*
	* // Listen for keyboard shortcut (e.g., Cmd+Shift+K)
	* document.addEventListener('keydown', (e) => {
	*   if (e.metaKey && e.shiftKey && e.key === 'k') {
	*     e.preventDefault();
	*     quickPanel.toggle();
	*   }
	* });
	*
	* // Cleanup when the tab is closed, navigated away, or reloaded. `pagehide` is
	* // used instead of the deprecated `unload` event, which many sites block via
	* // Permissions-Policy since it defeats the back/forward cache.
	* window.addEventListener('pagehide', () => {
	*   quickPanel.dispose();
	* });
	* ```
	*/
	function createQuickPanelController(options = {}) {
		let disposed = false;
		let agentBridge = null;
		let shadowHost = null;
		let chatPanel = null;
		/**
		* Ensure agent bridge is initialized
		*/
		function ensureBridge() {
			if (!agentBridge || agentBridge.isDisposed()) agentBridge = createAgentBridge();
			return agentBridge;
		}
		/**
		* Dispose current UI (keeps bridge alive for potential reuse)
		*/
		function disposeUI() {
			if (chatPanel) {
				try {
					chatPanel.dispose();
				} catch (err) {
					console.warn(`${LOG_PREFIX} Error disposing chat panel:`, err);
				}
				chatPanel = null;
			}
			if (shadowHost) {
				try {
					shadowHost.dispose();
				} catch (err) {
					console.warn(`${LOG_PREFIX} Error disposing shadow host:`, err);
				}
				shadowHost = null;
			}
		}
		/**
		* Show the Quick Panel
		*/
		function show() {
			if (disposed) {
				console.warn(`${LOG_PREFIX} Cannot show - controller is disposed`);
				return;
			}
			if (chatPanel && (shadowHost === null || shadowHost === void 0 ? void 0 : shadowHost.getElements())) {
				chatPanel.focusInput();
				return;
			}
			disposeUI();
			shadowHost = mountQuickPanelShadowHost({
				hostId: options.hostId,
				zIndex: options.zIndex
			});
			const elements = shadowHost.getElements();
			if (!elements) {
				console.error(`${LOG_PREFIX} Failed to create shadow host elements`);
				disposeUI();
				return;
			}
			const bridge = ensureBridge();
			chatPanel = mountQuickPanelAiChatPanel({
				mount: elements.root,
				agentBridge: bridge,
				title: options.title,
				subtitle: options.subtitle,
				placeholder: options.placeholder,
				autoFocus: true,
				onRequestClose: () => hide()
			});
		}
		/**
		* Hide the Quick Panel
		*/
		function hide() {
			if (disposed) return;
			disposeUI();
		}
		/**
		* Toggle Quick Panel visibility
		*/
		function toggle() {
			if (disposed) return;
			if (isVisible()) hide();
			else show();
		}
		/**
		* Check if panel is currently visible
		*/
		function isVisible() {
			return chatPanel !== null && (shadowHost === null || shadowHost === void 0 ? void 0 : shadowHost.getElements()) !== null;
		}
		/**
		* Fully dispose all resources
		*/
		function dispose() {
			if (disposed) return;
			disposed = true;
			disposeUI();
			if (agentBridge) {
				try {
					agentBridge.dispose();
				} catch (err) {
					console.warn(`${LOG_PREFIX} Error disposing agent bridge:`, err);
				}
				agentBridge = null;
			}
		}
		return {
			show,
			hide,
			toggle,
			isVisible,
			dispose
		};
	}
	//#endregion
	//#region entrypoints/quick-panel.content.ts
	/**
	* Quick Panel Content Script
	*
	* This content script manages the Quick Panel AI Chat feature on web pages.
	* It responds to:
	* - Background messages (toggle_quick_panel from keyboard shortcut)
	* - Direct programmatic calls
	*
	* The Quick Panel provides a floating AI chat interface that:
	* - Uses Shadow DOM for style isolation
	* - Streams AI responses in real-time
	* - Supports keyboard shortcuts (Enter to send, Esc to close)
	* - Collects page context (URL, selection) automatically
	*/
	var quick_panel_content_default = defineContentScript({
		matches: ["<all_urls>"],
		runAt: "document_idle",
		main() {
			console.log("[QuickPanelContentScript] Content script loaded on:", window.location.href);
			let controller = null;
			/**
			* Ensure controller is initialized (lazy initialization)
			*/
			function ensureController() {
				if (!controller) controller = createQuickPanelController({
					title: "Agent",
					subtitle: "Quick Panel",
					placeholder: "Ask about this page..."
				});
				return controller;
			}
			/**
			* Handle messages from background script
			*/
			function handleMessage(message, _sender, sendResponse) {
				const msg = message;
				if ((msg === null || msg === void 0 ? void 0 : msg.action) === "toggle_quick_panel") {
					console.log("[QuickPanelContentScript] Received toggle_quick_panel message");
					try {
						const ctrl = ensureController();
						ctrl.toggle();
						const visible = ctrl.isVisible();
						console.log("[QuickPanelContentScript] Toggle completed, visible:", visible);
						sendResponse({
							success: true,
							visible
						});
					} catch (err) {
						console.error("[QuickPanelContentScript] Toggle error:", err);
						sendResponse({
							success: false,
							error: String(err)
						});
					}
					return true;
				}
				if ((msg === null || msg === void 0 ? void 0 : msg.action) === "show_quick_panel") {
					try {
						ensureController().show();
						sendResponse({ success: true });
					} catch (err) {
						console.error("[QuickPanelContentScript] Show error:", err);
						sendResponse({
							success: false,
							error: String(err)
						});
					}
					return true;
				}
				if ((msg === null || msg === void 0 ? void 0 : msg.action) === "hide_quick_panel") {
					try {
						if (controller) controller.hide();
						sendResponse({ success: true });
					} catch (err) {
						console.error("[QuickPanelContentScript] Hide error:", err);
						sendResponse({
							success: false,
							error: String(err)
						});
					}
					return true;
				}
				if ((msg === null || msg === void 0 ? void 0 : msg.action) === "get_quick_panel_status") {
					var _controller$isVisible;
					sendResponse({
						success: true,
						visible: (_controller$isVisible = controller === null || controller === void 0 ? void 0 : controller.isVisible()) !== null && _controller$isVisible !== void 0 ? _controller$isVisible : false,
						initialized: controller !== null
					});
					return true;
				}
				return false;
			}
			chrome.runtime.onMessage.addListener(handleMessage);
			// `unload` is deprecated and blocked by many sites via
			// `Permissions-Policy: unload=()` (it defeats the back/forward cache), which is
			// exactly what produced the "Permissions policy violation: unload is not
			// allowed in this document" error. `pagehide` fires on the same tab
			// close/navigate/reload events without being deprecated or blockable.
			window.addEventListener("pagehide", () => {
				chrome.runtime.onMessage.removeListener(handleMessage);
				if (controller) {
					controller.dispose();
					controller = null;
				}
			});
		}
	});
	//#endregion
	//#region ../../node_modules/.pnpm/wxt@0.20.27_@types+node@22._c13784526c76306bd4ecdeabada10fa4/node_modules/wxt/dist/utils/internal/logger.mjs
	/** Wrapper around `console` with a "[wxt]" prefix */
	var logger$1 = {
		debug: (...args) => ([...args], void 0),
		log: (...args) => ([...args], void 0),
		warn: (...args) => ([...args], void 0),
		error: (...args) => ([...args], void 0)
	};
	//#endregion
	//#region ../../node_modules/.pnpm/@wxt-dev+browser@0.2.6/node_modules/@wxt-dev/browser/src/index.mjs
	var _globalThis$browser;
	//#endregion
	//#region ../../node_modules/.pnpm/wxt@0.20.27_@types+node@22._c13784526c76306bd4ecdeabada10fa4/node_modules/wxt/dist/browser.mjs
	/**
	* Contains the `browser` export which you should use to access the extension
	* APIs in your project:
	*
	* ```ts
	* import { browser } from 'wxt/browser';
	*
	* browser.runtime.onInstalled.addListener(() => {
	*   // ...
	* });
	* ```
	*
	* @module wxt/browser
	*/
	var browser = ((_globalThis$browser = globalThis.browser) === null || _globalThis$browser === void 0 || (_globalThis$browser = _globalThis$browser.runtime) === null || _globalThis$browser === void 0 ? void 0 : _globalThis$browser.id) ? globalThis.browser : globalThis.chrome;
	//#endregion
	//#region ../../node_modules/.pnpm/wxt@0.20.27_@types+node@22._c13784526c76306bd4ecdeabada10fa4/node_modules/wxt/dist/utils/internal/custom-events.mjs
	var _WxtLocationChangeEvent;
	var WxtLocationChangeEvent = (_WxtLocationChangeEvent = class WxtLocationChangeEvent extends Event {
		constructor(newUrl, oldUrl) {
			super(WxtLocationChangeEvent.EVENT_NAME, {});
			this.newUrl = newUrl;
			this.oldUrl = oldUrl;
		}
	}, _defineProperty(_WxtLocationChangeEvent, "EVENT_NAME", getUniqueEventName("wxt:locationchange")), _WxtLocationChangeEvent);
	/**
	* Returns an event name unique to the extension and content script that's
	* running.
	*/
	function getUniqueEventName(eventName) {
		var _browser$runtime;
		return `${browser === null || browser === void 0 || (_browser$runtime = browser.runtime) === null || _browser$runtime === void 0 ? void 0 : _browser$runtime.id}:quick-panel:${eventName}`;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/wxt@0.20.27_@types+node@22._c13784526c76306bd4ecdeabada10fa4/node_modules/wxt/dist/utils/internal/location-watcher.mjs
	var _globalThis$navigatio;
	var supportsNavigationApi = typeof ((_globalThis$navigatio = globalThis.navigation) === null || _globalThis$navigatio === void 0 ? void 0 : _globalThis$navigatio.addEventListener) === "function";
	/**
	* Create a util that watches for URL changes, dispatching the custom event when
	* detected. Stops watching when content script is invalidated. Uses Navigation
	* API when available, otherwise falls back to polling.
	*/
	function createLocationWatcher(ctx) {
		let lastUrl;
		let watching = false;
		return { run() {
			if (watching) return;
			watching = true;
			lastUrl = new URL(location.href);
			if (supportsNavigationApi) globalThis.navigation.addEventListener("navigate", (event) => {
				const newUrl = new URL(event.destination.url);
				if (newUrl.href === lastUrl.href) return;
				window.dispatchEvent(new WxtLocationChangeEvent(newUrl, lastUrl));
				lastUrl = newUrl;
			}, { signal: ctx.signal });
			else ctx.setInterval(() => {
				const newUrl = new URL(location.href);
				if (newUrl.href !== lastUrl.href) {
					window.dispatchEvent(new WxtLocationChangeEvent(newUrl, lastUrl));
					lastUrl = newUrl;
				}
			}, 1e3);
		} };
	}
	//#endregion
	//#region ../../node_modules/.pnpm/wxt@0.20.27_@types+node@22._c13784526c76306bd4ecdeabada10fa4/node_modules/wxt/dist/utils/content-script-context.mjs
	var _ContentScriptContext;
	/**
	* Implements
	* [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
	* Used to detect and stop content script code when the script is invalidated.
	*
	* It also provides several utilities like `ctx.setTimeout` and
	* `ctx.setInterval` that should be used in content scripts instead of
	* `window.setTimeout` or `window.setInterval`.
	*
	* To create context for testing, you can use the class's constructor:
	*
	* ```ts
	* import { ContentScriptContext } from 'wxt/utils/content-scripts-context';
	*
	* test('storage listener should be removed when context is invalidated', () => {
	*   const ctx = new ContentScriptContext('test');
	*   const item = storage.defineItem('local:count', { defaultValue: 0 });
	*   const watcher = vi.fn();
	*
	*   const unwatch = item.watch(watcher);
	*   ctx.onInvalidated(unwatch); // Listen for invalidate here
	*
	*   await item.setValue(1);
	*   expect(watcher).toBeCalledTimes(1);
	*   expect(watcher).toBeCalledWith(1, 0);
	*
	*   ctx.notifyInvalidated(); // Use this function to invalidate the context
	*   await item.setValue(2);
	*   expect(watcher).toBeCalledTimes(1);
	* });
	* ```
	*/
	var ContentScriptContext = (_ContentScriptContext = class ContentScriptContext {
		constructor(contentScriptName, options) {
			_defineProperty(this, "id", void 0);
			_defineProperty(this, "abortController", void 0);
			_defineProperty(this, "locationWatcher", createLocationWatcher(this));
			this.contentScriptName = contentScriptName;
			this.options = options;
			this.id = Math.random().toString(36).slice(2);
			this.abortController = new AbortController();
			this.stopOldScripts();
			this.listenForNewerScripts();
		}
		get signal() {
			return this.abortController.signal;
		}
		abort(reason) {
			return this.abortController.abort(reason);
		}
		get isInvalid() {
			var _browser$runtime;
			if (((_browser$runtime = browser.runtime) === null || _browser$runtime === void 0 ? void 0 : _browser$runtime.id) == null) this.notifyInvalidated();
			return this.signal.aborted;
		}
		get isValid() {
			return !this.isInvalid;
		}
		/**
		* Add a listener that is called when the content script's context is
		* invalidated.
		*
		* @example
		*   browser.runtime.onMessage.addListener(cb);
		*   const removeInvalidatedListener = ctx.onInvalidated(() => {
		*     browser.runtime.onMessage.removeListener(cb);
		*   });
		*   // ...
		*   removeInvalidatedListener();
		*
		* @returns A function to remove the listener.
		*/
		onInvalidated(cb) {
			this.signal.addEventListener("abort", cb);
			return () => this.signal.removeEventListener("abort", cb);
		}
		/**
		* Return a promise that never resolves. Useful if you have an async function
		* that shouldn't run after the context is expired.
		*
		* @example
		*   const getValueFromStorage = async () => {
		*     if (ctx.isInvalid) return ctx.block();
		*
		*     // ...
		*   };
		*/
		block() {
			return new Promise(() => {});
		}
		/**
		* Wrapper around `window.setInterval` that automatically clears the interval
		* when invalidated.
		*
		* Intervals can be cleared by calling the normal `clearInterval` function.
		*/
		setInterval(handler, timeout) {
			const id = setInterval(() => {
				if (this.isValid) handler();
			}, timeout);
			this.onInvalidated(() => clearInterval(id));
			return id;
		}
		/**
		* Wrapper around `window.setTimeout` that automatically clears the interval
		* when invalidated.
		*
		* Timeouts can be cleared by calling the normal `setTimeout` function.
		*/
		setTimeout(handler, timeout) {
			const id = setTimeout(() => {
				if (this.isValid) handler();
			}, timeout);
			this.onInvalidated(() => clearTimeout(id));
			return id;
		}
		/**
		* Wrapper around `window.requestAnimationFrame` that automatically cancels
		* the request when invalidated.
		*
		* Callbacks can be canceled by calling the normal `cancelAnimationFrame`
		* function.
		*/
		requestAnimationFrame(callback) {
			const id = requestAnimationFrame((...args) => {
				if (this.isValid) callback(...args);
			});
			this.onInvalidated(() => cancelAnimationFrame(id));
			return id;
		}
		/**
		* Wrapper around `window.requestIdleCallback` that automatically cancels the
		* request when invalidated.
		*
		* Callbacks can be canceled by calling the normal `cancelIdleCallback`
		* function.
		*/
		requestIdleCallback(callback, options) {
			const id = requestIdleCallback((...args) => {
				if (!this.signal.aborted) callback(...args);
			}, options);
			this.onInvalidated(() => cancelIdleCallback(id));
			return id;
		}
		addEventListener(target, type, handler, options) {
			var _target$addEventListe;
			if (type === "wxt:locationchange") {
				if (this.isValid) this.locationWatcher.run();
			}
			(_target$addEventListe = target.addEventListener) === null || _target$addEventListe === void 0 || _target$addEventListe.call(target, type.startsWith("wxt:") ? getUniqueEventName(type) : type, handler, _objectSpread2(_objectSpread2({}, options), {}, { signal: this.signal }));
		}
		/**
		* @internal
		* Abort the abort controller and execute all `onInvalidated` listeners.
		*/
		notifyInvalidated() {
			this.abort("Content script context invalidated");
			logger$1.debug(`Content script "${this.contentScriptName}" context invalidated`);
		}
		stopOldScripts() {
			var _this$options;
			document.dispatchEvent(new CustomEvent(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, { detail: {
				contentScriptName: this.contentScriptName,
				messageId: this.id
			} }));
			if (!((_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.noScriptStartedPostMessage)) window.postMessage({
				type: ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE,
				contentScriptName: this.contentScriptName,
				messageId: this.id
			}, "*");
		}
		verifyScriptStartedEvent(event) {
			var _event$detail, _event$detail2;
			const isSameContentScript = ((_event$detail = event.detail) === null || _event$detail === void 0 ? void 0 : _event$detail.contentScriptName) === this.contentScriptName;
			const isFromSelf = ((_event$detail2 = event.detail) === null || _event$detail2 === void 0 ? void 0 : _event$detail2.messageId) === this.id;
			return isSameContentScript && !isFromSelf;
		}
		listenForNewerScripts() {
			const cb = (event) => {
				if (!(event instanceof CustomEvent) || !this.verifyScriptStartedEvent(event)) return;
				this.notifyInvalidated();
			};
			document.addEventListener(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, cb);
			this.onInvalidated(() => document.removeEventListener(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, cb));
		}
	}, _defineProperty(_ContentScriptContext, "SCRIPT_STARTED_MESSAGE_TYPE", getUniqueEventName("wxt:content-script-started")), _ContentScriptContext);
	//#endregion
	//#region \0@oxc-project+runtime@0.146.0/helpers/esm/objectWithoutPropertiesLoose.js
	function _objectWithoutPropertiesLoose(r, e) {
		if (null == r) return {};
		var t = {};
		for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
			if (e.includes(n)) continue;
			t[n] = r[n];
		}
		return t;
	}
	//#endregion
	//#region \0@oxc-project+runtime@0.146.0/helpers/esm/objectWithoutProperties.js
	function _objectWithoutProperties(e, t) {
		if (null == e) return {};
		var o, r, i = _objectWithoutPropertiesLoose(e, t);
		if (Object.getOwnPropertySymbols) {
			var s = Object.getOwnPropertySymbols(e);
			for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
		}
		return i;
	}
	//#endregion
	//#region \0virtual:wxt-content-script-isolated-world-entrypoint?C:/Users/pc/Downloads/Opus-4.8-Unleashed/ClaudeJB/chrome-mcp/base-mcp-chrome/app/chrome-extension/entrypoints/quick-panel.content.ts
	var _excluded = ["main"];
	/** Wrapper around `console` with a "[wxt]" prefix */
	var logger = {
		debug: (...args) => ([...args], void 0),
		log: (...args) => ([...args], void 0),
		warn: (...args) => ([...args], void 0),
		error: (...args) => ([...args], void 0)
	};
	//#endregion
	return _asyncToGenerator(function* () {
		try {
			const { main } = quick_panel_content_default;
			return yield main(new ContentScriptContext("quick-panel", _objectWithoutProperties(quick_panel_content_default, _excluded)));
		} catch (err) {
			logger.error(`The content script "quick-panel" crashed on startup!`, err);
			throw err;
		}
	})();
})();

quickPanel;