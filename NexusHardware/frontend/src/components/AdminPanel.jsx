import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import API_URL from '../config';

const AdminPanel = ({ username }) => {
    // ... (rest of code)
    const [stats, setStats] = useState(null);
    const [optimizationData, setOptimizationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newProduct, setNewProduct] = useState({
        name: '', category: '', price: '', stock: '', image_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800'
    });
    const [message, setMessage] = useState('');

    const fetchData = () => {
        const fetchStats = fetch(`${API_URL}/dashboard-stats`).then(res => res.json());
        const fetchOptimization = fetch(`${API_URL}/optimization`).then(res => res.json());

        Promise.all([fetchStats, fetchOptimization])
            .then(([statsData, optData]) => {
                setStats(statsData);
                setOptimizationData(optData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Backend Error", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newProduct,
                    price: parseFloat(newProduct.price),
                    stock: parseInt(newProduct.stock)
                })
            });
            if (res.ok) {
                setMessage('Product added successfully!');
                setNewProduct({ name: '', category: '', price: '', stock: '', image_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800' });
                fetchData(); // Refresh data
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Failed to add product');
            }
        } catch (error) {
            setMessage('Error connecting to server');
        }
    };

    if (loading) return <div className="text-center p-10 text-slate-400">Loading Dashboard...</div>;
    if (!stats) return <div className="text-center p-10 text-red-400">Error loading dashboard data.</div>;

    const chartData = stats.recent_transactions.map((tx) => ({
        name: `Order #${tx.transaction_id}`,
        amount: tx.total_value,
        date: tx.timestamp,
        products: tx.products,
        id: tx.transaction_id
    })).reverse();

    const handleChartClick = (data) => {
        // When clicking specific Bar, data is the payload directly
        console.log("Chart Bar Clicked:", data);
        if (!data) return;

        try {
            console.log("Generating PDF...");
            // Handle different import styles for jsPDF in Vite
            const JsPDF = jsPDF.default || jsPDF;
            const doc = new JsPDF();

            // Header
            doc.setFontSize(20);
            doc.text("NEXUS HARDWARE", 105, 20, { align: "center" });
            doc.setFontSize(12);
            doc.text("Sales Receipt", 105, 28, { align: "center" });

            // Info
            doc.setFontSize(10);
            doc.text(`Transaction ID: ${data.id}`, 14, 40);
            doc.text(`Date: ${new Date(data.date).toLocaleString()}`, 14, 46);

            // Table
            autoTable(doc, {
                startY: 55,
                head: [['Product', 'Price']],
                body: data.products.map(p => [p, '-']),
                foot: [['Total', `$${data.amount.toFixed(2)}`]],
                theme: 'grid',
                headStyles: { fillColor: [15, 23, 42] }
            });

            doc.save(`receipt_${data.id}.pdf`);
            console.log("PDF Saved");
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("Error generating PDF. Check console for details.");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Dashboard</h2>
                    <p className="text-slate-400 text-sm">Welcome back, {username}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800 border border-cyan-500/30 p-6 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.1)] text-center">
                    <h3 className="text-gray-400 text-xs mb-2 uppercase tracking-widest">Total Revenue</h3>
                    <p className="text-3xl font-mono font-bold text-cyan-400">
                        ${stats.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                </div>

                <div className="bg-slate-800 border border-purple-500/30 p-6 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.1)] text-center">
                    <h3 className="text-gray-400 text-xs mb-2 uppercase tracking-widest">Total Sales</h3>
                    <p className="text-3xl font-mono font-bold text-purple-400">
                        {stats.sales_count}
                    </p>
                </div>

                <div className="bg-slate-800 border border-blue-500/30 p-6 rounded-xl text-center">
                    <h3 className="text-gray-400 text-xs mb-2 uppercase tracking-widest">Last 7 Days</h3>
                    <p className="text-xl font-mono font-bold text-white mb-1">
                        ${stats.revenue_7d?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                    </p>
                    <p className="text-xs text-blue-400">{stats.sales_7d || 0} sales</p>
                </div>

                <div className="bg-slate-800 border border-blue-500/30 p-6 rounded-xl text-center">
                    <h3 className="text-gray-400 text-xs mb-2 uppercase tracking-widest">Last 30 Days</h3>
                    <p className="text-xl font-mono font-bold text-white mb-1">
                        ${stats.revenue_30d?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                    </p>
                    <p className="text-xs text-blue-400">{stats.sales_30d || 0} sales</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Formulario de Creación de Producto */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <h3 className="text-lg font-bold text-slate-100 mb-4 border-b border-slate-700 pb-2">Add New Product</h3>
                    {message && <div className={`mb-4 p-2 rounded text-sm ${message.includes('success') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{message}</div>}
                    <form onSubmit={handleAddProduct} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-400 text-xs mb-1">Product Name</label>
                                <input required type="text" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:border-blue-500 outline-none"
                                    value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-xs mb-1">Category</label>
                                <input required type="text" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:border-blue-500 outline-none"
                                    value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-400 text-xs mb-1">Price ($)</label>
                                <input required type="number" step="0.01" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:border-blue-500 outline-none"
                                    value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-xs mb-1">Stock Qty</label>
                                <input required type="number" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:border-blue-500 outline-none"
                                    value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Image URL</label>
                            <input required type="text" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:border-blue-500 outline-none"
                                value={newProduct.image_url} onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })} />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded transition-colors">
                            Add to Inventory
                        </button>
                    </form>
                </div>

                {/* Gráfico de Ventas */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <h3 className="text-lg font-bold text-slate-100 mb-4 border-b border-slate-700 pb-2">Recent Transactions</h3>
                    <p className="text-xs text-slate-400 mb-2">Click on a bar to download receipt</p>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `$${val}`} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    cursor={{ fill: '#334155', opacity: 0.4 }}
                                />
                                <Bar
                                    dataKey="amount"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={handleChartClick}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Tabla de Optimización */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-slate-100">Stock Optimization Engine</h3>
                        <p className="text-xs text-slate-400">Powered by C-Logic Simulation</p>
                    </div>
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded">ONLINE</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-semibold">
                            <tr>
                                <th className="p-4">Product</th>
                                <th className="p-4">Current Stock</th>
                                <th className="p-4">Avg. Monthly Sales</th>
                                <th className="p-4">Lead Time (Days)</th>
                                <th className="p-4 text-right">Restock Suggestion</th>
                                <th className="p-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-700">
                            {optimizationData.map(item => (
                                <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="p-4 font-medium text-slate-200">{item.name}</td>
                                    <td className="p-4 text-slate-400">{item.stock}</td>
                                    <td className="p-4 text-slate-400">{item.sales_avg}</td>
                                    <td className="p-4 text-slate-400">{item.lead_time}</td>
                                    <td className={`p-4 text-right font-bold ${item.restock_suggestion > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                                        {item.restock_suggestion > 0 ? `+${item.restock_suggestion}` : '0'}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold ${item.status === 'CRITICAL' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
