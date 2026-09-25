# Changelog

All notable changes to Scalemax Official. Versions match `manifest.json` and the GitHub release tags (`v1.1.0`, …).

## [1.1.0] - 2026-09-25

### Security
- High-risk agent actions (running page JavaScript, cookie-bearing network requests, dispatching extra agents) now wait for your approval in a Scalemax window.
- The domain allowlist also covers network-request and page-fetch URLs.
- Pages and embedded frames can no longer read other frames or type into them through the extension; password and one-time-code values are never included in page snapshots.
- Agent settings, runs, sessions and tool calls are only accepted from Scalemax's own pages.
- Your API key is no longer sent to a localhost port.
- Websites can no longer detect the extension by probing its files.

### Fixed
- Scheduled jobs now run.
- Quick Panel AI chat works (it runs on the built-in agent).
- The Userscripts manager works, and userscripts re-apply when a matching page loads.
- Running JavaScript and workflow conditions work under Manifest V3.
- Reading a page works on sparse pages and pages with iframes.
- The Translate settings page acts on the tab you opened it from.
- Your provider URL and model are no longer changed silently; the default step budget is 100 (max 300).

### Changed
- New Scalemax icon and branding throughout; the Chinese locales are fully translated.
- The popup shows a banner when a newer release is available on GitHub.
- New Workflows entry in the popup.

## [1.0.0] - 2026-09-25

- First release.
