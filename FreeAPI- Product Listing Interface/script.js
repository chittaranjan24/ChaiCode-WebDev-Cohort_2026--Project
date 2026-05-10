const BASE = 'https://api.freeapi.app/api/v1/public/randomproducts';
let currentPage = 1;
let totalPages  = 1;

// ── Helpers ──────────────────────────────────────────

function formatPrice(n) {
    return '$' + parseFloat(n || 0).toFixed(2);
}

function renderStars(rating) {
    const full  = Math.round(rating || 0);
    const empty = 5 - full;

    return '★'.repeat(full) + '☆'.repeat(empty);
}

function stockLabel(stock) {
    if (stock >= 50) return { text: 'In Stock',    cls: 'in-stock'  };
    if (stock > 0)  return { text: 'Low Stock',   cls: 'low-stock' };

    return { text: 'Out of Stock',  cls: 'no-stock'  };
}

// ── Fetch & Render ────────────────────────────────────

async function fetchProducts(page = 1) {
    const app = document.getElementById('app');
    app.innerHTML = `<div class="state"><div class="spinner"></div><span>Loading products…</span></div>`;

    try {
        // 1. Fetch & parse
        const res  = await fetch(`${BASE}?page=${page}&limit=12`);
        const json = await res.json();
        if (!json.success) throw new Error('API error');

        // 2. Pull out what we need
        const products  = json.data?.data || [];
        totalPages  = json.data?.totalPages || 1;
        currentPage = json.data?.page || page;

        if (!products.length) {
            app.innerHTML = `<div class="state"><span>No products found.</span></div>`;
            return;
        }

        // 3. Build one card per product
        const cards = products.map(p => {
        const title    = p.title          || 'Untitled';
        const category = p.category       || '';
        const image    = p.thumbnail      || p.images?.[0] || '';
        const price    = formatPrice(p.price);
        const rating   = p.rating;
        const description  = p.description;
        const stars    = renderStars(rating);
        const stock    = stockLabel(p.stock);

        return `
            <div class="card">
            <div class="img-wrap">
                ${image ? `<img src="${image}" alt="${title.replace(/"/g,'')}" loading="lazy"/>` : ''}
            </div>
            <div class="card-body">
                ${category ? `<span class="category">${category}</span>` : ''}
                <p class="card-title">${title}</p>
                ${description ? `<p class="card-description">${description}</p>` : ''}
                <div class="rating-row">
                <span class="stars">${stars}</span>
                <span>${parseFloat(rating).toFixed(1)}</span>
                </div>
                <div class="price-row">
                <span class="price">${price}</span>
                <span class="stock ${stock.cls}">${stock.text}</span>
                </div>
            </div>
            </div>`;
        }).join('');

        // 4. Render grid + pagination
        app.innerHTML = `
        <div class="grid">${cards}</div>
        <div class="pagination">
            <button class="btn" id="prev" ${currentPage <= 1 ? 'disabled' : ''}>← Prev</button>
            <span class="page-info">Page ${currentPage} of ${totalPages}</span>
            <button class="btn" id="next" ${currentPage >= totalPages ? 'disabled' : ''}>Next →</button>
        </div>`;

        document.getElementById('prev').addEventListener('click', () => fetchProducts(currentPage - 1));
        document.getElementById('next').addEventListener('click', () => fetchProducts(currentPage + 1));
    } catch (err) {
        app.innerHTML = `<div class="state"><span>Failed to load products. Please try again.</span></div>`;
        console.error(err);
    }
}

fetchProducts(1);