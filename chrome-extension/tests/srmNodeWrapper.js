var fs = require('fs');

// Read and eval statistics-distributions.js
filedata = fs.readFileSync('./chrome-extension/src/lib/statistics-distributions.js','utf8');
eval(filedata);

// Read and eval srm.js
filedata = fs.readFileSync('./chrome-extension/src/srm.js','utf8');
eval(filedata);

module.exports = function(observed, expected) {
  return computeSRM(observed, expected);
}
