import React, { useState } from 'react';
import { useDialog } from '../context/DialogContext';
import { API_URL } from '../config';

const Configuracion = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { showAlert, showConfirm } = useDialog();

    const handleReset = async () => {
        const firstConfirm = await showConfirm(
            "¡ATENCIÓN! Esto eliminará TODOS los movimientos, el stock y las categorías personalizadas. No se puede deshacer. ¿Estás seguro?",
            "¡PELIGRO: Reinicio de Base de Datos!"
        );
        if (!firstConfirm) return;

        const secondConfirm = await showConfirm(
            "¿Seguro, seguro? Esta es la última advertencia. Se borrará TODO.",
            "Confirmación Final"
        );
        if (!secondConfirm) return;

        setLoading(true);
        fetch(`${API_URL}/reset-db`, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                setMessage(data.message);
                setLoading(false);
                showAlert("Base de datos reiniciada. La aplicación se recargará...", "success");
                setTimeout(() => window.location.reload(), 2000);
            })
            .catch(err => {
                console.error("Error resetting:", err);
                setLoading(false);
                showAlert("Error al reiniciar la base de datos.", "error");
            });
    };

    return (
        <div className="space-y-6">
            <header className="text-white">
                <h1 className="text-3xl font-bold">Configuración</h1>
                <p className="text-slate-400">Ajustes generales del sistema.</p>
            </header>

            <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-8">
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Zona de Peligro
                    </h2>
                    <p className="text-slate-400">
                        Estas acciones pueden borrar datos permanentemente. Úsalas con extrema precaución.
                    </p>

                    <div className="pt-4 border-t border-slate-700">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-slate-200">Reiniciar Base de Datos</h3>
                                <p className="text-sm text-slate-500">Elimina todos los registros de la aplicación para empezar de cero.</p>
                            </div>
                            <button
                                onClick={handleReset}
                                disabled={loading}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-6 py-3 rounded-lg font-bold transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'Reiniciando...' : 'Borrar Todo y Reiniciar'}
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-8">
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Información del Sistema
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                            <span className="text-slate-500 block">Versión</span>
                            <span className="font-mono text-slate-300">v1.0.0</span>
                        </div>
                        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                            <span className="text-slate-500 block">Backend Status</span>
                            <span className="text-green-500 font-bold">Online (Puerto 8001)</span>
                        </div>
                        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                            <span className="text-slate-500 block">Base de Datos</span>
                            <span className="text-slate-300">SQLite (Local)</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Configuracion;
