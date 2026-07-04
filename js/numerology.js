/**
 * numerology.js
 * -------------
 * Модуль нумерологических расчётов.
 *
 * Все формулы основаны на дате рождения (ДД.ММ.ГГГГ).
 * Мастер-числа 11, 22 и 33 не сокращаются до одной цифры.
 *
 * Формулы (по компонентам даты):
 *   Жизненный путь — все цифры даты
 *   Душа           — цифры месяца (внутренний мир)
 *   Судьба         — цифры года (жизненная миссия)
 *   Личность       — цифры дня и месяца (как вас видят другие)
 *   День рождения  — цифры дня (дар дня рождения)
 */

const Numerology = (function () {
  "use strict";

  /** Мастер-числа, которые нельзя сокращать */
  var MASTER_NUMBERS = [11, 22, 33];

  /**
   * Проверяет, является ли число мастер-числом.
   */
  function isMasterNumber(number) {
    return MASTER_NUMBERS.indexOf(number) !== -1;
  }

  /**
   * Складывает все цифры числа.
   * Пример: 1990 → 1+9+9+0 = 19
   */
  function sumDigits(number) {
    return String(number)
      .split("")
      .reduce(function (total, digit) {
        return total + Number(digit);
      }, 0);
  }

  /**
   * Сводит число к одной цифре (1–9) или мастер-числу (11, 22, 33).
   * Мастер-числа сохраняются и не сокращаются дальше.
   */
  function reduceWithMasters(number) {
    while (number > 9 && !isMasterNumber(number)) {
      number = sumDigits(number);
    }
    return number;
  }

  /**
   * Суммирует цифры строки (например, "1503" → 9).
   */
  function sumDigitsString(str) {
    return reduceWithMasters(
      str.split("").reduce(function (total, ch) {
        return total + Number(ch);
      }, 0)
    );
  }

  /**
   * Разбирает строку даты YYYY-MM-DD на компоненты.
   */
  function parseBirthDate(dateString) {
    if (!dateString) return null;

    var parts = dateString.split("-");
    if (parts.length !== 3) return null;

    var year = Number(parts[0]);
    var month = Number(parts[1]);
    var day = Number(parts[2]);

    if (!day || !month || !year || year < 1900) return null;

    return {
      day: day,
      month: month,
      year: year,
      dayStr: String(day).padStart(2, "0"),
      monthStr: String(month).padStart(2, "0"),
      yearStr: String(year),
    };
  }

  /**
   * Рассчитывает полный нумерологический профиль по дате рождения.
   *
   * @returns {object|null} — все пять чисел + дата
   */
  function calculateProfile(dateString) {
    var birth = parseBirthDate(dateString);
    if (!birth) return null;

    var fullDateStr = birth.dayStr + birth.monthStr + birth.yearStr;

    return {
      birthDate: birth,
      lifePath: sumDigitsString(fullDateStr),
      soul: sumDigitsString(birth.monthStr),
      destiny: sumDigitsString(birth.yearStr),
      personality: sumDigitsString(birth.dayStr + birth.monthStr),
      birthday: sumDigitsString(birth.dayStr),
    };
  }

  /**
   * Возвращает описание числа из словаря numberDescriptions.js.
   */
  function getNumberDescription(number) {
    if (typeof NUMBER_DESCRIPTIONS !== "undefined" && NUMBER_DESCRIPTIONS[number]) {
      return NUMBER_DESCRIPTIONS[number];
    }
    return null;
  }

  /**
   * Проверяет гармоничность пары чисел жизненного пути.
   */
  function isHarmoniousPair(n1, n2) {
    if (typeof HARMONY_PAIRS === "undefined") return false;

    var list1 = HARMONY_PAIRS[n1] || [];
    var list2 = HARMONY_PAIRS[n2] || [];

    return list1.indexOf(n2) !== -1 || list2.indexOf(n1) !== -1;
  }

  /**
   * Для сравнения мастер-чисел получаем «базовое» значение.
   */
  function getBaseValue(number) {
    if (number === 11) return 2;
    if (number === 22) return 4;
    if (number === 33) return 6;
    return number;
  }

  /**
   * Рассчитывает процент совместимости по числам жизненного пути.
   */
  function calculateCompatibilityPercent(lifePath1, lifePath2) {
    if (lifePath1 === lifePath2) return 93;

    if (isHarmoniousPair(lifePath1, lifePath2)) return 84;

    /* Дополняющие пары: 1–9, 2–8, 3–7, 4–6 */
    var complement = 11 - getBaseValue(lifePath1);
    if (getBaseValue(lifePath2) === complement) return 77;

    var diff = Math.abs(getBaseValue(lifePath1) - getBaseValue(lifePath2));

    if (diff <= 1) return 70;
    if (diff <= 2) return 62;
    if (diff <= 4) return 52;
    return 41;
  }

  /**
   * Возвращает текстовый уровень совместимости по проценту.
   */
  function getCompatibilityLevel(percent) {
    if (typeof COMPATIBILITY_LEVELS === "undefined") return null;

    if (percent >= COMPATIBILITY_LEVELS.high.min) return COMPATIBILITY_LEVELS.high;
    if (percent >= COMPATIBILITY_LEVELS.good.min) return COMPATIBILITY_LEVELS.good;
    if (percent >= COMPATIBILITY_LEVELS.medium.min) return COMPATIBILITY_LEVELS.medium;
    return COMPATIBILITY_LEVELS.low;
  }

  /**
   * Полный расчёт совместимости по двум датам рождения.
   */
  function calculateCompatibility(date1, date2) {
    var profile1 = calculateProfile(date1);
    var profile2 = calculateProfile(date2);

    if (!profile1 || !profile2) return null;

    var lp1 = profile1.lifePath;
    var lp2 = profile2.lifePath;
    var percent = calculateCompatibilityPercent(lp1, lp2);
    var level = getCompatibilityLevel(percent);

    var desc1 = getNumberDescription(lp1);
    var desc2 = getNumberDescription(lp2);

    return {
      percent: percent,
      level: level,
      person1: { lifePath: lp1, title: desc1 ? desc1.title : "" },
      person2: { lifePath: lp2, title: desc2 ? desc2.title : "" },
      strengths: level ? level.strengths : "",
      challenges: level ? level.challenges : "",
    };
  }

  /* Публичный API */
  return {
    calculateProfile: calculateProfile,
    calculateCompatibility: calculateCompatibility,
    getNumberDescription: getNumberDescription,
    reduceWithMasters: reduceWithMasters,
    sumDigits: sumDigits,
    isMasterNumber: isMasterNumber,
  };
})();
