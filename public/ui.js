/**
 * ui.js
 * Módulo para centralizar todas as referências a elementos do DOM.
 * ---
 * CORRIGIDO: A inicialização dos elementos foi movida para uma função
 * para garantir que ela só ocorra após o DOM estar completamente carregado.
 */

// Exporta um objeto 'dom' vazio que será preenchido posteriormente.
export const dom = {};

// Função para popular o objeto 'dom' com as referências aos elementos da página.
// Deve ser chamada dentro do 'DOMContentLoaded' no main.js.
export function initializeDOM() {
    // --- Seletores de Autenticação e Contêineres Principais ---
    dom.loadingContainer = document.getElementById('loading-container');
    dom.loginContainer = document.getElementById('login-container');
    dom.appContainer = document.getElementById('app-container');
    dom.loginBtn = document.getElementById('login-btn');
    dom.logoutBtn = document.getElementById('logout-btn');
    dom.userProfile = document.getElementById('user-profile');
    dom.userAvatar = document.getElementById('user-avatar');

    // --- Seletores Originais da Aplicação ---
    // Meta
    dom.themeColorMeta = document.getElementById('theme-color-meta');
    
    // Timer e Controles Principais
    dom.timerDisplay = document.getElementById('timer-display');
    dom.startPauseBtn = document.getElementById('start-pause-btn');
    dom.internalInterruptBtn = document.getElementById('internal-interrupt-btn');
    dom.externalInterruptBtn = document.getElementById('external-interrupt-btn');
    dom.progressRing = document.getElementById('progress-ring');
    
    // Painel de Tarefas
    dom.taskListEl = document.getElementById('task-list');
    dom.newTaskInput = document.getElementById('new-task-input');
    dom.newTaskEstimateInput = document.getElementById('new-task-estimate');
    dom.newTaskEstimateLabel = document.getElementById('new-task-estimate-label');
    dom.addTaskBtn = document.getElementById('add-task-btn');
    dom.currentTaskDisplay = document.getElementById('current-task-display');
    dom.toggleCompletedTasksBtn = document.getElementById('toggle-completed-tasks-btn');
    
    // Controles Secundários e Cabeçalho
    dom.resetBtn = document.getElementById('reset-btn');
    dom.settingsBtn = document.getElementById('settings-btn');
    dom.dashboardBtn = document.getElementById('dashboard-btn');
    dom.helpBtn = document.getElementById('help-btn');
    dom.focusMethodToggle = document.getElementById('focus-method-toggle');
    dom.pomodoroCyclesEl = document.getElementById('pomodoro-cycles');

    // Gamificação na UI Principal
    dom.levelDisplay = document.getElementById('level-display');
    dom.xpDisplay = document.getElementById('xp-display');
    dom.xpNextLevelDisplay = document.getElementById('xp-next-level-display');
    dom.xpBarFill = document.getElementById('xp-bar-fill');
    dom.coinsDisplay = document.getElementById('coins-display');
    dom.streakDisplay = document.getElementById('streak-display');

    // Modais e Overlays
    dom.alertModalOverlay = document.getElementById('alert-modal-overlay');
    dom.alertModalCloseBtn = document.getElementById('alert-modal-close-btn');
    dom.sessionEndModalOverlay = document.getElementById('session-end-modal-overlay');
    dom.sessionEndCloseBtn = document.getElementById('session-end-close-btn');
    dom.settingsModalOverlay = document.getElementById('settings-modal-overlay');
    dom.settingsSaveBtn = document.getElementById('settings-save-btn');
    dom.helpModalOverlay = document.getElementById('help-modal-overlay');
    dom.helpModalCloseBtn = document.getElementById('help-modal-close-btn');
    dom.resetConfirmModalOverlay = document.getElementById('reset-confirm-modal-overlay');
    dom.resetConfirmBtn = document.getElementById('reset-confirm-btn');
    dom.resetCancelBtn = document.getElementById('reset-cancel-btn');
    dom.dashboardModalOverlay = document.getElementById('dashboard-modal-overlay');
    dom.dashboardModalCloseBtn = document.getElementById('dashboard-modal-close-btn');
    
    // Elementos dentro dos Modais
    dom.xpGainDisplay = document.getElementById('xp-gain-display');
    dom.coinGainDisplay = document.getElementById('coin-gain-display');
    dom.focusDurationInput = document.getElementById('focus-duration');
    dom.shortBreakDurationInput = document.getElementById('short-break-duration');
    dom.longBreakDurationInput = document.getElementById('long-break-duration');
    dom.longBreakIntervalInput = document.getElementById('long-break-interval');
    dom.colorPaletteSelector = document.getElementById('color-palette-selector');
    
    // Conteúdo do Dashboard
    dom.dashboardStatsContent = document.getElementById('dashboard-stats-content');
    dom.dashboardMissionsContent = document.getElementById('dashboard-missions-content');
    dom.dashboardAchievementsContent = document.getElementById('dashboard-achievements-content');
    dom.dashboardCurrentStreak = document.getElementById('dashboard-current-streak');
    dom.dashboardLongestStreak = document.getElementById('dashboard-longest-streak');
    dom.dashboardDailyReport = document.getElementById('dashboard-daily-report');

    // Notificações Toast
    dom.achievementToast = document.getElementById('achievement-toast');
    dom.achievementToastName = document.getElementById('achievement-toast-name');
    dom.missionToast = document.getElementById('mission-toast');
    dom.missionToastName = document.getElementById('mission-toast-name');
    dom.missionToastEmoji = document.getElementById('mission-toast-emoji');

    // Banner de Instalação PWA
    dom.installBanner = document.getElementById('install-banner');
    dom.installBtn = document.getElementById('install-btn');
    dom.installDismissBtn = document.getElementById('install-dismiss-btn');

    // Seletores da Loja
    dom.shopBtn = document.getElementById('shop-btn');
    dom.shopModalOverlay = document.getElementById('shop-modal-overlay');
    dom.shopModalCloseBtn = document.getElementById('shop-modal-close-btn');
    dom.shopCoinsDisplay = document.getElementById('shop-coins-display');
    dom.shopCollectionsContainer = document.getElementById('shop-collections-container');

    // Seletores do iOS
    dom.iosStartPromptModalOverlay = document.getElementById('ios-start-prompt-modal-overlay');
    dom.iosPromptConfirmBtn = document.getElementById('ios-prompt-confirm-btn');
    dom.iosPromptCancelBtn = document.getElementById('ios-prompt-cancel-btn');
    dom.iosPromptTitle = document.getElementById('ios-prompt-title');
    dom.iosPromptMessage = document.getElementById('ios-prompt-message');

    // Conteúdo de Ajuda
    dom.helpContentPomodoro = document.getElementById('help-content-pomodoro');
    dom.helpContentAdaptativo = document.getElementById('help-content-adaptativo');
}
