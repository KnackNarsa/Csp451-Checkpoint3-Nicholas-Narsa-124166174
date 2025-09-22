import { add, greet, safeDivide } from './lib/utils.js';

// Simple boot script
if (typeof window !== 'undefined') {
  const msg = document.getElementById('message');
  if (msg) msg.textContent = `${greet('Student')} — 2 + 3 = ${add(2, 3)}`;
}

export function runExample() {
  return {
    sum: add(1, 2),
    greeting: greet('World'),
    quotient: safeDivide(10, 2)
  };
}

// Allow running as a script (node src/index.js)
if (import.meta.url === `file://${process.argv[1]}`) {
  // eslint-disable-next-line no-console
  console.log('Example output:', runExample());
}
