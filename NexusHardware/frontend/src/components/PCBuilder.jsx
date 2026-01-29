import React, { useState, useEffect } from 'react';
import API_URL from '../config';

const CATEGORIES = [
    { id: 'CPU', label: 'Procesador (CPU)' },
    { id: 'MOTHERBOARD', label: 'Placa Madre' },
    { id: 'RAM', label: 'Memoria RAM' },
    { id: 'REFRIGERACION', label: 'Refrigeración' },
    { id: 'GPU', label: 'Placa de Video (GPU)' },
    { id: 'ALMACENAMIENTO', label: 'Almacenamiento' },
    { id: 'FUENTE', label: 'Fuente de Poder' },
    { id: 'GABINETE', label: 'Gabinete' },
    { id: 'MONITOR', label: 'Monitor' },
    { id: 'PERIFERICOS', label: 'Periféricos' }
];

const PCBuilder = ({ onAddToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selection, setSelection] = useState({});
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);

    useEffect(() => {
        fetch(`${API_URL}/products`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const handleSelect = (category, product) => {
        setSelection(prev => {
            // Si el producto clickeado ya está seleccionado en esa categoría, lo quitamos (toggle)
            if (prev[category]?.id === product.id) {
                const newSelection = { ...prev };
                delete newSelection[category];
                return newSelection;
            }
            // Si no, lo seleccionamos/reemplazamos
            return { ...prev, [category]: product };
        });
    };

    const handleNext = () => {
        const idx = CATEGORIES.findIndex(c => c.id === activeCategory);
        if (idx < CATEGORIES.length - 1) {
            setActiveCategory(CATEGORIES[idx + 1].id);
        }
    };

    const handlePrev = () => {
        const idx = CATEGORIES.findIndex(c => c.id === activeCategory);
        if (idx > 0) {
            setActiveCategory(CATEGORIES[idx - 1].id);
        }
    };

    const totalPrice = Object.values(selection).reduce((sum, item) => sum + item.price, 0);

    const getFilteredProducts = (category) => {
        return products.filter(p => p.category === category);
    };

    const handleAddBuildToCart = () => {
        // Add all selected items to cart individually
        Object.values(selection).forEach(item => {
            onAddToCart(item, 'ARMA_TU_PC');
        });
        alert('¡Tu PC personalizada ha sido agregada al carrito!');
    };

    if (loading) return <div className="text-center p-10 text-slate-400">Cargando componentes...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pt-32 pb-20 px-4">
            <h2 className="text-3xl font-bold text-slate-100 mb-6">Arma tu propia PC</h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
                {/* Left Column: Categories Grid */}
                <div className="lg:col-span-3 h-full overflow-y-auto scrollbar-none px-2 pb-2">
                    <div className="grid grid-cols-2 gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-2 py-3 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 h-20 ${activeCategory === cat.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                                    }`}
                            >
                                <span>{cat.label}</span>
                                {selection[cat.id] && <span className="text-emerald-400 text-[10px]">●</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Middle Column: Product Selection (SCROLLABLE) */}
                <div className="lg:col-span-6 h-full flex flex-col min-h-0">
                    <div className="bg-slate-800 rounded-xl border border-slate-700 flex flex-col h-full relative z-0 overflow-hidden">
                        {/* Header Fijo */}
                        <div className="p-6 pb-4 border-b border-slate-700 bg-slate-800 z-10">
                            <h3 className="text-xl font-bold text-slate-200 flex justify-between items-center">
                                {CATEGORIES.find(c => c.id === activeCategory)?.label}
                                <span className="text-sm font-normal text-slate-500">Paso {CATEGORIES.findIndex(c => c.id === activeCategory) + 1} de {CATEGORIES.length}</span>
                            </h3>
                        </div>

                        {/* Lista Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 pt-4 scrollbar-none">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {getFilteredProducts(activeCategory).length > 0 ? (
                                    getFilteredProducts(activeCategory).map(product => (
                                        <div
                                            key={product.id}
                                            onClick={() => handleSelect(activeCategory, product)}
                                            className={`p-4 rounded-lg border cursor-pointer transition-all flex flex-col gap-3 relative ${selection[activeCategory]?.id === product.id
                                                ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500'
                                                : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                                                }`}
                                        >
                                            <div className="w-full h-32 bg-slate-800 rounded overflow-hidden flex-shrink-0">
                                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-200 text-sm mb-1">{product.name}</h4>
                                                <p className="text-blue-400 font-mono font-bold">${product.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
                                            </div>
                                            {selection[activeCategory]?.id === product.id && (
                                                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 text-center text-slate-500 py-20 flex flex-col items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        <p>No hay productos disponibles en esta categoría.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Navigation Buttons Fijos al fondo del contenedor */}
                        <div className="flex justify-between p-4 border-t border-slate-700 bg-slate-800 z-10">
                            <button onClick={handlePrev} disabled={activeCategory === CATEGORIES[0].id} className="text-slate-400 hover:text-white disabled:opacity-50 px-4 py-2">
                                &larr; Anterior
                            </button>
                            <button onClick={handleNext} disabled={activeCategory === CATEGORIES[CATEGORIES.length - 1].id} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded disabled:opacity-50 transition-colors">
                                Siguiente &rarr;
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Build Summary */}
                <div className="lg:col-span-3 h-full overflow-hidden">
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 h-full flex flex-col">
                        <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                            Resumen de tu PC
                        </h3>

                        <div className="space-y-3 mb-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600">
                            {CATEGORIES.map(cat => (
                                <div key={cat.id} className="flex flex-col text-sm border-b border-slate-700/50 pb-2 last:border-0">
                                    <span className="text-slate-500 text-xs mb-1 uppercase tracking-wider">{cat.label}</span>
                                    {selection[cat.id] ? (
                                        <div className="flex justify-between items-center group">
                                            <span className="text-slate-200 font-medium truncate pr-2" title={selection[cat.id].name}>{selection[cat.id].name}</span>
                                            <span className="text-emerald-400 font-mono text-xs">${selection[cat.id].price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-600 italic text-xs">- Pendiente -</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-700 pt-4 mb-6 flex-shrink-0">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-400">Total Estimado</span>
                                <span className="text-3xl font-bold text-emerald-400">${totalPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleAddBuildToCart}
                            disabled={totalPrice === 0}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-4 rounded-lg shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02] flex-shrink-0"
                        >
                            Agregar PC al Carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PCBuilder;
