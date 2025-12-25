import React, { useMemo, useState } from 'react';
import { Settings, TrendingDown, TrendingUp, Search, ArrowUpRight, ArrowDownRight, ScrollText, Bell, Filter, Trash2, Eye, EyeOff } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CURRENCIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants';
import { TransactionType } from '../types';

interface Props {
  onOpenSettings: () => void;
  onOpenAdd: (type?: TransactionType) => void;
}

export const Dashboard: React.FC<Props> = ({ onOpenSettings, onOpenAdd }) => {
  const { userProfile, transactions, getNetWorth, getMonthlyStats, deleteTransaction } = useFinance();
  
  // UI State
  const [showFilters, setShowFilters] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  
  // Filter States
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const currencySymbol = useMemo(() => {
    return CURRENCIES.find(c => c.code === userProfile.currency)?.symbol || '$';
  }, [userProfile.currency]);

  const currencyLocale = useMemo(() => {
    return CURRENCIES.find(c => c.code === userProfile.currency)?.locale || 'en-US';
  }, [userProfile.currency]);

  const netWorth = getNetWorth();
  const { income, expense } = getMonthlyStats();

  // Standard formatter for lists (keeps decimals)
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat(currencyLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Integer formatter for Main Balance (cleaner look)
  const formatMainBalance = (amount: number) => {
    return new Intl.NumberFormat(currencyLocale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryIcon = (catId: string) => {
    const allCats = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
    const cat = allCats.find(c => c.id === catId);
    return cat ? cat.icon : <Search size={18} />;
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Immediate deletion without confirmation for better UX
    deleteTransaction(id);
  };

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      return matchesType && matchesCategory;
    });
  }, [transactions, filterType, filterCategory]);

  const displayTransactions = showFilters ? filteredTransactions : transactions.slice(0, 5);

  // Get unique categories for the filter list based on current type selection
  const availableCategories = useMemo(() => {
    const relevantTx = filterType === 'all' ? transactions : transactions.filter(t => t.type === filterType);
    const cats = new Set(relevantTx.map(t => t.category));
    return Array.from(cats).sort();
  }, [transactions, filterType]);

  const clearFilters = () => {
    setFilterType('all');
    setFilterCategory('all');
  };

  return (
    <div className="animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 pt-2">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={onOpenSettings}>
             {userProfile.avatar ? (
                userProfile.avatar.length > 10 ? 
                <img src={userProfile.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30 dark:border-cyan-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)] dark:shadow-[0_0_15px_rgba(6,182,212,0.3)]" /> :
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center text-2xl shadow-lg">{userProfile.avatar}</div>
             ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-white font-bold text-lg shadow-lg">
                  {userProfile.name.charAt(0)}
                </div>
             )}
             <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 dark:bg-cyan-500 rounded-full border-2 border-white dark:border-slate-950 shadow-md"></div>
          </div>
          <div>
            <h1 className="text-sm font-medium text-slate-500 dark:text-slate-400">Welcome Back,</h1>
            <p className="text-xl font-bold text-slate-900 dark:text-white tracking-wide">{userProfile.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            className="p-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-blue-500/50 dark:hover:border-cyan-500/50 hover:shadow-lg transition-all shadow-sm"
          >
            {isBalanceVisible ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
          
          <button className="p-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-blue-500/50 dark:hover:border-cyan-500/50 hover:shadow-lg transition-all shadow-sm">
            <Bell size={20} />
          </button>
        </div>
      </header>

      {/* Main Focus Card */}
      <div className="relative w-full h-52 rounded-[32px] overflow-hidden mb-8 shadow-2xl shadow-blue-900/20 dark:shadow-blue-900/30 group transition-transform active:scale-[0.98] duration-300 border border-slate-200 dark:border-white/5">
        {/* Mesh Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900"></div>
        {/* Neon Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 dark:bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 dark:bg-rose-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
        
        {/* Glass Overlay */}
        <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-[1px] border border-white/20 dark:border-white/10 rounded-[32px]"></div>
        
        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
          <div>
             <div className="flex justify-between items-start mb-2">
                <p className="text-blue-100 dark:text-cyan-200 text-xs font-bold tracking-[0.2em] uppercase opacity-80 dark:shadow-cyan-500/50">Total Balance</p>
                <div className="flex gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-cyan-500 shadow-[0_0_8px_rgba(255,255,255,0.8)] dark:shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                   <div className="w-1.5 h-1.5 rounded-full bg-white/30 dark:bg-slate-700"></div>
                   <div className="w-1.5 h-1.5 rounded-full bg-white/30 dark:bg-slate-700"></div>
                </div>
             </div>
             <h2 className="text-4xl font-bold text-white tracking-tight drop-shadow-md">
               <span className="text-2xl opacity-70 align-top mr-1 font-medium">{currencySymbol}</span>
               {isBalanceVisible ? formatMainBalance(netWorth) : '••••••'}
             </h2>
          </div>

          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
               <span className="text-blue-100/70 dark:text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Wallet Status</span>
               <span className="text-emerald-300 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 dark:bg-emerald-400 animate-pulse"></div>
                  Active
               </span>
            </div>
            
            {/* Abstract Chip */}
            <div className="w-10 h-7 rounded-md border border-white/30 dark:border-yellow-500/30 bg-white/10 dark:bg-gradient-to-br dark:from-yellow-500/20 dark:to-transparent relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-30"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button 
          onClick={() => onOpenAdd('income')}
          className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-left hover:border-blue-500/30 dark:hover:border-cyan-500/30 transition-all duration-300 shadow-sm dark:shadow-lg"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-cyan-500/10 flex items-center justify-center text-emerald-600 dark:text-cyan-400 border border-emerald-200 dark:border-cyan-500/20 group-hover:scale-110 transition-all">
              <ArrowUpRight size={20} />
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Income</span>
          <p className="text-lg font-bold text-emerald-600 dark:text-cyan-400 mt-1">+{currencySymbol}{formatMoney(income)}</p>
        </button>

        <button 
          onClick={() => onOpenAdd('expense')}
          className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-left hover:border-rose-500/30 transition-all duration-300 shadow-sm dark:shadow-lg"
        >
          <div className="flex items-start justify-between mb-3">
             <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 group-hover:scale-110 transition-all">
              <ArrowDownRight size={20} />
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expense</span>
          <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">-{currencySymbol}{formatMoney(expense)}</p>
        </button>
      </div>

      {/* Recent Activity Section */}
      <div>
        {/* Section Header with Filter Toggle */}
        <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Recent Activity</h3>
            <button 
                onClick={() => {
                  setShowFilters(!showFilters);
                  if (showFilters) clearFilters();
                }}
                className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                  showFilters || filterType !== 'all' || filterCategory !== 'all'
                  ? 'bg-blue-50 dark:bg-cyan-500/10 border-blue-200 dark:border-cyan-500/40 text-blue-600 dark:text-cyan-400' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600'
                }`}
            >
                <Filter size={14} />
                {showFilters ? 'Hide' : 'Filter'}
            </button>
        </div>

        {/* Filters Container */}
        {showFilters && (
           <div className="mb-6 animate-in slide-in-from-top-2 fade-in duration-300">
               {/* Type Segments */}
               <div className="bg-white dark:bg-slate-900 p-1 rounded-xl flex mb-3 border border-slate-200 dark:border-slate-800 shadow-sm">
                   {['all', 'income', 'expense'].map(type => (
                       <button
                           key={type}
                           onClick={() => { setFilterType(type as any); setFilterCategory('all'); }}
                           className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                               filterType === type 
                               ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700' 
                               : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                           }`}
                       >
                           {type}
                       </button>
                   ))}
               </div>
               
               {/* Horizontal Category List */}
               <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1">
                    <button
                       onClick={() => setFilterCategory('all')}
                       className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                           filterCategory === 'all'
                           ? 'bg-blue-50 dark:bg-cyan-500/10 border-blue-200 dark:border-cyan-500/40 text-blue-600 dark:text-cyan-400'
                           : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-white'
                       }`}
                    >
                       All
                    </button>
                    {availableCategories.map(cat => (
                        <button
                           key={cat}
                           onClick={() => setFilterCategory(cat)}
                           className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                               filterCategory === cat
                               ? 'bg-blue-50 dark:bg-cyan-500/10 border-blue-200 dark:border-cyan-500/40 text-blue-600 dark:text-cyan-400'
                               : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-white'
                           }`}
                        >
                           {cat}
                        </button>
                    ))}
               </div>
           </div>
        )}

        {displayTransactions.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="mb-4 text-slate-400 dark:text-slate-700">
               <ScrollText size={48} strokeWidth={1} />
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-sm mb-1">No transactions found</p>
            <p className="text-slate-400 dark:text-slate-600 text-xs max-w-[200px]">
              Try adjusting your filters or add new transactions.
            </p>
            {showFilters && (
              <button 
                onClick={clearFilters}
                className="mt-4 text-xs text-blue-500 dark:text-cyan-400 hover:text-blue-600 dark:hover:text-cyan-300 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          /* Populated List */
          <div className="space-y-3">
            {displayTransactions.map((t) => (
              <div 
                key={t.id} 
                className="group bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500/20 dark:hover:border-cyan-500/20 flex items-center justify-between transition-all duration-200 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  {/* Icon Container */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    t.type === 'income' 
                        ? 'bg-emerald-100 dark:bg-cyan-500/10 text-emerald-600 dark:text-cyan-400 border border-emerald-200 dark:border-cyan-500/20' 
                        : 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                  }`}>
                    <div className="transform scale-90">{getCategoryIcon(t.category)}</div>
                  </div>
                  
                  {/* Text Info */}
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{t.category}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[140px] mt-0.5">{t.note || new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Amount */}
                  <div className={`font-bold text-sm whitespace-nowrap ${
                    t.type === 'income' ? 'text-emerald-600 dark:text-cyan-400 dark:shadow-cyan-500/20 dark:drop-shadow-sm' : 'text-rose-600 dark:text-rose-400 dark:shadow-rose-500/20 dark:drop-shadow-sm'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}{currencySymbol}{formatMoney(t.amount)}
                  </div>

                  {/* Delete Button */}
                  <button 
                    onClick={(e) => handleDelete(t.id, e)}
                    className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label="Delete transaction"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            
            {!showFilters && transactions.length > 5 && (
               <div className="text-center pt-2">
                  <button 
                    onClick={() => setShowFilters(true)}
                    className="text-xs text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium"
                  >
                    View all history
                  </button>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};