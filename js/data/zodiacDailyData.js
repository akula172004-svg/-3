/**
 * zodiacDailyData.js — знаки зодиака и послания по числу дня.
 */

const ZODIAC_SIGNS = [
  { id: "aries",       name: "Овен",     image: "assets/zodiac/aries.png",       dates: "21 марта — 19 апреля" },
  { id: "taurus",      name: "Телец",    image: "assets/zodiac/taurus.png",      dates: "20 апреля — 20 мая" },
  { id: "gemini",      name: "Близнецы", image: "assets/zodiac/gemini.png",      dates: "21 мая — 20 июня" },
  { id: "cancer",      name: "Рак",      image: "assets/zodiac/cancer.png",      dates: "21 июня — 22 июля" },
  { id: "leo",         name: "Лев",      image: "assets/zodiac/leo.png",         dates: "23 июля — 22 августа" },
  { id: "virgo",       name: "Дева",     image: "assets/zodiac/virgo.png",       dates: "23 августа — 22 сентября" },
  { id: "libra",       name: "Весы",     image: "assets/zodiac/libra.png",       dates: "23 сентября — 22 октября" },
  { id: "scorpio",     name: "Скорпион", image: "assets/zodiac/scorpio.png",     dates: "23 октября — 21 ноября" },
  { id: "sagittarius", name: "Стрелец",  image: "assets/zodiac/sagittarius.png", dates: "22 ноября — 21 декабря" },
  { id: "capricorn",   name: "Козерог",  image: "assets/zodiac/capricorn.png",   dates: "22 декабря — 19 января" },
  { id: "aquarius",    name: "Водолей",  image: "assets/zodiac/aquarius.png",    dates: "20 января — 18 февраля" },
  { id: "pisces",      name: "Рыбы",     image: "assets/zodiac/pisces.png",      dates: "19 февраля — 20 марта" },
];

const DAILY_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

/** Короткая характеристика знака для послания дня */
const ZODIAC_TRAITS = {
  aries:       "Огненная энергия Овна сегодня ищет действия и смелого шага вперёд.",
  taurus:      "Телец чувствует день через стабильность, комфорт и верность своим ценностям.",
  gemini:      "Близнецы ловят ритм дня в общении, идеях и лёгкой смене впечатлений.",
  cancer:      "Рак особенно восприимчив к настроению близких и тихой заботе о доме.",
  leo:         "Лев раскрывается, когда день даёт сцену для тепла, щедрости и признания.",
  virgo:       "Дева считывает день через порядок, детали и практическую пользу каждого шага.",
  libra:      "Весы ищут гармонию — в отношениях, решениях и красоте повседневных мелочей.",
  scorpio:     "Скорпион проживает день глубоко: интуиция и внутренняя сила ведут его точнее логики.",
  sagittarius: "Стрелец тянется к горизонту — путешествиям, смыслу и новым возможностям.",
  capricorn:   "Козерог строит день на дисциплине, цели и зрелом отношении к делу.",
  aquarius:    "Водолей чувствует день через свободу мысли, необычные идеи и своё видение.",
  pisces:      "Рыбы впитывают атмосферу дня тонко — через чувства, творчество и мечту.",
};

/**
 * Собрать послание дня для знака и выбранного числа.
 */
function buildZodiacDayMessage(signId, dayNumber) {
  var sign = ZODIAC_SIGNS.find(function (s) { return s.id === signId; });
  if (!sign) return null;

  var energy = DAY_ENERGY[dayNumber];
  if (!energy && typeof Numerology !== "undefined") {
    energy = DAY_ENERGY[Numerology.reduceWithMasters(dayNumber)];
  }
  if (!energy) return null;

  var trait = ZODIAC_TRAITS[signId] || "";
  var today = new Date();
  var months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];

  return {
    signName: sign.name,
    signImage: sign.image,
    signDates: sign.dates,
    dayNumber: dayNumber,
    dateLabel: today.getDate() + " " + months[today.getMonth()] + " " + today.getFullYear(),
    mood: energy.mood,
    text: trait + " Число дня " + dayNumber + " говорит: " + energy.advice,
    doToday: "Сегодня для " + sign.name + ": " + energy.doToday,
    avoidToday: energy.avoidToday,
    favorable: energy.favorable,
  };
}
