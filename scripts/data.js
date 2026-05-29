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
  // ===== Hindi / Bollywood Movies =====
  { id: 'b1',  title: 'Radhe Shyam',                year: 2022, platform: 'Prime',    emoji: '💕', genre: 'Romance, Hindi' },
  { id: 'b2',  title: 'Radhe: Your Most Wanted Bhai', year: 2021, platform: 'Prime',  emoji: '🤠', genre: 'Action, Hindi' },
  { id: 'b3',  title: 'Radha Krishna',              year: 2024, platform: 'YouTube',  emoji: '🪈', genre: 'Devotional, Hindi' },
  { id: 'b4',  title: 'Radha Kaise Na Jale',        year: 2001, platform: 'YouTube',  emoji: '💃', genre: 'Song, Lagaan' },
  { id: 'b5',  title: 'Radha on the Dance Floor',   year: 2012, platform: 'YouTube',  emoji: '💃', genre: 'Song, SOTY' },
  { id: 'b6',  title: 'Krishna Aur Kans',           year: 2012, platform: 'Prime',    emoji: '🪈', genre: 'Animation, Hindi' },
  { id: 'b7',  title: 'Ramayan',                    year: 2024, platform: 'MX',       emoji: '🏹', genre: 'Mythology, Hindi' },
  { id: 'b8',  title: 'Mahabharat',                 year: 2024, platform: 'MX',       emoji: '⚔️', genre: 'Mythology, Hindi' },
  { id: 'b9',  title: '3 Idiots',                   year: 2009, platform: 'Netflix',  emoji: '🎓', genre: 'Comedy, Hindi' },
  { id: 'b10', title: 'Dangal',                     year: 2016, platform: 'Netflix',  emoji: '🤼', genre: 'Sports Drama, Hindi' },
  { id: 'b11', title: 'Bahubali: The Beginning',    year: 2015, platform: 'Netflix',  emoji: '⚔️', genre: 'Action, Telugu/Hindi' },
  { id: 'b12', title: 'Bahubali 2: The Conclusion', year: 2017, platform: 'Netflix',  emoji: '👑', genre: 'Action, Telugu/Hindi' },
  { id: 'b13', title: 'KGF Chapter 1',              year: 2018, platform: 'Prime',    emoji: '⛏️', genre: 'Action, Kannada/Hindi' },
  { id: 'b14', title: 'KGF Chapter 2',              year: 2022, platform: 'Prime',    emoji: '⚒️', genre: 'Action, Kannada/Hindi' },
  { id: 'b15', title: 'Pushpa: The Rise',           year: 2021, platform: 'Netflix',  emoji: '🌹', genre: 'Action, Telugu/Hindi' },
  { id: 'b16', title: 'RRR',                        year: 2022, platform: 'Netflix',  emoji: '🔥', genre: 'Action, Telugu/Hindi' },
  { id: 'b17', title: 'Pathaan',                    year: 2023, platform: 'Prime',    emoji: '🕴️', genre: 'Action, Hindi' },
  { id: 'b18', title: 'Jawan',                      year: 2023, platform: 'Netflix',  emoji: '💪', genre: 'Action, Hindi' },
  { id: 'b19', title: 'Animal',                     year: 2023, platform: 'Netflix',  emoji: '🐺', genre: 'Action, Hindi' },
  { id: 'b20', title: 'Shershaah',                  year: 2021, platform: 'Prime',    emoji: '🎖️', genre: 'War Drama, Hindi' },
  { id: 'b21', title: 'Kabir Singh',                year: 2019, platform: 'Netflix',  emoji: '💔', genre: 'Romance, Hindi' },
  { id: 'b22', title: 'Sanju',                      year: 2018, platform: 'Netflix',  emoji: '🎬', genre: 'Biopic, Hindi' },
  { id: 'b23', title: 'Drishyam 2',                 year: 2022, platform: 'Prime',    emoji: '🔍', genre: 'Thriller, Hindi' },
  { id: 'b24', title: 'Andhadhun',                  year: 2018, platform: 'Netflix',  emoji: '🎹', genre: 'Thriller, Hindi' },
  { id: 'b25', title: 'Tumbbad',                    year: 2018, platform: 'Prime',    emoji: '🏚️', genre: 'Horror, Hindi' },

  // ===== Hindi Web Series =====
  { id: 'b26', title: 'Mirzapur',                   year: 2024, platform: 'Prime',    emoji: '🔫', genre: 'Crime, Hindi' },
  { id: 'b27', title: 'Sacred Games',               year: 2019, platform: 'Netflix',  emoji: '🃏', genre: 'Crime, Hindi' },
  { id: 'b28', title: 'Panchayat',                  year: 2024, platform: 'Prime',    emoji: '🏘️', genre: 'Comedy, Hindi' },
  { id: 'b29', title: 'Scam 1992',                  year: 2020, platform: 'MX',       emoji: '📈', genre: 'Drama, Hindi' },
  { id: 'b30', title: 'Aspirants',                  year: 2024, platform: 'MX',       emoji: '📚', genre: 'Drama, Hindi' },
  { id: 'b31', title: 'Kota Factory',               year: 2024, platform: 'Netflix',  emoji: '🎓', genre: 'Drama, Hindi' },
  { id: 'b32', title: 'TVF Pitchers',               year: 2022, platform: 'Prime',    emoji: '🚀', genre: 'Drama, Hindi' },
  { id: 'b33', title: 'Special Ops',                year: 2023, platform: 'Hotstar',  emoji: '🕵️', genre: 'Thriller, Hindi' },
  { id: 'b34', title: 'Asur',                       year: 2023, platform: 'JioCinema',emoji: '🩸', genre: 'Thriller, Hindi' },
  { id: 'b35', title: 'Aashram',                    year: 2024, platform: 'MX',       emoji: '🎭', genre: 'Drama, Hindi' },
  { id: 'b36', title: 'Bhaukaal',                   year: 2023, platform: 'MX',       emoji: '🚔', genre: 'Crime, Hindi' },
  { id: 'b37', title: 'The Family Man',             year: 2023, platform: 'Prime',    emoji: '🕵️', genre: 'Thriller, Hindi' },
  { id: 'b38', title: 'Farzi',                      year: 2023, platform: 'Prime',    emoji: '💵', genre: 'Crime, Hindi' },

  // ===== South Indian =====
  { id: 'b39', title: 'Vikram',                     year: 2022, platform: 'Disney+',  emoji: '🔫', genre: 'Action, Tamil' },
  { id: 'b40', title: 'Master',                     year: 2021, platform: 'Prime',    emoji: '🎓', genre: 'Action, Tamil' },
  { id: 'b41', title: 'Jailer',                     year: 2023, platform: 'Prime',    emoji: '🔐', genre: 'Action, Tamil' },
  { id: 'b42', title: 'Salaar',                     year: 2023, platform: 'Netflix',  emoji: '⚔️', genre: 'Action, Telugu' },
  { id: 'b43', title: 'Hanu-Man',                   year: 2024, platform: 'Disney+',  emoji: '🐒', genre: 'Mythology, Telugu' },
  { id: 'b44', title: 'Manjummel Boys',             year: 2024, platform: 'Hotstar',  emoji: '🏔️', genre: 'Adventure, Malayalam' },

  // ===== Songs (YouTube) =====
  { id: 'y1',  title: 'Radha (song from Jab Harry Met Sejal)', year: 2017, platform: 'YouTube', emoji: '🎵', genre: 'Hindi Song' },
  { id: 'y2',  title: 'Radha Teri Chunari',         year: 2014, platform: 'YouTube',  emoji: '🎶', genre: 'Devotional Song' },
  { id: 'y3',  title: 'Krishna Bhajan Collection',  year: 2024, platform: 'YouTube',  emoji: '🪈', genre: 'Devotional' },
  { id: 'y4',  title: 'Hanuman Chalisa',            year: 2024, platform: 'YouTube',  emoji: '🙏', genre: 'Devotional' },
  { id: 'y5',  title: 'Latest Bollywood Songs',     year: 2024, platform: 'YouTube',  emoji: '🎤', genre: 'Music' },

  // ===== International =====
  { id: 's1',  title: 'Stranger Things',            year: 2024, platform: 'Netflix',  emoji: '🔮', genre: 'Sci-Fi Horror' },
  { id: 's2',  title: 'The Boys',                   year: 2024, platform: 'Prime',    emoji: '💥', genre: 'Action' },
  { id: 's4',  title: 'Loki Season 2',              year: 2024, platform: 'Disney+',  emoji: '🐍', genre: 'Sci-Fi' },
  { id: 's5',  title: 'MrBeast Latest',             year: 2024, platform: 'YouTube',  emoji: '💰', genre: 'Entertainment' },
  { id: 's6',  title: 'Money Heist',                year: 2021, platform: 'Netflix',  emoji: '🎭', genre: 'Crime' },
  { id: 's9',  title: 'Wandavision',                year: 2021, platform: 'Disney+',  emoji: '🌟', genre: 'Marvel' },
  { id: 's10', title: 'Coding Tutorials',           year: 2024, platform: 'YouTube',  emoji: '💻', genre: 'Education' },
  { id: 's11', title: 'Squid Game',                 year: 2021, platform: 'Netflix',  emoji: '🦑', genre: 'Thriller' },
  { id: 's14', title: 'Soul',                       year: 2020, platform: 'Disney+',  emoji: '🎷', genre: 'Animation' },
  { id: 's15', title: 'Tech Reviews',               year: 2024, platform: 'YouTube',  emoji: '📱', genre: 'Tech' },
  { id: 's16', title: 'Dark',                       year: 2020, platform: 'Netflix',  emoji: '🌑', genre: 'Mystery' },
  { id: 's18', title: 'Mandalorian',                year: 2023, platform: 'Disney+',  emoji: '🚀', genre: 'Sci-Fi' },
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
