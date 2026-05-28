/* =========================================
   LocalStorage helpers
   ========================================= */

const Storage = {
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem('mxpro_' + key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem('mxpro_' + key, JSON.stringify(value)); } catch (e) {}
  },
  remove(key) {
    try { localStorage.removeItem('mxpro_' + key); } catch (e) {}
  },
  clearAll() {
    Object.keys(localStorage)
      .filter(k => k.startsWith('mxpro_'))
      .forEach(k => localStorage.removeItem(k));
  }
};
