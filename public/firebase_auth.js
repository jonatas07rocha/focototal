/**
 * firebase_auth.js
 * Módulo para gerenciar a autenticação com o Firebase.
 * * VERSÃO MODIFICADA PARA USAR O MÉTODO DE POP-UP *
 */

// Suas credenciais do Firebase
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

/**
 * Inicia o observador de estado de autenticação.
 * Ele notificará o main.js sempre que o status de login mudar.
 * @param {function} callback - Função a ser executada quando o estado de login muda.
 */
export function initFirebaseAuth(callback) {
    // Agora usamos um ouvinte persistente, que é o ideal para o fluxo de pop-up.
    auth.onAuthStateChanged(callback);
}

/**
 * Inicia o fluxo de login com o popup do Google.
 */
export function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    // A função principal agora é a signInWithPopup
    return auth.signInWithPopup(provider)
        .catch(error => {
            // Erros comuns aqui são o usuário fechar o pop-up ou negar o acesso.
            console.error("Erro durante o login com o Google Popup:", error);
            if (error.code !== 'auth/popup-closed-by-user') {
                 alert("Ocorreu um erro ao tentar fazer o login. Verifique o console para mais detalhes.");
            }
        });
}

/**
 * Desloga o usuário atual.
 */
export function signOutUser() {
    return auth.signOut()
        .catch(error => {
            console.error("Erro ao fazer logout:", error);
        });
}
