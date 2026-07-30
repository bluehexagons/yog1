'use strict';

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

let systemDark = false;
let systemListener = null;
const themeColor = {};
const attributes = {};
const documentElement = {
    dataset: {},
    removeAttribute: function (name) {
        delete attributes[name];
        if (name === 'data-color-scheme') delete this.dataset.colorScheme;
    }
};
const settings = new Map([[
    'yog1.v2.settings',
    JSON.stringify({ colorScheme: 'dark' })
]]);
const context = {
    document: {
        documentElement: documentElement,
        querySelector: function (selector) {
            return selector === 'meta[name="theme-color"]' ? themeColor : null;
        }
    },
    window: {
        localStorage: {
            getItem: function (key) { return settings.get(key) || null; }
        },
        matchMedia: function () {
            return {
                get matches() { return systemDark; },
                addEventListener: function (type, listener) {
                    if (type === 'change') systemListener = listener;
                }
            };
        }
    }
};
context.window.window = context.window;
context.window.document = context.document;

vm.runInNewContext(fs.readFileSync('assets/js/theme.js', 'utf8'), context, {
    filename: 'assets/js/theme.js'
});

const theme = context.window.Yog1Theme;
assert.strictEqual(documentElement.dataset.colorScheme, 'dark',
    'the saved dark scheme is applied before the main UI loads');
assert.strictEqual(themeColor.content, '#090b0d',
    'dark mode updates the browser theme color');
assert.strictEqual(theme.apply('light'), 'light');
assert.strictEqual(documentElement.dataset.colorScheme, 'light',
    'an explicit light preference overrides the browser');
assert.strictEqual(theme.apply('invalid'), 'auto',
    'invalid preferences safely fall back to automatic');
assert.strictEqual(documentElement.dataset.colorScheme, undefined,
    'automatic mode delegates rendering to prefers-color-scheme');
systemDark = true;
systemListener();
assert.strictEqual(theme.getResolvedScheme(), 'dark');
assert.strictEqual(themeColor.content, '#090b0d',
    'automatic mode tracks browser color-scheme changes');

console.log('Theme preference tests passed.');
