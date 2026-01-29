import React, { useEffect, useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import MovimientoForm from './MovimientoForm';
import { API_URL } from '../config';

const Dashboard = () => {
    const [stats, setStats] = useState({ income: 0, expenses: 0, balance: 0, month: '...', chart_data: [] });
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('INCOME'); // INCOME or EXPENSE

    // Custom responsive logic to bypass Recharts warning
    const [chartWidth, setChartWidth] = useState(0);
    const chartContainerRef = useRef(null);

    const fetchStats = () => {
        fetch(`${API_URL}/dashboard-stats`)
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching stats:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Observer to track container width
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentRect.width > 0) {
                    setChartWidth(entry.contentRect.width);
                }
            }
        });

        resizeObserver.observe(chartContainerRef.current);

        return () => resizeObserver.disconnect();
    }, [loading]); // Re-attach if loading state changes layout

    const handleOpenModal = (type) => {
        setModalType(type);
        setModalOpen(true);
    };

    const handleSave = () => {
        fetchStats(); // Refresh stats after save
    };

    const formatMoney = (val) => val.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-slate-400">
            <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando tablero...
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header & Balance */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-white">
                <div>
                    <h1 className="text-3xl font-bold">Panel Principal</h1>
                    <p className="text-slate-400">Resumen de {stats.month}</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-slate-400 uppercase font-semibold">Saldo Actual</div>
                    <div className={`text-4xl font-extrabold ${stats.balance >= 0 ? 'text-white' : 'text-red-500'}`}>
                        {formatMoney(stats.balance)}
                    </div>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500 flex justify-between items-center relative overflow-hidden group">
                    <div>
                        <div className="text-sm font-medium text-slate-400 uppercase tracking-wide">Ingresos del Mes</div>
                        <div className="text-2xl font-bold text-green-500 mt-1">{formatMoney(stats.income)}</div>
                    </div>
                    <div className="bg-green-500/10 p-3 rounded-full text-green-500 group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-xl shadow-lg p-6 border-l-4 border-red-500 flex justify-between items-center relative overflow-hidden group">
                    <div>
                        <div className="text-sm font-medium text-slate-400 uppercase tracking-wide">Gastos del Mes</div>
                        <div className="text-2xl font-bold text-red-500 mt-1">{formatMoney(stats.expenses)}</div>
                    </div>
                    <div className="bg-red-500/10 p-3 rounded-full text-red-500 group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                    </div>
                </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl shadow-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700">
                <div>
                    <h3 className="text-lg font-bold">Gestión Rápida</h3>
                    <p className="text-slate-400 text-sm">Registra movimientos al instante para mantener tus cuentas al día.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button
                        onClick={() => handleOpenModal('INCOME')}
                        className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        Ingreso
                    </button>
                    <button
                        onClick={() => handleOpenModal('EXPENSE')}
                        className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        Gasto
                    </button>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-700 pb-2">Evolución Diaria</h3>
                <div ref={chartContainerRef} className="w-full h-80">
                    {chartWidth > 0 && (
                        <AreaChart
                            width={chartWidth}
                            height={320}
                            data={stats.chart_data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} tickFormatter={(value) => `$${value}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#f1f5f9' }}
                                itemStyle={{ color: '#f1f5f9' }}
                                formatter={(value) => formatMoney(value)}
                            />
                            <Area
                                type="monotone"
                                dataKey="income"
                                stroke="#22c55e"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorIncome)"
                                name="Ingresos"
                            />
                            <Area
                                type="monotone"
                                dataKey="expense"
                                stroke="#ef4444"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorExpense)"
                                name="Gastos"
                            />
                        </AreaChart>
                    )}
                </div>
            </div>

            {modalOpen && (
                <MovimientoForm
                    type={modalType}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default Dashboard;
