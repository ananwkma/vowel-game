const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}/api`;

async function runTests() {
  console.log('--- Starting API Tests ---');

  const testDate = '2026-02-24';
  const testUser = 'test-user-' + Math.random().toString(36).substring(7);

  // 1. Submit a score
  console.log('1. Submitting a score...');
  const res1 = await fetch(`${BASE_URL}/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: testUser,
      date: testDate,
      timeMs: 45000 // 45 seconds
    })
  });
  
  if (!res1.ok) {
    console.error('Submission failed:', await res1.text());
    process.exit(1);
  }
  const data1 = await res1.json();
  console.log('Success! Inserted ID:', data1.id);

  // 2. Fetch stats
  console.log('\n2. Fetching stats for the same time...');
  const res2 = await fetch(`${BASE_URL}/stats?date=${testDate}&timeMs=45000`);
  if (!res2.ok) {
    console.error('Stats fetch failed:', await res2.text());
    process.exit(1);
  }
  const stats = await res2.json();
  console.log('Stats received:', JSON.stringify(stats, null, 2));

  // 3. Verify percentile logic
  console.log('\n3. Verifying percentile logic...');
  if (stats.percentile === 50) {
    console.log('✓ Percentile logic verified (1 player: 50th percentile)');
  } else {
    console.log('✖ Percentile logic mismatch. Expected 50, got:', stats.percentile);
  }

  console.log('\n--- Tests Complete ---');
}

runTests().catch(err => {
  console.error('Test script failed:', err);
  process.exit(1);
});
