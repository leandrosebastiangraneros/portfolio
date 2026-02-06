import { useState } from 'react';
import API_URL from '../config';
import GlassContainer from './common/GlassContainer';
import Button from './common/Button';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // Artificial delay for effect
                setTimeout(() => {
                    onLogin(data.username);
                }, 800);
            } else {
                const errData = await response.json();
                setError(errData.detail || 'Login failed');
                setIsLoading(false);
            }
        } catch {
            setError('Network error. Ensure backend is running.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-void relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="w-full max-w-md p-4 relative z-10">
                <GlassContainer className="p-8 border-t border-white/20">
                    <div className="text-center mb-10">
                        <h2 className="font-display font-bold text-3xl text-white tracking-widest mb-2">NEXUS<span className="text-accent">OS</span></h2>
                        <p className="font-mono text-[10px] text-txt-dim uppercase tracking-[0.2em]">Secure Terminal Access</p>
                    </div>

                    {error && (
                        <div className="bg-error/10 border border-error/50 text-error p-3 rounded mb-6 text-xs font-mono text-center animate-pulse">
                            ⚠ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-mono text-txt-dim uppercase tracking-wider">Operator ID</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black/20 border-b border-white/10 p-3 text-white text-sm focus:border-accent outline-none transition-all placeholder-white/10 font-mono"
                                placeholder="ENTER_ID"
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-mono text-txt-dim uppercase tracking-wider">Passcode</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/20 border-b border-white/10 p-3 text-white text-sm focus:border-accent outline-none transition-all placeholder-white/10 font-mono"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="pt-4">
                            <Button
                                variant="primary"
                                className="w-full justify-center group relative overflow-hidden"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="animate-pulse">AUTHENTICATING...</span>
                                ) : (
                                    <>
                                        <span className="relative z-10">INITIALIZE_SESSION</span>
                                        <div className="absolute inset-0 bg-accent/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-[10px] text-txt-dim font-mono">
                            AUTHORIZED PERSONNEL ONLY <br />
                            <span className="opacity-50">System v2.4.0</span>
                        </p>
                    </div>
                </GlassContainer>
            </div>
        </div>
    );
};

export default Login;
