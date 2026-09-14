const STORAGE_KEY = "bookmarks";
const SETTINGS_KEY = "markly-settings";

const state = {
  bookmarks: [],
  activeView: "overview",
  activeCategory: "",
  search: "",
  sort: "newest",
  viewMode: "grid",
  editingId: null,
  pendingDeleteId: null,
  undoBookmark: null
};

const els = {
  list: document.getElementById("bookmark-list"),
  template: document.getElementById("bookmark-template"),
  form: document.getElementById("bookmark-form"),
  modal: document.getElementById("bookmark-modal"),
  confirmModal: document.getElementById("confirm-modal"),
  settingsModal: document.getElementById("settings-modal"),
  name: document.getElementById("bookmark-name"),
  url: document.getElementById("bookmark-url"),
  category: document.getElementById("bookmark-category"),
  tags: document.getElementById("bookmark-tags"),
  notes: document.getElementById("bookmark-notes"),
  id: document.getElementById("bookmark-id"),
  modalTitle: document.getElementById("modal-title"),
  modalSubmit: document.getElementById("modal-submit"),
  search: document.getElementById("search-input"),
  sort: document.getElementById("sort-select"),
  activeFilters: document.getElementById("active-filters"),
  categoryNav: document.getElementById("category-nav"),
  toastRegion: document.getElementById("toast-region"),
  sidebar: document.getElementById("sidebar"),
  backdrop: document.getElementById("mobile-backdrop")
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  loadSettings();
  loadBookmarks();
  bindEvents();
  renderAll();
}

function bindEvents() {
  document.getElementById("add-bookmark-btn").addEventListener("click", () => openBookmarkModal());
  document.getElementById("quick-add-btn").addEventListener("click", () => openBookmarkModal());
  document.getElementById("modal-close").addEventListener("click", closeBookmarkModal);
  document.getElementById("modal-cancel").addEventListener("click", closeBookmarkModal);
  els.form.addEventListener("submit", handleFormSubmit);

  document.getElementById("confirm-cancel").addEventListener("click", closeConfirmModal);
  document.getElementById("confirm-delete").addEventListener("click", confirmDelete);

  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
  document.getElementById("settings-theme-btn").addEventListener("click", toggleTheme);
  document.getElementById("settings-btn").addEventListener("click", () => openModal(els.settingsModal));
  document.getElementById("avatar-btn").addEventListener("click", () => openModal(els.settingsModal));

  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", () => closeModal(document.getElementById(btn.dataset.closeModal)));
  });

  document.getElementById("export-btn").addEventListener("click", exportBookmarks);
  document.getElementById("import-btn").addEventListener("click", () => document.getElementById("import-file").click());
  document.getElementById("import-file").addEventListener("change", importBookmarks);
  document.getElementById("clear-all-btn").addEventListener("click", requestClearAll);

  els.search.addEventListener("input", () => {
    state.search = els.search.value.trim().toLowerCase();
    state.activeView = state.activeView === "overview" ? "all" : state.activeView;
    renderAll();
  });

  els.sort.addEventListener("change", () => {
    state.sort = els.sort.value;
    saveSettings();
    renderList();
  });

  document.querySelectorAll("[data-view-mode]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.viewMode = btn.dataset.viewMode;
      saveSettings();
      updateViewButtons();
      renderList();
    });
  });

  document.querySelectorAll(".nav-item[data-view]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.activeView = btn.dataset.view;
      state.activeCategory = "";
      closeMobileNav();
      renderAll();
    });
  });

  document.getElementById("mobile-menu").addEventListener("click", openMobileNav);
  document.getElementById("sidebar-close").addEventListener("click", closeMobileNav);
  els.backdrop.addEventListener("click", closeMobileNav);

  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleKeyboard);
}

function loadBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    state.bookmarks = Array.isArray(parsed) ? parsed.map(normalizeBookmark).filter(Boolean) : [];
  } catch {
    state.bookmarks = [];
    showToast("Could not read saved bookmarks.", "error");
  }
}

function normalizeBookmark(item) {
  if (!item || typeof item !== "object" || !item.url) return null;

  const title = String(item.title ?? item.name ?? "Untitled Bookmark").trim() || "Untitled Bookmark";
  let url = String(item.url).trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

  return {
    id: String(item.id || createId()),
    title,
    name: title,
    url,
    category: String(item.category || "").trim(),
    tags: Array.isArray(item.tags)
      ? item.tags.map(String).map(t => t.trim()).filter(Boolean)
      : String(item.tags || "").split(",").map(t => t.trim()).filter(Boolean),
    notes: String(item.notes || "").trim(),
    favorite: Boolean(item.favorite),
    createdAt: Number(item.createdAt) || Date.now(),
    updatedAt: Number(item.updatedAt) || Number(item.createdAt) || Date.now()
  };
}

function saveBookmarks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.bookmarks));
  updateStorageStatus();
}

function saveSettings() {
  const settings = {
    theme: document.documentElement.dataset.theme || "light",
    viewMode: state.viewMode,
    sort: state.sort
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function loadSettings() {
  try {
    const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    const theme = settings.theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    state.viewMode = settings.viewMode === "list" ? "list" : "grid";
    state.sort = ["newest", "oldest", "az", "za", "favorites"].includes(settings.sort) ? settings.sort : "newest";
    els.sort.value = state.sort;
  } catch {
    document.documentElement.dataset.theme = "light";
  }
}

function renderAll() {
  updateNavigation();
  updateStats();
  updatePageHeader();
  updateViewButtons();
  renderList();
  updateStorageStatus();
}

function updateNavigation() {
  document.querySelectorAll(".nav-item[data-view]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === state.activeView && !state.activeCategory);
  });

  const categories = getCategories();
  const counts = getCategoryCounts();
  els.categoryNav.innerHTML = "";

  categories.forEach(category => {
    const button = document.createElement("button");
    button.className = "nav-item category-nav-item" + (state.activeCategory === category ? " active" : "");
    button.innerHTML = `
      <span class="category-dot" aria-hidden="true"></span>
      <span>${escapeHtml(category)}</span>
      <span class="nav-count">${counts[category]}</span>
    `;
    button.addEventListener("click", () => {
      state.activeView = "category";
      state.activeCategory = category;
      closeMobileNav();
      renderAll();
    });
    els.categoryNav.appendChild(button);
  });

  document.getElementById("all-count").textContent = state.bookmarks.length;
  document.getElementById("favorite-count").textContent = state.bookmarks.filter(b => b.favorite).length;
}

function updateStats() {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  document.getElementById("stat-total").textContent = state.bookmarks.length;
  document.getElementById("stat-favorites").textContent = state.bookmarks.filter(b => b.favorite).length;
  document.getElementById("stat-categories").textContent = getCategories().length;
  document.getElementById("stat-recent").textContent = state.bookmarks.filter(b => b.createdAt >= weekAgo).length;
}

function updatePageHeader() {
  const title = document.getElementById("page-title");
  const subtitle = document.getElementById("page-subtitle");
  const listTitle = document.getElementById("list-title");
  const listDescription = document.getElementById("list-description");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (state.activeCategory) {
    title.textContent = state.activeCategory;
    subtitle.textContent = `Bookmarks collected in your ${state.activeCategory.toLowerCase()} collection.`;
    listTitle.textContent = state.activeCategory;
    listDescription.textContent = "Everything saved in this collection.";
    return;
  }

  if (state.activeView === "favorites") {
    title.textContent = "Your Favorites";
    subtitle.textContent = "The links you want to keep closest at hand.";
    listTitle.textContent = "Favorite Bookmarks";
    listDescription.textContent = "Your most important saved resources.";
  } else if (state.activeView === "recent") {
    title.textContent = "Recently Added";
    subtitle.textContent = "Your latest saved resources, ready when you need them.";
    listTitle.textContent = "Recent Bookmarks";
    listDescription.textContent = "The latest links added to your workspace.";
  } else if (state.activeView === "all") {
    title.textContent = "All Bookmarks";
    subtitle.textContent = "Browse, search and organize everything you've saved.";
    listTitle.textContent = state.search ? "Search Results" : "All Bookmarks";
    listDescription.textContent = state.search ? `Matching "${state.search}"` : "Everything you've saved in one place.";
  } else {
    title.innerHTML = `${greeting} <span aria-hidden="true">👋</span>`;
    subtitle.textContent = "Keep your favorite resources organized and easy to access.";
    listTitle.textContent = "Your Bookmarks";
    listDescription.textContent = "Everything you've saved in one place.";
  }
}

function getVisibleBookmarks() {
  let items = [...state.bookmarks];

  if (state.activeCategory) {
    items = items.filter(b => b.category === state.activeCategory);
  } else if (state.activeView === "favorites") {
    items = items.filter(b => b.favorite);
  } else if (state.activeView === "recent") {
    items.sort((a, b) => b.createdAt - a.createdAt);
    items = items.slice(0, 20);
  }

  if (state.search) {
    items = items.filter(b => {
      const haystack = [
        b.title, b.url, getDomain(b.url), b.category, b.tags.join(" "), b.notes
      ].join(" ").toLowerCase();
      return haystack.includes(state.search);
    });
  }

  switch (state.sort) {
    case "oldest": items.sort((a, b) => a.createdAt - b.createdAt); break;
    case "az": items.sort((a, b) => a.title.localeCompare(b.title)); break;
    case "za": items.sort((a, b) => b.title.localeCompare(a.title)); break;
    case "favorites": items.sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.createdAt - a.createdAt); break;
    default: items.sort((a, b) => b.createdAt - a.createdAt);
  }

  return items;
}

function renderList() {
  els.list.className = `bookmark-grid ${state.viewMode === "list" ? "list-view" : ""}`;
  els.list.innerHTML = "";

  const items = getVisibleBookmarks();
  renderActiveFilters();

  if (!items.length) {
    els.list.appendChild(createEmptyState());
    return;
  }

  items.forEach((bookmark, index) => {
    const card = createBookmarkCard(bookmark);
    card.style.animationDelay = `${Math.min(index * 25, 180)}ms`;
    els.list.appendChild(card);
  });
}

function createBookmarkCard(bookmark) {
  const card = els.template.content.firstElementChild.cloneNode(true);
  card.dataset.id = bookmark.id;

  const img = card.querySelector(".site-icon img");
  const iconBox = card.querySelector(".site-icon");
  const domain = getDomain(bookmark.url);
  const favicon = getFaviconUrl(bookmark.url);

  img.src = favicon;
  img.alt = "";
  img.addEventListener("error", () => iconBox.classList.add("fallback"), { once: true });

  card.querySelector(".bookmark-title").textContent = bookmark.title;
  card.querySelector(".bookmark-title").href = bookmark.url;
  card.querySelector(".bookmark-domain").textContent = domain;
  card.querySelector(".bookmark-notes").textContent = bookmark.notes;

  const category = card.querySelector(".category-pill");
  category.textContent = bookmark.category;

  const tags = card.querySelector(".tag-list");
  bookmark.tags.slice(0, 2).forEach(tag => {
    const tagEl = document.createElement("span");
    tagEl.className = "tag";
    tagEl.textContent = `#${tag}`;
    tags.appendChild(tagEl);
  });

  card.querySelector(".bookmark-date").textContent = formatRelativeDate(bookmark.createdAt);

  const favorite = card.querySelector(".favorite-btn");
  favorite.classList.toggle("active", bookmark.favorite);
  favorite.setAttribute("aria-label", bookmark.favorite ? "Remove from favorites" : "Add to favorites");
  favorite.addEventListener("click", e => {
    e.stopPropagation();
    toggleFavorite(bookmark.id);
  });

  card.querySelector(".more-btn").addEventListener("click", e => {
    e.stopPropagation();
    closeAllMenus();
    const menu = card.querySelector(".context-menu");
    menu.classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", menu.classList.contains("open"));
  });

  card.querySelectorAll(".context-menu button").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      handleCardAction(btn.dataset.action, bookmark.id);
    });
  });

  const openLink = card.querySelector(".open-link");
  openLink.href = bookmark.url;
  openLink.rel = "noopener noreferrer";

  card.querySelector(".card-edit").addEventListener("click", () => openBookmarkModal(bookmark.id));

  return card;
}

function handleCardAction(action, id) {
  closeAllMenus();
  if (action === "open") {
    const bookmark = findBookmark(id);
    if (bookmark) window.open(bookmark.url, "_blank", "noopener,noreferrer");
  }
  if (action === "copy") copyBookmarkUrl(id);
  if (action === "edit") openBookmarkModal(id);
  if (action === "favorite") toggleFavorite(id);
  if (action === "delete") requestDelete(id);
}

function createEmptyState() {
  const wrap = document.createElement("div");
  wrap.className = "empty-state";
  const hasSearch = Boolean(state.search);

  let title = "Your bookmark space is empty";
  let message = "Save your first bookmark and keep your favorite resources organized.";
  let icon = "bookmark";

  if (hasSearch) {
    title = "No matching bookmarks";
    message = `We couldn't find anything matching "${state.search}". Try a different search.`;
    icon = "search";
  } else if (state.activeView === "favorites") {
    title = "No favorites yet";
    message = "Star the bookmarks you use most and they'll appear here.";
  } else if (state.activeView === "recent") {
    title = "Nothing recent";
    message = "Bookmarks you add will show up here.";
  } else if (state.activeCategory) {
    title = "This collection is empty";
    message = `Save a bookmark to the ${state.activeCategory} collection to see it here.`;
  }

  wrap.innerHTML = `
    <div class="empty-icon">
      ${icon === "search"
        ? '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none"><path d="M7 4.75A2.75 2.75 0 0 1 9.75 2h7.5A2.75 2.75 0 0 1 20 4.75v14.5a1.75 1.75 0 0 1-2.86 1.36L13.5 17.6l-3.64 3.01A1.75 1.75 0 0 1 7 19.25V4.75Z" stroke="currentColor" stroke-width="1.8"/></svg>'}
    </div>
    <h3>${escapeHtml(title)}</h3>
    <p>${escapeHtml(message)}</p>
    ${hasSearch ? "" : '<button class="primary-btn empty-add">Add Bookmark</button>'}
  `;
  const add = wrap.querySelector(".empty-add");
  if (add) add.addEventListener("click", () => openBookmarkModal());
  return wrap;
}

function renderActiveFilters() {
  els.activeFilters.innerHTML = "";
  const chips = [];

  if (state.search) chips.push({ label: `Search: ${state.search}`, type: "search" });
  if (state.activeCategory) chips.push({ label: state.activeCategory, type: "category" });

  if (!chips.length) {
    els.activeFilters.hidden = true;
    return;
  }

  chips.forEach(chip => {
    const el = document.createElement("span");
    el.className = "filter-chip";
    el.innerHTML = `${escapeHtml(chip.label)} <button aria-label="Remove filter">×</button>`;
    el.querySelector("button").addEventListener("click", () => {
      if (chip.type === "search") {
        state.search = "";
        els.search.value = "";
      } else {
        state.activeCategory = "";
        state.activeView = "all";
      }
      renderAll();
    });
    els.activeFilters.appendChild(el);
  });

  els.activeFilters.hidden = false;
}

function handleFormSubmit(event) {
  event.preventDefault();

  const title = els.name.value.trim();
  let url = els.url.value.trim();

  if (!title || !url) {
    showToast("Please enter both a title and URL.", "error");
    return;
  }

  url = normalizeUrl(url);
  if (!isValidUrl(url)) {
    showToast("Please enter a valid website URL.", "error");
    els.url.focus();
    return;
  }

  const duplicate = state.bookmarks.find(b =>
    b.url.toLowerCase().replace(/\/$/, "") === url.toLowerCase().replace(/\/$/, "") &&
    b.id !== els.id.value
  );
  if (duplicate) {
    showToast("This URL is already saved in your bookmarks.", "error");
    return;
  }

  const now = Date.now();
  const tags = els.tags.value.split(",").map(tag => tag.trim()).filter(Boolean).slice(0, 8);

  if (state.editingId) {
    const bookmark = findBookmark(state.editingId);
    if (!bookmark) return;
    Object.assign(bookmark, {
      title,
      name: title,
      url,
      category: els.category.value.trim(),
      tags,
      notes: els.notes.value.trim(),
      updatedAt: now
    });
    saveBookmarks();
    closeBookmarkModal();
    renderAll();
    showToast("Bookmark updated successfully.");
  } else {
    const bookmark = {
      id: createId(),
      title,
      name: title,
      url,
      category: els.category.value.trim(),
      tags,
      notes: els.notes.value.trim(),
      favorite: false,
      createdAt: now,
      updatedAt: now
    };
    state.bookmarks.unshift(bookmark);
    saveBookmarks();
    closeBookmarkModal();
    state.activeView = "all";
    renderAll();
    showToast("Bookmark saved successfully.");
  }
}

function openBookmarkModal(id = null) {
  state.editingId = id;
  els.form.reset();
  els.id.value = "";
  els.modalTitle.textContent = id ? "Edit Bookmark" : "Add New Bookmark";
  els.modalSubmit.textContent = id ? "Save Changes" : "Save Bookmark";

  if (id) {
    const bookmark = findBookmark(id);
    if (!bookmark) return;
    els.id.value = bookmark.id;
    els.name.value = bookmark.title;
    els.url.value = bookmark.url.replace(/^https?:\/\//i, "");
    els.category.value = bookmark.category;
    els.tags.value = bookmark.tags.join(", ");
    els.notes.value = bookmark.notes;
  }

  openModal(els.modal);
  setTimeout(() => els.name.focus(), 30);
}

function closeBookmarkModal() {
  state.editingId = null;
  closeModal(els.modal);
}

function requestDelete(id) {
  const bookmark = findBookmark(id);
  if (!bookmark) return;

  state.pendingDeleteId = id;
  document.getElementById("confirm-text").textContent =
    `"${bookmark.title}" will be removed from your local collection.`;
  openModal(els.confirmModal);
}

function confirmDelete() {
  const bookmark = findBookmark(state.pendingDeleteId);
  if (!bookmark) {
    closeConfirmModal();
    return;
  }

  state.undoBookmark = { bookmark, index: state.bookmarks.findIndex(b => b.id === bookmark.id) };
  state.bookmarks = state.bookmarks.filter(b => b.id !== bookmark.id);
  saveBookmarks();
  closeConfirmModal();
  renderAll();

  showToast("Bookmark deleted.", "success", {
    label: "Undo",
    action: restoreDeletedBookmark
  });
  state.pendingDeleteId = null;
}

function restoreDeletedBookmark() {
  if (!state.undoBookmark) return;
  const { bookmark, index } = state.undoBookmark;
  state.bookmarks.splice(Math.max(0, index), 0, bookmark);
  saveBookmarks();
  state.undoBookmark = null;
  renderAll();
  showToast("Bookmark restored.");
}

function requestClearAll() {
  if (!state.bookmarks.length) {
    showToast("There are no bookmarks to clear.");
    return;
  }

  state.pendingDeleteId = "__all__";
  document.getElementById("confirm-title").textContent = "Clear all bookmarks?";
  document.getElementById("confirm-text").textContent = "This will permanently remove every locally stored bookmark.";
  openModal(els.confirmModal);
}

function confirmDelete() {
  if (state.pendingDeleteId === "__all__") {
    state.bookmarks = [];
    saveBookmarks();
    closeConfirmModal();
    closeModal(els.settingsModal);
    renderAll();
    showToast("All bookmarks cleared.");
    state.pendingDeleteId = null;
    return;
  }

  const bookmark = findBookmark(state.pendingDeleteId);
  if (!bookmark) {
    closeConfirmModal();
    return;
  }

  state.undoBookmark = { bookmark, index: state.bookmarks.findIndex(b => b.id === bookmark.id) };
  state.bookmarks = state.bookmarks.filter(b => b.id !== bookmark.id);
  saveBookmarks();
  closeConfirmModal();
  renderAll();

  showToast("Bookmark deleted.", "success", {
    label: "Undo",
    action: restoreDeletedBookmark
  });
  state.pendingDeleteId = null;
}

function toggleFavorite(id) {
  const bookmark = findBookmark(id);
  if (!bookmark) return;
  bookmark.favorite = !bookmark.favorite;
  bookmark.updatedAt = Date.now();
  saveBookmarks();
  renderAll();
  showToast(bookmark.favorite ? "Added to favorites." : "Removed from favorites.");
}

async function copyBookmarkUrl(id) {
  const bookmark = findBookmark(id);
  if (!bookmark) return;

  try {
    await navigator.clipboard.writeText(bookmark.url);
    showToast("Link copied to clipboard.");
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = bookmark.url;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    showToast("Link copied to clipboard.");
  }
}

function exportBookmarks() {
  if (!state.bookmarks.length) {
    showToast("There are no bookmarks to export.");
    return;
  }

  const payload = {
    app: "Markly",
    version: 1,
    exportedAt: new Date().toISOString(),
    bookmarks: state.bookmarks
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `markly-bookmarks-${new Date().toISOString().slice(0,10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Bookmarks exported successfully.");
}

function importBookmarks(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const incoming = Array.isArray(parsed) ? parsed : parsed.bookmarks;
      if (!Array.isArray(incoming)) throw new Error("Invalid format");

      const normalized = incoming.map(normalizeBookmark).filter(Boolean);
      const existingUrls = new Set(state.bookmarks.map(b => b.url.toLowerCase().replace(/\/$/, "")));
      const fresh = normalized.filter(b => !existingUrls.has(b.url.toLowerCase().replace(/\/$/, "")));

      state.bookmarks.push(...fresh);
      saveBookmarks();
      renderAll();
      showToast(`${fresh.length} bookmark${fresh.length === 1 ? "" : "s"} imported.`);
    } catch {
      showToast("That JSON file is not a valid Markly backup.", "error");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  saveSettings();
}

function updateViewButtons() {
  document.querySelectorAll("[data-view-mode]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.viewMode === state.viewMode);
  });
}

function openModal(modal) {
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal(modal) {
  modal.hidden = true;
  if ([els.modal, els.confirmModal, els.settingsModal].every(m => m.hidden)) {
    document.body.style.overflow = "";
  }
}

function closeConfirmModal() {
  closeModal(els.confirmModal);
  state.pendingDeleteId = null;
  document.getElementById("confirm-title").textContent = "Delete Bookmark?";
}

function openMobileNav() {
  els.sidebar.classList.add("open");
  els.backdrop.classList.add("show");
}

function closeMobileNav() {
  els.sidebar.classList.remove("open");
  els.backdrop.classList.remove("show");
}

function closeAllMenus() {
  document.querySelectorAll(".context-menu.open").forEach(menu => {
    menu.classList.remove("open");
    const trigger = menu.parentElement.querySelector(".more-btn");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  });
}

function handleDocumentClick(event) {
  if (!event.target.closest(".bookmark-menu-wrap")) closeAllMenus();
  if (event.target.classList.contains("modal-backdrop")) {
    closeModal(event.target);
  }
}

function handleKeyboard(event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    els.search.focus();
    els.search.select();
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "n") {
    event.preventDefault();
    openBookmarkModal();
  }

  if (event.key === "Escape") {
    closeAllMenus();
    if (!els.modal.hidden) closeBookmarkModal();
    else if (!els.confirmModal.hidden) closeConfirmModal();
    else if (!els.settingsModal.hidden) closeModal(els.settingsModal);
    else closeMobileNav();
  }
}

function showToast(message, type = "success", action = null) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <div class="toast-icon">
      ${type === "error"
        ? '<svg viewBox="0 0 24 24" fill="none"><path d="M12 8v5M12 16.5v.01M4.9 19h14.2a1.4 1.4 0 0 0 1.2-2.1L13.2 4.5a1.4 1.4 0 0 0-2.4 0L3.7 16.9A1.4 1.4 0 0 0 4.9 19Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none"><path d="m5 12 4.5 4.5L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'}
    </div>
    <span class="toast-message">${escapeHtml(message)}</span>
    ${action ? `<button class="toast-action">${escapeHtml(action.label)}</button>` : ""}
    <button class="toast-close" aria-label="Close notification">×</button>
  `;

  if (action) {
    toast.querySelector(".toast-action").addEventListener("click", () => {
      action.action();
      removeToast(toast);
    });
  }
  toast.querySelector(".toast-close").addEventListener("click", () => removeToast(toast));
  els.toastRegion.appendChild(toast);

  const timeout = setTimeout(() => removeToast(toast), action ? 5500 : 3000);
  toast.dataset.timeout = timeout;
}

function removeToast(toast) {
  if (!toast.isConnected) return;
  clearTimeout(Number(toast.dataset.timeout));
  toast.classList.add("hide");
  setTimeout(() => toast.remove(), 200);
}

function updateStorageStatus() {
  const status = document.getElementById("storage-status");
  const count = state.bookmarks.length;
  status.textContent = `${count} bookmark${count === 1 ? "" : "s"} stored on this device.`;
}

function getCategories() {
  return [...new Set(state.bookmarks.map(b => b.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function getCategoryCounts() {
  return state.bookmarks.reduce((acc, bookmark) => {
    if (bookmark.category) acc[bookmark.category] = (acc[bookmark.category] || 0) + 1;
    return acc;
  }, {});
}

function findBookmark(id) {
  return state.bookmarks.find(b => b.id === id);
}

function normalizeUrl(value) {
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getFaviconUrl(url) {
  try {
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(new URL(url).hostname)}&sz=64`;
  } catch {
    return "";
  }
}

function formatRelativeDate(timestamp) {
  const diff = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function createId() {
  if (window.crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
