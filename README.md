# MX Player Pro - World's Best Video Player

A next-generation video player and entertainment platform built as a single-page web application + PWA. Inspired by MX Player, supercharged with AI-powered features, social viewing, and smart playback.

## 📱 Want it as an Android APK?

See [APK_BUILD_GUIDE.md](./APK_BUILD_GUIDE.md) for 4 ways to get an APK:
- **Easiest:** Deploy + PWABuilder.com → real signed APK in 5 minutes
- **Instant:** Open in Chrome on Android → tap "Install" → no APK needed
- **Pro:** Capacitor + Android Studio for full native build

## Live Demo

Open `index.html` in any modern browser (Chrome / Edge recommended for full speech recognition support).

## Features

### Core Player (fully functional)
- Custom HTML5 video player with smooth controls
- Play / pause, seek, ±10s skip
- Volume, mute, brightness, contrast, saturation
- Playback speed: 0.5x to 3x
- Picture-in-Picture mode
- Fullscreen mode
- Screenshot capture (downloads PNG)
- A-B Loop (set custom loop points)
- Volume Booster up to 250% (Web Audio API)
- Resume from last position (auto-saved per video)
- Keyboard shortcuts: Space, Arrow keys, F, M, S, P, A, B
- Touch gestures: swipe left half = brightness, swipe right half = volume, double-tap to seek

### AI-Powered Features
- AI Live Subtitles (Web Speech API + simulated fallback)
- AI Voice Dubbing (UI demo, language selection)
- 8K AI Upscaling visual filter
- Frame Interpolation (60fps simulated)
- Smart Scene Skip (auto-skip intros, recaps)
- AI Movie Summary with key moments
- Mood-based Recommendations (8 moods)

### Social
- Watch Party with mock multi-user sync
- Live chat with simulated bot participants
- 8 floating reactions (animated)
- Voice / Camera permission requests (real WebRTC)
- Room code system
- Sync button

### Universal Search
- One search across MX, Netflix, Prime, YouTube, Disney+
- Platform filters
- 18+ mock titles

### Special Modes
- Karaoke Mode with synced lyrics overlay
- Learn Mode: click any word in subtitles for translation
- VR Split-view mode
- Spatial Audio toggle

### Personal
- Private Vault (PIN-protected, default 1234)
- In-browser encrypted video storage
- My Library (history, playlists, downloads)
- Sleep Timer (5m / 15m / 30m / 1h)
- Three themes: Dark / Light / OLED Black
- Parental controls

## Tech Stack

- Pure vanilla HTML / CSS / JavaScript (no build step)
- Browser APIs: HTML5 Video, Web Speech API, Web Audio API, MediaDevices, Picture-in-Picture, Fullscreen
- LocalStorage for persistence

## File Structure

```
.
├── index.html                # Main app shell with all views
├── styles/
│   ├── main.css              # Layout, sidebar, hero, feature grid
│   ├── player.css            # Player view + controls
│   └── components.css        # Search, watch party, vault, settings, modal
└── scripts/
    ├── data.js               # Mock content (trending, search results, lyrics)
    ├── storage.js            # LocalStorage helpers
    ├── app.js                # Navigation, modals, themes, toast
    ├── player.js             # Core video player
    ├── ai-features.js        # AI subtitles, dubbing, scene skip, summary
    ├── gestures.js           # Touch gestures
    ├── watchparty.js         # Watch party UI + chat + reactions
    ├── search.js             # Universal search
    ├── library.js            # Library tabs
    ├── vault.js              # PIN-protected vault
    └── init.js               # Bootstrap on DOM ready
```

## How to Run

1. Clone or download this repo
2. Open `index.html` in your browser
3. That's it — no install, no build, no server needed

For full speech-recognition functionality, use Chrome or Edge and serve via a local HTTP server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Notes

This is a **prototype / proof-of-concept**. Several "AI" features are simulated locally to demonstrate the UX — in a production build they would connect to real services (Whisper for STT, ElevenLabs for dubbing, ESRGAN for upscaling, etc.).
