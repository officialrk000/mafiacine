
import React, { useState } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';
import { Wallet, LogIn, UserPlus, Eye, EyeOff, Loader2 } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await storageService.login(email, password);
        if (res.success && res.user) {
          onLogin(res.user);
        } else {
          setError(res.error || 'Invalid email or password');
        }
      } else {
        if (!name) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        const newUser: User = { id: Date.now().toString(), name, email, password };
        const res = await storageService.register(newUser);
        if (res.success && res.user) {
          onLogin(res.user);
        } else {
          setError(res.error || 'Registration failed or email exists');
        }
      }
    } catch (err) {
      setError('Connection failed. Please check your internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-500 text-white rounded-[1.5rem] shadow-xl shadow-emerald-500/20 mb-6">
            <Wallet size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">FinTrack Pro</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Secure Google Sheets Backend</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Full Name</label>
              <input
                type="text"
                disabled={loading}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 outline-none focus:border-emerald-500 dark:focus:border-emerald-500/50 dark:text-white transition-all disabled:opacity-50"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              disabled={loading}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 outline-none focus:border-emerald-500 dark:focus:border-emerald-500/50 dark:text-white transition-all disabled:opacity-50"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              disabled={loading}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 outline-none focus:border-emerald-500 dark:focus:border-emerald-500/50 dark:text-white transition-all disabled:opacity-50"
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[2.4rem] text-slate-400 hover:text-emerald-500 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <p className="text-rose-500 text-sm font-bold text-center bg-rose-50 dark:bg-rose-500/10 p-3 rounded-xl">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] mt-4 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              isLogin ? <><LogIn size={20} /> Login</> : <><UserPlus size={20} /> Create Account</>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              disabled={loading}
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-emerald-500 hover:text-emerald-600 font-bold ml-1 transition-colors disabled:opacity-50"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
