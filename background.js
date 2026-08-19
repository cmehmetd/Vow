import { classifyRequest } from "./detector.js";

const requests = new Map();
const MAX_PER_TAB = 200;

async function getAll() {
  return (await chrome.storage.local.get("vowResults")).vowResults || {};
}

async function save(tabId, url, result) {
  if (tabId < 0 || !url) return;
  const all = await getAll();
  const list = all[tabId] || [];
  if (list.some((item) => item.url === url)) return;
  list.unshift({ url, ...result, firstSeen: Date.now() });
  all[tabId] = list.slice(0, MAX_PER_TAB);
  await chrome.storage.local.set({ vowResults: all });
  chrome.runtime.sendMessage({ type: "vow-result-added", tabId }).catch(() => {});
}

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.tabId >= 0) requests.set(details.requestId, { tabId: details.tabId, url: details.url, type: details.type, initiator: details.initiator });
  },
  { urls: ["<all_urls>"] }
);

chrome.webRequest.onHeadersReceived.addListener(
  async (details) => {
    const request = requests.get(details.requestId) || details;
    const result = classifyRequest(request.url, details.responseHeaders, request);
    if (result.category !== "suspicious") await save(request.tabId, request.url, result);
    requests.delete(details.requestId);
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

chrome.webRequest.onErrorOccurred.addListener((details) => requests.delete(details.requestId), { urls: ["<all_urls>"] });
chrome.tabs.onRemoved.addListener(async (tabId) => {
  const all = await getAll();
  delete all[tabId];
  await chrome.storage.local.set({ vowResults: all });
});
