/**
 * firebase_auth.js
 * Módulo para gerenciar a autenticação com o Firebase.
 * Versão final e robusta que resolve a condição de corrida.
 */

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCBwAqYCT6avkLeb-HiS1D4j4k-zvNp5Wo",
    authDomain: "foco-total-pwa.firebaseapp.com",
    projectId: "foco-total-pwa",
    storageBucket: "foco-total-pwa.appspot.com",
    messagingSenderId: "796505727007",
    appId: "1:796505727007:web:06060d343584a9fbe3352a",
    measurementId: "G-5KK4EE1V7Z"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Define a persistência uma vez, na inicialização do módulo.
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .catch((error) => {
        console.error("Erro ao definir a persistência:", error.code, error.message);
    });

/**
 * Inicia o fluxo de login com o REDIRECT do Google.
 */
export function signInWithGoogle() {
    auth.signInWithRedirect(provider).catch((error) => {
        console.error("Erro ao iniciar signInWithRedirect:", error);
    });
}

/**
 * Inicia o observador de estado de autenticação.
 * Ele espera o resultado do redirect e só chama o callback
 * quando o estado inicial do usuário é conhecido.
 * @param {function} callback - Função a ser chamada com o estado do usuário (user ou null).
 */
export function initFirebaseAuth(callback) {
    // Processa o resultado do login via redirect primeiro.
    auth.getRedirectResult().catch((error) => {
        console.error("Erro durante o getRedirectResult:", error.code, error.message);
    });

    // onAuthStateChanged é a fonte única e confiável do estado de autenticação.
    const unsubscribe = auth.onAuthStateChanged(user => {
        unsubscribe(); // Cancela a inscrição para não disparar novamente em logins/logouts
        callback(user); // Envia o estado inicial definitivo para o main.js
    });
}

/**
 * Desloga o usuário atual.
 */
export function signOutUser() {
    auth.signOut().catch(error => {
        console.error("Erro ao fazer logout:", error);
    });
}
