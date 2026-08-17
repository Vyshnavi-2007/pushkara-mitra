import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, UserCheck, AlertTriangle, Database, LayoutDashboard, Utensils, Flame, QrCode, Globe, LogOut, LogIn } from 'lucide-react';
import { useData } from '../context/DataContext';

export const Navbar = () => {
  const location = useLocation();
  const { lang, changeLang, t, userAuth, logout } = useData();

  const isStaffPortal = location.pathname.startsWith('/staff');
  const isAdminPortal = location.pathname.startsWith('/admin');

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${
      isAdminPortal ? 'bg-[#0A1822]/95 border-[#E7C15B]/30' :
      isStaffPortal ? 'bg-[#0A1822]/95 border-[#2FA6A0]/30' : 'bg-[#0A1822]/90 border-[#E7C15B]/15'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand Logo & Portal Indicator */}
          <Link to={isAdminPortal ? "/admin" : isStaffPortal ? "/staff/scanner" : "/"} className="flex items-center gap-3 group">
            <div className={`p-2.5 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
              isAdminPortal ? 'bg-gradient-to-tr from-[#E7C15B] to-[#7A1F2B] shadow-lg shadow-[#E7C15B]/20' :
              isStaffPortal ? 'bg-gradient-to-tr from-[#2FA6A0] to-[#0d5f5a] shadow-lg shadow-[#2FA6A0]/20' :
              'bg-gradient-to-tr from-[#F4A63B] to-[#7A1F2B] shadow-lg shadow-[#F4A63B]/25'
            }`}>
              {isAdminPortal ? <LayoutDashboard className="w-6 h-6 text-white" /> :
               isStaffPortal ? <QrCode className="w-6 h-6 text-white" /> :
               <Shield className="w-6 h-6 text-white" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-xl tracking-wider text-[#F5EAD6]">{t('brandTitle')}</span>
                {(isAdminPortal || isStaffPortal) && (
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold border ${
                    isAdminPortal ? 'bg-[#E7C15B]/20 text-[#E7C15B] border-[#E7C15B]/30' :
                    'bg-[#2FA6A0]/20 text-[#7ff0e9] border-[#2FA6A0]/30'
                  }`}>
                    {isAdminPortal ? 'Admin Command' : 'Staff Checkpoint'}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#cdbfa6] font-medium">
                {t('brandSubtitle')}
              </p>
            </div>
          </Link>

          {/* Contextual Navigation Links based on Portal */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
            {!isAdminPortal && !isStaffPortal && (
              <>
                <Link to="/" className={`transition-colors hover:text-[#E7C15B] ${location.pathname === '/' ? 'text-[#F4A63B] font-bold' : 'text-[#cdbfa6]'}`}>
                  {t('home')}
                </Link>
                <Link to="/ghats" className={`transition-colors hover:text-[#E7C15B] ${location.pathname === '/ghats' ? 'text-[#F4A63B] font-bold' : 'text-[#cdbfa6]'}`}>
                  {t('bathingSlots')}
                </Link>
                <Link to="/pujas" className={`transition-colors hover:text-[#FF8A3D] flex items-center gap-1 ${location.pathname === '/pujas' ? 'text-[#FF8A3D] font-bold' : 'text-[#cdbfa6]'}`}>
                  <Flame className="w-4 h-4 text-[#FF8A3D]" />
                  {t('devotionalPujas')}
                </Link>
                <Link to="/food" className={`transition-colors hover:text-[#2FA6A0] flex items-center gap-1 ${location.pathname === '/food' ? 'text-[#2FA6A0] font-bold' : 'text-[#cdbfa6]'}`}>
                  <Utensils className="w-4 h-4 text-[#2FA6A0]" />
                  {t('foodNearMe')}
                </Link>
                <Link to="/safety" className={`transition-colors hover:text-rose-400 flex items-center gap-1 ${location.pathname.startsWith('/safety') ? 'text-rose-400 font-bold' : 'text-[#cdbfa6]'}`}>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  {t('safetyCenter')}
                </Link>
              </>
            )}

            {isStaffPortal && (
              <>
                <Link to="/staff/scanner" className={`transition-colors hover:text-[#2FA6A0] flex items-center gap-1.5 ${location.pathname === '/staff/scanner' ? 'text-[#2FA6A0] font-bold' : 'text-[#cdbfa6]'}`}>
                  <QrCode className="w-4 h-4 text-[#2FA6A0]" />
                  Gate QR Scanner Terminal
                </Link>
                <span className="text-xs text-slate-500 font-mono">| Dedicated Gate Security Portal</span>
              </>
            )}

            {isAdminPortal && (
              <>
                <Link to="/admin" className={`transition-colors hover:text-[#E7C15B] ${location.pathname === '/admin' ? 'text-[#E7C15B] font-bold' : 'text-[#cdbfa6]'}`}>
                  Dashboard
                </Link>
                <Link to="/admin/ghats" className={`transition-colors hover:text-[#E7C15B] ${location.pathname === '/admin/ghats' ? 'text-[#E7C15B] font-bold' : 'text-[#cdbfa6]'}`}>
                  Capacity Config
                </Link>
                <Link to="/admin/customers" className={`transition-colors hover:text-[#E7C15B] ${location.pathname === '/admin/customers' ? 'text-[#E7C15B] font-bold' : 'text-[#cdbfa6]'}`}>
                  Aadhaar Ledger
                </Link>
                <Link to="/admin/missing" className={`transition-colors hover:text-[#E7C15B] ${location.pathname === '/admin/missing' ? 'text-[#E7C15B] font-bold' : 'text-[#cdbfa6]'}`}>
                  Missing Control
                </Link>
                <Link to="/admin/mongo-guide" className={`transition-colors hover:text-[#2FA6A0] flex items-center gap-1 ${location.pathname === '/admin/mongo-guide' ? 'text-[#2FA6A0] font-bold' : 'text-[#cdbfa6]'}`}>
                  <Database className="w-4 h-4 text-[#2FA6A0]" />
                  MongoDB Guide
                </Link>
              </>
            )}
          </nav>

          {/* Language Selector & Portal Auth Switcher */}
          <div className="flex items-center gap-3">

            {/* Language Dropdown */}
            <div className="relative flex items-center bg-[#0d2130] border border-[#E7C15B]/20 rounded-xl px-2.5 py-1 text-xs font-bold">
              <Globe className="w-3.5 h-3.5 text-[#F4A63B] mr-1.5" />
              <select
                value={lang}
                onChange={(e) => changeLang(e.target.value)}
                className="bg-transparent text-[#F5EAD6] outline-none cursor-pointer pr-1"
              >
                <option value="EN" className="bg-[#0d2130]">English</option>
                <option value="TE" className="bg-[#0d2130]">తెలుగు (Telugu)</option>
                <option value="HI" className="bg-[#0d2130]">हिंदी (Hindi)</option>
              </select>
            </div>

            {/* PILGRIM VIEW: primary Sign In, with Staff/Admin demoted behind a divider */}
            {!isAdminPortal && !isStaffPortal && (
              <div className="flex items-center gap-2">
                {!userAuth.isLoggedIn && (
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-tr from-[#F4A63B] to-[#FF8A3D] text-[#2a1400] shadow-lg shadow-[#F4A63B]/25 hover:brightness-105 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    {t('signIn') || 'Sign In'}
                  </Link>
                )}

                {/* subtle divider between pilgrim action and staff/admin access */}
                <span className="hidden md:block w-px h-6 bg-[#E7C15B]/20 mx-1" />

                <Link
                  to="/staff/login"
                  title="Staff / Gate QR Checkpoint"
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#7ff0e9] border border-[#2FA6A0]/30 hover:bg-[#2FA6A0]/15 transition-all"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  Staff
                </Link>
                <Link
                  to="/admin/login"
                  title="Admin Control Center"
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#E7C15B] border border-[#E7C15B]/30 hover:bg-[#E7C15B]/15 transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Admin
                </Link>
              </div>
            )}

            {/* STAFF/ADMIN VIEW: return to pilgrim site */}
            {(isAdminPortal || isStaffPortal) && (
              <Link
                to="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F4A63B]/10 text-[#F4A63B] border border-[#F4A63B]/30 hover:bg-[#F4A63B]/20 transition-all"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Pilgrim View
              </Link>
            )}

            {/* User Auth Logout if logged in */}
            {userAuth.isLoggedIn && (
              <button
                onClick={logout}
                title={`Logout ${userAuth.name}`}
                className="p-2 rounded-xl bg-[#0d2130] text-rose-400 hover:bg-rose-500/20 border border-[#E7C15B]/15 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};



/*import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Sparkles, UserCheck, AlertTriangle, Database, LayoutDashboard, Utensils, Flame, QrCode, Globe, LogOut, Lock } from 'lucide-react';
import { useData } from '../context/DataContext';

export const Navbar = () => {
  const location = useLocation();
  const { lang, changeLang, t, userAuth, logout } = useData();

  const isStaffPortal = location.pathname.startsWith('/staff');
  const isAdminPortal = location.pathname.startsWith('/admin');

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${
      isAdminPortal ? 'bg-[#06121E]/95 border-amber-500/30' :
      isStaffPortal ? 'bg-[#06121E]/95 border-emerald-500/30' : 'bg-[#0D1F32]/90 border-white/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Portal Indicator 
          <Link to={isAdminPortal ? "/admin" : isStaffPortal ? "/staff/scanner" : "/"} className="flex items-center gap-3 group">
            <div className={`p-2.5 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
              isAdminPortal ? 'bg-gradient-to-tr from-amber-500 to-orange-600 shadow-lg shadow-orange-500/20' :
              isStaffPortal ? 'bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20' :
              'bg-gradient-to-tr from-sky-500 to-blue-600 shadow-lg shadow-sky-500/20'
            }`}>
              {isAdminPortal ? <LayoutDashboard className="w-6 h-6 text-white" /> :
               isStaffPortal ? <QrCode className="w-6 h-6 text-white" /> :
               <Shield className="w-6 h-6 text-white" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-xl tracking-wider text-white">{t('brandTitle')}</span>
                <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold border ${
                  isAdminPortal ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                  isStaffPortal ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                  'bg-sky-500/20 text-sky-300 border-sky-500/30'
                }`}>
                  {isAdminPortal ? 'Admin Command' : isStaffPortal ? 'Staff Checkpoint' : 'Pilgrim Portal'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {t('brandSubtitle')}
              </p>
            </div>
          </Link>

          
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
            {!isAdminPortal && !isStaffPortal && (
              <>
                <Link to="/" className={`transition-colors hover:text-sky-400 ${location.pathname === '/' ? 'text-sky-400 font-bold' : 'text-slate-300'}`}>
                  {t('home')}
                </Link>
                <Link to="/ghats" className={`transition-colors hover:text-sky-400 ${location.pathname === '/ghats' ? 'text-sky-400 font-bold' : 'text-slate-300'}`}>
                  {t('bathingSlots')}
                </Link>
                <Link to="/pujas" className={`transition-colors hover:text-amber-400 flex items-center gap-1 ${location.pathname === '/pujas' ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                  <Flame className="w-4 h-4 text-amber-400" />
                  {t('devotionalPujas')}
                </Link>
                <Link to="/food" className={`transition-colors hover:text-emerald-400 flex items-center gap-1 ${location.pathname === '/food' ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                  <Utensils className="w-4 h-4 text-emerald-400" />
                  {t('foodNearMe')}
                </Link>
                <Link to="/safety" className={`transition-colors hover:text-rose-400 flex items-center gap-1 ${location.pathname.startsWith('/safety') ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  {t('safetyCenter')}
                </Link>
              </>
            )}

            {isStaffPortal && (
              <>
                <Link to="/staff/scanner" className={`transition-colors hover:text-emerald-400 flex items-center gap-1.5 ${location.pathname === '/staff/scanner' ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  Gate QR Scanner Terminal
                </Link>
                <span className="text-xs text-slate-500 font-mono">| Dedicated Gate Security Portal</span>
              </>
            )}

            {isAdminPortal && (
              <>
                <Link to="/admin" className={`transition-colors hover:text-amber-400 ${location.pathname === '/admin' ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                  Dashboard
                </Link>
                <Link to="/admin/ghats" className={`transition-colors hover:text-amber-400 ${location.pathname === '/admin/ghats' ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                  Capacity Config
                </Link>
                <Link to="/admin/customers" className={`transition-colors hover:text-amber-400 ${location.pathname === '/admin/customers' ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                  Aadhaar Ledger
                </Link>
                <Link to="/admin/missing" className={`transition-colors hover:text-amber-400 ${location.pathname === '/admin/missing' ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                  Missing Control
                </Link>
                <Link to="/admin/mongo-guide" className={`transition-colors hover:text-emerald-400 flex items-center gap-1 ${location.pathname === '/admin/mongo-guide' ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                  <Database className="w-4 h-4 text-emerald-400" />
                  MongoDB Guide
                </Link>
              </>
            )}
          </nav>

     
          <div className="flex items-center gap-3">
            
            {/* Language Dropdown 
            <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-xs font-bold">
              <Globe className="w-3.5 h-3.5 text-sky-400 mr-1.5" />
              <select
                value={lang}
                onChange={(e) => changeLang(e.target.value)}
                className="bg-transparent text-white outline-none cursor-pointer pr-1"
              >
                <option value="EN" className="bg-slate-900">English</option>
                <option value="TE" className="bg-slate-900">తెలుగు (Telugu)</option>
                <option value="HI" className="bg-slate-900">हिंदी (Hindi)</option>
              </select>
            </div>

             Portal Switcher Buttons & Auth status 
            {!isAdminPortal && !isStaffPortal && (
              <div className="flex items-center gap-2">
                <Link 
                  to="/staff/login" 
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  Staff Portal
                </Link>
                <Link 
                  to="/admin/login" 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Admin Portal
                </Link>
              </div>
            )}

            {(isAdminPortal || isStaffPortal) && (
              <Link 
                to="/" 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 transition-all"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Pilgrim View
              </Link>
            )}

             User Auth Logout if logged in 
            {userAuth.isLoggedIn && (
              <button
                onClick={logout}
                title={`Logout ${userAuth.name}`}
                className="p-2 rounded-xl bg-slate-800 text-rose-400 hover:bg-rose-500/20 border border-slate-700 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
*/