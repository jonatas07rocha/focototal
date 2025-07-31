// missions.js

/**
 * Estrutura de uma Missão:
 * id: Identificador único da missão.
 * type: 'daily' (aparece aleatoriamente a cada dia) ou 'secret' (desbloqueada por uma ação específica).
 * title: O nome da missão.
 * description: O que o usuário precisa fazer.
 * emoji: Um ícone para representar a missão.
 * rewards: { xp: number, coins: number } - Recompensas ao completar.
 * metric: A chave de dados que a missão rastreia (ex: 'focusTimeToday', 'tasksCompletedToday').
 * goal: O valor numérico que o usuário precisa alcançar na métrica.
 * isSecret: (Apenas para tipo 'secret') Uma função que verifica se a condição para revelar o desafio foi atendida.
 * isUnlocked: (Apenas para tipo 'secret') Uma função que verifica se o desafio foi completado.
 */

export const missionsData = {
    // --- MISSÕES DIÁRIAS ---
    // A cada dia, algumas destas serão selecionadas aleatoriamente.
    DAILY_FOCUS_30M: {
        id: 'DAILY_FOCUS_30M',
        type: 'daily',
        title: 'Foco Rápido',
        description: 'Acumule 30 minutos de foco total.',
        emoji: '⏱️',
        rewards: { xp: 20, coins: 5 },
        metric: 'focusTimeToday',
        goal: 1800 // 30 minutos em segundos
    },
    DAILY_FOCUS_60M: {
        id: 'DAILY_FOCUS_60M',
        type: 'daily',
        title: 'Sessão Produtiva',
        description: 'Acumule 1 hora de foco total.',
        emoji: '⏳',
        rewards: { xp: 50, coins: 15 },
        metric: 'focusTimeToday',
        goal: 3600 // 60 minutos em segundos
    },
    DAILY_COMPLETE_2_POMODOROS: {
        id: 'DAILY_COMPLETE_2_POMODOROS',
        type: 'daily',
        title: 'Dois é Bom',
        description: 'Complete 2 ciclos Pomodoro.',
        emoji: '🍅✌️',
        rewards: { xp: 25, coins: 10 },
        metric: 'pomodorosCompletedToday',
        goal: 2
    },
    DAILY_COMPLETE_4_POMODOROS: {
        id: 'DAILY_COMPLETE_4_POMODOROS',
        type: 'daily',
        title: 'Poder Pomodoro',
        description: 'Complete 4 ciclos Pomodoro.',
        emoji: '🍅💪',
        rewards: { xp: 60, coins: 20 },
        metric: 'pomodorosCompletedToday',
        goal: 4
    },
    DAILY_COMPLETE_3_TASKS: {
        id: 'DAILY_COMPLETE_3_TASKS',
        type: 'daily',
        title: 'Trio de Tarefas',
        description: 'Conclua 3 tarefas da sua lista.',
        emoji: '✅✅✅',
        rewards: { xp: 30, coins: 10 },
        metric: 'tasksCompletedToday',
        goal: 3
    },
    DAILY_COMPLETE_5_TASKS: {
        id: 'DAILY_COMPLETE_5_TASKS',
        type: 'daily',
        title: 'Manda-Chuva das Tarefas',
        description: 'Conclua 5 tarefas da sua lista.',
        emoji: '🏆',
        rewards: { xp: 75, coins: 25 },
        metric: 'tasksCompletedToday',
        goal: 5
    },
    DAILY_NO_INTERRUPTIONS: {
        id: 'DAILY_NO_INTERRUPTIONS',
        type: 'daily',
        title: 'Foco Inabalável',
        description: 'Complete 2 sessões de foco seguidas sem interrupções.',
        emoji: '🧘',
        rewards: { xp: 50, coins: 15 },
        metric: 'uninterruptedSessionsToday',
        goal: 2
    },

    // --- DESAFIOS SECRETOS ---
    // Estes são verificados constantemente e aparecem quando completados.
    SECRET_NIGHT_OWL: {
        id: 'SECRET_NIGHT_OWL',
        type: 'secret',
        title: 'Coruja da Noite',
        description: 'Completou uma sessão de foco após as 22h.',
        emoji: '🦉',
        rewards: { xp: 100, coins: 30 },
        // A lógica de verificação está diretamente no main.js
    },
    SECRET_EARLY_BIRD: {
        id: 'SECRET_EARLY_BIRD',
        type: 'secret',
        title: 'Pássaro Madrugador',
        description: 'Iniciou uma sessão de foco antes das 6h.',
        emoji: '🐦',
        rewards: { xp: 100, coins: 30 },
         // A lógica de verificação está diretamente no main.js
    },
    SECRET_THEME_EXPLORER: {
        id: 'SECRET_THEME_EXPLORER',
        type: 'secret',
        title: 'Explorador de Temas',
        description: 'Experimentou 3 temas diferentes em um dia.',
        emoji: '🎨',
        rewards: { xp: 50, coins: 10 },
        // A lógica de verificação está diretamente no main.js
    },
};
