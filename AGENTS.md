# Vow development guidelines

## Purpose

Vow is a local Chrome Manifest V3 extension that detects media and subtitle requests made by the active tab. New changes must preserve this scope.

## Architecture

- `background.js`: Listens to `webRequest` events, classifies request metadata and response headers through `detector.js`, and stores results by tab ID in `chrome.storage.local`.
- `detector.js`: The single source of truth for URL matching, Content-Type evaluation, scoring, media-type classification, and language detection.
- `popup.js`: Reads only the active tab’s results and renders the Video, Audio, and Subtitles sections.
- `popup.css`: Contains the dark theme, cards, buttons, and hidden scrollbar styles.
- `manifest.json`: Defines the MV3 service worker, permissions, popup, and PNG icons under `icons/`.

## Detection rules

- Do not rely only on the `.m3u8` extension.
- Evaluate URL path/query, Content-Type, and request context together.
- Generic `manifest`, `master`, `playlist`, or `index` names must not be treated as conclusive evidence by themselves.
- Audio detection may use audio/audio-only/sound/aac/m4a/mp3 signals and audio MIME types.
- Subtitle detection may use subtitle/subtitles/caption/captions/cc/text/vtt/srt/ass/ssa signals and subtitle MIME types.
- Do not guess a language when it cannot be determined; display `Unknown`.
- Store each full URL only once per tab.

## UI rules

- The popup must show results only for the active tab.
- Results must be grouped under `Video`, `Audio`, and `Subtitles`.
- Empty categories must remain hidden.
- URLs must never be truncated or have query/token data modified.
- New requests must appear while the popup is open through `storage.onChanged` and runtime notifications.
- Preserve the dark gray background, `#54A6C9` accent color, and rounded panels.

## Security boundaries

Do not add DRM bypassing, license-key extraction, response-body reading, encryption breaking, request modification, or access-control bypassing. Do not add external servers, telemetry, or analytics.

## Verification after changes

1. Validate `manifest.json` as JSON.
2. Reload the extension from `chrome://extensions`.
3. Test Video, Audio, and Subtitles separately on a media page.
4. Verify that duplicate URLs are not listed and new requests appear while the popup is open.
5. Verify that Copy returns the complete URL, including long query tokens.
