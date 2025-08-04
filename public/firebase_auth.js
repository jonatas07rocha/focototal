/**
 * firebase_auth.js
 * Módulo para gerenciar a autenticação com o Firebase (versão com logs de depuração).
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

// Inicialização
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
console.log('[Auth] Módulo firebase_auth.js carregado.');

// Definição da Persistência
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    console.log('[Auth] Persistência definida como LOCAL com sucesso.');
  })
  .catch(error => {
    console.error("[Auth] ERRO ao definir a persistência:", error);
  });

export function initFirebaseAuth(onAuthStateKnown) {
    console.log('[Auth] 🚪 initFirebaseAuth foi chamada.');

    console.log('[Auth] 🔍 Investigando getRedirectResult...');
    auth.getRedirectResult()
        .then(result => {
            if (result.user) {
                console.log(`[Auth] ✅ getRedirectResult encontrou um usuário: ${result.user.displayName}`);
            } else {
                console.log('[Auth] ℹ️ getRedirectResult retornou nulo (comportamento normal se não houver redirect).');
            }
        })
        .catch(error => {
            console.error("[Auth] ❌ ERRO em getRedirectResult:", error);
        })
        .finally(() => {
            console.log('[Auth] 🎧 Anexando o "Vigia Definitivo" (onAuthStateChanged)...');
            const unsubscribe = auth.onAuthStateChanged(user => {
                console.log('[Auth] ❗ "Vigia" (onAuthStateChanged) disparou.');
                console.log('[Auth] ✨ Chamando unsubscribe() para garantir execução única.');
                unsubscribe();
                
                if (user) {
                    console.log(`[Auth] ✅ Resposta final: Usuário encontrado (${user.displayName}). Acionando callback do main.js.`);
                } else {
                    console.log('[Auth] ℹ️ Resposta final: Nenhum usuário (nulo). Acionando callback do main.js.');
                }
                
                onAuthStateKnown(user);
            });
        });
}

export function signInWithGoogle() {
    console.log('[Auth] ➡️ Iniciando login com signInWithRedirect...');
    auth.signInWithRedirect(provider);
}

export function signOutUser() {
    console.log('[Auth] 🚪 Iniciando processo de logout...');
    auth.signOut()
        .catch(error => {
            console.error("[Auth] ERRO ao fazer logout:", error);
        });
}
