/* =========================================
   Video Player: core controls
   ========================================= */

const Player = {
  video: null,
  wrap: null,
  abLoop: { a: null, b: null },
  audioCtx: null,
  gainNode: null,
  idleTimer: null,

  init() {
    this.video = document.getElementById('video');
    this.wrap = document.getElementById('playerWrap');
    if (!this.video) return;

    this.bindControls();
    this.bindKeyboard();
    this.bindIdle();
    this.bindFilters();
    this.bindSleepTimer();
    this.restoreProgress();
  },

  bindControls() {
    const v = this.video;

    // Play/pause
    document.getElementById('playBtn').addEventListener('click', () => this.toggle());
    document.getElementById('centerPlay').addEventListener('click', () => this.toggle());
    v.addEventListener('click', () => this.toggle());
    v.addEventListener('play', () => this.onPlay());
    v.addEventListener('pause', () => this.onPause());
    v.addEventListener('ended', () => this.onPause());

    // Time / progress
    v.addEventListener('timeupdate', () => this.updateProgress());
    v.addEventListener('loadedmetadata', () => this.updateProgress());

    document.getElementById('progress').addEventListener('input', (e) => {
      v.currentTime = (e.target.value / 100) * v.duration;
    });

    // Seek
    document.getElementById('rewindBtn').addEventListener('click', () => this.seek(-10));
    document.getElementById('forwardBtn').addEventListener('click', () => this.seek(10));

    // Volume
    document.getElementById('volume').addEventListener('input', e => {
      v.volume = e.target.value / 100;
      v.muted = false;
      this.updateVolumeIcon();
    });
    document.getElementById('muteBtn').addEventListener('click', () => {
      v.muted = !v.muted;
      this.updateVolumeIcon();
    });

    // Speed
    document.getElementById('speedSelect').addEventListener('change', e => {
      v.playbackRate = parseFloat(e.target.value);
      App.toast(`Speed: ${e.target.value}x`);
    });

    // Fullscreen
    document.getElementById('fsBtn').addEventListener('click', () => this.toggleFullscreen());

    // PiP
    document.getElementById('pipBtn').addEventListener('click', () => this.togglePiP());

    // Screenshot
    document.getElementById('shotBtn').addEventListener('click', () => this.takeScreenshot());

    // A-B loop
    document.getElementById('abLoopBtn').addEventListener('click', () => this.toggleABLoop());

    // Save progress periodically
    setInterval(() => this.saveProgress(), 5000);
  },

  toggle() {
    if (this.video.paused) this.video.play();
    else this.video.pause();
  },

  onPlay() {
    document.getElementById('playBtn').textContent = '❚❚';
    document.getElementById('centerPlay').classList.add('hidden');
  },

  onPause() {
    document.getElementById('playBtn').textContent = '▶';
    document.getElementById('centerPlay').classList.remove('hidden');
  },

  seek(seconds) {
    this.video.currentTime = Math.max(0, Math.min(this.video.duration || 0, this.video.currentTime + seconds));
    App.toast((seconds > 0 ? '+' : '') + seconds + 's');
  },

  updateProgress() {
    const v = this.video;
    if (!v.duration) return;
    const pct = (v.currentTime / v.duration) * 100;
    document.getElementById('progress').value = pct;
    document.getElementById('curTime').textContent = this.fmt(v.currentTime);
    document.getElementById('duration').textContent = this.fmt(v.duration);

    // A-B loop check
    if (this.abLoop.a !== null && this.abLoop.b !== null && v.currentTime >= this.abLoop.b) {
      v.currentTime = this.abLoop.a;
    }
  },

  fmt(s) {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  },

  updateVolumeIcon() {
    const v = this.video;
    const btn = document.getElementById('muteBtn');
    if (v.muted || v.volume === 0) btn.textContent = '🔇';
    else if (v.volume < 0.5) btn.textContent = '🔉';
    else btn.textContent = '🔊';
  },

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.wrap.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  },

  async togglePiP() {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (this.video.requestPictureInPicture) {
        await this.video.requestPictureInPicture();
      } else {
        App.toast('Picture-in-Picture not supported');
      }
    } catch (e) {
      App.toast('PiP failed: ' + e.message);
    }
  },

  takeScreenshot() {
    const canvas = document.createElement('canvas');
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;
    const ctx = canvas.getContext('2d');
    try {
      ctx.drawImage(this.video, 0, 0);
      const a = document.createElement('a');
      a.download = `mxpro-screenshot-${Date.now()}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
      App.toast('📷 Screenshot saved');
    } catch (e) {
      App.toast('Screenshot blocked (CORS). Try an uploaded video.');
    }
  },

  toggleABLoop() {
    const t = this.video.currentTime;
    const btn = document.getElementById('abLoopBtn');
    if (this.abLoop.a === null) {
      this.abLoop.a = t;
      btn.textContent = `🔁 A:${this.fmt(t)}`;
      App.toast('Loop point A set');
    } else if (this.abLoop.b === null) {
      this.abLoop.b = t;
      btn.classList.add('active');
      btn.textContent = `🔁 ${this.fmt(this.abLoop.a)}-${this.fmt(t)}`;
      App.toast('A-B loop active');
    } else {
      this.abLoop = { a: null, b: null };
      btn.classList.remove('active');
      btn.textContent = '🔁 A-B';
      App.toast('Loop cleared');
    }
  },

  bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (App.currentView !== 'player') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault(); this.toggle(); break;
        case 'ArrowRight':
          e.preventDefault(); this.seek(5); break;
        case 'ArrowLeft':
          e.preventDefault(); this.seek(-5); break;
        case 'ArrowUp':
          e.preventDefault();
          this.video.volume = Math.min(1, this.video.volume + 0.1);
          document.getElementById('volume').value = this.video.volume * 100;
          this.updateVolumeIcon(); break;
        case 'ArrowDown':
          e.preventDefault();
          this.video.volume = Math.max(0, this.video.volume - 0.1);
          document.getElementById('volume').value = this.video.volume * 100;
          this.updateVolumeIcon(); break;
        case 'f': this.toggleFullscreen(); break;
        case 'm': this.video.muted = !this.video.muted; this.updateVolumeIcon(); break;
        case 's': this.takeScreenshot(); break;
        case 'p': this.togglePiP(); break;
        case 'a':
          if (this.abLoop.a === null) {
            this.abLoop.a = this.video.currentTime;
            App.toast('A point set');
          }
          break;
        case 'b':
          if (this.abLoop.a !== null && this.abLoop.b === null) {
            this.abLoop.b = this.video.currentTime;
            document.getElementById('abLoopBtn').classList.add('active');
            App.toast('A-B loop active');
          }
          break;
      }
    });
  },

  bindIdle() {
    const showControls = () => {
      this.wrap.classList.remove('idle');
      clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => {
        if (!this.video.paused) this.wrap.classList.add('idle');
      }, 3000);
    };
    this.wrap.addEventListener('mousemove', showControls);
    this.wrap.addEventListener('touchstart', showControls);
    showControls();
  },

  bindFilters() {
    const apply = () => {
      const b = document.getElementById('brightness').value;
      const c = document.getElementById('contrast').value;
      const s = document.getElementById('saturation').value;
      this.video.style.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
    };
    ['brightness','contrast','saturation'].forEach(id => {
      document.getElementById(id).addEventListener('input', apply);
    });
  },

  bindSleepTimer() {
    document.querySelectorAll('[data-sleep]').forEach(btn => {
      btn.addEventListener('click', () => {
        const min = parseInt(btn.dataset.sleep);
        clearTimeout(this._sleepTimer);
        if (min === 0) {
          document.getElementById('sleepStatus').textContent = 'Off';
          App.toast('Sleep timer cancelled');
          return;
        }
        const stopAt = Date.now() + min * 60 * 1000;
        this._sleepTimer = setTimeout(() => {
          this.video.pause();
          App.toast('💤 Sleep timer triggered');
          document.getElementById('sleepStatus').textContent = 'Off';
        }, min * 60 * 1000);
        document.getElementById('sleepStatus').textContent = `Active: ${min}m`;
        App.toast(`Sleep timer set for ${min} minutes`);

        // Update countdown
        const tick = () => {
          const left = Math.max(0, Math.round((stopAt - Date.now()) / 60000));
          if (left > 0) {
            document.getElementById('sleepStatus').textContent = `Active: ~${left}m left`;
            setTimeout(tick, 30000);
          }
        };
        setTimeout(tick, 30000);
      });
    });
  },

  saveProgress() {
    if (!this.video || !this.video.duration) return;
    Storage.set('lastProgress', {
      src: this.video.currentSrc,
      time: this.video.currentTime,
      duration: this.video.duration,
      saved: Date.now(),
    });
  },

  restoreProgress() {
    const last = Storage.get('lastProgress');
    if (!last) return;
    this.video.addEventListener('loadedmetadata', () => {
      if (this.video.currentSrc === last.src && last.time < (last.duration - 5)) {
        this.video.currentTime = last.time;
        App.toast(`▶ Resumed from ${this.fmt(last.time)}`);
      }
    }, { once: true });
  },

  // Audio booster (>100% volume via Web Audio API)
  enableBooster(boost = true) {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = this.audioCtx.createMediaElementSource(this.video);
        this.gainNode = this.audioCtx.createGain();
        source.connect(this.gainNode);
        this.gainNode.connect(this.audioCtx.destination);
      }
      this.gainNode.gain.value = boost ? 2.5 : 1.0;
      App.toast(boost ? '📢 Booster ON (250%)' : 'Booster OFF');
    } catch (e) {
      App.toast('Booster needs user interaction first');
    }
  }
};
