import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const ConfigPanel = () => {
    const [meterPrice, setMeterPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchPrice();
    }, []);

    const fetchPrice = async () => {
        try {
            const res = await fetch(`${API_URL}/config/meter_price`);
            if (res.ok) {
                const data = await res.json();
                setMeterPrice(data.value);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/config`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'meter_price', value: meterPrice })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Precio actualizado correctamente.' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: 'Error al actualizar.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Error de conexión.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-md mb-6 border-l-4 border-blue-500">
            <h2 className="text-xl font-bold mb-4 flex items-center text-white">
                <span className="material-icons mr-2">settings</span>
                Configuración Global
            </h2>

            <div className="flex flex-col md:flex-row items-end gap-4">
                <div className="flex-1">
                    <label className="block text-slate-300 text-sm font-bold mb-2">
                        Precio del Metro ($)
                    </label>
                    <input
                        type="number"
                        value={meterPrice}
                        onChange={(e) => setMeterPrice(e.target.value)}
                        className="shadow appearance-none border border-slate-600 bg-slate-900 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-blue-500"
                        placeholder="Ej: 1500"
                    />
                    <p className="text-xs text-slate-500 mt-1">Este valor se usará para calcular los pagos nuevos.</p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-150"
                >
                    {loading ? 'Guardando...' : 'Guardar Precio'}
                </button>
            </div>

            {message && (
                <div className={`mt-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default ConfigPanel;
