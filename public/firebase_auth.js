/**
 * firebase_auth.js
 * Módulo para gerir a autenticação com o Firebase.
 * CORRIGIDO: Usa setPersistence para lidar com restrições de cookies de terceiros.
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

/**
 * Inicia o fluxo de login com o REDIRECT do Google.
 * Define a persistência da sessão antes de iniciar o login.
 */
export function signInWithGoogle() {
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
            // Depois de definir a persistência, inicia o redirecionamento.
            return auth.signInWithRedirect(provider);
        })
        .catch((error) => {
            console.error("Erro ao definir a persistência ou ao iniciar o login:", error);
        });
}

/**
 * Inicia o observador de estado de autenticação e processa o resultado do redirect.
 * @param {function} onLogin - Callback a ser executado quando o utilizador faz login.
 * @param {function} onLogout - Callback a ser executado quando o utilizador faz logout.
 */
export function initFirebaseAuth(onLogin, onLogout) {
    auth.getRedirectResult()
        .catch((error) => {
            console.error("Erro durante o getRedirectResult:", error);
        });

    auth.onAuthStateChanged(user => {
        if (user) {
            onLogin(user);
        } else {
            onLogout();
        }
    });
}

/**
 * Desloga o utilizador atual.
 */
export function signOutUser() {
    auth.signOut().catch(error => {
        console.error("Erro ao fazer logout:", error);
    });
}
