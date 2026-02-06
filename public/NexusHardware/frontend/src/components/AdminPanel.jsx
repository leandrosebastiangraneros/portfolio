import { useEffect, useState } from 'react';
import API_URL from '../config';
import AdminSidebar from './admin/AdminSidebar';
import DashboardModule from './admin/DashboardModule';
import InventoryModule from './admin/InventoryModule';
import TransactionsModule from './admin/TransactionsModule';
import GlassContainer from './common/GlassContainer';

const AdminPanel = ({ username }) => {
    const [activeView, setActiveView] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [optimizationData, setOptimizationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isWakingUp, setIsWakingUp] = useState(false);

    const fetchData = () => {
        const timeout = setTimeout(() => setIsWakingUp(true), 3000);
        const fetchStats = fetch(`${API_URL}/dashboard-stats`).then(res => res.json());
        const fetchOptimization = fetch(`${API_URL}/optimization`).then(res => res.json());

        Promise.all([fetchStats, fetchOptimization])
            .then(([statsData, optData]) => {
                setStats(statsData);
                setOptimizationData(optData);
                setLoading(false);
                clearTimeout(timeout);
                setIsWakingUp(false);
            })
            .catch(err => {
                console.error("Backend Error", err);
                setLoading(false);
                clearTimeout(timeout);
                setIsWakingUp(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-void text-accent font-mono text-sm animate-pulse gap-4">
            <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            <span>{isWakingUp ? 'ESTABLISHING_UPLINK...' : 'INITIALIZING_NEXUS_OS...'}</span>
        </div>
    );

    if (!stats) return <div className="text-center p-10 text-error">System Offline. Check Connection.</div>;

    // Use reverse() once here to avoid doing it in every render if not needed, 
    // but modules handle their own processing mostly.
    const transactions = stats.recent_transactions;

    return (
        <div className="fixed inset-0 pt-20 pb-0 flex overflow-hidden bg-void">
            {/* 1. Sidebar */}
            <AdminSidebar activeView={activeView} onViewChange={setActiveView} />

            {/* 2. Main Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 relative">
                {/* Background Grid for Tech Feel */}
                <div className="absolute inset-0 pointer-events-none opacity-5"
                    style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                {/* Content Shell */}
                <div className="relative z-10 max-w-7xl mx-auto min-h-full flex flex-col">

                    {activeView === 'dashboard' && (
                        <DashboardModule stats={stats} username={username} />
                    )}

                    {activeView === 'inventory' && (
                        <InventoryModule
                            optimizationData={optimizationData}
                            onRefresh={fetchData}
                        />
                    )}

                    {activeView === 'transactions' && (
                        <TransactionsModule transactions={transactions} />
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
