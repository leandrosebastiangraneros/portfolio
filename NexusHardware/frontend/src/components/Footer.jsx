import React from 'react';

const Footer = () => {
    return (
        <footer className="border-t border-white/10 bg-black/80 backdrop-blur-xl mt-20">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 bg-accent-cyan rounded-sm"></div>
                            <h2 className="text-xl font-bold font-display tracking-widest text-white">
                                NEXUS<span className="text-accent-cyan">_HARDWARE</span>
                            </h2>
                        </div>
                        <p className="text-gray-500 text-sm font-mono max-w-xs leading-relaxed">
                            Componentes de hardware premium para la próxima generación de computación.
                            Transacciones seguras. Envíos globales.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-bold font-display tracking-wider mb-4">EXPLORAR</h3>
                        <ul className="space-y-2 text-sm text-gray-500 font-mono">
                            <li className="hover:text-accent-cyan cursor-pointer transition">SERIES_GPU</li>
                            <li className="hover:text-accent-cyan cursor-pointer transition">ARQ_CPU</li>
                            <li className="hover:text-accent-cyan cursor-pointer transition">MODS_MEMORIA</li>
                            <li className="hover:text-accent-cyan cursor-pointer transition">PERIFERICOS</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold font-display tracking-wider mb-4">SISTEMA</h3>
                        <ul className="space-y-2 text-sm text-gray-500 font-mono">
                            <li className="hover:text-accent-purple cursor-pointer transition">LOGIN_ADMIN</li>
                            <li className="hover:text-accent-purple cursor-pointer transition">ESTADO_PAGINA</li>
                            <li className="hover:text-accent-purple cursor-pointer transition">DOCS_API</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-600 font-mono">
                        © 2026 NEXUS HARDWARE. TODOS LOS DERECHOS RESERVADOS.
                    </p>
                    <div className="flex gap-4">
                        {/* Social Icons Mockup */}
                        <div className="w-4 h-4 bg-gray-700 rounded-full hover:bg-white transition cursor-pointer"></div>
                        <div className="w-4 h-4 bg-gray-700 rounded-full hover:bg-white transition cursor-pointer"></div>
                        <div className="w-4 h-4 bg-gray-700 rounded-full hover:bg-white transition cursor-pointer"></div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
