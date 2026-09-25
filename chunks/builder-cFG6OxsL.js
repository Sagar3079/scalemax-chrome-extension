const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["chunks/elk.bundled-DsXaxXj4.js","chunks/asyncToGenerator-HxMCLN5T.js"])))=>i.map(i=>d[i]);
import { c as __toESM, n as init_asyncToGenerator, t as _asyncToGenerator } from "./asyncToGenerator-HxMCLN5T.js";
import { $ as reactive, A as onBeforeUnmount, B as useAttrs, C as getCurrentInstance, D as mergeProps, E as isMemoSame, F as renderList, G as withDirectives, H as watch, I as renderSlot, J as effectScope, L as resolveComponent, M as onUnmounted, N as openBlock, O as nextTick, P as provide, Q as onScopeDispose, R as resolveDynamicComponent, S as defineComponent, T as inject, U as watchEffect, V as useSlots, W as withCtx, X as isRef, Y as getCurrentScope, Z as markRaw, _ as createPropsRestProxy, a as vModelSelect, at as toValue$1, b as createVNode, ct as normalizeStyle, d as Teleport, et as readonly, f as computed, g as createElementBlock, h as createCommentVNode, i as vModelCheckbox, it as toRefs$1, j as onMounted, k as onBeforeMount, l as withModifiers, lt as toDisplayString, m as createBlock, nt as shallowRef, o as vModelText, ot as unref, p as createBaseVNode, q as customRef, r as createApp, rt as toRef, st as normalizeClass, t as _plugin_vue_export_helper_default, tt as ref, u as Fragment, v as createStaticVNode, w as h, y as createTextVNode } from "./_plugin-vue_export-helper-DCRN0gge.js";
import { t as _objectSpread2 } from "./objectSpread2-YiwCHUSe.js";
import { t as useRRV3Rpc } from "./useRRV3Rpc-D3-8lVnM.js";
import { a as getNodeSpec, c as stepsToNodes$1, l as topoOrder$1, o as listNodeSpecs, r as STEP_TYPES, s as registerBuiltinSpecs, t as EDGE_LABELS } from "./dist-piJEahpX.js";
import { a as __vitePreload, o as _objectWithoutProperties, t as BACKGROUND_MESSAGE_TYPES } from "./message-types-Byobwm5R.js";
/* empty css                  */
//#region entrypoints/background/record-replay-v3/storage/import/v2-to-v3.ts
/**
* 将 V2 Flow 转换为 V3 Flow
* @param v2Flow V2 格式的 Flow
* @returns 转换结果，包含成功/失败状态、数据和错误/警告信息
*/
function convertFlowV2ToV3(v2Flow) {
	var _v2Flow$meta, _v2Flow$meta2;
	const errors = [];
	const warnings = [];
	if (!v2Flow.id) errors.push("V2 Flow missing required field: id");
	if (!v2Flow.name) errors.push("V2 Flow missing required field: name");
	if (!v2Flow.nodes || v2Flow.nodes.length === 0) errors.push("V2 Flow has no nodes");
	if (v2Flow.subflows && Object.keys(v2Flow.subflows).length > 0) errors.push("V3 does not support subflows yet. Flow contains subflows: " + Object.keys(v2Flow.subflows).join(", "));
	const unsupportedNodes = (v2Flow.nodes || []).filter((n) => n.type === "foreach" || n.type === "while");
	if (unsupportedNodes.length > 0) errors.push("V3 does not support foreach/while nodes yet. Found: " + unsupportedNodes.map((n) => `${n.id} (${n.type})`).join(", "));
	if (errors.length > 0) return {
		success: false,
		errors,
		warnings
	};
	const nodes = [];
	for (const v2Node of v2Flow.nodes || []) {
		const node = convertNodeV2ToV3(v2Node);
		if (node) nodes.push(node);
		else warnings.push(`Skipped invalid node: ${v2Node.id}`);
	}
	const edges = [];
	for (const v2Edge of v2Flow.edges || []) {
		const edge = convertEdgeV2ToV3(v2Edge);
		if (edge) edges.push(edge);
		else warnings.push(`Skipped invalid edge: ${v2Edge.id}`);
	}
	const entryResult = findEntryNodeId(nodes, edges);
	warnings.push(...entryResult.warnings);
	if (!entryResult.nodeId) {
		errors.push("Could not determine entry node. No valid root node found.");
		return {
			success: false,
			errors,
			warnings
		};
	}
	const entryNodeId = entryResult.nodeId;
	const variables = convertVariablesV2ToV3(v2Flow.variables || []);
	const meta = convertMetaV2ToV3(v2Flow.meta);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const v3Flow = {
		schemaVersion: 3,
		id: v2Flow.id,
		name: v2Flow.name,
		createdAt: ((_v2Flow$meta = v2Flow.meta) === null || _v2Flow$meta === void 0 ? void 0 : _v2Flow$meta.createdAt) || now,
		updatedAt: ((_v2Flow$meta2 = v2Flow.meta) === null || _v2Flow$meta2 === void 0 ? void 0 : _v2Flow$meta2.updatedAt) || now,
		entryNodeId,
		nodes,
		edges
	};
	if (v2Flow.description) v3Flow.description = v2Flow.description;
	if (variables.length > 0) v3Flow.variables = variables;
	if (meta) v3Flow.meta = meta;
	return {
		success: true,
		data: v3Flow,
		errors,
		warnings
	};
}
/**
* 转换单个 V2 Node 为 V3 Node
*/
function convertNodeV2ToV3(v2Node) {
	if (!v2Node.id || !v2Node.type) return null;
	const node = {
		id: v2Node.id,
		kind: v2Node.type,
		config: v2Node.config || {}
	};
	if (v2Node.name) node.name = v2Node.name;
	if (v2Node.disabled) node.disabled = v2Node.disabled;
	if (v2Node.ui) node.ui = v2Node.ui;
	return node;
}
/**
* 转换单个 V2 Edge 为 V3 Edge
*/
function convertEdgeV2ToV3(v2Edge) {
	if (!v2Edge.id || !v2Edge.from || !v2Edge.to) return null;
	const edge = {
		id: v2Edge.id,
		from: v2Edge.from,
		to: v2Edge.to
	};
	if (v2Edge.label) edge.label = v2Edge.label;
	return edge;
}
/**
* 找到入口节点 ID
*
* 规则：
* 1. 排除 trigger 类型节点（这些是 UI 节点，不参与执行）
* 2. 只统计「可执行节点 -> 可执行节点」的边来计算入度（忽略 trigger 指出的边）
* 3. 找到入度为 0 的节点作为候选
* 4. 如果有多个候选，使用稳定选择规则：
*    - 优先选择 UI 坐标最靠左上的节点（按 x 升序，x 相同按 y 升序）
*    - 如果无 UI 坐标，按 ID 字典序取第一个
*/
function findEntryNodeId(nodes, edges) {
	const warnings = [];
	const executableNodes = nodes.filter((n) => n.kind !== "trigger");
	if (executableNodes.length === 0) {
		warnings.push("No executable nodes found; cannot determine entry node");
		return {
			nodeId: null,
			warnings
		};
	}
	const executableNodeIds = new Set(executableNodes.map((n) => n.id));
	const inDegree = /* @__PURE__ */ new Map();
	for (const node of executableNodes) inDegree.set(node.id, 0);
	for (const edge of edges) {
		var _inDegree$get;
		if (!executableNodeIds.has(edge.from)) continue;
		if (!executableNodeIds.has(edge.to)) continue;
		inDegree.set(edge.to, ((_inDegree$get = inDegree.get(edge.to)) !== null && _inDegree$get !== void 0 ? _inDegree$get : 0) + 1);
	}
	const rootNodes = executableNodes.filter((n) => inDegree.get(n.id) === 0);
	if (rootNodes.length === 0) {
		const fallbackResult = selectStableRootNode(executableNodes);
		warnings.push(`No inDegree=0 executable node found (graph may contain cycles); falling back to "${fallbackResult.node.id}" by ${fallbackResult.rule}`);
		return {
			nodeId: fallbackResult.node.id,
			warnings
		};
	}
	if (rootNodes.length === 1) return {
		nodeId: rootNodes[0].id,
		warnings
	};
	const selectedResult = selectStableRootNode(rootNodes);
	const candidateIds = rootNodes.map((n) => n.id).sort((a, b) => a.localeCompare(b)).join(", ");
	warnings.push(`Multiple inDegree=0 executable nodes (${candidateIds}); selected "${selectedResult.node.id}" by ${selectedResult.rule}`);
	return {
		nodeId: selectedResult.node.id,
		warnings
	};
}
/**
* 从多个根节点中选择一个稳定的入口节点
* 优先按 UI 坐标（左上角优先），其次按 ID 字典序
*/
function selectStableRootNode(nodes) {
	const hasValidUi = (n) => !!n.ui && Number.isFinite(n.ui.x) && Number.isFinite(n.ui.y);
	const nodesWithUi = nodes.filter(hasValidUi);
	if (nodesWithUi.length > 0) {
		nodesWithUi.sort((a, b) => {
			if (a.ui.x !== b.ui.x) return a.ui.x - b.ui.x;
			if (a.ui.y !== b.ui.y) return a.ui.y - b.ui.y;
			return a.id.localeCompare(b.id);
		});
		const selected = nodesWithUi[0];
		return {
			node: selected,
			rule: `ui(x=${selected.ui.x}, y=${selected.ui.y})`
		};
	}
	return {
		node: [...nodes].sort((a, b) => a.id.localeCompare(b.id))[0],
		rule: "id"
	};
}
/**
* 转换变量定义
*/
function convertVariablesV2ToV3(v2Variables) {
	return v2Variables.filter((v) => v.key).map((v) => {
		var _v$rules;
		const variable = { name: v.key };
		if (v.label) variable.label = v.label;
		if (v.sensitive) variable.sensitive = v.sensitive;
		if (v.default !== void 0) variable.default = v.default;
		if ((_v$rules = v.rules) === null || _v$rules === void 0 ? void 0 : _v$rules.required) variable.required = v.rules.required;
		return variable;
	});
}
/**
* 转换元数据
*/
function convertMetaV2ToV3(v2Meta) {
	if (!v2Meta) return void 0;
	const meta = {};
	if (v2Meta.tags && v2Meta.tags.length > 0) meta.tags = v2Meta.tags;
	if (v2Meta.bindings && v2Meta.bindings.length > 0) meta.bindings = v2Meta.bindings.map((b) => ({
		kind: b.type,
		value: b.value
	}));
	if (Object.keys(meta).length === 0) return;
	return meta;
}
/**
* 将 V3 Flow 转换为 V2 Flow（用于在 V2 Builder 中编辑）
* @param v3Flow V3 格式的 Flow
* @returns 转换结果
*/
function convertFlowV3ToV2(v3Flow) {
	var _v3Flow$meta, _v3Flow$meta2;
	const errors = [];
	const warnings = [];
	const nodes = v3Flow.nodes.map((n) => ({
		id: n.id,
		type: n.kind,
		name: n.name,
		disabled: n.disabled,
		config: n.config,
		ui: n.ui
	}));
	const edges = v3Flow.edges.map((e) => ({
		id: e.id,
		from: e.from,
		to: e.to,
		label: e.label
	}));
	const variables = (v3Flow.variables || []).map((v) => ({
		key: v.name,
		label: v.label,
		sensitive: v.sensitive,
		default: v.default,
		rules: v.required ? { required: v.required } : void 0
	}));
	const meta = {
		createdAt: v3Flow.createdAt,
		updatedAt: v3Flow.updatedAt
	};
	if ((_v3Flow$meta = v3Flow.meta) === null || _v3Flow$meta === void 0 ? void 0 : _v3Flow$meta.tags) meta.tags = v3Flow.meta.tags;
	if ((_v3Flow$meta2 = v3Flow.meta) === null || _v3Flow$meta2 === void 0 ? void 0 : _v3Flow$meta2.bindings) meta.bindings = v3Flow.meta.bindings.map((b) => ({
		type: b.kind,
		value: b.value
	}));
	return {
		success: true,
		data: {
			id: v3Flow.id,
			name: v3Flow.name,
			description: v3Flow.description,
			version: 2,
			meta,
			variables: variables.length > 0 ? variables : void 0,
			nodes,
			edges
		},
		errors,
		warnings
	};
}
//#endregion
//#region entrypoints/shared/utils/rr-flow-convert.ts
/**
* 将 V2 Flow 转换为 V3 格式，用于 RPC 保存
* @param flowV2 Builder store 中的 V2 Flow
* @returns V3 Flow 和警告信息
* @throws 转换失败时抛出错误
*/
function flowV2ToV3ForRpc(flowV2) {
	const result = convertFlowV2ToV3(flowV2);
	if (!result.success || !result.data) {
		const errorMsg = result.errors.length > 0 ? result.errors.join("; ") : "Unknown conversion error";
		throw new Error(`V2→V3 conversion failed: ${errorMsg}`);
	}
	return {
		flow: result.data,
		warnings: result.warnings
	};
}
/**
* 将 V3 Flow 转换为 V2 格式，用于 Builder 显示和编辑
* @param flowV3 从 RPC 获取的 V3 Flow
* @returns V2 Flow 和警告信息
* @throws 转换失败时抛出错误
*/
function flowV3ToV2ForBuilder(flowV3) {
	const result = convertFlowV3ToV2(flowV3);
	if (!result.success || !result.data) {
		const errorMsg = result.errors.length > 0 ? result.errors.join("; ") : "Unknown conversion error";
		throw new Error(`V3→V2 conversion failed: ${errorMsg}`);
	}
	return {
		flow: result.data,
		warnings: result.warnings
	};
}
/**
* 判断是否为 V3 Flow
* @description 用于导入时判断 JSON 格式
*/
function isFlowV3(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const obj = value;
	return obj.schemaVersion === 3 && typeof obj.id === "string" && typeof obj.name === "string" && typeof obj.entryNodeId === "string" && Array.isArray(obj.nodes);
}
/**
* 从导入的 JSON 中提取 Flow 候选列表
* @description 支持单个 Flow、Flow 数组、或 { flows: Flow[] } 格式
*/
function extractFlowCandidates(parsed) {
	if (Array.isArray(parsed)) return parsed;
	if (parsed && typeof parsed === "object") {
		const obj = parsed;
		if (Array.isArray(obj.flows)) return obj.flows;
		if (obj.id && (Array.isArray(obj.steps) || Array.isArray(obj.nodes))) return [obj];
	}
	return [];
}
//#endregion
//#region entrypoints/popup/components/builder/model/transforms.ts
init_asyncToGenerator();
function newId$1(prefix) {
	return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}
function defaultConfigFor(t) {
	if (t === "trigger") return {
		type: "manual",
		description: ""
	};
	if (t === STEP_TYPES.CLICK || t === STEP_TYPES.FILL) return {
		target: { candidates: [] },
		value: t === STEP_TYPES.FILL ? "" : void 0
	};
	if (t === STEP_TYPES.IF) return {
		branches: [{
			id: newId$1("case"),
			name: "",
			expr: ""
		}],
		else: true
	};
	if (t === STEP_TYPES.NAVIGATE) return { url: "" };
	if (t === STEP_TYPES.WAIT) return { condition: {
		text: "",
		appear: true
	} };
	if (t === STEP_TYPES.ASSERT) return { assert: { exists: "" } };
	if (t === STEP_TYPES.KEY) return { keys: "" };
	if (t === STEP_TYPES.DELAY) return { ms: 1e3 };
	if (t === STEP_TYPES.HTTP) return {
		method: "GET",
		url: "",
		headers: {},
		body: null,
		saveAs: ""
	};
	if (t === STEP_TYPES.EXTRACT) return {
		selector: "",
		attr: "text",
		js: "",
		saveAs: ""
	};
	if (t === STEP_TYPES.SCREENSHOT) return {
		selector: "",
		fullPage: false,
		saveAs: "shot"
	};
	if (t === STEP_TYPES.DRAG) return {
		start: { candidates: [] },
		end: { candidates: [] },
		path: []
	};
	if (t === STEP_TYPES.SCROLL) return {
		mode: "offset",
		offset: {
			x: 0,
			y: 300
		},
		target: { candidates: [] }
	};
	if (t === STEP_TYPES.TRIGGER_EVENT) return {
		target: { candidates: [] },
		event: "input",
		bubbles: true,
		cancelable: false
	};
	if (t === STEP_TYPES.SET_ATTRIBUTE) return {
		target: { candidates: [] },
		name: "",
		value: ""
	};
	if (t === STEP_TYPES.LOOP_ELEMENTS) return {
		selector: "",
		saveAs: "elements",
		itemVar: "item",
		subflowId: ""
	};
	if (t === STEP_TYPES.SWITCH_FRAME) return { frame: {
		index: 0,
		urlContains: ""
	} };
	if (t === STEP_TYPES.HANDLE_DOWNLOAD) return {
		filenameContains: "",
		waitForComplete: true,
		timeoutMs: 6e4,
		saveAs: "download"
	};
	if (t === STEP_TYPES.EXECUTE_FLOW) return {
		flowId: "",
		inline: true,
		args: {}
	};
	if (t === STEP_TYPES.OPEN_TAB) return {
		url: "",
		newWindow: false
	};
	if (t === STEP_TYPES.SWITCH_TAB) return {
		tabId: null,
		urlContains: "",
		titleContains: ""
	};
	if (t === STEP_TYPES.CLOSE_TAB) return {
		tabIds: [],
		url: ""
	};
	if (t === STEP_TYPES.SCRIPT) return {
		world: "ISOLATED",
		code: "",
		saveAs: "",
		assign: {}
	};
	return {};
}
function stepsToNodes(steps) {
	const base = stepsToNodes$1(steps);
	base.forEach((n, i) => {
		n.ui = n.ui || {
			x: 200,
			y: 120 + i * 120
		};
	});
	return base;
}
function topoOrder(nodes, edges) {
	const filtered = (edges || []).filter((e) => !e.label || e.label === EDGE_LABELS.DEFAULT);
	return topoOrder$1(nodes, filtered);
}
function autoChainEdges(nodes) {
	const arr = [];
	for (let i = 0; i < nodes.length - 1; i++) arr.push({
		id: newId$1("e"),
		from: nodes[i].id,
		to: nodes[i + 1].id,
		label: EDGE_LABELS.DEFAULT
	});
	return arr;
}
function summarizeNode(n) {
	var _n$config, _n$config2, _n$config3, _n$config4, _n$config5, _n$config6, _n$config7, _n$config8, _n$config9, _n$config10, _n$config11, _n$config12, _n$config13, _n$config14, _n$config$value, _n$config15, _n$config16, _n$config17, _n$config18, _n$config19, _n$config$frame$index, _n$config20, _n$config21, _n$config22, _n$config23, _n$config24, _n$config25, _n$config26, _n$config27, _n$config28, _n$config31, _n$config38;
	if (!n) return "";
	if (n.type === STEP_TYPES.CLICK || n.type === STEP_TYPES.FILL) return ((_n$config = n.config) === null || _n$config === void 0 || (_n$config = _n$config.target) === null || _n$config === void 0 || (_n$config = _n$config.candidates) === null || _n$config === void 0 || (_n$config = _n$config[0]) === null || _n$config === void 0 ? void 0 : _n$config.value) || "未配置选择器";
	if (n.type === STEP_TYPES.NAVIGATE) return ((_n$config2 = n.config) === null || _n$config2 === void 0 ? void 0 : _n$config2.url) || "";
	if (n.type === STEP_TYPES.KEY) return ((_n$config3 = n.config) === null || _n$config3 === void 0 ? void 0 : _n$config3.keys) || "";
	if (n.type === STEP_TYPES.DELAY) return `${Number(((_n$config4 = n.config) === null || _n$config4 === void 0 ? void 0 : _n$config4.ms) || 0)}ms`;
	if (n.type === STEP_TYPES.HTTP) return `${((_n$config5 = n.config) === null || _n$config5 === void 0 ? void 0 : _n$config5.method) || "GET"} ${((_n$config6 = n.config) === null || _n$config6 === void 0 ? void 0 : _n$config6.url) || ""}`;
	if (n.type === STEP_TYPES.EXTRACT) return `${((_n$config7 = n.config) === null || _n$config7 === void 0 ? void 0 : _n$config7.selector) || ""} -> ${((_n$config8 = n.config) === null || _n$config8 === void 0 ? void 0 : _n$config8.saveAs) || ""}`;
	if (n.type === STEP_TYPES.SCREENSHOT) return ((_n$config9 = n.config) === null || _n$config9 === void 0 ? void 0 : _n$config9.selector) ? `el(${n.config.selector}) -> ${((_n$config10 = n.config) === null || _n$config10 === void 0 ? void 0 : _n$config10.saveAs) || ""}` : `fullPage -> ${((_n$config11 = n.config) === null || _n$config11 === void 0 ? void 0 : _n$config11.saveAs) || ""}`;
	if (n.type === STEP_TYPES.TRIGGER_EVENT) return `${((_n$config12 = n.config) === null || _n$config12 === void 0 ? void 0 : _n$config12.event) || ""} ${((_n$config13 = n.config) === null || _n$config13 === void 0 || (_n$config13 = _n$config13.target) === null || _n$config13 === void 0 || (_n$config13 = _n$config13.candidates) === null || _n$config13 === void 0 || (_n$config13 = _n$config13[0]) === null || _n$config13 === void 0 ? void 0 : _n$config13.value) || ""}`;
	if (n.type === STEP_TYPES.SET_ATTRIBUTE) return `${((_n$config14 = n.config) === null || _n$config14 === void 0 ? void 0 : _n$config14.name) || ""}=${(_n$config$value = (_n$config15 = n.config) === null || _n$config15 === void 0 ? void 0 : _n$config15.value) !== null && _n$config$value !== void 0 ? _n$config$value : ""}`;
	if (n.type === STEP_TYPES.LOOP_ELEMENTS) return `${((_n$config16 = n.config) === null || _n$config16 === void 0 ? void 0 : _n$config16.selector) || ""} as ${((_n$config17 = n.config) === null || _n$config17 === void 0 ? void 0 : _n$config17.itemVar) || "item"} -> ${((_n$config18 = n.config) === null || _n$config18 === void 0 ? void 0 : _n$config18.subflowId) || ""}`;
	if (n.type === STEP_TYPES.SWITCH_FRAME) return ((_n$config19 = n.config) === null || _n$config19 === void 0 || (_n$config19 = _n$config19.frame) === null || _n$config19 === void 0 ? void 0 : _n$config19.urlContains) ? `url~${n.config.frame.urlContains}` : `index=${Number((_n$config$frame$index = (_n$config20 = n.config) === null || _n$config20 === void 0 || (_n$config20 = _n$config20.frame) === null || _n$config20 === void 0 ? void 0 : _n$config20.index) !== null && _n$config$frame$index !== void 0 ? _n$config$frame$index : 0)}`;
	if (n.type === STEP_TYPES.OPEN_TAB) return `open ${((_n$config21 = n.config) === null || _n$config21 === void 0 ? void 0 : _n$config21.url) || ""}`;
	if (n.type === STEP_TYPES.SWITCH_TAB) return `switch ${((_n$config22 = n.config) === null || _n$config22 === void 0 ? void 0 : _n$config22.tabId) || ((_n$config23 = n.config) === null || _n$config23 === void 0 ? void 0 : _n$config23.urlContains) || ((_n$config24 = n.config) === null || _n$config24 === void 0 ? void 0 : _n$config24.titleContains) || ""}`;
	if (n.type === STEP_TYPES.CLOSE_TAB) return `close ${((_n$config25 = n.config) === null || _n$config25 === void 0 ? void 0 : _n$config25.url) || ""}`;
	if (n.type === STEP_TYPES.HANDLE_DOWNLOAD) return `download ${((_n$config26 = n.config) === null || _n$config26 === void 0 ? void 0 : _n$config26.filenameContains) || ""}`;
	if (n.type === STEP_TYPES.WAIT) return JSON.stringify(((_n$config27 = n.config) === null || _n$config27 === void 0 ? void 0 : _n$config27.condition) || {});
	if (n.type === STEP_TYPES.ASSERT) return JSON.stringify(((_n$config28 = n.config) === null || _n$config28 === void 0 ? void 0 : _n$config28.assert) || {});
	if (n.type === STEP_TYPES.IF) {
		var _n$config29, _n$config30;
		return `if/else 分支数 ${Array.isArray((_n$config29 = n.config) === null || _n$config29 === void 0 ? void 0 : _n$config29.branches) ? n.config.branches.length : 0}${((_n$config30 = n.config) === null || _n$config30 === void 0 ? void 0 : _n$config30.else) === false ? "" : " + else"}`;
	}
	if (n.type === STEP_TYPES.SCRIPT) return (((_n$config31 = n.config) === null || _n$config31 === void 0 ? void 0 : _n$config31.code) || "").slice(0, 30);
	if (n.type === STEP_TYPES.DRAG) {
		var _n$config32, _n$config33;
		const a = ((_n$config32 = n.config) === null || _n$config32 === void 0 || (_n$config32 = _n$config32.start) === null || _n$config32 === void 0 || (_n$config32 = _n$config32.candidates) === null || _n$config32 === void 0 || (_n$config32 = _n$config32[0]) === null || _n$config32 === void 0 ? void 0 : _n$config32.value) || "";
		const b = ((_n$config33 = n.config) === null || _n$config33 === void 0 || (_n$config33 = _n$config33.end) === null || _n$config33 === void 0 || (_n$config33 = _n$config33.candidates) === null || _n$config33 === void 0 || (_n$config33 = _n$config33[0]) === null || _n$config33 === void 0 ? void 0 : _n$config33.value) || "";
		return a || b ? `${a} -> ${b}` : "拖拽";
	}
	if (n.type === STEP_TYPES.SCROLL) {
		var _n$config34, _n$config37;
		const mode = ((_n$config34 = n.config) === null || _n$config34 === void 0 ? void 0 : _n$config34.mode) || "offset";
		if (mode === "offset" || mode === "container") {
			var _n$config$offset$x, _n$config35, _n$config$offset$y, _n$config36;
			return `${mode} (${Number((_n$config$offset$x = (_n$config35 = n.config) === null || _n$config35 === void 0 || (_n$config35 = _n$config35.offset) === null || _n$config35 === void 0 ? void 0 : _n$config35.x) !== null && _n$config$offset$x !== void 0 ? _n$config$offset$x : 0)}, ${Number((_n$config$offset$y = (_n$config36 = n.config) === null || _n$config36 === void 0 || (_n$config36 = _n$config36.offset) === null || _n$config36 === void 0 ? void 0 : _n$config36.y) !== null && _n$config$offset$y !== void 0 ? _n$config$offset$y : 0)})`;
		}
		const sel = ((_n$config37 = n.config) === null || _n$config37 === void 0 || (_n$config37 = _n$config37.target) === null || _n$config37 === void 0 || (_n$config37 = _n$config37.candidates) === null || _n$config37 === void 0 || (_n$config37 = _n$config37[0]) === null || _n$config37 === void 0 ? void 0 : _n$config37.value) || "";
		return sel ? `element ${sel}` : "element";
	}
	if (n.type === STEP_TYPES.EXECUTE_FLOW) return `exec ${((_n$config38 = n.config) === null || _n$config38 === void 0 ? void 0 : _n$config38.flowId) || ""}`;
	return "";
}
function cloneFlow(flow) {
	return JSON.parse(JSON.stringify(flow));
}
//#endregion
//#region entrypoints/popup/components/builder/model/validation.ts
function validateNode(n) {
	const errs = [];
	const c = n.config || {};
	switch (n.type) {
		case STEP_TYPES.CLICK:
		case STEP_TYPES.DBLCLICK:
		case "fill":
			var _c$target;
			if (!!!(c === null || c === void 0 || (_c$target = c.target) === null || _c$target === void 0 || (_c$target = _c$target.candidates) === null || _c$target === void 0 ? void 0 : _c$target.length)) errs.push("缺少目标选择器候选");
			if (n.type === "fill" && (!("value" in c) || c.value === void 0)) errs.push("缺少输入值");
			break;
		case STEP_TYPES.WAIT:
			if (!(c === null || c === void 0 ? void 0 : c.condition)) errs.push("缺少等待条件");
			break;
		case STEP_TYPES.ASSERT:
			if (!(c === null || c === void 0 ? void 0 : c.assert)) errs.push("缺少断言条件");
			break;
		case STEP_TYPES.NAVIGATE:
			if (!(c === null || c === void 0 ? void 0 : c.url)) errs.push("缺少 URL");
			break;
		case STEP_TYPES.HTTP:
			if (!(c === null || c === void 0 ? void 0 : c.url)) errs.push("HTTP: 缺少 URL");
			if ((c === null || c === void 0 ? void 0 : c.assign) && typeof c.assign === "object") {
				const pathRe = /^[A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+|\[\d+\])*$/;
				for (const v of Object.values(c.assign)) {
					const s = String(v);
					if (!pathRe.test(s)) errs.push(`Assign: 路径非法 ${s}`);
				}
			}
			break;
		case STEP_TYPES.HANDLE_DOWNLOAD: break;
		case STEP_TYPES.EXTRACT:
			if (!(c === null || c === void 0 ? void 0 : c.saveAs)) errs.push("Extract: 需填写保存变量名");
			if (!(c === null || c === void 0 ? void 0 : c.selector) && !(c === null || c === void 0 ? void 0 : c.js)) errs.push("Extract: 需提供 selector 或 js");
			break;
		case STEP_TYPES.SWITCH_TAB:
			if (!(c === null || c === void 0 ? void 0 : c.tabId) && !(c === null || c === void 0 ? void 0 : c.urlContains) && !(c === null || c === void 0 ? void 0 : c.titleContains)) errs.push("SwitchTab: 需提供 tabId 或 URL/标题包含");
			break;
		case STEP_TYPES.SCREENSHOT: break;
		case STEP_TYPES.TRIGGER_EVENT:
			var _c$target2;
			if (!!!(c === null || c === void 0 || (_c$target2 = c.target) === null || _c$target2 === void 0 || (_c$target2 = _c$target2.candidates) === null || _c$target2 === void 0 ? void 0 : _c$target2.length)) errs.push("缺少目标选择器候选");
			if (!String((c === null || c === void 0 ? void 0 : c.event) || "").trim()) errs.push("需提供事件类型");
			break;
		case STEP_TYPES.IF: {
			const arr = Array.isArray(c === null || c === void 0 ? void 0 : c.branches) ? c.branches : [];
			if (arr.length === 0) errs.push("需添加至少一个条件分支");
			for (let i = 0; i < arr.length; i++) {
				var _arr$i;
				if (!String(((_arr$i = arr[i]) === null || _arr$i === void 0 ? void 0 : _arr$i.expr) || "").trim()) errs.push(`分支${i + 1}: 需填写条件表达式`);
			}
			break;
		}
		case STEP_TYPES.SET_ATTRIBUTE:
			var _c$target3;
			if (!!!(c === null || c === void 0 || (_c$target3 = c.target) === null || _c$target3 === void 0 || (_c$target3 = _c$target3.candidates) === null || _c$target3 === void 0 ? void 0 : _c$target3.length)) errs.push("缺少目标选择器候选");
			if (!String((c === null || c === void 0 ? void 0 : c.name) || "").trim()) errs.push("需提供属性名");
			break;
		case STEP_TYPES.LOOP_ELEMENTS:
			if (!String((c === null || c === void 0 ? void 0 : c.selector) || "").trim()) errs.push("需提供元素选择器");
			if (!String((c === null || c === void 0 ? void 0 : c.subflowId) || "").trim()) errs.push("需提供子流 ID");
			break;
		case STEP_TYPES.SWITCH_FRAME: break;
		case STEP_TYPES.EXECUTE_FLOW:
			if (!String((c === null || c === void 0 ? void 0 : c.flowId) || "").trim()) errs.push("需选择要执行的工作流");
			break;
		case STEP_TYPES.CLOSE_TAB: break;
		case STEP_TYPES.SCRIPT: {
			const hasAssign = (c === null || c === void 0 ? void 0 : c.assign) && Object.keys(c.assign).length > 0;
			if (((c === null || c === void 0 ? void 0 : c.saveAs) || hasAssign) && !String((c === null || c === void 0 ? void 0 : c.code) || "").trim()) errs.push("Script: 配置了保存/映射但缺少代码");
			if (hasAssign) {
				const pathRe = /^[A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+|\[\d+\])*$/;
				for (const v of Object.values(c.assign || {})) {
					const s = String(v);
					if (!pathRe.test(s)) errs.push(`Assign: 路径非法 ${s}`);
				}
			}
			break;
		}
	}
	return errs;
}
function validateFlow(nodes) {
	const nodeErrors = {};
	let totalErrors = 0;
	for (const n of nodes) {
		const e = validateNode(n);
		if (e.length) {
			nodeErrors[n.id] = e;
			totalErrors += e.length;
		}
	}
	return {
		totalErrors,
		nodeErrors
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@vue-flow+core@1.48.2_vue@3.5.41_typescript@5.9.3_/node_modules/@vue-flow/core/dist/vue-flow-core.mjs
var _excluded = ["eventFilter"];
var _excluded2 = ["eventFilter"];
var _excluded3 = ["id"];
var _excluded4 = [
	"computedPosition",
	"handleBounds",
	"selected",
	"dimensions",
	"isParent",
	"resizing",
	"dragging",
	"events"
];
var _excluded5 = [
	"selected",
	"sourceNode",
	"targetNode",
	"events"
];
function tryOnScopeDispose(fn) {
	if (getCurrentScope()) {
		onScopeDispose(fn);
		return true;
	}
	return false;
}
function toValue(r) {
	return typeof r === "function" ? r() : unref(r);
}
var isClient = typeof window !== "undefined" && typeof document !== "undefined";
var isDef$1 = (val) => typeof val !== "undefined";
var toString = Object.prototype.toString;
var isObject = (val) => toString.call(val) === "[object Object]";
var noop$3 = () => {};
function createFilterWrapper(filter2, fn) {
	function wrapper(...args) {
		return new Promise((resolve, reject) => {
			Promise.resolve(filter2(() => fn.apply(this, args), {
				fn,
				thisArg: this,
				args
			})).then(resolve).catch(reject);
		});
	}
	return wrapper;
}
var bypassFilter = (invoke) => {
	return invoke();
};
function pausableFilter(extendFilter = bypassFilter) {
	const isActive = ref(true);
	function pause() {
		isActive.value = false;
	}
	function resume() {
		isActive.value = true;
	}
	const eventFilter = (...args) => {
		if (isActive.value) extendFilter(...args);
	};
	return {
		isActive: readonly(isActive),
		pause,
		resume,
		eventFilter
	};
}
function promiseTimeout(ms, throwOnTimeout = false, reason = "Timeout") {
	return new Promise((resolve, reject) => {
		if (throwOnTimeout) setTimeout(() => reject(reason), ms);
		else setTimeout(resolve, ms);
	});
}
function watchWithFilter(source, cb, options = {}) {
	const { eventFilter = bypassFilter } = options, watchOptions = _objectWithoutProperties(options, _excluded);
	return watch(source, createFilterWrapper(eventFilter, cb), watchOptions);
}
function watchPausable(source, cb, options = {}) {
	const { eventFilter: filter2 } = options, watchOptions = _objectWithoutProperties(options, _excluded2);
	const { eventFilter, pause, resume, isActive } = pausableFilter(filter2);
	return {
		stop: watchWithFilter(source, cb, _objectSpread2(_objectSpread2({}, watchOptions), {}, { eventFilter })),
		pause,
		resume,
		isActive
	};
}
function toRefs(objectRef, options = {}) {
	if (!isRef(objectRef)) return toRefs$1(objectRef);
	const result = Array.isArray(objectRef.value) ? Array.from({ length: objectRef.value.length }) : {};
	for (const key in objectRef.value) result[key] = customRef(() => ({
		get() {
			return objectRef.value[key];
		},
		set(v) {
			var _a;
			if ((_a = toValue(options.replaceRef)) != null ? _a : true) {
				if (Array.isArray(objectRef.value)) {
					const copy = [...objectRef.value];
					copy[key] = v;
					objectRef.value = copy;
				} else {
					const newObject = _objectSpread2(_objectSpread2({}, objectRef.value), {}, { [key]: v });
					Object.setPrototypeOf(newObject, Object.getPrototypeOf(objectRef.value));
					objectRef.value = newObject;
				}
			} else objectRef.value[key] = v;
		}
	}));
	return result;
}
function createUntil(r, isNot = false) {
	function toMatch(condition, { flush = "sync", deep = false, timeout: timeout2, throwOnTimeout } = {}) {
		let stop = null;
		const promises = [new Promise((resolve) => {
			stop = watch(r, (v) => {
				if (condition(v) !== isNot) {
					stop == null || stop();
					resolve(v);
				}
			}, {
				flush,
				deep,
				immediate: true
			});
		})];
		if (timeout2 != null) promises.push(promiseTimeout(timeout2, throwOnTimeout).then(() => toValue(r)).finally(() => stop == null ? void 0 : stop()));
		return Promise.race(promises);
	}
	function toBe(value, options) {
		if (!isRef(value)) return toMatch((v) => v === value, options);
		const { flush = "sync", deep = false, timeout: timeout2, throwOnTimeout } = options != null ? options : {};
		let stop = null;
		const promises = [new Promise((resolve) => {
			stop = watch([r, value], ([v1, v2]) => {
				if (isNot !== (v1 === v2)) {
					stop == null || stop();
					resolve(v1);
				}
			}, {
				flush,
				deep,
				immediate: true
			});
		})];
		if (timeout2 != null) promises.push(promiseTimeout(timeout2, throwOnTimeout).then(() => toValue(r)).finally(() => {
			stop == null || stop();
			return toValue(r);
		}));
		return Promise.race(promises);
	}
	function toBeTruthy(options) {
		return toMatch((v) => Boolean(v), options);
	}
	function toBeNull(options) {
		return toBe(null, options);
	}
	function toBeUndefined(options) {
		return toBe(void 0, options);
	}
	function toBeNaN(options) {
		return toMatch(Number.isNaN, options);
	}
	function toContains(value, options) {
		return toMatch((v) => {
			const array2 = Array.from(v);
			return array2.includes(value) || array2.includes(toValue(value));
		}, options);
	}
	function changed(options) {
		return changedTimes(1, options);
	}
	function changedTimes(n = 1, options) {
		let count = -1;
		return toMatch(() => {
			count += 1;
			return count >= n;
		}, options);
	}
	if (Array.isArray(toValue(r))) return {
		toMatch,
		toContains,
		changed,
		changedTimes,
		get not() {
			return createUntil(r, !isNot);
		}
	};
	else return {
		toMatch,
		toBe,
		toBeTruthy,
		toBeNull,
		toBeNaN,
		toBeUndefined,
		changed,
		changedTimes,
		get not() {
			return createUntil(r, !isNot);
		}
	};
}
function until(r) {
	return createUntil(r);
}
function unrefElement(elRef) {
	var _a;
	const plain = toValue(elRef);
	return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
}
var defaultWindow = isClient ? window : void 0;
function useEventListener(...args) {
	let target;
	let events;
	let listeners;
	let options;
	if (typeof args[0] === "string" || Array.isArray(args[0])) {
		[events, listeners, options] = args;
		target = defaultWindow;
	} else [target, events, listeners, options] = args;
	if (!target) return noop$3;
	if (!Array.isArray(events)) events = [events];
	if (!Array.isArray(listeners)) listeners = [listeners];
	const cleanups = [];
	const cleanup = () => {
		cleanups.forEach((fn) => fn());
		cleanups.length = 0;
	};
	const register = (el, event, listener, options2) => {
		el.addEventListener(event, listener, options2);
		return () => el.removeEventListener(event, listener, options2);
	};
	const stopWatch = watch(() => [unrefElement(target), toValue(options)], ([el, options2]) => {
		cleanup();
		if (!el) return;
		const optionsClone = isObject(options2) ? _objectSpread2({}, options2) : options2;
		cleanups.push(...events.flatMap((event) => {
			return listeners.map((listener) => register(el, event, listener, optionsClone));
		}));
	}, {
		immediate: true,
		flush: "post"
	});
	const stop = () => {
		stopWatch();
		cleanup();
	};
	tryOnScopeDispose(stop);
	return stop;
}
function createKeyPredicate$1(keyFilter) {
	if (typeof keyFilter === "function") return keyFilter;
	else if (typeof keyFilter === "string") return (event) => event.key === keyFilter;
	else if (Array.isArray(keyFilter)) return (event) => keyFilter.includes(event.key);
	return () => true;
}
function onKeyStroke(...args) {
	let key;
	let handler;
	let options = {};
	if (args.length === 3) {
		key = args[0];
		handler = args[1];
		options = args[2];
	} else if (args.length === 2) {
		if (typeof args[1] === "object") {
			key = true;
			handler = args[0];
			options = args[1];
		} else {
			key = args[0];
			handler = args[1];
		}
	} else {
		key = true;
		handler = args[0];
	}
	const { target = defaultWindow, eventName = "keydown", passive = false, dedupe = false } = options;
	const predicate = createKeyPredicate$1(key);
	const listener = (e) => {
		if (e.repeat && toValue(dedupe)) return;
		if (predicate(e)) handler(e);
	};
	return useEventListener(target, eventName, listener, passive);
}
function cloneFnJSON(source) {
	return JSON.parse(JSON.stringify(source));
}
function useVModel(props, key, emit, options = {}) {
	var _a, _b, _c;
	const { clone = false, passive = false, eventName, deep = false, defaultValue, shouldEmit } = options;
	const vm = getCurrentInstance();
	const _emit = emit || (vm == null ? void 0 : vm.emit) || ((_a = vm == null ? void 0 : vm.$emit) == null ? void 0 : _a.bind(vm)) || ((_c = (_b = vm == null ? void 0 : vm.proxy) == null ? void 0 : _b.$emit) == null ? void 0 : _c.bind(vm == null ? void 0 : vm.proxy));
	let event = eventName;
	if (!key) key = "modelValue";
	event = event || `update:${key.toString()}`;
	const cloneFn = (val) => !clone ? val : typeof clone === "function" ? clone(val) : cloneFnJSON(val);
	const getValue = () => isDef$1(props[key]) ? cloneFn(props[key]) : defaultValue;
	const triggerEmit = (value) => {
		if (shouldEmit) {
			if (shouldEmit(value)) _emit(event, value);
		} else _emit(event, value);
	};
	if (passive) {
		const initialValue = getValue();
		const proxy = ref(initialValue);
		let isUpdating = false;
		watch(() => props[key], (v) => {
			if (!isUpdating) {
				isUpdating = true;
				proxy.value = cloneFn(v);
				nextTick(() => isUpdating = false);
			}
		});
		watch(proxy, (v) => {
			if (!isUpdating && (v !== props[key] || deep)) triggerEmit(v);
		}, { deep });
		return proxy;
	} else return computed({
		get() {
			return getValue();
		},
		set(value) {
			triggerEmit(value);
		}
	});
}
var noop$2 = { value: () => {} };
function dispatch() {
	for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
		if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
		_[t] = [];
	}
	return new Dispatch(_);
}
function Dispatch(_) {
	this._ = _;
}
function parseTypenames$1(typenames, types) {
	return typenames.trim().split(/^|\s+/).map(function(t) {
		var name = "", i = t.indexOf(".");
		if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
		if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
		return {
			type: t,
			name
		};
	});
}
Dispatch.prototype = dispatch.prototype = {
	constructor: Dispatch,
	on: function(typename, callback) {
		var _ = this._, T = parseTypenames$1(typename + "", _), t, i = -1, n = T.length;
		if (arguments.length < 2) {
			while (++i < n) if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
			return;
		}
		if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
		while (++i < n) if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
		else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
		return this;
	},
	copy: function() {
		var copy = {}, _ = this._;
		for (var t in _) copy[t] = _[t].slice();
		return new Dispatch(copy);
	},
	call: function(type, that) {
		if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
		if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
		for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	},
	apply: function(type, that, args) {
		if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
		for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	}
};
function get$1(type, name) {
	for (var i = 0, n = type.length, c; i < n; ++i) if ((c = type[i]).name === name) return c.value;
}
function set$1(type, name, callback) {
	for (var i = 0, n = type.length; i < n; ++i) if (type[i].name === name) {
		type[i] = noop$2, type = type.slice(0, i).concat(type.slice(i + 1));
		break;
	}
	if (callback != null) type.push({
		name,
		value: callback
	});
	return type;
}
var xhtml = "http://www.w3.org/1999/xhtml";
var namespaces = {
	svg: "http://www.w3.org/2000/svg",
	xhtml,
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
function namespace(name) {
	var prefix = name += "", i = prefix.indexOf(":");
	if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
	return namespaces.hasOwnProperty(prefix) ? {
		space: namespaces[prefix],
		local: name
	} : name;
}
function creatorInherit(name) {
	return function() {
		var document2 = this.ownerDocument, uri = this.namespaceURI;
		return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name) : document2.createElementNS(uri, name);
	};
}
function creatorFixed(fullname) {
	return function() {
		return this.ownerDocument.createElementNS(fullname.space, fullname.local);
	};
}
function creator(name) {
	var fullname = namespace(name);
	return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}
function none() {}
function selector(selector2) {
	return selector2 == null ? none : function() {
		return this.querySelector(selector2);
	};
}
function selection_select(select2) {
	if (typeof select2 !== "function") select2 = selector(select2);
	for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) if ((node = group[i]) && (subnode = select2.call(node, node.__data__, i, group))) {
		if ("__data__" in node) subnode.__data__ = node.__data__;
		subgroup[i] = subnode;
	}
	return new Selection$1(subgroups, this._parents);
}
function array(x) {
	return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
}
function empty() {
	return [];
}
function selectorAll(selector2) {
	return selector2 == null ? empty : function() {
		return this.querySelectorAll(selector2);
	};
}
function arrayAll(select2) {
	return function() {
		return array(select2.apply(this, arguments));
	};
}
function selection_selectAll(select2) {
	if (typeof select2 === "function") select2 = arrayAll(select2);
	else select2 = selectorAll(select2);
	for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) if (node = group[i]) {
		subgroups.push(select2.call(node, node.__data__, i, group));
		parents.push(node);
	}
	return new Selection$1(subgroups, parents);
}
function matcher(selector2) {
	return function() {
		return this.matches(selector2);
	};
}
function childMatcher(selector2) {
	return function(node) {
		return node.matches(selector2);
	};
}
var find = Array.prototype.find;
function childFind(match) {
	return function() {
		return find.call(this.children, match);
	};
}
function childFirst() {
	return this.firstElementChild;
}
function selection_selectChild(match) {
	return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
}
var filter = Array.prototype.filter;
function children() {
	return Array.from(this.children);
}
function childrenFilter(match) {
	return function() {
		return filter.call(this.children, match);
	};
}
function selection_selectChildren(match) {
	return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}
function selection_filter(match) {
	if (typeof match !== "function") match = matcher(match);
	for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) if ((node = group[i]) && match.call(node, node.__data__, i, group)) subgroup.push(node);
	return new Selection$1(subgroups, this._parents);
}
function sparse(update) {
	return new Array(update.length);
}
function selection_enter() {
	return new Selection$1(this._enter || this._groups.map(sparse), this._parents);
}
function EnterNode(parent, datum2) {
	this.ownerDocument = parent.ownerDocument;
	this.namespaceURI = parent.namespaceURI;
	this._next = null;
	this._parent = parent;
	this.__data__ = datum2;
}
EnterNode.prototype = {
	constructor: EnterNode,
	appendChild: function(child) {
		return this._parent.insertBefore(child, this._next);
	},
	insertBefore: function(child, next) {
		return this._parent.insertBefore(child, next);
	},
	querySelector: function(selector2) {
		return this._parent.querySelector(selector2);
	},
	querySelectorAll: function(selector2) {
		return this._parent.querySelectorAll(selector2);
	}
};
function constant$3(x) {
	return function() {
		return x;
	};
}
function bindIndex(parent, group, enter, update, exit, data) {
	var i = 0, node, groupLength = group.length, dataLength = data.length;
	for (; i < dataLength; ++i) if (node = group[i]) {
		node.__data__ = data[i];
		update[i] = node;
	} else enter[i] = new EnterNode(parent, data[i]);
	for (; i < groupLength; ++i) if (node = group[i]) exit[i] = node;
}
function bindKey(parent, group, enter, update, exit, data, key) {
	var i, node, nodeByKeyValue = /* @__PURE__ */ new Map(), groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
	for (i = 0; i < groupLength; ++i) if (node = group[i]) {
		keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
		if (nodeByKeyValue.has(keyValue)) exit[i] = node;
		else nodeByKeyValue.set(keyValue, node);
	}
	for (i = 0; i < dataLength; ++i) {
		keyValue = key.call(parent, data[i], i, data) + "";
		if (node = nodeByKeyValue.get(keyValue)) {
			update[i] = node;
			node.__data__ = data[i];
			nodeByKeyValue.delete(keyValue);
		} else enter[i] = new EnterNode(parent, data[i]);
	}
	for (i = 0; i < groupLength; ++i) if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) exit[i] = node;
}
function datum(node) {
	return node.__data__;
}
function selection_data(value, key) {
	if (!arguments.length) return Array.from(this, datum);
	var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
	if (typeof value !== "function") value = constant$3(value);
	for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
		var parent = parents[j], group = groups[j], groupLength = group.length, data = arraylike(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength);
		bind(parent, group, enterGroup, updateGroup, exit[j] = new Array(groupLength), data, key);
		for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) if (previous = enterGroup[i0]) {
			if (i0 >= i1) i1 = i0 + 1;
			while (!(next = updateGroup[i1]) && ++i1 < dataLength);
			previous._next = next || null;
		}
	}
	update = new Selection$1(update, parents);
	update._enter = enter;
	update._exit = exit;
	return update;
}
function arraylike(data) {
	return typeof data === "object" && "length" in data ? data : Array.from(data);
}
function selection_exit() {
	return new Selection$1(this._exit || this._groups.map(sparse), this._parents);
}
function selection_join(onenter, onupdate, onexit) {
	var enter = this.enter(), update = this, exit = this.exit();
	if (typeof onenter === "function") {
		enter = onenter(enter);
		if (enter) enter = enter.selection();
	} else enter = enter.append(onenter + "");
	if (onupdate != null) {
		update = onupdate(update);
		if (update) update = update.selection();
	}
	if (onexit == null) exit.remove();
	else onexit(exit);
	return enter && update ? enter.merge(update).order() : update;
}
function selection_merge(context) {
	var selection2 = context.selection ? context.selection() : context;
	for (var groups0 = this._groups, groups1 = selection2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) if (node = group0[i] || group1[i]) merge[i] = node;
	for (; j < m0; ++j) merges[j] = groups0[j];
	return new Selection$1(merges, this._parents);
}
function selection_order() {
	for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) if (node = group[i]) {
		if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
		next = node;
	}
	return this;
}
function selection_sort(compare) {
	if (!compare) compare = ascending;
	function compareNode(a, b) {
		return a && b ? compare(a.__data__, b.__data__) : !a - !b;
	}
	for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
		for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) if (node = group[i]) sortgroup[i] = node;
		sortgroup.sort(compareNode);
	}
	return new Selection$1(sortgroups, this._parents).order();
}
function ascending(a, b) {
	return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
function selection_call() {
	var callback = arguments[0];
	arguments[0] = this;
	callback.apply(null, arguments);
	return this;
}
function selection_nodes() {
	return Array.from(this);
}
function selection_node() {
	for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
		var node = group[i];
		if (node) return node;
	}
	return null;
}
function selection_size() {
	let size = 0;
	for (const node of this) ++size;
	return size;
}
function selection_empty() {
	return !this.node();
}
function selection_each(callback) {
	for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) if (node = group[i]) callback.call(node, node.__data__, i, group);
	return this;
}
function attrRemove$1(name) {
	return function() {
		this.removeAttribute(name);
	};
}
function attrRemoveNS$1(fullname) {
	return function() {
		this.removeAttributeNS(fullname.space, fullname.local);
	};
}
function attrConstant$1(name, value) {
	return function() {
		this.setAttribute(name, value);
	};
}
function attrConstantNS$1(fullname, value) {
	return function() {
		this.setAttributeNS(fullname.space, fullname.local, value);
	};
}
function attrFunction$1(name, value) {
	return function() {
		var v = value.apply(this, arguments);
		if (v == null) this.removeAttribute(name);
		else this.setAttribute(name, v);
	};
}
function attrFunctionNS$1(fullname, value) {
	return function() {
		var v = value.apply(this, arguments);
		if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
		else this.setAttributeNS(fullname.space, fullname.local, v);
	};
}
function selection_attr(name, value) {
	var fullname = namespace(name);
	if (arguments.length < 2) {
		var node = this.node();
		return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
	}
	return this.each((value == null ? fullname.local ? attrRemoveNS$1 : attrRemove$1 : typeof value === "function" ? fullname.local ? attrFunctionNS$1 : attrFunction$1 : fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, value));
}
function defaultView(node) {
	return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
}
function styleRemove$1(name) {
	return function() {
		this.style.removeProperty(name);
	};
}
function styleConstant$1(name, value, priority) {
	return function() {
		this.style.setProperty(name, value, priority);
	};
}
function styleFunction$1(name, value, priority) {
	return function() {
		var v = value.apply(this, arguments);
		if (v == null) this.style.removeProperty(name);
		else this.style.setProperty(name, v, priority);
	};
}
function selection_style(name, value, priority) {
	return arguments.length > 1 ? this.each((value == null ? styleRemove$1 : typeof value === "function" ? styleFunction$1 : styleConstant$1)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}
function styleValue(node, name) {
	return node.style.getPropertyValue(name) || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}
function propertyRemove(name) {
	return function() {
		delete this[name];
	};
}
function propertyConstant(name, value) {
	return function() {
		this[name] = value;
	};
}
function propertyFunction(name, value) {
	return function() {
		var v = value.apply(this, arguments);
		if (v == null) delete this[name];
		else this[name] = v;
	};
}
function selection_property(name, value) {
	return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}
function classArray(string) {
	return string.trim().split(/^|\s+/);
}
function classList(node) {
	return node.classList || new ClassList(node);
}
function ClassList(node) {
	this._node = node;
	this._names = classArray(node.getAttribute("class") || "");
}
ClassList.prototype = {
	add: function(name) {
		if (this._names.indexOf(name) < 0) {
			this._names.push(name);
			this._node.setAttribute("class", this._names.join(" "));
		}
	},
	remove: function(name) {
		var i = this._names.indexOf(name);
		if (i >= 0) {
			this._names.splice(i, 1);
			this._node.setAttribute("class", this._names.join(" "));
		}
	},
	contains: function(name) {
		return this._names.indexOf(name) >= 0;
	}
};
function classedAdd(node, names) {
	var list = classList(node), i = -1, n = names.length;
	while (++i < n) list.add(names[i]);
}
function classedRemove(node, names) {
	var list = classList(node), i = -1, n = names.length;
	while (++i < n) list.remove(names[i]);
}
function classedTrue(names) {
	return function() {
		classedAdd(this, names);
	};
}
function classedFalse(names) {
	return function() {
		classedRemove(this, names);
	};
}
function classedFunction(names, value) {
	return function() {
		(value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
	};
}
function selection_classed(name, value) {
	var names = classArray(name + "");
	if (arguments.length < 2) {
		var list = classList(this.node()), i = -1, n = names.length;
		while (++i < n) if (!list.contains(names[i])) return false;
		return true;
	}
	return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}
function textRemove() {
	this.textContent = "";
}
function textConstant$1(value) {
	return function() {
		this.textContent = value;
	};
}
function textFunction$1(value) {
	return function() {
		var v = value.apply(this, arguments);
		this.textContent = v == null ? "" : v;
	};
}
function selection_text(value) {
	return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction$1 : textConstant$1)(value)) : this.node().textContent;
}
function htmlRemove() {
	this.innerHTML = "";
}
function htmlConstant(value) {
	return function() {
		this.innerHTML = value;
	};
}
function htmlFunction(value) {
	return function() {
		var v = value.apply(this, arguments);
		this.innerHTML = v == null ? "" : v;
	};
}
function selection_html(value) {
	return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}
function raise() {
	if (this.nextSibling) this.parentNode.appendChild(this);
}
function selection_raise() {
	return this.each(raise);
}
function lower() {
	if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function selection_lower() {
	return this.each(lower);
}
function selection_append(name) {
	var create2 = typeof name === "function" ? name : creator(name);
	return this.select(function() {
		return this.appendChild(create2.apply(this, arguments));
	});
}
function constantNull() {
	return null;
}
function selection_insert(name, before) {
	var create2 = typeof name === "function" ? name : creator(name), select2 = before == null ? constantNull : typeof before === "function" ? before : selector(before);
	return this.select(function() {
		return this.insertBefore(create2.apply(this, arguments), select2.apply(this, arguments) || null);
	});
}
function remove() {
	var parent = this.parentNode;
	if (parent) parent.removeChild(this);
}
function selection_remove() {
	return this.each(remove);
}
function selection_cloneShallow() {
	var clone = this.cloneNode(false), parent = this.parentNode;
	return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_cloneDeep() {
	var clone = this.cloneNode(true), parent = this.parentNode;
	return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_clone(deep) {
	return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}
function selection_datum(value) {
	return arguments.length ? this.property("__data__", value) : this.node().__data__;
}
function contextListener(listener) {
	return function(event) {
		listener.call(this, event, this.__data__);
	};
}
function parseTypenames(typenames) {
	return typenames.trim().split(/^|\s+/).map(function(t) {
		var name = "", i = t.indexOf(".");
		if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
		return {
			type: t,
			name
		};
	});
}
function onRemove(typename) {
	return function() {
		var on = this.__on;
		if (!on) return;
		for (var j = 0, i = -1, m = on.length, o; j < m; ++j) if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) this.removeEventListener(o.type, o.listener, o.options);
		else on[++i] = o;
		if (++i) on.length = i;
		else delete this.__on;
	};
}
function onAdd(typename, value, options) {
	return function() {
		var on = this.__on, o, listener = contextListener(value);
		if (on) {
			for (var j = 0, m = on.length; j < m; ++j) if ((o = on[j]).type === typename.type && o.name === typename.name) {
				this.removeEventListener(o.type, o.listener, o.options);
				this.addEventListener(o.type, o.listener = listener, o.options = options);
				o.value = value;
				return;
			}
		}
		this.addEventListener(typename.type, listener, options);
		o = {
			type: typename.type,
			name: typename.name,
			value,
			listener,
			options
		};
		if (!on) this.__on = [o];
		else on.push(o);
	};
}
function selection_on(typename, value, options) {
	var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;
	if (arguments.length < 2) {
		var on = this.node().__on;
		if (on) {
			for (var j = 0, m = on.length, o; j < m; ++j) for (i = 0, o = on[j]; i < n; ++i) if ((t = typenames[i]).type === o.type && t.name === o.name) return o.value;
		}
		return;
	}
	on = value ? onAdd : onRemove;
	for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
	return this;
}
function dispatchEvent(node, type, params) {
	var window2 = defaultView(node), event = window2.CustomEvent;
	if (typeof event === "function") event = new event(type, params);
	else {
		event = window2.document.createEvent("Event");
		if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
		else event.initEvent(type, false, false);
	}
	node.dispatchEvent(event);
}
function dispatchConstant(type, params) {
	return function() {
		return dispatchEvent(this, type, params);
	};
}
function dispatchFunction(type, params) {
	return function() {
		return dispatchEvent(this, type, params.apply(this, arguments));
	};
}
function selection_dispatch(type, params) {
	return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
}
function* selection_iterator() {
	for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) if (node = group[i]) yield node;
}
var root = [null];
function Selection$1(groups, parents) {
	this._groups = groups;
	this._parents = parents;
}
function selection() {
	return new Selection$1([[document.documentElement]], root);
}
function selection_selection() {
	return this;
}
Selection$1.prototype = selection.prototype = {
	constructor: Selection$1,
	select: selection_select,
	selectAll: selection_selectAll,
	selectChild: selection_selectChild,
	selectChildren: selection_selectChildren,
	filter: selection_filter,
	data: selection_data,
	enter: selection_enter,
	exit: selection_exit,
	join: selection_join,
	merge: selection_merge,
	selection: selection_selection,
	order: selection_order,
	sort: selection_sort,
	call: selection_call,
	nodes: selection_nodes,
	node: selection_node,
	size: selection_size,
	empty: selection_empty,
	each: selection_each,
	attr: selection_attr,
	style: selection_style,
	property: selection_property,
	classed: selection_classed,
	text: selection_text,
	html: selection_html,
	raise: selection_raise,
	lower: selection_lower,
	append: selection_append,
	insert: selection_insert,
	remove: selection_remove,
	clone: selection_clone,
	datum: selection_datum,
	on: selection_on,
	dispatch: selection_dispatch,
	[Symbol.iterator]: selection_iterator
};
function select(selector2) {
	return typeof selector2 === "string" ? new Selection$1([[document.querySelector(selector2)]], [document.documentElement]) : new Selection$1([[selector2]], root);
}
function sourceEvent(event) {
	let sourceEvent2;
	while (sourceEvent2 = event.sourceEvent) event = sourceEvent2;
	return event;
}
function pointer(event, node) {
	event = sourceEvent(event);
	if (node === void 0) node = event.currentTarget;
	if (node) {
		var svg = node.ownerSVGElement || node;
		if (svg.createSVGPoint) {
			var point = svg.createSVGPoint();
			point.x = event.clientX, point.y = event.clientY;
			point = point.matrixTransform(node.getScreenCTM().inverse());
			return [point.x, point.y];
		}
		if (node.getBoundingClientRect) {
			var rect = node.getBoundingClientRect();
			return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
		}
	}
	return [event.pageX, event.pageY];
}
var nonpassive = { passive: false };
var nonpassivecapture = {
	capture: true,
	passive: false
};
function nopropagation$1(event) {
	event.stopImmediatePropagation();
}
function noevent$1(event) {
	event.preventDefault();
	event.stopImmediatePropagation();
}
function dragDisable(view) {
	var root2 = view.document.documentElement, selection2 = select(view).on("dragstart.drag", noevent$1, nonpassivecapture);
	if ("onselectstart" in root2) selection2.on("selectstart.drag", noevent$1, nonpassivecapture);
	else {
		root2.__noselect = root2.style.MozUserSelect;
		root2.style.MozUserSelect = "none";
	}
}
function yesdrag(view, noclick) {
	var root2 = view.document.documentElement, selection2 = select(view).on("dragstart.drag", null);
	if (noclick) {
		selection2.on("click.drag", noevent$1, nonpassivecapture);
		setTimeout(function() {
			selection2.on("click.drag", null);
		}, 0);
	}
	if ("onselectstart" in root2) selection2.on("selectstart.drag", null);
	else {
		root2.style.MozUserSelect = root2.__noselect;
		delete root2.__noselect;
	}
}
var constant$2 = (x) => () => x;
function DragEvent(type, { sourceEvent: sourceEvent2, subject, target, identifier, active, x, y, dx, dy, dispatch: dispatch2 }) {
	Object.defineProperties(this, {
		type: {
			value: type,
			enumerable: true,
			configurable: true
		},
		sourceEvent: {
			value: sourceEvent2,
			enumerable: true,
			configurable: true
		},
		subject: {
			value: subject,
			enumerable: true,
			configurable: true
		},
		target: {
			value: target,
			enumerable: true,
			configurable: true
		},
		identifier: {
			value: identifier,
			enumerable: true,
			configurable: true
		},
		active: {
			value: active,
			enumerable: true,
			configurable: true
		},
		x: {
			value: x,
			enumerable: true,
			configurable: true
		},
		y: {
			value: y,
			enumerable: true,
			configurable: true
		},
		dx: {
			value: dx,
			enumerable: true,
			configurable: true
		},
		dy: {
			value: dy,
			enumerable: true,
			configurable: true
		},
		_: { value: dispatch2 }
	});
}
DragEvent.prototype.on = function() {
	var value = this._.on.apply(this._, arguments);
	return value === this._ ? this : value;
};
function defaultFilter$1(event) {
	return !event.ctrlKey && !event.button;
}
function defaultContainer() {
	return this.parentNode;
}
function defaultSubject(event, d) {
	return d == null ? {
		x: event.x,
		y: event.y
	} : d;
}
function defaultTouchable$1() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function drag() {
	var filter2 = defaultFilter$1, container = defaultContainer, subject = defaultSubject, touchable = defaultTouchable$1, gestures = {}, listeners = dispatch("start", "drag", "end"), active = 0, mousedownx, mousedowny, mousemoving, touchending, clickDistance2 = 0;
	function drag2(selection2) {
		selection2.on("mousedown.drag", mousedowned).filter(touchable).on("touchstart.drag", touchstarted).on("touchmove.drag", touchmoved, nonpassive).on("touchend.drag touchcancel.drag", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	function mousedowned(event, d) {
		if (touchending || !filter2.call(this, event, d)) return;
		var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
		if (!gesture) return;
		select(event.view).on("mousemove.drag", mousemoved, nonpassivecapture).on("mouseup.drag", mouseupped, nonpassivecapture);
		dragDisable(event.view);
		nopropagation$1(event);
		mousemoving = false;
		mousedownx = event.clientX;
		mousedowny = event.clientY;
		gesture("start", event);
	}
	function mousemoved(event) {
		noevent$1(event);
		if (!mousemoving) {
			var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
			mousemoving = dx * dx + dy * dy > clickDistance2;
		}
		gestures.mouse("drag", event);
	}
	function mouseupped(event) {
		select(event.view).on("mousemove.drag mouseup.drag", null);
		yesdrag(event.view, mousemoving);
		noevent$1(event);
		gestures.mouse("end", event);
	}
	function touchstarted(event, d) {
		if (!filter2.call(this, event, d)) return;
		var touches = event.changedTouches, c = container.call(this, event, d), n = touches.length, i, gesture;
		for (i = 0; i < n; ++i) if (gesture = beforestart(this, c, event, d, touches[i].identifier, touches[i])) {
			nopropagation$1(event);
			gesture("start", event, touches[i]);
		}
	}
	function touchmoved(event) {
		var touches = event.changedTouches, n = touches.length, i, gesture;
		for (i = 0; i < n; ++i) if (gesture = gestures[touches[i].identifier]) {
			noevent$1(event);
			gesture("drag", event, touches[i]);
		}
	}
	function touchended(event) {
		var touches = event.changedTouches, n = touches.length, i, gesture;
		if (touchending) clearTimeout(touchending);
		touchending = setTimeout(function() {
			touchending = null;
		}, 500);
		for (i = 0; i < n; ++i) if (gesture = gestures[touches[i].identifier]) {
			nopropagation$1(event);
			gesture("end", event, touches[i]);
		}
	}
	function beforestart(that, container2, event, d, identifier, touch) {
		var dispatch2 = listeners.copy(), p = pointer(touch || event, container2), dx, dy, s;
		if ((s = subject.call(that, new DragEvent("beforestart", {
			sourceEvent: event,
			target: drag2,
			identifier,
			active,
			x: p[0],
			y: p[1],
			dx: 0,
			dy: 0,
			dispatch: dispatch2
		}), d)) == null) return;
		dx = s.x - p[0] || 0;
		dy = s.y - p[1] || 0;
		return function gesture(type, event2, touch2) {
			var p0 = p, n;
			switch (type) {
				case "start":
					gestures[identifier] = gesture, n = active++;
					break;
				case "end": delete gestures[identifier], --active;
				case "drag": p = pointer(touch2 || event2, container2), n = active;
			}
			dispatch2.call(type, that, new DragEvent(type, {
				sourceEvent: event2,
				subject: s,
				target: drag2,
				identifier,
				active: n,
				x: p[0] + dx,
				y: p[1] + dy,
				dx: p[0] - p0[0],
				dy: p[1] - p0[1],
				dispatch: dispatch2
			}), d);
		};
	}
	drag2.filter = function(_) {
		return arguments.length ? (filter2 = typeof _ === "function" ? _ : constant$2(!!_), drag2) : filter2;
	};
	drag2.container = function(_) {
		return arguments.length ? (container = typeof _ === "function" ? _ : constant$2(_), drag2) : container;
	};
	drag2.subject = function(_) {
		return arguments.length ? (subject = typeof _ === "function" ? _ : constant$2(_), drag2) : subject;
	};
	drag2.touchable = function(_) {
		return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$2(!!_), drag2) : touchable;
	};
	drag2.on = function() {
		var value = listeners.on.apply(listeners, arguments);
		return value === listeners ? drag2 : value;
	};
	drag2.clickDistance = function(_) {
		return arguments.length ? (clickDistance2 = (_ = +_) * _, drag2) : Math.sqrt(clickDistance2);
	};
	return drag2;
}
function define(constructor, factory, prototype) {
	constructor.prototype = factory.prototype = prototype;
	prototype.constructor = constructor;
}
function extend(parent, definition) {
	var prototype = Object.create(parent.prototype);
	for (var key in definition) prototype[key] = definition[key];
	return prototype;
}
function Color() {}
var darker = .7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*";
var reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*";
var reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
var reHex = /^#([0-9a-f]{3,8})$/;
var reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`);
var reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`);
var reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`);
var reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`);
var reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`);
var reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);
var named = {
	aliceblue: 15792383,
	antiquewhite: 16444375,
	aqua: 65535,
	aquamarine: 8388564,
	azure: 15794175,
	beige: 16119260,
	bisque: 16770244,
	black: 0,
	blanchedalmond: 16772045,
	blue: 255,
	blueviolet: 9055202,
	brown: 10824234,
	burlywood: 14596231,
	cadetblue: 6266528,
	chartreuse: 8388352,
	chocolate: 13789470,
	coral: 16744272,
	cornflowerblue: 6591981,
	cornsilk: 16775388,
	crimson: 14423100,
	cyan: 65535,
	darkblue: 139,
	darkcyan: 35723,
	darkgoldenrod: 12092939,
	darkgray: 11119017,
	darkgreen: 25600,
	darkgrey: 11119017,
	darkkhaki: 12433259,
	darkmagenta: 9109643,
	darkolivegreen: 5597999,
	darkorange: 16747520,
	darkorchid: 10040012,
	darkred: 9109504,
	darksalmon: 15308410,
	darkseagreen: 9419919,
	darkslateblue: 4734347,
	darkslategray: 3100495,
	darkslategrey: 3100495,
	darkturquoise: 52945,
	darkviolet: 9699539,
	deeppink: 16716947,
	deepskyblue: 49151,
	dimgray: 6908265,
	dimgrey: 6908265,
	dodgerblue: 2003199,
	firebrick: 11674146,
	floralwhite: 16775920,
	forestgreen: 2263842,
	fuchsia: 16711935,
	gainsboro: 14474460,
	ghostwhite: 16316671,
	gold: 16766720,
	goldenrod: 14329120,
	gray: 8421504,
	green: 32768,
	greenyellow: 11403055,
	grey: 8421504,
	honeydew: 15794160,
	hotpink: 16738740,
	indianred: 13458524,
	indigo: 4915330,
	ivory: 16777200,
	khaki: 15787660,
	lavender: 15132410,
	lavenderblush: 16773365,
	lawngreen: 8190976,
	lemonchiffon: 16775885,
	lightblue: 11393254,
	lightcoral: 15761536,
	lightcyan: 14745599,
	lightgoldenrodyellow: 16448210,
	lightgray: 13882323,
	lightgreen: 9498256,
	lightgrey: 13882323,
	lightpink: 16758465,
	lightsalmon: 16752762,
	lightseagreen: 2142890,
	lightskyblue: 8900346,
	lightslategray: 7833753,
	lightslategrey: 7833753,
	lightsteelblue: 11584734,
	lightyellow: 16777184,
	lime: 65280,
	limegreen: 3329330,
	linen: 16445670,
	magenta: 16711935,
	maroon: 8388608,
	mediumaquamarine: 6737322,
	mediumblue: 205,
	mediumorchid: 12211667,
	mediumpurple: 9662683,
	mediumseagreen: 3978097,
	mediumslateblue: 8087790,
	mediumspringgreen: 64154,
	mediumturquoise: 4772300,
	mediumvioletred: 13047173,
	midnightblue: 1644912,
	mintcream: 16121850,
	mistyrose: 16770273,
	moccasin: 16770229,
	navajowhite: 16768685,
	navy: 128,
	oldlace: 16643558,
	olive: 8421376,
	olivedrab: 7048739,
	orange: 16753920,
	orangered: 16729344,
	orchid: 14315734,
	palegoldenrod: 15657130,
	palegreen: 10025880,
	paleturquoise: 11529966,
	palevioletred: 14381203,
	papayawhip: 16773077,
	peachpuff: 16767673,
	peru: 13468991,
	pink: 16761035,
	plum: 14524637,
	powderblue: 11591910,
	purple: 8388736,
	rebeccapurple: 6697881,
	red: 16711680,
	rosybrown: 12357519,
	royalblue: 4286945,
	saddlebrown: 9127187,
	salmon: 16416882,
	sandybrown: 16032864,
	seagreen: 3050327,
	seashell: 16774638,
	sienna: 10506797,
	silver: 12632256,
	skyblue: 8900331,
	slateblue: 6970061,
	slategray: 7372944,
	slategrey: 7372944,
	snow: 16775930,
	springgreen: 65407,
	steelblue: 4620980,
	tan: 13808780,
	teal: 32896,
	thistle: 14204888,
	tomato: 16737095,
	turquoise: 4251856,
	violet: 15631086,
	wheat: 16113331,
	white: 16777215,
	whitesmoke: 16119285,
	yellow: 16776960,
	yellowgreen: 10145074
};
define(Color, color, {
	copy(channels) {
		return Object.assign(new this.constructor(), this, channels);
	},
	displayable() {
		return this.rgb().displayable();
	},
	hex: color_formatHex,
	formatHex: color_formatHex,
	formatHex8: color_formatHex8,
	formatHsl: color_formatHsl,
	formatRgb: color_formatRgb,
	toString: color_formatRgb
});
function color_formatHex() {
	return this.rgb().formatHex();
}
function color_formatHex8() {
	return this.rgb().formatHex8();
}
function color_formatHsl() {
	return hslConvert(this).formatHsl();
}
function color_formatRgb() {
	return this.rgb().formatRgb();
}
function color(format) {
	var m, l;
	format = (format + "").trim().toLowerCase();
	return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
	return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function rgba(r, g, b, a) {
	if (a <= 0) r = g = b = NaN;
	return new Rgb(r, g, b, a);
}
function rgbConvert(o) {
	if (!(o instanceof Color)) o = color(o);
	if (!o) return new Rgb();
	o = o.rgb();
	return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r, g, b, opacity) {
	return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
	this.r = +r;
	this.g = +g;
	this.b = +b;
	this.opacity = +opacity;
}
define(Rgb, rgb, extend(Color, {
	brighter(k) {
		k = k == null ? brighter : Math.pow(brighter, k);
		return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	},
	darker(k) {
		k = k == null ? darker : Math.pow(darker, k);
		return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
	},
	displayable() {
		return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	},
	hex: rgb_formatHex,
	formatHex: rgb_formatHex,
	formatHex8: rgb_formatHex8,
	formatRgb: rgb_formatRgb,
	toString: rgb_formatRgb
}));
function rgb_formatHex() {
	return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}
function rgb_formatHex8() {
	return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function rgb_formatRgb() {
	const a = clampa(this.opacity);
	return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
}
function clampa(opacity) {
	return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}
function clampi(value) {
	return Math.max(0, Math.min(255, Math.round(value) || 0));
}
function hex(value) {
	value = clampi(value);
	return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h2, s, l, a) {
	if (a <= 0) h2 = s = l = NaN;
	else if (l <= 0 || l >= 1) h2 = s = NaN;
	else if (s <= 0) h2 = NaN;
	return new Hsl(h2, s, l, a);
}
function hslConvert(o) {
	if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
	if (!(o instanceof Color)) o = color(o);
	if (!o) return new Hsl();
	if (o instanceof Hsl) return o;
	o = o.rgb();
	var r = o.r / 255, g = o.g / 255, b = o.b / 255, min = Math.min(r, g, b), max = Math.max(r, g, b), h2 = NaN, s = max - min, l = (max + min) / 2;
	if (s) {
		if (r === max) h2 = (g - b) / s + (g < b) * 6;
		else if (g === max) h2 = (b - r) / s + 2;
		else h2 = (r - g) / s + 4;
		s /= l < .5 ? max + min : 2 - max - min;
		h2 *= 60;
	} else s = l > 0 && l < 1 ? 0 : h2;
	return new Hsl(h2, s, l, o.opacity);
}
function hsl(h2, s, l, opacity) {
	return arguments.length === 1 ? hslConvert(h2) : new Hsl(h2, s, l, opacity == null ? 1 : opacity);
}
function Hsl(h2, s, l, opacity) {
	this.h = +h2;
	this.s = +s;
	this.l = +l;
	this.opacity = +opacity;
}
define(Hsl, hsl, extend(Color, {
	brighter(k) {
		k = k == null ? brighter : Math.pow(brighter, k);
		return new Hsl(this.h, this.s, this.l * k, this.opacity);
	},
	darker(k) {
		k = k == null ? darker : Math.pow(darker, k);
		return new Hsl(this.h, this.s, this.l * k, this.opacity);
	},
	rgb() {
		var h2 = this.h % 360 + (this.h < 0) * 360, s = isNaN(h2) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < .5 ? l : 1 - l) * s, m1 = 2 * l - m2;
		return new Rgb(hsl2rgb(h2 >= 240 ? h2 - 240 : h2 + 120, m1, m2), hsl2rgb(h2, m1, m2), hsl2rgb(h2 < 120 ? h2 + 240 : h2 - 120, m1, m2), this.opacity);
	},
	clamp() {
		return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		const a = clampa(this.opacity);
		return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
	}
}));
function clamph(value) {
	value = (value || 0) % 360;
	return value < 0 ? value + 360 : value;
}
function clampt(value) {
	return Math.max(0, Math.min(1, value || 0));
}
function hsl2rgb(h2, m1, m2) {
	return (h2 < 60 ? m1 + (m2 - m1) * h2 / 60 : h2 < 180 ? m2 : h2 < 240 ? m1 + (m2 - m1) * (240 - h2) / 60 : m1) * 255;
}
var constant$1 = (x) => () => x;
function linear(a, d) {
	return function(t) {
		return a + t * d;
	};
}
function exponential(a, b, y) {
	return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
		return Math.pow(a + t * b, y);
	};
}
function gamma(y) {
	return (y = +y) === 1 ? nogamma : function(a, b) {
		return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
	};
}
function nogamma(a, b) {
	var d = b - a;
	return d ? linear(a, d) : constant$1(isNaN(a) ? b : a);
}
var interpolateRgb = function rgbGamma(y) {
	var color2 = gamma(y);
	function rgb$1(start2, end) {
		var r = color2((start2 = rgb(start2)).r, (end = rgb(end)).r), g = color2(start2.g, end.g), b = color2(start2.b, end.b), opacity = nogamma(start2.opacity, end.opacity);
		return function(t) {
			start2.r = r(t);
			start2.g = g(t);
			start2.b = b(t);
			start2.opacity = opacity(t);
			return start2 + "";
		};
	}
	rgb$1.gamma = rgbGamma;
	return rgb$1;
}(1);
function numberArray(a, b) {
	if (!b) b = [];
	var n = a ? Math.min(b.length, a.length) : 0, c = b.slice(), i;
	return function(t) {
		for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
		return c;
	};
}
function isNumberArray(x) {
	return ArrayBuffer.isView(x) && !(x instanceof DataView);
}
function genericArray(a, b) {
	var nb = b ? b.length : 0, na = a ? Math.min(nb, a.length) : 0, x = new Array(na), c = new Array(nb), i;
	for (i = 0; i < na; ++i) x[i] = interpolate$1(a[i], b[i]);
	for (; i < nb; ++i) c[i] = b[i];
	return function(t) {
		for (i = 0; i < na; ++i) c[i] = x[i](t);
		return c;
	};
}
function date(a, b) {
	var d = /* @__PURE__ */ new Date();
	return a = +a, b = +b, function(t) {
		return d.setTime(a * (1 - t) + b * t), d;
	};
}
function interpolateNumber(a, b) {
	return a = +a, b = +b, function(t) {
		return a * (1 - t) + b * t;
	};
}
function object(a, b) {
	var i = {}, c = {}, k;
	if (a === null || typeof a !== "object") a = {};
	if (b === null || typeof b !== "object") b = {};
	for (k in b) if (k in a) i[k] = interpolate$1(a[k], b[k]);
	else c[k] = b[k];
	return function(t) {
		for (k in i) c[k] = i[k](t);
		return c;
	};
}
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
var reB = new RegExp(reA.source, "g");
function zero(b) {
	return function() {
		return b;
	};
}
function one(b) {
	return function(t) {
		return b(t) + "";
	};
}
function interpolateString(a, b) {
	var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
	a = a + "", b = b + "";
	while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
		if ((bs = bm.index) > bi) {
			bs = b.slice(bi, bs);
			if (s[i]) s[i] += bs;
			else s[++i] = bs;
		}
		if ((am = am[0]) === (bm = bm[0])) {
			if (s[i]) s[i] += bm;
			else s[++i] = bm;
		} else {
			s[++i] = null;
			q.push({
				i,
				x: interpolateNumber(am, bm)
			});
		}
		bi = reB.lastIndex;
	}
	if (bi < b.length) {
		bs = b.slice(bi);
		if (s[i]) s[i] += bs;
		else s[++i] = bs;
	}
	return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function(t) {
		for (var i2 = 0, o; i2 < b; ++i2) s[(o = q[i2]).i] = o.x(t);
		return s.join("");
	});
}
function interpolate$1(a, b) {
	var t = typeof b, c;
	return b == null || t === "boolean" ? constant$1(b) : (t === "number" ? interpolateNumber : t === "string" ? (c = color(b)) ? (b = c, interpolateRgb) : interpolateString : b instanceof color ? interpolateRgb : b instanceof Date ? date : isNumberArray(b) ? numberArray : Array.isArray(b) ? genericArray : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object : interpolateNumber)(a, b);
}
var degrees = 180 / Math.PI;
var identity$1 = {
	translateX: 0,
	translateY: 0,
	rotate: 0,
	skewX: 0,
	scaleX: 1,
	scaleY: 1
};
function decompose(a, b, c, d, e, f) {
	var scaleX, scaleY, skewX;
	if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
	if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
	if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
	if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
	return {
		translateX: e,
		translateY: f,
		rotate: Math.atan2(b, a) * degrees,
		skewX: Math.atan(skewX) * degrees,
		scaleX,
		scaleY
	};
}
var svgNode;
function parseCss(value) {
	const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
	return m.isIdentity ? identity$1 : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
}
function parseSvg(value) {
	if (value == null) return identity$1;
	if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
	svgNode.setAttribute("transform", value);
	if (!(value = svgNode.transform.baseVal.consolidate())) return identity$1;
	value = value.matrix;
	return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
}
function interpolateTransform(parse, pxComma, pxParen, degParen) {
	function pop(s) {
		return s.length ? s.pop() + " " : "";
	}
	function translate(xa, ya, xb, yb, s, q) {
		if (xa !== xb || ya !== yb) {
			var i = s.push("translate(", null, pxComma, null, pxParen);
			q.push({
				i: i - 4,
				x: interpolateNumber(xa, xb)
			}, {
				i: i - 2,
				x: interpolateNumber(ya, yb)
			});
		} else if (xb || yb) s.push("translate(" + xb + pxComma + yb + pxParen);
	}
	function rotate(a, b, s, q) {
		if (a !== b) {
			if (a - b > 180) b += 360;
			else if (b - a > 180) a += 360;
			q.push({
				i: s.push(pop(s) + "rotate(", null, degParen) - 2,
				x: interpolateNumber(a, b)
			});
		} else if (b) s.push(pop(s) + "rotate(" + b + degParen);
	}
	function skewX(a, b, s, q) {
		if (a !== b) q.push({
			i: s.push(pop(s) + "skewX(", null, degParen) - 2,
			x: interpolateNumber(a, b)
		});
		else if (b) s.push(pop(s) + "skewX(" + b + degParen);
	}
	function scale(xa, ya, xb, yb, s, q) {
		if (xa !== xb || ya !== yb) {
			var i = s.push(pop(s) + "scale(", null, ",", null, ")");
			q.push({
				i: i - 4,
				x: interpolateNumber(xa, xb)
			}, {
				i: i - 2,
				x: interpolateNumber(ya, yb)
			});
		} else if (xb !== 1 || yb !== 1) s.push(pop(s) + "scale(" + xb + "," + yb + ")");
	}
	return function(a, b) {
		var s = [], q = [];
		a = parse(a), b = parse(b);
		translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
		rotate(a.rotate, b.rotate, s, q);
		skewX(a.skewX, b.skewX, s, q);
		scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
		a = b = null;
		return function(t) {
			var i = -1, n = q.length, o;
			while (++i < n) s[(o = q[i]).i] = o.x(t);
			return s.join("");
		};
	};
}
var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");
var epsilon2 = 1e-12;
function cosh(x) {
	return ((x = Math.exp(x)) + 1 / x) / 2;
}
function sinh(x) {
	return ((x = Math.exp(x)) - 1 / x) / 2;
}
function tanh(x) {
	return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}
var interpolateZoom = function zoomRho(rho, rho2, rho4) {
	function zoom2(p0, p1) {
		var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
		if (d2 < epsilon2) {
			S = Math.log(w1 / w0) / rho;
			i = function(t) {
				return [
					ux0 + t * dx,
					uy0 + t * dy,
					w0 * Math.exp(rho * t * S)
				];
			};
		} else {
			var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
			S = (Math.log(Math.sqrt(b1 * b1 + 1) - b1) - r0) / rho;
			i = function(t) {
				var s = t * S, coshr0 = cosh(r0), u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
				return [
					ux0 + u * dx,
					uy0 + u * dy,
					w0 * coshr0 / cosh(rho * s + r0)
				];
			};
		}
		i.duration = S * 1e3 * rho / Math.SQRT2;
		return i;
	}
	zoom2.rho = function(_) {
		var _1 = Math.max(.001, +_), _2 = _1 * _1;
		return zoomRho(_1, _2, _2 * _2);
	};
	return zoom2;
}(Math.SQRT2, 2, 4);
var frame = 0;
var timeout$1 = 0;
var interval = 0;
var pokeDelay = 1e3;
var taskHead;
var taskTail;
var clockLast = 0;
var clockNow = 0;
var clockSkew = 0;
var clock = typeof performance === "object" && performance.now ? performance : Date;
var setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
	setTimeout(f, 17);
};
function now() {
	return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}
function clearNow() {
	clockNow = 0;
}
function Timer() {
	this._call = this._time = this._next = null;
}
Timer.prototype = timer.prototype = {
	constructor: Timer,
	restart: function(callback, delay, time) {
		if (typeof callback !== "function") throw new TypeError("callback is not a function");
		time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
		if (!this._next && taskTail !== this) {
			if (taskTail) taskTail._next = this;
			else taskHead = this;
			taskTail = this;
		}
		this._call = callback;
		this._time = time;
		sleep();
	},
	stop: function() {
		if (this._call) {
			this._call = null;
			this._time = Infinity;
			sleep();
		}
	}
};
function timer(callback, delay, time) {
	var t = new Timer();
	t.restart(callback, delay, time);
	return t;
}
function timerFlush() {
	now();
	++frame;
	var t = taskHead, e;
	while (t) {
		if ((e = clockNow - t._time) >= 0) t._call.call(void 0, e);
		t = t._next;
	}
	--frame;
}
function wake() {
	clockNow = (clockLast = clock.now()) + clockSkew;
	frame = timeout$1 = 0;
	try {
		timerFlush();
	} finally {
		frame = 0;
		nap();
		clockNow = 0;
	}
}
function poke() {
	var now2 = clock.now(), delay = now2 - clockLast;
	if (delay > pokeDelay) clockSkew -= delay, clockLast = now2;
}
function nap() {
	var t0, t1 = taskHead, t2, time = Infinity;
	while (t1) if (t1._call) {
		if (time > t1._time) time = t1._time;
		t0 = t1, t1 = t1._next;
	} else {
		t2 = t1._next, t1._next = null;
		t1 = t0 ? t0._next = t2 : taskHead = t2;
	}
	taskTail = t0;
	sleep(time);
}
function sleep(time) {
	if (frame) return;
	if (timeout$1) timeout$1 = clearTimeout(timeout$1);
	if (time - clockNow > 24) {
		if (time < Infinity) timeout$1 = setTimeout(wake, time - clock.now() - clockSkew);
		if (interval) interval = clearInterval(interval);
	} else {
		if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
		frame = 1, setFrame(wake);
	}
}
function timeout(callback, delay, time) {
	var t = new Timer();
	delay = delay == null ? 0 : +delay;
	t.restart((elapsed) => {
		t.stop();
		callback(elapsed + delay);
	}, delay, time);
	return t;
}
var emptyOn = dispatch("start", "end", "cancel", "interrupt");
var emptyTween = [];
var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;
function schedule(node, name, id2, index, group, timing) {
	var schedules = node.__transition;
	if (!schedules) node.__transition = {};
	else if (id2 in schedules) return;
	create(node, id2, {
		name,
		index,
		group,
		on: emptyOn,
		tween: emptyTween,
		time: timing.time,
		delay: timing.delay,
		duration: timing.duration,
		ease: timing.ease,
		timer: null,
		state: CREATED
	});
}
function init(node, id2) {
	var schedule2 = get(node, id2);
	if (schedule2.state > CREATED) throw new Error("too late; already scheduled");
	return schedule2;
}
function set(node, id2) {
	var schedule2 = get(node, id2);
	if (schedule2.state > STARTED) throw new Error("too late; already running");
	return schedule2;
}
function get(node, id2) {
	var schedule2 = node.__transition;
	if (!schedule2 || !(schedule2 = schedule2[id2])) throw new Error("transition not found");
	return schedule2;
}
function create(node, id2, self) {
	var schedules = node.__transition, tween;
	schedules[id2] = self;
	self.timer = timer(schedule2, 0, self.time);
	function schedule2(elapsed) {
		self.state = SCHEDULED;
		self.timer.restart(start2, self.delay, self.time);
		if (self.delay <= elapsed) start2(elapsed - self.delay);
	}
	function start2(elapsed) {
		var i, j, n, o;
		if (self.state !== SCHEDULED) return stop();
		for (i in schedules) {
			o = schedules[i];
			if (o.name !== self.name) continue;
			if (o.state === STARTED) return timeout(start2);
			if (o.state === RUNNING) {
				o.state = ENDED;
				o.timer.stop();
				o.on.call("interrupt", node, node.__data__, o.index, o.group);
				delete schedules[i];
			} else if (+i < id2) {
				o.state = ENDED;
				o.timer.stop();
				o.on.call("cancel", node, node.__data__, o.index, o.group);
				delete schedules[i];
			}
		}
		timeout(function() {
			if (self.state === STARTED) {
				self.state = RUNNING;
				self.timer.restart(tick, self.delay, self.time);
				tick(elapsed);
			}
		});
		self.state = STARTING;
		self.on.call("start", node, node.__data__, self.index, self.group);
		if (self.state !== STARTING) return;
		self.state = STARTED;
		tween = new Array(n = self.tween.length);
		for (i = 0, j = -1; i < n; ++i) if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) tween[++j] = o;
		tween.length = j + 1;
	}
	function tick(elapsed) {
		var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1), i = -1, n = tween.length;
		while (++i < n) tween[i].call(node, t);
		if (self.state === ENDING) {
			self.on.call("end", node, node.__data__, self.index, self.group);
			stop();
		}
	}
	function stop() {
		self.state = ENDED;
		self.timer.stop();
		delete schedules[id2];
		for (var i in schedules) return;
		delete node.__transition;
	}
}
function interrupt(node, name) {
	var schedules = node.__transition, schedule2, active, empty2 = true, i;
	if (!schedules) return;
	name = name == null ? null : name + "";
	for (i in schedules) {
		if ((schedule2 = schedules[i]).name !== name) {
			empty2 = false;
			continue;
		}
		active = schedule2.state > STARTING && schedule2.state < ENDING;
		schedule2.state = ENDED;
		schedule2.timer.stop();
		schedule2.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule2.index, schedule2.group);
		delete schedules[i];
	}
	if (empty2) delete node.__transition;
}
function selection_interrupt(name) {
	return this.each(function() {
		interrupt(this, name);
	});
}
function tweenRemove(id2, name) {
	var tween0, tween1;
	return function() {
		var schedule2 = set(this, id2), tween = schedule2.tween;
		if (tween !== tween0) {
			tween1 = tween0 = tween;
			for (var i = 0, n = tween1.length; i < n; ++i) if (tween1[i].name === name) {
				tween1 = tween1.slice();
				tween1.splice(i, 1);
				break;
			}
		}
		schedule2.tween = tween1;
	};
}
function tweenFunction(id2, name, value) {
	var tween0, tween1;
	if (typeof value !== "function") throw new Error();
	return function() {
		var schedule2 = set(this, id2), tween = schedule2.tween;
		if (tween !== tween0) {
			tween1 = (tween0 = tween).slice();
			for (var t = {
				name,
				value
			}, i = 0, n = tween1.length; i < n; ++i) if (tween1[i].name === name) {
				tween1[i] = t;
				break;
			}
			if (i === n) tween1.push(t);
		}
		schedule2.tween = tween1;
	};
}
function transition_tween(name, value) {
	var id2 = this._id;
	name += "";
	if (arguments.length < 2) {
		var tween = get(this.node(), id2).tween;
		for (var i = 0, n = tween.length, t; i < n; ++i) if ((t = tween[i]).name === name) return t.value;
		return null;
	}
	return this.each((value == null ? tweenRemove : tweenFunction)(id2, name, value));
}
function tweenValue(transition, name, value) {
	var id2 = transition._id;
	transition.each(function() {
		var schedule2 = set(this, id2);
		(schedule2.value || (schedule2.value = {}))[name] = value.apply(this, arguments);
	});
	return function(node) {
		return get(node, id2).value[name];
	};
}
function interpolate(a, b) {
	var c;
	return (typeof b === "number" ? interpolateNumber : b instanceof color ? interpolateRgb : (c = color(b)) ? (b = c, interpolateRgb) : interpolateString)(a, b);
}
function attrRemove(name) {
	return function() {
		this.removeAttribute(name);
	};
}
function attrRemoveNS(fullname) {
	return function() {
		this.removeAttributeNS(fullname.space, fullname.local);
	};
}
function attrConstant(name, interpolate2, value1) {
	var string00, string1 = value1 + "", interpolate0;
	return function() {
		var string0 = this.getAttribute(name);
		return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
	};
}
function attrConstantNS(fullname, interpolate2, value1) {
	var string00, string1 = value1 + "", interpolate0;
	return function() {
		var string0 = this.getAttributeNS(fullname.space, fullname.local);
		return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
	};
}
function attrFunction(name, interpolate2, value) {
	var string00, string10, interpolate0;
	return function() {
		var string0, value1 = value(this), string1;
		if (value1 == null) return void this.removeAttribute(name);
		string0 = this.getAttribute(name);
		string1 = value1 + "";
		return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
	};
}
function attrFunctionNS(fullname, interpolate2, value) {
	var string00, string10, interpolate0;
	return function() {
		var string0, value1 = value(this), string1;
		if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
		string0 = this.getAttributeNS(fullname.space, fullname.local);
		string1 = value1 + "";
		return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
	};
}
function transition_attr(name, value) {
	var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
	return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname) : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
}
function attrInterpolate(name, i) {
	return function(t) {
		this.setAttribute(name, i.call(this, t));
	};
}
function attrInterpolateNS(fullname, i) {
	return function(t) {
		this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
	};
}
function attrTweenNS(fullname, value) {
	var t0, i0;
	function tween() {
		var i = value.apply(this, arguments);
		if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
		return t0;
	}
	tween._value = value;
	return tween;
}
function attrTween(name, value) {
	var t0, i0;
	function tween() {
		var i = value.apply(this, arguments);
		if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
		return t0;
	}
	tween._value = value;
	return tween;
}
function transition_attrTween(name, value) {
	var key = "attr." + name;
	if (arguments.length < 2) return (key = this.tween(key)) && key._value;
	if (value == null) return this.tween(key, null);
	if (typeof value !== "function") throw new Error();
	var fullname = namespace(name);
	return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}
function delayFunction(id2, value) {
	return function() {
		init(this, id2).delay = +value.apply(this, arguments);
	};
}
function delayConstant(id2, value) {
	return value = +value, function() {
		init(this, id2).delay = value;
	};
}
function transition_delay(value) {
	var id2 = this._id;
	return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id2, value)) : get(this.node(), id2).delay;
}
function durationFunction(id2, value) {
	return function() {
		set(this, id2).duration = +value.apply(this, arguments);
	};
}
function durationConstant(id2, value) {
	return value = +value, function() {
		set(this, id2).duration = value;
	};
}
function transition_duration(value) {
	var id2 = this._id;
	return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id2, value)) : get(this.node(), id2).duration;
}
function easeConstant(id2, value) {
	if (typeof value !== "function") throw new Error();
	return function() {
		set(this, id2).ease = value;
	};
}
function transition_ease(value) {
	var id2 = this._id;
	return arguments.length ? this.each(easeConstant(id2, value)) : get(this.node(), id2).ease;
}
function easeVarying(id2, value) {
	return function() {
		var v = value.apply(this, arguments);
		if (typeof v !== "function") throw new Error();
		set(this, id2).ease = v;
	};
}
function transition_easeVarying(value) {
	if (typeof value !== "function") throw new Error();
	return this.each(easeVarying(this._id, value));
}
function transition_filter(match) {
	if (typeof match !== "function") match = matcher(match);
	for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) if ((node = group[i]) && match.call(node, node.__data__, i, group)) subgroup.push(node);
	return new Transition(subgroups, this._parents, this._name, this._id);
}
function transition_merge(transition) {
	if (transition._id !== this._id) throw new Error();
	for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) if (node = group0[i] || group1[i]) merge[i] = node;
	for (; j < m0; ++j) merges[j] = groups0[j];
	return new Transition(merges, this._parents, this._name, this._id);
}
function start(name) {
	return (name + "").trim().split(/^|\s+/).every(function(t) {
		var i = t.indexOf(".");
		if (i >= 0) t = t.slice(0, i);
		return !t || t === "start";
	});
}
function onFunction(id2, name, listener) {
	var on0, on1, sit = start(name) ? init : set;
	return function() {
		var schedule2 = sit(this, id2), on = schedule2.on;
		if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
		schedule2.on = on1;
	};
}
function transition_on(name, listener) {
	var id2 = this._id;
	return arguments.length < 2 ? get(this.node(), id2).on.on(name) : this.each(onFunction(id2, name, listener));
}
function removeFunction(id2) {
	return function() {
		var parent = this.parentNode;
		for (var i in this.__transition) if (+i !== id2) return;
		if (parent) parent.removeChild(this);
	};
}
function transition_remove() {
	return this.on("end.remove", removeFunction(this._id));
}
function transition_select(select2) {
	var name = this._name, id2 = this._id;
	if (typeof select2 !== "function") select2 = selector(select2);
	for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) if ((node = group[i]) && (subnode = select2.call(node, node.__data__, i, group))) {
		if ("__data__" in node) subnode.__data__ = node.__data__;
		subgroup[i] = subnode;
		schedule(subgroup[i], name, id2, i, subgroup, get(node, id2));
	}
	return new Transition(subgroups, this._parents, name, id2);
}
function transition_selectAll(select2) {
	var name = this._name, id2 = this._id;
	if (typeof select2 !== "function") select2 = selectorAll(select2);
	for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) if (node = group[i]) {
		for (var children2 = select2.call(node, node.__data__, i, group), child, inherit2 = get(node, id2), k = 0, l = children2.length; k < l; ++k) if (child = children2[k]) schedule(child, name, id2, k, children2, inherit2);
		subgroups.push(children2);
		parents.push(node);
	}
	return new Transition(subgroups, parents, name, id2);
}
var Selection = selection.prototype.constructor;
function transition_selection() {
	return new Selection(this._groups, this._parents);
}
function styleNull(name, interpolate2) {
	var string00, string10, interpolate0;
	return function() {
		var string0 = styleValue(this, name), string1 = (this.style.removeProperty(name), styleValue(this, name));
		return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, string10 = string1);
	};
}
function styleRemove(name) {
	return function() {
		this.style.removeProperty(name);
	};
}
function styleConstant(name, interpolate2, value1) {
	var string00, string1 = value1 + "", interpolate0;
	return function() {
		var string0 = styleValue(this, name);
		return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
	};
}
function styleFunction(name, interpolate2, value) {
	var string00, string10, interpolate0;
	return function() {
		var string0 = styleValue(this, name), value1 = value(this), string1 = value1 + "";
		if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
		return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
	};
}
function styleMaybeRemove(id2, name) {
	var on0, on1, listener0, key = "style." + name, event = "end." + key, remove2;
	return function() {
		var schedule2 = set(this, id2), on = schedule2.on, listener = schedule2.value[key] == null ? remove2 || (remove2 = styleRemove(name)) : void 0;
		if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
		schedule2.on = on1;
	};
}
function transition_style(name, value, priority) {
	var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
	return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove(name)) : typeof value === "function" ? this.styleTween(name, styleFunction(name, i, tweenValue(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant(name, i, value), priority).on("end.style." + name, null);
}
function styleInterpolate(name, i, priority) {
	return function(t) {
		this.style.setProperty(name, i.call(this, t), priority);
	};
}
function styleTween(name, value, priority) {
	var t, i0;
	function tween() {
		var i = value.apply(this, arguments);
		if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
		return t;
	}
	tween._value = value;
	return tween;
}
function transition_styleTween(name, value, priority) {
	var key = "style." + (name += "");
	if (arguments.length < 2) return (key = this.tween(key)) && key._value;
	if (value == null) return this.tween(key, null);
	if (typeof value !== "function") throw new Error();
	return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}
function textConstant(value) {
	return function() {
		this.textContent = value;
	};
}
function textFunction(value) {
	return function() {
		var value1 = value(this);
		this.textContent = value1 == null ? "" : value1;
	};
}
function transition_text(value) {
	return this.tween("text", typeof value === "function" ? textFunction(tweenValue(this, "text", value)) : textConstant(value == null ? "" : value + ""));
}
function textInterpolate(i) {
	return function(t) {
		this.textContent = i.call(this, t);
	};
}
function textTween(value) {
	var t0, i0;
	function tween() {
		var i = value.apply(this, arguments);
		if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
		return t0;
	}
	tween._value = value;
	return tween;
}
function transition_textTween(value) {
	var key = "text";
	if (arguments.length < 1) return (key = this.tween(key)) && key._value;
	if (value == null) return this.tween(key, null);
	if (typeof value !== "function") throw new Error();
	return this.tween(key, textTween(value));
}
function transition_transition() {
	var name = this._name, id0 = this._id, id1 = newId();
	for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) if (node = group[i]) {
		var inherit2 = get(node, id0);
		schedule(node, name, id1, i, group, {
			time: inherit2.time + inherit2.delay + inherit2.duration,
			delay: 0,
			duration: inherit2.duration,
			ease: inherit2.ease
		});
	}
	return new Transition(groups, this._parents, name, id1);
}
function transition_end() {
	var on0, on1, that = this, id2 = that._id, size = that.size();
	return new Promise(function(resolve, reject) {
		var cancel = { value: reject }, end = { value: function() {
			if (--size === 0) resolve();
		} };
		that.each(function() {
			var schedule2 = set(this, id2), on = schedule2.on;
			if (on !== on0) {
				on1 = (on0 = on).copy();
				on1._.cancel.push(cancel);
				on1._.interrupt.push(cancel);
				on1._.end.push(end);
			}
			schedule2.on = on1;
		});
		if (size === 0) resolve();
	});
}
var id = 0;
function Transition(groups, parents, name, id2) {
	this._groups = groups;
	this._parents = parents;
	this._name = name;
	this._id = id2;
}
function newId() {
	return ++id;
}
var selection_prototype = selection.prototype;
Transition.prototype = {
	constructor: Transition,
	select: transition_select,
	selectAll: transition_selectAll,
	selectChild: selection_prototype.selectChild,
	selectChildren: selection_prototype.selectChildren,
	filter: transition_filter,
	merge: transition_merge,
	selection: transition_selection,
	transition: transition_transition,
	call: selection_prototype.call,
	nodes: selection_prototype.nodes,
	node: selection_prototype.node,
	size: selection_prototype.size,
	empty: selection_prototype.empty,
	each: selection_prototype.each,
	on: transition_on,
	attr: transition_attr,
	attrTween: transition_attrTween,
	style: transition_style,
	styleTween: transition_styleTween,
	text: transition_text,
	textTween: transition_textTween,
	remove: transition_remove,
	tween: transition_tween,
	delay: transition_delay,
	duration: transition_duration,
	ease: transition_ease,
	easeVarying: transition_easeVarying,
	end: transition_end,
	[Symbol.iterator]: selection_prototype[Symbol.iterator]
};
function cubicInOut(t) {
	return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var defaultTiming = {
	time: null,
	delay: 0,
	duration: 250,
	ease: cubicInOut
};
function inherit(node, id2) {
	var timing;
	while (!(timing = node.__transition) || !(timing = timing[id2])) if (!(node = node.parentNode)) throw new Error(`transition ${id2} not found`);
	return timing;
}
function selection_transition(name) {
	var id2, timing;
	if (name instanceof Transition) id2 = name._id, name = name._name;
	else id2 = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
	for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) if (node = group[i]) schedule(node, name, id2, i, group, timing || inherit(node, id2));
	return new Transition(groups, this._parents, name, id2);
}
selection.prototype.interrupt = selection_interrupt;
selection.prototype.transition = selection_transition;
var constant = (x) => () => x;
function ZoomEvent(type, { sourceEvent: sourceEvent2, target, transform, dispatch: dispatch2 }) {
	Object.defineProperties(this, {
		type: {
			value: type,
			enumerable: true,
			configurable: true
		},
		sourceEvent: {
			value: sourceEvent2,
			enumerable: true,
			configurable: true
		},
		target: {
			value: target,
			enumerable: true,
			configurable: true
		},
		transform: {
			value: transform,
			enumerable: true,
			configurable: true
		},
		_: { value: dispatch2 }
	});
}
function Transform(k, x, y) {
	this.k = k;
	this.x = x;
	this.y = y;
}
Transform.prototype = {
	constructor: Transform,
	scale: function(k) {
		return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
	},
	translate: function(x, y) {
		return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
	},
	apply: function(point) {
		return [point[0] * this.k + this.x, point[1] * this.k + this.y];
	},
	applyX: function(x) {
		return x * this.k + this.x;
	},
	applyY: function(y) {
		return y * this.k + this.y;
	},
	invert: function(location) {
		return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
	},
	invertX: function(x) {
		return (x - this.x) / this.k;
	},
	invertY: function(y) {
		return (y - this.y) / this.k;
	},
	rescaleX: function(x) {
		return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
	},
	rescaleY: function(y) {
		return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
	},
	toString: function() {
		return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
	}
};
var identity = new Transform(1, 0, 0);
Transform.prototype;
function nopropagation(event) {
	event.stopImmediatePropagation();
}
function noevent(event) {
	event.preventDefault();
	event.stopImmediatePropagation();
}
function defaultFilter(event) {
	return (!event.ctrlKey || event.type === "wheel") && !event.button;
}
function defaultExtent() {
	var e = this;
	if (e instanceof SVGElement) {
		e = e.ownerSVGElement || e;
		if (e.hasAttribute("viewBox")) {
			e = e.viewBox.baseVal;
			return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
		}
		return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
	}
	return [[0, 0], [e.clientWidth, e.clientHeight]];
}
function defaultTransform() {
	return this.__zoom || identity;
}
function defaultWheelDelta(event) {
	return -event.deltaY * (event.deltaMode === 1 ? .05 : event.deltaMode ? 1 : .002) * (event.ctrlKey ? 10 : 1);
}
function defaultTouchable() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function defaultConstrain(transform, extent, translateExtent) {
	var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0], dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0], dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1], dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
	return transform.translate(dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1), dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1));
}
function zoom() {
	var filter2 = defaultFilter, extent = defaultExtent, constrain = defaultConstrain, wheelDelta2 = defaultWheelDelta, touchable = defaultTouchable, scaleExtent = [0, Infinity], translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]], duration = 250, interpolate2 = interpolateZoom, listeners = dispatch("start", "zoom", "end"), touchstarting, touchfirst, touchending, touchDelay = 500, wheelDelay = 150, clickDistance2 = 0, tapDistance = 10;
	function zoom2(selection2) {
		selection2.property("__zoom", defaultTransform).on("wheel.zoom", wheeled, { passive: false }).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	zoom2.transform = function(collection, transform, point, event) {
		var selection2 = collection.selection ? collection.selection() : collection;
		selection2.property("__zoom", defaultTransform);
		if (collection !== selection2) schedule2(collection, transform, point, event);
		else selection2.interrupt().each(function() {
			gesture(this, arguments).event(event).start().zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform).end();
		});
	};
	zoom2.scaleBy = function(selection2, k, p, event) {
		zoom2.scaleTo(selection2, function() {
			return this.__zoom.k * (typeof k === "function" ? k.apply(this, arguments) : k);
		}, p, event);
	};
	zoom2.scaleTo = function(selection2, k, p, event) {
		zoom2.transform(selection2, function() {
			var e = extent.apply(this, arguments), t0 = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p, p1 = t0.invert(p0), k1 = typeof k === "function" ? k.apply(this, arguments) : k;
			return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
		}, p, event);
	};
	zoom2.translateBy = function(selection2, x, y, event) {
		zoom2.transform(selection2, function() {
			return constrain(this.__zoom.translate(typeof x === "function" ? x.apply(this, arguments) : x, typeof y === "function" ? y.apply(this, arguments) : y), extent.apply(this, arguments), translateExtent);
		}, null, event);
	};
	zoom2.translateTo = function(selection2, x, y, p, event) {
		zoom2.transform(selection2, function() {
			var e = extent.apply(this, arguments), t = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
			return constrain(identity.translate(p0[0], p0[1]).scale(t.k).translate(typeof x === "function" ? -x.apply(this, arguments) : -x, typeof y === "function" ? -y.apply(this, arguments) : -y), e, translateExtent);
		}, p, event);
	};
	function scale(transform, k) {
		k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
		return k === transform.k ? transform : new Transform(k, transform.x, transform.y);
	}
	function translate(transform, p0, p1) {
		var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
		return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
	}
	function centroid(extent2) {
		return [(+extent2[0][0] + +extent2[1][0]) / 2, (+extent2[0][1] + +extent2[1][1]) / 2];
	}
	function schedule2(transition, transform, point, event) {
		transition.on("start.zoom", function() {
			gesture(this, arguments).event(event).start();
		}).on("interrupt.zoom end.zoom", function() {
			gesture(this, arguments).event(event).end();
		}).tween("zoom", function() {
			var that = this, args = arguments, g = gesture(that, args).event(event), e = extent.apply(that, args), p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point, w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]), a = that.__zoom, b = typeof transform === "function" ? transform.apply(that, args) : transform, i = interpolate2(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
			return function(t) {
				if (t === 1) t = b;
				else {
					var l = i(t), k = w / l[2];
					t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k);
				}
				g.zoom(null, t);
			};
		});
	}
	function gesture(that, args, clean) {
		return !clean && that.__zooming || new Gesture(that, args);
	}
	function Gesture(that, args) {
		this.that = that;
		this.args = args;
		this.active = 0;
		this.sourceEvent = null;
		this.extent = extent.apply(that, args);
		this.taps = 0;
	}
	Gesture.prototype = {
		event: function(event) {
			if (event) this.sourceEvent = event;
			return this;
		},
		start: function() {
			if (++this.active === 1) {
				this.that.__zooming = this;
				this.emit("start");
			}
			return this;
		},
		zoom: function(key, transform) {
			if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
			if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
			if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
			this.that.__zoom = transform;
			this.emit("zoom");
			return this;
		},
		end: function() {
			if (--this.active === 0) {
				delete this.that.__zooming;
				this.emit("end");
			}
			return this;
		},
		emit: function(type) {
			var d = select(this.that).datum();
			listeners.call(type, this.that, new ZoomEvent(type, {
				sourceEvent: this.sourceEvent,
				target: zoom2,
				type,
				transform: this.that.__zoom,
				dispatch: listeners
			}), d);
		}
	};
	function wheeled(event, ...args) {
		if (!filter2.apply(this, arguments)) return;
		var g = gesture(this, args).event(event), t = this.__zoom, k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta2.apply(this, arguments)))), p = pointer(event);
		if (g.wheel) {
			if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) g.mouse[1] = t.invert(g.mouse[0] = p);
			clearTimeout(g.wheel);
		} else if (t.k === k) return;
		else {
			g.mouse = [p, t.invert(p)];
			interrupt(this);
			g.start();
		}
		noevent(event);
		g.wheel = setTimeout(wheelidled, wheelDelay);
		g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));
		function wheelidled() {
			g.wheel = null;
			g.end();
		}
	}
	function mousedowned(event, ...args) {
		if (touchending || !filter2.apply(this, arguments)) return;
		var currentTarget = event.currentTarget, g = gesture(this, args, true).event(event), v = select(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true), p = pointer(event, currentTarget), x0 = event.clientX, y0 = event.clientY;
		dragDisable(event.view);
		nopropagation(event);
		g.mouse = [p, this.__zoom.invert(p)];
		interrupt(this);
		g.start();
		function mousemoved(event2) {
			noevent(event2);
			if (!g.moved) {
				var dx = event2.clientX - x0, dy = event2.clientY - y0;
				g.moved = dx * dx + dy * dy > clickDistance2;
			}
			g.event(event2).zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer(event2, currentTarget), g.mouse[1]), g.extent, translateExtent));
		}
		function mouseupped(event2) {
			v.on("mousemove.zoom mouseup.zoom", null);
			yesdrag(event2.view, g.moved);
			noevent(event2);
			g.event(event2).end();
		}
	}
	function dblclicked(event, ...args) {
		if (!filter2.apply(this, arguments)) return;
		var t0 = this.__zoom, p0 = pointer(event.changedTouches ? event.changedTouches[0] : event, this), p1 = t0.invert(p0), k1 = t0.k * (event.shiftKey ? .5 : 2), t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);
		noevent(event);
		if (duration > 0) select(this).transition().duration(duration).call(schedule2, t1, p0, event);
		else select(this).call(zoom2.transform, t1, p0, event);
	}
	function touchstarted(event, ...args) {
		if (!filter2.apply(this, arguments)) return;
		var touches = event.touches, n = touches.length, g = gesture(this, args, event.changedTouches.length === n).event(event), started, i, t, p;
		nopropagation(event);
		for (i = 0; i < n; ++i) {
			t = touches[i], p = pointer(t, this);
			p = [
				p,
				this.__zoom.invert(p),
				t.identifier
			];
			if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
			else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
		}
		if (touchstarting) touchstarting = clearTimeout(touchstarting);
		if (started) {
			if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() {
				touchstarting = null;
			}, touchDelay);
			interrupt(this);
			g.start();
		}
	}
	function touchmoved(event, ...args) {
		if (!this.__zooming) return;
		var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t, p, l;
		noevent(event);
		for (i = 0; i < n; ++i) {
			t = touches[i], p = pointer(t, this);
			if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
			else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
		}
		t = g.that.__zoom;
		if (g.touch1) {
			var p0 = g.touch0[0], l0 = g.touch0[1], p1 = g.touch1[0], l1 = g.touch1[1], dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp, dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
			t = scale(t, Math.sqrt(dp / dl));
			p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
			l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
		} else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
		else return;
		g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
	}
	function touchended(event, ...args) {
		if (!this.__zooming) return;
		var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t;
		nopropagation(event);
		if (touchending) clearTimeout(touchending);
		touchending = setTimeout(function() {
			touchending = null;
		}, touchDelay);
		for (i = 0; i < n; ++i) {
			t = touches[i];
			if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
			else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
		}
		if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
		if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
		else {
			g.end();
			if (g.taps === 2) {
				t = pointer(t, this);
				if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
					var p = select(this).on("dblclick.zoom");
					if (p) p.apply(this, arguments);
				}
			}
		}
	}
	zoom2.wheelDelta = function(_) {
		return arguments.length ? (wheelDelta2 = typeof _ === "function" ? _ : constant(+_), zoom2) : wheelDelta2;
	};
	zoom2.filter = function(_) {
		return arguments.length ? (filter2 = typeof _ === "function" ? _ : constant(!!_), zoom2) : filter2;
	};
	zoom2.touchable = function(_) {
		return arguments.length ? (touchable = typeof _ === "function" ? _ : constant(!!_), zoom2) : touchable;
	};
	zoom2.extent = function(_) {
		return arguments.length ? (extent = typeof _ === "function" ? _ : constant([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom2) : extent;
	};
	zoom2.scaleExtent = function(_) {
		return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom2) : [scaleExtent[0], scaleExtent[1]];
	};
	zoom2.translateExtent = function(_) {
		return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom2) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
	};
	zoom2.constrain = function(_) {
		return arguments.length ? (constrain = _, zoom2) : constrain;
	};
	zoom2.duration = function(_) {
		return arguments.length ? (duration = +_, zoom2) : duration;
	};
	zoom2.interpolate = function(_) {
		return arguments.length ? (interpolate2 = _, zoom2) : interpolate2;
	};
	zoom2.on = function() {
		var value = listeners.on.apply(listeners, arguments);
		return value === listeners ? zoom2 : value;
	};
	zoom2.clickDistance = function(_) {
		return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom2) : Math.sqrt(clickDistance2);
	};
	zoom2.tapDistance = function(_) {
		return arguments.length ? (tapDistance = +_, zoom2) : tapDistance;
	};
	return zoom2;
}
var Position = /* @__PURE__ */ ((Position2) => {
	Position2["Left"] = "left";
	Position2["Top"] = "top";
	Position2["Right"] = "right";
	Position2["Bottom"] = "bottom";
	return Position2;
})(Position || {});
var SelectionMode = /* @__PURE__ */ ((SelectionMode2) => {
	SelectionMode2["Partial"] = "partial";
	SelectionMode2["Full"] = "full";
	return SelectionMode2;
})(SelectionMode || {});
var ConnectionLineType = /* @__PURE__ */ ((ConnectionLineType2) => {
	ConnectionLineType2["Bezier"] = "default";
	ConnectionLineType2["SimpleBezier"] = "simple-bezier";
	ConnectionLineType2["Straight"] = "straight";
	ConnectionLineType2["Step"] = "step";
	ConnectionLineType2["SmoothStep"] = "smoothstep";
	return ConnectionLineType2;
})(ConnectionLineType || {});
var ConnectionMode = /* @__PURE__ */ ((ConnectionMode2) => {
	ConnectionMode2["Strict"] = "strict";
	ConnectionMode2["Loose"] = "loose";
	return ConnectionMode2;
})(ConnectionMode || {});
var MarkerType = /* @__PURE__ */ ((MarkerType2) => {
	MarkerType2["Arrow"] = "arrow";
	MarkerType2["ArrowClosed"] = "arrowclosed";
	return MarkerType2;
})(MarkerType || {});
var PanOnScrollMode = /* @__PURE__ */ ((PanOnScrollMode2) => {
	PanOnScrollMode2["Free"] = "free";
	PanOnScrollMode2["Vertical"] = "vertical";
	PanOnScrollMode2["Horizontal"] = "horizontal";
	return PanOnScrollMode2;
})(PanOnScrollMode || {});
var inputTags = [
	"INPUT",
	"SELECT",
	"TEXTAREA"
];
var defaultDoc = typeof document !== "undefined" ? document : null;
function isInputDOMNode(event) {
	var _a, _b;
	const target = ((_b = (_a = event.composedPath) == null ? void 0 : _a.call(event)) == null ? void 0 : _b[0]) || event.target;
	const hasAttribute = typeof (target == null ? void 0 : target.hasAttribute) === "function" ? target.hasAttribute("contenteditable") : false;
	const closest = typeof (target == null ? void 0 : target.closest) === "function" ? target.closest(".nokey") : null;
	return inputTags.includes(target == null ? void 0 : target.nodeName) || hasAttribute || !!closest;
}
function wasModifierPressed(event) {
	return event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;
}
function isKeyMatch(pressedKey, keyToMatch, pressedKeys, isKeyUp) {
	const keyCombination = keyToMatch.replace("+", "\n").replace("\n\n", "\n+").split("\n").map((k) => k.trim().toLowerCase());
	if (keyCombination.length === 1) return pressedKey.toLowerCase() === keyToMatch.toLowerCase();
	if (!isKeyUp) pressedKeys.add(pressedKey.toLowerCase());
	const isMatch = keyCombination.every((key, index) => pressedKeys.has(key) && Array.from(pressedKeys.values())[index] === keyCombination[index]);
	if (isKeyUp) pressedKeys.delete(pressedKey.toLowerCase());
	return isMatch;
}
function createKeyPredicate(keyFilter, pressedKeys) {
	return (event) => {
		if (!event.code && !event.key) return false;
		const keyOrCode = useKeyOrCode(event.code, keyFilter);
		if (Array.isArray(keyFilter)) return keyFilter.some((key) => isKeyMatch(event[keyOrCode], key, pressedKeys, event.type === "keyup"));
		return isKeyMatch(event[keyOrCode], keyFilter, pressedKeys, event.type === "keyup");
	};
}
function useKeyOrCode(code, keysToWatch) {
	return keysToWatch.includes(code) ? "code" : "key";
}
function useKeyPress(keyFilter, options) {
	const target = computed(() => {
		var _toValue$;
		return (_toValue$ = toValue$1(options == null ? void 0 : options.target)) !== null && _toValue$ !== void 0 ? _toValue$ : defaultDoc;
	});
	const isPressed = shallowRef(toValue$1(keyFilter) === true);
	let modifierPressed = false;
	const pressedKeys = /* @__PURE__ */ new Set();
	let currentFilter = createKeyFilterFn(toValue$1(keyFilter));
	watch(() => toValue$1(keyFilter), (nextKeyFilter, previousKeyFilter) => {
		if (typeof previousKeyFilter === "boolean" && typeof nextKeyFilter !== "boolean") reset();
		currentFilter = createKeyFilterFn(nextKeyFilter);
	}, { immediate: true });
	useEventListener(["blur", "contextmenu"], reset);
	onKeyStroke((...args) => currentFilter(...args), (e) => {
		var _toValue$2, _toValue$3;
		var _a, _b;
		const actInsideInputWithModifier = (_toValue$2 = toValue$1(options == null ? void 0 : options.actInsideInputWithModifier)) !== null && _toValue$2 !== void 0 ? _toValue$2 : true;
		const preventDefault = (_toValue$3 = toValue$1(options == null ? void 0 : options.preventDefault)) !== null && _toValue$3 !== void 0 ? _toValue$3 : false;
		modifierPressed = wasModifierPressed(e);
		if ((!modifierPressed || modifierPressed && !actInsideInputWithModifier) && isInputDOMNode(e)) return;
		const target2 = ((_b = (_a = e.composedPath) == null ? void 0 : _a.call(e)) == null ? void 0 : _b[0]) || e.target;
		const isInteractiveElement = (target2 == null ? void 0 : target2.nodeName) === "BUTTON" || (target2 == null ? void 0 : target2.nodeName) === "A";
		if (!preventDefault && (modifierPressed || !isInteractiveElement)) e.preventDefault();
		isPressed.value = true;
	}, {
		eventName: "keydown",
		target
	});
	onKeyStroke((...args) => currentFilter(...args), (e) => {
		var _toValue$4;
		const actInsideInputWithModifier = (_toValue$4 = toValue$1(options == null ? void 0 : options.actInsideInputWithModifier)) !== null && _toValue$4 !== void 0 ? _toValue$4 : true;
		if (isPressed.value) {
			if ((!modifierPressed || modifierPressed && !actInsideInputWithModifier) && isInputDOMNode(e)) return;
			modifierPressed = false;
			isPressed.value = false;
		}
	}, {
		eventName: "keyup",
		target
	});
	function reset() {
		modifierPressed = false;
		pressedKeys.clear();
		isPressed.value = toValue$1(keyFilter) === true;
	}
	function createKeyFilterFn(keyFilter2) {
		if (keyFilter2 === null) {
			reset();
			return () => false;
		}
		if (typeof keyFilter2 === "boolean") {
			reset();
			isPressed.value = keyFilter2;
			return () => false;
		}
		if (Array.isArray(keyFilter2) || typeof keyFilter2 === "string") return createKeyPredicate(keyFilter2, pressedKeys);
		return keyFilter2;
	}
	return isPressed;
}
var ARIA_NODE_DESC_KEY = "vue-flow__node-desc";
var ARIA_EDGE_DESC_KEY = "vue-flow__edge-desc";
var ARIA_LIVE_MESSAGE = "vue-flow__aria-live";
var elementSelectionKeys = [
	"Enter",
	" ",
	"Escape"
];
var arrowKeyDiffs = {
	ArrowUp: {
		x: 0,
		y: -1
	},
	ArrowDown: {
		x: 0,
		y: 1
	},
	ArrowLeft: {
		x: -1,
		y: 0
	},
	ArrowRight: {
		x: 1,
		y: 0
	}
};
function nodeToRect(node) {
	return _objectSpread2(_objectSpread2({}, node.computedPosition || {
		x: 0,
		y: 0
	}), {}, {
		width: node.dimensions.width || 0,
		height: node.dimensions.height || 0
	});
}
function getOverlappingArea(rectA, rectB) {
	const xOverlap = Math.max(0, Math.min(rectA.x + rectA.width, rectB.x + rectB.width) - Math.max(rectA.x, rectB.x));
	const yOverlap = Math.max(0, Math.min(rectA.y + rectA.height, rectB.y + rectB.height) - Math.max(rectA.y, rectB.y));
	return Math.ceil(xOverlap * yOverlap);
}
function getDimensions(node) {
	return {
		width: node.offsetWidth,
		height: node.offsetHeight
	};
}
function clamp(val, min = 0, max = 1) {
	return Math.min(Math.max(val, min), max);
}
function clampPosition(position, extent) {
	return {
		x: clamp(position.x, extent[0][0], extent[1][0]),
		y: clamp(position.y, extent[0][1], extent[1][1])
	};
}
function getHostForElement(element) {
	const doc = element.getRootNode();
	if ("elementFromPoint" in doc) return doc;
	return window.document;
}
function isEdge(element) {
	return element && typeof element === "object" && "id" in element && "source" in element && "target" in element;
}
function isNode(element) {
	return element && typeof element === "object" && "id" in element && "position" in element && !isEdge(element);
}
function isGraphNode(element) {
	return isNode(element) && "computedPosition" in element;
}
function isNumeric(n) {
	return !Number.isNaN(n) && Number.isFinite(n);
}
function isRect(obj) {
	return isNumeric(obj.width) && isNumeric(obj.height) && isNumeric(obj.x) && isNumeric(obj.y);
}
function parseNode(node, existingNode, parentNode) {
	var _node$type;
	const initialState = {
		id: node.id.toString(),
		type: (_node$type = node.type) !== null && _node$type !== void 0 ? _node$type : "default",
		dimensions: markRaw({
			width: 0,
			height: 0
		}),
		computedPosition: markRaw(_objectSpread2({ z: 0 }, node.position)),
		handleBounds: {
			source: [],
			target: []
		},
		draggable: void 0,
		selectable: void 0,
		connectable: void 0,
		focusable: void 0,
		selected: false,
		dragging: false,
		resizing: false,
		initialized: false,
		isParent: false,
		position: {
			x: 0,
			y: 0
		},
		data: isDef(node.data) ? node.data : {},
		events: markRaw(isDef(node.events) ? node.events : {})
	};
	return Object.assign(existingNode !== null && existingNode !== void 0 ? existingNode : initialState, node, {
		id: node.id.toString(),
		parentNode
	});
}
function parseEdge(edge, existingEdge, defaultEdgeOptions) {
	var _ref, _edge$type, _edge$updatable, _edge$selectable, _edge$focusable, _edge$label, _edge$interactionWidt;
	var _a, _b;
	const initialState = _objectSpread2({
		id: edge.id.toString(),
		type: (_ref = (_edge$type = edge.type) !== null && _edge$type !== void 0 ? _edge$type : existingEdge == null ? void 0 : existingEdge.type) !== null && _ref !== void 0 ? _ref : "default",
		source: edge.source.toString(),
		target: edge.target.toString(),
		sourceHandle: (_a = edge.sourceHandle) == null ? void 0 : _a.toString(),
		targetHandle: (_b = edge.targetHandle) == null ? void 0 : _b.toString(),
		updatable: (_edge$updatable = edge.updatable) !== null && _edge$updatable !== void 0 ? _edge$updatable : defaultEdgeOptions == null ? void 0 : defaultEdgeOptions.updatable,
		selectable: (_edge$selectable = edge.selectable) !== null && _edge$selectable !== void 0 ? _edge$selectable : defaultEdgeOptions == null ? void 0 : defaultEdgeOptions.selectable,
		focusable: (_edge$focusable = edge.focusable) !== null && _edge$focusable !== void 0 ? _edge$focusable : defaultEdgeOptions == null ? void 0 : defaultEdgeOptions.focusable,
		data: isDef(edge.data) ? edge.data : {},
		events: markRaw(isDef(edge.events) ? edge.events : {}),
		label: (_edge$label = edge.label) !== null && _edge$label !== void 0 ? _edge$label : "",
		interactionWidth: (_edge$interactionWidt = edge.interactionWidth) !== null && _edge$interactionWidt !== void 0 ? _edge$interactionWidt : defaultEdgeOptions == null ? void 0 : defaultEdgeOptions.interactionWidth
	}, defaultEdgeOptions !== null && defaultEdgeOptions !== void 0 ? defaultEdgeOptions : {});
	return Object.assign(existingEdge !== null && existingEdge !== void 0 ? existingEdge : initialState, edge, { id: edge.id.toString() });
}
function getConnectedElements(nodeOrId, nodes, edges, dir) {
	const id2 = typeof nodeOrId === "string" ? nodeOrId : nodeOrId.id;
	const connectedIds = /* @__PURE__ */ new Set();
	const origin = dir === "source" ? "target" : "source";
	for (const edge of edges) if (edge[origin] === id2) connectedIds.add(edge[dir]);
	return nodes.filter((n) => connectedIds.has(n.id));
}
function getOutgoers(...args) {
	if (args.length === 3) {
		const [nodeOrId2, nodes, edges] = args;
		return getConnectedElements(nodeOrId2, nodes, edges, "target");
	}
	const [nodeOrId, elements] = args;
	const nodeId = typeof nodeOrId === "string" ? nodeOrId : nodeOrId.id;
	return elements.filter((el) => isEdge(el) && el.source === nodeId).map((edge) => elements.find((el) => isNode(el) && el.id === edge.target));
}
function getIncomers(...args) {
	if (args.length === 3) {
		const [nodeOrId2, nodes, edges] = args;
		return getConnectedElements(nodeOrId2, nodes, edges, "source");
	}
	const [nodeOrId, elements] = args;
	const nodeId = typeof nodeOrId === "string" ? nodeOrId : nodeOrId.id;
	return elements.filter((el) => isEdge(el) && el.target === nodeId).map((edge) => elements.find((el) => isNode(el) && el.id === edge.source));
}
function getEdgeId({ source, sourceHandle, target, targetHandle }) {
	return `vueflow__edge-${source}${sourceHandle !== null && sourceHandle !== void 0 ? sourceHandle : ""}-${target}${targetHandle !== null && targetHandle !== void 0 ? targetHandle : ""}`;
}
function connectionExists(edge, elements) {
	return elements.some((el) => isEdge(el) && el.source === edge.source && el.target === edge.target && (el.sourceHandle === edge.sourceHandle || !el.sourceHandle && !edge.sourceHandle) && (el.targetHandle === edge.targetHandle || !el.targetHandle && !edge.targetHandle));
}
function rendererPointToPoint({ x, y }, { x: tx, y: ty, zoom: tScale }) {
	return {
		x: x * tScale + tx,
		y: y * tScale + ty
	};
}
function pointToRendererPoint({ x, y }, { x: tx, y: ty, zoom: tScale }, snapToGrid = false, snapGrid = [1, 1]) {
	const position = {
		x: (x - tx) / tScale,
		y: (y - ty) / tScale
	};
	return snapToGrid ? snapPosition(position, snapGrid) : position;
}
function getBoundsOfBoxes(box1, box2) {
	return {
		x: Math.min(box1.x, box2.x),
		y: Math.min(box1.y, box2.y),
		x2: Math.max(box1.x2, box2.x2),
		y2: Math.max(box1.y2, box2.y2)
	};
}
function rectToBox({ x, y, width, height }) {
	return {
		x,
		y,
		x2: x + width,
		y2: y + height
	};
}
function boxToRect({ x, y, x2, y2 }) {
	return {
		x,
		y,
		width: x2 - x,
		height: y2 - y
	};
}
function getRectOfNodes(nodes) {
	let box = {
		x: Number.POSITIVE_INFINITY,
		y: Number.POSITIVE_INFINITY,
		x2: Number.NEGATIVE_INFINITY,
		y2: Number.NEGATIVE_INFINITY
	};
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		box = getBoundsOfBoxes(box, rectToBox(_objectSpread2(_objectSpread2({}, node.computedPosition), node.dimensions)));
	}
	return boxToRect(box);
}
function getNodesInside(nodes, rect, viewport = {
	x: 0,
	y: 0,
	zoom: 1
}, partially = false, excludeNonSelectableNodes = false) {
	const paneRect = _objectSpread2(_objectSpread2({}, pointToRendererPoint(rect, viewport)), {}, {
		width: rect.width / viewport.zoom,
		height: rect.height / viewport.zoom
	});
	const visibleNodes = [];
	for (const node of nodes) {
		var _ref2, _dimensions$width, _ref3, _dimensions$height;
		const { dimensions, selectable = true, hidden = false } = node;
		const width = (_ref2 = (_dimensions$width = dimensions.width) !== null && _dimensions$width !== void 0 ? _dimensions$width : node.width) !== null && _ref2 !== void 0 ? _ref2 : null;
		const height = (_ref3 = (_dimensions$height = dimensions.height) !== null && _dimensions$height !== void 0 ? _dimensions$height : node.height) !== null && _ref3 !== void 0 ? _ref3 : null;
		if (excludeNonSelectableNodes && !selectable || hidden) continue;
		const overlappingArea = getOverlappingArea(paneRect, nodeToRect(node));
		const notInitialized = width === null || height === null;
		const partiallyVisible = partially && overlappingArea > 0;
		const area = (width !== null && width !== void 0 ? width : 0) * (height !== null && height !== void 0 ? height : 0);
		if (notInitialized || partiallyVisible || overlappingArea >= area || node.dragging) visibleNodes.push(node);
	}
	return visibleNodes;
}
function getConnectedEdges(nodesOrId, edges) {
	const nodeIds = /* @__PURE__ */ new Set();
	if (typeof nodesOrId === "string") nodeIds.add(nodesOrId);
	else if (nodesOrId.length >= 1) for (const n of nodesOrId) nodeIds.add(n.id);
	return edges.filter((edge) => nodeIds.has(edge.source) || nodeIds.has(edge.target));
}
function parsePadding(padding, viewport) {
	if (typeof padding === "number") return Math.floor((viewport - viewport / (1 + padding)) * .5);
	if (typeof padding === "string" && padding.endsWith("px")) {
		const paddingValue = Number.parseFloat(padding);
		if (!Number.isNaN(paddingValue)) return Math.floor(paddingValue);
	}
	if (typeof padding === "string" && padding.endsWith("%")) {
		const paddingValue = Number.parseFloat(padding);
		if (!Number.isNaN(paddingValue)) return Math.floor(viewport * paddingValue * .01);
	}
	warn(`The padding value "${padding}" is invalid. Please provide a number or a string with a valid unit (px or %).`);
	return 0;
}
function parsePaddings(padding, width, height) {
	if (typeof padding === "string" || typeof padding === "number") {
		const paddingY = parsePadding(padding, height);
		const paddingX = parsePadding(padding, width);
		return {
			top: paddingY,
			right: paddingX,
			bottom: paddingY,
			left: paddingX,
			x: paddingX * 2,
			y: paddingY * 2
		};
	}
	if (typeof padding === "object") {
		var _ref4, _padding$top, _ref5, _padding$bottom, _ref6, _padding$left, _ref7, _padding$right;
		const top = parsePadding((_ref4 = (_padding$top = padding.top) !== null && _padding$top !== void 0 ? _padding$top : padding.y) !== null && _ref4 !== void 0 ? _ref4 : 0, height);
		const bottom = parsePadding((_ref5 = (_padding$bottom = padding.bottom) !== null && _padding$bottom !== void 0 ? _padding$bottom : padding.y) !== null && _ref5 !== void 0 ? _ref5 : 0, height);
		const left = parsePadding((_ref6 = (_padding$left = padding.left) !== null && _padding$left !== void 0 ? _padding$left : padding.x) !== null && _ref6 !== void 0 ? _ref6 : 0, width);
		const right = parsePadding((_ref7 = (_padding$right = padding.right) !== null && _padding$right !== void 0 ? _padding$right : padding.x) !== null && _ref7 !== void 0 ? _ref7 : 0, width);
		return {
			top,
			right,
			bottom,
			left,
			x: left + right,
			y: top + bottom
		};
	}
	return {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		x: 0,
		y: 0
	};
}
function calculateAppliedPaddings(bounds, x, y, zoom2, width, height) {
	const { x: left, y: top } = rendererPointToPoint(bounds, {
		x,
		y,
		zoom: zoom2
	});
	const { x: boundRight, y: boundBottom } = rendererPointToPoint({
		x: bounds.x + bounds.width,
		y: bounds.y + bounds.height
	}, {
		x,
		y,
		zoom: zoom2
	});
	const right = width - boundRight;
	const bottom = height - boundBottom;
	return {
		left: Math.floor(left),
		top: Math.floor(top),
		right: Math.floor(right),
		bottom: Math.floor(bottom)
	};
}
function getTransformForBounds(bounds, width, height, minZoom, maxZoom, padding = .1) {
	const p = parsePaddings(padding, width, height);
	const xZoom = (width - p.x) / bounds.width;
	const yZoom = (height - p.y) / bounds.height;
	const clampedZoom = clamp(Math.min(xZoom, yZoom), minZoom, maxZoom);
	const boundsCenterX = bounds.x + bounds.width / 2;
	const boundsCenterY = bounds.y + bounds.height / 2;
	const x = width / 2 - boundsCenterX * clampedZoom;
	const y = height / 2 - boundsCenterY * clampedZoom;
	const newPadding = calculateAppliedPaddings(bounds, x, y, clampedZoom, width, height);
	const offset = {
		left: Math.min(newPadding.left - p.left, 0),
		top: Math.min(newPadding.top - p.top, 0),
		right: Math.min(newPadding.right - p.right, 0),
		bottom: Math.min(newPadding.bottom - p.bottom, 0)
	};
	return {
		x: x - offset.left + offset.right,
		y: y - offset.top + offset.bottom,
		zoom: clampedZoom
	};
}
function getXYZPos(parentPos, computedPosition) {
	return {
		x: computedPosition.x + parentPos.x,
		y: computedPosition.y + parentPos.y,
		z: (parentPos.z > computedPosition.z ? parentPos.z : computedPosition.z) + 1
	};
}
function isParentSelected(node, nodeLookup) {
	if (!node.parentNode) return false;
	const parent = nodeLookup.get(node.parentNode);
	if (!parent) return false;
	if (parent.selected) return true;
	return isParentSelected(parent, nodeLookup);
}
function getMarkerId(marker, vueFlowId) {
	if (typeof marker === "undefined") return "";
	if (typeof marker === "string") return marker;
	return `${vueFlowId ? `${vueFlowId}__` : ""}${Object.keys(marker).sort().map((key) => `${key}=${marker[key]}`).join("&")}`;
}
function wheelDelta(event) {
	const factor = event.ctrlKey && isMacOs() ? 10 : 1;
	return -event.deltaY * (event.deltaMode === 1 ? .05 : event.deltaMode ? 1 : .002) * factor;
}
function calcAutoPanVelocity(value, min, max) {
	if (value < min) return clamp(Math.abs(value - min), 1, min) / min;
	if (value > max) return -clamp(Math.abs(value - max), 1, min) / min;
	return 0;
}
function calcAutoPan(pos, bounds, speed = 15, distance2 = 40) {
	return [calcAutoPanVelocity(pos.x, distance2, bounds.width - distance2) * speed, calcAutoPanVelocity(pos.y, distance2, bounds.height - distance2) * speed];
}
function handleParentExpand(updateItem, parent) {
	if (parent) {
		const extendWidth = updateItem.position.x + updateItem.dimensions.width - parent.dimensions.width;
		const extendHeight = updateItem.position.y + updateItem.dimensions.height - parent.dimensions.height;
		if (extendWidth > 0 || extendHeight > 0 || updateItem.position.x < 0 || updateItem.position.y < 0) {
			var _parentStyles$width, _parentStyles$height;
			let parentStyles = {};
			if (typeof parent.style === "function") parentStyles = _objectSpread2({}, parent.style(parent));
			else if (parent.style) parentStyles = _objectSpread2({}, parent.style);
			parentStyles.width = (_parentStyles$width = parentStyles.width) !== null && _parentStyles$width !== void 0 ? _parentStyles$width : `${parent.dimensions.width}px`;
			parentStyles.height = (_parentStyles$height = parentStyles.height) !== null && _parentStyles$height !== void 0 ? _parentStyles$height : `${parent.dimensions.height}px`;
			if (extendWidth > 0) {
				if (typeof parentStyles.width === "string") {
					const currWidth = Number(parentStyles.width.replace("px", ""));
					parentStyles.width = `${currWidth + extendWidth}px`;
				} else parentStyles.width += extendWidth;
			}
			if (extendHeight > 0) {
				if (typeof parentStyles.height === "string") {
					const currWidth = Number(parentStyles.height.replace("px", ""));
					parentStyles.height = `${currWidth + extendHeight}px`;
				} else parentStyles.height += extendHeight;
			}
			if (updateItem.position.x < 0) {
				const xDiff = Math.abs(updateItem.position.x);
				parent.position.x = parent.position.x - xDiff;
				if (typeof parentStyles.width === "string") {
					const currWidth = Number(parentStyles.width.replace("px", ""));
					parentStyles.width = `${currWidth + xDiff}px`;
				} else parentStyles.width += xDiff;
				updateItem.position.x = 0;
			}
			if (updateItem.position.y < 0) {
				const yDiff = Math.abs(updateItem.position.y);
				parent.position.y = parent.position.y - yDiff;
				if (typeof parentStyles.height === "string") {
					const currWidth = Number(parentStyles.height.replace("px", ""));
					parentStyles.height = `${currWidth + yDiff}px`;
				} else parentStyles.height += yDiff;
				updateItem.position.y = 0;
			}
			parent.dimensions.width = Number(parentStyles.width.toString().replace("px", ""));
			parent.dimensions.height = Number(parentStyles.height.toString().replace("px", ""));
			if (typeof parent.style === "function") parent.style = (p) => {
				const styleFunc = parent.style;
				return _objectSpread2(_objectSpread2({}, styleFunc(p)), parentStyles);
			};
			else parent.style = _objectSpread2(_objectSpread2({}, parent.style), parentStyles);
		}
	}
}
function applyChanges(changes, elements) {
	var _a, _b;
	const addRemoveChanges = changes.filter((c) => c.type === "add" || c.type === "remove");
	for (const change of addRemoveChanges) if (change.type === "add") {
		if (elements.findIndex((el) => el.id === change.item.id) === -1) elements.push(change.item);
	} else if (change.type === "remove") {
		const index = elements.findIndex((el) => el.id === change.id);
		if (index !== -1) elements.splice(index, 1);
	}
	const elementIds = elements.map((el) => el.id);
	for (const element of elements) for (const currentChange of changes) {
		if (currentChange.id !== element.id) continue;
		switch (currentChange.type) {
			case "select":
				element.selected = currentChange.selected;
				break;
			case "position":
				if (isGraphNode(element)) {
					if (typeof currentChange.position !== "undefined") element.position = currentChange.position;
					if (typeof currentChange.dragging !== "undefined") element.dragging = currentChange.dragging;
					if (element.expandParent && element.parentNode) {
						const parent = elements[elementIds.indexOf(element.parentNode)];
						if (parent && isGraphNode(parent)) handleParentExpand(element, parent);
					}
				}
				break;
			case "dimensions": if (isGraphNode(element)) {
				if (typeof currentChange.dimensions !== "undefined") element.dimensions = currentChange.dimensions;
				if (typeof currentChange.updateStyle !== "undefined" && currentChange.updateStyle) element.style = _objectSpread2(_objectSpread2({}, element.style || {}), {}, {
					width: `${(_a = currentChange.dimensions) == null ? void 0 : _a.width}px`,
					height: `${(_b = currentChange.dimensions) == null ? void 0 : _b.height}px`
				});
				if (typeof currentChange.resizing !== "undefined") element.resizing = currentChange.resizing;
				if (element.expandParent && element.parentNode) {
					const parent = elements[elementIds.indexOf(element.parentNode)];
					if (parent && isGraphNode(parent)) {
						if (!(!!parent.dimensions.width && !!parent.dimensions.height)) nextTick(() => {
							handleParentExpand(element, parent);
						});
						else handleParentExpand(element, parent);
					}
				}
			}
		}
	}
	return elements;
}
function createSelectionChange(id2, selected) {
	return {
		id: id2,
		type: "select",
		selected
	};
}
function createAdditionChange(item) {
	return {
		item,
		type: "add"
	};
}
function createNodeRemoveChange(id2) {
	return {
		id: id2,
		type: "remove"
	};
}
function createEdgeRemoveChange(id2, source, target, sourceHandle, targetHandle) {
	return {
		id: id2,
		source,
		target,
		sourceHandle: sourceHandle || null,
		targetHandle: targetHandle || null,
		type: "remove"
	};
}
function getSelectionChanges(items, selectedIds = /* @__PURE__ */ new Set(), mutateItem = false) {
	const changes = [];
	for (const [id2, item] of items) {
		const willBeSelected = selectedIds.has(id2);
		if (!(item.selected === void 0 && !willBeSelected) && item.selected !== willBeSelected) {
			if (mutateItem) item.selected = willBeSelected;
			changes.push(createSelectionChange(item.id, willBeSelected));
		}
	}
	return changes;
}
var noop$1 = () => {};
function createExtendedEventHook(defaultHandler) {
	const listeners = /* @__PURE__ */ new Set();
	let emitter = noop$1;
	let hasEmitListeners = () => false;
	const hasListeners = () => listeners.size > 0 || hasEmitListeners();
	const setEmitter = (fn) => {
		emitter = fn;
	};
	const removeEmitter = () => {
		emitter = noop$1;
	};
	const setHasEmitListeners = (fn) => {
		hasEmitListeners = fn;
	};
	const removeHasEmitListeners = () => {
		hasEmitListeners = () => false;
	};
	const off = (fn) => {
		listeners.delete(fn);
	};
	const on = (fn) => {
		listeners.add(fn);
		const offFn = () => off(fn);
		tryOnScopeDispose(offFn);
		return { off: offFn };
	};
	const trigger = (param) => {
		const queue = [emitter];
		if (hasListeners()) queue.push(...listeners);
		else if (defaultHandler) queue.push(defaultHandler);
		return Promise.allSettled(queue.map((fn) => fn(param)));
	};
	return {
		on,
		off,
		trigger,
		hasListeners,
		listeners,
		setEmitter,
		removeEmitter,
		setHasEmitListeners,
		removeHasEmitListeners
	};
}
function hasSelector(target, selector2, node) {
	let current = target;
	do {
		if (current && current.matches(selector2)) return true;
		else if (current === node) return false;
		current = current.parentElement;
	} while (current);
	return false;
}
function getDragItems(nodeLookup, nodesDraggable, mousePos, nodeId) {
	var _a, _b;
	const dragItems = /* @__PURE__ */ new Map();
	for (const [id2, node] of nodeLookup) if ((node.selected || node.id === nodeId) && (!node.parentNode || !isParentSelected(node, nodeLookup)) && (node.draggable || nodesDraggable && typeof node.draggable === "undefined")) {
		if (nodeLookup.get(id2)) dragItems.set(id2, {
			id: node.id,
			position: node.position || {
				x: 0,
				y: 0
			},
			distance: {
				x: mousePos.x - ((_a = node.computedPosition) == null ? void 0 : _a.x) || 0,
				y: mousePos.y - ((_b = node.computedPosition) == null ? void 0 : _b.y) || 0
			},
			from: {
				x: node.computedPosition.x,
				y: node.computedPosition.y
			},
			extent: node.extent,
			parentNode: node.parentNode,
			dimensions: _objectSpread2({}, node.dimensions),
			expandParent: node.expandParent
		});
	}
	return Array.from(dragItems.values());
}
function getEventHandlerParams({ id: id2, dragItems, findNode }) {
	const extendedDragItems = [];
	for (const dragItem of dragItems) {
		const node = findNode(dragItem.id);
		if (node) extendedDragItems.push(node);
	}
	return [id2 ? extendedDragItems.find((n) => n.id === id2) : extendedDragItems[0], extendedDragItems];
}
function getExtentPadding(padding) {
	if (Array.isArray(padding)) switch (padding.length) {
		case 1: return [
			padding[0],
			padding[0],
			padding[0],
			padding[0]
		];
		case 2: return [
			padding[0],
			padding[1],
			padding[0],
			padding[1]
		];
		case 3: return [
			padding[0],
			padding[1],
			padding[2],
			padding[1]
		];
		case 4: return padding;
		default: return [
			0,
			0,
			0,
			0
		];
	}
	return [
		padding,
		padding,
		padding,
		padding
	];
}
function getParentExtent(currentExtent, node, parent) {
	const [top, right, bottom, left] = typeof currentExtent !== "string" ? getExtentPadding(currentExtent.padding) : [
		0,
		0,
		0,
		0
	];
	if (parent && typeof parent.computedPosition.x !== "undefined" && typeof parent.computedPosition.y !== "undefined" && typeof parent.dimensions.width !== "undefined" && typeof parent.dimensions.height !== "undefined") return [[parent.computedPosition.x + left, parent.computedPosition.y + top], [parent.computedPosition.x + parent.dimensions.width - right, parent.computedPosition.y + parent.dimensions.height - bottom]];
	return false;
}
function getExtent(item, triggerError, extent, parent) {
	let currentExtent = item.extent || extent;
	if ((currentExtent === "parent" || !Array.isArray(currentExtent) && (currentExtent == null ? void 0 : currentExtent.range) === "parent") && !item.expandParent) {
		if (item.parentNode && parent && item.dimensions.width && item.dimensions.height) {
			const parentExtent = getParentExtent(currentExtent, item, parent);
			if (parentExtent) currentExtent = parentExtent;
		} else {
			triggerError(new VueFlowError(ErrorCode.NODE_EXTENT_INVALID, item.id));
			currentExtent = extent;
		}
	} else if (Array.isArray(currentExtent)) {
		const parentX = (parent == null ? void 0 : parent.computedPosition.x) || 0;
		const parentY = (parent == null ? void 0 : parent.computedPosition.y) || 0;
		currentExtent = [[currentExtent[0][0] + parentX, currentExtent[0][1] + parentY], [currentExtent[1][0] + parentX, currentExtent[1][1] + parentY]];
	} else if (currentExtent !== "parent" && (currentExtent == null ? void 0 : currentExtent.range) && Array.isArray(currentExtent.range)) {
		const [top, right, bottom, left] = getExtentPadding(currentExtent.padding);
		const parentX = (parent == null ? void 0 : parent.computedPosition.x) || 0;
		const parentY = (parent == null ? void 0 : parent.computedPosition.y) || 0;
		currentExtent = [[currentExtent.range[0][0] + parentX + left, currentExtent.range[0][1] + parentY + top], [currentExtent.range[1][0] + parentX - right, currentExtent.range[1][1] + parentY - bottom]];
	}
	return currentExtent === "parent" ? [[Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY], [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]] : currentExtent;
}
function clampNodeExtent({ width, height }, extent) {
	return [extent[0], [extent[1][0] - (width || 0), extent[1][1] - (height || 0)]];
}
function calcNextPosition(node, nextPosition, triggerError, nodeExtent, parentNode) {
	const clampedPos = clampPosition(nextPosition, clampNodeExtent(node.dimensions, getExtent(node, triggerError, nodeExtent, parentNode)));
	return {
		position: {
			x: clampedPos.x - ((parentNode == null ? void 0 : parentNode.computedPosition.x) || 0),
			y: clampedPos.y - ((parentNode == null ? void 0 : parentNode.computedPosition.y) || 0)
		},
		computedPosition: clampedPos
	};
}
function getHandlePosition(node, handle, fallbackPosition = Position.Left, center = false) {
	var _ref8, _ref9, _ref10;
	const x = ((_ref8 = handle == null ? void 0 : handle.x) !== null && _ref8 !== void 0 ? _ref8 : 0) + node.computedPosition.x;
	const y = ((_ref9 = handle == null ? void 0 : handle.y) !== null && _ref9 !== void 0 ? _ref9 : 0) + node.computedPosition.y;
	const { width, height } = handle !== null && handle !== void 0 ? handle : getNodeDimensions(node);
	if (center) return {
		x: x + width / 2,
		y: y + height / 2
	};
	switch ((_ref10 = handle == null ? void 0 : handle.position) !== null && _ref10 !== void 0 ? _ref10 : fallbackPosition) {
		case Position.Top: return {
			x: x + width / 2,
			y
		};
		case Position.Right: return {
			x: x + width,
			y: y + height / 2
		};
		case Position.Bottom: return {
			x: x + width / 2,
			y: y + height
		};
		case Position.Left: return {
			x,
			y: y + height / 2
		};
	}
}
function getEdgeHandle(bounds, handleId) {
	if (!bounds) return null;
	return (!handleId ? bounds[0] : bounds.find((d) => d.id === handleId)) || null;
}
function isEdgeVisible({ sourcePos, targetPos, sourceWidth, sourceHeight, targetWidth, targetHeight, width, height, viewport }) {
	const edgeBox = {
		x: Math.min(sourcePos.x, targetPos.x),
		y: Math.min(sourcePos.y, targetPos.y),
		x2: Math.max(sourcePos.x + sourceWidth, targetPos.x + targetWidth),
		y2: Math.max(sourcePos.y + sourceHeight, targetPos.y + targetHeight)
	};
	if (edgeBox.x === edgeBox.x2) edgeBox.x2 += 1;
	if (edgeBox.y === edgeBox.y2) edgeBox.y2 += 1;
	const viewBox = rectToBox({
		x: (0 - viewport.x) / viewport.zoom,
		y: (0 - viewport.y) / viewport.zoom,
		width: width / viewport.zoom,
		height: height / viewport.zoom
	});
	const xOverlap = Math.max(0, Math.min(viewBox.x2, edgeBox.x2) - Math.max(viewBox.x, edgeBox.x));
	const yOverlap = Math.max(0, Math.min(viewBox.y2, edgeBox.y2) - Math.max(viewBox.y, edgeBox.y));
	return Math.ceil(xOverlap * yOverlap) > 0;
}
function getEdgeZIndex(edge, findNode, elevateEdgesOnSelect = false) {
	const hasZIndex = typeof edge.zIndex === "number";
	let z = hasZIndex ? edge.zIndex : 0;
	const source = findNode(edge.source);
	const target = findNode(edge.target);
	if (!source || !target) return 0;
	if (elevateEdgesOnSelect) z = hasZIndex ? edge.zIndex : Math.max(source.computedPosition.z || 0, target.computedPosition.z || 0);
	return z;
}
var ErrorCode = /* @__PURE__ */ ((ErrorCode2) => {
	ErrorCode2["MISSING_STYLES"] = "MISSING_STYLES";
	ErrorCode2["MISSING_VIEWPORT_DIMENSIONS"] = "MISSING_VIEWPORT_DIMENSIONS";
	ErrorCode2["NODE_INVALID"] = "NODE_INVALID";
	ErrorCode2["NODE_NOT_FOUND"] = "NODE_NOT_FOUND";
	ErrorCode2["NODE_MISSING_PARENT"] = "NODE_MISSING_PARENT";
	ErrorCode2["NODE_TYPE_MISSING"] = "NODE_TYPE_MISSING";
	ErrorCode2["NODE_EXTENT_INVALID"] = "NODE_EXTENT_INVALID";
	ErrorCode2["EDGE_INVALID"] = "EDGE_INVALID";
	ErrorCode2["EDGE_NOT_FOUND"] = "EDGE_NOT_FOUND";
	ErrorCode2["EDGE_SOURCE_MISSING"] = "EDGE_SOURCE_MISSING";
	ErrorCode2["EDGE_TARGET_MISSING"] = "EDGE_TARGET_MISSING";
	ErrorCode2["EDGE_TYPE_MISSING"] = "EDGE_TYPE_MISSING";
	ErrorCode2["EDGE_SOURCE_TARGET_SAME"] = "EDGE_SOURCE_TARGET_SAME";
	ErrorCode2["EDGE_SOURCE_TARGET_MISSING"] = "EDGE_SOURCE_TARGET_MISSING";
	ErrorCode2["EDGE_ORPHANED"] = "EDGE_ORPHANED";
	ErrorCode2["USEVUEFLOW_OPTIONS"] = "USEVUEFLOW_OPTIONS";
	return ErrorCode2;
})(ErrorCode || {});
var messages = {
	["MISSING_STYLES"]: () => `It seems that you haven't loaded the necessary styles. Please import '@vue-flow/core/dist/style.css' to ensure that the graph is rendered correctly`,
	["MISSING_VIEWPORT_DIMENSIONS"]: () => "The Vue Flow parent container needs a width and a height to render the graph",
	["NODE_INVALID"]: (id2) => `Node is invalid
Node: ${id2}`,
	["NODE_NOT_FOUND"]: (id2) => `Node not found
Node: ${id2}`,
	["NODE_MISSING_PARENT"]: (id2, parentId) => `Node is missing a parent
Node: ${id2}
Parent: ${parentId}`,
	["NODE_TYPE_MISSING"]: (type) => `Node type is missing
Type: ${type}`,
	["NODE_EXTENT_INVALID"]: (id2) => `Only child nodes can use a parent extent
Node: ${id2}`,
	["EDGE_INVALID"]: (id2) => `An edge needs a source and a target
Edge: ${id2}`,
	["EDGE_SOURCE_MISSING"]: (id2, source) => `Edge source is missing
Edge: ${id2} 
Source: ${source}`,
	["EDGE_TARGET_MISSING"]: (id2, target) => `Edge target is missing
Edge: ${id2} 
Target: ${target}`,
	["EDGE_TYPE_MISSING"]: (type) => `Edge type is missing
Type: ${type}`,
	["EDGE_SOURCE_TARGET_SAME"]: (id2, source, target) => `Edge source and target are the same
Edge: ${id2} 
Source: ${source} 
Target: ${target}`,
	["EDGE_SOURCE_TARGET_MISSING"]: (id2, source, target) => `Edge source or target is missing
Edge: ${id2} 
Source: ${source} 
Target: ${target}`,
	["EDGE_ORPHANED"]: (id2) => `Edge was orphaned (suddenly missing source or target) and has been removed
Edge: ${id2}`,
	["EDGE_NOT_FOUND"]: (id2) => `Edge not found
Edge: ${id2}`,
	["USEVUEFLOW_OPTIONS"]: () => `The options parameter is deprecated and will be removed in the next major version. Please use the id parameter instead`
};
var VueFlowError = class extends Error {
	constructor(code, ...args) {
		var _a;
		super((_a = messages[code]) == null ? void 0 : _a.call(messages, ...args));
		this.name = "VueFlowError";
		this.code = code;
		this.args = args;
	}
};
function isMouseEvent(event) {
	return "clientX" in event;
}
function isUseDragEvent(event) {
	return "sourceEvent" in event;
}
function getEventPosition(event, bounds) {
	var _ref11, _ref12;
	const isMouse = isMouseEvent(event);
	let evtX;
	let evtY;
	if (isMouse) {
		evtX = event.clientX;
		evtY = event.clientY;
	} else if ("touches" in event && event.touches.length > 0) {
		evtX = event.touches[0].clientX;
		evtY = event.touches[0].clientY;
	} else if ("changedTouches" in event && event.changedTouches.length > 0) {
		evtX = event.changedTouches[0].clientX;
		evtY = event.changedTouches[0].clientY;
	} else {
		evtX = 0;
		evtY = 0;
	}
	return {
		x: evtX - ((_ref11 = bounds == null ? void 0 : bounds.left) !== null && _ref11 !== void 0 ? _ref11 : 0),
		y: evtY - ((_ref12 = bounds == null ? void 0 : bounds.top) !== null && _ref12 !== void 0 ? _ref12 : 0)
	};
}
var isMacOs = () => {
	var _a;
	return typeof navigator !== "undefined" && ((_a = navigator == null ? void 0 : navigator.userAgent) == null ? void 0 : _a.indexOf("Mac")) >= 0;
};
function getNodeDimensions(node) {
	var _ref13, _ref14, _ref15, _ref16;
	var _a, _b;
	return {
		width: (_ref13 = (_ref14 = (_a = node.dimensions) == null ? void 0 : _a.width) !== null && _ref14 !== void 0 ? _ref14 : node.width) !== null && _ref13 !== void 0 ? _ref13 : 0,
		height: (_ref15 = (_ref16 = (_b = node.dimensions) == null ? void 0 : _b.height) !== null && _ref16 !== void 0 ? _ref16 : node.height) !== null && _ref15 !== void 0 ? _ref15 : 0
	};
}
function snapPosition(position, snapGrid = [1, 1]) {
	return {
		x: snapGrid[0] * Math.round(position.x / snapGrid[0]),
		y: snapGrid[1] * Math.round(position.y / snapGrid[1])
	};
}
var alwaysValid$1 = () => true;
function resetRecentHandle(handleDomNode) {
	handleDomNode == null || handleDomNode.classList.remove("valid", "connecting", "vue-flow__handle-valid", "vue-flow__handle-connecting");
}
function getNodesWithinDistance(position, nodeLookup, distance2) {
	const nodes = [];
	const rect = {
		x: position.x - distance2,
		y: position.y - distance2,
		width: distance2 * 2,
		height: distance2 * 2
	};
	for (const node of nodeLookup.values()) if (getOverlappingArea(rect, nodeToRect(node)) > 0) nodes.push(node);
	return nodes;
}
var ADDITIONAL_DISTANCE = 250;
function getClosestHandle(position, connectionRadius, nodeLookup, fromHandle) {
	var _a, _b;
	let closestHandles = [];
	let minDistance = Number.POSITIVE_INFINITY;
	const closeNodes = getNodesWithinDistance(position, nodeLookup, connectionRadius + ADDITIONAL_DISTANCE);
	for (const node of closeNodes) {
		var _ref17, _ref18;
		const allHandles = [...(_ref17 = (_a = node.handleBounds) == null ? void 0 : _a.source) !== null && _ref17 !== void 0 ? _ref17 : [], ...(_ref18 = (_b = node.handleBounds) == null ? void 0 : _b.target) !== null && _ref18 !== void 0 ? _ref18 : []];
		for (const handle of allHandles) {
			if (fromHandle.nodeId === handle.nodeId && fromHandle.type === handle.type && fromHandle.id === handle.id) continue;
			const { x, y } = getHandlePosition(node, handle, handle.position, true);
			const distance2 = Math.sqrt(Math.pow(x - position.x, 2) + Math.pow(y - position.y, 2));
			if (distance2 > connectionRadius) continue;
			if (distance2 < minDistance) {
				closestHandles = [_objectSpread2(_objectSpread2({}, handle), {}, {
					x,
					y
				})];
				minDistance = distance2;
			} else if (distance2 === minDistance) closestHandles.push(_objectSpread2(_objectSpread2({}, handle), {}, {
				x,
				y
			}));
		}
	}
	if (!closestHandles.length) return null;
	if (closestHandles.length > 1) {
		var _closestHandles$find;
		const oppositeHandleType = fromHandle.type === "source" ? "target" : "source";
		return (_closestHandles$find = closestHandles.find((handle) => handle.type === oppositeHandleType)) !== null && _closestHandles$find !== void 0 ? _closestHandles$find : closestHandles[0];
	}
	return closestHandles[0];
}
function isValidHandle(event, { handle, connectionMode, fromNodeId, fromHandleId, fromType, doc, lib, flowId, isValidConnection = alwaysValid$1 }, edges, nodes, findNode, nodeLookup) {
	const isTarget = fromType === "target";
	const handleDomNode = handle ? doc.querySelector(`.${lib}-flow__handle[data-id="${flowId}-${handle == null ? void 0 : handle.nodeId}-${handle == null ? void 0 : handle.id}-${handle == null ? void 0 : handle.type}"]`) : null;
	const { x, y } = getEventPosition(event);
	const handleBelow = doc.elementFromPoint(x, y);
	const handleToCheck = (handleBelow == null ? void 0 : handleBelow.classList.contains(`${lib}-flow__handle`)) ? handleBelow : handleDomNode;
	const result = {
		handleDomNode: handleToCheck,
		isValid: false,
		connection: null,
		toHandle: null
	};
	if (handleToCheck) {
		const handleType = getHandleType(void 0, handleToCheck);
		const handleNodeId = handleToCheck.getAttribute("data-nodeid");
		const handleId = handleToCheck.getAttribute("data-handleid");
		const connectable = handleToCheck.classList.contains("connectable");
		const connectableEnd = handleToCheck.classList.contains("connectableend");
		if (!handleNodeId || !handleType) return result;
		const connection = {
			source: isTarget ? handleNodeId : fromNodeId,
			sourceHandle: isTarget ? handleId : fromHandleId,
			target: isTarget ? fromNodeId : handleNodeId,
			targetHandle: isTarget ? fromHandleId : handleId
		};
		result.connection = connection;
		result.isValid = connectable && connectableEnd && (connectionMode === ConnectionMode.Strict ? isTarget && handleType === "source" || !isTarget && handleType === "target" : handleNodeId !== fromNodeId || handleId !== fromHandleId) && isValidConnection(connection, {
			nodes,
			edges,
			sourceNode: findNode(connection.source),
			targetNode: findNode(connection.target)
		});
		result.toHandle = getHandle(handleNodeId, handleType, handleId, nodeLookup, connectionMode, true);
	}
	return result;
}
function getHandleType(edgeUpdaterType, handleDomNode) {
	if (edgeUpdaterType) return edgeUpdaterType;
	else if (handleDomNode == null ? void 0 : handleDomNode.classList.contains("target")) return "target";
	else if (handleDomNode == null ? void 0 : handleDomNode.classList.contains("source")) return "source";
	return null;
}
function getConnectionStatus(isInsideConnectionRadius, isHandleValid) {
	let connectionStatus = null;
	if (isHandleValid) connectionStatus = "valid";
	else if (isInsideConnectionRadius && !isHandleValid) connectionStatus = "invalid";
	return connectionStatus;
}
function isConnectionValid(isInsideConnectionRadius, isHandleValid) {
	let isValid = null;
	if (isHandleValid) isValid = true;
	else if (isInsideConnectionRadius && !isHandleValid) isValid = false;
	return isValid;
}
function getHandle(nodeId, handleType, handleId, nodeLookup, connectionMode, withAbsolutePosition = false) {
	var _ref19, _ref20, _ref21;
	var _a, _b, _c;
	const node = nodeLookup.get(nodeId);
	if (!node) return null;
	const handles = connectionMode === ConnectionMode.Strict ? (_a = node.handleBounds) == null ? void 0 : _a[handleType] : [...(_ref19 = (_b = node.handleBounds) == null ? void 0 : _b.source) !== null && _ref19 !== void 0 ? _ref19 : [], ...(_ref20 = (_c = node.handleBounds) == null ? void 0 : _c.target) !== null && _ref20 !== void 0 ? _ref20 : []];
	const handle = (_ref21 = handleId ? handles == null ? void 0 : handles.find((h2) => h2.id === handleId) : handles == null ? void 0 : handles[0]) !== null && _ref21 !== void 0 ? _ref21 : null;
	return handle && withAbsolutePosition ? _objectSpread2(_objectSpread2({}, handle), getHandlePosition(node, handle, handle.position, true)) : handle;
}
var oppositePosition = {
	[Position.Left]: Position.Right,
	[Position.Right]: Position.Left,
	[Position.Top]: Position.Bottom,
	[Position.Bottom]: Position.Top
};
var productionEnvs = ["production", "prod"];
function warn(message, ...args) {
	if (isDev()) console.warn(`[Vue Flow]: ${message}`, ...args);
}
function isDev() {
	return !productionEnvs.includes("production");
}
function getHandleBounds(type, nodeElement, nodeBounds, zoom2, nodeId) {
	const handles = nodeElement.querySelectorAll(`.vue-flow__handle.${type}`);
	if (!(handles == null ? void 0 : handles.length)) return null;
	return Array.from(handles).map((handle) => {
		const handleBounds = handle.getBoundingClientRect();
		return _objectSpread2({
			id: handle.getAttribute("data-handleid"),
			type,
			nodeId,
			position: handle.getAttribute("data-handlepos"),
			x: (handleBounds.left - nodeBounds.left) / zoom2,
			y: (handleBounds.top - nodeBounds.top) / zoom2
		}, getDimensions(handle));
	});
}
function handleNodeClick(node, multiSelectionActive, addSelectedNodes, removeSelectedNodes, nodesSelectionActive, unselect = false, nodeEl) {
	nodesSelectionActive.value = false;
	if (!node.selected) addSelectedNodes([node]);
	else if (unselect || node.selected && multiSelectionActive) {
		removeSelectedNodes([node]);
		nextTick(() => {
			nodeEl.blur();
		});
	}
}
function isDef(val) {
	return typeof unref(val) !== "undefined";
}
function addEdgeToStore(edgeParams, edges, triggerError, defaultEdgeOptions) {
	if (!edgeParams || !edgeParams.source || !edgeParams.target) {
		var _ref22;
		triggerError(new VueFlowError(ErrorCode.EDGE_INVALID, (_ref22 = edgeParams == null ? void 0 : edgeParams.id) !== null && _ref22 !== void 0 ? _ref22 : `[ID UNKNOWN]`));
		return false;
	}
	let edge;
	if (isEdge(edgeParams)) edge = edgeParams;
	else edge = _objectSpread2(_objectSpread2({}, edgeParams), {}, { id: getEdgeId(edgeParams) });
	edge = parseEdge(edge, void 0, defaultEdgeOptions);
	if (connectionExists(edge, edges)) return false;
	return edge;
}
function updateEdgeAction(edge, newConnection, prevEdge, shouldReplaceId, triggerError) {
	if (!newConnection.source || !newConnection.target) {
		triggerError(new VueFlowError(ErrorCode.EDGE_INVALID, edge.id));
		return false;
	}
	if (!prevEdge) {
		triggerError(new VueFlowError(ErrorCode.EDGE_NOT_FOUND, edge.id));
		return false;
	}
	const { id: id2 } = edge, rest = _objectWithoutProperties(edge, _excluded3);
	return _objectSpread2(_objectSpread2({}, rest), {}, {
		id: shouldReplaceId ? getEdgeId(newConnection) : id2,
		source: newConnection.source,
		target: newConnection.target,
		sourceHandle: newConnection.sourceHandle,
		targetHandle: newConnection.targetHandle
	});
}
function createGraphNodes(nodes, findNode, triggerError) {
	const parentNodes = {};
	const nextNodes = [];
	for (let i = 0; i < nodes.length; ++i) {
		const node = nodes[i];
		if (!isNode(node)) {
			triggerError(new VueFlowError(ErrorCode.NODE_INVALID, node == null ? void 0 : node.id));
			continue;
		}
		const parsed = parseNode(node, findNode(node.id), node.parentNode);
		if (node.parentNode) parentNodes[node.parentNode] = true;
		nextNodes[i] = parsed;
	}
	for (const node of nextNodes) {
		const parentNode = findNode(node.parentNode) || nextNodes.find((n) => n.id === node.parentNode);
		if (node.parentNode && !parentNode) triggerError(new VueFlowError(ErrorCode.NODE_MISSING_PARENT, node.id, node.parentNode));
		if (node.parentNode || parentNodes[node.id]) {
			if (parentNodes[node.id]) node.isParent = true;
			if (parentNode) parentNode.isParent = true;
		}
	}
	return nextNodes;
}
function addConnectionToLookup(type, connection, connectionKey, connectionLookup, nodeId, handleId) {
	let key = nodeId;
	const nodeMap = connectionLookup.get(key) || /* @__PURE__ */ new Map();
	connectionLookup.set(key, nodeMap.set(connectionKey, connection));
	key = `${nodeId}-${type}`;
	const typeMap = connectionLookup.get(key) || /* @__PURE__ */ new Map();
	connectionLookup.set(key, typeMap.set(connectionKey, connection));
	if (handleId) {
		key = `${nodeId}-${type}-${handleId}`;
		const handleMap = connectionLookup.get(key) || /* @__PURE__ */ new Map();
		connectionLookup.set(key, handleMap.set(connectionKey, connection));
	}
}
function updateConnectionLookup(connectionLookup, edgeLookup, edges) {
	connectionLookup.clear();
	for (const edge of edges) {
		const { source: sourceNode, target: targetNode, sourceHandle = null, targetHandle = null } = edge;
		const connection = {
			edgeId: edge.id,
			source: sourceNode,
			target: targetNode,
			sourceHandle,
			targetHandle
		};
		const sourceKey = `${sourceNode}-${sourceHandle}--${targetNode}-${targetHandle}`;
		addConnectionToLookup("source", connection, `${targetNode}-${targetHandle}--${sourceNode}-${sourceHandle}`, connectionLookup, sourceNode, sourceHandle);
		addConnectionToLookup("target", connection, sourceKey, connectionLookup, targetNode, targetHandle);
	}
}
function areSetsEqual(a, b) {
	if (a.size !== b.size) return false;
	for (const item of a) if (!b.has(item)) return false;
	return true;
}
function createGraphEdges(nextEdges, isValidConnection, findNode, findEdge, onError, defaultEdgeOptions, nodes, edges) {
	const validEdges = [];
	for (const edgeOrConnection of nextEdges) {
		const edge = isEdge(edgeOrConnection) ? edgeOrConnection : addEdgeToStore(edgeOrConnection, edges, onError, defaultEdgeOptions);
		if (!edge) continue;
		const sourceNode = findNode(edge.source);
		const targetNode = findNode(edge.target);
		if (!sourceNode || !targetNode) {
			onError(new VueFlowError(ErrorCode.EDGE_SOURCE_TARGET_MISSING, edge.id, edge.source, edge.target));
			continue;
		}
		if (!sourceNode) {
			onError(new VueFlowError(ErrorCode.EDGE_SOURCE_MISSING, edge.id, edge.source));
			continue;
		}
		if (!targetNode) {
			onError(new VueFlowError(ErrorCode.EDGE_TARGET_MISSING, edge.id, edge.target));
			continue;
		}
		if (isValidConnection) {
			if (!isValidConnection(edge, {
				edges,
				nodes,
				sourceNode,
				targetNode
			})) {
				onError(new VueFlowError(ErrorCode.EDGE_INVALID, edge.id));
				continue;
			}
		}
		const existingEdge = findEdge(edge.id);
		validEdges.push(_objectSpread2(_objectSpread2({}, parseEdge(edge, existingEdge, defaultEdgeOptions)), {}, {
			sourceNode,
			targetNode
		}));
	}
	return validEdges;
}
var VueFlow = Symbol("vueFlow");
var NodeId = Symbol("nodeId");
var NodeRef = Symbol("nodeRef");
var EdgeId = Symbol("edgeId");
var EdgeRef = Symbol("edgeRef");
var Slots = Symbol("slots");
function useDrag(params) {
	const { vueFlowRef, snapToGrid, snapGrid, noDragClassName, nodeLookup, nodeExtent, nodeDragThreshold, viewport, autoPanOnNodeDrag, autoPanSpeed, nodesDraggable, panBy, findNode, multiSelectionActive, nodesSelectionActive, selectNodesOnDrag, removeSelectedElements, addSelectedNodes, updateNodePositions, emits } = useVueFlow();
	const { onStart, onDrag, onStop, onClick, el, disabled, id: id2, selectable, dragHandle } = params;
	const dragging = shallowRef(false);
	let dragItems = [];
	let dragHandler;
	let containerBounds = null;
	let lastPos = {
		x: void 0,
		y: void 0
	};
	let mousePosition = {
		x: 0,
		y: 0
	};
	let dragEvent = null;
	let dragStarted = false;
	let nodePositionsChanged = false;
	let autoPanId = 0;
	let autoPanStarted = false;
	const getPointerPosition = useGetPointerPosition();
	const updateNodes = ({ x, y }) => {
		lastPos = {
			x,
			y
		};
		let hasChange = false;
		dragItems = dragItems.map((n) => {
			const nextPosition = {
				x: x - n.distance.x,
				y: y - n.distance.y
			};
			const { computedPosition } = calcNextPosition(n, snapToGrid.value ? snapPosition(nextPosition, snapGrid.value) : nextPosition, emits.error, nodeExtent.value, n.parentNode ? findNode(n.parentNode) : void 0);
			hasChange = hasChange || n.position.x !== computedPosition.x || n.position.y !== computedPosition.y;
			n.position = computedPosition;
			return n;
		});
		nodePositionsChanged = nodePositionsChanged || hasChange;
		if (!hasChange) return;
		updateNodePositions(dragItems, true, true);
		dragging.value = true;
		if (dragEvent) {
			const [currentNode, nodes] = getEventHandlerParams({
				id: id2,
				dragItems,
				findNode
			});
			onDrag({
				event: dragEvent,
				node: currentNode,
				nodes
			});
		}
	};
	const autoPan = () => {
		if (!containerBounds) return;
		const [xMovement, yMovement] = calcAutoPan(mousePosition, containerBounds, autoPanSpeed.value);
		if (xMovement !== 0 || yMovement !== 0) {
			var _lastPos$x, _lastPos$y;
			const nextPos = {
				x: ((_lastPos$x = lastPos.x) !== null && _lastPos$x !== void 0 ? _lastPos$x : 0) - xMovement / viewport.value.zoom,
				y: ((_lastPos$y = lastPos.y) !== null && _lastPos$y !== void 0 ? _lastPos$y : 0) - yMovement / viewport.value.zoom
			};
			if (panBy({
				x: xMovement,
				y: yMovement
			})) updateNodes(nextPos);
		}
		autoPanId = requestAnimationFrame(autoPan);
	};
	const startDrag = (event, nodeEl) => {
		dragStarted = true;
		const node = findNode(id2);
		if (!selectNodesOnDrag.value && !multiSelectionActive.value && node) {
			if (!node.selected) removeSelectedElements();
		}
		if (node && toValue$1(selectable) && selectNodesOnDrag.value) handleNodeClick(node, multiSelectionActive.value, addSelectedNodes, removeSelectedElements, nodesSelectionActive, false, nodeEl);
		const pointerPos = getPointerPosition(event.sourceEvent);
		lastPos = pointerPos;
		dragItems = getDragItems(nodeLookup.value, nodesDraggable.value, pointerPos, id2);
		if (dragItems.length) {
			const [currentNode, nodes] = getEventHandlerParams({
				id: id2,
				dragItems,
				findNode
			});
			onStart({
				event: event.sourceEvent,
				node: currentNode,
				nodes
			});
		}
	};
	const eventStart = (event, nodeEl) => {
		var _a;
		if (event.sourceEvent.type === "touchmove" && event.sourceEvent.touches.length > 1) return;
		nodePositionsChanged = false;
		if (nodeDragThreshold.value === 0) startDrag(event, nodeEl);
		lastPos = getPointerPosition(event.sourceEvent);
		containerBounds = ((_a = vueFlowRef.value) == null ? void 0 : _a.getBoundingClientRect()) || null;
		mousePosition = getEventPosition(event.sourceEvent, containerBounds);
	};
	const eventDrag = (event, nodeEl) => {
		const pointerPos = getPointerPosition(event.sourceEvent);
		if (!autoPanStarted && dragStarted && autoPanOnNodeDrag.value) {
			autoPanStarted = true;
			autoPan();
		}
		if (!dragStarted) {
			var _lastPos$x2, _lastPos$y2;
			const x = pointerPos.xSnapped - ((_lastPos$x2 = lastPos.x) !== null && _lastPos$x2 !== void 0 ? _lastPos$x2 : 0);
			const y = pointerPos.ySnapped - ((_lastPos$y2 = lastPos.y) !== null && _lastPos$y2 !== void 0 ? _lastPos$y2 : 0);
			if (Math.sqrt(x * x + y * y) > nodeDragThreshold.value) startDrag(event, nodeEl);
		}
		if ((lastPos.x !== pointerPos.xSnapped || lastPos.y !== pointerPos.ySnapped) && dragItems.length && dragStarted) {
			dragEvent = event.sourceEvent;
			mousePosition = getEventPosition(event.sourceEvent, containerBounds);
			updateNodes(pointerPos);
		}
	};
	const eventEnd = (event) => {
		let isClick = false;
		if (!dragStarted && !dragging.value && !multiSelectionActive.value) {
			var _lastPos$x3, _lastPos$y3;
			const evt = event.sourceEvent;
			const pointerPos = getPointerPosition(evt);
			const x = pointerPos.xSnapped - ((_lastPos$x3 = lastPos.x) !== null && _lastPos$x3 !== void 0 ? _lastPos$x3 : 0);
			const y = pointerPos.ySnapped - ((_lastPos$y3 = lastPos.y) !== null && _lastPos$y3 !== void 0 ? _lastPos$y3 : 0);
			const distance2 = Math.sqrt(x * x + y * y);
			if (distance2 !== 0 && distance2 <= nodeDragThreshold.value) {
				onClick == null || onClick(evt);
				isClick = true;
			}
		}
		if (dragItems.length && !isClick) {
			if (nodePositionsChanged) {
				updateNodePositions(dragItems, false, false);
				nodePositionsChanged = false;
			}
			const [currentNode, nodes] = getEventHandlerParams({
				id: id2,
				dragItems,
				findNode
			});
			onStop({
				event: event.sourceEvent,
				node: currentNode,
				nodes
			});
		}
		dragItems = [];
		dragging.value = false;
		autoPanStarted = false;
		dragStarted = false;
		lastPos = {
			x: void 0,
			y: void 0
		};
		cancelAnimationFrame(autoPanId);
	};
	watch([() => toValue$1(disabled), el], ([isDisabled, nodeEl], _, onCleanup) => {
		if (nodeEl) {
			const selection2 = select(nodeEl);
			if (!isDisabled) {
				dragHandler = drag().on("start", (event) => eventStart(event, nodeEl)).on("drag", (event) => eventDrag(event, nodeEl)).on("end", (event) => eventEnd(event)).filter((event) => {
					const target = event.target;
					const unrefDragHandle = toValue$1(dragHandle);
					return !event.button && (!noDragClassName.value || !hasSelector(target, `.${noDragClassName.value}`, nodeEl) && (!unrefDragHandle || hasSelector(target, unrefDragHandle, nodeEl)));
				});
				selection2.call(dragHandler);
			}
			onCleanup(() => {
				selection2.on(".drag", null);
				if (dragHandler) {
					dragHandler.on("start", null);
					dragHandler.on("drag", null);
					dragHandler.on("end", null);
				}
			});
		}
	});
	return dragging;
}
function createEdgeHooks() {
	return {
		doubleClick: createExtendedEventHook(),
		click: createExtendedEventHook(),
		mouseEnter: createExtendedEventHook(),
		mouseMove: createExtendedEventHook(),
		mouseLeave: createExtendedEventHook(),
		contextMenu: createExtendedEventHook(),
		updateStart: createExtendedEventHook(),
		update: createExtendedEventHook(),
		updateEnd: createExtendedEventHook()
	};
}
function useEdgeHooks(edge, emits) {
	const edgeHooks = createEdgeHooks();
	edgeHooks.doubleClick.on((event) => {
		var _a, _b;
		emits.edgeDoubleClick(event);
		(_b = (_a = edge.events) == null ? void 0 : _a.doubleClick) == null || _b.call(_a, event);
	});
	edgeHooks.click.on((event) => {
		var _a, _b;
		emits.edgeClick(event);
		(_b = (_a = edge.events) == null ? void 0 : _a.click) == null || _b.call(_a, event);
	});
	edgeHooks.mouseEnter.on((event) => {
		var _a, _b;
		emits.edgeMouseEnter(event);
		(_b = (_a = edge.events) == null ? void 0 : _a.mouseEnter) == null || _b.call(_a, event);
	});
	edgeHooks.mouseMove.on((event) => {
		var _a, _b;
		emits.edgeMouseMove(event);
		(_b = (_a = edge.events) == null ? void 0 : _a.mouseMove) == null || _b.call(_a, event);
	});
	edgeHooks.mouseLeave.on((event) => {
		var _a, _b;
		emits.edgeMouseLeave(event);
		(_b = (_a = edge.events) == null ? void 0 : _a.mouseLeave) == null || _b.call(_a, event);
	});
	edgeHooks.contextMenu.on((event) => {
		var _a, _b;
		emits.edgeContextMenu(event);
		(_b = (_a = edge.events) == null ? void 0 : _a.contextMenu) == null || _b.call(_a, event);
	});
	edgeHooks.updateStart.on((event) => {
		var _a, _b;
		emits.edgeUpdateStart(event);
		(_b = (_a = edge.events) == null ? void 0 : _a.updateStart) == null || _b.call(_a, event);
	});
	edgeHooks.update.on((event) => {
		var _a, _b;
		emits.edgeUpdate(event);
		(_b = (_a = edge.events) == null ? void 0 : _a.update) == null || _b.call(_a, event);
	});
	edgeHooks.updateEnd.on((event) => {
		var _a, _b;
		emits.edgeUpdateEnd(event);
		(_b = (_a = edge.events) == null ? void 0 : _a.updateEnd) == null || _b.call(_a, event);
	});
	return Object.entries(edgeHooks).reduce((hooks, [key, value]) => {
		hooks.emit[key] = value.trigger;
		hooks.on[key] = value.on;
		return hooks;
	}, {
		emit: {},
		on: {}
	});
}
function useGetPointerPosition() {
	const { viewport, snapGrid, snapToGrid, vueFlowRef } = useVueFlow();
	return (event) => {
		var _ref23;
		var _a;
		const containerBounds = (_ref23 = (_a = vueFlowRef.value) == null ? void 0 : _a.getBoundingClientRect()) !== null && _ref23 !== void 0 ? _ref23 : {
			left: 0,
			top: 0
		};
		const { x, y } = getEventPosition(isUseDragEvent(event) ? event.sourceEvent : event, containerBounds);
		const pointerPos = pointToRendererPoint({
			x,
			y
		}, viewport.value);
		const { x: xSnapped, y: ySnapped } = snapToGrid.value ? snapPosition(pointerPos, snapGrid.value) : pointerPos;
		return _objectSpread2({
			xSnapped,
			ySnapped
		}, pointerPos);
	};
}
function alwaysValid() {
	return true;
}
function useHandle({ handleId, nodeId, type, isValidConnection, edgeUpdaterType, onEdgeUpdate, onEdgeUpdateEnd }) {
	const { id: flowId, vueFlowRef, connectionMode, connectionRadius, connectOnClick, connectionClickStartHandle, nodesConnectable, autoPanOnConnect, autoPanSpeed, findNode, panBy, startConnection, updateConnection, endConnection, emits, viewport, edges, nodes, isValidConnection: isValidConnectionProp, nodeLookup } = useVueFlow();
	let connection = null;
	let isValid = false;
	let handleDomNode = null;
	function handlePointerDown(event) {
		var _a;
		const isTarget = toValue$1(type) === "target";
		const isMouseTriggered = isMouseEvent(event);
		const doc = getHostForElement(event.target);
		const clickedHandle = event.currentTarget;
		if (clickedHandle && (isMouseTriggered && event.button === 0 || !isMouseTriggered)) {
			let onPointerMove = function(event2) {
				var _closestHandle;
				connectionPosition = getEventPosition(event2, containerBounds);
				closestHandle = getClosestHandle(pointToRendererPoint(connectionPosition, viewport.value, false, [1, 1]), connectionRadius.value, nodeLookup.value, fromHandle);
				if (!autoPanStarted) {
					autoPan();
					autoPanStarted = true;
				}
				const result = isValidHandle(event2, {
					handle: closestHandle,
					connectionMode: connectionMode.value,
					fromNodeId: toValue$1(nodeId),
					fromHandleId: toValue$1(handleId),
					fromType: isTarget ? "target" : "source",
					isValidConnection: isValidConnectionHandler,
					doc,
					lib: "vue",
					flowId,
					nodeLookup: nodeLookup.value
				}, edges.value, nodes.value, findNode, nodeLookup.value);
				handleDomNode = result.handleDomNode;
				connection = result.connection;
				isValid = isConnectionValid(!!closestHandle, result.isValid);
				const newConnection2 = _objectSpread2(_objectSpread2({}, previousConnection), {}, {
					isValid,
					to: result.toHandle && isValid ? rendererPointToPoint({
						x: result.toHandle.x,
						y: result.toHandle.y
					}, viewport.value) : connectionPosition,
					toHandle: result.toHandle,
					toPosition: isValid && result.toHandle ? result.toHandle.position : oppositePosition[fromHandle.position],
					toNode: result.toHandle ? nodeLookup.value.get(result.toHandle.nodeId) : null
				});
				if (isValid && closestHandle && (previousConnection == null ? void 0 : previousConnection.toHandle) && newConnection2.toHandle && previousConnection.toHandle.type === newConnection2.toHandle.type && previousConnection.toHandle.nodeId === newConnection2.toHandle.nodeId && previousConnection.toHandle.id === newConnection2.toHandle.id && previousConnection.to.x === newConnection2.to.x && previousConnection.to.y === newConnection2.to.y) return;
				const connectingHandle = (_closestHandle = closestHandle) !== null && _closestHandle !== void 0 ? _closestHandle : result.toHandle;
				updateConnection(connectingHandle && isValid ? rendererPointToPoint({
					x: connectingHandle.x,
					y: connectingHandle.y
				}, viewport.value) : connectionPosition, connectingHandle, getConnectionStatus(!!connectingHandle, isValid));
				previousConnection = newConnection2;
				if (!closestHandle && !isValid && !handleDomNode) return resetRecentHandle(prevActiveHandle);
				if (connection && connection.source !== connection.target && handleDomNode) {
					resetRecentHandle(prevActiveHandle);
					prevActiveHandle = handleDomNode;
					handleDomNode.classList.add("connecting", "vue-flow__handle-connecting");
					handleDomNode.classList.toggle("valid", !!isValid);
					handleDomNode.classList.toggle("vue-flow__handle-valid", !!isValid);
				}
			}, onPointerUp = function(event2) {
				if ("touches" in event2 && event2.touches.length > 0) return;
				if ((closestHandle || handleDomNode) && connection && isValid) {
					if (!onEdgeUpdate) emits.connect(connection);
					else onEdgeUpdate(event2, connection);
				}
				emits.connectEnd(event2);
				if (edgeUpdaterType) onEdgeUpdateEnd == null || onEdgeUpdateEnd(event2);
				resetRecentHandle(prevActiveHandle);
				cancelAnimationFrame(autoPanId);
				endConnection(event2);
				autoPanStarted = false;
				isValid = false;
				connection = null;
				handleDomNode = null;
				doc.removeEventListener("mousemove", onPointerMove);
				doc.removeEventListener("mouseup", onPointerUp);
				doc.removeEventListener("touchmove", onPointerMove);
				doc.removeEventListener("touchend", onPointerUp);
			};
			const node = findNode(toValue$1(nodeId));
			let isValidConnectionHandler = toValue$1(isValidConnection) || isValidConnectionProp.value || alwaysValid;
			if (!isValidConnectionHandler && node) isValidConnectionHandler = (!isTarget ? node.isValidTargetPos : node.isValidSourcePos) || alwaysValid;
			let closestHandle;
			let autoPanId = 0;
			const { x, y } = getEventPosition(event);
			const handleType = getHandleType(toValue$1(edgeUpdaterType), clickedHandle);
			const containerBounds = (_a = vueFlowRef.value) == null ? void 0 : _a.getBoundingClientRect();
			if (!containerBounds || !handleType) return;
			const fromHandleInternal = getHandle(toValue$1(nodeId), handleType, toValue$1(handleId), nodeLookup.value, connectionMode.value);
			if (!fromHandleInternal) return;
			let prevActiveHandle;
			let connectionPosition = getEventPosition(event, containerBounds);
			let autoPanStarted = false;
			const autoPan = () => {
				if (!autoPanOnConnect.value) return;
				const [xMovement, yMovement] = calcAutoPan(connectionPosition, containerBounds, autoPanSpeed.value);
				panBy({
					x: xMovement,
					y: yMovement
				});
				autoPanId = requestAnimationFrame(autoPan);
			};
			const fromHandle = _objectSpread2(_objectSpread2({}, fromHandleInternal), {}, {
				nodeId: toValue$1(nodeId),
				type: handleType,
				position: fromHandleInternal.position
			});
			const fromNodeInternal = nodeLookup.value.get(toValue$1(nodeId));
			const newConnection = {
				inProgress: true,
				isValid: null,
				from: getHandlePosition(fromNodeInternal, fromHandle, Position.Left, true),
				fromHandle,
				fromPosition: fromHandle.position,
				fromNode: fromNodeInternal,
				to: connectionPosition,
				toHandle: null,
				toPosition: oppositePosition[fromHandle.position],
				toNode: null
			};
			startConnection(_objectSpread2({
				nodeId: toValue$1(nodeId),
				id: toValue$1(handleId),
				type: handleType,
				position: (clickedHandle == null ? void 0 : clickedHandle.getAttribute("data-handlepos")) || Position.Top
			}, connectionPosition), {
				x: x - containerBounds.left,
				y: y - containerBounds.top
			});
			emits.connectStart({
				event,
				nodeId: toValue$1(nodeId),
				handleId: toValue$1(handleId),
				handleType
			});
			let previousConnection = newConnection;
			doc.addEventListener("mousemove", onPointerMove);
			doc.addEventListener("mouseup", onPointerUp);
			doc.addEventListener("touchmove", onPointerMove);
			doc.addEventListener("touchend", onPointerUp);
		}
	}
	function handleClick(event) {
		var _connectionClickStart;
		var _a, _b;
		if (!connectOnClick.value) return;
		const isTarget = toValue$1(type) === "target";
		if (!connectionClickStartHandle.value) {
			emits.clickConnectStart({
				event,
				nodeId: toValue$1(nodeId),
				handleId: toValue$1(handleId)
			});
			startConnection(_objectSpread2({
				nodeId: toValue$1(nodeId),
				type: toValue$1(type),
				id: toValue$1(handleId),
				position: Position.Top
			}, getEventPosition(event)), void 0, true);
			return;
		}
		let isValidConnectionHandler = toValue$1(isValidConnection) || isValidConnectionProp.value || alwaysValid;
		const node = findNode(toValue$1(nodeId));
		if (!isValidConnectionHandler && node) isValidConnectionHandler = (!isTarget ? node.isValidTargetPos : node.isValidSourcePos) || alwaysValid;
		if (node && (typeof node.connectable === "undefined" ? nodesConnectable.value : node.connectable) === false) return;
		const doc = getHostForElement(event.target);
		const result = isValidHandle(event, {
			handle: _objectSpread2({
				nodeId: toValue$1(nodeId),
				id: toValue$1(handleId),
				type: toValue$1(type),
				position: Position.Top
			}, getEventPosition(event)),
			connectionMode: connectionMode.value,
			fromNodeId: connectionClickStartHandle.value.nodeId,
			fromHandleId: (_connectionClickStart = connectionClickStartHandle.value.id) !== null && _connectionClickStart !== void 0 ? _connectionClickStart : null,
			fromType: connectionClickStartHandle.value.type,
			isValidConnection: isValidConnectionHandler,
			doc,
			lib: "vue",
			flowId,
			nodeLookup: nodeLookup.value
		}, edges.value, nodes.value, findNode, nodeLookup.value);
		const isOwnHandle = ((_a = result.connection) == null ? void 0 : _a.source) === ((_b = result.connection) == null ? void 0 : _b.target);
		if (result.isValid && result.connection && !isOwnHandle) emits.connect(result.connection);
		emits.clickConnectEnd(event);
		endConnection(event, true);
	}
	return {
		handlePointerDown,
		handleClick
	};
}
function useNodeId() {
	return inject(NodeId, "");
}
function useNode(id2) {
	var _ref24;
	const nodeId = (_ref24 = id2 !== null && id2 !== void 0 ? id2 : useNodeId()) !== null && _ref24 !== void 0 ? _ref24 : "";
	const nodeEl = inject(NodeRef, ref(null));
	const { findNode, edges, emits } = useVueFlow();
	const node = findNode(nodeId);
	if (!node) emits.error(new VueFlowError(ErrorCode.NODE_NOT_FOUND, nodeId));
	return {
		id: nodeId,
		nodeEl,
		node,
		parentNode: computed(() => findNode(node.parentNode)),
		connectedEdges: computed(() => getConnectedEdges([node], edges.value))
	};
}
function createNodeHooks() {
	return {
		doubleClick: createExtendedEventHook(),
		click: createExtendedEventHook(),
		mouseEnter: createExtendedEventHook(),
		mouseMove: createExtendedEventHook(),
		mouseLeave: createExtendedEventHook(),
		contextMenu: createExtendedEventHook(),
		dragStart: createExtendedEventHook(),
		drag: createExtendedEventHook(),
		dragStop: createExtendedEventHook()
	};
}
function useNodeHooks(node, emits) {
	const nodeHooks = createNodeHooks();
	nodeHooks.doubleClick.on((event) => {
		var _a, _b;
		emits.nodeDoubleClick(event);
		(_b = (_a = node.events) == null ? void 0 : _a.doubleClick) == null || _b.call(_a, event);
	});
	nodeHooks.click.on((event) => {
		var _a, _b;
		emits.nodeClick(event);
		(_b = (_a = node.events) == null ? void 0 : _a.click) == null || _b.call(_a, event);
	});
	nodeHooks.mouseEnter.on((event) => {
		var _a, _b;
		emits.nodeMouseEnter(event);
		(_b = (_a = node.events) == null ? void 0 : _a.mouseEnter) == null || _b.call(_a, event);
	});
	nodeHooks.mouseMove.on((event) => {
		var _a, _b;
		emits.nodeMouseMove(event);
		(_b = (_a = node.events) == null ? void 0 : _a.mouseMove) == null || _b.call(_a, event);
	});
	nodeHooks.mouseLeave.on((event) => {
		var _a, _b;
		emits.nodeMouseLeave(event);
		(_b = (_a = node.events) == null ? void 0 : _a.mouseLeave) == null || _b.call(_a, event);
	});
	nodeHooks.contextMenu.on((event) => {
		var _a, _b;
		emits.nodeContextMenu(event);
		(_b = (_a = node.events) == null ? void 0 : _a.contextMenu) == null || _b.call(_a, event);
	});
	nodeHooks.dragStart.on((event) => {
		var _a, _b;
		emits.nodeDragStart(event);
		(_b = (_a = node.events) == null ? void 0 : _a.dragStart) == null || _b.call(_a, event);
	});
	nodeHooks.drag.on((event) => {
		var _a, _b;
		emits.nodeDrag(event);
		(_b = (_a = node.events) == null ? void 0 : _a.drag) == null || _b.call(_a, event);
	});
	nodeHooks.dragStop.on((event) => {
		var _a, _b;
		emits.nodeDragStop(event);
		(_b = (_a = node.events) == null ? void 0 : _a.dragStop) == null || _b.call(_a, event);
	});
	return Object.entries(nodeHooks).reduce((hooks, [key, value]) => {
		hooks.emit[key] = value.trigger;
		hooks.on[key] = value.on;
		return hooks;
	}, {
		emit: {},
		on: {}
	});
}
function useUpdateNodePositions() {
	const { getSelectedNodes, nodeExtent, updateNodePositions, findNode, snapGrid, snapToGrid, nodesDraggable, emits } = useVueFlow();
	return (positionDiff, isShiftPressed = false) => {
		const xVelo = snapToGrid.value ? snapGrid.value[0] : 5;
		const yVelo = snapToGrid.value ? snapGrid.value[1] : 5;
		const factor = isShiftPressed ? 4 : 1;
		const positionDiffX = positionDiff.x * xVelo * factor;
		const positionDiffY = positionDiff.y * yVelo * factor;
		const nodeUpdates = [];
		for (const node of getSelectedNodes.value) if (node.draggable || nodesDraggable && typeof node.draggable === "undefined") {
			const { position } = calcNextPosition(node, {
				x: node.computedPosition.x + positionDiffX,
				y: node.computedPosition.y + positionDiffY
			}, emits.error, nodeExtent.value, node.parentNode ? findNode(node.parentNode) : void 0);
			nodeUpdates.push({
				id: node.id,
				position,
				from: node.position,
				distance: {
					x: positionDiff.x,
					y: positionDiff.y
				},
				dimensions: node.dimensions
			});
		}
		updateNodePositions(nodeUpdates, true, false);
	};
}
var DEFAULT_PADDING = .1;
var defaultEase = (t) => ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
function noop() {
	warn("Viewport not initialized yet.");
	return Promise.resolve(false);
}
var initialViewportHelper = {
	zoomIn: noop,
	zoomOut: noop,
	zoomTo: noop,
	fitView: noop,
	setCenter: noop,
	fitBounds: noop,
	project: (position) => position,
	screenToFlowCoordinate: (position) => position,
	flowToScreenCoordinate: (position) => position,
	setViewport: noop,
	setTransform: noop,
	getViewport: () => ({
		x: 0,
		y: 0,
		zoom: 1
	}),
	getTransform: () => ({
		x: 0,
		y: 0,
		zoom: 1
	}),
	viewportInitialized: false
};
function useViewportHelper(state) {
	function zoom2(scale, transitionOptions) {
		return new Promise((resolve) => {
			if (state.d3Selection && state.d3Zoom) state.d3Zoom.interpolate((transitionOptions == null ? void 0 : transitionOptions.interpolate) === "linear" ? interpolate$1 : interpolateZoom).scaleBy(getD3Transition(state.d3Selection, transitionOptions == null ? void 0 : transitionOptions.duration, transitionOptions == null ? void 0 : transitionOptions.ease, () => {
				resolve(true);
			}), scale);
			else resolve(false);
		});
	}
	function transformViewport(x, y, zoom22, transitionOptions) {
		return new Promise((resolve) => {
			var _a;
			const { x: clampedX, y: clampedY } = clampPosition({
				x: -x,
				y: -y
			}, state.translateExtent);
			const nextTransform = identity.translate(-clampedX, -clampedY).scale(zoom22);
			if (state.d3Selection && state.d3Zoom) (_a = state.d3Zoom) == null || _a.interpolate((transitionOptions == null ? void 0 : transitionOptions.interpolate) === "linear" ? interpolate$1 : interpolateZoom).transform(getD3Transition(state.d3Selection, transitionOptions == null ? void 0 : transitionOptions.duration, transitionOptions == null ? void 0 : transitionOptions.ease, () => {
				resolve(true);
			}), nextTransform);
			else resolve(false);
		});
	}
	return computed(() => {
		if (!(state.d3Zoom && state.d3Selection && state.dimensions.width && state.dimensions.height)) return initialViewportHelper;
		return {
			viewportInitialized: true,
			zoomIn: (options) => {
				return zoom2(1.2, options);
			},
			zoomOut: (options) => {
				return zoom2(1 / 1.2, options);
			},
			zoomTo: (zoomLevel, options) => {
				return new Promise((resolve) => {
					if (state.d3Selection && state.d3Zoom) state.d3Zoom.interpolate((options == null ? void 0 : options.interpolate) === "linear" ? interpolate$1 : interpolateZoom).scaleTo(getD3Transition(state.d3Selection, options == null ? void 0 : options.duration, options == null ? void 0 : options.ease, () => {
						resolve(true);
					}), zoomLevel);
					else resolve(false);
				});
			},
			setViewport: (transform, options) => {
				return transformViewport(transform.x, transform.y, transform.zoom, options);
			},
			setTransform: (transform, options) => {
				return transformViewport(transform.x, transform.y, transform.zoom, options);
			},
			getViewport: () => ({
				x: state.viewport.x,
				y: state.viewport.y,
				zoom: state.viewport.zoom
			}),
			getTransform: () => {
				return {
					x: state.viewport.x,
					y: state.viewport.y,
					zoom: state.viewport.zoom
				};
			},
			fitView: (options = {
				padding: DEFAULT_PADDING,
				includeHiddenNodes: false,
				duration: 0
			}) => {
				var _options$minZoom, _options$maxZoom, _options$padding;
				var _a, _b;
				const nodesToFit = [];
				for (const node of state.nodes) if (node.dimensions.width && node.dimensions.height && ((options == null ? void 0 : options.includeHiddenNodes) || !node.hidden)) {
					if (!((_a = options.nodes) == null ? void 0 : _a.length) || ((_b = options.nodes) == null ? void 0 : _b.length) && options.nodes.includes(node.id)) nodesToFit.push(node);
				}
				if (!nodesToFit.length) return Promise.resolve(false);
				const { x, y, zoom: zoom22 } = getTransformForBounds(getRectOfNodes(nodesToFit), state.dimensions.width, state.dimensions.height, (_options$minZoom = options.minZoom) !== null && _options$minZoom !== void 0 ? _options$minZoom : state.minZoom, (_options$maxZoom = options.maxZoom) !== null && _options$maxZoom !== void 0 ? _options$maxZoom : state.maxZoom, (_options$padding = options.padding) !== null && _options$padding !== void 0 ? _options$padding : DEFAULT_PADDING);
				return transformViewport(x, y, zoom22, options);
			},
			setCenter: (x, y, options) => {
				const nextZoom = typeof (options == null ? void 0 : options.zoom) !== "undefined" ? options.zoom : state.maxZoom;
				return transformViewport(state.dimensions.width / 2 - x * nextZoom, state.dimensions.height / 2 - y * nextZoom, nextZoom, options);
			},
			fitBounds: (bounds, options = { padding: DEFAULT_PADDING }) => {
				var _options$padding2;
				const { x, y, zoom: zoom22 } = getTransformForBounds(bounds, state.dimensions.width, state.dimensions.height, state.minZoom, state.maxZoom, (_options$padding2 = options.padding) !== null && _options$padding2 !== void 0 ? _options$padding2 : DEFAULT_PADDING);
				return transformViewport(x, y, zoom22, options);
			},
			project: (position) => pointToRendererPoint(position, state.viewport, state.snapToGrid, state.snapGrid),
			screenToFlowCoordinate: (position) => {
				if (state.vueFlowRef) {
					const { x: domX, y: domY } = state.vueFlowRef.getBoundingClientRect();
					return pointToRendererPoint({
						x: position.x - domX,
						y: position.y - domY
					}, state.viewport, state.snapToGrid, state.snapGrid);
				}
				return {
					x: 0,
					y: 0
				};
			},
			flowToScreenCoordinate: (position) => {
				if (state.vueFlowRef) {
					const { x: domX, y: domY } = state.vueFlowRef.getBoundingClientRect();
					return rendererPointToPoint({
						x: position.x + domX,
						y: position.y + domY
					}, state.viewport);
				}
				return {
					x: 0,
					y: 0
				};
			}
		};
	});
}
function getD3Transition(selection2, duration = 0, ease = defaultEase, onEnd = () => {}) {
	const hasDuration = typeof duration === "number" && duration > 0;
	if (!hasDuration) onEnd();
	return hasDuration ? selection2.transition().duration(duration).ease(ease).on("end", onEnd) : selection2;
}
function useWatchProps(models, props, store) {
	const scope = effectScope(true);
	scope.run(() => {
		const watchModelValue = () => {
			scope.run(() => {
				let pauseModel;
				let pauseStore;
				let immediateStore = !!(store.nodes.value.length || store.edges.value.length);
				pauseModel = watchPausable([models.modelValue, () => {
					var _a, _b;
					return (_b = (_a = models.modelValue) == null ? void 0 : _a.value) == null ? void 0 : _b.length;
				}], ([elements]) => {
					if (elements && Array.isArray(elements)) {
						pauseStore == null || pauseStore.pause();
						store.setElements(elements);
						if (!pauseStore && !immediateStore && elements.length) immediateStore = true;
						else pauseStore == null || pauseStore.resume();
					}
				});
				pauseStore = watchPausable([
					store.nodes,
					store.edges,
					() => store.edges.value.length,
					() => store.nodes.value.length
				], ([nodes, edges]) => {
					var _a;
					if (((_a = models.modelValue) == null ? void 0 : _a.value) && Array.isArray(models.modelValue.value)) {
						pauseModel == null || pauseModel.pause();
						models.modelValue.value = [...nodes, ...edges];
						nextTick(() => {
							pauseModel == null || pauseModel.resume();
						});
					}
				}, { immediate: immediateStore });
				onScopeDispose(() => {
					pauseModel == null || pauseModel.stop();
					pauseStore == null || pauseStore.stop();
				});
			});
		};
		const watchNodesValue = () => {
			scope.run(() => {
				let pauseModel;
				let pauseStore;
				let immediateStore = !!store.nodes.value.length;
				pauseModel = watchPausable([models.nodes, () => {
					var _a, _b;
					return (_b = (_a = models.nodes) == null ? void 0 : _a.value) == null ? void 0 : _b.length;
				}], ([nodes]) => {
					if (nodes && Array.isArray(nodes)) {
						pauseStore == null || pauseStore.pause();
						store.setNodes(nodes);
						if (!pauseStore && !immediateStore && nodes.length) immediateStore = true;
						else pauseStore == null || pauseStore.resume();
					}
				});
				pauseStore = watchPausable([store.nodes, () => store.nodes.value.length], ([nodes]) => {
					var _a;
					if (((_a = models.nodes) == null ? void 0 : _a.value) && Array.isArray(models.nodes.value)) {
						pauseModel == null || pauseModel.pause();
						models.nodes.value = [...nodes];
						nextTick(() => {
							pauseModel == null || pauseModel.resume();
						});
					}
				}, { immediate: immediateStore });
				onScopeDispose(() => {
					pauseModel == null || pauseModel.stop();
					pauseStore == null || pauseStore.stop();
				});
			});
		};
		const watchEdgesValue = () => {
			scope.run(() => {
				let pauseModel;
				let pauseStore;
				let immediateStore = !!store.edges.value.length;
				pauseModel = watchPausable([models.edges, () => {
					var _a, _b;
					return (_b = (_a = models.edges) == null ? void 0 : _a.value) == null ? void 0 : _b.length;
				}], ([edges]) => {
					if (edges && Array.isArray(edges)) {
						pauseStore == null || pauseStore.pause();
						store.setEdges(edges);
						if (!pauseStore && !immediateStore && edges.length) immediateStore = true;
						else pauseStore == null || pauseStore.resume();
					}
				});
				pauseStore = watchPausable([store.edges, () => store.edges.value.length], ([edges]) => {
					var _a;
					if (((_a = models.edges) == null ? void 0 : _a.value) && Array.isArray(models.edges.value)) {
						pauseModel == null || pauseModel.pause();
						models.edges.value = [...edges];
						nextTick(() => {
							pauseModel == null || pauseModel.resume();
						});
					}
				}, { immediate: immediateStore });
				onScopeDispose(() => {
					pauseModel == null || pauseModel.stop();
					pauseStore == null || pauseStore.stop();
				});
			});
		};
		const watchMaxZoom = () => {
			scope.run(() => {
				watch(() => props.maxZoom, () => {
					if (props.maxZoom && isDef(props.maxZoom)) store.setMaxZoom(props.maxZoom);
				}, { immediate: true });
			});
		};
		const watchMinZoom = () => {
			scope.run(() => {
				watch(() => props.minZoom, () => {
					if (props.minZoom && isDef(props.minZoom)) store.setMinZoom(props.minZoom);
				}, { immediate: true });
			});
		};
		const watchTranslateExtent = () => {
			scope.run(() => {
				watch(() => props.translateExtent, () => {
					if (props.translateExtent && isDef(props.translateExtent)) store.setTranslateExtent(props.translateExtent);
				}, { immediate: true });
			});
		};
		const watchNodeExtent = () => {
			scope.run(() => {
				watch(() => props.nodeExtent, () => {
					if (props.nodeExtent && isDef(props.nodeExtent)) store.setNodeExtent(props.nodeExtent);
				}, { immediate: true });
			});
		};
		const watchApplyDefault = () => {
			scope.run(() => {
				watch(() => props.applyDefault, () => {
					if (isDef(props.applyDefault)) store.applyDefault.value = props.applyDefault;
				}, { immediate: true });
			});
		};
		const watchAutoConnect = () => {
			scope.run(() => {
				const autoConnector = function() {
					var _ref25 = _asyncToGenerator(function* (params) {
						let connection = params;
						if (typeof props.autoConnect === "function") connection = yield props.autoConnect(params);
						if (connection !== false) store.addEdges([connection]);
					});
					return function autoConnector(_x) {
						return _ref25.apply(this, arguments);
					};
				}();
				watch(() => props.autoConnect, () => {
					if (isDef(props.autoConnect)) store.autoConnect.value = props.autoConnect;
				}, { immediate: true });
				watch(store.autoConnect, (autoConnectEnabled, _, onCleanup) => {
					if (autoConnectEnabled) store.onConnect(autoConnector);
					else store.hooks.value.connect.off(autoConnector);
					onCleanup(() => {
						store.hooks.value.connect.off(autoConnector);
					});
				}, { immediate: true });
			});
		};
		const watchRest = () => {
			const skip = [
				"id",
				"modelValue",
				"translateExtent",
				"nodeExtent",
				"edges",
				"nodes",
				"maxZoom",
				"minZoom",
				"applyDefault",
				"autoConnect"
			];
			for (const key of Object.keys(props)) {
				const propKey = key;
				if (!skip.includes(propKey)) {
					const propValue = toRef(() => props[propKey]);
					const storeRef = store[propKey];
					if (isRef(storeRef)) scope.run(() => {
						watch(propValue, (nextValue) => {
							if (isDef(nextValue)) storeRef.value = nextValue;
						}, { immediate: true });
					});
				}
			}
		};
		const runAll = () => {
			watchModelValue();
			watchNodesValue();
			watchEdgesValue();
			watchMinZoom();
			watchMaxZoom();
			watchTranslateExtent();
			watchNodeExtent();
			watchApplyDefault();
			watchAutoConnect();
			watchRest();
		};
		runAll();
	});
	return () => scope.stop();
}
function createHooks() {
	return {
		edgesChange: createExtendedEventHook(),
		nodesChange: createExtendedEventHook(),
		nodeDoubleClick: createExtendedEventHook(),
		nodeClick: createExtendedEventHook(),
		nodeMouseEnter: createExtendedEventHook(),
		nodeMouseMove: createExtendedEventHook(),
		nodeMouseLeave: createExtendedEventHook(),
		nodeContextMenu: createExtendedEventHook(),
		nodeDragStart: createExtendedEventHook(),
		nodeDrag: createExtendedEventHook(),
		nodeDragStop: createExtendedEventHook(),
		nodesInitialized: createExtendedEventHook(),
		miniMapNodeClick: createExtendedEventHook(),
		miniMapNodeDoubleClick: createExtendedEventHook(),
		miniMapNodeMouseEnter: createExtendedEventHook(),
		miniMapNodeMouseMove: createExtendedEventHook(),
		miniMapNodeMouseLeave: createExtendedEventHook(),
		connect: createExtendedEventHook(),
		connectStart: createExtendedEventHook(),
		connectEnd: createExtendedEventHook(),
		clickConnectStart: createExtendedEventHook(),
		clickConnectEnd: createExtendedEventHook(),
		paneReady: createExtendedEventHook(),
		init: createExtendedEventHook(),
		move: createExtendedEventHook(),
		moveStart: createExtendedEventHook(),
		moveEnd: createExtendedEventHook(),
		selectionDragStart: createExtendedEventHook(),
		selectionDrag: createExtendedEventHook(),
		selectionDragStop: createExtendedEventHook(),
		selectionContextMenu: createExtendedEventHook(),
		selectionStart: createExtendedEventHook(),
		selectionEnd: createExtendedEventHook(),
		viewportChangeStart: createExtendedEventHook(),
		viewportChange: createExtendedEventHook(),
		viewportChangeEnd: createExtendedEventHook(),
		paneScroll: createExtendedEventHook(),
		paneClick: createExtendedEventHook(),
		paneContextMenu: createExtendedEventHook(),
		paneMouseEnter: createExtendedEventHook(),
		paneMouseMove: createExtendedEventHook(),
		paneMouseLeave: createExtendedEventHook(),
		edgeContextMenu: createExtendedEventHook(),
		edgeMouseEnter: createExtendedEventHook(),
		edgeMouseMove: createExtendedEventHook(),
		edgeMouseLeave: createExtendedEventHook(),
		edgeDoubleClick: createExtendedEventHook(),
		edgeClick: createExtendedEventHook(),
		edgeUpdateStart: createExtendedEventHook(),
		edgeUpdate: createExtendedEventHook(),
		edgeUpdateEnd: createExtendedEventHook(),
		updateNodeInternals: createExtendedEventHook(),
		error: createExtendedEventHook((err) => warn(err.message))
	};
}
function useHooks(emit, hooks) {
	const inst = getCurrentInstance();
	onBeforeMount(() => {
		for (const [key, value] of Object.entries(hooks.value)) {
			const listener = (data) => {
				emit(key, data);
			};
			value.setEmitter(listener);
			tryOnScopeDispose(value.removeEmitter);
			value.setHasEmitListeners(() => hasVNodeListener(key));
			tryOnScopeDispose(value.removeHasEmitListeners);
		}
	});
	function hasVNodeListener(event) {
		var _a;
		const key = toHandlerKey(event);
		return !!((_a = inst == null ? void 0 : inst.vnode.props) == null ? void 0 : _a[key]);
	}
}
function toHandlerKey(event) {
	const [head, ...rest] = event.split(":");
	return `on${head.replace(/(?:^|-)(\w)/g, (_, c) => c.toUpperCase())}${rest.length ? `:${rest.join(":")}` : ""}`;
}
function useState() {
	return {
		vueFlowRef: null,
		viewportRef: null,
		nodes: [],
		edges: [],
		connectionLookup: /* @__PURE__ */ new Map(),
		nodeTypes: {},
		edgeTypes: {},
		initialized: false,
		dimensions: {
			width: 0,
			height: 0
		},
		viewport: {
			x: 0,
			y: 0,
			zoom: 1
		},
		d3Zoom: null,
		d3Selection: null,
		d3ZoomHandler: null,
		minZoom: .5,
		maxZoom: 2,
		translateExtent: [[Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY], [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]],
		nodeExtent: [[Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY], [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]],
		selectionMode: SelectionMode.Full,
		paneDragging: false,
		preventScrolling: true,
		zoomOnScroll: true,
		zoomOnPinch: true,
		zoomOnDoubleClick: true,
		panOnScroll: false,
		panOnScrollSpeed: .5,
		panOnScrollMode: PanOnScrollMode.Free,
		paneClickDistance: 0,
		panOnDrag: true,
		edgeUpdaterRadius: 10,
		onlyRenderVisibleElements: false,
		defaultViewport: {
			x: 0,
			y: 0,
			zoom: 1
		},
		nodesSelectionActive: false,
		userSelectionActive: false,
		userSelectionRect: null,
		defaultMarkerColor: "#b1b1b7",
		connectionLineStyle: {},
		connectionLineType: null,
		connectionLineOptions: {
			type: ConnectionLineType.Bezier,
			style: {}
		},
		connectionMode: ConnectionMode.Loose,
		connectionStartHandle: null,
		connectionEndHandle: null,
		connectionClickStartHandle: null,
		connectionPosition: {
			x: NaN,
			y: NaN
		},
		connectionRadius: 20,
		connectOnClick: true,
		connectionStatus: null,
		isValidConnection: null,
		snapGrid: [15, 15],
		snapToGrid: false,
		edgesUpdatable: false,
		edgesFocusable: true,
		nodesFocusable: true,
		nodesConnectable: true,
		nodesDraggable: true,
		nodeDragThreshold: 1,
		elementsSelectable: true,
		selectNodesOnDrag: true,
		multiSelectionActive: false,
		selectionKeyCode: "Shift",
		multiSelectionKeyCode: isMacOs() ? "Meta" : "Control",
		zoomActivationKeyCode: isMacOs() ? "Meta" : "Control",
		deleteKeyCode: "Backspace",
		panActivationKeyCode: "Space",
		hooks: createHooks(),
		applyDefault: true,
		autoConnect: false,
		fitViewOnInit: false,
		fitViewOnInitDone: false,
		noDragClassName: "nodrag",
		noWheelClassName: "nowheel",
		noPanClassName: "nopan",
		defaultEdgeOptions: void 0,
		elevateEdgesOnSelect: false,
		elevateNodesOnSelect: true,
		autoPanOnNodeDrag: true,
		autoPanOnConnect: true,
		autoPanSpeed: 15,
		disableKeyboardA11y: false,
		ariaLiveMessage: ""
	};
}
var storeOptionsToSkip = [
	"id",
	"vueFlowRef",
	"viewportRef",
	"initialized",
	"modelValue",
	"nodes",
	"edges",
	"maxZoom",
	"minZoom",
	"translateExtent",
	"hooks",
	"defaultEdgeOptions"
];
function useActions(state, nodeLookup, edgeLookup) {
	const viewportHelper = useViewportHelper(state);
	const updateNodeInternals = (ids) => {
		const updateIds = ids !== null && ids !== void 0 ? ids : [];
		state.hooks.updateNodeInternals.trigger(updateIds);
	};
	const getIncomers$1 = (nodeOrId) => {
		return getIncomers(nodeOrId, state.nodes, state.edges);
	};
	const getOutgoers$1 = (nodeOrId) => {
		return getOutgoers(nodeOrId, state.nodes, state.edges);
	};
	const getConnectedEdges$1 = (nodesOrId) => {
		return getConnectedEdges(nodesOrId, state.edges);
	};
	const getHandleConnections = ({ id: id2, type, nodeId }) => {
		var _ref26;
		var _a;
		const handleSuffix = id2 ? `-${type}-${id2}` : `-${type}`;
		return Array.from((_ref26 = (_a = state.connectionLookup.get(`${nodeId}${handleSuffix}`)) == null ? void 0 : _a.values()) !== null && _ref26 !== void 0 ? _ref26 : []);
	};
	const findNode = (id2) => {
		if (!id2) return;
		return nodeLookup.value.get(id2);
	};
	const findEdge = (id2) => {
		if (!id2) return;
		return edgeLookup.value.get(id2);
	};
	const updateNodePositions = (dragItems, changed, dragging) => {
		var _a, _b;
		const changes = [];
		for (const node of dragItems) {
			const change = {
				id: node.id,
				type: "position",
				dragging,
				from: node.from
			};
			if (changed) {
				change.position = node.position;
				if (node.parentNode) {
					var _ref27, _ref28;
					const parentNode = findNode(node.parentNode);
					change.position = {
						x: change.position.x - ((_ref27 = (_a = parentNode == null ? void 0 : parentNode.computedPosition) == null ? void 0 : _a.x) !== null && _ref27 !== void 0 ? _ref27 : 0),
						y: change.position.y - ((_ref28 = (_b = parentNode == null ? void 0 : parentNode.computedPosition) == null ? void 0 : _b.y) !== null && _ref28 !== void 0 ? _ref28 : 0)
					};
				}
			}
			changes.push(change);
		}
		if (changes == null ? void 0 : changes.length) state.hooks.nodesChange.trigger(changes);
	};
	const updateNodeDimensions = (updates) => {
		if (!state.vueFlowRef) return;
		const viewportNode = state.vueFlowRef.querySelector(".vue-flow__transformationpane");
		if (!viewportNode) return;
		const style = window.getComputedStyle(viewportNode);
		const { m22: zoom2 } = new window.DOMMatrixReadOnly(style.transform);
		const changes = [];
		for (const element of updates) {
			const update = element;
			const node = findNode(update.id);
			if (node) {
				const dimensions = getDimensions(update.nodeElement);
				if (!!(dimensions.width && dimensions.height && (node.dimensions.width !== dimensions.width || node.dimensions.height !== dimensions.height || update.forceUpdate))) {
					const nodeBounds = update.nodeElement.getBoundingClientRect();
					node.dimensions = dimensions;
					node.handleBounds.source = getHandleBounds("source", update.nodeElement, nodeBounds, zoom2, node.id);
					node.handleBounds.target = getHandleBounds("target", update.nodeElement, nodeBounds, zoom2, node.id);
					changes.push({
						id: node.id,
						type: "dimensions",
						dimensions
					});
				}
			}
		}
		if (!state.fitViewOnInitDone && state.fitViewOnInit) viewportHelper.value.fitView().then(() => {
			state.fitViewOnInitDone = true;
		});
		if (changes.length) state.hooks.nodesChange.trigger(changes);
	};
	const elementSelectionHandler = (elements, selected) => {
		const nodeIds = /* @__PURE__ */ new Set();
		const edgeIds = /* @__PURE__ */ new Set();
		for (const element of elements) if (isNode(element)) nodeIds.add(element.id);
		else if (isEdge(element)) edgeIds.add(element.id);
		const changedNodes = getSelectionChanges(nodeLookup.value, nodeIds, true);
		const changedEdges = getSelectionChanges(edgeLookup.value, edgeIds);
		if (state.multiSelectionActive) {
			for (const nodeId of nodeIds) changedNodes.push(createSelectionChange(nodeId, selected));
			for (const edgeId of edgeIds) changedEdges.push(createSelectionChange(edgeId, selected));
		}
		if (changedNodes.length) state.hooks.nodesChange.trigger(changedNodes);
		if (changedEdges.length) state.hooks.edgesChange.trigger(changedEdges);
	};
	const addSelectedNodes = (nodes) => {
		if (state.multiSelectionActive) {
			const nodeChanges = nodes.map((node) => createSelectionChange(node.id, true));
			state.hooks.nodesChange.trigger(nodeChanges);
			return;
		}
		state.hooks.nodesChange.trigger(getSelectionChanges(nodeLookup.value, new Set(nodes.map((n) => n.id)), true));
		state.hooks.edgesChange.trigger(getSelectionChanges(edgeLookup.value));
	};
	const addSelectedEdges = (edges) => {
		if (state.multiSelectionActive) {
			const changedEdges = edges.map((edge) => createSelectionChange(edge.id, true));
			state.hooks.edgesChange.trigger(changedEdges);
			return;
		}
		state.hooks.edgesChange.trigger(getSelectionChanges(edgeLookup.value, new Set(edges.map((e) => e.id))));
		state.hooks.nodesChange.trigger(getSelectionChanges(nodeLookup.value, /* @__PURE__ */ new Set(), true));
	};
	const addSelectedElements = (elements) => {
		elementSelectionHandler(elements, true);
	};
	const removeSelectedNodes = (nodes) => {
		const nodeChanges = (nodes || state.nodes).map((n) => {
			n.selected = false;
			return createSelectionChange(n.id, false);
		});
		state.hooks.nodesChange.trigger(nodeChanges);
	};
	const removeSelectedEdges = (edges) => {
		const edgeChanges = (edges || state.edges).map((e) => {
			e.selected = false;
			return createSelectionChange(e.id, false);
		});
		state.hooks.edgesChange.trigger(edgeChanges);
	};
	const removeSelectedElements = (elements) => {
		if (!elements || !elements.length) return elementSelectionHandler([], false);
		const changes = elements.reduce((changes2, curr) => {
			const selectionChange = createSelectionChange(curr.id, false);
			if (isNode(curr)) changes2.nodes.push(selectionChange);
			else changes2.edges.push(selectionChange);
			return changes2;
		}, {
			nodes: [],
			edges: []
		});
		if (changes.nodes.length) state.hooks.nodesChange.trigger(changes.nodes);
		if (changes.edges.length) state.hooks.edgesChange.trigger(changes.edges);
	};
	const setMinZoom = (minZoom) => {
		var _a;
		(_a = state.d3Zoom) == null || _a.scaleExtent([minZoom, state.maxZoom]);
		state.minZoom = minZoom;
	};
	const setMaxZoom = (maxZoom) => {
		var _a;
		(_a = state.d3Zoom) == null || _a.scaleExtent([state.minZoom, maxZoom]);
		state.maxZoom = maxZoom;
	};
	const setTranslateExtent = (translateExtent) => {
		var _a;
		(_a = state.d3Zoom) == null || _a.translateExtent(translateExtent);
		state.translateExtent = translateExtent;
	};
	const setNodeExtent = (nodeExtent) => {
		state.nodeExtent = nodeExtent;
		updateNodeInternals();
	};
	const setPaneClickDistance = (clickDistance) => {
		var _a;
		(_a = state.d3Zoom) == null || _a.clickDistance(clickDistance);
	};
	const setInteractive = (isInteractive) => {
		state.nodesDraggable = isInteractive;
		state.nodesConnectable = isInteractive;
		state.elementsSelectable = isInteractive;
	};
	const setNodes = (nodes) => {
		const nextNodes = nodes instanceof Function ? nodes(state.nodes) : nodes;
		if (!state.initialized && !nextNodes.length) return;
		state.nodes = createGraphNodes(nextNodes, findNode, state.hooks.error.trigger);
	};
	const setEdges = (edges) => {
		const nextEdges = edges instanceof Function ? edges(state.edges) : edges;
		if (!state.initialized && !nextEdges.length) return;
		const validEdges = createGraphEdges(nextEdges, state.isValidConnection, findNode, findEdge, state.hooks.error.trigger, state.defaultEdgeOptions, state.nodes, state.edges);
		updateConnectionLookup(state.connectionLookup, edgeLookup.value, validEdges);
		state.edges = validEdges;
	};
	const setElements = (elements) => {
		const nextElements = elements instanceof Function ? elements([...state.nodes, ...state.edges]) : elements;
		if (!state.initialized && !nextElements.length) return;
		setNodes(nextElements.filter(isNode));
		setEdges(nextElements.filter(isEdge));
	};
	const addNodes = (nodes) => {
		let nextNodes = nodes instanceof Function ? nodes(state.nodes) : nodes;
		nextNodes = Array.isArray(nextNodes) ? nextNodes : [nextNodes];
		const graphNodes = createGraphNodes(nextNodes, findNode, state.hooks.error.trigger);
		const changes = [];
		for (const node of graphNodes) changes.push(createAdditionChange(node));
		if (changes.length) state.hooks.nodesChange.trigger(changes);
	};
	const addEdges = (params) => {
		let nextEdges = params instanceof Function ? params(state.edges) : params;
		nextEdges = Array.isArray(nextEdges) ? nextEdges : [nextEdges];
		const validEdges = createGraphEdges(nextEdges, state.isValidConnection, findNode, findEdge, state.hooks.error.trigger, state.defaultEdgeOptions, state.nodes, state.edges);
		const changes = [];
		for (const edge of validEdges) changes.push(createAdditionChange(edge));
		if (changes.length) state.hooks.edgesChange.trigger(changes);
	};
	const removeNodes = (nodes, removeConnectedEdges = true, removeChildren = false) => {
		const nextNodes = nodes instanceof Function ? nodes(state.nodes) : nodes;
		const nodesToRemove = Array.isArray(nextNodes) ? nextNodes : [nextNodes];
		const nodeChanges = [];
		const edgeChanges = [];
		function createEdgeRemovalChanges(nodes2) {
			const connectedEdges = getConnectedEdges$1(nodes2);
			for (const edge of connectedEdges) if (isDef(edge.deletable) ? edge.deletable : true) edgeChanges.push(createEdgeRemoveChange(edge.id, edge.source, edge.target, edge.sourceHandle, edge.targetHandle));
		}
		function createChildrenRemovalChanges(id2) {
			const children2 = [];
			for (const node of state.nodes) if (node.parentNode === id2) children2.push(node);
			if (children2.length) {
				for (const child of children2) nodeChanges.push(createNodeRemoveChange(child.id));
				if (removeConnectedEdges) createEdgeRemovalChanges(children2);
				for (const child of children2) createChildrenRemovalChanges(child.id);
			}
		}
		for (const item of nodesToRemove) {
			const currNode = typeof item === "string" ? findNode(item) : item;
			if (!currNode) continue;
			if (isDef(currNode.deletable) && !currNode.deletable) continue;
			nodeChanges.push(createNodeRemoveChange(currNode.id));
			if (removeConnectedEdges) createEdgeRemovalChanges([currNode]);
			if (removeChildren) createChildrenRemovalChanges(currNode.id);
		}
		if (edgeChanges.length) state.hooks.edgesChange.trigger(edgeChanges);
		if (nodeChanges.length) state.hooks.nodesChange.trigger(nodeChanges);
	};
	const removeEdges = (edges) => {
		const nextEdges = edges instanceof Function ? edges(state.edges) : edges;
		const edgesToRemove = Array.isArray(nextEdges) ? nextEdges : [nextEdges];
		const changes = [];
		for (const item of edgesToRemove) {
			const currEdge = typeof item === "string" ? findEdge(item) : item;
			if (!currEdge) continue;
			if (isDef(currEdge.deletable) && !currEdge.deletable) continue;
			changes.push(createEdgeRemoveChange(typeof item === "string" ? item : item.id, currEdge.source, currEdge.target, currEdge.sourceHandle, currEdge.targetHandle));
		}
		state.hooks.edgesChange.trigger(changes);
	};
	const updateEdge2 = (oldEdge, newConnection, shouldReplaceId = true) => {
		const prevEdge = findEdge(oldEdge.id);
		if (!prevEdge) return false;
		const prevEdgeIndex = state.edges.indexOf(prevEdge);
		const newEdge = updateEdgeAction(oldEdge, newConnection, prevEdge, shouldReplaceId, state.hooks.error.trigger);
		if (newEdge) {
			const [validEdge] = createGraphEdges([newEdge], state.isValidConnection, findNode, findEdge, state.hooks.error.trigger, state.defaultEdgeOptions, state.nodes, state.edges);
			state.edges = state.edges.map((edge, index) => index === prevEdgeIndex ? validEdge : edge);
			updateConnectionLookup(state.connectionLookup, edgeLookup.value, [validEdge]);
			return validEdge;
		}
		return false;
	};
	const updateEdgeData = (id2, dataUpdate, options = { replace: false }) => {
		const edge = findEdge(id2);
		if (!edge) return;
		const nextData = typeof dataUpdate === "function" ? dataUpdate(edge) : dataUpdate;
		edge.data = options.replace ? nextData : _objectSpread2(_objectSpread2({}, edge.data), nextData);
	};
	const applyNodeChanges2 = (changes) => {
		return applyChanges(changes, state.nodes);
	};
	const applyEdgeChanges2 = (changes) => {
		const changedEdges = applyChanges(changes, state.edges);
		updateConnectionLookup(state.connectionLookup, edgeLookup.value, changedEdges);
		return changedEdges;
	};
	const updateNode = (id2, nodeUpdate, options = { replace: false }) => {
		const node = findNode(id2);
		if (!node) return;
		const nextNode = typeof nodeUpdate === "function" ? nodeUpdate(node) : nodeUpdate;
		if (options.replace) state.nodes.splice(state.nodes.indexOf(node), 1, nextNode);
		else Object.assign(node, nextNode);
	};
	const updateNodeData = (id2, dataUpdate, options = { replace: false }) => {
		const node = findNode(id2);
		if (!node) return;
		const nextData = typeof dataUpdate === "function" ? dataUpdate(node) : dataUpdate;
		node.data = options.replace ? nextData : _objectSpread2(_objectSpread2({}, node.data), nextData);
	};
	const startConnection = (startHandle, position, isClick = false) => {
		if (isClick) state.connectionClickStartHandle = startHandle;
		else state.connectionStartHandle = startHandle;
		state.connectionEndHandle = null;
		state.connectionStatus = null;
		if (position) state.connectionPosition = position;
	};
	const updateConnection = (position, result = null, status = null) => {
		if (state.connectionStartHandle) {
			state.connectionPosition = position;
			state.connectionEndHandle = result;
			state.connectionStatus = status;
		}
	};
	const endConnection = (event, isClick) => {
		state.connectionPosition = {
			x: NaN,
			y: NaN
		};
		state.connectionEndHandle = null;
		state.connectionStatus = null;
		if (isClick) state.connectionClickStartHandle = null;
		else state.connectionStartHandle = null;
	};
	const getNodeRect = (nodeOrRect) => {
		const isRectObj = isRect(nodeOrRect);
		const node = isRectObj ? null : isGraphNode(nodeOrRect) ? nodeOrRect : findNode(nodeOrRect.id);
		if (!isRectObj && !node) return [
			null,
			null,
			isRectObj
		];
		return [
			isRectObj ? nodeOrRect : nodeToRect(node),
			node,
			isRectObj
		];
	};
	const getIntersectingNodes = (nodeOrRect, partially = true, nodes = state.nodes) => {
		const [nodeRect, node, isRect2] = getNodeRect(nodeOrRect);
		if (!nodeRect) return [];
		const intersections = [];
		for (const n of nodes || state.nodes) {
			if (!isRect2 && (n.id === node.id || !n.computedPosition)) continue;
			const currNodeRect = nodeToRect(n);
			const overlappingArea = getOverlappingArea(currNodeRect, nodeRect);
			if (partially && overlappingArea > 0 || overlappingArea >= currNodeRect.width * currNodeRect.height || overlappingArea >= Number(nodeRect.width) * Number(nodeRect.height)) intersections.push(n);
		}
		return intersections;
	};
	const isNodeIntersecting = (nodeOrRect, area, partially = true) => {
		const [nodeRect] = getNodeRect(nodeOrRect);
		if (!nodeRect) return false;
		const overlappingArea = getOverlappingArea(nodeRect, area);
		return partially && overlappingArea > 0 || overlappingArea >= Number(nodeRect.width) * Number(nodeRect.height);
	};
	const panBy = (delta) => {
		const { viewport, dimensions, d3Zoom, d3Selection, translateExtent } = state;
		if (!d3Zoom || !d3Selection || !delta.x && !delta.y) return false;
		const nextTransform = identity.translate(viewport.x + delta.x, viewport.y + delta.y).scale(viewport.zoom);
		const extent = [[0, 0], [dimensions.width, dimensions.height]];
		const constrainedTransform = d3Zoom.constrain()(nextTransform, extent, translateExtent);
		const transformChanged = state.viewport.x !== constrainedTransform.x || state.viewport.y !== constrainedTransform.y || state.viewport.zoom !== constrainedTransform.k;
		d3Zoom.transform(d3Selection, constrainedTransform);
		return transformChanged;
	};
	const setState = (options) => {
		const opts = options instanceof Function ? options(state) : options;
		const exclude = [
			"d3Zoom",
			"d3Selection",
			"d3ZoomHandler",
			"viewportRef",
			"vueFlowRef",
			"dimensions",
			"hooks"
		];
		if (isDef(opts.defaultEdgeOptions)) state.defaultEdgeOptions = opts.defaultEdgeOptions;
		const elements = opts.modelValue || opts.nodes || opts.edges ? [] : void 0;
		if (elements) {
			if (opts.modelValue) elements.push(...opts.modelValue);
			if (opts.nodes) elements.push(...opts.nodes);
			if (opts.edges) elements.push(...opts.edges);
			setElements(elements);
		}
		const setSkippedOptions = () => {
			if (isDef(opts.maxZoom)) setMaxZoom(opts.maxZoom);
			if (isDef(opts.minZoom)) setMinZoom(opts.minZoom);
			if (isDef(opts.translateExtent)) setTranslateExtent(opts.translateExtent);
		};
		for (const o of Object.keys(opts)) {
			const key = o;
			const option = opts[key];
			if (![...storeOptionsToSkip, ...exclude].includes(key) && isDef(option)) state[key] = option;
		}
		until(() => state.d3Zoom).not.toBeNull().then(setSkippedOptions);
		if (!state.initialized) state.initialized = true;
	};
	const toObject = () => {
		const nodes = [];
		const edges = [];
		for (const node of state.nodes) {
			const { computedPosition: _, handleBounds: __, selected: ___, dimensions: ____, isParent: _____, resizing: ______, dragging: _______, events: _________ } = node, rest = _objectWithoutProperties(node, _excluded4);
			nodes.push(rest);
		}
		for (const edge of state.edges) {
			const { selected: _, sourceNode: __, targetNode: ___, events: ____ } = edge, rest = _objectWithoutProperties(edge, _excluded5);
			edges.push(rest);
		}
		return JSON.parse(JSON.stringify({
			nodes,
			edges,
			position: [state.viewport.x, state.viewport.y],
			zoom: state.viewport.zoom,
			viewport: state.viewport
		}));
	};
	const fromObject = (obj) => {
		return new Promise((resolve) => {
			const { nodes, edges, position, zoom: zoom2, viewport } = obj;
			if (nodes) setNodes(nodes);
			if (edges) setEdges(edges);
			const [xPos, yPos] = (viewport == null ? void 0 : viewport.x) && (viewport == null ? void 0 : viewport.y) ? [viewport.x, viewport.y] : position !== null && position !== void 0 ? position : [null, null];
			if (xPos && yPos) {
				const nextZoom = (viewport == null ? void 0 : viewport.zoom) || zoom2 || state.viewport.zoom;
				return until(() => viewportHelper.value.viewportInitialized).toBe(true).then(() => {
					viewportHelper.value.setViewport({
						x: xPos,
						y: yPos,
						zoom: nextZoom
					}).then(() => {
						resolve(true);
					});
				});
			} else resolve(true);
		});
	};
	const $reset = () => {
		const resetState = useState();
		state.edges = [];
		state.nodes = [];
		if (state.d3Zoom && state.d3Selection) {
			var _resetState$defaultVi, _resetState$defaultVi2, _resetState$defaultVi3;
			const updatedTransform = identity.translate((_resetState$defaultVi = resetState.defaultViewport.x) !== null && _resetState$defaultVi !== void 0 ? _resetState$defaultVi : 0, (_resetState$defaultVi2 = resetState.defaultViewport.y) !== null && _resetState$defaultVi2 !== void 0 ? _resetState$defaultVi2 : 0).scale(clamp((_resetState$defaultVi3 = resetState.defaultViewport.zoom) !== null && _resetState$defaultVi3 !== void 0 ? _resetState$defaultVi3 : 1, resetState.minZoom, resetState.maxZoom));
			const bbox = state.viewportRef.getBoundingClientRect();
			const extent = [[0, 0], [bbox.width, bbox.height]];
			const constrainedTransform = state.d3Zoom.constrain()(updatedTransform, extent, resetState.translateExtent);
			state.d3Zoom.transform(state.d3Selection, constrainedTransform);
		}
		setState(resetState);
	};
	return {
		updateNodePositions,
		updateNodeDimensions,
		setElements,
		setNodes,
		setEdges,
		addNodes,
		addEdges,
		removeNodes,
		removeEdges,
		findNode,
		findEdge,
		updateEdge: updateEdge2,
		updateEdgeData,
		updateNode,
		updateNodeData,
		applyEdgeChanges: applyEdgeChanges2,
		applyNodeChanges: applyNodeChanges2,
		addSelectedElements,
		addSelectedNodes,
		addSelectedEdges,
		setMinZoom,
		setMaxZoom,
		setTranslateExtent,
		setNodeExtent,
		setPaneClickDistance,
		removeSelectedElements,
		removeSelectedNodes,
		removeSelectedEdges,
		startConnection,
		updateConnection,
		endConnection,
		setInteractive,
		setState,
		getIntersectingNodes,
		getIncomers: getIncomers$1,
		getOutgoers: getOutgoers$1,
		getConnectedEdges: getConnectedEdges$1,
		getHandleConnections,
		isNodeIntersecting,
		panBy,
		fitView: (params) => viewportHelper.value.fitView(params),
		zoomIn: (transitionOpts) => viewportHelper.value.zoomIn(transitionOpts),
		zoomOut: (transitionOpts) => viewportHelper.value.zoomOut(transitionOpts),
		zoomTo: (zoomLevel, transitionOpts) => viewportHelper.value.zoomTo(zoomLevel, transitionOpts),
		setViewport: (params, transitionOpts) => viewportHelper.value.setViewport(params, transitionOpts),
		setTransform: (params, transitionOpts) => viewportHelper.value.setTransform(params, transitionOpts),
		getViewport: () => viewportHelper.value.getViewport(),
		getTransform: () => viewportHelper.value.getTransform(),
		setCenter: (x, y, opts) => viewportHelper.value.setCenter(x, y, opts),
		fitBounds: (params, opts) => viewportHelper.value.fitBounds(params, opts),
		project: (params) => viewportHelper.value.project(params),
		screenToFlowCoordinate: (params) => viewportHelper.value.screenToFlowCoordinate(params),
		flowToScreenCoordinate: (params) => viewportHelper.value.flowToScreenCoordinate(params),
		toObject,
		fromObject,
		updateNodeInternals,
		viewportHelper,
		$reset,
		$destroy: () => {}
	};
}
var _hoisted_1$9$1 = [
	"data-id",
	"data-handleid",
	"data-nodeid",
	"data-handlepos"
];
var _sfc_main$f = /* @__PURE__ */ defineComponent(_objectSpread2(_objectSpread2({}, {
	name: "Handle",
	compatConfig: { MODE: 3 }
}), {}, {
	props: {
		id: { default: null },
		type: {},
		position: { default: () => Position.Top },
		isValidConnection: { type: Function },
		connectable: {
			type: [
				Boolean,
				Number,
				String,
				Function
			],
			default: void 0
		},
		connectableStart: {
			type: Boolean,
			default: true
		},
		connectableEnd: {
			type: Boolean,
			default: true
		}
	},
	setup(__props, { expose: __expose }) {
		const props = createPropsRestProxy(__props, [
			"position",
			"connectable",
			"connectableStart",
			"connectableEnd",
			"id"
		]);
		const type = toRef(() => {
			var _props$type;
			return (_props$type = props.type) !== null && _props$type !== void 0 ? _props$type : "source";
		});
		const isValidConnection = toRef(() => {
			var _props$isValidConnect;
			return (_props$isValidConnect = props.isValidConnection) !== null && _props$isValidConnect !== void 0 ? _props$isValidConnect : null;
		});
		const { id: flowId, connectionStartHandle, connectionClickStartHandle, connectionEndHandle, vueFlowRef, nodesConnectable, noDragClassName, noPanClassName } = useVueFlow();
		const { id: nodeId, node, nodeEl, connectedEdges } = useNode();
		const handle = ref();
		const isConnectableStart = toRef(() => typeof __props.connectableStart !== "undefined" ? __props.connectableStart : true);
		const isConnectableEnd = toRef(() => typeof __props.connectableEnd !== "undefined" ? __props.connectableEnd : true);
		const isConnecting = toRef(() => {
			var _a, _b, _c, _d, _e, _f;
			return ((_a = connectionStartHandle.value) == null ? void 0 : _a.nodeId) === nodeId && ((_b = connectionStartHandle.value) == null ? void 0 : _b.id) === __props.id && ((_c = connectionStartHandle.value) == null ? void 0 : _c.type) === type.value || ((_d = connectionEndHandle.value) == null ? void 0 : _d.nodeId) === nodeId && ((_e = connectionEndHandle.value) == null ? void 0 : _e.id) === __props.id && ((_f = connectionEndHandle.value) == null ? void 0 : _f.type) === type.value;
		});
		const isClickConnecting = toRef(() => {
			var _a, _b, _c;
			return ((_a = connectionClickStartHandle.value) == null ? void 0 : _a.nodeId) === nodeId && ((_b = connectionClickStartHandle.value) == null ? void 0 : _b.id) === __props.id && ((_c = connectionClickStartHandle.value) == null ? void 0 : _c.type) === type.value;
		});
		const { handlePointerDown, handleClick } = useHandle({
			nodeId,
			handleId: __props.id,
			isValidConnection,
			type
		});
		const isConnectable = computed(() => {
			if (typeof __props.connectable === "string" && __props.connectable === "single") return !connectedEdges.value.some((edge) => {
				const id2 = edge[`${type.value}Handle`];
				if (edge[type.value] !== nodeId) return false;
				return id2 ? id2 === __props.id : true;
			});
			if (typeof __props.connectable === "number") return connectedEdges.value.filter((edge) => {
				const id2 = edge[`${type.value}Handle`];
				if (edge[type.value] !== nodeId) return false;
				return id2 ? id2 === __props.id : true;
			}).length < __props.connectable;
			if (typeof __props.connectable === "function") return __props.connectable(node, connectedEdges.value);
			return isDef(__props.connectable) ? __props.connectable : nodesConnectable.value;
		});
		onMounted(() => {
			var _node$handleBounds$ty;
			var _a;
			if (!node.dimensions.width || !node.dimensions.height) return;
			const existingBounds = (_a = node.handleBounds[type.value]) == null ? void 0 : _a.find((b) => b.id === __props.id);
			if (!vueFlowRef.value || existingBounds) return;
			const viewportNode = vueFlowRef.value.querySelector(".vue-flow__transformationpane");
			if (!nodeEl.value || !handle.value || !viewportNode || !__props.id) return;
			const nodeBounds = nodeEl.value.getBoundingClientRect();
			const handleBounds = handle.value.getBoundingClientRect();
			const style = window.getComputedStyle(viewportNode);
			const { m22: zoom2 } = new window.DOMMatrixReadOnly(style.transform);
			const nextBounds = _objectSpread2({
				id: __props.id,
				position: __props.position,
				x: (handleBounds.left - nodeBounds.left) / zoom2,
				y: (handleBounds.top - nodeBounds.top) / zoom2,
				type: type.value,
				nodeId
			}, getDimensions(handle.value));
			node.handleBounds[type.value] = [...(_node$handleBounds$ty = node.handleBounds[type.value]) !== null && _node$handleBounds$ty !== void 0 ? _node$handleBounds$ty : [], nextBounds];
		});
		function onPointerDown(event) {
			const isMouseTriggered = isMouseEvent(event);
			if (isConnectable.value && isConnectableStart.value && (isMouseTriggered && event.button === 0 || !isMouseTriggered)) handlePointerDown(event);
		}
		function onClick(event) {
			if (!nodeId || !connectionClickStartHandle.value && !isConnectableStart.value) return;
			if (isConnectable.value) handleClick(event);
		}
		__expose({
			handleClick,
			handlePointerDown,
			onClick,
			onPointerDown
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "handle",
				ref: handle,
				"data-id": `${unref(flowId)}-${unref(nodeId)}-${__props.id}-${type.value}`,
				"data-handleid": __props.id,
				"data-nodeid": unref(nodeId),
				"data-handlepos": _ctx.position,
				class: normalizeClass(["vue-flow__handle", [
					`vue-flow__handle-${_ctx.position}`,
					`vue-flow__handle-${__props.id}`,
					unref(noDragClassName),
					unref(noPanClassName),
					type.value,
					{
						connectable: isConnectable.value,
						connecting: isClickConnecting.value,
						connectablestart: isConnectableStart.value,
						connectableend: isConnectableEnd.value,
						connectionindicator: isConnectable.value && (isConnectableStart.value && !isConnecting.value || isConnectableEnd.value && isConnecting.value)
					}
				]]),
				onMousedown: onPointerDown,
				onTouchstartPassive: onPointerDown,
				onClick
			}, [renderSlot(_ctx.$slots, "default", { id: _ctx.id })], 42, _hoisted_1$9$1);
		};
	}
}));
var DefaultNode = function({ sourcePosition = Position.Bottom, targetPosition = Position.Top, label: _label, connectable = true, isValidTargetPos, isValidSourcePos, data }) {
	var _data$label;
	const label = (_data$label = data.label) !== null && _data$label !== void 0 ? _data$label : _label;
	return [
		h(_sfc_main$f, {
			type: "target",
			position: targetPosition,
			connectable,
			isValidConnection: isValidTargetPos
		}),
		typeof label !== "string" && label ? h(label) : h(Fragment, [label]),
		h(_sfc_main$f, {
			type: "source",
			position: sourcePosition,
			connectable,
			isValidConnection: isValidSourcePos
		})
	];
};
DefaultNode.props = [
	"sourcePosition",
	"targetPosition",
	"label",
	"isValidTargetPos",
	"isValidSourcePos",
	"connectable",
	"data"
];
DefaultNode.inheritAttrs = false;
DefaultNode.compatConfig = { MODE: 3 };
var DefaultNode$1 = DefaultNode;
var OutputNode = function({ targetPosition = Position.Top, label: _label, connectable = true, isValidTargetPos, data }) {
	var _data$label2;
	const label = (_data$label2 = data.label) !== null && _data$label2 !== void 0 ? _data$label2 : _label;
	return [h(_sfc_main$f, {
		type: "target",
		position: targetPosition,
		connectable,
		isValidConnection: isValidTargetPos
	}), typeof label !== "string" && label ? h(label) : h(Fragment, [label])];
};
OutputNode.props = [
	"targetPosition",
	"label",
	"isValidTargetPos",
	"connectable",
	"data"
];
OutputNode.inheritAttrs = false;
OutputNode.compatConfig = { MODE: 3 };
var OutputNode$1 = OutputNode;
var InputNode = function({ sourcePosition = Position.Bottom, label: _label, connectable = true, isValidSourcePos, data }) {
	var _data$label3;
	const label = (_data$label3 = data.label) !== null && _data$label3 !== void 0 ? _data$label3 : _label;
	return [typeof label !== "string" && label ? h(label) : h(Fragment, [label]), h(_sfc_main$f, {
		type: "source",
		position: sourcePosition,
		connectable,
		isValidConnection: isValidSourcePos
	})];
};
InputNode.props = [
	"sourcePosition",
	"label",
	"isValidSourcePos",
	"connectable",
	"data"
];
InputNode.inheritAttrs = false;
InputNode.compatConfig = { MODE: 3 };
var InputNode$1 = InputNode;
var _hoisted_1$8$1 = ["transform"];
var _hoisted_2$2$1 = [
	"width",
	"height",
	"x",
	"y",
	"rx",
	"ry"
];
var _hoisted_3$1$1 = ["y"];
var _sfc_main$e = /* @__PURE__ */ defineComponent(_objectSpread2(_objectSpread2({}, {
	name: "EdgeText",
	compatConfig: { MODE: 3 }
}), {}, {
	props: {
		x: {},
		y: {},
		label: {},
		labelStyle: { default: () => ({}) },
		labelShowBg: {
			type: Boolean,
			default: true
		},
		labelBgStyle: { default: () => ({}) },
		labelBgPadding: { default: () => [2, 4] },
		labelBgBorderRadius: { default: 2 }
	},
	setup(__props) {
		const box = ref({
			x: 0,
			y: 0,
			width: 0,
			height: 0
		});
		const el = ref(null);
		const transform = computed(() => `translate(${__props.x - box.value.width / 2} ${__props.y - box.value.height / 2})`);
		onMounted(getBox);
		watch([
			() => __props.x,
			() => __props.y,
			el,
			() => __props.label
		], getBox);
		function getBox() {
			if (!el.value) return;
			const nextBox = el.value.getBBox();
			if (nextBox.width !== box.value.width || nextBox.height !== box.value.height) box.value = nextBox;
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("g", {
				transform: transform.value,
				class: "vue-flow__edge-textwrapper"
			}, [_ctx.labelShowBg ? (openBlock(), createElementBlock("rect", {
				key: 0,
				class: "vue-flow__edge-textbg",
				width: `${box.value.width + 2 * _ctx.labelBgPadding[0]}px`,
				height: `${box.value.height + 2 * _ctx.labelBgPadding[1]}px`,
				x: -_ctx.labelBgPadding[0],
				y: -_ctx.labelBgPadding[1],
				style: normalizeStyle(_ctx.labelBgStyle),
				rx: _ctx.labelBgBorderRadius,
				ry: _ctx.labelBgBorderRadius
			}, null, 12, _hoisted_2$2$1)) : createCommentVNode("", true), createBaseVNode("text", mergeProps(_ctx.$attrs, {
				ref_key: "el",
				ref: el,
				class: "vue-flow__edge-text",
				y: box.value.height / 2,
				dy: "0.3em",
				style: _ctx.labelStyle
			}), [renderSlot(_ctx.$slots, "default", {}, () => [typeof _ctx.label !== "string" ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.label), { key: 0 })) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [createTextVNode(toDisplayString(_ctx.label), 1)], 64))])], 16, _hoisted_3$1$1)], 8, _hoisted_1$8$1);
		};
	}
}));
var _hoisted_1$7$1 = [
	"id",
	"d",
	"marker-end",
	"marker-start"
];
var _hoisted_2$1$1 = ["d", "stroke-width"];
var _sfc_main$d = /* @__PURE__ */ defineComponent(_objectSpread2(_objectSpread2({}, {
	name: "BaseEdge",
	inheritAttrs: false,
	compatConfig: { MODE: 3 }
}), {}, {
	props: {
		id: {},
		labelX: {},
		labelY: {},
		path: {},
		label: {},
		markerStart: {},
		markerEnd: {},
		interactionWidth: { default: 20 },
		labelStyle: {},
		labelShowBg: { type: Boolean },
		labelBgStyle: {},
		labelBgPadding: {},
		labelBgBorderRadius: {}
	},
	setup(__props, { expose: __expose }) {
		const pathEl = ref(null);
		const interactionEl = ref(null);
		const labelEl = ref(null);
		const attrs = useAttrs();
		__expose({
			pathEl,
			interactionEl,
			labelEl
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [
				createBaseVNode("path", mergeProps(unref(attrs), {
					id: _ctx.id,
					ref_key: "pathEl",
					ref: pathEl,
					d: _ctx.path,
					class: "vue-flow__edge-path",
					"marker-end": _ctx.markerEnd,
					"marker-start": _ctx.markerStart
				}), null, 16, _hoisted_1$7$1),
				_ctx.interactionWidth ? (openBlock(), createElementBlock("path", {
					key: 0,
					ref_key: "interactionEl",
					ref: interactionEl,
					fill: "none",
					d: _ctx.path,
					"stroke-width": _ctx.interactionWidth,
					"stroke-opacity": 0,
					class: "vue-flow__edge-interaction"
				}, null, 8, _hoisted_2$1$1)) : createCommentVNode("", true),
				_ctx.label && _ctx.labelX && _ctx.labelY ? (openBlock(), createBlock(_sfc_main$e, {
					key: 1,
					ref_key: "labelEl",
					ref: labelEl,
					x: _ctx.labelX,
					y: _ctx.labelY,
					label: _ctx.label,
					"label-show-bg": _ctx.labelShowBg,
					"label-bg-style": _ctx.labelBgStyle,
					"label-bg-padding": _ctx.labelBgPadding,
					"label-bg-border-radius": _ctx.labelBgBorderRadius,
					"label-style": _ctx.labelStyle
				}, null, 8, [
					"x",
					"y",
					"label",
					"label-show-bg",
					"label-bg-style",
					"label-bg-padding",
					"label-bg-border-radius",
					"label-style"
				])) : createCommentVNode("", true)
			], 64);
		};
	}
}));
function getSimpleEdgeCenter({ sourceX, sourceY, targetX, targetY }) {
	const xOffset = Math.abs(targetX - sourceX) / 2;
	const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
	const yOffset = Math.abs(targetY - sourceY) / 2;
	return [
		centerX,
		targetY < sourceY ? targetY + yOffset : targetY - yOffset,
		xOffset,
		yOffset
	];
}
function getBezierEdgeCenter({ sourceX, sourceY, targetX, targetY, sourceControlX, sourceControlY, targetControlX, targetControlY }) {
	const centerX = sourceX * .125 + sourceControlX * .375 + targetControlX * .375 + targetX * .125;
	const centerY = sourceY * .125 + sourceControlY * .375 + targetControlY * .375 + targetY * .125;
	return [
		centerX,
		centerY,
		Math.abs(centerX - sourceX),
		Math.abs(centerY - sourceY)
	];
}
function calculateControlOffset(distance2, curvature) {
	if (distance2 >= 0) return .5 * distance2;
	else return curvature * 25 * Math.sqrt(-distance2);
}
function getControlWithCurvature({ pos, x1, y1, x2, y2, c }) {
	let ctX, ctY;
	switch (pos) {
		case Position.Left:
			ctX = x1 - calculateControlOffset(x1 - x2, c);
			ctY = y1;
			break;
		case Position.Right:
			ctX = x1 + calculateControlOffset(x2 - x1, c);
			ctY = y1;
			break;
		case Position.Top:
			ctX = x1;
			ctY = y1 - calculateControlOffset(y1 - y2, c);
			break;
		case Position.Bottom:
			ctX = x1;
			ctY = y1 + calculateControlOffset(y2 - y1, c);
	}
	return [ctX, ctY];
}
function getBezierPath(bezierPathParams) {
	const { sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, curvature = .25 } = bezierPathParams;
	const [sourceControlX, sourceControlY] = getControlWithCurvature({
		pos: sourcePosition,
		x1: sourceX,
		y1: sourceY,
		x2: targetX,
		y2: targetY,
		c: curvature
	});
	const [targetControlX, targetControlY] = getControlWithCurvature({
		pos: targetPosition,
		x1: targetX,
		y1: targetY,
		x2: sourceX,
		y2: sourceY,
		c: curvature
	});
	const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourceControlX,
		sourceControlY,
		targetControlX,
		targetControlY
	});
	return [
		`M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
		labelX,
		labelY,
		offsetX,
		offsetY
	];
}
function getControl({ pos, x1, y1, x2, y2 }) {
	let ctX, ctY;
	switch (pos) {
		case Position.Left:
		case Position.Right:
			ctX = .5 * (x1 + x2);
			ctY = y1;
			break;
		case Position.Top:
		case Position.Bottom:
			ctX = x1;
			ctY = .5 * (y1 + y2);
	}
	return [ctX, ctY];
}
function getSimpleBezierPath(simpleBezierPathParams) {
	const { sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top } = simpleBezierPathParams;
	const [sourceControlX, sourceControlY] = getControl({
		pos: sourcePosition,
		x1: sourceX,
		y1: sourceY,
		x2: targetX,
		y2: targetY
	});
	const [targetControlX, targetControlY] = getControl({
		pos: targetPosition,
		x1: targetX,
		y1: targetY,
		x2: sourceX,
		y2: sourceY
	});
	const [centerX, centerY, offsetX, offsetY] = getBezierEdgeCenter({
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourceControlX,
		sourceControlY,
		targetControlX,
		targetControlY
	});
	return [
		`M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
		centerX,
		centerY,
		offsetX,
		offsetY
	];
}
var handleDirections = {
	[Position.Left]: {
		x: -1,
		y: 0
	},
	[Position.Right]: {
		x: 1,
		y: 0
	},
	[Position.Top]: {
		x: 0,
		y: -1
	},
	[Position.Bottom]: {
		x: 0,
		y: 1
	}
};
function getDirection({ source, sourcePosition = Position.Bottom, target }) {
	if (sourcePosition === Position.Left || sourcePosition === Position.Right) return source.x < target.x ? {
		x: 1,
		y: 0
	} : {
		x: -1,
		y: 0
	};
	return source.y < target.y ? {
		x: 0,
		y: 1
	} : {
		x: 0,
		y: -1
	};
}
function distance(a, b) {
	return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}
function getPoints({ source, sourcePosition = Position.Bottom, target, targetPosition = Position.Top, center, offset }) {
	const sourceDir = handleDirections[sourcePosition];
	const targetDir = handleDirections[targetPosition];
	const sourceGapped = {
		x: source.x + sourceDir.x * offset,
		y: source.y + sourceDir.y * offset
	};
	const targetGapped = {
		x: target.x + targetDir.x * offset,
		y: target.y + targetDir.y * offset
	};
	const dir = getDirection({
		source: sourceGapped,
		sourcePosition,
		target: targetGapped
	});
	const dirAccessor = dir.x !== 0 ? "x" : "y";
	const currDir = dir[dirAccessor];
	let points;
	let centerX, centerY;
	const sourceGapOffset = {
		x: 0,
		y: 0
	};
	const targetGapOffset = {
		x: 0,
		y: 0
	};
	const [defaultCenterX, defaultCenterY, defaultOffsetX, defaultOffsetY] = getSimpleEdgeCenter({
		sourceX: source.x,
		sourceY: source.y,
		targetX: target.x,
		targetY: target.y
	});
	if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
		var _center$x, _center$y;
		centerX = (_center$x = center.x) !== null && _center$x !== void 0 ? _center$x : defaultCenterX;
		centerY = (_center$y = center.y) !== null && _center$y !== void 0 ? _center$y : defaultCenterY;
		const verticalSplit = [{
			x: centerX,
			y: sourceGapped.y
		}, {
			x: centerX,
			y: targetGapped.y
		}];
		const horizontalSplit = [{
			x: sourceGapped.x,
			y: centerY
		}, {
			x: targetGapped.x,
			y: centerY
		}];
		if (sourceDir[dirAccessor] === currDir) points = dirAccessor === "x" ? verticalSplit : horizontalSplit;
		else points = dirAccessor === "x" ? horizontalSplit : verticalSplit;
	} else {
		const sourceTarget = [{
			x: sourceGapped.x,
			y: targetGapped.y
		}];
		const targetSource = [{
			x: targetGapped.x,
			y: sourceGapped.y
		}];
		if (dirAccessor === "x") points = sourceDir.x === currDir ? targetSource : sourceTarget;
		else points = sourceDir.y === currDir ? sourceTarget : targetSource;
		if (sourcePosition === targetPosition) {
			const diff = Math.abs(source[dirAccessor] - target[dirAccessor]);
			if (diff <= offset) {
				const gapOffset = Math.min(offset - 1, offset - diff);
				if (sourceDir[dirAccessor] === currDir) sourceGapOffset[dirAccessor] = (sourceGapped[dirAccessor] > source[dirAccessor] ? -1 : 1) * gapOffset;
				else targetGapOffset[dirAccessor] = (targetGapped[dirAccessor] > target[dirAccessor] ? -1 : 1) * gapOffset;
			}
		}
		if (sourcePosition !== targetPosition) {
			const dirAccessorOpposite = dirAccessor === "x" ? "y" : "x";
			const isSameDir = sourceDir[dirAccessor] === targetDir[dirAccessorOpposite];
			const sourceGtTargetOppo = sourceGapped[dirAccessorOpposite] > targetGapped[dirAccessorOpposite];
			const sourceLtTargetOppo = sourceGapped[dirAccessorOpposite] < targetGapped[dirAccessorOpposite];
			if (sourceDir[dirAccessor] === 1 && (!isSameDir && sourceGtTargetOppo || isSameDir && sourceLtTargetOppo) || sourceDir[dirAccessor] !== 1 && (!isSameDir && sourceLtTargetOppo || isSameDir && sourceGtTargetOppo)) points = dirAccessor === "x" ? sourceTarget : targetSource;
		}
		const sourceGapPoint = {
			x: sourceGapped.x + sourceGapOffset.x,
			y: sourceGapped.y + sourceGapOffset.y
		};
		const targetGapPoint = {
			x: targetGapped.x + targetGapOffset.x,
			y: targetGapped.y + targetGapOffset.y
		};
		if (Math.max(Math.abs(sourceGapPoint.x - points[0].x), Math.abs(targetGapPoint.x - points[0].x)) >= Math.max(Math.abs(sourceGapPoint.y - points[0].y), Math.abs(targetGapPoint.y - points[0].y))) {
			centerX = (sourceGapPoint.x + targetGapPoint.x) / 2;
			centerY = points[0].y;
		} else {
			centerX = points[0].x;
			centerY = (sourceGapPoint.y + targetGapPoint.y) / 2;
		}
	}
	return [
		[
			source,
			{
				x: sourceGapped.x + sourceGapOffset.x,
				y: sourceGapped.y + sourceGapOffset.y
			},
			...points,
			{
				x: targetGapped.x + targetGapOffset.x,
				y: targetGapped.y + targetGapOffset.y
			},
			target
		],
		centerX,
		centerY,
		defaultOffsetX,
		defaultOffsetY
	];
}
function getBend(a, b, c, size) {
	const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
	const { x, y } = b;
	if (a.x === x && x === c.x || a.y === y && y === c.y) return `L${x} ${y}`;
	if (a.y === y) {
		const xDir2 = a.x < c.x ? -1 : 1;
		const yDir2 = a.y < c.y ? 1 : -1;
		return `L ${x + bendSize * xDir2},${y}Q ${x},${y} ${x},${y + bendSize * yDir2}`;
	}
	const xDir = a.x < c.x ? 1 : -1;
	return `L ${x},${y + bendSize * (a.y < c.y ? -1 : 1)}Q ${x},${y} ${x + bendSize * xDir},${y}`;
}
function getSmoothStepPath(smoothStepPathParams) {
	const { sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, borderRadius = 5, centerX, centerY, offset = 20 } = smoothStepPathParams;
	const [points, labelX, labelY, offsetX, offsetY] = getPoints({
		source: {
			x: sourceX,
			y: sourceY
		},
		sourcePosition,
		target: {
			x: targetX,
			y: targetY
		},
		targetPosition,
		center: {
			x: centerX,
			y: centerY
		},
		offset
	});
	return [
		points.reduce((res, p, i) => {
			let segment;
			if (i > 0 && i < points.length - 1) segment = getBend(points[i - 1], p, points[i + 1], borderRadius);
			else segment = `${i === 0 ? "M" : "L"}${p.x} ${p.y}`;
			res += segment;
			return res;
		}, ""),
		labelX,
		labelY,
		offsetX,
		offsetY
	];
}
function getStraightPath(straightEdgeParams) {
	const { sourceX, sourceY, targetX, targetY } = straightEdgeParams;
	const [centerX, centerY, offsetX, offsetY] = getSimpleEdgeCenter({
		sourceX,
		sourceY,
		targetX,
		targetY
	});
	return [
		`M ${sourceX},${sourceY}L ${targetX},${targetY}`,
		centerX,
		centerY,
		offsetX,
		offsetY
	];
}
var StraightEdge$1 = defineComponent({
	name: "StraightEdge",
	props: [
		"label",
		"labelStyle",
		"labelShowBg",
		"labelBgStyle",
		"labelBgPadding",
		"labelBgBorderRadius",
		"sourceY",
		"sourceX",
		"targetX",
		"targetY",
		"markerEnd",
		"markerStart",
		"interactionWidth"
	],
	compatConfig: { MODE: 3 },
	setup(props, { attrs }) {
		return () => {
			const [path, labelX, labelY] = getStraightPath(props);
			return h(_sfc_main$d, _objectSpread2(_objectSpread2({
				path,
				labelX,
				labelY
			}, attrs), props));
		};
	}
});
var SmoothStepEdge$1 = defineComponent({
	name: "SmoothStepEdge",
	props: [
		"sourcePosition",
		"targetPosition",
		"label",
		"labelStyle",
		"labelShowBg",
		"labelBgStyle",
		"labelBgPadding",
		"labelBgBorderRadius",
		"sourceY",
		"sourceX",
		"targetX",
		"targetY",
		"borderRadius",
		"markerEnd",
		"markerStart",
		"interactionWidth",
		"offset"
	],
	compatConfig: { MODE: 3 },
	setup(props, { attrs }) {
		return () => {
			var _props$sourcePosition, _props$targetPosition;
			const [path, labelX, labelY] = getSmoothStepPath(_objectSpread2(_objectSpread2({}, props), {}, {
				sourcePosition: (_props$sourcePosition = props.sourcePosition) !== null && _props$sourcePosition !== void 0 ? _props$sourcePosition : Position.Bottom,
				targetPosition: (_props$targetPosition = props.targetPosition) !== null && _props$targetPosition !== void 0 ? _props$targetPosition : Position.Top
			}));
			return h(_sfc_main$d, _objectSpread2(_objectSpread2({
				path,
				labelX,
				labelY
			}, attrs), props));
		};
	}
});
var StepEdge$1 = defineComponent({
	name: "StepEdge",
	props: [
		"sourcePosition",
		"targetPosition",
		"label",
		"labelStyle",
		"labelShowBg",
		"labelBgStyle",
		"labelBgPadding",
		"labelBgBorderRadius",
		"sourceY",
		"sourceX",
		"targetX",
		"targetY",
		"markerEnd",
		"markerStart",
		"interactionWidth"
	],
	setup(props, { attrs }) {
		return () => h(SmoothStepEdge$1, _objectSpread2(_objectSpread2(_objectSpread2({}, props), attrs), {}, { borderRadius: 0 }));
	}
});
var BezierEdge$1 = defineComponent({
	name: "BezierEdge",
	props: [
		"sourcePosition",
		"targetPosition",
		"label",
		"labelStyle",
		"labelShowBg",
		"labelBgStyle",
		"labelBgPadding",
		"labelBgBorderRadius",
		"sourceY",
		"sourceX",
		"targetX",
		"targetY",
		"curvature",
		"markerEnd",
		"markerStart",
		"interactionWidth"
	],
	compatConfig: { MODE: 3 },
	setup(props, { attrs }) {
		return () => {
			var _props$sourcePosition2, _props$targetPosition2;
			const [path, labelX, labelY] = getBezierPath(_objectSpread2(_objectSpread2({}, props), {}, {
				sourcePosition: (_props$sourcePosition2 = props.sourcePosition) !== null && _props$sourcePosition2 !== void 0 ? _props$sourcePosition2 : Position.Bottom,
				targetPosition: (_props$targetPosition2 = props.targetPosition) !== null && _props$targetPosition2 !== void 0 ? _props$targetPosition2 : Position.Top
			}));
			return h(_sfc_main$d, _objectSpread2(_objectSpread2({
				path,
				labelX,
				labelY
			}, attrs), props));
		};
	}
});
var SimpleBezierEdge$1 = defineComponent({
	name: "SimpleBezierEdge",
	props: [
		"sourcePosition",
		"targetPosition",
		"label",
		"labelStyle",
		"labelShowBg",
		"labelBgStyle",
		"labelBgPadding",
		"labelBgBorderRadius",
		"sourceY",
		"sourceX",
		"targetX",
		"targetY",
		"markerEnd",
		"markerStart",
		"interactionWidth"
	],
	compatConfig: { MODE: 3 },
	setup(props, { attrs }) {
		return () => {
			var _props$sourcePosition3, _props$targetPosition3;
			const [path, labelX, labelY] = getSimpleBezierPath(_objectSpread2(_objectSpread2({}, props), {}, {
				sourcePosition: (_props$sourcePosition3 = props.sourcePosition) !== null && _props$sourcePosition3 !== void 0 ? _props$sourcePosition3 : Position.Bottom,
				targetPosition: (_props$targetPosition3 = props.targetPosition) !== null && _props$targetPosition3 !== void 0 ? _props$targetPosition3 : Position.Top
			}));
			return h(_sfc_main$d, _objectSpread2(_objectSpread2({
				path,
				labelX,
				labelY
			}, attrs), props));
		};
	}
});
var defaultNodeTypes = {
	input: InputNode$1,
	default: DefaultNode$1,
	output: OutputNode$1
};
var defaultEdgeTypes = {
	default: BezierEdge$1,
	straight: StraightEdge$1,
	step: StepEdge$1,
	smoothstep: SmoothStepEdge$1,
	simplebezier: SimpleBezierEdge$1
};
function useGetters(state, nodeLookup, edgeLookup) {
	const getNode = computed(() => (id2) => nodeLookup.value.get(id2));
	const getEdge = computed(() => (id2) => edgeLookup.value.get(id2));
	const getEdgeTypes = computed(() => {
		const edgeTypes = _objectSpread2(_objectSpread2({}, defaultEdgeTypes), state.edgeTypes);
		const keys = Object.keys(edgeTypes);
		for (const e of state.edges) e.type && !keys.includes(e.type) && (edgeTypes[e.type] = e.type);
		return edgeTypes;
	});
	const getNodeTypes = computed(() => {
		const nodeTypes = _objectSpread2(_objectSpread2({}, defaultNodeTypes), state.nodeTypes);
		const keys = Object.keys(nodeTypes);
		for (const n of state.nodes) n.type && !keys.includes(n.type) && (nodeTypes[n.type] = n.type);
		return nodeTypes;
	});
	const getNodes = computed(() => {
		if (state.onlyRenderVisibleElements) return getNodesInside(state.nodes, {
			x: 0,
			y: 0,
			width: state.dimensions.width,
			height: state.dimensions.height
		}, state.viewport, true);
		return state.nodes;
	});
	const getEdges = computed(() => {
		if (state.onlyRenderVisibleElements) {
			const visibleEdges = [];
			for (const edge of state.edges) {
				const source = nodeLookup.value.get(edge.source);
				const target = nodeLookup.value.get(edge.target);
				if (isEdgeVisible({
					sourcePos: source.computedPosition || {
						x: 0,
						y: 0
					},
					targetPos: target.computedPosition || {
						x: 0,
						y: 0
					},
					sourceWidth: source.dimensions.width,
					sourceHeight: source.dimensions.height,
					targetWidth: target.dimensions.width,
					targetHeight: target.dimensions.height,
					width: state.dimensions.width,
					height: state.dimensions.height,
					viewport: state.viewport
				})) visibleEdges.push(edge);
			}
			return visibleEdges;
		}
		return state.edges;
	});
	const getElements = computed(() => [...getNodes.value, ...getEdges.value]);
	const getSelectedNodes = computed(() => {
		const selectedNodes = [];
		for (const node of state.nodes) if (node.selected) selectedNodes.push(node);
		return selectedNodes;
	});
	const getSelectedEdges = computed(() => {
		const selectedEdges = [];
		for (const edge of state.edges) if (edge.selected) selectedEdges.push(edge);
		return selectedEdges;
	});
	const getSelectedElements = computed(() => [...getSelectedNodes.value, ...getSelectedEdges.value]);
	const getNodesInitialized = computed(() => {
		const initializedNodes = [];
		for (const node of state.nodes) if (!!node.dimensions.width && !!node.dimensions.height && node.handleBounds !== void 0) initializedNodes.push(node);
		return initializedNodes;
	});
	return {
		getNode,
		getEdge,
		getElements,
		getEdgeTypes,
		getNodeTypes,
		getEdges,
		getNodes,
		getSelectedElements,
		getSelectedNodes,
		getSelectedEdges,
		getNodesInitialized,
		areNodesInitialized: computed(() => getNodes.value.length > 0 && getNodesInitialized.value.length === getNodes.value.length)
	};
}
var Storage = class Storage {
	constructor() {
		this.currentId = 0;
		this.flows = /* @__PURE__ */ new Map();
	}
	static getInstance() {
		var _ref29;
		var _a;
		const vueApp = (_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app;
		const existingInstance = (_ref29 = vueApp == null ? void 0 : vueApp.config.globalProperties.$vueFlowStorage) !== null && _ref29 !== void 0 ? _ref29 : Storage.instance;
		Storage.instance = existingInstance !== null && existingInstance !== void 0 ? existingInstance : new Storage();
		if (vueApp) vueApp.config.globalProperties.$vueFlowStorage = Storage.instance;
		return Storage.instance;
	}
	set(id2, flow) {
		return this.flows.set(id2, flow);
	}
	get(id2) {
		return this.flows.get(id2);
	}
	remove(id2) {
		return this.flows.delete(id2);
	}
	create(id2, preloadedState) {
		const state = useState();
		const reactiveState = reactive(state);
		const hooksOn = {};
		for (const [n, h2] of Object.entries(reactiveState.hooks)) {
			const name = `on${n.charAt(0).toUpperCase() + n.slice(1)}`;
			hooksOn[name] = h2.on;
		}
		const emits = {};
		for (const [n, h2] of Object.entries(reactiveState.hooks)) emits[n] = h2.trigger;
		const nodeLookup = computed(() => {
			const nodesMap = /* @__PURE__ */ new Map();
			for (const node of reactiveState.nodes) nodesMap.set(node.id, node);
			return nodesMap;
		});
		const edgeLookup = computed(() => {
			const edgesMap = /* @__PURE__ */ new Map();
			for (const edge of reactiveState.edges) edgesMap.set(edge.id, edge);
			return edgesMap;
		});
		const getters = useGetters(reactiveState, nodeLookup, edgeLookup);
		const actions = useActions(reactiveState, nodeLookup, edgeLookup);
		actions.setState(_objectSpread2(_objectSpread2({}, reactiveState), preloadedState));
		const flow = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, hooksOn), getters), actions), toRefs(reactiveState)), {}, {
			nodeLookup,
			edgeLookup,
			emits,
			id: id2,
			vueFlowVersion: "1.48.2",
			$destroy: () => {
				this.remove(id2);
			}
		});
		this.set(id2, flow);
		return flow;
	}
	getId() {
		return `vue-flow-${this.currentId++}`;
	}
};
function useVueFlow(idOrOpts) {
	const storage = Storage.getInstance();
	const scope = getCurrentScope();
	const isOptsObj = typeof idOrOpts === "object";
	const options = isOptsObj ? idOrOpts : { id: idOrOpts };
	const id2 = options.id;
	const vueFlowId = id2 !== null && id2 !== void 0 ? id2 : scope == null ? void 0 : scope.vueFlowId;
	let vueFlow;
	if (scope) {
		const injectedState = inject(VueFlow, null);
		if (typeof injectedState !== "undefined" && injectedState !== null && (!vueFlowId || injectedState.id === vueFlowId)) vueFlow = injectedState;
	}
	if (!vueFlow) {
		if (vueFlowId) vueFlow = storage.get(vueFlowId);
	}
	if (!vueFlow || vueFlowId && vueFlow.id !== vueFlowId) {
		const name = id2 !== null && id2 !== void 0 ? id2 : storage.getId();
		const state = storage.create(name, options);
		vueFlow = state;
		(scope !== null && scope !== void 0 ? scope : effectScope(true)).run(() => {
			watch(state.applyDefault, (shouldApplyDefault, __, onCleanup) => {
				const nodesChangeHandler = (changes) => {
					state.applyNodeChanges(changes);
				};
				const edgesChangeHandler = (changes) => {
					state.applyEdgeChanges(changes);
				};
				if (shouldApplyDefault) {
					state.onNodesChange(nodesChangeHandler);
					state.onEdgesChange(edgesChangeHandler);
				} else {
					state.hooks.value.nodesChange.off(nodesChangeHandler);
					state.hooks.value.edgesChange.off(edgesChangeHandler);
				}
				onCleanup(() => {
					state.hooks.value.nodesChange.off(nodesChangeHandler);
					state.hooks.value.edgesChange.off(edgesChangeHandler);
				});
			}, { immediate: true });
			tryOnScopeDispose(() => {
				if (vueFlow) {
					const storedInstance = storage.get(vueFlow.id);
					if (storedInstance) storedInstance.$destroy();
					else warn(`No store instance found for id ${vueFlow.id} in storage.`);
				}
			});
		});
	} else if (isOptsObj) vueFlow.setState(options);
	if (scope) {
		provide(VueFlow, vueFlow);
		scope.vueFlowId = vueFlow.id;
	}
	if (isOptsObj) {
		const instance = getCurrentInstance();
		if ((instance == null ? void 0 : instance.type.name) !== "VueFlow") vueFlow.emits.error(new VueFlowError(ErrorCode.USEVUEFLOW_OPTIONS));
	}
	return vueFlow;
}
function useResizeHandler(viewportEl) {
	const { emits, dimensions } = useVueFlow();
	let resizeObserver;
	onMounted(() => {
		const updateDimensions = () => {
			var _ref30;
			var _a, _b;
			if (!viewportEl.value || !((_ref30 = (_b = (_a = viewportEl.value).checkVisibility) == null ? void 0 : _b.call(_a)) !== null && _ref30 !== void 0 ? _ref30 : true)) return;
			const size = getDimensions(viewportEl.value);
			if (size.width === 0 || size.height === 0) emits.error(new VueFlowError(ErrorCode.MISSING_VIEWPORT_DIMENSIONS));
			dimensions.value = {
				width: size.width || 500,
				height: size.height || 500
			};
		};
		updateDimensions();
		window.addEventListener("resize", updateDimensions);
		if (viewportEl.value) {
			resizeObserver = new ResizeObserver(() => updateDimensions());
			resizeObserver.observe(viewportEl.value);
		}
		onBeforeUnmount(() => {
			window.removeEventListener("resize", updateDimensions);
			if (resizeObserver && viewportEl.value) resizeObserver.unobserve(viewportEl.value);
		});
	});
}
var _sfc_main$c = /* @__PURE__ */ defineComponent(_objectSpread2(_objectSpread2({}, {
	name: "UserSelection",
	compatConfig: { MODE: 3 }
}), {}, {
	props: { userSelectionRect: {} },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: "vue-flow__selection vue-flow__container",
				style: normalizeStyle({
					width: `${_ctx.userSelectionRect.width}px`,
					height: `${_ctx.userSelectionRect.height}px`,
					transform: `translate(${_ctx.userSelectionRect.x}px, ${_ctx.userSelectionRect.y}px)`
				})
			}, null, 4);
		};
	}
}));
var _hoisted_1$6$1 = ["tabIndex"];
var _sfc_main$b = /* @__PURE__ */ defineComponent(_objectSpread2(_objectSpread2({}, {
	name: "NodesSelection",
	compatConfig: { MODE: 3 }
}), {}, { setup(__props) {
	const { emits, viewport, getSelectedNodes, noPanClassName, disableKeyboardA11y, userSelectionActive } = useVueFlow();
	const updatePositions = useUpdateNodePositions();
	const el = ref(null);
	const dragging = useDrag({
		el,
		onStart(args) {
			emits.selectionDragStart(args);
			emits.nodeDragStart(args);
		},
		onDrag(args) {
			emits.selectionDrag(args);
			emits.nodeDrag(args);
		},
		onStop(args) {
			emits.selectionDragStop(args);
			emits.nodeDragStop(args);
		}
	});
	onMounted(() => {
		var _a;
		if (!disableKeyboardA11y.value) (_a = el.value) == null || _a.focus({ preventScroll: true });
	});
	const selectedNodesBBox = computed(() => getRectOfNodes(getSelectedNodes.value));
	const innerStyle = computed(() => ({
		width: `${selectedNodesBBox.value.width}px`,
		height: `${selectedNodesBBox.value.height}px`,
		top: `${selectedNodesBBox.value.y}px`,
		left: `${selectedNodesBBox.value.x}px`
	}));
	function onContextMenu(event) {
		emits.selectionContextMenu({
			event,
			nodes: getSelectedNodes.value
		});
	}
	function onKeyDown(event) {
		if (disableKeyboardA11y.value) return;
		if (arrowKeyDiffs[event.key]) {
			event.preventDefault();
			updatePositions({
				x: arrowKeyDiffs[event.key].x,
				y: arrowKeyDiffs[event.key].y
			}, event.shiftKey);
		}
	}
	return (_ctx, _cache) => {
		return !unref(userSelectionActive) && selectedNodesBBox.value.width && selectedNodesBBox.value.height ? (openBlock(), createElementBlock("div", {
			key: 0,
			class: normalizeClass(["vue-flow__nodesselection vue-flow__container", unref(noPanClassName)]),
			style: normalizeStyle({ transform: `translate(${unref(viewport).x}px,${unref(viewport).y}px) scale(${unref(viewport).zoom})` })
		}, [createBaseVNode("div", {
			ref_key: "el",
			ref: el,
			class: normalizeClass([{ dragging: unref(dragging) }, "vue-flow__nodesselection-rect"]),
			style: normalizeStyle(innerStyle.value),
			tabIndex: unref(disableKeyboardA11y) ? void 0 : -1,
			onContextmenu: onContextMenu,
			onKeydown: onKeyDown
		}, null, 46, _hoisted_1$6$1)], 6)) : createCommentVNode("", true);
	};
} }));
function getMousePosition(event, containerBounds) {
	return {
		x: event.clientX - containerBounds.left,
		y: event.clientY - containerBounds.top
	};
}
var _sfc_main$a = /* @__PURE__ */ defineComponent(_objectSpread2(_objectSpread2({}, {
	name: "Pane",
	compatConfig: { MODE: 3 }
}), {}, {
	props: {
		isSelecting: { type: Boolean },
		selectionKeyPressed: { type: Boolean }
	},
	setup(__props) {
		const { vueFlowRef, nodes, viewport, emits, userSelectionActive, removeSelectedElements, userSelectionRect, elementsSelectable, nodesSelectionActive, getSelectedEdges, getSelectedNodes, removeNodes, removeEdges, selectionMode, deleteKeyCode, multiSelectionKeyCode, multiSelectionActive, edgeLookup, nodeLookup, connectionLookup, defaultEdgeOptions, connectionStartHandle, panOnDrag } = useVueFlow();
		const container = shallowRef(null);
		const selectedNodeIds = shallowRef(/* @__PURE__ */ new Set());
		const selectedEdgeIds = shallowRef(/* @__PURE__ */ new Set());
		const containerBounds = shallowRef(null);
		const hasActiveSelection = toRef(() => elementsSelectable.value && (__props.isSelecting || userSelectionActive.value));
		const connectionInProgress = toRef(() => connectionStartHandle.value !== null);
		let selectionInProgress = false;
		let selectionStarted = false;
		const deleteKeyPressed = useKeyPress(deleteKeyCode, { actInsideInputWithModifier: false });
		const multiSelectKeyPressed = useKeyPress(multiSelectionKeyCode);
		watch(deleteKeyPressed, (isKeyPressed) => {
			if (!isKeyPressed) return;
			removeNodes(getSelectedNodes.value);
			removeEdges(getSelectedEdges.value);
			nodesSelectionActive.value = false;
		});
		watch(multiSelectKeyPressed, (isKeyPressed) => {
			multiSelectionActive.value = isKeyPressed;
		});
		function wrapHandler(handler, containerRef) {
			return (event) => {
				if (event.target !== containerRef) return;
				handler == null || handler(event);
			};
		}
		function onClick(event) {
			if (selectionInProgress || connectionInProgress.value) {
				selectionInProgress = false;
				return;
			}
			emits.paneClick(event);
			removeSelectedElements();
			nodesSelectionActive.value = false;
		}
		function onContextMenu(event) {
			var _a;
			if (Array.isArray(panOnDrag.value) && ((_a = panOnDrag.value) == null ? void 0 : _a.includes(2))) {
				event.preventDefault();
				return;
			}
			emits.paneContextMenu(event);
		}
		function onWheel(event) {
			emits.paneScroll(event);
		}
		function onPointerDown(event) {
			var _ref31;
			var _a, _b, _c;
			containerBounds.value = (_ref31 = (_a = vueFlowRef.value) == null ? void 0 : _a.getBoundingClientRect()) !== null && _ref31 !== void 0 ? _ref31 : null;
			if (!elementsSelectable.value || !__props.isSelecting || event.button !== 0 || event.target !== container.value || !containerBounds.value) return;
			(_c = (_b = event.target) == null ? void 0 : _b.setPointerCapture) == null || _c.call(_b, event.pointerId);
			const { x, y } = getMousePosition(event, containerBounds.value);
			selectionStarted = true;
			selectionInProgress = false;
			removeSelectedElements();
			userSelectionRect.value = {
				width: 0,
				height: 0,
				startX: x,
				startY: y,
				x,
				y
			};
			emits.selectionStart(event);
		}
		function onPointerMove(event) {
			var _ref32;
			var _a;
			if (!containerBounds.value || !userSelectionRect.value) return;
			selectionInProgress = true;
			const { x: mouseX, y: mouseY } = getEventPosition(event, containerBounds.value);
			const { startX = 0, startY = 0 } = userSelectionRect.value;
			const nextUserSelectRect = {
				startX,
				startY,
				x: mouseX < startX ? mouseX : startX,
				y: mouseY < startY ? mouseY : startY,
				width: Math.abs(mouseX - startX),
				height: Math.abs(mouseY - startY)
			};
			const prevSelectedNodeIds = selectedNodeIds.value;
			const prevSelectedEdgeIds = selectedEdgeIds.value;
			selectedNodeIds.value = new Set(getNodesInside(nodes.value, nextUserSelectRect, viewport.value, selectionMode.value === SelectionMode.Partial, true).map((node) => node.id));
			selectedEdgeIds.value = /* @__PURE__ */ new Set();
			const edgesSelectable = (_ref32 = (_a = defaultEdgeOptions.value) == null ? void 0 : _a.selectable) !== null && _ref32 !== void 0 ? _ref32 : true;
			for (const nodeId of selectedNodeIds.value) {
				const connections = connectionLookup.value.get(nodeId);
				if (!connections) continue;
				for (const { edgeId } of connections.values()) {
					var _edge$selectable2;
					const edge = edgeLookup.value.get(edgeId);
					if (edge && ((_edge$selectable2 = edge.selectable) !== null && _edge$selectable2 !== void 0 ? _edge$selectable2 : edgesSelectable)) selectedEdgeIds.value.add(edgeId);
				}
			}
			if (!areSetsEqual(prevSelectedNodeIds, selectedNodeIds.value)) {
				const changes = getSelectionChanges(nodeLookup.value, selectedNodeIds.value, true);
				emits.nodesChange(changes);
			}
			if (!areSetsEqual(prevSelectedEdgeIds, selectedEdgeIds.value)) {
				const changes = getSelectionChanges(edgeLookup.value, selectedEdgeIds.value);
				emits.edgesChange(changes);
			}
			userSelectionRect.value = nextUserSelectRect;
			userSelectionActive.value = true;
			nodesSelectionActive.value = false;
		}
		function onPointerUp(event) {
			var _a;
			if (event.button !== 0 || !selectionStarted) return;
			(_a = event.target) == null || _a.releasePointerCapture(event.pointerId);
			if (!userSelectionActive.value && userSelectionRect.value && event.target === container.value) onClick(event);
			userSelectionActive.value = false;
			userSelectionRect.value = null;
			nodesSelectionActive.value = selectedNodeIds.value.size > 0;
			emits.selectionEnd(event);
			if (__props.selectionKeyPressed) selectionInProgress = false;
			selectionStarted = false;
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "container",
				ref: container,
				class: normalizeClass(["vue-flow__pane vue-flow__container", { selection: _ctx.isSelecting }]),
				onClick: _cache[0] || (_cache[0] = (event) => hasActiveSelection.value ? void 0 : wrapHandler(onClick, container.value)(event)),
				onContextmenu: _cache[1] || (_cache[1] = ($event) => wrapHandler(onContextMenu, container.value)($event)),
				onWheelPassive: _cache[2] || (_cache[2] = ($event) => wrapHandler(onWheel, container.value)($event)),
				onPointerenter: _cache[3] || (_cache[3] = (event) => hasActiveSelection.value ? void 0 : unref(emits).paneMouseEnter(event)),
				onPointerdown: _cache[4] || (_cache[4] = (event) => hasActiveSelection.value ? onPointerDown(event) : unref(emits).paneMouseMove(event)),
				onPointermove: _cache[5] || (_cache[5] = (event) => hasActiveSelection.value ? onPointerMove(event) : unref(emits).paneMouseMove(event)),
				onPointerup: _cache[6] || (_cache[6] = (event) => hasActiveSelection.value ? onPointerUp(event) : void 0),
				onPointerleave: _cache[7] || (_cache[7] = ($event) => unref(emits).paneMouseLeave($event))
			}, [
				renderSlot(_ctx.$slots, "default"),
				unref(userSelectionActive) && unref(userSelectionRect) ? (openBlock(), createBlock(_sfc_main$c, {
					key: 0,
					"user-selection-rect": unref(userSelectionRect)
				}, null, 8, ["user-selection-rect"])) : createCommentVNode("", true),
				unref(nodesSelectionActive) && unref(getSelectedNodes).length ? (openBlock(), createBlock(_sfc_main$b, { key: 1 })) : createCommentVNode("", true)
			], 34);
		};
	}
}));
var _sfc_main$9 = /* @__PURE__ */ defineComponent(_objectSpread2(_objectSpread2({}, {
	name: "Transform",
	compatConfig: { MODE: 3 }
}), {}, { setup(__props) {
	const { viewport, fitViewOnInit, fitViewOnInitDone } = useVueFlow();
	const isHidden = computed(() => {
		if (fitViewOnInit.value) return !fitViewOnInitDone.value;
		return false;
	});
	const transform = computed(() => `translate(${viewport.value.x}px,${viewport.value.y}px) scale(${viewport.value.zoom})`);
	return (_ctx, _cache) => {
		return openBlock(), createElementBlock("div", {
			class: "vue-flow__transformationpane vue-flow__container",
			style: normalizeStyle({
				transform: transform.value,
				opacity: isHidden.value ? 0 : void 0
			})
		}, [renderSlot(_ctx.$slots, "default")], 4);
	};
} }));
var _sfc_main$8 = /* @__PURE__ */ defineComponent(_objectSpread2(_objectSpread2({}, {
	name: "Viewport",
	compatConfig: { MODE: 3 }
}), {}, { setup(__props) {
	const { minZoom, maxZoom, defaultViewport, translateExtent, zoomActivationKeyCode, selectionKeyCode, panActivationKeyCode, panOnScroll, panOnScrollMode, panOnScrollSpeed, panOnDrag, zoomOnDoubleClick, zoomOnPinch, zoomOnScroll, preventScrolling, noWheelClassName, noPanClassName, emits, connectionStartHandle, userSelectionActive, paneDragging, d3Zoom: storeD3Zoom, d3Selection: storeD3Selection, d3ZoomHandler: storeD3ZoomHandler, viewport, viewportRef, paneClickDistance } = useVueFlow();
	useResizeHandler(viewportRef);
	const isZoomingOrPanning = shallowRef(false);
	const isPanScrolling = shallowRef(false);
	let panScrollTimeout = null;
	let zoomedWithRightMouseButton = false;
	let mouseButton = 0;
	let prevTransform = {
		x: 0,
		y: 0,
		zoom: 0
	};
	const panKeyPressed = useKeyPress(panActivationKeyCode);
	const selectionKeyPressed = useKeyPress(selectionKeyCode);
	const zoomKeyPressed = useKeyPress(zoomActivationKeyCode);
	const shouldPanOnDrag = toRef(() => (!selectionKeyPressed.value || selectionKeyPressed.value && selectionKeyCode.value === true) && (panKeyPressed.value || panOnDrag.value));
	const shouldPanOnScroll = toRef(() => panKeyPressed.value || panOnScroll.value);
	const shouldSelectOnDrag = toRef(() => selectionKeyCode.value === true && shouldPanOnDrag.value !== true);
	const isSelecting = toRef(() => selectionKeyPressed.value && selectionKeyCode.value !== true || userSelectionActive.value || shouldSelectOnDrag.value);
	const connectionInProgress = toRef(() => connectionStartHandle.value !== null);
	onMounted(() => {
		var _defaultViewport$valu, _defaultViewport$valu2, _defaultViewport$valu3;
		if (!viewportRef.value) {
			warn("Viewport element is missing");
			return;
		}
		const viewportElement = viewportRef.value;
		const bbox = viewportElement.getBoundingClientRect();
		const d3Zoom = zoom().clickDistance(paneClickDistance.value).scaleExtent([minZoom.value, maxZoom.value]).translateExtent(translateExtent.value);
		const d3Selection = select(viewportElement).call(d3Zoom);
		const d3ZoomHandler = d3Selection.on("wheel.zoom");
		const updatedTransform = identity.translate((_defaultViewport$valu = defaultViewport.value.x) !== null && _defaultViewport$valu !== void 0 ? _defaultViewport$valu : 0, (_defaultViewport$valu2 = defaultViewport.value.y) !== null && _defaultViewport$valu2 !== void 0 ? _defaultViewport$valu2 : 0).scale(clamp((_defaultViewport$valu3 = defaultViewport.value.zoom) !== null && _defaultViewport$valu3 !== void 0 ? _defaultViewport$valu3 : 1, minZoom.value, maxZoom.value));
		const extent = [[0, 0], [bbox.width, bbox.height]];
		const constrainedTransform = d3Zoom.constrain()(updatedTransform, extent, translateExtent.value);
		d3Zoom.transform(d3Selection, constrainedTransform);
		d3Zoom.wheelDelta(wheelDelta);
		storeD3Zoom.value = d3Zoom;
		storeD3Selection.value = d3Selection;
		storeD3ZoomHandler.value = d3ZoomHandler;
		viewport.value = {
			x: constrainedTransform.x,
			y: constrainedTransform.y,
			zoom: constrainedTransform.k
		};
		d3Zoom.on("start", (event) => {
			var _a;
			if (!event.sourceEvent) return null;
			mouseButton = event.sourceEvent.button;
			isZoomingOrPanning.value = true;
			const flowTransform = eventToFlowTransform(event.transform);
			if (((_a = event.sourceEvent) == null ? void 0 : _a.type) === "mousedown") paneDragging.value = true;
			prevTransform = flowTransform;
			emits.viewportChangeStart(flowTransform);
			emits.moveStart({
				event,
				flowTransform
			});
		});
		d3Zoom.on("end", (event) => {
			var _mouseButton;
			if (!event.sourceEvent) return null;
			isZoomingOrPanning.value = false;
			paneDragging.value = false;
			if (isRightClickPan(shouldPanOnDrag.value, (_mouseButton = mouseButton) !== null && _mouseButton !== void 0 ? _mouseButton : 0) && !zoomedWithRightMouseButton) emits.paneContextMenu(event.sourceEvent);
			zoomedWithRightMouseButton = false;
			if (viewChanged(prevTransform, event.transform)) {
				const flowTransform = eventToFlowTransform(event.transform);
				prevTransform = flowTransform;
				emits.viewportChangeEnd(flowTransform);
				emits.moveEnd({
					event,
					flowTransform
				});
			}
		});
		d3Zoom.filter((event) => {
			var _a;
			const zoomScroll = zoomKeyPressed.value || zoomOnScroll.value;
			const pinchZoom = zoomOnPinch.value && event.ctrlKey;
			const eventButton = event.button;
			const isWheelEvent = event.type === "wheel";
			if (eventButton === 1 && event.type === "mousedown" && (isWrappedWithClass(event, "vue-flow__node") || isWrappedWithClass(event, "vue-flow__edge"))) return true;
			if (!shouldPanOnDrag.value && !zoomScroll && !shouldPanOnScroll.value && !zoomOnDoubleClick.value && !zoomOnPinch.value) return false;
			if (userSelectionActive.value) return false;
			if (connectionInProgress.value && !isWheelEvent) return false;
			if (!zoomOnDoubleClick.value && event.type === "dblclick") return false;
			if (isWrappedWithClass(event, noWheelClassName.value) && isWheelEvent) return false;
			if (isWrappedWithClass(event, noPanClassName.value) && (!isWheelEvent || shouldPanOnScroll.value && isWheelEvent && !zoomKeyPressed.value)) return false;
			if (!zoomOnPinch.value && event.ctrlKey && isWheelEvent) return false;
			if (!zoomScroll && !shouldPanOnScroll.value && !pinchZoom && isWheelEvent) return false;
			if (!zoomOnPinch && event.type === "touchstart" && ((_a = event.touches) == null ? void 0 : _a.length) > 1) {
				event.preventDefault();
				return false;
			}
			if (!shouldPanOnDrag.value && (event.type === "mousedown" || event.type === "touchstart")) return false;
			if (shouldSelectOnDrag.value && Array.isArray(panOnDrag.value) && panOnDrag.value.includes(0) && eventButton === 0) return false;
			if (Array.isArray(panOnDrag.value) && !panOnDrag.value.includes(eventButton) && (event.type === "mousedown" || event.type === "touchstart")) return false;
			const buttonAllowed = Array.isArray(panOnDrag.value) && panOnDrag.value.includes(eventButton) || selectionKeyCode.value === true && Array.isArray(panOnDrag.value) && !panOnDrag.value.includes(0) || !eventButton || eventButton <= 1;
			return (!event.ctrlKey || panKeyPressed.value || isWheelEvent) && buttonAllowed;
		});
		watch([userSelectionActive, shouldPanOnDrag], () => {
			if (userSelectionActive.value && !isZoomingOrPanning.value) d3Zoom.on("zoom", null);
			else if (!userSelectionActive.value) d3Zoom.on("zoom", (event) => {
				var _mouseButton2;
				viewport.value = {
					x: event.transform.x,
					y: event.transform.y,
					zoom: event.transform.k
				};
				const flowTransform = eventToFlowTransform(event.transform);
				zoomedWithRightMouseButton = isRightClickPan(shouldPanOnDrag.value, (_mouseButton2 = mouseButton) !== null && _mouseButton2 !== void 0 ? _mouseButton2 : 0);
				emits.viewportChange(flowTransform);
				emits.move({
					event,
					flowTransform
				});
			});
		}, { immediate: true });
		watch([
			userSelectionActive,
			shouldPanOnScroll,
			panOnScrollMode,
			zoomKeyPressed,
			zoomOnPinch,
			preventScrolling,
			noWheelClassName
		], () => {
			if (shouldPanOnScroll.value && !zoomKeyPressed.value && !userSelectionActive.value) d3Selection.on("wheel.zoom", (event) => {
				if (isWrappedWithClass(event, noWheelClassName.value)) return false;
				const zoomScroll = zoomKeyPressed.value || zoomOnScroll.value;
				const pinchZoom = zoomOnPinch.value && event.ctrlKey;
				if (!(!preventScrolling.value || shouldPanOnScroll.value || zoomScroll || pinchZoom)) return false;
				event.preventDefault();
				event.stopImmediatePropagation();
				const currentZoom = d3Selection.property("__zoom").k || 1;
				const _isMacOs = isMacOs();
				if (!panKeyPressed.value && event.ctrlKey && zoomOnPinch.value && _isMacOs) {
					const point = pointer(event);
					const pinchDelta = wheelDelta(event);
					const zoom2 = currentZoom * Math.pow(2, pinchDelta);
					d3Zoom.scaleTo(d3Selection, zoom2, point, event);
					return;
				}
				const deltaNormalize = event.deltaMode === 1 ? 20 : 1;
				let deltaX = panOnScrollMode.value === PanOnScrollMode.Vertical ? 0 : event.deltaX * deltaNormalize;
				let deltaY = panOnScrollMode.value === PanOnScrollMode.Horizontal ? 0 : event.deltaY * deltaNormalize;
				if (!_isMacOs && event.shiftKey && panOnScrollMode.value !== PanOnScrollMode.Vertical && !deltaX && deltaY) {
					deltaX = deltaY;
					deltaY = 0;
				}
				d3Zoom.translateBy(d3Selection, -(deltaX / currentZoom) * panOnScrollSpeed.value, -(deltaY / currentZoom) * panOnScrollSpeed.value);
				const nextViewport = eventToFlowTransform(d3Selection.property("__zoom"));
				if (panScrollTimeout) clearTimeout(panScrollTimeout);
				if (!isPanScrolling.value) {
					isPanScrolling.value = true;
					emits.moveStart({
						event,
						flowTransform: nextViewport
					});
					emits.viewportChangeStart(nextViewport);
				} else {
					emits.move({
						event,
						flowTransform: nextViewport
					});
					emits.viewportChange(nextViewport);
					panScrollTimeout = setTimeout(() => {
						emits.moveEnd({
							event,
							flowTransform: nextViewport
						});
						emits.viewportChangeEnd(nextViewport);
						isPanScrolling.value = false;
					}, 150);
				}
			}, { passive: false });
			else if (typeof d3ZoomHandler !== "undefined") d3Selection.on("wheel.zoom", function(event, d) {
				const invalidEvent = !preventScrolling.value && event.type === "wheel" && !event.ctrlKey;
				const zoomScroll = zoomKeyPressed.value || zoomOnScroll.value;
				const pinchZoom = zoomOnPinch.value && event.ctrlKey;
				if (!zoomScroll && !panOnScroll.value && !pinchZoom && event.type === "wheel" || invalidEvent || isWrappedWithClass(event, noWheelClassName.value)) return null;
				event.preventDefault();
				d3ZoomHandler.call(this, event, d);
			}, { passive: false });
		}, { immediate: true });
	});
	function isRightClickPan(pan, usedButton) {
		return usedButton === 2 && Array.isArray(pan) && pan.includes(2);
	}
	function viewChanged(prevViewport, eventTransform) {
		return prevViewport.x !== eventTransform.x && !Number.isNaN(eventTransform.x) || prevViewport.y !== eventTransform.y && !Number.isNaN(eventTransform.y) || prevViewport.zoom !== eventTransform.k && !Number.isNaN(eventTransform.k);
	}
	function eventToFlowTransform(eventTransform) {
		return {
			x: eventTransform.x,
			y: eventTransform.y,
			zoom: eventTransform.k
		};
	}
	function isWrappedWithClass(event, className) {
		return event.target.closest(`.${className}`);
	}
	return (_ctx, _cache) => {
		return openBlock(), createElementBlock("div", {
			ref_key: "viewportRef",
			ref: viewportRef,
			class: "vue-flow__viewport vue-flow__container"
		}, [createVNode(_sfc_main$a, {
			"is-selecting": isSelecting.value,
			"selection-key-pressed": unref(selectionKeyPressed),
			class: normalizeClass({
				connecting: connectionInProgress.value,
				dragging: unref(paneDragging),
				draggable: unref(panOnDrag) === true || Array.isArray(unref(panOnDrag)) && unref(panOnDrag).includes(0)
			})
		}, {
			default: withCtx(() => [createVNode(_sfc_main$9, null, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			})]),
			_: 3
		}, 8, [
			"is-selecting",
			"selection-key-pressed",
			"class"
		])], 512);
	};
} }));
var _hoisted_1$5$1 = ["id"];
var _hoisted_2$15 = ["id"];
var _hoisted_3$13 = ["id"];
var _sfc_main$7 = /* @__PURE__ */ defineComponent(_objectSpread2(_objectSpread2({}, {
	name: "A11yDescriptions",
	compatConfig: { MODE: 3 }
}), {}, { setup(__props) {
	const { id: id2, disableKeyboardA11y, ariaLiveMessage } = useVueFlow();
	return (_ctx, _cache) => {
		return openBlock(), createElementBlock(Fragment, null, [
			createBaseVNode("div", {
				id: `${unref(ARIA_NODE_DESC_KEY)}-${unref(id2)}`,
				style: { "display": "none" }
			}, " Press enter or space to select a node. " + toDisplayString(!unref(disableKeyboardA11y) ? "You can then use the arrow keys to move the node around." : "") + " You can then use the arrow keys to move the node around, press delete to remove it and press escape to cancel. ", 9, _hoisted_1$5$1),
			createBaseVNode("div", {
				id: `${unref(ARIA_EDGE_DESC_KEY)}-${unref(id2)}`,
				style: { "display": "none" }
			}, " Press enter or space to select an edge. You can then press delete to remove it or press escape to cancel. ", 8, _hoisted_2$15),
			!unref(disableKeyboardA11y) ? (openBlock(), createElementBlock("div", {
				key: 0,
				id: `${unref(ARIA_LIVE_MESSAGE)}-${unref(id2)}`,
				"aria-live": "assertive",
				"aria-atomic": "true",
				style: {
					"position": "absolute",
					"width": "1px",
					"height": "1px",
					"margin": "-1px",
					"border": "0",
					"padding": "0",
					"overflow": "hidden",
					"clip": "rect(0px, 0px, 0px, 0px)",
					"clip-path": "inset(100%)"
				}
			}, toDisplayString(unref(ariaLiveMessage)), 9, _hoisted_3$13)) : createCommentVNode("", true)
		], 64);
	};
} }));
function useOnInitHandler() {
	const vfInstance = useVueFlow();
	watch(() => vfInstance.viewportHelper.value.viewportInitialized, (isInitialized) => {
		if (isInitialized) setTimeout(() => {
			vfInstance.emits.init(vfInstance);
			vfInstance.emits.paneReady(vfInstance);
		}, 1);
	});
}
function shiftX(x, shift, position) {
	if (position === Position.Left) return x - shift;
	if (position === Position.Right) return x + shift;
	return x;
}
function shiftY(y, shift, position) {
	if (position === Position.Top) return y - shift;
	if (position === Position.Bottom) return y + shift;
	return y;
}
var EdgeAnchor = function({ radius = 10, centerX = 0, centerY = 0, position = Position.Top, type }) {
	return h("circle", {
		class: `vue-flow__edgeupdater vue-flow__edgeupdater-${type}`,
		cx: shiftX(centerX, radius, position),
		cy: shiftY(centerY, radius, position),
		r: radius,
		stroke: "transparent",
		fill: "transparent"
	});
};
EdgeAnchor.props = [
	"radius",
	"centerX",
	"centerY",
	"position",
	"type"
];
EdgeAnchor.compatConfig = { MODE: 3 };
var EdgeAnchor$1 = EdgeAnchor;
var EdgeWrapper$1 = defineComponent({
	name: "Edge",
	compatConfig: { MODE: 3 },
	props: ["id"],
	setup(props) {
		const { id: vueFlowId, addSelectedEdges, connectionMode, edgeUpdaterRadius, emits, nodesSelectionActive, noPanClassName, getEdgeTypes, removeSelectedEdges, findEdge, findNode, isValidConnection, multiSelectionActive, disableKeyboardA11y, elementsSelectable, edgesUpdatable, edgesFocusable, hooks } = useVueFlow();
		const edge = computed(() => findEdge(props.id));
		const { emit, on } = useEdgeHooks(edge.value, emits);
		const slots = inject(Slots);
		const instance = getCurrentInstance();
		const mouseOver = ref(false);
		const updating = ref(false);
		const nodeId = ref("");
		const handleId = ref(null);
		const edgeUpdaterType = ref("source");
		const edgeEl = ref(null);
		const isSelectable = toRef(() => typeof edge.value.selectable === "undefined" ? elementsSelectable.value : edge.value.selectable);
		const isUpdatable = toRef(() => typeof edge.value.updatable === "undefined" ? edgesUpdatable.value : edge.value.updatable);
		const isFocusable = toRef(() => typeof edge.value.focusable === "undefined" ? edgesFocusable.value : edge.value.focusable);
		provide(EdgeId, props.id);
		provide(EdgeRef, edgeEl);
		const edgeClass = computed(() => edge.value.class instanceof Function ? edge.value.class(edge.value) : edge.value.class);
		const edgeStyle = computed(() => edge.value.style instanceof Function ? edge.value.style(edge.value) : edge.value.style);
		const edgeCmp = computed(() => {
			var _edge$value$template;
			const name = edge.value.type || "default";
			const slot = slots == null ? void 0 : slots[`edge-${name}`];
			if (slot) return slot;
			let edgeType = (_edge$value$template = edge.value.template) !== null && _edge$value$template !== void 0 ? _edge$value$template : getEdgeTypes.value[name];
			if (typeof edgeType === "string") {
				if (instance) {
					const components = Object.keys(instance.appContext.components);
					if (components && components.includes(name)) edgeType = resolveComponent(name, false);
				}
			}
			if (edgeType && typeof edgeType !== "string") return edgeType;
			emits.error(new VueFlowError(ErrorCode.EDGE_TYPE_MISSING, edgeType));
			return false;
		});
		const { handlePointerDown } = useHandle({
			nodeId,
			handleId,
			type: edgeUpdaterType,
			isValidConnection,
			edgeUpdaterType,
			onEdgeUpdate,
			onEdgeUpdateEnd
		});
		return () => {
			var _edge$value$ariaLabel;
			const sourceNode = findNode(edge.value.source);
			const targetNode = findNode(edge.value.target);
			const pathOptions = "pathOptions" in edge.value ? edge.value.pathOptions : {};
			if (!sourceNode && !targetNode) {
				emits.error(new VueFlowError(ErrorCode.EDGE_SOURCE_TARGET_MISSING, edge.value.id, edge.value.source, edge.value.target));
				return null;
			}
			if (!sourceNode) {
				emits.error(new VueFlowError(ErrorCode.EDGE_SOURCE_MISSING, edge.value.id, edge.value.source));
				return null;
			}
			if (!targetNode) {
				emits.error(new VueFlowError(ErrorCode.EDGE_TARGET_MISSING, edge.value.id, edge.value.target));
				return null;
			}
			if (!edge.value || edge.value.hidden || sourceNode.hidden || targetNode.hidden) return null;
			let sourceNodeHandles;
			if (connectionMode.value === ConnectionMode.Strict) sourceNodeHandles = sourceNode.handleBounds.source;
			else sourceNodeHandles = [...sourceNode.handleBounds.source || [], ...sourceNode.handleBounds.target || []];
			const sourceHandle = getEdgeHandle(sourceNodeHandles, edge.value.sourceHandle);
			let targetNodeHandles;
			if (connectionMode.value === ConnectionMode.Strict) targetNodeHandles = targetNode.handleBounds.target;
			else targetNodeHandles = [...targetNode.handleBounds.target || [], ...targetNode.handleBounds.source || []];
			const targetHandle = getEdgeHandle(targetNodeHandles, edge.value.targetHandle);
			const sourcePosition = (sourceHandle == null ? void 0 : sourceHandle.position) || Position.Bottom;
			const targetPosition = (targetHandle == null ? void 0 : targetHandle.position) || Position.Top;
			const { x: sourceX, y: sourceY } = getHandlePosition(sourceNode, sourceHandle, sourcePosition);
			const { x: targetX, y: targetY } = getHandlePosition(targetNode, targetHandle, targetPosition);
			edge.value.sourceX = sourceX;
			edge.value.sourceY = sourceY;
			edge.value.targetX = targetX;
			edge.value.targetY = targetY;
			return h("g", _objectSpread2(_objectSpread2({
				"ref": edgeEl,
				"key": props.id,
				"data-id": props.id,
				"class": [
					"vue-flow__edge",
					`vue-flow__edge-${edgeCmp.value === false ? "default" : edge.value.type || "default"}`,
					noPanClassName.value,
					edgeClass.value,
					{
						updating: mouseOver.value,
						selected: edge.value.selected,
						animated: edge.value.animated,
						inactive: !isSelectable.value && !hooks.value.edgeClick.hasListeners()
					}
				],
				"tabIndex": isFocusable.value ? 0 : void 0,
				"aria-label": edge.value.ariaLabel === null ? void 0 : (_edge$value$ariaLabel = edge.value.ariaLabel) !== null && _edge$value$ariaLabel !== void 0 ? _edge$value$ariaLabel : `Edge from ${edge.value.source} to ${edge.value.target}`,
				"aria-describedby": isFocusable.value ? `${ARIA_EDGE_DESC_KEY}-${vueFlowId}` : void 0,
				"aria-roledescription": "edge",
				"role": isFocusable.value ? "group" : "img"
			}, edge.value.domAttributes), {}, {
				"onClick": onEdgeClick,
				"onContextmenu": onEdgeContextMenu,
				"onDblclick": onDoubleClick,
				"onMouseenter": onEdgeMouseEnter,
				"onMousemove": onEdgeMouseMove,
				"onMouseleave": onEdgeMouseLeave,
				"onKeyDown": isFocusable.value ? onKeyDown : void 0
			}), [updating.value ? null : h(edgeCmp.value === false ? getEdgeTypes.value.default : edgeCmp.value, _objectSpread2({
				id: props.id,
				sourceNode,
				targetNode,
				source: edge.value.source,
				target: edge.value.target,
				type: edge.value.type,
				updatable: isUpdatable.value,
				selected: edge.value.selected,
				animated: edge.value.animated,
				label: edge.value.label,
				labelStyle: edge.value.labelStyle,
				labelShowBg: edge.value.labelShowBg,
				labelBgStyle: edge.value.labelBgStyle,
				labelBgPadding: edge.value.labelBgPadding,
				labelBgBorderRadius: edge.value.labelBgBorderRadius,
				data: edge.value.data,
				events: _objectSpread2(_objectSpread2({}, edge.value.events), on),
				style: edgeStyle.value,
				markerStart: `url('#${getMarkerId(edge.value.markerStart, vueFlowId)}')`,
				markerEnd: `url('#${getMarkerId(edge.value.markerEnd, vueFlowId)}')`,
				sourcePosition,
				targetPosition,
				sourceX,
				sourceY,
				targetX,
				targetY,
				sourceHandleId: edge.value.sourceHandle,
				targetHandleId: edge.value.targetHandle,
				interactionWidth: edge.value.interactionWidth
			}, pathOptions)), [isUpdatable.value === "source" || isUpdatable.value === true ? [h("g", {
				onMousedown: onEdgeUpdaterSourceMouseDown,
				onMouseenter: onEdgeUpdaterMouseEnter,
				onMouseout: onEdgeUpdaterMouseOut
			}, h(EdgeAnchor$1, {
				"position": sourcePosition,
				"centerX": sourceX,
				"centerY": sourceY,
				"radius": edgeUpdaterRadius.value,
				"type": "source",
				"data-type": "source"
			}))] : null, isUpdatable.value === "target" || isUpdatable.value === true ? [h("g", {
				onMousedown: onEdgeUpdaterTargetMouseDown,
				onMouseenter: onEdgeUpdaterMouseEnter,
				onMouseout: onEdgeUpdaterMouseOut
			}, h(EdgeAnchor$1, {
				"position": targetPosition,
				"centerX": targetX,
				"centerY": targetY,
				"radius": edgeUpdaterRadius.value,
				"type": "target",
				"data-type": "target"
			}))] : null]]);
		};
		function onEdgeUpdaterMouseEnter() {
			mouseOver.value = true;
		}
		function onEdgeUpdaterMouseOut() {
			mouseOver.value = false;
		}
		function onEdgeUpdate(event, connection) {
			emit.update({
				event,
				edge: edge.value,
				connection
			});
		}
		function onEdgeUpdateEnd(event) {
			emit.updateEnd({
				event,
				edge: edge.value
			});
			updating.value = false;
		}
		function handleEdgeUpdater(event, isSourceHandle) {
			var _ref33;
			if (event.button !== 0) return;
			updating.value = true;
			nodeId.value = isSourceHandle ? edge.value.target : edge.value.source;
			handleId.value = (_ref33 = isSourceHandle ? edge.value.targetHandle : edge.value.sourceHandle) !== null && _ref33 !== void 0 ? _ref33 : null;
			edgeUpdaterType.value = isSourceHandle ? "target" : "source";
			emit.updateStart({
				event,
				edge: edge.value
			});
			handlePointerDown(event);
		}
		function onEdgeClick(event) {
			var _a;
			const data = {
				event,
				edge: edge.value
			};
			if (isSelectable.value) {
				nodesSelectionActive.value = false;
				if (edge.value.selected && multiSelectionActive.value) {
					removeSelectedEdges([edge.value]);
					(_a = edgeEl.value) == null || _a.blur();
				} else addSelectedEdges([edge.value]);
			}
			emit.click(data);
		}
		function onEdgeContextMenu(event) {
			emit.contextMenu({
				event,
				edge: edge.value
			});
		}
		function onDoubleClick(event) {
			emit.doubleClick({
				event,
				edge: edge.value
			});
		}
		function onEdgeMouseEnter(event) {
			emit.mouseEnter({
				event,
				edge: edge.value
			});
		}
		function onEdgeMouseMove(event) {
			emit.mouseMove({
				event,
				edge: edge.value
			});
		}
		function onEdgeMouseLeave(event) {
			emit.mouseLeave({
				event,
				edge: edge.value
			});
		}
		function onEdgeUpdaterSourceMouseDown(event) {
			handleEdgeUpdater(event, true);
		}
		function onEdgeUpdaterTargetMouseDown(event) {
			handleEdgeUpdater(event, false);
		}
		function onKeyDown(event) {
			var _a;
			if (!disableKeyboardA11y.value && elementSelectionKeys.includes(event.key) && isSelectable.value) {
				if (event.key === "Escape") {
					(_a = edgeEl.value) == null || _a.blur();
					removeSelectedEdges([findEdge(props.id)]);
				} else addSelectedEdges([findEdge(props.id)]);
			}
		}
	}
});
var ConnectionLine$1 = defineComponent({
	name: "ConnectionLine",
	compatConfig: { MODE: 3 },
	setup() {
		var _a;
		const { id: id2, connectionMode, connectionStartHandle, connectionEndHandle, connectionPosition, connectionLineType, connectionLineStyle, connectionLineOptions, connectionStatus, viewport, findNode } = useVueFlow();
		const connectionLineComponent = (_a = inject(Slots)) == null ? void 0 : _a["connection-line"];
		const fromNode = computed(() => {
			var _a2;
			return findNode((_a2 = connectionStartHandle.value) == null ? void 0 : _a2.nodeId);
		});
		const toNode = computed(() => {
			var _findNode;
			var _a2;
			return (_findNode = findNode((_a2 = connectionEndHandle.value) == null ? void 0 : _a2.nodeId)) !== null && _findNode !== void 0 ? _findNode : null;
		});
		const toXY = computed(() => {
			return {
				x: (connectionPosition.value.x - viewport.value.x) / viewport.value.zoom,
				y: (connectionPosition.value.y - viewport.value.y) / viewport.value.zoom
			};
		});
		const markerStart = computed(() => connectionLineOptions.value.markerStart ? `url(#${getMarkerId(connectionLineOptions.value.markerStart, id2)})` : "");
		const markerEnd = computed(() => connectionLineOptions.value.markerEnd ? `url(#${getMarkerId(connectionLineOptions.value.markerEnd, id2)})` : "");
		return () => {
			var _ref34, _ref36, _ref37, _ref38, _ref39, _connectionLineType$v;
			var _a2, _b, _c;
			if (!fromNode.value || !connectionStartHandle.value) return null;
			const startHandleId = connectionStartHandle.value.id;
			const handleType = connectionStartHandle.value.type;
			const fromHandleBounds = fromNode.value.handleBounds;
			let handleBounds = (_ref34 = fromHandleBounds == null ? void 0 : fromHandleBounds[handleType]) !== null && _ref34 !== void 0 ? _ref34 : [];
			if (connectionMode.value === ConnectionMode.Loose) {
				var _ref35;
				const oppositeBounds = (_ref35 = fromHandleBounds == null ? void 0 : fromHandleBounds[handleType === "source" ? "target" : "source"]) !== null && _ref35 !== void 0 ? _ref35 : [];
				handleBounds = [...handleBounds, ...oppositeBounds];
			}
			if (!handleBounds) return null;
			const fromHandle = (_ref36 = startHandleId ? handleBounds.find((d) => d.id === startHandleId) : handleBounds[0]) !== null && _ref36 !== void 0 ? _ref36 : null;
			const fromPosition = (_ref37 = fromHandle == null ? void 0 : fromHandle.position) !== null && _ref37 !== void 0 ? _ref37 : Position.Top;
			const { x: fromX, y: fromY } = getHandlePosition(fromNode.value, fromHandle, fromPosition);
			let toHandle = null;
			if (toNode.value) {
				if (connectionMode.value === ConnectionMode.Strict) toHandle = ((_a2 = toNode.value.handleBounds[handleType === "source" ? "target" : "source"]) == null ? void 0 : _a2.find((d) => {
					var _a3;
					return d.id === ((_a3 = connectionEndHandle.value) == null ? void 0 : _a3.id);
				})) || null;
				else {
					var _toNode$value$handleB, _toNode$value$handleB2;
					toHandle = ((_b = [...(_toNode$value$handleB = toNode.value.handleBounds.source) !== null && _toNode$value$handleB !== void 0 ? _toNode$value$handleB : [], ...(_toNode$value$handleB2 = toNode.value.handleBounds.target) !== null && _toNode$value$handleB2 !== void 0 ? _toNode$value$handleB2 : []]) == null ? void 0 : _b.find((d) => {
						var _a3;
						return d.id === ((_a3 = connectionEndHandle.value) == null ? void 0 : _a3.id);
					})) || null;
				}
			}
			const toPosition = (_ref38 = (_c = connectionEndHandle.value) == null ? void 0 : _c.position) !== null && _ref38 !== void 0 ? _ref38 : fromPosition ? oppositePosition[fromPosition] : null;
			if (!fromPosition || !toPosition) return null;
			const type = (_ref39 = (_connectionLineType$v = connectionLineType.value) !== null && _connectionLineType$v !== void 0 ? _connectionLineType$v : connectionLineOptions.value.type) !== null && _ref39 !== void 0 ? _ref39 : ConnectionLineType.Bezier;
			let dAttr = "";
			const pathParams = {
				sourceX: fromX,
				sourceY: fromY,
				sourcePosition: fromPosition,
				targetX: toXY.value.x,
				targetY: toXY.value.y,
				targetPosition: toPosition
			};
			if (type === ConnectionLineType.Bezier) [dAttr] = getBezierPath(pathParams);
			else if (type === ConnectionLineType.Step) [dAttr] = getSmoothStepPath(_objectSpread2(_objectSpread2({}, pathParams), {}, { borderRadius: 0 }));
			else if (type === ConnectionLineType.SmoothStep) [dAttr] = getSmoothStepPath(pathParams);
			else if (type === ConnectionLineType.SimpleBezier) [dAttr] = getSimpleBezierPath(pathParams);
			else dAttr = `M${fromX},${fromY} ${toXY.value.x},${toXY.value.y}`;
			return h("svg", { class: "vue-flow__edges vue-flow__connectionline vue-flow__container" }, h("g", { class: "vue-flow__connection" }, connectionLineComponent ? h(connectionLineComponent, {
				sourceX: fromX,
				sourceY: fromY,
				sourcePosition: fromPosition,
				targetX: toXY.value.x,
				targetY: toXY.value.y,
				targetPosition: toPosition,
				sourceNode: fromNode.value,
				sourceHandle: fromHandle,
				targetNode: toNode.value,
				targetHandle: toHandle,
				markerEnd: markerEnd.value,
				markerStart: markerStart.value,
				connectionStatus: connectionStatus.value
			}) : h("path", {
				"d": dAttr,
				"class": [
					connectionLineOptions.value.class,
					connectionStatus.value,
					"vue-flow__connection-path"
				],
				"style": _objectSpread2(_objectSpread2({}, connectionLineStyle.value), connectionLineOptions.value.style),
				"marker-end": markerEnd.value,
				"marker-start": markerStart.value
			})));
		};
	}
});
var _hoisted_1$4$1 = [
	"id",
	"markerWidth",
	"markerHeight",
	"markerUnits",
	"orient"
];
var _sfc_main$6 = /* @__PURE__ */ defineComponent(_objectSpread2(_objectSpread2({}, {
	name: "MarkerType",
	compatConfig: { MODE: 3 }
}), {}, {
	props: {
		id: {},
		type: {},
		color: { default: "none" },
		width: { default: 12.5 },
		height: { default: 12.5 },
		markerUnits: { default: "strokeWidth" },
		orient: { default: "auto-start-reverse" },
		strokeWidth: { default: 1 }
	},
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("marker", {
				id: _ctx.id,
				class: "vue-flow__arrowhead",
				viewBox: "-10 -10 20 20",
				refX: "0",
				refY: "0",
				markerWidth: `${_ctx.width}`,
				markerHeight: `${_ctx.height}`,
				markerUnits: _ctx.markerUnits,
				orient: _ctx.orient
			}, [_ctx.type === unref(MarkerType).ArrowClosed ? (openBlock(), createElementBlock("polyline", {
				key: 0,
				style: normalizeStyle({
					stroke: _ctx.color,
					fill: _ctx.color,
					strokeWidth: _ctx.strokeWidth
				}),
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				points: "-5,-4 0,0 -5,4 -5,-4"
			}, null, 4)) : createCommentVNode("", true), _ctx.type === unref(MarkerType).Arrow ? (openBlock(), createElementBlock("polyline", {
				key: 1,
				style: normalizeStyle({
					stroke: _ctx.color,
					strokeWidth: _ctx.strokeWidth
				}),
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				fill: "none",
				points: "-5,-4 0,0 -5,4"
			}, null, 4)) : createCommentVNode("", true)], 8, _hoisted_1$4$1);
		};
	}
}));
var _hoisted_1$3$1 = {
	class: "vue-flow__marker vue-flow__container",
	"aria-hidden": "true"
};
var _sfc_main$5 = /* @__PURE__ */ defineComponent(_objectSpread2(_objectSpread2({}, {
	name: "MarkerDefinitions",
	compatConfig: { MODE: 3 }
}), {}, { setup(__props) {
	const { id: vueFlowId, edges, connectionLineOptions, defaultMarkerColor: defaultColor } = useVueFlow();
	const markers = computed(() => {
		const ids = /* @__PURE__ */ new Set();
		const markers2 = [];
		const createMarkers = (marker) => {
			if (marker) {
				const markerId = getMarkerId(marker, vueFlowId);
				if (!ids.has(markerId)) {
					if (typeof marker === "object") markers2.push(_objectSpread2(_objectSpread2({}, marker), {}, {
						id: markerId,
						color: marker.color || defaultColor.value
					}));
					else markers2.push({
						id: markerId,
						color: defaultColor.value,
						type: marker
					});
					ids.add(markerId);
				}
			}
		};
		for (const marker of [connectionLineOptions.value.markerEnd, connectionLineOptions.value.markerStart]) createMarkers(marker);
		for (const edge of edges.value) for (const marker of [edge.markerStart, edge.markerEnd]) createMarkers(marker);
		return markers2.sort((a, b) => a.id.localeCompare(b.id));
	});
	return (_ctx, _cache) => {
		return openBlock(), createElementBlock("svg", _hoisted_1$3$1, [createBaseVNode("defs", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(markers.value, (marker) => {
			return openBlock(), createBlock(_sfc_main$6, {
				id: marker.id,
				key: marker.id,
				type: marker.type,
				color: marker.color,
				width: marker.width,
				height: marker.height,
				markerUnits: marker.markerUnits,
				"stroke-width": marker.strokeWidth,
				orient: marker.orient
			}, null, 8, [
				"id",
				"type",
				"color",
				"width",
				"height",
				"markerUnits",
				"stroke-width",
				"orient"
			]);
		}), 128))])]);
	};
} }));
var _sfc_main$4 = /* @__PURE__ */ defineComponent(_objectSpread2(_objectSpread2({}, {
	name: "Edges",
	compatConfig: { MODE: 3 }
}), {}, { setup(__props) {
	const { findNode, getEdges, elevateEdgesOnSelect } = useVueFlow();
	return (_ctx, _cache) => {
		return openBlock(), createElementBlock(Fragment, null, [
			createVNode(_sfc_main$5),
			(openBlock(true), createElementBlock(Fragment, null, renderList(unref(getEdges), (edge) => {
				return openBlock(), createElementBlock("svg", {
					key: edge.id,
					class: "vue-flow__edges vue-flow__container",
					style: normalizeStyle({ zIndex: unref(getEdgeZIndex)(edge, unref(findNode), unref(elevateEdgesOnSelect)) })
				}, [createVNode(unref(EdgeWrapper$1), { id: edge.id }, null, 8, ["id"])], 4);
			}), 128)),
			createVNode(unref(ConnectionLine$1))
		], 64);
	};
} }));
var NodeWrapper$1 = defineComponent({
	name: "Node",
	compatConfig: { MODE: 3 },
	props: ["id", "resizeObserver"],
	setup(props) {
		const { id: vueFlowId, noPanClassName, selectNodesOnDrag, nodesSelectionActive, multiSelectionActive, emits, removeSelectedNodes, addSelectedNodes, updateNodeDimensions, onUpdateNodeInternals, getNodeTypes, nodeExtent, elevateNodesOnSelect, disableKeyboardA11y, ariaLiveMessage, snapToGrid, snapGrid, nodeDragThreshold, nodesDraggable, elementsSelectable, nodesConnectable, nodesFocusable, hooks } = useVueFlow();
		const nodeElement = ref(null);
		provide(NodeRef, nodeElement);
		provide(NodeId, props.id);
		const slots = inject(Slots);
		const instance = getCurrentInstance();
		const updateNodePositions = useUpdateNodePositions();
		const { node, parentNode } = useNode(props.id);
		const { emit, on } = useNodeHooks(node, emits);
		const isDraggable = toRef(() => typeof node.draggable === "undefined" ? nodesDraggable.value : node.draggable);
		const isSelectable = toRef(() => typeof node.selectable === "undefined" ? elementsSelectable.value : node.selectable);
		const isConnectable = toRef(() => typeof node.connectable === "undefined" ? nodesConnectable.value : node.connectable);
		const isFocusable = toRef(() => typeof node.focusable === "undefined" ? nodesFocusable.value : node.focusable);
		const hasPointerEvents = computed(() => isSelectable.value || isDraggable.value || hooks.value.nodeClick.hasListeners() || hooks.value.nodeDoubleClick.hasListeners() || hooks.value.nodeMouseEnter.hasListeners() || hooks.value.nodeMouseMove.hasListeners() || hooks.value.nodeMouseLeave.hasListeners());
		const isInit = toRef(() => !!node.dimensions.width && !!node.dimensions.height);
		const nodeCmp = computed(() => {
			const name = node.type || "default";
			const slot = slots == null ? void 0 : slots[`node-${name}`];
			if (slot) return slot;
			let nodeType = node.template || getNodeTypes.value[name];
			if (typeof nodeType === "string") {
				if (instance) {
					const components = Object.keys(instance.appContext.components);
					if (components && components.includes(name)) nodeType = resolveComponent(name, false);
				}
			}
			if (nodeType && typeof nodeType !== "string") return nodeType;
			emits.error(new VueFlowError(ErrorCode.NODE_TYPE_MISSING, nodeType));
			return false;
		});
		const dragging = useDrag({
			id: props.id,
			el: nodeElement,
			disabled: () => !isDraggable.value,
			selectable: isSelectable,
			dragHandle: () => node.dragHandle,
			onStart(event) {
				emit.dragStart(event);
			},
			onDrag(event) {
				emit.drag(event);
			},
			onStop(event) {
				emit.dragStop(event);
			},
			onClick(event) {
				onSelectNode(event);
			}
		});
		const getClass = computed(() => node.class instanceof Function ? node.class(node) : node.class);
		const getStyle = computed(() => {
			const styles = (node.style instanceof Function ? node.style(node) : node.style) || {};
			const width = node.width instanceof Function ? node.width(node) : node.width;
			const height = node.height instanceof Function ? node.height(node) : node.height;
			if (!styles.width && width) styles.width = typeof width === "string" ? width : `${width}px`;
			if (!styles.height && height) styles.height = typeof height === "string" ? height : `${height}px`;
			return styles;
		});
		const zIndex = toRef(() => {
			var _ref40, _node$zIndex;
			return Number((_ref40 = (_node$zIndex = node.zIndex) !== null && _node$zIndex !== void 0 ? _node$zIndex : getStyle.value.zIndex) !== null && _ref40 !== void 0 ? _ref40 : 0);
		});
		onUpdateNodeInternals((updateIds) => {
			if (updateIds.includes(props.id) || !updateIds.length) updateInternals();
		});
		onMounted(() => {
			watch(() => node.hidden, (isHidden = false, _, onCleanup) => {
				if (!isHidden && nodeElement.value) {
					props.resizeObserver.observe(nodeElement.value);
					onCleanup(() => {
						if (nodeElement.value) props.resizeObserver.unobserve(nodeElement.value);
					});
				}
			}, {
				immediate: true,
				flush: "post"
			});
		});
		watch([
			() => node.type,
			() => node.sourcePosition,
			() => node.targetPosition
		], () => {
			nextTick(() => {
				updateNodeDimensions([{
					id: props.id,
					nodeElement: nodeElement.value,
					forceUpdate: true
				}]);
			});
		});
		watch([
			() => node.position.x,
			() => node.position.y,
			() => {
				var _a;
				return (_a = parentNode.value) == null ? void 0 : _a.computedPosition.x;
			},
			() => {
				var _a;
				return (_a = parentNode.value) == null ? void 0 : _a.computedPosition.y;
			},
			() => {
				var _a;
				return (_a = parentNode.value) == null ? void 0 : _a.computedPosition.z;
			},
			zIndex,
			() => node.selected,
			() => node.dimensions.height,
			() => node.dimensions.width,
			() => {
				var _a;
				return (_a = parentNode.value) == null ? void 0 : _a.dimensions.height;
			},
			() => {
				var _a;
				return (_a = parentNode.value) == null ? void 0 : _a.dimensions.width;
			}
		], ([newX, newY, parentX, parentY, parentZ, nodeZIndex]) => {
			const xyzPos = {
				x: newX,
				y: newY,
				z: nodeZIndex + (elevateNodesOnSelect.value ? node.selected ? 1e3 : 0 : 0)
			};
			if (typeof parentX !== "undefined" && typeof parentY !== "undefined") node.computedPosition = getXYZPos({
				x: parentX,
				y: parentY,
				z: parentZ
			}, xyzPos);
			else node.computedPosition = xyzPos;
		}, {
			flush: "post",
			immediate: true
		});
		watch([() => node.extent, nodeExtent], ([nodeExtent2, globalExtent], [oldNodeExtent, oldGlobalExtent]) => {
			if (nodeExtent2 !== oldNodeExtent || globalExtent !== oldGlobalExtent) clampPosition2();
		});
		if (node.extent === "parent" || typeof node.extent === "object" && "range" in node.extent && node.extent.range === "parent") until(() => isInit).toBe(true).then(clampPosition2);
		else clampPosition2();
		return () => {
			var _node$computedPositio, _node$computedPositio2;
			if (node.hidden) return null;
			return h("div", _objectSpread2(_objectSpread2({
				"ref": nodeElement,
				"data-id": node.id,
				"class": [
					"vue-flow__node",
					`vue-flow__node-${nodeCmp.value === false ? "default" : node.type || "default"}`,
					{
						[noPanClassName.value]: isDraggable.value,
						dragging: dragging == null ? void 0 : dragging.value,
						draggable: isDraggable.value,
						selected: node.selected,
						selectable: isSelectable.value,
						parent: node.isParent
					},
					getClass.value
				],
				"style": _objectSpread2({
					visibility: isInit.value ? "visible" : "hidden",
					zIndex: (_node$computedPositio = node.computedPosition.z) !== null && _node$computedPositio !== void 0 ? _node$computedPositio : zIndex.value,
					transform: `translate(${node.computedPosition.x}px,${node.computedPosition.y}px)`,
					pointerEvents: hasPointerEvents.value ? "all" : "none"
				}, getStyle.value),
				"tabIndex": isFocusable.value ? 0 : void 0,
				"role": isFocusable.value ? "group" : void 0,
				"aria-describedby": disableKeyboardA11y.value ? void 0 : `${ARIA_NODE_DESC_KEY}-${vueFlowId}`,
				"aria-label": node.ariaLabel,
				"aria-roledescription": "node"
			}, node.domAttributes), {}, {
				"onMouseenter": onMouseEnter,
				"onMousemove": onMouseMove,
				"onMouseleave": onMouseLeave,
				"onContextmenu": onContextMenu,
				"onClick": onSelectNode,
				"onDblclick": onDoubleClick,
				"onKeydown": onKeyDown
			}), [h(nodeCmp.value === false ? getNodeTypes.value.default : nodeCmp.value, {
				id: node.id,
				type: node.type,
				data: node.data,
				events: _objectSpread2(_objectSpread2({}, node.events), on),
				selected: node.selected,
				resizing: node.resizing,
				dragging: dragging.value,
				connectable: isConnectable.value,
				position: node.computedPosition,
				dimensions: node.dimensions,
				isValidTargetPos: node.isValidTargetPos,
				isValidSourcePos: node.isValidSourcePos,
				parent: node.parentNode,
				parentNodeId: node.parentNode,
				zIndex: (_node$computedPositio2 = node.computedPosition.z) !== null && _node$computedPositio2 !== void 0 ? _node$computedPositio2 : zIndex.value,
				targetPosition: node.targetPosition,
				sourcePosition: node.sourcePosition,
				label: node.label,
				dragHandle: node.dragHandle,
				onUpdateNodeInternals: updateInternals
			})]);
		};
		function clampPosition2() {
			const nextPosition = node.computedPosition;
			const { computedPosition, position } = calcNextPosition(node, snapToGrid.value ? snapPosition(nextPosition, snapGrid.value) : nextPosition, emits.error, nodeExtent.value, parentNode.value);
			if (node.computedPosition.x !== computedPosition.x || node.computedPosition.y !== computedPosition.y) node.computedPosition = _objectSpread2(_objectSpread2({}, node.computedPosition), computedPosition);
			if (node.position.x !== position.x || node.position.y !== position.y) node.position = position;
		}
		function updateInternals() {
			if (nodeElement.value) updateNodeDimensions([{
				id: props.id,
				nodeElement: nodeElement.value,
				forceUpdate: true
			}]);
		}
		function onMouseEnter(event) {
			if (!(dragging == null ? void 0 : dragging.value)) emit.mouseEnter({
				event,
				node
			});
		}
		function onMouseMove(event) {
			if (!(dragging == null ? void 0 : dragging.value)) emit.mouseMove({
				event,
				node
			});
		}
		function onMouseLeave(event) {
			if (!(dragging == null ? void 0 : dragging.value)) emit.mouseLeave({
				event,
				node
			});
		}
		function onContextMenu(event) {
			return emit.contextMenu({
				event,
				node
			});
		}
		function onDoubleClick(event) {
			return emit.doubleClick({
				event,
				node
			});
		}
		function onSelectNode(event) {
			if (isSelectable.value && (!selectNodesOnDrag.value || !isDraggable.value || nodeDragThreshold.value > 0)) handleNodeClick(node, multiSelectionActive.value, addSelectedNodes, removeSelectedNodes, nodesSelectionActive, false, nodeElement.value);
			emit.click({
				event,
				node
			});
		}
		function onKeyDown(event) {
			if (isInputDOMNode(event) || disableKeyboardA11y.value) return;
			if (elementSelectionKeys.includes(event.key) && isSelectable.value) {
				const unselect = event.key === "Escape";
				handleNodeClick(node, multiSelectionActive.value, addSelectedNodes, removeSelectedNodes, nodesSelectionActive, unselect, nodeElement.value);
			} else if (isDraggable.value && node.selected && arrowKeyDiffs[event.key]) {
				event.preventDefault();
				ariaLiveMessage.value = `Moved selected node ${event.key.replace("Arrow", "").toLowerCase()}. New position, x: ${~~node.position.x}, y: ${~~node.position.y}`;
				updateNodePositions({
					x: arrowKeyDiffs[event.key].x,
					y: arrowKeyDiffs[event.key].y
				}, event.shiftKey);
			}
		}
	}
});
var _hoisted_1$2$1 = {
	height: "0",
	width: "0"
};
_objectSpread2(_objectSpread2({}, {
	name: "EdgeLabelRenderer",
	compatConfig: { MODE: 3 }
}), {}, { setup(__props) {
	const { viewportRef } = useVueFlow();
	const teleportTarget = toRef(() => {
		var _a;
		return (_a = viewportRef.value) == null ? void 0 : _a.getElementsByClassName("vue-flow__edge-labels")[0];
	});
	return (_ctx, _cache) => {
		return openBlock(), createElementBlock("svg", null, [(openBlock(), createElementBlock("foreignObject", _hoisted_1$2$1, [(openBlock(), createBlock(Teleport, {
			to: teleportTarget.value,
			disabled: !teleportTarget.value
		}, [renderSlot(_ctx.$slots, "default")], 8, ["to", "disabled"]))]))]);
	};
} });
function useNodesInitialized(options = { includeHiddenNodes: false }) {
	const { nodes } = useVueFlow();
	return computed(() => {
		if (nodes.value.length === 0) return false;
		for (const node of nodes.value) if (options.includeHiddenNodes || !node.hidden) {
			if ((node == null ? void 0 : node.handleBounds) === void 0 || node.dimensions.width === 0 || node.dimensions.height === 0) return false;
		}
		return true;
	});
}
var _hoisted_1$1$1 = { class: "vue-flow__nodes vue-flow__container" };
var _sfc_main$2 = /* @__PURE__ */ defineComponent(_objectSpread2(_objectSpread2({}, {
	name: "Nodes",
	compatConfig: { MODE: 3 }
}), {}, { setup(__props) {
	const { getNodes, updateNodeDimensions, emits } = useVueFlow();
	const nodesInitialized = useNodesInitialized();
	const resizeObserver = ref();
	watch(nodesInitialized, (isInit) => {
		if (isInit) nextTick(() => {
			emits.nodesInitialized(getNodes.value);
		});
	}, { immediate: true });
	onMounted(() => {
		resizeObserver.value = new ResizeObserver((entries) => {
			const updates = entries.map((entry) => {
				return {
					id: entry.target.getAttribute("data-id"),
					nodeElement: entry.target,
					forceUpdate: true
				};
			});
			nextTick(() => updateNodeDimensions(updates));
		});
	});
	onBeforeUnmount(() => {
		var _a;
		return (_a = resizeObserver.value) == null ? void 0 : _a.disconnect();
	});
	return (_ctx, _cache) => {
		return openBlock(), createElementBlock("div", _hoisted_1$1$1, [resizeObserver.value ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(unref(getNodes), (node, __, ___, _cached) => {
			const _memo = [node.id];
			if (_cached && _cached.key === node.id && isMemoSame(_cached, _memo)) return _cached;
			const _item = (openBlock(), createBlock(unref(NodeWrapper$1), {
				id: node.id,
				key: node.id,
				"resize-observer": resizeObserver.value
			}, null, 8, ["id", "resize-observer"]));
			_item.memo = _memo;
			return _item;
		}, _cache, 0), 128)) : createCommentVNode("", true)]);
	};
} }));
function useStylesLoadedWarning() {
	const { emits } = useVueFlow();
	onMounted(() => {
		if (isDev()) {
			const pane = document.querySelector(".vue-flow__pane");
			if (pane && !(window.getComputedStyle(pane).zIndex === "1")) emits.error(new VueFlowError(ErrorCode.MISSING_STYLES));
		}
	});
}
var _hoisted_1$42 = /* @__PURE__ */ createBaseVNode("div", { class: "vue-flow__edge-labels" }, null, -1);
var _sfc_main$1 = /* @__PURE__ */ defineComponent(_objectSpread2(_objectSpread2({}, {
	name: "VueFlow",
	compatConfig: { MODE: 3 }
}), {}, {
	props: {
		id: {},
		modelValue: {},
		nodes: {},
		edges: {},
		edgeTypes: {},
		nodeTypes: {},
		connectionMode: {},
		connectionLineType: {},
		connectionLineStyle: { default: void 0 },
		connectionLineOptions: { default: void 0 },
		connectionRadius: {},
		isValidConnection: {
			type: [Function, null],
			default: void 0
		},
		deleteKeyCode: { default: void 0 },
		selectionKeyCode: {
			type: [Boolean, null],
			default: void 0
		},
		multiSelectionKeyCode: { default: void 0 },
		zoomActivationKeyCode: { default: void 0 },
		panActivationKeyCode: { default: void 0 },
		snapToGrid: {
			type: Boolean,
			default: void 0
		},
		snapGrid: {},
		onlyRenderVisibleElements: {
			type: Boolean,
			default: void 0
		},
		edgesUpdatable: {
			type: [Boolean, String],
			default: void 0
		},
		nodesDraggable: {
			type: Boolean,
			default: void 0
		},
		nodesConnectable: {
			type: Boolean,
			default: void 0
		},
		nodeDragThreshold: {},
		elementsSelectable: {
			type: Boolean,
			default: void 0
		},
		selectNodesOnDrag: {
			type: Boolean,
			default: void 0
		},
		panOnDrag: {
			type: [Boolean, Array],
			default: void 0
		},
		minZoom: {},
		maxZoom: {},
		defaultViewport: {},
		translateExtent: {},
		nodeExtent: {},
		defaultMarkerColor: {},
		zoomOnScroll: {
			type: Boolean,
			default: void 0
		},
		zoomOnPinch: {
			type: Boolean,
			default: void 0
		},
		panOnScroll: {
			type: Boolean,
			default: void 0
		},
		panOnScrollSpeed: {},
		panOnScrollMode: {},
		paneClickDistance: {},
		zoomOnDoubleClick: {
			type: Boolean,
			default: void 0
		},
		preventScrolling: {
			type: Boolean,
			default: void 0
		},
		selectionMode: {},
		edgeUpdaterRadius: {},
		fitViewOnInit: {
			type: Boolean,
			default: void 0
		},
		connectOnClick: {
			type: Boolean,
			default: void 0
		},
		applyDefault: {
			type: Boolean,
			default: void 0
		},
		autoConnect: {
			type: [Boolean, Function],
			default: void 0
		},
		noDragClassName: {},
		noWheelClassName: {},
		noPanClassName: {},
		defaultEdgeOptions: {},
		elevateEdgesOnSelect: {
			type: Boolean,
			default: void 0
		},
		elevateNodesOnSelect: {
			type: Boolean,
			default: void 0
		},
		disableKeyboardA11y: {
			type: Boolean,
			default: void 0
		},
		edgesFocusable: {
			type: Boolean,
			default: void 0
		},
		nodesFocusable: {
			type: Boolean,
			default: void 0
		},
		autoPanOnConnect: {
			type: Boolean,
			default: void 0
		},
		autoPanOnNodeDrag: {
			type: Boolean,
			default: void 0
		},
		autoPanSpeed: {}
	},
	emits: [
		"nodesChange",
		"edgesChange",
		"nodesInitialized",
		"paneReady",
		"init",
		"updateNodeInternals",
		"error",
		"connect",
		"connectStart",
		"connectEnd",
		"clickConnectStart",
		"clickConnectEnd",
		"moveStart",
		"move",
		"moveEnd",
		"selectionDragStart",
		"selectionDrag",
		"selectionDragStop",
		"selectionContextMenu",
		"selectionStart",
		"selectionEnd",
		"viewportChangeStart",
		"viewportChange",
		"viewportChangeEnd",
		"paneScroll",
		"paneClick",
		"paneContextMenu",
		"paneMouseEnter",
		"paneMouseMove",
		"paneMouseLeave",
		"edgeUpdate",
		"edgeContextMenu",
		"edgeMouseEnter",
		"edgeMouseMove",
		"edgeMouseLeave",
		"edgeDoubleClick",
		"edgeClick",
		"edgeUpdateStart",
		"edgeUpdateEnd",
		"nodeContextMenu",
		"nodeMouseEnter",
		"nodeMouseMove",
		"nodeMouseLeave",
		"nodeDoubleClick",
		"nodeClick",
		"nodeDragStart",
		"nodeDrag",
		"nodeDragStop",
		"miniMapNodeClick",
		"miniMapNodeDoubleClick",
		"miniMapNodeMouseEnter",
		"miniMapNodeMouseMove",
		"miniMapNodeMouseLeave",
		"update:modelValue",
		"update:nodes",
		"update:edges"
	],
	setup(__props, { expose: __expose, emit }) {
		const props = __props;
		const slots = useSlots();
		const modelValue = useVModel(props, "modelValue", emit);
		const modelNodes = useVModel(props, "nodes", emit);
		const modelEdges = useVModel(props, "edges", emit);
		const vfInstance = useVueFlow(props);
		const disposeWatchers = useWatchProps({
			modelValue,
			nodes: modelNodes,
			edges: modelEdges
		}, props, vfInstance);
		useHooks(emit, vfInstance.hooks);
		useOnInitHandler();
		useStylesLoadedWarning();
		provide(Slots, slots);
		onUnmounted(disposeWatchers);
		__expose(vfInstance);
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref: unref(vfInstance).vueFlowRef,
				class: "vue-flow"
			}, [
				createVNode(_sfc_main$8, null, {
					default: withCtx(() => [
						createVNode(_sfc_main$4),
						_hoisted_1$42,
						createVNode(_sfc_main$2),
						renderSlot(_ctx.$slots, "zoom-pane")
					]),
					_: 3
				}),
				renderSlot(_ctx.$slots, "default"),
				createVNode(_sfc_main$7)
			], 512);
		};
	}
}));
_objectSpread2(_objectSpread2({}, {
	name: "Panel",
	compatConfig: { MODE: 3 }
}), {}, {
	props: { position: {} },
	setup(__props) {
		const props = __props;
		const { userSelectionActive } = useVueFlow();
		const positionClasses = computed(() => `${props.position}`.split("-"));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: normalizeClass(["vue-flow__panel", positionClasses.value]),
				style: normalizeStyle({ pointerEvents: unref(userSelectionActive) ? "none" : "all" })
			}, [renderSlot(_ctx.$slots, "default")], 6);
		};
	}
});
//#endregion
//#region ~icons/lucide/mouse-pointer-click
var _hoisted_1$41 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$23(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$41, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M14 4.1L12 6M5.1 8l-2.9-.8M6 12l-1.9 2M7.2 2.2L8 5.1m1.037 4.59a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"
	}, null, -1)])]);
}
var mouse_pointer_click_default = markRaw({
	name: "lucide-mouse-pointer-click",
	render: render$23
});
//#endregion
//#region ~icons/lucide/edit-3
var _hoisted_1$40 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$22(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$40, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M13 21h8m.174-14.188a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
	}, null, -1)])]);
}
var edit_3_default = markRaw({
	name: "lucide-edit-3",
	render: render$22
});
//#endregion
//#region ~icons/lucide/keyboard
var _hoisted_1$39 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$21(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$39, [..._cache[0] || (_cache[0] = [createBaseVNode("g", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2"
	}, [createBaseVNode("path", { d: "M10 8h.01M12 12h.01M14 8h.01M16 12h.01M18 8h.01M6 8h.01M7 16h10m-9-4h.01" }), createBaseVNode("rect", {
		width: "20",
		height: "16",
		x: "2",
		y: "4",
		rx: "2"
	})], -1)])]);
}
var keyboard_default = markRaw({
	name: "lucide-keyboard",
	render: render$21
});
//#endregion
//#region ~icons/lucide/compass
var _hoisted_1$38 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$20(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$38, [..._cache[0] || (_cache[0] = [createBaseVNode("g", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2"
	}, [createBaseVNode("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), createBaseVNode("path", { d: "m16.24 7.76l-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" })], -1)])]);
}
var compass_default = markRaw({
	name: "lucide-compass",
	render: render$20
});
//#endregion
//#region ~icons/lucide/globe
var _hoisted_1$37 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$19(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$37, [..._cache[0] || (_cache[0] = [createBaseVNode("g", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2"
	}, [createBaseVNode("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), createBaseVNode("path", { d: "M12 2a14.5 14.5 0 0 0 0 20a14.5 14.5 0 0 0 0-20M2 12h20" })], -1)])]);
}
var globe_default = markRaw({
	name: "lucide-globe",
	render: render$19
});
//#endregion
//#region ~icons/lucide/file-code-2
var _hoisted_1$36 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$18(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$36, [..._cache[0] || (_cache[0] = [createBaseVNode("g", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2"
	}, [createBaseVNode("path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }), createBaseVNode("path", { d: "M14 2v4a2 2 0 0 0 2 2h4M5 12l-3 3l3 3m4 0l3-3l-3-3" })], -1)])]);
}
var file_code_2_default = markRaw({
	name: "lucide-file-code-2",
	render: render$18
});
//#endregion
//#region ~icons/lucide/scan
var _hoisted_1$35 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$17(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$35, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"
	}, null, -1)])]);
}
var scan_default = markRaw({
	name: "lucide-scan",
	render: render$17
});
//#endregion
//#region ~icons/lucide/hourglass
var _hoisted_1$34 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$16(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$34, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M5 22h14M5 2h14m-2 20v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"
	}, null, -1)])]);
}
var hourglass_default = markRaw({
	name: "lucide-hourglass",
	render: render$16
});
//#endregion
//#region ~icons/lucide/check-circle-2
var _hoisted_1$33 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$15(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$33, [..._cache[0] || (_cache[0] = [createBaseVNode("g", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2"
	}, [createBaseVNode("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), createBaseVNode("path", { d: "m9 12l2 2l4-4" })], -1)])]);
}
var check_circle_2_default = markRaw({
	name: "lucide-check-circle-2",
	render: render$15
});
//#endregion
//#region ~icons/lucide/git-branch
var _hoisted_1$32 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$14(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$32, [..._cache[0] || (_cache[0] = [createBaseVNode("g", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2"
	}, [
		createBaseVNode("path", { d: "M15 6a9 9 0 0 0-9 9V3" }),
		createBaseVNode("circle", {
			cx: "18",
			cy: "6",
			r: "3"
		}),
		createBaseVNode("circle", {
			cx: "6",
			cy: "18",
			r: "3"
		})
	], -1)])]);
}
var git_branch_default = markRaw({
	name: "lucide-git-branch",
	render: render$14
});
//#endregion
//#region ~icons/lucide/repeat
var _hoisted_1$31 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$13(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$31, [..._cache[0] || (_cache[0] = [createBaseVNode("g", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2"
	}, [
		createBaseVNode("path", { d: "m17 2l4 4l-4 4" }),
		createBaseVNode("path", { d: "M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4l4-4" }),
		createBaseVNode("path", { d: "M21 13v1a4 4 0 0 1-4 4H3" })
	], -1)])]);
}
var repeat_default = markRaw({
	name: "lucide-repeat",
	render: render$13
});
//#endregion
//#region ~icons/lucide/refresh-ccw
var _hoisted_1$30 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$12(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$30, [..._cache[0] || (_cache[0] = [createBaseVNode("g", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2"
	}, [
		createBaseVNode("path", { d: "M21 12a9 9 0 0 0-9-9a9.75 9.75 0 0 0-6.74 2.74L3 8" }),
		createBaseVNode("path", { d: "M3 3v5h5m-5 4a9 9 0 0 0 9 9a9.75 9.75 0 0 0 6.74-2.74L21 16" }),
		createBaseVNode("path", { d: "M16 16h5v5" })
	], -1)])]);
}
var refresh_ccw_default = markRaw({
	name: "lucide-refresh-ccw",
	render: render$12
});
//#endregion
//#region ~icons/lucide/square
var _hoisted_1$29 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$11(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$29, [..._cache[0] || (_cache[0] = [createBaseVNode("rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		rx: "2"
	}, null, -1)])]);
}
var square_default = markRaw({
	name: "lucide-square",
	render: render$11
});
//#endregion
//#region ~icons/lucide/arrow-left-right
var _hoisted_1$28 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$10(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$28, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M8 3L4 7l4 4M4 7h16m-4 14l4-4l-4-4m4 4H4"
	}, null, -1)])]);
}
var arrow_left_right_default = markRaw({
	name: "lucide-arrow-left-right",
	render: render$10
});
//#endregion
//#region ~icons/lucide/x
var _hoisted_1$27 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$9(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$27, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M18 6L6 18M6 6l12 12"
	}, null, -1)])]);
}
var x_default = markRaw({
	name: "lucide-x",
	render: render$9
});
//#endregion
//#region ~icons/lucide/zap
var _hoisted_1$26 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$8(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$26, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M15.914 4a1.5 1.5 0 0 0-2.474-1.561l-9 9A1.5 1.5 0 0 0 5.5 14h4.002a.5.5 0 0 1 .471.666L8.086 20a1.5 1.5 0 0 0 2.475 1.56l9-9A1.5 1.5 0 0 0 18.5 10h-3.997a.5.5 0 0 1-.472-.667z"
	}, null, -1)])]);
}
var zap_default = markRaw({
	name: "lucide-zap",
	render: render$8
});
//#endregion
//#region ~icons/lucide/camera
var _hoisted_1$25 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$7(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$25, [..._cache[0] || (_cache[0] = [createBaseVNode("g", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2"
	}, [createBaseVNode("path", { d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" }), createBaseVNode("circle", {
		cx: "12",
		cy: "13",
		r: "3"
	})], -1)])]);
}
var camera_default = markRaw({
	name: "lucide-camera",
	render: render$7
});
//#endregion
//#region ~icons/lucide/bell
var _hoisted_1$24 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$6(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$24, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M10.268 21a2 2 0 0 0 3.464 0m-10.47-5.674A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"
	}, null, -1)])]);
}
var bell_default = markRaw({
	name: "lucide-bell",
	render: render$6
});
//#endregion
//#region ~icons/lucide/wrench
var _hoisted_1$23 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$5(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$23, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"
	}, null, -1)])]);
}
var wrench_default = markRaw({
	name: "lucide-wrench",
	render: render$5
});
//#endregion
//#region ~icons/lucide/frame
var _hoisted_1$22 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$4(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$22, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M22 6H2m20 12H2M6 2v20M18 2v20"
	}, null, -1)])]);
}
var frame_default = markRaw({
	name: "lucide-frame",
	render: render$4
});
//#endregion
//#region ~icons/lucide/download
var _hoisted_1$21 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$3(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$21, [..._cache[0] || (_cache[0] = [createBaseVNode("g", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2"
	}, [createBaseVNode("path", { d: "M12 15V3m9 12v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), createBaseVNode("path", { d: "m7 10l5 5l5-5" })], -1)])]);
}
var download_default = markRaw({
	name: "lucide-download",
	render: render$3
});
//#endregion
//#region ~icons/lucide/arrow-up-down
var _hoisted_1$20 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$2(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$20, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "m21 16l-4 4l-4-4m4 4V4M3 8l4-4l4 4M7 4v16"
	}, null, -1)])]);
}
var arrow_up_down_default = markRaw({
	name: "lucide-arrow-up-down",
	render: render$2
});
//#endregion
//#region ~icons/lucide/move-vertical
var _hoisted_1$19 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render$1(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$19, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M12 2v20m-4-4l4 4l4-4M8 6l4-4l4 4"
	}, null, -1)])]);
}
var move_vertical_default = markRaw({
	name: "lucide-move-vertical",
	render: render$1
});
//#endregion
//#region entrypoints/popup/components/builder/components/nodes/node-util.ts
function iconComp(t) {
	switch (t) {
		case "trigger": return zap_default;
		case "click":
		case "dblclick": return mouse_pointer_click_default;
		case "fill": return edit_3_default;
		case "drag": return arrow_up_down_default;
		case "scroll": return move_vertical_default;
		case "key": return keyboard_default;
		case "navigate": return compass_default;
		case "http": return globe_default;
		case "script": return file_code_2_default;
		case "screenshot": return camera_default;
		case "triggerEvent": return bell_default;
		case "setAttribute": return wrench_default;
		case "loopElements": return repeat_default;
		case "switchFrame": return frame_default;
		case "handleDownload": return download_default;
		case "extract": return scan_default;
		case "wait": return hourglass_default;
		case "assert": return check_circle_2_default;
		case "if": return git_branch_default;
		case "foreach": return repeat_default;
		case "while": return refresh_ccw_default;
		case "openTab": return square_default;
		case "switchTab": return arrow_left_right_default;
		case "closeTab": return x_default;
		case "delay": return hourglass_default;
		default: return square_default;
	}
}
function getTypeLabel(type) {
	return {
		trigger: "触发器",
		click: "点击",
		fill: "填充",
		navigate: "导航",
		wait: "等待",
		extract: "提取",
		http: "HTTP",
		script: "脚本",
		if: "条件",
		foreach: "循环",
		assert: "断言",
		key: "键盘",
		drag: "拖拽",
		dblclick: "双击",
		openTab: "打开标签",
		switchTab: "切换标签",
		closeTab: "关闭标签",
		delay: "延迟",
		scroll: "滚动",
		while: "循环"
	}[String(type || "")] || type || "";
}
function nodeSubtitle(node) {
	if (!node) return "";
	const summary = summarizeNode(node);
	if (!summary) return node.type || "";
	return summary.length > 40 ? summary.slice(0, 40) + "..." : summary;
}
//#endregion
//#region ~icons/lucide/shield-x
var _hoisted_1$18 = {
	viewBox: "0 0 24 24",
	width: "1.2em",
	height: "1.2em"
};
function render(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$18, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1zm-5.5-3.5l-5 5m0-5l5 5"
	}, null, -1)])]);
}
var shield_x_default = markRaw({
	name: "lucide-shield-x",
	render
});
//#endregion
//#region entrypoints/popup/components/builder/components/nodes/NodeCard.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$17 = ["title"];
var _hoisted_2$14 = { class: "tooltip" };
var _hoisted_3$12 = { class: "node-container" };
var _hoisted_4$11 = { class: "node-body" };
var _hoisted_5$8 = { class: "node-name" };
var _hoisted_6$6 = { class: "node-subtitle" };
//#endregion
//#region entrypoints/popup/components/builder/components/nodes/NodeCard.vue
var NodeCard_default = /* @__PURE__ */ defineComponent({
	__name: "NodeCard",
	props: {
		id: {},
		data: {},
		selected: { type: Boolean }
	},
	setup(__props) {
		const props = __props;
		const subtitle = computed(() => nodeSubtitle(props.data.node));
		const hasIncoming = computed(() => {
			var _props$data$edges, _props$data$edges$som;
			return ((_props$data$edges = props.data.edges) === null || _props$data$edges === void 0 || (_props$data$edges$som = _props$data$edges.some) === null || _props$data$edges$som === void 0 ? void 0 : _props$data$edges$som.call(_props$data$edges, (e) => e && e.to === props.data.node.id)) || false;
		});
		const hasOutgoing = computed(() => {
			var _props$data$edges2, _props$data$edges2$so;
			return ((_props$data$edges2 = props.data.edges) === null || _props$data$edges2 === void 0 || (_props$data$edges2$so = _props$data$edges2.some) === null || _props$data$edges2$so === void 0 ? void 0 : _props$data$edges2$so.call(_props$data$edges2, (e) => e && e.from === props.data.node.id)) || false;
		});
		const errList = computed(() => props.data.errors || []);
		const hasErrors = computed(() => errList.value.length > 0);
		const errorsTitle = computed(() => errList.value.join("\n"));
		function onSelect() {
			try {
				props.data.onSelect(props.id);
			} catch (_unused) {}
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: normalizeClass([
					"workflow-node",
					__props.selected ? "selected" : "",
					`type-${__props.data.node.type}`
				]),
				onClick: _cache[0] || (_cache[0] = ($event) => onSelect())
			}, [
				hasErrors.value ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: "node-error",
					title: errorsTitle.value
				}, [createVNode(unref(shield_x_default)), createBaseVNode("div", _hoisted_2$14, [(openBlock(true), createElementBlock(Fragment, null, renderList(errList.value, (e) => {
					return openBlock(), createElementBlock("div", {
						class: "item",
						key: e
					}, "• " + toDisplayString(e), 1);
				}), 128))])], 8, _hoisted_1$17)) : createCommentVNode("", true),
				createBaseVNode("div", _hoisted_3$12, [createBaseVNode("div", { class: normalizeClass(["node-icon", `icon-${__props.data.node.type}`]) }, [(openBlock(), createBlock(resolveDynamicComponent(unref(iconComp)(__props.data.node.type))))], 2), createBaseVNode("div", _hoisted_4$11, [createBaseVNode("div", _hoisted_5$8, toDisplayString(__props.data.node.name || unref(getTypeLabel)(__props.data.node.type)), 1), createBaseVNode("div", _hoisted_6$6, toDisplayString(subtitle.value), 1)])]),
				__props.data.node.type !== "trigger" ? (openBlock(), createBlock(unref(_sfc_main$f), {
					key: 1,
					type: "target",
					position: unref(Position).Left,
					class: normalizeClass(["node-handle", hasIncoming.value ? "connected" : "unconnected"])
				}, null, 8, ["position", "class"])) : createCommentVNode("", true),
				__props.data.node.type !== "if" ? (openBlock(), createBlock(unref(_sfc_main$f), {
					key: 2,
					type: "source",
					position: unref(Position).Right,
					class: normalizeClass(["node-handle", hasOutgoing.value ? "connected" : "unconnected"])
				}, null, 8, ["position", "class"])) : createCommentVNode("", true)
			], 2);
		};
	}
});
//#endregion
//#region entrypoints/popup/components/builder/components/nodes/NodeIf.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$16 = ["title"];
var _hoisted_2$13 = { class: "tooltip" };
var _hoisted_3$11 = { class: "node-container" };
var _hoisted_4$10 = { class: "node-body" };
var _hoisted_5$7 = { class: "node-name" };
var _hoisted_6$5 = { class: "node-subtitle" };
var _hoisted_7$5 = { class: "if-cases" };
var _hoisted_8$5 = { class: "case-label" };
var _hoisted_9$5 = {
	key: 0,
	class: "case-row else-row"
};
//#endregion
//#region entrypoints/popup/components/builder/components/nodes/NodeIf.vue
var NodeIf_default = /* @__PURE__ */ defineComponent({
	__name: "NodeIf",
	props: {
		id: {},
		data: {},
		selected: { type: Boolean }
	},
	setup(__props) {
		const props = __props;
		const hasIncoming = computed(() => {
			var _props$data$edges, _props$data$edges$som;
			return ((_props$data$edges = props.data.edges) === null || _props$data$edges === void 0 || (_props$data$edges$som = _props$data$edges.some) === null || _props$data$edges$som === void 0 ? void 0 : _props$data$edges$som.call(_props$data$edges, (e) => e && e.to === props.data.node.id)) || false;
		});
		const branches = computed(() => {
			try {
				var _props$data$node;
				return Array.isArray((_props$data$node = props.data.node) === null || _props$data$node === void 0 || (_props$data$node = _props$data$node.config) === null || _props$data$node === void 0 ? void 0 : _props$data$node.branches) ? props.data.node.config.branches.map((x) => ({
					id: String(x.id || ""),
					name: x.name,
					expr: x.expr
				})) : [];
			} catch (_unused) {
				return [];
			}
		});
		const hasElse = computed(() => {
			try {
				var _props$data$node2;
				return ((_props$data$node2 = props.data.node) === null || _props$data$node2 === void 0 || (_props$data$node2 = _props$data$node2.config) === null || _props$data$node2 === void 0 ? void 0 : _props$data$node2.else) !== false;
			} catch (_unused2) {
				return true;
			}
		});
		const subtitle = computed(() => nodeSubtitle(props.data.node));
		const errList = computed(() => props.data.errors || []);
		const hasErrors = computed(() => errList.value.length > 0);
		const errorsTitle = computed(() => errList.value.join("\n"));
		function hasOutgoingLabel(label) {
			try {
				return (props.data.edges || []).some((e) => e && e.from === props.data.node.id && String(e.label || "") === String(label));
			} catch (_unused3) {
				return false;
			}
		}
		function onSelect() {
			try {
				props.data.onSelect(props.id);
			} catch (_unused4) {}
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: normalizeClass([
					"workflow-node",
					__props.selected ? "selected" : "",
					`type-${__props.data.node.type}`
				]),
				onClick: _cache[0] || (_cache[0] = ($event) => onSelect())
			}, [
				hasErrors.value ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: "node-error",
					title: errorsTitle.value
				}, [createVNode(unref(shield_x_default)), createBaseVNode("div", _hoisted_2$13, [(openBlock(true), createElementBlock(Fragment, null, renderList(errList.value, (e) => {
					return openBlock(), createElementBlock("div", {
						class: "item",
						key: e
					}, "• " + toDisplayString(e), 1);
				}), 128))])], 8, _hoisted_1$16)) : createCommentVNode("", true),
				createBaseVNode("div", _hoisted_3$11, [createBaseVNode("div", { class: normalizeClass(["node-icon", `icon-${__props.data.node.type}`]) }, [(openBlock(), createBlock(resolveDynamicComponent(unref(iconComp)(__props.data.node.type))))], 2), createBaseVNode("div", _hoisted_4$10, [createBaseVNode("div", _hoisted_5$7, toDisplayString(__props.data.node.name || unref(getTypeLabel)(__props.data.node.type)), 1), createBaseVNode("div", _hoisted_6$5, toDisplayString(subtitle.value), 1)])]),
				createBaseVNode("div", _hoisted_7$5, [(openBlock(true), createElementBlock(Fragment, null, renderList(branches.value, (b, idx) => {
					return openBlock(), createElementBlock("div", {
						key: b.id,
						class: "case-row"
					}, [createBaseVNode("div", _hoisted_8$5, toDisplayString(b.name || `条件${idx + 1}`), 1), createVNode(unref(_sfc_main$f), {
						type: "source",
						position: unref(Position).Right,
						id: `case:${b.id}`,
						class: normalizeClass(["node-handle", hasOutgoingLabel(`case:${b.id}`) ? "connected" : "unconnected"])
					}, null, 8, [
						"position",
						"id",
						"class"
					])]);
				}), 128)), hasElse.value ? (openBlock(), createElementBlock("div", _hoisted_9$5, [_cache[1] || (_cache[1] = createBaseVNode("div", { class: "case-label" }, "Else", -1)), createVNode(unref(_sfc_main$f), {
					type: "source",
					position: unref(Position).Right,
					id: "case:else",
					class: normalizeClass(["node-handle", hasOutgoingLabel("case:else") ? "connected" : "unconnected"])
				}, null, 8, ["position", "class"])])) : createCommentVNode("", true)]),
				createVNode(unref(_sfc_main$f), {
					type: "target",
					position: unref(Position).Left,
					class: normalizeClass(["node-handle", hasIncoming.value ? "connected" : "unconnected"])
				}, null, 8, ["position", "class"])
			], 2);
		};
	}
});
//#endregion
//#region entrypoints/background/record-replay/engine/utils/expression.ts
function tokenize(input) {
	const s = input.trim();
	const out = [];
	let i = 0;
	const isAlpha = (c) => /[a-zA-Z_]/.test(c);
	const isNum = (c) => /[0-9]/.test(c);
	const isIdChar = (c) => /[a-zA-Z0-9_]/.test(c);
	while (i < s.length) {
		const c = s[i];
		if (c === " " || c === "	" || c === "\n" || c === "\r") {
			i++;
			continue;
		}
		if (s.startsWith("&&", i) || s.startsWith("||", i) || s.startsWith("==", i) || s.startsWith("!=", i) || s.startsWith(">=", i) || s.startsWith("<=", i)) {
			out.push({
				type: "op",
				value: s.slice(i, i + 2)
			});
			i += 2;
			continue;
		}
		if ("!+-*/()<>".includes(c)) {
			out.push({
				type: "op",
				value: c
			});
			i++;
			continue;
		}
		if (isNum(c) || c === "." && isNum(s[i + 1] || "")) {
			let j = i + 1;
			while (j < s.length && (isNum(s[j]) || s[j] === ".")) j++;
			out.push({
				type: "num",
				value: parseFloat(s.slice(i, j))
			});
			i = j;
			continue;
		}
		if (c === "\"" || c === "'") {
			const quote = c;
			let j = i + 1;
			let str = "";
			while (j < s.length) if (s[j] === "\\" && j + 1 < s.length) {
				str += s[j + 1];
				j += 2;
			} else if (s[j] === quote) {
				j++;
				break;
			} else str += s[j++];
			out.push({
				type: "str",
				value: str
			});
			i = j;
			continue;
		}
		if (isAlpha(c)) {
			let j = i + 1;
			while (j < s.length && isIdChar(s[j])) j++;
			let id = s.slice(i, j);
			while (s[j] === "." && isAlpha(s[j + 1] || "")) {
				let k = j + 1;
				while (k < s.length && isIdChar(s[k])) k++;
				id += s.slice(j, k);
				j = k;
			}
			out.push({
				type: "id",
				value: id
			});
			i = j;
			continue;
		}
		i++;
	}
	return out;
}
function evalExpression(expr, scope) {
	const tokens = tokenize(expr);
	let i = 0;
	const peek = () => tokens[i];
	const consume = () => tokens[i++];
	function parsePrimary() {
		const t = peek();
		if (!t) return void 0;
		if (t.type === "num") {
			consume();
			return t.value;
		}
		if (t.type === "str") {
			consume();
			return t.value;
		}
		if (t.type === "id") {
			consume();
			const id = String(t.value);
			if (id === "true") return true;
			if (id === "false") return false;
			if (!id.startsWith("vars")) return void 0;
			try {
				const parts = id.split(".").slice(1);
				let cur = scope.vars;
				for (const p of parts) {
					if (cur == null) return void 0;
					cur = cur[p];
				}
				return cur;
			} catch (_unused) {
				return;
			}
		}
		if (t.type === "op" && t.value === "(") {
			var _peek, _peek2;
			consume();
			const v = parseOr();
			if (((_peek = peek()) === null || _peek === void 0 ? void 0 : _peek.type) === "op" && ((_peek2 = peek()) === null || _peek2 === void 0 ? void 0 : _peek2.value) === ")") consume();
			return v;
		}
	}
	function parseUnary() {
		const t = peek();
		if (t && t.type === "op" && (t.value === "!" || t.value === "-")) {
			consume();
			const v = parseUnary();
			return t.value === "!" ? !truthy(v) : -Number(v || 0);
		}
		return parsePrimary();
	}
	function parseMulDiv() {
		let v = parseUnary();
		while (peek() && peek().type === "op" && (peek().value === "*" || peek().value === "/")) {
			const op = consume().value;
			const r = parseUnary();
			v = op === "*" ? Number(v || 0) * Number(r || 0) : Number(v || 0) / Number(r || 0);
		}
		return v;
	}
	function parseAddSub() {
		let v = parseMulDiv();
		while (peek() && peek().type === "op" && (peek().value === "+" || peek().value === "-")) {
			const op = consume().value;
			const r = parseMulDiv();
			v = op === "+" ? Number(v || 0) + Number(r || 0) : Number(v || 0) - Number(r || 0);
		}
		return v;
	}
	function parseRel() {
		let v = parseAddSub();
		while (peek() && peek().type === "op" && [
			">",
			">=",
			"<",
			"<="
		].includes(peek().value)) {
			const op = consume().value;
			const r = parseAddSub();
			const a = toComparable(v);
			const b = toComparable(r);
			if (op === ">") v = a > b;
			else if (op === ">=") v = a >= b;
			else if (op === "<") v = a < b;
			else v = a <= b;
		}
		return v;
	}
	function parseEq() {
		let v = parseRel();
		while (peek() && peek().type === "op" && (peek().value === "==" || peek().value === "!=")) {
			const op = consume().value;
			const r = parseRel();
			const a = toComparable(v);
			const b = toComparable(r);
			v = op === "==" ? a === b : a !== b;
		}
		return v;
	}
	function parseAnd() {
		let v = parseEq();
		while (peek() && peek().type === "op" && peek().value === "&&") {
			consume();
			const r = parseEq();
			v = truthy(v) && truthy(r);
		}
		return v;
	}
	function parseOr() {
		let v = parseAnd();
		while (peek() && peek().type === "op" && peek().value === "||") {
			consume();
			const r = parseAnd();
			v = truthy(v) || truthy(r);
		}
		return v;
	}
	function truthy(v) {
		return !!v;
	}
	function toComparable(v) {
		return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? v : String(v);
	}
	try {
		return parseOr();
	} catch (_unused2) {
		return false;
	}
}
//#endregion
//#region entrypoints/popup/components/builder/widgets/FieldExpression.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$15 = { class: "expr" };
var _hoisted_2$12 = ["placeholder", "value"];
var _hoisted_3$10 = {
	key: 0,
	class: "error-item"
};
//#endregion
//#region entrypoints/popup/components/builder/widgets/FieldExpression.vue
var FieldExpression_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "FieldExpression",
	props: {
		modelValue: {},
		field: {}
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		var _props$modelValue, _props$field;
		const props = __props;
		const emit = __emit;
		const text = ref((_props$modelValue = props.modelValue) !== null && _props$modelValue !== void 0 ? _props$modelValue : "");
		const err = ref("");
		const placeholder = ((_props$field = props.field) === null || _props$field === void 0 ? void 0 : _props$field.placeholder) || "e.g. vars.a > 0 && vars.flag";
		function onInput(ev) {
			var _ev$target$value, _ev$target;
			const v = String((_ev$target$value = ev === null || ev === void 0 || (_ev$target = ev.target) === null || _ev$target === void 0 ? void 0 : _ev$target.value) !== null && _ev$target$value !== void 0 ? _ev$target$value : "");
			text.value = v;
			try {
				if (v.trim()) evalExpression(v, { vars: {} });
				err.value = "";
			} catch (e) {
				err.value = "表达式解析错误";
			}
			emit("update:modelValue", v);
		}
		watchEffect(() => {
			var _props$modelValue2;
			text.value = (_props$modelValue2 = props.modelValue) !== null && _props$modelValue2 !== void 0 ? _props$modelValue2 : "";
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$15, [createBaseVNode("input", {
				class: "form-input mono",
				placeholder: unref(placeholder),
				value: text.value,
				onInput
			}, null, 40, _hoisted_2$12), err.value ? (openBlock(), createElementBlock("div", _hoisted_3$10, toDisplayString(err.value), 1)) : createCommentVNode("", true)]);
		};
	}
}), [["__scopeId", "data-v-2185401e"]]);
//#endregion
//#region entrypoints/popup/components/builder/widgets/FieldSelector.vue?vue&type=script&setup=true&lang.ts
init_asyncToGenerator();
var _hoisted_1$14 = { class: "selector" };
var _hoisted_2$11 = { class: "row" };
var _hoisted_3$9 = ["placeholder", "value"];
var _hoisted_4$9 = {
	key: 0,
	class: "error-item"
};
//#endregion
//#region entrypoints/popup/components/builder/widgets/FieldSelector.vue
var FieldSelector_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "FieldSelector",
	props: {
		modelValue: {},
		field: {}
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		var _props$modelValue, _props$field;
		const props = __props;
		const emit = __emit;
		const text = ref((_props$modelValue = props.modelValue) !== null && _props$modelValue !== void 0 ? _props$modelValue : "");
		const placeholder = ((_props$field = props.field) === null || _props$field === void 0 ? void 0 : _props$field.placeholder) || ".btn.primary";
		function onInput(ev) {
			var _ev$target$value, _ev$target;
			const v = String((_ev$target$value = ev === null || ev === void 0 || (_ev$target = ev.target) === null || _ev$target === void 0 ? void 0 : _ev$target.value) !== null && _ev$target$value !== void 0 ? _ev$target$value : "");
			text.value = v;
			emit("update:modelValue", v);
		}
		watchEffect(() => {
			var _props$modelValue2;
			return text.value = (_props$modelValue2 = props.modelValue) !== null && _props$modelValue2 !== void 0 ? _props$modelValue2 : "";
		});
		const err = ref("");
		function ensurePickerInjected(_x) {
			return _ensurePickerInjected.apply(this, arguments);
		}
		function _ensurePickerInjected() {
			_ensurePickerInjected = _asyncToGenerator(function* (tabId) {
				try {
					const pong = yield chrome.tabs.sendMessage(tabId, { action: "chrome_read_page_ping" });
					if (pong && pong.status === "pong") return;
				} catch (_unused) {}
				try {
					yield chrome.scripting.executeScript({
						target: { tabId },
						files: ["inject-scripts/accessibility-tree-helper.js"],
						world: "ISOLATED"
					});
				} catch (e) {
					console.warn("inject picker helper failed:", e);
				}
			});
			return _ensurePickerInjected.apply(this, arguments);
		}
		function onPick() {
			return _onPick.apply(this, arguments);
		}
		function _onPick() {
			_onPick = _asyncToGenerator(function* () {
				try {
					var _tabs$, _candidates$;
					err.value = "";
					const tabs = yield chrome.tabs.query({
						active: true,
						currentWindow: true
					});
					const tabId = tabs === null || tabs === void 0 || (_tabs$ = tabs[0]) === null || _tabs$ === void 0 ? void 0 : _tabs$.id;
					if (!tabId) throw new Error("未找到活动页签");
					yield ensurePickerInjected(tabId);
					const res = yield chrome.tabs.sendMessage(tabId, { action: "rr_picker_start" });
					if (!res || !res.success) {
						if (res === null || res === void 0 ? void 0 : res.cancelled) return;
						throw new Error((res === null || res === void 0 ? void 0 : res.error) || "拾取失败");
					}
					const candidates = Array.isArray(res.candidates) ? res.candidates : [];
					const prefer = [
						"css",
						"attr",
						"aria",
						"text"
					];
					let sel = "";
					for (const t of prefer) {
						const c = candidates.find((x) => x.type === t && x.value);
						if (c) {
							sel = String(c.value);
							break;
						}
					}
					if (!sel && ((_candidates$ = candidates[0]) === null || _candidates$ === void 0 ? void 0 : _candidates$.value)) sel = String(candidates[0].value);
					if (sel) {
						text.value = sel;
						emit("update:modelValue", sel);
					} else err.value = "未生成有效选择器，请手动输入";
				} catch (e) {
					err.value = (e === null || e === void 0 ? void 0 : e.message) || String(e);
				}
			});
			return _onPick.apply(this, arguments);
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$14, [
				createBaseVNode("div", _hoisted_2$11, [createBaseVNode("input", {
					class: "form-input",
					placeholder: unref(placeholder),
					value: text.value,
					onInput
				}, null, 40, _hoisted_3$9), createBaseVNode("button", {
					class: "btn-mini",
					type: "button",
					title: "从页面拾取",
					onClick: onPick
				}, "拾取")]),
				_cache[0] || (_cache[0] = createBaseVNode("div", { class: "help" }, "可输入 CSS 选择器，或点击“拾取”在页面中选择元素", -1)),
				err.value ? (openBlock(), createElementBlock("div", _hoisted_4$9, toDisplayString(err.value), 1)) : createCommentVNode("", true)
			]);
		};
	}
}), [["__scopeId", "data-v-513aaae0"]]);
//#endregion
//#region entrypoints/popup/components/builder/widgets/FieldDuration.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$13 = { class: "duration" };
var _hoisted_2$10 = { class: "row" };
var _hoisted_3$8 = ["value"];
var _hoisted_4$8 = ["value"];
//#endregion
//#region entrypoints/popup/components/builder/widgets/FieldDuration.vue
var FieldDuration_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "FieldDuration",
	props: {
		modelValue: {},
		field: {}
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const unit = ref("ms");
		const val = ref(Number(props.modelValue || 0));
		watchEffect(() => {
			const ms = Number(props.modelValue || 0);
			if (ms % 1e3 === 0 && ms >= 1e3) {
				unit.value = "s";
				val.value = ms / 1e3;
			} else {
				unit.value = "ms";
				val.value = ms;
			}
		});
		function onNum(ev) {
			var _ev$target;
			const n = Number((ev === null || ev === void 0 || (_ev$target = ev.target) === null || _ev$target === void 0 ? void 0 : _ev$target.value) || 0);
			val.value = n;
			emit("update:modelValue", unit.value === "s" ? n * 1e3 : n);
		}
		function onUnit(ev) {
			var _ev$target2;
			unit.value = (ev === null || ev === void 0 || (_ev$target2 = ev.target) === null || _ev$target2 === void 0 ? void 0 : _ev$target2.value) === "s" ? "s" : "ms";
			emit("update:modelValue", unit.value === "s" ? val.value * 1e3 : val.value);
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$13, [createBaseVNode("div", _hoisted_2$10, [createBaseVNode("input", {
				class: "form-input",
				type: "number",
				value: val.value,
				onInput: onNum,
				min: "0"
			}, null, 40, _hoisted_3$8), createBaseVNode("select", {
				class: "form-input unit",
				value: unit.value,
				onChange: onUnit
			}, [..._cache[0] || (_cache[0] = [createBaseVNode("option", { value: "ms" }, "ms", -1), createBaseVNode("option", { value: "s" }, "s", -1)])], 40, _hoisted_4$8)])]);
		};
	}
}), [["__scopeId", "data-v-c5d2b15f"]]);
//#endregion
//#region entrypoints/popup/components/builder/widgets/FieldCode.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$12 = { class: "code" };
var _hoisted_2$9 = ["placeholder", "value"];
//#endregion
//#region entrypoints/popup/components/builder/widgets/FieldCode.vue
var FieldCode_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "FieldCode",
	props: {
		modelValue: {},
		field: {}
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		var _props$modelValue, _props$field;
		const props = __props;
		const emit = __emit;
		const text = ref((_props$modelValue = props.modelValue) !== null && _props$modelValue !== void 0 ? _props$modelValue : "");
		const placeholder = ((_props$field = props.field) === null || _props$field === void 0 ? void 0 : _props$field.placeholder) || "/* code */";
		function onInput(ev) {
			var _ev$target$value, _ev$target;
			const v = String((_ev$target$value = ev === null || ev === void 0 || (_ev$target = ev.target) === null || _ev$target === void 0 ? void 0 : _ev$target.value) !== null && _ev$target$value !== void 0 ? _ev$target$value : "");
			text.value = v;
			emit("update:modelValue", v);
		}
		watchEffect(() => {
			var _props$modelValue2;
			return text.value = (_props$modelValue2 = props.modelValue) !== null && _props$modelValue2 !== void 0 ? _props$modelValue2 : "";
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$12, [createBaseVNode("textarea", {
				class: "form-input mono",
				rows: "6",
				placeholder: unref(placeholder),
				value: text.value,
				onInput
			}, null, 40, _hoisted_2$9)]);
		};
	}
}), [["__scopeId", "data-v-33ece96b"]]);
//#endregion
//#region entrypoints/popup/components/builder/widgets/FieldKeySequence.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$11 = { class: "keys" };
var _hoisted_2$8 = ["placeholder", "value"];
//#endregion
//#region entrypoints/popup/components/builder/widgets/FieldKeySequence.vue
var FieldKeySequence_default = /* @__PURE__ */ defineComponent({
	__name: "FieldKeySequence",
	props: {
		modelValue: {},
		field: {}
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		var _props$modelValue, _props$field;
		const props = __props;
		const emit = __emit;
		const text = ref((_props$modelValue = props.modelValue) !== null && _props$modelValue !== void 0 ? _props$modelValue : "");
		const placeholder = ((_props$field = props.field) === null || _props$field === void 0 ? void 0 : _props$field.placeholder) || "Backspace Enter 或 cmd+a";
		function onInput(ev) {
			var _ev$target$value, _ev$target;
			const v = String((_ev$target$value = ev === null || ev === void 0 || (_ev$target = ev.target) === null || _ev$target === void 0 ? void 0 : _ev$target.value) !== null && _ev$target$value !== void 0 ? _ev$target$value : "");
			text.value = v;
			emit("update:modelValue", v);
		}
		watchEffect(() => {
			var _props$modelValue2;
			return text.value = (_props$modelValue2 = props.modelValue) !== null && _props$modelValue2 !== void 0 ? _props$modelValue2 : "";
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$11, [createBaseVNode("input", {
				class: "form-input",
				placeholder: unref(placeholder),
				value: text.value,
				onInput
			}, null, 40, _hoisted_2$8), _cache[0] || (_cache[0] = createBaseVNode("div", { class: "help" }, "示例：Backspace Enter 或 cmd+a", -1))]);
		};
	}
});
//#endregion
//#region entrypoints/popup/components/builder/widgets/FieldTargetLocator.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$10 = { class: "target-locator" };
//#endregion
//#region entrypoints/popup/components/builder/widgets/FieldTargetLocator.vue
var FieldTargetLocator_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "FieldTargetLocator",
	props: {
		modelValue: {},
		field: {}
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		var _props$field;
		const props = __props;
		const emit = __emit;
		const placeholder = ((_props$field = props.field) === null || _props$field === void 0 ? void 0 : _props$field.placeholder) || ".btn.primary";
		const text = ref("");
		const updatingFromProps = ref(false);
		watch(() => props.modelValue, (mv) => {
			updatingFromProps.value = true;
			if (!mv) {
				text.value = "";
				nextTick(() => updatingFromProps.value = false);
				return;
			}
			if (typeof mv === "string") {
				text.value = mv;
				nextTick(() => updatingFromProps.value = false);
				return;
			}
			try {
				var _arr$;
				const arr = Array.isArray(mv.candidates) ? mv.candidates : [];
				const prefer = [
					"css",
					"attr",
					"aria",
					"text",
					"xpath"
				];
				let val = "";
				for (const t of prefer) {
					const c = arr.find((x) => x && x.type === t && x.value);
					if (c) {
						val = String(c.value || "");
						break;
					}
				}
				if (!val) val = ((_arr$ = arr[0]) === null || _arr$ === void 0 ? void 0 : _arr$.value) ? String(arr[0].value) : "";
				text.value = val;
			} catch (_unused) {
				text.value = "";
			}
			nextTick(() => updatingFromProps.value = false);
		}, {
			immediate: true,
			deep: true
		});
		watch(() => text.value, (v) => {
			if (updatingFromProps.value) return;
			const s = String(v || "").trim();
			if (!s) emit("update:modelValue", { candidates: [] });
			else emit("update:modelValue", _objectSpread2(_objectSpread2({}, typeof props.modelValue === "object" && props.modelValue ? props.modelValue : {}), {}, { candidates: [{
				type: "css",
				value: s
			}] }));
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$10, [createVNode(FieldSelector_default, {
				modelValue: text.value,
				"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => text.value = $event),
				field: { placeholder: unref(placeholder) }
			}, null, 8, ["modelValue", "field"])]);
		};
	}
}), [["__scopeId", "data-v-8f56dc22"]]);
//#endregion
//#region entrypoints/popup/components/builder/model/form-widget-registry.ts
var REG = /* @__PURE__ */ new Map();
function registerDefaultWidgets() {
	REG.set("expression", FieldExpression_default);
	REG.set("selector", FieldSelector_default);
	REG.set("duration", FieldDuration_default);
	REG.set("code", FieldCode_default);
	REG.set("keysequence", FieldKeySequence_default);
	REG.set("targetlocator", FieldTargetLocator_default);
}
function getWidget(name) {
	if (!name) return null;
	return REG.get(name) || null;
}
//#endregion
//#region entrypoints/popup/components/builder/widgets/VarInput.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$9 = { class: "var-input-wrap" };
var _hoisted_2$7 = ["placeholder", "value"];
var _hoisted_3$7 = ["onClick", "title"];
var _hoisted_4$7 = { class: "var-key" };
var _hoisted_5$6 = ["data-origin"];
//#endregion
//#region entrypoints/popup/components/builder/widgets/VarInput.vue
var VarInput_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "VarInput",
	props: {
		modelValue: { default: "" },
		variables: { default: () => [] },
		placeholder: {},
		format: { default: "mustache" }
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const inputEl = ref(null);
		const open = ref(false);
		const hover = ref(false);
		const activeIdx = ref(0);
		const query = computed(() => {
			var _el$selectionStart;
			const val = String(props.modelValue || "");
			const el = inputEl.value;
			const pos = (_el$selectionStart = el === null || el === void 0 ? void 0 : el.selectionStart) !== null && _el$selectionStart !== void 0 ? _el$selectionStart : val.length;
			const before = val.slice(0, pos);
			const lastOpen = before.lastIndexOf("{");
			const lastClose = before.lastIndexOf("}");
			if (lastOpen >= 0 && lastClose < lastOpen) return before.slice(lastOpen + 1).trim();
			if (val.includes("{}")) return "";
			return "";
		});
		const filtered = computed(() => {
			const all = props.variables || [];
			const q = query.value.toLowerCase();
			if (!q) return all;
			return all.filter((v) => v.key.toLowerCase().startsWith(q));
		});
		function showSuggestIfNeeded(next) {
			try {
				var _el$selectionStart2;
				const el = inputEl.value;
				const pos = (_el$selectionStart2 = el === null || el === void 0 ? void 0 : el.selectionStart) !== null && _el$selectionStart2 !== void 0 ? _el$selectionStart2 : next.length;
				const shouldOpen = next.slice(0, pos).endsWith("{") || next.includes("{}");
				open.value = shouldOpen;
				if (shouldOpen) activeIdx.value = 0;
			} catch (_unused) {
				open.value = false;
			}
		}
		function onInput(e) {
			var _target$value;
			const target = e.target;
			const v = (_target$value = target === null || target === void 0 ? void 0 : target.value) !== null && _target$value !== void 0 ? _target$value : "";
			emit("update:modelValue", v);
			showSuggestIfNeeded(v);
		}
		function onKeydown(e) {
			if (e.key === "{") setTimeout(() => showSuggestIfNeeded(String(props.modelValue || "")), 0);
			if ((e.ctrlKey || e.metaKey) && e.key === " ") {
				e.preventDefault();
				open.value = (props.variables || []).length > 0;
				activeIdx.value = 0;
				return;
			}
			if (!open.value) return;
			if (e.key === "Escape") {
				open.value = false;
				return;
			}
			if (e.key === "ArrowDown") {
				e.preventDefault();
				activeIdx.value = (activeIdx.value + 1) % Math.max(1, filtered.value.length);
				return;
			}
			if (e.key === "ArrowUp") {
				e.preventDefault();
				activeIdx.value = (activeIdx.value - 1 + Math.max(1, filtered.value.length)) % Math.max(1, filtered.value.length);
				return;
			}
			if (e.key === "Enter" || e.key === "Tab") {
				if (!filtered.value.length) return;
				e.preventDefault();
				insertVar(filtered.value[Math.max(0, Math.min(activeIdx.value, filtered.value.length - 1))].key);
			}
		}
		function onBlur() {
			setTimeout(() => !hover.value ? open.value = false : null, 50);
		}
		function onFocus() {
			showSuggestIfNeeded(String(props.modelValue || ""));
		}
		function insertVar(key) {
			var _el$selectionStart3, _el$selectionEnd;
			const el = inputEl.value;
			const val = String(props.modelValue || "");
			const token = props.format === "workflowDot" ? `workflow.${key}` : `{${key}}`;
			if (!el) {
				emit("update:modelValue", `${val}${token}`);
				open.value = false;
				return;
			}
			const start = (_el$selectionStart3 = el.selectionStart) !== null && _el$selectionStart3 !== void 0 ? _el$selectionStart3 : val.length;
			const end = (_el$selectionEnd = el.selectionEnd) !== null && _el$selectionEnd !== void 0 ? _el$selectionEnd : start;
			const before = val.slice(0, start);
			const after = val.slice(end);
			const lastOpen = before.lastIndexOf("{");
			const lastClose = before.lastIndexOf("}");
			let next;
			if (val.includes("{}")) {
				const idx = val.indexOf("{}");
				next = val.slice(0, idx) + token + val.slice(idx + 2);
			} else if (lastOpen >= 0 && lastClose < lastOpen) next = val.slice(0, lastOpen) + token + after;
			else next = before + token + after;
			emit("update:modelValue", next);
			requestAnimationFrame(() => {
				try {
					var _inputEl$value;
					const pos = props.format === "workflowDot" ? before.length + token.length : next.indexOf("}", lastOpen >= 0 ? lastOpen : start) + 1 || next.length;
					(_inputEl$value = inputEl.value) === null || _inputEl$value === void 0 || _inputEl$value.setSelectionRange(pos, pos);
				} catch (_unused2) {}
			});
			open.value = false;
		}
		onMounted(() => {});
		watch(() => props.modelValue, (v) => {
			if (document.activeElement === inputEl.value) showSuggestIfNeeded(String(v || ""));
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$9, [createBaseVNode("input", {
				ref_key: "inputEl",
				ref: inputEl,
				class: "form-input",
				placeholder: __props.placeholder,
				value: __props.modelValue,
				onInput,
				onKeydown,
				onBlur,
				onFocus
			}, null, 40, _hoisted_2$7), open.value && filtered.value.length ? (openBlock(), createElementBlock("div", {
				key: 0,
				class: "var-suggest",
				onMouseenter: _cache[1] || (_cache[1] = ($event) => hover.value = true),
				onMouseleave: _cache[2] || (_cache[2] = ($event) => {
					hover.value = false;
					open.value = false;
				})
			}, [(openBlock(true), createElementBlock(Fragment, null, renderList(filtered.value, (v, i) => {
				return openBlock(), createElementBlock("div", {
					key: v.key + ":" + (v.nodeId || ""),
					class: normalizeClass(["var-item", { active: i === activeIdx.value }]),
					onMousedown: _cache[0] || (_cache[0] = withModifiers(() => {}, ["prevent"])),
					onClick: ($event) => insertVar(v.key),
					title: v.origin === "node" ? `${v.key} · from ${v.nodeName || v.nodeId}` : `${v.key} · global`
				}, [createBaseVNode("span", _hoisted_4$7, toDisplayString(v.key), 1), createBaseVNode("span", {
					class: "var-origin",
					"data-origin": v.origin
				}, toDisplayString(v.origin === "node" ? v.nodeName || v.nodeId || "node" : "global"), 9, _hoisted_5$6)], 42, _hoisted_3$7);
			}), 128))], 32)) : createCommentVNode("", true)]);
		};
	}
}), [["__scopeId", "data-v-395b11d0"]]);
//#endregion
//#region entrypoints/popup/components/builder/components/properties/PropertyFormRenderer.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$8 = { class: "form-section" };
var _hoisted_2$6 = ["data-field"];
var _hoisted_3$6 = { class: "form-label" };
var _hoisted_4$6 = {
	key: 0,
	class: "help"
};
var _hoisted_5$5 = {
	key: 0,
	class: "error-box"
};
//#endregion
//#region entrypoints/popup/components/builder/components/properties/PropertyFormRenderer.vue
var PropertyFormRenderer_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "PropertyFormRenderer",
	props: {
		node: {},
		variables: {}
	},
	setup(__props) {
		const props = __props;
		const spec = computed(() => {
			var _props$node;
			return getNodeSpec((_props$node = props.node) === null || _props$node === void 0 ? void 0 : _props$node.type);
		});
		const schema = computed(() => {
			var _spec$value;
			return ((_spec$value = spec.value) === null || _spec$value === void 0 ? void 0 : _spec$value.schema) || [];
		});
		const model = reactive({});
		function applyDefaults() {
			var _spec$value2;
			if (!props.node) return;
			if (!props.node.config) props.node.config = {};
			const defaults = ((_spec$value2 = spec.value) === null || _spec$value2 === void 0 ? void 0 : _spec$value2.defaults) || {};
			for (const [k, v] of Object.entries(defaults)) if (props.node.config[k] === void 0) props.node.config[k] = v;
			Object.assign(model, props.node.config);
		}
		onMounted(applyDefaults);
		registerDefaultWidgets();
		watch(() => {
			var _props$node2;
			return (_props$node2 = props.node) === null || _props$node2 === void 0 ? void 0 : _props$node2.id;
		}, () => applyDefaults());
		watch(model, () => {
			if (!props.node) return;
			props.node.config = _objectSpread2(_objectSpread2({}, props.node.config || {}), model);
		}, { deep: true });
		const errors = computed(() => {
			var _props$node3;
			const cfg = ((_props$node3 = props.node) === null || _props$node3 === void 0 ? void 0 : _props$node3.config) || {};
			const out = [];
			for (const f of schema.value) if (f.required && (cfg[f.key] === void 0 || cfg[f.key] === "")) out.push(`${f.label} 必填`);
			try {
				var _spec$value3, _spec$value3$validate;
				const more = ((_spec$value3 = spec.value) === null || _spec$value3 === void 0 || (_spec$value3$validate = _spec$value3.validate) === null || _spec$value3$validate === void 0 ? void 0 : _spec$value3$validate.call(_spec$value3, cfg)) || [];
				out.push(...more);
			} catch (_unused) {}
			return out;
		});
		function resolveField(field) {
			const w = getWidget(field.widget);
			if (w) return w;
			switch (field.type) {
				case "string": return StringField;
				case "number": return NumberField;
				case "boolean": return BoolField;
				case "select": return SelectField;
				case "object": return ObjectField;
				case "array": return ArrayField;
				case "json": return JsonField;
				default: return StringField;
			}
		}
		const StringField = defineComponent({
			name: "StringField",
			props: [
				"field",
				"modelValue",
				"variables"
			],
			emits: ["update:modelValue"],
			setup(p, { emit }) {
				return () => {
					var _p$modelValue, _p$field;
					return h(VarInput_default, {
						modelValue: (_p$modelValue = p.modelValue) !== null && _p$modelValue !== void 0 ? _p$modelValue : "",
						variables: p.variables || [],
						placeholder: (_p$field = p.field) === null || _p$field === void 0 ? void 0 : _p$field.placeholder,
						"onUpdate:modelValue": (v) => emit("update:modelValue", v)
					});
				};
			}
		});
		const NumberField = defineComponent({
			name: "NumberField",
			props: ["field", "modelValue"],
			emits: ["update:modelValue"],
			setup(props, { emit }) {
				return () => {
					var _props$field, _props$field2, _props$field3, _props$modelValue;
					return h("input", {
						class: "form-input",
						type: "number",
						min: (_props$field = props.field) === null || _props$field === void 0 ? void 0 : _props$field.min,
						max: (_props$field2 = props.field) === null || _props$field2 === void 0 ? void 0 : _props$field2.max,
						step: ((_props$field3 = props.field) === null || _props$field3 === void 0 ? void 0 : _props$field3.step) || 1,
						value: (_props$modelValue = props.modelValue) !== null && _props$modelValue !== void 0 ? _props$modelValue : "",
						onInput: (e) => {
							var _e$target;
							return emit("update:modelValue", e === null || e === void 0 || (_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.valueAsNumber);
						}
					});
				};
			}
		});
		const BoolField = defineComponent({
			name: "BoolField",
			props: ["field", "modelValue"],
			emits: ["update:modelValue"],
			setup(props, { emit }) {
				return () => {
					var _props$field$label, _props$field4;
					return h("label", { class: "checkbox-label" }, [h("input", {
						type: "checkbox",
						checked: !!props.modelValue,
						onChange: (e) => {
							var _e$target2;
							return emit("update:modelValue", !!(e === null || e === void 0 || (_e$target2 = e.target) === null || _e$target2 === void 0 ? void 0 : _e$target2.checked));
						}
					}), h("span", null, (_props$field$label = (_props$field4 = props.field) === null || _props$field4 === void 0 ? void 0 : _props$field4.label) !== null && _props$field$label !== void 0 ? _props$field$label : "")]);
				};
			}
		});
		const SelectField = defineComponent({
			name: "SelectField",
			props: ["field", "modelValue"],
			emits: ["update:modelValue"],
			setup(props, { emit }) {
				return () => {
					var _props$field5;
					return h("select", {
						class: "form-input",
						value: props.modelValue,
						onChange: (e) => {
							var _e$target3;
							return emit("update:modelValue", e === null || e === void 0 || (_e$target3 = e.target) === null || _e$target3 === void 0 ? void 0 : _e$target3.value);
						}
					}, (((_props$field5 = props.field) === null || _props$field5 === void 0 ? void 0 : _props$field5.options) || []).map((op) => h("option", {
						value: op.value,
						key: String(op.value)
					}, op.label)));
				};
			}
		});
		const JsonField = defineComponent({
			name: "JsonField",
			props: ["field", "modelValue"],
			emits: ["update:modelValue"],
			setup(props, { emit }) {
				const text = ref("");
				const err = ref("");
				onMounted(() => {
					try {
						text.value = props.modelValue != null ? JSON.stringify(props.modelValue, null, 2) : "";
					} catch (_unused2) {
						text.value = "";
					}
				});
				watch(text, () => {
					try {
						const v = text.value ? JSON.parse(text.value) : void 0;
						err.value = "";
						emit("update:modelValue", v);
					} catch (e) {
						err.value = "JSON 格式错误";
					}
				});
				return () => h("div", null, [h("textarea", {
					class: "form-input",
					rows: 6,
					placeholder: "输入 JSON",
					value: text.value,
					onInput: (e) => {
						var _e$target$value, _e$target4;
						return text.value = String((_e$target$value = e === null || e === void 0 || (_e$target4 = e.target) === null || _e$target4 === void 0 ? void 0 : _e$target4.value) !== null && _e$target$value !== void 0 ? _e$target$value : "");
					}
				}), err.value ? h("div", { class: "error-item" }, err.value) : null]);
			}
		});
		const ObjectField = defineComponent({
			name: "ObjectField",
			props: ["field", "modelValue"],
			emits: ["update:modelValue"],
			setup(props, { emit }) {
				const local = ref(_objectSpread2({}, props.modelValue || {}));
				const compOf = (f) => {
					const w = getWidget(f.widget);
					if (w) return w;
					if (f.type === "string") return StringField;
					if (f.type === "number") return NumberField;
					if (f.type === "boolean") return BoolField;
					if (f.type === "select") return SelectField;
					if (f.type === "json") return JsonField;
					if (f.type === "object") return ObjectField;
					if (f.type === "array") return ArrayField;
					return StringField;
				};
				watch(() => local.value, () => emit("update:modelValue", local.value), { deep: true });
				return () => {
					var _props$field6;
					return h("div", { class: "nested" }, (((_props$field6 = props.field) === null || _props$field6 === void 0 ? void 0 : _props$field6.fields) || []).map((f) => h("div", {
						class: "form-group",
						"data-field": f.key,
						key: f.key
					}, [h("label", { class: "form-label" }, f.label), h(compOf(f), {
						field: f,
						modelValue: local.value[f.key],
						"onUpdate:modelValue": (v) => local.value = _objectSpread2(_objectSpread2({}, local.value), {}, { [f.key]: v }),
						variables: props.variables || []
					})])));
				};
			}
		});
		const ArrayField = defineComponent({
			name: "ArrayField",
			props: ["field", "modelValue"],
			emits: ["update:modelValue"],
			setup(props, { emit }) {
				const items = ref(Array.isArray(props.modelValue) ? [...props.modelValue] : []);
				const update = () => emit("update:modelValue", items.value);
				const add = () => {
					var _it$options$0$value, _it$options;
					const it = props.field.item;
					let v = null;
					if (it.type === "string") v = "";
					else if (it.type === "number") v = 0;
					else if (it.type === "boolean") v = false;
					else if (it.type === "select") v = (_it$options$0$value = (_it$options = it.options) === null || _it$options === void 0 || (_it$options = _it$options[0]) === null || _it$options === void 0 ? void 0 : _it$options.value) !== null && _it$options$0$value !== void 0 ? _it$options$0$value : "";
					else if (it.type === "object") v = {};
					else if (it.type === "json") v = {};
					else if (it.type === "array") v = [];
					items.value.push(v);
					update();
				};
				const remove = (i) => {
					items.value.splice(i, 1);
					update();
				};
				const compOf = (f) => {
					const w = getWidget(f.widget);
					if (w) return w;
					if (f.type === "string") return StringField;
					if (f.type === "number") return NumberField;
					if (f.type === "boolean") return BoolField;
					if (f.type === "select") return SelectField;
					if (f.type === "json") return JsonField;
					if (f.type === "object") return ObjectField;
					if (f.type === "array") return ArrayField;
					return StringField;
				};
				return () => h("div", { class: "array" }, [...items.value.map((_, i) => h("div", {
					class: "array-item",
					key: i
				}, [h(compOf(props.field.item), {
					field: props.field.item,
					modelValue: items.value[i],
					"onUpdate:modelValue": (v) => {
						items.value[i] = v;
						update();
					},
					variables: props.variables || []
				}), h("button", {
					class: "btn-mini",
					type: "button",
					onClick: () => remove(i)
				}, "删除")])), h("button", {
					class: "btn",
					type: "button",
					onClick: add
				}, "新增")]);
			}
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$8, [
				_cache[1] || (_cache[1] = createBaseVNode("div", { class: "section-title" }, "配置", -1)),
				(openBlock(true), createElementBlock(Fragment, null, renderList(schema.value, (field) => {
					return openBlock(), createElementBlock("div", {
						key: field.key,
						class: "form-group",
						"data-field": field.key
					}, [
						createBaseVNode("label", _hoisted_3$6, toDisplayString(field.label), 1),
						(openBlock(), createBlock(resolveDynamicComponent(resolveField(field)), {
							field,
							modelValue: model[field.key],
							"onUpdate:modelValue": ($event) => model[field.key] = $event,
							variables: __props.variables
						}, null, 8, [
							"field",
							"modelValue",
							"onUpdate:modelValue",
							"variables"
						])),
						field.help ? (openBlock(), createElementBlock("div", _hoisted_4$6, toDisplayString(field.help), 1)) : createCommentVNode("", true)
					], 8, _hoisted_2$6);
				}), 128)),
				errors.value.length ? (openBlock(), createElementBlock("div", _hoisted_5$5, [_cache[0] || (_cache[0] = createBaseVNode("div", { class: "error-title" }, "⚠️ 配置错误", -1)), (openBlock(true), createElementBlock(Fragment, null, renderList(errors.value, (e) => {
					return openBlock(), createElementBlock("div", {
						key: e,
						class: "error-item"
					}, toDisplayString(e), 1);
				}), 128))])) : createCommentVNode("", true)
			]);
		};
	}
}), [["__scopeId", "data-v-627f4475"]]);
//#endregion
//#region entrypoints/popup/components/builder/components/properties/PropertyFromSpec.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$7 = {
	key: 1,
	class: "form-section"
};
//#endregion
//#region entrypoints/popup/components/builder/components/properties/PropertyFromSpec.vue
var PropertyFromSpec_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "PropertyFromSpec",
	props: {
		node: {},
		variables: {}
	},
	setup(__props) {
		const props = __props;
		const hasSpec = computed(() => {
			var _props$node;
			return !!getNodeSpec((_props$node = props.node) === null || _props$node === void 0 ? void 0 : _props$node.type);
		});
		return (_ctx, _cache) => {
			return __props.node && hasSpec.value ? (openBlock(), createBlock(PropertyFormRenderer_default, {
				key: 0,
				node: __props.node,
				variables: __props.variables
			}, null, 8, ["node", "variables"])) : (openBlock(), createElementBlock("div", _hoisted_1$7, [..._cache[0] || (_cache[0] = [createBaseVNode("div", { class: "section-title" }, "未找到节点规范", -1), createBaseVNode("div", { class: "help" }, "该节点尚未提供 NodeSpec，已回退到默认属性面板。", -1)])]));
		};
	}
}), [["__scopeId", "data-v-3b99708c"]]);
//#endregion
//#region entrypoints/popup/components/builder/model/ui-nodes.ts
registerBuiltinSpecs();
var baseCard = NodeCard_default;
function specToUi(spec) {
	var _spec$ports, _spec$display, _spec$display2, _spec$display3, _spec$ports$inputs, _spec$ports2;
	const canvas = spec.type === STEP_TYPES.IF ? NodeIf_default : baseCard;
	const outputs = Array.isArray((_spec$ports = spec.ports) === null || _spec$ports === void 0 ? void 0 : _spec$ports.outputs) ? spec.ports.outputs.length : "any";
	return {
		type: spec.type,
		label: ((_spec$display = spec.display) === null || _spec$display === void 0 ? void 0 : _spec$display.label) || String(spec.type),
		category: ((_spec$display2 = spec.display) === null || _spec$display2 === void 0 ? void 0 : _spec$display2.category) || "Actions",
		iconClass: ((_spec$display3 = spec.display) === null || _spec$display3 === void 0 ? void 0 : _spec$display3.iconClass) || "icon-default",
		canvas: markRaw(canvas),
		property: markRaw(PropertyFromSpec_default),
		io: {
			inputs: (_spec$ports$inputs = (_spec$ports2 = spec.ports) === null || _spec$ports2 === void 0 ? void 0 : _spec$ports2.inputs) !== null && _spec$ports$inputs !== void 0 ? _spec$ports$inputs : 1,
			outputs
		},
		defaultConfig: () => _objectSpread2({}, spec.defaults || {}),
		validate: (node) => {
			try {
				var _getNodeSpec, _getNodeSpec$validate;
				const cfg = (node === null || node === void 0 ? void 0 : node.config) || {};
				return ((_getNodeSpec = getNodeSpec(node.type)) === null || _getNodeSpec === void 0 || (_getNodeSpec$validate = _getNodeSpec.validate) === null || _getNodeSpec$validate === void 0 ? void 0 : _getNodeSpec$validate.call(_getNodeSpec, cfg)) || [];
			} catch (_unused) {
				return [];
			}
		}
	};
}
var NODE_UI_LIST = listNodeSpecs().map(specToUi);
var NODE_UI_REGISTRY = Object.fromEntries(NODE_UI_LIST.map((n) => [n.type, n]));
function canvasTypeKey(t) {
	return `rr-${t}`;
}
function defaultConfigOf(t) {
	const spec = getNodeSpec(t);
	if (spec === null || spec === void 0 ? void 0 : spec.defaults) return _objectSpread2({}, spec.defaults);
	const item = NODE_UI_REGISTRY[t];
	if (item === null || item === void 0 ? void 0 : item.defaultConfig) return item.defaultConfig();
	return defaultConfigFor(t);
}
function validateNodeWithRegistry(n) {
	try {
		const spec = getNodeSpec(n.type);
		if (spec === null || spec === void 0 ? void 0 : spec.validate) return spec.validate(n.config || {}) || [];
	} catch (_unused2) {}
	const item = NODE_UI_REGISTRY[n.type];
	if (item === null || item === void 0 ? void 0 : item.validate) try {
		return item.validate(n) || [];
	} catch (_unused3) {}
	return validateNode(n);
}
function getIoConstraint(t) {
	var _io$inputs, _io$outputs;
	const item = NODE_UI_REGISTRY[t];
	const io = (item === null || item === void 0 ? void 0 : item.io) || {};
	let inputs = (_io$inputs = io.inputs) !== null && _io$inputs !== void 0 ? _io$inputs : 1;
	let outputs = (_io$outputs = io.outputs) !== null && _io$outputs !== void 0 ? _io$outputs : "any";
	if (t === "trigger") inputs = 0;
	if (t === "if") outputs = "any";
	return {
		inputs,
		outputs
	};
}
//#endregion
//#region entrypoints/popup/components/builder/model/toast.ts
function toast(message, level = "warn") {
	try {
		const ev = new CustomEvent("rr_toast", { detail: {
			message: String(message),
			level
		} });
		window.dispatchEvent(ev);
	} catch (_unused) {
		console[level === "error" ? "error" : level === "warn" ? "warn" : "log"]("[toast]", message);
	}
}
//#endregion
//#region entrypoints/popup/components/builder/store/useBuilderStore.ts
init_asyncToGenerator();
function useBuilderStore(initial) {
	const flowLocal = reactive({
		id: "",
		name: "",
		version: 1,
		steps: [],
		variables: []
	});
	const nodes = reactive([]);
	const edges = reactive([]);
	const activeNodeId = ref(null);
	const activeEdgeId = ref(null);
	const pendingFrom = ref(null);
	const pendingLabel = ref("default");
	const paletteTypes = [
		"trigger",
		"click",
		"drag",
		"scroll",
		"fill",
		"if",
		"foreach",
		"while",
		"key",
		"wait",
		"assert",
		"navigate",
		"script",
		"delay",
		"http",
		"extract",
		"screenshot",
		"triggerEvent",
		"setAttribute",
		"loopElements",
		"switchFrame",
		"handleDownload",
		"executeFlow",
		"openTab",
		"switchTab",
		"closeTab"
	];
	const HISTORY_MAX = 50;
	const past = [];
	const future = [];
	function takeSnapshot() {
		return {
			flow: {
				name: flowLocal.name,
				description: flowLocal.description
			},
			nodes: JSON.parse(JSON.stringify(nodes)),
			edges: JSON.parse(JSON.stringify(edges))
		};
	}
	function applySnapshot(s) {
		flowLocal.name = s.flow.name || "";
		flowLocal.description = s.flow.description || "";
		nodes.splice(0, nodes.length, ...JSON.parse(JSON.stringify(s.nodes)));
		edges.splice(0, edges.length, ...JSON.parse(JSON.stringify(s.edges)));
	}
	function recordChange() {
		past.push(takeSnapshot());
		future.length = 0;
		if (past.length > HISTORY_MAX) past.splice(0, past.length - HISTORY_MAX);
	}
	function undo() {
		if (past.length === 0) return;
		const current = takeSnapshot();
		const prev = past.pop();
		future.push(current);
		applySnapshot(prev);
	}
	function redo() {
		if (future.length === 0) return;
		const current = takeSnapshot();
		const next = future.pop();
		past.push(current);
		applySnapshot(next);
	}
	function layoutIfNeeded() {
		const startX = 120, startY = 80, gapY = 120;
		nodes.forEach((n, i) => {
			if (!n.ui || isNaN(n.ui.x) || isNaN(n.ui.y)) n.ui = {
				x: startX,
				y: startY + i * gapY
			};
		});
	}
	function initFromFlow(flow) {
		var _nodes$;
		const deep = cloneFlow(flow);
		Object.assign(flowLocal, deep);
		nodes.splice(0, nodes.length, ...Array.isArray(deep.nodes) ? deep.nodes : []);
		edges.splice(0, edges.length, ...Array.isArray(deep.edges) && deep.edges.length ? deep.edges : autoChainEdges(nodes));
		layoutIfNeeded();
		activeNodeId.value = ((_nodes$ = nodes[0]) === null || _nodes$ === void 0 ? void 0 : _nodes$.id) || null;
		activeEdgeId.value = null;
		past.length = 0;
		future.length = 0;
		past.push(takeSnapshot());
	}
	function selectNode(id) {
		if (id && pendingFrom.value && pendingFrom.value !== id) {
			onConnect(pendingFrom.value, id, pendingLabel.value);
			pendingFrom.value = null;
		}
		activeNodeId.value = id || null;
		if (id) activeEdgeId.value = null;
	}
	function selectEdge(id) {
		activeEdgeId.value = id || null;
		if (id) activeNodeId.value = null;
	}
	function addNode(t) {
		const id = newId$1(t);
		const n = {
			id,
			type: t,
			name: "",
			config: defaultConfigOf(t),
			ui: {
				x: 200 + nodes.length * 24,
				y: 120 + nodes.length * 96
			}
		};
		nodes.push(n);
		if (nodes.length > 1) {
			const prev = nodes[nodes.length - 2];
			edges.push({
				id: newId$1("e"),
				from: prev.id,
				to: id,
				label: "default"
			});
		}
		activeNodeId.value = id;
		recordChange();
	}
	function addNodeAt(t, x, y) {
		const id = newId$1(t);
		const n = {
			id,
			type: t,
			name: "",
			config: defaultConfigOf(t),
			ui: {
				x: Math.round(x),
				y: Math.round(y)
			}
		};
		nodes.push(n);
		activeNodeId.value = id;
		recordChange();
	}
	function duplicateNode(id) {
		const src = nodes.find((n) => n.id === id);
		if (!src) return;
		const cp = JSON.parse(JSON.stringify(src));
		cp.id = newId$1(src.type);
		cp.name = src.name ? `${src.name} Copy` : "";
		const baseX = cp.ui && typeof cp.ui.x === "number" ? cp.ui.x : 200;
		const baseY = cp.ui && typeof cp.ui.y === "number" ? cp.ui.y : 120;
		cp.ui = {
			x: baseX + 40,
			y: baseY + 40
		};
		nodes.push(cp);
		activeNodeId.value = cp.id;
		recordChange();
	}
	function removeNode(id) {
		const idx = nodes.findIndex((n) => n.id === id);
		if (idx < 0) return;
		nodes.splice(idx, 1);
		for (let i = edges.length - 1; i >= 0; i--) {
			const e = edges[i];
			if (e.from === id || e.to === id) edges.splice(i, 1);
		}
		activeNodeId.value = null;
		activeEdgeId.value = null;
		recordChange();
	}
	function removeEdge(id) {
		const idx = edges.findIndex((e) => e.id === id);
		if (idx < 0) return;
		edges.splice(idx, 1);
		if (activeEdgeId.value === id) activeEdgeId.value = null;
		recordChange();
	}
	function setNodePosition(id, x, y) {
		const n = nodes.find((n) => n.id === id);
		if (!n) return;
		n.ui = {
			x: Math.round(x),
			y: Math.round(y)
		};
	}
	function connectFrom(id, label = "default") {
		pendingFrom.value = id;
		pendingLabel.value = label;
	}
	function onConnect(sourceId, targetId, label = "default") {
		if (sourceId === targetId) {
			toast("不能连接到自身", "warn");
			return;
		}
		try {
			const src = nodes.find((n) => n.id === sourceId);
			const dst = nodes.find((n) => n.id === targetId);
			if (!src || !dst) return;
			const srcIo = getIoConstraint(src.type);
			const dstIo = getIoConstraint(dst.type);
			const incoming = edges.filter((e) => e.to === targetId).length;
			if (dstIo.inputs !== "any" && incoming >= dstIo.inputs) {
				toast(`该节点最多允许 ${dstIo.inputs} 条入边`, "warn");
				return;
			}
			if (srcIo.outputs !== "any") {
				if (edges.filter((e) => e.from === sourceId).length >= srcIo.outputs) {
					toast(`该节点最多允许 ${srcIo.outputs} 条出边`, "warn");
					return;
				}
			}
		} catch (_unused) {}
		for (let i = edges.length - 1; i >= 0; i--) {
			const e = edges[i];
			const lab = e.label || "default";
			if (e.from === sourceId && lab === label) edges.splice(i, 1);
		}
		if (edges.some((e) => e.from === sourceId && e.to === targetId && (e.label || "default") === label)) return;
		edges.push({
			id: newId$1("e"),
			from: sourceId,
			to: targetId,
			label
		});
		recordChange();
		try {
			const last = edges[edges.length - 1];
			activeEdgeId.value = (last === null || last === void 0 ? void 0 : last.id) || null;
			activeNodeId.value = null;
		} catch (_unused2) {}
	}
	/**
	* Derive available variables for the property panel.
	* - Includes declared flow variables (global)
	* - Includes variables produced by preceding nodes (saveAs/assign/itemVar etc.)
	* If currentId is provided, only nodes before it in topological order are considered.
	*/
	function listAvailableVariables(currentId) {
		const result = [];
		const seen = /* @__PURE__ */ new Set();
		const declared = flowLocal.variables || [];
		for (const v of declared) {
			const k = String((v === null || v === void 0 ? void 0 : v.key) || "").trim();
			if (!k || seen.has(k)) continue;
			seen.add(k);
			result.push({
				key: k,
				origin: "global"
			});
		}
		const ordered = topoOrder(nodes, edges);
		let cutoffIndex = typeof currentId === "string" ? ordered.findIndex((n) => n.id === currentId) : -1;
		if (cutoffIndex < 0) cutoffIndex = ordered.length;
		const prevNodes = ordered.slice(0, cutoffIndex);
		for (const n of prevNodes) {
			const cfg = n.config || {};
			const nodeName = String(n.name || n.id || "node");
			const pushVar = (k) => {
				const key = String(k || "").trim();
				if (!key || seen.has(key)) return;
				seen.add(key);
				result.push({
					key,
					origin: "node",
					nodeId: n.id,
					nodeName
				});
			};
			if (typeof cfg.saveAs === "string") pushVar(cfg.saveAs);
			if (cfg.assign && typeof cfg.assign === "object") for (const k of Object.keys(cfg.assign)) pushVar(k);
			if (n.type === "loopElements") {
				if (typeof cfg.saveAs === "string") pushVar(cfg.saveAs);
				if (typeof cfg.itemVar === "string") pushVar(cfg.itemVar);
			}
		}
		return result;
	}
	function importFromSteps() {
		const arr = stepsToNodes(flowLocal.steps || []);
		nodes.splice(0, nodes.length, ...arr);
		edges.splice(0, edges.length, ...autoChainEdges(arr));
		layoutIfNeeded();
		recordChange();
	}
	const currentSubflowId = ref(null);
	function ensureSubflows() {
		if (!flowLocal.subflows) flowLocal.subflows = {};
	}
	function listSubflowIds() {
		ensureSubflows();
		return Object.keys(flowLocal.subflows || {});
	}
	function addSubflow(id) {
		ensureSubflows();
		const sf = flowLocal.subflows;
		if (!id || sf[id]) return;
		sf[id] = {
			nodes: [],
			edges: []
		};
		recordChange();
	}
	function removeSubflow(id) {
		ensureSubflows();
		const sf = flowLocal.subflows;
		if (!sf[id]) return;
		delete sf[id];
		if (currentSubflowId.value === id) switchToMain();
		recordChange();
	}
	function flushCurrent() {
		if (!currentSubflowId.value) {
			flowLocal.nodes = JSON.parse(JSON.stringify(nodes));
			flowLocal.edges = JSON.parse(JSON.stringify(edges));
			return;
		}
		ensureSubflows();
		flowLocal.subflows[currentSubflowId.value] = {
			nodes: JSON.parse(JSON.stringify(nodes)),
			edges: JSON.parse(JSON.stringify(edges))
		};
	}
	function switchToMain() {
		flushCurrent();
		currentSubflowId.value = null;
		nodes.splice(0, nodes.length, ...JSON.parse(JSON.stringify(flowLocal.nodes || [])));
		edges.splice(0, edges.length, ...JSON.parse(JSON.stringify(flowLocal.edges || [])));
		layoutIfNeeded();
	}
	function switchToSubflow(id) {
		flushCurrent();
		currentSubflowId.value = id;
		ensureSubflows();
		const sf = flowLocal.subflows[id] || {
			nodes: [],
			edges: []
		};
		nodes.splice(0, nodes.length, ...JSON.parse(JSON.stringify(sf.nodes || [])));
		edges.splice(0, edges.length, ...JSON.parse(JSON.stringify(sf.edges || [])));
		layoutIfNeeded();
	}
	const isEditingMain = () => currentSubflowId.value == null;
	/**
	* Export flow for saving. This properly handles subflow editing:
	* 1. Flushes current canvas state back to flowLocal
	* 2. Returns a deep copy to avoid reference issues
	*
	* IMPORTANT: Always use this method for saving instead of directly
	* accessing store.nodes/edges, which may contain subflow data.
	*
	* NOTE: flow.steps is no longer written here. The storage layer (flow-store.ts)
	* will strip steps on save. Only nodes/edges are the source of truth.
	*/
	function exportFlowForSave() {
		flushCurrent();
		return JSON.parse(JSON.stringify(flowLocal));
	}
	function summarize(id) {
		return summarizeNode(nodes.find((x) => x.id === id) || null);
	}
	function layoutFallback() {
		const idMap = /* @__PURE__ */ new Map();
		nodes.forEach((n) => idMap.set(n.id, n));
		const inEdges = /* @__PURE__ */ new Map();
		const outEdges = /* @__PURE__ */ new Map();
		for (const n of nodes) {
			inEdges.set(n.id, []);
			outEdges.set(n.id, []);
		}
		for (const e of edges) {
			if (!idMap.has(e.from) || !idMap.has(e.to)) continue;
			inEdges.get(e.to).push(e);
			outEdges.get(e.from).push(e);
		}
		const indeg = /* @__PURE__ */ new Map();
		nodes.forEach((n) => indeg.set(n.id, inEdges.get(n.id).length));
		const q = [];
		nodes.filter((n) => (indeg.get(n.id) || 0) === 0).sort((a, b) => (a.type === "trigger" ? -1 : 0) - (b.type === "trigger" ? -1 : 0)).forEach((r) => q.push(r.id));
		const topo = [];
		const indegMut = new Map(indeg);
		while (q.length) {
			const v = q.shift();
			topo.push(v);
			for (const e of outEdges.get(v) || []) {
				const d = (indegMut.get(e.to) || 0) - 1;
				indegMut.set(e.to, d);
				if (d === 0) q.push(e.to);
			}
		}
		if (topo.length < nodes.length) {
			for (const n of nodes) if (!topo.includes(n.id)) topo.push(n.id);
		}
		const level = /* @__PURE__ */ new Map();
		for (const id of topo) {
			const parents = inEdges.get(id) || [];
			let lv = 0;
			for (const e of parents) lv = Math.max(lv, (level.get(e.from) || 0) + 1);
			if (idMap.get(id).type === "trigger") lv = 0;
			level.set(id, lv);
		}
		const maxLevel = Math.max(0, ...Array.from(level.values()));
		const layers = Array.from({ length: maxLevel + 1 }, () => []);
		for (const id of topo) layers[level.get(id) || 0].push(id);
		const yIndex = /* @__PURE__ */ new Map();
		layers[0].forEach((id, i) => yIndex.set(id, i));
		for (let lv = 1; lv < layers.length; lv++) {
			const scored = layers[lv].map((id) => {
				const parentIdx = (inEdges.get(id) || []).map((e) => yIndex.get(e.from)).filter((v) => typeof v === "number");
				return {
					id,
					score: parentIdx.length ? parentIdx.reduce((a, b) => a + b, 0) / parentIdx.length : 1e9
				};
			});
			scored.sort((a, b) => a.score - b.score);
			scored.forEach((s, i) => yIndex.set(s.id, i));
			layers[lv] = scored.map((s) => s.id);
		}
		const startX = 120;
		const startY = 80;
		const stepX = 280;
		const stepY = 110;
		for (let lv = 0; lv < layers.length; lv++) {
			const arr = layers[lv];
			for (let i = 0; i < arr.length; i++) {
				const id = arr[i];
				const n = idMap.get(id);
				n.ui = {
					x: startX + lv * stepX,
					y: startY + i * stepY
				};
			}
		}
		recordChange();
	}
	function layoutAuto() {
		return _layoutAuto.apply(this, arguments);
	}
	function _layoutAuto() {
		_layoutAuto = _asyncToGenerator(function* () {
			try {
				const mod = yield __vitePreload(() => import("./elk.bundled-DsXaxXj4.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1)), __vite__mapDeps([0,1]));
				const elk = new (mod.default || mod.ELK || mod)();
				const estimateSize = (n) => {
					const baseW = 280;
					let baseH = 72;
					if (n.type === "if") baseH = 110;
					return {
						width: baseW,
						height: baseH
					};
				};
				const graph = {
					id: "root",
					layoutOptions: {
						"elk.algorithm": "layered",
						"elk.direction": "RIGHT",
						"elk.layered.spacing.nodeNodeBetweenLayers": "80",
						"elk.spacing.nodeNode": "40",
						"elk.layered.crossingMinimization.strategy": "LAYER_SWEEP"
					},
					children: nodes.map((n) => _objectSpread2({ id: n.id }, estimateSize(n))),
					edges: edges.filter((e) => nodes.some((n) => n.id === e.from) && nodes.some((n) => n.id === e.to)).map((e) => ({
						id: e.id,
						sources: [e.from],
						targets: [e.to]
					}))
				};
				const res = yield elk.layout(graph);
				const pos = /* @__PURE__ */ new Map();
				for (const c of res.children || []) pos.set(String(c.id), {
					x: Math.round(c.x || 0),
					y: Math.round(c.y || 0)
				});
				const startX = 120;
				const startY = 80;
				for (const n of nodes) {
					const p = pos.get(n.id);
					if (p) n.ui = {
						x: startX + p.x,
						y: startY + p.y
					};
				}
				recordChange();
			} catch (e) {
				try {
					layoutFallback();
					toast("ELK 自动布局不可用，已使用备用布局", "warn");
				} catch (_unused3) {}
			}
		});
		return _layoutAuto.apply(this, arguments);
	}
	if (initial) initFromFlow(initial);
	return {
		flowLocal,
		nodes,
		edges,
		activeNodeId,
		activeEdgeId,
		pendingFrom,
		pendingLabel,
		currentSubflowId,
		paletteTypes,
		undo,
		redo,
		initFromFlow,
		selectNode,
		selectEdge,
		addNode,
		duplicateNode,
		removeNode,
		removeEdge,
		setNodePosition,
		addNodeAt,
		connectFrom,
		onConnect,
		listAvailableVariables,
		listSubflowIds,
		addSubflow,
		removeSubflow,
		switchToMain,
		switchToSubflow,
		isEditingMain,
		importFromSteps,
		exportFlowForSave,
		summarize,
		layoutAuto
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@vue-flow+background@1.3.2__313d27bbd66c477046d904a18f86a675/node_modules/@vue-flow/background/dist/vue-flow-background.mjs
var BackgroundVariant = /* @__PURE__ */ ((BackgroundVariant2) => {
	BackgroundVariant2["Lines"] = "lines";
	BackgroundVariant2["Dots"] = "dots";
	return BackgroundVariant2;
})(BackgroundVariant || {});
var LinePattern = function({ dimensions, size, color }) {
	return h("path", {
		"stroke": color,
		"stroke-width": size,
		"d": `M${dimensions[0] / 2} 0 V${dimensions[1]} M0 ${dimensions[1] / 2} H${dimensions[0]}`
	});
};
var DotPattern = function({ radius, color }) {
	return h("circle", {
		cx: radius,
		cy: radius,
		r: radius,
		fill: color
	});
};
BackgroundVariant.Lines, BackgroundVariant.Dots;
var DefaultBgColors = {
	[BackgroundVariant.Dots]: "#81818a",
	[BackgroundVariant.Lines]: "#eee"
};
var _hoisted_1$6 = [
	"id",
	"x",
	"y",
	"width",
	"height",
	"patternTransform"
];
var _hoisted_2$5 = {
	key: 2,
	height: "100",
	width: "100"
};
var _hoisted_3$5 = ["fill"];
var _hoisted_4$5 = [
	"x",
	"y",
	"fill"
];
var _sfc_main = /* @__PURE__ */ defineComponent(_objectSpread2(_objectSpread2({}, {
	name: "Background",
	compatConfig: { MODE: 3 }
}), {}, {
	props: {
		id: {},
		variant: { default: () => BackgroundVariant.Dots },
		gap: { default: 20 },
		size: { default: 1 },
		lineWidth: { default: 1 },
		patternColor: {},
		color: {},
		bgColor: {},
		height: { default: 100 },
		width: { default: 100 },
		x: { default: 0 },
		y: { default: 0 },
		offset: { default: 0 }
	},
	setup(__props) {
		const { id: vueFlowId, viewport } = useVueFlow();
		const background = computed(() => {
			const zoom = viewport.value.zoom;
			const [gapX, gapY] = Array.isArray(__props.gap) ? __props.gap : [__props.gap, __props.gap];
			const scaledGap = [gapX * zoom || 1, gapY * zoom || 1];
			const scaledSize = __props.size * zoom;
			const [offsetX, offsetY] = Array.isArray(__props.offset) ? __props.offset : [__props.offset, __props.offset];
			return {
				scaledGap,
				offset: [offsetX * zoom || 1 + scaledGap[0] / 2, offsetY * zoom || 1 + scaledGap[1] / 2],
				size: scaledSize
			};
		});
		const patternId = toRef(() => `pattern-${vueFlowId}${__props.id ? `-${__props.id}` : ""}`);
		const patternColor = toRef(() => __props.color || __props.patternColor || DefaultBgColors[__props.variant || BackgroundVariant.Dots]);
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("svg", {
				class: "vue-flow__background vue-flow__container",
				style: normalizeStyle({
					height: `${_ctx.height > 100 ? 100 : _ctx.height}%`,
					width: `${_ctx.width > 100 ? 100 : _ctx.width}%`
				})
			}, [
				renderSlot(_ctx.$slots, "pattern-container", { id: patternId.value }, () => [createBaseVNode("pattern", {
					id: patternId.value,
					x: unref(viewport).x % background.value.scaledGap[0],
					y: unref(viewport).y % background.value.scaledGap[1],
					width: background.value.scaledGap[0],
					height: background.value.scaledGap[1],
					patternTransform: `translate(-${background.value.offset[0]},-${background.value.offset[1]})`,
					patternUnits: "userSpaceOnUse"
				}, [renderSlot(_ctx.$slots, "pattern", {}, () => [_ctx.variant === unref(BackgroundVariant).Lines ? (openBlock(), createBlock(unref(LinePattern), {
					key: 0,
					size: _ctx.lineWidth,
					color: patternColor.value,
					dimensions: background.value.scaledGap
				}, null, 8, [
					"size",
					"color",
					"dimensions"
				])) : _ctx.variant === unref(BackgroundVariant).Dots ? (openBlock(), createBlock(unref(DotPattern), {
					key: 1,
					color: patternColor.value,
					radius: background.value.size / 2
				}, null, 8, ["color", "radius"])) : createCommentVNode("", true), _ctx.bgColor ? (openBlock(), createElementBlock("svg", _hoisted_2$5, [createBaseVNode("rect", {
					width: "100%",
					height: "100%",
					fill: _ctx.bgColor
				}, null, 8, _hoisted_3$5)])) : createCommentVNode("", true)])], 8, _hoisted_1$6)]),
				createBaseVNode("rect", {
					x: _ctx.x,
					y: _ctx.y,
					width: "100%",
					height: "100%",
					fill: `url(#${patternId.value})`
				}, null, 8, _hoisted_4$5),
				renderSlot(_ctx.$slots, "default", { id: patternId.value })
			], 4);
		};
	}
}));
//#endregion
//#region entrypoints/popup/components/builder/components/Canvas.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$5 = { class: "canvas rr-dot-grid" };
var Canvas_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent(_objectSpread2(_objectSpread2({}, { name: "BuilderCanvas" }), {}, {
	__name: "Canvas",
	props: {
		nodes: {},
		edges: {},
		nodeErrors: {},
		focusNodeId: {},
		fitSeq: {}
	},
	emits: [
		"selectNode",
		"selectEdge",
		"duplicateNode",
		"removeNode",
		"connectFrom",
		"connect",
		"nodeDragged",
		"addNodeAt"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const vfNodes = ref([]);
		const vfEdges = ref([]);
		const api = useVueFlow();
		const { fitView, getNodes, project } = api;
		const nodeTypes = (() => {
			const base = {};
			for (const n of NODE_UI_LIST) {
				const key = canvasTypeKey(n.type);
				const comp = n.canvas || (n.type === "if" ? NodeIf_default : NodeCard_default);
				base[key] = markRaw(comp);
			}
			return base;
		})();
		watchEffect(() => {
			const list = props.nodes || [];
			const edgesRef = props.edges || [];
			vfNodes.value = list.map((n) => {
				var _n$ui, _n$ui2;
				return {
					id: n.id,
					position: {
						x: ((_n$ui = n.ui) === null || _n$ui === void 0 ? void 0 : _n$ui.x) || 0,
						y: ((_n$ui2 = n.ui) === null || _n$ui2 === void 0 ? void 0 : _n$ui2.y) || 0
					},
					type: canvasTypeKey(n.type),
					data: {
						node: n,
						edges: edgesRef,
						onSelect: (id) => emit("selectNode", id),
						errors: (props.nodeErrors || {})[n.id] || []
					},
					class: "rr-node-plain"
				};
			});
		});
		watchEffect(() => {
			const list = props.edges || [];
			const textFor = (lab) => {
				const l = lab || "default";
				if (l === EDGE_LABELS.TRUE) return "✓";
				if (l === EDGE_LABELS.FALSE) return "✗";
				if (l === EDGE_LABELS.ON_ERROR) return "!";
				return "";
			};
			const labelFor = (e) => {
				const raw = String((e === null || e === void 0 ? void 0 : e.label) || "");
				if (raw.startsWith("case:")) return "";
				if (raw === "else") return "";
				return textFor(raw);
			};
			vfEdges.value = list.map((e) => ({
				id: e.id,
				source: e.from,
				target: e.to,
				sourceHandle: typeof e.label === "string" && e.label.startsWith("case:") ? String(e.label) : void 0,
				label: labelFor(e),
				labelShowBg: true,
				labelBgPadding: [4, 6],
				labelBgStyle: {
					fill: "#e5e5e5",
					fillOpacity: .95,
					stroke: "#ffffff",
					strokeWidth: 1
				},
				labelStyle: {
					fill: "#666666",
					fontWeight: 600,
					fontSize: 11
				},
				style: {
					stroke: "#cdcdcd",
					strokeWidth: 1.5
				},
				animated: false,
				type: "bezier"
			}));
		});
		watch(() => props.focusNodeId, (id) => {
			if (!id) return;
			const nd = getNodes.value.find((n) => n.id === id);
			if (!nd) return;
			try {
				fitView({
					nodes: [nd.id],
					duration: 300,
					padding: .2
				});
			} catch (_unused) {}
		});
		watch(() => props.fitSeq, () => {
			try {
				fitView({
					duration: 300,
					padding: .2
				});
			} catch (_unused2) {}
		});
		function onNodeDragStopInternal(evt) {
			const node = evt === null || evt === void 0 ? void 0 : evt.node;
			if (!node) return;
			emit("nodeDragged", node.id, Math.round(node.position.x), Math.round(node.position.y));
		}
		function onConnectInternal(conn) {
			if (!conn.source || !conn.target) return;
			const lab = conn.sourceHandle || "default";
			emit("connect", conn.source, conn.target, String(lab));
		}
		function onDragOver(e) {
			try {
				if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
			} catch (_unused4) {}
		}
		function onDrop(e) {
			try {
				e.preventDefault();
			} catch (_unused5) {}
			const dt = e.dataTransfer;
			const type = ((dt === null || dt === void 0 ? void 0 : dt.getData("application/node-type")) || (dt === null || dt === void 0 ? void 0 : dt.getData("text/node-type")) || (dt === null || dt === void 0 ? void 0 : dt.getData("text/plain")) || "").trim();
			if (!type) return;
			try {
				const pos = project({
					x: e.clientX,
					y: e.clientY
				});
				emit("addNodeAt", type, Math.round(pos.x || 0), Math.round(pos.y || 0));
			} catch (_unused6) {
				emit("addNodeAt", type, 200, 120);
			}
		}
		function onPaneClick() {
			emit("selectNode", null);
			emit("selectEdge", null);
		}
		function onEdgeClick(evt) {
			try {
				var _evt$edge;
				const id = (evt === null || evt === void 0 || (_evt$edge = evt.edge) === null || _evt$edge === void 0 ? void 0 : _evt$edge.id) || null;
				emit("selectEdge", id ? String(id) : null);
			} catch (_unused7) {
				emit("selectEdge", null);
			}
		}
		function zoomIn() {
			try {
				var _api$zoomIn;
				(_api$zoomIn = api.zoomIn) === null || _api$zoomIn === void 0 || _api$zoomIn.call(api);
			} catch (_unused8) {}
		}
		function zoomOut() {
			try {
				var _api$zoomOut;
				(_api$zoomOut = api.zoomOut) === null || _api$zoomOut === void 0 || _api$zoomOut.call(api);
			} catch (_unused9) {}
		}
		function fitAll() {
			try {
				fitView({
					duration: 300,
					padding: .2
				});
			} catch (_unused10) {}
		}
		__expose({
			zoomIn,
			zoomOut,
			fitAll
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("section", _hoisted_1$5, [createVNode(unref(_sfc_main$1), {
				nodes: vfNodes.value,
				"onUpdate:nodes": _cache[0] || (_cache[0] = ($event) => vfNodes.value = $event),
				edges: vfEdges.value,
				"onUpdate:edges": _cache[1] || (_cache[1] = ($event) => vfEdges.value = $event),
				"min-zoom": .2,
				"max-zoom": 1.5,
				"fit-view-on-init": true,
				"node-types": unref(nodeTypes),
				"snap-to-grid": "",
				"snap-grid": [24, 24],
				onConnect: onConnectInternal,
				onNodeDragStop: onNodeDragStopInternal,
				onDragover: withModifiers(onDragOver, ["prevent"]),
				onDrop,
				onPaneClick,
				onEdgeClick
			}, {
				default: withCtx(() => [createVNode(unref(_sfc_main), {
					patternColor: "#cdcdcd",
					gap: 32,
					"pattern-class": "canvas-pattern"
				})]),
				_: 1
			}, 8, [
				"nodes",
				"edges",
				"node-types"
			])]);
		};
	}
}));
//#endregion
//#region entrypoints/popup/components/builder/components/Canvas.vue
var Canvas_default = /*#__PURE__*/ _plugin_vue_export_helper_default(Canvas_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-ff6b921a"]]);
//#endregion
//#region entrypoints/popup/components/builder/components/Sidebar.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$4 = { class: "sidebar" };
var _hoisted_2$4 = { class: "search-box" };
var _hoisted_3$4 = { class: "nodes-section" };
var _hoisted_4$4 = [
	"onDragstart",
	"onClick",
	"title"
];
var _hoisted_5$4 = { class: "btn-label" };
var _hoisted_6$4 = { class: "nodes-section" };
var _hoisted_7$4 = [
	"onDragstart",
	"onClick",
	"title"
];
var _hoisted_8$4 = { class: "btn-label" };
var _hoisted_9$4 = { class: "nodes-section" };
var _hoisted_10$4 = [
	"onDragstart",
	"onClick",
	"title"
];
var _hoisted_11$4 = { class: "btn-label" };
var _hoisted_12$4 = { class: "nodes-section" };
var _hoisted_13$3 = [
	"onDragstart",
	"onClick",
	"title"
];
var _hoisted_14$2 = { class: "btn-label" };
var _hoisted_15$2 = { class: "nodes-section" };
var _hoisted_16$2 = [
	"onDragstart",
	"onClick",
	"title"
];
var _hoisted_17$2 = { class: "btn-label" };
var Sidebar_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent(_objectSpread2(_objectSpread2({}, { name: "BuilderSidebar" }), {}, {
	__name: "Sidebar",
	props: {
		flow: {},
		paletteTypes: {},
		subflowIds: {},
		currentSubflowId: {}
	},
	emits: [
		"addNode",
		"switchMain",
		"switchSubflow",
		"addSubflow",
		"removeSubflow"
	],
	setup(__props) {
		const props = __props;
		function onDragStart(t, e) {
			try {
				const dt = e.dataTransfer;
				if (!dt) return;
				dt.setData("application/node-type", String(t));
				dt.setData("text/node-type", String(t));
				dt.setData("text/plain", String(t));
				dt.effectAllowed = "copy";
			} catch (_unused) {}
		}
		const q = ref("");
		const filtered = computed(() => {
			const allow = new Set(props.paletteTypes || []);
			const items = NODE_UI_LIST.filter((n) => allow.size === 0 || allow.has(n.type));
			const term = q.value.trim().toLowerCase();
			const list = term ? items.filter((n) => n.label.toLowerCase().includes(term) || n.type.toLowerCase().includes(term)) : items;
			return {
				Flow: list.filter((x) => x.category === "Flow"),
				Actions: list.filter((x) => x.category === "Actions"),
				Tools: list.filter((x) => x.category === "Tools"),
				Tabs: list.filter((x) => x.category === "Tabs"),
				Logic: list.filter((x) => x.category === "Logic"),
				Page: list.filter((x) => x.category === "Page")
			};
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("aside", _hoisted_1$4, [
				createBaseVNode("div", _hoisted_2$4, [_cache[1] || (_cache[1] = createBaseVNode("svg", {
					class: "search-icon",
					width: "16",
					height: "16",
					viewBox: "0 0 16 16",
					fill: "none"
				}, [createBaseVNode("circle", {
					cx: "7",
					cy: "7",
					r: "4",
					stroke: "currentColor",
					"stroke-width": "1.5"
				}), createBaseVNode("path", {
					d: "m10 10 3 3",
					stroke: "currentColor",
					"stroke-width": "1.5",
					"stroke-linecap": "round"
				})], -1)), withDirectives(createBaseVNode("input", {
					class: "search-input",
					placeholder: "Insert node...",
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => q.value = $event)
				}, null, 512), [[vModelText, q.value]])]),
				filtered.value.Flow.length > 0 ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [_cache[2] || (_cache[2] = createBaseVNode("div", { class: "section-divider" }, [createBaseVNode("span", { class: "divider-label" }, "Flow")], -1)), createBaseVNode("div", _hoisted_3$4, [(openBlock(true), createElementBlock(Fragment, null, renderList(filtered.value.Flow, (n) => {
					return openBlock(), createElementBlock("button", {
						key: n.type,
						class: "node-btn",
						draggable: "true",
						onDragstart: ($event) => onDragStart(n.type, $event),
						onClick: ($event) => _ctx.$emit("addNode", n.type),
						title: n.label
					}, [createBaseVNode("div", { class: normalizeClass(["btn-icon", n.iconClass]) }, [(openBlock(), createBlock(resolveDynamicComponent(unref(iconComp)(n.type))))], 2), createBaseVNode("span", _hoisted_5$4, toDisplayString(n.label), 1)], 40, _hoisted_4$4);
				}), 128))])], 64)) : createCommentVNode("", true),
				createBaseVNode("div", _hoisted_6$4, [(openBlock(true), createElementBlock(Fragment, null, renderList(filtered.value.Actions, (n) => {
					return openBlock(), createElementBlock("button", {
						key: n.type,
						class: "node-btn",
						draggable: "true",
						onDragstart: ($event) => onDragStart(n.type, $event),
						onClick: ($event) => _ctx.$emit("addNode", n.type),
						title: n.label
					}, [createBaseVNode("div", { class: normalizeClass(["btn-icon", n.iconClass]) }, [(openBlock(), createBlock(resolveDynamicComponent(unref(iconComp)(n.type))))], 2), createBaseVNode("span", _hoisted_8$4, toDisplayString(n.label), 1)], 40, _hoisted_7$4);
				}), 128))]),
				_cache[3] || (_cache[3] = createBaseVNode("div", { class: "section-divider" }, [createBaseVNode("span", { class: "divider-label" }, "Tools")], -1)),
				createBaseVNode("div", _hoisted_9$4, [(openBlock(true), createElementBlock(Fragment, null, renderList(filtered.value.Tools, (n) => {
					return openBlock(), createElementBlock("button", {
						key: n.type,
						class: "node-btn",
						draggable: "true",
						onDragstart: ($event) => onDragStart(n.type, $event),
						onClick: ($event) => _ctx.$emit("addNode", n.type),
						title: n.label
					}, [createBaseVNode("div", { class: normalizeClass(["btn-icon", n.iconClass]) }, [(openBlock(), createBlock(resolveDynamicComponent(unref(iconComp)(n.type))))], 2), createBaseVNode("span", _hoisted_11$4, toDisplayString(n.label), 1)], 40, _hoisted_10$4);
				}), 128))]),
				_cache[4] || (_cache[4] = createBaseVNode("div", { class: "section-divider" }, [createBaseVNode("span", { class: "divider-label" }, "Tabs")], -1)),
				createBaseVNode("div", _hoisted_12$4, [(openBlock(true), createElementBlock(Fragment, null, renderList(filtered.value.Tabs, (n) => {
					return openBlock(), createElementBlock("button", {
						key: n.type,
						class: "node-btn",
						draggable: "true",
						onDragstart: ($event) => onDragStart(n.type, $event),
						onClick: ($event) => _ctx.$emit("addNode", n.type),
						title: n.label
					}, [createBaseVNode("div", { class: normalizeClass(["btn-icon", n.iconClass]) }, [(openBlock(), createBlock(resolveDynamicComponent(unref(iconComp)(n.type))))], 2), createBaseVNode("span", _hoisted_14$2, toDisplayString(n.label), 1)], 40, _hoisted_13$3);
				}), 128))]),
				_cache[5] || (_cache[5] = createBaseVNode("div", { class: "section-divider" }, [createBaseVNode("span", { class: "divider-label" }, "Logic")], -1)),
				createBaseVNode("div", _hoisted_15$2, [(openBlock(true), createElementBlock(Fragment, null, renderList(filtered.value.Logic, (n) => {
					return openBlock(), createElementBlock("button", {
						key: n.type,
						class: "node-btn",
						draggable: "true",
						onDragstart: ($event) => onDragStart(n.type, $event),
						onClick: ($event) => _ctx.$emit("addNode", n.type),
						title: n.label
					}, [createBaseVNode("div", { class: normalizeClass(["btn-icon", n.iconClass]) }, [(openBlock(), createBlock(resolveDynamicComponent(unref(iconComp)(n.type))))], 2), createBaseVNode("span", _hoisted_17$2, toDisplayString(n.label), 1)], 40, _hoisted_16$2);
				}), 128))])
			]);
		};
	}
}));
//#endregion
//#region entrypoints/popup/components/builder/components/Sidebar.vue
var Sidebar_default = /*#__PURE__*/ _plugin_vue_export_helper_default(Sidebar_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-ba244c87"]]);
//#endregion
//#region entrypoints/popup/components/builder/components/PropertyPanel.vue?vue&type=script&setup=true&lang.ts
init_asyncToGenerator();
var _hoisted_1$3 = { class: "property-panel" };
var _hoisted_2$3 = {
	key: 0,
	class: "panel-content"
};
var _hoisted_3$3 = { class: "panel-header" };
var _hoisted_4$3 = { class: "header-id" };
var _hoisted_5$3 = { class: "form-section" };
var _hoisted_6$3 = { class: "form-group" };
var _hoisted_7$3 = { class: "form-section" };
var _hoisted_8$3 = { class: "form-group" };
var _hoisted_9$3 = { class: "form-group checkbox-group" };
var _hoisted_10$3 = { class: "checkbox-label" };
var _hoisted_11$3 = {
	key: 1,
	class: "error-box"
};
var _hoisted_12$3 = {
	key: 1,
	class: "panel-empty"
};
//#endregion
//#region entrypoints/popup/components/builder/components/PropertyPanel.vue
var PropertyPanel_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "PropertyPanel",
	props: {
		node: {},
		highlightField: {},
		subflowIds: {},
		variables: {}
	},
	emits: [
		"create-subflow",
		"switch-to-subflow",
		"remove-node"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		function onRemove() {
			const n = props.node;
			if (!n) return;
			emit("remove-node", n.id);
		}
		computed({
			get() {
				const n = props.node;
				if (!n || n.type !== "wait") return "";
				try {
					var _n$config;
					return JSON.stringify(((_n$config = n.config) === null || _n$config === void 0 ? void 0 : _n$config.condition) || {}, null, 2);
				} catch (_unused) {
					return "";
				}
			},
			set(v) {
				const n = props.node;
				if (!n || n.type !== "wait") return;
				try {
					n.config = _objectSpread2(_objectSpread2({}, n.config || {}), {}, { condition: JSON.parse(v || "{}") });
				} catch (_unused2) {}
			}
		});
		computed({
			get() {
				const n = props.node;
				if (!n || n.type !== "assert") return "";
				try {
					var _n$config2;
					return JSON.stringify(((_n$config2 = n.config) === null || _n$config2 === void 0 ? void 0 : _n$config2.assert) || {}, null, 2);
				} catch (_unused3) {
					return "";
				}
			},
			set(v) {
				const n = props.node;
				if (!n || n.type !== "assert") return;
				try {
					n.config = _objectSpread2(_objectSpread2({}, n.config || {}), {}, { assert: JSON.parse(v || "{}") });
				} catch (_unused4) {}
			}
		});
		computed({
			get() {
				const n = props.node;
				if (!n || n.type !== "if") return "";
				try {
					var _n$config3;
					return JSON.stringify(((_n$config3 = n.config) === null || _n$config3 === void 0 ? void 0 : _n$config3.condition) || {}, null, 2);
				} catch (_unused5) {
					return "";
				}
			},
			set(v) {
				const n = props.node;
				if (!n || n.type !== "if") return;
				try {
					n.config = _objectSpread2(_objectSpread2({}, n.config || {}), {}, { condition: JSON.parse(v || "{}") });
				} catch (_unused6) {}
			}
		});
		const variables = computed(() => props.variables || []);
		computed({
			get() {
				const n = props.node;
				if (!n || n.type !== "if") return [];
				if (!n.config) n.config = {};
				if (!Array.isArray(n.config.branches)) n.config.branches = [{
					id: `c_${Math.random().toString(36).slice(2, 6)}`,
					name: "",
					expr: ""
				}];
				return n.config.branches;
			},
			set(v) {
				const n = props.node;
				if (!n || n.type !== "if") return;
				n.config.branches = v;
			}
		});
		computed({
			get() {
				var _n$config4;
				const n = props.node;
				if (!n || n.type !== "if") return true;
				return ((_n$config4 = n.config) === null || _n$config4 === void 0 ? void 0 : _n$config4.else) !== false;
			},
			set(v) {
				const n = props.node;
				if (!n || n.type !== "if") return;
				n.config = _objectSpread2(_objectSpread2({}, n.config || {}), {}, { else: !!v });
			}
		});
		computed({
			get() {
				const n = props.node;
				if (!n || n.type !== "while") return "";
				try {
					var _n$config5;
					return JSON.stringify(((_n$config5 = n.config) === null || _n$config5 === void 0 ? void 0 : _n$config5.condition) || {}, null, 2);
				} catch (_unused7) {
					return "";
				}
			},
			set(v) {
				const n = props.node;
				if (!n || n.type !== "while") return;
				try {
					n.config = _objectSpread2(_objectSpread2({}, n.config || {}), {}, { condition: JSON.parse(v || "{}") });
				} catch (_unused8) {}
			}
		});
		const nodeErrors = computed(() => props.node ? validateNodeWithRegistry(props.node) : []);
		computed(() => {
			var _n$config6, _n$config7, _n$config8;
			const n = props.node;
			if (!n || n.type !== "extract") return [];
			const errs = [];
			if (!((_n$config6 = n.config) === null || _n$config6 === void 0 ? void 0 : _n$config6.saveAs)) errs.push("需填写保存变量名");
			if (!((_n$config7 = n.config) === null || _n$config7 === void 0 ? void 0 : _n$config7.selector) && !((_n$config8 = n.config) === null || _n$config8 === void 0 ? void 0 : _n$config8.js)) errs.push("需提供 selector 或 js");
			return errs;
		});
		computed(() => {
			var _n$config9, _n$config10, _n$config11;
			const n = props.node;
			if (!n || n.type !== "switchTab") return false;
			return !(((_n$config9 = n.config) === null || _n$config9 === void 0 ? void 0 : _n$config9.tabId) || ((_n$config10 = n.config) === null || _n$config10 === void 0 ? void 0 : _n$config10.urlContains) || ((_n$config11 = n.config) === null || _n$config11 === void 0 ? void 0 : _n$config11.titleContains));
		});
		computed(() => {
			var _props$node$config$re, _props$node;
			return Number((_props$node$config$re = (_props$node = props.node) === null || _props$node === void 0 || (_props$node = _props$node.config) === null || _props$node === void 0 || (_props$node = _props$node.retry) === null || _props$node === void 0 ? void 0 : _props$node.count) !== null && _props$node$config$re !== void 0 ? _props$node$config$re : 0);
		});
		computed(() => {
			var _props$node$config$re2, _props$node2;
			return Number((_props$node$config$re2 = (_props$node2 = props.node) === null || _props$node2 === void 0 || (_props$node2 = _props$node2.config) === null || _props$node2 === void 0 || (_props$node2 = _props$node2.retry) === null || _props$node2 === void 0 ? void 0 : _props$node2.intervalMs) !== null && _props$node$config$re2 !== void 0 ? _props$node$config$re2 : 0);
		});
		computed(() => {
			var _props$node$config$re3, _props$node3;
			return String((_props$node$config$re3 = (_props$node3 = props.node) === null || _props$node3 === void 0 || (_props$node3 = _props$node3.config) === null || _props$node3 === void 0 || (_props$node3 = _props$node3.retry) === null || _props$node3 === void 0 ? void 0 : _props$node3.backoff) !== null && _props$node$config$re3 !== void 0 ? _props$node$config$re3 : "none");
		});
		computed({
			get() {
				const n = props.node;
				if (!n || n.type !== "http") return "";
				try {
					var _n$config12;
					return JSON.stringify(((_n$config12 = n.config) === null || _n$config12 === void 0 ? void 0 : _n$config12.headers) || {}, null, 2);
				} catch (_unused10) {
					return "";
				}
			},
			set(v) {
				const n = props.node;
				if (!n || n.type !== "http") return;
				try {
					n.config.headers = JSON.parse(v || "{}");
				} catch (_unused11) {}
			}
		});
		computed({
			get() {
				const n = props.node;
				if (!n || n.type !== "http") return "";
				try {
					var _n$config$body, _n$config13;
					return JSON.stringify((_n$config$body = (_n$config13 = n.config) === null || _n$config13 === void 0 ? void 0 : _n$config13.body) !== null && _n$config$body !== void 0 ? _n$config$body : null, null, 2);
				} catch (_unused12) {
					return "";
				}
			},
			set(v) {
				const n = props.node;
				if (!n || n.type !== "http") return;
				try {
					n.config.body = v ? JSON.parse(v) : null;
				} catch (_unused13) {}
			}
		});
		computed({
			get() {
				const n = props.node;
				if (!n || n.type !== "http") return "";
				try {
					var _n$config14;
					return ((_n$config14 = n.config) === null || _n$config14 === void 0 ? void 0 : _n$config14.formData) ? JSON.stringify(n.config.formData, null, 2) : "";
				} catch (_unused14) {
					return "";
				}
			},
			set(v) {
				const n = props.node;
				if (!n || n.type !== "http") return;
				try {
					n.config.formData = v ? JSON.parse(v) : void 0;
				} catch (_unused15) {}
			}
		});
		computed({
			get() {
				const n = props.node;
				if (!n || n.type !== "script") return "";
				try {
					var _n$config15;
					return JSON.stringify(((_n$config15 = n.config) === null || _n$config15 === void 0 ? void 0 : _n$config15.assign) || {}, null, 2);
				} catch (_unused16) {
					return "";
				}
			},
			set(v) {
				const n = props.node;
				if (!n || n.type !== "script") return;
				try {
					n.config.assign = JSON.parse(v || "{}");
				} catch (_unused17) {}
			}
		});
		computed({
			get() {
				const n = props.node;
				if (!n || n.type !== "executeFlow") return "";
				try {
					var _n$config16;
					return JSON.stringify(((_n$config16 = n.config) === null || _n$config16 === void 0 ? void 0 : _n$config16.args) || {}, null, 2);
				} catch (_unused18) {
					return "";
				}
			},
			set(v) {
				const n = props.node;
				if (!n || n.type !== "executeFlow") return;
				try {
					n.config.args = v ? JSON.parse(v) : {};
				} catch (_unused19) {}
			}
		});
		const flows = ref([]);
		onMounted(_asyncToGenerator(function* () {
			try {
				const res = yield chrome.runtime.sendMessage({ type: BACKGROUND_MESSAGE_TYPES.RR_LIST_FLOWS });
				if (res && res.success) flows.value = res.flows || [];
			} catch (_unused20) {}
		}));
		watch(() => props.highlightField, (field) => {
			if (!field) return;
			try {
				var _document, _document$querySelect;
				const root = ((_document = document) === null || _document === void 0 || (_document$querySelect = _document.querySelector) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.call(_document, ".panel")) || null;
				const esc = globalThis.CSS && typeof globalThis.CSS.escape === "function" ? globalThis.CSS.escape(field) : String(field).replace(/["\\]/g, "\\$&");
				const el = (root || document).querySelector(`[data-field="${esc}"]`);
				if (el && el.scrollIntoView) el.scrollIntoView({
					block: "center",
					behavior: "smooth"
				});
				if (el) {
					el.classList.add("hl");
					setTimeout(() => el.classList.remove("hl"), 1200);
				}
			} catch (_unused21) {}
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("aside", _hoisted_1$3, [__props.node ? (openBlock(), createElementBlock("div", _hoisted_2$3, [
				createBaseVNode("div", _hoisted_3$3, [createBaseVNode("div", null, [_cache[3] || (_cache[3] = createBaseVNode("div", { class: "header-title" }, "节点属性", -1)), createBaseVNode("div", _hoisted_4$3, toDisplayString(__props.node.id), 1)]), createBaseVNode("button", {
					class: "btn-delete",
					type: "button",
					title: "删除节点",
					onClick: withModifiers(onRemove, ["stop"])
				}, [..._cache[4] || (_cache[4] = [createBaseVNode("svg", {
					width: "16",
					height: "16",
					viewBox: "0 0 16 16",
					fill: "none"
				}, [createBaseVNode("path", {
					d: "m4 4 8 8M12 4 4 12",
					stroke: "currentColor",
					"stroke-width": "1.8",
					"stroke-linecap": "round"
				})], -1)])])]),
				createBaseVNode("div", _hoisted_5$3, [createBaseVNode("div", _hoisted_6$3, [_cache[5] || (_cache[5] = createBaseVNode("label", { class: "form-label" }, "节点名称", -1)), withDirectives(createBaseVNode("input", {
					class: "form-input",
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => __props.node.name = $event),
					placeholder: "输入节点名称"
				}, null, 512), [[vModelText, __props.node.name]])])]),
				_cache[10] || (_cache[10] = createBaseVNode("div", { class: "divider" }, null, -1)),
				__props.node ? (openBlock(), createBlock(PropertyFromSpec_default, {
					key: __props.node.type + ":" + __props.node.id,
					node: __props.node,
					variables: variables.value
				}, null, 8, ["node", "variables"])) : createCommentVNode("", true),
				_cache[11] || (_cache[11] = createBaseVNode("div", { class: "divider" }, null, -1)),
				createBaseVNode("div", _hoisted_7$3, [
					_cache[8] || (_cache[8] = createBaseVNode("div", { class: "section-title" }, "通用设置", -1)),
					createBaseVNode("div", _hoisted_8$3, [_cache[6] || (_cache[6] = createBaseVNode("label", { class: "form-label" }, "超时 (ms)", -1)), withDirectives(createBaseVNode("input", {
						class: "form-input",
						type: "number",
						"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => __props.node.config.timeoutMs = $event),
						min: "0",
						placeholder: "默认使用全局超时"
					}, null, 512), [[
						vModelText,
						__props.node.config.timeoutMs,
						void 0,
						{ number: true }
					]])]),
					createBaseVNode("div", _hoisted_9$3, [createBaseVNode("label", _hoisted_10$3, [withDirectives(createBaseVNode("input", {
						type: "checkbox",
						"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => __props.node.config.screenshotOnFail = $event)
					}, null, 512), [[vModelCheckbox, __props.node.config.screenshotOnFail]]), _cache[7] || (_cache[7] = createBaseVNode("span", null, "失败时截图", -1))])])
				]),
				nodeErrors.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_11$3, [_cache[9] || (_cache[9] = createBaseVNode("div", { class: "error-title" }, "⚠️ 配置错误", -1)), (openBlock(true), createElementBlock(Fragment, null, renderList(nodeErrors.value, (e) => {
					return openBlock(), createElementBlock("div", {
						key: e,
						class: "error-item"
					}, toDisplayString(e), 1);
				}), 128))])) : createCommentVNode("", true)
			])) : (openBlock(), createElementBlock("div", _hoisted_12$3, [..._cache[12] || (_cache[12] = [createBaseVNode("svg", {
				class: "empty-icon",
				width: "48",
				height: "48",
				viewBox: "0 0 48 48",
				fill: "none"
			}, [createBaseVNode("rect", {
				x: "8",
				y: "8",
				width: "32",
				height: "32",
				rx: "4",
				stroke: "currentColor",
				"stroke-width": "2",
				opacity: "0.3"
			}), createBaseVNode("path", {
				d: "M18 20h12M18 24h12M18 28h8",
				stroke: "currentColor",
				"stroke-width": "2",
				"stroke-linecap": "round",
				opacity: "0.3"
			})], -1), createBaseVNode("div", { class: "empty-text" }, [
				createTextVNode("选择一个节点"),
				createBaseVNode("br"),
				createTextVNode("查看和编辑属性")
			], -1)])]))]);
		};
	}
}), [["__scopeId", "data-v-39bffc8e"]]);
//#endregion
//#region entrypoints/popup/components/builder/components/EdgePropertyPanel.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$2 = { class: "property-panel" };
var _hoisted_2$2 = {
	key: 0,
	class: "panel-content"
};
var _hoisted_3$2 = { class: "panel-header" };
var _hoisted_4$2 = { class: "header-id" };
var _hoisted_5$2 = { class: "form-section" };
var _hoisted_6$2 = { class: "form-group" };
var _hoisted_7$2 = { class: "text" };
var _hoisted_8$2 = { class: "form-group" };
var _hoisted_9$2 = { class: "text" };
var _hoisted_10$2 = { class: "form-group" };
var _hoisted_11$2 = { class: "form-group" };
var _hoisted_12$2 = { class: "text" };
var _hoisted_13$2 = {
	key: 1,
	class: "panel-empty"
};
//#endregion
//#region entrypoints/popup/components/builder/components/EdgePropertyPanel.vue
var EdgePropertyPanel_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "EdgePropertyPanel",
	props: {
		edge: {},
		nodes: {}
	},
	emits: ["remove-edge"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const src = computed(() => {
			var _props$nodes, _props$nodes$find;
			return ((_props$nodes = props.nodes) === null || _props$nodes === void 0 || (_props$nodes$find = _props$nodes.find) === null || _props$nodes$find === void 0 ? void 0 : _props$nodes$find.call(_props$nodes, (n) => {
				var _props$edge;
				return n.id === ((_props$edge = props.edge) === null || _props$edge === void 0 ? void 0 : _props$edge.from);
			})) || null;
		});
		const dst = computed(() => {
			var _props$nodes2, _props$nodes2$find;
			return ((_props$nodes2 = props.nodes) === null || _props$nodes2 === void 0 || (_props$nodes2$find = _props$nodes2.find) === null || _props$nodes2$find === void 0 ? void 0 : _props$nodes2$find.call(_props$nodes2, (n) => {
				var _props$edge2;
				return n.id === ((_props$edge2 = props.edge) === null || _props$edge2 === void 0 ? void 0 : _props$edge2.to);
			})) || null;
		});
		const srcName = computed(() => src.value ? src.value.name || `${src.value.type} (${src.value.id})` : "Unknown");
		const dstName = computed(() => dst.value ? dst.value.name || `${dst.value.type} (${dst.value.id})` : "Unknown");
		const isValid = computed(() => !!(src.value && dst.value && src.value.id !== dst.value.id));
		const labelPretty = computed(() => {
			var _props$edge3;
			const raw = String(((_props$edge3 = props.edge) === null || _props$edge3 === void 0 ? void 0 : _props$edge3.label) || "default");
			if (raw === "default") return "default";
			if (raw === "true") return "true ✓";
			if (raw === "false") return "false ✗";
			if (raw === "onError") return "onError !";
			if (raw === "else") return "else";
			if (raw.startsWith("case:")) {
				var _ifNode$config, _ifNode$config$find;
				const id = raw.slice(5);
				const ifNode = src.value && src.value.type === "if" ? src.value : null;
				const found = ifNode === null || ifNode === void 0 || (_ifNode$config = ifNode.config) === null || _ifNode$config === void 0 || (_ifNode$config = _ifNode$config.branches) === null || _ifNode$config === void 0 || (_ifNode$config$find = _ifNode$config.find) === null || _ifNode$config$find === void 0 ? void 0 : _ifNode$config$find.call(_ifNode$config, (b) => String(b.id) === id);
				if (found) return `case: ${found.name || found.expr || id}`;
				return `case: ${id}`;
			}
			return raw;
		});
		function onRemove() {
			if (!props.edge) return;
			emit("remove-edge", props.edge.id);
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("aside", _hoisted_1$2, [__props.edge ? (openBlock(), createElementBlock("div", _hoisted_2$2, [
				createBaseVNode("div", _hoisted_3$2, [createBaseVNode("div", null, [_cache[0] || (_cache[0] = createBaseVNode("div", { class: "header-title" }, "Edge", -1)), createBaseVNode("div", _hoisted_4$2, toDisplayString(__props.edge.id), 1)]), createBaseVNode("button", {
					class: "btn-delete",
					type: "button",
					title: "删除边",
					onClick: withModifiers(onRemove, ["stop"])
				}, [..._cache[1] || (_cache[1] = [createBaseVNode("svg", {
					width: "16",
					height: "16",
					viewBox: "0 0 16 16",
					fill: "none"
				}, [createBaseVNode("path", {
					d: "m4 4 8 8M12 4 4 12",
					stroke: "currentColor",
					"stroke-width": "1.8",
					"stroke-linecap": "round"
				})], -1)])])]),
				createBaseVNode("div", _hoisted_5$2, [
					createBaseVNode("div", _hoisted_6$2, [_cache[2] || (_cache[2] = createBaseVNode("label", { class: "form-label" }, "Source", -1)), createBaseVNode("div", _hoisted_7$2, toDisplayString(srcName.value), 1)]),
					createBaseVNode("div", _hoisted_8$2, [_cache[3] || (_cache[3] = createBaseVNode("label", { class: "form-label" }, "Target", -1)), createBaseVNode("div", _hoisted_9$2, toDisplayString(dstName.value), 1)]),
					createBaseVNode("div", _hoisted_10$2, [_cache[4] || (_cache[4] = createBaseVNode("label", { class: "form-label" }, "Connection status", -1)), createBaseVNode("div", { class: normalizeClass(["status", {
						ok: isValid.value,
						bad: !isValid.value
					}]) }, toDisplayString(isValid.value ? "Valid" : "Invalid"), 3)]),
					createBaseVNode("div", _hoisted_11$2, [_cache[5] || (_cache[5] = createBaseVNode("label", { class: "form-label" }, "Branch", -1)), createBaseVNode("div", _hoisted_12$2, toDisplayString(labelPretty.value), 1)])
				]),
				_cache[6] || (_cache[6] = createBaseVNode("div", { class: "divider" }, null, -1)),
				_cache[7] || (_cache[7] = createBaseVNode("div", { class: "form-section" }, [createBaseVNode("div", {
					class: "text-xs text-slate-500",
					style: { "padding": "0 20px" }
				}, " Inspect connection only. Editing of branch/handles will be supported in a later pass. ")], -1))
			])) : (openBlock(), createElementBlock("div", _hoisted_13$2, [..._cache[8] || (_cache[8] = [createBaseVNode("div", { class: "empty-text" }, "未选择边", -1)])]))]);
		};
	}
}), [["__scopeId", "data-v-56a83e5b"]]);
//#endregion
//#region entrypoints/popup/components/builder/components/TriggerPanel.vue?vue&type=script&setup=true&lang.ts
init_asyncToGenerator();
var _hoisted_1$1 = { class: "trigger-panel" };
var _hoisted_2$1 = { class: "panel-header" };
var _hoisted_3$1 = { class: "header-left" };
var _hoisted_4$1 = { class: "header-sub" };
var _hoisted_5$1 = { class: "header-right" };
var _hoisted_6$1 = ["disabled"];
var _hoisted_7$1 = { class: "panel-content" };
var _hoisted_8$1 = { class: "form-section" };
var _hoisted_9$1 = { class: "section-header" };
var _hoisted_10$1 = { class: "section-actions" };
var _hoisted_11$1 = { class: "form-section" };
var _hoisted_12$1 = { class: "section-header" };
var _hoisted_13$1 = { class: "section-title" };
var _hoisted_14$1 = {
	key: 0,
	class: "muted"
};
var _hoisted_15$1 = {
	key: 1,
	class: "muted"
};
var _hoisted_16$1 = {
	key: 2,
	class: "trigger-list"
};
var _hoisted_17$1 = { class: "trigger-main" };
var _hoisted_18$1 = { class: "trigger-top" };
var _hoisted_19$1 = ["data-kind"];
var _hoisted_20 = { class: "trigger-id" };
var _hoisted_21 = ["data-owner"];
var _hoisted_22 = { class: "trigger-desc" };
var _hoisted_23 = { class: "trigger-actions" };
var _hoisted_24 = ["title"];
var _hoisted_25 = [
	"checked",
	"disabled",
	"onChange"
];
var _hoisted_26 = ["disabled", "onClick"];
var _hoisted_27 = ["disabled", "onClick"];
var _hoisted_28 = ["disabled", "onClick"];
var _hoisted_29 = { class: "rr-dialog small" };
var _hoisted_30 = { class: "rr-header" };
var _hoisted_31 = { class: "title" };
var _hoisted_32 = { class: "rr-body" };
var _hoisted_33 = { class: "form-group" };
var _hoisted_34 = ["disabled"];
var _hoisted_35 = { class: "form-group checkbox-group" };
var _hoisted_36 = { class: "checkbox-label" };
var _hoisted_37 = { class: "form-group" };
var _hoisted_38 = { class: "form-group" };
var _hoisted_39 = { class: "rr-footer" };
var _hoisted_40 = ["disabled"];
var TriggerPanel_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent(_objectSpread2(_objectSpread2({}, { name: "TriggerPanel" }), {}, {
	__name: "TriggerPanel",
	props: { flowId: {} },
	emits: ["close"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const rpc = useRRV3Rpc({ autoConnect: true });
		const loading = ref(false);
		const triggers = ref([]);
		const busyIds = ref({});
		const sortedTriggers = computed(() => {
			return [...triggers.value].sort((a, b) => {
				const kindOrder = a.kind.localeCompare(b.kind);
				if (kindOrder !== 0) return kindOrder;
				return a.id.localeCompare(b.id);
			});
		});
		const editorOpen = ref(false);
		const editorSaving = ref(false);
		const editorMode = ref("create");
		const editorKind = ref("interval");
		const editorEditingId = ref(null);
		const editorEnabled = ref(true);
		const editorPeriodMinutes = ref(5);
		const editorWhenLocal = ref("");
		const editorTitle = computed(() => {
			return `${editorMode.value === "create" ? "Create" : "Edit"} ${editorKind.value} Trigger`;
		});
		function setBusy(triggerId, value) {
			busyIds.value = _objectSpread2(_objectSpread2({}, busyIds.value), {}, { [triggerId]: value });
		}
		function formatLocalDateTime(ms) {
			const date = new Date(ms);
			if (!Number.isFinite(date.getTime())) return String(ms);
			return date.toLocaleString();
		}
		function pad2(value) {
			return String(value).padStart(2, "0");
		}
		function unixMsToDatetimeLocal(ms) {
			const date = new Date(ms);
			if (!Number.isFinite(date.getTime())) return "";
			return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
		}
		function datetimeLocalToUnixMs(value) {
			const match = String(value || "").trim().match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
			if (!match) return null;
			const [, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr] = match;
			const ms = new Date(Number(yearStr), Number(monthStr) - 1, Number(dayStr), Number(hourStr), Number(minuteStr), Number(secondStr || 0), 0).getTime();
			return Number.isFinite(ms) ? ms : null;
		}
		function isPanelManaged(trigger) {
			return trigger.kind === "interval" || trigger.kind === "once";
		}
		function ownerOf(trigger) {
			const flowId = String(props.flowId || "");
			const trigPrefix = `trg_${flowId}_`;
			const schPrefix = `sch_${flowId}_`;
			if (trigger.id.startsWith(trigPrefix) || trigger.id.startsWith(schPrefix)) return "triggerNode";
			if (isPanelManaged(trigger)) return "panel";
			return "external";
		}
		function ownerLabel(owner) {
			switch (owner) {
				case "triggerNode": return "via trigger node";
				case "external": return "external";
				default: return "";
			}
		}
		function describeTrigger(trigger) {
			switch (trigger.kind) {
				case "url": return `URL match rules: ${(trigger.match || []).length}`;
				case "cron": {
					const spec = trigger;
					return spec.timezone ? `cron: ${spec.cron} (${spec.timezone})` : `cron: ${spec.cron}`;
				}
				case "interval": return `Every ${trigger.periodMinutes} minute(s)`;
				case "once": return `At ${formatLocalDateTime(Number(trigger.whenMs))}`;
				case "command": return `commandKey: ${trigger.commandKey}`;
				case "contextMenu": return `title: ${trigger.title}`;
				case "dom": return `selector: ${trigger.selector}`;
				case "manual": return "Manual trigger (fire via button)";
				default: return "";
			}
		}
		function refresh() {
			return _refresh.apply(this, arguments);
		}
		function _refresh() {
			_refresh = _asyncToGenerator(function* () {
				const flowId = String(props.flowId || "").trim();
				if (!flowId) return;
				loading.value = true;
				try {
					yield rpc.ensureConnected();
					const result = yield rpc.request("rr_v3.listTriggers", { flowId });
					triggers.value = Array.isArray(result) ? result : [];
				} catch (e) {
					toast(e instanceof Error ? e.message : String(e), "error");
				} finally {
					loading.value = false;
				}
			});
			return _refresh.apply(this, arguments);
		}
		function onToggleEnabled(_x, _x2) {
			return _onToggleEnabled.apply(this, arguments);
		}
		function _onToggleEnabled() {
			_onToggleEnabled = _asyncToGenerator(function* (trigger, enabled) {
				if (busyIds.value[trigger.id]) return;
				setBusy(trigger.id, true);
				try {
					yield rpc.ensureConnected();
					const method = enabled ? "rr_v3.enableTrigger" : "rr_v3.disableTrigger";
					yield rpc.request(method, { triggerId: trigger.id });
					yield refresh();
				} catch (e) {
					toast(e instanceof Error ? e.message : String(e), "error");
				} finally {
					setBusy(trigger.id, false);
				}
			});
			return _onToggleEnabled.apply(this, arguments);
		}
		function fireManual(_x3) {
			return _fireManual.apply(this, arguments);
		}
		function _fireManual() {
			_fireManual = _asyncToGenerator(function* (trigger) {
				if (trigger.kind !== "manual") return;
				if (busyIds.value[trigger.id]) return;
				setBusy(trigger.id, true);
				try {
					var _result$runId;
					yield rpc.ensureConnected();
					const result = yield rpc.request("rr_v3.fireTrigger", { triggerId: trigger.id });
					toast(`Triggered: ${(_result$runId = result === null || result === void 0 ? void 0 : result.runId) !== null && _result$runId !== void 0 ? _result$runId : "run enqueued"}`, "info");
				} catch (e) {
					toast(e instanceof Error ? e.message : String(e), "error");
				} finally {
					setBusy(trigger.id, false);
				}
			});
			return _fireManual.apply(this, arguments);
		}
		function openCreate(kind) {
			editorMode.value = "create";
			editorKind.value = kind;
			editorEditingId.value = null;
			editorEnabled.value = true;
			editorPeriodMinutes.value = 5;
			editorWhenLocal.value = unixMsToDatetimeLocal(Date.now() + 3e5);
			editorOpen.value = true;
		}
		function openEdit(trigger) {
			if (!isPanelManaged(trigger)) return;
			editorMode.value = "edit";
			editorKind.value = trigger.kind;
			editorEditingId.value = trigger.id;
			editorEnabled.value = !!trigger.enabled;
			if (trigger.kind === "interval") editorPeriodMinutes.value = Number(trigger.periodMinutes) || 1;
			else editorWhenLocal.value = unixMsToDatetimeLocal(Number(trigger.whenMs));
			editorOpen.value = true;
		}
		function closeEditor() {
			if (editorSaving.value) return;
			editorOpen.value = false;
		}
		function submitEditor() {
			return _submitEditor.apply(this, arguments);
		}
		function _submitEditor() {
			_submitEditor = _asyncToGenerator(function* () {
				if (editorSaving.value) return;
				const flowId = String(props.flowId || "").trim();
				if (!flowId) {
					toast("Flow ID is empty", "error");
					return;
				}
				editorSaving.value = true;
				try {
					yield rpc.ensureConnected();
					let payload;
					if (editorKind.value === "interval") {
						const periodMinutes = Math.max(1, Math.floor(Number(editorPeriodMinutes.value || 1)));
						payload = {
							kind: "interval",
							enabled: !!editorEnabled.value,
							flowId,
							periodMinutes
						};
						if (editorEditingId.value) payload.id = editorEditingId.value;
					} else {
						const whenMs = datetimeLocalToUnixMs(editorWhenLocal.value);
						if (whenMs === null) {
							toast("Invalid trigger time format", "error");
							return;
						}
						if (whenMs < Date.now()) toast("Trigger time is in the past. It may fire immediately.", "warn");
						payload = {
							kind: "once",
							enabled: !!editorEnabled.value,
							flowId,
							whenMs
						};
						if (editorEditingId.value) payload.id = editorEditingId.value;
					}
					if (editorMode.value === "create") yield rpc.request("rr_v3.createTrigger", { trigger: payload });
					else yield rpc.request("rr_v3.updateTrigger", { trigger: payload });
					editorOpen.value = false;
					yield refresh();
				} catch (e) {
					toast(e instanceof Error ? e.message : String(e), "error");
				} finally {
					editorSaving.value = false;
				}
			});
			return _submitEditor.apply(this, arguments);
		}
		function removePanelTrigger(_x4) {
			return _removePanelTrigger.apply(this, arguments);
		}
		function _removePanelTrigger() {
			_removePanelTrigger = _asyncToGenerator(function* (trigger) {
				if (!isPanelManaged(trigger)) return;
				if (!confirm(`Delete trigger?\n\n${trigger.id}`)) return;
				if (busyIds.value[trigger.id]) return;
				setBusy(trigger.id, true);
				try {
					yield rpc.ensureConnected();
					yield rpc.request("rr_v3.deleteTrigger", { triggerId: trigger.id });
					yield refresh();
				} catch (e) {
					toast(e instanceof Error ? e.message : String(e), "error");
				} finally {
					setBusy(trigger.id, false);
				}
			});
			return _removePanelTrigger.apply(this, arguments);
		}
		watch(() => props.flowId, () => {
			refresh();
		}, { immediate: true });
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("aside", _hoisted_1$1, [
				createBaseVNode("div", _hoisted_2$1, [createBaseVNode("div", _hoisted_3$1, [_cache[7] || (_cache[7] = createBaseVNode("div", { class: "header-title" }, "Triggers", -1)), createBaseVNode("div", _hoisted_4$1, toDisplayString(__props.flowId), 1)]), createBaseVNode("div", _hoisted_5$1, [createBaseVNode("button", {
					class: "btn-sm",
					type: "button",
					disabled: loading.value,
					onClick: refresh
				}, " Refresh ", 8, _hoisted_6$1), createBaseVNode("button", {
					class: "btn-close",
					type: "button",
					title: "Close",
					onClick: _cache[0] || (_cache[0] = ($event) => emit("close"))
				}, [..._cache[8] || (_cache[8] = [createBaseVNode("svg", {
					width: "16",
					height: "16",
					viewBox: "0 0 16 16",
					fill: "none"
				}, [createBaseVNode("path", {
					d: "m4 4 8 8M12 4 4 12",
					stroke: "currentColor",
					"stroke-width": "1.8",
					"stroke-linecap": "round"
				})], -1)])])])]),
				createBaseVNode("div", _hoisted_7$1, [
					createBaseVNode("div", _hoisted_8$1, [createBaseVNode("div", _hoisted_9$1, [_cache[9] || (_cache[9] = createBaseVNode("div", { class: "section-title" }, "Add Trigger", -1)), createBaseVNode("div", _hoisted_10$1, [createBaseVNode("button", {
						class: "btn-sm",
						type: "button",
						onClick: _cache[1] || (_cache[1] = ($event) => openCreate("interval"))
					}, "+ Interval"), createBaseVNode("button", {
						class: "btn-sm",
						type: "button",
						onClick: _cache[2] || (_cache[2] = ($event) => openCreate("once"))
					}, "+ Once")])]), _cache[10] || (_cache[10] = createBaseVNode("div", { class: "hint" }, " Other types (url/cron/command/contextMenu/dom) are configured via trigger nodes. ", -1))]),
					_cache[14] || (_cache[14] = createBaseVNode("div", { class: "divider" }, null, -1)),
					createBaseVNode("div", _hoisted_11$1, [createBaseVNode("div", _hoisted_12$1, [createBaseVNode("div", _hoisted_13$1, "Current Triggers (" + toDisplayString(triggers.value.length) + ")", 1)]), loading.value ? (openBlock(), createElementBlock("div", _hoisted_14$1, "Loading...")) : triggers.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_15$1, "No triggers configured")) : (openBlock(), createElementBlock("div", _hoisted_16$1, [(openBlock(true), createElementBlock(Fragment, null, renderList(sortedTriggers.value, (trigger) => {
						return openBlock(), createElementBlock("div", {
							key: trigger.id,
							class: "trigger-row"
						}, [createBaseVNode("div", _hoisted_17$1, [createBaseVNode("div", _hoisted_18$1, [
							createBaseVNode("span", {
								class: "badge",
								"data-kind": trigger.kind
							}, toDisplayString(trigger.kind), 9, _hoisted_19$1),
							createBaseVNode("span", _hoisted_20, toDisplayString(trigger.id), 1),
							ownerOf(trigger) !== "panel" ? (openBlock(), createElementBlock("span", {
								key: 0,
								class: "ownership",
								"data-owner": ownerOf(trigger)
							}, toDisplayString(ownerLabel(ownerOf(trigger))), 9, _hoisted_21)) : createCommentVNode("", true)
						]), createBaseVNode("div", _hoisted_22, toDisplayString(describeTrigger(trigger)), 1)]), createBaseVNode("div", _hoisted_23, [
							createBaseVNode("label", {
								class: normalizeClass(["toggle", { readonly: ownerOf(trigger) === "triggerNode" }]),
								title: ownerOf(trigger) === "triggerNode" ? "Edit via trigger node in Builder" : ""
							}, [createBaseVNode("input", {
								type: "checkbox",
								checked: trigger.enabled,
								disabled: busyIds.value[trigger.id] || ownerOf(trigger) === "triggerNode",
								onChange: ($event) => onToggleEnabled(trigger, $event.target.checked)
							}, null, 40, _hoisted_25), _cache[11] || (_cache[11] = createBaseVNode("span", null, "Enabled", -1))], 10, _hoisted_24),
							trigger.kind === "manual" ? (openBlock(), createElementBlock("button", {
								key: 0,
								class: "btn-sm btn-primary",
								type: "button",
								disabled: busyIds.value[trigger.id] || !trigger.enabled,
								onClick: ($event) => fireManual(trigger)
							}, " Fire ", 8, _hoisted_26)) : createCommentVNode("", true),
							isPanelManaged(trigger) ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [createBaseVNode("button", {
								class: "btn-icon-sm",
								type: "button",
								title: "Edit",
								disabled: busyIds.value[trigger.id],
								onClick: ($event) => openEdit(trigger)
							}, [..._cache[12] || (_cache[12] = [createBaseVNode("svg", {
								width: "14",
								height: "14",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								"stroke-width": "2"
							}, [createBaseVNode("path", { d: "M12 20h9" }), createBaseVNode("path", { d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" })], -1)])], 8, _hoisted_27), createBaseVNode("button", {
								class: "btn-icon-sm danger",
								type: "button",
								title: "Delete",
								disabled: busyIds.value[trigger.id],
								onClick: ($event) => removePanelTrigger(trigger)
							}, [..._cache[13] || (_cache[13] = [createBaseVNode("svg", {
								width: "14",
								height: "14",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								"stroke-width": "2"
							}, [createBaseVNode("path", { d: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" })], -1)])], 8, _hoisted_28)], 64)) : createCommentVNode("", true)
						])]);
					}), 128))]))])
				]),
				editorOpen.value ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: "rr-modal",
					onClick: withModifiers(closeEditor, ["self"])
				}, [createBaseVNode("div", _hoisted_29, [
					createBaseVNode("div", _hoisted_30, [createBaseVNode("div", _hoisted_31, toDisplayString(editorTitle.value), 1), createBaseVNode("button", {
						class: "close",
						type: "button",
						onClick: closeEditor
					}, [..._cache[15] || (_cache[15] = [createBaseVNode("svg", {
						width: "16",
						height: "16",
						viewBox: "0 0 16 16",
						fill: "none"
					}, [createBaseVNode("path", {
						d: "m4 4 8 8M12 4 4 12",
						stroke: "currentColor",
						"stroke-width": "1.8",
						"stroke-linecap": "round"
					})], -1)])])]),
					createBaseVNode("div", _hoisted_32, [
						createBaseVNode("div", _hoisted_33, [_cache[17] || (_cache[17] = createBaseVNode("label", { class: "form-label" }, "Type", -1)), withDirectives(createBaseVNode("select", {
							class: "form-select",
							"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => editorKind.value = $event),
							disabled: editorMode.value === "edit"
						}, [..._cache[16] || (_cache[16] = [createBaseVNode("option", { value: "interval" }, "interval", -1), createBaseVNode("option", { value: "once" }, "once", -1)])], 8, _hoisted_34), [[vModelSelect, editorKind.value]])]),
						createBaseVNode("div", _hoisted_35, [createBaseVNode("label", _hoisted_36, [withDirectives(createBaseVNode("input", {
							type: "checkbox",
							"onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => editorEnabled.value = $event)
						}, null, 512), [[vModelCheckbox, editorEnabled.value]]), _cache[18] || (_cache[18] = createBaseVNode("span", null, "Enabled", -1))])]),
						editorKind.value === "interval" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [createBaseVNode("div", _hoisted_37, [_cache[19] || (_cache[19] = createBaseVNode("label", { class: "form-label" }, "Interval (minutes)", -1)), withDirectives(createBaseVNode("input", {
							class: "form-input",
							type: "number",
							min: "1",
							step: "1",
							"onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => editorPeriodMinutes.value = $event)
						}, null, 512), [[
							vModelText,
							editorPeriodMinutes.value,
							void 0,
							{ number: true }
						]])]), _cache[20] || (_cache[20] = createBaseVNode("div", { class: "hint" }, "Uses chrome.alarms.periodInMinutes for repeating triggers.", -1))], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [createBaseVNode("div", _hoisted_38, [_cache[21] || (_cache[21] = createBaseVNode("label", { class: "form-label" }, "Trigger Time", -1)), withDirectives(createBaseVNode("input", {
							class: "form-input",
							type: "datetime-local",
							"onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => editorWhenLocal.value = $event)
						}, null, 512), [[vModelText, editorWhenLocal.value]])]), _cache[22] || (_cache[22] = createBaseVNode("div", { class: "hint" }, " Will auto-disable after firing. Time is in local timezone. ", -1))], 64))
					]),
					createBaseVNode("div", _hoisted_39, [createBaseVNode("button", {
						class: "btn-cancel",
						type: "button",
						onClick: closeEditor
					}, "Cancel"), createBaseVNode("button", {
						class: "btn-primary",
						type: "button",
						disabled: editorSaving.value,
						onClick: submitEditor
					}, " Save ", 8, _hoisted_40)])
				])])) : createCommentVNode("", true)
			]);
		};
	}
}));
//#endregion
//#region entrypoints/popup/components/builder/components/TriggerPanel.vue
var TriggerPanel_default = /*#__PURE__*/ _plugin_vue_export_helper_default(TriggerPanel_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-20aa80c1"]]);
//#endregion
//#region entrypoints/builder/App.vue?vue&type=script&setup=true&lang.ts
init_asyncToGenerator();
var _hoisted_1 = ["data-theme"];
var _hoisted_2 = {
	key: 0,
	class: "notice-top"
};
var _hoisted_3 = { class: "main" };
var _hoisted_4 = { class: "topbar rr-topbar backdrop-blur" };
var _hoisted_5 = { class: "left" };
var _hoisted_6 = { class: "text-[var(--rr-text)]" };
var _hoisted_7 = { class: "right" };
var _hoisted_8 = {
	class: "top-btn import",
	title: "导入 JSON"
};
var _hoisted_9 = ["disabled"];
var _hoisted_10 = ["data-state"];
var _hoisted_11 = { class: "bottom-toolbar" };
var _hoisted_12 = { class: "rr-toast-container" };
var _hoisted_13 = ["data-level"];
var _hoisted_14 = {
	key: 0,
	class: "rr-modal"
};
var _hoisted_15 = { class: "rr-dialog small" };
var _hoisted_16 = { class: "rr-header" };
var _hoisted_17 = { class: "rr-body" };
var _hoisted_18 = { class: "row" };
var _hoisted_19 = { class: "row" };
//#endregion
//#region entrypoints/builder/main.ts
createApp(/* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "App",
	setup(__props) {
		const title = ref("Workflow Editor");
		const theme = ref(localStorage.getItem("rr-theme") || (matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
		const store = useBuilderStore();
		const rpc = useRRV3Rpc({
			autoConnect: true,
			onError: (message) => pushToast(message, "error")
		});
		const toasts = ref([]);
		function pushToast(message, level = "warn") {
			const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
			const item = {
				id,
				message,
				level
			};
			toasts.value.push(item);
			setTimeout(() => {
				const idx = toasts.value.findIndex((x) => x.id === id);
				if (idx >= 0) toasts.value.splice(idx, 1);
			}, 2500);
		}
		function onToast(ev) {
			try {
				var _ev$detail, _ev$detail2;
				const msg = String((ev === null || ev === void 0 || (_ev$detail = ev.detail) === null || _ev$detail === void 0 ? void 0 : _ev$detail.message) || "");
				const level = (ev === null || ev === void 0 || (_ev$detail2 = ev.detail) === null || _ev$detail2 === void 0 ? void 0 : _ev$detail2.level) || "warn";
				if (msg) pushToast(msg, level);
			} catch (_unused2) {}
		}
		onMounted(() => window.addEventListener("rr_toast", onToast));
		onUnmounted(() => window.removeEventListener("rr_toast", onToast));
		function getQuery() {
			const q = {};
			new URL(location.href).searchParams.forEach((v, k) => q[k] = v);
			return q;
		}
		function bootstrap() {
			return _bootstrap.apply(this, arguments);
		}
		function _bootstrap() {
			_bootstrap = _asyncToGenerator(function* () {
				const q = getQuery();
				if (q.flowId) try {
					yield rpc.ensureConnected();
					const flowV3 = yield rpc.request("rr_v3.getFlow", { flowId: q.flowId });
					if (flowV3) {
						const { flow: flowV2, warnings } = flowV3ToV2ForBuilder(flowV3);
						warnings.forEach((w) => pushToast(w, "warn"));
						store.initFromFlow(flowV2);
						title.value = `编辑：${flowV2.name || flowV2.id}`;
						if (q.focus) setTimeout(() => {
							try {
								store.selectNode(q.focus);
								focusNodeId.value = q.focus;
								setTimeout(() => focusNodeId.value = null, 300);
							} catch (_unused3) {}
						}, 0);
					} else {
						pushToast(`工作流 "${q.flowId}" 未找到，已创建新工作流`, "warn");
						initEmptyFlow();
					}
				} catch (e) {
					pushToast(`加载工作流失败：${e instanceof Error ? e.message : String(e)}`, "error");
					initEmptyFlow();
				}
				else if (q.new === "1") initEmptyFlow();
			});
			return _bootstrap.apply(this, arguments);
		}
		/**
		* 初始化一个空的工作流
		*/
		function initEmptyFlow() {
			const now = Date.now();
			const empty = {
				id: `flow_${now}`,
				name: "新建工作流",
				version: 1,
				steps: [],
				variables: [],
				meta: {
					createdAt: new Date(now).toISOString(),
					updatedAt: new Date(now).toISOString()
				}
			};
			store.initFromFlow(empty);
			title.value = "新建工作流";
		}
		const selectedId = computed(() => {
			var _store$activeNodeId$v, _store$activeNodeId;
			return (_store$activeNodeId$v = (_store$activeNodeId = store.activeNodeId) === null || _store$activeNodeId === void 0 ? void 0 : _store$activeNodeId.value) !== null && _store$activeNodeId$v !== void 0 ? _store$activeNodeId$v : null;
		});
		const selectedEdgeId = computed(() => {
			var _store$activeEdgeId$v, _store$activeEdgeId;
			return (_store$activeEdgeId$v = (_store$activeEdgeId = store.activeEdgeId) === null || _store$activeEdgeId === void 0 ? void 0 : _store$activeEdgeId.value) !== null && _store$activeEdgeId$v !== void 0 ? _store$activeEdgeId$v : null;
		});
		const activeNode = computed(() => store.nodes.find((n) => n.id === selectedId.value) || null);
		const activeEdge = computed(() => store.edges.find((e) => e.id === selectedEdgeId.value) || null);
		const validation = computed(() => validateFlow(store.nodes));
		const availableVars = computed(() => store.listAvailableVariables(selectedId.value || void 0));
		ref("");
		const focusNodeId = ref(null);
		const currentSubflowIdVal = computed(() => {
			var _store$currentSubflow, _store$currentSubflow2;
			return (_store$currentSubflow = (_store$currentSubflow2 = store.currentSubflowId) === null || _store$currentSubflow2 === void 0 ? void 0 : _store$currentSubflow2.value) !== null && _store$currentSubflow !== void 0 ? _store$currentSubflow : null;
		});
		const highlightField = ref(null);
		const fitSeq = ref(0);
		function onAddNodeAt(type, x, y) {
			try {
				store.addNodeAt(type, x, y);
			} catch (_unused5) {}
		}
		function fitAll() {
			fitSeq.value++;
		}
		const triggerPanelVisible = ref(false);
		const renameVisible = ref(false);
		const renameName = ref("");
		const renameDesc = ref("");
		function openRename() {
			renameName.value = store.flowLocal.name || "";
			renameDesc.value = store.flowLocal.description || "";
			renameVisible.value = true;
		}
		function applyRename() {
			store.flowLocal.name = renameName.value.trim();
			store.flowLocal.description = renameDesc.value;
			renameVisible.value = false;
		}
		/**
		* 保存 Flow 到 V3 RPC
		* @returns 保存成功返回 FlowV3，失败返回 null
		*/
		function save() {
			return _save.apply(this, arguments);
		}
		function _save() {
			_save = _asyncToGenerator(function* () {
				try {
					const flowV2 = store.exportFlowForSave();
					yield rpc.ensureConnected();
					const { flow: flowV3, warnings: convWarnings } = flowV2ToV3ForRpc(flowV2);
					convWarnings.forEach((w) => pushToast(w, "warn"));
					const saved = yield rpc.request("rr_v3.saveFlow", { flow: flowV3 });
					if (!store.flowLocal.meta) store.flowLocal.meta = {};
					store.flowLocal.meta.createdAt = saved.createdAt;
					store.flowLocal.meta.updatedAt = saved.updatedAt;
					try {
						yield syncTriggersAndSchedules(flowV2.id, flowV2.nodes || []);
					} catch (_unused6) {}
					return saved;
				} catch (e) {
					pushToast(`保存失败：${e instanceof Error ? e.message : String(e)}`, "error");
					return null;
				}
			});
			return _save.apply(this, arguments);
		}
		function trigId(flowId, nodeId, kind) {
			return `trg_${flowId}_${nodeId}_${kind}`;
		}
		function schId(flowId, nodeId, idx) {
			return `sch_${flowId}_${nodeId}_${idx}`;
		}
		/**
		* 将 V2 schedule 配置转换为 cron 表达式
		* @returns cron 表达式或 null（如果无法转换）
		*/
		function scheduleToCron(schedule) {
			if (!schedule) return null;
			const type = String(schedule.type || "").trim();
			const when = String(schedule.when || "").trim();
			if (type === "interval") {
				const minutesRaw = Number(when);
				if (!Number.isFinite(minutesRaw)) return null;
				const minutes = Math.max(1, Math.round(minutesRaw));
				if (minutes < 60) return `*/${minutes} * * * *`;
				return `0 */${Math.max(1, Math.round(minutes / 60))} * * *`;
			}
			if (type === "daily") {
				const [hRaw, mRaw] = when.split(":");
				const hourRaw = Number(hRaw);
				const minuteRaw = Number(mRaw);
				if (!Number.isFinite(hourRaw) || !Number.isFinite(minuteRaw)) return null;
				return `${Math.min(59, Math.max(0, Math.floor(minuteRaw)))} ${Math.min(23, Math.max(0, Math.floor(hourRaw)))} * * *`;
			}
			return null;
		}
		/**
		* 从 trigger 节点配置同步触发器到 V3 存储
		* @description V2 schedules 会转换为 V3 cron triggers
		*/
		function syncTriggersAndSchedules(_x, _x2) {
			return _syncTriggersAndSchedules.apply(this, arguments);
		}
		function _syncTriggersAndSchedules() {
			_syncTriggersAndSchedules = _asyncToGenerator(function* (flowId, nodes) {
				const triggersNeeded = [];
				const tnodes = (nodes || []).filter((n) => n && n.type === "trigger");
				for (const n of tnodes) {
					var _cfg$modes, _cfg$url, _cfg$modes2, _cfg$contextMenu, _cfg$modes3, _cfg$command, _cfg$modes4, _cfg$dom, _cfg$modes5;
					const cfg = n.config || {};
					const enabled = cfg.enabled !== false;
					if (((_cfg$modes = cfg.modes) === null || _cfg$modes === void 0 ? void 0 : _cfg$modes.url) && Array.isArray((_cfg$url = cfg.url) === null || _cfg$url === void 0 ? void 0 : _cfg$url.rules) && cfg.url.rules.length) triggersNeeded.push({
						id: trigId(flowId, n.id, "url"),
						kind: "url",
						enabled,
						flowId,
						match: cfg.url.rules
					});
					if (((_cfg$modes2 = cfg.modes) === null || _cfg$modes2 === void 0 ? void 0 : _cfg$modes2.contextMenu) && ((_cfg$contextMenu = cfg.contextMenu) === null || _cfg$contextMenu === void 0 ? void 0 : _cfg$contextMenu.title)) triggersNeeded.push({
						id: trigId(flowId, n.id, "menu"),
						kind: "contextMenu",
						enabled,
						flowId,
						title: cfg.contextMenu.title,
						contexts: (Array.isArray(cfg.contextMenu.contexts) ? cfg.contextMenu.contexts : ["all"]).map(String)
					});
					if (((_cfg$modes3 = cfg.modes) === null || _cfg$modes3 === void 0 ? void 0 : _cfg$modes3.command) && ((_cfg$command = cfg.command) === null || _cfg$command === void 0 ? void 0 : _cfg$command.commandKey)) triggersNeeded.push({
						id: trigId(flowId, n.id, "cmd"),
						kind: "command",
						enabled,
						flowId,
						commandKey: String(cfg.command.commandKey)
					});
					if (((_cfg$modes4 = cfg.modes) === null || _cfg$modes4 === void 0 ? void 0 : _cfg$modes4.dom) && ((_cfg$dom = cfg.dom) === null || _cfg$dom === void 0 ? void 0 : _cfg$dom.selector)) {
						const debounceMsRaw = Number(cfg.dom.debounceMs);
						triggersNeeded.push({
							id: trigId(flowId, n.id, "dom"),
							kind: "dom",
							enabled,
							flowId,
							selector: String(cfg.dom.selector),
							appear: cfg.dom.appear !== false,
							once: cfg.dom.once !== false,
							debounceMs: Number.isFinite(debounceMsRaw) ? debounceMsRaw : 800
						});
					}
					if (((_cfg$modes5 = cfg.modes) === null || _cfg$modes5 === void 0 ? void 0 : _cfg$modes5.schedule) && Array.isArray(cfg.schedules)) cfg.schedules.forEach((s, i) => {
						const cron = scheduleToCron(s);
						if (!cron) {
							const scheduleType = String((s === null || s === void 0 ? void 0 : s.type) || "unknown");
							if (scheduleType === "once") pushToast(`节点 ${n.id} 的定时 #${i + 1}: V3 暂不支持一次性定时（once），已跳过`, "warn");
							else pushToast(`节点 ${n.id} 的定时 #${i + 1}: 无法转换为 cron（type=${scheduleType}），已跳过`, "warn");
							return;
						}
						triggersNeeded.push({
							id: schId(flowId, n.id, i),
							kind: "cron",
							enabled: enabled && (s === null || s === void 0 ? void 0 : s.enabled) !== false,
							flowId,
							cron
						});
					});
				}
				try {
					yield rpc.ensureConnected();
					const existing = yield rpc.request("rr_v3.listTriggers", { flowId });
					const existingById = new Map((existing || []).map((t) => [t.id, t]));
					const neededIds = new Set(triggersNeeded.map((t) => t.id));
					for (const trigger of triggersNeeded) {
						const triggerPayload = trigger;
						if (existingById.has(trigger.id)) yield rpc.request("rr_v3.updateTrigger", { trigger: triggerPayload });
						else yield rpc.request("rr_v3.createTrigger", { trigger: triggerPayload });
					}
					const nodeManagedPrefixes = [`trg_${flowId}_`, `sch_${flowId}_`];
					const isNodeManaged = (triggerId) => nodeManagedPrefixes.some((prefix) => triggerId.startsWith(prefix));
					for (const existing of existingById.values()) if (!neededIds.has(existing.id) && isNodeManaged(existing.id)) yield rpc.request("rr_v3.deleteTrigger", { triggerId: existing.id });
				} catch (e) {
					console.warn("[Builder] Trigger sync failed:", e);
				}
			});
			return _syncTriggersAndSchedules.apply(this, arguments);
		}
		function exportFlow() {
			return _exportFlow.apply(this, arguments);
		}
		function _exportFlow() {
			_exportFlow = _asyncToGenerator(function* () {
				try {
					const saved = yield save();
					if (!saved) return;
					const blob = new Blob([JSON.stringify(saved, null, 2)], { type: "application/json" });
					const url = URL.createObjectURL(blob);
					yield chrome.downloads.download({
						url,
						filename: `${store.flowLocal.name || "flow"}.json`,
						saveAs: true
					});
					URL.revokeObjectURL(url);
				} catch (e) {
					pushToast(`导出失败：${e instanceof Error ? e.message : String(e)}`, "error");
				}
			});
			return _exportFlow.apply(this, arguments);
		}
		function onImport(_x3) {
			return _onImport.apply(this, arguments);
		}
		function _onImport() {
			_onImport = _asyncToGenerator(function* (e) {
				var _input$files;
				const input = e.target;
				const file = (_input$files = input.files) === null || _input$files === void 0 ? void 0 : _input$files[0];
				if (!file) return;
				try {
					const txt = yield file.text();
					const candidates = extractFlowCandidates(JSON.parse(txt));
					if (!candidates.length) {
						pushToast("导入失败：未找到工作流数据", "error");
						return;
					}
					const first = candidates[0];
					if (isFlowV3(first)) {
						yield rpc.ensureConnected();
						const { flow: flowV2, warnings } = flowV3ToV2ForBuilder(yield rpc.request("rr_v3.saveFlow", { flow: first }));
						warnings.forEach((w) => pushToast(w, "warn"));
						store.initFromFlow(flowV2);
						title.value = `编辑：${flowV2.name || flowV2.id}`;
						try {
							yield syncTriggersAndSchedules(flowV2.id, flowV2.nodes || []);
						} catch (_unused7) {}
					} else {
						store.initFromFlow(first);
						if (Array.isArray(first === null || first === void 0 ? void 0 : first.steps) && (!Array.isArray(first === null || first === void 0 ? void 0 : first.nodes) || first.nodes.length === 0)) store.importFromSteps();
						title.value = `编辑：${store.flowLocal.name || store.flowLocal.id}`;
						yield save();
					}
				} catch (e) {
					pushToast(`导入失败：${e instanceof Error ? e.message : String(e)}`, "error");
				} finally {
					input.value = "";
				}
			});
			return _onImport.apply(this, arguments);
		}
		function runFromSelected() {
			return _runFromSelected.apply(this, arguments);
		}
		function _runFromSelected() {
			_runFromSelected = _asyncToGenerator(function* () {
				var _store$flowLocal;
				if (!selectedId.value || !((_store$flowLocal = store.flowLocal) === null || _store$flowLocal === void 0 ? void 0 : _store$flowLocal.id)) return;
				try {
					const saved = yield save();
					if (!saved) return;
					yield rpc.ensureConnected();
					const node = store.nodes.find((n) => n.id === selectedId.value) || null;
					const startNodeId = (node === null || node === void 0 ? void 0 : node.type) === "trigger" ? void 0 : selectedId.value;
					yield rpc.request("rr_v3.enqueueRun", _objectSpread2({ flowId: saved.id }, startNodeId ? { startNodeId } : {}));
				} catch (e) {
					pushToast(`运行失败：${e instanceof Error ? e.message : String(e)}`, "error");
				}
			});
			return _runFromSelected.apply(this, arguments);
		}
		function runAll() {
			return _runAll.apply(this, arguments);
		}
		function _runAll() {
			_runAll = _asyncToGenerator(function* () {
				var _store$flowLocal2;
				if (!((_store$flowLocal2 = store.flowLocal) === null || _store$flowLocal2 === void 0 ? void 0 : _store$flowLocal2.id)) return;
				try {
					const saved = yield save();
					if (!saved) return;
					yield rpc.ensureConnected();
					yield rpc.request("rr_v3.enqueueRun", { flowId: saved.id });
				} catch (e) {
					pushToast(`运行失败：${e instanceof Error ? e.message : String(e)}`, "error");
				}
			});
			return _runAll.apply(this, arguments);
		}
		function onKey(e) {
			var _e$key$toLowerCase, _e$key, _e$key$toLowerCase2, _e$key2, _e$key$toLowerCase3, _e$key3;
			const id = selectedId.value;
			const isMeta = e.metaKey || e.ctrlKey;
			const t = e.target;
			if (t) {
				const tag = (t.tagName || "").toLowerCase();
				if (tag === "input" || tag === "textarea" || tag === "select" || t.isContentEditable || !!t.closest(".floating-property")) return;
			}
			if ((e.key === "Delete" || e.key === "Backspace") && id) {
				e.preventDefault();
				store.removeNode(id);
			} else if (isMeta && ((_e$key$toLowerCase = (_e$key = e.key).toLowerCase) === null || _e$key$toLowerCase === void 0 ? void 0 : _e$key$toLowerCase.call(_e$key)) === "d") {
				if (id) {
					e.preventDefault();
					store.duplicateNode(id);
				}
			} else if (isMeta && ((_e$key$toLowerCase2 = (_e$key2 = e.key).toLowerCase) === null || _e$key$toLowerCase2 === void 0 ? void 0 : _e$key$toLowerCase2.call(_e$key2)) === "z") {
				e.preventDefault();
				if (e.shiftKey) store.redo();
				else store.undo();
			} else if (isMeta && ((_e$key$toLowerCase3 = (_e$key3 = e.key).toLowerCase) === null || _e$key$toLowerCase3 === void 0 ? void 0 : _e$key$toLowerCase3.call(_e$key3)) === "s") {
				e.preventDefault();
				save();
			}
		}
		onMounted(() => {
			document.addEventListener("keydown", onKey);
			bootstrap();
		});
		onUnmounted(() => document.removeEventListener("keydown", onKey));
		const saveState = ref("idle");
		const saveLabel = computed(() => saveState.value === "saving" ? "保存中…" : saveState.value === "saved" ? "已保存" : "");
		let saveTimer = null;
		let statusTimer = null;
		function scheduleAutoSave() {
			if (saveTimer) clearTimeout(saveTimer);
			saveTimer = setTimeout(_asyncToGenerator(function* () {
				try {
					saveState.value = "saving";
					yield new Promise((r) => setTimeout(r, 0));
					if (!(yield save())) {
						saveState.value = "idle";
						return;
					}
					saveState.value = "saved";
					if (statusTimer) clearTimeout(statusTimer);
					statusTimer = setTimeout(() => saveState.value = "idle", 1200);
				} catch (_unused8) {
					saveState.value = "idle";
				}
			}), 800);
		}
		watch(() => [
			store.nodes,
			store.edges,
			store.flowLocal.name,
			store.flowLocal.description
		], scheduleAutoSave, { deep: true });
		const fallbackNotice = ref(null);
		function undoFallbackPromotion() {
			var _node$config2;
			const n = fallbackNotice.value;
			if (!n) return;
			const node = store.nodes.find((x) => x.id === n.nodeId);
			if (!node || node.type !== "click" && node.type !== "fill") {
				fallbackNotice.value = null;
				return;
			}
			const cands = (_node$config2 = node.config) === null || _node$config2 === void 0 || (_node$config2 = _node$config2.target) === null || _node$config2 === void 0 ? void 0 : _node$config2.candidates;
			if (!Array.isArray(cands) || cands.length === 0) {
				fallbackNotice.value = null;
				return;
			}
			const currentIdx = cands.findIndex((c) => c.type === n.type);
			if (currentIdx >= 0 && n.prevIndex >= 0 && n.prevIndex < cands.length) {
				const cand = cands.splice(currentIdx, 1)[0];
				cands.splice(n.prevIndex, 0, cand);
			}
			fallbackNotice.value = null;
		}
		return (_ctx, _cache) => {
			var _unref$flowLocal;
			return openBlock(), createElementBlock(Fragment, null, [createBaseVNode("div", {
				class: "builder-page rr-theme",
				"data-theme": theme.value
			}, [
				fallbackNotice.value ? (openBlock(), createElementBlock("div", _hoisted_2, [createBaseVNode("span", null, "已应用回退建议：提升 " + toDisplayString(fallbackNotice.value.type) + " 优先级", 1), createBaseVNode("button", {
					class: "mini",
					onClick: undoFallbackPromotion
				}, "撤销")])) : createCommentVNode("", true),
				createBaseVNode("div", _hoisted_3, [
					createVNode(Canvas_default, {
						nodes: unref(store).nodes,
						edges: unref(store).edges,
						"node-errors": validation.value.nodeErrors,
						"focus-node-id": focusNodeId.value,
						"fit-seq": fitSeq.value,
						onSelectNode: unref(store).selectNode,
						onSelectEdge: unref(store).selectEdge,
						onDuplicateNode: unref(store).duplicateNode,
						onRemoveNode: unref(store).removeNode,
						onConnectFrom: unref(store).connectFrom,
						onConnect: unref(store).onConnect,
						onNodeDragged: unref(store).setNodePosition,
						onAddNodeAt
					}, null, 8, [
						"nodes",
						"edges",
						"node-errors",
						"focus-node-id",
						"fit-seq",
						"onSelectNode",
						"onSelectEdge",
						"onDuplicateNode",
						"onRemoveNode",
						"onConnectFrom",
						"onConnect",
						"onNodeDragged"
					]),
					createBaseVNode("div", _hoisted_4, [createBaseVNode("div", _hoisted_5, [createBaseVNode("strong", _hoisted_6, toDisplayString(title.value), 1), _cache[8] || (_cache[8] = createBaseVNode("span", { class: "tip" }, "工作流可视化编排", -1))]), createBaseVNode("div", _hoisted_7, [
						createBaseVNode("button", {
							class: "top-btn",
							onClick: exportFlow,
							title: "导出 JSON"
						}, [..._cache[9] || (_cache[9] = [createBaseVNode("svg", {
							width: "14",
							height: "14",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "2"
						}, [createBaseVNode("path", { d: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" })], -1), createTextVNode(" 导出 ", -1)])]),
						createBaseVNode("label", _hoisted_8, [
							_cache[10] || (_cache[10] = createBaseVNode("svg", {
								width: "14",
								height: "14",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								"stroke-width": "2"
							}, [createBaseVNode("path", { d: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" })], -1)),
							_cache[11] || (_cache[11] = createTextVNode(" 导入 ", -1)),
							createBaseVNode("input", {
								type: "file",
								accept: "application/json",
								onChange: onImport
							}, null, 32)
						]),
						createBaseVNode("button", {
							class: "top-btn",
							onClick: openRename,
							title: "重命名工作流"
						}, [..._cache[12] || (_cache[12] = [createBaseVNode("svg", {
							width: "14",
							height: "14",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "2"
						}, [createBaseVNode("path", { d: "M12 20h9" }), createBaseVNode("path", { d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" })], -1), createTextVNode(" Rename ", -1)])]),
						createBaseVNode("button", {
							class: normalizeClass(["top-btn", { active: triggerPanelVisible.value }]),
							onClick: _cache[0] || (_cache[0] = ($event) => triggerPanelVisible.value = !triggerPanelVisible.value),
							title: "管理触发器"
						}, [..._cache[13] || (_cache[13] = [createBaseVNode("svg", {
							width: "14",
							height: "14",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "2"
						}, [createBaseVNode("path", { d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" })], -1), createTextVNode(" Triggers ", -1)])], 2),
						_cache[17] || (_cache[17] = createBaseVNode("span", { class: "divider-vert" }, null, -1)),
						createBaseVNode("button", {
							class: "top-btn",
							disabled: !selectedId.value,
							onClick: runFromSelected,
							title: "从选中节点回放"
						}, [..._cache[14] || (_cache[14] = [createBaseVNode("svg", {
							width: "14",
							height: "14",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "2"
						}, [createBaseVNode("polygon", { points: "5 3 19 12 5 21 5 3" })], -1), createTextVNode(" 从选中运行 ", -1)])], 8, _hoisted_9),
						createBaseVNode("button", {
							class: "top-btn primary",
							onClick: runAll,
							title: "从头回放整流"
						}, [..._cache[15] || (_cache[15] = [createBaseVNode("svg", {
							width: "14",
							height: "14",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "2"
						}, [createBaseVNode("polygon", { points: "5 3 19 12 5 21 5 3" })], -1), createTextVNode(" 运行 ", -1)])]),
						_cache[18] || (_cache[18] = createBaseVNode("span", { class: "divider-vert" }, null, -1)),
						createBaseVNode("span", {
							class: "status",
							"data-state": saveState.value
						}, toDisplayString(saveLabel.value), 9, _hoisted_10),
						createBaseVNode("button", {
							class: "top-btn success",
							onClick: save
						}, [..._cache[16] || (_cache[16] = [createBaseVNode("svg", {
							width: "14",
							height: "14",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "2"
						}, [
							createBaseVNode("path", { d: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" }),
							createBaseVNode("polyline", { points: "17 21 17 13 7 13 7 21" }),
							createBaseVNode("polyline", { points: "7 3 7 8 15 8" })
						], -1), createTextVNode(" 保存 ", -1)])])
					])]),
					createVNode(Sidebar_default, {
						class: "floating-sidebar",
						flow: unref(store).flowLocal,
						"palette-types": unref(store).paletteTypes,
						"subflow-ids": unref(store).listSubflowIds(),
						"current-subflow-id": currentSubflowIdVal.value,
						onAddNode: unref(store).addNode,
						onSwitchMain: unref(store).switchToMain,
						onSwitchSubflow: unref(store).switchToSubflow,
						onAddSubflow: unref(store).addSubflow,
						onRemoveSubflow: unref(store).removeSubflow
					}, null, 8, [
						"flow",
						"palette-types",
						"subflow-ids",
						"current-subflow-id",
						"onAddNode",
						"onSwitchMain",
						"onSwitchSubflow",
						"onAddSubflow",
						"onRemoveSubflow"
					]),
					activeNode.value ? (openBlock(), createBlock(PropertyPanel_default, {
						key: 0,
						class: "floating-property",
						node: activeNode.value,
						variables: availableVars.value,
						"highlight-field": highlightField.value,
						"subflow-ids": unref(store).listSubflowIds(),
						onRemoveNode: unref(store).removeNode,
						onCreateSubflow: unref(store).addSubflow,
						onSwitchToSubflow: unref(store).switchToSubflow
					}, null, 8, [
						"node",
						"variables",
						"highlight-field",
						"subflow-ids",
						"onRemoveNode",
						"onCreateSubflow",
						"onSwitchToSubflow"
					])) : activeEdge.value ? (openBlock(), createBlock(EdgePropertyPanel_default, {
						key: 1,
						class: "floating-property",
						edge: activeEdge.value,
						nodes: unref(store).nodes,
						onRemoveEdge: unref(store).removeEdge
					}, null, 8, [
						"edge",
						"nodes",
						"onRemoveEdge"
					])) : createCommentVNode("", true),
					triggerPanelVisible.value && ((_unref$flowLocal = unref(store).flowLocal) === null || _unref$flowLocal === void 0 ? void 0 : _unref$flowLocal.id) ? (openBlock(), createBlock(TriggerPanel_default, {
						key: 2,
						class: "floating-trigger",
						"flow-id": unref(store).flowLocal.id,
						onClose: _cache[1] || (_cache[1] = ($event) => triggerPanelVisible.value = false)
					}, null, 8, ["flow-id"])) : createCommentVNode("", true),
					createBaseVNode("div", _hoisted_11, [
						createBaseVNode("button", {
							class: "toolbar-btn",
							onClick: _cache[2] || (_cache[2] = (...args) => unref(store).undo && unref(store).undo(...args)),
							title: "撤销 (⌘/Ctrl+Z)"
						}, [..._cache[19] || (_cache[19] = [createBaseVNode("svg", {
							width: "16",
							height: "16",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "2"
						}, [createBaseVNode("path", { d: "M3 7v6h6M21 17a9 9 0 00-9-9 9 9 0 00-9 9" })], -1)])]),
						createBaseVNode("button", {
							class: "toolbar-btn",
							onClick: _cache[3] || (_cache[3] = (...args) => unref(store).redo && unref(store).redo(...args)),
							title: "重做 (⌘/Ctrl+Shift+Z)"
						}, [..._cache[20] || (_cache[20] = [createBaseVNode("svg", {
							width: "16",
							height: "16",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "2"
						}, [createBaseVNode("path", { d: "M21 7v6h-6M3 17a9 9 0 019-9 9 9 0 019 9" })], -1)])]),
						_cache[23] || (_cache[23] = createBaseVNode("span", { class: "toolbar-divider" }, null, -1)),
						createBaseVNode("button", {
							class: "toolbar-btn",
							onClick: _cache[4] || (_cache[4] = (...args) => unref(store).layoutAuto && unref(store).layoutAuto(...args)),
							title: "自动排版"
						}, [..._cache[21] || (_cache[21] = [createStaticVNode("<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" data-v-c6f14693><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\" data-v-c6f14693></rect><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\" data-v-c6f14693></rect><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\" data-v-c6f14693></rect><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\" data-v-c6f14693></rect></svg>", 1)])]),
						createBaseVNode("button", {
							class: "toolbar-btn",
							onClick: fitAll,
							title: "自适应视图"
						}, [..._cache[22] || (_cache[22] = [createBaseVNode("svg", {
							width: "16",
							height: "16",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "2"
						}, [createBaseVNode("path", { d: "M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" })], -1)])])
					])
				]),
				createBaseVNode("div", _hoisted_12, [(openBlock(true), createElementBlock(Fragment, null, renderList(toasts.value, (t) => {
					return openBlock(), createElementBlock("div", {
						key: t.id,
						class: "rr-toast",
						"data-level": t.level
					}, toDisplayString(t.message), 9, _hoisted_13);
				}), 128))])
			], 8, _hoisted_1), renameVisible.value ? (openBlock(), createElementBlock("div", _hoisted_14, [createBaseVNode("div", _hoisted_15, [
				createBaseVNode("div", _hoisted_16, [_cache[24] || (_cache[24] = createBaseVNode("div", { class: "title" }, "重命名工作流", -1)), createBaseVNode("button", {
					class: "close",
					onClick: _cache[5] || (_cache[5] = ($event) => renameVisible.value = false)
				}, "✕")]),
				createBaseVNode("div", _hoisted_17, [createBaseVNode("div", _hoisted_18, [_cache[25] || (_cache[25] = createBaseVNode("label", null, "名称", -1)), withDirectives(createBaseVNode("input", {
					"onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => renameName.value = $event),
					placeholder: "工作流名称"
				}, null, 512), [[vModelText, renameName.value]])]), createBaseVNode("div", _hoisted_19, [_cache[26] || (_cache[26] = createBaseVNode("label", null, "描述", -1)), withDirectives(createBaseVNode("textarea", {
					"onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => renameDesc.value = $event),
					placeholder: "可选描述"
				}, null, 512), [[vModelText, renameDesc.value]])])]),
				createBaseVNode("div", { class: "rr-footer" }, [createBaseVNode("button", {
					class: "primary",
					onClick: applyRename
				}, "保存")])
			])])) : createCommentVNode("", true)], 64);
		};
	}
}), [["__scopeId", "data-v-c6f14693"]])).mount("#app");
//#endregion
