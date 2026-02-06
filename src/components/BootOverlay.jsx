import { useState, useEffect } from 'react';
import '../styles/Overlays.css';

export default function BootOverlay({ onBootComplete }) {
    const [progress, setProgress] = useState(0);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        // Check for skip param
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('skipBoot') === 'true') {
            setProgress(100);
            setIsActive(false);
            onBootComplete();
            return;
        }

        const interval = setInterval(() => {
            setProgress(prev => {
                const increment = Math.random() * 5 + 1;
                const next = prev + increment;

                if (next >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsActive(false);
                        onBootComplete();
                    }, 200);
                    return 100;
                }
                return next;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [onBootComplete]);

    // We rely on CSS for the fade-out effect via body.boot-complete selector normally,
    // but in React we might want to unmount it or just hide it.
    // The existing CSS targets #boot-overlay.
    // We will keep it mounted for the duration of the fade out (transition is 0.5s).

    const [shouldRender, setShouldRender] = useState(true);
    useEffect(() => {
        if (!isActive) {
            const timeout = setTimeout(() => setShouldRender(false), 1000); // Wait for CSS transition
            return () => clearTimeout(timeout);
        }
    }, [isActive]);

    if (!shouldRender) return null;

    return (
        <div id="boot-overlay" style={{ opacity: isActive ? 1 : 0, pointerEvents: isActive ? 'auto' : 'none' }}>
            <div className="loader-container">
                <div className="loader-text">CARGANDO_SISTEMA<span className="blinking-cursor">_</span></div>
                <div className="loader-bar-bg">
                    <div className="loader-bar-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="loader-percent">{Math.floor(progress)}%</div>
            </div>
        </div>
    );
}
