import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { QrCode, Shield, Key, ArrowRight } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';

export const StaffLoginPage = () => {
  const navigate = useNavigate();
  const { login, t } = useData();

  const [badgeId, setBadgeId] = useState('STAFF-REDDY-04');
  const [password, setPassword] = useState('');

  const handleStaffLogin = (e) => {
    e.preventDefault();
    login('STAFF', `Officer ${badgeId.toUpperCase()}`, badgeId);
    navigate('/staff/scanner');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto">
          <QrCode className="w-8 h-8" />
        </div>
        <h1 className="font-heading font-black text-3xl text-white">{t('staffLogin')}</h1>
        <p className="text-xs text-slate-400">On-ground gate security terminal for scanning pilgrim passes & gate clearance.</p>
      </div>

      <div className="glass-card p-8 border-emerald-500/30 space-y-6 bg-slate-900/90 shadow-2xl">
        <form onSubmit={handleStaffLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Staff Badge ID / Officer Name *</label>
            <input
              type="text"
              required
              value={badgeId}
              onChange={(e) => setBadgeId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Gate Passcode *</label>
            <input
              type="password"
              placeholder="Enter 123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-emerald-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            Access Staff QR Scanner Terminal <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-slate-800 pt-4 text-center text-xs space-y-2">
          <div className="flex justify-between text-slate-400 font-medium">
            <Link to="/login" className="hover:underline">← Pilgrim Login</Link>
            <Link to="/admin/login" className="hover:underline">Admin Control Login →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
