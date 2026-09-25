import { n as init_asyncToGenerator, t as _asyncToGenerator } from "./asyncToGenerator-HxMCLN5T.js";
import { M as onUnmounted, f as computed, nt as shallowRef, tt as ref } from "./_plugin-vue_export-helper-DCRN0gge.js";
//#region entrypoints/background/record-replay-v3/engine/transport/rpc.ts
/** Port 名称 */
var RR_V3_PORT_NAME = "rr_v3";
/**
* 生成唯一的请求 ID
*/
function generateRequestId() {
	return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
/**
* 判断消息是否为 RPC 响应
*/
function isRpcResponse(msg) {
	return typeof msg === "object" && msg !== null && msg.type === "rr_v3.response";
}
/**
* 判断消息是否为 RPC 事件
*/
function isRpcEvent(msg) {
	return typeof msg === "object" && msg !== null && msg.type === "rr_v3.event";
}
/**
* 创建 RPC 请求
*/
function createRpcRequest(method, params) {
	return {
		type: "rr_v3.request",
		requestId: generateRequestId(),
		method,
		params
	};
}
//#endregion
//#region entrypoints/shared/composables/useRRV3Rpc.ts
/**
* @fileoverview RR V3 Port-RPC Client Composable (Shared)
* @description RPC client for UI components to connect with Background Service Worker
*
* This composable is shared between Sidepanel, Builder, and other UI entrypoints.
*
* Responsibilities:
* - Connect to background via chrome.runtime.Port
* - Provide request/response RPC calls (with timeout and cancellation)
* - Support event stream subscription
* - Auto-reconnect with exponential backoff
*
* Design considerations:
* - MV3 service worker may be terminated due to idle, causing Port disconnect
* - Implement idempotent reconnection and subscription recovery
*/
init_asyncToGenerator();
function toErrorMessage(error) {
	return error instanceof Error ? error.message : String(error);
}
function isRunEvent(value) {
	if (typeof value !== "object" || value === null) return false;
	const obj = value;
	return typeof obj.runId === "string" && typeof obj.type === "string" && typeof obj.seq === "number" && typeof obj.ts === "number";
}
/**
* RR V3 Port-RPC client
*/
function useRRV3Rpc(options = {}) {
	var _options$requestTimeo, _options$maxReconnect, _options$baseReconnec;
	const DEFAULT_TIMEOUT_MS = (_options$requestTimeo = options.requestTimeoutMs) !== null && _options$requestTimeo !== void 0 ? _options$requestTimeo : 12e3;
	const MAX_RECONNECT_ATTEMPTS = (_options$maxReconnect = options.maxReconnectAttempts) !== null && _options$maxReconnect !== void 0 ? _options$maxReconnect : 8;
	const BASE_RECONNECT_DELAY_MS = (_options$baseReconnec = options.baseReconnectDelayMs) !== null && _options$baseReconnec !== void 0 ? _options$baseReconnec : 500;
	const connected = ref(false);
	const connecting = ref(false);
	const reconnecting = ref(false);
	const reconnectAttempts = ref(0);
	const lastError = ref(null);
	const pendingCount = ref(0);
	const subscribedRunIds = ref([]);
	const port = shallowRef(null);
	const pendingRequests = /* @__PURE__ */ new Map();
	const eventListeners = /* @__PURE__ */ new Set();
	const desiredSubscriptions = /* @__PURE__ */ new Set();
	let connectPromise = null;
	let reconnectTimer = null;
	let manualDisconnect = false;
	const isReady = computed(() => connected.value && port.value !== null);
	function setError(message) {
		var _options$onError;
		lastError.value = message;
		if (message) (_options$onError = options.onError) === null || _options$onError === void 0 || _options$onError.call(options, message);
	}
	function setConnected(next) {
		var _options$onConnection;
		if (connected.value === next) return;
		connected.value = next;
		(_options$onConnection = options.onConnectionChange) === null || _options$onConnection === void 0 || _options$onConnection.call(options, next);
	}
	function syncSubscriptionsSnapshot() {
		const arr = Array.from(desiredSubscriptions.values());
		arr.sort((a, b) => {
			if (a === null && b === null) return 0;
			if (a === null) return -1;
			if (b === null) return 1;
			return String(a).localeCompare(String(b));
		});
		subscribedRunIds.value = arr;
	}
	/**
	* Clean up a pending request entry (timeout, abort listener)
	*/
	function cleanupPendingRequest(entry) {
		if (entry.timeoutId) {
			clearTimeout(entry.timeoutId);
			entry.timeoutId = null;
		}
		if (entry.signal && entry.abortHandler) try {
			entry.signal.removeEventListener("abort", entry.abortHandler);
		} catch (_unused) {}
	}
	function rejectAllPending(reason) {
		const error = new Error(reason);
		for (const [requestId, entry] of pendingRequests) {
			cleanupPendingRequest(entry);
			entry.reject(error);
			pendingRequests.delete(requestId);
		}
		pendingCount.value = 0;
	}
	function rehydrateSubscriptions() {
		return _rehydrateSubscriptions.apply(this, arguments);
	}
	function _rehydrateSubscriptions() {
		_rehydrateSubscriptions = _asyncToGenerator(function* () {
			if (!isReady.value || desiredSubscriptions.size === 0) return;
			for (const runId of desiredSubscriptions) try {
				yield request("rr_v3.subscribe", runId === null ? {} : { runId }).catch(() => {});
			} catch (_unused2) {}
		});
		return _rehydrateSubscriptions.apply(this, arguments);
	}
	function scheduleReconnect() {
		if (manualDisconnect || reconnectTimer) return;
		if (reconnectAttempts.value >= MAX_RECONNECT_ATTEMPTS) {
			reconnecting.value = false;
			setError("RR V3 RPC: max reconnect attempts reached");
			return;
		}
		reconnecting.value = true;
		const delay = BASE_RECONNECT_DELAY_MS * Math.pow(2, reconnectAttempts.value);
		reconnectTimer = setTimeout(() => {
			reconnectTimer = null;
			reconnectAttempts.value += 1;
			connect().then((ok) => {
				if (!ok) scheduleReconnect();
			});
		}, delay);
	}
	function handlePortDisconnect() {
		var _chrome$runtime$lastE;
		const disconnectReason = (_chrome$runtime$lastE = chrome.runtime.lastError) === null || _chrome$runtime$lastE === void 0 ? void 0 : _chrome$runtime$lastE.message;
		const reason = disconnectReason ? `RR V3 RPC disconnected: ${disconnectReason}` : "RR V3 RPC disconnected";
		port.value = null;
		setConnected(false);
		connecting.value = false;
		rejectAllPending(reason);
		if (!manualDisconnect) {
			setError(reason);
			scheduleReconnect();
		}
	}
	function handlePortMessage(msg) {
		if (isRpcResponse(msg)) {
			const entry = pendingRequests.get(msg.requestId);
			if (!entry) return;
			pendingRequests.delete(msg.requestId);
			pendingCount.value = pendingRequests.size;
			cleanupPendingRequest(entry);
			if (msg.ok) entry.resolve(msg.result);
			else entry.reject(new Error(msg.error || `RPC error: ${entry.method}`));
			return;
		}
		if (isRpcEvent(msg)) {
			const event = msg.event;
			if (!isRunEvent(event)) return;
			for (const listener of eventListeners) try {
				listener(event);
			} catch (e) {
				console.error("[useRRV3Rpc] Event listener error:", e);
			}
		}
	}
	function connect() {
		return _connect.apply(this, arguments);
	}
	function _connect() {
		_connect = _asyncToGenerator(function* () {
			if (isReady.value) return true;
			if (connectPromise) return connectPromise;
			connectPromise = _asyncToGenerator(function* () {
				manualDisconnect = false;
				connecting.value = true;
				setError(null);
				try {
					var _chrome$runtime;
					if (typeof chrome === "undefined" || !((_chrome$runtime = chrome.runtime) === null || _chrome$runtime === void 0 ? void 0 : _chrome$runtime.connect)) {
						setError("chrome.runtime.connect not available");
						return false;
					}
					const p = chrome.runtime.connect({ name: RR_V3_PORT_NAME });
					port.value = p;
					reconnectAttempts.value = 0;
					reconnecting.value = false;
					if (reconnectTimer) {
						clearTimeout(reconnectTimer);
						reconnectTimer = null;
					}
					p.onMessage.addListener(handlePortMessage);
					p.onDisconnect.addListener(handlePortDisconnect);
					setConnected(true);
					rehydrateSubscriptions();
					return true;
				} catch (error) {
					setError(`Connection failed: ${toErrorMessage(error)}`);
					return false;
				} finally {
					connecting.value = false;
					connectPromise = null;
				}
			})();
			return connectPromise;
		});
		return _connect.apply(this, arguments);
	}
	function disconnect(reason) {
		manualDisconnect = true;
		if (reconnectTimer) {
			clearTimeout(reconnectTimer);
			reconnectTimer = null;
		}
		reconnecting.value = false;
		const p = port.value;
		port.value = null;
		setConnected(false);
		connecting.value = false;
		rejectAllPending(reason || "RR V3 RPC: client disconnected");
		if (p) try {
			p.onMessage.removeListener(handlePortMessage);
			p.onDisconnect.removeListener(handlePortDisconnect);
			p.disconnect();
		} catch (_unused3) {}
	}
	function ensureConnected() {
		return _ensureConnected.apply(this, arguments);
	}
	function _ensureConnected() {
		_ensureConnected = _asyncToGenerator(function* () {
			if (isReady.value) return true;
			return connect();
		});
		return _ensureConnected.apply(this, arguments);
	}
	function request(_x, _x2) {
		return _request.apply(this, arguments);
	}
	function _request() {
		_request = _asyncToGenerator(function* (method, params, reqOptions = {}) {
			var _reqOptions$timeoutMs;
			const ready = yield ensureConnected();
			const p = port.value;
			if (!ready || !p) throw new Error("RR V3 RPC: not connected");
			const timeoutMs = (_reqOptions$timeoutMs = reqOptions.timeoutMs) !== null && _reqOptions$timeoutMs !== void 0 ? _reqOptions$timeoutMs : DEFAULT_TIMEOUT_MS;
			const { signal } = reqOptions;
			if (signal === null || signal === void 0 ? void 0 : signal.aborted) throw new Error("RPC request already aborted");
			const req = createRpcRequest(method, params);
			return new Promise((resolve, reject) => {
				const entry = {
					method,
					resolve,
					reject,
					timeoutId: null,
					signal
				};
				const complete = (fn) => {
					pendingRequests.delete(req.requestId);
					pendingCount.value = pendingRequests.size;
					cleanupPendingRequest(entry);
					fn();
				};
				if (timeoutMs > 0) entry.timeoutId = setTimeout(() => {
					complete(() => reject(/* @__PURE__ */ new Error(`RPC timeout (${timeoutMs}ms): ${method}`)));
				}, timeoutMs);
				if (signal) {
					const onAbort = () => {
						complete(() => reject(/* @__PURE__ */ new Error("RPC request aborted")));
					};
					entry.abortHandler = onAbort;
					signal.addEventListener("abort", onAbort, { once: true });
				}
				pendingRequests.set(req.requestId, entry);
				pendingCount.value = pendingRequests.size;
				try {
					p.postMessage(req);
				} catch (e) {
					complete(() => reject(/* @__PURE__ */ new Error(`Failed to send RPC request: ${toErrorMessage(e)}`)));
				}
			});
		});
		return _request.apply(this, arguments);
	}
	function subscribe() {
		return _subscribe.apply(this, arguments);
	}
	function _subscribe() {
		_subscribe = _asyncToGenerator(function* (runId = null) {
			desiredSubscriptions.add(runId);
			syncSubscriptionsSnapshot();
			try {
				yield request("rr_v3.subscribe", runId === null ? {} : { runId });
				return true;
			} catch (error) {
				setError(toErrorMessage(error));
				return false;
			}
		});
		return _subscribe.apply(this, arguments);
	}
	function unsubscribe() {
		return _unsubscribe.apply(this, arguments);
	}
	function _unsubscribe() {
		_unsubscribe = _asyncToGenerator(function* (runId = null) {
			desiredSubscriptions.delete(runId);
			syncSubscriptionsSnapshot();
			try {
				yield request("rr_v3.unsubscribe", runId === null ? {} : { runId });
				return true;
			} catch (error) {
				setError(toErrorMessage(error));
				return false;
			}
		});
		return _unsubscribe.apply(this, arguments);
	}
	function onEvent(listener) {
		eventListeners.add(listener);
		return () => eventListeners.delete(listener);
	}
	onUnmounted(() => {
		disconnect("Component unmounted");
	});
	if (options.autoConnect) ensureConnected();
	return {
		connected,
		connecting,
		reconnecting,
		reconnectAttempts,
		lastError,
		isReady,
		pendingCount,
		subscribedRunIds,
		connect,
		disconnect,
		ensureConnected,
		request,
		subscribe,
		unsubscribe,
		onEvent
	};
}
//#endregion
export { useRRV3Rpc as t };
