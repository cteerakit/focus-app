/**
 * Handles the quick note functionality
 */
import { makeDraggable } from './utils.js';

export class NoteManager {
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
