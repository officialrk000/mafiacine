
import React, { useState } from 'react';
import { Transaction } from '../types';
import { getAIInsights } from '../services/geminiService';
import { Brain, Sparkles, Loader2 } from 'lucide-react';

interface AICoachProps {
  transactions: Transaction[];
}

const AICoach: React.FC<AICoachProps> = ({ transactions }) => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    const result = await getAIInsights(transactions);
    setInsights(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <Brain className="w-8 h-8" />
          </div>
          <Sparkles className="text-indigo-200 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Smart AI Coach</h2>
        <p className="text-indigo-100 mb-6 leading-relaxed">
          Unlock personalized financial insights powered by Gemini. We analyze your spending patterns to give you the best advice.
        </p>
        <button
          disabled={loading}
          onClick={fetchInsights}
          className="w-full bg-white text-indigo-700 font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>Analyze My Finances</>
          )}
        </button>
      </div>

      {insights && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 animate-in slide-in-from-bottom duration-500">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
            <Sparkles size={20} className="text-yellow-500" />
            Insights for You
          </h3>
          <div className="prose prose-slate dark:prose-invert max-w-none prose-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
            {insights.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AICoach;
