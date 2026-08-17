import React, { useState } from 'react';
import { Settings, Save, Calculator, AlertCircle, Plus, Check } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';

export const GhatManager = () => {
  const { ghats, saveGhat } = useData();

  const [selectedGhatId, setSelectedGhatId] = useState(ghats[0]?.id || 'pushkar-ghat');
  const ghat = ghats.find(g => g.id === selectedGhatId) || ghats[0];

  const [physicalCap, setPhysicalCap] = useState(ghat?.physicalCapacity || 40000);
  const [entryCap, setEntryCap] = useState(ghat?.entryCapacity || 38000);
  const [exitCap, setExitCap] = useState(ghat?.exitCapacity || 35000);
  const [onlineQuotaPct, setOnlineQuotaPct] = useState(ghat?.onlineQuotaPercentage || 50);
  const [vipQuotaPct, setVipQuotaPct] = useState(ghat?.vipQuotaPercentage || 20);
  const [genPrice, setGenPrice] = useState(ghat?.generalTicketPrice || 0);
  const [vipPrice, setVipPrice] = useState(ghat?.vipTicketPrice || 250);

  // Dynamic Effective Capacity calculation = MIN(Physical, Entry, Exit)
  const derivedEffectiveCap = Math.min(physicalCap, entryCap, exitCap);
  const derivedOnlineQuota = Math.floor(derivedEffectiveCap * (onlineQuotaPct / 100));
  const derivedOfflineBuffer = derivedEffectiveCap - derivedOnlineQuota;
  const derivedVipQuota = Math.floor(derivedOnlineQuota * (vipQuotaPct / 100));
  const derivedGenQuota = derivedOnlineQuota - derivedVipQuota;

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSelectGhat = (gId) => {
    setSelectedGhatId(gId);
    const target = ghats.find(g => g.id === gId);
    if (target) {
      setPhysicalCap(target.physicalCapacity);
      setEntryCap(target.entryCapacity);
      setExitCap(target.exitCapacity);
      setOnlineQuotaPct(target.onlineQuotaPercentage || 50);
      setVipQuotaPct(target.vipQuotaPercentage || 20);
      setGenPrice(target.generalTicketPrice || 0);
      setVipPrice(target.vipTicketPrice || 250);
    }
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    const updated = {
      ...ghat,
      physicalCapacity: physicalCap,
      entryCapacity: entryCap,
      exitCapacity: exitCap,
      effectiveCapacity: derivedEffectiveCap,
      onlineQuotaPercentage: onlineQuotaPct,
      vipQuotaPercentage: vipQuotaPct,
      generalTicketPrice: genPrice,
      vipTicketPrice: vipPrice
    };
    saveGhat(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-900/40 pb-6">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">Ghat Capacity & Quota Configurator</h1>
          <p className="text-xs text-slate-400">Configure Physical vs Entry/Exit throughput and 50% online booking quota rules.</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-400" /> Capacity configuration saved successfully to active system state!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Ghat Selector Sidebar */}
        <div className="glass-card p-4 border-slate-800 space-y-2 bg-slate-900/90">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 p-2">Select Ghat</h3>
          {ghats.map(g => (
            <button
              key={g.id}
              onClick={() => handleSelectGhat(g.id)}
              className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                g.id === selectedGhatId ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{g.name}</span>
              <span className="text-[10px] font-mono text-slate-400">{g.effectiveCapacity.toLocaleString()}</span>
            </button>
          ))}
        </div>

        {/* Configuration Form & Live Calculation Engine */}
        <div className="glass-card p-8 border-slate-800 space-y-8 lg:col-span-2 bg-slate-900/90">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="font-bold text-xl text-white">Configuring: {ghat?.name}</h2>
            <span className="text-xs text-slate-400 font-mono">ID: {ghat?.id}</span>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-6">
            
            {/* Physical & Throughput Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                <Calculator className="w-4 h-4" /> 1. Capacity Limits (Per 30-Min Slot)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Physical Cap</label>
                  <input
                    type="number"
                    value={physicalCap}
                    onChange={(e) => setPhysicalCap(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Entry Throughput</label>
                  <input
                    type="number"
                    value={entryCap}
                    onChange={(e) => setEntryCap(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Exit Throughput</label>
                  <input
                    type="number"
                    value={exitCap}
                    onChange={(e) => setExitCap(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Effective Capacity Display */}
            <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-emerald-300">Derived Effective Bathing Capacity:</span>
                <span className="font-mono font-black text-emerald-400 text-xl">{derivedEffectiveCap.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-emerald-200/80">
                Automatically computed as MIN(Physical: {physicalCap.toLocaleString()}, Entry: {entryCap.toLocaleString()}, Exit: {exitCap.toLocaleString()}).
              </p>
            </div>

            {/* Quotas & Pricing Section */}
            <div className="space-y-4 border-t border-slate-800 pt-6">
              <h3 className="font-bold text-sm text-sky-300">2. Online Quota & Ticket Pricing Rules</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Online Allocation % (Default 50%)</label>
                  <input
                    type="number"
                    value={onlineQuotaPct}
                    onChange={(e) => setOnlineQuotaPct(parseInt(e.target.value) || 50)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">VIP Quota % of Online (Default 20%)</label>
                  <input
                    type="number"
                    value={vipQuotaPct}
                    onChange={(e) => setVipQuotaPct(parseInt(e.target.value) || 50)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">General Ticket Price (₹)</label>
                  <input
                    type="number"
                    value={genPrice}
                    onChange={(e) => setGenPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">VIP Priority Pass Price (₹)</label>
                  <input
                    type="number"
                    value={vipPrice}
                    onChange={(e) => setVipPrice(parseInt(e.target.value) || 50)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Quota Math Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs pt-2">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Online Quota ({onlineQuotaPct}%)</span>
                <span className="font-mono font-bold text-sky-400 text-base">{derivedOnlineQuota.toLocaleString()}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Offline Buffer</span>
                <span className="font-mono font-bold text-white text-base">{derivedOfflineBuffer.toLocaleString()}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">General Slots</span>
                <span className="font-mono font-bold text-white text-base">{derivedGenQuota.toLocaleString()}</span>
              </div>
              <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-500/30">
                <span className="text-purple-300 block text-[10px]">VIP Slots</span>
                <span className="font-mono font-bold text-purple-200 text-base">{derivedVipQuota.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full gradient-saffron text-slate-950 font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4 text-slate-950" /> Save Capacity Configuration
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};
