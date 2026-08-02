'use strict';

const assert = require('assert');
const gamepad = require('../assets/js/gamepad.js');

let pads = [];
let time = 0;
let enabled = true;
let nextId = 0;
const frames = new Map();
const timers = new Map();
const events = [];
function frame(callback) {
    const id = ++nextId;
    frames.set(id, callback);
    return id;
}
function timer(callback) {
    const id = ++nextId;
    timers.set(id, callback);
    return id;
}
function sample(buttons, axis, index) {
    return {
        index: index || 0,
        connected: true,
        mapping: 'standard',
        buttons: Array.from({ length: 16 }, function (_, index) {
            const pressed = buttons.includes(index);
            return { pressed: pressed, value: pressed ? 1 : 0 };
        }),
        axes: [axis || 0]
    };
}
function tick() {
    const callbacks = Array.from(frames.values());
    frames.clear();
    for (const callback of callbacks) callback(time);
}

const controller = gamepad.create({
    getGamepads: function () { return pads; },
    requestFrame: frame,
    cancelFrame: function (id) { frames.delete(id); },
    setTimer: timer,
    clearTimer: function (id) { timers.delete(id); },
    now: function () { return time; },
    isEnabled: function () { return enabled; },
    onConnected: function () { events.push('connected'); },
    onDisconnected: function () { events.push('disconnected'); },
    onMove: function (direction) { events.push('move:' + direction); },
    onActivate: function () { events.push('activate'); },
    onHint: function () { events.push('hint'); },
    onSubmit: function () { events.push('submit'); }
});

controller.start();
assert.strictEqual(timers.size, 1, 'disconnected discovery uses a low-frequency timer');
pads = [sample([], 0)];
const discovery = Array.from(timers.values())[0];
timers.clear();
discovery();
assert.deepStrictEqual(events, ['connected'], 'a standard gamepad connects without firing an action');

pads = [sample([0], 0)];
tick();
assert.deepStrictEqual(events.slice(-1), ['activate'], 'the bottom face button activates once');
tick();
assert.strictEqual(events.filter(function (event) { return event === 'activate'; }).length, 1,
    'holding an action button does not repeat');
pads = [sample([], 0)];
tick();
pads = [sample([3], 0)];
tick();
assert.strictEqual(events.at(-1), 'hint', 'the top face button requests a hint');
pads = [sample([], 0)];
tick();
pads = [sample([9], 0)];
tick();
assert.strictEqual(events.at(-1), 'submit', 'Start/Menu submits or continues');

pads = [sample([], 0)];
tick();
pads = [sample([], 0.8)];
tick();
assert.strictEqual(events.at(-1), 'move:1', 'the left stick moves the puzzle cursor');
time = 399;
tick();
assert.strictEqual(events.filter(function (event) { return event === 'move:1'; }).length, 1,
    'navigation waits before repeating');
time = 400;
tick();
assert.strictEqual(events.filter(function (event) { return event === 'move:1'; }).length, 2,
    'held navigation repeats at a controlled rate');

enabled = false;
tick();
enabled = true;
time = 1000;
tick();
assert.strictEqual(events.filter(function (event) { return event === 'move:1'; }).length, 2,
    'held navigation cannot move focus when puzzle controls are re-enabled');
pads = [sample([], 0)];
tick();
pads = [sample([], -0.8)];
tick();
assert.strictEqual(events.at(-1), 'move:-1', 'neutral input rearms navigation after a disabled period');

pads = [null, sample([], 0, 1)];
tick();
assert.notStrictEqual(events.at(-1), 'disconnected',
    'a supported replacement gamepad takes over without a false disconnect');
pads = [];
tick();
assert.strictEqual(events.at(-1), 'disconnected', 'active gamepad disconnection is reported');
controller.destroy();
assert.strictEqual(frames.size + timers.size, 0, 'destroy cancels pending work');

console.log('Gamepad input tests passed.');
