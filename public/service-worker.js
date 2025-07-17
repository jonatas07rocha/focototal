// A versão do cache foi incrementada para garantir que o navegador instale este novo Service Worker.
const CACHE_NAME = 'foco-total-core-v2.0';

// Arquivos locais que são essenciais para o app funcionar offline.
const localUrlsToCache = [
  './',
  '/index.html',
  '/manifest.json',
  '/icon-180x180.png',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// --- INSTALAÇÃO ---
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando nova versão...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Cacheando recursos locais (App Shell).');
      return cache.addAll(localUrlsToCache);
    }).catch(error => {
        console.error('Falha ao cachear o App Shell inicial:', error);
    })
  );
  self.skipWaiting(); // Força o novo Service Worker a se tornar ativo imediatamente.
});

// --- ATIVAÇÃO ---
// Limpa caches antigos para economizar espaço.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// --- FETCH ---
// Intercepta as requisições e serve do cache primeiro (estratégia Cache First).
self.addEventListener('fetch', event => {
    // Não cacheia as requisições para a nossa própria API
    if (event.request.url.includes('/api/')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            // Se o recurso estiver no cache, retorna ele.
            if (cachedResponse) {
                return cachedResponse;
            }

            // Se não, busca na rede e tenta cachear para uso futuro.
            return fetch(event.request).then(networkResponse => {
                // Apenas cacheia respostas válidas de GET
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' || event.request.method !== 'GET') {
                    return networkResponse;
                }
                
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                });
                
                return networkResponse;
            });
        })
    );
});


// --- PUSH & NOTIFICATIONCLICK (sem alterações) ---
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Foco Total';
    const options = {
        body: data.body || 'Sua sessão de foco terminou!',
        icon: 'icon-192x192.png',
        badge: 'icon-192x192.png',
        vibrate: [200, 100, 200]
    };
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/') // Abre a página raiz do app
    );
});
