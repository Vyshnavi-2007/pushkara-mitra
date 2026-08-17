import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Check, ArrowRight, ShieldCheck, MapPin, Users, HeartHandshake, Info } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';
import { getSmartRecommendations } from '../../shared/utils/recommendationEngine';

export const RecommendationWizard = () => {
  const { ghats } = useData();

  const [preferWheelchair, setPreferWheelchair] = useState(false);
  const [preferParking, setPreferParking] = useState(true);
  const [targetCity, setTargetCity] = useState('ALL');

  const recommendations = getSmartRecommendations(ghats, {
    preferWheelchair,
    preferParking,
    targetCity: targetCity === 'ALL' ? null : targetCity
  });

  const topPick = recommendations[0];
  const runnersUp = recommendations.slice(1, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Explainable Smart Recommendation Algorithm
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white">Find Your Ideal Pushkaralu Ghat</h1>
        <p className="text-slate-300 text-sm">
          Instead of standing in heavy queues at Pushkar Ghat, let our algorithm calculate the safest, quietest, and most accessible ghat for your family.
        </p>
      </div>

      {/* Interactive Preferences Control */}
      <div className="glass-card p-6 border-amber-500/30 space-y-6">
        <h2 className="font-bold text-lg text-white">Customize Your Pilgrim Preferences</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Preferred Region / City</label>
            <select
              value={targetCity}
              onChange={(e) => setTargetCity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-400"
            >
              <option value="ALL">Any Region (Best Match)</option>
              <option value="Rajamahendravaram">Rajamahendravaram</option>
              <option value="Kovvur">Kovvur</option>
              <option value="Nearby">Nearby / Pattiseema</option>
            </select>
          </div>

          <div className="flex flex-col justify-center space-y-3">
            <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-slate-200 hover:text-white">
              <input
                type="checkbox"
                checked={preferWheelchair}
                onChange={(e) => setPreferWheelchair(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              ♿ Senior Citizen / Wheelchair Ramp Access Needed
            </label>
            <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-slate-200 hover:text-white">
              <input
                type="checkbox"
                checked={preferParking}
                onChange={(e) => setPreferParking(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              🚗 Dedicated Private & Bus Parking Needed
            </label>
          </div>

          <div className="bg-amber-950/30 p-4 rounded-xl border border-amber-500/20 text-xs text-amber-200/90 space-y-1">
            <span className="font-bold block text-amber-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Recommendation Formula
            </span>
            <p>Score = Crowd(40%) + Access(20%) + Facilities(15%) + Parking(15%) + Distance(10%)</p>
          </div>

        </div>
      </div>

      {/* Top Pick Showcase Card */}
      {topPick && (
        <div className="glass-card p-8 border-2 border-amber-500/60 shadow-2xl shadow-amber-500/10 relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-slate-950 font-black text-xs px-6 py-2 rounded-bl-2xl uppercase tracking-wider shadow-lg flex items-center gap-1.5">
            🥇 #1 Top Recommended Ghat
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center pt-4">
            
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black font-mono text-amber-400">{topPick.score}/100</span>
                <div>
                  <h2 className="font-heading font-black text-3xl text-white">{topPick.ghat.name}</h2>
                  <p className="text-xs text-slate-400">📍 {topPick.ghat.city} | Current Occupancy: <span className="text-emerald-400 font-bold">{topPick.crowdPct}%</span></p>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">{topPick.ghat.description}</p>

              {/* Explainable AI Reason Tags */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Why This Ghat Was Recommended For You:</h4>
                <div className="flex flex-wrap gap-2">
                  {topPick.reasons.map((r, idx) => (
                    <span key={idx} className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs px-3 py-1 rounded-lg font-medium">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card p-6 bg-slate-900/90 border-slate-700/80 space-y-4 text-center">
              <div className="text-xs text-slate-400">Available 30-min Slots Today</div>
              <div className="text-2xl font-mono font-bold text-white">07:00 – 07:30 AM</div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>General Ticket:</span>
                  <span className="font-bold text-white">₹{topPick.ghat.generalTicketPrice} / head</span>
                </div>
                <div className="flex justify-between text-purple-300">
                  <span>VIP Priority Ticket:</span>
                  <span className="font-bold text-purple-200">₹{topPick.ghat.vipTicketPrice} / head</span>
                </div>
              </div>

              <Link
                to={`/book?ghat=${topPick.ghat.id}`}
                className="w-full block gradient-saffron hover:opacity-90 text-slate-950 font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20"
              >
                Book {topPick.ghat.name}
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* Runners Up Recommendations Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-xl text-white">Alternative Excellent Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {runnersUp.map(({ ghat, score, crowdPct, reasons }) => (
            <div key={ghat.id} className="glass-card p-6 border-slate-700/50 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-lg text-white">{ghat.name}</h4>
                  <span className="font-mono font-bold text-amber-400 text-sm">{score}/100</span>
                </div>
                <p className="text-xs text-slate-400">📍 {ghat.city} • {crowdPct}% Crowd</p>
                <div className="space-y-1 pt-2">
                  {reasons.slice(0, 2).map((r, i) => (
                    <p key={i} className="text-[11px] text-slate-300 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" /> {r}
                    </p>
                  ))}
                </div>
              </div>

              <Link
                to={`/book?ghat=${ghat.id}`}
                className="w-full text-center bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs py-2.5 rounded-xl border border-slate-600/50 transition-all block"
              >
                Book {ghat.name}
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
