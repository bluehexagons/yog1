#!/usr/bin/env node
'use strict';

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const versionPath = path.join(root, 'version.js');
const htmlPath = path.join(root, 'yog1.htm');
const manifestFiles = [
    'manifest.webmanifest', 'manifest.es.webmanifest', 'manifest.zh.webmanifest',
    'manifest.ar.webmanifest', 'manifest.bn.webmanifest', 'manifest.ja.webmanifest',
    'manifest.hi.webmanifest', 'manifest.pt.webmanifest', 'manifest.ru.webmanifest',
    'manifest.vi.webmanifest', 'manifest.tr.webmanifest', 'manifest.ur.webmanifest'
];
const releaseFiles = ['version.js', 'yog1.htm', 'sw.js'].concat(manifestFiles);
const semverPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function localDate() {
    const now = new Date();
    const year = String(now.getFullYear()).padStart(4, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

function bumpVersion(version, kind) {
    const match = semverPattern.exec(version);
    if (!match) throw new Error('Invalid current version: ' + version);
    const parts = match.slice(1).map(Number);
    if (kind === 'major') return (parts[0] + 1) + '.0.0';
    if (kind === 'minor') return parts[0] + '.' + (parts[1] + 1) + '.0';
    if (kind === 'patch') return parts[0] + '.' + parts[1] + '.' + (parts[2] + 1);
    if (semverPattern.test(kind)) return kind;
    throw new Error('Version must be patch, minor, major, or a value such as 1.2.3.');
}

function readVersion(source) {
    const version = source.match(/\bversion:\s*'([^']+)'/);
    const commitDate = source.match(/\bcommitDate:\s*'([^']+)'/);
    if (!version || !commitDate) throw new Error('Could not read version.js.');
    return { version: version[1], commitDate: commitDate[1] };
}

function renderVersionFile(version, commitDate) {
    return "(function () {\n" +
        "    'use strict';\n\n" +
        '    window.Yog1Version = Object.freeze({\n' +
        "        version: '" + version + "',\n" +
        "        commitDate: '" + commitDate + "'\n" +
        '    });\n' +
        '}());\n';
}

function renderHtmlVersion(source, version, commitDate) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const parts = commitDate.split('-').map(Number);
    const displayDate = months[parts[1] - 1] + ' ' + parts[2] + ', ' + parts[0];
    const withVersion = source.replace(
        /(<strong id="app_version">)[^<]*(<\/strong>)/,
        '$1' + version + '$2'
    );
    return withVersion.replace(
        /(<time id="app_version_date" datetime=")[^"]*("[^>]*>)[^<]*(<\/time>)/,
        '$1' + commitDate + '$2' + displayDate + '$3'
    );
}

function run(command, args, capture) {
    const result = childProcess.spawnSync(command, args, {
        cwd: root,
        encoding: 'utf8',
        stdio: capture ? 'pipe' : 'inherit'
    });
    if (result.error) throw result.error;
    if (result.status !== 0) {
        const detail = capture && result.stderr ? '\n' + result.stderr.trim() : '';
        throw new Error(command + ' ' + args.join(' ') + ' failed.' + detail);
    }
    return capture ? result.stdout.trim() : '';
}

function usage() {
    return [
        'Usage: node scripts/release.js [patch|minor|major|X.Y.Z] [options]',
        '',
        'With no version argument, prints the current version.',
        'By default, updates version.js and regenerates the offline cache.',
        '',
        'Options:',
        '  --commit  Commit the generated release files',
        '  --tag     Create an annotated vX.Y.Z tag (requires --commit)',
        '  --push    Atomically push the branch and tag (requires --tag)',
        '  --help    Show this help'
    ].join('\n');
}

function parseArguments(argv) {
    const options = { commit: false, tag: false, push: false, help: false, target: null };
    for (const argument of argv) {
        if (argument === '--commit') options.commit = true;
        else if (argument === '--tag') options.tag = true;
        else if (argument === '--push') options.push = true;
        else if (argument === '--help' || argument === '-h') options.help = true;
        else if (argument.startsWith('-')) throw new Error('Unknown option: ' + argument);
        else if (options.target) throw new Error('Only one version or bump type may be provided.');
        else options.target = argument;
    }
    if (options.tag && !options.commit) throw new Error('--tag requires --commit.');
    if (options.push && !options.tag) throw new Error('--push requires --tag.');
    return options;
}

function main(argv) {
    const options = parseArguments(argv);
    const current = readVersion(fs.readFileSync(versionPath, 'utf8'));
    if (options.help) {
        console.log(usage());
        return;
    }
    if (!options.target) {
        if (options.commit || options.tag || options.push) {
            throw new Error('Provide a version or bump type when using release options.');
        }
        console.log('v' + current.version + ' (' + current.commitDate + ')');
        return;
    }

    const nextVersion = bumpVersion(current.version, options.target);
    const commitDate = localDate();
    const tagName = 'v' + nextVersion;
    if (nextVersion === current.version && commitDate === current.commitDate) {
        throw new Error(tagName + ' already has today’s commit date.');
    }
    if (options.commit) {
        const status = run('git', ['status', '--porcelain', '--untracked-files=all'], true);
        if (status) throw new Error('The worktree must be clean before an automated release commit.');
    }
    if (options.tag && run('git', ['tag', '--list', tagName], true)) {
        throw new Error('Tag ' + tagName + ' already exists.');
    }

    fs.writeFileSync(versionPath, renderVersionFile(nextVersion, commitDate));
    fs.writeFileSync(
        htmlPath,
        renderHtmlVersion(fs.readFileSync(htmlPath, 'utf8'), nextVersion, commitDate)
    );
    run(process.execPath, [path.join('scripts', 'update-assets.js')], false);
    console.log('Set version to ' + tagName + ' with commit date ' + commitDate + '.');

    if (!options.commit) {
        console.log('Review the generated changes before committing.');
        return;
    }

    run('git', ['add', '--'].concat(releaseFiles), false);
    run('git', ['commit', '-m', 'Release ' + tagName], false);
    if (options.tag) {
        run('git', ['tag', '-a', tagName, '-m', 'Version ' + nextVersion + ' (' + commitDate + ')'], false);
        console.log('Created tag ' + tagName + '.');
    }
    if (options.push) {
        const branch = run('git', ['symbolic-ref', '--short', 'HEAD'], true);
        run('git', ['push', '--atomic', 'origin', branch, tagName], false);
        console.log('Pushed ' + branch + ' and ' + tagName + ' to origin.');
    }
}

if (require.main === module) {
    try {
        main(process.argv.slice(2));
    } catch (error) {
        console.error('Release failed: ' + error.message);
        process.exitCode = 1;
    }
}

module.exports = {
    bumpVersion: bumpVersion,
    parseArguments: parseArguments,
    readVersion: readVersion,
    renderVersionFile: renderVersionFile,
    renderHtmlVersion: renderHtmlVersion
};
