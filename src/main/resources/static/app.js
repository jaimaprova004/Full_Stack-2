const state = { page: 0, size: 10, sort: 'id', direction: 'asc' };
const rows = document.querySelector('#productRows');
const emptyState = document.querySelector('#emptyState');
const statusText = document.querySelector('#statusText');
const statusDot = document.querySelector('.status-dot');

async function loadProducts() {
    rows.innerHTML = '<tr><td colspan="4" class="loading">Loading catalog<span class="loading-bar"></span></td></tr>';
    emptyState.hidden = true;
    const query = new URLSearchParams({ page: state.page, size: state.size, sort: state.sort, direction: state.direction });
    try {
        const response = await fetch(`/api/products?${query}`);
        if (!response.ok) throw new Error('API returned an error');
        const data = await response.json();
        renderProducts(data);
        statusText.textContent = 'API connected';
        statusDot.classList.add('online');
    } catch (error) {
        rows.innerHTML = '<tr><td colspan="4" class="loading">Could not reach the API. Start the Spring Boot app and refresh.</td></tr>';
        statusText.textContent = 'API unavailable';
        statusDot.classList.remove('online');
    }
}

function renderProducts(data) {
    document.querySelector('#totalCount').textContent = data.totalElements;
    document.querySelector('#pageSummary').textContent = data.totalElements === 0 ? 'No records' : `Showing ${data.page * data.size + 1}–${Math.min((data.page + 1) * data.size, data.totalElements)} of ${data.totalElements}`;
    document.querySelector('#pageNumber').textContent = `Page ${data.totalPages ? data.page + 1 : 0} of ${data.totalPages}`;
    document.querySelector('#previousPage').disabled = data.first;
    document.querySelector('#nextPage').disabled = data.last;
    rows.innerHTML = data.content.map((product, index) => `<tr style="animation-delay:${index * 35}ms"><td class="id-col">${product.id}</td><td><span class="product-name">${escapeHtml(product.name)}</span></td><td><span class="category">${escapeHtml(product.category)}</span></td><td class="price-col">$${Number(product.price).toFixed(2)}</td></tr>`).join('');
    emptyState.hidden = data.content.length > 0;
}

function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character])); }
function updateDirectionButton() { document.querySelector('#directionIcon').textContent = state.direction === 'asc' ? '↑' : '↓'; document.querySelector('#directionText').textContent = state.direction === 'asc' ? 'Ascending' : 'Descending'; }

document.querySelector('#pageSize').addEventListener('change', event => { state.size = Number(event.target.value); state.page = 0; loadProducts(); });
document.querySelector('#sortField').addEventListener('change', event => { state.sort = event.target.value; state.page = 0; loadProducts(); });
document.querySelector('#directionButton').addEventListener('click', () => { state.direction = state.direction === 'asc' ? 'desc' : 'asc'; updateDirectionButton(); loadProducts(); });
document.querySelector('#previousPage').addEventListener('click', () => { if (state.page > 0) { state.page--; loadProducts(); } });
document.querySelector('#nextPage').addEventListener('click', () => { state.page++; loadProducts(); });

const modal = document.querySelector('#modal');
document.querySelector('#openCreate').addEventListener('click', () => { modal.hidden = false; document.querySelector('#productForm input').focus(); });
document.querySelector('#closeCreate').addEventListener('click', () => { modal.hidden = true; });
modal.addEventListener('click', event => { if (event.target === modal) modal.hidden = true; });
document.querySelector('#productForm').addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(event.target);
    const message = document.querySelector('#formMessage');
    const button = event.target.querySelector('button[type="submit"]');
    button.disabled = true; message.textContent = '';
    try {
        const response = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.get('name'), category: form.get('category'), price: Number(form.get('price')) }) });
        if (!response.ok) throw new Error('Could not create product');
        event.target.reset(); modal.hidden = true; state.page = 0; await loadProducts();
    } catch (error) { message.textContent = error.message; } finally { button.disabled = false; }
});

updateDirectionButton();
loadProducts();
