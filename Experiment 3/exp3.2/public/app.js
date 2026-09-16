const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const userInfo = document.getElementById('userInfo');
const btnGetPosts = document.getElementById('btnGetPosts');
const btnCreatePost = document.getElementById('btnCreatePost');
const btnAdmin = document.getElementById('btnAdmin');
const postsDiv = document.getElementById('posts');
const demoAlice = document.getElementById('demoAlice');
const demoBob = document.getElementById('demoBob');
const demoCarol = document.getElementById('demoCarol');
const signupForm = document.getElementById('signupForm');
const suUsername = document.getElementById('su_username');
const suPassword = document.getElementById('su_password');
const suRole = document.getElementById('su_role');

let token = localStorage.getItem('rbac_token');
let permissions = [];
let roles = [];
let username = null;

function setUser(session) {
  if (!session) {
    token = null; permissions = []; roles = []; username = null;
    localStorage.removeItem('rbac_token');
    userInfo.textContent = 'Not signed in';
    return;
  }
  token = session.token; permissions = session.permissions; roles = session.roles; username = session.username;
  localStorage.setItem('rbac_token', token);
  userInfo.textContent = `${username} — ${roles.join(', ')}`;
}

if (token) {
  // try to parse basic payload for UI (not verifying)
  const parts = token.split('.');
  try {
    const payload = JSON.parse(atob(parts[1]));
    permissions = payload.permissions || [];
    roles = payload.roles || [];
    username = payload.sub || null;
    setUser({ token, permissions, roles, username });
  } catch (e) {}
}

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  const res = await fetch('/api/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: usernameInput.value.trim(), password: passwordInput.value })
  });
  const j = await res.json();
  if (!res.ok) return alert(j.error || 'Login failed');
  setUser(j);
});

async function demoLogin(name) {
  try {
    const res = await fetch('/api/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name, password: 'password' })
    });
    const j = await res.json();
    if (!res.ok) return alert(j.error || 'Demo login failed');
    setUser(j);
    // fetch posts immediately for demo
    btnGetPosts.click();
  } catch (e) { alert('Network error'); }
}

if (demoAlice) demoAlice.addEventListener('click', () => demoLogin('alice'));
if (demoBob) demoBob.addEventListener('click', () => demoLogin('bob'));
if (demoCarol) demoCarol.addEventListener('click', () => demoLogin('carol'));

// auto-demo via URL: /?demo=alice
window.addEventListener('load', () => {
  try {
    const params = new URLSearchParams(location.search);
    const d = params.get('demo');
    if (d) demoLogin(d);
  } catch (e) {}
});

signupForm && signupForm.addEventListener('submit', async e => {
  e.preventDefault();
  const uname = (suUsername.value || '').trim();
  const pwd = suPassword.value || '';
  const role = suRole.value || 'viewer';
  if (!uname || !pwd) return alert('Provide username and password');
  try {
    const res = await fetch('/api/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: uname, password: pwd, roles: [role] }) });
    const j = await res.json();
    if (!res.ok) return alert(j.error || 'Signup failed');
    setUser(j);
    btnGetPosts.click();
  } catch (e) { alert('Network error'); }
});

btnGetPosts.addEventListener('click', async () => {
  try {
    const res = await fetch('/api/posts', { headers: { Authorization: `Bearer ${token}` } });
    const j = await res.json();
    if (!res.ok) return alert(j.error || 'Failed');
    postsDiv.innerHTML = j.map(p => `<div class="post"><h3>${p.title}</h3><p>${p.body}</p></div>`).join('');
  } catch (e) { alert('Network error'); }
});

btnCreatePost.addEventListener('click', async () => {
  if (!permissions.includes('write:posts')) return alert('You lack permission to create posts');
  const title = prompt('Title') || 'Untitled';
  const body = prompt('Body') || '';
  const res = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ title, body }) });
  const j = await res.json();
  if (!res.ok) return alert(j.error || 'Failed');
  alert('Created post #' + j.id);
});

btnAdmin.addEventListener('click', async () => {
  if (!permissions.includes('admin:access')) return alert('Admin access required');
  const res = await fetch('/api/admin', { headers: { Authorization: `Bearer ${token}` } });
  const j = await res.json();
  if (!res.ok) return alert(j.error || 'Failed');
  alert('Admin: ' + JSON.stringify(j.users.map(u=>u.username)));
});

// Small UI affordance: gray out buttons when permission missing
function refreshButtons() {
  btnGetPosts.disabled = !permissions.includes('read:posts');
  btnCreatePost.disabled = !permissions.includes('write:posts');
  btnAdmin.disabled = !permissions.includes('admin:access');
}

setInterval(refreshButtons, 300);
