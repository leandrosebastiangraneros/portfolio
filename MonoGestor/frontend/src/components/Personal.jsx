import React, { useEffect, useState } from 'react';

const Personal = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newGroupName, setNewGroupName] = useState('');
    const [newEmployeeName, setNewEmployeeName] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState(null);

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

    const fetchGroups = () => {
        setLoading(true);
        fetch('http://localhost:8001/employee-groups')
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
        fetch('http://localhost:8001/stock')
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
        fetch('http://localhost:8001/employee-groups', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newGroupName })
        }).then(() => {
            setNewGroupName('');
            fetchGroups();
        });
    };

    const handleCreateEmployee = (e) => {
        e.preventDefault();
        if (!newEmployeeName || !selectedGroupId) return;
        fetch('http://localhost:8001/employees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newEmployeeName, group_id: selectedGroupId })
        }).then(() => {
            setNewEmployeeName('');
            fetchGroups();
        });
    };

    const handleDeleteEmployee = (id) => {
        if (!window.confirm("¿Eliminar empleado?")) return;
        fetch(`http://localhost:8001/employees/${id}`, { method: 'DELETE' })
            .then(() => fetchGroups());
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
            alert("Ingresa los metros realizados.");
            return;
        }

        fetch(`http://localhost:8001/employees/${empId}/records`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                meters: parseFloat(draft.meters),
                date: draft.date ? new Date(draft.date).toISOString() : null
            })
        })
            .then(res => res.json())
            .then(() => {
                alert("Pago registrado y reflejado en el Dashboard.");
                setDrafts(prev => {
                    const newDrafts = { ...prev };
                    delete newDrafts[empId];
                    return newDrafts;
                });
                fetchGroups();
            })
            .catch(err => alert("Error: " + err));
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

        fetch(`http://localhost:8001/stock/${selectedMaterialId}/use`, {
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
                alert("Uso de material registrado.");
                setUsageModalOpen(false);
                fetchStock();
            })
            .catch(err => alert(err.message));
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

        fetch(`http://localhost:8001/employees/${selectedEmp.id}/advances`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: amount,
                description: advanceDesc
            })
        })
            .then(res => res.json())
            .then(() => {
                alert("Adelanto registrado correctamente.");
                setAdvanceModalOpen(false);
                fetchGroups(); // Refresh data to see advances in calculations
            })
            .catch(err => alert("Error: " + err));
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

                        <div className="overflow-x-auto">
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
                    </div>
                ))}
            </div>

            {/* Modals are unchanged in structure, just added the Advance one */}
            {/* ... Usage Modal (omitted for brevity but kept in code) ... */}
            {usageModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-2">Retiro de Materiales</h2>
                        <form onSubmit={handleRecordUsage} className="space-y-4">
                            <select className="w-full p-3 bg-slate-900 border border-slate-700 text-white rounded-lg outline-none" value={selectedMaterialId} onChange={e => setSelectedMaterialId(e.target.value)} required>
                                <option value="">-- Elige un material --</option>
                                {stock.map(item => <option key={item.id} value={item.id}>{item.name} (Disp: {item.quantity})</option>)}
                            </select>
                            <input type="number" className="w-full p-3 bg-slate-900 border border-slate-700 text-white rounded-lg outline-none" placeholder="Cantidad" value={usageQuantity} onChange={e => setUsageQuantity(e.target.value)} min="0.1" step="0.1" required />
                            <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setUsageModalOpen(false)} className="px-4 py-2 text-slate-400 hover:bg-slate-700 rounded-lg text-sm">Cancelar</button><button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-sm">Confirmar</button></div>
                        </form>
                    </div>
                </div>
            )}

            {/* Advance Modal */}
            {advanceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-700 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-white mb-2">Registrar Adelanto / Vale</h2>
                        <p className="text-sm text-slate-400 mb-6">Empleado: <span className="text-amber-500 font-bold">{selectedEmp?.name}</span></p>

                        <form onSubmit={handleRecordAdvance} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Monto del Adelanto</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-slate-500">$</span>
                                    <input
                                        autoFocus
                                        type="number"
                                        className="w-full p-3 pl-8 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="0.00"
                                        value={advanceAmount}
                                        onChange={e => setAdvanceAmount(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Concepto / Descripción</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                    placeholder="Ej: Vale para comida, Emergencia, etc."
                                    value={advanceDesc}
                                    onChange={e => setAdvanceDesc(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setAdvanceModalOpen(false)} className="px-4 py-2 text-slate-400 hover:bg-slate-700 rounded-lg text-sm">Cancelar</button>
                                <button type="submit" className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-bold text-sm shadow-lg shadow-amber-900/40">Guardar Adelanto</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Employee Modal */}
            {selectedGroupId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-700 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-white mb-4">Añadir Persona al Grupo</h2>
                        <form onSubmit={handleCreateEmployee} className="space-y-4">
                            <input autoFocus type="text" className="w-full p-3 bg-slate-900 border border-slate-700 text-white rounded-lg outline-none" placeholder="Nombre Completo" value={newEmployeeName} onChange={e => setNewEmployeeName(e.target.value)} required />
                            <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setSelectedGroupId(null)} className="px-4 py-2 text-slate-400 hover:bg-slate-700 rounded-lg text-sm">Cancelar</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-sm">Añadir</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Personal;
