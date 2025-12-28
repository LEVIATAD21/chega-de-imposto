
import React from 'react';
import { Transaction } from '../App';
import { Download, Search, Shield, ArrowUpRight, ArrowDownLeft, RefreshCcw } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  return (
    <div className="glass-panel rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-bold">Ledger History</h3>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search hash..."
              className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sky-500"
            />
          </div>
          <button className="bg-slate-800 border border-slate-700 p-2 rounded-lg hover:bg-slate-700 transition-colors">
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Hash / ID</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Privacy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-medium text-slate-300">Finalized</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-slate-500 group-hover:text-sky-400 transition-colors cursor-pointer">
                      0x{tx.id.substring(0, 8)}...{tx.id.substring(tx.id.length - 4)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${tx.type === 'send' ? 'text-red-400' : tx.type === 'convert' ? 'text-slate-300' : 'text-green-400'}`}>
                      {tx.type === 'send' ? '-' : tx.type === 'convert' ? '' : '+'}{tx.amount} {tx.currency}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {tx.type === 'send' && <ArrowUpRight size={14} className="text-red-400" />}
                      {tx.type === 'receive' && <ArrowDownLeft size={14} className="text-green-400" />}
                      {tx.type === 'convert' && <RefreshCcw size={14} className="text-sky-400" />}
                      <span className="capitalize text-xs text-slate-300">{tx.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    {tx.anonymous ? (
                      <div className="flex items-center space-x-1 text-sky-400/80">
                        <Shield size={14} />
                        <span className="text-[10px] uppercase font-bold tracking-tight">ZK-HIDDEN</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-600 uppercase font-bold tracking-tight">Public</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center opacity-40">
                    <RefreshCcw size={48} className="text-slate-500 mb-4" />
                    <p className="text-sm font-medium">No ledger data available for this session.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
