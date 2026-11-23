// معملُ الرياضيّات: روليت، مسطرة، قطعُ العدّ، قطعُ دينز، الكسور — أدواتٌ تُسحَبُ فوقَ صفحاتِ الكتاب
const DIG = '٠١٢٣٤٥٦٧٨٩';
const AR = v => String(v).replace(/\./g, ',').replace(/\d/g, d => DIG[d]);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const COLORS = ['#e8503a', '#3a7ae0', '#f2c230', '#2f9f6a', '#9a4ad8', '#f28a3a', '#3ab8c8', '#d84a9a'];
let AC; const tick = (f = 1400, d = .03, v = .05) => { try { AC ||= new (window.AudioContext || window.webkitAudioContext)(); const o = AC.createOscillator(), g = AC.createGain(); o.type = 'square'; o.frequency.value = f; g.gain.value = v; g.gain.exponentialRampToValueAtTime(.001, AC.currentTime + d); o.connect(g).connect(AC.destination); o.start(); o.stop(AC.currentTime + d); } catch (e) {} };

export function initLab() {
  const layer = el('div', '', ''); layer.id = 'labLayer'; document.body.appendChild(layer);
  const trash = el('div', 'labTrash', '🗑️<small>اسحبْ هنا للحذف</small>'); document.body.appendChild(trash);
  const dock = el('div', '', `<button class="labHead" title="معمل الرياضيات"><span>🧪</span><b class="lf">معملُ<br>الرياضيّات</b><b class="ls">المعمل</b></button>
    <div class="labBtns">
      <button data-t="spin"><span>🎡</span>الروليت</button>
      <button data-t="ruler"><span>📏</span>المسطرة</button>
      <button data-t="count"><span>🔴</span>قطعُ العدّ</button>
      <button data-t="dienes"><span>🧊</span>قطعُ دينز</button>
      <button data-t="frac"><span>½</span>الكسور</button>
      <button data-t="clear" class="labClr"><span>🧹</span>مسحُ الكلّ</button>
    </div>`); dock.id = 'labDock'; document.body.appendChild(dock);
  const tray = el('div', '', ''); tray.id = 'labTray'; document.body.appendChild(tray);
  let open = localStorage.getItem('math3-lab') !== '0' && innerWidth > 700, z = 10, curTray = null;
  const setOpen = v => { open = v; dock.classList.toggle('open', v); try { localStorage.setItem('math3-lab', v ? '1' : '0'); } catch (e) {} if (!v) closeTray(); };
  dock.querySelector('.labHead').onclick = () => setOpen(!open);
  const closeTray = () => { tray.className = ''; tray.innerHTML = ''; curTray = null; dock.querySelectorAll('[data-t]').forEach(b => b.classList.remove('on')); };
  setOpen(open);
  dock.querySelectorAll('[data-t]').forEach(b => b.onclick = () => {
    const t = b.dataset.t; const mob = innerWidth <= 700; if (mob && t !== 'clear') dock.classList.remove('open');
    if (t === 'clear') { layer.innerHTML = ''; updDienes(); return; }
    if (t === 'spin') return spinner();
    if (t === 'ruler') return ruler();
    if (curTray === t) return closeTray();
    closeTray(); curTray = t; b.classList.add('on'); tray.className = 'open t-' + t;
    ({ count: trayCount, dienes: trayDienes, frac: trayFrac })[t]();
  });

  /* ── السحب العامّ ── */
  const center = () => { const r = document.getElementById('book')?.getBoundingClientRect(); return r && r.width ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: innerWidth / 2, y: innerHeight / 2 }; };
  function place(node, x, y) { node.style.left = x + 'px'; node.style.top = y + 'px'; node.style.zIndex = ++z; layer.appendChild(node); return node; }
  function draggable(node, opt = {}) {
    let sx, sy, ox, oy, moved, pid, lastTap = 0;
    const handle = opt.handle ? node.querySelector(opt.handle) : node;
    handle.addEventListener('pointerdown', e => {
      if (e.button > 0 || (opt.skip && e.target.closest(opt.skip))) return;
      e.preventDefault(); e.stopPropagation(); pid = e.pointerId; handle.setPointerCapture(pid);
      sx = e.clientX; sy = e.clientY; ox = node.offsetLeft; oy = node.offsetTop; moved = false; node.style.zIndex = ++z; node.classList.add('drag');
    });
    handle.addEventListener('pointermove', e => {
      if (e.pointerId !== pid) return; const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 4) return; moved = true;
      node.style.left = ox + dx + 'px'; node.style.top = oy + dy + 'px';
      if (!opt.noTrash) { trash.classList.add('show'); const r = trash.getBoundingClientRect(); trash.classList.toggle('hot', e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom); }
      opt.onMove && opt.onMove();
    });
    const up = e => {
      if (e.pointerId !== pid) return; pid = null; node.classList.remove('drag');
      if (trash.classList.contains('hot')) { node.remove(); opt.onRemove && opt.onRemove(); updDienes(); }
      trash.classList.remove('show', 'hot');
      if (!moved) { const now = Date.now(); if (now - lastTap < 350) { opt.onDouble && opt.onDouble(e); lastTap = 0; } else { lastTap = now; opt.onTap && opt.onTap(e); } }
      else opt.onDrop && opt.onDrop();
    };
    handle.addEventListener('pointerup', up); handle.addEventListener('pointercancel', up);
    return node;
  }
  // قطعةٌ من الدرج: نقرةٌ تضعُها في وسطِ الكتاب، والسحبُ يأخذُها مباشرة
  function trayPiece(btn, make, pos) {
    btn.addEventListener('pointerdown', e => {
      e.preventDefault(); const c = center(); const n = make(); const jitter = () => (Math.random() - .5) * 120;
      const P = pos ? pos(n) : null; place(n, P ? P.x : c.x + jitter() - 20, P ? P.y : c.y + jitter() - 20); updDienes();
      // ابدأ السحبَ فورًا من موضعِ الإصبع
      const w = n.offsetWidth, h = n.offsetHeight; let moved = false; const sx = e.clientX, sy = e.clientY;
      const mv = ev => { if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return; moved = true; n.style.left = ev.clientX - w / 2 + 'px'; n.style.top = ev.clientY - h / 2 + 'px'; };
      const up = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); };
      addEventListener('pointermove', mv); addEventListener('pointerup', up);
    });
  }
  const closeBtn = node => { const x = el('button', 'labX', '✕'); x.onclick = () => { node.remove(); updDienes(); }; x.addEventListener('pointerdown', e => e.stopPropagation()); node.appendChild(x); return x; };

  /* ── الروليت ── */
  function spinner() {
    const W = el('div', 'labW labSpin', `<div class="lwh">🎡 الروليت</div>
      <div class="spWrap"><svg viewBox="-110 -110 220 220"><g class="spS"></g><g class="spA"><polygon points="0,-88 7,-8 -7,-8" fill="#2b2117"/><circle r="11" fill="#2b2117"/><circle r="4" fill="#fff"/></g></svg></div>
      <div class="spRow"><label>الأجزاء <select class="spN">${[2, 3, 4, 5, 6, 8, 10].map(n => `<option ${n === 4 ? 'selected' : ''}>${AR(n)}</option>`).join('')}</select></label>
      <label>العناوين <select class="spL"><option value="n">أرقام</option><option value="c">ألوان</option></select></label></div>
      <button class="spGo">لُفّ ↻</button><div class="spRes"></div><table class="spTab"></table>`);
    closeBtn(W); const c = center(); place(W, innerWidth <= 700 ? innerWidth - 272 : Math.max(8, c.x - 380), Math.max(8, innerWidth <= 700 ? 60 : c.y - 220));
    draggable(W, { handle: '.lwh', noTrash: true });
    const S = W.querySelector('.spS'), A = W.querySelector('.spA'); let n = 4, ang = 0, busy = false, counts = [];
    const names = ['أحمر', 'أزرق', 'أصفر', 'أخضر', 'بنفسجي', 'برتقالي', 'سماوي', 'وردي', 'رمادي', 'بنّي'];
    const lab = i => W.querySelector('.spL').value === 'n' ? AR(i + 1) : names[i];
    const col = i => i < COLORS.length ? COLORS[i] : ['#8a8a8a', '#8a5a3a'][i - COLORS.length];
    const draw = () => { n = W.querySelector('.spN').selectedIndex; n = [2, 3, 4, 5, 6, 8, 10][n]; counts = new Array(n).fill(0); let s = '';
      for (let i = 0; i < n; i++) { const a0 = i / n * 2 * Math.PI - Math.PI / 2, a1 = (i + 1) / n * 2 * Math.PI - Math.PI / 2, R = 100, am = (a0 + a1) / 2;
        s += `<path d="M0 0 L${R * Math.cos(a0)} ${R * Math.sin(a0)} A${R} ${R} 0 0 1 ${R * Math.cos(a1)} ${R * Math.sin(a1)}Z" fill="${col(i)}" stroke="#fff" stroke-width="2"/><text x="${62 * Math.cos(am)}" y="${62 * Math.sin(am)}" text-anchor="middle" dominant-baseline="central" font-size="${n > 6 ? 13 : 17}" font-weight="800" fill="#fff">${lab(i)}</text>`; }
      S.innerHTML = s + '<circle r="100" fill="none" stroke="#2b2117" stroke-width="3"/>'; table(); W.querySelector('.spRes').textContent = ''; };
    const table = () => { const tot = counts.reduce((a, b) => a + b, 0); W.querySelector('.spTab').innerHTML = `<tr><th>الناتج</th>${counts.map((_, i) => `<th style="color:${col(i)}">${lab(i)}</th>`).join('')}</tr><tr><th>التكرار</th>${counts.map(v => `<td>${AR(v)}</td>`).join('')}</tr>` + (tot ? `<tr><th>عدد الدورات</th><td colspan="${n}">${AR(tot)}</td></tr>` : ''); };
    W.querySelector('.spN').onchange = draw; W.querySelector('.spL').onchange = draw;
    W.querySelector('.spGo').onclick = () => { if (busy) return; busy = true; const k = Math.floor(Math.random() * n), target = (k + .2 + Math.random() * .6) / n * 360;
      const st = ang, end = st - (st % 360) + 360 * 5 + target, t0 = performance.now(), D = 2600; let lastSeg = -1;
      const f = now => { const p = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - p, 3); ang = st + (end - st) * e; A.setAttribute('transform', `rotate(${ang})`); const seg = Math.floor((ang % 360) / 360 * n); if (seg !== lastSeg) { lastSeg = seg; tick(); }
        if (p < 1) requestAnimationFrame(f); else { busy = false; counts[k]++; table(); W.querySelector('.spRes').innerHTML = `استقرَّ المؤشّرُ على: <b style="color:${col(k)}">${lab(k)}</b>`; } };
      requestAnimationFrame(f); };
    draw();
  }

  /* ── المسطرة ── */
  function ruler() {
    const R = el('div', 'labRuler', ''); let cm = 30, px = 30;
    const draw = () => { let t = ''; for (let i = 0; i <= cm * 10; i++) { const x = 10 + i * px / 10, h = i % 10 === 0 ? 22 : i % 5 === 0 ? 15 : 9; t += `<line x1="${x}" y1="0" x2="${x}" y2="${h}"/>`; if (i % 10 === 0) t += `<text x="${x}" y="36">${AR(i / 10)}</text>`; }
      const w = 20 + cm * px; R.innerHTML = `<svg width="${w}" height="60" viewBox="0 0 ${w} 60"><rect x="0" y="0" width="${w}" height="60" rx="6" fill="#f7e7a8" fill-opacity=".88" stroke="#b8962e"/><g stroke="#3a2f1a" stroke-width="1">${t}</g><text x="${w - 30}" y="54" class="u">سم</text></svg><button class="rRot" title="تدوير">⟳</button><button class="rZm" data-d="1" title="تكبير">＋</button><button class="rZm" data-d="-1" title="تصغير">－</button>`;
      closeBtn(R);
      R.querySelector('.rRot').addEventListener('pointerdown', rotStart);
      R.querySelectorAll('.rZm').forEach(b => { b.addEventListener('pointerdown', e => e.stopPropagation()); b.onclick = () => { px = Math.max(14, Math.min(60, px + 4 * b.dataset.d)); draw(); }; }); };
    let rot = 0; const rotStart = e => { e.preventDefault(); e.stopPropagation(); const r = R.getBoundingClientRect(); const cx = R.offsetLeft, cy = R.offsetTop + 30; // المحورُ عند بدايةِ المسطرة
      const mv = ev => { rot = Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180 / Math.PI; if (Math.abs(rot % 45) < 4) rot = Math.round(rot / 45) * 45; R.style.transform = `rotate(${rot}deg)`; };
      const up = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); }; addEventListener('pointermove', mv); addEventListener('pointerup', up); };
    draw(); const c = center(); place(R, Math.max(10, c.x - 300), c.y + 40); draggable(R, { skip: 'button' });
  }

  /* ── قطعُ العدّ ── */
  function trayCount() {
    tray.innerHTML = `<b class="trT">🔴 قطعُ العدّ</b><p>انقرْ أو اسحبْ قطعة. انقرْ مرّتين على القطعةِ لقلبِ لونِها.</p>
      <div class="trRow"><button class="pc ctr r"></button><button class="pc ctr y"></button><button class="pc tf">إطارُ العشرة</button><button class="pc tf2">إطاران</button></div><div class="trCnt"></div>`;
    const mk = c => () => draggable(el('div', 'lc ctr ' + c), { onDouble: e => { const n = e.target.closest('.ctr'); n.classList.toggle('r'); n.classList.toggle('y'); countUpd(); }, onDrop: countUpd, onRemove: countUpd });
    trayPiece(tray.querySelector('.ctr.r'), mk('r')); trayPiece(tray.querySelector('.ctr.y'), mk('y'));
    const frame = k => () => { const f = el('div', 'lc tframe', Array.from({ length: 10 * k }, () => '<i></i>').join('')); f.style.setProperty('--k', k); return draggable(f, {}); };
    trayPiece(tray.querySelector('.tf'), frame(1)); trayPiece(tray.querySelector('.tf2'), frame(2));
    tray.querySelectorAll('.pc').forEach(b => b.addEventListener('pointerup', () => setTimeout(countUpd, 50)));
    countUpd();
  }
  function countUpd() { const t = tray.querySelector('.trCnt'); if (!t) return; const r = layer.querySelectorAll('.ctr.r').length, y = layer.querySelectorAll('.ctr.y').length; t.innerHTML = `🔴 ${AR(r)} &nbsp; 🟡 ${AR(y)} &nbsp; المجموع: <b>${AR(r + y)}</b>`; }

  /* ── قطعُ دينز ── */
  let dMode = 'w';
  const DV = { w: { cube: 1000, flat: 100, rod: 10, unit: 1 }, d: { flat: 1, rod: .1, unit: .01 } };
  function trayDienes() {
    tray.innerHTML = `<b class="trT">🧊 قطعُ دينز</b><div class="seg"><button data-m="w" class="${dMode === 'w' ? 'on' : ''}">أعدادٌ كلّيّة</button><button data-m="d" class="${dMode === 'd' ? 'on' : ''}">كسورٌ عشريّة</button></div>
      <div class="trRow dn">${dMode === 'w' ? '<button class="pc" data-k="cube"><i class="dcube"></i><small>ألف</small></button>' : ''}<button class="pc" data-k="flat"><i class="dflat mini"></i><small>${dMode === 'w' ? 'مئة' : 'واحد'}</small></button><button class="pc" data-k="rod"><i class="drod mini"></i><small>${dMode === 'w' ? 'عشرة' : 'جزءٌ من عشرة'}</small></button><button class="pc" data-k="unit"><i class="dunit"></i><small>${dMode === 'w' ? 'واحد' : 'جزءٌ من مئة'}</small></button></div>
      <p>انقرْ مرّتين على قطعةٍ لتفكيكِها إلى ١٠ قطعٍ أصغر.</p><button class="trBtn" data-a="group">🔄 تجميعُ كلِّ ١٠ قطعٍ متشابهة</button><div class="trCnt dTot"></div>`;
    tray.querySelectorAll('.seg button').forEach(b => b.onclick = () => { dMode = b.dataset.m; layer.querySelectorAll('.dn-p').forEach(n => n.remove()); trayDienes(); });
    tray.querySelectorAll('.trRow .pc').forEach(b => trayPiece(b, () => dPiece(b.dataset.k)));
    tray.querySelector('[data-a="group"]').onclick = regroup; updDienes();
  }
  function dPiece(k) {
    const n = el('div', 'lc dn-p d' + k, k === 'flat' ? '<i></i>'.repeat(100) : k === 'rod' ? '<i></i>'.repeat(10) : ''); n.dataset.k = k;
    return draggable(n, { onDouble: () => breakUp(n), onDrop: updDienes, onRemove: updDienes });
  }
  const SMALL = { cube: 'flat', flat: 'rod', rod: 'unit' }, BIG = { unit: 'rod', rod: 'flat', flat: 'cube' };
  function breakUp(n) { const s = SMALL[n.dataset.k]; if (!s) return; const x = n.offsetLeft, y = n.offsetTop; n.remove();
    for (let i = 0; i < 10; i++) { const p = dPiece(s); place(p, x + (s === 'unit' ? (i % 5) * 18 : s === 'rod' ? i * 16 : i * 14), y + (s === 'unit' ? Math.floor(i / 5) * 18 : s === 'flat' ? i * 10 : 0)); } tick(900, .08, .1); updDienes(); }
  function regroup() { let changed = false;
    for (const k of ['unit', 'rod', 'flat']) { if (dMode === 'd' && k === 'flat') break; const L = [...layer.querySelectorAll(`.dn-p[data-k="${k}"]`)];
      while (L.length >= 10) { const grp = L.splice(0, 10); const x = grp[0].offsetLeft, y = grp[0].offsetTop; grp.forEach(g => g.remove()); place(dPiece(BIG[k]), x, y); changed = true; } }
    if (changed) tick(600, .15, .1); updDienes(); }
  function updDienes() { const t = tray.querySelector('.dTot'); if (!t) return; const V = DV[dMode]; let tot = 0; const c = {};
    layer.querySelectorAll('.dn-p').forEach(n => { c[n.dataset.k] = (c[n.dataset.k] || 0) + 1; tot += V[n.dataset.k] || 0; });
    const nm = dMode === 'w' ? { cube: 'آلاف', flat: 'مئات', rod: 'عشرات', unit: 'آحاد' } : { flat: 'آحاد', rod: 'أعشار', unit: 'أجزاء من مئة' };
    t.innerHTML = Object.keys(V).map(k => `<span>${nm[k]}: <b>${AR(c[k] || 0)}</b></span>`).join('') + `<div class="dv">القيمة = <b>${AR(Math.round(tot * 100) / 100)}</b></div>`; }

  /* ── الكسور ── */
  let fShape = 'bar';
  function trayFrac() {
    const D = [1, 2, 3, 4, 5, 6, 8, 10, 12];
    tray.innerHTML = `<b class="trT">½ الكسور</b><div class="seg"><button data-s="bar" class="${fShape === 'bar' ? 'on' : ''}">أشرطة</button><button data-s="circle" class="${fShape === 'circle' ? 'on' : ''}">دوائر</button></div>
      <div class="trRow frow">${D.map((d, i) => `<button class="pc" data-d="${d}" style="--c:${['#5a4a3a', ...COLORS][i % 9]}">${d === 1 ? '١' : `<span class="fr"><b>١</b><b>${AR(d)}</b></span>`}</button>`).join('')}</div>
      <p>ضعِ القطعَ متجاورةً لتقارنَ الكسور. انقرْ مرّتين على القطعةِ لإظهارِ اسمِها أو إخفائِه.</p>`;
    tray.querySelectorAll('.seg button').forEach(b => b.onclick = () => { fShape = b.dataset.s; trayFrac(); });
    tray.querySelectorAll('.trRow .pc').forEach(b => trayPiece(b, () => fPiece(+b.dataset.d, b.style.getPropertyValue('--c')), fShape === 'bar' ? stackPos : null));
  }
  // الأشرطةُ تُرصُّ تحتَ بعضِها؛ وكلُّ كسرٍ يُكمِلُ صفَّه إن كان من نفسِ المقام
  function stackPos(n) { const W = Math.min(360, innerWidth - 40), c = center(), x0 = Math.max(10, Math.min(c.x - W / 2, innerWidth - W - 10)), y0 = Math.max(70, c.y - 170), d = +n.dataset.d, w = parseFloat(n.style.width);
    const bars = [...layer.querySelectorAll('.fbar')], rows = {};
    bars.forEach(b => { const k = Math.round(b.offsetTop / 5) * 5; (rows[k] ||= []).push(b); });
    for (const [y, L] of Object.entries(rows).sort((a, b) => a[0] - b[0])) { if (L.every(b => +b.dataset.d === d) && Math.min(...L.map(b => b.offsetLeft)) >= x0 - 3) { const right = Math.max(...L.map(b => b.offsetLeft + b.offsetWidth)); if (right + w <= x0 + W + 3) return { x: right, y: L[0].offsetTop }; } }
    const ys = bars.map(b => b.offsetTop); let y = y0; while (ys.some(v => Math.abs(v - y) < 46)) y += 50; return { x: x0, y }; }
  function fPiece(d, c) {
    const lbl = d === 1 ? '١' : `<span class="fr"><b>١</b><b>${AR(d)}</b></span>`; let n;
    if (fShape === 'bar') { n = el('div', 'lc fbar', `<span>${lbl}</span>`); n.style.width = (Math.min(360, innerWidth - 40) / d) + 'px'; n.dataset.d = d; }
    else { const R = 70, a = 2 * Math.PI / d; const path = d === 1 ? `<circle r="${R}" cx="0" cy="0"/>` : `<path d="M0 0 L0 ${-R} A${R} ${R} 0 ${d < 2 ? 1 : 0} 1 ${R * Math.sin(a)} ${-R * Math.cos(a)}Z"/>`;
      n = el('div', 'lc fcir', `<svg viewBox="-75 -75 150 150" width="150" height="150"><g fill="${c}" stroke="#fff" stroke-width="2">${path}</g></svg><span>${lbl}</span><button class="fRot">⟳</button>`);
      let r = 0; const rb = n.querySelector('.fRot'); rb.addEventListener('pointerdown', e => e.stopPropagation()); rb.onclick = () => { r = (r + 360 / Math.max(d, 4)) % 360; n.querySelector('svg').style.transform = `rotate(${r}deg)`; }; }
    n.style.setProperty('--c', c);
    return draggable(n, { skip: '.fRot', onDouble: () => n.classList.toggle('nolbl') });
  }
  return { open: () => setOpen(true) };
}
