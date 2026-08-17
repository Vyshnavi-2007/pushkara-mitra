import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CrowdBadge } from '../../components/shared/CrowdBadge';
import {
  Search,
  Filter,
  MapPin,
  Car,
  Accessibility,
  HeartPulse,
  Droplets,
  ArrowRight,
  Sparkles,
  Navigation
} from 'lucide-react';

export function GhatsDiscovery() {
  const { ghats, userLocation } = useApp();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [cityFilter, setCityFilter] = useState('ALL');
  const [crowdFilter, setCrowdFilter] = useState('ALL');
  const [wheelchairOnly, setWheelchairOnly] = useState(false);
  const [parkingOnly, setParkingOnly] = useState(false);
  const [sortBy, setSortBy] = useState('NAME'); // 'NAME' | 'CAPACITY' | 'CROWD'

  const filteredGhats = useMemo(() => {
    return ghats.filter((g) => {
      // Search term
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesName = g.name.toLowerCase().includes(q);
        const matchesCity = g.city.toLowerCase().includes(q);
        const matchesDist = g.district.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesDist) return false;
      }

      // City filter
      if (cityFilter !== 'ALL' && g.city !== cityFilter) return false;

      // Wheelchair
      if (wheelchairOnly && !g.wheelchairAccessible) return false;

      // Parking
      if (parkingOnly && !g.parkingAvailable) return false;

      // Crowd filter
      const occPct = (g.currentCrowd / g.physicalCapacity) * 100;
      if (crowdFilter === 'LOW' && occPct > 50) return false;
      if (crowdFilter === 'MEDIUM' && (occPct <= 50 || occPct > 80)) return false;
      if (crowdFilter === 'HIGH' && occPct <= 80) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'CAPACITY') return b.physicalCapacity - a.physicalCapacity;
      if (sortBy === 'CROWD') return a.currentCrowd - b.currentCrowd;
      return a.name.localeCompare(b.name);
    });
  }, [ghats, searchTerm, cityFilter, crowdFilter, wheelchairOnly, parkingOnly, sortBy]);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center">
              <MapPin className="w-7 h-7 mr-2 text-cyan-400" />
              Pushkaralu Bathing Ghats Discovery
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Explore available ghats, filter by amenities and crowd levels across Rajamahendravaram & Kovvur.
            </p>
          </div>
          <Link
            to="/recommend"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Smart Recommendation Wizard</span>
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search ghat name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* City Dropdown */}
            <div>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="ALL">All Cities & Zones</option>
                <option value="Rajamahendravaram">Rajamahendravaram</option>
                <option value="Kovvur">Kovvur</option>
                <option value="Nearby">Nearby Areas</option>
              </select>
            </div>

            {/* Crowd Level */}
            <div>
              <select
                value={crowdFilter}
                onChange={(e) => setCrowdFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="ALL">All Crowd Levels</option>
                <option value="LOW">🟢 Low Crowd (&lt;50%)</option>
                <option value="MEDIUM">🟡 Medium Crowd (50-80%)</option>
                <option value="HIGH">🔴 High Crowd (&gt;80%)</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="NAME">Sort by Name</option>
                <option value="CAPACITY">Sort by Capacity (High to Low)</option>
                <option value="CROWD">Sort by Lowest Crowd</option>
              </select>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800 text-xs text-slate-300">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={wheelchairOnly}
                onChange={(e) => setWheelchairOnly(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span className="flex items-center">
                <Accessibility className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                Wheelchair & Elder Accessible Only
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={parkingOnly}
                onChange={(e) => setParkingOnly(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span className="flex items-center">
                <Car className="w-3.5 h-3.5 mr-1 text-amber-400" />
                Dedicated Parking Available Only
              </span>
            </label>

            <span className="ml-auto text-slate-400 font-medium">
              Showing <strong>{filteredGhats.length}</strong> of {ghats.length} ghats
            </span>
          </div>
        </div>

        {/* Ghat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGhats.map((ghat) => {
            const occPct = Math.round((ghat.currentCrowd / ghat.physicalCapacity) * 100);
            return (
              <div
                key={ghat.id}
                className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={ghat.image}
                      alt={ghat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <CrowdBadge ghat={ghat} currentSlotOccupancy={occPct} />
                    </div>
                    <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg text-[11px] font-semibold text-cyan-300 border border-slate-700">
                      {ghat.city} • {ghat.district}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition">
                        {ghat.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {ghat.description}
                      </p>
                    </div>

                    {/* Facilities Badges */}
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      {ghat.parkingAvailable && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 flex items-center">
                          <Car className="w-3 h-3 mr-1" /> Parking
                        </span>
                      )}
                      {ghat.wheelchairAccessible && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 flex items-center">
                          <Accessibility className="w-3 h-3 mr-1" /> Wheelchair
                        </span>
                      )}
                      {ghat.medicalAvailable && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-rose-300 border border-slate-700 flex items-center">
                          <HeartPulse className="w-3 h-3 mr-1" /> Medical
                        </span>
                      )}
                      {ghat.drinkingWaterAvailable && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700 flex items-center">
                          <Droplets className="w-3 h-3 mr-1" /> RO Water
                        </span>
                      )}
                    </div>

                    {/* Capacity & Quota info */}
                    <div className="p-3 bg-slate-950 rounded-xl space-y-1.5 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Physical Capacity:</span>
                        <span className="font-bold text-white">{ghat.physicalCapacity.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Online Slot Quota (50%):</span>
                        <span className="font-bold text-cyan-400">
                          {Math.floor(ghat.physicalCapacity * (ghat.onlineQuotaPercentage / 100)).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">VIP Pass Fee:</span>
                        <span className="font-bold text-amber-400">₹{ghat.vipTicketPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/ghats/${ghat.id}`}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg hover:brightness-110 transition"
                  >
                    <span>View Slots & Book Pass</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
