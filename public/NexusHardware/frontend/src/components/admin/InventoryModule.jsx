import React, { useState } from 'react';
import GlassContainer from '../common/GlassContainer';
import Button from '../common/Button';
import API_URL from '../../config';

const InventoryModule = ({ optimizationData, onRefresh }) => {
    const [newProduct, setNewProduct] = useState({
        name: '', category: '', price: '', stock: '', image_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800'
    });
    const [message, setMessage] = useState('');

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newProduct,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock)
            };
            const res = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setMessage('Product added successfully!');
                setNewProduct({ name: '', category: '', price: '', stock: '', image_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800' });
                if (onRefresh) onRefresh();
                setTimeout(() => setMessage(''), 3000);
            } else {
                const errData = await res.json();
                setMessage(`Failed: ${errData.detail || 'Unknown error'}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-[fadeIn_0.5s_ease-out]">
            {/* Add Product Form */}
            <GlassContainer className="p-8">
                <h3 className="font-display font-bold text-lg text-white mb-6">INVENTORY_INJECTION</h3>
                {message && <div className="mb-4 text-xs font-mono text-accent">{message}</div>}
                <form onSubmit={handleAddProduct} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono text-txt-dim uppercase">Product Name</label>
                            <input required className="w-full bg-surface border border-white/10 p-2 text-white text-sm focus:border-accent outline-none transition-colors"
                                value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono text-txt-dim uppercase">Category</label>
                            <input required className="w-full bg-surface border border-white/10 p-2 text-white text-sm focus:border-accent outline-none transition-colors"
                                value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono text-txt-dim uppercase">Price</label>
                            <input required type="number" className="w-full bg-surface border border-white/10 p-2 text-white text-sm focus:border-accent outline-none transition-colors"
                                value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono text-txt-dim uppercase">Stock</label>
                            <input required type="number" className="w-full bg-surface border border-white/10 p-2 text-white text-sm focus:border-accent outline-none transition-colors"
                                value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-txt-dim uppercase">Image URL (or upload)</label>
                        <input type="file" className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setNewProduct({ ...newProduct, image_url: reader.result });
                                    reader.readAsDataURL(file);
                                }
                            }} />
                    </div>
                    <Button variant="primary" className="w-full mt-4">Initialize Stock</Button>
                </form>
            </GlassContainer>

            {/* Optimization Table */}
            <GlassContainer className="overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-display font-bold text-lg text-white">PREDICTIVE_STOCK_OPTIMIZER</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-mono text-success uppercase tracking-wider">Analysis Active</span>
                    </div>
                </div>
                <div className="overflow-x-auto grow h-[400px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-[10px] font-mono uppercase text-txt-secondary tracking-wider sticky top-0 backdrop-blur-md">
                            <tr>
                                <th className="p-4 font-normal">Component</th>
                                <th className="p-4 font-normal">Details</th>
                                <th className="p-4 font-normal text-right">Ventas Mensuales (Avg)</th>
                                <th className="p-4 font-normal text-right">Restock Delta</th>
                                <th className="p-4 font-normal text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {optimizationData.map(item => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-white">{item.name}</td>
                                    <td className="p-4 text-txt-dim text-xs">Stock: {item.stock} | Lead: {item.lead_time}d</td>
                                    <td className="p-4 text-right font-mono text-txt-secondary">{item.sales_avg}/day</td>
                                    <td className="p-4 text-right font-mono font-bold text-accent">
                                        {item.restock_suggestion > 0 ? `+${item.restock_suggestion}` : '-'}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`
                                            inline-flex px-2 py-1 rounded-sm text-[10px] uppercase font-bold tracking-wider
                                            ${item.status === 'CRITICAL' ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}
                                        `}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassContainer>
        </div>
    );
};

export default InventoryModule;
