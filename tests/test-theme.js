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
    JSON.stringify({ colorScheme: 'dark', motion: 'reduce' })
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
assert.deepStrictEqual(Array.from(theme.schemes),
    ['auto', 'light', 'dark', 'midnight', 'sunset', 'pastel'],
    'every supported scheme is exposed from one validated list');
assert.strictEqual(documentElement.dataset.colorScheme, 'dark',
    'the saved dark scheme is applied before the main UI loads');
assert.strictEqual(documentElement.dataset.motion, 'reduce',
    'saved reduced motion is applied before the main UI loads');
assert.deepStrictEqual(Array.from(theme.motions), ['auto', 'reduce', 'full'],
    'every motion preference is exposed from one validated list');
assert.strictEqual(theme.applyMotion('full'), 'full');
assert.strictEqual(documentElement.dataset.motion, 'full',
    'full motion can explicitly override the browser preference');
assert.strictEqual(theme.applyMotion('invalid'), 'auto',
    'invalid motion preferences safely fall back to automatic');
assert.strictEqual(themeColor.content, '#090b0d',
    'dark mode updates the browser theme color');
assert.strictEqual(theme.apply('light'), 'light');
assert.strictEqual(documentElement.dataset.colorScheme, 'light',
    'an explicit light preference overrides the browser');
for (const entry of [
    ['midnight', '#000000'],
    ['sunset', '#17100e'],
    ['pastel', '#c9e9ff']
]) {
    assert.strictEqual(theme.apply(entry[0]), entry[0]);
    assert.strictEqual(documentElement.dataset.colorScheme, entry[0],
        entry[0] + ' is applied as an explicit scheme');
    assert.strictEqual(themeColor.content, entry[1],
        entry[0] + ' updates the browser theme color');
}
assert.strictEqual(theme.apply('invalid'), 'auto',
    'invalid preferences safely fall back to automatic');
assert.strictEqual(documentElement.dataset.colorScheme, undefined,
    'automatic mode delegates rendering to prefers-color-scheme');
systemDark = true;
systemListener();
assert.strictEqual(theme.getResolvedScheme(), 'dark');
assert.strictEqual(themeColor.content, '#090b0d',
    'automatic mode tracks browser color-scheme changes');

const css = fs.readFileSync('assets/css/game.css', 'utf8');

function hex(name, key) {
    const prefix = name === 'light' ? '' : name + '-';
    const match = new RegExp('--' + prefix + key + ':\\s*#([0-9a-f]{3,6})', 'i')
        .exec(css);
    assert(match, name + ' defines ' + key);
    return match[1].length === 3
        ? match[1].split('').map(function (value) { return value + value; }).join('')
        : match[1];
}

function luminance(value) {
    const channels = value.match(/../g).map(function (channel) {
        const normalized = parseInt(channel, 16) / 255;
        return normalized <= 0.04045 ? normalized / 12.92 :
            Math.pow((normalized + 0.055) / 1.055, 2.4);
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(left, right) {
    const first = luminance(left);
    const second = luminance(right);
    return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

for (const name of ['light', 'dark', 'midnight', 'sunset', 'pastel']) {
    for (const surface of [
        'menu', 'game', 'paper', 'selected', 'hover', 'inset', 'workspace',
        'soft', 'hint', 'flipped'
    ]) {
        assert(contrast(hex(name, 'ink'), hex(name, surface)) >= 4.5,
            name + ' ink meets WCAG AA on ' + surface);
    }
    for (const pair of [
        ['muted', 'game'], ['muted', 'workspace'], ['green', 'game'],
        ['red', 'game'], ['blue', 'paper'], ['warm', 'paper']
    ]) {
        assert(contrast(hex(name, pair[0]), hex(name, pair[1])) >= 4.5,
            name + ' ' + pair[0] + ' meets WCAG AA on ' + pair[1]);
    }
    for (const surface of ['bg', 'menu', 'game', 'paper', 'workspace']) {
        assert(contrast(hex(name, 'focus'), hex(name, surface)) >= 3,
            name + ' focus indicator contrasts with ' + surface);
    }
}
assert.strictEqual(hex('midnight', 'bg'), '000000',
    'Midnight uses true black for OLED backgrounds');
assert.strictEqual(hex('midnight', 'game'), '000000',
    'Midnight keeps the primary game surface OLED black');
assert(css.includes(':root:not([data-color-scheme])') &&
    !css.includes(':root:not([data-color-scheme="light"])'),
    'the browser preference only controls Automatic and cannot override explicit themes');

const fallbackThemeColor = {};
const fallbackRoot = {
    dataset: {},
    removeAttribute: function () { delete this.dataset.colorScheme; }
};
const fallbackContext = {
    document: {
        documentElement: fallbackRoot,
        querySelector: function () { return fallbackThemeColor; }
    },
    window: {}
};
fallbackContext.window.window = fallbackContext.window;
fallbackContext.window.document = fallbackContext.document;
vm.runInNewContext(fs.readFileSync('assets/js/theme.js', 'utf8'), fallbackContext, {
    filename: 'assets/js/theme.js'
});
assert.strictEqual(fallbackContext.window.Yog1Theme.getResolvedScheme(), 'light',
    'Automatic safely falls back to Light when browser preference APIs are unavailable');
assert.strictEqual(fallbackThemeColor.content, '#191919',
    'the no-API fallback still sets a stable browser theme color');

console.log('Theme preference tests passed.');
