import { add, greet, safeDivide } from '../src/lib/utils.js';

describe('utils', () => {
  test('add adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('add throws on non-number', () => {
    expect(() => add('2', 3)).toThrow(/numbers/);
  });

  test('greet with a name', () => {
    expect(greet('Ada')).toBe('Hello, Ada!');
  });

  test('greet defaults when empty', () => {
    expect(greet('')).toBe('Hello!');
  });

  test('safeDivide returns null for divide by zero', () => {
    expect(safeDivide(10, 0)).toBeNull();
  });

  test('safeDivide divides numbers', () => {
    expect(safeDivide(10, 2)).toBe(5);
  });
});
