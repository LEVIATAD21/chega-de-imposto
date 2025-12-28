
import React from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowRight } from 'lucide-react';
import { CurrencyCode, Transaction } from '../App';

interface DashboardProps {
  balances: Record<CurrencyCode, number>;
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ balances, transactions }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BalanceCard label="Brazilian Real" value={balances.BRL} code="BRL" symbol="R$" color="bg-green-500" />
        <BalanceCard label="US Dollar" value={balances.USD} code="USD" symbol="$" color="bg-blue-500" />
        <BalanceCard label="Bitcoin" value={balances.BTC} code="BTC" symbol="₿" color="bg-orange-500" />
        <BalanceCard label="Ethereum" value={balances.ETH} code="ETH" symbol="Ξ" color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Insights Placeholder */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Ledger Activity</h3>
            <span className="text-xs text-slate-500 px-2 py-1 bg-slate-800 rounded-md">Live Node Status: Online</span>
          </div>
          <div className="h-64 flex items-end space-x-4 px-2">
             {[40, 70, 45, 90, 65, 80, 50, 60, 85, 45, 55, 75].map((h, i) => (
               <div key={i} className="flex-1 bg-sky-500/20 rounded-t-lg relative group transition-all hover:bg-sky-500/40" style={{ height: `${h}%` }}>
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h * 123}v
                 </div>
               </div>
             ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-slate-500">
            <span>Jan</span>
            <span>Mar</span>
            <span>May</span>
            <span>Jul</span>
            <span>Sep</span>
            <span>Nov</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${tx.type === 'send' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                      {tx.type === 'send' ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.type === 'send' ? `Sent to ${tx.anonymous ? 'Hidden' : tx.to}` : 'Received'}</p>
                      <p className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${tx.type === 'send' ? 'text-red-400' : 'text-green-400'}`}>
                      {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.currency}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-500 text-sm">No activity yet.</p>
              </div>
            )}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-sky-400 hover:text-sky-300 flex items-center justify-center space-x-1 transition-colors">
            <span>View all</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const BalanceCard: React.FC<{ label: string, value: number, code: string, symbol: string, color: string }> = ({ label, value, code, symbol, color }) => (
  <div className="glass-panel rounded-2xl p-5 hover:border-slate-700 transition-all cursor-default group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-xl ${color}`}>
        <Wallet className="text-white" size={20} />
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{code}</span>
    </div>
    <p className="text-slate-400 text-xs mb-1 font-medium">{label}</p>
    <div className="flex items-baseline space-x-1">
      <span className="text-slate-500 text-sm font-medium">{symbol}</span>
      <h4 className="text-2xl font-bold group-hover:scale-105 transition-transform origin-left">
        {value.toLocaleString(undefined, { minimumFractionDigits: code === 'BRL' || code === 'USD' ? 2 : 4 })}
      </h4>
    </div>
  </div>
);

export default Dashboard;
