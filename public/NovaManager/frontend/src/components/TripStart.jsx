import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useDialog } from '../context/DialogContext';
import { getTodayArgentina } from '../utils/dateUtils';

const TripStart = ({ onSuccess }) => {
    const { showAlert, showConfirm } = useDialog();
    const [loading, setLoading] = useState(false);

    // Form Data
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(getTodayArgentina());

    // Lists
    const [employees, setEmployees] = useState([]);
    const [stockItems, setStockItems] = useState([]);

    // Selection State
    const [selectedEmployees, setSelectedEmployees] = useState({}); // { emp_id: { is_present: true } }
    const [selectedMaterials, setSelectedMaterials] = useState([]); // Array of { stock_item_id, quantity_out }

    useEffect(() => {
        loadData();
    }, [date]);

    const loadData = async () => {
        setLoading(true);
        try {
            // 1. Get Employees + Attendance for date
            const empRes = await fetch(`${API_URL}/employees`);
            const empsData = await empRes.json();

            const attRes = await fetch(`${API_URL}/attendance/${date}`);
            const attData = await attRes.json();

            // Map attendance for quick lookup
            const attMap = {};
            attData.forEach(a => attMap[a.employee_id] = a.is_present);

            // Merge logic
            const mergedEmps = empsData.map(e => ({
                ...e,
                today_present: !!attMap[e.id] // Default false if not checked
            }));

            setEmployees(mergedEmps);

            // 2. Get Stock (Available only)
            const stockRes = await fetch(`${API_URL}/stock`);
            const stockData = await stockRes.json();
            // Filter only AVAILABLE items
            setStockItems(stockData.filter(s => s.status === 'AVAILABLE' && s.quantity > 0));

        } catch (err) {
            console.error(err);
            showAlert("Error cargando datos.", "error");
        } finally {
            setLoading(false);
        }
    };

    const toggleEmployee = (emp) => {
        setSelectedEmployees(prev => {
            const newState = { ...prev };
            if (newState[emp.id]) {
                delete newState[emp.id];
            } else {
                newState[emp.id] = { is_present: true };
            }
            return newState;
        });
    };

    const handleMaterialChange = (stockId, qty) => {
        setSelectedMaterials(prev => {
            const exists = prev.find(m => m.stock_item_id === stockId);
            if (exists) {
                return prev.map(m => m.stock_item_id === stockId ? { ...m, quantity_out: parseFloat(qty) } : m);
            } else {
                return [...prev, { stock_item_id: stockId, quantity_out: parseFloat(qty) }];
            }
        });
    };

    const removeMaterial = (stockId) => {
        setSelectedMaterials(prev => prev.filter(m => m.stock_item_id !== stockId));
    };

    const handleSubmit = async () => {
        if (!description) return showAlert("Falta la descripción del viaje (Camión/Obra)", "warning");
        if (Object.keys(selectedEmployees).length === 0) return showAlert("Debes asignar al menos un chofer/obrero.", "warning");

        const payload = {
            description,
            date,
            employees: Object.keys(selectedEmployees).map(id => ({
                employee_id: parseInt(id),
                is_present: true
            })),
            materials: selectedMaterials.filter(m => m.quantity_out > 0)
        };

        const confirm = await showConfirm(`¿Confirmar salida con ${payload.employees.length} personas y ${payload.materials.length} materiales?`);
        if (!confirm) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/trips`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showAlert("¡Viaje iniciado correctamente!", "success");
                // Reset form or redirect
                setDescription("");
                setSelectedEmployees({});
                setSelectedMaterials([]);
                if (onSuccess) onSuccess();
            } else {
                showAlert("Error al crear viaje.", "error");
            }
        } catch (err) {
            showAlert("Error de conexión.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* Header Form */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="material-icons mr-2 text-blue-400">local_shipping</span>
                    Nueva Hoja de Ruta (Salida)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-slate-400 text-sm mb-1 block">Fecha</label>
                        <input
                            type="date"
                            className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-slate-400 text-sm mb-1 block">Vehículo / Obra</label>
                        <input
                            type="text"
                            placeholder="Ej: Camión Blanco - Barrio Norte"
                            className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-600"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Cuadrilla Selector (Mobile Friendly) */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
                    <h3 className="font-bold text-gray-800 mb-4 flex justify-between items-center">
                        <span>1. Seleccionar Cuadrilla</span>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {Object.keys(selectedEmployees).length} Asignados
                        </span>
                    </h3>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {employees.map(emp => {
                            const isSelected = !!selectedEmployees[emp.id];
                            const isAbsent = !emp.today_present; // Variable from Step 2 Check-in

                            return (
                                <div
                                    key={emp.id}
                                    onClick={() => toggleEmployee(emp)}
                                    className={`
                                        p-4 rounded-lg border-2 cursor-pointer transition-all active:scale-95 flex items-center justify-between
                                        ${isSelected
                                            ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.01]'
                                            : 'border-slate-200 hover:border-blue-300'}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${emp.today_present ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <div>
                                            <p className={`font-bold ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>{emp.name}</p>
                                            {isAbsent && (
                                                <p className="text-xs text-red-600 flex items-center mt-1 font-bold">
                                                    <span className="material-icons text-[12px] mr-1">warning</span>
                                                    AUSENTE HOY
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {isSelected && <span className="material-icons text-blue-600">check_circle</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Material Selector */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                    <h3 className="font-bold text-gray-800 mb-4">2. Cargar Materiales</h3>

                    {/* Add Item Row */}
                    <div className="mb-6 space-y-4">
                        {stockItems.map(item => {
                            // Check if selected
                            const inList = selectedMaterials.find(m => m.stock_item_id === item.id);

                            return (
                                <div key={item.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-700">{item.name}</p>
                                        <p className="text-xs text-gray-500">Disp: {item.quantity}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {inList ? (
                                            <>
                                                <input
                                                    type="number"
                                                    className="w-20 p-2 border border-blue-300 rounded text-center text-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                    value={inList.quantity_out}
                                                    onChange={(e) => handleMaterialChange(item.id, e.target.value)}
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => removeMaterial(item.id)}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                                >
                                                    <span className="material-icons">delete</span>
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleMaterialChange(item.id, 1)}
                                                className="bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm font-bold hover:bg-orange-200"
                                            >
                                                + Cargar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>

            {/* Action Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-700 p-4 md:relative md:bg-transparent md:border-0 md:p-0 z-40">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                    {loading ? (
                        <span>Procesando...</span>
                    ) : (
                        <>
                            <span className="material-icons">rocket_launch</span>
                            INICIAR VIAJE
                        </>
                    )}
                </button>
            </div>

            {/* Spacer for fixed bottom bar on mobile */}
            <div className="h-24 md:hidden"></div>

        </div>
    );
};

export default TripStart;
