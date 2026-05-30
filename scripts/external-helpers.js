/* =========================================
   External helpers:
   - MKV/AVI/FLV fallback: when HTML5 video can't play a format,
     offer to open in another player via Android intent (Capacitor)
     or show a friendly error in browser.
   - Chromecast: web Cast API support with sender library lazy-load.
   ========================================= */

const ExternalHelpers = {
  isAndroidApp() {
    return !!(window.Capacitor && window.Capacitor.isNativePlatform &&
              window.Capacitor.isNativePlatform());
  },

  init() {
    this.bindFormatErrorFallback();
    this.bindCastButton();
    this.lazyLoadCastSDK();
  },

  // ===== MKV/AVI/FLV fallback =====
  bindFormatErrorFallback() {
    const video = document.getElementById('video');
    if (!video) return;

    video.addEventListener('error', (e) => {
      const err = video.error;
      if (!err) return;
      // MEDIA_ERR_SRC_NOT_SUPPORTED = 4
      if (err.code === 4 || err.code === 3) {
        const lastFile = Storage.get('lastProgress');
        const ext = (lastFile && lastFile.src) ? lastFile.src.split('.').pop().split('?')[0].toLowerCase() : '';
        this.showFormatFallback(ext);
      }
    });
  },

  showFormatFallback(ext) {
    const container = document.getElementById('playerWrap');
    if (!container) return;
    let banner = document.getElementById('formatErrorBanner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'formatErrorBanner';
      banner.className = 'format-error-banner';
      container.appendChild(banner);
    }
    banner.innerHTML = `
      <div class="fmt-icon">⚠️</div>
      <div class="fmt-text">
        <strong>This format ${ext ? `(.${ext})` : ''} isn't supported by browser-based playback.</strong>
        <p>Use an external player like VLC or MX Player to play this file.</p>
      </div>
      <div class="fmt-actions">
        <button class="btn btn-primary" id="fmtOpenExternal">Open in another player</button>
        <button class="btn btn-ghost" id="fmtClose">Close</button>
      </div>
    `;
    banner.style.display = 'flex';

    document.getElementById('fmtClose').onclick = () => {
      banner.style.display = 'none';
    };
    document.getElementById('fmtOpenExternal').onclick = () => {
      this.openExternalPlayer();
      banner.style.display = 'none';
    };
  },

  async openExternalPlayer() {
    const video = document.getElementById('video');
    const src = video?.currentSrc || video?.src;
    if (!src) {
      App.toast('No video loaded');
      return;
    }
    if (this.isAndroidApp() && window.Capacitor?.Plugins?.App) {
      // Use Capacitor App plugin to open via intent
      try {
        await window.Capacitor.Plugins.App.openUrl({ url: src });
        App.toast('Opening in external player...');
      } catch (e) {
        App.toast('Could not open external player');
      }
    } else {
      // Browser fallback: open URL in new tab (if it's a URL); for blob: URLs, just notify
      if (src.startsWith('blob:')) {
        App.toast('Tip: For local files, install MX Player or VLC and open from your file manager');
      } else {
        window.open(src, '_blank');
        App.toast('Opening in new tab — if it doesn\'t play, copy the URL into VLC');
      }
    }
  },

  // ===== Chromecast =====
  lazyLoadCastSDK() {
    // Only load on browsers that have a Cast-capable environment (Chrome/Edge)
    // Skip if we're inside the Android WebView (Capacitor) — Cast SDK doesn't work there
    if (this.isAndroidApp()) {
      console.log('[Cast] Native Cast not available in webview build — using fallback');
      return;
    }
    // Don't load multiple times
    if (window.__castSDKLoaded) return;
    window.__castSDKLoaded = true;

    window['__onGCastApiAvailable'] = (isAvailable) => {
      if (isAvailable) {
        try {
          cast.framework.CastContext.getInstance().setOptions({
            receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
            autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
          });
          console.log('[Cast] Cast framework initialized');
        } catch (e) {
          console.warn('[Cast] Init failed:', e);
        }
      }
    };

    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
    script.async = true;
    script.onerror = () => {
      console.log('[Cast] Cast SDK could not be loaded');
    };
    document.head.appendChild(script);
  },

  bindCastButton() {
    const btn = document.getElementById('castBtn');
    if (!btn) return;
    btn.addEventListener('click', () => this.startCast());

    // Also support the topbar cast icon if present
    document.querySelectorAll('.icon-btn[title="Cast"]').forEach(b => {
      b.addEventListener('click', () => this.startCast());
    });
  },

  async startCast() {
    const video = document.getElementById('video');
    const src = video?.currentSrc || video?.src;

    // Try Web Cast API first (Chrome/Edge desktop)
    if (window.cast && cast.framework) {
      try {
        const session = await cast.framework.CastContext.getInstance().requestSession();
        if (!session) {
          App.toast('No cast device found');
          return;
        }
        if (!src || src.startsWith('blob:')) {
          App.toast('Cast needs a public URL — local files cannot be cast directly');
          return;
        }
        const mediaInfo = new chrome.cast.media.MediaInfo(src, 'video/mp4');
        const request = new chrome.cast.media.LoadRequest(mediaInfo);
        await session.loadMedia(request);
        App.toast('📺 Casting to ' + (session.getCastDevice()?.friendlyName || 'TV'));
      } catch (e) {
        App.toast('Cast cancelled or failed');
        console.warn('[Cast] Failed:', e);
      }
      return;
    }

    // Try Remote Playback API (alternative)
    if (video?.remote && typeof video.remote.prompt === 'function') {
      try {
        await video.remote.prompt();
        App.toast('📺 Cast prompt opened');
      } catch (e) {
        App.toast('Cast prompt cancelled');
      }
      return;
    }

    // Fallback: explain limitations
    App.toast('Cast requires Chrome browser or a Cast-enabled device on the same Wi-Fi');
  }
};
