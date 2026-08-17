/*import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';

// Backend base URL. Override in a .env with VITE_API_URL if needed.
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const PilgrimLoginPage = () => {
  const navigate = useNavigate();
  const { login, t } = useData();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && (!form.name || !form.phone || !form.password)) {
      setError('Name, phone number and password are required.');
      return;
    }
    if (mode === 'login' && (!form.phone || !form.password)) {
      setError('Please enter your phone number and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      // Save the pilgrim into app auth state (persists via DataContext)
      login('PILGRIM', data.pilgrim.name, data.pilgrim.phone);
      navigate('/');
    } catch (err) {
      setError('Could not reach the server. Is the backend running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-[#F4A63B]/20 text-[#F4A63B] border border-[#F4A63B]/30 rounded-2xl flex items-center justify-center mx-auto">
          <UserCheck className="w-8 h-8" />
        </div>
        <h1 className="font-heading font-black text-3xl text-[#F5EAD6]">
          {mode === 'login' ? (t('pilgrimLogin') || 'Pilgrim Login') : 'Create Pilgrim Account'}
        </h1>
        <p className="text-xs text-[#cdbfa6]">Access your digital ticket passes, family bookings, and safety services.</p>
      </div>

      <div className="p-8 rounded-2xl border border-[#F4A63B]/30 bg-[#0d2130]/90 shadow-2xl space-y-6">

        {/* Mode toggle 
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#0A1822] border border-[#E7C15B]/15">
          {['login', 'register'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(''); }}
              className={`py-2 rounded-lg text-sm font-bold transition-all ${
                mode === m ? 'bg-gradient-to-tr from-[#F4A63B] to-[#FF8A3D] text-[#2a1400]' : 'text-[#cdbfa6] hover:text-[#F5EAD6]'
              }`}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#cdbfa6] mb-1">Pilgrim Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Ramesh Varma"
                value={form.name}
                onChange={set('name')}
                className="w-full bg-[#0A1822] border border-[#E7C15B]/20 rounded-xl px-4 py-3 text-sm text-[#F5EAD6] outline-none focus:border-[#F4A63B]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#cdbfa6] mb-1">Mobile Phone Number *</label>
            <input
              type="tel"
              placeholder="+91 98480 XXXXX"
              value={form.phone}
              onChange={set('phone')}
              className="w-full bg-[#0A1822] border border-[#E7C15B]/20 rounded-xl px-4 py-3 text-sm text-[#F5EAD6] outline-none focus:border-[#F4A63B]"
            />
          </div>

          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#cdbfa6] mb-1">City</label>
                <input
                  type="text"
                  placeholder="Rajamahendravaram"
                  value={form.city}
                  onChange={set('city')}
                  className="w-full bg-[#0A1822] border border-[#E7C15B]/20 rounded-xl px-4 py-3 text-sm text-[#F5EAD6] outline-none focus:border-[#F4A63B]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#cdbfa6] mb-1">Email</label>
                <input
                  type="email"
                  placeholder="optional"
                  value={form.email}
                  onChange={set('email')}
                  className="w-full bg-[#0A1822] border border-[#E7C15B]/20 rounded-xl px-4 py-3 text-sm text-[#F5EAD6] outline-none focus:border-[#F4A63B]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#cdbfa6] mb-1">Password *</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              className="w-full bg-[#0A1822] border border-[#E7C15B]/20 rounded-xl px-4 py-3 text-sm text-[#F5EAD6] outline-none focus:border-[#F4A63B]"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-tr from-[#F4A63B] to-[#FF8A3D] text-[#2a1400] hover:brightness-105 disabled:opacity-60 font-bold text-sm py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {mode === 'login' ? 'Sign In as Pilgrim' : 'Register & Continue'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="border-t border-[#E7C15B]/15 pt-4 text-center text-xs space-y-2">
          <p className="text-[#cdbfa6]">Looking for other portal logins?</p>
          <div className="flex justify-center gap-4 text-[#E7C15B] font-semibold">
            <Link to="/staff/login" className="hover:underline">Staff Checkpoint Login →</Link>
            <Link to="/admin/login" className="hover:underline">Admin Login →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
*/


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserCheck, Shield, Key, ArrowRight } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';

export const PilgrimLoginPage = () => {
  const navigate = useNavigate();
  const { login, t } = useData();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handlePilgrimLogin = (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Please enter Name and Phone number.");
      return;
    }
    login('PILGRIM', name.trim(), phone.trim());
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-2xl flex items-center justify-center mx-auto">
          <UserCheck className="w-8 h-8" />
        </div>
        <h1 className="font-heading font-black text-3xl text-white">{t('pilgrimLogin')}</h1>
        <p className="text-xs text-slate-400">Access your digital ticket passes, family bookings, and safety services.</p>
      </div>

      <div className="glass-card p-8 border-sky-500/30 space-y-6 bg-slate-900/90 shadow-2xl">
        <form onSubmit={handlePilgrimLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Pilgrim Full Name *</label>
            <input
              type="text"
              required
              placeholder="Enter Ramesh Varma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="Enter +91 98480 12365"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
            />
          </div>

          <button
            type="submit"
            className="w-full gradient-river hover:opacity-90 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            Sign In as Pilgrim <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-slate-800 pt-4 text-center text-xs space-y-2">
          <p className="text-slate-400">Looking for other portal logins?</p>
          <div className="flex justify-center gap-4 text-sky-400 font-semibold">
            <Link to="/staff/login" className="hover:underline">Staff Checkpoint Login →</Link>
            <Link to="/admin/login" className="hover:underline">Admin Login →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
