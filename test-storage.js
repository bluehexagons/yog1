'use strict';

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const values = new Map();
const context = {
    Date: Date,
    localStorage: {
        getItem: function (key) { return values.has(key) ? values.get(key) : null; },
        setItem: function (key, value) { values.set(key, value); }
    },
    window: {}
};
context.window.localStorage = context.localStorage;
vm.runInNewContext(fs.readFileSync('storage.js', 'utf8'), context, {
    filename: 'storage.js'
});
const storage = context.window.Yog1Storage;

assert(Object.values(storage.KEYS).every(function (key) {
    return key.startsWith('yog1.v2.');
}), 'current storage uses one versioned namespace');
storage.save(storage.KEYS.stats, { attempts: 3 });
values.set(storage.KEYS.locale, 'ja');
assert.strictEqual(storage.load(storage.KEYS.stats, {}).attempts, 3,
    'stored values round-trip');
const snapshot = storage.exportData();
assert.strictEqual(snapshot.schemaVersion, storage.SCHEMA_VERSION,
    'backups declare their schema');
assert.strictEqual(snapshot.data.stats.attempts, 3,
    'backups include known application data');
assert.strictEqual(snapshot.data.locale, 'ja', 'backups preserve the selected locale');

values.clear();
storage.importData(snapshot);
assert.strictEqual(storage.load(storage.KEYS.stats, {}).attempts, 3,
    'valid backups restore known data');
assert.strictEqual(values.get(storage.KEYS.locale), 'ja',
    'locale restoration preserves its plain-string storage format');
assert.throws(function () {
    storage.importData({
        application: 'You Only Get 1s',
        schemaVersion: storage.SCHEMA_VERSION - 1,
        data: {}
    });
}, /Unsupported/, 'older backup schemas are rejected');
values.set(storage.KEYS.stats, '{bad json');
assert.deepStrictEqual(storage.load(storage.KEYS.stats, { safe: true }), { safe: true },
    'corrupt storage falls back safely');

console.log('Storage tests passed.');
