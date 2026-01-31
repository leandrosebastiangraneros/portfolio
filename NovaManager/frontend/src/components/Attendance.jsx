import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { getTodayArgentina, formatLongDate } from '../utils/dateUtils';

const Attendance = () => {
    // 1. Initialize with robust Argentina Date
    const [employees, setEmployees] = useState([]);
    const [groups, setGroups] = useState([]);
    const [attendance, setAttendance] = useState({}); // { emp_id: true/false }
    const [date, setDate] = useState(getTodayArgentina());

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadData();
    }, [date]);

    // ... inside loadData ...
    const loadData = async () => {
        if (!date || date === 'Invalid Date' || isNaN(new Date(date).getTime())) {
            setMessage({ type: 'error', text: 'Fecha inválida detectada.' });
            return;
        }

        setLoading(true);
        try {
            // 1. Cargar Empleados y Grupos
            const [empRes, groupRes, attRes] = await Promise.all([
                fetch(`${API_URL}/employees`),
                fetch(`${API_URL}/employee-groups`),
                fetch(`${API_URL}/attendance/${date}`)
            ]);

            // Check for HTTP errors
            if (!empRes.ok || !groupRes.ok || !attRes.ok) {
                console.error("Fetch error:", empRes.status, groupRes.status, attRes.status);
                throw new Error("Error en la respuesta del servidor");
            }

            const emps = await empRes.json();
            const grps = await groupRes.json();
            const attData = await attRes.json();

            // Validate Groups
            if (Array.isArray(grps)) {
                setGroups(grps);
            } else {
                console.warn("Grupos formato incorrecto (esperaba array):", grps);
                setGroups([]);
            }

            // ... process attendance ...
            const attMap = {};
            if (Array.isArray(attData)) {
                attData.forEach(a => {
                    attMap[a.employee_id] = a.is_present;
                });
            }

            if (Array.isArray(emps)) {
                setEmployees(emps);
            } else {
                console.error("Empleados no es un array:", emps);
                setEmployees([]);
                setMessage({ type: 'error', text: 'Error: Datos de empleados inválidos.' });
            }

            setAttendance(attMap);

        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Error cargando datos de asistencia.' });
        } finally {
            setLoading(false);
        }
    };



    const toggleAttendance = (empId) => {
        setAttendance(prev => ({
            ...prev,
            [empId]: !prev[empId]
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        const payload = employees.map(emp => ({
            employee_id: emp.id,
            is_present: !!attendance[emp.id],
            date: date
        }));

        try {
            const res = await fetch(`${API_URL}/attendance/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Asistencia guardada correctamente.' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: 'Error al guardar. Verifica la conexión o la fecha.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Error de conexión.' });
        } finally {
            setLoading(false);
        }
    };


    const handlePrevDay = () => {
        try {
            const d = new Date(date + 'T12:00:00');
            d.setDate(d.getDate() - 1);
            setDate(d.toISOString().split('T')[0]);
        } catch (e) {
            console.error("Error changing date", e);
        }
    };

    const handleNextDay = () => {
        try {
            const d = new Date(date + 'T12:00:00');
            d.setDate(d.getDate() + 1);
            setDate(d.toISOString().split('T')[0]);
        } catch (e) {
            console.error("Error changing date", e);
        }
    };

    const markAll = (status) => {
        const newAtt = {};
        employees.forEach(e => newAtt[e.id] = status);
        setAttendance(newAtt);
    };

    // Stats
    const totalEmps = employees.length;
    const presentCount = Object.values(attendance).filter(Boolean).length;
    const absentCount = totalEmps - presentCount;

    // Formatear fecha para mostrar (USING UTILS NOW)
    const formattedDate = formatLongDate(date);

    return (
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 animate-fade-in relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>

            {/* Header / Date Nav */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 z-10 relative">
                <h2 className="text-2xl font-bold flex items-center text-white">
                    <span className="material-icons mr-3 text-blue-500 bg-blue-500/10 p-2 rounded-lg">playlist_add_check</span>
                    Control de Asistencia
                </h2>

                <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-700 shadow-lg">
                    <button onClick={handlePrevDay} className="w-10 h-10 flex items-center justify-center hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors active:scale-95">
                        <span className="material-icons">chevron_left</span>
                    </button>

                    <div className="relative group px-4 text-center min-w-[180px]">
                        <label className="text-xs text-blue-400 font-bold uppercase tracking-wider block mb-0.5">Fecha Operativa</label>
                        <div className="text-white font-bold capitalize text-lg leading-tight truncate">
                            {formattedDate}
                        </div>
                        {/* Hidden Input Overlay */}
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center"></div>
                    </div>

                    <button onClick={handleNextDay} className="w-10 h-10 flex items-center justify-center hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors active:scale-95">
                        <span className="material-icons">chevron_right</span>
                    </button>
                </div>
            </div>

            {/* Stats & Bulk Actions Responsive */}
            <div className="flex flex-col xl:flex-row gap-6 mb-8">
                {/* Stats Cards */}
                <div className="flex flex-1 gap-4">
                    <div className="flex-1 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-green-900/10">
                        <div>
                            <span className="block text-green-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Total Presentes</span>
                            <span className="text-3xl md:text-4xl font-black text-white">{presentCount}</span>
                        </div>
                        <div className="bg-green-500/20 p-2 rounded-full">
                            <span className="material-icons text-green-400 text-2xl">check</span>
                        </div>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-red-900/10">
                        <div>
                            <span className="block text-red-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Total Ausentes</span>
                            <span className="text-3xl md:text-4xl font-black text-white">{absentCount}</span>
                        </div>
                        <div className="bg-red-500/20 p-2 rounded-full">
                            <span className="material-icons text-red-400 text-2xl">close</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-xl border border-slate-700/50 justify-center">
                    <button onClick={() => markAll(true)} className="flex items-center px-5 py-3 bg-slate-700 hover:bg-slate-600 hover:text-white text-slate-300 rounded-lg text-sm font-bold transition-all border border-slate-600 hover:border-slate-500 hover:shadow-md active:scale-95">
                        <span className="material-icons text-lg mr-2 text-green-400">done_all</span>
                        Todos
                    </button>
                    <div className="w-px h-8 bg-slate-700"></div>
                    <button onClick={() => markAll(false)} className="flex items-center px-5 py-3 bg-slate-700 hover:bg-slate-600 hover:text-white text-slate-300 rounded-lg text-sm font-bold transition-all border border-slate-600 hover:border-slate-500 hover:shadow-md active:scale-95">
                        <span className="material-icons text-lg mr-2 text-red-400">remove_circle_outline</span>
                        Limpiar
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-600 border-t-blue-500"></div>
                </div>
            ) : (
                <div className="space-y-8 mb-8">
                    {employees.length === 0 && (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-500 bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-700">
                            <span className="material-icons text-5xl mb-4 opacity-30">group_off</span>
                            <p className="font-medium">No hay empleados registrados.</p>
                        </div>
                    )}

                    {/* Render Groups */}
                    {groups.map(group => {
                        const groupEmps = employees.filter(e => e.group_id === group.id);
                        if (groupEmps.length === 0) return null;

                        return (
                            <div key={group.id} className="bg-slate-900/40 p-5 rounded-2xl border border-slate-700/50">
                                <h3 className="text-white font-bold mb-4 flex items-center text-lg uppercase tracking-wide">
                                    <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
                                    {group.name}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                    {groupEmps.map(emp => {
                                        const isPresent = !!attendance[emp.id];
                                        return (
                                            <div
                                                key={emp.id}
                                                onClick={() => toggleAttendance(emp.id)}
                                                className={`
                                                        cursor-pointer relative p-4 rounded-2xl border-2 transition-all duration-300 group overflow-hidden
                                                        flex flex-col items-center justify-center text-center gap-3 h-32
                                                        ${isPresent
                                                        ? 'bg-gradient-to-b from-slate-800 to-green-900/20 border-green-500 shadow-xl shadow-green-900/20 scale-[1.02]'
                                                        : 'bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-750 opacity-75 hover:opacity-100'}
                                                    `}
                                            >
                                                {/* Selection Indicator Background */}
                                                <div className={`absolute inset-0 bg-green-500/5 transition-opacity duration-300 ${isPresent ? 'opacity-100' : 'opacity-0'}`}></div>

                                                <div className={`
                                                        w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-1 shadow-lg relative z-10 transition-colors duration-300
                                                        ${isPresent ? 'bg-green-500 text-slate-900' : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600 group-hover:text-slate-200'}
                                                    `}>
                                                    {emp.name.charAt(0)}
                                                    {isPresent && (
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-slate-800">
                                                            <span className="material-icons text-green-600 text-[12px] font-bold">check</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <span className={`font-bold text-sm leading-tight relative z-10 transition-colors duration-300 ${isPresent ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                                    {emp.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

                    {/* Render Without Group */}
                    {employees.filter(e => !e.group_id).length > 0 && (
                        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-700/50">
                            <h3 className="text-slate-400 font-bold mb-4 flex items-center text-lg uppercase tracking-wide">
                                <span className="w-2 h-6 bg-slate-600 rounded-full mr-3"></span>
                                Sin Grupo Asignado
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                {employees.filter(e => !e.group_id).map(emp => {
                                    const isPresent = !!attendance[emp.id];
                                    return (
                                        <div
                                            key={emp.id}
                                            onClick={() => toggleAttendance(emp.id)}
                                            className={`
                                                    cursor-pointer relative p-4 rounded-2xl border-2 transition-all duration-300 group overflow-hidden
                                                    flex flex-col items-center justify-center text-center gap-3 h-32
                                                    ${isPresent
                                                    ? 'bg-gradient-to-b from-slate-800 to-green-900/20 border-green-500 shadow-xl shadow-green-900/20 scale-[1.02]'
                                                    : 'bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-750 opacity-75 hover:opacity-100'}
                                                `}
                                        >
                                            <div className={`absolute inset-0 bg-green-500/5 transition-opacity duration-300 ${isPresent ? 'opacity-100' : 'opacity-0'}`}></div>
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-1 shadow-lg relative z-10 transition-colors duration-300 ${isPresent ? 'bg-green-500 text-slate-900' : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600 group-hover:text-slate-200'}`}>
                                                {emp.name.charAt(0)}
                                                {isPresent && (<div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-slate-800"><span className="material-icons text-green-600 text-[12px] font-bold">check</span></div>)}
                                            </div>
                                            <span className={`font-bold text-sm leading-tight relative z-10 transition-colors duration-300 ${isPresent ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{emp.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-slate-700 gap-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
                    <span className="material-icons text-base">info</span>
                    {date === getTodayArgentina()
                        ? "Mostrando asistencia del día HOY"
                        : "🚧 Estás editando una fecha PASADA o FUTURA"
                    }
                </div>

                <button
                    onClick={handleSave}
                    disabled={loading || employees.length === 0}
                    className={`
                        w-full md:w-auto py-4 px-10 rounded-xl shadow-2xl transition-all duration-300 flex items-center justify-center font-bold text-lg tracking-wide
                        ${loading || employees.length === 0
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-95'}
                    `}
                >
                    {loading ? 'Guardando...' : (
                        <>
                            <span className="material-icons mr-2">save</span>
                            CONFIRMAR ASISTENCIA
                        </>
                    )}
                </button>
            </div>

            {message && (
                <div className={`mt-6 p-4 rounded-xl flex items-center shadow-lg animate-fade-in-up border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                    <div className={`p-2 rounded-full mr-3 ${message.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        <span className="material-icons">{message.type === 'success' ? 'check' : 'priority_high'}</span>
                    </div>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default Attendance;
