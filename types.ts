export type CurrencyCode = 
  'USD' | 'EUR' | 'GBP' | 'PKR' | 'INR' | 
  'SAR' | 'AED' | 'JPY' | 'CNY' | 'CAD' | 
  'AUD' | 'CHF' | 'TRY' | 'RUB' | 'KRW' | 
  'BRL' | 'ZAR' | 'SGD' | 'MXN' | 'NZD';

export type TransactionType = 'income' | 'expense';

// We use string now to support custom categories, but keep strict types for logic where needed
export type CategoryId = string; 

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string; // Changed to string to support Custom
  note: string;
  date: string; // ISO String
}

export interface UserProfile {
  name: string;
  currency: CurrencyCode;
  initialBalance: number;
  isOnboarded: boolean;
  theme: 'light' | 'dark';
  avatar?: string; // base64 string or url
  monthlyBudget: number; // 0 means disabled
}

export interface FinanceContextType {
  userProfile: UserProfile;
  transactions: Transaction[];
  updateProfile: (profile: Partial<UserProfile>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  resetData: () => void;
  getNetWorth: () => number;
  getMonthlyStats: () => { income: number; expense: number };
}