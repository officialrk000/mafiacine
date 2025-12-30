
import React from 'react';
import { 
  Home, 
  History
} from 'lucide-react';

export const CURRENCY_SYMBOL = '₹';

export const CATEGORY_COLORS: Record<string, string> = {
  'Salary': '#10b981',
  'Business': '#059669',
  'Freelance': '#34d399',
  'Other income': '#6ee7b7',
  'Food 🍔': '#f87171',
  'Travel 🚕': '#fb923c',
  'Rent 🏠': '#fbbf24',
  'Shopping 🛍️': '#f472b6',
  'Bills 💡': '#60a5fa',
  'Entertainment 🎬': '#a78bfa',
  'Medical 💊': '#fca5a5',
  'Education 📚': '#818cf8',
  'Other': '#94a3b8',
};

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: <Home size={20} /> },
  { id: 'history', label: 'History', icon: <History size={20} /> },
];
