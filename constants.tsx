import React from 'react';
import { 
  Utensils, Car, ShoppingBag, Film, HeartPulse, 
  Receipt, Banknote, TrendingUp, CircleHelp,
  Briefcase, Gift, Laptop, Home, Coins, GraduationCap,
  PlusCircle
} from 'lucide-react';
import { CurrencyCode } from './types';

export interface CurrencyItem {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  locale: string;
}

export const CURRENCIES: CurrencyItem[] = [
  { code: 'USD', symbol: '$', name: 'United States Dollar', flag: '🇺🇸', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', locale: 'en-GB' },
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee', flag: '🇵🇰', locale: 'ur-PK' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', locale: 'en-IN' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', flag: '🇸🇦', locale: 'ar-SA' },
  { code: 'AED', symbol: 'dh', name: 'UAE Dirham', flag: '🇦🇪', locale: 'ar-AE' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', locale: 'ja-JP' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', locale: 'zh-CN' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar', flag: '🇨🇦', locale: 'en-CA' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar', flag: '🇦🇺', locale: 'en-AU' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', flag: '🇨🇭', locale: 'de-CH' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷', locale: 'tr-TR' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺', locale: 'ru-RU' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', flag: '🇰🇷', locale: 'ko-KR' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷', locale: 'pt-BR' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦', locale: 'en-ZA' },
  { code: 'SGD', symbol: '$', name: 'Singapore Dollar', flag: '🇸🇬', locale: 'en-SG' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', flag: '🇲🇽', locale: 'es-MX' },
  { code: 'NZD', symbol: '$', name: 'New Zealand Dollar', flag: '🇳🇿', locale: 'en-NZ' },
];

// Updated Avatar List: Removed Laptop, Added Robot, Lion, Detective
export const AVATARS = ['👨‍💼', '👩‍💼', '🦸', '🐱', '🐶', '🚀', '🌟', '🦄', '🤖', '🦁', '🕵️'];

export interface CategoryItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const EXPENSE_CATEGORIES: CategoryItem[] = [
  { id: 'Food', label: 'Food & Dining', icon: <Utensils size={18} /> },
  { id: 'Transport', label: 'Transport', icon: <Car size={18} /> },
  { id: 'Shopping', label: 'Shopping', icon: <ShoppingBag size={18} /> },
  { id: 'Entertainment', label: 'Entertainment', icon: <Film size={18} /> },
  { id: 'Health', label: 'Health', icon: <HeartPulse size={18} /> },
  { id: 'Bills', label: 'Bills & Utilities', icon: <Receipt size={18} /> },
  { id: 'Education', label: 'Education', icon: <GraduationCap size={18} /> },
  { id: 'Other', label: 'Other', icon: <CircleHelp size={18} /> },
];

export const INCOME_CATEGORIES: CategoryItem[] = [
  { id: 'Salary', label: 'Salary', icon: <Banknote size={18} /> },
  { id: 'Finance', label: 'Investments', icon: <TrendingUp size={18} /> },
  { id: 'Freelancing', label: 'Freelancing', icon: <Laptop size={18} /> },
  { id: 'Business', label: 'Business', icon: <Briefcase size={18} /> },
  { id: 'Gift', label: 'Gift', icon: <Gift size={18} /> },
  { id: 'Rental', label: 'Rental', icon: <Home size={18} /> },
  { id: 'Sold Items', label: 'Sold Items', icon: <Coins size={18} /> },
  { id: 'Other', label: 'Other', icon: <CircleHelp size={18} /> },
];

export const INITIAL_PROFILE = {
  name: '',
  currency: 'USD' as CurrencyCode,
  initialBalance: 0,
  isOnboarded: false,
  theme: 'light' as const,
  monthlyBudget: 0,
  avatar: '',
};