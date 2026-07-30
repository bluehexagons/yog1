(function (root, document) {
    'use strict';

    const STORAGE_KEY = 'yog1.v2.locale';
    const requested = new URLSearchParams(root.location.search).get('lang');
    let preferred = requested;
    if (!preferred) {
        try {
            preferred = root.localStorage.getItem(STORAGE_KEY);
        } catch (error) {}
    }
    if (!preferred) preferred = root.navigator.language || 'en';

    const locale = root.Yog1ResolveLocale(preferred);
    if (locale === 'en') return;

    // This script runs while the document is still being parsed, ensuring the
    // selected catalog is available before the game initializes. Other
    // catalogs are fetched only if the player selects them later.
    document.write('<script src="translations/' +
        encodeURIComponent(locale) + '.js"><\/script>');
}(window, document));
