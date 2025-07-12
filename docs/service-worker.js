// Define um nome e versão para o cache. Mudar a versão força a atualização do cache.
const CACHE_NAME = 'foco-total-core-v1.2'; 

// Lista de arquivos e recursos essenciais para o funcionamento offline do app.
const urlsToCache = [
    '/',
    'index.html',
    'manifest.json',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap',
    'https://unpkg.com/lucide@latest/dist/umd/lucide.js',
    'icon-192x192.png',
    'icon-512x512.png'
];

let notificationTimeout;

// Evento 'install': é disparado quando o Service Worker é instalado pela primeira vez.
self.addEventListener('install', event => {
    // O waitUntil garante que o Service Worker não será considerado 'instalado'
    // até que o código dentro dele seja executado com sucesso.
    event.waitUntil(
        caches.open(CACHE_NAME) // Abre o cache com o nome definido.
            .then(cache => {
                console.log('Cache aberto e pronto para uso.');
                // Adiciona todos os arquivos da lista 'urlsToCache' ao cache.
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento 'fetch': é disparado para cada requisição que a página faz (ex: imagens, scripts, etc.).
self.addEventListener('fetch', event => {
    // O respondWith intercepta a requisição e permite que forneçamos nossa própria resposta.
    event.respondWith(
        caches.match(event.request) // Procura no cache por uma resposta que corresponda à requisição.
            .then(response => {
                // Se uma resposta for encontrada no cache, retorna ela.
                if (response) {
                    return response;
                }
                // Se não encontrar no cache, faz a requisição à rede.
                // É uma boa prática clonar a requisição, pois ela é um Stream e só pode ser consumida uma vez.
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    networkResponse => {
                        // Resposta válida? Então vamos armazená-la em cache para uso futuro.
                        if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

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

// Evento 'activate': é disparado quando o Service Worker é ativado.
// É um bom lugar para limpar caches antigos.
self.addEventListener('activate', event => {
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
        })
    );
});


// --- LÓGICA DE NOTIFICAÇÃO ROBUSTA ---
// Ouve mensagens vindas da página principal (index.html)
self.addEventListener('message', event => {
    if (event.data.type === 'scheduleNotification') {
        const { title, options, timestamp } = event.data.payload;
        const delay = timestamp - Date.now();

        // Limpa qualquer notificação agendada anteriormente
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }

        if (delay > 0) {
            notificationTimeout = setTimeout(() => {
                // Mostra a notificação. `self.registration` é uma referência ao registro do Service Worker.
                self.registration.showNotification(title, options);
            }, delay);
        }
    } else if (event.data.type === 'cancelNotification') {
        // Cancela o agendamento se o usuário pausar
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }
    }
});