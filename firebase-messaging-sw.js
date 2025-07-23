// Importa os scripts do Firebase (necessário para service workers)
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

// A mesma configuração do Firebase do seu app
const firebaseConfig = {
  apiKey: "AIzaSyAHw27qe_K1l5dRMgiupBfoPbElO-ddHzk",
  authDomain: "foco-total-app.firebaseapp.com",
  projectId: "foco-total-app",
  storageBucket: "foco-total-app.firebasestorage.app",
  messagingSenderId: "259321591140",
  appId: "1:259321591140:web:681353d3533ee0477af671"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Opcional: Manipulador para quando uma notificação é recebida em segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensagem recebida em segundo plano:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
