/**

 * main.js

 * -------

 * Интерфейс виртуального нумеролога «Тайна чисел».

 *

 * Поток:

 *   1. Выбор типа анализа (быстрый / полная карта / глубокий)

 *   2. Анкета с именем, датой, полом

 *   3. Consultation.build() → карта по выбранному типу

 *   4. Родовая программа — отдельная кнопка (только глубокий анализ)

 */



(function () {

  "use strict";



  var currentConsultation = null;

  var selectedAnalysis = null;



  var heroChoice = document.getElementById("hero-choice");

  var heroForm = document.getElementById("hero-form");

  var analysisLabel = document.getElementById("analysis-label");

  var analysisCards = document.querySelectorAll(".analysis-card");

  var startCalcBtn = document.getElementById("start-calc-btn");

  var backToChoiceBtn = document.getElementById("back-to-choice");



  var clientForm = document.getElementById("client-form");

  var firstNameInput = document.getElementById("first-name");

  var lastNameInput = document.getElementById("last-name");

  var birthDateInput = document.getElementById("birth-date");

  var birthCityInput = document.getElementById("birth-city");

  var formHint = document.getElementById("form-hint");



  var personalCardSection = document.getElementById("personal-card");

  var profileCard = document.getElementById("profile-card");

  var cardTitle = document.getElementById("card-title");

  var cardDateLabel = document.getElementById("card-date-label");

  var consultNav = document.getElementById("consult-nav");

  var consultContent = document.getElementById("consult-content");

  var ancestralButton = document.getElementById("ancestral-button");

  var ancestralSection = document.getElementById("ancestral-section");

  var ancestralContent = document.getElementById("ancestral-content");

  var resetButton = document.getElementById("reset-button");

  var copyButton = document.getElementById("copy-button");

  var copyToast = document.getElementById("copy-toast");



  var messageDayDate = document.getElementById("message-day-date");

  var messageDayText = document.getElementById("message-day-text");



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



  var numbersGrid = document.getElementById("numbers-grid");



  function setMaxDates() {

    var today = new Date();

    var max =

      today.getFullYear() + "-" +

      String(today.getMonth() + 1).padStart(2, "0") + "-" +

      String(today.getDate()).padStart(2, "0");

    birthDateInput.max = max;

    compatDate1.max = max;

    compatDate2.max = max;

  }



  function showHint(el, msg) { el.textContent = msg; el.hidden = false; }

  function hideHint(el) { el.hidden = true; el.textContent = ""; }



  function getFormData() {

    var genderEl = clientForm.querySelector('input[name="gender"]:checked');

    return {

      firstName: firstNameInput.value.trim(),

      lastName: lastNameInput.value.trim(),

      birthDate: birthDateInput.value,

      gender: genderEl ? genderEl.value : "female",

      birthCity: birthCityInput.value.trim(),

    };

  }



  /** Выбор типа анализа на главном экране */

  function selectAnalysis(typeId) {

    selectedAnalysis = typeId;

    var type = Consultation.getAnalysisType(typeId);



    analysisCards.forEach(function (card) {

      var isActive = card.dataset.analysis === typeId;

      card.classList.toggle("is-selected", isActive);

      card.setAttribute("aria-selected", isActive ? "true" : "false");

    });



    startCalcBtn.disabled = false;

    startCalcBtn.textContent = "Начать расчёт — " + type.title;

  }



  /** Переход от выбора анализа к анкете (экран 2) */
  function showFormStep() {
    if (!selectedAnalysis) return;

    var type = Consultation.getAnalysisType(selectedAnalysis);
    analysisLabel.textContent = "✦ " + type.title + " — " + type.desc;

    openFormSection();
    hideHint(formHint);
    firstNameInput.focus();
  }

  /** Открыть анкету (меню «Расчёт» или якорь #hero-form) */
  function openFormSection() {
    heroForm.hidden = false;
    heroForm.classList.add("is-visible");

    requestAnimationFrame(function () {
      var nav = document.querySelector(".nav");
      var navHeight = nav ? nav.offsetHeight : 48;
      var gap = 70;
      var target = heroForm.querySelector(".form-screen__inner") || heroForm;
      var y = target.getBoundingClientRect().top + window.pageYOffset - navHeight - gap;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    });
  }

  /** Возврат к обложке (экран 1) */
  function showChoiceStep() {
    heroForm.hidden = true;
    heroForm.classList.remove("is-visible");
    hideHint(formHint);
    if (window.AppSections) {
      AppSections.showHero();
    } else {
      document.getElementById("hero").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }



  function renderDailyMessage() {

    var today = new Date();

    var months = [

      "января", "февраля", "марта", "апреля", "мая", "июня",

      "июля", "августа", "сентября", "октября", "ноября", "декабря",

    ];

    messageDayDate.textContent = today.getDate() + " " + months[today.getMonth()] + " " + today.getFullYear();

    messageDayText.textContent = Numerology.getDailyMessage(today);

  }



  function displayConsultation(consultation) {

    currentConsultation = consultation;



    cardTitle.textContent = "Карта " + consultation.client.firstName;



    RenderConsultation.render(consultation, {

      navContainer: consultNav,

      contentContainer: consultContent,

      headerLabel: cardDateLabel,

      ancestralBtn: ancestralButton,

      ancestralSection: ancestralSection,

      ancestralContainer: ancestralContent,

    });



    personalCardSection.hidden = false;

    profileCard.classList.remove("is-visible");

    void profileCard.offsetWidth;

    profileCard.classList.add("is-visible");



    copyToast.hidden = true;

    personalCardSection.scrollIntoView({ behavior: "smooth", block: "start" });

  }



  function handleFormSubmit(event) {

    event.preventDefault();

    hideHint(formHint);



    if (!selectedAnalysis) {

      showHint(formHint, "Сначала выберите тип анализа.");

      showChoiceStep();

      return;

    }



    var data = getFormData();



    if (!data.firstName) {

      showHint(formHint, "Пожалуйста, введите имя.");

      firstNameInput.focus();

      return;

    }



    if (!data.birthDate) {

      showHint(formHint, "Пожалуйста, укажите дату рождения.");

      birthDateInput.focus();

      return;

    }



    var client = Consultation.buildClient(data);

    if (!client) {

      showHint(formHint, "Не удалось обработать дату. Проверьте правильность ввода.");

      return;

    }



    var consultation = Consultation.build(client, new Date(), selectedAnalysis);

    displayConsultation(consultation);

  }



  function resetConsultation() {

    personalCardSection.hidden = true;

    profileCard.classList.remove("is-visible");

    consultNav.innerHTML = "";

    consultContent.innerHTML = "";

    ancestralContent.innerHTML = "";

    ancestralSection.hidden = true;

    ancestralButton.hidden = false;

    currentConsultation = null;

    hideHint(formHint);

    clientForm.reset();

    document.querySelector('input[name="gender"][value="female"]').checked = true;

    showChoiceStep();

    document.getElementById("hero").scrollIntoView({ behavior: "smooth" });

  }



  /** Плавающая кнопка «Финансовый потенциал» — переход в sections.js */

  function handleCopy() {

    if (!currentConsultation) return;

    var text = RenderConsultation.buildCopyText(currentConsultation);



    if (navigator.clipboard && navigator.clipboard.writeText) {

      navigator.clipboard.writeText(text).then(showCopyToast).catch(function () {

        fallbackCopy(text);

      });

    } else {

      fallbackCopy(text);

    }

  }



  function fallbackCopy(text) {

    var area = document.createElement("textarea");

    area.value = text;

    area.style.position = "fixed";

    area.style.left = "-9999px";

    document.body.appendChild(area);

    area.select();

    try {

      document.execCommand("copy");

      showCopyToast();

    } catch (e) {

      showHint(formHint, "Не удалось скопировать.");

    }

    document.body.removeChild(area);

  }



  function showCopyToast() {

    copyToast.hidden = false;

    setTimeout(function () { copyToast.hidden = true; }, 2500);

  }



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

      showHint(compatHint, "Не удалось обработать даты.");

      return;

    }



    displayCompatibility(result);

  }



  function createNumberCard(number, data) {

    var isMaster = Numerology.isMasterNumber(number);

    var card = document.createElement("article");

    card.className = "number-card" + (isMaster ? " number-card--master" : "");

    var badge = isMaster ? '<span class="number-card__badge">мастер-число</span>' : "";

    card.innerHTML =

      '<div class="number-card__digit">' + number + "</div>" +

      badge +

      '<h3 class="number-card__title">' + data.title + "</h3>" +

      '<p class="number-card__text">' + data.description + "</p>";

    return card;

  }



  function renderNumbersReference() {

    if (typeof NUMBER_DESCRIPTIONS === "undefined") return;

    [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].forEach(function (num) {

      if (NUMBER_DESCRIPTIONS[num]) {

        numbersGrid.appendChild(createNumberCard(num, NUMBER_DESCRIPTIONS[num]));

      }

    });

  }



  setMaxDates();

  renderDailyMessage();

  renderNumbersReference();



  analysisCards.forEach(function (card) {

    card.addEventListener("click", function () {

      var typeId = card.dataset.analysis;

      selectAnalysis(typeId);

      if (window.AppSections) {
        AppSections.openAnalysisSection(typeId);
      }

    });

  });



  startCalcBtn.addEventListener("click", showFormStep);

  backToChoiceBtn.addEventListener("click", showChoiceStep);

  clientForm.addEventListener("submit", handleFormSubmit);

  resetButton.addEventListener("click", resetConsultation);

  copyButton.addEventListener("click", handleCopy);

  compatForm.addEventListener("submit", handleCompatSubmit);

  if (window.AppSections) {
    AppSections.bindNavigation();
  }

  clientForm.addEventListener("input", function () { hideHint(formHint); });

  compatDate1.addEventListener("input", function () { hideHint(compatHint); });

  compatDate2.addEventListener("input", function () { hideHint(compatHint); });

  document.querySelectorAll('a[href="#hero-form"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      openFormSection();
      history.pushState(null, "", "#hero-form");
    });
  });

  if (location.hash === "#hero-form") {
    openFormSection();
  } else if (window.AppSections) {
    AppSections.initFromHash();
  }

  window.NumerologyApp = {
    runAnalysis: function (formData, typeId) {
      var client = Consultation.buildClient(formData);
      if (!client) {
        return { ok: false, message: "Не удалось обработать дату. Проверьте правильность ввода." };
      }

      var consultation = Consultation.build(client, new Date(), typeId);
      displayConsultation(consultation);

      if (window.AppSections) {
        AppSections.hideForResult();
      }

      return { ok: true };
    },
  };

  window.addEventListener("hashchange", function () {
    if (location.hash === "#hero-form") openFormSection();
  });
})();

