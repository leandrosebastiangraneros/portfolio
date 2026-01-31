import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useDialog } from '../context/DialogContext';
import { formatDateDisplay } from '../utils/dateUtils';

const ActiveTrips = () => {
    const { showAlert, showConfirm } = useDialog();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);

    // Config Price for Estimation
    const [meterPrice, setMeterPrice] = useState(0);

    // Editing State (Closing a Trip)
    const [editingTrip, setEditingTrip] = useState(null);
    const [returnMaterials, setReturnMaterials] = useState({}); // { trip_mat_id: returned_qty }
    const [production, setProduction] = useState({}); // { trip_emp_id: meters }

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/trips`);
            const allTrips = await res.json();
            // Filter OPEN trips
            setTrips(allTrips.filter(t => t.status === 'OPEN'));

            // Get Price for estimation
            const priceRes = await fetch(`${API_URL}/config/meter_price`);
            const priceData = await priceRes.json();
            setMeterPrice(parseFloat(priceData.value || 0));

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const [activeTab, setActiveTab] = useState('materials'); // 'materials' | 'progress'

    const handleOpenCloseForm = (trip) => {
        setEditingTrip(trip);
        setActiveTab('materials'); // Default tab
        // Initialize state
        const initialMats = {};
        trip.materials.forEach(m => initialMats[m.id] = m.quantity_returned || 0); // Load existing returned if any? DB doesn't store partials well yet, usually 0.
        setReturnMaterials(initialMats);

        const initialProd = {};
        trip.assignments.forEach(a => initialProd[a.id] = a.meters_done || 0); // Load current meters
        setProduction(initialProd);
    };

    const handleSaveProgress = async () => {
        const payload = {
            employees: Object.entries(production).map(([id, meters]) => ({
                id: parseInt(id),
                meters_done: parseFloat(meters || 0)
            })),
            materials: [] // No material updates in progress save for now
        };

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/trips/${editingTrip.id}/progress`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showAlert("Avance guardado correctamente.", "success");
                // Don't close modal, just refresh data? 
                // Better: Refresh background data but keep working.
                loadData();
            } else {
                showAlert("Error al guardar avance.", "error");
            }
        } catch (err) {
            showAlert("Error de conexión.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitClose = async () => {
        const confirm = await showConfirm("¿Estás seguro de cerrar esta planilla? Esto actualizará el stock y guardará la producción.");
        if (!confirm) return;

        const payload = {
            materials: Object.entries(returnMaterials).map(([id, qty]) => ({
                id: parseInt(id),
                quantity_returned: parseFloat(qty || 0)
            })),
            employees: Object.entries(production).map(([id, meters]) => ({
                id: parseInt(id),
                meters_done: parseFloat(meters || 0)
            }))
        };

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/trips/${editingTrip.id}/close`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showAlert("Planilla cerrada y procesada correctamente.", "success");
                setEditingTrip(null);
                loadData(); // Refresh list
            } else {
                showAlert("Error al cerrar planilla.", "error");
            }
        } catch (err) {
            showAlert("Error de conexión.", "error");
        } finally {
            setLoading(false);
        }
    };

    const calculateEstimate = (meters) => {
        return (parseFloat(meters || 0) * meterPrice).toFixed(0);
    };

    if (loading && !editingTrip) return <div className="p-4 text-center text-slate-400">Cargando salidas...</div>;

    if (editingTrip) {
        return (
            <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700 animate-fade-in-up">
                <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg">Gestionar Salida: {editingTrip.description}</h3>
                    <button onClick={() => setEditingTrip(null)} className="text-white hover:bg-indigo-700 p-2 rounded-full">
                        <span className="material-icons">close</span>
                    </button>
                </div>

                {/* TABS HEADER */}
                <div className="flex border-b border-slate-700 bg-slate-900/50">
                    <button
                        onClick={() => setActiveTab('materials')}
                        className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'materials' ? 'text-orange-400 border-b-2 border-orange-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Materiales y Stock
                    </button>
                    <button
                        onClick={() => setActiveTab('progress')}
                        className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'progress' ? 'text-green-400 border-b-2 border-green-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Producción (Avance)
                    </button>
                </div>

                <div className="p-6 space-y-6">

                    {/* TAB 1: MATERIALS */}
                    {activeTab === 'materials' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="border border-orange-700/50 rounded-lg bg-orange-900/10 p-4">
                                <h4 className="font-bold text-orange-400 mb-3 flex items-center">
                                    <span className="material-icons mr-2">inventory_2</span>
                                    Control de Stock (Devoluciones)
                                </h4>
                                <div className="space-y-3">
                                    {editingTrip.materials.map(mat => (
                                        <div key={mat.id} className="flex items-center justify-between bg-slate-900 p-3 rounded border border-slate-700 shadow-sm">
                                            <div>
                                                <div className="font-bold text-slate-200">Material (ID: {mat.stock_item_id})</div>
                                                <div className="text-xs text-slate-500">Llevado: <span className="font-bold text-white">{mat.quantity_out}</span></div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-slate-400">Devuelto:</label>
                                                <input
                                                    type="number"
                                                    className="w-24 p-2 border border-slate-600 bg-slate-800 rounded text-center text-lg font-bold text-orange-400 focus:ring-2 focus:ring-orange-500 outline-none"
                                                    value={returnMaterials[mat.id] || ''}
                                                    onChange={(e) => setReturnMaterials({ ...returnMaterials, [mat.id]: e.target.value })}
                                                    min="0"
                                                    max={mat.quantity_out}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {editingTrip.materials.length === 0 && <p className="text-sm text-slate-500 italic">No se llevaron materiales.</p>}
                                </div>
                            </div>

                            <button
                                onClick={handleSubmitClose}
                                className="w-full bg-slate-700 hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 border border-slate-600 hover:border-red-500"
                            >
                                FINALIZAR Y CERRAR
                            </button>
                        </div>
                    )}

                    {/* TAB 2: PROGRESS */}
                    {activeTab === 'progress' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="border border-green-700/50 rounded-lg bg-green-900/10 p-4">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                                    <h4 className="font-bold text-green-400 flex items-center">
                                        <span className="material-icons mr-2">engineering</span>
                                        Producción (Metros)
                                    </h4>
                                    {/* Bulk Input Tool */}
                                    <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-700">
                                        <span className="text-xs text-slate-400 font-bold px-2 uppercase">Carga Cuadrilla:</span>
                                        <input
                                            type="number"
                                            className="w-20 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:border-green-500 outline-none"
                                            placeholder="Total"
                                            id="bulkMetersInput"
                                        />
                                        <button
                                            onClick={() => {
                                                const val = document.getElementById('bulkMetersInput').value;
                                                if (!val) return;
                                                const meters = parseFloat(val);
                                                const count = editingTrip.assignments.length;
                                                if (count === 0) return;

                                                const newProd = {};
                                                editingTrip.assignments.forEach(a => newProd[a.id] = meters);
                                                setProduction(newProd);
                                            }}
                                            className="bg-green-600 hover:bg-green-500 text-white text-xs px-2 py-1 rounded font-bold transition-colors"
                                            title="Asignar a TODOS"
                                        >
                                            Todos
                                        </button>
                                        <button
                                            onClick={() => {
                                                const val = document.getElementById('bulkMetersInput').value;
                                                if (!val) return;
                                                const total = parseFloat(val);
                                                const count = editingTrip.assignments.length;
                                                if (count === 0) return;

                                                const perPerson = (total / count).toFixed(2);
                                                const newProd = {};
                                                editingTrip.assignments.forEach(a => newProd[a.id] = perPerson);
                                                setProduction(newProd);
                                            }}
                                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-2 py-1 rounded font-bold transition-colors"
                                            title="Dividir entre TODOS"
                                        >
                                            Dividir
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {editingTrip.assignments.map(assign => (
                                        <div key={assign.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 p-3 rounded border border-slate-700 shadow-sm gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center text-green-400 font-bold border border-green-700">
                                                    {assign.employee_id}
                                                </div>
                                                <span className="font-medium text-slate-200">Operario #{assign.employee_id}</span>
                                            </div>

                                            <div className="flex items-center gap-4 justify-end w-full sm:w-auto">
                                                <div className="text-right hidden sm:block">
                                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Est. Ganancia</div>
                                                    <div className="font-mono text-green-400 font-bold">${calculateEstimate(production[assign.id])}</div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        className="w-24 p-2 border border-slate-600 bg-slate-800 rounded text-center text-lg font-mono text-white focus:ring-2 focus:ring-green-500 outline-none"
                                                        placeholder="0.0"
                                                        value={production[assign.id] || ''}
                                                        onChange={(e) => setProduction({ ...production, [assign.id]: e.target.value })}
                                                    />
                                                    <span className="text-slate-500 font-bold">m</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleSaveProgress}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2"
                                >
                                    <span className="material-icons">save</span>
                                    GUARDAR AVANCE
                                </button>
                                <button
                                    onClick={handleSubmitClose}
                                    className="flex-1 bg-slate-700 hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 border border-slate-600 hover:border-red-500"
                                >
                                    FINALIZAR
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                Viajes en Curso ({trips.length})
            </h3>

            {trips.length === 0 ? (
                <div className="p-8 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed text-center text-slate-500">
                    No hay salidas activas en este momento.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trips.map(trip => (
                        <div key={trip.id} className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-slate-500 transition-colors shadow-lg group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-white text-lg">{trip.description}</h4>
                                    <p className="text-slate-400 text-sm">
                                        {formatDateDisplay(trip.date)}
                                    </p>
                                </div>
                                <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded border border-blue-700">EN CURSO</span>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center text-slate-400 text-sm">
                                    <span className="material-icons text-base mr-2">groups</span>
                                    {trip.assignments.length} Operarios
                                </div>
                                <div className="flex items-center text-slate-400 text-sm">
                                    <span className="material-icons text-base mr-2">category</span>
                                    {trip.materials.length} Materiales
                                </div>
                            </div>

                            <button
                                onClick={() => handleOpenCloseForm(trip)}
                                className="w-full bg-slate-700 group-hover:bg-indigo-600 text-white py-2 rounded font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-icons text-sm">edit_note</span>
                                Gestionar Retorno
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActiveTrips;
