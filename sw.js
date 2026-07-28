'use strict';

const CACHE = 'yog1-v3';
const FILES = [
    './yog1.htm',
    './game-core.js',
    './game.js',
    './manifest.webmanifest',
    './icon.svg',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', function (event) {
    event.waitUntil(caches.open(CACHE).then(function (cache) {
        return cache.addAll(FILES);
    }));
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(caches.keys().then(function (keys) {
        return Promise.all(keys.filter(function (key) {
            return key !== CACHE;
        }).map(function (key) {
            return caches.delete(key);
        }));
    }));
    self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    if (event.request.method !== 'GET') return;
    event.respondWith(caches.match(event.request).then(function (cached) {
        return cached || fetch(event.request).then(function (response) {
            const copy = response.clone();
            caches.open(CACHE).then(function (cache) {
                cache.put(event.request, copy);
            });
            return response;
        });
    }));
});
