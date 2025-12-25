import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Transaction, FinanceContextType } from '../types';
import { INITIAL_PROFILE } from '../constants';

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('lumina_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with initial to handle new fields for existing users
      return { ...INITIAL_PROFILE, ...parsed };
    }
    return INITIAL_PROFILE;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('lumina_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // Theme Side Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (userProfile.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [userProfile.theme]);

  useEffect(() => {
    localStorage.setItem('lumina_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('lumina_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const updateProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  };

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: crypto.randomUUID(),
    };
    // Add to beginning of list
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const resetData = () => {
    setUserProfile(INITIAL_PROFILE);
    setTransactions([]);
    localStorage.removeItem('lumina_profile');
    localStorage.removeItem('lumina_transactions');
    window.location.reload(); // Force reload to clear state cleanly
  };

  const getNetWorth = () => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return userProfile.initialBalance + totalIncome - totalExpense;
  };

  const getMonthlyStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = monthlyTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expense };
  };

  return (
    <FinanceContext.Provider
      value={{
        userProfile,
        transactions,
        updateProfile,
        addTransaction,
        deleteTransaction,
        resetData,
        getNetWorth,
        getMonthlyStats,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
