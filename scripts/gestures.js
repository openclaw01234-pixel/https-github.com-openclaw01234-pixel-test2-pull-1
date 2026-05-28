/* =========================================
   Touch / mouse gesture controls on the video
   - Swipe left half: brightness  | swipe right half: volume
   - Double-tap left: -10s        | double-tap right: +10s
   ========================================= */

const Gestures = {
  init() {
    const wrap = document.getElementById('playerWrap');
    if (!wrap) return;
    let startX = 0, startY = 0, startVol = 0, startBright = 100;
    let isVertSwipe = false;
    let isLeft = false;
    let lastTap = 0;

    const showIndicator = (icon, percent) => {
      const ind = document.getElementById('gestureIndicator');
      document.getElementById('gestureIcon').textContent = icon;
      document.getElementById('gestureFill').style.width = Math.max(0, Math.min(100, percent)) + '%';
      ind.classList.add('visible');
      clearTimeout(this._tmr);
      this._tmr = setTimeout(() => ind.classList.remove('visible'), 800);
    };

    const onStart = (e) => {
      const touch = e.touches ? e.touches[0] : e;
      startX = touch.clientX;
      startY = touch.clientY;
      const rect = wrap.getBoundingClientRect();
      isLeft = (startX - rect.left) < rect.width / 2;
      startVol = Player.video.volume * 100;
      startBright = parseInt(document.getElementById('brightness').value);
      isVertSwipe = false;
    };

    const onMove = (e) => {
      const touch = e.touches ? e.touches[0] : e;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (!isVertSwipe && Math.abs(dy) > 20 && Math.abs(dy) > Math.abs(dx)) {
        isVertSwipe = true;
      }
      if (!isVertSwipe) return;

      const pct = -(dy / wrap.clientHeight) * 100;
      if (isLeft) {
        const newBright = Math.max(50, Math.min(200, startBright + pct));
        document.getElementById('brightness').value = newBright;
        Player.video.style.filter = `brightness(${newBright}%) contrast(${document.getElementById('contrast').value}%) saturate(${document.getElementById('saturation').value}%)`;
        showIndicator('☀️', (newBright - 50) / 1.5);
      } else {
        const newVol = Math.max(0, Math.min(100, startVol + pct));
        Player.video.volume = newVol / 100;
        Player.video.muted = false;
        document.getElementById('volume').value = newVol;
        Player.updateVolumeIcon();
        showIndicator('🔊', newVol);
      }
    };

    const onEnd = (e) => {
      const now = Date.now();
      if (!isVertSwipe && (now - lastTap) < 350) {
        // Double tap
        if (isLeft) Player.seek(-10);
        else Player.seek(10);
        lastTap = 0;
      } else {
        lastTap = now;
      }
    };

    wrap.addEventListener('touchstart', onStart, { passive: true });
    wrap.addEventListener('touchmove', onMove, { passive: true });
    wrap.addEventListener('touchend', onEnd);
  }
};
