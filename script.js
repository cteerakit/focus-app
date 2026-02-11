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
    'bg-1': 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80")', // Mountains
    'bg-2': 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=1920&q=80")', // Forest
    'bg-3': 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1920&q=80")', // Galaxy
    'bg-4': 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=1920&q=80")'  // Foggy Forest
};

function switchBackground(bgKey) {
    const nextLayer = 1 - activeLayer;
    const bgUrl = backgrounds[bgKey];

    // Set next layer background
    bgLayers[nextLayer].style.backgroundImage = bgUrl;

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
bgLayers[0].style.backgroundImage = backgrounds['bg-1'];
