const HLS_TYPES = [
  "application/vnd.apple.mpegurl",
  "application/x-mpegurl",
  "application/mpegurl",
  "audio/mpegurl",
  "audio/x-mpegurl",
  "vnd.apple.mpegurl"
];

const HLS_WORDS = /(?:^|[\W_])(m3u8|manifest|master|playlist|index)(?:$|[\W_])/i;
const AUDIO_WORDS = /(?:^|[\W_])(audio|audio-only|sound|aac|m4a|mp3)(?:$|[\W_])/i;
const SUBTITLE_WORDS = /(?:^|[\W_])(subtitle|subtitles|caption|captions|cc|text|vtt|srt|ass|ssa)(?:$|[\W_])/i;
const LANGUAGE_CODES = /(?:^|[\W_])(tr|en|de|ar|fr|es|it|pt|ru|ja|ko|zh)(?:$|[\W_])/i;

function headerValue(headers, name) {
  const item = (headers || []).find((h) => h.name?.toLowerCase() === name);
  return item?.value?.toLowerCase() || "";
}

export function classifyRequest(url, responseHeaders = [], context = {}) {
  let parsed;
  try { parsed = new URL(url); } catch { return { category: "suspicious", score: 0, reasons: ["Geçersiz URL"] }; }

  const contentType = headerValue(responseHeaders, "content-type");
  const haystack = `${parsed.pathname} ${parsed.search}`;
  const hasM3u8 = /m3u8/i.test(haystack);
  const hasHlsWord = HLS_WORDS.test(haystack);
  const exactPlaylistName = /(?:^|\/)(?:manifest|master|playlist|index)(?:\.[^/?#]+)?$/i.test(parsed.pathname);
  const hlsType = HLS_TYPES.some((type) => contentType.includes(type)) ||
    (/mpegurl|m3u8|apple\.mpegurl/i.test(contentType));
  const mediaContext = /media|video|stream|playlist|manifest|xhr|fetch/i.test(
    `${context.type || ""} ${context.initiator || ""}`
  );
  const audioSignal = AUDIO_WORDS.test(haystack) || /audio\//i.test(contentType);
  const subtitleSignal = SUBTITLE_WORDS.test(haystack) || /text\/|subrip|ttml|webvtt|vtt|x-subrip/i.test(contentType);
  const subtitleFile = /\.(vtt|srt|ass|ssa)(?:[?#]|$)/i.test(url);
  const audioFile = /\.(aac|m4a|mp3)(?:[?#]|$)/i.test(url);

  let score = 0;
  const reasons = [];
  if (hlsType) { score += 75; reasons.push("HLS Content-Type"); }
  if (hasM3u8) { score += 55; reasons.push("URL içinde m3u8"); }
  if (exactPlaylistName) { score += 25; reasons.push("playlist adlandırması"); }
  else if (hasHlsWord) { score += 15; reasons.push("URL içinde HLS göstergesi"); }
  if (mediaContext) { score += 10; reasons.push("medya/istek bağlamı"); }
  if (audioSignal || audioFile) { score += 25; reasons.push("ses sinyali"); }
  if (subtitleSignal || subtitleFile) { score += 35; reasons.push("altyazı sinyali"); }

  // Genel adlar Content-Type desteği yokken tek başına kesin kanıt değildir.
  if (!hlsType && !hasM3u8 && exactPlaylistName) score = Math.min(score, 55);
  score = Math.min(score, 100);
  const category = score >= 75 ? "certain" : score >= 45 ? "probable" : "suspicious";
  const mediaType = subtitleSignal || subtitleFile ? "subtitle" : audioSignal || audioFile ? "audio" : "video";
  const language = (haystack.match(LANGUAGE_CODES)?.[1] || "Unknown").toLowerCase();
  return { category, mediaType, language, score, reasons, contentType };
}

export function displayCategory(mediaType) { return { video: "Video", audio: "Ses", subtitle: "Altyazı" }[mediaType] || "Video"; }
