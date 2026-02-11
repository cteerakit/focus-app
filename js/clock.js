/**
 * Handles time, date, and greeting updates
 */

export class Clock {
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
