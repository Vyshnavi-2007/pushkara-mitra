import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Waves,
  ShieldAlert,
  Compass,
  CalendarCheck,
  LayoutDashboard,
  Bell,
  Users,
  Search,
  MapPin,
  Sparkles,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export function Header() {
  const location = useLocation();
  const { activeTab, setActiveTab, notifications, missingCases } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = location.pathname.startsWith('/admin');
  const unreadNotifs = notifications.filter(n => !n.read).length;
  const activeMissingCount = missingCases.filter(c => c.status !== 'REUNITED' && c.status !== 'CLOSED').length;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top Emergency & System Ticker */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-amber-50 px-4 py-1.5 text-xs font-medium flex justify-between items-center overflow-hidden">
        <div className="flex items-center space-x-2 animate-pulse">
          <ShieldAlert className="w-4 h-4 text-amber-200" />
          <span>
            <strong>PUSHKARALU 2027 OPERATIONAL PROTOTYPE</strong> — Simulated Real-Time Pilgrim Management & Emergency Safety Portal
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <span className="bg-amber-900/60 px-2 py-0.5 rounded text-[11px] border border-amber-400/30">
            Helpline: <strong>1800-425-GOV</strong> (24/7 Toll-Free)
          </span>
          <span className="text-amber-200 text-[11px]">
            Rajamahendravaram • Kovvur • Godavari River Zone
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Brand */}
          <Link to={isAdmin ? "/admin/dashboard" : "/"} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
                  GODAVARI SEVA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  2027
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Digital Pilgrim & Safety Platform</p>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          {!isAdmin ? (
            <nav className="hidden lg:flex items-center space-x-1">
              <NavLink to="/" active={location.pathname === '/'}>
                <Compass className="w-4 h-4 mr-1.5 text-cyan-400" />
                Home
              </NavLink>
              <NavLink to="/ghats" active={location.pathname.startsWith('/ghats')}>
                <MapPin className="w-4 h-4 mr-1.5 text-cyan-400" />
                Explore Ghats
              </NavLink>
              <NavLink to="/recommend" active={location.pathname === '/recommend'}>
                <Sparkles className="w-4 h-4 mr-1.5 text-amber-400" />
                Smart Finder
              </NavLink>
              <NavLink to="/my-bookings" active={location.pathname === '/my-bookings'}>
                <CalendarCheck className="w-4 h-4 mr-1.5 text-cyan-400" />
                My Passes
              </NavLink>
              <NavLink to="/safety" active={location.pathname.startsWith('/safety')}>
                <ShieldAlert className="w-4 h-4 mr-1.5 text-rose-400" />
                Safety Hub
                {activeMissingCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-600 text-white font-bold animate-pulse">
                    {activeMissingCount}
                  </span>
                )}
              </NavLink>
            </nav>
          ) : (
            <nav className="hidden lg:flex items-center space-x-1">
              <NavLink to="/admin/dashboard" active={location.pathname === '/admin/dashboard'}>
                <LayoutDashboard className="w-4 h-4 mr-1.5 text-cyan-400" />
                Dashboard
              </NavLink>
              <NavLink to="/admin/pilgrims" active={location.pathname === '/admin/pilgrims'}>
                <Users className="w-4 h-4 mr-1.5 text-cyan-400" />
                Pilgrim Registry
              </NavLink>
              <NavLink to="/admin/ghats" active={location.pathname === '/admin/ghats'}>
                <MapPin className="w-4 h-4 mr-1.5 text-cyan-400" />
                Ghat Config
              </NavLink>
              <NavLink to="/admin/crowd-monitor" active={location.pathname === '/admin/crowd-monitor'}>
                <Waves className="w-4 h-4 mr-1.5 text-amber-400" />
                Live Crowd
              </NavLink>
              <NavLink to="/admin/missing-persons" active={location.pathname === '/admin/missing-persons'}>
                <ShieldAlert className="w-4 h-4 mr-1.5 text-rose-400" />
                Missing Control
              </NavLink>
            </nav>
          )}

          {/* Right Action & Portal Switcher */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700 transition relative"
                title="Notifications & Safety Alerts"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 text-slate-200">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <h4 className="font-bold text-sm text-white flex items-center">
                      <Bell className="w-4 h-4 mr-1.5 text-cyan-400" />
                      Live Alerts & Notifications
                    </h4>
                    <span className="text-xs text-slate-400">{notifications.length} total</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 my-2">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="py-2.5 px-1 hover:bg-slate-800/50 rounded-lg transition">
                        <div className="flex justify-between text-xs font-semibold text-white">
                          <span>{notif.title}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Portal Switcher Button */}
            {!isAdmin ? (
              <Link
                to="/admin/dashboard"
                onClick={() => setActiveTab('admin')}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Switch to Admin Portal</span>
              </Link>
            ) : (
              <Link
                to="/"
                onClick={() => setActiveTab('user')}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 transition"
              >
                <Compass className="w-4 h-4" />
                <span>Switch to Pilgrim Portal</span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {!isAdmin ? (
            <>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 font-medium text-sm">Home</Link>
              <Link to="/ghats" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 font-medium text-sm">Explore Ghats</Link>
              <Link to="/recommend" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 font-medium text-sm">Smart Recommendation</Link>
              <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 font-medium text-sm">My Digital Passes</Link>
              <Link to="/safety" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-rose-400 font-medium text-sm">Safety & Missing Persons</Link>
              <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block mt-4 py-2 px-4 rounded-xl bg-amber-500 text-slate-950 font-bold text-center text-xs">Switch to Admin Portal</Link>
            </>
          ) : (
            <>
              <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 font-medium text-sm">Control Dashboard</Link>
              <Link to="/admin/pilgrims" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 font-medium text-sm">Pilgrim Registry</Link>
              <Link to="/admin/ghats" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 font-medium text-sm">Ghat Management</Link>
              <Link to="/admin/crowd-monitor" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 font-medium text-sm">Crowd Monitoring</Link>
              <Link to="/admin/missing-persons" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-rose-400 font-medium text-sm">Missing Control Center</Link>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block mt-4 py-2 px-4 rounded-xl bg-cyan-500 text-white font-bold text-center text-xs">Switch to Pilgrim Portal</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center transition ${
        active
          ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-inner'
          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
      }`}
    >
      {children}
    </Link>
  );
}
