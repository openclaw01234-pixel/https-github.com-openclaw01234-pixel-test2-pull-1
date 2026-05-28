/* =========================================
   App: navigation, view switching, toast, modals
   ========================================= */

const App = {
  currentView: 'home',

  init() {
    this.bindNavigation();
    this.bindModalEvents();
    this.bindThemeSwitch();
    this.bindMenuToggle();
    this.applyTheme(Storage.get('theme', 'dark'));
  },

  bindNavigation() {
    document.querySelectorAll('[data-view]').forEach(el => {
      el.addEventListener('click', e => {
        const view = el.dataset.view;
        this.switchView(view);
      });
    });
  },

  switchView(view) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById('view-' + view);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navBtn = document.querySelector(`.nav-item[data-view="${view}"]`);
    if (navBtn) navBtn.classList.add('active');

    this.currentView = view;
    document.querySelector('.main').scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');
  },

  bindModalEvents() {
    // Mood modal
    document.getElementById('moodBtn').addEventListener('click', () => {
      this.openModal('moodModal');
    });
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => this.closeModal(btn.dataset.close));
    });
    document.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mood = btn.dataset.mood;
        this.showMoodResults(mood);
      });
    });
  },

  openModal(id) {
    const m = document.getElementById(id);
    if (m) m.hidden = false;
  },

  closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.hidden = true;
  },

  showMoodResults(mood) {
    const recs = MOOD_RECS[mood] || [];
    const box = document.getElementById('moodResult');
    box.innerHTML = `
      <h4>Perfect for your ${mood} mood:</h4>
      <ul>${recs.map(r => `<li>${r}</li>`).join('')}</ul>
    `;
    box.classList.add('visible');
  },

  bindThemeSwitch() {
    document.querySelectorAll('[data-theme]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-theme]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.applyTheme(btn.dataset.theme);
      });
    });
  },

  applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    Storage.set('theme', theme);
  },

  bindMenuToggle() {
    document.getElementById('menuToggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });
  },

  toast(msg, duration = 2500) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('visible');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.remove('visible'), duration);
  }
};

// Render content rows
function renderContentRow(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = items.map(item => `
    <div class="content-card" data-content-id="${item.id}">
      <div class="content-thumb" style="background: ${randomGradient(item.id)};">
        ${item.emoji}
        <div class="play-overlay">▶</div>
        ${item.progress > 0 ? `<div class="content-progress" style="width:${item.progress}%"></div>` : ''}
      </div>
      <div class="content-meta">
        <div class="content-title">${item.title}</div>
        <div class="content-info">
          <span>${item.year}</span> • <span>${item.genre}</span>
          ${item.tag ? `<span class="content-tag">${item.tag}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.content-card').forEach(card => {
    card.addEventListener('click', () => {
      App.switchView('player');
      App.toast('Opening: ' + items.find(i => i.id === card.dataset.contentId).title);
    });
  });
}

function randomGradient(seed) {
  const palettes = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash << 5) - hash + seed.charCodeAt(i);
  return palettes[Math.abs(hash) % palettes.length];
}
