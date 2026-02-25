# Phase 10: Research & Architecture - Research

**Researched:** 2026-02-24
**Domain:** Node.js/Express Backend & SQLite Architecture
**Confidence:** HIGH

## Summary

This phase defines the technical foundation for transitioning the "Yellow Blocks Word Game" from a static single-file frontend to a full-stack application. The backend will provide a persistent leaderboard and statistics engine using Node.js, Express, and SQLite. 

The primary challenge is implementing a robust percentile calculation that feels fair with both small (local testing) and large (production) datasets. We will use a standard statistical formula with a smoothing factor (0.5) to handle ties and small sample sizes gracefully.

**Primary recommendation:** Use `better-sqlite3` for high-performance synchronous database access and a "flat-ish" Express structure to minimize complexity for this single-frontend project.

## User Constraints

### Locked Decisions
- **Frontend**: Single-file HTML frontend (keep integration clean).
- **Database**: SQLite for local-first database.
- **Server**: Node.js/Express for the server.
- **Testing**: Must support local testing before any remote push.
- **Percentile Logic**: Robust handling of small N vs large N.
- **Security**: Basic rate limiting and origin check.
- **Port**: Default 3000 for server.

### Claude's Discretion
- **Project Structure**: Recommended separation of concerns (routes, services, db).
- **Libraries**: Specific choices for SQLite and security middleware.
- **Percentile Algorithm**: Selection of the specific ranking formula.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| BE-01 | SQLite Database Schema | Defined in [Architecture Patterns](#database-schema) |
| BE-02 | Score Persistence | Documented in [Code Examples](#score-submission-logic) |
| API-01 | Stats Retrieval API | Defined in [Standard Stack](#api-specification) |
| API-02 | Percentile Logic | Algorithm defined in [Architecture Patterns](#percentile-calculation) |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| express | ^4.18 | Web framework | Industry standard, lightweight, easy to use. |
| better-sqlite3 | ^9.0 | Database driver | Faster than `sqlite3`, synchronous API fits SQLite well. |
| dotenv | ^16.0 | Config management | standard for local environment variables. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| express-rate-limit | ^7.0 | Security | Prevent brute-force/DOS on score submission. |
| cors | ^2.8 | Security | Restrict API access to specific origins. |
| helmet | ^7.0 | Security | Set various HTTP headers for security. |
| supertest | ^6.0 | Testing | For integration testing of API endpoints. |

**Installation:**
```bash
npm install express better-sqlite3 dotenv express-rate-limit cors helmet
npm install --save-dev supertest
```

## Architecture Patterns

### Recommended Project Structure
To keep the single-file frontend integration clean, we will move `index.html` to a `public/` directory and use Express to serve it.

```
/
├── public/
│   └── index.html         # Moved from root
├── server/
│   ├── db/
│   │   ├── index.js       # DB connection and WAL mode setup
│   │   └── schema.sql     # Table definitions
│   ├── routes/
│   │   └── api.js         # Score and Stats endpoints
│   ├── services/
│   │   └── stats.js       # Percentile and average logic
│   └── index.js           # Server entry point (app.listen)
├── tests/
│   └── api.test.js        # Supertest scripts
├── .env                   # PORT=3000, NODE_ENV=development
├── .gitignore             # Ignore node_modules, .env, and *.db
├── package.json
└── README.md
```

### Database Schema
A single table `scores` is sufficient for the current roadmap.

```sql
CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,         -- UUID or anonymous hash
    puzzle_date TEXT NOT NULL,     -- YYYY-MM-DD
    score_ms INTEGER NOT NULL,     -- Completion time in milliseconds
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scores_date ON scores(puzzle_date);
```

### Percentile Calculation
We use the **Normal/Standard Percentile Rank** with a smoothing factor of 0.5 to handle small N and ties.

**Formula:** `PR = (SlowerScores + 0.5) / TotalScores * 100`

- **Small N example (1 player):** `(0 + 0.5) / 1 * 100 = 50%` (Better than 50% of players).
- **Small N example (2 players, you are fastest):** `(1 + 0.5) / 2 * 100 = 75%`.
- **Large N (1000 players, 900 slower):** `(900 + 0.5) / 1000 * 100 = 90.05%`.

**Implementation Insight:** For the UI, we should display "Rank X of Y" when N < 10 to be more transparent, and "Top X%" or "Better than X%" for N >= 10.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Rate Limiting | Custom IP tracking | `express-rate-limit` | Handles memory leaks and edge cases. |
| SQL Injection | String concatenation | `better-sqlite3` prepared statements | Security risk. |
| Server Logging | `console.log` | `morgan` (optional) | Better formatting and standard output. |

## Common Pitfalls

### Pitfall 1: SQLite Blocking the Event Loop
**What goes wrong:** `better-sqlite3` is synchronous. If a query takes too long, the whole server freezes.
**Why it happens:** Node.js is single-threaded; sync calls block it.
**How to avoid:** Keep queries simple. Use indexes. For this game, datasets will be small enough (<100k rows) that sync calls are negligible (<1ms).

### Pitfall 2: Local DB in Production
**What goes wrong:** Using a local file in a containerized environment (like Heroku) without persistent volumes leads to data loss.
**Why it happens:** Ephemeral file systems.
**How to avoid:** This phase is for local testing. If moving to production, ensure a persistent volume is used or switch to PostgreSQL.

### Pitfall 3: Timezone Mismatches
**What goes wrong:** `puzzle_date` being stored as local time instead of UTC.
**Why it happens:** Server and client in different timezones.
**How to avoid:** Always use `YYYY-MM-DD` based on UTC or the client's "Game Day" to ensure scores align with the daily puzzle.

## Code Examples

### Score Submission Logic
```javascript
// server/routes/api.js
const db = require('../db');

router.post('/scores', (req, res) => {
    const { userId, date, timeMs } = req.body;
    
    const stmt = db.prepare('INSERT INTO scores (user_id, puzzle_date, score_ms) VALUES (?, ?, ?)');
    stmt.run(userId, date, timeMs);
    
    res.json({ success: true });
});
```

### Robust Percentile Query
```javascript
// server/services/stats.js
function getStats(date, userTimeMs) {
    const total = db.prepare('SELECT COUNT(*) as count FROM scores WHERE puzzle_date = ?').get(date).count;
    const slower = db.prepare('SELECT COUNT(*) as count FROM scores WHERE puzzle_date = ? AND score_ms > ?').get(date, userTimeMs).count;
    const average = db.prepare('SELECT AVG(score_ms) as avg FROM scores WHERE puzzle_date = ?').get(date).avg;

    const percentile = total > 0 ? ((slower + 0.5) / total) * 100 : 50;

    return {
        totalPlayers: total,
        averageTime: Math.round(average),
        percentile: parseFloat(percentile.toFixed(1))
    };
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `sqlite3` (callback/promise) | `better-sqlite3` (sync) | 2020+ | Better performance, cleaner code for SQLite. |
| Static JSON files | SQLite | Phase 10 | Real-time updates without file write locks. |
| Manual Percentile | SQL Aggregate Queries | Phase 10 | Faster calculation on server-side. |

## Open Questions

1. **How to handle user identity?**
   - Recommendation: Generate a random UUID on the client and store it in `localStorage`. This avoids a full login system while allowing "Personal Best" tracking.

2. **Should we validate the score client-side?**
   - Recommendation: Basic validation (must be > 0). Anti-cheat is out of scope for v1.2, but rate limiting prevents spam.

## Sources

### Primary (HIGH confidence)
- [better-sqlite3 docs](https://github.com/WiseLibs/better-sqlite3) - Synchronous performance and WAL mode.
- [Express.js Official Docs](https://expressjs.com/) - Project structure and static serving.
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - Frontend-Backend communication.

### Secondary (MEDIUM confidence)
- [Statistics How To](https://www.statisticshowto.com/probability-and-statistics/percentiles-rank/) - Percentile rank formulas for small samples.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Very standard Node/Express choices.
- Architecture: HIGH - Fits the single-file frontend constraint perfectly.
- Pitfalls: HIGH - Common SQLite/Node patterns.

**Research date:** 2026-02-24
**Valid until:** 2026-05-24
