(function (root) {
    'use strict';

    const STORAGE_KEY = 'yog1.v2.locale';
    const LOCALE_OPTIONS = root.Yog1Locales.map(function (item) {
        return Object.assign({}, item);
    });
    const AVAILABLE_LOCALES = LOCALE_OPTIONS.map(function (item) { return item.id; });
    const RTL_LOCALES = LOCALE_OPTIONS.filter(function (item) {
        return item.direction === 'rtl';
    }).map(function (item) { return item.id; });
    const messages = {
        en: {
    "language.label": "Language",
    "theme.label": "Color scheme",
    "theme.auto": "Automatic (follow device)",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.midnight": "Midnight",
    "theme.sunset": "Sunset",
    "theme.pastel": "Pastel",
    "sidebar.label": "Sidebar side",
    "sidebar.auto": "Automatic (follow language)",
    "sidebar.left": "Left",
    "sidebar.right": "Right",
    "nav.view": "View",
    "nav.play": "Play",
    "nav.options": "Options",
    "nav.stats": "Stats",
    "nav.mode": "Mode",
    "menu.expand": "Expand",
    "menu.collapse": "Collapse",
    "menu.expandTitle": "Expand game menu",
    "menu.collapseTitle": "Collapse game menu",
    "action.menu": "Menu",
    "action.reset": "Reset",
    "action.check": "Check equation",
    "action.next": "Next puzzle",
    "action.again": "Play again",
    "round.tutorial": "Tutorial",
    "round.score": "Target {target} · score {score}",
    "flip.one": "change remaining",
    "flip.many": "changes remaining",
    "session.solved": "solved",
    "session.accuracy": "accuracy",
    "session.average": "average",
    "session.hardest": "hardest",
    "timer.seconds": "{seconds}s",
    "history.empty": "No saved problems yet.",
    "history.page": "Page {page} of {pages} · {count}/{limit} saved",
    "history.correct": "Correct",
    "history.incorrect": "Incorrect",
    "history.round": "round {round}",
    "mode.operations": "Operations: {operations}",
    "mode.baseLength": "Base length: {min}–{max}",
    "confirm.clearHistory": "Clear all locally saved problem history?",
    "confirm.resetStat": "Reset stats for {mode}?",
    "confirm.resetAll": "Reset stats for every mode?",
    "aria.resetStat": "Reset {mode} stats",
    "nav.about": "About",
    "aria.navigation": "Game navigation",
    "aria.sections": "Game sections",
    "aria.mode": "Game mode",
    "aria.play": "Play",
    "aria.options": "Options",
    "aria.stats": "Statistics",
    "aria.about": "About",
    "aria.session": "Current session statistics",
    "aria.puzzle": "Current puzzle",
    "custom.operations": "Operations",
    "custom.note": "Choose +, −, ×, ÷, or powers.",
    "custom.length": "Length",
    "custom.operationCount": "operations",
    "custom.minimum": "Minimum target",
    "custom.maximum": "Maximum target",
    "custom.correct": "Correct answers to finish",
    "custom.rate": "Accuracy goal (%)",
    "custom.seed": "Seed (optional)",
    "custom.seedHint": "Same seed, same game",
    "custom.start": "Start custom game",
    "options.wave": "Each mode repeats an eight-round wave of warm-ups, standard rounds, and gentler challenges.",
    "options.keyboard": "Keys: ←/→ select · Space changes or restores · Ctrl/Command+Enter checks · H opens a hint.",
    "action.hint": "Hint",
    "action.reveal": "Show solution",
    "action.share": "Share",
    "action.install": "Install offline app",
    "stats.mode": "Mode",
    "stats.correct": "Correct",
    "stats.winRate": "Accuracy",
    "stats.streak": "Streak",
    "stats.record": "Record",
    "stats.actions": "Actions",
    "stats.resetAll": "Reset all stats",
    "stats.previous": "Previous",
    "stats.next": "Next",
    "stats.clearHistory": "Clear history",
    "about.title": "About",
    "about.version": "Version",
    "about.commitDate": "Commit date",
    "about.summary": "Change one number to 1 to balance an equation.",
    "about.origin": "A refreshed version of bluehexagons’ Ludum Dare 28 game, with generated puzzles, settings, offline play, and local stats.",
    "about.translations": "Translations",
    "about.note": "Translations were drafted with help from a large language model and may contain mistakes.",
    "about.contribute": "Help improve translations on GitHub.",
    "about.review": "Corrections from fluent speakers are always welcome.",
    "about.author": "About the author",
    "about.authorBody": "Loren Crain makes games and interactive experiences as bluehexagons.",
    "about.links": "More from bluehexagons",
    "about.support": "Support development",
    "about.supportBody": "If you enjoy this game, you can support future bluehexagons projects through any of these platforms.",
    "footer.made": "Made by bluehexagons for Ludum Dare 28.",
    "footer.source": "View the source on GitHub.",
    "footer.local": "History and stats stay in this browser.",
    "operation.add": "Addition",
    "operation.subtract": "Subtraction",
    "operation.multiply": "Multiplication",
    "operation.divide": "Integer division",
    "operation.modulo": "Remainder",
    "operation.power": "Powers",
    "operation.root": "Square roots",
    "mode.tutorial": "Tutorial",
    "mode.easy": "Easy",
    "mode.normal": "Normal",
    "mode.hard": "Hard",
    "mode.expert": "Expert",
    "mode.extreme": "Extreme",
    "mode.custom": "Custom",
    "mode.daily": "Daily",
    "mode.timed": "Timed",
    "mode.endless": "Endless",
    "mode.challenges": "Challenges",
    "options.difficulty": "Difficulty guide",
    "difficulty.easy": "Three values with + and −.",
    "difficulty.normal": "Short puzzles with × and frequent three-value rounds.",
    "difficulty.hard": "Short puzzles with integer ÷ and some three-value rounds.",
    "difficulty.expert": "Adds % and ^, with some three-value rounds.",
    "difficulty.extreme": "Longer puzzles with every operation, including √.",
    "round.number": "Round {round}",
    "round.guided": "Guided",
    "round.warmup": "Warm-up",
    "round.standard": "Standard",
    "round.challenge": "Challenge",
    "round.curated": "Curated",
    "round.kindTitle": "{kind} round",
    "message.howToPlay": "How to play",
    "message.tutorial": "Change one number to 1.",
    "message.daily": "Daily puzzle",
    "message.dailyBody": "One shared puzzle today.",
    "message.timed": "Timed",
    "message.timedBody": "Solve as many as you can in 60 seconds.",
    "message.endless": "Endless",
    "message.endlessBody": "Difficulty rises. You have three chances.",
    "message.curated": "Handcrafted puzzle {round} of {count}.",
    "message.standardBody": "Change one number, then check.",
    "message.challengeBody": "A harder round. Take your time.",
    "curated.original": "The original",
    "curated.product": "Product placement",
    "curated.root": "Root and remainder",
    "curated.power": "A small power",
    "curated.divide": "Evenly divided",
    "result.balanced": "Balanced",
    "result.balancedBody": "Both sides match. Review, then continue.",
    "result.retry": "Not balanced",
    "result.retryBody": "Try the same puzzle again when you’re ready.",
    "result.solution": "Solution shown",
    "result.solutionBody": "This puzzle won’t affect your score. Review it, then continue.",
    "aria.changeNumber": "Change {number} to 1",
    "aria.restoreNumber": "Restore {number}",
    "feedback.totals": "Your totals: {left} and {right}.",
    "feedback.solution": "Change {number} to 1. Both sides become {total}.",
    "page.accessibility": "Appearance, accessibility & sound",
    "setting.sound": "Sound effects",
    "setting.largeText": "Larger text",
    "setting.contrast": "Higher contrast",
    "setting.clutter": "Reduced clutter",
    "motion.label": "Motion",
    "motion.auto": "Automatic (follow device)",
    "motion.reduce": "Reduce motion",
    "motion.full": "Full motion",
    "setting.textSpacing": "Increased text spacing",
    "setting.underlineLinks": "Always underline links",
    "tagline": "One move. Make it count.",
    "action.yourMove": "Your move",
    "page.statsHistory": "Stats & history",
    "page.statsDifficulty": "Stats by difficulty",
    "page.problemHistory": "Problem history",
    "page.achievements": "Achievements",
    "progress.custom": "{correct}/{goal} correct · accuracy {accuracy}% · goal {rate}%",
    "progress.chances": "Chances: {chances}",
    "achievement.first.name": "First 1",
    "achievement.first.description": "Solve one puzzle.",
    "achievement.streak5.name": "Five in a row",
    "achievement.streak5.description": "Solve five in a row.",
    "achievement.twenty.name": "Twenty solved",
    "achievement.twenty.description": "Solve 20 puzzles.",
    "achievement.explorer.name": "All operations",
    "achievement.explorer.description": "Use every operation.",
    "achievement.daily.name": "Daily puzzle",
    "achievement.daily.description": "Finish a Daily puzzle.",
    "achievement.nohint.name": "No hint",
    "achievement.nohint.description": "Finish a Challenge without a hint.",
    "achievement.curated.name": "Complete set",
    "achievement.curated.description": "Finish all handcrafted puzzles.",
    "share.copied": "Copied",
    "share.ready": "Link and result are ready to paste.",
    "share.prompt": "Copy this puzzle link:",
    "custom.chooseOperation": "Choose an operation",
    "custom.chooseOperationBody": "Choose at least one operation.",
    "custom.chooseIdentity": "Choose +, −, ×, ÷, or ^",
    "custom.chooseIdentityBody": "Include an operation that can change a number to 1.",
    "custom.checkTargets": "Check the targets",
    "custom.checkTargetsBody": "The minimum cannot exceed the maximum.",
    "timed.complete": "Time is up",
    "timed.result": "Solved {count} in 60 seconds.",
    "meta.description": "Balance integer equations by changing exactly one number into a 1.",
    "action.hintTitle": "Hint (H)",
    "modeDescription.tutorial": "A guided introduction to the one-change rule.",
    "modeDescription.daily": "The same puzzle for everyone, refreshed each day.",
    "modeDescription.timed": "Score as many correct answers as possible in 60 seconds.",
    "modeDescription.endless": "Three chances while difficulty rises every eight rounds.",
    "modeDescription.challenges": "Ten handcrafted puzzles featuring different operations.",
    "modeDescription.custom": "Choose the operations, length, seed, targets, and completion goal.",
    "custom.builder": "Build a custom game",
    "custom.builderBody": "Choose the rules, then start the run. A seed makes it reproducible.",
    "custom.won": "Custom game complete",
    "custom.wonBody": "{correct}/{attempts} correct ({accuracy}%).",
    "daily.complete": "Daily complete",
    "daily.completeBody": "Attempts: {attempts} · hints: {hints}",
    "daily.revealed": "Daily solution revealed",
    "daily.revealedBody": "The shared result records this as a reveal.",
    "challenges.complete": "Challenge set complete",
    "challenges.completeBody": "You solved all {count} handcrafted puzzles.",
    "endless.complete": "Run complete",
    "endless.completeBody": "Puzzles solved: {count}. All three chances were used.",
    "endless.revealedBody": "The revealed puzzle used your final chance.",
    "tutorial.good": "It balances!",
    "tutorial.goodBody": "Check the equation to finish the tutorial.",
    "tutorial.restore": "Try the outlined number",
    "tutorial.restoreBody": "Select the same number again to restore it.",
    "tutorial.complete": "Tutorial complete",
    "tutorial.completeBody": "Your first Easy round is ready.",
    "tutorial.retry": "Try another move",
    "tutorial.retryBody": "Restore your selection, then try changing the outlined 3.",
    "hint.side": "Hint: choose a side",
    "hint.sideBody": "One solution changes a number on the outlined side.",
    "hint.number": "Hint: the number",
    "hint.numberBody": "One solution changes the outlined number.",
    "shared.challenge": "Shared handcrafted puzzle",
    "shared.custom": "Shared custom puzzle",
    "shared.customBody": "This custom puzzle is reproduced from a shared link.",
    "shared.seeded": "Shared seeded puzzle",
    "shared.seededBody": "This puzzle is reproduced from a shared link.",
    "share.dailyDefault": "YOG1 Daily {date}",
    "share.dailySolved": "YOG1 {date} · solved · attempts: {attempts} · hints: {hints}",
    "share.dailyRevealed": "YOG1 {date} · solution revealed · attempts: {attempts} · hints: {hints}",
    "share.challenge": "handcrafted challenge {round}",
    "share.puzzle": "{mode} puzzle",
    "mode.adaptive": "Adaptive",
    "modeDescription.adaptive": "Difficulty follows your answers. Flow keeps familiar operations in rotation while hints and skips gently adjust the next puzzle.",
    "action.skip": "Skip question",
    "progress.adaptive": "Level: {level} · progress: {skill}%",
    "adaptive.skipped": "Question skipped",
    "adaptive.skippedBody": "Here’s the solution. Adaptive mode will choose a gentler next step.",
    "nav.learn": "Learn",
    "nav.classic": "Classic",
    "nav.challenge": "Challenge",
    "adaptive.style": "Adaptive style",
    "adaptive.flow": "Flow · follow your pace",
    "adaptive.coach": "Coach · build confidence",
    "modeDescription.adaptiveCoach": "Difficulty follows your answers and gives you more practice with less-familiar operations.",
    "aria.equals": "equals",
    "feedback.yourSteps": "Your arithmetic",
    "feedback.solutionSteps": "Solution arithmetic",
    "feedback.alternate": "You found a valid alternate solution.",
    "result.alternate": "Alternate solution",
    "result.alternateBody": "That move balances the equation too.",
    "progress.daily": "{grid} · streak {current} · best {best}",
    "share.dailyStreak": "streak {streak}",
    "action.replay": "Replay",
    "history.replaying": "Replaying puzzle",
    "history.replayingBody": "This saved puzzle has been restored.",
    "data.export": "Download backup",
    "data.import": "Restore backup",
    "data.exported": "Data exported",
    "data.exportedBody": "Your local progress was saved as a JSON backup.",
    "data.importFailed": "Import failed",
    "data.importFailedBody": "That file doesn’t look like a YOG1 JSON backup. Please choose another file.",
    "confirm.importData": "Import this backup? It will replace the save data on this device.",
    "mode.guided": "Guided Practice",
    "modeDescription.guided": "Focused practice follows your progress and revisits concepts over time.",
    "learning.goal": "Learning goal",
    "learning.concept": "Concept",
    "learning.recommended": "Suggested for me",
    "learning.seen": "Practiced",
    "learning.progress": "Progress",
    "learning.unaided": "Independent",
    "learning.progressValue": "Progress: {progress}%",
    "learning.recommendation": "Suggested next: {concept}",
    "hint.compare": "Compare the sides",
    "hint.compareBody": "Before the move: left {left}, right {right}. Their gap is {gap}.",
    "hint.direction": "Plan the change",
    "hint.directionBody": "The {side} side must change by {delta} to reach {total}.",
    "side.left": "left",
    "side.right": "right",
    "feedback.effect": "Changing {number} to 1 changed the {side} side from {before} to {after} ({delta}).",
    "learning.focus": "Practice focus",
    "action.copyJson": "Copy JSON",
    "share.jsonCopied": "JSON copied",
    "share.jsonReady": "The JSON is ready to paste.",
    "share.jsonPrompt": "Copy this JSON:",
    "data.title": "Save data",
    "data.description": "Download a backup of your progress and settings, or restore them from a backup.",
    "data.exportFailed": "Export failed",
    "data.exportFailedBody": "Your backup couldn’t be downloaded. Please try again."
}
    };
    const loading = {};

    function localeOption(locale) {
        return LOCALE_OPTIONS.find(function (item) { return item.id === locale; }) ||
            LOCALE_OPTIONS[0];
    }

    function supported(value) {
        return root.Yog1ResolveLocale(value);
    }

    function initialLocale() {
        const requested = new URLSearchParams(root.location.search).get('lang');
        if (requested) return supported(requested);
        try {
            const saved = root.localStorage.getItem(STORAGE_KEY);
            if (saved) return supported(saved);
        } catch (error) {}
        return supported(root.navigator.language || 'en');
    }

    function registerLocale(code, catalog) {
        if (!AVAILABLE_LOCALES.includes(code) || !catalog || typeof catalog !== 'object') {
            return false;
        }
        messages[code] = catalog;
        return true;
    }

    const registered = root.Yog1LocaleMessages || {};
    for (const code of Object.keys(registered)) registerLocale(code, registered[code]);

    let locale = initialLocale();
    let localeRequest = 0;
    if (!messages[locale]) locale = 'en';

    function localeSource(code) {
        return code === 'en' ? 'assets/js/i18n.js' :
            'assets/js/translations/' + encodeURIComponent(code) + '.js';
    }

    function loadLocale(code) {
        if (messages[code]) return Promise.resolve(code);
        if (loading[code]) return loading[code];
        if (!AVAILABLE_LOCALES.includes(code)) {
            return Promise.reject(new Error('Unsupported locale ' + code));
        }
        if (!root.document || typeof root.document.createElement !== 'function') {
            return Promise.reject(new Error('Cannot load locale ' + code));
        }
        loading[code] = new Promise(function (resolve, reject) {
            const script = root.document.createElement('script');
            script.src = localeSource(code);
            script.async = true;
            script.onload = function () {
                if (typeof script.remove === 'function') script.remove();
                if (messages[code]) resolve(code);
                else reject(new Error('Locale bundle did not register ' + code));
            };
            script.onerror = function () {
                if (typeof script.remove === 'function') script.remove();
                reject(new Error('Could not load locale ' + code));
            };
            root.document.head.appendChild(script);
        }).finally(function () {
            delete loading[code];
        });
        return loading[code];
    }

    function t(key, values) {
        const template = (messages[locale] && messages[locale][key]) ||
            messages.en[key] || key;
        return template.replace(/\{(\w+)\}/g, function (_, name) {
            if (!values || values[name] === undefined) return '{' + name + '}';
            const value = String(values[name]);
            return RTL_LOCALES.includes(locale) ? '\u2068' + value + '\u2069' : value;
        });
    }

    function apply(rootElement) {
        const scope = rootElement || root.document;
        for (const element of scope.querySelectorAll('[data-i18n]')) {
            element.textContent = t(element.dataset.i18n);
        }
        for (const element of scope.querySelectorAll('[data-i18n-aria-label]')) {
            element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
        }
        for (const element of scope.querySelectorAll('[data-i18n-title]')) {
            element.title = t(element.dataset.i18nTitle);
        }
        for (const element of scope.querySelectorAll('[data-i18n-placeholder]')) {
            element.placeholder = t(element.dataset.i18nPlaceholder);
        }
        for (const element of scope.querySelectorAll('[data-i18n-content]')) {
            element.setAttribute('content', t(element.dataset.i18nContent));
        }
        for (const element of root.document.querySelectorAll('link[rel="manifest"]')) {
            element.href = locale === 'en' ? 'assets/manifests/manifest.webmanifest' :
                'assets/manifests/manifest.' + locale + '.webmanifest';
        }
        const option = localeOption(locale);
        root.document.documentElement.lang = option.tag;
        root.document.documentElement.dir = option.direction;
    }

    function activateLocale(nextLocale) {
        const previous = locale;
        locale = nextLocale;
        try { root.localStorage.setItem(STORAGE_KEY, locale); } catch (error) {}
        if (root.history && typeof root.history.replaceState === 'function' &&
            root.location && root.location.href) {
            try {
                const url = new URL(root.location.href);
                if (url.searchParams.has('lang')) {
                    url.searchParams.set('lang', locale);
                    root.history.replaceState(null, '', url.pathname + url.search + url.hash);
                }
            } catch (error) {
                // Locale persistence still works when URL history is unavailable.
            }
        }
        apply();
        if (locale !== previous && typeof root.CustomEvent === 'function' &&
            root.dispatchEvent) {
            root.dispatchEvent(new root.CustomEvent('yog1localechange'));
        }
        return locale;
    }

    function setLocale(nextLocale) {
        const request = ++localeRequest;
        const next = supported(nextLocale);
        if (messages[next]) {
            return Promise.resolve(request === localeRequest ? activateLocale(next) : locale);
        }
        return loadLocale(next).then(function () {
            return request === localeRequest ? activateLocale(next) : locale;
        }).catch(function () {
            if (request !== localeRequest) return locale;
            apply();
            if (typeof root.CustomEvent === 'function' && root.dispatchEvent) {
                root.dispatchEvent(new root.CustomEvent('yog1localechange'));
            }
            return locale;
        });
    }

    root.Yog1I18n = {
        apply: apply,
        getLocale: function () { return locale; },
        setLocale: setLocale,
        loadLocale: loadLocale,
        registerLocale: registerLocale,
        localeSource: localeSource,
        t: t,
        locales: messages,
        availableLocales: AVAILABLE_LOCALES,
        localeOptions: LOCALE_OPTIONS.map(function (item) {
            return Object.assign({}, item);
        }),
        getLanguageTag: function () { return localeOption(locale).tag; },
        getDirection: function () { return RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr'; }
    };
}(window));
