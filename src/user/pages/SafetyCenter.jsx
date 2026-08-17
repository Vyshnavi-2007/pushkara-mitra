import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Search, Eye, PhoneCall, Lock, CheckCircle2, UserX, Camera } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';

export const SafetyCenter = () => {
  const { ghats, missingPersons, reportMissing, addSighting } = useData();

  const [activeTab, setActiveTab] = useState('REPORT'); // 'REPORT' | 'SIGHTING' | 'TRACK'

  // Report Missing Form State
  const [personName, setPersonName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [lastSeenGhatId, setLastSeenGhatId] = useState(ghats[0]?.id || 'pushkar-ghat');
  const [lastLocation, setLastLocation] = useState('');
  const [lastTime, setLastTime] = useState('');
  const [clothing, setClothing] = useState('');
  const [features, setFeatures] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reporterRelation, setReporterRelation] = useState('');
  const [photoPreview, setPhotoPreview] = useState(''); // uploaded photo as a small data URL

  const [submittedCaseId, setSubmittedCaseId] = useState(null);

  // Sighting Form State
  const [sightingCaseId, setSightingCaseId] = useState('');
  const [sightingLocation, setSightingLocation] = useState('');
  const [sightingTime, setSightingTime] = useState('');
  const [sightingDesc, setSightingDesc] = useState('');
  const [sightingReporter, setSightingReporter] = useState('');
  const [sightingSuccess, setSightingSuccess] = useState(false);

  // Tracker State
  const [searchCaseId, setSearchCaseId] = useState('');
  const [trackedCase, setTrackedCase] = useState(null);

  // Read a chosen image, shrink it to max 400px wide, and store as a compact JPEG data URL
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (jpg, png).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const maxW = 400;
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setPhotoPreview(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!personName || !age || !reporterPhone) {
      alert("Please fill in person name, age, and reporter contact phone.");
      return;
    }

    const ghatObj = ghats.find(g => g.id === lastSeenGhatId);
    const caseId = `MP-2027-${Math.floor(10000 + Math.random() * 90000)}`;

    const payload = {
      caseId,
      personName,
      age: parseInt(age),
      gender,
      lastSeenGhatId,
      lastSeenGhatName: ghatObj?.name || "Pushkar Ghat",
      lastKnownLocation: lastLocation || "Near Bathing Ghat Main Steps",
      lastSeenTime: lastTime || "08:00 AM",
      clothingDescription: clothing,
      identifyingFeatures: features,
      // Use the uploaded photo if the reporter added one, otherwise a neutral placeholder
      photoUrl: photoPreview || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      reporterName,
      reporterPhone,
      reporterRelation,
      status: "PENDING_VERIFICATION",
      priority: "HIGH",
      createdAt: new Date().toISOString(),
      sightings: []
    };

    reportMissing(payload);
    setSubmittedCaseId(caseId);
  };

  const handleSightingSubmit = (e) => {
    e.preventDefault();
    if (!sightingCaseId || !sightingLocation) {
      alert("Please enter Case ID and Sighting Location.");
      return;
    }
    addSighting(sightingCaseId.trim(), {
      sightingId: `SIGHT-${Math.floor(1000 + Math.random() * 9000)}`,
      reportedBy: sightingReporter || "Good Samaritan Pilgrim",
      location: sightingLocation,
      time: sightingTime || "Just Now",
      description: sightingDesc,
      status: "VERIFYING",
      createdAt: new Date().toISOString()
    });
    setSightingSuccess(true);
  };

  const handleTrackCase = (e) => {
    e.preventDefault();
    const found = missingPersons.find(c => c.caseId.toLowerCase() === searchCaseId.trim().toLowerCase());
    setTrackedCase(found || null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          Pilgrim Safety & Missing Assistance Hotline
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white">Safety & Assistance Center</h1>
        <p className="text-slate-300 text-sm">
          Report separated family members, log possible sightings, or track your verification case. Confidential & synchronized with on-ground control staff.
        </p>
      </div>

      {/* Privacy Notice Banner */}
      <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-2xl flex items-start gap-3 text-xs text-slate-300">
        <Lock className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block mb-0.5">Strict Privacy & Protection Rules</span>
          <span>Contact phone numbers and private details are hidden from the public. Only authorized Admin Command Staff and on-ground helpdesks receive verified alerts.</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('REPORT')}
          className={`flex-1 py-3 rounded-xl transition-all ${activeTab === 'REPORT' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:text-white'}`}
        >
          🚨 Report Missing Person
        </button>
        <button
          onClick={() => setActiveTab('SIGHTING')}
          className={`flex-1 py-3 rounded-xl transition-all ${activeTab === 'SIGHTING' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'}`}
        >
          👁️ Report Possible Sighting
        </button>
        <button
          onClick={() => setActiveTab('TRACK')}
          className={`flex-1 py-3 rounded-xl transition-all ${activeTab === 'TRACK' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:text-white'}`}
        >
          🔍 Live Case Tracker
        </button>
      </div>

      {/* TAB 1: REPORT MISSING PERSON */}
      {activeTab === 'REPORT' && (
        <div className="glass-card p-8 border-rose-500/30 space-y-6">
          {submittedCaseId ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-bold text-2xl text-white">Report Successfully Submitted!</h2>
              <p className="text-sm text-slate-300">Your unique Tracking Case ID is:</p>
              <div className="inline-block bg-slate-950 px-6 py-3 rounded-2xl border border-rose-500/40 font-mono font-black text-2xl text-rose-400">
                {submittedCaseId}
              </div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                An administrator is currently verifying your case. Once verified, an instant alert will be broadcasted to on-ground staff at {lastSeenGhatId}.
              </p>
              <button
                onClick={() => { setSubmittedCaseId(null); setActiveTab('TRACK'); setSearchCaseId(submittedCaseId); }}
                className="gradient-river text-white font-bold text-xs px-6 py-3 rounded-xl"
              >
                Track Case Status
              </button>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="space-y-6">
              <h2 className="font-bold text-xl text-white">Missing Person Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Missing Person Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Subba Rao"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-rose-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Age *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 68"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Gender *</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Child">Child</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Last Seen Ghat *</label>
                  <select
                    value={lastSeenGhatId}
                    onChange={(e) => setLastSeenGhatId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  >
                    {ghats.map(g => (
                      <option key={g.id} value={g.id}>{g.name} ({g.city})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Last Seen Approx Time & Place</label>
                  <input
                    type="text"
                    placeholder="e.g. 07:15 AM near Gate #3"
                    value={lastLocation}
                    onChange={(e) => setLastLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Clothing & Identifying Features</label>
                <textarea
                  rows={2}
                  placeholder="e.g. White Dhoti, Yellow Kanduva, wears reading glasses..."
                  value={clothing}
                  onChange={(e) => setClothing(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none"
                />
              </div>

              {/* Photo of the missing person */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Photo of Missing Person</label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-300 hover:border-rose-400 transition-colors">
                    <Camera className="w-4 h-4 text-rose-400" />
                    {photoPreview ? 'Change Photo' : 'Upload Photo'}
                    <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                  </label>
                  {photoPreview && (
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Missing person preview"
                        className="w-16 h-16 rounded-xl object-cover border border-rose-500/40"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoPreview('')}
                        className="absolute -top-2 -right-2 bg-slate-950 border border-slate-700 text-rose-400 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        title="Remove photo"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">A clear, recent photo helps on-ground staff identify them faster.</p>
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-4">
                <h3 className="font-bold text-sm text-white">Reporter / Family Contact Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Reporter Name"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98490 XXXXX"
                      value={reporterPhone}
                      onChange={(e) => setReporterPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Relationship</label>
                    <input
                      type="text"
                      placeholder="e.g. Son / Daughter"
                      value={reporterRelation}
                      onChange={(e) => setReporterRelation(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-base py-3.5 rounded-xl transition-all shadow-lg shadow-rose-500/20"
              >
                Submit Emergency Missing Report
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: REPORT SIGHTING */}
      {activeTab === 'SIGHTING' && (
        <div className="glass-card p-8 border-amber-500/30 space-y-6">
          <h2 className="font-bold text-xl text-white">Report a Possible Person Sighting</h2>
          <p className="text-xs text-slate-400">If you spotted a lost pilgrim matching a broadcasted alert, submit your sighting here.</p>

          {sightingSuccess ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-lg text-white">Sighting Logged & Sent to Control Room</h3>
              <p className="text-xs text-slate-400">Our on-ground staff at the target ghat will immediately verify the location.</p>
              <button onClick={() => setSightingSuccess(false)} className="text-xs text-sky-400 underline">Report Another Sighting</button>
            </div>
          ) : (
            <form onSubmit={handleSightingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Missing Case ID (e.g. MP-2027-10482) *</label>
                <input
                  type="text"
                  required
                  placeholder="MP-2027-XXXXX"
                  value={sightingCaseId}
                  onChange={(e) => setSightingCaseId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Exact Sighting Location & Landmark *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Near Medical Booth #2, Pushkar Ghat Gate 5"
                  value={sightingLocation}
                  onChange={(e) => setSightingLocation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Observations</label>
                <textarea
                  rows={2}
                  placeholder="Describe what the person was doing, who they were with..."
                  value={sightingDesc}
                  onChange={(e) => setSightingDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full gradient-saffron hover:opacity-90 text-slate-950 font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20"
              >
                Submit Sighting to Control Center
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 3: LIVE CASE TRACKER */}
      {activeTab === 'TRACK' && (
        <div className="glass-card p-8 border-sky-500/30 space-y-6">
          <h2 className="font-bold text-xl text-white">Track Safety Case Status</h2>

          <form onSubmit={handleTrackCase} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Case ID (e.g. MP-2027-10482)"
              value={searchCaseId}
              onChange={(e) => setSearchCaseId(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none"
            />
            <button type="submit" className="gradient-river text-white font-bold text-sm px-6 py-3 rounded-xl">
              Search
            </button>
          </form>

          {trackedCase && (
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  {trackedCase.photoUrl && (
                    <img
                      src={trackedCase.photoUrl}
                      alt={trackedCase.personName}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-700"
                    />
                  )}
                  <div>
                    <span className="font-mono font-bold text-sky-400 text-sm">{trackedCase.caseId}</span>
                    <h3 className="font-bold text-lg text-white">{trackedCase.personName} ({trackedCase.age} yrs, {trackedCase.gender})</h3>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  trackedCase.status === 'REUNITED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  STATUS: {trackedCase.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-slate-300">
                <div>Last Seen: <span className="font-bold text-white">{trackedCase.lastSeenGhatName}</span></div>
                <div>Last Time: <span className="font-bold text-white">{trackedCase.lastSeenTime}</span></div>
              </div>

              {trackedCase.sightings.length > 0 && (
                <div className="border-t border-slate-800 pt-3 space-y-2">
                  <span className="font-bold text-amber-300 block">Logged Sightings ({trackedCase.sightings.length}):</span>
                  {trackedCase.sightings.map((s, i) => (
                    <div key={i} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-0.5">
                      <div className="flex justify-between text-white font-bold">
                        <span>📍 {s.location}</span>
                        <span>{s.time}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{s.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};


/*import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Search, Eye, PhoneCall, Lock, CheckCircle2, UserX } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';

export const SafetyCenter = () => {
  const { ghats, missingPersons, reportMissing, addSighting } = useData();

  const [activeTab, setActiveTab] = useState('REPORT'); // 'REPORT' | 'SIGHTING' | 'TRACK'

  // Report Missing Form State
  const [personName, setPersonName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [lastSeenGhatId, setLastSeenGhatId] = useState(ghats[0]?.id || 'pushkar-ghat');
  const [lastLocation, setLastLocation] = useState('');
  const [lastTime, setLastTime] = useState('');
  const [clothing, setClothing] = useState('');
  const [features, setFeatures] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reporterRelation, setReporterRelation] = useState('');

  const [submittedCaseId, setSubmittedCaseId] = useState(null);

  // Sighting Form State
  const [sightingCaseId, setSightingCaseId] = useState('');
  const [sightingLocation, setSightingLocation] = useState('');
  const [sightingTime, setSightingTime] = useState('');
  const [sightingDesc, setSightingDesc] = useState('');
  const [sightingReporter, setSightingReporter] = useState('');
  const [sightingSuccess, setSightingSuccess] = useState(false);

  // Tracker State
  const [searchCaseId, setSearchCaseId] = useState('');
  const [trackedCase, setTrackedCase] = useState(null);

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!personName || !age || !reporterPhone) {
      alert("Please fill in person name, age, and reporter contact phone.");
      return;
    }

    const ghatObj = ghats.find(g => g.id === lastSeenGhatId);
    const caseId = `MP-2027-${Math.floor(10000 + Math.random() * 90000)}`;

    const payload = {
      caseId,
      personName,
      age: parseInt(age),
      gender,
      lastSeenGhatId,
      lastSeenGhatName: ghatObj?.name || "Pushkar Ghat",
      lastKnownLocation: lastLocation || "Near Bathing Ghat Main Steps",
      lastSeenTime: lastTime || "08:00 AM",
      clothingDescription: clothing,
      identifyingFeatures: features,
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      reporterName,
      reporterPhone,
      reporterRelation,
      status: "PENDING_VERIFICATION",
      priority: "HIGH",
      createdAt: new Date().toISOString(),
      sightings: []
    };

    reportMissing(payload);
    setSubmittedCaseId(caseId);
  };

  const handleSightingSubmit = (e) => {
    e.preventDefault();
    if (!sightingCaseId || !sightingLocation) {
      alert("Please enter Case ID and Sighting Location.");
      return;
    }
    addSighting(sightingCaseId.trim(), {
      sightingId: `SIGHT-${Math.floor(1000 + Math.random() * 9000)}`,
      reportedBy: sightingReporter || "Good Samaritan Pilgrim",
      location: sightingLocation,
      time: sightingTime || "Just Now",
      description: sightingDesc,
      status: "VERIFYING",
      createdAt: new Date().toISOString()
    });
    setSightingSuccess(true);
  };

  const handleTrackCase = (e) => {
    e.preventDefault();
    const found = missingPersons.find(c => c.caseId.toLowerCase() === searchCaseId.trim().toLowerCase());
    setTrackedCase(found || null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header *
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          Pilgrim Safety & Missing Assistance Hotline
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white">Safety & Assistance Center</h1>
        <p className="text-slate-300 text-sm">
          Report separated family members, log possible sightings, or track your verification case. Confidential & synchronized with on-ground control staff.
        </p>
      </div>

      {/* Privacy Notice Banner *
      <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-2xl flex items-start gap-3 text-xs text-slate-300">
        <Lock className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block mb-0.5">Strict Privacy & Protection Rules</span>
          <span>Contact phone numbers and private details are hidden from the public. Only authorized Admin Command Staff and on-ground helpdesks receive verified alerts.</span>
        </div>
      </div>

      {/* Tab Switcher *
      <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('REPORT')}
          className={`flex-1 py-3 rounded-xl transition-all ${activeTab === 'REPORT' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:text-white'}`}
        >
          🚨 Report Missing Person
        </button>
        <button
          onClick={() => setActiveTab('SIGHTING')}
          className={`flex-1 py-3 rounded-xl transition-all ${activeTab === 'SIGHTING' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'}`}
        >
          👁️ Report Possible Sighting
        </button>
        <button
          onClick={() => setActiveTab('TRACK')}
          className={`flex-1 py-3 rounded-xl transition-all ${activeTab === 'TRACK' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:text-white'}`}
        >
          🔍 Live Case Tracker
        </button>
      </div>

      {/* TAB 1: REPORT MISSING PERSON *
      {activeTab === 'REPORT' && (
        <div className="glass-card p-8 border-rose-500/30 space-y-6">
          {submittedCaseId ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-bold text-2xl text-white">Report Successfully Submitted!</h2>
              <p className="text-sm text-slate-300">Your unique Tracking Case ID is:</p>
              <div className="inline-block bg-slate-950 px-6 py-3 rounded-2xl border border-rose-500/40 font-mono font-black text-2xl text-rose-400">
                {submittedCaseId}
              </div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                An administrator is currently verifying your case. Once verified, an instant alert will be broadcasted to on-ground staff at {lastSeenGhatId}.
              </p>
              <button
                onClick={() => { setSubmittedCaseId(null); setActiveTab('TRACK'); setSearchCaseId(submittedCaseId); }}
                className="gradient-river text-white font-bold text-xs px-6 py-3 rounded-xl"
              >
                Track Case Status
              </button>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="space-y-6">
              <h2 className="font-bold text-xl text-white">Missing Person Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Missing Person Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Subba Rao"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-rose-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Age *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 68"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Gender *</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Child">Child</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Last Seen Ghat *</label>
                  <select
                    value={lastSeenGhatId}
                    onChange={(e) => setLastSeenGhatId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  >
                    {ghats.map(g => (
                      <option key={g.id} value={g.id}>{g.name} ({g.city})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Last Seen Approx Time & Place</label>
                  <input
                    type="text"
                    placeholder="e.g. 07:15 AM near Gate #3"
                    value={lastLocation}
                    onChange={(e) => setLastLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Clothing & Identifying Features</label>
                <textarea
                  rows={2}
                  placeholder="e.g. White Dhoti, Yellow Kanduva, wears reading glasses..."
                  value={clothing}
                  onChange={(e) => setClothing(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none"
                />
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-4">
                <h3 className="font-bold text-sm text-white">Reporter / Family Contact Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Reporter Name"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98490 XXXXX"
                      value={reporterPhone}
                      onChange={(e) => setReporterPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Relationship</label>
                    <input
                      type="text"
                      placeholder="e.g. Son / Daughter"
                      value={reporterRelation}
                      onChange={(e) => setReporterRelation(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-base py-3.5 rounded-xl transition-all shadow-lg shadow-rose-500/20"
              >
                Submit Emergency Missing Report
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: REPORT SIGHTING *
      {activeTab === 'SIGHTING' && (
        <div className="glass-card p-8 border-amber-500/30 space-y-6">
          <h2 className="font-bold text-xl text-white">Report a Possible Person Sighting</h2>
          <p className="text-xs text-slate-400">If you spotted a lost pilgrim matching a broadcasted alert, submit your sighting here.</p>

          {sightingSuccess ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-lg text-white">Sighting Logged & Sent to Control Room</h3>
              <p className="text-xs text-slate-400">Our on-ground staff at the target ghat will immediately verify the location.</p>
              <button onClick={() => setSightingSuccess(false)} className="text-xs text-sky-400 underline">Report Another Sighting</button>
            </div>
          ) : (
            <form onSubmit={handleSightingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Missing Case ID (e.g. MP-2027-10482) *</label>
                <input
                  type="text"
                  required
                  placeholder="MP-2027-XXXXX"
                  value={sightingCaseId}
                  onChange={(e) => setSightingCaseId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Exact Sighting Location & Landmark *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Near Medical Booth #2, Pushkar Ghat Gate 5"
                  value={sightingLocation}
                  onChange={(e) => setSightingLocation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Observations</label>
                <textarea
                  rows={2}
                  placeholder="Describe what the person was doing, who they were with..."
                  value={sightingDesc}
                  onChange={(e) => setSightingDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full gradient-saffron hover:opacity-90 text-slate-950 font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20"
              >
                Submit Sighting to Control Center
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 3: LIVE CASE TRACKER *
      {activeTab === 'TRACK' && (
        <div className="glass-card p-8 border-sky-500/30 space-y-6">
          <h2 className="font-bold text-xl text-white">Track Safety Case Status</h2>

          <form onSubmit={handleTrackCase} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Case ID (e.g. MP-2027-10482)"
              value={searchCaseId}
              onChange={(e) => setSearchCaseId(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none"
            />
            <button type="submit" className="gradient-river text-white font-bold text-sm px-6 py-3 rounded-xl">
              Search
            </button>
          </form>

          {trackedCase && (
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="font-mono font-bold text-sky-400 text-sm">{trackedCase.caseId}</span>
                  <h3 className="font-bold text-lg text-white">{trackedCase.personName} ({trackedCase.age} yrs, {trackedCase.gender})</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  trackedCase.status === 'REUNITED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  STATUS: {trackedCase.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-slate-300">
                <div>Last Seen: <span className="font-bold text-white">{trackedCase.lastSeenGhatName}</span></div>
                <div>Last Time: <span className="font-bold text-white">{trackedCase.lastSeenTime}</span></div>
              </div>

              {trackedCase.sightings.length > 0 && (
                <div className="border-t border-slate-800 pt-3 space-y-2">
                  <span className="font-bold text-amber-300 block">Logged Sightings ({trackedCase.sightings.length}):</span>
                  {trackedCase.sightings.map((s, i) => (
                    <div key={i} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-0.5">
                      <div className="flex justify-between text-white font-bold">
                        <span>📍 {s.location}</span>
                        <span>{s.time}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{s.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};*/
