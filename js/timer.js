/**
 * Handles the focus timer logic
 */
import { makeDraggable } from './utils.js';

export class TimerManager {
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
