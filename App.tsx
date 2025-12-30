
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { User, Transaction } from './types';
import { storageService } from './services/storageService';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import TransactionHistory from './components/TransactionHistory';
import TransactionForm from './components/TransactionForm';
import { NAV_ITEMS } from './constants';
import { LogOut, Sun, Moon, PlusCircle, Wallet, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(storageService.getCurrentUser());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isAdding, setIsAdding] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => storageService.getTheme());

  const fetchTransactions = async (userId: string) => {
    setLoading(true);
    try {
      const data = await storageService.getTransactions(userId);
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Immediate theme application to prevent flickering
  useLayoutEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    storageService.setTheme(theme);
  }, [theme]);

  // Initial data fetch if user is already logged in
  useEffect(() => {
    if (user) {
      fetchTransactions(user.id);
    }
  }, [user?.id]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    // Transactions will be fetched by the useEffect above
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    setTransactions([]);
  };

  const handleSaveTransaction = async (data: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    
    const newTransaction: Transaction = {
      ...data,
      id: Date.now().toString(),
      userId: user.id,
      createdAt: Date.now()
    };

    // Optimistic Update
    setTransactions(prev => [newTransaction, ...prev]);
    setIsAdding(false);

    // Persist to Backend
    try {
      await storageService.addTransaction(newTransaction);
    } catch (error) {
      console.error("Persistence error:", error);
      // In a real app, you might want to show an error and roll back the optimistic update
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 text-white p-2 rounded-xl shadow-lg shadow-emerald-500/20">
              <Wallet size={20} />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight">FinTrack</h1>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest leading-none">Personal Cloud</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all font-bold text-sm"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black mb-1">Welcome back, {user.name.split(' ')[0]}!</h2>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500'}`} />
              {loading ? 'Refreshing your records...' : 'Cloud storage synced'}
            </div>
          </div>
          {loading && <Loader2 className="animate-spin text-emerald-500 mb-2" size={24} />}
        </div>

        {activeTab === 'home' && <Dashboard transactions={transactions} />}
        {activeTab === 'history' && <TransactionHistory transactions={transactions} />}
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsAdding(true)}
        className="fixed bottom-24 right-6 sm:right-10 z-50 w-16 h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl shadow-emerald-600/40 flex items-center justify-center transition-all hover:scale-110 active:scale-90"
      >
        <PlusCircle size={32} />
      </button>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe">
        <div className="max-w-4xl mx-auto px-10 h-20 flex items-center justify-around">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1.5 transition-all relative ${
                activeTab === item.id 
                  ? 'text-emerald-500' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-emerald-50 dark:bg-emerald-500/10' : ''
              }`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute -top-4 w-1 h-1 bg-emerald-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Modal */}
      {isAdding && (
        <TransactionForm 
          onClose={() => setIsAdding(false)} 
          onSave={handleSaveTransaction} 
        />
      )}
    </div>
  );
};

export default App;
