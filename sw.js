const CACHE_NAME = 'scorpion-chrono-v1';
// Список файлов для кеширования (твои картинки)
const ASSETS = [
  './',
  './index.html',
  './32.png',
  './34.png',
  './23.png'
];

// Установка - кешируем все файлы
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Активация - чистим старый кеш, если версия изменилась
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Перехват запросов - отдаем из кеша, если нет интернета
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
