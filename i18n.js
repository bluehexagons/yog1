(function (root) {
    'use strict';

    const STORAGE_KEY = 'yog1.locale.v1';
    // Internal IDs stay short for backwards-compatible links and storage.
    // Language tags and autonyms live here so selectors, document metadata,
    // formatting, and install manifests cannot drift apart.
    const LOCALE_OPTIONS = [
        { id: 'en', tag: 'en', label: 'English', direction: 'ltr' },
        { id: 'es', tag: 'es', label: 'Español', direction: 'ltr' },
        { id: 'zh', tag: 'zh-Hans', label: '简体中文', direction: 'ltr' },
        { id: 'ar', tag: 'ar', label: 'العربية', direction: 'rtl' },
        { id: 'bn', tag: 'bn', label: 'বাংলা', direction: 'ltr' },
        { id: 'ja', tag: 'ja', label: '日本語', direction: 'ltr' },
        { id: 'hi', tag: 'hi', label: 'हिन्दी', direction: 'ltr' },
        { id: 'pt', tag: 'pt-BR', label: 'Português (Brasil)', direction: 'ltr' },
        { id: 'ru', tag: 'ru', label: 'Русский', direction: 'ltr' },
        { id: 'vi', tag: 'vi', label: 'Tiếng Việt', direction: 'ltr' },
        { id: 'tr', tag: 'tr', label: 'Türkçe', direction: 'ltr' },
        { id: 'ur', tag: 'ur', label: 'اردو', direction: 'rtl' }
    ];
    const AVAILABLE_LOCALES = LOCALE_OPTIONS.map(function (item) { return item.id; });
    const RTL_LOCALES = LOCALE_OPTIONS.filter(function (item) {
        return item.direction === 'rtl';
    }).map(function (item) { return item.id; });
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
            'round.tutorial': 'البرنامج التعليمي', 'round.score': 'الهدف {target} · النتيجة {score}', 'flip.one': 'تبديل متبقٍ', 'flip.many': 'تبديلات متبقية',
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
            'menu.expand': 'প্রসারিত করুন', 'menu.collapse': 'সংকুচিত করুন', 'menu.expandTitle': 'গেম মেনু প্রসারিত করুন', 'menu.collapseTitle': 'গেম মেনু সংকুচিত করুন', 'action.menu': 'মেনু', 'action.reset': 'রিসেট',
            'action.check': 'সমীকরণ পরীক্ষা করুন', 'action.next': 'পরের প্রশ্ন', 'action.again': 'আবার খেলুন',
            'round.tutorial': 'টিউটোরিয়াল', 'round.score': 'লক্ষ্য {target} · স্কোর {score}', 'flip.one': 'পরিবর্তন বাকি', 'flip.many': 'পরিবর্তন বাকি',
            'session.solved': 'সমাধান', 'session.accuracy': 'নির্ভুলতা', 'session.average': 'গড়', 'session.hardest': 'সবচেয়ে কঠিন',
            'timer.seconds': '{seconds}সে', 'history.empty': 'এখনও কোনো প্রশ্ন সংরক্ষিত নেই।', 'history.page': 'পৃষ্ঠা {page}/{pages} · {count}/{limit} সংরক্ষিত',
            'history.correct': 'সঠিক', 'history.incorrect': 'ভুল', 'history.round': 'রাউন্ড {round}',
            'mode.operations': 'ক্রিয়া: {operations}', 'mode.baseLength': 'মূল দৈর্ঘ্য: {min}–{max}',
            'confirm.clearHistory': 'সব স্থানীয় প্রশ্নের ইতিহাস মুছবেন?', 'confirm.resetStat': '{mode} এর পরিসংখ্যান রিসেট করবেন?', 'confirm.resetAll': 'সব মোডের পরিসংখ্যান রিসেট করবেন?', 'aria.resetStat': '{mode} এর পরিসংখ্যান রিসেট করুন'
        },
        ja: {
            'language.label': '言語', 'sidebar.label': 'サイドバーの位置', 'sidebar.auto': '自動（言語に従う）', 'sidebar.left': '左', 'sidebar.right': '右',
            'nav.view': '画面', 'nav.play': 'プレイ', 'nav.options': 'オプション', 'nav.stats': '統計', 'nav.mode': 'モード',
            'menu.expand': '展開', 'menu.collapse': '折りたたむ', 'menu.expandTitle': 'ゲームメニューを展開', 'menu.collapseTitle': 'ゲームメニューを折りたたむ', 'action.menu': 'メニュー', 'action.reset': 'リセット',
            'action.check': '式を確認', 'action.next': '次の問題', 'action.again': 'もう一度プレイ',
            'round.tutorial': 'チュートリアル', 'round.score': '目標 {target} · スコア {score}', 'flip.one': '回の変更が残り', 'flip.many': '回の変更が残り',
            'session.solved': '解答済み', 'session.accuracy': '正答率', 'session.average': '平均', 'session.hardest': '最高難度',
            'timer.seconds': '{seconds}秒', 'history.empty': '保存された問題はありません。', 'history.page': '{page}/{pages} ページ · {count}/{limit} 件を保存',
            'history.correct': '正解', 'history.incorrect': '不正解', 'history.round': 'ラウンド {round}',
            'mode.operations': '演算：{operations}', 'mode.baseLength': '基本の長さ：{min}～{max}',
            'confirm.clearHistory': 'ローカルに保存した問題履歴をすべて消去しますか？', 'confirm.resetStat': '{mode} の統計をリセットしますか？', 'confirm.resetAll': 'すべてのモードの統計をリセットしますか？', 'aria.resetStat': '{mode} の統計をリセット'
        },
        hi: {
            'language.label': 'भाषा', 'sidebar.label': 'साइडबार की स्थिति', 'sidebar.auto': 'स्वचालित (भाषा के अनुसार)', 'sidebar.left': 'बायाँ', 'sidebar.right': 'दायाँ',
            'nav.view': 'स्क्रीन', 'nav.play': 'खेलें', 'nav.options': 'विकल्प', 'nav.stats': 'आँकड़े', 'nav.mode': 'मोड',
            'menu.expand': 'खोलें', 'menu.collapse': 'समेटें', 'menu.expandTitle': 'गेम मेनू खोलें', 'menu.collapseTitle': 'गेम मेनू समेटें', 'action.menu': 'मेनू', 'action.reset': 'रीसेट',
            'action.check': 'समीकरण जाँचें', 'action.next': 'अगली पहेली', 'action.again': 'फिर खेलें',
            'round.tutorial': 'ट्यूटोरियल', 'round.score': 'लक्ष्य {target} · स्कोर {score}', 'flip.one': 'बदलाव शेष', 'flip.many': 'बदलाव शेष',
            'session.solved': 'हल किए', 'session.accuracy': 'सटीकता', 'session.average': 'औसत', 'session.hardest': 'सबसे कठिन',
            'timer.seconds': '{seconds}से', 'history.empty': 'अभी तक कोई पहेली सहेजी नहीं गई है।', 'history.page': 'पृष्ठ {page}/{pages} · {count}/{limit} सहेजी गई',
            'history.correct': 'सही', 'history.incorrect': 'गलत', 'history.round': 'राउंड {round}',
            'mode.operations': 'क्रियाएँ: {operations}', 'mode.baseLength': 'आधार लंबाई: {min}–{max}',
            'confirm.clearHistory': 'सभी स्थानीय पहेली इतिहास मिटाएँ?', 'confirm.resetStat': '{mode} के आँकड़े रीसेट करें?', 'confirm.resetAll': 'सभी मोड के आँकड़े रीसेट करें?', 'aria.resetStat': '{mode} के आँकड़े रीसेट करें'
        },
        pt: {
            'language.label': 'Idioma', 'sidebar.label': 'Lado da barra lateral', 'sidebar.auto': 'Automático (seguir idioma)', 'sidebar.left': 'Esquerda', 'sidebar.right': 'Direita',
            'nav.view': 'Tela', 'nav.play': 'Jogar', 'nav.options': 'Opções', 'nav.stats': 'Estatísticas', 'nav.mode': 'Modo',
            'menu.expand': 'Expandir', 'menu.collapse': 'Recolher', 'menu.expandTitle': 'Expandir menu do jogo', 'menu.collapseTitle': 'Recolher menu do jogo', 'action.menu': 'Menu', 'action.reset': 'Redefinir',
            'action.check': 'Verificar equação', 'action.next': 'Próximo problema', 'action.again': 'Jogar novamente',
            'round.tutorial': 'Tutorial', 'round.score': 'Meta {target} · pontuação {score}', 'flip.one': 'alteração restante', 'flip.many': 'alterações restantes',
            'session.solved': 'resolvidos', 'session.accuracy': 'precisão', 'session.average': 'média', 'session.hardest': 'mais difícil',
            'timer.seconds': '{seconds}s', 'history.empty': 'Ainda não há problemas salvos.', 'history.page': 'Página {page}/{pages} · {count}/{limit} salvos',
            'history.correct': 'Correto', 'history.incorrect': 'Incorreto', 'history.round': 'rodada {round}',
            'mode.operations': 'Operações: {operations}', 'mode.baseLength': 'Comprimento base: {min}–{max}',
            'confirm.clearHistory': 'Limpar todo o histórico local de problemas?', 'confirm.resetStat': 'Redefinir estatísticas de {mode}?', 'confirm.resetAll': 'Redefinir estatísticas de todos os modos?', 'aria.resetStat': 'Redefinir estatísticas de {mode}'
        },
        ru: {
            'language.label': 'Язык', 'sidebar.label': 'Сторона боковой панели', 'sidebar.auto': 'Автоматически (по языку)', 'sidebar.left': 'Слева', 'sidebar.right': 'Справа',
            'nav.view': 'Экран', 'nav.play': 'Играть', 'nav.options': 'Настройки', 'nav.stats': 'Статистика', 'nav.mode': 'Режим',
            'menu.expand': 'Развернуть', 'menu.collapse': 'Свернуть', 'menu.expandTitle': 'Развернуть меню игры', 'menu.collapseTitle': 'Свернуть меню игры', 'action.menu': 'Меню', 'action.reset': 'Сбросить',
            'action.check': 'Проверить равенство', 'action.next': 'Следующая задача', 'action.again': 'Играть снова',
            'round.tutorial': 'Обучение', 'round.score': 'Цель {target} · счёт {score}', 'flip.one': 'изменение осталось', 'flip.many': 'изменений осталось',
            'session.solved': 'решено', 'session.accuracy': 'точность', 'session.average': 'среднее', 'session.hardest': 'самая сложная',
            'timer.seconds': '{seconds}с', 'history.empty': 'Сохранённых задач пока нет.', 'history.page': 'Страница {page}/{pages} · сохранено {count}/{limit}',
            'history.correct': 'Верно', 'history.incorrect': 'Неверно', 'history.round': 'раунд {round}',
            'mode.operations': 'Операции: {operations}', 'mode.baseLength': 'Базовая длина: {min}–{max}',
            'confirm.clearHistory': 'Очистить всю локальную историю задач?', 'confirm.resetStat': 'Сбросить статистику {mode}?', 'confirm.resetAll': 'Сбросить статистику всех режимов?', 'aria.resetStat': 'Сбросить статистику {mode}'
        },
        vi: {
            'language.label': 'Ngôn ngữ', 'sidebar.label': 'Vị trí thanh bên', 'sidebar.auto': 'Tự động (theo ngôn ngữ)', 'sidebar.left': 'Trái', 'sidebar.right': 'Phải',
            'nav.view': 'Màn hình', 'nav.play': 'Chơi', 'nav.options': 'Tùy chọn', 'nav.stats': 'Thống kê', 'nav.mode': 'Chế độ',
            'menu.expand': 'Mở rộng', 'menu.collapse': 'Thu gọn', 'menu.expandTitle': 'Mở rộng menu trò chơi', 'menu.collapseTitle': 'Thu gọn menu trò chơi', 'action.menu': 'Menu', 'action.reset': 'Đặt lại', 'action.check': 'Kiểm tra phương trình', 'action.next': 'Câu tiếp theo', 'action.again': 'Chơi lại',
            'round.tutorial': 'Hướng dẫn', 'round.score': 'Mục tiêu {target} · điểm {score}', 'flip.one': 'lần thay đổi còn lại', 'flip.many': 'lần thay đổi còn lại',
            'session.solved': 'đã giải', 'session.accuracy': 'độ chính xác', 'session.average': 'trung bình', 'session.hardest': 'khó nhất', 'timer.seconds': '{seconds}giây',
            'history.empty': 'Chưa có câu hỏi nào được lưu.', 'history.page': 'Trang {page}/{pages} · đã lưu {count}/{limit}', 'history.correct': 'Đúng', 'history.incorrect': 'Sai', 'history.round': 'vòng {round}',
            'mode.operations': 'Phép toán: {operations}', 'mode.baseLength': 'Độ dài cơ bản: {min}–{max}', 'confirm.clearHistory': 'Xóa toàn bộ lịch sử câu hỏi cục bộ?', 'confirm.resetStat': 'Đặt lại thống kê {mode}?', 'confirm.resetAll': 'Đặt lại thống kê mọi chế độ?', 'aria.resetStat': 'Đặt lại thống kê {mode}'
        },
        tr: {
            'language.label': 'Dil', 'sidebar.label': 'Kenar çubuğu konumu', 'sidebar.auto': 'Otomatik (dile göre)', 'sidebar.left': 'Sol', 'sidebar.right': 'Sağ',
            'nav.view': 'Ekran', 'nav.play': 'Oyna', 'nav.options': 'Seçenekler', 'nav.stats': 'İstatistikler', 'nav.mode': 'Mod',
            'menu.expand': 'Genişlet', 'menu.collapse': 'Daralt', 'menu.expandTitle': 'Oyun menüsünü genişlet', 'menu.collapseTitle': 'Oyun menüsünü daralt', 'action.menu': 'Menü', 'action.reset': 'Sıfırla', 'action.check': 'Denklemi kontrol et', 'action.next': 'Sonraki soru', 'action.again': 'Tekrar oyna',
            'round.tutorial': 'Eğitim', 'round.score': 'Hedef {target} · puan {score}', 'flip.one': 'değişiklik kaldı', 'flip.many': 'değişiklik kaldı',
            'session.solved': 'çözüldü', 'session.accuracy': 'doğruluk', 'session.average': 'ortalama', 'session.hardest': 'en zor', 'timer.seconds': '{seconds}sn',
            'history.empty': 'Henüz kaydedilmiş soru yok.', 'history.page': 'Sayfa {page}/{pages} · {count}/{limit} kaydedildi', 'history.correct': 'Doğru', 'history.incorrect': 'Yanlış', 'history.round': 'tur {round}',
            'mode.operations': 'İşlemler: {operations}', 'mode.baseLength': 'Temel uzunluk: {min}–{max}', 'confirm.clearHistory': 'Tüm yerel soru geçmişi silinsin mi?', 'confirm.resetStat': '{mode} istatistikleri sıfırlansın mı?', 'confirm.resetAll': 'Tüm modların istatistikleri sıfırlansın mı?', 'aria.resetStat': '{mode} istatistiklerini sıfırla'
        },
        ur: {
            'language.label': 'زبان', 'sidebar.label': 'سائیڈبار کی جگہ', 'sidebar.auto': 'خودکار (زبان کے مطابق)', 'sidebar.left': 'بائیں', 'sidebar.right': 'دائیں',
            'nav.view': 'صفحہ', 'nav.play': 'کھیلیں', 'nav.options': 'اختیارات', 'nav.stats': 'اعداد و شمار', 'nav.mode': 'موڈ',
            'menu.expand': 'کھولیں', 'menu.collapse': 'سمیٹیں', 'menu.expandTitle': 'گیم مینو کھولیں', 'menu.collapseTitle': 'گیم مینو سمیٹیں', 'action.menu': 'مینو', 'action.reset': 'ری سیٹ', 'action.check': 'مساوات چیک کریں', 'action.next': 'اگلا سوال', 'action.again': 'دوبارہ کھیلیں',
            'round.tutorial': 'سبق', 'round.score': 'ہدف {target} · اسکور {score}', 'flip.one': 'تبدیلی باقی', 'flip.many': 'تبدیلیاں باقی',
            'session.solved': 'حل شدہ', 'session.accuracy': 'درستگی', 'session.average': 'اوسط', 'session.hardest': 'سب سے مشکل', 'timer.seconds': '{seconds}ث',
            'history.empty': 'ابھی کوئی سوال محفوظ نہیں ہے۔', 'history.page': 'صفحہ {page}/{pages} · {count}/{limit} محفوظ', 'history.correct': 'درست', 'history.incorrect': 'غلط', 'history.round': 'راؤنڈ {round}',
            'mode.operations': 'عملیات: {operations}', 'mode.baseLength': 'بنیادی لمبائی: {min}–{max}', 'confirm.clearHistory': 'تمام مقامی سوالوں کی تاریخ مٹائیں؟', 'confirm.resetStat': '{mode} کے اعداد و شمار ری سیٹ کریں؟', 'confirm.resetAll': 'تمام موڈ کے اعداد و شمار ری سیٹ کریں؟', 'aria.resetStat': '{mode} کے اعداد و شمار ری سیٹ کریں'
        }
    };

    function localeOption(locale) {
        return LOCALE_OPTIONS.find(function (item) { return item.id === locale; }) ||
            LOCALE_OPTIONS[0];
    }

    function supported(value) {
        const requested = String(value || '').trim().replace(/_/g, '-').toLowerCase();
        const exact = LOCALE_OPTIONS.find(function (item) {
            return item.id.toLowerCase() === requested || item.tag.toLowerCase() === requested;
        });
        if (exact) return exact.id;

        const parts = requested.split('-');
        const primary = parts[0];
        // Do not silently show Simplified Chinese to Traditional Chinese users,
        // or Brazilian Portuguese to users who explicitly requested Portugal.
        if (primary === 'zh') {
            return parts.length === 1 || parts.includes('hans') ||
                ['cn', 'sg'].includes(parts[1]) ? 'zh' : 'en';
        }
        if (primary === 'pt') {
            return parts.length === 1 || parts[1] === 'br' ? 'pt' : 'en';
        }
        return AVAILABLE_LOCALES.includes(primary) ? primary : 'en';
    }

    function initialLocale() {
        const requested = new URLSearchParams(window.location.search).get('lang');
        if (requested) return supported(requested);
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return supported(saved);
        } catch (error) {}
        return supported(navigator.language || 'en');
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
            'Tutorial': 'البرنامج التعليمي', 'Easy': 'سهل', 'Normal': 'عادي', 'Hard': 'صعب', 'Expert': 'خبير', 'Extreme': 'أقصى',
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

    // Structural UI copy is keyed so every selectable locale must provide it.
    const uiMessages = {
        en: {
            'nav.about': 'About', 'aria.navigation': 'Game navigation', 'aria.sections': 'Game sections', 'aria.mode': 'Game mode',
            'aria.play': 'Play', 'aria.options': 'Options', 'aria.stats': 'Statistics', 'aria.about': 'About',
            'aria.session': 'Current session statistics', 'aria.puzzle': 'Current puzzle',
            'custom.operations': 'Operations', 'custom.note': 'Choose +, −, ×, ÷, or powers.', 'custom.length': 'Length', 'custom.operationCount': 'operations',
            'custom.minimum': 'Minimum target', 'custom.maximum': 'Maximum target', 'custom.correct': 'Correct answers to finish',
            'custom.rate': 'Minimum win rate (%)', 'custom.seed': 'Seed (optional)', 'custom.seedHint': 'Same seed, same game', 'custom.start': 'Start custom game',
            'options.wave': 'Each mode repeats an eight-round wave of warm-ups, standard rounds, and gentler challenges.',
            'options.keyboard': 'Keys: ←/→ select · Space changes · Enter checks · H hints.',
            'action.hint': 'Hint', 'action.reveal': 'Show solution', 'action.share': 'Share', 'action.install': 'Install offline app',
            'stats.mode': 'Mode', 'stats.correct': 'Correct', 'stats.winRate': 'Win rate', 'stats.streak': 'Streak', 'stats.record': 'Record',
            'stats.actions': 'Actions', 'stats.resetAll': 'Reset all stats', 'stats.previous': 'Previous', 'stats.next': 'Next', 'stats.clearHistory': 'Clear history'
        },
        es: {
            'nav.about': 'Acerca de', 'aria.navigation': 'Navegación del juego', 'aria.sections': 'Secciones del juego', 'aria.mode': 'Modo de juego',
            'aria.play': 'Jugar', 'aria.options': 'Opciones', 'aria.stats': 'Estadísticas', 'aria.about': 'Acerca de',
            'aria.session': 'Estadísticas de la sesión actual', 'aria.puzzle': 'Problema actual',
            'custom.operations': 'Operaciones', 'custom.note': 'Elige +, −, ×, ÷ o potencias.', 'custom.length': 'Longitud', 'custom.operationCount': 'operaciones',
            'custom.minimum': 'Objetivo mínimo', 'custom.maximum': 'Objetivo máximo', 'custom.correct': 'Respuestas correctas para terminar',
            'custom.rate': 'Porcentaje mínimo de aciertos (%)', 'custom.seed': 'Semilla (opcional)', 'custom.seedHint': 'Misma semilla, mismo juego', 'custom.start': 'Iniciar juego personalizado',
            'options.wave': 'Cada modo repite una secuencia de ocho rondas: calentamientos, rondas normales y desafíos suaves.',
            'options.keyboard': 'Teclas: ←/→ seleccionan · Espacio cambia · Intro comprueba · H da una pista.',
            'action.hint': 'Pista', 'action.reveal': 'Mostrar solución', 'action.share': 'Compartir', 'action.install': 'Instalar aplicación sin conexión',
            'stats.mode': 'Modo', 'stats.correct': 'Correctas', 'stats.winRate': 'Porcentaje de aciertos', 'stats.streak': 'Racha', 'stats.record': 'Récord',
            'stats.actions': 'Acciones', 'stats.resetAll': 'Restablecer todas las estadísticas', 'stats.previous': 'Anterior', 'stats.next': 'Siguiente', 'stats.clearHistory': 'Borrar historial'
        },
        zh: {
            'nav.about': '关于', 'aria.navigation': '游戏导航', 'aria.sections': '游戏页面', 'aria.mode': '游戏模式',
            'aria.play': '游戏', 'aria.options': '选项', 'aria.stats': '统计', 'aria.about': '关于',
            'aria.session': '当前游戏统计', 'aria.puzzle': '当前题目',
            'custom.operations': '运算', 'custom.note': '选择 +、−、×、÷ 或幂。', 'custom.length': '长度', 'custom.operationCount': '个运算',
            'custom.minimum': '最小目标', 'custom.maximum': '最大目标', 'custom.correct': '完成所需正确题数',
            'custom.rate': '最低正确率 (%)', 'custom.seed': '种子（可选）', 'custom.seedHint': '相同种子，相同游戏', 'custom.start': '开始自定义游戏',
            'options.wave': '每种模式都会循环八轮：热身、标准轮和较温和的挑战轮。',
            'options.keyboard': '按键：←/→ 选择 · 空格改变 · Enter 检查 · H 提示。',
            'action.hint': '提示', 'action.reveal': '显示解法', 'action.share': '分享', 'action.install': '安装离线应用',
            'stats.mode': '模式', 'stats.correct': '正确', 'stats.winRate': '正确率', 'stats.streak': '连对', 'stats.record': '记录',
            'stats.actions': '操作', 'stats.resetAll': '重置所有统计', 'stats.previous': '上一页', 'stats.next': '下一页', 'stats.clearHistory': '清除历史'
        },
        ar: {
            'nav.about': 'حول', 'aria.navigation': 'التنقل في اللعبة', 'aria.sections': 'أقسام اللعبة', 'aria.mode': 'نمط اللعبة',
            'aria.play': 'العب', 'aria.options': 'الخيارات', 'aria.stats': 'الإحصاءات', 'aria.about': 'حول',
            'aria.session': 'إحصاءات الجلسة الحالية', 'aria.puzzle': 'المسألة الحالية',
            'custom.operations': 'العمليات', 'custom.note': 'اختر + أو − أو × أو ÷ أو الأسس.', 'custom.length': 'الطول', 'custom.operationCount': 'عمليات',
            'custom.minimum': 'الهدف الأدنى', 'custom.maximum': 'الهدف الأقصى', 'custom.correct': 'إجابات صحيحة للإنهاء',
            'custom.rate': 'أدنى نسبة نجاح (%)', 'custom.seed': 'بذرة (اختياري)', 'custom.seedHint': 'البذرة نفسها، اللعبة نفسها', 'custom.start': 'ابدأ لعبة مخصصة',
            'options.wave': 'يتكرر في كل نمط تسلسل من ثماني جولات: تمهيد وجولات عادية وتحديات ألطف.',
            'options.keyboard': 'المفاتيح: ←/→ للاختيار · مسافة للتغيير · Enter للتحقق · H للتلميح.',
            'action.hint': 'تلميح', 'action.reveal': 'أظهر الحل', 'action.share': 'مشاركة', 'action.install': 'ثبّت التطبيق دون اتصال',
            'stats.mode': 'النمط', 'stats.correct': 'صحيح', 'stats.winRate': 'نسبة النجاح', 'stats.streak': 'سلسلة', 'stats.record': 'أفضل نتيجة',
            'stats.actions': 'إجراءات', 'stats.resetAll': 'أعد ضبط كل الإحصاءات', 'stats.previous': 'السابق', 'stats.next': 'التالي', 'stats.clearHistory': 'امسح السجل'
        },
        bn: {
            'nav.about': 'পরিচিতি', 'aria.navigation': 'গেম নেভিগেশন', 'aria.sections': 'গেমের বিভাগ', 'aria.mode': 'গেমের মোড',
            'aria.play': 'খেলুন', 'aria.options': 'বিকল্প', 'aria.stats': 'পরিসংখ্যান', 'aria.about': 'পরিচিতি',
            'aria.session': 'বর্তমান সেশনের পরিসংখ্যান', 'aria.puzzle': 'বর্তমান ধাঁধা',
            'custom.operations': 'ক্রিয়া', 'custom.note': '+, −, ×, ÷ বা ঘাত বেছে নিন।', 'custom.length': 'দৈর্ঘ্য', 'custom.operationCount': 'ক্রিয়া',
            'custom.minimum': 'সর্বনিম্ন লক্ষ্য', 'custom.maximum': 'সর্বোচ্চ লক্ষ্য', 'custom.correct': 'শেষ করতে সঠিক উত্তর',
            'custom.rate': 'সর্বনিম্ন জয়ের হার (%)', 'custom.seed': 'বীজ (ঐচ্ছিক)', 'custom.seedHint': 'একই বীজ, একই খেলা', 'custom.start': 'কাস্টম গেম শুরু করুন',
            'options.wave': 'প্রতিটি মোডে আট রাউন্ডের ধারা থাকে: ওয়ার্ম-আপ, সাধারণ রাউন্ড ও হালকা চ্যালেঞ্জ।',
            'options.keyboard': 'কী: ←/→ নির্বাচন · Space পরিবর্তন · Enter পরীক্ষা · H ইঙ্গিত।',
            'action.hint': 'ইঙ্গিত', 'action.reveal': 'সমাধান দেখুন', 'action.share': 'শেয়ার করুন', 'action.install': 'অফলাইন অ্যাপ ইনস্টল করুন',
            'stats.mode': 'মোড', 'stats.correct': 'সঠিক', 'stats.winRate': 'জয়ের হার', 'stats.streak': 'ধারা', 'stats.record': 'সেরা',
            'stats.actions': 'কাজ', 'stats.resetAll': 'সব পরিসংখ্যান রিসেট করুন', 'stats.previous': 'আগের', 'stats.next': 'পরের', 'stats.clearHistory': 'ইতিহাস মুছুন'
        },
        ja: {
            'nav.about': 'このゲームについて', 'aria.navigation': 'ゲームのナビゲーション', 'aria.sections': 'ゲーム画面', 'aria.mode': 'ゲームモード',
            'aria.play': 'プレイ', 'aria.options': 'オプション', 'aria.stats': '統計', 'aria.about': 'このゲームについて',
            'aria.session': '現在のセッションの統計', 'aria.puzzle': '現在の問題',
            'custom.operations': '演算', 'custom.note': '+、−、×、÷、またはべきを選びます。', 'custom.length': '長さ', 'custom.operationCount': '演算',
            'custom.minimum': '最小目標', 'custom.maximum': '最大目標', 'custom.correct': '終了に必要な正解数',
            'custom.rate': '最低正答率 (%)', 'custom.seed': 'シード（任意）', 'custom.seedHint': '同じシード、同じゲーム', 'custom.start': 'カスタムゲームを始める',
            'options.wave': '各モードでは、ウォームアップ、通常ラウンド、やさしめのチャレンジの8ラウンドを繰り返します。',
            'options.keyboard': 'キー：←/→ 選択 · Space 変更 · Enter 確認 · H ヒント。',
            'action.hint': 'ヒント', 'action.reveal': '答えを見る', 'action.share': '共有', 'action.install': 'オフラインアプリをインストール',
            'stats.mode': 'モード', 'stats.correct': '正解', 'stats.winRate': '正答率', 'stats.streak': '連続正解', 'stats.record': '記録',
            'stats.actions': '操作', 'stats.resetAll': 'すべての統計をリセット', 'stats.previous': '前へ', 'stats.next': '次へ', 'stats.clearHistory': '履歴を消去'
        },
        hi: {
            'nav.about': 'परिचय', 'aria.navigation': 'गेम नेविगेशन', 'aria.sections': 'गेम अनुभाग', 'aria.mode': 'गेम मोड',
            'aria.play': 'खेलें', 'aria.options': 'विकल्प', 'aria.stats': 'आँकड़े', 'aria.about': 'परिचय',
            'aria.session': 'वर्तमान सत्र के आँकड़े', 'aria.puzzle': 'वर्तमान पहेली',
            'custom.operations': 'क्रियाएँ', 'custom.note': '+, −, ×, ÷ या घात चुनें।', 'custom.length': 'लंबाई', 'custom.operationCount': 'क्रियाएँ',
            'custom.minimum': 'न्यूनतम लक्ष्य', 'custom.maximum': 'अधिकतम लक्ष्य', 'custom.correct': 'समाप्त करने के लिए सही उत्तर',
            'custom.rate': 'न्यूनतम जीत दर (%)', 'custom.seed': 'बीज (वैकल्पिक)', 'custom.seedHint': 'वही बीज, वही गेम', 'custom.start': 'कस्टम गेम शुरू करें',
            'options.wave': 'हर मोड में आठ राउंड की लहर दोहरती है: वार्म-अप, सामान्य राउंड और हल्की चुनौतियाँ।',
            'options.keyboard': 'कुंजियाँ: ←/→ चुनें · Space बदलें · Enter जाँचें · H संकेत।',
            'action.hint': 'संकेत', 'action.reveal': 'हल देखें', 'action.share': 'साझा करें', 'action.install': 'ऑफ़लाइन ऐप इंस्टॉल करें',
            'stats.mode': 'मोड', 'stats.correct': 'सही', 'stats.winRate': 'जीत दर', 'stats.streak': 'लगातार सही', 'stats.record': 'रिकॉर्ड',
            'stats.actions': 'क्रियाएँ', 'stats.resetAll': 'सभी आँकड़े रीसेट करें', 'stats.previous': 'पिछला', 'stats.next': 'अगला', 'stats.clearHistory': 'इतिहास मिटाएँ'
        },
        pt: {
            'nav.about': 'Sobre', 'aria.navigation': 'Navegação do jogo', 'aria.sections': 'Seções do jogo', 'aria.mode': 'Modo de jogo',
            'aria.play': 'Jogar', 'aria.options': 'Opções', 'aria.stats': 'Estatísticas', 'aria.about': 'Sobre',
            'aria.session': 'Estatísticas da sessão atual', 'aria.puzzle': 'Problema atual',
            'custom.operations': 'Operações', 'custom.note': 'Escolha +, −, ×, ÷ ou potências.', 'custom.length': 'Tamanho', 'custom.operationCount': 'operações',
            'custom.minimum': 'Meta mínima', 'custom.maximum': 'Meta máxima', 'custom.correct': 'Respostas corretas para terminar',
            'custom.rate': 'Taxa mínima de acerto (%)', 'custom.seed': 'Semente (opcional)', 'custom.seedHint': 'Mesma semente, mesmo jogo', 'custom.start': 'Iniciar jogo personalizado',
            'options.wave': 'Cada modo repete uma sequência de oito rodadas: aquecimentos, rodadas normais e desafios mais leves.',
            'options.keyboard': 'Teclas: ←/→ selecionam · Espaço altera · Enter verifica · H dá uma dica.',
            'action.hint': 'Dica', 'action.reveal': 'Mostrar solução', 'action.share': 'Compartilhar', 'action.install': 'Instalar aplicativo offline',
            'stats.mode': 'Modo', 'stats.correct': 'Corretas', 'stats.winRate': 'Taxa de acerto', 'stats.streak': 'Sequência', 'stats.record': 'Recorde',
            'stats.actions': 'Ações', 'stats.resetAll': 'Redefinir todas as estatísticas', 'stats.previous': 'Anterior', 'stats.next': 'Próxima', 'stats.clearHistory': 'Limpar histórico'
        },
        ru: {
            'nav.about': 'О игре', 'aria.navigation': 'Навигация игры', 'aria.sections': 'Разделы игры', 'aria.mode': 'Режим игры',
            'aria.play': 'Играть', 'aria.options': 'Настройки', 'aria.stats': 'Статистика', 'aria.about': 'О игре',
            'aria.session': 'Статистика текущей сессии', 'aria.puzzle': 'Текущая задача',
            'custom.operations': 'Операции', 'custom.note': 'Выберите +, −, ×, ÷ или степени.', 'custom.length': 'Длина', 'custom.operationCount': 'операций',
            'custom.minimum': 'Минимальная цель', 'custom.maximum': 'Максимальная цель', 'custom.correct': 'Верных ответов для завершения',
            'custom.rate': 'Минимальный процент верных (%)', 'custom.seed': 'Сид (необязательно)', 'custom.seedHint': 'Тот же сид, та же игра', 'custom.start': 'Начать свою игру',
            'options.wave': 'В каждом режиме повторяется волна из восьми раундов: разминка, обычные раунды и более мягкие испытания.',
            'options.keyboard': 'Клавиши: ←/→ выбор · Пробел изменить · Enter проверить · H подсказка.',
            'action.hint': 'Подсказка', 'action.reveal': 'Показать решение', 'action.share': 'Поделиться', 'action.install': 'Установить офлайн-приложение',
            'stats.mode': 'Режим', 'stats.correct': 'Верно', 'stats.winRate': 'Процент верных', 'stats.streak': 'Серия', 'stats.record': 'Рекорд',
            'stats.actions': 'Действия', 'stats.resetAll': 'Сбросить всю статистику', 'stats.previous': 'Назад', 'stats.next': 'Далее', 'stats.clearHistory': 'Очистить историю'
        },
        vi: {
            'nav.about': 'Giới thiệu', 'aria.navigation': 'Điều hướng trò chơi', 'aria.sections': 'Các phần trò chơi', 'aria.mode': 'Chế độ chơi',
            'aria.play': 'Chơi', 'aria.options': 'Tùy chọn', 'aria.stats': 'Thống kê', 'aria.about': 'Giới thiệu',
            'aria.session': 'Thống kê phiên hiện tại', 'aria.puzzle': 'Câu đố hiện tại',
            'custom.operations': 'Phép toán', 'custom.note': 'Chọn +, −, ×, ÷ hoặc lũy thừa.', 'custom.length': 'Độ dài', 'custom.operationCount': 'phép toán',
            'custom.minimum': 'Mục tiêu tối thiểu', 'custom.maximum': 'Mục tiêu tối đa', 'custom.correct': 'Số đáp án đúng để kết thúc',
            'custom.rate': 'Tỷ lệ thắng tối thiểu (%)', 'custom.seed': 'Hạt giống (tùy chọn)', 'custom.seedHint': 'Cùng hạt giống, cùng trò chơi', 'custom.start': 'Bắt đầu trò chơi tùy chỉnh',
            'options.wave': 'Mỗi chế độ lặp lại một chuỗi tám vòng: khởi động, vòng thường và thử thách nhẹ nhàng hơn.',
            'options.keyboard': 'Phím: ←/→ chọn · Space thay đổi · Enter kiểm tra · H gợi ý.',
            'action.hint': 'Gợi ý', 'action.reveal': 'Xem lời giải', 'action.share': 'Chia sẻ', 'action.install': 'Cài ứng dụng ngoại tuyến',
            'stats.mode': 'Chế độ', 'stats.correct': 'Đúng', 'stats.winRate': 'Tỷ lệ đúng', 'stats.streak': 'Chuỗi', 'stats.record': 'Kỷ lục',
            'stats.actions': 'Thao tác', 'stats.resetAll': 'Đặt lại mọi thống kê', 'stats.previous': 'Trước', 'stats.next': 'Tiếp', 'stats.clearHistory': 'Xóa lịch sử'
        },
        tr: {
            'nav.about': 'Hakkında', 'aria.navigation': 'Oyun gezintisi', 'aria.sections': 'Oyun bölümleri', 'aria.mode': 'Oyun modu',
            'aria.play': 'Oyna', 'aria.options': 'Seçenekler', 'aria.stats': 'İstatistikler', 'aria.about': 'Hakkında',
            'aria.session': 'Geçerli oturum istatistikleri', 'aria.puzzle': 'Geçerli bulmaca',
            'custom.operations': 'İşlemler', 'custom.note': '+, −, ×, ÷ veya üsleri seçin.', 'custom.length': 'Uzunluk', 'custom.operationCount': 'işlem',
            'custom.minimum': 'En düşük hedef', 'custom.maximum': 'En yüksek hedef', 'custom.correct': 'Bitirmek için doğru yanıtlar',
            'custom.rate': 'En düşük kazanma oranı (%)', 'custom.seed': 'Tohum (isteğe bağlı)', 'custom.seedHint': 'Aynı tohum, aynı oyun', 'custom.start': 'Özel oyunu başlat',
            'options.wave': 'Her mod sekiz turluk bir dalgayı tekrarlar: ısınma, standart turlar ve daha yumuşak meydan okumalar.',
            'options.keyboard': 'Tuşlar: ←/→ seçer · Boşluk değiştirir · Enter kontrol eder · H ipucu verir.',
            'action.hint': 'İpucu', 'action.reveal': 'Çözümü göster', 'action.share': 'Paylaş', 'action.install': 'Çevrimdışı uygulamayı yükle',
            'stats.mode': 'Mod', 'stats.correct': 'Doğru', 'stats.winRate': 'Kazanma oranı', 'stats.streak': 'Seri', 'stats.record': 'Rekor',
            'stats.actions': 'İşlemler', 'stats.resetAll': 'Tüm istatistikleri sıfırla', 'stats.previous': 'Önceki', 'stats.next': 'Sonraki', 'stats.clearHistory': 'Geçmişi temizle'
        },
        ur: {
            'nav.about': 'تعارف', 'aria.navigation': 'گیم نیویگیشن', 'aria.sections': 'گیم کے حصے', 'aria.mode': 'گیم موڈ',
            'aria.play': 'کھیلیں', 'aria.options': 'اختیارات', 'aria.stats': 'اعداد و شمار', 'aria.about': 'تعارف',
            'aria.session': 'موجودہ نشست کے اعداد و شمار', 'aria.puzzle': 'موجودہ پہیلی',
            'custom.operations': 'عمل', 'custom.note': '+، −، ×، ÷ یا طاقتیں منتخب کریں۔', 'custom.length': 'لمبائی', 'custom.operationCount': 'عمل',
            'custom.minimum': 'کم از کم ہدف', 'custom.maximum': 'زیادہ سے زیادہ ہدف', 'custom.correct': 'ختم کرنے کے لیے درست جواب',
            'custom.rate': 'کم از کم جیت کی شرح (%)', 'custom.seed': 'بیج (اختیاری)', 'custom.seedHint': 'وہی بیج، وہی گیم', 'custom.start': 'اپنی گیم شروع کریں',
            'options.wave': 'ہر موڈ میں آٹھ راؤنڈز کی لہر دہرائی جاتی ہے: وارم اپ، عام راؤنڈز اور نرم چیلنجز۔',
            'options.keyboard': 'کلیدیں: ←/→ انتخاب · Space تبدیلی · Enter جانچ · H اشارہ۔',
            'action.hint': 'اشارہ', 'action.reveal': 'حل دکھائیں', 'action.share': 'شیئر کریں', 'action.install': 'آف لائن ایپ انسٹال کریں',
            'stats.mode': 'موڈ', 'stats.correct': 'درست', 'stats.winRate': 'جیت کی شرح', 'stats.streak': 'تسلسل', 'stats.record': 'ریکارڈ',
            'stats.actions': 'عمل', 'stats.resetAll': 'تمام اعداد و شمار ری سیٹ کریں', 'stats.previous': 'پچھلا', 'stats.next': 'اگلا', 'stats.clearHistory': 'تاریخ صاف کریں'
        }
    };
    for (const code of AVAILABLE_LOCALES) Object.assign(messages[code], uiMessages[code]);

    const aboutMessages = {
        en: {
            'about.title': 'About', 'about.summary': 'Change one number to 1 to balance an equation.',
            'about.origin': 'A refreshed version of bluehexagons’ Ludum Dare 28 game, with generated puzzles, settings, offline play, and local stats.',
            'about.translations': 'Translations', 'about.note': 'Translations are drafted and checked with a large language model.',
            'about.contribute': 'Help improve translations on GitHub.', 'about.review': 'Native-speaker review is especially welcome.',
            'footer.made': 'Made by bluehexagons for Ludum Dare 28.', 'footer.source': 'View the source on GitHub.',
            'footer.local': 'History and stats stay in this browser.'
        },
        es: {
            'about.title': 'Acerca de', 'about.summary': 'Cambia un número por 1 para equilibrar una ecuación.',
            'about.origin': 'Una versión renovada del juego de Ludum Dare 28 de bluehexagons, con problemas generados, opciones, uso sin conexión y estadísticas locales.',
            'about.translations': 'Traducciones', 'about.note': 'Las traducciones se redactan y revisan con ayuda de un modelo de lenguaje grande.',
            'about.contribute': 'Ayuda a mejorar las traducciones en GitHub.', 'about.review': 'Las revisiones de hablantes nativos son especialmente bienvenidas.',
            'footer.made': 'Creado por bluehexagons para Ludum Dare 28.', 'footer.source': 'Consulta el código fuente en GitHub.',
            'footer.local': 'El historial y las estadísticas se guardan en este navegador.'
        },
        zh: {
            'about.title': '关于', 'about.summary': '把一个数字改为 1，让等式平衡。',
            'about.origin': '这是 bluehexagons 为 Ludum Dare 28 制作的游戏的更新版，包含生成题目、设置、离线游玩和本地统计。',
            'about.translations': '翻译', 'about.note': '翻译由大型语言模型协助起草和检查。',
            'about.contribute': '在 GitHub 上帮助改进翻译。', 'about.review': '尤其欢迎母语者审阅。',
            'footer.made': '由 bluehexagons 为 Ludum Dare 28 制作。', 'footer.source': '在 GitHub 上查看源代码。',
            'footer.local': '历史和统计保存在此浏览器中。'
        },
        ar: {
            'about.title': 'حول', 'about.summary': 'غيّر رقمًا واحدًا إلى 1 لموازنة معادلة.',
            'about.origin': 'نسخة مجددة من لعبة bluehexagons في Ludum Dare 28، تضم مسائل مولدة وإعدادات ولعبًا دون اتصال وإحصاءات محلية.',
            'about.translations': 'الترجمات', 'about.note': 'تُصاغ الترجمات وتُراجع بمساعدة نموذج لغوي كبير.',
            'about.contribute': 'ساعد في تحسين الترجمات على GitHub.', 'about.review': 'مراجعة المتحدثين الأصليين مرحب بها كثيرًا.',
            'footer.made': 'صنعها bluehexagons لـ Ludum Dare 28.', 'footer.source': 'اعرض المصدر على GitHub.',
            'footer.local': 'يبقى السجل والإحصاءات في هذا المتصفح.'
        },
        bn: {
            'about.title': 'পরিচিতি', 'about.summary': 'একটি সংখ্যা 1 করে সমীকরণটি সমান করুন।',
            'about.origin': 'এটি bluehexagons-এর Ludum Dare 28 গেমের নবায়িত সংস্করণ; এতে তৈরি করা ধাঁধা, সেটিংস, অফলাইন খেলা ও স্থানীয় পরিসংখ্যান আছে।',
            'about.translations': 'অনুবাদ', 'about.note': 'বৃহৎ ভাষা মডেলের সহায়তায় অনুবাদ খসড়া ও পরীক্ষা করা হয়।',
            'about.contribute': 'GitHub-এ অনুবাদ উন্নত করতে সাহায্য করুন।', 'about.review': 'স্থানীয় ভাষাভাষীর পর্যালোচনা বিশেষভাবে স্বাগত।',
            'footer.made': 'Ludum Dare 28-এর জন্য bluehexagons তৈরি করেছেন।', 'footer.source': 'GitHub-এ উৎস দেখুন।',
            'footer.local': 'ইতিহাস ও পরিসংখ্যান এই ব্রাউজারেই থাকে।'
        },
        ja: {
            'about.title': 'このゲームについて', 'about.summary': '数を一つだけ1に変えて、式をつり合わせます。',
            'about.origin': 'bluehexagons の Ludum Dare 28 作品を、生成問題、設定、オフラインプレイ、ローカル統計とともに更新した版です。',
            'about.translations': '翻訳', 'about.note': '翻訳は大規模言語モデルの支援で下書き・確認されています。',
            'about.contribute': 'GitHub で翻訳の改善にご協力ください。', 'about.review': '母語話者による確認を特に歓迎します。',
            'footer.made': 'bluehexagons が Ludum Dare 28 向けに制作。', 'footer.source': 'GitHub でソースを見る。',
            'footer.local': '履歴と統計はこのブラウザに保存されます。'
        },
        hi: {
            'about.title': 'परिचय', 'about.summary': 'समीकरण संतुलित करने के लिए एक संख्या को 1 में बदलें।',
            'about.origin': 'bluehexagons के Ludum Dare 28 गेम का नया रूप, जिसमें बनाई गई पहेलियाँ, सेटिंग्स, ऑफ़लाइन खेल और स्थानीय आँकड़े हैं।',
            'about.translations': 'अनुवाद', 'about.note': 'अनुवाद बड़े भाषा मॉडल की सहायता से तैयार और जाँचे जाते हैं।',
            'about.contribute': 'GitHub पर अनुवाद बेहतर बनाने में मदद करें।', 'about.review': 'मातृभाषी समीक्षा का विशेष स्वागत है।',
            'footer.made': 'bluehexagons ने Ludum Dare 28 के लिए बनाया।', 'footer.source': 'GitHub पर स्रोत देखें।',
            'footer.local': 'इतिहास और आँकड़े इसी ब्राउज़र में रहते हैं।'
        },
        pt: {
            'about.title': 'Sobre', 'about.summary': 'Mude um número para 1 e equilibre a equação.',
            'about.origin': 'Uma versão renovada do jogo de Ludum Dare 28 da bluehexagons, com problemas gerados, configurações, jogo offline e estatísticas locais.',
            'about.translations': 'Traduções', 'about.note': 'As traduções são redigidas e verificadas com ajuda de um grande modelo de linguagem.',
            'about.contribute': 'Ajude a melhorar as traduções no GitHub.', 'about.review': 'Revisões de falantes nativos são muito bem-vindas.',
            'footer.made': 'Feito por bluehexagons para Ludum Dare 28.', 'footer.source': 'Veja o código-fonte no GitHub.',
            'footer.local': 'O histórico e as estatísticas ficam neste navegador.'
        },
        ru: {
            'about.title': 'О игре', 'about.summary': 'Измените одно число на 1, чтобы уравнять выражение.',
            'about.origin': 'Обновлённая версия игры bluehexagons для Ludum Dare 28: с генерируемыми задачами, настройками, офлайн-игрой и локальной статистикой.',
            'about.translations': 'Переводы', 'about.note': 'Переводы создаются и проверяются с помощью большой языковой модели.',
            'about.contribute': 'Помогите улучшить переводы на GitHub.', 'about.review': 'Проверка носителями языка особенно приветствуется.',
            'footer.made': 'Создано bluehexagons для Ludum Dare 28.', 'footer.source': 'Открыть исходный код на GitHub.',
            'footer.local': 'История и статистика хранятся в этом браузере.'
        },
        vi: {
            'about.title': 'Giới thiệu', 'about.summary': 'Đổi một số thành 1 để cân bằng phương trình.',
            'about.origin': 'Phiên bản làm mới của trò chơi Ludum Dare 28 của bluehexagons, với câu đố được tạo, tùy chọn, chơi ngoại tuyến và thống kê cục bộ.',
            'about.translations': 'Bản dịch', 'about.note': 'Bản dịch được soạn và kiểm tra với sự hỗ trợ của một mô hình ngôn ngữ lớn.',
            'about.contribute': 'Hãy giúp cải thiện bản dịch trên GitHub.', 'about.review': 'Đặc biệt hoan nghênh người bản ngữ xem lại.',
            'footer.made': 'Do bluehexagons tạo cho Ludum Dare 28.', 'footer.source': 'Xem mã nguồn trên GitHub.',
            'footer.local': 'Lịch sử và thống kê được giữ trong trình duyệt này.'
        },
        tr: {
            'about.title': 'Hakkında', 'about.summary': 'Denklemi dengelemek için bir sayıyı 1 yapın.',
            'about.origin': 'bluehexagons’ın Ludum Dare 28 oyununun; üretilen bulmacalar, ayarlar, çevrimdışı oynama ve yerel istatistiklerle yenilenmiş sürümü.',
            'about.translations': 'Çeviriler', 'about.note': 'Çeviriler, büyük bir dil modelinin yardımıyla hazırlanır ve kontrol edilir.',
            'about.contribute': 'GitHub’da çevirilerin iyileşmesine yardım edin.', 'about.review': 'Ana dilini konuşanların incelemesi özellikle memnuniyetle karşılanır.',
            'footer.made': 'Ludum Dare 28 için bluehexagons tarafından yapıldı.', 'footer.source': 'Kaynak kodunu GitHub’da görün.',
            'footer.local': 'Geçmiş ve istatistikler bu tarayıcıda kalır.'
        },
        ur: {
            'about.title': 'تعارف', 'about.summary': 'مساوات کو برابر کرنے کے لیے ایک عدد کو 1 میں بدلیں۔',
            'about.origin': 'bluehexagons کے Ludum Dare 28 گیم کا تازہ ورژن، جس میں بنائی گئی پہیلیاں، سیٹنگز، آف لائن کھیل اور مقامی اعداد و شمار شامل ہیں۔',
            'about.translations': 'ترجمے', 'about.note': 'ترجمے بڑے زبان کے ماڈل کی مدد سے تیار اور جانچے جاتے ہیں۔',
            'about.contribute': 'GitHub پر ترجموں کو بہتر بنانے میں مدد کریں۔', 'about.review': 'مادری زبان بولنے والوں کا جائزہ خاص طور پر خوش آئند ہے۔',
            'footer.made': 'bluehexagons نے Ludum Dare 28 کے لیے بنایا۔', 'footer.source': 'GitHub پر ماخذ دیکھیں۔',
            'footer.local': 'تاریخ اور اعداد و شمار اسی براؤزر میں رہتے ہیں۔'
        }
    };
    for (const code of AVAILABLE_LOCALES) Object.assign(messages[code], aboutMessages[code]);

    const operationMessages = {
        en: { 'operation.add': 'Addition', 'operation.subtract': 'Subtraction', 'operation.multiply': 'Multiplication', 'operation.divide': 'Integer division', 'operation.modulo': 'Remainder', 'operation.power': 'Powers', 'operation.root': 'Square roots' },
        es: { 'operation.add': 'Suma', 'operation.subtract': 'Resta', 'operation.multiply': 'Multiplicación', 'operation.divide': 'División entera', 'operation.modulo': 'Resto', 'operation.power': 'Potencias', 'operation.root': 'Raíces cuadradas' },
        zh: { 'operation.add': '加法', 'operation.subtract': '减法', 'operation.multiply': '乘法', 'operation.divide': '整数除法', 'operation.modulo': '余数', 'operation.power': '幂', 'operation.root': '平方根' },
        ar: { 'operation.add': 'الجمع', 'operation.subtract': 'الطرح', 'operation.multiply': 'الضرب', 'operation.divide': 'القسمة الصحيحة', 'operation.modulo': 'الباقي', 'operation.power': 'الأسس', 'operation.root': 'الجذور التربيعية' },
        bn: { 'operation.add': 'যোগ', 'operation.subtract': 'বিয়োগ', 'operation.multiply': 'গুণ', 'operation.divide': 'পূর্ণসংখ্যা ভাগ', 'operation.modulo': 'ভাগশেষ', 'operation.power': 'ঘাত', 'operation.root': 'বর্গমূল' },
        ja: { 'operation.add': '足し算', 'operation.subtract': '引き算', 'operation.multiply': '掛け算', 'operation.divide': '整数除算', 'operation.modulo': '余り', 'operation.power': 'べき乗', 'operation.root': '平方根' },
        hi: { 'operation.add': 'जोड़', 'operation.subtract': 'घटाव', 'operation.multiply': 'गुणा', 'operation.divide': 'पूर्णांक भाग', 'operation.modulo': 'शेषफल', 'operation.power': 'घात', 'operation.root': 'वर्गमूल' },
        pt: { 'operation.add': 'Adição', 'operation.subtract': 'Subtração', 'operation.multiply': 'Multiplicação', 'operation.divide': 'Divisão inteira', 'operation.modulo': 'Resto', 'operation.power': 'Potências', 'operation.root': 'Raízes quadradas' },
        ru: { 'operation.add': 'Сложение', 'operation.subtract': 'Вычитание', 'operation.multiply': 'Умножение', 'operation.divide': 'Целочисленное деление', 'operation.modulo': 'Остаток', 'operation.power': 'Степени', 'operation.root': 'Квадратные корни' },
        vi: { 'operation.add': 'Cộng', 'operation.subtract': 'Trừ', 'operation.multiply': 'Nhân', 'operation.divide': 'Chia nguyên', 'operation.modulo': 'Số dư', 'operation.power': 'Lũy thừa', 'operation.root': 'Căn bậc hai' },
        tr: { 'operation.add': 'Toplama', 'operation.subtract': 'Çıkarma', 'operation.multiply': 'Çarpma', 'operation.divide': 'Tam sayı bölmesi', 'operation.modulo': 'Kalan', 'operation.power': 'Üsler', 'operation.root': 'Karekökler' },
        ur: { 'operation.add': 'جمع', 'operation.subtract': 'تفریق', 'operation.multiply': 'ضرب', 'operation.divide': 'صحیح تقسیم', 'operation.modulo': 'باقی', 'operation.power': 'طاقتیں', 'operation.root': 'مربع جذر' }
    };
    for (const code of AVAILABLE_LOCALES) Object.assign(messages[code], operationMessages[code]);

    const modeMessages = {
        en: { 'mode.tutorial': 'Tutorial', 'mode.easy': 'Easy', 'mode.normal': 'Normal', 'mode.hard': 'Hard', 'mode.expert': 'Expert', 'mode.extreme': 'Extreme', 'mode.custom': 'Custom', 'mode.daily': 'Daily', 'mode.timed': 'Timed', 'mode.endless': 'Endless', 'mode.challenges': 'Challenges' },
        es: { 'mode.tutorial': 'Tutorial', 'mode.easy': 'Fácil', 'mode.normal': 'Normal', 'mode.hard': 'Difícil', 'mode.expert': 'Experto', 'mode.extreme': 'Extremo', 'mode.custom': 'Personalizado', 'mode.daily': 'Diario', 'mode.timed': 'Contrarreloj', 'mode.endless': 'Infinito', 'mode.challenges': 'Desafíos' },
        zh: { 'mode.tutorial': '教程', 'mode.easy': '简单', 'mode.normal': '普通', 'mode.hard': '困难', 'mode.expert': '专家', 'mode.extreme': '极限', 'mode.custom': '自定义', 'mode.daily': '每日', 'mode.timed': '限时', 'mode.endless': '无尽', 'mode.challenges': '挑战' },
        ar: { 'mode.tutorial': 'البرنامج التعليمي', 'mode.easy': 'سهل', 'mode.normal': 'عادي', 'mode.hard': 'صعب', 'mode.expert': 'خبير', 'mode.extreme': 'أقصى', 'mode.custom': 'مخصص', 'mode.daily': 'يومي', 'mode.timed': 'مؤقت', 'mode.endless': 'لا نهائي', 'mode.challenges': 'تحديات' },
        bn: { 'mode.tutorial': 'টিউটোরিয়াল', 'mode.easy': 'সহজ', 'mode.normal': 'সাধারণ', 'mode.hard': 'কঠিন', 'mode.expert': 'বিশেষজ্ঞ', 'mode.extreme': 'চরম', 'mode.custom': 'কাস্টম', 'mode.daily': 'দৈনিক', 'mode.timed': 'সময়সীমা', 'mode.endless': 'অন্তহীন', 'mode.challenges': 'চ্যালেঞ্জ' },
        ja: { 'mode.tutorial': 'チュートリアル', 'mode.easy': 'かんたん', 'mode.normal': 'ふつう', 'mode.hard': 'むずかしい', 'mode.expert': 'エキスパート', 'mode.extreme': 'エクストリーム', 'mode.custom': 'カスタム', 'mode.daily': 'デイリー', 'mode.timed': 'タイムアタック', 'mode.endless': 'エンドレス', 'mode.challenges': 'チャレンジ' },
        hi: { 'mode.tutorial': 'ट्यूटोरियल', 'mode.easy': 'आसान', 'mode.normal': 'सामान्य', 'mode.hard': 'कठिन', 'mode.expert': 'विशेषज्ञ', 'mode.extreme': 'अत्यंत कठिन', 'mode.custom': 'कस्टम', 'mode.daily': 'दैनिक', 'mode.timed': 'समयबद्ध', 'mode.endless': 'अंतहीन', 'mode.challenges': 'चुनौतियाँ' },
        pt: { 'mode.tutorial': 'Tutorial', 'mode.easy': 'Fácil', 'mode.normal': 'Normal', 'mode.hard': 'Difícil', 'mode.expert': 'Especialista', 'mode.extreme': 'Extremo', 'mode.custom': 'Personalizado', 'mode.daily': 'Diário', 'mode.timed': 'Cronometrado', 'mode.endless': 'Infinito', 'mode.challenges': 'Desafios' },
        ru: { 'mode.tutorial': 'Обучение', 'mode.easy': 'Легко', 'mode.normal': 'Обычно', 'mode.hard': 'Сложно', 'mode.expert': 'Эксперт', 'mode.extreme': 'Экстрим', 'mode.custom': 'Своя игра', 'mode.daily': 'Ежедневно', 'mode.timed': 'На время', 'mode.endless': 'Бесконечно', 'mode.challenges': 'Испытания' },
        vi: { 'mode.tutorial': 'Hướng dẫn', 'mode.easy': 'Dễ', 'mode.normal': 'Thường', 'mode.hard': 'Khó', 'mode.expert': 'Chuyên gia', 'mode.extreme': 'Cực khó', 'mode.custom': 'Tùy chỉnh', 'mode.daily': 'Hằng ngày', 'mode.timed': 'Tính giờ', 'mode.endless': 'Vô tận', 'mode.challenges': 'Thử thách' },
        tr: { 'mode.tutorial': 'Eğitim', 'mode.easy': 'Kolay', 'mode.normal': 'Normal', 'mode.hard': 'Zor', 'mode.expert': 'Uzman', 'mode.extreme': 'Uç', 'mode.custom': 'Özel', 'mode.daily': 'Günlük', 'mode.timed': 'Süreli', 'mode.endless': 'Sonsuz', 'mode.challenges': 'Meydan okumalar' },
        ur: { 'mode.tutorial': 'سبق', 'mode.easy': 'آسان', 'mode.normal': 'عام', 'mode.hard': 'مشکل', 'mode.expert': 'ماہر', 'mode.extreme': 'انتہائی', 'mode.custom': 'اپنی', 'mode.daily': 'روزانہ', 'mode.timed': 'وقت کے ساتھ', 'mode.endless': 'لامتناہی', 'mode.challenges': 'چیلنجز' }
    };
    for (const code of AVAILABLE_LOCALES) Object.assign(messages[code], modeMessages[code]);

    const difficultyMessages = {
        en: { 'options.difficulty': 'Difficulty guide', 'difficulty.easy': 'Three values with + and −.', 'difficulty.normal': 'Short puzzles with × and frequent three-value rounds.', 'difficulty.hard': 'Short puzzles with integer ÷ and some three-value rounds.', 'difficulty.expert': 'Adds % and ^, with some three-value rounds.', 'difficulty.extreme': 'Longer puzzles with every operation, including √.' },
        es: { 'options.difficulty': 'Guía de dificultad', 'difficulty.easy': 'Tres valores con + y −.', 'difficulty.normal': 'Problemas breves con × y frecuentes rondas de tres valores.', 'difficulty.hard': 'Problemas breves con ÷ entera y algunas rondas de tres valores.', 'difficulty.expert': 'Añade % y ^, con algunas rondas de tres valores.', 'difficulty.extreme': 'Problemas más largos con todas las operaciones, incluida √.' },
        zh: { 'options.difficulty': '难度说明', 'difficulty.easy': '三个数值，使用 + 和 −。', 'difficulty.normal': '短题目，加入 ×，常有三个数值的回合。', 'difficulty.hard': '短题目，加入整数 ÷，有一些三个数值的回合。', 'difficulty.expert': '加入 % 和 ^，有一些三个数值的回合。', 'difficulty.extreme': '更长的题目，包含所有运算，包括 √。' },
        ar: { 'options.difficulty': 'دليل الصعوبة', 'difficulty.easy': 'ثلاث قيم مع + و−.', 'difficulty.normal': 'مسائل قصيرة مع × وجولات متكررة من ثلاث قيم.', 'difficulty.hard': 'مسائل قصيرة مع ÷ الصحيحة وبعض جولات ثلاث قيم.', 'difficulty.expert': 'تضيف % و^ مع بعض جولات ثلاث قيم.', 'difficulty.extreme': 'مسائل أطول بكل العمليات، بما فيها √.' },
        bn: { 'options.difficulty': 'কঠিনতার নির্দেশিকা', 'difficulty.easy': '+ ও − সহ তিনটি মান।', 'difficulty.normal': '× সহ ছোট ধাঁধা এবং ঘন ঘন তিন মানের রাউন্ড।', 'difficulty.hard': 'পূর্ণসংখ্যা ÷ সহ ছোট ধাঁধা এবং কিছু তিন মানের রাউন্ড।', 'difficulty.expert': '% ও ^ যোগ হয়, সঙ্গে কিছু তিন মানের রাউন্ড।', 'difficulty.extreme': '√-সহ সব ক্রিয়ার দীর্ঘ ধাঁধা।' },
        ja: { 'options.difficulty': '難易度ガイド', 'difficulty.easy': '+ と − を使う3つの数。', 'difficulty.normal': '× を使う短い問題。3つの数のラウンドも多め。', 'difficulty.hard': '整数 ÷ を使う短い問題。3つの数のラウンドもあります。', 'difficulty.expert': '% と ^ を追加。一部は3つの数のラウンドです。', 'difficulty.extreme': '√ を含むすべての演算を使う長めの問題。' },
        hi: { 'options.difficulty': 'कठिनाई गाइड', 'difficulty.easy': '+ और − वाले तीन मान।', 'difficulty.normal': '× वाली छोटी पहेलियाँ और अक्सर तीन मान के राउंड।', 'difficulty.hard': 'पूर्णांक ÷ वाली छोटी पहेलियाँ और कुछ तीन मान के राउंड।', 'difficulty.expert': '% और ^ जुड़ते हैं, साथ में कुछ तीन मान के राउंड।', 'difficulty.extreme': '√ सहित सभी क्रियाओं वाली लंबी पहेलियाँ।' },
        pt: { 'options.difficulty': 'Guia de dificuldade', 'difficulty.easy': 'Três valores com + e −.', 'difficulty.normal': 'Problemas curtos com × e rodadas frequentes de três valores.', 'difficulty.hard': 'Problemas curtos com ÷ inteira e algumas rodadas de três valores.', 'difficulty.expert': 'Adiciona % e ^, com algumas rodadas de três valores.', 'difficulty.extreme': 'Problemas mais longos com todas as operações, incluindo √.' },
        ru: { 'options.difficulty': 'Уровни сложности', 'difficulty.easy': 'Три числа с + и −.', 'difficulty.normal': 'Короткие задачи с × и частыми раундами из трёх чисел.', 'difficulty.hard': 'Короткие задачи с целочисленным ÷ и некоторыми раундами из трёх чисел.', 'difficulty.expert': 'Добавляет % и ^, с некоторыми раундами из трёх чисел.', 'difficulty.extreme': 'Более длинные задачи со всеми операциями, включая √.' },
        vi: { 'options.difficulty': 'Hướng dẫn độ khó', 'difficulty.easy': 'Ba giá trị với + và −.', 'difficulty.normal': 'Câu đố ngắn với × và thường có vòng ba giá trị.', 'difficulty.hard': 'Câu đố ngắn với ÷ nguyên và một số vòng ba giá trị.', 'difficulty.expert': 'Thêm % và ^, với một số vòng ba giá trị.', 'difficulty.extreme': 'Câu đố dài hơn với mọi phép toán, gồm cả √.' },
        tr: { 'options.difficulty': 'Zorluk rehberi', 'difficulty.easy': '+ ve − ile üç değer.', 'difficulty.normal': '× içeren kısa bulmacalar ve sık üç değerli turlar.', 'difficulty.hard': 'Tam sayı ÷ içeren kısa bulmacalar ve bazı üç değerli turlar.', 'difficulty.expert': '% ve ^ ekler; bazı turlar üç değerlidir.', 'difficulty.extreme': '√ dahil tüm işlemleri içeren daha uzun bulmacalar.' },
        ur: { 'options.difficulty': 'مشکل کی رہنمائی', 'difficulty.easy': '+ اور − کے ساتھ تین قدریں۔', 'difficulty.normal': '× کے ساتھ مختصر پہیلیاں اور اکثر تین قدروں کے راؤنڈ۔', 'difficulty.hard': 'صحیح ÷ کے ساتھ مختصر پہیلیاں اور کچھ تین قدروں کے راؤنڈ۔', 'difficulty.expert': '% اور ^ شامل ہیں، ساتھ کچھ تین قدروں کے راؤنڈ۔', 'difficulty.extreme': '√ سمیت تمام عمل والی طویل پہیلیاں۔' }
    };
    for (const code of AVAILABLE_LOCALES) Object.assign(messages[code], difficultyMessages[code]);

    const roundMessages = {
        en: { 'round.number': 'Round {round}', 'round.guided': 'Guided', 'round.warmup': 'Warm-up', 'round.standard': 'Standard', 'round.challenge': 'Challenge', 'round.curated': 'Curated', 'round.kindTitle': '{kind} round' },
        es: { 'round.number': 'Ronda {round}', 'round.guided': 'Guiada', 'round.warmup': 'Calentamiento', 'round.standard': 'Normal', 'round.challenge': 'Desafío', 'round.curated': 'Selección', 'round.kindTitle': 'Ronda {kind}' },
        zh: { 'round.number': '第 {round} 轮', 'round.guided': '引导', 'round.warmup': '热身', 'round.standard': '标准', 'round.challenge': '挑战', 'round.curated': '精选', 'round.kindTitle': '{kind}轮' },
        ar: { 'round.number': 'الجولة {round}', 'round.guided': 'إرشادية', 'round.warmup': 'تمهيد', 'round.standard': 'عادية', 'round.challenge': 'تحدٍّ', 'round.curated': 'مختارة', 'round.kindTitle': 'جولة {kind}' },
        bn: { 'round.number': 'রাউন্ড {round}', 'round.guided': 'নির্দেশিত', 'round.warmup': 'ওয়ার্ম-আপ', 'round.standard': 'সাধারণ', 'round.challenge': 'চ্যালেঞ্জ', 'round.curated': 'বাছাই করা', 'round.kindTitle': '{kind} রাউন্ড' },
        ja: { 'round.number': '{round} ラウンド', 'round.guided': 'ガイド', 'round.warmup': 'ウォームアップ', 'round.standard': '標準', 'round.challenge': 'チャレンジ', 'round.curated': '厳選', 'round.kindTitle': '{kind}ラウンド' },
        hi: { 'round.number': 'राउंड {round}', 'round.guided': 'निर्देशित', 'round.warmup': 'वार्म-अप', 'round.standard': 'सामान्य', 'round.challenge': 'चुनौती', 'round.curated': 'चुना हुआ', 'round.kindTitle': '{kind} राउंड' },
        pt: { 'round.number': 'Rodada {round}', 'round.guided': 'Guiada', 'round.warmup': 'Aquecimento', 'round.standard': 'Normal', 'round.challenge': 'Desafio', 'round.curated': 'Selecionada', 'round.kindTitle': 'Rodada {kind}' },
        ru: { 'round.number': 'Раунд {round}', 'round.guided': 'С подсказками', 'round.warmup': 'Разминка', 'round.standard': 'Обычный', 'round.challenge': 'Испытание', 'round.curated': 'Отобранный', 'round.kindTitle': 'Раунд: {kind}' },
        vi: { 'round.number': 'Vòng {round}', 'round.guided': 'Có hướng dẫn', 'round.warmup': 'Khởi động', 'round.standard': 'Thường', 'round.challenge': 'Thử thách', 'round.curated': 'Tuyển chọn', 'round.kindTitle': 'Vòng {kind}' },
        tr: { 'round.number': '{round}. tur', 'round.guided': 'Yönlendirmeli', 'round.warmup': 'Isınma', 'round.standard': 'Standart', 'round.challenge': 'Meydan okuma', 'round.curated': 'Seçilmiş', 'round.kindTitle': '{kind} turu' },
        ur: { 'round.number': 'راؤنڈ {round}', 'round.guided': 'رہنمائی والا', 'round.warmup': 'وارم اپ', 'round.standard': 'عام', 'round.challenge': 'چیلنج', 'round.curated': 'منتخب', 'round.kindTitle': '{kind} راؤنڈ' }
    };
    for (const code of AVAILABLE_LOCALES) Object.assign(messages[code], roundMessages[code]);

    const openingMessages = {
        en: { 'message.howToPlay': 'How to play', 'message.tutorial': 'Change one number to 1.', 'message.daily': 'Daily puzzle', 'message.dailyBody': 'One shared puzzle today.', 'message.timed': 'Timed', 'message.timedBody': 'Solve as many as you can in 60 seconds.', 'message.endless': 'Endless', 'message.endlessBody': 'Difficulty rises. You have three chances.', 'message.curated': 'Handcrafted puzzle {round} of {count}.', 'message.standardBody': 'Change one number, then check.', 'message.challengeBody': 'A harder round. Take your time.' },
        es: { 'message.howToPlay': 'Cómo jugar', 'message.tutorial': 'Cambia un número por 1.', 'message.daily': 'Problema diario', 'message.dailyBody': 'Un problema compartido para hoy.', 'message.timed': 'Contrarreloj', 'message.timedBody': 'Resuelve tantos como puedas en 60 segundos.', 'message.endless': 'Infinito', 'message.endlessBody': 'La dificultad aumenta. Tienes tres oportunidades.', 'message.curated': 'Problema artesanal {round} de {count}.', 'message.standardBody': 'Cambia un número y comprueba.', 'message.challengeBody': 'Una ronda más difícil. Tómate tu tiempo.' },
        zh: { 'message.howToPlay': '玩法说明', 'message.tutorial': '把一个数字改为 1。', 'message.daily': '每日题目', 'message.dailyBody': '今天共享的一道题。', 'message.timed': '限时', 'message.timedBody': '在 60 秒内尽量多解题。', 'message.endless': '无尽', 'message.endlessBody': '难度会提高。你有三次机会。', 'message.curated': '精选题目 {round}/{count}。', 'message.standardBody': '改变一个数字，然后检查。', 'message.challengeBody': '更难的一轮。慢慢来。' },
        ar: { 'message.howToPlay': 'طريقة اللعب', 'message.tutorial': 'غيّر رقمًا واحدًا إلى 1.', 'message.daily': 'مسألة اليوم', 'message.dailyBody': 'مسألة مشتركة واحدة اليوم.', 'message.timed': 'مؤقت', 'message.timedBody': 'حل أكبر عدد ممكن خلال 60 ثانية.', 'message.endless': 'لا نهائي', 'message.endlessBody': 'ترتفع الصعوبة. لديك ثلاث فرص.', 'message.curated': 'مسألة مصنوعة يدويًا {round} من {count}.', 'message.standardBody': 'غيّر رقمًا واحدًا ثم تحقق.', 'message.challengeBody': 'جولة أصعب. خذ وقتك.' },
        bn: { 'message.howToPlay': 'কীভাবে খেলবেন', 'message.tutorial': 'একটি সংখ্যা 1 করুন।', 'message.daily': 'দৈনিক ধাঁধা', 'message.dailyBody': 'আজকের জন্য একটি সবার ধাঁধা।', 'message.timed': 'সময়বদ্ধ', 'message.timedBody': '60 সেকেন্ডে যত পারেন সমাধান করুন।', 'message.endless': 'অন্তহীন', 'message.endlessBody': 'কঠিনতা বাড়ে। আপনার তিনটি সুযোগ আছে।', 'message.curated': 'হাতে তৈরি ধাঁধা {round}/{count}।', 'message.standardBody': 'একটি সংখ্যা বদলে পরীক্ষা করুন।', 'message.challengeBody': 'কঠিন রাউন্ড। সময় নিন।' },
        ja: { 'message.howToPlay': '遊び方', 'message.tutorial': '数を一つだけ1に変えます。', 'message.daily': 'デイリー問題', 'message.dailyBody': '今日の共通問題です。', 'message.timed': 'タイムアタック', 'message.timedBody': '60秒でできるだけ多く解きます。', 'message.endless': 'エンドレス', 'message.endlessBody': '難易度が上がります。チャンスは3回です。', 'message.curated': '手作り問題 {round}/{count}。', 'message.standardBody': '数を一つ変えて、確認します。', 'message.challengeBody': '少し難しいラウンドです。ゆっくりどうぞ。' },
        hi: { 'message.howToPlay': 'कैसे खेलें', 'message.tutorial': 'एक संख्या को 1 में बदलें।', 'message.daily': 'दैनिक पहेली', 'message.dailyBody': 'आज के लिए एक साझा पहेली।', 'message.timed': 'समयबद्ध', 'message.timedBody': '60 सेकंड में जितनी हो सके हल करें।', 'message.endless': 'अंतहीन', 'message.endlessBody': 'कठिनाई बढ़ती है। आपके पास तीन मौके हैं।', 'message.curated': 'हाथ से बनाई पहेली {round}/{count}।', 'message.standardBody': 'एक संख्या बदलें, फिर जाँचें।', 'message.challengeBody': 'कठिन राउंड। अपना समय लें।' },
        pt: { 'message.howToPlay': 'Como jogar', 'message.tutorial': 'Mude um número para 1.', 'message.daily': 'Problema diário', 'message.dailyBody': 'Um problema compartilhado para hoje.', 'message.timed': 'Cronometrado', 'message.timedBody': 'Resolva o máximo que puder em 60 segundos.', 'message.endless': 'Infinito', 'message.endlessBody': 'A dificuldade aumenta. Você tem três chances.', 'message.curated': 'Problema feito à mão {round}/{count}.', 'message.standardBody': 'Mude um número e verifique.', 'message.challengeBody': 'Uma rodada mais difícil. Vá com calma.' },
        ru: { 'message.howToPlay': 'Как играть', 'message.tutorial': 'Измените одно число на 1.', 'message.daily': 'Задача дня', 'message.dailyBody': 'Одна общая задача на сегодня.', 'message.timed': 'На время', 'message.timedBody': 'Решите как можно больше за 60 секунд.', 'message.endless': 'Бесконечно', 'message.endlessBody': 'Сложность растёт. У вас три шанса.', 'message.curated': 'Ручная задача {round}/{count}.', 'message.standardBody': 'Измените одно число и проверьте.', 'message.challengeBody': 'Более сложный раунд. Не спешите.' },
        vi: { 'message.howToPlay': 'Cách chơi', 'message.tutorial': 'Đổi một số thành 1.', 'message.daily': 'Câu đố hằng ngày', 'message.dailyBody': 'Một câu đố chung cho hôm nay.', 'message.timed': 'Tính giờ', 'message.timedBody': 'Giải được bao nhiêu trong 60 giây.', 'message.endless': 'Vô tận', 'message.endlessBody': 'Độ khó tăng dần. Bạn có ba cơ hội.', 'message.curated': 'Câu đố làm tay {round}/{count}.', 'message.standardBody': 'Đổi một số, rồi kiểm tra.', 'message.challengeBody': 'Một vòng khó hơn. Cứ từ tốn.' },
        tr: { 'message.howToPlay': 'Nasıl oynanır', 'message.tutorial': 'Bir sayıyı 1 yapın.', 'message.daily': 'Günlük bulmaca', 'message.dailyBody': 'Bugün için tek ortak bulmaca.', 'message.timed': 'Süreli', 'message.timedBody': '60 saniyede olabildiğince çok çözün.', 'message.endless': 'Sonsuz', 'message.endlessBody': 'Zorluk artar. Üç şansınız var.', 'message.curated': 'El yapımı bulmaca {round}/{count}.', 'message.standardBody': 'Bir sayıyı değiştirip kontrol edin.', 'message.challengeBody': 'Daha zor bir tur. Acele etmeyin.' },
        ur: { 'message.howToPlay': 'کیسے کھیلیں', 'message.tutorial': 'ایک عدد کو 1 میں بدلیں۔', 'message.daily': 'روزانہ پہیلی', 'message.dailyBody': 'آج کے لیے ایک مشترک پہیلی۔', 'message.timed': 'وقت کے ساتھ', 'message.timedBody': '60 سیکنڈ میں جتنی ہو سکے حل کریں۔', 'message.endless': 'لامتناہی', 'message.endlessBody': 'مشکل بڑھتی ہے۔ آپ کے پاس تین موقعے ہیں۔', 'message.curated': 'ہاتھ سے بنائی پہیلی {round}/{count}۔', 'message.standardBody': 'ایک عدد بدلیں، پھر جانچیں۔', 'message.challengeBody': 'زیادہ مشکل راؤنڈ۔ اطمینان سے کریں۔' }
    };
    for (const code of AVAILABLE_LOCALES) Object.assign(messages[code], openingMessages[code]);

    const curatedMessages = {
        en: { 'curated.original': 'The original', 'curated.product': 'Product placement', 'curated.root': 'Root and remainder', 'curated.power': 'A small power', 'curated.divide': 'Evenly divided' },
        es: { 'curated.original': 'El original', 'curated.product': 'Ubicación del producto', 'curated.root': 'Raíz y resto', 'curated.power': 'Una potencia pequeña', 'curated.divide': 'División exacta' },
        zh: { 'curated.original': '原作', 'curated.product': '乘积安排', 'curated.root': '根与余数', 'curated.power': '小幂', 'curated.divide': '整除' },
        ar: { 'curated.original': 'الأصلية', 'curated.product': 'موضع الناتج', 'curated.root': 'الجذر والباقي', 'curated.power': 'قوة صغيرة', 'curated.divide': 'قسمة متساوية' },
        bn: { 'curated.original': 'মূলটি', 'curated.product': 'গুণফলের স্থান', 'curated.root': 'মূল ও ভাগশেষ', 'curated.power': 'ছোট ঘাত', 'curated.divide': 'সমান ভাগ' },
        ja: { 'curated.original': 'オリジナル', 'curated.product': '積の配置', 'curated.root': '根と余り', 'curated.power': '小さなべき乗', 'curated.divide': '割り切れる割り算' },
        hi: { 'curated.original': 'मूल', 'curated.product': 'गुणनफल का स्थान', 'curated.root': 'मूल और शेष', 'curated.power': 'छोटी घात', 'curated.divide': 'पूरा विभाजन' },
        pt: { 'curated.original': 'O original', 'curated.product': 'Lugar do produto', 'curated.root': 'Raiz e resto', 'curated.power': 'Uma pequena potência', 'curated.divide': 'Divisão exata' },
        ru: { 'curated.original': 'Оригинал', 'curated.product': 'Место произведения', 'curated.root': 'Корень и остаток', 'curated.power': 'Небольшая степень', 'curated.divide': 'Делится нацело' },
        vi: { 'curated.original': 'Bản gốc', 'curated.product': 'Vị trí tích', 'curated.root': 'Căn và số dư', 'curated.power': 'Lũy thừa nhỏ', 'curated.divide': 'Chia hết' },
        tr: { 'curated.original': 'Özgün olan', 'curated.product': 'Çarpımın yeri', 'curated.root': 'Kök ve kalan', 'curated.power': 'Küçük bir üs', 'curated.divide': 'Tam bölünür' },
        ur: { 'curated.original': 'اصل', 'curated.product': 'حاصل ضرب کی جگہ', 'curated.root': 'جذر اور باقی', 'curated.power': 'چھوٹی طاقت', 'curated.divide': 'پورا تقسیم' }
    };
    for (const code of AVAILABLE_LOCALES) Object.assign(messages[code], curatedMessages[code]);

    const resultMessages = {
        en: { 'result.balanced': 'Balanced', 'result.balancedBody': 'Both sides match. Review, then continue.', 'result.retry': 'Not balanced', 'result.retryBody': 'The same puzzle is ready to try again.', 'result.solution': 'Solution shown', 'result.solutionBody': 'This one is not counted. Review, then continue.' },
        es: { 'result.balanced': 'Equilibrado', 'result.balancedBody': 'Ambos lados coinciden. Revisa y continúa.', 'result.retry': 'Aún no está equilibrado', 'result.retryBody': 'El mismo problema está listo para otro intento.', 'result.solution': 'Solución mostrada', 'result.solutionBody': 'Este intento no cuenta. Revisa y continúa.' },
        zh: { 'result.balanced': '已平衡', 'result.balancedBody': '等式两边相等。查看后继续。', 'result.retry': '尚未平衡', 'result.retryBody': '可以再试一次同一道题。', 'result.solution': '已显示解法', 'result.solutionBody': '这题不计入成绩。查看后继续。' },
        ar: { 'result.balanced': 'متوازن', 'result.balancedBody': 'الطرفان متساويان. راجع ثم تابع.', 'result.retry': 'غير متوازن', 'result.retryBody': 'المسألة نفسها جاهزة لمحاولة أخرى.', 'result.solution': 'تم إظهار الحل', 'result.solutionBody': 'لا تُحسب هذه المحاولة. راجع ثم تابع.' },
        bn: { 'result.balanced': 'সমান হয়েছে', 'result.balancedBody': 'দুই পাশ মিলে গেছে। দেখুন, তারপর এগোন।', 'result.retry': 'এখনও সমান নয়', 'result.retryBody': 'একই ধাঁধা আবার চেষ্টা করা যাবে।', 'result.solution': 'সমাধান দেখানো হয়েছে', 'result.solutionBody': 'এটি গণনা হবে না। দেখুন, তারপর এগোন।' },
        ja: { 'result.balanced': 'つり合いました', 'result.balancedBody': '両辺が一致しました。確認して続けます。', 'result.retry': 'まだつり合っていません', 'result.retryBody': '同じ問題をもう一度試せます。', 'result.solution': '答えを表示しました', 'result.solutionBody': 'この問題は記録されません。確認して続けます。' },
        hi: { 'result.balanced': 'संतुलित', 'result.balancedBody': 'दोनों पक्ष बराबर हैं। देखें, फिर आगे बढ़ें।', 'result.retry': 'अभी संतुलित नहीं', 'result.retryBody': 'इसी पहेली को फिर आज़मा सकते हैं।', 'result.solution': 'हल दिखाया गया', 'result.solutionBody': 'यह प्रयास नहीं गिना जाएगा। देखें, फिर आगे बढ़ें।' },
        pt: { 'result.balanced': 'Equilibrado', 'result.balancedBody': 'Os dois lados são iguais. Confira e continue.', 'result.retry': 'Ainda não está equilibrado', 'result.retryBody': 'O mesmo problema está pronto para outra tentativa.', 'result.solution': 'Solução mostrada', 'result.solutionBody': 'Esta não conta. Confira e continue.' },
        ru: { 'result.balanced': 'Равенство верно', 'result.balancedBody': 'Обе стороны совпали. Посмотрите и продолжайте.', 'result.retry': 'Пока не равно', 'result.retryBody': 'Эту же задачу можно попробовать ещё раз.', 'result.solution': 'Решение показано', 'result.solutionBody': 'Эта попытка не учитывается. Посмотрите и продолжайте.' },
        vi: { 'result.balanced': 'Đã cân bằng', 'result.balancedBody': 'Hai vế khớp nhau. Xem lại rồi tiếp tục.', 'result.retry': 'Chưa cân bằng', 'result.retryBody': 'Bạn có thể thử lại câu đố này.', 'result.solution': 'Đã hiện lời giải', 'result.solutionBody': 'Lần này không được tính. Xem lại rồi tiếp tục.' },
        tr: { 'result.balanced': 'Dengeli', 'result.balancedBody': 'İki taraf eşit. İnceleyip devam edin.', 'result.retry': 'Henüz dengeli değil', 'result.retryBody': 'Aynı bulmacayı yeniden deneyebilirsiniz.', 'result.solution': 'Çözüm gösterildi', 'result.solutionBody': 'Bu deneme sayılmaz. İnceleyip devam edin.' },
        ur: { 'result.balanced': 'برابر ہے', 'result.balancedBody': 'دونوں طرف برابر ہیں۔ دیکھیں، پھر آگے بڑھیں۔', 'result.retry': 'ابھی برابر نہیں', 'result.retryBody': 'اسی پہیلی کو دوبارہ آزمایا جا سکتا ہے۔', 'result.solution': 'حل دکھا دیا گیا', 'result.solutionBody': 'یہ کوشش شمار نہیں ہوگی۔ دیکھیں، پھر آگے بڑھیں۔' }
    };
    for (const code of AVAILABLE_LOCALES) Object.assign(messages[code], resultMessages[code]);

    const feedbackMessages = {
        en: { 'aria.changeNumber': 'Change {number} to 1', 'aria.restoreNumber': 'Restore {number}', 'feedback.totals': 'Your totals: {left} and {right}.', 'feedback.solution': 'Change {number} to 1. Both sides become {total}.' },
        es: { 'aria.changeNumber': 'Cambiar {number} por 1', 'aria.restoreNumber': 'Restaurar {number}', 'feedback.totals': 'Tus totales: {left} y {right}.', 'feedback.solution': 'Cambia {number} por 1. Ambos lados quedan en {total}.' },
        zh: { 'aria.changeNumber': '将 {number} 改为 1', 'aria.restoreNumber': '恢复 {number}', 'feedback.totals': '当前结果：{left} 和 {right}。', 'feedback.solution': '将 {number} 改为 1。两边都会变为 {total}。' },
        ar: { 'aria.changeNumber': 'غيّر {number} إلى 1', 'aria.restoreNumber': 'استعد {number}', 'feedback.totals': 'المجموعان: {left} و{right}.', 'feedback.solution': 'غيّر {number} إلى 1. يصبح الطرفان {total}.' },
        bn: { 'aria.changeNumber': '{number} কে 1 করুন', 'aria.restoreNumber': '{number} ফিরিয়ে আনুন', 'feedback.totals': 'আপনার যোগফল: {left} ও {right}।', 'feedback.solution': '{number} কে 1 করুন। দুই পাশ হবে {total}।' },
        ja: { 'aria.changeNumber': '{number}を1に変える', 'aria.restoreNumber': '{number}に戻す', 'feedback.totals': '現在の値：{left} と {right}。', 'feedback.solution': '{number}を1に変えると、両辺が {total} になります。' },
        hi: { 'aria.changeNumber': '{number} को 1 में बदलें', 'aria.restoreNumber': '{number} वापस करें', 'feedback.totals': 'आपके कुल: {left} और {right}।', 'feedback.solution': '{number} को 1 में बदलें। दोनों पक्ष {total} हो जाएँगे।' },
        pt: { 'aria.changeNumber': 'Mudar {number} para 1', 'aria.restoreNumber': 'Restaurar {number}', 'feedback.totals': 'Seus totais: {left} e {right}.', 'feedback.solution': 'Mude {number} para 1. Os dois lados passam a ser {total}.' },
        ru: { 'aria.changeNumber': 'Изменить {number} на 1', 'aria.restoreNumber': 'Вернуть {number}', 'feedback.totals': 'Ваши суммы: {left} и {right}.', 'feedback.solution': 'Измените {number} на 1. Обе стороны станут равны {total}.' },
        vi: { 'aria.changeNumber': 'Đổi {number} thành 1', 'aria.restoreNumber': 'Khôi phục {number}', 'feedback.totals': 'Tổng hiện tại: {left} và {right}.', 'feedback.solution': 'Đổi {number} thành 1. Hai vế sẽ là {total}.' },
        tr: { 'aria.changeNumber': '{number} sayısını 1 yap', 'aria.restoreNumber': '{number} sayısını geri al', 'feedback.totals': 'Toplamlarınız: {left} ve {right}.', 'feedback.solution': '{number} sayısını 1 yapın. İki taraf {total} olur.' },
        ur: { 'aria.changeNumber': '{number} کو 1 میں بدلیں', 'aria.restoreNumber': '{number} بحال کریں', 'feedback.totals': 'آپ کے کل: {left} اور {right}۔', 'feedback.solution': '{number} کو 1 میں بدلیں۔ دونوں طرف {total} ہو جائیں گے۔' }
    };
    for (const code of AVAILABLE_LOCALES) Object.assign(messages[code], feedbackMessages[code]);

    const accessibilityMessages = {
        en: { 'page.accessibility': 'Accessibility & sound', 'setting.sound': 'Sound effects', 'setting.largeText': 'Larger text', 'setting.contrast': 'Higher contrast', 'setting.clutter': 'Reduced clutter' },
        es: { 'page.accessibility': 'Accesibilidad y sonido', 'setting.sound': 'Efectos de sonido', 'setting.largeText': 'Texto más grande', 'setting.contrast': 'Mayor contraste', 'setting.clutter': 'Interfaz simplificada' },
        zh: { 'page.accessibility': '无障碍与声音', 'setting.sound': '音效', 'setting.largeText': '更大文字', 'setting.contrast': '更高对比度', 'setting.clutter': '减少干扰' },
        ar: { 'page.accessibility': 'الإتاحة والصوت', 'setting.sound': 'مؤثرات صوتية', 'setting.largeText': 'نص أكبر', 'setting.contrast': 'تباين أعلى', 'setting.clutter': 'تقليل التشتيت' },
        bn: { 'page.accessibility': 'সহায়ক সুবিধা ও শব্দ', 'setting.sound': 'শব্দের প্রভাব', 'setting.largeText': 'বড় লেখা', 'setting.contrast': 'বেশি বৈপরীত্য', 'setting.clutter': 'কম উপাদান' },
        ja: { 'page.accessibility': 'アクセシビリティとサウンド', 'setting.sound': '効果音', 'setting.largeText': '大きい文字', 'setting.contrast': '高コントラスト', 'setting.clutter': '表示を減らす' },
        hi: { 'page.accessibility': 'सुगम्यता और ध्वनि', 'setting.sound': 'ध्वनि प्रभाव', 'setting.largeText': 'बड़ा पाठ', 'setting.contrast': 'अधिक कंट्रास्ट', 'setting.clutter': 'कम अव्यवस्था' },
        pt: { 'page.accessibility': 'Acessibilidade e som', 'setting.sound': 'Efeitos sonoros', 'setting.largeText': 'Texto maior', 'setting.contrast': 'Maior contraste', 'setting.clutter': 'Menos elementos' },
        ru: { 'page.accessibility': 'Доступность и звук', 'setting.sound': 'Звуковые эффекты', 'setting.largeText': 'Крупнее текст', 'setting.contrast': 'Выше контраст', 'setting.clutter': 'Меньше деталей' },
        vi: { 'page.accessibility': 'Trợ năng và âm thanh', 'setting.sound': 'Hiệu ứng âm thanh', 'setting.largeText': 'Chữ lớn hơn', 'setting.contrast': 'Tương phản cao hơn', 'setting.clutter': 'Ít chi tiết hơn' },
        tr: { 'page.accessibility': 'Erişilebilirlik ve ses', 'setting.sound': 'Ses efektleri', 'setting.largeText': 'Daha büyük metin', 'setting.contrast': 'Daha yüksek kontrast', 'setting.clutter': 'Daha az öğe' },
        ur: { 'page.accessibility': 'رسائی اور آواز', 'setting.sound': 'صوتی اثرات', 'setting.largeText': 'بڑا متن', 'setting.contrast': 'زیادہ تضاد', 'setting.clutter': 'کم عناصر' }
    };
    for (const code of AVAILABLE_LOCALES) Object.assign(messages[code], accessibilityMessages[code]);

    const pageMessages = {
        en: { 'tagline': 'One move. Make it count.', 'action.yourMove': 'Your move', 'page.statsHistory': 'Stats & history', 'page.statsDifficulty': 'Stats by difficulty', 'page.problemHistory': 'Problem history', 'page.achievements': 'Achievements' },
        es: { 'tagline': 'Un movimiento. Haz que cuente.', 'action.yourMove': 'Tu movimiento', 'page.statsHistory': 'Estadísticas e historial', 'page.statsDifficulty': 'Estadísticas por dificultad', 'page.problemHistory': 'Historial de problemas', 'page.achievements': 'Logros' },
        zh: { 'tagline': '一步到位。认真思考。', 'action.yourMove': '你的操作', 'page.statsHistory': '统计与历史', 'page.statsDifficulty': '按难度统计', 'page.problemHistory': '题目历史', 'page.achievements': '成就' },
        ar: { 'tagline': 'حركة واحدة. اجعلها مؤثرة.', 'action.yourMove': 'حركتك', 'page.statsHistory': 'الإحصاءات والسجل', 'page.statsDifficulty': 'إحصاءات حسب الصعوبة', 'page.problemHistory': 'سجل المسائل', 'page.achievements': 'الإنجازات' },
        bn: { 'tagline': 'একটি চাল। সেটি গুরুত্বপূর্ণ করুন।', 'action.yourMove': 'আপনার চাল', 'page.statsHistory': 'পরিসংখ্যান ও ইতিহাস', 'page.statsDifficulty': 'কঠিনতা অনুযায়ী পরিসংখ্যান', 'page.problemHistory': 'প্রশ্নের ইতিহাস', 'page.achievements': 'অর্জন' },
        ja: { 'tagline': '一手に集中しよう。', 'action.yourMove': 'あなたの手番', 'page.statsHistory': '統計と履歴', 'page.statsDifficulty': '難易度別の統計', 'page.problemHistory': '問題履歴', 'page.achievements': '実績' },
        hi: { 'tagline': 'एक चाल। उसे सार्थक बनाएँ।', 'action.yourMove': 'आपकी चाल', 'page.statsHistory': 'आँकड़े और इतिहास', 'page.statsDifficulty': 'कठिनाई के अनुसार आँकड़े', 'page.problemHistory': 'पहेली इतिहास', 'page.achievements': 'उपलब्धियाँ' },
        pt: { 'tagline': 'Uma jogada. Faça valer.', 'action.yourMove': 'Sua jogada', 'page.statsHistory': 'Estatísticas e histórico', 'page.statsDifficulty': 'Estatísticas por dificuldade', 'page.problemHistory': 'Histórico de problemas', 'page.achievements': 'Conquistas' },
        ru: { 'tagline': 'Один ход. Пусть он сработает.', 'action.yourMove': 'Ваш ход', 'page.statsHistory': 'Статистика и история', 'page.statsDifficulty': 'Статистика по сложности', 'page.problemHistory': 'История задач', 'page.achievements': 'Достижения' },
        vi: { 'tagline': 'Một lần đổi. Hãy chọn kỹ.', 'action.yourMove': 'Lượt của bạn', 'page.statsHistory': 'Thống kê và lịch sử', 'page.statsDifficulty': 'Thống kê theo độ khó', 'page.problemHistory': 'Lịch sử câu đố', 'page.achievements': 'Thành tựu' },
        tr: { 'tagline': 'Tek hamle. Değerli olsun.', 'action.yourMove': 'Sıranız', 'page.statsHistory': 'İstatistikler ve geçmiş', 'page.statsDifficulty': 'Zorluğa göre istatistikler', 'page.problemHistory': 'Bulmaca geçmişi', 'page.achievements': 'Başarılar' },
        ur: { 'tagline': 'ایک چال۔ اسے اہم بنائیں۔', 'action.yourMove': 'آپ کی چال', 'page.statsHistory': 'اعداد و شمار اور تاریخ', 'page.statsDifficulty': 'مشکل کے لحاظ سے اعداد و شمار', 'page.problemHistory': 'پہیلی کی تاریخ', 'page.achievements': 'کامیابیاں' }
    };
    for (const code of AVAILABLE_LOCALES) Object.assign(messages[code], pageMessages[code]);

    const progressMessages = {
        en: { 'progress.custom': '{correct}/{goal} correct · {accuracy}%/{rate}%', 'progress.chances': 'Chances: {chances}' },
        es: { 'progress.custom': '{correct}/{goal} correctas · {accuracy}%/{rate}%', 'progress.chances': 'Oportunidades: {chances}' },
        zh: { 'progress.custom': '正确 {correct}/{goal} · {accuracy}%/{rate}%', 'progress.chances': '机会：{chances}' },
        ar: { 'progress.custom': '{correct}/{goal} صحيح · {accuracy}%/{rate}%', 'progress.chances': 'الفرص: {chances}' },
        bn: { 'progress.custom': 'সঠিক {correct}/{goal} · {accuracy}%/{rate}%', 'progress.chances': 'সুযোগ: {chances}' },
        ja: { 'progress.custom': '正解 {correct}/{goal} · {accuracy}%/{rate}%', 'progress.chances': 'チャンス：{chances}' },
        hi: { 'progress.custom': '{correct}/{goal} सही · {accuracy}%/{rate}%', 'progress.chances': 'मौके: {chances}' },
        pt: { 'progress.custom': '{correct}/{goal} corretas · {accuracy}%/{rate}%', 'progress.chances': 'Chances: {chances}' },
        ru: { 'progress.custom': 'верно {correct}/{goal} · {accuracy}%/{rate}%', 'progress.chances': 'Шансы: {chances}' },
        vi: { 'progress.custom': 'đúng {correct}/{goal} · {accuracy}%/{rate}%', 'progress.chances': 'Cơ hội: {chances}' },
        tr: { 'progress.custom': '{correct}/{goal} doğru · %{accuracy}/%{rate}', 'progress.chances': 'Şanslar: {chances}' },
        ur: { 'progress.custom': 'درست {correct}/{goal} · {accuracy}%/{rate}%', 'progress.chances': 'موقعے: {chances}' }
    };
    for (const code of AVAILABLE_LOCALES) Object.assign(messages[code], progressMessages[code]);

    const achievementMessages = {
        en: { 'achievement.first.name': 'First 1', 'achievement.first.description': 'Solve one puzzle.', 'achievement.streak5.name': 'Five in a row', 'achievement.streak5.description': 'Solve five in a row.', 'achievement.twenty.name': 'Twenty solved', 'achievement.twenty.description': 'Solve 20 puzzles.', 'achievement.explorer.name': 'All operations', 'achievement.explorer.description': 'Use every operation.', 'achievement.daily.name': 'Daily puzzle', 'achievement.daily.description': 'Finish a Daily puzzle.', 'achievement.nohint.name': 'No hint', 'achievement.nohint.description': 'Finish a Challenge without a hint.', 'achievement.curated.name': 'Complete set', 'achievement.curated.description': 'Finish all handcrafted puzzles.' },
        es: { 'achievement.first.name': 'Primer 1', 'achievement.first.description': 'Resuelve un problema.', 'achievement.streak5.name': 'Cinco seguidos', 'achievement.streak5.description': 'Resuelve cinco seguidos.', 'achievement.twenty.name': 'Veinte resueltos', 'achievement.twenty.description': 'Resuelve 20 problemas.', 'achievement.explorer.name': 'Todas las operaciones', 'achievement.explorer.description': 'Usa todas las operaciones.', 'achievement.daily.name': 'Problema diario', 'achievement.daily.description': 'Termina un problema diario.', 'achievement.nohint.name': 'Sin pista', 'achievement.nohint.description': 'Termina un desafío sin pista.', 'achievement.curated.name': 'Serie completa', 'achievement.curated.description': 'Termina todos los problemas artesanales.' },
        zh: { 'achievement.first.name': '第一个 1', 'achievement.first.description': '解开一道题。', 'achievement.streak5.name': '连续五题', 'achievement.streak5.description': '连续解开五题。', 'achievement.twenty.name': '解开二十题', 'achievement.twenty.description': '解开 20 道题。', 'achievement.explorer.name': '全部运算', 'achievement.explorer.description': '使用所有运算。', 'achievement.daily.name': '每日题目', 'achievement.daily.description': '完成一道每日题目。', 'achievement.nohint.name': '不用提示', 'achievement.nohint.description': '不使用提示完成挑战。', 'achievement.curated.name': '完整系列', 'achievement.curated.description': '完成所有精选题目。' },
        ar: { 'achievement.first.name': 'الـ1 الأول', 'achievement.first.description': 'حل مسألة واحدة.', 'achievement.streak5.name': 'خمسة متتالية', 'achievement.streak5.description': 'حل خمس مسائل متتالية.', 'achievement.twenty.name': 'عشرون محلولة', 'achievement.twenty.description': 'حل 20 مسألة.', 'achievement.explorer.name': 'كل العمليات', 'achievement.explorer.description': 'استخدم كل العمليات.', 'achievement.daily.name': 'مسألة يومية', 'achievement.daily.description': 'أكمل مسألة يومية.', 'achievement.nohint.name': 'دون تلميح', 'achievement.nohint.description': 'أكمل تحديًا دون تلميح.', 'achievement.curated.name': 'المجموعة الكاملة', 'achievement.curated.description': 'أكمل كل المسائل المصنوعة يدويًا.' },
        bn: { 'achievement.first.name': 'প্রথম 1', 'achievement.first.description': 'একটি ধাঁধা সমাধান করুন।', 'achievement.streak5.name': 'পরপর পাঁচ', 'achievement.streak5.description': 'পরপর পাঁচটি সমাধান করুন।', 'achievement.twenty.name': 'বিশটি সমাধান', 'achievement.twenty.description': '20টি ধাঁধা সমাধান করুন।', 'achievement.explorer.name': 'সব ক্রিয়া', 'achievement.explorer.description': 'সব ক্রিয়া ব্যবহার করুন।', 'achievement.daily.name': 'দৈনিক ধাঁধা', 'achievement.daily.description': 'একটি দৈনিক ধাঁধা শেষ করুন।', 'achievement.nohint.name': 'ইঙ্গিত ছাড়া', 'achievement.nohint.description': 'ইঙ্গিত ছাড়া চ্যালেঞ্জ শেষ করুন।', 'achievement.curated.name': 'সম্পূর্ণ সেট', 'achievement.curated.description': 'সব হাতে তৈরি ধাঁধা শেষ করুন।' },
        ja: { 'achievement.first.name': '最初の1', 'achievement.first.description': '問題を一つ解く。', 'achievement.streak5.name': '5問連続', 'achievement.streak5.description': '5問連続で解く。', 'achievement.twenty.name': '20問解答', 'achievement.twenty.description': '20問解く。', 'achievement.explorer.name': '全演算', 'achievement.explorer.description': 'すべての演算を使う。', 'achievement.daily.name': 'デイリー問題', 'achievement.daily.description': 'デイリー問題を終える。', 'achievement.nohint.name': 'ヒントなし', 'achievement.nohint.description': 'ヒントなしでチャレンジを終える。', 'achievement.curated.name': '全問完了', 'achievement.curated.description': '手作り問題をすべて終える。' },
        hi: { 'achievement.first.name': 'पहला 1', 'achievement.first.description': 'एक पहेली हल करें।', 'achievement.streak5.name': 'लगातार पाँच', 'achievement.streak5.description': 'लगातार पाँच हल करें।', 'achievement.twenty.name': 'बीस हल', 'achievement.twenty.description': '20 पहेलियाँ हल करें।', 'achievement.explorer.name': 'सभी क्रियाएँ', 'achievement.explorer.description': 'हर क्रिया का उपयोग करें।', 'achievement.daily.name': 'दैनिक पहेली', 'achievement.daily.description': 'एक दैनिक पहेली पूरी करें।', 'achievement.nohint.name': 'बिना संकेत', 'achievement.nohint.description': 'बिना संकेत चुनौती पूरी करें।', 'achievement.curated.name': 'पूरा सेट', 'achievement.curated.description': 'सभी हाथ से बनी पहेलियाँ पूरी करें।' },
        pt: { 'achievement.first.name': 'Primeiro 1', 'achievement.first.description': 'Resolva um problema.', 'achievement.streak5.name': 'Cinco seguidos', 'achievement.streak5.description': 'Resolva cinco seguidos.', 'achievement.twenty.name': 'Vinte resolvidos', 'achievement.twenty.description': 'Resolva 20 problemas.', 'achievement.explorer.name': 'Todas as operações', 'achievement.explorer.description': 'Use todas as operações.', 'achievement.daily.name': 'Problema diário', 'achievement.daily.description': 'Conclua um problema diário.', 'achievement.nohint.name': 'Sem dica', 'achievement.nohint.description': 'Conclua um desafio sem dica.', 'achievement.curated.name': 'Série completa', 'achievement.curated.description': 'Conclua todos os problemas feitos à mão.' },
        ru: { 'achievement.first.name': 'Первая единица', 'achievement.first.description': 'Решите одну задачу.', 'achievement.streak5.name': 'Пять подряд', 'achievement.streak5.description': 'Решите пять подряд.', 'achievement.twenty.name': 'Двадцать решено', 'achievement.twenty.description': 'Решите 20 задач.', 'achievement.explorer.name': 'Все операции', 'achievement.explorer.description': 'Используйте все операции.', 'achievement.daily.name': 'Задача дня', 'achievement.daily.description': 'Завершите задачу дня.', 'achievement.nohint.name': 'Без подсказки', 'achievement.nohint.description': 'Завершите испытание без подсказки.', 'achievement.curated.name': 'Полный набор', 'achievement.curated.description': 'Завершите все ручные задачи.' },
        vi: { 'achievement.first.name': 'Số 1 đầu tiên', 'achievement.first.description': 'Giải một câu đố.', 'achievement.streak5.name': 'Năm lần liên tiếp', 'achievement.streak5.description': 'Giải năm câu liên tiếp.', 'achievement.twenty.name': 'Hai mươi câu', 'achievement.twenty.description': 'Giải 20 câu đố.', 'achievement.explorer.name': 'Mọi phép toán', 'achievement.explorer.description': 'Dùng mọi phép toán.', 'achievement.daily.name': 'Câu đố hằng ngày', 'achievement.daily.description': 'Hoàn thành câu đố hằng ngày.', 'achievement.nohint.name': 'Không gợi ý', 'achievement.nohint.description': 'Hoàn thành thử thách không cần gợi ý.', 'achievement.curated.name': 'Bộ hoàn chỉnh', 'achievement.curated.description': 'Hoàn thành mọi câu đố làm tay.' },
        tr: { 'achievement.first.name': 'İlk 1', 'achievement.first.description': 'Bir bulmaca çözün.', 'achievement.streak5.name': 'Art arda beş', 'achievement.streak5.description': 'Art arda beş çözün.', 'achievement.twenty.name': 'Yirmi çözüldü', 'achievement.twenty.description': '20 bulmaca çözün.', 'achievement.explorer.name': 'Tüm işlemler', 'achievement.explorer.description': 'Her işlemi kullanın.', 'achievement.daily.name': 'Günlük bulmaca', 'achievement.daily.description': 'Bir günlük bulmacayı bitirin.', 'achievement.nohint.name': 'İpucusuz', 'achievement.nohint.description': 'İpucu olmadan bir turu bitirin.', 'achievement.curated.name': 'Tam takım', 'achievement.curated.description': 'Tüm el yapımı bulmacaları bitirin.' },
        ur: { 'achievement.first.name': 'پہلا 1', 'achievement.first.description': 'ایک پہیلی حل کریں۔', 'achievement.streak5.name': 'لگاتار پانچ', 'achievement.streak5.description': 'لگاتار پانچ حل کریں۔', 'achievement.twenty.name': 'بیس حل', 'achievement.twenty.description': '20 پہیلیاں حل کریں۔', 'achievement.explorer.name': 'تمام عمل', 'achievement.explorer.description': 'ہر عمل استعمال کریں۔', 'achievement.daily.name': 'روزانہ پہیلی', 'achievement.daily.description': 'روزانہ پہیلی مکمل کریں۔', 'achievement.nohint.name': 'اشارے کے بغیر', 'achievement.nohint.description': 'اشارے کے بغیر چیلنج مکمل کریں۔', 'achievement.curated.name': 'مکمل سیٹ', 'achievement.curated.description': 'تمام ہاتھ سے بنائی پہیلیاں مکمل کریں۔' }
    };
    for (const code of AVAILABLE_LOCALES) Object.assign(messages[code], achievementMessages[code]);

    const shareMessages = {
        en: { 'share.copied': 'Copied', 'share.ready': 'Link and result are ready to paste.', 'share.prompt': 'Copy this puzzle link:' },
        es: { 'share.copied': 'Copiado', 'share.ready': 'El enlace y el resultado están listos para pegar.', 'share.prompt': 'Copia este enlace del problema:' },
        zh: { 'share.copied': '已复制', 'share.ready': '链接和结果可以粘贴了。', 'share.prompt': '复制此题链接：' },
        ar: { 'share.copied': 'تم النسخ', 'share.ready': 'الرابط والنتيجة جاهزان للّصق.', 'share.prompt': 'انسخ رابط المسألة:' },
        bn: { 'share.copied': 'কপি হয়েছে', 'share.ready': 'লিংক ও ফলাফল পেস্ট করার জন্য প্রস্তুত।', 'share.prompt': 'এই ধাঁধার লিংক কপি করুন:' },
        ja: { 'share.copied': 'コピーしました', 'share.ready': 'リンクと結果を貼り付けられます。', 'share.prompt': 'この問題のリンクをコピー:' },
        hi: { 'share.copied': 'कॉपी किया गया', 'share.ready': 'लिंक और परिणाम चिपकाने के लिए तैयार हैं।', 'share.prompt': 'इस पहेली का लिंक कॉपी करें:' },
        pt: { 'share.copied': 'Copiado', 'share.ready': 'O link e o resultado estão prontos para colar.', 'share.prompt': 'Copie este link do problema:' },
        ru: { 'share.copied': 'Скопировано', 'share.ready': 'Ссылка и результат готовы к вставке.', 'share.prompt': 'Скопируйте ссылку на задачу:' },
        vi: { 'share.copied': 'Đã sao chép', 'share.ready': 'Liên kết và kết quả đã sẵn sàng để dán.', 'share.prompt': 'Sao chép liên kết câu đố này:' },
        tr: { 'share.copied': 'Kopyalandı', 'share.ready': 'Bağlantı ve sonuç yapıştırmaya hazır.', 'share.prompt': 'Bu bulmaca bağlantısını kopyalayın:' },
        ur: { 'share.copied': 'کاپی ہو گیا', 'share.ready': 'لنک اور نتیجہ چسپاں کرنے کے لیے تیار ہیں۔', 'share.prompt': 'اس پہیلی کا لنک کاپی کریں:' }
    };
    for (const code of AVAILABLE_LOCALES) Object.assign(messages[code], shareMessages[code]);

    const customValidationMessages = {
        en: { 'custom.chooseOperation': 'Choose an operation', 'custom.chooseOperationBody': 'Choose at least one operation.', 'custom.chooseIdentity': 'Choose +, −, ×, ÷, or ^', 'custom.chooseIdentityBody': 'Include an operation that can change a number to 1.', 'custom.checkTargets': 'Check the targets', 'custom.checkTargetsBody': 'The minimum cannot exceed the maximum.' },
        es: { 'custom.chooseOperation': 'Elige una operación', 'custom.chooseOperationBody': 'Elige al menos una operación.', 'custom.chooseIdentity': 'Elige +, −, ×, ÷ o ^', 'custom.chooseIdentityBody': 'Incluye una operación que pueda cambiar un número a 1.', 'custom.checkTargets': 'Comprueba los objetivos', 'custom.checkTargetsBody': 'El mínimo no puede superar el máximo.' },
        zh: { 'custom.chooseOperation': '选择运算', 'custom.chooseOperationBody': '至少选择一种运算。', 'custom.chooseIdentity': '选择 +、−、×、÷ 或 ^', 'custom.chooseIdentityBody': '包含一种可将数字改为 1 的运算。', 'custom.checkTargets': '检查目标', 'custom.checkTargetsBody': '最小值不能超过最大值。' },
        ar: { 'custom.chooseOperation': 'اختر عملية', 'custom.chooseOperationBody': 'اختر عملية واحدة على الأقل.', 'custom.chooseIdentity': 'اختر + أو − أو × أو ÷ أو ^', 'custom.chooseIdentityBody': 'أضف عملية يمكنها تغيير رقم إلى 1.', 'custom.checkTargets': 'تحقق من الأهداف', 'custom.checkTargetsBody': 'لا يمكن أن يتجاوز الأدنى الأقصى.' },
        bn: { 'custom.chooseOperation': 'একটি ক্রিয়া বেছে নিন', 'custom.chooseOperationBody': 'অন্তত একটি ক্রিয়া বেছে নিন।', 'custom.chooseIdentity': '+, −, ×, ÷ বা ^ বেছে নিন', 'custom.chooseIdentityBody': 'এমন ক্রিয়া রাখুন যা সংখ্যা 1 করতে পারে।', 'custom.checkTargets': 'লক্ষ্য পরীক্ষা করুন', 'custom.checkTargetsBody': 'সর্বনিম্ন সর্বোচ্চের বেশি হতে পারে না।' },
        ja: { 'custom.chooseOperation': '演算を選ぶ', 'custom.chooseOperationBody': '少なくとも一つ選びます。', 'custom.chooseIdentity': '+、−、×、÷、^ を選ぶ', 'custom.chooseIdentityBody': '数を1に変えられる演算を含めます。', 'custom.checkTargets': '目標を確認', 'custom.checkTargetsBody': '最小値は最大値を超えられません。' },
        hi: { 'custom.chooseOperation': 'एक क्रिया चुनें', 'custom.chooseOperationBody': 'कम से कम एक क्रिया चुनें।', 'custom.chooseIdentity': '+, −, ×, ÷ या ^ चुनें', 'custom.chooseIdentityBody': 'ऐसी क्रिया रखें जो संख्या को 1 कर सके।', 'custom.checkTargets': 'लक्ष्य जाँचें', 'custom.checkTargetsBody': 'न्यूनतम अधिकतम से बड़ा नहीं हो सकता।' },
        pt: { 'custom.chooseOperation': 'Escolha uma operação', 'custom.chooseOperationBody': 'Escolha ao menos uma operação.', 'custom.chooseIdentity': 'Escolha +, −, ×, ÷ ou ^', 'custom.chooseIdentityBody': 'Inclua uma operação que possa mudar um número para 1.', 'custom.checkTargets': 'Confira as metas', 'custom.checkTargetsBody': 'A mínima não pode superar a máxima.' },
        ru: { 'custom.chooseOperation': 'Выберите операцию', 'custom.chooseOperationBody': 'Выберите хотя бы одну операцию.', 'custom.chooseIdentity': 'Выберите +, −, ×, ÷ или ^', 'custom.chooseIdentityBody': 'Добавьте операцию, которая может изменить число на 1.', 'custom.checkTargets': 'Проверьте цели', 'custom.checkTargetsBody': 'Минимум не может быть больше максимума.' },
        vi: { 'custom.chooseOperation': 'Chọn phép toán', 'custom.chooseOperationBody': 'Chọn ít nhất một phép toán.', 'custom.chooseIdentity': 'Chọn +, −, ×, ÷ hoặc ^', 'custom.chooseIdentityBody': 'Thêm phép toán có thể đổi một số thành 1.', 'custom.checkTargets': 'Kiểm tra mục tiêu', 'custom.checkTargetsBody': 'Giá trị nhỏ nhất không thể lớn hơn lớn nhất.' },
        tr: { 'custom.chooseOperation': 'Bir işlem seçin', 'custom.chooseOperationBody': 'En az bir işlem seçin.', 'custom.chooseIdentity': '+, −, ×, ÷ veya ^ seçin', 'custom.chooseIdentityBody': 'Bir sayıyı 1 yapabilen bir işlem ekleyin.', 'custom.checkTargets': 'Hedefleri kontrol edin', 'custom.checkTargetsBody': 'En düşük değer en yükseği aşamaz.' },
        ur: { 'custom.chooseOperation': 'ایک عمل منتخب کریں', 'custom.chooseOperationBody': 'کم از کم ایک عمل منتخب کریں۔', 'custom.chooseIdentity': '+، −، ×، ÷ یا ^ منتخب کریں', 'custom.chooseIdentityBody': 'ایسا عمل شامل کریں جو عدد کو 1 کر سکے۔', 'custom.checkTargets': 'اہداف جانچیں', 'custom.checkTargetsBody': 'کم از کم زیادہ سے زیادہ سے بڑھ نہیں سکتا۔' }
    };
    for (const code of AVAILABLE_LOCALES) Object.assign(messages[code], customValidationMessages[code]);

    const timedResultMessages = {
        en: { 'timed.complete': 'Time is up', 'timed.result': 'Solved {count} in 60 seconds.' }, es: { 'timed.complete': 'Tiempo terminado', 'timed.result': 'Resolviste {count} en 60 segundos.' }, zh: { 'timed.complete': '时间到', 'timed.result': '在 60 秒内解开了 {count} 题。' }, ar: { 'timed.complete': 'انتهى الوقت', 'timed.result': 'حُلَّت {count} خلال 60 ثانية.' }, bn: { 'timed.complete': 'সময় শেষ', 'timed.result': '60 সেকেন্ডে {count}টি সমাধান করেছেন।' }, ja: { 'timed.complete': '時間切れ', 'timed.result': '60秒で {count} 問解きました。' }, hi: { 'timed.complete': 'समय समाप्त', 'timed.result': '60 सेकंड में {count} हल किए।' }, pt: { 'timed.complete': 'Tempo esgotado', 'timed.result': 'Resolveu {count} em 60 segundos.' }, ru: { 'timed.complete': 'Время вышло', 'timed.result': 'Решено за 60 секунд: {count}.' }, vi: { 'timed.complete': 'Hết giờ', 'timed.result': 'Đã giải {count} trong 60 giây.' }, tr: { 'timed.complete': 'Süre doldu', 'timed.result': '60 saniyede {count} çözüldü.' }, ur: { 'timed.complete': 'وقت ختم', 'timed.result': '60 سیکنڈ میں {count} حل کیے۔' }
    };
    for (const code of AVAILABLE_LOCALES) Object.assign(messages[code], timedResultMessages[code]);

    const finalMessages = {
        en: {
            'meta.description': 'Balance integer equations by changing exactly one number into a 1.',
            'action.hintTitle': 'Hint (H)',
            'modeDescription.tutorial': 'A guided introduction to the one-flip rule.',
            'modeDescription.daily': 'One shared seeded puzzle each UTC day.',
            'modeDescription.timed': 'Score as many correct answers as possible in 60 seconds.',
            'modeDescription.endless': 'Three chances while difficulty rises every eight rounds.',
            'modeDescription.challenges': 'Five handcrafted puzzles featuring different operations.',
            'modeDescription.custom': 'Your operations, length, seed, targets, and victory goal.',
            'custom.builder': 'Build a custom game', 'custom.builderBody': 'Choose the rules, then start the run. A seed makes it reproducible.',
            'custom.won': 'Custom game won!', 'custom.wonBody': '{correct}/{attempts} correct ({accuracy}%).',
            'daily.complete': 'Daily complete', 'daily.completeBody': 'Attempts: {attempts} · hints: {hints}',
            'daily.revealed': 'Daily solution revealed', 'daily.revealedBody': 'The shared result records this as a reveal.',
            'challenges.complete': 'Challenge set complete', 'challenges.completeBody': 'You solved all {count} handcrafted puzzles.',
            'endless.complete': 'Run complete', 'endless.completeBody': 'Puzzles solved: {count}. All three chances were used.',
            'endless.revealedBody': 'The revealed puzzle used your final chance.',
            'tutorial.good': 'Good move', 'tutorial.goodBody': 'The equation balances. Check it to finish.',
            'tutorial.restore': 'Try the outlined number', 'tutorial.restoreBody': 'Click the selected number again to restore it.',
            'tutorial.complete': 'Tutorial complete', 'tutorial.completeBody': 'Your first Easy round is ready.',
            'tutorial.retry': 'Not quite', 'tutorial.retryBody': 'Try changing the outlined 3, then check again.',
            'hint.side': 'Hint: choose a side', 'hint.sideBody': 'The outlined side contains the intended flip.',
            'hint.number': 'Hint: the number', 'hint.numberBody': 'The outlined number is the one used by the generated solution.',
            'shared.challenge': 'Shared handcrafted puzzle', 'shared.custom': 'Shared custom puzzle',
            'shared.customBody': 'This custom puzzle is reproduced from a shared link.',
            'shared.seeded': 'Shared seeded puzzle', 'shared.seededBody': 'This puzzle is reproduced from a shared link.',
            'share.dailyDefault': 'YOG1 Daily {date}',
            'share.dailySolved': 'YOG1 {date} · solved · attempts: {attempts} · hints: {hints}',
            'share.dailyRevealed': 'YOG1 {date} · solution revealed · attempts: {attempts} · hints: {hints}',
            'share.challenge': 'handcrafted challenge {round}', 'share.puzzle': '{mode} puzzle'
        },
        es: {
            'meta.description': 'Equilibra ecuaciones con enteros cambiando exactamente un número por 1.',
            'action.hintTitle': 'Pista (H)',
            'modeDescription.tutorial': 'Una introducción guiada a la regla de un solo cambio.',
            'modeDescription.daily': 'Un problema compartido con semilla cada día UTC.',
            'modeDescription.timed': 'Consigue tantas respuestas correctas como puedas en 60 segundos.',
            'modeDescription.endless': 'Tres oportunidades mientras la dificultad aumenta cada ocho rondas.',
            'modeDescription.challenges': 'Cinco problemas artesanales con distintas operaciones.',
            'modeDescription.custom': 'Tus operaciones, longitud, semilla, objetivos y meta de victoria.',
            'custom.builder': 'Crea un juego personalizado', 'custom.builderBody': 'Elige las reglas y comienza la partida. Una semilla la hace reproducible.',
            'custom.won': '¡Juego personalizado superado!', 'custom.wonBody': '{correct}/{attempts} correctas ({accuracy} %).',
            'daily.complete': 'Reto diario completado', 'daily.completeBody': 'Intentos: {attempts} · pistas: {hints}',
            'daily.revealed': 'Solución diaria mostrada', 'daily.revealedBody': 'El resultado compartido lo registra como solución mostrada.',
            'challenges.complete': 'Serie de desafíos completada', 'challenges.completeBody': 'Resolviste los {count} problemas artesanales.',
            'endless.complete': 'Partida terminada', 'endless.completeBody': 'Problemas resueltos: {count}. Agotaste las tres oportunidades.',
            'endless.revealedBody': 'El problema mostrado agotó tu última oportunidad.',
            'tutorial.good': 'Buen movimiento', 'tutorial.goodBody': 'La ecuación está equilibrada. Compruébala para terminar.',
            'tutorial.restore': 'Prueba el número resaltado', 'tutorial.restoreBody': 'Haz clic de nuevo en el número seleccionado para restaurarlo.',
            'tutorial.complete': 'Tutorial completado', 'tutorial.completeBody': 'Tu primera ronda Fácil está lista.',
            'tutorial.retry': 'Aún no', 'tutorial.retryBody': 'Cambia el 3 resaltado y vuelve a comprobar.',
            'hint.side': 'Pista: elige un lado', 'hint.sideBody': 'El lado resaltado contiene el cambio previsto.',
            'hint.number': 'Pista: el número', 'hint.numberBody': 'El número resaltado es el que usa la solución generada.',
            'shared.challenge': 'Problema artesanal compartido', 'shared.custom': 'Problema personalizado compartido',
            'shared.customBody': 'Este problema personalizado se reproduce desde un enlace compartido.',
            'shared.seeded': 'Problema con semilla compartido', 'shared.seededBody': 'Este problema se reproduce desde un enlace compartido.',
            'share.dailyDefault': 'YOG1 diario {date}',
            'share.dailySolved': 'YOG1 {date} · resuelto · intentos: {attempts} · pistas: {hints}',
            'share.dailyRevealed': 'YOG1 {date} · solución mostrada · intentos: {attempts} · pistas: {hints}',
            'share.challenge': 'desafío artesanal {round}', 'share.puzzle': 'problema {mode}'
        },
        zh: {
            'meta.description': '只需把一个数字改为 1，即可使整数等式平衡。',
            'action.hintTitle': '提示 (H)',
            'modeDescription.tutorial': '引导你了解只改一次数字的规则。',
            'modeDescription.daily': '每天一道 UTC 日期相同的共享种子题。',
            'modeDescription.timed': '在 60 秒内尽量多答对题目。',
            'modeDescription.endless': '每八轮难度提高一次，共有三次机会。',
            'modeDescription.challenges': '五道使用不同运算的精选题目。',
            'modeDescription.custom': '自选运算、长度、种子、目标和胜利条件。',
            'custom.builder': '创建自定义游戏', 'custom.builderBody': '选择规则后开始。种子可让游戏重现。',
            'custom.won': '自定义游戏胜利！', 'custom.wonBody': '答对 {correct}/{attempts}（{accuracy}%）。',
            'daily.complete': '每日题目完成', 'daily.completeBody': '尝试：{attempts} · 提示：{hints}',
            'daily.revealed': '已显示每日题解', 'daily.revealedBody': '共享结果会记录为已显示题解。',
            'challenges.complete': '挑战组完成', 'challenges.completeBody': '你解开了全部 {count} 道精选题目。',
            'endless.complete': '本局结束', 'endless.completeBody': '已解题数：{count}。三次机会已用完。',
            'endless.revealedBody': '显示这道题的解法用掉了最后一次机会。',
            'tutorial.good': '做得好', 'tutorial.goodBody': '等式已平衡。点击检查即可完成。',
            'tutorial.restore': '试试标出的数字', 'tutorial.restoreBody': '再次点击所选数字可恢复原值。',
            'tutorial.complete': '教程完成', 'tutorial.completeBody': '第一轮简单模式已准备好。',
            'tutorial.retry': '还不对', 'tutorial.retryBody': '试着改变标出的 3，然后再次检查。',
            'hint.side': '提示：选择一边', 'hint.sideBody': '标出的一边包含需要改变的数字。',
            'hint.number': '提示：这个数字', 'hint.numberBody': '标出的数字就是生成解法中要改变的数字。',
            'shared.challenge': '共享精选题目', 'shared.custom': '共享自定义题目',
            'shared.customBody': '此自定义题目由共享链接重现。',
            'shared.seeded': '共享种子题目', 'shared.seededBody': '此题由共享链接重现。',
            'share.dailyDefault': 'YOG1 每日题目 {date}',
            'share.dailySolved': 'YOG1 {date} · 已解开 · 尝试：{attempts} · 提示：{hints}',
            'share.dailyRevealed': 'YOG1 {date} · 已显示题解 · 尝试：{attempts} · 提示：{hints}',
            'share.challenge': '精选挑战 {round}', 'share.puzzle': '{mode}题目'
        },
        ar: {
            'meta.description': 'وازن معادلات الأعداد الصحيحة بتغيير رقم واحد فقط إلى 1.',
            'action.hintTitle': 'تلميح (H)',
            'modeDescription.tutorial': 'مقدمة إرشادية لقاعدة التغيير الواحد.',
            'modeDescription.daily': 'مسألة مشتركة واحدة ببذرة لكل يوم حسب UTC.',
            'modeDescription.timed': 'حقق أكبر عدد من الإجابات الصحيحة خلال 60 ثانية.',
            'modeDescription.endless': 'ثلاث فرص مع ارتفاع الصعوبة كل ثماني جولات.',
            'modeDescription.challenges': 'خمس مسائل مصنوعة يدويًا بعمليات مختلفة.',
            'modeDescription.custom': 'عملياتك وطولك وبذرتك وأهدافك وشرط فوزك.',
            'custom.builder': 'أنشئ لعبة مخصصة', 'custom.builderBody': 'اختر القواعد ثم ابدأ. تجعل البذرة اللعبة قابلة للتكرار.',
            'custom.won': 'فزت باللعبة المخصصة!', 'custom.wonBody': '{correct}/{attempts} صحيحة ({accuracy}٪).',
            'daily.complete': 'اكتملت مسألة اليوم', 'daily.completeBody': 'المحاولات: {attempts} · التلميحات: {hints}',
            'daily.revealed': 'أُظهر حل مسألة اليوم', 'daily.revealedBody': 'تسجل النتيجة المشتركة أن الحل قد أُظهر.',
            'challenges.complete': 'اكتملت مجموعة التحديات', 'challenges.completeBody': 'حللت جميع المسائل المصنوعة يدويًا وعددها {count}.',
            'endless.complete': 'اكتملت الجولة', 'endless.completeBody': 'المسائل المحلولة: {count}. استُخدمت الفرص الثلاث.',
            'endless.revealedBody': 'استخدم إظهار الحل فرصتك الأخيرة.',
            'tutorial.good': 'حركة جيدة', 'tutorial.goodBody': 'المعادلة متوازنة. تحقق منها للإنهاء.',
            'tutorial.restore': 'جرّب الرقم المحدد', 'tutorial.restoreBody': 'انقر الرقم المحدد مرة أخرى لاستعادته.',
            'tutorial.complete': 'اكتمل البرنامج التعليمي', 'tutorial.completeBody': 'أصبحت أول جولة سهلة جاهزة.',
            'tutorial.retry': 'ليس تمامًا', 'tutorial.retryBody': 'جرّب تغيير الرقم 3 المحدد ثم تحقق مرة أخرى.',
            'hint.side': 'تلميح: اختر طرفًا', 'hint.sideBody': 'الطرف المحدد يحتوي على التغيير المقصود.',
            'hint.number': 'تلميح: الرقم', 'hint.numberBody': 'الرقم المحدد هو المستخدم في الحل المولد.',
            'shared.challenge': 'مسألة يدوية مشتركة', 'shared.custom': 'مسألة مخصصة مشتركة',
            'shared.customBody': 'أُعيد إنشاء هذه المسألة المخصصة من رابط مشترك.',
            'shared.seeded': 'مسألة مشتركة ببذرة', 'shared.seededBody': 'أُعيد إنشاء هذه المسألة من رابط مشترك.',
            'share.dailyDefault': 'YOG1 اليومي {date}',
            'share.dailySolved': 'YOG1 {date} · محلولة · المحاولات: {attempts} · التلميحات: {hints}',
            'share.dailyRevealed': 'YOG1 {date} · أُظهر الحل · المحاولات: {attempts} · التلميحات: {hints}',
            'share.challenge': 'تحدٍ يدوي {round}', 'share.puzzle': 'مسألة {mode}'
        },
        bn: {
            'meta.description': 'ঠিক একটি সংখ্যা 1 করে পূর্ণসংখ্যার সমীকরণ সমান করুন।',
            'action.hintTitle': 'ইঙ্গিত (H)',
            'modeDescription.tutorial': 'একবার বদলানোর নিয়মের নির্দেশিত পরিচিতি।',
            'modeDescription.daily': 'প্রতি UTC দিনে একটি সবার জন্য একই বীজের ধাঁধা।',
            'modeDescription.timed': '60 সেকেন্ডে যত বেশি সম্ভব সঠিক উত্তর দিন।',
            'modeDescription.endless': 'প্রতি আট রাউন্ডে কঠিনতা বাড়ে, সুযোগ তিনটি।',
            'modeDescription.challenges': 'ভিন্ন ক্রিয়ার পাঁচটি হাতে তৈরি ধাঁধা।',
            'modeDescription.custom': 'আপনার ক্রিয়া, দৈর্ঘ্য, বীজ, লক্ষ্য ও জয়ের শর্ত।',
            'custom.builder': 'নিজের গেম তৈরি করুন', 'custom.builderBody': 'নিয়ম বেছে নিয়ে খেলা শুরু করুন। বীজ দিলে আবার একই খেলা হবে।',
            'custom.won': 'নিজের গেমে জয়!', 'custom.wonBody': '{correct}/{attempts} সঠিক ({accuracy}%)।',
            'daily.complete': 'দৈনিক ধাঁধা সম্পূর্ণ', 'daily.completeBody': 'চেষ্টা: {attempts} · ইঙ্গিত: {hints}',
            'daily.revealed': 'দৈনিক সমাধান দেখানো হয়েছে', 'daily.revealedBody': 'শেয়ার করা ফলে এটি সমাধান দেখানো হিসেবে লেখা থাকবে।',
            'challenges.complete': 'চ্যালেঞ্জ সেট সম্পূর্ণ', 'challenges.completeBody': 'আপনি {count}টি হাতে তৈরি ধাঁধাই সমাধান করেছেন।',
            'endless.complete': 'খেলা সম্পূর্ণ', 'endless.completeBody': 'সমাধান করা ধাঁধা: {count}। তিনটি সুযোগই শেষ হয়েছে।',
            'endless.revealedBody': 'সমাধান দেখানোয় আপনার শেষ সুযোগটি শেষ হয়েছে।',
            'tutorial.good': 'ভালো চাল', 'tutorial.goodBody': 'সমীকরণটি সমান হয়েছে। শেষ করতে পরীক্ষা করুন।',
            'tutorial.restore': 'চিহ্নিত সংখ্যাটি চেষ্টা করুন', 'tutorial.restoreBody': 'আগের মান ফেরাতে নির্বাচিত সংখ্যায় আবার ক্লিক করুন।',
            'tutorial.complete': 'টিউটোরিয়াল সম্পূর্ণ', 'tutorial.completeBody': 'আপনার প্রথম সহজ রাউন্ড প্রস্তুত।',
            'tutorial.retry': 'ঠিক হয়নি', 'tutorial.retryBody': 'চিহ্নিত 3 বদলে আবার পরীক্ষা করুন।',
            'hint.side': 'ইঙ্গিত: একটি পাশ বাছুন', 'hint.sideBody': 'চিহ্নিত পাশে বদলানোর সংখ্যাটি আছে।',
            'hint.number': 'ইঙ্গিত: সংখ্যাটি', 'hint.numberBody': 'চিহ্নিত সংখ্যাটিই তৈরি করা সমাধানে ব্যবহৃত হয়েছে।',
            'shared.challenge': 'শেয়ার করা হাতে তৈরি ধাঁধা', 'shared.custom': 'শেয়ার করা নিজের ধাঁধা',
            'shared.customBody': 'শেয়ার করা লিংক থেকে এই নিজের ধাঁধাটি আবার তৈরি হয়েছে।',
            'shared.seeded': 'শেয়ার করা বীজের ধাঁধা', 'shared.seededBody': 'শেয়ার করা লিংক থেকে এই ধাঁধাটি আবার তৈরি হয়েছে।',
            'share.dailyDefault': 'YOG1 দৈনিক {date}',
            'share.dailySolved': 'YOG1 {date} · সমাধান · চেষ্টা: {attempts} · ইঙ্গিত: {hints}',
            'share.dailyRevealed': 'YOG1 {date} · সমাধান দেখানো · চেষ্টা: {attempts} · ইঙ্গিত: {hints}',
            'share.challenge': 'হাতে তৈরি চ্যালেঞ্জ {round}', 'share.puzzle': '{mode} ধাঁধা'
        },
        ja: {
            'meta.description': '数を一つだけ1に変えて、整数の式をつり合わせます。',
            'action.hintTitle': 'ヒント (H)',
            'modeDescription.tutorial': '一度だけ数を変えるルールを順に学びます。',
            'modeDescription.daily': 'UTC の日付ごとに共通のシード問題を一問出題します。',
            'modeDescription.timed': '60秒でできるだけ多く正解します。',
            'modeDescription.endless': '8ラウンドごとに難しくなり、チャンスは3回です。',
            'modeDescription.challenges': '異なる演算を使う5問の手作り問題です。',
            'modeDescription.custom': '演算、長さ、シード、目標、クリア条件を選べます。',
            'custom.builder': 'カスタムゲームを作る', 'custom.builderBody': 'ルールを選んで開始します。シードを使うと同じゲームを再現できます。',
            'custom.won': 'カスタムゲームクリア！', 'custom.wonBody': '{correct}/{attempts} 問正解（{accuracy}%）。',
            'daily.complete': 'デイリー問題クリア', 'daily.completeBody': '試行：{attempts} · ヒント：{hints}',
            'daily.revealed': 'デイリー問題の答えを表示', 'daily.revealedBody': '共有結果には答えを表示したことが記録されます。',
            'challenges.complete': 'チャレンジセット完了', 'challenges.completeBody': '手作り問題 {count} 問をすべて解きました。',
            'endless.complete': 'プレイ終了', 'endless.completeBody': '解いた問題：{count}問。3回のチャンスを使い切りました。',
            'endless.revealedBody': '答えを表示したため最後のチャンスを使いました。',
            'tutorial.good': 'いい手です', 'tutorial.goodBody': '式がつり合いました。確認して完了します。',
            'tutorial.restore': '囲まれた数を試す', 'tutorial.restoreBody': '選んだ数をもう一度クリックすると元に戻ります。',
            'tutorial.complete': 'チュートリアル完了', 'tutorial.completeBody': '最初の「かんたん」ラウンドを始められます。',
            'tutorial.retry': 'あと少し', 'tutorial.retryBody': '囲まれた 3 を変えて、もう一度確認します。',
            'hint.side': 'ヒント：辺を選ぶ', 'hint.sideBody': '囲まれた辺に変更する数があります。',
            'hint.number': 'ヒント：この数', 'hint.numberBody': '囲まれた数が生成された解答で変更する数です。',
            'shared.challenge': '共有された手作り問題', 'shared.custom': '共有されたカスタム問題',
            'shared.customBody': '共有リンクからこのカスタム問題を再現しました。',
            'shared.seeded': '共有されたシード問題', 'shared.seededBody': '共有リンクからこの問題を再現しました。',
            'share.dailyDefault': 'YOG1 デイリー {date}',
            'share.dailySolved': 'YOG1 {date} · クリア · 試行：{attempts} · ヒント：{hints}',
            'share.dailyRevealed': 'YOG1 {date} · 答えを表示 · 試行：{attempts} · ヒント：{hints}',
            'share.challenge': '手作りチャレンジ {round}', 'share.puzzle': '{mode}問題'
        },
        hi: {
            'meta.description': 'ठीक एक संख्या को 1 में बदलकर पूर्णांक समीकरणों को संतुलित करें।',
            'action.hintTitle': 'संकेत (H)',
            'modeDescription.tutorial': 'एक बदलाव के नियम का निर्देशित परिचय।',
            'modeDescription.daily': 'हर UTC दिन एक साझा सीड वाली पहेली।',
            'modeDescription.timed': '60 सेकंड में जितने हो सकें सही उत्तर दें।',
            'modeDescription.endless': 'हर आठ राउंड में कठिनाई बढ़ती है और तीन मौके मिलते हैं।',
            'modeDescription.challenges': 'अलग-अलग क्रियाओं वाली पाँच हाथ से बनाई पहेलियाँ।',
            'modeDescription.custom': 'आपकी क्रियाएँ, लंबाई, सीड, लक्ष्य और जीत की शर्त।',
            'custom.builder': 'अपना गेम बनाएँ', 'custom.builderBody': 'नियम चुनकर खेल शुरू करें। सीड से वही खेल दोबारा बनाया जा सकता है।',
            'custom.won': 'अपना गेम जीत लिया!', 'custom.wonBody': '{correct}/{attempts} सही ({accuracy}%)।',
            'daily.complete': 'दैनिक पहेली पूरी', 'daily.completeBody': 'प्रयास: {attempts} · संकेत: {hints}',
            'daily.revealed': 'दैनिक हल दिखाया गया', 'daily.revealedBody': 'साझा परिणाम इसे हल दिखाए जाने के रूप में दर्ज करता है।',
            'challenges.complete': 'चुनौती सेट पूरा', 'challenges.completeBody': 'आपने सभी {count} हाथ से बनाई पहेलियाँ हल कीं।',
            'endless.complete': 'खेल पूरा', 'endless.completeBody': 'हल की गई पहेलियाँ: {count}। तीनों मौके इस्तेमाल हो गए।',
            'endless.revealedBody': 'हल दिखाने में आपका आखिरी मौका चला गया।',
            'tutorial.good': 'अच्छी चाल', 'tutorial.goodBody': 'समीकरण संतुलित है। पूरा करने के लिए जाँचें।',
            'tutorial.restore': 'चिह्नित संख्या आज़माएँ', 'tutorial.restoreBody': 'चुनी संख्या को वापस लाने के लिए उस पर फिर क्लिक करें।',
            'tutorial.complete': 'ट्यूटोरियल पूरा', 'tutorial.completeBody': 'आपका पहला आसान राउंड तैयार है।',
            'tutorial.retry': 'अभी नहीं', 'tutorial.retryBody': 'चिह्नित 3 को बदलकर फिर जाँचें।',
            'hint.side': 'संकेत: एक पक्ष चुनें', 'hint.sideBody': 'चिह्नित पक्ष में बदलने वाली संख्या है।',
            'hint.number': 'संकेत: संख्या', 'hint.numberBody': 'चिह्नित संख्या ही बनाए गए हल में बदली जाती है।',
            'shared.challenge': 'साझा हाथ से बनाई पहेली', 'shared.custom': 'साझा अपनी पहेली',
            'shared.customBody': 'यह अपनी पहेली साझा लिंक से फिर बनाई गई है।',
            'shared.seeded': 'साझा सीड वाली पहेली', 'shared.seededBody': 'यह पहेली साझा लिंक से फिर बनाई गई है।',
            'share.dailyDefault': 'YOG1 दैनिक {date}',
            'share.dailySolved': 'YOG1 {date} · हल · प्रयास: {attempts} · संकेत: {hints}',
            'share.dailyRevealed': 'YOG1 {date} · हल दिखाया · प्रयास: {attempts} · संकेत: {hints}',
            'share.challenge': 'हाथ से बनाई चुनौती {round}', 'share.puzzle': '{mode} पहेली'
        },
        pt: {
            'meta.description': 'Equilibre equações de inteiros mudando exatamente um número para 1.',
            'action.hintTitle': 'Dica (H)',
            'modeDescription.tutorial': 'Uma introdução guiada à regra de uma única mudança.',
            'modeDescription.daily': 'Um problema compartilhado com semente por dia UTC.',
            'modeDescription.timed': 'Acerte o máximo de respostas que puder em 60 segundos.',
            'modeDescription.endless': 'Três chances enquanto a dificuldade aumenta a cada oito rodadas.',
            'modeDescription.challenges': 'Cinco problemas feitos à mão com operações diferentes.',
            'modeDescription.custom': 'Suas operações, tamanho, semente, metas e condição de vitória.',
            'custom.builder': 'Crie um jogo personalizado', 'custom.builderBody': 'Escolha as regras e comece. Uma semente permite reproduzir o jogo.',
            'custom.won': 'Jogo personalizado vencido!', 'custom.wonBody': '{correct}/{attempts} corretas ({accuracy}%).',
            'daily.complete': 'Problema diário concluído', 'daily.completeBody': 'Tentativas: {attempts} · dicas: {hints}',
            'daily.revealed': 'Solução diária mostrada', 'daily.revealedBody': 'O resultado compartilhado registra que a solução foi mostrada.',
            'challenges.complete': 'Conjunto de desafios concluído', 'challenges.completeBody': 'Você resolveu os {count} problemas feitos à mão.',
            'endless.complete': 'Partida concluída', 'endless.completeBody': 'Problemas resolvidos: {count}. As três chances foram usadas.',
            'endless.revealedBody': 'Mostrar a solução usou sua última chance.',
            'tutorial.good': 'Boa jogada', 'tutorial.goodBody': 'A equação está equilibrada. Verifique para concluir.',
            'tutorial.restore': 'Tente o número destacado', 'tutorial.restoreBody': 'Clique novamente no número selecionado para restaurá-lo.',
            'tutorial.complete': 'Tutorial concluído', 'tutorial.completeBody': 'Sua primeira rodada Fácil está pronta.',
            'tutorial.retry': 'Ainda não', 'tutorial.retryBody': 'Tente mudar o 3 destacado e verifique novamente.',
            'hint.side': 'Dica: escolha um lado', 'hint.sideBody': 'O lado destacado contém a mudança pretendida.',
            'hint.number': 'Dica: o número', 'hint.numberBody': 'O número destacado é o usado pela solução gerada.',
            'shared.challenge': 'Problema artesanal compartilhado', 'shared.custom': 'Problema personalizado compartilhado',
            'shared.customBody': 'Este problema personalizado foi reproduzido de um link compartilhado.',
            'shared.seeded': 'Problema com semente compartilhado', 'shared.seededBody': 'Este problema foi reproduzido de um link compartilhado.',
            'share.dailyDefault': 'YOG1 diário {date}',
            'share.dailySolved': 'YOG1 {date} · resolvido · tentativas: {attempts} · dicas: {hints}',
            'share.dailyRevealed': 'YOG1 {date} · solução mostrada · tentativas: {attempts} · dicas: {hints}',
            'share.challenge': 'desafio artesanal {round}', 'share.puzzle': 'problema {mode}'
        },
        ru: {
            'meta.description': 'Уравняйте целочисленные выражения, изменив ровно одно число на 1.',
            'action.hintTitle': 'Подсказка (H)',
            'modeDescription.tutorial': 'Пошаговое знакомство с правилом одного изменения.',
            'modeDescription.daily': 'Одна общая задача с сидом на каждый день по UTC.',
            'modeDescription.timed': 'Дайте как можно больше верных ответов за 60 секунд.',
            'modeDescription.endless': 'Три шанса, а сложность растёт каждые восемь раундов.',
            'modeDescription.challenges': 'Пять ручных задач с разными операциями.',
            'modeDescription.custom': 'Ваши операции, длина, сид, цели и условие победы.',
            'custom.builder': 'Создайте свою игру', 'custom.builderBody': 'Выберите правила и начните. Сид позволяет воспроизвести игру.',
            'custom.won': 'Своя игра пройдена!', 'custom.wonBody': 'Верно: {correct}/{attempts} ({accuracy}%).',
            'daily.complete': 'Задача дня решена', 'daily.completeBody': 'Попытки: {attempts} · подсказки: {hints}',
            'daily.revealed': 'Решение задачи дня показано', 'daily.revealedBody': 'В общем результате будет отмечен показ решения.',
            'challenges.complete': 'Набор испытаний пройден', 'challenges.completeBody': 'Вы решили все ручные задачи: {count}.',
            'endless.complete': 'Забег завершён', 'endless.completeBody': 'Решено задач: {count}. Все три шанса использованы.',
            'endless.revealedBody': 'Показ решения использовал последний шанс.',
            'tutorial.good': 'Хороший ход', 'tutorial.goodBody': 'Равенство верно. Проверьте его для завершения.',
            'tutorial.restore': 'Попробуйте выделенное число', 'tutorial.restoreBody': 'Нажмите выбранное число ещё раз, чтобы вернуть его.',
            'tutorial.complete': 'Обучение завершено', 'tutorial.completeBody': 'Первый лёгкий раунд готов.',
            'tutorial.retry': 'Пока нет', 'tutorial.retryBody': 'Измените выделенную 3 и проверьте ещё раз.',
            'hint.side': 'Подсказка: выберите сторону', 'hint.sideBody': 'На выделенной стороне находится нужное изменение.',
            'hint.number': 'Подсказка: число', 'hint.numberBody': 'Выделенное число используется в сгенерированном решении.',
            'shared.challenge': 'Общая ручная задача', 'shared.custom': 'Общая пользовательская задача',
            'shared.customBody': 'Эта пользовательская задача воспроизведена по общей ссылке.',
            'shared.seeded': 'Общая задача с сидом', 'shared.seededBody': 'Эта задача воспроизведена по общей ссылке.',
            'share.dailyDefault': 'YOG1: задача дня {date}',
            'share.dailySolved': 'YOG1 {date} · решено · попытки: {attempts} · подсказки: {hints}',
            'share.dailyRevealed': 'YOG1 {date} · решение показано · попытки: {attempts} · подсказки: {hints}',
            'share.challenge': 'ручное испытание {round}', 'share.puzzle': 'задача «{mode}»'
        },
        vi: {
            'meta.description': 'Cân bằng phương trình số nguyên bằng cách đổi đúng một số thành 1.',
            'action.hintTitle': 'Gợi ý (H)',
            'modeDescription.tutorial': 'Phần hướng dẫn về quy tắc chỉ đổi một lần.',
            'modeDescription.daily': 'Mỗi ngày UTC có một câu đố dùng hạt giống chung.',
            'modeDescription.timed': 'Trả lời đúng nhiều nhất có thể trong 60 giây.',
            'modeDescription.endless': 'Ba cơ hội khi độ khó tăng sau mỗi tám vòng.',
            'modeDescription.challenges': 'Năm câu đố làm tay với các phép toán khác nhau.',
            'modeDescription.custom': 'Phép toán, độ dài, hạt giống, mục tiêu và điều kiện thắng của bạn.',
            'custom.builder': 'Tạo trò chơi tùy chỉnh', 'custom.builderBody': 'Chọn luật rồi bắt đầu. Hạt giống giúp tái tạo trò chơi.',
            'custom.won': 'Đã thắng trò chơi tùy chỉnh!', 'custom.wonBody': 'Đúng {correct}/{attempts} ({accuracy}%).',
            'daily.complete': 'Hoàn thành câu đố hằng ngày', 'daily.completeBody': 'Lần thử: {attempts} · gợi ý: {hints}',
            'daily.revealed': 'Đã hiện lời giải hằng ngày', 'daily.revealedBody': 'Kết quả chia sẻ ghi nhận rằng lời giải đã được hiện.',
            'challenges.complete': 'Hoàn thành bộ thử thách', 'challenges.completeBody': 'Bạn đã giải cả {count} câu đố làm tay.',
            'endless.complete': 'Kết thúc lượt chơi', 'endless.completeBody': 'Số câu đã giải: {count}. Cả ba cơ hội đã được dùng.',
            'endless.revealedBody': 'Việc hiện lời giải đã dùng cơ hội cuối cùng.',
            'tutorial.good': 'Nước đi tốt', 'tutorial.goodBody': 'Phương trình đã cân bằng. Hãy kiểm tra để hoàn tất.',
            'tutorial.restore': 'Thử số được đánh dấu', 'tutorial.restoreBody': 'Nhấp lại số đã chọn để khôi phục.',
            'tutorial.complete': 'Hoàn thành hướng dẫn', 'tutorial.completeBody': 'Vòng Dễ đầu tiên đã sẵn sàng.',
            'tutorial.retry': 'Chưa đúng', 'tutorial.retryBody': 'Hãy đổi số 3 được đánh dấu rồi kiểm tra lại.',
            'hint.side': 'Gợi ý: chọn một vế', 'hint.sideBody': 'Vế được đánh dấu chứa số cần đổi.',
            'hint.number': 'Gợi ý: con số', 'hint.numberBody': 'Số được đánh dấu là số được dùng trong lời giải đã tạo.',
            'shared.challenge': 'Câu đố làm tay được chia sẻ', 'shared.custom': 'Câu đố tùy chỉnh được chia sẻ',
            'shared.customBody': 'Câu đố tùy chỉnh này được tái tạo từ liên kết chia sẻ.',
            'shared.seeded': 'Câu đố hạt giống được chia sẻ', 'shared.seededBody': 'Câu đố này được tái tạo từ liên kết chia sẻ.',
            'share.dailyDefault': 'YOG1 hằng ngày {date}',
            'share.dailySolved': 'YOG1 {date} · đã giải · lần thử: {attempts} · gợi ý: {hints}',
            'share.dailyRevealed': 'YOG1 {date} · đã hiện lời giải · lần thử: {attempts} · gợi ý: {hints}',
            'share.challenge': 'thử thách làm tay {round}', 'share.puzzle': 'câu đố {mode}'
        },
        tr: {
            'meta.description': 'Tam sayı denklemlerini tam olarak bir sayıyı 1 yaparak dengeleyin.',
            'action.hintTitle': 'İpucu (H)',
            'modeDescription.tutorial': 'Tek değişiklik kuralına yönlendirmeli giriş.',
            'modeDescription.daily': 'Her UTC günü için ortak tohumlu bir bulmaca.',
            'modeDescription.timed': '60 saniyede olabildiğince çok doğru yanıt verin.',
            'modeDescription.endless': 'Zorluk her sekiz turda artarken üç şansınız vardır.',
            'modeDescription.challenges': 'Farklı işlemleri kullanan beş el yapımı bulmaca.',
            'modeDescription.custom': 'İşlemleriniz, uzunluk, tohum, hedefler ve kazanma koşulu.',
            'custom.builder': 'Özel oyun oluşturun', 'custom.builderBody': 'Kuralları seçip başlayın. Tohum, oyunu yeniden üretilebilir kılar.',
            'custom.won': 'Özel oyun kazanıldı!', 'custom.wonBody': '{correct}/{attempts} doğru (%{accuracy}).',
            'daily.complete': 'Günlük bulmaca tamamlandı', 'daily.completeBody': 'Deneme: {attempts} · ipucu: {hints}',
            'daily.revealed': 'Günlük çözüm gösterildi', 'daily.revealedBody': 'Paylaşılan sonuç, çözümün gösterildiğini kaydeder.',
            'challenges.complete': 'Meydan okuma seti tamamlandı', 'challenges.completeBody': '{count} el yapımı bulmacanın hepsini çözdünüz.',
            'endless.complete': 'Koşu tamamlandı', 'endless.completeBody': 'Çözülen bulmaca: {count}. Üç şansın tamamı kullanıldı.',
            'endless.revealedBody': 'Çözümü göstermek son şansınızı kullandı.',
            'tutorial.good': 'İyi hamle', 'tutorial.goodBody': 'Denklem dengeli. Bitirmek için kontrol edin.',
            'tutorial.restore': 'İşaretli sayıyı deneyin', 'tutorial.restoreBody': 'Geri almak için seçili sayıya tekrar tıklayın.',
            'tutorial.complete': 'Eğitim tamamlandı', 'tutorial.completeBody': 'İlk Kolay turunuz hazır.',
            'tutorial.retry': 'Tam olmadı', 'tutorial.retryBody': 'İşaretli 3 sayısını değiştirip tekrar kontrol edin.',
            'hint.side': 'İpucu: bir taraf seçin', 'hint.sideBody': 'İşaretli taraf, değiştirilmesi gereken sayıyı içerir.',
            'hint.number': 'İpucu: sayı', 'hint.numberBody': 'İşaretli sayı, üretilen çözümde kullanılan sayıdır.',
            'shared.challenge': 'Paylaşılan el yapımı bulmaca', 'shared.custom': 'Paylaşılan özel bulmaca',
            'shared.customBody': 'Bu özel bulmaca paylaşılan bağlantıdan yeniden üretildi.',
            'shared.seeded': 'Paylaşılan tohumlu bulmaca', 'shared.seededBody': 'Bu bulmaca paylaşılan bağlantıdan yeniden üretildi.',
            'share.dailyDefault': 'YOG1 Günlük {date}',
            'share.dailySolved': 'YOG1 {date} · çözüldü · deneme: {attempts} · ipucu: {hints}',
            'share.dailyRevealed': 'YOG1 {date} · çözüm gösterildi · deneme: {attempts} · ipucu: {hints}',
            'share.challenge': 'el yapımı meydan okuma {round}', 'share.puzzle': '{mode} bulmacası'
        },
        ur: {
            'meta.description': 'صرف ایک عدد کو 1 میں بدل کر صحیح عدد کی مساوات برابر کریں۔',
            'action.hintTitle': 'اشارہ (H)',
            'modeDescription.tutorial': 'ایک تبدیلی کے اصول کا رہنمائی والا تعارف۔',
            'modeDescription.daily': 'ہر UTC دن ایک مشترک بیج والی پہیلی۔',
            'modeDescription.timed': '60 سیکنڈ میں زیادہ سے زیادہ درست جواب دیں۔',
            'modeDescription.endless': 'ہر آٹھ راؤنڈ کے بعد مشکل بڑھتی ہے اور تین موقعے ملتے ہیں۔',
            'modeDescription.challenges': 'مختلف عمل والی پانچ ہاتھ سے بنائی پہیلیاں۔',
            'modeDescription.custom': 'آپ کے عمل، لمبائی، بیج، اہداف اور جیت کی شرط۔',
            'custom.builder': 'اپنی گیم بنائیں', 'custom.builderBody': 'اصول منتخب کر کے شروع کریں۔ بیج سے وہی گیم دوبارہ بن سکتی ہے۔',
            'custom.won': 'اپنی گیم جیت لی!', 'custom.wonBody': '{correct}/{attempts} درست ({accuracy}٪)۔',
            'daily.complete': 'روزانہ پہیلی مکمل', 'daily.completeBody': 'کوششیں: {attempts} · اشارے: {hints}',
            'daily.revealed': 'روزانہ حل دکھا دیا گیا', 'daily.revealedBody': 'مشترک نتیجے میں حل دکھانا درج ہوگا۔',
            'challenges.complete': 'چیلنج سیٹ مکمل', 'challenges.completeBody': 'آپ نے تمام {count} ہاتھ سے بنائی پہیلیاں حل کر لیں۔',
            'endless.complete': 'کھیل مکمل', 'endless.completeBody': 'حل شدہ پہیلیاں: {count}۔ تینوں موقعے استعمال ہو گئے۔',
            'endless.revealedBody': 'حل دکھانے سے آپ کا آخری موقع ختم ہو گیا۔',
            'tutorial.good': 'اچھی چال', 'tutorial.goodBody': 'مساوات برابر ہے۔ مکمل کرنے کے لیے جانچیں۔',
            'tutorial.restore': 'نمایاں عدد آزمائیں', 'tutorial.restoreBody': 'منتخب عدد واپس لانے کے لیے اسے دوبارہ کلک کریں۔',
            'tutorial.complete': 'رہنمائی مکمل', 'tutorial.completeBody': 'آپ کا پہلا آسان راؤنڈ تیار ہے۔',
            'tutorial.retry': 'ابھی نہیں', 'tutorial.retryBody': 'نمایاں 3 کو بدل کر دوبارہ جانچیں۔',
            'hint.side': 'اشارہ: ایک طرف چنیں', 'hint.sideBody': 'نمایاں طرف میں بدلنے والا عدد ہے۔',
            'hint.number': 'اشارہ: عدد', 'hint.numberBody': 'نمایاں عدد ہی بنائے گئے حل میں بدلا جاتا ہے۔',
            'shared.challenge': 'مشترک ہاتھ سے بنائی پہیلی', 'shared.custom': 'مشترک اپنی پہیلی',
            'shared.customBody': 'یہ اپنی پہیلی مشترک لنک سے دوبارہ بنائی گئی ہے۔',
            'shared.seeded': 'مشترک بیج والی پہیلی', 'shared.seededBody': 'یہ پہیلی مشترک لنک سے دوبارہ بنائی گئی ہے۔',
            'share.dailyDefault': 'YOG1 روزانہ {date}',
            'share.dailySolved': 'YOG1 {date} · حل · کوششیں: {attempts} · اشارے: {hints}',
            'share.dailyRevealed': 'YOG1 {date} · حل دکھایا · کوششیں: {attempts} · اشارے: {hints}',
            'share.challenge': 'ہاتھ سے بنایا چیلنج {round}', 'share.puzzle': '{mode} پہیلی'
        }
    };
    for (const code of AVAILABLE_LOCALES) Object.assign(messages[code], finalMessages[code]);

    const adaptiveMessages = {
        en: {
            'mode.adaptive': 'Adaptive',
            'modeDescription.adaptive': 'Difficulty follows your answers. Hints and skips lower your rating; less comfortable operators appear less often.',
            'action.skip': 'Skip question',
            'progress.adaptive': 'Level: {level} · skill: {skill}%',
            'adaptive.skipped': 'Question skipped',
            'adaptive.skippedBody': 'The solution is shown and your Adaptive rating was lowered.'
        },
        es: {
            'mode.adaptive': 'Adaptativo',
            'modeDescription.adaptive': 'La dificultad sigue tus respuestas. Las pistas y los saltos bajan tu nivel; los operadores que dominas menos aparecen con menor frecuencia.',
            'action.skip': 'Saltar pregunta',
            'progress.adaptive': 'Nivel: {level} · habilidad: {skill} %',
            'adaptive.skipped': 'Pregunta saltada',
            'adaptive.skippedBody': 'Se muestra la solución y tu nivel adaptativo ha bajado.'
        },
        zh: {
            'mode.adaptive': '自适应',
            'modeDescription.adaptive': '难度会根据答题表现调整。提示和跳题会降低评级；不熟悉的运算符会较少出现。',
            'action.skip': '跳过题目',
            'progress.adaptive': '等级：{level} · 技能：{skill}%',
            'adaptive.skipped': '已跳过题目',
            'adaptive.skippedBody': '已显示解法，你的自适应评级已降低。'
        },
        ar: {
            'mode.adaptive': 'متكيف',
            'modeDescription.adaptive': 'تتبع الصعوبة إجاباتك. تخفض التلميحات والتخطي تقييمك، وتظهر العمليات الأقل إتقانًا بوتيرة أقل.',
            'action.skip': 'تخطي السؤال',
            'progress.adaptive': 'المستوى: {level} · المهارة: {skill}٪',
            'adaptive.skipped': 'تم تخطي السؤال',
            'adaptive.skippedBody': 'ظهر الحل وانخفض تقييمك في النمط المتكيف.'
        },
        bn: {
            'mode.adaptive': 'অভিযোজিত',
            'modeDescription.adaptive': 'আপনার উত্তরের সঙ্গে কঠিনতা বদলায়। ইঙ্গিত ও প্রশ্ন এড়ালে রেটিং কমে; কম স্বচ্ছন্দ ক্রিয়া কম আসে।',
            'action.skip': 'প্রশ্ন এড়িয়ে যান',
            'progress.adaptive': 'স্তর: {level} · দক্ষতা: {skill}%',
            'adaptive.skipped': 'প্রশ্ন এড়ানো হয়েছে',
            'adaptive.skippedBody': 'সমাধান দেখানো হয়েছে এবং আপনার অভিযোজিত রেটিং কমেছে।'
        },
        ja: {
            'mode.adaptive': '適応',
            'modeDescription.adaptive': '正誤に応じて難易度が変わります。ヒントとスキップで評価が下がり、苦手な演算子の出題頻度も下がります。',
            'action.skip': '問題をスキップ',
            'progress.adaptive': 'レベル：{level} · スキル：{skill}%',
            'adaptive.skipped': '問題をスキップしました',
            'adaptive.skippedBody': '解答を表示し、適応評価を下げました。'
        },
        hi: {
            'mode.adaptive': 'अनुकूली',
            'modeDescription.adaptive': 'कठिनाई आपके उत्तरों के अनुसार बदलती है। संकेत और छोड़ने से रेटिंग घटती है; कम सहज संक्रियाएँ कम आती हैं।',
            'action.skip': 'प्रश्न छोड़ें',
            'progress.adaptive': 'स्तर: {level} · कौशल: {skill}%',
            'adaptive.skipped': 'प्रश्न छोड़ा गया',
            'adaptive.skippedBody': 'हल दिखाया गया है और आपकी अनुकूली रेटिंग घट गई है।'
        },
        pt: {
            'mode.adaptive': 'Adaptativo',
            'modeDescription.adaptive': 'A dificuldade acompanha suas respostas. Dicas e pulos reduzem sua nota; operadores menos confortáveis aparecem com menor frequência.',
            'action.skip': 'Pular pergunta',
            'progress.adaptive': 'Nível: {level} · habilidade: {skill}%',
            'adaptive.skipped': 'Pergunta pulada',
            'adaptive.skippedBody': 'A solução foi mostrada e sua nota adaptativa diminuiu.'
        },
        ru: {
            'mode.adaptive': 'Адаптивный',
            'modeDescription.adaptive': 'Сложность меняется по вашим ответам. Подсказки и пропуски снижают рейтинг; менее знакомые операции встречаются реже.',
            'action.skip': 'Пропустить задачу',
            'progress.adaptive': 'Уровень: {level} · навык: {skill}%',
            'adaptive.skipped': 'Задача пропущена',
            'adaptive.skippedBody': 'Решение показано, а ваш адаптивный рейтинг снижен.'
        },
        vi: {
            'mode.adaptive': 'Thích ứng',
            'modeDescription.adaptive': 'Độ khó thay đổi theo câu trả lời. Gợi ý và bỏ qua làm giảm xếp hạng; phép toán chưa quen xuất hiện ít hơn.',
            'action.skip': 'Bỏ qua câu hỏi',
            'progress.adaptive': 'Cấp: {level} · kỹ năng: {skill}%',
            'adaptive.skipped': 'Đã bỏ qua câu hỏi',
            'adaptive.skippedBody': 'Lời giải được hiện và xếp hạng Thích ứng của bạn đã giảm.'
        },
        tr: {
            'mode.adaptive': 'Uyarlamalı',
            'modeDescription.adaptive': 'Zorluk yanıtlarınıza göre değişir. İpuçları ve atlamalar puanı düşürür; daha az rahat olduğunuz işlemler daha seyrek görünür.',
            'action.skip': 'Soruyu atla',
            'progress.adaptive': 'Seviye: {level} · beceri: %{skill}',
            'adaptive.skipped': 'Soru atlandı',
            'adaptive.skippedBody': 'Çözüm gösterildi ve Uyarlamalı puanınız düşürüldü.'
        },
        ur: {
            'mode.adaptive': 'موافق',
            'modeDescription.adaptive': 'مشکل آپ کے جوابوں کے مطابق بدلتی ہے۔ اشارے اور چھوڑنا ریٹنگ گھٹاتے ہیں؛ کم مانوس عمل کم آتے ہیں۔',
            'action.skip': 'سوال چھوڑیں',
            'progress.adaptive': 'سطح: {level} · مہارت: {skill}٪',
            'adaptive.skipped': 'سوال چھوڑ دیا گیا',
            'adaptive.skippedBody': 'حل دکھا دیا گیا اور آپ کی موافق ریٹنگ گھٹا دی گئی۔'
        }
    };
    for (const code of AVAILABLE_LOCALES) Object.assign(messages[code], adaptiveMessages[code]);

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

    function getMessageId(prefix, value) {
        if (typeof prefix !== 'string' || typeof value !== 'string') return null;
        const keyPrefix = prefix + '.';
        const directKey = keyPrefix + value;
        if (Object.prototype.hasOwnProperty.call(messages.en, directKey)) return value;
        const key = Object.keys(messages.en).find(function (candidate) {
            return candidate.startsWith(keyPrefix) && AVAILABLE_LOCALES.some(function (code) {
                return messages[code][candidate] === value;
            });
        });
        return key ? key.slice(keyPrefix.length) : null;
    }

    function apply(rootElement) {
        const scope = rootElement || document;
        for (const element of scope.querySelectorAll('[data-i18n]')) element.textContent = t(element.dataset.i18n);
        for (const element of scope.querySelectorAll('[data-i18n-aria-label]')) {
            element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
        }
        for (const element of scope.querySelectorAll('[data-i18n-title]')) element.title = t(element.dataset.i18nTitle);
        for (const element of scope.querySelectorAll('[data-i18n-placeholder]')) {
            element.placeholder = t(element.dataset.i18nPlaceholder);
        }
        for (const element of scope.querySelectorAll('[data-i18n-content]')) {
            element.setAttribute('content', t(element.dataset.i18nContent));
        }
        for (const element of scope.querySelectorAll('[data-localize]')) {
            if (!element.dataset.sourceText) element.dataset.sourceText = element.textContent;
            element.textContent = translate(element.dataset.sourceText);
        }
        for (const element of document.querySelectorAll('link[rel="manifest"]')) {
            element.href = locale === 'en' ? 'manifest.webmanifest' :
                'manifest.' + locale + '.webmanifest';
        }
        const option = localeOption(locale);
        document.documentElement.lang = option.tag;
        document.documentElement.dir = option.direction;
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
        getMessageId: getMessageId,
        translate: translate,
        locales: messages,
        availableLocales: AVAILABLE_LOCALES,
        localeOptions: LOCALE_OPTIONS.map(function (item) {
            return Object.assign({}, item);
        }),
        getLanguageTag: function () { return localeOption(locale).tag; },
        getDirection: function () { return RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr'; }
    };
}(window));
