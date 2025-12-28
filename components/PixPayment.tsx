
import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Shield, ShieldOff, Info, CheckCircle2, Camera, X, FileText, Share2, Lock, Copy } from 'lucide-react';
import { CurrencyCode, Transaction } from '../App';

interface PixPaymentProps {
  balances: Record<CurrencyCode, number>;
  onComplete: (tx: Transaction) => void;
}

const PixPayment: React.FC<PixPaymentProps> = ({ balances, onComplete }) => {
  const [pixKey, setPixKey] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('BRL');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [lastTx, setLastTx] = useState<Transaction | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (showScanner) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(err => console.error("Camera access denied", err));
    }
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [showScanner]);

  const handlePayment = async () => {
    if (!pixKey || !amount) return;
    setIsProcessing(true);
    
    // Simulate Blockchain Consensus & Zero-Knowledge Verification
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 12).toUpperCase(),
      type: 'send',
      amount: parseFloat(amount),
      currency: currency,
      timestamp: Date.now(),
      status: 'completed',
      to: pixKey,
      anonymous: isAnonymous
    };
    
    setLastTx(tx);
    onComplete(tx);
    setIsProcessing(false);
    setIsFinished(true);
  };

  const simulateScan = () => {
    // In a real app, this would decode the QR. Here we simulate finding a key.
    setIsProcessing(true);
    setTimeout(() => {
      setPixKey('nexus-vault-8829-hash');
      setAmount('150.00');
      setShowScanner(false);
      setIsProcessing(false);
    }, 1500);
  };

  if (showNote && lastTx) {
    return (
      <div className="max-w-md mx-auto animate-in zoom-in duration-300">
        <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-sky-500/20">
          <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon />
              <span className="font-bold tracking-tighter">NEXUS LEDGER CERTIFICATE</span>
            </div>
            <button onClick={() => setShowNote(false)} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction Status</p>
              <h4 className="text-2xl font-black text-green-600">VERIFIED ON-CHAIN</h4>
              <p className="text-[10px] font-mono text-slate-500 break-all">SIG_ED25519_{Math.random().toString(16).slice(2)}...</p>
            </div>

            <div className="border-y border-slate-100 py-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Amount Sent</span>
                <span className="text-sm font-bold">{lastTx.amount} {lastTx.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Destination</span>
                <span className="text-sm font-mono truncate ml-4">{lastTx.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Privacy Mode</span>
                <span className="text-sm font-semibold text-sky-600">{lastTx.anonymous ? 'Zero-Knowledge' : 'Standard'}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2">
              <p className="text-[10px] text-slate-400 leading-tight">
                This note is cryptographically signed by the sender's private key. Only the sender can generate this proof of payment. Verified by Nexus Decentralized Protocol.
              </p>
              <div className="flex justify-center pt-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                   <QrCode size={100} className="text-slate-900" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 flex gap-2">
            <button className="flex-1 flex items-center justify-center space-x-2 bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 transition-colors">
              <Share2 size={16} />
              <span className="text-sm font-bold">Share Note</span>
            </button>
            <button className="flex-1 flex items-center justify-center space-x-2 border border-slate-200 py-3 rounded-xl hover:bg-white transition-colors">
              <Copy size={16} />
              <span className="text-sm font-bold">Copy Hash</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="glass-panel max-w-lg mx-auto rounded-3xl p-10 text-center animate-in zoom-in duration-300">
        <div className="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-green-500 h-10 w-10" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Payment Dispatched</h3>
        <p className="text-slate-400 mb-8">
          The transaction has been broadcasted to the decentralized ledger. 
          {isAnonymous ? " Your identity remains encrypted using ZK-Proofs." : " Identity shared with recipient node."}
        </p>
        
        <div className="bg-slate-800/50 rounded-xl p-4 mb-8 text-left space-y-2 border border-slate-700">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Block Hash</span>
            <span className="font-mono text-sky-400">0x{lastTx?.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Key Type</span>
            <span className="text-slate-200 font-medium">Auto-detected PIX</span>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => setShowNote(true)}
            className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-slate-200 transition-all shadow-xl"
          >
            <FileText size={20} />
            <span>Generate Confirmation Note</span>
          </button>
          <button 
            onClick={() => setIsFinished(false)}
            className="w-full text-slate-400 hover:text-white font-medium py-2 transition-all"
          >
            Back to Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-sky-500/20 p-2 rounded-lg">
              <Lock className="text-sky-500" size={24} />
            </div>
            <h3 className="text-xl font-bold">Private PIX Gateway</h3>
          </div>
          <button 
            onClick={() => setShowScanner(true)}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Camera size={18} />
            <span>Scan QR</span>
          </button>
        </div>

        {showScanner ? (
          <div className="mb-8 rounded-2xl overflow-hidden relative aspect-video bg-black border-2 border-sky-500/50">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-sky-400 rounded-3xl animate-pulse flex items-center justify-center">
                <div className="w-full h-0.5 bg-sky-400/30 animate-scan" />
              </div>
            </div>
            <div className="absolute top-4 right-4 flex space-x-2">
              <button onClick={simulateScan} className="bg-sky-500 text-white px-3 py-1 rounded-lg text-xs font-bold">Simulate Scan</button>
              <button onClick={() => setShowScanner(false)} className="bg-slate-900/80 p-2 rounded-full text-white"><X size={18} /></button>
            </div>
            <p className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-sky-400 font-bold tracking-widest uppercase">Align QR Code to Pay</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-top-2">
            {/* Key Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-400 mb-2">Recipient PIX Key</label>
              <input 
                type="text" 
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="CPF, Email, Phone, or Random Key"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-4 focus:outline-none focus:border-sky-500 transition-colors text-lg"
              />
              <div className="absolute right-4 top-10 flex space-x-2">
                 <span className="text-[10px] bg-slate-700 px-2 py-1 rounded text-slate-400 font-bold uppercase">Auto-Detect</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Amount to Send</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-4 focus:outline-none focus:border-sky-500 transition-colors text-2xl font-bold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">{currency}</span>
                </div>
              </div>
              {/* Currency Select */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Debit From</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['BRL', 'USD', 'BTC', 'ETH'] as CurrencyCode[]).map(c => (
                    <button 
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        currency === c 
                        ? 'bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/20' 
                        : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600'
                      }`}
                    >
                      {c} ({balances[c].toFixed(c === 'BTC' ? 4 : 0)})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Privacy Toggle */}
            <div 
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 group ${
                isAnonymous ? 'bg-sky-500/5 border-sky-500/40 shadow-inner' : 'bg-slate-800/10 border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full transition-colors ${isAnonymous ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
                    {isAnonymous ? <Shield size={24} /> : <ShieldOff size={24} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold flex items-center">
                      Invisible Sender Mode
                      {isAnonymous && <span className="ml-2 text-[10px] bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full">ACTIVE</span>}
                    </p>
                    <p className="text-xs text-slate-500 max-w-[200px]">The node will only reveal that funds arrived, never the origin.</p>
                  </div>
                </div>
                <div className={`w-14 h-7 rounded-full p-1 transition-colors ${isAnonymous ? 'bg-sky-500' : 'bg-slate-700'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-sm ${isAnonymous ? 'translate-x-7' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-slate-800/50 border border-slate-700 rounded-2xl">
              <Info className="text-sky-500 shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-slate-400 leading-relaxed">
                Nexus Ledger uses <span className="text-sky-400 font-bold underline decoration-sky-500/30">Zero-Knowledge Proofs (ZKP)</span> to verify transactions. 
                Funds are converted at <span className="text-white font-medium">interbank rates</span> with 0% markup before reaching the recipient.
              </p>
            </div>

            <button 
              disabled={isProcessing || !amount || !pixKey}
              onClick={handlePayment}
              className={`w-full font-bold py-5 rounded-2xl transition-all relative overflow-hidden group ${
                isProcessing || !amount || !pixKey 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-2xl shadow-sky-500/20 active:scale-95'
              }`}
            >
              <span className="relative z-10 text-lg uppercase tracking-wider">
                {isProcessing ? 'Mining Transaction...' : 'Confirm Payment'}
              </span>
              {!isProcessing && <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
            </button>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-90px); }
          100% { transform: translateY(90px); }
        }
        .animate-scan {
          animation: scan 2s linear infinite alternate;
        }
      `}</style>
    </div>
  );
};

const ShieldCheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
  </svg>
);

export default PixPayment;
