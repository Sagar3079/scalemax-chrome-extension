//#region ../../packages/shared/dist/index.mjs
var NativeMessageType = /* @__PURE__ */ ((NativeMessageType2) => {
	NativeMessageType2["START"] = "start";
	NativeMessageType2["STARTED"] = "started";
	NativeMessageType2["STOP"] = "stop";
	NativeMessageType2["STOPPED"] = "stopped";
	NativeMessageType2["PING"] = "ping";
	NativeMessageType2["PONG"] = "pong";
	NativeMessageType2["ERROR"] = "error";
	NativeMessageType2["PROCESS_DATA"] = "process_data";
	NativeMessageType2["PROCESS_DATA_RESPONSE"] = "process_data_response";
	NativeMessageType2["CALL_TOOL"] = "call_tool";
	NativeMessageType2["CALL_TOOL_RESPONSE"] = "call_tool_response";
	NativeMessageType2["SERVER_STARTED"] = "server_started";
	NativeMessageType2["SERVER_STOPPED"] = "server_stopped";
	NativeMessageType2["ERROR_FROM_NATIVE_HOST"] = "error_from_native_host";
	NativeMessageType2["CONNECT_NATIVE"] = "connectNative";
	NativeMessageType2["ENSURE_NATIVE"] = "ensure_native";
	NativeMessageType2["PING_NATIVE"] = "ping_native";
	NativeMessageType2["DISCONNECT_NATIVE"] = "disconnect_native";
	return NativeMessageType2;
})(NativeMessageType || {});
var TOOL_NAMES = {
	BROWSER: {
		GET_WINDOWS_AND_TABS: "get_windows_and_tabs",
		SEARCH_TABS_CONTENT: "search_tabs_content",
		NAVIGATE: "chrome_navigate",
		SCREENSHOT: "chrome_screenshot",
		CLOSE_TABS: "chrome_close_tabs",
		SWITCH_TAB: "chrome_switch_tab",
		WEB_FETCHER: "chrome_get_web_content",
		CLICK: "chrome_click_element",
		FILL: "chrome_fill_or_select",
		REQUEST_ELEMENT_SELECTION: "chrome_request_element_selection",
		GET_INTERACTIVE_ELEMENTS: "chrome_get_interactive_elements",
		NETWORK_CAPTURE: "chrome_network_capture",
		NETWORK_CAPTURE_START: "chrome_network_capture_start",
		NETWORK_CAPTURE_STOP: "chrome_network_capture_stop",
		NETWORK_REQUEST: "chrome_network_request",
		NETWORK_DEBUGGER_START: "chrome_network_debugger_start",
		NETWORK_DEBUGGER_STOP: "chrome_network_debugger_stop",
		KEYBOARD: "chrome_keyboard",
		HISTORY: "chrome_history",
		BOOKMARK_SEARCH: "chrome_bookmark_search",
		BOOKMARK_ADD: "chrome_bookmark_add",
		BOOKMARK_DELETE: "chrome_bookmark_delete",
		INJECT_SCRIPT: "chrome_inject_script",
		SEND_COMMAND_TO_INJECT_SCRIPT: "chrome_send_command_to_inject_script",
		JAVASCRIPT: "chrome_javascript",
		CONSOLE: "chrome_console",
		FILE_UPLOAD: "chrome_upload_file",
		READ_PAGE: "chrome_read_page",
		COMPUTER: "chrome_computer",
		HANDLE_DIALOG: "chrome_handle_dialog",
		HANDLE_DOWNLOAD: "chrome_handle_download",
		USERSCRIPT: "chrome_userscript",
		PERFORMANCE_START_TRACE: "performance_start_trace",
		PERFORMANCE_STOP_TRACE: "performance_stop_trace",
		PERFORMANCE_ANALYZE_INSIGHT: "performance_analyze_insight",
		GIF_RECORDER: "chrome_gif_recorder",
		TAB_GROUP: "chrome_tab_group",
		GOOGLE_SEARCH: "chrome_google_search",
		AGENT_DISPATCH: "chrome_agent_dispatch"
	},
	RECORD_REPLAY: {
		FLOW_RUN: "record_replay_flow_run",
		LIST_PUBLISHED: "record_replay_list_published"
	}
};
TOOL_NAMES.BROWSER.GET_WINDOWS_AND_TABS, TOOL_NAMES.BROWSER.PERFORMANCE_START_TRACE, TOOL_NAMES.BROWSER.PERFORMANCE_STOP_TRACE, TOOL_NAMES.BROWSER.PERFORMANCE_ANALYZE_INSIGHT, TOOL_NAMES.BROWSER.READ_PAGE, TOOL_NAMES.BROWSER.COMPUTER, TOOL_NAMES.BROWSER.NAVIGATE, TOOL_NAMES.BROWSER.SCREENSHOT, TOOL_NAMES.BROWSER.CLOSE_TABS, TOOL_NAMES.BROWSER.SWITCH_TAB, TOOL_NAMES.BROWSER.WEB_FETCHER, TOOL_NAMES.BROWSER.NETWORK_REQUEST, TOOL_NAMES.BROWSER.NETWORK_CAPTURE, TOOL_NAMES.BROWSER.HANDLE_DOWNLOAD, TOOL_NAMES.BROWSER.HISTORY, TOOL_NAMES.BROWSER.BOOKMARK_SEARCH, TOOL_NAMES.BROWSER.BOOKMARK_ADD, TOOL_NAMES.BROWSER.BOOKMARK_DELETE, TOOL_NAMES.BROWSER.JAVASCRIPT, TOOL_NAMES.BROWSER.CLICK, TOOL_NAMES.BROWSER.FILL, TOOL_NAMES.BROWSER.REQUEST_ELEMENT_SELECTION, TOOL_NAMES.BROWSER.KEYBOARD, TOOL_NAMES.BROWSER.CONSOLE, TOOL_NAMES.BROWSER.FILE_UPLOAD, TOOL_NAMES.BROWSER.HANDLE_DIALOG, TOOL_NAMES.BROWSER.GIF_RECORDER, TOOL_NAMES.BROWSER.TAB_GROUP, TOOL_NAMES.BROWSER.GOOGLE_SEARCH, TOOL_NAMES.BROWSER.AGENT_DISPATCH;
var EDGE_LABELS = {
	DEFAULT: "default",
	TRUE: "true",
	FALSE: "false",
	ON_ERROR: "onError"
};
var RR_STEP_TYPES = {
	CLICK: "click",
	DBLCLICK: "dblclick",
	FILL: "fill",
	DRAG: "drag",
	KEY: "key",
	WAIT: "wait",
	ASSERT: "assert",
	IF: "if",
	FOREACH: "foreach",
	WHILE: "while",
	NAVIGATE: "navigate",
	SCRIPT: "script",
	HTTP: "http",
	EXTRACT: "extract",
	SCREENSHOT: "screenshot",
	SCROLL: "scroll",
	TRIGGER_EVENT: "triggerEvent",
	SET_ATTRIBUTE: "setAttribute",
	LOOP_ELEMENTS: "loopElements",
	SWITCH_FRAME: "switchFrame",
	OPEN_TAB: "openTab",
	SWITCH_TAB: "switchTab",
	CLOSE_TAB: "closeTab",
	EXECUTE_FLOW: "executeFlow",
	HANDLE_DOWNLOAD: "handleDownload",
	DELAY: "delay"
};
function ensureTarget(t) {
	return t && typeof t === "object" ? t : { candidates: [] };
}
function topoOrder(nodes, edges) {
	const id2n = new Map(nodes.map((n) => [n.id, n]));
	const indeg = new Map(nodes.map((n) => [n.id, 0]));
	for (const e of edges) indeg.set(e.to, (indeg.get(e.to) || 0) + 1);
	const nexts = new Map(nodes.map((n) => [n.id, []]));
	for (const e of edges) nexts.get(e.from).push(e.to);
	const q = nodes.filter((n) => (indeg.get(n.id) || 0) === 0).map((n) => n.id);
	const out = [];
	while (q.length) {
		const id = q.shift();
		const n = id2n.get(id);
		if (!n) continue;
		out.push(n);
		for (const v of nexts.get(id)) {
			indeg.set(v, (indeg.get(v) || 0) - 1);
			if ((indeg.get(v) || 0) === 0) q.push(v);
		}
	}
	return out.length === nodes.length ? out : nodes.slice();
}
function mapStepToNodeConfig(step) {
	if (!step || typeof step !== "object") return {};
	const src = step;
	const out = {};
	for (const [k, v] of Object.entries(src)) {
		if (k === "id" || k === "type") continue;
		out[k] = v;
	}
	const target = out["target"];
	if (target) out["target"] = ensureTarget(target);
	const start = out["start"];
	if (start) out["start"] = ensureTarget(start);
	const end = out["end"];
	if (end) out["end"] = ensureTarget(end);
	return out;
}
function stepsToNodes(steps) {
	const arr = [];
	steps.forEach((step, i) => {
		const obj = step && typeof step === "object" ? step : {};
		const idValue = obj["id"];
		const typeValue = obj["type"];
		const id = typeof idValue === "string" && idValue ? idValue : `n_${i}`;
		const type = typeof typeValue === "string" && typeValue ? typeValue : RR_STEP_TYPES.SCRIPT;
		arr.push({
			id,
			type,
			config: mapStepToNodeConfig(step)
		});
	});
	return arr;
}
var STEP_TYPES = {
	CLICK: "click",
	DBLCLICK: "dblclick",
	FILL: "fill",
	TRIGGER_EVENT: "triggerEvent",
	SET_ATTRIBUTE: "setAttribute",
	SCREENSHOT: "screenshot",
	SWITCH_FRAME: "switchFrame",
	LOOP_ELEMENTS: "loopElements",
	KEY: "key",
	SCROLL: "scroll",
	DRAG: "drag",
	WAIT: "wait",
	ASSERT: "assert",
	SCRIPT: "script",
	IF: "if",
	FOREACH: "foreach",
	WHILE: "while",
	NAVIGATE: "navigate",
	HTTP: "http",
	EXTRACT: "extract",
	OPEN_TAB: "openTab",
	SWITCH_TAB: "switchTab",
	CLOSE_TAB: "closeTab",
	HANDLE_DOWNLOAD: "handleDownload",
	EXECUTE_FLOW: "executeFlow",
	TRIGGER: "trigger",
	DELAY: "delay"
};
var REG = /* @__PURE__ */ new Map();
function registerNodeSpec(spec) {
	REG.set(spec.type, spec);
}
function getNodeSpec(type) {
	return REG.get(type);
}
function listNodeSpecs() {
	return Array.from(REG.values());
}
function registerBuiltinSpecs() {
	registerNodeSpec({
		type: STEP_TYPES.NAVIGATE,
		version: 1,
		display: {
			label: "Navigate",
			iconClass: "icon-navigate",
			category: "Actions"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [{
			key: "url",
			label: "URL",
			type: "string",
			required: true,
			placeholder: "https://example.com",
			help: "Destination URL; supports {var} templates",
			default: ""
		}],
		defaults: { url: "" },
		validate: (cfg) => {
			const errs = [];
			if (!cfg || !cfg.url || String(cfg.url).trim() === "") errs.push("URL is required");
			return errs;
		}
	});
	registerNodeSpec({
		type: STEP_TYPES.CLICK,
		version: 1,
		display: {
			label: "Click",
			iconClass: "icon-click",
			category: "Actions"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [
			{
				key: "target",
				label: "Target",
				type: "json",
				widget: "targetlocator",
				help: "Pick or enter an element selector"
			},
			{
				key: "before",
				label: "Before",
				type: "object",
				fields: [{
					key: "scrollIntoView",
					label: "Scroll into view",
					type: "boolean",
					default: true
				}, {
					key: "waitForSelector",
					label: "Wait for selector",
					type: "boolean",
					default: true
				}]
			},
			{
				key: "after",
				label: "After",
				type: "object",
				fields: [{
					key: "waitForNavigation",
					label: "Wait for navigation",
					type: "boolean",
					default: false
				}, {
					key: "waitForNetworkIdle",
					label: "Wait for network idle",
					type: "boolean",
					default: false
				}]
			}
		],
		defaults: {
			before: {
				scrollIntoView: true,
				waitForSelector: true
			},
			after: {}
		}
	});
	registerNodeSpec({
		type: STEP_TYPES.DBLCLICK,
		version: 1,
		display: {
			label: "Double click",
			iconClass: "icon-click",
			category: "Actions"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [
			{
				key: "target",
				label: "Target",
				type: "json",
				widget: "targetlocator"
			},
			{
				key: "before",
				label: "Before",
				type: "object",
				fields: [{
					key: "scrollIntoView",
					label: "Scroll into view",
					type: "boolean",
					default: true
				}, {
					key: "waitForSelector",
					label: "Wait for selector",
					type: "boolean",
					default: true
				}]
			},
			{
				key: "after",
				label: "After",
				type: "object",
				fields: [{
					key: "waitForNavigation",
					label: "Wait for navigation",
					type: "boolean",
					default: false
				}, {
					key: "waitForNetworkIdle",
					label: "Wait for network idle",
					type: "boolean",
					default: false
				}]
			}
		],
		defaults: {
			before: {
				scrollIntoView: true,
				waitForSelector: true
			},
			after: {}
		}
	});
	registerNodeSpec({
		type: STEP_TYPES.FILL,
		version: 1,
		display: {
			label: "Fill",
			iconClass: "icon-fill",
			category: "Actions"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [{
			key: "target",
			label: "Target",
			type: "json",
			widget: "targetlocator"
		}, {
			key: "value",
			label: "Value",
			type: "string",
			required: true,
			help: "Supports {var} templates"
		}],
		defaults: { value: "" }
	});
	registerNodeSpec({
		type: STEP_TYPES.KEY,
		version: 1,
		display: {
			label: "Keyboard",
			iconClass: "icon-key",
			category: "Actions"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [{
			key: "keys",
			label: "Key sequence",
			type: "string",
			widget: "keysequence",
			required: true,
			help: "e.g. Backspace Enter or cmd+a"
		}, {
			key: "target",
			label: "Focus target (optional)",
			type: "json",
			widget: "targetlocator"
		}],
		defaults: { keys: "" }
	});
	registerNodeSpec({
		type: STEP_TYPES.SCROLL,
		version: 1,
		display: {
			label: "Scroll",
			iconClass: "icon-scroll",
			category: "Actions"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [
			{
				key: "mode",
				label: "Mode",
				type: "select",
				options: [
					{
						label: "Element",
						value: "element"
					},
					{
						label: "Offset",
						value: "offset"
					},
					{
						label: "Container",
						value: "container"
					}
				],
				default: "offset"
			},
			{
				key: "target",
				label: "Target (element/container mode)",
				type: "json",
				widget: "targetlocator"
			},
			{
				key: "offset",
				label: "Offset",
				type: "object",
				fields: [{
					key: "x",
					label: "X",
					type: "number"
				}, {
					key: "y",
					label: "Y",
					type: "number"
				}]
			}
		],
		defaults: {
			mode: "offset",
			offset: {
				x: 0,
				y: 300
			}
		}
	});
	registerNodeSpec({
		type: STEP_TYPES.DRAG,
		version: 1,
		display: {
			label: "Drag",
			iconClass: "icon-drag",
			category: "Actions"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [
			{
				key: "start",
				label: "Start",
				type: "json",
				widget: "targetlocator"
			},
			{
				key: "end",
				label: "End",
				type: "json",
				widget: "targetlocator"
			},
			{
				key: "path",
				label: "Path points",
				type: "array",
				item: {
					key: "p",
					label: "Point",
					type: "object",
					fields: [{
						key: "x",
						label: "X",
						type: "number"
					}, {
						key: "y",
						label: "Y",
						type: "number"
					}]
				}
			}
		],
		defaults: {}
	});
	registerNodeSpec({
		type: STEP_TYPES.WAIT,
		version: 1,
		display: {
			label: "Wait",
			iconClass: "icon-wait",
			category: "Actions"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [{
			key: "condition",
			label: "Condition (JSON)",
			type: "json",
			help: "e.g. {\"sleep\":1000} or {\"text\":\"Hello\",\"appear\":true}"
		}],
		defaults: { condition: { sleep: 500 } }
	});
	registerNodeSpec({
		type: STEP_TYPES.ASSERT,
		version: 1,
		display: {
			label: "Assert",
			iconClass: "icon-assert",
			category: "Actions"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }, { label: "onError" }]
		},
		schema: [{
			key: "assert",
			label: "Assertion (JSON)",
			type: "json",
			help: "e.g. {\"exists\":\"#id\"} / {\"visible\":\".btn\"}"
		}, {
			key: "failStrategy",
			label: "On failure",
			type: "select",
			options: [
				{
					label: "Stop",
					value: "stop"
				},
				{
					label: "Warn",
					value: "warn"
				},
				{
					label: "Retry",
					value: "retry"
				}
			],
			default: "stop"
		}],
		defaults: { assert: {} }
	});
	registerNodeSpec({
		type: STEP_TYPES.HTTP,
		version: 1,
		display: {
			label: "HTTP",
			iconClass: "icon-http",
			category: "Tools"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [
			{
				key: "method",
				label: "Method",
				type: "select",
				options: [
					"GET",
					"POST",
					"PUT",
					"PATCH",
					"DELETE"
				].map((m) => ({
					label: m,
					value: m
				})),
				default: "GET"
			},
			{
				key: "url",
				label: "URL",
				type: "string",
				required: true
			},
			{
				key: "headers",
				label: "Headers (JSON)",
				type: "json"
			},
			{
				key: "body",
				label: "Body (JSON)",
				type: "json"
			},
			{
				key: "formData",
				label: "Form (JSON)",
				type: "json"
			},
			{
				key: "saveAs",
				label: "Save as variable",
				type: "string"
			},
			{
				key: "assign",
				label: "Mapping (JSON)",
				type: "json"
			}
		],
		defaults: { method: "GET" }
	});
	registerNodeSpec({
		type: STEP_TYPES.EXTRACT,
		version: 1,
		display: {
			label: "Extract",
			iconClass: "icon-extract",
			category: "Tools"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [
			{
				key: "selector",
				label: "Selector",
				type: "string",
				widget: "selector"
			},
			{
				key: "attr",
				label: "Attribute",
				type: "select",
				options: [
					{
						label: "Text (text)",
						value: "text"
					},
					{
						label: "Text (textContent)",
						value: "textContent"
					},
					{
						label: "Custom attribute name",
						value: "attr"
					}
				]
			},
			{
				key: "js",
				label: "Custom JS",
				type: "string",
				help: "Runs in the page and returns a value"
			},
			{
				key: "saveAs",
				label: "Save to variable",
				type: "string",
				required: true
			}
		],
		defaults: { saveAs: "" }
	});
	registerNodeSpec({
		type: STEP_TYPES.SCREENSHOT,
		version: 1,
		display: {
			label: "Screenshot",
			iconClass: "icon-screenshot",
			category: "Tools"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [
			{
				key: "selector",
				label: "Target selector",
				type: "string"
			},
			{
				key: "fullPage",
				label: "Full page",
				type: "boolean",
				default: false
			},
			{
				key: "saveAs",
				label: "Save to variable",
				type: "string"
			}
		],
		defaults: { fullPage: false }
	});
	registerNodeSpec({
		type: STEP_TYPES.TRIGGER_EVENT,
		version: 1,
		display: {
			label: "Trigger event",
			iconClass: "icon-trigger",
			category: "Tools"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [
			{
				key: "target",
				label: "Target",
				type: "json",
				widget: "targetlocator"
			},
			{
				key: "event",
				label: "Event type",
				type: "string",
				required: true
			},
			{
				key: "bubbles",
				label: "Bubbles",
				type: "boolean",
				default: true
			},
			{
				key: "cancelable",
				label: "Cancelable",
				type: "boolean",
				default: false
			}
		],
		defaults: { event: "" }
	});
	registerNodeSpec({
		type: STEP_TYPES.SET_ATTRIBUTE,
		version: 1,
		display: {
			label: "Set attribute",
			iconClass: "icon-attr",
			category: "Tools"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [
			{
				key: "target",
				label: "Target",
				type: "json",
				widget: "targetlocator"
			},
			{
				key: "name",
				label: "Attribute name",
				type: "string",
				required: true
			},
			{
				key: "value",
				label: "Attribute value",
				type: "string"
			},
			{
				key: "remove",
				label: "Remove attribute",
				type: "boolean",
				default: false
			}
		],
		defaults: { remove: false }
	});
	registerNodeSpec({
		type: STEP_TYPES.LOOP_ELEMENTS,
		version: 1,
		display: {
			label: "Loop elements",
			iconClass: "icon-loop",
			category: "Tools"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [
			{
				key: "selector",
				label: "Selector",
				type: "string",
				required: true
			},
			{
				key: "saveAs",
				label: "List variable name",
				type: "string",
				default: "elements"
			},
			{
				key: "itemVar",
				label: "Item variable name",
				type: "string",
				default: "item"
			},
			{
				key: "subflowId",
				label: "Subflow ID",
				type: "string",
				required: true
			}
		],
		defaults: {
			saveAs: "elements",
			itemVar: "item"
		}
	});
	registerNodeSpec({
		type: STEP_TYPES.SWITCH_FRAME,
		version: 1,
		display: {
			label: "Switch frame",
			iconClass: "icon-frame",
			category: "Tools"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [{
			key: "frame",
			label: "Frame locator",
			type: "object",
			fields: [{
				key: "index",
				label: "Index",
				type: "number"
			}, {
				key: "urlContains",
				label: "URL contains",
				type: "string"
			}]
		}],
		defaults: {}
	});
	registerNodeSpec({
		type: STEP_TYPES.HANDLE_DOWNLOAD,
		version: 1,
		display: {
			label: "Handle download",
			iconClass: "icon-download",
			category: "Tools"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [
			{
				key: "filenameContains",
				label: "Filename contains",
				type: "string"
			},
			{
				key: "waitForComplete",
				label: "Wait for completion",
				type: "boolean",
				default: true
			},
			{
				key: "timeoutMs",
				label: "Timeout (ms)",
				type: "number",
				default: 6e4
			},
			{
				key: "saveAs",
				label: "Save to variable",
				type: "string"
			}
		],
		defaults: {
			waitForComplete: true,
			timeoutMs: 6e4
		}
	});
	registerNodeSpec({
		type: STEP_TYPES.SCRIPT,
		version: 1,
		display: {
			label: "Script",
			iconClass: "icon-script",
			category: "Tools"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [
			{
				key: "world",
				label: "Execution context",
				type: "select",
				options: [{
					label: "ISOLATED",
					value: "ISOLATED"
				}, {
					label: "MAIN",
					value: "MAIN"
				}],
				default: "ISOLATED"
			},
			{
				key: "code",
				label: "Script code",
				type: "string",
				widget: "code",
				required: true
			},
			{
				key: "when",
				label: "Run at",
				type: "select",
				options: [{
					label: "before",
					value: "before"
				}, {
					label: "after",
					value: "after"
				}],
				default: "after"
			},
			{
				key: "assign",
				label: "Mapping (JSON)",
				type: "json"
			},
			{
				key: "saveAs",
				label: "Save to variable",
				type: "string"
			}
		],
		defaults: {
			world: "ISOLATED",
			when: "after"
		}
	});
	registerNodeSpec({
		type: STEP_TYPES.OPEN_TAB,
		version: 1,
		display: {
			label: "Open tab",
			iconClass: "icon-openTab",
			category: "Tabs"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [{
			key: "url",
			label: "URL",
			type: "string"
		}, {
			key: "newWindow",
			label: "New window",
			type: "boolean",
			default: false
		}],
		defaults: { newWindow: false }
	});
	registerNodeSpec({
		type: "executeFlow",
		version: 1,
		display: {
			label: "Run subflow",
			iconClass: "icon-exec",
			category: "Flow"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [
			{
				key: "flowId",
				label: "Flow ID",
				type: "string",
				required: true
			},
			{
				key: "inline",
				label: "Run inline",
				type: "boolean",
				default: false
			},
			{
				key: "args",
				label: "Arguments (JSON)",
				type: "json"
			}
		],
		defaults: { inline: false }
	});
	registerNodeSpec({
		type: STEP_TYPES.SWITCH_TAB,
		version: 1,
		display: {
			label: "Switch tab",
			iconClass: "icon-switchTab",
			category: "Tabs"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [
			{
				key: "tabId",
				label: "TabId",
				type: "number"
			},
			{
				key: "urlContains",
				label: "URL contains",
				type: "string"
			},
			{
				key: "titleContains",
				label: "Title contains",
				type: "string"
			}
		],
		defaults: {}
	});
	registerNodeSpec({
		type: STEP_TYPES.CLOSE_TAB,
		version: 1,
		display: {
			label: "Close tab",
			iconClass: "icon-closeTab",
			category: "Tabs"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [{
			key: "tabIds",
			label: "TabIds",
			type: "array",
			item: {
				key: "id",
				label: "id",
				type: "number"
			}
		}, {
			key: "url",
			label: "URL",
			type: "string"
		}],
		defaults: {}
	});
	registerNodeSpec({
		type: STEP_TYPES.IF,
		version: 1,
		display: {
			label: "Condition",
			iconClass: "icon-if",
			category: "Logic"
		},
		ports: {
			inputs: 1,
			outputs: "any"
		},
		schema: [
			{
				key: "condition",
				label: "Condition expression (JSON)",
				type: "json",
				help: "e.g. {\"expression\":\"vars.a>0\"}"
			},
			{
				key: "branches",
				label: "Branches",
				type: "array",
				item: {
					key: "b",
					label: "case",
					type: "object",
					fields: [
						{
							key: "id",
							label: "ID",
							type: "string"
						},
						{
							key: "name",
							label: "Name",
							type: "string"
						},
						{
							key: "expr",
							label: "Expression",
							type: "string"
						}
					]
				}
			},
			{
				key: "else",
				label: "Enable else",
				type: "boolean",
				default: true
			}
		],
		defaults: { else: true }
	});
	registerNodeSpec({
		type: STEP_TYPES.FOREACH,
		version: 1,
		display: {
			label: "Loop",
			iconClass: "icon-foreach",
			category: "Logic"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [
			{
				key: "listVar",
				label: "List variable",
				type: "string",
				required: true
			},
			{
				key: "itemVar",
				label: "Item variable",
				type: "string",
				default: "item"
			},
			{
				key: "subflowId",
				label: "Subflow ID",
				type: "string",
				required: true
			},
			{
				key: "concurrency",
				label: "Concurrency",
				type: "number",
				default: 1,
				help: "Runs subflows concurrently (variables are shallow-copied, not merged back)"
			}
		],
		defaults: { itemVar: "item" }
	});
	registerNodeSpec({
		type: STEP_TYPES.WHILE,
		version: 1,
		display: {
			label: "Loop",
			iconClass: "icon-while",
			category: "Logic"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [
			{
				key: "condition",
				label: "Condition (JSON)",
				type: "json"
			},
			{
				key: "subflowId",
				label: "Subflow ID",
				type: "string",
				required: true
			},
			{
				key: "maxIterations",
				label: "Max iterations",
				type: "number",
				default: 100
			}
		],
		defaults: { maxIterations: 100 }
	});
	registerNodeSpec({
		type: STEP_TYPES.DELAY,
		version: 1,
		display: {
			label: "Delay",
			iconClass: "icon-delay",
			category: "Actions"
		},
		ports: {
			inputs: 1,
			outputs: [{ label: "default" }]
		},
		schema: [{
			key: "sleep",
			label: "Delay",
			type: "number",
			widget: "duration",
			required: true,
			default: 1e3
		}],
		defaults: { sleep: 1e3 }
	});
	registerNodeSpec({
		type: STEP_TYPES.TRIGGER,
		version: 1,
		display: {
			label: "Trigger",
			iconClass: "icon-trigger",
			category: "Flow"
		},
		ports: {
			inputs: 0,
			outputs: [{ label: "default" }]
		},
		schema: [
			{
				key: "enabled",
				label: "Enabled",
				type: "boolean",
				default: true
			},
			{
				key: "description",
				label: "Description",
				type: "string"
			},
			{
				key: "modes",
				label: "Mode",
				type: "object",
				fields: [
					{
						key: "manual",
						label: "Manual",
						type: "boolean",
						default: true
					},
					{
						key: "url",
						label: "URL trigger",
						type: "boolean",
						default: false
					},
					{
						key: "contextMenu",
						label: "Context menu",
						type: "boolean",
						default: false
					},
					{
						key: "command",
						label: "Shortcut",
						type: "boolean",
						default: false
					},
					{
						key: "dom",
						label: "DOM event",
						type: "boolean",
						default: false
					},
					{
						key: "schedule",
						label: "Schedule",
						type: "boolean",
						default: false
					}
				]
			},
			{
				key: "url",
				label: "URL rules",
				type: "object",
				fields: [{
					key: "rules",
					label: "Rules",
					type: "array",
					item: {
						key: "rule",
						label: "Rule",
						type: "object",
						fields: [{
							key: "kind",
							label: "Type",
							type: "select",
							options: [
								{
									label: "URL",
									value: "url"
								},
								{
									label: "Domain",
									value: "domain"
								},
								{
									label: "Path",
									value: "path"
								}
							],
							default: "url"
						}, {
							key: "value",
							label: "Value",
							type: "string"
						}]
					}
				}]
			},
			{
				key: "contextMenu",
				label: "Context menu",
				type: "object",
				fields: [{
					key: "title",
					label: "Title",
					type: "string",
					default: "Run workflow"
				}, {
					key: "enabled",
					label: "Enabled",
					type: "boolean",
					default: false
				}]
			},
			{
				key: "command",
				label: "Shortcut",
				type: "object",
				fields: [{
					key: "commandKey",
					label: "Shortcut",
					type: "string"
				}, {
					key: "enabled",
					label: "Enabled",
					type: "boolean",
					default: false
				}]
			},
			{
				key: "dom",
				label: "DOM event",
				type: "object",
				fields: [
					{
						key: "selector",
						label: "Selector",
						type: "string"
					},
					{
						key: "appear",
						label: "Appear",
						type: "boolean",
						default: true
					},
					{
						key: "once",
						label: "Once",
						type: "boolean",
						default: true
					},
					{
						key: "debounceMs",
						label: "Debounce (ms)",
						type: "number",
						default: 800
					},
					{
						key: "enabled",
						label: "Enabled",
						type: "boolean",
						default: false
					}
				]
			},
			{
				key: "schedules",
				label: "Schedule",
				type: "array",
				item: {
					key: "sched",
					label: "Schedules",
					type: "object",
					fields: [
						{
							key: "id",
							label: "ID",
							type: "string"
						},
						{
							key: "type",
							label: "Type",
							type: "select",
							options: [
								{
									label: "Once",
									value: "once"
								},
								{
									label: "Interval",
									value: "interval"
								},
								{
									label: "Daily",
									value: "daily"
								}
							]
						},
						{
							key: "when",
							label: "Time (ISO/cron)",
							type: "string"
						},
						{
							key: "enabled",
							label: "Enabled",
							type: "boolean",
							default: true
						}
					]
				}
			}
		],
		defaults: { enabled: true }
	});
}
//#endregion
export { getNodeSpec as a, stepsToNodes as c, TOOL_NAMES as i, topoOrder as l, NativeMessageType as n, listNodeSpecs as o, STEP_TYPES as r, registerBuiltinSpecs as s, EDGE_LABELS as t };
