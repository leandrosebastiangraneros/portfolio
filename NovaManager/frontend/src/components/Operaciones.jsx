import React, { useState } from 'react';
import Attendance from './Attendance';
import ActiveTrips from './ActiveTrips';
import TripStart from './TripStart';
import SystemConfig from './SystemConfig';

const Operaciones = () => {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'new_trip'
    const [showConfig, setShowConfig] = useState(false);

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-white mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        Operaciones Diarias
                        <button
                            onClick={() => setShowConfig(true)}
                            className="text-slate-500 hover:text-indigo-400 transition-colors"
                            title="Configurar Precio del Metro"
                        >
                            <span className="material-icons text-xl">settings</span>
                        </button>
                    </h1>
                    <p className="text-slate-400">Gestión de asistencias y salidas de camiones.</p>
                </div>

                {viewMode === 'list' && (
                    <button
                        onClick={() => setViewMode('new_trip')}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-900/20 transition-all active:scale-95"
                    >
                        <span className="material-icons">local_shipping</span>
                        Agregar Salida (Camión)
                    </button>
                )}

                {viewMode === 'new_trip' && (
                    <button
                        onClick={() => setViewMode('list')}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
                    >
                        <span className="material-icons">arrow_back</span>
                        Volver al Listado
                    </button>
                )}
            </header>

            {/* Config Modal */}
            {showConfig && <SystemConfig onClose={() => setShowConfig(false)} />}

            {viewMode === 'list' ? (
                <div className="flex flex-col gap-8">
                    {/* Panel de Asistencia */}
                    <div className="w-full">
                        <Attendance />
                    </div>

                    {/* Panel de Viajes Activos */}
                    <div className="w-full">
                        <ActiveTrips />
                    </div>
                </div>
            ) : (
                <div className="w-full animate-fade-in-up">
                    <TripStart onSuccess={() => setViewMode('list')} />
                </div>
            )}
        </div>
    );
};

export default Operaciones;
