/* =========================================
   PWA: service worker registration + install prompt
   ========================================= */

(function () {
  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('[PWA] SW registered:', reg.scope))
        .catch(err => console.warn('[PWA] SW registration failed:', err));
    });
  }

  // Install prompt
  let deferredPrompt = null;
  let installBtn = null;

  function createInstallButton() {
    if (installBtn) return installBtn;
    installBtn = document.createElement('button');
    installBtn.id = 'pwaInstallBtn';
    installBtn.className = 'btn btn-primary';
    installBtn.innerHTML = '📲 Install App';
    installBtn.style.cssText = `
      position: fixed;
      bottom: 20px; right: 20px;
      z-index: 200;
      box-shadow: 0 10px 30px rgba(255,51,102,0.4);
      animation: pulseGlow 2s infinite;
    `;
    document.body.appendChild(installBtn);

    // Add pulse keyframes once
    if (!document.getElementById('pwaInstallStyles')) {
      const style = document.createElement('style');
      style.id = 'pwaInstallStyles';
      style.textContent = `
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 10px 30px rgba(255,51,102,0.4); }
          50% { box-shadow: 0 10px 40px rgba(255,51,102,0.8); }
        }
      `;
      document.head.appendChild(style);
    }

    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] Install:', outcome);
      if (outcome === 'accepted') {
        if (window.App) App.toast('🎉 Installing MX Player Pro...');
        installBtn.remove();
        installBtn = null;
      }
      deferredPrompt = null;
    });

    return installBtn;
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(() => createInstallButton(), 3000); // show after 3s
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] Installed!');
    if (window.App) App.toast('🎉 MX Player Pro installed!');
    if (installBtn) installBtn.remove();
  });

  // Handle URL view= param (from manifest shortcuts)
  window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(location.search);
    const view = params.get('view');
    if (view && window.App) {
      setTimeout(() => App.switchView(view), 300);
    }
  });
})();
