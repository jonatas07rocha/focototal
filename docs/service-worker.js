// Define um nome e versão para o cache. Mudar a versão força a atualização do cache.
const CACHE_NAME = 'foco-total-core-v1.1'; 

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
                return fetch(event.request);
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
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});