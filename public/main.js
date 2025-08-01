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

document.addEventListener('DOMContentLoaded', () => {

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

    // --- EVENT LISTENERS ---

    // Controles do Timer
    dom.startPauseBtn.addEventListener('click', () => {
        if (!state.audioInitialized) state.audioContext.resume().then(() => state.audioInitialized = true);
        dom.xpGainDisplay.textContent = '';
        dom.coinGainDisplay.textContent = '';
        
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
    });

    dom.resetBtn.addEventListener('click', () => ui.showModal(dom.resetConfirmModalOverlay));
    dom.resetConfirmBtn.addEventListener('click', () => {
        timer.resetDay();
        ui.renderTasks();
        ui.hideModal(dom.resetConfirmModalOverlay);
        ui.showModal(dom.alertModalOverlay, 'O dia foi zerado com sucesso!');
    });

    // Controles de Tarefas
    dom.addTaskBtn.addEventListener('click', handleAddTask);

    dom.newTaskInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    });

    if (dom.toggleCompletedTasksBtn) {
        dom.toggleCompletedTasksBtn.addEventListener('click', () => {
            tasks.toggleShowCompleted();
            ui.updateShowCompletedBtn();
            ui.renderTasks();
            saveState();
        });
    }
    
    dom.taskListEl.addEventListener('click', (e) => {
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
                     ui.showModal(dom.alertModalOverlay, `Parabéns! Você alcançou o Nível ${state.gamification.level}!`);
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

    dom.taskListEl.addEventListener('focusout', (e) => {
        if (e.target.matches('.task-edit-input')) {
            const id = parseInt(e.target.dataset.editInputId);
            tasks.updateTaskName(id, e.target.value.trim());
            ui.renderTasks();
            saveState();
        }
    });
    
    dom.taskListEl.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' && e.target.matches('.task-edit-input')) {
            e.target.blur();
        }
    });

    // Outros Controles da UI
    dom.settingsBtn.addEventListener('click', () => {
        ui.renderPaletteSelector();
        ui.showModal(dom.settingsModalOverlay);
    });

    dom.settingsSaveBtn.addEventListener('click', () => {
        state.settings.focusDuration = parseInt(dom.focusDurationInput.value) || 25;
        state.settings.shortBreakDuration = parseInt(dom.shortBreakDurationInput.value) || 5;
        state.settings.longBreakDuration = parseInt(dom.longBreakDurationInput.value) || 15;
        state.settings.longBreakInterval = parseInt(dom.longBreakIntervalInput.value) || 4;
        ui.hideModal(dom.settingsModalOverlay);
        if (!state.isRunning) {
            timer.resetTimer('focus');
            ui.updateUI();
        }
        saveState();
    });

    dom.colorPaletteSelector.addEventListener('click', (e) => {
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

    dom.focusMethodToggle.addEventListener('click', (e) => {
        const target = e.target.closest('.method-btn');
        if (target && !state.isRunning) {
            state.settings.focusMethod = target.dataset.method;
            ui.updateMethodToggleUI();
            timer.resetTimer('focus');
            ui.renderTasks();
            ui.updateUI();
            saveState();
        } else if (state.isRunning) {
            ui.showModal(dom.alertModalOverlay, 'Não é possível trocar de modo enquanto o timer está rodando.');
        }
    });

    // Fechar Modais
    [dom.alertModalOverlay, dom.settingsModalOverlay, dom.dashboardModalOverlay, dom.helpModalOverlay, dom.resetConfirmModalOverlay, dom.sessionEndModalOverlay].forEach(overlay => {
        overlay.addEventListener('click', (e) => { if (e.target === overlay) ui.hideModal(overlay); });
    });
    [dom.alertModalCloseBtn, dom.sessionEndCloseBtn, dom.dashboardModalCloseBtn, dom.helpModalCloseBtn, dom.resetCancelBtn].forEach(btn => {
        btn.addEventListener('click', () => ui.hideModal(btn.closest('.modal-overlay')));
    });

    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
    function initializeApp() {
        loadState();
        
        // Aplica o estado carregado à UI
        ui.applyTheme(state.settings.theme);
        ui.updateMethodToggleUI();
        ui.renderTasks();
        ui.updateGamificationUI();
        ui.renderDashboard();
        ui.updateUI();
        // CORREÇÃO: Garante que o texto do botão seja atualizado ao carregar a página.
        ui.updateShowCompletedBtn();
        
        // Reinicia o timer se necessário
        if (state.isRunning) {
            state.timerInterval = setInterval(handleTimerTick, 1000);
        }
        
        gamification.generateDailyMissions();
        saveState(); // Salva caso missões tenham sido geradas
        
        lucide.createIcons();
    }

    initializeApp();
});
