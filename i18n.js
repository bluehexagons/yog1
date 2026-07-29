(function (root) {
    'use strict';

    const STORAGE_KEY = 'yog1.locale.v1';
    // Locales shown in Options. English safely fills any copy that has not yet
    // been added to a locale's catalog.
    const AVAILABLE_LOCALES = ['en', 'es', 'zh', 'ar', 'bn', 'ja', 'hi', 'pt', 'ru', 'vi', 'tr', 'ur'];
    const RTL_LOCALES = ['ar', 'ur'];
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
        for (const element of scope.querySelectorAll('[data-i18n-placeholder]')) {
            element.placeholder = t(element.dataset.i18nPlaceholder);
        }
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
