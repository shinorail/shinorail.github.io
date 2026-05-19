const CACHE_NAME = 'shinonoi-depot-v1';
const ASSETS = [
    'index.html',
    'catalog.html',
    'item-detail.html',
    'guide.html',
    'contact.html',
    'exclusive.html',
    'auth.html',
    'legal.html',
    'terms.html',
    'privacy.html',
    '404.html',
    'style.css',
    'app.js'
];

// インストール時に全11ページをキャッシュ
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// フェッチ（通信）失敗時にキャッシュまたは404を表示
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // キャッシュがあればそれを返し、なければネットワークへ
            return response || fetch(event.request).catch(() => {
                // 通信エラー（オフラインなど）の場合に404ページを返す
                return caches.match('404.html');
            });
        })
    );
});
