import React from 'react';

const Cart = ({ cartItems, onCheckout, onRemove, checkoutDisabled }) => {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="fixed top-20 right-4 w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 z-50 flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-4">
                <h2 className="text-xl font-bold text-slate-100">Your Cart</h2>
                <span className="text-sm text-slate-400">{cartItems.length} items</span>
            </div>

            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p>Your cart is empty</p>
                </div>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {cartItems.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="flex justify-between items-start bg-slate-800/50 p-3 rounded-lg group">
                                <div className="flex-1 min-w-0 mr-4">
                                    <h4 className="text-sm font-medium text-slate-200 truncate">{item.name}</h4>
                                    <p className="text-xs text-slate-400">${item.price.toFixed(2)}</p>
                                </div>
                                {onRemove && (
                                    <button
                                        onClick={() => onRemove(index)}
                                        className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                                        title="Remove"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-slate-700 pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-400">Total</span>
                            <span className="text-2xl font-bold text-blue-400">${total.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={onCheckout}
                            disabled={checkoutDisabled}
                            className={`w-full py-3 px-4 rounded-lg font-bold text-sm transition-all shadow-lg ${checkoutDisabled
                                    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
                                }`}
                        >
                            {checkoutDisabled ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : "Checkout Now"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
