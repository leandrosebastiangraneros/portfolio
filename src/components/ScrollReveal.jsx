import { useEffect, useState, useCallback } from 'react';

export default function ScrollReveal({ children, className = "", threshold = 0.1, once = false }) {
    const [isVisible, setIsVisible] = useState(false);
    const [node, setNode] = useState(null);

    // Callback ref to ensure we capture the node when it mounts
    const ref = useCallback((node) => {
        if (node) setNode(node);
    }, []);

    useEffect(() => {
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Toggle visibility based on intersection
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observer.disconnect();
                } else {
                    if (!once) setIsVisible(false);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: threshold
            }
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, [node, threshold, once]);

    return (
        <div
            ref={ref}
            className={`scroll-reveal ${isVisible ? 'in-view' : ''} ${className}`}
            style={{ minHeight: '50px', width: '100%' }} // Safe defaults to ensure intersection
        >
            {children}
        </div>
    );
}
