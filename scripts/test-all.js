#!/usr/bin/env node
'use strict';

const childProcess = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const commands = [
    ['node', ['tests/test-core.js']],
    ['node', ['tests/test-content.js']],
    ['node', ['tests/test-storage.js']],
    ['node', ['tests/test-i18n.js']],
    ['node', ['tests/test-ui.js']],
    ['node', ['tests/test-theme.js']],
    ['node', ['tests/test-version.js']],
    ['node', ['--check', 'assets/js/theme.js']],
    ['node', ['--check', 'assets/js/game.js']],
    ['node', ['--check', 'assets/js/i18n.js']],
    ['node', ['--check', 'sw.js']]
];

for (const command of commands) {
    const result = childProcess.spawnSync(command[0], command[1], {
        cwd: root,
        stdio: 'inherit'
    });
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status || 1);
}

console.log('All tests and syntax checks passed.');
