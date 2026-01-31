const pingValue = document.getElementById('ping-value');
const pingText = document.getElementById('ping-text');
const connectionStatus = document.getElementById('connection-status');
const bars = document.querySelectorAll('.bar');
const startBtn = document.getElementById('start-btn');
const gradeDisplay = document.getElementById('grade-display');
const canvas = document.getElementById('stars-canvas');

let socket;
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
// REPLACE 'YOUR-RENDER-APP-NAME' WITH YOUR ACTUAL RENDER URL AFTER DEPLOYMENT
const WS_URL = isLocal ? 'ws://localhost:8765' : 'wss://fortnite-monitor-server.onrender.com';

// --- BACKGROUND ANIMATION ---
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


// --- MONITOR LOGIC ---

startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    startBtn.textContent = "CONECTANDO...";
    connect();
});

// AWS São Paulo Endpoint for Client-Side Ping
const PING_TARGET = 'https://dynamodb.sa-east-1.amazonaws.com';

function connect() {
    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
        connectionStatus.textContent = "CONNECTED (SERVER)";
        connectionStatus.classList.add('connected');
        startBtn.textContent = "EN EJECUCIÓN";
        pingText.textContent = "CALCULANDO...";

        // Start Client-Side Ping Loop
        measureClientPing();
    };

    socket.onmessage = (event) => {
        // We keep the WebSocket for server status, but we calculate Ping locally
        // We can ignore the server's ping data or use it for something else later
        // const data = JSON.parse(event.data);
    };

    socket.onclose = () => {
        connectionStatus.textContent = "DISCONNECTED";
        connectionStatus.classList.remove('connected');
        pingText.textContent = "SERVER OFFLINE";
        pingValue.textContent = "--";
        startBtn.disabled = false;
        startBtn.textContent = "REINTENTAR";
    };

    socket.onerror = (error => {
        console.error("WebSocket Error:", error);
        connectionStatus.textContent = "ERROR";
        connectionStatus.classList.remove('connected');
        startBtn.disabled = false;
        startBtn.textContent = "REINTENTAR";
    });
}

async function measureClientPing() {
    if (socket.readyState !== WebSocket.OPEN) return;

    const start = performance.now();
    try {
        await fetch(PING_TARGET, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
        const end = performance.now();
        const latency = Math.round((end - start) * 0.6);

        updateUI({ ping: latency, status: getStatus(latency) });
    } catch (e) {
        console.error("Ping Error:", e);
        // Fallback or retry
    }

    // Ping every 1 second
    setTimeout(measureClientPing, 1000);
}

function getStatus(ping) {
    if (ping < 50) return "competitive";
    if (ping < 100) return "good";
    return "lag";
}

function calculateGrade(ping) {
    if (ping <= 10) return "A+";
    if (ping <= 20) return "A";
    if (ping <= 30) return "A-";
    if (ping <= 40) return "B+";
    if (ping <= 60) return "B";
    if (ping <= 80) return "B-";
    if (ping <= 100) return "C+";
    if (ping <= 120) return "C";
    if (ping <= 150) return "C-";
    return "F";
}

function updateUI(data) {
    if (data.status === 'offline') {
        pingValue.textContent = "XXX";
        pingText.textContent = "TIMEOUT";
        pingValue.className = 'ping-value status-lag';
        pingText.className = 'ping-status-text status-lag';
        gradeDisplay.textContent = "F";
        gradeDisplay.className = "grade-display status-lag";
        return;
    }

    const ping = data.ping;
    pingValue.textContent = ping;

    const grade = calculateGrade(ping);
    gradeDisplay.textContent = grade;

    // Reset classes
    pingValue.className = 'ping-value';
    pingText.className = 'ping-status-text';
    gradeDisplay.className = 'grade-display';

    // Status Logic & Visualizer
    if (ping <= 50) { // Competitive
        pingText.textContent = "COMPETITIVE";
        pingValue.classList.add('status-good');
        pingText.classList.add('status-good');
        gradeDisplay.classList.add('status-good');
        updateVisualizer(3);
    } else if (ping <= 100) { // Playable
        pingText.textContent = "PLAYABLE";
        pingValue.classList.add('status-warning');
        pingText.classList.add('status-warning');
        gradeDisplay.classList.add('status-warning');
        updateVisualizer(2);
    } else { // Lag
        pingText.textContent = "LAG DETECTED";
        pingValue.classList.add('status-lag');
        pingText.classList.add('status-lag');
        gradeDisplay.classList.add('status-lag');
        updateVisualizer(1);
    }
}

function updateVisualizer(level) {
    bars.forEach(bar => {
        let height = 10;
        if (level === 3) height = Math.random() * 20 + 20; // 20-40px
        if (level === 2) height = Math.random() * 15 + 10; // 10-25px
        if (level === 1) height = Math.random() * 5 + 5;   // 5-10px

        bar.style.height = `${height}px`;

        if (level === 3) bar.style.backgroundColor = '#00ff00';
        if (level === 2) bar.style.backgroundColor = '#ffaa00';
        if (level === 1) bar.style.backgroundColor = '#ff0000';
    });
}
