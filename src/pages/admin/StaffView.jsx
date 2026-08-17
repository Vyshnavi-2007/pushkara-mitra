import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Eye, MapPin, CheckCircle, Radio } from 'lucide-react';

export function StaffView() {
  const { ghats, missingCases, submitSighting } = useApp();
  const [selectedGhatId, setSelectedGhatId] = useState(ghats[0] ? ghats[0].id : 'pushkar-ghat');

  const [sightingForm, setSightingForm] = useState({
    caseId: '',
    locationDetails: '',
    description: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const activeAlerts = missingCases.filter(c => c.status === 'ALERT_BROADCASTED' || c.status === 'POSSIBLE_SIGHTING');
  const currentGhat = ghats.find(g => g.id === selectedGhatId) || ghats[0];

  const handleSightingSubmit = (e) => {
    e.preventDefault();
    submitSighting(sightingForm.caseId, {
      ...sightingForm,
      ghatId: selectedGhatId,
      reportedByStaff: true
    });
    setSubmitted(true);
    setSightingForm({ caseId: '', locationDetails: '', description: '' });
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header & Zone Selector */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
              Field Staff Terminal
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center">
              <Radio className="w-5 h-5 mr-2 text-cyan-400 animate-pulse" />
              Help Desk Operational Zone
            </h1>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Assigned Ghat Desk</label>
            <select
              value={selectedGhatId}
              onChange={(e) => setSelectedGhatId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold"
            >
              {ghats.map(g => (
                <option key={g.id} value={g.id}>{g.name} ({g.city})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Broadcast Zone Alerts */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-base text-white flex items-center border-b border-slate-800 pb-3">
            <ShieldAlert className="w-5 h-5 mr-2 text-rose-500" />
            Active Zone Broadcast Alerts ({activeAlerts.length})
          </h3>

          {activeAlerts.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No active missing person alerts broadcasted for this zone.</p>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map((c) => (
                <div key={c.caseId} className="p-4 rounded-2xl bg-slate-950 border border-rose-500/40 text-xs space-y-2">
                  <div className="flex justify-between font-bold text-white">
                    <span className="font-mono text-amber-400">{c.caseId}</span>
                    <span className="text-rose-400 uppercase text-[10px]">{c.status.replace(/_/g, ' ')}</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white">{c.personName} ({c.age} yrs, {c.gender})</h4>
                  <p className="text-slate-300">Last Seen: <strong>{c.lastSeenGhatName}</strong> ({c.lastSeenTime})</p>
                  <p className="text-slate-400 text-[11px]">Description: {c.clothingDescription}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Staff Quick Sighting Form */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-base text-white flex items-center border-b border-slate-800 pb-3">
            <Eye className="w-5 h-5 mr-2 text-amber-400" />
            Log Field Desk Sighting
          </h3>

          {submitted && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
              <span>Field sighting logged to Control Center successfully!</span>
              <button onClick={() => setSubmitted(false)} className="text-white font-bold underline">Log another</button>
            </div>
          )}

          <form onSubmit={handleSightingSubmit} className="space-y-3 text-xs">
            <div>
              <input
                type="text"
                required
                placeholder="Case ID (e.g. MP-2027-10482) *"
                value={sightingForm.caseId}
                onChange={(e) => setSightingForm({ ...sightingForm, caseId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>
            <div>
              <input
                type="text"
                required
                placeholder="Specific Location at Ghat (e.g. Help Desk 2 rest shade) *"
                value={sightingForm.locationDetails}
                onChange={(e) => setSightingForm({ ...sightingForm, locationDetails: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
            <div>
              <textarea
                required
                rows={2}
                placeholder="Staff field notes & physical status..."
                value={sightingForm.description}
                onChange={(e) => setSightingForm({ ...sightingForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs"
            >
              Submit Staff Sighting Update
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
