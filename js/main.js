/**
 * main.js
 * -------
 * Связывает интерфейс (HTML) с логикой расчётов (numerology.js).
 *
 * Здесь только работа с DOM и событиями.
 * Все формулы — в numerology.js, все тексты — в lifePathData.js.
 */

(function () {
  "use strict";

  // --- Элементы страницы ---
  var form = document.getElementById("birth-form");
  var dateInput = document.getElementById("birth-date");
  var formHint = document.getElementById("form-hint");
  var formSection = document.getElementById("form-section");
  var resultSection = document.getElementById("result-section");
  var resetButton = document.getElementById("reset-button");

  // Элементы результата
  var numberEl = document.getElementById("life-path-number");
  var titleEl = document.getElementById("life-path-title");
  var descriptionEl = document.getElementById("life-path-description");
  var tipEl = document.getElementById("life-path-tip");

  /**
   * Устанавливает максимальную дату — сегодня (нельзя выбрать будущее).
   */
  function setMaxDate() {
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, "0");
    var day = String(today.getDate()).padStart(2, "0");
    dateInput.max = year + "-" + month + "-" + day;
  }

  /**
   * Показывает сообщение об ошибке под полем ввода.
   */
  function showError(message) {
    formHint.textContent = message;
    formHint.hidden = false;
  }

  /**
   * Скрывает сообщение об ошибке.
   */
  function hideError() {
    formHint.hidden = true;
    formHint.textContent = "";
  }

  /**
   * Заполняет блок результата данными.
   */
  function displayResult(lifePathNumber, description) {
    numberEl.textContent = lifePathNumber;
    titleEl.textContent = description.title;
    descriptionEl.textContent = description.description;
    tipEl.textContent = description.tip;

    // Показываем результат, скрываем форму
    formSection.hidden = true;
    resultSection.hidden = false;

    // Плавно прокручиваем к результату на мобильных
    resultSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /**
   * Возвращает пользователя к форме ввода.
   */
  function resetForm() {
    resultSection.hidden = true;
    formSection.hidden = false;
    hideError();
    dateInput.focus();
  }

  /**
   * Обработчик отправки формы.
   */
  function handleSubmit(event) {
    event.preventDefault();
    hideError();

    var dateValue = dateInput.value;

    if (!dateValue) {
      showError("Пожалуйста, введите дату рождения.");
      dateInput.focus();
      return;
    }

    // Расчёт через модуль Numerology
    var result = Numerology.calculateLifePath(dateValue);

    if (!result) {
      showError("Не удалось обработать дату. Проверьте правильность ввода.");
      return;
    }

    var description = Numerology.getLifePathDescription(result.lifePathNumber);

    if (!description) {
      showError("Описание для этого числа пока не найдено.");
      return;
    }

    displayResult(result.lifePathNumber, description);
  }

  // --- Инициализация ---
  setMaxDate();
  form.addEventListener("submit", handleSubmit);
  resetButton.addEventListener("click", resetForm);

  // Скрываем ошибку при новом вводе
  dateInput.addEventListener("input", hideError);
})();
