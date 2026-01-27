import React from 'react';

const Cart = ({ cartItems, onCheckout, onRemove, checkoutDisabled }) => {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="fixed top-24 right-8 w-80 bg-black/80 backdrop-blur-xl border border-accent-purple/50 rounded-lg shadow-[0_0_30px_rgba(157,78,221,0.2)] p-4 z-50">
            <h2 className="text-xl font-bold text-accent-cyan border-b border-accent-purple/50 pb-2 mb-4 font-display tracking-widest">
                SYSTEM_CART
            </h2>

            {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4 font-mono text-sm">Waiting for input...</p>
            ) : (
                <>
                    <div className="max-h-60 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-accent-purple scrollbar-track-black">
                        {cartItems.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="flex justify-between items-center bg-white/5 p-2 mb-2 rounded border border-white/10 hover:border-accent-cyan/30 transition-colors">
                                <span className="text-sm truncate w-2/3 font-mono text-gray-300" title={item.name}>{item.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-accent-cyan font-mono text-xs">${item.price.toFixed(0)}</span>
                                    {onRemove && (
                                        <button
                                            onClick={() => onRemove(index)}
                                            className="text-red-500 hover:text-red-400 text-xs font-bold font-mono"
                                        >
                                            [X]
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center border-t border-accent-purple/50 pt-3 mb-4">
                        <span className="font-bold font-display tracking-wider">TOTAL_SUM:</span>
                        <span className="text-xl font-mono text-accent-cyan">${total.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={onCheckout}
                        disabled={checkoutDisabled}
                        className={`w-full py-2 px-4 rounded font-bold font-mono tracking-widest transition duration-200 border ${checkoutDisabled
                                ? "bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed"
                                : "bg-accent-purple/20 border-accent-purple text-accent-cyan hover:bg-accent-purple hover:text-white hover:shadow-[0_0_15px_rgba(157,78,221,0.5)]"
                            }`}
                    >
                        {checkoutDisabled ? "PROCESSING..." : "INIT_CHECKOUT"}
                    </button>
                </>
            )}
        </div>
    );
};

export default Cart;
