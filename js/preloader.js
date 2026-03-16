/* ============================================================
   AZANOV RETREAT — Visual Preloader
   SEO-safe overlay: content always in DOM (Google reads it),
   preloader sits on top as position:fixed layer.

   4-stage progress tracking:
     0–20%  DOM parsed
     20–50% Fonts ready (document.fonts.ready)
     50–80% Translations JSON fetched (i18n.js callback)
     80–100% Components rendered (components.js callback)
   ============================================================ */

(function () {
  'use strict';

  var el = {
    root:   document.getElementById('preloader'),
    bar:    document.getElementById('pl-bar'),
    status: document.getElementById('pl-status'),
    speed:  document.getElementById('pl-speed'),
    pct:    document.getElementById('pl-pct'),
  };

  if (!el.root) return; // Already removed or missing

  var currentPct   = 0;
  var targetPct    = 0;
  var rafId        = null;
  var startTime    = Date.now();
  var bytesTotal   = 0;
  var speedTimer   = null;
  var lastBytes    = 0;
  var lastSpeedTs  = Date.now();
  var done         = false;

  // ── Labels (RU, matches current page language) ──────────────
  var labels = {
    init:         'Инициализация...',
    fonts:        'Загружаем шрифты...',
    translations: 'Загружаем переводы...',
    components:   'Строим компоненты...',
    done:         'Готово',
  };

  // ── Progress animation ────────────────────────────────────────
  function setProgress(target, statusText) {
    targetPct = Math.min(100, Math.max(targetPct, target));
    if (statusText && el.status) el.status.textContent = statusText;
    if (!rafId) rafId = requestAnimationFrame(animateProgress);
  }

  function animateProgress() {
    rafId = null;
    var diff = targetPct - currentPct;
    if (diff > 0.2) {
      currentPct += diff * 0.12; // ease toward target
      render();
      rafId = requestAnimationFrame(animateProgress);
    } else {
      currentPct = targetPct;
      render();
      if (currentPct >= 100 && !done) triggerDone();
    }
  }

  function render() {
    var pct = Math.round(currentPct);
    if (el.bar)  el.bar.style.width  = currentPct.toFixed(2) + '%';
    if (el.pct)  el.pct.textContent  = pct + '%';
  }

  // ── Speed tracking ────────────────────────────────────────────
  function startSpeedTracking() {
    try {
      var observer = new PerformanceObserver(function (list) {
        var entries = list.getEntries();
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (e.transferSize > 0) bytesTotal += e.transferSize;
        }
      });
      observer.observe({ type: 'resource', buffered: true });
    } catch (_) {}

    speedTimer = setInterval(function () {
      var now = Date.now();
      var elapsed = (now - lastSpeedTs) / 1000;
      if (elapsed < 0.1) return;
      var delta = bytesTotal - lastBytes;
      lastBytes = bytesTotal;
      lastSpeedTs = now;
      if (delta > 0 && el.speed) {
        var bps = delta / elapsed;
        if (bps >= 500000) {
          el.speed.textContent = (bps / 1048576).toFixed(1) + ' МБ/с';
        } else if (bps >= 1000) {
          el.speed.textContent = Math.round(bps / 1024) + ' КБ/с';
        } else {
          el.speed.textContent = '';
        }
      }
    }, 300);
  }

  // ── Done: fade out ────────────────────────────────────────────
  function triggerDone() {
    done = true;
    if (speedTimer) clearInterval(speedTimer);
    if (el.status) el.status.textContent = labels.done;
    if (el.speed)  el.speed.textContent  = '';

    // Small pause so 100% is visible, then fade out
    setTimeout(function () {
      if (el.root) el.root.classList.add('pl-done');
      // Remove from DOM after transition
      setTimeout(function () {
        if (el.root && el.root.parentNode) el.root.parentNode.removeChild(el.root);
      }, 500);
    }, 200);
  }

  // ── Public callbacks (called by i18n.js and components.js) ───
  window.__plTranslations = function () {
    setProgress(80, labels.components);
  };

  window.__plDone = function () {
    setProgress(100, labels.done);
  };

  // ── Stage 1: DOM parsed (we're running = already parsed) ─────
  setProgress(20, labels.fonts);
  startSpeedTracking();

  // ── Stage 2: Fonts ready ──────────────────────────────────────
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      setProgress(50, labels.translations);
    });
  } else {
    // Fallback: just advance
    setTimeout(function () { setProgress(50, labels.translations); }, 200);
  }

  // ── Safety net: if components never call __plDone, finish anyway ──
  setTimeout(function () {
    if (!done) setProgress(100);
  }, 4000);

})();
