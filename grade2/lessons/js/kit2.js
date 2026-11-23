// أدواتُ الصفّ الثاني: نماذجُ العشراتِ والآحاد، وأسماءُ الأعداد، ولوحةُ المئة، وخطُّ الأعداد، والتقدير
import { AR, rnd, pick, shuf } from './mathkit.js';
import { $, $$, num, mcq, ch, fld, star } from './engine.js';
import { LT, T2, KB } from './kit4.js';

const ROD = '<span style="display:inline-block;width:9px;height:62px;background:#f08a24;border:1px solid #a04a00;background-image:repeating-linear-gradient(#f08a24 0 5px,#a04a00 5px 6px)"></span>';
const UNIT = '<span style="display:inline-block;width:9px;height:9px;background:#f08a24;border:1px solid #a04a00"></span>';
/** نموذجُ عشراتٍ وآحاد: t أعمدة، o مكعّبات */
export const blocks = (t, o) => `<div style="display:flex;gap:3px;align-items:flex-end;justify-content:center;direction:ltr;margin:8px auto">${ROD.repeat(t)}${o ? `<span style="display:inline-grid;grid-template-columns:repeat(2,11px);gap:2px;margin-inline-start:8px">${UNIT.repeat(o)}</span>` : ''}</div>`;
/** آحادٌ مبعثرة (مجموعاتٌ من ١٠) */
export const ones = n => `<div style="display:grid;grid-template-columns:repeat(${Math.min(10, n)},11px);gap:2px;justify-content:center;direction:ltr;margin:8px auto">${UNIT.repeat(n)}</div>`;
/** أكتبُ عددَ العشراتِ والآحاد، ثم العدد */
export const tensQ = (tag, t, o, x = {}) => fld(tag, x.text || 'أكتبُ عددَ العشراتِ والآحاد، ثم أكتبُ العدد:', [['العشرات', t], ['الآحاد', o], ['العدد', t * 10 + o]], { skill: 'pv', html: blocks(t, o), sol: [`${AR(t)} عشرات و${AR(o)} آحاد = ${AR(t * 10)} + ${AR(o)} = ${AR(t * 10 + o)}`], ...x });
/** أحوّطُ القيمةَ المنزليّةَ للرقمِ الملوّن: pos ٠ = الآحاد، ١ = العشرات */
export const pvQ = (tag, n, pos, x = {}) => { const s = String(n), d = +s[s.length - 1 - pos]; const html = `<div class="big" style="text-align:center;direction:ltr;font-size:34px">${[...s].map((c, i) => i === s.length - 1 - pos ? `<b style="color:#e8413a;background:#fff3a6;padding:0 4px">${AR(c)}</b>` : AR(c)).join('')}</div>`;
  return mcq(tag, x.text || 'أحوّطُ القيمةَ المنزليّةَ للرقمِ الملوّنِ بالأحمر:', [AR(d), AR(d * 10)], pos, { skill: 'pv', html, sol: [pos ? `الرقم ${AR(d)} في منزلةِ العشرات؛ قيمتُه ${AR(d * 10)}` : `الرقم ${AR(d)} في منزلةِ الآحاد؛ قيمتُه ${AR(d)}`], ...x }); };
/** أسماءُ الأعداد حتى ١٠٠ */
const U = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
const TN = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
export const nw = n => n === 100 ? 'مئة' : n < 20 ? U[n] : n % 10 ? `${U[n % 10]} و${TN[Math.floor(n / 10)]}` : TN[n / 10];
/** من الكلماتِ إلى الأرقام */
export const w2nQ = (tag, n, x = {}) => num(tag, x.text || `أكتبُ العددَ بالأرقام: «${nw(n)}»`, n, { skill: 'words', sol: [`${nw(n)} = ${AR(n)}`], ...x });
/** من الأرقامِ إلى الكلمات */
export const n2wQ = (tag, n, x = {}) => { const t = Math.floor(n / 10), o = n % 10; const c = new Set([n]); [o * 10 + t, n + 10, n - 10, n + 1, n - 1].forEach(v => { if (v > 0 && v <= 100 && c.size < 4) c.add(v); }); const opts = shuf([...c]); return mcq(tag, x.text || `أختارُ الطريقةَ الصحيحةَ لكتابةِ العدد ${AR(n)} بالكلمات:`, opts.map(nw), opts.indexOf(n), { skill: 'words', ...x }); };
/** تقديرُ الكمّيّة: مرجعٌ من ١٠ والعددُ المجهول */
export const jar = (n, e) => `<span style="display:inline-flex;flex-wrap:wrap;gap:1px;width:${n > 40 ? 150 : 110}px;justify-content:center;border:3px solid #7aa6c8;border-top-width:8px;border-radius:10px 10px 16px 16px;padding:5px;font-size:13px;line-height:1.1;background:#f5fbff">${e.repeat(n)}</span>`;
export const estQ2 = (tag, n, opts, e = '🔵', x = {}) => { const best = opts.reduce((b, v) => Math.abs(v - n) < Math.abs(b - n) ? v : b, opts[0]);
  return mcq(tag, x.text || 'أقدّرُ العدد، وأحوّطُ الإجابة:', opts.map(v => `${AR(v)} تقريبًا`), opts.indexOf(best), { skill: 'est', html: `<div class="row c" style="align-items:flex-end;gap:18px"><div style="text-align:center">${jar(10, e)}<br>١٠</div><div style="text-align:center">${jar(n, e)}<br>؟</div></div>`, sol: [`المجموعةُ تبدو كأنّها ${AR(Math.round(best / 10))} مجموعاتٍ من عشرة؛ أي ${AR(best)} تقريبًا`], ...x }); };
/** خطُّ الأعداد */
export const nline = (a, b, hl = [], hide = []) => { const n = b - a, W = 320, x = v => 12 + (v - a) * (W - 24) / n; let s = `<svg viewBox="0 0 ${W} 54" style="width:100%;max-width:560px;direction:ltr;display:block;margin:6px auto"><line x1="4" y1="22" x2="${W - 4}" y2="22" stroke="#2a8f4a" stroke-width="2"/><path d="M4 22l7-5v10zM${W - 4} 22l-7-5v10z" fill="#2a8f4a"/>`;
  for (let v = a; v <= b; v++) s += `<line x1="${x(v)}" y1="16" x2="${x(v)}" y2="28" stroke="#2a8f4a"/>` + (hide.includes(v) ? `<rect x="${x(v) - 7}" y="33" width="14" height="14" fill="#fff" stroke="#888"/>` : `<text x="${x(v)}" y="45" font-size="${n > 20 ? 7 : 10}" text-anchor="middle" fill="${hl.includes(v) ? '#e8413a' : '#333'}" font-weight="${hl.includes(v) ? 'bold' : 'normal'}">${AR(v)}</text>`);
  return s + '</svg>'; };
/** لوحةُ المئة (تلوينُ أعدادٍ معيّنة) */
export const hchart = (hl = [], to = 100, hide = []) => { let h = '<table class="tb" style="direction:rtl;margin:6px auto;font-size:.78em">'; for (let r = 0; r < to / 10; r++) { h += '<tr>'; for (let c = 1; c <= 10; c++) { const v = r * 10 + c; h += `<td style="padding:3px 4px;${hl.includes(v) ? 'background:#ffb3b3;font-weight:bold' : ''}">${hide.includes(v) ? '■' : AR(v)}</td>`; } h += '</tr>'; } return h + '</table>'; };
/** أداة: لوحةُ المئة والعدُّ القفزيّ */
export function hundredTool(st0 = 2, step0 = 2) {
  return el => { el.innerHTML = `<div class="row c">أبدأُ بالعدد <input class="ans" data-kp="num" inputmode="none" style="width:64px" value="${AR(st0)}"> وأعدُّ قفزيًّا بـ <select class="ans" style="width:70px">${[1, 2, 3, 4, 5, 10].map(k => `<option value="${k}" ${k === step0 ? 'selected' : ''}>${AR(k)}</option>`).join('')}</select> <button class="btn sm">لوّنْ</button></div><div class="hout"></div>`;
    const inp = $('input', el), sel = $('select', el), toN = s => parseInt(String(s).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)), 10);
    const show = () => { const s = Math.max(1, Math.min(100, toN(inp.value) || 1)), k = +sel.value, L = []; for (let v = s; v <= 100; v += k) L.push(v); $('.hout', el).innerHTML = hchart(L) + `<div class="keybox">${L.slice(0, 12).map(AR).join('، ')}${L.length > 12 ? '، …' : ''}<br>النمط: أضيفُ ${AR(k)} في كلِّ مرّة.</div>`; };
    $('button', el).onclick = show; sel.onchange = show; show(); };
}
/** أداة: أكوّنُ العددَ بالعشراتِ والآحاد */
export function blocksTool(t0 = 2, o0 = 4) {
  return el => { let t = t0, o = o0;
    const draw = () => { el.innerHTML = `<div class="row c"><button class="btn sm" data-a="t+">+ عشرة</button><button class="btn sm" data-a="t-">− عشرة</button><button class="btn sm" data-a="o+">+ آحاد</button><button class="btn sm" data-a="o-">− آحاد</button></div>${blocks(t, o)}<div class="keybox" style="text-align:center"><b>${AR(t)}</b> عشرات و<b>${AR(o)}</b> آحاد = ${AR(t * 10)} + ${AR(o)} = <b class="big">${AR(t * 10 + o)}</b><br>«${nw(t * 10 + o)}»${o >= 10 ? '<br>⚠️ عندي ١٠ آحاد أو أكثر: أجمعُ ١٠ آحاد لأكوّنَ عشرةً واحدة!' : ''}</div>${o >= 10 ? '<div class="row c"><button class="btn sm" data-a="g">🔁 أكوّنُ عشرة</button></div>' : ''}`;
      $$('[data-a]', el).forEach(b => b.onclick = () => { const a = b.dataset.a; if (a === 't+' && t < 9) t++; if (a === 't-' && t > 0) t--; if (a === 'o+' && o < 19) o++; if (a === 'o-' && o > 0) o--; if (a === 'g' && t < 10) { t++; o -= 10; } draw(); }); };
    draw(); };
}
/** أداة: خطُّ الأعدادِ (قبل، بعد، بين) */
export function lineTool(n0 = 5) {
  return el => { let n = n0; const draw = () => { const a = Math.max(0, n - 7), b = a + 15; el.innerHTML = nline(a, b, [n - 1, n, n + 1].filter(v => v >= 0)) + `<div class="keybox" style="text-align:center">قبلَ العدد ${AR(n)}: <b>${AR(n - 1)}</b> · بعدَ العدد ${AR(n)}: <b>${AR(n + 1)}</b><br>العدد ${AR(n)} يقعُ <b>بينَ</b> ${AR(n - 1)} و${AR(n + 1)}</div><div class="row c"><button class="btn sm" data-a="-">◀ أصغر</button><button class="btn sm" data-a="+">أكبر ▶</button></div>`;
    $('[data-a="+"]', el).onclick = () => { if (n < 99) n++; draw(); }; $('[data-a="-"]', el).onclick = () => { if (n > 1) n--; draw(); }; }; draw(); };
}
export { LT, T2, KB };
