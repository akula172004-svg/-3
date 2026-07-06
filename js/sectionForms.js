/**
 * sectionForms.js — самостоятельные анкеты для каждого раздела.
 * hero-form (#hero-form) используется только с главного экрана.
 */

(function () {
  "use strict";

  function getTodayMax() {
    var today = new Date();
    return (
      today.getFullYear() + "-" +
      String(today.getMonth() + 1).padStart(2, "0") + "-" +
      String(today.getDate()).padStart(2, "0")
    );
  }

  function setSectionDateLimits() {
    var max = getTodayMax();
    document.querySelectorAll(".app-section input[type='date']").forEach(function (input) {
      input.max = max;
    });
  }

  function showHint(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
  }

  function hideHint(el) {
    if (!el) return;
    el.hidden = true;
    el.textContent = "";
  }

  function getRadioValue(form, name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : "";
  }

  function bindBackButtons() {
    document.querySelectorAll("[data-back-hero]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (window.AppSections) AppSections.showHero();
      });
    });
  }

  function bindQuickAnalysisForm() {
    var form = document.getElementById("quick-analysis-form");
    var hint = document.getElementById("quick-analysis-hint");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideHint(hint);

      var birthDate = document.getElementById("quick-analysis-birth-date").value;
      if (!birthDate) {
        showHint(hint, "Пожалуйста, укажите дату рождения.");
        return;
      }

      if (!window.NumerologyApp) return;

      var result = NumerologyApp.runAnalysis({
        firstName: "",
        lastName: "",
        birthDate: birthDate,
        gender: "female",
        birthCity: "",
      }, "quick");

      if (!result.ok) {
        showHint(hint, result.message || "Не удалось выполнить расчёт.");
      }
    });

    form.addEventListener("input", function () { hideHint(hint); });
  }

  function bindFullAnalysisForm() {
    var form = document.getElementById("full-analysis-form");
    var hint = document.getElementById("full-analysis-hint");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideHint(hint);

      var firstName = document.getElementById("full-analysis-first-name").value.trim();
      var birthDate = document.getElementById("full-analysis-birth-date").value;

      if (!firstName) {
        showHint(hint, "Пожалуйста, введите имя.");
        return;
      }

      if (!birthDate) {
        showHint(hint, "Пожалуйста, укажите дату рождения.");
        return;
      }

      if (!window.NumerologyApp) return;

      var result = NumerologyApp.runAnalysis({
        firstName: firstName,
        lastName: "",
        birthDate: birthDate,
        gender: getRadioValue(form, "full-analysis-gender") || "female",
        birthCity: "",
      }, "full");

      if (!result.ok) {
        showHint(hint, result.message || "Не удалось выполнить расчёт.");
      }
    });

    form.addEventListener("input", function () { hideHint(hint); });
  }

  function bindDeepAnalysisForm() {
    var form = document.getElementById("deep-analysis-form");
    var hint = document.getElementById("deep-analysis-hint");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideHint(hint);

      var firstName = document.getElementById("deep-analysis-first-name").value.trim();
      var birthDate = document.getElementById("deep-analysis-birth-date").value;

      if (!firstName) {
        showHint(hint, "Пожалуйста, введите имя.");
        return;
      }

      if (!birthDate) {
        showHint(hint, "Пожалуйста, укажите дату рождения.");
        return;
      }

      if (!window.NumerologyApp) return;

      var result = NumerologyApp.runAnalysis({
        firstName: firstName,
        lastName: document.getElementById("deep-analysis-last-name").value.trim(),
        birthDate: birthDate,
        gender: getRadioValue(form, "deep-analysis-gender") || "female",
        birthCity: document.getElementById("deep-analysis-city").value.trim(),
      }, "deep");

      if (!result.ok) {
        showHint(hint, result.message || "Не удалось выполнить расчёт.");
      }
    });

    form.addEventListener("input", function () { hideHint(hint); });
  }

  function bindCompatibilityForm() {
    var form = document.getElementById("compatibility-form");
    var hint = document.getElementById("compatibility-hint");
    var result = document.getElementById("compatibility-result");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideHint(hint);
      if (result) result.hidden = true;

      var name1 = document.getElementById("compatibility-p1-name").value.trim();
      var date1 = document.getElementById("compatibility-p1-date").value;
      var name2 = document.getElementById("compatibility-p2-name").value.trim();
      var date2 = document.getElementById("compatibility-p2-date").value;

      if (!name1 || !date1 || !name2 || !date2) {
        showHint(hint, "Заполните имя и дату рождения для обоих людей.");
        return;
      }

      var calc = Numerology.calculateCompatibility(date1, date2);
      if (!calc) {
        showHint(hint, "Не удалось обработать даты. Проверьте правильность ввода.");
        return;
      }

      document.getElementById("compatibility-result-num-1").textContent = calc.person1.lifePath;
      document.getElementById("compatibility-result-num-2").textContent = calc.person2.lifePath;
      document.getElementById("compatibility-result-label-1").textContent = name1;
      document.getElementById("compatibility-result-label-2").textContent = name2;
      document.getElementById("compatibility-result-percent").textContent = calc.percent + "%";
      document.getElementById("compatibility-result-circle").style.setProperty("--percent", calc.percent);
      document.getElementById("compatibility-result-level").textContent = calc.level ? calc.level.label : "";
      document.getElementById("compatibility-result-strengths").textContent = calc.strengths;
      document.getElementById("compatibility-result-challenges").textContent = calc.challenges;

      if (result) {
        result.hidden = false;
        result.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });

    form.addEventListener("input", function () {
      hideHint(hint);
      if (result) result.hidden = true;
    });
  }

  function bindFinanceForm() {
    var form = document.getElementById("finance-form");
    var hint = document.getElementById("finance-hint");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideHint(hint);

      var firstName = document.getElementById("finance-first-name").value.trim();
      var birthDate = document.getElementById("finance-birth-date").value;
      var gender = getRadioValue(form, "finance-gender") || "female";

      if (!firstName) {
        showHint(hint, "Пожалуйста, введите имя.");
        return;
      }

      if (!birthDate) {
        showHint(hint, "Пожалуйста, укажите дату рождения.");
        return;
      }

      var client = Consultation.buildClient({
        firstName: firstName,
        lastName: "",
        birthDate: birthDate,
        gender: gender,
        birthCity: "",
      });

      if (!client) {
        showHint(hint, "Не удалось обработать дату. Проверьте правильность ввода.");
        return;
      }

      showHint(hint, "Анкета принята. Расчёт финансового потенциала будет добавлен в этом разделе.");
    });

    form.addEventListener("input", function () { hideHint(hint); });
  }

  function init() {
    setSectionDateLimits();
    bindBackButtons();
    bindQuickAnalysisForm();
    bindFullAnalysisForm();
    bindDeepAnalysisForm();
    bindCompatibilityForm();
    bindFinanceForm();
  }

  init();
})();
