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
      this.render(items, q);
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

  render(items, query) {
    const container = document.getElementById('searchResults');
    if (!container) return;
    const q = (query || document.getElementById('bigSearch')?.value || '').trim();

    if (!items.length) {
      // Show fallback: search on external platforms
      const encoded = encodeURIComponent(q);
      const fallbackHtml = q ? `
        <div class="search-fallback">
          <div class="fallback-icon">🔍</div>
          <h3>"${q}" — koi local result nahi mila</h3>
          <p>Try karo external platforms pe — naya tab mein open hoga:</p>
          <div class="fallback-links">
            <a class="fallback-btn yt" href="https://www.youtube.com/results?search_query=${encoded}" target="_blank" rel="noopener">
              <span class="fb-icon">▶️</span>
              <span class="fb-label">YouTube pe search karo</span>
            </a>
            <a class="fallback-btn ggl" href="https://www.google.com/search?q=${encoded}+watch+online" target="_blank" rel="noopener">
              <span class="fb-icon">🌐</span>
              <span class="fb-label">Google pe search karo</span>
            </a>
            <a class="fallback-btn nf" href="https://www.netflix.com/search?q=${encoded}" target="_blank" rel="noopener">
              <span class="fb-icon">🎬</span>
              <span class="fb-label">Netflix pe search</span>
            </a>
            <a class="fallback-btn pr" href="https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encoded}" target="_blank" rel="noopener">
              <span class="fb-icon">📺</span>
              <span class="fb-label">Prime Video pe search</span>
            </a>
            <a class="fallback-btn ds" href="https://www.hotstar.com/in/search?q=${encoded}" target="_blank" rel="noopener">
              <span class="fb-icon">⭐</span>
              <span class="fb-label">Hotstar/Disney+ pe search</span>
            </a>
            <a class="fallback-btn jio" href="https://www.jiocinema.com/search/${encoded}" target="_blank" rel="noopener">
              <span class="fb-icon">🎥</span>
              <span class="fb-label">JioCinema pe search</span>
            </a>
          </div>
          <p class="fallback-hint">💡 Tip: Sahi spelling try karo — jaise "radha", "krishna", "bahubali", "rrr"</p>
        </div>
      ` : `
        <div class="empty-search">
          <div style="font-size:48px;margin-bottom:8px;">🔍</div>
          <p>Search karne ke liye kuch type karo upar search box mein.</p>
        </div>
      `;
      container.innerHTML = fallbackHtml;
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
        // Open the platform's search/website in a new tab
        const enc = encodeURIComponent(item.title);
        const urls = {
          'YouTube':  `https://www.youtube.com/results?search_query=${enc}`,
          'Netflix':  `https://www.netflix.com/search?q=${enc}`,
          'Prime':    `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${enc}`,
          'Disney+':  `https://www.hotstar.com/in/search?q=${enc}`,
          'Hotstar':  `https://www.hotstar.com/in/search?q=${enc}`,
          'JioCinema':`https://www.jiocinema.com/search/${enc}`,
          'MX':       `https://www.mxplayer.in/search?query=${enc}`,
        };
        const url = urls[item.platform];
        if (url) {
          window.open(url, '_blank', 'noopener');
          App.toast(`Opening ${item.title} on ${item.platform}...`);
        } else {
          App.toast(`Opening ${item.title}...`);
          App.switchView('player');
        }
      });
    });
  }
};
