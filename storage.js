(function (root) {
    'use strict';

    const STORAGE_PREFIX = 'yog1.v2.';
    const KEYS = {
        history: STORAGE_PREFIX + 'history',
        stats: STORAGE_PREFIX + 'stats',
        custom: STORAGE_PREFIX + 'custom',
        achievements: STORAGE_PREFIX + 'achievements',
        settings: STORAGE_PREFIX + 'settings',
        daily: STORAGE_PREFIX + 'daily',
        adaptive: STORAGE_PREFIX + 'adaptive',
        learning: STORAGE_PREFIX + 'learning',
        locale: STORAGE_PREFIX + 'locale'
    };
    const SCHEMA_VERSION = 2;
    const HISTORY_MODES = new Set([
        'easy', 'normal', 'hard', 'expert', 'extreme', 'adaptive', 'guided',
        'custom', 'daily', 'timed', 'endless', 'challenges'
    ]);

    function validDate(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
        const parsed = new Date(value + 'T00:00:00Z');
        return Number.isFinite(parsed.getTime()) &&
            parsed.toISOString().slice(0, 10) === value;
    }

    function validTimestamp(value) {
        return typeof value === 'string' && Number.isFinite(Date.parse(value));
    }

    function validHistoryItem(item) {
        return item && typeof item === 'object' &&
            typeof item.correct === 'boolean' &&
            typeof item.expression === 'string' &&
            HISTORY_MODES.has(item.mode) &&
            Number.isSafeInteger(item.round) && item.round >= 1 &&
            typeof item.seed === 'string' &&
            validTimestamp(item.at) &&
            (item.mode !== 'daily' || validDate(item.dailyDate)) &&
            (item.mode !== 'custom' ||
                (item.custom && typeof item.custom === 'object' &&
                    Array.isArray(item.custom.operations)));
    }

    function validDailyResult(date, result) {
        return validDate(date) && result && typeof result === 'object' &&
            typeof result.success === 'boolean' &&
            Number.isSafeInteger(result.at) &&
            Number.isSafeInteger(result.attempts) && result.attempts >= 0 &&
            Number.isSafeInteger(result.hints) && result.hints >= 0;
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
            return true;
        } catch (error) {
            return false;
        }
    }

    function exportData() {
        const data = {};
        for (const [name, key] of Object.entries(KEYS)) {
            const raw = localStorage.getItem(key);
            if (raw !== null) {
                data[name] = name === 'locale' ? raw : JSON.parse(raw);
            }
        }
        const snapshot = {
            application: 'You Only Get 1s',
            schemaVersion: SCHEMA_VERSION,
            exportedAt: new Date().toISOString(),
            data: data
        };
        validateSnapshot(snapshot);
        return snapshot;
    }

    function validateSnapshot(snapshot) {
        if (!snapshot || snapshot.application !== 'You Only Get 1s' ||
            snapshot.schemaVersion !== SCHEMA_VERSION ||
            !snapshot.data || typeof snapshot.data !== 'object' ||
            Array.isArray(snapshot.data)) {
            throw new Error('Unsupported YOG1 backup');
        }
        for (const [name, value] of Object.entries(snapshot.data)) {
            if (!Object.prototype.hasOwnProperty.call(KEYS, name)) {
                throw new Error('Unsupported YOG1 backup');
            }
            if (name === 'locale') {
                if (typeof value !== 'string') throw new Error('Unsupported YOG1 backup');
            } else if (name === 'history') {
                if (!Array.isArray(value) || value.some(function (item) {
                    return !validHistoryItem(item);
                })) {
                    throw new Error('Unsupported YOG1 backup');
                }
            } else if (name === 'daily') {
                if (!value || typeof value !== 'object' || Array.isArray(value) ||
                    Object.entries(value).some(function (entry) {
                        return !validDailyResult(entry[0], entry[1]);
                    })) {
                    throw new Error('Unsupported YOG1 backup');
                }
            } else if (!value || typeof value !== 'object' || Array.isArray(value)) {
                throw new Error('Unsupported YOG1 backup');
            }
        }
    }

    function importData(snapshot) {
        validateSnapshot(snapshot);
        const previous = {};
        const serialized = {};
        for (const [name, key] of Object.entries(KEYS)) {
            previous[name] = localStorage.getItem(key);
            if (Object.prototype.hasOwnProperty.call(snapshot.data, name)) {
                serialized[name] = name === 'locale'
                    ? snapshot.data[name] : JSON.stringify(snapshot.data[name]);
            }
        }
        try {
            for (const [name, key] of Object.entries(KEYS)) {
                if (Object.prototype.hasOwnProperty.call(serialized, name)) {
                    localStorage.setItem(key, serialized[name]);
                } else {
                    localStorage.removeItem(key);
                }
            }
        } catch (error) {
            for (const [name, key] of Object.entries(KEYS)) {
                try {
                    if (previous[name] === null) localStorage.removeItem(key);
                    else localStorage.setItem(key, previous[name]);
                } catch (rollbackError) {
                    // Continue restoring the remaining entries.
                }
            }
            throw new Error('Could not restore YOG1 backup');
        }
    }

    root.Yog1Storage = {
        KEYS: KEYS,
        SCHEMA_VERSION: SCHEMA_VERSION,
        load: load,
        save: save,
        exportData: exportData,
        importData: importData
    };
}(window));
