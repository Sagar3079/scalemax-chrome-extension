import { n as init_asyncToGenerator, t as _asyncToGenerator } from "./asyncToGenerator-HxMCLN5T.js";
import { F as renderList, G as withDirectives, M as onUnmounted, N as openBlock, O as nextTick, S as defineComponent, W as withCtx, a as vModelSelect, b as createVNode, c as withKeys, f as computed, g as createElementBlock, h as createCommentVNode, i as vModelCheckbox, j as onMounted, l as withModifiers, lt as toDisplayString, m as createBlock, n as Transition, o as vModelText, ot as unref, p as createBaseVNode, r as createApp, s as vShow, st as normalizeClass, t as _plugin_vue_export_helper_default, tt as ref, u as Fragment, v as createStaticVNode, y as createTextVNode } from "./_plugin-vue_export-helper-DCRN0gge.js";
import { t as _objectSpread2 } from "./objectSpread2-YiwCHUSe.js";
import { n as NativeMessageType } from "./dist-piJEahpX.js";
import { t as BACKGROUND_MESSAGE_TYPES } from "./message-types-Byobwm5R.js";
import { a as getCacheStats, i as clearModelCache, o as getModelInfo, r as cleanupModelCache, t as PREDEFINED_MODELS } from "./semantic-similarity-engine-Obh75jju.js";
import { t as LINKS } from "./constants-DKwl8_Kl.js";
import { t as PRODUCT_NAME } from "./build-flags-F4RJxw2u.js";
import { n as preloadAgentTheme, r as useAgentTheme } from "./useAgentTheme-7H7kteXT.js";
//#region utils/i18n.ts
init_asyncToGenerator();
/**
* Chrome Extension i18n utility
* Provides safe access to chrome.i18n.getMessage with fallbacks
*/
var fallbackMessages = {
	extensionName: "chrome-mcp-server",
	extensionDescription: "Exposes browser capabilities with your own chrome",
	nativeServerConfigLabel: "Native Server Configuration",
	semanticEngineLabel: "Semantic Engine",
	embeddingModelLabel: "Embedding Model",
	indexDataManagementLabel: "Index Data Management",
	modelCacheManagementLabel: "Model Cache Management",
	statusLabel: "Status",
	runningStatusLabel: "Running Status",
	connectionStatusLabel: "Connection Status",
	lastUpdatedLabel: "Last Updated:",
	connectButton: "Connect",
	disconnectButton: "Disconnect",
	connectingStatus: "Connecting...",
	connectedStatus: "Connected",
	disconnectedStatus: "Disconnected",
	detectingStatus: "Detecting...",
	serviceRunningStatus: "Service Running (Port: {0})",
	serviceNotConnectedStatus: "Service Not Connected",
	connectedServiceNotStartedStatus: "Connected, Service Not Started",
	mcpServerConfigLabel: "MCP Server Configuration",
	connectionPortLabel: "Connection Port",
	refreshStatusButton: "Refresh Status",
	copyConfigButton: "Copy Configuration",
	retryButton: "Retry",
	cancelButton: "Cancel",
	confirmButton: "Confirm",
	saveButton: "Save",
	closeButton: "Close",
	resetButton: "Reset",
	initializingStatus: "Initializing...",
	processingStatus: "Processing...",
	loadingStatus: "Loading...",
	clearingStatus: "Clearing...",
	cleaningStatus: "Cleaning...",
	downloadingStatus: "Downloading...",
	semanticEngineReadyStatus: "Semantic Engine Ready",
	semanticEngineInitializingStatus: "Semantic Engine Initializing...",
	semanticEngineInitFailedStatus: "Semantic Engine Initialization Failed",
	semanticEngineNotInitStatus: "Semantic Engine Not Initialized",
	initSemanticEngineButton: "Initialize Semantic Engine",
	reinitializeButton: "Reinitialize",
	downloadingModelStatus: "Downloading Model... {0}%",
	switchingModelStatus: "Switching Model...",
	modelLoadedStatus: "Model Loaded",
	modelFailedStatus: "Model Failed to Load",
	lightweightModelDescription: "Lightweight Multilingual Model",
	betterThanSmallDescription: "Slightly larger than e5-small, but better performance",
	multilingualModelDescription: "Multilingual Semantic Model",
	fastPerformance: "Fast",
	balancedPerformance: "Balanced",
	accuratePerformance: "Accurate",
	networkErrorMessage: "Network connection error, please check network and retry",
	modelCorruptedErrorMessage: "Model file corrupted or incomplete, please retry download",
	unknownErrorMessage: "Unknown error, please check if your network can access HuggingFace",
	permissionDeniedErrorMessage: "Permission denied",
	timeoutErrorMessage: "Operation timed out",
	indexedPagesLabel: "Indexed Pages",
	indexSizeLabel: "Index Size",
	activeTabsLabel: "Active Tabs",
	vectorDocumentsLabel: "Vector Documents",
	cacheSizeLabel: "Cache Size",
	cacheEntriesLabel: "Cache Entries",
	clearAllDataButton: "Clear All Data",
	clearAllCacheButton: "Clear All Cache",
	cleanExpiredCacheButton: "Clean Expired Cache",
	exportDataButton: "Export Data",
	importDataButton: "Import Data",
	confirmClearDataTitle: "Confirm Clear Data",
	settingsTitle: "Settings",
	aboutTitle: "About",
	helpTitle: "Help",
	clearDataWarningMessage: "This operation will clear all indexed webpage content and vector data, including:",
	clearDataList1: "All webpage text content index",
	clearDataList2: "Vector embedding data",
	clearDataList3: "Search history and cache",
	clearDataIrreversibleWarning: "This operation is irreversible! After clearing, you need to browse webpages again to rebuild the index.",
	confirmClearButton: "Confirm Clear",
	cacheDetailsLabel: "Cache Details",
	noCacheDataMessage: "No cache data",
	loadingCacheInfoStatus: "Loading cache information...",
	processingCacheStatus: "Processing cache...",
	expiredLabel: "Expired",
	bookmarksBarLabel: "Bookmarks Bar",
	newTabLabel: "New Tab",
	currentPageLabel: "Current Page",
	menuLabel: "Menu",
	navigationLabel: "Navigation",
	mainContentLabel: "Main Content",
	languageSelectorLabel: "Language",
	themeLabel: "Theme",
	lightTheme: "Light",
	darkTheme: "Dark",
	autoTheme: "Auto",
	advancedSettingsLabel: "Advanced Settings",
	debugModeLabel: "Debug Mode",
	verboseLoggingLabel: "Verbose Logging",
	successNotification: "Operation completed successfully",
	warningNotification: "Warning: Please review before proceeding",
	infoNotification: "Information",
	configCopiedNotification: "Configuration copied to clipboard",
	dataClearedNotification: "Data cleared successfully",
	bytesUnit: "bytes",
	kilobytesUnit: "KB",
	megabytesUnit: "MB",
	gigabytesUnit: "GB",
	itemsUnit: "items",
	pagesUnit: "pages",
	nativeServerConfig: "Native Server Configuration",
	runningStatus: "Running Status",
	refreshStatus: "Refresh Status",
	lastUpdated: "Last Updated:",
	mcpServerConfig: "MCP Server Configuration",
	connectionPort: "Connection Port",
	connecting: "Connecting...",
	disconnect: "Disconnect",
	connect: "Connect",
	semanticEngine: "Semantic Engine",
	embeddingModel: "Embedding Model",
	retry: "Retry",
	indexDataManagement: "Index Data Management",
	clearing: "Clearing...",
	clearAllData: "Clear All Data",
	copyConfig: "Copy Configuration",
	serviceRunning: "Service Running (Port: {0})",
	connectedServiceNotStarted: "Connected, Service Not Started",
	serviceNotConnected: "Service Not Connected",
	detecting: "Detecting...",
	lightweightModel: "Lightweight Multilingual Model",
	betterThanSmall: "Slightly larger than e5-small, but better performance",
	multilingualModel: "Multilingual Semantic Model",
	fast: "Fast",
	balanced: "Balanced",
	accurate: "Accurate",
	semanticEngineReady: "Semantic Engine Ready",
	semanticEngineInitializing: "Semantic Engine Initializing...",
	semanticEngineInitFailed: "Semantic Engine Initialization Failed",
	semanticEngineNotInit: "Semantic Engine Not Initialized",
	downloadingModel: "Downloading Model... {0}%",
	switchingModel: "Switching Model...",
	networkError: "Network connection error, please check network and retry",
	modelCorrupted: "Model file corrupted or incomplete, please retry download",
	unknownError: "Unknown error, please check if your network can access HuggingFace",
	reinitialize: "Reinitialize",
	initializing: "Initializing...",
	initSemanticEngine: "Initialize Semantic Engine",
	indexedPages: "Indexed Pages",
	indexSize: "Index Size",
	activeTabs: "Active Tabs",
	vectorDocuments: "Vector Documents",
	confirmClearData: "Confirm Clear Data",
	clearDataWarning: "This operation will clear all indexed webpage content and vector data, including:",
	clearDataIrreversible: "This operation is irreversible! After clearing, you need to browse webpages again to rebuild the index.",
	confirmClear: "Confirm Clear",
	cancel: "Cancel",
	confirm: "Confirm",
	processing: "Processing...",
	modelCacheManagement: "Model Cache Management",
	cacheSize: "Cache Size",
	cacheEntries: "Cache Entries",
	cacheDetails: "Cache Details",
	noCacheData: "No cache data",
	loadingCacheInfo: "Loading cache information...",
	processingCache: "Processing cache...",
	cleaning: "Cleaning...",
	cleanExpiredCache: "Clean Expired Cache",
	clearAllCache: "Clear All Cache",
	expired: "Expired",
	bookmarksBar: "Bookmarks Bar"
};
/**
* Safe i18n message getter with fallback support
* @param key Message key
* @param substitutions Optional substitution values
* @returns Localized message or fallback
*/
function getMessage(key, substitutions) {
	try {
		if (typeof chrome !== "undefined" && chrome.i18n && chrome.i18n.getMessage) {
			const message = chrome.i18n.getMessage(key, substitutions);
			if (message) return message;
		}
	} catch (error) {
		console.warn(`Failed to get i18n message for key "${key}":`, error);
	}
	let fallback = fallbackMessages[key] || key;
	if (substitutions && substitutions.length > 0) substitutions.forEach((value, index) => {
		fallback = fallback.replace(`{${index}}`, value);
	});
	return fallback;
}
//#endregion
//#region entrypoints/popup/components/ConfirmDialog.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$10 = { class: "dialog-content" };
var _hoisted_2$9 = { class: "dialog-header" };
var _hoisted_3$9 = { class: "dialog-icon" };
var _hoisted_4$9 = { class: "dialog-title" };
var _hoisted_5$8 = { class: "dialog-body" };
var _hoisted_6$8 = { class: "dialog-message" };
var _hoisted_7$8 = {
	key: 0,
	class: "dialog-list"
};
var _hoisted_8$8 = {
	key: 1,
	class: "dialog-warning"
};
var _hoisted_9$8 = { class: "dialog-actions" };
var _hoisted_10$8 = ["disabled"];
var ConfirmDialog_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "ConfirmDialog",
	props: {
		visible: { type: Boolean },
		title: {},
		message: {},
		items: {},
		warning: {},
		icon: { default: "⚠️" },
		confirmText: { default: getMessage("confirmButton") },
		cancelText: { default: getMessage("cancelButton") },
		confirmingText: { default: getMessage("processingStatus") },
		isConfirming: {
			type: Boolean,
			default: false
		}
	},
	emits: ["confirm", "cancel"],
	setup(__props) {
		return (_ctx, _cache) => {
			return __props.visible ? (openBlock(), createElementBlock("div", {
				key: 0,
				class: "confirmation-dialog",
				onClick: _cache[2] || (_cache[2] = withModifiers(($event) => _ctx.$emit("cancel"), ["self"]))
			}, [createBaseVNode("div", _hoisted_1$10, [
				createBaseVNode("div", _hoisted_2$9, [createBaseVNode("span", _hoisted_3$9, toDisplayString(__props.icon), 1), createBaseVNode("h3", _hoisted_4$9, toDisplayString(__props.title), 1)]),
				createBaseVNode("div", _hoisted_5$8, [
					createBaseVNode("p", _hoisted_6$8, toDisplayString(__props.message), 1),
					__props.items && __props.items.length > 0 ? (openBlock(), createElementBlock("ul", _hoisted_7$8, [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.items, (item) => {
						return openBlock(), createElementBlock("li", { key: item }, toDisplayString(item), 1);
					}), 128))])) : createCommentVNode("", true),
					__props.warning ? (openBlock(), createElementBlock("div", _hoisted_8$8, [createBaseVNode("strong", null, toDisplayString(__props.warning), 1)])) : createCommentVNode("", true)
				]),
				createBaseVNode("div", _hoisted_9$8, [createBaseVNode("button", {
					class: "dialog-button cancel-button",
					onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("cancel"))
				}, toDisplayString(__props.cancelText), 1), createBaseVNode("button", {
					class: "dialog-button confirm-button",
					disabled: __props.isConfirming,
					onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("confirm"))
				}, toDisplayString(__props.isConfirming ? __props.confirmingText : __props.confirmText), 9, _hoisted_10$8)])
			])])) : createCommentVNode("", true);
		};
	}
});
//#endregion
//#region entrypoints/popup/components/ConfirmDialog.vue
var ConfirmDialog_default = /*#__PURE__*/ _plugin_vue_export_helper_default(ConfirmDialog_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-ec7ccd99"]]);
//#endregion
//#region entrypoints/popup/components/ProgressIndicator.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$9 = {
	key: 0,
	class: "progress-section"
};
var _hoisted_2$8 = { class: "progress-indicator" };
var _hoisted_3$8 = {
	key: 0,
	class: "spinner"
};
var _hoisted_4$8 = { class: "progress-text" };
//#endregion
//#region entrypoints/popup/components/ProgressIndicator.vue
var ProgressIndicator_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "ProgressIndicator",
	props: {
		visible: {
			type: Boolean,
			default: true
		},
		text: {},
		showSpinner: {
			type: Boolean,
			default: true
		}
	},
	setup(__props) {
		return (_ctx, _cache) => {
			return __props.visible ? (openBlock(), createElementBlock("div", _hoisted_1$9, [createBaseVNode("div", _hoisted_2$8, [__props.showSpinner ? (openBlock(), createElementBlock("div", _hoisted_3$8)) : createCommentVNode("", true), createBaseVNode("span", _hoisted_4$8, toDisplayString(__props.text), 1)])])) : createCommentVNode("", true);
		};
	}
}), [["__scopeId", "data-v-64b16095"]]);
//#endregion
//#region entrypoints/popup/components/icons/DocumentIcon.vue
var DocumentIcon_default = /* @__PURE__ */ defineComponent({
	__name: "DocumentIcon",
	props: { className: { default: "icon-default" } },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				fill: "none",
				viewBox: "0 0 24 24",
				"stroke-width": "2",
				stroke: "currentColor",
				class: normalizeClass(__props.className)
			}, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				d: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
			}, null, -1)])], 2);
		};
	}
});
//#endregion
//#region entrypoints/popup/components/icons/DatabaseIcon.vue
var DatabaseIcon_default = /* @__PURE__ */ defineComponent({
	__name: "DatabaseIcon",
	props: { className: { default: "icon-default" } },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				fill: "none",
				viewBox: "0 0 24 24",
				"stroke-width": "2",
				stroke: "currentColor",
				class: normalizeClass(__props.className)
			}, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				d: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375"
			}, null, -1)])], 2);
		};
	}
});
//#endregion
//#region entrypoints/popup/components/icons/BoltIcon.vue
var BoltIcon_default = /* @__PURE__ */ defineComponent({
	__name: "BoltIcon",
	props: { className: { default: "icon-default" } },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				fill: "none",
				viewBox: "0 0 24 24",
				"stroke-width": "1.5",
				stroke: "currentColor",
				class: normalizeClass(__props.className)
			}, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				d: "m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
			}, null, -1)])], 2);
		};
	}
});
//#endregion
//#region entrypoints/popup/components/icons/TrashIcon.vue
var TrashIcon_default = /* @__PURE__ */ defineComponent({
	__name: "TrashIcon",
	props: { className: { default: "icon-default" } },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				fill: "none",
				viewBox: "0 0 24 24",
				"stroke-width": "1.5",
				stroke: "currentColor",
				class: normalizeClass(__props.className)
			}, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
			}, null, -1)])], 2);
		};
	}
});
//#endregion
//#region entrypoints/popup/components/icons/CheckIcon.vue
var CheckIcon_default = /* @__PURE__ */ defineComponent({
	__name: "CheckIcon",
	props: { className: { default: "icon-small" } },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "0 0 20 20",
				fill: "currentColor",
				class: normalizeClass(__props.className)
			}, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
				"fill-rule": "evenodd",
				d: "M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z",
				"clip-rule": "evenodd"
			}, null, -1)])], 2);
		};
	}
});
//#endregion
//#region entrypoints/popup/components/icons/TabIcon.vue
var TabIcon_default = /* @__PURE__ */ defineComponent({
	__name: "TabIcon",
	props: { className: { default: "icon-default" } },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				fill: "none",
				viewBox: "0 0 24 24",
				"stroke-width": "2",
				stroke: "currentColor",
				class: normalizeClass(__props.className)
			}, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				d: "M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-16.5 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z"
			}, null, -1)])], 2);
		};
	}
});
//#endregion
//#region entrypoints/popup/components/icons/VectorIcon.vue
var VectorIcon_default = /* @__PURE__ */ defineComponent({
	__name: "VectorIcon",
	props: { className: { default: "icon-default" } },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				fill: "none",
				viewBox: "0 0 24 24",
				"stroke-width": "2",
				stroke: "currentColor",
				class: normalizeClass(__props.className)
			}, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				d: "M9 4.5a4.5 4.5 0 0 1 6 0M9 4.5V3a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 3v1.5M9 4.5a4.5 4.5 0 0 0-4.5 4.5v7.5A1.5 1.5 0 0 0 6 18h12a1.5 1.5 0 0 0 1.5-1.5V9a4.5 4.5 0 0 0-4.5-4.5M12 12l2.25 2.25M12 12l-2.25-2.25M12 12v6"
			}, null, -1)])], 2);
		};
	}
});
//#endregion
//#region entrypoints/popup/components/icons/RecordIcon.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$8 = ["fill"];
//#endregion
//#region entrypoints/popup/components/icons/RecordIcon.vue
var RecordIcon_default = /* @__PURE__ */ defineComponent({
	__name: "RecordIcon",
	props: {
		className: { default: "icon-default" },
		recording: {
			type: Boolean,
			default: false
		}
	},
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "0 0 24 24",
				class: normalizeClass(__props.className)
			}, [createBaseVNode("circle", {
				cx: "12",
				cy: "12",
				r: "8",
				fill: __props.recording ? "#ef4444" : "currentColor"
			}, null, 8, _hoisted_1$8)], 2);
		};
	}
});
//#endregion
//#region entrypoints/popup/components/icons/StopIcon.vue
var StopIcon_default = /* @__PURE__ */ defineComponent({
	__name: "StopIcon",
	props: { className: { default: "icon-default" } },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "0 0 24 24",
				class: normalizeClass(__props.className)
			}, [..._cache[0] || (_cache[0] = [createBaseVNode("rect", {
				x: "6",
				y: "6",
				width: "12",
				height: "12",
				rx: "1",
				fill: "currentColor"
			}, null, -1)])], 2);
		};
	}
});
//#endregion
//#region entrypoints/popup/components/icons/WorkflowIcon.vue
var WorkflowIcon_default = /* @__PURE__ */ defineComponent({
	__name: "WorkflowIcon",
	props: { className: { default: "icon-default" } },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				fill: "none",
				viewBox: "0 0 24 24",
				"stroke-width": "1.5",
				stroke: "currentColor",
				class: normalizeClass(__props.className)
			}, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				d: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
			}, null, -1)])], 2);
		};
	}
});
//#endregion
//#region entrypoints/popup/components/icons/RefreshIcon.vue
var RefreshIcon_default = /* @__PURE__ */ defineComponent({
	__name: "RefreshIcon",
	props: { className: { default: "icon-default" } },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				fill: "none",
				viewBox: "0 0 24 24",
				"stroke-width": "2",
				stroke: "currentColor",
				class: normalizeClass(__props.className)
			}, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
			}, null, -1)])], 2);
		};
	}
});
//#endregion
//#region entrypoints/popup/components/icons/EditIcon.vue
var EditIcon_default = /* @__PURE__ */ defineComponent({
	__name: "EditIcon",
	props: { className: { default: "icon-default" } },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				fill: "none",
				viewBox: "0 0 24 24",
				"stroke-width": "2",
				stroke: "currentColor",
				class: normalizeClass(__props.className)
			}, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
			}, null, -1)])], 2);
		};
	}
});
//#endregion
//#region entrypoints/popup/components/icons/MarkerIcon.vue
var MarkerIcon_default = /* @__PURE__ */ defineComponent({
	__name: "MarkerIcon",
	props: { className: { default: "icon-default" } },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				fill: "none",
				viewBox: "0 0 24 24",
				"stroke-width": "2",
				stroke: "currentColor",
				class: normalizeClass(__props.className)
			}, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				d: "M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
			}, null, -1), createBaseVNode("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				d: "M6 6h.008v.008H6V6z"
			}, null, -1)])], 2);
		};
	}
});
//#endregion
//#region entrypoints/popup/components/ModelCacheManagement.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$7 = { class: "model-cache-section" };
var _hoisted_2$7 = { class: "section-title" };
var _hoisted_3$7 = { class: "stats-grid" };
var _hoisted_4$7 = { class: "stats-card" };
var _hoisted_5$7 = { class: "stats-header" };
var _hoisted_6$7 = { class: "stats-label" };
var _hoisted_7$7 = { class: "stats-icon orange" };
var _hoisted_8$7 = { class: "stats-value" };
var _hoisted_9$7 = { class: "stats-card" };
var _hoisted_10$7 = { class: "stats-header" };
var _hoisted_11$7 = { class: "stats-label" };
var _hoisted_12$7 = { class: "stats-icon purple" };
var _hoisted_13$7 = { class: "stats-value" };
var _hoisted_14$7 = {
	key: 0,
	class: "cache-details"
};
var _hoisted_15$7 = { class: "cache-details-title" };
var _hoisted_16$7 = { class: "cache-entries" };
var _hoisted_17$7 = { class: "entry-info" };
var _hoisted_18$6 = { class: "entry-url" };
var _hoisted_19$5 = { class: "entry-details" };
var _hoisted_20$4 = { class: "entry-size" };
var _hoisted_21$4 = { class: "entry-age" };
var _hoisted_22$4 = {
	key: 0,
	class: "entry-expired"
};
var _hoisted_23$4 = {
	key: 1,
	class: "no-cache"
};
var _hoisted_24$4 = {
	key: 2,
	class: "loading-cache"
};
var _hoisted_25$3 = { class: "cache-actions" };
var _hoisted_26$3 = ["disabled"];
var _hoisted_27$3 = { class: "stats-icon" };
var _hoisted_28$2 = ["disabled"];
var _hoisted_29$2 = { class: "stats-icon" };
//#endregion
//#region entrypoints/popup/components/ModelCacheManagement.vue
var ModelCacheManagement_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "ModelCacheManagement",
	props: {
		cacheStats: {},
		isManagingCache: { type: Boolean }
	},
	emits: ["cleanup-cache", "clear-all-cache"],
	setup(__props) {
		const getModelNameFromUrl = (url) => {
			const match = url.match(/huggingface\.co\/([^/]+\/[^/]+)/);
			if (match) return match[1];
			return url.split("/").pop() || url;
		};
		return (_ctx, _cache) => {
			var _props$cacheStats, _props$cacheStats2;
			return openBlock(), createElementBlock("div", _hoisted_1$7, [
				createBaseVNode("h2", _hoisted_2$7, toDisplayString(unref(getMessage)("modelCacheManagementLabel")), 1),
				createBaseVNode("div", _hoisted_3$7, [createBaseVNode("div", _hoisted_4$7, [createBaseVNode("div", _hoisted_5$7, [createBaseVNode("p", _hoisted_6$7, toDisplayString(unref(getMessage)("cacheSizeLabel")), 1), createBaseVNode("span", _hoisted_7$7, [createVNode(unref(DatabaseIcon_default))])]), createBaseVNode("p", _hoisted_8$7, toDisplayString(((_props$cacheStats = __props.cacheStats) === null || _props$cacheStats === void 0 ? void 0 : _props$cacheStats.totalSizeMB) || 0) + " MB", 1)]), createBaseVNode("div", _hoisted_9$7, [createBaseVNode("div", _hoisted_10$7, [createBaseVNode("p", _hoisted_11$7, toDisplayString(unref(getMessage)("cacheEntriesLabel")), 1), createBaseVNode("span", _hoisted_12$7, [createVNode(unref(VectorIcon_default))])]), createBaseVNode("p", _hoisted_13$7, toDisplayString(((_props$cacheStats2 = __props.cacheStats) === null || _props$cacheStats2 === void 0 ? void 0 : _props$cacheStats2.entryCount) || 0), 1)])]),
				__props.cacheStats && __props.cacheStats.entries.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_14$7, [createBaseVNode("h3", _hoisted_15$7, toDisplayString(unref(getMessage)("cacheDetailsLabel")), 1), createBaseVNode("div", _hoisted_16$7, [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.cacheStats.entries, (entry) => {
					return openBlock(), createElementBlock("div", {
						key: entry.url,
						class: "cache-entry"
					}, [createBaseVNode("div", _hoisted_17$7, [createBaseVNode("div", _hoisted_18$6, toDisplayString(getModelNameFromUrl(entry.url)), 1), createBaseVNode("div", _hoisted_19$5, [
						createBaseVNode("span", _hoisted_20$4, toDisplayString(entry.sizeMB) + " MB", 1),
						createBaseVNode("span", _hoisted_21$4, toDisplayString(entry.age), 1),
						entry.expired ? (openBlock(), createElementBlock("span", _hoisted_22$4, toDisplayString(unref(getMessage)("expiredLabel")), 1)) : createCommentVNode("", true)
					])])]);
				}), 128))])])) : __props.cacheStats && __props.cacheStats.entries.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_23$4, [createBaseVNode("p", null, toDisplayString(unref(getMessage)("noCacheDataMessage")), 1)])) : !__props.cacheStats ? (openBlock(), createElementBlock("div", _hoisted_24$4, [createBaseVNode("p", null, toDisplayString(unref(getMessage)("loadingCacheInfoStatus")), 1)])) : createCommentVNode("", true),
				__props.isManagingCache ? (openBlock(), createBlock(ProgressIndicator_default, {
					key: 3,
					visible: __props.isManagingCache,
					text: __props.isManagingCache ? unref(getMessage)("processingCacheStatus") : "",
					showSpinner: true
				}, null, 8, ["visible", "text"])) : createCommentVNode("", true),
				createBaseVNode("div", _hoisted_25$3, [createBaseVNode("div", {
					class: "secondary-button",
					disabled: __props.isManagingCache,
					onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("cleanup-cache"))
				}, [createBaseVNode("span", _hoisted_27$3, [createVNode(unref(DatabaseIcon_default))]), createBaseVNode("span", null, toDisplayString(__props.isManagingCache ? unref(getMessage)("cleaningStatus") : unref(getMessage)("cleanExpiredCacheButton")), 1)], 8, _hoisted_26$3), createBaseVNode("div", {
					class: "danger-button",
					disabled: __props.isManagingCache,
					onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("clear-all-cache"))
				}, [createBaseVNode("span", _hoisted_29$2, [createVNode(unref(TrashIcon_default))]), createBaseVNode("span", null, toDisplayString(__props.isManagingCache ? unref(getMessage)("clearingStatus") : unref(getMessage)("clearAllCacheButton")), 1)], 8, _hoisted_28$2)])
			]);
		};
	}
}), [["__scopeId", "data-v-7ccb152f"]]);
//#endregion
//#region entrypoints/popup/components/LocalModelPage.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$6 = { class: "local-model-page" };
var _hoisted_2$6 = { class: "page-header" };
var _hoisted_3$6 = { class: "page-content" };
var _hoisted_4$6 = { class: "section" };
var _hoisted_5$6 = { class: "section-title" };
var _hoisted_6$6 = { class: "semantic-engine-card" };
var _hoisted_7$6 = { class: "semantic-engine-status" };
var _hoisted_8$6 = { class: "status-info" };
var _hoisted_9$6 = { class: "status-text" };
var _hoisted_10$6 = {
	key: 0,
	class: "status-timestamp"
};
var _hoisted_11$6 = ["disabled"];
var _hoisted_12$6 = { class: "section" };
var _hoisted_13$6 = { class: "section-title" };
var _hoisted_14$6 = {
	key: 1,
	class: "error-card"
};
var _hoisted_15$6 = { class: "error-content" };
var _hoisted_16$6 = { class: "error-details" };
var _hoisted_17$6 = { class: "error-title" };
var _hoisted_18$5 = { class: "error-message" };
var _hoisted_19$4 = { class: "error-suggestion" };
var _hoisted_20$3 = ["disabled"];
var _hoisted_21$3 = { class: "model-list" };
var _hoisted_22$3 = ["onClick"];
var _hoisted_23$3 = { class: "model-header" };
var _hoisted_24$3 = { class: "model-info" };
var _hoisted_25$2 = { class: "model-description" };
var _hoisted_26$2 = {
	key: 0,
	class: "check-icon"
};
var _hoisted_27$2 = { class: "model-tags" };
var _hoisted_28$1 = { class: "model-tag performance" };
var _hoisted_29$1 = { class: "model-tag size" };
var _hoisted_30$1 = { class: "model-tag dimension" };
var _hoisted_31$1 = { class: "section" };
var _hoisted_32 = { class: "section-title" };
var _hoisted_33 = { class: "stats-grid" };
var _hoisted_34 = { class: "stats-card" };
var _hoisted_35 = { class: "stats-header" };
var _hoisted_36 = { class: "stats-label" };
var _hoisted_37 = { class: "stats-icon violet" };
var _hoisted_38 = { class: "stats-value" };
var _hoisted_39 = { class: "stats-card" };
var _hoisted_40 = { class: "stats-header" };
var _hoisted_41 = { class: "stats-label" };
var _hoisted_42 = { class: "stats-icon teal" };
var _hoisted_43 = { class: "stats-value" };
var _hoisted_44 = { class: "stats-card" };
var _hoisted_45 = { class: "stats-header" };
var _hoisted_46 = { class: "stats-label" };
var _hoisted_47 = { class: "stats-icon blue" };
var _hoisted_48 = { class: "stats-value" };
var _hoisted_49 = { class: "stats-card" };
var _hoisted_50 = { class: "stats-header" };
var _hoisted_51 = { class: "stats-label" };
var _hoisted_52 = { class: "stats-icon green" };
var _hoisted_53 = { class: "stats-value" };
var _hoisted_54 = ["disabled"];
//#endregion
//#region entrypoints/popup/components/LocalModelPage.vue
var LocalModelPage_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "LocalModelPage",
	props: {
		semanticEngineStatus: {},
		isSemanticEngineInitializing: { type: Boolean },
		semanticEngineInitProgress: {},
		semanticEngineLastUpdated: {},
		availableModels: {},
		currentModel: {},
		isModelSwitching: { type: Boolean },
		isModelDownloading: { type: Boolean },
		modelDownloadProgress: {},
		modelInitializationStatus: {},
		modelErrorMessage: {},
		modelErrorType: {},
		storageStats: {},
		isClearingData: { type: Boolean },
		clearDataProgress: {},
		cacheStats: {},
		isManagingCache: { type: Boolean }
	},
	emits: [
		"back",
		"initializeSemanticEngine",
		"switchModel",
		"retryModelInitialization",
		"showClearConfirmation",
		"cleanupCache",
		"clearAllCache"
	],
	setup(__props) {
		const props = __props;
		const getSemanticEngineStatusClass = () => {
			switch (props.semanticEngineStatus) {
				case "ready": return "bg-emerald-500";
				case "initializing": return "bg-yellow-500";
				case "error": return "bg-red-500";
				default: return "bg-gray-500";
			}
		};
		const getSemanticEngineStatusText = () => {
			switch (props.semanticEngineStatus) {
				case "ready": return getMessage("semanticEngineReadyStatus");
				case "initializing": return getMessage("semanticEngineInitializingStatus");
				case "error": return getMessage("semanticEngineInitFailedStatus");
				default: return getMessage("semanticEngineNotInitStatus");
			}
		};
		const getSemanticEngineButtonText = () => {
			switch (props.semanticEngineStatus) {
				case "ready": return getMessage("reinitializeButton");
				case "initializing": return getMessage("initializingStatus");
				case "error": return getMessage("reinitializeButton");
				default: return getMessage("initSemanticEngineButton");
			}
		};
		const progressText = computed(() => {
			if (props.isModelDownloading) return getMessage("downloadingModelStatus", [props.modelDownloadProgress.toString()]);
			else if (props.isModelSwitching) return getMessage("switchingModelStatus");
			return "";
		});
		const errorTypeText = computed(() => {
			switch (props.modelErrorType) {
				case "network": return getMessage("networkErrorMessage");
				case "file": return getMessage("modelCorruptedErrorMessage");
				default: return getMessage("unknownErrorMessage");
			}
		});
		const getModelDescription = (model) => {
			switch (model.preset) {
				case "multilingual-e5-small": return getMessage("lightweightModelDescription");
				case "multilingual-e5-base": return getMessage("betterThanSmallDescription");
				default: return getMessage("multilingualModelDescription");
			}
		};
		const getPerformanceText = (performance) => {
			switch (performance) {
				case "fast": return getMessage("fastPerformance");
				case "balanced": return getMessage("balancedPerformance");
				case "accurate": return getMessage("accuratePerformance");
				default: return performance;
			}
		};
		const formatIndexSize = () => {
			var _props$storageStats;
			if (!((_props$storageStats = props.storageStats) === null || _props$storageStats === void 0 ? void 0 : _props$storageStats.indexSize)) return "0 MB";
			return `${Math.round(props.storageStats.indexSize / 1048576)} MB`;
		};
		return (_ctx, _cache) => {
			var _props$storageStats2, _props$storageStats3, _props$storageStats4;
			return openBlock(), createElementBlock("div", _hoisted_1$6, [createBaseVNode("div", _hoisted_2$6, [createBaseVNode("button", {
				class: "back-button",
				onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("back")),
				title: "返回首页"
			}, [..._cache[6] || (_cache[6] = [createBaseVNode("svg", {
				viewBox: "0 0 24 24",
				width: "20",
				height: "20",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "2"
			}, [createBaseVNode("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				d: "M15 19l-7-7 7-7"
			})], -1), createBaseVNode("span", null, "返回", -1)])]), _cache[7] || (_cache[7] = createBaseVNode("h2", { class: "page-title" }, "本地模型", -1))]), createBaseVNode("div", _hoisted_3$6, [
				createBaseVNode("div", _hoisted_4$6, [createBaseVNode("h3", _hoisted_5$6, toDisplayString(unref(getMessage)("semanticEngineLabel")), 1), createBaseVNode("div", _hoisted_6$6, [
					createBaseVNode("div", _hoisted_7$6, [createBaseVNode("div", _hoisted_8$6, [createBaseVNode("span", { class: normalizeClass(["status-dot", getSemanticEngineStatusClass()]) }, null, 2), createBaseVNode("span", _hoisted_9$6, toDisplayString(getSemanticEngineStatusText()), 1)]), __props.semanticEngineLastUpdated ? (openBlock(), createElementBlock("div", _hoisted_10$6, toDisplayString(unref(getMessage)("lastUpdatedLabel")) + " " + toDisplayString(new Date(__props.semanticEngineLastUpdated).toLocaleTimeString()), 1)) : createCommentVNode("", true)]),
					__props.isSemanticEngineInitializing ? (openBlock(), createBlock(ProgressIndicator_default, {
						key: 0,
						visible: __props.isSemanticEngineInitializing,
						text: __props.semanticEngineInitProgress,
						showSpinner: true
					}, null, 8, ["visible", "text"])) : createCommentVNode("", true),
					createBaseVNode("button", {
						class: "primary-action-button",
						disabled: __props.isSemanticEngineInitializing,
						onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("initializeSemanticEngine"))
					}, [createVNode(unref(BoltIcon_default)), createBaseVNode("span", null, toDisplayString(getSemanticEngineButtonText()), 1)], 8, _hoisted_11$6)
				])]),
				createBaseVNode("div", _hoisted_12$6, [
					createBaseVNode("h3", _hoisted_13$6, toDisplayString(unref(getMessage)("embeddingModelLabel")), 1),
					__props.isModelSwitching || __props.isModelDownloading ? (openBlock(), createBlock(ProgressIndicator_default, {
						key: 0,
						visible: __props.isModelSwitching || __props.isModelDownloading,
						text: progressText.value,
						showSpinner: true
					}, null, 8, ["visible", "text"])) : createCommentVNode("", true),
					__props.modelInitializationStatus === "error" ? (openBlock(), createElementBlock("div", _hoisted_14$6, [createBaseVNode("div", _hoisted_15$6, [_cache[8] || (_cache[8] = createBaseVNode("div", { class: "error-icon" }, "⚠️", -1)), createBaseVNode("div", _hoisted_16$6, [
						createBaseVNode("p", _hoisted_17$6, toDisplayString(unref(getMessage)("semanticEngineInitFailedStatus")), 1),
						createBaseVNode("p", _hoisted_18$5, toDisplayString(__props.modelErrorMessage || unref(getMessage)("semanticEngineInitFailedStatus")), 1),
						createBaseVNode("p", _hoisted_19$4, toDisplayString(errorTypeText.value), 1)
					])]), createBaseVNode("button", {
						class: "retry-button",
						onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("retryModelInitialization")),
						disabled: __props.isModelSwitching || __props.isModelDownloading
					}, [_cache[9] || (_cache[9] = createBaseVNode("span", null, "🔄", -1)), createBaseVNode("span", null, toDisplayString(unref(getMessage)("retryButton")), 1)], 8, _hoisted_20$3)])) : createCommentVNode("", true),
					createBaseVNode("div", _hoisted_21$3, [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.availableModels, (model) => {
						return openBlock(), createElementBlock("div", {
							key: model.preset,
							class: normalizeClass(["model-card", {
								selected: __props.currentModel === model.preset,
								disabled: __props.isModelSwitching || __props.isModelDownloading
							}]),
							onClick: ($event) => !__props.isModelSwitching && !__props.isModelDownloading && _ctx.$emit("switchModel", model.preset)
						}, [createBaseVNode("div", _hoisted_23$3, [createBaseVNode("div", _hoisted_24$3, [createBaseVNode("p", { class: normalizeClass(["model-name", { "selected-text": __props.currentModel === model.preset }]) }, toDisplayString(model.preset), 3), createBaseVNode("p", _hoisted_25$2, toDisplayString(getModelDescription(model)), 1)]), __props.currentModel === model.preset ? (openBlock(), createElementBlock("div", _hoisted_26$2, [createVNode(unref(CheckIcon_default), { class: "text-white" })])) : createCommentVNode("", true)]), createBaseVNode("div", _hoisted_27$2, [
							createBaseVNode("span", _hoisted_28$1, toDisplayString(getPerformanceText(model.performance)), 1),
							createBaseVNode("span", _hoisted_29$1, toDisplayString(model.size), 1),
							createBaseVNode("span", _hoisted_30$1, toDisplayString(model.dimension) + "D", 1)
						])], 10, _hoisted_22$3);
					}), 128))])
				]),
				createBaseVNode("div", _hoisted_31$1, [
					createBaseVNode("h3", _hoisted_32, toDisplayString(unref(getMessage)("indexDataManagementLabel")), 1),
					createBaseVNode("div", _hoisted_33, [
						createBaseVNode("div", _hoisted_34, [createBaseVNode("div", _hoisted_35, [createBaseVNode("p", _hoisted_36, toDisplayString(unref(getMessage)("indexedPagesLabel")), 1), createBaseVNode("span", _hoisted_37, [createVNode(unref(DocumentIcon_default))])]), createBaseVNode("p", _hoisted_38, toDisplayString(((_props$storageStats2 = __props.storageStats) === null || _props$storageStats2 === void 0 ? void 0 : _props$storageStats2.indexedPages) || 0), 1)]),
						createBaseVNode("div", _hoisted_39, [createBaseVNode("div", _hoisted_40, [createBaseVNode("p", _hoisted_41, toDisplayString(unref(getMessage)("indexSizeLabel")), 1), createBaseVNode("span", _hoisted_42, [createVNode(unref(DatabaseIcon_default))])]), createBaseVNode("p", _hoisted_43, toDisplayString(formatIndexSize()), 1)]),
						createBaseVNode("div", _hoisted_44, [createBaseVNode("div", _hoisted_45, [createBaseVNode("p", _hoisted_46, toDisplayString(unref(getMessage)("activeTabsLabel")), 1), createBaseVNode("span", _hoisted_47, [createVNode(unref(TabIcon_default))])]), createBaseVNode("p", _hoisted_48, toDisplayString(((_props$storageStats3 = __props.storageStats) === null || _props$storageStats3 === void 0 ? void 0 : _props$storageStats3.totalTabs) || 0), 1)]),
						createBaseVNode("div", _hoisted_49, [createBaseVNode("div", _hoisted_50, [createBaseVNode("p", _hoisted_51, toDisplayString(unref(getMessage)("vectorDocumentsLabel")), 1), createBaseVNode("span", _hoisted_52, [createVNode(unref(VectorIcon_default))])]), createBaseVNode("p", _hoisted_53, toDisplayString(((_props$storageStats4 = __props.storageStats) === null || _props$storageStats4 === void 0 ? void 0 : _props$storageStats4.totalDocuments) || 0), 1)])
					]),
					__props.isClearingData && __props.clearDataProgress ? (openBlock(), createBlock(ProgressIndicator_default, {
						key: 0,
						visible: __props.isClearingData,
						text: __props.clearDataProgress,
						showSpinner: true
					}, null, 8, ["visible", "text"])) : createCommentVNode("", true),
					createBaseVNode("button", {
						class: "danger-action-button",
						disabled: __props.isClearingData,
						onClick: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("showClearConfirmation"))
					}, [createVNode(unref(TrashIcon_default)), createBaseVNode("span", null, toDisplayString(__props.isClearingData ? unref(getMessage)("clearingStatus") : unref(getMessage)("clearAllDataButton")), 1)], 8, _hoisted_54)
				]),
				createVNode(ModelCacheManagement_default, {
					"cache-stats": __props.cacheStats,
					"is-managing-cache": __props.isManagingCache,
					onCleanupCache: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("cleanupCache")),
					onClearAllCache: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("clearAllCache"))
				}, null, 8, ["cache-stats", "is-managing-cache"])
			])]);
		};
	}
}), [["__scopeId", "data-v-2f30c5e2"]]);
//#endregion
//#region entrypoints/popup/components/AiProviderPage.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$5 = { class: "ai-provider-page" };
var _hoisted_2$5 = { class: "ai-header" };
var _hoisted_3$5 = {
	key: 0,
	class: "ai-hint"
};
var _hoisted_4$5 = { class: "ai-mode-toggle" };
var _hoisted_5$5 = { class: "ai-hint" };
var _hoisted_6$5 = {
	key: 2,
	class: "ai-hint"
};
var _hoisted_7$5 = { class: "ai-model-row" };
var _hoisted_8$5 = { class: "ai-model-select" };
var _hoisted_9$5 = ["value"];
var _hoisted_10$5 = ["value"];
var _hoisted_11$5 = ["disabled"];
var _hoisted_12$5 = ["value"];
var _hoisted_13$5 = { class: "ai-check-row" };
var _hoisted_14$5 = { class: "ai-actions" };
var _hoisted_15$5 = ["disabled"];
var _hoisted_16$5 = { class: "ai-test-row" };
var _hoisted_17$5 = ["disabled"];
var _hoisted_18$4 = {
	key: 3,
	class: "ai-output"
};
var PORT = 12306;
var PROVIDER_STORAGE_KEY = "scalemax_ai_provider";
var RUN_MODE_KEY = "scalemax_ai_run_mode";
//#endregion
//#region entrypoints/popup/components/AiProviderPage.vue
var AiProviderPage_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "AiProviderPage",
	emits: ["back"],
	setup(__props) {
		const scalemaxOnly = true;
		const api = (p) => `http://127.0.0.1:${PORT}${p}`;
		const baseURL = ref("");
		const apiKey = ref("");
		const model = ref("");
		const models = ref([]);
		const hasStoredKey = ref(false);
		const runMode = ref("extension");
		const fallbackModel = ref("");
		const vision = ref(false);
		const allowedDomainsText = ref("");
		const loadingModels = ref(false);
		const saving = ref(false);
		const running = ref(false);
		const statusMsg = ref("");
		const statusOk = ref(true);
		const testTask = ref("");
		const testTabId = ref(null);
		const agentOutput = ref("");
		function setStatus(msg, ok = true) {
			statusMsg.value = msg;
			statusOk.value = ok;
		}
		/** Strip a single trailing slash so `${baseURL}/models` is always well-formed. */
		function normalizeBaseUrl(url) {
			return (url || "").trim().replace(/\/+$/, "");
		}
		/** One hostname per line -> allowedDomains:string[] (blank lines dropped). */
		function parseAllowedDomains(text) {
			return (text || "").split("\n").map((line) => line.trim()).filter(Boolean);
		}
		function loadRunMode() {
			return _loadRunMode.apply(this, arguments);
		}
		function _loadRunMode() {
			_loadRunMode = _asyncToGenerator(function* () {
				runMode.value = "extension";
			});
			return _loadRunMode.apply(this, arguments);
		}
		function setRunMode(_x) {
			return _setRunMode.apply(this, arguments);
		}
		function _setRunMode() {
			_setRunMode = _asyncToGenerator(function* (mode) {
				runMode.value = mode;
				try {
					yield chrome.storage.local.set({ [RUN_MODE_KEY]: mode });
				} catch (_unused2) {}
			});
			return _setRunMode.apply(this, arguments);
		}
		/**
		* Mirror the provider config into chrome.storage.local['scalemax_ai_provider'] so the
		* in-extension agent (Mode 2, no PC) can read it directly, in addition to whatever
		* the Native path does. Keeps the previously stored key when the field is left blank,
		* matching the native save behavior.
		*/
		function syncProviderToStorage(_x2) {
			return _syncProviderToStorage.apply(this, arguments);
		}
		function _syncProviderToStorage() {
			_syncProviderToStorage = _asyncToGenerator(function* (usedApiKey) {
				try {
					const prev = (yield chrome.storage.local.get(PROVIDER_STORAGE_KEY))[PROVIDER_STORAGE_KEY] || {};
					const merged = _objectSpread2(_objectSpread2({}, prev), {}, {
						baseURL: baseURL.value,
						apiKey: usedApiKey && usedApiKey.length > 0 ? usedApiKey : prev.apiKey || "",
						model: model.value,
						vision: vision.value
					});
					if (fallbackModel.value) merged.fallbackModel = fallbackModel.value;
					else delete merged.fallbackModel;
					const domains = parseAllowedDomains(allowedDomainsText.value);
					if (domains.length) merged.allowedDomains = domains;
					else delete merged.allowedDomains;
					yield chrome.storage.local.set({ [PROVIDER_STORAGE_KEY]: merged });
					hasStoredKey.value = hasStoredKey.value || !!merged.apiKey;
				} catch (e) {
					console.warn("[AiProviderPage] Failed to sync provider config to chrome.storage.local", e);
				}
			});
			return _syncProviderToStorage.apply(this, arguments);
		}
		function loadCurrent() {
			return _loadCurrent.apply(this, arguments);
		}
		function _loadCurrent() {
			_loadCurrent = _asyncToGenerator(function* () {
				try {
					const cfg = (yield chrome.storage.local.get(PROVIDER_STORAGE_KEY))[PROVIDER_STORAGE_KEY];
					if (cfg) {
						baseURL.value = cfg.baseURL || baseURL.value;
						model.value = cfg.model || model.value;
						hasStoredKey.value = hasStoredKey.value || !!cfg.apiKey;
						fallbackModel.value = cfg.fallbackModel || "";
						vision.value = !!cfg.vision;
						allowedDomainsText.value = Array.isArray(cfg.allowedDomains) ? cfg.allowedDomains.join("\n") : "";
					}
				} catch (_unused3) {}
				try {
					const j = yield (yield fetch(api("/ai/provider"))).json();
					baseURL.value = j.baseURL || baseURL.value;
					model.value = j.model || model.value;
					hasStoredKey.value = hasStoredKey.value || !!j.hasKey;
				} catch (_unused4) {
					if (runMode.value === "native") setStatus("Native bridge not reachable on :12306 — click Connect first.", false);
				}
			});
			return _loadCurrent.apply(this, arguments);
		}
		async function effectiveApiKey() {
			if (apiKey.value) return apiKey.value;
			try {
				const cfg = (await chrome.storage.local.get(PROVIDER_STORAGE_KEY))[PROVIDER_STORAGE_KEY];
				return (cfg === null || cfg === void 0 ? void 0 : cfg.apiKey) || "";
			} catch (_unusedEffectiveApiKey) {
				return "";
			}
		}
		function loadModels() {
			return _loadModels.apply(this, arguments);
		}
		function _loadModels() {
			_loadModels = _asyncToGenerator(function* () {
				if (!baseURL.value) return setStatus("Enter a Base URL first.", false);
				loadingModels.value = true;
				setStatus("");
				try {
					const usableApiKey = yield effectiveApiKey();
					if (runMode.value === "extension") {
						const url = `${normalizeBaseUrl(baseURL.value)}/models`;
						const r = yield fetch(url, {
							method: "GET",
							headers: _objectSpread2({ "Content-Type": "application/json" }, usableApiKey ? { Authorization: `Bearer ${usableApiKey}` } : {})
						});
						if (!r.ok) {
							const body = yield r.text().catch(() => "");
							throw new Error(`${r.status} ${body.slice(0, 200)}`);
						}
						const j = yield r.json();
						const rows = Array.isArray(j === null || j === void 0 ? void 0 : j.data) ? j.data : Array.isArray(j) ? j : [];
						models.value = rows.map((m) => {
							var _ref, _m$id;
							return { id: String((_ref = (_m$id = m === null || m === void 0 ? void 0 : m.id) !== null && _m$id !== void 0 ? _m$id : m === null || m === void 0 ? void 0 : m.name) !== null && _ref !== void 0 ? _ref : "") };
						}).filter((m) => m.id).sort((a, b) => a.id.localeCompare(b.id));
						if (!model.value && models.value.length) model.value = models.value[0].id;
						setStatus(`Loaded ${models.value.length} models.`, true);
					} else {
						const qs = new URLSearchParams({ baseURL: baseURL.value });
						if (usableApiKey) qs.set("apiKey", usableApiKey);
						const j = yield (yield fetch(api("/ai/models?" + qs.toString()))).json();
						if (j.status === "success") {
							models.value = j.models || [];
							if (!model.value && models.value.length) model.value = models.value[0].id;
							setStatus(`Loaded ${models.value.length} models.`, true);
						} else setStatus(j.message || "Failed to load models", false);
					}
				} catch (e) {
					setStatus("Model fetch failed: " + ((e === null || e === void 0 ? void 0 : e.message) || e), false);
				} finally {
					loadingModels.value = false;
				}
			});
			return _loadModels.apply(this, arguments);
		}
		function save() {
			return _save.apply(this, arguments);
		}
		function _save() {
			_save = _asyncToGenerator(function* () {
				if (!baseURL.value) return setStatus("Base URL is required.", false);
				saving.value = true;
				const usedApiKey = apiKey.value;
				try {
					yield syncProviderToStorage(usedApiKey);
					const body = {
						baseURL: baseURL.value,
						model: model.value
					};
					if (usedApiKey) body.apiKey = usedApiKey;
					if (fallbackModel.value) body.fallbackModel = fallbackModel.value;
					body.vision = vision.value;
					const domainsForNative = parseAllowedDomains(allowedDomainsText.value);
					if (domainsForNative.length) body.allowedDomains = domainsForNative;
					const j = yield (yield fetch(api("/ai/provider"), {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(body)
					})).json();
					if (j.status === "success") {
						var _j$config;
						hasStoredKey.value = !!((_j$config = j.config) === null || _j$config === void 0 ? void 0 : _j$config.hasKey) || hasStoredKey.value;
						apiKey.value = "";
						setStatus("Saved.", true);
					} else setStatus(j.message || "Save failed", false);
				} catch (e) {
					if (runMode.value === "extension") {
						apiKey.value = "";
						setStatus("Saved.", true);
					} else setStatus("Save failed: " + ((e === null || e === void 0 ? void 0 : e.message) || e), false);
				} finally {
					saving.value = false;
				}
			});
			return _save.apply(this, arguments);
		}
		function runAgent() {
			return _runAgent.apply(this, arguments);
		}
		function _runAgent() {
			_runAgent = _asyncToGenerator(function* () {
				if (!testTask.value.trim()) return setStatus("Enter a task to test.", false);
				running.value = true;
				agentOutput.value = "Running…";
				try {
					var _res$stepCount;
					let res;
					if (runMode.value === "extension") {
						const payload = { task: testTask.value };
						if (testTabId.value != null) payload.tabId = testTabId.value;
						res = yield chrome.runtime.sendMessage({
							type: "scalemax_agent_run",
							payload
						});
						if (!res) throw new Error("No response from the background agent runner.");
					} else {
						const body = { task: testTask.value };
						if (testTabId.value != null) body.tabId = testTabId.value;
						const j = yield (yield fetch(api("/ai/agent/run"), {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(body)
						})).json();
						res = j.result || j;
					}
					agentOutput.value = `stop: ${res.stopReason || res.status}\nsteps: ${(_res$stepCount = res.stepCount) !== null && _res$stepCount !== void 0 ? _res$stepCount : "?"} | model: ${res.model || model.value}\n` + (res.error ? `error: ${res.error}\n` : "") + `\n${res.finalText || "(no final text)"}\n\n` + (res.steps || []).map((s) => `• ${s.tool} ${s.ok ? "✓" : "✗"}`).join("\n");
				} catch (e) {
					agentOutput.value = "Run failed: " + ((e === null || e === void 0 ? void 0 : e.message) || e);
				} finally {
					running.value = false;
				}
			});
			return _runAgent.apply(this, arguments);
		}
		onMounted(_asyncToGenerator(function* () {
			yield loadRunMode();
			yield loadCurrent();
		}));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$5, [
				createBaseVNode("div", _hoisted_2$5, [createBaseVNode("button", {
					class: "ai-back",
					onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("back"))
				}, "‹ Back"), _cache[11] || (_cache[11] = createBaseVNode("h1", null, "AI Provider", -1))]),
				_cache[16] || (_cache[16] = createBaseVNode("p", { class: "ai-sub" }, " Connect any OpenAI-compatible endpoint (OpenAI, OpenRouter, Groq, Together, LM Studio, Ollama…). The selected model powers the in-tab agents. ", -1)),
				_cache[17] || (_cache[17] = createBaseVNode("label", { class: "ai-label" }, "Base URL", -1)),
				withDirectives(createBaseVNode("input", {
					class: "ai-input",
					"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => baseURL.value = $event),
					placeholder: "https://api.openai.com/v1",
					spellcheck: "false"
				}, null, 512), [[vModelText, baseURL.value]]),
				_cache[18] || (_cache[18] = createBaseVNode("label", { class: "ai-label" }, "API Key", -1)),
				withDirectives(createBaseVNode("input", {
					class: "ai-input",
					"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => apiKey.value = $event),
					type: "password",
					placeholder: "sk-…",
					spellcheck: "false"
				}, null, 512), [[vModelText, apiKey.value]]),
				hasStoredKey.value && !apiKey.value ? (openBlock(), createElementBlock("p", _hoisted_3$5, "A key is already saved. Leave blank to keep it.")) : createCommentVNode("", true),
				!unref(scalemaxOnly) ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
					_cache[12] || (_cache[12] = createBaseVNode("label", { class: "ai-label" }, "Run mode", -1)),
					createBaseVNode("div", _hoisted_4$5, [createBaseVNode("button", {
						type: "button",
						class: normalizeClass(["ai-mode-btn", { active: runMode.value === "extension" }]),
						onClick: _cache[3] || (_cache[3] = ($event) => setRunMode("extension"))
					}, " In-extension (no PC) ", 2), createBaseVNode("button", {
						type: "button",
						class: normalizeClass(["ai-mode-btn", { active: runMode.value === "native" }]),
						onClick: _cache[4] || (_cache[4] = ($event) => setRunMode("native"))
					}, " Native (PC) ", 2)]),
					createBaseVNode("p", _hoisted_5$5, toDisplayString(runMode.value === "extension" ? "Runs the agent loop inside the extension background worker — no native host or PC server needed." : "Runs the agent loop through the native host on 127.0.0.1:12306 (requires the PC bridge to be running)."), 1)
				], 64)) : (openBlock(), createElementBlock("p", _hoisted_6$5, " Browser-only build: the agent loop runs entirely inside the extension — no PC, no native host. Everything goes to your Base URL directly. ")),
				createBaseVNode("div", _hoisted_7$5, [createBaseVNode("div", _hoisted_8$5, [_cache[13] || (_cache[13] = createBaseVNode("label", { class: "ai-label" }, "Model", -1)), withDirectives(createBaseVNode("select", {
					class: "ai-input",
					"onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => model.value = $event)
				}, [!models.value.length ? (openBlock(), createElementBlock("option", {
					key: 0,
					value: model.value
				}, toDisplayString(model.value || "load models first"), 9, _hoisted_9$5)) : createCommentVNode("", true), (openBlock(true), createElementBlock(Fragment, null, renderList(models.value, (mo) => {
					return openBlock(), createElementBlock("option", {
						key: mo.id,
						value: mo.id
					}, toDisplayString(mo.id), 9, _hoisted_10$5);
				}), 128))], 512), [[vModelSelect, model.value]])]), createBaseVNode("button", {
					class: "ai-btn ai-btn-ghost",
					disabled: loadingModels.value,
					onClick: loadModels
				}, toDisplayString(loadingModels.value ? "Loading…" : "Load Models"), 9, _hoisted_11$5)]),
				_cache[19] || (_cache[19] = createBaseVNode("label", { class: "ai-label" }, "Fallback model", -1)),
				withDirectives(createBaseVNode("select", {
					class: "ai-input",
					"onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => fallbackModel.value = $event)
				}, [_cache[14] || (_cache[14] = createBaseVNode("option", { value: "" }, "None", -1)), (openBlock(true), createElementBlock(Fragment, null, renderList(models.value, (mo) => {
					return openBlock(), createElementBlock("option", {
						key: "fallback-" + mo.id,
						value: mo.id
					}, toDisplayString(mo.id), 9, _hoisted_12$5);
				}), 128))], 512), [[vModelSelect, fallbackModel.value]]),
				_cache[20] || (_cache[20] = createBaseVNode("p", { class: "ai-hint" }, "Used to retry a step once if the primary model call errors.", -1)),
				createBaseVNode("label", _hoisted_13$5, [withDirectives(createBaseVNode("input", {
					class: "ai-checkbox",
					type: "checkbox",
					"onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => vision.value = $event)
				}, null, 512), [[vModelCheckbox, vision.value]]), _cache[15] || (_cache[15] = createTextVNode(" Send a screenshot to the model each step (multimodal models only) ", -1))]),
				_cache[21] || (_cache[21] = createBaseVNode("label", { class: "ai-label" }, "Allowed domains", -1)),
				withDirectives(createBaseVNode("textarea", {
					class: "ai-input ai-textarea",
					"onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => allowedDomainsText.value = $event),
					rows: "3",
					spellcheck: "false",
					placeholder: "example.com\ndocs.example.com"
				}, null, 512), [[vModelText, allowedDomainsText.value]]),
				_cache[22] || (_cache[22] = createBaseVNode("p", { class: "ai-hint" }, "Restrict the agent to these sites, one hostname per line; blank = all sites.", -1)),
				createBaseVNode("div", _hoisted_14$5, [createBaseVNode("button", {
					class: "ai-btn",
					disabled: saving.value,
					onClick: save
				}, toDisplayString(saving.value ? "Saving…" : "Save"), 9, _hoisted_15$5), statusMsg.value ? (openBlock(), createElementBlock("span", {
					key: 0,
					class: normalizeClass(["ai-status", statusOk.value ? "ok" : "err"])
				}, toDisplayString(statusMsg.value), 3)) : createCommentVNode("", true)]),
				_cache[23] || (_cache[23] = createBaseVNode("hr", { class: "ai-divider" }, null, -1)),
				_cache[24] || (_cache[24] = createBaseVNode("label", { class: "ai-label" }, "Test in-tab agent", -1)),
				withDirectives(createBaseVNode("input", {
					class: "ai-input",
					"onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => testTask.value = $event),
					placeholder: "e.g. search Google for 'best mechanical keyboard' and summarize top 3"
				}, null, 512), [[vModelText, testTask.value]]),
				createBaseVNode("div", _hoisted_16$5, [withDirectives(createBaseVNode("input", {
					class: "ai-input ai-tab",
					"onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => testTabId.value = $event),
					type: "number",
					placeholder: "tabId (optional)"
				}, null, 512), [[
					vModelText,
					testTabId.value,
					void 0,
					{ number: true }
				]]), createBaseVNode("button", {
					class: "ai-btn",
					disabled: running.value,
					onClick: runAgent
				}, toDisplayString(running.value ? "Running…" : "Run"), 9, _hoisted_17$5)]),
				agentOutput.value ? (openBlock(), createElementBlock("pre", _hoisted_18$4, toDisplayString(agentOutput.value), 1)) : createCommentVNode("", true)
			]);
		};
	}
}), [["__scopeId", "data-v-3627cd42"]]);
//#endregion
//#region entrypoints/background/vault/vault.ts
init_asyncToGenerator();
/**
* Credential vault — encrypted local store for site logins.
*
* Design:
* - The entire entry list is encrypted as one JSON blob with AES-GCM.
* - The AES-GCM key is derived from a user passphrase via PBKDF2 (SHA-256,
*   >=100k iterations, random salt). The salt + iteration count + IV +
*   ciphertext are the ONLY things ever written to `chrome.storage.local`
*   under `scalemax_vault`. Nothing else is persisted.
* - The passphrase itself is never stored anywhere, and the derived
*   `CryptoKey` + decrypted entry list live only in the module-level
*   variables below — i.e. only in memory, only for as long as this JS
*   context is alive (e.g. while the popup that imported this module is
*   open). Closing/reloading that context forgets everything and the vault
*   goes back to "locked" — there is no plaintext at rest, ever.
* - `unlock()` on a passphrase that doesn't match the stored vault fails
*   "for free": AES-GCM authenticates the ciphertext, so decrypting with the
*   wrong derived key throws instead of silently returning garbage.
*/
var STORAGE_KEY = "scalemax_vault";
var PBKDF2_ITERATIONS = 21e4;
var SALT_BYTES = 16;
var IV_BYTES = 12;
var derivedKey = null;
var cachedEntries = null;
var currentSalt = null;
var currentIterations = null;
var unlockedFlag = false;
function bytesToBase64(bytes) {
	let binary = "";
	const chunkSize = 32768;
	for (let i = 0; i < bytes.length; i += chunkSize) {
		const chunk = bytes.subarray(i, i + chunkSize);
		binary += String.fromCharCode(...chunk);
	}
	return btoa(binary);
}
function base64ToBytes(b64) {
	const binary = atob(b64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}
function generateId() {
	try {
		if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
	} catch (_unused) {}
	const bytes = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function readRecord() {
	return _readRecord.apply(this, arguments);
}
function _readRecord() {
	_readRecord = _asyncToGenerator(function* () {
		try {
			const data = yield chrome.storage.local.get(STORAGE_KEY);
			const rec = data === null || data === void 0 ? void 0 : data[STORAGE_KEY];
			if (rec && typeof rec === "object" && rec.ciphertext && rec.salt && rec.iv) return rec;
			return null;
		} catch (err) {
			console.error("[vault] failed to read chrome.storage.local", err);
			throw new Error("Vault storage read failed");
		}
	});
	return _readRecord.apply(this, arguments);
}
function writeRecord(_x) {
	return _writeRecord.apply(this, arguments);
}
function _writeRecord() {
	_writeRecord = _asyncToGenerator(function* (rec) {
		try {
			yield chrome.storage.local.set({ [STORAGE_KEY]: rec });
		} catch (err) {
			console.error("[vault] failed to write chrome.storage.local", err);
			throw new Error("Vault storage write failed");
		}
	});
	return _writeRecord.apply(this, arguments);
}
function deriveKey(_x2, _x3, _x4) {
	return _deriveKey.apply(this, arguments);
}
function _deriveKey() {
	_deriveKey = _asyncToGenerator(function* (passphrase, salt, iterations) {
		const keyMaterial = yield crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
		return crypto.subtle.deriveKey({
			name: "PBKDF2",
			salt,
			iterations,
			hash: "SHA-256"
		}, keyMaterial, {
			name: "AES-GCM",
			length: 256
		}, false, ["encrypt", "decrypt"]);
	});
	return _deriveKey.apply(this, arguments);
}
function encryptEntries(_x5, _x6) {
	return _encryptEntries.apply(this, arguments);
}
function _encryptEntries() {
	_encryptEntries = _asyncToGenerator(function* (key, entries) {
		const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
		const plaintext = new TextEncoder().encode(JSON.stringify(entries));
		const buf = yield crypto.subtle.encrypt({
			name: "AES-GCM",
			iv
		}, key, plaintext);
		return {
			iv: bytesToBase64(iv),
			ciphertext: bytesToBase64(new Uint8Array(buf))
		};
	});
	return _encryptEntries.apply(this, arguments);
}
function decryptEntries(_x7, _x8, _x9) {
	return _decryptEntries.apply(this, arguments);
}
function _decryptEntries() {
	_decryptEntries = _asyncToGenerator(function* (key, ivB64, ciphertextB64) {
		const iv = base64ToBytes(ivB64);
		const data = base64ToBytes(ciphertextB64);
		const buf = yield crypto.subtle.decrypt({
			name: "AES-GCM",
			iv
		}, key, data);
		const text = new TextDecoder().decode(buf);
		const parsed = JSON.parse(text);
		if (!Array.isArray(parsed)) throw new Error("Corrupt vault contents");
		return parsed;
	});
	return _decryptEntries.apply(this, arguments);
}
function assertUnlocked() {
	if (!unlockedFlag || !derivedKey || !cachedEntries || !currentSalt || !currentIterations) throw new Error("Vault is locked");
}
function persist() {
	return _persist.apply(this, arguments);
}
function _persist() {
	_persist = _asyncToGenerator(function* () {
		assertUnlocked();
		const key = derivedKey;
		const entries = cachedEntries;
		const salt = currentSalt;
		const iterations = currentIterations;
		const { iv, ciphertext } = yield encryptEntries(key, entries);
		yield writeRecord({
			version: 1,
			salt,
			iterations,
			iv,
			ciphertext
		});
	});
	return _persist.apply(this, arguments);
}
/**
* Unlock the vault with a passphrase.
* - If no vault exists yet in storage, this CREATES a new, empty vault
*   encrypted with a key derived from `passphrase`.
* - If a vault exists, this attempts to decrypt it with a key derived from
*   `passphrase`; returns false (and leaves the vault locked) if the
*   passphrase is wrong or the stored data is corrupt.
*/
function unlock(_x10) {
	return _unlock.apply(this, arguments);
}
function _unlock() {
	_unlock = _asyncToGenerator(function* (passphrase) {
		if (!passphrase) return false;
		try {
			const existing = yield readRecord();
			if (!existing) {
				const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
				const key = yield deriveKey(passphrase, salt, PBKDF2_ITERATIONS);
				const { iv, ciphertext } = yield encryptEntries(key, []);
				const saltB64 = bytesToBase64(salt);
				yield writeRecord({
					version: 1,
					salt: saltB64,
					iterations: PBKDF2_ITERATIONS,
					iv,
					ciphertext
				});
				derivedKey = key;
				cachedEntries = [];
				currentSalt = saltB64;
				currentIterations = PBKDF2_ITERATIONS;
				unlockedFlag = true;
				return true;
			}
			const salt = base64ToBytes(existing.salt);
			const iterations = existing.iterations || PBKDF2_ITERATIONS;
			const key = yield deriveKey(passphrase, salt, iterations);
			const entries = yield decryptEntries(key, existing.iv, existing.ciphertext);
			derivedKey = key;
			cachedEntries = entries;
			currentSalt = existing.salt;
			currentIterations = iterations;
			unlockedFlag = true;
			return true;
		} catch (err) {
			derivedKey = null;
			cachedEntries = null;
			currentSalt = null;
			currentIterations = null;
			unlockedFlag = false;
			return false;
		}
	});
	return _unlock.apply(this, arguments);
}
/** Discard the in-memory key and decrypted entries. Passphrase was never stored to begin with. */
function lock() {
	derivedKey = null;
	cachedEntries = null;
	currentSalt = null;
	currentIterations = null;
	unlockedFlag = false;
}
function isUnlocked() {
	return unlockedFlag && derivedKey !== null;
}
/** List all entries (decrypted, from the in-memory copy held since unlock). */
function list() {
	return _list.apply(this, arguments);
}
function _list() {
	_list = _asyncToGenerator(function* () {
		assertUnlocked();
		return cachedEntries.slice();
	});
	return _list.apply(this, arguments);
}
/** Insert (no `id`) or update (matching `id`) an entry, then re-encrypt + persist the whole vault. */
function upsert(_x12) {
	return _upsert.apply(this, arguments);
}
function _upsert() {
	_upsert = _asyncToGenerator(function* (input) {
		assertUnlocked();
		try {
			const entries = cachedEntries;
			const now = Date.now();
			if (input.id) {
				const idx = entries.findIndex((e) => e.id === input.id);
				if (idx === -1) {
					const entry = {
						id: input.id,
						site: input.site,
						username: input.username,
						password: input.password,
						notes: input.notes,
						updatedAt: now
					};
					entries.push(entry);
					yield persist();
					return entry;
				}
				const updated = _objectSpread2(_objectSpread2({}, entries[idx]), {}, {
					site: input.site,
					username: input.username,
					password: input.password,
					notes: input.notes,
					id: entries[idx].id,
					updatedAt: now
				});
				entries[idx] = updated;
				yield persist();
				return updated;
			}
			const entry = {
				id: generateId(),
				site: input.site,
				username: input.username,
				password: input.password,
				notes: input.notes,
				updatedAt: now
			};
			entries.push(entry);
			yield persist();
			return entry;
		} catch (err) {
			console.error("[vault] upsert failed", err);
			throw err instanceof Error ? err : /* @__PURE__ */ new Error("Vault upsert failed");
		}
	});
	return _upsert.apply(this, arguments);
}
function remove(_x13) {
	return _remove.apply(this, arguments);
}
function _remove() {
	_remove = _asyncToGenerator(function* (id) {
		assertUnlocked();
		try {
			const entries = cachedEntries;
			const idx = entries.findIndex((e) => e.id === id);
			if (idx === -1) return;
			entries.splice(idx, 1);
			yield persist();
		} catch (err) {
			console.error("[vault] remove failed", err);
			throw err instanceof Error ? err : /* @__PURE__ */ new Error("Vault remove failed");
		}
	});
	return _remove.apply(this, arguments);
}
//#endregion
//#region entrypoints/popup/components/VaultPage.vue?vue&type=script&setup=true&lang.ts
init_asyncToGenerator();
var _hoisted_1$4 = { class: "vault-page" };
var _hoisted_2$4 = { class: "vault-header" };
var _hoisted_3$4 = { class: "vault-actions" };
var _hoisted_4$4 = ["disabled"];
var _hoisted_5$4 = { class: "vault-toolbar" };
var _hoisted_6$4 = { class: "vault-sub vault-sub-inline" };
var _hoisted_7$4 = { class: "vault-toolbar-actions" };
var _hoisted_8$4 = ["disabled"];
var _hoisted_9$4 = {
	key: 1,
	class: "vault-form"
};
var _hoisted_10$4 = { class: "vault-form-actions" };
var _hoisted_11$4 = ["disabled"];
var _hoisted_12$4 = {
	key: 2,
	class: "vault-empty"
};
var _hoisted_13$4 = {
	key: 3,
	class: "vault-empty"
};
var _hoisted_14$4 = {
	key: 4,
	class: "vault-list"
};
var _hoisted_15$4 = { class: "vault-item-main" };
var _hoisted_16$4 = { class: "vault-item-site" };
var _hoisted_17$4 = { class: "vault-item-user" };
var _hoisted_18$3 = {
	key: 0,
	class: "vault-item-notes"
};
var _hoisted_19$3 = {
	key: 1,
	class: "vault-item-password"
};
var _hoisted_20$2 = {
	key: 0,
	class: "vault-confirm"
};
var _hoisted_21$2 = ["onClick"];
var _hoisted_22$2 = {
	key: 1,
	class: "vault-item-actions"
};
var _hoisted_23$2 = ["onClick"];
var _hoisted_24$2 = ["onClick"];
var _hoisted_25$1 = ["onClick"];
var _hoisted_26$1 = ["onClick"];
var _hoisted_27$1 = ["onClick"];
//#endregion
//#region entrypoints/popup/components/VaultPage.vue
var VaultPage_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "VaultPage",
	emits: ["back"],
	setup(__props) {
		const passphraseInput = ref("");
		const unlocked = ref(false);
		const unlocking = ref(false);
		const loadingList = ref(false);
		const savingEntry = ref(false);
		const entries = ref([]);
		const statusMsg = ref("");
		const statusOk = ref(true);
		const showForm = ref(false);
		const editingId = ref(null);
		const formSite = ref("");
		const formUsername = ref("");
		const formPassword = ref("");
		const formNotes = ref("");
		const revealed = ref(/* @__PURE__ */ new Set());
		const confirmDeleteId = ref(null);
		function setStatus(msg, ok = true) {
			statusMsg.value = msg;
			statusOk.value = ok;
		}
		function refreshList() {
			return _refreshList.apply(this, arguments);
		}
		function _refreshList() {
			_refreshList = _asyncToGenerator(function* () {
				loadingList.value = true;
				try {
					entries.value = yield list();
				} catch (e) {
					setStatus("Failed to load entries: " + ((e === null || e === void 0 ? void 0 : e.message) || e), false);
				} finally {
					loadingList.value = false;
				}
			});
			return _refreshList.apply(this, arguments);
		}
		function doUnlock() {
			return _doUnlock.apply(this, arguments);
		}
		function _doUnlock() {
			_doUnlock = _asyncToGenerator(function* () {
				if (!passphraseInput.value) {
					setStatus("Enter your vault passphrase.", false);
					return;
				}
				unlocking.value = true;
				setStatus("");
				try {
					if (yield unlock(passphraseInput.value)) {
						unlocked.value = true;
						passphraseInput.value = "";
						yield refreshList();
						setStatus("Vault unlocked.", true);
					} else setStatus("Incorrect passphrase.", false);
				} catch (e) {
					setStatus("Unlock failed: " + ((e === null || e === void 0 ? void 0 : e.message) || e), false);
				} finally {
					unlocking.value = false;
				}
			});
			return _doUnlock.apply(this, arguments);
		}
		function doLock() {
			try {
				lock();
			} finally {
				unlocked.value = false;
				entries.value = [];
				revealed.value = /* @__PURE__ */ new Set();
				confirmDeleteId.value = null;
				cancelForm();
				setStatus("Vault locked.", true);
			}
		}
		function resetForm() {
			formSite.value = "";
			formUsername.value = "";
			formPassword.value = "";
			formNotes.value = "";
		}
		function startAdd() {
			editingId.value = null;
			resetForm();
			showForm.value = true;
			setStatus("");
		}
		function startEdit(entry) {
			editingId.value = entry.id;
			formSite.value = entry.site;
			formUsername.value = entry.username;
			formPassword.value = entry.password;
			formNotes.value = entry.notes || "";
			showForm.value = true;
			setStatus("");
		}
		function cancelForm() {
			showForm.value = false;
			editingId.value = null;
			resetForm();
		}
		function saveEntry() {
			return _saveEntry.apply(this, arguments);
		}
		function _saveEntry() {
			_saveEntry = _asyncToGenerator(function* () {
				if (!formSite.value.trim() || !formUsername.value.trim()) {
					setStatus("Site and username are required.", false);
					return;
				}
				savingEntry.value = true;
				try {
					yield upsert({
						id: editingId.value || void 0,
						site: formSite.value.trim(),
						username: formUsername.value.trim(),
						password: formPassword.value,
						notes: formNotes.value.trim() || void 0
					});
					cancelForm();
					yield refreshList();
					setStatus("Saved.", true);
				} catch (e) {
					setStatus("Save failed: " + ((e === null || e === void 0 ? void 0 : e.message) || e), false);
				} finally {
					savingEntry.value = false;
				}
			});
			return _saveEntry.apply(this, arguments);
		}
		function askDelete(id) {
			confirmDeleteId.value = id;
		}
		function cancelDelete() {
			confirmDeleteId.value = null;
		}
		function confirmDelete(_x) {
			return _confirmDelete.apply(this, arguments);
		}
		function _confirmDelete() {
			_confirmDelete = _asyncToGenerator(function* (id) {
				try {
					yield remove(id);
					yield refreshList();
					setStatus("Entry deleted.", true);
				} catch (e) {
					setStatus("Delete failed: " + ((e === null || e === void 0 ? void 0 : e.message) || e), false);
				} finally {
					confirmDeleteId.value = null;
				}
			});
			return _confirmDelete.apply(this, arguments);
		}
		function toggleReveal(id) {
			const next = new Set(revealed.value);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			revealed.value = next;
		}
		function copyText(_x2, _x3) {
			return _copyText.apply(this, arguments);
		}
		function _copyText() {
			_copyText = _asyncToGenerator(function* (text, label) {
				try {
					yield navigator.clipboard.writeText(text);
					setStatus(`${label} copied to clipboard.`, true);
				} catch (e) {
					setStatus("Copy failed (clipboard permission?): " + ((e === null || e === void 0 ? void 0 : e.message) || e), false);
				}
			});
			return _copyText.apply(this, arguments);
		}
		onMounted(_asyncToGenerator(function* () {
			try {
				if (isUnlocked()) {
					unlocked.value = true;
					yield refreshList();
				}
			} catch (_unused) {}
		}));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$4, [createBaseVNode("div", _hoisted_2$4, [createBaseVNode("button", {
				class: "vault-back",
				onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("back"))
			}, "‹ Back"), _cache[6] || (_cache[6] = createBaseVNode("h1", null, "Vault", -1))]), !unlocked.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
				_cache[7] || (_cache[7] = createBaseVNode("p", { class: "vault-sub" }, " Encrypted local storage for site logins, used by the account-management flows. Entries are encrypted with AES-GCM using a key derived from your passphrase (PBKDF2-SHA256, 210k iterations, random salt). The passphrase itself is never written to disk — it's only held in memory for this session. ", -1)),
				_cache[8] || (_cache[8] = createBaseVNode("label", { class: "vault-label" }, "Passphrase", -1)),
				withDirectives(createBaseVNode("input", {
					class: "vault-input",
					"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => passphraseInput.value = $event),
					type: "password",
					placeholder: "Enter vault passphrase",
					spellcheck: "false",
					onKeyup: withKeys(doUnlock, ["enter"])
				}, null, 544), [[vModelText, passphraseInput.value]]),
				_cache[9] || (_cache[9] = createBaseVNode("p", { class: "vault-hint" }, " First time here? Unlocking with a new passphrase creates a fresh, empty vault using it. ", -1)),
				createBaseVNode("div", _hoisted_3$4, [createBaseVNode("button", {
					class: "vault-btn",
					disabled: unlocking.value,
					onClick: doUnlock
				}, toDisplayString(unlocking.value ? "Unlocking…" : "Unlock"), 9, _hoisted_4$4), statusMsg.value ? (openBlock(), createElementBlock("span", {
					key: 0,
					class: normalizeClass(["vault-status", statusOk.value ? "ok" : "err"])
				}, toDisplayString(statusMsg.value), 3)) : createCommentVNode("", true)])
			], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
				createBaseVNode("div", _hoisted_5$4, [createBaseVNode("p", _hoisted_6$4, toDisplayString(entries.value.length) + " saved " + toDisplayString(entries.value.length === 1 ? "entry" : "entries"), 1), createBaseVNode("div", _hoisted_7$4, [createBaseVNode("button", {
					class: "vault-btn vault-btn-ghost",
					disabled: showForm.value,
					onClick: startAdd
				}, " + Add ", 8, _hoisted_8$4), createBaseVNode("button", {
					class: "vault-btn vault-btn-ghost",
					onClick: doLock
				}, "Lock")])]),
				statusMsg.value ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: normalizeClass([
						"vault-status",
						"vault-status-block",
						statusOk.value ? "ok" : "err"
					])
				}, toDisplayString(statusMsg.value), 3)) : createCommentVNode("", true),
				showForm.value ? (openBlock(), createElementBlock("div", _hoisted_9$4, [
					_cache[10] || (_cache[10] = createBaseVNode("label", { class: "vault-label" }, "Site", -1)),
					withDirectives(createBaseVNode("input", {
						class: "vault-input",
						"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => formSite.value = $event),
						placeholder: "example.com",
						spellcheck: "false"
					}, null, 512), [[vModelText, formSite.value]]),
					_cache[11] || (_cache[11] = createBaseVNode("label", { class: "vault-label" }, "Username", -1)),
					withDirectives(createBaseVNode("input", {
						class: "vault-input",
						"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => formUsername.value = $event),
						placeholder: "username or email",
						spellcheck: "false"
					}, null, 512), [[vModelText, formUsername.value]]),
					_cache[12] || (_cache[12] = createBaseVNode("label", { class: "vault-label" }, "Password", -1)),
					withDirectives(createBaseVNode("input", {
						class: "vault-input",
						"onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => formPassword.value = $event),
						placeholder: "password",
						spellcheck: "false"
					}, null, 512), [[vModelText, formPassword.value]]),
					_cache[13] || (_cache[13] = createBaseVNode("label", { class: "vault-label" }, "Notes (optional)", -1)),
					withDirectives(createBaseVNode("input", {
						class: "vault-input",
						"onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => formNotes.value = $event),
						placeholder: "notes",
						spellcheck: "false"
					}, null, 512), [[vModelText, formNotes.value]]),
					createBaseVNode("div", _hoisted_10$4, [createBaseVNode("button", {
						class: "vault-btn",
						disabled: savingEntry.value,
						onClick: saveEntry
					}, toDisplayString(savingEntry.value ? "Saving…" : editingId.value ? "Save changes" : "Add entry"), 9, _hoisted_11$4), createBaseVNode("button", {
						class: "vault-btn vault-btn-ghost",
						onClick: cancelForm
					}, "Cancel")])
				])) : createCommentVNode("", true),
				_cache[15] || (_cache[15] = createBaseVNode("hr", { class: "vault-divider" }, null, -1)),
				loadingList.value ? (openBlock(), createElementBlock("div", _hoisted_12$4, "Loading…")) : !entries.value.length ? (openBlock(), createElementBlock("div", _hoisted_13$4, " No entries yet. Click \"+ Add\" to save your first login. ")) : (openBlock(), createElementBlock("ul", _hoisted_14$4, [(openBlock(true), createElementBlock(Fragment, null, renderList(entries.value, (entry) => {
					return openBlock(), createElementBlock("li", {
						key: entry.id,
						class: "vault-item"
					}, [createBaseVNode("div", _hoisted_15$4, [
						createBaseVNode("div", _hoisted_16$4, toDisplayString(entry.site), 1),
						createBaseVNode("div", _hoisted_17$4, toDisplayString(entry.username), 1),
						entry.notes ? (openBlock(), createElementBlock("div", _hoisted_18$3, toDisplayString(entry.notes), 1)) : createCommentVNode("", true),
						revealed.value.has(entry.id) ? (openBlock(), createElementBlock("div", _hoisted_19$3, toDisplayString(entry.password), 1)) : createCommentVNode("", true)
					]), confirmDeleteId.value === entry.id ? (openBlock(), createElementBlock("div", _hoisted_20$2, [
						_cache[14] || (_cache[14] = createBaseVNode("span", null, "Delete this entry?", -1)),
						createBaseVNode("button", {
							class: "vault-btn vault-btn-danger",
							onClick: ($event) => confirmDelete(entry.id)
						}, " Delete ", 8, _hoisted_21$2),
						createBaseVNode("button", {
							class: "vault-btn vault-btn-ghost",
							onClick: cancelDelete
						}, "Cancel")
					])) : (openBlock(), createElementBlock("div", _hoisted_22$2, [
						createBaseVNode("button", {
							class: "vault-icon-btn",
							title: "Copy username",
							onClick: ($event) => copyText(entry.username, "Username")
						}, " Copy user ", 8, _hoisted_23$2),
						createBaseVNode("button", {
							class: "vault-icon-btn",
							title: "Copy password",
							onClick: ($event) => copyText(entry.password, "Password")
						}, " Copy pass ", 8, _hoisted_24$2),
						createBaseVNode("button", {
							class: "vault-icon-btn",
							title: "Show/hide password",
							onClick: ($event) => toggleReveal(entry.id)
						}, toDisplayString(revealed.value.has(entry.id) ? "Hide" : "Show"), 9, _hoisted_25$1),
						createBaseVNode("button", {
							class: "vault-icon-btn",
							title: "Edit",
							onClick: ($event) => startEdit(entry)
						}, "Edit", 8, _hoisted_26$1),
						createBaseVNode("button", {
							class: "vault-icon-btn vault-icon-btn-danger",
							title: "Delete",
							onClick: ($event) => askDelete(entry.id)
						}, " Delete ", 8, _hoisted_27$1)
					]))]);
				}), 128))]))
			], 64))]);
		};
	}
}), [["__scopeId", "data-v-e72e609d"]]);
//#endregion
//#region entrypoints/popup/components/AgentDashboard.vue?vue&type=script&setup=true&lang.ts
init_asyncToGenerator();
var _hoisted_1$3 = { class: "agent-dash-page" };
var _hoisted_2$3 = { class: "agent-dash-header" };
var _hoisted_3$3 = { class: "agent-dash-toolbar" };
var _hoisted_4$3 = { class: "agent-dash-count" };
var _hoisted_5$3 = ["disabled"];
var _hoisted_6$3 = {
	key: 0,
	class: "agent-dash-empty"
};
var _hoisted_7$3 = {
	key: 1,
	class: "agent-dash-list"
};
var _hoisted_8$3 = { class: "agent-card-top" };
var _hoisted_9$3 = ["title"];
var _hoisted_10$3 = {
	key: 0,
	class: "agent-task"
};
var _hoisted_11$3 = { class: "agent-meta" };
var _hoisted_12$3 = { class: "agent-meta-item" };
var _hoisted_13$3 = ["title"];
var _hoisted_14$3 = {
	key: 0,
	class: "agent-meta-item"
};
var _hoisted_15$3 = {
	key: 1,
	class: "agent-meta-item"
};
var _hoisted_16$3 = ["title"];
var _hoisted_17$3 = {
	key: 2,
	class: "agent-field"
};
var _hoisted_18$2 = {
	key: 3,
	class: "agent-field"
};
var _hoisted_19$2 = { class: "agent-timestamps" };
var _hoisted_20$1 = { class: "agent-card-actions" };
var _hoisted_21$1 = ["disabled", "onClick"];
var _hoisted_22$1 = { class: "agent-close-toggle" };
var _hoisted_23$1 = ["onUpdate:modelValue"];
var _hoisted_24$1 = ["onClick"];
var REGISTRY_KEY = "scalemax_agent_registry";
var POLL_MS = 2e3;
//#endregion
//#region entrypoints/popup/components/AgentDashboard.vue
var AgentDashboard_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "AgentDashboard",
	emits: ["back"],
	setup(__props) {
		const agents = ref([]);
		const clearing = ref(false);
		const closeTabFlags = ref({});
		let pollTimer = null;
		function truncate(text, max = 220) {
			if (!text) return "";
			return text.length > max ? text.slice(0, max) + "…" : text;
		}
		function formatTime(ms) {
			try {
				return new Date(ms).toLocaleTimeString();
			} catch (_unused) {
				return "";
			}
		}
		function statusClass(status) {
			switch (status) {
				case "pending": return "status-pending";
				case "running": return "status-running";
				case "blocked": return "status-blocked";
				case "done": return "status-done";
				case "error": return "status-error";
				default: return "status-pending";
			}
		}
		/** Best-effort tab lookup; a missing/closed tab must never throw the caller. */
		function tryGetTab(_x) {
			return _tryGetTab.apply(this, arguments);
		}
		function _tryGetTab() {
			_tryGetTab = _asyncToGenerator(function* (tabId) {
				if (typeof tabId !== "number") return null;
				try {
					return (yield chrome.tabs.get(tabId)) || null;
				} catch (_unused2) {
					return null;
				}
			});
			return _tryGetTab.apply(this, arguments);
		}
		function loadAgents() {
			return _loadAgents.apply(this, arguments);
		}
		function _loadAgents() {
			_loadAgents = _asyncToGenerator(function* () {
				try {
					var _chrome;
					if (!((_chrome = chrome) === null || _chrome === void 0 || (_chrome = _chrome.storage) === null || _chrome === void 0 ? void 0 : _chrome.local)) return;
					const stored = yield chrome.storage.local.get(REGISTRY_KEY);
					const reg = (stored === null || stored === void 0 ? void 0 : stored[REGISTRY_KEY]) || {};
					const list = yield Promise.all(Object.values(reg).map(function() {
						var _ref = _asyncToGenerator(function* (e) {
							const tab = yield tryGetTab(e.tabId);
							return _objectSpread2(_objectSpread2({}, e), {}, {
								tabAlive: !!tab,
								currentUrl: tab === null || tab === void 0 ? void 0 : tab.url
							});
						});
						return function(_x2) {
							return _ref.apply(this, arguments);
						};
					}()));
					list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
					agents.value = list;
					const ids = new Set(list.map((a) => a.agentId));
					for (const id of Object.keys(closeTabFlags.value)) if (!ids.has(id)) delete closeTabFlags.value[id];
				} catch (_unused3) {}
			});
			return _loadAgents.apply(this, arguments);
		}
		function focusTab(_x3) {
			return _focusTab.apply(this, arguments);
		}
		function _focusTab() {
			_focusTab = _asyncToGenerator(function* (a) {
				if (typeof a.tabId !== "number") return;
				try {
					yield chrome.tabs.update(a.tabId, { active: true });
				} catch (_unused4) {}
				try {
					if (typeof a.windowId === "number") yield chrome.windows.update(a.windowId, { focused: true });
				} catch (_unused5) {}
			});
			return _focusTab.apply(this, arguments);
		}
		function releaseAgent(_x4) {
			return _releaseAgent.apply(this, arguments);
		}
		function _releaseAgent() {
			_releaseAgent = _asyncToGenerator(function* (agentId) {
				try {
					var _chrome2;
					if (!((_chrome2 = chrome) === null || _chrome2 === void 0 || (_chrome2 = _chrome2.storage) === null || _chrome2 === void 0 ? void 0 : _chrome2.local)) return;
					const stored = yield chrome.storage.local.get(REGISTRY_KEY);
					const reg = (stored === null || stored === void 0 ? void 0 : stored[REGISTRY_KEY]) || {};
					const entry = reg[agentId];
					if (closeTabFlags.value[agentId] && entry && typeof entry.tabId === "number") try {
						yield chrome.tabs.remove(entry.tabId);
					} catch (_unused6) {}
					delete reg[agentId];
					yield chrome.storage.local.set({ [REGISTRY_KEY]: reg });
					delete closeTabFlags.value[agentId];
				} catch (_unused7) {} finally {
					yield loadAgents();
				}
			});
			return _releaseAgent.apply(this, arguments);
		}
		function clearAll() {
			return _clearAll.apply(this, arguments);
		}
		function _clearAll() {
			_clearAll = _asyncToGenerator(function* () {
				if (clearing.value) return;
				clearing.value = true;
				try {
					var _chrome3;
					if ((_chrome3 = chrome) === null || _chrome3 === void 0 || (_chrome3 = _chrome3.storage) === null || _chrome3 === void 0 ? void 0 : _chrome3.local) yield chrome.storage.local.remove(REGISTRY_KEY);
					closeTabFlags.value = {};
				} catch (_unused8) {} finally {
					yield loadAgents();
					clearing.value = false;
				}
			});
			return _clearAll.apply(this, arguments);
		}
		onMounted(() => {
			loadAgents();
			pollTimer = setInterval(loadAgents, POLL_MS);
		});
		onUnmounted(() => {
			if (pollTimer) {
				clearInterval(pollTimer);
				pollTimer = null;
			}
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$3, [
				createBaseVNode("div", _hoisted_2$3, [createBaseVNode("button", {
					class: "agent-dash-back",
					onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("back"))
				}, "‹ Back"), _cache[1] || (_cache[1] = createBaseVNode("h1", null, "Agent Dashboard", -1))]),
				_cache[7] || (_cache[7] = createBaseVNode("p", { class: "agent-dash-sub" }, [
					createTextVNode(" Live view of agents dispatched via "),
					createBaseVNode("code", null, "chrome_agent_dispatch"),
					createTextVNode(". Refreshes automatically every ~2s. ")
				], -1)),
				createBaseVNode("div", _hoisted_3$3, [createBaseVNode("span", _hoisted_4$3, toDisplayString(agents.value.length) + " agent" + toDisplayString(agents.value.length === 1 ? "" : "s"), 1), createBaseVNode("button", {
					class: "agent-dash-btn agent-dash-btn-danger",
					disabled: !agents.value.length || clearing.value,
					onClick: clearAll
				}, toDisplayString(clearing.value ? "Clearing…" : "Clear all"), 9, _hoisted_5$3)]),
				!agents.value.length ? (openBlock(), createElementBlock("div", _hoisted_6$3, [..._cache[2] || (_cache[2] = [createBaseVNode("p", { class: "agent-dash-empty-title" }, "No agents dispatched yet.", -1), createBaseVNode("p", { class: "agent-dash-empty-hint" }, [
					createTextVNode(" Agents show up here once a tool call assigns one via "),
					createBaseVNode("code", null, "chrome_agent_dispatch"),
					createTextVNode(" (action "),
					createBaseVNode("code", null, "\"assign\""),
					createTextVNode("). ")
				], -1)])])) : (openBlock(), createElementBlock("div", _hoisted_7$3, [(openBlock(true), createElementBlock(Fragment, null, renderList(agents.value, (a) => {
					var _a$tabId;
					return openBlock(), createElementBlock("div", {
						key: a.agentId,
						class: "agent-card"
					}, [
						createBaseVNode("div", _hoisted_8$3, [createBaseVNode("span", {
							class: "agent-id",
							title: a.agentId
						}, toDisplayString(a.agentId), 9, _hoisted_9$3), createBaseVNode("span", { class: normalizeClass(["status-chip", statusClass(a.status)]) }, toDisplayString(a.status), 3)]),
						a.task ? (openBlock(), createElementBlock("p", _hoisted_10$3, toDisplayString(a.task), 1)) : createCommentVNode("", true),
						createBaseVNode("div", _hoisted_11$3, [
							createBaseVNode("span", _hoisted_12$3, [
								_cache[3] || (_cache[3] = createTextVNode(" tab ", -1)),
								createBaseVNode("strong", null, toDisplayString((_a$tabId = a.tabId) !== null && _a$tabId !== void 0 ? _a$tabId : "—"), 1),
								createBaseVNode("span", {
									class: normalizeClass(["tab-dot", a.tabAlive ? "alive" : "dead"]),
									title: a.tabAlive ? "tab alive" : "tab closed"
								}, null, 10, _hoisted_13$3),
								createTextVNode(" " + toDisplayString(a.tabAlive ? "alive" : "closed"), 1)
							]),
							a.windowId != null ? (openBlock(), createElementBlock("span", _hoisted_14$3, "win " + toDisplayString(a.windowId), 1)) : createCommentVNode("", true),
							a.groupId != null ? (openBlock(), createElementBlock("span", _hoisted_15$3, "group " + toDisplayString(a.groupId), 1)) : createCommentVNode("", true)
						]),
						a.currentUrl ? (openBlock(), createElementBlock("p", {
							key: 1,
							class: "agent-url",
							title: a.currentUrl
						}, toDisplayString(a.currentUrl), 9, _hoisted_16$3)) : createCommentVNode("", true),
						a.progress ? (openBlock(), createElementBlock("p", _hoisted_17$3, [_cache[4] || (_cache[4] = createBaseVNode("span", { class: "agent-field-label" }, "progress", -1)), createTextVNode(toDisplayString(truncate(a.progress)), 1)])) : createCommentVNode("", true),
						a.result ? (openBlock(), createElementBlock("p", _hoisted_18$2, [_cache[5] || (_cache[5] = createBaseVNode("span", { class: "agent-field-label" }, "result", -1)), createTextVNode(toDisplayString(truncate(a.result)), 1)])) : createCommentVNode("", true),
						createBaseVNode("p", _hoisted_19$2, " created " + toDisplayString(formatTime(a.createdAt)) + " · updated " + toDisplayString(formatTime(a.updatedAt)), 1),
						createBaseVNode("div", _hoisted_20$1, [
							createBaseVNode("button", {
								class: "agent-dash-btn",
								disabled: a.tabId == null || !a.tabAlive,
								onClick: ($event) => focusTab(a)
							}, " Focus tab ", 8, _hoisted_21$1),
							createBaseVNode("label", _hoisted_22$1, [withDirectives(createBaseVNode("input", {
								type: "checkbox",
								"onUpdate:modelValue": ($event) => closeTabFlags.value[a.agentId] = $event
							}, null, 8, _hoisted_23$1), [[vModelCheckbox, closeTabFlags.value[a.agentId]]]), _cache[6] || (_cache[6] = createTextVNode(" close tab ", -1))]),
							createBaseVNode("button", {
								class: "agent-dash-btn agent-dash-btn-ghost",
								onClick: ($event) => releaseAgent(a.agentId)
							}, " Release ", 8, _hoisted_24$1)
						])
					]);
				}), 128))]))
			]);
		};
	}
}), [["__scopeId", "data-v-82294280"]]);
//#endregion
//#region entrypoints/popup/components/AgentChatPage.vue?vue&type=script&setup=true&lang.ts
init_asyncToGenerator();
var _hoisted_1$2 = { class: "chat-page" };
var _hoisted_2$2 = { class: "chat-header" };
var _hoisted_3$2 = ["value"];
var _hoisted_4$2 = {
	key: 0,
	value: ""
};
var _hoisted_5$2 = ["value"];
var _hoisted_6$2 = ["disabled"];
var _hoisted_7$2 = {
	key: 0,
	class: "chat-tabbar"
};
var _hoisted_8$2 = {
	key: 0,
	class: "chat-empty"
};
var _hoisted_9$2 = { class: "chat-bubble" };
var _hoisted_10$2 = { key: 0 };
var _hoisted_11$2 = {
	key: 1,
	class: "chat-muted"
};
var _hoisted_12$2 = {
	key: 2,
	class: "chat-steps"
};
var _hoisted_13$2 = {
	key: 1,
	class: "chat-msg chat-assistant"
};
var _hoisted_14$2 = {
	key: 2,
	class: "chat-error"
};
var _hoisted_15$2 = { class: "chat-input-row" };
var _hoisted_16$2 = ["disabled", "onKeydown"];
var _hoisted_17$2 = ["disabled"];
//#endregion
//#region entrypoints/popup/components/AgentChatPage.vue
var AgentChatPage_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "AgentChatPage",
	emits: ["back"],
	setup(__props) {
		const sessions = ref([]);
		const currentId = ref("");
		const messages = ref([]);
		const boundTabId = ref(null);
		const draft = ref("");
		const running = ref(false);
		const pendingStart = ref(false);
		const statusUnknown = ref(false);
		const pendingPayloads = /* @__PURE__ */ new Map();
		let pollTimer = null;
		let pollGeneration = 0;
		let loadGeneration = 0;
		let disposed = false;
		const errorMsg = ref("");
		const scrollEl = ref(null);
		const visibleMessages = computed(() => messages.value.filter((m) => {
			if (m.role === "user") return true;
			if (m.role !== "assistant") return false;
			const hasText = typeof m.content === "string" && m.content.trim().length > 0;
			const hasSteps = Array.isArray(m.steps) && m.steps.length > 0;
			return hasText || hasSteps;
		}));
		function send_(type, extra = {}, timeoutMs = 15000, onLateResponse) {
			return new Promise((resolve) => {
				let settled = false;
				let timer = null;
				const finish = (value) => {
					if (settled) return;
					settled = true;
					if (timer) clearTimeout(timer);
					resolve(value);
				};
				if (timeoutMs > 0) timer = setTimeout(() => finish({
					ok: false,
					timedOut: true,
					error: `Background request ${type} timed out.`
				}), timeoutMs);
				try {
					chrome.runtime.sendMessage(_objectSpread2({ type }, extra), (resp) => {
						const lastError = chrome.runtime.lastError;
						const value = lastError ? { ok: false, error: lastError.message } : resp || { ok: false };
						if (settled) {
							try { if (onLateResponse) onLateResponse(value); } catch (_unusedLateResponse) {}
							return;
						}
						finish(value);
					});
				} catch (e) {
					finish({
						ok: false,
						error: String(e)
					});
				}
			});
		}
		function loadSessions() {
			return _loadSessions.apply(this, arguments);
		}
		function _loadSessions() {
			_loadSessions = _asyncToGenerator(function* () {
				const r = yield send_("scalemax_session_list");
				sessions.value = r.sessions || [];
			});
			return _loadSessions.apply(this, arguments);
		}
		function stopSessionPolling() {
			pollGeneration++;
			if (pollTimer) clearTimeout(pollTimer);
			pollTimer = null;
		}
		function newRunRequestId() {
			try { return crypto.randomUUID(); } catch (_unusedRequestId) { return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`; }
		}
		function restorePendingPayload(id) {
			const pending = pendingPayloads.get(id);
			if (!pending || !pending.rejected || currentId.value !== id) return false;
			if (!draft.value.trim() && pending.task) draft.value = pending.task;
			if (pending.attachments.length) attachments.value = [...pending.attachments, ...attachments.value];
			pendingPayloads.delete(id);
			return true;
		}
		function handleRunAcknowledgement(id, response) {
			const pending = pendingPayloads.get(id);
			const result = response === null || response === void 0 ? void 0 : response.result;
			if (!pending || !result || result.requestId !== pending.requestId) return;
			if (result.accepted === false) {
				pending.rejected = true;
				restorePendingPayload(id);
			} else if (result.accepted === true) pendingPayloads.delete(id);
		}
		function reconcilePendingPayload(id, session) {
			const pending = pendingPayloads.get(id);
			if (!pending) return;
			const lastRun = session === null || session === void 0 ? void 0 : session.lastRun;
			if (lastRun && lastRun.requestId === pending.requestId && lastRun.durable === true) {
				pendingPayloads.delete(id);
				return;
			}
			if (pending.rejected) {
				restorePendingPayload(id);
				return;
			}
			if (pending.detachedAt && Date.now() - pending.detachedAt > 10000 && session && !session.running && !pendingStart.value) {
				pending.rejected = true;
				restorePendingPayload(id);
			}
		}
		function applyPopupSessionSnapshot(id, s) {
			if (disposed || currentId.value !== id) return;
			if (!s) {
				pendingPayloads.delete(id);
				running.value = false;
				pendingStart.value = false;
				statusUnknown.value = false;
				messages.value = [];
				boundTabId.value = null;
				stopSessionPolling();
				return;
			}
			reconcilePendingPayload(id, s);
			boundTabId.value = typeof s.tabId === "number" ? s.tabId : null;
			messages.value = (s.messages || []).map((m) => ({
				role: m.role,
				content: m.content,
				steps: m._steps
			}));
			statusUnknown.value = false;
			if (s.running) {
				pendingStart.value = false;
				running.value = true;
				if (!pollTimer) startSessionPolling(id);
			} else if (!pendingStart.value) {
				const pending = pendingPayloads.get(id);
				if (pending && !pending.rejected) {
					running.value = true;
					if (!pollTimer) startSessionPolling(id);
				} else {
					running.value = false;
					stopSessionPolling();
				}
			}
			if (!s.running && s.lastRun && (s.lastRun.state === "error" || s.lastRun.state === "interrupted") && s.lastRun.error) errorMsg.value = s.lastRun.error;
		}
		function startSessionPolling(id) {
			stopSessionPolling();
			const generation = ++pollGeneration;
			const schedule = (delay) => {
				if (disposed || generation !== pollGeneration || currentId.value !== id) return;
				pollTimer = setTimeout(() => {
					_asyncToGenerator(function* () {
						const r = yield send_("scalemax_session_get", { id });
						if (disposed || generation !== pollGeneration || currentId.value !== id) return;
						if (r.ok) {
							applyPopupSessionSnapshot(id, r.session || null);
							const stillPending = pendingPayloads.get(id);
							if (!r.session || (!r.session.running && !pendingStart.value && !(stillPending && !stillPending.rejected))) return;
						} else {
							statusUnknown.value = true;
							running.value = true;
							errorMsg.value = "Agent status unavailable — reconnecting…";
						}
						if (generation === pollGeneration) schedule(2000);
					})().catch(() => {
						if (generation === pollGeneration) schedule(2000);
					});
				}, delay);
			};
			schedule(250);
		}
		function loadSession(_x) {
			return _loadSession.apply(this, arguments);
		}
		function _loadSession() {
			_loadSession = _asyncToGenerator(function* (id) {
				const generation = ++loadGeneration;
				if (!id) {
					messages.value = [];
					boundTabId.value = null;
					running.value = false;
					stopSessionPolling();
					return null;
				}
				const r = yield send_("scalemax_session_get", { id });
				if (disposed || generation !== loadGeneration || currentId.value !== id) return null;
				if (!r.ok) {
					statusUnknown.value = true;
					running.value = true;
					errorMsg.value = r.error || "Agent status unavailable — reconnecting…";
					startSessionPolling(id);
					return null;
				}
				applyPopupSessionSnapshot(id, r.session || null);
				yield scrollToBottom();
				return r.session || null;
			});
			return _loadSession.apply(this, arguments);
		}
		function scrollToBottom() {
			return _scrollToBottom.apply(this, arguments);
		}
		function _scrollToBottom() {
			_scrollToBottom = _asyncToGenerator(function* () {
				yield nextTick();
				if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight;
			});
			return _scrollToBottom.apply(this, arguments);
		}
		function onSelect(e) {
			stopSessionPolling();
			loadGeneration++;
			pendingStart.value = false;
			statusUnknown.value = true;
			running.value = true;
			currentId.value = e.target.value;
			loadSession(currentId.value);
		}
		function newSession() {
			return _newSession.apply(this, arguments);
		}
		function _newSession() {
			_newSession = _asyncToGenerator(function* () {
				const r = yield send_("scalemax_session_create");
				if (r.session) {
					yield loadSessions();
					currentId.value = r.session.id;
					yield loadSession(currentId.value);
				}
			});
			return _newSession.apply(this, arguments);
		}
		function removeSession() {
			return _removeSession.apply(this, arguments);
		}
		function _removeSession() {
			_removeSession = _asyncToGenerator(function* () {
				if (!currentId.value) return;
				const deletedId = currentId.value;
				yield send_("scalemax_session_delete", {
					id: deletedId,
					closeTab: true
				});
				pendingPayloads.delete(deletedId);
				currentId.value = "";
				loadGeneration++;
				stopSessionPolling();
				pendingStart.value = false;
				statusUnknown.value = false;
				running.value = false;
				messages.value = [];
				boundTabId.value = null;
				yield loadSessions();
				if (sessions.value.length) {
					currentId.value = sessions.value[0].id;
					yield loadSession(currentId.value);
				}
			});
			return _removeSession.apply(this, arguments);
		}
		function focusTab() {
			return _focusTab.apply(this, arguments);
		}
		function _focusTab() {
			_focusTab = _asyncToGenerator(function* () {
				if (boundTabId.value == null) return;
				try {
					const tab = yield chrome.tabs.update(boundTabId.value, { active: true });
					if ((tab === null || tab === void 0 ? void 0 : tab.windowId) != null) yield chrome.windows.update(tab.windowId, { focused: true });
				} catch (_unused) {}
			});
			return _focusTab.apply(this, arguments);
		}
		// --- Image attachments (drag-and-drop / paste / file picker) ---------------
		// Mirrors the shape buildUserMessage() in background.js expects: each entry is
		// { type: "image", name, content } where `content` is a full data: URL string
		// (background.js:71901-71923). This is intentionally a smaller, local copy
		// rather than reusing the side panel's useAttachments composable — that
		// composable stores { dataBase64, mimeType } and is wired to a different
		// component tree; duplicating the ~30 lines needed here is simpler and safer
		// than threading a shared composable across two otherwise-independent chunks.
		const MAX_CHAT_ATTACHMENTS = 4;
		const MAX_CHAT_ATTACHMENT_BYTES = 10 * 1024 * 1024;
		const ALLOWED_CHAT_IMAGE_TYPES = /* @__PURE__ */ new Set(["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"]);
		const attachments = ref([]);
		const attachError = ref("");
		const isDragOver = ref(false);
		const visionEnabled = ref(false);
		const fileInputRef = ref(null);
		function fileToDataUrl(file) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(String(reader.result));
				reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
				reader.readAsDataURL(file);
			});
		}
		function handleAttachmentFiles(_x) {
			return _handleAttachmentFiles.apply(this, arguments);
		}
		function _handleAttachmentFiles() {
			_handleAttachmentFiles = _asyncToGenerator(function* (files) {
				attachError.value = "";
				const images = files.filter((f) => ALLOWED_CHAT_IMAGE_TYPES.has(f.type));
				if (!images.length) {
					attachError.value = "Only PNG, JPEG, GIF, and WebP images are supported.";
					return;
				}
				const remaining = MAX_CHAT_ATTACHMENTS - attachments.value.length;
				if (remaining <= 0) {
					attachError.value = `Maximum ${MAX_CHAT_ATTACHMENTS} images per message.`;
					return;
				}
				const toProcess = images.slice(0, remaining);
				if (toProcess.length < images.length) attachError.value = `Only ${remaining} more image(s) allowed for this message.`;
				for (const file of toProcess) {
					if (file.size > MAX_CHAT_ATTACHMENT_BYTES) {
						attachError.value = `"${file.name}" is too large (max 10MB).`;
						continue;
					}
					try {
						const dataUrl = yield fileToDataUrl(file);
						attachments.value.push({
							type: "image",
							name: file.name || "image",
							content: dataUrl
						});
					} catch (err) {
						attachError.value = `Failed to read "${file.name}".`;
					}
				}
			});
			return _handleAttachmentFiles.apply(this, arguments);
		}
		function removeAttachment(index) {
			attachments.value.splice(index, 1);
		}
		function openFilePicker() {
			var _fileInputRef$value;
			(_fileInputRef$value = fileInputRef.value) === null || _fileInputRef$value === void 0 || _fileInputRef$value.click();
		}
		function onFileInputChange(_x2) {
			return _onFileInputChange.apply(this, arguments);
		}
		function _onFileInputChange() {
			_onFileInputChange = _asyncToGenerator(function* (event) {
				const input = event.target;
				const files = input.files;
				if (files && files.length) yield handleAttachmentFiles(Array.from(files));
				input.value = "";
			});
			return _onFileInputChange.apply(this, arguments);
		}
		function onChatDragOver(event) {
			event.preventDefault();
			isDragOver.value = true;
		}
		function onChatDragLeave(event) {
			event.preventDefault();
			isDragOver.value = false;
		}
		function onChatDrop(_x3) {
			return _onChatDrop.apply(this, arguments);
		}
		function _onChatDrop() {
			_onChatDrop = _asyncToGenerator(function* (event) {
				var _event$dataTransfer;
				event.preventDefault();
				isDragOver.value = false;
				const files = (_event$dataTransfer = event.dataTransfer) === null || _event$dataTransfer === void 0 ? void 0 : _event$dataTransfer.files;
				if (files && files.length) yield handleAttachmentFiles(Array.from(files));
			});
			return _onChatDrop.apply(this, arguments);
		}
		function onChatPaste(_x4) {
			return _onChatPaste.apply(this, arguments);
		}
		function _onChatPaste() {
			_onChatPaste = _asyncToGenerator(function* (event) {
				var _event$clipboardData;
				const items = (_event$clipboardData = event.clipboardData) === null || _event$clipboardData === void 0 ? void 0 : _event$clipboardData.items;
				if (!items) return;
				const files = [];
				for (const item of items) if (item.kind === "file" && item.type.startsWith("image/")) {
					const f = item.getAsFile();
					if (f) files.push(f);
				}
				if (files.length) {
					event.preventDefault();
					yield handleAttachmentFiles(files);
				}
			});
			return _onChatPaste.apply(this, arguments);
		}
		function refreshVisionEnabled() {
			return _refreshVisionEnabled.apply(this, arguments);
		}
		function _refreshVisionEnabled() {
			_refreshVisionEnabled = _asyncToGenerator(function* () {
				try {
					const cfg = (yield chrome.storage.local.get(PROVIDER_STORAGE_KEY))[PROVIDER_STORAGE_KEY];
					visionEnabled.value = !!(cfg && cfg.vision === true);
				} catch (_unusedRefreshVision) {
					visionEnabled.value = false;
				}
			});
			return _refreshVisionEnabled.apply(this, arguments);
		}
		function send() {
			return _send.apply(this, arguments);
		}
		function _send() {
			_send = _asyncToGenerator(function* () {
				var _r$result;
				const task = draft.value.trim();
				const sid = currentId.value;
				const pendingAttachments = attachments.value.slice();
				if ((!task && !pendingAttachments.length) || !sid || running.value || pendingStart.value || statusUnknown.value) return;
				const requestId = newRunRequestId();
				pendingPayloads.set(sid, {
					requestId,
					task,
					attachments: pendingAttachments.slice(),
					rejected: false,
					detachedAt: null
				});
				errorMsg.value = "";
				// Vision isn't per-message here — it's the AI Provider page's global
				// "Send a screenshot..." setting (cfg.vision). If it's off,
				// buildUserMessage() on the background side silently swaps every image
				// for a text placeholder the model can read but not see.
				if (pendingAttachments.length && !visionEnabled.value) errorMsg.value = "Note: vision is off in AI Provider settings, so the model will see that an image was attached but not the image itself.";
				messages.value.push({
					role: "user",
					content: task || (pendingAttachments.length ? `[${pendingAttachments.length} image(s)]` : "")
				});
				draft.value = "";
				attachments.value = [];
				attachError.value = "";
				pendingStart.value = true;
				statusUnknown.value = false;
				running.value = true;
				startSessionPolling(sid);
				yield scrollToBottom();
				const r = yield send_("scalemax_session_run", { payload: {
					sessionId: sid,
					requestId,
					task: task || "Describe the attached image(s).",
					attachments: pendingAttachments
				} }, 15000, (lateResponse) => {
					if (!disposed) handleRunAcknowledgement(sid, lateResponse);
				});
				handleRunAcknowledgement(sid, r);
				if (r.timedOut) {
					const pending = pendingPayloads.get(sid);
					if (pending && pending.requestId === requestId) pending.detachedAt = Date.now();
				}
				if (currentId.value === sid) {
					pendingStart.value = false;
					restorePendingPayload(sid);
					if (!r.ok && !r.timedOut) errorMsg.value = r.error || "run failed";
					else if ((_r$result = r.result) === null || _r$result === void 0 ? void 0 : _r$result.error) errorMsg.value = r.result.error;
					const snapshot = yield loadSession(sid);
					if (!snapshot && running.value) {
						statusUnknown.value = true;
						if (!pollTimer) startSessionPolling(sid);
					}
				}
				yield loadSessions();
			});
			return _send.apply(this, arguments);
		}
		onMounted(_asyncToGenerator(function* () {
			yield loadSessions();
			if (sessions.value.length) {
				currentId.value = sessions.value[0].id;
				yield loadSession(currentId.value);
			} else yield newSession();
			yield refreshVisionEnabled();
		}));
		onUnmounted(() => {
			disposed = true;
			loadGeneration++;
			stopSessionPolling();
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: "chat-page",
				onDragover: onChatDragOver,
				onDragleave: onChatDragLeave,
				onDrop: onChatDrop,
				onPaste: onChatPaste
			}, [
				isDragOver.value ? (openBlock(), createElementBlock("div", {
					key: "chat-drop-overlay",
					class: "chat-drop-overlay"
				}, "Drop image to attach")) : createCommentVNode("", true),
				createBaseVNode("div", _hoisted_2$2, [
					createBaseVNode("button", {
						class: "chat-back",
						onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("back"))
					}, "‹"),
					createBaseVNode("select", {
						class: "chat-session-select",
						value: currentId.value,
						onChange: onSelect
					}, [!sessions.value.length ? (openBlock(), createElementBlock("option", _hoisted_4$2, "No sessions")) : createCommentVNode("", true), (openBlock(true), createElementBlock(Fragment, null, renderList(sessions.value, (s) => {
						return openBlock(), createElementBlock("option", {
							key: s.id,
							value: s.id
						}, toDisplayString(s.title || "Session") + " · " + toDisplayString(s.messageCount) + " msg ", 9, _hoisted_5$2);
					}), 128))], 40, _hoisted_3$2),
					createBaseVNode("button", {
						class: "chat-icon-btn",
						title: "New session",
						onClick: newSession
					}, "＋"),
					createBaseVNode("button", {
						class: "chat-icon-btn",
						title: "Delete session",
						disabled: !currentId.value,
						onClick: removeSession
					}, "🗑", 8, _hoisted_6$2)
				]),
				boundTabId.value != null ? (openBlock(), createElementBlock("div", _hoisted_7$2, [createTextVNode(" Tab #" + toDisplayString(boundTabId.value) + " ", 1), createBaseVNode("button", {
					class: "chat-link",
					onClick: focusTab
				}, "focus")])) : createCommentVNode("", true),
				createBaseVNode("div", {
					ref_key: "scrollEl",
					ref: scrollEl,
					class: "chat-messages"
				}, [
					!visibleMessages.value.length && !running.value ? (openBlock(), createElementBlock("div", _hoisted_8$2, " Start a conversation. The agent works in ONE tab and remembers this session. ")) : createCommentVNode("", true),
					(openBlock(true), createElementBlock(Fragment, null, renderList(visibleMessages.value, (m, i) => {
						return openBlock(), createElementBlock("div", {
							key: i,
							class: normalizeClass(["chat-msg", m.role === "user" ? "chat-user" : "chat-assistant"])
						}, [createBaseVNode("div", _hoisted_9$2, [m.content ? (openBlock(), createElementBlock("span", _hoisted_10$2, toDisplayString(m.content), 1)) : (openBlock(), createElementBlock("span", _hoisted_11$2, "(no text — see tool steps)")), m.steps && m.steps.length ? (openBlock(), createElementBlock("div", _hoisted_12$2, toDisplayString(m.steps.length) + " tool step(s): " + toDisplayString(m.steps.map((s) => s.tool + (s.ok ? "✓" : "✗")).join(", ")), 1)) : createCommentVNode("", true)])], 2);
					}), 128)),
					running.value ? (openBlock(), createElementBlock("div", _hoisted_13$2, [..._cache[2] || (_cache[2] = [createBaseVNode("div", { class: "chat-bubble chat-running" }, "Working…", -1)])])) : createCommentVNode("", true),
					errorMsg.value ? (openBlock(), createElementBlock("p", _hoisted_14$2, toDisplayString(errorMsg.value), 1)) : createCommentVNode("", true)
				], 512),
				attachments.value.length ? (openBlock(), createElementBlock("div", {
					key: "chat-attachments-strip",
					class: "chat-attachments-strip"
				}, [(openBlock(true), createElementBlock(Fragment, null, renderList(attachments.value, (att, idx) => {
					return openBlock(), createElementBlock("div", {
						key: idx,
						class: "chat-attachment-thumb"
					}, [createBaseVNode("img", {
						src: att.content,
						alt: att.name
					}, null, 8, ["src", "alt"]), createBaseVNode("button", {
						class: "chat-attachment-remove",
						type: "button",
						title: "Remove " + att.name,
						onClick: ($event) => removeAttachment(idx)
					}, "×", 8, ["title", "onClick"])]);
				}), 128))])) : createCommentVNode("", true),
				attachError.value ? (openBlock(), createElementBlock("p", {
					key: "chat-attach-error",
					class: "chat-attach-error"
				}, toDisplayString(attachError.value), 1)) : createCommentVNode("", true),
				createBaseVNode("div", _hoisted_15$2, [createBaseVNode("input", {
					ref_key: "fileInputRef",
					ref: fileInputRef,
					type: "file",
					accept: "image/png,image/jpeg,image/gif,image/webp",
					multiple: "",
					class: "chat-file-input",
					onChange: onFileInputChange
				}, null, 544), createBaseVNode("button", {
					class: "chat-attach-btn",
					type: "button",
					title: "Attach image",
					disabled: running.value,
					onClick: openFilePicker
				}, "📎", 8, ["disabled"]), withDirectives(createBaseVNode("textarea", {
					class: "chat-input",
					"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => draft.value = $event),
					rows: "2",
					placeholder: "Message the agent… (Enter to send)",
					disabled: running.value,
					onKeydown: withKeys(withModifiers(send, ["exact", "prevent"]), ["enter"])
				}, null, 40, _hoisted_16$2), [[vModelText, draft.value]]), createBaseVNode("button", {
					class: "chat-send",
					disabled: running.value || !currentId.value || !draft.value.trim() && !attachments.value.length,
					onClick: send
				}, toDisplayString(running.value ? "…" : "Send"), 9, _hoisted_17$2)])
			]);
		};
	}
}), [["__scopeId", "data-v-60f0d375"]]);
//#endregion
//#region entrypoints/popup/components/SchedulerPage.vue?vue&type=script&setup=true&lang.ts
init_asyncToGenerator();
var _hoisted_1$1 = { class: "sched-page" };
var _hoisted_2$1 = { class: "sched-header" };
var _hoisted_3$1 = { class: "sched-form" };
var _hoisted_4$1 = { class: "sched-form-actions" };
var _hoisted_5$1 = ["disabled"];
var _hoisted_6$1 = { class: "sched-label" };
var _hoisted_7$1 = {
	key: 0,
	class: "sched-empty"
};
var _hoisted_8$1 = {
	key: 1,
	class: "sched-list"
};
var _hoisted_9$1 = { class: "sched-item-top" };
var _hoisted_10$1 = { class: "sched-item-name" };
var _hoisted_11$1 = { class: "sched-interval" };
var _hoisted_12$1 = { class: "sched-toggle" };
var _hoisted_13$1 = ["checked", "onChange"];
var _hoisted_14$1 = { class: "sched-item-task" };
var _hoisted_15$1 = { class: "sched-item-meta" };
var _hoisted_16$1 = {
	key: 0,
	class: "sched-item-result"
};
var _hoisted_17$1 = { class: "sched-item-actions" };
var _hoisted_18$1 = ["onClick"];
var _hoisted_19$1 = ["onClick"];
var JOBS_KEY = "scalemax_jobs";
//#endregion
//#region entrypoints/popup/components/SchedulerPage.vue
var SchedulerPage_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "SchedulerPage",
	emits: ["back"],
	setup(__props) {
		const jobs = ref([]);
		const saving = ref(false);
		const statusMsg = ref("");
		const statusOk = ref(true);
		const editingId = ref(null);
		const form = ref({
			name: "",
			task: "",
			everyMinutes: 60
		});
		const canSave = computed(() => form.value.name.trim().length > 0 && form.value.task.trim().length > 0);
		function setStatus(msg, ok = true) {
			statusMsg.value = msg;
			statusOk.value = ok;
			if (msg) setTimeout(() => {
				if (statusMsg.value === msg) statusMsg.value = "";
			}, 3e3);
		}
		function genId() {
			return `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
		}
		function formatTime(ts) {
			if (!ts) return "—";
			try {
				return new Date(ts).toLocaleString();
			} catch (_unused) {
				return "—";
			}
		}
		function loadJobs() {
			return _loadJobs.apply(this, arguments);
		}
		function _loadJobs() {
			_loadJobs = _asyncToGenerator(function* () {
				try {
					const res = yield chrome.storage.local.get(JOBS_KEY);
					const stored = res === null || res === void 0 ? void 0 : res[JOBS_KEY];
					jobs.value = Array.isArray(stored) ? stored : [];
				} catch (e) {
					setStatus("Failed to load jobs: " + ((e === null || e === void 0 ? void 0 : e.message) || e), false);
				}
			});
			return _loadJobs.apply(this, arguments);
		}
		function persistJobs(_x) {
			return _persistJobs.apply(this, arguments);
		}
		function _persistJobs() {
			_persistJobs = _asyncToGenerator(function* (next) {
				try {
					yield chrome.storage.local.set({ [JOBS_KEY]: next });
					jobs.value = next;
				} catch (e) {
					setStatus("Failed to save jobs: " + ((e === null || e === void 0 ? void 0 : e.message) || e), false);
					return;
				}
				try {
					yield chrome.runtime.sendMessage({ type: "scalemax_jobs_changed" });
				} catch (_unused2) {}
			});
			return _persistJobs.apply(this, arguments);
		}
		function resetForm() {
			form.value = {
				name: "",
				task: "",
				everyMinutes: 60
			};
			editingId.value = null;
		}
		function startEdit(job) {
			editingId.value = job.id;
			form.value = {
				name: job.name,
				task: job.task,
				everyMinutes: job.everyMinutes
			};
		}
		function saveForm() {
			return _saveForm.apply(this, arguments);
		}
		function _saveForm() {
			_saveForm = _asyncToGenerator(function* () {
				if (!canSave.value) return setStatus("Name and task are required.", false);
				const everyMinutes = Math.max(1, Math.floor(Number(form.value.everyMinutes)) || 1);
				saving.value = true;
				try {
					const current = jobs.value.slice();
					if (editingId.value) {
						const idx = current.findIndex((j) => j.id === editingId.value);
						if (idx >= 0) current[idx] = _objectSpread2(_objectSpread2({}, current[idx]), {}, {
							name: form.value.name.trim(),
							task: form.value.task.trim(),
							everyMinutes
						});
					} else current.push({
						id: genId(),
						name: form.value.name.trim(),
						task: form.value.task.trim(),
						everyMinutes,
						enabled: true
					});
					yield persistJobs(current);
					setStatus(editingId.value ? "Job updated." : "Job added.", true);
					resetForm();
				} finally {
					saving.value = false;
				}
			});
			return _saveForm.apply(this, arguments);
		}
		function toggleEnabled(_x2, _x3) {
			return _toggleEnabled.apply(this, arguments);
		}
		function _toggleEnabled() {
			_toggleEnabled = _asyncToGenerator(function* (job, on) {
				yield persistJobs(jobs.value.map((j) => j.id === job.id ? _objectSpread2(_objectSpread2({}, j), {}, { enabled: on }) : j));
			});
			return _toggleEnabled.apply(this, arguments);
		}
		function deleteJob(_x4) {
			return _deleteJob.apply(this, arguments);
		}
		function _deleteJob() {
			_deleteJob = _asyncToGenerator(function* (id) {
				yield persistJobs(jobs.value.filter((j) => j.id !== id));
				if (editingId.value === id) resetForm();
				setStatus("Job deleted.", true);
			});
			return _deleteJob.apply(this, arguments);
		}
		onMounted(loadJobs);
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$1, [
				createBaseVNode("div", _hoisted_2$1, [createBaseVNode("button", {
					class: "sched-back",
					onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("back"))
				}, "‹ Back"), _cache[4] || (_cache[4] = createBaseVNode("h1", null, "Scheduler", -1))]),
				_cache[9] || (_cache[9] = createBaseVNode("p", { class: "sched-sub" }, " Run agent tasks on a timer using the browser's alarm clock — this keeps working with only the browser open, no PC or native server required. ", -1)),
				createBaseVNode("div", _hoisted_3$1, [
					_cache[5] || (_cache[5] = createBaseVNode("label", { class: "sched-label" }, "Name", -1)),
					withDirectives(createBaseVNode("input", {
						class: "sched-input",
						"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.name = $event),
						placeholder: "e.g. Morning news digest"
					}, null, 512), [[vModelText, form.value.name]]),
					_cache[6] || (_cache[6] = createBaseVNode("label", { class: "sched-label" }, "Task", -1)),
					withDirectives(createBaseVNode("textarea", {
						class: "sched-input sched-textarea",
						"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.task = $event),
						rows: "3",
						placeholder: "e.g. search Google News for 'AI regulation' and summarize the top 5 stories"
					}, null, 512), [[vModelText, form.value.task]]),
					_cache[7] || (_cache[7] = createBaseVNode("label", { class: "sched-label" }, "Every (minutes)", -1)),
					withDirectives(createBaseVNode("input", {
						class: "sched-input sched-minutes",
						"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.everyMinutes = $event),
						type: "number",
						min: "1",
						step: "1",
						placeholder: "60"
					}, null, 512), [[
						vModelText,
						form.value.everyMinutes,
						void 0,
						{ number: true }
					]]),
					createBaseVNode("div", _hoisted_4$1, [
						createBaseVNode("button", {
							class: "sched-btn",
							disabled: saving.value || !canSave.value,
							onClick: saveForm
						}, toDisplayString(saving.value ? "Saving…" : editingId.value ? "Update job" : "Add job"), 9, _hoisted_5$1),
						editingId.value ? (openBlock(), createElementBlock("button", {
							key: 0,
							class: "sched-btn sched-btn-ghost",
							onClick: resetForm
						}, " Cancel edit ")) : createCommentVNode("", true),
						statusMsg.value ? (openBlock(), createElementBlock("span", {
							key: 1,
							class: normalizeClass(["sched-status", statusOk.value ? "ok" : "err"])
						}, toDisplayString(statusMsg.value), 3)) : createCommentVNode("", true)
					])
				]),
				_cache[10] || (_cache[10] = createBaseVNode("hr", { class: "sched-divider" }, null, -1)),
				createBaseVNode("label", _hoisted_6$1, "Jobs (" + toDisplayString(jobs.value.length) + ")", 1),
				!jobs.value.length ? (openBlock(), createElementBlock("div", _hoisted_7$1, "No scheduled jobs yet. Add one above.")) : (openBlock(), createElementBlock("ul", _hoisted_8$1, [(openBlock(true), createElementBlock(Fragment, null, renderList(jobs.value, (job) => {
					return openBlock(), createElementBlock("li", {
						key: job.id,
						class: "sched-item"
					}, [
						createBaseVNode("div", _hoisted_9$1, [createBaseVNode("div", _hoisted_10$1, [createTextVNode(toDisplayString(job.name) + " ", 1), createBaseVNode("span", _hoisted_11$1, "every " + toDisplayString(job.everyMinutes) + "m", 1)]), createBaseVNode("label", _hoisted_12$1, [createBaseVNode("input", {
							type: "checkbox",
							checked: job.enabled,
							onChange: ($event) => toggleEnabled(job, $event.target.checked)
						}, null, 40, _hoisted_13$1), _cache[8] || (_cache[8] = createBaseVNode("span", { class: "sched-toggle-slider" }, null, -1))])]),
						createBaseVNode("div", _hoisted_14$1, toDisplayString(job.task), 1),
						createBaseVNode("div", _hoisted_15$1, [createBaseVNode("span", null, "Next run: " + toDisplayString(formatTime(job.nextRunAt)), 1), createBaseVNode("span", null, "Last run: " + toDisplayString(formatTime(job.lastRun)), 1)]),
						job.lastResult ? (openBlock(), createElementBlock("div", _hoisted_16$1, toDisplayString(job.lastResult), 1)) : createCommentVNode("", true),
						createBaseVNode("div", _hoisted_17$1, [createBaseVNode("button", {
							class: "sched-link-btn",
							onClick: ($event) => startEdit(job)
						}, "Edit", 8, _hoisted_18$1), createBaseVNode("button", {
							class: "sched-link-btn sched-link-danger",
							onClick: ($event) => deleteJob(job.id)
						}, " Delete ", 8, _hoisted_19$1)])
					]);
				}), 128))]))
			]);
		};
	}
}), [["__scopeId", "data-v-895d9519"]]);
//#endregion
//#region entrypoints/popup/App.vue?vue&type=script&setup=true&lang.ts
init_asyncToGenerator();
var _hoisted_1 = ["data-agent-theme"];
var _hoisted_2 = { class: "home-view" };
var _hoisted_3 = { class: "header" };
var _hoisted_4 = { class: "header-content" };
var _hoisted_5 = { class: "header-title" };
var _hoisted_6 = { class: "content" };
var _hoisted_7 = {
	key: 0,
	class: "section"
};
var _hoisted_8 = { class: "section-title" };
var _hoisted_9 = { class: "config-card" };
var _hoisted_10 = { class: "status-section" };
var _hoisted_11 = { class: "status-header" };
var _hoisted_12 = { class: "status-label" };
var _hoisted_13 = ["title"];
var _hoisted_14 = { class: "status-info" };
var _hoisted_15 = { class: "status-text" };
var _hoisted_16 = {
	key: 0,
	class: "status-timestamp"
};
var _hoisted_17 = {
	key: 0,
	class: "mcp-config-section"
};
var _hoisted_18 = { class: "mcp-config-header" };
var _hoisted_19 = { class: "mcp-config-label" };
var _hoisted_20 = { class: "mcp-config-content" };
var _hoisted_21 = { class: "mcp-config-json" };
var _hoisted_22 = { class: "port-section" };
var _hoisted_23 = {
	for: "port",
	class: "port-label"
};
var _hoisted_24 = ["value"];
var _hoisted_25 = ["disabled"];
var _hoisted_26 = {
	key: 1,
	class: "section"
};
var _hoisted_27 = { class: "rr-icon-buttons" };
var _hoisted_28 = { class: "section" };
var _hoisted_29 = { class: "entry-card" };
var _hoisted_30 = { class: "entry-icon workflow" };
var _hoisted_31 = {
	key: 0,
	class: "coming-soon-toast"
};
//#endregion
//#region entrypoints/popup/App.vue
var App_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "App",
	setup(__props) {
		const scalemaxOnly = true;
		const productName = PRODUCT_NAME;
		const { theme: agentTheme, initTheme } = useAgentTheme();
		const currentView = ref("home");
		/**
		* Launch the roomy Browser Agent in Chrome's side panel (instead of the cramped
		* popup). Requests the side panel open to the browser-agent tab, then closes the
		* popup. Falls back to the in-popup chat page if the side panel API is unavailable.
		*/
		function openBrowserAgentSidepanel() {
			return _openBrowserAgentSidepanel.apply(this, arguments);
		}
		function _openBrowserAgentSidepanel() {
			_openBrowserAgentSidepanel = _asyncToGenerator(function* () {
				try {
					var _chrome$sidePanel, _chrome$sidePanel$ope;
					yield chrome.storage.local.set({ scalemax_sidepanel_tab: "browser-agent" });
					let tabId=null; let winId=null;
					try{const [tab]=yield chrome.tabs.query({active:true,currentWindow:true}); if(tab){tabId=tab.id; winId=tab.windowId;}}catch(e){}
					if(!winId){const win=yield chrome.windows.getCurrent(); winId=win.id;}
					if(tabId && chrome.sidePanel?.setOptions){ try{yield chrome.sidePanel.setOptions({tabId, path:"sidepanel.html?tab=browser-agent", enabled:true});}catch(e){}}
					if(tabId){ try{yield (_chrome$sidePanel = chrome.sidePanel) === null || _chrome$sidePanel === void 0 || (_chrome$sidePanel$ope = _chrome$sidePanel.open) === null || _chrome$sidePanel$ope === void 0 ? void 0 : _chrome$sidePanel$ope.call(_chrome$sidePanel, { tabId }); window.close(); return;}catch(e){}}
					yield (_chrome$sidePanel = chrome.sidePanel) === null || _chrome$sidePanel === void 0 || (_chrome$sidePanel$ope = _chrome$sidePanel.open) === null || _chrome$sidePanel$ope === void 0 ? void 0 : _chrome$sidePanel$ope.call(_chrome$sidePanel, { windowId: winId });
					window.close();
				} catch (_unused) {
					currentView.value = "agent-chat";
				}
			});
			return _openBrowserAgentSidepanel.apply(this, arguments);
		}
		const comingSoonToast = ref({
			show: false,
			feature: ""
		});
		function showComingSoonToast(feature) {
			comingSoonToast.value = {
				show: true,
				feature
			};
			setTimeout(() => {
				comingSoonToast.value = {
					show: false,
					feature: ""
				};
			}, 2e3);
		}
		ref(false);
		const rrFlows = ref([]);
		const rrOnlyBound = ref(false);
		const rrSearch = ref("");
		const currentTabUrl = ref("");
		computed(() => {
			const base = rrOnlyBound.value ? rrFlows.value.filter(isFlowBoundToCurrent) : rrFlows.value;
			const q = rrSearch.value.trim().toLowerCase();
			if (!q) return base;
			return base.filter((f) => {
				var _f$meta, _f$meta2;
				const name = String(f.name || "").toLowerCase();
				const domain = String((f === null || f === void 0 || (_f$meta = f.meta) === null || _f$meta === void 0 ? void 0 : _f$meta.domain) || "").toLowerCase();
				const tags = ((f === null || f === void 0 || (_f$meta2 = f.meta) === null || _f$meta2 === void 0 ? void 0 : _f$meta2.tags) || []).join(",").toLowerCase();
				return name.includes(q) || domain.includes(q) || tags.includes(q);
			});
		});
		const loadFlows = function() {
			var _ref = _asyncToGenerator(function* () {
				try {
					const res = yield chrome.runtime.sendMessage({ type: BACKGROUND_MESSAGE_TYPES.RR_LIST_FLOWS });
					if (res && res.success) rrFlows.value = res.flows || [];
				} catch (e) {}
			});
			return function loadFlows() {
				return _ref.apply(this, arguments);
			};
		}();
		function isFlowBoundToCurrent(flow) {
			try {
				var _flow$meta;
				const bindings = (flow === null || flow === void 0 || (_flow$meta = flow.meta) === null || _flow$meta === void 0 ? void 0 : _flow$meta.bindings) || [];
				if (!bindings.length) return false;
				if (!currentTabUrl.value) return true;
				const url = new URL(currentTabUrl.value);
				return bindings.some((b) => {
					if (b.type === "domain") return url.hostname.includes(b.value);
					if (b.type === "path") return url.pathname.startsWith(b.value);
					if (b.type === "url") return (url.href || "").startsWith(b.value);
					return false;
				});
			} catch (_unused2) {
				return false;
			}
		}
		const startRecording = function() {
			var _ref2 = _asyncToGenerator(function* () {
				showComingSoonToast("Record & Replay");
			});
			return function startRecording() {
				return _ref2.apply(this, arguments);
			};
		}();
		const stopRecording = function() {
			var _ref3 = _asyncToGenerator(function* () {
				showComingSoonToast("Record & Replay");
			});
			return function stopRecording() {
				return _ref3.apply(this, arguments);
			};
		}();
		(function() {
			var _ref4 = _asyncToGenerator(function* (flowId) {
				try {
					let flow = null;
					try {
						const getRes = yield chrome.runtime.sendMessage({
							type: BACKGROUND_MESSAGE_TYPES.RR_GET_FLOW,
							flowId
						});
						if (getRes && getRes.success) flow = getRes.flow;
					} catch (_unused3) {}
					const runOptions = flow && flow.meta && flow.meta.runOptions || {};
					const res = yield chrome.runtime.sendMessage({
						type: BACKGROUND_MESSAGE_TYPES.RR_RUN_FLOW,
						flowId,
						options: _objectSpread2(_objectSpread2(_objectSpread2({}, runOptions), {}), {}, { returnLogs: true })
					});
					if (!(res && res.success)) {
						console.warn("回放失败");
						return;
					}
					try {
						const result = res.result;
						if (result && result.success === false) {
							const failed = (result.logs || []).find((l) => l.status === "failed");
							if (failed && failed.stepId) {
								if (flow) openBuilderWindow(flow.id, String(failed.stepId));
							}
						} else if (result && result.success === true) {
							const fb = (result.logs || []).find((l) => l.fallbackUsed && l.fallbackTo);
							if (fb && flow) openBuilderWindow(flow.id, String(fb.stepId || ""));
						}
					} catch (_unused4) {}
				} catch (e) {
					console.error("回放失败:", e);
				}
			});
			return function runFlow(_x) {
				return _ref4.apply(this, arguments);
			};
		})();
		const nativeConnectionStatus = ref("unknown");
		const isConnecting = ref(false);
		const nativeServerPort = ref(12306);
		const serverStatus = ref({
			isRunning: false,
			lastUpdated: Date.now()
		});
		const showMcpConfig = computed(() => {
			return nativeConnectionStatus.value === "connected" && serverStatus.value.isRunning;
		});
		const copyButtonText = ref(getMessage("copyConfigButton"));
		const mcpConfigJson = computed(() => {
			const config = { mcpServers: { "streamable-mcp-server": {
				type: "streamable-http",
				url: `http://127.0.0.1:${serverStatus.value.port || nativeServerPort.value}/mcp`
			} } };
			return JSON.stringify(config, null, 2);
		});
		const currentModel = ref(null);
		const isModelSwitching = ref(false);
		const modelSwitchProgress = ref("");
		const modelDownloadProgress = ref(0);
		const isModelDownloading = ref(false);
		const modelInitializationStatus = ref("idle");
		const modelErrorMessage = ref("");
		const modelErrorType = ref("");
		const selectedVersion = ref("quantized");
		const storageStats = ref(null);
		const isRefreshingStats = ref(false);
		const isClearingData = ref(false);
		const showClearConfirmation = ref(false);
		const clearDataProgress = ref("");
		const semanticEngineStatus = ref("idle");
		const isSemanticEngineInitializing = ref(false);
		const semanticEngineInitProgress = ref("");
		const semanticEngineLastUpdated = ref(null);
		const isManagingCache = ref(false);
		const cacheStats = ref(null);
		const availableModels = computed(() => {
			return Object.entries(PREDEFINED_MODELS).map(([key, value]) => _objectSpread2({ preset: key }, value));
		});
		const getStatusClass = () => {
			if (nativeConnectionStatus.value === "connected") {
				if (serverStatus.value.isRunning) return "bg-emerald-500";
				else return "bg-yellow-500";
			} else if (nativeConnectionStatus.value === "disconnected") return "bg-red-500";
			else return "bg-gray-500";
		};
		function openSidepanelAndClose(_x2) {
			return _openSidepanelAndClose.apply(this, arguments);
		}
		function _openSidepanelAndClose() {
			_openSidepanelAndClose = _asyncToGenerator(function* (tab) {
				try {
					var _chrome$sidePanel2;
					let tabId=null; let winId=null;
					try{const [aTab]=yield chrome.tabs.query({active:true,currentWindow:true}); if(aTab){tabId=aTab.id; winId=aTab.windowId;}}catch(e){}
					if(!winId){const current=yield chrome.windows.getCurrent(); winId=current.id;}
					if(tabId && (_chrome$sidePanel2 = chrome.sidePanel) !== null && _chrome$sidePanel2 !== void 0 && _chrome$sidePanel2.setOptions) { try{yield _chrome$sidePanel2.setOptions({ tabId, path: `sidepanel.html?tab=${tab}`, enabled:true }); yield chrome.sidePanel.open({ tabId }); window.close(); return;}catch(e){}}
					if ((_chrome$sidePanel2 = chrome.sidePanel) === null || _chrome$sidePanel2 === void 0 ? void 0 : _chrome$sidePanel2.setOptions) yield chrome.sidePanel.setOptions({
						path: `sidepanel.html?tab=${tab}`,
						enabled: true
					});
					if (chrome.sidePanel && chrome.sidePanel.open) yield chrome.sidePanel.open({ windowId: winId });
					window.close();
				} catch (e) {
					console.warn(`Failed to open sidepanel (${tab}):`, e);
				}
			});
			return _openSidepanelAndClose.apply(this, arguments);
		}
		function openWorkflowSidepanel() {
			showComingSoonToast("Workflow Management");
		}
		function openElementMarkerSidepanel() {
			openSidepanelAndClose("element-markers");
		}
		function openAgentSidepanel() {
			openSidepanelAndClose("agent-chat");
		}
		function toggleWebEditor() {
			return _toggleWebEditor.apply(this, arguments);
		}
		function _toggleWebEditor() {
			_toggleWebEditor = _asyncToGenerator(function* () {
				try {
					yield chrome.runtime.sendMessage({ type: BACKGROUND_MESSAGE_TYPES.WEB_EDITOR_TOGGLE });
				} catch (error) {
					console.warn("Failed to toggle web editor mode:", error);
				}
			});
			return _toggleWebEditor.apply(this, arguments);
		}
		function toggleElementMarker() {
			return _toggleElementMarker.apply(this, arguments);
		}
		function _toggleElementMarker() {
			_toggleElementMarker = _asyncToGenerator(function* () {
				try {
					const [tab] = yield chrome.tabs.query({
						active: true,
						currentWindow: true
					});
					if (!(tab === null || tab === void 0 ? void 0 : tab.id)) {
						console.warn("无法获取当前tab");
						return;
					}
					yield chrome.runtime.sendMessage({
						type: BACKGROUND_MESSAGE_TYPES.ELEMENT_MARKER_START,
						tabId: tab.id
					});
				} catch (error) {
					console.warn("开启元素标注失败:", error);
				}
			});
			return _toggleElementMarker.apply(this, arguments);
		}
		function openWelcomePage() {
			return _openWelcomePage.apply(this, arguments);
		}
		function _openWelcomePage() {
			_openWelcomePage = _asyncToGenerator(function* () {
				try {
					yield chrome.tabs.create({ url: chrome.runtime.getURL("welcome.html") });
				} catch (_unused5) {}
			});
			return _openWelcomePage.apply(this, arguments);
		}
		function openTroubleshooting() {
			return _openTroubleshooting.apply(this, arguments);
		}
		function _openTroubleshooting() {
			_openTroubleshooting = _asyncToGenerator(function* () {
				try {
					yield chrome.tabs.create({ url: LINKS.TROUBLESHOOTING });
				} catch (_unused6) {}
			});
			return _openTroubleshooting.apply(this, arguments);
		}
		function openTranslateSettings() {
			return _openTranslateSettings.apply(this, arguments);
		}
		function _openTranslateSettings() {
			_openTranslateSettings = _asyncToGenerator(function* () {
				try {
					yield chrome.tabs.create({ url: chrome.runtime.getURL("translate-settings.html") });
				} catch (_unusedOpenTranslateSettings) {}
			});
			return _openTranslateSettings.apply(this, arguments);
		}
		function openBuilderWindow(flowId, focusNodeId) {
			const url = new URL(chrome.runtime.getURL("builder.html"));
			if (flowId) url.searchParams.set("flowId", flowId);
			if (focusNodeId) url.searchParams.set("focus", focusNodeId);
			chrome.windows.create({
				url: url.toString(),
				type: "popup",
				width: 1280,
				height: 800
			});
		}
		const getStatusText = () => {
			if (nativeConnectionStatus.value === "connected") {
				if (serverStatus.value.isRunning) return getMessage("serviceRunningStatus", [(serverStatus.value.port || "Unknown").toString()]);
				else return getMessage("connectedServiceNotStartedStatus");
			} else if (nativeConnectionStatus.value === "disconnected") return getMessage("serviceNotConnectedStatus");
			else return getMessage("detectingStatus");
		};
		const loadCacheStats = function() {
			var _ref5 = _asyncToGenerator(function* () {
				try {
					cacheStats.value = yield getCacheStats();
				} catch (error) {
					console.error("Failed to get cache stats:", error);
					cacheStats.value = null;
				}
			});
			return function loadCacheStats() {
				return _ref5.apply(this, arguments);
			};
		}();
		const cleanupCache = function() {
			var _ref6 = _asyncToGenerator(function* () {
				if (isManagingCache.value) return;
				isManagingCache.value = true;
				try {
					yield cleanupModelCache();
					yield loadCacheStats();
				} catch (error) {
					console.error("Failed to cleanup cache:", error);
				} finally {
					isManagingCache.value = false;
				}
			});
			return function cleanupCache() {
				return _ref6.apply(this, arguments);
			};
		}();
		const clearAllCache = function() {
			var _ref7 = _asyncToGenerator(function* () {
				if (isManagingCache.value) return;
				isManagingCache.value = true;
				try {
					yield clearModelCache();
					yield loadCacheStats();
				} catch (error) {
					console.error("Failed to clear cache:", error);
				} finally {
					isManagingCache.value = false;
				}
			});
			return function clearAllCache() {
				return _ref7.apply(this, arguments);
			};
		}();
		const saveSemanticEngineState = function() {
			var _ref8 = _asyncToGenerator(function* () {
				try {
					const semanticEngineState = {
						status: semanticEngineStatus.value,
						lastUpdated: semanticEngineLastUpdated.value
					};
					yield chrome.storage.local.set({ semanticEngineState });
				} catch (error) {
					console.error("保存语义引擎状态失败:", error);
				}
			});
			return function saveSemanticEngineState() {
				return _ref8.apply(this, arguments);
			};
		}();
		const initializeSemanticEngine = function() {
			var _ref9 = _asyncToGenerator(function* () {
				if (isSemanticEngineInitializing.value) return;
				const isReinitialization = semanticEngineStatus.value === "ready";
				console.log(`🚀 User triggered semantic engine ${isReinitialization ? "reinitialization" : "initialization"}`);
				isSemanticEngineInitializing.value = true;
				semanticEngineStatus.value = "initializing";
				semanticEngineInitProgress.value = isReinitialization ? getMessage("semanticEngineInitializingStatus") : getMessage("semanticEngineInitializingStatus");
				semanticEngineLastUpdated.value = Date.now();
				yield saveSemanticEngineState();
				try {
					chrome.runtime.sendMessage({ type: BACKGROUND_MESSAGE_TYPES.INITIALIZE_SEMANTIC_ENGINE }).catch((error) => {
						console.error("❌ Error sending semantic engine initialization request:", error);
					});
					startSemanticEngineStatusPolling();
					semanticEngineInitProgress.value = isReinitialization ? getMessage("processingStatus") : getMessage("processingStatus");
				} catch (error) {
					console.error("❌ Failed to send initialization request:", error);
					semanticEngineStatus.value = "error";
					semanticEngineInitProgress.value = `Failed to send initialization request: ${(error === null || error === void 0 ? void 0 : error.message) || "Unknown error"}`;
					yield saveSemanticEngineState();
					setTimeout(() => {
						semanticEngineInitProgress.value = "";
					}, 5e3);
					isSemanticEngineInitializing.value = false;
					semanticEngineLastUpdated.value = Date.now();
					yield saveSemanticEngineState();
				}
			});
			return function initializeSemanticEngine() {
				return _ref9.apply(this, arguments);
			};
		}();
		const checkSemanticEngineStatus = function() {
			var _ref10 = _asyncToGenerator(function* () {
				try {
					const response = yield chrome.runtime.sendMessage({ type: BACKGROUND_MESSAGE_TYPES.GET_MODEL_STATUS });
					if (response && response.success && response.status) {
						const status = response.status;
						if (status.initializationStatus === "ready") {
							semanticEngineStatus.value = "ready";
							semanticEngineLastUpdated.value = Date.now();
							isSemanticEngineInitializing.value = false;
							semanticEngineInitProgress.value = getMessage("semanticEngineReadyStatus");
							yield saveSemanticEngineState();
							stopSemanticEngineStatusPolling();
							setTimeout(() => {
								semanticEngineInitProgress.value = "";
							}, 2e3);
						} else if (status.initializationStatus === "downloading" || status.initializationStatus === "initializing") {
							semanticEngineStatus.value = "initializing";
							isSemanticEngineInitializing.value = true;
							semanticEngineInitProgress.value = getMessage("semanticEngineInitializingStatus");
							semanticEngineLastUpdated.value = Date.now();
							yield saveSemanticEngineState();
						} else if (status.initializationStatus === "error") {
							semanticEngineStatus.value = "error";
							semanticEngineLastUpdated.value = Date.now();
							isSemanticEngineInitializing.value = false;
							semanticEngineInitProgress.value = getMessage("semanticEngineInitFailedStatus");
							yield saveSemanticEngineState();
							stopSemanticEngineStatusPolling();
							setTimeout(() => {
								semanticEngineInitProgress.value = "";
							}, 5e3);
						} else {
							semanticEngineStatus.value = "idle";
							isSemanticEngineInitializing.value = false;
							yield saveSemanticEngineState();
						}
					} else {
						semanticEngineStatus.value = "idle";
						isSemanticEngineInitializing.value = false;
						yield saveSemanticEngineState();
					}
				} catch (error) {
					console.error("Popup: Failed to check semantic engine status:", error);
					semanticEngineStatus.value = "idle";
					isSemanticEngineInitializing.value = false;
					yield saveSemanticEngineState();
				}
			});
			return function checkSemanticEngineStatus() {
				return _ref10.apply(this, arguments);
			};
		}();
		const retryModelInitialization = function() {
			var _ref11 = _asyncToGenerator(function* () {
				if (!currentModel.value) return;
				console.log("🔄 Retrying model initialization...");
				modelErrorMessage.value = "";
				modelErrorType.value = "";
				modelInitializationStatus.value = "downloading";
				modelDownloadProgress.value = 0;
				isModelDownloading.value = true;
				yield switchModel(currentModel.value);
			});
			return function retryModelInitialization() {
				return _ref11.apply(this, arguments);
			};
		}();
		const updatePort = function() {
			var _ref12 = _asyncToGenerator(function* (event) {
				const target = event.target;
				const newPort = Number(target.value);
				nativeServerPort.value = newPort;
				yield savePortPreference(newPort);
			});
			return function updatePort(_x3) {
				return _ref12.apply(this, arguments);
			};
		}();
		const checkNativeConnection = function() {
			var _ref13 = _asyncToGenerator(function* () {
				try {
					const response = yield chrome.runtime.sendMessage({ type: "ping_native" });
					nativeConnectionStatus.value = (response === null || response === void 0 ? void 0 : response.connected) ? "connected" : "disconnected";
				} catch (error) {
					console.error("检测 Native 连接状态失败:", error);
					nativeConnectionStatus.value = "disconnected";
				}
			});
			return function checkNativeConnection() {
				return _ref13.apply(this, arguments);
			};
		}();
		const checkServerStatus = function() {
			var _ref14 = _asyncToGenerator(function* () {
				try {
					const response = yield chrome.runtime.sendMessage({ type: BACKGROUND_MESSAGE_TYPES.GET_SERVER_STATUS });
					if ((response === null || response === void 0 ? void 0 : response.success) && response.serverStatus) serverStatus.value = response.serverStatus;
					if ((response === null || response === void 0 ? void 0 : response.connected) !== void 0) nativeConnectionStatus.value = response.connected ? "connected" : "disconnected";
				} catch (error) {
					console.error("检测服务器状态失败:", error);
				}
			});
			return function checkServerStatus() {
				return _ref14.apply(this, arguments);
			};
		}();
		const refreshServerStatus = function() {
			var _ref15 = _asyncToGenerator(function* () {
				try {
					const response = yield chrome.runtime.sendMessage({ type: BACKGROUND_MESSAGE_TYPES.REFRESH_SERVER_STATUS });
					if ((response === null || response === void 0 ? void 0 : response.success) && response.serverStatus) serverStatus.value = response.serverStatus;
					if ((response === null || response === void 0 ? void 0 : response.connected) !== void 0) nativeConnectionStatus.value = response.connected ? "connected" : "disconnected";
				} catch (error) {
					console.error("刷新服务器状态失败:", error);
				}
			});
			return function refreshServerStatus() {
				return _ref15.apply(this, arguments);
			};
		}();
		const copyMcpConfig = function() {
			var _ref16 = _asyncToGenerator(function* () {
				try {
					yield navigator.clipboard.writeText(mcpConfigJson.value);
					copyButtonText.value = "✅" + getMessage("configCopiedNotification");
					setTimeout(() => {
						copyButtonText.value = getMessage("copyConfigButton");
					}, 2e3);
				} catch (error) {
					console.error("复制配置失败:", error);
					copyButtonText.value = "❌" + getMessage("networkErrorMessage");
					setTimeout(() => {
						copyButtonText.value = getMessage("copyConfigButton");
					}, 2e3);
				}
			});
			return function copyMcpConfig() {
				return _ref16.apply(this, arguments);
			};
		}();
		const testNativeConnection = function() {
			var _ref17 = _asyncToGenerator(function* () {
				if (isConnecting.value) return;
				isConnecting.value = true;
				try {
					if (nativeConnectionStatus.value === "connected") {
						yield chrome.runtime.sendMessage({ type: "disconnect_native" });
						nativeConnectionStatus.value = "disconnected";
					} else {
						console.log(`尝试连接到端口: ${nativeServerPort.value}`);
						const response = yield chrome.runtime.sendMessage({
							type: "connectNative",
							port: nativeServerPort.value
						});
						if (response && response.success) {
							nativeConnectionStatus.value = "connected";
							console.log("连接成功:", response);
							yield savePortPreference(nativeServerPort.value);
						} else {
							nativeConnectionStatus.value = "disconnected";
							console.error("连接失败:", response);
						}
					}
				} catch (error) {
					console.error("测试连接失败:", error);
					nativeConnectionStatus.value = "disconnected";
				} finally {
					isConnecting.value = false;
				}
			});
			return function testNativeConnection() {
				return _ref17.apply(this, arguments);
			};
		}();
		const loadModelPreference = function() {
			var _ref18 = _asyncToGenerator(function* () {
				try {
					const result = yield chrome.storage.local.get([
						"selectedModel",
						"selectedVersion",
						"modelState",
						"semanticEngineState"
					]);
					if (result.selectedModel) {
						const storedModel = result.selectedModel;
						console.log("📋 Stored model from storage:", storedModel);
						if (PREDEFINED_MODELS[storedModel]) {
							currentModel.value = storedModel;
							console.log(`✅ Loaded valid model: ${currentModel.value}`);
						} else {
							console.warn(`⚠️ Stored model "${storedModel}" not found in PREDEFINED_MODELS, using default`);
							currentModel.value = "multilingual-e5-small";
							yield saveModelPreference(currentModel.value);
						}
					} else {
						console.log("⚠️ No model found in storage, using default");
						currentModel.value = "multilingual-e5-small";
						yield saveModelPreference(currentModel.value);
					}
					selectedVersion.value = "quantized";
					console.log("✅ Using quantized version (fixed)");
					yield saveVersionPreference("quantized");
					if (result.modelState) {
						const modelState = result.modelState;
						if (modelState.status === "ready") {
							modelInitializationStatus.value = "ready";
							modelDownloadProgress.value = modelState.downloadProgress || 100;
							isModelDownloading.value = false;
						} else {
							modelInitializationStatus.value = "idle";
							modelDownloadProgress.value = 0;
							isModelDownloading.value = false;
							yield saveModelState();
						}
					} else {
						modelInitializationStatus.value = "idle";
						modelDownloadProgress.value = 0;
						isModelDownloading.value = false;
					}
					if (result.semanticEngineState) {
						const semanticState = result.semanticEngineState;
						if (semanticState.status === "ready") {
							semanticEngineStatus.value = "ready";
							semanticEngineLastUpdated.value = semanticState.lastUpdated || Date.now();
						} else if (semanticState.status === "error") {
							semanticEngineStatus.value = "error";
							semanticEngineLastUpdated.value = semanticState.lastUpdated || Date.now();
						} else semanticEngineStatus.value = "idle";
					} else semanticEngineStatus.value = "idle";
				} catch (error) {
					console.error("❌ 加载模型偏好失败:", error);
				}
			});
			return function loadModelPreference() {
				return _ref18.apply(this, arguments);
			};
		}();
		const saveModelPreference = function() {
			var _ref19 = _asyncToGenerator(function* (model) {
				try {
					yield chrome.storage.local.set({ selectedModel: model });
				} catch (error) {
					console.error("保存模型偏好失败:", error);
				}
			});
			return function saveModelPreference(_x4) {
				return _ref19.apply(this, arguments);
			};
		}();
		const saveVersionPreference = function() {
			var _ref20 = _asyncToGenerator(function* (version) {
				try {
					yield chrome.storage.local.set({ selectedVersion: version });
				} catch (error) {
					console.error("保存版本偏好失败:", error);
				}
			});
			return function saveVersionPreference(_x5) {
				return _ref20.apply(this, arguments);
			};
		}();
		const savePortPreference = function() {
			var _ref21 = _asyncToGenerator(function* (port) {
				try {
					yield chrome.storage.local.set({ nativeServerPort: port });
					console.log(`端口偏好已保存: ${port}`);
				} catch (error) {
					console.error("保存端口偏好失败:", error);
				}
			});
			return function savePortPreference(_x6) {
				return _ref21.apply(this, arguments);
			};
		}();
		const loadPortPreference = function() {
			var _ref22 = _asyncToGenerator(function* () {
				try {
					const result = yield chrome.storage.local.get(["nativeServerPort"]);
					if (result.nativeServerPort) {
						nativeServerPort.value = result.nativeServerPort;
						console.log(`端口偏好已加载: ${result.nativeServerPort}`);
					}
				} catch (error) {
					console.error("加载端口偏好失败:", error);
				}
			});
			return function loadPortPreference() {
				return _ref22.apply(this, arguments);
			};
		}();
		const saveModelState = function() {
			var _ref23 = _asyncToGenerator(function* () {
				try {
					const modelState = {
						status: modelInitializationStatus.value,
						downloadProgress: modelDownloadProgress.value,
						isDownloading: isModelDownloading.value,
						lastUpdated: Date.now()
					};
					yield chrome.storage.local.set({ modelState });
				} catch (error) {
					console.error("保存模型状态失败:", error);
				}
			});
			return function saveModelState() {
				return _ref23.apply(this, arguments);
			};
		}();
		let statusMonitoringInterval = null;
		let semanticEngineStatusPollingInterval = null;
		const startModelStatusMonitoring = () => {
			if (statusMonitoringInterval) clearInterval(statusMonitoringInterval);
			statusMonitoringInterval = setInterval(_asyncToGenerator(function* () {
				try {
					const response = yield chrome.runtime.sendMessage({ type: "get_model_status" });
					if (response && response.success) {
						const status = response.status;
						modelInitializationStatus.value = status.initializationStatus || "idle";
						modelDownloadProgress.value = status.downloadProgress || 0;
						isModelDownloading.value = status.isDownloading || false;
						if (status.initializationStatus === "error") {
							modelErrorMessage.value = status.errorMessage || getMessage("modelFailedStatus");
							modelErrorType.value = status.errorType || "unknown";
						} else {
							modelErrorMessage.value = "";
							modelErrorType.value = "";
						}
						yield saveModelState();
						if (status.initializationStatus === "ready" || status.initializationStatus === "error") stopModelStatusMonitoring();
					}
				} catch (error) {
					console.error("获取模型状态失败:", error);
				}
			}), 1e3);
		};
		const stopModelStatusMonitoring = () => {
			if (statusMonitoringInterval) {
				clearInterval(statusMonitoringInterval);
				statusMonitoringInterval = null;
			}
		};
		const startSemanticEngineStatusPolling = () => {
			if (semanticEngineStatusPollingInterval) clearInterval(semanticEngineStatusPollingInterval);
			semanticEngineStatusPollingInterval = setInterval(_asyncToGenerator(function* () {
				try {
					yield checkSemanticEngineStatus();
				} catch (error) {
					console.error("Semantic engine status polling failed:", error);
				}
			}), 2e3);
		};
		const stopSemanticEngineStatusPolling = () => {
			if (semanticEngineStatusPollingInterval) {
				clearInterval(semanticEngineStatusPollingInterval);
				semanticEngineStatusPollingInterval = null;
			}
		};
		const refreshStorageStats = function() {
			var _ref24 = _asyncToGenerator(function* () {
				if (isRefreshingStats.value) return;
				isRefreshingStats.value = true;
				try {
					console.log("🔄 Refreshing storage statistics...");
					const response = yield chrome.runtime.sendMessage({ type: "get_storage_stats" });
					if (response && response.success) {
						storageStats.value = {
							indexedPages: response.stats.indexedPages || 0,
							totalDocuments: response.stats.totalDocuments || 0,
							totalTabs: response.stats.totalTabs || 0,
							indexSize: response.stats.indexSize || 0,
							isInitialized: response.stats.isInitialized || false
						};
						console.log("✅ Storage stats refreshed:", storageStats.value);
					} else {
						console.error("❌ Failed to get storage stats:", response === null || response === void 0 ? void 0 : response.error);
						storageStats.value = {
							indexedPages: 0,
							totalDocuments: 0,
							totalTabs: 0,
							indexSize: 0,
							isInitialized: false
						};
					}
				} catch (error) {
					console.error("❌ Error refreshing storage stats:", error);
					storageStats.value = {
						indexedPages: 0,
						totalDocuments: 0,
						totalTabs: 0,
						indexSize: 0,
						isInitialized: false
					};
				} finally {
					isRefreshingStats.value = false;
				}
			});
			return function refreshStorageStats() {
				return _ref24.apply(this, arguments);
			};
		}();
		const hideClearDataConfirmation = () => {
			showClearConfirmation.value = false;
		};
		const confirmClearAllData = function() {
			var _ref25 = _asyncToGenerator(function* () {
				if (isClearingData.value) return;
				isClearingData.value = true;
				clearDataProgress.value = getMessage("clearingStatus");
				try {
					console.log("🗑️ Starting to clear all data...");
					const response = yield chrome.runtime.sendMessage({ type: "clear_all_data" });
					if (response && response.success) {
						clearDataProgress.value = getMessage("dataClearedNotification");
						console.log("✅ All data cleared successfully");
						yield refreshStorageStats();
						setTimeout(() => {
							clearDataProgress.value = "";
							hideClearDataConfirmation();
						}, 2e3);
					} else throw new Error((response === null || response === void 0 ? void 0 : response.error) || "Failed to clear data");
				} catch (error) {
					console.error("❌ Failed to clear all data:", error);
					clearDataProgress.value = `Failed to clear data: ${(error === null || error === void 0 ? void 0 : error.message) || "Unknown error"}`;
					setTimeout(() => {
						clearDataProgress.value = "";
					}, 5e3);
				} finally {
					isClearingData.value = false;
				}
			});
			return function confirmClearAllData() {
				return _ref25.apply(this, arguments);
			};
		}();
		const switchModel = function() {
			var _ref26 = _asyncToGenerator(function* (newModel) {
				console.log(`🔄 switchModel called with newModel: ${newModel}`);
				if (isModelSwitching.value) {
					console.log("⏸️ Model switch already in progress, skipping");
					return;
				}
				const isSameModel = newModel === currentModel.value;
				const currentModelInfo = currentModel.value ? getModelInfo(currentModel.value) : getModelInfo("multilingual-e5-small");
				const newModelInfo = getModelInfo(newModel);
				const isDifferentDimension = currentModelInfo.dimension !== newModelInfo.dimension;
				console.log(`📊 Switch analysis:`);
				console.log(`   - Same model: ${isSameModel} (${currentModel.value} -> ${newModel})`);
				console.log(`   - Current dimension: ${currentModelInfo.dimension}, New dimension: ${newModelInfo.dimension}`);
				console.log(`   - Different dimension: ${isDifferentDimension}`);
				if (isSameModel && !isDifferentDimension) {
					console.log("✅ Same model and dimension - no need to switch");
					return;
				}
				const switchReasons = [];
				if (!isSameModel) switchReasons.push("different model");
				if (isDifferentDimension) switchReasons.push("different dimension");
				console.log(`🚀 Switching model due to: ${switchReasons.join(", ")}`);
				console.log(`📋 Model: ${currentModel.value} (${currentModelInfo.dimension}D) -> ${newModel} (${newModelInfo.dimension}D)`);
				isModelSwitching.value = true;
				modelSwitchProgress.value = getMessage("switchingModelStatus");
				modelInitializationStatus.value = "downloading";
				modelDownloadProgress.value = 0;
				isModelDownloading.value = true;
				try {
					yield saveModelState();
					modelSwitchProgress.value = getMessage("semanticEngineInitializingStatus");
					startModelStatusMonitoring();
					let switchTimeoutId = null;
					const response = yield Promise.race([chrome.runtime.sendMessage({
						type: "switch_semantic_model",
						modelPreset: newModel,
						modelVersion: "quantized",
						modelDimension: newModelInfo.dimension,
						previousDimension: currentModelInfo.dimension
					}), new Promise((_resolve, reject) => {
						switchTimeoutId = setTimeout(() => reject(new Error("Model switch timed out after 90s. The model may not be available offline.")), 9e4);
					})]).finally(() => {
						if (switchTimeoutId !== null) clearTimeout(switchTimeoutId);
					});
					if (response && response.success) {
						currentModel.value = newModel;
						yield saveModelPreference(newModel);
						yield saveVersionPreference("quantized");
						modelSwitchProgress.value = getMessage("successNotification");
						console.log("模型切换成功:", newModel, "version: quantized", "dimension:", newModelInfo.dimension);
						modelInitializationStatus.value = "ready";
						isModelDownloading.value = false;
						yield saveModelState();
						setTimeout(() => {
							modelSwitchProgress.value = "";
						}, 2e3);
					} else throw new Error((response === null || response === void 0 ? void 0 : response.error) || "Model switch failed");
				} catch (error) {
					console.error("模型切换失败:", error);
					modelSwitchProgress.value = `Model switch failed: ${(error === null || error === void 0 ? void 0 : error.message) || "Unknown error"}`;
					modelInitializationStatus.value = "error";
					isModelDownloading.value = false;
					const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || "未知错误";
					if (errorMessage.includes("network") || errorMessage.includes("fetch") || errorMessage.includes("timeout")) {
						modelErrorType.value = "network";
						modelErrorMessage.value = getMessage("networkErrorMessage");
					} else if (errorMessage.includes("corrupt") || errorMessage.includes("invalid") || errorMessage.includes("format")) {
						modelErrorType.value = "file";
						modelErrorMessage.value = getMessage("modelCorruptedErrorMessage");
					} else {
						modelErrorType.value = "unknown";
						modelErrorMessage.value = errorMessage;
					}
					yield saveModelState();
					setTimeout(() => {
						modelSwitchProgress.value = "";
					}, 8e3);
				} finally {
					isModelSwitching.value = false;
				}
			});
			return function switchModel(_x7) {
				return _ref26.apply(this, arguments);
			};
		}();
		const setupServerStatusListener = () => {
			const onMessage = (message) => {
				if (message.type === BACKGROUND_MESSAGE_TYPES.SERVER_STATUS_CHANGED && message.payload) {
					serverStatus.value = message.payload;
					console.log("Server status updated:", message.payload);
				}
				if (message.type === BACKGROUND_MESSAGE_TYPES.RR_FLOWS_CHANGED) loadFlows();
			};
			chrome.runtime.onMessage.addListener(onMessage);
			window.__rr_popup_onMessage = onMessage;
		};
		onMounted(_asyncToGenerator(function* () {
			yield initTheme();
			yield loadPortPreference();
			yield loadModelPreference();
			yield checkNativeConnection();
			yield checkServerStatus();
			yield refreshStorageStats();
			yield loadCacheStats();
			yield loadFlows();
			try {
				const [tab] = yield chrome.tabs.query({
					active: true,
					currentWindow: true
				});
				currentTabUrl.value = (tab === null || tab === void 0 ? void 0 : tab.url) || "";
			} catch (_unused7) {}
			yield checkSemanticEngineStatus();
			setupServerStatusListener();
			try {
				const onChanged = (changes, area) => {
					try {
						if (area !== "local") return;
						if (Object.prototype.hasOwnProperty.call(changes || {}, "rr_flows")) loadFlows();
					} catch (_unused8) {}
				};
				chrome.storage.onChanged.addListener(onChanged);
				window.__rr_popup_onChanged = onChanged;
			} catch (_unused9) {}
		}));
		onUnmounted(() => {
			stopModelStatusMonitoring();
			stopSemanticEngineStatusPolling();
			try {
				var _chrome;
				const msgFn = window.__rr_popup_onMessage;
				if (msgFn && ((_chrome = chrome) === null || _chrome === void 0 || (_chrome = _chrome.runtime) === null || _chrome === void 0 || (_chrome = _chrome.onMessage) === null || _chrome === void 0 ? void 0 : _chrome.removeListener)) chrome.runtime.onMessage.removeListener(msgFn);
			} catch (_unused10) {}
			try {
				var _chrome2;
				const fn = window.__rr_popup_onChanged;
				if (fn && ((_chrome2 = chrome) === null || _chrome2 === void 0 || (_chrome2 = _chrome2.storage) === null || _chrome2 === void 0 || (_chrome2 = _chrome2.onChanged) === null || _chrome2 === void 0 ? void 0 : _chrome2.removeListener)) chrome.storage.onChanged.removeListener(fn);
			} catch (_unused11) {}
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: "popup-container agent-theme",
				"data-agent-theme": unref(agentTheme)
			}, [
				withDirectives(createBaseVNode("div", _hoisted_2, [
					createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [createBaseVNode("h1", _hoisted_5, toDisplayString(unref(productName)), 1)])]),
					createBaseVNode("div", _hoisted_6, [
						!unref(scalemaxOnly) ? (openBlock(), createElementBlock("div", _hoisted_7, [createBaseVNode("h2", _hoisted_8, toDisplayString(unref(getMessage)("nativeServerConfigLabel")), 1), createBaseVNode("div", _hoisted_9, [
							createBaseVNode("div", _hoisted_10, [
								createBaseVNode("div", _hoisted_11, [createBaseVNode("p", _hoisted_12, toDisplayString(unref(getMessage)("runningStatusLabel")), 1), createBaseVNode("button", {
									class: "refresh-status-button",
									onClick: refreshServerStatus,
									title: unref(getMessage)("refreshStatusButton")
								}, [createVNode(unref(RefreshIcon_default), { className: "icon-small" })], 8, _hoisted_13)]),
								createBaseVNode("div", _hoisted_14, [createBaseVNode("span", { class: normalizeClass(["status-dot", getStatusClass()]) }, null, 2), createBaseVNode("span", _hoisted_15, toDisplayString(getStatusText()), 1)]),
								serverStatus.value.lastUpdated ? (openBlock(), createElementBlock("div", _hoisted_16, toDisplayString(unref(getMessage)("lastUpdatedLabel")) + " " + toDisplayString(new Date(serverStatus.value.lastUpdated).toLocaleTimeString()), 1)) : createCommentVNode("", true)
							]),
							showMcpConfig.value ? (openBlock(), createElementBlock("div", _hoisted_17, [createBaseVNode("div", _hoisted_18, [createBaseVNode("p", _hoisted_19, toDisplayString(unref(getMessage)("mcpServerConfigLabel")), 1), createBaseVNode("button", {
								class: "copy-config-button",
								onClick: copyMcpConfig
							}, toDisplayString(copyButtonText.value), 1)]), createBaseVNode("div", _hoisted_20, [createBaseVNode("pre", _hoisted_21, toDisplayString(mcpConfigJson.value), 1)])])) : createCommentVNode("", true),
							createBaseVNode("div", _hoisted_22, [createBaseVNode("label", _hoisted_23, toDisplayString(unref(getMessage)("connectionPortLabel")), 1), createBaseVNode("input", {
								type: "text",
								id: "port",
								value: nativeServerPort.value,
								onInput: updatePort,
								class: "port-input"
							}, null, 40, _hoisted_24)]),
							createBaseVNode("button", {
								class: "connect-button",
								disabled: isConnecting.value,
								onClick: testNativeConnection
							}, [createVNode(unref(BoltIcon_default)), createBaseVNode("span", null, toDisplayString(isConnecting.value ? unref(getMessage)("connectingStatus") : nativeConnectionStatus.value === "connected" ? unref(getMessage)("disconnectButton") : unref(getMessage)("connectButton")), 1)], 8, _hoisted_25)
						])])) : createCommentVNode("", true),
						!unref(scalemaxOnly) ? (openBlock(), createElementBlock("div", _hoisted_26, [_cache[12] || (_cache[12] = createBaseVNode("h2", { class: "section-title" }, "Quick Tools", -1)), createBaseVNode("div", _hoisted_27, [
							createBaseVNode("button", {
								class: "rr-icon-btn rr-icon-btn-record rr-icon-btn-coming-soon has-tooltip",
								onClick: startRecording,
								"data-tooltip": "Recording — in development"
							}, [createVNode(unref(RecordIcon_default), { recording: false })]),
							createBaseVNode("button", {
								class: "rr-icon-btn rr-icon-btn-stop rr-icon-btn-coming-soon has-tooltip",
								onClick: stopRecording,
								"data-tooltip": "Recording — in development"
							}, [createVNode(unref(StopIcon_default))]),
							createBaseVNode("button", {
								class: "rr-icon-btn rr-icon-btn-edit has-tooltip",
								onClick: toggleWebEditor,
								"data-tooltip": "Enable page edit mode"
							}, [createVNode(unref(EditIcon_default))]),
							createBaseVNode("button", {
								class: "rr-icon-btn rr-icon-btn-marker has-tooltip",
								onClick: toggleElementMarker,
								"data-tooltip": "Enable element marking"
							}, [createVNode(unref(MarkerIcon_default))])
						])])) : createCommentVNode("", true),
						createBaseVNode("div", _hoisted_28, [_cache[22] || (_cache[22] = createBaseVNode("h2", { class: "section-title" }, "Management", -1)), createBaseVNode("div", _hoisted_29, [
							createBaseVNode("button", {
								class: "entry-item",
								onClick: openBrowserAgentSidepanel
							}, [..._cache[16] || (_cache[16] = [createStaticVNode("<div class=\"entry-icon agent\" data-v-db1692c2><svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" data-v-db1692c2><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z\" data-v-db1692c2></path></svg></div><div class=\"entry-content\" data-v-db1692c2><span class=\"entry-title\" data-v-db1692c2>Agent Chat</span><span class=\"entry-desc\" data-v-db1692c2>Opens the roomy Browser Agent in the side panel</span></div><svg class=\"entry-arrow\" viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" data-v-db1692c2><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 5l7 7-7 7\" data-v-db1692c2></path></svg>", 3)])]),
							createBaseVNode("button", {
								class: "entry-item",
								onClick: _cache[0] || (_cache[0] = ($event) => currentView.value = "ai-provider")
							}, [..._cache[17] || (_cache[17] = [createStaticVNode("<div class=\"entry-icon agent\" data-v-db1692c2><svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" data-v-db1692c2><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M13 10V3L4 14h7v7l9-11h-7z\" data-v-db1692c2></path></svg></div><div class=\"entry-content\" data-v-db1692c2><span class=\"entry-title\" data-v-db1692c2>AI Provider</span><span class=\"entry-desc\" data-v-db1692c2>OpenAI-compatible key &amp; model for in-tab agents</span></div><svg class=\"entry-arrow\" viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" data-v-db1692c2><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 5l7 7-7 7\" data-v-db1692c2></path></svg>", 3)])]),
							createBaseVNode("button", {
								class: "entry-item",
								onClick: _cache[1] || (_cache[1] = ($event) => currentView.value = "agents")
							}, [..._cache[18] || (_cache[18] = [createStaticVNode("<div class=\"entry-icon agent\" data-v-db1692c2><svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" data-v-db1692c2><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-8.13a4 4 0 110 8 4 4 0 010-8zm6 3a4 4 0 100-8 4 4 0 000 8z\" data-v-db1692c2></path></svg></div><div class=\"entry-content\" data-v-db1692c2><span class=\"entry-title\" data-v-db1692c2>Agents</span><span class=\"entry-desc\" data-v-db1692c2>Live dashboard of dispatched agent tabs</span></div><svg class=\"entry-arrow\" viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" data-v-db1692c2><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 5l7 7-7 7\" data-v-db1692c2></path></svg>", 3)])]),
							createBaseVNode("button", {
								class: "entry-item",
								onClick: _cache[2] || (_cache[2] = ($event) => currentView.value = "scheduler")
							}, [..._cache[19] || (_cache[19] = [createStaticVNode("<div class=\"entry-icon workflow\" data-v-db1692c2><svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" data-v-db1692c2><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z\" data-v-db1692c2></path></svg></div><div class=\"entry-content\" data-v-db1692c2><span class=\"entry-title\" data-v-db1692c2>Scheduler</span><span class=\"entry-desc\" data-v-db1692c2>Run agent tasks on a timer (browser only)</span></div><svg class=\"entry-arrow\" viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" data-v-db1692c2><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 5l7 7-7 7\" data-v-db1692c2></path></svg>", 3)])]),
							!unref(scalemaxOnly) ? (openBlock(), createElementBlock("button", {
								key: 0,
								class: "entry-item",
								onClick: _cache[3] || (_cache[3] = ($event) => currentView.value = "vault")
							}, [..._cache[20] || (_cache[20] = [createStaticVNode("<div class=\"entry-icon marker\" data-v-db1692c2><svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" data-v-db1692c2><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z\" data-v-db1692c2></path></svg></div><div class=\"entry-content\" data-v-db1692c2><span class=\"entry-title\" data-v-db1692c2>Vault</span><span class=\"entry-desc\" data-v-db1692c2>Encrypted store for site logins</span></div><svg class=\"entry-arrow\" viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" data-v-db1692c2><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 5l7 7-7 7\" data-v-db1692c2></path></svg>", 3)])])) : createCommentVNode("", true),
							!unref(scalemaxOnly) ? (openBlock(), createElementBlock("button", {
								key: 1,
								class: "entry-item",
								onClick: _cache[4] || (_cache[4] = ($event) => currentView.value = "local-model")
							}, [..._cache[21] || (_cache[21] = [createStaticVNode("<div class=\"entry-icon model\" data-v-db1692c2><svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" data-v-db1692c2><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z\" data-v-db1692c2></path></svg></div><div class=\"entry-content\" data-v-db1692c2><span class=\"entry-title\" data-v-db1692c2>Local Models</span><span class=\"entry-desc\" data-v-db1692c2>Semantic engine &amp; models</span></div><svg class=\"entry-arrow\" viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" data-v-db1692c2><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 5l7 7-7 7\" data-v-db1692c2></path></svg>", 3)])])) : createCommentVNode("", true)
						])])
					]),
					createBaseVNode("div", { class: "footer" }, [createBaseVNode("div", { class: "footer-links" }, [createBaseVNode("button", {
						class: "footer-link",
						onClick: openWelcomePage,
						title: "View installation guide"
					}, [..._cache[23] || (_cache[23] = [createBaseVNode("svg", {
						class: "w-4 h-4",
						fill: "none",
						stroke: "currentColor",
						viewBox: "0 0 24 24"
					}, [createBaseVNode("path", {
						"stroke-linecap": "round",
						"stroke-linejoin": "round",
						"stroke-width": "2",
						d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					})], -1), createTextVNode(" Guide ", -1)])]), createBaseVNode("button", {
						class: "footer-link",
						onClick: openTroubleshooting,
						title: "Troubleshooting"
					}, [..._cache[24] || (_cache[24] = [createBaseVNode("svg", {
						class: "w-4 h-4",
						fill: "none",
						stroke: "currentColor",
						viewBox: "0 0 24 24"
					}, [createBaseVNode("path", {
						"stroke-linecap": "round",
						"stroke-linejoin": "round",
						"stroke-width": "2",
						d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
					})], -1), createTextVNode(" Docs ", -1)])]), createBaseVNode("button", {
						class: "footer-link",
						onClick: openTranslateSettings,
						title: "Translate settings"
					}, [..._cache[27] || (_cache[27] = [createBaseVNode("svg", {
						class: "w-4 h-4",
						fill: "none",
						stroke: "currentColor",
						viewBox: "0 0 24 24"
					}, [createBaseVNode("path", {
						"stroke-linecap": "round",
						"stroke-linejoin": "round",
						"stroke-width": "2",
						d: "M3 5h12M9 3v2m1.5 2C10 12 6 15 3 17m6-5c1.5 3 3 4 6 6M17 20l3.5-8L24 20m-5.5-2h5"
					})], -1), createTextVNode(" Translate ", -1)])])]), _cache[25] || (_cache[25] = createBaseVNode("p", { class: "footer-text" }, "chrome mcp server for ai", -1))])
				], 512), [[vShow, currentView.value === "home"]]),
				withDirectives(createVNode(AiProviderPage_default, { onBack: _cache[5] || (_cache[5] = ($event) => currentView.value = "home") }, null, 512), [[vShow, currentView.value === "ai-provider"]]),
				withDirectives(createVNode(AgentChatPage_default, { onBack: _cache[6] || (_cache[6] = ($event) => currentView.value = "home") }, null, 512), [[vShow, currentView.value === "agent-chat"]]),
				withDirectives(createVNode(AgentDashboard_default, { onBack: _cache[7] || (_cache[7] = ($event) => currentView.value = "home") }, null, 512), [[vShow, currentView.value === "agents"]]),
				withDirectives(createVNode(SchedulerPage_default, { onBack: _cache[8] || (_cache[8] = ($event) => currentView.value = "home") }, null, 512), [[vShow, currentView.value === "scheduler"]]),
				withDirectives(createVNode(VaultPage_default, { onBack: _cache[9] || (_cache[9] = ($event) => currentView.value = "home") }, null, 512), [[vShow, currentView.value === "vault"]]),
				withDirectives(createVNode(LocalModelPage_default, {
					"semantic-engine-status": semanticEngineStatus.value,
					"is-semantic-engine-initializing": isSemanticEngineInitializing.value,
					"semantic-engine-init-progress": semanticEngineInitProgress.value,
					"semantic-engine-last-updated": semanticEngineLastUpdated.value,
					"available-models": availableModels.value,
					"current-model": currentModel.value,
					"is-model-switching": isModelSwitching.value,
					"is-model-downloading": isModelDownloading.value,
					"model-download-progress": modelDownloadProgress.value,
					"model-initialization-status": modelInitializationStatus.value,
					"model-error-message": modelErrorMessage.value,
					"model-error-type": modelErrorType.value,
					"storage-stats": storageStats.value,
					"is-clearing-data": isClearingData.value,
					"clear-data-progress": clearDataProgress.value,
					"cache-stats": cacheStats.value,
					"is-managing-cache": isManagingCache.value,
					onBack: _cache[10] || (_cache[10] = ($event) => currentView.value = "home"),
					onInitializeSemanticEngine: initializeSemanticEngine,
					onSwitchModel: switchModel,
					onRetryModelInitialization: retryModelInitialization,
					onShowClearConfirmation: _cache[11] || (_cache[11] = ($event) => showClearConfirmation.value = true),
					onCleanupCache: cleanupCache,
					onClearAllCache: clearAllCache
				}, null, 8, [
					"semantic-engine-status",
					"is-semantic-engine-initializing",
					"semantic-engine-init-progress",
					"semantic-engine-last-updated",
					"available-models",
					"current-model",
					"is-model-switching",
					"is-model-downloading",
					"model-download-progress",
					"model-initialization-status",
					"model-error-message",
					"model-error-type",
					"storage-stats",
					"is-clearing-data",
					"clear-data-progress",
					"cache-stats",
					"is-managing-cache"
				]), [[vShow, currentView.value === "local-model"]]),
				createVNode(ConfirmDialog_default, {
					visible: showClearConfirmation.value,
					title: unref(getMessage)("confirmClearDataTitle"),
					message: unref(getMessage)("clearDataWarningMessage"),
					items: [
						unref(getMessage)("clearDataList1"),
						unref(getMessage)("clearDataList2"),
						unref(getMessage)("clearDataList3")
					],
					warning: unref(getMessage)("clearDataIrreversibleWarning"),
					icon: "⚠️",
					"confirm-text": unref(getMessage)("confirmClearButton"),
					"cancel-text": unref(getMessage)("cancelButton"),
					"confirming-text": unref(getMessage)("clearingStatus"),
					"is-confirming": isClearingData.value,
					onConfirm: confirmClearAllData,
					onCancel: hideClearDataConfirmation
				}, null, 8, [
					"visible",
					"title",
					"message",
					"items",
					"warning",
					"confirm-text",
					"cancel-text",
					"confirming-text",
					"is-confirming"
				]),
				createVNode(Transition, { name: "toast" }, {
					default: withCtx(() => [comingSoonToast.value.show ? (openBlock(), createElementBlock("div", _hoisted_31, [_cache[26] || (_cache[26] = createBaseVNode("svg", {
						class: "toast-icon",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2"
					}, [createBaseVNode("circle", {
						cx: "12",
						cy: "12",
						r: "10"
					}), createBaseVNode("path", {
						d: "M12 6v6l4 2",
						"stroke-linecap": "round",
						"stroke-linejoin": "round"
					})], -1)), createBaseVNode("span", null, toDisplayString(comingSoonToast.value.feature) + " — coming soon", 1)])) : createCommentVNode("", true)]),
					_: 1
				})
			], 8, _hoisted_1);
		};
	}
}), [["__scopeId", "data-v-db1692c2"]]);
//#endregion
//#region entrypoints/popup/main.ts
preloadAgentTheme().then(() => {
	chrome.runtime.sendMessage({ type: NativeMessageType.ENSURE_NATIVE }).catch(() => {});
	createApp(App_default).mount("#app");
});
//#endregion
