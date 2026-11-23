// أدواتُ الصفّ الأوّل: أسئلةٌ مصوّرة (التصنيف، المقارنة، العدّ، الموقع، الأنماط، الجمع)
import { AR, rnd, pick, shuf } from './mathkit.js';
import { $, $$, num, mcq, ch, fld, star } from './engine.js';
import { LT, T2, KB, FOUR } from './kit4.js';

export const big = (s, size = 30) => `<div style="text-align:center;font-size:${size}px;line-height:1.35;letter-spacing:3px">${s}</div>`;
/** صفٌّ من الرموز */
export const row = (n, e) => Array.from({ length: n }, () => e).join('');
/** مجموعتانِ متقابلتان (للتقابل والمقارنة) */
export const pair = (a, ea, b, eb) => `<div style="display:grid;grid-template-columns:repeat(${Math.max(a, b)},34px);gap:4px 6px;justify-content:center;direction:rtl;font-size:26px;text-align:center;margin:8px auto">${Array.from({ length: Math.max(a, b) }, (_, i) => `<span>${i < a ? ea : ''}</span>`).join('')}${Array.from({ length: Math.max(a, b) }, (_, i) => `<span>${i < b ? eb : ''}</span>`).join('')}</div>`;
/** إطارٌ حولَ شيء (الصفةُ المطلوبة) */
export const frame = s => `<span style="display:inline-block;border:3px solid #2a9fd8;border-radius:8px;padding:2px 8px;margin:0 6px">${s}</span>`;
/** أختارُ الشيءَ المماثلَ للذي في الإطار */
export const sameQ = (tag, target, opts, v, x = {}) => mcq(tag, x.text || 'أحوّطُ الشيءَ الذي له الصفةُ نفسُها للأشياءِ داخلَ الإطار:', opts, v, { skill: 'sort', html: big(frame(target)), ...x });
/** أختارُ الشيءَ المختلف */
export const oddQ = (tag, opts, v, x = {}) => mcq(tag, x.text || 'أضعُ علامة ✕ على الشيءِ المختلف (الذي ليست له الصفةُ نفسُها):', opts.map((o, i) => new Set(opts).size < opts.length ? `${o} <small>(${AR(i + 1)})</small>` : o), v, { skill: 'odd', html: big(opts.join(' ')), ...x });
/** المقارنةُ بالتقابل */
export const cmpQ = (tag, a, ea, b, eb, x = {}) => mcq(tag, x.text || 'أصلُ بينَ عناصرِ المجموعتين، ثم أختار:', [`${ea} أكثر`, `${eb} أكثر`, 'متساويتان (يساوي)'], a > b ? 0 : a < b ? 1 : 2, { skill: a === b ? 'eq' : 'cmp', html: pair(a, ea, b, eb), sol: [a === b ? `لكلِّ ${ea} يقابلُه ${eb}؛ المجموعتانِ متساويتان (${AR(a)} = ${AR(b)})` : `${AR(a)} ${a > b ? '&gt;' : '&lt;'} ${AR(b)}؛ المجموعةُ ${a > b ? ea : eb} أكثر`], ...x });
/** أكثرُ من / أقلُّ من صريحًا */
export const lessQ = (tag, a, ea, b, eb, x = {}) => mcq(tag, x.text || 'أحوّطُ المجموعةَ التي عناصرُها أقلّ:', [ea, eb], a < b ? 0 : 1, { skill: 'cmp', html: pair(a, ea, b, eb), sol: [`${AR(Math.min(a, b))} أقلُّ من ${AR(Math.max(a, b))}`], ...x });
export const moreQ = (tag, a, ea, b, eb, x = {}) => mcq(tag, x.text || 'أحوّطُ المجموعةَ التي عناصرُها أكثر:', [ea, eb], a > b ? 0 : 1, { skill: 'cmp', html: pair(a, ea, b, eb), sol: [`${AR(Math.max(a, b))} أكثرُ من ${AR(Math.min(a, b))}`], ...x });
/** أعدُّ وأكتبُ العدد */
export const countQ = (tag, n, e, x = {}) => num(tag, x.text || 'أعدُّ، ثم أكتبُ العدد:', n, { skill: 'count', html: big(n ? `<span style="display:inline-grid;grid-template-columns:repeat(${Math.min(5, n)},auto);gap:4px 8px">${row(n, `<span>${e}</span>`)}</span>` : '<span style="color:#999">(لا يوجدُ شيء)</span>'), sol: [n ? Array.from({ length: n }, (_, i) => AR(i + 1)).join('، ') : 'لا يوجدُ شيء ← صفر (٠)'], hints: ['أعدُّ الأشياءَ واحدًا واحدًا، وأشيرُ إلى كلِّ شيءٍ مرّةً واحدة.'], ...x });
/** أختارُ المجموعةَ التي فيها العددُ المعطى */
export const pickSetQ = (tag, n, e, x = {}) => { const opts = shuf([...new Set([n, Math.max(0, n - 1), n + 1, n + 2])]).slice(0, 3); if (!opts.includes(n)) opts[0] = n; return mcq(tag, x.text || `أحوّطُ المجموعةَ التي فيها ${AR(n)}:`, opts.map(k => k ? row(k, e) : '(فارغة)'), opts.indexOf(n), { skill: 'count', ...x }); };
/** إطارُ الخمسة / العشرة */
export const tenf = (n, cells = 10, e = '🔴') => `<div style="display:inline-grid;grid-template-columns:repeat(5,30px);gap:2px;border:2px solid #333;padding:3px;margin:6px auto;direction:rtl">${Array.from({ length: cells }, (_, i) => `<span style="width:30px;height:30px;border:1px solid #bbb;display:flex;align-items:center;justify-content:center;font-size:20px">${i < n ? e : ''}</span>`).join('')}</div>`;
/** نمط: rep مصفوفةُ وحدة النمط، len الطول المعروض، ثم ؟ */
export const patQ = (tag, unit, shown, x = {}) => { const seq = Array.from({ length: shown }, (_, i) => unit[i % unit.length]); const next = unit[shown % unit.length]; const opts = [...new Set([next, ...unit, ...(x.extra || [])])].slice(0, 4);
  return mcq(tag, x.text || 'ما الشيءُ التالي في النمط؟', opts, opts.indexOf(next), { skill: 'pat', html: big(seq.join(' ') + ' <span style="color:#999">؟</span>', 26), sol: [`وحدةُ النمط: ${unit.join(' ')}`], ...x }); };
/** الموقع */
export const posQ = (tag, text, opts, v, html, x = {}) => mcq(tag, text, opts, v, { skill: 'pos', html, ...x });
/** جملةُ جمع من صورة */
export const addPic = (tag, a, b, e, x = {}) => num(tag, x.text || `أكتبُ جملةَ الجمع: ${AR(a)} + ${AR(b)} = ؟`, a + b, { skill: 'add', html: big(`${row(a, e)} <b style="color:#e8413a">+</b> ${row(b, x.e2 || e)}`, 26), sol: [`${AR(a)} + ${AR(b)} = ${AR(a + b)}`], hints: ['أعدُّ المجموعتينِ معًا.'], ...x });
/** أداة: أعدُّ وألمس */
export function countTool(e0 = '🍎') {
  return el => { let n = 3, e = e0, picked = 0; const E = ['🍎', '⭐', '🐟', '🌼', '🚗', '🎈'];
    const draw = () => { el.innerHTML = `<div class="row c"><button class="btn sm" data-a="-">−</button><b class="big">${AR(n)}</b><button class="btn sm" data-a="+">+</button><button class="btn sm" data-a="e">🔄 شكلٌ آخر</button></div><div style="text-align:center;font-size:34px">${Array.from({ length: n }, (_, i) => `<span data-i="${i}" style="cursor:pointer;opacity:${i < picked ? .35 : 1}">${e}</span>`).join(' ')}</div><div class="keybox" style="text-align:center">${picked ? `عددتُ: <b class="big">${AR(picked)}</b>` : 'أضغطُ على الأشياءِ واحدًا واحدًا لأعدَّها'}${picked === n ? ` ✔️ — العددُ هو <b>${AR(n)}</b>` : ''}</div>`;
      $('[data-a="-"]', el).onclick = () => { if (n > 0) n--; picked = 0; draw(); }; $('[data-a="+"]', el).onclick = () => { if (n < 20) n++; picked = 0; draw(); }; $('[data-a="e"]', el).onclick = () => { e = E[(E.indexOf(e) + 1) % E.length]; draw(); };
      $$('[data-i]', el).forEach(s => s.onclick = () => { if (+s.dataset.i === picked) { picked++; draw(); } }); };
    draw(); };
}
/** أداة: إطارُ العشرة */
export function frameTool(n0 = 5) {
  return el => { let n = n0; const draw = () => { el.innerHTML = `<div style="text-align:center">${tenf(n)}${n > 10 ? tenf(n - 10) : ''}</div><div class="keybox" style="text-align:center"><b class="big">${AR(n)}</b></div><div class="row c"><button class="btn sm" data-a="-">− واحد</button><button class="btn sm" data-a="+">+ واحد</button></div>`; $('[data-a="-"]', el).onclick = () => { if (n > 0) n--; draw(); }; $('[data-a="+"]', el).onclick = () => { if (n < 20) n++; draw(); }; }; draw(); };
}
export { LT, T2, KB, FOUR };
