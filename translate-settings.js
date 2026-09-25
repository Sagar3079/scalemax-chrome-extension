// translate-settings.js
// Standalone settings page for the AI-powered translate feature. Plain script, no
// build step, no framework -- matches the CSP (`script-src 'self'`, no inline scripts)
// and is fully independent of the Vue chunks, so it cannot be broken by (or break)
// anything in chunks/.
//
// Message contract with background.js (must match registerTranslateMessaging exactly):
//   scalemax_translate_settings_get  -> { ok, settings: { enabled, targetLang, defaultSitePolicy } }
//   scalemax_translate_settings_set  -> { patch } -> { ok, settings }
//   scalemax_translate_site_prefs_list -> { ok, prefs: { [hostname]: "always"|"never" } }
//   scalemax_translate_site_policy_set -> { hostname, policy } -> { ok }
//
// Message contract with content-scripts/translate.js (via chrome.tabs.sendMessage):
//   { action: "translate_now", targetLang } -> { success }
//   { action: "translate_revert" }          -> { success }
//   { action: "translate_status" }          -> { success, active, detectedLang, targetLang, hostname }

(function () {
  const LANGUAGE_NAMES = {
    en: "English", es: "Spanish", fr: "French", de: "German", it: "Italian",
    pt: "Portuguese", nl: "Dutch", ru: "Russian", ja: "Japanese", ko: "Korean",
    zh: "Chinese (Simplified)", "zh-TW": "Chinese (Traditional)", ar: "Arabic",
    hi: "Hindi", tr: "Turkish", pl: "Polish", vi: "Vietnamese", th: "Thai",
    id: "Indonesian", sv: "Swedish", da: "Danish", fi: "Finnish", no: "Norwegian",
    el: "Greek", he: "Hebrew", cs: "Czech", ro: "Romanian", hu: "Hungarian", uk: "Ukrainian",
  };

  const els = {
    enabledToggle: document.getElementById("enabled-toggle"),
    targetLang: document.getElementById("target-lang"),
    defaultPolicy: document.getElementById("default-policy"),
    statusMsg: document.getElementById("status-msg"),
    refreshSites: document.getElementById("refresh-sites"),
    sitesEmpty: document.getElementById("sites-empty"),
    sitesTable: document.getElementById("sites-table"),
    sitesTbody: document.getElementById("sites-tbody"),
    currentTabInfo: document.getElementById("current-tab-info"),
    translateNowBtn: document.getElementById("translate-now-btn"),
    revertNowBtn: document.getElementById("revert-now-btn"),
  };

  let statusTimer = null;
  function setStatus(message, ok) {
    els.statusMsg.textContent = message;
    els.statusMsg.className = "status " + (ok ? "ok" : "err");
    if (statusTimer) clearTimeout(statusTimer);
    if (message) statusTimer = setTimeout(() => { els.statusMsg.textContent = ""; els.statusMsg.className = "status"; }, 4000);
  }

  function sendBackground(message) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          resolve({ ok: false, error: chrome.runtime.lastError.message });
          return;
        }
        resolve(response || { ok: false, error: "no response" });
      });
    });
  }

  function sendToTab(tabId, message) {
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          resolve({ success: false, error: chrome.runtime.lastError.message });
          return;
        }
        resolve(response || { success: false, error: "no response" });
      });
    });
  }

  function populateLanguageSelect(selectEl) {
    selectEl.innerHTML = "";
    Object.keys(LANGUAGE_NAMES).sort((a, b) => LANGUAGE_NAMES[a].localeCompare(LANGUAGE_NAMES[b])).forEach((code) => {
      const opt = document.createElement("option");
      opt.value = code;
      opt.textContent = LANGUAGE_NAMES[code];
      selectEl.appendChild(opt);
    });
  }

  // ---------------------------------------------------------------------------
  // General settings
  // ---------------------------------------------------------------------------

  async function loadGeneralSettings() {
    const res = await sendBackground({ type: "scalemax_translate_settings_get" });
    if (!res || res.ok === false) {
      setStatus("Could not load settings: " + (res && res.error || "unknown error"), false);
      return;
    }
    const s = res.settings || {};
    els.enabledToggle.checked = s.enabled !== false;
    els.targetLang.value = s.targetLang || "en";
    els.defaultPolicy.value = s.defaultSitePolicy || "ask";
  }

  async function saveGeneralSettings(patch) {
    const res = await sendBackground({ type: "scalemax_translate_settings_set", patch });
    if (!res || res.ok === false) {
      setStatus("Save failed: " + (res && res.error || "unknown error"), false);
      return;
    }
    setStatus("Saved.", true);
  }

  els.enabledToggle.addEventListener("change", () => {
    saveGeneralSettings({ enabled: els.enabledToggle.checked });
  });
  els.targetLang.addEventListener("change", () => {
    saveGeneralSettings({ targetLang: els.targetLang.value });
  });
  els.defaultPolicy.addEventListener("change", () => {
    saveGeneralSettings({ defaultSitePolicy: els.defaultPolicy.value });
  });

  // ---------------------------------------------------------------------------
  // Per-site rules
  // ---------------------------------------------------------------------------

  async function loadSitePrefs() {
    const res = await sendBackground({ type: "scalemax_translate_site_prefs_list" });
    if (!res || res.ok === false) {
      setStatus("Could not load site rules: " + (res && res.error || "unknown error"), false);
      return;
    }
    renderSitePrefs(res.prefs || {});
  }

  function renderSitePrefs(prefs) {
    const hosts = Object.keys(prefs).sort();
    els.sitesTbody.innerHTML = "";
    if (!hosts.length) {
      els.sitesEmpty.hidden = false;
      els.sitesTable.hidden = true;
      return;
    }
    els.sitesEmpty.hidden = true;
    els.sitesTable.hidden = false;
    for (const host of hosts) {
      const policy = prefs[host];
      if (policy !== "always" && policy !== "never") continue; // "ask" entries aren't stored, but guard anyway
      const tr = document.createElement("tr");

      const hostTd = document.createElement("td");
      hostTd.textContent = host;
      tr.appendChild(hostTd);

      const ruleTd = document.createElement("td");
      const badge = document.createElement("span");
      badge.className = "rule-badge " + policy;
      badge.textContent = policy;
      ruleTd.appendChild(badge);
      tr.appendChild(ruleTd);

      const actionsTd = document.createElement("td");
      const actions = document.createElement("div");
      actions.className = "row-actions";

      const otherPolicy = policy === "always" ? "never" : "always";
      const switchBtn = document.createElement("button");
      switchBtn.type = "button";
      switchBtn.className = "btn-small";
      switchBtn.textContent = "Switch to " + otherPolicy;
      switchBtn.addEventListener("click", () => setHostPolicy(host, otherPolicy));

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn-small danger";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => setHostPolicy(host, "ask"));

      actions.appendChild(switchBtn);
      actions.appendChild(removeBtn);
      actionsTd.appendChild(actions);
      tr.appendChild(actionsTd);

      els.sitesTbody.appendChild(tr);
    }
  }

  async function setHostPolicy(hostname, policy) {
    const res = await sendBackground({ type: "scalemax_translate_site_policy_set", hostname, policy });
    if (!res || res.ok === false) {
      setStatus("Could not update rule for " + hostname + ": " + (res && res.error || "unknown error"), false);
      return;
    }
    setStatus(policy === "ask" ? "Removed rule for " + hostname + "." : "Set " + hostname + " to " + policy + ".", true);
    loadSitePrefs();
  }

  els.refreshSites.addEventListener("click", loadSitePrefs);

  // ---------------------------------------------------------------------------
  // Current tab controls
  // ---------------------------------------------------------------------------

  let activeTabId = null;

  async function refreshCurrentTab() {
    els.translateNowBtn.disabled = true;
    els.revertNowBtn.disabled = true;
    try {
      const tabs = await new Promise((resolve) => chrome.tabs.query({ active: true, currentWindow: true }, resolve));
      const tab = tabs && tabs[0];
      if (!tab || typeof tab.id !== "number") {
        els.currentTabInfo.textContent = "No active tab found.";
        return;
      }
      activeTabId = tab.id;
      let hostname = "";
      try { hostname = new URL(tab.url || "").hostname; } catch (e) {}
      if (!hostname || /^(chrome|chrome-extension|edge|about):/.test(tab.url || "")) {
        els.currentTabInfo.textContent = "This page can't be translated (browser-internal page).";
        return;
      }
      const status = await sendToTab(activeTabId, { action: "translate_status" });
      if (!status || status.success === false) {
        els.currentTabInfo.textContent = hostname + " — translation not available on this page (try reloading it after installing this update).";
        els.translateNowBtn.disabled = false;
        return;
      }
      const detected = status.detectedLang && status.detectedLang !== "und" ? (LANGUAGE_NAMES[status.detectedLang] || status.detectedLang) : "not yet detected";
      els.currentTabInfo.textContent = hostname + " — detected language: " + detected + (status.active ? " — currently translated" : "");
      els.translateNowBtn.disabled = false;
      els.revertNowBtn.disabled = !status.active;
    } catch (e) {
      els.currentTabInfo.textContent = "Could not read the active tab: " + (e && e.message || e);
    }
  }

  els.translateNowBtn.addEventListener("click", async () => {
    if (typeof activeTabId !== "number") return;
    els.translateNowBtn.disabled = true;
    const res = await sendToTab(activeTabId, { action: "translate_now", targetLang: els.targetLang.value });
    if (res && res.success) setStatus("Translating…", true);
    else setStatus("Could not start translation: " + (res && res.error || "unknown error"), false);
    refreshCurrentTab();
  });

  els.revertNowBtn.addEventListener("click", async () => {
    if (typeof activeTabId !== "number") return;
    els.revertNowBtn.disabled = true;
    const res = await sendToTab(activeTabId, { action: "translate_revert" });
    if (res && res.success) setStatus("Reverted to original text.", true);
    else setStatus("Could not revert: " + (res && res.error || "unknown error"), false);
    refreshCurrentTab();
  });

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------

  populateLanguageSelect(els.targetLang);
  loadGeneralSettings();
  loadSitePrefs();
  refreshCurrentTab();
})();
