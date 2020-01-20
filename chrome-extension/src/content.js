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

function checkSRM(a, b, e, identa, identb, checksperformed) {
  const n = a + b;
  const p = b / n;
  const r = jStat.ztest(p, e, Math.sqrt(p*(1-p)/n));

  if (r < params.pValueThreshold) {
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
        const e = parseFloat(document.getElementById('expectedprop').value, 10);

        checkSRM(a, b, e);
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
        if (location.href.slice(-6) == 'report') {
          const oldIframe = document.getElementById('iframeforweight');
          if (oldIframe != null) {
            oldIframe.parentNode.removeChild(oldIframe);
          }

          const ifrm = document.createElement('iframe');
          ifrm.id = 'iframeforweight';
          ifrm.src = location.href.slice(0,-7);
          ifrm.style.display = 'none';
          document.body.appendChild(ifrm);
        }
      }
      newIframe();

      // Listen for changing URL to reload iframe for proportions
      chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
          if (request.message === 'URL has changed') {
            newIframe();
            srmChecked = false;
          }
        },
      );

      let srmChecked = false; // TODO: Listen for changes to do check when content loads.
      setInterval(function () {
        if (!srmChecked) {
          // Get sample counts
          const d = document.querySelectorAll('opt-multi-objective .opt-variant-sessions-subtitle');
          const iframeforweight = document.getElementById('iframeforweight');
          const weightnodes = iframeforweight.contentWindow.document.getElementsByClassName('opt-variation-weight');

          if (d.length > 1 && weightnodes.length > 1) {
            // Get unrounded custom proportions (if any)
            // TODO: Must be a better way to do this.
            (iframeforweight.contentWindow.document.getElementsByClassName('opt-variation-weight')[0]).click();
            const weightnodesCustom = iframeforweight.contentWindow.document.querySelectorAll('.opt-edit-weights-list input');

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
                if (weightnodesCustom.length > 1) {
                  weight = parseFloat(weightnodesCustom[i].value, 10);
                }
                sessioncounts.push(sessions);
                weights.push(weight);
              }

              // Check all combinations for SRMs
              let j = 0;
              let k = 1;
              let checksperformed = 0;
              while (j < sessioncounts.length) {
                while (k < sessioncounts.length) {
                  const l = weights[j] / (weights[j] + weights[k]);
                  checkSRM(sessioncounts[j], sessioncounts[k], l, j, k, checksperformed);
                  checksperformed += 1;
                  k += 1;
                }
                j += 1;
                k = j + 1;
              }
              srmChecked = true;
            }
          }
        }
      }, 1000);
    },
    flagSRM() {
      document.querySelectorAll('.opt-variant-sessions-subtitle').forEach(i => i.style.cssText = 'background-color: red; color: white; padding: 1px 3px; border-radius: 3px;');
    },
    unflagSRM() {
      // TODO remove SRM warning if needed.
    },
  },
};

platforms[platform].init();
