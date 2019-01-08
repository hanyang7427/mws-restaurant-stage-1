var staticCacheName = 'restaurant-static-v4';

// 当有发现有新的service worker,在安装之前缓存静态文件
self.addEventListener('install', function (event) {
    caches.open(staticCacheName).then(function (cache) {
        cache.addAll([
            'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
            'css/styles.css',
            // 'https://normalize-css.googlecode.com/svn/trunk/normalize.css',
            // 'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
            'js/dbhelper.js',
            'js/main.js'
        ])
    })
});

// 当新的service worker生效之前删除旧版本的的缓存
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restaurant-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// 监听fetch事件，优先返回缓存内容
self.addEventListener('fetch',function (event) {
    event.respondWith(caches.match(caches.request).then(function (response) {
        return response || fetch(event.request)
    }))
})