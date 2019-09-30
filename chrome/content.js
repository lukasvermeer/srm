document.querySelectorAll('input').forEach(i => i.addEventListener("input", function() {
  var a = parseInt(document.getElementById("atraffic").value);
  var b = parseInt(document.getElementById("btraffic").value);
  var e = parseFloat(document.getElementById("expectedprop").value);

  var n = a + b;
  var p = b / n;
  var r = jStat.ztest(p, e, Math.sqrt(p*(1-p)/n));

  if (r < 0.0001) {
    document.body.style.backgroundColor = "red"
  } else {
    document.body.style.backgroundColor = "white"
  }
}, false));
