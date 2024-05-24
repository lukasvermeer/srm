// Sample Ratio Mismatch (SRM) Checker
//
// This Chrome Extension automatically performs SRM checks and flags potential
// data quality issues on supported experimentation platforms.
//

// Define (default) parameters.
const params = {
  pValueThreshold: 0.01,
};

// Checking for SRM using chi-square
function computeSRM(observed, expected) {
  // Check if input contains only numbers, and two arrays of equal length
  if (observed.some((x) => !Number.isFinite(x))) { return NaN; }
  if (expected.some((x) => !Number.isFinite(x))) { return NaN; }
  if (expected.length !== observed.length) { return NaN; }

  // Degrees of freedom is variations - 1
  const df = observed.length - 1;
  // Total sample size is sum of all variations
  const sampleSize = observed.length>0 ? observed.reduce((a, v) => a + v) : 0;
  // Scale expected count per variation to match observed sample
  const expectedScaled = expected.map((e) => Math.round((sampleSize * e) / 100));
  // Chi-square is sum of squares of observed - expected over expected for each variation
  const chisq = expectedScaled.reduce((a, e, i) => a + (((observed[i] - e) ** 2) / e), 0);

  return chisqrprob(df, chisq);
}

// Checking for SRM using chi-square
function checkSRM(observed, expected) {
  const pval = computeSRM(observed, expected);
  if (pval < params.pValueThreshold) {
    platforms[platform].flagSRM(pval);
    if (chrome.runtime) {
      chrome.runtime.sendMessage({srmStatus: 'SRM'});
    }
  } else {
    platforms[platform].unflagSRM(pval);
    if (chrome.runtime) {
      chrome.runtime.sendMessage({srmStatus: 'OK'});
    }
  }
}
