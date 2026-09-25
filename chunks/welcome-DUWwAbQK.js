import { n as init_asyncToGenerator, t as _asyncToGenerator } from "./asyncToGenerator-HxMCLN5T.js";
import { F as renderList, N as openBlock, S as defineComponent, ct as normalizeStyle, g as createElementBlock, lt as toDisplayString, ot as unref, p as createBaseVNode, r as createApp, t as _plugin_vue_export_helper_default, tt as ref, u as Fragment, v as createStaticVNode, y as createTextVNode } from "./_plugin-vue_export-helper-DCRN0gge.js";
/* empty css                  */
import { n as NATIVE_HOST, t as LINKS } from "./constants-DKwl8_Kl.js";
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
		const scalemaxOnly = true;
		const COMMANDS = {
			npmInstall: "npm install -g mcp-chrome-bridge",
			pnpmInstall: "pnpm add -g mcp-chrome-bridge",
			yarnInstall: "yarn global add mcp-chrome-bridge",
			mcpUrl: "http://127.0.0.1:" + NATIVE_HOST.DEFAULT_PORT + "/mcp",
			doctor: "mcp-chrome-bridge doctor",
			fix: "mcp-chrome-bridge doctor --fix",
			report: "mcp-chrome-bridge report --copy"
		};
		const copiedKey = ref(null);
		const ALT_INSTALL = [{
			label: "pnpm",
			key: "pnpmInstall"
		}, {
			label: "yarn",
			key: "yarnInstall"
		}];
		const DIAGNOSTICS = [{
			label: "Doctor",
			key: "doctor"
		}, {
			label: "Auto-fix",
			key: "fix"
		}];
		function copyLabel(key) {
			return copiedKey.value === key ? "Copied" : "Copy";
		}
		function copyColor(key) {
			return copiedKey.value === key ? "var(--ac-success)" : "var(--ac-text-muted)";
		}
		function copyCommand(_x) {
			return _copyCommand.apply(this, arguments);
		}
		function _copyCommand() {
			_copyCommand = _asyncToGenerator(function* (key) {
				try {
					yield navigator.clipboard.writeText(COMMANDS[key]);
					copiedKey.value = key;
					window.setTimeout(() => {
						if (copiedKey.value === key) copiedKey.value = null;
					}, 2e3);
				} catch (err) {
					console.error("Failed to copy:", err);
					copiedKey.value = null;
				}
			});
			return _copyCommand.apply(this, arguments);
		}
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
			}, null, -1)])]))]), createBaseVNode("div", _hoisted_8, [createBaseVNode("h1", _hoisted_9, toDisplayString(unref(scalemaxOnly) ? "Scalemax Official" : "Chrome MCP Server"), 1), createBaseVNode("p", _hoisted_10, toDisplayString(unref(scalemaxOnly) ? "Browser-only AI agent — no install, no PC. Just add your LLM." : "After the extension is installed, this is the only required step."), 1)])]), createBaseVNode("button", {
				class: "welcome-button px-3 py-2 text-xs font-medium ac-btn flex-shrink-0",
				onClick: openDocs
			}, " Troubleshooting Docs ")])]), unref(scalemaxOnly) ? (openBlock(), createElementBlock("main", _hoisted_11, [..._cache[4] || (_cache[4] = [createStaticVNode("<div class=\"max-w-3xl mx-auto space-y-6\" data-v-d7159d98><section class=\"welcome-card welcome-card--primary p-6\" data-v-d7159d98><h2 class=\"welcome-title text-xl font-medium\" data-v-d7159d98>Get started — 3 steps</h2><ol class=\"welcome-muted text-sm mt-4 space-y-3 list-decimal pl-5\" data-v-d7159d98><li data-v-d7159d98> Open the extension popup → <strong data-v-d7159d98>Management → AI Provider</strong>. Enter your OpenAI-compatible <strong data-v-d7159d98>Base URL</strong> and <strong data-v-d7159d98>API key</strong>, click <strong data-v-d7159d98>Load Models</strong>, pick one, and <strong data-v-d7159d98>Save</strong>. </li><li data-v-d7159d98> Open the Chrome <strong data-v-d7159d98>side panel</strong> (or popup → Management → <strong data-v-d7159d98>Agent Chat</strong>). It opens the <strong data-v-d7159d98>Browser Agent</strong>. </li><li data-v-d7159d98>Hit <strong data-v-d7159d98>＋New</strong>, type a task, and the agent works in one browser tab.</li></ol><p class=\"welcome-muted text-sm mt-4\" data-v-d7159d98> Everything runs inside the browser on your own LLM — no install, no native host, no PC. Nothing to run in a terminal. </p></section></div>", 1)])])) : (openBlock(), createElementBlock("main", _hoisted_12, [createBaseVNode("div", _hoisted_13, [createBaseVNode("section", _hoisted_14, [
				_cache[9] || (_cache[9] = createBaseVNode("h2", { class: "welcome-title text-xl font-medium" }, [createTextVNode(" Install "), createBaseVNode("code", { class: "welcome-code" }, "mcp-chrome-bridge")], -1)),
				_cache[10] || (_cache[10] = createBaseVNode("p", { class: "welcome-muted text-sm mt-2" }, " The Chrome extension uses this local bridge to expose MCP tools to your client. ", -1)),
				createBaseVNode("div", _hoisted_15, [
					createBaseVNode("div", _hoisted_16, [createBaseVNode("code", _hoisted_17, toDisplayString(COMMANDS.npmInstall), 1), createBaseVNode("button", {
						class: "welcome-mono px-2 py-1 text-xs font-medium ac-btn flex-shrink-0",
						style: normalizeStyle({ color: copyColor("npmInstall") }),
						onClick: _cache[0] || (_cache[0] = ($event) => copyCommand("npmInstall"))
					}, toDisplayString(copyLabel("npmInstall")), 5)]),
					createBaseVNode("div", _hoisted_18, [(openBlock(), createElementBlock(Fragment, null, renderList(ALT_INSTALL, (item) => {
						return createBaseVNode("div", {
							key: item.key,
							class: "welcome-alt-row flex items-center justify-between gap-3 px-4 py-3"
						}, [createBaseVNode("div", _hoisted_19, [createBaseVNode("div", _hoisted_20, toDisplayString(item.label), 1), createBaseVNode("code", _hoisted_21, toDisplayString(COMMANDS[item.key]), 1)]), createBaseVNode("button", {
							class: "welcome-mono px-2 py-1 text-xs font-medium ac-btn flex-shrink-0",
							style: normalizeStyle({ color: copyColor(item.key) }),
							onClick: ($event) => copyCommand(item.key)
						}, toDisplayString(copyLabel(item.key)), 13, _hoisted_22)]);
					}), 64))]),
					_cache[5] || (_cache[5] = createBaseVNode("div", { class: "welcome-alt-row welcome-muted px-4 py-3 text-xs" }, [
						createTextVNode(" Requires Node.js 20+. Check your version with "),
						createBaseVNode("code", { class: "welcome-code welcome-code-inline px-1 py-0.5" }, "node -v"),
						createTextVNode(". ")
					], -1))
				]),
				createBaseVNode("div", _hoisted_23, [
					_cache[6] || (_cache[6] = createBaseVNode("h3", { class: "welcome-title text-sm font-medium" }, "MCP client URL (streamable HTTP)", -1)),
					_cache[7] || (_cache[7] = createBaseVNode("p", { class: "welcome-muted text-sm mt-1" }, " Use this URL in your MCP client (e.g., Claude Desktop, CherryStudio). ", -1)),
					createBaseVNode("div", _hoisted_24, [createBaseVNode("code", _hoisted_25, toDisplayString(COMMANDS.mcpUrl), 1), createBaseVNode("button", {
						class: "welcome-mono px-2 py-1 text-xs font-medium ac-btn flex-shrink-0",
						style: normalizeStyle({ color: copyColor("mcpUrl") }),
						onClick: _cache[1] || (_cache[1] = ($event) => copyCommand("mcpUrl"))
					}, toDisplayString(copyLabel("mcpUrl")), 5)]),
					_cache[8] || (_cache[8] = createBaseVNode("p", { class: "welcome-subtle text-xs mt-3" }, " Tip: You can also open the extension popup and click \"Connect\" to copy a full client config snippet. ", -1))
				])
			]), createBaseVNode("details", _hoisted_26, [_cache[16] || (_cache[16] = createStaticVNode("<summary class=\"px-6 py-4 cursor-pointer select-none flex items-center justify-between gap-4\" data-v-d7159d98><div class=\"min-w-0\" data-v-d7159d98><div class=\"welcome-title text-sm font-medium\" data-v-d7159d98>Troubleshooting</div><div class=\"welcome-muted text-xs truncate\" data-v-d7159d98> Use these only if the bridge fails to register or connect. </div></div><span class=\"welcome-mono welcome-subtle text-xs flex-shrink-0\" data-v-d7159d98>doctor · report</span></summary>", 1)), createBaseVNode("div", _hoisted_27, [
				createBaseVNode("div", _hoisted_28, [
					_cache[11] || (_cache[11] = createBaseVNode("div", { class: "text-sm font-medium" }, "Diagnostics", -1)),
					_cache[12] || (_cache[12] = createBaseVNode("p", { class: "welcome-muted text-sm mt-1" }, [
						createTextVNode(" Run "),
						createBaseVNode("code", { class: "welcome-code" }, "doctor"),
						createTextVNode(" to check installation status. If it reports an error, run the auto-fix command. ")
					], -1)),
					createBaseVNode("div", _hoisted_29, [(openBlock(), createElementBlock(Fragment, null, renderList(DIAGNOSTICS, (item) => {
						return createBaseVNode("div", {
							key: item.key,
							class: "welcome-command-row flex items-center justify-between gap-3 px-3 py-2"
						}, [createBaseVNode("div", _hoisted_30, [createBaseVNode("div", _hoisted_31, toDisplayString(item.label), 1), createBaseVNode("code", _hoisted_32, toDisplayString(COMMANDS[item.key]), 1)]), createBaseVNode("button", {
							class: "welcome-mono px-2 py-1 text-xs font-medium ac-btn flex-shrink-0",
							style: normalizeStyle({ color: copyColor(item.key) }),
							onClick: ($event) => copyCommand(item.key)
						}, toDisplayString(copyLabel(item.key)), 13, _hoisted_33)]);
					}), 64))])
				]),
				createBaseVNode("div", _hoisted_34, [
					_cache[13] || (_cache[13] = createBaseVNode("div", {
						class: "text-sm font-medium",
						style: { color: "var(--ac-danger)" }
					}, " Report an issue ", -1)),
					_cache[14] || (_cache[14] = createBaseVNode("p", { class: "welcome-muted text-sm mt-1" }, " Generate a diagnostic report and paste it into a GitHub issue. ", -1)),
					createBaseVNode("div", _hoisted_35, [createBaseVNode("code", _hoisted_36, toDisplayString(COMMANDS.report), 1), createBaseVNode("button", {
						class: "welcome-mono px-2 py-1 text-xs font-medium ac-btn flex-shrink-0",
						style: normalizeStyle({ color: copyColor("report") }),
						onClick: _cache[2] || (_cache[2] = ($event) => copyCommand("report"))
					}, toDisplayString(copyLabel("report")), 5)]),
					_cache[15] || (_cache[15] = createBaseVNode("p", { class: "welcome-subtle text-xs mt-2" }, " This copies the report to your clipboard (sensitive info is automatically redacted). ", -1))
				]),
				createBaseVNode("div", { class: "flex" }, [createBaseVNode("button", {
					class: "welcome-button px-3 py-2 text-xs font-medium ac-btn",
					onClick: openDocs
				}, " Open troubleshooting docs ")])
			])])])]))])]);
		};
	}
}), [["__scopeId", "data-v-d7159d98"]])).mount("#app");
//#endregion
