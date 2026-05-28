/* =========================================
   Universal Search across mock OTT platforms
   ========================================= */

const Search = {
  currentPlatform: 'all',

  init() {
    this.bindSearch();
    this.bindFilters();
    this.render(SEARCH_DATA); // initial show all
  },

  bindSearch() {
    const run = () => {
      const q = (document.getElementById('bigSearch').value || '').trim().toLowerCase();
      let items = SEARCH_DATA;
      if (q) {
        items = items.filter(i =>
          i.title.toLowerCase().includes(q) ||
          i.genre.toLowerCase().includes(q) ||
          i.platform.toLowerCase().includes(q)
        );
      }
      if (this.currentPlatform !== 'all') {
        items = items.filter(i => i.platform === this.currentPlatform);
      }
      this.render(items);
      App.toast(`Found ${items.length} results across platforms`);
    };

    document.getElementById('bigSearchBtn')?.addEventListener('click', run);
    document.getElementById('bigSearch')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') run();
    });

    // Top search redirects to search view
    document.getElementById('topSearch')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const q = e.target.value;
        document.getElementById('bigSearch').value = q;
        App.switchView('search');
        run();
      }
    });
  },

  bindFilters() {
    document.querySelectorAll('.platform-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.platform-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentPlatform = chip.dataset.platform;
        // re-run search
        document.getElementById('bigSearchBtn').click();
      });
    });
  },

  render(items) {
    const container = document.getElementById('searchResults');
    if (!container) return;
    if (!items.length) {
      container.innerHTML = `<div class="empty-search">
        <div style="font-size:48px;margin-bottom:8px;">🔍</div>
        <p>No results found. Try a different search.</p>
      </div>`;
      return;
    }
    container.innerHTML = items.map(item => {
      const cls = item.platform.toLowerCase().replace('+', '');
      return `
        <div class="result-card" data-id="${item.id}">
          <div class="result-thumb" style="background:${randomGradient(item.id)};">
            ${item.emoji}
            <span class="platform-badge ${cls}">${item.platform}</span>
          </div>
          <div class="result-meta">
            <div class="result-title">${item.title}</div>
            <div class="result-info">${item.year} • ${item.genre}</div>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.result-card').forEach(card => {
      card.addEventListener('click', () => {
        const item = items.find(i => i.id === card.dataset.id);
        App.toast(`Opening ${item.title} on ${item.platform}...`);
        App.switchView('player');
      });
    });
  }
};
