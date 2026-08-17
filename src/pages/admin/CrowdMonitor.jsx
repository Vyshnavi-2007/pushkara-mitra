import React from 'react';
import { useApp } from '../../context/AppContext';
import { CrowdBadge } from '../../components/shared/CrowdBadge';
import { calculateCrowdRisk } from '../../services/crowdRiskEngine';
import { Waves, AlertTriangle, ShieldCheck, Activity, MapPin } from 'lucide-react';

export function CrowdMonitor() {
  const { ghats, updateGhatConfig } = useApp();

  const sortedGhats = [...ghats].sort((a, b) => {
    const riskA = calculateCrowdRisk(a, 60, true).riskScore;
    const riskB = calculateCrowdRisk(b, 60, true).riskScore;
    return riskB - riskA;
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center">
              <Waves className="w-7 h-7 mr-2 text-amber-400" />
              Real-Time Crowd Risk & Occupancy Heatmap
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Monitors live crowd density, bottleneck entry/exit throughput, and dynamic risk levels across all Pushkaralu ghats.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedGhats.map((g) => {
            const occPct = Math.round((g.currentCrowd / g.physicalCapacity) * 100);
            const riskData = calculateCrowdRisk(g, occPct, true);

            return (
              <div key={g.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-extrabold text-lg text-white">{g.name}</h3>
                    <span className="text-xs text-cyan-400">{g.city}</span>
                  </div>
                  <CrowdBadge ghat={g} currentSlotOccupancy={occPct} />
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Occupancy:</span>
                    <span className="font-bold text-white">{g.currentCrowd.toLocaleString()} / {g.physicalCapacity.toLocaleString()}</span>
                  </div>
                  
                  {/* Occupancy Progress bar */}
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        occPct >= 80 ? 'bg-rose-600' : occPct >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occPct}%` }}
                    ></div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Crowd Risk Index:</span>
                      <strong className={riskData.textColor}>{riskData.riskScore} / 100</strong>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">{riskData.explanation}</p>
                  </div>
                </div>

                {/* Live Simulation Controls */}
                <div className="pt-2 flex justify-between items-center text-xs">
                  <button
                    onClick={() => updateGhatConfig(g.id, { currentCrowd: Math.max(0, g.currentCrowd - 2000) })}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
                  >
                    - Sim Crowd
                  </button>
                  <button
                    onClick={() => updateGhatConfig(g.id, { currentCrowd: g.currentCrowd + 2000 })}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 font-bold"
                  >
                    + Sim Crowd Surge
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
