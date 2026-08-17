import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Navigation, Filter, Check, ShieldAlert, Sparkles, MapPin } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';
import { calculateCrowdRisk } from '../../shared/utils/crowdRiskEngine';

const FALLBACK_IMG = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Godavari_river_at_Rajahmundry.jpg/800px-Godavari_river_at_Rajahmundry.jpg';

export const GhatDiscovery = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const { ghats } = useData();
  const [query, setQuery] = useState(initialSearch);
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedCrowd, setSelectedCrowd] = useState('ALL');
  const [wheelchairOnly, setWheelchairOnly] = useState(false);
  const [parkingOnly, setParkingOnly] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [geoLocating, setGeoLocating] = useState(false);

  // Geolocation trigger
  const handleNearMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoLocating(false);
      },
      (err) => {
        alert("Location access denied or unavailable. Showing all ghats.");
        setGeoLocating(false);
      }
    );
  };

  // Helper distance calculation (Haversine formula approximation)
  const calculateDistanceKm = (lat2, lon2) => {
    if (!userCoords) return null;
    const lat1 = userCoords.lat;
    const lon1 = userCoords.lng;
    const R = 6371; // Radius of earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  // Filter Ghats
  const filteredGhats = ghats.filter(ghat => {
    const risk = calculateCrowdRisk(ghat);
    const matchesQuery = ghat.name.toLowerCase().includes(query.toLowerCase()) || 
                         ghat.city.toLowerCase().includes(query.toLowerCase()) ||
                         ghat.description.toLowerCase().includes(query.toLowerCase());

    const matchesCity = selectedCity === 'ALL' || ghat.city === selectedCity;
    const matchesCrowd = selectedCrowd === 'ALL' || risk.level === selectedCrowd;
    const matchesWheelchair = !wheelchairOnly || ghat.facilities?.wheelchairAccessible;
    const matchesParking = !parkingOnly || ghat.facilities?.parking;

    return matchesQuery && matchesCity && matchesCrowd && matchesWheelchair && matchesParking;
  });

  // Sort by distance if user coords exist
  const sortedGhats = [...filteredGhats].sort((a, b) => {
    if (!userCoords) return 0;
    const distA = parseFloat(calculateDistanceKm(a.latitude, a.longitude) || 9999);
    const distB = parseFloat(calculateDistanceKm(b.latitude, b.longitude) || 9999);
    return distA - distB;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-cream">Explore Pushkaralu Ghats</h1>
          <p className="text-slate-400 text-sm">Select a ghat to view 30-minute slot availability, capacity limits, and crowd risk analysis.</p>
        </div>

        <button
          onClick={handleNearMe}
          disabled={geoLocating}
          className="gradient-river hover:opacity-90 text-white font-bold text-sm px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-river/20 transition-all shrink-0"
        >
          <Navigation className="w-4 h-4" />
          {geoLocating ? "Locating..." : userCoords ? "📍 Location Active (Sorted by Distance)" : "Find Ghats Near Me"}
        </button>
      </div>

      {/* Search & Filters Controls */}
      <div className="glass-card p-6 border-gold/15 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Text Search */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search ghat name or area..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-navy-deep border border-gold/20 rounded-xl pl-10 pr-4 py-3 text-sm text-cream placeholder-slate-400 outline-none focus:border-saffron"
            />
          </div>

          {/* City Filter */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-navy-deep border border-gold/20 rounded-xl px-4 py-3 text-sm text-cream outline-none focus:border-saffron"
            >
              <option value="ALL">All Cities & Regions</option>
              <option value="Rajamahendravaram">Rajamahendravaram</option>
              <option value="Kovvur">Kovvur</option>
              <option value="Nearby">Nearby Areas</option>
            </select>
          </div>

          {/* Crowd Risk Filter */}
          <div>
            <select
              value={selectedCrowd}
              onChange={(e) => setSelectedCrowd(e.target.value)}
              className="w-full bg-navy-deep border border-gold/20 rounded-xl px-4 py-3 text-sm text-cream outline-none focus:border-saffron"
            >
              <option value="ALL">All Crowd Levels</option>
              <option value="LOW">🟢 Low Crowd Risk</option>
              <option value="MODERATE">🟡 Moderate Crowd Risk</option>
              <option value="HIGH">🔴 High Crowd Risk</option>
              <option value="CRITICAL">⚠️ Critical Crowd Risk</option>
            </select>
          </div>

        </div>

        {/* Facility Checkbox Toggles */}
        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gold/15 text-xs font-semibold text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer hover:text-cream">
            <input
              type="checkbox"
              checked={wheelchairOnly}
              onChange={(e) => setWheelchairOnly(e.target.checked)}
              className="rounded text-saffron focus:ring-saffron"
            />
            ♿ Wheelchair & Ramp Accessible
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-cream">
            <input
              type="checkbox"
              checked={parkingOnly}
              onChange={(e) => setParkingOnly(e.target.checked)}
              className="rounded text-saffron focus:ring-saffron"
            />
            🚗 Dedicated Vehicle Parking
          </label>
        </div>
      </div>

      {/* Ghat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedGhats.map(ghat => {
          const risk = calculateCrowdRisk(ghat);
          const occPct = Math.round((ghat.currentCrowd / ghat.effectiveCapacity) * 100);
          const dist = calculateDistanceKm(ghat.latitude, ghat.longitude);

          return (
            <div key={ghat.id} className="glass-card glass-card-hover overflow-hidden flex flex-col justify-between">
              
              <div className="relative h-48 overflow-hidden">
                <img
                  src={ghat.image}
                  alt={ghat.name}
                  onError={(e) => { if (e.currentTarget.src !== FALLBACK_IMG) e.currentTarget.src = FALLBACK_IMG; }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${risk.badgeClass}`}>
                    {risk.statusText}
                  </span>
                </div>
                {dist && (
                  <div className="absolute top-3 left-3 bg-river text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {dist} km away
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-navy/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs text-cream border border-gold/15">
                  📍 {ghat.city}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-xl text-cream">{ghat.name}</h3>
                    <span className="text-[10px] uppercase font-bold text-saffron bg-saffron/10 px-2 py-0.5 rounded border border-saffron/20">
                      {ghat.famousLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{ghat.description}</p>
                </div>

                {/* Capacity & Quota Breakdown */}
                <div className="bg-navy-deep/60 p-3 rounded-xl space-y-2 border border-gold/15 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Physical Capacity (30m):</span>
                    <span className="font-mono font-bold text-cream">{ghat.physicalCapacity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Effective Capacity:</span>
                    <span className="font-mono font-bold text-emerald-400">{ghat.effectiveCapacity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>50% Online Slot Quota:</span>
                    <span className="font-mono font-bold text-river-light">{(ghat.effectiveCapacity * 0.5).toLocaleString()}</span>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Occupancy</span>
                      <span className="font-bold text-cream">{occPct}%</span>
                    </div>
                    <div className="progress-bar-bg h-2">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${occPct}%`, backgroundColor: risk.color }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Facilities Tags */}
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {ghat.facilities?.wheelchairAccessible && (
                    <span className="bg-river/10 text-river-light px-2 py-0.5 rounded border border-river/20">
                      ♿ Wheelchair
                    </span>
                  )}
                  {ghat.facilities?.parking && (
                    <span className="bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                      🚗 Parking
                    </span>
                  )}
                  {ghat.facilities?.medical && (
                    <span className="bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded border border-rose-500/20">
                      🏥 Medical
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-gold/15 flex items-center justify-between">
                  <Link
                    to={`/ghats/${ghat.id}`}
                    className="text-xs text-slate-300 hover:text-cream font-semibold underline"
                  >
                    View Slot Timetable
                  </Link>
                  <Link
                    to={`/book?ghat=${ghat.id}`}
                    className="gradient-river hover:opacity-90 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                  >
                    Book 30m Slot
                  </Link>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};