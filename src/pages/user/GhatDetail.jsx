import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { dbService } from '../../services/dbService';
import { CrowdBadge } from '../../components/shared/CrowdBadge';
import {
  MapPin,
  Calendar,
  Clock,
  Car,
  Accessibility,
  HeartPulse,
  Droplets,
  ShieldCheck,
  Info,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Ticket
} from 'lucide-react';

export function GhatDetail() {
  const { id } = useParams();
  const { ghats } = useApp();
  const navigate = useNavigate();

  const ghat = ghats.find(g => g.id === id) || ghats[0];
  const [selectedDate, setSelectedDate] = useState('2027-08-15');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const slots = dbService.getSlots(ghat.id, selectedDate);

  // Capacity calculations
  const effectiveCapacity = Math.floor(Math.min(ghat.physicalCapacity, ghat.entryCapacity, ghat.exitCapacity) * ghat.safetyFactor);
  const maxOnlineQuota = Math.floor(effectiveCapacity * (ghat.onlineQuotaPercentage / 100));
  const vipQuota = Math.floor(maxOnlineQuota * (ghat.vipQuotaPercentage / 100));
  const generalQuota = maxOnlineQuota - vipQuota;

  const occPct = Math.round((ghat.currentCrowd / ghat.physicalCapacity) * 100);

  const handleProceedBooking = () => {
    if (!selectedSlot) return;
    navigate(`/book?ghatId=${ghat.id}&slotId=${selectedSlot.id}&date=${selectedDate}`);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Banner / Image & Title */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <div className="h-72 sm:h-96 relative">
            <img src={ghat.image} alt={ghat.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {ghat.city} • {ghat.district}
                  </span>
                  <CrowdBadge ghat={ghat} currentSlotOccupancy={occPct} />
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white">{ghat.name}</h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{ghat.description}</p>
              </div>

              <div className="bg-slate-900/90 backdrop-blur p-4 rounded-2xl border border-slate-700 space-y-1 shrink-0 text-center">
                <span className="text-[11px] text-slate-400 font-medium">50% Online Quota Allocation</span>
                <p className="text-2xl font-extrabold text-cyan-400">{maxOnlineQuota.toLocaleString()} passes</p>
                <p className="text-[10px] text-slate-400">Reserved to avoid offline queue conflicts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Principles Grid: Historical vs 2027 Prototype */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Col 1: Historical Baseline */}
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 text-amber-400 pb-2 border-b border-slate-800">
              <Info className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Historical Reference (2015)</h3>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">2015 Historical Capacity:</span>
                <span className="font-semibold text-white">{ghat.historicalCapacity2015.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">2015 Popularity Index:</span>
                <span className="font-semibold text-amber-300">{ghat.historicalPopularity} / 100</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                Baseline figures recorded during Pushkaralu 2015 used as reference anchors for operational capacity modeling.
              </p>
            </div>
          </div>

          {/* Col 2: Operational Bottleneck Breakdown */}
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 text-cyan-400 pb-2 border-b border-slate-800">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Operational Capacity Model</h3>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Physical Capacity:</span>
                <span className="font-semibold text-white">{ghat.physicalCapacity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Entry Throughput / 30m:</span>
                <span className="font-semibold text-white">{ghat.entryCapacity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Exit Throughput / 30m:</span>
                <span className="font-semibold text-white">{ghat.exitCapacity.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 mt-2 space-y-1">
                <div className="flex justify-between font-bold text-cyan-300">
                  <span>Effective Capacity:</span>
                  <span>{effectiveCapacity.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-slate-400">MIN(Physical, Entry, Exit) × {ghat.safetyFactor * 100}% Safety Buffer</p>
              </div>
            </div>
          </div>

          {/* Col 3: Facilities & Accessibility Matrix */}
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 text-emerald-400 pb-2 border-b border-slate-800">
              <CheckCircle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Facilities & Infrastructure</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <FacilityPill title="Parking" available={ghat.parkingAvailable} icon={<Car className="w-3.5 h-3.5 mr-1" />} />
              <FacilityPill title="Wheelchair" available={ghat.wheelchairAccessible} icon={<Accessibility className="w-3.5 h-3.5 mr-1" />} />
              <FacilityPill title="Medical Desk" available={ghat.medicalAvailable} icon={<HeartPulse className="w-3.5 h-3.5 mr-1" />} />
              <FacilityPill title="RO Water" available={ghat.drinkingWaterAvailable} icon={<Droplets className="w-3.5 h-3.5 mr-1" />} />
            </div>
            <div className="pt-2 text-xs text-slate-400">
              <p>Operating Hours: <strong className="text-white">{ghat.operatingHours}</strong></p>
              <p>VIP Pass Fee: <strong className="text-amber-400">₹{ghat.vipTicketPrice} per pilgrim</strong></p>
            </div>
          </div>
        </div>

        {/* 30-Minute Slot Selection Section */}
        <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-cyan-400" />
                Select 30-Minute Bathing Slot
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                50% online booking quota active for Pushkaralu peak day
              </p>
            </div>

            {/* Date Selector */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:outline-none"
              >
                <option value="2027-08-15">Aug 15, 2027 (Peak Day 1)</option>
                <option value="2027-08-16">Aug 16, 2027 (Day 2)</option>
                <option value="2027-08-17">Aug 17, 2027 (Day 3)</option>
              </select>
            </div>
          </div>

          {/* Slot Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {slots.map((slot) => {
              const isSelected = selectedSlot?.id === slot.id;
              const isFull = slot.status === 'FULL' || slot.remainingOnlineCapacity <= 0;

              return (
                <div
                  key={slot.id}
                  onClick={() => !isFull && setSelectedSlot(slot)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                    isFull
                      ? 'bg-slate-950/50 border-slate-800 opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-500 shadow-xl'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-white">{slot.startTime} - {slot.endTime}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isFull
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : slot.status === 'NEAR_CAPACITY'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {slot.status}
                    </span>
                  </div>

                  {/* Quota breakdown */}
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Online Quota:</span>
                      <span>{slot.maxOnlineQuota.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">General Avail:</span>
                      <span className="text-cyan-300 font-semibold">{Math.max(0, slot.generalQuota - slot.bookedGeneral).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">VIP Pass Avail:</span>
                      <span className="text-amber-300 font-semibold">{Math.max(0, slot.vipQuota - slot.bookedVIP).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Occupancy Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Occupancy</span>
                      <span>{slot.occupancyPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          slot.occupancyPercentage >= 80 ? 'bg-amber-500' : 'bg-cyan-400'
                        }`}
                        style={{ width: `${slot.occupancyPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              {selectedSlot ? (
                <p className="text-xs text-slate-300">
                  Selected Slot: <strong className="text-cyan-300 font-bold">{selectedSlot.startTime} - {selectedSlot.endTime}</strong> ({selectedDate})
                </p>
              ) : (
                <p className="text-xs text-slate-400">Please select an available 30-minute slot above to continue booking.</p>
              )}
            </div>

            <button
              onClick={handleProceedBooking}
              disabled={!selectedSlot}
              className={`px-8 py-3.5 rounded-2xl font-extrabold text-xs flex items-center space-x-2 shadow-xl transition ${
                selectedSlot
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Proceed to Family Pass Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function FacilityPill({ title, available, icon }) {
  return (
    <div
      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${
        available
          ? 'bg-slate-950 text-white border-slate-700'
          : 'bg-slate-950/40 text-slate-600 border-slate-800'
      }`}
    >
      <span className="flex items-center">
        {icon}
        {title}
      </span>
      <span>{available ? '✓' : '✕'}</span>
    </div>
  );
}
