import React, { useState } from 'react';
import { Utensils, MapPin, Navigation, Heart, Phone, Clock, Search, Filter } from 'lucide-react';
import { INITIAL_FOOD_CENTERS } from '../../data/initialFoodCenters';

export const FoodNearMePage = () => {
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'FREE_ANNADANAM' | 'VEG_RESTAURANT'
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [userCoords, setUserCoords] = useState(null);
  const [locating, setLocating] = useState(false);

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      (err) => {
        alert("Location access denied or unavailable. Showing all food centers.");
        setLocating(false);
      }
    );
  };

  const calculateDistanceKm = (lat2, lon2) => {
    if (!userCoords) return null;
    const lat1 = userCoords.lat;
    const lon1 = userCoords.lng;
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const filteredCenters = INITIAL_FOOD_CENTERS.filter(fc => {
    const matchesType = filterType === 'ALL' || fc.type === filterType;
    const matchesCity = selectedCity === 'ALL' || fc.city === selectedCity;
    return matchesType && matchesCity;
  });

  const sortedCenters = [...filteredCenters].sort((a, b) => {
    if (!userCoords) return 0;
    const distA = parseFloat(calculateDistanceKm(a.latitude, a.longitude) || 9999);
    const distB = parseFloat(calculateDistanceKm(b.latitude, b.longitude) || 9999);
    return distA - distB;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
          <Utensils className="w-4 h-4 text-emerald-400" />
          Sector 3: Pilgrim Annadanam & Food Discovery
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white">Find Food & Free Annadanam Near Me</h1>
        <p className="text-slate-300 text-sm">
          Discover TTD & Government Free Annadanam Satrams, Mahaprasadam distribution points, and pure vegetarian restaurants near your ghat.
        </p>
      </div>

      {/* Geolocation & Filter Controls */}
      <div className="glass-card p-6 border-slate-700/50 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
            >
              <option value="ALL">All Food Options</option>
              <option value="FREE_ANNADANAM">💚 Free Annadanam & Prasadam Satrams</option>
              <option value="VEG_RESTAURANT">🍛 Pure Veg Tiffin & Restaurants</option>
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
            >
              <option value="ALL">All Cities (Rajamahendravaram & Kovvur)</option>
              <option value="Rajamahendravaram">Rajamahendravaram</option>
              <option value="Kovvur">Kovvur</option>
            </select>
          </div>

          <button
            onClick={handleNearMe}
            disabled={locating}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all shrink-0"
          >
            <Navigation className="w-4 h-4" />
            {locating ? "Locating Food..." : userCoords ? "📍 Sorted by Proximity" : "Find Food Near My Location"}
          </button>

        </div>
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCenters.map(center => {
          const dist = calculateDistanceKm(center.latitude, center.longitude);

          return (
            <div key={center.id} className="glass-card glass-card-hover overflow-hidden flex flex-col justify-between">
              
              <div className="relative h-44 overflow-hidden">
                <img src={center.image} alt={center.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    center.type === 'FREE_ANNADANAM' ? 'bg-emerald-500/90 text-slate-950 font-black' : 'bg-sky-500/90 text-white font-bold'
                  }`}>
                    {center.type === 'FREE_ANNADANAM' ? '💚 FREE ANNADANAM' : '🍛 VEG RESTAURANT'}
                  </span>
                </div>
                {dist && (
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs text-white border border-white/10 flex items-center gap-1 font-mono font-bold">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {dist} km away
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xl text-white mb-1">{center.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    📍 {center.location} ({center.city})
                  </p>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Menu / Prasadam:</span>
                    <span className="font-bold text-emerald-400">{center.menu}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Timings:</span>
                    <span className="font-mono text-slate-200">{center.operatingHours}</span>
                  </div>
                  {center.capacityPerHr && (
                    <div className="flex justify-between text-slate-300">
                      <span>Serving Capacity:</span>
                      <span className="font-mono text-white font-bold">{center.capacityPerHr.toLocaleString()} meals/hr</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href={`https://maps.google.com/?q=${center.latitude},${center.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-400 hover:underline font-bold flex items-center gap-1"
                  >
                    Get GPS Directions →
                  </a>
                  {center.contact && (
                    <span className="text-[11px] text-slate-400 font-mono">📞 {center.contact}</span>
                  )}
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
