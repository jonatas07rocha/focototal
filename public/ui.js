/**
 * ui.js
 * * Módulo para centralizar todas as referências a elementos do DOM.
 */

export const dom = {
    // Meta
    themeColorMeta: document.getElementById('theme-color-meta'),
    
    // CORREÇÃO: Adiciona seletores de contêineres principais
    loginContainer: document.getElementById('login-container'),
    appContainer: document.getElementById('app-container'),

    // CORREÇÃO: Adiciona seletores de login/logout
    loginBtn: document.getElementById('login-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    userProfile: document.getElementById('user-profile'),
    userAvatar: document.getElementById('user-avatar'),
    
    // Timer e Controles Principais
    timerDisplay: document.getElementById('timer-display'),
    startPauseBtn: document.getElementById('start-pause-btn'),
    internalInterruptBtn: document.getElementById('internal-interrupt-btn'),
    externalInterruptBtn: document.getElementById('external-interrupt-btn'),
    progressRing: document.getElementById('progress-ring'),
    
    // Painel de Tarefas
    taskListEl: document.getElementById('task-list'),
    newTaskInput: document.getElementById('new-task-input'),
    newTaskEstimateInput: document.getElementById('new-task-estimate'),
    newTaskEstimateLabel: document.getElementById('new-task-estimate-label'),
    addTaskBtn: document.getElementById('add-task-btn'),
    currentTaskDisplay: document.getElementById('current-task-display'),
    toggleCompletedTasksBtn: document.getElementById('toggle-completed-tasks-btn'),
    
    // Controles Secundários e Cabeçalho
    resetBtn: document.getElementById('reset-btn'),
    settingsBtn: document.getElementById('settings-btn'),
    dashboardBtn: document.getElementById('dashboard-btn'),
    helpBtn: document.getElementById('help-btn'),
    focusMethodToggle: document.getElementById('focus-method-toggle'),
    pomodoroCyclesEl: document.getElementById('pomodoro-cycles'),

    // Gamificação na UI Principal
    levelDisplay: document.getElementById('level-display'),
    xpDisplay: document.getElementById('xp-display'),
    xpNextLevelDisplay: document.getElementById('xp-next-level-display'),
    xpBarFill: document.getElementById('xp-bar-fill'),
    coinsDisplay: document.getElementById('coins-display'),
    streakDisplay: document.getElementById('streak-display'),

    // Modais e Overlays
    alertModalOverlay: document.getElementById('alert-modal-overlay'),
    alertModalCloseBtn: document.getElementById('alert-modal-close-btn'),
    sessionEndModalOverlay: document.getElementById('session-end-modal-overlay'),
    sessionEndCloseBtn: document.getElementById('session-end-close-btn'),
    settingsModalOverlay: document.getElementById('settings-modal-overlay'),
    settingsSaveBtn: document.getElementById('settings-save-btn'),
    helpModalOverlay: document.getElementById('help-modal-overlay'),
    helpModalCloseBtn: document.getElementById('help-modal-close-btn'),
    resetConfirmModalOverlay: document.getElementById('reset-confirm-modal-overlay'),
    resetConfirmBtn: document.getElementById('reset-confirm-btn'),
    resetCancelBtn: document.getElementById('reset-cancel-btn'),
    dashboardModalOverlay: document.getElementById('dashboard-modal-overlay'),
    dashboardModalCloseBtn: document.getElementById('dashboard-modal-close-btn'),
    
    // Elementos dentro dos Modais
    xpGainDisplay: document.getElementById('xp-gain-display'),
    coinGainDisplay: document.getElementById('coin-gain-display'),
    focusDurationInput: document.getElementById('focus-duration'),
    shortBreakDurationInput: document.getElementById('short-break-duration'),
    longBreakDurationInput: document.getElementById('long-break-duration'),
    longBreakIntervalInput: document.getElementById('long-break-interval'),
    colorPaletteSelector: document.getElementById('color-palette-selector'),
    
    // Conteúdo do Dashboard
    dashboardStatsContent: document.getElementById('dashboard-stats-content'),
    dashboardMissionsContent: document.getElementById('dashboard-missions-content'),
    dashboardAchievementsContent: document.getElementById('dashboard-achievements-content'),
    dashboardCurrentStreak: document.getElementById('dashboard-current-streak'),
    dashboardLongestStreak: document.getElementById('dashboard-longest-streak'),
    dashboardDailyReport: document.getElementById('dashboard-daily-report'),

    // Notificações Toast
    achievementToast: document.getElementById('achievement-toast'),
    achievementToastName: document.getElementById('achievement-toast-name'),
    missionToast: document.getElementById('mission-toast'),
    missionToastName: document.getElementById('mission-toast-name'),
    missionToastEmoji: document.getElementById('mission-toast-emoji'),

    // Banner de Instalação PWA
    installBanner: document.getElementById('install-banner'),
    installBtn: document.getElementById('install-btn'),
    installDismissBtn: document.getElementById('install-dismiss-btn'),

    // Seletores da Loja
    shopBtn: document.getElementById('shop-btn'),
    shopModalOverlay: document.getElementById('shop-modal-overlay'),
    shopModalCloseBtn: document.getElementById('shop-modal-close-btn'),
    shopCoinsDisplay: document.getElementById('shop-coins-display'),
    shopCollectionsContainer: document.getElementById('shop-collections-container'),

    // Seletores do iOS
    iosStartPromptModalOverlay: document.getElementById('ios-start-prompt-modal-overlay'),
    iosPromptConfirmBtn: document.getElementById('ios-prompt-confirm-btn'),
    iosPromptCancelBtn: document.getElementById('ios-prompt-cancel-btn'),
    iosPromptTitle: document.getElementById('ios-prompt-title'),
    iosPromptMessage: document.getElementById('ios-prompt-message'),

    // Conteúdo de Ajuda
    helpContentPomodoro: document.getElementById('help-content-pomodoro'),
    helpContentAdaptativo: document.getElementById('help-content-adaptativo'),
};
