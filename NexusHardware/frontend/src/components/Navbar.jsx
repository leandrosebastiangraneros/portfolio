import React from 'react';

const Navbar = ({ currentView, onViewChange, cartCount, toggleCart }) => {
    const handleBackToProjects = () => {
        window.location.href = '../../../index.html?skipBoot=true#projects';
    };

    return (
        <nav className="sticky top-0 w-full z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-sm">
            <div className="container mx-auto px-6 h-16 flex justify-between items-center">
                {/* Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => onViewChange('store')}
                >
                    <div className="w-8 h-8 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20 flex items-center justify-center text-white font-bold">
                        N
                    </div>
                    <h1 className="text-xl font-bold text-slate-100 tracking-tight">
                        Nexus<span className="text-blue-500">Hardware</span>
                    </h1>
                </div>

                {/* Navegación Desktop */}
                <div className="hidden md:flex items-center gap-1 bg-slate-800/50 p-1 rounded-lg">
                    <button
                        onClick={() => onViewChange('store')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${currentView === 'store'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                            }`}
                    >
                        Tienda
                    </button>
                    <button
                        onClick={() => onViewChange('dashboard')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${currentView === 'dashboard'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                            }`}
                    >
                        Panel
                    </button>
                    <button
                        onClick={() => onViewChange('builder')}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${currentView === 'builder'
                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
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
                        className="relative p-2 hover:bg-slate-800 rounded-full transition-colors group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-slate-900">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={handleBackToProjects}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        <span>Salir</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
