import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/dashboard-stats`)
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching stats:", err);
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

export default Dashboard;
