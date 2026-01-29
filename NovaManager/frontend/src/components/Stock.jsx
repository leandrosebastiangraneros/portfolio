import React, { useEffect, useState } from 'react';
import { useDialog } from '../context/DialogContext';
import { API_URL } from '../config';

const Stock = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showAlert } = useDialog();

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Form State for Add
    const [newItemName, setNewItemName] = useState('');
    const [newItemCost, setNewItemCost] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('1');

    // Form State for Sell
    const [sellPriceUnit, setSellPriceUnit] = useState('');
    const [sellQuantity, setSellQuantity] = useState('1');
    const [workDesc, setWorkDesc] = useState('');

    const fetchStock = () => {
        setLoading(true);
        fetch(`${API_URL}/stock`)
            .then(res => res.json())
            .then(data => {
                setItems(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error stock:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchStock();
    }, []);

    const handleAddSubmit = (e) => {
        e.preventDefault();
        const cost = parseFloat(newItemCost);
        const qty = parseFloat(newItemQuantity);
        if (!newItemName || isNaN(cost) || isNaN(qty)) {
            showAlert("Por favor completa todos los campos correctamente.", "error");
            return;
        }

        fetch(`${API_URL}/stock`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newItemName, cost_amount: cost, initial_quantity: qty })
        })
            .then(res => {
                if (!res.ok) return res.json().then(err => { throw new Error(err.detail || "Error al guardar") });
                return res.json();
            })
            .then(() => {
                fetchStock();
                setIsAddModalOpen(false);
                setNewItemName('');
                setNewItemCost('');
                setNewItemQuantity('1');
                showAlert("Material agregado correctamente", "success");
            })
            .catch(err => {
                console.error("Error adding stock:", err);
                showAlert("Error: " + err.message, "error");
            });
    };

    const handleSellClick = (item) => {
        setSelectedItem(item);
        setSellPriceUnit('');
        setSellQuantity('1');
        setWorkDesc('');
        setIsSellModalOpen(true);
    };

    const handleSellSubmit = (e) => {
        e.preventDefault();
        const priceUnit = parseFloat(sellPriceUnit);
        const qty = parseFloat(sellQuantity);
        if (!workDesc || isNaN(priceUnit) || isNaN(qty)) {
            showAlert("Completa todos los campos", "error");
            return;
        }

        if (qty > selectedItem.quantity) {
            showAlert("No hay suficiente stock.", "error");
            return;
        }

        fetch(`${API_URL}/stock/${selectedItem.id}/sell`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sale_price_unit: priceUnit, quantity: qty, work_description: workDesc })
        })
            .then(res => {
                if (!res.ok) throw new Error("Error selling");
                return res.json();
            })
            .then(() => {
                fetchStock();
                setIsSellModalOpen(false);
                showAlert("Venta registrada con éxito", "success");
            })
            .catch(err => showAlert(err.message, "error"));
    };

    const formatMoney = (val) => val.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

    if (loading) return <div className="p-8 text-center text-slate-500">Cargando inventario...</div>;

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center text-white">
                <div>
                    <h1 className="text-3xl font-bold">Inventario / Stock</h1>
                    <p className="text-slate-400">Administra tus insumos y materiales con control de cantidades.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Nuevo Material
                </button>
            </header>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase font-semibold border-b border-slate-700">
                            <th className="p-4">Material / Insumo</th>
                            <th className="p-4 text-center">Disponible</th>
                            <th className="p-4 text-right">Costo Unit.</th>
                            <th className="p-4 text-right">Costo Total</th>
                            <th className="p-4 text-center">Estado</th>
                            <th className="p-4 text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {items.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-500">No hay items en stock.</td></tr>
                        ) : (
                            items.map(item => (
                                <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-200">{item.name}</div>
                                        <div className="text-xs text-slate-500">Comprado: {new Date(item.purchase_date).toLocaleDateString()}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`text-lg font-bold ${item.quantity > 0 ? 'text-white' : 'text-slate-600'}`}>
                                            {item.quantity}
                                        </span>
                                        <span className="text-xs text-slate-500 ml-1">/ {item.initial_quantity}</span>
                                    </td>
                                    <td className="p-4 text-right text-slate-400 font-mono">{formatMoney(item.unit_cost)}</td>
                                    <td className="p-4 text-right text-red-400 font-mono">{formatMoney(item.cost_amount)}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'AVAILABLE' ? 'bg-green-500/10 text-green-400' : 'bg-slate-900 text-slate-500'
                                            }`}>
                                            {item.status === 'AVAILABLE' ? 'EN STOCK' : 'AGOTADO'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        {item.status === 'AVAILABLE' && (
                                            <button
                                                onClick={() => handleSellClick(item)}
                                                className="bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white px-3 py-1 rounded text-sm font-bold transition-all"
                                            >
                                                Vender / Usar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
                {items.length === 0 ? (
                    <div className="text-center text-slate-500 p-8">No hay items en stock.</div>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg relative">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{item.name}</h3>
                                    <p className="text-xs text-slate-500">Costo Unit: {formatMoney(item.unit_cost)}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${item.status === 'AVAILABLE' ? 'bg-green-500/10 text-green-400' : 'bg-slate-900 text-slate-500'}`}>
                                    {item.status === 'AVAILABLE' ? 'STOCK' : 'AGOTADO'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4 bg-slate-900/50 p-3 rounded-lg">
                                <div className="text-center">
                                    <span className="text-xs text-slate-500 uppercase block">Disponible</span>
                                    <span className={`text-xl font-bold ${item.quantity > 0 ? 'text-white' : 'text-slate-600'}`}>
                                        {item.quantity}
                                    </span>
                                    <span className="text-[10px] text-slate-500 ml-1">/ {item.initial_quantity}</span>
                                </div>
                                <div className="text-center border-l border-slate-700">
                                    <span className="text-xs text-slate-500 uppercase block">Costo Total</span>
                                    <span className="text-xl font-bold text-red-400">
                                        {formatMoney(item.cost_amount)}
                                    </span>
                                </div>
                            </div>

                            {item.status === 'AVAILABLE' && (
                                <button
                                    onClick={() => handleSellClick(item)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-lg transition-all active:scale-95"
                                >
                                    Vender / Usar
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 transition-opacity">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-700 animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="p-6 text-white flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-700">
                            <h2 className="text-xl font-bold tracking-tight">Agregar Nuevo Material</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="p-6 md:p-8 space-y-8">
                            <div>
                                <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Nombre del Material</label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-white font-medium transition-all placeholder:text-slate-700"
                                    placeholder="Ej: Bolsa de Cemento"
                                    value={newItemName}
                                    onChange={e => setNewItemName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Cantidad Inicial</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-white font-medium transition-all placeholder:text-slate-700"
                                        placeholder="1"
                                        value={newItemQuantity}
                                        onChange={e => setNewItemQuantity(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Costo Total Compra</label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                                        <input
                                            type="number"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-white font-medium transition-all placeholder:text-slate-700"
                                            placeholder="0.00"
                                            value={newItemCost}
                                            onChange={e => setNewItemCost(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {newItemQuantity > 0 && newItemCost > 0 && (
                                <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 text-center">
                                    <p className="text-sm text-blue-400">
                                        Costo unitario calculado: <span className="text-xl font-bold block mt-1">{formatMoney(newItemCost / newItemQuantity)}</span>
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 text-slate-400 font-semibold hover:bg-slate-700 hover:text-white rounded-xl transition-colors">Cancelar</button>
                                <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-900/40 transform transition-all active:scale-95 hover:shadow-xl">Guardar Material</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Sell Modal */}
            {isSellModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 transition-opacity">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-700 animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="p-6 text-white flex justify-between items-center bg-gradient-to-r from-emerald-600 to-green-700">
                            <h2 className="text-xl font-bold tracking-tight">Registrar Venta / Uso</h2>
                            <button onClick={() => setIsSellModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 bg-slate-900/50 border-b border-slate-700 flex justify-between items-center">
                            <div>
                                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Material Seleccionado</div>
                                <div className="text-white font-bold text-lg">{selectedItem?.name}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Costo Unitario</div>
                                <div className="text-slate-300 font-mono text-lg">{formatMoney(selectedItem?.unit_cost)}</div>
                            </div>
                        </div>

                        <form onSubmit={handleSellSubmit} className="p-6 md:p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Cantidad a Vender</label>
                                    <input
                                        autoFocus
                                        type="number"
                                        className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-white font-medium transition-all placeholder:text-slate-700"
                                        value={sellQuantity}
                                        onChange={e => setSellQuantity(e.target.value)}
                                        max={selectedItem?.quantity}
                                        min="0.1"
                                        step="0.1"
                                        required
                                    />
                                    <p className="text-xs text-slate-500 mt-2 text-right">Disponible: {selectedItem?.quantity}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Precio de Venta (Unit)</label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">$</span>
                                        <input
                                            type="number"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-white font-medium transition-all placeholder:text-slate-700"
                                            placeholder="0.00"
                                            value={sellPriceUnit}
                                            onChange={e => setSellPriceUnit(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {sellPriceUnit > 0 && sellPriceUnit < selectedItem?.unit_cost && (
                                <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 flex gap-3 items-start animate-pulse">
                                    <svg className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    <div>
                                        <h4 className="text-amber-400 font-bold text-sm">Advertencia de Pérdida</h4>
                                        <p className="text-xs text-amber-500/80">
                                            Estás vendiendo por debajo del costo ({formatMoney(selectedItem.unit_cost)}). No generarás ganancia.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {sellPriceUnit >= selectedItem?.unit_cost && (
                                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-center">
                                    <p className="text-sm text-emerald-400">
                                        Ganancia estimada por unidad: <span className="text-lg font-bold block mt-1">{formatMoney(sellPriceUnit - selectedItem.unit_cost)}</span>
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Descripción / Trabajo</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-white font-medium transition-all placeholder:text-slate-700 resize-none h-24"
                                    placeholder="Ej: Venta a cliente externo / Obra X"
                                    value={workDesc}
                                    onChange={e => setWorkDesc(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 flex justify-between items-center">
                                <span className="text-slate-400 font-bold uppercase text-sm tracking-wider">Total a Ingresar</span>
                                <span className="text-3xl font-bold text-emerald-500">{formatMoney((parseFloat(sellQuantity) || 0) * (parseFloat(sellPriceUnit) || 0))}</span>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setIsSellModalOpen(false)} className="flex-1 py-4 text-slate-400 font-semibold hover:bg-slate-700 hover:text-white rounded-xl transition-colors">Cancelar</button>
                                <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/40 transform transition-all active:scale-95 hover:shadow-xl">Confirmar Venta</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Stock;
