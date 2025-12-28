
import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, RefreshCw, AlertCircle, TrendingUp, Zap, HelpCircle } from 'lucide-react';
import { CurrencyCode } from '../App';

interface ConverterProps {
  balances: Record<CurrencyCode, number>;
  onComplete: (from: CurrencyCode, to: CurrencyCode, amountFrom: number, amountTo: number) => void;
}

const Converter: React.FC<ConverterProps> = ({ balances, onComplete }) => {
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('BRL');
  const [toCurrency, setToCurrency] = useState<CurrencyCode>('USD');
  const [amount, setAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(0.1824);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tickerOffset, setTickerOffset] = useState(0);

  // Simulated live market flux
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerOffset(prev => (Math.random() - 0.5) * 0.001);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Mock exchange rates logic (Interbank base rates)
  useEffect(() => {
    const rates: Record<string, number> = {
      'BRL-USD': 0.1812,
      'USD-BRL': 5.5182,
      'BRL-BTC': 0.00000284,
      'BTC-BRL': 352104.22,
      'USD-BTC': 0.00001567,
      'BTC-USD': 63821.44,
      'ETH-USD': 2488.12,
      'USD-ETH': 0.0004019,
      'ETH-BRL': 13732.45,
      'BRL-ETH': 0.0000728,
      'BRL-BRL': 1,
      'USD-USD': 1,
      'BTC-BTC': 1,
      'ETH-ETH': 1,
    };
    
    const baseRate = rates[`${fromCurrency}-${toCurrency}`] || 1;
    setExchangeRate(baseRate + tickerOffset);
  }, [fromCurrency, toCurrency, tickerOffset]);

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const executeTrade = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setIsProcessing(true);
    
    // Simulate instant atomic swap on blockchain
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    const amountFrom = parseFloat(amount);
    const amountTo = amountFrom * exchangeRate;
    
    onComplete(fromCurrency, toCurrency, amountFrom, amountTo);
    setAmount('');
    setIsProcessing(false);
  };

  const calculatedValue = (parseFloat(amount) || 0) * exchangeRate;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="glass-panel rounded-[2rem] p-8 border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Animated Background Pulse */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[100px] pointer-events-none" />
        
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-black tracking-tight flex items-center">
              Nexus DEX
              <Zap className="ml-2 text-yellow-400 fill-yellow-400" size={16} />
            </h3>
            <p className="text-slate-500 text-xs font-medium">Decentralized Atomic Swaps</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="bg-emerald-500/10 text-emerald-400 text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest border border-emerald-500/20">
              0% Swap Fee
            </div>
            <span className="text-[10px] text-slate-500 mt-1 flex items-center">
              Interbank Spread Only <HelpCircle size={10} className="ml-1" />
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {/* Sell Panel */}
          <div className="bg-slate-900/40 p-6 rounded-[1.5rem] border border-slate-800/50 group focus-within:border-sky-500/50 transition-all">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">You Sell</span>
              <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                Available: {balances[fromCurrency].toLocaleString(undefined, { maximumFractionDigits: fromCurrency === 'BTC' ? 8 : 2 })} {fromCurrency}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-3xl font-bold focus:outline-none placeholder:text-slate-700"
              />
              <button 
                onClick={() => setAmount(balances[fromCurrency].toString())}
                className="text-[10px] font-bold text-sky-400 hover:text-sky-300 transition-colors bg-sky-500/10 px-2 py-1 rounded"
              >
                MAX
              </button>
              <select 
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
                className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-black border-none outline-none cursor-pointer transition-colors appearance-none pr-8 relative"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m19 9-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '16px' }}
              >
                <option value="BRL">BRL</option>
                <option value="USD">USD</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
              </select>
            </div>
          </div>

          {/* Centered Swap Button */}
          <div className="flex justify-center -my-6 relative z-10">
            <button 
              onClick={handleSwapCurrencies}
              className="bg-slate-950 border-4 border-slate-900 p-3 rounded-2xl text-sky-400 hover:scale-110 active:rotate-180 transition-all duration-500 shadow-xl"
            >
              <ArrowRightLeft className="rotate-90" size={24} />
            </button>
          </div>

          {/* Buy Panel */}
          <div className="bg-slate-900/40 p-6 rounded-[1.5rem] border border-slate-800/50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">You Receive</span>
            </div>
            <div className="flex items-center justify-between">
              <div className={`text-3xl font-bold transition-all ${calculatedValue > 0 ? 'text-white' : 'text-slate-700'}`}>
                {calculatedValue.toLocaleString(undefined, { minimumFractionDigits: toCurrency === 'BTC' ? 8 : 2 })}
              </div>
              <select 
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
                className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-black border-none outline-none cursor-pointer transition-colors appearance-none pr-8 relative"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m19 9-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '16px' }}
              >
                <option value="USD">USD</option>
                <option value="BRL">BRL</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
              </select>
            </div>
          </div>
        </div>

        {/* Rate Ticker Card */}
        <div className="mt-8 bg-slate-950/50 rounded-2xl p-4 flex items-center justify-between border border-slate-800/50">
           <div className="flex items-center space-x-3">
             <div className="bg-sky-500/20 p-2 rounded-lg">
               <TrendingUp size={16} className="text-sky-400" />
             </div>
             <div>
               <p className="text-[10px] text-slate-500 font-bold uppercase">Real-Time Ledger Rate</p>
               <p className="text-xs font-mono font-bold text-slate-300">
                 1 {fromCurrency} = {exchangeRate.toFixed(fromCurrency === 'BTC' ? 2 : 6)} {toCurrency}
               </p>
             </div>
           </div>
           <button className="p-2 text-slate-500 hover:text-sky-400 transition-colors">
             <RefreshCw size={14} className={isProcessing ? 'animate-spin' : ''} />
           </button>
        </div>

        <button 
          disabled={isProcessing || !amount || parseFloat(amount) > balances[fromCurrency]}
          onClick={executeTrade}
          className={`w-full mt-6 py-5 rounded-2xl font-black text-lg transition-all relative overflow-hidden group ${
            isProcessing || !amount || parseFloat(amount) > balances[fromCurrency]
            ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white shadow-2xl shadow-sky-500/20 active:scale-95'
          }`}
        >
          {isProcessing ? 'Finalizing Atomic Swap...' : 'Execute Exchange'}
          <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
        </button>

        {amount && parseFloat(amount) > balances[fromCurrency] && (
          <div className="flex items-center space-x-2 text-red-400 text-[10px] font-bold justify-center mt-4 uppercase tracking-widest">
            <AlertCircle size={12} />
            <span>Ledger Error: Insufficient Reserves</span>
          </div>
        )}
      </div>

      <p className="text-[10px] text-center text-slate-600 px-8 leading-relaxed">
        Nexus Ledger utilizes an <span className="text-slate-400 font-medium">Automated Market Maker (AMM)</span> protocol ensuring you always get the best price available across global decentralized liquidity pools. 
        Settlement is near-instant and recorded on the immutable mainnet.
      </p>
    </div>
  );
};

export default Converter;
