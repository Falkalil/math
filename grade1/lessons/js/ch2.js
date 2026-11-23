// الفصل الثاني: الأعدادُ حتى ٥ (الصفّ الأوّل)
import { AR, rnd, pick, shuf } from './mathkit.js';
import { $, $$, num, mcq, ch, open, fld, star } from './engine.js';
import { big, row, pair, frame, cmpQ, lessQ, moreQ, countQ, pickSetQ, tenf, countTool, frameTool, T2, KB, FOUR } from './kit1.js';

const NW = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستّة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'];
const E = ['🦆', '🐟', '🚤', '🎈', '🌼', '⚽', '🍎', '🦋', '🧸', '🐝'];
/** أقرأُ العددَ وأكتبُه (الرقم ← العدد بالأرقام) */
const writeQ = (tag, n, e, x = {}) => num(tag, x.text || `أعدُّ ${n ? 'الأشياء' : ''}، ثم أكتبُ العدد «${NW[n]}» بالأرقام:`, n, { skill: 'write', html: n ? big(row(n, e)) : big('<span style="color:#999">(فارغ)</span>'), sol: [`${NW[n]} = ${AR(n)}`], ...x });
const wordQ = (tag, n, x = {}) => { const o = shuf([...new Set([n, (n + 1) % 6, (n + 2) % 6, Math.max(0, n - 1)])]).slice(0, 3); if (!o.includes(n)) o[0] = n; return mcq(tag, x.text || `أختارُ اسمَ العدد ${AR(n)}:`, o.map(k => NW[k]), o.indexOf(n), { skill: 'write', html: big(`<b style="font-size:48px">${AR(n)}</b>`), ...x }); };

/* أداة: أكتبُ الرقمَ بالتتبّع */
function traceTool(el) { let n = 1; const P = { 0: 'M50 20 a22 30 0 1 0 0.1 0', 1: 'M52 18 L48 82', 2: 'M30 30 Q50 8 64 28 Q46 30 40 82', 3: 'M30 22 Q40 34 48 22 Q58 34 66 22 Q60 50 44 82', 4: 'M62 28 Q34 20 48 44 Q34 54 56 72 L56 82', 5: 'M52 22 Q20 50 50 76 Q80 50 52 22' };
  const draw = () => { el.innerHTML = `<div class="row c">${[0, 1, 2, 3, 4, 5].map(k => `<button class="btn sm" data-n="${k}" style="${k === n ? 'background:#e8413a;color:#fff' : ''}">${AR(k)}</button>`).join('')}</div><div class="row c" style="align-items:center;gap:18px"><svg viewBox="0 0 100 100" style="width:150px;border:2px solid #333;border-radius:8px;background:#fff"><path d="${P[n]}" fill="none" stroke="#ccc" stroke-width="10" stroke-linecap="round" stroke-dasharray="2 8"/><path class="pp" d="${P[n]}" fill="none" stroke="#e8413a" stroke-width="7" stroke-linecap="round"/></svg><div style="text-align:center"><b style="font-size:60px">${AR(n)}</b><br>${NW[n]}<br><span style="font-size:24px">${n ? row(n, '🍎') : '—'}</span></div></div><div class="row c"><button class="btn sm" data-a="go">✍️ أرني كيف أكتبُه</button></div>`;
    $$('[data-n]', el).forEach(b => b.onclick = () => { n = +b.dataset.n; draw(); });
    $('[data-a="go"]', el).onclick = () => { const p = $('.pp', el); const L = p.getTotalLength(); p.style.transition = 'none'; p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.getBoundingClientRect(); p.style.transition = 'stroke-dashoffset 1.6s ease'; p.style.strokeDashoffset = 0; }; };
  draw(); }

/* ═════════ المولّدات ═════════ */
const G = {
  c3: L => { const n = rnd(1, 3); return Math.random() < .6 ? countQ('', n, pick(E)) : pickSetQ('', n, pick(E)); },
  w3: L => { const n = rnd(1, 3); return Math.random() < .5 ? writeQ('', n, pick(E)) : wordQ('', n); },
  c5: L => { const n = rnd(1, 5); return Math.random() < .6 ? countQ('', n, pick(E)) : pickSetQ('', n, pick(E)); },
  w5: L => { const n = rnd(0, 5); return Math.random() < .5 ? writeQ('', n, pick(E)) : wordQ('', n); },
  draw: L => { const a = rnd(2, 5), b = rnd(1, a); return num('', `هناك ${AR(a)} بطّات، وصيدتْ ${AR(b)} منها بالحلقات. أرسمُ صورة: كم بطّةً لم تُصَد؟`, a - b, { skill: 'draw', html: big(Array.from({ length: a }, (_, i) => i < b ? '⭕' : '🦆').join('')), sol: [`أرسمُ ${AR(a)} بطّات، وأحوّطُ ${AR(b)}؛ يبقى ${AR(a - b)}`] }); },
  zero: L => { const n = pick([0, 0, rnd(1, 5)]); return countQ('', n, pick(['🐟', '🐱', '🐑', '🍬'])); },
};
const GN = { c3: 'الأعداد ١، ٢، ٣', w3: 'قراءة ١، ٢، ٣ وكتابتها', c5: 'العددان ٤، ٥', w5: 'قراءة ٤، ٥ وكتابتهما', draw: 'أرسم صورة', zero: 'العدد صفر' };
const units = {};

/* ═════════ التهيئة ═════════ */
units.t2r = { kind: 'test', title: 'التهيئة', idea: 'أتأكّدُ من المهاراتِ السابقة: التقابل، والعدّ.',
  intro: [{ h: '🦌 الفكرةُ العامّة: الأعدادُ حتى ٥', p: 26, html: '<p><b>أستكشف:</b> كم غزالًا في الصورة؟ كم عينًا في الصورة؟</p>' + big('🦌🦌') + '<p>أتعلّمُ في هذا الفصلِ عدَّ الأعدادِ حتى ٥ وقراءتَها وكتابتَها، والعددَ صفر.</p><p><b>المفردات:</b> أعدّ، العدد، صفر، واحد، اثنان، ثلاثة، أربعة، خمسة.</p>' }],
  ex: [['🧮 أجيبُ عن الأسئلةِ الآتية', 27, [cmpQ('١', 2, '🐟', 2, '🫙', { text: 'أصلُ بخطٍّ بينَ كلِّ سمكةٍ وحوض:' }), num('٢', 'ألوّنُ ٣ تفّاحات. كم تفّاحةً ألوّن؟', 3, { html: big('🍎🍎🍎🤍🤍🤍') }), num('٣', 'أعدُّ الزهرات، ثم أرسمُ زهرةً جديدة. كم زهرةً تصبح؟', 2, { html: big('🌸'), sol: ['١ + ١ = ٢'] }), num('٤', 'أعدُّ الكرات، ثم أرسمُ كرتينِ جديدتين. كم كرةً تصبح؟', 4, { html: big('🎾🎾'), sol: ['٢ + ٢ = ٤'] })]]] };

/* ═════════ ٢-١ الأعداد ١، ٢، ٣ ═════════ */
units['2-1'] = { kind: 'lesson', title: 'الأعداد ١، ٢، ٣', gens: ['c3'], idea: 'أعدُّ الأعدادَ ١، ٢، ٣، وأسمّيها، وأميّزُها.', vocab: [['أعدّ', 'أشيرُ إلى كلِّ شيءٍ مرّةً واحدةً وأقولُ العدد.'], ['واحد ١', '🦆'], ['اثنان ٢', '🦆🦆'], ['ثلاثة ٣', '🦆🦆🦆']],
  intro: [{ h: 'أعدُّ في الحوض', p: 28, html: big('🧽 · 🚤🚤 · 🦆🦆🦆', 30) + '<p style="text-align:center">إسفنجةٌ <b>واحدة</b> ١ · قاربانِ <b>اثنان</b> ٢ · <b>ثلاثُ</b> بطّات ٣</p>' + `<div style="text-align:center">${tenf(1, 5)} ${tenf(2, 5)} ${tenf(3, 5)}</div>` }, { h: '👆 أعدُّ بنفسي', tool: countTool('🦆') }],
  examples: [{ ...countQ('مثال', 3, '🦆', { p: 28, cfu: true }), gen: 'c3' }],
  ex: [['✅ أتأكّد', 28, [countQ('١', 1, '🧽'), countQ('٢', 2, '🚤'), countQ('٣', 3, '🦆'), countQ('٤', 3, '🐟'), countQ('٥', 2, '🐋')]],
    ['🖍️ أتدرّب', 29, [countQ('٦', 1, '🥛', { text: 'أعدُّ علبَ الحليبِ في الثلّاجة، ثم أكتبُ العدد:' }), countQ('٧', 3, '🍎', { text: 'أعدُّ التفّاحَ في الثلّاجة:' }), countQ('٨', 2, '🧺', { text: 'أعدُّ سلّتَي الفراولة:' }), countQ('٩', 2, '⚽', { text: 'أعدُّ كراتِ القدمِ في الخزانة:' }), countQ('١٠', 3, '👕', { text: 'أعدُّ القمصان:' }), countQ('١١', 1, '🏀', { text: 'أعدُّ كراتِ السلّة:' })]]] };

/* ═════════ ٢-٢ قراءةُ ١، ٢، ٣ وكتابتُها ═════════ */
units['2-2'] = { kind: 'lesson', title: 'قراءة الأعداد ١، ٢، ٣ وكتابتها', gens: ['w3'], idea: 'أقرأُ الأعدادَ ١، ٢، ٣، وأكتبُها.', vocab: [['العدد', 'يدلُّ على كم شيئًا في المجموعة.']],
  intro: [{ h: 'في الحديقة', p: 30, html: big('🦋 ١ واحد · ⚽⚽ ٢ اثنان · 🌼🌼🌼 ٣ ثلاثة', 26) }, { h: '✍️ أكتبُ الأرقام', tool: traceTool }],
  examples: [{ ...writeQ('مثال', 2, '⚽', { p: 30, cfu: true }), gen: 'w3' }],
  ex: [['✅ أتأكّد', 30, [writeQ('١', 1, '🦋', { text: 'أرسمُ فراشة، ثم أكتبُ العدد «واحد»:' }), writeQ('٢', 2, '⚽', { text: 'أرسمُ كرتين، ثم أكتبُ العدد «اثنان»:' }), writeQ('٣', 3, '🌼', { text: 'أرسمُ ثلاثَ زهرات، ثم أكتبُ العدد «ثلاثة»:' })]],
    ['🖍️ أتدرّب', 31, [countQ('٤', 1, '⛲', { text: 'أعدُّ، ثم أكتبُ العددَ ثلاثَ مرّات:' }), countQ('٥', 3, '🦋'), countQ('٦', 2, '🪑'), countQ('٧', 3, '🌻'), countQ('٨', 2, '⚽'), wordQ('٨ب', 3)]]] };

/* ═════════ ٢-٣ العددان ٤، ٥ ═════════ */
units['2-3'] = { kind: 'lesson', title: 'العددان ٤، ٥', gens: ['c5'], idea: 'أعدُّ العددين ٤، ٥، وأسمّيهما، وأميّزُهما.', vocab: [['أربعة ٤', '🐻🐻🐻🐻'], ['خمسة ٥', '🐻🐻🐻🐻🐻']],
  intro: [{ h: 'الدببة', p: 32, html: big('🐻🐻🐻🐻🐻 &nbsp; 🐻🐻🐻🐻') + '<p style="text-align:center">خمسةٌ ٥ · أربعةٌ ٤</p>' + `<div style="text-align:center">${tenf(4, 5)} ${tenf(5, 5)}</div>` }, { h: '🔟 إطارُ الخمسة', tool: frameTool(4) }],
  examples: [{ ...countQ('مثال', 5, '🐻', { p: 32, cfu: true }), gen: 'c5' }],
  ex: [['✅ أتأكّد', 32, [num('١', 'أرسمُ ٤ ثمراتٍ على الشجرة. كم ثمرةً أرسم؟', 4, { html: big('🌳 ' + row(4, '🍒')) }), num('٢', 'أضعُ ٥ قطعٍ ملوّنةٍ على الشجرة. كم قطعةً أضع؟', 5, { html: big('🌳 ' + row(5, '🔴')) })]],
    ['🖍️ أتدرّب', 33, [fld('٣', 'أعدُّ النحلَ في كلِّ مجموعة: كم مجموعةً فيها ٥ نحلات، وكم مجموعةً فيها ٤؟', [['مجموعاتُ الخمسة (أحوّطُها)', 3], ['مجموعاتُ الأربعة (✕)', 2]], { html: big('🐝🐝🐝🐝🐝 | 🐝🐝🐝🐝 | 🐝🐝🐝🐝🐝 | 🐝🐝🐝🐝 | 🐝🐝🐝🐝🐝', 20), sol: ['٣ مجموعاتٍ من ٥ ، ومجموعتانِ من ٤'] }), pickSetQ('٣ب', 5, '🐝'), pickSetQ('٣ج', 4, '🐝')]]] };

/* ═════════ اختبارُ منتصفِ الفصل ═════════ */
units.t2m = { kind: 'test', title: 'اختبار منتصف الفصل', idea: 'الدروسُ ٢-١ إلى ٢-٣',
  ex: [['📝 اختبارُ منتصفِ الفصل', 34, [countQ('١', 3, '🎈'), fld('٢', 'أعدُّ الضفادعَ في كلِّ مجموعة: كم مجموعةً فيها ٥ ضفادع، وكم مجموعةً فيها ٤؟', [['مجموعاتُ الخمسة', 3], ['مجموعاتُ الأربعة', 1]], { html: big('🐸🐸🐸🐸🐸 | 🐸🐸🐸🐸 | 🐸🐸🐸🐸🐸 | 🐸🐸🐸🐸🐸', 20) }), countQ('٣', 2, '🐝')]]] };
units.r2 = { kind: 'test', title: 'مراجعة تراكمية', idea: 'مراجعةُ الفصلين ١، ٢',
  ex: [['🔁 مراجعةٌ تراكميّة', 35, [lessQ('١', 6, '📏', 5, '✏️'), mcq('٢', 'أعدُّ الخراف، ثم أختارُ العدد:', ['١', '٢', '٣'], 2, { html: big('🐑🐑🐑') }), cmpQ('٣', 4, '🌳', 4, '🍎'), countQ('٤', 2, '🍁')]]] };

/* ═════════ ٢-٤ قراءةُ ٤، ٥ وكتابتُهما ═════════ */
units['2-4'] = { kind: 'lesson', title: 'قراءة العددين ٤، ٥ وكتابتهما', gens: ['w5'], idea: 'أقرأُ العددين ٤، ٥، وأكتبُهما.',
  intro: [{ h: 'في موقعِ البناء', p: 36, html: big('🚧🚧🚧🚧 ٤ أربعة &nbsp; 🧱🧱🧱🧱🧱 ٥ خمسة', 24) }, { h: '✍️ أكتبُ الأرقام', tool: traceTool }],
  examples: [{ ...writeQ('مثال', 4, '🚧', { p: 36, cfu: true }), gen: 'w5' }],
  ex: [['✅ أتأكّد', 36, [writeQ('١', 4, '🔶', { text: 'أرسمُ أربعَ أقماع، ثم أكتبُ العدد «أربعة»:' }), writeQ('٢', 5, '🧱', { text: 'أرسمُ خمسَ قطعٍ من الطوب، ثم أكتبُ العدد «خمسة»:' })]],
    ['🖍️ أتدرّب', 37, [countQ('٣', 4, '🚛'), countQ('٤', 5, '🛑'), countQ('٥', 4, '⛑️'), countQ('٦', 5, '🚚'), countQ('٧', 4, '🔺'), wordQ('٧ب', 5), wordQ('٧ج', 4)]]] };

/* ═════════ ٢-٥ أحلُّ المسألة: أرسمُ صورة ═════════ */
units['2-5'] = { kind: 'lesson', title: 'أحل المسألة: أرسم صورة', gens: ['draw'], idea: 'أعدُّ الأعدادَ ١، ٢، ٣، ٤، ٥، وأسمّيها، وأميّزُها باستعمالِ الرسومِ التوضيحيّة.',
  intro: [{ h: '🦆 صيدُ البطّ', p: 38, html: '<p>خمسةُ أطفالٍ مع كلٍّ منهم حلقةُ صيد، وفي الحوضِ بطّات. أصلُ بخطٍّ بينَ كلِّ حلقةِ صيدٍ وبطّةٍ واحدة، ثم أرسمُ دائرةً ⭕ تمثّلُ كلَّ بطّةٍ تمَّ صيدُها.</p>' + big('🧒🧒🧒🧒🧒<br>⭕⭕⭕⭕⭕') + '<p style="text-align:center">تمَّ صيدُ ٥ بطّات.</p>' }],
  examples: [num('مثال', 'خمسةُ أطفال، صادَ كلٌّ منهم بطّةً واحدة. كم بطّةً تمَّ صيدُها؟', 5, { p: 38, cfu: true, html: big('⭕⭕⭕⭕⭕') })],
  ex: [['🧩 أرسم', 39, [num('١', 'ثلاثُ فتيات، مع كلٍّ منهنَّ حلقةُ صيد، وفي الحوضِ ٥ بطّات. إذا صادتْ كلُّ فتاةٍ بطّةً واحدة، فكم بطّةً لم يتمَّ صيدُها؟', 2, { skill: 'draw', html: big('👧👧👧<br>🦆🦆🦆🦆🦆'), sol: ['أصلُ كلَّ فتاةٍ ببطّة: ٣ بطّاتٍ صِيدت، ويبقى بطّتان ⭕⭕'] }), num('٢', 'كم بطّةً تمَّ صيدُها؟', 3)]]] };

/* ═════════ ٢-٦ الصفر ═════════ */
const JAR = n => big(`<span style="display:inline-block;border:4px solid #e8413a;border-radius:14px 14px 6px 6px;padding:6px;min-width:90px;min-height:40px;background:#eef8ff">${n ? row(n, '🔮') : '&nbsp;'}</span>`);
units['2-6'] = { kind: 'lesson', title: 'قراءة العدد (صفر) وكتابته', gens: ['zero'], idea: 'أقرأُ العدد (صفر)، وأكتبُه.', vocab: [['صفر ٠', 'لا يوجدُ أيُّ شيء.']],
  intro: [{ h: 'الكراتُ في الوعاء', p: 40, html: '<p>أعدُّ الكراتِ في كلِّ وعاء: ٥، ٤، ٣، ٢، ١… وعندما لا يبقى أيُّ كرةٍ أقول: <b>صفر</b> وأكتبُه ٠</p><div class="row c">' + [5, 4, 3, 2, 1, 0].map(n => `<div style="text-align:center">${JAR(n)}<b>${AR(n)}</b></div>`).join('') + '</div>' }, { h: '👆 أعدُّ بنفسي', tool: countTool('🔮') }],
  examples: [{ ...countQ('مثال', 0, '🔮', { p: 40, cfu: true, html: JAR(0) }), gen: 'zero' }],
  ex: [['✅ أتأكّد', 40, [5, 4, 3, 2, 1, 0].map((n, i) => countQ(AR(i + 1), n, '🔮', { html: JAR(n), text: 'أعدُّ الكراتِ في الوعاء، ثم أكتبُ العدد:' }))],
    ['🖍️ أتدرّب', 41, [countQ('٧', 0, '🐟', { text: 'أكتبُ عددَ السمكاتِ في الوعاء:', html: big('🫙 (فارغ)') }), countQ('٨', 4, '🐟', { text: 'أكتبُ عددَ السمكاتِ في الوعاء:' }), countQ('٩', 5, '🐱', { text: 'أكتبُ عددَ القططِ في الصندوق:' }), countQ('١٠', 0, '🐱', { text: 'أكتبُ عددَ القططِ في الصندوق:', html: big('📦 (فارغ)') }), countQ('١١', 0, '🐑', { text: 'أكتبُ عددَ الخرافِ في العربة:', html: big('🛒 (فارغة)') }), countQ('١٢', 2, '🐑', { text: 'أكتبُ عددَ الخرافِ في العربة:' })]]] };

/* ═════════ هيّا بنا نلعب: ألعبُ مع العدّ ═════════ */
function countGame(el) { const B = ['🟨', '🟥', '🟦', '🟨', '🟥', '🟦', '🟥', '🟥', '🟨', '🟥', '🟦', '🟨', '🟥', '🟦', '🟨']; let me = -1, cpu = -1, sMe = 0, sCpu = 0, turn = 0, msg = 'ألقي المكعّب (٠–٥)!', die = null;
  const act = (pos, who) => { const c = B[pos]; if (c === '🟥') { who === 0 ? sMe++ : sCpu++; return 'مربّعٌ أحمر: آخذُ 🔴'; } if (c === '🟦') return 'مربّعٌ أزرق: أرجعُ إلى الخلف'; return 'مربّعٌ أصفر: ينتقلُ الدور'; };
  const draw = () => { el.innerHTML = `<div class="meta">${msg}</div><div style="display:flex;flex-wrap:wrap;gap:3px;justify-content:center;direction:rtl;font-size:26px"><span style="font-size:14px">البداية</span>${B.map((c, i) => `<span style="position:relative;${i === me ? 'outline:3px solid #333' : ''}${i === cpu ? ';box-shadow:0 0 0 3px #999 inset' : ''}">${c}</span>`).join('')}<span>💰</span></div><div class="keybox" style="text-align:center">🔴 أنا: <b>${AR(sMe)}</b> — الحاسوب: <b>${AR(sCpu)}</b>${die !== null ? `<br>🎲 ${AR(die)}` : ''}</div>${me >= B.length - 1 && cpu >= B.length - 1 ? '<div class="row c"><button class="btn" data-a="r">🔁 العبْ مجدّدًا</button></div>' : '<div class="row c"><button class="btn" data-a="d">🎲 ألقي المكعّب</button></div>'}`;
    const d = $('[data-a="d"]', el); if (d) d.onclick = () => { die = rnd(0, 5); let m = '';
      if (me < B.length - 1) { me = Math.min(B.length - 1, me + die); if (me >= 0) { m = act(me, 0); if (B[me] === '🟦') me = Math.max(-1, me - 1); } }
      const c = rnd(0, 5); if (cpu < B.length - 1) { cpu = Math.min(B.length - 1, cpu + c); if (cpu >= 0) { act(cpu, 1); if (B[cpu] === '🟦') cpu = Math.max(-1, cpu - 1); } }
      msg = `تحرّكتُ ${AR(die)} مربّعات. ${m}`; if (me >= B.length - 1 && cpu >= B.length - 1) { msg = sMe > sCpu ? `وصلنا إلى النهاية! معي ${AR(sMe)} 🔴 أكثرُ من الحاسوب؛ أنا الفائز 🏆` : sMe < sCpu ? 'وصلنا إلى النهاية! معَ الحاسوبِ 🔴 أكثر.' : 'تعادل!'; if (sMe > sCpu) star(2); } draw(); };
    const r = $('[data-a="r"]', el); if (r) r.onclick = () => { me = cpu = -1; sMe = sCpu = 0; die = null; msg = 'ألقي المكعّب (٠–٥)!'; draw(); }; };
  draw(); }
units.g2 = { kind: 'ext', title: 'هيا بنا نلعب: ألعب مع العد', idea: 'العدّ: أحرّكُ قطعتي بمقدارِ العددِ الظاهرِ على المكعّب.',
  intro: [{ h: '🎲 ألعبُ مع العدّ', p: 42, html: '<ul><li>أحرّكُ مكعّبي عددًا من المربّعاتِ بمقدارِ العددِ الظاهرِ على المكعّبِ المرقّم (٠–٥).</li><li>إذا وصلتُ إلى مربّعٍ أحمر آخذُ 🔴.</li><li>إذا وصلتُ إلى مربّعٍ أزرق أرجعُ إلى الخلف.</li><li>إذا وصلتُ إلى مربّعٍ أصفر ينتقلُ الدورُ إلى اللاعبِ الآخر.</li><li>عندما يصلُ اللاعبانِ إلى النهاية، يربحُ اللاعبُ الذي لديه عددٌ أكثرُ من 🔴.</li></ul>', tool: countGame }] };

/* ═════════ اختبارُ الفصل ═════════ */
units.t2c = { kind: 'test', title: 'اختبار الفصل', idea: 'اختبارُ الفصلِ الثاني.',
  ex: [['📝 اختبارُ الفصل', 43, [countQ('١', 0, '🐟', { text: 'أكتبُ عددَ السمكاتِ في الوعاء:', html: big('🥣 (فارغ)') }), fld('٢', 'أصلُ بينَ عناصرِ المجموعتين، ثم أكتبُ عددَ عناصرِ كلِّ مجموعة:', [['الورود', 4], ['المزهريّات', 3]], { html: pair(4, '🌷', 3, '🏺') }), mcq('٢ب', 'أحوّطُ المجموعةَ الأكبر:', ['🌷 الورود', '🏺 المزهريّات'], 0),
    ...[0, 1, 2, 3, 4, 5].map((n, i) => num(`٣${['أ', 'ب', 'ج', 'د', 'هـ', 'و'][i]}`, `ألوّنُ من الكراتِ حسبَ العددِ المكتوبِ تحتَ السلّة (${AR(n)})، ثم أكتبُ العدد:`, n, { skill: 'write', html: big(`${row(n, '🟠')}${row(5 - n, '⚪')} 🏀🧺`) }))]]] };

/* ═════════ الاختبارُ التراكميّ ═════════ */
units.t2x = { kind: 'test', title: 'الاختبار التراكمي', idea: 'أظلّلُ الإجابةَ الصحيحة (الفصلان ١، ٢).',
  ex: [['📝 أختارُ الإجابةَ الصحيحة', 44, [mcq('١', 'أنظرُ إلى العدد (٤)، وأختارُ المجموعةَ التي فيها ٤:', [row(5, '🧢'), row(3, '🧢'), row(4, '🧢')], 2, { html: big('<b style="font-size:44px">٤</b>') }),
    mcq('٢', 'أنظرُ إلى مجموعةِ الطيورِ وأعدُّها، وأختارُ العددَ الذي يدلُّ على عددِ الطيور:', ['١', '٣', '٤'], 1, { html: big('🐦🐦🐦') }),
    mcq('٣', 'أنظرُ إلى المربّعات (٢)، وأختارُ مجموعةَ الأزرارِ التي لها نفسُ العدد:', [row(2, '⚪'), row(1, '⚪'), row(3, '⚪')], 0, { html: big('⬛⬛') }),
    mcq('٤', 'أختارُ المجموعةَ التي فيها عددُ الورودِ يساوي عددَ أباريقِ الماء:', ['🌹🌹 و🫖🫖🫖', '🌹🌹🌹 و🫖🫖', '🌹🌹🌹 و🫖🫖🫖'], 2),
    mcq('٥', 'أنظرُ إلى الأسماكِ (٣) وأعدُّها، ثم أجدُ المجموعةَ التي فيها عددٌ أقلّ:', [row(2, '🐟'), row(4, '🐟'), row(3, '🐟')], 0, { html: big(row(3, '🐟')) }),
    mcq('٦', 'أنظرُ إلى النجمة، ثم أختارُ النجمةَ التي لها الحجمُ نفسُه:', ['⭐ صغيرة', '⭐ متوسّطة', '🌟 كبيرة'], 2, { html: big('🌟', 48) }),
    mcq('٧', 'أنظرُ إلى العدد (١)، ثم أختارُ العددَ الذي يزيدُ عليه بمقدارِ واحد:', ['٠', '١', '٢'], 2),
    mcq('٨', 'أعدُّ القطط، ثم أختارُ العددَ الذي يدلُّ على عددِها:', ['١', '٢', '٣'], 1, { html: big('🐈🐈') })]]] };

export default { units, gens: G, gnames: GN, skills: GN };
