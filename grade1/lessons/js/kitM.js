// أدواتُ الضرب (الصفّ الثالث – الفصلان ٤ و٥)
import { AR, rnd } from './mathkit.js';
import { $, num, ch, fld } from './engine.js';
import { LT, T2 } from './kit4.js';

/** ترتيبٌ (شبكة) من الرموز: r صفوف × c أعمدة */
export const arr = (r, c, e = '🟡') => `<div style="display:grid;grid-template-columns:repeat(${c},24px);gap:4px;justify-content:center;direction:ltr;font-size:19px;margin:6px auto">${Array.from({ length: r * c }, () => `<span>${e}</span>`).join('')}</div>`;
/** شبكةُ مربّعاتٍ فارغة */
export const grid = (r, c) => `<div style="display:grid;grid-template-columns:repeat(${c},22px);gap:0;justify-content:center;direction:ltr;margin:6px auto">${Array.from({ length: r * c }, () => '<span style="width:22px;height:22px;border:1.5px solid #2a7fd4;box-sizing:border-box"></span>').join('')}</div>`;
/** مجموعاتٌ متساوية: g مجموعات في كلٍّ منها n */
export const groups = (g, n, e = '🟡') => `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:6px auto">${Array.from({ length: g }, () => `<span style="border:2px solid #2a7fd4;border-radius:14px;padding:4px 6px;font-size:17px;max-width:110px;display:inline-flex;flex-wrap:wrap;gap:2px;justify-content:center">${e.repeat ? Array.from({ length: n }, () => e).join('') : ''}</span>`).join('')}</div>`;
export const MXM = (a, b) => LT(`${a} × ${b}`);
const rep = (a, b) => Array.from({ length: a }, () => AR(b)).join(' + ');
/** أجدُ ناتجَ الضرب */
export const mulQ = (tag, a, b, o = {}) => num(tag, o.text || `أجدُ ناتجَ الضرب: ${MXM(a, b)}`, a * b, { skill: 'mul', sol: [a > 0 && a <= 10 && b > 0 ? `${rep(a, b)} = ${AR(a * b)}` : `${AR(a)} × ${AR(b)} = ${AR(a * b)}`], hints: [a === 0 || b === 0 ? 'ناتجُ ضربِ أيِّ عددٍ في الصفرِ يساوي صفرًا.' : `اجمعِ العدد ${AR(b)} عددَ ${AR(a)} من المرّات، أو عُدَّ قفزيًّا.`], ...o });
/** جملةُ الضرب لنموذج: عددُ المجموعات/الصفوف × العددُ في كلٍّ منها = الناتج */
export const sentQ = (tag, text, r, c, html, o = {}) => fld(tag, text, [[o.l1 || 'عددُ الصفوفِ (المجموعات)', r], [o.l2 || 'العددُ في كلِّ صفٍّ (مجموعة)', c], ['ناتجُ الضرب', r * c]], { skill: 'sent', html, sol: [`${AR(r)} × ${AR(c)} = ${AR(r * c)}`], ...o });
/** العددُ المفقود ■ */
export const missQ = (tag, expr, v, o = {}) => num(tag, o.text || `أكتبُ العددَ المناسبَ في ■: ${LT(expr)}`, v, { skill: 'miss', sol: [`■ = ${AR(v)}`], ...o });
/** مقارنة تعبيرين */
export const cmpE = (tag, l, lv, r, rv, o = {}) => ch(tag, `أضعُ الإشارةَ المناسبة (&gt; أو &lt; أو =): ${LT(`${l} ● ${r}`)}`, ['&gt;', '&lt;', '='], lv > rv ? 0 : lv < rv ? 1 : 2, { skill: 'cmp', sol: [`${LT(`${l} = ${lv}`)} ، ${LT(`${r} = ${rv}`)}`], ...o });

/** أداة: أعملُ شبكة */
export function arrTool(r0 = 3, c0 = 5) {
  return el => {
    el.innerHTML = `<div class="row c">الصفوف: <input class="ans" data-kp="num" inputmode="none" style="width:70px" value="${AR(r0)}"> الأعمدة: <input class="ans" data-kp="num" inputmode="none" style="width:70px" value="${AR(c0)}"> <button class="btn sm">ارسمِ الشبكة</button></div><div class="aout"></div>`;
    const [ri, ci] = el.querySelectorAll('input'); const toN = s => parseInt(String(s).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)), 10);
    const show = () => { const r = Math.min(10, Math.max(0, toN(ri.value) || 0)), c = Math.min(10, Math.max(0, toN(ci.value) || 0));
      $('.aout', el).innerHTML = arr(r, c) + `<div class="keybox">الجمعُ المتكرّر: ${r ? rep(r, c) : '٠'} = <b>${AR(r * c)}</b><br>جملةُ الضرب: <b>${MXM(r, c)} = ${AR(r * c)}</b><br>خاصّيّةُ الإبدال: ${MXM(c, r)} = ${AR(r * c)} أيضًا</div>`; };
    $('button', el).onclick = show; show();
  };
}
/** أداة: العدُّ القفزيُّ على خطِّ الأعداد */
export function skipTool(k0 = 2, n0 = 3) {
  return el => {
    el.innerHTML = `<div class="row c">أقفزُ <input class="ans" data-kp="num" inputmode="none" style="width:60px" value="${AR(n0)}"> قفزات، طولُ كلٍّ منها <input class="ans" data-kp="num" inputmode="none" style="width:60px" value="${AR(k0)}"> <button class="btn sm">ابدأ</button></div><div class="sout"></div>`;
    const [ni, ki] = el.querySelectorAll('input'); const toN = s => parseInt(String(s).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)), 10);
    const show = () => { const n = Math.min(10, Math.max(0, toN(ni.value) || 0)), k = Math.min(10, Math.max(1, toN(ki.value) || 1)); const M = n * k || k, W = 300, x = v => 10 + v * W / Math.max(M, 1);
      let s = `<svg viewBox="0 0 320 70" style="width:100%;max-width:520px;direction:ltr"><line x1="5" y1="50" x2="315" y2="50" stroke="#555"/>`;
      for (let v = 0; v <= M; v++) if (M <= 30 || v % k === 0) s += `<line x1="${x(v)}" y1="45" x2="${x(v)}" y2="55" stroke="#555"/>`;
      for (let i = 0; i <= n; i++) s += `<text x="${x(i * k)}" y="68" font-size="9" text-anchor="middle">${AR(i * k)}</text>`;
      for (let i = 0; i < n; i++) s += `<path d="M${x(i * k)} 48 Q${(x(i * k) + x((i + 1) * k)) / 2} ${10} ${x((i + 1) * k)} 48" fill="none" stroke="#e8413a" stroke-width="2"/>`;
      $('.sout', el).innerHTML = s + '</svg>' + `<div class="keybox">أقرأُ: ${Array.from({ length: n }, (_, i) => AR((i + 1) * k)).join('، ') || '٠'}<br><b>${MXM(n, k)} = ${AR(n * k)}</b></div>`; };
    $('button', el).onclick = show; show();
  };
}
/** أداة: جدولُ الضرب التفاعليّ */
export function tableTool(hi = 0) {
  return el => {
    const draw = (r0, c0) => { let h = '<table class="tb" style="direction:ltr;font-size:.82em;margin:auto;cursor:pointer"><tr><th>×</th>' + Array.from({ length: 10 }, (_, i) => `<th>${AR(i + 1)}</th>`).join('') + '</tr>';
      for (let r = 1; r <= 10; r++) h += `<tr><th>${AR(r)}</th>` + Array.from({ length: 10 }, (_, i) => { const c = i + 1; const on = r === r0 && c === c0, line = (r === r0 && c <= c0) || (c === c0 && r <= r0) || (!r0 && hi && (r === hi || c === hi)); return `<td data-r="${r}" data-c="${c}" style="${on ? 'background:#f08a24;color:#fff;font-weight:bold' : line ? 'background:#fff3a6' : ''}">${AR(r * c)}</td>`; }).join('') + '</tr>';
      el.innerHTML = h + '</table>' + `<div class="keybox">${r0 ? `${MXM(r0, c0)} = <b>${AR(r0 * c0)}</b> — وكذلك ${MXM(c0, r0)} = ${AR(r0 * c0)}` : 'اضغطْ أيَّ خليّةٍ لترى حقيقةَ الضرب: أجدُ الصفَّ والعمود، ثم ألتقي في ناتجِ الضرب.'}</div>`;
      el.querySelectorAll('td').forEach(td => td.onclick = () => draw(+td.dataset.r, +td.dataset.c)); };
    draw(0, 0);
  };
}
/** لعبة: حقائق الضرب السريعة */
export function factGame(nums = [2, 4, 5, 10, 0, 1], star) {
  return el => { let score = 0, n = 0, t0 = 0;
    const next = () => { if (n >= 10) { const s = Math.round((Date.now() - t0) / 1000); if (score >= 8 && star) star(2); el.innerHTML = `<div class="keybox">أجبتَ إجابةً صحيحةً عن <b>${AR(score)}</b> من ١٠ في ${AR(s)} ثانية ${score >= 8 ? '🏆' : ''}</div><button class="btn">🔁 العبْ مجدّدًا</button>`; $('button', el).onclick = () => { score = 0; n = 0; t0 = Date.now(); next(); }; return; }
      const a = nums[rnd(0, nums.length - 1)], b = rnd(0, 10), v = a * b; const opts = [...new Set([v, v + a, Math.abs(v - a), v + 1, a + b])].slice(0, 4).sort((x, y) => x - y);
      el.innerHTML = `<div class="meta">السؤال ${AR(n + 1)} من ١٠ · الصحيحة: ${AR(score)}</div><p class="big" style="text-align:center">${Math.random() < .5 ? MXM(a, b) : MXM(b, a)} = ؟</p><div class="row c">${opts.map(x => `<button class="btn" data-v="${x}">${AR(x)}</button>`).join('')}</div>`;
      el.querySelectorAll('[data-v]').forEach(btn => btn.onclick = () => { if (+btn.dataset.v === v) score++; n++; next(); }); };
    el.innerHTML = '<div class="row c"><button class="btn">▶️ ابدأ اللعبة</button></div>'; $('button', el).onclick = () => { t0 = Date.now(); next(); }; };
}
export { T2 };
