import React, { useEffect, useState } from 'react';

const Stock = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

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
        fetch('http://localhost:8001/stock')
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
            alert("Por favor completa todos los campos correctamente.");
            return;
        }

        fetch('http://localhost:8001/stock', {
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
            })
            .catch(err => {
                console.error("Error adding stock:", err);
                alert("Error: " + err.message);
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
            alert("Completa todos los campos");
            return;
        }

        if (qty > selectedItem.quantity) {
            alert("No hay suficiente stock.");
            return;
        }

        fetch(`http://localhost:8001/stock/${selectedItem.id}/sell`, {
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
            })
            .catch(err => alert(err.message));
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

            <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
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

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-700 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-white mb-4">Agregar Nuevo Material</h2>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Nombre del Material</label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full p-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Ej: Bolsa de Cemento"
                                    value={newItemName}
                                    onChange={e => setNewItemName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Cantidad</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="1"
                                        value={newItemQuantity}
                                        onChange={e => setNewItemQuantity(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Costo Total Compra</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-slate-500">$</span>
                                        <input
                                            type="number"
                                            className="w-full p-3 pl-8 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="0.00"
                                            value={newItemCost}
                                            onChange={e => setNewItemCost(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            {newItemQuantity > 0 && newItemCost > 0 && (
                                <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                                    <p className="text-sm text-blue-400">
                                        Costo unitario calculado: <span className="font-bold">{formatMoney(newItemCost / newItemQuantity)}</span>
                                    </p>
                                </div>
                            )}
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-400 hover:bg-slate-700 rounded-lg">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Sell Modal */}
            {isSellModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-700 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-white mb-4">Registrar Venta</h2>
                        <div className="bg-slate-900 rounded-lg p-3 mb-4 flex justify-between items-center">
                            <div>
                                <div className="text-xs text-slate-500 uppercase font-bold">Item</div>
                                <div className="text-white font-bold">{selectedItem?.name}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500 uppercase font-bold">Costo Unit.</div>
                                <div className="text-slate-300 font-mono">{formatMoney(selectedItem?.unit_cost)}</div>
                            </div>
                        </div>

                        <form onSubmit={handleSellSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Cantidad a Vender</label>
                                    <input
                                        autoFocus
                                        type="number"
                                        className="w-full p-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        value={sellQuantity}
                                        onChange={e => setSellQuantity(e.target.value)}
                                        max={selectedItem?.quantity}
                                        min="1"
                                        required
                                    />
                                    <p className="text-[10px] text-slate-500 mt-1">Disp: {selectedItem?.quantity}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Precio Unitario</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-slate-500">$</span>
                                        <input
                                            type="number"
                                            className="w-full p-3 pl-8 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                            placeholder="0.00"
                                            value={sellPriceUnit}
                                            onChange={e => setSellPriceUnit(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {sellPriceUnit > 0 && sellPriceUnit < selectedItem?.unit_cost && (
                                <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 flex gap-2 items-center">
                                    <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    <p className="text-xs text-amber-400">
                                        <span className="font-bold">Aviso:</span> El precio de venta es inferior al costo unitario ({formatMoney(selectedItem.unit_cost)}). No generarás ganancia.
                                    </p>
                                </div>
                            )}

                            {sellPriceUnit >= selectedItem?.unit_cost && (
                                <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                                    <p className="text-xs text-green-400">
                                        Ganancia estimada por unidad: <span className="font-bold">{formatMoney(sellPriceUnit - selectedItem.unit_cost)}</span>
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Descripción / Trabajo</label>
                                <textarea
                                    className="w-full p-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none h-20"
                                    placeholder="Ej: Venta a cliente externo / Obra X"
                                    value={workDesc}
                                    onChange={e => setWorkDesc(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                                <span className="text-slate-400 font-semibold uppercase text-xs">Total Ingireso</span>
                                <span className="text-2xl font-bold text-green-500">{formatMoney((parseFloat(sellQuantity) || 0) * (parseFloat(sellPriceUnit) || 0))}</span>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsSellModalOpen(false)} className="px-4 py-2 text-slate-400 hover:bg-slate-700 rounded-lg">Cancelar</button>
                                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-lg shadow-green-900/40">Confirmar Venta</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Stock;
