
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import { Search, Filter, Calendar, CreditCard, ChevronRight } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | TransactionType>('ALL');

  const filteredTransactions = transactions
    .filter(t => {
      const matchesSearch = t.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search notes or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white transition-all"
          />
        </div>
        
        <div className="flex gap-2">
          {['ALL', TransactionType.INCOME, TransactionType.EXPENSE].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type as any)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                typeFilter === type 
                  ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900' 
                  : 'bg-white border-gray-100 text-gray-500 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-400'
              }`}
            >
              {type === 'ALL' ? 'Everything' : type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((t) => (
            <div 
              key={t.id} 
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-between hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  t.type === TransactionType.INCOME 
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                    : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                }`}>
                  {t.type === TransactionType.INCOME ? <CreditCard size={20} /> : <ChevronRight size={20} />}
                </div>
                <div>
                  <h4 className="font-bold dark:text-white">{t.category}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(t.date).toLocaleDateString()}</span>
                    <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{t.paymentMode}</span>
                  </div>
                  {t.notes && <p className="text-sm text-gray-500 mt-1 italic">{t.notes}</p>}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'}{CURRENCY_SYMBOL}{t.amount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-800">
            <p className="text-gray-400">No transactions match your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
