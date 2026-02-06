
import Button from './common/Button';

const Hero = () => {
    const scrollToStore = () => {
        const storeSection = document.getElementById('store-section');
        if (storeSection) {
            storeSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 800, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
            {/* Fondo Técnico Minimalista que diseñé */}
            <div className="absolute inset-0 bg-void">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0a0a0a_0%,#000000_100%)] opacity-80"></div>

                {/* Línea de cuadrícula abstracta */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
                <div className="absolute left-1/2 top-0 w-px h-full bg-linear-to-b from-transparent via-white/5 to-transparent"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
                {/* Encabezado o "Eyebrow" */}
                <div className="mb-6 opacity-0 animate-float" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent border border-accent/20 px-3 py-1 rounded-full bg-accent/5 backdrop-blur-sm">
                        System Status: Optimal
                    </span>
                </div>

                {/* Título Principal */}
                <h1 className="font-display font-black text-6xl md:text-8xl lg:text-9xl tracking-tighter text-white mb-6 leading-none opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
                    NEXUS
                    <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-white/10">HARDWARE</span>
                </h1>

                {/* Subtexto descriptivo */}
                <p className="font-sans text-txt-secondary text-sm md:text-base max-w-lg mb-10 leading-relaxed opacity-0 animate-[fadeIn_1s_ease-out_0.4s_forwards]">
                    Precision components for high-performance architecture.
                    <br className="hidden md:block" />
                    Engineered for silence, speed, and absolute reliability.
                </p>

                {/* Botones de Acción */}
                <div className="flex gap-4 opacity-0 animate-[fadeIn_1s_ease-out_0.6s_forwards]">
                    <Button variant="primary" onClick={scrollToStore} size="lg">
                        Access Vault
                    </Button>
                    <Button variant="secondary" size="lg" onClick={() => console.log('Specs')}>
                        View Specs
                    </Button>
                </div>
            </div>

            {/* Indicador de Scroll */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
                <span className="text-[10px] font-mono tracking-widest text-txt-dim uppercase">Scroll</span>
                <div className="w-px h-8 bg-linear-to-b from-white to-transparent"></div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Hero;
