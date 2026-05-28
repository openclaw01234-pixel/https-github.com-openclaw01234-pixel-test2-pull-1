/* =========================================
   Init: bootstrap everything when DOM is ready
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  App.init();
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
    if (confirm('Clear all local data (history, playlists, vault PIN)?')) {
      Storage.clearAll();
      App.toast('All local data cleared');
    }
  });

  // Welcome toast
  setTimeout(() => App.toast('🎉 Welcome to MX Player Pro — World\'s Best Video Player'), 600);
});
