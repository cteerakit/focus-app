/**
 * Focus Dashboard - Refactored Application
 * All functionality bundled for direct browser use
 */

// ============================================
// UTILITIES
// ============================================
function makeDraggable(el, handle, storageKey) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
        el.style.right = 'auto';
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify({
                top: el.style.top,
                left: el.style.left
            }));
        }
    }
}

// ============================================
// CLOCK CLASS
// ============================================
class Clock {
    constructor(timeEl, dateEl, greetingEl) {
        this.timeEl = timeEl;
        this.dateEl = dateEl;
        this.greetingEl = greetingEl;
        this.is24Hour = localStorage.getItem('is24Hour') !== 'false';
        this.lastDay = null;
    }

    toggleFormat() {
        this.is24Hour = !this.is24Hour;
        localStorage.setItem('is24Hour', this.is24Hour);
        this.update();
        return this.is24Hour;
    }

    update() {
        const now = new Date();

        // Time logic
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');

        if (!this.is24Hour) {
            hours = hours % 12 || 12;
        }

        const hoursStr = String(hours).padStart(2, '0');
        this.timeEl.textContent = `${hoursStr}:${minutes}`;

        // Date logic
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

        this.dateEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;

        // Greeting logic
        const hour = now.getHours();
        if (hour < 12) this.greetingEl.textContent = 'Good Morning';
        else if (hour < 18) this.greetingEl.textContent = 'Good Afternoon';
        else this.greetingEl.textContent = 'Good Evening';

        // Check if day changed for quote updates etc
        const currentDay = now.getDate();
        const dayChanged = this.lastDay !== currentDay;
        this.lastDay = currentDay;

        return { dayChanged, is24Hour: this.is24Hour };
    }

    start() {
        this.update();
        setInterval(() => this.update(), 1000);
    }
}

// ============================================
// BACKGROUND MANAGER CLASS
// ============================================
class BackgroundManager {
    constructor(layers, buttons, themeButtons) {
        this.layers = layers;
        this.buttons = buttons;
        this.themeButtons = themeButtons;
        this.activeLayer = 0;
        this.backgrounds = {
            'bg-1': 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80")',
            'bg-2': 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=1920&q=80")',
            'bg-3': 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1920&q=80")',
            'bg-4': 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=1920&q=80")'
        };

        this.init();
    }

    init() {
        // Init Background
        const savedBg = localStorage.getItem('selectedBg') || 'bg-1';
        this.layers[0].style.backgroundImage = this.backgrounds[savedBg];
        this.updateButtonStates(savedBg);

        // Init Theme
        const savedAccent = localStorage.getItem('accentColor') || '#6366f1';
        document.documentElement.style.setProperty('--accent', savedAccent);
        this.updateThemeButtonStates(savedAccent);

        // Event Listeners for Backgrounds
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const bgKey = btn.getAttribute('data-bg');
                this.switchBackground(bgKey);
            });
        });

        // Event Listeners for Themes
        this.themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.getAttribute('data-color');
                this.setThemeColor(color);
            });
        });
    }

    switchBackground(bgKey) {
        const nextLayer = 1 - this.activeLayer;
        const bgUrl = this.backgrounds[bgKey] || this.backgrounds['bg-1'];

        this.layers[nextLayer].style.backgroundImage = bgUrl;
        this.layers[nextLayer].style.opacity = '1';
        this.layers[this.activeLayer].style.opacity = '0';

        this.activeLayer = nextLayer;
        localStorage.setItem('selectedBg', bgKey);
        this.updateButtonStates(bgKey);
    }

    updateButtonStates(activeBg) {
        this.buttons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-bg') === activeBg);
        });
    }

    setThemeColor(color) {
        document.documentElement.style.setProperty('--accent', color);
        localStorage.setItem('accentColor', color);
        this.updateThemeButtonStates(color);
    }

    updateThemeButtonStates(activeColor) {
        this.themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-color') === activeColor);
        });
    }
}

// ============================================
// QUOTE MANAGER CLASS
// ============================================
class QuoteManager {
    constructor(container, textEl, authorEl, toggleBtn) {
        this.container = container;
        this.textEl = textEl;
        this.authorEl = authorEl;
        this.toggleBtn = toggleBtn;
        this.showQuote = localStorage.getItem('showQuote') !== 'false';
        this.quotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
            { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
            { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { text: "Your talent determines what you can do. Your motivation determines how much you are willing to do.", author: "Lou Holtz" },
            { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
            { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
            { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
            { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" }
        ];

        this.init();
    }

    init() {
        this.updateVisibility();
        this.updateQuote();

        this.toggleBtn.addEventListener('click', () => {
            this.toggle();
        });
    }

    toggle() {
        this.showQuote = !this.showQuote;
        localStorage.setItem('showQuote', this.showQuote);
        this.updateVisibility();
    }

    updateVisibility() {
        this.container.style.display = this.showQuote ? 'flex' : 'none';
        this.toggleBtn.classList.toggle('active', this.showQuote);
    }

    updateQuote() {
        const now = new Date();
        const daysSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
        const quoteIndex = daysSinceEpoch % this.quotes.length;
        const quote = this.quotes[quoteIndex];

        this.textEl.textContent = `"${quote.text}"`;
        this.authorEl.textContent = `— ${quote.author}`;
    }
}

// ============================================
// NOTE MANAGER CLASS
// ============================================
class NoteManager {
    constructor(toggleBtn, windowEl, closeBtn, areaEl, headerEl) {
        this.toggleBtn = toggleBtn;
        this.windowEl = windowEl;
        this.closeBtn = closeBtn;
        this.areaEl = areaEl;
        this.headerEl = headerEl;

        this.init();
    }

    init() {
        // Load content
        this.areaEl.value = localStorage.getItem('quickNote') || '';

        // Load visibility & position
        const isVisible = localStorage.getItem('noteVisible') === 'true';
        const savedPos = JSON.parse(localStorage.getItem('notePos'));

        if (isVisible) {
            this.show();
            if (savedPos) {
                this.windowEl.style.top = savedPos.top;
                this.windowEl.style.left = savedPos.left;
                this.windowEl.style.right = 'auto';
            }
        }

        // Draggable
        makeDraggable(this.windowEl, this.headerEl, 'notePos');

        // Listeners
        this.toggleBtn.addEventListener('click', () => this.toggle());
        this.closeBtn.addEventListener('click', () => this.hide());
        this.areaEl.addEventListener('input', () => {
            localStorage.setItem('quickNote', this.areaEl.value);
        });
    }

    toggle() {
        if (this.windowEl.style.display === 'none') {
            this.show();
        } else {
            this.hide();
        }
    }

    show() {
        this.windowEl.style.display = 'flex';
        this.toggleBtn.classList.add('active');
        localStorage.setItem('noteVisible', 'true');
        this.areaEl.focus();
    }

    hide() {
        this.windowEl.style.display = 'none';
        this.toggleBtn.classList.remove('active');
        localStorage.setItem('noteVisible', 'false');
    }
}

// ============================================
// TIMER MANAGER CLASS
// ============================================
class TimerManager {
    constructor(elements) {
        this.toggleBtn = elements.toggleBtn;
        this.windowEl = elements.windowEl;
        this.closeBtn = elements.closeBtn;
        this.displayEl = elements.displayEl;
        this.startBtn = elements.startBtn;
        this.resetBtn = elements.resetBtn;
        this.presetBtns = elements.presetBtns;
        this.headerEl = elements.headerEl;

        this.timeLeft = parseInt(localStorage.getItem('timerTimeLeft')) || 25 * 60;
        this.timerId = null;
        this.isRunning = false;

        this.init();
    }

    init() {
        // Load state
        const isVisible = localStorage.getItem('timerVisible') === 'true';
        const savedPos = JSON.parse(localStorage.getItem('timerPos'));
        const savedEndTime = localStorage.getItem('timerEndTime');
        const wasRunning = localStorage.getItem('timerRunning') === 'true';

        if (isVisible) {
            this.show();
            if (savedPos) {
                this.windowEl.style.top = savedPos.top;
                this.windowEl.style.left = savedPos.left;
            }
        }

        // Check active session
        if (wasRunning && savedEndTime) {
            const end = parseInt(savedEndTime);
            const now = Date.now();
            if (end > now) {
                this.timeLeft = Math.floor((end - now) / 1000);
                this.updateDisplay();
                this.start();
            } else {
                this.clearTimerData();
                this.timeLeft = 25 * 60;
                this.updateDisplay();
            }
        } else {
            this.updateDisplay();
        }

        // Draggable
        makeDraggable(this.windowEl, this.headerEl, 'timerPos');

        // Listeners
        this.toggleBtn.addEventListener('click', () => this.toggle());
        this.closeBtn.addEventListener('click', () => this.hide());
        this.startBtn.addEventListener('click', () => this.isRunning ? this.pause() : this.start());
        this.resetBtn.addEventListener('click', () => this.reset());

        this.presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mins = parseInt(btn.getAttribute('data-time'));
                this.setPreset(mins);
            });
        });
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.displayEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        localStorage.setItem('timerTimeLeft', this.timeLeft);
    }

    start() {
        this.isRunning = true;
        this.startBtn.textContent = 'Pause';
        this.startBtn.classList.add('running');
        localStorage.setItem('timerRunning', 'true');

        const endTime = Date.now() + (this.timeLeft * 1000);
        localStorage.setItem('timerEndTime', endTime);

        this.timerId = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            if (this.timeLeft <= 0) {
                this.complete();
            }
        }, 1000);
    }

    pause() {
        clearInterval(this.timerId);
        this.isRunning = false;
        this.startBtn.textContent = 'Start';
        this.startBtn.classList.remove('running');
        localStorage.setItem('timerRunning', 'false');
        localStorage.removeItem('timerEndTime');
    }

    reset() {
        clearInterval(this.timerId);
        this.isRunning = false;
        this.startBtn.textContent = 'Start';
        this.startBtn.classList.remove('running');
        this.timeLeft = 25 * 60;
        this.clearTimerData();
        this.updateDisplay();
    }

    clearTimerData() {
        localStorage.removeItem('timerEndTime');
        localStorage.setItem('timerRunning', 'false');
    }

    complete() {
        this.pause();
        alert('Focus session complete!');
        this.timeLeft = 25 * 60;
        this.updateDisplay();
    }

    toggle() {
        if (this.windowEl.style.display === 'none') {
            this.show();
        } else {
            this.hide();
        }
    }

    show() {
        this.windowEl.style.display = 'flex';
        this.toggleBtn.classList.add('active');
        localStorage.setItem('timerVisible', 'true');
    }

    hide() {
        this.windowEl.style.display = 'none';
        this.toggleBtn.classList.remove('active');
        localStorage.setItem('timerVisible', 'false');
    }

    setPreset(mins) {
        this.timeLeft = mins * 60;
        this.updateDisplay();
        if (this.isRunning) {
            this.pause();
        }
    }
}

// ============================================
// MAIN APPLICATION INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Clock
    const clock = new Clock(
        document.getElementById('time'),
        document.getElementById('date'),
        document.getElementById('greeting-text')
    );

    // 2. Initialize Background & Themes
    const background = new BackgroundManager(
        [document.getElementById('bg-layer-1'), document.getElementById('bg-layer-2')],
        document.querySelectorAll('.bg-btn'),
        document.querySelectorAll('.theme-btn')
    );

    // 3. Initialize Quote
    const quote = new QuoteManager(
        document.getElementById('quote-container'),
        document.getElementById('quote-text'),
        document.getElementById('quote-author'),
        document.getElementById('quote-toggle')
    );

    // 4. Initialize Notes
    const notes = new NoteManager(
        document.getElementById('note-toggle'),
        document.getElementById('note-window'),
        document.getElementById('note-close'),
        document.getElementById('note-area'),
        document.getElementById('note-header')
    );

    // 5. Initialize Timer
    const timer = new TimerManager({
        toggleBtn: document.getElementById('timer-toggle'),
        windowEl: document.getElementById('timer-window'),
        closeBtn: document.getElementById('timer-close'),
        displayEl: document.getElementById('timer-display'),
        startBtn: document.getElementById('timer-start'),
        resetBtn: document.getElementById('timer-reset'),
        presetBtns: document.querySelectorAll('.preset-btn'),
        headerEl: document.getElementById('timer-header')
    });

    // 6. UI Controls (Format Toggle, Master Toggle)
    const formatToggle = document.getElementById('format-toggle');
    formatToggle.addEventListener('click', () => {
        const is24H = clock.toggleFormat();
        formatToggle.textContent = is24H ? '24H' : '12H';
    });
    formatToggle.textContent = clock.is24Hour ? '24H' : '12H';

    // Master Toggle Logic
    const masterToggle = document.getElementById('master-toggle');
    const controls = document.getElementById('controls');
    let menuVisible = localStorage.getItem('menuVisible') !== 'false';

    const updateMenuVisibility = () => {
        if (menuVisible) {
            controls.classList.remove('hide-menu');
            masterToggle.classList.remove('active');
            masterToggle.title = "Hide Menu";
        } else {
            controls.classList.add('hide-menu');
            controls.classList.remove('animate-in');
            masterToggle.classList.add('active');
            masterToggle.title = "Show Menu";
        }
    };

    masterToggle.addEventListener('click', () => {
        menuVisible = !menuVisible;
        localStorage.setItem('menuVisible', menuVisible);
        updateMenuVisibility();
    });

    // Initial check
    updateMenuVisibility();

    // Start clock and hook into day changes
    clock.start();

    // Check for day changes to update quote
    setInterval(() => {
        const { dayChanged } = clock.update() || {};
        if (dayChanged) {
            quote.updateQuote();
        }
    }, 60000);

    // Initial Entrance Sequence
    setTimeout(() => {
        const startElements = document.querySelectorAll('.start-state');
        startElements.forEach(el => el.classList.remove('start-state'));

        const animatedElements = document.querySelectorAll('.animate-in');
        setTimeout(() => {
            animatedElements.forEach(el => el.classList.remove('animate-in'));
            controls.classList.remove('animate-in');
            masterToggle.classList.remove('start-state');
        }, 1500);
    }, 100);
});
