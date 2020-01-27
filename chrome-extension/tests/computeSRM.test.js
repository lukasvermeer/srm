const computeSRM = require('./srmNodeWrapper');

test('computeSRM test #1', () => {
  expect(computeSRM([1000,950,1050,1000], [25,25,25,25])).toBeCloseTo(0.171797);
});
