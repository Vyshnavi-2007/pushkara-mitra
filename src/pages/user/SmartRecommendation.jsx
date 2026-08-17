import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getSmartGhatRecommendations } from '../../services/recommendationEngine';
import { CrowdBadge } from '../../components/shared/CrowdBadge';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle,
  Car,
  Accessibility,
  Clock,
  Users,
  MapPin,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export function SmartRecommendation() {
  const { ghats, userLocation } = useApp();

  const [timeWindow, setTimeWindow] = useState('07:00 - 09:00');
  const [familySize, setFamilySize] = useState(4);
  const [needsWheelchair, setNeedsWheelchair] = useState(false);
  const [needsParking, setNeedsParking] = useState(true);

  const recommendations = getSmartGhatRecommendations(
    ghats,
    { needsWheelchair, needsParking, targetTime: timeWindow },
    userLocation
  );

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explainable Recommendation Algorithm</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Smart Ghat Recommendation Engine</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Tell us your travel preferences — we calculate live crowd risks, accessibility options, parking, and proximity to rank the ideal ghat for your family.
          </p>
        </div>

        {/* Wizard Form */}
        <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl max-w-4xl mx-auto space-y-6">
          <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-cyan-400" />
            Step 1: Specify Family & Travel Requirements
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time Window */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Preferred Bathing Time Window</label>
              <select
                value={timeWindow}
                onChange={(e) => setTimeWindow(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="05:00 - 07:00">Early Morning (05:00 AM - 07:00 AM)</option>
                <option value="07:00 - 09:00">Peak Morning (07:00 AM - 09:00 AM)</option>
                <option value="09:00 - 11:00">Late Morning (09:00 AM - 11:00 AM)</option>
                <option value="16:00 - 18:00">Evening Bath (04:00 PM - 06:00 PM)</option>
              </select>
            </div>

            {/* Family Members Count */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Number of Family Members</label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={familySize}
                  onChange={(e) => setFamilySize(parseInt(e.target.value, 10) || 1)}
                  className="w-24 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold text-center focus:outline-none"
                />
                <span className="text-xs text-slate-400">Pilgrims (Lead + Family)</span>
              </div>
            </div>
          </div>

          {/* Special Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
              <input
                type="checkbox"
                checked={needsWheelchair}
                onChange={(e) => setNeedsWheelchair(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500"
              />
              <span className="text-xs text-slate-300 flex items-center font-medium">
                <Accessibility className="w-4 h-4 mr-2 text-cyan-400" />
                Senior Citizen / Wheelchair Ramp Needed
              </span>
            </label>

            <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
              <input
                type="checkbox"
                checked={needsParking}
                onChange={(e) => setNeedsParking(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-amber-500"
              />
              <span className="text-xs text-slate-300 flex items-center font-medium">
                <Car className="w-4 h-4 mr-2 text-amber-400" />
                Vehicle Parking (Car / Bus) Needed
              </span>
            </label>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white">Ranked Recommendations</h2>
            <span className="text-xs text-slate-400">Showing top match first</span>
          </div>

          <div className="space-y-4">
            {recommendations.map((item, index) => {
              const { ghat, riskData, recommendationScore, reasons, isTopPick } = item;
              const occPct = Math.round((ghat.currentCrowd / ghat.physicalCapacity) * 100);

              return (
                <div
                  key={ghat.id}
                  className={`p-6 rounded-3xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                    isTopPick
                      ? 'bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 border-amber-500/50 shadow-2xl ring-2 ring-amber-500/30'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-start space-x-4 max-w-2xl">
                    {/* Rank Badge */}
                    <div className="shrink-0 flex flex-col items-center">
                      {isTopPick ? (
                        <span className="text-3xl">🥇</span>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-extrabold flex items-center justify-center text-sm">
                          #{index + 1}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {isTopPick && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 uppercase tracking-wide">
                            Top Recommendation
                          </span>
                        )}
                        <span className="text-xs font-bold text-cyan-400">{ghat.city}</span>
                        <CrowdBadge ghat={ghat} currentSlotOccupancy={occPct} />
                      </div>

                      <h3 className="text-xl font-extrabold text-white">{ghat.name}</h3>

                      {/* Explainability Reasons */}
                      <div className="space-y-1 pt-1">
                        {reasons.map((reason, idx) => (
                          <p key={idx} className="text-xs text-slate-300 flex items-center">
                            <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-400 shrink-0" />
                            {reason}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Score Gauge & CTA */}
                  <div className="shrink-0 w-full md:w-auto flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-slate-800 pt-4 md:pt-0 gap-3">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Match Score</span>
                      <p className="text-3xl font-black text-amber-400">{recommendationScore}<span className="text-sm font-normal text-slate-400">/100</span></p>
                    </div>

                    <Link
                      to={`/ghats/${ghat.id}`}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center space-x-1 shadow-lg hover:brightness-110 transition"
                    >
                      <span>Book Slot Here</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
