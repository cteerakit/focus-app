/**
 * Main entry point for the Focus Dashboard
 */
import { Clock } from './clock.js';
import { BackgroundManager } from './background.js';
import { QuoteManager } from './quote.js';
import { NoteManager } from './note.js';
import { TimerManager } from './timer.js';

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
