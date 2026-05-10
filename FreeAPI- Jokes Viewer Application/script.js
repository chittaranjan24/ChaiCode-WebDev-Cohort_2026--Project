"use strict";

/* =====================
   DOM References
   ===================== */
const jokeGrid       = document.getElementById("jokeGrid");
const loaderWrap     = document.getElementById("loaderWrap");
const errorState     = document.getElementById("errorState");
const emptyState     = document.getElementById("emptyState");
const searchInput    = document.getElementById("searchInput");
const searchClear    = document.getElementById("searchClear");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect     = document.getElementById("sortSelect");
const loadMoreBtn    = document.getElementById("loadMoreBtn");
const showLikedBtn   = document.getElementById("showLikedBtn");
const likedCount     = document.getElementById("likedCount");
const likedStatCount = document.getElementById("likedStatCount");
const totalCount     = document.getElementById("totalCount");
const shownCount     = document.getElementById("shownCount");
const toast          = document.getElementById("toast");

// Modal
const modalBackdrop  = document.getElementById("modalBackdrop");
const modalClose     = document.getElementById("modalClose");
const modalEmoji     = document.getElementById("modalEmoji");
const modalJokeText  = document.getElementById("modalJokeText");
const modalCats      = document.getElementById("modalCats");
const modalId        = document.getElementById("modalId");
const modalCopyBtn   = document.getElementById("modalCopyBtn");
const modalLikeBtn   = document.getElementById("modalLikeBtn");

/* =====================
   State
   ===================== */
let allJokes      = [];   // all fetched jokes
let liked         = new Set();
let currentPage   = 1;
let isFetching    = false;
let showOnlyLiked = false;
let activeModal   = null; // joke id currently in modal
let toastTimer    = null;

const JOKE_EMOJIS = ["😂", "🤣", "😆", "😄", "😝", "😜", "🤭", "😅", "🙃", "😏"];

/* =====================
   API
   ===================== */
const API_BASE = "https://api.freeapi.app/api/v1/public/randomjokes";

async function fetchJokes(page = 1) {
  if (isFetching) return;
  isFetching = true;
  setLoadMoreState(true);

  if (page === 1) {
    showLoader(true);
    hideError();
  }

  try {
    const res = await fetch(`${API_BASE}?page=${page}&limit=10`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    // API may nest data differently
    const jokes = json.data?.data || json.data || [];
    const hasMore = json.data?.hasNextPage ?? (jokes.length === 10);

    if (!hasMore || jokes.length < 10) {
      loadMoreBtn.style.display = "none";
    }

    allJokes = page === 1 ? jokes : [...allJokes, ...jokes];
    buildCategoryOptions();
    render();

  } catch (err) {
    console.error(err);
    if (page === 1) showError();
    else showToast("Failed to load more jokes.");
  } finally {
    isFetching = false;
    showLoader(false);
    setLoadMoreState(false);
  }
}

/* =====================
   Render
   ===================== */
function getFilteredJokes() {
  const q   = searchInput.value.toLowerCase().trim();
  const cat = categoryFilter.value;
  const sort = sortSelect.value;

  let jokes = allJokes.filter(j => {
    const matchQ   = !q || (j.content || "").toLowerCase().includes(q);
    const matchCat = !cat || (j.categories || []).includes(cat);
    const matchLiked = !showOnlyLiked || liked.has(j.id);
    return matchQ && matchCat && matchLiked;
  });

  if (sort === "az") jokes = [...jokes].sort((a, b) => a.content.localeCompare(b.content));
  if (sort === "za") jokes = [...jokes].sort((a, b) => b.content.localeCompare(a.content));
  if (sort === "liked") jokes = [...jokes].sort((a, b) => (liked.has(b.id) ? 1 : 0) - (liked.has(a.id) ? 1 : 0));

  return jokes;
}

function render() {
  const jokes = getFilteredJokes();

  totalCount.textContent = allJokes.length;
  shownCount.textContent = jokes.length;
  likedCount.textContent = liked.size;
  likedStatCount.textContent = liked.size;

  if (!jokes.length && allJokes.length > 0) {
    jokeGrid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  jokeGrid.innerHTML = jokes.map((j, i) => renderCard(j, i)).join("");
  attachCardEvents();
}

function renderCard(joke, index) {
  const isLiked = liked.has(joke.id);
  const cats = joke.categories?.length ? joke.categories : ["Uncategorized"];
  const emoji = JOKE_EMOJIS[joke.id % JOKE_EMOJIS.length];
  const delay = Math.min(index % 10, 9) * 50;

  return `
    <article
      class="joke-card${isLiked ? " liked-card" : ""}"
      data-id="${joke.id}"
      style="animation-delay: ${delay}ms"
      tabindex="0"
      role="button"
      aria-label="View joke #${joke.id}"
    >
      <div class="card-top">
        <span class="card-num">#${joke.id}</span>
        <div class="card-actions">
          <button
            class="action-btn like-btn${isLiked ? " active" : ""}"
            data-id="${joke.id}"
            aria-label="${isLiked ? "Unlike" : "Like"} joke"
            title="${isLiked ? "Unlike" : "Like"}"
          >${isLiked ? "❤️" : "🤍"}</button>
          <button
            class="action-btn copy-btn"
            data-id="${joke.id}"
            aria-label="Copy joke"
            title="Copy joke"
          >📋</button>
        </div>
      </div>
      <p class="joke-text">${escHtml(joke.content || "")}</p>
      <div class="card-footer">
        <div class="cat-pills">
          ${cats.map(c => `<span class="cat-pill">${escHtml(c)}</span>`).join("")}
        </div>
        <span class="joke-id">${emoji}</span>
      </div>
    </article>
  `;
}

function attachCardEvents() {
  // Open modal on card click
  jokeGrid.querySelectorAll(".joke-card").forEach(card => {
    card.addEventListener("click", e => {
      if (e.target.closest(".action-btn")) return;
      const id = Number(card.dataset.id);
      openModal(id);
    });
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const id = Number(card.dataset.id);
        openModal(id);
      }
    });
  });

  // Like buttons
  jokeGrid.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      toggleLike(id);
    });
  });

  // Copy buttons
  jokeGrid.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", async e => {
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      await copyJoke(id, btn);
    });
  });
}

/* =====================
   Like
   ===================== */
function toggleLike(id) {
  if (liked.has(id)) {
    liked.delete(id);
    showToast("Removed from liked 🤍");
  } else {
    liked.add(id);
    showToast("Added to liked ❤️");
  }
  render();
  if (activeModal === id) updateModalLikeBtn();
}

/* =====================
   Copy
   ===================== */
async function copyJoke(id, btn) {
  const joke = allJokes.find(j => j.id === id);
  if (!joke) return;
  try {
    await navigator.clipboard.writeText(joke.content);
    if (btn) {
      btn.classList.add("copied");
      btn.textContent = "✅";
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.textContent = "📋";
      }, 1800);
    }
    showToast("Copied to clipboard! 📋");
  } catch {
    showToast("Copy failed. Try again.");
  }
}

/* =====================
   Modal
   ===================== */
function openModal(id) {
  const joke = allJokes.find(j => j.id === id);
  if (!joke) return;
  activeModal = id;

  const emoji = JOKE_EMOJIS[joke.id % JOKE_EMOJIS.length];
  const cats  = joke.categories?.length ? joke.categories : ["Uncategorized"];

  modalEmoji.textContent    = emoji;
  modalJokeText.textContent = joke.content || "";
  modalId.textContent       = `#${joke.id}`;
  modalCats.innerHTML = cats.map(c => `<span class="cat-pill">${escHtml(c)}</span>`).join("");
  updateModalLikeBtn();

  modalBackdrop.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  modalClose.focus();
}

function closeModal() {
  modalBackdrop.classList.add("hidden");
  document.body.style.overflow = "";
  activeModal = null;
}

function updateModalLikeBtn() {
  if (!activeModal) return;
  const isLiked = liked.has(activeModal);
  modalLikeBtn.textContent = isLiked ? "💔 Unlike" : "❤️ Like";
}

modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", e => {
  if (e.target === modalBackdrop) closeModal();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && activeModal) closeModal();
});

modalCopyBtn.addEventListener("click", async () => {
  await copyJoke(activeModal, null);
});

modalLikeBtn.addEventListener("click", () => {
  if (activeModal) toggleLike(activeModal);
});

/* =====================
   Category Filter Builder
   ===================== */
function buildCategoryOptions() {
  const current = categoryFilter.value;
  const cats = new Set();
  allJokes.forEach(j => (j.categories || []).forEach(c => cats.add(c)));

  categoryFilter.innerHTML = '<option value="">All Categories</option>';
  [...cats].sort().forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    if (c === current) opt.selected = true;
    categoryFilter.appendChild(opt);
  });
}

/* =====================
   UI State Helpers
   ===================== */
function showLoader(show) {
  loaderWrap.classList.toggle("hidden", !show);
}

function showError() {
  errorState.classList.remove("hidden");
  jokeGrid.innerHTML = "";
}

function hideError() {
  errorState.classList.add("hidden");
}

function setLoadMoreState(loading) {
  loadMoreBtn.disabled = loading;
  const icon = loadMoreBtn.querySelector(".btn-icon");
  if (loading) {
    icon.classList.add("spinning");
    loadMoreBtn.childNodes[1].textContent = " Loading…";
  } else {
    icon.classList.remove("spinning");
    loadMoreBtn.childNodes[1].textContent = " Load More";
  }
}

/* =====================
   Toast
   ===================== */
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

/* =====================
   Utility
   ===================== */
function escHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function resetFilters() {
  searchInput.value = "";
  categoryFilter.value = "";
  sortSelect.value = "default";
  showOnlyLiked = false;
  showLikedBtn.textContent = "Liked Only";
  searchClear.classList.remove("visible");
  render();
}

function retryFetch() {
  hideError();
  allJokes = [];
  currentPage = 1;
  loadMoreBtn.style.display = "";
  fetchJokes(1);
}

/* =====================
   Event Listeners
   ===================== */
searchInput.addEventListener("input", () => {
  searchClear.classList.toggle("visible", searchInput.value.length > 0);
  render();
});

searchClear.addEventListener("click", () => {
  searchInput.value = "";
  searchClear.classList.remove("visible");
  searchInput.focus();
  render();
});

categoryFilter.addEventListener("change", render);
sortSelect.addEventListener("change", render);

loadMoreBtn.addEventListener("click", () => {
  currentPage++;
  fetchJokes(currentPage);
});

showLikedBtn.addEventListener("click", () => {
  showOnlyLiked = !showOnlyLiked;
  showLikedBtn.textContent = showOnlyLiked ? "Show All" : "Liked Only";
  render();
});

/* =====================
   Init
   ===================== */
fetchJokes(1);