import { n as init_asyncToGenerator, t as _asyncToGenerator } from "./asyncToGenerator-HxMCLN5T.js";
import { tt as ref } from "./_plugin-vue_export-helper-DCRN0gge.js";
//#region entrypoints/sidepanel/composables/useAgentTheme.ts
/**
* Composable for managing AgentChat theme.
* Handles theme persistence and application.
*/
init_asyncToGenerator();
/** Storage key for persisting theme preference */
var STORAGE_KEY_THEME = "agentTheme";
/** Default theme when none is set */
var DEFAULT_THEME = "warm-editorial";
/** Valid theme IDs for validation */
var VALID_THEMES = [
	"warm-editorial",
	"blueprint-architect",
	"zen-journal",
	"neo-pop",
	"dark-console",
	"swiss-grid"
];
/** Theme display names for UI */
var THEME_LABELS = {
	"warm-editorial": "Editorial",
	"blueprint-architect": "Blueprint",
	"zen-journal": "Zen",
	"neo-pop": "Neo-Pop",
	"dark-console": "Console",
	"swiss-grid": "Swiss"
};
/**
* Check if a string is a valid theme ID
*/
function isValidTheme(value) {
	return typeof value === "string" && VALID_THEMES.includes(value);
}
/**
* Get theme from document element (preloaded by main.ts)
*/
function getThemeFromDocument() {
	const value = document.documentElement.dataset.agentTheme;
	return isValidTheme(value) ? value : DEFAULT_THEME;
}
/**
* Composable for managing AgentChat theme
*/
function useAgentTheme() {
	const theme = ref(getThemeFromDocument());
	const ready = ref(false);
	/**
	* Load theme from chrome.storage.local
	*/
	function initTheme() {
		return _initTheme.apply(this, arguments);
	}
	function _initTheme() {
		_initTheme = _asyncToGenerator(function* () {
			try {
				const stored = (yield chrome.storage.local.get(STORAGE_KEY_THEME))[STORAGE_KEY_THEME];
				if (isValidTheme(stored)) theme.value = stored;
				else theme.value = getThemeFromDocument();
			} catch (error) {
				console.error("[useAgentTheme] Failed to load theme:", error);
				theme.value = getThemeFromDocument();
			} finally {
				ready.value = true;
			}
		});
		return _initTheme.apply(this, arguments);
	}
	/**
	* Set and persist a new theme
	*/
	function setTheme(_x) {
		return _setTheme.apply(this, arguments);
	}
	function _setTheme() {
		_setTheme = _asyncToGenerator(function* (id) {
			if (!isValidTheme(id)) {
				console.warn("[useAgentTheme] Invalid theme ID:", id);
				return;
			}
			theme.value = id;
			document.documentElement.dataset.agentTheme = id;
			try {
				yield chrome.storage.local.set({ [STORAGE_KEY_THEME]: id });
			} catch (error) {
				console.error("[useAgentTheme] Failed to save theme:", error);
			}
		});
		return _setTheme.apply(this, arguments);
	}
	/**
	* Apply theme to a DOM element
	*/
	function applyTo(el) {
		el.dataset.agentTheme = theme.value;
	}
	/**
	* Get the preloaded theme from document
	*/
	function getPreloadedTheme() {
		return getThemeFromDocument();
	}
	return {
		theme,
		ready,
		setTheme,
		initTheme,
		applyTo,
		getPreloadedTheme
	};
}
/**
* Preload theme before Vue mounts (call in main.ts)
* This prevents theme flashing on page load.
*/
function preloadAgentTheme() {
	return _preloadAgentTheme.apply(this, arguments);
}
function _preloadAgentTheme() {
	_preloadAgentTheme = _asyncToGenerator(function* () {
		let themeId = DEFAULT_THEME;
		try {
			const stored = (yield chrome.storage.local.get(STORAGE_KEY_THEME))[STORAGE_KEY_THEME];
			if (isValidTheme(stored)) themeId = stored;
		} catch (error) {
			console.error("[preloadAgentTheme] Failed to load theme:", error);
		}
		document.documentElement.dataset.agentTheme = themeId;
		return themeId;
	});
	return _preloadAgentTheme.apply(this, arguments);
}
//#endregion
export { preloadAgentTheme as n, useAgentTheme as r, THEME_LABELS as t };
