
import GlassContainer from './common/GlassContainer';
import Button from './common/Button';

const Cart = ({ cartItems, onCheckout, onRemove, checkoutDisabled, onClose }) => {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="fixed inset-y-0 right-0 z-60 w-full md:w-[450px] p-4 flex flex-col pointer-events-none">
            {/* The Outer Glass Container expands to fill the sidebar */}
            <GlassContainer className="flex-1 pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.8)] border-l border-white/10">

                {/* FLEX WRAPPER: Essential to fix the 'flex-1' scrolling issue inside GlassContainer */}
                <div className="flex flex-col h-full w-full">

                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40 shrink-0">
                        <div>
                            <h2 className="font-display font-bold text-xl text-white tracking-widest">ENCRYPTED_VAULT</h2>
                            <span className="text-[10px] font-mono text-txt-dim uppercase">Secure Transaction Node</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-txt-dim hover:text-white hover:bg-white/5 transition-all text-xs"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Items List - SCROLLABLE AREA */}
                    {/* 'scrollbar-hide' class logic implemented via inline style for safety */}
                    <div
                        className="flex-1 overflow-y-auto p-6 space-y-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {/* Webkit scrollbar hidden */}
                        <style>
                            {`
                                .flex-1.overflow-y-auto::-webkit-scrollbar {
                                    display: none;
                                }
                            `}
                        </style>

                        {cartItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-txt-dim opacity-50 space-y-4">
                                <span className="text-4xl">⌀</span>
                                <p className="font-mono text-xs uppercase tracking-widest">Cache Empty</p>
                            </div>
                        ) : (
                            cartItems.map((item, index) => (
                                <div key={`${item.id}-${index}`} className="group relative flex gap-4 p-4 bg-surface border border-white/5 rounded-lg hover:border-white/20 transition-all shrink-0">
                                    {/* Image Placeholder */}
                                    <div className="w-16 h-16 bg-black rounded flex items-center justify-center overflow-hidden shrink-0">
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover opacity-80" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-white truncate pr-6">{item.name}</h4>
                                        <p className="text-xs text-accent font-mono mt-1">${item.price.toLocaleString('es-AR')}</p>
                                    </div>

                                    {onRemove && (
                                        <button
                                            onClick={() => onRemove(index)}
                                            className="absolute top-2 right-2 text-txt-dim hover:text-error transition-colors p-1"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer - STICKY/FIXED BOTTOM */}
                    <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-md shrink-0 z-20">
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-mono text-xs text-txt-secondary uppercase tracking-widest">Total Value</span>
                            <span className="font-display font-bold text-2xl text-white">
                                ${total.toLocaleString('es-AR')}
                            </span>
                        </div>

                        <Button
                            variant="neon"
                            size="lg"
                            className="w-full"
                            onClick={onCheckout}
                            disabled={checkoutDisabled || cartItems.length === 0}
                        >
                            {checkoutDisabled ? 'PROCESSING_TRANSACTION...' : 'INITIATE_TRANSFER'}
                        </Button>
                    </div>
                </div>
            </GlassContainer>
        </div>
    );
};

export default Cart;
