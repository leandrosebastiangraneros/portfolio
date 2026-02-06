import React from 'react';

const GlassContainer = ({ children, className = "", hoverEffect = false, ...props }) => {
    return (
        <div
            className={`
                bg-glass backdrop-blur-md border border-glass-border 
                rounded-xl shadow-lg relative overflow-hidden
                ${hoverEffect ? 'transition-all duration-300 hover:bg-white/5 hover:border-white/10 hover:shadow-accent/5' : ''}
                ${className}
            `}
            {...props}
        >
            {/* Subtle Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};

export default GlassContainer;
