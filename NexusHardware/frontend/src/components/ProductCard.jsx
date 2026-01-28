import React from 'react';

const ProductCard = ({ name, price, category, image_url, onAddToCart, product }) => {
    // Manejo las props actualizadas si se pasan como objeto completo product o props individuales
    const pName = product?.name || name;
    const pPrice = product?.price || price;
    const pCategory = product?.category || category;
    const pImg = product?.image_url || image_url;
    const pStock = product?.stock !== undefined ? product.stock : 10; // Fallback stock

    return (
        <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
            <div className="relative h-48 overflow-hidden bg-slate-900">
                <img
                    src={pImg}
                    alt={pName}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image' }}
                />
                <div className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-300">
                    {pCategory}
                </div>
                {pStock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-red-500 font-bold border-2 border-red-500 px-4 py-2 rounded rotate-12 uppercase tracking-wider">Out of Stock</span>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-100 mb-1 leading-tight">{pName}</h3>
                <div className="flex justify-between items-end mt-auto pt-4">
                    <span className="text-2xl font-bold text-blue-400">${Number(pPrice).toFixed(2)}</span>
                    <button
                        onClick={onAddToCart}
                        disabled={pStock === 0}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${pStock > 0
                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        {pStock > 0 ? 'Add to Cart' : 'Sold Out'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
