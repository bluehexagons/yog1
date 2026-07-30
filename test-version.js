'use strict';

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const release = require('./scripts/release.js');

const versionSource = fs.readFileSync('version.js', 'utf8');
const context = { window: {} };
vm.runInNewContext(versionSource, context, { filename: 'version.js' });
const current = release.readVersion(versionSource);

assert(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(current.version),
    'the public version uses semantic versioning');
assert(/^\d{4}-\d{2}-\d{2}$/.test(current.commitDate),
    'the public version records an ISO commit date');
assert.strictEqual(context.window.Yog1Version.version, current.version,
    'the runtime exposes the generated public version');
assert.strictEqual(context.window.Yog1Version.commitDate, current.commitDate,
    'the runtime exposes the generated commit date');
assert(Object.isFrozen(context.window.Yog1Version),
    'runtime version metadata cannot be changed accidentally');
assert.strictEqual(
    release.renderVersionFile(current.version, current.commitDate),
    versionSource,
    'the checked-in metadata uses the release generator format'
);

assert.strictEqual(release.bumpVersion('1.2.3', 'patch'), '1.2.4');
assert.strictEqual(release.bumpVersion('1.2.3', 'minor'), '1.3.0');
assert.strictEqual(release.bumpVersion('1.2.3', 'major'), '2.0.0');
assert.strictEqual(release.bumpVersion('1.2.3', '4.5.6'), '4.5.6');
assert.throws(function () {
    release.bumpVersion('1.2.3', 'banana');
}, /Version must be/, 'invalid bump requests are rejected');
assert.throws(function () {
    release.parseArguments(['patch', '--tag']);
}, /requires --commit/, 'tagging cannot accidentally skip the release commit');
assert.throws(function () {
    release.parseArguments(['patch', '--push']);
}, /requires --tag/, 'pushing cannot accidentally omit the version tag');

const html = fs.readFileSync('yog1.htm', 'utf8');
const game = fs.readFileSync('game.js', 'utf8');
const updater = fs.readFileSync('scripts/update-assets.js', 'utf8');
assert(html.includes('id="app_version"') && html.includes('id="app_version_date"'),
    'the About screen exposes version and date elements');
assert(html.includes('<strong id="app_version">' + current.version + '</strong>') &&
    html.includes('<time id="app_version_date" datetime="' + current.commitDate + '">'),
    'the About fallback matches the generated release metadata');
assert.strictEqual(
    release.renderHtmlVersion(html, current.version, current.commitDate),
    html,
    'the checked-in About fallback uses the release generator format'
);
assert(html.indexOf('<script src="version.js">') < html.indexOf('<script src="game.js">'),
    'version metadata loads before the UI renders it');
assert(game.includes("date.toLocaleDateString(i18n.getLanguageTag()"),
    'the commit date follows the selected display language');
assert(updater.includes("'game-content.js', 'version.js', 'game.js'"),
    'version metadata is included in the offline cache');

console.log('Version metadata and release tool tests passed.');
