# Scalemax Official — Browser-Only Autonomous AI Agent

> **Scalemax Official** is a privacy-first, browser-only autonomous AI agent Chrome extension built on Manifest V3. Bring your own OpenAI-compatible LLM endpoint and let it understand, navigate, and automate your browser directly on-device.

---

## 🌟 Key Features

- **Bring Your Own LLM (BYOK)**: Connects to any OpenAI-compatible API (OpenAI, OpenRouter, DeepSeek, Ollama, Groq, vLLM, etc.) with full privacy control.
- **In-Browser Autonomous Automation**:
  - DOM observation & accessibility tree parsing
  - Intelligent element picking and high-accuracy interactive element targeting
  - Automated click, type, fill, wait, and keyboard interaction helpers
  - Page screenshots and visual context recording
- **Quick Panel AI Chat**: Summon an in-page AI copilot instantly on any active tab (`Ctrl+Shift+U` / `Cmd+Shift+U`).
- **Web Editor Mode**: In-page visual DOM inspector and editor (`Ctrl+Shift+O` / `Cmd+Shift+O`).
- **On-Device Semantic Engine**: Uses ONNX Runtime Web (`ort-wasm-simd`) for fast local embedding generation and semantic similarity matching inside a dedicated web worker.
- **In-Place AI Webpage Translation**: Integrated full-page translation settings supporting 25+ languages with customizable per-domain policies (*Always*, *Never*, *Ask*).
- **Visual Workflow Builder**: In-browser graph-based workflow and automation editor (`builder.html`).
- **Userscripts & Rules Manager**: Manage custom automation scripts, injection targets, and match patterns from the options page.
- **Multilingual Support**: UI localized for English, Simplified Chinese, Traditional Chinese, Japanese, Korean, and German.

---

## ⌨️ Default Keyboard Shortcuts

| Shortcut (Mac) | Shortcut (Windows/Linux) | Action |
| --- | --- | --- |
| `Command + Shift + U` | `Ctrl + Shift + U` | Toggle Quick Panel AI Chat |
| `Command + Shift + O` | `Ctrl + Shift + O` | Toggle Web Editor Mode |

---

## 🚀 Installation (Load Unpacked)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sagar3079/scalemax-chrome-extension.git
   ```
2. Open Google Chrome (or any Chromium browser like Brave, Edge, Arc).
3. Navigate to:
   ```text
   chrome://extensions
   ```
4. Enable **Developer mode** toggle in the top-right corner.
5. Click **Load unpacked** in the top-left corner.
6. Select the cloned `scalemax-chrome-extension` folder.
7. Open the extension popup or options to configure your LLM endpoint (API Base URL and Key).

---

## 📁 Repository Structure

```text
scalemax-chrome-extension/
├── manifest.json              # Extension Manifest V3 configuration
├── background.js             # Background service worker (agent coordination)
├── popup.html                # Main toolbar popup interface
├── options.html              # Options & userscript management
├── sidepanel.html            # Chrome side panel interface
├── builder.html              # Visual workflow editor
├── welcome.html              # Onboarding / welcome page
├── translate-settings.html   # Standalone webpage translation control panel
├── translate-settings.js     # Translation policy & preferences controller
├── translate-settings.css    # Styling for translation controls
├── web-editor-v2.js          # In-page visual DOM editor bundle
├── content-scripts/          # Scripts injected into matching webpages
│   ├── content.js            # General page content bridge
│   ├── element-picker.js     # Interactive element selector overlay
│   ├── quick-panel.js        # Quick Panel AI chat overlay
│   └── translate.js          # In-page text translation injector
├── inject-scripts/           # Modular browser automation helpers
│   ├── accessibility-tree-helper.js
│   ├── click-helper.js
│   ├── dom-observer.js
│   ├── element-marker.js
│   ├── fill-helper.js
│   ├── keyboard-helper.js
│   ├── mouse-helper.js
│   ├── network-helper.js
│   ├── recorder.js
│   ├── screenshot-helper.js
│   └── wait-helper.js
├── chunks/                   # Bundled Vue/Vite application chunks
├── workers/                  # Web workers & ONNX Runtime SIMD WASM binaries
├── libs/                     # Shared libraries (ONNX Runtime Web, etc.)
├── assets/                   # CSS stylesheets and UI assets
├── icon/                     # Extension branding icons
└── _locales/                 # Internationalization strings (en, de, ja, ko, zh)
```

---

## 🔒 Security & Privacy

- **No Remote Telemetry**: All operations run locally inside your browser session.
- **Direct LLM Communication**: API requests are sent directly to the LLM endpoint specified in your settings.
- **No Credentials Stored in Code**: The extension ships with zero pre-baked credentials or API keys. Bring your own endpoint and keys securely.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
