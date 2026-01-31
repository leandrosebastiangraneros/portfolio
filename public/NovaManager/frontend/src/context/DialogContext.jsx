import React, { createContext, useContext, useState, useRef } from 'react';

const DialogContext = createContext();

export const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
};

export const DialogProvider = ({ children }) => {
    // Alert State
    const [alertState, setAlertState] = useState({ isOpen: false, message: '', type: 'info' }); // type: info, error, success

    // Confirm State
    const [confirmState, setConfirmState] = useState({ isOpen: false, message: '', title: 'Confirmar Acción' });
    const confirmResolver = useRef(null);

    // --- ALERT LOGIC ---
    const showAlert = (message, type = 'info') => {
        setAlertState({ isOpen: true, message, type });
        // Auto dismiss after 3 seconds for simple info/success
        if (type !== 'error') {
            setTimeout(() => {
                setAlertState(prev => ({ ...prev, isOpen: false }));
            }, 3000);
        }
    };

    const closeAlert = () => setAlertState(prev => ({ ...prev, isOpen: false }));

    // --- CONFIRM LOGIC ---
    const showConfirm = (message, title = 'Confirmar Acción') => {
        setConfirmState({ isOpen: true, message, title });
        return new Promise((resolve) => {
            confirmResolver.current = resolve;
        });
    };

    const handleConfirm = (value) => {
        setConfirmState(prev => ({ ...prev, isOpen: false }));
        if (confirmResolver.current) {
            confirmResolver.current(value);
            confirmResolver.current = null;
        }
    };

    return (
        <DialogContext.Provider value={{ showAlert, showConfirm }}>
            {children}

            {/* --- UI: ALERT MODAL (Toast Style) --- */}
            {alertState.isOpen && (
                <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-right fade-in duration-300">
                    <div className={`p-4 rounded-xl shadow-2xl border flex items-center gap-3 min-w-[300px] bg-slate-800 ${alertState.type === 'error' ? 'border-red-500/50 shadow-red-900/20' :
                            alertState.type === 'success' ? 'border-green-500/50 shadow-green-900/20' :
                                'border-blue-500/50 shadow-blue-900/20'
                        }`}>
                        <div className={`p-2 rounded-full ${alertState.type === 'error' ? 'bg-red-500/10 text-red-500' :
                                alertState.type === 'success' ? 'bg-green-500/10 text-green-500' :
                                    'bg-blue-500/10 text-blue-500'
                            }`}>
                            {alertState.type === 'error' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            {alertState.type === 'success' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                            {alertState.type === 'info' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        </div>
                        <div className="flex-1">
                            <h4 className={`font-bold ${alertState.type === 'error' ? 'text-red-400' :
                                    alertState.type === 'success' ? 'text-green-400' :
                                        'text-blue-400'
                                }`}>
                                {alertState.type === 'error' ? 'Error' :
                                    alertState.type === 'success' ? 'Éxito' : 'Información'}
                            </h4>
                            <p className="text-slate-300 text-sm">{alertState.message}</p>
                        </div>
                        <button onClick={closeAlert} className="text-slate-500 hover:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* --- UI: CONFIRM MODAL --- */}
            {confirmState.isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 transition-opacity animate-in fade-in duration-200">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-700 animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-6 text-white flex justify-between items-center bg-gradient-to-r from-violet-600 to-indigo-700">
                            <h2 className="text-xl font-bold tracking-tight">{confirmState.title}</h2>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <p className="text-slate-300 text-lg leading-relaxed">{confirmState.message}</p>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-slate-900/50 flex gap-3">
                            <button
                                onClick={() => handleConfirm(false)}
                                className="flex-1 py-3 text-slate-400 font-bold hover:bg-slate-700 hover:text-white rounded-xl transition-colors uppercase tracking-wider text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleConfirm(true)}
                                className="flex-1 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:bg-slate-200 transition-all uppercase tracking-wider text-sm transform active:scale-95"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DialogContext.Provider>
    );
};
