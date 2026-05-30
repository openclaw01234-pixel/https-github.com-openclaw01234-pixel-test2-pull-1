/* =========================================
   First-Time Onboarding Tutorial
   Shows 5 slides explaining key features.
   Only displays on first launch (or when manually triggered).
   ========================================= */

const Onboarding = {
  currentSlide: 0,

  slides: [
    {
      icon: '🎬',
      title: 'Welcome to MX Player Pro',
      subtitle: 'World\'s best video player + entertainment platform',
      description: 'AI-powered playback, watch parties, universal search, and much more — all in one app.',
      bg: 'linear-gradient(135deg, #ff3366, #ff6b3d)'
    },
    {
      icon: '📂',
      title: 'Open Any Video',
      subtitle: 'Floating button (bottom-right) is always visible',
      description: 'Tap the floating 📂 button from any screen to instantly open videos from your phone — MP4, MKV, AVI, MOV, WebM, all supported.',
      bg: 'linear-gradient(135deg, #06b6d4, #3b82f6)'
    },
    {
      icon: '🔍',
      title: 'Universal Search',
      subtitle: 'One search across all platforms',
      description: 'Search Netflix, Prime, YouTube, Disney+, Hotstar, JioCinema, MX — all in one place. No more app-hopping.',
      bg: 'linear-gradient(135deg, #ec4899, #8b5cf6)'
    },
    {
      icon: '🎉',
      title: 'Watch Party',
      subtitle: 'Movie nights with friends, anywhere',
      description: 'Sync video playback with friends, voice chat, send floating reactions, and chat in real-time. Just like watching together!',
      bg: 'linear-gradient(135deg, #f59e0b, #ef4444)'
    },
    {
      icon: '✨',
      title: 'Pro Features',
      subtitle: 'Smart, fast, beautiful',
      description: 'AI subtitles, voice dubbing, 8K upscaling, scene skip, karaoke mode, private vault, sleep timer, and more. All ready to use!',
      bg: 'linear-gradient(135deg, #10b981, #06b6d4)'
    }
  ],

  init() {
    this.bindHelpButton();
    this.checkFirstLaunch();
  },

  checkFirstLaunch() {
    const seen = Storage.get('onboardingSeen', false);
    if (!seen) {
      // Wait a moment for app to settle, then show
      setTimeout(() => this.show(), 1500);
    }
  },

  bindHelpButton() {
    // Allow user to re-open onboarding from settings
    const btn = document.getElementById('showOnboardingBtn');
    if (btn) btn.addEventListener('click', () => this.show());
  },

  show() {
    let modal = document.getElementById('onboardingModal');
    if (!modal) {
      modal = this.buildModal();
      document.body.appendChild(modal);
    }
    modal.hidden = false;
    this.currentSlide = 0;
    this.render();
  },

  hide() {
    const modal = document.getElementById('onboardingModal');
    if (modal) modal.hidden = true;
    Storage.set('onboardingSeen', true);
  },

  buildModal() {
    const modal = document.createElement('div');
    modal.id = 'onboardingModal';
    modal.className = 'onboarding-modal';
    modal.innerHTML = `
      <div class="onboarding-content">
        <button class="onboarding-skip" id="onboardingSkipBtn">Skip</button>
        <div class="onboarding-slide" id="onboardingSlide"></div>
        <div class="onboarding-dots" id="onboardingDots"></div>
        <div class="onboarding-actions">
          <button class="btn btn-ghost" id="onboardingPrevBtn">Back</button>
          <button class="btn btn-primary" id="onboardingNextBtn">Next →</button>
        </div>
      </div>
    `;

    // Wire up controls (after appending - we'll attach AFTER modal is in DOM)
    setTimeout(() => {
      modal.querySelector('#onboardingSkipBtn').addEventListener('click', () => this.hide());
      modal.querySelector('#onboardingPrevBtn').addEventListener('click', () => this.prev());
      modal.querySelector('#onboardingNextBtn').addEventListener('click', () => this.next());

      // Click outside to close (but only after a small delay so accidental clicks don't dismiss)
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.hide();
      });

      // Touch swipe
      let startX = 0;
      modal.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
      modal.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 60) {
          if (dx < 0) this.next();
          else this.prev();
        }
      });
    }, 0);

    return modal;
  },

  render() {
    const slide = this.slides[this.currentSlide];
    const slideEl = document.getElementById('onboardingSlide');
    if (slideEl) {
      slideEl.style.background = slide.bg;
      slideEl.innerHTML = `
        <div class="onboarding-icon">${slide.icon}</div>
        <h2 class="onboarding-title">${slide.title}</h2>
        <h3 class="onboarding-subtitle">${slide.subtitle}</h3>
        <p class="onboarding-desc">${slide.description}</p>
      `;
    }

    // Dots
    const dots = document.getElementById('onboardingDots');
    if (dots) {
      dots.innerHTML = this.slides.map((_, i) =>
        `<span class="onboarding-dot ${i === this.currentSlide ? 'active' : ''}" data-idx="${i}"></span>`
      ).join('');
      dots.querySelectorAll('.onboarding-dot').forEach(d => {
        d.addEventListener('click', () => {
          this.currentSlide = parseInt(d.dataset.idx);
          this.render();
        });
      });
    }

    // Buttons
    const prevBtn = document.getElementById('onboardingPrevBtn');
    const nextBtn = document.getElementById('onboardingNextBtn');
    if (prevBtn) prevBtn.style.visibility = this.currentSlide === 0 ? 'hidden' : 'visible';
    if (nextBtn) {
      const isLast = this.currentSlide === this.slides.length - 1;
      nextBtn.textContent = isLast ? '🚀 Get Started' : 'Next →';
    }
  },

  next() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
      this.render();
    } else {
      this.hide();
    }
  },

  prev() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.render();
    }
  }
};
