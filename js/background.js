/**
 * Handles background transitions and theme colors
 */

export class BackgroundManager {
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
