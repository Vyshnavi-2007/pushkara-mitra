import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Ticket, AlertTriangle, ShieldCheck, TrendingUp, DollarSign, Activity, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';
import { calculateCrowdRisk } from '../../shared/utils/crowdRiskEngine';

export const AdminDashboard = () => {
  const { ghats, bookings, missingPersons, announcements, refreshAll } = useData();

  // Metrics Calculation
  const totalGhats = ghats.length;
  const activeBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED');
  const totalPilgrimsBooked = activeBookings.reduce((sum, b) => sum + b.totalPilgrimsCount, 0);
  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const vipRevenue = activeBookings.filter(b => b.ticketType === 'VIP').reduce((sum, b) => sum + b.totalAmount, 0);

  const activeMissingCases = missingPersons.filter(m => m.status !== 'REUNITED' && m.status !== 'CLOSED');
  const criticalGhats = ghats.filter(g => calculateCrowdRisk(g).level === 'CRITICAL' || calculateCrowdRisk(g).level === 'HIGH');

  return (
    <div className="space-y-8 pb-10">
      
      {/* Top Operations Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">Central Operations Control Center</h1>
          </div>
          <p className="text-xs text-slate-400">Pushkaralu 2027 Real-Time Crowd Telemetry, Slot Capacity & Missing Person Command</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshAll}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-400" /> Refresh Telemetry
          </button>
          <Link
            to="/admin/missing"
            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {activeMissingCases.length} Active Missing Cases
          </Link>
        </div>
      </div>

      {/* Top Executive Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-card p-6 border-slate-800 space-y-2 bg-slate-900/90">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Pilgrims Booked</span>
            <Users className="w-5 h-5 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-black text-3xl text-white">{totalPilgrimsBooked.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 font-bold">+12% surge</span>
          </div>
          <p className="text-[11px] text-slate-400">Across 50% reserved online quotas</p>
        </div>

        <div className="glass-card p-6 border-slate-800 space-y-2 bg-slate-900/90">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Pass Revenue</span>
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-black text-3xl text-amber-400">₹{totalRevenue.toLocaleString()}</span>
          </div>
          <p className="text-[11px] text-slate-400">Gen (₹0) & VIP Pass (₹{50})</p>
        </div>

        <div className="glass-card p-6 border-slate-800 space-y-2 bg-slate-900/90">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">High Crowd Risk Ghats</span>
            <Activity className="w-5 h-5 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-black text-3xl text-rose-400">{criticalGhats.length}</span>
            <span className="text-xs text-slate-400">/ {totalGhats} Total Ghats</span>
          </div>
          <p className="text-[11px] text-slate-400">Requires flow throttling</p>
        </div>

        <div className="glass-card p-6 border-slate-800 space-y-2 bg-slate-900/90">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Missing Person Cases</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-black text-3xl text-white">{activeMissingCases.length}</span>
            <span className="text-xs text-emerald-400 font-bold">Active Cases</span>
          </div>
          <p className="text-[11px] text-slate-400">1-click broadcast active</p>
        </div>

      </div>

      {/* Real-time Ghat Crowd Heatmap & Control Grid */}
      <div className="glass-card p-6 border-slate-800 space-y-6 bg-slate-900/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="font-bold text-xl text-white">Ghat Crowd Telemetry & Slot Allocations</h2>
            <p className="text-xs text-slate-400">Monitoring 50% Online Quotas vs 50% Offline Walk-in Buffers</p>
          </div>
          <Link to="/admin/ghats" className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1">
            Configure Capacity Formula <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ghats.map(ghat => {
            const risk = calculateCrowdRisk(ghat);
            const occPct = Math.round((ghat.currentCrowd / ghat.effectiveCapacity) * 100);
            const onlineCap = Math.floor(ghat.effectiveCapacity * 0.5);

            return (
              <div key={ghat.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-white">{ghat.name}</h3>
                    <span className="text-[11px] text-slate-400">📍 {ghat.city}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${risk.badgeClass}`}>
                    {risk.statusText}
                  </span>
                </div>

                {/* Capacity Math Specs */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-900 p-2.5 rounded-xl">
                  <div>
                    <span className="text-slate-500 text-[10px] block font-semibold">PHYSICAL</span>
                    <span className="font-mono font-bold text-white">{ghat.physicalCapacity.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-semibold">EFFECTIVE</span>
                    <span className="font-mono font-bold text-emerald-400">{ghat.effectiveCapacity.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-semibold">50% ONLINE</span>
                    <span className="font-mono font-bold text-sky-400">{onlineCap.toLocaleString()}</span>
                  </div>
                </div>

                {/* Live Occupancy Meter */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Current Occupancy</span>
                    <span className="font-bold text-white">{occPct}%</span>
                  </div>
                  <div className="progress-bar-bg h-2">
                    <div className="progress-fill" style={{ width: `${occPct}%`, backgroundColor: risk.color }} />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-xs">
                  <span className="text-slate-400 text-[11px]">VIP Price: ₹{ghat.vipTicketPrice}</span>
                  <Link
                    to="/admin/ghats"
                    className="text-amber-400 hover:text-amber-300 font-semibold text-[11px]"
                  >
                    Edit Limits →
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
