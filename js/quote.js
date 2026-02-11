/**
 * Handles daily quotes
 */

export class QuoteManager {
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
