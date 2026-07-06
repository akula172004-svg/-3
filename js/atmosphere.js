/**
 * atmosphere.js — живая атмосфера: пыль, искры, вспышки, кометы.
 */

(function () {
  "use strict";

  var canvas = document.getElementById("atmosphere-canvas");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var w = 0;
  var h = 0;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var particles = [];
  var ringParticles = [];
  var flashes = [];
  var comets = [];
  var nextCometAt = 0;
  var running = true;
  var portal = { x: 0, y: 0, r: 200 };

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    updatePortal();
  }

  function updatePortal() {
    var el = document.querySelector(".cover__portal");
    if (el) {
      var rect = el.getBoundingClientRect();
      portal.x = rect.left + rect.width * 0.5;
      portal.y = rect.top + rect.height * 0.5;
      portal.r = rect.width * 0.52;
    } else {
      portal.x = w * 0.5;
      portal.y = h * 0.46;
      portal.r = Math.min(w, h) * 0.38;
    }
  }

  function initParticles() {
    particles = [];
    var count = w < 600 ? 800 : w < 1200 ? 2000 : 2800;

    for (var i = 0; i < count; i++) {
      var roll = Math.random();
      var type = "dust";

      if (roll > 0.93) type = "spark";
      else if (roll > 0.86) type = "energy";

      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        type: type,
        r: type === "spark" ? rand(1.2, 2.4) : type === "energy" ? rand(0.8, 1.5) : rand(0.3, 1.2),
        base: type === "spark" ? rand(0.18, 0.5) : type === "energy" ? rand(0.22, 0.55) : rand(0.12, 0.45),
        phase: Math.random() * Math.PI * 2,
        speed: rand(0.005, 0.02),
        gold: type !== "dust" || Math.random() > 0.4,
        driftX: rand(-0.035, 0.035),
        driftY: rand(-0.02, 0.02)
      });
    }
  }

  function initRingParticles() {
    ringParticles = [];
    var count = w < 600 ? 55 : 110;

    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var dist = rand(0.42, 0.72);

      ringParticles.push({
        angle: angle,
        dist: dist,
        r: rand(0.6, 1.8),
        base: rand(0.15, 0.55),
        phase: Math.random() * Math.PI * 2,
        speed: rand(0.004, 0.014),
        drift: rand(-0.0008, 0.0008),
        life: Math.random(),
        lifeSpeed: rand(0.002, 0.006),
        orbitSpeed: rand(-0.00015, 0.00015)
      });
    }
  }

  function scheduleComet() {
    nextCometAt = Date.now() + rand(2000, 4000);
  }

  function spawnComet() {
    if (comets.length > 0) return;

    var edge = Math.floor(Math.random() * 4);
    var startX, startY, angle;
    var isShort = Math.random() > 0.55;

    if (edge === 0) {
      startX = rand(-80, w * 0.25);
      startY = rand(-50, h * 0.4);
      angle = rand(0.25, 0.85);
    } else if (edge === 1) {
      startX = rand(w * 0.75, w + 80);
      startY = rand(-50, h * 0.4);
      angle = rand(Math.PI - 0.85, Math.PI - 0.25);
    } else if (edge === 2) {
      startX = rand(-80, w + 80);
      startY = rand(-50, h * 0.25);
      angle = rand(0.45, 1.25);
    } else {
      startX = rand(w * 0.05, w * 0.95);
      startY = rand(h * 0.02, h * 0.5);
      angle = rand(-Math.PI + 0.3, -0.3);
    }

    angle += rand(-0.15, 0.15);
    var speed = rand(1.8, 3.2);

    comets.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: isShort ? rand(50, 90) : rand(120, 200),
      life: 0,
      maxLife: isShort ? rand(1.6, 2.6) : rand(3.2, 5),
      width: rand(0.7, 1.2)
    });
  }

  function maybeFlash() {
    if (Math.random() > 0.007 || flashes.length > 4) return;

    var p = particles[(Math.random() * particles.length) | 0];
    flashes.push({
      x: p.x,
      y: p.y,
      r: rand(2, 5),
      life: 0,
      maxLife: rand(0.9, 1.8),
      gold: p.gold || Math.random() > 0.35
    });
  }

  function drawParticle(p, t) {
    var twinkle = 0.48 + 0.52 * Math.sin(t * p.speed * 55 + p.phase);
    var alpha = p.base * twinkle;
    if (alpha < 0.012) return;

    if (p.type === "energy") {
      var glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4.5);
      glow.addColorStop(0, "rgba(255, 230, 170, " + (alpha * 0.75) + ")");
      glow.addColorStop(0.5, "rgba(248, 210, 130, " + (alpha * 0.22) + ")");
      glow.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4.5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }

    if (p.type === "spark") {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 240, 200, " + (alpha * 1.15) + ")";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(248, 210, 130, " + (alpha * 0.18) + ")";
      ctx.fill();
      return;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.gold
      ? "rgba(248, 210, 130, " + alpha + ")"
      : "rgba(255, 255, 255, " + alpha + ")";
    ctx.fill();
  }

  function drawRingParticle(rp, t) {
    rp.life += rp.lifeSpeed;
    if (rp.life > 1) {
      rp.life = 0;
      rp.dist = rand(0.42, 0.72);
      rp.angle = Math.random() * Math.PI * 2;
    }

    rp.angle += rp.orbitSpeed;
    rp.dist += rp.drift;
    if (rp.dist < 0.4 || rp.dist > 0.78) rp.drift *= -1;

    var fade = rp.life < 0.15 ? rp.life / 0.15
      : rp.life > 0.85 ? (1 - rp.life) / 0.15
      : 1;

    var twinkle = 0.5 + 0.5 * Math.sin(t * rp.speed * 50 + rp.phase);
    var alpha = rp.base * twinkle * fade;
    if (alpha < 0.02) return;

    var px = portal.x + Math.cos(rp.angle) * portal.r * rp.dist;
    var py = portal.y + Math.sin(rp.angle) * portal.r * rp.dist;

    var glow = ctx.createRadialGradient(px, py, 0, px, py, rp.r * 3);
    glow.addColorStop(0, "rgba(255, 240, 200, " + (alpha * 0.9) + ")");
    glow.addColorStop(0.5, "rgba(248, 210, 130, " + (alpha * 0.25) + ")");
    glow.addColorStop(1, "transparent");

    ctx.beginPath();
    ctx.arc(px, py, rp.r * 3, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
  }

  function drawFlash(f, dt) {
    f.life += dt;
    var prog = f.life / f.maxLife;
    if (prog >= 1) return false;

    var peak = prog < 0.18 ? prog / 0.18 : 1 - (prog - 0.18) / 0.82;
    var alpha = peak * 0.8;
    var radius = f.r * (1 + peak * 2.2);

    var grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, radius * 3.5);
    if (f.gold) {
      grad.addColorStop(0, "rgba(255, 235, 180, " + alpha + ")");
      grad.addColorStop(0.35, "rgba(248, 210, 130, " + (alpha * 0.38) + ")");
    } else {
      grad.addColorStop(0, "rgba(255, 255, 255, " + alpha + ")");
      grad.addColorStop(0.35, "rgba(210, 225, 255, " + (alpha * 0.28) + ")");
    }
    grad.addColorStop(1, "transparent");

    ctx.beginPath();
    ctx.arc(f.x, f.y, radius * 3.5, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    return true;
  }

  function drawComet(c, dt) {
    c.life += dt;
    c.x += c.vx;
    c.y += c.vy;

    if (c.life > c.maxLife) return false;

    var fade = 1 - c.life / c.maxLife;
    var tailLen = c.len * 0.2;
    var tailX = c.x - c.vx * tailLen;
    var tailY = c.y - c.vy * tailLen;

    var grad = ctx.createLinearGradient(tailX, tailY, c.x, c.y);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(0.25, "rgba(248, 210, 130, " + (0.03 * fade) + ")");
    grad.addColorStop(0.6, "rgba(255, 230, 170, " + (0.22 * fade) + ")");
    grad.addColorStop(0.88, "rgba(255, 245, 215, " + (0.48 * fade) + ")");
    grad.addColorStop(1, "rgba(255, 255, 255, " + (0.7 * fade) + ")");

    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(c.x, c.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = c.width;
    ctx.lineCap = "round";
    ctx.stroke();

    var headGlow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.width * 5);
    headGlow.addColorStop(0, "rgba(255, 250, 230, " + (0.6 * fade) + ")");
    headGlow.addColorStop(0.35, "rgba(248, 210, 130, " + (0.18 * fade) + ")");
    headGlow.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.width * 5, 0, Math.PI * 2);
    ctx.fillStyle = headGlow;
    ctx.fill();

    return true;
  }

  var lastTime = 0;
  var portalUpdateTick = 0;

  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);

    var dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016;
    lastTime = now;
    var t = now / 1000;

    if (portalUpdateTick++ % 90 === 0) updatePortal();

    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.driftX;
      p.y += p.driftY;
      if (p.x < -4) p.x = w + 4;
      if (p.x > w + 4) p.x = -4;
      if (p.y < -4) p.y = h + 4;
      if (p.y > h + 4) p.y = -4;
      drawParticle(p, t);
    }

    for (var r = 0; r < ringParticles.length; r++) {
      drawRingParticle(ringParticles[r], t);
    }

    maybeFlash();

    for (var f = flashes.length - 1; f >= 0; f--) {
      if (!drawFlash(flashes[f], dt)) flashes.splice(f, 1);
    }

    if (Date.now() >= nextCometAt) {
      spawnComet();
      scheduleComet();
    }

    for (var c = comets.length - 1; c >= 0; c--) {
      if (!drawComet(comets[c], dt)) comets.splice(c, 1);
    }
  }

  resize();
  initParticles();
  initRingParticles();
  scheduleComet();

  window.addEventListener("resize", function () {
    resize();
    initParticles();
    initRingParticles();
  });

  window.addEventListener("scroll", function () {
    updatePortal();
  }, { passive: true });

  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    if (running) {
      lastTime = 0;
      requestAnimationFrame(frame);
    }
  });

  requestAnimationFrame(frame);
})();
