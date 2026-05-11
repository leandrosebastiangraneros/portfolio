import React, { useState } from 'react';
import Logo from './Logo';
import GlassContainer from './common/GlassContainer';

const Navbar = ({ currentView, onViewChange, cartCount, toggleCart }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { id: 'store', label: 'Store' },
        { id: 'builder', label: 'PC Builder' },
        { id: 'dashboard', label: 'Admin Panel' },
    ];

    return (
        <>
            {/* Fixed Full-Width Navbar */}
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full">
                <GlassContainer
                    className="w-full rounded-none py-4 px-8 bg-black/80 border-b border-white/10 shadow-lg backdrop-blur-md"
                >
                    {/* Explicit Flex Container for Layout Correctness */}
                    <div className="relative flex items-center justify-between w-full h-full max-w-7xl mx-auto">

                        {/* 1. Left: Brand & Logo */}
                        <div
                            className="flex items-center gap-4 cursor-pointer group z-20"
                            onClick={() => onViewChange('store')}
                        >
                            <Logo className="w-10 h-10 group-hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.5)] transition-all" />
                            <div className="flex flex-col">
                                <span className="font-display font-bold text-lg tracking-widest text-white leading-none">NEXUS</span>
                                <span className="font-mono text-[10px] text-accent tracking-[0.2em] leading-none opacity-80">HARDWARE</span>
                            </div>
                        </div>

                        {/* 2. Center: Desktop Nav (Absolute Centered) */}
                        <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full pointer-events-none">
                            <div className="flex pointer-events-auto p-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => onViewChange(item.id)}
                                        className={`
                                            relative px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300
                                            ${currentView === item.id
                                                ? 'text-black bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                                                : 'text-txt-secondary hover:text-white hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Right: Actions */}
                        <div className="flex items-center gap-4 z-20">
                            <button
                                onClick={toggleCart}
                                className={`
                                    relative p-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-accent/50 transition-all group
                                    ${cartCount > 0 ? 'text-accent' : 'text-txt-secondary'}
                                `}
                            >
                                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-black text-[10px] font-bold flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Mobile Menu Toggle */}
                            <button
                                className="md:hidden p-3 text-white rounded-full hover:bg-white/10"
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                </GlassContainer>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-60 bg-black/90 backdrop-blur-xl transition-all duration-500 flex flex-col items-center justify-center gap-8 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute top-0 w-full p-6 flex justify-end">
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 rounded-full bg-white/5 text-white hover:bg-white/10 border border-white/10"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex flex-col gap-8 text-center">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { onViewChange(item.id); setMobileMenuOpen(false); }}
                            className={`text-3xl font-display font-bold uppercase tracking-widest transition-colors ${currentView === item.id ? 'text-accent' : 'text-white/50 hover:text-white'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Navbar;
