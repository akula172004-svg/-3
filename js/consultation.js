/**
 * consultation.js
 * ---------------
 * Сборщик полной нумерологической консультации.
 *
 * Архитектура (для расширения):
 *   1. ClientProfile — данные анкеты + расчёты
 *   2. Consultation.SECTION_ORDER — порядок разделов на экране
 *   3. Consultation.build() — собирает объект консультации
 *   4. CONSULTATION_BUILDERS — тексты разделов (consultationTexts.js)
 *   5. RenderConsultation — отображение (renderConsultation.js)
 *
 * Чтобы добавить раздел: создайте builder в consultationTexts.js,
 * добавьте ключ в SECTION_ORDER и renderSection в renderConsultation.js.
 */

const Consultation = (function () {
  "use strict";

  /** Порядок всех разделов карты */
  var SECTION_ORDER = [
    "portrait",
    "lifePeriods",
    "yearEnergy",
    "forecast",
    "love",
    "money",
    "purpose",
  ];

  /** Типы анализа — пользователь выбирает на главном экране */
  var ANALYSIS_TYPES = {
    quick: {
      id: "quick",
      title: "Быстрый анализ",
      desc: "Краткий портрет по дате рождения",
      icon: "⚡",
      sections: ["portrait"],
      briefPortrait: true,
      showAncestral: false,
    },
    full: {
      id: "full",
      title: "Полная карта",
      desc: "Подробная расшифровка всех чисел",
      icon: "✦",
      sections: ["portrait", "yearEnergy", "forecast"],
      briefPortrait: false,
      showAncestral: false,
    },
    deep: {
      id: "deep",
      title: "Глубокий анализ",
      desc: "Судьба, периоды, прогнозы и родовая программа",
      icon: "☽",
      sections: ["portrait", "lifePeriods", "yearEnergy", "forecast", "love", "money", "purpose"],
      briefPortrait: false,
      showAncestral: true,
    },
  };

  function getAnalysisType(typeId) {
    return ANALYSIS_TYPES[typeId] || ANALYSIS_TYPES.full;
  }

  function getSectionOrder(typeId) {
    var t = getAnalysisType(typeId);
    return t.sections;
  }

  var LIFE_STAGES = [
    { key: "childhood", maxAge: 12 },
    { key: "youth", maxAge: 25 },
    { key: "maturity", maxAge: 55 },
    { key: "wisdom", maxAge: Infinity },
  ];

  var GENDER_MAP = {
    female: "woman",
    male: "man",
  };

  function getArchetype(number) {
    return NUMBER_ARCHETYPES[number] || NUMBER_ARCHETYPES[Numerology.reduceWithMasters(number)];
  }

  function getBuilder(section, number) {
    if (typeof CONSULTATION_BUILDERS === "undefined") return null;
    var builders = CONSULTATION_BUILDERS[section];
    if (!builders) return null;
    var fn = builders[number];
    if (!fn) fn = builders[Numerology.reduceWithMasters(number)];
    return fn || null;
  }

  function getReadingData(path, number) {
    if (typeof READING_DB === "undefined") return null;
    var parts = path.split(".");
    var node = READING_DB;
    for (var i = 0; i < parts.length; i++) {
      node = node[parts[i]];
      if (!node) return null;
    }
    return node[number] || null;
  }

  function calculateAge(birthDate, at) {
    var d = at || new Date();
    var age = d.getFullYear() - birthDate.year;
    var m = d.getMonth() + 1 - birthDate.month;
    if (m < 0 || (m === 0 && d.getDate() < birthDate.day)) age--;
    return age;
  }

  function getLifeStage(age) {
    for (var i = 0; i < LIFE_STAGES.length; i++) {
      if (age <= LIFE_STAGES[i].maxAge) return LIFE_STAGES[i].key;
    }
    return "wisdom";
  }

  function calculatePersonalYear(lifePath, date) {
    var d = date || new Date();
    return Numerology.reduceWithMasters(lifePath + Numerology.sumDigits(d.getFullYear()));
  }

  function calculatePersonalMonth(lifePath, date) {
    var d = date || new Date();
    return Numerology.reduceWithMasters(calculatePersonalYear(lifePath, d) + (d.getMonth() + 1));
  }

  function collectMasterNumbers(profile) {
    var keys = ["lifePath", "soul", "destiny", "personality", "birthday"];
    var masters = [];
    keys.forEach(function (key) {
      var n = profile[key];
      if (Numerology.isMasterNumber(n) && masters.indexOf(n) === -1) {
        masters.push(n);
      }
    });
    return masters;
  }

  /**
   * Создаёт профиль клиента из анкеты.
   */
  function buildClient(formData) {
    var gender = formData.gender || "female";
    var audience = GENDER_MAP[gender] || "woman";
    var profile = Numerology.calculateProfile(formData.birthDate);

    if (!profile) return null;

    var firstName = (formData.firstName || "").trim();
    var lastName = (formData.lastName || "").trim();
    var birthCity = (formData.birthCity || "").trim();
    var age = calculateAge(profile.birthDate);
    var lifeStage = getLifeStage(age);

    return {
      firstName: firstName,
      lastName: lastName,
      displayName: firstName + (lastName ? " " + lastName : ""),
      birthCity: birthCity,
      gender: gender,
      audience: audience,
      birthDate: formData.birthDate,
      profile: profile,
      age: age,
      lifeStage: lifeStage,
      masterNumbers: collectMasterNumbers(profile),
    };
  }

  function invokeBuilder(section, client, number) {
    var fn = getBuilder(section, number);
    var p = getArchetype(number);
    if (!fn || !p) return null;
    if (section === "lifePeriods") {
      return fn(client.audience, number, p, client.age, client.lifeStage);
    }
    return fn(client.audience, number, p, client);
  }

  /**
   * Собирает полную консультацию.
   */
  function build(client, date, analysisType) {
    var d = date || new Date();
    var type = getAnalysisType(analysisType);
    var profile = client.profile;
    var lp = profile.lifePath;
    var personalYear = calculatePersonalYear(lp, d);
    var personalMonth = calculatePersonalMonth(lp, d);
    var personalDay = Numerology.calculatePersonalDay(lp, d);

    var dayEnergy = typeof DAY_ENERGY !== "undefined"
      ? (DAY_ENERGY[personalDay] || DAY_ENERGY[Numerology.reduceWithMasters(personalDay)])
      : null;

    var monthText = typeof PERIOD_TEXTS !== "undefined" && PERIOD_TEXTS.month
      ? PERIOD_TEXTS.month[personalMonth]
      : null;

    var yearText = typeof PERIOD_TEXTS !== "undefined" && PERIOD_TEXTS.year
      ? PERIOD_TEXTS.year[personalYear]
      : null;

    return {
      client: client,
      date: d,
      analysisType: type.id,
      analysisMeta: type,
      numbers: {
        lifePath: lp,
        soul: profile.soul,
        personality: profile.personality,
        destiny: profile.destiny,
        birthday: profile.birthday,
        personalDay: personalDay,
        personalMonth: personalMonth,
        personalYear: personalYear,
      },
      sections: {
        portrait: (function () {
          var data = invokeBuilder("portrait", client, lp);
          if (data) {
            data.numbers = {
              lifePath: lp,
              soul: profile.soul,
              personality: profile.personality,
              destiny: profile.destiny,
              birthday: profile.birthday,
            };
            data.masterNumbers = client.masterNumbers;
          }
          return data;
        })(),
        lifePeriods: invokeBuilder("lifePeriods", client, lp),
        yearEnergy: invokeBuilder("yearEnergy", client, personalYear),
        forecast: {
          day: dayEnergy,
          dayNumber: personalDay,
          month: monthText,
          monthNumber: personalMonth,
          year: yearText,
          yearNumber: personalYear,
        },
        love: invokeBuilder("love", client, lp),
        money: invokeBuilder("money", client, lp),
        purpose: invokeBuilder("purpose", client, lp),
      },
      ancestral: invokeBuilder("ancestral", client, lp),
    };
  }

  return {
    SECTION_ORDER: SECTION_ORDER,
    ANALYSIS_TYPES: ANALYSIS_TYPES,
    getAnalysisType: getAnalysisType,
    getSectionOrder: getSectionOrder,
    buildClient: buildClient,
    build: build,
    calculatePersonalYear: calculatePersonalYear,
    calculatePersonalMonth: calculatePersonalMonth,
    getLifeStage: getLifeStage,
  };
})();
