import React from 'react';

/**
 * TapMyMenu landing page - drop-in, multi-locale component.
 *
 * INTEGRATION:
 * 1. Save this file as src/LandingPage.jsx
 * 2. In App.js, import it and add routes BEFORE your catch-all `/:urlname` route.
 *    One route per locale, each rendering the same component with a different `locale`:
 *
 *      import LandingPage from './LandingPage';
 *      ...
 *      <Routes>
 *        <Route path="/" element={<LandingPage locale="en" />} />
 *        <Route path="/bg" element={<LandingPage locale="bg" />} />
 *        <Route path="/ru" element={<LandingPage locale="ru" />} />
 *        <Route path="/el" element={<LandingPage locale="el" />} />
 *        <Route path="/c/:code" element={<CodeRoute />} />
 *        <Route path="/:urlname" element={<MenuRoute />} />
 *      </Routes>
 *
 *    Order matters - the locale routes and "/" must be matched before the
 *    `/:urlname` wildcard, otherwise they get swallowed by the menu route.
 *
 * 3. Fonts: for best performance, add these to the <head> of public/index.html
 *    instead of relying on a per-mount @import:
 *
 *      <link rel="preconnect" href="https://fonts.googleapis.com">
 *      <link href="https://fonts.googleapis.com/css2?family=Bitter:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
 *
 *    Inter and IBM Plex Mono cover Cyrillic and Greek. Bitter (the display serif)
 *    only ships Latin glyphs, so Cyrillic/Greek headings automatically fall back
 *    to Georgia (set in the font stack below) - that's expected, not a bug.
 *
 * 4. Unsupported `locale` values fall back to English.
 *
 * 5. The CTA buttons currently point at `#get-started`, which scrolls to the
 *    final section. Point them at your real signup flow once it exists -
 *    search for `href="#get-started"`.
 */

const TRANSLATIONS = {
  en: {
    nav: { tag: 'Digital menus', cta: 'Get started' },
    hero: {
      eyebrow: 'Live in under 5 minutes',
      headlinePre: 'Your menu. ',
      headlineEm: 'Always fresh.',
      headlinePost: ' Never reprinted.',
      sub: "Share one link and guests always see your real menu - the one you just updated, not the one from three price changes ago. No app, no waiting on a print shop.",
      ctaPrimary: 'Get your digital menu',
      ctaSecondary: 'See how it works',
      note: 'NO APP · NO INSTALL · SHARE ANYWHERE',
    },
    how: {
      eyebrow: 'How it works',
      title: "Three steps, in order - then you're done",
      sub: 'This is the one place order actually matters: set up once, share the link, edit forever.',
      steps: [
        { no: 'STEP 1', title: 'Add your menu', body: 'Enter your dishes, prices, and photos once. Organize them into categories however you like.' },
        { no: 'STEP 2', title: 'Share your link', body: 'Put it on a table card, your socials, or your website - guests open it straight in their browser.' },
        { no: 'STEP 3', title: 'Edit anytime', body: 'Change a price, add a special, mark something sold out - every guest sees it immediately.' },
      ],
    },
    compare: {
      eyebrow: 'The old way vs. the digital way',
      title: "Paper menus fight you. This doesn't.",
      oldLabel: 'Printed menu',
      newLabel: 'TapMyMenu',
      oldItems: [
        'Every price change means a reprint',
        'Sold-out items stay on the menu until someone crosses them out',
        "Photos and allergen info don't fit on the page",
        'Torn, stained, or missing by dinner rush',
      ],
      newItems: [
        "Edit a price and it's live everywhere in seconds",
        'Mark something sold out the moment it runs out',
        'Add a photo, a description, or an allergen note freely',
        'Lives on your domain - nothing to reprint, ever',
      ],
    },
    features: {
      eyebrow: "What's on the menu",
      title: 'Everything included, nothing extra',
      rows: [
        { name: 'Real-time editing', desc: 'Change anything and guests see it the next time they open the link - no rebuild, no wait.', val: 'Included' },
        { name: 'Works on any phone', desc: 'Opens directly in the browser. Nothing for guests to download or sign into.', val: 'No app' },
        { name: 'Photos & descriptions', desc: 'Show a dish, not just its name - as much detail as you want, for every item.', val: '$0 extra' },
        { name: 'Sold-out toggling', desc: "Flip one switch when the kitchen runs out - it disappears from every guest's screen.", val: 'Instant' },
        { name: 'Your own domain', desc: 'Your menu lives at your address, not a generic subdomain buried in a URL.', val: 'Included' },
      ],
    },
    final: {
      title: 'Ready to stop reprinting?',
      sub: "Set up your first digital menu today - it's live the moment you save it.",
      cta: 'Get your digital menu',
    },
    footer: {
      copyright: 'TAPMYMENU © {year}',
      tagline: 'MADE FOR RESTAURANTS THAT HATE REPRINTING',
    },
  },

  bg: {
    nav: { tag: 'Дигитални менюта', cta: 'Започнете' },
    hero: {
      eyebrow: 'На живо за под 5 минути',
      headlinePre: 'Твоето меню. ',
      headlineEm: 'Винаги свежо.',
      headlinePost: ' Никога препечатано.',
      sub: 'Сподели един линк и гостите винаги виждат истинското меню - това, което току-що обнови, а не онова от три промени на цените назад. Без приложение, без чакане на печатница.',
      ctaPrimary: 'Вземи своето дигитално меню',
      ctaSecondary: 'Виж как работи',
      note: 'БЕЗ ПРИЛОЖЕНИЕ · БЕЗ ИНСТАЛАЦИЯ · СПОДЕЛИ НАВСЯКЪДЕ',
    },
    how: {
      eyebrow: 'Как работи',
      title: 'Три стъпки, по ред - и готово',
      sub: 'Това е единственото място, където редът наистина има значение: настрой веднъж, сподели линка, редактирай завинаги.',
      steps: [
        { no: 'СТЪПКА 1', title: 'Добави своето меню', body: 'Въведи ястията, цените и снимките веднъж. Организирай ги в категории както искаш.' },
        { no: 'СТЪПКА 2', title: 'Сподели своя линк', body: 'Постави го на масата, в социалните мрежи или на сайта си - гостите го отварят направо в браузъра.' },
        { no: 'СТЪПКА 3', title: 'Редактирай по всяко време', body: 'Промени цена, добави специалитет, отбележи нещо като изчерпано - всеки гост го вижда веднага.' },
      ],
    },
    compare: {
      eyebrow: 'Старият начин срещу дигиталния начин',
      title: 'Хартиените менюта ти пречат. Това - не.',
      oldLabel: 'Печатно меню',
      newLabel: 'TapMyMenu',
      oldItems: [
        'Всяка промяна на цена означава нов печат',
        'Изчерпаните продукти остават в менюто, докато някой не ги задраска',
        'Снимките и информацията за алергени не се вместват на страницата',
        'Скъсано, изцапано или изгубено по време на натоварване',
      ],
      newItems: [
        'Редактираш цена и тя е активна навсякъде за секунди',
        'Отбелязваш нещо като изчерпано веднага щом свърши',
        'Добавяш снимка, описание или бележка за алергени свободно',
        'Живее на твоя домейн - нищо за препечатване, никога',
      ],
    },
    features: {
      eyebrow: 'Какво има в менюто',
      title: 'Всичко включено, нищо допълнително',
      rows: [
        { name: 'Редактиране в реално време', desc: 'Промени каквото искаш и гостите го виждат при следващото отваряне на линка - без преизграждане, без чакане.', val: 'Включено' },
        { name: 'Работи на всеки телефон', desc: 'Отваря се директно в браузъра. Гостите нямат нужда да свалят или да влизат в нищо.', val: 'Без приложение' },
        { name: 'Снимки и описания', desc: 'Покажи ястието, не само името му - толкова детайли, колкото искаш, за всеки продукт.', val: 'Без доплащане' },
        { name: 'Маркиране на изчерпани', desc: 'Превключи един бутон, когато кухнята свърши нещо - то изчезва от екрана на всеки гост.', val: 'Веднага' },
        { name: 'Твой собствен домейн', desc: 'Менюто ти живее на твоя адрес, а не на общ поддомейн, скрит в дълъг линк.', val: 'Включено' },
      ],
    },
    final: {
      title: 'Готов да спреш препечатването?',
      sub: 'Настрой първото си дигитално меню още днес - то е активно в мига, в който го запазиш.',
      cta: 'Вземи своето дигитално меню',
    },
    footer: {
      copyright: 'TAPMYMENU © {year}',
      tagline: 'СЪЗДАДЕНО ЗА РЕСТОРАНТИ, КОИТО МРАЗЯТ ПРЕПЕЧАТВАНЕТО',
    },
  },

  ru: {
    nav: { tag: 'Цифровые меню', cta: 'Начать' },
    hero: {
      eyebrow: 'Запуск менее чем за 5 минут',
      headlinePre: 'Ваше меню. ',
      headlineEm: 'Всегда свежее.',
      headlinePost: ' Больше никаких перепечаток.',
      sub: 'Поделитесь одной ссылкой - и гости всегда видят настоящее меню: то, которое вы только что обновили, а не то, что было три изменения цен назад. Никаких приложений, никакого ожидания типографии.',
      ctaPrimary: 'Создать цифровое меню',
      ctaSecondary: 'Как это работает',
      note: 'БЕЗ ПРИЛОЖЕНИЯ · БЕЗ УСТАНОВКИ · ДЕЛИТЕСЬ ГДЕ УГОДНО',
    },
    how: {
      eyebrow: 'Как это работает',
      title: 'Три шага по порядку - и готово',
      sub: 'Это единственное место, где порядок действительно важен: настройте один раз, поделитесь ссылкой, редактируйте всегда.',
      steps: [
        { no: 'ШАГ 1', title: 'Добавьте меню', body: 'Введите блюда, цены и фото один раз. Организуйте их по категориям как удобно.' },
        { no: 'ШАГ 2', title: 'Поделитесь ссылкой', body: 'Разместите её на карточке на столе, в соцсетях или на сайте - гости открывают её прямо в браузере.' },
        { no: 'ШАГ 3', title: 'Редактируйте в любое время', body: 'Измените цену, добавьте специальное предложение, отметьте блюдо закончившимся - каждый гость увидит это сразу после сохранения.' },
      ],
    },
    compare: {
      eyebrow: 'Старый способ против цифрового',
      title: 'Бумажное меню усложняет жизнь. А это - нет.',
      oldLabel: 'Печатное меню',
      newLabel: 'TapMyMenu',
      oldItems: [
        'Любое изменение цены - новая печать',
        'Закончившиеся блюда остаются в меню, пока кто-то их не вычеркнет',
        'Фото и информация об аллергенах не влезают на страницу',
        'Порвано, испачкано или потеряно к вечернему наплыву гостей',
      ],
      newItems: [
        'Меняете цену - и она мгновенно обновляется везде',
        'Отмечаете блюдо закончившимся сразу, как оно закончилось',
        'Добавляете фото, описание или заметку об аллергенах без ограничений',
        'Работает на вашем домене - печатать больше не нужно, никогда',
      ],
    },
    features: {
      eyebrow: 'Что в меню',
      title: 'Всё включено, ничего лишнего',
      rows: [
        { name: 'Редактирование в реальном времени', desc: 'Меняйте что угодно - гости увидят это при следующем открытии ссылки, без пересборки и ожидания.', val: 'Включено' },
        { name: 'Работает на любом телефоне', desc: 'Открывается прямо в браузере. Гостям не нужно ничего скачивать или входить в аккаунт.', val: 'Без приложения' },
        { name: 'Фото и описания', desc: 'Покажите блюдо, а не только его название - сколько угодно деталей для каждой позиции.', val: 'Без доплаты' },
        { name: 'Отметка «нет в наличии»', desc: 'Один переключатель, когда на кухне что-то закончилось - блюдо исчезает с экрана каждого гостя.', val: 'Мгновенно' },
        { name: 'Собственный домен', desc: 'Ваше меню живёт на вашем адресе, а не на общем поддомене, зарытом в длинной ссылке.', val: 'Включено' },
      ],
    },
    final: {
      title: 'Готовы перестать печатать заново?',
      sub: 'Настройте своё первое цифровое меню уже сегодня - оно станет доступным сразу после сохранения.',
      cta: 'Создать цифровое меню',
    },
    footer: {
      copyright: 'TAPMYMENU © {year}',
      tagline: 'СОЗДАНО ДЛЯ РЕСТОРАНОВ, КОТОРЫЕ НЕ ЛЮБЯТ ПЕРЕПЕЧАТКУ',
    },
  },

  el: {
    nav: { tag: 'Ψηφιακά μενού', cta: 'Ξεκινήστε' },
    hero: {
      eyebrow: 'Ζωντανό σε λιγότερο από 5 λεπτά',
      headlinePre: 'Το μενού σου. ',
      headlineEm: 'Πάντα φρέσκο.',
      headlinePost: ' Ποτέ ξανά τυπωμένο.',
      sub: 'Μοιράσου έναν σύνδεσμο και οι πελάτες βλέπουν πάντα το πραγματικό μενού σου - αυτό που μόλις ενημέρωσες, όχι εκείνο από τρεις αλλαγές τιμών πριν. Χωρίς εφαρμογή, χωρίς αναμονή για τυπογραφείο.',
      ctaPrimary: 'Απόκτησε το ψηφιακό σου μενού',
      ctaSecondary: 'Δες πώς λειτουργεί',
      note: 'ΧΩΡΙΣ ΕΦΑΡΜΟΓΗ · ΧΩΡΙΣ ΕΓΚΑΤΑΣΤΑΣΗ · ΜΟΙΡΑΣΟΥ ΠΑΝΤΟΥ',
    },
    how: {
      eyebrow: 'Πώς λειτουργεί',
      title: 'Τρία βήματα, με τη σειρά - και έτοιμο',
      sub: 'Εδώ η σειρά έχει πραγματικά σημασία: ρύθμισέ το μία φορά, μοιράσου τον σύνδεσμο, επεξεργάζεσαι για πάντα.',
      steps: [
        { no: 'ΒΗΜΑ 1', title: 'Πρόσθεσε το μενού σου', body: 'Καταχώρισε τα πιάτα, τις τιμές και τις φωτογραφίες μία φορά. Οργάνωσέ τα σε κατηγορίες όπως θέλεις.' },
        { no: 'ΒΗΜΑ 2', title: 'Μοιράσου τον σύνδεσμο', body: 'Βάλτον σε καρτελάκι τραπεζιού, στα social media ή στην ιστοσελίδα σου - οι πελάτες τον ανοίγουν απευθείας στον browser.' },
        { no: 'ΒΗΜΑ 3', title: 'Επεξεργασία οποτεδήποτε', body: 'Άλλαξε μια τιμή, πρόσθεσε ένα special, σημείωσε κάτι ως εξαντλημένο - κάθε πελάτης το βλέπει μόλις αποθηκεύσεις.' },
      ],
    },
    compare: {
      eyebrow: 'Ο παλιός τρόπος εναντίον του ψηφιακού',
      title: 'Τα χάρτινα μενού σου δυσκολεύουν τη ζωή. Αυτό όχι.',
      oldLabel: 'Τυπωμένο μενού',
      newLabel: 'TapMyMenu',
      oldItems: [
        'Κάθε αλλαγή τιμής σημαίνει νέα εκτύπωση',
        'Τα εξαντλημένα πιάτα παραμένουν στο μενού μέχρι να τα σβήσει κάποιος',
        'Οι φωτογραφίες και οι πληροφορίες αλλεργιογόνων δεν χωρούν στη σελίδα',
        'Σκισμένο, λεκιασμένο ή χαμένο μέχρι την ώρα αιχμής',
      ],
      newItems: [
        'Αλλάζεις μια τιμή και είναι live παντού σε δευτερόλεπτα',
        'Σημειώνεις κάτι ως εξαντλημένο τη στιγμή που τελειώνει',
        'Προσθέτεις φωτογραφία, περιγραφή ή σημείωση αλλεργιογόνων ελεύθερα',
        'Ζει στο δικό σου domain - τίποτα για επανεκτύπωση, ποτέ',
      ],
    },
    features: {
      eyebrow: 'Τι περιλαμβάνει το μενού',
      title: 'Όλα περιλαμβάνονται, τίποτα παραπάνω',
      rows: [
        { name: 'Επεξεργασία σε πραγματικό χρόνο', desc: 'Άλλαξε ό,τι θέλεις και οι πελάτες το βλέπουν την επόμενη φορά που ανοίγουν τον σύνδεσμο - χωρίς αναδημιουργία, χωρίς αναμονή.', val: 'Περιλαμβάνεται' },
        { name: 'Λειτουργεί σε κάθε κινητό', desc: 'Ανοίγει απευθείας στον browser. Οι πελάτες δεν χρειάζεται να κατεβάσουν ή να συνδεθούν πουθενά.', val: 'Χωρίς εφαρμογή' },
        { name: 'Φωτογραφίες & περιγραφές', desc: 'Δείξε το πιάτο, όχι μόνο το όνομά του - όσες λεπτομέρειες θέλεις, για κάθε προϊόν.', val: 'Χωρίς επιπλέον χρέωση' },
        { name: 'Σήμανση εξαντλημένων', desc: 'Ένας διακόπτης όταν η κουζίνα εξαντλήσει κάτι - εξαφανίζεται από την οθόνη κάθε πελάτη.', val: 'Άμεσα' },
        { name: 'Το δικό σου domain', desc: 'Το μενού σου ζει στη δική σου διεύθυνση, όχι σε ένα γενικό subdomain χαμένο μέσα σε ένα URL.', val: 'Περιλαμβάνεται' },
      ],
    },
    final: {
      title: 'Έτοιμος να σταματήσεις τις επανεκτυπώσεις;',
      sub: 'Ρύθμισε το πρώτο σου ψηφιακό μενού σήμερα - γίνεται live τη στιγμή που το αποθηκεύεις.',
      cta: 'Απόκτησε το ψηφιακό σου μενού',
    },
    footer: {
      copyright: 'TAPMYMENU © {year}',
      tagline: 'ΦΤΙΑΓΜΕΝΟ ΓΙΑ ΕΣΤΙΑΤΟΡΙΑ ΠΟΥ ΜΙΣΟΥΝ ΤΙΣ ΕΠΑΝΕΚΤΥΠΩΣΕΙΣ',
    },
  },
};

export default function LandingPage({ locale = 'en' }) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;
  const year = new Date().getFullYear();

  return (
    <div className="tmm-landing" lang={locale}>
      <style>{`
        .tmm-landing {
          --tmm-paper: #FAF7F0;
          --tmm-card: #FFFEFA;
          --tmm-ink: #1C1B19;
          --tmm-text: #26241F;
          --tmm-text-soft: #5B5749;
          --tmm-muted: #8B8577;
          --tmm-border: #E4DFD1;
          --tmm-amber: #E0982F;
          --tmm-amber-dark: #B9791E;
          --tmm-sage: #5F8161;
          --tmm-sage-dark: #4A6A4C;
          --tmm-rust: #B8483A;

          font-family: 'Inter', system-ui, sans-serif;
          background: var(--tmm-paper);
          color: var(--tmm-text);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        .tmm-landing * { box-sizing: border-box; }
        .tmm-landing h1, .tmm-landing h2, .tmm-landing h3 {
          font-family: 'Bitter', Georgia, serif;
          color: var(--tmm-ink);
          margin: 0;
        }
        .tmm-landing .tmm-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .tmm-landing a { color: inherit; text-decoration: none; }
        .tmm-landing button { font-family: inherit; }
        .tmm-landing :focus-visible { outline: 2px solid var(--tmm-amber-dark); outline-offset: 3px; }

        /* ---------- nav ---------- */
        .tmm-nav {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 1120px; margin: 0 auto; padding: 22px 24px;
        }
        .tmm-nav-brand { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
        .tmm-nav-brand h1 { font-size: 19px; letter-spacing: 0.2px; }
        .tmm-nav-brand span { color: var(--tmm-amber-dark); font-size: 11px; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.5px; text-transform: uppercase; }
        .tmm-nav-cta {
          background: var(--tmm-ink); color: #FBF8F1; border: none; border-radius: 999px;
          padding: 10px 18px; font-size: 13.5px; font-weight: 600; cursor: pointer;
          transition: transform .15s ease, background .15s ease;
        }
        .tmm-nav-cta:hover { background: #302D26; transform: translateY(-1px); }

        /* ---------- hero (centered, no visual) ---------- */
        .tmm-hero {
          max-width: 720px; margin: 0 auto; padding: 56px 24px 90px;
          text-align: center; display: flex; flex-direction: column; align-items: center;
        }

        .tmm-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; letter-spacing: 0.5px;
          color: var(--tmm-sage-dark); text-transform: uppercase;
          border: 1px solid #BFD6BF; background: #F1F5EE; border-radius: 999px;
          padding: 5px 12px; margin-bottom: 22px;
        }
        .tmm-eyebrow .tmm-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--tmm-sage); flex-shrink: 0; }

        .tmm-hero h2 {
          font-size: clamp(32px, 5.6vw, 54px); line-height: 1.08; letter-spacing: -0.01em;
          margin-bottom: 20px;
        }
        .tmm-hero h2 em {
          font-style: normal; color: var(--tmm-amber-dark);
          text-decoration: underline; text-decoration-style: wavy; text-decoration-color: var(--tmm-amber);
          text-underline-offset: 4px;
        }
        .tmm-hero p.tmm-sub {
          font-size: 17px; line-height: 1.6; color: var(--tmm-text-soft); max-width: 540px; margin: 0 auto 30px;
        }
        .tmm-hero-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-bottom: 26px; }
        .tmm-btn {
          border: none; border-radius: 8px; padding: 13px 22px; font-size: 14.5px; font-weight: 600;
          cursor: pointer; transition: filter .15s ease, transform .15s ease;
        }
        .tmm-btn-primary { background: var(--tmm-amber); color: #241A08; }
        .tmm-btn-primary:hover { filter: brightness(1.06); transform: translateY(-1px); }
        .tmm-btn-ghost { background: transparent; color: var(--tmm-text-soft); border: 1px solid var(--tmm-border); }
        .tmm-btn-ghost:hover { background: #F1ECDE; }

        .tmm-hero-note { font-size: 12px; color: var(--tmm-muted); font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.3px; }

        /* ---------- how it works ---------- */
        .tmm-section { max-width: 1120px; margin: 0 auto; padding: 70px 24px; }
        .tmm-section-head { text-align: center; max-width: 560px; margin: 0 auto 44px; }
        .tmm-section-head .tmm-eyebrow { margin-bottom: 14px; }
        .tmm-section-head h3 { font-size: clamp(26px, 3.2vw, 34px); margin-bottom: 10px; }
        .tmm-section-head p { color: var(--tmm-text-soft); font-size: 15.5px; line-height: 1.6; }

        .tmm-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 780px) { .tmm-steps { grid-template-columns: 1fr; } }
        .tmm-step {
          background: var(--tmm-card); border: 1px solid var(--tmm-border); border-radius: 10px;
          padding: 26px 22px; position: relative;
        }
        .tmm-step .tmm-step-no {
          font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--tmm-muted);
          border: 1px solid var(--tmm-border); border-radius: 999px; padding: 2px 9px; display: inline-block;
          margin-bottom: 14px;
        }
        .tmm-step h4 { font-family: 'Bitter', Georgia, serif; font-size: 17px; margin-bottom: 8px; color: var(--tmm-ink); }
        .tmm-step p { font-size: 13.5px; color: var(--tmm-text-soft); line-height: 1.55; margin: 0; }

        /* ---------- compare ---------- */
        .tmm-compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
        @media (max-width: 780px) { .tmm-compare-grid { grid-template-columns: 1fr; } }
        .tmm-compare-card { border-radius: 10px; padding: 26px 24px; border: 1px solid var(--tmm-border); }
        .tmm-compare-card.tmm-old { background: #F2EEE3; }
        .tmm-compare-card.tmm-new { background: var(--tmm-card); border-color: #D8E3D8; box-shadow: 0 10px 26px rgba(95,129,97,0.1); }
        .tmm-compare-label {
          font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.4px; text-transform: uppercase;
          margin-bottom: 14px; display: inline-block;
        }
        .tmm-old .tmm-compare-label { color: var(--tmm-rust); }
        .tmm-new .tmm-compare-label { color: var(--tmm-sage-dark); }
        .tmm-compare-card ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 11px; }
        .tmm-compare-card li { font-size: 14px; display: flex; gap: 9px; align-items: flex-start; line-height: 1.5; }
        .tmm-old li::before { content: "✕"; color: var(--tmm-rust); font-size: 12px; margin-top: 2px; flex-shrink: 0; }
        .tmm-new li::before { content: "✓"; color: var(--tmm-sage-dark); font-size: 12px; margin-top: 2px; flex-shrink: 0; }

        /* ---------- feature menu ---------- */
        .tmm-menu-card {
          background: var(--tmm-card); border: 1px solid var(--tmm-border); border-radius: 10px;
          padding: 8px 28px; box-shadow: 0 1px 2px rgba(28,27,25,0.05);
        }
        @media (max-width: 560px) { .tmm-menu-card { padding: 6px 18px; } }
        .tmm-menu-row {
          display: flex; align-items: baseline; gap: 10px; padding: 16px 2px;
          border-bottom: 1px solid var(--tmm-border);
        }
        .tmm-menu-row:last-child { border-bottom: none; }
        .tmm-menu-row .tmm-mn-desc { font-size: 12.5px; color: var(--tmm-muted); display: block; margin-top: 4px; line-height: 1.5; }
        .tmm-menu-row-main { flex: 1; min-width: 0; }
        .tmm-menu-row-top { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
        .tmm-menu-row .tmm-mn-name { font-weight: 600; font-size: 15px; color: var(--tmm-ink); }
        .tmm-menu-row .tmm-mn-leader { flex: 1 1 30px; min-width: 20px; border-bottom: 2px dotted #C9C2AE; margin: 0 2px 5px; }
        .tmm-menu-row .tmm-mn-val {
          font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; font-weight: 600;
          color: var(--tmm-sage-dark); text-transform: uppercase; letter-spacing: 0.3px;
        }

        /* ---------- final cta ---------- */
        .tmm-final {
          max-width: 1120px; margin: 0 auto; padding: 20px 24px 90px;
        }
        .tmm-final-card {
          background: var(--tmm-ink); border-radius: 16px; padding: 56px 40px;
          text-align: center; position: relative; overflow: hidden;
        }
        .tmm-final-card h3 {
          color: #FBF8F1; font-size: clamp(26px, 3.4vw, 36px); margin-bottom: 14px;
        }
        .tmm-final-card p { color: #B8B29F; font-size: 15.5px; margin-bottom: 30px; }
        .tmm-final-card .tmm-btn-primary { padding: 15px 28px; font-size: 15px; }

        /* ---------- footer ---------- */
        .tmm-footer {
          max-width: 1120px; margin: 0 auto; padding: 30px 24px 50px;
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
          color: var(--tmm-muted); font-size: 12px; border-top: 1px solid var(--tmm-border);
        }
        .tmm-footer .tmm-mono { letter-spacing: 0.3px; }
      `}</style>

      {/* ---------- nav ---------- */}
      <nav className="tmm-nav">
        <div className="tmm-nav-brand">
          <h1>TapMyMenu</h1>
          <span>{t.nav.tag}</span>
        </div>
        <a href="#get-started">
          <button className="tmm-nav-cta">{t.nav.cta}</button>
        </a>
      </nav>

      {/* ---------- hero ---------- */}
      <header className="tmm-hero">
        <span className="tmm-eyebrow"><span className="tmm-dot" />{t.hero.eyebrow}</span>
        <h2>{t.hero.headlinePre}<em>{t.hero.headlineEm}</em>{t.hero.headlinePost}</h2>
        <p className="tmm-sub">{t.hero.sub}</p>
        <div className="tmm-hero-actions">
          <a href="#get-started"><button className="tmm-btn tmm-btn-primary">{t.hero.ctaPrimary}</button></a>
          <a href="#how-it-works"><button className="tmm-btn tmm-btn-ghost">{t.hero.ctaSecondary}</button></a>
        </div>
        <div className="tmm-hero-note tmm-mono">{t.hero.note}</div>
      </header>

      {/* ---------- how it works ---------- */}
      <section className="tmm-section" id="how-it-works">
        <div className="tmm-section-head">
          <span className="tmm-eyebrow"><span className="tmm-dot" />{t.how.eyebrow}</span>
          <h3>{t.how.title}</h3>
          <p>{t.how.sub}</p>
        </div>
        <div className="tmm-steps">
          {t.how.steps.map((step, i) => (
            <div className="tmm-step" key={i}>
              <span className="tmm-step-no">{step.no}</span>
              <h4>{step.title}</h4>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- compare ---------- */}
      <section className="tmm-section">
        <div className="tmm-section-head">
          <span className="tmm-eyebrow"><span className="tmm-dot" />{t.compare.eyebrow}</span>
          <h3>{t.compare.title}</h3>
        </div>
        <div className="tmm-compare-grid">
          <div className="tmm-compare-card tmm-old">
            <span className="tmm-compare-label tmm-mono">{t.compare.oldLabel}</span>
            <ul>{t.compare.oldItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
          </div>
          <div className="tmm-compare-card tmm-new">
            <span className="tmm-compare-label tmm-mono">{t.compare.newLabel}</span>
            <ul>{t.compare.newItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
          </div>
        </div>
      </section>

      {/* ---------- features as a menu ---------- */}
      <section className="tmm-section">
        <div className="tmm-section-head">
          <span className="tmm-eyebrow"><span className="tmm-dot" />{t.features.eyebrow}</span>
          <h3>{t.features.title}</h3>
        </div>
        <div className="tmm-menu-card">
          {t.features.rows.map((row, i) => (
            <div className="tmm-menu-row" key={i}>
              <div className="tmm-menu-row-main">
                <div className="tmm-menu-row-top">
                  <span className="tmm-mn-name">{row.name}</span>
                  <span className="tmm-mn-leader" />
                  <span className="tmm-mn-val">{row.val}</span>
                </div>
                <span className="tmm-mn-desc">{row.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- final cta ---------- */}
      <section className="tmm-final" id="get-started">
        <div className="tmm-final-card">
          <h3>{t.final.title}</h3>
          <p>{t.final.sub}</p>
          <a href="/"><button className="tmm-btn tmm-btn-primary">{t.final.cta}</button></a>
        </div>
      </section>

      {/* ---------- footer ---------- */}
      <footer className="tmm-footer">
        <span className="tmm-mono">{t.footer.copyright.replace('{year}', year)}</span>
        <span className="tmm-mono">{t.footer.tagline}</span>
      </footer>
    </div>
  );
}
