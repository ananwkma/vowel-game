/**
 * seed-test-data.js
 *
 * Seeds 10 realistic test scores into the local server via POST /api/scores.
 * Run this with the server already started: node server/index.js
 *
 * Usage: node seed-test-data.js
 */

const BASE_URL = 'http://localhost:3000';

// Spread of realistic completion times from fast (18s) to slow (3.5min)
const TEST_TIMES_MS = [18000, 25000, 32000, 41000, 55000, 68000, 90000, 120000, 150000, 210000];

async function runSeed() {
  // Use same date logic as the frontend DailyEngine
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  console.log(`Seeding scores for date: ${today}`);

  let allOk = true;

  for (let i = 0; i < TEST_TIMES_MS.length; i++) {
    const timeMs = TEST_TIMES_MS[i];
    const userId = `seed-user-${i}`;

    const res = await fetch(`${BASE_URL}/api/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, date: today, timeMs })
    });

    const statusCode = res.status;
    console.log(`Seeded user-${i}: ${timeMs}ms → status ${statusCode}`);

    if (statusCode !== 201) {
      console.error(`  ERROR: Expected 201, got ${statusCode}`);
      allOk = false;
    }
  }

  if (!allOk) {
    console.error('\nSome POSTs failed. Exiting with code 1.');
    process.exit(1);
  }

  // Verify percentile logic with a mid-range time (55s is roughly median in seed set)
  console.log('\nFetching /api/stats to verify percentile logic...');
  const statsRes = await fetch(`${BASE_URL}/api/stats?date=${today}&timeMs=55000`);

  if (!statsRes.ok) {
    console.error(`Stats fetch failed: HTTP ${statsRes.status}`);
    process.exit(1);
  }

  const stats = await statsRes.json();
  console.log('Stats response:', JSON.stringify(stats, null, 2));

  if (typeof stats.percentile !== 'number') {
    console.error('ERROR: percentile is not a number in stats response');
    process.exit(1);
  }

  console.log(`\nSeed complete. totalPlayers=${stats.totalPlayers}, percentile=${stats.percentile}`);
}

runSeed().catch(err => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
