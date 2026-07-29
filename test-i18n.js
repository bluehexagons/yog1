'use strict';

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const document = {
    documentElement: {},
    querySelectorAll: function () { return []; }
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
i18n.setLocale('ru');
assert.strictEqual(i18n.t('action.check'), 'Проверить равенство', 'Russian controls are available');
i18n.setLocale('vi');
assert.strictEqual(i18n.t('action.check'), 'Kiểm tra phương trình', 'Vietnamese controls are available');
i18n.setLocale('tr');
assert.strictEqual(i18n.t('action.check'), 'Denklemi kontrol et', 'Turkish controls are available');
i18n.setLocale('ur');
assert.strictEqual(i18n.getDirection(), 'rtl', 'Urdu reuses right-to-left layout support');
for (const locale of i18n.availableLocales) {
    const missing = Object.keys(i18n.locales.en).filter(function (key) {
        return !Object.prototype.hasOwnProperty.call(i18n.locales[locale], key);
    });
    assert.deepStrictEqual(missing, [], locale + ' provides every core catalog key');
}

console.log('Localization tests passed.');
