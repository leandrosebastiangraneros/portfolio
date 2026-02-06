import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import GlassContainer from '../common/GlassContainer';

const DashboardModule = ({ stats, username }) => {
    if (!stats) return null;

    const chartData = stats.recent_transactions.map((tx) => ({
        name: `Tx #${tx.transaction_id}`,
        amount: tx.total_value,
        id: tx.transaction_id,
        timestamp: tx.timestamp,
        products: tx.products
    })).reverse();

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="font-display font-bold text-2xl text-white">COMMAND_CENTER</h2>
                    <p className="text-txt-dim text-xs font-mono mt-1">OPERATOR: <span className="text-accent">{username}</span></p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-mono text-txt-dim uppercase tracking-widest">System Status</p>
                    <p className="text-success font-bold text-sm flex items-center justify-end gap-2">
                        <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span> ONLINE
                    </p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <GlassContainer className="p-6">
                    <h3 className="text-[10px] font-mono uppercase tracking-widest text-txt-secondary mb-2">Total Revenue</h3>
                    <p className="text-2xl font-bold text-white tracking-tight">
                        ${stats.total_revenue.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>
                </GlassContainer>

                <GlassContainer className="p-6">
                    <h3 className="text-[10px] font-mono uppercase tracking-widest text-txt-secondary mb-2">Total Sales</h3>
                    <p className="text-2xl font-bold text-white tracking-tight">{stats.sales_count}</p>
                </GlassContainer>

                <GlassContainer className="p-6">
                    <h3 className="text-[10px] font-mono uppercase tracking-widest text-txt-secondary mb-2">7 Day Trend</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-xl font-bold text-white">${stats.revenue_7d?.toLocaleString('es-AR', { minimumFractionDigits: 0 })}</p>
                        <span className="text-xs text-success bg-success/10 px-1.5 py-0.5 rounded">+{stats.sales_7d} tx</span>
                    </div>
                </GlassContainer>

                <GlassContainer className="p-6">
                    <h3 className="text-[10px] font-mono uppercase tracking-widest text-txt-secondary mb-2">30 Day Trend</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-xl font-bold text-white">${stats.revenue_30d?.toLocaleString('es-AR', { minimumFractionDigits: 0 })}</p>
                        <span className="text-xs text-success bg-success/10 px-1.5 py-0.5 rounded">+{stats.sales_30d} tx</span>
                    </div>
                </GlassContainer>
            </div>

            {/* Revenue Chart */}
            <GlassContainer className="p-8 flex flex-col">
                <div className="mb-6 flex justify-between items-end">
                    <h3 className="font-display font-bold text-lg text-white">REVENUE_FLOW</h3>
                    <span className="text-[10px] font-mono text-txt-dim">Real-time Visuals</span>
                </div>

                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#0a0a0f" stopOpacity={0.2} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#ffffff40" fontSize={10} tickFormatter={(val) => `$${val}`} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                                cursor={{ fill: '#ffffff10' }}
                                formatter={(value) => [`$${value.toLocaleString('es-AR')}`, 'Revenue']}
                            />
                            <Bar
                                dataKey="amount"
                                fill="url(#chartGradient)"
                                radius={[4, 4, 0, 0]}
                                animationDuration={1500}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </GlassContainer>
        </div>
    );
};

export default DashboardModule;
