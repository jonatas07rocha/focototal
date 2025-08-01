/**
 * persistence.js
 * Módulo para salvar e carregar o estado da aplicação no localStorage.
 */

import { state } from './state.js';

// Salva o estado atual no localStorage.
export function saveState() {
    const stateToSave = {
        tasks: state.tasks,
        selectedTaskId: state.selectedTaskId,
        pomodoroSessionCount: state.pomodoroSessionCount,
        uninterruptedSessionsToday: state.uninterruptedSessionsToday,
        settings: state.settings,
        gamification: state.gamification,
        timerState: {
            isRunning: state.isRunning,
            mode: state.mode,
            endTime: state.endTime,
            totalTime: state.totalTime
        }
    };
    // Converte o Set para um Array para que possa ser salvo como JSON.
    const serializableGamification = { ...state.gamification, changedThemesCount: Array.from(state.gamification.changedThemesCount) };
    stateToSave.gamification = serializableGamification;

    localStorage.setItem('pomodoroAppState', JSON.stringify(stateToSave));
}

// Carrega o estado do localStorage.
export function loadState() {
    const savedStateJSON = localStorage.getItem('pomodoroAppState');
    if (!savedStateJSON) return;

    const savedState = JSON.parse(savedStateJSON);
    
    // Hidrata o objeto de estado com os dados salvos.
    state.tasks = savedState.tasks || [];
    state.selectedTaskId = savedState.selectedTaskId;
    state.pomodoroSessionCount = savedState.pomodoroSessionCount || 0;
    state.uninterruptedSessionsToday = savedState.uninterruptedSessionsToday || 0;
    Object.assign(state.settings, savedState.settings);
    Object.assign(state.gamification, savedState.gamification);
    
    // Restaura o timer se ele estava rodando quando o app foi fechado.
    if (savedState.timerState) {
        const { isRunning: wasRunning, mode: savedMode, endTime: savedEndTime, totalTime: savedTotalTime } = savedState.timerState;
        if (wasRunning && savedEndTime && savedEndTime > Date.now()) {
            state.isRunning = true;
            state.mode = savedMode;
            state.totalTime = savedTotalTime;
            state.endTime = savedEndTime;
            state.timeRemaining = Math.round((state.endTime - Date.now()) / 1000);
            // O timer em si será reiniciado na inicialização principal.
        }
    }
    
    // Garante que nenhuma tarefa carregue em modo de edição.
    state.tasks.forEach(task => task.isEditing = false); 

    // Converte o array salvo de volta para um Set.
    state.gamification.changedThemesCount = new Set(savedState.gamification.changedThemesCount || []);
}
