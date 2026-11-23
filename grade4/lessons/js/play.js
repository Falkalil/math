// الألعابُ التفاعليّة، وأسئلةُ نافس، وأدواتُ الصفّ
import { AR, fmt, pick, shuf } from './mathkit.js';
import { $, $$, store, star, toast, ansText } from './engine.js';
import { fr } from './algebra.js';
import { NAFES, DOMAINS } from './nafes.js';
import { CHAPTERS } from './toc.js';

const DIG = '٠١٢٣٤٥٦٧٨٩';
const arDig = s => s.replace(/(\d)\.(\d)/g, '$1,$2').replace(/\d/g, d => DIG[d]);
/** نصُّ سؤالٍ مكتوبٍ بالأرقامِ اللاتينيّة ← عرضٌ عربيّ (كسور، أسس، فاصلة عشريّة) */
export function nf(s) {
  s = String(s)
    .replace(/(\d+) (\d+)\/(\d+)/g, (_, w, n, d) => `<span class="mxd"><b class="w">${AR(w)}</b>${fr(n, d)}</span>`)
    .replace(/(\d+)\/(\d+)/g, (_, n, d) => fr(n, d))
    .replace(/([^\s<>])\^(\d+)/g, '$1<sup>$2</sup>');
  return s.split(/(<[^>]+>)/).map(p => p.startsWith('<') ? p : arDig(p)).join('');
}
const tblH = rows => `<table class="tb nft">${rows.map((r, i) => `<tr>${r.map(c => i === 0 || c === r[0] ? `<th>${nf(c)}</th>` : `<td>${nf(c)}</td>`).join('')}</tr>`).join('')}</table>`;
const fromNafes = q => ({ q: nf(q[0]) + (q[4] ? tblH(q[4]) : ''), opts: q[1].map(nf), a: q[2], e: nf(q[3]), nafes: 1 });

/* ═════════ أصوات خفيفة ═════════ */
let AC; const muted = () => store.get('mute', false);
export function beep(f = 660, d = .12, type = 'sine', v = .15) { if (muted()) return; try { AC ||= new (window.AudioContext || window.webkitAudioContext)(); const o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.value = f; g.gain.value = v; g.gain.exponentialRampToValueAtTime(.001, AC.currentTime + d); o.connect(g).connect(AC.destination); o.start(); o.stop(AC.currentTime + d); } catch (e) {} }
const good = () => { beep(660, .1); setTimeout(() => beep(880, .15), 90); };
const bad = () => beep(180, .25, 'square', .08);
const fanfare = () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, .18, 'triangle'), i * 130));

/* ═════════ تحويلُ مسائلِ الدرسِ إلى اختيارٍ من متعدّد ═════════ */
const fracParse = s => { s = String(s).trim(); let m = s.match(/^(\d+)\s+(\d+)\/(\d+)$/); if (m) return { w: +m[1], n: +m[2], d: +m[3] }; m = s.match(/^(\d+)\/(\d+)$/); if (m) return { w: 0, n: +m[1], d: +m[2] }; if (/^\d+$/.test(s)) return { w: +s, n: 0, d: 1 }; return null; };
const fracHTML = f => f.n === 0 ? AR(f.w) : f.w ? `<span class="mxd"><b class="w">${AR(f.w)}</b>${fr(f.n, f.d)}</span>` : fr(f.n, f.d);
const val = f => f.w + f.n / f.d;
function numDistract(v, P) {
  const out = new Set(), dec = (String(v).split('.')[1] || '').length, u = Math.pow(10, -Math.max(dec, 0));
  (P.mistakes || []).forEach(([w]) => typeof w === 'number' && out.add(w));
  const c = shuf([v + u, v - u, v * 10, v / 10, v + 10 * u, v - 10 * u, v + 2 * u, v * 2, v + 1, v - 1, Math.round(v / 10) * 10 + 10]);
  for (const x of c) { if (out.size >= 6) break; if (x >= 0 || v < 0) out.add(Math.round(x * 1e6) / 1e6); }
  out.delete(v); return [...out].filter(x => !Number.isInteger(v) || Number.isInteger(x));
}
export function toMCQ(P) {
  if (!P || (P.html && !P.htmlOpt) || P.chart || P.seq || !P.ans) return null;
  const A = P.ans, unit = A.unit ? ' ' + A.unit : '';
  if (A.type === 'mcq' || A.type === 'choice') {
    if (!A.opts || A.opts.length < 2) return null;
    const wrong = shuf(A.opts.map((o, i) => i).filter(i => i !== A.v)).slice(0, 3), ids = shuf([A.v, ...wrong]);
    return { q: P.text, opts: ids.map(i => A.opts[i]), a: ids.indexOf(A.v) };
  }
  if (A.type === 'num') {
    const ds = numDistract(A.v, P).map(x => fmt(x) + unit).filter((s, i, a) => a.indexOf(s) === i && s !== fmt(A.v) + unit).slice(0, 3);
    if (ds.length < 3) return null; const opts = shuf([fmt(A.v) + unit, ...ds]);
    return { q: P.text, opts, a: opts.indexOf(fmt(A.v) + unit) };
  }
  if (A.type === 'frac') {
    const f = fracParse(A.v); if (!f) return null;
    const imp = { w: 0, n: f.w * f.d + f.n, d: f.d }, cands = [];
    (P.mistakes || []).forEach(([w]) => { const g = fracParse(w); g && cands.push(g); });
    if (f.w && f.n) cands.push({ w: f.w, n: f.n + 1, d: f.d }, { w: f.w + 1, n: f.n, d: f.d }, { w: f.n, n: f.w < f.d ? f.w : 1, d: f.d }, { w: 0, n: f.w + f.n, d: f.d });
    else if (f.n) cands.push({ w: 0, n: f.d, d: f.n }, { w: 0, n: f.n + 1, d: f.d }, { w: 0, n: f.n, d: f.d + 1 }, { w: 0, n: f.n * 2, d: f.d * 2 + 1 }, { w: 0, n: Math.max(1, f.n - 1), d: f.d });
    else cands.push({ w: f.w + 1, n: 0, d: 1 }, { w: Math.max(0, f.w - 1), n: 0, d: 1 }, { w: f.w * 10, n: 0, d: 1 });
    if (A.form === 'improper' || (!f.w && f.n > f.d)) cands.push({ w: 0, n: imp.n + 1, d: f.d });
    const right = fracHTML(f), seen = new Set([right]), ds = [];
    for (const g of shuf(cands)) { if (!g.d || g.n < 0) continue; if (Math.abs(val(g) - val(f)) < 1e-9) continue; const h = fracHTML(g); if (!seen.has(h)) { seen.add(h); ds.push(h); } if (ds.length === 3) break; }
    if (ds.length < 3) return null; const opts = shuf([right, ...ds]);
    return { q: P.text, opts, a: opts.indexOf(right) };
  }
  return null;
}
/** مُولِّدُ أسئلةٍ لدرس: مسائلُ المولّدات (إن أمكن تحويلُها) + أسئلةُ نافس */
export function makePool(U, CH, ids) {
  const nq = [].concat(...(ids || []).map(i => NAFES[i] || [])).map(fromNafes);
  const gens = (U && U.gens || []).filter(k => { for (let i = 0; i < 6; i++) { try { if (toMCQ(CH.gens[k](store.get('level', 1)))) return true; } catch (e) {} } return false; });
  if (!nq.length && !gens.length) return null;
  let bag = [];
  return () => {
    if (gens.length && (!nq.length || Math.random() < .65)) for (let i = 0; i < 12; i++) { try { const m = toMCQ(CH.gens[pick(gens)](store.get('level', 1))); if (m) return m; } catch (e) {} }
    if (!bag.length) bag = shuf(nq); return bag.pop() || null;
  };
}

/* ═════════ تبويبُ «نافس» ═════════ */
export function tabNafes(el, ids, opt = {}) {
  const all = [].concat(...ids.map(i => (NAFES[i] || []).map(q => [i, q])));
  const isTest = !!opt.test, N = isTest ? Math.min(10, all.length) : all.length;
  el.innerHTML = `<div class="card nfhead"><h2>🎯 ${isTest ? 'نموذجُ اختبارِ نافس' : 'أسئلةٌ على نمطِ نافس'}</h2>
    <p class="meta">${isTest ? `${AR(N)} أسئلةٍ عشوائيّةٍ من دروسِ الفصل، بوقتٍ محدّد، ثم تقريرٌ بنتيجتِك ونقاطِ القوّةِ والضعف.` : 'أسئلةُ اختيارٍ من متعدّدٍ تحاكي أسئلةَ الاختبارِ الوطنيّ «نافس»، مع شرحِ الحلّ.'}</p>
    <div class="nfmodes">${isTest ? '' : '<button class="btn" data-m="learn">📘 تدرّبْ مع الشرح</button>'}<button class="btn ${isTest ? '' : 's'}" data-m="exam">⏱️ اختبارٌ مؤقّت</button></div>
    <p class="meta nfdom">المجال: <b>${[...new Set(ids.map(i => DOMAINS[+String(i)[0]] || ''))].filter(Boolean).join('، ')}</b></p></div><div id="nfq"></div>`;
  const host = $('#nfq', el);
  $$('.nfmodes button', el).forEach(b => b.onclick = () => run(b.dataset.m));
  function run(mode) {
    const list = shuf(all).slice(0, N).map(([id, q]) => ({ id, ...fromNafes(q), order: shuf([0, 1, 2, 3]) }));
    const ans = new Array(list.length).fill(-1); let i = 0, t0 = Date.now(), timer = null;
    const limit = list.length * 90;
    const draw = () => {
      const Q = list[i], done = ans[i] >= 0, learn = mode === 'learn';
      host.innerHTML = `<div class="card nfcard"><div class="nfbar"><span class="pill">سؤال ${AR(i + 1)} من ${AR(list.length)}</span>${mode === 'exam' ? '<span class="pill py" id="nfT">⏱️</span>' : ''}</div>
        <div class="nfprog"><i style="width:${(i / list.length) * 100}%"></i></div>
        <div class="nfq">${Q.q}</div><div class="opts nfo">${Q.order.map((k, j) => `<button data-k="${k}" class="${done && (learn || false) ? (k === Q.a ? 'ok' : k === ans[i] ? 'no' : '') : ans[i] === k ? 'sel' : ''}"><b class="nfl">${'أبجد'[j]}</b> ${Q.opts[k]}</button>`).join('')}</div>
        ${done && learn ? `<div class="nfe ${ans[i] === Q.a ? 'ok' : 'no'}"><b>${ans[i] === Q.a ? '✓ إجابةٌ صحيحة!' : '✗ الإجابةُ الصحيحة: ' + Q.opts[Q.a]}</b><br>${Q.e}</div>` : ''}
        <div class="row c">${i > 0 && mode === 'exam' ? '<button class="btn s sm" data-a="prev">→ السابق</button>' : ''}${(done || mode === 'exam') ? `<button class="btn sm" data-a="next">${i < list.length - 1 ? 'التالي ←' : mode === 'exam' ? 'إنهاءُ الاختبار ✓' : 'النتيجة ←'}</button>` : ''}</div></div>`;
      $$('.nfo button', host).forEach(b => b.onclick = () => { if (learn && done) return; ans[i] = +b.dataset.k; if (learn) { ans[i] === Q.a ? good() : bad(); } draw(); });
      const nx = $('[data-a="next"]', host); if (nx) nx.onclick = () => { if (i < list.length - 1) { i++; draw(); } else finish(); };
      const pv = $('[data-a="prev"]', host); if (pv) pv.onclick = () => { i--; draw(); };
      tick();
    };
    const tick = () => { const e = $('#nfT', host); if (!e) return; const left = Math.max(0, limit - Math.floor((Date.now() - t0) / 1000)); e.textContent = '⏱️ ' + AR(Math.floor(left / 60)) + ':' + AR(String(left % 60).padStart(2, '0')); if (!left) finish(); };
    if (mode === 'exam') timer = setInterval(tick, 1000);
    function finish() {
      clearInterval(timer); const ok = list.filter((Q, k) => ans[k] === Q.a).length, pct = Math.round(ok / list.length * 100);
      const by = {}; list.forEach((Q, k) => { (by[Q.id] ||= [0, 0])[1]++; if (ans[k] === Q.a) by[Q.id][0]++; });
      const lvl = pct >= 90 ? ['🏆', 'متقدّم', '#2f8f6a'] : pct >= 70 ? ['🥇', 'متمكّن', '#3a7ae0'] : pct >= 50 ? ['🙂', 'مقارب للتمكّن', '#e0a21a'] : ['💪', 'يحتاجُ إلى دعم', '#c8102e'];
      const tit = id => { for (const c of CHAPTERS) for (const u of c.units) if (u.id === id) return u.t; return id; };
      host.innerHTML = `<div class="card nfres"><div class="big" style="color:${lvl[2]}">${lvl[0]} ${AR(ok)} / ${AR(list.length)}</div><div class="pct" style="--p:${pct};--c:${lvl[2]}"><b>${AR(pct)}٪</b></div><p><b>المستوى: ${lvl[1]}</b></p>
        ${isTest ? `<h3>نتيجتُك في كلِّ درس</h3>${Object.entries(by).map(([id, [a, b]]) => `<div class="nfl2"><a href="#/u/${id}/nafes">${AR(id)} ${tit(id)}</a><span class="${a === b ? 'ok' : a ? 'mid' : 'no'}">${AR(a)}/${AR(b)}</span></div>`).join('')}` : ''}
        <h3>مراجعةُ الإجابات</h3>${list.map((Q, k) => `<details class="nfrev ${ans[k] === Q.a ? 'ok' : 'no'}"><summary>${ans[k] === Q.a ? '✓' : '✗'} سؤال ${AR(k + 1)}</summary><div>${Q.q}<p><b>الإجابة الصحيحة:</b> ${Q.opts[Q.a]}${ans[k] >= 0 && ans[k] !== Q.a ? `<br><b>إجابتك:</b> ${Q.opts[ans[k]]}` : ans[k] < 0 ? '<br><b>لم تُجب.</b>' : ''}</p><p class="meta">${Q.e}</p></div></details>`).join('')}
        <div class="row c"><button class="btn" data-a="again">🔁 أعِدِ المحاولة</button></div></div>`;
      $('[data-a="again"]', host).onclick = () => run(mode);
      if (pct >= 80) { fanfare(); star(isTest ? 5 : 2, isTest ? 'أحسنتَ في نموذجِ نافس!' : 'إتقانُ أسئلةِ نافس!'); }
      const best = store.get('nafes', {}); const key = ids.join('|'); best[key] = Math.max(best[key] || 0, pct); store.set('nafes', best);
      window.scrollTo(0, 0);
    }
    draw(); window.scrollTo(0, el.offsetTop - 60);
  }
  if (isTest) {} // يبدأُ المستخدمُ بالضغط
}
export const hasNafes = id => !!NAFES[id];
export const chapterNafesIds = n => (CHAPTERS.find(c => c.n === n) || { units: [] }).units.map(u => u.id).filter(hasNafes);

/* ═════════ تبويبُ الألعاب ═════════ */
const GAMES = [
  ['race', '🏁', 'سباقُ الزمن', 'أجبْ عن أكبرِ عددٍ من الأسئلةِ في ٦٠ ثانية'],
  ['balloon', '🎈', 'فرقعةُ البالونات', 'افرقعِ البالونَ الذي يحملُ الإجابةَ الصحيحةَ قبلَ أن يطير'],
  ['tug', '🪢', 'شدُّ الحبل', 'تحدٍّ بينَ فريقين على السبّورة: الأسرعُ يشدُّ الحبل'],
  ['tf', '✅', 'صحّ أم خطأ', 'قرّرْ بسرعة: هل الإجابةُ المعروضةُ صحيحة؟'],
  ['climb', '🧗', 'تسلّقُ القمّة', '١٠ درجات… كلُّ إجابةٍ صحيحةٍ ترفعُك درجة، والخطأُ يُنزلُك'],
];
export function tabGames(el, gen, key) {
  const best = store.get('gbest', {});
  el.innerHTML = `<div class="card"><h2>🎮 ألعابُ الدرس</h2><p class="meta">ألعابٌ أسئلتُها من مسائلِ هذا الدرسِ ونماذجِ نافس — تتغيّرُ في كلِّ مرّة. مناسبةٌ للعرضِ على السبّورةِ الذكيّة.</p>
    <div class="ggrid">${GAMES.map(([k, i, t, d]) => `<button class="gcard g-${k}" data-g="${k}"><span class="gi">${i}</span><b>${t}</b><small>${d}</small>${best[key + ':' + k] ? `<em>🏅 أفضلُ نتيجة: ${AR(best[key + ':' + k])}</em>` : ''}</button>`).join('')}</div>
    <div class="row c"><button class="btn s sm" data-a="tools">🎡 أدواتُ الصفّ (العجلةُ والاختيارُ العشوائيّ)</button></div></div>`;
  $$('.gcard', el).forEach(b => b.onclick = () => playGame(b.dataset.g, gen, key, () => tabGames(el, gen, key)));
  $('[data-a="tools"]', el).onclick = () => openTools(gen);
}
function stage(title, onClose) {
  const d = document.createElement('div'); d.className = 'gstage'; d.innerHTML = `<div class="ghead"><b>${title}</b><span class="gsc"></span><button class="gm" title="الصوت">${muted() ? '🔇' : '🔊'}</button><button class="gx" title="إغلاق">✕</button></div><div class="gbody"></div>`;
  document.body.appendChild(d); document.body.classList.add('gopen');
  const close = () => { d.remove(); document.body.classList.remove('gopen'); d._stop && d._stop(); onClose && onClose(); };
  $('.gx', d).onclick = close; $('.gm', d).onclick = e => { store.set('mute', !muted()); e.target.textContent = muted() ? '🔇' : '🔊'; };
  return { d, body: $('.gbody', d), sc: $('.gsc', d), close };
}
function saveBest(key, g, v) { const b = store.get('gbest', {}); if ((b[key + ':' + g] || 0) < v) { b[key + ':' + g] = v; store.set('gbest', b); return true; } return false; }
function endScreen(S, emoji, msg, again) { fanfare(); S.body.innerHTML = `<div class="gend"><div class="ge">${emoji}</div><h2>${msg}</h2><div class="row c"><button class="btn" data-a="again">🔁 العبْ مرّةً أخرى</button><button class="btn s" data-a="close">إغلاق</button></div></div>`; confetti(S.d); $('[data-a="again"]', S.body).onclick = again; $('[data-a="close"]', S.body).onclick = S.close; }
function confetti(host) { const c = document.createElement('div'); c.className = 'confetti'; c.innerHTML = Array.from({ length: 60 }, () => `<i style="left:${Math.random() * 100}%;background:hsl(${Math.random() * 360},85%,60%);animation-delay:${Math.random() * .8}s;animation-duration:${1.8 + Math.random() * 1.5}s"></i>`).join(''); host.appendChild(c); setTimeout(() => c.remove(), 4000); }
const next = gen => { for (let i = 0; i < 5; i++) { const q = gen(); if (q) return q; } return null; };

function playGame(g, gen, key, refresh) {
  const G = GAMES.find(x => x[0] === g); const S = stage(G[1] + ' ' + G[2], refresh);
  ({ race, balloon, tug, tf, climb })[g](S, gen, key, () => { S.d._stop && S.d._stop(); playGame(g, gen, key, refresh); S.d.remove(); });
}
function qBlock(Q) { return `<div class="gq">${Q.q}</div>`; }

function race(S, gen, key, again) {
  let score = 0, t = 60, streak = 0;
  const iv = setInterval(() => { t--; upd(); if (t <= 0) end(); }, 1000); S.d._stop = () => clearInterval(iv);
  const upd = () => { S.sc.innerHTML = `⏱️ ${AR(t)} · ⭐ ${AR(score)}${streak > 2 ? ' · 🔥' + AR(streak) : ''}`; const b = $('.gtime i', S.body); if (b) b.style.width = (t / 60 * 100) + '%'; };
  const ask = () => { const Q = next(gen); if (!Q) return end(); S.body.innerHTML = `<div class="gtime"><i></i></div>${qBlock(Q)}<div class="gopts">${Q.opts.map((o, i) => `<button data-i="${i}">${o}</button>`).join('')}</div>`; upd();
    $$('.gopts button', S.body).forEach(b => b.onclick = () => { const ok = +b.dataset.i === Q.a; b.classList.add(ok ? 'ok' : 'no'); if (ok) { score++; streak++; good(); } else { streak = 0; bad(); $$('.gopts button', S.body)[Q.a].classList.add('ok'); } $$('.gopts button', S.body).forEach(x => x.disabled = true); setTimeout(ask, ok ? 350 : 1100); }); };
  const end = () => { clearInterval(iv); const nb = saveBest(key, 'race', score); if (score >= 8) star(2, 'سباقٌ رائع!'); endScreen(S, score >= 10 ? '🏆' : score >= 5 ? '🥇' : '👏', `${AR(score)} إجاباتٍ صحيحة${nb && score ? ' — رقمٌ قياسيٌّ جديد!' : ''}`, again); };
  ask();
}

function balloon(S, gen, key, again) {
  let score = 0, lives = 3, raf, Q, items = [];
  const upd = () => S.sc.innerHTML = `${'❤️'.repeat(lives)}${'🤍'.repeat(3 - lives)} · ⭐ ${AR(score)}`;
  S.body.innerHTML = '<div class="bq"></div><div class="bsky"></div>'; const sky = $('.bsky', S.body);
  const cols = ['#e8503a', '#3a7ae0', '#2f8f6a', '#c03ad8', '#e0a21a'];
  const round = () => {
    cancelAnimationFrame(raf); Q = next(gen); if (!Q) return end(); $('.bq', S.body).innerHTML = qBlock(Q); sky.innerHTML = '';
    const H = sky.clientHeight, W = sky.clientWidth, n = Q.opts.length, sp = .55 + score * .04;
    items = shuf(Q.opts.map((o, i) => i)).map((i, k) => { const b = document.createElement('button'); b.className = 'balloon'; b.style.setProperty('--c', cols[(i + score) % cols.length]); b.innerHTML = `<span>${Q.opts[i]}</span>`; sky.appendChild(b);
      const it = { b, i, x: (k + .5) / n * W, y: H + 40 + Math.random() * 120, v: sp * (.8 + Math.random() * .5), w: Math.random() * 6 }; b.onclick = () => hit(it); return it; });
    let last = performance.now();
    const step = now => { const dt = Math.min(50, now - last) / 16; last = now; let lost = false;
      for (const it of items) { if (it.gone) continue; it.y -= it.v * dt; it.b.style.transform = `translate(${it.x - 60 + Math.sin((it.y + it.w * 40) / 40) * 10}px, ${it.y}px)`; if (it.y < -150) { it.gone = 1; it.b.remove(); if (it.i === Q.a) lost = true; } }
      if (lost) { lives--; bad(); upd(); toast('✗ طارَ البالونُ الصحيح: ' + Q.opts[Q.a]); if (lives <= 0) return end(); return setTimeout(round, 900); }
      raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  };
  const hit = it => { if (it.gone) return; if (it.i === Q.a) { it.b.classList.add('pop'); score++; good(); upd(); items.forEach(x => x.gone = 1); cancelAnimationFrame(raf); setTimeout(round, 500); } else { it.b.classList.add('shake'); bad(); it.gone = 1; setTimeout(() => it.b.remove(), 400); lives--; upd(); if (lives <= 0) { cancelAnimationFrame(raf); end(); } } };
  const end = () => { cancelAnimationFrame(raf); const nb = saveBest(key, 'balloon', score); if (score >= 8) star(2, 'بالوناتٌ كثيرة!'); endScreen(S, score >= 10 ? '🎉' : '🎈', `فرقعتَ ${AR(score)} بالونًا${nb && score ? ' — رقمٌ قياسيٌّ جديد!' : ''}`, again); };
  S.d._stop = () => cancelAnimationFrame(raf); upd(); setTimeout(round, 50);
}

function tug(S, gen, key, again) {
  const names = store.get('teams', ['الفريق الأحمر', 'الفريق الأزرق']); let pos = 0, Q, lock = [0, 0], over = false; const WIN = 5;
  S.body.innerHTML = `<div class="tteams"><input value="${names[0]}" data-t="0"><span>ضدّ</span><input value="${names[1]}" data-t="1"></div><div class="rope"><div class="rline"></div><div class="rknot">🎀</div><span class="rr">🧍‍♂️🧍‍♂️</span><span class="rl">🧍‍♂️🧍‍♂️</span></div><div class="tq"></div><div class="tsides"><div class="tside t0"></div><div class="tside t1"></div></div>`;
  $$('.tteams input', S.body).forEach(inp => inp.onchange = () => { names[+inp.dataset.t] = inp.value || names[+inp.dataset.t]; store.set('teams', names); });
  const knot = () => { $('.rknot', S.body).style.transform = `translateX(${pos * 9}%)`; $('.rline', S.body).style.transform = `translateX(${pos * 9}%)`; S.sc.textContent = `${names[0]} ${AR(Math.max(0, pos))} · ${AR(Math.max(0, -pos))} ${names[1]}`; };
  const round = () => { if (over) return; Q = next(gen); if (!Q) return; lock = [0, 0]; $('.tq', S.body).innerHTML = qBlock(Q);
    [0, 1].forEach(t => { const ord = shuf(Q.opts.map((o, i) => i)); const h = $('.t' + t, S.body); h.innerHTML = `<b class="tn">${names[t]}</b><div class="gopts">${ord.map(i => `<button data-i="${i}">${Q.opts[i]}</button>`).join('')}</div>`;
      $$('button', h).forEach(b => b.onclick = () => { if (lock[t] || over) return; if (+b.dataset.i === Q.a) { b.classList.add('ok'); good(); pos += t === 0 ? 1 : -1; knot(); lock = [1, 1]; $$('.tside button', S.body).forEach(x => x.disabled = true);
        if (Math.abs(pos) >= WIN) { over = true; setTimeout(() => endScreen(S, '🏆', `فازَ ${names[pos > 0 ? 0 : 1]}!`, again), 700); } else setTimeout(round, 900); }
        else { b.classList.add('no'); bad(); lock[t] = 1; $$('button', h).forEach(x => x.disabled = true); if (lock[0] && lock[1]) setTimeout(round, 1200); } }); }); };
  knot(); round();
}

function tf(S, gen, key, again) {
  let k = 0, score = 0, tm; const R = 10;
  const ask = () => { clearInterval(tm); if (k >= R) return end(); const Q = next(gen); if (!Q) return end(); k++;
    const truth = Math.random() < .5, shown = truth ? Q.a : pick(Q.opts.map((o, i) => i).filter(i => i !== Q.a));
    S.body.innerHTML = `<div class="gtime"><i></i></div><div class="tfk">${AR(k)} / ${AR(R)}</div>${qBlock(Q)}<div class="tfa">الإجابة: <b>${Q.opts[shown]}</b></div><div class="tfb"><button class="tok" data-v="1">✓ صحيحة</button><button class="tno" data-v="0">✗ خطأ</button></div>`;
    let t = 100; tm = setInterval(() => { t -= 1.25; $('.gtime i', S.body).style.width = t + '%'; if (t <= 0) { clearInterval(tm); bad(); toast('انتهى الوقت!'); setTimeout(ask, 700); } }, 100);
    $$('.tfb button', S.body).forEach(b => b.onclick = () => { clearInterval(tm); const ok = (+b.dataset.v === 1) === truth; b.classList.add(ok ? 'ok' : 'no'); if (ok) { score++; good(); } else { bad(); $('.tfa', S.body).innerHTML += `<div class="meta">الإجابةُ الصحيحة: ${Q.opts[Q.a]}</div>`; } S.sc.textContent = '⭐ ' + AR(score); $$('.tfb button', S.body).forEach(x => x.disabled = true); setTimeout(ask, ok ? 600 : 1600); }); };
  const end = () => { clearInterval(tm); saveBest(key, 'tf', score); if (score >= 9) star(2, 'صحّ أم خطأ: ممتاز!'); endScreen(S, score >= 9 ? '🏆' : score >= 6 ? '👍' : '💪', `${AR(score)} من ${AR(R)}`, again); };
  S.d._stop = () => clearInterval(tm); S.sc.textContent = '⭐ ٠'; ask();
}

function climb(S, gen, key, again) {
  let lv = 0, moves = 0; const TOP = 10;
  const draw = Q => { S.body.innerHTML = `<div class="mtn"><div class="steps">${Array.from({ length: TOP + 1 }, (_, i) => `<i class="${i === TOP ? 'top' : ''} ${i <= lv ? 'on' : ''}">${i === TOP ? '🚩' : AR(i)}</i>`).join('')}</div><div class="climber" style="bottom:${lv / TOP * 88}%">🧗</div></div>${qBlock(Q)}<div class="gopts">${Q.opts.map((o, i) => `<button data-i="${i}">${o}</button>`).join('')}</div>`;
    S.sc.textContent = `الدرجة ${AR(lv)} من ${AR(TOP)} · المحاولات ${AR(moves)}`;
    $$('.gopts button', S.body).forEach(b => b.onclick = () => { moves++; const ok = +b.dataset.i === Q.a; b.classList.add(ok ? 'ok' : 'no'); $$('.gopts button', S.body).forEach(x => x.disabled = true); if (ok) { lv++; good(); } else { lv = Math.max(0, lv - 1); bad(); $$('.gopts button', S.body)[Q.a].classList.add('ok'); }
      if (lv >= TOP) { saveBest(key, 'climb', TOP); star(3, 'وصلتَ إلى القمّة!'); setTimeout(() => endScreen(S, '🏔️', `وصلتَ إلى القمّةِ في ${AR(moves)} محاولة!`, again), 500); } else setTimeout(() => ask(), ok ? 450 : 1300); }); };
  const ask = () => { const Q = next(gen); if (Q) draw(Q); };
  ask();
}

/* ═════════ أدواتُ الصفّ ═════════ */
const getNames = () => store.get('names', []);
const pool = () => { const n = getNames(); return n.length ? n : Array.from({ length: store.get('ncount', 25) }, (_, i) => 'الطالب ' + AR(i + 1)); };
export function openTools(gen, standalone) {
  const S = stage('🎡 أدواتُ الصفّ', null); if (standalone) $('.gx', S.d).onclick = () => { if (window.parent !== window) parent.postMessage({ mb: 'close' }, '*'); else history.back(); };
  const tabs = [['wheel', '🎡 العجلة'], ['pick', '🎲 اختيارٌ عشوائيّ'], ['groups', '👥 المجموعات'], ['timer', '⏱️ المؤقّت'], ['names', '📝 الأسماء']];
  if (gen) tabs.splice(2, 0, ['ask', '❓ سؤالٌ عشوائيّ']);
  S.body.innerHTML = `<div class="ttabs">${tabs.map(([k, t]) => `<button data-k="${k}">${t}</button>`).join('')}</div><div class="tbody"></div>`;
  const B = $('.tbody', S.body); let stop = () => {};
  const show = k => { stop(); stop = () => {}; $$('.ttabs button', S.body).forEach(b => b.classList.toggle('on', b.dataset.k === k)); store.set('ttab', k); stop = ({ wheel, pick: picker, groups, timer, names: namesT, ask: askT })[k](B, gen) || (() => {}); };
  $$('.ttabs button', S.body).forEach(b => b.onclick = () => show(b.dataset.k)); S.d._stop = () => stop();
  show(getNames().length || store.get('ttab') !== 'names' ? (tabs.some(t => t[0] === store.get('ttab')) ? store.get('ttab') : 'wheel') : 'names');
}
function winnerPop(B, name, extra = '') { const w = document.createElement('div'); w.className = 'winner'; w.innerHTML = `<div><small>🎉 الاختيارُ هو</small><b>${name}</b>${extra}<button class="btn sm">حسنًا</button></div>`; B.appendChild(w); fanfare(); confetti(w); $('button', w).onclick = () => w.remove(); return w; }

function wheel(B) {
  let list = pool(), rem = store.get('wrem', true), used = [];
  B.innerHTML = `<div class="wwrap"><div class="wptr">▼</div><canvas width="640" height="640"></canvas><button class="wspin">لُفّ!</button></div>
    <div class="row c"><label class="chk"><input type="checkbox" ${rem ? 'checked' : ''}> استبعادُ من وقعَ عليه الاختيار</label><button class="btn s sm" data-a="reset">↺ إعادةُ الجميع</button></div><p class="meta c" id="wleft"></p>`;
  const cv = $('canvas', B), cx = cv.getContext('2d'); let ang = 0, spinning = false;
  const cols = ['#e8503a', '#f2a33a', '#f2d23a', '#5cc06a', '#3aa8d8', '#3a6ad8', '#8a4ad8', '#d84a9a'];
  const avail = () => list.filter(n => !used.includes(n));
  const draw = () => { const L = avail(), n = L.length, R = 310; cx.clearRect(0, 0, 640, 640); cx.save(); cx.translate(320, 320); cx.rotate(ang);
    L.forEach((name, i) => { const a0 = i / n * 2 * Math.PI, a1 = (i + 1) / n * 2 * Math.PI; cx.beginPath(); cx.moveTo(0, 0); cx.arc(0, 0, R, a0, a1); cx.fillStyle = cols[i % cols.length] + (n > 16 && i % 2 ? 'cc' : ''); cx.fill(); cx.strokeStyle = '#fff'; cx.lineWidth = 2; cx.stroke();
      cx.save(); cx.rotate((a0 + a1) / 2); cx.fillStyle = '#fff'; cx.font = `800 ${n > 30 ? 15 : n > 18 ? 19 : 24}px Tajawal, sans-serif`; cx.textAlign = 'right'; cx.textBaseline = 'middle'; cx.shadowColor = '#0006'; cx.shadowBlur = 3; cx.fillText(name.length > 16 ? name.slice(0, 15) + '…' : name, R - 16, 0); cx.restore(); });
    cx.restore(); cx.beginPath(); cx.arc(320, 320, 34, 0, 7); cx.fillStyle = '#fff'; cx.fill(); $('#wleft', B).textContent = `المتبقّي: ${AR(n)} من ${AR(list.length)}`; };
  const spin = () => { const L = avail(); if (spinning || !L.length) return; spinning = true; const n = L.length, k = Math.floor(Math.random() * n);
    const target = -Math.PI / 2 - (k + .5) / n * 2 * Math.PI, base = ang - (ang % (2 * Math.PI)), end = base + 2 * Math.PI * (6 + Math.floor(Math.random() * 3)) + ((target - base) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const st = ang, t0 = performance.now(), D = 4800; let lastSeg = -1;
    const f = now => { const p = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - p, 4); ang = st + (end - st) * e; draw(); const seg = Math.floor(((-(ang + Math.PI / 2)) / (2 * Math.PI) * n % n + n) % n); if (seg !== lastSeg) { lastSeg = seg; beep(1200, .03, 'square', .05); }
      if (p < 1) requestAnimationFrame(f); else { spinning = false; const name = L[k]; winnerPop(B, name); if ($('.chk input', B).checked) used.push(name); setTimeout(draw, 50); } };
    requestAnimationFrame(f); };
  $('.wspin', B).onclick = spin; cv.onclick = spin; $('.chk input', B).onchange = e => store.set('wrem', e.target.checked); $('[data-a="reset"]', B).onclick = () => { used = []; draw(); };
  draw();
}
function picker(B) {
  const list = pool(); let used = [];
  B.innerHTML = `<div class="pk"><div class="pkcard">؟</div></div><div class="row c"><span>عدد الطلاب:</span><select id="pkn">${[1, 2, 3, 4, 5].map(i => `<option>${AR(i)}</option>`).join('')}</select><button class="btn" data-a="go">🎲 اخترْ</button><button class="btn s sm" data-a="reset">↺</button></div><div class="pkres"></div>`;
  $('[data-a="reset"]', B).onclick = () => { used = []; $('.pkres', B).innerHTML = ''; };
  $('[data-a="go"]', B).onclick = () => { const k = $('#pkn', B).selectedIndex + 1; let av = list.filter(n => !used.includes(n)); if (av.length < k) { used = []; av = list.slice(); } const ch = shuf(av).slice(0, k); const c = $('.pkcard', B); let i = 0;
    const iv = setInterval(() => { c.textContent = pick(list); c.classList.toggle('fl'); beep(500 + i * 25, .04, 'square', .04); if (++i > 22) { clearInterval(iv); c.textContent = ch.join('، '); c.classList.add('win'); setTimeout(() => c.classList.remove('win'), 900); used.push(...ch); fanfare(); $('.pkres', B).innerHTML = `<p class="meta">اختيرَ سابقًا: ${used.map(n => `<span class="pill">${n}</span>`).join(' ')}</p>`; } }, 70 + i); };
}
function groups(B) {
  B.innerHTML = `<div class="row c"><span>عدد المجموعات:</span><select id="gn">${[2, 3, 4, 5, 6, 7, 8].map(i => `<option value="${i}" ${i === store.get('gcount', 4) ? 'selected' : ''}>${AR(i)}</option>`).join('')}</select><button class="btn" data-a="go">👥 وزّعِ الطلاب</button></div><div class="grps"></div>`;
  const cols = ['#e8503a', '#3a7ae0', '#2f8f6a', '#8a4ad8', '#e0a21a', '#d84a9a', '#3aa8a8', '#6a6455'];
  $('[data-a="go"]', B).onclick = () => { const k = +$('#gn', B).value; store.set('gcount', k); const L = shuf(pool()), G = Array.from({ length: k }, () => []); L.forEach((n, i) => G[i % k].push(n));
    $('.grps', B).innerHTML = G.map((g, i) => `<div class="grp" style="--c:${cols[i % cols.length]};animation-delay:${i * .08}s"><b>المجموعة ${AR(i + 1)}</b>${g.map(n => `<span>${n}</span>`).join('')}</div>`).join(''); good(); };
}
function timer(B) {
  let left = store.get('tsec', 120), run = false, iv;
  B.innerHTML = `<div class="tm"><div class="tmd">0:00</div><div class="row c">${[30, 60, 120, 180, 300, 600].map(s => `<button class="btn s sm" data-s="${s}">${s < 60 ? AR(s) + ' ث' : AR(s / 60) + ' د'}</button>`).join('')}</div><div class="row c"><button class="btn" data-a="go">▶ ابدأ</button><button class="btn s" data-a="reset">↺</button><button class="btn s sm" data-a="m">−١٠ث</button><button class="btn s sm" data-a="p">+١٠ث</button></div></div>`;
  let total = left; const d = $('.tmd', B);
  const show = () => { d.textContent = AR(Math.floor(left / 60)) + ':' + AR(String(left % 60).padStart(2, '0')); d.style.setProperty('--p', total ? left / total * 100 : 0); d.classList.toggle('low', left <= 10 && left > 0); };
  const toggle = () => { run = !run; $('[data-a="go"]', B).textContent = run ? '⏸ إيقاف' : '▶ ابدأ'; clearInterval(iv); if (run) iv = setInterval(() => { left--; if (left <= 5 && left > 0) beep(880, .08); show(); if (left <= 0) { clearInterval(iv); run = false; $('[data-a="go"]', B).textContent = '▶ ابدأ'; [0, 300, 600].forEach(t => setTimeout(() => beep(520, .35, 'triangle', .2), t)); d.classList.add('done'); setTimeout(() => d.classList.remove('done'), 3000); } }, 1000); };
  $$('[data-s]', B).forEach(b => b.onclick = () => { left = total = +b.dataset.s; store.set('tsec', left); show(); });
  $('[data-a="go"]', B).onclick = () => { if (left <= 0) left = total; toggle(); };
  $('[data-a="reset"]', B).onclick = () => { clearInterval(iv); run = false; left = total; $('[data-a="go"]', B).textContent = '▶ ابدأ'; show(); };
  $('[data-a="m"]', B).onclick = () => { left = Math.max(0, left - 10); show(); }; $('[data-a="p"]', B).onclick = () => { left += 10; total = Math.max(total, left); show(); };
  show(); return () => clearInterval(iv);
}
function askT(B, gen) {
  B.innerHTML = `<div class="row c"><button class="btn" data-a="go">❓ سؤالٌ جديد</button><button class="btn s" data-a="who">🎲 مَن يُجيب؟</button></div><div class="aq"></div>`;
  $('[data-a="go"]', B).onclick = () => { const Q = next(gen); if (!Q) return; $('.aq', B).innerHTML = `${qBlock(Q)}<div class="gopts">${Q.opts.map((o, i) => `<button data-i="${i}">${'أبجد'[i]}) ${o}</button>`).join('')}</div><div class="row c"><button class="btn s sm" data-a="rev">👁️ أظهرِ الإجابة</button></div>${Q.e ? `<div class="nfe ok" hidden>${Q.e}</div>` : ''}`;
    const rev = () => { $$('.aq .gopts button', B)[Q.a].classList.add('ok'); const e = $('.aq .nfe', B); if (e) e.hidden = false; };
    $$('.aq .gopts button', B).forEach(b => b.onclick = () => { if (+b.dataset.i === Q.a) good(); else { b.classList.add('no'); bad(); } rev(); }); $('[data-a="rev"]', B).onclick = rev; };
  $('[data-a="who"]', B).onclick = () => winnerPop(B, pick(pool()));
  $('[data-a="go"]', B).click();
}
function namesT(B) {
  B.innerHTML = `<div class="card nm"><h3>📝 أسماءُ طلابِ الفصل</h3><p class="meta">اكتبْ كلَّ اسمٍ في سطر (أو الصقِ القائمةَ من ملفِّ Excel). تُحفَظُ الأسماءُ على هذا الجهازِ فقط.</p>
    <textarea rows="10" placeholder="محمد&#10;عبدالله&#10;خالد">${getNames().join('\n')}</textarea>
    <div class="row"><button class="btn" data-a="save">💾 حفظ</button><button class="btn s sm" data-a="clr">مسحُ الأسماء</button></div>
    <p class="meta">أو استعملِ الأرقامَ بدلَ الأسماء: عددُ الطلاب <input type="number" min="2" max="60" value="${store.get('ncount', 25)}" id="ncount" style="width:70px"></p></div>`;
  $('[data-a="save"]', B).onclick = () => { const L = $('textarea', B).value.split(/\n|،|,/).map(s => s.trim()).filter(Boolean); store.set('names', [...new Set(L)]); store.set('ncount', Math.max(2, Math.min(60, +$('#ncount', B).value || 25))); toast(L.length ? `✓ حُفظ ${AR(L.length)} اسمًا` : '✓ ستُستعمَلُ الأرقام'); };
  $('[data-a="clr"]', B).onclick = () => { $('textarea', B).value = ''; store.set('names', []); toast('مُسحتِ الأسماء'); };
}
