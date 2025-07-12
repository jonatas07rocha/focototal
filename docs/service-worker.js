/**
 * Service Worker para o Foco Total Core
 * Versão: 1.3
 * Responsável pelo cache de recursos para funcionamento offline,
 * interceptação de requisições e gerenciamento de notificações.
 */

// Define um nome e versão para o cache. Mudar a versão força a atualização do cache.
const CACHE_NAME = 'foco-total-core-v1.3'; 

// Lista de arquivos e recursos essenciais para o funcionamento offline do app.
const urlsToCache = [
    '/',
    'index.html',
    'manifest.json',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap',
    'https://unpkg.com/lucide@latest/dist/umd/lucide.js',
    'icon-192x192.PNG', // Corrigido para .PNG
    'icon-512x512.PNG'  // Corrigido para .PNG
];

// Variável para armazenar o ID do timeout da notificação agendada.
let notificationTimeout;

// Evento 'install': é disparado quando o Service Worker é instalado.
self.addEventListener('install', event => {
    console.log('Service Worker: Instalando...');
    // Garante que o SW não seja considerado 'instalado' até que o cache seja populado.
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto. Adicionando recursos essenciais.');
                return cache.addAll(urlsToCache);
            })
    );
    // Força o novo Service Worker a se tornar ativo imediatamente.
    self.skipWaiting();
});

// Evento 'activate': é disparado quando o Service Worker é ativado.
self.addEventListener('activate', event => {
    console.log('Service Worker: Ativando...');
    const cacheWhitelist = [CACHE_NAME]; // Lista de caches que queremos manter.
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Se o nome do cache não estiver na nossa lista de permissões, ele é deletado.
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deletando cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        // Garante que o SW ativado assuma o controle de todas as abas abertas imediatamente.
        }).then(() => self.clients.claim())
    );
});

// Evento 'fetch': intercepta todas as requisições de rede da página.
self.addEventListener('fetch', event => {
    // Implementa a estratégia "Cache First, then Network".
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se a resposta for encontrada no cache, retorna ela.
                if (response) {
                    return response;
                }
                // Se não encontrar, faz a requisição à rede.
                return fetch(event.request).then(
                    networkResponse => {
                        // Verifica se a resposta da rede é válida antes de colocar no cache.
                        // Não armazena em cache respostas de erro ou de extensões (que não são 'basic').
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // Clona a resposta para poder enviá-la ao navegador e ao cache.
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    }
                );
            }
        )
    );
});


// Evento 'message': ouve mensagens vindas da página principal (index.html).
self.addEventListener('message', event => {
    if (!event.data) return;

    const { type, payload } = event.data;

    switch (type) {
        case 'scheduleNotification':
            console.log('SW: Agendando notificação...');
            // Limpa qualquer notificação agendada anteriormente.
            if (notificationTimeout) {
                clearTimeout(notificationTimeout);
            }

            const delay = payload.timestamp - Date.now();

            if (delay > 0) {
                notificationTimeout = setTimeout(() => {
                    // Mostra a notificação.
                    self.registration.showNotification(payload.title, payload.options);
                    console.log('SW: Notificação exibida.');
                }, delay);
            }
            break;

        case 'cancelNotification':
            console.log('SW: Cancelando notificação agendada.');
            if (notificationTimeout) {
                clearTimeout(notificationTimeout);
            }
            break;
    }
});
