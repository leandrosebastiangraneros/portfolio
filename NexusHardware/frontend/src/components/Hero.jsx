import React, { useEffect, useState } from 'react';

const Hero = () => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Background elements moving with scroll for parallax */}
            <div
                className="absolute inset-0 z-0 flex items-center justify-center opacity-30 select-none pointer-events-none"
                style={{ transform: `translateY(${offset * 0.5}px)` }}
            >
                <div className="w-[60vw] h-[60vw] rounded-full bg-accent-purple/20 blur-[100px] animate-pulse"></div>
            </div>

            <div className="relative z-10 text-center px-4">
                <div className="inline-block mb-4 px-3 py-1 border border-accent-cyan/30 rounded-full bg-accent-cyan/10 backdrop-blur-sm text-accent-cyan text-xs font-mono tracking-[0.2em] animate-fade-in-up">
                    SYSTEM_ONLINE // V.2.0.4
                </div>

                <h1 className="text-4xl md:text-8xl font-black font-display text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500 mb-6 tracking-tighter drop-shadow-2xl animate-fade-in-up delay-100">
                    NEXT GEN <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-cyan">HARDWARE</span>
                </h1>

                <p className="max-w-xl mx-auto text-gray-400 font-mono text-sm md:text-base leading-relaxed mb-10 animate-fade-in-up delay-200">
                    Upgrade your reality. High-performance components for elite systems.
                    Validated for maximum overclocking potential.
                </p>

                <div className="flex justify-center gap-6 animate-fade-in-up delay-300">
                    <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="px-8 py-3 bg-white text-black font-bold tracking-wider hover:bg-accent-cyan hover:scale-105 transition duration-300 rounded-sm">
                        EXPLORE_INVENTORY
                    </button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </div>
    );
};

export default Hero;
