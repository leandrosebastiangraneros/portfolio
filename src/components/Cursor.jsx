import { useEffect, useRef } from 'react';

export default function Cursor() {
    const dotRef = useRef(null);
    const outlineRef = useRef(null);

    useEffect(() => {
        const dot = dotRef.current;
        const outline = outlineRef.current;
        if (!dot || !outline) return;

        const moveCursor = (e) => {
            const { clientX, clientY } = e;

            dot.style.left = `${clientX}px`;
            dot.style.top = `${clientY}px`;

            // Reveal on first move
            if (dot.style.opacity === '' || dot.style.opacity === '0') {
                dot.style.opacity = '1';
                outline.style.opacity = '1';
            }

            // Slightly delayed follow for outline (visual effect handled by CSS transition usually, 
            // but script.js set it directly. If CSS has transition, direct set works fine).
            outline.style.left = `${clientX}px`;
            outline.style.top = `${clientY}px`;
        };

        const handleHover = (e) => {
            // Check if target is interactive
            // script.js list: 'a, button, .project-card, .skill-module, .vault-item'
            const target = e.target.closest('a, button, .project-card, .skill-module, .vault-item, .social-node, .holo-node');

            if (target) {
                outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                outline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                dot.style.transform = 'translate(-50%, -50%) scale(0.5)';
            } else {
                outline.style.transform = 'translate(-50%, -50%) scale(1)';
                outline.style.backgroundColor = 'transparent';
                dot.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleHover); // Global delegation

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleHover);
        };
    }, []);

    return (
        <>
            <div ref={dotRef} className="cursor-dot"></div>
            <div ref={outlineRef} className="cursor-outline"></div>
        </>
    );
}
