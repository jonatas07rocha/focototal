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

// --- FUNÇÕES DE CONTROLE DE UI ---

function showLoginScreen() {
    dom.loadingContainer.classList.add('hidden');
    dom.appContainer.classList.add('hidden');
    dom.loginContainer.classList.remove('hidden');
}

function showAppScreen(user) {
    dom.loadingContainer.classList.add('hidden');
    dom.loginContainer.classList.add('hidden');
    dom.appContainer.classList.remove('hidden');

    // Atualiza a UI com as informações do usuário
    dom.userProfile.classList.remove('hidden');
    dom.focusMethodToggle.classList.add('hidden'); 
    dom.userAvatar.src = user.photoURL;
    dom.userAvatar.alt = `Avatar de ${user.displayName}`;

    // Inicia a lógica principal do app
    initializeAppContent();
}

// --- LÓGICA PRINCIPAL DA APLICAÇÃO ---

let appInitialized = false; // Guarda para garantir que a inicialização ocorra apenas uma vez

function initializeAppContent() {
    if (appInitialized) return; // Se já foi inicializado, não faz nada
    appInitialized = true;

    // --- LÓGICA DE CONTROLE (O ORQUESTRADOR) ---
    function handleTimerTick() {
        const finished = timer.updateTimer();
        ui.updateTimerDisplay();
        if (finished) {
            handleSessionEnd();
        }
    }

    function handleSessionEnd() {
        const { previousMode, focusDuration } = timer.switchMode();
        playFinishSound();
        if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);

        if (previousMode === 'focus') {
            const streakInfo = gamification.checkStreak();
            if (streakInfo && streakInfo.bonus > 0) {
                ui.showModal(dom.alertModalOverlay, `Sequência de ${streakInfo.streak} dias! Você ganhou ${streakInfo.bonus} moedas de bônus!`);
            }
            
            const xpGained = Math.floor(focusDuration / 60);
            const leveledUp = gamification.addXP(xpGained);
            gamification.addCoins(5);

            if (leveledUp) {
                playBeep(659, 150, 0.4);
                setTimeout(() => playBeep(784, 300, 0.5), 200);
                ui.showModal(dom.alertModalOverlay, `Parabéns! Você alcançou o Nível ${state.gamification.level}!`);
            }
            
            const endMessage = state.settings.focusMethod === 'pomodoro'
                ? 'Você completou um Pomodoro! Hora de fazer uma pausa.'
                : 'Sessão de foco finalizada!';
            ui.showModal(dom.sessionEndModalOverlay, endMessage);

            dom.xpGainDisplay.textContent = `+${xpGained} XP`;
            dom.coinGainDisplay.textContent = `+5 Moedas`;

        } else {
            ui.showModal(dom.sessionEndModalOverlay, 'Pausa finalizada! Vamos voltar ao trabalho?');
        }
        
        checkGains();
        ui.updateUI();
        ui.renderTasks();
        saveState();
    }
    
    function checkGains() {
        const newMissions = gamification.checkMissionsProgress();
        newMissions.forEach(mission => {
            ui.showToast('mission', mission);
            playBeep(700, 150, 0.4);
        });

        const newAchievements = gamification.checkForAchievements();
        newAchievements.forEach(key => {
            ui.showToast('achievement', achievements[key]);
            playBeep(880, 200, 0.5);
        });

        if (newMissions.length > 0 || newAchievements.length > 0) {
            ui.renderDashboard();
            ui.updateGamificationUI();
            saveState();
        }
    }
    
    function handleAddTask() {
        const taskName = dom.newTaskInput.value.trim();
        const estimate = parseInt(dom.newTaskEstimateInput.value);
        const newTask = tasks.addTask(taskName, estimate);
        if (newTask) {
            dom.newTaskInput.value = '';
            dom.newTaskEstimateInput.value = '1';
            playBeep(440, 100, 0.2);
            if (!state.selectedTaskId || state.tasks.find(t => t.id === state.selectedTaskId)?.completed) {
                tasks.selectTask(newTask.id);
                timer.resetTimer('focus');
                ui.updateUI();
            }
            ui.renderTasks();
            saveState();
        }
    }

    function handleStartPauseLogic() {
        if (state.isRunning) {
            if (state.settings.focusMethod === 'adaptativo' && state.mode === 'focus') {
                clearInterval(state.timerInterval);
                state.timerInterval = null;
                handleSessionEnd();
            } else {
                timer.pauseTimer();
            }
        } else {
            const startResult = timer.startTimer();
            if (startResult === 'NO_TASK') {
                ui.showModal(dom.alertModalOverlay, 'Por favor, selecione uma tarefa para iniciar o foco.');
            } else if (startResult) {
                state.timerInterval = setInterval(handleTimerTick, 1000);
                checkGains();
            }
        }
        ui.updateUI();
    }

    // --- EVENT LISTENERS ---
    dom.startPauseBtn.addEventListener('click', () => {
        if (!state.audioInitialized) state.audioContext.resume().then(() => state.audioInitialized = true);
        dom.xpGainDisplay.textContent = '';
        dom.coinGainDisplay.textContent = '';
        
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isIOS && !state.isRunning && state.settings.focusMethod === 'pomodoro') {
            // Lógica IOS
        } else {
            handleStartPauseLogic();
        }
    });

    // ... todos os seus outros event listeners originais (reset, add task, etc.)
    dom.logoutBtn.addEventListener('click', signOutUser);
    
    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
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

// --- PONTO DE ENTRADA PRINCIPAL DO APP ---
document.addEventListener('DOMContentLoaded', () => {
    dom.loginBtn.addEventListener('click', signInWithGoogle);

    initFirebaseAuth((user, isInitialAuthComplete) => {
        if (!isInitialAuthComplete) return; // Espera a verificação inicial terminar

        if (user) {
            showAppScreen(user);
        } else {
            showLoginScreen();
        }
    });
});
