'use strict';

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const core = require('../assets/js/game-core.js');

const manifestLink = {};
const document = {
    documentElement: {},
    querySelectorAll: function (selector) {
        return selector === 'link[rel="manifest"]' ? [manifestLink] : [];
    }
};
const storage = new Map();
let replacedUrl = null;
const context = {
    URL: URL,
    URLSearchParams: URLSearchParams,
    navigator: { language: 'es-MX' },
    localStorage: {
        getItem: function (key) { return storage.get(key) || null; },
        setItem: function (key, value) { storage.set(key, value); }
    },
    document: document,
    window: {
        location: {
            search: '?lang=es',
            href: 'https://example.test/?lang=es&seed=test#play'
        },
        history: {
            replaceState: function (_, __, value) { replacedUrl = value; }
        }
    }
};
context.window.window = context.window;
context.window.navigator = context.navigator;
context.window.localStorage = context.localStorage;
context.window.document = document;

vm.runInNewContext(fs.readFileSync('assets/js/locales.js', 'utf8'), context,
    { filename: 'assets/js/locales.js' });
for (const locale of context.window.Yog1Locales) {
    if (locale.id === 'en') continue;
    const filename = 'assets/js/translations/' + locale.id + '.js';
    vm.runInNewContext(fs.readFileSync(filename, 'utf8'), context, { filename: filename });
}
vm.runInNewContext(fs.readFileSync('assets/js/i18n.js', 'utf8'), context,
    { filename: 'assets/js/i18n.js' });
const i18n = context.window.Yog1I18n;

assert.strictEqual(i18n.getLocale(), 'es', 'a supported shared locale is selected');
assert.strictEqual(i18n.t('round.score', { target: 12, score: 8 }), 'Objetivo 12 · puntuación 8');
assert.strictEqual(i18n.t('missing.key'), 'missing.key', 'missing translations are visible during development');
i18n.setLocale('en');
assert.strictEqual(i18n.getLocale(), 'en', 'the selected locale can be changed and persisted');
assert.strictEqual(replacedUrl, '/?lang=en&seed=test#play',
    'changing a shared-link language updates its URL so refresh preserves the choice');
i18n.setLocale('zh');
assert.strictEqual(i18n.t('action.check'), '检查等式', 'Simplified Chinese controls are available');
assert.strictEqual(manifestLink.href, 'assets/manifests/manifest.zh.webmanifest',
    'the install manifest follows the selected locale');
i18n.setLocale('ar');
assert.strictEqual(i18n.getDirection(), 'rtl', 'Arabic selects right-to-left layout support');
assert.strictEqual(i18n.t('sidebar.right'), 'اليمين', 'Arabic sidebar controls are available');
assert(i18n.t('round.score', { target: 12, score: 8 }).includes('\u206812\u2069') &&
    i18n.t('round.score', { target: 12, score: 8 }).includes('\u20688\u2069'),
    'dynamic values are bidi-isolated in right-to-left prose');
i18n.setLocale('bn');
assert.strictEqual(i18n.t('action.check'), 'সমীকরণ পরীক্ষা করুন', 'Bengali controls are available');
i18n.setLocale('ja');
assert.strictEqual(i18n.t('action.check'), '式を確認', 'Japanese controls are available');
i18n.setLocale('hi');
assert.strictEqual(i18n.t('action.check'), 'समीकरण जाँचें', 'Hindi controls are available');
i18n.setLocale('pt');
assert.strictEqual(i18n.t('action.check'), 'Verificar equação', 'Brazilian Portuguese controls are available');
assert.strictEqual(i18n.getLanguageTag(), 'pt-BR',
    'Brazilian Portuguese exposes its precise document language tag');
i18n.setLocale('ru');
assert.strictEqual(i18n.t('action.check'), 'Проверить равенство', 'Russian controls are available');
i18n.setLocale('vi');
assert.strictEqual(i18n.t('action.check'), 'Kiểm tra phương trình', 'Vietnamese controls are available');
i18n.setLocale('tr');
assert.strictEqual(i18n.t('action.check'), 'Denklemi kontrol et', 'Turkish controls are available');
i18n.setLocale('ur');
assert.strictEqual(i18n.getDirection(), 'rtl', 'Urdu reuses right-to-left layout support');
assert.strictEqual(manifestLink.href, 'assets/manifests/manifest.ur.webmanifest',
    'right-to-left locales select their localized install manifest');
i18n.setLocale('de');
assert.strictEqual(i18n.t('action.check'), 'Gleichung prüfen', 'German controls are available');
i18n.setLocale('fr');
assert.strictEqual(i18n.t('action.check'), 'Vérifier l’équation', 'French controls are available');
i18n.setLocale('zh-TW');
assert.strictEqual(i18n.getLocale(), 'zh-Hant',
    'Traditional Chinese preferences select the Traditional Chinese catalog');
assert.strictEqual(i18n.t('action.check'), '檢查等式',
    'Traditional Chinese controls are available');
i18n.setLocale('pl');
assert.strictEqual(i18n.t('action.check'), 'Sprawdź równanie', 'Polish controls are available');
i18n.setLocale('ko');
assert.strictEqual(i18n.t('action.check'), '등식 확인', 'Korean controls are available');
i18n.setLocale('pt-PT');
assert.strictEqual(i18n.getLocale(), 'en',
    'Portugal preferences do not silently select Brazilian Portuguese');
i18n.setLocale('zh-Hans');
assert.strictEqual(i18n.getLocale(), 'zh',
    'a supported full language tag resolves to its compact locale ID');
assert.strictEqual(document.documentElement.lang, 'zh-Hans',
    'the document exposes the full language tag to assistive technology');

const modeIds = Object.keys(core.DIFFICULTIES)
    .concat(['tutorial', 'adaptive', 'guided', 'custom', 'daily', 'timed', 'endless', 'challenges']);
function assertCatalogIds(prefix, ids) {
    for (const id of ids) {
        assert(Object.prototype.hasOwnProperty.call(i18n.locales.en, prefix + '.' + id),
            prefix + '.' + id + ' is cataloged for generated UI');
    }
}
assertCatalogIds('operation', Object.keys(core.OPERATIONS));
assertCatalogIds('mode', modeIds);
assertCatalogIds('difficulty', Object.keys(core.DIFFICULTIES));
assertCatalogIds('modeDescription',
    ['tutorial', 'adaptive', 'guided', 'custom', 'daily', 'timed', 'endless', 'challenges']);
for (const id of ['first', 'streak5', 'twenty', 'explorer', 'daily', 'nohint', 'curated']) {
    assertCatalogIds('achievement.' + id, ['name', 'description']);
}
const generatedRoundKinds = new Set();
for (let round = 1; round <= core.ROUND_WAVE.length; round++) {
    generatedRoundKinds.add(core.roundTarget(20, round).kind);
}
for (const kind of Array.from(generatedRoundKinds).concat(['guided', 'curated'])) {
    for (const locale of i18n.availableLocales) {
        assert(Object.prototype.hasOwnProperty.call(i18n.locales[locale], 'round.' + kind),
            locale + ' catalogs generated round kind ' + kind);
    }
}

for (const locale of i18n.availableLocales) {
    const missing = Object.keys(i18n.locales.en).filter(function (key) {
        return !Object.prototype.hasOwnProperty.call(i18n.locales[locale], key);
    });
    assert.deepStrictEqual(missing, [], locale + ' provides every core catalog key');
    for (const key of Object.keys(i18n.locales.en)) {
        const englishPlaceholders = Array.from(i18n.locales.en[key].matchAll(/\{(\w+)\}/g))
            .map(function (match) { return match[1]; }).sort();
        const localePlaceholders = Array.from(i18n.locales[locale][key].matchAll(/\{(\w+)\}/g))
            .map(function (match) { return match[1]; }).sort();
        assert.deepStrictEqual(localePlaceholders, englishPlaceholders,
            locale + ' preserves placeholders for ' + key);
    }
    assert(i18n.locales[locale]['options.keyboard'].includes('Ctrl/'),
        locale + ' documents the non-conflicting keyboard check shortcut');
}

for (const phrase of ['practice weaknesses', 'rating was lowered', 'not counted', 'Native-speaker']) {
    assert.strictEqual(Object.values(i18n.locales.en).some(function (value) {
        return value.includes(phrase);
    }), false, 'learner-facing English avoids judgmental wording: ' + phrase);
}
assert(i18n.locales.en['modeDescription.challenges'].startsWith('Ten '),
    'the Challenge description matches the ten handcrafted puzzles');
const laboratoryTerms = /lab|laborat|лаборатор|实验室|مختبر|ল্যাব|ラボ|प्रयोगशाला|لیب/i;
for (const locale of i18n.availableLocales) {
    assert.strictEqual(laboratoryTerms.test(i18n.locales[locale]['mode.guided']), false,
        locale + ' uses a neutral Guided Practice label');
}
assert.strictEqual(Object.values(i18n.locales.ar).some(function (value) {
    return value.includes('رقم');
}), false, 'Arabic describes changeable values as numbers rather than digits');
assert.strictEqual(i18n.locales.ar['achievement.first.name'], 'الواحد الأول',
    'the Arabic first-achievement name has natural word order');
assert.strictEqual(i18n.locales.bn['mode.timed'], i18n.locales.bn['message.timed'],
    'the Bengali Timed label consistently describes a timed activity');
assert.strictEqual(i18n.locales.ur['mode.timed'], i18n.locales.ur['message.timed'],
    'the Urdu Timed label consistently describes a race against time');
assert(i18n.locales.ru['meta.description'].includes('уравнения'),
    'Russian metadata identifies the game objects as equations');
for (const key of ['message.curated', 'challenges.completeBody', 'shared.challenge',
    'share.challenge', 'achievement.curated.description']) {
    assert.strictEqual(i18n.locales.ru[key].includes('ручн'), false,
        'Russian uses idiomatic author-created wording for ' + key);
    assert.strictEqual(i18n.locales.vi[key].includes('làm tay'), false,
        'Vietnamese uses idiomatic author-designed wording for ' + key);
}
assert(i18n.locales.ur['achievement.curated.description'].includes('بنائی گئی'),
    'Urdu handcrafted-puzzle wording includes the required auxiliary verb');
const newLocaleGlossary = {
    de: {
        'operation.add': 'Addition', 'operation.power': 'Potenzen',
        'custom.seed': 'Startwert (optional)',
        'modeDescription.challenges': 'Zehn eigens entworfene Rätsel mit unterschiedlichen Rechenarten.'
    },
    fr: {
        'operation.add': 'Addition', 'operation.power': 'Puissances',
        'custom.seed': 'Graine (facultatif)',
        'message.curated': 'Problème conçu {round} sur {count}.'
    },
    'zh-Hant': {
        'action.check': '檢查等式', 'custom.operations': '運算',
        'curated.product': '乘積的位置', 'share.challenge': '精選挑戰 {round}'
    },
    pl: {
        'operation.add': 'Dodawanie', 'operation.power': 'Potęgi',
        'stats.record': 'Rekord'
    },
    ko: {
        'action.check': '등식 확인', 'custom.operations': '연산',
        'operation.power': '거듭제곱', 'shared.challenge': '공유된 직접 만든 퍼즐'
    }
};
for (const locale of Object.keys(newLocaleGlossary)) {
    for (const key of Object.keys(newLocaleGlossary[locale])) {
        assert.strictEqual(i18n.locales[locale][key], newLocaleGlossary[locale][key],
            locale + ' uses reviewed game terminology for ' + key);
    }
    assert.strictEqual(Object.values(i18n.locales[locale]).some(function (value) {
        return value.includes('¼') || value.includes('JOJ1') || /[A-Z]{3}1PH\d+X/.test(value);
    }), false, locale + ' preserves math symbols, branding, and interpolation placeholders');
}
assert.strictEqual(i18n.locales.de['feedback.solution'].includes('werden'), true,
    'German solution feedback describes the resulting value rather than an unchanged value');
assert.strictEqual(i18n.locales.fr['share.dailySolved'].split('·')[3].trim().startsWith('indices'),
    true, 'French daily sharing uses one term for hints');
assert.strictEqual(i18n.locales['zh-Hant']['tutorial.retryBody'].includes('框選'), true,
    'Traditional Chinese identifies the outlined tutorial number');
assert.strictEqual(i18n.locales['zh-Hant']['share.dailySolved'].includes('作答次數'), true,
    'Traditional Chinese distinguishes attempt counts from an instruction to try');
assert.strictEqual(i18n.locales.ko['tutorial.retryBody'].includes('테두리'), true,
    'Korean identifies the outlined tutorial number');
assert.strictEqual(i18n.locales.ko['flip.one'].includes('잔돈'), false,
    'Korean change-count wording cannot be confused with coins');
for (const locale of ['en', 'zh', 'zh-Hant', 'ja', 'ko']) {
    assert.strictEqual(/flip|翻转|翻轉|뒤집|反転/i.test(i18n.locales[locale]['modeDescription.tutorial'] +
        i18n.locales[locale]['flip.one']), false,
    locale + ' consistently describes changing a number rather than flipping it');
}
for (const key of ['action.copyJson', 'share.jsonCopied', 'share.jsonReady', 'share.jsonPrompt']) {
    assert(Object.prototype.hasOwnProperty.call(i18n.locales.en, key),
        key + ' has dedicated structured-example copy');
}

const html = fs.readFileSync('index.html', 'utf8') + '\n' +
    fs.readFileSync('assets/css/game.css', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');
const catalogKeys = Array.from(html.matchAll(/\bdata-i18n(?:-aria-label|-title|-placeholder|-content)?="([^"]+)"/g))
    .map(function (match) { return match[1]; });
for (const locale of i18n.availableLocales) {
    const missing = catalogKeys.filter(function (key) {
        return !Object.prototype.hasOwnProperty.call(i18n.locales[locale], key);
    });
    assert.deepStrictEqual(missing, [], locale + ' provides every catalog key used in the document');
}

const localeOptionIds = Array.from(i18n.localeOptions, function (item) { return item.id; });
assert.strictEqual(new Set(localeOptionIds).size,
    i18n.availableLocales.length, 'language selector metadata has one entry per locale');
assert.deepStrictEqual(localeOptionIds,
    Array.from(i18n.availableLocales), 'language selector metadata exposes every supported locale');
assert(i18n.localeOptions.every(function (item) {
    return item.tag && item.label && ['ltr', 'rtl'].includes(item.direction);
}), 'each language selector entry has an autonym, language tag, and direction');
assert.strictEqual((html.match(/<select id="(?:quick_language|setting_language)"/g) || []).length, 2,
    'both language selectors remain available in the document');

for (const locale of i18n.availableLocales) {
    const filename = locale === 'en' ? 'assets/manifests/manifest.webmanifest' :
        'assets/manifests/manifest.' + locale + '.webmanifest';
    const manifest = JSON.parse(fs.readFileSync(filename, 'utf8'));
    const localeOption = i18n.localeOptions.find(function (item) { return item.id === locale; });
    assert.strictEqual(manifest.lang, localeOption.tag, filename + ' declares its full language tag');
    assert.strictEqual(manifest.description, i18n.locales[locale]['meta.description'],
        filename + ' uses the cataloged localized description');
    assert.strictEqual(manifest.id, '/yog1/',
        filename + ' keeps one stable installed-app identity');
    assert.strictEqual(new URL(manifest.start_url, 'https://example.test/').searchParams.get('lang'),
        locale, filename + ' preserves its locale when the installed app launches');
    assert.strictEqual(manifest.dir, ['ar', 'ur'].includes(locale) ? 'rtl' : undefined,
        filename + ' declares right-to-left direction only when needed');
    assert(serviceWorker.includes("'./" + filename + "'"),
        filename + ' is available offline');
}
for (const match of html.matchAll(/<script src="([^"]+)"/g)) {
    assert(serviceWorker.includes("'./" + match[1] + "'"),
        match[1] + ' is available offline');
}
assert(serviceWorker.includes('Generated by scripts/update-assets.js'),
    'offline metadata is generated instead of manually versioned');
const precacheList = serviceWorker.slice(0, serviceWorker.indexOf('const LAZY_FILES'));
assert.strictEqual(precacheList.includes('./assets/js/translations/'), false,
    'locale bundles are excluded from the initial offline precache');
for (const locale of i18n.localeOptions.filter(function (item) { return item.id !== 'en'; })) {
    assert(serviceWorker.includes("'./assets/js/translations/" + locale.id + ".js'"),
        locale.id + ' is listed as a lazy, runtime-cached locale bundle');
}
assert(html.indexOf('<script src="assets/js/locale-loader.js"></script>') <
    html.indexOf('<script src="assets/js/i18n.js"></script>'),
'the selected locale bundle loads before the localization runtime');
assert(fs.statSync('assets/js/i18n.js').size < 30000,
    'the initial localization runtime does not embed every translation catalog');

i18n.setLocale('es');
const localizedMeta = {
    dataset: { i18nContent: 'meta.description' },
    setAttribute: function (name, value) { this[name] = value; }
};
i18n.apply({
    querySelectorAll: function (selector) {
        return selector === '[data-i18n-content]' ? [localizedMeta] : [];
    }
});
assert.strictEqual(localizedMeta.content,
    'Equilibra ecuaciones con enteros cambiando exactamente un número por 1.',
    'localized metadata is applied');

const game = fs.readFileSync('assets/js/game.js', 'utf8');
assert.strictEqual(fs.readFileSync('assets/js/i18n.js', 'utf8').includes('function translate('), false,
    'localization uses one keyed catalog path');
assert.strictEqual(game.includes('roundKind.toLowerCase()'), false,
    'round kinds remain stable catalog identifiers when UI content changes');
assert(game.includes('mode: mode') && game.includes("t('mode.' + item.mode)"),
    'history records use the current mode identifier directly');
assert(game.includes('renderExplanation();'),
    'language changes rerender generated explanation copy');
assert(game.includes('i18n.getLanguageTag()'),
    'locale-sensitive date formatting uses the full language tag');
assert(game.includes('for (const locale of i18n.localeOptions)'),
    'both language selectors are generated from centralized locale metadata');
assert(game.includes('const replayingChallenges'),
    'the submit label preserves the final Challenge replay state');
assert.strictEqual(game.includes("session.finished && mode === 'challenges'"), false,
    'Challenge replay localization does not depend on an unrelated session state');

i18n.setLocale('en');
assert.strictEqual(i18n.t('endless.completeBody', { count: 1 }).includes('1 puzzles'), false,
    'variable completion counts use count-neutral wording');

assert(html.includes('#problem, #feedback code, #history code { direction: ltr;'),
    'all rendered equations are isolated left-to-right');
assert(html.includes('text-align: start;') && html.includes('margin-inline-end: auto;'),
    'localized layout uses logical alignment and margins');
const catalogPrefixes = new Set(Object.keys(i18n.locales.en).map(function (key) {
    return key.split('.')[0];
}));
const gameKeys = Array.from(game.matchAll(/'([a-z][A-Za-z]*(?:\.[A-Za-z]+)+)'/g))
    .map(function (match) { return match[1]; })
    .filter(function (key) { return catalogPrefixes.has(key.split('.')[0]); });
const missingGameKeys = Array.from(new Set(gameKeys)).filter(function (key) {
    return !Object.prototype.hasOwnProperty.call(i18n.locales.en, key);
});
assert.deepStrictEqual(missingGameKeys, [], 'generated UI only references cataloged message keys');

let writtenLocaleScript = '';
const loaderDocument = {
    write: function (value) { writtenLocaleScript = value; }
};
const loaderContext = {
    URLSearchParams: URLSearchParams,
    navigator: { language: 'zh-TW' },
    localStorage: { getItem: function () { return null; } },
    document: loaderDocument,
    window: { location: { search: '' } }
};
Object.assign(loaderContext.window, {
    window: loaderContext.window,
    navigator: loaderContext.navigator,
    localStorage: loaderContext.localStorage
});
vm.runInNewContext(fs.readFileSync('assets/js/locales.js', 'utf8'), loaderContext,
    { filename: 'assets/js/locales.js' });
vm.runInNewContext(fs.readFileSync('assets/js/locale-loader.js', 'utf8'), loaderContext,
    { filename: 'assets/js/locale-loader.js' });
assert(writtenLocaleScript.includes('assets/js/translations/zh-Hant.js'),
    'startup loads only the preferred locale bundle');

const lazyDocument = {
    documentElement: {},
    querySelectorAll: function () { return []; },
    createElement: function () { return {}; },
    head: {
        appendChild: function (script) {
            vm.runInNewContext(fs.readFileSync(script.src, 'utf8'), lazyContext,
                { filename: script.src });
            script.onload();
        }
    }
};
const lazyContext = {
    URL: URL,
    URLSearchParams: URLSearchParams,
    Promise: Promise,
    navigator: { language: 'en' },
    localStorage: { getItem: function () { return null; }, setItem: function () {} },
    document: lazyDocument,
    CustomEvent: function (name) { this.type = name; },
    window: { location: { search: '', href: 'https://example.test/' } }
};
Object.assign(lazyContext.window, {
    window: lazyContext.window,
    navigator: lazyContext.navigator,
    localStorage: lazyContext.localStorage,
    document: lazyDocument,
    CustomEvent: lazyContext.CustomEvent,
    dispatchEvent: function () {}
});
vm.runInNewContext(fs.readFileSync('assets/js/locales.js', 'utf8'), lazyContext,
    { filename: 'assets/js/locales.js' });
vm.runInNewContext(fs.readFileSync('assets/js/i18n.js', 'utf8'), lazyContext,
    { filename: 'assets/js/i18n.js' });
assert.strictEqual(lazyContext.window.Yog1I18n.getLocale(), 'en',
    'unselected locale bundles are absent at startup');
lazyContext.window.Yog1I18n.setLocale('de').then(function () {
    assert.strictEqual(lazyContext.window.Yog1I18n.getLocale(), 'de',
        'selecting an unloaded locale activates it after loading its bundle');
    assert.strictEqual(lazyContext.window.Yog1I18n.t('action.check'), 'Gleichung prüfen',
        'the lazy-loaded catalog is used immediately');
    const pendingScripts = [];
    lazyDocument.head.appendChild = function (script) {
        pendingScripts.push(script);
    };
    const olderRequest = lazyContext.window.Yog1I18n.setLocale('ko');
    const latestRequest = lazyContext.window.Yog1I18n.setLocale('fr');
    for (const locale of ['fr', 'ko']) {
        const script = pendingScripts.find(function (item) {
            return item.src === 'assets/js/translations/' + locale + '.js';
        });
        vm.runInNewContext(fs.readFileSync(script.src, 'utf8'), lazyContext,
            { filename: script.src });
        script.onload();
    }
    return Promise.all([olderRequest, latestRequest]);
}).then(function () {
    assert.strictEqual(lazyContext.window.Yog1I18n.getLocale(), 'fr',
        'an older slow locale request cannot replace the player’s latest choice');
    console.log('Localization tests passed.');
}).catch(function (error) {
    console.error(error);
    process.exitCode = 1;
});
