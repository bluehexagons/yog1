(function () {
    'use strict';

    const core = window.Yog1Core;
    const HISTORY_KEY = 'yog1.problemHistory.v2';
    const STATS_KEY = 'yog1.difficultyStats.v2';
    const CUSTOM_KEY = 'yog1.customSettings.v2';
    const HISTORY_LIMIT = 100;
    const PAGE_SIZE = 10;

    const ui = {};
    for (const id of [
        'mode_buttons', 'mode_info', 'round_label', 'round_kind', 'score_label',
        'problem', 'flip_count', 'flip_text', 'submit', 'message_title', 'message_text',
        'custom_panel', 'custom_form', 'custom_operations', 'custom_length',
        'custom_length_value', 'custom_min', 'custom_max', 'custom_correct',
        'custom_rate', 'custom_progress', 'history', 'history_page', 'history_prev',
        'history_next', 'history_clear', 'stats_rows', 'stats_reset_all'
    ]) {
        ui[id] = document.getElementById(id);
    }

    let mode = 'tutorial';
    let profile = core.DIFFICULTIES.easy;
    let round = 1;
    let currentProblem = null;
    let selectedId = null;
    let currentValues = {};
    let historyPage = 0;
    let customRun = { attempts: 0, correct: 0, won: false };
    let activeCustomSettings = null;

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
            // Storage can be unavailable in private browsing; the current session still works.
        }
    }

    let history = load(HISTORY_KEY, []);
    let stats = load(STATS_KEY, {});

    function text(type, value, className) {
        const element = document.createElement(type);
        element.textContent = value;
        if (className) {
            element.className = className;
        }
        return element;
    }

    function tutorialProblem() {
        return {
            sides: [
                { type: 'binary', operation: 'subtract',
                    left: { type: 'number', value: 7, id: 't0' },
                    right: { type: 'number', value: 2, id: 't1' } },
                { type: 'binary', operation: 'add',
                    left: { type: 'number', value: 3, id: 't2', solution: true },
                    right: { type: 'number', value: 4, id: 't3' } }
            ],
            score: 4,
            target: 4,
            roundKind: 'Guided',
            operationCount: 2
        };
    }

    function customSettings() {
        const operations = Array.from(ui.custom_operations.querySelectorAll('input:checked'))
            .map(function (input) { return input.value; });
        return {
            operations: operations,
            length: Number(ui.custom_length.value),
            min: Number(ui.custom_min.value),
            max: Number(ui.custom_max.value),
            correct: Number(ui.custom_correct.value),
            rate: Number(ui.custom_rate.value)
        };
    }

    function populateCustomForm() {
        for (const key of Object.keys(core.OPERATIONS)) {
            const label = text('label', '', 'check-option');
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.value = key;
            input.checked = ['add', 'subtract', 'multiply'].includes(key);
            label.appendChild(input);
            label.appendChild(document.createTextNode(' ' + core.OPERATIONS[key].label));
            ui.custom_operations.appendChild(label);
        }
        const saved = load(CUSTOM_KEY, null);
        if (saved && Array.isArray(saved.operations)) {
            for (const input of ui.custom_operations.querySelectorAll('input')) {
                input.checked = saved.operations.includes(input.value);
            }
            for (const key of ['length', 'min', 'max', 'correct', 'rate']) {
                if (Number.isFinite(saved[key])) {
                    ui['custom_' + key].value = saved[key];
                }
            }
        }
        ui.custom_length_value.textContent = ui.custom_length.value;
    }

    function renderExpression(expression, parent) {
        if (expression.type === 'number') {
            const button = text('button', currentValues[expression.id] === undefined
                ? expression.value : currentValues[expression.id], 'number');
            button.type = 'button';
            button.dataset.numberId = expression.id;
            button.setAttribute('aria-pressed', selectedId === expression.id ? 'true' : 'false');
            button.setAttribute('aria-label', selectedId === expression.id
                ? 'Restore ' + expression.value : 'Change ' + expression.value + ' to 1');
            if (selectedId === expression.id) {
                button.classList.add('flipped');
            }
            if (mode === 'tutorial' && expression.solution) {
                button.classList.add('tutorial-target');
            }
            parent.appendChild(button);
            return;
        }
        if (expression.type === 'root') {
            parent.appendChild(text('span', '√', 'operator root'));
            parent.appendChild(text('span', '(', 'paren'));
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

    function drawProblem() {
        ui.problem.replaceChildren();
        renderExpression(currentProblem.sides[0], ui.problem);
        ui.problem.appendChild(text('span', ' = ', 'equals'));
        renderExpression(currentProblem.sides[1], ui.problem);
        ui.flip_count.textContent = selectedId ? '0' : '1';
        ui.flip_text.textContent = selectedId ? 'flips remaining' : 'flip remaining';
        ui.round_label.textContent = mode === 'tutorial' ? 'Tutorial' : 'Round ' + round;
        ui.round_kind.textContent = currentProblem.roundKind;
        ui.round_kind.className = 'round-kind ' + currentProblem.roundKind.toLowerCase().replace('-', '');
        ui.score_label.textContent = 'Target ' + currentProblem.target + ' · generated score ' + currentProblem.score;
    }

    function valuesWithFlip(id) {
        const values = {};
        if (id) {
            values[id] = 1;
        }
        return values;
    }

    function isSolved() {
        return core.evaluate(currentProblem.sides[0], currentValues) ===
            core.evaluate(currentProblem.sides[1], currentValues);
    }

    function setMessage(title, message) {
        ui.message_title.textContent = title;
        ui.message_text.textContent = message;
    }

    function startRound() {
        selectedId = null;
        currentValues = {};
        if (mode === 'tutorial') {
            currentProblem = tutorialProblem();
            setMessage('How to play', 'Change exactly one number into a 1 so both sides have the same integer value.');
        } else if (mode === 'custom') {
            const settings = activeCustomSettings;
            currentProblem = core.generateProblem({
                profile: profile,
                round: round,
                operations: settings.operations,
                length: settings.length,
                targetRange: [settings.min, settings.max],
                maxNumber: Math.max(30, settings.max * 2)
            });
            setMessage('Custom game', 'Meet both goals: enough correct answers and the selected win rate.');
        } else {
            currentProblem = core.generateProblem({ profile: profile, round: round });
            setMessage(currentProblem.roundKind + ' round',
                currentProblem.roundKind === 'Challenge'
                    ? 'A difficulty spike—take your time.'
                    : (currentProblem.roundKind === 'Warm-up'
                        ? 'A lighter puzzle before the difficulty rises again.'
                        : 'Change one number, then check the equation.'));
        }
        drawProblem();
        updateCustomProgress();
    }

    function updateModeInfo() {
        if (mode === 'tutorial') {
            ui.mode_info.innerHTML = '<strong>Tutorial</strong><span>A guided two-operation puzzle.</span>';
            return;
        }
        if (mode === 'custom') {
            ui.mode_info.innerHTML = '<strong>Custom</strong><span>Your operations, length, target range, and victory goal.</span>';
            return;
        }
        const operationNames = profile.operations.map(function (key) {
            return core.OPERATIONS[key].symbol;
        }).join(' ');
        ui.mode_info.replaceChildren(
            text('strong', profile.name),
            text('span', profile.description),
            text('span', 'Operations: ' + operationNames),
            text('span', 'Base length: ' + profile.length[0] + '–' + profile.length[1])
        );
    }

    function activateMode(nextMode, button) {
        mode = nextMode;
        round = 1;
        if (mode === 'custom') {
            activeCustomSettings = null;
        }
        for (const candidate of ui.mode_buttons.querySelectorAll('button')) {
            const active = candidate === button;
            candidate.classList.toggle('active', active);
            candidate.setAttribute('aria-pressed', active ? 'true' : 'false');
        }
        ui.custom_panel.hidden = mode !== 'custom';
        ui.submit.disabled = mode === 'custom';
        if (core.DIFFICULTIES[mode]) {
            profile = core.DIFFICULTIES[mode];
        }
        updateModeInfo();
        if (mode !== 'custom') {
            startRound();
        } else {
            ui.custom_progress.hidden = true;
            setMessage('Build a custom game',
                'Choose at least one operation, tune the puzzle and victory targets, then start the run.');
        }
    }

    function historyRecord(correct) {
        return {
            correct: correct,
            expression: currentProblem.sides.map(function (side) {
                return core.serialize(side, currentValues);
            }).join(' = '),
            mode: mode === 'custom' ? 'Custom' : profile.name,
            round: round,
            at: new Date().toISOString()
        };
    }

    function renderHistory() {
        const pages = Math.max(1, Math.ceil(history.length / PAGE_SIZE));
        historyPage = Math.min(historyPage, pages - 1);
        const start = historyPage * PAGE_SIZE;
        ui.history.replaceChildren();
        for (const item of history.slice(start, start + PAGE_SIZE)) {
            const li = document.createElement('li');
            li.className = item.correct ? 'correct' : 'incorrect';
            const summary = text('div', (item.correct ? 'Correct' : 'Incorrect') +
                ' · ' + item.mode + ' · round ' + item.round, 'history-summary');
            const date = new Date(item.at);
            summary.appendChild(text('time', ' ' + date.toLocaleString(), 'history-date'));
            li.appendChild(summary);
            li.appendChild(text('code', item.expression));
            ui.history.appendChild(li);
        }
        if (!history.length) {
            ui.history.appendChild(text('li', 'No saved problems yet.', 'empty'));
        }
        ui.history_page.textContent = 'Page ' + (historyPage + 1) + ' of ' + pages +
            ' · ' + history.length + '/' + HISTORY_LIMIT + ' saved';
        ui.history_prev.disabled = historyPage === 0;
        ui.history_next.disabled = historyPage + 1 >= pages;
        ui.history_clear.disabled = history.length === 0;
    }

    function getStat(id) {
        if (!stats[id]) {
            stats[id] = { attempts: 0, correct: 0, bestStreak: 0, streak: 0 };
        }
        return stats[id];
    }

    function renderStats() {
        ui.stats_rows.replaceChildren();
        const modes = Object.values(core.DIFFICULTIES).concat([{ id: 'custom', name: 'Custom' }]);
        for (const item of modes) {
            const stat = getStat(item.id);
            const row = document.createElement('tr');
            row.appendChild(text('th', item.name));
            row.appendChild(text('td', stat.correct + '/' + stat.attempts));
            row.appendChild(text('td', stat.attempts ? Math.round(stat.correct / stat.attempts * 100) + '%' : '—'));
            row.appendChild(text('td', String(stat.bestStreak)));
            const action = document.createElement('td');
            const reset = text('button', 'Reset', 'small-button');
            reset.type = 'button';
            reset.dataset.resetStat = item.id;
            reset.disabled = stat.attempts === 0;
            action.appendChild(reset);
            row.appendChild(action);
            ui.stats_rows.appendChild(row);
        }
    }

    function recordStat(correct) {
        const id = mode === 'custom' ? 'custom' : profile.id;
        const stat = getStat(id);
        stat.attempts++;
        if (correct) {
            stat.correct++;
            stat.streak++;
            stat.bestStreak = Math.max(stat.bestStreak, stat.streak);
        } else {
            stat.streak = 0;
        }
        save(STATS_KEY, stats);
        renderStats();
    }

    function updateCustomProgress() {
        if (mode !== 'custom') {
            ui.custom_progress.hidden = true;
            return;
        }
        ui.custom_progress.hidden = false;
        const settings = activeCustomSettings || customSettings();
        const accuracy = customRun.attempts
            ? Math.round(customRun.correct / customRun.attempts * 100) : 0;
        ui.custom_progress.textContent = customRun.correct + '/' + settings.correct +
            ' correct · ' + accuracy + '%/' + settings.rate + '% win rate';
    }

    ui.problem.addEventListener('click', function (event) {
        const button = event.target.closest('[data-number-id]');
        if (!button || (mode === 'custom' && customRun.won)) {
            return;
        }
        const id = button.dataset.numberId;
        selectedId = selectedId === id ? null : id;
        currentValues = valuesWithFlip(selectedId);
        drawProblem();
        if (mode === 'tutorial') {
            setMessage(isSolved() ? 'Good move' : 'Try the outlined number',
                isSolved() ? 'The equation balances. Check it to finish.' :
                    'You can click your selected number again to undo the flip.');
        }
    });

    ui.submit.addEventListener('click', function () {
        const correct = isSolved();
        if (mode !== 'tutorial') {
            history.unshift(historyRecord(correct));
            history = history.slice(0, HISTORY_LIMIT);
            save(HISTORY_KEY, history);
            historyPage = 0;
            renderHistory();
            recordStat(correct);
        }

        if (mode === 'tutorial') {
            if (correct) {
                const easyButton = ui.mode_buttons.querySelector('[data-mode="easy"]');
                activateMode('easy', easyButton);
                setMessage('Tutorial complete', 'That is the whole rule. Your first Easy round is ready.');
            } else {
                startRound();
                setMessage('Not quite', 'The tutorial reset. Try changing the outlined 3.');
            }
            return;
        }

        if (mode === 'custom') {
            customRun.attempts++;
            if (correct) {
                customRun.correct++;
            }
            const settings = activeCustomSettings;
            const accuracy = customRun.correct / customRun.attempts * 100;
            if (customRun.correct >= settings.correct && accuracy >= settings.rate) {
                customRun.won = true;
                ui.submit.disabled = true;
                updateCustomProgress();
                setMessage('Custom game won!',
                    'You finished with ' + customRun.correct + '/' + customRun.attempts +
                    ' correct (' + Math.round(accuracy) + '%). Start Custom again for a new run.');
                return;
            }
        }

        round++;
        startRound();
        setMessage(correct ? 'Correct' : 'Incorrect',
            correct ? 'Balanced. The next round is ready.' : 'A fresh puzzle is ready—keep going.');
    });

    ui.mode_buttons.addEventListener('click', function (event) {
        const button = event.target.closest('[data-mode]');
        if (button) {
            activateMode(button.dataset.mode, button);
        }
    });

    ui.custom_form.addEventListener('submit', function (event) {
        event.preventDefault();
        const settings = customSettings();
        if (!settings.operations.length) {
            setMessage('Choose an operation', 'Custom games need at least one mathematical operation.');
            return;
        }
        if (settings.min > settings.max) {
            setMessage('Check the targets', 'The minimum difficulty target cannot exceed the maximum.');
            return;
        }
        save(CUSTOM_KEY, settings);
        activeCustomSettings = settings;
        customRun = { attempts: 0, correct: 0, won: false };
        round = 1;
        ui.submit.disabled = false;
        startRound();
    });

    ui.custom_length.addEventListener('input', function () {
        ui.custom_length_value.textContent = ui.custom_length.value;
    });
    ui.history_prev.addEventListener('click', function () { historyPage--; renderHistory(); });
    ui.history_next.addEventListener('click', function () { historyPage++; renderHistory(); });
    ui.history_clear.addEventListener('click', function () {
        if (window.confirm('Clear all locally saved problem history?')) {
            history = [];
            historyPage = 0;
            save(HISTORY_KEY, history);
            renderHistory();
        }
    });
    ui.stats_rows.addEventListener('click', function (event) {
        const button = event.target.closest('[data-reset-stat]');
        if (button && window.confirm('Reset stats for ' + button.dataset.resetStat + '?')) {
            delete stats[button.dataset.resetStat];
            save(STATS_KEY, stats);
            renderStats();
        }
    });
    ui.stats_reset_all.addEventListener('click', function () {
        if (window.confirm('Reset stats for every difficulty?')) {
            stats = {};
            save(STATS_KEY, stats);
            renderStats();
        }
    });

    populateCustomForm();
    renderHistory();
    renderStats();
    updateModeInfo();
    startRound();
}());
