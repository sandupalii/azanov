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
        bikeType: null,
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
    let leadDateRangePicker = null;

    // ── Flow helpers ──────────────────────────────────────────────
    // Returns true when a specific item (yacht/villa/tour/package) was pre-selected.
    // In this mode we skip group-size and budget — just dates → contacts.
    function isSpecificPreset() {
        return !!(formData.yachtPreset || formData.villaPreset || formData.tourPreset || formData.packageName);
    }

    // Returns ordered HTML step IDs for the current wizard context.
    // Step 5 = confirm/review screen (always last, never counted in the progress counter).
    function getFlowSteps() {
        const isConcierge = formData.experienceType === 'concierge';
        const isTour = formData.experienceType === 'tour';
        if (isConcierge || isTour) {
            // Short flow: dates/details (2) → contacts (4) → confirm (5)
            return [2, 4, 5];
        }
        if (isSpecificPreset()) {
            // Specific item (yacht/villa/package): dates (2) → extras+price (3) → contacts (4) → confirm (5)
            return [2, 3, 4, 5];
        }
        // Generic: type (1) → group+dates (2) → budget (3) → contacts (4) → confirm (5)
        return [1, 2, 3, 4, 5];
    }

    // Returns "X / Y" label for the step counter (excludes confirm step).
    function getStepCounter() {
        const steps = getFlowSteps().filter(s => s < 5);
        const mappedStep = currentStep === 'cal' ? 2 : currentStep;
        const idx = steps.indexOf(mappedStep);
        if (idx < 0) return '';
        return `${idx + 1} / ${steps.length}`;
    }

    // Dynamically rebuild progress bar segments to match actual flow step count
    function updateProgressBar() {
        const storiesEl = document.querySelector('.lead-progress-stories');
        if (!storiesEl) return;
        const steps = getFlowSteps().filter(s => s < 5);
        const total = steps.length;
        const mappedStep = currentStep === 'cal' ? 2 : currentStep;
        const idx = steps.indexOf(mappedStep);
        const filled = idx >= 0 ? idx + 1 : (mappedStep === 5 ? total : 0);
        // Rebuild only if count changed
        const existing = storiesEl.querySelectorAll('.lead-progress-segment');
        if (existing.length !== total) {
            storiesEl.innerHTML = '';
            for (let i = 0; i < total; i++) {
                const seg = document.createElement('div');
                seg.className = 'lead-progress-segment';
                storiesEl.appendChild(seg);
            }
        }
        storiesEl.querySelectorAll('.lead-progress-segment').forEach((seg, i) => {
            seg.classList.toggle('filled', i < filled);
        });
        storiesEl.setAttribute('aria-valuemax', total);
        storiesEl.setAttribute('aria-valuenow', filled);
    }

    function updateDateTriggerText(dateStr) {
        const trigger = document.getElementById('lead-date-trigger');
        const textEl = trigger?.querySelector('.date-input-trigger__text');
        const placeholder = t('form.step2.datesPlaceholder');
        if (textEl) textEl.textContent = dateStr || placeholder;
        if (trigger) trigger.classList.toggle('has-value', !!(dateStr && dateStr.trim()));
    }

    // Addon prices: { perNight: X } = X × nights, { fixed: X } = flat fee
    const ADDON_PRICES = {
        photo:     { fixed: 9000 },    // ~9 000 ฿ за фотосессию (рынок 8–15k/сессия)
        chef:      { perNight: 2500 }, // ~2 500 ฿/ночь лейбор (рынок 1 500–3 000/день)
        fasttrack: { fixed: 3500 },    // ~3 500 ฿/группа (рынок 1 500–3 500 чел.)
        fishing:   { fixed: 15000 },   // ~15 000 ฿ частный чартер (рынок 12–25k)
        massage:   { perNight: 1500 }, // ~1 500 ฿/ночь (рынок 800–2 000/сессия)
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
        formData.bikeType = null;
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

        // Bikes default to 1 day
        if (formData.experienceType === 'bikes') {
            formData.nights = formData.nights || '1';
        }

        currentStep = formData.experienceType && formData.experienceType !== 'retreat' ? 2 : 1;
        document.querySelectorAll('.addon-toggle-btn').forEach(b => b.classList.remove('selected'));
        renderStep();

        const overlay = document.getElementById('lead-modal-overlay');
        if (overlay) {
            overlay.classList.add('open');
            document.addEventListener('keydown', _handleLeadModalEsc);
            // Push history state so browser back-button closes modal instead of navigating away
            if (!window._leadModalHistoryPushed) {
                history.pushState({ leadModal: true }, '');
                window._leadModalHistoryPushed = true;
            }
        }
    };

    // ESC key handler for lead modal
    function _handleLeadModalEsc(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            window.closeLeadModal();
        }
    }

    // Browser back-button handler
    window.addEventListener('popstate', function (e) {
        const overlay = document.getElementById('lead-modal-overlay');
        if (overlay && overlay.classList.contains('open')) {
            overlay.classList.remove('open');
            document.removeEventListener('keydown', _handleLeadModalEsc);
            window._leadModalHistoryPushed = false;
        }
    });

    window.closeLeadModal = function () {
        const overlay = document.getElementById('lead-modal-overlay');
        if (overlay) {
            overlay.classList.remove('open');
            document.removeEventListener('keydown', _handleLeadModalEsc);
            // Pop the history state we pushed (only if we pushed one)
            if (window._leadModalHistoryPushed) {
                window._leadModalHistoryPushed = false;
                history.back();
            }
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
        // Use custom inline calendar step for ALL devices
        const openMobileCalendar = window.openMobileCalendarInternal;
        if (openMobileCalendar) {
            openMobileCalendar();
        } else if (leadDateRangePicker) {
            leadDateRangePicker.open();
        }
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
        formData.bikeType = null;
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
                const step2Label = activeEl.querySelector('.lead-step__label');
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
                // Update step label: for specific presets, don't say "детали группы"
                if (step2Label) {
                    const stepNum = getStepCounter();
                    const isSpec = isSpecificPreset();
                    const isConcierge2 = formData.experienceType === 'concierge';
                    const dateOrderLbl = t('form.step2.dateOrderLabel') || 'Дата заказа';
                    const labelText = isSpec || isConcierge2
                        ? `${stepNum ? stepNum + ' — ' : ''}${dateOrderLbl}`
                        : (t('form.step2.label') || 'Шаг 2 — Детали группы');
                    step2Label.textContent = labelText;
                }

                // Toggle between tile grid (default) and stepper (Fast Track / concierge)
                const isConcierge = formData.experienceType === 'concierge';
                const specificPreset = isSpecificPreset();
                const guestsGrid = document.getElementById('lead-step-2-guests');
                const guestsLabel = activeEl.querySelector('.lead-step-2-main > .form-group > .form-label');
                const stepperWrap = document.getElementById('lead-step-2-guests-stepper-wrap');
                // Hide group size section ONLY for concierge (which uses its own stepper)
                const hideGuests = isConcierge;
                if (guestsGrid) guestsGrid.style.display = hideGuests ? 'none' : '';
                if (guestsLabel) guestsLabel.style.display = hideGuests ? 'none' : '';
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
                } else if (!hideGuests) {
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

                // Toggle time selector for Fast Track + contextual date label by type
                const ftTimeWrap = document.getElementById('lead-ft-time-wrap');
                const datesLabel = activeEl.querySelector('.lead-step-2-dates-main > .form-group > label.form-label');
                if (isConcierge) {
                    if (ftTimeWrap) ftTimeWrap.style.display = 'block';
                    if (datesLabel) datesLabel.textContent = t('form.step2.arrivalDateLabel');
                    const ftSel = document.getElementById('lead-ft-time-select');
                    if (ftSel && ftSel.options.length === 0) buildTimeOptions(ftSel);
                    if (ftSel) ftSel.value = formData.fastTrackTime;
                } else {
                    if (ftTimeWrap) ftTimeWrap.style.display = 'none';
                    // Context-aware date label
                    const dateLabelMap = {
                        villa:     t('form.step2.dateLabelVilla'),
                        package:   t('form.step2.dateLabelPackage'),
                        retreat:   t('form.step2.dateLabelRetreat'),
                        yacht:     t('form.step2.dateLabelYacht'),
                        bikes:     t('form.step2.dateLabelBikes'),
                        tour:      t('form.step2.dateLabelTour'),
                    };
                    if (datesLabel) datesLabel.textContent = dateLabelMap[formData.experienceType] || t('form.step2.datesLabel') || 'Выберите даты';
                }

                // Show nights chips for package, yacht, bikes (different chip sets per type)
                const nightsSection = document.getElementById('lead-nights-section');
                const chipsContainer = document.querySelector('#lead-step-2 .lead-nights-chips');
                const bikeTypeWrap = document.getElementById('lead-step-2-bike-type');
                const isBikes = formData.experienceType === 'bikes';

                // Show/hide bike type selector
                if (bikeTypeWrap) {
                    bikeTypeWrap.style.display = isBikes ? '' : 'none';
                    if (isBikes && window.lucide) lucide.createIcons();
                    // Sync selected state
                    bikeTypeWrap.querySelectorAll('[data-bike-type]').forEach(btn => {
                        btn.classList.toggle('selected', btn.getAttribute('data-bike-type') === formData.bikeType);
                    });
                }

                if (nightsSection) {
                    const showNights = (formData.experienceType === 'package' || formData.experienceType === 'villa' || formData.experienceType === 'yacht' || formData.experienceType === 'bikes') && !isConcierge;
                    nightsSection.classList.toggle('lead-nights-section--hidden', !showNights);

                    // Update duration section title contextually
                    const nightsLabel = nightsSection.querySelector('.form-label');
                    if (nightsLabel) {
                        const durationTitleMap = {
                            yacht:   t('form.step2.durationYacht')   || t('form.step2.durationTitle'),
                            bikes:   t('form.step2.durationBikes')   || t('form.step2.durationTitle'),
                            package: t('form.step2.durationTitle'),
                            villa:   t('form.step2.durationTitle'),
                            retreat: t('form.step2.durationTitle'),
                        };
                        nightsLabel.textContent = durationTitleMap[formData.experienceType] || t('form.step2.durationTitle') || 'Duration';
                    }
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
                    } else if (formData.experienceType === 'package' || formData.experienceType === 'villa') {
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
                    } else if (formData.experienceType === 'bikes') {
                        const bikeDayChips = [
                            { n: '1', label: t('form.step2.bikes1day') },
                            { n: '2', label: t('form.step2.bikes2days') },
                            { n: '3', label: t('form.step2.bikes3days') },
                            { n: '5', label: t('form.step2.bikes5days') },
                            { n: '7', label: t('form.step2.bikes1week') },
                            { n: '30', label: t('form.step2.bikesMonth') },
                        ];
                        chipsContainer.innerHTML = bikeDayChips.map(c =>
                            `<button type="button" class="choice-btn choice-btn--sm" data-nights="${c.n}" onclick="setNightsFromChip(${c.n}, this)">${c.label}</button>`
                        ).join('');
                        chipsContainer.querySelectorAll('.choice-btn--sm').forEach(btn => {
                            btn.classList.toggle('selected', String(btn.getAttribute('data-nights')) === String(formData.nights || '1'));
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
                        // Display: single date for 0 nights (day charter/1-day tour), range for others
                        const n = parseInt(formData.nights, 10) || 0;
                        if (n === 0) {
                            if (dateRangeInput) dateRangeInput.value = formatDateSingle(today);
                        } else {
                            if (dateRangeInput) dateRangeInput.value = formatDateRangeDisplay(today, end);
                        }
                    }
                }


                const step2Next = document.getElementById('lead-step-2-next');
                if (step2Next) {
                    const needsBothDates = !specificPreset && !isConcierge && formData.experienceType !== 'tour';
                    // If dateFrom is already pre-filled (auto-set), enable Next immediately
                    step2Next.disabled = needsBothDates
                        ? !(formData.dateFrom && formData.dateTo)
                        : !formData.dateFrom;
                }

                // Fix #9: Hide sidebar on mobile for specific/concierge presets
                const sidebar = document.querySelector('.lead-step-2-sidebar');
                if (sidebar) {
                    const hideSidebar = (specificPreset || isConcierge || formData.experienceType === 'tour') && window.innerWidth <= 768;
                    sidebar.classList.toggle('lead-step-2-sidebar--hidden-mobile', hideSidebar);
                }
                updateStep2Summary();
                updateStep3State();
                updateDateClearVisibility();
            }

            // Step 3: Smart logic — show price summary OR budget selector based on whether
            // the user arrived from a specific item (package/yacht/villa/tour) or generic CTA
            if (currentStep === 3) {
                const estimatedPrice = getEstimatedPrice();
                const hasFixedPrice = typeof estimatedPrice === 'number' && estimatedPrice > 0;
                
                const packagePriceBlock = document.getElementById('lead-step3-package-price');
                const budgetBlock = document.getElementById('lead-step3-budget');
                const step3Title = document.getElementById('lead-step3-title');
                const step3Desc = document.getElementById('lead-step3-desc');
                const step3Label = document.getElementById('lead-step3-label');

                if (hasFixedPrice) {
                    // ── SPECIFIC ITEM FLOW: show price card, hide budget ──────────────
                    if (packagePriceBlock) packagePriceBlock.style.display = '';
                    if (budgetBlock) budgetBlock.style.display = 'none';
                    // Clear any previously-selected budget — it doesn't apply here
                    formData.budget = null;
                    document.querySelectorAll('.budget-option').forEach(b => b.classList.remove('selected'));

                    // Dynamic title based on experience type
                    const titleMap = {
                        package: t('form.step3.titlePackage'),
                        yacht:   t('form.step3.titleYacht'),
                        villa:   t('form.step3.titleVilla'),
                        tour:    t('form.step3.titleTour'),
                        bikes:   t('form.step3.titleBikes'),
                    };
                    const descMap = {
                        package: t('form.step3.descPackage'),
                        yacht:   t('form.step3.descYacht'),
                        villa:   t('form.step3.descVilla'),
                        tour:    t('form.step3.descTour'),
                        bikes:   t('form.step3.descBikes'),
                    };
                    const labelMap = {
                        package: t('form.step3.labelPackage'),
                        yacht:   t('form.step3.labelYacht'),
                        villa:   t('form.step3.labelVilla'),
                        tour:    t('form.step3.labelTour'),
                        bikes:   t('form.step3.labelBikes'),
                    };
                    const stepCounter3 = getStepCounter();
                    const step3LabelTxt = labelMap[formData.experienceType] || t('form.step3.label');
                    if (step3Title) step3Title.textContent = titleMap[formData.experienceType] || t('form.step3.title');
                    if (step3Desc)  step3Desc.textContent  = descMap[formData.experienceType]  || t('form.step3.desc');
                    if (step3Label) step3Label.textContent = stepCounter3 ? `${stepCounter3} — ${step3LabelTxt.replace(/^Шаг \d+ — |^Step \d+ — /, '')}` : step3LabelTxt;

                    // Render the known item price with nights context
                    const priceAmountEl = document.getElementById('lead-step3-price-amount');
                    const priceNoteEl   = document.getElementById('lead-step3-price-note');
                    if (priceAmountEl) {
                        priceAmountEl.textContent = `${t('card.from') || 'от'} ${formatPrice(estimatedPrice)}`;
                    }
                    if (priceNoteEl) {
                        const nightsLabel = getNightsLabel();
                        if (formData.experienceType === 'tour') {
                            const guests = parseInt(formData.groupSize, 10) || 1;
                            priceNoteEl.textContent = `${guests} ${t('form.step3.guestSuffix')} × ${formatPrice(Math.round(estimatedPrice / guests))} ${t('form.step3.perPerson')}`;
                        } else if (formData.experienceType !== 'concierge') {
                            priceNoteEl.textContent = nightsLabel ? `${nightsLabel} — ${t('form.step3.priceFixed')}` : t('form.step3.packagePriceNote');
                        } else {
                            priceNoteEl.textContent = t('form.step3.packagePriceNote');
                        }
                    }
                } else {
                    // ── GENERIC / RETREAT FLOW: show budget selector ──────────────────
                    if (packagePriceBlock) packagePriceBlock.style.display = 'none';
                    if (budgetBlock) budgetBlock.style.display = '';
                    if (step3Title) step3Title.textContent = t('form.step3.title') || 'Ваш бюджет и желания';
                    if (step3Desc)  step3Desc.textContent  = t('form.step3.desc')  || 'Выберите ценовой диапазон и дополнительные опции.';
                    if (step3Label) step3Label.textContent = t('form.step3.label') || 'Шаг 3 — Бюджет и предпочтения';
                }

                // Always update addon prices and total counter when entering step 3
                updateAddonPrices();
                // Filter addons by experience type
                const ADDON_TYPES = {
                    photo:     ['package', 'retreat', 'yacht', 'villa', 'tour', 'bikes', null],
                    chef:      ['package', 'retreat', 'villa', null],
                    fasttrack: ['package', 'retreat', 'bikes', 'concierge', null],
                    fishing:   ['package', 'retreat', 'yacht', null],
                    massage:   ['package', 'retreat', 'villa', null],
                    // bbq removed — handled separately in conversation
                };
                document.querySelectorAll('.addon-toggle-btn[data-addon]').forEach(btn => {
                    const addon = btn.getAttribute('data-addon');
                    const allowed = ADDON_TYPES[addon] || [];
                    const show = allowed.includes(formData.experienceType);
                    btn.style.display = show ? '' : 'none';
                    if (!show && btn.classList.contains('selected')) {
                        btn.classList.remove('selected');
                    }
                });
                // Reset total based on current base price
                updateTotalPrice();
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

        // Fix #1: Dynamic progress bar driven by actual flow step count
        updateProgressBar();

        // Dynamic step counter (X / Y)
        const counter = getStepCounter();
        document.querySelectorAll('.step-counter').forEach(el => {
            if (counter && !el.closest('#lead-step-cal')) el.textContent = counter;
        });

        // Build step 5 summary when entering the confirm screen
        if (currentStep === 5) buildStep5Summary();

        if (window.lucide) lucide.createIcons();
        syncFloatingLabels();
    }

    let _isSubmitting = false;

    function sendLeadToApi() {
        const apiUrl = window.LEAD_API_URL;
        if (!apiUrl || typeof apiUrl !== 'string' || !apiUrl.trim()) return;
        if (_isSubmitting) return; // prevent double-submit
        _isSubmitting = true;

        // Collect extras from both button-style (fleet/villas) and checkbox-style (index)
        const addonBtns = document.querySelectorAll('.addon-toggle-btn.selected');
        const addonCheckboxes = document.querySelectorAll('.lead-extra:checked');
        const extras = addonBtns.length
            ? Array.from(addonBtns).map(el => el.getAttribute('data-addon')).filter(Boolean)
            : Array.from(addonCheckboxes).map(el => el.value).filter(Boolean);
        formData.extras = extras;

        // Calculate estimated price to send to CRM (overrides budget for specific items)
        const estimatedPrice = getEstimatedPrice();

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
            bikeType: formData.bikeType || '',
            groupSize: formData.groupSize,
            dateFrom: formData.dateFrom,
            dateTo: formData.dateTo,
            nights: formData.nights,
            budget: formData.budget,
            estimatedPrice: estimatedPrice || null,
            extras: formData.extras,
            notes: formData.notes || '',
            contactMethod: formData.contactMethod,
            source: 'azanovtravel.com',
        };

        // Show subtle loading state on submit button if present
        const submitBtns = document.querySelectorAll('#lead-step-4 .btn-primary, #lead-step-5 .btn-primary-lg');
        submitBtns.forEach(btn => { btn.disabled = true; btn._originalText = btn.textContent; });

        fetch(apiUrl.trim(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        .then(r => r.json())
        .then(r => {
            if (!r.ok) {
                console.warn('[lead-form] API returned not-ok:', r);
            } else {
                // Trigger Marketing Conversions (Google Analytics, Yandex Metrika, Facebook Pixel)
                try {
                    if (typeof window.gtag === 'function') {
                        window.gtag('event', 'generate_lead', {
                            event_category: 'engagement',
                            event_label: payload.experienceType,
                            value: payload.estimatedPrice || 0
                        });
                    }
                    if (typeof window.ym === 'function') {
                        // Replace XXXXXXXX with actual Yandex Counter ID if used
                        // window.ym(XXXXXXXX, 'reachGoal', 'lead_submitted');
                    }
                    if (typeof window.fbq === 'function') {
                        window.fbq('track', 'Lead', {
                            content_name: payload.experienceType,
                            value: payload.estimatedPrice || 0,
                            currency: 'THB'
                        });
                    }
                } catch (e) {
                    console.warn('[lead-form] Analytics tracking failed:', e);
                }
            }
        })
        .catch((err) => {
            console.warn('[lead-form] Lead API send failed:', err);
            // Show user-facing error toast
            showApiErrorToast();
        })
        .finally(() => {
            _isSubmitting = false;
            submitBtns.forEach(btn => { btn.disabled = false; });
        });
    }

    function showApiErrorToast() {
        // Don't block the flow — just inform the user
        const existing = document.getElementById('lead-api-error-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.id = 'lead-api-error-toast';
        toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:rgba(255,107,107,0.95);color:#fff;padding:0.75rem 1.5rem;border-radius:12px;font-size:0.85rem;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.3);animation:slideUpSheet 0.3s ease;max-width:90vw;text-align:center;';
        toast.textContent = t('form.apiError') || 'Не удалось отправить заявку. Попробуйте через WhatsApp.';
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s'; }, 4000);
        setTimeout(() => toast.remove(), 5000);
    }

    window.nextStep = function () {
        if (!validateStep(currentStep)) return;
        // Collect contact fields when leaving the contacts step (step 4 → step 5)
        if (currentStep === 4) {
            const nameEl = document.getElementById('lead-name');
            const phoneEl = document.getElementById('lead-phone');
            const emailEl = document.getElementById('lead-email');
            const notesEl = document.getElementById('lead-notes');
            if (nameEl) formData.name = nameEl.value.trim();
            if (phoneEl) formData.phone = phoneEl.value.trim();
            if (emailEl) formData.email = emailEl.value.trim();
            if (notesEl) formData.notes = notesEl.value.trim();
            formData.groupSize = document.getElementById('lead-group-size')?.value || formData.groupSize;
            formData.dateFrom = document.getElementById('lead-date-from')?.value || formData.dateFrom || '';
            formData.dateTo = document.getElementById('lead-date-to')?.value || formData.dateTo || '';
            formData.nights = document.getElementById('lead-nights')?.value || formData.nights || '1';
            // Fire Telegram/API lead immediately on step 4 → 5 transition
            sendLeadToApi();
        }
        const steps = getFlowSteps();
        const idx = steps.indexOf(currentStep);
        if (idx >= 0 && idx < steps.length - 1) {
            currentStep = steps[idx + 1];
            renderStep();
        }
    };

    window.prevStep = function () {
        const steps = getFlowSteps();
        const idx = steps.indexOf(currentStep);
        if (idx > 0) {
            currentStep = steps[idx - 1];
            renderStep();
        }
    };

    window.goToStep = function (stepId) {
        currentStep = stepId;
        renderStep();
    };

    window.selectExperience = function (type, el) {
        formData.experienceType = type;
        document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
        el.classList.add('selected');
    };

    window.setBikeType = function (type, el) {
        formData.bikeType = type;
        const grid = document.getElementById('lead-step-2-bike-type');
        if (grid) grid.querySelectorAll('[data-bike-type]').forEach(b => b.classList.remove('selected'));
        if (el) el.classList.add('selected');
        updateStep2Summary();
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
        updateTotalPrice();
    };

    function updateTotalPrice() {
        const base = getEstimatedPrice() || 0;
        // Collect all selected addons from both button-style and checkbox-style
        const selectedAddons = [
            ...Array.from(document.querySelectorAll('.addon-toggle-btn.selected')).map(el => el.getAttribute('data-addon')),
            ...Array.from(document.querySelectorAll('.lead-extra:checked')).map(el => el.value)
        ].filter(Boolean);

        const addonsSum = selectedAddons.reduce((acc, id) => acc + calcAddonPrice(id), 0);
        const total = base + addonsSum;

        const totalEl = document.getElementById('lead-step3-total-price');
        if (totalEl) {
            if (total > 0) {
                totalEl.style.display = '';
                const amountEl = totalEl.querySelector('.total-price__amount');
                const addonsEl = totalEl.querySelector('.total-price__addons');
                
                // If base is known, total is base + addons. We can show "+ X extras"
                // If base is 0 (generic flow), total is just extras. Just show total.
                if (amountEl) {
                  amountEl.textContent = base > 0 
                     ? `${window.t ? window.t('card.from') || 'от' : 'от'} ${formatPrice(total)}`
                     : `${formatPrice(total)}`;
                }
                if (addonsEl) {
                  if (base > 0 && addonsSum > 0) {
                     addonsEl.style.display = '';
                     addonsEl.textContent = `(+ ${formatPrice(addonsSum)} ${window.t ? window.t('form.step3.addonsTag') || 'доп. услуги' : 'доп. услуги'})`;
                  } else {
                     addonsEl.style.display = 'none';
                  }
                }
            } else {
                totalEl.style.display = 'none';
            }
        }
    }

    window.toggleAddon = function (addonId, el) {
        el.classList.toggle('selected');
        // Sync to formData.extras immediately so downstream (WA message, API) see it
        formData.extras = [
            ...Array.from(document.querySelectorAll('.addon-toggle-btn.selected')).map(b => b.getAttribute('data-addon')),
            ...Array.from(document.querySelectorAll('.lead-extra:checked')).map(b => b.value)
        ].filter(Boolean);
        updateTotalPrice();
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
            if (dateRangeInput) {
                const n = parseInt(formData.nights, 10) || 0;
                dateRangeInput.value = n === 0 ? formatDateSingle(from) : formatDateRangeDisplay(from, to);
            }
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
        const by = (t('form.dateRangeBy') || '').startsWith('form.') ? ' — ' : t('form.dateRangeBy');
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

    function getEstimatedPrice() {
        const nightsStr = formData.nights || '5';
        const nights = parseInt(nightsStr, 10) || 5;
        const groupSize = parseInt(formData.groupSize, 10) || 1;

        if (formData.experienceType === 'package' && formData.packageId) {
            const pkg = window.PACKAGES?.find(p => p.id === formData.packageId);
            if (!pkg || typeof pkg.price !== 'number') return null;
            const baseNights = parsePackageBaseNights(pkg.nights);
            const selectedNights = parseInt(nightsStr, 10) || baseNights;
            return Math.round(pkg.price * (selectedNights / baseNights));
        }

        if (formData.experienceType === 'yacht' && formData.yachtPreset) {
            const yacht = window.FLEET?.find(y => y.name === formData.yachtPreset || y.id === formData.yachtPreset);
            if (!yacht || typeof yacht.price !== 'number' || yacht.price <= 0) return null;
            const yachtNights = nightsStr === '0' ? 1 : Math.max(1, nights);
            return yacht.price * yachtNights;
        }

        if (formData.experienceType === 'villa' && formData.villaPreset) {
            const villas = typeof VILLAS !== 'undefined' ? VILLAS : (window.VILLAS || []);
            const villa = villas.find(v => v.name === formData.villaPreset || v.code === formData.villaPreset);
            if (!villa || !villa.price) return null;
            const priceNum = parseInt(villa.price.replace(/[^\d]/g, ''), 10);
            if (isNaN(priceNum) || priceNum <= 0) return null;
            return priceNum * Math.max(1, nights);
        }

        if (formData.experienceType === 'tour' && formData.tourPreset) {
            const tours = typeof LOCATIONS !== 'undefined' ? LOCATIONS : (window.LOCATIONS || []);
            const tour = tours.find(t => t.name === formData.tourPreset || t.id === formData.tourPreset);
            if (!tour || typeof tour.rawPrice !== 'number' || tour.rawPrice <= 0) return null;
            return tour.rawPrice * groupSize;
        }

        return null;
    }

    function getNightsLabel() {
        if (formData.experienceType === 'tour') {
            return formData.tourDurationDays === 1 ? t('form.step2.tour1day') : (formData.tourDurationDays === 2 ? t('form.step2.tour2days') : t('form.step2.tourNdays').replace('{n}', formData.tourDurationDays));
        }
        if (formData.experienceType === 'yacht') {
            const yachtLabels = { 0: t('form.step2.yacht1day'), 1: t('form.step2.yacht2days'), 2: t('form.step2.yacht3days'), 5: t('form.step2.yacht5nights'), 7: t('form.step2.yacht7nights') };
            return yachtLabels[parseInt(formData.nights, 10)] ?? t('form.step2.nightsFormat').replace('{n}', formData.nights);
        }
        if (formData.experienceType === 'bikes') {
            const bikeLabels = { 1: t('form.step2.bikes1day') || '1 день', 2: t('form.step2.bikes2days') || '2 дня', 3: t('form.step2.bikes3days') || '3 дня', 5: t('form.step2.bikes5days') || '5 дней', 7: t('form.step2.bikes1week') || '1 неделя', 30: t('form.step2.bikesMonth') || 'Месяц' };
            const n = parseInt(formData.nights, 10);
            return bikeLabels[n] || (t('form.step2.bikesDaysFormat') || '{n} дн.').replace('{n}', formData.nights);
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
        const thumbEl = document.getElementById('lead-sidebar-thumb');
        const itemName = getSummaryItemName();
        if (itemEl) {
            itemEl.textContent = itemName || '—';
            itemEl.classList.toggle('has-value', !!itemName);
        }

        // Dynamically update the summary title (Type: Yacht, Villa, Tour, etc)
        const summaryTitleEl = document.querySelector('.lead-step-2-summary__title');
        if (summaryTitleEl) {
            let summaryKey = 'form.step2.summary';
            if (formData.experienceType === 'yacht') summaryKey = 'form.step2.summaryCharter';
            else if (formData.experienceType === 'villa') summaryKey = 'form.step2.summaryVilla';
            else if (formData.experienceType === 'tour') summaryKey = 'form.step2.summaryTour';
            else if (formData.experienceType === 'package') summaryKey = 'form.step2.summaryOrder';
            
            summaryTitleEl.textContent = t(summaryKey) || t('form.step2.summary');
            // Remove data-i18n so the translation system doesn't override our dynamic change on next render
            summaryTitleEl.removeAttribute('data-i18n');
        }

        // ── Dynamic thumbnail injection ──────────────────────────
        if (thumbEl) {
            let imgSrc = null;
            try {
                if (formData.experienceType === 'yacht' && formData.yachtPreset) {
                    const yacht = (window.FLEET || []).find(y => (y.name || '').trim() === (formData.yachtPreset || '').trim());
                    if (yacht) imgSrc = yacht.img;
                } else if (formData.experienceType === 'villa' && formData.villaPreset) {
                    const villas = typeof VILLAS !== 'undefined' ? VILLAS : (window.VILLAS || []);
                    const villa = villas.find(v => v.name === formData.villaPreset || v.code === formData.villaPreset);
                    if (villa) imgSrc = villa.img;
                } else if (formData.experienceType === 'tour' && formData.tourPreset) {
                    const tours = typeof LOCATIONS !== 'undefined' ? LOCATIONS : (window.LOCATIONS || []);
                    const tour = tours.find(t => t.name === formData.tourPreset || t.id === formData.tourPreset);
                    if (tour) imgSrc = tour.img;
                } else if (formData.experienceType === 'package' && formData.packageId) {
                    const pkg = (window.PACKAGES || []).find(p => p.id === formData.packageId);
                    if (pkg) imgSrc = pkg.img || (pkg.images && pkg.images[0]);
                }
            } catch (e) { /* graceful fallback */ }

            if (imgSrc) {
                const optimizedSrc = typeof ImgUtils !== 'undefined' ? ImgUtils.toThumb(imgSrc) : imgSrc;
                if (thumbEl.src !== optimizedSrc && thumbEl.getAttribute('src') !== optimizedSrc) {
                    thumbEl.src = optimizedSrc;
                    thumbEl.alt = itemName || '';
                }
                thumbEl.style.display = '';
            } else {
                thumbEl.style.display = 'none';
                thumbEl.src = '';
            }
        }

        const effectiveGuests = formData.experienceType === 'concierge' ? formData.fastTrackGuests : formData.groupSize;
        if (guestsEl) {
            const specificPreset = isSpecificPreset();
            // IMPORTANT: Include .lead-step-2-summary__line to match the new rich sidebar structure
            // Fallback to guestsEl itself, NEVER guestsEl.parentElement, otherwise we hide the entire .lead-sidebar-content
            const guestsRow = guestsEl.closest('.lead-step-2-summary__line, .lead-step-2-summary__row, li, p') || guestsEl;
            if (specificPreset) {
                guestsEl.textContent = '—';
                if (guestsRow) guestsRow.style.display = 'none';
            } else {
                if (guestsRow) guestsRow.style.display = '';
                guestsEl.textContent = effectiveGuests ? t('form.step2.guestsCount').replace('{n}', effectiveGuests) : '—';
            }
        }

        if (nightsEl) {
            if (formData.experienceType === 'concierge') {
                // Show arrival time instead of nights
                nightsEl.textContent = formData.fastTrackTime ? `🕐 ${formData.fastTrackTime}` : '—';
            } else {
                nightsEl.textContent = getNightsLabel() || '—';
            }
        }

        if (priceEl) {
            // getPackageScaledPrice alias → getEstimatedPrice (was never defined, fixed)
            const scaledPrice = getEstimatedPrice();
            if (scaledPrice != null && scaledPrice > 0) {
                // Changed: Show price for ALL experience types if available, not just 'package'
                priceEl.innerHTML = `<span style="font-size: 0.8em; color: var(--text-muted); font-weight: normal;">${t('card.from') || 'от'}</span> ${formatPrice(scaledPrice)}`;
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
            // For specific presets: only dates required (no group size check)
            const specificPreset = isSpecificPreset();
            if (!specificPreset && formData.experienceType !== 'concierge' && !formData.groupSize) {
                showError(t('form.errorSelectGuests')); valid = false;
            }
            if (formData.experienceType === 'concierge') {
                if (!formData.dateFrom) {
                    showError(t('form.errorSelectDates')); valid = false;
                }
            } else if (!formData.dateFrom) {
                showError(t('form.errorSelectDates')); valid = false;
            }
        }
        // Step 3 (budget) — skip entirely for specific presets (they never hit this step)
        if (step === 3 && !isSpecificPreset()) {
            const estPrice = getEstimatedPrice();
            const hasFixedPrice = typeof estPrice === 'number' && estPrice > 0;
            if (!formData.budget && !hasFixedPrice) {
                showError(t('form.errorSelectBudget') || 'Пожалуйста, выберите бюджет'); valid = false;
            }
        }
        // Step 4 = contacts: require name + phone
        if (step === 4) {
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

    // Fix #15: Build the order summary shown on step 5 (confirm screen)
    function buildStep5Summary() {
        const container = document.getElementById('lead-step5-summary-body');
        if (!container) return;
        container.innerHTML = '';

        function addRow(label, value, cls) {
            if (!value || value === '—') return;
            const row = document.createElement('div');
            row.className = 'lead-step5-summary__row';
            row.innerHTML = `<span class="lead-step5-summary__label">${label}</span><span class="lead-step5-summary__value${cls ? ' ' + cls : ''}">${value}</span>`;
            container.appendChild(row);
        }

        const itemName = getSummaryItemName();
        if (itemName) addRow(t('form.step5.summaryItem') || 'Услуга', itemName);

        if (formData.dateFrom) {
            const [d1, m1, y1] = formData.dateFrom.split('.');
            const fromD = new Date(parseInt(y1, 10), parseInt(m1, 10) - 1, parseInt(d1, 10));
            let dateVal;
            if (formData.experienceType === 'concierge') {
                dateVal = `${formatDateSingle(fromD)} · ${formData.fastTrackTime || ''}`;
            } else if (formData.dateTo && formData.dateTo !== formData.dateFrom) {
                const [d2, m2, y2] = formData.dateTo.split('.');
                const toD = new Date(parseInt(y2, 10), parseInt(m2, 10) - 1, parseInt(d2, 10));
                dateVal = `${formatDateLong(fromD)} — ${formatDateLong(toD)}`;
            } else {
                dateVal = formatDateSingle(fromD);
            }
            addRow(t('form.step5.summaryDate') || 'Дата', dateVal);
        }

        const durationLabel = getNightsLabel();
        if (durationLabel && formData.experienceType !== 'concierge') {
            addRow(t('form.step5.summaryDuration') || 'Длительность', durationLabel);
        }

        const showGuests = !isSpecificPreset() || formData.experienceType === 'tour';
        if (showGuests && formData.groupSize) {
            addRow(t('form.step5.summaryGuests') || 'Гостей', String(formData.groupSize));
        }

        const estPrice = getEstimatedPrice();
        if (typeof estPrice === 'number' && estPrice > 0) {
            const addonsSum = Array.from(document.querySelectorAll('.addon-toggle-btn.selected'))
                .map(b => calcAddonPrice(b.getAttribute('data-addon'))).reduce((a, b) => a + b, 0);
            const total = estPrice + addonsSum;
            addRow(t('form.step5.summaryPrice') || 'Стоимость', `${t('card.from') || 'от'} ${formatPrice(total)}`, 'lead-step5-summary__value--price');
        } else if (formData.budget) {
            const budgetMap = {
                '150000': t('wa.budgetUp150'), '300000': t('wa.budget150_300'),
                '1000000': t('wa.budget300_1m'), '9999999': t('wa.budget1mPlus')
            };
            if (budgetMap[formData.budget]) addRow(t('form.step5.summaryPrice') || 'Стоимость', budgetMap[formData.budget]);
        }

        const selectedAddons = Array.from(document.querySelectorAll('.addon-toggle-btn.selected'))
            .map(b => b.querySelector('.addon-toggle-btn__label')?.textContent?.trim()).filter(Boolean);
        if (selectedAddons.length) {
            addRow(t('form.step5.summaryAddons') || 'Допуслуги', selectedAddons.join(', '));
        }
    }

    window.submitLeadForm = function () {
        // submitLeadForm() is called ONLY by the optional WhatsApp button on step 5.
        // The lead has already been sent to Telegram/API when the user moved step 4 → 5.
        // This function only builds and opens the WhatsApp deep-link.

        // Build WhatsApp message and open
        const waMsg = buildWAMessage();
        window.closeLeadModal();
        setTimeout(() => {
            window.open(`https://wa.me/66635412949?text=${encodeURIComponent(waMsg)}`, '_blank');
        }, 300);
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
        if (formData.experienceType === 'bikes' && formData.bikeType) {
            const bikeLabels = { scooter: '🛵 Скутер', motorbike: '🏍️ Мотобайк', car: '🚗 Автомобиль', atv: '🏕️ Квадроцикл' };
            msg += `🛵 ${t('wa.bikeType') || 'Тип ТС'}: ${bikeLabels[formData.bikeType] || formData.bikeType}\n`;
        }
        if (formData.groupSize && formData.experienceType !== 'concierge') {
            msg += `\n👥 ${t('wa.guests')}: ${t('wa.guestsCount').replace('{n}', formData.groupSize)}\n`;
        }
        if (formData.experienceType === 'concierge') {
            msg += `🗓️ ${t('wa.arrival')}: ${formData.dateFrom || t('wa.tbd')}\n`;
            msg += `🕐 ${t('wa.arrivalTime')}: ${formData.fastTrackTime || t('wa.tbd')}\n`;
        } else if (formData.experienceType === 'bikes') {
            msg += `📅 Начало аренды: ${formData.dateFrom || t('wa.tbd')}\n`;
            msg += `📅 Возврат: ${formData.dateTo || formData.dateFrom || t('wa.tbd')}\n`;
            const bikeLabels = { 1: '1 день', 2: '2 дня', 3: '3 дня', 5: '5 дней', 7: '1 неделя', 30: 'Месяц' };
            const n = parseInt(formData.nights, 10);
            msg += `⏱️ Срок: ${bikeLabels[n] || `${formData.nights} дн.`}\n`;
        } else if (formData.experienceType === 'tour') {
            msg += `📅 Дата тура: ${formData.dateFrom || t('wa.tbd')}\n`;
            if (formData.tourDurationDays > 1) {
                msg += `⏱️ Длительность: ${formData.tourDurationDays} дня\n`;
            }
        } else if (formData.experienceType === 'yacht') {
            const yachtLabels = { 0: t('form.step2.yacht1day'), 1: t('form.step2.yacht2days'), 2: t('form.step2.yacht3days'), 5: t('form.step2.yacht5nights'), 7: t('form.step2.yacht7nights') };
            msg += `🗓️ Дата аренды: ${formData.dateFrom || t('wa.tbd')}\n`;
            msg += `📅 ${t('wa.duration')}: ${yachtLabels[parseInt(formData.nights, 10)] ?? t('form.step2.nightsFormat').replace('{n}', formData.nights)}\n`;
        } else {
            msg += `🗓️ ${t('wa.checkIn')}: ${formData.dateFrom || t('wa.tbd')} → ${t('wa.checkOut')}: ${formData.dateTo || t('wa.tbd')}\n`;
            msg += `🌙 ${t('wa.nights')}: ${formData.nights}\n`;
        }
        const estPrice = getEstimatedPrice();
        if (typeof estPrice === 'number' && estPrice > 0) {
            msg += `💰 ${t('wa.priceGuide') || 'Ориентировочная цена'}: ${t('card.from') || 'от'} ${formatPrice(estPrice)}\n`;
        } else if (formData.experienceType !== 'package' && formData.experienceType !== 'concierge') {
            // For orders without fixed price — show user-selected budget range
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

                    const isMobileDevice = () => window.innerWidth <= 768;

                    // ─── Shared onChange handler (desktop + mobile inline) ───────────────
                    function handleDateSelection(selectedDates) {
                        if (selectedDates.length !== 1) return;
                        const checkIn = selectedDates[0];
                        let checkOut;
                        if (formData.experienceType === 'concierge') {
                            checkOut = new Date(checkIn);
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
                        const n = parseInt(formData.nights, 10) || 0;
                        const showSingle = n === 0;
                        dateRangeInput.value = showSingle
                            ? formatDateSingle(checkIn)
                            : formatDateRangeDisplay(checkIn, checkOut);
                        updateStep2Summary();
                        updateStep3State();
                        const step2Next = document.getElementById('lead-step-2-next');
                        if (step2Next) {
                            const specificPreset = isSpecificPreset();
                            const needsBothDates = !specificPreset && formData.experienceType !== 'concierge' && formData.experienceType !== 'tour';
                            step2Next.disabled = needsBothDates
                                ? !(formData.dateFrom && formData.dateTo)
                                : !formData.dateFrom;
                        }
                        updateDateClearVisibility();
                    }

                    // ─── Desktop flatpickr (dropdown) ────────────────────────────────────
                    leadDateRangePicker = flatpickr(dateRangeInput, {
                        mode: 'single',
                        minDate: 'today',
                        maxDate: maxDate,
                        dateFormat: 'd.m.Y',
                        locale: (window.i18n && window.i18n.lang) || 'ru',
                        clickOpens: false,  // we control open manually
                        allowInput: false,
                        disableMobile: true, // we use custom mobile step view
                        appendTo: document.body,
                        position: 'below center',
                        onReady: function (_, __, fp) { syncYearArrows(fp); },
                        onYearChange: function (_, __, fp) {
                            if (fp.currentYear < minYear) { fp.changeYear(minYear); return; }
                            if (fp.currentYear > maxYear) { fp.changeYear(maxYear); return; }
                            syncYearArrows(fp);
                        },
                        onMonthChange: function (_, __, fp) { syncYearArrows(fp); },
                        onChange: function (selectedDates) { handleDateSelection(selectedDates); }
                    });

                    // ─── Custom Vertical Mobile Calendar (replaces flatpickr) ───────────
                    let mobileCalPanelCreated = false;

                    function renderMobileCalendarBody(container) {
                        container.innerHTML = '';
                        const today = new Date();
                        today.setHours(0,0,0,0);
                        
                        let currentSelDate = null;
                        if (formData.dateFrom) {
                            const [d, m, y] = formData.dateFrom.split('.');
                            currentSelDate = new Date(y, m - 1, d);
                            currentSelDate.setHours(0,0,0,0);
                        }

                        let monthNames = [
                            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
                        ];
                        let dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
                        
                        if (window.flatpickr && flatpickr.l10ns) {
                            const l10n = window.i18n.lang === 'ru' ? flatpickr.l10ns.ru : flatpickr.l10ns.default;
                            if (l10n && l10n.months && l10n.months.longhand) {
                                monthNames = l10n.months.longhand;
                            }
                            if (l10n && l10n.weekdays && l10n.weekdays.shorthand) {
                                // Flatpickr weekdays usually start with Sunday (0), we need Mon-Sun
                                dayNames = [...l10n.weekdays.shorthand.slice(1), l10n.weekdays.shorthand[0]];
                            }
                        }

                        const calWrapper = document.createElement('div');
                        calWrapper.className = 'custom-mobile-calendar';

                        let startYear = today.getFullYear();
                        let startMonth = today.getMonth();

                        // Render 12 months
                        for (let i = 0; i < 12; i++) {
                            const y = startYear + Math.floor((startMonth + i) / 12);
                            const m = (startMonth + i) % 12;
                            
                            const monthDiv = document.createElement('div');
                            monthDiv.className = 'custom-cal-month';
                            
                            const title = document.createElement('div');
                            title.className = 'custom-cal-month-title';
                            title.textContent = `${monthNames[m]} ${y}`;
                            monthDiv.appendChild(title);

                            const weekdays = document.createElement('div');
                            weekdays.className = 'custom-cal-weekdays';
                            dayNames.forEach(dn => {
                                const wd = document.createElement('div');
                                wd.className = 'custom-cal-weekday';
                                wd.textContent = dn;
                                weekdays.appendChild(wd);
                            });
                            monthDiv.appendChild(weekdays);

                            const daysGrid = document.createElement('div');
                            daysGrid.className = 'custom-cal-days';

                            const firstDay = new Date(y, m, 1);
                            let startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Mon=0
                            const daysInMonth = new Date(y, m + 1, 0).getDate();

                            // Pad start
                            for (let p = 0; p < startingDay; p++) {
                                const empty = document.createElement('div');
                                daysGrid.appendChild(empty);
                            }

                            for (let d = 1; d <= daysInMonth; d++) {
                                const btn = document.createElement('button');
                                btn.type = 'button';
                                btn.className = 'custom-cal-day';
                                btn.textContent = d;
                                
                                const cellDate = new Date(y, m, d);
                                cellDate.setHours(0,0,0,0);

                                if (cellDate < today) {
                                    btn.disabled = true;
                                } else {
                                    if (cellDate.getTime() === today.getTime()) btn.classList.add('today');
                                    if (currentSelDate && cellDate.getTime() === currentSelDate.getTime()) btn.classList.add('selected');
                                    
                                    btn.addEventListener('click', (e) => {
                                        e.preventDefault();
                                        // Update state immediately for faster feedback
                                        calWrapper.querySelectorAll('.custom-cal-day.selected').forEach(el => el.classList.remove('selected'));
                                        btn.classList.add('selected');
                                        
                                        handleDateSelection([cellDate]);
                                        if (leadDateRangePicker) {
                                            leadDateRangePicker.setDate(cellDate, false);
                                        }
                                        setTimeout(closeMobileCalendar, 220);
                                    });
                                }
                                daysGrid.appendChild(btn);
                            }
                            monthDiv.appendChild(daysGrid);
                            calWrapper.appendChild(monthDiv);
                        }
                        container.appendChild(calWrapper);
                    }

                    function openMobileCalendar() {
                        const stepCal = document.getElementById('lead-step-cal');
                        if (!stepCal) return;

                        // Update title based on experience type
                        const titleEl = stepCal.querySelector('.mobile-cal-title');
                        if (titleEl) {
                            const map = {
                                bikes:     'form.step2.calTitleBikes',
                                tour:      'form.step2.calTitleTour',
                                villa:     'form.step2.calTitleVilla',
                                yacht:     'form.step2.calTitleYacht',
                                concierge: 'form.step2.calTitleConcierge'
                            };
                            const key = map[formData.experienceType] || 'form.step2.calTitleDefault';
                            titleEl.setAttribute('data-i18n', key);
                            titleEl.textContent = t(key);
                        }

                        const bodyContainer = document.getElementById('custom-mobile-cal-body');
                        if (bodyContainer) {
                            renderMobileCalendarBody(bodyContainer);
                        }

                        goToStep('cal');

                        if (bodyContainer) {
                            setTimeout(() => {
                                const selectedBtn = bodyContainer.querySelector('.custom-cal-day.selected');
                                const horizontalScroller = bodyContainer.querySelector('.custom-mobile-calendar');
                                if (selectedBtn) {
                                    selectedBtn.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
                                } else {
                                    bodyContainer.scrollTop = 0;
                                    if (horizontalScroller) horizontalScroller.scrollLeft = 0;
                                }
                            }, 10);
                        }
                    }

                    function closeMobileCalendar() {
                        if (currentStep === 'cal') {
                            goToStep(2);
                        }
                    }
                    
                    window.openMobileCalendarInternal = openMobileCalendar;

                } catch (e) {
                    console.warn('Flatpickr init failed (e.g. missing locale):', e);
                }
                // Whole "date button" (icon + input) opens calendar
                const wrapper = dateFieldTrigger || dateRangeInput.closest('.input-with-icon');
                if (wrapper && leadDateRangePicker) {
                    wrapper.addEventListener('click', function (e) {
                        e.preventDefault();
                        if (isMobileDevice()) {
                            openMobileCalendar();
                        } else {
                            leadDateRangePicker.open();
                        }
                    });
                    wrapper.addEventListener('keydown', function (e) {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (isMobileDevice()) {
                                openMobileCalendar();
                            } else {
                                leadDateRangePicker.open();
                            }
                        }
                    });
                }
                // Also make the raw input field itself open the calendar on click
                if (dateRangeInput && leadDateRangePicker) {
                    dateRangeInput.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isMobileDevice()) {
                            openMobileCalendar();
                        } else {
                            leadDateRangePicker.open();
                        }
                    });
                }
            }
        }
    });

})();
