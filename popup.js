import { displayCategory } from "./detector.js";

const $ = (id) => document.getElementById(id);
let current = [];
let activeTabTitle = "Aktif sekme";

async function load() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const data = (await chrome.storage.local.get("vowResults")).vowResults || {};
  activeTabTitle = tab?.title || "Aktif sekme";
  current = data[tab?.id] || [];
  current = current.filter((x) => x.category !== "suspicious");
  render();
}
function card(item) { const el = document.createElement("article"); el.className = "item"; el.innerHTML = `<div class="label"></div><div class="url"></div><button class="copy">Kopyala</button><button class="open">Yeni sekmede aç</button>`; el.querySelector(".label").textContent = `${activeTabTitle} · ${item.language || "Bilinmeyen"}`; el.querySelector(".url").textContent = item.url; el.querySelector(".copy").onclick = () => navigator.clipboard.writeText(item.url).then(() => $("status").textContent = "URL kopyalandı."); el.querySelector(".open").onclick = () => chrome.tabs.create({ url: item.url }); return el; }
function render() { for (const type of ["video", "audio", "subtitle"]) { const items = current.filter((x) => x.mediaType === type); $(`${type}Results`).replaceChildren(...items.map(card)); $(`${type}Section`).hidden = !items.length; } $("status").textContent = current.length ? `${current.length} bağlantı bulundu.` : ""; }
$("clear").onclick = async () => { const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); const data = (await chrome.storage.local.get("vowResults")).vowResults || {}; delete data[tab?.id]; await chrome.storage.local.set({ vowResults: data }); current = []; render(); };
$("refresh").onclick = async () => { const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); if (tab?.id !== undefined) await chrome.tabs.reload(tab.id); };
chrome.storage.onChanged.addListener(load);
chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "vow-result-added") load();
});
load();
