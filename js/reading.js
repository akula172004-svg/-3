/**
 * reading.js
 * ----------
 * Собирает полную нумерологическую расшифровку из данных и расчётов.
 */

const Reading = (function () {
  "use strict";

  var NUMBERS_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

  function getData(path, number) {
    if (typeof READING_DB === "undefined") return null;
    var parts = path.split(".");
    var node = READING_DB;
    for (var i = 0; i < parts.length; i++) {
      node = node[parts[i]];
      if (!node) return null;
    }
    return node[number] || null;
  }

  function getPeriodText(scope, number) {
    if (typeof PERIOD_TEXTS === "undefined" || !PERIOD_TEXTS[scope]) return null;
    return PERIOD_TEXTS[scope][number] || null;
  }

  function getDayEnergy(personalDay) {
    if (typeof DAY_ENERGY === "undefined") return null;
    return DAY_ENERGY[personalDay] || DAY_ENERGY[Numerology.reduceWithMasters(personalDay)];
  }

  /**
   * Личный год = жизненный путь + сумма цифр текущего года.
   */
  function calculatePersonalYear(lifePath, date) {
    var d = date || new Date();
    var yearSum = Numerology.sumDigits(d.getFullYear());
    return Numerology.reduceWithMasters(lifePath + yearSum);
  }

  /**
   * Личный месяц = личный год + номер месяца.
   */
  function calculatePersonalMonth(lifePath, date) {
    var d = date || new Date();
    var personalYear = calculatePersonalYear(lifePath, d);
    return Numerology.reduceWithMasters(personalYear + (d.getMonth() + 1));
  }

  /**
   * Собирает полную консультацию по дате рождения.
   */
  function buildFullReading(audience, profile, date) {
    var d = date || new Date();
    var lp = profile.lifePath;
    var personalDay = Numerology.calculatePersonalDay(lp, d);
    var personalMonth = calculatePersonalMonth(lp, d);
    var personalYear = calculatePersonalYear(lp, d);

    return {
      profile: profile,
      audience: audience,
      date: d,
      numbers: {
        lifePath: lp,
        soul: profile.soul,
        personality: profile.personality,
        birthday: profile.birthday,
        destiny: profile.destiny,
        personalDay: personalDay,
        personalMonth: personalMonth,
        personalYear: personalYear,
      },
      destiny: getData(audience + ".lifePath", lp),
      soul: getData(audience + ".soul", profile.soul),
      personality: getData(audience + ".personality", profile.personality),
      birthday: getData(audience + ".birthday", profile.birthday),
      karmic: getData(audience + ".karmic", lp),
      ancestral: getData(audience + ".ancestral", lp),
      dayEnergy: getDayEnergy(personalDay),
      period: {
        month: getPeriodText("month", personalMonth),
        year: getPeriodText("year", personalYear),
        monthNumber: personalMonth,
        yearNumber: personalYear,
        activeEnergy: getData(audience + ".lifePath", personalYear),
      },
      final: getData(audience + ".final", lp),
    };
  }

  return {
    buildFullReading: buildFullReading,
    calculatePersonalYear: calculatePersonalYear,
    calculatePersonalMonth: calculatePersonalMonth,
  };
})();
