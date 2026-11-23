// الفصل السادس: الجمع (الصفّ الأوّل)
import { AR, rnd, pick, shuf } from './mathkit.js';
import { $, $$, num, lst, mcq, ch, open, fld, star } from './engine.js';
import { big, row, pair, frame, countQ, tenf, patQ, addPic, frameTool, T2, KB, FOUR } from './kit1.js';

const LT = s => `<span dir="ltr" style="unicode-bidi:isolate">${String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])}</span>`;
/** لوحةُ الجزءِ والكلّ */
const pw = (a, b, tot = null) => `<table class="tb" style="margin:6px auto;min-width:200px;text-align:center"><tr><th style="background:#1a7ac0;color:#fff">جزء 🔴</th><th style="background:#1a7ac0;color:#fff">جزء 🟡</th></tr><tr><td><b>${AR(a)}</b><br>${row(a, '🔴')}</td><td><b>${AR(b)}</b><br>${row(b, '🟡')}</td></tr><tr><th colspan="2" style="background:#1a7ac0;color:#fff">الكلّ</th></tr><tr><td colspan="2"><b class="big">${tot == null ? '؟' : AR(tot)}</b></td></tr></table>`;
const pwQ = (tag, a, b, x = {}) => num(tag, x.text || 'أجدُ الكلَّ في لوحةِ الجزءِ والكلّ:', a + b, { skill: 'pw', html: pw(a, b), sol: [`${AR(a)} + ${AR(b)} = ${AR(a + b)}`], hints: ['أضمُّ الجزأينِ معًا وأعدُّ الكلّ.'], ...x });
/** حجرُ الدومينو */
const PIP = n => { const P = { 0: [], 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8], 7: [0, 2, 3, 4, 5, 6, 8], 8: [0, 1, 2, 3, 5, 6, 7, 8], 9: [0, 1, 2, 3, 4, 5, 6, 7, 8] }[n] || []; return `<span style="display:inline-grid;grid-template-columns:repeat(3,9px);gap:3px;padding:6px">${Array.from({ length: 9 }, (_, i) => `<span style="width:9px;height:9px;border-radius:50%;background:${P.includes(i) ? '#fff' : 'transparent'}"></span>`).join('')}</span>`; };
const domino = (a, b, c = '#e8413a', v = false) => `<div style="display:flex;justify-content:center;margin:6px"><span style="display:inline-flex;${v ? 'flex-direction:column;' : ''}gap:2px;background:${c};padding:3px;border-radius:8px;direction:ltr">${PIP(a)}<span style="${v ? 'height:2px;width:100%' : 'width:2px'};background:#0003"></span>${PIP(b)}</span></div>`;
const vert = (a, b) => `<span class="mx" dir="ltr" style="display:inline-block;text-align:right;line-height:1.35;font-size:1.3em">${AR(a)}<br>+ ${AR(b)}<br><span style="border-top:2px solid #333;display:inline-block;min-width:2em">&nbsp;</span></span>`;
const sumQ = (tag, a, b, x = {}) => num(tag, x.text || `أجدُ ناتجَ الجمع: ${LT(`${a} + ${b}`)} = ■`, a + b, { skill: x.skill || 'sent', sol: [`${AR(a)} + ${AR(b)} = ${AR(a + b)}`], ...x });
const sentQ = (tag, a, b, e1, e2, x = {}) => fld(tag, x.text || 'أكتبُ جملةَ الجمع:', [['الجزءُ الأوّل', a], ['الجزءُ الثاني', b], ['ناتجُ الجمع', a + b]], { skill: 'sent', html: big(`${row(a, e1)} &nbsp; ${row(b, e2 || e1)}`, 26), sol: [`${AR(a)} + ${AR(b)} = ${AR(a + b)}`], ...x });
const domQ = (tag, a, b, x = {}) => fld(tag, x.text || 'أنظرُ إلى قطعةِ الدومينو، وأكتبُ جملةَ الجمع:', [['العددُ الأوّل', a], ['العددُ الثاني', b], ['ناتجُ الجمع', a + b]], { skill: x.skill || 'vert', html: domino(a, b, x.c || '#1a7ac0', x.v), sol: [`${AR(a)} + ${AR(b)} = ${AR(a + b)}`], ...x });
/** تكوينُ العدد n: كم أصفر إذا كان الأحمر a */
const makeQ = (tag, n, a, x = {}) => num(tag, x.text || `تكوينُ العدد ${AR(n)}: إذا لوّنتُ ${AR(a)} بالأحمر، فكم ألوّنُ بالأصفر؟ ${LT(`${a} + ■ = ${n}`)}`, n - a, { skill: 'make', html: big(row(a, '🔴') + row(n - a, '⚪'), 26), sol: [`${AR(a)} + ${AR(n - a)} = ${AR(n)}`], hints: [`أعدُّ من ${AR(a)} حتى ${AR(n)}.`], ...x });
const storyQ = (tag, text, a, b, x = {}) => sumQ(tag, a, b, { text, skill: 'story', ...x });

/* أداة: أكوّنُ العدد (حمراء وصفراء) */
function makeTool(el) { let n = 7, a = 3; const draw = () => { el.innerHTML = `<div class="row c">العدد: <button class="btn sm" data-a="n-">−</button><b class="big">${AR(n)}</b><button class="btn sm" data-a="n+">+</button></div><div style="text-align:center;font-size:34px;cursor:pointer">${Array.from({ length: n }, (_, i) => `<span data-i="${i}">${i < a ? '🔴' : '🟡'}</span>`).join('')}</div><div class="keybox" style="text-align:center">أضغطُ على القطعِ لأقلبَها 🔴↔🟡<br><b class="big">${AR(a)} + ${AR(n - a)} = ${AR(n)}</b></div>`;
  $('[data-a="n-"]', el).onclick = () => { if (n > 2) { n--; a = Math.min(a, n); } draw(); }; $('[data-a="n+"]', el).onclick = () => { if (n < 12) n++; draw(); }; $$('[data-i]', el).forEach(s => s.onclick = () => { a = +s.dataset.i + 1 === a ? a - 1 : +s.dataset.i + 1; draw(); }); }; draw(); }
/* أداة: لوحةُ الجزءِ والكلّ */
function pwTool(el) { let a = 4, b = 1; const draw = () => { el.innerHTML = pw(a, b, a + b) + `<div class="row c">🔴 <button class="btn sm" data-a="a-">−</button><button class="btn sm" data-a="a+">+</button> 🟡 <button class="btn sm" data-a="b-">−</button><button class="btn sm" data-a="b+">+</button></div><div class="keybox" style="text-align:center">جملةُ الجمع: <b>${AR(a)} + ${AR(b)} = ${AR(a + b)}</b></div>`;
  $$('[data-a]', el).forEach(btn => btn.onclick = () => { const t = btn.dataset.a; if (t === 'a+' && a < 9) a++; if (t === 'a-' && a > 0) a--; if (t === 'b+' && b < 9) b++; if (t === 'b-' && b > 0) b--; draw(); }); }; draw(); }

/* ═════════ المولّدات ═════════ */
const AN = ['🐢', '🐦', '🦊', '🦌', '🦋', '🐟', '🐑'];
const G = {
  story: L => { const a = rnd(1, 5), b = rnd(1, 4), e = pick(AN); return storyQ('', `على الضفّةِ ${AR(a)} من ${e}، وجاءَ ${AR(b)} آخرون. كم ${e} الآن؟`, a, b, { html: big(`${row(a, e)} + ${row(b, e)}`, 26) }); },
  pw: L => pwQ('', rnd(1, 5), rnd(1, 5)),
  sent: L => { const a = rnd(1, 6), b = rnd(1, 4), e = pick(['🎈', '🚗', '⚽', '🪁']); return sentQ('', a, b, e); },
  zero: L => { const a = rnd(0, 9); return Math.random() < .5 ? sumQ('', a, 0, { skill: 'zero' }) : sumQ('', 0, a, { skill: 'zero' }); },
  model: L => { const a = rnd(2, 6), b = rnd(2, 5), e = pick(['🐊', '👑', '🛡️', '🚀']); return storyQ('', `أمثّلُ القصّة: ${AR(a)} ${e} ثم جاءَ ${AR(b)}. كم ${e} معًا؟`, a, b, { html: big(`${row(a, e)} &nbsp; ${row(b, e)}`, 24) }); },
  make6: L => { const n = rnd(4, 6); return makeQ('', n, rnd(0, n)); },
  make9: L => { const n = rnd(7, 9); return makeQ('', n, rnd(0, n)); },
  make12: L => { const n = rnd(10, 12); return makeQ('', n, rnd(1, n - 1)); },
  vert: L => { const a = rnd(0, 6), b = rnd(0, 6); return domQ('', a, b, { v: Math.random() < .5 }); },
};
const GN = { story: 'قصص الجمع', pw: 'تمثيل الجمع', sent: 'جمل الجمع', zero: 'الجمع إلى الصفر', model: 'أمثلها', make6: 'تكوين ٤، ٥، ٦', make9: 'تكوين ٧، ٨، ٩', make12: 'تكوين ١٠، ١١، ١٢', vert: 'الجمع الرأسي' };
const units = {};

/* ═════════ التهيئة ═════════ */
units.t6r = { kind: 'test', title: 'التهيئة', idea: 'أتأكّدُ من المهاراتِ السابقة: العدُّ وتمثيلُ الأعداد.',
  intro: [{ h: '🐪 الفكرةُ العامّة: الجمع', p: 112, html: '<p><b>أستكشف:</b> أحكي قصّةً عدديّةً حولَ الصورة، ثم أكتبُ عددَ الحيواناتِ الظاهرةِ فيها.</p>' + big('🐪 🐪🐪🐪') + '<p>أتعلّمُ في هذا الفصلِ كيف أمثّلُ جملَ الجمعِ وأكتبُها.</p><p><b>المفردات:</b> الجمع، ناتجُ الجمع، جملةُ الجمع.</p>' }],
  ex: [['🧮 أجيبُ عن الأسئلةِ الآتية', 113, [countQ('١', 5, '🍎'), countQ('٢', 7, '🍏'), num('٣', 'أرسمُ دوائرَ تمثّلُ العدد ٤. كم دائرةً أرسم؟', 4), num('٤', 'أرسمُ دوائرَ تمثّلُ العدد ٧. كم دائرةً أرسم؟', 7), num('٥', 'أرسمُ دوائرَ تمثّلُ العدد ٣. كم دائرةً أرسم؟', 3), addPic('٦', 6, 2, '🐦', { text: 'أستعملُ قطعَ العدِّ لأمثّلَ عددَ الطيورِ في المجموعتين، ثم أكتبُ العددَ الكلّيّ:', e2: '🐤' })]]] };

/* ═════════ ٦-١ قصصُ الجمع ═════════ */
units['6-1'] = { kind: 'lesson', title: 'قصص الجمع', gens: ['story'], idea: 'أستعملُ قطعَ العدِّ لتوضيحِ قصصِ الجمع.',
  intro: [{ h: '🦜 الطيورُ على الغصن', p: 114, html: big('🦜🦜 &nbsp; 🦜🦜🦜') + '<p style="text-align:center">على الغصنِ طائران، ثم حطَّ ٣ طيورٍ أخرى؛ فأصبحَ على الغصنِ ٥ طيور.</p>' }, { h: '🔴🟡 لوحةُ الجزءِ والكلّ', tool: pwTool }],
  examples: [{ ...storyQ('مثال', 'على الغصنِ طائران، ثم حطَّ ٣ طيورٍ أخرى. كم طائرًا على الغصن؟', 2, 3, { p: 114, cfu: true, html: big('🦜🦜 + 🦜🦜🦜') }), gen: 'story' }],
  ex: [['✅ أحكي قصّةً عدديّة', 114, [storyQ('١', 'على الضفّةِ ٥ سلاحف، وخرجتْ سلحفاةٌ من الماء. كم سلحفاةً على الضفّةِ الآن؟', 5, 1, { html: big('🐢🐢🐢🐢🐢 + 🐢') }), storyQ('٢', 'على الأعشابِ ٣ عصافير، وطارَ إليها عصفورٌ آخر. كم عصفورًا الآن؟', 3, 1, { html: big('🐦🐦🐦 + 🐦') })]],
    ['🖍️ أتدرّب', 115, [storyQ('٣', 'ثعلبانِ يسيرانِ نحوَ الوكر، وفي الوكرِ ثعلبانِ آخران. كم ثعلبًا؟', 2, 2, { html: big('🦊🦊 + 🦊🦊') }), storyQ('٤', 'غزالٌ في الغابة، وغزالٌ آخرُ يرعى في السهل. كم غزالًا؟', 1, 1, { html: big('🦌 + 🦌') }), storyQ('٥', 'على الأزهارِ ٣ فراشات، وطارتْ إليها فراشةٌ أخرى. كم فراشةً؟', 3, 1, { html: big('🦋🦋🦋 + 🦋') })]]] };

/* ═════════ ٦-٢ تمثيلُ الجمع ═════════ */
units['6-2'] = { kind: 'lesson', title: 'تمثيل الجمع', gens: ['pw'], idea: 'أجمعُ بضمِّ مجموعتين.', vocab: [['الجمع', 'ضمُّ مجموعتينِ لإيجادِ الكلّ.']],
  intro: [{ h: 'الجزءُ والكلّ', p: 116, html: pw(4, 1, 5) + '<p style="text-align:center">٤ قطعٍ حمراءُ وقطعةٌ صفراء؛ عندما أضمُّهما يكونُ الكلُّ ٥</p>' }, { h: '🔴🟡 لوحةُ الجزءِ والكلّ', tool: pwTool }],
  examples: [{ ...pwQ('مثال', 4, 1, { p: 116, cfu: true }), gen: 'pw' }],
  ex: [['✅ أتأكّد', 116, [pwQ('١', 2, 1), pwQ('٢', 5, 3), pwQ('٣', 4, 3), pwQ('٤', 3, 2)]], ['🖍️ أتدرّب', 117, [pwQ('٥', 3, 2), pwQ('٦', 4, 5), pwQ('٧', 5, 2), pwQ('٨', 5, 5), pwQ('٩', 1, 3), pwQ('١٠', 4, 2), pwQ('١١', 1, 2), pwQ('١٢', 3, 3)]]] };

/* ═════════ ٦-٣ جملُ الجمع ═════════ */
units['6-3'] = { kind: 'lesson', title: 'جمل الجمع', gens: ['sent'], idea: 'أكتبُ جملَ جمعٍ باستعمال + و=', vocab: [['زائد (+)', 'إشارةُ الجمع.'], ['يساوي (=)', 'تعني أنّ الطرفينِ لهما القيمةُ نفسُها.'], ['جملةُ الجمع', '٣ + ٢ = ٥'], ['ناتجُ الجمع', 'العددُ الذي أحصلُ عليه بعدَ الجمع.']],
  intro: [{ h: 'الطائراتُ الورقيّة', p: 118, html: big('🪁🪁🪁 &nbsp; 🪁🪁') + `<p style="text-align:center;font-size:1.3em">${LT('3 + 2 = 5')}</p><p style="text-align:center">٣ <b>زائد</b> ٢ <b>يساوي</b> ٥ — و٥ هو <b>ناتجُ الجمع</b>.</p>` }, { h: '🔴🟡 لوحةُ الجزءِ والكلّ', tool: pwTool }],
  examples: [{ ...sentQ('مثال', 3, 2, '🪁', '', { p: 118, cfu: true }), gen: 'sent' }],
  ex: [['✅ أتأكّد', 118, [sentQ('١', 2, 2, '🎈'), sentQ('٢', 6, 1, '🛻'), sentQ('٣', 3, 3, '🟡', '🔵'), sentQ('٤', 5, 1, '🚗', '🚙')]],
    ['🖍️ أتدرّب', 119, [sentQ('٥', 2, 1, '🧢'), sentQ('٦', 5, 3, '⚽', '🏀'), sentQ('٧', 3, 3, '🚜', '🚙'), sentQ('٨', 2, 4, '🚲', '🛴'), sentQ('٩', 1, 1, '📯'), sentQ('١٠', 3, 2, '✈️', '🛩️')]]] };

/* ═════════ ٦-٤ الجمعُ إلى الصفر ═════════ */
units['6-4'] = { kind: 'lesson', title: 'الجمع إلى الصفر', gens: ['zero'], idea: 'أجدُ ناتجَ الجمعِ إلى الصفر.',
  intro: [{ h: 'حجارةُ الدومينو', p: 120, html: `<div class="row c">${domino(4, 0)}${domino(0, 2, '#f08a24')}</div><p style="text-align:center">${LT('4 + 0 = 4')} &nbsp;·&nbsp; ${LT('0 + 2 = 2')}</p>` + KB('أتذكّر', 'عندما أجمعُ صفرًا إلى عدد، يبقى العددُ كما هو.') }],
  examples: [{ ...sumQ('مثال', 4, 0, { p: 120, cfu: true, skill: 'zero', html: domino(4, 0) }), gen: 'zero' }],
  ex: [['✅ أتأكّد', 120, [sumQ('١', 5, 0, { skill: 'zero', html: domino(5, 0, '#2a8f4a') }), sumQ('٢', 3, 0, { skill: 'zero', html: domino(3, 0, '#8a4ad8') }), sumQ('٣', 6, 0, { skill: 'zero', html: domino(6, 0, '#1a7ac0') }), sumQ('٤', 0, 1, { skill: 'zero', html: domino(0, 1, '#f5c518') })]],
    ['🖍️ أتدرّب', 121, [sentQ('٥', 2, 1, '🧢'), sentQ('٦', 5, 3, '⚽', '🏀'), sentQ('٧', 3, 3, '🚙', '🛻'), sentQ('٨', 2, 4, '🚲', '🛴'), sentQ('٩', 1, 1, '📯'), sentQ('١٠', 3, 2, '✈️', '🛩️')]]] };

/* ═════════ اختبارُ منتصفِ الفصل ═════════ */
units.t6m = { kind: 'test', title: 'اختبار منتصف الفصل', idea: 'الدروسُ ٦-١ إلى ٦-٤',
  ex: [['📝 اختبارُ منتصفِ الفصل', 122, [storyQ('١', 'في البحرِ ٤ قوارب، ثم جاءَ قاربانِ آخران. كم قاربًا؟', 4, 2, { html: big('⛵⛵⛵⛵ + ⛵⛵') }), pwQ('٢', 1, 4), pwQ('٢ب', 3, 5),
    sumQ('٣', 0, 2), sumQ('٣ب', 9, 0), sumQ('٣ج', 1, 3), sumQ('٣د', 3, 4),
    ...[[8, 0], [0, 7], [2, 0], [0, 3], [7, 0], [0, 8], [4, 2], [3, 1], [1, 2], [0, 3], [3, 2], [0, 5]].map(([a, b], i) => sumQ(AR(i + 5), a, b, { html: i < 2 ? domino(a, b, i ? '#f08a24' : '#1a7ac0') : undefined }))]]] };
units.r6 = { kind: 'test', title: 'مراجعة تراكمية', idea: 'مراجعةُ الفصول ١–٦',
  ex: [['🔁 مراجعةٌ تراكميّة', 123, [countQ('١', 14, '🐒'), mcq('٢', 'أحوّطُ الشكلَ المماثلَ للمثلّثِ الأحمرِ داخلَ الإطار:', ['🔻 مثلّثٌ أحمر', '🟥 مربّعٌ أحمر', '🟦 مربّعٌ أزرق', '🟢 دائرةٌ خضراء'], 0, { html: big(frame('🔺')) }),
    fld('٣', 'أعدُّ الأزرارَ الخضراءَ في كلِّ زيِّ مهرّج، ثم أكتبُ العدد:', [['الزيُّ الأوّل', 3], ['الزيُّ الثاني', 0]], { html: big('🤡🟢🟢🟢 &nbsp; 🤡 (بلا أزرار)') })]]] };

/* ═════════ ٦-٥ أحلُّ المسألة: أمثّلُها ═════════ */
units['6-5'] = { kind: 'lesson', title: 'أحل المسألة: أمثلها', gens: ['model'], idea: 'أحلُّ مسائلَ الجمعِ بالتمثيل.',
  intro: [{ h: '🏰 القلعة', p: 124, html: big('🛡️🛡️🛡️ &nbsp; 🛡️🛡️🛡️🛡️🛡️') + '<p>أمثّلُ قصّةَ الجمعِ لأجدَ الناتج، ثم أكتبُ الأعدادَ في أماكنِها: ٣ حرّاس + ٥ حرّاس = ٨ حرّاس.</p>' }, { h: '🔴🟡 لوحةُ الجزءِ والكلّ', tool: pwTool }],
  examples: [sentQ('مثال', 3, 5, '💂', '', { p: 124, cfu: true })],
  ex: [['🧩 أمثّلُها', 124, [sentQ('١', 3, 5, '💂'), sentQ('٢', 2, 3, '🐊'), sentQ('٣', 5, 4, '👑')]], ['🖍️ أتدرّب', 125, [sentQ('٤', 6, 3, '👨‍🚀'), sentQ('٥', 5, 4, '🚀'), fld('٦', 'أمثّلُ قصّةَ الجمع، بحيثُ يساوي الناتجُ ٨ (صاروخانِ ومجموعةٌ أخرى):', [['الجزءُ الأوّل', 2], ['الجزءُ الثاني', 6]], { html: big('🚀🚀 &nbsp; 🚀🚀🚀🚀🚀🚀'), sol: ['٢ + ٦ = ٨'] })]]] };

/* ═════════ ٦-٦ إلى ٦-٨ تكوينُ الأعداد ═════════ */
const makeUnit = (id, title, ns, p, gen) => ({ kind: 'lesson', title, gens: [gen], idea: `أستعملُ قطعَ العدِّ لأكوّنَ مجموعًا يساوي ${ns.map(AR).join('، ')}`,
  intro: [{ h: '🔴🟡 طرقٌ مختلفةٌ للعددِ نفسِه', p, html: T2(ns.map(n => `تكوينُ العدد ${AR(n)}`), [ns.map(n => Array.from({ length: n + 1 }, (_, a) => `${LT(`${a} + ${n - a} = ${n}`)}`).join('<br>'))]) }, { h: '🔴🟡 أكوّنُ العدد', tool: makeTool }],
  examples: [{ ...makeQ('مثال', ns[0], 1, { p, cfu: true }), gen }] });
units['6-6'] = { ...makeUnit('6-6', 'تكوين الأعداد: ٤، ٥، ٦', [4, 5, 6], 126, 'make6'), ex: [['✅ تكوينُ العدد ٤', 126, [makeQ('١', 4, 1), makeQ('٢', 4, 2), makeQ('٣', 4, 3)]], ['🖍️ تكوينُ العددينِ ٥، ٦', 127, [makeQ('٤', 5, 1), makeQ('٥', 5, 2), makeQ('٦', 5, 4), makeQ('٧', 6, 1), makeQ('٨', 6, 3), makeQ('٩', 6, 5)]]] };
units['6-7'] = { ...makeUnit('6-7', 'تكوين الأعداد: ٧، ٨، ٩', [7, 8, 9], 128, 'make9'), ex: [['✅ تكوينُ العدد ٧', 128, [makeQ('١', 7, 0), makeQ('٢', 7, 1), makeQ('٣', 7, 2), makeQ('٤', 7, 3), makeQ('٥', 7, 4)]], ['🖍️ تكوينُ العددينِ ٨، ٩', 129, [...[0, 1, 2, 3, 4, 5, 6].map((a, i) => makeQ(AR(i + 6), 8, a)), ...[0, 1, 2, 3, 4, 5, 6].map((a, i) => makeQ(AR(i + 13), 9, a))]]] };
units['6-8'] = { ...makeUnit('6-8', 'تكوين الأعداد: ١٠، ١١، ١٢', [10, 11, 12], 130, 'make12'), ex: [['✅ أتأكّد', 130, [makeQ('١', 10, 8, { html: `<div style="text-align:center">${tenf(8, 10, '🔴')}</div>` }), makeQ('٢', 10, 5), makeQ('٣', 11, 9), makeQ('٤', 11, 3), makeQ('٥', 12, 4), makeQ('٦', 12, 7)]], ['🖍️ أتدرّب', 131, [makeQ('٧', 10, 3), makeQ('٨', 11, 5), makeQ('٩', 12, 7), makeQ('١٠', 10, 6), makeQ('١١', 11, 8), makeQ('١٢', 12, 6), makeQ('١٣', 11, 2), makeQ('١٤', 12, 9)]]] };

/* ═════════ ٦-٩ الجمعُ الرأسيّ ═════════ */
units['6-9'] = { kind: 'lesson', title: 'الجمع الرأسي', gens: ['vert'], idea: 'أجمعُ أفقيًّا ورأسيًّا.',
  intro: [{ h: 'أفقيًّا ورأسيًّا', p: 132, html: `<div class="row c" style="align-items:center;gap:26px">${domino(3, 2)}<span>${LT('3 + 2 = 5')}</span>${domino(3, 2, '#e8413a', true)}${vert(3, 2)}</div>` + KB('أتذكّر', 'الجمعُ الرأسيُّ مثلُ الأفقيّ: أكتبُ العددينِ أحدَهما تحتَ الآخر، ثم أكتبُ ناتجَ الجمعِ تحتَ الخطّ.') }],
  examples: [{ ...domQ('مثال', 3, 2, { p: 132, cfu: true, c: '#e8413a' }), gen: 'vert' }],
  ex: [['✅ أتأكّد', 132, [domQ('١', 2, 5), domQ('٢', 5, 1, { v: true }), domQ('٣', 3, 4, { c: '#e8413a' }), domQ('٤', 4, 3, { v: true, c: '#e8413a' })]],
    ['🖍️ أتدرّب', 133, [domQ('٥', 1, 6, { c: '#8a4ad8' }), domQ('٦', 6, 1, { v: true, c: '#8a4ad8' }), domQ('٧', 4, 5, { c: '#2a8f4a' }), domQ('٨', 4, 4, { v: true, c: '#2a8f4a' }), domQ('٩', 3, 4, { c: '#f08a24' }), domQ('١٠', 2, 4, { v: true, c: '#f08a24' })]]] };

/* ═════════ هيّا بنا نلعب: ألعبُ وأجمع ═════════ */
const HOLES = [[2, 3], [2, 6], [1, 3], [1, 2], [2, 4], [1, 3], [4, 1], [5, 2], [2, 3], [2, 2]];
function addGame(el) { let pos = -1, msg = 'ألقي المكعّب (١–٦)!', ask = false;
  const draw = () => { const h = HOLES[pos]; el.innerHTML = `<div class="meta">${msg}</div><div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;direction:rtl"><span style="font-size:13px">البداية</span>${HOLES.map((p, i) => `<span style="padding:6px 8px;border-radius:50%;background:#bfe2ff;font-weight:bold;${i === pos ? 'outline:3px solid #e8413a' : ''}">${LT(`${p[0]} + ${p[1]}`)}</span>`).join('')}<span style="font-size:13px">النهاية</span></div>${pos >= HOLES.length ? '<div class="row c"><button class="btn" data-a="r">🔁 العبْ مجدّدًا</button></div>' : ask ? `<div class="row c">${LT(`${h[0]} + ${h[1]}`)} = <input class="ans" data-kp="num" inputmode="none" style="width:70px"> <button class="btn sm" data-a="ok">تحقّق ✓</button></div>` : '<div class="row c"><button class="btn" data-a="d">🎲 ألقي المكعّب</button></div>'}`;
    const d = $('[data-a="d"]', el); if (d) d.onclick = () => { const k = rnd(1, 3); pos += k; if (pos >= HOLES.length) { msg = 'وصلتُ إلى النهاية! أنا الفائز 🏆'; star(2); } else { msg = `تقدّمتُ ${AR(k)} خطوات. أجمعُ العددينِ في هذه الحفرة:`; ask = true; } draw(); };
    const ok = $('[data-a="ok"]', el); if (ok) ok.onclick = () => { const v = parseInt($('input', el).value.replace(/[٠-٩]/g, c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c)), 10); const h2 = HOLES[pos]; if (v === h2[0] + h2[1]) msg = `✔️ صحيح: ${AR(h2[0])} + ${AR(h2[1])} = ${AR(v)}`; else { msg = `✖️ الناتجُ الصحيحُ ${AR(h2[0] + h2[1])}؛ أرجعُ خطوةً واحدة.`; pos = Math.max(-1, pos - 1); } ask = false; draw(); };
    const r = $('[data-a="r"]', el); if (r) r.onclick = () => { pos = -1; ask = false; msg = 'ألقي المكعّب (١–٦)!'; draw(); }; };
  draw(); }
units.g6 = { kind: 'ext', title: 'هيا بنا نلعب: ألعب وأجمع', idea: 'الجمع: أجمعُ العددينِ في الحفرةِ التي أصلُ إليها.',
  intro: [{ h: '🎲 ألعبُ وأجمع', p: 134, html: '<ul><li>ألعبُ مع زميلي، ونتبادلُ الأدوار.</li><li>أرمي المكعّبَ المرقّم، وأحرّكُ قطعتي خطواتٍ تساوي العددَ الظاهر.</li><li>أجمعُ العددينِ الظاهرينِ في المكانِ الذي أصلُ إليه.</li><li>إذا أخطأتُ في الجمع، يلعبُ زميلي مرّةً أخرى.</li><li>اللاعبُ الذي يصلُ إلى النهايةِ أوّلًا يكونُ هو الفائز.</li></ul>', tool: addGame }] };

/* ═════════ اختبارُ الفصل ═════════ */
units.t6c = { kind: 'test', title: 'اختبار الفصل', idea: 'اختبارُ الفصلِ السادس.',
  ex: [['📝 اختبارُ الفصل', 135, [storyQ('١', 'على الطاولةِ ٧ برتقالات، ووُضعتْ برتقالتانِ أخريان. كم برتقالةً؟', 7, 2, { html: big('🍊🍊🍊🍊🍊🍊🍊 + 🍊🍊') }), storyQ('٢', 'في السلّةِ ٣ حبّاتِ فلفلٍ أحمر و٣ حبّاتِ فلفلٍ أخضر. كم حبّة؟', 3, 3, { html: big('🌶️🌶️🌶️ + 🫑🫑🫑') }),
    sumQ('٣', 1, 6), sumQ('٤', 9, 0), num('٥', `أجدُ ناتجَ الجمعِ الرأسيّ: ${vert(5, 4)}`, 9), num('٦', `أجدُ ناتجَ الجمعِ الرأسيّ: ${vert(3, 1)}`, 4),
    makeQ('٧', 11, 6, { text: 'أرسمُ دوائرَ لأكوّنَ العدد ١١: إذا رسمتُ ٦ دوائرَ حمراء، فكم دائرةً صفراءَ أرسم؟' }), makeQ('٨', 12, 5, { text: 'أرسمُ دوائرَ لأكوّنَ العدد ١٢: إذا رسمتُ ٥ دوائرَ حمراء، فكم دائرةً صفراءَ أرسم؟' })]]] };

/* ═════════ الاختبارُ التراكميّ ═════════ */
units.t6x = { kind: 'test', title: 'الاختبار التراكمي', idea: 'أظلّلُ الإجابةَ الصحيحة (الفصول ١–٦).',
  ex: [['📝 أختارُ الإجابةَ الصحيحة', 136, [mcq('١', 'أعدُّ السمكات (٥)، ثم أظلّلُ مجموعةَ الديدانِ التي لها عددُ السمكاتِ نفسُه:', [row(6, '🪱'), row(5, '🪱'), row(4, '🪱')], 1, { html: big(row(5, '🐟')) }),
    patQ('٢', ['⚫', '⬛', '⚫', '⚫'], 10, { text: 'أنظرُ إلى النمط، وأظلّلُ الشكلَ التالي:', extra: ['🔺'] }),
    mcq('٣', 'السيّاراتُ تسيرُ نحوَ الإشارة. أظلّلُ السيّارةَ التي ترتيبُها الأوّل:', ['🚙 الأقربُ إلى الإشارة', '🚗 الثانية', '🚐 الأخيرة'], 0, { html: big('🚦 🚙 🚗 🚐') }),
    mcq('٤', 'أنظرُ إلى القبّعات (٢ و٣ = ٥)، وأظلّلُ الطريقةَ الأخرى لتكوينِ العدد ٥:', ['٤ و٣', '٤ و١', '٢ و٢'], 1, { html: big('🎉🎉 + 🎉🎉🎉') }),
    mcq('٥', 'أنظرُ إلى الزهرات (١٥)، وأظلّلُ المجموعةَ التي فيها عددُ الزهراتِ نفسُه:', [row(15, '🌼'), row(14, '🌼'), row(16, '🌼')], 0, { html: big(row(15, '🌼'), 18) }),
    mcq('٦', 'مع سعادَ ٣ بالونات، ومع نورةَ بالونٌ واحد. كم بالونًا معهما؟', ['٢', '٤', '٥'], 1, { html: big('🎈🎈🎈 + 🎈') }),
    mcq('٧', 'أنظرُ إلى نمطِ المشابك (١، ٢، ٣، ٤، …)، وأظلّلُ المجموعةَ التالية:', [row(4, '📎'), row(5, '📎'), row(6, '📎')], 1, { html: big('📎 · 📎📎 · 📎📎📎 · 📎📎📎📎 · ؟', 22) }),
    mcq('٨', `أظلّلُ ناتجَ الجمع: ${LT('2 + 4 = ■')}`, ['٣', '٤', '٦'], 2),
    mcq('٩', `أظلّلُ الطريقةَ الأخرى لتكوينِ ناتجِ الجمع: ${LT('11 + 0')}`, [LT('6 + 5'), LT('7 + 5'), LT('11 + 1')], 0)]]] };

export default { units, gens: G, gnames: GN, skills: GN };
