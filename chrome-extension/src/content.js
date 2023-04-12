// Sample Ratio Mismatch (SRM) Checker
//
// This Chrome Extension automatically performs SRM checks and flags potential
// data quality issues on supported experimentation platforms.
//
// More information at https://lukasvermeer.nl/srm/

// Generic (non-platform specific) functions
const platform = window.location.host;

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

  // Optimizely
  'app.optimizely.com': {
    init() {
      // Load the Details Tab in the background to get expected proportion of variants.
      function newIframe() {
        if (location.href.includes('result')) {
          const oldIframe = document.getElementById('iframeforweight');
          if (oldIframe != null) {
            oldIframe.parentNode.removeChild(oldIframe);
          }

          const ifrm = document.createElement('iframe');
          ifrm.id = 'iframeforweight';
          ifrm.src = location.href.match('(.*)results')[1] + location.href.match('experiments/[0-9]+')[0] + '/variations';
          ifrm.style.display = 'none';
          document.body.appendChild(ifrm);
        }
      }
      newIframe();

      // Listen for changing URL to reload iframe for proportions
      chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
          if (request.message === 'URL has changed') {
            const srmstyling = document.getElementById('srmcss');
            if (srmstyling != null) {
              srmstyling.parentNode.removeChild(srmstyling);
            }
            newIframe();
            srmChecked = false;
            chrome.runtime.sendMessage({srmStatus: 'ON'});
          }
        },
      );

      let srmChecked = false; // TODO: Listen for changes to do check when content loads.
      setInterval(() => {
        if (!srmChecked) {
          // Get sample counts
          let d = document.querySelectorAll('.performance-summary__column:first-child [data-test-section=performance-summary-cell-primary-value]');
          const iframeforweight = document.getElementById('iframeforweight');
          if (iframeforweight === null) return;
          const weightnodes = iframeforweight.contentWindow.document.querySelectorAll('.oui-text-input[name="variation_percentage"]');

          if (d.length > 1 && weightnodes.length > 1) {
            const sessioncounts = [];
            const weights = [];

            // Fill the arrays
            for (let i = 0; i < d.length; i += 1) {
              const sessions = parseInt(d[i].innerText.replace(/,/g, '').split(' ')[0], 10);
              const weight = parseFloat(weightnodes[i].value);
              sessioncounts.push(sessions);
              weights.push(weight);
            }

            checkSRM(sessioncounts, weights);
            srmChecked = true;
          }
        }
      }, 1000);
    },
    flagSRM(pval) {
      const temp_styles = '.performance-summary__column:first-child [data-test-section=performance-summary-cell-primary-value] {background-color: red; color: white; padding: 1px 3px; border-radius: 3px;}';
      var srm_css = document.createElement('style');
      srm_css.type = 'text/css';
      srm_css.id = 'srmcss';
      srm_css.appendChild(document.createTextNode(temp_styles));
      document.getElementsByTagName('body')[0].appendChild(srm_css);
      document.querySelectorAll('.performance-summary__column:first-child [data-test-section=performance-summary-cell-primary-value]').forEach(i => i.title = `SRM detected! p-value = ${pval}`);
    },
    unflagSRM() {
      // TODO remove SRM warning if needed.
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
            const srmstyling = document.getElementById('srmcss');
            if (srmstyling != null) {
              srmstyling.parentNode.removeChild(srmstyling);
            }
            newIframe();
            srmChecked = false;
            chrome.runtime.sendMessage({srmStatus: 'ON'});
          }
        },
      );

      let srmChecked = false; // TODO: Listen for changes to do check when content loads.
      setInterval(() => {
        if (!srmChecked) {
          // Get sample counts
          let d = document.querySelectorAll('.opt-objective-details.opt-objective-table tr td:nth-of-type(2) opt-metric-value > div > div:not(.opt-baseline):not(.opt-distribution-metric-value)');
          const iframeforweight = document.getElementById('iframeforweight');
          if (iframeforweight === null) return;
          const weightnodes = iframeforweight.contentWindow.document.getElementsByClassName('opt-variation-weight-readonly');

          if (d.length > 1 && weightnodes.length > 1) {
            const sessioncounts = [];
            const weights = [];

            // Fill the arrays
            for (let i = 0; i < d.length; i += 1) {
              const sessions = parseInt(d[i].innerText.replace(/,/g, '').split(' ')[0], 10);
              const weight = parseInt(weightnodes[i].innerText.replace(/% weight/g, ''), 10);
              sessioncounts.push(sessions);
              weights.push(weight);
            }

            checkSRM(sessioncounts, weights);
            srmChecked = true;
          }
        }
      }, 1000);
    },
    flagSRM(pval) {
      const temp_styles = '.opt-variant-sessions-subtitle, .opt-objective-details.opt-objective-table tr td:nth-of-type(2) opt-metric-value > div > div:not(.opt-baseline):not(.opt-distribution-metric-value) {background-color: red; color: white; padding: 1px 3px; border-radius: 3px;}';
      var srm_css = document.createElement('style');
      srm_css.type = 'text/css';
      srm_css.id = 'srmcss';
      srm_css.appendChild(document.createTextNode(temp_styles));
      document.getElementsByTagName('body')[0].appendChild(srm_css);
      document.querySelectorAll('.opt-variant-sessions-subtitle').forEach(i => i.title = `SRM detected! p-value = ${pval}`);
      document.querySelectorAll('.opt-variant-sessions-subtitle opt-variant-name').forEach(i => i.name = `SRM detected! p-value = ${pval}`);
      document.querySelectorAll('.opt-objective-details.opt-objective-table tr td:nth-of-type(2) opt-metric-value > div > div').forEach(i => i.title = `SRM detected! p-value = ${pval}`);
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
            const srmstyling = document.getElementById('srmcss');
            if (srmstyling != null) {
              srmstyling.parentNode.removeChild(srmstyling);
            }
            newIframe();
            srmChecked = false;
            chrome.runtime.sendMessage({srmStatus: 'ON'});
          }
        },
      );
      let srmChecked = false; // TODO: Listen for changes to do check when content loads.
      setInterval(() => {
        if (!srmChecked) {
          // Get sample counts
          const d = document.querySelector('table.table--data tbody.ng-scope').querySelectorAll('tr.ng-scope strong.ng-binding');
          const iframeforweight = document.getElementById('iframeforweight');
          if (iframeforweight === null) return;
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
      const temp_styles = 'table.table--data tbody.ng-scope tr.ng-scope strong.ng-binding {background-color: red; color: white; padding: 1px 3px; border-radius: 3px;} td[child-order-id="conversionsVisitors"] div:nth-of-type(2) span {background-color: red; color: white; padding: 1px 3px; border-radius: 3px;}';
      var srm_css = document.createElement('style');
      srm_css.type = 'text/css';
      srm_css.id = 'srmcss';
      srm_css.appendChild(document.createTextNode(temp_styles));
      document.getElementsByTagName('body')[0].appendChild(srm_css);
      document.querySelector('table.table--data tbody.ng-scope').querySelectorAll('tr.ng-scope strong.ng-binding').forEach(i => i.title = `SRM detected! p-value = ${pval}`);
      document.querySelector('table.table--data tbody.ng-scope').querySelectorAll('td[child-order-id="conversionsVisitors"] div:nth-of-type(2) span').forEach(i => i.title = `SRM detected! p-value = ${pval}`);
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
            chrome.runtime.sendMessage({srmStatus: 'ON'});
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
                  if (testStopped || d[i].parentElement.parentElement.querySelector(`p.goal-data[data-goalid="${d[i].getAttribute('data-goalid')}"]`).innerText.match(/(STOPPED)/) == null) {
                    groups++;
                    const sessions = parseInt(d[i].innerText.replace(/^[^/]+\/\s*([,0-9]+)/, '$1').replace(',', ''));
                    sessioncounts.push(sessions);
                  }
                }
              }

              for (let i = 0; i < d.length; i += 1) {
                if (d[i].style.display != 'none') {
                  if (testStopped || d[i].parentElement.parentElement.querySelector(`p.goal-data[data-goalid="${d[i].getAttribute('data-goalid')}"]`).innerText.match(/(STOPPED)/) == null) {
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
            chrome.runtime.sendMessage({srmStatus: 'ON'});
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
            chrome.runtime.sendMessage({srmStatus: 'ON'});
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
                checkSRM(sessioncounts, weights);
                srmChecked = true;
              }
            }
          }
        }
      }, 1000);
    },
    flagSRM(pval) {
      for (const e in document.querySelector('table.experiment_results').querySelectorAll(':scope > tbody > tr')) {
        const j = document.querySelector('table.experiment_results').querySelectorAll(':scope > tbody > tr')[e];
        if (typeof (j) === 'object' && j.querySelectorAll('td').length > 0) {
          const i = j.querySelectorAll('td')[1];
          i.style.cssText = `${i.style.cssText};background-color: red; color: white; padding: 1px 3px; border-radius: 3px;`;
          i.title = `SRM detected! p-value = ${pval} . SRM check assumess traffic allocation was not changed for the entire duration of the test.`;
        }
      }
    },
    unflagSRM() {
      // TODO remove SRM warning if needed.
    },
  },

  // Zoho.eu
  'pagesense.zoho.eu': {
    init() {
      // Load the Details Tab in the background to get expected proportion of variants.
      function newIframe() {
        if (location.href.slice(-8) === '/reports') {
          const oldIframe = document.getElementById('iframeforweight');
          if (oldIframe != null) {
            oldIframe.parentNode.removeChild(oldIframe);
          }

          const ifrm = document.createElement('iframe');
          ifrm.id = 'iframeforweight';
          ifrm.src = location.href.replace('/reports', '/summary');
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
            chrome.runtime.sendMessage({srmStatus: 'ON'});
          }
        },
      );

      let srmChecked = false; // TODO: Listen for changes to do check when content loads.
      setInterval(() => {
        if (!srmChecked) {
          if (document.querySelector('table.Report-detailedTable') != null) {
            // Get sample counts
            const d = document.querySelector('table.Report-detailedTable').querySelectorAll('tr');
            const iframeforweight = document.getElementById('iframeforweight');
            if (iframeforweight === null) return;
            const weightnodes = iframeforweight.contentWindow.document.querySelector('table.Summary-trafficTable').querySelectorAll('tr');
            if (d) {
              const sessioncounts = [];
              const weights = [];

              // SESSIONS: Fill array
              for (let i = 0; i < d.length; i += 1) {
                if (d[i].querySelectorAll('td').length > 0) {
                  const sessions = parseInt(d[i].querySelectorAll('td')[2].innerText.replace(/^\s*([,0-9]+)\s*$/, '$1').replace(',', ''));
                  sessioncounts.push(sessions);
                }
              }

              // WEIGHTS: Fill array
              for (let i = 0; i < weightnodes.length; i += 1) {
                if (weightnodes[i].querySelectorAll('td').length > 0) {
                  const weight = parseInt(weightnodes[i].querySelectorAll('td')[1].innerText.replace(/^.*?(?=([1-9][0-9])%).*?$/is, '$1'));
                  if (weight != undefined && !isNaN(weight)) {
                    weights.push(weight);
                  }
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
      for (const e in document.querySelector('table.Report-detailedTable').querySelectorAll('tr')) {
        const j = document.querySelector('table.Report-detailedTable').querySelectorAll('tr')[e];
        if (typeof (j) === 'object' && j.querySelectorAll('td').length > 0) {
          const i = j.querySelectorAll('td')[2];
          i.style.cssText = `${i.style.cssText};background-color: red; color: white; padding: 1px 3px; border-radius: 3px;`;
          i.title = `SRM detected! p-value = ${pval}`;
        }
      }
    },
    unflagSRM() {
      // TODO remove SRM warning if needed.
    },
  },

  // Zoho.com
  'pagesense.zoho.com': {
    init() {
      // Load the Details Tab in the background to get expected proportion of variants.
      function newIframe() {
        if (location.href.slice(-8) === '/reports') {
          const oldIframe = document.getElementById('iframeforweight');
          if (oldIframe != null) {
            oldIframe.parentNode.removeChild(oldIframe);
          }

          const ifrm = document.createElement('iframe');
          ifrm.id = 'iframeforweight';
          ifrm.src = location.href.replace('/reports', '/summary');
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
            chrome.runtime.sendMessage({srmStatus: 'ON'});
          }
        },
      );

      let srmChecked = false; // TODO: Listen for changes to do check when content loads.
      setInterval(() => {
        if (!srmChecked) {
          if (document.querySelector('table.Report-detailedTable') != null) {
            // Get sample counts
            const d = document.querySelector('table.Report-detailedTable').querySelectorAll('tr');
            const iframeforweight = document.getElementById('iframeforweight');
            if (iframeforweight === null) return;
            const weightnodes = iframeforweight.contentWindow.document.querySelector('table.Summary-trafficTable').querySelectorAll('tr');
            if (d) {
              const sessioncounts = [];
              const weights = [];

              // SESSIONS: Fill array
              for (let i = 0; i < d.length; i += 1) {
                if (d[i].querySelectorAll('td').length > 0) {
                  const sessions = parseInt(d[i].querySelectorAll('td')[2].innerText.replace(/^\s*([,0-9]+)\s*$/, '$1').replace(',', ''));
                  sessioncounts.push(sessions);
                }
              }

              // WEIGHTS: Fill array
              for (let i = 0; i < weightnodes.length; i += 1) {
                if (weightnodes[i].querySelectorAll('td').length > 0) {
                  const weight = parseInt(weightnodes[i].querySelectorAll('td')[1].innerText.replace(/^.*?(?=([1-9][0-9])%).*?$/is, '$1'));
                  if (weight != undefined && !isNaN(weight)) {
                    weights.push(weight);
                  }
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
      for (const e in document.querySelector('table.Report-detailedTable').querySelectorAll('tr')) {
        const j = document.querySelector('table.Report-detailedTable').querySelectorAll('tr')[e];
        if (typeof (j) === 'object' && j.querySelectorAll('td').length > 0) {
          const i = j.querySelectorAll('td')[2];
          i.style.cssText = `${i.style.cssText};background-color: red; color: white; padding: 1px 3px; border-radius: 3px;`;
          i.title = `SRM detected! p-value = ${pval}`;
        }
      }
    },
    unflagSRM() {
      // TODO remove SRM warning if needed.
    },
  },
};

platforms[platform].init();
