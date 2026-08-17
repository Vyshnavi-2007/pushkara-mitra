import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  CheckCircle,
  Eye,
  Megaphone,
  Heart,
  Lock,
  Phone,
  User,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function MissingPersonControl() {
  const { missingCases, updateMissingCaseStatus } = useApp();
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  const pendingVerificationCount = missingCases.filter(c => c.status === 'PENDING_VERIFICATION').length;
  const broadcastedCount = missingCases.filter(c => c.status === 'ALERT_BROADCASTED').length;
  const sightingCount = missingCases.filter(c => c.status === 'POSSIBLE_SIGHTING').length;
  const reunitedCount = missingCases.filter(c => c.status === 'REUNITED').length;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                Safety Control Room
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1 flex items-center">
              <ShieldAlert className="w-7 h-7 mr-2 text-rose-500" />
              Missing Person Control Center
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Verify pending missing person reports, broadcast zone alerts to field staff, match sightings, and coordinate family reunifications.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <div className="px-3 border-r border-slate-800">
              <span className="text-[10px] text-slate-400 block">Pending</span>
              <span className="font-extrabold text-base text-amber-400">{pendingVerificationCount}</span>
            </div>
            <div className="px-3 border-r border-slate-800">
              <span className="text-[10px] text-slate-400 block">Broadcasted</span>
              <span className="font-extrabold text-base text-rose-400">{broadcastedCount}</span>
            </div>
            <div className="px-3 border-r border-slate-800">
              <span className="text-[10px] text-slate-400 block">Sightings</span>
              <span className="font-extrabold text-base text-sky-400">{sightingCount}</span>
            </div>
            <div className="px-3">
              <span className="text-[10px] text-slate-400 block">Reunited</span>
              <span className="font-extrabold text-base text-emerald-400">{reunitedCount}</span>
            </div>
          </div>
        </div>

        {/* Case Table / Cards */}
        <div className="space-y-4">
          {missingCases.map((c) => {
            const isExpanded = selectedCaseId === c.caseId;

            return (
              <div
                key={c.caseId}
                className={`bg-slate-900 rounded-3xl border transition-all overflow-hidden ${
                  c.status === 'PENDING_VERIFICATION'
                    ? 'border-amber-500/50 shadow-amber-500/10'
                    : c.status === 'REUNITED'
                    ? 'border-emerald-500/40 bg-slate-900/60'
                    : 'border-slate-800'
                }`}
              >
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start space-x-4">
                    {c.photoUrl && (
                      <img
                        src={c.photoUrl}
                        alt={c.personName}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0"
                      />
                    )}

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/30">
                          {c.caseId}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          c.status === 'REUNITED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          c.status === 'ALERT_BROADCASTED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {c.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <h3 className="text-lg font-extrabold text-white">
                        {c.personName} ({c.age} yrs, {c.gender})
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                        <span>Last Seen Ghat: <strong>{c.lastSeenGhatName}</strong></span>
                        <span>Time: <strong>{c.lastSeenTime}</strong></span>
                        <span>Sightings Logged: <strong className="text-sky-300">{c.sightings ? c.sightings.length : 0}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {c.status === 'PENDING_VERIFICATION' && (
                      <button
                        onClick={() => updateMissingCaseStatus(c.caseId, 'VERIFIED')}
                        className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow hover:bg-amber-400"
                      >
                        Verify Report
                      </button>
                    )}

                    {(c.status === 'VERIFIED' || c.status === 'PENDING_VERIFICATION') && (
                      <button
                        onClick={() => updateMissingCaseStatus(c.caseId, 'ALERT_BROADCASTED')}
                        className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow hover:bg-rose-500 flex items-center space-x-1"
                      >
                        <Megaphone className="w-3.5 h-3.5" />
                        <span>Broadcast Alert</span>
                      </button>
                    )}

                    {c.status !== 'REUNITED' && c.status !== 'CLOSED' && (
                      <button
                        onClick={() => updateMissingCaseStatus(c.caseId, 'REUNITED')}
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow hover:bg-emerald-400 flex items-center space-x-1"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>Mark Reunited</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedCaseId(isExpanded ? null : c.caseId)}
                      className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Pane */}
                {isExpanded && (
                  <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Case Description */}
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                        <h4 className="font-bold text-white uppercase text-[11px] text-slate-400">Clothing & Physical Description</h4>
                        <p className="text-slate-300 leading-relaxed">{c.clothingDescription}</p>
                        {c.identifyingFeatures && (
                          <p className="text-slate-400 text-[11px]">Identifying Features: {c.identifyingFeatures}</p>
                        )}
                        <p className="text-slate-400 text-[11px]">Last Location Details: {c.lastKnownLocation}</p>
                      </div>

                      {/* Right: Confidential Reporter Contact (Admin Authorized) */}
                      <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-2">
                        <div className="flex items-center text-amber-400">
                          <Lock className="w-3.5 h-3.5 mr-1" />
                          <h4 className="font-bold text-white uppercase text-[11px]">Confidential Reporter Data (Admin Only)</h4>
                        </div>
                        <p className="text-white font-bold">{c.reporter ? c.reporter.fullName : 'Confidential'}</p>
                        <p className="text-slate-300">Phone: <strong className="text-cyan-300">{c.reporter ? c.reporter.phone : 'N/A'}</strong></p>
                        <p className="text-slate-300">Aadhaar: {c.reporter ? c.reporter.aadhaarNumber : 'N/A'}</p>
                        <p className="text-slate-300">Pass ID: {c.reporter ? c.reporter.bookingId || 'N/A' : 'N/A'}</p>
                      </div>
                    </div>

                    {/* Sightings Stream */}
                    {c.sightings && c.sightings.length > 0 && (
                      <div className="pt-2 border-t border-slate-800 space-y-2">
                        <h4 className="font-bold text-sky-400 uppercase text-[11px] flex items-center">
                          <Eye className="w-3.5 h-3.5 mr-1" /> Verified Sightings Stream ({c.sightings.length})
                        </h4>
                        <div className="space-y-2">
                          {c.sightings.map((s, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between text-xs">
                              <div>
                                <p className="font-bold text-white">{s.locationDetails}</p>
                                <p className="text-slate-400 mt-0.5">{s.description}</p>
                              </div>
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {new Date(s.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
