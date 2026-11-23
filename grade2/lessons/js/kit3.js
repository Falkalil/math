// أدواتُ الصفّ الثالث: الجمعُ والطرحُ العموديّ، والتقدير، والخصائص
import { AR, fmt, rnd, pick, shuf, column, parseNum } from './mathkit.js';
import { $, $$, num, lst, mcq, ch, open, fld, star } from './engine.js';
import { decCol, estQ } from './kit5.js';
import { T2, KB, roundTo, LT } from './kit4.js';
export const MXS = (a, op, b) => `<span class="mx"><b class="n">${AR(a)}</b><i class="op">${op === '+' ? '+' : '−'}</i><b class="n">${AR(b)}</b></span>`;
/** جمعٌ أو طرحٌ عموديّ مع التحقّق بالتقدير */
export const colQ = (tag, a, b, op = '+', o = {}) => { const r = op === '+' ? a + b : a - b; const p = Math.max(1, String(Math.min(a, b)).length - 1); const ea = roundTo(a, p), eb = roundTo(b, p);
  return num(tag, o.text || `${op === '+' ? 'أوجدْ ناتجَ الجمع' : 'اطرحْ'}: ${MXS(a, op, b)}`, r, { skill: op === '+' ? 'add' : 'sub', col: [a, b, op], sol: [decCol(a, b, op, r), `تحقّقْ بالتقدير: ${AR(ea)} ${op === '+' ? '+' : '−'} ${AR(eb)} = ${AR(op === '+' ? ea + eb : ea - eb)} (قريبٌ من ${AR(r)})`, ...(op === '-' ? [`تحقّقْ بالجمع: ${AR(r)} + ${AR(b)} = ${AR(a)} ✓`] : [])], hints: [op === '+' ? 'اجمعِ الآحادَ أوّلًا، وإذا زادَ المجموعُ على ٩ فأعدِ التجميع.' : 'ابدأْ من الآحاد، وإذا كان الرقمُ العلويُّ أصغرَ فأعدِ التجميعَ من المنزلةِ التالية.'], ...o }); };
/** التقديرُ بالتقريبِ إلى منزلةٍ معطاة */
export const PN = { 1: 'عشرة', 2: 'مئة', 3: 'ألف' };
export const estP = (tag, a, op, b, p, o = {}) => { const ea = roundTo(a, p), eb = roundTo(b, p), v = op === '+' ? ea + eb : ea - eb;
  return num(tag, o.text || `قدّرِ الناتجَ بتقريبِ الأعدادِ إلى أقربِ ${PN[p]}: ${MXS(a, op, b)}`, v, { skill: 'est', sol: [`${AR(a)} ← ${AR(ea)} ، ${AR(b)} ← ${AR(eb)}`, `${AR(ea)} ${op === '+' ? '+' : '−'} ${AR(eb)} = ${AR(v)}`, `(الناتجُ الدقيق: ${AR(op === '+' ? a + b : a - b)})`], hints: [`قرّبْ كلَّ عددٍ إلى أقربِ ${PN[p]} أوّلًا، ثم ${op === '+' ? 'اجمعْ' : 'اطرحْ'}.`], ...o }); };
export const prop = (tag, expr, v, name, o = {}) => num(tag, `اكتبِ العددَ المفقود، واذكرِ الخاصّيّةَ أو القاعدةَ التي استعملتَها: ${LT(expr)}`, v, { skill: 'prop', sol: [`■ = ${AR(v)}`, `${name}`], ...o });
export const P = { comm: 'خاصّيّةُ الإبدالِ لعمليّةِ الجمع', assoc: 'خاصّيّةُ التجميعِ لعمليّةِ الجمع', id: 'خاصّيّةُ العنصرِ المحايدِ الجمعيّ', sub0: 'قاعدةُ الطرح: طرحُ الصفرِ من أيِّ عددٍ يعطي العددَ نفسَه', subS: 'قاعدةُ الطرح: طرحُ العددِ من نفسِه يعطي صفرًا' };
export const ment = (tag, a, b, c, o = {}) => num(tag, o.text || `اجمعْ ذهنيًّا: ${LT(`${a} + ${b} + ${c}`)}`, a + b + c, { skill: 'ment', sol: (() => { const pairs = [[a, b, c], [a, c, b], [b, c, a]].find(([x, y]) => (x + y) % 10 === 0) || [a, b, c]; return [`نجمعُ العددينِ اللذينِ يكوّنانِ عددًا سهلًا أوّلًا (خاصّيّةُ التجميع والإبدال): ${AR(pairs[0])} + ${AR(pairs[1])} = ${AR(pairs[0] + pairs[1])}`, `${AR(pairs[0] + pairs[1])} + ${AR(pairs[2])} = ${AR(a + b + c)}`]; })(), ...o });
export function colTool(op, a0, b0) { return el => { el.innerHTML = `<div class="row"><input class="ans" data-kp="num" inputmode="none" style="width:120px" value="${AR(a0)}"> ${op === '+' ? '+' : '−'} <input class="ans" data-kp="num" inputmode="none" style="width:120px" value="${AR(b0)}"> <button class="btn sm">احسبْ عموديًّا</button></div><div class="cw"></div>`;
  const pn = s => +String(s).replace(/[٠-٩]/g, c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c)).replace(/\D/g, '');
  const go = () => { const [x, y] = $$('input', el).map(i => pn(i.value)); if (!(x >= 0 && y >= 0) || (op === '-' && y > x) || x > 9999999 || y > 9999999) { $('.cw', el).innerHTML = '<div class="meta">اكتبْ عددين صحيحين (وفي الطرح: الأوّلُ أكبر).</div>'; return; } column($('.cw', el), x, y, op, () => star(1)); };
  $('button', el).onclick = go; go(); }; }
/** تقديرٌ بالأعدادِ المتناغمة: يقبلُ أيَّ تقديرٍ معقول */
export const estC = (tag, a, b, est, o = {}) => estQ(tag, `${a} + ${b}`, est, { text: o.text || `قدّرْ ناتجَ الجمعِ باستعمالِ الأعدادِ المتناغمة: ${MXS(a, '+', b)}`, tol: 0.15, abs: 5, how: o.how, ...o });
