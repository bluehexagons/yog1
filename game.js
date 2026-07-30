(function () {
    'use strict';

    const core = window.Yog1Core;
    const i18n = window.Yog1I18n;
    const t = i18n.t;
    const KEYS = {
        history: 'yog1.problemHistory.v2',
        stats: 'yog1.difficultyStats.v2',
        custom: 'yog1.customSettings.v2',
        achievements: 'yog1.achievements.v1',
        settings: 'yog1.accessibility.v1',
        daily: 'yog1.dailyResults.v1',
        adaptive: 'yog1.adaptiveModel.v1'
    };
    const HISTORY_LIMIT = 100;
    const PAGE_SIZE = 10;
    const TIMED_SECONDS = 60;

    const ui = {};
    for (const id of [
        'mode_buttons', 'mode_info', 'view_buttons', 'sidebar_toggle', 'sidebar_toggle_play',
        'round_label', 'round_kind', 'score_label', 'timer_label',
        'problem', 'flip_count', 'flip_text', 'submit', 'hint', 'skip', 'share',
        'message_title', 'message_text', 'feedback', 'custom_panel', 'custom_form',
        'custom_operations', 'custom_length', 'custom_length_value', 'custom_min',
        'custom_max', 'custom_correct', 'custom_rate', 'custom_seed', 'custom_progress',
        'history', 'history_page', 'history_prev', 'history_next', 'history_clear',
        'stats_rows', 'stats_reset_all', 'session_summary', 'achievement_list',
        'achievement_notice', 'setting_sound', 'setting_large_text', 'setting_contrast',
        'setting_reduced_clutter', 'setting_language', 'quick_language', 'setting_sidebar_side', 'install_app'
    ]) {
        ui[id] = document.getElementById(id);
    }

    function load(key, fallback) {
        try {
            const value = JSON.parse(localStorage.getItem(key));
            return value === null ? fallback : value;
        } catch (error) {
            return fallback;
        }
    }

    function save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            // The game remains playable when browser storage is unavailable.
        }
    }

    function text(type, value, className) {
        const element = document.createElement(type);
        element.textContent = value;
        if (className) {
            element.className = className;
        }
        return element;
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

    const CURATED = [
        {
            titleKey: 'curated.original',
            sides: [binary('subtract', number(7, 'c00'), number(2, 'c01')),
                binary('add', number(3, 'c02', true), number(4, 'c03'))]
        },
        {
            titleKey: 'curated.product',
            sides: [binary('multiply', number(6, 'c10'), number(2, 'c11')),
                binary('subtract', number(13, 'c12'), number(8, 'c13', true))]
        },
        {
            titleKey: 'curated.root',
            sides: [binary('modulo', number(25, 'c20'), number(7, 'c21')),
                binary('add', squareRoot(number(9, 'c22')), number(6, 'c23', true))]
        },
        {
            titleKey: 'curated.power',
            sides: [binary('power', number(2, 'c30'), number(3, 'c31')),
                binary('subtract', number(9, 'c32'), number(7, 'c33', true))]
        },
        {
            titleKey: 'curated.divide',
            sides: [binary('divide', number(42, 'c40'), number(6, 'c41')),
                binary('subtract', number(8, 'c42'), number(5, 'c43', true))]
        }
    ];

    const ACHIEVEMENTS = [
        { id: 'first' }, { id: 'streak5' }, { id: 'twenty' }, { id: 'explorer' },
        { id: 'daily' }, { id: 'nohint' }, { id: 'curated' }
    ];

    let history = load(KEYS.history, []);
    let stats = load(KEYS.stats, {});
    let achievementState = load(KEYS.achievements, { unlocked: [], operations: [], solved: 0 });
    const defaultSettings = {
        sound: false, largeText: false, contrast: false, reducedClutter: false, sidebarSide: 'auto'
    };
    const loadedSettings = load(KEYS.settings, null);
    let settings = loadedSettings && typeof loadedSettings === 'object' &&
        !Array.isArray(loadedSettings)
        ? Object.assign({}, defaultSettings, loadedSettings)
        : Object.assign({}, defaultSettings);
    let dailyResults = load(KEYS.daily, {});
    let adaptiveState = core.normalizeAdaptiveState(load(KEYS.adaptive, null));
    if (!Array.isArray(history)) history = [];
    let historyMigrated = false;
    for (const item of history) {
        if (!item || typeof item !== 'object') continue;
        const modeId = i18n.getMessageId('mode', item.modeId || item.mode);
        if (modeId && (item.modeId !== modeId ||
            Object.prototype.hasOwnProperty.call(item, 'mode'))) {
            item.modeId = modeId;
            delete item.mode;
            historyMigrated = true;
        }
    }
    if (historyMigrated) save(KEYS.history, history);
    if (!stats || typeof stats !== 'object' || Array.isArray(stats)) stats = {};
    if (!achievementState || !Array.isArray(achievementState.unlocked)) {
        achievementState = { unlocked: [], operations: [], solved: 0 };
    }
    if (!Array.isArray(achievementState.operations)) achievementState.operations = [];
    if (!Number.isFinite(achievementState.solved)) achievementState.solved = 0;
    if (!dailyResults || typeof dailyResults !== 'object' || Array.isArray(dailyResults)) {
        dailyResults = {};
    }

    let mode = 'tutorial';
    let profile = core.DIFFICULTIES.easy;
    let round = 1;
    let currentProblem = null;
    let currentSeed = '';
    let selectedId = null;
    let currentValues = {};
    let hintLevel = 0;
    let attemptsOnPuzzle = 0;
    let awaitingAdvance = false;
    let activeCustomSettings = null;
    let customRun = { attempts: 0, correct: 0, won: false };
    let historyPage = 0;
    let forcedSeed = null;
    let forcedRound = null;
    let dailyDateOverride = null;
    let timerId = null;
    let timeRemaining = TIMED_SECONDS;
    let installPrompt = null;
    let audioContext = null;
    let session = null;
    let currentMessage = null;
    let currentFeedback = null;
    let currentAchievementId = null;
    let adaptiveProblemState = null;

    function newSession() {
        session = {
            id: Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8),
            startedAt: Date.now(), puzzleStartedAt: Date.now(), attempts: 0, correct: 0,
            solved: 0, streak: 0, bestStreak: 0, hardest: 0, durations: [],
            hints: 0, lives: 3, finished: false
        };
        renderSession();
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

    function modeProfile() {
        if (mode === 'adaptive') return core.adaptiveProfile(adaptiveState);
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
        if (mode === 'daily') return 'daily:' + utcDate() + ':v1';
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
        const adaptiveModel = adaptiveProblemState || adaptiveState;
        const selectedProfile = mode === 'adaptive'
            ? core.adaptiveProfile(adaptiveModel) : modeProfile();
        const options = {
            profile: selectedProfile,
            round: mode === 'daily' ? (core.hashSeed(utcDate()) % 40) + 1 : round,
            random: core.createSeededRandom(currentSeed)
        };
        if (mode === 'adaptive') {
            options.target = Math.round(9 + adaptiveModel.rating * 43);
            options.operationWeights =
                core.adaptiveOperationWeights(adaptiveModel, selectedProfile);
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
            if ((mode === 'tutorial' || hintLevel >= 2) && expression.solution) {
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
            if (hintLevel >= 1 && index === solutionSide()) wrapper.classList.add('hint-side');
            renderExpression(side, wrapper);
            ui.problem.appendChild(wrapper);
            if (index + 1 < currentProblem.sides.length) {
                ui.problem.appendChild(text('span', ' = ', 'equals'));
            }
        });
        ui.problem.setAttribute('aria-label', currentProblem.sides.map(function (side) {
            return core.serialize(side, currentValues);
        }).join(' = '));
        ui.flip_count.textContent = selectedId ? '0' : '1';
        ui.flip_text.textContent = t(selectedId ? 'flip.many' : 'flip.one');
        ui.round_label.textContent = mode === 'tutorial' ? t('round.tutorial') :
            (mode === 'daily' ? utcDate() : t('round.number', { round: round }));
        ui.round_kind.textContent = t('round.' + currentProblem.roundKind);
        ui.round_kind.className = 'round-kind ' + currentProblem.roundKind;
        ui.score_label.textContent = t('round.score', { target: currentProblem.target, score: currentProblem.score });
    }

    function renderSubmitLabel() {
        const replayingChallenges = mode === 'challenges' &&
            round === CURATED.length && awaitingAdvance;
        ui.submit.textContent = t(replayingChallenges ? 'action.again' :
            (awaitingAdvance ? 'action.next' : 'action.check'));
    }

    function renderCatalogMessage() {
        if (!currentMessage) return;
        const values = {};
        for (const key of Object.keys(currentMessage.values)) {
            const value = currentMessage.values[key];
            values[key] = typeof value === 'function' ? value() : value;
        }
        ui.message_title.textContent = t(currentMessage.titleKey, values);
        ui.message_text.textContent = t(currentMessage.messageKey, values);
    }

    function setCatalogMessage(titleKey, messageKey, values) {
        currentMessage = { titleKey: titleKey, messageKey: messageKey, values: values || {} };
        renderCatalogMessage();
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
        if (currentFeedback.revealSolution) {
            const solution = text('p', t('feedback.solution', {
                number: details.solutionValue, total: details.solvedTotals[0]
            }));
            const equation = text('code', details.solvedExpression);
            ui.feedback.append(solution, equation);
        }
        ui.feedback.hidden = false;
    }

    function showExplanation(revealSolution, attemptedValues) {
        currentFeedback = {
            revealSolution: revealSolution,
            attemptedValues: attemptedValues
        };
        renderExplanation();
    }

    function startRound() {
        selectedId = null;
        currentValues = {};
        hintLevel = 0;
        attemptsOnPuzzle = 0;
        awaitingAdvance = false;
        currentSeed = problemSeed();
        adaptiveProblemState = mode === 'adaptive'
            ? core.normalizeAdaptiveState(adaptiveState) : null;
        currentProblem = generateCurrentProblem();
        session.puzzleStartedAt = Date.now();
        renderSubmitLabel();
        ui.submit.disabled = session.finished;
        ui.hint.disabled = mode === 'tutorial' || session.finished;
        ui.skip.disabled = mode === 'tutorial' || session.finished;
        ui.skip.textContent = t(mode === 'adaptive' ? 'action.skip' : 'action.reveal');
        ui.share.disabled = mode === 'tutorial';
        hideFeedback();
        drawProblem();
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
            setCatalogMessage('mode.adaptive', 'modeDescription.adaptive');
        } else if (mode === 'challenges') {
            setCatalogMessage(currentProblem.titleKey, 'message.curated', {
                round: round, count: CURATED.length
            });
        } else {
            setCatalogMessage('round.kindTitle', currentProblem.roundKind === 'challenge' ?
                'message.challengeBody' : 'message.standardBody', {
                    kind: function () {
                        return t('round.' + currentProblem.roundKind);
                    }
                });
        }
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
            if (!Number.isFinite(stats[id][key])) stats[id][key] = 0;
        }
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
            modeId: mode,
            round: round,
            seed: currentSeed,
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
        if (mode === 'challenges' && round === CURATED.length) unlock('curated');
    }

    function correctAnswer() {
        adapt('correct');
        recordAttempt(true);
        updateAchievements();
        playSound('correct');
        showExplanation(true);
        awaitingAdvance = true;
        renderSubmitLabel();
        ui.hint.disabled = true;
        ui.skip.disabled = true;

        if (mode === 'daily') {
            dailyResults[utcDate()] = {
                attempts: session.attempts, hints: session.hints, success: true, at: Date.now()
            };
            save(KEYS.daily, dailyResults);
            ui.submit.disabled = true;
            setCatalogMessage('daily.complete', 'daily.completeBody', {
                attempts: session.attempts, hints: session.hints
            });
            return;
        }
        if (mode === 'custom') {
            const accuracy = customRun.correct / customRun.attempts * 100;
            if (customRun.correct >= activeCustomSettings.correct && accuracy >= activeCustomSettings.rate) {
                customRun.won = true;
                ui.submit.disabled = true;
                setCatalogMessage('custom.won', 'custom.wonBody', {
                    correct: customRun.correct,
                    attempts: customRun.attempts,
                    accuracy: Math.round(accuracy)
                });
                return;
            }
        }
        if (mode === 'challenges' && round === CURATED.length) {
            setCatalogMessage('challenges.complete', 'challenges.completeBody', {
                count: CURATED.length
            });
        } else {
            setCatalogMessage('result.balanced', 'result.balancedBody');
        }
    }

    function incorrectAnswer() {
        const attemptedValues = currentValues;
        adapt('wrong');
        recordAttempt(false);
        playSound('incorrect');
        showExplanation(false, attemptedValues);
        selectedId = null;
        currentValues = {};
        drawProblem();
        if (mode === 'endless' && attemptsOnPuzzle === 1) {
            session.lives--;
            renderSession();
            if (session.lives <= 0) {
                finishSession('endless.complete', 'endless.completeBody', {
                    count: session.solved
                });
                showExplanation(true, attemptedValues);
                return;
            }
        }
        setCatalogMessage('result.retry', 'result.retryBody');
    }

    function advanceRound() {
        if (session.finished) return;
        if (mode === 'challenges' && round === CURATED.length) {
            round = 1;
            newSession();
        } else {
            round++;
        }
        startRound();
    }

    function finishSession(titleKey, messageKey, values) {
        session.finished = true;
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
    }

    function updateProgress() {
        ui.custom_progress.hidden = !['custom', 'endless', 'adaptive'].includes(mode);
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
                chances: '●'.repeat(session.lives) + '○'.repeat(3 - session.lives)
            });
        } else if (mode === 'adaptive') {
            ui.custom_progress.textContent = t('progress.adaptive', {
                level: t('mode.' + core.adaptiveProfile(adaptiveState).id),
                skill: Math.round(adaptiveState.rating * 100)
            });
        }
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
        ui.session_summary.replaceChildren(
            sessionStat(t('session.solved'), String(session.solved)),
            sessionStat(t('session.accuracy'), accuracy + '%'),
            sessionStat(t('session.average'),
                average === null ? '—' : t('timer.seconds', { seconds: average })),
            sessionStat(t('session.hardest'), String(Math.round(session.hardest)))
        );
        updateProgress();
    }

    function historyModeLabel(value) {
        const modeId = i18n.getMessageId('mode', value);
        return modeId ? t('mode.' + modeId) : String(value || '');
    }

    function renderHistory() {
        const pages = Math.max(1, Math.ceil(history.length / PAGE_SIZE));
        historyPage = Math.max(0, Math.min(historyPage, pages - 1));
        ui.history.replaceChildren();
        for (const item of history.slice(historyPage * PAGE_SIZE, (historyPage + 1) * PAGE_SIZE)) {
            const li = document.createElement('li');
            li.className = item.correct ? 'correct' : 'incorrect';
            const summary = text('div', (item.correct ? t('history.correct') : t('history.incorrect')) +
                ' · ' + historyModeLabel(item.modeId || item.mode) + ' · ' +
                t('history.round', { round: item.round }), 'history-summary');
            summary.appendChild(text('time',
                ' ' + new Date(item.at).toLocaleString(i18n.getLanguageTag()), 'history-date'));
            li.append(summary, text('code', item.expression));
            ui.history.appendChild(li);
        }
        if (!history.length) ui.history.appendChild(text('li', t('history.empty'), 'empty'));
        ui.history_page.textContent = t('history.page', {
            page: historyPage + 1, pages: pages, count: history.length, limit: HISTORY_LIMIT
        });
        ui.history_prev.disabled = historyPage === 0;
        ui.history_next.disabled = historyPage + 1 >= pages;
        ui.history_clear.disabled = history.length === 0;
    }

    function renderStats() {
        ui.stats_rows.replaceChildren();
        const modes = Object.values(core.DIFFICULTIES).map(function (item) {
            return { id: item.id, name: t('mode.' + item.id) };
        }).concat([
            { id: 'adaptive', name: t('mode.adaptive') },
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
                text('span', t('modeDescription.adaptive')),
                text('span', t('progress.adaptive', {
                    level: t('mode.' + item.id),
                    skill: Math.round(adaptiveState.rating * 100)
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

    function setSidebarCollapsed(collapsed) {
        const wrapper = document.getElementById('wrapper');
        wrapper.classList.toggle('sidebar-collapsed', collapsed);
        for (const button of [ui.sidebar_toggle, ui.sidebar_toggle_play]) {
            button.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        }
        ui.sidebar_toggle.textContent = t(collapsed ? 'menu.expand' : 'menu.collapse');
        ui.sidebar_toggle.title = t(collapsed ? 'menu.expandTitle' : 'menu.collapseTitle');
    }

    function showView(view, focusHeading) {
        const screens = Array.from(document.querySelectorAll('[data-screen]'));
        const selected = screens.find(function (screen) { return screen.dataset.screen === view; }) || screens[0];
        for (const screen of screens) screen.hidden = screen !== selected;
        document.getElementById('app_footer').hidden = selected.dataset.screen === 'play';
        for (const button of ui.view_buttons.querySelectorAll('[data-view]')) {
            const active = button.dataset.view === selected.dataset.screen;
            button.classList.toggle('active', active);
            if (active) button.setAttribute('aria-current', 'page');
            else button.removeAttribute('aria-current');
        }
        if (selected.dataset.screen !== 'play') setSidebarCollapsed(false);
        if (focusHeading) {
            const heading = selected.querySelector('h2');
            if (heading) {
                heading.tabIndex = -1;
                heading.focus();
            }
        }
    }

    function clearTimer() {
        if (timerId) window.clearInterval(timerId);
        timerId = null;
        ui.timer_label.hidden = true;
    }

    function startTimer() {
        clearTimer();
        timeRemaining = TIMED_SECONDS;
        ui.timer_label.hidden = false;
        ui.timer_label.textContent = t('timer.seconds', { seconds: timeRemaining });
        timerId = window.setInterval(function () {
            timeRemaining--;
            ui.timer_label.textContent = t('timer.seconds', { seconds: timeRemaining });
            if (timeRemaining <= 0) {
                finishSession('timed.complete', 'timed.result', { count: session.solved });
                playSound('finish');
            }
        }, 1000);
    }

    function activateMode(nextMode, button, options) {
        options = options || {};
        clearTimer();
        mode = nextMode;
        if (core.DIFFICULTIES[mode]) profile = core.DIFFICULTIES[mode];
        round = options.round || 1;
        forcedSeed = options.seed || null;
        forcedRound = options.round || null;
        dailyDateOverride = options.date || null;
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
        setSidebarCollapsed(mode !== 'custom');
        newSession();
        updateModeInfo();
        if (mode === 'custom') {
            currentProblem = null;
            ui.submit.disabled = true;
            ui.problem.replaceChildren();
            hideFeedback();
            setCatalogMessage('custom.builder', 'custom.builderBody');
        } else {
            startRound();
            if (mode === 'timed') startTimer();
        }
    }

    function dailyShareText() {
        const result = dailyResults[utcDate()];
        if (!result) return t('share.dailyDefault', { date: utcDate() });
        return t(result.success === false ? 'share.dailyRevealed' : 'share.dailySolved', {
            date: utcDate(), attempts: result.attempts, hints: result.hints
        });
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
                setCatalogMessage('share.copied', 'share.ready');
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
        const requestedSide = ['auto', 'left', 'right'].includes(settings.sidebarSide) ? settings.sidebarSide : 'auto';
        const sidebarSide = requestedSide === 'auto'
            ? (i18n.getDirection() === 'rtl' ? 'right' : 'left') : requestedSide;
        document.body.classList.toggle('sidebar-left', sidebarSide === 'left');
        document.body.classList.toggle('sidebar-right', sidebarSide === 'right');
        ui.setting_sound.checked = !!settings.sound;
        ui.setting_large_text.checked = !!settings.largeText;
        ui.setting_contrast.checked = !!settings.contrast;
        ui.setting_reduced_clutter.checked = !!settings.reducedClutter;
        ui.setting_language.value = i18n.getLocale();
        ui.quick_language.value = i18n.getLocale();
        ui.setting_sidebar_side.value = requestedSide;
    }

    function refreshLocalizedUi() {
        i18n.apply();
        applySettings();
        updateModeInfo();
        renderHistory();
        renderStats();
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

    ui.problem.addEventListener('click', function (event) {
        const button = event.target.closest('[data-number-id]');
        if (!button || awaitingAdvance || session.finished || !currentProblem) return;
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
    });

    ui.submit.addEventListener('click', function () {
        if (awaitingAdvance) {
            advanceRound();
            return;
        }
        if (!currentProblem || session.finished) return;
        if (isSolved()) {
            if (mode === 'tutorial') {
                const easyButton = ui.mode_buttons.querySelector('[data-mode="easy"]');
                activateMode('easy', easyButton);
                setCatalogMessage('tutorial.complete', 'tutorial.completeBody');
            } else {
                correctAnswer();
            }
        } else if (mode === 'tutorial') {
            selectedId = null;
            currentValues = {};
            drawProblem();
            setCatalogMessage('tutorial.retry', 'tutorial.retryBody');
            playSound('incorrect');
        } else {
            incorrectAnswer();
        }
    });

    ui.hint.addEventListener('click', function () {
        if (!currentProblem || awaitingAdvance || session.finished || hintLevel >= 2) return;
        hintLevel = Math.min(2, hintLevel + 1);
        session.hints++;
        adapt('hint');
        ui.hint.disabled = hintLevel >= 2;
        drawProblem();
        setCatalogMessage(hintLevel === 1 ? 'hint.side' : 'hint.number',
            hintLevel === 1 ? 'hint.sideBody' : 'hint.numberBody');
    });

    ui.skip.addEventListener('click', function () {
        if (!currentProblem || awaitingAdvance || session.finished) return;
        adapt('skip');
        recordAttempt(false);
        showExplanation(true);
        awaitingAdvance = true;
        renderSubmitLabel();
        ui.hint.disabled = true;
        ui.skip.disabled = true;
        if (mode === 'daily') {
            dailyResults[utcDate()] = {
                attempts: session.attempts, hints: session.hints, success: false, at: Date.now()
            };
            save(KEYS.daily, dailyResults);
            ui.submit.disabled = true;
            setCatalogMessage('daily.revealed', 'daily.revealedBody');
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
        }
        if (!chosen.operations.length) {
            setCatalogMessage('custom.chooseOperation', 'custom.chooseOperationBody');
            const firstOperation = ui.custom_operations.querySelector('input');
            if (firstOperation) firstOperation.focus();
            return;
        }
        if (!chosen.operations.some(function (operation) {
            return ['add', 'subtract', 'multiply', 'divide', 'power'].includes(operation);
        })) {
            setCatalogMessage('custom.chooseIdentity', 'custom.chooseIdentityBody');
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
    ui.history_prev.addEventListener('click', function () { historyPage--; renderHistory(); });
    ui.history_next.addEventListener('click', function () { historyPage++; renderHistory(); });
    ui.history_clear.addEventListener('click', function () {
        if (window.confirm(t('confirm.clearHistory'))) {
            history = [];
            historyPage = 0;
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

    for (const input of [ui.setting_sound, ui.setting_large_text, ui.setting_contrast, ui.setting_reduced_clutter]) {
        input.addEventListener('change', function () {
            settings = {
                sound: ui.setting_sound.checked,
                largeText: ui.setting_large_text.checked,
                contrast: ui.setting_contrast.checked,
                reducedClutter: ui.setting_reduced_clutter.checked,
                sidebarSide: ui.setting_sidebar_side.value
            };
            save(KEYS.settings, settings);
            applySettings();
            if (input === ui.setting_sound && input.checked) playSound('flip');
        });
    }
    ui.setting_language.addEventListener('change', function () {
        i18n.setLocale(ui.setting_language.value);
    });
    ui.quick_language.addEventListener('change', function () {
        i18n.setLocale(ui.quick_language.value);
    });
    ui.setting_sidebar_side.addEventListener('change', function () {
        settings.sidebarSide = ui.setting_sidebar_side.value;
        save(KEYS.settings, settings);
        applySettings();
    });

    document.addEventListener('keydown', function (event) {
        if (event.target.matches('input, select, textarea')) return;
        const numbers = Array.from(ui.problem.querySelectorAll('.number'));
        if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && numbers.length) {
            event.preventDefault();
            let index = numbers.indexOf(document.activeElement);
            index += event.key === 'ArrowRight' ? 1 : -1;
            if (index < 0) index = numbers.length - 1;
            if (index >= numbers.length) index = 0;
            numbers[index].focus();
        } else if (event.key.toLowerCase() === 'h' && !ui.hint.disabled) {
            event.preventDefault();
            ui.hint.click();
        } else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
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
            installPrompt.prompt();
            installPrompt = null;
            ui.install_app.hidden = true;
        }
    });

    function bootFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const requestedDaily = params.get('daily');
        function sharedDailyDate(value) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
            const parsed = new Date(value + 'T00:00:00Z');
            return Number.isFinite(parsed.getTime()) &&
                parsed.toISOString().slice(0, 10) === value ? value : null;
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
            activateMode('daily', button, { date: daily });
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
            const difficulty = core.DIFFICULTIES[requested] ? requested : 'normal';
            const button = ui.mode_buttons.querySelector('[data-mode="' + difficulty + '"]');
            activateMode(difficulty, button, {
                seed: safeSeed,
                round: sharedRound(params.get('round'))
            });
            setCatalogMessage('shared.seeded', 'shared.seededBody');
            return;
        }
        const button = ui.mode_buttons.querySelector('[data-mode="tutorial"]');
        activateMode('tutorial', button);
    }

    populateLanguageSelectors();
    populateCustomForm();
    i18n.apply();
    applySettings();
    renderHistory();
    renderStats();
    renderAchievements();
    ui.achievement_notice.hidden = true;
    if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
        navigator.serviceWorker.register('sw.js').catch(function () {});
    }
    bootFromUrl();
}());
