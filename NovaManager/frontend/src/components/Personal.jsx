import React, { useEffect, useState } from 'react';
import { useDialog } from '../context/DialogContext';
import { API_URL } from '../config';
import WorkerProfile from './WorkerProfile';

const Personal = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newGroupName, setNewGroupName] = useState('');
    const [newEmployeeName, setNewEmployeeName] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState(null);

    const { showAlert, showConfirm } = useDialog();

    // Stock for withdrawal
    const [stock, setStock] = useState([]);
    const [usageModalOpen, setUsageModalOpen] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [selectedMaterialId, setSelectedMaterialId] = useState('');
    const [usageQuantity, setUsageQuantity] = useState('1');

    // Advances state
    const [advanceModalOpen, setAdvanceModalOpen] = useState(false);
    const [advanceAmount, setAdvanceAmount] = useState('');
    const [advanceDesc, setAdvanceDesc] = useState('');

    // Draft state for "Excel-like" entries
    const [drafts, setDrafts] = useState({}); // { employeeId: { meters: '', date: '' } }

    // History state
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [selectedHistoryEmp, setSelectedHistoryEmp] = useState(null);
    const [historyData, setHistoryData] = useState(null);
    const [activeTab, setActiveTab] = useState('PAYMENTS'); // PAYMENTS, ADVANCES, MATERIALS

    const fetchGroups = () => {
        setLoading(true);
        fetch(`${API_URL}/employee-groups`)
            .then(res => res.json())
            .then(data => {
                setGroups(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error personal:", err);
                setLoading(false);
            });
    };

    const fetchStock = () => {
        fetch(`${API_URL}/stock`)
            .then(res => res.json())
            .then(data => setStock(data.filter(i => i.quantity > 0)))
            .catch(err => console.error("Error stock:", err));
    };

    useEffect(() => {
        fetchGroups();
        fetchStock();
    }, []);

    const handleCreateGroup = (e) => {
        e.preventDefault();
        if (!newGroupName) return;
        fetch(`${API_URL}/employee-groups`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newGroupName })
        }).then(() => {
            setNewGroupName('');
            fetchGroups();
            showAlert("Grupo creado", "success");
        });
    };

    const handleCreateEmployee = (e) => {
        e.preventDefault();
        if (!newEmployeeName || !selectedGroupId) return;
        fetch(`${API_URL}/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newEmployeeName, group_id: selectedGroupId })
        }).then(() => {
            setNewEmployeeName('');
            fetchGroups();
            showAlert("Empleado agregado", "success");
        });
    };

    const handleDeleteEmployee = async (id) => {
        const confirmed = await showConfirm("¿Seguro que deseas eliminar a este empleado?");
        if (!confirmed) return;

        fetch(`${API_URL}/employees/${id}`, { method: 'DELETE' })
            .then(() => {
                fetchGroups();
                showAlert("Empleado eliminado", "success");
            });
    };

    const handleDraftChange = (empId, field, value) => {
        setDrafts(prev => ({
            ...prev,
            [empId]: {
                ...(prev[empId] || { meters: '0', date: new Date().toISOString().split('T')[0] }),
                [field]: value
            }
        }));
    };

    const handleSetToday = (empId) => {
        handleDraftChange(empId, 'date', new Date().toISOString().split('T')[0]);
    };

    const handlePay = (empId) => {
        const draft = drafts[empId];
        if (!draft || !draft.meters || draft.meters <= 0) {
            showAlert("Ingresa los metros realizados.", "error");
            return;
        }

        fetch(`${API_URL}/employees/${empId}/records`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                meters: parseFloat(draft.meters),
                date: draft.date ? new Date(draft.date).toISOString() : null
            })
        })
            .then(res => res.json())
            .then(() => {
                showAlert("Pago registrado y reflejado en el Dashboard.", "success");
                setDrafts(prev => {
                    const newDrafts = { ...prev };
                    delete newDrafts[empId];
                    return newDrafts;
                });
                fetchGroups();
            })
            .catch(err => showAlert("Error: " + err, "error"));
    };

    const handleOpenUsage = (emp) => {
        setSelectedEmp(emp);
        setSelectedMaterialId('');
        setUsageQuantity('1');
        setUsageModalOpen(true);
        fetchStock();
    };

    const handleRecordUsage = (e) => {
        e.preventDefault();
        if (!selectedMaterialId || !usageQuantity) return;

        fetch(`${API_URL}/stock/${selectedMaterialId}/use`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                employee_id: selectedEmp.id,
                quantity: parseFloat(usageQuantity),
                description: `Retirado por ${selectedEmp.name}`
            })
        })
            .then(res => {
                if (!res.ok) throw new Error("Stock insuficiente o error");
                return res.json();
            })
            .then(() => {
                showAlert("Uso de material registrado.", "success");
                setUsageModalOpen(false);
                fetchStock();
            })
            .catch(err => showAlert(err.message, "error"));
    };

    const handleOpenAdvance = (emp) => {
        setSelectedEmp(emp);
        setAdvanceAmount('');
        setAdvanceDesc('');
        setAdvanceModalOpen(true);
    };

    const handleRecordAdvance = (e) => {
        e.preventDefault();
        const amount = parseFloat(advanceAmount);
        if (isNaN(amount) || amount <= 0) return;

        fetch(`${API_URL}/employees/${selectedEmp.id}/advances`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: amount,
                description: advanceDesc
            })
        })
            .then(res => res.json())
            .then(() => {
                showAlert("Adelanto registrado correctamente.", "success");
                setAdvanceModalOpen(false);
                fetchGroups(); // Refresh data to see advances in calculations
            })
            .catch(err => showAlert("Error: " + err, "error"));
    };

    const handleOpenHistory = (emp) => {
        setSelectedHistoryEmp(emp);
        setHistoryModalOpen(true);
        setActiveTab('PAYMENTS');
        setHistoryData(null);

        fetch(`${API_URL}/employees/${emp.id}/history`)
            .then(res => res.json())
            .then(data => setHistoryData(data))
            .catch(err => console.error("Error fetching history:", err));
    };

    const formatMoney = (val) => val.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

    if (loading) return <div className="p-8 text-center text-slate-500">Cargando personal...</div>;

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Personal</h1>
                    <p className="text-slate-400">Control de producción, adelantos y materiales.</p>
                </div>

                <form onSubmit={handleCreateGroup} className="flex gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Nuevo Grupo"
                        className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
                        value={newGroupName}
                        onChange={e => setNewGroupName(e.target.value)}
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all">Crear Grupo</button>
                </form>
            </header>

            <div className="space-y-10">
                {groups.map(group => (
                    <div key={group.id} className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 overflow-hidden">
                        <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-200">📦 {group.name}</h2>
                            <button onClick={() => setSelectedGroupId(group.id)} className="text-blue-400 text-sm font-bold hover:text-blue-300">
                                + Agregar Persona
                            </button>
                        </div>

                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-xs uppercase text-slate-500 bg-slate-900/30">
                                    <tr>
                                        <th className="p-4">Nombre</th>
                                        <th className="p-4">Fecha</th>
                                        <th className="p-4">Metros</th>
                                        <th className="p-4">Adelantos</th>
                                        <th className="p-4 font-bold">A Pagar (Neto)</th>
                                        <th className="p-4 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {group.employees.map(emp => {
                                        const draft = drafts[emp.id] || { meters: '', date: new Date().toISOString().split('T')[0] };
                                        const pendingAdvances = emp.advances?.filter(a => !a.is_settled).reduce((sum, a) => sum + a.amount, 0) || 0;
                                        const grossTotal = (parseFloat(draft.meters) || 0) * 100000;
                                        const netTotal = Math.max(0, grossTotal - pendingAdvances);

                                        return (
                                            <tr key={emp.id} className="hover:bg-slate-700/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-semibold text-slate-300">{emp.name}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-1">
                                                        <input
                                                            type="date"
                                                            className="p-1 bg-slate-900 border border-slate-600 rounded text-xs text-slate-300 outline-none"
                                                            value={draft.date}
                                                            onChange={e => handleDraftChange(emp.id, 'date', e.target.value)}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-1">
                                                        <input
                                                            type="number"
                                                            className="w-16 p-1 bg-slate-900 border border-slate-600 rounded text-sm text-white font-mono outline-none"
                                                            value={draft.meters}
                                                            onChange={e => handleDraftChange(emp.id, 'meters', e.target.value)}
                                                        />
                                                        <span className="text-xs text-slate-500">m</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-amber-500 font-mono text-sm">
                                                    {pendingAdvances > 0 ? `-${formatMoney(pendingAdvances)}` : '-'}
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-green-500">{formatMoney(netTotal)}</div>
                                                    {pendingAdvances > 0 && <div className="text-[10px] text-slate-500 uppercase">Bruto: {formatMoney(grossTotal)}</div>}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button onClick={() => handleOpenHistory(emp)} className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white px-2 py-1 rounded text-[10px] font-bold uppercase transition-all" title="Ver Historial">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                        </button>
                                                        <button onClick={() => handleOpenUsage(emp)} className="bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded text-[10px] font-bold uppercase transition-all">Materiales</button>
                                                        <button onClick={() => handleOpenAdvance(emp)} className="bg-amber-600/10 hover:bg-amber-600 text-amber-500 hover:text-white px-2 py-1 rounded text-[10px] font-bold uppercase border border-amber-600/30 transition-all">Adelantos</button>
                                                        <button onClick={() => handlePay(emp.id)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold shadow-md transition-all">Pagar</button>
                                                        <button onClick={() => handleDeleteEmployee(emp.id)} className="text-slate-500 hover:text-red-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards View */}
                        <div className="md:hidden space-y-4 p-4">
                            {group.employees.map(emp => {
                                const draft = drafts[emp.id] || { meters: '', date: new Date().toISOString().split('T')[0] };
                                const pendingAdvances = emp.advances?.filter(a => !a.is_settled).reduce((sum, a) => sum + a.amount, 0) || 0;
                                const grossTotal = (parseFloat(draft.meters) || 0) * 100000;
                                const netTotal = Math.max(0, grossTotal - pendingAdvances);

                                return (
                                    <div key={emp.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 relative">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="font-bold text-white text-lg">{emp.name}</div>
                                            <input
                                                type="date"
                                                className="p-1 bg-slate-900 border border-slate-600 rounded text-xs text-slate-300 outline-none w-24"
                                                value={draft.date}
                                                onChange={e => handleDraftChange(emp.id, 'date', e.target.value)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Metros Realizados</label>
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="number"
                                                        className="w-full p-2 bg-slate-800 border border-slate-600 rounded text-white font-mono outline-none focus:border-blue-500 transition-colors"
                                                        placeholder="0"
                                                        value={draft.meters}
                                                        onChange={e => handleDraftChange(emp.id, 'meters', e.target.value)}
                                                    />
                                                    <span className="text-sm text-slate-500">m</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Neto a Pagar</label>
                                                <div className="font-bold text-green-500 text-xl">{formatMoney(netTotal)}</div>
                                            </div>
                                        </div>

                                        {pendingAdvances > 0 && (
                                            <div className="bg-amber-500/10 p-2 rounded mb-4 text-xs flex justify-between border border-amber-500/20">
                                                <span className="text-amber-500">Adelantos Pendientes</span>
                                                <span className="text-amber-400 font-bold">-{formatMoney(pendingAdvances)}</span>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-5 gap-2 mt-4">
                                            <button onClick={() => handleOpenHistory(emp)} className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white py-2 rounded-lg text-[10px] font-bold uppercase transition-all flex flex-col items-center justify-center gap-1">
                                                <span>📋</span>
                                                <span>Hist.</span>
                                            </button>
                                            <button onClick={() => handleOpenUsage(emp)} className="bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-[10px] font-bold uppercase transition-all flex flex-col items-center justify-center gap-1">
                                                <span>🛠️</span>
                                                <span>Mat.</span>
                                            </button>
                                            <button onClick={() => handleOpenAdvance(emp)} className="bg-amber-600/10 hover:bg-amber-600 text-amber-500 hover:text-white py-2 rounded-lg text-[10px] font-bold uppercase border border-amber-600/30 transition-all flex flex-col items-center justify-center gap-1">
                                                <span>💸</span>
                                                <span>Adel.</span>
                                            </button>
                                            <button onClick={() => handlePay(emp.id)} className="col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-bold shadow-lg shadow-green-900/40 transition-all">
                                                CONFIRMAR PAGO
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteEmployee(emp.id)}
                                            className="absolute -top-2 -right-2 bg-slate-800 text-slate-500 hover:text-red-400 p-1.5 rounded-full border border-slate-700 shadow-sm"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals are unchanged in structure, just added the Advance one */}
            {/* ... Usage Modal (omitted for brevity but kept in code) ... */}
            {/* Usage Modal */}
            {usageModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 transition-opacity">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-700 animate-in fade-in zoom-in duration-200">
                        <div className="p-6 text-white flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-700">
                            <h2 className="text-xl font-bold tracking-tight">Retiro de Materiales</h2>
                            <button onClick={() => setUsageModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleRecordUsage} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Material</label>
                                <select
                                    className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-white font-medium transition-all"
                                    value={selectedMaterialId}
                                    onChange={e => setSelectedMaterialId(e.target.value)}
                                    required
                                >
                                    <option value="">-- Elige un material --</option>
                                    {stock.map(item => <option key={item.id} value={item.id}>{item.name} (Disp: {item.quantity})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Cantidad a Retirar</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-white font-medium transition-all placeholder:text-slate-700"
                                    placeholder="Cantidad"
                                    value={usageQuantity}
                                    onChange={e => setUsageQuantity(e.target.value)}
                                    min="0.1"
                                    step="0.1"
                                    required
                                />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setUsageModalOpen(false)} className="flex-1 py-3 text-slate-400 font-semibold hover:bg-slate-700 hover:text-white rounded-xl transition-colors">Cancelar</button>
                                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-900/40 transform transition-all active:scale-95 hover:shadow-xl">Confirmar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Advance Modal */}
            {advanceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 transition-opacity">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-700 animate-in fade-in zoom-in duration-200">
                        <div className="p-6 text-white flex justify-between items-center bg-gradient-to-r from-amber-600 to-orange-700">
                            <h2 className="text-xl font-bold tracking-tight">Registrar Adelanto / Vale</h2>
                            <button onClick={() => setAdvanceModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-700">
                            <p className="text-sm text-slate-400">Empleado: <span className="text-amber-500 font-bold text-lg ml-2">{selectedEmp?.name}</span></p>
                        </div>

                        <form onSubmit={handleRecordAdvance} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Monto del Adelanto</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 font-bold text-xl">$</span>
                                    <input
                                        autoFocus
                                        type="number"
                                        className="w-full pl-10 pr-4 py-4 bg-slate-900 border-2 border-slate-700 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none text-2xl font-bold text-white tracking-tight transition-all placeholder:text-slate-700"
                                        placeholder="0.00"
                                        value={advanceAmount}
                                        onChange={e => setAdvanceAmount(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Concepto / Descripción</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none text-white font-medium transition-all placeholder:text-slate-700"
                                    placeholder="Ej: Vale para comida, Emergencia..."
                                    value={advanceDesc}
                                    onChange={e => setAdvanceDesc(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setAdvanceModalOpen(false)} className="flex-1 py-3 text-slate-400 font-semibold hover:bg-slate-700 hover:text-white rounded-xl transition-colors">Cancelar</button>
                                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-xl font-bold shadow-lg shadow-amber-900/40 transform transition-all active:scale-95 hover:shadow-xl">Guardar Adelanto</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Employee Modal */}
            {selectedGroupId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 transition-opacity">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-700 animate-in fade-in zoom-in duration-200">
                        <div className="p-6 text-white flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-700">
                            <h2 className="text-xl font-bold tracking-tight">Añadir Persona al Grupo</h2>
                            <button onClick={() => setSelectedGroupId(null)} className="text-white/80 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleCreateEmployee} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Nombre Completo</label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-white font-medium transition-all placeholder:text-slate-700"
                                    placeholder="Ej: Juan Pérez"
                                    value={newEmployeeName}
                                    onChange={e => setNewEmployeeName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setSelectedGroupId(null)} className="flex-1 py-3 text-slate-400 font-semibold hover:bg-slate-700 hover:text-white rounded-xl transition-colors">Cancelar</button>
                                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-900/40 transform transition-all active:scale-95 hover:shadow-xl">Añadir Persona</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Worker Profile 360 Modal */}
            {historyModalOpen && selectedHistoryEmp && (
                <WorkerProfile
                    employeeId={selectedHistoryEmp.id}
                    onClose={() => setHistoryModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Personal;
