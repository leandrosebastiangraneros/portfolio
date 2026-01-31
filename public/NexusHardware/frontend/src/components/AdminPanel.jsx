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
    const [isWakingUp, setIsWakingUp] = useState(false);

    const fetchData = () => {
        // Timeout para detectar cold start
        const timeout = setTimeout(() => setIsWakingUp(true), 3000);

        const fetchStats = fetch(`${API_URL}/dashboard-stats`).then(res => res.json());
        const fetchOptimization = fetch(`${API_URL}/optimization`).then(res => res.json());

        Promise.all([fetchStats, fetchOptimization])
            .then(([statsData, optData]) => {
                setStats(statsData);
                setOptimizationData(optData);
                setLoading(false);
                clearTimeout(timeout);
                setIsWakingUp(false);
            })
            .catch(err => {
                console.error("Backend Error", err);
                setLoading(false);
                clearTimeout(timeout);
                setIsWakingUp(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        console.log("Intentando agregar producto:", newProduct); // DEBUG

        try {
            const payload = {
                ...newProduct,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock)
            };
            console.log("Payload enviado:", payload); // DEBUG

            const res = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            console.log("Respuesta status:", res.status); // DEBUG

            if (res.ok) {
                const data = await res.json();
                console.log("Producto agregado:", data); // DEBUG
                setMessage('Product added successfully!');
                setNewProduct({ name: '', category: '', price: '', stock: '', image_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800' });
                fetchData(); // Refresh data
                setTimeout(() => setMessage(''), 3000);
            } else {
                const errData = await res.json();
                console.error("Error del backend:", errData);
                setMessage(`Failed: ${errData.detail || 'Unknown error'}`);
                alert(`Error al guardar: ${JSON.stringify(errData)}`); // Alertar visiblemente
            }
        } catch (error) {
            console.error("Error de red/fetch:", error);
            setMessage(`Error connecting to server: ${error.message}`);
            alert(`Error de conexión: ${error.message}`);
        }
    };

    if (loading) return (
        <div className="text-center p-10 text-slate-400">
            {isWakingUp && (
                <div className="max-w-md mx-auto bg-blue-500/10 border border-blue-500 text-blue-400 px-4 py-3 rounded mb-6 flex items-center justify-center gap-3 animate-pulse">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div>
                        <strong>Despertando Servidor...</strong>
                        <span className="block text-xs opacity-80 mt-1">Este proceso puede tardar unos segundos en Render Free Tier.</span>
                    </div>
                </div>
            )}
            {!isWakingUp && "Cargando Dashboard..."}
        </div>
    );
    if (!stats) return <div className="text-center p-10 text-red-400">Error loading dashboard data.</div>;

    const chartData = stats.recent_transactions.map((tx) => ({
        name: `Order #${tx.transaction_id}`,
        amount: tx.total_value,
        date: tx.timestamp,
        products: tx.products, // Now contains {name, price} objects
        id: tx.transaction_id,
        purchase_type: tx.purchase_type // New field from backend
    })).reverse();

    const handleChartClick = async (data) => {
        // When clicking specific Bar, data is the payload directly
        console.log("Chart Bar Clicked:", data);
        if (!data) return;

        try {
            console.log("Generating PDF...");
            // Handle different import styles for jsPDF in Vite
            const JsPDF = jsPDF.default || jsPDF;
            const doc = new JsPDF();

            // --- ESTILOS ---
            const primaryColor = [59, 130, 246]; // Blue 500
            const secondaryColor = [15, 23, 42]; // Slate 900

            // --- HEADER ---
            doc.setFillColor(240, 249, 255); // Light blue fill



            // Brand Text

            // Rasterize SVG Logo for high fidelity (gradients/glows)
            const svgString = `
                <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <path
                        d="M50 5 L93.3 30 V80 L50 105 L6.7 80 V30 L50 5Z"
                        stroke="url(#logoGradient)"
                        stroke-width="4"
                        fill="rgba(59, 130, 246, 0.1)"
                        filter="url(#glow)"
                    />
                    <circle cx="50" cy="5" r="3" fill="#06b6d4" />
                    <circle cx="93.3" cy="30" r="3" fill="#3b82f6" />
                    <circle cx="93.3" cy="80" r="3" fill="#06b6d4" />
                    <circle cx="50" cy="105" r="3" fill="#3b82f6" />
                    <circle cx="6.7" cy="80" r="3" fill="#06b6d4" />
                    <circle cx="6.7" cy="30" r="3" fill="#3b82f6" />
                    <path
                        d="M35 35 V75 L65 35 V75"
                        stroke="white"
                        stroke-width="6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        fill="none"
                    />
                </svg>
            `;

            // Convert simple SVG to Base64 using Canvas
            const loadLogo = () => new Promise((resolve) => {
                const img = new Image();
                // Use encodeURIComponent for safety with UTF-8
                img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 200;
                    canvas.height = 200;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    try {
                        resolve(canvas.toDataURL('image/png'));
                    } catch (e) {
                        console.error("Canvas Taint?", e);
                        resolve(null);
                    }
                };
                img.onerror = (e) => {
                    console.error("Error loading logo SVG", e);
                    resolve(null);
                };
            });

            const logoDataUrl = await loadLogo();

            if (logoDataUrl) {
                try {
                    doc.addImage(logoDataUrl, 'PNG', 14, 10, 25, 25);
                } catch (e) {
                    console.error("AddImage failed", e);
                    doc.setFillColor(...primaryColor);
                    doc.rect(14, 14, 20, 20, 'F');
                }
            } else {
                // Fallback: Blue Square
                doc.setFillColor(...primaryColor);
                doc.rect(14, 14, 20, 20, 'F');
            }
            doc.setTextColor(...secondaryColor);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("NEXUS HARDWARE", 45, 22);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text("Hardware Premium & Workstations", 45, 28);

            // Etiqueta de Comprobante
            doc.setFillColor(...secondaryColor);
            doc.rect(140, 10, 60, 25, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.text("COMPROBANTE", 170, 20, { align: "center" });
            doc.setFontSize(10);
            doc.text(`N°: 0001-${data.id}`, 170, 28, { align: "center" });

            // Línea separadora
            doc.setDrawColor(200);
            doc.setLineWidth(0.5);
            doc.line(10, 40, 200, 40);

            // --- INFO CLIENTE Y FECHA ---
            doc.setTextColor(...secondaryColor);
            doc.setFontSize(10);

            // Fecha ARG
            const dateOptions = {
                timeZone: 'America/Argentina/Buenos_Aires',
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit'
            };
            const argentinaDate = new Intl.DateTimeFormat('es-AR', dateOptions).format(new Date(data.date));

            doc.text("FECHA DE EMISIÓN:", 15, 50);
            doc.setFont("helvetica", "normal");
            doc.text(argentinaDate, 55, 50);

            doc.setFont("helvetica", "bold");
            doc.text("CLIENTE:", 15, 56);
            doc.setFont("helvetica", "normal");
            doc.text(username || "Consumidor Final", 55, 56);

            doc.setFont("helvetica", "bold");
            doc.text("ORIGEN COMPRA:", 120, 50);
            doc.setFont("helvetica", "normal");
            // Mapeo el tipo de compra a un texto más amigable
            const typeLabel = data.purchase_type === 'ARMA_TU_PC' ? 'Armador de PC (Custom Build)' : 'Tienda / Individual';
            doc.text(typeLabel, 155, 50);

            if (data.purchase_type === 'ARMA_TU_PC') {
                doc.setTextColor(59, 130, 246); // Blue
                doc.setFontSize(8);
                doc.text("(Configuración personalizada verificada)", 155, 55);
            }

            // --- TABLA DE ITEMS ---
            // Prepare body data. products is now an array of {name, price}
            const tableBody = data.products.map(p => [
                p.name,
                "1",
                `$${p.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`,
                `$${p.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
            ]);

            autoTable(doc, {
                startY: 65,
                head: [['Producto / Componente', 'Cant.', 'Precio Unit.', 'Subtotal']],
                body: tableBody,
                foot: [['', '', 'TOTAL', `$${data.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`]],
                theme: 'grid',
                headStyles: {
                    fillColor: secondaryColor,
                    textColor: [255, 255, 255],
                    fontStyle: 'bold'
                },
                footStyles: {
                    fillColor: [241, 245, 249],
                    textColor: secondaryColor,
                    fontStyle: 'bold',
                    fontSize: 12
                },
                columnStyles: {
                    0: { cellWidth: 'auto' }, // Product Name
                    1: { halign: 'center' }, // Qty
                    2: { halign: 'right' }, // Price
                    3: { halign: 'right', fontStyle: 'bold' } // Subtotal
                },
                styles: {
                    fontSize: 9,
                    cellPadding: 3
                }
            });

            // --- FOOTER ---
            const finalY = doc.lastAutoTable.finalY + 20;

            doc.setFontSize(24);
            doc.setTextColor(...primaryColor);
            doc.setFont("helvetica", "bold");
            doc.text("GRACIAS POR SU COMPRA", 105, finalY, { align: "center" });

            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.setFont("helvetica", "normal");
            doc.text("Nexus Hardware Inc. - Buenos Aires, Argentina", 105, finalY + 8, { align: "center" });
            doc.text("www.nexushardware.com", 105, finalY + 14, { align: "center" });

            doc.save(`Nexus_Recibo_${data.id}.pdf`);
            console.log("PDF Saved");
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("Error generating PDF. Check console for details.");
        }
    };

    return (
        <div className="space-y-8 pt-24">
            <div className="flex justify-between items-center bg-slate-800/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Panel de Control</h2>
                    <p className="text-slate-400 text-sm mt-1">Sesión iniciada como <span className="text-blue-400 font-semibold">{username}</span></p>
                </div>
                <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full shadow-lg shadow-blue-500/20"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900/40 border border-cyan-500/20 p-6 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.05)] backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-cyan-500/10 transition-colors"></div>
                    <h3 className="text-slate-400 text-xs mb-3 uppercase tracking-widest font-semibold">Ingresos Totales</h3>
                    <p className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                        ${stats.total_revenue.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>
                </div>

                <div className="bg-slate-900/40 border border-purple-500/20 p-6 rounded-3xl shadow-[0_0_30px_rgba(168,85,247,0.05)] backdrop-blur-md relative overflow-hidden group hover:border-purple-500/40 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-purple-500/10 transition-colors"></div>
                    <h3 className="text-slate-400 text-xs mb-3 uppercase tracking-widest font-semibold">Ventas Totales</h3>
                    <p className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        {stats.sales_count}
                    </p>
                </div>

                <div className="bg-slate-800/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md hover:bg-slate-800/60 transition-colors text-center">
                    <h3 className="text-slate-400 text-xs mb-2 uppercase tracking-widest font-semibold">Últimos 7 Días</h3>
                    <p className="text-xl font-mono font-bold text-slate-200 mb-1">
                        ${stats.revenue_7d?.toLocaleString('es-AR', { minimumFractionDigits: 2 }) || '0.00'}
                    </p>
                    <p className="text-xs text-blue-400 font-medium px-2 py-1 bg-blue-500/10 rounded-full inline-block mt-1">{stats.sales_7d || 0} ventas</p>
                </div>

                <div className="bg-slate-800/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md hover:bg-slate-800/60 transition-colors text-center">
                    <h3 className="text-slate-400 text-xs mb-2 uppercase tracking-widest font-semibold">Últimos 30 Días</h3>
                    <p className="text-xl font-mono font-bold text-slate-200 mb-1">
                        ${stats.revenue_30d?.toLocaleString('es-AR', { minimumFractionDigits: 2 }) || '0.00'}
                    </p>
                    <p className="text-xs text-blue-400 font-medium px-2 py-1 bg-blue-500/10 rounded-full inline-block mt-1">{stats.sales_30d || 0} ventas</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Formulario de Creación de Producto */}
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-xl">
                    <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                        Agregar Nuevo Producto
                    </h3>
                    {message && <div className={`mb-6 p-3 rounded-xl text-sm font-medium border ${message.includes('success') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>{message}</div>}
                    <form onSubmit={handleAddProduct} className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Nombre</label>
                                <input required type="text" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                                    placeholder="RTX 4090..."
                                    value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Categoría</label>
                                <input required type="text" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                                    placeholder="GPU, RAM..."
                                    value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Precio (ARS)</label>
                                <input required type="number" step="0.01" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Stock</label>
                                <input required type="number" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Imagen del Producto</label>
                            <input
                                required
                                type="file"
                                accept="image/*"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-slate-300 focus:border-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 transition-all cursor-pointer"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        if (file.size > 1024 * 1024) {
                                            alert("La imagen es muy pesada. Máximo 1MB.");
                                            return;
                                        }
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setNewProduct({ ...newProduct, image_url: reader.result });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            {newProduct.image_url && !newProduct.image_url.includes('unsplash') && (
                                <div className="mt-3 relative w-20 h-20 group">
                                    <img src={newProduct.image_url} alt="Preview" className="w-full h-full object-cover rounded-lg border border-slate-600 shadow-lg" />
                                    <div className="absolute inset-0 bg-black/40 rounded-lg hidden group-hover:flex items-center justify-center text-xs text-white font-bold">Preview</div>
                                </div>
                            )}
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1">
                            Agregar al Inventario
                        </button>
                    </form>
                </div>

                {/* Gráfico de Ventas */}
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-xl flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                            Transacciones Recientes
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 ml-4">Click en una barra para descargar comprobante PDF</p>
                    </div>

                    <div className="flex-grow min-h-[300px] bg-slate-800/30 rounded-2xl p-4 border border-white/5">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#64748b" fontSize={10} tickFormatter={(val) => `$${val}`} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                                    cursor={{ fill: '#3b82f6', opacity: 0.1 }}
                                />
                                <Bar
                                    dataKey="amount"
                                    fill="url(#colorGradient)"
                                    radius={[6, 6, 0, 0]}
                                    className="cursor-pointer hover:opacity-100 transition-opacity"
                                    onClick={handleChartClick}
                                    activeBar={{ fill: '#06b6d4' }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Tabla de Optimización */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                            Motor de Optimización de Stock
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 ml-4 flex items-center gap-2">
                            <span>Potenciado por C-Logic</span>
                            <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] border border-slate-700">v3.0.1</span>
                        </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full animate-pulse">
                        ● SISTEMA ONLINE
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/20 text-slate-400 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="p-5 pl-8">Producto</th>
                                <th className="p-5">Stock Actual</th>
                                <th className="p-5">Ventas Prom.</th>
                                <th className="p-5">Lead Time</th>
                                <th className="p-5 text-right">Sugerencia</th>
                                <th className="p-5 text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-white/5">
                            {optimizationData.map(item => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-5 pl-8 font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">{item.name}</td>
                                    <td className="p-5 text-slate-400 font-mono">{item.stock}</td>
                                    <td className="p-5 text-slate-400 font-mono">{item.sales_avg}</td>
                                    <td className="p-5 text-slate-400 font-mono">{item.lead_time}d</td>
                                    <td className={`p-5 text-right font-bold font-mono ${item.restock_suggestion > 0 ? 'text-amber-400' : 'text-slate-600'}`}>
                                        {item.restock_suggestion > 0 ? `+${item.restock_suggestion}` : '-'}
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${item.status === 'CRITICAL'
                                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
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
