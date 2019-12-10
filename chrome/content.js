switch (window.location.origin) { // TODO switch is bad; find alternative
  case "https://lukasvermeer.github.io":
    document.querySelectorAll('input').forEach(i => i.addEventListener("input", function() {
      var a = parseInt(document.getElementById("atraffic").value);
      var b = parseInt(document.getElementById("btraffic").value);
      var e = parseFloat(document.getElementById("expectedprop").value);

      checkSRM(a, b, e);
    }, false));
    break;
  case "https://optimize.google.com":
    // Load the Details Tab in the background to get expected proportion of variants.
    function new_iframe() {
      if (location.href.slice(-6) == "report") {
        var old_iframe = document.getElementById('iframeforweight');
        if (old_iframe != null) {
          old_iframe.parentNode.removeChild(old_iframe);
        }

        var ifrm = document.createElement("iframe");
        ifrm.id = "iframeforweight"
        ifrm.src = location.href.slice(0,-7);
        ifrm.style.display = "none";
        document.body.appendChild(ifrm);
      }
    }
    new_iframe();

    // Listen for changing URL to reload iframe for proportions
    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
        if (request.message === 'URL has changed') {
          new_iframe();
          srm_checked = false;
        }
      });

    var srm_checked = false; // TODO: Listen for changes to do check when content loads.
    setInterval(function () {
      if (!srm_checked) {
        // Get sample counts
        var d = document.querySelectorAll('opt-multi-objective .opt-variant-sessions-subtitle');
        var iframeforweight = document.getElementById('iframeforweight');
        var weightnodes = iframeforweight.contentWindow.document.getElementsByClassName("opt-variation-weight");

        if (d.length > 1 && weightnodes.length > 1) {
          // Get unrounded custom proportions (if any)
          // TODO: Must be a better way to do this.
          (iframeforweight.contentWindow.document.getElementsByClassName('opt-variation-weight')[0]).click();
          var weightnodes_custom = iframeforweight.contentWindow.document.querySelectorAll('.opt-edit-weights-list input');

          if (weightnodes.length > 1) {
            sessioncounts = [];
            weights = [];

            // Fill the arrays
            for (var i = 0; i < d.length; i++) {
              var sessions = parseInt(d[i].innerText.replace(/,/g, '').split(" ")[0]);
              var weightnode = weightnodes[i].getElementsByClassName("ng-binding");
              var weight = parseInt(weightnode[0].innerHTML);
              // Use custom unrounded weights when available.
              // TODO: Must be a better way to do this too.
              if (weightnodes_custom.length > 1) {
                weight = parseFloat(weightnodes_custom[i].value);
              }
              sessioncounts.push(sessions);
              weights.push(weight);
            }

            // Check all combinations for SRMs
            var j = 0;
            var k = 1;
            var checksperformed = 0;
            while (j < sessioncounts.length) {
              while (k < sessioncounts.length) {
                var l = weights[j] / (weights[j] + weights[k]);
                console.log('SRM checked between: ' + sessioncounts[j] + ' and ' + sessioncounts[k] + ' with expected weight ' + l);
                checkSRM(sessioncounts[j], sessioncounts[k], l, j, k, checksperformed);
                checksperformed++;
                k++;
              }
              j++;
              var k = j + 1;
            }
            srm_checked = true;
          }
        }
      }
    }, 1000);
}

function checkSRM(a, b, e, identa, identb, checksperformed) {
  var n = a + b;
  var p = b / n;
  var r = jStat.ztest(p, e, Math.sqrt(p*(1-p)/n));

  backgrounds = ['#FFA07A', '#FA8072', '#CD5C5C', '#DC143C', '#B22222', '#FF0000', '#800000', '#FF4500', '#DB7093']
  var c = "white";
  if (r < 0.0001) {
    checksperformed++;
    c = "red";
  }
  switch(window.location.origin) {
    case "https://lukasvermeer.github.io":
      document.body.style.backgroundColor = c;
      break;
    case "https://optimize.google.com":
      if (c == "red") {
        function createidentspan(identifier) {
          var identspan = document.createElement("span");
          identspan.style.cssText = "background-color: " + backgrounds[checksperformed] + "; padding: 1px 2.5px; color: white; border-radius: 3px;";
          var identtext = document.createTextNode("SRM #" + checksperformed);
          identspan.appendChild(identtext);
          document.querySelectorAll('opt-multi-objective .opt-variant-sessions-subtitle')[identifier].appendChild(identspan);
        }
        createidentspan(identa);
        createidentspan(identb);
      }
      break;
  }
};
