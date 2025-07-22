// A versão do cache foi incrementada para forçar a atualização.
const CACHE_NAME = 'foco-total-core-v2.1';

// Lista de arquivos essenciais e confirmados para o funcionamento offline.
// Removido o 'icon-512x512.png' que provavelmente estava causando a falha.
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'icon-180x180.png',
  'icon-192x192.png'
];

// --- INSTALAÇÃO ---
// O Service Worker é instalado.
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando nova versão v2.1...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cacheando App Shell essencial.');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker: Falha crítica ao cachear arquivos iniciais:', error);
      })
  );
  // Força o novo Service Worker a se tornar ativo imediatamente.
  self.skipWaiting();
});

// --- ATIVAÇÃO ---
// Limpa caches antigos para liberar espaço e evitar conflitos.
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
    }).then(() => {
        console.log('Service Worker: Ativado e controlando os clientes.');
        return self.clients.claim();
    })
  );
});

// --- FETCH ---
// Intercepta as requisições de rede (estratégia Cache First).
self.addEventListener('fetch', event => {
    // Ignora requisições para a nossa própria API para não cacheá-las.
    if (event.request.url.includes('/api/')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            // Se o recurso estiver no cache, retorna ele.
            if (cachedResponse) {
                return cachedResponse;
            }

            // Se não, busca na rede.
            return fetch(event.request).then(networkResponse => {
                // Apenas clona e cacheia respostas válidas.
                if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
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
// Ouve por mensagens push do servidor.
self.addEventListener('push', event => {
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

// Define o que acontece quando o usuário clica na notificação.
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/') // Abre a página principal do app.
    );
});
