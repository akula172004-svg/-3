/**

 * constellations.js — созвездия с подписями (как на макете).

 */



(function () {

  "use strict";



  var container = document.getElementById("constellations-field");

  if (!container) return;



  var DATA = [

    { name: "Созвездие Овна",      points: [[4,10],[10,16],[18,12],[24,18]],           label: [1, 4],   side: "left" },

    { name: "Созвездие Тельца",    points: [[90,8],[94,14],[88,18],[96,22]],          label: [84, 2],  side: "right" },

    { name: "Созвездие Близнецов", points: [[2,28],[8,34],[16,30],[22,36]],           label: [0, 24],  side: "left" },

    { name: "Созвездие Рака",      points: [[92,30],[86,36],[94,42],[82,40]],          label: [76, 26], side: "right" },

    { name: "Созвездие Льва",      points: [[5,52],[12,48],[20,54],[16,60],[8,58]],    label: [2, 46],  side: "left" },

    { name: "Созвездие Девы",      points: [[90,48],[84,44],[92,54],[86,58]],          label: [78, 40], side: "right" },

    { name: "Созвездие Весов",     points: [[38,3],[44,8],[52,4],[48,12]],             label: [36, 0],  side: "top" },

    { name: "Созвездие Скорпиона", points: [[4,72],[12,68],[20,74],[14,80],[6,78]],    label: [0, 66],  side: "left" },

    { name: "Созвездие Стрельца",  points: [[88,66],[94,62],[98,70],[90,76]],          label: [80, 58], side: "right" },

    { name: "Созвездие Козерога",  points: [[22,88],[30,84],[38,90],[34,95]],          label: [16, 82], side: "bottom" },

    { name: "Созвездие Водолея",   points: [[68,86],[76,82],[84,88],[80,93]],          label: [64, 78], side: "bottom" },

    { name: "Созвездие Рыб",       points: [[44,90],[52,86],[60,92],[56,97],[48,95]],  label: [40, 84], side: "bottom" },

  ];



  DATA.forEach(function (c, i) {

    var group = document.createElement("div");

    group.className = "constellation";

    group.style.animationDelay = (i * 0.45) + "s";



    var left = Math.min.apply(null, c.points.map(function (p) { return p[0]; }));

    var top = Math.min.apply(null, c.points.map(function (p) { return p[1]; }));

    var right = Math.max.apply(null, c.points.map(function (p) { return p[0]; }));

    var bottom = Math.max.apply(null, c.points.map(function (p) { return p[1]; }));



    group.style.left = (left - 3) + "%";

    group.style.top = (top - 3) + "%";

    group.style.width = (right - left + 8) + "%";

    group.style.height = (bottom - top + 10) + "%";



    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    svg.setAttribute("class", "constellation__svg");

    svg.setAttribute("viewBox", "0 0 100 100");

    svg.setAttribute("preserveAspectRatio", "none");



    var w = right - left + 4;

    var h = bottom - top + 6;



    var poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");

    poly.setAttribute("fill", "none");

    poly.setAttribute("stroke", "rgba(248, 226, 161, 0.28)");

    poly.setAttribute("stroke-width", "0.5");

    poly.setAttribute("stroke-linecap", "round");

    poly.setAttribute("points", c.points.map(function (p) {

      return ((p[0] - left + 2) / w * 100) + "," + ((p[1] - top + 2) / h * 100);

    }).join(" "));



    svg.appendChild(poly);



    c.points.forEach(function (p, j) {

      var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");

      dot.setAttribute("cx", ((p[0] - left + 2) / w * 100));

      dot.setAttribute("cy", ((p[1] - top + 2) / h * 100));

      dot.setAttribute("r", j === 0 ? "2.2" : "1.4");

      dot.setAttribute("fill", "#faf6e8");

      dot.setAttribute("class", "constellation__star");

      dot.style.animationDelay = (i * 0.3 + j * 0.18) + "s";

      svg.appendChild(dot);



      var glow = document.createElementNS("http://www.w3.org/2000/svg", "circle");

      glow.setAttribute("cx", dot.getAttribute("cx"));

      glow.setAttribute("cy", dot.getAttribute("cy"));

      glow.setAttribute("r", j === 0 ? "4" : "3");

      glow.setAttribute("fill", "rgba(248, 226, 161, 0.15)");

      glow.setAttribute("class", "constellation__glow");

      svg.insertBefore(glow, dot);

    });



    var label = document.createElement("span");

    label.className = "constellation__label";

    label.textContent = c.name;

    label.style.left = c.label[0] + "%";

    label.style.top = c.label[1] + "%";

    label.style.animationDelay = (i * 0.6) + "s";



    group.appendChild(svg);

    group.appendChild(label);

    container.appendChild(group);

  });

})();

