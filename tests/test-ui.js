'use strict';

const assert = require('assert');
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8') + '\n' +
    fs.readFileSync('assets/css/game.css', 'utf8');
const game = fs.readFileSync('assets/js/game.js', 'utf8');
const storage = fs.readFileSync('assets/js/storage.js', 'utf8');
const theme = fs.readFileSync('assets/js/theme.js', 'utf8');

const ids = Array.from(html.matchAll(/\bid="([^"]+)"/g)).map(function (match) {
    return match[1];
});
const uniqueIds = new Set(ids);
assert.strictEqual(uniqueIds.size, ids.length, 'document IDs are unique');

const uiRegistry = game.match(/for \(const id of \[([\s\S]*?)\]\) \{/);
assert(uiRegistry, 'game UI registry exists');
const registeredUiIds = new Set(Array.from(uiRegistry[1].matchAll(/'([^']+)'/g), function (match) {
    return match[1];
}));
for (const id of registeredUiIds) {
    assert(uniqueIds.has(id), 'registered UI element #' + id + ' exists');
}
for (const match of game.matchAll(/\bui\.([A-Za-z0-9_]+)/g)) {
    assert(registeredUiIds.has(match[1]), 'ui.' + match[1] + ' is registered');
}

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
assert(html.includes('@keyframes screen-enter') &&
    html.includes('@keyframes equation-enter') &&
    html.includes('@keyframes feedback-enter') &&
    game.includes("restartAnimation(ui.problem, 'is-new-round')") &&
    game.includes("restartAnimation(ui.feedback, 'is-updating')"),
    'screen, round, and feedback state changes use purposeful motion');
assert(html.includes('@media (prefers-reduced-motion: reduce)') &&
    html.includes('animation: none !important') &&
    html.includes('transition: none !important'),
    'motion and transitions honor the reduced-motion preference');
assert(html.includes('id="setting_motion"') &&
    html.includes(':root[data-motion="reduce"]') &&
    html.includes(':root:not([data-motion="full"])') &&
    theme.includes('applyMotion(savedSettings.motion)') &&
    game.includes('window.Yog1Theme.applyMotion(settings.motion)'),
    'motion can follow the device, be reduced, or be explicitly enabled without startup flashes');
assert(game.includes("motion: 'auto'") &&
    game.includes("settings.motion = ui.setting_motion.value") &&
    game.includes('ui.setting_motion.value = motion'),
    'the motion preference defaults safely, persists, and stays synchronized with its control');
assert(html.includes('id="setting_text_spacing"') &&
    html.includes('id="setting_underline_links"') &&
    html.includes('body.increased-text-spacing') &&
    html.includes('body.underline-links a') &&
    game.includes('textSpacing: ui.setting_text_spacing.checked') &&
    game.includes('underlineLinks: ui.setting_underline_links.checked'),
    'readability settings support and persist increased spacing and link recognition');
assert(html.includes('@media (prefers-color-scheme: dark)') &&
    html.includes(':root[data-color-scheme="dark"]') &&
    html.includes('id="setting_color_scheme"'),
    'automatic, light, and dark color-scheme controls are available');
assert(theme.includes("STORAGE_KEY = 'yog1.v2.settings'") &&
    theme.includes("media.addEventListener('change'") &&
    game.includes('window.Yog1Theme.apply(settings.colorScheme)') &&
    game.includes('for (const scheme of window.Yog1Theme.schemes)') &&
    game.includes("option.dataset.i18n = 'theme.' + scheme") &&
    game.includes('settings.colorScheme = select.value'),
    'the color scheme is restored early, follows browser changes, and persists');
for (const id of ['quick_color_scheme', 'setting_color_scheme']) {
    assert(new RegExp('<select id="' + id + '"[^>]*>\\s*</select>').test(html),
        id + ' gets its options from the validated runtime theme list');
}
assert(html.includes('class="quick-select quick-language"') &&
    html.includes('class="quick-select quick-theme"') &&
    html.includes('id="quick_language" aria-label="Language"') &&
    html.includes('id="quick_color_scheme" aria-label="Color scheme"') &&
    !html.includes('data-compact-input') &&
    !html.includes('compact-input-panel') &&
    !game.includes('function setupCompactInputs()'),
    'toolbar language and theme controls open their native choice lists directly');
assert(html.includes('.quick-select select {') &&
    html.includes(".quick-select::after") &&
    html.includes('.quick-select select { min-width: 44px; }'),
    'quick selects retain the toolbar button treatment and mobile touch targets');
assert(!html.includes('LD28 / 2013') &&
    (html.match(/Ludum Dare 28/g) || []).length === 1 &&
    html.includes('data-i18n="about.origin"'),
    'the original jam is credited only in the About screen');
assert(html.includes('class="screen-panel about-copy about-privacy"') &&
    html.includes('data-i18n="about.privacyBody"') &&
    html.includes('data-i18n="about.hostingPrivacy"'),
    'About includes a visible project and hosting privacy policy');
assert(html.includes('input[type="number"], input[type="text"], select') &&
    html.includes('accent-color: var(--blue)'),
    'text fields and native choice controls participate in every theme');
assert(html.includes('min-height: 44px') && html.includes('@media (max-width: 420px)'),
    'mobile controls have touch-sized targets and a narrow-phone layout');
assert(html.includes('@media (max-width: 960px)') &&
    html.includes('@media (min-width: 641px) and (max-width: 960px)') &&
    html.includes('@media (max-width: 640px)') &&
    html.includes('@media (max-height: 600px)') &&
    html.includes('#problem .number { min-width: 44px; min-height: 44px;') &&
    html.includes('.panel-body th:first-child, .panel-body td:first-child') &&
    html.includes('width: clamp(240px, 32vw, 300px)') &&
    html.includes('overflow-y: auto; overscroll-behavior: contain;'),
    'tablet and short-viewport layouts preserve targets, context, and independent scrolling');
assert(html.includes('id="play_hud"') &&
    html.includes('container: game / inline-size;') &&
    html.includes('@container game (max-width: 660px)') &&
    html.includes('grid-template-columns: minmax(0, 1.45fr) minmax(250px, .75fr)') &&
    html.includes('#session_summary_values { display: grid; grid-template-columns: repeat(4'),
    'the play HUD responds to available game-panel width and keeps session context compact');
assert(html.includes('#session_summary_values { grid-template-columns: repeat(2') &&
    html.includes('#actions { display: grid; grid-template-columns: repeat(3') &&
    html.includes('#custom_progress, #submit { grid-column: 1 / -1;'),
    'narrow game panels recompose statistics and actions instead of shrinking every label');
assert(html.includes('height: calc(100svh - 48px') &&
    html.includes('min-height: min(600px, calc(100svh - 48px') &&
    html.includes('position: absolute; z-index: 30; inset: 0;') &&
    html.includes('height: 58px; padding: 7px 10px;') &&
    html.includes('.mode-group { grid-template-columns: repeat(3, minmax(0, 1fr)); }'),
    'the viewport-bounded shell uses a compact mobile bar and an overlay navigation drawer');
assert(game.includes("window.matchMedia('(max-width: 640px)')") &&
    game.includes("stackedLayout.addEventListener('change'") &&
    game.includes("setSidebarCollapsed(stackedLayout.matches || (selected.dataset.screen === 'play'") &&
    game.includes('const restoreCollapsed = stackedLayout.matches || preferredCollapsed;') &&
    game.includes('ui.game.inert = stackedLayout.matches && !collapsed;') &&
    game.includes("event.key === 'Escape' && stackedLayout.matches") &&
    game.includes("mode !== 'custom' || stackedLayout.matches") &&
    game.includes('visibleTarget.offsetLeft'),
    'stacked layouts dismiss navigation and keep active equation terms visible');
assert(html.includes('class="flip-allowance"') && html.includes('.flip-allowance { white-space: nowrap; }'),
    'the move count and its label cannot split across lines');
assert(html.includes('<dl class="app-version">') && html.includes('.app-version div { display: flex; flex-wrap: wrap;'),
    'About metadata can wrap each label and value cleanly under text expansion');
assert(html.includes('html.large-text { font-size: 118.75%; }') &&
    html.includes('font: 1rem/1.45') &&
    game.includes("document.documentElement.classList.toggle('large-text'"),
    'larger text scales rem-based controls from the root element');
assert(html.includes('<div id="session_summary" role="group" aria-labelledby="session_summary_label"') &&
    html.includes('<dl id="session_summary_values">') &&
    game.includes("text('dt', label") && game.includes("text('dd', value"),
    'session statistics use description-list semantics');
assert(html.includes('<div id="problem" role="group" dir="ltr" tabindex="-1">') &&
    game.includes("ui.problem.setAttribute('aria-label'"),
    'the interactive equation has a stable direction and generated accessible name');
assert(html.includes('id="app_status"') && html.includes('aria-atomic="true"') &&
    game.includes('function announceProblem()') &&
    game.includes('if (announcementTimer) window.clearTimeout(announcementTimer);') &&
    game.includes('pendingAchievementAnnouncements.join') &&
    game.includes('pendingAchievementAnnouncements.push') &&
    !html.includes('id="achievement_notice" role="status"'),
    'one coalesced atomic app status announces complete puzzle, result, and achievement changes');
assert(html.includes('<div id="feedback" hidden></div>') &&
    !html.includes('<div id="feedback" role="status"'),
    'interactive solution details do not compete with concise status announcements');
assert(html.includes('id="timer_label" role="timer"') &&
    game.includes('[30, 10, 5].includes(timeRemaining)'),
    'the timer has semantics and announces only useful countdown milestones');
assert(game.includes("session.lives + ' / 3'") &&
    game.includes("ui.custom_progress.setAttribute('aria-label'"),
    'lives and Daily progress have meaningful text alternatives instead of unexplained symbols');
assert(html.includes('role="group" aria-labelledby="mode_group_learn"') &&
    html.includes('role="group" aria-labelledby="mode_group_classic"') &&
    html.includes('role="group" aria-labelledby="mode_group_challenge"'),
    'mode categories are exposed as named groups');
assert(html.includes('id="import_file" class="sr-only"') && html.includes('tabindex="-1"') &&
    html.includes('tabindex="-1" aria-hidden="true"') &&
    !html.includes('aria-haspopup="listbox"'),
    'hidden and popup controls do not expose misleading keyboard or popup semantics');
assert(game.includes("document.getElementById('play_screen').hidden") &&
    game.includes("event.target.closest('.number')") &&
    game.includes('ui.workspace.contains(event.target)'),
    'game shortcuts are scoped to visible puzzle controls');
assert(game.includes("ui.custom_min.setAttribute('aria-describedby', 'message')") &&
    game.includes("setAttribute('aria-describedby', 'custom_note message')"),
    'custom validation associates the explanation with invalid controls');
for (const id of ['quick_language', 'setting_language']) {
    assert(new RegExp('<select id="' + id + '"[^>]*>\\s*</select>').test(html),
        id + ' gets its options from the locale metadata source of truth');
}
assert(game.includes('option.lang = locale.tag') && game.includes('option.dir = locale.direction'),
    'language autonyms carry pronunciation and direction metadata');
assert(game.includes("select.setAttribute('aria-busy', 'true')") &&
    game.includes('select.disabled = true') &&
    game.includes('select.removeAttribute(\'aria-busy\')'),
    'language controls communicate and prevent input while a catalog is loading');
assert(game.includes('if (replacement) replacement.focus();') &&
    game.includes("event.key === 'Enter' && inPuzzle && (event.ctrlKey || event.metaKey)") &&
    !game.includes("event.key === 'Enter' && event.target.closest('.number')") &&
    !game.includes('ui.submit.focus();'),
    'number buttons retain native keyboard activation and puzzle checking has a separate shortcut');
assert(game.includes("button.setAttribute('aria-disabled', 'true')") &&
    game.includes("button.tabIndex = button.dataset.numberId === activeId ? 0 : -1") &&
    game.includes('if (replacement) replacement.focus();') &&
    game.includes("if (session.phase === 'playing') ui.submit.disabled = !selectedId;") &&
    html.includes('#problem .number[aria-disabled="true"]'),
    'puzzle controls retain focus, use one tab stop, require a move, and become inert during review');
assert(game.includes("drawProblem('.hint-target, .hint-side')") &&
    game.includes("event.animationName === 'equation-enter'") &&
    game.includes('if (event.repeat) return;'),
    'hints remain visible and one-shot interactions do not repeat or replay round motion');
assert(html.includes('data-i18n="options.gamepad"') &&
    html.indexOf('assets/js/gamepad.js') < html.indexOf('assets/js/game.js') &&
    game.includes('function setupGamepad()') &&
    game.includes("document.addEventListener('visibilitychange', updateGamepadPolling)") &&
    game.includes("window.addEventListener('blur', updateGamepadPolling)") &&
    game.includes("window.addEventListener('gamepadconnected'") &&
    html.includes('#problem .number.gamepad-focus'),
    'gamepad support is documented, loaded in order, lifecycle-aware, and visibly focused');
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
    game.includes("setTransientCatalogMessage('data.exportFailed', 'data.exportFailedBody')"),
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
assert(html.includes('<details id="custom_panel" hidden>') &&
    html.includes('<summary data-i18n="custom.builder">') &&
    game.includes('ui.workspace.hidden = mode === \'custom\';') &&
    game.includes("if (mode === 'custom') ui.custom_panel.open = false;") &&
    game.includes('ui.problem.focus();'),
    'Custom setup collapses into an editable disclosure and moves focus into active play');
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
    game.includes('message: currentPersistentMessage ?') &&
    game.includes('values: Object.assign({}, saved.message.values)') &&
    game.includes('renderExplanation();'),
    'resume records preserve session, messages, Custom, Endless, and Timed progress');
assert(game.includes('currentPersistentMessage = currentMessage') &&
    game.includes("setTransientCatalogMessage('share.copied'") &&
    game.includes("mode === 'timed' && session.phase !== 'finished'"),
    'transient notices stay transient and Timed review continues after reload');
assert(game.includes("lastView: 'play', sidebarCollapsed: false") &&
    game.includes('settings.lastView = selected.dataset.screen') &&
    game.includes('settings.sidebarCollapsed = !!collapsed') &&
    game.includes('settings.historyPage = historyPage') &&
    game.includes("if (preferredView !== 'play') {\n            setSidebarCollapsed(restoreCollapsed, false);") &&
    game.includes("setSidebarCollapsed(mode !== 'custom' || stackedLayout.matches, !stackedLayout.matches)") &&
    game.includes('const restoreCollapsed = stackedLayout.matches || preferredCollapsed;'),
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
assert(serviceWorker.includes("event.data.type === 'cache-all-locales'") &&
    game.includes("postMessage({ type: 'cache-all-locales' })"),
    'explicit offline installation makes every language available without bloating startup');
assert(fs.readFileSync('index.html', 'utf8')
    .includes('<link rel="stylesheet" href="assets/css/game.css">'),
    'the Pages entry point loads its organized stylesheet');
assert(html.includes('http-equiv="Content-Security-Policy"') &&
    html.includes('script-src \'self\'') &&
    html.includes('rel="canonical"') &&
    html.includes('property="og:title"'),
    'the public entry point declares security and discovery metadata');
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
    game.includes("'hint.directionBody'") &&
    game.includes('function hintTargetDetail()') &&
    game.includes("currentMessage.messageKey === 'hint.sideBody'") &&
    game.includes("t('aria.changeNumber'") &&
    game.includes("button.setAttribute('aria-describedby', 'message')") &&
    game.includes("wrapper.setAttribute('aria-describedby', 'message')"),
    'the hint ladder scaffolds reasoning before naming its visual target in text');
assert(html.includes('--ui-label-font: "Courier New", monospace;') &&
    html.includes('html[lang^="zh-Hant"]') && html.includes('html[lang^="ja"]') &&
    html.includes('html[lang^="ko"]') && html.includes('html[lang^="ur"]') &&
    html.includes('hyphens: auto;') && html.includes('overflow-wrap: anywhere;'),
    'translated controls use script-aware fonts and expansion-safe wrapping');
assert(game.includes('function updateProblemOverflow()') &&
    game.includes('new window.ResizeObserver(updateProblemOverflow)') &&
    game.includes("ui.problem.addEventListener('scroll', updateProblemOverflow)") &&
    game.includes('if (currentProblem) window.requestAnimationFrame(updateProblemOverflow);') &&
    game.includes('ui.problem.scrollLeft = 0;') &&
    html.includes('#problem.can-scroll:not(.at-scroll-end)'),
    'long equations reset to their start and keep their overflow affordance synchronized');
assert(game.includes('core.updateLearningState') &&
    game.includes('core.conceptProgress') &&
    game.includes('core.recommendedConcept'),
    'completed puzzles update concept-level progress and recommendations');
assert(game.includes('core.learningExample') &&
    game.includes('data-copy-learning'),
    'reviewed puzzles can expose structured reasoning examples');
assert(game.includes("t('action.copyJson')") &&
    game.includes("setTransientCatalogMessage('share.copied', 'share.ready')") &&
    game.includes("setTransientCatalogMessage('share.jsonCopied', 'share.jsonReady')") &&
    game.includes("window.prompt(t('share.jsonPrompt'), value)"),
    'structured examples use copy-specific labels and feedback');

console.log('UI audit tests passed.');
