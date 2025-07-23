// Importa os scripts do Firebase (necessário para service workers)
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

// --- CONFIGURAÇÃO DO FIREBASE ---
// ATENÇÃO: COLE AQUI O MESMO OBJETO 'firebaseConfig' QUE VOCÊ USOU NO INDEX.HTML
const firebaseConfig = {
  apiKey: "COLE_A_SUA_NOVA_API_KEY_AQUI", // <-- AQUI
  authDomain: "foco-total-app.firebaseapp.com",
  projectId: "foco-total-app",
  storageBucket: "foco-total-app.firebasestorage.app",
  messagingSenderId: "259321591140",
  appId: "1:259321591140:web:681353d3533ee0477af671"
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
