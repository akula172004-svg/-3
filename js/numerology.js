/**
 * numerology.js
 * -------------
 * Модуль с логикой нумерологических расчётов.
 *
 * Сейчас здесь только «число жизненного пути».
 * В будущем можно добавить функции:
 *   - calculateSoulNumber()
 *   - calculateDestinyNumber()
 *   - calculateCompatibility(date1, date2)
 * и вынести общие утилиты в отдельный блок.
 */

const Numerology = (function () {
  "use strict";

  /**
   * Сводит число к одной цифре (1–9), складывая цифры повторно.
   *
   * Пример: 28 → 2+8 = 10 → 1+0 = 1
   *
   * @param {number} number — число для редукции
   * @returns {number} — одна цифра от 1 до 9
   */
  function reduceToSingleDigit(number) {
    // Пока число больше 9, продолжаем складывать его цифры
    while (number > 9) {
      number = sumDigits(number);
    }
    return number;
  }

  /**
   * Складывает все цифры числа.
   *
   * Пример: 1990 → 1+9+9+0 = 19
   *
   * @param {number} number
   * @returns {number}
   */
  function sumDigits(number) {
    return String(number)
      .split("")
      .reduce(function (total, digit) {
        return total + Number(digit);
      }, 0);
  }

  /**
   * Извлекает день, месяц и год из строки даты (формат YYYY-MM-DD).
   *
   * @param {string} dateString — значение из <input type="date">
   * @returns {{ day: number, month: number, year: number } | null}
   */
  function parseBirthDate(dateString) {
    if (!dateString) {
      return null;
    }

    var parts = dateString.split("-");

    if (parts.length !== 3) {
      return null;
    }

    var year = Number(parts[0]);
    var month = Number(parts[1]);
    var day = Number(parts[2]);

    // Простая проверка корректности
    if (!day || !month || !year || year < 1900) {
      return null;
    }

    return { day: day, month: month, year: year };
  }

  /**
   * Рассчитывает число жизненного пути по дате рождения.
   *
   * Алгоритм: складываем ВСЕ цифры дня, месяца и года,
   * затем сводим результат к одной цифре (1–9).
   *
   * Пример: 15.03.1990
   *   1+5+0+3+1+9+9+0 = 28 → 2+8 = 10 → 1+0 = 1
   *
   * @param {string} dateString — дата в формате YYYY-MM-DD
   * @returns {{ lifePathNumber: number, birthDate: object } | null}
   */
  function calculateLifePath(dateString) {
    var birthDate = parseBirthDate(dateString);

    if (!birthDate) {
      return null;
    }

    // Собираем все цифры даты в одну строку: "15031990"
    // padStart(2, "0") добавляет ведущий ноль для дней/месяцев < 10
    var allDigits =
      String(birthDate.day).padStart(2, "0") +
      String(birthDate.month).padStart(2, "0") +
      String(birthDate.year);

    // Складываем цифры и сводим к одной
    var sum = sumDigits(Number(allDigits));
    var lifePathNumber = reduceToSingleDigit(sum);

    return {
      lifePathNumber: lifePathNumber,
      birthDate: birthDate,
    };
  }

  /**
   * Возвращает описание для числа жизненного пути.
   * Данные берутся из отдельного файла lifePathData.js.
   *
   * @param {number} number — число от 1 до 9
   * @returns {{ title: string, description: string, tip: string } | null}
   */
  function getLifePathDescription(number) {
    if (typeof LIFE_PATH_DATA !== "undefined" && LIFE_PATH_DATA[number]) {
      return LIFE_PATH_DATA[number];
    }
    return null;
  }

  // Публичный API модуля — только то, что нужно снаружи
  return {
    calculateLifePath: calculateLifePath,
    getLifePathDescription: getLifePathDescription,
    // Утилиты можно экспортировать для тестов или других расчётов
    reduceToSingleDigit: reduceToSingleDigit,
    sumDigits: sumDigits,
  };
})();
