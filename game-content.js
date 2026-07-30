(function (root) {
    'use strict';

    root.Yog1Content = function (builders) {
        const number = builders.number;
        const binary = builders.binary;
        const squareRoot = builders.squareRoot;
        return {
            curated: [
                {
                    titleKey: 'curated.original',
                    sides: [binary('subtract', number(7, 'c00'), number(2, 'c01')),
                        binary('add', number(3, 'c02', true), number(4, 'c03'))]
                },
                {
                    titleKey: 'curated.product',
                    sides: [binary('multiply', number(6, 'c10'), number(2, 'c11')),
                        binary('subtract', number(13, 'c12'), number(8, 'c13', true))]
                },
                {
                    titleKey: 'curated.root',
                    sides: [binary('modulo', number(25, 'c20'), number(7, 'c21')),
                        binary('add', squareRoot(number(9, 'c22')), number(6, 'c23', true))]
                },
                {
                    titleKey: 'curated.power',
                    sides: [binary('power', number(3, 'c30'), number(2, 'c31')),
                        binary('subtract', number(10, 'c32'), number(8, 'c33', true))]
                },
                {
                    titleKey: 'curated.divide',
                    sides: [binary('divide', number(42, 'c40'), number(6, 'c41')),
                        binary('subtract', number(8, 'c42'), number(5, 'c43', true))]
                },
                {
                    titleKey: 'curated.root',
                    sides: [squareRoot(number(49, 'c50')),
                        binary('subtract', number(8, 'c51'), number(10, 'c52', true))]
                },
                {
                    titleKey: 'curated.power',
                    sides: [binary('power', number(3, 'c60'), number(2, 'c61')),
                        binary('power', number(9, 'c62'), number(2, 'c63', true))]
                },
                {
                    titleKey: 'curated.product',
                    sides: [binary('subtract',
                        binary('multiply', number(6, 'c70'), number(3, 'c71')),
                        number(4, 'c72')),
                    binary('subtract', number(15, 'c73'), number(7, 'c74', true))]
                },
                {
                    titleKey: 'curated.divide',
                    sides: [binary('divide', number(48, 'c80'), number(6, 'c81')),
                        binary('multiply', number(8, 'c82'), number(5, 'c83', true))]
                },
                {
                    titleKey: 'curated.root',
                    sides: [binary('modulo', number(20, 'c90'), number(6, 'c91')),
                        binary('subtract', number(3, 'c92'), number(8, 'c93', true))]
                }
            ],
            achievements: [
                { id: 'first' }, { id: 'streak5' }, { id: 'twenty' }, { id: 'explorer' },
                { id: 'daily' }, { id: 'nohint' }, { id: 'curated' }
            ]
        };
    };
}(window));
