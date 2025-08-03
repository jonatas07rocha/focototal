/**
 * firebase_auth.js
 * Módulo para gerenciar a autenticação com o Firebase.
 * CORRIGIDO: Define a persistência na inicialização para maior robustez.
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

// **MUDANÇA PRINCIPAL**: Define a persistência uma vez, na inicialização do módulo.
// Isso garante que a sessão será guardada no armazenamento local para todos os logins.
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
 * Inicia o observador de estado de autenticação e processa o resultado do redirect.
 * @param {function} onLogin - Callback a ser executado quando o usuário faz login.
 * @param {function} onLogout - Callback a ser executado quando o usuário faz logout.
 */
export function initFirebaseAuth(onLogin, onLogout) {
    auth.getRedirectResult()
        .then((result) => {
            if (result.user) {
                console.log("Resultado do redirect processado com sucesso.");
            }
        })
        .catch((error) => {
            console.error("Erro durante o getRedirectResult:", error.code, error.message);
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
 * Desloga o usuário atual.
 */
export function signOutUser() {
    auth.signOut().catch(error => {
        console.error("Erro ao fazer logout:", error);
    });
}
