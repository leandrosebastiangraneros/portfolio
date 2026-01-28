import React from 'react';

const Hero = () => {
    return (
        <div className="relative py-20 lg:py-32 flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                    Next Generation Performance
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-slate-50 mb-6 tracking-tight leading-tight">
                    Premium Hardware for <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Elite Computing</span>
                </h1>

                <p className="max-w-2xl mx-auto text-slate-400 text-lg mb-10 leading-relaxed">
                    Discover verified components for high-end workstations and gaming rigs.
                    Optimized inventory management with smart analytics.
                </p>

                <div className="flex justify-center gap-4">
                    <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-500/25">
                        Browse Store
                    </button>
                    <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg border border-slate-700 transition-all">
                        View Specs
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
