/* ============================================================
   AZANOV TRAVEL — REVIEW FORM
   Sends review submissions to Telegram
   ============================================================ */

(function () {
  'use strict';

  function t(key) {
    return (window.i18n && window.i18n.t(key)) || key;
  }

  let selectedRating = 5;

  window.openReviewForm = function () {
    const overlay = document.getElementById('review-modal-overlay');
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    resetReviewForm();
    syncReviewFloatingLabels();
    if (window.lucide) lucide.createIcons();
  };

  window.closeReviewForm = function () {
    const overlay = document.getElementById('review-modal-overlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  function resetReviewForm() {
    const form = document.getElementById('review-form');
    if (form) form.reset();
    selectedRating = 5;
    document.querySelectorAll('.review-star-btn').forEach(btn => {
      btn.classList.toggle('selected', parseInt(btn.dataset.rating, 10) <= 5);
    });
    const errEl = document.getElementById('review-error');
    const successEl = document.getElementById('review-success');
    const submitBtn = document.getElementById('review-submit-btn');
    if (errEl) errEl.style.display = 'none';
    if (successEl) successEl.style.display = 'none';
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = t('review.submit');
    }
  }

  function syncReviewFloatingLabels() {
    document.querySelectorAll('#review-form .form-input, #review-form .form-textarea').forEach(el => {
      el.classList.toggle('has-value', (el.value || '').trim().length > 0);
    });
  }

  window.submitReviewForm = function (e) {
    e.preventDefault();

    const name = document.getElementById('review-name')?.value?.trim();
    const phone = document.getElementById('review-phone')?.value?.trim();
    const text = document.getElementById('review-text')?.value?.trim();
    const wishes = document.getElementById('review-wishes')?.value?.trim();

    const errEl = document.getElementById('review-error');
    const successEl = document.getElementById('review-success');
    const submitBtn = document.getElementById('review-submit-btn');

    errEl.style.display = 'none';
    successEl.style.display = 'none';

    if (!name || !text) {
      errEl.textContent = t('review.errorNameText');
      errEl.style.display = 'block';
      return false;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = t('review.sending');

    const payload = {
      name,
      phone: phone || '',
      rating: selectedRating,
      text,
      wishes: wishes || '',
      source: 'azanovretreat.com',
      timestamp: new Date().toISOString(),
    };

    const apiUrl = window.REVIEW_API_URL || '/api/send-review';

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) throw new Error(t('review.errorSend'));
        return res.json();
      })
      .then(() => {
        successEl.style.display = 'block';
        document.getElementById('review-form').reset();
        syncReviewFloatingLabels();
        setTimeout(() => {
          closeReviewForm();
        }, 2000);
      })
      .catch(() => {
        errEl.innerHTML = t('review.errorSend');
        errEl.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = t('review.submit');
      });

    return false;
  };

  document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('review-modal-overlay');
    overlay?.addEventListener('click', function (e) {
      if (e.target === this) closeReviewForm();
    });

    document.querySelectorAll('#review-form .form-input, #review-form .form-textarea').forEach(el => {
      el.addEventListener('input', syncReviewFloatingLabels);
      el.addEventListener('change', syncReviewFloatingLabels);
    });

    document.getElementById('review-form')?.addEventListener('click', function (e) {
      const btn = e.target.closest('.review-star-btn');
      if (btn) {
        e.preventDefault();
        selectedRating = parseInt(btn.dataset.rating, 10);
        document.querySelectorAll('.review-star-btn').forEach(b => {
          b.classList.toggle('selected', parseInt(b.dataset.rating, 10) <= selectedRating);
        });
      }
    });
  });
})();
