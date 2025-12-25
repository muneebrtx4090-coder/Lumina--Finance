import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { CURRENCIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants';
import { ArrowDownRight, ArrowUpRight, Search, PieChart as PieIcon, AlertCircle } from 'lucide-react';

export const Analytics: React.FC = () => {
  const { transactions, userProfile } = useFinance();
  const [viewType, setViewType] = useState<'expense' | 'income'>('expense');

  const currencySymbol = useMemo(() => {
     return CURRENCIES.find(c => c.code === userProfile.currency)?.symbol || '$';
  }, [userProfile.currency]);

  // Color Palettes
  const EXPENSE_COLORS = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6']; // Rose to Indigo
  const INCOME_COLORS = ['#06b6d4', '#10b981', '#3b82f6', '#0ea5e9', '#6366f1']; // Cyan to Blue

  // 1. Prepare Data with Grouping Logic
  const chartData = useMemo(() => {
    // 1. Filter by Type
    const relevantTransactions = transactions.filter(t => t.type === viewType);
    
    // 2. Group by Category (Sum Amount & Count Items)
    const grouped = relevantTransactions.reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { amount: 0, count: 0 };
      }
      acc[t.category].amount += t.amount;
      acc[t.category].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    // 3. Convert to Array and Sort
    // CRITICAL: We map ALL keys here, no slicing/limits.
    const data = Object.entries(grouped)
      .map(([name, { amount, count }]) => ({ name, value: amount, count }))
      .sort((a, b) => b.value - a.value); // Sort descending

    return data;
  }, [transactions, viewType]);

  const totalAmount = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryIcon = (catId: string) => {
    const allCats = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
    const cat = allCats.find(c => c.id === catId);
    return cat ? cat.icon : <Search size={18} />;
  };

  const currentColors = viewType === 'expense' ? EXPENSE_COLORS : INCOME_COLORS;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Financial Breakdown</h2>
      </div>

      {/* Type Toggle */}
      <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl flex mb-8 border border-slate-200 dark:border-slate-800 relative shadow-sm">
          <button
            onClick={() => setViewType('expense')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all relative z-10 flex items-center justify-center gap-2 ${viewType === 'expense' ? 'text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <ArrowDownRight size={16} /> Expenses
          </button>
          <button
            onClick={() => setViewType('income')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all relative z-10 flex items-center justify-center gap-2 ${viewType === 'income' ? 'text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <ArrowUpRight size={16} /> Income
          </button>
          
          {/* Sliding Background */}
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl transition-all duration-300 shadow-lg ${
              viewType === 'income' 
                ? 'translate-x-[100%] left-1.5 bg-blue-600 dark:bg-cyan-600 shadow-blue-500/30 dark:shadow-cyan-500/30' 
                : 'translate-x-0 left-1.5 bg-rose-500 dark:bg-rose-600 shadow-rose-500/30 dark:shadow-rose-500/30'
            }`}
          ></div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl dark:shadow-2xl mb-6 relative min-h-[350px] flex flex-col items-center justify-center transition-colors">
        {/* Background Glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-20 dark:opacity-10 pointer-events-none ${viewType === 'expense' ? 'bg-rose-200 dark:bg-rose-500' : 'bg-cyan-200 dark:bg-cyan-500'}`}></div>

        {chartData.length > 0 ? (
          <>
            <div className="w-full h-[280px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={currentColors[index % currentColors.length]} 
                        className="drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] outline-none"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                     content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-xl">
                                <p className="text-slate-900 dark:text-white font-bold text-sm mb-0.5">{data.name}</p>
                                <p className={`font-bold text-lg ${viewType === 'expense' ? 'text-rose-500 dark:text-rose-400' : 'text-blue-600 dark:text-cyan-400'}`}>
                                  {currencySymbol}{formatMoney(data.value)}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 text-right mt-1 font-medium">
                                    {data.count} {data.count === 1 ? 'txn' : 'txns'}
                                </p>
                            </div>
                          );
                        }
                        return null;
                     }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Label */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Total</p>
                <p className={`text-3xl font-bold tracking-tighter text-slate-900 dark:text-white`}>
                  {viewType === 'expense' ? '-' : '+'}{currencySymbol}{formatMoney(totalAmount)}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 opacity-60">
             <PieIcon size={48} className="mb-2" strokeWidth={1} />
             <p className="text-sm font-medium">No {viewType} data yet</p>
          </div>
        )}
      </div>

      {/* Category List */}
      <div className="space-y-3">
         <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Breakdown</h3>
         
         {/* Scrollable Container with max-height to support unlimited items */}
         <div className="max-h-[500px] overflow-y-auto pr-2 no-scrollbar space-y-3 pb-2">
            {chartData.length > 0 ? (
            chartData.map((item, index) => {
                const percentage = ((item.value / totalAmount) * 100).toFixed(1);
                const color = currentColors[index % currentColors.length];
                
                return (
                <div key={item.name} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm">
                    <div className="flex items-center gap-4">
                        <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0"
                        style={{ backgroundColor: `${color}`, boxShadow: `0 0 10px ${color}40` }}
                        >
                            <div className="transform scale-90">{getCategoryIcon(item.name)}</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-slate-900 dark:text-white font-bold text-sm">{item.name}</p>
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">
                                    {item.count} items
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                            <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{percentage}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`font-bold ${viewType === 'expense' ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-cyan-400'}`}>
                            {currencySymbol}{formatMoney(item.value)}
                        </p>
                    </div>
                </div>
                );
            })
            ) : (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/20">
                <AlertCircle size={24} className="mx-auto mb-2 text-slate-400 dark:text-slate-600" />
                <p className="text-slate-500 text-xs">Add transactions to see breakdown.</p>
            </div>
            )}
         </div>
      </div>
    </div>
  );
};