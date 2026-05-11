import React, { useState, useEffect } from 'react';
import GlassContainer from './common/GlassContainer';
import Button from './common/Button';
import API_URL from '../config';

const CATEGORIES = [
    { id: 'CPU', label: 'Procesador', step: 1 },
    { id: 'MOTHERBOARD', label: 'Placa Madre', step: 2 },
    { id: 'RAM', label: 'Memoria RAM', step: 3 },
    { id: 'REFRIGERACION', label: 'Refrigeración', step: 4 },
    { id: 'GPU', label: 'Placa de Video', step: 5 },
    { id: 'ALMACENAMIENTO', label: 'Almacenamiento', step: 6 },
    { id: 'FUENTE', label: 'Fuente Poder', step: 7 },
    { id: 'GABINETE', label: 'Gabinete', step: 8 },
    { id: 'MONITOR', label: 'Monitor', step: 9 },
    { id: 'PERIFERICOS', label: 'Periféricos', step: 10 }
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
            if (prev[category]?.id === product.id) {
                const newSelection = { ...prev };
                delete newSelection[category];
                return newSelection;
            }
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
    const currentStepIndex = CATEGORIES.findIndex(c => c.id === activeCategory);
    const progress = ((currentStepIndex + 1) / CATEGORIES.length) * 100;

    const filteredProducts = products.filter(p => p.category === activeCategory);

    const handleAddBuildToCart = () => {
        Object.values(selection).forEach(item => {
            onAddToCart(item, 'ARMA_TU_PC');
        });
        alert('Build transferred to cart module.');
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-accent animate-pulse font-mono text-sm">INITIALIZING_BUILDER_NODE...</div>;

    return (
        <div className="container mx-auto px-4 py-24 max-w-screen-2xl h-screen flex flex-col">
            {/* Header */}
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="font-display font-bold text-3xl text-white">SYSTEM_BUILDER</h2>
                    <p className="text-txt-dim text-sm font-mono mt-2">
                        MODULE: {CATEGORIES.find(c => c.id === activeCategory)?.label}
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-accent font-display text-2xl font-bold">
                        ${totalPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                    <p className="text-[10px] text-txt-dim uppercase tracking-widest mt-1">Estimated Cost</p>
                </div>
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">

                {/* 1. Sidebar Steps */}
                <div className="lg:col-span-2 flex flex-col h-full overflow-y-auto pr-2 scrollbar-none">
                    <div className="space-y-1">
                        {CATEGORIES.map((cat, idx) => {
                            const isSelected = !!selection[cat.id];
                            const isActive = activeCategory === cat.id;

                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`
                                        w-full text-left px-4 py-3 text-xs font-mono uppercase tracking-wider border-l-2 transition-all
                                        ${isActive
                                            ? 'border-accent bg-accent/5 text-white'
                                            : isSelected
                                                ? 'border-success/50 text-success'
                                                : 'border-white/5 text-txt-dim hover:text-white hover:border-white/20'
                                        }
                                    `}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>{idx + 1}. {cat.label}</span>
                                        {isSelected && <span className="text-success">✓</span>}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* 2. Main Product Area */}
                <GlassContainer className="lg:col-span-7 flex flex-col h-full overflow-hidden">
                    {/* Progress Bar */}
                    <div className="h-1 bg-void w-full">
                        <div
                            className="h-full bg-accent transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleSelect(activeCategory, product)}
                                        className={`
                                            group cursor-pointer p-4 rounded-lg border transition-all duration-300
                                            flex items-start gap-4 relative overflow-hidden
                                            ${selection[activeCategory]?.id === product.id
                                                ? 'bg-accent/5 border-accent shadow-[inset_0_0_20px_rgba(0,240,255,0.05)]'
                                                : 'bg-surface border-white/5 hover:border-white/20 hover:bg-surface-highlight'
                                            }
                                        `}
                                    >
                                        <div className="w-16 h-16 bg-black rounded shrink-0 flex items-center justify-center overflow-hidden">
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white text-sm font-medium truncate pr-6">{product.name}</h4>
                                            <p className="text-accent text-xs font-mono mt-1 font-bold">
                                                ${product.price.toLocaleString('es-AR')}
                                            </p>
                                        </div>
                                        {selection[activeCategory]?.id === product.id && (
                                            <div className="absolute top-0 right-0 p-1.5 bg-accent text-black">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center text-txt-dim font-mono text-sm border border-dashed border-white/10 rounded-lg">
                                    // NO_COMPONENTS_DETECTED_IN_SECTOR
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="p-6 border-t border-white/5 bg-void/50 backdrop-blur-sm flex justify-between items-center">
                        <Button variant="ghost" onClick={handlePrev} disabled={currentStepIndex === 0}>
                            ← Previous
                        </Button>
                        <Button variant="secondary" onClick={handleNext} disabled={currentStepIndex === CATEGORIES.length - 1}>
                            Next Step →
                        </Button>
                    </div>
                </GlassContainer>

                {/* 3. Summary Panel */}
                <div className="lg:col-span-3 flex flex-col h-full lg:h-auto gap-4">
                    <GlassContainer className="flex-1 p-6 flex flex-col min-h-0">
                        <h3 className="font-mono text-xs uppercase tracking-widest text-txt-secondary mb-4 pb-2 border-b border-white/5">
                            Manifest
                        </h3>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                            {CATEGORIES.map(cat => {
                                const item = selection[cat.id];
                                if (!item) return null;
                                return (
                                    <div key={cat.id} className="group">
                                        <p className="text-[10px] text-txt-dim uppercase mb-0.5">{cat.label}</p>
                                        <div className="flex justify-between items-baseline">
                                            <p className="text-white text-xs truncate max-w-[120px]">{item.name}</p>
                                            <p className="text-accent text-[10px] font-mono">${item.price.toLocaleString('es-AR')}</p>
                                        </div>
                                    </div>
                                )
                            })}
                            {Object.keys(selection).length === 0 && (
                                <p className="text-txt-dim text-xs italic opacity-50 text-center py-10">System Empty</p>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10">
                            <Button
                                variant="neon"
                                className="w-full py-4 text-xs"
                                onClick={handleAddBuildToCart}
                                disabled={totalPrice === 0}
                            >
                                COMPILE SYSTEM
                            </Button>
                        </div>
                    </GlassContainer>
                </div>

            </div>
        </div>
    );
};

export default PCBuilder;
