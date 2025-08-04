// Módulos do Firebase para autenticação
// Nota: Usamos a versão 9.6.10, compatível com a interface original.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth-compat.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore-compat.js";

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

// --- CONFIGURAÇÃO E AUTENTICAÇÃO DO FIREBASE ---
// Assegura que o código só é executado quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {

    // Referências estendidas para os novos elementos da UI
    const combinedDom = {
        ...dom, // Preserva as referências DOM originais
        loadingContainer: document.getElementById('loading-container'),
        loginContainer: document.getElementById('login-container'),
        appContainer: document.getElementById('app-container'),
        loginBtn: document.getElementById('login-btn'),
        logoutBtn: document.getElementById('logout-btn'),
        userAvatar: document.getElementById('user-avatar'),
        userProfile: document.getElementById('user-profile')
    };
    
    // Obtenção da configuração e inicialização do Firebase
    // Nota: '__firebase_config' é uma variável global fornecida pelo ambiente.
    const firebaseConfig = JSON.parse(__firebase_config);
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const provider = new GoogleAuthProvider();

    // --- LÓGICA DE CONTROLE ORIGINAL (Orquestrador do aplicativo) ---

    // As funções abaixo foram mantidas a partir do seu código original.
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
                ui.showModal(combinedDom.alertModalOverlay, `Sequência de ${streakInfo.streak} dias! Você ganhou ${streakInfo.bonus} moedas de bônus!`);
            }
            
            const xpGained = Math.floor(focusDuration / 60);
            const leveledUp = gamification.addXP(xpGained);
            gamification.addCoins(5);

            if (leveledUp) {
                playBeep(659, 150, 0.4);
                setTimeout(() => playBeep(784, 300, 0.5), 200);
                ui.showModal(combinedDom.alertModalOverlay, `Parabéns! Você alcançou o Nível ${state.gamification.level}!`);
            }
            
            const endMessage = state.settings.focusMethod === 'pomodoro'
                ? 'Você completou um Pomodoro! Hora de fazer uma pausa.'
                : 'Sessão de foco finalizada!';
            ui.showModal(combinedDom.sessionEndModalOverlay, endMessage);

            combinedDom.xpGainDisplay.textContent = `+${xpGained} XP`;
            combinedDom.coinGainDisplay.textContent = `+5 Moedas`;

        } else {
            ui.showModal(combinedDom.sessionEndModalOverlay, 'Pausa finalizada! Vamos voltar ao trabalho?');
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
        const taskName = combinedDom.newTaskInput.value.trim();
        const estimate = parseInt(combinedDom.newTaskEstimateInput.value);
        const newTask = tasks.addTask(taskName, estimate);
        if (newTask) {
            combinedDom.newTaskInput.value = '';
            combinedDom.newTaskEstimateInput.value = '1';
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
                ui.showModal(combinedDom.alertModalOverlay, 'Por favor, selecione uma tarefa para iniciar o foco.');
            } else if (startResult) {
                state.timerInterval = setInterval(handleTimerTick, 1000);
                checkGains();
            }
        }
        ui.updateUI();
    }

    // --- EVENT LISTENERS originais ---

    // Controles do Timer
    combinedDom.startPauseBtn.addEventListener('click', () => {
        if (!state.audioInitialized) state.audioContext.resume().then(() => state.audioInitialized = true);
        combinedDom.xpGainDisplay.textContent = '';
        combinedDom.coinGainDisplay.textContent = '';
        
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isIOS && !state.isRunning && state.settings.focusMethod === 'pomodoro') {
            if (state.mode === 'focus') {
                combinedDom.iosPromptTitle.textContent = 'Lembrete de Foco';
                combinedDom.iosPromptMessage.textContent = 'Para garantir o alarme no final do foco, recomendamos criar um lembrete. Deseja fazer isso agora?';
            } else {
                combinedDom.iosPromptTitle.textContent = 'Lembrete de Pausa';
                combinedDom.iosPromptMessage.textContent = 'Para garantir o alarme no final da pausa, recomendamos criar um lembrete. Deseja fazer isso agora?';
            }
            ui.showModal(combinedDom.iosStartPromptModalOverlay);
        } else {
            handleStartPauseLogic();
        }
    });

    combinedDom.iosPromptConfirmBtn.addEventListener('click', () => {
        let duration, eventTitle, eventDescription;
        const appUrl = 'https://focototal.vercel.app';

        if (state.mode === 'focus') {
            const task = state.tasks.find(t => t.id === state.selectedTaskId);
            eventTitle = `🎉 Fim do Foco: ${task ? task.name : 'Foco'}`;
            eventDescription = `Sua sessão de foco terminou. Hora de fazer uma pausa! Volte ao app: ${appUrl}`;
            duration = state.settings.focusDuration;
        } else {
            eventTitle = state.mode === 'shortBreak' ? `🚀 Fim da Pausa Curta` : `🏆 Fim da Pausa Longa`;
            eventDescription = `Sua pausa acabou. Hora de voltar ao foco! Volte ao app: ${appUrl}`;
            duration = state.mode === 'shortBreak' ? state.settings.shortBreakDuration : state.settings.longBreakDuration;
        }
        
        const formatDT = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const eventStartTime = new Date(Date.now() + duration * 60 * 1000);
        const eventEndTime = new Date(eventStartTime.getTime() + 1 * 60 * 1000);
        
        const icsContent = [
            'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//FocoTotal//PWA//PT',
            'BEGIN:VEVENT', 'UID:' + Date.now() + '@focototal.app', 'DTSTAMP:' + formatDT(new Date()),
            'DTSTART:' + formatDT(eventStartTime), 'DTEND:' + formatDT(eventEndTime),
            'SUMMARY:' + eventTitle, 
            'DESCRIPTION:' + eventDescription,
            'URL;VALUE=URI:' + appUrl,
            'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + eventDescription, 'TRIGGER:-PT0S', 'END:VALARM',
            'END:VEVENT', 'END:VCALENDAR'
        ].join('\r\n');
        
        const base64Content = btoa(unescape(encodeURIComponent(icsContent)));
        window.location.href = `data:text/calendar;base64,${base64Content}`;

        handleStartPauseLogic();
        ui.hideModal(combinedDom.iosStartPromptModalOverlay);
    });

    combinedDom.iosPromptCancelBtn.addEventListener('click', () => {
        handleStartPauseLogic();
        ui.hideModal(combinedDom.iosStartPromptModalOverlay);
    });

    combinedDom.resetBtn.addEventListener('click', () => ui.showModal(combinedDom.resetConfirmModalOverlay));
    combinedDom.resetConfirmBtn.addEventListener('click', () => {
        timer.resetDay();
        ui.renderTasks();
        ui.hideModal(combinedDom.resetConfirmModalOverlay);
        ui.showModal(combinedDom.alertModalOverlay, 'O dia foi zerado com sucesso!');
    });

    // Controles de Tarefas
    combinedDom.addTaskBtn.addEventListener('click', handleAddTask);

    combinedDom.newTaskInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    });

    if (combinedDom.toggleCompletedTasksBtn) {
        combinedDom.toggleCompletedTasksBtn.addEventListener('click', () => {
            tasks.toggleShowCompleted();
            ui.updateShowCompletedBtn();
            ui.renderTasks();
            saveState();
        });
    }
    
    combinedDom.taskListEl.addEventListener('click', (e) => {
        if (e.target.matches('.task-edit-input')) {
            return;
        }

        const target = e.target.closest('[data-id], [data-complete-id], [data-edit-id], [data-delete-id]');
        if (!target) return;

        const id = parseInt(target.dataset.id || target.dataset.completeId || target.dataset.editId || target.dataset.deleteId);

        if (target.matches('[data-complete-id]')) {
            const wasCompleted = tasks.toggleTaskCompleted(id);
            if (wasCompleted) {
                const leveledUp = gamification.addXP(10);
                gamification.addCoins(2);
                if (leveledUp) {
                     ui.showModal(combinedDom.alertModalOverlay, `Parabéns! Você alcançou o Nível ${state.gamification.level}!`);
                }
                checkGains();
            }
            if (state.isRunning && state.selectedTaskId === id) {
                timer.pauseTimer();
                timer.resetTimer('focus');
            }
        } else if (target.matches('[data-edit-id]')) {
            tasks.toggleEditState(id);
        } else if (target.matches('[data-delete-id]')) {
            tasks.deleteTask(id);
        } else if (target.matches('[data-id]')) {
            tasks.selectTask(id);
            timer.resetTimer('focus');
        }
        
        ui.renderTasks();
        ui.updateUI();
        ui.updateGamificationUI();
        saveState();
    });

    combinedDom.taskListEl.addEventListener('focusout', (e) => {
        if (e.target.matches('.task-edit-input')) {
            const id = parseInt(e.target.dataset.editInputId);
            tasks.updateTaskName(id, e.target.value.trim());
            ui.renderTasks();
            saveState();
        }
    });
    
    combinedDom.taskListEl.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' && e.target.matches('.task-edit-input')) {
            e.target.blur();
        }
    });

    // Outros Controles da UI
    combinedDom.settingsBtn.addEventListener('click', () => {
        ui.renderPaletteSelector();
        ui.showModal(combinedDom.settingsModalOverlay);
    });

    combinedDom.dashboardBtn.addEventListener('click', () => {
        ui.renderDashboard();
        ui.showModal(combinedDom.dashboardModalOverlay);
    });

    if (combinedDom.dashboardModalOverlay) {
        const tabButtons = combinedDom.dashboardModalOverlay.querySelectorAll('.dashboard-tab');
        const tabContents = combinedDom.dashboardModalOverlay.querySelectorAll('.dashboard-tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;

                tabButtons.forEach(btn => {
                    btn.classList.toggle('active', btn === button);
                });

                tabContents.forEach(content => {
                    content.classList.toggle('hidden', content.id !== `dashboard-${tabName}-content`);
                });
            });
        });
    }

    combinedDom.shopBtn.addEventListener('click', () => {
        shop.renderShop();
        ui.showModal(combinedDom.shopModalOverlay);
    });

    combinedDom.shopCollectionsContainer.addEventListener('click', (e) => {
        const buyButton = e.target.closest('.buy-btn');
        if (buyButton && !buyButton.disabled) {
            shop.buyItem(buyButton.dataset.itemId);
        }
    });

    combinedDom.helpBtn.addEventListener('click', () => {
        const isPomodoro = state.settings.focusMethod === 'pomodoro';
        combinedDom.helpContentPomodoro.classList.toggle('hidden', !isPomodoro);
        combinedDom.helpContentAdaptativo.classList.toggle('hidden', isPomodoro);
        ui.showModal(combinedDom.helpModalOverlay);
    });


    combinedDom.settingsSaveBtn.addEventListener('click', () => {
        state.settings.focusDuration = parseInt(combinedDom.focusDurationInput.value) || 25;
        state.settings.shortBreakDuration = parseInt(combinedDom.shortBreakDurationInput.value) || 5;
        state.settings.longBreakDuration = parseInt(combinedDom.longBreakDurationInput.value) || 15;
        state.settings.longBreakInterval = parseInt(combinedDom.longBreakIntervalInput.value) || 4;
        ui.hideModal(combinedDom.settingsModalOverlay);
        if (!state.isRunning) {
            timer.resetTimer('focus');
            ui.updateUI();
        }
        saveState();
    });

    combinedDom.colorPaletteSelector.addEventListener('click', (e) => {
        const target = e.target.closest('button[data-theme]');
        if (target) {
            state.settings.theme = target.dataset.theme;
            ui.applyTheme(state.settings.theme);
            ui.renderPaletteSelector();
            ui.updateMethodToggleUI();
            ui.updateUI();
            saveState();
        }
    });

    combinedDom.focusMethodToggle.addEventListener('click', (e) => {
        const target = e.target.closest('.method-btn');
        if (target && !state.isRunning) {
            state.settings.focusMethod = target.dataset.method;
            ui.updateMethodToggleUI();
            timer.resetTimer('focus');
            ui.renderTasks();
            ui.updateUI();
            saveState();
        } else if (state.isRunning) {
            ui.showModal(combinedDom.alertModalOverlay, 'Não é possível trocar de modo enquanto o timer está rodando.');
        }
    });

    // Fechar Modais
    [combinedDom.alertModalOverlay, combinedDom.settingsModalOverlay, combinedDom.dashboardModalOverlay, combinedDom.helpModalOverlay, combinedDom.resetConfirmModalOverlay, combinedDom.sessionEndModalOverlay, combinedDom.shopModalOverlay, combinedDom.iosStartPromptModalOverlay].forEach(overlay => {
        overlay.addEventListener('click', (e) => { if (e.target === overlay) ui.hideModal(overlay); });
    });
    [combinedDom.alertModalCloseBtn, combinedDom.sessionEndCloseBtn, combinedDom.dashboardModalCloseBtn, combinedDom.helpModalCloseBtn, combinedDom.resetCancelBtn, combinedDom.shopModalCloseBtn].forEach(btn => {
        if(btn) btn.addEventListener('click', () => ui.hideModal(btn.closest('.modal-overlay')));
    });

    // --- LÓGICA DE AUTENTICAÇÃO E INICIALIZAÇÃO DA APLICAÇÃO ---

    /**
     * @description Inicia a lógica principal da aplicação.
     * Esta função é chamada apenas após a autenticação bem-sucedida.
     */
    function initializeApp() {
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

    // Listener para o botão de login do Firebase
    combinedDom.loginBtn.addEventListener('click', async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Erro no login:", error);
            ui.showModal(combinedDom.alertModalOverlay, `Erro ao fazer login: ${error.message}`);
        }
    });

    // Listener para o botão de logout
    combinedDom.logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            // O ouvinte onAuthStateChanged lida com a atualização da UI após o logout
        } catch (error) {
            console.error("Erro no logout:", error);
            ui.showModal(combinedDom.alertModalOverlay, `Erro ao sair: ${error.message}`);
        }
    });

    /**
     * @description Observador do estado de autenticação do Firebase.
     * É a lógica central que alterna entre as telas de login e a aplicação.
     */
    onAuthStateChanged(auth, (user) => {
        // Esconde a tela de carregamento, independentemente do estado de autenticação.
        combinedDom.loadingContainer.classList.add('hidden');
        if (user) {
            // Usuário logado
            console.log("Usuário autenticado:", user.uid);
            combinedDom.loginContainer.classList.add('hidden');
            combinedDom.appContainer.classList.remove('hidden');
            
            // Atualiza a UI com dados do usuário
            combinedDom.userAvatar.src = user.photoURL || 'https://placehold.co/40x40/5c6b73/ffffff?text=U';
            combinedDom.userProfile.classList.remove('hidden');
            
            // Inicia a aplicação principal
            initializeApp();
        } else {
            // Usuário não logado
            console.log("Nenhum usuário autenticado.");
            combinedDom.appContainer.classList.add('hidden');
            combinedDom.loginContainer.classList.remove('hidden');
            combinedDom.userProfile.classList.add('hidden');
        }
    });
});