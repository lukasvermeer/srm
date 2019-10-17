switch(window.location.origin) { // TODO switch is bad; find alternative
  case "https://lukasvermeer.github.io":
    document.querySelectorAll('input').forEach(i => i.addEventListener("input", function() {
      var a = parseInt(document.getElementById("atraffic").value);
      var b = parseInt(document.getElementById("btraffic").value);
      var e = parseFloat(document.getElementById("expectedprop").value);

      checkSRM(a, b, e);
    }, false));
    break;
  case "https://optimize.google.com":
    setInterval(function() { // TODO find way to detect document changes instead of using polling
      var d = document.getElementsByClassName("opt-variant-sessions-subtitle");
      if (d.length > 1) {
        var a = parseInt(d[0].innerText.split(" ")[0]);
        var b = parseInt(d[1].innerText.split(" ")[0]);
        var e = 0.5; // TODO extract intended split from GO

        checkSRM(a, b, e);
      }
    }, 1000);
    break;
}

function checkSRM(a, b, e) {
  var n = a + b;
  var p = b / n;
  var r = jStat.ztest(p, e, Math.sqrt(p*(1-p)/n));

  var c = "white";
  if (r < 0.0001) {
    c = "red"
  }

  switch(window.location.origin) {
    case "https://lukasvermeer.github.io":
      document.body.style.backgroundColor = c;
      break;
    case "https://optimize.google.com":
      document.querySelectorAll(".opt-variant-sessions-subtitle").forEach(i => i.style.backgroundColor = c)
      break;
  }
};
