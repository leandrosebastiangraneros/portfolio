import React from 'react';
import { Activity, Package, ReceiptText, Network } from 'lucide-react';

const AdminSidebar = ({ activeView, onViewChange }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Activity },
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    ];

    return (
        <div className="w-64 shrink-0 flex flex-col gap-2 p-4 border-r border-white/5 bg-white/5 backdrop-blur-md h-full">
            <div className="mb-8 px-4">
                <h3 className="font-display font-bold text-white tracking-widest text-lg">NEXUS<span className="text-accent">OS</span></h3>
                <p className="font-mono text-[10px] text-txt-dim uppercase">System v2.4.0</p>
            </div>

            <nav className="flex flex-col gap-2">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300
                            ${activeView === item.id
                                ? 'bg-accent/10 text-accent border border-accent/20 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                                : 'text-txt-secondary hover:text-white hover:bg-white/5 border border-transparent'
                            }
                        `}
                    >
                        <item.icon size={18} />
                        <span className="tracking-wide">{item.label}</span>
                        {activeView === item.id && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_5px_#00f0ff]"></span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="mt-auto px-4 py-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <Network size={14} className="text-green-500 animate-pulse" />
                    <span className="font-mono text-[10px] text-txt-dim uppercase tracking-wider">Network Stable</span>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
