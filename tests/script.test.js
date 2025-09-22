test('script.js runs without crashing', async () => {
  await import('../src/script.js');
  expect(true).toBe(true); // dummy assertion
});
