import { n as init_asyncToGenerator, t as _asyncToGenerator } from "./asyncToGenerator-HxMCLN5T.js";
import { F as renderList, N as openBlock, S as defineComponent, ct as normalizeStyle, g as createElementBlock, lt as toDisplayString, ot as unref, p as createBaseVNode, r as createApp, t as _plugin_vue_export_helper_default, tt as ref, u as Fragment, v as createStaticVNode, y as createTextVNode } from "./_plugin-vue_export-helper-DCRN0gge.js";
/* empty css                  */
import { t as LINKS } from "./constants-DKwl8_Kl.js";
import "./build-flags-F4RJxw2u.js";
//#region entrypoints/welcome/App.vue?vue&type=script&setup=true&lang.ts
init_asyncToGenerator();
var _hoisted_1 = { class: "agent-theme welcome-root" };
var _hoisted_2 = { class: "min-h-screen flex flex-col" };
var _hoisted_3 = { class: "welcome-header flex-none px-6 py-5" };
var _hoisted_4 = { class: "max-w-3xl mx-auto flex items-center justify-between gap-4" };
var _hoisted_5 = { class: "flex items-center gap-3 min-w-0" };
var _hoisted_6 = {
	class: "welcome-icon w-10 h-10 flex items-center justify-center flex-shrink-0",
	"aria-hidden": "true"
};
var _hoisted_7 = {
	class: "w-6 h-6",
	style: { color: "var(--ac-accent)" },
	fill: "none",
	viewBox: "0 0 24 24",
	stroke: "currentColor"
};
var _hoisted_8 = { class: "min-w-0" };
var _hoisted_9 = { class: "welcome-title text-lg font-medium tracking-tight truncate" };
var _hoisted_10 = { class: "welcome-muted text-sm truncate" };
var _hoisted_11 = {
	key: 0,
	class: "flex-1 px-6 py-8"
};
var _hoisted_12 = {
	key: 1,
	class: "flex-1 px-6 py-8"
};
var _hoisted_13 = { class: "max-w-3xl mx-auto space-y-6" };
var _hoisted_14 = { class: "welcome-card welcome-card--primary p-6" };
var _hoisted_15 = { class: "mt-4 space-y-3" };
var _hoisted_16 = { class: "welcome-command-row flex items-center justify-between gap-3 px-4 py-3" };
var _hoisted_17 = { class: "welcome-code text-sm break-all" };
var _hoisted_18 = { class: "grid sm:grid-cols-2 gap-3" };
var _hoisted_19 = { class: "min-w-0" };
var _hoisted_20 = { class: "welcome-mono welcome-subtle text-[10px] uppercase tracking-widest font-medium" };
var _hoisted_21 = { class: "welcome-code text-xs break-all" };
var _hoisted_22 = ["onClick"];
var _hoisted_23 = {
	class: "mt-6 pt-5",
	style: { borderTop: "var(--ac-border-width) solid var(--ac-border)" }
};
var _hoisted_24 = { class: "welcome-command-row mt-3 flex items-center justify-between gap-3 px-4 py-3" };
var _hoisted_25 = { class: "welcome-code text-sm break-all" };
var _hoisted_26 = { class: "welcome-card overflow-hidden" };
var _hoisted_27 = { class: "px-6 pb-6 space-y-4" };
var _hoisted_28 = { class: "welcome-alt-row p-4" };
var _hoisted_29 = { class: "mt-3 space-y-2" };
var _hoisted_30 = { class: "min-w-0" };
var _hoisted_31 = { class: "welcome-mono welcome-subtle text-[10px] uppercase tracking-widest font-medium" };
var _hoisted_32 = { class: "welcome-code text-xs break-all" };
var _hoisted_33 = ["onClick"];
var _hoisted_34 = { class: "welcome-report-card p-4" };
var _hoisted_35 = { class: "welcome-command-row mt-3 flex items-center justify-between gap-3 px-3 py-2" };
var _hoisted_36 = { class: "welcome-code text-xs break-all" };
//#endregion
//#region entrypoints/welcome/main.ts
createApp(/* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "App",
	setup(__props) {
		function openDocs() {
			return _openDocs.apply(this, arguments);
		}
		function _openDocs() {
			_openDocs = _asyncToGenerator(function* () {
				try {
					yield chrome.tabs.create({ url: LINKS.TROUBLESHOOTING });
				} catch (_unused) {
					window.open(LINKS.TROUBLESHOOTING, "_blank", "noopener,noreferrer");
				}
			});
			return _openDocs.apply(this, arguments);
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("header", _hoisted_3, [createBaseVNode("div", _hoisted_4, [createBaseVNode("div", _hoisted_5, [createBaseVNode("div", _hoisted_6, [(openBlock(), createElementBlock("svg", _hoisted_7, [..._cache[3] || (_cache[3] = [createBaseVNode("path", {
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				"stroke-width": "2",
				d: "M13 10V3L4 14h7v7l9-11h-7z"
			}, null, -1)])]))]), createBaseVNode("div", _hoisted_8, [createBaseVNode("h1", _hoisted_9, "Scalemax Official"), createBaseVNode("p", _hoisted_10, "Browser-only AI agent — no install, no PC. Just add your LLM.")])]), createBaseVNode("button", {
				class: "welcome-button px-3 py-2 text-xs font-medium ac-btn flex-shrink-0",
				onClick: openDocs
			}, " Documentation ")])]), createBaseVNode("main", _hoisted_11, [..._cache[4] || (_cache[4] = [createStaticVNode("<div class=\"max-w-3xl mx-auto space-y-6\" data-v-d7159d98><section class=\"welcome-card welcome-card--primary p-6\" data-v-d7159d98><h2 class=\"welcome-title text-xl font-medium\" data-v-d7159d98>Get started — 3 steps</h2><ol class=\"welcome-muted text-sm mt-4 space-y-3 list-decimal pl-5\" data-v-d7159d98><li data-v-d7159d98> Open the extension popup → <strong data-v-d7159d98>Management → AI Provider</strong>. Enter your OpenAI-compatible <strong data-v-d7159d98>Base URL</strong> and <strong data-v-d7159d98>API key</strong>, click <strong data-v-d7159d98>Load Models</strong>, pick one, and <strong data-v-d7159d98>Save</strong>. </li><li data-v-d7159d98> Open the Chrome <strong data-v-d7159d98>side panel</strong> (or popup → Management → <strong data-v-d7159d98>Agent Chat</strong>). It opens the <strong data-v-d7159d98>Browser Agent</strong>. </li><li data-v-d7159d98>Hit <strong data-v-d7159d98>＋New</strong>, type a task, and the agent works in one browser tab.</li></ol><p class=\"welcome-muted text-sm mt-4\" data-v-d7159d98> Everything runs inside the browser on your own LLM — no install, no native host, no PC. Nothing to run in a terminal. </p><p class=\"welcome-muted text-sm mt-2\" data-v-d7159d98> High-risk actions, such as running scripts in a page or sending requests with your cookies, wait for your approval in a small Scalemax window first. </p></section></div>", 1)])])])]);
		};
	}
}), [["__scopeId", "data-v-d7159d98"]])).mount("#app");
//#endregion
