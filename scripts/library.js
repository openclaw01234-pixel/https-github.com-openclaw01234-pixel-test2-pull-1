/* =========================================
   Library: history, playlists, downloads tabs
   ========================================= */

const Library = {
  init() {
    this.bindTabs();
    this.renderHistory();
    this.renderPlaylists();
    this.bindNewPlaylist();
  },

  bindTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
      });
    });
  },

  renderHistory() {
    const items = Storage.get('history', CONTINUE);
    renderContentRow('historyRow', items);
  },

  renderPlaylists() {
    const playlists = Storage.get('playlists', [
      { id: 'p1', name: 'Weekend Watch', count: 12 },
      { id: 'p2', name: 'Bollywood Classics', count: 24 },
      { id: 'p3', name: 'Workout Music Videos', count: 8 },
    ]);
    const grid = document.getElementById('playlistGrid');
    grid.innerHTML = playlists.map(p => `
      <div class="playlist-card">
        <h4>📁 ${p.name}</h4>
        <div class="pl-count">${p.count} items</div>
      </div>
    `).join('');
  },

  bindNewPlaylist() {
    document.getElementById('newPlaylistBtn')?.addEventListener('click', () => {
      const name = prompt('Playlist name:');
      if (!name) return;
      const playlists = Storage.get('playlists', []);
      playlists.push({ id: 'p_' + Date.now(), name, count: 0 });
      Storage.set('playlists', playlists);
      this.renderPlaylists();
      App.toast('Playlist created: ' + name);
    });
  }
};
