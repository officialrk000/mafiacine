
import { Transaction, User } from '../types';

// IMPORTANT: Successfully linked to user's Google Apps Script backend.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxKvQHycbeIbGVpObVd87UADaNWbOfWLnfvOfZGSukka4LS4ylVoEsqf6NKi8rvY5I6/exec'; 

const STORAGE_KEYS = {
  SESSION: 'fintrack_session',
  THEME: 'fintrack_theme',
  LOCAL_USERS: 'fintrack_users_fallback',
  LOCAL_TXS: 'fintrack_transactions_fallback'
};

const callAPI = async (action: string, payload: any) => {
  if (!APPS_SCRIPT_URL) {
    console.warn("Apps Script URL is missing. Using LocalStorage fallback.");
    return fallbackLogic(action, payload);
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action, payload }),
    });
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, error: "Network error" };
  }
};

// Fallback logic for when the URL isn't configured yet
const fallbackLogic = (action: string, payload: any) => {
  switch (action) {
    case 'REGISTER':
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_USERS) || '[]');
      if (users.find((u: any) => u.email === payload.email)) return { success: false };
      users.push(payload);
      localStorage.setItem(STORAGE_KEYS.LOCAL_USERS, JSON.stringify(users));
      return { success: true, user: payload };
    case 'LOGIN':
      const allUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_USERS) || '[]');
      const user = allUsers.find((u: any) => u.email === payload.email && u.password === payload.password);
      return user ? { success: true, user } : { success: false };
    case 'GET_TRANSACTIONS':
      const txs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_TXS) || '[]');
      return { success: true, data: txs.filter((t: any) => t.userId === payload.userId) };
    case 'ADD_TRANSACTION':
      const allTxs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_TXS) || '[]');
      allTxs.push(payload);
      localStorage.setItem(STORAGE_KEYS.LOCAL_TXS, JSON.stringify(allTxs));
      return { success: true };
    default:
      return { success: false };
  }
};

export const storageService = {
  register: async (user: User) => {
    const res = await callAPI('REGISTER', user);
    if (res.success) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(res.user));
    }
    return res;
  },

  login: async (email: string, password?: string) => {
    const res = await callAPI('LOGIN', { email, password });
    if (res.success) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(res.user));
    }
    return res;
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    return session ? JSON.parse(session) : null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  getTransactions: async (userId: string): Promise<Transaction[]> => {
    const res = await callAPI('GET_TRANSACTIONS', { userId });
    return res.success ? res.data : [];
  },

  addTransaction: async (transaction: Transaction) => {
    return await callAPI('ADD_TRANSACTION', transaction);
  },

  getTheme: (): 'light' | 'dark' => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
  },

  setTheme: (theme: 'light' | 'dark') => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
};
