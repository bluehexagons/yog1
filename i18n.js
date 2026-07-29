(function (root) {
    'use strict';

    const STORAGE_KEY = 'yog1.locale.v1';
    // Only complete locales are selectable. Keep in-progress dictionaries here
    // for translators without presenting a mixed-language interface to players.
    const AVAILABLE_LOCALES = ['en', 'es', 'zh', 'ar', 'bn', 'ja', 'hi'];
    const RTL_LOCALES = ['ar'];
    const messages = {
        en: {
            'language.label': 'Language',
            'sidebar.label': 'Sidebar side', 'sidebar.auto': 'Automatic (follow language)', 'sidebar.left': 'Left', 'sidebar.right': 'Right',
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
            'sidebar.label': 'Lado de la barra lateral', 'sidebar.auto': 'Automático (según el idioma)', 'sidebar.left': 'Izquierda', 'sidebar.right': 'Derecha',
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
        },
        zh: {
            'language.label': '语言',
            'sidebar.label': '侧边栏位置', 'sidebar.auto': '自动（跟随语言）', 'sidebar.left': '左侧', 'sidebar.right': '右侧',
            'nav.view': '页面', 'nav.play': '游戏', 'nav.options': '选项', 'nav.stats': '统计', 'nav.mode': '模式',
            'menu.expand': '展开', 'menu.collapse': '收起', 'menu.expandTitle': '展开游戏菜单', 'menu.collapseTitle': '收起游戏菜单',
            'action.menu': '菜单', 'action.reset': '重置', 'action.check': '检查等式', 'action.next': '下一题', 'action.again': '再玩一次',
            'round.tutorial': '教程', 'round.score': '目标 {target} · 分数 {score}', 'flip.one': '次翻转剩余', 'flip.many': '次翻转剩余',
            'session.solved': '已解决', 'session.accuracy': '正确率', 'session.average': '平均', 'session.hardest': '最高难度',
            'timer.seconds': '{seconds}秒', 'history.empty': '尚无保存的题目。',
            'history.page': '第 {page}/{pages} 页 · 已保存 {count}/{limit}', 'history.correct': '正确', 'history.incorrect': '错误', 'history.round': '第 {round} 轮',
            'mode.operations': '运算：{operations}', 'mode.baseLength': '基础长度：{min}–{max}',
            'confirm.clearHistory': '清除所有本地保存的题目历史吗？', 'confirm.resetStat': '重置 {mode} 的统计数据吗？',
            'confirm.resetAll': '重置所有模式的统计数据吗？', 'aria.resetStat': '重置 {mode} 的统计数据'
        },
        ar: {
            'language.label': 'اللغة', 'sidebar.label': 'موضع الشريط الجانبي',
            'sidebar.auto': 'تلقائي (حسب اللغة)', 'sidebar.left': 'اليسار', 'sidebar.right': 'اليمين',
            'nav.view': 'الصفحة', 'nav.play': 'العب', 'nav.options': 'الخيارات', 'nav.stats': 'الإحصاءات', 'nav.mode': 'النمط',
            'menu.expand': 'توسيع', 'menu.collapse': 'طي', 'menu.expandTitle': 'توسيع قائمة اللعبة', 'menu.collapseTitle': 'طي قائمة اللعبة',
            'action.menu': 'القائمة', 'action.reset': 'إعادة ضبط', 'action.check': 'تحقق من المعادلة', 'action.next': 'المسألة التالية', 'action.again': 'العب مجددًا',
            'round.tutorial': 'البرنامج التعليمي', 'round.score': 'الهدف {target} · النتيجة {score}', 'flip.one': 'قلبة متبقية', 'flip.many': 'قلبات متبقية',
            'session.solved': 'محلول', 'session.accuracy': 'الدقة', 'session.average': 'المتوسط', 'session.hardest': 'الأصعب',
            'timer.seconds': '{seconds}ث', 'history.empty': 'لا توجد مسائل محفوظة بعد.', 'history.page': 'الصفحة {page} من {pages} · {count}/{limit} محفوظة',
            'history.correct': 'صحيح', 'history.incorrect': 'غير صحيح', 'history.round': 'الجولة {round}',
            'mode.operations': 'العمليات: {operations}', 'mode.baseLength': 'الطول الأساسي: {min}–{max}',
            'confirm.clearHistory': 'هل تريد مسح كل محفوظات المسائل المحلية؟', 'confirm.resetStat': 'هل تريد إعادة ضبط إحصاءات {mode}؟',
            'confirm.resetAll': 'هل تريد إعادة ضبط إحصاءات كل الأنماط؟', 'aria.resetStat': 'إعادة ضبط إحصاءات {mode}'
        },
        bn: {
            'language.label': 'ভাষা', 'sidebar.label': 'সাইডবারের দিক', 'sidebar.auto': 'স্বয়ংক্রিয় (ভাষা অনুযায়ী)', 'sidebar.left': 'বাম', 'sidebar.right': 'ডান',
            'nav.view': 'পৃষ্ঠা', 'nav.play': 'খেলুন', 'nav.options': 'বিকল্প', 'nav.stats': 'পরিসংখ্যান', 'nav.mode': 'মোড',
            'menu.expand': 'প্রসারিত করুন', 'menu.collapse': 'সংকুচিত করুন', 'action.menu': 'মেনু', 'action.reset': 'রিসেট',
            'action.check': 'সমীকরণ পরীক্ষা করুন', 'action.next': 'পরের প্রশ্ন', 'action.again': 'আবার খেলুন',
            'round.tutorial': 'টিউটোরিয়াল', 'round.score': 'লক্ষ্য {target} · স্কোর {score}', 'flip.one': 'ফ্লিপ বাকি', 'flip.many': 'ফ্লিপ বাকি',
            'session.solved': 'সমাধান', 'session.accuracy': 'নির্ভুলতা', 'session.average': 'গড়', 'session.hardest': 'সবচেয়ে কঠিন',
            'timer.seconds': '{seconds}সে', 'history.empty': 'এখনও কোনো প্রশ্ন সংরক্ষিত নেই।', 'history.page': 'পৃষ্ঠা {page}/{pages} · {count}/{limit} সংরক্ষিত',
            'history.correct': 'সঠিক', 'history.incorrect': 'ভুল', 'history.round': 'রাউন্ড {round}',
            'mode.operations': 'ক্রিয়া: {operations}', 'mode.baseLength': 'মূল দৈর্ঘ্য: {min}–{max}',
            'confirm.clearHistory': 'সব স্থানীয় প্রশ্নের ইতিহাস মুছবেন?', 'confirm.resetStat': '{mode} এর পরিসংখ্যান রিসেট করবেন?', 'confirm.resetAll': 'সব মোডের পরিসংখ্যান রিসেট করবেন?', 'aria.resetStat': '{mode} এর পরিসংখ্যান রিসেট করুন'
        },
        ja: {
            'language.label': '言語', 'sidebar.label': 'サイドバーの位置', 'sidebar.auto': '自動（言語に従う）', 'sidebar.left': '左', 'sidebar.right': '右',
            'nav.view': '画面', 'nav.play': 'プレイ', 'nav.options': 'オプション', 'nav.stats': '統計', 'nav.mode': 'モード',
            'menu.expand': '展開', 'menu.collapse': '折りたたむ', 'action.menu': 'メニュー', 'action.reset': 'リセット',
            'action.check': '式を確認', 'action.next': '次の問題', 'action.again': 'もう一度プレイ',
            'round.tutorial': 'チュートリアル', 'round.score': '目標 {target} · スコア {score}', 'flip.one': '回の反転が残り', 'flip.many': '回の反転が残り',
            'session.solved': '解答済み', 'session.accuracy': '正答率', 'session.average': '平均', 'session.hardest': '最高難度',
            'timer.seconds': '{seconds}秒', 'history.empty': '保存された問題はありません。', 'history.page': '{page}/{pages} ページ · {count}/{limit} 件を保存',
            'history.correct': '正解', 'history.incorrect': '不正解', 'history.round': 'ラウンド {round}',
            'mode.operations': '演算：{operations}', 'mode.baseLength': '基本の長さ：{min}～{max}',
            'confirm.clearHistory': 'ローカルに保存した問題履歴をすべて消去しますか？', 'confirm.resetStat': '{mode} の統計をリセットしますか？', 'confirm.resetAll': 'すべてのモードの統計をリセットしますか？', 'aria.resetStat': '{mode} の統計をリセット'
        },
        hi: {
            'language.label': 'भाषा', 'sidebar.label': 'साइडबार की स्थिति', 'sidebar.auto': 'स्वचालित (भाषा के अनुसार)', 'sidebar.left': 'बायाँ', 'sidebar.right': 'दायाँ',
            'nav.view': 'स्क्रीन', 'nav.play': 'खेलें', 'nav.options': 'विकल्प', 'nav.stats': 'आँकड़े', 'nav.mode': 'मोड',
            'menu.expand': 'खोलें', 'menu.collapse': 'समेटें', 'action.menu': 'मेनू', 'action.reset': 'रीसेट',
            'action.check': 'समीकरण जाँचें', 'action.next': 'अगली पहेली', 'action.again': 'फिर खेलें',
            'round.tutorial': 'ट्यूटोरियल', 'round.score': 'लक्ष्य {target} · स्कोर {score}', 'flip.one': 'फ्लिप बाकी', 'flip.many': 'फ्लिप बाकी',
            'session.solved': 'हल किए', 'session.accuracy': 'सटीकता', 'session.average': 'औसत', 'session.hardest': 'सबसे कठिन',
            'timer.seconds': '{seconds}से', 'history.empty': 'अभी तक कोई पहेली सहेजी नहीं गई है।', 'history.page': 'पृष्ठ {page}/{pages} · {count}/{limit} सहेजी गई',
            'history.correct': 'सही', 'history.incorrect': 'गलत', 'history.round': 'राउंड {round}',
            'mode.operations': 'क्रियाएँ: {operations}', 'mode.baseLength': 'आधार लंबाई: {min}–{max}',
            'confirm.clearHistory': 'सभी स्थानीय पहेली इतिहास मिटाएँ?', 'confirm.resetStat': '{mode} के आँकड़े रीसेट करें?', 'confirm.resetAll': 'सभी मोड के आँकड़े रीसेट करें?', 'aria.resetStat': '{mode} के आँकड़े रीसेट करें'
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
        },
        zh: {
            'One move. Make it count.': '一步到位。认真思考。',
            'Round ': '第 ', 'Warm-up': '热身', 'Standard': '标准', 'Challenge': '挑战', 'Guided': '引导',
            'Tutorial': '教程', 'Easy': '简单', 'Normal': '普通', 'Hard': '困难', 'Expert': '专家', 'Extreme': '极限',
            'Daily': '每日', 'Timed': '限时', 'Endless': '无尽', 'Challenges': '挑战', 'Custom…': '自定义…',
            'Options': '选项', 'Stats': '统计', 'Play': '游戏', 'Mode': '模式', 'View': '页面',
            'How to play': '玩法说明', 'Your move': '你的操作', 'Hint': '提示', 'Reveal': '揭晓', 'Share': '分享',
            'Difficulty guide': '难度说明', 'Accessibility & sound': '无障碍与声音', 'Stats & history': '统计与历史',
            'Stats by difficulty': '按难度统计', 'Problem history': '题目历史', 'Achievements': '成就',
            'Previous': '上一页', 'Next': '下一页', 'Clear history': '清除历史', 'Reset all stats': '重置所有统计数据',
            'Waveform sound effects (off by default)': '波形音效（默认关闭）', 'Larger text': '更大文字', 'Higher contrast': '更高对比度',
            'Reduced clutter': '减少干扰', 'Install offline app': '安装离线应用',
            'Three values only; small + and − puzzles.': '只有三个数值；小型加减题。',
            'Compact puzzles; adds × and frequent three-value rounds.': '紧凑题目；加入 ×，并经常出现三个数值的回合。',
            'Compact puzzles; adds integer ÷ and some three-value rounds.': '紧凑题目；加入整数 ÷，并有一些三个数值的回合。',
            'Adds modulus % and powers ^, with occasional three-value rounds.': '加入取模 % 和幂 ^，偶尔有三个数值的回合。',
            'Largest values and every operation, including √, in the longest puzzles.': '数值最大、包含所有运算（包括 √）的最长题目。',
            'Three-number addition and subtraction with small positive integers.': '用较小正整数进行三数加减。',
            'Compact expressions that introduce multiplication, with frequent three-number warm-ups.': '加入乘法的紧凑表达式，并经常有三数热身题。',
            'Compact expressions with integer (whole-quotient) division and some three-number rounds.': '使用整除的紧凑表达式，并有一些三数回合。',
            'Adds remainders and powers, while retaining occasional three-number rounds.': '加入余数和幂，同时保留偶尔的三数回合。',
            'Every operation, including roots, in the longest expressions.': '最长表达式中包含所有运算，包括平方根。',
            'Change exactly one number into a 1 so both sides have the same integer value.': '将恰好一个数字改为 1，使等式两边得到相同的整数值。',
            'Change one number, then check the equation.': '改变一个数字，然后检查等式。',
            'A difficulty spike—take your time.': '难度会提高——慢慢来。',
            'Both sides balance. Review the solution, then continue.': '等式两边相等。查看解法后继续。',
            'Not balanced—retry': '尚未平衡——再试一次', 'Solution revealed': '已揭晓解法',
            'This puzzle counts as incorrect. Review it, then continue.': '此题计为错误。查看后继续。',
            'Correct': '正确', 'Incorrect': '错误', 'Copied': '已复制',
            'Build a custom game': '创建自定义游戏', 'Choose the rules, then start the run. A seed makes it reproducible.': '选择规则，然后开始游戏。种子可使题目可复现。',
            'Check the targets': '检查目标', 'The minimum target cannot exceed the maximum.': '最小目标不能超过最大目标。'
        },
        ar: {
            'One move. Make it count.': 'حركة واحدة. اجعلها مؤثرة.', 'Round ': 'الجولة ', 'Warm-up': 'إحماء', 'Standard': 'عادي', 'Challenge': 'تحدٍ', 'Guided': 'إرشادي',
            'Tutorial': 'البرنامج التعليمي', 'Easy': 'سهل', 'Normal': 'عادي', 'Hard': 'صعب', 'Expert': 'خبير', 'Extreme': 'متطرف',
            'Daily': 'يومي', 'Timed': 'مؤقت', 'Endless': 'لا نهائي', 'Challenges': 'تحديات', 'Custom…': 'مخصص…',
            'Options': 'الخيارات', 'Stats': 'الإحصاءات', 'Play': 'العب', 'Mode': 'النمط', 'View': 'الصفحة',
            'How to play': 'طريقة اللعب', 'Your move': 'حركتك', 'Hint': 'تلميح', 'Reveal': 'إظهار', 'Share': 'مشاركة',
            'Difficulty guide': 'دليل الصعوبة', 'Accessibility & sound': 'إتاحة وصوت', 'Stats & history': 'الإحصاءات والسجل',
            'Stats by difficulty': 'إحصاءات حسب الصعوبة', 'Problem history': 'سجل المسائل', 'Achievements': 'الإنجازات',
            'Previous': 'السابق', 'Next': 'التالي', 'Clear history': 'مسح السجل', 'Reset all stats': 'إعادة ضبط كل الإحصاءات',
            'Waveform sound effects (off by default)': 'مؤثرات صوتية موجية (متوقفة افتراضيًا)', 'Larger text': 'نص أكبر',
            'Higher contrast': 'تباين أعلى', 'Reduced clutter': 'تقليل التشتيت', 'Install offline app': 'تثبيت تطبيق دون اتصال',
            'Three values only; small + and − puzzles.': 'ثلاث قيم فقط؛ مسائل جمع وطرح صغيرة.',
            'Compact puzzles; adds × and frequent three-value rounds.': 'مسائل مدمجة؛ تضيف × وجولات متكررة من ثلاث قيم.',
            'Compact puzzles; adds integer ÷ and some three-value rounds.': 'مسائل مدمجة؛ تضيف ÷ الصحيحة وبعض جولات ثلاث قيم.',
            'Adds modulus % and powers ^, with occasional three-value rounds.': 'تضيف الباقي % والأسس ^ مع جولات عرضية من ثلاث قيم.',
            'Largest values and every operation, including √, in the longest puzzles.': 'أكبر القيم وكل العمليات، بما فيها √، في أطول المسائل.',
            'Three-number addition and subtraction with small positive integers.': 'جمع وطرح بثلاثة أعداد صحيحة موجبة صغيرة.',
            'Compact expressions that introduce multiplication, with frequent three-number warm-ups.': 'تعبيرات مدمجة تقدم الضرب مع إحماءات متكررة بثلاثة أعداد.',
            'Compact expressions with integer (whole-quotient) division and some three-number rounds.': 'تعبيرات مدمجة بقسمة صحيحة وبعض جولات ثلاثة أعداد.',
            'Adds remainders and powers, while retaining occasional three-number rounds.': 'تضيف البواقي والأسس مع الاحتفاظ بجولات عرضية من ثلاثة أعداد.',
            'Every operation, including roots, in the longest expressions.': 'كل العمليات، بما فيها الجذور، في أطول التعبيرات.',
            'Change exactly one number into a 1 so both sides have the same integer value.': 'غيّر رقمًا واحدًا بالضبط إلى 1 ليصبح للطرفين نفس القيمة الصحيحة.',
            'Change one number, then check the equation.': 'غيّر رقمًا واحدًا ثم تحقق من المعادلة.', 'A difficulty spike—take your time.': 'قفزة في الصعوبة—خذ وقتك.',
            'Both sides balance. Review the solution, then continue.': 'الطرفان متساويان. راجع الحل ثم تابع.', 'Not balanced—retry': 'غير متوازن—حاول ثانيةً',
            'Solution revealed': 'تم إظهار الحل', 'This puzzle counts as incorrect. Review it, then continue.': 'تُحسب هذه المسألة غير صحيحة. راجعها ثم تابع.',
            'Correct': 'صحيح', 'Incorrect': 'غير صحيح', 'Copied': 'تم النسخ', 'Build a custom game': 'أنشئ لعبة مخصصة',
            'Choose the rules, then start the run. A seed makes it reproducible.': 'اختر القواعد ثم ابدأ. تجعل البذرة اللعبة قابلة للتكرار.'
        },
        bn: {
            'One move. Make it count.': 'একটি চাল। সেটি গুরুত্বপূর্ণ করুন।', 'Round ': 'রাউন্ড ', 'Warm-up': 'ওয়ার্ম-আপ', 'Standard': 'সাধারণ', 'Challenge': 'চ্যালেঞ্জ',
            'Tutorial': 'টিউটোরিয়াল', 'Easy': 'সহজ', 'Normal': 'সাধারণ', 'Hard': 'কঠিন', 'Expert': 'বিশেষজ্ঞ', 'Extreme': 'চরম',
            'Daily': 'দৈনিক', 'Timed': 'সময়সীমা', 'Endless': 'অন্তহীন', 'Challenges': 'চ্যালেঞ্জ', 'Custom…': 'কাস্টম…',
            'Options': 'বিকল্প', 'Stats': 'পরিসংখ্যান', 'Play': 'খেলুন', 'Mode': 'মোড', 'View': 'পৃষ্ঠা',
            'How to play': 'কীভাবে খেলবেন', 'Your move': 'আপনার চাল', 'Hint': 'ইঙ্গিত', 'Reveal': 'দেখান', 'Share': 'শেয়ার করুন',
            'Difficulty guide': 'কঠিনতার নির্দেশিকা', 'Accessibility & sound': 'সহায়ক সুবিধা ও শব্দ', 'Stats & history': 'পরিসংখ্যান ও ইতিহাস',
            'Stats by difficulty': 'কঠিনতা অনুযায়ী পরিসংখ্যান', 'Problem history': 'প্রশ্নের ইতিহাস', 'Achievements': 'অর্জন',
            'Previous': 'আগের', 'Next': 'পরের', 'Clear history': 'ইতিহাস মুছুন', 'Reset all stats': 'সব পরিসংখ্যান রিসেট করুন'
        },
        ja: {
            'One move. Make it count.': '一手に集中しよう。', 'Round ': 'ラウンド ', 'Warm-up': 'ウォームアップ', 'Standard': '標準', 'Challenge': 'チャレンジ',
            'Tutorial': 'チュートリアル', 'Easy': 'かんたん', 'Normal': 'ふつう', 'Hard': 'むずかしい', 'Expert': 'エキスパート', 'Extreme': 'エクストリーム',
            'Daily': 'デイリー', 'Timed': 'タイムアタック', 'Endless': 'エンドレス', 'Challenges': 'チャレンジ', 'Custom…': 'カスタム…',
            'Options': 'オプション', 'Stats': '統計', 'Play': 'プレイ', 'Mode': 'モード', 'View': '画面',
            'How to play': '遊び方', 'Your move': 'あなたの手番', 'Hint': 'ヒント', 'Reveal': '答えを見る', 'Share': '共有',
            'Difficulty guide': '難易度ガイド', 'Accessibility & sound': 'アクセシビリティとサウンド', 'Stats & history': '統計と履歴',
            'Stats by difficulty': '難易度別の統計', 'Problem history': '問題履歴', 'Achievements': '実績',
            'Previous': '前へ', 'Next': '次へ', 'Clear history': '履歴を消去', 'Reset all stats': 'すべての統計をリセット'
        },
        hi: {
            'One move. Make it count.': 'एक चाल। उसे सार्थक बनाएँ।', 'Round ': 'राउंड ', 'Warm-up': 'वार्म-अप', 'Standard': 'सामान्य', 'Challenge': 'चुनौती',
            'Tutorial': 'ट्यूटोरियल', 'Easy': 'आसान', 'Normal': 'सामान्य', 'Hard': 'कठिन', 'Expert': 'विशेषज्ञ', 'Extreme': 'अत्यंत कठिन',
            'Daily': 'दैनिक', 'Timed': 'समयबद्ध', 'Endless': 'अंतहीन', 'Challenges': 'चुनौतियाँ', 'Custom…': 'कस्टम…',
            'Options': 'विकल्प', 'Stats': 'आँकड़े', 'Play': 'खेलें', 'Mode': 'मोड', 'View': 'स्क्रीन',
            'How to play': 'कैसे खेलें', 'Your move': 'आपकी चाल', 'Hint': 'संकेत', 'Reveal': 'हल दिखाएँ', 'Share': 'साझा करें',
            'Difficulty guide': 'कठिनाई गाइड', 'Accessibility & sound': 'सुगम्यता और ध्वनि', 'Stats & history': 'आँकड़े और इतिहास',
            'Stats by difficulty': 'कठिनाई के अनुसार आँकड़े', 'Problem history': 'पहेली इतिहास', 'Achievements': 'उपलब्धियाँ',
            'Previous': 'पिछला', 'Next': 'अगला', 'Clear history': 'इतिहास मिटाएँ', 'Reset all stats': 'सभी आँकड़े रीसेट करें'
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
        document.documentElement.dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
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
        availableLocales: AVAILABLE_LOCALES,
        getDirection: function () { return RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr'; }
    };
}(window));
