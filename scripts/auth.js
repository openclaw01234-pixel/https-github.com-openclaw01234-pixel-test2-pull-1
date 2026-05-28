/* =========================================
   Authentication: Email/Password, Google Sign-In, Guest Mode
   ========================================= */

const Auth = {
  user: null,         // current user: { id, name, email, avatar, provider, isGuest }
  listeners: [],

  init() {
    // Restore session
    this.user = Storage.get('currentUser', null);
    this.bindUI();
    this.initGoogle();
    this.updateUI();
  },

  // ============== STATE ==============
  isLoggedIn() {
    return !!this.user && !this.user.isGuest;
  },

  isGuest() {
    return !!this.user && this.user.isGuest;
  },

  hasAccount() {
    return !!this.user;
  },

  onChange(cb) {
    this.listeners.push(cb);
  },

  notify() {
    this.listeners.forEach(cb => { try { cb(this.user); } catch (e) {} });
  },

  // ============== EMAIL / PASSWORD ==============
  async signupEmail(name, email, password) {
    const users = Storage.get('users', {});
    if (users[email]) {
      throw new Error('Account with this email already exists. Please login instead.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    if (!this.validEmail(email)) {
      throw new Error('Please enter a valid email');
    }

    const hashed = await this.hash(password);
    const user = {
      id: 'u_' + Date.now() + Math.random().toString(36).slice(2, 8),
      name: name || email.split('@')[0],
      email,
      passwordHash: hashed,
      provider: 'email',
      avatar: this.initials(name || email),
      avatarColor: this.colorFor(email),
      createdAt: Date.now()
    };
    users[email] = user;
    Storage.set('users', users);

    this.setCurrentUser(user);
    return user;
  },

  async loginEmail(email, password) {
    const users = Storage.get('users', {});
    const user = users[email];
    if (!user) throw new Error('No account found with this email. Please sign up first.');
    if (user.provider !== 'email') {
      throw new Error(`This email is registered with ${user.provider}. Please use that login method.`);
    }
    const hashed = await this.hash(password);
    if (hashed !== user.passwordHash) throw new Error('Wrong password');

    this.setCurrentUser(user);
    return user;
  },

  // ============== GOOGLE SIGN-IN ==============
  initGoogle() {
    // If a Google Client ID is configured and the GIS library has loaded, set it up.
    if (!APP_CONFIG.GOOGLE_CLIENT_ID || !window.google?.accounts?.id) {
      // Will retry when library loads
      return;
    }
    try {
      google.accounts.id.initialize({
        client_id: APP_CONFIG.GOOGLE_CLIENT_ID,
        callback: (response) => this.handleGoogleResponse(response),
        ux_mode: 'popup',
        auto_select: false
      });
    } catch (e) {
      console.warn('Google init failed:', e);
    }
  },

  signInWithGoogle() {
    // Real Google flow if configured
    if (APP_CONFIG.GOOGLE_CLIENT_ID && window.google?.accounts?.id) {
      try {
        // Render a hidden button trigger or use prompt
        google.accounts.id.prompt();
        // Also render the button on its container so user has explicit option
        const slot = document.getElementById('googleBtnSlot');
        if (slot) {
          slot.innerHTML = '';
          google.accounts.id.renderButton(slot, {
            theme: 'filled_blue', size: 'large', text: 'continue_with', shape: 'pill', width: 280
          });
        }
        return;
      } catch (e) {
        console.warn('Google prompt failed:', e);
      }
    }

    // Fallback: demo mode — simulate Google sign-in
    if (APP_CONFIG.DEMO_MODE) {
      this.demoGoogleSignIn();
    } else {
      App.toast('⚠️ Google Sign-In not configured. See scripts/config.js');
    }
  },

  handleGoogleResponse(response) {
    try {
      // Decode JWT (just the payload — no verification on client)
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      const user = {
        id: 'g_' + payload.sub,
        name: payload.name,
        email: payload.email,
        avatarUrl: payload.picture,
        avatar: this.initials(payload.name),
        avatarColor: this.colorFor(payload.email),
        provider: 'google',
        verified: payload.email_verified,
        createdAt: Date.now()
      };
      const users = Storage.get('users', {});
      users[payload.email] = user;
      Storage.set('users', users);
      this.setCurrentUser(user);
      App.toast(`Welcome, ${user.name}! 🎉`);
      App.switchView('home');
    } catch (e) {
      App.toast('Google sign-in failed: ' + e.message);
    }
  },

  demoGoogleSignIn() {
    // Show a simulated Google account picker dialog
    const modal = document.getElementById('googleDemoModal');
    if (modal) modal.hidden = false;
  },

  selectDemoGoogleAccount(account) {
    const user = {
      id: 'g_demo_' + account.email,
      name: account.name,
      email: account.email,
      avatarUrl: account.avatarUrl,
      avatar: this.initials(account.name),
      avatarColor: this.colorFor(account.email),
      provider: 'google',
      verified: true,
      isDemo: true,
      createdAt: Date.now()
    };
    const users = Storage.get('users', {});
    users[user.email] = user;
    Storage.set('users', users);
    this.setCurrentUser(user);
    document.getElementById('googleDemoModal').hidden = true;
    App.toast(`Welcome, ${user.name}! 🎉`);
    App.switchView('home');
  },

  // ============== GUEST ==============
  signInAsGuest() {
    const user = {
      id: 'guest_' + Date.now(),
      name: 'Guest User',
      email: null,
      avatar: 'G',
      avatarColor: '#70707f',
      provider: 'guest',
      isGuest: true,
      createdAt: Date.now()
    };
    this.setCurrentUser(user);
    App.toast('Continuing as guest. Some features are locked.');
    App.switchView('home');
  },

  // ============== LOGOUT ==============
  logout() {
    if (window.google?.accounts?.id) {
      try { google.accounts.id.disableAutoSelect(); } catch (e) {}
    }
    this.user = null;
    Storage.remove('currentUser');
    this.notify();
    this.updateUI();
    App.toast('Logged out');
    App.switchView('auth');
  },

  // ============== HELPERS ==============
  setCurrentUser(user) {
    this.user = user;
    // Don't store password hash in current user session pointer
    const safe = { ...user };
    delete safe.passwordHash;
    Storage.set('currentUser', safe);
    this.notify();
    this.updateUI();
  },

  async hash(text) {
    // SHA-256 client-side. Production should use server-side bcrypt.
    const enc = new TextEncoder().encode(text + '_mxprosalt_v1');
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0')).join('');
  },

  validEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  },

  initials(name) {
    if (!name) return 'U';
    return name.trim().split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase();
  },

  colorFor(seed) {
    const palettes = [
      'linear-gradient(135deg, #ff3366, #ff6b3d)',
      'linear-gradient(135deg, #06b6d4, #3b82f6)',
      'linear-gradient(135deg, #ec4899, #8b5cf6)',
      'linear-gradient(135deg, #10b981, #06b6d4)',
      'linear-gradient(135deg, #f59e0b, #ef4444)',
      'linear-gradient(135deg, #8b5cf6, #ec4899)',
      'linear-gradient(135deg, #00d9ff, #7c3aed)',
    ];
    let h = 0;
    for (let i = 0; i < (seed || '').length; i++) h = (h << 5) - h + seed.charCodeAt(i);
    return palettes[Math.abs(h) % palettes.length];
  },

  requireLogin(featureName) {
    if (this.isLoggedIn()) return true;
    App.toast(`🔒 Please sign in to use ${featureName}`);
    App.switchView('auth');
    return false;
  },

  // ============== UI ==============
  updateUI() {
    // Sidebar profile
    const avatar = document.querySelector('.sidebar .profile-card .avatar');
    const name = document.querySelector('.sidebar .profile-card .profile-name');
    const status = document.querySelector('.sidebar .profile-card .profile-status');
    const profileCard = document.querySelector('.sidebar .profile-card');

    if (this.user) {
      if (avatar) {
        if (this.user.avatarUrl) {
          avatar.style.background = `url('${this.user.avatarUrl}') center/cover`;
          avatar.textContent = '';
        } else {
          avatar.style.background = this.user.avatarColor;
          avatar.textContent = this.user.avatar;
        }
      }
      if (name) name.textContent = this.user.name;
      if (status) {
        if (this.user.isGuest) status.textContent = 'Guest • Sign in to unlock';
        else if (this.user.provider === 'google') status.textContent = '✓ Google Account';
        else status.textContent = '✓ ' + this.user.email;
        status.style.color = this.user.isGuest ? 'var(--warning)' : 'var(--accent)';
      }
      if (profileCard) profileCard.style.cursor = 'pointer';
    } else {
      if (avatar) {
        avatar.style.background = 'var(--grad-accent)';
        avatar.textContent = '?';
      }
      if (name) name.textContent = 'Not signed in';
      if (status) { status.textContent = 'Click to sign in'; status.style.color = 'var(--text-muted)'; }
      if (profileCard) profileCard.style.cursor = 'pointer';
    }
  },

  bindUI() {
    // Tab switch in auth view
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('form-' + tab.dataset.auth).classList.add('active');
      });
    });

    // Login form
    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const err = document.getElementById('loginError');
      err.textContent = '';
      try {
        await this.loginEmail(email, password);
        App.toast(`Welcome back, ${this.user.name}! 🎉`);
        App.switchView('home');
      } catch (e) {
        err.textContent = e.message;
      }
    });

    // Signup form
    document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;
      const password2 = document.getElementById('signupPassword2').value;
      const err = document.getElementById('signupError');
      err.textContent = '';
      try {
        if (password !== password2) throw new Error('Passwords do not match');
        await this.signupEmail(name, email, password);
        App.toast(`Account created! Welcome, ${this.user.name} 🎉`);
        App.switchView('home');
      } catch (e) {
        err.textContent = e.message;
      }
    });

    // Google Sign-In buttons (multiple — login & signup tabs)
    document.querySelectorAll('.btn-google').forEach(btn => {
      btn.addEventListener('click', () => this.signInWithGoogle());
    });

    // Guest button
    document.querySelectorAll('.btn-guest').forEach(btn => {
      btn.addEventListener('click', () => this.signInAsGuest());
    });

    // Profile click → go to settings/auth
    document.querySelector('.sidebar .profile-card')?.addEventListener('click', () => {
      if (this.user) App.switchView('settings');
      else App.switchView('auth');
    });

    // Logout button (in settings)
    document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());

    // Demo Google account picker
    document.querySelectorAll('.demo-google-account').forEach(el => {
      el.addEventListener('click', () => {
        const account = {
          name: el.dataset.name,
          email: el.dataset.email,
          avatarUrl: el.dataset.avatar
        };
        this.selectDemoGoogleAccount(account);
      });
    });

    document.getElementById('closeGoogleDemoBtn')?.addEventListener('click', () => {
      document.getElementById('googleDemoModal').hidden = true;
    });

    // Toggle password visibility
    document.querySelectorAll('.password-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        if (input.type === 'password') {
          input.type = 'text'; btn.textContent = '🙈';
        } else {
          input.type = 'password'; btn.textContent = '👁️';
        }
      });
    });
  }
};
