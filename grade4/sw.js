// يعمل الكتاب دون إنترنت: كلُّ ملفٍّ يُحفظ في الذاكرة المؤقتة ويُقدَّم منها
const CACHE = 'math4-book-v1';
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./precache.json", "./lessons/index.html", "./lessons/fonts/tajawal.css", "./lessons/js/algebra.js", "./lessons/js/app.js", "./lessons/js/ch1.js", "./lessons/js/ch2.js", "./lessons/js/ch3.js", "./lessons/js/ch4.js", "./lessons/js/ch5.js", "./lessons/js/ch6.js", "./lessons/js/engine.js", "./lessons/js/kit4.js", "./lessons/js/kit5.js", "./lessons/js/mathkit.js", "./lessons/js/nafes.js", "./lessons/js/play.js", "./lessons/js/stats.js", "./lessons/js/toc.js", "./fonts/tajawal.css", "./js/app.js", "./js/data.js", "./js/kit.js", "./js/lab.js", "./js/lesson.js", "./js/offline.js", "./js/practice.js", "./js/three.module.min.js", "./js/addons/controls/OrbitControls.js"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(CORE.map(u => c.add(u)))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(hit => hit || fetch(r).then(res => {
    if (res && res.ok && new URL(r.url).origin === location.origin) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); }
    return res;
  }).catch(() => r.mode === 'navigate' ? caches.match('./index.html') : Response.error())));
});
