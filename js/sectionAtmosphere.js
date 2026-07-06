/**
 * sectionAtmosphere.js — декоративные фоны разделов (ШАГ 4).
 * Не изменяет формы и поля анкет.
 */

(function () {
  "use strict";

  var GOLD = "248,210,130";
  var GOLD_STROKE = "rgba(248,210,130,";

  function wrapSectionBody(section) {
    if (section.querySelector(".app-section__body")) return;

    var body = document.createElement("div");
    body.className = "app-section__body";

    var nodes = [];
    for (var i = 0; i < section.childNodes.length; i++) {
      var child = section.childNodes[i];
      if (child.nodeType === 1 && child.classList && child.classList.contains("section-atmo")) {
        continue;
      }
      if (child.nodeType === 1 || (child.nodeType === 3 && child.textContent.trim())) {
        nodes.push(child);
      }
    }

    nodes.forEach(function (node) {
      body.appendChild(node);
    });

    section.appendChild(body);
  }

  function insertAtmo(sectionId, className, html) {
    var section = document.getElementById(sectionId);
    if (!section || section.querySelector(".section-atmo")) return;

    var atmo = document.createElement("div");
    atmo.className = "section-atmo " + className;
    atmo.setAttribute("aria-hidden", "true");
    atmo.innerHTML = html;
    section.insertBefore(atmo, section.firstChild);
    wrapSectionBody(section);
  }

  /* ─── ⚡ Быстрый анализ ─── */
  var QUICK_HTML =
    '<div class="atmo-quick__veil"></div>' +
    '<div class="atmo-quick__rays"></div>' +
    '<svg class="section-atmo__svg atmo-quick__lines" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">' +
    '<g fill="none" stroke="rgba(' + GOLD + ',0.55)" stroke-width="0.9">' +
    '<path d="M120,520 Q280,380 500,420 T880,480"/>' +
    '<path d="M80,640 Q300,560 500,600 T920,660" opacity="0.7"/>' +
    '<path d="M200,300 Q400,200 500,280 T800,340" opacity="0.5"/>' +
    '<circle cx="500" cy="500" r="280" stroke-dasharray="4 12" opacity="0.35"/>' +
    '</g></svg>' +
    '<svg class="section-atmo__svg atmo-quick__const" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">' +
    '<g stroke="rgba(' + GOLD + ',0.35)" stroke-width="0.6">' +
    '<line x1="120" y1="180" x2="165" y2="210"/><line x1="165" y1="210" x2="190" y2="160"/><circle cx="120" cy="180" r="2" fill="rgba(255,240,200,0.7)"/>' +
    '<circle cx="165" cy="210" r="1.5" fill="rgba(255,235,180,0.6)"/><circle cx="190" cy="160" r="2" fill="rgba(255,245,215,0.65)"/>' +
    '<line x1="780" y1="140" x2="820" y2="175"/><line x1="820" y1="175" x2="860" y2="130"/><line x1="820" y1="175" x2="800" y2="210"/>' +
    '<circle cx="780" cy="140" r="2" fill="rgba(255,240,200,0.65)"/><circle cx="860" cy="130" r="1.5" fill="rgba(255,235,180,0.55)"/>' +
    '<line x1="150" y1="780" x2="190" y2="750"/><line x1="190" y1="750" x2="220" y2="800"/><circle cx="220" cy="800" r="2" fill="rgba(255,240,200,0.6)"/>' +
    '<line x1="820" y1="760" x2="850" y2="720"/><line x1="850" y1="720" x2="890" y2="760"/><circle cx="890" cy="760" r="2" fill="rgba(255,245,215,0.6)"/>' +
    '</g></svg>' +
    '<span class="atmo-quick__shoot atmo-quick__shoot--1"></span>' +
    '<span class="atmo-quick__shoot atmo-quick__shoot--2"></span>' +
    '<span class="atmo-quick__shoot atmo-quick__shoot--3"></span>' +
    '<span class="atmo-quick__shoot atmo-quick__shoot--4"></span>' +
    '<div class="atmo-quick__particles"></div>';

  /* ─── 📜 Полная карта — Цветок Жизни + Метатрон ─── */
  function flowerOfLifeCircles(cx, cy, r) {
    var out = "";
    var angles = [0, 60, 120, 180, 240, 300];
    out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>';
    angles.forEach(function (deg) {
      var rad = (deg * Math.PI) / 180;
      var x = cx + r * Math.cos(rad);
      var y = cy + r * Math.sin(rad);
      out += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '"/>';
    });
    return out;
  }

  var FULL_HTML =
    '<div class="atmo-full__veil"></div>' +
    '<svg class="section-atmo__svg atmo-full__geometry" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">' +
    '<g fill="none" stroke="rgba(' + GOLD + ',0.45)" stroke-width="0.7">' +
    flowerOfLifeCircles(300, 300, 52) +
    flowerOfLifeCircles(300, 300, 26) +
    '<circle cx="300" cy="300" r="156" stroke-dasharray="3 8" opacity="0.5"/>' +
    '</g></svg>' +
    '<svg class="section-atmo__svg atmo-full__metatron" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">' +
    '<g fill="none" stroke="rgba(' + GOLD + ',0.4)" stroke-width="0.6">' +
    '<polygon points="200,40 360,200 200,360 40,200" opacity="0.6"/>' +
    '<polygon points="200,70 330,200 200,330 70,200" opacity="0.5"/>' +
    '<line x1="40" y1="200" x2="360" y2="200"/><line x1="200" y1="40" x2="200" y2="360"/>' +
    '<line x1="70" y1="70" x2="330" y2="330"/><line x1="330" y1="70" x2="70" y2="330"/>' +
    '<circle cx="200" cy="200" r="160" stroke-dasharray="2 6"/>' +
    '<circle cx="200" cy="40" r="12"/><circle cx="360" cy="200" r="12"/><circle cx="200" cy="360" r="12"/><circle cx="40" cy="200" r="12"/>' +
    '<circle cx="200" cy="200" r="12"/>' +
    '</g></svg>' +
    '<svg class="section-atmo__svg atmo-full__symbols" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">' +
    '<g fill="none" stroke="rgba(' + GOLD + ',0.3)" stroke-width="0.5" opacity="0.8">' +
    '<path d="M80,120 L120,80 L160,120 L120,160 Z"/>' +
    '<circle cx="880" cy="150" r="35"/><path d="M880,115 L880,185 M845,150 L915,150"/>' +
    '<path d="M100,850 L140,810 L180,850 L140,890 Z" transform="rotate(15 140 850)"/>' +
    '<path d="M850,820 Q900,780 920,830 T870,900" opacity="0.6"/>' +
    '</g></svg>';

  /* ─── ✨ Глубокий анализ — Древо Жизни ─── */
  var DEEP_TREE =
    '<svg class="section-atmo__svg atmo-deep__tree" viewBox="0 0 500 900" xmlns="http://www.w3.org/2000/svg">' +
    '<g class="atmo-tree-branches">' +
    '<path class="atmo-tree-branch" d="M250,480 L250,320"/>' +
    '<path class="atmo-tree-branch" d="M250,400 Q180,340 120,260"/>' +
    '<path class="atmo-tree-branch" d="M250,400 Q320,340 380,260"/>' +
    '<path class="atmo-tree-branch" d="M250,360 Q150,280 90,180"/>' +
    '<path class="atmo-tree-branch" d="M250,360 Q350,280 410,180"/>' +
    '<path class="atmo-tree-branch" d="M250,340 Q200,240 170,120"/>' +
    '<path class="atmo-tree-branch" d="M250,340 Q300,240 330,120"/>' +
    '<path class="atmo-tree-branch" d="M250,320 Q230,200 240,80"/>' +
    '<path class="atmo-tree-branch" d="M250,320 Q270,200 260,80"/>' +
    '<path class="atmo-tree-branch" d="M120,260 Q80,220 60,160" opacity="0.7"/>' +
    '<path class="atmo-tree-branch" d="M380,260 Q420,220 440,160" opacity="0.7"/>' +
    '</g>' +
    '<g class="atmo-tree-roots">' +
    '<path class="atmo-tree-root" d="M250,480 L250,620"/>' +
    '<path class="atmo-tree-root" d="M250,540 Q180,600 120,680"/>' +
    '<path class="atmo-tree-root" d="M250,540 Q320,600 380,680"/>' +
    '<path class="atmo-tree-root" d="M250,580 Q160,660 100,760"/>' +
    '<path class="atmo-tree-root" d="M250,580 Q340,660 400,760"/>' +
    '<path class="atmo-tree-root" d="M120,680 Q80,720 70,800" opacity="0.6"/>' +
    '<path class="atmo-tree-root" d="M380,680 Q420,720 430,800" opacity="0.6"/>' +
    '</g>' +
    '<g class="atmo-tree-nodes">' +
    '<circle class="atmo-tree-node" cx="250" cy="80" r="5"/>' +
    '<circle class="atmo-tree-node" cx="170" cy="120" r="4"/><circle class="atmo-tree-node" cx="330" cy="120" r="4"/>' +
    '<circle class="atmo-tree-node" cx="90" cy="180" r="4"/><circle class="atmo-tree-node" cx="410" cy="180" r="4"/>' +
    '<circle class="atmo-tree-node" cx="120" cy="260" r="4"/><circle class="atmo-tree-node" cx="380" cy="260" r="4"/>' +
    '<circle class="atmo-tree-node" cx="250" cy="320" r="5"/>' +
    '<circle class="atmo-tree-node" cx="250" cy="480" r="6"/>' +
    '<circle class="atmo-tree-node" cx="120" cy="680" r="3"/><circle class="atmo-tree-node" cx="380" cy="680" r="3"/>' +
    '</g>' +
    '<g class="atmo-tree-dust-group">' +
    '<circle class="atmo-tree-dust" cx="200" cy="200" r="1.2"/><circle class="atmo-tree-dust" cx="300" cy="180" r="1"/>' +
    '<circle class="atmo-tree-dust" cx="140" cy="300" r="0.8"/><circle class="atmo-tree-dust" cx="360" cy="290" r="1"/>' +
    '<circle class="atmo-tree-dust" cx="250" cy="420" r="1.1"/><circle class="atmo-tree-dust" cx="180" cy="560" r="0.9"/>' +
    '<circle class="atmo-tree-dust" cx="320" cy="550" r="0.9"/><circle class="atmo-tree-dust" cx="250" cy="650" r="1"/>' +
    '</g></svg>' +
    '<svg class="section-atmo__svg atmo-deep__tree-glow" viewBox="0 0 500 900" xmlns="http://www.w3.org/2000/svg">' +
    '<path class="atmo-tree-glow-path" d="M250,480 Q180,340 120,260 Q90,180 170,120 Q230,60 250,80"/>' +
    '<path class="atmo-tree-glow-path atmo-tree-glow-path--2" d="M250,480 Q320,340 380,260 Q410,180 330,120 Q270,60 250,80"/>' +
    '<path class="atmo-tree-glow-path atmo-tree-glow-path--3" d="M250,480 L250,620 Q180,680 120,760 Q100,820 130,860"/>' +
    '<path class="atmo-tree-glow-path atmo-tree-glow-path--3" d="M250,480 L250,620 Q320,680 380,760 Q400,820 370,860" style="animation-delay:-7s"/>' +
    '</svg>';

  var DEEP_HTML =
    '<div class="atmo-deep__veil"></div>' + DEEP_TREE;

  /* ─── 💰 Финансовый потенциал ─── */
  var FIN_HTML =
    '<div class="atmo-fin__veil"></div>' +
    '<svg class="section-atmo__svg atmo-fin__infinity" viewBox="0 0 520 280" xmlns="http://www.w3.org/2000/svg">' +
    '<path fill="none" stroke="rgba(' + GOLD + ',0.45)" stroke-width="1.5" d="M130,140 C130,80 70,80 70,140 C70,200 130,200 130,140 C130,80 190,80 260,140 C330,200 390,200 390,140 C390,80 330,80 260,140 C190,200 130,200 130,140"/>' +
    '</svg>' +
    '<svg class="section-atmo__svg atmo-fin__flows" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">' +
    '<g fill="none" stroke="rgba(' + GOLD + ',0.45)" stroke-width="1">' +
    '<path d="M0,500 Q250,420 500,500 T1000,500" opacity="0.7"/>' +
    '<path d="M0,400 Q300,320 500,400 T1000,420" opacity="0.5"/>' +
    '<path d="M0,600 Q200,680 500,600 T1000,580" opacity="0.5"/>' +
    '<path d="M100,300 Q400,250 700,350 T1000,280" opacity="0.35"/>' +
    '</g></svg>' +
    '<svg class="section-atmo__svg atmo-fin__grid" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">' +
    '<g stroke="rgba(' + GOLD + ',0.15)" stroke-width="0.4">' +
    '<line x1="200" y1="0" x2="200" y2="1000"/><line x1="400" y1="0" x2="400" y2="1000"/><line x1="600" y1="0" x2="600" y2="1000"/><line x1="800" y1="0" x2="800" y2="1000"/>' +
    '<line x1="0" y1="200" x2="1000" y2="200"/><line x1="0" y1="400" x2="1000" y2="400"/><line x1="0" y1="600" x2="1000" y2="600"/><line x1="0" y1="800" x2="1000" y2="800"/>' +
    '<line x1="0" y1="0" x2="1000" y2="1000" opacity="0.5"/><line x1="1000" y1="0" x2="0" y2="1000" opacity="0.5"/>' +
    '</g></svg>' +
    '<div class="atmo-fin__particles"></div>';

  /* ─── ❤️ Профили из созвездий ─── */
  function constellationProfile(isFemale) {
    var stars = isFemale
      ? '<circle class="section-profile__star" cx="90" cy="42" r="2.2"/>' +
        '<circle class="section-profile__star" cx="72" cy="55" r="1.6"/><circle class="section-profile__star" cx="108" cy="55" r="1.6"/>' +
        '<circle class="section-profile__star" cx="62" cy="78" r="1.4"/><circle class="section-profile__star" cx="118" cy="78" r="1.4"/>' +
        '<circle class="section-profile__star" cx="90" cy="72" r="1.8"/><circle class="section-profile__star" cx="90" cy="95" r="1.5"/>' +
        '<circle class="section-profile__star" cx="75" cy="108" r="1.3"/><circle class="section-profile__star" cx="105" cy="108" r="1.3"/>' +
        '<circle class="section-profile__star" cx="55" cy="95" r="1.2"/><circle class="section-profile__star" cx="125" cy="95" r="1.2"/>' +
        '<circle class="section-profile__star" cx="48" cy="130" r="1.5"/><circle class="section-profile__star" cx="132" cy="130" r="1.5"/>' +
        '<circle class="section-profile__star" cx="68" cy="145" r="1.3"/><circle class="section-profile__star" cx="112" cy="145" r="1.3"/>' +
        '<circle class="section-profile__star" cx="90" cy="158" r="1.6"/>'
      : '<circle class="section-profile__star" cx="90" cy="48" r="2.2"/>' +
        '<circle class="section-profile__star" cx="68" cy="62" r="1.6"/><circle class="section-profile__star" cx="112" cy="62" r="1.6"/>' +
        '<circle class="section-profile__star" cx="90" cy="78" r="1.8"/><circle class="section-profile__star" cx="90" cy="98" r="1.5"/>' +
        '<circle class="section-profile__star" cx="72" cy="112" r="1.3"/><circle class="section-profile__star" cx="108" cy="112" r="1.3"/>' +
        '<circle class="section-profile__star" cx="42" cy="118" r="1.5"/><circle class="section-profile__star" cx="138" cy="118" r="1.5"/>' +
        '<circle class="section-profile__star" cx="55" cy="138" r="1.4"/><circle class="section-profile__star" cx="125" cy="138" r="1.4"/>' +
        '<circle class="section-profile__star" cx="72" cy="152" r="1.3"/><circle class="section-profile__star" cx="108" cy="152" r="1.3"/>' +
        '<circle class="section-profile__star" cx="90" cy="165" r="1.6"/>';

    var lines = isFemale
      ? '<path class="section-profile__line" d="M90,42 L72,55 L62,78 L48,130 L68,145 L90,158 L112,145 L132,130 L118,78 L108,55 Z"/>' +
        '<path class="section-profile__line" d="M72,55 Q55,75 48,95" opacity="0.6"/>' +
        '<path class="section-profile__line" d="M108,55 Q125,75 132,95" opacity="0.6"/>' +
        '<path class="section-profile__line" d="M90,72 L90,95 L90,158" opacity="0.4"/>'
      : '<path class="section-profile__line" d="M90,48 L68,62 L42,118 L55,138 L72,152 L90,165 L108,152 L125,138 L138,118 L112,62 Z"/>' +
        '<path class="section-profile__line" d="M68,62 L42,118" opacity="0.5"/>' +
        '<path class="section-profile__line" d="M112,62 L138,118" opacity="0.5"/>' +
        '<path class="section-profile__line" d="M90,78 L90,165" opacity="0.4"/>';

    return (
      '<svg class="section-profile__svg" viewBox="0 0 180 200" xmlns="http://www.w3.org/2000/svg">' +
      '<g fill="rgba(255,235,190,0.55)">' + stars + "</g>" +
      '<g>' + lines + "</g>" +
      "</svg>"
    );
  }

  function setupCompatibilityProfiles() {
    var section = document.getElementById("compatibility");
    if (!section || section.querySelector(".app-section__stage--compat")) return;

    wrapSectionBody(section);
    var body = section.querySelector(".app-section__body");
    var shell = body ? body.querySelector(".compatibility__shell") : section.querySelector(".compatibility__shell");
    if (!shell) return;

    var header = body.querySelector(".section__header");
    var stage = document.createElement("div");
    stage.className = "app-section__stage app-section__stage--compat";

    var female = document.createElement("div");
    female.className = "section-profile section-profile--female";
    female.setAttribute("aria-hidden", "true");
    female.innerHTML = constellationProfile(true);

    var center = document.createElement("div");
    center.className = "app-section__stage-center";

    var male = document.createElement("div");
    male.className = "section-profile section-profile--male";
    male.setAttribute("aria-hidden", "true");
    male.innerHTML = constellationProfile(false);

    stage.appendChild(female);
    center.appendChild(shell);
    stage.appendChild(center);
    stage.appendChild(male);

    if (header && header.nextSibling) {
      body.insertBefore(stage, header.nextSibling);
    } else {
      body.appendChild(stage);
    }
  }

  function init() {
    insertAtmo("quick-analysis", "section-atmo--quick", QUICK_HTML);
    insertAtmo("full-analysis", "section-atmo--full", FULL_HTML);
    insertAtmo("deep-analysis", "section-atmo--deep", DEEP_HTML);
    insertAtmo("finance", "section-atmo--financial", FIN_HTML);
    insertAtmo("compatibility", "section-atmo--compat", '<div class="atmo-compat__glow"></div>');
    setupCompatibilityProfiles();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
