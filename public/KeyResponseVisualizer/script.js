const keyCard = document.getElementById('key-card');
const keyDisplay = document.getElementById('key-display');
const codeDisplay = document.getElementById('code-display');
const whichDisplay = document.getElementById('which-display');
const statusText = document.getElementById('status-text');
const canvas = document.getElementById('stars-canvas');

// --- BACKGROUND ANIMATION (Shared Logic) ---
const ctx = canvas.getContext('2d');
let width, height;
let stars = [];

function resizeStars() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initStars();
}

function initStars() {
    stars = [];
    const starCount = Math.floor((width * height) / 4000);
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5,
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: (Math.random() - 0.5) * 0.2,
            opacity: Math.random() * 0.8 + 0.2
        });
    }
}

function animateStars() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    stars.forEach(star => {
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        star.x += star.speedX;
        star.y += star.speedY;
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;
    });
    requestAnimationFrame(animateStars);
}

window.addEventListener('resize', resizeStars);
resizeStars();
animateStars();

// --- KEY LISTENER LOGIC ---

window.addEventListener('keydown', (e) => {
    // Prevent default browser actions for some keys ONLY if it interrupts the experience
    // e.preventDefault(); 

    if (e.repeat) return; // Ignore hold-down repetitive events 

    // Visual Feedback (Main Card)
    keyCard.classList.remove('active');
    void keyCard.offsetWidth; // Trigger reflow
    keyCard.classList.add('active');

    // Visual Feedback (Keyboard)
    const keyElement = document.querySelector(`.key[data-code="${e.code}"]`);
    if (keyElement) {
        keyElement.classList.add('active');
    }

    // Data Update
    let displayKey = e.key;

    if (displayKey === ' ') displayKey = 'SPACE';
    if (displayKey === 'Control') displayKey = 'CTRL';
    if (displayKey === 'Escape') displayKey = 'ESC';
    if (displayKey === 'ArrowUp') displayKey = '↑';
    if (displayKey === 'ArrowDown') displayKey = '↓';
    if (displayKey === 'ArrowLeft') displayKey = '←';
    if (displayKey === 'ArrowRight') displayKey = '→';

    if (displayKey.length === 1) displayKey = displayKey.toUpperCase();

    keyDisplay.textContent = displayKey;
    codeDisplay.textContent = e.code;
    whichDisplay.textContent = e.which;
    statusText.textContent = "INPUT_DETECTED";

    // Reset card animation
    setTimeout(() => {
        keyCard.classList.remove('active');
        statusText.textContent = "WAITING_INPUT...";
    }, 200);
});

window.addEventListener('keyup', (e) => {
    const keyElement = document.querySelector(`.key[data-code="${e.code}"]`);
    if (keyElement) {
        keyElement.classList.remove('active');
    }
});
