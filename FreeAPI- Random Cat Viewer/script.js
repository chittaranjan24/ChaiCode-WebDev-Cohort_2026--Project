const API_URL = "https://api.freeapi.app/api/v1/public/cats/cat/random";

const catImage  = document.getElementById("catImage");
const skeleton  = document.getElementById("skeleton");
const errorBox  = document.getElementById("errorBox");
const catName   = document.getElementById("catName");
const catOrigin = document.getElementById("catOrigin");
const catDesc   = document.getElementById("catDesc");
const tagRow    = document.getElementById("tagRow");
const nextBtn   = document.getElementById("nextBtn");

async function fetchCat() {
  // Disable button while loading
  nextBtn.disabled = true;
  nextBtn.textContent = "Loading...";

  // Reset UI
  catImage.style.opacity = "0";
  skeleton.style.display = "block";
  errorBox.classList.add("hidden");
  tagRow.innerHTML = "";
  catName.textContent = "Loading...";
  catOrigin.textContent = "—";
  catDesc.textContent = "Fetching cat info...";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("API error: " + response.status);
    }

    const json = await response.json();
    const cat  = json.data;

    console.log("Fetched cat:", cat.image);
    // ── Name & origin ──
    catName.textContent   = cat.name;
    catOrigin.textContent = cat.origin ? "📍 " + cat.origin : "—";

    // ── Description ──
    catDesc.textContent = cat.description
      ? cat.description.slice(0, 150) + (cat.description.length > 150 ? "…" : "")
      : "No description available.";

    // ── Temperament tags ──
    if (cat.temperament) {
      const tags = cat.temperament.split(",").slice(0, 4);
      tags.forEach(tag => {
        const span = document.createElement("span");
        span.className = "bg-orange-100 text-orange-500 text-xs font-medium px-2 py-1 rounded-full";
        span.textContent = tag.trim();
        tagRow.appendChild(span);
      });
    }

    // ── Image ──
    const imageUrl = cat.image;

    if (!imageUrl) {
      throw new Error("No image URL in response");
    }

    // Load image, then show it
    const tempImg  = new Image();
    tempImg.onload = () => {
      catImage.src           = imageUrl;
      catImage.style.opacity = "1";
      skeleton.style.display = "none";
    };
    tempImg.onerror = () => {
      showError();
    };
    tempImg.src = imageUrl;

  } catch (error) {
    console.error("fetchCat failed:", error);
    showError();
  } finally {
    nextBtn.disabled    = false;
    nextBtn.textContent = "Next Cat 🐾";
  }
}

function showError() {
  skeleton.style.display = "none";
  errorBox.classList.remove("hidden");
  catName.textContent = "Oops!";
  catDesc.textContent = "Could not load cat. Please try again.";
}

// Load on page start
fetchCat();