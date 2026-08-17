import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dbService } from '../../services/dbService';
import {
  MapPin,
  Settings,
  Plus,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Car,
  Accessibility,
  HeartPulse,
  Droplets,
  ShieldCheck,
  X
} from 'lucide-react';

export function GhatManagement() {
  const { ghats, updateGhatConfig, refreshData } = useApp();
  const [editingGhat, setEditingGhat] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newGhatForm, setNewGhatForm] = useState({
    name: '',
    city: 'Rajamahendravaram',
    district: 'East Godavari',
    physicalCapacity: 30000,
    entryCapacity: 25000,
    exitCapacity: 24000,
    safetyFactor: 0.85,
    onlineQuotaPercentage: 50,
    vipQuotaPercentage: 20,
    generalTicketPrice: 0,
    vipTicketPrice: 200,
    parkingAvailable: true,
    medicalAvailable: true,
    toiletAvailable: true,
    drinkingWaterAvailable: true,
    wheelchairAccessible: true,
    operatingHours: '05:00 - 22:00',
    description: 'Newly registered Pushkaralu bathing ghat.'
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingGhat) return;

    updateGhatConfig(editingGhat.id, editingGhat);
    setEditingGhat(null);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    dbService.addGhat(newGhatForm);
    refreshData();
    setShowAddModal(false);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center">
              <Settings className="w-7 h-7 mr-2 text-cyan-400" />
              Ghat & Capacity Configuration Center
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Configure physical capacity limits, bottleneck entry/exit throughput, safety buffer factors, and 50% online slot quota rules.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Ghat</span>
          </button>
        </div>

        {/* Ghat Config List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ghats.map((g) => {
            const effCap = Math.floor(Math.min(g.physicalCapacity, g.entryCapacity, g.exitCapacity) * g.safetyFactor);
            const onlineCap = Math.floor(effCap * (g.onlineQuotaPercentage / 100));

            return (
              <div key={g.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition">
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-extrabold text-lg text-white">{g.name}</h3>
                    <span className="text-xs text-cyan-400">{g.city} • {g.district}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    g.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {g.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Physical Limit:</span>
                    <span className="font-bold text-white">{g.physicalCapacity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Entry Throughput / 30m:</span>
                    <span className="font-bold text-white">{g.entryCapacity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Exit Throughput / 30m:</span>
                    <span className="font-bold text-white">{g.exitCapacity.toLocaleString()}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex justify-between font-bold text-cyan-300">
                      <span>Effective Capacity:</span>
                      <span>{effCap.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-amber-400 font-semibold">
                      <span>50% Online Slot Quota:</span>
                      <span>{onlineCap.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-slate-400">VIP Fee: <strong className="text-amber-400">₹{g.vipTicketPrice}</strong></span>
                  <button
                    onClick={() => setEditingGhat({ ...g })}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-slate-700 flex items-center space-x-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Configure</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Modal */}
        {editingGhat && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-base text-white">Edit Ghat Configuration: {editingGhat.name}</h3>
                <button onClick={() => setEditingGhat(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Physical Capacity</label>
                    <input
                      type="number"
                      value={editingGhat.physicalCapacity}
                      onChange={(e) => setEditingGhat({ ...editingGhat, physicalCapacity: parseInt(e.target.value, 10) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Entry Throughput / 30m</label>
                    <input
                      type="number"
                      value={editingGhat.entryCapacity}
                      onChange={(e) => setEditingGhat({ ...editingGhat, entryCapacity: parseInt(e.target.value, 10) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Exit Throughput / 30m</label>
                    <input
                      type="number"
                      value={editingGhat.exitCapacity}
                      onChange={(e) => setEditingGhat({ ...editingGhat, exitCapacity: parseInt(e.target.value, 10) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Safety Buffer Factor (e.g. 0.85)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={editingGhat.safetyFactor}
                      onChange={(e) => setEditingGhat({ ...editingGhat, safetyFactor: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Online Quota Allocation %</label>
                    <input
                      type="number"
                      value={editingGhat.onlineQuotaPercentage}
                      onChange={(e) => setEditingGhat({ ...editingGhat, onlineQuotaPercentage: parseInt(e.target.value, 10) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">VIP Pass Price (₹)</label>
                    <input
                      type="number"
                      value={editingGhat.vipTicketPrice}
                      onChange={(e) => setEditingGhat({ ...editingGhat, vipTicketPrice: parseInt(e.target.value, 10) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingGhat(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
