/* ============================================================
   AZANOV RETREAT — i18n ENGINE
   RU/EN bilingual, auto-detect, localStorage persistence
   ============================================================ */

(function () {
  'use strict';

  const LANGS = ['ru', 'en'];
  const STORAGE_KEY = 'azanov_lang';
  let _dict = {};

  function detectLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANGS.includes(saved)) return saved;
    const b = (navigator.language || navigator.userLanguage || 'ru').toLowerCase();
    return b.startsWith('ru') ? 'ru' : 'en';
  }

  function t(key) {
    if (!key) return '';
    const val = key.split('.').reduce((o, k) => (o != null ? o[k] : undefined), _dict);
    if (val == null) return key;
    if (Array.isArray(val)) return val;
    return String(val);
  }

  function d(obj, field) {
    if (!obj || !field) return '';
    const lang = window.i18n && window.i18n.lang;
    const enField = field + '_en';
    if (lang === 'en' && obj[enField] !== undefined) return obj[enField];
    return obj[field] != null ? obj[field] : '';
  }

  function applyAll() {
    if (!document.body) return;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.dataset.i18n;
      const val = t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else if (el.getAttribute('data-i18n') && !el.hasAttribute('data-i18n-html')) {
        el.textContent = val;
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      const key = el.dataset.i18nHtml;
      el.innerHTML = t(key);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      const key = el.dataset.i18nAria;
      el.setAttribute('aria-label', t(key));
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const key = el.dataset.i18nPlaceholder;
      el.placeholder = t(key);
    });

    document.documentElement.lang = window.i18n.lang;

    const titleKey = document.body.dataset.pageTitleI18n;
    if (titleKey) document.title = t(titleKey);
    const metaDesc = document.querySelector('meta[name="description"]');
    const descKey = document.body.dataset.pageDescI18n;
    if (metaDesc && descKey) metaDesc.content = t(descKey);

    if (window.flatpickr && flatpickr.l10ns) {
      try {
        flatpickr.localize(window.i18n.lang === 'ru' ? flatpickr.l10ns.ru : flatpickr.l10ns.default);
      } catch (e) {}
    }

    if (typeof initComponents === 'function') initComponents();
    if (typeof window.refreshLeadForm === 'function') window.refreshLeadForm();

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('lang-btn--active', btn.dataset.lang === window.i18n.lang);
    });

    // Signal CSS that translations are applied — removes FOUC
    document.body.classList.add('i18n-ready');
  }

  async function _loadDict(lang) {
    try {
      const r = await fetch('translations/' + lang + '.json?v=1');
      _dict = await r.json();
      // Signal preloader: translations loaded (stage 3 → 80%)
      if (typeof window.__plTranslations === 'function') window.__plTranslations();
    } catch (e) {
      _dict = {};
    }
  }

  async function setLang(lang) {
    if (!LANGS.includes(lang)) return;
    window.i18n.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    // Show preloader immediately on lang switch
    if (typeof window.__plLangSwitch === 'function') window.__plLangSwitch(lang);
    await _loadDict(lang);
    applyAll();
    // Signal preloader that lang switch is done
    if (typeof window.__plLangDone === 'function') window.__plLangDone();
  }

  async function init() {
    const lang = detectLang();
    window.i18n = {
      lang: lang,
      t: t,
      d: d,
      setLang: setLang,
      applyAll: applyAll,
      init: init
    };
    await _loadDict(lang);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyAll);
    } else {
      applyAll();
    }
  }

  window.i18n = { lang: 'ru', t: t, d: d, setLang: setLang, applyAll: applyAll, init: init };
})();
