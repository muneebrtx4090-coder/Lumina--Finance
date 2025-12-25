import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { CURRENCIES, CurrencyItem } from '../constants';
import { CurrencyCode } from '../types';

interface CurrencySelectProps {
  value: CurrencyCode;
  onChange: (code: CurrencyCode) => void;
  className?: string;
}

export const CurrencySelect: React.FC<CurrencySelectProps> = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCurrency = CURRENCIES.find(c => c.code === value) || CURRENCIES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 shadow-sm hover:border-blue-400 dark:hover:border-cyan-500/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl leading-none">{selectedCurrency.flag}</span>
          <span className="font-bold text-slate-900 dark:text-white">{selectedCurrency.code}</span>
          <span className="text-slate-400 text-sm hidden sm:inline-block border-l border-slate-300 dark:border-slate-700 pl-3 ml-1">
            {selectedCurrency.name}
          </span>
        </div>
        <ChevronDown 
          size={18} 
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-h-[300px] overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-1">
            {CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                type="button"
                onClick={() => {
                  onChange(currency.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                  currency.code === value
                    ? 'bg-blue-50 dark:bg-cyan-900/20 text-blue-600 dark:text-cyan-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-cyan-500/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl leading-none">{currency.flag}</span>
                  <div>
                    <span className="font-bold block text-sm">{currency.code}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-500 block">{currency.name}</span>
                  </div>
                </div>
                {currency.code === value && <Check size={16} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
