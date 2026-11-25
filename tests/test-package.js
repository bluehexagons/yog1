'use strict';

const assert = require('assert');
const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'yog1-package-'));
try {
    const script = path.join(fixture, 'scripts', 'build-site.js');
    fs.mkdirSync(path.dirname(script));
    fs.copyFileSync(path.join(__dirname, '../scripts/build-site.js'), script);
    const source = path.join(fixture, 'src', 'gamepad.ts');
    fs.mkdirSync(path.dirname(source));
    fs.writeFileSync(source, 'source fixture');

    const customOutput = childProcess.spawnSync(process.execPath, [script, 'src'], { encoding: 'utf8' });
    if (customOutput.error) throw customOutput.error;
    assert.notStrictEqual(customOutput.status, 0);
    assert.match(customOutput.stderr, /can only replace the dist/);
    assert.strictEqual(fs.readFileSync(source, 'utf8'), 'source fixture');

    const dist = path.join(fixture, 'dist');
    fs.writeFileSync(dist, 'unrelated file');
    const existingFile = childProcess.spawnSync(process.execPath, [script], { encoding: 'utf8' });
    if (existingFile.error) throw existingFile.error;
    assert.notStrictEqual(existingFile.status, 0);
    assert.match(existingFile.stderr, /output path must be a directory/);
    assert.strictEqual(fs.readFileSync(dist, 'utf8'), 'unrelated file');
} finally {
    fs.rmSync(fixture, { recursive: true, force: true });
}

console.log('Site packaging tests passed.');
