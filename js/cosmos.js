/**
 * cosmos.js — три слоя звёзд с усиленным мягким мерцанием.
 */

(function () {
  "use strict";

  var container = document.getElementById("star-field");
  if (!container) return;

  var w = window.innerWidth;
  var count = w < 600 ? 600 : w < 1200 ? 1200 : 1900;
  var frag = document.createDocumentFragment();

  for (var i = 0; i < count; i++) {
    var star = document.createElement("span");
    star.className = "cosmic-star";

    var roll = Math.random();

    if (roll > 0.985) {
      star.classList.add("cosmic-star--large");
    } else if (roll > 0.93) {
      star.classList.add("cosmic-star--bright");
    } else if (roll > 0.68) {
      star.classList.add("cosmic-star--medium");
    } else {
      star.classList.add("cosmic-star--small");
    }

    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";

    star.style.setProperty("--twinkle-delay", Math.random() * 18 + "s");
    star.style.setProperty("--twinkle-duration", 3.5 + Math.random() * 6.5 + "s");

    var depth = 0.22 + Math.random() * 0.5;
    star.style.setProperty("--star-opacity", depth.toFixed(2));

    if (Math.random() > 0.78) {
      star.classList.add("cosmic-star--gold");
    }

    frag.appendChild(star);
  }

  container.appendChild(frag);
})();
