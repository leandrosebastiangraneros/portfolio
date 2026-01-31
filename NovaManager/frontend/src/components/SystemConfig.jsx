import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useDialog } from '../context/DialogContext';

const SystemConfig = ({ onClose }) => {
    const { showAlert } = useDialog();
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const res = await fetch(`${API_URL}/config/meter_price`);
            const data = await res.json();
            setPrice(data.value);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!price || isNaN(price)) {
            showAlert("Ingrese un valor válido", "error");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/config`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'meter_price', value: String(price) })
            });

            if (res.ok) {
                showAlert("Precio actualizado correctamente", "success");
                onClose();
            } else {
                showAlert("Error al actualizar", "error");
            }
        } catch (err) {
            showAlert("Error de conexión", "error");
        }
    };

    if (loading) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-900 w-full max-w-sm rounded-2xl border border-slate-700 shadow-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="material-icons text-indigo-400">settings</span>
                    Configuración Global
                </h3>

                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6">
                    <label className="block text-xs uppercase font-bold text-slate-500 mb-2">
                        Precio por Metro ($)
                    </label>
                    <input
                        type="number"
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white font-mono text-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        Este valor se usará para calcular las ganancias de las nuevas salidas y cierres.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 text-slate-400 hover:text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemConfig;
