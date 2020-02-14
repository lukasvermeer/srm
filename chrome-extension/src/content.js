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
  if (computeSRM(observed, expected) < params.pValueThreshold) {
    platforms[platform].flagSRM();
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
    flagSRM() {
      document.querySelectorAll('.opt-variant-sessions-subtitle').forEach(i => i.style.cssText = 'background-color: red; color: white; padding: 1px 3px; border-radius: 3px;');
      // get user report GA link
      const repUrl = document.querySelector('div[ng-if=reportUrl] a').href;
      let uIDParam = '';
      if (repUrl.match(/(authuser=)/) != null) { uIDParam = '?authuser=' + repUrl.replace(/^.*?authuser=([0-9]+).*$/, '$1') + '&'; }
      const expId = repUrl.replace(/^.*?experimentId%253D([^%]+).*$/, '$1');
      // TODO - check if below line actually works as expected
      const gaIDs = iframeforweight.contentWindow.document.querySelector('a[opt-track=viewHomeInGa]').href.replace(/^.*?\/report-home\/([a-z0-9]+).*$/, '$1');
      let startDate = new Date(document.querySelector('div.opt-schedule-display-start-time>span').innerText);
      let startMonth = startDate.getMonth()+1;
      if (startMonth < 10) startMonth = '0' + startMonth.toString();
      startDate = startDate.getFullYear().toString() + startMonth + startDate.getDate().toString();
      let endDate = new Date(document.querySelector('div.opt-schedule-display-end-time>span').innerText);
      let endMonth = endDate.getMonth()+1;
      if (endMonth < 10) endMonth = '0' + endMonth.toString();
      endDate = endDate.getFullYear().toString() + endMonth + endDate.getDate().toString(); //not a problem if the date is in the future
      // REPLACE gaLink below with a suitable custom report link, but make sure to preserve all param replacements in the URL
      const gaLink = 'https://analytics.google.com/analytics/web/' + uIDParam + '#/report/visitors-mobile-overview/' + gaIDs + '/_u.date00=' + startDate + '&_u.date01=' + endDate + '&explorer-table.secSegmentId=analytics.experimentCombination&explorer-table.plotKeys=%5B%5D&explorer-table.advFilter=%5B%5B0,%22analytics.experimentCombination%22,%22PT%22,%22' + expId + '%22,0%5D%5D&explorer-table-dataTable.sortColumnName=analytics.experimentCombination&explorer-table-dataTable.sortDescending=false/';
      // TODO need to extract the number of users for each variant (order does not matter?) and then perform an SRM on these
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
    flagSRM() {
      document.querySelector('table.table--data tbody.ng-scope').querySelectorAll('tr.ng-scope strong.ng-binding').forEach(i => i.style.cssText = 'background-color: red; color: white; padding: 1px 3px; border-radius: 3px;');
    },
    unflagSRM() {
      // TODO remove SRM warning if needed.
    },
  },
};

platforms[platform].init();
