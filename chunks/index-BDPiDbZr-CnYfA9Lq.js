import { A as onBeforeUnmount, H as watch, N as openBlock, S as defineComponent, W as withCtx, b as createVNode, g as createElementBlock, h as createCommentVNode, j as onMounted, n as Transition, p as createBaseVNode, st as normalizeClass, tt as ref } from "./_plugin-vue_export-helper-DCRN0gge.js";
import { c as Zl, h as vo, l as fo, r as Fl, s as Z } from "./sidepanel-Dkv1_Hg3.js";
//#region ../../node_modules/.pnpm/markstream-vue@0.0.3-beta.5_vue@3.5.41_typescript@5.9.3_/node_modules/markstream-vue/dist/index-BDPiDbZr.js
var v = (d, n, r) => new Promise((a, s) => {
	var f = (l) => {
		try {
			o(r.next(l));
		} catch (e) {
			s(e);
		}
	}, u = (l) => {
		try {
			o(r.throw(l));
		} catch (e) {
			s(e);
		}
	}, o = (l) => l.done ? a(l.value) : Promise.resolve(l.value).then(f, u);
	o((r = r.apply(d, n)).next());
});
var z = {
	key: 0,
	class: "math-loading-overlay"
};
var E = /* @__PURE__ */ Z(/* @__PURE__ */ defineComponent({
	__name: "MathBlockNode",
	props: { node: {} },
	setup(d) {
		const n = d, r = ref(null), a = ref(null);
		let s = !1, f = 0, u = !1, o = null;
		const l = fo();
		let e = null;
		const c = ref(!0);
		function k() {
			return v(this, null, function* () {
				if (!n.node.content || !a.value || u) return;
				if (!s) try {
					!e && r.value && (e = l(r.value)), yield e == null ? void 0 : e.whenVisible;
				} catch (t) {}
				o && (o.abort(), o = null);
				const i = ++f, m = new AbortController();
				o = m, Zl(n.node.content, !0, {
					timeout: 3e3,
					waitTimeout: 2e3,
					maxRetries: 1,
					signal: m.signal
				}).then((t) => {
					u || i !== f || a.value && (a.value.innerHTML = t, s = !0, c.value = !1);
				}).catch((t) => v(null, null, function* () {
					if (u || i !== f || !a.value) return;
					const h = (t == null ? void 0 : t.code) || (t == null ? void 0 : t.name), x = h === "WORKER_INIT_ERROR" || (t == null ? void 0 : t.fallbackToRenderer), B = h === "WORKER_BUSY" || h === "WORKER_TIMEOUT", C = h === "KATEX_DISABLED";
					if (x || B) {
						const R = yield vo();
						if (R) {
							try {
								const _ = R.renderToString(n.node.content, {
									throwOnError: n.node.loading,
									displayMode: !0
								});
								a.value.innerHTML = _, s = !0, c.value = !1, Fl(n.node.content, !0, _);
							} catch (_) {}
							return;
						}
					}
					if (C) {
						c.value = !1, a.value.textContent = n.node.raw;
						return;
					}
					s || (c.value = !0), n.node.loading || (c.value = !1, a.value.textContent = n.node.raw);
				}));
			});
		}
		return watch(() => n.node.content, () => {
			k();
		}), onMounted(() => {
			k();
		}), onBeforeUnmount(() => {
			var i;
			u = !0, o && (o.abort(), o = null), (i = e == null ? void 0 : e.destroy) == null || i.call(e), e = null;
		}), (i, m) => (openBlock(), createElementBlock("div", {
			ref_key: "containerEl",
			ref: r,
			class: "math-block text-center overflow-x-auto relative min-h-[40px]"
		}, [createVNode(Transition, { name: "math-fade" }, {
			default: withCtx(() => [c.value ? (openBlock(), createElementBlock("div", z, [...m[0] || (m[0] = [createBaseVNode("div", { class: "math-loading-spinner" }, null, -1)])])) : createCommentVNode("", !0)]),
			_: 1
		}), createBaseVNode("div", {
			ref_key: "mathBlockElement",
			ref: a,
			class: normalizeClass({ "math-rendering": c.value })
		}, null, 2)], 512));
	}
}), [["__scopeId", "data-v-dab27d4f"]]);
E.install = (d) => {
	d.component(E.__name, E);
};
//#endregion
export { E as default };
