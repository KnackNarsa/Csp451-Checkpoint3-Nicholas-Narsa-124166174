import https from 'https';

const url = process.env.SMOKE_URL || process.argv.find((a) => a.startsWith('http'));
if (!url) {
  console.error('Usage: SMOKE_URL=https://example.com node scripts/smoke-test.js');
  process.exit(1);
}

https
  .get(url, (res) => {
    const ok = res.statusCode && res.statusCode < 400;
    console.log(`Smoke test ${ok ? 'passed' : 'failed'}: ${res.statusCode}`);
    process.exit(ok ? 0 : 1);
  })
  .on('error', (err) => {
    console.error('Smoke test error:', err.message);
    process.exit(1);
  });
