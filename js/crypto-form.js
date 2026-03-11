/* ============================================================
   AZANOV RETREAT — CRYPTO EXCHANGE MODAL
   2-step: form (amount, currency, country, city) → success

   To enable Telegram + AmoCRM notifications, set before loading:
     window.CRYPTO_API_URL = '/api/send-crypto';
   ============================================================ */

(function () {
    'use strict';

    function t(key) {
        return (window.i18n && window.i18n.t(key)) || key;
    }

    window.openCryptoModal = function () {
        const overlay = document.getElementById('crypto-modal-overlay');
        const formStep = document.getElementById('crypto-step-form');
        const successStep = document.getElementById('crypto-step-success');
        if (!overlay || !formStep || !successStep) return;

        // Reset to form step
        formStep.style.display = '';
        successStep.style.display = 'none';
        document.getElementById('crypto-form')?.reset();
        const errEl = document.getElementById('crypto-error');
        if (errEl) {
            errEl.style.display = 'none';
            errEl.textContent = '';
        }

        overlay.classList.add('open');
        if (window.lucide) lucide.createIcons();
    };

    window.closeCryptoModal = function () {
        const overlay = document.getElementById('crypto-modal-overlay');
        if (overlay) overlay.classList.remove('open');
    };

    window.submitCryptoForm = function (e) {
        e.preventDefault();

        const amount = document.getElementById('crypto-amount')?.value?.trim();
        const currency = document.getElementById('crypto-currency')?.value;
        const country = document.getElementById('crypto-country')?.value?.trim();
        const city = document.getElementById('crypto-city')?.value?.trim();
        const name = document.getElementById('crypto-name')?.value?.trim();
        const phone = document.getElementById('crypto-phone')?.value?.trim();

        const errEl = document.getElementById('crypto-error');
        if (!amount || !currency || !country || !city || !name || !phone) {
            if (errEl) {
                errEl.textContent = t('crypto.errorRequired');
                errEl.style.display = 'block';
            }
            return false;
        }

        if (errEl) {
            errEl.style.display = 'none';
            errEl.textContent = '';
        }

        // Show success step
        document.getElementById('crypto-step-form').style.display = 'none';
        document.getElementById('crypto-step-success').style.display = '';

        if (window.lucide) lucide.createIcons();

        // Build WhatsApp message
        const msg = [
            'Здравствуйте! Заявка на обмен криптовалюты.',
            '',
            '💰 Сумма: ' + amount,
            '💵 Валюту получать: ' + currency,
            '🌍 Страна выдачи: ' + country,
            '🏙️ Город: ' + city,
            '',
            '👤 Имя: ' + name,
            '📱 Телефон: ' + phone,
            '',
            '— Отправлено с сайта azanovretreat.com'
        ].join('\n');

        // Fire-and-forget: send to Telegram + AmoCRM via API
        const apiUrl = window.CRYPTO_API_URL;
        if (apiUrl && typeof apiUrl === 'string' && apiUrl.trim()) {
            fetch(apiUrl.trim(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    amount: amount,
                    currency: currency,
                    country: country,
                    city: city,
                    source: 'azanovretreat.com',
                }),
            }).catch(function (err) {
                console.warn('Crypto API send failed:', err);
            });
        }

        // Open WhatsApp after short delay so user sees success
        setTimeout(function () {
            window.open('https://wa.me/66635412949?text=' + encodeURIComponent(msg), '_blank');
        }, 1200);

        return false;
    };

    document.addEventListener('DOMContentLoaded', function () {
        const overlay = document.getElementById('crypto-modal-overlay');
        overlay?.addEventListener('click', function (ev) {
            if (ev.target === this) closeCryptoModal();
        });
    });
})();
