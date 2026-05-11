const pingValue = document.getElementById('ping-value');
const pingText = document.getElementById('ping-text');
const connectionStatus = document.getElementById('connection-status');
const startBtn = document.getElementById('start-btn');
const gradeDisplay = document.getElementById('grade-display');
const canvas = document.getElementById('stars-canvas');
const chartCanvas = document.getElementById('latency-chart'); // New Chart Canvas
const jitterValue = document.getElementById('jitter-value'); // AWS São Paulo Endpoint for Client-Side Ping
// We switch to S3 endpoint as it handles HEAD requests more gracefully (usually 403 or 200 XML)
// reducing the visual "404 Not Found" noise in some browser consoles compared to DynamoDB.
const PING_TARGET = 'https://s3.sa-east-1.amazonaws.com';
let isRunning = false;
let lastLatency = 0;
const historySize = 60;
let latencyHistory = new Array(historySize).fill(0); // Init with zeros

// --- CHART SETUP ---
let chartCtx;
if (chartCanvas) {
    chartCtx = chartCanvas.getContext('2d');
    // Handle DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = chartCanvas.getBoundingClientRect();
    chartCanvas.width = rect.width * dpr;
    chartCanvas.height = rect.height * dpr;
    chartCtx.scale(dpr, dpr);
}

// --- BACKGROUND ANIMATION (Stars) ---
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

window.addEventListener('resize', () => {
    resizeStars();
    // Also resize chart canvas
    if (chartCanvas) {
        const dpr = window.devicePixelRatio || 1;
        const rect = chartCanvas.getBoundingClientRect();
        chartCanvas.width = rect.width * dpr;
        chartCanvas.height = rect.height * dpr;
        chartCtx.scale(dpr, dpr);
    }
});
resizeStars();
animateStars();


// --- MONITOR LOGIC ---

startBtn.addEventListener('click', () => {
    if (isRunning) return;

    startBtn.disabled = true;
    startBtn.textContent = "INICIALIZANDO DIAGNÓSTICO...";

    connectionStatus.textContent = "ESTABLECIENDO ENLACE...";
    connectionStatus.classList.remove('connected');

    setTimeout(() => {
        connectionStatus.textContent = "CONECTADO (DIRECTO - SA-EAST-1)";
        connectionStatus.classList.add('connected');
        startBtn.textContent = "MONITOREANDO...";
        pingText.textContent = "CALCULANDO...";
        isRunning = true;

        // Start Loop
        measureClientPing();
    }, 1500);
});

async function measureClientPing() {
    if (!isRunning) return;

    const start = performance.now();

    try {
        await fetch(PING_TARGET, {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-store',
            credentials: 'omit'
        });

        const end = performance.now();
        let latency = Math.round(end - start);

        // Jitter Calc
        let jitter = 0;
        if (lastLatency !== 0) {
            jitter = Math.abs(latency - lastLatency);
        }
        lastLatency = latency;

        updateUI({
            ping: latency,
            status: getStatus(latency),
            jitter: jitter
        });

    } catch (e) {
        console.error("Ping Error:", e);
        updateUI({ status: 'offline' });
    }

    if (isRunning) {
        setTimeout(measureClientPing, 1000);
    }
}

function getStatus(ping) {
    if (ping < 30) return "competitive";
    if (ping < 60) return "good";
    if (ping < 100) return "moderate";
    return "lag";
}

function calculateGrade(ping) {
    if (ping <= 10) return "S";
    if (ping <= 20) return "A+";
    if (ping <= 30) return "A";
    if (ping <= 40) return "B+";
    if (ping <= 50) return "B";
    if (ping <= 70) return "C";
    if (ping <= 100) return "D";
    return "F";
}

function updateUI(data) {
    if (!pingValue || !pingText) return;

    if (data.status === 'offline') {
        pingValue.textContent = "ERR";
        pingText.textContent = "CONNECTION LOST";
        pingValue.className = 'ping-value status-lag';
        pingText.className = 'ping-status-text status-lag';
        if (gradeDisplay) gradeDisplay.textContent = "OFF";
        return;
    }

    const ping = data.ping;
    pingValue.textContent = ping;

    // Visual feedback
    let statusClass = 'status-lag';
    let statusLabel = "CRITICAL LATENCY";
    let chartColor = '#ff003c'; // Red

    if (ping <= 30) {
        statusLabel = "OPTIMAL // COMPETITIVE";
        statusClass = 'status-good';
        chartColor = '#00ff9d'; // Green
    } else if (ping <= 60) {
        statusLabel = "STABLE // STANDARD";
        statusClass = 'status-good';
        chartColor = '#00f0ff'; // Cyan
    } else if (ping <= 100) {
        statusLabel = "MODERATE // PLAYABLE";
        statusClass = 'status-warning';
        chartColor = '#ffaa00'; // Orange
    }

    pingText.textContent = statusLabel;

    pingValue.className = `ping-value ${statusClass}`;
    pingText.className = `ping-status-text ${statusClass}`;

    if (gradeDisplay) {
        gradeDisplay.textContent = calculateGrade(ping);
        gradeDisplay.className = `grade-display ${statusClass}`;
    }

    // Update Jitter Display
    if (jitterValue) {
        jitterValue.textContent = `${Math.round(data.jitter)} ms`;
        // Colorize jitter
        if (data.jitter < 5) jitterValue.style.color = '#00ff9d';
        else if (data.jitter < 15) jitterValue.style.color = '#ffaa00';
        else jitterValue.style.color = '#ff003c';
    }

    // Update Chart
    updateChart(ping, chartColor);
}

function updateChart(newPing, color) {
    if (!chartCtx) return;

    // Shift history
    latencyHistory.shift();
    latencyHistory.push(newPing);

    const w = chartCanvas.clientWidth;
    const h = chartCanvas.clientHeight;

    // Clear
    chartCtx.clearRect(0, 0, w, h);

    // Grid lines (Horizontal)
    chartCtx.strokeStyle = 'rgba(255,255,255,0.05)';
    chartCtx.lineWidth = 1;
    chartCtx.beginPath();
    [0.25, 0.5, 0.75].forEach(ratio => {
        chartCtx.moveTo(0, h * ratio);
        chartCtx.lineTo(w, h * ratio);
    });
    chartCtx.stroke();

    // Draw Line
    chartCtx.strokeStyle = color;
    chartCtx.lineWidth = 2;
    chartCtx.lineCap = 'round';
    chartCtx.lineJoin = 'round';
    chartCtx.shadowBlur = 10;
    chartCtx.shadowColor = color;

    chartCtx.beginPath();

    const maxPing = Math.max(100, ...latencyHistory); // Scale based on max, minimum 100ms scale
    const step = w / (historySize - 1);

    latencyHistory.forEach((val, i) => {
        const x = i * step;
        // Invert Y measurement (0 is top)
        // Normalize val between 0 and maxPing
        const normalized = val / maxPing;
        const y = h - (normalized * h * 0.8) - 10; // Keep some padding

        if (i === 0) chartCtx.moveTo(x, y);
        else chartCtx.lineTo(x, y);
    });

    chartCtx.stroke();
    chartCtx.shadowBlur = 0; // Reset shadow
}
