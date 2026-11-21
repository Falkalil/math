// تمرّن: يفتحُ التمارينَ «بلا حدود» للدرسِ الحاليّ
export function initPractice(LESSONS, opt) {
  const btn = document.createElement('button'); btn.className = 'tb'; btn.id = 'btnPrac'; btn.title = 'تمرّن بلا حدود';
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg><span class="lbl">تمرّن</span>';
  const anchor = document.getElementById('btnLesson'); anchor ? anchor.after(btn) : document.body.appendChild(btn);
  btn.onclick = () => { const cur = window.__book ? window.__book.cur : 1; const l = LESSONS.filter(x => x.kind === 'lesson').find(x => cur >= x.from && cur <= x.to) || LESSONS.filter(x => x.kind === 'lesson').find(x => x.from >= cur) || LESSONS.find(x => x.kind === 'lesson'); opt.open(l, 'inf'); };
  const tp = document.getElementById('toolsPop'); if (tp && !tp.querySelector('[data-t="btnPrac"]')) { const b = document.createElement('button'); b.dataset.t = 'btnPrac'; b.textContent = '🎯 تمرّن بلا حدود'; tp.prepend(b); b.onclick = () => { tp.classList.remove('open'); btn.click(); }; }
  const curLesson = () => { const cur = window.__book ? window.__book.cur : 1; const L = LESSONS.filter(x => x.kind === 'lesson'); return L.find(x => cur >= x.from && cur <= x.to) || L.find(x => x.from >= cur) || L[L.length - 1]; };
  const gb = document.createElement('button'); gb.className = 'tb'; gb.id = 'btnGames'; gb.title = 'ألعاب الدرس';
  gb.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10v5M4.5 12.5h5"/><circle cx="16" cy="11.5" r="1" fill="currentColor"/><circle cx="18.5" cy="14" r="1" fill="currentColor"/></svg><span class="lbl">ألعاب</span>';
  btn.after(gb); gb.onclick = () => opt.open(curLesson(), 'games');
  if (tp) [['🎡 أدوات الصف (العجلة والاختيار العشوائي)', () => opt.open('tools')], ['🎯 أسئلة على نمط نافس', () => opt.open(curLesson(), 'nafes')], ['🎮 ألعاب الدرس', () => gb.click()]].forEach(([t, f]) => { const b = document.createElement('button'); b.textContent = t; tp.prepend(b); b.onclick = () => { tp.classList.remove('open'); f(); }; });
  return { open: () => btn.click(), close: () => {}, isOpen: () => false };
}
