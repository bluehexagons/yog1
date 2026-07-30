#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const destination = path.resolve(root, process.argv[2] || 'dist');
if (destination === root || !destination.startsWith(root + path.sep)) {
    throw new Error('The site output must be a directory inside the repository.');
}

const files = [
    '.nojekyll',
    'index.html',
    'yog1.htm',
    'robots.txt',
    'sitemap.xml',
    'sw.js'
];
const directories = ['assets/css', 'assets/icons', 'assets/js', 'assets/manifests'];

fs.rmSync(destination, { recursive: true, force: true });
fs.mkdirSync(destination, { recursive: true });
for (const filename of files) {
    fs.copyFileSync(path.join(root, filename), path.join(destination, filename));
}
for (const directory of directories) {
    fs.cpSync(path.join(root, directory), path.join(destination, directory), {
        recursive: true
    });
}

console.log('Packaged static site in ' + path.relative(root, destination) + '/.');
