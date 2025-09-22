import { runExample } from '../../src/index.js';

describe('integration example', () => {
  test('runExample returns expected object', () => {
    const out = runExample();
    expect(out).toMatchObject({ sum: 3, greeting: 'Hello, World!', quotient: 5 });
  });
});
