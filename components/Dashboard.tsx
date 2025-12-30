
import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { Transaction, TransactionType } from '../types';
import { CURRENCY_SYMBOL, CATEGORY_COLORS } from '../constants';
import { TrendingUp, TrendingDown, Wallet, PieChart as PieIcon, List, Calendar } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const grouped = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Sort transactions by date descending for the list
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  const StatCard = ({ title, amount, type }: { title: string; amount: number; type: 'income' | 'expense' | 'balance' }) => {
    const colors = {
      income: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
      expense: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
      balance: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
    };

    const icons = {
      income: <TrendingUp className="w-5 h-5" />,
      expense: <TrendingDown className="w-5 h-5" />,
      balance: <Wallet className="w-5 h-5" />
    };

    return (
      <div className={`p-6 rounded-2xl border ${colors[type]} transition-all hover:shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">{title}</span>
          <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-900/50">{icons[type]}</div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-medium opacity-80">{CURRENCY_SYMBOL}</span>
          <span className="text-3xl font-black tracking-tight">{amount.toLocaleString('en-IN')}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Income" amount={stats.income} type="income" />
        <StatCard title="Total Expense" amount={stats.expense} type="expense" />
        <StatCard title="Remaining Balance" amount={stats.balance} type="balance" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <h3 className="text-lg font-bold mb-6 dark:text-white flex items-center gap-2">
            <PieIcon size={20} className="text-emerald-500" />
            Spending Analysis
          </h3>
          <div className="h-[300px] w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#CBD5E1'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: '#1e293b', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => `${CURRENCY_SYMBOL}${value.toLocaleString('en-IN')}`}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p>No expenses found to chart</p>
              </div>
            )}
          </div>
        </div>

        {/* All Transactions List on Home */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col max-h-[420px]">
          <h3 className="text-lg font-bold mb-6 dark:text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <List size={20} className="text-blue-500" />
              Recent Expenses
            </div>
            <span className="text-xs font-medium text-slate-400">{transactions.length} total</span>
          </h3>
          <div className="space-y-4 overflow-y-auto no-scrollbar pr-1">
            {sortedTransactions.length > 0 ? (
              sortedTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      t.type === TransactionType.INCOME 
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                    }`}>
                      {t.type === TransactionType.INCOME ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    </div>
                    <div>
                      <p className="font-bold text-sm dark:text-white truncate max-w-[120px]">{t.category}</p>
                      <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 uppercase tracking-tighter">
                        <Calendar size={10} /> {new Date(t.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-black ${
                      t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'}{CURRENCY_SYMBOL}{t.amount.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">{t.paymentMode}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-gray-400">
                <p>No transactions available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
