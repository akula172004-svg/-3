/**
 * sections.js — маршрутизация между разделами сайта (ШАГ 2).
 *
 * Разделы-заглушки:
 *   quick-analysis, full-analysis, deep-analysis,
 *   daily-message, compatibility, finance
 */

(function (global) {
  "use strict";

  var ANALYSIS_TO_SECTION = {
    quick: "quick-analysis",
    full: "full-analysis",
    deep: "deep-analysis",
  };

  var APP_SECTIONS = [
    "quick-analysis",
    "full-analysis",
    "deep-analysis",
    "daily-message",
    "compatibility",
    "finance",
  ];

  function getHero() {
    return document.getElementById("hero");
  }

  function getHeroForm() {
    return document.getElementById("hero-form");
  }

  function hideAllAppSections() {
    APP_SECTIONS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.hidden = true;
        el.classList.remove("is-section-active");
      }
    });
  }

  function hideForResult() {
    hideAllAppSections();
    var hero = getHero();
    var heroForm = getHeroForm();
    if (hero) hero.hidden = true;
    if (heroForm) {
      heroForm.hidden = true;
      heroForm.classList.remove("is-visible");
    }
  }

  function showHero() {
    var hero = getHero();
    var heroForm = getHeroForm();

    hideAllAppSections();

    if (heroForm) {
      heroForm.hidden = true;
      heroForm.classList.remove("is-visible");
    }

    if (hero) hero.hidden = false;

    if (location.hash && location.hash !== "#hero") {
      history.replaceState(null, "", "#hero");
    }

    requestAnimationFrame(function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function openSection(sectionId) {
    if (APP_SECTIONS.indexOf(sectionId) === -1) return false;

    var hero = getHero();
    var heroForm = getHeroForm();
    var target = document.getElementById(sectionId);

    if (!target) return false;

    if (hero) hero.hidden = true;

    if (heroForm) {
      heroForm.hidden = true;
      heroForm.classList.remove("is-visible");
    }

    hideAllAppSections();
    target.hidden = false;
    target.classList.add("is-section-active");

    history.pushState(null, "", "#" + sectionId);

    requestAnimationFrame(function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    return true;
  }

  function openAnalysisSection(typeId) {
    var sectionId = ANALYSIS_TO_SECTION[typeId];
    return sectionId ? openSection(sectionId) : false;
  }

  function initFromHash() {
    var hash = location.hash.replace("#", "");

    if (!hash || hash === "hero") {
      showHero();
      return;
    }

    if (APP_SECTIONS.indexOf(hash) !== -1) {
      openSection(hash);
    }
  }

  function bindNavigation() {
    document.querySelectorAll(".float-dock__btn[href^='#']").forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href").slice(1);
        if (APP_SECTIONS.indexOf(id) === -1) return;
        e.preventDefault();
        openSection(id);
      });
    });

    var dockFinancial = document.getElementById("dock-financial");
    if (dockFinancial) {
      dockFinancial.addEventListener("click", function () {
        openSection("finance");
      });
    }

    var navBrand = document.querySelector(".nav__brand[href='#hero']");
    if (navBrand) {
      navBrand.addEventListener("click", function (e) {
        e.preventDefault();
        showHero();
      });
    }

    window.addEventListener("hashchange", function () {
      var hash = location.hash.replace("#", "");
      if (hash === "hero" || hash === "") {
        showHero();
        return;
      }
      if (APP_SECTIONS.indexOf(hash) !== -1) {
        openSection(hash);
        return;
      }
    });
  }

  global.AppSections = {
    ANALYSIS_TO_SECTION: ANALYSIS_TO_SECTION,
    APP_SECTIONS: APP_SECTIONS,
    showHero: showHero,
    openSection: openSection,
    openAnalysisSection: openAnalysisSection,
    initFromHash: initFromHash,
    bindNavigation: bindNavigation,
    hideForResult: hideForResult,
  };
})(window);
