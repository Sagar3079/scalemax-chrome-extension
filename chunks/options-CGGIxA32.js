import { n as init_asyncToGenerator, t as _asyncToGenerator } from "./asyncToGenerator-HxMCLN5T.js";
import { F as renderList, G as withDirectives, N as openBlock, S as defineComponent, a as vModelSelect, g as createElementBlock, h as createCommentVNode, i as vModelCheckbox, j as onMounted, lt as toDisplayString, o as vModelText, p as createBaseVNode, r as createApp, t as _plugin_vue_export_helper_default, tt as ref, u as Fragment, y as createTextVNode } from "./_plugin-vue_export-helper-DCRN0gge.js";
import { t as _objectSpread2 } from "./objectSpread2-YiwCHUSe.js";
import { i as TOOL_NAMES } from "./dist-piJEahpX.js";
import { r as STORAGE_KEYS } from "./constants-DKwl8_Kl.js";
//#region entrypoints/options/App.vue?vue&type=script&setup=true&lang.ts
init_asyncToGenerator();
var _hoisted_1 = { class: "page" };
var _hoisted_2 = { class: "topbar" };
var _hoisted_3 = { class: "switch" };
var _hoisted_4 = { class: "create" };
var _hoisted_5 = { class: "grid" };
var _hoisted_6 = ["placeholder"];
var _hoisted_7 = { value: "auto" };
var _hoisted_8 = { value: "document_start" };
var _hoisted_9 = { value: "document_end" };
var _hoisted_10 = { value: "document_idle" };
var _hoisted_11 = { value: "auto" };
var _hoisted_12 = { value: "ISOLATED" };
var _hoisted_13 = { value: "MAIN" };
var _hoisted_14 = { value: "auto" };
var _hoisted_15 = { value: "persistent" };
var _hoisted_16 = { value: "css" };
var _hoisted_17 = { value: "once" };
var _hoisted_18 = ["placeholder"];
var _hoisted_19 = ["placeholder"];
var _hoisted_20 = ["placeholder"];
var _hoisted_21 = ["placeholder"];
var _hoisted_22 = { class: "row" };
var _hoisted_23 = ["disabled"];
var _hoisted_24 = ["disabled"];
var _hoisted_25 = {
	key: 0,
	class: "hint"
};
var _hoisted_26 = { class: "filters" };
var _hoisted_27 = { class: "grid" };
var _hoisted_28 = { value: "" };
var _hoisted_29 = { value: "enabled" };
var _hoisted_30 = { value: "disabled" };
var _hoisted_31 = ["placeholder"];
var _hoisted_32 = { class: "row" };
var _hoisted_33 = { class: "table" };
var _hoisted_34 = ["checked", "onChange"];
var _hoisted_35 = { class: "actions" };
var _hoisted_36 = ["onClick"];
//#endregion
//#region entrypoints/options/main.ts
createApp(/* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "App",
	setup(__props) {
		const emergencyDisabled = ref(false);
		const items = ref([]);
		const filters = ref({
			query: "",
			status: "",
			domain: ""
		});
		const form = ref({
			name: "",
			runAt: "auto",
			world: "auto",
			mode: "auto",
			allFrames: true,
			persist: true,
			dnrFallback: true,
			script: "",
			matches: "",
			excludes: "",
			tags: ""
		});
		const submitting = ref(false);
		const lastResult = ref("");
		function formatTime(ts) {
			if (!ts) return "";
			try {
				return new Date(ts).toLocaleString();
			} catch (_unused) {
				return String(ts);
			}
		}
		function saveEmergency() {
			return _saveEmergency.apply(this, arguments);
		}
		function _saveEmergency() {
			_saveEmergency = _asyncToGenerator(function* () {
				var _globalThis$chrome;
				yield (_globalThis$chrome = globalThis.chrome) === null || _globalThis$chrome === void 0 || (_globalThis$chrome = _globalThis$chrome.storage) === null || _globalThis$chrome === void 0 ? void 0 : _globalThis$chrome.local.set({ [STORAGE_KEYS.USERSCRIPTS_DISABLED]: emergencyDisabled.value });
			});
			return _saveEmergency.apply(this, arguments);
		}
		function loadEmergency() {
			return _loadEmergency.apply(this, arguments);
		}
		function _loadEmergency() {
			_loadEmergency = _asyncToGenerator(function* () {
				var _globalThis$chrome2;
				const v = yield (_globalThis$chrome2 = globalThis.chrome) === null || _globalThis$chrome2 === void 0 || (_globalThis$chrome2 = _globalThis$chrome2.storage) === null || _globalThis$chrome2 === void 0 ? void 0 : _globalThis$chrome2.local.get([STORAGE_KEYS.USERSCRIPTS_DISABLED]);
				emergencyDisabled.value = !!v[STORAGE_KEYS.USERSCRIPTS_DISABLED];
			});
			return _loadEmergency.apply(this, arguments);
		}
		function callTool(_x, _x2) {
			return _callTool.apply(this, arguments);
		}
		function _callTool() {
			_callTool = _asyncToGenerator(function* (name, args) {
				var _globalThis$chrome3;
				const res = yield (_globalThis$chrome3 = globalThis.chrome) === null || _globalThis$chrome3 === void 0 || (_globalThis$chrome3 = _globalThis$chrome3.runtime) === null || _globalThis$chrome3 === void 0 ? void 0 : _globalThis$chrome3.sendMessage({
					type: "call_tool",
					name,
					args
				});
				if (!res || !res.success) throw new Error((res === null || res === void 0 ? void 0 : res.error) || "call failed");
				return res.result;
			});
			return _callTool.apply(this, arguments);
		}
		function reload() {
			return _reload.apply(this, arguments);
		}
		function _reload() {
			_reload = _asyncToGenerator(function* () {
				const result = yield callTool(TOOL_NAMES.BROWSER.USERSCRIPT, {
					action: "list",
					args: _objectSpread2({}, filters.value)
				});
				try {
					var _result$content;
					const txt = (result === null || result === void 0 || (_result$content = result.content) === null || _result$content === void 0 || (_result$content = _result$content[0]) === null || _result$content === void 0 ? void 0 : _result$content.text) || "{}";
					const data = JSON.parse(txt);
					items.value = data.items || [];
				} catch (e) {
					console.warn("parse list failed", e);
				}
			});
			return _reload.apply(this, arguments);
		}
		function apply(_x3) {
			return _apply.apply(this, arguments);
		}
		function _apply() {
			_apply = _asyncToGenerator(function* (mode) {
				if (!form.value.script.trim()) return;
				submitting.value = true;
				lastResult.value = "";
				try {
					var _result$content2;
					const args = {
						script: form.value.script,
						name: form.value.name || void 0,
						runAt: form.value.runAt,
						world: form.value.world,
						allFrames: !!form.value.allFrames,
						persist: !!form.value.persist,
						dnrFallback: !!form.value.dnrFallback,
						mode
					};
					if (form.value.matches.trim()) args.matches = form.value.matches.split(",").map((s) => s.trim());
					if (form.value.excludes.trim()) args.excludes = form.value.excludes.split(",").map((s) => s.trim());
					if (form.value.tags.trim()) args.tags = form.value.tags.split(",").map((s) => s.trim());
					const result = yield callTool(TOOL_NAMES.BROWSER.USERSCRIPT, {
						action: "create",
						args
					});
					lastResult.value = (result === null || result === void 0 || (_result$content2 = result.content) === null || _result$content2 === void 0 || (_result$content2 = _result$content2[0]) === null || _result$content2 === void 0 ? void 0 : _result$content2.text) || "";
					yield reload();
				} catch (e) {
					lastResult.value = "Error: " + ((e === null || e === void 0 ? void 0 : e.message) || String(e));
				} finally {
					submitting.value = false;
				}
			});
			return _apply.apply(this, arguments);
		}
		function toggle(_x4) {
			return _toggle.apply(this, arguments);
		}
		function _toggle() {
			_toggle = _asyncToGenerator(function* (it) {
				try {
					yield callTool(TOOL_NAMES.BROWSER.USERSCRIPT, {
						action: it.status === "enabled" ? "disable" : "enable",
						args: { id: it.id }
					});
					yield reload();
				} catch (e) {
					console.warn("toggle failed", e);
				}
			});
			return _toggle.apply(this, arguments);
		}
		function remove(_x5) {
			return _remove.apply(this, arguments);
		}
		function _remove() {
			_remove = _asyncToGenerator(function* (it) {
				const label = (it && (it.name || it.id)) || "this userscript";
				if (!confirm(`Delete "${label}"? This permanently removes the script and cannot be undone.`)) return;
				try {
					yield callTool(TOOL_NAMES.BROWSER.USERSCRIPT, {
						action: "remove",
						args: { id: it.id }
					});
					yield reload();
				} catch (e) {
					console.warn("remove failed", e);
				}
			});
			return _remove.apply(this, arguments);
		}
		function exportAll() {
			return _exportAll.apply(this, arguments);
		}
		function _exportAll() {
			_exportAll = _asyncToGenerator(function* () {
				try {
					var _res$content, _globalThis$chrome4;
					const res = yield callTool(TOOL_NAMES.BROWSER.USERSCRIPT, {
						action: "export",
						args: {}
					});
					const txt = (res === null || res === void 0 || (_res$content = res.content) === null || _res$content === void 0 || (_res$content = _res$content[0]) === null || _res$content === void 0 ? void 0 : _res$content.text) || "{}";
					const blob = new Blob([txt], { type: "application/json" });
					const url = URL.createObjectURL(blob);
					yield (_globalThis$chrome4 = globalThis.chrome) === null || _globalThis$chrome4 === void 0 || (_globalThis$chrome4 = _globalThis$chrome4.downloads) === null || _globalThis$chrome4 === void 0 ? void 0 : _globalThis$chrome4.download({
						url,
						filename: "userscripts-export.json",
						saveAs: true
					});
					URL.revokeObjectURL(url);
				} catch (e) {
					console.warn("export failed", e);
				}
			});
			return _exportAll.apply(this, arguments);
		}
		onMounted(_asyncToGenerator(function* () {
			yield loadEmergency();
			yield reload();
		}));
		function m(key, substitutions) {
			var _globalThis$chrome5;
			return (((_globalThis$chrome5 = globalThis.chrome) === null || _globalThis$chrome5 === void 0 || (_globalThis$chrome5 = _globalThis$chrome5.i18n) === null || _globalThis$chrome5 === void 0 ? void 0 : _globalThis$chrome5.getMessage(key, substitutions)) || "").trim() || key;
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [
				createBaseVNode("header", _hoisted_2, [createBaseVNode("h1", null, toDisplayString(m("userscriptsManagerTitle")), 1), createBaseVNode("div", _hoisted_3, [createBaseVNode("label", null, [withDirectives(createBaseVNode("input", {
					type: "checkbox",
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => emergencyDisabled.value = $event),
					onChange: saveEmergency
				}, null, 544), [[vModelCheckbox, emergencyDisabled.value]]), createBaseVNode("span", null, toDisplayString(m("emergencySwitchLabel")), 1)])])]),
				createBaseVNode("section", _hoisted_4, [
					createBaseVNode("h2", null, toDisplayString(m("createRunSectionTitle")), 1),
					createBaseVNode("div", _hoisted_5, [
						createBaseVNode("label", null, [createTextVNode(toDisplayString(m("nameLabel")) + " ", 1), withDirectives(createBaseVNode("input", {
							"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.name = $event),
							placeholder: m("placeholderOptional")
						}, null, 8, _hoisted_6), [[vModelText, form.value.name]])]),
						createBaseVNode("label", null, [createTextVNode(toDisplayString(m("runAtLabel")) + " ", 1), withDirectives(createBaseVNode("select", { "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.runAt = $event) }, [
							createBaseVNode("option", _hoisted_7, toDisplayString(m("runAtAuto")), 1),
							createBaseVNode("option", _hoisted_8, toDisplayString(m("runAtDocumentStart")), 1),
							createBaseVNode("option", _hoisted_9, toDisplayString(m("runAtDocumentEnd")), 1),
							createBaseVNode("option", _hoisted_10, toDisplayString(m("runAtDocumentIdle")), 1)
						], 512), [[vModelSelect, form.value.runAt]])]),
						createBaseVNode("label", null, [createTextVNode(toDisplayString(m("worldLabel")) + " ", 1), withDirectives(createBaseVNode("select", { "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.world = $event) }, [
							createBaseVNode("option", _hoisted_11, toDisplayString(m("worldAuto")), 1),
							createBaseVNode("option", _hoisted_12, toDisplayString(m("worldIsolated")), 1),
							createBaseVNode("option", _hoisted_13, toDisplayString(m("worldMain")), 1)
						], 512), [[vModelSelect, form.value.world]])]),
						createBaseVNode("label", null, [createTextVNode(toDisplayString(m("modeLabel")) + " ", 1), withDirectives(createBaseVNode("select", { "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.mode = $event) }, [
							createBaseVNode("option", _hoisted_14, toDisplayString(m("modeAuto")), 1),
							createBaseVNode("option", _hoisted_15, toDisplayString(m("modePersistent")), 1),
							createBaseVNode("option", _hoisted_16, toDisplayString(m("modeCss")), 1),
							createBaseVNode("option", _hoisted_17, toDisplayString(m("modeOnce")), 1)
						], 512), [[vModelSelect, form.value.mode]])]),
						createBaseVNode("label", null, [createTextVNode(toDisplayString(m("allFramesLabel")) + " ", 1), withDirectives(createBaseVNode("input", {
							type: "checkbox",
							"onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.value.allFrames = $event)
						}, null, 512), [[vModelCheckbox, form.value.allFrames]])]),
						createBaseVNode("label", null, [createTextVNode(toDisplayString(m("persistLabel")) + " ", 1), withDirectives(createBaseVNode("input", {
							type: "checkbox",
							"onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.value.persist = $event)
						}, null, 512), [[vModelCheckbox, form.value.persist]])]),
						createBaseVNode("label", null, [createTextVNode(toDisplayString(m("dnrFallbackLabel")) + " ", 1), withDirectives(createBaseVNode("input", {
							type: "checkbox",
							"onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => form.value.dnrFallback = $event)
						}, null, 512), [[vModelCheckbox, form.value.dnrFallback]])])
					]),
					createBaseVNode("label", null, [createTextVNode(toDisplayString(m("matchesInputLabel")) + " ", 1), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => form.value.matches = $event),
						placeholder: m("placeholderMatchesExample")
					}, null, 8, _hoisted_18), [[vModelText, form.value.matches]])]),
					createBaseVNode("label", null, [createTextVNode(toDisplayString(m("excludesInputLabel")) + " ", 1), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => form.value.excludes = $event),
						placeholder: m("placeholderOptional")
					}, null, 8, _hoisted_19), [[vModelText, form.value.excludes]])]),
					createBaseVNode("label", null, [createTextVNode(toDisplayString(m("tagsInputLabel")) + " ", 1), withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => form.value.tags = $event),
						placeholder: m("placeholderOptional")
					}, null, 8, _hoisted_20), [[vModelText, form.value.tags]])]),
					createBaseVNode("label", null, [createTextVNode(toDisplayString(m("scriptLabel")) + " ", 1), withDirectives(createBaseVNode("textarea", {
						"onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => form.value.script = $event),
						placeholder: m("placeholderScriptHint"),
						rows: "8"
					}, null, 8, _hoisted_21), [[vModelText, form.value.script]])]),
					createBaseVNode("div", _hoisted_22, [
						createBaseVNode("button", {
							disabled: submitting.value,
							onClick: _cache[12] || (_cache[12] = ($event) => apply("auto"))
						}, toDisplayString(m("applyButton")), 9, _hoisted_23),
						createBaseVNode("button", {
							disabled: submitting.value,
							onClick: _cache[13] || (_cache[13] = ($event) => apply("once"))
						}, toDisplayString(m("runOnceButton")), 9, _hoisted_24),
						lastResult.value ? (openBlock(), createElementBlock("span", _hoisted_25, toDisplayString(lastResult.value), 1)) : createCommentVNode("", true)
					])
				]),
				createBaseVNode("section", _hoisted_26, [
					createBaseVNode("h2", null, toDisplayString(m("listSectionTitle")), 1),
					createBaseVNode("div", _hoisted_27, [
						createBaseVNode("label", null, [createTextVNode(toDisplayString(m("queryLabel")) + " ", 1), withDirectives(createBaseVNode("input", {
							"onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => filters.value.query = $event),
							onInput: _cache[15] || (_cache[15] = ($event) => reload())
						}, null, 544), [[vModelText, filters.value.query]])]),
						createBaseVNode("label", null, [createTextVNode(toDisplayString(m("statusLabel")) + " ", 1), withDirectives(createBaseVNode("select", {
							"onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => filters.value.status = $event),
							onChange: _cache[17] || (_cache[17] = ($event) => reload())
						}, [
							createBaseVNode("option", _hoisted_28, toDisplayString(m("statusAll")), 1),
							createBaseVNode("option", _hoisted_29, toDisplayString(m("statusEnabled")), 1),
							createBaseVNode("option", _hoisted_30, toDisplayString(m("statusDisabled")), 1)
						], 544), [[vModelSelect, filters.value.status]])]),
						createBaseVNode("label", null, [createTextVNode(toDisplayString(m("domainLabel")) + " ", 1), withDirectives(createBaseVNode("input", {
							"onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => filters.value.domain = $event),
							onInput: _cache[19] || (_cache[19] = ($event) => reload()),
							placeholder: m("placeholderDomainHint")
						}, null, 40, _hoisted_31), [[vModelText, filters.value.domain]])])
					]),
					createBaseVNode("div", _hoisted_32, [createBaseVNode("button", { onClick: exportAll }, toDisplayString(m("exportAllButton")), 1)]),
					createBaseVNode("table", _hoisted_33, [createBaseVNode("thead", null, [createBaseVNode("tr", null, [
						createBaseVNode("th", null, toDisplayString(m("tableHeaderName")), 1),
						createBaseVNode("th", null, toDisplayString(m("statusLabel")), 1),
						createBaseVNode("th", null, toDisplayString(m("tableHeaderWorld")), 1),
						createBaseVNode("th", null, toDisplayString(m("tableHeaderRunAt")), 1),
						createBaseVNode("th", null, toDisplayString(m("tableHeaderUpdated")), 1),
						_cache[20] || (_cache[20] = createBaseVNode("th", null, null, -1))
					])]), createBaseVNode("tbody", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(items.value, (it) => {
						return openBlock(), createElementBlock("tr", { key: it.id }, [
							createBaseVNode("td", null, toDisplayString(it.name || it.id), 1),
							createBaseVNode("td", null, [createBaseVNode("label", null, [createBaseVNode("input", {
								type: "checkbox",
								checked: it.status === "enabled",
								onChange: ($event) => toggle(it)
							}, null, 40, _hoisted_34), createTextVNode(" " + toDisplayString(it.status), 1)])]),
							createBaseVNode("td", null, toDisplayString(it.world), 1),
							createBaseVNode("td", null, toDisplayString(it.runAt), 1),
							createBaseVNode("td", null, toDisplayString(formatTime(it.updatedAt)), 1),
							createBaseVNode("td", _hoisted_35, [createBaseVNode("button", { onClick: ($event) => remove(it) }, toDisplayString(m("deleteButton")), 9, _hoisted_36)])
						]);
					}), 128))])])
				])
			]);
		};
	}
}), [["__scopeId", "data-v-462fd9e7"]])).mount("#app");
//#endregion
