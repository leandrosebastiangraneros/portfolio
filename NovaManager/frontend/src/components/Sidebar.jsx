import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, isOpen }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { id: 'operaciones', label: 'Operaciones', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16v-1a4 4 0 00-4-4H5m14 0h-2m2 0a2 2 0 012 2v2a2 2 0 01-2 2m-2-4h.01M5 11v8' }, // Truck Icon
        { id: 'calendario', label: 'Calendario', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }, // Calendar Icon
        { id: 'movimientos', label: 'Movimientos', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' }, // List icon
        { id: 'stock', label: 'Inventario', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' }, // Box icon
        { id: 'personal', label: 'Personal', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { id: 'reportes', label: 'Reportes', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { id: 'configuracion', label: 'Configuración', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 3.924 0 4.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-3.924 1.756-4.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-3.924 0-4.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z' },
    ];

    return (
        <div className={`fixed inset-y-0 left-0 bg-slate-950 text-white min-h-screen p-6 w-64 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 border-r border-slate-800 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="text-2xl font-bold mb-10 text-center tracking-wider">
                <span className="text-blue-400">NOVA</span>MANAGER
            </div>
            <nav>
                <ul className="space-y-4">
                    {menuItems.map(item => (
                        <li key={item.id}>
                            <button
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200
                  ${activeTab === item.id
                                        ? 'bg-blue-600 shadow-lg shadow-blue-500/30'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                </svg>
                                <span className="font-medium">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="absolute bottom-10 left-0 w-full px-6">
                <div className="bg-slate-800 rounded-xl p-4 text-center text-xs text-slate-500">
                    v1.0.0
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
