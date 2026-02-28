const express = require('express');
const router = express.Router();
const db = require('../db');
const { getStats } = require('../services/stats');

// Submit a score
router.post('/scores', (req, res) => {
  const { userId, date, timeMs } = req.body;

  if (!userId || !date || typeof timeMs !== 'number') {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const info = db.prepare(`
      INSERT INTO scores (user_id, puzzle_date, score_ms)
      VALUES (?, ?, ?)
    `).run(userId, date, timeMs);

    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// Get stats for a date/time
router.get('/stats', (req, res) => {
  const { date, timeMs } = req.query;

  if (!date || isNaN(parseInt(timeMs))) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  try {
    const stats = getStats(date, parseInt(timeMs));
    res.json(stats);
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
