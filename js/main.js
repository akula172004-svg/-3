/**
 * main.js
 * -------
 * Управляет интерфейсом всех разделов страницы.
 *
 * Разделы:
 *   1. Расчёт по дате рождения → личная карта
 *   2. Совместимость по двум датам
 *   3. Справочник чисел (заполняется при загрузке)
 *
 * Логика расчётов — в numerology.js
 * Тексты чисел — в numberDescriptions.js
 */

(function () {
  "use strict";

  /* ==========================================================
     ЭЛЕМЕНТЫ DOM
     ========================================================== */

  /* Форма расчёта */
  var birthForm = document.getElementById("birth-form");
  var birthDateInput = document.getElementById("birth-date");
  var formHint = document.getElementById("form-hint");
  var personalCardSection = document.getElementById("personal-card");
  var resetButton = document.getElementById("reset-button");

  /* Личная карта */
  var cardDateLabel = document.getElementById("card-date-label");
  var cardLifePath = document.getElementById("card-life-path");
  var cardLifePathTitle = document.getElementById("card-life-path-title");
  var cardLifePathDesc = document.getElementById("card-life-path-desc");
  var cardTip = document.getElementById("card-tip");
  var profileGrid = document.getElementById("profile-grid");

  /* Совместимость */
  var compatForm = document.getElementById("compat-form");
  var compatDate1 = document.getElementById("compat-date-1");
  var compatDate2 = document.getElementById("compat-date-2");
  var compatHint = document.getElementById("compat-hint");
  var compatResult = document.getElementById("compat-result");
  var compatCircle = document.getElementById("compat-circle");
  var compatPercent = document.getElementById("compat-percent");
  var compatLevel = document.getElementById("compat-level");
  var compatNum1 = document.getElementById("compat-num-1");
  var compatNum2 = document.getElementById("compat-num-2");
  var compatLabel1 = document.getElementById("compat-label-1");
  var compatLabel2 = document.getElementById("compat-label-2");
  var compatStrengths = document.getElementById("compat-strengths");
  var compatChallenges = document.getElementById("compat-challenges");

  /* Справочник чисел */
  var numbersGrid = document.getElementById("numbers-grid");

  /* Ключи чисел для сетки карты (кроме lifePath — он в шапке) */
  var PROFILE_KEYS = ["soul", "destiny", "personality", "birthday"];

  /* ==========================================================
     ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
     ========================================================== */

  /**
   * Устанавливает max="" для всех полей даты (нельзя выбрать будущее).
   */
  function setMaxDates() {
    var today = new Date();
    var maxDate =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    birthDateInput.max = maxDate;
    compatDate1.max = maxDate;
    compatDate2.max = maxDate;
  }

  /**
   * Форматирует дату для отображения: 15.03.1990
   */
  function formatDate(birth) {
    return (
      String(birth.day).padStart(2, "0") +
      "." +
      String(birth.month).padStart(2, "0") +
      "." +
      birth.year
    );
  }

  /**
   * Показывает / скрывает подсказку об ошибке.
   */
  function showHint(element, message) {
    element.textContent = message;
    element.hidden = false;
  }

  function hideHint(element) {
    element.hidden = true;
    element.textContent = "";
  }

  /* ==========================================================
     ЛИЧНАЯ КАРТА
     ========================================================== */

  /**
   * Создаёт ячейку сетки для одного числа.
   */
  function createProfileCell(key, value) {
    var label = NUMBER_TYPE_LABELS[key] || key;
    var desc = Numerology.getNumberDescription(value);
    var title = desc ? desc.title : "";

    var cell = document.createElement("div");
    cell.className = "profile-cell";
    cell.innerHTML =
      '<span class="profile-cell__label">' + label + "</span>" +
      '<span class="profile-cell__number">' + value + "</span>" +
      '<span class="profile-cell__title">' + title + "</span>";

    return cell;
  }

  /**
   * Заполняет и показывает личную нумерологическую карту.
   */
  function displayPersonalCard(profile) {
    var lifePathDesc = Numerology.getNumberDescription(profile.lifePath);

    cardDateLabel.textContent = "Дата рождения: " + formatDate(profile.birthDate);

    cardLifePath.textContent = profile.lifePath;
    cardLifePath.className = "profile-hero__number";
    if (Numerology.isMasterNumber(profile.lifePath)) {
      cardLifePath.classList.add("profile-hero__number--master");
    }

    if (lifePathDesc) {
      cardLifePathTitle.textContent = lifePathDesc.title;
      cardLifePathDesc.textContent = lifePathDesc.description;
      cardTip.textContent = lifePathDesc.tip;
    }

    /* Заполняем сетку остальных чисел */
    profileGrid.innerHTML = "";
    PROFILE_KEYS.forEach(function (key) {
      profileGrid.appendChild(createProfileCell(key, profile[key]));
    });

    personalCardSection.hidden = false;
    personalCardSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /**
   * Скрывает карту и возвращает к форме.
   */
  function resetPersonalCard() {
    personalCardSection.hidden = true;
    hideHint(formHint);
    birthDateInput.focus();
    document.getElementById("calculator").scrollIntoView({ behavior: "smooth" });
  }

  /**
   * Обработчик формы расчёта.
   */
  function handleBirthSubmit(event) {
    event.preventDefault();
    hideHint(formHint);

    var dateValue = birthDateInput.value;

    if (!dateValue) {
      showHint(formHint, "Пожалуйста, введите дату рождения.");
      birthDateInput.focus();
      return;
    }

    var profile = Numerology.calculateProfile(dateValue);

    if (!profile) {
      showHint(formHint, "Не удалось обработать дату. Проверьте правильность ввода.");
      return;
    }

    displayPersonalCard(profile);
  }

  /* ==========================================================
     СОВМЕСТИМОСТЬ
     ========================================================== */

  /**
   * Показывает результат совместимости.
   */
  function displayCompatibility(result) {
    compatNum1.textContent = result.person1.lifePath;
    compatNum2.textContent = result.person2.lifePath;
    compatLabel1.textContent = result.person1.title;
    compatLabel2.textContent = result.person2.title;

    compatPercent.textContent = result.percent + "%";
    compatCircle.style.setProperty("--percent", result.percent);
    compatLevel.textContent = result.level ? result.level.label : "";

    compatStrengths.textContent = result.strengths;
    compatChallenges.textContent = result.challenges;

    compatResult.hidden = false;
    compatResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /**
   * Обработчик формы совместимости.
   */
  function handleCompatSubmit(event) {
    event.preventDefault();
    hideHint(compatHint);

    var date1 = compatDate1.value;
    var date2 = compatDate2.value;

    if (!date1 || !date2) {
      showHint(compatHint, "Введите обе даты рождения.");
      return;
    }

    var result = Numerology.calculateCompatibility(date1, date2);

    if (!result) {
      showHint(compatHint, "Не удалось обработать даты. Проверьте правильность ввода.");
      return;
    }

    displayCompatibility(result);
  }

  /* ==========================================================
     СПРАВОЧНИК ЧИСЕЛ
     ========================================================== */

  /**
   * Создаёт карточку числа для справочника.
   */
  function createNumberCard(number, data) {
    var isMaster = Numerology.isMasterNumber(number);
    var card = document.createElement("article");
    card.className = "number-card" + (isMaster ? " number-card--master" : "");

    var badgeHtml = isMaster
      ? '<span class="number-card__badge">мастер-число</span>'
      : "";

    card.innerHTML =
      '<div class="number-card__digit">' + number + "</div>" +
      badgeHtml +
      '<h3 class="number-card__title">' + data.title + "</h3>" +
      '<p class="number-card__text">' + data.description + "</p>";

    return card;
  }

  /**
   * Заполняет справочник чисел при загрузке страницы.
   */
  function renderNumbersReference() {
    if (typeof NUMBER_DESCRIPTIONS === "undefined") return;

    /* Порядок: 1–9, затем мастер-числа */
    var order = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

    order.forEach(function (num) {
      if (NUMBER_DESCRIPTIONS[num]) {
        numbersGrid.appendChild(createNumberCard(num, NUMBER_DESCRIPTIONS[num]));
      }
    });
  }

  /* ==========================================================
     ИНИЦИАЛИЗАЦИЯ
     ========================================================== */

  setMaxDates();
  renderNumbersReference();

  birthForm.addEventListener("submit", handleBirthSubmit);
  resetButton.addEventListener("click", resetPersonalCard);
  compatForm.addEventListener("submit", handleCompatSubmit);

  birthDateInput.addEventListener("input", function () { hideHint(formHint); });
  compatDate1.addEventListener("input", function () { hideHint(compatHint); });
  compatDate2.addEventListener("input", function () { hideHint(compatHint); });
})();
