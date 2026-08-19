import { displayCategory } from "./detector.js";

const $ = (id) => document.getElementById(id);
let current = [];
let activeTabTitle = "Active tab";

async function load() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const data = (await chrome.storage.local.get("vowResults")).vowResults || {};
  activeTabTitle = tab?.title || "Active tab";
  current = (data[tab?.id] || []).filter((x) => x.category !== "suspicious");
  render();
}

function card(item) {
  const el = document.createElement("article");
  el.className = "item";
  el.innerHTML = `<div class="label"></div><div class="url"></div><button class="copy">Copy</button><button class="previewToggle">Preview</button><div class="preview" hidden></div>`;
  el.querySelector(".label").textContent = `${activeTabTitle} · ${item.language || "Unknown"}`;
  el.querySelector(".url").textContent = item.url;
  el.querySelector(".copy").onclick = () => navigator.clipboard.writeText(item.url).then(() => $("status").textContent = "URL copied.");
  const preview = el.querySelector(".preview");
  el.querySelector(".previewToggle").onclick = async () => {
    if (!preview.hidden) { preview.replaceChildren(); preview.hidden = true; return; }
    if (item.mediaType === "subtitle") {
      const message = document.createElement("p");
      message.textContent = "Loading subtitle preview…";
      preview.append(message);
      preview.hidden = false;
      try {
        const response = await fetch(item.url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = document.createElement("pre");
        text.textContent = await response.text();
        preview.replaceChildren(text);
      } catch {
        message.textContent = "Subtitle preview could not be loaded.";
      }
      return;
    } else {
      const player = document.createElement(item.mediaType === "audio" ? "audio" : "video");
      player.controls = true; player.preload = "metadata"; player.src = item.url;
      preview.append(player);
    }
    preview.hidden = false;
  };
  return el;
}

function render() { for (const type of ["video", "audio", "subtitle"]) { const items = current.filter((x) => x.mediaType === type); $(`${type}Results`).replaceChildren(...items.map(card)); $(`${type}Section`).hidden = !items.length; } $("status").textContent = current.length ? `${current.length} results found.` : ""; }
$("clear").onclick = async () => { const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); const data = (await chrome.storage.local.get("vowResults")).vowResults || {}; delete data[tab?.id]; await chrome.storage.local.set({ vowResults: data }); current = []; render(); };
$("refresh").onclick = async () => { const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); if (tab?.id !== undefined) await chrome.tabs.reload(tab.id); };
chrome.storage.onChanged.addListener(load);
chrome.runtime.onMessage.addListener((message) => { if (message?.type === "vow-result-added") load(); });
load();
