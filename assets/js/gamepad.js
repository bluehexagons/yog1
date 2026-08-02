(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    root.Yog1Gamepad = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    function create(options) {
        const getGamepads = options.getGamepads;
        const requestFrame = options.requestFrame;
        const cancelFrame = options.cancelFrame;
        const setTimer = options.setTimer;
        const clearTimer = options.clearTimer;
        const now = options.now;
        let running = false;
        let frameId = null;
        let timerId = null;
        let activeIndex = null;
        let armed = false;
        let previous = { activate: false, hint: false, submit: false };
        let direction = 0;
        let repeatAt = 0;

        function button(pad, index) {
            const value = pad.buttons && pad.buttons[index];
            return !!value && (value.pressed || value.value >= 0.75);
        }

        function horizontalDirection(pad) {
            const left = button(pad, 14);
            const right = button(pad, 15);
            if (left !== right) return left ? -1 : 1;
            const axis = pad.axes && Number.isFinite(pad.axes[0]) ? pad.axes[0] : 0;
            if (direction && Math.abs(axis) > 0.35) return direction;
            if (axis <= -0.65) return -1;
            if (axis >= 0.65) return 1;
            return 0;
        }

        function pads() {
            try {
                return typeof getGamepads === 'function' ? Array.from(getGamepads() || []) : [];
            } catch (error) {
                return [];
            }
        }

        function supportedPad() {
            const available = pads();
            let lostActive = false;
            if (activeIndex !== null) {
                const active = available[activeIndex];
                if (active && active.connected !== false && active.mapping === 'standard') return active;
                activeIndex = null;
                armed = false;
                lostActive = true;
            }
            for (const pad of available) {
                if (pad && pad.connected !== false && pad.mapping === 'standard') {
                    activeIndex = pad.index;
                    armed = false;
                    previous = { activate: false, hint: false, submit: false };
                    direction = 0;
                    if (options.onConnected) options.onConnected();
                    return pad;
                }
            }
            if (lostActive && options.onDisconnected) options.onDisconnected();
            return null;
        }

        function cancelScheduled() {
            if (frameId !== null) cancelFrame(frameId);
            if (timerId !== null) clearTimer(timerId);
            frameId = null;
            timerId = null;
        }

        function schedule(hasPad) {
            if (!running) return;
            cancelScheduled();
            if (hasPad) frameId = requestFrame(poll);
            else timerId = setTimer(poll, 750);
        }

        function poll() {
            frameId = null;
            timerId = null;
            if (!running) return;
            const pad = supportedPad();
            if (!pad) {
                schedule(false);
                return;
            }
            const current = {
                activate: button(pad, 0),
                hint: button(pad, 3),
                submit: button(pad, 9)
            };
            const nextDirection = horizontalDirection(pad);
            const neutral = !current.activate && !current.hint && !current.submit && !nextDirection;
            const enabled = !options.isEnabled || options.isEnabled();
            if (!enabled) {
                armed = false;
            } else if (!armed) {
                if (neutral) armed = true;
            } else {
                const time = now();
                if (nextDirection && nextDirection !== direction) {
                    if (options.onMove) options.onMove(nextDirection);
                    repeatAt = time + 400;
                } else if (nextDirection && time >= repeatAt) {
                    if (options.onMove) options.onMove(nextDirection);
                    repeatAt = time + 140;
                }
                if (current.activate && !previous.activate && options.onActivate) options.onActivate();
                if (current.hint && !previous.hint && options.onHint) options.onHint();
                if (current.submit && !previous.submit && options.onSubmit) options.onSubmit();
            }
            previous = current;
            direction = nextDirection;
            schedule(true);
        }

        function start() {
            if (running) return;
            running = true;
            poll();
        }

        function pause() {
            running = false;
            armed = false;
            cancelScheduled();
        }

        function refresh() {
            if (!running) return;
            cancelScheduled();
            poll();
        }

        return {
            start: start,
            pause: pause,
            resume: start,
            refresh: refresh,
            destroy: pause,
            poll: poll
        };
    }

    return { create: create };
}));
