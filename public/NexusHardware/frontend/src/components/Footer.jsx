import React from 'react';

const Footer = () => {
    return (
        <footer className="border-t border-white/5 bg-void pt-16 pb-8">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="font-display font-bold text-xl text-white tracking-widest">NEXUS_</h3>
                        <p className="text-txt-dim text-sm leading-relaxed max-w-xs">
                            Equipping the next generation of digital architects with precision hardware.
                        </p>
                    </div>

                    {/* Links 1 */}
                    <div className="space-y-4">
                        <h4 className="font-mono text-xs text-white uppercase tracking-widest opacity-50">Catalog</h4>
                        <ul className="space-y-2 text-sm text-txt-secondary">
                            <li className="hover:text-accent cursor-pointer transition-colors">Processors</li>
                            <li className="hover:text-accent cursor-pointer transition-colors">Graphics</li>
                            <li className="hover:text-accent cursor-pointer transition-colors">Workstations</li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div className="space-y-4">
                        <h4 className="font-mono text-xs text-white uppercase tracking-widest opacity-50">Support</h4>
                        <ul className="space-y-2 text-sm text-txt-secondary">
                            <li className="hover:text-accent cursor-pointer transition-colors">System Diagnostics</li>
                            <li className="hover:text-accent cursor-pointer transition-colors">Drivers</li>
                            <li className="hover:text-accent cursor-pointer transition-colors">Warranty</li>
                        </ul>
                    </div>

                    {/* Newsletter (Fake) */}
                    <div className="space-y-4">
                        <h4 className="font-mono text-xs text-white uppercase tracking-widest opacity-50">Stay Connected</h4>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="ENTER_EMAIL"
                                className="bg-surface border border-white/10 text-white text-xs p-3 w-full focus:outline-none focus:border-accent transition-colors font-mono"
                            />
                            <button className="bg-white/5 border-t border-r border-b border-white/10 text-white px-4 hover:bg-white/10 transition-colors">
                                →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-8 gap-4">
                    <div className="text-[10px] text-txt-dim font-mono">
                        © 2024 NEXUS HARDWARE SYSTEMS. ALL RIGHTS RESERVED.
                    </div>
                    <div className="flex gap-6 text-[10px] text-txt-dim font-mono uppercase">
                        <span className="cursor-pointer hover:text-white transition-colors">Privacy Protocol</span>
                        <span className="cursor-pointer hover:text-white transition-colors">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
