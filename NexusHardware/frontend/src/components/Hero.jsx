import React from 'react';

const Hero = () => {
    return (
        <div className="relative py-20 lg:py-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto pt-10">
                <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-slate-800/40 border border-white/10 backdrop-blur-md text-blue-300 text-sm font-semibold shadow-lg shadow-blue-900/20">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Rendimiento de Próxima Generación
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-slate-50 mb-8 tracking-tight leading-none">
                    Hardware Premium para <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 drop-shadow-lg filter">
                        Computación de Élite
                    </span>
                </h1>

                <p className="max-w-2xl mx-auto text-slate-300 text-lg mb-12 leading-relaxed opacity-90">
                    Descubre componentes verificados para workstations de alto nivel y setups gaming.
                    Gestión de inventario optimizada con analítica inteligente.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-5">
                    <button
                        onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                        className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1"
                    >
                        Ver Tienda
                    </button>
                    <button className="px-10 py-4 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur text-white font-semibold rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1">
                        Ver Specs
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
