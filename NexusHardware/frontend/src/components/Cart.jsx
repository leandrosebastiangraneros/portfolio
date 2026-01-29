import React from 'react';

const Cart = ({ cartItems, onCheckout, onRemove, checkoutDisabled }) => {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="fixed top-24 right-6 w-96 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 z-50 flex flex-col max-h-[80vh] animate-fade-in-down">
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                <h2 className="text-xl font-bold text-slate-100 tracking-tight">Tu Carrito</h2>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold border border-blue-500/20">{cartItems.length} items</span>
            </div>

            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="font-medium">Tu carrito está vacío</p>
                </div>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {cartItems.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="flex justify-between items-start bg-slate-800/30 border border-white/5 p-4 rounded-2xl group hover:bg-slate-800/50 transition-colors">
                                <div className="flex-1 min-w-0 mr-4">
                                    <h4 className="text-sm font-semibold text-slate-200 truncate">{item.name}</h4>
                                    <p className="text-xs text-blue-400 mt-1 font-medium">${item.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
                                </div>
                                {onRemove && (
                                    <button
                                        onClick={() => onRemove(index)}
                                        className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all"
                                        title="Eliminar"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pt-6">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-slate-400 font-medium">Total Estimado</span>
                            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                        </div>

                        <button
                            onClick={onCheckout}
                            disabled={checkoutDisabled}
                            className={`w-full py-4 px-6 rounded-2xl font-bold text-sm transition-all shadow-xl ${checkoutDisabled
                                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5"
                                : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                                }`}
                        >
                            {checkoutDisabled ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando Pago...
                                </span>
                            ) : "Confirmar Compra"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
