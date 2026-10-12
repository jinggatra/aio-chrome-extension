const DEFAULT_APPS = [
  { id: "pinterest", name: "Pinterest", url: "https://www.pinterest.com/", category: "Kreatif", symbol: "P", color: "#E60023" },
  { id: "canva", name: "Canva", url: "https://www.canva.com/", category: "Kreatif", symbol: "C", color: "#7D2AE8" },
  { id: "chatgpt", name: "ChatGPT", url: "https://chatgpt.com/", category: "Produktivitas", symbol: "✳", color: "#10A37F" },
  { id: "youtube", name: "YouTube", url: "https://www.youtube.com/", category: "Video", symbol: "▶", color: "#FF0033" },
  { id: "google-drive", name: "Google Drive", url: "https://drive.google.com/", category: "Penyimpanan", symbol: "▲", color: "#4285F4" }
];
const COLORS = ["#6258E8", "#E60023", "#7D2AE8", "#10A37F", "#F59E0B", "#0284C7", "#E45B87", "#475569", "#16A34A"];

const els = {
  search: document.querySelector("#searchInput"),
  filters: document.querySelector("#categoryFilters"),
  grid: document.querySelector("#appsGrid"),
  count: document.querySelector("#appCount"),
  title: document.querySelector("#sectionTitle"),
  empty: document.querySelector("#emptyState"),
  dialog: document.querySelector("#appDialog"),
  form: document.querySelector("#appForm"),
  dialogTitle: document.querySelector("#dialogTitle"),
  editingId: document.querySelector("#editingId"),
  name: document.querySelector("#nameInput"),
  url: document.querySelector("#urlInput"),
  category: document.querySelector("#categoryInput"),
  symbol: document.querySelector("#symbolInput"),
  color: document.querySelector("#colorInput"),
  colorChoices: document.querySelector("#colorChoices"),
  formError: document.querySelector("#formError"),
  themeToggle: document.querySelector("#themeToggle")
};
let apps = [];
let activeCategory = "Semua";
let selectedColor = COLORS[0];

function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `app-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function initialize() {
  const stored = await chrome.storage.local.get(["apps", "theme"]);
  apps = Array.isArray(stored.apps) ? stored.apps : DEFAULT_APPS.map(app => ({ ...app }));
  if (!Array.isArray(stored.apps)) await saveApps();
  setTheme(stored.theme || "light");
  renderColorChoices();
  render();
}

async function saveApps() {
  await chrome.storage.local.set({ apps });
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  els.themeToggle.textContent = theme === "dark" ? "☀" : "☾";
  els.themeToggle.title = theme === "dark" ? "Gunakan tema terang" : "Gunakan tema gelap";
  chrome.storage.local.set({ theme }).catch(() => {});
}

function getCategories() {
  return ["Semua", ...new Set(apps.map(app => app.category).filter(Boolean).sort((a, b) => a.localeCompare(b, "id")))];
}

function renderFilters() {
  els.filters.replaceChildren();
  getCategories().forEach(category => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-button${activeCategory === category ? " active" : ""}`;
    button.textContent = category;
    button.setAttribute("aria-pressed", String(activeCategory === category));
    button.addEventListener("click", () => {
      activeCategory = category;
      render();
    });
    els.filters.append(button);
  });
  if (!getCategories().includes(activeCategory)) activeCategory = "Semua";
}

function filteredApps() {
  const query = els.search.value.trim().toLocaleLowerCase("id");
  return apps.filter(app => {
    const matchesCategory = activeCategory === "Semua" || app.category === activeCategory;
    const matchesSearch = !query || [app.name, app.url, app.category].some(value => String(value || "").toLocaleLowerCase("id").includes(query));
    return matchesCategory && matchesSearch;
  }).sort((a, b) => a.name.localeCompare(b.name, "id"));
}

function render() {
  renderFilters();
  const visibleApps = filteredApps();
  els.grid.replaceChildren();
  els.count.textContent = `${visibleApps.length} dari ${apps.length} aplikasi`;
  els.title.textContent = activeCategory === "Semua" ? "Aplikasi favorit" : activeCategory;
  els.empty.hidden = visibleApps.length > 0;
  els.grid.hidden = visibleApps.length === 0;
  visibleApps.forEach(app => els.grid.append(createCard(app)));
}

function createCard(app) {
  const template = document.querySelector("#appCardTemplate");
  const card = template.content.firstElementChild.cloneNode(true);
  const icon = card.querySelector(".app-icon");
  icon.textContent = app.symbol || "✦";
  icon.style.background = app.color || COLORS[0];
  card.querySelector(".app-name").textContent = app.name;
  card.querySelector(".app-category").textContent = app.category;
  try {
    card.querySelector(".site-host").textContent = new URL(app.url).hostname.replace(/^www\./, "");
  } catch {
    card.querySelector(".site-host").textContent = app.url;
  }
  card.querySelector(".card-main").addEventListener("click", () => launchApp(app));
  card.querySelector(".edit-action").addEventListener("click", () => openEditDialog(app));
  card.querySelector(".delete-action").addEventListener("click", () => deleteApp(app));
  card.querySelector(".card-main").setAttribute("aria-label", `Buka ${app.name}`);
  return card;
}

function launchApp(app) {
  let url;
  try {
    url = new URL(app.url);
  } catch {
    alert("Alamat aplikasi ini tidak valid. Silakan edit URL-nya.");
    return;
  }
  if (!["https:", "http:"].includes(url.protocol)) {
    alert("Untuk keamanan, hanya alamat website http:// atau https:// yang diizinkan.");
    return;
  }
  chrome.tabs.create({ url: url.href });
}

function openAddDialog() {
  els.form.reset();
  els.editingId.value = "";
  els.dialogTitle.textContent = "Tambah aplikasi";
  els.symbol.value = "✦";
  selectedColor = COLORS[0];
  els.color.value = selectedColor;
  els.formError.textContent = "";
  renderColorChoices();
  els.dialog.showModal();
  els.name.focus();
}

function openEditDialog(app) {
  els.form.reset();
  els.editingId.value = app.id;
  els.dialogTitle.textContent = "Edit aplikasi";
  els.name.value = app.name;
  els.url.value = app.url;
  els.category.value = app.category;
  els.symbol.value = app.symbol || "✦";
  selectedColor = app.color || COLORS[0];
  els.color.value = selectedColor;
  els.formError.textContent = "";
  renderColorChoices();
  els.dialog.showModal();
  els.name.focus();
}

function renderColorChoices() {
  els.colorChoices.replaceChildren();
  COLORS.forEach(color => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `color-choice${color === selectedColor ? " selected" : ""}`;
    button.style.background = color;
    button.setAttribute("aria-label", `Pilih warna ${color}`);
    button.setAttribute("aria-pressed", String(color === selectedColor));
    button.addEventListener("click", () => {
      selectedColor = color;
      els.color.value = color;
      renderColorChoices();
    });
    els.colorChoices.append(button);
  });
}

async function handleSubmit(event) {
  event.preventDefault();
  els.formError.textContent = "";
  const name = els.name.value.trim();
  const rawUrl = els.url.value.trim();
  const category = els.category.value;
  const symbol = els.symbol.value.trim() || "✦";
  let parsedUrl;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    els.formError.textContent = "Masukkan alamat website yang valid, misalnya https://example.com";
    return;
  }
  if (!["https:", "http:"].includes(parsedUrl.protocol)) {
    els.formError.textContent = "URL harus diawali https:// atau http://.";
    return;
  }
  if (!name) {
    els.formError.textContent = "Nama aplikasi wajib diisi.";
    return;
  }
  const id = els.editingId.value;
  const app = { id: id || makeId(), name, url: parsedUrl.href, category, symbol, color: selectedColor };
  if (id) {
    apps = apps.map(item => item.id === id ? app : item);
  } else {
    apps.push(app);
  }
  await saveApps();
  activeCategory = "Semua";
  els.search.value = "";
  els.dialog.close();
  render();
}

async function deleteApp(app) {
  if (!confirm(`Hapus "${app.name}" dari launcher?`)) return;
  apps = apps.filter(item => item.id !== app.id);
  await saveApps();
  render();
}

els.form.addEventListener("submit", handleSubmit);
document.querySelector("#addAppButton").addEventListener("click", openAddDialog);
document.querySelector("#closeDialogButton").addEventListener("click", () => els.dialog.close());
document.querySelector("#cancelButton").addEventListener("click", () => els.dialog.close());
document.querySelector("#clearFiltersButton").addEventListener("click", () => {
  activeCategory = "Semua";
  els.search.value = "";
  render();
});
els.search.addEventListener("input", render);
els.themeToggle.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});
document.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    els.search.focus();
  }
  if (event.key === "Escape" && els.dialog.open) els.dialog.close();
});

initialize().catch(error => {
  console.error("Gagal memuat My App Launcher:", error);
  els.count.textContent = "Gagal memuat data. Coba muat ulang ekstensi.";
});