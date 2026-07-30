'use strict';

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const values = new Map();
let failNextWriteTo = null;
const context = {
    Date: Date,
    localStorage: {
        getItem: function (key) { return values.has(key) ? values.get(key) : null; },
        setItem: function (key, value) {
            if (key === failNextWriteTo) {
                failNextWriteTo = null;
                throw new Error('Storage unavailable');
            }
            values.set(key, value);
        },
        removeItem: function (key) { values.delete(key); }
    },
    window: {}
};
context.window.localStorage = context.localStorage;
vm.runInNewContext(fs.readFileSync('assets/js/storage.js', 'utf8'), context, {
    filename: 'assets/js/storage.js'
});
const storage = context.window.Yog1Storage;

assert(Object.values(storage.KEYS).every(function (key) {
    return key.startsWith('yog1.v2.');
}), 'current storage uses one versioned namespace');
storage.save(storage.KEYS.stats, { attempts: 3 });
const resumeSession = {
    id: 'session-test',
    startedAt: Date.now(),
    puzzleStartedAt: Date.now(),
    attempts: 2,
    correct: 1,
    solved: 1,
    streak: 1,
    bestStreak: 1,
    hardest: 9.5,
    durations: [1200],
    hints: 1,
    lives: 3
};
const resumeSnapshot = {
    mode: 'normal',
    round: 7,
    seed: 'resume-seed',
    dailyDate: null,
    custom: null,
    adaptive: null,
    learningConcept: null,
    selectedId: 'n2',
    hintLevel: 1,
    attemptsOnPuzzle: 1,
    hintsOnPuzzle: 1,
    session: resumeSession,
    customRun: null,
    timerDeadline: 0,
    phase: 'playing',
    message: {
        titleKey: 'hint.compare',
        messageKey: 'hint.compareBody',
        values: {
            left: 8,
            right: 12,
            gap: 4,
            side: { catalogKey: 'side.left' }
        }
    },
    feedback: null
};
storage.save(storage.KEYS.resume, resumeSnapshot);
values.set(storage.KEYS.locale, 'ja');
assert.strictEqual(storage.load(storage.KEYS.stats, {}).attempts, 3,
    'stored values round-trip');
const snapshot = storage.exportData();
assert.strictEqual(snapshot.schemaVersion, storage.SCHEMA_VERSION,
    'backups declare their schema');
assert.strictEqual(snapshot.data.stats.attempts, 3,
    'backups include known application data');
assert.strictEqual(snapshot.data.locale, 'ja', 'backups preserve the selected locale');
assert.strictEqual(snapshot.data.resume.seed, 'resume-seed',
    'backups preserve the active puzzle resume record');

values.clear();
storage.importData(snapshot);
assert.strictEqual(storage.load(storage.KEYS.stats, {}).attempts, 3,
    'valid backups restore known data');
assert.strictEqual(values.get(storage.KEYS.locale), 'ja',
    'locale restoration preserves its plain-string storage format');
assert.strictEqual(storage.load(storage.KEYS.resume, {}).round, 7,
    'valid resume records restore with the rest of the save');
assert.strictEqual(storage.load(storage.KEYS.resume, {}).message.values.gap, 4,
    'resume records retain bounded localized message context');
assert.strictEqual(
    storage.load(storage.KEYS.resume, {}).message.values.side.catalogKey,
    'side.left',
    'resume messages retain translation references instead of rendered labels'
);
storage.save(storage.KEYS.settings, { sound: true });
storage.importData({
    application: 'You Only Get 1s',
    schemaVersion: storage.SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data: { history: [] }
});
assert.strictEqual(values.has(storage.KEYS.settings), false,
    'restoring a backup removes save entries that are absent from it');
assert.throws(function () {
    storage.importData({
        application: 'You Only Get 1s',
        schemaVersion: storage.SCHEMA_VERSION - 1,
        data: {}
    });
}, /Unsupported/, 'older backup schemas are rejected');
assert.throws(function () {
    storage.importData({
        application: 'You Only Get 1s',
        schemaVersion: storage.SCHEMA_VERSION,
        data: { unknown: {} }
    });
}, /Unsupported/, 'unknown save entries are rejected');
assert.throws(function () {
    storage.importData({
        application: 'You Only Get 1s',
        schemaVersion: storage.SCHEMA_VERSION,
        data: { history: {} }
    });
}, /Unsupported/, 'save entries with invalid shapes are rejected');
const validDailyDate = '2026-07-30';
const validHistoryTime = new Date().toISOString();
storage.importData({
    application: 'You Only Get 1s',
    schemaVersion: storage.SCHEMA_VERSION,
    exportedAt: validHistoryTime,
    data: {
        history: [{
            correct: true,
            expression: '(8 ÷ 1) = 8',
            mode: 'custom',
            round: 2,
            seed: 'custom:2',
            custom: {
                operations: ['divide'], length: 5, min: 3, max: 100,
                correct: 10, rate: 80, seed: 'custom'
            },
            adaptive: null,
            learningConcept: null,
            dailyDate: null,
            at: validHistoryTime
        }],
        daily: {
            [validDailyDate]: { attempts: 2, hints: 1, success: true, at: Date.now() }
        }
    }
});
assert.strictEqual(storage.load(storage.KEYS.history, [])[0].custom.operations[0], 'divide',
    'current custom history records pass backup validation');
assert.strictEqual(storage.load(storage.KEYS.daily, {})[validDailyDate].success, true,
    'current Daily records pass backup validation');
assert.throws(function () {
    storage.importData({
        application: 'You Only Get 1s',
        schemaVersion: storage.SCHEMA_VERSION,
        data: { history: [null] }
    });
}, /Unsupported/, 'malformed history records are rejected before they can break the UI');
assert.throws(function () {
    storage.importData({
        application: 'You Only Get 1s',
        schemaVersion: storage.SCHEMA_VERSION,
        data: {
            history: [{
                correct: false,
                expression: '2 = 3',
                mode: 'custom',
                round: 1,
                seed: 'test',
                at: new Date().toISOString(),
                custom: {}
            }]
        }
    });
}, /Unsupported/, 'custom history records require replayable operation settings');
assert.throws(function () {
    storage.importData({
        application: 'You Only Get 1s',
        schemaVersion: storage.SCHEMA_VERSION,
        data: {
            history: [{
                correct: true,
                expression: '1 = 1',
                mode: 'challenges',
                round: 0,
                seed: 'test',
                at: new Date().toISOString()
            }]
        }
    });
}, /Unsupported/, 'history rounds must be valid replay inputs');
assert.throws(function () {
    storage.importData({
        application: 'You Only Get 1s',
        schemaVersion: storage.SCHEMA_VERSION,
        data: {
            daily: {
                'not-a-date': { attempts: 1, hints: 0, success: true, at: Date.now() }
            }
        }
    });
}, /Unsupported/, 'daily backups reject invalid dates before streak calculations');
assert.throws(function () {
    storage.importData({
        application: 'You Only Get 1s',
        schemaVersion: storage.SCHEMA_VERSION,
        data: {
            daily: {
                '2026-07-30': { attempts: -1, hints: 0, success: 'yes', at: Date.now() }
            }
        }
    });
}, /Unsupported/, 'daily backups reject malformed result records');
assert.throws(function () {
    storage.importData({
        application: 'You Only Get 1s',
        schemaVersion: storage.SCHEMA_VERSION,
        data: {
            resume: {
                mode: 'custom',
                round: 1,
                seed: 'bad-resume',
                custom: { operations: ['root'] },
                selectedId: null,
                hintLevel: 0
            }
        }
    });
}, /Unsupported/, 'resume records require complete, playable mode settings');
storage.save(storage.KEYS.stats, { attempts: 7 });
const beforeFailedImport = new Map(values);
failNextWriteTo = storage.KEYS.custom;
assert.throws(function () {
    storage.importData({
        application: 'You Only Get 1s',
        schemaVersion: storage.SCHEMA_VERSION,
        exportedAt: new Date().toISOString(),
        data: { history: [], stats: { attempts: 99 }, custom: { seed: 'test' } }
    });
}, /Could not restore/, 'failed storage writes reject the import');
assert.deepStrictEqual(Array.from(values.entries()), Array.from(beforeFailedImport.entries()),
    'a failed import rolls back the previous save');
values.set(storage.KEYS.stats, '{bad json');
assert.deepStrictEqual(storage.load(storage.KEYS.stats, { safe: true }), { safe: true },
    'corrupt storage falls back safely');
assert.throws(function () {
    storage.exportData();
}, /JSON|property name/, 'syntactically corrupt storage cannot produce a partial backup');
values.set(storage.KEYS.stats, '[]');
assert.throws(function () {
    storage.exportData();
}, /Unsupported/, 'shape-invalid storage cannot produce a backup that restore would reject');

const finishedTimedResume = {
    ...resumeSnapshot,
    mode: 'timed',
    timerDeadline: 0,
    phase: 'finished'
};
assert.strictEqual(storage.validResume(finishedTimedResume), true,
    'finished Timed sessions do not need a live deadline');
assert.strictEqual(storage.validResume({ ...finishedTimedResume, phase: 'playing' }), false,
    'active Timed sessions must keep their deadline');
assert.strictEqual(storage.validResume({ ...finishedTimedResume, phase: 'review' }), false,
    'Timed review screens must keep counting down after reload');
assert.strictEqual(storage.validResume({
    ...resumeSnapshot,
    message: { titleKey: 'x', messageKey: 'y', values: { unsafe: {} } }
}), false, 'resume message interpolation values must be simple data');
assert.strictEqual(storage.validResume({
    ...resumeSnapshot,
    feedback: {
        revealSolution: false,
        alternate: false,
        moveId: null,
        attemptedValues: { n1: 2 }
    }
}), false, 'resume feedback only accepts a single valid number-to-one move');

console.log('Storage tests passed.');
