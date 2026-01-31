import { useEffect, useRef } from 'react';

export default function StarsBackground() {
    const canvasRef = useRef(null);
    const isVisible = useRef(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const isMobile = window.innerWidth < 768;
        const ctx = canvas.getContext('2d');
        let width, height;
        let stars = [];
        let animationFrameId;

        // Intersection Observer to stop animation when not visible
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible.current = entry.isIntersecting;
            },
            { threshold: 0.1 }
        );
        observer.observe(canvas);

        const initStars = () => {
            stars = [];
            // Reduce star density on mobile
            const density = isMobile ? 8000 : 4000;
            const starCount = Math.floor((width * height) / density);

            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * (isMobile ? 1.0 : 1.5),
                    speedX: (Math.random() - 0.5) * 0.15,
                    speedY: (Math.random() - 0.5) * 0.15,
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
            if (isVisible.current) {
                ctx.clearRect(0, 0, width, height);
                ctx.fillStyle = '#ffffff';

                stars.forEach(star => {
                    ctx.globalAlpha = star.opacity;
                    ctx.beginPath();
                    // Optimization: use squares for ultra-low-end or small stars
                    if (isMobile && star.size < 0.8) {
                        ctx.fillRect(star.x, star.y, star.size, star.size);
                    } else {
                        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    star.x += star.speedX;
                    star.y += star.speedY;

                    if (star.x < 0) star.x = width;
                    if (star.x > width) star.x = 0;
                    if (star.y < 0) star.y = height;
                    if (star.y > height) star.y = 0;
                });
            }

            animationFrameId = requestAnimationFrame(animateStars);
        };

        window.addEventListener('resize', resizeStars);
        resizeStars();
        animateStars();

        return () => {
            window.removeEventListener('resize', resizeStars);
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
        };
    }, []);

    return <canvas id="stars-canvas" ref={canvasRef}></canvas>;
}
