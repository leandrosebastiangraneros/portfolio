import { useEffect, useRef } from 'react';

export default function StarsBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let stars = [];
        let animationFrameId;

        const initStars = () => {
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
        };

        const resizeStars = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initStars();
        };

        const animateStars = () => {
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

            animationFrameId = requestAnimationFrame(animateStars);
        };

        window.addEventListener('resize', resizeStars);
        resizeStars(); // Initial setup
        animateStars();

        return () => {
            window.removeEventListener('resize', resizeStars);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas id="stars-canvas" ref={canvasRef}></canvas>;
}
