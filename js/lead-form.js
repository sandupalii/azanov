/* ============================================================
   AZANOV TRAVEL — MULTI-STEP LEAD GENERATION FORM
   5-step form with WhatsApp pre-fill & lead capture

   To duplicate leads to Telegram, set before loading this script:
     window.LEAD_API_URL = '/api/send-lead';  // or full URL on another domain
   ============================================================ */

(function () {
    'use strict';

    function t(key) {
        return (window.i18n && window.i18n.t(key)) || key;
    }

    let formData = {
        experienceType: null,
        packageId: null,
        packageName: null,
        yachtPreset: null,
        villaPreset: null,
        tourPreset: null,
        tourDurationDays: 1,
        servicePreset: null,
        maxGuests: null,
        groupSize: 6,
        fastTrackGuests: 2,
        fastTrackTime: '09:00',
        dateFrom: '',
        dateTo: '',
        nights: '5',
        budget: null,
        extras: [],
        contactMethod: 'whatsapp',
        name: '',
        phone: '',
        email: '',
        notes: '',
        agreePrivacy: false,
    };

    let currentStep = 1;
    const TOTAL_STEPS = 5;
    let leadDateRangePicker = null;

    function updateDateTriggerText(dateStr) {
        const trigger = document.getElementById('lead-date-trigger');
        const textEl = trigger?.querySelector('.date-input-trigger__text');
        const placeholder = t('form.step2.datesPlaceholder');
        if (textEl) textEl.textContent = dateStr || placeholder;
        if (trigger) trigger.classList.toggle('has-value', !!(dateStr && dateStr.trim()));
    }

    // Цены допуслуг: { perNight: X } = X * nights, { fixed: X } = фикс. сумма
    const ADDON_PRICES = {
        photo: { perNight: 12000 },
        chef: { perNight: 15000 },
        fasttrack: { fixed: 8000 },
        fishing: { fixed: 25000 },
        massage: { perNight: 6000 },
        bbq: { perNight: 10000 },
    };

    function syncFloatingLabels() {
        document.querySelectorAll('.form-field--float .form-input, .form-field--float .form-textarea').forEach(el => {
            el.classList.toggle('has-value', (el.value || '').trim().length > 0);
        });
    }

    function parseTourDurationDays(tourItem) {
        if (!tourItem) return 1;
        const title = (tourItem.name || tourItem.title || '').toLowerCase();
        const desc = (tourItem.desc || tourItem.description || '').toLowerCase();
        const text = title + ' ' + desc;
        if (/\d+\s*дн[яе]\/?\s*1\s*ночь|2дня|2\s*дня/.test(text)) return 2;
        if (/1\s*день|-\s*1\s*день/.test(text)) return 1;
        return 1;
    }

    function parsePackageBaseNights(nightsStr) {
        if (!nightsStr || typeof nightsStr !== 'string') return 5;
        const m = nightsStr.match(/(\d+)/);
        return m ? parseInt(m[1], 10) : 5;
    }

    // Open form with optional pre-fills
    // openLeadForm(packageId, yachtName, villaName, serviceName, tourData, opts)
    // tourData: { item } — when opening from tour modal
    // opts: { maxGuests?: number, yachtItem?: object }
    window.openLeadForm = function (packageId, yachtName, villaName, serviceName, tourData, opts) {
        // Reset form data for new entry
        formData.extras = [];
        formData.packageId = null;
        formData.packageName = null;
        formData.yachtPreset = null;
        formData.villaPreset = null;
        formData.tourPreset = null;
        formData.tourDurationDays = 1;
        formData.servicePreset = null;
        formData.maxGuests = null;
        formData.fastTrackGuests = 2;
        formData.fastTrackTime = '09:00';

        if (packageId === 'retreat') {
            formData.experienceType = null;
        } else if (tourData?.item) {
            formData.experienceType = 'tour';
            formData.tourPreset = tourData.item.name || tourData.item.title;
            formData.tourDurationDays = parseTourDurationDays(tourData.item);
            formData.nights = formData.tourDurationDays === 1 ? '0' : '1';
        } else if (packageId) {
            const pkg = window.PACKAGES?.find(p => p.id === packageId);
            formData.experienceType = 'package';
            formData.packageId = packageId;
            formData.packageName = pkg?.name || packageId;
            formData.nights = String(parsePackageBaseNights(pkg?.nights) || 5);
        } else if (yachtName) {
            formData.experienceType = 'yacht';
            formData.yachtPreset = yachtName;
            formData.nights = '0';
            if (opts?.maxGuests != null) {
                formData.maxGuests = opts.maxGuests;
            } else if (opts?.yachtItem?.guests != null) {
                formData.maxGuests = opts.yachtItem.guests;
            } else {
                const yacht = window.FLEET?.find(y => (y.name || '').trim() === (yachtName || '').trim());
                formData.maxGuests = yacht?.guests ?? null;
            }
            if (formData.maxGuests) formData.groupSize = Math.min(6, formData.maxGuests);
        } else if (villaName) {
            formData.experienceType = 'villa';
            formData.villaPreset = villaName;
            formData.nights = '5';
        } else if (serviceName) {
            formData.experienceType = 'concierge';
            formData.servicePreset = serviceName;
            formData.nights = '5';
        } else {
            formData.experienceType = null;
        }

        currentStep = formData.experienceType && formData.experienceType !== 'retreat' ? 2 : 1;
        document.querySelectorAll('.addon-toggle-btn').forEach(b => b.classList.remove('selected'));
        renderStep();

        const overlay = document.getElementById('lead-modal-overlay');
        if (overlay) {
            overlay.classList.add('open');
        }
    };

    window.closeLeadModal = function () {
        const overlay = document.getElementById('lead-modal-overlay');
        if (overlay) {
            overlay.classList.remove('open');
        }
    };

    function updateDateClearVisibility() {
        const clearBtn = document.getElementById('lead-date-clear');
        const dateInput = document.getElementById('lead-date-range');
        if (!clearBtn || !dateInput) return;
        const hasValue = !!(formData.dateFrom && formData.dateTo);
        clearBtn.hidden = !hasValue;
        clearBtn.setAttribute('aria-hidden', !hasValue);
    }

    window.openLeadDatePicker = function (e) {
        if (e) e.stopPropagation();
        if (leadDateRangePicker) leadDateRangePicker.open();
    };

    window.clearLeadDates = function (e) {
        if (e) e.stopPropagation();
        formData.dateFrom = '';
        formData.dateTo = '';
        const fromInput = document.getElementById('lead-date-from');
        const toInput = document.getElementById('lead-date-to');
        const dateRangeInput = document.getElementById('lead-date-range');
        if (fromInput) fromInput.value = '';
        if (toInput) toInput.value = '';
        if (dateRangeInput) dateRangeInput.value = '';
        if (leadDateRangePicker) leadDateRangePicker.clear();
        updateStep2Summary();
        updateStep3State();
        const step2Next = document.getElementById('lead-step-2-next');
        if (step2Next) step2Next.disabled = true;
        updateDateClearVisibility();
    };

    window.resetLeadForm = function () {
        currentStep = 1;
        formData.experienceType = null;
        formData.packageId = null;
        formData.packageName = null;
        formData.yachtPreset = null;
        formData.villaPreset = null;
        formData.tourPreset = null;
        formData.tourDurationDays = 1;
        formData.servicePreset = null;
        formData.maxGuests = null;

        document.querySelectorAll('.choice-btn, .choice-btn--sm').forEach(b => b.classList.remove('selected'));
        document.querySelectorAll('.addon-toggle-btn').forEach(b => b.classList.remove('selected'));

        formData.groupSize = 6;
        formData.fastTrackGuests = 2;
        formData.fastTrackTime = '09:00';
        formData.nights = '5';
        formData.dateFrom = '';
        formData.dateTo = '';
        const groupInput = document.getElementById('lead-group-size');
        const nightsInput = document.getElementById('lead-nights');
        if (groupInput) groupInput.value = 6;
        if (nightsInput) nightsInput.value = '5';
        if (leadDateRangePicker) leadDateRangePicker.clear();

        renderStep();
    };

    function buildTimeOptions(selectEl) {
        if (!selectEl) return;
        selectEl.innerHTML = ''; // Clear existing options
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 30) {
                const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                selectEl.appendChild(option);
            }
        }
    }

    window.setFTTime = function (val) {
        formData.fastTrackTime = val;
        updateStep2Summary();
    };

    function renderStep() {
        const stepsEl = document.querySelectorAll('.lead-step');
        stepsEl.forEach(s => s.classList.remove('active'));
        const activeEl = document.getElementById(`lead-step-${currentStep}`);

        if (activeEl) {
            activeEl.classList.add('active');

            // Step 2: sync guests + nights, default dates, update sidebar summary
            if (currentStep === 2) {
                // Dynamic title and summary label by experience type
                const step2Title = activeEl.querySelector('.lead-step__title');
                const summaryTitle = document.querySelector('#lead-step-2-summary .lead-step-2-summary__title');
                const step2Titles = {
                    yacht: { question: t('form.step2.questionYacht'), summary: t('form.step2.summaryCharter') },
                    villa: { question: t('form.step2.questionVilla'), summary: t('form.step2.summaryVilla') },
                    tour: { question: t('form.step2.questionTour'), summary: t('form.step2.summaryTour') },
                    package: { question: t('form.step2.questionPackage'), summary: t('form.step2.summary') },
                    retreat: { question: t('form.step2.questionPackage'), summary: t('form.step2.summary') },
                    concierge: { question: t('form.step2.questionConcierge'), summary: t('form.step2.summaryOrder') },
                    bikes: { question: t('form.step2.questionBikes'), summary: t('form.step2.summaryOrder') }
                };
                const step2TitleSet = step2Titles[formData.experienceType] || step2Titles.retreat;
                if (step2Title) step2Title.textContent = step2TitleSet.question;
                if (summaryTitle) summaryTitle.textContent = step2TitleSet.summary;

                // Toggle between tile grid (default) and stepper (Fast Track / concierge)
                const isConcierge = formData.experienceType === 'concierge';
                const guestsGrid = document.getElementById('lead-step-2-guests');
                const stepperWrap = document.getElementById('lead-step-2-guests-stepper-wrap');
                if (guestsGrid) guestsGrid.style.display = isConcierge ? 'none' : '';
                if (stepperWrap) stepperWrap.classList.toggle('visible', isConcierge);

                if (isConcierge) {
                    // Sync stepper UI
                    const ftInput = document.getElementById('ft-guests-input');
                    if (ftInput) ftInput.value = formData.fastTrackGuests;
                    updateStepperBtns();
                    // Make groupSize reflect fast track count for downstream use
                    formData.groupSize = formData.fastTrackGuests;
                    const hiddenGroup = document.getElementById('lead-group-size');
                    if (hiddenGroup) hiddenGroup.value = formData.fastTrackGuests;
                } else {
                    const maxGuests = formData.experienceType === 'yacht' && formData.maxGuests ? formData.maxGuests : 28;
                    const g = Math.max(2, Math.min(maxGuests, parseInt(formData.groupSize, 10) || 6));
                    formData.groupSize = g;
                    document.querySelectorAll('#lead-step-2 #lead-step-2-guests .choice-btn').forEach(btn => {
                        const size = parseInt(btn.getAttribute('data-group-size'), 10);
                        const isHidden = formData.experienceType === 'yacht' && formData.maxGuests && size > formData.maxGuests;
                        btn.classList.toggle('selected', !isHidden && String(size) === String(g));
                        btn.style.display = isHidden ? 'none' : '';
                    });
                }

                // Toggle time selector for Fast Track
                const ftTimeWrap = document.getElementById('lead-ft-time-wrap');
                const datesLabel = activeEl.querySelector('.lead-step-2-dates-main .form-label');
                if (isConcierge) {
                    if (ftTimeWrap) ftTimeWrap.style.display = 'block';
                    if (datesLabel) datesLabel.textContent = t('form.step2.arrivalDateLabel');
                    // Populate time options if empty
                    const ftSel = document.getElementById('lead-ft-time-select');
                    if (ftSel && ftSel.options.length === 0) {
                        buildTimeOptions(ftSel);
                    }
                    if (ftSel) ftSel.value = formData.fastTrackTime;
                } else {
                    if (ftTimeWrap) ftTimeWrap.style.display = 'none';
                    if (datesLabel) datesLabel.setAttribute('data-i18n', 'form.step2.datesLabel');
                    if (datesLabel) datesLabel.textContent = t('form.step2.datesLabel');
                }

                // Show nights chips for package and yacht (different chip sets)
                const nightsSection = document.getElementById('lead-nights-section');
                const chipsContainer = document.querySelector('#lead-step-2 .lead-nights-chips');
                if (nightsSection) {
                    // Hide nights chips for concierge/Fast Track (no nights concept) and for retreat/villa/bikes/tour
                    const showNights = (formData.experienceType === 'package' || formData.experienceType === 'yacht') && !isConcierge;
                    nightsSection.classList.toggle('lead-nights-section--hidden', !showNights);
                }
                if (chipsContainer) {
                    if (formData.experienceType === 'yacht') {
                        const yachtChips = [
                            { nights: '0', label: t('form.step2.yacht1day') },
                            { nights: '1', label: t('form.step2.yacht2days') },
                            { nights: '2', label: t('form.step2.yacht3days') },
                            { nights: '5', label: t('form.step2.yacht5nights') },
                            { nights: '7', label: t('form.step2.yacht7nights') }
                        ];
                        chipsContainer.innerHTML = yachtChips.map(c => `
                            <button type="button" class="choice-btn choice-btn--sm" data-nights="${c.nights}"
                                onclick="setNightsFromChip(${c.nights === '0' ? '0' : c.nights}, this)">${c.label}</button>
                        `).join('');
                        chipsContainer.querySelectorAll('.choice-btn--sm').forEach(btn => {
                            btn.classList.toggle('selected', String(btn.getAttribute('data-nights')) === String(formData.nights));
                        });
                        if (window.lucide) lucide.createIcons();
                    } else if (formData.experienceType === 'package') {
                        chipsContainer.innerHTML = `
                            <button type="button" class="choice-btn choice-btn--sm" data-nights="5" onclick="setNightsFromChip(5, this)">${t('form.step2.package5nights')}</button>
                            <button type="button" class="choice-btn choice-btn--sm" data-nights="7" onclick="setNightsFromChip(7, this)">${t('form.step2.package7nights')}</button>
                            <button type="button" class="choice-btn choice-btn--sm" data-nights="10" onclick="setNightsFromChip(10, this)">${t('form.step2.package10nights')}</button>
                            <button type="button" class="choice-btn choice-btn--sm" data-nights="14" onclick="setNightsFromChip(14, this)">${t('form.step2.package2weeks')}</button>
                            <button type="button" class="choice-btn choice-btn--sm" data-nights="30" onclick="setNightsFromChip(30, this)">${t('form.step2.packageMonth')}</button>
                        `;
                        chipsContainer.querySelectorAll('.choice-btn--sm').forEach(btn => {
                            btn.classList.toggle('selected', String(btn.getAttribute('data-nights')) === String(formData.nights));
                        });
                    }
                }

                const hiddenNights = document.getElementById('lead-nights');
                if (!isConcierge) {
                    const hiddenGroup2 = document.getElementById('lead-group-size');
                    if (hiddenGroup2) hiddenGroup2.value = formData.groupSize;
                }
                if (hiddenNights) hiddenNights.value = (formData.nights !== undefined && formData.nights !== '') ? formData.nights : '5';

                if (leadDateRangePicker) {
                    const dateRangeInput = document.getElementById('lead-date-range');
                    if (!formData.dateFrom) {
                        const today = new Date();
                        let end;
                        if (isConcierge) {
                            end = new Date(today); // same day
                        } else if (formData.experienceType === 'tour') {
                            const days = formData.tourDurationDays || 1;
                            end = new Date(today);
                            end.setDate(end.getDate() + Math.max(0, days - 1));
                            formData.nights = days === 1 ? '0' : String(days - 1);
                        } else if (formData.experienceType === 'yacht' && (parseInt(formData.nights, 10) || 0) === 0) {
                            end = new Date(today);
                        } else {
                            const nights = parseInt(formData.nights, 10) || 5;
                            end = new Date(today);
                            end.setDate(end.getDate() + nights);
                        }
                        formData.dateFrom = formatDateDMY(today);
                        formData.dateTo = formatDateDMY(end);
                        const fromInput = document.getElementById('lead-date-from');
                        const toInput = document.getElementById('lead-date-to');
                        if (fromInput) fromInput.value = formData.dateFrom;
                        if (toInput) toInput.value = formData.dateTo;
                        leadDateRangePicker.setDate(today);
                        // Display: single date for concierge, range for others
                        if (isConcierge) {
                            if (dateRangeInput) dateRangeInput.value = formatDateSingle(today);
                        } else {
                            if (dateRangeInput) dateRangeInput.value = formatDateRangeDisplay(today, end);
                        }
                    }
                }
                const step2Next = document.getElementById('lead-step-2-next');
                if (step2Next) step2Next.disabled = isConcierge ? !formData.dateFrom : !(formData.dateFrom && formData.dateTo);
                updateStep2Summary();
                updateStep3State();
                updateDateClearVisibility();
            }

            // Step 3: Show package price OR budget selector depending on experience type
            if (currentStep === 3) {
                const isPackage = formData.experienceType === 'package';
                const packagePriceBlock = document.getElementById('lead-step3-package-price');
                const budgetBlock = document.getElementById('lead-step3-budget');
                const step3Title = document.getElementById('lead-step3-title');
                const step3Desc = document.getElementById('lead-step3-desc');

                if (isPackage) {
                    // Show fixed price block, hide budget selector
                    if (packagePriceBlock) packagePriceBlock.style.display = '';
                    if (budgetBlock) budgetBlock.style.display = 'none';
                    // Clear any previously selected budget — it doesn't apply to packages
                    formData.budget = null;
                    document.querySelectorAll('.budget-option').forEach(b => b.classList.remove('selected'));
                    // Update title/desc
                    if (step3Title) step3Title.textContent = t('form.step3.titlePackage') || 'Допуслуги к пакету';
                    if (step3Desc) step3Desc.textContent = t('form.step3.descPackage') || 'Цена пакета фиксирована. Вы можете добавить дополнительные сервисы.';
                    // Render scaled price
                    const scaledPrice = getPackageScaledPrice();
                    const priceAmountEl = document.getElementById('lead-step3-price-amount');
                    if (priceAmountEl) {
                        if (scaledPrice != null) {
                            const nights = parseInt(formData.nights, 10) || 5;
                            const nightsLabel = getNightsLabel();
                            priceAmountEl.textContent = `${t('card.from') || 'от'} ${formatPrice(scaledPrice)} — ${nightsLabel}`;
                        } else {
                            priceAmountEl.textContent = '—';
                        }
                    }
                } else {
                    // Show budget selector, hide package price block
                    if (packagePriceBlock) packagePriceBlock.style.display = 'none';
                    if (budgetBlock) budgetBlock.style.display = '';
                    // Restore default title/desc
                    if (step3Title && !step3Title.dataset.i18nSet) {
                        step3Title.textContent = t('form.step3.title') || 'Ваш бюджет и желания';
                    }
                    if (step3Desc && !step3Desc.dataset.i18nSet) {
                        step3Desc.textContent = t('form.step3.desc') || 'Выберите ценовой диапазон и дополнительные опции.';
                    }
                }
                updateAddonPrices();
            }

            // Dynamic Step 4 Context (Budget & Extras) — kept for backwards compat
            if (currentStep === 4) {
                const extrasTitle = activeEl.querySelector('.lead-step__title');
                if (formData.experienceType === 'yacht') {
                    if (extrasTitle) extrasTitle.innerText = t('form.step3extras.yacht');
                } else if (formData.experienceType === 'villa') {
                    if (extrasTitle) extrasTitle.innerText = t('form.step3extras.villa');
                } else if (formData.experienceType === 'package') {
                    if (extrasTitle) extrasTitle.innerText = t('form.step3extras.package');
                }
                updateAddonPrices();
            }

            // Auto-select experience choice if we skipped step 1 (match by data-experience for i18n robustness)
            if (currentStep === 2 && formData.experienceType) {
                document.querySelectorAll('#lead-step-1 .choice-btn').forEach(b => {
                    const exp = b.dataset.experience;
                    if (!exp) return;
                    if (exp === formData.experienceType) b.classList.add('selected');
                    else if (formData.experienceType === 'package' && exp === 'retreat') b.classList.add('selected');
                });
            }
        }

        // Update progress (story-style segments)
        document.querySelectorAll('.lead-progress-segment').forEach((seg, i) => {
            seg.classList.toggle('filled', i + 1 <= currentStep);
        });
        const storiesEl = document.querySelector('.lead-progress-stories');
        if (storiesEl) storiesEl.setAttribute('aria-valuenow', currentStep);

        // Update step counter (handled statically via data-i18n now)

        if (window.lucide) lucide.createIcons();
        syncFloatingLabels();
    }

    function sendLeadToApi() {
        const apiUrl = window.LEAD_API_URL;
        if (!apiUrl || typeof apiUrl !== 'string' || !apiUrl.trim()) return;
        const payload = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email || '',
            experienceType: formData.experienceType,
            packageName: formData.packageName || '',
            yachtPreset: formData.yachtPreset || '',
            villaPreset: formData.villaPreset || '',
            tourPreset: formData.tourPreset || '',
            servicePreset: formData.servicePreset || '',
            groupSize: formData.groupSize,
            dateFrom: formData.dateFrom,
            dateTo: formData.dateTo,
            nights: formData.nights,
            budget: formData.budget,
            extras: formData.extras,
            notes: formData.notes || '',
            contactMethod: formData.contactMethod,
            source: 'azanovretreat.com',
        };
        fetch(apiUrl.trim(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }).catch((err) => console.warn('Lead API send failed:', err));
    }

    window.nextStep = function () {
        if (!validateStep(currentStep)) return;
        // Step 4 = contact (name, phone): send API request when user clicks "Review"
        if (currentStep === 4) {
            const nameEl = document.getElementById('lead-name');
            const phoneEl = document.getElementById('lead-phone');
            const emailEl = document.getElementById('lead-email');
            const notesEl = document.getElementById('lead-notes');
            if (nameEl) formData.name = nameEl.value.trim();
            if (phoneEl) formData.phone = phoneEl.value.trim();
            if (emailEl) formData.email = emailEl.value.trim();
            if (notesEl) formData.notes = notesEl.value.trim();
            const addonBtns = document.querySelectorAll('.addon-toggle-btn.selected');
            const addonCheckboxes = document.querySelectorAll('.lead-extra:checked');
            formData.extras = addonBtns.length
                ? Array.from(addonBtns).map(el => el.getAttribute('data-addon'))
                : Array.from(addonCheckboxes).map(el => el.value);
            formData.groupSize = document.getElementById('lead-group-size')?.value || formData.groupSize;
            formData.dateFrom = document.getElementById('lead-date-from')?.value || formData.dateFrom || '';
            formData.dateTo = document.getElementById('lead-date-to')?.value || formData.dateTo || '';
            formData.nights = document.getElementById('lead-nights')?.value || '5';
            sendLeadToApi();
        }
        if (currentStep < TOTAL_STEPS) {
            currentStep++;
            renderStep();
        }
    };

    window.prevStep = function () {
        // If we skipped step 1, prev from 2 goes back to 1 to allow choice change
        if (currentStep > 1) {
            currentStep--;
            renderStep();
        }
    };

    window.selectExperience = function (type, el) {
        formData.experienceType = type;
        document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
        el.classList.add('selected');
    };

    window.selectBudget = function (val, el) {
        formData.budget = val;
        document.querySelectorAll('.budget-option').forEach(b => b.classList.remove('selected'));
        el.classList.add('selected');
    };

    function calcAddonPrice(addonId) {
        const cfg = ADDON_PRICES[addonId];
        if (!cfg) return 0;
        const rawNights = parseInt(formData.nights, 10) || 5;
        const nights = formData.experienceType === 'yacht'
            ? (rawNights === 0 ? 1 : Math.max(1, rawNights))
            : Math.max(5, rawNights);
        if (cfg.perNight) return cfg.perNight * nights;
        if (cfg.fixed) return cfg.fixed;
        return 0;
    }

    function formatPrice(val) {
        if (val >= 1000000) return (val / 1000000).toFixed(1).replace('.', ',') + 'M ฿';
        if (val >= 1000) return (val / 1000).toFixed(0) + 'k ฿';
        return val + ' ฿';
    }

    window.updateAddonPrices = function () {
        document.querySelectorAll('[data-addon-price]').forEach(el => {
            const addonId = el.getAttribute('data-addon-price');
            const price = calcAddonPrice(addonId);
            el.textContent = formatPrice(price);
        });
    };

    window.toggleAddon = function (addonId, el) {
        el.classList.toggle('selected');
    };

    window.selectContactMethod = function (method, el) {
        formData.contactMethod = method;
        document.querySelectorAll('.contact-method-btn').forEach(b => b.classList.remove('selected'));
        el.classList.add('selected');
    };

    window.setGroupSize = function (val, el) {
        const maxGuests = formData.experienceType === 'yacht' && formData.maxGuests ? formData.maxGuests : 28;
        val = Math.max(2, Math.min(maxGuests, parseInt(val, 10) || 6));
        formData.groupSize = val;
        const hiddenInput = document.getElementById('lead-group-size');
        if (hiddenInput) hiddenInput.value = val;
        if (el && el.parentElement) {
            el.parentElement.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
            el.classList.add('selected');
        }
        updateStep2Summary();
    };

    function updateStepperBtns() {
        const decBtn = document.getElementById('ft-guests-dec');
        if (decBtn) decBtn.disabled = formData.fastTrackGuests <= 1;
    }

    window.changeFTGuests = function (delta) {
        const newVal = Math.max(1, Math.min(99, (formData.fastTrackGuests || 2) + delta));
        formData.fastTrackGuests = newVal;
        formData.groupSize = newVal;
        const ftInput = document.getElementById('ft-guests-input');
        if (ftInput) ftInput.value = newVal;
        const hiddenInput = document.getElementById('lead-group-size');
        if (hiddenInput) hiddenInput.value = newVal;
        updateStepperBtns();
        updateStep2Summary();
    };

    window.onFTGuestsInput = function (el) {
        const raw = parseInt(el.value, 10);
        const newVal = isNaN(raw) ? 1 : Math.max(1, Math.min(99, raw));
        formData.fastTrackGuests = newVal;
        formData.groupSize = newVal;
        el.value = newVal;
        const hiddenInput = document.getElementById('lead-group-size');
        if (hiddenInput) hiddenInput.value = newVal;
        updateStepperBtns();
        updateStep2Summary();
    };

    window.setNightsOnly = function (nights, el) {
        formData.nights = nights;
        const nightsInput = document.getElementById('lead-nights');
        if (nightsInput) nightsInput.value = String(nights);
        if (el && el.parentElement) {
            el.parentElement.querySelectorAll('.choice-btn--sm').forEach(b => b.classList.remove('selected'));
            el.classList.add('selected');
        }
        updateStep2Summary();
    };

    window.setNightsFromChip = function (nights, el) {
        formData.nights = String(nights);
        const nightsInput = document.getElementById('lead-nights');
        if (nightsInput) nightsInput.value = formData.nights;
        document.querySelectorAll('#lead-step-2 .lead-nights-chips .choice-btn--sm').forEach(b => {
            b.classList.toggle('selected', String(b.getAttribute('data-nights')) === formData.nights);
        });
        if (leadDateRangePicker && formData.dateFrom) {
            const [d, m, y] = formData.dateFrom.split('.');
            const from = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
            const to = new Date(from);
            const nights = parseInt(formData.nights, 10);
            to.setDate(to.getDate() + (formData.experienceType === 'yacht' && nights === 0 ? 0 : nights || 5));
            formData.dateTo = formatDateDMY(to);
            const toInput = document.getElementById('lead-date-to');
            const dateRangeInput = document.getElementById('lead-date-range');
            if (toInput) toInput.value = formData.dateTo;
            if (dateRangeInput) dateRangeInput.value = formatDateRangeDisplay(from, to);
            leadDateRangePicker.setDate(from);
        }
        updateStep2Summary();
        if (document.getElementById('lead-date-summary')) updateStep3State();
    };

    function formatDateSingle(d) {
        const monthsCap = (window.i18n && window.i18n.t('form.monthsCap')) || ['January','February','March','April','May','June','July','August','September','October','November','December'];
        return `${d.getDate()} ${monthsCap[d.getMonth()]} ${d.getFullYear()}`;
    }

    function formatDateDMY(d) {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
    }

    function formatDateLong(d) {
        const months = (window.i18n && window.i18n.t('form.monthsGenitive')) || ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }

    function formatDateRangeDisplay(fromD, toD) {
        const monthsCap = (window.i18n && window.i18n.t('form.monthsCap')) || ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
        const monthsLower = (window.i18n && window.i18n.t('form.monthsGenitive')) || ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        const by = t('form.dateRangeBy');
        return `${fromD.getDate()} ${monthsCap[fromD.getMonth()]} ${fromD.getFullYear()}${by}${toD.getDate()} ${monthsLower[toD.getMonth()]} ${toD.getFullYear()}`;
    }

    function getSummaryItemName() {
        if (formData.packageName) return formData.packageName;
        if (formData.yachtPreset) return formData.yachtPreset;
        if (formData.villaPreset) return formData.villaPreset;
        if (formData.tourPreset) return `${t('form.tourPrefix')} ${formData.tourPreset}`;
        if (formData.servicePreset) return formData.servicePreset;
        const typeLabels = { retreat: t('form.step1.retreat'), villa: t('form.step1.villa'), yacht: t('form.step1.yacht'), bikes: t('form.step1.bikes'), package: t('form.step1.package'), tour: t('form.step1.tour'), concierge: t('form.step1.concierge') };
        return formData.experienceType ? (typeLabels[formData.experienceType] || formData.experienceType) : null;
    }

    function getPackageScaledPrice() {
        if (formData.experienceType !== 'package' || !formData.packageId) return null;
        const pkg = window.PACKAGES?.find(p => p.id === formData.packageId);
        if (!pkg || typeof pkg.price !== 'number') return null;
        const baseNights = parsePackageBaseNights(pkg.nights);
        const selectedNights = parseInt(formData.nights, 10) || baseNights;
        return Math.round(pkg.price * (selectedNights / baseNights));
    }

    function getNightsLabel() {
        if (formData.experienceType === 'tour') {
            return formData.tourDurationDays === 1 ? t('form.step2.tour1day') : (formData.tourDurationDays === 2 ? t('form.step2.tour2days') : t('form.step2.tourNdays').replace('{n}', formData.tourDurationDays));
        }
        if (formData.experienceType === 'yacht') {
            const yachtLabels = { 0: t('form.step2.yacht1day'), 1: t('form.step2.yacht2days'), 2: t('form.step2.yacht3days'), 5: t('form.step2.yacht5nights'), 7: t('form.step2.yacht7nights') };
            return yachtLabels[parseInt(formData.nights, 10)] ?? t('form.step2.nightsFormat').replace('{n}', formData.nights);
        }
        const nightsLabels = { 5: t('form.step2.package5nights'), 7: t('form.step2.package7nights'), 10: t('form.step2.package10nights'), 14: t('form.step2.package2weeks'), 30: t('form.step2.packageMonth') };
        return nightsLabels[parseInt(formData.nights, 10)] || t('form.step2.nightsFormat').replace('{n}', formData.nights);
    }

    function updateStep2Summary() {
        const itemEl = document.getElementById('lead-summary-item');
        const guestsEl = document.getElementById('lead-summary-guests');
        const nightsEl = document.getElementById('lead-summary-nights');
        const priceEl = document.getElementById('lead-summary-price');
        const datesEl = document.getElementById('lead-summary-dates');
        const itemName = getSummaryItemName();
        if (itemEl) {
            itemEl.textContent = itemName || '—';
            itemEl.classList.toggle('has-value', !!itemName);
        }
        const effectiveGuests = formData.experienceType === 'concierge' ? formData.fastTrackGuests : formData.groupSize;
        if (guestsEl) guestsEl.textContent = effectiveGuests ? t('form.step2.guestsCount').replace('{n}', effectiveGuests) : '—';

        if (nightsEl) {
            if (formData.experienceType === 'concierge') {
                // Show arrival time instead of nights
                nightsEl.textContent = formData.fastTrackTime ? `🕐 ${formData.fastTrackTime}` : '—';
            } else {
                nightsEl.textContent = getNightsLabel() || '—';
            }
        }

        if (priceEl) {
            const scaledPrice = getPackageScaledPrice();
            if (formData.experienceType === 'package' && scaledPrice != null) {
                priceEl.textContent = `${t('card.from')} ${formatPrice(scaledPrice)}`;
                priceEl.style.display = '';
            } else {
                priceEl.style.display = 'none';
            }
        }

        if (datesEl) {
            if (formData.dateFrom) {
                const [d1, m1, y1] = formData.dateFrom.split('.');
                const fromD = new Date(parseInt(y1, 10), parseInt(m1, 10) - 1, parseInt(d1, 10));
                if (formData.experienceType === 'concierge') {
                    // Show only arrival date for Fast Track
                    datesEl.textContent = formatDateSingle(fromD);
                } else if (formData.dateTo) {
                    const [d2, m2, y2] = formData.dateTo.split('.');
                    const toD = new Date(parseInt(y2, 10), parseInt(m2, 10) - 1, parseInt(d2, 10));
                    datesEl.textContent = `${formatDateLong(fromD)} — ${formatDateLong(toD)}`;
                } else {
                    datesEl.textContent = formatDateLong(fromD);
                }
            } else {
                datesEl.textContent = '—';
            }
        }
    }

    function updateStep3State() {
        const step3 = document.getElementById('lead-step-3');
        if (!step3 || !step3.classList.contains('active')) return;
        const dateSummaryEl = document.getElementById('lead-date-summary');
        const fromInput = document.getElementById('lead-date-from');
        const toInput = document.getElementById('lead-date-to');
        if (fromInput) fromInput.value = formData.dateFrom || '';
        if (toInput) toInput.value = formData.dateTo || '';

        const durationLabel = getNightsLabel();
        if (formData.dateFrom && formData.dateTo && dateSummaryEl) {
            const [d1, m1, y1] = formData.dateFrom.split('.');
            const [d2, m2, y2] = formData.dateTo.split('.');
            const fromD = new Date(parseInt(y1, 10), parseInt(m1, 10) - 1, parseInt(d1, 10));
            const toD = new Date(parseInt(y2, 10), parseInt(m2, 10) - 1, parseInt(d2, 10));
            dateSummaryEl.textContent = `${t('form.step2.departure')}: ${formatDateLong(toD)} (${durationLabel})`;
        } else if (dateSummaryEl) {
            dateSummaryEl.textContent = '';
        }
    }

    function validateStep(step) {
        let valid = true;
        if (step === 1 && !formData.experienceType) {
            showError(t('form.errorSelectExperience')); valid = false;
        }
        if (step === 2) {
            if (formData.experienceType !== 'concierge' && !formData.groupSize) {
                showError(t('form.errorSelectGuests')); valid = false;
            }
            if (formData.experienceType === 'concierge') {
                if (!formData.dateFrom) {
                    showError(t('form.errorSelectDates')); valid = false;
                }
            } else if (!formData.dateFrom || !formData.dateTo) {
                showError(t('form.errorSelectDates')); valid = false;
            }
        }
        if (step === 4) {
            // Packages have fixed prices — budget selection is not required
            if (!formData.budget && formData.experienceType !== 'package') {
                showError(t('form.errorSelectBudget')); valid = false;
            }
            // Step 4 = contact: also require name and phone before sending
            const nameEl = document.getElementById('lead-name');
            const phoneEl = document.getElementById('lead-phone');
            if (nameEl) formData.name = nameEl.value.trim();
            if (phoneEl) formData.phone = phoneEl.value.trim();
            if (!formData.name || !formData.phone) {
                showError(t('form.errorEnterNamePhone')); valid = false;
            }
        }
        return valid;
    }

    function showError(msg) {
        let errEl = document.getElementById('lead-error');
        if (!errEl) return;
        errEl.textContent = msg;
        errEl.style.display = 'block';
        setTimeout(() => { errEl.style.display = 'none'; }, 3000);
    }

    window.submitLeadForm = function () {
        // Collect final fields
        const nameEl = document.getElementById('lead-name');
        const phoneEl = document.getElementById('lead-phone');
        const emailEl = document.getElementById('lead-email');
        const notesEl = document.getElementById('lead-notes');
        const privacyEl = document.getElementById('lead-privacy');

        if (nameEl) formData.name = nameEl.value.trim();
        if (phoneEl) formData.phone = phoneEl.value.trim();
        if (emailEl) formData.email = emailEl.value.trim();
        if (notesEl) formData.notes = notesEl.value.trim();
        if (privacyEl) formData.agreePrivacy = privacyEl.checked;

        if (!formData.name || !formData.phone) {
            showError(t('form.errorEnterNamePhone')); return;
        }

        // Collect extras (from addon toggle buttons)
        formData.extras = Array.from(document.querySelectorAll('.addon-toggle-btn.selected')).map(el => el.getAttribute('data-addon'));
        formData.groupSize = document.getElementById('lead-group-size')?.value || formData.groupSize;
        formData.dateFrom = document.getElementById('lead-date-from')?.value || formData.dateFrom || '';
        formData.dateTo = document.getElementById('lead-date-to')?.value || formData.dateTo || '';
        formData.nights = document.getElementById('lead-nights')?.value || '5';

        // Show success step
        currentStep = 6;
        renderStep();

        // Build WhatsApp message
        const waMsg = buildWAMessage();

        // API request already sent on step 4 (contact) when user clicked "Review"

        // Delay auto-open WhatsApp so user sees success screen first
        setTimeout(() => {
            window.open(`https://wa.me/66635412949?text=${encodeURIComponent(waMsg)}`, '_blank');
        }, 1500);
    };

    function buildWAMessage() {
        const expMap = {
            villa: '🏡 ' + t('form.step1.villa'),
            yacht: '⛵ ' + t('form.step1.yacht'),
            bikes: '🏍️ ' + t('form.step1.bikes'),
            retreat: '🌟 ' + t('form.step1.retreat'),
            package: '📦 ' + t('form.step1.package'),
            tour: '🎫 ' + t('form.step1.tour'),
            concierge: '🛠️ ' + t('form.step1.concierge')
        };
        const budgetMap = {
            '150000': t('wa.budgetUp150'),
            '300000': t('wa.budget150_300'),
            '1000000': t('wa.budget300_1m'),
            '9999999': t('wa.budget1mPlus')
        };
        let msg = t('wa.greeting') + '\n\n';
        msg += `👤 ${t('wa.name')}: ${formData.name}\n`;
        msg += `📱 ${t('wa.phone')}: ${formData.phone}\n`;
        if (formData.email) msg += `📧 Email: ${formData.email}\n`;
        msg += `\n🎯 ${t('wa.experienceType')}: ${expMap[formData.experienceType] || formData.experienceType}\n`;
        if (formData.packageName) msg += `📦 ${t('wa.package')}: ${formData.packageName}\n`;
        if (formData.yachtPreset) msg += `⛵ ${t('wa.yacht')}: ${formData.yachtPreset}\n`;
        if (formData.villaPreset) msg += `🏡 ${t('wa.villa')}: ${formData.villaPreset}\n`;
        if (formData.tourPreset) msg += `🎫 ${t('wa.tour')}: ${formData.tourPreset}\n`;
        if (formData.servicePreset && !formData.tourPreset) msg += `🛠️ ${t('wa.service')}: ${formData.servicePreset}\n`;
        msg += `\n👥 ${t('wa.guests')}: ${t('wa.guestsCount').replace('{n}', formData.groupSize)}\n`;
        if (formData.experienceType === 'concierge') {
            msg += `🗓️ ${t('wa.arrival')}: ${formData.dateFrom || t('wa.tbd')}\n`;
            msg += `🕐 ${t('wa.arrivalTime')}: ${formData.fastTrackTime || t('wa.tbd')}\n`;
        } else {
            msg += `🗓️ ${t('wa.checkIn')}: ${formData.dateFrom || t('wa.tbd')} → ${t('wa.checkOut')}: ${formData.dateTo || t('wa.tbd')}\n`;
        }
        if (formData.experienceType === 'tour') {
            const durLabel = formData.tourDurationDays === 1 ? t('form.step2.tour1day') : (formData.tourDurationDays === 2 ? t('form.step2.tour2days') : t('form.step2.tourNdays').replace('{n}', formData.tourDurationDays));
            msg += `📅 ${t('wa.duration')}: ${durLabel}\n`;
        } else if (formData.experienceType === 'yacht') {
            const yachtLabels = { 0: t('form.step2.yacht1day'), 1: t('form.step2.yacht2days'), 2: t('form.step2.yacht3days'), 5: t('form.step2.yacht5nights'), 7: t('form.step2.yacht7nights') };
            msg += `📅 ${t('wa.duration')}: ${yachtLabels[parseInt(formData.nights, 10)] ?? t('form.step2.nightsFormat').replace('{n}', formData.nights)}\n`;
        } else {
            msg += `🌙 ${t('wa.nights')}: ${formData.nights}\n`;
        }
        if (formData.experienceType === 'package') {
            const scaledPrice = getPackageScaledPrice();
            if (scaledPrice != null) msg += `💰 ${t('wa.priceGuide')}: ${t('card.from')} ${formatPrice(scaledPrice)}\n`;
        } else {
            // For non-package orders — show user-selected budget range
            msg += `💰 ${t('wa.budget')}: ${budgetMap[formData.budget] || t('wa.tbd')}\n`;
        }
        if (formData.extras.length > 0) {
            const extraKeys = { photo: 'form.step3.photo', chef: 'form.step3.chef', fasttrack: 'form.step3.fasttrack', fishing: 'form.step3.fishing', massage: 'form.step3.massage', bbq: 'form.step3.bbq' };
            const extrasWithPrices = formData.extras.map(id => {
                const price = calcAddonPrice(id);
                return `${t(extraKeys[id] || id)} (${formatPrice(price)})`;
            });
            msg += `✨ ${t('wa.extras')}: ${extrasWithPrices.join(', ')}\n`;
        }
        if (formData.notes) msg += `\n💬 ${t('wa.notes')}: ${formData.notes}\n`;
        const contactVal = formData.contactMethod === 'whatsapp' ? 'WhatsApp' : formData.contactMethod === 'telegram' ? 'Telegram' : t('wa.call');
        msg += `\n${t('wa.contactMethod')}: ${contactVal}\n`;
        msg += `\n— ${t('wa.sentFrom')}`;
        return msg;
    }

    window.refreshLeadForm = function () {
        const overlay = document.getElementById('lead-modal-overlay');
        if (overlay && overlay.classList.contains('open')) renderStep();
    };

    // Init after DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        // Lead modal close on overlay click
        const overlay = document.getElementById('lead-modal-overlay');
        overlay?.addEventListener('click', function (e) {
            if (e.target === this) window.closeLeadModal();
        });

        // Floating CTA visibility logic
        const floatingCta = document.querySelector('.floating-cta');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                floatingCta?.classList.add('visible');
            } else {
                floatingCta?.classList.remove('visible');
            }
        }, { passive: true });

        // Floating labels: sync on input/change (for programmatic values e.g. Flatpickr)
        document.querySelectorAll('.form-field--float .form-input, .form-field--float .form-textarea').forEach(el => {
            el.addEventListener('input', syncFloatingLabels);
            el.addEventListener('change', syncFloatingLabels);
        });
        syncFloatingLabels();

        // Initialize Flatpickr on step 2 date input — opens on click
        if (window.flatpickr) {
            const dateRangeInput = document.getElementById('lead-date-range');
            const dateFieldTrigger = document.getElementById('lead-date-field-trigger');
            if (dateRangeInput) {
                try {
                    const today = new Date();
                    const maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
                    const minYear = today.getFullYear();
                    const maxYear = today.getFullYear() + 1;

                    function syncYearArrows(fp) {
                        const wrapper = fp.calendarContainer && fp.calendarContainer.querySelector('.numInputWrapper');
                        if (!wrapper) return;
                        const arrowDown = wrapper.querySelector('.arrowDown');
                        const arrowUp   = wrapper.querySelector('.arrowUp');
                        const curYear   = fp.currentYear;
                        if (arrowDown) arrowDown.classList.toggle('fp-disabled', curYear <= minYear);
                        if (arrowUp)   arrowUp.classList.toggle('fp-disabled',   curYear >= maxYear);
                        // Ensure DOM order: arrowDown (−) first, input, arrowUp (+) last
                        if (arrowDown && arrowUp) {
                            const input = wrapper.querySelector('input.cur-year');
                            if (input && wrapper.firstElementChild !== arrowDown) {
                                wrapper.prepend(arrowDown);
                            }
                            if (input && wrapper.lastElementChild !== arrowUp) {
                                wrapper.append(arrowUp);
                            }
                        }
                    }

                    leadDateRangePicker = flatpickr(dateRangeInput, {
                        mode: 'single',
                        minDate: 'today',
                        maxDate: maxDate,
                        dateFormat: 'd.m.Y',
                        locale: (window.i18n && window.i18n.lang) || 'ru',
                        clickOpens: true,
                        allowInput: false,
                        appendTo: document.body,
                        position: 'below center',
                        onReady: function (_, __, fp) {
                            syncYearArrows(fp);
                        },
                        onYearChange: function (_, __, fp) {
                            // Clamp year within allowed range
                            if (fp.currentYear < minYear) { fp.changeYear(minYear); return; }
                            if (fp.currentYear > maxYear) { fp.changeYear(maxYear); return; }
                            syncYearArrows(fp);
                        },
                        onMonthChange: function (_, __, fp) {
                            syncYearArrows(fp);
                        },
                        onChange: function (selectedDates, dateStr) {
                            if (selectedDates.length === 1) {
                                const checkIn = selectedDates[0];
                                let checkOut;
                                if (formData.experienceType === 'concierge') {
                                    checkOut = new Date(checkIn); // same day
                                } else if (formData.experienceType === 'tour') {
                                    const days = formData.tourDurationDays || 1;
                                    checkOut = new Date(checkIn);
                                    checkOut.setDate(checkOut.getDate() + Math.max(0, days - 1));
                                    formData.nights = days === 1 ? '0' : String(days - 1);
                                } else if (formData.experienceType === 'yacht' && (parseInt(formData.nights, 10) || 0) === 0) {
                                    checkOut = new Date(checkIn);
                                } else {
                                    const nights = parseInt(formData.nights, 10) || 5;
                                    checkOut = new Date(checkIn);
                                    checkOut.setDate(checkOut.getDate() + nights);
                                }
                                formData.dateFrom = formatDateDMY(checkIn);
                                formData.dateTo = formatDateDMY(checkOut);
                                const fromInput = document.getElementById('lead-date-from');
                                const toInput = document.getElementById('lead-date-to');
                                if (fromInput) fromInput.value = formData.dateFrom;
                                if (toInput) toInput.value = formData.dateTo;
                                // Display: single date for concierge, range for others
                                if (formData.experienceType === 'concierge') {
                                    dateRangeInput.value = formatDateSingle(checkIn);
                                } else {
                                    dateRangeInput.value = formatDateRangeDisplay(checkIn, checkOut);
                                }
                                updateStep2Summary();
                                updateStep3State();
                                const step2Next = document.getElementById('lead-step-2-next');
                                if (step2Next) step2Next.disabled = formData.experienceType === 'concierge'
                                    ? !formData.dateFrom
                                    : !(formData.dateFrom && formData.dateTo);
                                updateDateClearVisibility();
                            }
                        }
                    });
                } catch (e) {
                    console.warn('Flatpickr init failed (e.g. missing locale):', e);
                }
                // Whole "date button" (icon + input) opens calendar
                const wrapper = dateFieldTrigger || dateRangeInput.closest('.input-with-icon');
                if (wrapper && leadDateRangePicker) {
                    wrapper.addEventListener('click', function (e) {
                        e.preventDefault();
                        leadDateRangePicker.open();
                    });
                    wrapper.addEventListener('keydown', function (e) {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            leadDateRangePicker.open();
                        }
                    });
                }
            }
        }
    });

})();
