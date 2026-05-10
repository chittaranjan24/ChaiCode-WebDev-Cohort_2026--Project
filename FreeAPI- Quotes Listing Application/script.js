const quotesContainer = document.getElementById("quotesContainer");
const loading = document.getElementById("loading");
const pageNumber = document.getElementById("pageNumber");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const searchInput = document.getElementById("searchInput");
const randomBtn = document.getElementById("randomBtn");

let currentPage = 1;
let allQuotes = [];

async function fetchQuotes(page = 1) {
  try {
    loading.style.display = "block";
    quotesContainer.innerHTML = "";

    const response = await fetch(
      `https://api.freeapi.app/api/v1/public/quotes?page=${page}&limit=12`
    );

    const data = await response.json();

    allQuotes = data.data.data;

    renderQuotes(allQuotes);

    pageNumber.innerText = currentPage;

  } catch (error) {
    quotesContainer.innerHTML = `
      <h2>Failed to fetch quotes</h2>
    `;
  } finally {
    loading.style.display = "none";
  }
}

function renderQuotes(quotes) {

  if (!quotes.length) {
    quotesContainer.innerHTML = `
      <h2>No Quotes Found</h2>
    `;
    return;
  }

  quotesContainer.innerHTML = quotes.map((quote) => {
    return `
      <div class="quote-card">
        <p class="quote-text">
          "${quote.content}"
        </p>

        <p class="author">
          — ${quote.author}
        </p>
      </div>
    `;
  }).join("");
}

nextBtn.addEventListener("click", () => {
  currentPage++;
  fetchQuotes(currentPage);
});

prevBtn.addEventListener("click", () => {

  if (currentPage > 1) {
    currentPage--;
    fetchQuotes(currentPage);
  }
});

searchInput.addEventListener("input", (e) => {

  const value = e.target.value.toLowerCase();

  const filteredQuotes = allQuotes.filter((quote) => {
    return quote.author.toLowerCase().includes(value);
  });

  renderQuotes(filteredQuotes);
});

randomBtn.addEventListener("click", () => {

  const randomIndex = Math.floor(
    Math.random() * allQuotes.length
  );

  renderQuotes([allQuotes[randomIndex]]);
});

fetchQuotes();