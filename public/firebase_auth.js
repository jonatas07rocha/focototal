/**
 * firebase_auth.js
 * Módulo para gerenciar a autenticação com o Firebase.
 * ---
 * VERSÃO FINAL: Utiliza o método de pop-up para contornar a falha de
 * plataforma e força o recarregamento da página após o login para garantir
 * a correta renderização da interface do aplicativo.
 */

// Suas credenciais do Firebase (do projeto FocoTotal)
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
 * Ele notificará o main.js sempre que o status de login mudar,
 * seja no carregamento inicial da página ou após uma ação de login/logout.
 * @param {function} callback - Função a ser executada quando o estado de login muda.
 */
export function initFirebaseAuth(callback) {
    auth.onAuthStateChanged(callback);
}

/**
 * Inicia o fluxo de login com o popup do Google e, em caso de sucesso,
 * força o recarregamento da página para garantir que a interface seja
 * renderizada a partir de um estado limpo.
 */
export function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    auth.signInWithPopup(provider)
        .then((result) => {
            // Se o login foi bem-sucedido e temos um objeto de usuário,
            // simplesmente recarregamos a página.
            if (result.user) {
                window.location.reload();
            }
        })
        .catch(error => {
            // Erros comuns aqui são o usuário fechar o pop-up ou negar o acesso.
            // O erro não será mostrado ao usuário se ele apenas fechar a janela.
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
