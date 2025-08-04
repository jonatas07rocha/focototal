/**
 * firebase_auth.js
 * Módulo para gerenciar a autenticação com o Firebase.
 * Esta versão corrige a inicialização e a forma como o login/logout
 * é tratado, eliminando a necessidade de recarregar a página.
 */

// Acessamos o Firebase a partir do objeto global 'firebase',
// inicializado no arquivo 'index.html'.
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

/**
 * Inicia o observador de estado de autenticação.
 * Ele notificará o main.js sempre que o status de login mudar.
 * @param {function} callback - Função a ser executada quando o estado de login muda.
 */
export function initFirebaseAuth(callback) {
    // A função onAuthStateChanged é do Firebase e é chamada no carregamento
    // e sempre que o estado de autenticação muda.
    auth.onAuthStateChanged(callback);
}

/**
 * Inicia o fluxo de login com o popup do Google.
 * Não recarrega a página. A UI é atualizada pelo observador de estado.
 */
export async function signInWithGoogle() {
    try {
        await auth.signInWithPopup(provider);
    } catch (error) {
        console.error("Erro durante o login com o Google Popup:", error);
        // Retorna o erro para ser tratado pelo main.js (ex: exibindo um modal).
        throw error;
    }
}

/**
 * Desloga o usuário atual.
 */
export async function signOutUser() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        // Retorna o erro para ser tratado pelo main.js.
        throw error;
    }
}
