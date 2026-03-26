const computeSRM = require('./srmNodeWrapper');

describe('computeSRM', () => {
  test('computeSRM test #1 (4 variations, no SRM)', () => {
    expect(computeSRM([1000, 950, 1050, 1000], [25, 25, 25, 25])).toBeCloseTo(0.171797);
  });

  test('Standard A/B test with no SRM (50/50)', () => {
    expect(computeSRM([500, 500], [50, 50])).toBe(1);
  });

  test('Standard A/B test with clear SRM (50/50)', () => {
    // 600 vs 400 with 50/50 expectation is highly significant
    const pval = computeSRM([600, 400], [50, 50]);
    expect(pval).toBeLessThan(0.0001);
  });

  test('Uneven allocation (90/10) without SRM', () => {
    expect(computeSRM([900, 100], [90, 10])).toBe(1);
  });

  test('Uneven allocation (90/10) with SRM', () => {
    const pval = computeSRM([850, 150], [90, 10]);
    expect(pval).toBeLessThan(0.0001);
  });

  describe('Edge Case & Error Handling', () => {
    test('Different Array Lengths returns NaN', () => {
      expect(computeSRM([100, 100], [33, 33, 34])).toBe(NaN);
      expect(computeSRM([100, 100, 100], [50, 50])).toBe(NaN);
    });

    test('Non-Numeric Inputs returns NaN', () => {
      expect(computeSRM([100, NaN], [50, 50])).toBe(NaN);
      expect(computeSRM([100, 100], [50, "50"])).toBe(NaN);
      expect(computeSRM([100, null], [50, 50])).toBe(NaN);
      expect(computeSRM([100, undefined], [50, 50])).toBe(NaN);
    });

    test('Empty Arrays returns NaN', () => {
      expect(computeSRM([], [])).toBe(NaN);
    });

    test('Single variation returns NaN (cannot calculate SRM with 1 variation)', () => {
      expect(computeSRM([100], [100])).toBe(NaN);
    });

    test('Zero Expected Allocation (Division by Zero check)', () => {
      // If expectedScaled is 0, chisq becomes Infinity, and p-value should be 0
      expect(Number(computeSRM([100, 100], [100, 0]))).toBe(0);
    });

    test('Rounding issues with 3-way split (33.33%)', () => {
      // 1000 users split 333, 333, 334. Expected 33.33, 33.33, 33.34
      // sampleSize = 1000. 
      // expectedScaled = [round(1000*33.33/100), round(1000*33.33/100), round(1000*33.34/100)]
      // expectedScaled = [333, 333, 333] -> wait, last one is 333.4 -> 333.
      // So expectedScaled sums to 999.
      expect(computeSRM([333, 333, 334], [33.33, 33.33, 33.34])).toBeCloseTo(1.0, 2);
    });

    test('Negative visitor counts should probably return NaN', () => {
      expect(computeSRM([-100, 100], [50, 50])).toBe(NaN);
    });

    test('Non-integer visitor counts (should work but are rare)', () => {
      // Using floats for observed counts should still result in a valid chi-square
      expect(computeSRM([500.5, 499.5], [50, 50])).toBeCloseTo(0.97477, 5);
    });

    test('Zero total observed users returns NaN', () => {
      expect(computeSRM([0, 0], [50, 50])).toBe(NaN);
    });

    test('More than 100 variations (tests large DF code path)', () => {
      // 101 variations, each with 1000 users, 1/101 expected weight each.
      const n = 101;
      const observed = Array(n).fill(1000);
      const expected = Array(n).fill(100 / n); 
      const pval = computeSRM(observed, expected);
      expect(pval).toBe(1); // Perfect match
    });

    test('Expected percentages not summing to 100', () => {
      // If the sum of expected is not 100, the current implementation might behave unexpectedly
      // because it hardcodes / 100 in the scaling logic.
      // Observed 500/500, but expected 1/1 (proportions).
      // expectedScaled = round(1000 * 1 / 100) = 10.
      // So it compares [500, 500] to [10, 10].
      expect(computeSRM([500, 500], [1, 1])).not.toBe(1);
    });
  });

  test('Large Sample Sizes', () => {
    expect(computeSRM([1000000, 1000000], [50, 50])).toBe(1);
    expect(computeSRM([1001000, 999000], [50, 50])).toBeCloseTo(0.1573, 4);
  });
});
