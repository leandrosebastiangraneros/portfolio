import React from 'react';

const Navbar = ({ currentView, onViewChange, cartCount, toggleCart }) => {
    const handleBackToProjects = () => {
        // Always force navigation to Portfolio with skipBoot param to ensure animation skip
        window.location.href = 'https://leandrosebastiangraneros.github.io/portfolio/index.html?skipBoot=true#projects';
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                {/* Logo */}
                <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => onViewChange('store')}
                >
                    <div className="w-8 h-8 bg-accent-purple rounded-sm transform group-hover:rotate-45 transition duration-500 shadow-[0_0_15px_rgba(157,78,221,0.5)]"></div>
                    <h1 className="text-2xl font-bold font-display tracking-widest text-white group-hover:text-accent-cyan transition duration-300">
                        NEXUS<span className="text-accent-purple">_HARDWARE</span>
                    </h1>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <button
                        onClick={() => onViewChange('store')}
                        className={`text-sm font-mono tracking-wider transition ${currentView === 'store' ? 'text-accent-cyan shadow-cyan-glow' : 'text-gray-400 hover:text-white'}`}
                    >
                        // STORE
                    </button>
                    <button
                        onClick={() => onViewChange('dashboard')}
                        className={`text-sm font-mono tracking-wider transition ${currentView === 'dashboard' ? 'text-accent-purple shadow-purple-glow' : 'text-gray-400 hover:text-white'}`}
                    >
                        // DASHBOARD
                    </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleCart}
                        className="relative group p-2 hover:bg-white/5 rounded-full transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300 group-hover:text-accent-cyan transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 w-4 h-4 bg-accent-purple text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse shadow-[0_0_10px_rgba(157,78,221,0.8)]">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={handleBackToProjects}
                        className="flex items-center gap-2 border border-white/20 px-4 py-2 rounded text-xs font-mono text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/50 transition duration-300"
                    >
                        <span className="hidden sm:inline">EXIT_TERMINAL</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
