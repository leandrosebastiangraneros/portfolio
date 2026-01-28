import React, { useState } from 'react';
import API_URL from '../config';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                onLogin(data.username);
            } else {
                const errData = await response.json();
                setError(errData.detail || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Ensure backend is running.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Nexus Hardware</h2>
                <h3 className="text-xl text-slate-300 mb-6 text-center">Iniciar Sesión</h3>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 mb-1 text-sm">Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Usuario"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-1 text-sm">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Contraseña"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition-colors"
                    >
                        Entrar
                    </button>
                </form>
                <div className="mt-4 text-center text-xs text-slate-500">
                    Default: admin / admin123
                </div>
            </div>
        </div>
    );
};

export default Login;
