import React, { useState, useEffect } from 'react';
import { useDialog } from '../context/DialogContext';
import { API_URL } from '../config';

const MovimientoForm = ({ type, onClose, onSave }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [displayAmount, setDisplayAmount] = useState('');
    const { showAlert } = useDialog();

    useEffect(() => {
        fetch(`${API_URL}/categories`)
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Error fetching categories:", err));

        if (categories.length === 0) {
            setCategories([
                { id: 1, name: 'Honorarios / Servicios', type: 'INCOME' },
                { id: 2, name: 'Venta de Productos', type: 'INCOME' },
                { id: 3, name: 'Otros Ingresos', type: 'INCOME' },
                { id: 4, name: 'Monotributo / Impuestos', type: 'EXPENSE' },
                { id: 5, name: 'Servicios (Luz, Internet)', type: 'EXPENSE' },
                { id: 6, name: 'Insumos / Materiales', type: 'EXPENSE' },
                { id: 7, name: 'Viáticos / Transporte', type: 'EXPENSE' },
                { id: 8, name: 'Publicidad / Marketing', type: 'EXPENSE' },
                { id: 9, name: 'Alquiler', type: 'EXPENSE' },
                { id: 10, name: 'Equipamiento', type: 'EXPENSE' },
                { id: 11, name: 'Suscripciones Software', type: 'EXPENSE' },
                { id: 12, name: 'Otros Gastos', type: 'EXPENSE' }
            ]);
        }
    }, [categories.length]);

    const handleAmountChange = (e) => {
        let rawValue = e.target.value.replace(/\D/g, '');
        if (!rawValue) {
            setDisplayAmount('');
            setAmount('');
            return;
        }
        const numberValue = parseInt(rawValue, 10);
        const formatted = (numberValue / 100).toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        setDisplayAmount(formatted);
        setAmount((numberValue / 100).toString());
    };

    const filteredCategories = categories.filter(cat => cat.type === type);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!categoryId) {
            showAlert("Por favor selecciona una categoría", "error");
            return;
        }
        const payload = {
            amount: parseFloat(amount),
            description,
            type: type,
            category_id: parseInt(categoryId),
            is_invoiced: false
        };

        fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                onSave(data);
                onClose();
                showAlert("Movimiento registrado con éxito", "success");
            })
            .catch(err => showAlert("Error saving: " + err, "error"));
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
            <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-700 animate-fade-in-up">
                {/* Header */}
                <div className={`p-6 text-white flex justify-between items-center ${type === 'INCOME' ? 'bg-gradient-to-r from-green-600 to-emerald-700' : 'bg-gradient-to-r from-red-600 to-rose-700'}`}>
                    <h2 className="text-xl font-bold tracking-tight">
                        {type === 'INCOME' ? 'Registrar Ingreso' : 'Registrar Gasto'}
                    </h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                    {/* Amount Input */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Monto Total</label>
                        <div className="relative group">
                            <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold transition-colors ${type === 'INCOME' ? 'text-emerald-500' : 'text-rose-500'}`}>$</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                className="w-full pl-12 pr-4 py-4 bg-slate-900 border-2 border-slate-700 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-4xl font-bold text-white tracking-tight transition-all placeholder:text-slate-700"
                                placeholder="0,00"
                                value={displayAmount}
                                onChange={handleAmountChange}
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Category Selection (Chips) */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Categoría</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {filteredCategories.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategoryId(cat.id)}
                                    className={`px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 text-left h-auto min-h-[3.5rem] flex items-center
                                        ${categoryId === cat.id
                                            ? (type === 'INCOME' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm' : 'border-rose-500 bg-rose-500/10 text-rose-400 shadow-sm')
                                            : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600 hover:bg-slate-800'
                                        }`}
                                >
                                    <span className="whitespace-normal leading-tight">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Descripción / Nota</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-white font-medium transition-all placeholder:text-slate-700"
                            placeholder="Ej: Pago cliente mensual..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 text-slate-400 font-semibold hover:bg-slate-700 hover:text-white rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 py-4 text-white rounded-xl font-bold shadow-lg transform transition-all active:scale-95 hover:shadow-xl
                                ${type === 'INCOME' ? 'bg-gradient-to-r from-green-600 to-emerald-700 shadow-emerald-900/40' : 'bg-gradient-to-r from-red-600 to-rose-700 shadow-rose-900/40'}`}
                        >
                            Guardar Movimiento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MovimientoForm;
