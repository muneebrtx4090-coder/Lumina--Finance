import React, { useState } from 'react';
import { Target, Save, Calculator, AlertCircle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CURRENCIES } from '../constants';

export const BudgetView: React.FC = () => {
  const { userProfile, updateProfile, getMonthlyStats } = useFinance();
  const [budgetInput, setBudgetInput] = useState(userProfile.monthlyBudget?.toString() || '');
  const { expense } = getMonthlyStats();

  const currencySymbol = CURRENCIES.find(c => c.code === userProfile.currency)?.symbol || '$';

  const handleSaveBudget = () => {
    const val = parseFloat(budgetInput);
    if (!isNaN(val)) {
      updateProfile({ monthlyBudget: val });
    } else {
      updateProfile({ monthlyBudget: 0 });
    }
  };

  const budgetProgress = userProfile.monthlyBudget && userProfile.monthlyBudget > 0
    ? Math.min((expense / userProfile.monthlyBudget) * 100, 100)
    : 0;
  
  const remaining = Math.max((userProfile.monthlyBudget || 0) - expense, 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
       <div className="flex justify-between items-center mb-8">
         <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Monthly Budget</h2>
      </div>

      {/* Main Budget Card */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl dark:shadow-2xl relative overflow-hidden mb-8 transition-colors">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 dark:bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
         
         <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-4 shadow-lg">
                <Target size={32} className="text-blue-500 dark:text-cyan-400" />
            </div>
            
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Spending Limit</p>
            
            <div className="relative w-full max-w-[200px] mb-6">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-blue-500 dark:text-cyan-500 pl-3">
                    <span className="text-2xl font-bold">{currencySymbol}</span>
                </div>
                <input
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-10 pr-4 text-3xl font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 text-center transition-colors shadow-inner"
                />
            </div>

            <button 
                onClick={handleSaveBudget}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/20 active:scale-95"
            >
                <Save size={18} />
                Update Budget
            </button>
         </div>
      </div>

      {/* Status Cards */}
      {userProfile.monthlyBudget > 0 ? (
          <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-500">
             {/* Progress Card */}
             <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-end mb-3">
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Used So Far</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{currencySymbol}{expense.toFixed(0)}</p>
                    </div>
                    <div className="text-right">
                         <p className="text-xs text-slate-500 font-bold uppercase">Remaining</p>
                         <p className={`text-xl font-bold mt-1 ${remaining < (userProfile.monthlyBudget * 0.2) ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                             {currencySymbol}{remaining.toFixed(0)}
                         </p>
                    </div>
                </div>
                
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700/50">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor] ${
                            budgetProgress >= 100 ? 'bg-rose-500 text-rose-500' : 
                            budgetProgress >= 80 ? 'bg-amber-500 text-amber-500' : 
                            'bg-blue-500 dark:bg-cyan-500 text-blue-500 dark:text-cyan-500'
                        }`}
                        style={{ width: `${budgetProgress}%` }}
                    ></div>
                </div>
                <p className="text-center text-xs text-slate-500 mt-2 font-medium">{Math.round(budgetProgress)}% of your budget used</p>
             </div>

             {/* Insight */}
             <div className="bg-blue-50 dark:bg-slate-900/30 border border-blue-100 dark:border-slate-800 rounded-2xl p-4 flex gap-4 items-start">
                <div className="p-2 bg-blue-100 dark:bg-slate-800 rounded-lg text-blue-600 dark:text-slate-400">
                    <Calculator size={20} />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Daily Safe Spend</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        To stay within budget, try not to exceed <span className="text-blue-600 dark:text-cyan-400 font-bold">{currencySymbol}{Math.max((remaining / 30), 0).toFixed(0)}</span> per day for the rest of the month.
                    </p>
                </div>
             </div>
          </div>
      ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-900/20">
              <AlertCircle size={40} className="text-slate-400 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">No Budget Set</p>
              <p className="text-xs text-slate-400 dark:text-slate-600 mt-1 max-w-[200px]">Enter a spending limit above to enable tracking.</p>
          </div>
      )}

    </div>
  );
};