//#region common/constants.ts
/**
* Chrome Extension Constants
* Centralized configuration values and magic constants
*/
var NATIVE_HOST = {
	NAME: "com.scalemax.nativehost",
	DEFAULT_PORT: 12306
};
var LINKS = { TROUBLESHOOTING: "https://github.com/Sagar3079/scalemax-chrome-extension#readme" };
var STORAGE_KEYS = {
	SERVER_STATUS: "serverStatus",
	NATIVE_SERVER_PORT: "nativeServerPort",
	NATIVE_AUTO_CONNECT_ENABLED: "nativeAutoConnectEnabled",
	SEMANTIC_MODEL: "selectedModel",
	USER_PREFERENCES: "userPreferences",
	VECTOR_INDEX: "vectorIndex",
	USERSCRIPTS: "userscripts",
	USERSCRIPTS_DISABLED: "userscripts_disabled",
	RR_FLOWS: "rr_flows",
	RR_RUNS: "rr_runs",
	RR_PUBLISHED: "rr_published_flows",
	RR_SCHEDULES: "rr_schedules",
	RR_TRIGGERS: "rr_triggers",
	RR_RECORDING_STATE: "rr_recording_state"
};
//#endregion
export { NATIVE_HOST as n, STORAGE_KEYS as r, LINKS as t };
