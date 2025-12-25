import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { TransactionModal } from './components/TransactionModal';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { BudgetView } from './components/BudgetView';
import { LayoutGrid, PieChart, User as UserIcon, Plus, Target } from 'lucide-react';
import { TransactionType } from './types';

const MainApp: React.FC = () => {
  const { userProfile } = useFinance();
  const [currentView, setCurrentView] = useState<'dashboard' | 'analytics' | 'budget' | 'settings'>('dashboard');
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type?: TransactionType }>({
    isOpen: false,
    type: 'expense',
  });

  if (!userProfile.isOnboarded) {
    return <Onboarding />;
  }

  const handleOpenAdd = (type: TransactionType = 'expense') => {
    setModalConfig({ isOpen: true, type });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex justify-center text-slate-900 dark:text-slate-200 transition-colors duration-300">
      <div className="w-full max-w-md min-h-screen relative flex flex-col bg-slate-50 dark:bg-slate-950 shadow-2xl transition-colors duration-300">
        
        {/* Main Content Area */}
        <div className="flex-1 p-6 pb-32 overflow-y-auto no-scrollbar">
          {currentView === 'dashboard' && (
            <Dashboard 
              onOpenSettings={() => setCurrentView('settings')} 
              onOpenAdd={handleOpenAdd}
            />
          )}
          {currentView === 'analytics' && <Analytics />}
          {currentView === 'budget' && <BudgetView />}
          {currentView === 'settings' && <Settings />}
        </div>

        {/* Floating Island Navigation - Balanced 4 Items + FAB */}
        <div className="fixed bottom-6 left-6 right-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[400px] z-30">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl px-2 py-3 flex justify-between items-center shadow-2xl shadow-slate-200/50 dark:shadow-black/60 relative transition-colors duration-300">
            
            <div className="flex-1 flex justify-around">
                <button 
                onClick={() => setCurrentView('dashboard')}
                className={`flex flex-col items-center gap-1 transition-all duration-300 w-12 ${currentView === 'dashboard' ? 'text-blue-600 dark:text-cyan-400 scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                >
                <LayoutGrid size={22} strokeWidth={currentView === 'dashboard' ? 2.5 : 2} />
                <span className="text-[9px] font-bold tracking-wide uppercase">Home</span>
                </button>

                <button 
                onClick={() => setCurrentView('analytics')}
                className={`flex flex-col items-center gap-1 transition-all duration-300 w-12 ${currentView === 'analytics' ? 'text-blue-600 dark:text-cyan-400 scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                >
                <PieChart size={22} strokeWidth={currentView === 'analytics' ? 2.5 : 2} />
                <span className="text-[9px] font-bold tracking-wide uppercase">Stats</span>
                </button>
            </div>

            {/* Spacer for FAB */}
            <div className="w-16"></div>

            {/* FAB Container - Absolute Center */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-6">
              <button
                onClick={() => handleOpenAdd()}
                className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-500 rounded-full shadow-lg shadow-blue-500/30 dark:shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center text-white transition-all active:scale-95 hover:scale-110 border-[4px] border-slate-50 dark:border-slate-950"
              >
                <Plus size={28} strokeWidth={3} />
              </button>
            </div>

            <div className="flex-1 flex justify-around">
                <button 
                onClick={() => setCurrentView('budget')}
                className={`flex flex-col items-center gap-1 transition-all duration-300 w-12 ${currentView === 'budget' ? 'text-blue-600 dark:text-cyan-400 scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                >
                <Target size={22} strokeWidth={currentView === 'budget' ? 2.5 : 2} />
                <span className="text-[9px] font-bold tracking-wide uppercase">Budget</span>
                </button>

                <button 
                onClick={() => setCurrentView('settings')}
                className={`flex flex-col items-center gap-1 transition-all duration-300 w-12 ${currentView === 'settings' ? 'text-blue-600 dark:text-cyan-400 scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                >
                <UserIcon size={22} strokeWidth={currentView === 'settings' ? 2.5 : 2} />
                <span className="text-[9px] font-bold tracking-wide uppercase">Profile</span>
                </button>
            </div>
          </div>
        </div>

        <TransactionModal 
          isOpen={modalConfig.isOpen} 
          onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} 
          initialType={modalConfig.type}
        />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <FinanceProvider>
        <MainApp />
      </FinanceProvider>
    </HashRouter>
  );
};

export default App;