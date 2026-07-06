/**
 * zodiacArt.js — золотые SVG-иллюстрации для медальонов обложки.
 */

const ZodiacArt = (function () {
  "use strict";

  function defs(id) {
    return (
      "<defs>" +
      '<radialGradient id="' + id + '-bg" cx="50%" cy="50%" r="50%">' +
      '<stop offset="0%" stop-color="#1a1228"/>' +
      '<stop offset="70%" stop-color="#0e0a16"/>' +
      '<stop offset="100%" stop-color="#06040c"/>' +
      "</radialGradient>" +
      '<linearGradient id="' + id + '-g" x1="0%" y1="0%" x2="100%" y2="100%">' +
      '<stop offset="0%" stop-color="#fffce8"/>' +
      '<stop offset="40%" stop-color="#f5d878"/>' +
      '<stop offset="75%" stop-color="#c9a227"/>' +
      '<stop offset="100%" stop-color="#7a5c18"/>' +
      "</linearGradient>" +
      '<linearGradient id="' + id + '-f" x1="28%" y1="18%" x2="72%" y2="82%">' +
      '<stop offset="0%" stop-color="#fff8d8" stop-opacity="0.95"/>' +
      '<stop offset="45%" stop-color="#e8c860" stop-opacity="0.8"/>' +
      '<stop offset="100%" stop-color="#6b5218" stop-opacity="0.55"/>' +
      "</linearGradient>" +
      '<filter id="' + id + '-gl" x="-25%" y="-25%" width="150%" height="150%">' +
      '<feGaussianBlur stdDeviation="0.8" result="b"/>' +
      "<feMerge><feMergeNode in=\"b\"/><feMergeNode in=\"SourceGraphic\"/></feMerge>" +
      "</filter></defs>"
    );
  }

  function wrap(id, inner) {
    return (
      '<svg class="cover__medallion-svg" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      defs(id) +
      '<circle cx="40" cy="40" r="38" fill="url(#' + id + '-bg)"/>' +
      '<g filter="url(#' + id + '-gl)" fill="url(#' + id + '-f)" stroke="url(#' + id + '-g)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
      inner +
      "</g></svg>"
    );
  }

  var ICONS = {
    aries:
      '<ellipse cx="40" cy="50" rx="13" ry="11" fill="url(#aries-f)"/>' +
      '<path d="M28 40 C20 24 12 20 10 30 C8 38 14 44 22 42" fill="none" stroke-width="2.6"/>' +
      '<path d="M52 40 C60 24 68 20 70 30 C72 38 66 44 58 42" fill="none" stroke-width="2.6"/>' +
      '<path d="M32 36 C30 28 34 22 40 24 C46 22 50 28 48 36" fill="none" stroke-width="2"/>' +
      '<circle cx="35" cy="48" r="2.2" fill="#fffce8" stroke="none"/>' +
      '<circle cx="45" cy="48" r="2.2" fill="#fffce8" stroke="none"/>' +
      '<path d="M34 54 Q40 57 46 54" fill="none" stroke-width="1.6"/>' +
      '<path d="M26 38 L20 32 M54 38 L60 32" fill="none" stroke-width="2.2"/>',

    taurus:
      '<ellipse cx="40" cy="50" rx="16" ry="14" fill="url(#taurus-f)"/>' +
      '<path d="M22 38 C18 18 28 12 34 24 C36 30 38 34 40 38" fill="none" stroke-width="2.8"/>' +
      '<path d="M58 38 C62 18 52 12 46 24 C44 30 42 34 40 38" fill="none" stroke-width="2.8"/>' +
      '<ellipse cx="40" cy="50" rx="14" ry="12" fill="none" stroke-width="2"/>' +
      '<circle cx="33" cy="48" r="2.5" fill="#fffce8" stroke="none"/>' +
      '<circle cx="47" cy="48" r="2.5" fill="#fffce8" stroke="none"/>' +
      '<path d="M30 56 Q40 60 50 56" fill="none" stroke-width="1.8"/>' +
      '<path d="M18 34 L14 26 M62 34 L66 26" fill="none" stroke-width="2"/>',

    gemini:
      '<circle cx="26" cy="28" r="9" fill="url(#gemini-f)"/>' +
      '<circle cx="54" cy="28" r="9" fill="url(#gemini-f)"/>' +
      '<path d="M26 37v16 M18 44h16 M20 58h12" fill="none" stroke-width="2.4"/>' +
      '<path d="M54 37v16 M46 44h16 M48 58h12" fill="none" stroke-width="2.4"/>' +
      '<circle cx="26" cy="28" r="3.5" fill="none" stroke-width="1.3"/>' +
      '<circle cx="54" cy="28" r="3.5" fill="none" stroke-width="1.3"/>' +
      '<path d="M22 24 C24 20 28 20 30 24" fill="none" stroke-width="1.4"/>' +
      '<path d="M50 24 C52 20 56 20 58 24" fill="none" stroke-width="1.4"/>' +
      '<path d="M34 42 C38 40 42 40 46 42" fill="none" stroke-width="1.5" opacity="0.6"/>',

    cancer:
      '<ellipse cx="40" cy="46" rx="16" ry="12" fill="url(#cancer-f)"/>' +
      '<path d="M22 46 C8 40 6 54 16 62 C24 68 30 60 34 50" fill="none" stroke-width="2.8"/>' +
      '<path d="M58 46 C72 40 74 54 64 62 C56 68 50 60 46 50" fill="none" stroke-width="2.8"/>' +
      '<path d="M18 46 L10 42 M62 46 L70 42" fill="none" stroke-width="2.2"/>' +
      '<path d="M16 50 L8 54 M64 50 L72 54" fill="none" stroke-width="1.8"/>' +
      '<circle cx="34" cy="44" r="2.2" fill="#fffce8" stroke="none"/>' +
      '<circle cx="46" cy="44" r="2.2" fill="#fffce8" stroke="none"/>' +
      '<path d="M28 52 L24 56 M52 52 L56 56" fill="none" stroke-width="1.6"/>',

    leo:
      '<circle cx="40" cy="44" r="17" fill="url(#leo-f)"/>' +
      '<path d="M22 28 C14 16 18 6 28 10 C34 12 36 20 34 26" fill="none" stroke-width="2.2"/>' +
      '<path d="M58 28 C66 16 62 6 52 10 C46 12 44 20 46 26" fill="none" stroke-width="2.2"/>' +
      '<path d="M18 24 C10 28 8 40 16 48 C24 54 32 50 36 42" fill="none" stroke-width="2.4"/>' +
      '<path d="M62 24 C70 28 72 40 64 48 C56 54 48 50 44 42" fill="none" stroke-width="2.4"/>' +
      '<circle cx="34" cy="44" r="2.5" fill="#fffce8" stroke="none"/>' +
      '<circle cx="46" cy="44" r="2.5" fill="#fffce8" stroke="none"/>' +
      '<path d="M33 52 Q40 56 47 52" fill="none" stroke-width="1.8"/>',

    virgo:
      '<circle cx="40" cy="26" r="9" fill="url(#virgo-f)"/>' +
      '<path d="M40 35v18 M32 44h16 M34 58h12" fill="none" stroke-width="2.2"/>' +
      '<path d="M46 58 C50 66 58 64 60 56" fill="none" stroke-width="2"/>' +
      '<path d="M56 42 C62 38 64 46 60 52" fill="none" stroke-width="1.8"/>' +
      '<path d="M60 30 C64 22 70 24 68 32" fill="none" stroke-width="1.6"/>' +
      '<path d="M54 20 L58 10 L62 20" fill="none" stroke-width="1.4"/>' +
      '<path d="M36 22 C38 18 42 18 44 22" fill="none" stroke-width="1.3"/>',

    libra:
      '<line x1="40" y1="16" x2="40" y2="60" stroke-width="2"/>' +
      '<line x1="20" y1="32" x2="60" y2="32" stroke-width="2.4"/>' +
      '<path d="M20 32 C12 38 12 50 20 54 C28 58 34 50 34 42" fill="url(#libra-f)" stroke-width="2"/>' +
      '<path d="M60 32 C68 38 68 50 60 54 C52 58 46 50 46 42" fill="url(#libra-f)" stroke-width="2"/>' +
      '<line x1="20" y1="32" x2="20" y2="54" stroke-width="1.4"/>' +
      '<line x1="60" y1="32" x2="60" y2="54" stroke-width="1.4"/>' +
      '<path d="M36 58 C38 62 42 62 44 58" fill="none" stroke-width="1.4"/>',

    scorpio:
      '<ellipse cx="26" cy="46" rx="13" ry="9" fill="url(#scorpio-f)"/>' +
      '<path d="M39 46 H46" fill="none" stroke-width="2.4"/>' +
      '<path d="M46 46 C56 46 62 54 58 64 C54 72 46 70 42 60" fill="none" stroke-width="2.2"/>' +
      '<path d="M54 64 C60 72 68 74 72 68" fill="none" stroke-width="2"/>' +
      '<path d="M72 68 L76 64 L78 70" fill="none" stroke-width="1.8"/>' +
      '<path d="M16 42 C10 40 8 48 12 52" fill="none" stroke-width="2"/>' +
      '<path d="M16 50 C10 54 8 60 12 64" fill="none" stroke-width="2"/>' +
      '<circle cx="22" cy="44" r="2" fill="#fffce8" stroke="none"/>' +
      '<path d="M30 42 L26 38 M34 50 L30 54" fill="none" stroke-width="1.6"/>',

    sagittarius:
      '<circle cx="26" cy="26" r="8" fill="url(#sagittarius-f)"/>' +
      '<path d="M26 34v8 M20 40h12" fill="none" stroke-width="2"/>' +
      '<path d="M32 38 C42 32 52 24 62 18" fill="none" stroke-width="2.6"/>' +
      '<path d="M62 18 L70 14 L66 24 Z" fill="url(#sagittarius-f)" stroke-width="1.4"/>' +
      '<path d="M28 44 C36 48 46 52 56 56 C62 58 66 54 64 48" fill="url(#sagittarius-f)" stroke-width="2"/>' +
      '<path d="M64 48 C68 44 70 48 66 52" fill="none" stroke-width="1.8"/>' +
      '<path d="M56 56 L62 62 M50 54 L46 60" fill="none" stroke-width="2"/>' +
      '<path d="M22 52 C30 54 38 58 44 62" fill="none" stroke-width="2.2"/>' +
      '<line x1="62" y1="18" x2="54" y2="28" stroke-width="1.8"/>',

    capricorn:
      '<path d="M12 60 C18 40 30 34 40 38 C46 40 48 48 44 54" fill="url(#capricorn-f)" stroke-width="2.2"/>' +
      '<path d="M44 54 C50 42 60 40 64 48 C68 56 62 64 54 62" fill="none" stroke-width="2.4"/>' +
      '<path d="M48 32 C52 22 60 20 62 28" fill="none" stroke-width="2"/>' +
      '<path d="M10 64 L4 72 M16 62 L10 72 M22 60 L18 70" fill="none" stroke-width="2"/>' +
      '<circle cx="28" cy="42" r="2.5" fill="#fffce8" stroke="none"/>' +
      '<path d="M6 68 L22 56 L38 64" fill="none" stroke-width="1.6" opacity="0.45"/>' +
      '<path d="M58 58 C62 52 66 54 64 60" fill="none" stroke-width="1.8"/>',

    aquarius:
      '<circle cx="30" cy="28" r="8" fill="url(#aquarius-f)"/>' +
      '<path d="M30 36v12 M24 42h12 M26 52h8" fill="none" stroke-width="2"/>' +
      '<path d="M38 40h4" fill="none" stroke-width="1.8"/>' +
      '<path d="M44 34 C52 30 58 32 56 40 C54 48 48 50 44 46" fill="none" stroke-width="2"/>' +
      '<path d="M56 40 C60 44 64 42 62 36" fill="none" stroke-width="1.8"/>' +
      '<path d="M48 48 C44 54 40 58 36 56" fill="none" stroke-width="1.6"/>' +
      '<path d="M52 52 C56 56 60 54 58 50" fill="none" stroke-width="1.6"/>' +
      '<path d="M34 22 C36 18 40 18 42 22" fill="none" stroke-width="1.3"/>',

    pisces:
      '<path d="M16 40 C8 46 8 60 20 66 C32 72 42 64 44 52 C46 40 38 30 26 32 C18 34 14 38 16 40Z" fill="url(#pisces-f)" stroke-width="2"/>' +
      '<path d="M64 44 C72 38 72 24 60 18 C48 12 38 20 36 32 C34 44 42 54 54 52 C62 50 66 46 64 44Z" fill="url(#pisces-f)" stroke-width="2"/>' +
      '<line x1="36" y1="42" x2="44" y2="42" stroke-width="1.5" opacity="0.7"/>' +
      '<path d="M14 40 L8 38 M66 44 L72 46" fill="none" stroke-width="1.8"/>' +
      '<circle cx="24" cy="44" r="2" fill="#fffce8" stroke="none"/>' +
      '<circle cx="56" cy="40" r="2" fill="#fffce8" stroke="none"/>',
  };

  function inject() {
    document.querySelectorAll(".cover__medallion[data-sign]").forEach(function (el) {
      var sign = el.getAttribute("data-sign");
      var art = el.querySelector(".cover__medallion-art");
      if (!art || !sign || !ICONS[sign]) return;
      art.innerHTML = wrap(sign, ICONS[sign]);
    });
  }

  return { inject: inject };
})();

(function () {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ZodiacArt.inject);
  } else {
    ZodiacArt.inject();
  }
})();
