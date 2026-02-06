import React from 'react';

const Logo = ({ className = "w-8 h-8" }) => {
    return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Hexagon Ring */}
            <path
                d="M50 5 L95 27.5 V72.5 L50 95 L5 72.5 V27.5 Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            />

            {/* Inner Core Fragment */}
            <path
                d="M50 25 L75 37.5 V62.5 L50 75 L25 62.5 V37.5 Z"
                fill="currentColor"
                className="text-accent drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]"
            />

            {/* Tech Nodes */}
            <circle cx="50" cy="5" r="3" fill="#00f0ff" className="animate-pulse" />
            <circle cx="95" cy="72.5" r="3" fill="#a020f0" />
            <circle cx="5" cy="72.5" r="3" fill="#a020f0" />
        </svg>
    );
};

export default Logo;
