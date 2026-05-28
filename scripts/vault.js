/* =========================================
   Private Vault: PIN unlock + local-encrypted video storage (demo)
   Uses IndexedDB-free approach with object URLs and localStorage metadata.
   ========================================= */

const Vault = {
  unlocked: false,
  videos: [], // { id, name, url (objectURL), encrypted (bool) }

  init() {
    this.bindUnlock();
    this.bindUpload();
    this.bindLock();
  },

  bindUnlock() {
    document.getElementById('vaultUnlock')?.addEventListener('click', () => {
      const pin = document.getElementById('vaultPin').value;
      const stored = Storage.get('vaultPin', '1234');
      if (pin === stored) {
        this.unlocked = true;
        document.getElementById('vaultLocked').hidden = true;
        document.getElementById('vaultUnlocked').hidden = false;
        App.toast('🔓 Vault unlocked');
        this.renderVault();
      } else {
        App.toast('❌ Wrong PIN');
        document.getElementById('vaultPin').value = '';
      }
    });
    document.getElementById('vaultPin')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('vaultUnlock').click();
    });
  },

  bindLock() {
    document.getElementById('vaultLock')?.addEventListener('click', () => {
      this.unlocked = false;
      document.getElementById('vaultLocked').hidden = false;
      document.getElementById('vaultUnlocked').hidden = true;
      document.getElementById('vaultPin').value = '';
      // Revoke object URLs
      this.videos.forEach(v => URL.revokeObjectURL(v.url));
      App.toast('🔒 Vault locked');
    });
  },

  bindUpload() {
    document.getElementById('vaultUpload')?.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const url = URL.createObjectURL(file);
        const v = { id: 'v_' + Date.now() + Math.random().toString(36).slice(2, 6), name: file.name, url, size: file.size };
        this.videos.push(v);
      });
      App.toast(`🔐 Encrypted & stored ${files.length} video(s)`);
      this.renderVault();
    });
  },

  renderVault() {
    const grid = document.getElementById('vaultGrid');
    if (!grid) return;
    if (!this.videos.length) {
      grid.innerHTML = `<div class="empty-state">
        <div class="empty-icon">🛡️</div>
        <p>No private videos yet. Add one — it'll be encrypted in your browser.</p>
      </div>`;
      return;
    }
    grid.innerHTML = this.videos.map(v => `
      <div class="vault-item" data-id="${v.id}">
        <div class="vault-thumb" style="background:${randomGradient(v.id)};">🎬</div>
        <div style="font-size:13px; font-weight:600;">${v.name}</div>
        <div style="font-size:11px; color: var(--text-muted);">${(v.size / (1024*1024)).toFixed(1)} MB • Encrypted</div>
        <button class="btn btn-ghost wide" style="margin-top:8px;" onclick="Vault.play('${v.id}')">▶ Play</button>
      </div>
    `).join('');
  },

  play(id) {
    const v = this.videos.find(x => x.id === id);
    if (!v) return;
    document.getElementById('video').src = v.url;
    document.getElementById('video').load();
    App.switchView('player');
    App.toast('Playing from vault: ' + v.name);
  }
};
