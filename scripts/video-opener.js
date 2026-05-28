/* =========================================
   Global Video Opener — wires up file/folder/URL/FAB
   from any view, navigates to player, and plays.
   ========================================= */

const VideoOpener = {
  init() {
    const filePicker = document.getElementById('globalFilePicker');
    const folderPicker = document.getElementById('globalFolderPicker');

    // -------- File picker change handler --------
    filePicker?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      this.playFile(file);
      filePicker.value = ''; // reset so picking same file again retriggers
    });

    // -------- Folder picker change handler --------
    folderPicker?.addEventListener('change', (e) => {
      const all = Array.from(e.target.files || []);
      const videos = all.filter(f =>
        /\.(mp4|mkv|webm|mov|avi|m4v|flv|wmv|ogv|3gp|ts|mts)$/i.test(f.name) ||
        f.type.startsWith('video/')
      );
      if (!videos.length) {
        App.toast('No video files found in that folder');
        return;
      }
      App.toast('Found ' + videos.length + ' videos. Playing first...');
      this.playFile(videos[0]);
      if (window.Player) {
        Player.folderQueue = videos;
        Player.folderIndex = 0;
      }
      folderPicker.value = '';
    });

    // -------- All buttons that open the file picker --------
    const fileTriggers = [
      'fabOpenVideo',
      'navOpenVideo',
      'topOpenVideoBtn',
      'heroOpenFileBtn',
      'homeBigOpenBtn',
    ];
    fileTriggers.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openFilePicker();
      });
    });

    // Folder picker buttons
    document.getElementById('homeBigFolderBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openFolderPicker();
    });

    // URL input buttons
    document.getElementById('homeBigUrlBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openUrl();
    });

    // Hide FAB on auth view
    this.updateFabVisibility();
    const observer = new MutationObserver(() => this.updateFabVisibility());
    document.querySelectorAll('.view').forEach(v => {
      observer.observe(v, { attributes: true, attributeFilter: ['class'] });
    });
  },

  openFilePicker() {
    const picker = document.getElementById('globalFilePicker');
    if (!picker) {
      App.toast('File picker not available');
      return;
    }
    try {
      picker.click();
    } catch (e) {
      App.toast('Could not open file picker: ' + e.message);
    }
  },

  openFolderPicker() {
    const picker = document.getElementById('globalFolderPicker');
    if (!picker) return;
    try { picker.click(); }
    catch (e) { App.toast('Folder picker not supported. Use Open File instead.'); }
  },

  openUrl() {
    const url = prompt('Enter video URL (.mp4, .webm, .m3u8, etc):');
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      App.toast('URL must start with http:// or https://');
      return;
    }
    App.switchView('player');
    setTimeout(() => {
      const v = document.getElementById('video');
      if (!v) return;
      v.src = url;
      v.load();
      v.play().catch(() => {});
      const nameEl = document.getElementById('nowPlayingName');
      const name = url.split('/').pop().split('?')[0] || 'Stream';
      if (nameEl) nameEl.textContent = name;
      if (window.Player && Player.addRecentFile) {
        Player.addRecentFile({ name, url, time: Date.now(), kind: 'url' });
      }
      App.toast('Loading from URL...');
    }, 200);
  },

  playFile(file) {
    // Switch to player view first
    App.switchView('player');
    setTimeout(() => {
      const v = document.getElementById('video');
      if (!v) {
        App.toast('Player not ready, try again');
        return;
      }
      try {
        const url = URL.createObjectURL(file);
        if (this._lastUrl) URL.revokeObjectURL(this._lastUrl);
        this._lastUrl = url;
        v.src = url;
        v.load();
        const playPromise = v.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(err => {
            console.warn('Autoplay blocked:', err);
            App.toast('Tap play button to start');
          });
        }
        const nameEl = document.getElementById('nowPlayingName');
        if (nameEl) nameEl.textContent = file.name;
        if (window.Player && Player.addRecentFile) {
          Player.addRecentFile({ name: file.name, size: file.size, time: Date.now(), kind: 'local' });
        }
        App.toast('Playing: ' + file.name);
      } catch (e) {
        App.toast('Failed to load video: ' + e.message);
        console.error(e);
      }
    }, 250);
  },

  updateFabVisibility() {
    const fab = document.getElementById('fabOpenVideo');
    if (!fab) return;
    const onAuth = document.getElementById('view-auth')?.classList.contains('active');
    fab.style.display = onAuth ? 'none' : '';
  }
};
