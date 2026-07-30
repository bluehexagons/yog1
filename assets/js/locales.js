(function (root) {
    'use strict';

    // This is the shared source of truth for document metadata, selectors,
    // install manifests, directionality, and the offline asset generator.
    root.Yog1Locales = [
        { id: 'en', tag: 'en', label: 'English', direction: 'ltr' },
        { id: 'es', tag: 'es', label: 'Español', direction: 'ltr' },
        { id: 'de', tag: 'de', label: 'Deutsch', direction: 'ltr' },
        { id: 'fr', tag: 'fr', label: 'Français', direction: 'ltr' },
        { id: 'zh', tag: 'zh-Hans', label: '简体中文', direction: 'ltr' },
        { id: 'zh-Hant', tag: 'zh-Hant', label: '繁體中文', direction: 'ltr' },
        { id: 'ar', tag: 'ar', label: 'العربية', direction: 'rtl' },
        { id: 'bn', tag: 'bn', label: 'বাংলা', direction: 'ltr' },
        { id: 'ja', tag: 'ja', label: '日本語', direction: 'ltr' },
        { id: 'ko', tag: 'ko', label: '한국어', direction: 'ltr' },
        { id: 'hi', tag: 'hi', label: 'हिन्दी', direction: 'ltr' },
        { id: 'pt', tag: 'pt-BR', label: 'Português (Brasil)', direction: 'ltr' },
        { id: 'pl', tag: 'pl', label: 'Polski', direction: 'ltr' },
        { id: 'ru', tag: 'ru', label: 'Русский', direction: 'ltr' },
        { id: 'vi', tag: 'vi', label: 'Tiếng Việt', direction: 'ltr' },
        { id: 'tr', tag: 'tr', label: 'Türkçe', direction: 'ltr' },
        { id: 'ur', tag: 'ur', label: 'اردو', direction: 'rtl' }
    ];

    root.Yog1ResolveLocale = function (value) {
        const requested = String(value || '').trim().replace(/_/g, '-').toLowerCase();
        const exact = root.Yog1Locales.find(function (item) {
            return item.id.toLowerCase() === requested || item.tag.toLowerCase() === requested;
        });
        if (exact) return exact.id;

        const parts = requested.split('-');
        const primary = parts[0];
        if (primary === 'zh') {
            if (parts.length === 1 || parts.includes('hans') ||
                ['cn', 'sg'].includes(parts[1])) return 'zh';
            if (parts.includes('hant') || ['tw', 'hk', 'mo'].includes(parts[1])) {
                return 'zh-Hant';
            }
            return 'en';
        }
        if (primary === 'pt') {
            return parts.length === 1 || parts[1] === 'br' ? 'pt' : 'en';
        }
        return root.Yog1Locales.some(function (item) {
            return item.id === primary;
        }) ? primary : 'en';
    };
}(window));
