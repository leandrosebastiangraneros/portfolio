import React, { useState, useEffect } from 'react';
import Logo from './Logo';

const Navbar = ({ currentView, onViewChange, cartCount, toggleCart }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleBackToProjects = () => {
        window.location.href = '../../../index.html?skipBoot=true#projects';
    };

    return (
        <div className="fixed top-0 w-full z-[999] flex justify-center pt-6 px-4">
            <nav className={`
                transition-all duration-300 ease-out
                flex items-center justify-between
                px-6 py-3
                rounded-3xl
                bg-slate-900/95 backdrop-blur-xl
                border border-white/10
                shadow-2xl shadow-blue-500/5
                w-full max-w-6xl
                ${scrolled ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-0 opacity-100'}
            `}>
                {/* Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => onViewChange('store')}
                >
                    <Logo className="w-9 h-9 transition-transform group-hover:scale-110 duration-300" />
                </div>

                {/* Navegación Desktop (Centered Absoluto) */}
                <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1 bg-black/20 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                    <button
                        onClick={() => onViewChange('store')}
                        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${currentView === 'store'
                            ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 scale-105'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Tienda
                    </button>
                    <button
                        onClick={() => onViewChange('dashboard')}
                        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${currentView === 'dashboard'
                            ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 scale-105'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Panel
                    </button>
                    <button
                        onClick={() => onViewChange('builder')}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${currentView === 'builder'
                            ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/25 scale-105'
                            : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
                            }`}
                    >
                        Arma tu PC
                    </button>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleCart}
                        className="relative p-2.5 hover:bg-white/10 rounded-full transition-colors group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-slate-900 shadow-md">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={handleBackToProjects}
                        className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-white/5 text-xs font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
                    >
                        <span>SALIR</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
