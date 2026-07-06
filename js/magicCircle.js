/**
 * magicCircle.js — декоративная геометрия магического круга (обложка).
 */

(function () {
  "use strict";

  var el = document.getElementById("cover-magic");
  if (!el) return;

  var cx = 500;
  var cy = 500;
  var g = "248,226,161";

  function circ(r, sw, op, dash) {
    var s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" ' +
      'stroke="rgba(' + g + ',' + op + ')" stroke-width="' + sw + '"';
    if (dash) s += ' stroke-dasharray="' + dash + '"';
    return s + "/>";
  }

  function ln(x1, y1, x2, y2, sw, op) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" ' +
      'stroke="rgba(' + g + ',' + op + ')" stroke-width="' + sw + '"/>';
  }

  function arc(r, a1, a2, sw, op) {
    var x1 = cx + Math.cos(a1) * r;
    var y1 = cy + Math.sin(a1) * r;
    var x2 = cx + Math.cos(a2) * r;
    var y2 = cy + Math.sin(a2) * r;
    var large = a2 - a1 > Math.PI ? 1 : 0;
    return '<path d="M' + x1 + " " + y1 + " A" + r + " " + r + " 0 " + large + " 1 " + x2 + " " + y2 + '" ' +
      'fill="none" stroke="rgba(' + g + ',' + op + ')" stroke-width="' + sw + '"/>';
  }

  function dot(x, y, r, op) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="rgba(' + g + ',' + op + ')"/>';
  }

  var svg = '<svg class="cover__magic-svg" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">';
  svg += "<defs>";
  svg += '<filter id="mg-glow" x="-8%" y="-8%" width="116%" height="116%">';
  svg += '<feGaussianBlur stdDeviation="1.2" result="b"/>';
  svg += "<feMerge><feMergeNode in=\"b\"/><feMergeNode in=\"SourceGraphic\"/></feMerge>";
  svg += "</filter>";
  svg += "</defs>";

  svg += '<g filter="url(#mg-glow)">';

  /* Внешняя граница */
  svg += circ(488, 1.8, 0.42, "");
  svg += circ(478, 1, 0.22, "6 10");

  /* Концентрические кольца */
  [460, 440, 418, 395, 372, 348, 325, 302, 278, 255, 232, 210].forEach(function (r, i) {
    var dash = i % 3 === 1 ? "3 7" : i % 3 === 2 ? "1 5" : "";
    svg += circ(r, i % 4 === 0 ? 1.2 : 0.8, 0.14 + (i % 3) * 0.04, dash);
  });

  /* 12 лучей зодиака */
  for (var i = 0; i < 12; i++) {
    var a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    svg += ln(
      cx + Math.cos(a) * 210, cy + Math.sin(a) * 210,
      cx + Math.cos(a) * 478, cy + Math.sin(a) * 478,
      0.7, 0.07
    );
  }

  /* 72 засечки на внешнем кольце */
  for (var j = 0; j < 72; j++) {
    var ang = (j / 72) * Math.PI * 2;
    var major = j % 6 === 0;
    var inner = major ? 452 : 462;
    var outer = major ? 478 : 472;
    svg += ln(
      cx + Math.cos(ang) * inner, cy + Math.sin(ang) * inner,
      cx + Math.cos(ang) * outer, cy + Math.sin(ang) * outer,
      major ? 1.4 : 0.6, major ? 0.28 : 0.12
    );
  }

  /* 12 дуг между знаками */
  for (var m = 0; m < 12; m++) {
    var a1 = (m / 12) * Math.PI * 2 - Math.PI / 2 + 0.07;
    var a2 = ((m + 1) / 12) * Math.PI * 2 - Math.PI / 2 - 0.07;
    svg += arc(430, a1, a2, 0.9, 0.1);
    svg += arc(415, a1, a2, 0.6, 0.06);
  }

  /* 36 коротких радиальных линий — внутренний орнамент */
  for (var n = 0; n < 36; n++) {
    var ang2 = (n / 36) * Math.PI * 2;
    svg += ln(
      cx + Math.cos(ang2) * 248, cy + Math.sin(ang2) * 248,
      cx + Math.cos(ang2) * 268, cy + Math.sin(ang2) * 268,
      0.55, 0.1
    );
  }

  /* Внутренние декоративные окружности */
  svg += circ(248, 1, 0.16, "");
  svg += circ(248, 0.6, 0.08, "4 6");
  svg += circ(228, 0.9, 0.12, "");
  svg += circ(228, 0.5, 0.07, "2 5");
  svg += circ(208, 0.7, 0.09, "");

  /* Символический внутренний шестиугольник */
  for (var h = 0; h < 6; h++) {
    var ang3 = (h / 6) * Math.PI * 2 - Math.PI / 2;
    var ang4 = ((h + 1) / 6) * Math.PI * 2 - Math.PI / 2;
    var rHex = 185;
    svg += ln(
      cx + Math.cos(ang3) * rHex, cy + Math.sin(ang3) * rHex,
      cx + Math.cos(ang4) * rHex, cy + Math.sin(ang4) * rHex,
      0.7, 0.08
    );
  }

  /* 8 малых орнаментальных ромбов */
  for (var p = 0; p < 8; p++) {
    var ang5 = (p / 8) * Math.PI * 2;
    var px = cx + Math.cos(ang5) * 360;
    var py = cy + Math.sin(ang5) * 360;
    svg += '<polygon points="' +
      px + "," + (py - 5) + " " +
      (px + 4) + "," + py + " " +
      px + "," + (py + 5) + " " +
      (px - 4) + "," + py +
      '" fill="none" stroke="rgba(' + g + ',0.12)" stroke-width="0.7"/>';
  }

  /* Точки-узлы на кольцах */
  for (var d = 0; d < 48; d++) {
    var ang6 = (d / 48) * Math.PI * 2;
    var rDot = d % 4 === 0 ? 445 : 395;
    svg += dot(
      cx + Math.cos(ang6) * rDot,
      cy + Math.sin(ang6) * rDot,
      d % 4 === 0 ? 1.8 : 1,
      d % 4 === 0 ? 0.35 : 0.18
    );
  }

  /* 12 узлов на внешней орбите */
  for (var k = 0; k < 12; k++) {
    var ang7 = (k / 12) * Math.PI * 2 - Math.PI / 2;
    var dx = cx + Math.cos(ang7) * 478;
    var dy = cy + Math.sin(ang7) * 478;
    svg += dot(dx, dy, 2.2, 0.4);
    svg += dot(dx, dy, 1, 0.7);
  }

  /* Соединительные дуги — внутренний «сигил» */
  for (var s = 0; s < 3; s++) {
    var rSig = 165 + s * 22;
    for (var t = 0; t < 4; t++) {
      var aStart = (t / 4) * Math.PI * 2 + s * 0.4;
      var aEnd = aStart + Math.PI / 5;
      svg += arc(rSig, aStart, aEnd, 0.6, 0.07);
    }
  }

  svg += "</g></svg>";
  el.innerHTML = svg;
})();
