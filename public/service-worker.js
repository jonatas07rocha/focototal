// A versão do cache foi incrementada para forçar a atualização e o diagnóstico.
const CACHE_NAME = 'foco-total-core-v2.2';

// Lista de arquivos essenciais. O ícone 512x512 foi restaurado.
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'icon-180x180.png',
  'icon-192x192.png',
  'icon-512x512.png'
];

// --- INSTALAÇÃO ---
self.addEventListener('install', event => {
  console.log(`[SW v${CACHE_NAME}] Evento: install`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log(`[SW v${CACHE_NAME}] Cache aberto. Cacheando App Shell:`, urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log(`[SW v${CACHE_NAME}] App Shell cacheado com sucesso. Forçando ativação...`);
        // Força o novo Service Worker a se tornar ativo imediatamente.
        return self.skipWaiting();
      })
      .catch(error => {
        // Log detalhado do erro de cache
        console.error(`[SW v${CACHE_NAME}] Falha crítica ao cachear arquivos. O SW não será instalado.`, error);
      })
  );
});

// --- ATIVAÇÃO ---
self.addEventListener('activate', event => {
  console.log(`[SW v${CACHE_NAME}] Evento: activate`);
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log(`[SW v${CACHE_NAME}] Limpando cache antigo:`, cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
        console.log(`[SW v${CACHE_NAME}] Service Worker ativado e pronto para controlar os clientes.`);
        // Garante que o SW controle a página imediatamente.
        return self.clients.claim();
    })
  );
});

// --- FETCH ---
self.addEventListener('fetch', event => {
    // Ignora requisições que não são GET e da API
    if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            });
        })
    );
});


// --- PUSH & NOTIFICATIONCLICK ---
self.addEventListener('push', event => {
    console.log(`[SW v${CACHE_NAME}] Evento: push recebido.`);
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Foco Total';
    const options = {
        body: data.body || 'Sua sessão terminou!',
        icon: 'icon-192x192.png',
        badge: 'icon-192x192.png',
        vibrate: [200, 100, 200]
    };
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', event => {
    console.log(`[SW v${CACHE_NAME}] Evento: notificationclick.`);
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
