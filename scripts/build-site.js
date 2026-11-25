#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const destination = path.join(root, 'dist');
if (process.argv[2] && path.resolve(root, process.argv[2]) !== destination) {
    throw new Error('The site package can only replace the dist/ output directory.');
}
const existingOutput = fs.lstatSync(destination, { throwIfNoEntry: false });
if (existingOutput && !existingOutput.isDirectory()) {
    throw new Error('The dist/ output path must be a directory.');
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
