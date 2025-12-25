import React, { useState } from 'react';
import { ArrowRight, Check, Wallet } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CurrencyCode } from '../types';
import { CurrencySelect } from './CurrencySelect';

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const { updateProfile } = useFinance();

  const [name, setName] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [balance, setBalance] = useState('');

  const handleFinish = () => {
    if (!name || !balance) return;
    
    updateProfile({
      name,
      currency,
      initialBalance: parseFloat(balance),
      isOnboarded: true,
      theme: 'dark', // Force Dark Mode initially
    });
  };

  if (step === 1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 animate-in fade-in duration-700 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-sm text-center relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-[0_0_30px_rgba(8,145,178,0.2)]">
             <Wallet size={48} className="text-cyan-400 drop-shadow-md" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Lumina <span className="text-cyan-400">Finance</span>
          </h1>
          <p className="text-slate-400 text-lg mb-12 leading-relaxed">
            Master your net worth with a premium, focused experience.
          </p>
          <button
            onClick={() => setStep(2)}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 group"
          >
            Get Started
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 bg-slate-950 animate-in slide-in-from-right duration-500 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-sm mx-auto relative z-10 pb-20">
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Setup Profile</h2>
            <p className="text-slate-400">Let's verify your financials.</p>
        </div>

        <div className="space-y-6">
          <div className="group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-cyan-400 transition-colors">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Doe"
              className="w-full p-4 bg-slate-900/50 border border-slate-800 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-all text-white font-medium placeholder:text-slate-600 backdrop-blur-sm"
            />
          </div>

          <div className="group relative z-20">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Currency</label>
            <CurrencySelect 
              value={currency} 
              onChange={setCurrency} 
            />
          </div>

          <div className="group relative z-10">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-cyan-400 transition-colors">Total Net Worth</label>
            <p className="text-[10px] text-slate-500 mb-2">Estimated total of all your accounts right now.</p>
            <div className="relative">
                 <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-4 bg-slate-900/50 border border-slate-800 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-all text-white font-bold text-lg placeholder:text-slate-600 backdrop-blur-sm"
                />
            </div>
          </div>

          <button
            onClick={handleFinish}
            disabled={!name || !balance}
            className={`w-full py-4 mt-6 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all ${
              !name || !balance
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-800'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 active:scale-95 hover:shadow-cyan-500/40'
            }`}
          >
            Complete Setup
            <Check size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
