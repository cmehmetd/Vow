# Vow

Vow is a Chrome Manifest V3 extension that detects media URLs from the active tab without using an external server, telemetry, or analytics. It observes normal HTTP(S) requests and displays video, audio, and subtitle links in the popup.

## Project structure

```text
Vow/
├─ manifest.json
├─ background.js
├─ detector.js
├─ popup.html
├─ popup.css
├─ popup.js
├─ icons/
├─ landing/
├─ README.md
└─ AGENTS.md
```

## Features

- Video: HLS/M3U8 master and media playlist requests.
- Audio: Audio-only playlists, audio/sound/aac/m4a/mp3 signals, and relevant Content-Type values.
- Subtitles: `.vtt`, `.srt`, `.ass`, `.ssa`, subtitle playlists, and subtitle/caption/cc/text signals.
- File extensions are not used alone; URL path/query, Content-Type, and request context are evaluated together.
- Language is shown when detected from the URL or query; otherwise `Unknown` is displayed.
- Results are grouped into Video, Audio, and Subtitles for the active tab.
- The same full URL is not added twice for the same tab.
- New media requests appear automatically while the popup is open.
- Includes Copy, Open in new tab, Clear, and Reload active page actions.

## Manifest V3 permissions

- `webRequest`: Observing request URLs and response headers.
- `tabs`: Reading the active tab ID and title, associating results with the tab, and reloading the page.
- `storage`: Persisting results across service worker restarts and sharing them with the popup.
- `host_permissions: ["<all_urls>"]`: Observing HTTP(S) media requests on visited websites.

Vow uses `webRequest` for observation only. It does not block or modify requests and does not read response bodies. If response headers are unavailable, URL and request-context signals are still used.

## Security and scope

The extension does not decrypt DRM, extract license keys, break encryption, or bypass access controls. It only classifies media and subtitle HTTP(S) requests normally made by the browser. No external server, analytics, or telemetry is used.

## Installation

Open `chrome://extensions` → enable Developer mode → choose `Load unpacked` → select the `Vow` folder. Reload the extension from the extensions page after changing icons or extension files.
