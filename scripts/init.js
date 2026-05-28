/* =========================================
   Init: bootstrap everything when DOM is ready
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  App.init();
  Auth.init();
  Player.init();
  AIFeatures.init();
  Gestures.init();
  WatchParty.init();
  Search.init();
  Library.init();
  Vault.init();

  // Render rows
  renderContentRow('trendingRow', TRENDING);
  renderContentRow('continueRow', CONTINUE);

  // Feature card actions for stuff that doesn't navigate
  document.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', () => {
      const action = el.dataset.action;
      App.switchView('player');
      // Trigger the appropriate feature toggle after a short delay (so player is visible)
      setTimeout(() => {
        const map = {
          'open-ai':  'aiSubsToggle',
          'open-dub': 'dubToggle',
          'upscale':  'upscaleToggle',
          'skip':     'sceneSkipToggle',
          'karaoke':  'karaokeToggle',
          'learn':    'learnToggle',
          'vr':       'vrToggle',
          'mood':     null,
          'sleep':    null,
        };
        const togId = map[action];
        if (togId) {
          const tog = document.getElementById(togId);
          if (tog) {
            tog.checked = true;
            tog.dispatchEvent(new Event('change'));
          }
        } else if (action === 'mood') {
          App.openModal('moodModal');
        } else if (action === 'sleep') {
          App.toast('Use the sleep timer chips on the right →');
        }
      }, 200);
    });
  });

  // Settings: clear data
  document.getElementById('clearDataBtn')?.addEventListener('click', () => {
    if (confirm('Clear all local data (history, playlists, vault PIN, accounts)?')) {
      Storage.clearAll();
      App.toast('All local data cleared');
      Auth.user = null;
      Auth.updateUI();
      App.switchView('auth');
    }
  });

  // Lock Watch Party for guests/unauthenticated
  const updateLocks = () => {
    const watchpartyShell = document.getElementById('partyShell');
    const watchpartyLock = document.getElementById('watchpartyLock');
    if (Auth.isLoggedIn()) {
      if (watchpartyLock) watchpartyLock.hidden = true;
      if (watchpartyShell) watchpartyShell.style.display = '';
    } else {
      if (watchpartyLock) watchpartyLock.hidden = false;
      if (watchpartyShell) watchpartyShell.style.display = 'none';
    }
    // Update account info card in settings
    updateAccountInfo();
  };

  const updateAccountInfo = () => {
    const el = document.getElementById('accountInfo');
    if (!el) return;
    const u = Auth.user;
    if (!u) {
      el.innerHTML = `<em>Not signed in.</em>`;
      const btn = document.getElementById('logoutBtn');
      if (btn) { btn.textContent = 'Sign In'; btn.onclick = () => App.switchView('auth'); }
    } else {
      el.innerHTML = `
        <div><strong>${u.name}</strong></div>
        ${u.email ? `<div>${u.email}</div>` : ''}
        <div style="opacity:.7;">Signed in via: <strong>${u.provider === 'google' ? 'Google' : (u.provider === 'guest' ? 'Guest' : 'Email')}</strong></div>
        ${u.isDemo ? '<div style="opacity:.7;font-size:11px;">(Demo Google account)</div>' : ''}
      `;
      const btn = document.getElementById('logoutBtn');
      if (btn) { btn.textContent = 'Sign Out'; btn.onclick = () => Auth.logout(); }
    }
  };

  Auth.onChange(updateLocks);
  updateLocks();

  // First-time visit: show auth view
  if (!Auth.user) {
    setTimeout(() => {
      // Only redirect if user landed on home (not on a specific view via URL)
      const params = new URLSearchParams(location.search);
      if (!params.get('view')) {
        App.switchView('auth');
      }
    }, 100);
  }

  // Welcome toast
  setTimeout(() => {
    if (Auth.isLoggedIn()) {
      App.toast(`🎉 Welcome back, ${Auth.user.name}!`);
    } else if (Auth.isGuest()) {
      App.toast('🎉 Welcome to MX Player Pro (Guest mode)');
    } else {
      App.toast('🎉 Welcome to MX Player Pro');
    }
  }, 800);

  // Re-init Google when GIS library loads (it loads async)
  let googleCheckCount = 0;
  const googleCheck = setInterval(() => {
    googleCheckCount++;
    if (window.google?.accounts?.id) {
      Auth.initGoogle();
      clearInterval(googleCheck);
    }
    if (googleCheckCount > 30) clearInterval(googleCheck); // give up after 30s
  }, 1000);
});
