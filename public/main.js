// Importa a definição de temas do arquivo themes.js
import { themes } from './themes.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const themeColorMeta = document.getElementById('theme-color-meta');
    const timerDisplay = document.getElementById('timer-display');
    const startPauseBtn = document.getElementById('start-pause-btn');
    const internalInterruptBtn = document.getElementById('internal-interrupt-btn');
    const externalInterruptBtn = document.getElementById('external-interrupt-btn');
    const resetBtn = document.getElementById('reset-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const statsBtn = document.getElementById('stats-btn');
    const helpBtn = document.getElementById('help-btn');
    const progressRing = document.getElementById('progress-ring');
    const newTaskInput = document.getElementById('new-task-input');
    const newTaskEstimateInput = document.getElementById('new-task-estimate');
    const newTaskEstimateLabel = document.getElementById('new-task-estimate-label');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskListEl = document.getElementById('task-list');
    const currentTaskDisplay = document.getElementById('current-task-display');
    const pomodoroCyclesEl = document.getElementById('pomodoro-cycles');
    const focusMethodToggle = document.getElementById('focus-method-toggle');
    const toggleCompletedTasksBtn = document.getElementById('toggle-completed-tasks-btn');
    const statsModalOverlay = document.getElementById('stats-modal-overlay');
    const statsModalCloseBtn = document.getElementById('stats-modal-close-btn');
    const statsContentEl = document.getElementById('stats-content');
    const alertModalOverlay = document.getElementById('alert-modal-overlay');
    const alertModalCloseBtn = document.getElementById('alert-modal-close-btn');
    const sessionEndModalOverlay = document.getElementById('session-end-modal-overlay');
    const sessionEndCloseBtn = document.getElementById('session-end-close-btn');
    const settingsModalOverlay = document.getElementById('settings-modal-overlay');
    const settingsSaveBtn = document.getElementById('settings-save-btn');
    const helpModalOverlay = document.getElementById('help-modal-overlay');
    const helpModalCloseBtn = document.getElementById('help-modal-close-btn');
    const helpContentPomodoro = document.getElementById('help-content-pomodoro');
    const helpContentAdaptativo = document.getElementById('help-content-adaptativo');
    const resetConfirmModalOverlay = document.getElementById('reset-confirm-modal-overlay');
    const resetConfirmBtn = document.getElementById('reset-confirm-btn');
    const resetCancelBtn = document.getElementById('reset-cancel-btn');
    const focusDurationInput = document.getElementById('focus-duration');
    const shortBreakDurationInput = document.getElementById('short-break-duration');
    const longBreakDurationInput = document.getElementById('long-break-duration');
    const longBreakIntervalInput = document.getElementById('long-break-interval');
    const installBanner = document.getElementById('install-banner');
    const installBtn = document.getElementById('install-btn');
    const installDismissBtn = document.getElementById('install-dismiss-btn');
    const iosStartPromptModalOverlay = document.getElementById('ios-start-prompt-modal-overlay');
    const iosPromptConfirmBtn = document.getElementById('ios-prompt-confirm-btn');
    const iosPromptCancelBtn = document.getElementById('ios-prompt-cancel-btn');
    const iosPromptTitle = document.getElementById('ios-prompt-title');
    const iosPromptMessage = document.getElementById('ios-prompt-message');
    const colorPaletteSelector = document.getElementById('color-palette-selector');

    // --- ESTADO DA APLICAÇÃO ---
    let timerInterval, isRunning = false, mode = 'focus', timeRemaining, totalTime, endTime;
    let tasks = [], selectedTaskId = null, pomodoroSessionCount = 0;
    let settings = { 
        focusDuration: 25, 
        shortBreakDuration: 5, 
        longBreakDuration: 15, 
        longBreakInterval: 4,
        theme: 'dark_blue' // Tema padrão
    };
    let focusMethod = 'pomodoro';
    let deferredInstallPrompt = null;
    let showCompletedTasks = false;

    // --- LÓGICA DE BADGING E ÁUDIO ---
    const clearBadge = () => { if ('clearAppBadge' in navigator) navigator.clearAppBadge().catch(console.error); };
    const setBadge = () => { if ('setAppBadge' in navigator) navigator.setAppBadge(1).catch(console.error); };
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let audioInitialized = false;
    const _playBeepInternal = (frequency, duration, volume) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    };
    const playBeep = (frequency = 800, duration = 200, volume = 0.3) => {
        if (audioContext.state === 'suspended') audioContext.resume().then(() => _playBeepInternal(frequency, duration, volume));
        else _playBeepInternal(frequency, duration, volume);
    };
    const playFinishSound = () => {
        playBeep(523, 150, 0.4);
        setTimeout(() => playBeep(659, 150, 0.4), 200);
        setTimeout(() => playBeep(784, 300, 0.5), 400);
    };
    const playTickSound = () => playBeep(1000, 50, 0.1);

    // --- LÓGICA DE INSTALAÇÃO PWA ---
    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        deferredInstallPrompt = event;
        if (!localStorage.getItem('installBannerDismissed')) installBanner.style.display = 'block';
    });
    installBtn.addEventListener('click', () => {
        if (deferredInstallPrompt) {
            deferredInstallPrompt.prompt();
            deferredInstallPrompt.userChoice.then(() => { deferredInstallPrompt = null; installBanner.style.display = 'none'; });
        } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            showModal(alertModalOverlay, 'Para instalar no iOS, toque em Compartilhar e "Adicionar à Tela de Início".');
        }
    });
    installDismissBtn.addEventListener('click', () => {
        localStorage.setItem('installBannerDismissed', 'true');
        installBanner.style.display = 'none';
    });
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) installBanner.style.display = 'none';

    // --- FUNÇÕES DE GESTÃO DE TEMA E MODO ---
    // A função applyTheme agora usa o objeto 'themes' importado
    const applyTheme = (themeName) => {
        // Fallback para 'dark_blue' se o tema não for encontrado
        const theme = themes[themeName] || themes.dark_blue; 
        const root = document.documentElement;
        Object.keys(theme).forEach(key => {
            if (key !== 'name') {
                root.style.setProperty(key, theme[key]);
            }
        });
        // Atualiza a cor da barra de endereço do navegador
        themeColorMeta.setAttribute('content', theme['--color-bg-shell']);
    };

    // renderPaletteSelector agora itera sobre o objeto 'themes' importado
    const renderPaletteSelector = () => {
        colorPaletteSelector.innerHTML = '';
        // Converte o objeto themes em um array de chaves para iterar
        Object.keys(themes).forEach(key => {
            const theme = themes[key];
            const button = document.createElement('button');
            button.dataset.theme = key;
            button.title = theme.name;
            button.className = `h-12 rounded-lg border-2 transition-all transform flex flex-col items-center justify-center p-1 text-xs font-semibold ${settings.theme === key ? 'border-white scale-105' : 'border-transparent'}`;
            button.style.backgroundColor = theme['--color-bg-shell'];
            button.style.color = theme['--color-text-muted'];
            
            // Exibe uma pequena amostra das cores primárias e de texto
            button.innerHTML = `
                <div class="w-full h-4 rounded" style="background-color: rgb(${theme['--color-primary-rgb']})"></div>
                <span class="mt-1">${theme.name.split(' ')[0]}</span>
            `;
            colorPaletteSelector.appendChild(button);
        });
    };

    const updateMethodToggleUI = () => {
        document.querySelectorAll('#focus-method-toggle .method-btn').forEach(btn => {
            const isSelected = btn.dataset.method === focusMethod;
            btn.classList.toggle('bg-primary-focus', isSelected);
            btn.classList.toggle('text-white', isSelected);
            // Verifica se o tema atual é um tema escuro para ajustar a cor do texto quando não selecionado
            const isDarkTheme = (settings.theme.includes('dark') || settings.theme.includes('onyx') || settings.theme.includes('slate') || settings.theme.includes('brasil_dark') || settings.theme.includes('saopaulo_dark') || settings.theme.includes('bahia_dark') || settings.theme.includes('ceara_dark') || settings.theme.includes('maranhao_dark') || settings.theme.includes('paraiba_dark') || settings.theme.includes('acre_dark') || settings.theme.includes('amapa_dark') || settings.theme.includes('para_dark') || settings.theme.includes('rondonia_dark') || settings.theme.includes('parana_dark') || settings.theme.includes('riograndedosul_dark') || settings.theme.includes('matogrosso_dark') || settings.theme.includes('distritofederal_dark') || settings.theme.includes('sergipe_dark'));
            btn.classList.toggle(isDarkTheme ? 'text-gray-400' : 'text-gray-500', !isSelected);
        });
        pomodoroCyclesEl.style.display = focusMethod === 'pomodoro' ? 'flex' : 'none';
        newTaskEstimateInput.style.display = focusMethod === 'pomodoro' ? 'inline-block' : 'none';
        newTaskEstimateLabel.style.display = focusMethod === 'pomodoro' ? 'inline-block' : 'none';
        helpContentPomodoro.style.display = focusMethod === 'pomodoro' ? 'block' : 'none';
        helpContentAdaptativo.style.display = focusMethod === 'adaptativo' ? 'block' : 'none';
        if (!isRunning) resetTimer('focus');
    };

    // --- FUNÇÕES DO TIMER ---
    const showModal = (modalOverlay, message) => {
        const messageElId = modalOverlay.id.replace('-overlay', '-message');
        const messageEl = document.getElementById(messageElId);
        if(messageEl && message) messageEl.textContent = message;
        modalOverlay.classList.add('visible');
    };
    const hideModal = (modalOverlay) => {
        clearBadge();
        modalOverlay.classList.remove('visible');
    };
    const startTimer = () => {
        if (isRunning) return;
        if (!selectedTaskId && mode === 'focus') {
            showModal(alertModalOverlay, 'Por favor, selecione uma tarefa para iniciar o foco.');
            return;
        }
        clearBadge();
        if (focusMethod === 'pomodoro' || mode !== 'focus') {
            timeRemaining = (settings[`${mode}Duration`] || 25) * 60;
            totalTime = timeRemaining;
        } else {
            timeRemaining = 0;
            totalTime = 1;
        }
        isRunning = true;
        endTime = Date.now() + (focusMethod === 'pomodoro' || mode !== 'focus' ? timeRemaining * 1000 : 0);
        updateUI();
        timerInterval = setInterval(updateTimer, 1000);
    };
    const pauseTimer = () => {
        if (!isRunning) return;
        isRunning = false;
        clearInterval(timerInterval);
        if (focusMethod === 'pomodoro' || mode !== 'focus') timeRemaining = Math.round((endTime - Date.now()) / 1000);
        saveState();
        updateUI();
    };
    const updateTimerDisplay = () => {
        const totalSecondsAbs = Math.abs(timeRemaining);
        const hours = Math.floor(totalSecondsAbs / 3600);
        const minutes = Math.floor((totalSecondsAbs % 3600) / 60);
        const seconds = totalSecondsAbs % 60;
        let display = (hours > 0)
            ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timerDisplay.textContent = display;
        document.title = `${display} - Foco Total`;
        const circumference = 2 * Math.PI * 45;
        let progress = 0;
        if (focusMethod === 'pomodoro' || mode !== 'focus') {
            if (totalTime > 0) progress = (totalTime - timeRemaining) / totalTime;
        } else {
            progress = isRunning ? 1 : 0;
        }
        progressRing.style.strokeDasharray = circumference;
        progressRing.style.strokeDashoffset = circumference * (1 - progress);
    };
    const updateTimer = () => {
        if (focusMethod === 'pomodoro' || mode !== 'focus') {
            const remaining = Math.round((endTime - Date.now()) / 1000);
            if (remaining >= 0) {
                timeRemaining = remaining;
                updateTimerDisplay();
                if (mode === 'focus' && focusMethod === 'pomodoro' && timeRemaining <= 10 && timeRemaining > 0) playTickSound();
            } else {
                clearInterval(timerInterval);
                switchMode();
            }
        } else {
            timeRemaining++;
            updateTimerDisplay();
        }
    };
    // --- LÓGICA DE GERAÇÃO DE .ICS ---
    const generateICS = (durationMinutes, title, description) => {
        const eventStartTime = new Date(new Date().getTime() + durationMinutes * 60 * 1000);
        const eventEndTime = new Date(eventStartTime.getTime() + 1 * 60 * 1000);
        const formatDT = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        return [
            'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//FocoTotal//PWA//PT',
            'BEGIN:VEVENT', 'UID:' + Date.now() + '@focototal.app', 'DTSTAMP:' + formatDT(new Date()),
            'DTSTART:' + formatDT(eventStartTime), 'DTEND:' + formatDT(eventEndTime),
            'SUMMARY:' + title, 'DESCRIPTION:' + description,
            'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + description, 'TRIGGER:-PT0S', 'END:VALARM',
            'END:VEVENT', 'END:VCALENDAR'
        ].join('\r\n');
    };
    const downloadICS = (icsContent) => {
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isIOS) {
            const base64Content = btoa(unescape(encodeURIComponent(icsContent)));
            window.location.href = `data:text/calendar;base64,${base64Content}`;
        } else {
            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'lembrete_foco.ics';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        }
    };
    const switchMode = () => {
        isRunning = false;
        endTime = null;
        playFinishSound();
        setBadge();
        if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);

        if ('Notification' in window && Notification.permission === 'granted') {
            const notificationTitle = mode === 'focus' ? 'Foco Finalizado!' : 'Pausa Finalizada!';
            const notificationBody = mode === 'focus' ? 'Hora de fazer uma pausa.' : 'Vamos voltar ao trabalho?';
            navigator.serviceWorker.ready.then(reg => reg.showNotification(notificationTitle, { body: notificationBody, icon: '/icon-192x192.png', renotify: true, tag: 'foco-total-notification' }));
        }
        if (mode === 'focus') {
            const task = tasks.find(t => t.id === selectedTaskId);
            if (task) {
                if (focusMethod === 'pomodoro') {
                    pomodoroSessionCount++;
                    task.pomodorosCompleted++;
                    task.focusTime += settings.focusDuration * 60;
                } else {
                    task.focusTime += timeRemaining;
                }
            }
            mode = (focusMethod === 'pomodoro' && pomodoroSessionCount % settings.longBreakInterval === 0) ? 'longBreak' : 'shortBreak';
            showModal(sessionEndModalOverlay, `Você ${focusMethod === 'pomodoro' ? 'completou um Pomodoro!' : 'finalizou seu foco.'} Hora de fazer uma pausa.`);
        } else {
            mode = 'focus';
            showModal(sessionEndModalOverlay, 'Pausa finalizada! Vamos voltar ao trabalho?');
        }
        resetTimer();
        renderTasks();
    };

    const resetTimer = (forceMode = null) => {
        clearInterval(timerInterval);
        isRunning = false;
        endTime = null;
        mode = forceMode || mode;
        if (focusMethod === 'pomodoro' || mode !== 'focus') {
            timeRemaining = (settings[`${mode}Duration`] || 25) * 60;
            totalTime = timeRemaining;
        } else {
            timeRemaining = 0;
            totalTime = 1;
        }
        saveState();
        updateUI();
    };
    const resetDay = () => {
        pauseTimer();
        tasks = [];
        selectedTaskId = null;
        pomodoroSessionCount = 0;
        resetTimer('focus');
        renderTasks();
        hideModal(resetConfirmModalOverlay);
        showModal(alertModalOverlay, 'O dia foi zerado com sucesso!');
    };
    const updateUI = () => {
        updateTimerDisplay();
        // Usa o tema atualmente salvo nas configurações
        const currentTheme = themes[settings.theme] || themes.dark_blue; 

        if (mode === 'shortBreak') progressRing.style.stroke = currentTheme['--color-break-short'];
        else if (mode === 'longBreak') progressRing.style.stroke = currentTheme['--color-break-long'];
        else progressRing.style.stroke = `rgb(${currentTheme['--color-primary-rgb']})`;
        
        if (focusMethod === 'adaptativo' && mode === 'focus' && isRunning) progressRing.classList.add('breathing');
        else progressRing.classList.remove('breathing');

        let btnIcon, btnBgClass, ariaLabelText;
        if (focusMethod === 'pomodoro' || mode !== 'focus') {
            btnIcon = isRunning ? 'pause' : 'play';
            btnBgClass = isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-primary-focus hover:bg-primary-darker';
            ariaLabelText = isRunning ? 'Pausar Timer' : 'Iniciar Timer';
        } else {
            if (isRunning) {
                btnIcon = 'square';
                btnBgClass = 'bg-red-600 hover:bg-red-700';
                ariaLabelText = 'Parar Foco Adaptativo';
            } else {
                btnIcon = 'play';
                btnBgClass = 'bg-primary-focus hover:bg-primary-darker';
                ariaLabelText = 'Iniciar Foco Adaptativo';
            }
        }
        startPauseBtn.className = `w-20 h-20 text-white font-bold rounded-full text-base transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center ${btnBgClass}`;
        startPauseBtn.innerHTML = `<i data-lucide="${btnIcon}" class="w-8 h-8 ${btnIcon === 'play' ? 'pl-1' : ''}"></i>`;
        startPauseBtn.setAttribute('aria-label', ariaLabelText);
        internalInterruptBtn.style.display = (isRunning && mode === 'focus') ? 'flex' : 'none';
        externalInterruptBtn.style.display = (isRunning && mode === 'focus') ? 'flex' : 'none';
        updateCurrentTaskDisplay();
        updateStatsDisplay();
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
    const updateStatsDisplay = () => {
        if (tasks.length === 0) {
            statsContentEl.innerHTML = '<p class="text-muted text-center">Nenhuma tarefa para exibir.</p>';
            return;
        }
        let statsHTML = '<div class="space-y-3">';
        [...tasks].sort((a, b) => a.completed - b.completed).forEach(task => {
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
        statsHTML += '</div>';
        statsContentEl.innerHTML = statsHTML;
    };
    const renderTasks = () => {
        const tasksToRender = showCompletedTasks ? tasks : tasks.filter(task => !task.completed);
        taskListEl.innerHTML = tasksToRender.length === 0 ? '<p class="text-muted text-center text-sm">Adicione a sua primeira tarefa!</p>' : '';
        tasksToRender.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = `task-item p-3 rounded-lg border-2 border-transparent cursor-pointer ${task.id === selectedTaskId ? 'selected' : ''} ${task.completed ? 'opacity-60' : ''}`;
            taskEl.dataset.id = task.id;
            if (task.justAdded) {
                taskEl.classList.add('added-feedback');
                taskEl.addEventListener('animationend', () => {
                    taskEl.classList.remove('added-feedback');
                    task.justAdded = false;
                    saveState();
                }, { once: true });
            }
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
                ${focusMethod === 'pomodoro' ? `<span class="text-muted font-bold flex items-center justify-center" title="Pomodoros"><i data-lucide="check-circle-2" class="w-4 h-4 mr-1 text-green-500"></i>${task.pomodorosCompleted}/${task.pomodoroEstimate}</span>` : ''}
                <span class="text-muted font-bold flex items-center justify-center" title="Tempo de Foco"><i data-lucide="clock" class="w-4 h-4 mr-1 text-primary-light"></i>${formatTime(task.focusTime)}</span>
                <span class="text-muted font-bold flex items-center justify-center" title="Interrupções Internas"><i data-lucide="zap-off" class="w-4 h-4 mr-1"></i>${task.internalInterruptions}</span>
                <span class="text-muted font-bold flex items-center justify-center" title="Interrupções Externas"><i data-lucide="user-x" class="w-4 h-4 mr-1"></i>${task.externalInterruptions}</span>
            </div>`;
            taskListEl.appendChild(taskEl);
        });
        updateCurrentTaskDisplay();
        updateStatsDisplay();
        saveState();
        lucide.createIcons();
    };
    const addTask = () => {
        if (!audioInitialized) audioContext.resume().then(() => audioInitialized = true);
        const taskName = newTaskInput.value.trim();
        const estimate = (focusMethod === 'pomodoro') ? (parseInt(newTaskEstimateInput.value) || 1) : 1;
        if (taskName) {
            const newTask = { id: Date.now(), name: taskName, pomodoroEstimate: estimate, pomodorosCompleted: 0, internalInterruptions: 0, externalInterruptions: 0, focusTime: 0, completed: false, isEditing: false, justAdded: true };
            tasks.push(newTask);
            newTaskInput.value = '';
            newTaskEstimateInput.value = '1';
            playBeep(440, 100, 0.2);
            const currentSelectedTask = tasks.find(t => t.id === selectedTaskId);
            if (!currentSelectedTask || currentSelectedTask.completed) selectTask(newTask.id);
            else renderTasks();
        }
    };
    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        if (selectedTaskId === id) {
            const firstIncompleteTask = tasks.find(t => !t.completed);
            selectTask(firstIncompleteTask ? firstIncompleteTask.id : null);
        } else {
            renderTasks();
        }
    };
    const toggleTaskCompleted = (id) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            if (task.completed && selectedTaskId === id) {
                if(isRunning) pauseTimer();
                const firstIncompleteTask = tasks.find(t => !t.completed);
                selectTask(firstIncompleteTask ? firstIncompleteTask.id : null);
                if (!isRunning && mode === 'focus') resetTimer('focus');
            }
            renderTasks();
        }
    };
    const toggleEditState = (id) => {
        tasks.forEach(task => task.isEditing = task.id === id ? !task.isEditing : false);
        renderTasks();
        const input = document.querySelector(`[data-edit-input-id="${id}"]`);
        if (input) { input.focus(); input.select(); }
    };
    const updateTaskName = (id, newName) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            if (newName) task.name = newName;
            task.isEditing = false;
            renderTasks();
        }
    };
    const selectTask = (id) => {
        const task = tasks.find(t => t.id === id);
        if ((task || id === null) && !tasks.some(t => t.isEditing)) {
            selectedTaskId = id;
            renderTasks();
            if (!isRunning) resetTimer('focus');
        }
    };
    const logInterruption = (type) => {
        if (isRunning && mode === 'focus' && selectedTaskId) {
            const task = tasks.find(t => t.id === selectedTaskId);
            if (task) {
                if (type === 'internal') task.internalInterruptions++;
                else if (type === 'external') task.externalInterruptions++;
                renderTasks();
                showModal(alertModalOverlay, `Interrupção ${type === 'internal' ? 'interna' : 'externa'} registrada!`);
            }
        } else {
            showModal(alertModalOverlay, 'Só pode registrar interrupções durante um foco ativo.');
        }
    };
    const updateCurrentTaskDisplay = () => {
        const task = tasks.find(t => t.id === selectedTaskId);
        currentTaskDisplay.textContent = task ? task.name : 'Nenhuma tarefa selecionada';
        pomodoroCyclesEl.innerHTML = '';
        if (focusMethod !== 'pomodoro' || !settings.longBreakInterval || settings.longBreakInterval <= 0) return;
        const cyclesToShow = pomodoroSessionCount % settings.longBreakInterval;
        for(let i = 0; i < settings.longBreakInterval; i++) {
            const icon = i < cyclesToShow ? '<i data-lucide="check-circle-2" class="text-green-500"></i>' : '<i data-lucide="circle" class="text-muted"></i>';
            pomodoroCyclesEl.innerHTML += `<span class="transition-all">${icon}</span>`;
        }
        lucide.createIcons();
    };
    const saveState = () => {
        const state = { settings, tasks, selectedTaskId, pomodoroSessionCount, focusMethod, showCompletedTasks, timerState: { isRunning, mode, endTime, totalTime } };
        localStorage.setItem('pomodoroAppState', JSON.stringify(state));
    };
    const loadState = () => {
        const state = JSON.parse(localStorage.getItem('pomodoroAppState'));
        if (state) {
            settings = { ...settings, ...state.settings };
            tasks = state.tasks || [];
            selectedTaskId = state.selectedTaskId;
            pomodoroSessionCount = state.pomodoroSessionCount || 0;
            focusMethod = state.focusMethod || 'pomodoro';
            showCompletedTasks = state.showCompletedTasks || false;
            if (state.timerState) {
                const { isRunning: wasRunning, mode: savedMode, endTime: savedEndTime, totalTime: savedTotalTime } = state.timerState;
                mode = savedMode;
                totalTime = savedTotalTime;
                if (wasRunning && savedEndTime && savedEndTime > Date.now()) {
                    endTime = savedEndTime;
                    timeRemaining = Math.round((endTime - Date.now()) / 1000);
                    isRunning = true;
                    timerInterval = setInterval(updateTimer, 1000);
                }
            }
        }
        tasks.forEach(t => {
            t.isEditing = false;
            t.justAdded = false;
            if (t.internalInterruptions === undefined) {
                t.internalInterruptions = 0;
                t.externalInterruptions = t.interruptions || 0;
                delete t.interruptions;
            }
        });
        focusDurationInput.value = settings.focusDuration;
        shortBreakDurationInput.value = settings.shortBreakDuration;
        longBreakDurationInput.value = settings.longBreakDuration;
        longBreakIntervalInput.value = settings.longBreakInterval;
        if (selectedTaskId && (!tasks.find(t => t.id === selectedTaskId) || tasks.find(t => t.id === selectedTaskId).completed)) {
            selectedTaskId = null;
        }
        if (!selectedTaskId) {
            const firstIncompleteTask = tasks.find(t => !t.completed);
            if (firstIncompleteTask) selectedTaskId = firstIncompleteTask.id;
        }
    };
    // --- EVENT LISTENERS ---

    const handleStartPauseClick = () => {
        startPauseBtn.classList.add('start-pause-btn-clicked');
        startPauseBtn.addEventListener('animationend', () => startPauseBtn.classList.remove('start-pause-btn-clicked'), { once: true });
        if (focusMethod === 'pomodoro' || mode !== 'focus') {
            isRunning ? pauseTimer() : startTimer();
        } else {
            if (isRunning) {
                pauseTimer();
                const task = tasks.find(t => t.id === selectedTaskId);
                if (task) task.focusTime += timeRemaining;
                showModal(sessionEndModalOverlay, `Você se concentrou por ${formatTime(timeRemaining)}.`);
                resetTimer('focus');
            } else {
                endTime = null;
                startTimer();
            }
        }
    };

    startPauseBtn.addEventListener('click', () => {
        if (!audioInitialized) audioContext.resume().then(() => audioInitialized = true);
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isIOS && !isRunning && focusMethod === 'pomodoro') {
            if (mode === 'focus') {
                iosPromptTitle.textContent = 'Lembrete de Foco';
                iosPromptMessage.textContent = 'Para garantir o alarme no final do foco, recomendamos criar um lembrete. Deseja fazer isso agora?';
            } else {
                iosPromptTitle.textContent = 'Lembrete de Pausa';
                iosPromptMessage.textContent = 'Para garantir o alarme no final da pausa, recomendamos criar um lembrete. Deseja fazer isso agora?';
            }
            showModal(iosStartPromptModalOverlay);
        } else {
            handleStartPauseClick();
        }
    });
    iosPromptConfirmBtn.addEventListener('click', () => {
        let duration, eventTitle, eventDescription;
        if (mode === 'focus') {
            const task = tasks.find(t => t.id === selectedTaskId);
            const taskName = task ? task.name : 'Foco';
            eventTitle = `🎉 Fim do Foco: ${taskName}`;
            eventDescription = `Sua sessão de foco na tarefa "${taskName}" terminou. Hora de fazer uma pausa!`;
            duration = settings.focusDuration;
        } else if (mode === 'shortBreak') {
            eventTitle = `🚀 Fim da Pausa Curta`;
            eventDescription = `Sua pausa curta acabou. Hora de voltar ao foco!`;
            duration = settings.shortBreakDuration;
        } else { // longBreak
            eventTitle = `🏆 Fim da Pausa Longa`;
            eventDescription = `Sua pausa longa acabou. Hora de voltar ao foco!`;
            duration = settings.longBreakDuration;
        }
        const icsContent = generateICS(duration, eventTitle, eventDescription);
        downloadICS(icsContent);
        handleStartPauseClick();
        hideModal(iosStartPromptModalOverlay);
    });
    iosPromptCancelBtn.addEventListener('click', () => {
        handleStartPauseClick();
        hideModal(iosStartPromptModalOverlay);
    });
    resetBtn.addEventListener('click', () => showModal(resetConfirmModalOverlay));
    resetConfirmBtn.addEventListener('click', resetDay);
    resetCancelBtn.addEventListener('click', () => hideModal(resetConfirmModalOverlay));
    internalInterruptBtn.addEventListener('click', () => logInterruption('internal'));
    externalInterruptBtn.addEventListener('click', () => logInterruption('external'));
    settingsBtn.addEventListener('click', () => {
        renderPaletteSelector(); // Gera os botões da paleta de cores sempre que o modal de configurações é aberto
        showModal(settingsModalOverlay);
    });
    statsBtn.addEventListener('click', () => showModal(statsModalOverlay));
    helpBtn.addEventListener('click', () => showModal(helpModalOverlay));
    statsModalCloseBtn.addEventListener('click', () => hideModal(statsModalOverlay));
    helpModalCloseBtn.addEventListener('click', () => hideModal(helpModalOverlay));
    alertModalCloseBtn.addEventListener('click', () => hideModal(alertModalOverlay));
    sessionEndCloseBtn.addEventListener('click', () => hideModal(sessionEndModalOverlay));
    settingsSaveBtn.addEventListener('click', () => {
        settings.focusDuration = parseInt(focusDurationInput.value) || 25;
        settings.shortBreakDuration = parseInt(shortBreakDurationInput.value) || 5;
        settings.longBreakDuration = parseInt(longBreakDurationInput.value) || 15;
        settings.longBreakInterval = parseInt(longBreakIntervalInput.value) || 4;
        hideModal(settingsModalOverlay);
        if (!isRunning) resetTimer('focus');
        saveState();
    });
    // Event listener para seleção de tema na paleta de cores
    colorPaletteSelector.addEventListener('click', (e) => {
        const target = e.target.closest('button[data-theme]');
        if (target) {
            settings.theme = target.dataset.theme; // Atualiza o tema nas configurações
            applyTheme(settings.theme); // Aplica o novo tema imediatamente
            renderPaletteSelector(); // Re-renderiza a paleta para atualizar o estado selecionado
            updateMethodToggleUI(); // Atualiza UI de alternância de método (se necessário)
            updateUI(); // Atualiza a UI para refletir a nova cor do anel de progresso
            saveState(); // Salva o estado após a mudança de tema
        }
    });
    addTaskBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });
    focusMethodToggle.addEventListener('click', (e) => {
        const target = e.target.closest('.method-btn');
        if (target && !isRunning) {
            focusMethod = target.dataset.method;
            updateMethodToggleUI();
            renderTasks();
            saveState();
        } else if (isRunning) {
            showModal(alertModalOverlay, 'Não é possível trocar de modo enquanto o timer está rodando.');
        }
    });
    toggleCompletedTasksBtn.addEventListener('click', () => {
        showCompletedTasks = !showCompletedTasks;
        toggleCompletedTasksBtn.textContent = showCompletedTasks ? 'Esconder Concluídas' : 'Mostrar Concluídas';
        renderTasks();
    });
    [alertModalOverlay, settingsModalOverlay, statsModalOverlay, helpModalOverlay, resetConfirmModalOverlay, sessionEndModalOverlay, iosStartPromptModalOverlay].forEach(overlay => {
        overlay.addEventListener('click', (e) => { if (e.target === overlay) hideModal(overlay); });
    });
    taskListEl.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('[data-delete-id]');
        const completeBtn = e.target.closest('[data-complete-id]');
        const editBtn = e.target.closest('[data-edit-id]');
        const taskItem = e.target.closest('.task-item');
        if (deleteBtn) { deleteTask(parseInt(deleteBtn.dataset.deleteId)); return; }
        if (completeBtn) { toggleTaskCompleted(parseInt(completeBtn.dataset.completeId)); return; }
        if (editBtn) {
            const id = parseInt(editBtn.dataset.editId);
            const task = tasks.find(t => t.id === id);
            if (task && task.isEditing) {
                const input = taskListEl.querySelector(`[data-edit-input-id="${id}"]`);
                if (input) updateTaskName(id, input.value.trim());
            } else {
                toggleEditState(id);
            }
            return;
        }
        if (taskItem) { selectTask(parseInt(taskItem.dataset.id)); }
    });
    taskListEl.addEventListener('keyup', (e) => {
        if (e.target.matches('.task-edit-input')) {
            const id = parseInt(e.target.dataset.editInputId);
            if (e.key === 'Enter') updateTaskName(id, e.target.value.trim());
            else if (e.key === 'Escape') toggleEditState(null);
        }
    });
    taskListEl.addEventListener('focusout', (e) => {
        if (e.target.matches('.task-edit-input')) {
            const id = parseInt(e.target.dataset.editInputId);
            setTimeout(() => {
                const task = tasks.find(t => t.id === id);
                if (task && task.isEditing) updateTaskName(id, e.target.value.trim());
            }, 150);
        }
    });

    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
    loadState();
    // Aplica o tema salvo (ou o padrão) na inicialização
    applyTheme(settings.theme); 
    updateMethodToggleUI();
    renderTasks();
    updateUI();
    lucide.createIcons();
    document.addEventListener('click', () => {
        if (audioContext.state === 'suspended') audioContext.resume().then(() => audioInitialized = true);
        clearBadge();
    }, { once: true });
});
