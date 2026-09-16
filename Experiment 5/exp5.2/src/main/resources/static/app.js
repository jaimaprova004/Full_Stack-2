const API = '/api/posts';

async function loadPosts() {
  const container = document.getElementById('posts');
  container.innerHTML = '<div class="col-12 text-center text-muted py-4">Loading posts...</div>';

  try {
    const res = await fetch(API, {
      headers: { 'X-Request-Id': crypto.randomUUID() }
    });
    const payload = await res.json();

    if (!res.ok) {
      throw new Error(payload.message || 'Unable to load posts');
    }

    const posts = payload.data || [];
    container.innerHTML = '';
    posts.slice().reverse().forEach((p) => {
      const card = document.createElement('div');
      card.className = 'col-12 col-md-6 col-xl-4';
      card.innerHTML = `
        <article class="post-card">
          <div class="card-topbar">
            <span class="tag">Post</span>
            <span class="meta-time">${new Date(p.createdAt).toLocaleString()}</span>
          </div>
          <h3>${escapeHtml(p.title)}</h3>
          <p class="author">by ${escapeHtml(p.author)}</p>
          <p class="content">${escapeHtml(p.content).substring(0, 220)}${p.content.length > 220 ? '...' : ''}</p>
          <div class="card-actions">
            <button class="btn btn-sm btn-outline-danger" onclick="deletePost(${p.id})">Delete</button>
            <button class="btn btn-sm btn-outline-primary" onclick="openEdit(${p.id})">Edit</button>
          </div>
        </article>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = '<div class="col-12"><div class="alert alert-danger">Unable to load posts right now.</div></div>';
    showAlert(error.message || 'Unable to load posts', 'danger');
  }
}

function escapeHtml(value) {
  if (!value) return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showAlert(msg, type = 'info') {
  const host = document.getElementById('alertPlaceholder');
  host.innerHTML = `<div class="alert alert-${type} alert-box">${msg}</div>`;
}

async function deletePost(id) {
  if (!confirm('Delete this post?')) return;

  try {
    const res = await fetch(`${API}/${id}`, {
      method: 'DELETE',
      headers: { 'X-Request-Id': crypto.randomUUID() }
    });
    const payload = await res.json();

    if (!res.ok) {
      throw new Error(payload.message || 'Delete request failed');
    }

    showAlert('Post deleted successfully', 'success');
    loadPosts();
  } catch (error) {
    showAlert(error.message || 'Delete failed', 'danger');
  }
}

const modal = new bootstrap.Modal(document.getElementById('postModal'));

document.getElementById('newPostBtn').addEventListener('click', () => {
  document.getElementById('postForm').reset();
  document.querySelector('.modal-title').textContent = 'Create Post';
  document.getElementById('saveBtn').dataset.editId = '';
  modal.show();
});

document.getElementById('saveBtn').addEventListener('click', async () => {
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const author = document.getElementById('author').value.trim();

  if (!title || !content || !author) {
    showAlert('Please fill in all fields', 'warning');
    return;
  }

  const payload = { title, content, author };
  const editId = document.getElementById('saveBtn').dataset.editId;
  const method = editId ? 'PUT' : 'POST';
  const url = editId ? `${API}/${editId}` : API;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': crypto.randomUUID()
      },
      body: JSON.stringify(payload)
    });
    const body = await res.json();

    if (!res.ok) {
      throw new Error(body.message || body.details ? Object.values(body.details).join(', ') : 'Request failed');
    }

    modal.hide();
    showAlert(editId ? 'Post updated successfully' : 'Post created successfully', 'success');
    loadPosts();
  } catch (error) {
    showAlert(error.message || 'Something went wrong', 'danger');
  }
});

async function openEdit(id) {
  try {
    const res = await fetch(`${API}/${id}`, {
      headers: { 'X-Request-Id': crypto.randomUUID() }
    });
    const payload = await res.json();

    if (!res.ok) {
      throw new Error(payload.message || 'Unable to fetch post');
    }

    const post = payload.data;
    document.getElementById('title').value = post.title;
    document.getElementById('content').value = post.content;
    document.getElementById('author').value = post.author;
    document.querySelector('.modal-title').textContent = 'Edit Post';
    document.getElementById('saveBtn').dataset.editId = id;
    modal.show();
  } catch (error) {
    showAlert(error.message || 'Could not open record', 'danger');
  }
}

loadPosts();
