/* ===== Frontend Skills Learning Hub — app.js ===== */

const TOTAL_SKILLS = 9;

/* ---------- Progress tracking ---------- */
function getCompleted() {
  return JSON.parse(localStorage.getItem('completed') || '[]');
}

function saveCompleted(arr) {
  localStorage.setItem('completed', JSON.stringify(arr));
}

function updateProgress() {
  const completed = getCompleted();
  const count = completed.length;
  const pct = Math.round((count / TOTAL_SKILLS) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = `${count} / ${TOTAL_SKILLS} completed`;

  // Restore card state
  document.querySelectorAll('.card').forEach(card => {
    const skill = card.dataset.skill;
    if (completed.includes(skill)) {
      card.classList.add('completed');
      const btn = card.querySelector('.complete-btn');
      if (btn) btn.textContent = '✓ Completed';
    }
  });
}

document.querySelectorAll('.complete-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const skill = btn.dataset.skill;
    const completed = getCompleted();
    if (!completed.includes(skill)) {
      completed.push(skill);
      saveCompleted(completed);
    }
    updateProgress();
  });
});

/* ---------- Dark mode ---------- */
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  themeToggle.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', next);
});

/* ---------- HTML: Form demo ---------- */
document.getElementById('demoForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const msg = document.getElementById('formMsg');

  if (!email.validity.valid) {
    msg.textContent = 'Please enter a valid email.';
    msg.className = 'form-msg error';
    return;
  }
  if (password.value.length < 8) {
    msg.textContent = 'Password must be at least 8 characters.';
    msg.className = 'form-msg error';
    return;
  }
  msg.textContent = 'Form is valid! ✓';
  msg.className = 'form-msg success';
});

/* ---------- HTML: Accessibility demo ---------- */
const a11yBtn = document.getElementById('a11yBtn');
const a11yStatus = document.getElementById('a11yStatus');

a11yBtn.addEventListener('click', () => {
  const pressed = a11yBtn.getAttribute('aria-pressed') === 'true';
  a11yBtn.setAttribute('aria-pressed', String(!pressed));
  a11yStatus.textContent = `State: ${!pressed ? 'ON' : 'OFF'}`;
});

/* ---------- CSS: Flexbox demo ---------- */
document.getElementById('justifySelect').addEventListener('change', e => {
  document.querySelector('.demo-flex').style.justifyContent = e.target.value;
});

/* ---------- JS: DOM / Todo ---------- */
const todoInput = document.getElementById('todoInput');
const todoList  = document.getElementById('todoList');

function addTodo(text) {
  if (!text.trim()) return;
  const li = document.createElement('li');
  li.textContent = text;

  li.addEventListener('click', () => li.classList.toggle('done'));

  const del = document.createElement('button');
  del.textContent = '×';
  del.setAttribute('aria-label', 'Remove task');
  del.addEventListener('click', e => { e.stopPropagation(); li.remove(); });

  li.appendChild(del);
  todoList.appendChild(li);
  todoInput.value = '';
  todoInput.focus();
}

document.getElementById('todoAdd').addEventListener('click', () => addTodo(todoInput.value));
todoInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(todoInput.value); });

// Pre-populate with one item
addTodo('Click me to mark done');

/* ---------- JS: Fetch / Async demo ---------- */
document.getElementById('fetchBtn').addEventListener('click', async () => {
  const result = document.getElementById('fetchResult');
  result.textContent = 'Loading…';
  try {
    // Using the public JokeAPI (safe, no auth needed)
    const res = await fetch('https://v2.jokeapi.dev/joke/Programming?type=single&safe-mode');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    result.textContent = data.joke || 'No joke found.';
    result.style.fontStyle = 'normal';
    result.style.color = 'var(--text)';
  } catch (err) {
    result.textContent = `fetch() failed: ${err.message}. Check the console.`;
    result.style.color = 'var(--html-color)';
    console.error(err);
  }
});

/* ---------- JS: LocalStorage note ---------- */
const storageInput = document.getElementById('storageInput');
const lastSaved    = document.getElementById('lastSaved');

// Restore saved note
const saved = localStorage.getItem('frontend-note');
if (saved) storageInput.value = saved;

storageInput.addEventListener('input', () => {
  localStorage.setItem('frontend-note', storageInput.value);
  const now = new Date().toLocaleTimeString();
  lastSaved.textContent = now;
});

/* ---------- Project: Color Palette ---------- */
function randomHex() {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
}

function buildPalette() {
  const palette = document.getElementById('palette');
  palette.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const hex = randomHex();
    const swatch = document.createElement('div');
    swatch.className = 'swatch';
    swatch.style.background = hex;
    swatch.dataset.hex = hex;
    swatch.setAttribute('title', `Copy ${hex}`);
    swatch.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(hex);
        document.getElementById('copyMsg').textContent = `Copied ${hex} to clipboard!`;
      } catch {
        document.getElementById('copyMsg').textContent = `${hex} (clipboard unavailable)`;
      }
      setTimeout(() => { document.getElementById('copyMsg').textContent = ''; }, 2000);
    });
    palette.appendChild(swatch);
  }
}

buildPalette();
document.getElementById('genPalette').addEventListener('click', buildPalette);

/* ---------- Project: Countdown Timer ---------- */
let timerInterval = null;
let remaining = 0;

function formatTime(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function setDisplay(secs) {
  document.getElementById('timerDisplay').textContent = formatTime(secs);
}

document.getElementById('timerStart').addEventListener('click', () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById('timerStart').textContent = 'Start';
    return;
  }
  const mins = parseInt(document.getElementById('timerMinutes').value, 10) || 1;
  remaining = mins * 60;
  setDisplay(remaining);
  document.getElementById('timerStart').textContent = 'Pause';

  timerInterval = setInterval(() => {
    remaining--;
    setDisplay(remaining);
    if (remaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      document.getElementById('timerStart').textContent = 'Start';
      document.getElementById('timerDisplay').textContent = 'Done!';
    }
  }, 1000);
});

document.getElementById('timerReset').addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  document.getElementById('timerStart').textContent = 'Start';
  setDisplay(0);
});

/* ---------- Project: Image Gallery / Lightbox ---------- */
const COLORS = [
  '#6366f1','#8b5cf6','#ec4899','#f59e0b',
  '#10b981','#3b82f6','#ef4444','#14b8a6','#f97316',
];

function buildGallery() {
  const gallery = document.getElementById('gallery');
  COLORS.forEach((color, i) => {
    // Generate a simple SVG placeholder instead of external URLs
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <rect width="200" height="200" fill="${color}"/>
        <text x="100" y="115" text-anchor="middle"
              font-family="system-ui" font-size="48" font-weight="bold" fill="white">
          ${i + 1}
        </text>
      </svg>`;
    const src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

    const img = document.createElement('img');
    img.className = 'gallery-item';
    img.src = src;
    img.alt = `Gallery image ${i + 1}`;
    img.addEventListener('click', () => {
      document.getElementById('lightboxImg').src = src;
      document.getElementById('lightbox').classList.remove('hidden');
    });
    gallery.appendChild(img);
  });
}

buildGallery();

document.getElementById('lightboxClose').addEventListener('click', () => {
  document.getElementById('lightbox').classList.add('hidden');
});
document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target === e.currentTarget) {
    document.getElementById('lightbox').classList.add('hidden');
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.getElementById('lightbox').classList.add('hidden');
});

/* ---------- Init ---------- */
updateProgress();
