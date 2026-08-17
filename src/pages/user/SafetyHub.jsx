import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dbService } from '../../services/dbService';
import {
  ShieldAlert,
  Search,
  Eye,
  UserPlus,
  PhoneCall,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Lock,
  ArrowRight
} from 'lucide-react';

export function SafetyHub() {
  const { ghats, reportMissingPerson, submitSighting, missingCases } = useApp();
  const [activeTab, setActiveTab] = useState('REPORT_MISSING'); // 'REPORT_MISSING' | 'REPORT_SIGHTING' | 'TRACK'

  const [missingForm, setMissingForm] = useState({
    personName: '',
    age: '',
    gender: 'Male',
    relationship: 'Family Member',
    lastSeenGhatId: ghats[0] ? ghats[0].id : 'pushkar-ghat',
    lastSeenGhatName: ghats[0] ? ghats[0].name : 'Pushkar Ghat',
    lastKnownLocation: '',
    lastSeenTime: '07:30 AM',
    clothingDescription: '',
    identifyingFeatures: '',
    photoUrl: '',
    reporterName: '',
    reporterPhone: '',
    bookingId: '',
    reporterAadhaar: ''
  });

  const [sightingForm, setSightingForm] = useState({
    caseId: '',
    ghatId: ghats[0] ? ghats[0].id : 'pushkar-ghat',
    locationDetails: '',
    description: '',
    photoUrl: ''
  });

  const [trackCaseId, setTrackCaseId] = useState('');
  const [trackPhone, setTrackPhone] = useState('');
  const [trackedResult, setTrackedResult] = useState(null);
  const [trackError, setTrackError] = useState('');

  const [successCase, setSuccessCase] = useState(null);
  const [sightingSuccess, setSightingSuccess] = useState(false);

  const handleMissingSubmit = (e) => {
    e.preventDefault();
    const ghat = ghats.find(g => g.id === missingForm.lastSeenGhatId);
    const reportData = {
      ...missingForm,
      lastSeenGhatName: ghat ? ghat.name : missingForm.lastSeenGhatName
    };
    const created = reportMissingPerson(reportData);
    setSuccessCase(created);
  };

  const handleSightingSubmit = (e) => {
    e.preventDefault();
    const result = submitSighting(sightingForm.caseId, sightingForm);
    if (result) {
      setSightingSuccess(true);
      setSightingForm({ caseId: '', ghatId: ghats[0].id, locationDetails: '', description: '', photoUrl: '' });
    }
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    setTrackError('');
    setTrackedResult(null);

    const c = dbService.getMissingCaseById(trackCaseId.trim());
    if (c) {
      if (c.reporter && c.reporter.phone && c.reporter.phone.includes(trackPhone.trim())) {
        setTrackedResult(c);
      } else {
        // Basic match for demo
        setTrackedResult(c);
      }
    } else {
      setTrackError('No case found matching this Case ID. Please verify Case ID syntax (e.g. MP-2027-10482).');
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Missing Person & Pilgrim Safety Desk</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Emergency Pilgrim Safety Assistance</h1>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Report missing family members, submit verified sightings, and track case reunification status. All confidential phone data is restricted to authorized administrative staff.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center border-b border-slate-800 pb-4 space-x-2">
          <button
            onClick={() => { setActiveTab('REPORT_MISSING'); setSuccessCase(null); }}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'REPORT_MISSING'
                ? 'bg-rose-600 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Report Missing Person</span>
          </button>

          <button
            onClick={() => { setActiveTab('REPORT_SIGHTING'); setSightingSuccess(false); }}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'REPORT_SIGHTING'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Report Possible Sighting</span>
          </button>

          <button
            onClick={() => setActiveTab('TRACK')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'TRACK'
                ? 'bg-cyan-500 text-slate-950 shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Track My Case Status</span>
          </button>
        </div>

        {/* TAB 1: REPORT MISSING PERSON */}
        {activeTab === 'REPORT_MISSING' && (
          <div>
            {successCase ? (
              <div className="bg-slate-900 p-8 rounded-3xl border border-emerald-500/50 space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-white">Missing Report Logged</h3>
                  <p className="text-xs text-slate-300">
                    Case ID: <strong className="text-amber-400 font-mono text-base">{successCase.caseId}</strong>
                  </p>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Your report for <strong>{successCase.personName}</strong> has been routed to the Admin Control Center for verification and zone alert broadcast.
                  </p>
                </div>
                <div className="pt-4 flex justify-center space-x-3">
                  <button
                    onClick={() => { setActiveTab('TRACK'); setTrackCaseId(successCase.caseId); }}
                    className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                  >
                    Track Case Status
                  </button>
                  <button
                    onClick={() => setSuccessCase(null)}
                    className="px-6 py-3 rounded-xl bg-slate-800 text-white font-bold text-xs"
                  >
                    Submit Another Report
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleMissingSubmit} className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 text-rose-400">
                  <UserPlus className="w-5 h-5" />
                  <h3 className="font-extrabold text-base text-white">Missing Person Details</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Missing Person Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Subba Rao K"
                      value={missingForm.personName}
                      onChange={(e) => setMissingForm({ ...missingForm, personName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Age *</label>
                    <input
                      type="number"
                      required
                      placeholder="Age in years"
                      value={missingForm.age}
                      onChange={(e) => setMissingForm({ ...missingForm, age: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Gender *</label>
                    <select
                      value={missingForm.gender}
                      onChange={(e) => setMissingForm({ ...missingForm, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Relationship to Reporter</label>
                    <input
                      type="text"
                      placeholder="e.g. Father / Child / Spouse"
                      value={missingForm.relationship}
                      onChange={(e) => setMissingForm({ ...missingForm, relationship: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Last Seen Ghat *</label>
                    <select
                      value={missingForm.lastSeenGhatId}
                      onChange={(e) => setMissingForm({ ...missingForm, lastSeenGhatId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    >
                      {ghats.map(g => (
                        <option key={g.id} value={g.id}>{g.name} ({g.city})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Approximate Last Seen Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 07:30 AM"
                      value={missingForm.lastSeenTime}
                      onChange={(e) => setMissingForm({ ...missingForm, lastSeenTime: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-300 mb-1">Clothing & Appearance Description *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="e.g. White traditional dhoti, yellow towel, wearing reading glasses..."
                      value={missingForm.clothingDescription}
                      onChange={(e) => setMissingForm({ ...missingForm, clothingDescription: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                {/* Confidential Reporter Details */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-400">
                    <Lock className="w-4 h-4" />
                    <h4 className="font-bold text-xs uppercase tracking-wider text-white">Confidential Reporter Information</h4>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Required for identity verification during reunification. Protected under privacy security protocols.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Reporter Full Name *"
                        value={missingForm.reporterName}
                        onChange={(e) => setMissingForm({ ...missingForm, reporterName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="Reporter Mobile Phone *"
                        value={missingForm.reporterPhone}
                        onChange={(e) => setMissingForm({ ...missingForm, reporterPhone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Reporter Aadhaar Card Number"
                        value={missingForm.reporterAadhaar}
                        onChange={(e) => setMissingForm({ ...missingForm, reporterAadhaar: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Digital Booking Pass ID (Optional)"
                        value={missingForm.bookingId}
                        onChange={(e) => setMissingForm({ ...missingForm, bookingId: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-xl transition"
                >
                  Submit Missing Person Report & Request Alert Broadcast
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: REPORT SIGHTING */}
        {activeTab === 'REPORT_SIGHTING' && (
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center space-x-2 text-amber-400 border-b border-slate-800 pb-3">
              <Eye className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-white">Report Possible Sighting</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              If you spotted a lost pilgrim or child matching an alert broadcast, submit location details here. Reports are verified by staff prior to family reunification.
            </p>

            {sightingSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-700 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">Sighting Logged Successfully</h4>
                <p className="text-xs text-slate-300">
                  Thank you! Our control desk staff has been notified to verify the sighting location.
                </p>
                <button
                  onClick={() => setSightingSuccess(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold mt-2"
                >
                  Report Another Sighting
                </button>
              </div>
            ) : (
              <form onSubmit={handleSightingSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Missing Person Case ID (e.g. MP-2027-10482) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter MP Case ID..."
                    value={sightingForm.caseId}
                    onChange={(e) => setSightingForm({ ...sightingForm, caseId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Ghat / Zone Sighting Location *</label>
                  <select
                    value={sightingForm.ghatId}
                    onChange={(e) => setSightingForm({ ...sightingForm, ghatId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    {ghats.map(g => (
                      <option key={g.id} value={g.id}>{g.name} ({g.city})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Specific Location Details *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Resting near NGO drinking water tent behind Pillar 3"
                    value={sightingForm.locationDetails}
                    onChange={(e) => setSightingForm({ ...sightingForm, locationDetails: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Sighting Description *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe clothing, physical condition, and current status of person..."
                    value={sightingForm.description}
                    onChange={(e) => setSightingForm({ ...sightingForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-xl transition"
                >
                  Submit Sighting to Control Desk
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: TRACK CASE */}
        {activeTab === 'TRACK' && (
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center space-x-2 text-cyan-400 border-b border-slate-800 pb-3">
              <Search className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-white">Track Case Status</h3>
            </div>

            <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                placeholder="Enter Case ID (e.g. MP-2027-10482)..."
                value={trackCaseId}
                onChange={(e) => setTrackCaseId(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs shrink-0"
              >
                Track Case
              </button>
            </form>

            {trackError && <p className="text-xs text-rose-400 font-semibold">{trackError}</p>}

            {trackedResult && (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <span className="font-mono text-amber-400 font-bold">{trackedResult.caseId}</span>
                    <h4 className="text-base font-bold text-white">{trackedResult.personName} (Age {trackedResult.age})</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full font-extrabold text-[10px] bg-rose-950 text-rose-400 border border-rose-800 uppercase">
                    {trackedResult.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Last Seen Ghat</span>
                    <span className="font-bold text-white">{trackedResult.lastSeenGhatName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Last Seen Time</span>
                    <span className="font-bold text-white">{trackedResult.lastSeenTime}</span>
                  </div>
                </div>

                {trackedResult.sightings && trackedResult.sightings.length > 0 && (
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <span className="font-bold text-amber-400 flex items-center">
                      <Eye className="w-3.5 h-3.5 mr-1" /> Logged Sightings ({trackedResult.sightings.length})
                    </span>
                    {trackedResult.sightings.map((s, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <p className="font-semibold text-white">{s.locationDetails}</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">{s.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
