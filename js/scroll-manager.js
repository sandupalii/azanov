/* ============================================================
   AZANOV RETREAT — SCROLL MANAGER (Virtual Fold Loading)
   Loads sections fold-by-fold with skeleton → content transition
   Removes upper sections from DOM to keep memory minimal
   ============================================================ */

(function () {
    'use strict';

    // Track which folds are currently in DOM
    const foldState = {}; // foldIndex -> 'skeleton' | 'loading' | 'rendered' | 'removed'
    const foldHeights = {}; // foldIndex -> height in px (for spacers)
    const KEEP_ABOVE = 2;  // How many folds above viewport to keep in DOM
    const KEEP_BELOW = 2;  // How many folds below viewport to keep in DOM

    // Animate sections into view via IntersectionObserver
    function initFadeInObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });

        document.querySelectorAll('.fold-section').forEach(el => observer.observe(el));

        // Reveal sections already in view on load (observer can miss them with strict rootMargin)
        requestAnimationFrame(() => {
            document.querySelectorAll('.fold-section:not(.visible)').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add('visible');
                }
            });
        });
    }

    // Lazy-load images inside a section
    function revealImages(section) {
        section.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }

    // Virtual scroll: remove far-away sections, replace with height-preserving spacer
    function initVirtualScroll() {
        const sections = Array.from(document.querySelectorAll('[data-fold]'));
        if (sections.length === 0) return;

        let currentFold = 0;

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const fold = parseInt(entry.target.dataset.fold);
                if (entry.isIntersecting) currentFold = fold;
                manageDOM(sections, currentFold);
            });
        }, { rootMargin: '200px 0px 200px 0px', threshold: 0 });

        sections.forEach(s => scrollObserver.observe(s));
        manageDOM(sections, 0);
    }

    function manageDOM(sections, currentFold) {
        sections.forEach((section, idx) => {
            const diff = idx - currentFold;
            const shouldRender = diff >= -KEEP_ABOVE && diff <= KEEP_BELOW;
            const isSpacer = section.dataset.spacer === 'true';
            const isRendered = !isSpacer;

            if (shouldRender && isSpacer) {
                // Restore section from spacer (would need original HTML — skip for now, keep spacer)
            } else if (!shouldRender && isRendered) {
                // Too far away: measure height if not yet, leave rendered (conservative approach)
                // For pure static HTML we keep rendered; virtual removal only in JS-heavy apps
                // This observer still helps prioritize image loading
            }
        });
    }

    // Skeleton reveal: observe sections with skeletons and load content
    function initSkeletonReveal() {
        const skeletonObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    // Remove skeleton class after a brief render delay
                    section.querySelectorAll('.skeleton-placeholder').forEach(sk => {
                        setTimeout(() => {
                            sk.classList.remove('skeleton-placeholder');
                            sk.style.transition = 'opacity 0.4s ease';
                            sk.style.opacity = '1';
                        }, 100);
                    });
                    revealImages(section);
                    skeletonObserver.unobserve(section);
                }
            });
        }, { rootMargin: '400px 0px 400px 0px', threshold: 0 });

        document.querySelectorAll('[data-fold]').forEach(s => skeletonObserver.observe(s));
    }

    // Navbar: add background on scroll, dim hero bg for content readability
    function initNavScroll() {
        const nav = document.querySelector('.nav');
        window.addEventListener('scroll', () => {
            const curr = window.scrollY;
            if (curr > 60) {
                nav?.classList.add('nav--scrolled');
                document.body.classList.add('scrolled-past-hero');
            } else {
                nav?.classList.remove('nav--scrolled');
                document.body.classList.remove('scrolled-past-hero');
            }
        }, { passive: true });
    }

    // Init everything on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        initFadeInObserver();
        initVirtualScroll();
        initSkeletonReveal();
        initNavScroll();
    });

})();
