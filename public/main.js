// Importa os dados da aplicação
import { themes } from './themes.js';
import { missionsData } from './missions.js';
import { achievements } from './achievements.js';

// Importa os módulos de estado e UI
import { state } from './state.js';
import { dom } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DE GAMIFICATION ---
    const xpForNextLevel = () => Math.floor(100 * Math.pow(1.5, state.gamification.level - 1));

    const updateGamificationUI = () => {
        const nextLevelXP = xpForNextLevel();
        dom.levelDisplay.textContent = state.gamification.level;
        dom.xpDisplay.textContent = state.gamification.xp;
        dom.xpNextLevelDisplay.textContent = nextLevelXP;
        dom.xpBarFill.style.width = `${(state.gamification.xp / nextLevelXP) * 100}%`;
        dom.coinsDisplay.textContent = state.gamification.coins;
        dom.streakDisplay.textContent = state.gamification.currentStreak;
    };
    
    const showToast = (type, data) => {
        let toastEl, nameEl, emojiEl;

        if (type === 'achievement') {
            toastEl = dom.achievementToast;
            nameEl = dom.achievementToastName;
            emojiEl = null;
        } else { 
            toastEl = dom.missionToast;
            nameEl = dom.missionToastName;
            emojiEl = dom.missionToastEmoji;
        }

        nameEl.textContent = data.name || data.title;
        if (emojiEl && data.emoji) emojiEl.textContent = data.emoji;

        toastEl.classList.add('show');
        setTimeout(() => {
            toastEl.classList.remove('show');
        }, 4000);
    };

    const unlockAchievement = (key) => {
        if (!state.gamification.unlockedAchievements.includes(key)) {
            state.gamification.unlockedAchievements.push(key);
            showToast('achievement', achievements[key]);
            playBeep(880, 200, 0.5);
            renderAchievements();
            saveState();
        }
    };
    
    const getDailyStats = () => ({
        focusTimeToday: state.tasks.reduce((acc, task) => acc + task.focusTime, 0),
        tasksCompletedToday: state.tasks.filter(t => t.completed).length,
        pomodorosCompletedToday: state.tasks.reduce((acc, task) => acc + task.pomodorosCompleted, 0),
        uninterruptedSessionsToday: state.uninterruptedSessionsToday,
    });

    const checkMissionsProgress = () => {
        const stats = getDailyStats();
        const allMissions = [...state.gamification.dailyMissions, ...Object.values(missionsData).filter(m => m.type === 'secret')];

        allMissions.forEach(mission => {
            if (state.gamification.completedMissions.includes(mission.id)) return;

            let completed = false;
            if (mission.type === 'daily') {
                const currentProgress = stats[mission.metric] || 0;
                if (currentProgress >= mission.goal) {
                    completed = true;
                }
            } else if (mission.type === 'secret') {
                const hour = new Date().getHours();
                if (mission.id === 'SECRET_NIGHT_OWL' && state.isRunning && hour >= 22) completed = true;
                if (mission.id === 'SECRET_EARLY_BIRD' && state.isRunning && hour < 6) completed = true;
                if (mission.id === 'SECRET_THEME_EXPLORER' && state.gamification.changedThemesCount.size >= 3) completed = true;
            }

            if (completed) {
                state.gamification.completedMissions.push(mission.id);
                addXP(mission.rewards.xp);
                addCoins(mission.rewards.coins);
                showToast('mission', mission);
                playBeep(700, 150, 0.4);
                renderMissions();
            }
        });
        saveState();
    };

    const checkForAchievements = () => {
        const stats = getDailyStats();
        const focusTimeInHours = stats.focusTimeToday / 3600;

        if (stats.pomodorosCompletedToday >= 1) unlockAchievement('FIRST_STEP');
        if (stats.pomodorosCompletedToday >= 5) unlockAchievement('FOCUSED_BEGINNER');
        if (stats.tasksCompletedToday >= 10) unlockAchievement('TASK_MASTER');
        if (focusTimeInHours >= 4) unlockAchievement('MARATHONER');
        if (state.gamification.currentStreak >= 3) unlockAchievement('STREAK_STARTER');
        if (state.gamification.currentStreak >= 7) unlockAchievement('ON_FIRE');
        if (state.gamification.coins >= 500) unlockAchievement('COIN_COLLECTOR');
        if (state.gamification.level >= 5) unlockAchievement('LEVEL_5');
        if (state.gamification.level >= 10) unlockAchievement('LEVEL_10');
        if (state.gamification.level >= 25) unlockAchievement('LEVEL_25');
    };

    const addXP = (amount) => {
        if (!amount) return;
        state.gamification.xp += amount;
        dom.xpGainDisplay.textContent = `+${amount} XP`;
        let nextLevelXP = xpForNextLevel();
        while (state.gamification.xp >= nextLevelXP) {
            state.gamification.xp -= nextLevelXP;
            state.gamification.level++;
            playBeep(659, 150, 0.4);
            setTimeout(() => playBeep(784, 300, 0.5), 200);
            showModal(dom.alertModalOverlay, `Parabéns! Você alcançou o Nível ${state.gamification.level}!`);
            nextLevelXP = xpForNextLevel();
        }
        updateGamificationUI();
        checkForAchievements();
    };
    
    const addCoins = (amount) => {
        if (!amount) return;
        state.gamification.coins += amount;
        dom.coinGainDisplay.textContent = `+${amount} Moedas`;
        updateGamificationUI();
        checkForAchievements();
    };

    const checkStreak = () => {
        const today = new Date().toISOString().slice(0, 10);
        if (state.gamification.lastSessionDate === today) return;
        
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

        if (state.gamification.lastSessionDate === yesterday) {
            state.gamification.currentStreak++;
            const bonusCoins = state.gamification.currentStreak * 2;
            addCoins(bonusCoins);
            showModal(dom.alertModalOverlay, `Sequência de ${state.gamification.currentStreak} dias! Você ganhou ${bonusCoins} moedas de bônus!`);
        } else {
            state.gamification.currentStreak = 1;
        }

        if (state.gamification.currentStreak > state.gamification.longestStreak) {
            state.gamification.longestStreak = state.gamification.currentStreak;
        }
        
        state.gamification.lastSessionDate = today;
        updateGamificationUI();
    };

    const generateDailyMissions = () => {
        const today = new Date().toISOString().slice(0, 10);
        if (state.gamification.lastMissionDate === today) return; 

        const allDailyMissions = Object.values(missionsData).filter(m => m.type === 'daily');
        const shuffled = allDailyMissions.sort(() => 0.5 - Math.random());
        state.gamification.dailyMissions = shuffled.slice(0, 3);
        
        state.gamification.completedMissions = state.gamification.completedMissions.filter(id => missionsData[id]?.type === 'secret');
        state.gamification.lastMissionDate = today;
        state.gamification.changedThemesCount.clear();
        saveState();
    };

    const renderMissions = () => {
        dom.dashboardMissionsContent.innerHTML = '';
        if (state.gamification.dailyMissions.length === 0) {
            dom.dashboardMissionsContent.innerHTML = '<p class="text-muted text-center">Nenhuma missão para hoje. Volte amanhã!</p>';
            return;
        }
        const stats = getDailyStats();
        state.gamification.dailyMissions.forEach(mission => {
            const isCompleted = state.gamification.completedMissions.includes(mission.id);
            const currentProgress = Math.min(stats[mission.metric] || 0, mission.goal);
            const progressPercent = (currentProgress / mission.goal) * 100;

            const el = document.createElement('div');
            el.className = `mission-item p-4 rounded-lg ${isCompleted ? 'completed' : ''}`;
            el.innerHTML = `
                <div class="flex items-start space-x-4">
                    <span class="text-3xl">${mission.emoji}</span>
                    <div class="flex-grow">
                        <p class="font-bold">${mission.title}</p>
                        <p class="text-sm text-muted">${mission.description}</p>
                        <div class="flex items-center text-xs mt-2 space-x-4">
                            <span style="color: rgb(var(--color-xp-bar));"><strong>+${mission.rewards.xp}</strong> XP</span>
                            <span class="text-coin"><strong>+${mission.rewards.coins}</strong> Moedas</span>
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <div class="w-full bg-gray-700 rounded-full h-2.5">
                        <div class="mission-progress-bar h-2.5 rounded-full" style="width: ${progressPercent}%"></div>
                    </div>
                    <p class="text-right text-xs mt-1 text-muted">${Math.floor(currentProgress)} / ${mission.goal}</p>
                </div>
            `;
            dom.dashboardMissionsContent.appendChild(el);
        });
    };

    const renderAchievements = () => {
        dom.dashboardAchievementsContent.innerHTML = '';
        Object.keys(achievements).forEach(key => {
            const achievement = achievements[key];
            const isUnlocked = state.gamification.unlockedAchievements.includes(key);
            const el = document.createElement('div');
            el.className = `achievement-item p-4 rounded-lg flex items-center space-x-4 ${isUnlocked ? 'unlocked' : 'opacity-60'}`;
            el.innerHTML = `
                <span class="text-5xl">${achievement.emoji}</span>
                <div>
                    <p class="font-bold">${achievement.name}</p>
                    <p class="text-sm text-muted">${achievement.description}</p>
                </div>
            `;
            dom.dashboardAchievementsContent.appendChild(el);
        });
    };
    
    const renderDashboard = () => {
        dom.dashboardCurrentStreak.textContent = state.gamification.currentStreak;
        dom.dashboardLongestStreak.textContent = state.gamification.longestStreak;
        
        if (state.tasks.length === 0) {
            dom.dashboardDailyReport.innerHTML = '<p class="text-muted text-center text-sm">Nenhuma tarefa para exibir.</p>';
        } else {
            let statsHTML = '';
            [...state.tasks].sort((a, b) => a.completed - b.completed).forEach(task => {
                statsHTML += `
                <div class="stats-item p-3 rounded-lg ${task.completed ? 'opacity-60' : ''}">
                    <p class="font-bold truncate ${task.completed ? 'line-through' : ''}">${task.name}</p>
                    <div class="grid grid-cols-4 gap-2 mt-2 text-center text-xs">
                        <div><p class="text-xs text-muted">Foco</p><p class="font-semibold">${formatTime(task.focusTime)}</p></div>
                        <div><p class="text-xs text-muted">Ciclos</p><p class="font-semibold">${task.pomodorosCompleted}/${task.pomodoroEstimate}</p></div>
                        <div><p class="text-xs text-muted">Int. Interna</p><p class="font-semibold">${task.internalInterruptions}</p></div>
                        <div><p class="text-xs text-muted">Int. Externa</p><p class="font-semibold">${task.externalInterruptions}</p></div>
                    </div>
                </div>`;
            });
            dom.dashboardDailyReport.innerHTML = statsHTML;
        }

        renderMissions();
        renderAchievements();
    };

    // --- LÓGICA DE ÁUDIO ---
    const _playBeepInternal = (frequency, duration, volume) => {
        const oscillator = state.audioContext.createOscillator();
        const gainNode = state.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(state.audioContext.destination);
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0, state.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, state.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, state.audioContext.currentTime + duration / 1000);
        oscillator.start(state.audioContext.currentTime);
        oscillator.stop(state.audioContext.currentTime + duration / 1000);
    };
    const playBeep = (frequency = 800, duration = 200, volume = 0.3) => {
        if (state.audioContext.state === 'suspended') state.audioContext.resume().then(() => _playBeepInternal(frequency, duration, volume));
        else _playBeepInternal(frequency, duration, volume);
    };
    const playFinishSound = () => {
        playBeep(523, 150, 0.4);
        setTimeout(() => playBeep(659, 150, 0.4), 200);
        setTimeout(() => playBeep(784, 300, 0.5), 400);
    };

    // --- LÓGICA DE INSTALAÇÃO PWA ---
    window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); state.deferredInstallPrompt = e; if (!localStorage.getItem('installBannerDismissed')) dom.installBanner.style.display = 'block'; });
    dom.installBtn.addEventListener('click', () => { if (state.deferredInstallPrompt) { state.deferredInstallPrompt.prompt(); state.deferredInstallPrompt.userChoice.then(() => { state.deferredInstallPrompt = null; dom.installBanner.style.display = 'none'; }); } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) { showModal(dom.alertModalOverlay, 'Para instalar no iOS, toque em Compartilhar e "Adicionar à Tela de Início".'); } });
    dom.installDismissBtn.addEventListener('click', () => { localStorage.setItem('installBannerDismissed', 'true'); dom.installBanner.style.display = 'none'; });
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) dom.installBanner.style.display = 'none';

    // --- FUNÇÕES DE GESTÃO DE TEMA E MODO ---
    const applyTheme = (themeName) => {
        const theme = themes[themeName] || themes.brasil_dark; 
        const root = document.documentElement;
        Object.keys(theme).forEach(key => { if (key !== 'name') root.style.setProperty(key, theme[key]); });
        dom.themeColorMeta.setAttribute('content', theme['--color-bg-shell']);
        if (state.gamification.lastMissionDate === new Date().toISOString().slice(0, 10)) {
            state.gamification.changedThemesCount.add(themeName);
            checkMissionsProgress();
        }
    };

    const renderPaletteSelector = () => {
        dom.colorPaletteSelector.innerHTML = '';
        Object.keys(themes).sort().forEach(key => {
            const theme = themes[key];
            const button = document.createElement('button');
            button.dataset.theme = key;
            button.title = theme.name;
            button.className = `h-12 rounded-lg border-2 transition-all transform flex flex-col items-center justify-center p-1 text-xs font-semibold ${state.settings.theme === key ? 'border-white scale-105' : 'border-transparent'}`;
            button.style.backgroundColor = theme['--color-bg-shell'];
            button.style.color = theme['--color-text-muted'];
            button.innerHTML = `<div class="w-full h-4 rounded" style="background-color: rgb(${theme['--color-primary-rgb']})"></div><span class="mt-1">${theme.name.split(' ')[0]}</span>`;
            dom.colorPaletteSelector.appendChild(button);
        });
    };

    const updateMethodToggleUI = () => {
        document.querySelectorAll('#focus-method-toggle .method-btn').forEach(btn => {
            const isSelected = btn.dataset.method === state.settings.focusMethod;
            btn.classList.toggle('bg-primary-focus', isSelected);
            btn.classList.toggle('text-white', isSelected);
            const isDarkTheme = state.settings.theme.includes('_dark'); 
            btn.classList.toggle(isDarkTheme ? 'text-gray-400' : 'text-gray-500', !isSelected);
        });
        dom.pomodoroCyclesEl.style.display = state.settings.focusMethod === 'pomodoro' ? 'flex' : 'none';
        dom.newTaskEstimateInput.style.display = state.settings.focusMethod === 'pomodoro' ? 'inline-block' : 'none';
        dom.newTaskEstimateLabel.style.display = state.settings.focusMethod === 'pomodoro' ? 'inline-block' : 'none';
        if (!state.isRunning) resetTimer('focus');
    };

    // --- FUNÇÕES DO TIMER E MODAIS ---
    const showModal = (modalOverlay, message) => {
        const messageElId = modalOverlay.id.replace('-overlay', '-message');
        const messageEl = document.getElementById(messageElId);
        if(messageEl && message) messageEl.textContent = message;
        modalOverlay.classList.add('visible');
    };
    const hideModal = (modalOverlay) => modalOverlay.classList.remove('visible');
    
    const startTimer = () => {
        if (state.isRunning) return;
        if (!state.selectedTaskId && state.mode === 'focus') {
            showModal(dom.alertModalOverlay, 'Por favor, selecione uma tarefa para iniciar o foco.');
            return;
        }
        if (state.mode === 'focus') checkMissionsProgress(); 
        
        if (state.settings.focusMethod === 'pomodoro' || state.mode !== 'focus') {
            state.timeRemaining = (state.settings[`${state.mode}Duration`] || 25) * 60;
            state.totalTime = state.timeRemaining;
        } else {
            state.timeRemaining = 0;
            state.totalTime = 1;
        }
        state.isRunning = true;
        state.endTime = Date.now() + (state.settings.focusMethod === 'pomodoro' || state.mode !== 'focus' ? state.timeRemaining * 1000 : 0);
        updateUI();
        state.timerInterval = setInterval(updateTimer, 1000);
    };

    const pauseTimer = () => {
        if (!state.isRunning) return;
        state.isRunning = false;
        clearInterval(state.timerInterval);
        if (state.settings.focusMethod === 'pomodoro' || state.mode !== 'focus') state.timeRemaining = Math.round((state.endTime - Date.now()) / 1000);
        saveState();
        updateUI();
    };

    const updateTimerDisplay = () => {
        const totalSecondsAbs = Math.abs(state.timeRemaining);
        const minutes = Math.floor((totalSecondsAbs % 3600) / 60);
        const seconds = totalSecondsAbs % 60;
        const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        dom.timerDisplay.textContent = display;
        document.title = `${display} - Foco Total`;
        const circumference = 2 * Math.PI * 45;
        let progress = (state.settings.focusMethod === 'pomodoro' || state.mode !== 'focus') ? ((state.totalTime > 0) ? (state.totalTime - state.timeRemaining) / state.totalTime : 0) : (state.isRunning ? 1 : 0);
        dom.progressRing.style.strokeDasharray = circumference;
        dom.progressRing.style.strokeDashoffset = circumference * (1 - progress);
    };

    const updateTimer = () => {
        if (state.settings.focusMethod === 'pomodoro' || state.mode !== 'focus') {
            const remaining = Math.round((state.endTime - Date.now()) / 1000);
            if (remaining >= 0) state.timeRemaining = remaining;
            else { clearInterval(state.timerInterval); switchMode(); }
        } else {
            state.timeRemaining++;
        }
        updateTimerDisplay();
    };

    const switchMode = () => {
        state.isRunning = false;
        state.endTime = null;
        playFinishSound();
        dom.xpGainDisplay.textContent = ''; 
        dom.coinGainDisplay.textContent = '';
        if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);

        if ('Notification' in window && Notification.permission === 'granted') {
            const notificationTitle = state.mode === 'focus' ? 'Foco Finalizado!' : 'Pausa Finalizada!';
            const notificationBody = state.mode === 'focus' ? 'Hora de fazer uma pausa.' : 'Vamos voltar ao trabalho?';
            navigator.serviceWorker.ready.then(reg => reg.showNotification(notificationTitle, { body: notificationBody, icon: '/icon-192x192.png', renotify: true, tag: 'foco-total-notification' }));
        }

        if (state.mode === 'focus') {
            checkStreak();
            state.uninterruptedSessionsToday++;
            const task = state.tasks.find(t => t.id === state.selectedTaskId);
            let focusDuration = 0;
            if (task) {
                if (state.settings.focusMethod === 'pomodoro') {
                    state.pomodoroSessionCount++;
                    task.pomodorosCompleted++;
                    focusDuration = state.settings.focusDuration * 60;
                    task.focusTime += focusDuration;
                } else {
                    focusDuration = state.timeRemaining;
                    task.focusTime += focusDuration;
                }
            }
            const xpGained = Math.floor(focusDuration / 60);
            addXP(xpGained);
            addCoins(5);
            checkMissionsProgress();
            state.mode = (state.settings.focusMethod === 'pomodoro' && state.pomodoroSessionCount % state.settings.longBreakInterval === 0) ? 'longBreak' : 'shortBreak';
            showModal(dom.sessionEndModalOverlay, `Você ${state.settings.focusMethod === 'pomodoro' ? 'completou um Pomodoro!' : 'finalizou seu foco.'} Hora de fazer uma pausa.`);
        } else {
            state.mode = 'focus';
            showModal(dom.sessionEndModalOverlay, 'Pausa finalizada! Vamos voltar ao trabalho?');
        }
        resetTimer();
        renderTasks();
    };

    const resetTimer = (forceMode = null) => {
        clearInterval(state.timerInterval);
        state.isRunning = false;
        state.endTime = null;
        state.mode = forceMode || state.mode;
        if (state.settings.focusMethod === 'pomodoro' || state.mode !== 'focus') {
            state.timeRemaining = (state.settings[`${state.mode}Duration`] || 25) * 60;
            state.totalTime = state.timeRemaining;
        } else {
            state.timeRemaining = 0;
            state.totalTime = 1;
        }
        saveState();
        updateUI();
    };

    const resetDay = () => {
        pauseTimer();
        state.tasks = [];
        state.selectedTaskId = null;
        state.pomodoroSessionCount = 0;
        state.uninterruptedSessionsToday = 0;
        resetTimer('focus');
        renderTasks();
        hideModal(dom.resetConfirmModalOverlay);
        showModal(dom.alertModalOverlay, 'O dia foi zerado com sucesso!');
    };

    const updateUI = () => {
        updateTimerDisplay();
        const currentTheme = themes[state.settings.theme] || themes.brasil_dark;

        if (state.mode === 'shortBreak') dom.progressRing.style.stroke = currentTheme['--color-break-short'];
        else if (state.mode === 'longBreak') dom.progressRing.style.stroke = currentTheme['--color-break-long'];
        else dom.progressRing.style.stroke = `rgb(${currentTheme['--color-primary-rgb']})`;
        
        dom.progressRing.classList.toggle('breathing', state.settings.focusMethod === 'adaptativo' && state.mode === 'focus' && state.isRunning);

        let btnIcon, btnBgClass, ariaLabelText;
        if (state.settings.focusMethod === 'pomodoro' || state.mode !== 'focus') {
            btnIcon = state.isRunning ? 'pause' : 'play';
            btnBgClass = state.isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-primary-focus hover:bg-primary-darker';
            ariaLabelText = state.isRunning ? 'Pausar Timer' : 'Iniciar Timer';
        } else {
            btnIcon = state.isRunning ? 'square' : 'play';
            btnBgClass = state.isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-focus hover:bg-primary-darker';
            ariaLabelText = state.isRunning ? 'Parar Foco Adaptativo' : 'Iniciar Foco Adaptativo';
        }
        dom.startPauseBtn.className = `w-20 h-20 text-white font-bold rounded-full text-base transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center ${btnBgClass}`;
        dom.startPauseBtn.innerHTML = `<i data-lucide="${btnIcon}" class="w-8 h-8 ${btnIcon === 'play' ? 'pl-1' : ''}"></i>`;
        dom.startPauseBtn.setAttribute('aria-label', ariaLabelText);
        dom.internalInterruptBtn.style.display = (state.isRunning && state.mode === 'focus') ? 'flex' : 'none';
        dom.externalInterruptBtn.style.display = (state.isRunning && state.mode === 'focus') ? 'flex' : 'none';
        updateCurrentTaskDisplay();
        lucide.createIcons();
    };

    const formatTime = (totalSeconds) => {
        if (!totalSeconds || totalSeconds < 1) return `0m`;
        const minutes = Math.floor(totalSeconds / 60);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (hours > 0) return `${hours}h ${remainingMinutes}m`;
        return `${minutes}m`;
    };

    // --- LÓGICA DE TAREFAS ---
    const renderTasks = () => {
        const tasksToRender = state.showCompletedTasks ? state.tasks : state.tasks.filter(task => !task.completed);
        dom.taskListEl.innerHTML = tasksToRender.length === 0 ? '<p class="text-muted text-center text-sm">Adicione a sua primeira tarefa!</p>' : '';
        tasksToRender.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = `task-item p-3 rounded-lg border-2 border-transparent cursor-pointer ${task.id === state.selectedTaskId ? 'selected' : ''} ${task.completed ? 'opacity-60' : ''}`;
            taskEl.dataset.id = task.id;
            
            taskEl.innerHTML = `
            <div class="flex justify-between items-center">
                <div class="flex items-center min-w-0 flex-grow">
                    <button data-complete-id="${task.id}" class="complete-btn text-muted hover:text-green-500 mr-3 flex-shrink-0" aria-label="Marcar tarefa ${task.name} como concluída"><i data-lucide="${task.completed ? 'check-square' : 'square'}" class="w-5 h-5"></i></button>
                    ${task.isEditing
                        ? `<input type="text" value="${task.name}" class="task-edit-input rounded px-2 py-1 text-sm flex-grow mx-2 border-2 border-primary focus:outline-none" data-edit-input-id="${task.id}" aria-label="Editar nome da tarefa ${task.name}">`
                        : `<span class="task-name truncate text-sm ${task.completed ? 'line-through' : ''}">${task.name}</span>`
                    }
                </div>
                <div class="flex items-center space-x-1 flex-shrink-0">
                    <button data-edit-id="${task.id}" class="edit-btn text-muted hover:text-primary transition-colors p-1 rounded-md" aria-label="${task.isEditing ? 'Salvar edição' : 'Editar tarefa'}"><i data-lucide="${task.isEditing ? 'save' : 'pencil'}" class="w-4 h-4"></i></button>
                    <button data-delete-id="${task.id}" class="delete-btn text-muted hover:text-red-500 transition-colors p-1 rounded-md" aria-label="Excluir tarefa"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                </div>
            </div>
            <div class="grid grid-cols-4 gap-1 items-center mt-2 pl-8 text-xs text-center">
                ${state.settings.focusMethod === 'pomodoro' ? `<span class="text-muted font-bold flex items-center justify-center" title="Pomodoros"><i data-lucide="check-circle-2" class="w-4 h-4 mr-1 text-green-500"></i>${task.pomodorosCompleted}/${task.pomodoroEstimate}</span>` : ''}
                <span class="text-muted font-bold flex items-center justify-center" title="Tempo de Foco"><i data-lucide="clock" class="w-4 h-4 mr-1 text-primary-light"></i>${formatTime(task.focusTime)}</span>
                <span class="text-muted font-bold flex items-center justify-center" title="Interrupções Internas"><i data-lucide="zap-off" class="w-4 h-4 mr-1"></i>${task.internalInterruptions}</span>
                <span class="text-muted font-bold flex items-center justify-center" title="Interrupções Externas"><i data-lucide="user-x" class="w-4 h-4 mr-1"></i>${task.externalInterruptions}</span>
            </div>`;
            dom.taskListEl.appendChild(taskEl);
        });
        updateCurrentTaskDisplay();
        saveState();
        lucide.createIcons();
    };

    const addTask = () => {
        if (!state.audioInitialized) state.audioContext.resume().then(() => state.audioInitialized = true);
        const taskName = dom.newTaskInput.value.trim();
        if (taskName) {
            const newTask = { id: Date.now(), name: taskName, pomodoroEstimate: (parseInt(dom.newTaskEstimateInput.value) || 1), pomodorosCompleted: 0, internalInterruptions: 0, externalInterruptions: 0, focusTime: 0, completed: false, isEditing: false };
            state.tasks.push(newTask);
            dom.newTaskInput.value = '';
            dom.newTaskEstimateInput.value = '1';
            playBeep(440, 100, 0.2);
            const currentSelectedTask = state.tasks.find(t => t.id === state.selectedTaskId);
            if (!currentSelectedTask || currentSelectedTask.completed) selectTask(newTask.id);
            else renderTasks();
        }
    };

    const deleteTask = (id) => {
        state.tasks = state.tasks.filter(task => task.id !== id);
        if (state.selectedTaskId === id) {
            selectTask(state.tasks.find(t => !t.completed)?.id || null);
        } else {
            renderTasks();
        }
    };

    const toggleTaskCompleted = (id) => {
        const task = state.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            if (task.completed) {
                addXP(10); 
                addCoins(2);
                checkMissionsProgress();
            }
            if (task.completed && state.selectedTaskId === id) {
                if(state.isRunning) pauseTimer();
                selectTask(state.tasks.find(t => !t.completed)?.id || null);
                if (!state.isRunning && state.mode === 'focus') resetTimer('focus');
            }
            renderTasks();
        }
    };

    const toggleEditState = (id) => {
        state.tasks.forEach(task => task.isEditing = task.id === id ? !task.isEditing : false);
        renderTasks();
        const input = document.querySelector(`[data-edit-input-id="${id}"]`);
        if (input) { input.focus(); input.select(); }
    };

    const updateTaskName = (id, newName) => {
        const task = state.tasks.find(t => t.id === id);
        if (task) {
            if (newName) task.name = newName;
            task.isEditing = false;
            renderTasks();
        }
    };

    const selectTask = (id) => {
        const task = state.tasks.find(t => t.id === id);
        if ((task || id === null) && !state.tasks.some(t => t.isEditing)) {
            state.selectedTaskId = id;
            renderTasks();
            if (!state.isRunning) resetTimer('focus');
        }
    };

    const logInterruption = (type) => {
        if (state.isRunning && state.mode === 'focus' && state.selectedTaskId) {
            const task = state.tasks.find(t => t.id === state.selectedTaskId);
            if (task) {
                if (type === 'internal') task.internalInterruptions++;
                else if (type === 'external') task.externalInterruptions++;
                state.uninterruptedSessionsToday = 0;
                renderTasks();
                showModal(dom.alertModalOverlay, `Interrupção registrada!`);
            }
        } else {
            showModal(dom.alertModalOverlay, 'Só pode registrar interrupções durante um foco ativo.');
        }
    };

    const updateCurrentTaskDisplay = () => {
        const task = state.tasks.find(t => t.id === state.selectedTaskId);
        dom.currentTaskDisplay.textContent = task ? task.name : 'Nenhuma tarefa selecionada';
        dom.pomodoroCyclesEl.innerHTML = '';
        if (state.settings.focusMethod !== 'pomodoro' || !state.settings.longBreakInterval || state.settings.longBreakInterval <= 0) return;
        const cyclesToShow = state.pomodoroSessionCount % state.settings.longBreakInterval;
        for(let i = 0; i < state.settings.longBreakInterval; i++) {
            const icon = i < cyclesToShow ? '<i data-lucide="check-circle-2" class="text-green-500"></i>' : '<i data-lucide="circle" class="text-muted"></i>';
            dom.pomodoroCyclesEl.innerHTML += `<span class="transition-all">${icon}</span>`;
        }
        lucide.createIcons();
    };

    // --- PERSISTÊNCIA ---
    const saveState = () => {
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
        // O Set não é serializável, então o convertemos para um array
        const serializableGamification = { ...state.gamification, changedThemesCount: Array.from(state.gamification.changedThemesCount) };
        stateToSave.gamification = serializableGamification;

        localStorage.setItem('pomodoroAppState', JSON.stringify(stateToSave));
    };

    const loadState = () => {
        const savedStateJSON = localStorage.getItem('pomodoroAppState');
        if (!savedStateJSON) return;

        const savedState = JSON.parse(savedStateJSON);
        
        state.tasks = savedState.tasks || [];
        state.selectedTaskId = savedState.selectedTaskId;
        state.pomodoroSessionCount = savedState.pomodoroSessionCount || 0;
        state.uninterruptedSessionsToday = savedState.uninterruptedSessionsToday || 0;
        Object.assign(state.settings, savedState.settings);
        Object.assign(state.gamification, savedState.gamification);
        
        if (savedState.timerState) {
            const { isRunning: wasRunning, mode: savedMode, endTime: savedEndTime, totalTime: savedTotalTime } = savedState.timerState;
            if (wasRunning && savedEndTime && savedEndTime > Date.now()) {
                state.isRunning = true;
                state.mode = savedMode;
                state.totalTime = savedTotalTime;
                state.endTime = savedEndTime;
                state.timeRemaining = Math.round((state.endTime - Date.now()) / 1000);
                state.timerInterval = setInterval(updateTimer, 1000);
            }
        }
        
        state.tasks.forEach(task => task.isEditing = false); 

        // Converte o array de volta para um Set
        state.gamification.changedThemesCount = new Set(savedState.gamification.changedThemesCount || []);
        
        dom.focusDurationInput.value = state.settings.focusDuration;
        dom.shortBreakDurationInput.value = state.settings.shortBreakDuration;
        dom.longBreakDurationInput.value = state.settings.longBreakDuration;
        dom.longBreakIntervalInput.value = state.settings.longBreakInterval;

        if (state.selectedTaskId && (!state.tasks.find(t => t.id === state.selectedTaskId) || state.tasks.find(t => t.id === state.selectedTaskId).completed)) {
            state.selectedTaskId = null;
        }
        if (!state.selectedTaskId) {
            selectTask(state.tasks.find(t => !t.completed)?.id || null);
        }
        generateDailyMissions();
    };

    // --- EVENT LISTENERS ---
    const handleStartPauseClick = () => {
        dom.startPauseBtn.classList.add('start-pause-btn-clicked');
        dom.startPauseBtn.addEventListener('animationend', () => dom.startPauseBtn.classList.remove('start-pause-btn-clicked'), { once: true });
        if (state.settings.focusMethod === 'pomodoro' || state.mode !== 'focus') {
            state.isRunning ? pauseTimer() : startTimer();
        } else {
            if (state.isRunning) {
                pauseTimer();
                const focusDuration = state.timeRemaining;
                const task = state.tasks.find(t => t.id === state.selectedTaskId);
                if (task) task.focusTime += focusDuration;
                const xpGained = Math.floor(focusDuration / 60);
                addXP(xpGained);
                addCoins(5);
                checkStreak();
                checkMissionsProgress();
                showModal(dom.sessionEndModalOverlay, `Você se concentrou por ${formatTime(state.timeRemaining)}.`);
                resetTimer('focus');
            } else {
                startTimer();
            }
        }
    };
    
    dom.startPauseBtn.addEventListener('click', () => {
        if (!state.audioInitialized) state.audioContext.resume().then(() => state.audioInitialized = true);
        dom.xpGainDisplay.textContent = '';
        dom.coinGainDisplay.textContent = '';
        
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isIOS && !state.isRunning && state.settings.focusMethod === 'pomodoro') {
            if (state.mode === 'focus') {
                dom.iosPromptTitle.textContent = 'Lembrete de Foco';
                dom.iosPromptMessage.textContent = 'Para garantir o alarme no final do foco, recomendamos criar um lembrete. Deseja fazer isso agora?';
            } else {
                dom.iosPromptTitle.textContent = 'Lembrete de Pausa';
                dom.iosPromptMessage.textContent = 'Para garantir o alarme no final da pausa, recomendamos criar um lembrete. Deseja fazer isso agora?';
            }
            showModal(dom.iosStartPromptModalOverlay);
        } else {
            handleStartPauseClick();
        }
    });

    dom.iosPromptConfirmBtn.addEventListener('click', () => {
        let duration, eventTitle, eventDescription;
        if (state.mode === 'focus') {
            const task = state.tasks.find(t => t.id === state.selectedTaskId);
            eventTitle = `🎉 Fim do Foco: ${task ? task.name : 'Foco'}`;
            eventDescription = `Sua sessão de foco terminou. Hora de fazer uma pausa!`;
            duration = state.settings.focusDuration;
        } else {
            eventTitle = state.mode === 'shortBreak' ? `🚀 Fim da Pausa Curta` : `🏆 Fim da Pausa Longa`;
            eventDescription = `Sua pausa acabou. Hora de voltar ao foco!`;
            duration = state.mode === 'shortBreak' ? state.settings.shortBreakDuration : state.settings.longBreakDuration;
        }
        const formatDT = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const eventStartTime = new Date(Date.now() + duration * 60 * 1000);
        const eventEndTime = new Date(eventStartTime.getTime() + 1 * 60 * 1000);
        const icsContent = [
            'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//FocoTotal//PWA//PT',
            'BEGIN:VEVENT', 'UID:' + Date.now() + '@focototal.app', 'DTSTAMP:' + formatDT(new Date()),
            'DTSTART:' + formatDT(eventStartTime), 'DTEND:' + formatDT(eventEndTime),
            'SUMMARY:' + eventTitle, 'DESCRIPTION:' + eventDescription,
            'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + eventDescription, 'TRIGGER:-PT0S', 'END:VALARM',
            'END:VEVENT', 'END:VCALENDAR'
        ].join('\r\n');
        
        const base64Content = btoa(unescape(encodeURIComponent(icsContent)));
        window.location.href = `data:text/calendar;base64,${base64Content}`;

        handleStartPauseClick();
        hideModal(dom.iosStartPromptModalOverlay);
    });

    dom.iosPromptCancelBtn.addEventListener('click', () => {
        handleStartPauseClick();
        hideModal(dom.iosStartPromptModalOverlay);
    });
    
    dom.resetBtn.addEventListener('click', () => showModal(dom.resetConfirmModalOverlay));
    dom.resetConfirmBtn.addEventListener('click', resetDay);
    dom.resetCancelBtn.addEventListener('click', () => hideModal(dom.resetConfirmModalOverlay));
    dom.internalInterruptBtn.addEventListener('click', () => logInterruption('internal'));
    dom.externalInterruptBtn.addEventListener('click', () => logInterruption('external'));
    dom.settingsBtn.addEventListener('click', () => { renderPaletteSelector(); showModal(dom.settingsModalOverlay); });
    dom.dashboardBtn.addEventListener('click', () => { renderDashboard(); showModal(dom.dashboardModalOverlay); });
    dom.helpBtn.addEventListener('click', () => showModal(dom.helpModalOverlay));
    dom.dashboardModalCloseBtn.addEventListener('click', () => hideModal(dom.dashboardModalOverlay));
    dom.alertModalCloseBtn.addEventListener('click', () => hideModal(dom.alertModalOverlay));
    dom.sessionEndCloseBtn.addEventListener('click', () => hideModal(dom.sessionEndModalOverlay));
    
    dom.settingsSaveBtn.addEventListener('click', () => {
        state.settings.focusDuration = parseInt(dom.focusDurationInput.value) || 25;
        state.settings.shortBreakDuration = parseInt(dom.shortBreakDurationInput.value) || 5;
        state.settings.longBreakDuration = parseInt(dom.longBreakDurationInput.value) || 15;
        state.settings.longBreakInterval = parseInt(dom.longBreakIntervalInput.value) || 4;
        hideModal(dom.settingsModalOverlay);
        if (!state.isRunning) resetTimer('focus');
        saveState();
    });

    dom.colorPaletteSelector.addEventListener('click', (e) => {
        const target = e.target.closest('button[data-theme]');
        if (target) {
            state.settings.theme = target.dataset.theme;
            applyTheme(state.settings.theme);
            renderPaletteSelector();
            updateMethodToggleUI();
            updateUI();
            saveState();
        }
    });

    dom.addTaskBtn.addEventListener('click', addTask);
    dom.newTaskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });
    
    dom.focusMethodToggle.addEventListener('click', (e) => {
        const target = e.target.closest('.method-btn');
        if (target && !state.isRunning) {
            state.settings.focusMethod = target.dataset.method;
            updateMethodToggleUI();
            renderTasks();
            saveState();
        } else if (state.isRunning) {
            showModal(dom.alertModalOverlay, 'Não é possível trocar de modo enquanto o timer está rodando.');
        }
    });

    dom.toggleCompletedTasksBtn.addEventListener('click', () => {
        state.showCompletedTasks = !state.showCompletedTasks;
        dom.toggleCompletedTasksBtn.textContent = state.showCompletedTasks ? 'Esconder Concluídas' : 'Mostrar Concluídas';
        renderTasks();
    });
    
    dom.dashboardModalOverlay.addEventListener('click', (e) => {
        const tabButton = e.target.closest('.dashboard-tab');
        if (tabButton) {
            const tabName = tabButton.dataset.tab;
            ['stats', 'missions', 'achievements'].forEach(tab => {
                document.getElementById(`dashboard-${tab}-content`).classList.add('hidden');
            });
            dom.dashboardModalOverlay.querySelectorAll('.dashboard-tab').forEach(btn => btn.classList.remove('active'));
            
            document.getElementById(`dashboard-${tabName}-content`).classList.remove('hidden');
            tabButton.classList.add('active');
        }
    });

    [dom.alertModalOverlay, dom.settingsModalOverlay, dom.dashboardModalOverlay, dom.helpModalOverlay, dom.resetConfirmModalOverlay, dom.sessionEndModalOverlay, dom.iosStartPromptModalOverlay].forEach(overlay => {
        overlay.addEventListener('click', (e) => { if (e.target === overlay) hideModal(overlay); });
    });

    dom.taskListEl.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('[data-delete-id]');
        const completeBtn = e.target.closest('[data-complete-id]');
        const editBtn = e.target.closest('[data-edit-id]');
        const taskItem = e.target.closest('.task-item');
        if (deleteBtn) { deleteTask(parseInt(deleteBtn.dataset.deleteId)); return; }
        if (completeBtn) { toggleTaskCompleted(parseInt(completeBtn.dataset.completeId)); return; }
        if (editBtn) {
            const id = parseInt(editBtn.dataset.editId);
            const task = state.tasks.find(t => t.id === id);
            if (task && task.isEditing) {
                const input = dom.taskListEl.querySelector(`[data-edit-input-id="${id}"]`);
                if (input) updateTaskName(id, input.value.trim());
            } else {
                toggleEditState(id);
            }
            return;
        }
        if (taskItem) { selectTask(parseInt(taskItem.dataset.id)); }
    });

    dom.taskListEl.addEventListener('keyup', (e) => {
        if (e.target.matches('.task-edit-input')) {
            const id = parseInt(e.target.dataset.editInputId);
            if (e.key === 'Enter') updateTaskName(id, e.target.value.trim());
            else if (e.key === 'Escape') toggleEditState(null);
        }
    });

    dom.taskListEl.addEventListener('focusout', (e) => {
        if (e.target.matches('.task-edit-input')) {
            const id = parseInt(e.target.dataset.editInputId);
            setTimeout(() => {
                const task = state.tasks.find(t => t.id === id);
                if (task && task.isEditing) updateTaskName(id, e.target.value.trim());
            }, 150);
        }
    });

    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
    const initializeApp = () => {
        loadState();
        applyTheme(state.settings.theme); 
        updateMethodToggleUI();
        renderTasks();
        updateUI();
        updateGamificationUI();
        checkForAchievements();
        lucide.createIcons();
        document.addEventListener('click', () => {
            if (state.audioContext.state === 'suspended') state.audioContext.resume().then(() => state.audioInitialized = true);
        }, { once: true });
    };

    initializeApp();
});
