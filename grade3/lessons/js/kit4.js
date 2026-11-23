// أدواتٌ إضافيّةٌ لكتابِ الصفّ الرابع (تُبنى على kit5.js)
import { AR, fmt, rnd, pick, shuf, parseNum, parseList } from './mathkit.js';
import { num, lst, mcq, ch, open, fld, fnq } from './engine.js';
import { A, MX, T2, KB, r10, words, wordQ, expQ, expHTML, cmpS, sortedStr, roundQ, roundTo, placeQ, pvTable } from './kit5.js';

/** نصٌّ رياضيٌّ يُعرَضُ من اليسارِ إلى اليمينِ كما في الكتاب */
export const LT = s => `<span class="mx" dir="ltr" style="direction:ltr">${AR(String(s)).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`;
/** الصيغةُ اللفظيّةُ والتحليليّةُ لعدد (سؤالان) */
export const WE = (tag, s, o = {}) => [wordQ(tag + ' (لفظيًّا)', String(s), o), expQ(tag + ' (تحليليًّا)', String(s), { noTable: true, ...o })];
/** الصيغةُ القياسيّةُ من نصّ */
export const stdQ = (tag, text, v, o = {}) => num(tag, text, v, { skill: 'std', sol: [`الصيغةُ القياسيّة: ${A(String(v))}`, `الصيغةُ التحليليّة: ${expHTML(String(v))}`], ...o });
/** الصيغةُ القياسيّةُ والتحليليّةُ من الكلمات */
export const SE = (tag, w, v, o = {}) => [stdQ(tag + ' (قياسيًّا)', `اكتبْ بالصيغةِ القياسيّة: «${w}»`, v, o), expQ(tag + ' (تحليليًّا)', String(v), { text: `اكتبْ «${w}» بالصيغةِ التحليليّة:`, noTable: true, ...o })];
/** من الصيغةِ التحليليّةِ إلى القياسيّةِ واللفظيّة */
export const ES = (tag, parts, o = {}) => { const v = parts.reduce((a, b) => a + b, 0); const ex = parts.map(p => AR(p)).join(' + ');
  return [stdQ(tag + ' (قياسيًّا)', `اكتبْ بالصيغةِ القياسيّة: ${LT(parts.join(' + '))}`, v, o), wordQ(tag + ' (لفظيًّا)', String(v), { text: `اكتبِ العددَ ${LT(parts.join(' + '))} بالصيغةِ اللفظيّة:`, noTable: true })]; };
/** ترتيب */
export const ordQ = (tag, arr, desc, o = {}) => { const s = sortedStr(arr.map(String), desc);
  return lst(tag, o.text || `رتّبِ الأعدادَ ${desc ? 'من الأكبرِ إلى الأصغر' : 'من الأصغرِ إلى الأكبر'}: ${arr.map(x => A(x)).join('، ')}`, s.map(Number), { skill: 'order', sol: [(desc ? 'من الأكبرِ إلى الأصغر: ' : 'من الأصغرِ إلى الأكبر: ') + s.map(A).join('، ')], hints: ['اكتبِ الأعدادَ رأسيًّا بحيثُ تتحاذى الآحاد.', 'العددُ الذي عددُ أرقامِه أكثرُ هو الأكبر؛ وإذا تساوى عددُ الأرقامِ قارنْ من اليسار.'], ...o }); };
/** ترتيبُ أسماءٍ حسبَ قيمِها */
export const ordNames = (tag, text, pairs, desc, o = {}) => { const s = pairs.slice().sort((a, b) => desc ? b[1] - a[1] : a[1] - b[1]); const right = s.map(p => p[0]).join(' ← ');
  const opts = [right]; let g = 0; while (opts.length < 4 && g++ < 60) { const t = shuf(s.map(p => p[0])).join(' ← '); if (!opts.includes(t)) opts.push(t); } const sh = shuf(opts);
  return mcq(tag, text, sh, sh.indexOf(right), { skill: 'order', sol: [s.map(p => `${p[0]} (${A(p[1])})`).join(' ← ')], ...o }); };
/** اكتبْ رقمًا في الفراغ (يقبلُ أيَّ رقمٍ يحقّقُ الشرط) */
export const digitQ = (tag, text, ok, show, o = {}) => fnq(tag, text, raw => { const v = parseNum(raw); if (isNaN(v)) return { empty: true }; return { ok: v % 1 === 0 && v >= 0 && v <= 9 && ok(v) }; }, show, { kp: 'num', ...o });
/** يقبلُ عددًا يحقّقُ شرطًا */
export const condQ = (tag, text, ok, show, o = {}) => fnq(tag, text, raw => { const v = parseNum(raw); if (isNaN(v)) return { empty: true }; const r = ok(v); return typeof r === 'object' ? r : { ok: !!r }; }, show, { kp: 'num', ...o });
/** يقبلُ قائمةَ أعدادٍ كلٌّ منها يحقّقُ الشرط */
export const condList = (tag, text, n, ok, show, o = {}) => fnq(tag, text, raw => { const L = parseList(raw).filter(x => !isNaN(x)); if (!L.length) return { empty: true }; if (L.length < n) return { ok: false, msg: `اكتبْ ${AR(n)} أعداد.` }; if (new Set(L).size < L.length) return { ok: false, msg: 'الأعدادُ يجبُ أن تكونَ مختلفة.' }; const bad = L.find(x => !ok(x)); return bad === undefined ? { ok: true } : { ok: false, msg: `${fmt(bad)} لا يحقّقُ الشرط.` }; }, show, { kp: 'list', ...o });
/** صح أم خطأ */
export const tf = (tag, text, v, o = {}) => ch(tag, text, ['✓ صحيحة', '✗ غيرُ صحيحة'], v ? 0 : 1, o);
/** خطواتُ حلِّ المسألةِ الأربع */
export const FOUR = (f, k, h, t) => T2(['الخطوة', ''], [['افهمْ', f], ['خطّطْ', k], ['حُلَّ', h], ['تحقّقْ', t]]);
export { A, MX, T2, KB, r10, words, wordQ, expQ, expHTML, cmpS, sortedStr, roundQ, roundTo, placeQ, pvTable };

/* ═════════ الصفّ الثالث ═════════ */
/** نمطٌ عدديٌّ فيه فراغات: arr يحوي null مكانَ المجهول */
export const seqQ = (tag, arr, step, o = {}) => { const miss = arr.map((x, i) => x === null ? i : -1).filter(i => i >= 0); const full = arr.map((x, i) => x === null ? arr.find(v => v !== null) + (i - arr.findIndex(v => v !== null)) * step : x);
  const show = arr.map(x => x === null ? '■' : AR(x)).join('، ');
  return fld(tag, o.text || `${show} — حدّدِ النمطَ، ثم اكتبِ العددَ المناسبَ في ■`, miss.map((i, k) => [miss.length > 1 ? `■ ${['الأوّل', 'الثاني', 'الثالث', 'الرابع'][k]}` : '■', full[i]]), { skill: 'pat', sol: [`النمط: ${step > 0 ? 'نضيفُ ' + AR(step) : 'نطرحُ ' + AR(-step)} في كلِّ مرّة.`, full.map(AR).join('، ')], ...o }); };
/** قطعةٌ من لوحةِ المئة (من اليمينِ إلى اليسار): cells = [[صف، عمود، قيمة أو null]] */
export const hundredQ = (tag, cells, o = {}) => { const base = cells.find(c => c[2] !== null); const val = ([r, c]) => base[2] + (r - base[0]) * 10 + (c - base[1]);
  const R = Math.max(...cells.map(c => c[0])) + 1, C = Math.max(...cells.map(c => c[1])) + 1; let h = '<table class="tb" style="direction:rtl;margin:6px auto;font-size:18px">'; let k = 0; const lab = {};
  cells.forEach(c => { if (c[2] === null) lab[c[0] + ',' + c[1]] = ++k; });
  for (let r = 0; r < R; r++) { h += '<tr>'; for (let c = 0; c < C; c++) { const cc = cells.find(x => x[0] === r && x[1] === c); h += cc ? `<td style="min-width:44px;border:2px solid #555">${cc[2] !== null ? `<b>${AR(cc[2])}</b>` : `<small style="color:#999">${AR(lab[r + ',' + c])}</small>`}</td>` : '<td style="border:0"></td>'; } h += '</tr>'; }
  h += '</table>';
  return fld(tag, o.text || 'الحسُّ العدديّ: أكملِ الفراغَ بالعددِ المناسب (قطعةٌ من لوحةِ المئة):', cells.filter(c => c[2] === null).map((c, i) => [`الخانة ${AR(i + 1)}`, val(c)]), { html: h, skill: 'pat', sol: ['في لوحةِ المئةِ يزيدُ العددُ ١ كلّما انتقلنا خانةً إلى اليسار، ويزيدُ ١٠ كلّما نزلنا صفًّا.'], ...o }); };
