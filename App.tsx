
import React, { useState, useEffect } from 'react';
import { Layout, Wallet, ArrowRightLeft, Send, History, Settings, User, ShieldCheck, QrCode } from 'lucide-react';
import Dashboard from './components/Dashboard';
import PixPayment from './components/PixPayment';
import Converter from './components/Converter';
import TransactionHistory from './components/TransactionHistory';

export type CurrencyCode = 'BRL' | 'USD' | 'BTC' | 'ETH';

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'convert';
  amount: number;
  currency: CurrencyCode;
  timestamp: number;
  status: 'completed' | 'pending';
  to?: string;
  from?: string;
  anonymous?: boolean;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pix' | 'convert' | 'history'>('dashboard');
  const [balances, setBalances] = useState<Record<CurrencyCode, number>>({
    BRL: 5000.00,
    USD: 1250.00,
    BTC: 0.045,
    ETH: 1.2
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
    
    // Update balance
    setBalances(prev => {
      const newBalances = { ...prev };
      if (tx.type === 'send') {
        newBalances[tx.currency] -= tx.amount;
      } else if (tx.type === 'receive') {
        newBalances[tx.currency] += tx.amount;
      }
      return newBalances;
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-200">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 glass-panel flex flex-col p-4 space-y-2 border-r border-slate-800">
        <div className="flex items-center space-x-3 p-4 mb-6">
          <div className="bg-sky-500 p-2 rounded-xl">
            <ShieldCheck className="text-white h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold gradient-text">Nexus Ledger</h1>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem 
            icon={<Layout size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<Send size={20} />} 
            label="PIX & Payments" 
            active={activeTab === 'pix'} 
            onClick={() => setActiveTab('pix')} 
          />
          <NavItem 
            icon={<ArrowRightLeft size={20} />} 
            label="Currency Swap" 
            active={activeTab === 'convert'} 
            onClick={() => setActiveTab('convert')} 
          />
          <NavItem 
            icon={<History size={20} />} 
            label="History" 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
          />
        </nav>

        <div className="pt-4 border-t border-slate-800 space-y-1">
          <NavItem icon={<Settings size={20} />} label="Settings" onClick={() => {}} />
          <NavItem icon={<User size={20} />} label="Profile" onClick={() => {}} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold capitalize">{activeTab}</h2>
            <p className="text-slate-400 text-sm">Welcome back to your decentralized vault.</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-slate-800 transition-colors">
              <QrCode size={24} />
            </button>
            <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <User size={20} />
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard balances={balances} transactions={transactions.slice(0, 5)} />
          )}
          {activeTab === 'pix' && (
            <PixPayment balances={balances} onComplete={addTransaction} />
          )}
          {activeTab === 'convert' && (
            <Converter balances={balances} onComplete={(from, to, amountFrom, amountTo) => {
              setBalances(prev => ({
                ...prev,
                [from]: prev[from] - amountFrom,
                [to]: prev[to] + amountTo
              }));
              addTransaction({
                id: Math.random().toString(36).substr(2, 9),
                type: 'convert',
                amount: amountFrom,
                currency: from,
                timestamp: Date.now(),
                status: 'completed'
              });
            }} />
          )}
          {activeTab === 'history' && (
            <TransactionHistory transactions={transactions} />
          )}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  onClick: () => void; 
}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export default App;
