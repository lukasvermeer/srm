// Sample Ratio Mismatch (SRM) Checker
//
// This Chrome Extension automatically performs SRM checks and flags potential
// data quality issues on supported experimentation platforms.
//
// More information at https://lukasvermeer.nl/srm/

// Define (default) parameters.
const params = {
  pValueThreshold: 0.0001,
};

// Generic (non-platform specific) functions
const platform = window.location.host;

// Checking for SRM using chi-square
function checkSRM(observed, expected) {
  const pval = computeSRM(observed, expected);
  if (pval < params.pValueThreshold) {
    platforms[platform].flagSRM(pval);
  } else {
    platforms[platform].unflagSRM();
  }
}

// Define object to contain platform specific methods.
const platforms = {

  // SRM Checker Chrome Extension microsite
  // TODO Remove this once we support more than one real platform.
  'lukasvermeer.nl': {
    init() {
      document.querySelectorAll('input').forEach(i => i.addEventListener('input', () => {
        const a = parseInt(document.getElementById('atraffic').value, 10);
        const b = parseInt(document.getElementById('btraffic').value, 10);
        const e = parseFloat(document.getElementById('expectedprop').value, 10) * 100;

        checkSRM([a, b], [100 - e, e]);
      }, false));
    },
    flagSRM() {
      document.body.style.backgroundColor = 'red';
    },
    unflagSRM() {
      document.body.style.backgroundColor = 'white';
    },
  },

  // Google Optimize
  'optimize.google.com': {
    init() {
      // Load the Details Tab in the background to get expected proportion of variants.
      function newIframe() {
        if (location.href.slice(-6) === 'report') {
          const oldIframe = document.getElementById('iframeforweight');
          if (oldIframe != null) {
            oldIframe.parentNode.removeChild(oldIframe);
          }

          const ifrm = document.createElement('iframe');
          ifrm.id = 'iframeforweight';
          ifrm.src = location.href.slice(0, -7);
          ifrm.style.display = 'none';
          document.body.appendChild(ifrm);
        }
      }
      newIframe();

      // Listen for changing URL to reload iframe for proportions
      chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
          if (request.message === 'URL has changed') {
            newIframe();
            srmChecked = false;
          }
        },
      );

      let srmChecked = false; // TODO: Listen for changes to do check when content loads.
      setInterval(() => {
        if (!srmChecked) {
          // Get sample counts
          const d = document.querySelectorAll('opt-multi-objective .opt-variant-sessions-subtitle');
          const iframeforweight = document.getElementById('iframeforweight');
          const weightnodes = iframeforweight.contentWindow.document.getElementsByClassName('opt-variation-weight');

          if (d.length > 1 && weightnodes.length > 1) {
            // Get unrounded custom proportions (if any)
            // TODO: Must be a better way to do this.
            (iframeforweight.contentWindow.document.getElementsByClassName('opt-variation-weight')[0]).click();

            // Handle DOM differences in even/custom split config of experiment
            const typeOfWeight = iframeforweight.contentWindow.document.querySelectorAll('ng-form[name="editWeightsInputForm"] .md-input-has-value');
            let weightnodesCustom;
            if (typeOfWeight.length) {
              weightnodesCustom = iframeforweight.contentWindow.document.querySelectorAll('.opt-edit-weights-list input');
            } else {
              weightnodesCustom = iframeforweight.contentWindow.document.querySelectorAll('.opt-edit-weights-value-column > span.ng-binding');
            }

            if (weightnodes.length > 1) {
              const sessioncounts = [];
              const weights = [];

              // Fill the arrays
              for (let i = 0; i < d.length; i += 1) {
                const sessions = parseInt(d[i].innerText.replace(/,/g, '').split(' ')[0], 10);
                const weightnode = weightnodes[i].getElementsByClassName('ng-binding');
                let weight = parseInt(weightnode[0].innerHTML, 10);
                // Use custom unrounded weights when available.
                // TODO: Must be a better way to do this too.
                if (weightnodesCustom.length > 1 && typeOfWeight.length) {
                  weight = parseFloat(weightnodesCustom[i].value, 10);
                } else if (weightnodesCustom.length > 1) {
                  weight = parseFloat((weightnodesCustom[i].innerText).slice(0, -2), 10);
                }
                sessioncounts.push(sessions);
                weights.push(weight);
              }

              checkSRM(sessioncounts, weights);
              srmChecked = true;
            }
          }
        }
      }, 1000);
    },
    flagSRM(pval) {
      document.querySelectorAll('.opt-variant-sessions-subtitle').forEach(i => i.style.cssText = 'background-color: red; color: white; padding: 1px 3px; border-radius: 3px;');
	  document.querySelectorAll('.opt-variant-sessions-subtitle').forEach(i => i.title = `SRM detected! p-value = ${pval}`);
	  document.querySelectorAll('.opt-variant-sessions-subtitle opt-variant-name').forEach(i => i.name = `SRM detected! p-value = ${pval}`);
    },
    unflagSRM() {
      // TODO remove SRM warning if needed.
    },
  },

  // VWO
  'app.vwo.com': {
    init() {
      // Load the Settings > Others view in the background to get expected proportion of variants.
      function newIframe() {
        if (location.href.slice(-6) === 'report') {
          const oldIframe = document.getElementById('iframeforweight');
          if (oldIframe != null) {
            oldIframe.parentNode.removeChild(oldIframe);
          }
          const ifrm = document.createElement('iframe');
          ifrm.id = 'iframeforweight';
          ifrm.src = `${location.href.slice(0, -7)}/edit/others`;
          ifrm.style.display = 'none';
          document.body.appendChild(ifrm);
        }
      }
      newIframe();
      // Listen for changing URL to reload iframe for proportions
      chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
          if (request.message === 'URL has changed') {
            newIframe();
            srmChecked = false;
          }
        },
      );
      let srmChecked = false; // TODO: Listen for changes to do check when content loads.
      setInterval(() => {
        if (!srmChecked) {
          // Get sample counts
          const d = document.querySelector('table.table--data tbody.ng-scope').querySelectorAll('tr.ng-scope strong.ng-binding');
          const iframeforweight = document.getElementById('iframeforweight');
          const weightnodes = iframeforweight.contentWindow.document.querySelector('div[label="Traffic Split"]');
          if (d && weightnodes) {
            const sessioncounts = [];
            const weights = [];

            // SESSIONS: Fill array
            for (let i = 0; i < d.length; i += 1) {
              const sessions = parseInt(d[i].innerText.substring(d[i].innerText.indexOf('/') + 2), 10);
              sessioncounts.push(sessions);
            }

            // WEIGHTS: Check if equal or custom weight splits are used and fill array
            const weightEqual = iframeforweight.contentWindow.document.querySelectorAll('div[label="Traffic Split"] ul input')[0].checked;
            if (weightEqual) {
              for (let i = 0; i < d.length; i += 1) {
                const weightnode = parseFloat(100 / d.length, 10);
                weights.push(weightnode);
              }
            } else {
              for (let i = 0; i < d.length; i += 1) {
                const weightnode = parseFloat(weightnodes.querySelectorAll('div > ul > li > ul > li > button > span.ng-binding')[i].innerText, 10);
                weights.push(weightnode);
              }
            }

            // Do SRM Check
            checkSRM(sessioncounts, weights);
            srmChecked = true;
          }
        }
      }, 1000);
    },
    flagSRM(pval) {
      document.querySelector('table.table--data tbody.ng-scope').querySelectorAll('tr.ng-scope strong.ng-binding').forEach(i => i.style.cssText = `background-color: red; color: white; padding: 1px 3px; border-radius: 3px;`);
	  document.querySelector('table.table--data tbody.ng-scope').querySelectorAll('tr.ng-scope strong.ng-binding').forEach(i => i.title = `SRM detected! p-value = ${pval}`); // TODO - Check if working as expected
    },
    unflagSRM() {
      // TODO remove SRM warning if needed.
    },
  },

  // Convert.com
  'app.convert.com': {
    init() {
      // Listen for changing URL to reload iframe for proportions
      chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
          if (request.message === 'URL has changed') {
            newIframe();
            srmChecked = false;
          }
        },
      );

      let srmChecked = false; // TODO: Listen for changes to do check when content loads.
      setInterval(() => {
        if (!srmChecked) {
		  if (document.querySelector('div.summary-table-main.report_condensed') != null) {
            // Get sample counts
            const d = document.querySelector('div.summary-table-main.report_condensed').querySelectorAll('tr.tbody.vrow div.goal-data[data-rgroup=all]');
			const stopped = document.querySelector('div.summary-table-main.report_condensed').querySelectorAll('tr.tbody.vrow p.goal-data');
            if (d) {
              const sessioncounts = [];
              const weights = [];
              let groups = 0;
			  let stoppedCount = 0;
			  let testStopped = false;
			  
			  for (let i = 0; i < stopped.length; i += 1) {
				if (stopped[i].innerText.match(/(STOPPED|WINNER)/) != null) {
				  stoppedCount++;
				}
			  }
			  
			  if (stoppedCount == stopped.length) {
				testStopped = true;
			  }

              // SESSIONS: Fill array
              for (let i = 0; i < d.length; i += 1) {
			    if (d[i].style.display != 'none') {
				  if (testStopped || d[i].parentElement.parentElement.querySelector('p.goal-data[data-goalid="' + d[i].getAttribute('data-goalid') + '"]').innerText.match(/(STOPPED)/) == null) {
                    groups++;
                    const sessions = parseInt(d[i].innerText.replace(/^[^/]+\/\s*([,0-9]+)/, '$1').replace(',', ''));
                    sessioncounts.push(sessions);
				  }
			    }
              }

              for (let i = 0; i < d.length; i += 1) {
                if (d[i].style.display != 'none') {
				  if (testStopped || d[i].parentElement.parentElement.querySelector('p.goal-data[data-goalid="' + d[i].getAttribute('data-goalid') + '"]').innerText.match(/(STOPPED)/) == null) {
                    weights.push(1 / groups * 100);
				  }
			    }
              }

              // Do SRM Check
              checkSRM(sessioncounts, weights);
              srmChecked = true;
			}
          }
        }
      }, 1000);
    },
    flagSRM(pval) {
      document.querySelector('div.summary-table-main.report_condensed').querySelectorAll('tr.tbody.vrow div.goal-data[data-rgroup=all]').forEach(i => i.style.cssText = `${i.style.cssText};background-color: red; color: white; padding: 1px 3px; border-radius: 3px;`);
	  document.querySelector('div.summary-table-main.report_condensed').querySelectorAll('tr.tbody.vrow div.goal-data[data-rgroup=all]').forEach(i => i.title = `SRM detected! p-value = ${pval}`);
    },
    unflagSRM() {
      // TODO remove SRM warning if needed.
    },
  },

  // Sitegainer.com
  'sitegainer.com': {
    init() {
      // Listen for changing URL to reload iframe for proportions
      chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
          if (request.message === 'URL has changed') {
            newIframe();
            srmChecked = false;
          }
        },
      );

      let srmChecked = false; // TODO: Listen for changes to do check when content loads.
      setInterval(() => {
        if (!srmChecked) {
          if (document.querySelector('div.goalBlock') != null) {
            // Get sample counts
            const d = document.querySelector('div.goalBlock').querySelectorAll('tr.resultRow');
            if (d) {
              const sessioncounts = [];
              const weights = [];

              // SESSIONS: Fill array
              for (let i = 0; i < d.length; i += 1) {
                const sessions = parseInt(d[i].querySelectorAll('td')[1].innerText.replace(/^\s*([,0-9]+)\s*\/.*?$/, '$1').replace(',', ''));
                sessioncounts.push(sessions);
                const weight = parseInt(d[i].getAttribute('allocation'));
                if (weight != undefined && !isNaN(weight)) {
                  weights.push(weight);
                }
              }

              // Do SRM Check
              if (Array.isArray(weights) && weights.length) {
                checkSRM(sessioncounts, weights);
                srmChecked = true;
              }
            }
          }
        }
      }, 1000);
    },
    flagSRM(pval) {
      document.querySelector('div.goalBlock').querySelectorAll('tr.resultRow').forEach(i => i.querySelectorAll('td')[1].style.cssText = `${i.style.cssText};background-color: red; color: white; padding: 1px 3px; border-radius: 3px;`);
      document.querySelector('div.goalBlock').querySelectorAll('tr.resultRow').forEach(i => i.querySelectorAll('td')[1].title = `SRM detected! p-value = ${pval}`);
    },
    unflagSRM() {
      // TODO remove SRM warning if needed.
    },
  },
  
  // Omniconvert.com
  'web.omniconvert.com': {
    init() {
      // Listen for changing URL to reload iframe for proportions
      chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
          if (request.message === 'URL has changed') {
            newIframe();
            srmChecked = false;
          }
        },
      );

      let srmChecked = false; // TODO: Listen for changes to do check when content loads.
      setInterval(() => {
        if (!srmChecked) {
          if (document.querySelector('table.experiment_results') != null) {
            // Get sample counts
            const d = document.querySelector('table.experiment_results').querySelectorAll(':scope > tbody > tr');
            if (d) {
              const sessioncounts = [];
              const weights = [];

              // SESSIONS: Fill array
              for (let i = 0; i < d.length; i += 1) {
				if (d[i].querySelectorAll('td').length > 0) {
                  const sessions = parseInt(d[i].querySelectorAll('td')[1].innerText.replace(/^\s*([,0-9]+)\s*$/, '$1').replace(',', ''));
                  sessioncounts.push(sessions);
                  const weight = parseInt(d[i].querySelectorAll('td')[0].innerText.replace(/^.*?(?=([1-9][0-9])% (?=traffic allocated|トラフィック割当て)).*?$/is, '$1'));
                  if (weight != undefined && !isNaN(weight)) {
                    weights.push(weight);
                  }
				}
              }

              // Do SRM Check
              if (Array.isArray(weights) && weights.length) {
				  console.log(sessioncounts);console.log(weights);
                checkSRM(sessioncounts, weights);
                srmChecked = true;
              }
            }
          }
        }
      }, 1000);
    },
    flagSRM(pval) {
	  for (let e in document.querySelector('table.experiment_results').querySelectorAll(':scope > tbody > tr')) {
	    let j = document.querySelector('table.experiment_results').querySelectorAll(':scope > tbody > tr')[e];
	    if (typeof(j) == 'object' && j.querySelectorAll('td').length > 0) {
		  let i = j.querySelectorAll('td')[1];
		  i.style.cssText = `${i.style.cssText};background-color: red; color: white; padding: 1px 3px; border-radius: 3px;`;
		  i.title = `SRM detected! p-value = ${pval} . SRM check assumess traffic allocation was not changed for the entire duration of the test.`;
		}
	  }
    },
    unflagSRM() {
      // TODO remove SRM warning if needed.
    },
  },
};

platforms[platform].init();
