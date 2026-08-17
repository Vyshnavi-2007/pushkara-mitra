import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Shield, Key, ArrowRight } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, t } = useData();

  const [username, setUsername] = useState('admin_godavari');
  const [password, setPassword] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    login('ADMIN', 'Chief Control Officer', username);
    navigate('/admin');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto">
          <LayoutDashboard className="w-8 h-8" />
        </div>
        <h1 className="font-heading font-black text-3xl text-white">{t('adminLogin')}</h1>
        <p className="text-xs text-slate-400">Central Pushkaralu Crowd Control & Operations Command Center.</p>
      </div>

      <div className="glass-card p-8 border-amber-500/30 space-y-6 bg-slate-900/90 shadow-2xl">
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Username *</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Administrative Passcode *</label>
            <input
              type="password"
              placeholder="123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            className="w-full gradient-saffron hover:opacity-90 text-slate-950 font-bold text-sm py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            Access Control Center Operations <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-slate-800 pt-4 text-center text-xs space-y-2">
          <div className="flex justify-between text-slate-400 font-medium">
            <Link to="/login" className="hover:underline">← Pilgrim Login</Link>
            <Link to="/staff/login" className="hover:underline">Staff Checkpoint Login →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
