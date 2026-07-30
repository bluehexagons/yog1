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
            try {
                const raw = localStorage.getItem(key);
                if (raw !== null) {
                    data[name] = name === 'locale' ? raw : JSON.parse(raw);
                }
            } catch (error) {
                // Ignore a corrupt or unavailable entry without losing the rest.
            }
        }
        return {
            application: 'You Only Get 1s',
            schemaVersion: SCHEMA_VERSION,
            exportedAt: new Date().toISOString(),
            data: data
        };
    }

    function importData(snapshot) {
        if (!snapshot || snapshot.application !== 'You Only Get 1s' ||
            snapshot.schemaVersion !== SCHEMA_VERSION ||
            !snapshot.data || typeof snapshot.data !== 'object' ||
            Array.isArray(snapshot.data)) {
            throw new Error('Unsupported YOG1 backup');
        }
        for (const [name, value] of Object.entries(snapshot.data)) {
            if (Object.prototype.hasOwnProperty.call(KEYS, name)) {
                if (name === 'locale') {
                    try { localStorage.setItem(KEYS[name], String(value)); } catch (error) {}
                } else {
                    save(KEYS[name], value);
                }
            }
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
