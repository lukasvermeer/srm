// Sample Ratio Mismatch (SRM) Checker
//
// This Chrome Extension automatically performs SRM checks and flags potential
// data quality issues on supported experimentation platforms.
//

// Checking for SRM using chi-square
function computeSRM(observed, expected) {
  const df = observed.length - 1;
  let sampleSize = 0;
  let chisquare = 0;
  for (let i = 0; i < observed.length; i += 1) {
    sampleSize += observed[i];
  }
  const e = expected;
  for (let i = 0; i < observed.length; i += 1) {
    e[i] = Math.round(sampleSize * expected[i] / 100);
    chisquare += ((observed[i] - expected[i]) ** 2) / expected[i];
  }
  return chisqrprob(df, chisquare);
}
