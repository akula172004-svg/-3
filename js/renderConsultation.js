/**
 * renderConsultation.js
 * ---------------------
 * Отображение разделов нумерологической консультации.
 *
 * Каждый раздел — отдельная функция render* для удобного расширения.
 */

const RenderConsultation = (function () {
  "use strict";

  var SECTION_META = {
    portrait: { icon: "✦", title: "Основной портрет" },
    lifePeriods: { icon: "☽", title: "Жизненные периоды" },
    yearEnergy: { icon: "⟡", title: "Энергия текущего года" },
    forecast: { icon: "☀", title: "Прогноз" },
    love: { icon: "♡", title: "Любовь" },
    money: { icon: "◇", title: "Деньги" },
    purpose: { icon: "✧", title: "Предназначение" },
    ancestral: { icon: "🌿", title: "Родовая энергия" },
  };

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function p(text, className) {
    var node = el("p", "consult__p" + (className ? " " + className : ""));
    node.textContent = text;
    return node;
  }

  function sub(heading, text) {
    var wrap = el("div", "consult__sub");
    wrap.appendChild(el("h4", "consult__sub-title", heading));
    wrap.appendChild(p(text));
    return wrap;
  }

  function numberBadge(num) {
    var isMaster = Numerology.isMasterNumber(num);
    return el(
      "span",
      "consult__num" + (isMaster ? " consult__num--master" : ""),
      String(num)
    );
  }

  function sectionShell(id, icon, title, subtitle) {
    var section = el("section", "consult__section");
    section.id = "consult-" + id;

    var head = el("header", "consult__section-head");
    head.appendChild(el("span", "consult__section-icon", icon));
    var hgroup = el("div", "consult__section-hgroup");
    hgroup.appendChild(el("h3", "consult__section-title", title));
    if (subtitle) hgroup.appendChild(el("p", "consult__section-sub", subtitle));
    head.appendChild(hgroup);
    section.appendChild(head);

    var body = el("div", "consult__section-body");
    section.appendChild(body);
    return { section: section, body: body };
  }

  function renderNav(container, order) {
    container.innerHTML = "";
    var nav = el("nav", "consult__nav");
    nav.setAttribute("aria-label", "Разделы карты");

    order.forEach(function (key) {
      var meta = SECTION_META[key];
      if (!meta) return;
      var link = el("a", "consult__nav-link", meta.title);
      link.href = "#consult-" + key;
      nav.appendChild(link);
    });

    container.appendChild(nav);
  }

  function renderPortrait(body, data, brief) {
    if (!data) return;
    body.appendChild(p(data.intro, "consult__p--lead"));

    var grid = el("div", "consult__nums-grid");
    var labels = {
      lifePath: "Жизненный путь",
      soul: "Душа",
      personality: "Личность",
      destiny: "Судьба",
      birthday: "День рождения",
    };
    Object.keys(labels).forEach(function (key) {
      var cell = el("div", "consult__nums-cell");
      cell.appendChild(el("span", "consult__nums-label", labels[key]));
      cell.appendChild(numberBadge(data.numbers[key]));
      grid.appendChild(cell);
    });
    body.appendChild(grid);

    if (!brief && data.masterNumbers && data.masterNumbers.length) {
      var masterBox = el("div", "consult__highlight consult__highlight--master");
      masterBox.appendChild(el("h4", "consult__highlight-title", "Мастер-числа"));
      var masterText = "В вашей карте присутствуют мастер-числа: " +
        data.masterNumbers.join(", ") + ". Они не сокращаются — это усиленная вибрация с особым потенциалом.";
      masterBox.appendChild(p(masterText));
      if (data.masterNote) masterBox.appendChild(p(data.masterNote));
      body.appendChild(masterBox);
    }

    if (!brief) {
      body.appendChild(sub("Число жизненного пути — " + data.lifePath.title, data.lifePath.text));
      body.appendChild(sub("Число души", data.soul.text));
      body.appendChild(sub("Число личности", data.personality.text));
      body.appendChild(sub("Число судьбы", data.destiny.text));
      body.appendChild(sub("Число дня рождения", data.birthday.text));
    }

    body.appendChild(sub("Главные сильные стороны", data.strengths));
    body.appendChild(sub("Возможные слабые стороны", data.weaknesses));
    body.appendChild(sub("Основные жизненные задачи", data.lifeTasks));
  }

  function renderLifePeriods(body, data) {
    if (!data) return;
    ["childhood", "youth", "maturity", "wisdom"].forEach(function (key) {
      if (data[key]) body.appendChild(sub(data[key].title, data[key].text));
    });
    if (data.currentStage) {
      var cur = el("div", "consult__highlight");
      cur.appendChild(el("h4", "consult__highlight-title", data.currentStage.title));
      cur.appendChild(p(data.currentStage.text));
      body.appendChild(cur);
    }
    body.appendChild(sub("Активные энергии сейчас", data.activeEnergies));
  }

  function renderYearEnergy(body, data, numbers) {
    if (!data) return;
    var badge = el("div", "consult__year-badge");
    badge.appendChild(el("span", "consult__year-label", "Личный год"));
    badge.appendChild(numberBadge(data.personalYear || numbers.personalYear));
    body.appendChild(badge);
    body.appendChild(sub("Главная тема года", data.theme));
    body.appendChild(sub("На что обратить внимание", data.attention));
    body.appendChild(sub("Что лучше начинать", data.start));
    body.appendChild(sub("Что лучше завершать", data.finish));
  }

  function renderForecast(body, data, dateStr) {
    if (!data) return;

    if (data.day) {
      var dayBlock = el("div", "consult__forecast-card consult__forecast-card--day");
      dayBlock.appendChild(el("h4", "consult__forecast-title", "Сегодня, " + dateStr));
      var dayMeta = el("div", "consult__forecast-meta");
      dayMeta.appendChild(el("span", "consult__forecast-num", "Число дня: " + data.dayNumber));
      var mood = el("span", "consult__mood " + (data.day.favorable ? "consult__mood--good" : "consult__mood--caution"), data.day.mood);
      dayMeta.appendChild(mood);
      dayBlock.appendChild(dayMeta);
      dayBlock.appendChild(p(data.day.advice));
      if (data.day.doToday) dayBlock.appendChild(sub("Что делать", data.day.doToday));
      if (data.day.avoidToday) dayBlock.appendChild(sub("Чего избегать", data.day.avoidToday));
      body.appendChild(dayBlock);
    }

    if (data.month) {
      var m = el("div", "consult__forecast-card");
      m.appendChild(el("h4", "consult__forecast-title", "Текущий месяц · " + data.monthNumber));
      m.appendChild(p(data.month.energy));
      m.appendChild(p(data.month.forecast));
      body.appendChild(m);
    }

    if (data.year) {
      var y = el("div", "consult__forecast-card");
      y.appendChild(el("h4", "consult__forecast-title", "Текущий год · " + data.yearNumber));
      y.appendChild(p(data.year.energy));
      y.appendChild(p(data.year.forecast));
      body.appendChild(y);
    }
  }

  function renderLove(body, data) {
    if (!data) return;
    body.appendChild(sub("Особенности отношений", data.traits));
    body.appendChild(sub("Какой партнёр подходит", data.partner));
    body.appendChild(sub("Что может мешать любви", data.blocks));
    body.appendChild(sub("Сильные стороны в отношениях", data.strengths));
  }

  function renderMoney(body, data) {
    if (!data) return;
    body.appendChild(sub("Как вам легче зарабатывать", data.earning));
    body.appendChild(sub("Качества, привлекающие деньги", data.qualities));
    body.appendChild(sub("Привычки, мешающие росту", data.habits));
  }

  function renderPurpose(body, data) {
    if (!data) return;
    body.appendChild(sub("Где вы можете раскрыться", data.reveal));
    body.appendChild(sub("Таланты для развития", data.talents));
    body.appendChild(sub("Где принесёте наибольшую пользу", data.benefit));
  }

  function renderAncestral(body, data) {
    if (!data) return;
    body.appendChild(p(
      "Родовая программа — это не приговор, а карта того, что передано вам через семейную линию. " +
      "Числа могут указывать на дары и задачи, которые вы можете осознанно принять или мягко трансформировать.",
      "consult__p--lead"
    ));
    body.appendChild(sub("Дары рода", data.gifts));
    body.appendChild(sub("Сила рода", data.support));
    body.appendChild(sub("Родовые задачи", data.tasks));
    if (data.program) body.appendChild(sub("Родовая программа", data.program));
  }

  var RENDERERS = {
    portrait: renderPortrait,
    lifePeriods: renderLifePeriods,
    yearEnergy: function (body, data, c) { renderYearEnergy(body, data, c.numbers); },
    forecast: function (body, data, c, dateStr) { renderForecast(body, data, dateStr); },
    love: renderLove,
    money: renderMoney,
    purpose: renderPurpose,
    ancestral: renderAncestral,
  };

  function formatToday(date) {
    var months = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря",
    ];
    var d = date || new Date();
    return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
  }

  function formatBirth(dateStr) {
    var parts = dateStr.split("-");
    return parts[2] + "." + parts[1] + "." + parts[0];
  }

  /**
   * Рендерит полную консультацию.
   */
  function render(consultation, elements) {
    var client = consultation.client;
    var meta = consultation.analysisMeta || Consultation.getAnalysisType("full");
    var order = meta.sections || Consultation.SECTION_ORDER;
    var brief = meta.briefPortrait;
    var dateStr = formatToday(consultation.date);

    elements.navContainer.innerHTML = "";
    elements.contentContainer.innerHTML = "";
    elements.ancestralContainer.innerHTML = "";
    elements.ancestralSection.hidden = true;
    elements.ancestralBtn.hidden = !meta.showAncestral;

    renderNav(elements.navContainer, order);

    elements.headerLabel.textContent =
      client.displayName + " · " + formatBirth(client.birthDate) +
      (client.birthCity ? " · " + client.birthCity : "") +
      " · " + meta.title;

    order.forEach(function (key, index) {
      var sectionMeta = SECTION_META[key];
      var data = consultation.sections[key];
      if (!sectionMeta || !data) return;

      var shell = sectionShell(key, sectionMeta.icon, sectionMeta.title);
      shell.section.style.animationDelay = (index * 0.07) + "s";

      var renderer = RENDERERS[key];
      if (renderer) {
        if (key === "portrait") renderPortrait(shell.body, data, brief);
        else if (key === "forecast") renderer(shell.body, data, consultation, dateStr);
        else if (key === "yearEnergy") renderer(shell.body, data, consultation);
        else renderer(shell.body, data);
      }

      elements.contentContainer.appendChild(shell.section);
    });

    elements.ancestralBtn.onclick = function () {
      elements.ancestralSection.hidden = false;
      elements.ancestralBtn.hidden = true;
      if (!elements.ancestralContainer.children.length && consultation.ancestral) {
        var shell = sectionShell("ancestral", SECTION_META.ancestral.icon, SECTION_META.ancestral.title);
        renderAncestral(shell.body, consultation.ancestral);
        elements.ancestralContainer.appendChild(shell.section);
      }
      elements.ancestralSection.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  }

  function buildCopyText(consultation) {
    var c = consultation.client;
    var s = consultation.sections;
    var lines = [
      "✦ Тайна чисел — нумерологическая карта ✦",
      "",
      c.displayName,
      "Дата рождения: " + formatBirth(c.birthDate),
      c.birthCity ? "Город: " + c.birthCity : "",
      "",
    ].filter(Boolean);

    if (s.portrait) {
      lines.push("— ОСНОВНОЙ ПОРТРЕТ —", s.portrait.intro, "");
      lines.push("Сильные стороны:", s.portrait.strengths, "");
      lines.push("Слабые стороны:", s.portrait.weaknesses, "");
      lines.push("Жизненные задачи:", s.portrait.lifeTasks, "");
    }
    if (s.yearEnergy) {
      lines.push("— ЭНЕРГИЯ ГОДА —", s.yearEnergy.theme, s.yearEnergy.attention, "");
    }
    if (s.love) {
      lines.push("— ЛЮБОВЬ —", s.love.traits, s.love.partner, "");
    }
    if (s.money) {
      lines.push("— ДЕНЬГИ —", s.money.earning, s.money.qualities, "");
    }
    if (s.purpose) {
      lines.push("— ПРЕДНАЗНАЧЕНИЕ —", s.purpose.reveal, s.purpose.talents, "");
    }
    if (consultation.ancestral) {
      lines.push("— РОДОВАЯ ЭНЕРГИЯ —", consultation.ancestral.gifts, consultation.ancestral.tasks, "");
    }
    lines.push("✦ Тайна чисел ✦");
    return lines.join("\n");
  }

  return {
    render: render,
    buildCopyText: buildCopyText,
    formatBirth: formatBirth,
  };
})();
