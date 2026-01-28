import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminPanel = () => {
    const [stats, setStats] = useState(null);
    const [optimizationData, setOptimizationData] = useState([]); // New State
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = fetch(`${import.meta.env.VITE_API_URL}/dashboard-stats`).then(res => res.json());
        const fetchOptimization = fetch(`${import.meta.env.VITE_API_URL}/optimization`).then(res => res.json());

        Promise.all([fetchStats, fetchOptimization])
            .then(([statsData, optData]) => {
                setStats(statsData);
                setOptimizationData(optData); // Set Optimization Data
                setLoading(false);
            })
            .catch(err => {
                console.warn("Backend Offline. Loading Demo Mode...", err);

                // --- DEMO FALLBACK FOR GITHUB PAGES ---
                const demoStats = {
                    total_revenue: 15420.50,
                    sales_count: 42,
                    recent_sales: [
                        { id: 105, sale_price: 1599.99, product_name: "RTX 4090" },
                        { id: 104, sale_price: 59.99, product_name: "Gaming Mouse" },
                        { id: 103, sale_price: 449.00, product_name: "Ryzen 7 7800X3D" },
                    ]
                };

                const demoOptimization = [
                    {
                        "id": 1,
                        "name": "RTX 4090 (DEMO)",
                        "stock": 2,
                        "sales_avg": 120,
                        "lead_time": 14,
                        "restock_suggestion": 15,
                        "status": "CRITICAL"
                    },
                    {
                        "id": 2,
                        "name": "Ryzen 7 7800X3D (DEMO)",
                        "stock": 25,
                        "sales_avg": 30,
                        "lead_time": 7,
                        "restock_suggestion": 0,
                        "status": "OK"
                    },
                    {
                        "id": 3,
                        "name": "Mechanical Keyboard (DEMO)",
                        "stock": 50,
                        "sales_avg": 30,
                        "lead_time": 7,
                        "restock_suggestion": 0,
                        "status": "OK"
                    },
                    {
                        "id": 4,
                        "name": "Gaming Mouse (DEMO)",
                        "stock": 5,
                        "sales_avg": 120,
                        "lead_time": 14,
                        "restock_suggestion": 60,
                        "status": "CRITICAL"
                    }
                ];

                setStats(demoStats);
                setOptimizationData(demoOptimization);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center text-purple-400 mt-20 text-2xl animate-pulse">Cargando Analytics...</div>;

    if (!stats) return <div className="text-center text-red-500 mt-20">Error cargando datos.</div>;

    // Prepare data for chart (simplistic mapping for now)
    const chartData = stats.recent_sales.map((sale, index) => ({
        name: `Venta #${sale.id}`,
        monto: sale.sale_price,
        producto: sale.product_name
    })).reverse(); // Oldest to newest for chart

    return (
        <div className="container mx-auto p-8 text-white">
            <h2 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                ADMIN DASHBOARD
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gray-900 border border-cyan-500/30 p-8 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.1)] text-center">
                    <h3 className="text-gray-400 text-lg mb-2 uppercase tracking-widest">Ingresos Totales</h3>
                    <p className="text-5xl font-mono font-bold text-cyan-400">
                        ${stats.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                </div>

                <div className="bg-gray-900 border border-purple-500/30 p-8 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.1)] text-center">
                    <h3 className="text-gray-400 text-lg mb-2 uppercase tracking-widest">Ventas Totales</h3>
                    <p className="text-5xl font-mono font-bold text-purple-400">
                        {stats.sales_count}
                    </p>
                </div>
            </div>

            {/* STOCK OPTIMIZATION ENGINE (C INTEGRATION) */}
            <div className="bg-black/40 border border-green-500/30 p-6 rounded-xl mb-12 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-green-300 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        STOCK_OPTIMIZATION_ENGINE (C-LOGIC)
                    </h3>
                    <span className="text-xs font-mono text-gray-500">status: ONLINE</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800 text-gray-400 text-sm uppercase">
                                <th className="p-4">Producto</th>
                                <th className="p-4">Stock Actual</th>
                                <th className="p-4">Venta Prom. (Mes)</th>
                                <th className="p-4 text-right">Sugerencia Compra</th>
                                <th className="p-4 text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="font-mono text-sm">
                            {optimizationData.map(item => (
                                <tr key={item.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-cyan-300">{item.name}</td>
                                    <td className="p-4 text-gray-300">{item.stock}</td>
                                    <td className="p-4 text-gray-500">{item.sales_avg} / mes</td>
                                    <td className={`p-4 text-right font-bold ${item.restock_suggestion > 0 ? 'text-yellow-400' : 'text-gray-600'}`}>
                                        {item.restock_suggestion > 0 ? `+${item.restock_suggestion} UNIDADES` : '-'}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${item.status === 'CRITICAL' ? 'bg-red-900/50 text-red-400 border border-red-500/30' : 'bg-green-900/50 text-green-400 border border-green-500/30'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-xl h-96">
                <h3 className="text-xl font-bold mb-4 text-gray-300">Ventas Recientes</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} />
                        <YAxis stroke="#666" fontSize={12} tickFormatter={(val) => `$${val}`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                            itemStyle={{ color: '#00ff9d' }}
                            labelStyle={{ color: '#ccc', marginBottom: '5px' }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="monto" fill="#8884d8" radius={[4, 4, 0, 0]}>
                            {
                                chartData.map((entry, index) => (
                                    <cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8b5cf6' : '#06b6d4'} />
                                ))
                            }
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminPanel;
