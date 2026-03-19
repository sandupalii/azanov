/* ============================================================
   AZANOV TRAVEL — IMAGE OPTIMIZATION
   Thumb (cards, thumbs) / Medium (modal) / Full (fullscreen only)
   Reduces memory and bandwidth — full-size loads ONLY in fullscreen
   ============================================================ */

(function (global) {
  'use strict';

  const THUMB_W = 400;   // Cards, carousel thumbs
  const MEDIUM_W = 800;  // Modal preview
  const FULL_W = 1200;  // Fullscreen only

  function isUnsplash(url) {
    return typeof url === 'string' && url.includes('images.unsplash.com');
  }

  function isLocal(url) {
    if (typeof url !== 'string') return false;
    return !url.startsWith('http') || url.startsWith('/') || url.startsWith('./');
  }

  /** Unsplash: add w= and q= params */
  function unsplashSize(url, width, quality) {
    try {
      const u = new URL(url);
      u.searchParams.set('w', String(width));
      u.searchParams.set('q', String(quality));
      return u.toString();
    } catch {
      return url;
    }
  }

  /** Local: path to thumb/medium. PNG may be converted to .jpg by generate_thumbs.py */
  function localThumbPath(url) {
    const s = String(url).trim();
    if (s.startsWith('assets/tours/')) return url; // Tours don't have generated thumbs yet
    const base = s.startsWith('assets/') ? s.slice(7).replace(/\.(png|webp|gif)$/i, '.jpg') : s.replace(/\.(png|webp|gif)$/i, '.jpg');
    if (s.startsWith('assets/')) return 'assets/thumbs/' + base;
    if (/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp|gif)$/i.test(s)) return 'assets/thumbs/' + s.replace(/\.(png|webp|gif)$/i, '.jpg');
    return url;
  }

  function localMediumPath(url) {
    const s = String(url).trim();
    if (s.startsWith('assets/tours/')) return url; // Tours don't have generated medium yet
    const base = s.startsWith('assets/') ? s.slice(7).replace(/\.(png|webp|gif)$/i, '.jpg') : s.replace(/\.(png|webp|gif)$/i, '.jpg');
    if (s.startsWith('assets/')) return 'assets/medium/' + base;
    if (/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp|gif)$/i.test(s)) return 'assets/medium/' + s.replace(/\.(png|webp|gif)$/i, '.jpg');
    return url;
  }

  /**
   * Thumbnail URL — for cards, carousel thumbs, gallery thumbs.
   * Small file, fast load.
   */
  function toThumb(url) {
    if (!url) return '';
    if (isUnsplash(url)) return unsplashSize(url, THUMB_W, 75);
    if (isLocal(url)) return localThumbPath(url);
    return url;
  }

  /**
   * Medium URL — for modal main image.
   * Good quality, reasonable size.
   */
  function toMedium(url) {
    if (!url) return '';
    if (isUnsplash(url)) return unsplashSize(url, MEDIUM_W, 80);
    if (isLocal(url)) return localMediumPath(url);
    return url;
  }

  /**
   * Full URL — use ONLY when opening fullscreen gallery.
   * Never preload; set src only on openFullscreenGallery().
   */
  function toFull(url) {
    if (!url) return '';
    if (isUnsplash(url)) return unsplashSize(url, FULL_W, 85);
    return url; // Local: use original (or assets/full/ if we add it)
  }

  global.ImgUtils = {
    toThumb,
    toMedium,
    toFull,
    THUMB_W,
    MEDIUM_W,
    FULL_W
  };
})(typeof window !== 'undefined' ? window : this);
