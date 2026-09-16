const API = '/api/posts';

async function loadPosts() {
  const res = await fetch(API);
  const payload = await res.json();
  const posts = payload.data || [];
  const container = document.getElementById('posts');
  container.innerHTML = '';
  posts.reverse();
  for (const p of posts) {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4';
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${escapeHtml(p.title)}</h5>
          <h6 class="card-subtitle mb-2 text-muted">by ${escapeHtml(p.author)} • ${new Date(p.createdAt).toLocaleString()}</h6>
          <p class="card-text flex-grow-1">${escapeHtml(p.content).substring(0, 240)}${p.content.length>240? '...':''}</p>
          <div class="mt-3 d-flex justify-content-between">
            <button class="btn btn-sm btn-danger" onclick="deletePost(${p.id})">Delete</button>
            <button class="btn btn-sm btn-outline-primary" onclick="openEdit(${p.id})">Edit</button>
          </div>
        </div>
      </div>`;
    container.appendChild(col);
  }
}

function escapeHtml(s){
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');
}

async function deletePost(id){
  if(!confirm('Delete this post?')) return;
  const res = await fetch(API + '/' + id, { method: 'DELETE' });
  if (res.ok) {
    showAlert('Deleted', 'success');
    loadPosts();
  } else {
    showAlert('Delete failed', 'danger');
  }
}

function showAlert(msg, type='info'){
  const p = document.getElementById('alertPlaceholder');
  p.innerHTML = `<div class="alert alert-${type} alert-dismissible">${msg}<button class="btn-close" data-bs-dismiss="alert"></button></div>`;
}

const modal = new bootstrap.Modal(document.getElementById('postModal'));
document.getElementById('newPostBtn').addEventListener('click', ()=>{
  document.getElementById('postForm').reset();
  document.querySelector('.modal-title').textContent = 'Create Post';
  document.getElementById('saveBtn').dataset.editId = '';
  modal.show();
});

document.getElementById('saveBtn').addEventListener('click', async ()=>{
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const author = document.getElementById('author').value.trim();
  if(!title || !content || !author){ showAlert('Please fill all fields', 'warning'); return; }
  const payload = { title, content, author };
  const editId = document.getElementById('saveBtn').dataset.editId;
  const method = editId ? 'PUT' : 'POST';
  const url = editId ? API + '/' + editId : API;
  const res = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  const body = await res.json();
  if (res.ok) {
    modal.hide();
    showAlert(editId ? 'Updated' : 'Created', 'success');
    loadPosts();
  } else {
    showAlert(body.message || 'Error', 'danger');
  }
});

async function openEdit(id){
  const res = await fetch(API + '/' + id);
  const body = await res.json();
  if (!res.ok) { showAlert('Not found', 'danger'); return; }
  const p = body.data;
  document.getElementById('title').value = p.title;
  document.getElementById('content').value = p.content;
  document.getElementById('author').value = p.author;
  document.querySelector('.modal-title').textContent = 'Edit Post';
  document.getElementById('saveBtn').dataset.editId = id;
  modal.show();
}

// initial load
loadPosts();
