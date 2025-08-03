/**
 * firebase_auth.js
 * Módulo para gerenciar a autenticação com o Firebase.
 * Usa o método de redirect para máxima compatibilidade.
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
 * Inicia o observador de estado de autenticação e processa o resultado do redirect.
 * @param {function} onLogin - Callback a ser executado quando o utilizador faz login.
 * @param {function} onLogout - Callback a ser executado quando o utilizador faz logout.
 */
export function initFirebaseAuth(onLogin, onLogout) {
    // Verifica se o utilizador está a voltar de um redirect de login
    auth.getRedirectResult()
        .catch((error) => {
            console.error("Erro durante o getRedirectResult:", error);
            alert("Ocorreu um erro ao tentar finalizar o login.");
        });

    // Inicia o observador para detetar mudanças de estado (login/logout)
    auth.onAuthStateChanged(user => {
        if (user) {
            onLogin(user);
        } else {
            onLogout();
        }
    });
}

/**
 * Inicia o fluxo de login com o REDIRECT do Google.
 */
export function signInWithGoogle() {
    auth.signInWithRedirect(provider);
}

/**
 * Desloga o utilizador atual.
 */
export function signOutUser() {
    auth.signOut().catch(error => {
        console.error("Erro ao fazer logout:", error);
    });
}
