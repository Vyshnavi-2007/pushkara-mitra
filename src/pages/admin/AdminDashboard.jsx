import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CrowdBadge } from '../../components/shared/CrowdBadge';
import {
  LayoutDashboard,
  Users,
  MapPin,
  ShieldAlert,
  Ticket,
  Clock,
  AlertTriangle,
  TrendingUp,
  Activity,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function AdminDashboard() {
  const { ghats, bookings, missingCases, adminSummary } = useApp();

  const criticalGhats = ghats.filter((g) => {
    const occPct = (g.currentCrowd / g.physicalCapacity) * 100;
    return occPct >= 70;
  });

  const activeMissing = missingCases.filter(c => c.status !== 'REUNITED' && c.status !== 'CLOSED');

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title & Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                Pushkaralu 2027 Command Center
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1 flex items-center">
              <LayoutDashboard className="w-7 h-7 mr-2 text-cyan-400" />
              Centralized Operational Control Center
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/admin/pilgrims"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 shadow"
            >
              Master Pilgrim Registry
            </Link>
            <Link
              to="/admin/missing-persons"
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg flex items-center space-x-1"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Missing Control ({activeMissing.length})</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Booked Visitors"
            value={(adminSummary.totalVisitorsBooked || 0).toLocaleString()}
            subtitle={`${adminSummary.totalVIPBookings || 0} VIP passes issued`}
            icon={<Users className="w-6 h-6 text-cyan-400" />}
            accentColor="border-cyan-500/40"
          />
          <StatCard
            title="High-Crowd Ghats (≥70%)"
            value={adminSummary.highCrowdGhats || 0}
            subtitle={`Out of ${adminSummary.totalGhats || 0} monitored ghats`}
            icon={<AlertTriangle className="w-6 h-6 text-amber-400" />}
            accentColor="border-amber-500/40"
          />
          <StatCard
            title="Active Missing Cases"
            value={adminSummary.activeMissingCases || 0}
            subtitle={`${adminSummary.pendingVerification || 0} pending verification`}
            icon={<ShieldAlert className="w-6 h-6 text-rose-400" />}
            accentColor="border-rose-500/40"
          />
          <StatCard
            title="Family Reunifications"
            value={adminSummary.reunitedCount || 0}
            subtitle="Successfully reunited cases"
            icon={<CheckCircle2 className="w-6 h-6 text-emerald-400" />}
            accentColor="border-emerald-500/40"
          />
        </div>

        {/* Two Col Layout: Critical Crowd Alerts & Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Live Crowd Congestion Alerts */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-amber-400" />
                Live Ghat Crowd Heatmap
              </h3>
              <Link to="/admin/crowd-monitor" className="text-xs text-cyan-400 hover:underline">
                View All Ghats
              </Link>
            </div>

            <div className="space-y-3">
              {ghats.map((ghat) => {
                const occPct = Math.round((ghat.currentCrowd / ghat.physicalCapacity) * 100);
                return (
                  <div key={ghat.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-sm text-white">{ghat.name}</span>
                        <span className="text-[11px] text-slate-400 block">{ghat.city}</span>
                      </div>
                      <CrowdBadge ghat={ghat} currentSlotOccupancy={occPct} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Current Visitor Load: {ghat.currentCrowd.toLocaleString()} / {ghat.physicalCapacity.toLocaleString()}</span>
                        <span>{occPct}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            occPct >= 80 ? 'bg-rose-500' : occPct >= 60 ? 'bg-amber-500' : 'bg-cyan-400'
                          }`}
                          style={{ width: `${occPct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Master Pilgrim Booking Stream */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center">
                <Ticket className="w-5 h-5 mr-2 text-cyan-400" />
                Recent Pilgrim Registrations
              </h3>
              <Link to="/admin/pilgrims" className="text-xs text-cyan-400 hover:underline">
                Master Pilgrim Registry
              </Link>
            </div>

            <div className="space-y-3">
              {bookings.slice(0, 5).map((b) => (
                <div key={b.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between font-bold text-white">
                    <span className="font-mono text-amber-400">{b.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      b.ticketType === 'VIP' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {b.ticketType} PASS ({b.totalPilgrims} Person(s))
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Lead: <strong>{b.leadPilgrim.fullName}</strong> ({b.leadPilgrim.city})</span>
                    <span className="text-slate-400">{b.ghatName}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Slot: {b.timeSlot} • Aadhaar: {b.leadPilgrim.aadhaarNumber}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, accentColor }) {
  return (
    <div className={`p-6 rounded-3xl bg-slate-900 border ${accentColor} shadow-xl space-y-3`}>
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{title}</span>
        <div className="p-2.5 rounded-xl bg-slate-800">{icon}</div>
      </div>
      <div>
        <p className="text-3xl font-extrabold text-white">{value}</p>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
