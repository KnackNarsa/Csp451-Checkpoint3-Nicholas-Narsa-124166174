export function add(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') throw new TypeError('add expects numbers');
  return a + b;
}

export function greet(name) {
  const n = String(name || '').trim();
  return n ? `Hello, ${n}!` : 'Hello!';
}

export function safeDivide(a, b) {
  if (b === 0) return null;
  return a / b;
}
