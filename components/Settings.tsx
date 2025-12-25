import React, { useState } from 'react';
import { Trash2, Palette, Banknote, ChevronRight, Edit3, X, Check } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CURRENCIES, AVATARS } from '../constants';
import { CurrencyCode } from '../types';
import { CurrencySelect } from './CurrencySelect';

export const Settings: React.FC = () => {
  const { userProfile, updateProfile, resetData } = useFinance();
  
  // Modals State
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Temporary State for Edit Profile
  const [tempName, setTempName] = useState(userProfile.name);
  const [tempAvatar, setTempAvatar] = useState(userProfile.avatar || '');

  const handleReset = () => {
    if (confirm('Are you sure? This will delete all your data and cannot be undone.')) {
      resetData();
    }
  };

  const handleOpenEditProfile = () => {
    setTempName(userProfile.name);
    setTempAvatar(userProfile.avatar || '');
    setShowEditProfile(true);
  };

  const handleSaveProfile = () => {
    updateProfile({ name: tempName, avatar: tempAvatar });
    setShowEditProfile(false);
  };

  const toggleTheme = () => {
    updateProfile({ theme: userProfile.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <div className="flex justify-between items-center mb-8">
         <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h2>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8">
         <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full blur-xl opacity-20 dark:opacity-40 group-hover:opacity-40 dark:group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="relative w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-2xl">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden relative">
                    {userProfile.avatar ? (
                        userProfile.avatar.length > 10 ? 
                        <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" /> :
                        <span className="text-5xl">{userProfile.avatar}</span>
                    ) : (
                        <span className="text-4xl font-bold text-slate-400 dark:text-slate-700 select-none">{userProfile.name.charAt(0)}</span>
                    )}
                </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-white dark:bg-slate-950 rounded-full p-1.5 border border-slate-200 dark:border-slate-800 shadow-lg z-10">
                <div className="w-5 h-5 bg-blue-500 dark:bg-cyan-500 rounded-full flex items-center justify-center">
                    <Check size={12} strokeWidth={4} className="text-white dark:text-slate-950" />
                </div>
            </div>
         </div>

         <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-5 tracking-tight">{userProfile.name}</h3>
         
         <div className="mt-3">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-blue-200 dark:border-cyan-500/30 text-xs font-semibold text-blue-600 dark:text-cyan-400 shadow-sm dark:shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]">
                Pro Member
            </span>
         </div>

         <button
            onClick={handleOpenEditProfile}
            className="mt-6 px-6 py-2 rounded-full border bg-transparent border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/20 text-sm font-medium transition-all flex items-center gap-2"
         >
            <Edit3 size={14} /> Edit Profile
         </button>
      </div>

      {/* Settings Stack - Changed overflow to visible for dropdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-visible mb-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-300">
        
        {/* Appearance Row */}
        <div 
            onClick={toggleTheme}
            className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
        >
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-200 dark:border-fuchsia-500/20 group-hover:scale-110 transition-transform">
                 <Palette size={20} />
              </div>
              <div>
                 <p className="text-sm font-semibold text-slate-900 dark:text-white">Appearance</p>
                 <p className="text-xs text-slate-500 mt-0.5">{userProfile.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
              </div>
           </div>
           
           <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${userProfile.theme === 'dark' ? 'bg-fuchsia-500/20 border border-fuchsia-500/30' : 'bg-slate-200'}`}>
                <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${userProfile.theme === 'dark' ? 'translate-x-5 bg-fuchsia-400' : 'translate-x-0 bg-white'}`}></div>
           </div>
        </div>

        {/* Currency Row - Replaced native select with shared component */}
        <div className="p-5 flex flex-col gap-3 border-b border-slate-100 dark:border-slate-800">
           <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                    <Banknote size={20} />
                  </div>
                  <div>
                     <p className="text-sm font-semibold text-slate-900 dark:text-white">Currency</p>
                     <p className="text-xs text-slate-500 mt-0.5">Primary currency</p>
                  </div>
               </div>
           </div>
           
           {/* Embedded Custom Currency Selector */}
           <div className="relative z-20">
              <CurrencySelect 
                 value={userProfile.currency} 
                 onChange={(code) => updateProfile({ currency: code })} 
              />
           </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-5 flex items-center justify-between gap-4 relative z-10">
        <div>
            <h4 className="text-red-600 dark:text-red-400 font-bold text-sm mb-1">Reset Data</h4>
            <p className="text-red-500/70 dark:text-red-400/50 text-[10px] leading-tight max-w-[180px]">Permanently delete all transactions and reset profile.</p>
        </div>
        <button 
            onClick={handleReset}
            className="px-4 py-2 bg-white dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-500/20 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
        >
            <Trash2 size={14} />
            Reset
        </button>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/90 backdrop-blur-sm" onClick={() => setShowEditProfile(false)}></div>
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Profile</h3>
                    <button onClick={() => setShowEditProfile(false)} className="p-2 bg-slate-100 dark:bg-white/5 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"><X size={18} /></button>
                </div>
                
                <div className="mb-4">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Display Name</label>
                    <input 
                        type="text" 
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Select Avatar</label>
                    <div className="flex flex-wrap gap-3">
                        {AVATARS.map(av => (
                            <button 
                                key={av}
                                onClick={() => setTempAvatar(av)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border transition-all ${tempAvatar === av ? 'bg-blue-100 dark:bg-cyan-600 border-blue-400 dark:border-cyan-400 scale-110 shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/40' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            >
                                {av}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={handleSaveProfile}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-blue-600 rounded-xl text-white font-bold shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/20 active:scale-95 transition-transform"
                >
                    Save Changes
                </button>
            </div>
        </div>
      )}

    </div>
  );
};
