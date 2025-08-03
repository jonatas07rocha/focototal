// Módulos de Dados
import { themes } from './themes.js';
import { achievements } from './achievements.js';

// Módulos de Lógica
import { state } from './state.js';
import { dom } from './ui.js';
import { loadState, saveState } from './persistence.js';
import { playBeep, playFinishSound } from './audio.js';
import * as gamification from './gamification.js';
import * as timer from './timer.js';
import * as tasks from './tasks.js';
import * as ui from './ui_controller.js';
import * as shop from './shop_logic.js';

// Módulo de Autenticação do Firebase
import { initFirebaseAuth, signInWithGoogle, signOutUser } from './firebase_auth.js';


// --- LÓGICA DE AUTENTICAÇÃO (VERSÃO DE DIAGNÓSTICO CORRIGIDA) ---

/**
 * Função de teste executada quando o usuário faz login com sucesso.
 */
function onLogin(user) {
    console.log(`Login bem-sucedido para ${user.displayName}.`);
    
    // Esconde a tela de login
    dom.loginContainer.classList.add('hidden');
    // Mostra o contêiner do app
    dom.appContainer.classList.remove('hidden');
    
    // PASSO DE DIAGNÓSTICO: Mostra uma mensagem de sucesso estável.
    dom.appContainer.innerHTML = `
        <div class="text-white text-center p-8 flex flex-col items-center justify-center h-full">
            <h1 class="text-2xl font-bold mb-4">Login Bem-Sucedido!</h1>
            <img src="${user.photoURL}" alt="Avatar de ${user.displayName}" class="rounded-full w-24 h-24 mx-auto my-4 border-4 border-green-500">
            <p class="text-lg">Olá, ${user.displayName}.</p>
            <p class="mt-4 text-muted">Se esta tela permanecer visível, a autenticação está a funcionar corretamente.</p>
            <p class="text-muted text-sm">(O problema estará na função que inicializa o conteúdo do app)</p>
            <button id="test-logout-btn" class="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">Testar Logout</button>
        </div>
    `;

    // Adiciona um listener ao novo botão de logout de teste
    document.getElementById('test-logout-btn').addEventListener('click', signOutUser);
    
    // A linha que inicia o app permanece comentada para este teste.
    // initializeAppContent(); 
}

/**
 * Função executada quando o usuário faz logout.
 * CORRIGIDO: Não recarrega mais a página, apenas mostra a tela de login.
 */
function onLogout() {
    console.log("onLogout chamado. Mostrando a tela de login.");
    dom.appContainer.innerHTML = ''; // Limpa o conteúdo de teste do app
    dom.appContainer.classList.add('hidden');
    dom.loginContainer.classList.remove('hidden');
}

/**
 * A função original da aplicação. Não será chamada neste teste.
 */
function initializeAppContent() {
    // ... (Toda a sua lógica original permanece aqui, intocada)
}


// --- PONTO DE ENTRADA PRINCIPAL DO APP ---
document.addEventListener('DOMContentLoaded', () => {
    // Adiciona os listeners de login/logout que funcionam sempre
    // O listener do logout original não vai funcionar porque o botão não existe na tela de teste, por isso adicionamos um novo em onLogin.
    dom.loginBtn.addEventListener('click', signInWithGoogle);

    // Inicia a verificação de autenticação do Firebase.
    initFirebaseAuth(onLogin, onLogout);
});
