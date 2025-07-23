// Importa os scripts do Firebase (necessário para service workers)
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

// --- CONFIGURAÇÃO DO FIREBASE ---
// ATENÇÃO: COLE AQUI O MESMO OBJETO 'firebaseConfig' QUE VOCÊ USOU NO INDEX.HTML
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_AUTH_DOMAIN_AQUI",
  projectId: "SEU_PROJECT_ID_AQUI",
  storageBucket: "SEU_STORAGE_BUCKET_AQUI",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID_AQUI",
  appId: "SEU_APP_ID_AQUI"
};

// Inicializa o Firebase no service worker
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Manipulador para quando uma notificação é recebida com o app em segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[service-worker.js] Mensagem recebida em segundo plano:', payload);

  // Extrai o título e as opções da notificação recebida do FCM.
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/icon-192x192.png' // Usa o ícone do payload ou um padrão
  };

  // Garante que o service worker continue ativo até a notificação ser exibida
  self.registration.showNotification(notificationTitle, notificationOptions);
});
