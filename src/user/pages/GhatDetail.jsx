import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ShieldCheck, MapPin, Users, Ticket, ArrowLeft, AlertCircle, Info, Sparkles } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';
import { calculateCrowdRisk } from '../../shared/utils/crowdRiskEngine';

export const GhatDetail = () => {
  const { id } = useParams();
  const { ghats, slots } = useData();

  const ghat = ghats.find(g => g.id === id) || ghats[0];
  const ghatSlots = slots.filter(s => s.ghatId === ghat.id);
  const risk = calculateCrowdRisk(ghat);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back Link */}
      <Link to="/ghats" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to All Ghats
      </Link>

      {/* Ghat Banner Header */}
      <div className="relative rounded-3xl overflow-hidden min-h-[300px] flex items-end p-8 border border-white/10">
        <img src={ghat.image} alt={ghat.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${risk.badgeClass}`}>
              {risk.statusText}
            </span>
            <span className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10">
              📍 {ghat.city}, {ghat.district}
            </span>
            <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30">
              {ghat.famousLevel}
            </span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-5xl text-white">{ghat.name}</h1>
          <p className="text-slate-300 text-sm leading-relaxed">{ghat.description}</p>
        </div>
      </div>

      {/* Capacity Architecture & Quota Formula Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Effective Capacity Breakdown Card */}
        <div className="glass-card p-6 border-slate-700/50 space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-bold text-xl text-white">Capacity & Operational Model</h2>
              <p className="text-xs text-slate-400">Effective Capacity formula & 50% online allocation rule</p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Formula: MIN(Physical, Entry, Exit)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Physical Capacity</span>
              <p className="text-2xl font-black text-white font-mono">{ghat.physicalCapacity.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500">Max physical density</p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Entry / Exit Cap</span>
              <p className="text-2xl font-black text-amber-400 font-mono">
                {ghat.entryCapacity.toLocaleString()} / {ghat.exitCapacity.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500">Flow throughput limit</p>
            </div>

            <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/30 space-y-1">
              <span className="text-[11px] text-emerald-300 uppercase font-semibold">Effective Capacity</span>
              <p className="text-2xl font-black text-emerald-400 font-mono">{ghat.effectiveCapacity.toLocaleString()}</p>
              <p className="text-[10px] text-emerald-400/80">30-minute bath safety limit</p>
            </div>
          </div>

          {/* 50% Online Quota Bar */}
          <div className="bg-sky-950/40 p-4 rounded-2xl border border-sky-500/30 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-sky-400" />
                Online Booking Allocation (50% Rule)
              </span>
              <span className="font-mono font-bold text-sky-300">
                {(ghat.effectiveCapacity * 0.5).toLocaleString()} slots online
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">General Quota (80%)</span>
                  <span className="text-white font-mono">{Math.floor(ghat.effectiveCapacity * 0.5 * 0.8).toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-slate-400">Price: ₹{ghat.generalTicketPrice} / pilgrim</p>
              </div>

              <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-500/30 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-purple-300">VIP Quota (20%)</span>
                  <span className="text-purple-200 font-mono">{Math.floor(ghat.effectiveCapacity * 0.5 * 0.2).toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-purple-300/80">Price: ₹{ghat.vipTicketPrice} / pilgrim (Express Line)</p>
              </div>
            </div>

            <div className="text-[11px] text-sky-200/80 flex items-center gap-2 pt-1">
              <Info className="w-3.5 h-3.5 shrink-0 text-sky-400" />
              <span>The remaining 50% ({(ghat.effectiveCapacity * 0.5).toLocaleString()} slots) is strictly reserved for on-ground walk-in pilgrims.</span>
            </div>
          </div>

        </div>

        {/* Crowd Risk Breakdown Card */}
        <div className="glass-card p-6 border-slate-700/50 space-y-6">
          <h2 className="font-bold text-xl text-white border-b border-slate-800 pb-4">Crowd Risk Analysis</h2>

          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-amber-500/40 bg-amber-500/10">
              <span className="font-mono font-black text-3xl text-amber-400">{risk.score}</span>
              <span className="text-xs text-amber-300">/100</span>
            </div>
            <p className="font-bold text-white text-base">{risk.statusText}</p>
            <p className="text-xs text-slate-400">Rule-based multi-factor prototype index</p>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {risk.factors.map((f, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>{f.name} ({f.weight})</span>
                  <span className="font-mono font-bold text-white">{f.score}/100</span>
                </div>
                <div className="progress-bar-bg h-1.5">
                  <div className="progress-fill bg-sky-400" style={{ width: `${f.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 30-Minute Slot Timetable Section */}
      <div className="glass-card p-8 border-slate-700/50 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h2 className="font-heading font-bold text-2xl text-white">30-Minute Slot Timetable</h2>
            <p className="text-xs text-slate-400">Select a slot to reserve General (₹20) or VIP (₹250) family tickets</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Near Cap</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Full</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ghatSlots.map(slot => (
            <div 
              key={slot.id}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                slot.status === 'FULL' 
                  ? 'bg-slate-900/40 border-slate-800 opacity-60' 
                  : 'bg-slate-900/80 border-slate-700/60 hover:border-sky-400'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-white text-base flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-400" />
                  {slot.startTime} – {slot.endTime}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  slot.status === 'FULL' ? 'bg-rose-500/20 text-rose-300' :
                  slot.status === 'NEAR_CAPACITY' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {slot.occupancyPercentage}% Occupied
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="bg-slate-950 p-2 rounded-lg">
                  <span className="text-slate-400 block">General Rem.</span>
                  <span className="font-mono font-bold text-white">{slot.generalRemaining.toLocaleString()}</span>
                </div>
                <div className="bg-purple-950/40 p-2 rounded-lg border border-purple-500/20">
                  <span className="text-purple-300 block">VIP Rem.</span>
                  <span className="font-mono font-bold text-purple-200">{slot.vipRemaining.toLocaleString()}</span>
                </div>
              </div>

              {slot.status !== 'FULL' ? (
                <Link
                  to={`/book?ghat=${ghat.id}&slot=${slot.id}`}
                  className="w-full block text-center gradient-river hover:opacity-90 text-white font-bold text-xs py-2 rounded-xl transition-all shadow-md"
                >
                  Book This Slot
                </Link>
              ) : (
                <button disabled className="w-full text-center bg-slate-800 text-slate-500 font-bold text-xs py-2 rounded-xl cursor-not-allowed">
                  Slot Fully Booked
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
