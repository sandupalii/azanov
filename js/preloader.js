/* ============================================================
   AZANOV RETREAT — Visual Preloader
   SEO-safe overlay: content always in DOM (Google reads it),
   preloader sits on top as position:fixed layer.

   5-stage progress tracking:
     0–15%  DOM parsed
     15–40% Fonts ready (document.fonts.ready)
     40–65% Translations JSON fetched (i18n.js callback)
     65–80% Components rendered (components.js callback)
     80–100% Critical above-fold images loaded (X из Y)
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

  if (!el.root) return;

  var currentPct  = 0;
  var targetPct   = 0;
  var rafId       = null;
  var bytesTotal  = 0;
  var speedTimer  = null;
  var lastBytes   = 0;
  var lastSpeedTs = Date.now();
  var done        = false;

  // Max images to wait for — only above-fold / first-screen cards
  // Waiting for 100+ images would make the preloader last forever
  var IMG_LIMIT = 16;
  // Safety timeout for image phase (ms)
  var IMG_TIMEOUT = 6000;

  // ── Progress animation ────────────────────────────────────────
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
      if (currentPct >= 100 && !done) triggerDone();
    }
  }

  function render() {
    if (el.bar) el.bar.style.width = currentPct.toFixed(2) + '%';
    if (el.pct) el.pct.textContent = Math.round(currentPct) + '%';
  }

  // ── Speed display ─────────────────────────────────────────────
  function startSpeedTracking() {
    try {
      var obs = new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (e) {
          if (e.transferSize > 0) bytesTotal += e.transferSize;
        });
      });
      obs.observe({ type: 'resource', buffered: true });
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
        el.speed.textContent = bps >= 500000
          ? (bps / 1048576).toFixed(1) + ' МБ/с'
          : bps >= 1000 ? Math.round(bps / 1024) + ' КБ/с' : '';
      }
    }, 300);
  }

  // ── Fade out ──────────────────────────────────────────────────
  function triggerDone() {
    if (done) return;
    done = true;
    clearInterval(speedTimer);
    if (el.status) el.status.textContent = 'Готово ✓';
    if (el.speed)  el.speed.textContent  = '';

    setTimeout(function () {
      el.root.classList.add('pl-done');
      setTimeout(function () {
        if (el.root && el.root.parentNode) el.root.parentNode.removeChild(el.root);
      }, 500);
    }, 250);
  }

  // ── Stage 5: Image loading ────────────────────────────────────
  // Called after components.js has rendered all grids.
  // Scans for above-fold images (first IMG_LIMIT), waits for them.
  function trackImages() {
    // Collect critical images: from hero + first fold sections only.
    // Exclude lazy-loaded images (loading="lazy") and images without src.
    var allImgs = Array.from(document.querySelectorAll('img[src]:not([src=""])'));

    // Prefer images from the first few sections (data-fold 0-3 + hero bg)
    // but fall back to any img if not enough
    var critical = allImgs.filter(function (img) {
      var section = img.closest('[data-fold]');
      if (!section) return false;
      var fold = parseInt(section.getAttribute('data-fold'));
      return fold >= 0 && fold <= 3;
    });

    // If we got enough critical ones, use those; otherwise use all
    var candidates = critical.length >= 4 ? critical : allImgs;

    // Skip already-complete images, limit total
    var pending = [];
    var loaded  = 0;

    candidates.slice(0, IMG_LIMIT).forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) {
        loaded++;
      } else {
        pending.push(img);
      }
    });

    var total = loaded + pending.length;

    if (total === 0 || pending.length === 0) {
      // Nothing to wait for
      setProgress(100, 'Готово ✓');
      return;
    }

    function onLoad() {
      loaded++;
      var pct = 80 + Math.round((loaded / total) * 20);
      setProgress(pct, 'Фото ' + loaded + ' из ' + total);
      if (loaded >= total) setProgress(100, 'Готово ✓');
    }

    // Initial status
    setProgress(80, 'Фото ' + loaded + ' из ' + total);

    pending.forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) {
        onLoad();
      } else {
        img.addEventListener('load',  onLoad, { once: true });
        img.addEventListener('error', onLoad, { once: true }); // broken img = skip
      }
    });

    // Safety: don't wait forever
    setTimeout(function () {
      if (!done) setProgress(100, 'Готово ✓');
    }, IMG_TIMEOUT);
  }

  // ── Public callbacks ──────────────────────────────────────────

  // Called by i18n.js after translations JSON loaded
  window.__plTranslations = function () {
    setProgress(65, 'Строим компоненты...');
  };

  // Called by components.js after initComponents() finishes
  window.__plDone = function () {
    setProgress(80, 'Загружаем фото...');
    // Small tick to let browser start layout/paint of images
    setTimeout(trackImages, 100);
  };

  // ── Stage 1 ───────────────────────────────────────────────────
  setProgress(15, 'Загружаем шрифты...');
  startSpeedTracking();

  // ── Stage 2: Fonts ───────────────────────────────────────────
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      setProgress(40, 'Загружаем переводы...');
    });
  } else {
    setTimeout(function () { setProgress(40, 'Загружаем переводы...'); }, 200);
  }

  // ── Global safety net ────────────────────────────────────────
  setTimeout(function () { if (!done) setProgress(100); }, 8000);

})();
