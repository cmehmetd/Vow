# Vow development guidelines

## Scope

Vow is a local Chrome Manifest V3 extension for detecting media and subtitle HTTP(S) requests made by the active tab. The landing page is not part of the current project.

## Architecture

- `background.js`: Observes `webRequest` events, passes request metadata and response headers to `detector.js`, stores results by tab ID, and notifies an open popup about new results.
- `detector.js`: Single source of truth for URL signals, Content-Type signals, scoring, media classification, and language detection.
- `popup.js`: Reads active-tab results, renders Video/Audio/Subtitles sections, copies URLs, opens URLs, clears results, and reloads the active page.
- `popup.html`: English user interface structure.
- `popup.css`: Dark gray theme, `#54A6C9` accent color, rounded controls/panels, and hidden scrollbars.
- `manifest.json`: Manifest V3 configuration, permissions, service worker, popup, and PNG icon references.
- `icons/`: Extension icon assets in PNG format.

## Detection rules

- Do not depend only on `.m3u8`, `.vtt`, `.srt`, `.ass`, or `.ssa` extensions.
- Combine URL path/query, Content-Type, request type, and request context.
- Generic names such as `manifest`, `master`, `playlist`, `index`, `audio`, or `caption` are signals, not conclusive proof by themselves.
- Audio signals include `audio`, `audio-only`, `sound`, `aac`, `m4a`, and `mp3`.
- Subtitle signals include `subtitle`, `subtitles`, `caption`, `captions`, `cc`, `text`, `vtt`, `srt`, `ass`, and `ssa`.
- Show `Unknown` when a language cannot be determined; do not guess.
- Store each full URL only once per tab.

## UI rules

- Use English for all user-facing extension text.
- Show results only for the active tab.
- Group results under `Video`, `Audio`, and `Subtitles`.
- Hide empty categories and the status message when there are no results.
- Preserve full URLs, including query parameters and long tokens.
- Keep live updates working through both `chrome.storage.onChanged` and runtime messages.
- Preserve the dark gray styling, `#54A6C9` accent, rounded panels, and PNG extension icons.

## Security boundaries

Do not add DRM bypassing, license-key extraction, response-body reading, encryption breaking, request modification, or access-control bypassing. Do not add external servers, telemetry, or analytics.

## Verification

1. Validate `manifest.json` as JSON.
2. Reload the extension at `chrome://extensions`.
3. Test video, audio, and subtitle requests separately.
4. Verify duplicate URLs are suppressed.
5. Verify new requests appear while playback continues and the popup remains open.
6. Verify Copy returns the complete URL.
7. Confirm all icon paths in `manifest.json` exist under `icons/`.

## Git workflow

The GitHub repository is `https://github.com/cmehmetd/vow.git`. Keep commits focused and inspect `git status` before pushing. Never use force push unless explicitly requested.
