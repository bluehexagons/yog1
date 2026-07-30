'use strict';

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const core = require('./game-core.js');

const manifestLink = {};
const document = {
    documentElement: {},
    querySelectorAll: function (selector) {
        return selector === 'link[rel="manifest"]' ? [manifestLink] : [];
    }
};
const storage = new Map();
const context = {
    URLSearchParams: URLSearchParams,
    navigator: { language: 'es-MX' },
    localStorage: {
        getItem: function (key) { return storage.get(key) || null; },
        setItem: function (key, value) { storage.set(key, value); }
    },
    document: document,
    window: { location: { search: '?lang=es' } }
};
context.window.window = context.window;
context.window.navigator = context.navigator;
context.window.localStorage = context.localStorage;
context.window.document = document;

vm.runInNewContext(fs.readFileSync('locales.js', 'utf8'), context, { filename: 'locales.js' });
vm.runInNewContext(fs.readFileSync('i18n.js', 'utf8'), context, { filename: 'i18n.js' });
const i18n = context.window.Yog1I18n;

assert.strictEqual(i18n.getLocale(), 'es', 'a supported shared locale is selected');
assert.strictEqual(i18n.t('round.score', { target: 12, score: 8 }), 'Objetivo 12 · puntuación 8');
assert.strictEqual(i18n.translate('Easy'), 'Fácil', 'source text is translated for existing UI content');
assert.strictEqual(i18n.t('missing.key'), 'missing.key', 'missing translations are visible during development');
i18n.setLocale('en');
assert.strictEqual(i18n.getLocale(), 'en', 'the selected locale can be changed and persisted');
i18n.setLocale('zh');
assert.strictEqual(i18n.t('action.check'), '检查等式', 'Simplified Chinese controls are available');
assert.strictEqual(manifestLink.href, 'manifest.zh.webmanifest',
    'the install manifest follows the selected locale');
i18n.setLocale('ar');
assert.strictEqual(i18n.getDirection(), 'rtl', 'Arabic selects right-to-left layout support');
assert.strictEqual(i18n.t('sidebar.right'), 'اليمين', 'Arabic sidebar controls are available');
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
assert.strictEqual(manifestLink.href, 'manifest.ur.webmanifest',
    'right-to-left locales select their localized install manifest');
i18n.setLocale('zh-TW');
assert.strictEqual(i18n.getLocale(), 'en',
    'Traditional Chinese preferences do not silently select Simplified Chinese');
i18n.setLocale('pt-PT');
assert.strictEqual(i18n.getLocale(), 'en',
    'Portugal preferences do not silently select Brazilian Portuguese');
i18n.setLocale('zh-Hans');
assert.strictEqual(i18n.getLocale(), 'zh',
    'a supported full language tag resolves to its backwards-compatible locale ID');
assert.strictEqual(document.documentElement.lang, 'zh-Hans',
    'the document exposes the full language tag to assistive technology');

const modeIds = Object.keys(core.DIFFICULTIES)
    .concat(['tutorial', 'adaptive', 'workshop', 'custom', 'daily', 'timed', 'endless', 'challenges']);
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
    ['tutorial', 'adaptive', 'workshop', 'custom', 'daily', 'timed', 'endless', 'challenges']);
for (const id of ['first', 'streak5', 'twenty', 'explorer', 'daily', 'nohint', 'curated']) {
    assertCatalogIds('achievement.' + id, ['name', 'description']);
}
for (const id of modeIds) {
    for (const locale of i18n.availableLocales) {
        assert.strictEqual(
            i18n.getMessageId('mode', i18n.locales[locale]['mode.' + id]),
            id,
            locale + ' mode labels resolve back to stable identifier ' + id
        );
    }
}
assert.strictEqual(i18n.getMessageId('mode', 'not-a-mode'), null,
    'unknown saved labels are not mistaken for stable mode identifiers');

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
}

const html = fs.readFileSync('yog1.htm', 'utf8');
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
    const filename = locale === 'en' ? 'manifest.webmanifest' :
        'manifest.' + locale + '.webmanifest';
    const manifest = JSON.parse(fs.readFileSync(filename, 'utf8'));
    const localeOption = i18n.localeOptions.find(function (item) { return item.id === locale; });
    assert.strictEqual(manifest.lang, localeOption.tag, filename + ' declares its full language tag');
    assert.strictEqual(manifest.description, i18n.locales[locale]['meta.description'],
        filename + ' uses the cataloged localized description');
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

const game = fs.readFileSync('game.js', 'utf8');
assert.strictEqual(game.includes('i18n.translate('), false,
    'generated UI uses catalog keys instead of partial source-text translation');
assert.strictEqual(game.includes('roundKind.toLowerCase()'), false,
    'round kinds remain stable catalog identifiers when UI content changes');
assert(game.includes('modeId: mode'),
    'new history records persist the stable mode identifier');
assert(game.includes("i18n.getMessageId('mode', item.modeId || item.mode)"),
    'localized mode labels in existing history are migrated to stable identifiers');
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

console.log('Localization tests passed.');
