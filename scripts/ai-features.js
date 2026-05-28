/* =========================================
   AI Features: subtitles, dubbing, scene skip, summary, karaoke, learn
   ========================================= */

const AIFeatures = {
  recognition: null,
  isListening: false,
  karaokeTimer: null,
  sceneSkipTimer: null,

  init() {
    this.bindToggles();
    this.bindSummary();
    this.bindWordLookup();
  },

  bindToggles() {
    document.getElementById('aiSubsToggle')?.addEventListener('change', e => {
      if (e.target.checked) this.startLiveSubtitles();
      else this.stopLiveSubtitles();
    });

    document.getElementById('dubToggle')?.addEventListener('change', e => {
      if (e.target.checked) this.simulateDubbing();
      else App.toast('Dubbing disabled');
    });

    document.getElementById('upscaleToggle')?.addEventListener('change', e => {
      Player.wrap.classList.toggle('upscaled', e.target.checked);
      App.toast(e.target.checked ? '📺 8K AI Upscaling ON' : 'Upscaling OFF');
    });

    document.getElementById('frameInterpToggle')?.addEventListener('change', e => {
      Player.wrap.classList.toggle('smooth', e.target.checked);
      App.toast(e.target.checked ? '🎞️ Frame Interpolation 60fps' : 'Standard playback');
    });

    document.getElementById('sceneSkipToggle')?.addEventListener('change', e => {
      if (e.target.checked) this.startSceneSkip();
      else this.stopSceneSkip();
    });

    document.getElementById('karaokeToggle')?.addEventListener('change', e => {
      if (e.target.checked) this.startKaraoke();
      else this.stopKaraoke();
    });

    document.getElementById('learnToggle')?.addEventListener('change', e => {
      App.toast(e.target.checked ? '📚 Learn Mode ON — Tap subtitle words for meaning' : 'Learn Mode OFF');
    });

    document.getElementById('vrToggle')?.addEventListener('change', e => {
      Player.wrap.classList.toggle('vr-mode', e.target.checked);
      App.toast(e.target.checked ? '🥽 VR Mode ON' : 'VR Mode OFF');
    });

    document.getElementById('spatialToggle')?.addEventListener('change', e => {
      App.toast(e.target.checked ? '🔊 Spatial Audio simulation ON' : 'Spatial Audio OFF');
    });

    document.getElementById('boosterToggle')?.addEventListener('change', e => {
      Player.enableBooster(e.target.checked);
    });
  },

  // ===== Live Subtitles using Web Speech API =====
  startLiveSubtitles() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      App.toast('Speech recognition not supported in this browser. Use Chrome/Edge.');
      // Fallback: show simulated subtitles tied to time
      this.startSimulatedSubtitles();
      return;
    }

    try {
      this.recognition = new SR();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (e) => {
        let txt = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          txt += e.results[i][0].transcript;
        }
        this.showSubtitle(txt);
      };

      this.recognition.onerror = (e) => {
        console.warn('SR error', e.error);
        if (e.error === 'no-speech') this.startSimulatedSubtitles();
      };

      this.recognition.start();
      this.isListening = true;
      App.toast('🤖 AI Subtitles ON (using mic for live audio)');
      // Also start simulated alongside, so demo works without mic capture
      this.startSimulatedSubtitles();
    } catch (e) {
      this.startSimulatedSubtitles();
    }
  },

  stopLiveSubtitles() {
    try { this.recognition?.stop(); } catch (e) {}
    this.isListening = false;
    clearInterval(this._simSubTimer);
    this.hideSubtitle();
    App.toast('Subtitles OFF');
  },

  startSimulatedSubtitles() {
    const lines = [
      'Welcome to the world of MX Player Pro.',
      'Experience entertainment like never before.',
      'Powered by AI, built for everyone.',
      'Every frame, every word, perfectly clear.',
      'Watch in any language you choose.',
      'Share moments with friends in real time.',
      'Your story, your screen, your stage.',
    ];
    let i = 0;
    clearInterval(this._simSubTimer);
    this._simSubTimer = setInterval(() => {
      if (Player.video.paused) return;
      this.showSubtitle(lines[i % lines.length]);
      i++;
    }, 4000);
  },

  showSubtitle(text) {
    const el = document.getElementById('liveSubtitle');
    if (!el) return;
    const learnOn = document.getElementById('learnToggle')?.checked;
    if (learnOn) {
      // Make each word clickable
      el.innerHTML = text.split(/\s+/).map(w => `<span class="clickable" data-word="${w.replace(/[^a-zA-Z]/g,'')}">${w}</span>`).join(' ');
      el.querySelectorAll('.clickable').forEach(span => {
        span.addEventListener('click', () => {
          const w = span.dataset.word.toLowerCase();
          this.lookupWord(w);
        });
      });
    } else {
      el.textContent = text;
    }
    el.classList.add('visible');
    clearTimeout(this._subTimer);
    this._subTimer = setTimeout(() => el.classList.remove('visible'), 4500);
  },

  hideSubtitle() {
    document.getElementById('liveSubtitle')?.classList.remove('visible');
  },

  // ===== Dubbing simulation =====
  simulateDubbing() {
    const lang = document.getElementById('dubLang').value;
    const langName = document.getElementById('dubLang').selectedOptions[0].textContent;
    App.toast(`🎙️ AI Dubbing: ${langName} (simulated)`);
    // Set audio language attempt (works only for tracks present)
    try {
      const tracks = Player.video.audioTracks;
      if (tracks && tracks.length > 1) {
        for (let t of tracks) t.enabled = (t.language === lang);
      }
    } catch (e) {}
  },

  // ===== Smart Scene Skip =====
  startSceneSkip() {
    App.toast('⏩ Smart Scene Skip ON — boring parts will be auto-skipped');
    clearInterval(this.sceneSkipTimer);
    this.sceneSkipTimer = setInterval(() => {
      const v = Player.video;
      if (!v.duration || v.paused) return;
      // Heuristic: simulate detection — every 60s if duration > 120s, jump 5s
      const t = v.currentTime;
      const segments = [
        { start: 5, end: 12, reason: 'Intro' },
        { start: 100, end: 110, reason: 'Recap' },
      ];
      for (const seg of segments) {
        if (t >= seg.start && t <= seg.start + 0.5) {
          v.currentTime = seg.end;
          App.toast(`⏩ Skipped: ${seg.reason}`);
          break;
        }
      }
    }, 1000);
  },

  stopSceneSkip() {
    clearInterval(this.sceneSkipTimer);
    App.toast('Scene skip OFF');
  },

  // ===== AI Summary =====
  bindSummary() {
    document.getElementById('summaryBtn')?.addEventListener('click', () => {
      const box = document.getElementById('summaryBox');
      box.hidden = false;
      box.innerHTML = '<em>Generating AI summary...</em>';
      setTimeout(() => {
        box.innerHTML = `
          <strong>📽️ AI Summary</strong><br>
          A short animated film about a curious creature exploring a vibrant world. The story unfolds with humour and heart, showing themes of courage and friendship.<br><br>
          <strong>Key moments:</strong>
          <ul style="margin-top:6px; padding-left:18px;">
            <li>0:30 — Opening scene introduces the protagonist</li>
            <li>2:15 — First conflict appears</li>
            <li>4:40 — Emotional turning point</li>
            <li>6:50 — Climax & resolution</li>
          </ul>
          <small style="opacity:.7">Generated in 2.3s by MXPro AI</small>
        `;
      }, 1500);
    });
  },

  // ===== Karaoke =====
  startKaraoke() {
    Player.wrap.classList.add('karaoke');
    App.toast('🎤 Karaoke Mode ON');
    clearInterval(this.karaokeTimer);
    const overlay = document.getElementById('karaokeOverlay');
    let lastIndex = -1;
    this.karaokeTimer = setInterval(() => {
      const t = Player.video.currentTime;
      let idx = -1;
      for (let i = 0; i < KARAOKE_LYRICS.length; i++) {
        if (t >= KARAOKE_LYRICS[i].time) idx = i;
      }
      if (idx === -1) return;
      if (idx !== lastIndex) {
        lastIndex = idx;
        const cur = KARAOKE_LYRICS[idx];
        const next = KARAOKE_LYRICS[idx + 1];
        overlay.innerHTML = `
          <div class="lyric-line active">${cur.text}</div>
          ${next ? `<div class="lyric-line" style="opacity:.55;font-size:18px;">${next.text}</div>` : ''}
        `;
      }
    }, 250);
  },

  stopKaraoke() {
    clearInterval(this.karaokeTimer);
    Player.wrap.classList.remove('karaoke');
    document.getElementById('karaokeOverlay').innerHTML = '<div class="lyric-line">🎵 Click "Karaoke" to load lyrics 🎵</div>';
  },

  // ===== Word lookup =====
  bindWordLookup() {
    document.getElementById('lookupBtn')?.addEventListener('click', () => {
      const w = document.getElementById('wordInput').value.trim().toLowerCase();
      this.lookupWord(w);
    });
    document.getElementById('wordInput')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('lookupBtn').click();
    });
  },

  lookupWord(word) {
    const result = document.getElementById('lookupResult');
    if (!word) { result.textContent = ''; return; }
    const def = WORD_DICT[word.toLowerCase()];
    if (def) {
      result.innerHTML = `<strong>${word}</strong>: ${def}`;
    } else {
      result.innerHTML = `<strong>${word}</strong>: <em>Not in mini-dictionary. (In production this calls a translation API.)</em>`;
    }
    App.toast(`📖 ${word}`);
  }
};
