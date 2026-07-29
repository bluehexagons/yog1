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
        daily: 'yog1.dailyResults.v1'
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
        element.textContent = i18n.translate(value);
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
            title: 'The original',
            sides: [binary('subtract', number(7, 'c00'), number(2, 'c01')),
                binary('add', number(3, 'c02', true), number(4, 'c03'))]
        },
        {
            title: 'Product placement',
            sides: [binary('multiply', number(6, 'c10'), number(2, 'c11')),
                binary('subtract', number(13, 'c12'), number(8, 'c13', true))]
        },
        {
            title: 'Root and remainder',
            sides: [binary('modulo', number(25, 'c20'), number(7, 'c21')),
                binary('add', squareRoot(number(9, 'c22')), number(6, 'c23', true))]
        },
        {
            title: 'A small power',
            sides: [binary('power', number(2, 'c30'), number(3, 'c31')),
                binary('subtract', number(9, 'c32'), number(7, 'c33', true))]
        },
        {
            title: 'Evenly divided',
            sides: [binary('divide', number(42, 'c40'), number(6, 'c41')),
                binary('subtract', number(8, 'c42'), number(5, 'c43', true))]
        }
    ];

    const ACHIEVEMENTS = [
        { id: 'first', name: 'The First 1', description: 'Solve your first puzzle.' },
        { id: 'streak5', name: 'Ones in a Row', description: 'Reach a five-puzzle streak.' },
        { id: 'twenty', name: 'Mental Arithmetic', description: 'Solve 20 puzzles.' },
        { id: 'explorer', name: 'Operator', description: 'Solve puzzles using every operation.' },
        { id: 'daily', name: 'Today’s One', description: 'Complete a Daily challenge.' },
        { id: 'nohint', name: 'Unaided', description: 'Solve a Challenge round without a hint.' },
        { id: 'curated', name: 'Gallery Walk', description: 'Finish all curated challenges.' }
    ];

    let history = load(KEYS.history, []);
    let stats = load(KEYS.stats, {});
    let achievementState = load(KEYS.achievements, { unlocked: [], operations: [], solved: 0 });
    const defaultSettings = {
        sound: false, largeText: false, contrast: false, reducedClutter: false, sidebarSide: 'auto'
    };
    let settings = load(KEYS.settings, defaultSettings);
    let dailyResults = load(KEYS.daily, {});
    if (!Array.isArray(history)) history = [];
    if (!stats || typeof stats !== 'object' || Array.isArray(stats)) stats = {};
    if (!achievementState || !Array.isArray(achievementState.unlocked)) {
        achievementState = { unlocked: [], operations: [], solved: 0 };
    }
    if (!Array.isArray(achievementState.operations)) achievementState.operations = [];
    if (!Number.isFinite(achievementState.solved)) achievementState.solved = 0;
    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
        settings = defaultSettings;
    }
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
            roundKind: 'Guided', operationCount: 2, title: 'Tutorial'
        };
    }

    function curatedProblem(index) {
        const item = CURATED[index % CURATED.length];
        return {
            sides: core.clone(item.sides),
            score: core.difficultyScore(item.sides),
            target: 10 + index * 8,
            roundKind: index + 1 === CURATED.length ? 'Challenge' : 'Curated',
            operationCount: core.countOperations(item.sides[0]) + core.countOperations(item.sides[1]),
            title: item.title
        };
    }

    function utcDate() {
        return dailyDateOverride || new Date().toISOString().slice(0, 10);
    }

    function modeProfile() {
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
        const selectedProfile = modeProfile();
        const options = {
            profile: selectedProfile,
            round: mode === 'daily' ? (core.hashSeed(utcDate()) % 40) + 1 : round,
            random: core.createSeededRandom(currentSeed)
        };
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
                ? 'Restore ' + expression.value : 'Change ' + expression.value + ' to 1');
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
        ui.flip_count.textContent = selectedId ? '0' : '1';
        ui.flip_text.textContent = t(selectedId ? 'flip.many' : 'flip.one');
        ui.round_label.textContent = mode === 'tutorial' ? t('round.tutorial') :
            (mode === 'daily' ? utcDate() : i18n.translate('Round ') + round);
        ui.round_kind.textContent = i18n.translate(currentProblem.roundKind);
        ui.round_kind.className = 'round-kind ' + currentProblem.roundKind.toLowerCase().replace('-', '');
        ui.score_label.textContent = t('round.score', { target: currentProblem.target, score: currentProblem.score });
    }

    function setMessage(title, message) {
        ui.message_title.textContent = i18n.translate(title);
        ui.message_text.textContent = i18n.translate(message);
    }

    function hideFeedback() {
        ui.feedback.hidden = true;
        ui.feedback.replaceChildren();
    }

    function showExplanation(revealSolution, attemptedValues) {
        const details = core.solutionDetails(
            currentProblem.sides,
            attemptedValues === undefined ? currentValues : attemptedValues
        );
        const current = text('p', 'Your totals: ' + details.currentTotals.join(' and ') + '.');
        ui.feedback.replaceChildren(current);
        if (revealSolution) {
            const solution = text('p', 'Intended flip: change ' + details.solutionValue +
                ' to 1. Then both sides equal ' + details.solvedTotals[0] + '.');
            const equation = text('code', details.solvedExpression);
            ui.feedback.append(solution, equation);
        }
        ui.feedback.hidden = false;
    }

    function startRound() {
        selectedId = null;
        currentValues = {};
        hintLevel = 0;
        attemptsOnPuzzle = 0;
        awaitingAdvance = false;
        currentSeed = problemSeed();
        currentProblem = generateCurrentProblem();
        session.puzzleStartedAt = Date.now();
        ui.submit.textContent = t('action.check');
        ui.submit.disabled = session.finished;
        ui.hint.disabled = mode === 'tutorial' || session.finished;
        ui.skip.disabled = mode === 'tutorial' || session.finished;
        ui.share.disabled = mode === 'tutorial';
        hideFeedback();
        drawProblem();
        updateProgress();
        if (mode === 'tutorial') {
            setMessage('How to play', 'Change exactly one number into a 1 so both sides have the same integer value.');
        } else if (mode === 'daily') {
            setMessage('Daily challenge', 'Everyone gets this same seeded puzzle today. Solve it and share your result.');
        } else if (mode === 'timed') {
            setMessage('Timed sprint', 'Solve as many puzzles as you can before the 60-second clock reaches zero.');
        } else if (mode === 'endless') {
            setMessage('Endless run', 'Settle into a rising difficulty curve. If your first try does not fit, one of three chances is used.');
        } else if (mode === 'challenges') {
            setMessage(currentProblem.title, 'A handcrafted puzzle ' + round + ' of ' + CURATED.length + '.');
        } else {
            setMessage(currentProblem.roundKind + ' round',
                currentProblem.roundKind === 'Challenge' ? 'A difficulty spike—take your time.' :
                    'Change one number, then check the equation.');
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

    function statId() {
        return core.DIFFICULTIES[mode] ? mode : mode;
    }

    function recordStat(correct) {
        if (mode === 'tutorial') return;
        const stat = getStat(statId());
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
            mode: modeLabel(),
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
        const item = ACHIEVEMENTS.find(function (achievement) { return achievement.id === id; });
        ui.achievement_notice.textContent = 'Achievement unlocked: ' + item.name;
        ui.achievement_notice.hidden = false;
        playSound('achievement');
        renderAchievements();
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
        if (currentProblem.roundKind === 'Challenge' && hintLevel === 0) unlock('nohint');
        if (mode === 'challenges' && round === CURATED.length) unlock('curated');
    }

    function correctAnswer() {
        recordAttempt(true);
        updateAchievements();
        playSound('correct');
        showExplanation(true);
        awaitingAdvance = true;
        ui.submit.textContent = t('action.next');
        ui.hint.disabled = true;
        ui.skip.disabled = true;

        if (mode === 'daily') {
            dailyResults[utcDate()] = {
                attempts: session.attempts, hints: session.hints, success: true, at: Date.now()
            };
            save(KEYS.daily, dailyResults);
            ui.submit.disabled = true;
            setMessage('Daily complete', dailyShareText());
            return;
        }
        if (mode === 'custom') {
            const accuracy = customRun.correct / customRun.attempts * 100;
            if (customRun.correct >= activeCustomSettings.correct && accuracy >= activeCustomSettings.rate) {
                customRun.won = true;
                ui.submit.disabled = true;
                setMessage('Custom game won!',
                    customRun.correct + '/' + customRun.attempts + ' correct (' + Math.round(accuracy) + '%).');
                return;
            }
        }
        if (mode === 'challenges' && round === CURATED.length) {
            ui.submit.textContent = t('action.again');
            setMessage('Challenge set complete', 'You solved all ' + CURATED.length + ' handcrafted puzzles.');
        } else {
            setMessage('Correct', 'Both sides balance. Review the solution, then continue.');
        }
    }

    function incorrectAnswer() {
        const attemptedValues = currentValues;
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
                finishSession('Run complete', 'You solved ' + session.solved + ' puzzles before all three chances were used.');
                showExplanation(true, attemptedValues);
                return;
            }
        }
        setMessage('Not balanced—retry', 'The totals differed. The same puzzle is still here, and your move has been restored.');
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

    function finishSession(title, message) {
        session.finished = true;
        clearTimer();
        ui.submit.disabled = true;
        ui.hint.disabled = true;
        ui.skip.disabled = true;
        const stat = getStat(statId());
        stat.bestScore = Math.max(stat.bestScore || 0, session.solved);
        save(KEYS.stats, stats);
        renderStats();
        renderSession();
        setMessage(title, message);
    }

    function updateProgress() {
        ui.custom_progress.hidden = !['custom', 'endless'].includes(mode);
        if (mode === 'custom') {
            if (!activeCustomSettings) {
                ui.custom_progress.hidden = true;
                return;
            }
            const accuracy = customRun.attempts
                ? Math.round(customRun.correct / customRun.attempts * 100) : 0;
            ui.custom_progress.textContent = customRun.correct + '/' + activeCustomSettings.correct +
                ' correct · ' + accuracy + '%/' + activeCustomSettings.rate + '%';
        } else if (mode === 'endless') {
            ui.custom_progress.textContent = 'Chances: ' + '●'.repeat(session.lives) + '○'.repeat(3 - session.lives);
        }
    }

    function renderSession() {
        if (!session) return;
        const accuracy = session.attempts ? Math.round(session.correct / session.attempts * 100) : 0;
        const average = session.durations.length
            ? (session.durations.reduce(function (sum, value) { return sum + value; }, 0) /
                session.durations.length / 1000).toFixed(1) + 's' : '—';
        ui.session_summary.replaceChildren(
            text('div', String(session.solved), 'summary-value'),
            text('div', t('session.solved'), 'summary-label'),
            text('div', accuracy + '%', 'summary-value'),
            text('div', t('session.accuracy'), 'summary-label'),
            text('div', average, 'summary-value'),
            text('div', t('session.average'), 'summary-label'),
            text('div', String(Math.round(session.hardest)), 'summary-value'),
            text('div', t('session.hardest'), 'summary-label')
        );
        updateProgress();
    }

    function renderHistory() {
        const pages = Math.max(1, Math.ceil(history.length / PAGE_SIZE));
        historyPage = Math.max(0, Math.min(historyPage, pages - 1));
        ui.history.replaceChildren();
        for (const item of history.slice(historyPage * PAGE_SIZE, (historyPage + 1) * PAGE_SIZE)) {
            const li = document.createElement('li');
            li.className = item.correct ? 'correct' : 'incorrect';
            const summary = text('div', (item.correct ? t('history.correct') : t('history.incorrect')) +
                ' · ' + item.mode + ' · ' + t('history.round', { round: item.round }), 'history-summary');
            summary.appendChild(text('time', ' ' + new Date(item.at).toLocaleString(i18n.getLocale()), 'history-date'));
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
            li.append(text('strong', (unlocked ? '✓ ' : '○ ') + item.name),
                text('span', item.description));
            ui.achievement_list.appendChild(li);
        }
    }

    function updateModeInfo() {
        const descriptions = {
            tutorial: ['Tutorial', 'A guided introduction to the one-flip rule.'],
            daily: ['Daily', 'One shared seeded puzzle each UTC day.'],
            timed: ['Timed', 'Score as many correct answers as possible in 60 seconds.'],
            endless: ['Endless', 'Three lives while difficulty rises every eight rounds.'],
            challenges: ['Challenges', 'Five handcrafted puzzles featuring different operations.'],
            custom: ['Custom', 'Your operations, length, seed, targets, and victory goal.']
        };
        if (core.DIFFICULTIES[mode]) {
            const item = core.DIFFICULTIES[mode];
            ui.mode_info.replaceChildren(
                text('strong', item.name), text('span', item.description),
                text('span', t('mode.operations', { operations: item.operations.map(function (key) {
                    return core.OPERATIONS[key].symbol;
                }).join(' ') })),
                text('span', t('mode.baseLength', { min: item.length[0], max: item.length[1] }))
            );
        } else {
            const item = descriptions[mode];
            ui.mode_info.replaceChildren(text('strong', item[0]), text('span', item[1]));
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
                finishSession('Time!', 'You solved ' + session.solved + ' puzzles in ' + TIMED_SECONDS + ' seconds.');
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
            ui.submit.disabled = true;
            ui.problem.replaceChildren();
            hideFeedback();
            setMessage('Build a custom game', 'Choose the rules, then start the run. A seed makes it reproducible.');
        } else {
            startRound();
            if (mode === 'timed') startTimer();
        }
    }

    function dailyShareText() {
        const result = dailyResults[utcDate()];
        return result
            ? 'YOG1 ' + utcDate() + ' · ' +
                (result.success === false ? 'solution revealed after ' : 'solved in ') + result.attempts +
                (result.attempts === 1 ? ' attempt' : ' attempts') +
                (result.hints ? ' · ' + result.hints + ' hints' : ' · no hints')
            : 'YOG1 Daily ' + utcDate();
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
            shareText += ' · handcrafted challenge ' + round;
        } else {
            url.searchParams.set('seed', currentSeed);
            if (mode === 'custom') {
                url.searchParams.set('difficulty', 'custom');
                url.searchParams.set('ops', activeCustomSettings.operations.join(','));
                url.searchParams.set('length', String(activeCustomSettings.length));
                url.searchParams.set('min', String(activeCustomSettings.min));
                url.searchParams.set('max', String(activeCustomSettings.max));
            } else {
                url.searchParams.set('difficulty', modeProfile().id);
            }
            url.searchParams.set('round', String(round));
            shareText += ' · ' + modeLabel() + ' puzzle';
        }
        const value = shareText + '\n' + url.toString();
        if (navigator.share) {
            navigator.share({ title: 'You Only Get 1s', text: shareText, url: url.toString() }).catch(function () {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(value).then(function () {
                setMessage('Copied', 'The puzzle link and result are ready to paste.');
            }).catch(function () {
                window.prompt('Copy this puzzle link:', value);
            });
        } else {
            window.prompt('Copy this puzzle link:', value);
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
        document.body.classList.toggle('large-text', !!settings.largeText);
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
        if (currentProblem && mode !== 'custom') drawProblem();
        if (timerId) ui.timer_label.textContent = t('timer.seconds', { seconds: timeRemaining });
        if (awaitingAdvance) ui.submit.textContent = t('action.next');
        else if (session && session.finished && mode === 'challenges') ui.submit.textContent = t('action.again');
        setSidebarCollapsed(document.getElementById('wrapper').classList.contains('sidebar-collapsed'));
    }
    window.addEventListener('yog1localechange', refreshLocalizedUi);

    ui.problem.addEventListener('click', function (event) {
        const button = event.target.closest('[data-number-id]');
        if (!button || awaitingAdvance || session.finished || !currentProblem) return;
        const id = button.dataset.numberId;
        selectedId = selectedId === id ? null : id;
        currentValues = valuesWithFlip(selectedId);
        playSound('flip');
        drawProblem();
        const replacement = ui.problem.querySelector('[data-number-id="' + id + '"]');
        if (replacement) replacement.focus();
        if (mode === 'tutorial') {
            setMessage(isSolved() ? 'Good move' : 'Try the outlined number',
                isSolved() ? 'The equation balances. Check it to finish.' :
                    'Click the selected number again to restore it.');
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
                setMessage('Tutorial complete', 'Your first Easy round is ready.');
            } else {
                correctAnswer();
            }
        } else if (mode === 'tutorial') {
            selectedId = null;
            currentValues = {};
            drawProblem();
            setMessage('Not quite', 'Try changing the outlined 3, then check again.');
            playSound('incorrect');
        } else {
            incorrectAnswer();
        }
    });

    ui.hint.addEventListener('click', function () {
        if (!currentProblem || awaitingAdvance || session.finished || hintLevel >= 2) return;
        hintLevel = Math.min(2, hintLevel + 1);
        session.hints++;
        ui.hint.disabled = hintLevel >= 2;
        drawProblem();
        setMessage(hintLevel === 1 ? 'Hint: choose a side' : 'Hint: the number',
            hintLevel === 1 ? 'The outlined side contains the intended flip.' :
                'The outlined number is the one used by the generated solution.');
    });

    ui.skip.addEventListener('click', function () {
        if (!currentProblem || awaitingAdvance || session.finished) return;
        recordAttempt(false);
        showExplanation(true);
        awaitingAdvance = true;
        ui.submit.textContent = t('action.next');
        ui.hint.disabled = true;
        ui.skip.disabled = true;
        if (mode === 'daily') {
            dailyResults[utcDate()] = {
                attempts: session.attempts, hints: session.hints, success: false, at: Date.now()
            };
            save(KEYS.daily, dailyResults);
            ui.submit.disabled = true;
            setMessage('Daily solution revealed', 'The shared result records this as a reveal.');
            return;
        }
        if (mode === 'endless') {
            if (attemptsOnPuzzle === 1) {
                session.lives--;
                renderSession();
                if (session.lives <= 0) {
                    finishSession('Run complete', 'The revealed puzzle used your final chance.');
                    return;
                }
            }
        }
        setMessage('Solution revealed', 'This puzzle counts as incorrect. Review it, then continue.');
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
        if (!chosen.operations.length) {
            setMessage('Choose an operation', 'Custom games need at least one mathematical operation.');
            return;
        }
        if (!chosen.operations.some(function (operation) {
            return ['add', 'subtract', 'multiply', 'divide', 'power'].includes(operation);
        })) {
            setMessage('Choose an identity operation',
                'Include +, −, ×, ÷, or powers so the one-flip solution can use only your selected operations.');
            return;
        }
        if (chosen.min > chosen.max) {
            setMessage('Check the targets', 'The minimum target cannot exceed the maximum.');
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
        } else if (event.key === 'Enter' &&
            (document.activeElement === document.body || ui.problem.contains(document.activeElement))) {
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
        const daily = params.get('daily');
        const challenge = params.get('challenge');
        const seed = params.get('seed');
        if (daily) {
            const button = ui.mode_buttons.querySelector('[data-mode="daily"]');
            activateMode('daily', button, { date: daily });
            return;
        }
        if (challenge) {
            const button = ui.mode_buttons.querySelector('[data-mode="challenges"]');
            activateMode('challenges', button, {
                round: Math.max(1, Math.min(CURATED.length, Number(challenge) || 1))
            });
            setMessage('Shared handcrafted puzzle', currentProblem.title);
            return;
        }
        if (seed) {
            const safeSeed = seed.slice(0, 160);
            const requested = params.get('difficulty');
            if (requested === 'custom') {
                const button = ui.mode_buttons.querySelector('[data-mode="custom"]');
                activateMode('custom', button, {
                    seed: safeSeed,
                    round: Math.max(1, Number(params.get('round')) || 1)
                });
                const requestedOperations = (params.get('ops') || '').split(',').filter(function (key) {
                    return Object.prototype.hasOwnProperty.call(core.OPERATIONS, key);
                });
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
                setMessage('Shared custom puzzle', 'This custom puzzle is reproduced from a shared link.');
                return;
            }
            const difficulty = core.DIFFICULTIES[requested] ? requested : 'normal';
            const button = ui.mode_buttons.querySelector('[data-mode="' + difficulty + '"]');
            activateMode(difficulty, button, {
                seed: safeSeed,
                round: Math.max(1, Number(params.get('round')) || 1)
            });
            setMessage('Shared seeded puzzle', 'This puzzle is reproduced from a shared link.');
            return;
        }
        const button = ui.mode_buttons.querySelector('[data-mode="tutorial"]');
        activateMode('tutorial', button);
    }

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
