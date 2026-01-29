import React from 'react';

const ProductCard = ({ name, price, category, image_url, onAddToCart, product }) => {
    // Manejo las props actualizadas si se pasan como objeto completo product o props individuales
    const pName = product?.name || name;
    const pPrice = product?.price || price;
    const pCategory = product?.category || category;
    const pImg = product?.image_url || image_url;
    const pStock = product?.stock !== undefined ? product.stock : 10; // Fallback stock

    return (
        <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group flex flex-col h-full hover:-translate-y-2">
            <div className="relative h-48 overflow-hidden bg-slate-900/50">
                <img
                    src={pImg}
                    alt={pName}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image' }}
                />
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-300 border border-white/10 shadow-lg">
                    {pCategory}
                </div>
                {pStock === 0 && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-red-400 font-bold border-2 border-red-500/50 bg-red-500/10 px-6 py-2 rounded-xl rotate-[-12deg] uppercase tracking-widest shadow-lg">Out of Stock</span>
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50 pointer-events-none"></div>
                <h3 className="text-lg font-bold text-slate-100 mb-2 leading-tight z-10">{pName}</h3>
                <div className="flex justify-between items-end mt-auto pt-4 z-10">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 uppercase tracking-wider">Precio</span>
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                            ${Number(pPrice).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                    <button
                        onClick={onAddToCart}
                        disabled={pStock === 0}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${pStock > 0
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25 hover:shadow-blue-500/40'
                            : 'bg-slate-700/50 text-slate-500 cursor-not-allowed border border-white/5'
                            }`}
                    >
                        {pStock > 0 ? 'Agregar' : 'Agotado'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
