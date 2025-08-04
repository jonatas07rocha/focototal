/**
 * firebase_auth.js
 * Módulo para gerenciar a autenticação com o Firebase, implementando um fluxo
 * robusto para evitar condições de corrida na inicialização.
 * * Esta versão foi corrigida para seguir o "Guia Detalhado".
 */

// Suas credenciais do Firebase [cite: 1]
const firebaseConfig = {
    apiKey: "AIzaSyCBwAqYCT6avkLeb-HiS1D4j4k-zvNp5Wo",
    authDomain: "foco-total-pwa.firebaseapp.com",
    projectId: "foco-total-pwa",
    storageBucket: "foco-total-pwa.appspot.com",
    messagingSenderId: "796505727007",
    appId: "1:796505727007:web:06060d343584a9fbe3352a",
    measurementId: "G-5KK4EE1V7Z"
};

// 🔌 Passo 1: Preparação Imediata - Inicialização e Persistência
firebase.initializeApp(firebaseConfig); // [cite: 18]
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Define a persistência para 'local' para guardar a sessão no localStorage do navegador. [cite: 19, 21]
// Isso é vital para que o usuário continue logado mesmo após fechar a aba ou o navegador. [cite: 22]
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .catch(error => {
    console.error("Erro ao definir a persistência de autenticação:", error);
  });

/**
 * 🚪 Inicia o processo de verificação de autenticação de forma segura.
 * Funciona como um "porteiro" que garante que a aplicação só renderize a UI
 * quando o estado de autenticação for 100% conhecido. [cite: 3, 44]
 * * @param {function} onAuthStateKnown - O callback a ser executado com o resultado
 * definitivo (o objeto 'user' ou 'null'), que foi passado pelo main.js. [cite: 26, 41]
 */
export function initFirebaseAuth(onAuthStateKnown) {
    // 🕵️ Passo 3: A Investigação Interna

    // 🔍 Primeiro, chama o "Investigador Lento" para o caso do usuário estar
    // voltando da página de login do Google. [cite: 10, 32, 33]
    auth.getRedirectResult()
        .catch(error => {
            // Um erro aqui geralmente significa que o usuário não veio de um redirect,
            // então podemos ignorá-lo com segurança na maioria dos casos.
            console.error("Erro ao obter resultado do redirect:", error);
        })
        .finally(() => {
            // 🎧 Em seguida, ativa o "Vigia Definitivo" (onAuthStateChanged).
            // A chamada unsubscribe garante que este bloco execute apenas uma vez,
            // eliminando a condição de corrida. [cite: 35, 39]
            const unsubscribe = auth.onAuthStateChanged(user => {
                unsubscribe(); // ✨ A "mágica" que impede o loop. [cite: 38]
                // ✅ Envia o "Sinal Verde" para o main.js com o estado final. [cite: 41]
                onAuthStateKnown(user);
            });
        });
}

/**
 * Inicia o fluxo de login com o Google usando o método de redirecionamento.
 * Este método é o parceiro natural do `getRedirectResult`.
 */
export function signInWithGoogle() {
    auth.signInWithRedirect(provider);
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
