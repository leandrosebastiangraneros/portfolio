import React from 'react';

const Logo = ({ className = "w-8 h-8", showText = true }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg viewBox="0 0 100 100" className="w-full h-full text-blue-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Hexagon Background */}
                <path
                    d="M50 5 L93.3 30 V80 L50 105 L6.7 80 V30 L50 5Z"
                    stroke="url(#logoGradient)"
                    strokeWidth="4"
                    fill="rgba(59, 130, 246, 0.1)"
                    filter="url(#glow)"
                />

                {/* Tech Nodes */}
                <circle cx="50" cy="5" r="3" fill="#06b6d4" />
                <circle cx="93.3" cy="30" r="3" fill="#3b82f6" />
                <circle cx="93.3" cy="80" r="3" fill="#06b6d4" />
                <circle cx="50" cy="105" r="3" fill="#3b82f6" />
                <circle cx="6.7" cy="80" r="3" fill="#06b6d4" />
                <circle cx="6.7" cy="30" r="3" fill="#3b82f6" />

                {/* Inner N */}
                <path
                    d="M35 35 V75 L65 35 V75"
                    stroke="white"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            {showText && (
                <span className="font-bold text-xl tracking-tight text-white select-none">
                    NEXUS<span className="text-blue-400">HARDWARE</span>
                </span>
            )}
        </div>
    );
};

export default Logo;
