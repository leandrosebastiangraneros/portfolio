import React, { useEffect, useState } from 'react';
import { useDialog } from '../context/DialogContext';
import { API_URL } from '../config';

const Historial = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, INCOME, EXPENSE

    const { showAlert, showConfirm } = useDialog();

    const fetchTransactions = () => {
        setLoading(true);
        fetch(`${API_URL}/transactions?limit=200`)
            .then(res => res.json())
            .then(data => {
                setTransactions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching transactions:", err);
                setLoading(false);
            });
    };

    const handleDelete = async (id) => {
        const confirmed = await showConfirm("¿Seguro que deseas eliminar este movimiento?", "Eliminar Movimiento");
        if (!confirmed) return;

        fetch(`${API_URL}/transactions/${id}`, {
            method: 'DELETE',
        })
            .then(res => {
                if (res.ok) {
                    showAlert("Movimiento eliminado correctamente", 'success');
                    fetchTransactions();
                } else {
                    showAlert("Error eliminando el movimiento", 'error');
                }
            })
            .catch(err => showAlert("Error network: " + err, 'error'));
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const formatMoney = (val) => val.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    };

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'ALL') return true;
        return t.type === filter;
    });

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-slate-400">
            <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando historial...
        </div>
    );

    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-center gap-4 text-white">
                <h1 className="text-3xl font-bold">Historial de Movimientos</h1>

                <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'ALL' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilter('INCOME')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'INCOME' ? 'bg-green-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Ingresos
                    </button>
                    <button
                        onClick={() => setFilter('EXPENSE')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'EXPENSE' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Gastos
                    </button>
                </div>
            </header>

            <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider border-b border-slate-700">
                                <th className="p-4 font-semibold">Fecha</th>
                                <th className="p-4 font-semibold">Categoría</th>
                                <th className="p-4 font-semibold">Descripción</th>
                                <th className="p-4 font-semibold text-right">Monto</th>
                                <th className="p-4 font-semibold text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        No hay movimientos registrados.
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((t) => (
                                    <tr key={t.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4 text-slate-400 font-medium whitespace-nowrap">
                                            {formatDate(t.date)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.type === 'INCOME'
                                                ? 'bg-green-500/10 text-green-400'
                                                : 'bg-red-500/10 text-red-400'
                                                }`}>
                                                {t.category ? t.category.name : '-'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-300 max-w-xs truncate" title={t.description}>
                                            {t.description || '-'}
                                        </td>
                                        <td className={`p-4 text-right font-bold whitespace-nowrap ${t.type === 'INCOME' ? 'text-green-500' : 'text-red-500'}`}>
                                            {t.type === 'INCOME' ? '+' : '-'} {formatMoney(t.amount)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleDelete(t.id)}
                                                className="text-slate-500 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-500/10"
                                                title="Eliminar"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards View */}
                <div className="md:hidden space-y-4 p-4">
                    {filteredTransactions.length === 0 ? (
                        <div className="text-center text-slate-500 p-8">No hay movimientos.</div>
                    ) : (
                        filteredTransactions.map(t => (
                            <div key={t.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 relative">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1">{formatDate(t.date)}</div>
                                        <div className={`text-xl font-bold ${t.type === 'INCOME' ? 'text-green-500' : 'text-red-500'}`}>
                                            {t.type === 'INCOME' ? '+ ' : '- '}{formatMoney(t.amount)}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(t.id)}
                                        className="text-slate-600 hover:text-red-400 p-1"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${t.type === 'INCOME' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                        }`}>
                                        {t.category ? t.category.name : 'General'}
                                    </span>
                                    <p className="text-sm text-slate-300 font-medium">
                                        {t.description || "Sin descripción"}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Historial;
