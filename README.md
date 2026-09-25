# Scalemax Official — Browser-Only AI Agent

> **Scalemax Official** is a privacy-first AI agent for Chrome, built on Manifest V3. Bring your own OpenAI-compatible LLM endpoint and let it read, navigate and automate your browser. Everything runs inside the extension: there is no server, native host or desktop app to install.

### ⬇️ [Download Scalemax Official (latest .zip)](https://github.com/Sagar3079/scalemax-chrome-extension/releases/latest/download/scalemax-official.zip)

Always the newest version. Then follow the [installation steps](#-installation) below. Release notes and older versions are on the [Releases page](https://github.com/Sagar3079/scalemax-chrome-extension/releases/latest).

---

## 🌟 Key Features

- **Bring Your Own LLM (BYOK)**: works with any OpenAI-compatible API (OpenAI, OpenRouter, DeepSeek, Groq, Together, Ollama, LM Studio, vLLM and others).
- **Autonomous browser agent**: reads pages (accessibility tree and readable text), clicks, fills forms, types, searches and navigates. By default it keeps each task in a single tab.
- **Chat sessions and saved skills**: multi-turn sessions in the side panel keep their history and tab. Tasks you use often can be saved as reusable skills.
- **Scheduler**: runs saved tasks on a timer with `chrome.alarms`.
- **Quick Panel AI Chat**: an in-page copilot for the current tab (`Ctrl+Shift+U` / `Cmd+Shift+U`).
- **Web Editor Mode**: visual in-page DOM inspector and editor (`Ctrl+Shift+O` / `Cmd+Shift+O`).
- **Visual Workflow Builder**: graph-based record/replay workflow editor (popup → Management → **Workflows**).
- **In-place AI translation**: translates pages into 25+ languages through your own LLM, with per-site policies (*Always*, *Never*, *Ask*).
- **Userscripts manager**: manage custom scripts, injection targets and match patterns from the options page.
- **Multilingual UI**: English, Simplified Chinese, Traditional Chinese, Japanese, Korean and German.

---

## 🛡️ Safety Controls

- **Approval for high-risk actions**: with the default *confirm-high* policy, the agent pauses before running page JavaScript, sending cookie-bearing network requests, or dispatching extra agents. A small Scalemax window shows the exact call and waits for **Allow once**, **Allow for this run** or **Deny**. If there is no answer within 2 minutes, the window is closed, or the run is stopped, the call is denied.
- **Tool policy**: set `approvalMode` to `deny-high` to refuse high-risk tools outright, or list tools in `blockedTools`.
- **Domain allowlist**: optionally restrict the agent to specific sites (AI Provider → Allowed domains). The allowlist covers navigation, page fetches and network-request targets.
- **Prompt-injection fencing**: page-derived tool output is wrapped as untrusted data, and common injection phrases are flagged to the model.
- **Audit log**: every tool call is recorded (ring buffer of 500 entries) and can be exported as JSON.
- **Step budget**: each run is limited to 100 steps by default, with a hard cap of 300.

---

## ⌨️ Default Keyboard Shortcuts

| Shortcut (Mac) | Shortcut (Windows/Linux) | Action |
| --- | --- | --- |
| `Command + Shift + U` | `Ctrl + Shift + U` | Toggle Quick Panel AI Chat |
| `Command + Shift + O` | `Ctrl + Shift + O` | Toggle Web Editor Mode |

---

## 🚀 Installation

1. **[Download the latest `scalemax-official.zip`](https://github.com/Sagar3079/scalemax-chrome-extension/releases/latest/download/scalemax-official.zip)**. You can also pick a specific version on the [Releases page](https://github.com/Sagar3079/scalemax-chrome-extension/releases/latest).
2. Unzip it. You get a folder named `scalemax-official`. Keep it somewhere permanent, because Chrome loads the extension from this folder.
3. Open Google Chrome, or another Chromium browser such as Brave, Edge or Arc (version 116 or later), and go to `chrome://extensions`.
4. Turn on **Developer mode** in the top-right corner.
5. Click **Load unpacked** and select the `scalemax-official` folder.
6. Open the extension popup → **Management → AI Provider**, enter your Base URL and API key, load and pick a model, then **Save**.
7. Open the side panel (popup → **Agent Chat**), start a new session and describe a task.

## 🔄 Updating

When a new version is released, the popup shows a **"Scalemax X.Y.Z is available"** banner.

1. [Download the latest zip](https://github.com/Sagar3079/scalemax-chrome-extension/releases/latest/download/scalemax-official.zip) (the banner's **Download** button opens the [Releases page](https://github.com/Sagar3079/scalemax-chrome-extension/releases/latest) too).
2. Unzip it **over your existing `scalemax-official` folder**, replacing all files.
3. In `chrome://extensions`, click the reload icon (↻) on the Scalemax Official card.

Your settings, API key, sessions and skills are kept. Do **not** click *Remove*, because removing the extension deletes its saved data.

You can also clone this repository and load the cloned folder directly; `git pull` then reload updates it.

---

## 🧰 Releasing a New Version (maintainers)

1. Make your changes and bump `"version"` in `manifest.json` (for example `1.1.0` → `1.2.0`).
2. Add a section for that version at the top of `CHANGELOG.md`; it becomes the release notes.
3. Check locally: `bash scripts/validate.sh` and `bash scripts/package.sh` (writes `dist/scalemax-official-vX.Y.Z.zip`; commit your changes first, because the script packages tracked files).
4. Merge to `main`, then tag and push:
   ```bash
   git tag v1.2.0
   git push origin v1.2.0
   ```
5. The **Release** GitHub Action validates the files, checks that the tag matches the manifest version, builds the zip and publishes it on the Releases page, both as `scalemax-official-vX.Y.Z.zip` and as `scalemax-official.zip`, which the README's download link always points to. Installed copies see the update banner within about 12 hours.

Every push and pull request also runs the **Validate** action, which uploads a test zip as a build artifact.

---

## 📁 Repository Structure

```text
scalemax-chrome-extension/
├── manifest.json             # Extension Manifest V3 configuration
├── background.js             # Service worker: agent runners, tools, policy, scheduler, translation
├── popup.html                # Toolbar popup (AI Provider, Agents, Scheduler, Workflows)
├── sidepanel.html            # Side panel: Browser Agent chat sessions
├── options.html              # Userscripts manager
├── builder.html              # Visual workflow editor
├── welcome.html              # Onboarding page
├── approval.html / .js       # Approval window for high-risk agent actions
├── translate-settings.*      # Page translation settings and per-site policies
├── web-editor-v2.js          # In-page visual DOM editor
├── scripts/                  # validate.sh and package.sh (release zip)
├── .github/workflows/        # Validate and Release GitHub Actions
├── CHANGELOG.md              # Release notes per version
├── offscreen.html            # Offscreen document (GIF encoding, keepalive, embeddings)
├── content-scripts/          # element-picker, quick-panel, translate
├── inject-scripts/           # On-demand page helpers (read, click, fill, keyboard, record…)
├── chunks/                   # Bundled Vue/Vite application chunks
├── workers/                  # Similarity worker and ONNX Runtime WASM
├── libs/                     # ONNX Runtime Web
├── assets/                   # Stylesheets
├── icon/                     # Extension icons (16–128 px) and icon.svg source
└── _locales/                 # UI strings (en, de, ja, ko, zh_CN, zh_TW)
```

---

## 🔒 Security & Privacy

- **No telemetry**: the extension sends no analytics or usage data anywhere.
- **Update check**: about twice a day the extension asks the public GitHub API for the latest release number of this repository. No user data is included in the request.
- **Your provider only**: prompts, page content the agent reads, and your API key go only to the Base URL you configure. Page translation uses the same provider.
- **Local storage**: provider settings, sessions, skills, scheduled jobs and the audit log are kept in `chrome.storage.local` on your machine. The API key is stored there unencrypted, as with most extensions, so protect your browser profile.
- **Optional model download**: the semantic tab-search engine (off by default) downloads its embedding model from Hugging Face the first time it is enabled, then caches it locally.
- **No credentials in code**: the extension ships with no API keys or accounts.

---

## 📄 License

Scalemax Official is licensed under the [MIT License](LICENSE). It includes open-source components whose notices are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
