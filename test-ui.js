'use strict';

const assert = require('assert');
const fs = require('fs');

const html = fs.readFileSync('yog1.htm', 'utf8');
const game = fs.readFileSync('game.js', 'utf8');
const storage = fs.readFileSync('storage.js', 'utf8');

const ids = Array.from(html.matchAll(/\bid="([^"]+)"/g)).map(function (match) {
    return match[1];
});
const uniqueIds = new Set(ids);
assert.strictEqual(uniqueIds.size, ids.length, 'document IDs are unique');

for (const match of html.matchAll(/\b(?:aria-controls|aria-describedby|for)="([^"]+)"/g)) {
    for (const id of match[1].trim().split(/\s+/)) {
        assert(uniqueIds.has(id), match[0] + ' references an existing element');
    }
}

for (const match of html.matchAll(/<button\b([^>]*)>/g)) {
    assert(/\btype="(?:button|submit)"/.test(match[1]),
        'every button declares its type: ' + match[0]);
}

function luminance(hex) {
    const channels = hex.match(/../g).map(function (value) {
        const channel = parseInt(value, 16) / 255;
        return channel <= 0.04045 ? channel / 12.92 :
            Math.pow((channel + 0.055) / 1.055, 2.4);
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(left, right) {
    const first = luminance(left);
    const second = luminance(right);
    return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

const colors = {};
for (const match of html.matchAll(/--([a-z]+):\s*#([0-9a-f]{3,6})/gi)) {
    colors[match[1]] = match[2].length === 3
        ? match[2].split('').map(function (value) { return value + value; }).join('')
        : match[2];
}
for (const pair of [
    ['muted', 'game'], // Muted text on the game surface.
    ['green', 'game'], // Correct result on the game surface.
    ['red', 'game'],   // Incorrect result on the game surface.
    ['warm', 'paper'], // Hint accent on paper.
    ['blue', 'paper']  // Interactive numbers on paper.
]) {
    assert(colors[pair[0]] && colors[pair[1]], pair.join(' and ') + ' colors exist');
    assert(contrast(colors[pair[0]], colors[pair[1]]) >= 4.5,
        pair.join(' on ') + ' meets WCAG AA text contrast');
}
for (const background of ['paper', 'game', 'menu', 'bg']) {
    assert(contrast(colors.focus, colors[background]) >= 3,
        'focus indicator contrasts with the ' + background + ' surface');
}

assert(html.includes('viewport-fit=cover') && html.includes('env(safe-area-inset-top)'),
    'mobile layout accounts for standalone safe areas');
assert(html.includes(':focus-visible') && html.includes('@media (forced-colors: active)'),
    'keyboard focus and forced-colors states are explicit');
assert(html.includes('min-height: 44px') && html.includes('@media (max-width: 420px)'),
    'mobile controls have touch-sized targets and a narrow-phone layout');
assert(html.includes('html.large-text { font-size: 118.75%; }') &&
    html.includes('font: 1rem/1.45') &&
    game.includes("document.documentElement.classList.toggle('large-text'"),
    'larger text scales rem-based controls from the root element');
assert(html.includes('<dl id="session_summary"') &&
    game.includes("text('dt', label") && game.includes("text('dd', value"),
    'session statistics use description-list semantics');
assert(html.includes('<div id="problem" role="group" dir="ltr">') &&
    game.includes("ui.problem.setAttribute('aria-label'"),
    'the interactive equation has a stable direction and generated accessible name');
for (const id of ['quick_language', 'setting_language']) {
    assert(new RegExp('<select id="' + id + '"[^>]*>\\s*</select>').test(html),
        id + ' gets its options from the locale metadata source of truth');
}
assert(game.includes('option.lang = locale.tag') && game.includes('option.dir = locale.direction'),
    'language autonyms carry pronunciation and direction metadata');
assert.strictEqual(
    game.includes("document.activeElement === document.body || ui.problem.contains(document.activeElement)"),
    false,
    'the global Enter shortcut does not override native number-button activation');
assert(game.includes("ui.custom_min.setAttribute('aria-invalid', 'true')") &&
    game.includes('ui.custom_min.focus()'),
    'custom target validation identifies and focuses invalid fields');
for (const id of ['custom_min', 'custom_max', 'custom_correct', 'custom_rate']) {
    assert(new RegExp('id="' + id + '"[^>]*\\brequired(?:\\s|>)').test(html),
        id + ' cannot silently submit an empty value as zero');
}
assert(game.includes('Number.isSafeInteger(parsed)') &&
    game.includes("Math.min(100000, parsed)"),
    'shared round parameters are bounded before reaching the generator');
assert(game.includes("phase: 'playing'") &&
    game.includes("session.phase = 'review'") &&
    game.includes("session.phase = 'finished'"),
    'session transitions use explicit phases');
assert(game.includes('deadline || Date.now() + TIMED_SECONDS * 1000') &&
    game.includes('(timerDeadline - Date.now()) / 1000'),
    'Timed mode follows an absolute deadline');
assert(game.includes('data-replay-history') && game.includes('learningConcept:') &&
    game.includes('adaptive:'),
    'flat history records carry current replay metadata and controls');
assert.strictEqual(game.includes('generatorVersion'), false,
    'puzzle generation has one current implementation');
assert(game.includes('candidateCount: 12') && game.includes('requireUnique: true'),
    'the current generator samples for unique solutions');
assert(storage.includes('SCHEMA_VERSION') && storage.includes('exportData') &&
    storage.includes('importData'),
    'persistent data has a versioned backup boundary');
assert(html.includes('data-i18n="data.title"') &&
    html.includes('id="export_data"') && html.includes('id="import_data"') &&
    html.includes('accept=".json,application/json"') &&
    !html.includes('class="screen-panel options-extras save-data-panel"'),
    'Options always offers a dedicated save-data backup section');
assert(game.includes("'yog1-save-'") &&
    game.includes("setCatalogMessage('data.exportFailed', 'data.exportFailedBody')"),
    'save export downloads a dated JSON file and reports failures');
assert(storage.includes('localStorage.removeItem(key)') &&
    storage.includes('Could not restore YOG1 backup'),
    'imports replace the complete save and roll back failed writes');
assert(game.includes('history = history.filter(function (item)') &&
    game.includes('Array.isArray(item.custom.operations)'),
    'corrupt history is ignored and malformed custom entries cannot crash replay');
assert(game.includes('ui.share.disabled = true') &&
    game.includes("if (mode === 'custom')"),
    'the custom builder disables puzzle actions until a game has started');
assert(game.includes('if (Object.prototype.hasOwnProperty.call(dailyResults, date)) return;'),
    'replaying a Daily puzzle cannot overwrite its first recorded outcome');
assert(game.includes('session.solved >= CURATED.length'),
    'the handcrafted-set achievement requires completing the whole set');
assert(storage.includes("resume: STORAGE_PREFIX + 'resume'") &&
    storage.includes('validResume: validResume') &&
    game.includes('function persistResume(selectedOverride)') &&
    game.includes('function restoreLastProblem()'),
    'the active puzzle has a validated local resume boundary');
assert(game.includes('seed: currentSeed') &&
    game.includes('selectedId: resumedSelection || null') &&
    game.includes('hintLevel: hintLevel') &&
    game.includes('if (restoreLastProblem()) return;'),
    'reload restores the exact generated puzzle and in-progress move state');
assert(game.includes('attemptsOnPuzzle: attemptsOnPuzzle') &&
    game.includes('durations: session.durations.slice()') &&
    game.includes('lives: session.lives') &&
    game.includes('timerDeadline: mode === \'timed\' ? timerDeadline : 0') &&
    game.includes('customRun = Object.assign({}, saved.customRun)') &&
    game.includes('persistResume();\n        }\n        setCatalogMessage(\'result.retry\'') &&
    game.includes('if (saved.mode === \'adaptive\') adaptiveState = latestAdaptiveState') &&
    game.includes('phase: session.phase') &&
    game.includes('message: currentMessage ?') &&
    game.includes('values: Object.assign({}, saved.message.values)') &&
    game.includes('renderExplanation();'),
    'resume records preserve session, messages, Custom, Endless, and Timed progress');
assert(game.includes("lastView: 'play', sidebarCollapsed: false") &&
    game.includes('settings.lastView = selected.dataset.screen') &&
    game.includes('settings.sidebarCollapsed = !!collapsed') &&
    game.includes('settings.historyPage = historyPage') &&
    game.includes('? !!settings.sidebarCollapsed : false, false'),
    'screen, history page, and sidebar convenience preferences persist');
assert(game.includes('achievementIds.has(id)') &&
    game.includes('hasOwnProperty.call(core.OPERATIONS, operation)') &&
    game.includes('Math.min(stats[id].correct, stats[id].attempts)'),
    'corrupt achievement and statistics values are normalized before use');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');
assert(serviceWorker.includes("key.startsWith(CACHE_PREFIX) && key !== CACHE") &&
    serviceWorker.includes('caches.open(CACHE)') &&
    serviceWorker.includes('return self.skipWaiting()') &&
    !serviceWorker.includes('caches.match(event.request'),
    'offline installation, cleanup, and lookups stay within their lifecycle and namespace');
assert(html.includes('class="mode-group"') &&
    html.includes('data-i18n="nav.learn"') &&
    html.includes('data-i18n="nav.challenge"'),
    'the mode list is grouped by player intent');
assert(html.includes('data-mode="guided"') &&
    html.includes('id="learning_rows"') &&
    html.includes('id="learning_goal"'),
    'focused practice exposes a learning goal and progress dashboard');
assert(game.includes('hintLevel >= 4') &&
    game.includes("'hint.compareBody'") &&
    game.includes("'hint.directionBody'"),
    'the hint ladder scaffolds comparison and planning before revealing the answer');
assert(game.includes('core.updateLearningState') &&
    game.includes('core.conceptProgress') &&
    game.includes('core.recommendedConcept'),
    'completed puzzles update concept-level progress and recommendations');
assert(game.includes('core.learningExample') &&
    game.includes('data-copy-learning'),
    'reviewed puzzles can expose structured reasoning examples');
assert(game.includes("t('action.copyJson')") &&
    game.includes("setCatalogMessage('share.copied', 'share.ready')") &&
    game.includes("setCatalogMessage('share.jsonCopied', 'share.jsonReady')") &&
    game.includes("window.prompt(t('share.jsonPrompt'), value)"),
    'structured examples use copy-specific labels and feedback');

console.log('UI audit tests passed.');
