// A versão do cache foi incrementada para garantir que o navegador instale este novo Service Worker.
const CACHE_NAME = 'foco-total-core-v1.6';

// 1. SEPARAMOS OS ARQUIVOS LOCAIS E REMOTOS
// Arquivos locais que são essenciais para o app funcionar offline.
const localUrlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'icon-180x180.png',
  'icon-192x192.png',
  'icon-512x512.png'
];

// Arquivos externos (de CDNs). Serão cacheados de forma separada.
const remoteUrlsToCache = [
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap',
    'https://unpkg.com/lucide@latest/dist/umd/lucide.js',
    'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.min.js'
];

// --- INSTALAÇÃO ---
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando nova versão...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // 2. PRIMEIRO, CACHEAMOS OS ARQUIVOS LOCAIS
      // Isso é rápido e raramente falha.
      console.log('Service Worker: Cacheando recursos locais (App Shell).');
      return cache.addAll(localUrlsToCache);
    }).then(() => {
        // 3. DEPOIS, CACHEAMOS OS ARQUIVOS REMOTOS
        // Esta função não bloqueia a instalação se um recurso remoto falhar.
        console.log('Service Worker: Cacheando recursos remotos (CDNs).');
        return addRemoteResourcesToCache(CACHE_NAME, remoteUrlsToCache);
    })
  );
  self.skipWaiting(); // Força o novo Service Worker a se tornar ativo imediatamente.
});

// Função auxiliar para cachear recursos remotos de forma segura
const addRemoteResourcesToCache = (cacheName, urls) => {
    return caches.open(cacheName).then(cache => {
        // Usamos 'no-cors' para buscar recursos de CDNs que podem não ter headers CORS perfeitos.
        // Isso nos permite cachear uma cópia para uso offline, mesmo que seja "opaca".
        const cachePromises = urls.map(url => {
            const request = new Request(url, { mode: 'no-cors' });
            return fetch(request).then(response => cache.put(request, response));
        });
        return Promise.all(cachePromises).catch(error => {
            // Se um recurso remoto falhar, apenas logamos o erro, mas não quebramos a instalação.
            console.warn('Service Worker: Falha ao cachear um recurso remoto. O app ainda funcionará offline.', error);
        });
    });
};


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
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se o recurso estiver no cache, retorna ele.
        if (response) {
          return response;
        }
        // Se não, busca na rede.
        return fetch(event.request);
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
        clients.openWindow('./')
    );
});
