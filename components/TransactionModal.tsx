import React, { useState, useEffect } from 'react';
import { X, DollarSign, Plus, Check, ChevronLeft } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';
import { TransactionType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialType?: TransactionType;
}

export const TransactionModal: React.FC<Props> = ({ isOpen, onClose, initialType = 'expense' }) => {
  const { addTransaction } = useFinance();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(initialType);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // Custom Category Logic
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      const defaultCat = initialType === 'income' ? INCOME_CATEGORIES[0].id : EXPENSE_CATEGORIES[0].id;
      setSelectedCategory(defaultCat);
      setIsCustomMode(false);
      setCustomCategoryName('');
      setAmount('');
      setNote('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen, initialType]);

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const defaultCat = newType === 'income' ? INCOME_CATEGORIES[0].id : EXPENSE_CATEGORIES[0].id;
    setSelectedCategory(defaultCat);
    setIsCustomMode(false);
  };

  const handleConfirmCustom = () => {
    if (customCategoryName.trim()) {
      setSelectedCategory(customCategoryName.trim());
      setIsCustomMode(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    addTransaction({
      amount: parseFloat(amount),
      type,
      category: selectedCategory,
      date: new Date(date).toISOString(),
      note,
    });
    
    onClose();
  };

  if (!isOpen) return null;

  const currentCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const isIncome = type === 'income';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/90 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content - Glassmorphism */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Glow Effect */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[100px] opacity-20 dark:opacity-15 pointer-events-none ${isIncome ? 'bg-blue-500 dark:bg-cyan-500' : 'bg-rose-500 dark:bg-fuchsia-500'}`}></div>

        <div className="relative z-10 p-6">
          {/* Header with improved Close Button spacing */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">New Transaction</h3>
            <button 
              onClick={onClose} 
              className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-white/5 active:scale-95 z-50"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Type Toggle - Sliding Segment */}
            <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl flex relative border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all relative z-10 flex items-center justify-center gap-2 ${!isIncome ? 'text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all relative z-10 flex items-center justify-center gap-2 ${isIncome ? 'text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Income
              </button>
              
              {/* Sliding Background */}
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl transition-all duration-300 shadow-lg ${
                  isIncome 
                    ? 'translate-x-[100%] left-1 bg-blue-600 dark:bg-cyan-600 shadow-blue-500/30 dark:shadow-cyan-500/30' 
                    : 'translate-x-0 left-1 bg-rose-500 dark:bg-rose-600 shadow-rose-500/30 dark:shadow-rose-500/30'
                }`}
              ></div>
            </div>

            {/* Amount Input */}
            <div className="flex flex-col items-center py-2">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Amount</label>
               <div className="relative w-full">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isIncome ? 'text-blue-500 dark:text-cyan-500' : 'text-rose-500 dark:text-rose-500'}`}>
                    <DollarSign size={24} strokeWidth={3} />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-4xl font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:outline-none focus:border-blue-200 dark:focus:border-white/20 text-center transition-all shadow-inner"
                    autoFocus
                  />
               </div>
            </div>

            {/* Category Section */}
            <div>
              <div className="flex justify-between items-center mb-3 px-1">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</label>
                 {isCustomMode && (
                   <button 
                     type="button" 
                     onClick={() => setIsCustomMode(false)}
                     className="text-xs text-blue-500 dark:text-cyan-400 hover:text-blue-600 dark:hover:text-cyan-300 flex items-center gap-1 font-medium"
                   >
                     <ChevronLeft size={14} /> Back to Grid
                   </button>
                 )}
              </div>

              {isCustomMode ? (
                // Custom Category Input Mode
                <div className="flex gap-2 animate-in fade-in slide-in-from-right-4">
                  <input 
                    type="text" 
                    value={customCategoryName}
                    onChange={(e) => setCustomCategoryName(e.target.value)}
                    placeholder="Enter category name..."
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500/50"
                  />
                  <button 
                    type="button"
                    onClick={handleConfirmCustom}
                    className="px-4 bg-blue-600 dark:bg-cyan-600 hover:bg-blue-500 dark:hover:bg-cyan-500 text-white rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Check size={20} />
                  </button>
                </div>
              ) : (
                // Category Grid Mode
                <div className="grid grid-cols-5 gap-y-4 gap-x-2">
                   {currentCategories.map((cat) => {
                     const isSelected = selectedCategory === cat.id;
                     return (
                       <button
                         key={cat.id}
                         type="button"
                         onClick={() => setSelectedCategory(cat.id)}
                         className={`group flex flex-col items-center gap-1`}
                       >
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 border ${
                           isSelected 
                             ? isIncome 
                                ? 'bg-blue-500 dark:bg-cyan-500 text-white border-blue-400 dark:border-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.4)] dark:shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-110' 
                                : 'bg-rose-500 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)] scale-110'
                             : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-800 group-hover:text-slate-900 dark:group-hover:text-white group-hover:border-slate-300 dark:group-hover:border-slate-700'
                         }`}>
                            {React.cloneElement(cat.icon as React.ReactElement<any>, { size: 18 })}
                         </div>
                       </button>
                     );
                   })}
                   
                   {/* Custom Button */}
                   <button
                     type="button"
                     onClick={() => setIsCustomMode(true)}
                     className="flex flex-col items-center gap-1 group"
                   >
                     <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 border bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-800 group-hover:text-slate-900 dark:group-hover:text-white">
                        <Plus size={18} />
                     </div>
                   </button>
                </div>
              )}
              
              {/* Selected Label Display */}
              {!isCustomMode && (
                <div className="text-center mt-3 h-5">
                   <span className="text-xs font-bold text-slate-600 dark:text-white bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                    {selectedCategory === 'Custom' ? customCategoryName || 'Custom' : currentCategories.find(c => c.id === selectedCategory)?.label || selectedCategory}
                   </span>
                </div>
              )}
            </div>

            {/* Date & Note Inputs */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2 flex flex-col focus-within:border-slate-400 dark:focus-within:border-slate-600 transition-colors">
                  <label className="text-[10px] text-slate-500 font-bold uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent text-slate-900 dark:text-white text-sm font-bold focus:outline-none w-full"
                  />
               </div>
               <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2 flex flex-col focus-within:border-slate-400 dark:focus-within:border-slate-600 transition-colors">
                  <label className="text-[10px] text-slate-500 font-bold uppercase mb-1">Note</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Optional"
                    className="bg-transparent text-slate-900 dark:text-white text-sm font-medium focus:outline-none w-full placeholder:text-slate-400 dark:placeholder:text-slate-700"
                  />
               </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                 isIncome 
                 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-blue-600 shadow-blue-500/20 dark:shadow-cyan-500/20 hover:shadow-blue-500/40 dark:hover:shadow-cyan-500/40' 
                 : 'bg-gradient-to-r from-rose-500 to-pink-600 dark:from-rose-600 dark:to-pink-600 shadow-rose-500/20 hover:shadow-rose-500/40'
              }`}
            >
              Save Transaction
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};