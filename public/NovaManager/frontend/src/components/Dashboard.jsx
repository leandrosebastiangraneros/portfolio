import React, { useEffect, useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MovimientoForm from './MovimientoForm';
import { API_URL } from '../config';
import { getTodayArgentina } from '../utils/dateUtils';

const Dashboard = () => {
    // State for all data sources
    const [finances, setFinances] = useState({ income: 0, expenses: 0, balance: 0, month: '...', chart_data: [] });
    const [operations, setOperations] = useState({ activeTrips: 0, totalTripsMonth: 0 });
    const [attendance, setAttendance] = useState({ present: 0, total: 0 });
    const [stockAlerts, setStockAlerts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('INCOME'); // INCOME or EXPENSE

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const today = getTodayArgentina();

            const [statsRes, tripsRes, attRes, stockRes, empsRes] = await Promise.all([
                fetch(`${API_URL}/dashboard-stats`),
                fetch(`${API_URL}/trips`),
                fetch(`${API_URL}/attendance/${today}`),
                fetch(`${API_URL}/stock`),
                fetch(`${API_URL}/employees`)
            ]);

            // 1. Financials
            if (statsRes.ok) {
                setFinances(await statsRes.json());
            }

            // 2. Operations (Trips)
            if (tripsRes.ok) {
                const trips = await tripsRes.json();
                const active = trips.filter(t => t.status === 'OPEN').length;
                setOperations({
                    activeTrips: active,
                    totalTripsMonth: trips.length // Approximated, ideally logic should filter by month
                });
            }

            // 3. Attendance & Employees
            let totalEmps = 0;
            if (empsRes.ok) {
                const emps = await empsRes.json();
                totalEmps = emps.length;
            }

            let presentCount = 0;
            if (attRes.ok) {
                const attData = await attRes.json();
                // attData is list of {employee_id, is_present...}
                // Filter only is_present=true
                presentCount = attData.filter(a => a.is_present).length;
            }

            setAttendance({
                present: presentCount,
                total: totalEmps
            });

            // 4. Stock Alerts
            if (stockRes.ok) {
                const items = await stockRes.json();
                // Filter items with quantity <= 0 or status DEPLETED
                const depleted = items.filter(i => i.quantity <= 0);
                setStockAlerts(depleted);
            }

        } catch (err) {
            console.error("Error loading dashboard:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleOpenModal = (type) => {
        setModalType(type);
        setModalOpen(true);
    };

    const handleSave = () => {
        fetchAllData(); // Refresh all
    };

    const formatMoney = (val) => val.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

    // Clock State
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Format Date: "Viernes, 30 de Enero 2026"
    const dateStr = currentTime.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    // Format Time: "10:45"
    const timeStr = currentTime.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    if (loading) return (
        <div className="flex items-center justify-center h-screen text-slate-400">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-blue-500"></div>
                <p className="font-medium animate-pulse">Analizando datos de la empresa...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-white mb-6">
                <div>
                    <div className="text-slate-400 font-mono text-xs md:text-sm mb-1 uppercase tracking-widest opacity-80">
                        {dateStr} &bull; <span className="text-blue-400 font-bold">{timeStr}</span>
                    </div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Centro de Comando
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Sistema Operativo &bull; {finances.month}
                    </p>
                </div>
                <div className="text-right bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Caja Actual</div>
                    <div className={`text-3xl font-black ${finances.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                        {formatMoney(finances.balance)}
                    </div>
                </div>
            </header>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* 1. OPERATIONAL CARD: Active Trips */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-xl shadow-blue-900/20 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-icons text-8xl transform rotate-12">local_shipping</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-blue-100 font-bold text-sm uppercase tracking-wider mb-2">Viajes Activos</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black">{operations.activeTrips}</span>
                            <span className="text-blue-200 text-sm font-medium">en curso</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-medium text-blue-100">
                            <span>Flota en movimiento</span>
                            <span className="material-icons text-sm">arrow_forward</span>
                        </div>
                    </div>
                </div>

                {/* 2. OPERATIONAL CARD: Attendance */}
                <div className="bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700 relative overflow-hidden group hover:border-slate-600 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-icons text-8xl text-slate-400">groups</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-2">Personal Presente</h3>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-4xl font-black ${attendance.present > 0 ? 'text-white' : 'text-slate-500'}`}>
                                {attendance.present}
                            </span>
                            <span className="text-slate-500 text-sm font-medium">/ {attendance.total} total</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-700 h-1.5 rounded-full mt-4 overflow-hidden">
                            <div
                                className="bg-green-500 h-full transition-all duration-1000"
                                style={{ width: `${(attendance.present / (attendance.total || 1)) * 100}%` }}
                            ></div>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 text-right">
                            {attendance.total > 0 ? Math.round((attendance.present / attendance.total) * 100) : 0}% Asistencia
                        </div>
                    </div>
                </div>

                {/* 3. FINANCIAL CARD: Income */}
                <div className="bg-slate-800 rounded-2xl p-6 shadow-lg border-l-4 border-green-500 flex flex-col justify-between hover:bg-slate-750 transition-colors">
                    <div>
                        <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Ingresos (Mes)</h3>
                        <div className="text-2xl font-bold text-green-400">{formatMoney(finances.income)}</div>
                    </div>
                    <div className="mt-4 flex items-center justify-end">
                        <span className="bg-green-500/10 text-green-500 p-2 rounded-lg">
                            <span className="material-icons">trending_up</span>
                        </span>
                    </div>
                </div>

                {/* 4. FINANCIAL CARD: Expenses */}
                <div className="bg-slate-800 rounded-2xl p-6 shadow-lg border-l-4 border-red-500 flex flex-col justify-between hover:bg-slate-750 transition-colors">
                    <div>
                        <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Gastos (Mes)</h3>
                        <div className="text-2xl font-bold text-red-400">{formatMoney(finances.expenses)}</div>
                    </div>
                    <div className="mt-4 flex items-center justify-end">
                        <span className="bg-red-500/10 text-red-500 p-2 rounded-lg">
                            <span className="material-icons">trending_down</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* SECOND ROW: Chart & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT: Financial Chart (Span 2) */}
                <div className="lg:col-span-2 bg-slate-800 rounded-2xl shadow-lg border border-slate-700/50 p-6">
                    <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                        <span className="material-icons text-slate-400">insights</span>
                        Evolución Financiera
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={finances.chart_data}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(val) => `$${val / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                    formatter={(value) => formatMoney(value)}
                                />
                                <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" name="Ingresos" />
                                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" name="Gastos" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* RIGHT: Quick Actions & Alerts (Span 1) */}
                <div className="space-y-6">

                    {/* Actions */}
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
                        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">Acciones Rápidas</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleOpenModal('INCOME')} className="p-3 bg-slate-800 hover:bg-slate-700 text-green-400 rounded-xl border border-slate-700 transition-all flex flex-col items-center gap-2 group">
                                <span className="material-icons text-3xl group-hover:scale-110 transition-transform">add_circle</span>
                                <span className="text-xs font-bold">Ingreso</span>
                            </button>
                            <button onClick={() => handleOpenModal('EXPENSE')} className="p-3 bg-slate-800 hover:bg-slate-700 text-red-400 rounded-xl border border-slate-700 transition-all flex flex-col items-center gap-2 group">
                                <span className="material-icons text-3xl group-hover:scale-110 transition-transform">remove_circle</span>
                                <span className="text-xs font-bold">Gasto</span>
                            </button>
                        </div>
                    </div>

                    {/* Stock Alerts */}
                    <div className={`rounded-2xl p-4 border transition-colors ${stockAlerts.length > 0 ? 'bg-red-900/10 border-red-500/30' : 'bg-slate-800 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className={`text-sm font-bold flex items-center gap-2 ${stockAlerts.length > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                                <span className="material-icons text-base">inventory_2</span>
                                Alertas de Stock
                            </h4>
                            {stockAlerts.length > 0 && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">{stockAlerts.length}</span>
                            )}
                        </div>

                        {stockAlerts.length === 0 ? (
                            <div className="text-center py-4 text-slate-500 text-xs">
                                <span className="material-icons text-2xl mb-1 opacity-50 block">check_circle</span>
                                Todo el stock en orden
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {stockAlerts.map(item => (
                                    <div key={item.id} className="flex items-center justify-between bg-slate-900/50 p-2 rounded-lg border border-red-500/20">
                                        <span className="text-slate-300 text-xs font-medium">{item.name}</span>
                                        <span className="text-red-400 text-xs font-bold">AGOTADO</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

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
