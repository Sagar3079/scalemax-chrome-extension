import { A as onBeforeUnmount, G as withDirectives, H as watch, I as renderSlot, N as openBlock, S as defineComponent, W as withCtx, g as createElementBlock, h as createCommentVNode, j as onMounted, m as createBlock, n as Transition, p as createBaseVNode, s as vShow, tt as ref } from "./_plugin-vue_export-helper-DCRN0gge.js";
import { c as Zl, h as vo, l as fo, r as Fl, s as Z } from "./sidepanel-Dkv1_Hg3.js";
//#region ../../node_modules/.pnpm/markstream-vue@0.0.3-beta.5_vue@3.5.41_typescript@5.9.3_/node_modules/markstream-vue/dist/index-Cy9ounEH.js
var w = (d, n, r) => new Promise((a, s) => {
	var f = (e) => {
		try {
			o(r.next(e));
		} catch (m) {
			s(m);
		}
	}, c = (e) => {
		try {
			o(r.throw(e));
		} catch (m) {
			s(m);
		}
	}, o = (e) => e.done ? a(e.value) : Promise.resolve(e.value).then(f, c);
	o((r = r.apply(d, n)).next());
});
var Y = {
	class: "math-inline__loading",
	role: "status",
	"aria-live": "polite"
};
var g = /* @__PURE__ */ Z(/* @__PURE__ */ defineComponent({
	__name: "MathInlineNode",
	props: { node: {} },
	setup(d) {
		const n = d, r = ref(null), a = ref(null);
		let s = !1, f = 0, c = !1, o = null;
		const e = ref(!0), m = fo();
		let l = null;
		function R() {
			return w(this, null, function* () {
				if (!n.node.content || !a.value || c) return;
				o && (o.abort(), o = null);
				const i = ++f, u = new AbortController();
				if (o = u, !s) try {
					!l && r.value && (l = m(r.value)), yield l == null ? void 0 : l.whenVisible;
				} catch (t) {}
				Zl(n.node.content, !1, {
					timeout: 1500,
					waitTimeout: 0,
					maxRetries: 0,
					signal: u.signal
				}).then((t) => {
					c || i !== f || a.value && (a.value.innerHTML = t, e.value = !1, s = !0);
				}).catch((t) => w(null, null, function* () {
					if (c || i !== f || !a.value) return;
					const p = (t == null ? void 0 : t.code) || (t == null ? void 0 : t.name), k = p === "WORKER_INIT_ERROR" || (t == null ? void 0 : t.fallbackToRenderer), I = p === "WORKER_BUSY" || p === "WORKER_TIMEOUT", h = p === "KATEX_DISABLED";
					if (k || I) {
						const T = yield vo();
						if (T) {
							try {
								const v = T.renderToString(n.node.content, {
									throwOnError: n.node.loading,
									displayMode: !1
								});
								e.value = !1, a.value.innerHTML = v, s = !0, Fl(n.node.content, !1, v);
							} catch (v) {}
							return;
						}
					}
					if (h) {
						e.value = !1, a.value.textContent = n.node.raw;
						return;
					}
					s || (e.value = !h), n.node.loading ? h && (a.value.textContent = n.node.raw) : (e.value = !1, a.value.textContent = n.node.raw);
				}));
			});
		}
		return watch(() => n.node.content, () => {
			R();
		}), onMounted(() => {
			R();
		}), onBeforeUnmount(() => {
			var i;
			c = !0, o && (o.abort(), o = null), (i = l == null ? void 0 : l.destroy) == null || i.call(l), l = null;
		}), (i, u) => (openBlock(), createElementBlock("span", {
			ref_key: "containerEl",
			ref: r,
			class: "math-inline-wrapper"
		}, [withDirectives(createBaseVNode("span", {
			ref_key: "mathElement",
			ref: a,
			class: "math-inline"
		}, null, 512), [[vShow, !e.value]]), e.value ? (openBlock(), createBlock(Transition, {
			key: 0,
			name: "table-node-fade"
		}, {
			default: withCtx(() => [createBaseVNode("span", Y, [renderSlot(i.$slots, "loading", { isLoading: e.value }, () => [u[0] || (u[0] = createBaseVNode("span", {
				class: "math-inline__spinner animate-spin",
				"aria-hidden": "true"
			}, null, -1)), u[1] || (u[1] = createBaseVNode("span", { class: "sr-only" }, "Loading", -1))], !0)])]),
			_: 3
		})) : createCommentVNode("", !0)], 512));
	}
}), [["__scopeId", "data-v-fbd3ae11"]]);
g.install = (d) => {
	d.component(g.__name, g);
};
//#endregion
export { g as default };
