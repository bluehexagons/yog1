(function () {
    'use strict';

    const core = window.Yog1Core;
    const i18n = window.Yog1I18n;
    const storage = window.Yog1Storage;
    const t = i18n.t;
    const KEYS = storage.KEYS;
    const load = storage.load;
    const save = storage.save;
    const HISTORY_LIMIT = 100;
    const PAGE_SIZE = 10;
    const TIMED_SECONDS = 60;

    const ui = {};
    for (const id of [
        'mode_buttons', 'mode_info', 'view_buttons', 'sidebar_toggle', 'sidebar_toggle_play',
        'round_label', 'round_kind', 'score_label', 'timer_label',
        'workspace', 'problem', 'flip_count', 'flip_text', 'submit', 'hint', 'skip', 'share',
        'message', 'message_title', 'message_text', 'feedback', 'custom_panel', 'custom_form',
        'custom_operations', 'custom_length', 'custom_length_value', 'custom_min',
        'custom_max', 'custom_correct', 'custom_rate', 'custom_seed', 'custom_progress',
        'history', 'history_page', 'history_prev', 'history_next', 'history_clear',
        'practice_missed',
        'stats_rows', 'stats_reset_all', 'session_summary', 'session_summary_values', 'achievement_list',
        'achievement_notice', 'setting_sound', 'setting_large_text', 'setting_contrast',
        'setting_reduced_clutter', 'setting_text_spacing', 'setting_underline_links',
        'setting_motion', 'setting_language', 'quick_language',
        'setting_color_scheme', 'quick_color_scheme', 'setting_sidebar_side',
        'setting_adaptive_style', 'setting_learning_focus', 'learning_goal',
        'learning_goal_name', 'learning_goal_example', 'learning_recommendation',
        'learning_rows', 'learning_practice', 'install_app', 'export_data', 'import_data',
        'import_file', 'app_version', 'app_version_date', 'app_status'
    ]) {
        ui[id] = document.getElementById(id);
    }

    function text(type, value, className) {
        const element = document.createElement(type);
        element.textContent = value;
        if (className) {
            element.className = className;
        }
        return element;
    }

    function restartAnimation(element, className) {
        element.classList.remove(className);
        void element.offsetWidth;
        element.classList.add(className);
    }

    function number(value, id, solution) {
        return { type: 'number', value: value, id: id, solution: !!solution };
    }

    function binary(operation, left, right) {
        return { type: 'binary', operation: operation, left: left, right: right };
    }

    function squareRoot(value) {
        return { type: 'root', value: value };
    }

    const content = window.Yog1Content({
        number: number, binary: binary, squareRoot: squareRoot
    });
    const CURATED = content.curated;
    const ACHIEVEMENTS = content.achievements;
    const MODE_IDS = new Set(Object.keys(core.DIFFICULTIES).concat([
        'adaptive', 'guided', 'custom', 'daily', 'timed', 'endless', 'challenges'
    ]));

    let history = load(KEYS.history, []);
    let stats = load(KEYS.stats, {});
    let achievementState = load(KEYS.achievements, { unlocked: [], operations: [], solved: 0 });
    const defaultSettings = {
        sound: false, largeText: false, contrast: false, reducedClutter: false,
        colorScheme: 'auto', motion: 'auto', sidebarSide: 'auto', adaptiveStyle: 'flow',
        textSpacing: false, underlineLinks: false,
        learningFocus: 'recommended',
        lastView: 'play', sidebarCollapsed: false, historyPage: 0
    };
    const loadedSettings = load(KEYS.settings, null);
    let settings = loadedSettings && typeof loadedSettings === 'object' &&
        !Array.isArray(loadedSettings)
        ? Object.assign({}, defaultSettings, loadedSettings)
        : Object.assign({}, defaultSettings);
    const stackedLayout = window.matchMedia('(max-width: 640px)');
    let dailyResults = load(KEYS.daily, {});
    let adaptiveState = core.normalizeAdaptiveState(load(KEYS.adaptive, null));
    let learningState = core.normalizeLearningState(load(KEYS.learning, null));
    let resumeState = load(KEYS.resume, null);
    if (!Array.isArray(history)) history = [];
    history = history.filter(function (item) {
        return item && typeof item === 'object' &&
            typeof item.correct === 'boolean' &&
            typeof item.expression === 'string' &&
            MODE_IDS.has(item.mode) &&
            Number.isSafeInteger(item.round) && item.round >= 1 &&
            typeof item.seed === 'string' &&
            validTimestamp(item.at) &&
            (item.mode !== 'daily' || validDate(item.dailyDate)) &&
            (item.mode !== 'custom' || !item.custom ||
                Array.isArray(item.custom.operations));
    }).slice(0, HISTORY_LIMIT);
    if (!stats || typeof stats !== 'object' || Array.isArray(stats)) stats = {};
    if (!achievementState || typeof achievementState !== 'object' ||
        Array.isArray(achievementState)) {
        achievementState = { unlocked: [], operations: [], solved: 0 };
    }
    const achievementIds = new Set(ACHIEVEMENTS.map(function (item) { return item.id; }));
    achievementState.unlocked = Array.isArray(achievementState.unlocked)
        ? Array.from(new Set(achievementState.unlocked.filter(function (id) {
            return achievementIds.has(id);
        }))) : [];
    achievementState.operations = Array.isArray(achievementState.operations)
        ? Array.from(new Set(achievementState.operations.filter(function (operation) {
            return Object.prototype.hasOwnProperty.call(core.OPERATIONS, operation);
        }))) : [];
    achievementState.solved = Number.isFinite(achievementState.solved)
        ? Math.max(0, Math.trunc(achievementState.solved)) : 0;
    if (!dailyResults || typeof dailyResults !== 'object' || Array.isArray(dailyResults)) {
        dailyResults = {};
    }
    dailyResults = Object.fromEntries(Object.entries(dailyResults).filter(function (entry) {
        return validDailyResult(entry[0], entry[1]);
    }));
    if (!storage.validResume(resumeState)) resumeState = null;

    let mode = 'tutorial';
    let profile = core.DIFFICULTIES.easy;
    let round = 1;
    let currentProblem = null;
    let currentSeed = '';
    let selectedId = null;
    let currentValues = {};
    let hintLevel = 0;
    let hintsOnPuzzle = 0;
    let attemptsOnPuzzle = 0;
    let activeCustomSettings = null;
    let customRun = { attempts: 0, correct: 0, won: false };
    let historyPage = Number.isSafeInteger(settings.historyPage) &&
        settings.historyPage >= 0 ? settings.historyPage : 0;
    let forcedSeed = null;
    let forcedRound = null;
    let dailyDateOverride = null;
    let timerId = null;
    let timerDeadline = 0;
    let timeRemaining = TIMED_SECONDS;
    let installPrompt = null;
    let audioContext = null;
    let session = null;
    let currentMessage = null;
    let currentPersistentMessage = null;
    let currentFeedback = null;
    let currentAchievementId = null;
    let adaptiveProblemState = null;
    let currentLearningConcept = 'balance';
    let forcedLearningConcept = null;
    let lastTimerAnnouncement = null;

    function announce(value) {
        ui.app_status.textContent = '';
        window.setTimeout(function () {
            ui.app_status.textContent = value;
        }, 0);
    }

    function newSession() {
        session = {
            id: Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8),
            startedAt: Date.now(), puzzleStartedAt: Date.now(), attempts: 0, correct: 0,
            solved: 0, streak: 0, bestStreak: 0, hardest: 0, durations: [],
            hints: 0, lives: 3, phase: 'playing'
        };
        renderSession();
    }

    function persistResume(selectedOverride) {
        if (!currentProblem || !session) return;
        const resumedSelection = arguments.length ? selectedOverride : selectedId;
        const messageValues = {};
        if (currentPersistentMessage) {
            for (const key of Object.keys(currentPersistentMessage.values)) {
                const value = currentPersistentMessage.values[key];
                const resolved = typeof value === 'function' ? value() : value;
                if (typeof resolved === 'string' || typeof resolved === 'boolean' ||
                    (typeof resolved === 'number' && Number.isFinite(resolved))) {
                    messageValues[key] = resolved;
                } else if (resolved && typeof resolved === 'object' &&
                    typeof resolved.catalogKey === 'string') {
                    messageValues[key] = { catalogKey: resolved.catalogKey };
                }
            }
        }
        resumeState = {
            mode: mode,
            round: round,
            seed: currentSeed,
            dailyDate: mode === 'daily' ? utcDate() : null,
            custom: mode === 'custom' && activeCustomSettings
                ? Object.assign({}, activeCustomSettings, {
                    operations: activeCustomSettings.operations.slice()
                }) : null,
            adaptive: mode === 'adaptive' && adaptiveProblemState
                ? core.normalizeAdaptiveState(adaptiveProblemState) : null,
            learningConcept: mode === 'guided' ? currentLearningConcept : null,
            selectedId: resumedSelection || null,
            hintLevel: hintLevel,
            attemptsOnPuzzle: attemptsOnPuzzle,
            hintsOnPuzzle: hintsOnPuzzle,
            session: {
                id: session.id,
                startedAt: session.startedAt,
                puzzleStartedAt: session.puzzleStartedAt,
                attempts: session.attempts,
                correct: session.correct,
                solved: session.solved,
                streak: session.streak,
                bestStreak: session.bestStreak,
                hardest: session.hardest,
                durations: session.durations.slice(),
                hints: session.hints,
                lives: session.lives
            },
            customRun: mode === 'custom' ? Object.assign({}, customRun) : null,
            timerDeadline: mode === 'timed' ? timerDeadline : 0,
            phase: session.phase,
            message: currentPersistentMessage ? {
                titleKey: currentPersistentMessage.titleKey,
                messageKey: currentPersistentMessage.messageKey,
                values: messageValues
            } : null,
            feedback: currentFeedback ? {
                revealSolution: !!currentFeedback.revealSolution,
                attemptedValues: Object.assign({},
                    currentFeedback.attemptedValues === undefined
                        ? currentValues : currentFeedback.attemptedValues),
                alternate: !!currentFeedback.alternate,
                moveId: currentFeedback.moveId || null
            } : null
        };
        save(KEYS.resume, resumeState);
    }

    function customSettings() {
        return {
            operations: Array.from(ui.custom_operations.querySelectorAll('input:checked'))
                .map(function (input) { return input.value; }),
            length: Number(ui.custom_length.value),
            min: Number(ui.custom_min.value),
            max: Number(ui.custom_max.value),
            correct: Number(ui.custom_correct.value),
            rate: Number(ui.custom_rate.value),
            seed: ui.custom_seed.value.trim()
        };
    }

    function populateLanguageSelectors() {
        for (const select of [ui.setting_language, ui.quick_language]) {
            select.replaceChildren();
            for (const locale of i18n.localeOptions) {
                const option = document.createElement('option');
                option.value = locale.id;
                option.lang = locale.tag;
                option.dir = locale.direction;
                option.textContent = locale.label;
                select.appendChild(option);
            }
        }
    }

    function populateThemeSelectors() {
        for (const select of [ui.setting_color_scheme, ui.quick_color_scheme]) {
            select.replaceChildren();
            for (const scheme of window.Yog1Theme.schemes) {
                const option = document.createElement('option');
                option.value = scheme;
                option.dataset.i18n = 'theme.' + scheme;
                option.textContent = t(option.dataset.i18n);
                select.appendChild(option);
            }
        }
    }

    function refreshCompactInputLabels() {
        for (const input of document.querySelectorAll('[data-compact-input]')) {
            const button = input.querySelector('.compact-input-toggle');
            const label = input.querySelector('label');
            const select = input.querySelector('select');
            const option = select.options[select.selectedIndex];
            if (!option) continue;
            const description = label.textContent.trim() + ': ' + option.textContent.trim();
            button.setAttribute('aria-label', description);
            button.title = description;
        }
    }

    function setupCompactInputs() {
        const inputs = Array.from(document.querySelectorAll('[data-compact-input]'));

        function setExpanded(input, expanded, moveFocus) {
            const button = input.querySelector('.compact-input-toggle');
            const panel = input.querySelector('.compact-input-panel');
            button.setAttribute('aria-expanded', String(expanded));
            panel.hidden = !expanded;
            if (moveFocus) {
                (expanded ? panel.querySelector('select') : button).focus();
            }
        }

        for (const input of inputs) {
            const button = input.querySelector('.compact-input-toggle');
            button.addEventListener('click', function () {
                if (button.getAttribute('aria-busy') === 'true') return;
                const expanded = button.getAttribute('aria-expanded') !== 'true';
                for (const other of inputs) setExpanded(other, false, false);
                setExpanded(input, expanded, expanded);
            });
            input.addEventListener('change', function () {
                refreshCompactInputLabels();
                setExpanded(input, false, true);
            });
            input.addEventListener('keydown', function (event) {
                if (event.key !== 'Escape') return;
                event.preventDefault();
                event.stopPropagation();
                setExpanded(input, false, true);
            });
            input.addEventListener('focusout', function (event) {
                if (event.relatedTarget && input.contains(event.relatedTarget)) return;
                window.setTimeout(function () {
                    if (!input.contains(document.activeElement)) {
                        setExpanded(input, false, false);
                    }
                }, 0);
            });
        }

        document.addEventListener('click', function (event) {
            for (const input of inputs) {
                if (!input.contains(event.target)) setExpanded(input, false, false);
            }
        });
    }

    function chooseLanguage(nextLocale) {
        const selects = [ui.setting_language, ui.quick_language];
        for (const select of selects) {
            select.disabled = true;
            select.setAttribute('aria-busy', 'true');
            const compactInput = select.closest('[data-compact-input]');
            if (compactInput) {
                compactInput.querySelector('.compact-input-toggle')
                    .setAttribute('aria-busy', 'true');
            }
        }
        return i18n.setLocale(nextLocale).then(function (activeLocale) {
            for (const select of selects) {
                select.value = activeLocale;
                select.disabled = false;
                select.removeAttribute('aria-busy');
                const compactInput = select.closest('[data-compact-input]');
                if (compactInput) {
                    compactInput.querySelector('.compact-input-toggle')
                        .removeAttribute('aria-busy');
                }
            }
            refreshCompactInputLabels();
            return activeLocale;
        });
    }

    function cacheAllLocalesForOffline() {
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.ready.then(function (registration) {
            if (registration.active) {
                registration.active.postMessage({ type: 'cache-all-locales' });
            }
        }).catch(function () {});
    }

    function populateCustomForm() {
        for (const key of Object.keys(core.OPERATIONS)) {
            const label = text('label', '', 'check-option');
            const input = document.createElement('input');
            const labelText = document.createElement('span');
            input.type = 'checkbox';
            input.value = key;
            input.checked = ['add', 'subtract', 'multiply'].includes(key);
            labelText.dataset.i18n = 'operation.' + key;
            labelText.textContent = t(labelText.dataset.i18n);
            label.append(input, document.createTextNode(' '), labelText);
            ui.custom_operations.appendChild(label);
        }
        const saved = load(KEYS.custom, null);
        if (saved && Array.isArray(saved.operations)) {
            for (const input of ui.custom_operations.querySelectorAll('input')) {
                input.checked = saved.operations.includes(input.value);
            }
            for (const key of ['length', 'min', 'max', 'correct', 'rate', 'seed']) {
                if (saved[key] !== undefined) {
                    ui['custom_' + key].value = saved[key];
                }
            }
        }
        ui.custom_length_value.textContent = ui.custom_length.value;
    }

    function conceptLabel(id) {
        const labels = {
            balance: ['add', 'subtract'],
            multiplication: ['multiply'],
            division: ['divide'],
            remainder: ['modulo'],
            powers: ['power'],
            roots: ['root']
        };
        return (labels[id] || []).map(function (operation) {
            return t('operation.' + operation);
        }).join(' / ');
    }

    function populateLearningFocus() {
        const selected = settings.learningFocus;
        ui.setting_learning_focus.replaceChildren();
        const recommended = document.createElement('option');
        recommended.value = 'recommended';
        recommended.textContent = t('learning.recommended');
        ui.setting_learning_focus.appendChild(recommended);
        for (const id of Object.keys(core.LEARNING_CONCEPTS)) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = conceptLabel(id);
            ui.setting_learning_focus.appendChild(option);
        }
        ui.setting_learning_focus.value =
            selected === 'recommended' || core.LEARNING_CONCEPTS[selected] ? selected : 'recommended';
    }

    function selectedLearningConcept() {
        return core.LEARNING_CONCEPTS[settings.learningFocus]
            ? settings.learningFocus : core.recommendedConcept(learningState);
    }

    function tutorialProblem() {
        return {
            sides: CURATED[0].sides, score: 4, target: 4,
            roundKind: 'guided', operationCount: 2
        };
    }

    function curatedProblem(index) {
        const item = CURATED[index % CURATED.length];
        return {
            sides: core.clone(item.sides),
            score: core.difficultyScore(item.sides),
            target: 10 + index * 8,
            roundKind: index + 1 === CURATED.length ? 'challenge' : 'curated',
            operationCount: core.countOperations(item.sides[0]) + core.countOperations(item.sides[1]),
            titleKey: item.titleKey
        };
    }

    function utcDate() {
        return dailyDateOverride || new Date().toISOString().slice(0, 10);
    }

    function validDate(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
        const parsed = new Date(value + 'T00:00:00Z');
        return Number.isFinite(parsed.getTime()) &&
            parsed.toISOString().slice(0, 10) === value;
    }

    function validTimestamp(value) {
        return typeof value === 'string' && Number.isFinite(Date.parse(value));
    }

    function validDailyResult(date, result) {
        return validDate(date) && result && typeof result === 'object' &&
            typeof result.success === 'boolean' &&
            Number.isSafeInteger(result.at) &&
            Number.isSafeInteger(result.attempts) && result.attempts >= 0 &&
            Number.isSafeInteger(result.hints) && result.hints >= 0;
    }

    function recordDailyResult(success) {
        const date = utcDate();
        if (Object.prototype.hasOwnProperty.call(dailyResults, date)) return;
        dailyResults[date] = {
            attempts: session.attempts,
            hints: session.hints,
            success: success,
            at: Date.now()
        };
        save(KEYS.daily, dailyResults);
    }

    function shiftDate(value, days) {
        const date = new Date(value + 'T00:00:00Z');
        date.setUTCDate(date.getUTCDate() + days);
        return date.toISOString().slice(0, 10);
    }

    function dailyProgress() {
        const solvedDates = Object.keys(dailyResults).filter(function (date) {
            return dailyResults[date] && dailyResults[date].success === true;
        }).sort();
        let best = 0;
        let run = 0;
        let previous = null;
        for (const date of solvedDates) {
            run = previous && shiftDate(previous, 1) === date ? run + 1 : 1;
            best = Math.max(best, run);
            previous = date;
        }
        let anchor = new Date().toISOString().slice(0, 10);
        if (!dailyResults[anchor]) anchor = shiftDate(anchor, -1);
        let current = 0;
        while (dailyResults[anchor] && dailyResults[anchor].success === true) {
            current++;
            anchor = shiftDate(anchor, -1);
        }
        const marks = [];
        for (let offset = -6; offset <= 0; offset++) {
            const result = dailyResults[shiftDate(utcDate(), offset)];
            marks.push(!result ? '·' : (result.success ? '■' : '□'));
        }
        return {
            solved: solvedDates.length,
            current: current,
            best: best,
            grid: marks.join('')
        };
    }

    function modeProfile() {
        if (mode === 'adaptive') return core.adaptiveProfile(adaptiveState);
        if (mode === 'guided') {
            const concept = core.LEARNING_CONCEPTS[currentLearningConcept] ||
                core.LEARNING_CONCEPTS.balance;
            return core.DIFFICULTIES[concept.profile];
        }
        if (mode === 'timed') return core.DIFFICULTIES.hard;
        if (mode === 'endless') {
            const choices = Object.values(core.DIFFICULTIES);
            return choices[Math.min(choices.length - 1, Math.floor((round - 1) / 8))];
        }
        if (mode === 'daily') {
            const choices = [core.DIFFICULTIES.normal, core.DIFFICULTIES.hard, core.DIFFICULTIES.expert];
            return choices[core.hashSeed(utcDate()) % choices.length];
        }
        return profile;
    }

    function problemSeed() {
        if (mode === 'daily') return 'daily:' + utcDate();
        if (forcedSeed) {
            const value = forcedSeed;
            forcedSeed = null;
            return value;
        }
        if (mode === 'custom' && activeCustomSettings.seed) {
            return activeCustomSettings.seed + ':' + round;
        }
        return session.id + ':' + mode + ':' + round;
    }

    function generateCurrentProblem() {
        if (mode === 'tutorial') return tutorialProblem();
        if (mode === 'challenges') return curatedProblem(round - 1);
        if (mode === 'guided') {
            currentLearningConcept = core.LEARNING_CONCEPTS[forcedLearningConcept]
                ? forcedLearningConcept : selectedLearningConcept();
            forcedLearningConcept = null;
        }
        const adaptiveModel = adaptiveProblemState || adaptiveState;
        const selectedProfile = mode === 'adaptive'
            ? core.adaptiveProfile(adaptiveModel) : modeProfile();
        const options = {
            profile: selectedProfile,
            round: mode === 'daily' ? (core.hashSeed(utcDate()) % 40) + 1 : round,
            random: core.createSeededRandom(currentSeed),
            candidateCount: 12,
            requireUnique: true
        };
        if (mode === 'adaptive') {
            options.target = Math.round(6 + adaptiveModel.rating * 25);
            options.operationWeights =
                core.adaptiveOperationWeights(adaptiveModel, selectedProfile, settings.adaptiveStyle);
        }
        if (mode === 'guided') {
            const concept = core.LEARNING_CONCEPTS[currentLearningConcept];
            Object.assign(options, {
                operations: concept.operations,
                length: concept.length,
                maxNumber: core.DIFFICULTIES[concept.profile].maxNumber
            });
        }
        if (mode === 'custom') {
            Object.assign(options, {
                operations: activeCustomSettings.operations,
                length: activeCustomSettings.length,
                targetRange: [activeCustomSettings.min, activeCustomSettings.max],
                maxNumber: Math.max(30, activeCustomSettings.max * 2)
            });
        }
        return core.generateProblem(options);
    }

    function renderExpression(expression, parent) {
        if (expression.type === 'number') {
            const value = currentValues[expression.id] === undefined
                ? expression.value : currentValues[expression.id];
            const button = text('button', value, 'number');
            button.type = 'button';
            button.dataset.numberId = expression.id;
            button.setAttribute('aria-pressed', selectedId === expression.id ? 'true' : 'false');
            button.setAttribute('aria-label', selectedId === expression.id
                ? t('aria.restoreNumber', { number: expression.value })
                : t('aria.changeNumber', { number: expression.value }));
            if (selectedId === expression.id) button.classList.add('flipped');
            if ((mode === 'tutorial' || hintLevel >= 4) && expression.solution) {
                button.classList.add('hint-target');
            }
            parent.appendChild(button);
            return;
        }
        if (expression.type === 'root') {
            parent.append(text('span', '√', 'operator root'), text('span', '(', 'paren'));
            renderExpression(expression.value, parent);
            parent.appendChild(text('span', ')', 'paren'));
            return;
        }
        parent.appendChild(text('span', '(', 'paren'));
        renderExpression(expression.left, parent);
        parent.appendChild(text('span', ' ' + core.OPERATIONS[expression.operation].symbol + ' ', 'operator'));
        renderExpression(expression.right, parent);
        parent.appendChild(text('span', ')', 'paren'));
    }

    function solutionSide() {
        const details = core.solutionDetails(currentProblem.sides, {});
        for (let i = 0; i < currentProblem.sides.length; i++) {
            let found = false;
            core.visitNumbers(currentProblem.sides[i], function (node) {
                if (node.id === details.solutionId) found = true;
            });
            if (found) return i;
        }
        return 0;
    }

    function drawProblem() {
        ui.problem.replaceChildren();
        currentProblem.sides.forEach(function (side, index) {
            const wrapper = document.createElement('span');
            wrapper.className = 'equation-side';
            if (hintLevel >= 3 && index === solutionSide()) wrapper.classList.add('hint-side');
            renderExpression(side, wrapper);
            ui.problem.appendChild(wrapper);
            if (index + 1 < currentProblem.sides.length) {
                ui.problem.appendChild(text('span', ' = ', 'equals'));
            }
        });
        ui.problem.setAttribute('aria-label', currentProblem.sides.map(function (side) {
            const labels = {};
            for (const key of Object.keys(core.OPERATIONS)) {
                labels[key] = t('operation.' + key);
            }
            return core.describe(side, currentValues, labels);
        }).join(' ' + t('aria.equals') + ' '));
        const visibleTarget = ui.problem.querySelector(selectedId
            ? '[data-number-id="' + selectedId + '"]'
            : '.hint-target, .hint-side');
        if (visibleTarget) {
            ui.problem.scrollLeft = Math.max(0, visibleTarget.offsetLeft -
                (ui.problem.clientWidth - visibleTarget.offsetWidth) / 2);
        }
        ui.flip_count.textContent = selectedId ? '0' : '1';
        ui.flip_text.textContent = t(selectedId ? 'flip.many' : 'flip.one');
        ui.round_label.textContent = mode === 'tutorial' ? t('round.tutorial') :
            (mode === 'daily' ? utcDate() : t('round.number', { round: round }));
        ui.round_kind.textContent = t('round.' + currentProblem.roundKind);
        ui.round_kind.className = 'round-kind ' + currentProblem.roundKind;
        ui.score_label.textContent = t('round.score', { target: currentProblem.target, score: currentProblem.score });
        renderLearningGoal();
    }

    function announceProblem() {
        announce(ui.round_label.textContent + '. ' + ui.problem.getAttribute('aria-label'));
    }

    function renderLearningGoal() {
        ui.learning_goal.hidden = mode !== 'guided' || !currentProblem;
        if (ui.learning_goal.hidden) return;
        const concept = core.LEARNING_CONCEPTS[currentLearningConcept];
        ui.learning_goal_name.textContent = conceptLabel(currentLearningConcept);
        ui.learning_goal_example.textContent = concept.example;
    }

    function renderSubmitLabel() {
        const replayingChallenges = mode === 'challenges' &&
            round === CURATED.length && session.phase === 'review';
        ui.submit.textContent = t(replayingChallenges ? 'action.again' :
            (session.phase === 'review' ? 'action.next' : 'action.check'));
    }

    function renderCatalogMessage() {
        if (!currentMessage) return;
        const values = {};
        for (const key of Object.keys(currentMessage.values)) {
            const value = currentMessage.values[key];
            values[key] = typeof value === 'function' ? value() :
                (value && typeof value.catalogKey === 'string'
                    ? t(value.catalogKey) : value);
        }
        ui.message_title.textContent = t(currentMessage.titleKey, values);
        ui.message_text.textContent = t(currentMessage.messageKey, values);
    }

    function setCatalogMessage(titleKey, messageKey, values) {
        currentMessage = { titleKey: titleKey, messageKey: messageKey, values: values || {} };
        currentPersistentMessage = currentMessage;
        renderCatalogMessage();
        announce(ui.message_title.textContent + '. ' + ui.message_text.textContent);
        restartAnimation(ui.message, 'is-updating');
    }

    function setTransientCatalogMessage(titleKey, messageKey, values) {
        currentMessage = { titleKey: titleKey, messageKey: messageKey, values: values || {} };
        renderCatalogMessage();
        announce(ui.message_title.textContent + '. ' + ui.message_text.textContent);
        restartAnimation(ui.message, 'is-updating');
    }

    function hideFeedback() {
        currentFeedback = null;
        ui.feedback.hidden = true;
        ui.feedback.replaceChildren();
    }

    function renderExplanation() {
        if (!currentFeedback || !currentProblem) return;
        const details = core.solutionDetails(
            currentProblem.sides,
            currentFeedback.attemptedValues === undefined ? currentValues : currentFeedback.attemptedValues
        );
        const current = text('p', t('feedback.totals', {
            left: details.currentTotals[0], right: details.currentTotals[1]
        }));
        ui.feedback.replaceChildren(current);
        function appendSteps(label, groups) {
            const disclosure = document.createElement('details');
            const summary = text('summary', label);
            const list = document.createElement('ol');
            for (const steps of groups) {
                for (const step of steps) {
                    const item = document.createElement('li');
                    item.appendChild(text('code', step.expression + ' = ' + step.value));
                    list.appendChild(item);
                }
            }
            if (list.children.length) {
                disclosure.append(summary, list);
                ui.feedback.appendChild(disclosure);
            }
        }
        appendSteps(t('feedback.yourSteps'), details.currentSteps);
        const learning = core.learningAnalysis(currentProblem.sides, currentFeedback.moveId);
        if (learning.moveEffect) {
            const effect = learning.moveEffect;
            ui.feedback.appendChild(text('p', t('feedback.effect', {
                number: effect.number,
                side: t(effect.side === 0 ? 'side.left' : 'side.right'),
                before: effect.before,
                after: effect.after,
                delta: (effect.delta >= 0 ? '+' : '') + effect.delta
            }), 'move-effect'));
        }
        if (currentFeedback.alternate) {
            ui.feedback.appendChild(text('p', t('feedback.alternate'), 'alternate-solution'));
        }
        if (currentFeedback.revealSolution) {
            const solution = text('p', t('feedback.solution', {
                number: details.solutionValue, total: details.solvedTotals[0]
            }));
            const equation = text('code', details.solvedExpression);
            ui.feedback.append(solution, equation);
            appendSteps(t('feedback.solutionSteps'), details.solvedSteps);
            const concept = core.LEARNING_CONCEPTS[learning.concept];
            const reflection = document.createElement('p');
            reflection.className = 'learning-reflection';
            reflection.append(
                text('strong', conceptLabel(learning.concept) + ': '),
                text('code', concept.example)
            );
            ui.feedback.appendChild(reflection);
            const copyExample = text('button', t('action.copyJson'), 'small-button');
            copyExample.type = 'button';
            copyExample.dataset.copyLearning = 'true';
            ui.feedback.appendChild(copyExample);
        }
        ui.feedback.hidden = false;
    }

    function showExplanation(revealSolution, attemptedValues, alternate, moveId) {
        currentFeedback = {
            revealSolution: revealSolution,
            attemptedValues: attemptedValues,
            alternate: !!alternate,
            moveId: moveId || null
        };
        renderExplanation();
        restartAnimation(ui.feedback, 'is-updating');
    }

    function startRound() {
        selectedId = null;
        currentValues = {};
        hintLevel = 0;
        hintsOnPuzzle = 0;
        attemptsOnPuzzle = 0;
        session.phase = 'playing';
        currentSeed = problemSeed();
        adaptiveProblemState = mode === 'adaptive'
            ? core.normalizeAdaptiveState(adaptiveState) : null;
        currentProblem = generateCurrentProblem();
        session.puzzleStartedAt = Date.now();
        renderSubmitLabel();
        ui.submit.disabled = session.phase === 'finished';
        ui.hint.disabled = mode === 'tutorial' || session.phase === 'finished';
        ui.skip.disabled = mode === 'tutorial' || session.phase === 'finished';
        ui.skip.textContent = t(mode === 'adaptive' ? 'action.skip' : 'action.reveal');
        ui.share.disabled = mode === 'tutorial';
        hideFeedback();
        drawProblem();
        restartAnimation(ui.problem, 'is-new-round');
        updateProgress();
        if (mode === 'tutorial') {
            setCatalogMessage('message.howToPlay', 'message.tutorial');
        } else if (mode === 'daily') {
            setCatalogMessage('message.daily', 'message.dailyBody');
        } else if (mode === 'timed') {
            setCatalogMessage('message.timed', 'message.timedBody');
        } else if (mode === 'endless') {
            setCatalogMessage('message.endless', 'message.endlessBody');
        } else if (mode === 'adaptive') {
            setCatalogMessage('mode.adaptive', settings.adaptiveStyle === 'coach'
                ? 'modeDescription.adaptiveCoach' : 'modeDescription.adaptive');
        } else if (mode === 'guided') {
            setCatalogMessage('mode.guided', 'modeDescription.guided');
        } else if (mode === 'challenges') {
            setCatalogMessage(currentProblem.titleKey, 'message.curated', {
                round: round, count: CURATED.length
            });
        } else {
            setCatalogMessage('round.kindTitle', currentProblem.roundKind === 'challenge' ?
                'message.challengeBody' : 'message.standardBody', {
                    kind: { catalogKey: 'round.' + currentProblem.roundKind }
                });
        }
        announceProblem();
        persistResume();
    }

    function valuesWithFlip(id) {
        return id ? { [id]: 1 } : {};
    }

    function isSolved() {
        return core.evaluate(currentProblem.sides[0], currentValues) ===
            core.evaluate(currentProblem.sides[1], currentValues);
    }

    function getStat(id) {
        if (!stats[id] || typeof stats[id] !== 'object') {
            stats[id] = { attempts: 0, correct: 0, bestStreak: 0, streak: 0, bestScore: 0 };
        }
        for (const key of ['attempts', 'correct', 'bestStreak', 'streak', 'bestScore']) {
            stats[id][key] = Number.isFinite(stats[id][key])
                ? Math.max(0, Math.trunc(stats[id][key])) : 0;
        }
        stats[id].correct = Math.min(stats[id].correct, stats[id].attempts);
        return stats[id];
    }

    function recordStat(correct) {
        if (mode === 'tutorial') return;
        const stat = getStat(mode);
        stat.attempts++;
        if (correct) {
            stat.correct++;
            stat.streak++;
            stat.bestStreak = Math.max(stat.bestStreak || 0, stat.streak);
        } else {
            stat.streak = 0;
        }
        save(KEYS.stats, stats);
        renderStats();
    }

    function recordHistory(correct) {
        if (mode === 'tutorial') return;
        history.unshift({
            correct: correct,
            expression: currentProblem.sides.map(function (side) {
                return core.serialize(side, currentValues);
            }).join(' = '),
            mode: mode,
            round: round,
            seed: currentSeed,
            dailyDate: mode === 'daily' ? utcDate() : null,
            custom: mode === 'custom' && activeCustomSettings
                ? Object.assign({}, activeCustomSettings) : null,
            adaptive: mode === 'adaptive' && adaptiveProblemState
                ? core.normalizeAdaptiveState(adaptiveProblemState) : null,
            learningConcept: mode === 'guided' ? currentLearningConcept : null,
            at: new Date().toISOString()
        });
        history = history.slice(0, HISTORY_LIMIT);
        save(KEYS.history, history);
        historyPage = 0;
        renderHistory();
    }

    function modeLabel() {
        return t('mode.' + mode);
    }

    function adaptiveOperations() {
        return currentProblem
            ? core.solutionDetails(currentProblem.sides, {}).operations : [];
    }

    function adapt(event) {
        if (mode !== 'adaptive') return;
        adaptiveState = core.updateAdaptiveState(
            adaptiveState, event, adaptiveOperations()
        );
        save(KEYS.adaptive, adaptiveState);
        updateModeInfo();
        renderSession();
    }

    function recordLearning(solved) {
        const concept = mode === 'guided'
            ? currentLearningConcept : core.learningConceptFor(currentProblem.sides);
        learningState = core.updateLearningState(learningState, concept, {
            solved: solved,
            hints: hintsOnPuzzle,
            attempts: attemptsOnPuzzle,
            durationMs: Date.now() - session.puzzleStartedAt
        });
        save(KEYS.learning, learningState);
        renderLearning();
        updateModeInfo();
    }

    function recordAttempt(correct) {
        attemptsOnPuzzle++;
        session.attempts++;
        if (correct) {
            session.correct++;
            session.solved++;
            session.streak++;
            session.bestStreak = Math.max(session.bestStreak, session.streak);
            session.hardest = Math.max(session.hardest, currentProblem.score);
            session.durations.push(Date.now() - session.puzzleStartedAt);
        } else {
            session.streak = 0;
        }
        if (mode === 'custom') {
            customRun.attempts++;
            if (correct) customRun.correct++;
        }
        recordStat(correct);
        recordHistory(correct);
        renderSession();
    }

    function unlock(id) {
        if (achievementState.unlocked.includes(id)) return;
        achievementState.unlocked.push(id);
        save(KEYS.achievements, achievementState);
        currentAchievementId = id;
        renderAchievementNotice();
        ui.achievement_notice.hidden = false;
        restartAnimation(ui.achievement_notice, 'is-updating');
        playSound('achievement');
        renderAchievements();
    }

    function renderAchievementNotice() {
        if (!currentAchievementId) return;
        ui.achievement_notice.textContent = t('page.achievements') + ': ' +
            t('achievement.' + currentAchievementId + '.name');
    }

    function updateAchievements() {
        achievementState.solved = (achievementState.solved || 0) + 1;
        const details = core.solutionDetails(currentProblem.sides, {});
        achievementState.operations = Array.from(new Set(
            (achievementState.operations || []).concat(details.operations)
        ));
        save(KEYS.achievements, achievementState);
        unlock('first');
        if (session.streak >= 5) unlock('streak5');
        if (achievementState.solved >= 20) unlock('twenty');
        if (achievementState.operations.length === Object.keys(core.OPERATIONS).length) unlock('explorer');
        if (mode === 'daily') unlock('daily');
        if (currentProblem.roundKind === 'challenge' && hintLevel === 0) unlock('nohint');
        if (mode === 'challenges' && round === CURATED.length &&
            session.solved >= CURATED.length) {
            unlock('curated');
        }
    }

    function correctAnswer() {
        const intendedId = core.solutionDetails(currentProblem.sides, {}).solutionId;
        const alternate = selectedId !== intendedId;
        adapt('correct');
        recordAttempt(true);
        recordLearning(true);
        updateAchievements();
        playSound('correct');
        showExplanation(true, undefined, alternate, selectedId);
        session.phase = 'review';
        persistResume(null);
        renderSubmitLabel();
        ui.hint.disabled = true;
        ui.skip.disabled = true;

        if (mode === 'daily') {
            recordDailyResult(true);
            updateProgress();
            updateModeInfo();
            ui.submit.disabled = true;
            setCatalogMessage('daily.complete', 'daily.completeBody', {
                attempts: session.attempts, hints: session.hints
            });
            persistResume(null);
            return;
        }
        if (mode === 'custom') {
            const accuracy = customRun.correct / customRun.attempts * 100;
            if (customRun.correct >= activeCustomSettings.correct && accuracy >= activeCustomSettings.rate) {
                customRun.won = true;
                persistResume(null);
                ui.submit.disabled = true;
                setCatalogMessage('custom.won', 'custom.wonBody', {
                    correct: customRun.correct,
                    attempts: customRun.attempts,
                    accuracy: Math.round(accuracy)
                });
                persistResume(null);
                return;
            }
        }
        if (mode === 'challenges' && round === CURATED.length &&
            session.solved >= CURATED.length) {
            setCatalogMessage('challenges.complete', 'challenges.completeBody', {
                count: CURATED.length
            });
        } else {
            setCatalogMessage(alternate ? 'result.alternate' : 'result.balanced',
                alternate ? 'result.alternateBody' : 'result.balancedBody');
        }
        persistResume(null);
    }

    function incorrectAnswer() {
        const attemptedValues = currentValues;
        const attemptedId = selectedId;
        adapt('wrong');
        recordAttempt(false);
        playSound('incorrect');
        showExplanation(false, attemptedValues, false, attemptedId);
        selectedId = null;
        currentValues = {};
        drawProblem();
        persistResume();
        if (mode === 'endless' && attemptsOnPuzzle === 1) {
            session.lives--;
            renderSession();
            if (session.lives <= 0) {
                recordLearning(false);
                finishSession('endless.complete', 'endless.completeBody', {
                    count: session.solved
                });
                showExplanation(true, attemptedValues, false, attemptedId);
                persistResume(null);
                return;
            }
            persistResume();
        }
        setCatalogMessage('result.retry', 'result.retryBody');
        persistResume();
    }

    function advanceRound() {
        if (session.phase === 'finished') return;
        if (mode === 'challenges' && round === CURATED.length) {
            round = 1;
            newSession();
        } else {
            round++;
        }
        startRound();
    }

    function finishSession(titleKey, messageKey, values) {
        session.phase = 'finished';
        clearTimer();
        ui.submit.disabled = true;
        ui.hint.disabled = true;
        ui.skip.disabled = true;
        const stat = getStat(mode);
        stat.bestScore = Math.max(stat.bestScore || 0, session.solved);
        save(KEYS.stats, stats);
        renderStats();
        renderSession();
        setCatalogMessage(titleKey, messageKey, values);
        persistResume(null);
    }

    function updateProgress() {
        ui.custom_progress.hidden =
            !['custom', 'endless', 'adaptive', 'daily', 'guided'].includes(mode);
        if (mode === 'custom') {
            if (!activeCustomSettings) {
                ui.custom_progress.hidden = true;
                return;
            }
            const accuracy = customRun.attempts
                ? Math.round(customRun.correct / customRun.attempts * 100) : 0;
            ui.custom_progress.textContent = t('progress.custom', {
                correct: customRun.correct, goal: activeCustomSettings.correct,
                accuracy: accuracy, rate: activeCustomSettings.rate
            });
        } else if (mode === 'endless') {
            ui.custom_progress.textContent = t('progress.chances', {
                chances: session.lives + ' / 3'
            });
        } else if (mode === 'adaptive') {
            ui.custom_progress.textContent = t('progress.adaptive', {
                level: t('mode.' + core.adaptiveProfile(adaptiveState).id),
                skill: Math.round(adaptiveState.rating * 100)
            });
        } else if (mode === 'daily') {
            const progress = dailyProgress();
            ui.custom_progress.textContent = t('progress.daily', {
                current: progress.current, best: progress.best, grid: progress.grid
            });
            ui.custom_progress.setAttribute('aria-label', t('progress.daily', {
                current: progress.current, best: progress.best,
                grid: progress.solved + ' ' + t('history.correct')
            }));
        } else if (mode === 'guided') {
            const entry = learningState.concepts[currentLearningConcept];
            ui.custom_progress.textContent = t('learning.progressValue', {
                progress: core.conceptProgress(entry)
            });
        }
        if (mode !== 'daily') ui.custom_progress.removeAttribute('aria-label');
    }

    function renderSession() {
        if (!session) return;
        const accuracy = session.attempts ? Math.round(session.correct / session.attempts * 100) : 0;
        const average = session.durations.length
            ? (session.durations.reduce(function (sum, value) { return sum + value; }, 0) /
                session.durations.length / 1000).toFixed(1) : null;
        function sessionStat(label, value) {
            const group = document.createElement('div');
            group.className = 'session-stat';
            group.append(
                text('dt', label, 'summary-label'),
                text('dd', value, 'summary-value')
            );
            return group;
        }
        ui.session_summary_values.replaceChildren(
            sessionStat(t('session.solved'), String(session.solved)),
            sessionStat(t('session.accuracy'), accuracy + '%'),
            sessionStat(t('session.average'),
                average === null ? '—' : t('timer.seconds', { seconds: average })),
            sessionStat(t('session.hardest'), String(Math.round(session.hardest)))
        );
        updateProgress();
    }

    function renderHistory() {
        const pages = Math.max(1, Math.ceil(history.length / PAGE_SIZE));
        const nextPage = Math.max(0, Math.min(historyPage, pages - 1));
        if (nextPage !== historyPage || settings.historyPage !== nextPage) {
            historyPage = nextPage;
            settings.historyPage = historyPage;
            save(KEYS.settings, settings);
        }
        ui.history.replaceChildren();
        const pageStart = historyPage * PAGE_SIZE;
        const pageItems = history.slice(pageStart, (historyPage + 1) * PAGE_SIZE);
        pageItems.forEach(function (item, pageIndex) {
            const li = document.createElement('li');
            li.className = item.correct ? 'correct' : 'incorrect';
            const summary = text('div', (item.correct ? t('history.correct') : t('history.incorrect')) +
                ' · ' + t('mode.' + item.mode) + ' · ' +
                t('history.round', { round: item.round }), 'history-summary');
            summary.appendChild(text('time',
                ' ' + new Date(item.at).toLocaleString(i18n.getLanguageTag()), 'history-date'));
            const actions = document.createElement('div');
            actions.className = 'history-item-actions';
            const replay = text('button', t('action.replay'), 'small-button');
            replay.type = 'button';
            replay.dataset.replayHistory = String(pageStart + pageIndex);
            actions.appendChild(replay);
            li.append(summary, text('code', item.expression), actions);
            ui.history.appendChild(li);
        });
        if (!history.length) ui.history.appendChild(text('li', t('history.empty'), 'empty'));
        ui.history_page.textContent = t('history.page', {
            page: historyPage + 1, pages: pages, count: history.length, limit: HISTORY_LIMIT
        });
        ui.history_prev.disabled = historyPage === 0;
        ui.history_next.disabled = historyPage + 1 >= pages;
        ui.practice_missed.textContent = t('action.replay') + ' · ' + t('history.incorrect');
        ui.practice_missed.disabled = !history.some(function (item) {
            return item && !item.correct && item.seed;
        });
        ui.history_clear.disabled = history.length === 0;
    }

    function renderStats() {
        ui.stats_rows.replaceChildren();
        const modes = Object.values(core.DIFFICULTIES).map(function (item) {
            return { id: item.id, name: t('mode.' + item.id) };
        }).concat([
            { id: 'adaptive', name: t('mode.adaptive') },
            { id: 'guided', name: t('mode.guided') },
            { id: 'custom', name: t('mode.custom') }, { id: 'daily', name: t('mode.daily') },
            { id: 'timed', name: t('mode.timed') }, { id: 'endless', name: t('mode.endless') },
            { id: 'challenges', name: t('mode.challenges') }
        ]);
        for (const item of modes) {
            const stat = getStat(item.id);
            const row = document.createElement('tr');
            const name = text('th', item.name);
            name.scope = 'row';
            row.appendChild(name);
            row.appendChild(text('td', stat.correct + '/' + stat.attempts));
            row.appendChild(text('td', stat.attempts ? Math.round(stat.correct / stat.attempts * 100) + '%' : '—'));
            row.appendChild(text('td', String(stat.bestStreak || 0)));
            row.appendChild(text('td', stat.bestScore ? String(stat.bestScore) : '—'));
            const action = document.createElement('td');
            const reset = text('button', t('action.reset'), 'small-button');
            reset.type = 'button';
            reset.dataset.resetStat = item.id;
            reset.setAttribute('aria-label', t('aria.resetStat', { mode: item.name }));
            reset.disabled = stat.attempts === 0 && !stat.bestScore;
            action.appendChild(reset);
            row.appendChild(action);
            ui.stats_rows.appendChild(row);
        }
    }

    function renderLearning() {
        learningState = core.normalizeLearningState(learningState);
        const recommended = core.recommendedConcept(learningState);
        ui.learning_recommendation.textContent = t('learning.recommendation', {
            concept: conceptLabel(recommended)
        });
        ui.learning_rows.replaceChildren();
        for (const id of Object.keys(core.LEARNING_CONCEPTS)) {
            const entry = learningState.concepts[id];
            const row = document.createElement('tr');
            const name = text('th', conceptLabel(id));
            name.scope = 'row';
            row.append(
                name,
                text('td', String(entry.seen)),
                text('td', core.conceptProgress(entry) + '%'),
                text('td', entry.unaided + '/' + entry.solved)
            );
            ui.learning_rows.appendChild(row);
        }
    }

    function renderAchievements() {
        ui.achievement_list.replaceChildren();
        for (const item of ACHIEVEMENTS) {
            const unlocked = achievementState.unlocked.includes(item.id);
            const li = document.createElement('li');
            li.className = unlocked ? 'unlocked' : 'locked';
            li.append(text('strong', (unlocked ? '✓ ' : '○ ') + t('achievement.' + item.id + '.name')),
                text('span', t('achievement.' + item.id + '.description')));
            ui.achievement_list.appendChild(li);
        }
    }

    function updateModeInfo() {
        if (mode === 'adaptive') {
            const item = core.adaptiveProfile(adaptiveState);
            ui.mode_info.replaceChildren(
                text('strong', t('mode.adaptive')),
                text('span', t(settings.adaptiveStyle === 'coach'
                    ? 'modeDescription.adaptiveCoach' : 'modeDescription.adaptive')),
                text('span', t('progress.adaptive', {
                    level: t('mode.' + item.id),
                    skill: Math.round(adaptiveState.rating * 100)
                }))
            );
        } else if (mode === 'guided') {
            const concept = core.LEARNING_CONCEPTS[currentLearningConcept];
            const entry = learningState.concepts[currentLearningConcept];
            ui.mode_info.replaceChildren(
                text('strong', t('mode.guided')),
                text('span', conceptLabel(currentLearningConcept)),
                text('code', concept.example),
                text('span', t('learning.progressValue', {
                    progress: core.conceptProgress(entry)
                }))
            );
        } else if (mode === 'daily') {
            const progress = dailyProgress();
            ui.mode_info.replaceChildren(
                text('strong', t('mode.daily')),
                text('span', t('modeDescription.daily')),
                text('span', t('progress.daily', {
                    current: progress.current, best: progress.best, grid: progress.grid
                }))
            );
        } else if (core.DIFFICULTIES[mode]) {
            const item = core.DIFFICULTIES[mode];
            ui.mode_info.replaceChildren(
                text('strong', t('mode.' + item.id)), text('span', t('difficulty.' + item.id)),
                text('span', t('mode.operations', { operations: item.operations.map(function (key) {
                    return core.OPERATIONS[key].symbol;
                }).join(' ') })),
                text('span', t('mode.baseLength', { min: item.length[0], max: item.length[1] }))
            );
        } else {
            ui.mode_info.replaceChildren(
                text('strong', t('mode.' + mode)),
                text('span', t('modeDescription.' + mode))
            );
        }
    }

    function setSidebarCollapsed(collapsed, remember) {
        const wrapper = document.getElementById('wrapper');
        wrapper.classList.toggle('sidebar-collapsed', collapsed);
        if (remember !== false) {
            settings.sidebarCollapsed = !!collapsed;
            save(KEYS.settings, settings);
        }
        for (const button of [ui.sidebar_toggle, ui.sidebar_toggle_play]) {
            button.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        }
        ui.sidebar_toggle.textContent = t(collapsed ? 'menu.expand' : 'menu.collapse');
        ui.sidebar_toggle.title = t(collapsed ? 'menu.expandTitle' : 'menu.collapseTitle');
    }

    function showView(view, focusHeading) {
        const screens = Array.from(document.querySelectorAll('[data-screen]'));
        const selected = screens.find(function (screen) { return screen.dataset.screen === view; }) || screens[0];
        settings.lastView = selected.dataset.screen;
        save(KEYS.settings, settings);
        for (const screen of screens) screen.hidden = screen !== selected;
        document.getElementById('app_footer').hidden = selected.dataset.screen === 'play';
        for (const button of ui.view_buttons.querySelectorAll('[data-view]')) {
            const active = button.dataset.view === selected.dataset.screen;
            button.classList.toggle('active', active);
            if (active) button.setAttribute('aria-current', 'page');
            else button.removeAttribute('aria-current');
        }
        setSidebarCollapsed(selected.dataset.screen === 'play'
            ? !!settings.sidebarCollapsed : stackedLayout.matches, false);
        if (focusHeading) {
            const heading = selected.querySelector('h2');
            if (heading) {
                heading.tabIndex = -1;
                heading.focus();
            } else if (currentProblem) {
                ui.problem.focus();
                announceProblem();
            }
        }
    }

    function clearTimer() {
        if (timerId) window.clearInterval(timerId);
        timerId = null;
        timerDeadline = 0;
        lastTimerAnnouncement = null;
        ui.timer_label.hidden = true;
    }

    function startTimer(deadline) {
        clearTimer();
        timerDeadline = deadline || Date.now() + TIMED_SECONDS * 1000;
        timeRemaining = Math.max(0, Math.ceil((timerDeadline - Date.now()) / 1000));
        ui.timer_label.hidden = false;
        ui.timer_label.textContent = t('timer.seconds', { seconds: timeRemaining });
        ui.timer_label.setAttribute('aria-label', t('mode.timed') + ': ' +
            t('timer.seconds', { seconds: timeRemaining }));
        function updateTimer() {
            timeRemaining = Math.max(0, Math.ceil((timerDeadline - Date.now()) / 1000));
            ui.timer_label.textContent = t('timer.seconds', { seconds: timeRemaining });
            ui.timer_label.setAttribute('aria-label', t('mode.timed') + ': ' +
                t('timer.seconds', { seconds: timeRemaining }));
            if ([30, 10, 5].includes(timeRemaining) && lastTimerAnnouncement !== timeRemaining) {
                lastTimerAnnouncement = timeRemaining;
                announce(ui.timer_label.getAttribute('aria-label'));
            }
            if (timeRemaining <= 0) {
                finishSession('timed.complete', 'timed.result', { count: session.solved });
                playSound('finish');
            }
        }
        if (timeRemaining <= 0) {
            updateTimer();
            return;
        }
        timerId = window.setInterval(updateTimer, 250);
        persistResume();
    }

    function activateMode(nextMode, button, options) {
        options = options || {};
        const moveFocus = !!button && document.activeElement === button;
        clearTimer();
        mode = nextMode;
        if (core.DIFFICULTIES[mode]) profile = core.DIFFICULTIES[mode];
        round = options.round || 1;
        forcedSeed = options.seed || null;
        forcedRound = options.round || null;
        dailyDateOverride = options.date || null;
        forcedLearningConcept = options.learningConcept || null;
        if (mode === 'guided') {
            currentLearningConcept = core.LEARNING_CONCEPTS[forcedLearningConcept]
                ? forcedLearningConcept : selectedLearningConcept();
        }
        if (mode === 'adaptive' && options.adaptiveState) {
            adaptiveState = core.normalizeAdaptiveState(options.adaptiveState);
        }
        activeCustomSettings = null;
        customRun = { attempts: 0, correct: 0, won: false };
        for (const candidate of ui.mode_buttons.querySelectorAll('button')) {
            const active = candidate === button;
            candidate.classList.toggle('active', active);
            candidate.setAttribute('aria-pressed', active ? 'true' : 'false');
        }
        ui.custom_panel.hidden = mode !== 'custom';
        showView('play');
        setSidebarCollapsed(mode !== 'custom' || stackedLayout.matches);
        newSession();
        updateModeInfo();
        if (mode === 'custom') {
            currentProblem = null;
            ui.submit.disabled = true;
            ui.hint.disabled = true;
            ui.skip.disabled = true;
            ui.share.disabled = true;
            ui.problem.replaceChildren();
            hideFeedback();
            setCatalogMessage('custom.builder', 'custom.builderBody');
        } else {
            startRound();
            if (mode === 'timed') startTimer();
        }
        if (moveFocus) {
            (mode === 'custom' ? ui.custom_operations.querySelector('input') : ui.problem).focus();
        }
    }

    function dailyShareText() {
        const result = dailyResults[utcDate()];
        const progress = dailyProgress();
        if (!result) return t('share.dailyDefault', { date: utcDate() }) + '\n' + progress.grid;
        return t(result.success === false ? 'share.dailyRevealed' : 'share.dailySolved', {
            date: utcDate(), attempts: result.attempts, hints: result.hints
        }) + '\n' + progress.grid + ' · ' + t('share.dailyStreak', { streak: progress.current });
    }

    function sharePuzzle() {
        const url = new URL(window.location.href);
        url.search = '';
        url.searchParams.set('lang', i18n.getLocale());
        let shareText = 'You Only Get 1s';
        if (mode === 'daily') {
            url.searchParams.set('daily', utcDate());
            shareText = dailyShareText();
        } else if (mode === 'challenges') {
            url.searchParams.set('challenge', String(round));
            shareText += ' · ' + t('share.challenge', { round: round });
        } else {
            url.searchParams.set('seed', currentSeed);
            if (mode === 'adaptive') {
                const sharedModel = adaptiveProblemState || adaptiveState;
                url.searchParams.set('difficulty', 'adaptive');
                url.searchParams.set('rating', String(sharedModel.rating));
                url.searchParams.set('comfort', Object.keys(core.OPERATIONS).map(function (operation) {
                    return sharedModel.operations[operation];
                }).join(','));
            } else if (mode === 'guided') {
                url.searchParams.set('difficulty', 'guided');
                url.searchParams.set('focus', currentLearningConcept);
            } else if (mode === 'custom') {
                url.searchParams.set('difficulty', 'custom');
                url.searchParams.set('ops', activeCustomSettings.operations.join(','));
                url.searchParams.set('length', String(activeCustomSettings.length));
                url.searchParams.set('min', String(activeCustomSettings.min));
                url.searchParams.set('max', String(activeCustomSettings.max));
            } else {
                url.searchParams.set('difficulty', modeProfile().id);
            }
            url.searchParams.set('round', String(round));
            shareText += ' · ' + t('share.puzzle', { mode: modeLabel() });
        }
        const value = shareText + '\n' + url.toString();
        if (navigator.share) {
            navigator.share({ title: 'You Only Get 1s', text: shareText, url: url.toString() }).catch(function () {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(value).then(function () {
                setTransientCatalogMessage('share.copied', 'share.ready');
            }).catch(function () {
                window.prompt(t('share.prompt'), value);
            });
        } else {
            window.prompt(t('share.prompt'), value);
        }
    }

    function playSound(kind) {
        if (!settings.sound) return;
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return;
        if (!audioContext) audioContext = new Audio();
        if (audioContext.state === 'suspended') {
            const resume = audioContext.resume();
            if (resume && resume.catch) resume.catch(function () {});
        }
        const patterns = {
            flip: [[220, 0, 0.04, 'square']],
            correct: [[440, 0, 0.08, 'sine'], [660, 0.08, 0.12, 'sine']],
            incorrect: [[150, 0, 0.16, 'sawtooth']],
            achievement: [[523, 0, 0.08, 'triangle'], [784, 0.09, 0.16, 'triangle']],
            finish: [[330, 0, 0.08, 'square'], [220, 0.08, 0.18, 'square']]
        };
        const now = audioContext.currentTime;
        for (const note of patterns[kind] || []) {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            oscillator.type = note[3];
            oscillator.frequency.setValueAtTime(note[0], now + note[1]);
            gain.gain.setValueAtTime(0.035, now + note[1]);
            gain.gain.exponentialRampToValueAtTime(0.001, now + note[2]);
            oscillator.connect(gain).connect(audioContext.destination);
            oscillator.start(now + note[1]);
            oscillator.stop(now + note[2]);
        }
    }

    function applySettings() {
        document.documentElement.classList.toggle('large-text', !!settings.largeText);
        document.body.classList.toggle('high-contrast', !!settings.contrast);
        document.body.classList.toggle('reduced-clutter', !!settings.reducedClutter);
        document.body.classList.toggle('increased-text-spacing', !!settings.textSpacing);
        document.body.classList.toggle('underline-links', !!settings.underlineLinks);
        const colorScheme = window.Yog1Theme.apply(settings.colorScheme);
        const motion = window.Yog1Theme.applyMotion(settings.motion);
        settings.colorScheme = colorScheme;
        settings.motion = motion;
        const requestedSide = ['auto', 'left', 'right'].includes(settings.sidebarSide) ? settings.sidebarSide : 'auto';
        const sidebarSide = requestedSide === 'auto'
            ? (i18n.getDirection() === 'rtl' ? 'right' : 'left') : requestedSide;
        document.body.classList.toggle('sidebar-left', sidebarSide === 'left');
        document.body.classList.toggle('sidebar-right', sidebarSide === 'right');
        ui.setting_sound.checked = !!settings.sound;
        ui.setting_large_text.checked = !!settings.largeText;
        ui.setting_contrast.checked = !!settings.contrast;
        ui.setting_reduced_clutter.checked = !!settings.reducedClutter;
        ui.setting_text_spacing.checked = !!settings.textSpacing;
        ui.setting_underline_links.checked = !!settings.underlineLinks;
        ui.setting_motion.value = motion;
        ui.setting_language.value = i18n.getLocale();
        ui.quick_language.value = i18n.getLocale();
        ui.setting_color_scheme.value = colorScheme;
        ui.quick_color_scheme.value = colorScheme;
        refreshCompactInputLabels();
        ui.setting_sidebar_side.value = requestedSide;
        ui.setting_adaptive_style.value =
            ['flow', 'coach'].includes(settings.adaptiveStyle) ? settings.adaptiveStyle : 'flow';
        populateLearningFocus();
    }

    function renderVersion() {
        const release = window.Yog1Version;
        if (!release || !ui.app_version || !ui.app_version_date) return;
        ui.app_version.textContent = release.version;
        ui.app_version_date.dateTime = release.commitDate;
        const date = new Date(release.commitDate + 'T00:00:00Z');
        ui.app_version_date.textContent = Number.isNaN(date.getTime())
            ? release.commitDate
            : date.toLocaleDateString(i18n.getLanguageTag(), {
                year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
            });
    }

    function refreshLocalizedUi() {
        i18n.apply();
        renderVersion();
        applySettings();
        updateModeInfo();
        renderHistory();
        renderStats();
        renderLearning();
        renderAchievements();
        renderSession();
        if (currentProblem) drawProblem();
        ui.skip.textContent = t(mode === 'adaptive' ? 'action.skip' : 'action.reveal');
        renderExplanation();
        renderAchievementNotice();
        if (timerId) ui.timer_label.textContent = t('timer.seconds', { seconds: timeRemaining });
        renderSubmitLabel();
        renderCatalogMessage();
        setSidebarCollapsed(document.getElementById('wrapper').classList.contains('sidebar-collapsed'));
    }
    window.addEventListener('yog1localechange', refreshLocalizedUi);
    stackedLayout.addEventListener('change', function (event) {
        setSidebarCollapsed(event.matches ? true :
            (settings.lastView === 'play' ? !!settings.sidebarCollapsed : false), false);
    });

    ui.problem.addEventListener('click', function (event) {
        const button = event.target.closest('[data-number-id]');
        if (!button || session.phase !== 'playing' || !currentProblem) return;
        const keyboardActivation = event.detail === 0;
        const id = button.dataset.numberId;
        selectedId = selectedId === id ? null : id;
        currentValues = valuesWithFlip(selectedId);
        playSound('flip');
        drawProblem();
        const replacement = ui.problem.querySelector('[data-number-id="' + id + '"]');
        if (keyboardActivation && selectedId) {
            ui.submit.focus();
        } else if (replacement) {
            replacement.focus();
        }
        if (mode === 'tutorial') {
            setCatalogMessage(isSolved() ? 'tutorial.good' : 'tutorial.restore',
                isSolved() ? 'tutorial.goodBody' : 'tutorial.restoreBody');
        }
        persistResume();
    });
    ui.feedback.addEventListener('click', function (event) {
        const button = event.target.closest('[data-copy-learning]');
        if (!button || !currentProblem) return;
        const value = JSON.stringify(core.learningExample(currentProblem.sides), null, 2);
        if (navigator.clipboard) {
            navigator.clipboard.writeText(value).then(function () {
                setTransientCatalogMessage('share.jsonCopied', 'share.jsonReady');
            }).catch(function () {
                window.prompt(t('share.jsonPrompt'), value);
            });
        } else {
            window.prompt(t('share.jsonPrompt'), value);
        }
    });

    ui.submit.addEventListener('click', function () {
        if (session.phase === 'review') {
            advanceRound();
            return;
        }
        if (!currentProblem || session.phase === 'finished') return;
        if (isSolved()) {
            if (mode === 'tutorial') {
                const easyButton = ui.mode_buttons.querySelector('[data-mode="easy"]');
                activateMode('easy', easyButton);
                setCatalogMessage('tutorial.complete', 'tutorial.completeBody');
                announce(ui.message_title.textContent + '. ' + ui.message_text.textContent + ' ' +
                    ui.round_label.textContent + '. ' + ui.problem.getAttribute('aria-label'));
                persistResume();
            } else {
                correctAnswer();
            }
        } else if (mode === 'tutorial') {
            selectedId = null;
            currentValues = {};
            drawProblem();
            setCatalogMessage('tutorial.retry', 'tutorial.retryBody');
            persistResume();
            playSound('incorrect');
        } else {
            incorrectAnswer();
        }
    });

    ui.hint.addEventListener('click', function () {
        if (!currentProblem || session.phase !== 'playing' || hintLevel >= 4) return;
        hintLevel = Math.min(4, hintLevel + 1);
        session.hints++;
        hintsOnPuzzle++;
        if (hintLevel === 1) adapt('hint');
        ui.hint.disabled = hintLevel >= 4;
        drawProblem();
        const learning = core.learningAnalysis(currentProblem.sides);
        if (hintLevel === 1) {
            setCatalogMessage('hint.compare', 'hint.compareBody', {
                left: learning.beforeTotals[0],
                right: learning.beforeTotals[1],
                gap: learning.gap
            });
        } else if (hintLevel === 2) {
            const effect = learning.intendedEffect;
            setCatalogMessage('hint.direction', 'hint.directionBody', {
                side: { catalogKey: effect.side === 0 ? 'side.left' : 'side.right' },
                delta: (effect.delta >= 0 ? '+' : '') + effect.delta,
                total: effect.after
            });
        } else {
            setCatalogMessage(hintLevel === 3 ? 'hint.side' : 'hint.number',
                hintLevel === 3 ? 'hint.sideBody' : 'hint.numberBody');
        }
        persistResume();
    });

    ui.skip.addEventListener('click', function () {
        if (!currentProblem || session.phase !== 'playing') return;
        adapt('skip');
        recordAttempt(false);
        recordLearning(false);
        const intendedId = core.solutionDetails(currentProblem.sides, {}).solutionId;
        showExplanation(true, {}, false, intendedId);
        session.phase = 'review';
        persistResume(null);
        renderSubmitLabel();
        ui.hint.disabled = true;
        ui.skip.disabled = true;
        if (mode === 'daily') {
            recordDailyResult(false);
            updateProgress();
            updateModeInfo();
            ui.submit.disabled = true;
            setCatalogMessage('daily.revealed', 'daily.revealedBody');
            persistResume(null);
            return;
        }
        if (mode === 'endless') {
            if (attemptsOnPuzzle === 1) {
                session.lives--;
                renderSession();
                if (session.lives <= 0) {
                    finishSession('endless.complete', 'endless.revealedBody');
                    return;
                }
            }
        }
        setCatalogMessage(mode === 'adaptive' ? 'adaptive.skipped' : 'result.solution',
            mode === 'adaptive' ? 'adaptive.skippedBody' : 'result.solutionBody');
        persistResume(null);
    });

    ui.share.addEventListener('click', sharePuzzle);
    ui.sidebar_toggle.addEventListener('click', function () {
        setSidebarCollapsed(!document.getElementById('wrapper').classList.contains('sidebar-collapsed'));
    });
    ui.sidebar_toggle_play.addEventListener('click', function () {
        setSidebarCollapsed(!document.getElementById('wrapper').classList.contains('sidebar-collapsed'));
    });
    ui.view_buttons.addEventListener('click', function (event) {
        const button = event.target.closest('[data-view]');
        if (button) showView(button.dataset.view, true);
    });
    ui.mode_buttons.addEventListener('click', function (event) {
        const button = event.target.closest('[data-mode]');
        if (button) activateMode(button.dataset.mode, button);
    });

    ui.custom_form.addEventListener('submit', function (event) {
        event.preventDefault();
        const chosen = customSettings();
        for (const input of ui.custom_form.querySelectorAll('[aria-invalid="true"]')) {
            input.removeAttribute('aria-invalid');
            input.removeAttribute('aria-describedby');
        }
        ui.custom_form.querySelector('fieldset').setAttribute('aria-describedby', 'custom_note');
        if (!chosen.operations.length) {
            setCatalogMessage('custom.chooseOperation', 'custom.chooseOperationBody');
            ui.custom_form.querySelector('fieldset').setAttribute('aria-describedby', 'custom_note message');
            const firstOperation = ui.custom_operations.querySelector('input');
            if (firstOperation) firstOperation.focus();
            return;
        }
        if (!chosen.operations.some(function (operation) {
            return ['add', 'subtract', 'multiply', 'divide', 'power'].includes(operation);
        })) {
            setCatalogMessage('custom.chooseIdentity', 'custom.chooseIdentityBody');
            ui.custom_form.querySelector('fieldset').setAttribute('aria-describedby', 'custom_note message');
            const firstIdentity = Array.from(ui.custom_operations.querySelectorAll('input')).find(function (input) {
                return ['add', 'subtract', 'multiply', 'divide', 'power'].includes(input.value);
            });
            if (firstIdentity) firstIdentity.focus();
            return;
        }
        if (chosen.min > chosen.max) {
            setCatalogMessage('custom.checkTargets', 'custom.checkTargetsBody');
            ui.custom_min.setAttribute('aria-invalid', 'true');
            ui.custom_max.setAttribute('aria-invalid', 'true');
            ui.custom_min.setAttribute('aria-describedby', 'message');
            ui.custom_max.setAttribute('aria-describedby', 'message');
            ui.custom_min.focus();
            return;
        }
        save(KEYS.custom, chosen);
        activeCustomSettings = chosen;
        customRun = { attempts: 0, correct: 0, won: false };
        round = forcedRound || 1;
        forcedRound = null;
        newSession();
        startRound();
    });

    ui.custom_length.addEventListener('input', function () {
        ui.custom_length_value.textContent = ui.custom_length.value;
    });
    ui.custom_form.addEventListener('input', function () {
        for (const input of ui.custom_form.querySelectorAll('[aria-invalid="true"]')) {
            input.removeAttribute('aria-invalid');
            input.removeAttribute('aria-describedby');
        }
        if (ui.custom_form.checkValidity()) {
            save(KEYS.custom, customSettings());
        }
    });
    ui.history.addEventListener('click', function (event) {
        const button = event.target.closest('[data-replay-history]');
        if (!button) return;
        const item = history[Number(button.dataset.replayHistory)];
        if (!item) return;
        const modeButton = ui.mode_buttons.querySelector('[data-mode="' + item.mode + '"]');
        if (!modeButton) return;
        if (item.mode === 'custom' && item.custom &&
            Array.isArray(item.custom.operations)) {
            activateMode('custom', modeButton, {
                seed: item.seed,
                round: item.round
            });
            for (const input of ui.custom_operations.querySelectorAll('input')) {
                input.checked = item.custom.operations.includes(input.value);
            }
            for (const key of ['length', 'min', 'max', 'correct', 'rate', 'seed']) {
                if (item.custom[key] !== undefined) ui['custom_' + key].value = item.custom[key];
            }
            ui.custom_length_value.textContent = ui.custom_length.value;
            ui.custom_form.requestSubmit();
        } else {
            activateMode(item.mode, modeButton, {
                seed: item.seed,
                round: item.round,
                date: item.dailyDate,
                adaptiveState: item.adaptive,
                learningConcept: item.learningConcept
            });
        }
        setCatalogMessage('history.replaying', 'history.replayingBody');
        persistResume();
    });
    ui.history_prev.addEventListener('click', function () {
        historyPage--;
        renderHistory();
    });
    ui.history_next.addEventListener('click', function () {
        historyPage++;
        renderHistory();
    });
    ui.practice_missed.addEventListener('click', function () {
        const index = history.findIndex(function (item) {
            return item && !item.correct && item.seed;
        });
        if (index < 0) return;
        historyPage = Math.floor(index / PAGE_SIZE);
        renderHistory();
        const replay = ui.history.querySelector('[data-replay-history="' + index + '"]');
        if (replay) replay.click();
    });
    ui.history_clear.addEventListener('click', function () {
        if (window.confirm(t('confirm.clearHistory'))) {
            history = [];
            historyPage = 0;
            settings.historyPage = historyPage;
            save(KEYS.settings, settings);
            save(KEYS.history, history);
            renderHistory();
        }
    });
    ui.stats_rows.addEventListener('click', function (event) {
        const button = event.target.closest('[data-reset-stat]');
        const modeName = button && button.closest('tr').querySelector('th').textContent;
        if (button && window.confirm(t('confirm.resetStat', { mode: modeName }))) {
            delete stats[button.dataset.resetStat];
            save(KEYS.stats, stats);
            renderStats();
        }
    });
    ui.stats_reset_all.addEventListener('click', function () {
        if (window.confirm(t('confirm.resetAll'))) {
            stats = {};
            save(KEYS.stats, stats);
            renderStats();
        }
    });

    for (const input of [ui.setting_sound, ui.setting_large_text, ui.setting_contrast,
        ui.setting_reduced_clutter, ui.setting_text_spacing, ui.setting_underline_links]) {
        input.addEventListener('change', function () {
            settings = Object.assign({}, settings, {
                sound: ui.setting_sound.checked,
                largeText: ui.setting_large_text.checked,
                contrast: ui.setting_contrast.checked,
                reducedClutter: ui.setting_reduced_clutter.checked,
                textSpacing: ui.setting_text_spacing.checked,
                underlineLinks: ui.setting_underline_links.checked,
                sidebarSide: ui.setting_sidebar_side.value,
                adaptiveStyle: ui.setting_adaptive_style.value,
                learningFocus: ui.setting_learning_focus.value
            });
            save(KEYS.settings, settings);
            applySettings();
            if (input === ui.setting_sound && input.checked) playSound('flip');
        });
    }
    for (const select of [ui.setting_language, ui.quick_language]) {
        select.addEventListener('change', function () {
            chooseLanguage(select.value);
        });
    }
    for (const select of [ui.setting_color_scheme, ui.quick_color_scheme]) {
        select.addEventListener('change', function () {
            settings.colorScheme = select.value;
            save(KEYS.settings, settings);
            applySettings();
        });
    }
    ui.setting_motion.addEventListener('change', function () {
        settings.motion = ui.setting_motion.value;
        save(KEYS.settings, settings);
        applySettings();
    });
    ui.setting_sidebar_side.addEventListener('change', function () {
        settings.sidebarSide = ui.setting_sidebar_side.value;
        save(KEYS.settings, settings);
        applySettings();
    });
    ui.setting_adaptive_style.addEventListener('change', function () {
        settings.adaptiveStyle = ui.setting_adaptive_style.value;
        save(KEYS.settings, settings);
        updateModeInfo();
    });
    ui.setting_learning_focus.addEventListener('change', function () {
        settings.learningFocus = ui.setting_learning_focus.value;
        save(KEYS.settings, settings);
    });
    ui.learning_practice.addEventListener('click', function () {
        settings.learningFocus = 'recommended';
        save(KEYS.settings, settings);
        const button = ui.mode_buttons.querySelector('[data-mode="guided"]');
        activateMode('guided', button);
    });

    document.addEventListener('keydown', function (event) {
        if (event.target.matches('input, select, textarea')) return;
        if (document.getElementById('play_screen').hidden) return;
        const numbers = Array.from(ui.problem.querySelectorAll('.number'));
        const inPuzzle = event.target === document.body || ui.workspace.contains(event.target);
        if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && numbers.length &&
            (event.target === ui.problem || event.target.closest('.number'))) {
            event.preventDefault();
            let index = numbers.indexOf(document.activeElement);
            index += event.key === 'ArrowRight' ? 1 : -1;
            if (index < 0) index = numbers.length - 1;
            if (index >= numbers.length) index = 0;
            numbers[index].focus();
        } else if (event.key.toLowerCase() === 'h' && inPuzzle && !ui.hint.disabled) {
            event.preventDefault();
            ui.hint.click();
        } else if (event.key === 'Enter' && inPuzzle && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            ui.submit.click();
        } else if (event.key === 'Enter' && document.activeElement === document.body) {
            event.preventDefault();
            ui.submit.click();
        }
    });

    window.addEventListener('beforeinstallprompt', function (event) {
        event.preventDefault();
        installPrompt = event;
        ui.install_app.hidden = false;
    });
    ui.install_app.addEventListener('click', function () {
        if (installPrompt) {
            cacheAllLocalesForOffline();
            installPrompt.prompt();
            installPrompt = null;
            ui.install_app.hidden = true;
        }
    });
    ui.export_data.addEventListener('click', function () {
        try {
            const snapshot = storage.exportData();
            const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
                type: 'application/json'
            });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'yog1-save-' + new Date().toISOString().slice(0, 10) + '.json';
            link.hidden = true;
            document.body.appendChild(link);
            link.click();
            window.setTimeout(function () {
                URL.revokeObjectURL(link.href);
                link.remove();
            }, 0);
            setTransientCatalogMessage('data.exported', 'data.exportedBody');
        } catch (error) {
            setTransientCatalogMessage('data.exportFailed', 'data.exportFailedBody');
        }
    });
    ui.import_data.addEventListener('click', function () {
        ui.import_file.click();
    });
    ui.import_file.addEventListener('change', function () {
        const file = ui.import_file.files && ui.import_file.files[0];
        if (!file) return;
        file.text().then(function (value) {
            const snapshot = JSON.parse(value);
            if (!window.confirm(t('confirm.importData'))) return;
            storage.importData(snapshot);
            window.location.reload();
        }).catch(function () {
            setTransientCatalogMessage('data.importFailed', 'data.importFailedBody');
        }).finally(function () {
            ui.import_file.value = '';
        });
    });

    function restoreLastProblem() {
        if (!resumeState || !storage.validResume(resumeState)) return false;
        const saved = resumeState;
        const preferredView = ['play', 'options', 'stats', 'about'].includes(settings.lastView)
            ? settings.lastView : 'play';
        const preferredCollapsed = !!settings.sidebarCollapsed;
        const button = ui.mode_buttons.querySelector('[data-mode="' + saved.mode + '"]');
        if (!button) return false;
        const latestAdaptiveState = adaptiveState;

        if (saved.mode === 'custom') {
            activateMode('custom', button, {
                seed: saved.seed,
                round: saved.round
            });
            for (const input of ui.custom_operations.querySelectorAll('input')) {
                input.checked = saved.custom.operations.includes(input.value);
            }
            for (const key of ['length', 'min', 'max', 'correct', 'rate', 'seed']) {
                ui['custom_' + key].value = saved.custom[key];
            }
            ui.custom_length_value.textContent = ui.custom_length.value;
            ui.custom_form.requestSubmit();
            if (!currentProblem) return false;
        } else {
            activateMode(saved.mode, button, {
                seed: saved.seed,
                round: saved.round,
                date: saved.dailyDate,
                adaptiveState: saved.adaptive,
                learningConcept: saved.learningConcept
            });
        }
        if (saved.mode === 'adaptive') adaptiveState = latestAdaptiveState;

        if (mode === 'timed') {
            clearTimer();
            timerDeadline = saved.timerDeadline;
        }
        session = Object.assign({}, saved.session, {
            durations: saved.session.durations.slice(),
            phase: saved.phase
        });
        attemptsOnPuzzle = saved.attemptsOnPuzzle;
        hintsOnPuzzle = saved.hintsOnPuzzle;
        if (mode === 'custom') customRun = Object.assign({}, saved.customRun);
        hintLevel = saved.hintLevel;
        selectedId = null;
        if (saved.selectedId) {
            currentProblem.sides.forEach(function (side) {
                core.visitNumbers(side, function (node) {
                    if (node.id === saved.selectedId) selectedId = node.id;
                });
            });
        }
        currentValues = valuesWithFlip(selectedId);
        currentFeedback = saved.feedback ? {
            revealSolution: saved.feedback.revealSolution,
            attemptedValues: Object.assign({}, saved.feedback.attemptedValues || {}),
            alternate: saved.feedback.alternate,
            moveId: saved.feedback.moveId
        } : null;
        if (saved.message) {
            currentMessage = {
                titleKey: saved.message.titleKey,
                messageKey: saved.message.messageKey,
                values: Object.assign({}, saved.message.values)
            };
            currentPersistentMessage = currentMessage;
        }
        if (mode === 'custom' && customRun.won) {
            session.phase = 'review';
            selectedId = null;
            currentValues = {};
            ui.submit.disabled = true;
            setCatalogMessage('custom.won', 'custom.wonBody', {
                correct: customRun.correct,
                attempts: customRun.attempts,
                accuracy: customRun.attempts
                    ? Math.round(customRun.correct / customRun.attempts * 100) : 0
            });
        }
        if (session.phase !== 'playing') {
            selectedId = null;
            currentValues = {};
            ui.hint.disabled = true;
            ui.skip.disabled = true;
            if (session.phase === 'finished' || mode === 'daily' ||
                (mode === 'custom' && customRun.won)) {
                ui.submit.disabled = true;
            }
        } else {
            ui.hint.disabled = mode === 'tutorial' || hintLevel >= 4;
        }
        drawProblem();
        renderSession();
        renderSubmitLabel();
        renderExplanation();
        renderCatalogMessage();
        persistResume();
        if (mode === 'timed' && session.phase !== 'finished') {
            startTimer(saved.timerDeadline);
        }

        if (preferredView !== 'play') {
            setSidebarCollapsed(preferredCollapsed);
            showView(preferredView);
        } else {
            setSidebarCollapsed(preferredCollapsed);
        }
        return true;
    }

    function bootFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const requestedDaily = params.get('daily');
        function sharedDailyDate(value) {
            return validDate(value) ? value : null;
        }
        const daily = sharedDailyDate(requestedDaily);
        const challenge = params.get('challenge');
        const seed = params.get('seed');
        function sharedRound(value) {
            const parsed = Number(value);
            return Number.isSafeInteger(parsed)
                ? Math.max(1, Math.min(100000, parsed)) : 1;
        }
        if (daily) {
            const button = ui.mode_buttons.querySelector('[data-mode="daily"]');
            activateMode('daily', button, {
                date: daily
            });
            return;
        }
        if (challenge) {
            const button = ui.mode_buttons.querySelector('[data-mode="challenges"]');
            activateMode('challenges', button, {
                round: Math.min(CURATED.length, sharedRound(challenge))
            });
            setCatalogMessage('shared.challenge', currentProblem.titleKey);
            return;
        }
        if (seed) {
            const safeSeed = seed.slice(0, 160);
            const requested = params.get('difficulty');
            if (requested === 'adaptive') {
                const operations = {};
                const comfort = (params.get('comfort') || '').split(',');
                Object.keys(core.OPERATIONS).forEach(function (operation, index) {
                    operations[operation] = Number(comfort[index]);
                });
                const button = ui.mode_buttons.querySelector('[data-mode="adaptive"]');
                activateMode('adaptive', button, {
                    seed: safeSeed,
                    round: sharedRound(params.get('round')),
                    adaptiveState: {
                        rating: Number(params.get('rating')),
                        operations: operations
                    }
                });
                setCatalogMessage('shared.seeded', 'shared.seededBody');
                return;
            }
            if (requested === 'custom') {
                const button = ui.mode_buttons.querySelector('[data-mode="custom"]');
                activateMode('custom', button, {
                    seed: safeSeed,
                    round: sharedRound(params.get('round'))
                });
                const requestedOperations = Array.from(new Set(
                    (params.get('ops') || '').split(',').filter(function (key) {
                        return Object.prototype.hasOwnProperty.call(core.OPERATIONS, key);
                    })
                ));
                for (const input of ui.custom_operations.querySelectorAll('input')) {
                    input.checked = requestedOperations.includes(input.value);
                }
                ui.custom_length.value = Math.max(2, Math.min(12, Number(params.get('length')) || 5));
                ui.custom_length_value.textContent = ui.custom_length.value;
                ui.custom_min.value = Math.max(3, Math.min(100, Number(params.get('min')) || 12));
                ui.custom_max.value = Math.max(Number(ui.custom_min.value),
                    Math.min(100, Number(params.get('max')) || 35));
                ui.custom_form.requestSubmit();
                if (!activeCustomSettings) return;
                setCatalogMessage('shared.custom', 'shared.customBody');
                return;
            }
            if (requested === 'guided') {
                const focus = core.LEARNING_CONCEPTS[params.get('focus')]
                    ? params.get('focus') : 'balance';
                const button = ui.mode_buttons.querySelector('[data-mode="guided"]');
                activateMode('guided', button, {
                    seed: safeSeed,
                    round: sharedRound(params.get('round')),
                    learningConcept: focus
                });
                setCatalogMessage('shared.seeded', 'shared.seededBody');
                return;
            }
            const difficulty = core.DIFFICULTIES[requested] ? requested : 'normal';
            const button = ui.mode_buttons.querySelector('[data-mode="' + difficulty + '"]');
            activateMode(difficulty, button, {
                seed: safeSeed,
                round: sharedRound(params.get('round'))
            });
            setCatalogMessage('shared.seeded', 'shared.seededBody');
            return;
        }
        if (restoreLastProblem()) return;
        const button = ui.mode_buttons.querySelector('[data-mode="tutorial"]');
        activateMode('tutorial', button);
    }

    populateLanguageSelectors();
    populateThemeSelectors();
    setupCompactInputs();
    populateCustomForm();
    i18n.apply();
    renderVersion();
    applySettings();
    renderHistory();
    renderStats();
    renderLearning();
    renderAchievements();
    ui.achievement_notice.hidden = true;
    if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
        navigator.serviceWorker.register('sw.js').then(function () {
            return navigator.serviceWorker.ready;
        }).then(function (registration) {
            if (i18n.getLocale() === 'en' || !registration.active) return;
            registration.active.postMessage({
                type: 'cache-locale',
                path: i18n.localeSource(i18n.getLocale())
            });
        }).catch(function () {});
    }
    bootFromUrl();
}());
