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
import { initFirebaseAuth, signInWithGoogle, signOutUser } from './firebase_auth.js';


document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DE CONTROLE (O ORQUESTRADOR) ---

    // ... (todas as funções handle... e checkGains... permanecem aqui, sem alterações)

    // --- EVENT LISTENERS ---

    dom.loginBtn.addEventListener('click', signInWithGoogle);
    dom.logoutBtn.addEventListener('click', signOutUser);

    // ... (todos os seus outros event listeners permanecem aqui, sem alterações)
    
    // --- LÓGICA DE INICIALIZAÇÃO E AUTENTICAÇÃO ---

    /**
     * Chamado quando o usuário faz login com sucesso.
     * @param {object} user - O objeto do usuário do Firebase.
     */
    function onLogin(user) {
        // CORREÇÃO: Remove o blur e esconde o overlay de login.
        dom.appContainer.classList.remove('blurred');
        dom.loginOverlay.classList.remove('visible');
        
        dom.userProfile.classList.remove('hidden');
        dom.userAvatar.src = user.photoURL;
        
        initializeAppContent();
    }

    /**
     * Chamado quando o usuário está deslogado.
     */
    function onLogout() {
        // CORREÇÃO: Aplica o blur e mostra o overlay de login.
        dom.appContainer.classList.add('blurred');
        dom.loginOverlay.classList.add('visible');
        dom.userProfile.classList.add('hidden');

        if (state.timerInterval) {
            clearInterval(state.timerInterval);
            state.timerInterval = null;
            state.isRunning = false;
        }
    }

    /**
     * Inicializa o conteúdo principal do app após o login.
     */
    function initializeAppContent() {
        loadState();
        
        ui.applyTheme(state.settings.theme);
        ui.updateMethodToggleUI();
        ui.renderTasks();
        ui.updateGamificationUI();
        ui.renderDashboard();
        ui.updateUI();
        ui.updateShowCompletedBtn();
        
        if (state.isRunning) {
            state.timerInterval = setInterval(handleTimerTick, 1000);
        }
        
        gamification.generateDailyMissions();
        saveState();
        
        lucide.createIcons();
    }

    // A inicialização do app agora começa pela verificação de autenticação.
    initFirebaseAuth(onLogin, onLogout);
});
