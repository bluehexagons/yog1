(function (root) {
    'use strict';

    const STORAGE_KEY = 'yog1.locale.v1';
    // Only complete locales are selectable. Keep in-progress dictionaries here
    // for translators without presenting a mixed-language interface to players.
    const AVAILABLE_LOCALES = ['en', 'es'];
    const messages = {
        en: {
            'language.label': 'Language',
            'nav.view': 'View', 'nav.play': 'Play', 'nav.options': 'Options', 'nav.stats': 'Stats', 'nav.mode': 'Mode',
            'menu.expand': 'Expand', 'menu.collapse': 'Collapse', 'menu.expandTitle': 'Expand game menu',
            'menu.collapseTitle': 'Collapse game menu',
            'action.menu': 'Menu', 'action.reset': 'Reset', 'action.check': 'Check equation',
            'action.next': 'Next puzzle', 'action.again': 'Play again',
            'round.tutorial': 'Tutorial', 'round.score': 'Target {target} · score {score}',
            'flip.one': 'flip remaining', 'flip.many': 'flips remaining',
            'session.solved': 'solved', 'session.accuracy': 'accuracy', 'session.average': 'average',
            'session.hardest': 'hardest', 'timer.seconds': '{seconds}s',
            'history.empty': 'No saved problems yet.', 'history.page': 'Page {page} of {pages} · {count}/{limit} saved',
            'history.correct': 'Correct', 'history.incorrect': 'Incorrect', 'history.round': 'round {round}',
            'mode.operations': 'Operations: {operations}', 'mode.baseLength': 'Base length: {min}–{max}',
            'confirm.clearHistory': 'Clear all locally saved problem history?',
            'confirm.resetStat': 'Reset stats for {mode}?', 'confirm.resetAll': 'Reset stats for every mode?',
            'aria.resetStat': 'Reset {mode} stats'
        },
        es: {
            'language.label': 'Idioma',
            'nav.view': 'Vista', 'nav.play': 'Jugar', 'nav.options': 'Opciones', 'nav.stats': 'Estadísticas', 'nav.mode': 'Modo',
            'menu.expand': 'Expandir', 'menu.collapse': 'Contraer', 'menu.expandTitle': 'Expandir el menú del juego',
            'menu.collapseTitle': 'Contraer el menú del juego', 'action.menu': 'Menú', 'action.reset': 'Restablecer',
            'action.check': 'Comprobar ecuación', 'action.next': 'Siguiente problema', 'action.again': 'Jugar de nuevo',
            'round.tutorial': 'Tutorial', 'round.score': 'Objetivo {target} · puntuación {score}',
            'flip.one': 'cambio restante', 'flip.many': 'cambios restantes',
            'session.solved': 'resueltos', 'session.accuracy': 'precisión', 'session.average': 'media', 'session.hardest': 'máximo',
            'timer.seconds': '{seconds}s', 'history.empty': 'Aún no hay problemas guardados.',
            'history.page': 'Página {page} de {pages} · {count}/{limit} guardados',
            'history.correct': 'Correcto', 'history.incorrect': 'Incorrecto', 'history.round': 'ronda {round}',
            'mode.operations': 'Operaciones: {operations}', 'mode.baseLength': 'Longitud base: {min}–{max}',
            'confirm.clearHistory': '¿Borrar todo el historial guardado localmente?',
            'confirm.resetStat': '¿Restablecer las estadísticas de {mode}?', 'confirm.resetAll': '¿Restablecer las estadísticas de todos los modos?',
            'aria.resetStat': 'Restablecer las estadísticas de {mode}'
        }
    };

    function supported(locale) {
        return AVAILABLE_LOCALES.includes(locale) ? locale : 'en';
    }

    function initialLocale() {
        const requested = new URLSearchParams(window.location.search).get('lang');
        if (requested) return supported(requested.toLowerCase().split('-')[0]);
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return supported(saved);
        } catch (error) {}
        return supported((navigator.language || 'en').toLowerCase().split('-')[0]);
    }

    let locale = initialLocale();

    const sourceTexts = {
        es: {
            'One move. Make it count.': 'Un movimiento. Haz que cuente.',
            'Round ': 'Ronda ', 'Warm-up': 'Calentamiento', 'Standard': 'Estándar', 'Challenge': 'Desafío', 'Guided': 'Guiado',
            'Tutorial': 'Tutorial', 'Easy': 'Fácil', 'Normal': 'Normal', 'Hard': 'Difícil', 'Expert': 'Experto', 'Extreme': 'Extremo',
            'Daily': 'Diario', 'Timed': 'Contrarreloj', 'Endless': 'Infinito', 'Challenges': 'Desafíos', 'Custom…': 'Personalizado…',
            'Options': 'Opciones', 'Stats': 'Estadísticas', 'Play': 'Jugar', 'Mode': 'Modo', 'View': 'Vista',
            'How to play': 'Cómo jugar', 'Your move': 'Tu movimiento', 'Hint': 'Pista', 'Reveal': 'Revelar', 'Share': 'Compartir',
            'Difficulty guide': 'Guía de dificultad', 'Accessibility & sound': 'Accesibilidad y sonido',
            'Stats & history': 'Estadísticas e historial', 'Stats by difficulty': 'Estadísticas por dificultad',
            'Problem history': 'Historial de problemas', 'Achievements': 'Logros', 'Previous': 'Anterior', 'Next': 'Siguiente',
            'Clear history': 'Borrar historial', 'Reset all stats': 'Restablecer todas las estadísticas',
            'Waveform sound effects (off by default)': 'Efectos de sonido de onda (desactivados de forma predeterminada)',
            'Larger text': 'Texto más grande', 'Higher contrast': 'Mayor contraste', 'Reduced clutter': 'Interfaz simplificada',
            'Install offline app': 'Instalar aplicación sin conexión', 'Operations': 'Operaciones', 'Start custom game': 'Iniciar juego personalizado',
            'Three values only; small + and − puzzles.': 'Solo tres valores; problemas pequeños de + y −.',
            'Compact puzzles; adds × and frequent three-value rounds.': 'Problemas compactos; añade × y frecuentes rondas de tres valores.',
            'Compact puzzles; adds integer ÷ and some three-value rounds.': 'Problemas compactos; añade ÷ entera y algunas rondas de tres valores.',
            'Adds modulus % and powers ^, with occasional three-value rounds.': 'Añade módulo % y potencias ^, con rondas ocasionales de tres valores.',
            'Largest values and every operation, including √, in the longest puzzles.': 'Valores mayores y todas las operaciones, incluida √, en los problemas más largos.',
            'Current session statistics': 'Estadísticas de la sesión actual',
            'Correct': 'Correcto', 'Incorrect': 'Incorrecto', 'Win rate': 'Porcentaje de aciertos', 'Streak': 'Racha', 'Record': 'Récord', 'Actions': 'Acciones',
            'Three-number addition and subtraction with small positive integers.': 'Sumas y restas de tres números con enteros positivos pequeños.',
            'Compact expressions that introduce multiplication, with frequent three-number warm-ups.': 'Expresiones compactas con multiplicación y frecuentes rondas de tres números.',
            'Compact expressions with integer (whole-quotient) division and some three-number rounds.': 'Expresiones compactas con división entera y algunas rondas de tres números.',
            'Adds remainders and powers, while retaining occasional three-number rounds.': 'Añade restos y potencias, conservando algunas rondas de tres números.',
            'Every operation, including roots, in the longest expressions.': 'Todas las operaciones, incluidas las raíces, en las expresiones más largas.',
            'Change exactly one number into a 1 so both sides have the same integer value.': 'Cambia exactamente un número por un 1 para que ambos lados tengan el mismo valor entero.',
            'Everyone gets this same seeded puzzle today. Solve it and share your result.': 'Hoy todos reciben este mismo problema generado. Resuélvelo y comparte tu resultado.',
            'Solve as many puzzles as you can before the 60-second clock reaches zero.': 'Resuelve tantos problemas como puedas antes de que el reloj de 60 segundos llegue a cero.',
            'Keep solving as difficulty rises. An incorrect first guess costs one of three lives.': 'Sigue resolviendo mientras aumenta la dificultad. Un primer intento incorrecto cuesta una de tres vidas.',
            'A difficulty spike—take your time.': 'Un aumento de dificultad; tómate tu tiempo.',
            'Change one number, then check the equation.': 'Cambia un número y después comprueba la ecuación.',
            'Both sides balance. Review the solution, then continue.': 'Ambos lados coinciden. Revisa la solución y continúa.',
            'The totals differed. The same puzzle is still here, and your move has been restored.': 'Los totales son distintos. El mismo problema sigue aquí y se ha restaurado tu movimiento.',
            'Copied': 'Copiado', 'The puzzle link and result are ready to paste.': 'El enlace y el resultado están listos para pegar.',
            'Build a custom game': 'Crea un juego personalizado', 'Choose the rules, then start the run. A seed makes it reproducible.': 'Elige las reglas y comienza la partida. Una semilla la hace reproducible.',
            'Choose an operation': 'Elige una operación', 'Custom games need at least one mathematical operation.': 'Los juegos personalizados necesitan al menos una operación matemática.',
            'Check the targets': 'Comprueba los objetivos', 'The minimum target cannot exceed the maximum.': 'El objetivo mínimo no puede superar el máximo.',
            'Solution revealed': 'Solución revelada', 'This puzzle counts as incorrect. Review it, then continue.': 'Este problema cuenta como incorrecto. Revísalo y continúa.',
            'Daily complete': 'Diario completado', 'Challenge set complete': 'Serie de desafíos completada', 'Not balanced—retry': 'No está equilibrado; inténtalo de nuevo',
            'Run over': 'Fin de la partida', 'Time!': '¡Tiempo!', 'Achievement unlocked: ': 'Logro desbloqueado: '
            , 'Good move': 'Buen movimiento', 'Try the outlined number': 'Prueba el número resaltado',
            'The equation balances. Check it to finish.': 'La ecuación está equilibrada. Compruébala para terminar.',
            'Click the selected number again to restore it.': 'Haz clic de nuevo en el número seleccionado para restaurarlo.',
            'Tutorial complete': 'Tutorial completado', 'Your first Easy round is ready.': 'Tu primera ronda Fácil está lista.',
            'Not quite': 'Aún no', 'Try changing the outlined 3, then check again.': 'Cambia el 3 resaltado y vuelve a comprobar.',
            'Hint: choose a side': 'Pista: elige un lado', 'Hint: the number': 'Pista: el número',
            'The outlined side contains the intended flip.': 'El lado resaltado contiene el cambio previsto.',
            'The outlined number is the one used by the generated solution.': 'El número resaltado es el que usa la solución generada.',
            'Daily solution revealed': 'Solución diaria revelada', 'The shared result records this as a reveal.': 'El resultado compartido lo registra como revelado.',
            'Choose an identity operation': 'Elige una operación de identidad',
            'Include +, −, ×, ÷, or powers so the one-flip solution can use only your selected operations.': 'Incluye +, −, ×, ÷ o potencias para que la solución de un cambio use solo las operaciones elegidas.',
            'Shared handcrafted puzzle': 'Problema artesanal compartido', 'Shared custom puzzle': 'Problema personalizado compartido',
            'Shared seeded puzzle': 'Problema generado compartido'
        }
    };

    function translate(value) {
        if (typeof value !== 'string') return value;
        return (sourceTexts[locale] && sourceTexts[locale][value]) || value;
    }

    function t(key, values) {
        const template = (messages[locale] && messages[locale][key]) || messages.en[key] || key;
        return template.replace(/\{(\w+)\}/g, function (_, name) {
            return values && values[name] !== undefined ? values[name] : '{' + name + '}';
        });
    }

    function apply(rootElement) {
        const scope = rootElement || document;
        for (const element of scope.querySelectorAll('[data-i18n]')) element.textContent = t(element.dataset.i18n);
        for (const element of scope.querySelectorAll('[data-i18n-aria-label]')) {
            element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
        }
        for (const element of scope.querySelectorAll('[data-i18n-title]')) element.title = t(element.dataset.i18nTitle);
        for (const element of scope.querySelectorAll('[data-localize]')) {
            if (!element.dataset.sourceText) element.dataset.sourceText = element.textContent;
            element.textContent = translate(element.dataset.sourceText);
        }
        document.documentElement.lang = locale;
    }

    function setLocale(nextLocale) {
        const previous = locale;
        locale = supported(nextLocale);
        try { localStorage.setItem(STORAGE_KEY, locale); } catch (error) {}
        apply();
        if (locale !== previous && typeof root.CustomEvent === 'function' && root.dispatchEvent) {
            root.dispatchEvent(new root.CustomEvent('yog1localechange'));
        }
    }

    root.Yog1I18n = {
        apply: apply,
        getLocale: function () { return locale; },
        setLocale: setLocale,
        t: t,
        translate: translate,
        locales: messages,
        availableLocales: AVAILABLE_LOCALES
    };
}(window));
