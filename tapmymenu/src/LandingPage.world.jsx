import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * TapMyMenu - a scroll-driven 3D world, not a 2D page with a 3D object on it.
 *
 * HOW IT WORKS
 * The page has one real scrollable element (a tall spacer). As the visitor
 * scrolls it - trackpad, wheel, touch, keyboard, scrollbar drag, all of it,
 * nothing is scroll-jacked - we read native scrollY each frame and use it
 * as a 0..1 "journey progress" value. That value drives:
 *   1. the camera's position along a hand-authored path through 3D space
 *      (a Catmull-Rom spline through seven waypoints, each with its own
 *      camera-relative offset), traversed at constant speed,
 *   2. which "station" content (eyebrow/title/copy/buttons) is visible,
 *      cross-fading as the camera arrives at and leaves each one.
 * Each station is a genuinely different 3D set-piece - a liquid blob, a
 * cluster of floating menu cards, a tabletop with a glowing NFC chip, a
 * field of rising review-stars, a stat badge with a particle burst, and a
 * larger warm-toned blob for the finale - not the same object repeated.
 *
 * Clicking a dot in the right-hand nav smooth-scrolls to that station.
 * Native scroll = accessibility (keyboard, screen reader DOM order,
 * scrollbar) all keep working, unlike a fully scroll-jacked experience.
 *
 * FALLBACK
 * Visitors without WebGL, or with "reduce motion" set in their OS, get a
 * clean stacked-content fallback with the same copy and brand styling -
 * no camera motion, no canvas, just a normal readable page.
 *
 * INTEGRATION
 *   npm install three
 *   <Route path="/" element={<LandingPage />} />
 * Fonts - add to <head> of public/index.html:
 *   <link rel="preconnect" href="https://fonts.googleapis.com">
 *   <link href="https://fonts.googleapis.com/css2?family=Bitter:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
 */

const LOCALES = ['en', 'bg', 'ru', 'el'];

const TRANSLATIONS = {
  en: {
    localeLabel: 'EN',
    nav: { tag: 'AI-powered digital menus' },
    hero: {
      eyebrow: 'Live in under 5 minutes',
      headlinePre: 'Your menu. ',
      headlineEm: 'Always right.',
      headlinePost: ' Everywhere your guests are.',
      sub: 'One tap, and guests see your real menu - in their own language, updated to the minute. No app, no printing, no waiting.',
      ctaPrimary: 'See what we do',
      ctaSecondary: 'Join YummGPT free',
      note: 'SCROLL TO EXPLORE',
    },
    offerings: [
      { title: 'A menu that keeps up with you', desc: "Change a price, add today's special, or swap your whole lunch menu - it's live in seconds, every time." },
      { title: 'An AI host for every guest', desc: "YummGPT helps guests from anywhere in the world find the dish that's right for them, in their own language." },
      { title: 'Tap the table, see the menu', desc: 'We design and set up smart table stickers or chips - guests just tap their phone. No scanning, no app.' },
      { title: 'More happy guests, more reviews', desc: 'Our system makes leaving a review effortless. Restaurants using it see up to 95% more reviews in 3 months.' },
    ],
    stat: { value: '95%', title: 'More reviews. Proven.', sub: 'Restaurants on TapMyMenu see up to 95% more guest reviews within their first 3 months.' },
    yumm: {
      eyebrow: 'Free to join',
      title: 'Join the YummGPT network.',
      titleEm: 'For free.',
      sub: 'Get discovered by hungry guests looking for exactly what you serve. No cost, no catch.',
      cta: 'Join YummGPT for free',
      note: "We'll reach out to get you set up.",
    },
    footer: { copyright: 'TAPMYMENU © {year}', tagline: 'MADE FOR RESTAURANTS THAT HATE REPRINTING' },
  },

  bg: {
    localeLabel: 'BG',
    nav: { tag: 'Дигитални менюта с изкуствен интелект' },
    hero: {
      eyebrow: 'На живо за под 5 минути',
      headlinePre: 'Твоето меню. ',
      headlineEm: 'Винаги точно.',
      headlinePost: ' Навсякъде, където са гостите ти.',
      sub: 'Едно докосване - и гостите виждат истинското ти меню, на техния език, актуално до минута. Без приложение, без печат, без чакане.',
      ctaPrimary: 'Виж какво правим',
      ctaSecondary: 'Присъедини се безплатно',
      note: 'СКРОЛНИ, ЗА ДА РАЗГЛЕДАШ',
    },
    offerings: [
      { title: 'Меню, което не изостава от теб', desc: 'Смени цена, добави специалитет на деня или цялото обедно меню - живо е за секунди, всеки път.' },
      { title: 'AI домакин за всеки гост', desc: 'YummGPT помага на гости от цял свят да намерят точното за тях ястие - на техния собствен език.' },
      { title: 'Докосни масата, виж менюто', desc: 'Проектираме и монтираме умни стикери или чипове на масите - гостите просто докосват телефона си. Без сканиране, без приложение.' },
      { title: 'Повече доволни гости, повече отзиви', desc: 'Нашата система прави оставянето на отзив лесно. Заведенията с нея получават до 95% повече отзиви за 3 месеца.' },
    ],
    stat: { value: '95%', title: 'Повече отзиви. Доказано.', sub: 'Заведенията в TapMyMenu получават до 95% повече отзиви от гости в първите 3 месеца.' },
    yumm: {
      eyebrow: 'Безплатно присъединяване',
      title: 'Присъедини се към мрежата YummGPT.',
      titleEm: 'Безплатно.',
      sub: 'Бъди открит от гладни гости, търсещи точно това, което предлагаш. Без такса, без уловка.',
      cta: 'Присъедини се безплатно',
      note: 'Ще се свържем с теб, за да те настроим.',
    },
    footer: { copyright: 'TAPMYMENU © {year}', tagline: 'СЪЗДАДЕНО ЗА РЕСТОРАНТИ, КОИТО МРАЗЯТ ПРЕПЕЧАТВАНЕТО' },
  },

  ru: {
    localeLabel: 'RU',
    nav: { tag: 'Цифровые меню с искусственным интеллектом' },
    hero: {
      eyebrow: 'Запуск менее чем за 5 минут',
      headlinePre: 'Ваше меню. ',
      headlineEm: 'Всегда точное.',
      headlinePost: ' Везде, где ваши гости.',
      sub: 'Одно касание - и гости видят настоящее меню, на своём языке, актуальное до минуты. Без приложения, без печати, без ожидания.',
      ctaPrimary: 'Смотреть, что мы делаем',
      ctaSecondary: 'Вступить бесплатно',
      note: 'ПРОКРУТИТЕ, ЧТОБЫ ИЗУЧИТЬ',
    },
    offerings: [
      { title: 'Меню, которое поспевает за вами', desc: 'Смените цену, добавьте блюдо дня или всё обеденное меню - оно обновится за секунды, каждый раз.' },
      { title: 'ИИ-хост для каждого гостя', desc: 'YummGPT помогает гостям со всего мира найти подходящее блюдо - на их родном языке.' },
      { title: 'Коснитесь стола - откройте меню', desc: 'Мы разработаем и установим умные наклейки или чипы на столах - гости просто прикладывают телефон. Без сканирования, без приложения.' },
      { title: 'Больше довольных гостей - больше отзывов', desc: 'Наша система делает оставление отзыва лёгким. Рестораны с ней получают до 95% больше отзывов за 3 месяца.' },
    ],
    stat: { value: '95%', title: 'Больше отзывов. Доказано.', sub: 'Рестораны на TapMyMenu получают до 95% больше отзывов гостей за первые 3 месеца.' },
    yumm: {
      eyebrow: 'Бесплатное присоединение',
      title: 'Вступите в сеть YummGPT.',
      titleEm: 'Бесплатно.',
      sub: 'Станьте заметны для голодных гостей, ищущих именно то, что вы готовите. Без платы, без подвоха.',
      cta: 'Вступить бесплатно',
      note: 'Мы свяжемся с вами, чтобы всё настроить.',
    },
    footer: { copyright: 'TAPMYMENU © {year}', tagline: 'СОЗДАНО ДЛЯ РЕСТОРАНОВ, КОТОРЫЕ НЕ ЛЮБЯТ ПЕРЕПЕЧАТКУ' },
  },

  el: {
    localeLabel: 'EL',
    nav: { tag: 'Ψηφιακά μενού με τεχνητή νοημοσύνη' },
    hero: {
      eyebrow: 'Ζωντανό σε λιγότερο από 5 λεπτά',
      headlinePre: 'Το μενού σου. ',
      headlineEm: 'Πάντα σωστό.',
      headlinePost: ' Παντού όπου είναι οι πελάτες σου.',
      sub: 'Ένα άγγιγμα, και οι πελάτες βλέπουν το πραγματικό σου μενού, στη γλώσσα τους, ενημερωμένο ανά λεπτό. Χωρίς εφαρμογή, χωρίς εκτύπωση, χωρίς αναμονή.',
      ctaPrimary: 'Δες τι κάνουμε',
      ctaSecondary: 'Μπες δωρεάν',
      note: 'ΚΑΝΕ SCROLL ΓΙΑ ΝΑ ΕΞΕΡΕΥΝΗΣΕΙΣ',
    },
    offerings: [
      { title: 'Ένα μενού που σε ακολουθεί', desc: 'Άλλαξε μια τιμή, πρόσθεσε το πιάτο της ημέρας ή όλο το μεσημεριανό μενού - είναι live σε δευτερόλεπτα, κάθε φορά.' },
      { title: 'Ένας AI οικοδεσπότης για κάθε πελάτη', desc: 'Το YummGPT βοηθά πελάτες από όλο τον κόσμο να βρουν το πιάτο που τους ταιριάζει, στη δική τους γλώσσα.' },
      { title: 'Άγγιξε το τραπέζι, δες το μενού', desc: 'Σχεδιάζουμε και τοποθετούμε έξυπνα αυτοκόλλητα ή chips στα τραπέζια - οι πελάτες απλώς ακουμπούν το κινητό τους. Χωρίς σάρωση, χωρίς εφαρμογή.' },
      { title: 'Πιο ευχαριστημένοι πελάτες, περισσότερες κριτικές', desc: 'Το σύστημά μας κάνει την αξιολόγηση εύκολη. Τα εστιατόρια που το χρησιμοποιούν βλέπουν έως 95% περισσότερες κριτικές σε 3 μήνες.' },
    ],
    stat: { value: '95%', title: 'Περισσότερες κριτικές. Αποδεδειγμένα.', sub: 'Τα εστιατόρια στο TapMyMenu βλέπουν έως 95% περισσότερες κριτικές πελατών μέσα στους πρώτους 3 μήνες.' },
    yumm: {
      eyebrow: 'Δωρεάν συμμετοχή',
      title: 'Μπες στο δίκτυο YummGPT.',
      titleEm: 'Δωρεάν.',
      sub: 'Γίνε ορατός σε πεινασμένους πελάτες που ψάχνουν ακριβώς αυτό που σερβίρεις. Χωρίς κόστος, χωρίς παγίδα.',
      cta: 'Μπες δωρεάν',
      note: 'Θα επικοινωνήσουμε μαζί σου για να σε ρυθμίσουμε.',
    },
    footer: { copyright: 'TAPMYMENU © {year}', tagline: 'ΦΤΙΑΓΜΕΝΟ ΓΙΑ ΕΣΤΙΑΤΟΡΙΑ ΠΟΥ ΜΙΣΟΥΝ ΤΙΣ ΕΠΑΝΕΚΤΥΠΩΣΕΙΣ' },
  },
};

function detectInitialLocale() {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem('tmm-locale');
    if (saved && LOCALES.includes(saved)) return saved;
  } catch {
    // ignore
  }
  const nav = (window.navigator.language || 'en').slice(0, 2).toLowerCase();
  return LOCALES.includes(nav) ? nav : 'en';
}

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

const PALETTE = {
  amber: 0xbd4444,
  amberDark: 0xbd4444,
  sage: 0x73976a,
  sageDark: 0x677e61,
  rust: 0xbd4444,
  cream: 0xf1dec4,
  ink: 0x677e61,
  violetLight: 0xf1dec4,
};

/* ---------------------------------------------------------------------- */
/* Per-station 3D set-pieces - each returns { group, update(t), dispose() }*/
/* ---------------------------------------------------------------------- */

function buildPhoneGroup() {
  const group = new THREE.Group();
  const disposables = [];

  const bodyGeo = new THREE.BoxGeometry(1.0, 2.0, 0.12);
  const bodyMat = new THREE.MeshStandardMaterial({ color: PALETTE.ink, roughness: 0.4, metalness: 0.35 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);
  disposables.push(bodyGeo, bodyMat);

  const screenGeo = new THREE.PlaneGeometry(0.86, 1.78);
  const screenMat = new THREE.MeshStandardMaterial({
    color: PALETTE.cream,
    roughness: 0.3,
    emissive: new THREE.Color(PALETTE.amber).multiplyScalar(0.06),
  });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.z = 0.061;
  group.add(screen);
  disposables.push(screenGeo, screenMat);

  // a little "photo" thumbnail at the top of the list
  const photoGeo = new THREE.BoxGeometry(0.24, 0.24, 0.01);
  const photoMat = new THREE.MeshStandardMaterial({
    color: PALETTE.amber,
    emissive: new THREE.Color(PALETTE.amber).multiplyScalar(0.3),
    roughness: 0.4,
  });
  const photo = new THREE.Mesh(photoGeo, photoMat);
  photo.position.set(-0.27, 0.62, 0.067);
  group.add(photo);
  disposables.push(photoGeo, photoMat);

  // menu list lines, alternating widths like a real menu (name + price rows)
  const lineMat = new THREE.MeshStandardMaterial({ color: PALETTE.sageDark, roughness: 0.5 });
  disposables.push(lineMat);
  const lineGeos = [];
  const rows = [
    { y: 0.66, w: 0.42 },
    { y: 0.56, w: 0.3 },
    { y: 0.32, w: 0.5 },
    { y: 0.14, w: 0.5 },
    { y: -0.04, w: 0.5 },
    { y: -0.22, w: 0.5 },
    { y: -0.4, w: 0.5 },
  ];
  rows.forEach((r) => {
    const geo = new THREE.BoxGeometry(r.w, 0.06, 0.01);
    lineGeos.push(geo);
    const line = new THREE.Mesh(geo, lineMat);
    const x = r.w > 0.4 ? -0.03 : 0.03;
    line.position.set(x, r.y, 0.067);
    group.add(line);
  });
  disposables.push(...lineGeos);

  return { group, body, disposables };
}

function buildPhoneStation() {
  const group = new THREE.Group();
  const { group: phoneGroup, disposables } = buildPhoneGroup();
  phoneGroup.rotation.x = -0.08;
  group.add(phoneGroup);

  return {
    group,
    update(t) {
      phoneGroup.rotation.y = Math.sin(t * 0.35) * 0.5;
      phoneGroup.position.y = Math.sin(t * 0.6) * 0.12;
    },
    dispose() {
      disposables.forEach((d) => d.dispose());
    },
  };
}

function buildTableMesh(scale = 1, color = PALETTE.cream) {
  const group = new THREE.Group();
  const disposables = [];

  const topGeo = new THREE.BoxGeometry(1.6 * scale, 0.08 * scale, 1.0 * scale);
  const topMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5 });
  const top = new THREE.Mesh(topGeo, topMat);
  top.position.y = 0.55 * scale;
  group.add(top);
  disposables.push(topGeo, topMat);

  const legGeo = new THREE.CylinderGeometry(0.04 * scale, 0.04 * scale, 0.55 * scale, 8);
  const legMat = new THREE.MeshStandardMaterial({ color: PALETTE.ink, roughness: 0.6 });
  disposables.push(legGeo, legMat);
  const legOffsets = [
    [-0.68, -0.4],
    [0.68, -0.4],
    [-0.68, 0.4],
    [0.68, 0.4],
  ];
  legOffsets.forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x * scale, 0.275 * scale, z * scale);
    group.add(leg);
  });

  return { group, top, disposables };
}

function buildNfcCardGroup() {
  const group = new THREE.Group();
  const disposables = [];

  const cardGeo = new THREE.BoxGeometry(0.85, 0.54, 0.035);
  const cardMat = new THREE.MeshStandardMaterial({ color: PALETTE.sage, roughness: 0.35, metalness: 0.25 });
  const card = new THREE.Mesh(cardGeo, cardMat);
  group.add(card);
  disposables.push(cardGeo, cardMat);

  const chipGeo = new THREE.BoxGeometry(0.16, 0.12, 0.012);
  const chipMat = new THREE.MeshStandardMaterial({
    color: PALETTE.amber,
    metalness: 0.6,
    roughness: 0.3,
    emissive: new THREE.Color(PALETTE.amber).multiplyScalar(0.2),
  });
  const chip = new THREE.Mesh(chipGeo, chipMat);
  chip.position.set(-0.24, 0.09, 0.024);
  group.add(chip);
  disposables.push(chipGeo, chipMat);

  const ringGeo = new THREE.RingGeometry(0.05, 0.065, 24);
  const ringMat = new THREE.MeshBasicMaterial({ color: PALETTE.amber, transparent: true, opacity: 0.55, side: THREE.DoubleSide });
  disposables.push(ringGeo, ringMat);
  const rings = [0, 1, 2].map((i) => {
    const mesh = new THREE.Mesh(ringGeo, ringMat.clone());
    mesh.position.set(0.18, 0.05, 0.05);
    group.add(mesh);
    disposables.push(mesh.material);
    return { mesh, offset: i * 0.7 };
  });

  return { group, card, rings, disposables };
}

function buildTapStation() {
  const group = new THREE.Group();

  const mainTable = buildTableMesh(1, PALETTE.cream);
  mainTable.group.position.set(0, -0.55, 0);
  group.add(mainTable.group);

  const sideTable = buildTableMesh(0.62, PALETTE.cream);
  sideTable.group.position.set(-1.7, -0.72, -1.1);
  sideTable.group.rotation.y = 0.4;
  group.add(sideTable.group);

  const nfc = buildNfcCardGroup();
  nfc.group.rotation.x = -Math.PI / 2.4;
  nfc.group.position.set(0.15, 0.15, 0.1);
  group.add(nfc.group);

  return {
    group,
    update(t) {
      nfc.group.position.y = 0.15 + Math.sin(t * 1.1) * 0.05;
      nfc.group.rotation.z = Math.sin(t * 0.5) * 0.15;
      nfc.rings.forEach((r, i) => {
        const local = ((t * 0.6 + r.offset) % 1.4);
        const scale = 0.4 + local * 1.8;
        r.mesh.scale.setScalar(scale);
        r.mesh.material.opacity = Math.max(0, 0.55 - local * 0.45);
      });
    },
    dispose() {
      mainTable.disposables.forEach((d) => d.dispose());
      sideTable.disposables.forEach((d) => d.dispose());
      nfc.disposables.forEach((d) => d.dispose());
    },
  };
}

function buildSparkleMesh(color, size) {
  const geo = new THREE.OctahedronGeometry(size, 0);
  geo.scale(0.28, 1, 0.28);
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.25,
    metalness: 0.15,
    emissive: new THREE.Color(color).multiplyScalar(0.35),
  });
  const group = new THREE.Group();
  const vertical = new THREE.Mesh(geo, mat);
  group.add(vertical);
  const horizontal = new THREE.Mesh(geo, mat);
  horizontal.rotation.z = Math.PI / 2;
  group.add(horizontal);
  return { group, disposables: [geo, mat] };
}

function buildSparkleCluster(layout, colors, rotationSpeed = 0.15) {
  const palette = colors || [PALETTE.amber, PALETTE.sage, PALETTE.sageDark, PALETTE.cream];
  const group = new THREE.Group();
  const disposables = [];
  const sparkles = layout.map((p, i) => {
    const { group: sGroup, disposables: d } = buildSparkleMesh(palette[i % palette.length], p.size);
    sGroup.position.set(p.x, p.y, p.z);
    group.add(sGroup);
    disposables.push(...d);
    return { mesh: sGroup, base: p, speed: 0.6 + Math.random() * 0.6, seed: Math.random() * 10 };
  });

  return {
    group,
    update(t) {
      sparkles.forEach((s) => {
        const pulse = 0.75 + Math.sin(t * s.speed + s.seed) * 0.25;
        s.mesh.scale.setScalar(pulse);
        s.mesh.rotation.y = t * (0.4 + s.speed * 0.2);
        s.mesh.rotation.z = t * 0.2;
        s.mesh.position.y = s.base.y + Math.sin(t * s.speed * 0.6 + s.seed) * 0.08;
      });
      group.rotation.y = Math.sin(t * rotationSpeed) * 0.3;
    },
    dispose() {
      disposables.forEach((d) => d.dispose());
    },
  };
}

const AI_SPARKLE_LAYOUT = [
  { x: 0, y: 0.1, z: 0, size: 0.32 },
  { x: -0.85, y: 0.55, z: -0.3, size: 0.16 },
  { x: 0.9, y: 0.4, z: 0.2, size: 0.2 },
  { x: -0.6, y: -0.55, z: 0.3, size: 0.14 },
  { x: 0.7, y: -0.6, z: -0.2, size: 0.18 },
  { x: 0.1, y: 0.95, z: -0.4, size: 0.12 },
  { x: -1.15, y: -0.1, z: -0.1, size: 0.1 },
];

const HERO_SPARKLE_LAYOUT = [
  { x: 0, y: 0.15, z: 0, size: 0.3 },
  { x: -1.3, y: 0.7, z: -0.5, size: 0.16 },
  { x: 1.35, y: 0.5, z: 0.3, size: 0.2 },
  { x: -0.9, y: -0.8, z: 0.4, size: 0.14 },
  { x: 1.1, y: -0.9, z: -0.3, size: 0.18 },
  { x: 0.15, y: 1.3, z: -0.6, size: 0.12 },
  { x: -1.6, y: -0.15, z: -0.2, size: 0.1 },
  { x: 1.7, y: 0.05, z: -0.5, size: 0.11 },
  { x: 0.4, y: -1.3, z: 0.2, size: 0.13 },
];

const FINALE_SPARKLE_LAYOUT = [
  { x: 0, y: 0.2, z: 0, size: 0.36 },
  { x: -1.6, y: 0.8, z: -0.4, size: 0.18 },
  { x: 1.7, y: 0.6, z: 0.3, size: 0.22 },
  { x: -1.1, y: -0.9, z: 0.5, size: 0.16 },
  { x: 1.3, y: -1.0, z: -0.3, size: 0.2 },
  { x: 0.2, y: 1.5, z: -0.6, size: 0.14 },
  { x: -2.0, y: -0.1, z: -0.2, size: 0.12 },
  { x: 2.1, y: 0.1, z: -0.5, size: 0.13 },
  { x: 0.5, y: -1.6, z: 0.2, size: 0.15 },
  { x: -0.7, y: 0.3, z: 0.7, size: 0.1 },
  { x: 0.9, y: -0.3, z: 0.8, size: 0.11 },
  { x: -0.2, y: -0.6, z: -0.9, size: 0.13 },
];

function buildSparklesStation() {
  return buildSparkleCluster(AI_SPARKLE_LAYOUT, null, 0.15);
}

function buildHeroSparkles() {
  return buildSparkleCluster(HERO_SPARKLE_LAYOUT, null, 0.08);
}

function buildFinaleSparkles() {
  return buildSparkleCluster(FINALE_SPARKLE_LAYOUT, [PALETTE.amber, PALETTE.sageDark, PALETTE.sage, PALETTE.cream], 0.22);
}

function buildStarsGroup(count = 14) {
  const group = new THREE.Group();
  const geo = new THREE.OctahedronGeometry(0.1, 0);
  const mat = new THREE.MeshStandardMaterial({
    color: PALETTE.amber,
    roughness: 0.25,
    metalness: 0.2,
    emissive: new THREE.Color(PALETTE.amber).multiplyScalar(0.25),
  });
  const stars = Array.from({ length: count }).map(() => {
    const mesh = new THREE.Mesh(geo, mat);
    const x = (Math.random() - 0.5) * 3.2;
    const z = (Math.random() - 0.5) * 1.6;
    const span = 2.4 + Math.random() * 0.8;
    mesh.position.set(x, -span / 2 + Math.random() * span, z);
    const scale = 0.6 + Math.random() * 0.7;
    mesh.scale.setScalar(scale);
    group.add(mesh);
    return { mesh, baseY: mesh.position.y, speed: 0.25 + Math.random() * 0.3, span };
  });
  return {
    group,
    update(t) {
      stars.forEach((s) => {
        s.mesh.position.y = (((s.baseY + t * s.speed) % s.span) + s.span) % s.span - s.span / 2;
        s.mesh.rotation.y += 0.01;
        s.mesh.rotation.x += 0.006;
      });
    },
    dispose() {
      geo.dispose();
      mat.dispose();
    },
  };
}

function buildStatGroup() {
  const group = new THREE.Group();
  const ringGeo = new THREE.TorusGeometry(1.1, 0.1, 24, 64);
  const ringMat = new THREE.MeshStandardMaterial({
    color: PALETTE.sage,
    roughness: 0.3,
    metalness: 0.25,
    emissive: new THREE.Color(PALETTE.sage).multiplyScalar(0.2),
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  group.add(ring);

  const burst = buildStarsGroup(20);
  group.add(burst.group);

  return {
    group,
    update(t) {
      ring.rotation.z = t * 0.15;
      ring.rotation.x = Math.sin(t * 0.3) * 0.2;
      burst.update(t);
    },
    dispose() {
      ringGeo.dispose();
      ringMat.dispose();
      burst.dispose();
    },
  };
}

/* ---------------------------------------------------------------------- */
/* Station data - anchors in world space + which set-piece + content      */
/* ---------------------------------------------------------------------- */

function buildStations(t) {
  const year = new Date().getFullYear();
  return [
    {
      anchor: new THREE.Vector3(0, 0, 0),
      build: () => buildHeroSparkles(),
      content: {
        eyebrow: null,
        titleParts: [t.hero.headlinePre, { em: t.hero.headlineEm }, t.hero.headlinePost],
        sub: t.hero.sub,
        actions: [
          { label: t.hero.ctaPrimary, target: 1, primary: true },
          { label: t.hero.ctaSecondary, target: 6, primary: false },
        ],
        note: t.hero.note,
      },
    },
    {
      anchor: new THREE.Vector3(2.4, 0.3, -9),
      build: () => buildPhoneStation(),
      content: {
        eyebrow: null,
        titleParts: [t.offerings[0].title],
        sub: t.offerings[0].desc,
        actions: [{ label: t.yumm.cta, target: 6, primary: true }],
      },
    },
    {
      anchor: new THREE.Vector3(-2.6, -0.2, -18),
      build: () => buildSparklesStation(),
      content: {
        eyebrow: null,
        titleParts: [t.offerings[1].title],
        sub: t.offerings[1].desc,
        actions: [{ label: t.yumm.cta, target: 6, primary: true }],
      },
    },
    {
      anchor: new THREE.Vector3(2.2, 0.5, -27),
      build: () => buildTapStation(),
      content: {
        eyebrow: null,
        titleParts: [t.offerings[2].title],
        sub: t.offerings[2].desc,
        actions: [{ label: t.yumm.cta, target: 6, primary: true }],
      },
    },
    {
      anchor: new THREE.Vector3(-2.4, -0.3, -36),
      build: () => buildStarsGroup(14),
      content: {
        eyebrow: null,
        titleParts: [t.offerings[3].title],
        sub: t.offerings[3].desc,
        actions: [{ label: t.yumm.cta, target: 6, primary: true }],
      },
    },
    {
      anchor: new THREE.Vector3(0, 0.6, -45),
      build: () => buildStatGroup(),
      content: {
        eyebrow: null,
        titleParts: [t.stat.value],
        sub: `${t.stat.title} ${t.stat.sub}`,
        isStat: true,
        actions: [{ label: t.yumm.cta, target: 6, primary: true }],
      },
    },
    {
      anchor: new THREE.Vector3(0, 0, -55),
      build: () => buildFinaleSparkles(),
      content: {
        eyebrow: t.yumm.eyebrow,
        titleParts: [t.yumm.title + ' ', { em: t.yumm.titleEm }],
        sub: t.yumm.sub,
        actions: [{ label: t.yumm.cta, target: 'https://yummgpt.com', primary: true }],
        note: t.yumm.note,
        footer: `${t.footer.copyright.replace('{year}', year)} · ${t.footer.tagline}`,
      },
    },
  ];
}

function renderTitleParts(parts) {
  return parts.map((p, i) =>
    typeof p === 'string' ? (
      <React.Fragment key={i}>{p}</React.Fragment>
    ) : (
      <span
        key={i}
        className="not-italic text-primary-700 underline decoration-wavy decoration-primary-500 underline-offset-4"
      >
        {p.em}
      </span>
    )
  );
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function isExternalUrl(target) {
  return typeof target === 'string' && (target.startsWith('http') || target.startsWith('//'));
}

/* ---------------------------------------------------------------------- */
/* The 3D world - canvas, camera path, scroll wiring                      */
/* ---------------------------------------------------------------------- */

const SEGMENT_VH = 140; // scroll distance per station, in vh

function World3D({ stations, activeIndexRef, onActiveChange, contentRefs }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, isCoarsePointer ? 1.5 : 2);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(dpr);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffe8c2, 1.1);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8fbf91, 0.35);
    rim.position.set(-4, -2, 2);
    scene.add(rim);

    // build every station's 3D content at its world anchor
    const runtimes = stations.map((s) => {
      const rt = s.build();
      rt.group.position.copy(s.anchor);
      scene.add(rt.group);
      return rt;
    });

    // camera path: constant-speed spline through each anchor's camera offset
    const camPoints = stations.map((s) => s.anchor.clone().add(new THREE.Vector3(0, 1.1, 6)));
    const pathCurve = new THREE.CatmullRomCurve3(camPoints, false, 'catmullrom', 0.4);
    const lookCurve = new THREE.CatmullRomCurve3(
      stations.map((s) => s.anchor.clone()),
      false,
      'catmullrom',
      0.4
    );

    function applySize(w, h) {
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      applySize(width, height);
    });
    ro.observe(mount);
    applySize(mount.clientWidth, mount.clientHeight);

    const pointer = { x: 0, y: 0 };
    function handlePointerMove(e) {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let isVisible = true;
    const io = new IntersectionObserver(([entry]) => (isVisible = entry.isIntersecting), { threshold: 0 });
    io.observe(mount);

    function maxScroll() {
      return document.documentElement.scrollHeight - window.innerHeight;
    }

    const clock = new THREE.Clock();
    let raf;
    let lastActive = -1;

    function animate() {
      raf = requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = clock.getElapsedTime();
      runtimes.forEach((rt) => rt.update(t));

      const progress = clamp(window.scrollY / Math.max(1, maxScroll()), 0, 1);
      const pos = pathCurve.getPointAt(progress);
      const look = lookCurve.getPointAt(progress);
      camera.position.copy(pos);
      camera.lookAt(look);
      camera.rotation.y += pointer.x * 0.025;
      camera.rotation.x += pointer.y * 0.018;

      // cross-fade content + toggle active dot.
      // Plateau near each station (fully readable, no competing text),
      // then ease out, reaching 0 exactly at the midpoint to the next
      // station - so at most one station's copy is ever meaningfully
      // visible, instead of a long linear overlap across the whole gap.
      const floatIndex = progress * (stations.length - 1);
      const nearest = Math.round(floatIndex);
      if (nearest !== lastActive) {
        lastActive = nearest;
        activeIndexRef.current = nearest;
        onActiveChange(nearest);
      }
      const PLATEAU = 0.15;
      const FADE_END = 0.5;
      contentRefs.current.forEach((el, i) => {
        if (!el) return;
        const dist = Math.abs(floatIndex - i);
        let opacity;
        if (dist <= PLATEAU) {
          opacity = 1;
        } else if (dist >= FADE_END) {
          opacity = 0;
        } else {
          const local = (dist - PLATEAU) / (FADE_END - PLATEAU);
          opacity = 1 - local * local * (3 - 2 * local); // smoothstep ease-out
        }
        el.style.opacity = opacity.toFixed(3);
        el.style.transform = `translateY(${(1 - opacity) * 16}px)`;
        el.style.pointerEvents = opacity > 0.6 ? 'auto' : 'none';
        el.setAttribute('aria-hidden', opacity > 0.6 ? 'false' : 'true');
      });

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      mount.removeChild(renderer.domElement);
      runtimes.forEach((rt) => rt.dispose());
      renderer.dispose();
    };
  }, [stations, activeIndexRef, onActiveChange, contentRefs]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none [&>canvas]:block [&>canvas]:!w-full [&>canvas]:!h-full"
      aria-hidden="true"
    />
  );
}

/* ---------------------------------------------------------------------- */
/* Fallback for no-WebGL / reduced-motion visitors                        */
/* ---------------------------------------------------------------------- */

function FallbackStacked({ stations, onNavigate }) {
  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-14">
      {stations.map((s, i) => (
        <section key={i} className="border-b border-secondary-600/25 py-14 text-center last:border-b-0">
          {s.content.eyebrow && (
            <span className="mb-4 inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-widest text-primary-700">
              <span className="h-px w-5 bg-current opacity-70" />
              {s.content.eyebrow}
            </span>
          )}
          <h2
            className={
              s.content.isStat
                ? 'mb-4 font-display text-[clamp(56px,12vw,100px)] font-semibold leading-none text-secondary-600'
                : 'mb-4 font-display text-[clamp(28px,5vw,44px)] font-semibold leading-[1.1] tracking-tight text-secondary-900'
            }
          >
            {renderTitleParts(s.content.titleParts)}
          </h2>
          <p className="mx-auto mb-5 max-w-md text-base leading-relaxed text-secondary-800">{s.content.sub}</p>
          {s.content.actions && (
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
              {s.content.actions.map((a, ai) => (
                <button
                  key={ai}
                  onClick={() => {
                    if (isExternalUrl(a.target)) {
                      window.location.href = a.target;
                    } else if (a.target != null) {
                      onNavigate(a.target);
                    }
                  }}
                  className={
                    a.primary
                      ? 'inline-flex items-center justify-center gap-x-2 rounded-lg bg-primary-500 px-4 py-3 text-sm font-semibold text-cream-50 shadow-sm transition-all duration-200 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 focus:ring-offset-cream-200'
                      : 'inline-flex items-center justify-center gap-x-2 rounded-lg border border-secondary-600/30 bg-secondary-600/[0.06] px-4 py-3 text-sm font-semibold text-secondary-900 transition-all duration-200 hover:bg-secondary-600/[0.14] focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:ring-offset-2 focus:ring-offset-cream-200'
                  }
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}
          {s.content.note && <div className="font-mono text-xs tracking-wide text-secondary-900/70">{s.content.note}</div>}
          {s.content.footer && <div className="mt-2 font-mono text-xs tracking-wide text-secondary-900/70">{s.content.footer}</div>}
        </section>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Small shared bits                                                      */
/* ---------------------------------------------------------------------- */

function TmmMark({ size = 30 }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary-500 font-mono font-semibold tracking-wide text-cream-50"
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      aria-hidden="true"
    >
      TMM
    </span>
  );
}

function MagneticButton({ className, children, ...props }) {
  const ref = useRef(null);
  function handleMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.12}px, ${y * 0.25}px)`;
  }
  function handleLeave() {
    if (ref.current) ref.current.style.transform = 'translate(0, 0)';
  }
  return (
    <button ref={ref} className={className} onMouseMove={handleMove} onMouseLeave={handleLeave} {...props}>
      {children}
    </button>
  );
}

/* ---------------------------------------------------------------------- */
/* Main component                                                         */
/* ---------------------------------------------------------------------- */

export default function LandingPage() {
  const [locale, setLocale] = useState(detectInitialLocale);
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;

  const [capable, setCapable] = useState(true);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setCapable(isWebGLAvailable() && !reduced);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('tmm-locale', locale);
    } catch {
      // ignore
    }
  }, [locale]);

  const stations = useMemo(() => buildStations(t), [t]);
  const contentRefs = useRef([]);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  function scrollToStation(i) {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const top = (i / (stations.length - 1)) * maxScroll;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  return (
    <div className="relative min-h-screen bg-cream-200 font-sans text-secondary-800 antialiased [&_h1]:font-display [&_h1]:text-secondary-900 [&_h2]:font-display [&_h2]:text-secondary-900 [&_h3]:font-display [&_h3]:text-secondary-900 [&_button]:font-sans" lang={locale}>
      {capable ? (
        <>
          <World3D
            stations={stations}
            activeIndexRef={activeIndexRef}
            onActiveChange={setActiveIndex}
            contentRefs={contentRefs}
          />

          <div className="fixed inset-0 z-[2]">
            <nav className="pointer-events-none absolute inset-x-0 top-0 z-[3] flex flex-wrap items-center justify-between gap-4 p-3 sm:p-5">
              <div className="pointer-events-auto flex flex-wrap items-center gap-2.5">
                <TmmMark />
                <h1 className="text-base sm:text-lg font-semibold">TapMyMenu</h1>
                <span className="hidden sm:inline-flex items-center border-l-2 border-primary-500 bg-secondary-600/[0.08] py-1 pl-2.5 pr-2.5 font-mono text-[10px] font-medium uppercase tracking-wide text-primary-700 backdrop-blur-sm">
                  {t.nav.tag}
                </span>
              </div>
              <div
                className="pointer-events-auto inline-flex items-center gap-1"
                role="group"
                aria-label="Language"
              >
                {LOCALES.map((code) => (
                  <button
                    key={code}
                    type="button"
                    aria-pressed={locale === code}
                    onClick={() => setLocale(code)}
                    className={
                      locale === code
                        ? 'rounded-full bg-primary-500 px-3 sm:px-3.5 py-1.5 font-mono text-[10.5px] sm:text-xs font-semibold tracking-wide text-cream-50 transition-colors duration-200'
                        : 'rounded-full px-3 sm:px-3.5 py-1.5 font-mono text-[10.5px] sm:text-xs font-semibold tracking-wide text-secondary-900/60 transition-colors duration-200 hover:text-secondary-900'
                    }
                  >
                    {TRANSLATIONS[code].localeLabel}
                  </button>
                ))}
              </div>
            </nav>

            <div className="absolute right-3 sm:right-6 top-1/2 z-[3] flex -translate-y-1/2 flex-col gap-2 sm:gap-2.5">
              {stations.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToStation(i)}
                  aria-label={`Go to section ${i + 1}`}
                  className={
                    activeIndex === i
                      ? 'h-2.5 w-2.5 scale-125 rounded-full border-[1.5px] border-primary-700 bg-primary-500 transition-all duration-200'
                      : 'h-2.5 w-2.5 rounded-full border-[1.5px] border-secondary-900/40 bg-transparent transition-all duration-200 hover:border-secondary-900/70'
                  }
                />
              ))}
            </div>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {stations.map((s, i) => (
                <div
                  key={i}
                  ref={(el) => (contentRefs.current[i] = el)}
                  className="absolute max-w-[560px] px-7 text-center opacity-0 will-change-[opacity,transform]"
                >
                  {s.content.eyebrow && (
                    <span className="mb-4 inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-widest text-primary-700">
                      <span className="h-px w-5 bg-current opacity-70" />
                      {s.content.eyebrow}
                    </span>
                  )}
                  <h2
                    className={
                      s.content.isStat
                        ? 'mb-4 text-[clamp(64px,12vw,120px)] font-semibold leading-none text-secondary-600'
                        : 'mb-4 text-[clamp(28px,5vw,48px)] font-semibold leading-[1.1] tracking-tight'
                    }
                  >
                    {renderTitleParts(s.content.titleParts)}
                  </h2>
                  <p className="mx-auto mb-6 max-w-[480px] text-base leading-relaxed text-secondary-800">{s.content.sub}</p>
                  {s.content.actions && (
                    <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
                      {s.content.actions.map((a, ai) => (
                        <MagneticButton
                          key={ai}
                          onClick={() => {
                            if (isExternalUrl(a.target)) {
                              window.location.href = a.target;
                            } else if (a.target != null) {
                              scrollToStation(a.target);
                            }
                          }}
                          className={
                            a.primary
                              ? 'inline-flex items-center justify-center gap-x-2 rounded-lg bg-primary-500 px-4 py-3 text-sm font-semibold text-cream-50 shadow-sm transition-all duration-200 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 focus:ring-offset-cream-200'
                              : 'inline-flex items-center justify-center gap-x-2 rounded-lg border border-secondary-600/30 bg-secondary-600/[0.06] px-4 py-3 text-sm font-semibold text-secondary-900 transition-all duration-200 hover:bg-secondary-600/[0.14] focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:ring-offset-2 focus:ring-offset-cream-200'
                          }
                        >
                          {a.label}
                        </MagneticButton>
                      ))}
                    </div>
                  )}
                  {s.content.note && <div className="font-mono text-xs tracking-wide text-secondary-900/70">{s.content.note}</div>}
                  {s.content.footer && (
                    <div className="mt-2 font-mono text-xs tracking-wide text-secondary-900/70">{s.content.footer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: `${(stations.length - 1) * SEGMENT_VH}vh` }} />
        </>
      ) : (
        <>
          <nav className="relative flex flex-wrap items-center justify-between gap-4 p-3 sm:p-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <TmmMark />
              <h1 className="text-base sm:text-lg font-semibold">TapMyMenu</h1>
              <span className="hidden sm:inline-flex items-center border-l-2 border-primary-500 bg-secondary-600/[0.08] py-1 pl-2.5 pr-2.5 font-mono text-[10px] font-medium uppercase tracking-wide text-primary-700 backdrop-blur-sm">
                {t.nav.tag}
              </span>
            </div>
            <div
              className="inline-flex items-center gap-1"
              role="group"
              aria-label="Language"
            >
              {LOCALES.map((code) => (
                <button
                  key={code}
                  type="button"
                  aria-pressed={locale === code}
                  onClick={() => setLocale(code)}
                  className={
                    locale === code
                      ? 'rounded-full bg-primary-500 px-3.5 py-1.5 font-mono text-xs font-semibold tracking-wide text-cream-50'
                      : 'rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold tracking-wide text-secondary-900/60 transition-colors duration-200 hover:text-secondary-900'
                  }
                >
                  {TRANSLATIONS[code].localeLabel}
                </button>
              ))}
            </div>
          </nav>
          <FallbackStacked stations={stations} onNavigate={scrollToStation} />
        </>
      )}
    </div>
  );
}
