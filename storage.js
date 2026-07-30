(function (root) {
    'use strict';

    const KEYS = {
        history: 'yog1.problemHistory.v2',
        stats: 'yog1.difficultyStats.v2',
        custom: 'yog1.customSettings.v2',
        achievements: 'yog1.achievements.v1',
        settings: 'yog1.accessibility.v1',
        daily: 'yog1.dailyResults.v1',
        adaptive: 'yog1.adaptiveModel.v1',
        learning: 'yog1.learning.v1',
        locale: 'yog1.locale.v1'
    };
    const SCHEMA_VERSION = 1;

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
