const db = require('../db');

/**
 * Calculates percentile and average stats for a given date and user time.
 * @param {string} date - YYYY-MM-DD
 * @param {number} userTimeMs - Player's time in milliseconds
 */
function getStats(date, userTimeMs) {
  const stats = db.prepare(`
    SELECT 
      COUNT(*) as total,
      AVG(score_ms) as average
    FROM scores 
    WHERE puzzle_date = ?
  `).get(date);

  const total = stats.total || 0;
  const average = Math.round(stats.average || 0);

  if (total === 0) {
    return {
      totalPlayers: 0,
      averageTime: 0,
      percentile: 100 // First player is effectively 100th percentile
    };
  }

  const slower = db.prepare(`
    SELECT COUNT(*) as count 
    FROM scores 
    WHERE puzzle_date = ? AND score_ms > ?
  `).get(date, userTimeMs).count;

  // Smoothed percentile formula: (slower + 0.5) / total * 100
  // Higher is better (better than X% of players)
  const percentile = Math.min(99, Math.max(1, Math.round(((slower + 0.5) / total) * 100)));

  return {
    totalPlayers: total,
    averageTime: average,
    percentile: percentile
  };
}

module.exports = {
  getStats
};
