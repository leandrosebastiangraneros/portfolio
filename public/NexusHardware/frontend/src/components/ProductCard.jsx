import React, { useState } from 'react';
import GlassContainer from './common/GlassContainer';
import Button from './common/Button';

const ProductCard = ({ product, onAddToCart }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Default fallback
    const {
        name = "Unknown Component",
        price = 0,
        category = "Hardware",
        image_url = "https://via.placeholder.com/300",
        stock = 0
    } = product || {};

    const formattedPrice = Number(price).toLocaleString('es-AR', { minimumFractionDigits: 2 });

    return (
        <GlassContainer
            className="group h-[420px] flex flex-col p-0 transition-all duration-500 hover:-translate-y-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            hoverEffect={true}
        >
            {/* Image Section */}
            <div className="relative h-56 w-full bg-surface-highlight overflow-hidden flex items-center justify-center">
                {/* Image */}
                <img
                    src={image_url}
                    alt={name}
                    className="w-3/4 h-3/4 object-contain transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3 drop-shadow-2xl"
                    loading="lazy"
                />

                {/* Category Tag (Top Right) */}
                <span className="absolute top-4 right-4 text-[10px] font-mono font-bold tracking-widest text-txt-dim border border-white/5 px-2 py-1 rounded bg-black/40 backdrop-blur-sm uppercase">
                    {category}
                </span>

                {/* Stock Warning Overlay */}
                {stock === 0 && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] z-20 flex items-center justify-center">
                        <span className="text-error border border-error/50 px-4 py-2 font-mono text-xs tracking-widest uppercase">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col p-6 relative">
                {/* Header */}
                <div className="mb-auto">
                    <h3 className="font-sans font-medium text-white text-lg leading-tight mb-2 group-hover:text-accent transition-colors">
                        {name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-success/80 shadow-[0_0_8px_#10b981]"></span>
                        <span className="text-[10px] text-txt-secondary uppercase tracking-wider font-mono">
                            {stock > 0 ? `${stock} Units Available` : 'Offline'}
                        </span>
                    </div>
                </div>

                {/* Footer / Action */}
                <div className="relative mt-6 pt-6 border-t border-white/5 flex items-end justify-between overflow-hidden">
                    {/* Price */}
                    <div className={`transition-all duration-300 ${isHovered ? 'translate-y-[-120%] opacity-0' : 'translate-y-0 opacity-100'}`}>
                        <span className="text-txt-dim text-[10px] block uppercase font-mono mb-1">Price</span>
                        <span className="font-display font-bold text-xl text-white tracking-wide">
                            ${formattedPrice}
                        </span>
                    </div>

                    {/* Add to Cart Button (Slides up on hover) */}
                    <div className={`absolute inset-x-0 bottom-0 transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-[150%]'}`}>
                        <Button
                            variant="primary"
                            className="w-full text-xs py-3"
                            disabled={stock === 0}
                            onClick={onAddToCart}
                        >
                            {stock > 0 ? 'Add to build' : 'Notify Me'}
                        </Button>
                    </div>

                    {/* Fallback 'View' text when not hovered */}
                    <div className={`transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                        <span className="text-accent text-xl">→</span>
                    </div>
                </div>
            </div>
        </GlassContainer>
    );
};

export default ProductCard;
