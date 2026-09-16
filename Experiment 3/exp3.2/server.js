const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs').promises;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');

// Roles -> permissions
const rolesPermissions = {
  admin: ['read:posts', 'write:posts', 'delete:posts', 'admin:access'],
  editor: ['read:posts', 'write:posts'],
  viewer: ['read:posts']
};

async function ensureData() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try { await fs.access(USERS_FILE); } catch { await fs.writeFile(USERS_FILE, '[]', 'utf8'); }
    try { await fs.access(POSTS_FILE); } catch { await fs.writeFile(POSTS_FILE, '[]', 'utf8'); }
  } catch (err) {
    console.error('Failed to prepare data dir', err);
    process.exit(1);
  }
}

async function readUsers() {
  const raw = await fs.readFile(USERS_FILE, 'utf8');
  return JSON.parse(raw || '[]');
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

async function readPosts() {
  const raw = await fs.readFile(POSTS_FILE, 'utf8');
  return JSON.parse(raw || '[]');
}

async function writePosts(posts) {
  await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf8');
}

function derivePermissions(roles) {
  const perms = new Set();
  roles.forEach(role => {
    const p = rolesPermissions[role] || [];
    p.forEach(x => perms.add(x));
  });
  return Array.from(perms);
}

function authenticateJWT(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requirePermission(permission) {
  return (req, res, next) => {
    const perms = (req.user && req.user.permissions) || [];
    if (perms.includes(permission)) return next();
    return res.status(403).json({ error: 'Forbidden' });
  };
}

app.post('/api/signup', async (req, res) => {
  const { username, password, roles } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });
  if (typeof username !== 'string' || typeof password !== 'string') return res.status(400).json({ error: 'Invalid input' });
  if (username.length < 3 || password.length < 4) return res.status(400).json({ error: 'username/password too short' });
  try {
    const users = await readUsers();
    if (users.find(u => u.username === username)) return res.status(409).json({ error: 'User already exists' });
    const passwordHash = bcrypt.hashSync(password, 8);
    const userRoles = Array.isArray(roles) && roles.length ? roles : ['viewer'];
    const user = { username, passwordHash, roles: userRoles };
    users.push(user);
    await writeUsers(users);
    const permissions = derivePermissions(user.roles);
    const token = jwt.sign({ sub: user.username, roles: user.roles, permissions }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, username: user.username, roles: user.roles, permissions });
  } catch (err) {
    console.error('signup error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });
  try {
    const users = await readUsers();
    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!bcrypt.compareSync(password, user.passwordHash)) return res.status(401).json({ error: 'Invalid credentials' });
    const permissions = derivePermissions(user.roles);
    const token = jwt.sign({ sub: user.username, roles: user.roles, permissions }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, username: user.username, roles: user.roles, permissions });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/posts', authenticateJWT, requirePermission('read:posts'), async (req, res) => {
  try {
    const posts = await readPosts();
    res.json(posts);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/posts', authenticateJWT, requirePermission('write:posts'), async (req, res) => {
  const { title, body } = req.body || {};
  if (!title || !body) return res.status(400).json({ error: 'Missing fields' });
  try {
    const posts = await readPosts();
    const id = posts.length ? Math.max(...posts.map(p=>p.id)) + 1 : 1;
    const p = { id, title, body };
    posts.push(p);
    await writePosts(posts);
    res.json(p);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/admin', authenticateJWT, requirePermission('admin:access'), async (req, res) => {
  try {
    const users = await readUsers();
    const safe = users.map(u => ({ username: u.username, roles: u.roles }));
    res.json({ message: 'Welcome to the admin area', users: safe });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// initialize data and seed default users/posts if empty
(async ()=>{
  await ensureData();
  const users = await readUsers();
  if (!users.find(u=>u.username==='alice')) {
    const seed = [
      { username: 'alice', passwordHash: bcrypt.hashSync('password',8), roles:['admin'] },
      { username: 'bob', passwordHash: bcrypt.hashSync('password',8), roles:['editor'] },
      { username: 'carol', passwordHash: bcrypt.hashSync('password',8), roles:['viewer'] }
    ];
    await writeUsers(users.concat(seed));
  }
  const posts = await readPosts();
  if (!posts.length) {
    await writePosts([{ id:1, title:'Welcome', body:'This is a public post.' }]);
  }
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})();
