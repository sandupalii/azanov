/**
 * AZANOV RETREAT — Mobile nav: burger menu toggle, overlay close, body scroll lock
 */
(function () {
  function getNav() { return document.querySelector('.nav'); }
  function getBurger() { return document.getElementById('nav-burger'); }
  function getOverlay() { return document.getElementById('nav-overlay'); }
  function getDrawer() { return document.getElementById('nav-drawer'); }
  function getCloseBtn() { return document.getElementById('nav-drawer-close'); }

  function isOpen() {
    var nav = getNav();
    return nav && nav.classList.contains('nav--open');
  }

  function openMenu() {
    var nav = getNav();
    var burger = getBurger();
    var drawer = getDrawer();
    if (!nav || !burger || !drawer) return;
    nav.classList.add('nav--open');
    document.body.classList.add('nav-drawer-open');
    burger.setAttribute('aria-expanded', 'true');
    syncDrawerLangActive();
    var closeBtn = getCloseBtn();
    if (closeBtn) closeBtn.focus();
  }

  function closeMenu() {
    var nav = getNav();
    var burger = getBurger();
    if (!nav || !burger) return;
    nav.classList.remove('nav--open');
    document.body.classList.remove('nav-drawer-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.focus();
  }

  function syncDrawerLangActive() {
    var mainLang = document.querySelector('.nav__right .lang-btn--active');
    var drawerLang = document.querySelector('.nav__drawer-lang');
    if (!mainLang || !drawerLang) return;
    var activeLang = mainLang.getAttribute('data-lang');
    drawerLang.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('lang-btn--active', btn.getAttribute('data-lang') === activeLang);
    });
  }

  function onBurgerClick(e) {
    e.preventDefault();
    if (isOpen()) closeMenu(); else openMenu();
  }

  function onOverlayClick() {
    if (isOpen()) closeMenu();
  }

  function onCloseClick(e) {
    e.preventDefault();
    closeMenu();
  }

  function onDrawerLinkClick(e) {
    var a = e.target.closest('a');
    if (a && a.getAttribute('href') && a.getAttribute('href') !== '#') closeMenu();
  }

  function onKeyDown(e) {
    if (e.key !== 'Escape') return;
    if (isOpen()) {
      e.preventDefault();
      closeMenu();
    }
  }

  function bind() {
    var burger = getBurger();
    var overlay = getOverlay();
    var drawer = getDrawer();
    var closeBtn = getCloseBtn();
    if (burger) burger.addEventListener('click', onBurgerClick);
    if (overlay) overlay.addEventListener('click', onOverlayClick);
    if (closeBtn) closeBtn.addEventListener('click', onCloseClick);
    if (drawer) {
      drawer.addEventListener('click', function (e) {
        if (e.target.closest('a')) onDrawerLinkClick(e);
      });
    }
    document.addEventListener('keydown', onKeyDown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
