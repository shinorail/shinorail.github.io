const CACHE_NAME = 'shinonoi-v1';
// オフラインでも見せたい最小限の重要ファイルをリストアップ
const OFFLINE_ASSETS = [
    'offline.html',
    'style.css',
    'index.html',
    'guide.html',
    'terms.html',
    'privacy.html'
];

// 1. インストール時に重要なファイルをキャッシュ
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(OFFLINE_ASSETS);
        })
    );
    self.skipWaiting();
});

// 2. 通信発生時の処理
self.addEventListener('fetch', (event) => {
    // HTMLファイルへのリクエストのみを対象にオフライン制御を行う
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                // 通信に失敗（オフライン）した場合
                return caches.open(CACHE_NAME).then((cache) => {
                    return cache.match('offline.html');
                });
            })
        );
    } else {
        // 画像やCSSなどはキャッシュがあればそれを使い、なければネットワークから
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});
