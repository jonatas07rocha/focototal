/**
 * firebase_auth.js
 * Módulo para gerenciar a autenticação com o Firebase.
 */

// Suas credenciais corretas do Firebase.
const firebaseConfig = {
    apiKey: "AIzaSyCBwAqYCT6avkLeb-HiS1D4j4k-zvNp5Wo",
    authDomain: "foco-total-pwa.firebaseapp.com",
    projectId: "foco-total-pwa",
    storageBucket: "foco-total-pwa.appspot.com",
    messagingSenderId: "796505727007",
    appId: "1:796505727007:web:06060d343584a9fbe3352a",
    measurementId: "G-5KK4EE1V7Z"
};

// Inicializa o Firebase usando a sintaxe de compatibilidade
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

/**
 * Inicia o observador de estado de autenticação.
 * @param {function} onLogin - Callback a ser executado quando o usuário faz login.
 * @param {function} onLogout - Callback a ser executado quando o usuário faz logout.
 */
export function initFirebaseAuth(onLogin, onLogout) {
    auth.onAuthStateChanged(user => {
        if (user) {
            onLogin(user);
        } else {
            onLogout();
        }
    });
}

/**
 * Inicia o fluxo de login com o popup do Google.
 */
export function signInWithGoogle() {
    auth.signInWithPopup(provider)
        .catch(error => {
            console.error("Erro durante o login com o Google:", error);
            alert("Ocorreu um erro ao tentar fazer o login.");
        });
}

/**
 * Desloga o usuário atual.
 */
export function signOutUser() {
    auth.signOut()
        .catch(error => {
            console.error("Erro ao fazer logout:", error);
        });
}
