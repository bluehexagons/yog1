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
        resume: STORAGE_PREFIX + 'resume',
        locale: STORAGE_PREFIX + 'locale'
    };
    const SCHEMA_VERSION = 2;
    const HISTORY_MODES = new Set([
        'easy', 'normal', 'hard', 'expert', 'extreme', 'adaptive', 'guided',
        'custom', 'daily', 'timed', 'endless', 'challenges'
    ]);
    const RESUME_MODES = new Set(Array.from(HISTORY_MODES).concat(['tutorial']));

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
            (item.mode !== 'custom' || validCustomSettings(item.custom));
    }

    function validDailyResult(date, result) {
        return validDate(date) && result && typeof result === 'object' &&
            typeof result.success === 'boolean' &&
            Number.isSafeInteger(result.at) &&
            Number.isSafeInteger(result.attempts) && result.attempts >= 0 &&
            Number.isSafeInteger(result.hints) && result.hints >= 0;
    }

    function validCustomSettings(value) {
        return value && typeof value === 'object' && !Array.isArray(value) &&
            Array.isArray(value.operations) && value.operations.length > 0 &&
            value.operations.every(function (operation) {
                return ['add', 'subtract', 'multiply', 'divide', 'modulo', 'power', 'root']
                    .includes(operation);
            }) && value.operations.some(function (operation) {
                return ['add', 'subtract', 'multiply', 'divide', 'power'].includes(operation);
            }) &&
            Number.isSafeInteger(value.length) && value.length >= 2 && value.length <= 12 &&
            Number.isSafeInteger(value.min) && value.min >= 3 && value.min <= 100 &&
            Number.isSafeInteger(value.max) && value.max >= value.min && value.max <= 100 &&
            Number.isSafeInteger(value.correct) && value.correct >= 1 && value.correct <= 100 &&
            Number.isSafeInteger(value.rate) && value.rate >= 1 && value.rate <= 100 &&
            typeof value.seed === 'string' && value.seed.length <= 80;
    }

    function validSession(value) {
        const counters = [
            'startedAt', 'puzzleStartedAt', 'attempts', 'correct', 'solved',
            'streak', 'bestStreak', 'hints'
        ];
        return value && typeof value === 'object' && !Array.isArray(value) &&
            typeof value.id === 'string' && value.id.length > 0 && value.id.length <= 128 &&
            counters.every(function (key) {
                return Number.isSafeInteger(value[key]) && value[key] >= 0;
            }) &&
            value.correct <= value.attempts && value.solved <= value.correct &&
            value.streak <= value.solved && value.bestStreak <= value.solved &&
            Number.isFinite(value.hardest) && value.hardest >= 0 &&
            Array.isArray(value.durations) && value.durations.length <= 10000 &&
            value.durations.every(function (duration) {
                return Number.isSafeInteger(duration) && duration >= 0;
            }) &&
            Number.isSafeInteger(value.lives) && value.lives >= 0 && value.lives <= 3;
    }

    function validCustomRun(value) {
        return value && typeof value === 'object' && !Array.isArray(value) &&
            Number.isSafeInteger(value.attempts) && value.attempts >= 0 &&
            Number.isSafeInteger(value.correct) && value.correct >= 0 &&
            value.correct <= value.attempts && typeof value.won === 'boolean';
    }

    function validResumeMessage(value) {
        return value && typeof value === 'object' && !Array.isArray(value) &&
            typeof value.titleKey === 'string' && value.titleKey.length <= 80 &&
            typeof value.messageKey === 'string' && value.messageKey.length <= 80 &&
            value.values && typeof value.values === 'object' &&
            !Array.isArray(value.values) && Object.keys(value.values).length <= 12 &&
            Object.entries(value.values).every(function (entry) {
                return entry[0].length <= 40 &&
                    (typeof entry[1] === 'boolean' ||
                        (typeof entry[1] === 'string' && entry[1].length <= 240) ||
                        (typeof entry[1] === 'number' && Number.isFinite(entry[1])) ||
                        (entry[1] && typeof entry[1] === 'object' &&
                            !Array.isArray(entry[1]) &&
                            Object.keys(entry[1]).length === 1 &&
                            typeof entry[1].catalogKey === 'string' &&
                            entry[1].catalogKey.length <= 80));
            });
    }

    function validResume(value) {
        return value && typeof value === 'object' && !Array.isArray(value) &&
            RESUME_MODES.has(value.mode) &&
            Number.isSafeInteger(value.round) && value.round >= 1 && value.round <= 100000 &&
            typeof value.seed === 'string' && value.seed.length <= 160 &&
            (value.mode !== 'daily' || validDate(value.dailyDate)) &&
            (value.mode !== 'custom' || validCustomSettings(value.custom)) &&
            (value.adaptive === null || value.adaptive === undefined ||
                (value.adaptive && typeof value.adaptive === 'object' &&
                    !Array.isArray(value.adaptive))) &&
            (value.learningConcept === null || value.learningConcept === undefined ||
                typeof value.learningConcept === 'string') &&
            (value.selectedId === null || value.selectedId === undefined ||
                (typeof value.selectedId === 'string' && value.selectedId.length <= 32)) &&
            Number.isSafeInteger(value.hintLevel) &&
            value.hintLevel >= 0 && value.hintLevel <= 4 &&
            Number.isSafeInteger(value.attemptsOnPuzzle) && value.attemptsOnPuzzle >= 0 &&
            Number.isSafeInteger(value.hintsOnPuzzle) && value.hintsOnPuzzle >= 0 &&
            value.hintsOnPuzzle >= value.hintLevel &&
            validSession(value.session) &&
            (value.mode !== 'custom' || validCustomRun(value.customRun)) &&
            Number.isSafeInteger(value.timerDeadline) && value.timerDeadline >= 0 &&
            (value.mode !== 'timed' || value.phase !== 'playing' || value.timerDeadline > 0) &&
            ['playing', 'review', 'finished'].includes(value.phase) &&
            (value.message === null || value.message === undefined ||
                validResumeMessage(value.message)) &&
            (value.feedback === null ||
                (value.feedback && typeof value.feedback === 'object' &&
                    !Array.isArray(value.feedback) &&
                    typeof value.feedback.revealSolution === 'boolean' &&
                    typeof value.feedback.alternate === 'boolean' &&
                    (value.feedback.moveId === null ||
                        (typeof value.feedback.moveId === 'string' &&
                            value.feedback.moveId.length <= 32)) &&
                    (value.feedback.attemptedValues === null ||
                        (value.feedback.attemptedValues &&
                            typeof value.feedback.attemptedValues === 'object' &&
                            !Array.isArray(value.feedback.attemptedValues)))));
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
            } else if (name === 'resume') {
                if (!validResume(value)) throw new Error('Unsupported YOG1 backup');
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
        importData: importData,
        validResume: validResume
    };
}(window));
