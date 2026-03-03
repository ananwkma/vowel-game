/**
 * shared.js — Lexicon Daily Word Games
 * Shared utilities used by all game pages (vowel, ladder, cipher, hunt).
 * Loaded as a plain <script> before each game's script block.
 *
 * Sections:
 *   1. SEEDED PRNG
 *   2. DATE SEED & DEBUG FLAG
 *   3. DAILY STATUS (localStorage completion tracking)
 */

/* ============================================================
   SECTION: SEEDED PRNG
   MurmurHash-inspired algorithm. Guarantees same seed produces
   identical sequence across browsers and reloads — required for
   daily puzzle consistency.
============================================================ */
function seededRandom(seedStr) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(31, h) + seedStr.charCodeAt(i) | 0;
  }
  let s = h >>> 0;
  return function() {
    s += 0x6D2B79F5;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/* ============================================================
   SECTION: DATE SEED & DEBUG FLAG
   DATE_SEED: today's date as YYYY-MM-DD, overridable via ?date=
   IS_DEBUG: true when ?debug param present in URL
   Both are computed once at load time from URLSearchParams.
   Usage: each game appends a game-specific suffix to DATE_SEED
   (e.g. DATE_SEED + '_vowel_v1') for namespace isolation.
============================================================ */
const DATE_SEED = (function() {
  const params = new URLSearchParams(location.search);
  const dateParam = params.get('date');
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    return dateParam;
  }
  return new Date().toLocaleDateString('en-CA');
})();

const IS_DEBUG = new URLSearchParams(location.search).has('debug');

/* ============================================================
   SECTION: DAILY STATUS
   Tracks which games the player has completed today.
   Hub (index.html) reads this to dim completed game cards.
   Each game calls DailyStatus.markCompleted('gameId') on win/give-up.
   Storage key: 'wordGames_dailyStatus' (shared across all games).
============================================================ */
const DailyStatus = {
  KEY: 'wordGames_dailyStatus',

  markCompleted(gameId, extraData = {}) {
    const today = new Date().toISOString().split('T')[0];
    let status = {};
    try {
      status = JSON.parse(localStorage.getItem(this.KEY) || '{}');
    } catch(e) {}
    status[gameId] = { completed: true, dateKey: today, timestamp: Date.now(), ...extraData };
    try {
      localStorage.setItem(this.KEY, JSON.stringify(status));
    } catch(e) {
      console.warn('[DailyStatus] Save error:', e);
    }
  },

  isCompleted(gameId) {
    try {
      const status = JSON.parse(localStorage.getItem(this.KEY) || '{}');
      const today = new Date().toISOString().split('T')[0];
      return status[gameId]?.dateKey === today && status[gameId]?.completed === true;
    } catch(e) {
      return false;
    }
  }
};
