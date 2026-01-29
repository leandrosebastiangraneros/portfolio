import React, { useState } from 'react';

const Reportes = () => {
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());
    const [loading, setLoading] = useState(false);

    const handleDownload = () => {
        setLoading(true);
        const url = `http://localhost:8001/reports/monthly?year=${year}&month=${month}`;

        // Trigger download
        window.open(url, '_blank');

        // Use timeout to reset loading state as we can't easily track download competition
        setTimeout(() => setLoading(false), 2000);
    };

    const months = [
        { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' }, { value: 3, label: 'Marzo' },
        { value: 4, label: 'Abril' }, { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
        { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Septiembre' },
        { value: 10, label: 'Octubre' }, { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' }
    ];

    // Generate years (current year to 5 years back)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

    return (
        <div className="space-y-6">
            <header className="text-white">
                <h1 className="text-3xl font-bold">Reportes Mensuales</h1>
                <p className="text-slate-400">Genera y descarga un resumen completo de tus finanzas.</p>
            </header>

            <div className="bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-700 max-w-2xl mx-auto mt-10">
                <div className="flex flex-col items-center space-y-8">
                    <div className="bg-blue-500/10 p-6 rounded-full">
                        <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400">Mes</label>
                            <select
                                value={month}
                                onChange={(e) => setMonth(parseInt(e.target.value))}
                                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                {months.map(m => (
                                    <option key={m.value} value={m.value} className="bg-slate-800">{m.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400">Año</label>
                            <select
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value))}
                                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                {years.map(y => (
                                    <option key={y} value={y} className="bg-slate-800">{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleDownload}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/40 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        )}
                        {loading ? 'Generando Reporte...' : 'Descargar Reporte Mensual'}
                    </button>

                    <p className="text-xs text-slate-500 text-center">
                        El reporte incluye un resumen de ingresos y gastos, balance final y un detalle de todos los movimientos del mes seleccionado.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Reportes;
