(function (root) {
    'use strict';

    const STORAGE_KEY = 'yog1.v2.settings';
    const THEME_COLORS = {
        light: '#191919',
        dark: '#090b0d',
        midnight: '#000000',
        sunset: '#17100e',
        pastel: '#c9e9ff'
    };
    const SCHEMES = ['auto'].concat(Object.keys(THEME_COLORS));
    const media = typeof root.matchMedia === 'function'
        ? root.matchMedia('(prefers-color-scheme: dark)')
        : { matches: false };
    let preference = readPreference();

    function readPreference() {
        try {
            const settings = JSON.parse(root.localStorage.getItem(STORAGE_KEY));
            return settings && SCHEMES.includes(settings.colorScheme)
                ? settings.colorScheme : 'auto';
        } catch (error) {
            return 'auto';
        }
    }

    function resolvedScheme() {
        return preference === 'auto' ? (media.matches ? 'dark' : 'light') : preference;
    }

    function apply(nextPreference) {
        preference = SCHEMES.includes(nextPreference) ? nextPreference : 'auto';
        if (preference === 'auto') {
            document.documentElement.removeAttribute('data-color-scheme');
        } else {
            document.documentElement.dataset.colorScheme = preference;
        }
        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) {
            themeColor.content = THEME_COLORS[resolvedScheme()];
        }
        return preference;
    }

    function systemSchemeChanged() {
        if (preference === 'auto') apply(preference);
    }

    if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', systemSchemeChanged);
    } else if (typeof media.addListener === 'function') {
        media.addListener(systemSchemeChanged);
    }

    apply(preference);
    root.Yog1Theme = {
        apply: apply,
        getPreference: function () { return preference; },
        getResolvedScheme: resolvedScheme,
        schemes: SCHEMES.slice()
    };
}(window));
