/* ============================================================
   AZANOV RETREAT — Visual Preloader (Two-Phase)

   PHASE 1 — Main overlay (existing behaviour, with limit)
   ─────────────────────────────────────────────────────────
     0–15%  DOM parsed
     15–40% Fonts ready
     40–65% Translations JSON fetched  (i18n.js → __plTranslations)
     65–80% Components rendered        (components.js → __plDone)
     80–100% Critical above-fold images (first CRITICAL_LIMIT imgs)
     → overlay fades out, user can scroll

   PHASE 2 — Background pill (bottom-right corner)
   ─────────────────────────────────────────────────────────
     After overlay gone: preload ALL remaining <img> elements
     via Image() queue (batches of 4 parallel)
     Shows: "📷 48 / 127" with mini progress bar
     → pill fades out when done
   ============================================================ */

(function () {
  'use strict';

  /* ── Config ──────────────────────────────────────────────── */
  var CRITICAL_LIMIT = 16;   // above-fold images to wait for in Phase 1
  var BG_BATCH       = 4;    // parallel loads in Phase 2 background queue
  var IMG_TIMEOUT    = 6000; // max ms to wait per image in Phase 1
  var GLOBAL_SAFETY  = 8000; // absolute max ms for entire Phase 1

  /* ── Phase 1 elements ────────────────────────────────────── */
  var el = {
    root:   document.getElementById('preloader'),
    bar:    document.getElementById('pl-bar'),
    status: document.getElementById('pl-status'),
    speed:  document.getElementById('pl-speed'),
    pct:    document.getElementById('pl-pct'),
  };

  if (!el.root) return;

  var currentPct  = 0;
  var targetPct   = 0;
  var rafId       = null;
  var bytesTotal  = 0;
  var speedTimer  = null;
  var lastBytes   = 0;
  var lastSpeedTs = Date.now();
  var phase1Done  = false;

  /* ── Progress animation ──────────────────────────────────── */
  function setProgress(target, statusText) {
    targetPct = Math.min(100, Math.max(targetPct, target));
    if (statusText !== undefined && el.status) el.status.textContent = statusText;
    if (!rafId) rafId = requestAnimationFrame(animateProgress);
  }

  function animateProgress() {
    rafId = null;
    var diff = targetPct - currentPct;
    if (diff > 0.2) {
      currentPct += diff * 0.12;
      render();
      rafId = requestAnimationFrame(animateProgress);
    } else {
      currentPct = targetPct;
      render();
      if (currentPct >= 100 && !phase1Done) finishPhase1();
    }
  }

  function render() {
    if (el.bar) el.bar.style.width = currentPct.toFixed(2) + '%';
    if (el.pct) el.pct.textContent = Math.round(currentPct) + '%';
  }

  /* ── Speed display ───────────────────────────────────────── */
  function startSpeedTracking() {
    try {
      new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (e) {
          if (e.transferSize > 0) bytesTotal += e.transferSize;
        });
      }).observe({ type: 'resource', buffered: true });
    } catch (_) {}

    speedTimer = setInterval(function () {
      var now     = Date.now();
      var elapsed = (now - lastSpeedTs) / 1000;
      if (elapsed < 0.1) return;
      var delta = bytesTotal - lastBytes;
      lastBytes   = bytesTotal;
      lastSpeedTs = now;
      if (delta > 0 && el.speed) {
        var bps = delta / elapsed;
        el.speed.textContent = bps >= 500000
          ? (bps / 1048576).toFixed(1) + ' МБ/с'
          : bps >= 1000 ? Math.round(bps / 1024) + ' КБ/с' : '';
      }
    }, 300);
  }

  /* ── Phase 1 finish → overlay fade out ──────────────────── */
  function finishPhase1() {
    if (phase1Done) return;
    phase1Done = true;
    clearInterval(speedTimer);
    if (el.status) el.status.textContent = 'Готово ✓';
    if (el.speed)  el.speed.textContent  = '';

    setTimeout(function () {
      el.root.classList.add('pl-done');
      setTimeout(function () {
        if (el.root && el.root.parentNode) el.root.parentNode.removeChild(el.root);
        // Immediately start Phase 2 after overlay is gone
        startPhase2();
      }, 500);
    }, 250);
  }

  /* ── Phase 1: Critical images ────────────────────────────── */
  function trackCriticalImages() {
    // Collect images from above-fold folds 0-3, fall back to any img
    var allImgs = Array.from(document.querySelectorAll('img[src]:not([src=""])'));
    var critical = allImgs.filter(function (img) {
      var sec = img.closest('[data-fold]');
      if (!sec) return false;
      var f = parseInt(sec.getAttribute('data-fold'));
      return f >= 0 && f <= 3;
    });
    var candidates = critical.length >= 4 ? critical : allImgs;
    candidates = candidates.slice(0, CRITICAL_LIMIT);

    var loaded  = 0;
    var pending = [];
    candidates.forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) loaded++;
      else pending.push(img);
    });
    var total = loaded + pending.length;

    if (total === 0 || pending.length === 0) {
      setProgress(100, 'Фото загружены');
      return;
    }

    function onLoad() {
      loaded++;
      setProgress(80 + Math.round((loaded / total) * 20),
        'Фото ' + loaded + ' из ' + total);
      if (loaded >= total) setProgress(100, 'Готово ✓');
    }

    setProgress(80, 'Фото ' + loaded + ' из ' + total);
    pending.forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) { onLoad(); return; }
      img.addEventListener('load',  onLoad, { once: true });
      img.addEventListener('error', onLoad, { once: true });
    });

    setTimeout(function () { if (!phase1Done) setProgress(100); }, IMG_TIMEOUT);
  }

  /* ── Phase 2: Background pill ────────────────────────────── */
  function startPhase2() {
    // Collect ALL img elements, skip already-loaded ones
    var allImgs = Array.from(
      document.querySelectorAll('img[src]:not([src=""])')
    );
    var remaining = allImgs.filter(function (img) {
      return !(img.complete && img.naturalWidth > 0);
    });

    if (remaining.length === 0) return; // Nothing to do

    // Collect unique src URLs (dedup)
    var seen = {};
    var urls = [];
    remaining.forEach(function (img) {
      var src = img.src;
      if (!seen[src]) { seen[src] = true; urls.push(src); }
    });

    var total   = urls.length;
    var loaded  = 0;
    var queue   = urls.slice();

    /* ── Build pill UI ─── */
    var pill = document.createElement('div');
    pill.id = 'pl-bg';
    pill.innerHTML =
      '<div class="pl-bg__bar-wrap"><div class="pl-bg__bar" id="pl-bg-bar"></div></div>' +
      '<div class="pl-bg__label">' +
        '<span class="pl-bg__icon">📷</span>' +
        '<span id="pl-bg-text">Подготовка...</span>' +
      '</div>';
    document.body.appendChild(pill);

    // Animate pill in after a tick
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { pill.classList.add('pl-bg--visible'); });
    });

    var bgBar  = document.getElementById('pl-bg-bar');
    var bgText = document.getElementById('pl-bg-text');

    function updatePill() {
      var pct = total > 0 ? (loaded / total) * 100 : 100;
      if (bgBar) bgBar.style.width = pct.toFixed(1) + '%';
      if (bgText) bgText.textContent = loaded + ' / ' + total + ' фото';
    }

    updatePill();

    /* ── Queue runner (BG_BATCH parallel) ─── */
    var active = 0;

    function runNext() {
      while (active < BG_BATCH && queue.length > 0) {
        var src = queue.shift();
        active++;
        var img = new window.Image();
        img.onload = img.onerror = function () {
          loaded++;
          active--;
          updatePill();
          if (queue.length > 0) {
            runNext();
          } else if (active === 0) {
            donePill();
          }
        };
        img.src = src;
      }
    }

    function donePill() {
      if (bgText) bgText.textContent = 'Все фото готовы ✓';
      if (bgBar)  bgBar.style.width = '100%';
      setTimeout(function () {
        pill.classList.remove('pl-bg--visible');
        setTimeout(function () {
          if (pill.parentNode) pill.parentNode.removeChild(pill);
        }, 500);
      }, 1500);
    }

    runNext();
  }

  /* ── Public callbacks ────────────────────────────────────── */
  window.__plTranslations = function () {
    setProgress(65, 'Строим компоненты...');
  };

  window.__plDone = function () {
    setProgress(80, 'Загружаем фото...');
    setTimeout(trackCriticalImages, 100);
  };

  /* ── Boot ────────────────────────────────────────────────── */
  setProgress(15, 'Загружаем шрифты...');
  startSpeedTracking();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      setProgress(40, 'Загружаем переводы...');
    });
  } else {
    setTimeout(function () { setProgress(40, 'Загружаем переводы...'); }, 200);
  }

  // Global safety net
  setTimeout(function () { if (!phase1Done) setProgress(100); }, GLOBAL_SAFETY);

})();
