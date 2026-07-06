/**
 * heroScene.js
 * ------------
 * Лёгкий параллакс и «живой свет» на главном экране.
 */

(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var sky = document.querySelector(".hero-portal__sky");
  var artifact = document.querySelector(".portal-matrix-wrap");
  var light = document.querySelector(".living-light");
  if (!sky) return;

  var targetX = 0;
  var targetY = 0;
  var currentX = 0;
  var currentY = 0;

  document.addEventListener("mousemove", function (e) {
    var nx = (e.clientX / window.innerWidth - 0.5) * 2;
    var ny = (e.clientY / window.innerHeight - 0.5) * 2;
    targetX = nx;
    targetY = ny;
    if (light) {
      light.style.setProperty("--lx", (e.clientX / window.innerWidth * 100) + "%");
      light.style.setProperty("--ly", (e.clientY / window.innerHeight * 100) + "%");
    }
  });

  function tick() {
    currentX += (targetX - currentX) * 0.04;
    currentY += (targetY - currentY) * 0.04;

    sky.style.transform =
      "translate3d(" + (currentX * 10) + "px," + (currentY * 8) + "px,0)";
    if (artifact) {
      artifact.style.transform =
        "translate3d(" + (currentX * -5) + "px," + (currentY * -4) + "px,0)";
    }
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
