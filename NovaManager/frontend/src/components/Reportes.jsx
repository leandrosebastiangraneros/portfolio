import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useDialog } from '../context/DialogContext';
import { formatDateDisplay } from '../utils/dateUtils';

const Reportes = () => {
    const { showAlert } = useDialog();
    const [summary, setSummary] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);

    // Date Filter
    const [date, setDate] = useState(new Date());

    // Upload State
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        loadData();
    }, [date]);

    const loadData = async () => {
        setLoading(true);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        try {
            // 1. Summary
            const sumRes = await fetch(`${API_URL}/finances/summary?month=${month}&year=${year}`);
            if (sumRes.ok) setSummary(await sumRes.json());

            // 2. Expenses
            const expRes = await fetch(`${API_URL}/expenses?month=${month}&year=${year}`);
            if (expRes.ok) setExpenses(await expRes.json());

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !amount || !desc) {
            showAlert("Complete todos los campos", "error");
            return;
        }

        const formData = new FormData();
        formData.append("description", desc);
        formData.append("amount", amount);
        formData.append("date", date.toISOString().split('T')[0]); // Use current month filter date as upload date default? No, usually today. Let's send selected month as default or just today.
        // Actually, let's use the current date of the filter for context, or just today. 
        // Better: let the user pick date? For simplicity let's assume expense is for "today" or allow text.
        // Let's attach date from filter to be safe? No, upload usually implies "here is this bill".
        // Let's use the first day of the selected filter month just to place it correctly in the view? 
        // Nah, let's just send Today.
        // Correct fix: Add date picker in modal. For now, use today's date.
        formData.append("date", new Date().toISOString().split('T')[0]);
        formData.append("file", file);

        try {
            const res = await fetch(`${API_URL}/expenses/upload`, {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                showAlert("Comprobante subido correctamente", "success");
                setUploadModalOpen(false);
                setDesc('');
                setAmount('');
                setFile(null);
                loadData();
            } else {
                showAlert("Error al subir", "error");
            }
        } catch (err) {
            console.error(err);
            showAlert("Error de conexión", "error");
        }
    };

    const downloadPDF = async () => {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        window.open(`${API_URL}/reports/monthly?month=${month}&year=${year}`, '_blank');
    };

    const changeMonth = (delta) => {
        const newDate = new Date(date.setMonth(date.getMonth() + delta));
        setDate(new Date(newDate));
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
                <div>
                    <h1 className="text-3xl font-bold">Administración y Reportes</h1>
                    <p className="text-slate-400">Control de gastos, balances y contabilidad.</p>
                </div>

                <div className="flex items-center gap-4 bg-slate-800 p-2 rounded-lg border border-slate-700">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-700 rounded-full">
                        <span className="material-icons text-white">chevron_left</span>
                    </button>
                    <span className="font-bold text-lg min-w-[150px] text-center capitalize">
                        {date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-700 rounded-full">
                        <span className="material-icons text-white">chevron_right</span>
                    </button>
                </div>
            </header>

            {/* FINANCIAL SUMMARY */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <div className="text-slate-400 text-sm font-bold uppercase mb-2">Mano de Obra (Producción)</div>
                        <div className="text-3xl font-bold text-green-400">${summary.labor_cost.toLocaleString()}</div>
                        <div className="w-full bg-slate-700 h-2 rounded-full mt-4 overflow-hidden">
                            <div
                                className="bg-green-500 h-full"
                                style={{ width: `${(summary.labor_cost / (summary.total_cost || 1)) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <div className="text-slate-400 text-sm font-bold uppercase mb-2">Gastos Operativos (Compras)</div>
                        <div className="text-3xl font-bold text-orange-400">${summary.expense_cost.toLocaleString()}</div>
                        <div className="w-full bg-slate-700 h-2 rounded-full mt-4 overflow-hidden">
                            <div
                                className="bg-orange-500 h-full"
                                style={{ width: `${(summary.expense_cost / (summary.total_cost || 1)) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-xl border border-indigo-700 shadow-lg flex flex-col justify-between">
                        <div>
                            <div className="text-indigo-300 text-sm font-bold uppercase mb-2">Total Egresos del Mes</div>
                            <div className="text-4xl font-black text-white">${summary.total_cost.toLocaleString()}</div>
                        </div>
                        <button
                            onClick={downloadPDF}
                            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                        >
                            <span className="material-icons">picture_as_pdf</span>
                            Descargar Reporte Contable
                        </button>
                    </div>
                </div>
            )}

            {/* EXPENSES LIST */}
            <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="material-icons text-orange-400">receipt_long</span>
                        Comprobantes de Gastos
                    </h2>
                    <button
                        onClick={() => setUploadModalOpen(true)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
                    >
                        <span className="material-icons">upload_file</span>
                        Subir Comprobante
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900 text-slate-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="p-4">Fecha</th>
                                <th className="p-4">Descripción</th>
                                <th className="p-4">Monto</th>
                                <th className="p-4 text-center">Archivo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {expenses.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-slate-500 italic">No hay comprobantes cargados este mes.</td>
                                </tr>
                            ) : (
                                expenses.map(exp => (
                                    <tr key={exp.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4 text-slate-300 font-mono text-sm">{formatDateDisplay(exp.date)}</td>
                                        <td className="p-4 text-white font-medium">{exp.description}</td>
                                        <td className="p-4 text-orange-400 font-bold font-mono">${exp.amount.toLocaleString()}</td>
                                        <td className="p-4 text-center">
                                            <a
                                                href={`${API_URL}/${exp.file_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs bg-slate-700 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
                                            >
                                                <span className="material-icons text-sm">visibility</span>
                                                Ver
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* UPLOAD MODAL */}
            {uploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl overflow-hidden animate-fade-in-up">
                        <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
                            <h3 className="text-white font-bold">Nuevo Comprobante</h3>
                            <button onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-white">
                                <span className="material-icons">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleUpload} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs uppercase text-slate-400 font-bold mb-1">Descripción</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-slate-900 border border-slate-600 rounded text-white outline-none focus:border-orange-500"
                                    placeholder="Ej: Combustible Camión 1"
                                    value={desc}
                                    onChange={e => setDesc(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-slate-400 font-bold mb-1">Monto ($)</label>
                                <input
                                    type="number"
                                    className="w-full p-3 bg-slate-900 border border-slate-600 rounded text-white outline-none focus:border-orange-500 font-mono"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-slate-400 font-bold mb-1">Archivo (PDF/Imagen)</label>
                                <input
                                    type="file"
                                    className="w-full p-2 bg-slate-900 border border-slate-600 rounded text-slate-300 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                                    accept=".pdf,image/*"
                                    onChange={e => setFile(e.target.files[0])}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow-lg mt-2 transition-all"
                            >
                                Guardar Gasto
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reportes;
