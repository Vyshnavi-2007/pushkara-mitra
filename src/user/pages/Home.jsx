import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, Navigation, Calendar, ShieldCheck, Users, AlertTriangle, ArrowRight, CheckCircle2, Ticket, Waves, Utensils, Flame, QrCode } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';
import { calculateCrowdRisk } from '../../shared/utils/crowdRiskEngine';

// Real Godavari river photo (Rajahmundry) from Wikimedia Commons, CC BY 4.0.
// Special:FilePath serves the file by name, so this link stays stable.
const GODAVARI_HERO_IMG = "https://commons.wikimedia.org/wiki/Special:FilePath/Godavari_river_at_Rajahmundry.jpg";

export const Home = () => {
  const navigate = useNavigate();
  const { ghats, announcements } = useData();
  const [searchQuery, setSearchQuery] = useState('');
 const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/ghats?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const topGhats = ghats.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">

      {/* Live Emergency Alert Banner */}
      {/* =====================================================
    LIVE ANNOUNCEMENT
   ===================================================== */}

{announcements.length > 0 && (
  <div className="bg-amber-500/10 border-y border-amber-500/20 py-3 px-4">

    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-3 min-w-0">

        {/* PHOTO */}
        {announcements[0].photo ? (
  <button
    type="button"
    onClick={() => setSelectedAnnouncement(announcements[0])}
    className="relative shrink-0 group focus:outline-none"
    title="Click to view photo"
  >
    <img
      src={announcements[0].photo}
      alt={announcements[0].personName || "Missing person"}
      className="
        w-14
        h-14
        rounded-lg
        object-cover
        border-2
        border-rose-500/60
        shadow-lg
        cursor-pointer
        transition-transform
        duration-200
        group-hover:scale-110
      "
    />

    <div className="
      absolute
      inset-0
      rounded-lg
      bg-black/0
      group-hover:bg-black/40
      flex
      items-center
      justify-center
      transition-all
    ">
      <span className="
        text-white
        text-[9px]
        font-bold
        opacity-0
        group-hover:opacity-100
      ">
        VIEW
      </span>
    </div>
  </button>
) : (
          <div className="w-12 h-12 rounded-lg bg-navy-deep border border-gold/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
        )}

        {/* ANNOUNCEMENT DETAILS */}
        <div className="min-w-0">

          <div className="flex items-center gap-2 mb-1">

            <span className="bg-rose-600 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase shrink-0">
              LIVE ANNOUNCEMENT 🚨
            </span>

            {announcements[0].caseId && (
              <span className="text-[10px] font-mono text-rose-300 hidden sm:inline">
                {announcements[0].caseId}
              </span>
            )}

          </div>

          {/* PERSON NAME */}
          {announcements[0].personName && (
            <p className="font-bold text-cream text-sm truncate">
              Missing Person: {announcements[0].personName}
              {announcements[0].age && (
                <span className="text-slate-400 font-normal ml-1">
                  ({announcements[0].age} yrs)
                </span>
              )}
            </p>
          )}

          {/* MESSAGE */}
          <p className="text-xs text-amber-300 truncate">
            {announcements[0].message || announcements[0].title}
          </p>

          {/* LAST SEEN */}
          {announcements[0].lastSeenGhatName && (
            <p className="text-[10px] text-slate-400 truncate mt-0.5">
              📍 Last seen: {announcements[0].lastSeenGhatName}
              {announcements[0].lastKnownLocation &&
                ` • ${announcements[0].lastKnownLocation}`
              }
            </p>
          )}

        </div>

      </div>

      {/* RIGHT SIDE */}
      <Link
        to="/safety"
        className="text-amber-400 hover:underline shrink-0 font-bold flex items-center gap-1 text-xs"
      >
        Safety Alerts
        <ArrowRight className="w-3 h-3" />
      </Link>

    </div>

  </div>
)}

      {/* Devotional Hero Section — Godavari river background */}
   <section className="relative overflow-hidden">

  {/* Bright Godavari river background */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: `url('${GODAVARI_HERO_IMG}')`,
      filter: "brightness(1.15) saturate(1.15)"
    }}
    aria-hidden="true"
  />

  {/* Light transparent overlay — keeps image bright */}
  <div
    className="absolute inset-0 bg-gradient-to-b
    from-[#073642]/35
    via-[#0B202A]/20
    to-[#073642]/50"
    aria-hidden="true"
  />

  {/* Soft golden sunlight glow */}
  <div
    className="absolute top-0 left-1/2 -translate-x-1/2
    w-full max-w-7xl h-96
    bg-gradient-to-b
    from-[#FFD76A]/25
    via-[#F4A63B]/10
    to-transparent
    blur-3xl rounded-full
    pointer-events-none"
    aria-hidden="true"
  />

  {/* Main Hero Content */}
  <div
    className="relative z-10 max-w-4xl mx-auto text-center
    space-y-8 pt-16 pb-20 px-4 sm:px-6 lg:px-8"
  >

    {/* Badge */}
    <div
      className="inline-flex items-center gap-2
      px-5 py-2 rounded-full
      bg-[#063B46]/75
      border border-[#FFD76A]/60
      backdrop-blur-md
      shadow-lg shadow-black/20"
    >
      <Waves className="w-4 h-4 text-[#65D6CF]" />

      <span
        className="text-[#FFE49A]
        text-xs sm:text-sm
        font-bold tracking-wide"
      >
        GODAVARI PUSHKARALU 2027 DIGITAL PILGRIM ECOSYSTEM
      </span>
    </div>

    {/* Heading */}
    <h1
      className="font-heading font-black
      text-4xl sm:text-6xl
      text-white
      tracking-tight
      leading-tight
      drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
    >
      Sacred Godavari Pushkaralu
      <br />

      <span
        className="text-[#6DE1D8]
        drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)]"
      >
        Pilgrim
      </span>

      <span
        className="text-[#FFD45C]
        drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)]"
      >
        {" "} & Safety Portal
      </span>
    </h1>

    {/* Description */}
    <p
      className="text-white
      text-base sm:text-lg
      max-w-2xl mx-auto
      leading-relaxed
      font-semibold
      drop-shadow-[0_3px_7px_rgba(0,0,0,0.95)]"
    >
      Choose your preferred bathing ghats, reserve 30-minute family bathing
      slots with guaranteed 50% online quotas, book Veda Pathashala Pujas,
      and find free Annadanam distribution centers.
    </p>

    {/* Quick Search */}
    <form
      onSubmit={handleSearchSubmit}
      className="max-w-2xl mx-auto relative group"
    >
      <div
        className="bg-[#06343E]/75
        backdrop-blur-lg
        p-2
        flex items-center gap-2
        border border-[#FFE08A]/60
        rounded-2xl
        shadow-2xl
        focus-within:border-[#FFD45C]
        focus-within:shadow-[0_0_30px_rgba(255,210,80,0.2)]
        transition-all"
      >

        <Search
          className="w-6 h-6 text-[#D5F3EF] ml-3"
        />

        <input
          type="text"
          placeholder="Search by ghat, temple, puja, or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent
          border-none outline-none
          text-white
          placeholder:text-[#D5E7E8]
          text-sm py-3 px-2"
        />

        <button
          type="submit"
          className="bg-gradient-to-r
          from-[#159E98]
          to-[#087477]
          hover:from-[#1AB5AD]
          hover:to-[#098A8D]
          text-white
          font-bold text-sm
          px-6 py-3
          rounded-xl
          transition-all
          shadow-md
          shrink-0"
        >
          Search
        </button>

      </div>
    </form>

  </div>

  {/* Image credit */}
  <a
    href="https://commons.wikimedia.org/wiki/File:Godavari_river_at_Rajahmundry.jpg"
    target="_blank"
    rel="noopener noreferrer"
    className="absolute bottom-2 right-3 z-10
    text-[10px]
    text-white/60
    hover:text-white"
  >
    
  </a>

</section>

      {/* THREE MAIN SECTORS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-heading font-bold text-3xl text-cream">Three Main Pilgrim Services</h2>
          <p className="text-sm text-slate-400">Everything you need for a seamless and divine Pushkaralu pilgrimage</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* SECTOR 1: Bathing Slot Booking */}
          <div className="glass-card p-8 border-2 border-river/40 hover:border-river-light transition-all space-y-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-river/20 border border-river/30 text-river-light flex items-center justify-center">
                <Ticket className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-river-light bg-river/10 px-2 py-0.5 rounded border border-river/20">
                  SECTOR 1
                </span>
                <h3 className="font-heading font-bold text-2xl text-cream">Pushkaralu Bathing Slots</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reserve 30-minute family bathing slots across 15+ ghats. Guaranteed 50% online slot quota with General & VIP priority passes.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-gold/15">
              <Link
                to="/ghats"
                className="w-full block text-center gradient-river hover:opacity-90 text-white font-bold text-sm py-3 rounded-xl shadow-md"
              >
                Book Bathing Slot
              </Link>
              <Link to="/recommendation" className="block text-center text-xs text-river-light font-semibold hover:underline">
                ✨ Smart Recommend Quiet Ghat
              </Link>
            </div>
          </div>

          {/* SECTOR 2: Devotional Pujas & Rituals */}
          <div className="glass-card p-8 border-2 border-saffron/40 hover:border-saffron transition-all space-y-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-saffron/20 border border-saffron/30 text-saffron flex items-center justify-center">
                <Flame className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-saffron bg-saffron/10 px-2 py-0.5 rounded border border-saffron/20">
                  SECTOR 2
                </span>
                <h3 className="font-heading font-bold text-2xl text-cream">Devotional Pujas & Harati</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Book Godavari Maha Harati passes, Pinda Pradanam ancestral rites, and Chandi Homam with family Sankalpam.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-gold/15">
              <Link
                to="/pujas"
                className="w-full block text-center gradient-saffron hover:opacity-90 text-slate-950 font-bold text-sm py-3 rounded-xl shadow-md"
              >
                Book Devotional Pujas
              </Link>
              <span className="block text-center text-xs text-saffron-light font-medium">
                Veda Pandit Chanting Included
              </span>
            </div>
          </div>

          {/* SECTOR 3: Food Near Me & Annadanam */}
          <div className="glass-card p-8 border-2 border-emerald-500/40 hover:border-emerald-400 transition-all space-y-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Utensils className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  SECTOR 3
                </span>
                <h3 className="font-heading font-bold text-2xl text-cream">Find Food Near Me</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Locate TTD & Government Free Annadanam Satrams, Mahaprasadam counters, and pure veg restaurants with live location GPS.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-gold/15">
              <Link
                to="/food"
                className="w-full block text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 rounded-xl shadow-md"
              >
                Find Food & Annadanam
              </Link>
              <span className="block text-center text-xs text-emerald-400 font-medium">
                📍 Live GPS Proximity Sorting
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Ghats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-cream">Popular Pushkaralu Ghats</h2>
            <p className="text-sm text-slate-400">Real-time crowd visibility & 30-minute slot availability</p>
          </div>
          <Link to="/ghats" className="text-saffron hover:text-saffron-light font-semibold text-sm flex items-center gap-1.5">
            View All 7 Ghats <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topGhats.map(ghat => {
            const risk = calculateCrowdRisk(ghat);
            const occPct = Math.round((ghat.currentCrowd / ghat.effectiveCapacity) * 100);

            return (
              <div key={ghat.id} className="glass-card glass-card-hover overflow-hidden flex flex-col justify-between">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={ghat.image}
                    alt={ghat.name}
                    onError={(e) => { if (e.currentTarget.src !== GODAVARI_HERO_IMG) e.currentTarget.src = GODAVARI_HERO_IMG; }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${risk.badgeClass}`}>
                      {risk.statusText}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-navy/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs text-cream border border-gold/15">
                    📍 {ghat.city}
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-cream mb-1">{ghat.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{ghat.description}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Effective Cap (30 min):</span>
                      <span className="font-mono font-bold text-cream">{ghat.effectiveCapacity.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>50% Online Quota:</span>
                      <span className="font-mono font-bold text-river-light">{(ghat.effectiveCapacity * 0.5).toLocaleString()}</span>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Current Occupancy</span>
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

                  <div className="pt-2 border-t border-gold/10 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-400">
                      General ₹{ghat.generalTicketPrice} | <span className="text-purple-400 font-bold">VIP ₹{ghat.vipTicketPrice}</span>
                    </div>
                    <Link
                      to={`/book?ghat=${ghat.id}`}
                      className="gradient-river hover:opacity-90 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-all"
                    >
                      Book Slot
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>
      {/* =====================================================
    LARGE MISSING PERSON PHOTO MODAL
===================================================== */}

{selectedAnnouncement && (
  <div
    className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
    onClick={() => setSelectedAnnouncement(null)}
  >
    <div
      className="relative w-full max-w-4xl max-h-[95vh] flex flex-col items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >

      {/* CLOSE BUTTON */}
      <button
        type="button"
        onClick={() => setSelectedAnnouncement(null)}
        className="
          absolute
          top-3
          right-3
          z-20
          w-11
          h-11
          rounded-full
          bg-rose-600
          hover:bg-rose-500
          text-white
          flex
          items-center
          justify-center
          shadow-xl
          text-xl
          font-bold
        "
      >
        ×
      </button>

      {/* PHOTO */}
      {selectedAnnouncement.photo && (
        <img
          src={selectedAnnouncement.photo}
          alt={selectedAnnouncement.personName || "Missing Person"}
          className="
            max-w-full
            max-h-[75vh]
            object-contain
            rounded-2xl
            border
            border-gold/20
            shadow-2xl
          "
        />
      )}

      {/* PERSON DETAILS */}
      <div
        className="
          mt-4
          w-full
          max-w-2xl
          bg-navy-deep
          border
          border-gold/20
          rounded-2xl
          p-5
          text-center
        "
      >

        <div className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-2">
          🚨 MISSING PERSON ALERT
        </div>

        <h2 className="text-2xl font-black text-cream">
          {selectedAnnouncement.personName || "Unknown Person"}
        </h2>

        {selectedAnnouncement.age && (
          <p className="text-slate-300 text-sm mt-1">
            Age: {selectedAnnouncement.age}
            {selectedAnnouncement.gender &&
              ` • ${selectedAnnouncement.gender}`}
          </p>
        )}

        {selectedAnnouncement.caseId && (
          <p className="text-rose-300 font-mono text-xs mt-2">
            Case ID: {selectedAnnouncement.caseId}
          </p>
        )}

        {selectedAnnouncement.lastSeenGhatName && (
          <p className="text-slate-300 text-sm mt-3">
            📍 Last seen at{" "}
            <span className="text-rose-400 font-bold">
              {selectedAnnouncement.lastSeenGhatName}
            </span>
          </p>
        )}

        {selectedAnnouncement.lastKnownLocation && (
          <p className="text-slate-400 text-xs mt-1">
            {selectedAnnouncement.lastKnownLocation}
          </p>
        )}

        {selectedAnnouncement.lastSeenTime && (
          <p className="text-slate-400 text-xs mt-1">
            🕐 {selectedAnnouncement.lastSeenTime}
          </p>
        )}

        {selectedAnnouncement.reporterPhone && (
          <p className="text-saffron text-sm font-bold mt-3">
            📞 Contact: {selectedAnnouncement.reporterPhone}
          </p>
        )}

      </div>

    </div>
  </div>
)}
    </div>
  );
};

/*import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, Navigation, Calendar, ShieldCheck, Users, AlertTriangle, ArrowRight, CheckCircle2, Ticket, Waves, Utensils, Flame, QrCode } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';
import { calculateCrowdRisk } from '../../shared/utils/crowdRiskEngine';

export const Home = () => {
  const navigate = useNavigate();
  const { ghats, announcements } = useData();
  const [searchQuery, setSearchQuery] = useState('');
 const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/ghats?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const topGhats = ghats.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">

      {/* Live Emergency Alert Banner *
      {/* =====================================================
    LIVE ANNOUNCEMENT
   ===================================================== *

{announcements.length > 0 && (
  <div className="bg-amber-500/10 border-y border-amber-500/20 py-3 px-4">

    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

      {/* LEFT SIDE *
      <div className="flex items-center gap-3 min-w-0">

        {/* PHOTO *
        {announcements[0].photo ? (
  <button
    type="button"
    onClick={() => setSelectedAnnouncement(announcements[0])}
    className="relative shrink-0 group focus:outline-none"
    title="Click to view photo"
  >
    <img
      src={announcements[0].photo}
      alt={announcements[0].personName || "Missing person"}
      className="
        w-14
        h-14
        rounded-lg
        object-cover
        border-2
        border-rose-500/60
        shadow-lg
        cursor-pointer
        transition-transform
        duration-200
        group-hover:scale-110
      "
    />

    <div className="
      absolute
      inset-0
      rounded-lg
      bg-black/0
      group-hover:bg-black/40
      flex
      items-center
      justify-center
      transition-all
    ">
      <span className="
        text-white
        text-[9px]
        font-bold
        opacity-0
        group-hover:opacity-100
      ">
        VIEW
      </span>
    </div>
  </button>
) : (
          <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
        )}

        {/* ANNOUNCEMENT DETAILS *
        <div className="min-w-0">

          <div className="flex items-center gap-2 mb-1">

            <span className="bg-rose-600 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase shrink-0">
              LIVE ANNOUNCEMENT 🚨
            </span>

            {announcements[0].caseId && (
              <span className="text-[10px] font-mono text-rose-300 hidden sm:inline">
                {announcements[0].caseId}
              </span>
            )}

          </div>

          {/* PERSON NAME *
          {announcements[0].personName && (
            <p className="font-bold text-white text-sm truncate">
              Missing Person: {announcements[0].personName}
              {announcements[0].age && (
                <span className="text-slate-400 font-normal ml-1">
                  ({announcements[0].age} yrs)
                </span>
              )}
            </p>
          )}

          {/* MESSAGE *
          <p className="text-xs text-amber-300 truncate">
            {announcements[0].message || announcements[0].title}
          </p>

          {/* LAST SEEN *
          {announcements[0].lastSeenGhatName && (
            <p className="text-[10px] text-slate-400 truncate mt-0.5">
              📍 Last seen: {announcements[0].lastSeenGhatName}
              {announcements[0].lastKnownLocation &&
                ` • ${announcements[0].lastKnownLocation}`
              }
            </p>
          )}

        </div>

      </div>

      {/* RIGHT SIDE *
      <Link
        to="/safety"
        className="text-amber-400 hover:underline shrink-0 font-bold flex items-center gap-1 text-xs"
      >
        Safety Alerts
        <ArrowRight className="w-3 h-3" />
      </Link>

    </div>

  </div>
)}

      {/* Devotional Hero Section *
      <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-sky-500/10 via-amber-600/10 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-sky-500/20 border border-amber-500/30 backdrop-blur-md">
            <Waves className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
              Godavari Pushkaralu 2027 Digital Pilgrim Ecosystem
            </span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight leading-tight">
            Sacred Godavari Pushkaralu <br />
            <span className="gradient-text">Pilgrim & Safety Portal</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Choose your preferred bathing ghats, reserve 30-minute family bathing slots with guaranteed 50% online quotas, book Veda Pathashala Pujas, and find free Annadanam distribution centers.
          </p>

          {/* Quick Search *
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative group">
            <div className="glass-card p-2 flex items-center gap-2 border border-sky-500/30 rounded-2xl shadow-2xl focus-within:border-sky-400 transition-all">
              <Search className="w-6 h-6 text-slate-400 ml-3" />
              <input
                type="text"
                placeholder="Search by ghat, temple, puja, or city (Rajamahendravaram, Kovvur)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-white placeholder-slate-400 text-sm py-3 px-2"
              />
              <button
                type="submit"
                className="gradient-river hover:opacity-90 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-md shrink-0"
              >
                Search
              </button>
            </div>
          </form>

        </div>
      </section>

      {/* THREE MAIN SECTORS SHOWCASE *
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-heading font-bold text-3xl text-white">Three Main Pilgrim Services</h2>
          <p className="text-sm text-slate-400">Everything you need for a seamless and divine Pushkaralu pilgrimage</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* SECTOR 1: Bathing Slot Booking *
          <div className="glass-card p-8 border-2 border-sky-500/40 hover:border-sky-400 transition-all space-y-6 flex flex-col justify-between bg-slate-900/90 shadow-xl">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center">
                <Ticket className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  SECTOR 1
                </span>
                <h3 className="font-heading font-bold text-2xl text-white">Pushkaralu Bathing Slots</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reserve 30-minute family bathing slots across 15+ ghats. Guaranteed 50% online slot quota with General & VIP priority passes.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <Link
                to="/ghats"
                className="w-full block text-center gradient-river hover:opacity-90 text-white font-bold text-sm py-3 rounded-xl shadow-md"
              >
                Book Bathing Slot
              </Link>
              <Link to="/recommendation" className="block text-center text-xs text-sky-400 font-semibold hover:underline">
                ✨ Smart Recommend Quiet Ghat
              </Link>
            </div>
          </div>

          {/* SECTOR 2: Devotional Pujas & Rituals *
          <div className="glass-card p-8 border-2 border-amber-500/40 hover:border-amber-400 transition-all space-y-6 flex flex-col justify-between bg-slate-900/90 shadow-xl">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Flame className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  SECTOR 2
                </span>
                <h3 className="font-heading font-bold text-2xl text-white">Devotional Pujas & Harati</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Book Godavari Maha Harati passes, Pinda Pradanam ancestral rites, and Chandi Homam with family Sankalpam.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <Link
                to="/pujas"
                className="w-full block text-center gradient-saffron hover:opacity-90 text-slate-950 font-bold text-sm py-3 rounded-xl shadow-md"
              >
                Book Devotional Pujas
              </Link>
              <span className="block text-center text-xs text-amber-300 font-medium">
                Veda Pandit Chanting Included
              </span>
            </div>
          </div>

          {/* SECTOR 3: Food Near Me & Annadanam *
          <div className="glass-card p-8 border-2 border-emerald-500/40 hover:border-emerald-400 transition-all space-y-6 flex flex-col justify-between bg-slate-900/90 shadow-xl">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Utensils className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  SECTOR 3
                </span>
                <h3 className="font-heading font-bold text-2xl text-white">Find Food Near Me</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Locate TTD & Government Free Annadanam Satrams, Mahaprasadam counters, and pure veg restaurants with live location GPS.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <Link
                to="/food"
                className="w-full block text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 rounded-xl shadow-md"
              >
                Find Food & Annadanam
              </Link>
              <span className="block text-center text-xs text-emerald-400 font-medium">
                📍 Live GPS Proximity Sorting
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Ghats Section *
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">Popular Pushkaralu Ghats</h2>
            <p className="text-sm text-slate-400">Real-time crowd visibility & 30-minute slot availability</p>
          </div>
          <Link to="/ghats" className="text-sky-400 hover:text-sky-300 font-semibold text-sm flex items-center gap-1.5">
            View All 15 Ghats <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topGhats.map(ghat => {
            const risk = calculateCrowdRisk(ghat);
            const occPct = Math.round((ghat.currentCrowd / ghat.effectiveCapacity) * 100);

            return (
              <div key={ghat.id} className="glass-card glass-card-hover overflow-hidden flex flex-col justify-between">
                <div className="relative h-44 overflow-hidden">
                  <img src={ghat.image} alt={ghat.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${risk.badgeClass}`}>
                      {risk.statusText}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs text-white border border-white/10">
                    📍 {ghat.city}
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-white mb-1">{ghat.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{ghat.description}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Effective Cap (30 min):</span>
                      <span className="font-mono font-bold text-white">{ghat.effectiveCapacity.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>50% Online Quota:</span>
                      <span className="font-mono font-bold text-sky-400">{(ghat.effectiveCapacity * 0.5).toLocaleString()}</span>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Current Occupancy</span>
                        <span className="font-bold text-white">{occPct}%</span>
                      </div>
                      <div className="progress-bar-bg h-2">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${occPct}%`, backgroundColor: risk.color }} 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-400">
                      General ₹{ghat.generalTicketPrice} | <span className="text-purple-400 font-bold">VIP ₹{ghat.vipTicketPrice}</span>
                    </div>
                    <Link
                      to={`/book?ghat=${ghat.id}`}
                      className="gradient-river hover:opacity-90 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-all"
                    >
                      Book Slot
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>
      {/* =====================================================
    LARGE MISSING PERSON PHOTO MODAL
===================================================== *

{selectedAnnouncement && (
  <div
    className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
    onClick={() => setSelectedAnnouncement(null)}
  >
    <div
      className="relative w-full max-w-4xl max-h-[95vh] flex flex-col items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >

      {/* CLOSE BUTTON 
      <button
        type="button"
        onClick={() => setSelectedAnnouncement(null)}
        className="
          absolute
          top-3
          right-3
          z-20
          w-11
          h-11
          rounded-full
          bg-rose-600
          hover:bg-rose-500
          text-white
          flex
          items-center
          justify-center
          shadow-xl
          text-xl
          font-bold
        "
      >
        ×
      </button>

      {/* PHOTO 
      {selectedAnnouncement.photo && (
        <img
          src={selectedAnnouncement.photo}
          alt={selectedAnnouncement.personName || "Missing Person"}
          className="
            max-w-full
            max-h-[75vh]
            object-contain
            rounded-2xl
            border
            border-slate-700
            shadow-2xl
          "
        />
      )}

       PERSON DETAILS 
      <div
        className="
          mt-4
          w-full
          max-w-2xl
          bg-slate-900
          border
          border-slate-700
          rounded-2xl
          p-5
          text-center
        "
      >

        <div className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-2">
          🚨 MISSING PERSON ALERT
        </div>

        <h2 className="text-2xl font-black text-white">
          {selectedAnnouncement.personName || "Unknown Person"}
        </h2>

        {selectedAnnouncement.age && (
          <p className="text-slate-300 text-sm mt-1">
            Age: {selectedAnnouncement.age}
            {selectedAnnouncement.gender &&
              ` • ${selectedAnnouncement.gender}`}
          </p>
        )}

        {selectedAnnouncement.caseId && (
          <p className="text-rose-300 font-mono text-xs mt-2">
            Case ID: {selectedAnnouncement.caseId}
          </p>
        )}

        {selectedAnnouncement.lastSeenGhatName && (
          <p className="text-slate-300 text-sm mt-3">
            📍 Last seen at{" "}
            <span className="text-rose-400 font-bold">
              {selectedAnnouncement.lastSeenGhatName}
            </span>
          </p>
        )}

        {selectedAnnouncement.lastKnownLocation && (
          <p className="text-slate-400 text-xs mt-1">
            {selectedAnnouncement.lastKnownLocation}
          </p>
        )}

        {selectedAnnouncement.lastSeenTime && (
          <p className="text-slate-400 text-xs mt-1">
            🕐 {selectedAnnouncement.lastSeenTime}
          </p>
        )}

        {selectedAnnouncement.reporterPhone && (
          <p className="text-sky-400 text-sm font-bold mt-3">
            📞 Contact: {selectedAnnouncement.reporterPhone}
          </p>
        )}

      </div>

    </div>
  </div>
)}
    </div>
  );
};*/
