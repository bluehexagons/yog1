#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const repositoryRoot = path.resolve(__dirname, '..');
const root = path.resolve(repositoryRoot, process.argv[2] || '.');
if (root !== repositoryRoot && !root.startsWith(repositoryRoot + path.sep)) {
    throw new Error('The site root must be inside the repository.');
}

function read(filename) {
    return fs.readFileSync(path.join(root, filename), 'utf8');
}

function requireFile(filename, source) {
    if (!fs.existsSync(path.join(root, filename))) {
        throw new Error(source + ' references missing file ' + filename);
    }
}

const html = read('index.html');
if (!html.includes('Content-Security-Policy') ||
    !html.includes('rel="canonical"') ||
    !html.includes('property="og:title"')) {
    throw new Error('index.html is missing required security or discovery metadata.');
}
if (/<(?:script|style)(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/(?:script|style)>/i.test(html)) {
    throw new Error('index.html must keep scripts and styles in external files.');
}
for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const reference = match[1];
    if (/^(?:https?:|#|mailto:)/.test(reference) || reference === './') continue;
    requireFile(reference.split(/[?#]/)[0], 'index.html');
}

const serviceWorker = read('sw.js');
const cachedFiles = Array.from(serviceWorker.matchAll(/'\.\/([^']+)'/g),
    function (match) { return match[1]; });
for (const filename of cachedFiles) requireFile(filename, 'sw.js');

const manifestDirectory = path.join(root, 'assets/manifests');
const manifestFiles = fs.readdirSync(manifestDirectory)
    .filter(function (filename) { return filename.endsWith('.webmanifest'); });
if (manifestFiles.length !== 17) throw new Error('Expected 17 localized manifests.');
for (const filename of manifestFiles) {
    const manifestPath = path.join('assets/manifests', filename);
    const manifest = JSON.parse(read(manifestPath));
    if (manifest.id !== '/yog1/') throw new Error(filename + ' has an unstable app ID.');
    const localeMatch = /^manifest(?:\.([^.]+))?\.webmanifest$/.exec(filename);
    const locale = localeMatch && localeMatch[1] ? localeMatch[1] : 'en';
    const start = new URL(manifest.start_url,
        'https://example.test/yog1/assets/manifests/' + filename);
    if (start.pathname !== '/yog1/' || start.searchParams.get('lang') !== locale) {
        throw new Error(filename + ' has an invalid start URL.');
    }
    for (const icon of manifest.icons) {
        const iconPath = path.normalize(path.join(path.dirname(manifestPath), icon.src));
        requireFile(iconPath, filename);
    }
}

if (!read('robots.txt').includes('https://bluehexagons.github.io/yog1/sitemap.xml')) {
    throw new Error('robots.txt must advertise the production sitemap.');
}
if (!read('sitemap.xml').includes('<loc>https://bluehexagons.github.io/yog1/</loc>')) {
    throw new Error('sitemap.xml must include the canonical game URL.');
}

console.log('Site audit passed for ' +
    (path.relative(repositoryRoot, root) || 'repository root') + '.');
