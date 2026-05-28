/* =========================================
   Watch Party: chat, reactions, mock sync
   ========================================= */

const WatchParty = {
  bots: ['Aarav', 'Priya', 'Rohan'],
  botMessages: [
    'Bro this is insane 🔥',
    'Wait what just happened 😮',
    'Best scene ever ❤️',
    'Pause! Pause! Snacks lekar aata hu',
    'OMG I knew it!',
    'This soundtrack is goosebumps',
    'Itni emotional kyu hai story 😭',
    'Yeh director ek genius hai',
    'Watch karo ek baar phir se',
    'Subtitles on kar do please',
  ],

  init() {
    this.bindReactions();
    this.bindChat();
    this.bindParty();
    this.startBotChat();
  },

  bindReactions() {
    document.querySelectorAll('.emoji-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.spawnReaction(btn.dataset.emoji, 'partyReactions');
      });
    });

    // Also enable reactions in main player
    document.getElementById('playerWrap')?.addEventListener('dblclick', (e) => {
      // handled by gestures.js for double-tap mobile; keep desktop dblclick to toggle play
    });
  },

  spawnReaction(emoji, layerId = 'partyReactions') {
    const layer = document.getElementById(layerId);
    if (!layer) return;
    const el = document.createElement('div');
    el.className = 'flying-reaction';
    el.textContent = emoji;
    const left = 10 + Math.random() * 80;
    el.style.left = left + '%';
    el.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
    layer.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  },

  bindChat() {
    const send = () => {
      const input = document.getElementById('chatInput');
      const txt = input.value.trim();
      if (!txt) return;
      const userName = (typeof Auth !== 'undefined' && Auth.user && !Auth.user.isGuest) ? Auth.user.name : 'You';
      this.addMessage(userName, txt);
      input.value = '';

      // Bot reply after delay
      setTimeout(() => {
        const bot = this.bots[Math.floor(Math.random() * this.bots.length)];
        const replies = [
          'Haan yaar, bilkul same!',
          'Lol 😂',
          'Acha point hai',
          'Wait dekhne do scene',
          '🔥🔥🔥',
        ];
        this.addMessage(bot, replies[Math.floor(Math.random() * replies.length)]);
      }, 1200 + Math.random() * 2000);
    };
    document.getElementById('sendChatBtn')?.addEventListener('click', send);
    document.getElementById('chatInput')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') send();
    });
  },

  addMessage(user, text) {
    const log = document.getElementById('chatLog');
    if (!log) return;
    const div = document.createElement('div');
    div.className = 'chat-msg';
    div.innerHTML = `<b>${user}:</b> ${text}`;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  },

  startBotChat() {
    setInterval(() => {
      // Only run when watch party view active AND user logged in
      if (App.currentView !== 'watchparty') return;
      if (typeof Auth !== 'undefined' && !Auth.isLoggedIn()) return;
      const bot = this.bots[Math.floor(Math.random() * this.bots.length)];
      const msg = this.botMessages[Math.floor(Math.random() * this.botMessages.length)];
      this.addMessage(bot, msg);

      // Random reaction
      if (Math.random() > 0.5) {
        const emojis = ['❤️','😂','🔥','😮','👏'];
        this.spawnReaction(emojis[Math.floor(Math.random() * emojis.length)]);
      }
    }, 8000);
  },

  bindParty() {
    document.getElementById('copyRoomBtn')?.addEventListener('click', () => {
      const code = document.getElementById('roomCode').textContent;
      navigator.clipboard?.writeText(code);
      App.toast('Room code copied: ' + code);
    });

    document.getElementById('syncBtn')?.addEventListener('click', () => {
      App.toast('⟳ Synced with all participants');
      this.spawnReaction('⏱️');
    });

    let micOn = false, camOn = false;
    document.getElementById('micBtn')?.addEventListener('click', async (e) => {
      micOn = !micOn;
      e.target.textContent = micOn ? '🎤 Voice OFF' : '🎤 Voice ON';
      if (micOn) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          App.toast('🎤 Microphone enabled');
        } catch (err) {
          App.toast('Mic permission denied');
          micOn = false;
          e.target.textContent = '🎤 Voice ON';
        }
      } else {
        App.toast('Voice off');
      }
    });

    document.getElementById('camBtn')?.addEventListener('click', async (e) => {
      camOn = !camOn;
      e.target.textContent = camOn ? '📹 Cam OFF' : '📹 Cam ON';
      if (camOn) {
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
          App.toast('📹 Camera enabled');
        } catch (err) {
          App.toast('Camera permission denied');
          camOn = false;
          e.target.textContent = '📹 Cam ON';
        }
      } else {
        App.toast('Cam off');
      }
    });
  }
};
