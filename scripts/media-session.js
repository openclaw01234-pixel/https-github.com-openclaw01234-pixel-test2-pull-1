/* =========================================
   MediaSession API + background audio + Auto-PiP
   - Lock screen / notification controls
   - Background audio playback
   - Auto-enter PiP when app goes to background
   ========================================= */

const MediaSessionMgr = {
  init() {
    this.bindMediaSession();
    this.bindBackground();
    this.bindAutoPiP();
  },

  bindMediaSession() {
    if (!('mediaSession' in navigator)) {
      console.log('[MediaSession] Not supported');
      return;
    }

    const video = document.getElementById('video');
    if (!video) return;

    // Update metadata when a new video loads
    const updateMetadata = () => {
      const nowPlaying = document.getElementById('nowPlayingName');
      const title = nowPlaying ? nowPlaying.textContent : 'MX Player Pro';
      navigator.mediaSession.metadata = new MediaMetadata({
        title: title,
        artist: 'MX Player Pro',
        album: 'Now Playing',
        artwork: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      });
    };

    video.addEventListener('play', () => {
      updateMetadata();
      navigator.mediaSession.playbackState = 'playing';
    });

    video.addEventListener('pause', () => {
      navigator.mediaSession.playbackState = 'paused';
    });

    video.addEventListener('loadedmetadata', updateMetadata);

    // Action handlers — what notification/lock-screen buttons do
    try {
      navigator.mediaSession.setActionHandler('play', () => {
        video.play().catch(() => {});
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        video.pause();
      });
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        video.currentTime = Math.max(0, video.currentTime - (details.seekOffset || 10));
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        video.currentTime = Math.min(video.duration || 0, video.currentTime + (details.seekOffset || 10));
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.fastSeek && 'fastSeek' in video) {
          video.fastSeek(details.seekTime);
        } else {
          video.currentTime = details.seekTime;
        }
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        // Jump back 30s
        video.currentTime = Math.max(0, video.currentTime - 30);
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        // Jump forward 30s — or go to next file in folder queue
        if (window.Player && Player.folderQueue && Player.folderQueue.length > Player.folderIndex + 1) {
          Player.folderIndex++;
          if (window.VideoOpener) {
            VideoOpener.playFile(Player.folderQueue[Player.folderIndex]);
          }
        } else {
          video.currentTime = Math.min(video.duration || 0, video.currentTime + 30);
        }
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        video.pause();
        video.currentTime = 0;
      });

      // Update position state periodically
      video.addEventListener('timeupdate', () => {
        if (!isFinite(video.duration)) return;
        try {
          navigator.mediaSession.setPositionState({
            duration: video.duration,
            playbackRate: video.playbackRate,
            position: video.currentTime,
          });
        } catch (e) { /* ignore */ }
      });
    } catch (e) {
      console.warn('[MediaSession] Some actions not supported:', e);
    }

    console.log('[MediaSession] Lock screen / notification controls active');
  },

  bindBackground() {
    const video = document.getElementById('video');
    if (!video) return;

    // Don't pause when page becomes hidden — let audio continue
    // (this is the default for HTML5 video, but some browsers/PWAs pause)
    document.addEventListener('visibilitychange', () => {
      // Only do something if video is currently playing
      if (document.hidden && !video.paused) {
        // Keep playing audio. Browser will dim/hide video element automatically.
        console.log('[MediaSession] Page hidden — continuing audio playback');
      }
    });

    // Wake lock to prevent screen from turning off during video
    if ('wakeLock' in navigator) {
      let wakeLock = null;
      const requestWakeLock = async () => {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
        } catch (e) {
          // ignored - wake lock failed
        }
      };
      const releaseWakeLock = async () => {
        if (wakeLock) {
          try { await wakeLock.release(); } catch (e) {}
          wakeLock = null;
        }
      };
      video.addEventListener('play', requestWakeLock);
      video.addEventListener('pause', releaseWakeLock);
      video.addEventListener('ended', releaseWakeLock);

      // Re-request after page comes back from hidden
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !video.paused) {
          requestWakeLock();
        }
      });
    }
  },

  bindAutoPiP() {
    const video = document.getElementById('video');
    if (!video) return;
    if (!document.pictureInPictureEnabled) {
      console.log('[AutoPiP] PiP not supported');
      return;
    }

    let userDisabledAutoPiP = false;

    // Allow user to disable auto-PiP via toggle
    const togAuto = document.getElementById('autoPipToggle');
    if (togAuto) {
      togAuto.addEventListener('change', (e) => {
        userDisabledAutoPiP = !e.target.checked;
        App.toast(e.target.checked ? '⧉ Auto Picture-in-Picture ON' : 'Auto PiP OFF');
      });
    }

    // When page hides while video is playing -> enter PiP
    document.addEventListener('visibilitychange', async () => {
      if (userDisabledAutoPiP) return;
      if (document.hidden && !video.paused && !document.pictureInPictureElement) {
        try {
          await video.requestPictureInPicture();
        } catch (e) {
          // PiP can fail (e.g., user gesture required) — that's OK, ignore
        }
      }
    });
  }
};
