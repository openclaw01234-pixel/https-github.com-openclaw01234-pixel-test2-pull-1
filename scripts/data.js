/* =========================================
   Data: Mock content for the app
   ========================================= */

const TRENDING = [
  { id: 't1', title: 'Aashram Season 4',  genre: 'Drama',     year: 2024, emoji: '🎭', tag: 'MX Original', progress: 0 },
  { id: 't2', title: 'Bhaukaal',          genre: 'Crime',     year: 2023, emoji: '🚔', tag: 'MX Original', progress: 0 },
  { id: 't3', title: 'Cosmic Voyage',     genre: 'Sci-Fi',    year: 2024, emoji: '🚀', tag: '4K HDR',      progress: 0 },
  { id: 't4', title: 'Mountain Echoes',   genre: 'Adventure', year: 2024, emoji: '🏔️', tag: 'New',         progress: 0 },
  { id: 't5', title: 'Midnight Diner',    genre: 'Drama',     year: 2023, emoji: '🍜', tag: 'Trending',    progress: 0 },
  { id: 't6', title: 'The Great Heist',   genre: 'Thriller',  year: 2024, emoji: '💼', tag: 'Hot',         progress: 0 },
];

const CONTINUE = [
  { id: 'c1', title: 'Big Buck Bunny',     genre: 'Animation', year: 2008, emoji: '🐰', tag: 'Resume',  progress: 35 },
  { id: 'c2', title: 'Elephants Dream',    genre: 'Animation', year: 2006, emoji: '🐘', tag: 'Resume',  progress: 62 },
  { id: 'c3', title: 'Tears of Steel',     genre: 'Sci-Fi',    year: 2012, emoji: '⚔️', tag: 'Resume',  progress: 18 },
  { id: 'c4', title: 'Sintel',             genre: 'Fantasy',   year: 2010, emoji: '🐉', tag: 'Resume',  progress: 78 },
];

const SEARCH_DATA = [
  { id: 's1',  title: 'Stranger Things',          year: 2024, platform: 'Netflix',  emoji: '🔮', genre: 'Sci-Fi Horror' },
  { id: 's2',  title: 'The Boys',                  year: 2024, platform: 'Prime',    emoji: '💥', genre: 'Action' },
  { id: 's3',  title: 'Aashram',                   year: 2024, platform: 'MX',       emoji: '🎭', genre: 'Drama' },
  { id: 's4',  title: 'Loki Season 2',             year: 2024, platform: 'Disney+',  emoji: '🐍', genre: 'Sci-Fi' },
  { id: 's5',  title: 'MrBeast Latest',            year: 2024, platform: 'YouTube',  emoji: '💰', genre: 'Entertainment' },
  { id: 's6',  title: 'Money Heist',               year: 2021, platform: 'Netflix',  emoji: '🎭', genre: 'Crime' },
  { id: 's7',  title: 'The Family Man',            year: 2023, platform: 'Prime',    emoji: '🕵️', genre: 'Thriller' },
  { id: 's8',  title: 'Bhaukaal',                  year: 2023, platform: 'MX',       emoji: '🚔', genre: 'Crime' },
  { id: 's9',  title: 'Wandavision',               year: 2021, platform: 'Disney+',  emoji: '🌟', genre: 'Marvel' },
  { id: 's10', title: 'Coding Tutorials',          year: 2024, platform: 'YouTube',  emoji: '💻', genre: 'Education' },
  { id: 's11', title: 'Squid Game',                year: 2021, platform: 'Netflix',  emoji: '🦑', genre: 'Thriller' },
  { id: 's12', title: 'The Marvelous Mrs. Maisel', year: 2023, platform: 'Prime',    emoji: '🎤', genre: 'Comedy' },
  { id: 's13', title: 'Aspirants',                 year: 2024, platform: 'MX',       emoji: '📚', genre: 'Drama' },
  { id: 's14', title: 'Soul',                      year: 2020, platform: 'Disney+',  emoji: '🎷', genre: 'Animation' },
  { id: 's15', title: 'Tech Reviews',              year: 2024, platform: 'YouTube',  emoji: '📱', genre: 'Tech' },
  { id: 's16', title: 'Dark',                      year: 2020, platform: 'Netflix',  emoji: '🌑', genre: 'Mystery' },
  { id: 's17', title: 'Fleabag',                   year: 2019, platform: 'Prime',    emoji: '🎬', genre: 'Comedy Drama' },
  { id: 's18', title: 'Mandalorian',               year: 2023, platform: 'Disney+',  emoji: '🚀', genre: 'Sci-Fi' },
];

const MOOD_RECS = {
  happy: ['🎉 The Marvelous Mrs. Maisel', '😄 Friends', '🎵 La La Land', '🎤 Stand-up Comedy specials'],
  sad: ['🍦 Inside Out', '🌸 Forrest Gump', '☕ Chef', '🐶 Marley & Me'],
  excited: ['🚀 Mission Impossible', '🦸 Spider-Man', '🏎️ Fast & Furious', '⚡ John Wick'],
  relaxed: ['🌊 Studio Ghibli films', '🍵 Midnight Diner', '🌳 Nature documentaries', '🎶 Lo-Fi music videos'],
  romantic: ['💕 The Notebook', '🌹 Pride & Prejudice', '💌 La La Land', '🌹 Veer-Zaara'],
  adventurous: ['🗺️ Indiana Jones', '🏔️ Into the Wild', '🌋 Lord of the Rings', '🏝️ Cast Away'],
  thrilled: ['👹 Stranger Things', '🔪 Hannibal', '🎭 Mindhunter', '😱 Hereditary'],
  nostalgic: ['📻 Stranger Things', '🎮 Wreck-It Ralph', '🚲 E.T.', '🎬 Back to the Future'],
};

const KARAOKE_LYRICS = [
  { time: 0,  text: '🎵 Welcome to MX Player Pro 🎵' },
  { time: 4,  text: 'AI powered, world class' },
  { time: 8,  text: 'Watch parties with all your friends' },
  { time: 12, text: 'Real-time subtitles, never end' },
  { time: 16, text: 'Eight K upscaling so clean' },
  { time: 20, text: 'Best player you have ever seen' },
  { time: 24, text: '🎶 La la la la la la 🎶' },
  { time: 28, text: 'Sing along, have some fun' },
];

const WORD_DICT = {
  'movie': 'चलचित्र (chal-chit-ra) — A motion picture, film',
  'subtitle': 'उपशीर्षक (up-sheer-shak) — Text version of dialogue',
  'video': 'वीडियो (veedio) — A recording of moving images',
  'player': 'खिलाड़ी / प्लेयर — Software that plays media',
  'hello': 'नमस्ते (namaste) — Greeting',
  'beautiful': 'सुंदर (sundar) — Aesthetically pleasing',
  'amazing': 'अद्भुत (adbhut) — Causing great surprise or wonder',
  'world': 'दुनिया (duniya) — The earth, all people',
  'love': 'प्यार (pyaar) — Strong feeling of affection',
  'best': 'सर्वश्रेष्ठ (sarvashreshth) — Of the highest quality',
};

const SAMPLE_VIDEOS = {
  bunny: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  elephant: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  forBigger: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  sintel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  tears: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
};
