/* =========================================
   Subtitle file support: .srt / .vtt
   Loads, parses, and renders subtitles synced with the video.
   ========================================= */

const Subtitles = {
  cues: [],
  enabled: false,
  currentName: null,
  syncOffsetMs: 0,
  fontSize: 18,

  init() {
    this.bindUI();
  },

  bindUI() {
    // Hidden file input for subtitle file picker
    const subPicker = document.getElementById('subtitlePicker');
    if (subPicker) {
      subPicker.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) this.loadFile(file);
        subPicker.value = '';
      });
    }

    // Subtitle button in toolbar
    const subBtn = document.getElementById('subtitleBtn');
    if (subBtn) {
      subBtn.addEventListener('click', () => {
        this.showSubtitleMenu();
      });
    }

    // Toggle in side panel
    const subToggle = document.getElementById('subtitleToggle');
    if (subToggle) {
      subToggle.addEventListener('change', (e) => {
        this.enabled = e.target.checked;
        if (!this.enabled) this.hide();
        App.toast(this.enabled ? '📋 Subtitles ON' : 'Subtitles OFF');
      });
    }

    // Sync offset adjustments
    document.querySelectorAll('[data-sub-offset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = parseInt(btn.dataset.subOffset);
        this.syncOffsetMs += delta;
        const el = document.getElementById('subOffsetDisplay');
        if (el) el.textContent = (this.syncOffsetMs / 1000).toFixed(1) + 's';
        App.toast(`Subtitle offset: ${(this.syncOffsetMs / 1000).toFixed(1)}s`);
      });
    });

    // Font size
    document.querySelectorAll('[data-sub-size]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.fontSize = parseInt(btn.dataset.subSize);
        this.applyStyle();
        App.toast(`Subtitle size: ${this.fontSize}px`);
      });
    });

    // Hook into video timeupdate to update subtitles
    const video = document.getElementById('video');
    if (video) {
      video.addEventListener('timeupdate', () => this.update());
    }
  },

  showSubtitleMenu() {
    // Show a quick action sheet
    const status = this.cues.length
      ? `${this.cues.length} cues loaded from "${this.currentName}"`
      : 'No subtitles loaded';
    const choice = confirm(`${status}\n\nLoad a subtitle file (.srt or .vtt)?\n\nClick OK to pick a file, Cancel to keep current.`);
    if (choice) {
      document.getElementById('subtitlePicker').click();
    }
  },

  async loadFile(file) {
    try {
      const text = await file.text();
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'srt') {
        this.cues = this.parseSRT(text);
      } else if (ext === 'vtt') {
        this.cues = this.parseVTT(text);
      } else {
        // Try both parsers
        let cues = this.parseSRT(text);
        if (!cues.length) cues = this.parseVTT(text);
        this.cues = cues;
      }

      if (!this.cues.length) {
        App.toast('No subtitle cues found in file. Check format.');
        return;
      }

      this.currentName = file.name;
      this.enabled = true;
      const subToggle = document.getElementById('subtitleToggle');
      if (subToggle) subToggle.checked = true;
      App.toast(`📋 Loaded ${this.cues.length} subtitle cues from "${file.name}"`);
    } catch (e) {
      App.toast('Failed to load subtitle file: ' + e.message);
      console.error(e);
    }
  },

  // Parse SRT format
  // 1
  // 00:00:01,000 --> 00:00:04,000
  // Subtitle text here
  parseSRT(text) {
    const cues = [];
    // Normalize line endings
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const blocks = text.split(/\n\n+/);
    for (const block of blocks) {
      const lines = block.trim().split('\n');
      if (lines.length < 2) continue;
      // First line is index, optional. Find the timing line.
      let timingIdx = lines.findIndex(l => l.includes('-->'));
      if (timingIdx === -1) continue;
      const timing = lines[timingIdx];
      const m = timing.match(/(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/);
      if (!m) continue;
      const start = (+m[1]) * 3600 + (+m[2]) * 60 + (+m[3]) + (+m[4]) / 1000;
      const end   = (+m[5]) * 3600 + (+m[6]) * 60 + (+m[7]) + (+m[8]) / 1000;
      const text = lines.slice(timingIdx + 1).join('\n').trim();
      if (text) cues.push({ start, end, text });
    }
    return cues;
  },

  // Parse VTT format (similar to SRT but uses dots and has header)
  parseVTT(text) {
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    // Strip WEBVTT header
    text = text.replace(/^WEBVTT.*?\n\n/s, '');
    return this.parseSRT(text);
  },

  update() {
    if (!this.enabled || !this.cues.length) return;
    const video = document.getElementById('video');
    if (!video || video.paused) return;
    const t = video.currentTime + (this.syncOffsetMs / 1000);

    // Find active cue
    const active = this.cues.find(c => t >= c.start && t <= c.end);
    if (active) {
      this.show(active.text);
    } else {
      this.hide();
    }
  },

  show(text) {
    const el = document.getElementById('subtitleOverlay');
    if (!el) return;
    // Strip any HTML/style tags from SRT
    const clean = text
      .replace(/<[^>]+>/g, '')
      .replace(/\{[^}]+\}/g, '');
    el.innerHTML = clean.replace(/\n/g, '<br>');
    el.classList.add('visible');
    this.applyStyle();
  },

  hide() {
    const el = document.getElementById('subtitleOverlay');
    if (el) el.classList.remove('visible');
  },

  applyStyle() {
    const el = document.getElementById('subtitleOverlay');
    if (el) {
      el.style.fontSize = this.fontSize + 'px';
    }
  }
};
