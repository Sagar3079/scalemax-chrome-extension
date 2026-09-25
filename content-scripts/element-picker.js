var elementPicker = (function() {
	//#region ../../node_modules/.pnpm/wxt@0.20.27_@types+node@22._c13784526c76306bd4ecdeabada10fa4/node_modules/wxt/dist/utils/define-content-script.mjs
	function defineContentScript(definition) {
		return definition;
	}
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
	var DEFAULT_HOST_ID$1 = "__scalemax_quick_panel_host__";
	var UI_CONTAINER_ID = "__scalemax_quick_panel_ui__";
	var ROOT_ID = "__scalemax_quick_panel_root__";
	/** Highest possible z-index to ensure Quick Panel is on top */
	var DEFAULT_Z_INDEX$1 = 2147483647;
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
		const hostId = (_options$hostId = options.hostId) !== null && _options$hostId !== void 0 ? _options$hostId : DEFAULT_HOST_ID$1;
		const zIndex = (_options$zIndex = options.zIndex) !== null && _options$zIndex !== void 0 ? _options$zIndex : DEFAULT_Z_INDEX$1;
		const existing = document.getElementById(hostId);
		if (existing) try {
			existing.remove();
		} catch (_unused3) {}
		const host = document.createElement("div");
		host.id = hostId;
		host.setAttribute("data-scalemax-quick-panel", "true");
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
	//#region shared/element-picker/controller.ts
	/**
	* Element Picker Controller
	*
	* Creates and manages the Element Picker Panel UI, which displays:
	* - List of element requests from the AI
	* - Current selection status for each request
	* - Countdown timer
	* - Cancel/Confirm actions
	*/
	var DEFAULT_HOST_ID = "__scalemax_element_picker_host__";
	var DEFAULT_Z_INDEX = 2147483647;
	var ELEMENT_PICKER_STYLES = `
  /* Overlay positioning - bottom-right corner */
  .ep-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 16px;
    pointer-events: none;
  }

  /* Panel sizing */
  .ep-panel {
    width: min(480px, calc(100vw - 32px));
    max-height: min(600px, calc(100vh - 32px));
    pointer-events: auto;
  }

  /* Countdown badge */
  .ep-countdown {
    font-family: var(--ac-font-code);
    font-size: 12px;
    color: var(--ac-text-muted);
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid var(--qp-glass-divider);
    background: color-mix(in srgb, var(--qp-glass-input-bg) 80%, transparent);
    user-select: none;
    white-space: nowrap;
  }

  .ep-countdown--warning {
    color: var(--ac-warning);
    border-color: color-mix(in srgb, var(--ac-warning) 40%, var(--qp-glass-divider));
  }

  .ep-countdown--danger {
    color: var(--ac-danger);
    border-color: color-mix(in srgb, var(--ac-danger) 40%, var(--qp-glass-divider));
    animation: ep-pulse 1s ease-in-out infinite;
  }

  @keyframes ep-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  /* Hint text */
  .ep-hint {
    margin: 0 0 10px 0;
    font-size: 12px;
    color: var(--ac-text-muted);
  }

  /* Error banner */
  .ep-error {
    margin: 0 0 10px 0;
    padding: 8px 10px;
    border-radius: var(--ac-radius-card);
    border: 1px solid color-mix(in srgb, var(--ac-danger) 55%, var(--ac-border));
    background: color-mix(in srgb, var(--ac-danger) 10%, transparent);
    color: color-mix(in srgb, var(--ac-danger) 85%, var(--ac-text));
    font-size: 12px;
  }

  /* Request list */
  .ep-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* Request item card */
  .ep-item {
    border-radius: var(--ac-radius-card);
    border: var(--ac-border-width) solid var(--ac-border);
    box-shadow: var(--ac-shadow-card);
    background: var(--ac-surface);
    padding: 10px 12px;
    transition: border-color var(--ac-motion-fast), box-shadow var(--ac-motion-fast);
  }

  .ep-item--active {
    border-color: color-mix(in srgb, var(--ac-accent) 55%, var(--ac-border));
    box-shadow:
      0 0 0 2px color-mix(in srgb, var(--ac-accent-subtle) 65%, transparent),
      var(--ac-shadow-card);
  }

  /* Item header */
  .ep-item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .ep-item-title {
    min-width: 0;
    font-weight: 600;
    font-size: 13px;
    color: var(--ac-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Status badge */
  .ep-badge {
    flex: none;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 999px;
    border: 1px solid var(--qp-glass-divider);
    color: var(--ac-text-muted);
    background: color-mix(in srgb, var(--ac-surface-muted) 65%, transparent);
    user-select: none;
  }

  .ep-badge--selected {
    border-color: color-mix(in srgb, var(--ac-success) 55%, var(--qp-glass-divider));
    color: color-mix(in srgb, var(--ac-success) 85%, var(--ac-text));
    background: color-mix(in srgb, var(--ac-success) 10%, transparent);
  }

  .ep-badge--picking {
    border-color: color-mix(in srgb, var(--ac-accent) 55%, var(--qp-glass-divider));
    color: var(--ac-accent);
    background: color-mix(in srgb, var(--ac-accent) 10%, transparent);
    animation: ep-pulse 1.5s ease-in-out infinite;
  }

  /* Description text */
  .ep-desc {
    margin-top: 6px;
    font-size: 12px;
    color: var(--ac-text-muted);
    white-space: pre-wrap;
  }

  /* Picked element info */
  .ep-picked {
    margin-top: 8px;
    font-size: 12px;
    color: var(--ac-text);
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    border-radius: var(--ac-radius-inner);
    background: var(--ac-surface-muted);
  }

  .ep-picked-text {
    font-weight: 500;
    word-break: break-word;
  }

  .ep-picked-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    font-size: 11px;
  }

  .ep-picked code {
    font-family: var(--ac-font-code);
    font-size: 10px;
    color: var(--ac-text-muted);
    padding: 2px 4px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.05);
    word-break: break-all;
  }

  /* Action buttons row */
  .ep-actions {
    margin-top: 8px;
    display: flex;
    gap: 8px;
  }

  /* Footer */
  .ep-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .ep-footer-left {
    font-size: 11px;
    color: var(--ac-text-muted);
  }

  .ep-footer-right {
    display: flex;
    gap: 8px;
  }
`;
	function formatCountdown(deadlineTs) {
		const remainingMs = Math.max(0, deadlineTs - Date.now());
		const totalSeconds = Math.floor(remainingMs / 1e3);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		const text = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
		let level = "normal";
		if (totalSeconds <= 30) level = "danger";
		else if (totalSeconds <= 60) level = "warning";
		return {
			text,
			level
		};
	}
	function truncate(text, max = 80) {
		const t = String(text || "").trim().replace(/\s+/g, " ");
		if (t.length <= max) return t;
		return `${t.slice(0, Math.max(0, max - 1))}...`;
	}
	function createElementPickerController(options = {}) {
		var _options$hostId, _options$zIndex;
		let disposed = false;
		let shadowHost = null;
		let elements = null;
		let disposer = null;
		let state = null;
		let overlayEl = null;
		let panelEl = null;
		let countdownEl = null;
		let errorEl = null;
		let listEl = null;
		let confirmBtn = null;
		let cancelBtn = null;
		let progressEl = null;
		let timerId = null;
		const itemElementsMap = /* @__PURE__ */ new Map();
		const hostId = (_options$hostId = options.hostId) !== null && _options$hostId !== void 0 ? _options$hostId : DEFAULT_HOST_ID;
		const zIndex = (_options$zIndex = options.zIndex) !== null && _options$zIndex !== void 0 ? _options$zIndex : DEFAULT_Z_INDEX;
		function ensureMounted() {
			if (shadowHost && elements) return;
			shadowHost = mountQuickPanelShadowHost({
				hostId,
				zIndex
			});
			elements = shadowHost.getElements();
			if (!elements) throw new Error("Failed to mount Element Picker shadow host");
			const localDisposer = new Disposer();
			disposer = localDisposer;
			const styleEl = document.createElement("style");
			styleEl.textContent = ELEMENT_PICKER_STYLES;
			elements.shadowRoot.append(styleEl);
			localDisposer.add(() => styleEl.remove());
			overlayEl = document.createElement("div");
			overlayEl.className = "ep-overlay";
			panelEl = document.createElement("div");
			panelEl.className = "qp-panel qp-liquid-shimmer ep-panel";
			panelEl.setAttribute("role", "dialog");
			panelEl.setAttribute("aria-modal", "false");
			panelEl.setAttribute("aria-label", "Element Picker");
			const headerEl = document.createElement("div");
			headerEl.className = "qp-header";
			const headerLeft = document.createElement("div");
			headerLeft.className = "qp-header-left";
			const brand = document.createElement("div");
			brand.className = "qp-brand";
			brand.textContent = "👆";
			const title = document.createElement("div");
			title.className = "qp-title";
			const titleName = document.createElement("div");
			titleName.className = "qp-title-name";
			titleName.textContent = "Element Picker";
			const titleSub = document.createElement("div");
			titleSub.className = "qp-title-sub";
			titleSub.textContent = "Click on the requested elements";
			title.append(titleName, titleSub);
			headerLeft.append(brand, title);
			const headerRight = document.createElement("div");
			headerRight.className = "qp-header-right";
			countdownEl = document.createElement("span");
			countdownEl.className = "ep-countdown";
			countdownEl.textContent = "03:00";
			headerRight.append(countdownEl);
			headerEl.append(headerLeft, headerRight);
			const contentEl = document.createElement("div");
			contentEl.className = "qp-content ac-scroll";
			const hintEl = document.createElement("div");
			hintEl.className = "ep-hint";
			hintEl.textContent = "Click on each element the AI needs. Press Esc to cancel.";
			errorEl = document.createElement("div");
			errorEl.className = "ep-error";
			errorEl.hidden = true;
			listEl = document.createElement("div");
			listEl.className = "ep-list";
			contentEl.append(hintEl, errorEl, listEl);
			const footerEl = document.createElement("div");
			footerEl.className = "qp-composer";
			const footerInner = document.createElement("div");
			footerInner.className = "ep-footer";
			const footerLeft = document.createElement("div");
			footerLeft.className = "ep-footer-left";
			progressEl = document.createElement("span");
			progressEl.textContent = "0/0 selected";
			footerLeft.append(progressEl);
			const footerRight = document.createElement("div");
			footerRight.className = "ep-footer-right";
			cancelBtn = document.createElement("button");
			cancelBtn.type = "button";
			cancelBtn.className = "qp-btn ac-btn ac-focus-ring";
			cancelBtn.textContent = "Cancel";
			confirmBtn = document.createElement("button");
			confirmBtn.type = "button";
			confirmBtn.className = "qp-btn ac-btn ac-focus-ring qp-btn--primary";
			confirmBtn.textContent = "Confirm";
			footerRight.append(cancelBtn, confirmBtn);
			footerInner.append(footerLeft, footerRight);
			footerEl.append(footerInner);
			panelEl.append(headerEl, contentEl, footerEl);
			overlayEl.append(panelEl);
			elements.root.append(overlayEl);
			localDisposer.add(() => overlayEl === null || overlayEl === void 0 ? void 0 : overlayEl.remove());
			localDisposer.listen(cancelBtn, "click", () => {
				var _options$onCancel;
				return (_options$onCancel = options.onCancel) === null || _options$onCancel === void 0 ? void 0 : _options$onCancel.call(options);
			});
			localDisposer.listen(confirmBtn, "click", () => {
				var _options$onConfirm;
				return (_options$onConfirm = options.onConfirm) === null || _options$onConfirm === void 0 ? void 0 : _options$onConfirm.call(options);
			});
			const handleEscKey = (e) => {
				if (e instanceof KeyboardEvent && e.key === "Escape") {
					var _options$onCancel2;
					e.preventDefault();
					e.stopPropagation();
					(_options$onCancel2 = options.onCancel) === null || _options$onCancel2 === void 0 || _options$onCancel2.call(options);
				}
			};
			elements.shadowRoot.addEventListener("keydown", handleEscKey, { capture: true });
			localDisposer.add(() => elements === null || elements === void 0 ? void 0 : elements.shadowRoot.removeEventListener("keydown", handleEscKey, { capture: true }));
		}
		function clearTimer() {
			if (timerId !== null) {
				clearInterval(timerId);
				timerId = null;
			}
		}
		/**
		* Render only the countdown timer (called frequently by interval).
		*/
		function renderCountdown() {
			if (!state || !countdownEl) return;
			const countdown = formatCountdown(state.deadlineTs);
			countdownEl.textContent = countdown.text;
			countdownEl.className = `ep-countdown${countdown.level !== "normal" ? ` ep-countdown--${countdown.level}` : ""}`;
		}
		/**
		* Create a picked element info container.
		*/
		function createPickedInfoEl(picked) {
			const pickedEl = document.createElement("div");
			pickedEl.className = "ep-picked";
			if (picked.text) {
				const textEl = document.createElement("div");
				textEl.className = "ep-picked-text";
				textEl.textContent = `"${truncate(picked.text, 80)}"`;
				pickedEl.append(textEl);
			}
			const metaEl = document.createElement("div");
			metaEl.className = "ep-picked-meta";
			const tagCode = document.createElement("code");
			tagCode.textContent = picked.tagName || "element";
			metaEl.append(tagCode);
			const refCode = document.createElement("code");
			refCode.textContent = `ref=${picked.ref}`;
			metaEl.append(refCode);
			if (picked.frameId > 0) {
				const frameCode = document.createElement("code");
				frameCode.textContent = `frame=${picked.frameId}`;
				metaEl.append(frameCode);
			}
			pickedEl.append(metaEl);
			const selectorEl = document.createElement("div");
			const selectorCode = document.createElement("code");
			selectorCode.textContent = truncate(picked.selector || "", 100);
			selectorEl.append(selectorCode);
			pickedEl.append(selectorEl);
			return pickedEl;
		}
		/**
		* Create a single request item element.
		*/
		function createItemEl(req) {
			const item = document.createElement("div");
			item.className = "ep-item";
			item.dataset.requestId = req.id;
			const header = document.createElement("div");
			header.className = "ep-item-header";
			const titleEl = document.createElement("div");
			titleEl.className = "ep-item-title";
			titleEl.textContent = req.name;
			const badge = document.createElement("div");
			badge.className = "ep-badge";
			badge.textContent = "Pending";
			header.append(titleEl, badge);
			item.append(header);
			if (req.description) {
				const desc = document.createElement("div");
				desc.className = "ep-desc";
				desc.textContent = req.description;
				item.append(desc);
			}
			const actions = document.createElement("div");
			actions.className = "ep-actions";
			const pickBtn = document.createElement("button");
			pickBtn.type = "button";
			pickBtn.className = "qp-btn ac-btn ac-focus-ring";
			pickBtn.textContent = "Pick";
			pickBtn.addEventListener("click", () => {
				var _options$onSetActiveR;
				return (_options$onSetActiveR = options.onSetActiveRequest) === null || _options$onSetActiveR === void 0 ? void 0 : _options$onSetActiveR.call(options, req.id);
			});
			const clearBtn = document.createElement("button");
			clearBtn.type = "button";
			clearBtn.className = "qp-btn ac-btn ac-focus-ring";
			clearBtn.textContent = "Clear";
			clearBtn.disabled = true;
			clearBtn.addEventListener("click", () => {
				var _options$onClearSelec;
				return (_options$onClearSelec = options.onClearSelection) === null || _options$onClearSelec === void 0 ? void 0 : _options$onClearSelec.call(options, req.id);
			});
			actions.append(pickBtn, clearBtn);
			item.append(actions);
			return {
				container: item,
				badge,
				pickedContainer: null,
				pickBtn,
				clearBtn
			};
		}
		/**
		* Update a single item's display state.
		*/
		function updateItemEl(itemEls, req, picked, isActive) {
			const { container, badge, pickBtn, clearBtn } = itemEls;
			container.classList.toggle("ep-item--active", isActive);
			if (picked) {
				badge.className = "ep-badge ep-badge--selected";
				badge.textContent = "Selected";
			} else if (isActive) {
				badge.className = "ep-badge ep-badge--picking";
				badge.textContent = "Picking...";
			} else {
				badge.className = "ep-badge";
				badge.textContent = "Pending";
			}
			pickBtn.textContent = isActive ? "Picking..." : "Pick";
			pickBtn.disabled = isActive;
			clearBtn.disabled = !picked;
			const actionsEl = container.querySelector(".ep-actions");
			if (picked) {
				if (!itemEls.pickedContainer) {
					var _actionsEl$parentNode;
					const pickedEl = createPickedInfoEl(picked);
					actionsEl === null || actionsEl === void 0 || (_actionsEl$parentNode = actionsEl.parentNode) === null || _actionsEl$parentNode === void 0 || _actionsEl$parentNode.insertBefore(pickedEl, actionsEl);
					itemEls.pickedContainer = pickedEl;
				} else {
					const newPickedEl = createPickedInfoEl(picked);
					itemEls.pickedContainer.replaceWith(newPickedEl);
					itemEls.pickedContainer = newPickedEl;
				}
			} else if (itemEls.pickedContainer) {
				itemEls.pickedContainer.remove();
				itemEls.pickedContainer = null;
			}
		}
		/**
		* Build the list initially or rebuild if requests changed.
		*/
		function buildList() {
			if (!state || !listEl) return;
			listEl.innerHTML = "";
			itemElementsMap.clear();
			for (const req of state.requests) {
				const itemEls = createItemEl(req);
				itemElementsMap.set(req.id, itemEls);
				listEl.append(itemEls.container);
			}
		}
		/**
		* Full render - updates all dynamic parts.
		*/
		function render() {
			if (!state || !listEl || !countdownEl || !confirmBtn || !errorEl || !progressEl) return;
			renderCountdown();
			const err = state.errorMessage ? state.errorMessage.trim() : "";
			if (err) {
				errorEl.hidden = false;
				errorEl.textContent = err;
			} else {
				errorEl.hidden = true;
				errorEl.textContent = "";
			}
			if (itemElementsMap.size !== state.requests.length || state.requests.some((r) => !itemElementsMap.has(r.id))) buildList();
			let selectedCount = 0;
			for (const req of state.requests) {
				const picked = state.selections[req.id] || null;
				const isActive = state.activeRequestId === req.id;
				if (picked) selectedCount++;
				const itemEls = itemElementsMap.get(req.id);
				if (itemEls) updateItemEl(itemEls, req, picked, isActive);
			}
			progressEl.textContent = `${selectedCount}/${state.requests.length} selected`;
			const allSelected = selectedCount === state.requests.length;
			confirmBtn.disabled = !allSelected;
			confirmBtn.textContent = allSelected ? "Confirm" : `Confirm (${selectedCount}/${state.requests.length})`;
		}
		function show(next) {
			if (disposed) return;
			ensureMounted();
			state = next;
			render();
			clearTimer();
			timerId = setInterval(() => {
				if (disposed || !state) return;
				renderCountdown();
			}, 250);
		}
		function update(patch) {
			var _patch$requests, _patch$activeRequestI, _patch$selections, _patch$deadlineTs, _patch$errorMessage;
			if (disposed) return;
			if (!state || state.sessionId !== patch.sessionId) return;
			state = _objectSpread2(_objectSpread2(_objectSpread2({}, state), patch), {}, {
				sessionId: state.sessionId,
				requests: (_patch$requests = patch.requests) !== null && _patch$requests !== void 0 ? _patch$requests : state.requests,
				activeRequestId: (_patch$activeRequestI = patch.activeRequestId) !== null && _patch$activeRequestI !== void 0 ? _patch$activeRequestI : state.activeRequestId,
				selections: (_patch$selections = patch.selections) !== null && _patch$selections !== void 0 ? _patch$selections : state.selections,
				deadlineTs: (_patch$deadlineTs = patch.deadlineTs) !== null && _patch$deadlineTs !== void 0 ? _patch$deadlineTs : state.deadlineTs,
				errorMessage: (_patch$errorMessage = patch.errorMessage) !== null && _patch$errorMessage !== void 0 ? _patch$errorMessage : state.errorMessage
			});
			render();
		}
		function hide() {
			clearTimer();
			state = null;
			itemElementsMap.clear();
			try {
				disposer === null || disposer === void 0 || disposer.dispose();
			} finally {
				disposer = null;
			}
			overlayEl = null;
			panelEl = null;
			countdownEl = null;
			errorEl = null;
			listEl = null;
			confirmBtn = null;
			cancelBtn = null;
			progressEl = null;
			try {
				shadowHost === null || shadowHost === void 0 || shadowHost.dispose();
			} finally {
				shadowHost = null;
				elements = null;
			}
		}
		function dispose() {
			if (disposed) return;
			disposed = true;
			hide();
		}
		return {
			show,
			update,
			hide,
			isVisible: () => !!shadowHost && !!elements,
			dispose
		};
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
	//#region entrypoints/element-picker.content.ts
	/**
	* Element Picker Content Script
	*
	* Renders the Element Picker Panel UI (Quick Panel style) and forwards UI events
	* to background while a chrome_request_element_selection session is active.
	*
	* This script only runs in the top frame and handles:
	* - Displaying the element picker panel UI
	* - Forwarding user actions (cancel, confirm, etc.) to background
	* - Receiving state updates from background
	*/
	var element_picker_content_default = defineContentScript({
		matches: ["<all_urls>"],
		runAt: "document_idle",
		main() {
			if (window.top !== window) return;
			let controller = null;
			let currentSessionId = null;
			/**
			* Ensure the controller is created and configured.
			*/
			function ensureController() {
				if (controller) return controller;
				controller = createElementPickerController({
					onCancel: () => {
						if (!currentSessionId) return;
						chrome.runtime.sendMessage({
							type: BACKGROUND_MESSAGE_TYPES.ELEMENT_PICKER_UI_EVENT,
							sessionId: currentSessionId,
							event: "cancel"
						});
					},
					onConfirm: () => {
						if (!currentSessionId) return;
						chrome.runtime.sendMessage({
							type: BACKGROUND_MESSAGE_TYPES.ELEMENT_PICKER_UI_EVENT,
							sessionId: currentSessionId,
							event: "confirm"
						});
					},
					onSetActiveRequest: (requestId) => {
						if (!currentSessionId) return;
						chrome.runtime.sendMessage({
							type: BACKGROUND_MESSAGE_TYPES.ELEMENT_PICKER_UI_EVENT,
							sessionId: currentSessionId,
							event: "set_active_request",
							requestId
						});
					},
					onClearSelection: (requestId) => {
						if (!currentSessionId) return;
						chrome.runtime.sendMessage({
							type: BACKGROUND_MESSAGE_TYPES.ELEMENT_PICKER_UI_EVENT,
							sessionId: currentSessionId,
							event: "clear_selection",
							requestId
						});
					}
				});
				return controller;
			}
			/**
			* Handle incoming messages from background.
			*/
			function handleMessage(message, _sender, sendResponse) {
				const msg = message;
				if (!(msg === null || msg === void 0 ? void 0 : msg.action)) return false;
				if (msg.action === TOOL_MESSAGE_TYPES.ELEMENT_PICKER_UI_PING) {
					sendResponse({ success: true });
					return true;
				}
				if (msg.action === TOOL_MESSAGE_TYPES.ELEMENT_PICKER_UI_SHOW) {
					var _showMsg$activeReques;
					const showMsg = msg;
					currentSessionId = typeof showMsg.sessionId === "string" ? showMsg.sessionId : null;
					if (!currentSessionId) {
						sendResponse({
							success: false,
							error: "Missing sessionId"
						});
						return true;
					}
					const ctrl = ensureController();
					const initialState = {
						sessionId: currentSessionId,
						requests: Array.isArray(showMsg.requests) ? showMsg.requests : [],
						activeRequestId: (_showMsg$activeReques = showMsg.activeRequestId) !== null && _showMsg$activeReques !== void 0 ? _showMsg$activeReques : null,
						selections: {},
						deadlineTs: typeof showMsg.deadlineTs === "number" ? showMsg.deadlineTs : Date.now(),
						errorMessage: null
					};
					ctrl.show(initialState);
					sendResponse({ success: true });
					return true;
				}
				if (msg.action === TOOL_MESSAGE_TYPES.ELEMENT_PICKER_UI_UPDATE) {
					var _updateMsg$activeRequ, _updateMsg$errorMessa;
					const updateMsg = msg;
					if (!currentSessionId || updateMsg.sessionId !== currentSessionId) {
						sendResponse({
							success: false,
							error: "Session mismatch"
						});
						return true;
					}
					controller === null || controller === void 0 || controller.update({
						sessionId: currentSessionId,
						activeRequestId: (_updateMsg$activeRequ = updateMsg.activeRequestId) !== null && _updateMsg$activeRequ !== void 0 ? _updateMsg$activeRequ : null,
						selections: updateMsg.selections || {},
						deadlineTs: updateMsg.deadlineTs,
						errorMessage: (_updateMsg$errorMessa = updateMsg.errorMessage) !== null && _updateMsg$errorMessa !== void 0 ? _updateMsg$errorMessa : null
					});
					sendResponse({ success: true });
					return true;
				}
				if (msg.action === TOOL_MESSAGE_TYPES.ELEMENT_PICKER_UI_HIDE) {
					if (currentSessionId && msg.sessionId !== currentSessionId) console.warn("[ElementPicker] Session mismatch on hide, hiding anyway");
					controller === null || controller === void 0 || controller.hide();
					currentSessionId = null;
					sendResponse({ success: true });
					return true;
				}
				return false;
			}
			chrome.runtime.onMessage.addListener(handleMessage);
			// `unload` is deprecated and actively blocked by many sites via a
			// `Permissions-Policy: unload=()` header (it defeats the back/forward cache),
			// which is exactly what produced the "Permissions policy violation: unload is
			// not allowed in this document" error on pages like this one. `pagehide` does
			// the same cleanup job — fires on tab close, navigation, and reload — without
			// being deprecated or blockable this way.
			window.addEventListener("pagehide", () => {
				chrome.runtime.onMessage.removeListener(handleMessage);
				controller === null || controller === void 0 || controller.dispose();
				controller = null;
				currentSessionId = null;
			});
			// When the page is restored from the back/forward cache this script does
			// not run again, so re-attach the listener removed in `pagehide` above
			// (the controller is re-created lazily by ensureController()).
			window.addEventListener("pageshow", (event) => {
				if (!event.persisted) return;
				try {
					if (!chrome.runtime.onMessage.hasListener(handleMessage)) chrome.runtime.onMessage.addListener(handleMessage);
				} catch (err) {
					console.warn("[ElementPicker] Failed to re-attach message listener after bfcache restore:", err);
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
		return `${browser === null || browser === void 0 || (_browser$runtime = browser.runtime) === null || _browser$runtime === void 0 ? void 0 : _browser$runtime.id}:element-picker:${eventName}`;
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
	//#region \0virtual:wxt-content-script-isolated-world-entrypoint?entrypoints/element-picker.content.ts
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
			const { main } = element_picker_content_default;
			return yield main(new ContentScriptContext("element-picker", _objectWithoutProperties(element_picker_content_default, _excluded)));
		} catch (err) {
			logger.error(`The content script "element-picker" crashed on startup!`, err);
			throw err;
		}
	})();
})();

elementPicker;