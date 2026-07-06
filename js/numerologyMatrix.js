/**
 * numerologyMatrix.js
 * -------------------
 * Древний нумерологический артефакт: рунические кольца + матрица 3×3.
 */

(function () {
  "use strict";

  var matrixEl = document.getElementById("num-matrix");
  var ringsEl = document.getElementById("artifact-rings");
  if (!matrixEl) return;

  var cells = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6],
  ];

  /** Рунические метки по окружности */
  function runicTicks(cx, cy, r, count, len) {
    var out = "";
    for (var i = 0; i < count; i++) {
      var a = (i / count) * Math.PI * 2 - Math.PI / 2;
      var x1 = cx + Math.cos(a) * (r - len);
      var y1 = cy + Math.sin(a) * (r - len);
      var x2 = cx + Math.cos(a) * r;
      var y2 = cy + Math.sin(a) * r;
      out += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" ' +
        'x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" ' +
        'stroke="rgba(201,162,39,0.35)" stroke-width="0.7"/>';
    }
    return out;
  }

  if (ringsEl) {
    ringsEl.innerHTML =
      '<svg class="artifact-ring artifact-ring--outer" viewBox="0 0 200 200" aria-hidden="true">' +
      '<circle cx="100" cy="100" r="96" fill="none" stroke="rgba(201,162,39,0.12)" stroke-width="0.6"/>' +
      runicTicks(100, 100, 96, 48, 5) +
      '<circle cx="100" cy="100" r="88" fill="none" stroke="rgba(201,162,39,0.08)" stroke-width="0.4" stroke-dasharray="2 6"/>' +
      "</svg>" +
      '<svg class="artifact-ring artifact-ring--mid" viewBox="0 0 200 200" aria-hidden="true">' +
      '<circle cx="100" cy="100" r="78" fill="none" stroke="rgba(201,162,39,0.18)" stroke-width="0.5"/>' +
      runicTicks(100, 100, 78, 36, 4) +
      "</svg>" +
      '<svg class="artifact-ring artifact-ring--inner" viewBox="0 0 200 200" aria-hidden="true">' +
      '<circle cx="100" cy="100" r="62" fill="none" stroke="rgba(201,162,39,0.22)" stroke-width="0.6"/>' +
      '<polygon points="100,42 108,58 126,58 112,70 118,86 100,76 82,86 88,70 74,58 92,58" ' +
      'fill="none" stroke="rgba(201,162,39,0.15)" stroke-width="0.5"/>' +
      "</svg>";
  }

  var svg =
    '<svg class="num-matrix__svg" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    "<defs>" +
    '<linearGradient id="nm-gold" x1="0%" y1="0%" x2="100%" y2="100%">' +
    '<stop offset="0%" stop-color="#faf6e8"/>' +
    '<stop offset="40%" stop-color="#e8d5a3"/>' +
    '<stop offset="100%" stop-color="#9a7b2e"/>' +
    "</linearGradient>" +
    '<radialGradient id="nm-plate" cx="40%" cy="35%">' +
    '<stop offset="0%" stop-color="rgba(30,22,48,0.95)"/>' +
    '<stop offset="100%" stop-color="rgba(8,6,18,0.98)"/>' +
    "</radialGradient>" +
    '<filter id="nm-soft"><feGaussianBlur stdDeviation="0.8" result="b"/>' +
    "<feMerge><feMergeNode in=\"b\"/><feMergeNode in=\"SourceGraphic\"/></feMerge>" +
    "</filter></defs>";

  svg += '<rect x="18" y="18" width="124" height="124" rx="14" fill="url(#nm-plate)" ' +
    'stroke="rgba(201,162,39,0.35)" stroke-width="0.8"/>';

  var lines = [
    [32, 32, 128, 32], [32, 80, 128, 80], [32, 128, 128, 128],
    [32, 32, 32, 128], [80, 32, 80, 128], [128, 32, 128, 128],
    [32, 32, 128, 128], [128, 32, 32, 128],
  ];
  lines.forEach(function (l) {
    svg += '<line x1="' + l[0] + '" y1="' + l[1] + '" x2="' + l[2] + '" y2="' + l[3] + '" ' +
      'stroke="rgba(201,162,39,0.2)" stroke-width="0.6"/>';
  });

  for (var r = 0; r < 3; r++) {
    for (var c = 0; c < 3; c++) {
      var x = 48 + c * 32;
      var y = 48 + r * 32;
      svg +=
        '<circle cx="' + x + '" cy="' + y + '" r="14" fill="rgba(201,162,39,0.04)" ' +
        'stroke="rgba(201,162,39,0.18)" stroke-width="0.5"/>' +
        '<text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" ' +
        'font-family="Cormorant Garamond, Cinzel, serif" font-size="17" font-weight="600" ' +
        'fill="url(#nm-gold)" filter="url(#nm-soft)">' + cells[r][c] + "</text>";
    }
  }

  svg += '<circle cx="80" cy="80" r="2.5" fill="rgba(250,246,232,0.7)"/>';
  svg += "</svg>";
  matrixEl.innerHTML = svg;
})();
