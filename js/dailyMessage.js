/**
 * dailyMessage.js — раздел «Послание дня»: выбор знака зодиака и числа.
 */

(function () {
  "use strict";

  var selectedSignId = null;

  var stepSigns = document.getElementById("daily-message-step-signs");
  var stepNumber = document.getElementById("daily-message-step-number");
  var resultBlock = document.getElementById("daily-message-result");
  var zodiacList = document.getElementById("daily-message-zodiac");
  var numbersWrap = document.getElementById("daily-message-numbers");
  var pickedSignEl = document.getElementById("daily-message-picked-sign");
  var backSignsBtn = document.getElementById("daily-message-back-signs");
  var restartBtn = document.getElementById("daily-message-restart");

  function showStep(step) {
    if (stepSigns) stepSigns.hidden = step !== "signs";
    if (stepNumber) stepNumber.hidden = step !== "number";
    if (resultBlock) resultBlock.hidden = step !== "result";
  }

  function resetToSigns() {
    selectedSignId = null;
    showStep("signs");
  }

  function renderZodiacGrid() {
    if (!zodiacList || typeof ZODIAC_SIGNS === "undefined") return;

    zodiacList.innerHTML = "";

    ZODIAC_SIGNS.forEach(function (sign) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "daily-message__sign";
      btn.dataset.signId = sign.id;
      btn.setAttribute("aria-label", sign.name);

      var img = document.createElement("img");
      img.className = "daily-message__sign-img";
      img.src = sign.image;
      img.alt = "";
      img.width = 64;
      img.height = 64;

      var name = document.createElement("span");
      name.className = "daily-message__sign-name";
      name.textContent = sign.name;

      btn.appendChild(img);
      btn.appendChild(name);
      btn.addEventListener("click", function () {
        selectedSignId = sign.id;
        if (pickedSignEl) {
          pickedSignEl.textContent = sign.name + " · " + sign.dates;
        }
        showStep("number");
      });

      li.appendChild(btn);
      zodiacList.appendChild(li);
    });
  }

  function renderNumberGrid() {
    if (!numbersWrap || typeof DAILY_NUMBERS === "undefined") return;

    numbersWrap.innerHTML = "";

    DAILY_NUMBERS.forEach(function (num) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "daily-message__num";
      btn.textContent = String(num);
      btn.setAttribute("aria-label", "Число " + num);
      btn.addEventListener("click", function () {
        showResult(selectedSignId, num);
      });
      numbersWrap.appendChild(btn);
    });
  }

  function showResult(signId, dayNumber) {
    if (typeof buildZodiacDayMessage !== "function") return;

    var msg = buildZodiacDayMessage(signId, dayNumber);
    if (!msg) return;

    document.getElementById("daily-message-result-icon").src = msg.signImage;
    document.getElementById("daily-message-result-icon").alt = msg.signName;
    document.getElementById("daily-message-result-title").textContent =
      msg.signName + " · Число дня " + msg.dayNumber;
    document.getElementById("daily-message-result-date").textContent = msg.dateLabel;

    var moodEl = document.getElementById("daily-message-result-mood");
    moodEl.textContent = msg.mood;
    moodEl.className = "daily-message__result-mood" +
      (msg.favorable ? " daily-message__result-mood--good" : " daily-message__result-mood--calm");

    document.getElementById("daily-message-result-text").textContent = msg.text;
    document.getElementById("daily-message-result-do").textContent = msg.doToday;

    showStep("result");
    if (resultBlock) {
      resultBlock.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function bindControls() {
    if (backSignsBtn) {
      backSignsBtn.addEventListener("click", resetToSigns);
    }
    if (restartBtn) {
      restartBtn.addEventListener("click", resetToSigns);
    }
  }

  function init() {
    if (!stepSigns) return;
    renderZodiacGrid();
    renderNumberGrid();
    bindControls();
    resetToSigns();

    window.addEventListener("hashchange", function () {
      if (location.hash === "#daily-message") resetToSigns();
    });
  }

  init();
})();
