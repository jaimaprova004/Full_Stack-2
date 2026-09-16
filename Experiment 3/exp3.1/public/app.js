let mode = 'login';
const msgEl = document.getElementById('msg');
const authForm = document.getElementById('auth-form');
const loginTab = document.getElementById('btn-login-tab');
const registerTab = document.getElementById('btn-register-tab');
const submitButton = document.getElementById('sub-btn');
const titleEl = document.getElementById('title');
const authBox = document.getElementById('auth-box');
const dashBox = document.getElementById('dash-box');
const welcomeText = document.getElementById('welcome-text');

function switchTab(m) {
  mode = m;
  loginTab.classList.toggle('active', m === 'login');
  registerTab.classList.toggle('active', m === 'register');
  titleEl.innerText = m === 'login' ? 'Welcome' : 'Create account';
  submitButton.innerText = m === 'login' ? 'Login' : 'Register';
  setMessage('');
}

function setMessage(text, success = false) {
  if (!msgEl) return;
  msgEl.innerText = text;
  msgEl.style.color = success ? '#7bf6e6' : '#ffb3c6';
}

async function handleAuth(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    setMessage('Please enter both username and password.');
    return;
  }

  const endpoint = mode === 'login' ? '/api/login' : '/api/register';

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || 'Something went wrong.');
      return;
    }

    setMessage(data.message || 'Success!', mode === 'login');

    if (mode === 'login') {
      localStorage.setItem('jwtToken', data.token);
      setTimeout(checkAuth, 300);
    }

    if (mode === 'register') {
      switchTab('login');
    }
  } catch (error) {
    setMessage('Network error. Please try again.');
    console.error('Auth error:', error);
  }
}

async function checkAuth() {
  const token = localStorage.getItem('jwtToken');
  if (!token) return;

  try {
    const res = await fetch('/api/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      logout();
      return;
    }

    const data = await res.json();
    authBox.classList.add('hidden');
    dashBox.classList.remove('hidden');
    welcomeText.innerText = data.message;
  } catch (error) {
    logout();
    console.error('Auth check failed:', error);
  }
}

function logout() {
  localStorage.removeItem('jwtToken');
  authBox.classList.remove('hidden');
  dashBox.classList.add('hidden');
}

if (authForm) {
  authForm.addEventListener('submit', handleAuth);
}

window.addEventListener('DOMContentLoaded', () => {
  if (authForm) {
    switchTab('login');
  }
  checkAuth();
});