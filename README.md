# Vow

Vow is a Chrome Manifest V3 extension that detects video, audio, and subtitle media requests from the active tab. It works locally and does not use an external server, analytics, or telemetry.

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
│  ├─ icon-16x16.png
│  ├─ icon-32x32.png
│  ├─ icon-192x192.png
│  └─ icon-512x512.png
├─ README.md
└─ AGENTS.md
```

The previously created landing page is not part of the current project.

## Features

- Detects HLS/M3U8 master and media playlists.
- Detects audio-only playlists and audio-related requests.
- Detects `.vtt`, `.srt`, `.ass`, `.ssa`, and subtitle playlist requests.
- Uses URL path/query, Content-Type, request type, and request context together instead of relying only on file extensions.
- Classifies results as Video, Audio, or Subtitles.
- Attempts to identify language from URL signals; displays `Unknown` when unavailable.
- Shows the full URL without trimming query strings or tokens.
- Prevents duplicate URLs per tab.
- Associates results with the active tab.
- Updates the popup when new requests arrive during playback.
- Provides Copy, Open in new tab, Clear, and Reload active page actions.
- Uses the PNG assets in `icons/` for the extension icon.

## Manifest V3 permissions

- `webRequest`: Observes request URLs and response headers.
- `tabs`: Reads the active tab ID/title and reloads the active page.
- `storage`: Persists results and shares them between the service worker and popup.
- `host_permissions: ["<all_urls>"]`: Allows observation of HTTP(S) requests on visited sites.

Vow uses `webRequest` for observation only. It does not block or modify requests and does not read response bodies. If response headers are unavailable, URL and request-context signals remain available.

## Security and scope

Vow does not decrypt DRM, extract license keys, break encryption, or bypass access controls. It only classifies media and subtitle HTTP(S) requests normally made by the browser.

## Installation

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Select `Load unpacked`.
4. Choose the Vow project folder.

Reload the extension from the extensions page after changing source files or icons.

## GitHub

Repository: <https://github.com/cmehmetd/vow>
