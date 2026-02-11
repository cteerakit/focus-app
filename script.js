const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const greetingEl = document.getElementById('greeting-text');
const bgLayers = [document.getElementById('bg-layer-1'), document.getElementById('bg-layer-2')];
const bgBtns = document.querySelectorAll('.bg-btn');

let activeLayer = 0;

// Update Clock & Date
function updateDashboard() {
    const now = new Date();
    
    // Time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeEl.textContent = `${hours}:${minutes}`;

    // Date
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    
    dateEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;

    // Greeting
    const hour = now.getHours();
    if (hour < 12) greetingEl.textContent = 'Good Morning';
    else if (hour < 18) greetingEl.textContent = 'Good Afternoon';
    else greetingEl.textContent = 'Good Evening';
}

// Background Management
const backgrounds = {
    'gradient-1': 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    'gradient-2': 'linear-gradient(135deg, #4c1d95 0%, #db2777 100%)',
    'gradient-3': 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
    'gradient-4': 'linear-gradient(135deg, #000000 0%, #434343 100%)'
};

function switchBackground(bgKey) {
    const nextLayer = 1 - activeLayer;
    const bgUrl = backgrounds[bgKey];

    // Set next layer background
    bgLayers[nextLayer].style.background = bgUrl;
    
    // Transition
    bgLayers[nextLayer].style.opacity = '1';
    bgLayers[activeLayer].style.opacity = '0';
    
    activeLayer = nextLayer;
}

// Event Listeners
bgBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button state
        bgBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Switch background
        const bgKey = btn.getAttribute('data-bg');
        switchBackground(bgKey);
    });
});

// Initialize
setInterval(updateDashboard, 1000);
updateDashboard();

// Set initial background for layer 1
bgLayers[0].style.background = backgrounds['gradient-1'];
