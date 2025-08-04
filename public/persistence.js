/**
 * persistence.js
 * Módulo para gerenciar a persistência de dados no Firestore.
 * Inclui lógica de migração do localStorage para a nuvem.
 */

import { state } from './state.js';
import { dom } from './ui.js';
// Correção: Remove os imports modulares para usar as funções compatíveis.
// import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore-compat.js";

const db = firebase.firestore();

// Salva o estado atual no Firestore.
export async function saveState() {
    const stateToSave = {
        tasks: state.tasks,
        selectedTaskId: state.selectedTaskId,
        pomodoroSessionCount: state.pomodoroSessionCount,
        uninterruptedSessionsToday: state.uninterruptedSessionsToday,
        settings: state.settings,
        gamification: { ...state.gamification, changedThemesCount: Array.from(state.gamification.changedThemesCount) },
        timerState: {
            isRunning: state.isRunning,
            mode: state.mode,
            endTime: state.endTime,
            totalTime: state.totalTime
        }
    };
    
    // Se o usuário estiver autenticado, salva no Firestore.
    if (state.isAuthenticated && state.userId) {
        try {
            await db.collection("users").doc(state.userId).set(stateToSave);
        } catch (error) {
            console.error("Erro ao salvar estado no Firestore:", error);
            // Continua salvando no localStorage como fallback
            localStorage.setItem('pomodoroAppState', JSON.stringify(stateToSave));
        }
    } else {
        // Se não houver autenticação, salva apenas no localStorage.
        localStorage.setItem('pomodoroAppState', JSON.stringify(stateToSave));
    }
}

// Carrega o estado do Firestore, com fallback para localStorage e migração.
export async function loadState() {
    let savedState = null;

    // Tenta carregar do Firestore se o usuário estiver autenticado
    if (state.isAuthenticated && state.userId) {
        try {
            const docRef = await db.collection("users").doc(state.userId).get();
            if (docRef.exists) {
                savedState = docRef.data();
                console.log("Dados carregados do Firestore.");
            }
        } catch (error) {
            console.error("Erro ao carregar do Firestore:", error);
        }
    }

    // Se não encontrou dados no Firestore, tenta carregar do localStorage
    if (!savedState) {
        const savedStateJSON = localStorage.getItem('pomodoroAppState');
        if (savedStateJSON) {
            savedState = JSON.parse(savedStateJSON);
            console.log("Dados carregados do localStorage.");
            
            // Lógica de Migração: se o usuário logou, mas os dados estavam no localStorage,
            // salva-os no Firestore para que fiquem sincronizados.
            if (state.isAuthenticated && state.userId) {
                 console.log("Iniciando migração de dados para o Firestore...");
                 await saveState();
                 localStorage.removeItem('pomodoroAppState');
            }
        }
    }

    if (!savedState) return;
    
    // Hidrata o objeto de estado com os dados salvos.
    state.tasks = savedState.tasks || [];
    state.selectedTaskId = savedState.selectedTaskId;
    state.pomodoroSessionCount = savedState.pomodoroSessionCount || 0;
    state.uninterruptedSessionsToday = savedState.uninterruptedSessionsToday || 0;
    state.showCompletedTasks = savedState.showCompletedTasks || false;
    Object.assign(state.settings, savedState.settings);
    Object.assign(state.gamification, savedState.gamification);
    
    // Restaura o timer se ele estava a ser executado quando a aplicação foi fechada.
    if (savedState.timerState) {
        const { isRunning: wasRunning, mode: savedMode, endTime: savedEndTime, totalTime: savedTotalTime } = savedState.timerState;
        if (wasRunning && savedEndTime && savedEndTime > Date.now()) {
            state.isRunning = true;
            state.mode = savedMode;
            state.totalTime = savedTotalTime;
            state.endTime = savedEndTime;
            state.timeRemaining = Math.round((state.endTime - Date.now()) / 1000);
        }
    }
    
    // Garante que nenhuma tarefa carregue em modo de edição.
    state.tasks.forEach(task => task.isEditing = false); 

    // Converte o array salvo de volta para um Set.
    state.gamification.changedThemesCount = new Set(savedState.gamification.changedThemesCount || []);

    // Atualiza os inputs de configuração com os valores carregados
    if (dom.focusDurationInput) dom.focusDurationInput.value = state.settings.focusDuration;
    if (dom.shortBreakDurationInput) dom.shortBreakDurationInput.value = state.settings.shortBreakDuration;
    if (dom.longBreakDurationInput) dom.longBreakDurationInput.value = state.settings.longBreakDuration;
    if (dom.longBreakIntervalInput) dom.longBreakIntervalInput.value = state.settings.longBreakInterval;
}
