import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const CalendarView = () => {
    const [events, setEvents] = useState([]);

    // Simple state for filtering Month/Year (Default to current)
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        fetchEvents();
    }, [currentDate]);

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${API_URL}/calendar/events`);
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Helper to get days in month
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);

    // Selected Event Modal
    const [selectedEvent, setSelectedEvent] = useState(null);

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
                <div>
                    <h1 className="text-3xl font-bold">Calendario Maestro</h1>
                    <p className="text-slate-400">Visión mensual de todas las operaciones.</p>
                </div>

                <div className="flex items-center gap-4 bg-slate-800 p-2 rounded-lg border border-slate-700">
                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                        className="p-2 hover:bg-slate-700 rounded-full"
                    >
                        <span className="material-icons text-white">chevron_left</span>
                    </button>
                    <span className="font-bold text-lg min-w-[150px] text-center">
                        {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </span>
                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                        className="p-2 hover:bg-slate-700 rounded-full"
                    >
                        <span className="material-icons text-white">chevron_right</span>
                    </button>
                </div>
            </header>

            {/* Calendar Grid */}
            <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
                <div className="grid grid-cols-7 border-b border-slate-700 bg-slate-900 text-slate-400 text-sm font-bold uppercase text-center py-3">
                    <div>Dom</div><div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div>
                </div>

                <div className="grid grid-cols-7 auto-rows-[minmax(100px,auto)]">
                    {/* Empty cells */}
                    {[...Array(firstDay)].map((_, i) => (
                        <div key={`empty-${i}`} className="bg-slate-800/50 border-r border-b border-slate-700/50"></div>
                    ))}

                    {/* Days */}
                    {[...Array(days)].map((_, i) => {
                        const dayNum = i + 1;
                        // Construct ISO date string YYYY-MM-DD for matching
                        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
                        const dateStr = checkDate.toISOString().split('T')[0];

                        const dayEvents = events.filter(e => e.start.startsWith(dateStr));

                        return (
                            <div key={dayNum} className="border-r border-b border-slate-700 p-2 min-h-[120px] transition-colors hover:bg-slate-700/30">
                                <div className="text-right text-slate-500 mb-2 font-mono text-sm">{dayNum}</div>

                                <div className="space-y-1">
                                    {dayEvents.map(evt => (
                                        <div
                                            key={evt.id}
                                            onClick={() => setSelectedEvent(evt)}
                                            className="bg-indigo-600/20 border border-indigo-500/50 text-indigo-300 text-xs p-1.5 rounded cursor-pointer hover:bg-indigo-600 hover:text-white transition-all truncate"
                                        >
                                            <span className="font-bold mr-1">●</span>
                                            {evt.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Event Details Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 w-full max-w-md rounded-2xl border border-slate-600 shadow-2xl p-6 animate-fade-in-up">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-white pr-4">{selectedEvent.title}</h3>
                            <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-white">
                                <span className="material-icons">close</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-slate-900 rounded p-4 border border-slate-700">
                                <span className="text-slate-500 text-sm block">Producción Total</span>
                                <span className="text-2xl font-bold text-green-400">{selectedEvent.extendedProps.meters?.toFixed(2)} metros</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900 rounded p-3 border border-slate-700">
                                    <span className="text-slate-500 text-xs block">Personal</span>
                                    <span className="text-white font-bold">{selectedEvent.extendedProps.driver_count} asignados</span>
                                </div>
                                <div className="bg-slate-900 rounded p-3 border border-slate-700">
                                    <span className="text-slate-500 text-xs block">Materiales</span>
                                    <span className="text-white font-bold">{selectedEvent.extendedProps.materials_count} ítems</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarView;
