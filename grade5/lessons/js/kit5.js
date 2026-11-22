// أدواتٌ مشتركةٌ لكتابِ الصفّ الخامس
import { AR, fmt, rnd, pick, shuf, parseNum, toW, ansInput } from './mathkit.js';
import { $, $$, tbl, mcq, ch, num, fnq, fld, open, cmp, star } from './engine.js';
import { R, fr, tokenize } from './algebra.js';

export const KB = (t, h) => `<div class="keybox"><b class="t">${t}</b>${h}</div>`;
export const T2 = (h, rows) => tbl([h, ...rows], { headRow: true });
export const A = s => AR(String(s));                       // عرضُ نصٍّ عدديٍّ كما هو (مع الأصفار)
export const MX = s => `<span class="mx"><b class="n">${AR(String(s))}</b></span>`;
export const r10 = (x, p = 6) => { const f = 10 ** p; return Math.round((x + Math.sign(x) * 1e-12) * f) / f; };
export const sol = (...a) => ({ sol: a });

/* ═════════ أسماءُ المنازل ═════════ */
// المنازلُ الصحيحة: 0 = الآحاد … 11 = مئات البلايين
export const PLI = ['الآحاد', 'العشرات', 'المئات', 'الألوف', 'عشرات الألوف', 'مئات الألوف', 'الملايين', 'عشرات الملايين', 'مئات الملايين', 'البلايين', 'عشرات البلايين', 'مئات البلايين'];
export const PLD = ['الأجزاء من عشرة', 'الأجزاء من مئة', 'الأجزاء من ألف'];
const PERIODS = ['الواحدات', 'الألوف', 'الملايين', 'البلايين (المليارات)'];
/** منزلةُ الرقمِ رقمِ k (من اليسار) في النصّ s ← { name, value } */
export function placeOf(s, k) {
  s = String(s); const [w, f = ''] = s.split('.'), d = s[k];
  if (k < w.length) { const p = w.length - 1 - k; return { name: PLI[p], value: +d * 10 ** p, p }; }
  const q = k - w.length - 1; return { name: PLD[q], value: r10(+d * 10 ** -(q + 1)), p: -(q + 1) };
}
const nameOfP = p => p >= 0 ? PLI[p] : PLD[-p - 1];
/** سؤال: سمِّ منزلةَ الرقمِ الذي تحته خطّ واكتبْ قيمتَه (اختيارٌ من متعدّد) */
export function placeQ(tag, s, k, o = {}) {
  s = String(s); const P = placeOf(s, k), d = +s[k];
  const show = [...s].map((c, i) => i === k ? `<u>${AR(c)}</u>` : c === '.' ? ',' : AR(c)).join('');
  const opt = p => `${nameOfP(p)}: ${fmt(r10(d * 10 ** p))}`;
  const cand = [P.p + 1, P.p - 1, P.p + 2, P.p - 2].filter(p => p !== P.p && (p >= 0 ? p <= 11 : p >= -3) && !(p < 0 && !s.includes('.')));
  const set = [opt(P.p)]; for (const w of [...shuf(cand).map(opt), `${nameOfP(P.p)}: ${AR(d)}`, ...cand.map(opt)]) { if (!set.includes(w)) set.push(w); if (set.length === 4) break; }
  const opts = shuf(set);
  return mcq(tag, o.text || `سمِّ منزلةَ الرقمِ الذي تحته خطٌّ، ثم اكتبْ قيمتَه المنزليّة: <b class="big">${show}</b>`, opts, opts.indexOf(opt(P.p)), { skill: 'place', sol: [`الرقمُ ${AR(d)} في منزلةِ ${P.name}، وقيمتُه: ${AR(d)} × ${fmt(10 ** P.p)} = ${fmt(P.value)}`], html: pvTable(s, k), htmlOpt: true, ...o });
}

/* ═════════ جدولُ المنازل ═════════ */
export function pvTable(s, hi = -1) {
  s = String(s); const [w, f = ''] = s.split('.'); const nP = Math.max(1, Math.ceil(w.length / 3)); const W = w.padStart(nP * 3, ' ');
  const heads = [], subs = [], cells = [];
  for (let g = nP - 1; g >= 0; g--) { heads.push(`<th colspan="3" class="pg${g}">${PERIODS[g]}</th>`); ['مئات', 'عشرات', 'آحاد'].forEach(x => subs.push(`<th class="pg${g}">${x}</th>`)); }
  [...W].forEach((c, i) => { const idx = i - (W.length - w.length); cells.push(`<td class="${idx === hi ? 'hi' : ''}">${c === ' ' ? '' : AR(c)}</td>`); });
  if (f) { heads.push(`<th colspan="${f.length}" class="pgd">الكسورُ العشريّة</th>`); ['أجزاء العشرة', 'أجزاء المئة', 'أجزاء الألف'].slice(0, f.length).forEach(x => subs.push(`<th class="pgd">${x}</th>`)); [...f].forEach((c, i) => cells.push(`<td class="${w.length + 1 + i === hi ? 'hi' : ''} ${i === 0 ? 'dsep' : ''}">${AR(c)}</td>`)); }
  return `<div class="pvw"><table class="tb pvt5"><tr>${heads.join('')}</tr><tr>${subs.join('')}</tr><tr>${cells.join('')}</tr></table></div>`;
}

/* ═════════ الصيغةُ اللفظيّة ═════════ */
const ONES = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستّة', 'سبعة', 'ثمانية', 'تسعة'], TENS = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستّون', 'سبعون', 'ثمانون', 'تسعون'], HUN = ['', 'مئة', 'مئتان', 'ثلاث مئة', 'أربع مئة', 'خمس مئة', 'ستّ مئة', 'سبع مئة', 'ثماني مئة', 'تسع مئة'];
function w99(n) { if (n < 10) return ONES[n]; if (n === 10) return 'عشرة'; if (n === 11) return 'أحد عشر'; if (n === 12) return 'اثنا عشر'; if (n < 20) return ONES[n - 10] + ' عشر'; const u = n % 10, t = Math.floor(n / 10); return u ? ONES[u] + ' و' + TENS[t] : TENS[t]; }
function w999(n) { const h = Math.floor(n / 100), r = n % 100; return [h ? HUN[h] : '', r ? w99(r) : ''].filter(Boolean).join(' و'); }
const SC = [null, ['ألف', 'ألفان', 'آلاف', 'ألفًا'], ['مليون', 'مليونان', 'ملايين', 'مليونًا'], ['بليون', 'بليونان', 'بلايين', 'بليونًا']];
function scaled(n, s) { // n من ١ إلى ٩٩٩ مضروبٌ في المنزلة s
  const [one, two, few, many] = SC[s]; const h = Math.floor(n / 100), r = n % 100;
  if (n === 1) return one; if (n === 2) return two;
  if (r === 0) return HUN[h] + ' ' + one;               // مئة ألف، ثلاث مئة مليون
  const H = h ? HUN[h] + ' و' : '';
  if (r === 1) return H + one; if (r === 2) return H + two;
  if (r <= 10) return H + w99(r) + ' ' + few; return H + w99(r) + ' ' + many;
}
export function words(x) {
  x = Math.round(x); if (x === 0) return 'صفر'; const P = []; let s = 3;
  for (const g of [1e9, 1e6, 1e3]) { const n = Math.floor(x / g) % 1000; if (n) P.push(scaled(n, s)); s--; }
  const u = x % 1000; if (u) P.push(w999(u)); return P.join(' و');
}
const DEN = ['عشرة', 'مئة', 'ألف'];
export function decWords(s) { s = String(s); const [w, f = ''] = s.split('.'); const W = +w, F = +f || 0, d = f.length; const fp = d && F ? `${words(F)} من ${DEN[d - 1]}` : ''; return W && fp ? `${words(W)} و${fp}` : W ? words(W) : fp || 'صفر'; }
function nearMiss(s) { // أعدادٌ قريبةٌ للتمويه
  s = String(s); const out = new Set(); const [w, f = ''] = s.split('.');
  if (f) { out.add(w + '.' + f + '0'); if (f.length < 3) out.add(w + '.0' + f); if (f.length > 1) out.add(w + '.' + f.slice(0, -1)); out.add(String(+(f) || 1) + '.' + (w === '0' ? '1' : w).slice(0, 3)); out.add(String(+w + 1) + '.' + f); }
  else { const n = +w; const L = w.length; [n * 10, Math.floor(n / 10), n + 10 ** Math.max(0, L - 3), n - 10 ** Math.max(0, L - 4), +(w.slice(0, -3) + '0' + w.slice(-3).slice(1)) || n + 1000, +w.split('').reverse().join('')].forEach(v => v > 0 && v !== n && out.add(String(v))); }
  out.delete(s); return [...out];
}
export function wordQ(tag, s, o = {}) {
  s = String(s); const W = s.includes('.') ? decWords : x => words(+x); const right = W(s);
  const opts = [right]; for (const m of shuf(nearMiss(s))) { const t = W(m); if (!opts.includes(t)) opts.push(t); if (opts.length === 3) break; }
  const sh = shuf(opts);
  return mcq(tag, o.text || `اكتبِ العددَ <b class="big">${A(s)}</b> بالصيغةِ اللفظيّة:`, sh, sh.indexOf(right), { skill: 'words', sol: [`${A(s)}: ${right}`], html: o.noTable ? '' : pvTable(s), htmlOpt: true, ...o });
}

/* ═════════ الصيغةُ التحليليّة ═════════ */
export function expTerms(s) { s = String(s); const [w, f = ''] = s.split('.'); const T = []; [...w].forEach((c, i) => { if (c !== '0') T.push(c + '0'.repeat(w.length - 1 - i)); }); [...f].forEach((c, i) => { if (c !== '0') T.push('0.' + '0'.repeat(i) + c); }); return T; }
export const expStr = s => expTerms(s).join(' + ');
export const expHTML = s => expTerms(s).map(t => AR(t)).join(' + ');
/** مدقّقُ الصيغةِ التحليليّة: حدودٌ كلُّ منها رقمٌ واحدٌ غيرُ صفريٍّ في منزلة، ومجموعُها يساوي العدد */
export function expCheck(s) {
  const target = parseNum(String(s)); return raw => {
    const t = toW(raw).replace(/[٫,]/g, '.').replace(/×/g, '*').replace(/\s/g, ''); if (!t) return { empty: true };
    const parts = t.split('+').filter(Boolean); let sum = 0; const places = new Set();
    for (const p of parts) { let v; if (p.includes('*')) { const [a, b] = p.split('*').map(Number); v = a * b; } else v = Number(p); if (isNaN(v)) return { empty: true, msg: 'اكتبِ الحدودَ مفصولةً بإشارةِ + مثل: ٦٠٠ + ٤٠ + ٧' };
      const e = Math.floor(Math.log10(Math.abs(v)) + 1e-9), m = r10(v / 10 ** e, 6); if (v && !(Number.isInteger(m) && m >= 1 && m <= 9)) return { ok: false, msg: `الحدُّ ${AR(p)} ليس رقمًا واحدًا مضروبًا في قيمةِ منزلته.` };
      if (v) { if (places.has(e)) return { ok: false, msg: 'كرّرتَ المنزلةَ نفسَها في حدّين.' }; places.add(e); } sum += v; }
    if (Math.abs(sum - target) > 1e-9 * Math.max(1, target)) return { ok: false, msg: `مجموعُ الحدودِ ${fmt(sum)} لا يساوي العدد.` };
    return { ok: true };
  };
}
export const expQ = (tag, s, o = {}) => fnq(tag, o.text || `اكتبِ العددَ <b class="big">${A(s)}</b> بالصيغةِ التحليليّة:`, expCheck(s), expHTML(s), { skill: 'exp', sol: [`${A(s)} = ${expHTML(s)}`], html: o.noTable ? '' : pvTable(s), hints: ['اكتبْ قيمةَ كلِّ رقمٍ غيرِ صفريٍّ حسبَ منزلته.', 'اجمعِ القيمَ بإشارةِ +'], ...o });

/* ═════════ المقارنة ═════════ */
export const cmpS = (tag, a, b, o = {}) => cmp(tag, parseFloat(a), parseFloat(b), { ha: MX(a), hb: MX(b), skill: 'cmp', sol: o.sol || [cmpWhy(String(a), String(b))], ...o });
export function cmpWhy(a, b) {
  const [wa, fa = ''] = a.split('.'), [wb, fb = ''] = b.split('.'); const va = parseFloat(a), vb = parseFloat(b);
  const sgn = va > vb ? '>' : va < vb ? '<' : '=';
  if (sgn === '=') return `${AR(a)} = ${AR(b)} (إضافةُ الأصفارِ عن يمينِ الكسرِ العشريِّ لا تغيّرُ قيمتَه).`;
  if (wa.length !== wb.length && !fa && !fb) return `عددُ أرقامِ ${AR(va > vb ? a : b)} أكثر؛ إذن ${AR(a)} ${sgn} ${AR(b)}`;
  const L = Math.max(fa.length, fb.length), A1 = wa.padStart(wb.length, '0') + fa.padEnd(L, '0'), B1 = wb.padStart(wa.length, '0') + fb.padEnd(L, '0'); const W = Math.max(wa.length, wb.length);
  let i = 0; while (i < A1.length && A1[i] === B1[i]) i++;
  const p = i < W ? PLI[W - 1 - i] : PLD[i - W];
  return `نقارنُ من اليسار: أوّلُ منزلةٍ يختلفُ فيها الرقمان هي ${p}: ${AR(A1[i])} ${sgn} ${AR(B1[i])}؛ إذن ${AR(a)} ${sgn} ${AR(b)}`;
}
export function cmpTool(el) {
  el.innerHTML = `<div class="row">العدد الأوّل ${ansInput('مثل ٥٧٩٠', '130px')} العدد الثاني ${ansInput('مثل ٥٤٨٨', '130px')} <button class="btn sm">قارِنْ</button></div><div class="ctout"></div>`;
  const [a, b] = $$('input', el);
  $('button', el).onclick = () => { const x = toW(a.value).replace(/[٫,]/g, '.').trim(), y = toW(b.value).replace(/[٫,]/g, '.').trim(); if (!/^\d+(\.\d+)?$/.test(x) || !/^\d+(\.\d+)?$/.test(y)) { $('.ctout', el).innerHTML = '<div class="meta">اكتبْ عددين.</div>'; return; }
    const [wa, fa = ''] = x.split('.'), [wb, fb = ''] = y.split('.'); const W = Math.max(wa.length, wb.length), L = Math.max(fa.length, fb.length);
    const pad = (w, f) => w.padStart(W, ' ') + (L ? '.' + f.padEnd(L, '0') : '');
    const P1 = pad(wa, fa), P2 = pad(wb, fb); let i = 0; const z = s => s.replace(/ /g, '0'); while (i < P1.length && z(P1)[i] === z(P2)[i]) i++;
    const row = s => [...s].map((c, k) => `<td class="${k === i ? 'hi' : ''}">${c === ' ' ? '' : c === '.' ? ',' : AR(c)}</td>`).join('');
    $('.ctout', el).innerHTML = `<table class="tb ctab">${'<tr>' + row(P1) + '</tr><tr>' + row(P2) + '</tr>'}</table><div class="keybox">${cmpWhy(x, y)}</div>`; };
}

/* ═════════ نماذجُ الكسورِ العشريّة ═════════ */
export function gridSVG(n, of = 100, color = '#5aa0e0') { // n من ١٠ أو ١٠٠ مظلّلة
  let g = ''; for (let i = 0; i < 100; i++) { const c = i % 10, r = Math.floor(i / 10); const on = of === 10 ? (9 - c) < n : (9 - c) * 10 + r < n; g += `<rect x="${c * 11}" y="${r * 11}" width="10" height="10" fill="${on ? color : '#fff'}" stroke="#888" stroke-width=".5"/>`; }
  if (of === 10) { g = ''; for (let c = 0; c < 10; c++) g += `<rect x="${c * 11}" y="0" width="10" height="109" fill="${(9 - c) < n ? color : '#fff'}" stroke="#888" stroke-width=".6"/>`; }
  return `<svg viewBox="-1 -1 112 112" class="dgrid">${g}</svg>`;
}
export function cubeSVG(n) { // n من ١٠٠٠ (حتى ١٠٠) مظلّلةً في الوجهِ الأماميّ من العمودِ الأيمن
  let g = ''; const s = 10; for (let i = 0; i < 100; i++) { const c = i % 10, r = Math.floor(i / 10); const on = (9 - c) * 10 + r < n; g += `<rect x="${30 + c * s}" y="${30 + r * s}" width="${s}" height="${s}" fill="${on ? '#5aa0e0' : '#fff'}" stroke="#777" stroke-width=".5"/>`; }
  for (let k = 0; k <= 10; k++) { g += `<line x1="${30 + k * s}" y1="30" x2="${k * s}" y2="0" stroke="#999" stroke-width=".5"/><line x1="30" y1="${30 + k * s}" x2="0" y2="${k * s}" stroke="#999" stroke-width=".5"/>`; }
  g += `<path d="M0 0 H100 L130 30 H30Z M0 0 V100 L30 130 V30Z" fill="none" stroke="#444" stroke-width="1"/>`;
  return `<svg viewBox="-2 -2 134 134" class="dgrid">${g}</svg>`;
}
export function decTool(el, start = 34) {
  let mode = 100, n = start;
  const draw = () => { const v = r10(n / mode, 3), s = mode === 10 ? (n / 10).toFixed(1) : mode === 100 ? (n / 100).toFixed(2) : (n / 1000).toFixed(3);
    el.innerHTML = `<div class="seg5">${[10, 100, 1000].map(m => `<button data-m="${m}" class="${m === mode ? 'on' : ''}">أجزاء من ${m === 10 ? 'عشرة' : m === 100 ? 'مئة' : 'ألف'}</button>`).join('')}</div>
      <div class="row c">${mode === 1000 ? cubeSVG(Math.min(n, 100)) : gridSVG(n, mode)}<div class="dbig">${fr(n, mode)} = <b>${AR(s)}</b><small>${decWords(s)}</small></div></div>
      <input type="range" min="0" max="${mode === 1000 ? 100 : mode}" value="${n}" class="dr">`;
    $$('.seg5 button', el).forEach(b => b.onclick = () => { mode = +b.dataset.m; n = Math.min(n, mode === 1000 ? 100 : mode); draw(); });
    $('.dr', el).oninput = e => { n = +e.target.value; draw(); };
  }; draw();
}

/* ═════════ أدواتٌ عامّة ═════════ */
export function pvTool(el, s0 = '1650072900') {
  el.innerHTML = `<div class="row">اكتبْ عددًا: ${ansInput('مثل ١٦٥٠٠٧٢٩٠٠', '190px')} <button class="btn sm">اعرضْ</button><button class="btn s sm" data-a="r">🎲 عددٌ عشوائيّ</button></div><div class="pvout"></div>`;
  const inp = $('input', el), out = $('.pvout', el);
  const show = s => { s = toW(s).replace(/[٫,]/g, '.').replace(/[^\d.]/g, ''); if (!s || !/^\d{1,12}(\.\d{1,3})?$/.test(s)) { out.innerHTML = '<div class="meta">اكتبْ عددًا حتى ١٢ رقمًا (ويمكنُ إضافةُ ٣ منازلَ عشريّة).</div>'; return; } s = s.replace(/^0+(?=\d)/, '');
    out.innerHTML = pvTable(s) + tbl([['الصيغةُ القياسيّة', `<b>${A(s)}</b>`], ['الصيغةُ التحليليّة', expHTML(s) || '٠'], ['الصيغةُ اللفظيّة', s.includes('.') ? decWords(s) : words(+s)]]) + '<div class="meta">المسِ أيَّ رقمٍ في الجدولِ لمعرفةِ قيمتِه.</div><div class="pvv"></div>';
    $$('.pvt5 tr:last-child td', out).forEach((td, i, all) => { td.onclick = () => { const digits = s.replace('.', ''); const off = all.length - digits.length; const k0 = i - off; if (k0 < 0) return; const k = s.includes('.') && k0 >= s.indexOf('.') ? k0 + 1 : k0; const P = placeOf(s, k); $$('td', out).forEach(x => x.classList.remove('hi')); td.classList.add('hi'); $('.pvv', out).innerHTML = `الرقمُ <b>${AR(s[k])}</b> في منزلةِ <b>${P.name}</b>، وقيمتُه <b>${fmt(P.value)}</b>`; }; }); };
  $('button', el).onclick = () => show(inp.value); $('[data-a="r"]', el).onclick = () => { const s = String(rnd(1, 9)) + Array.from({ length: rnd(5, 11) }, () => rnd(0, 9)).join(''); inp.value = AR(s); show(s); };
  inp.value = AR(s0); show(s0);
}
/** خطُّ الأعدادِ بـ SVG: نقاطٌ مسمّاة */
export function nlSVG(min, max, step, pts = [], o = {}) {
  const W = 560, x = v => 20 + (v - min) / (max - min) * (W - 40); let g = `<line x1="8" y1="40" x2="${W - 8}" y2="40" stroke="#333" stroke-width="2"/><path d="M8 40 l8 -5 v10z M${W - 8} 40 l-8 -5 v10z" fill="#333"/>`;
  for (let v = min; v <= max + 1e-9; v = r10(v + step)) g += `<line x1="${x(v)}" y1="34" x2="${x(v)}" y2="46" stroke="#333"/><text x="${x(v)}" y="62" text-anchor="middle" font-size="12">${o.lab ? o.lab(v) : fmt(v)}</text>`;
  pts.forEach(([v, t, c = '#1a7ac0']) => { g += `<circle cx="${x(v)}" cy="40" r="5" fill="${c}"/><text x="${x(v)}" y="22" text-anchor="middle" font-size="13" font-weight="800" fill="${c}">${t}</text>`; });
  return `<svg viewBox="0 0 ${W} 70" class="nl5" style="direction:ltr">${g}</svg>`;
}
/** أداةُ التخمينِ والتحقّق: نوعان، عددٌ كلّيّ وإجماليّ */
export function gcTool(el, P) { // P: {n, T, a, b, A, B, unit, what}
  el.innerHTML = `<div class="meta">${P.intro || ''}</div><div class="row">عددُ ${P.A}: ${ansInput('تخمين', '80px')} <button class="btn sm">تحقّقْ</button></div><table class="tb gct"><tr><th>${P.A}</th><th>${P.B}</th><th>${P.what || 'المجموع'}</th><th>النتيجة</th></tr></table>`;
  const inp = $('input', el), T = $('.gct', el);
  $('button', el).onclick = () => { const x = parseNum(inp.value); if (isNaN(x) || x < 0 || x > P.n || x % 1) return; const y = P.n - x, s = P.a * x + P.b * y;
    const res = s === P.T ? '✓ صحيح!' : s > P.T ? 'أكبرُ من المطلوب' : 'أصغرُ من المطلوب';
    T.insertAdjacentHTML('beforeend', `<tr class="${s === P.T ? 'ok' : ''}"><td>${AR(x)}</td><td>${AR(y)}</td><td>${AR(P.a)} × ${AR(x)} + ${AR(P.b)} × ${AR(y)} = ${AR(s)}</td><td>${res}</td></tr>`); if (s === P.T) star(1, 'تخمينٌ صحيح'); inp.value = ''; };
}
/** مسألةُ تخمينٍ وتحقّق (نوعان) كعدّةِ حقول */
export const gcQ = (tag, text, P, o = {}) => { const y = P.n - P.x; return fld(tag, text, [[P.A, P.x], [P.B, y]], { skill: 'gc', sol: [`نخمّنُ ونتحقّق: ${AR(P.x)} ${P.A} و${AR(y)} ${P.B}`, `${AR(P.a)} × ${AR(P.x)} + ${AR(P.b)} × ${AR(y)} = ${AR(P.a * P.x + P.b * y)} ✓`, `${AR(P.x)} + ${AR(y)} = ${AR(P.n)} ✓`], mount: el => gcTool(el, { ...P, intro: 'جرّبْ تخميناتِك هنا:' }), ...o }); };
/** ترتيبُ أعداد: قائمةٌ مرتّبة */
export const sortedStr = (arr, desc) => arr.slice().sort((a, b) => desc ? parseFloat(b) - parseFloat(a) : parseFloat(a) - parseFloat(b));

/* ═════════ التقريبُ والتقدير ═════════ */
export const placeName = p => p >= 0 ? PLI[p] : PLD[-p - 1];
export const roundTo = (x, p) => r10(Math.round(r10(x / 10 ** p, 9) + 1e-9) * 10 ** p, 6);
/** قرّبْ العددَ s إلى المنزلةِ p (أسّ ١٠) */
export function roundQ(tag, s, p, o = {}) {
  s = String(s); const x = parseFloat(s), v = roundTo(x, p); const dp = Math.max(0, -p);
  const [w, f = ''] = s.split('.'); const k = p >= 0 ? w.length - 1 - p : w.length + (-p); const nk = p >= 0 ? (p === 0 ? w.length + 1 : k + 1) : k + 1; const nd = s[nk] ?? '0';
  const show = o.under ? [...s].map((c, i) => i === k ? `<u>${AR(c)}</u>` : c === '.' ? ',' : AR(c)).join('') : A(s);
  return num(tag, o.text || (o.under ? `قرّبِ العددَ <b class="big">${show}</b> إلى المنزلةِ التي تحتَها خطّ.` : `قرّبِ العددَ <b class="big">${A(s)}</b> إلى أقربِ ${p >= 0 ? ['عددٍ كلّيّ (الآحاد)', 'عشرة', 'مئة', 'ألف', 'عشرةِ آلاف', 'مئةِ ألف', 'مليون'][p] : ['جزءٍ من عشرة', 'جزءٍ من مئة', 'جزءٍ من ألف'][-p - 1]}.`), v,
    { skill: 'round', sol: [`المنزلةُ المطلوبة: ${placeName(p)}، والرقمُ الذي عن يمينِها ${AR(nd)} ${+nd >= 5 ? '≥ ٥ فنضيفُ ١' : '&lt; ٥ فلا يتغيّرُ الرقم'}.`, `${A(s)} ≈ ${A(v.toFixed(dp))}`], hints: ['ضعْ خطًّا تحتَ الرقمِ في المنزلةِ المطلوبة، وانظرْ إلى الرقمِ الذي عن يمينِه.', 'إذا كان ٥ أو أكبرَ فأضفْ ١، وإلّا فاتركْه كما هو.'], ...o });
}
/** سؤالُ تقدير: يقبلُ أيَّ تقديرٍ معقولٍ قريبٍ من الناتجِ الدقيق */
export function estQ(tag, expr, est, o = {}) {
  const exact = r10(Function('return ' + expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-'))(), 6), tol = o.tol ?? (/[*\/×÷]/.test(expr) ? 0.3 : 0.2);
  const shown = AR(expr.replace(/\*/g, '×').replace(/\//g, '÷').replace(/\./g, ',').replace(/ - /g, ' − '));
  return fnq(tag, o.text || `قدّرْ ناتجَ: <span class="mx"><b class="n">${shown}</b></span>`, raw => { const v = parseNum(raw); if (isNaN(v)) return { empty: true }; const ok = Math.abs(v - exact) <= Math.max(tol * Math.abs(exact), o.abs || 0) && v === r10(v, 2) && !(Math.abs(v - exact) < 1e-9 && !o.allowExact && (String(exact).includes('.') || exact % 10 !== 0));
      return ok ? { ok: true, msg: `الناتجُ الدقيقُ ${fmt(exact)}، فتقديرُك معقول.` } : Math.abs(v - exact) < 1e-9 ? { ok: false, msg: 'هذا هو الناتجُ الدقيق؛ المطلوبُ تقديرٌ بأعدادٍ مقرّبة.' } : { ok: false, msg: 'قرّبْ كلَّ عددٍ ثم احسب.' }; },
    AR(String(est)), { skill: 'est', sol: [o.how || `تقريبُ الأعدادِ ثم الحساب ≈ ${AR(String(est))}`, `(الناتجُ الدقيق: ${fmt(exact)})`], hints: ['قرّبْ كلَّ عددٍ إلى منزلةٍ مناسبة، أو استعملْ أعدادًا متناغمة.'], kp: 'num', ...o });
}
/** جدولُ الجمعِ/الطرحِ العموديّ مع محاذاةِ الفاصلة */
export function decCol(a, b, op, res) {
  const S = [String(a), String(b), String(res)]; const D = Math.max(...S.map(s => (s.split('.')[1] || '').length)); const P = S.map(s => { const [w, f = ''] = s.split('.'); return [w, f.padEnd(D, '0')]; }); const W = Math.max(...P.map(p => p[0].length));
  const row = ([w, f], sign = '') => `<tr><td class="sg">${sign}</td>${[...w.padStart(W, ' ')].map(c => `<td>${c === ' ' ? '' : AR(c)}</td>`).join('')}${D ? '<td class="dp">,</td>' + [...f].map(c => `<td>${AR(c)}</td>`).join('') : ''}</tr>`;
  return `<table class="dcol">${row(P[0])}${row(P[1], op === '+' ? '+' : '−')}<tr class="ln"><td colspan="${W + D + 2}"></td></tr>${row(P[2])}</table>`;
}
export const addQ = (tag, a, b, op = '+', o = {}) => { const r = r10(op === '+' ? +a + +b : +a - +b, 6); return num(tag, o.text || `${op === '+' ? 'اجمعْ' : 'اطرحْ'}: <span class="mx"><b class="n">${AR(String(a))}</b><i class="op">${op === '+' ? '+' : '−'}</i><b class="n">${AR(String(b))}</b></span>`, r, { skill: op === '+' ? 'dadd' : 'dsub', sol: [`نرتّبُ الفواصلَ بعضَها فوقَ بعض${String(a).split('.')[1]?.length !== String(b).split('.')[1]?.length ? '، ونضيفُ أصفارًا لتتساوى المنازل' : ''}:` + decCol(a, b, op, r)], hints: ['رتّبِ الفواصلَ العشريّةَ بعضَها فوقَ بعض.', 'أضفْ أصفارًا عن يمينِ أحدِ العددينِ حتى يتساوى عددُ المنازل.'], ...o }); };
/** نموذجٌ لجمعِ أو طرحِ كسرين عشريّين بشبكاتِ ١٠٠ */
export function modelSVG(a, b, op) {
  const A1 = Math.round(a * 100), B1 = Math.round(b * 100), T = op === '+' ? A1 + B1 : A1; const n = Math.max(1, Math.ceil(T / 100));
  let g = ''; for (let k = 0; k < n; k++) { const x0 = (n - 1 - k) * 118; for (let i = 0; i < 100; i++) { const c = i % 10, r = Math.floor(i / 10), idx = k * 100 + (9 - c) * 10 + r; let fill = '#fff';
      if (idx < A1) fill = '#e8503a'; else if (op === '+' && idx < A1 + B1) fill = '#5aa0e0'; const cross = op === '-' && idx >= A1 - B1 && idx < A1;
      g += `<rect x="${x0 + c * 11}" y="${r * 11}" width="10" height="10" fill="${fill}" stroke="#888" stroke-width=".5"/>` + (cross ? `<path d="M${x0 + c * 11} ${r * 11} l10 10 M${x0 + c * 11 + 10} ${r * 11} l-10 10" stroke="#222" stroke-width="1"/>` : ''); } }
  return `<svg viewBox="-1 -1 ${n * 118} 112" style="max-width:${n * 130}px;width:100%">${g}</svg>`;
}
export function modelTool(el) {
  el.innerHTML = `<div class="row">${ansInput('٢,٤', '80px')} <select class="mop"><option value="+">+</option><option value="-">−</option></select> ${ansInput('١,٠٧', '80px')} <button class="btn sm">مثّلْ</button></div><div class="mout"></div>`;
  const [x, y] = $$('input', el);
  $('button', el).onclick = () => { const a = parseNum(x.value), b = parseNum(y.value), op = $('.mop', el).value; if (isNaN(a) || isNaN(b) || a < 0 || b < 0 || a > 3 || b > 3 || (op === '-' && b > a)) { $('.mout', el).innerHTML = '<div class="meta">اكتبْ عددين بينَ ٠ و٣ (وفي الطرحِ: الأوّلُ أكبر).</div>'; return; }
    const r = r10(op === '+' ? a + b : a - b, 2); $('.mout', el).innerHTML = modelSVG(a, b, op) + `<div class="keybox">${op === '+' ? 'نعدُّ المربّعاتِ المظلّلةَ جميعَها' : 'نشطبُ المربّعاتِ المطروحةَ ونعدُّ الباقي'}: ${AR(String(a))} ${op === '+' ? '+' : '−'} ${AR(String(b))} = <b>${fmt(r)}</b></div>`; };
  x.value = '٢,٤'; y.value = '١,٠٧'; $('.mop', el).value = '-'; $('button', el).click();
}

/** ضرب: الناتجُ مع خطواتِ الضربِ العموديّ */
export function mulQ(tag, a, b, o = {}) { const r = a * b; const B = String(b); const parts = []; for (let i = B.length - 1; i >= 0; i--) { const d = +B[i] * 10 ** (B.length - 1 - i); if (d) parts.push(d); }
  const sol = parts.length > 1 ? [...parts.map(d => `${AR(a)} × ${AR(d)} = ${AR(a * d)}`), `نجمعُ النواتجَ الجزئيّة: ${parts.map(d => AR(a * d)).join(' + ')} = ${AR(r)}`] : [`${AR(a)} × ${AR(b)} = ${AR(r)}`];
  const est = (() => { const ra = roundTo(a, Math.max(0, String(a).length - 1)), rb = roundTo(b, Math.max(0, String(b).length - 1)); return `قدّرْ: ${AR(ra)} × ${AR(rb)} = ${AR(ra * rb)}`; })();
  return num(tag, o.text || `أوجدْ ناتجَ الضرب: <span class="mx"><b class="n">${AR(a)}</b><i class="op">×</i><b class="n">${AR(b)}</b></span>`, r, { skill: 'mul', sol: [est, ...sol], hints: ['اضربْ في الآحادِ أوّلًا، ثم في العشرات، ثم اجمعِ النواتج.'], ...o }); }
