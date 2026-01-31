import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { formatDateDisplay, getTodayArgentina } from '../utils/dateUtils';

const WorkerProfile = ({ employeeId, onClose }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (employeeId) loadHistory();
    }, [employeeId]);

    const loadHistory = async () => {
        try {
            const res = await fetch(`${API_URL}/employees/${employeeId}/history`);
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-white">Cargando perfil...</div>;
    if (!data) return <div className="p-8 text-center text-red-400">Error cargando perfil.</div>;

    // Helper for Attendance Heatmap (simplified)
    const getAttendanceColor = (dateStr) => {
        const found = data.attendance_log.find(a => a.date.startsWith(dateStr));
        if (!found) return 'bg-slate-700'; // No data
        return found.is_present ? 'bg-green-500' : 'bg-red-500';
    };

    // Generate centered range: [Today-5 ... Today ... Today+5]
    const getCenteredDateRange = () => {
        // Use Argentina "Today" as anchor
        const todayStr = getTodayArgentina(); // YYYY-MM-DD
        const todayDate = new Date(todayStr + 'T12:00:00');

        const days = [];
        // 5 days before + 1 today + 5 days after = 11 days
        for (let i = -5; i <= 5; i++) {
            const d = new Date(todayDate);
            d.setDate(todayDate.getDate() + i);
            days.push(d.toISOString().split('T')[0]);
        }
        return days;
    };

    const dateRange = getCenteredDateRange();
    const todayStr = getTodayArgentina();

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 w-full max-w-4xl h-[90vh] rounded-2xl border border-slate-700 shadow-2xl overflow-y-auto flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-start sticky top-0 bg-slate-900 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{data.name}</h2>
                        <span className="bg-indigo-900 text-indigo-300 text-xs px-2 py-1 rounded border border-indigo-700">Operario Activo</span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-2">
                        <span className="material-icons">close</span>
                    </button>
                </div>

                <div className="p-6 space-y-8 flex-1">

                    {/* SECTION A: Big Numbers */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                            <span className="text-slate-400 text-sm">Ganancias Totales</span>
                            <div className="text-2xl font-bold text-green-400 mt-1">${data.balance_earned.toLocaleString()}</div>
                        </div>
                        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                            <span className="text-slate-400 text-sm">Adelantos</span>
                            <div className="text-2xl font-bold text-orange-400 mt-1">-${data.balance_advances.toLocaleString()}</div>
                        </div>
                        <div className="bg-slate-800 p-5 rounded-xl border border-indigo-500 shadow-lg shadow-indigo-500/10">
                            <span className="text-indigo-300 text-sm font-bold">SALDO A PAGAR</span>
                            <div className="text-3xl font-black text-white mt-1">${data.net_payable.toLocaleString()}</div>
                        </div>
                    </div>

                    {/* SECTION B: Attendance Visual */}
                    <div>
                        <h3 className="text-white font-bold mb-4 flex items-center">
                            <span className="material-icons mr-2 text-blue-400">calendar_month</span>
                            Asistencia Reciente
                        </h3>
                        {/* Container: overflow-x-hidden to hide scrollbar, justify-center to center if fits, or custom css */}
                        <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl overflow-x-hidden md:justify-center md:gap-4">
                            {dateRange.map(date => {
                                const statusColor = getAttendanceColor(date);
                                const isPresent = statusColor === 'bg-green-500';
                                const noData = statusColor === 'bg-slate-700';
                                const isToday = date === todayStr;

                                return (
                                    <div key={date} className={`flex flex-col items-center min-w-[3rem] group relative transition-transform duration-300 ${isToday ? 'scale-110 z-10' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}>

                                        {/* Day Label */}
                                        <span className={`text-[9px] uppercase mb-1 font-bold ${isToday ? 'text-blue-400' : 'text-slate-500'}`}>
                                            {isToday ? 'HOY' : new Date(date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short' }).slice(0, 3)}
                                        </span>

                                        <div
                                            className={`
                                                w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center 
                                                border transition-all duration-300 relative
                                                ${isPresent
                                                    ? 'bg-green-500/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                                                    : noData
                                                        ? 'bg-slate-800 border-slate-700'
                                                        : 'bg-red-500/20 border-red-500'
                                                }
                                                ${isToday ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900 border-transparent' : ''}
                                            `}
                                        >
                                            <span className={`material-icons text-lg md:text-xl ${isPresent ? 'text-green-400' : noData ? 'text-slate-600' : 'text-red-400'}`}>
                                                {isPresent ? 'check_circle' : noData ? 'remove' : 'cancel'}
                                            </span>
                                        </div>

                                        <span className={`text-[10px] font-bold font-mono mt-1 ${isToday ? 'text-blue-400' : isPresent ? 'text-green-400' : 'text-slate-500'}`}>
                                            {new Date(date + 'T12:00:00').getDate()} {/* Day number */}
                                        </span>

                                        {/* Tooltip */}
                                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-950 text-white text-xs px-2 py-1 rounded border border-slate-700 whitespace-nowrap z-20 shadow-xl">
                                            {formatDateDisplay(date)}
                                            <div className="font-bold">
                                                {isPresent ? 'Presente' : noData ? 'Sin registro' : 'Ausente'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* SECTION C: Production History */}
                    <div>
                        <h3 className="text-white font-bold mb-4 flex items-center">
                            <span className="material-icons mr-2 text-green-400">history_edu</span>
                            Historial de Producción
                        </h3>
                        <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-900/50 text-slate-200 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="p-4">Fecha</th>
                                        <th className="p-4">Viaje</th>
                                        <th className="p-4 text-right">Metros</th>
                                        <th className="p-4 text-right">Valor</th>
                                        <th className="p-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {data.trip_assignments.length === 0 ? (
                                        <tr><td colSpan="5" className="p-4 text-center italic">Sin actividad reciente.</td></tr>
                                    ) : (
                                        data.trip_assignments.map((trip, idx) => (
                                            <tr key={idx} className="hover:bg-slate-700/50 transition-colors">
                                                <td className="p-4 font-mono text-xs">{formatDateDisplay(trip.date)}</td>
                                                <td className="p-4 font-medium text-white">{trip.trip_description}</td>
                                                <td className="p-4 text-right">{trip.meters_done}m</td>
                                                <td className="p-4 text-right text-xs">${trip.historical_price}</td>
                                                <td className="p-4 text-right font-bold text-green-400">+${trip.total_earned}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WorkerProfile;
