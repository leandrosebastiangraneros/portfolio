import React from 'react';

const ProductCard = ({ name, price, category, image_url, onAddToCart }) => {
    return (
        <div className="bg-black/40 backdrop-blur-md border border-accent-purple/50 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(157,78,221,0.1)] transform transition duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(157,78,221,0.3)] group">
            <div className="h-48 overflow-hidden relative">
                <img
                    src={image_url}
                    alt={name}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute top-0 right-0 bg-accent-purple text-white text-xs font-bold px-2 py-1 rounded-bl-lg font-mono tracking-wider">
                    {category}
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2 truncate font-display tracking-wide" title={name}>{name}</h3>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-accent-cyan font-mono text-xl font-bold shadow-cyan-glow">
                        ${price.toFixed(2)}
                    </span>
                    <button
                        onClick={() => onAddToCart({ name, price, id: Date.now() })}
                        className="bg-accent-purple/20 hover:bg-accent-purple text-accent-cyan hover:text-white border border-accent-purple hover:border-transparent font-bold py-1 px-4 rounded transition duration-200 font-mono tracking-wider"
                    >
                        ADD_TO_CART
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
