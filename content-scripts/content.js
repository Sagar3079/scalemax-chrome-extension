var content = (function() {
	//#region ../../node_modules/.pnpm/wxt@0.20.27_@types+node@22._c13784526c76306bd4ecdeabada10fa4/node_modules/wxt/dist/utils/define-content-script.mjs
	function defineContentScript(definition) {
		return definition;
	}
	//#endregion
	//#region entrypoints/content.ts
	var content_default = defineContentScript({
		matches: ["*://*.google.com/*"],
		main() {}
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
		return `${browser === null || browser === void 0 || (_browser$runtime = browser.runtime) === null || _browser$runtime === void 0 ? void 0 : _browser$runtime.id}:content:${eventName}`;
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
	//#region \0virtual:wxt-content-script-isolated-world-entrypoint?C:/Users/pc/Downloads/Opus-4.8-Unleashed/ClaudeJB/chrome-mcp/base-mcp-chrome/app/chrome-extension/entrypoints/content.ts
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
			const { main } = content_default;
			return yield main(new ContentScriptContext("content", _objectWithoutProperties(content_default, _excluded)));
		} catch (err) {
			logger.error(`The content script "content" crashed on startup!`, err);
			throw err;
		}
	})();
})();

content;