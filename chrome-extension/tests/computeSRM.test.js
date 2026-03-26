const computeSRM = require('./srmNodeWrapper');

/**
 * Unit tests for the Sample Ratio Mismatch (SRM) calculation logic.
 * These tests verify the chi-squared goodness-of-fit test used to detect
 * imbalances in experimentation traffic.
 */
describe('computeSRM', () => {
  test('Standard 4-way split with no SRM', () => {
    // Observed counts: 1000, 950, 1050, 1000
    // Expected distribution: 25/25/25/25
    // Result: High p-value (~0.17) indicates no significant mismatch.
    expect(computeSRM([1000, 950, 1050, 1000], [25, 25, 25, 25])).toBeCloseTo(0.171797);
  });

  test('Perfect 50/50 split (p-value = 1)', () => {
    // Observed exactly matches expected (500 vs 500 for a 50/50 split).
    expect(computeSRM([500, 500], [50, 50])).toBe(1);
  });

  test('Significant SRM in 50/50 split', () => {
    // 600 vs 400 is a highly unlikely outcome for a 50/50 allocation.
    // Result: Low p-value (<0.0001) flags a likely data quality issue.
    const pval = computeSRM([600, 400], [50, 50]);
    expect(pval).toBeLessThan(0.0001);
  });

  test('Uneven allocation (90/10) without SRM', () => {
    // Observed counts exactly match the uneven 90/10 expectation.
    expect(computeSRM([900, 100], [90, 10])).toBe(1);
  });

  test('Uneven allocation (90/10) with SRM', () => {
    // 850 vs 150 (when expecting 900 vs 100) is a significant mismatch.
    const pval = computeSRM([850, 150], [90, 10]);
    expect(pval).toBeLessThan(0.0001);
  });

  describe('Edge Case & Error Handling', () => {
    test('Different Array Lengths (should return NaN)', () => {
      // Cannot compare arrays of different sizes.
      expect(computeSRM([100, 100], [33, 33, 34])).toBe(NaN);
      expect(computeSRM([100, 100, 100], [50, 50])).toBe(NaN);
    });

    test('Non-Numeric Inputs (should return NaN)', () => {
      // All inputs must be finite numbers.
      expect(computeSRM([100, NaN], [50, 50])).toBe(NaN);
      expect(computeSRM([100, 100], [50, "50"])).toBe(NaN);
      expect(computeSRM([100, null], [50, 50])).toBe(NaN);
      expect(computeSRM([100, undefined], [50, 50])).toBe(NaN);
    });

    test('Empty Arrays (should return NaN)', () => {
      expect(computeSRM([], [])).toBe(NaN);
    });

    test('Single variation (should return NaN)', () => {
      // Statistical significance cannot be calculated for a single group.
      expect(computeSRM([100], [100])).toBe(NaN);
    });

    test('Zero Expected Allocation (should result in p-value = 0)', () => {
      // Comparison against a 0% allocation group results in a division by zero in chi-square math.
      // This is logically an extreme mismatch.
      expect(Number(computeSRM([100, 100], [100, 0]))).toBe(0);
    });

    test('Rounding behavior for 3-way splits (33.33%)', () => {
      // 1000 users split 333, 333, 334. Expected percentages 33.33, 33.33, 33.34.
      // This test ensures that rounding of expected counts (to match sample size) 
      // does not create false positive mismatches.
      expect(computeSRM([333, 333, 334], [33.33, 33.33, 33.34])).toBeCloseTo(1.0, 2);
    });

    test('Negative visitor counts (should return NaN)', () => {
      expect(computeSRM([-100, 100], [50, 50])).toBe(NaN);
    });

    test('Non-integer visitor counts', () => {
      // Chi-square tests usually expect integers, but the math is stable for floats.
      // Results should still be logically sound.
      expect(computeSRM([500.5, 499.5], [50, 50])).toBeCloseTo(0.97477, 5);
    });

    test('Zero total observed users (should return NaN)', () => {
      expect(computeSRM([0, 0], [50, 50])).toBe(NaN);
    });

    test('Large number of variations (> 100)', () => {
      // Tests internal statistical code paths for high Degrees of Freedom (df > 100).
      const n = 101;
      const observed = Array(n).fill(1000);
      const expected = Array(n).fill(100 / n); 
      expect(computeSRM(observed, expected)).toBe(1);
    });

    test('Expected values that do not sum to 100', () => {
      // The current implementation assumes expected weights are provided as percentages (sum to 100).
      // If sum of expected != 100, scaling logic results in an incorrect comparison.
      // E.g., [1, 1] is treated as 1% and 1% of the total sample.
      expect(computeSRM([500, 500], [1, 1])).not.toBe(1);
    });
  });

  test('Large Sample Sizes (Numerical Stability)', () => {
    // Verifies the p-value calculation is stable for samples in the millions.
    expect(computeSRM([1000000, 1000000], [50, 50])).toBe(1);
    expect(computeSRM([1001000, 999000], [50, 50])).toBeCloseTo(0.1573, 4);
  });
});
