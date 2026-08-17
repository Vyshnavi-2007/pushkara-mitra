import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CrowdBadge } from '../../components/shared/CrowdBadge';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Search,
  ArrowRight,
  Navigation,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Ticket,
  ChevronRight
} from 'lucide-react';

export function UserHome() {
  const { ghats, userLocation } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/ghats?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/ghats');
    }
  };

  const featuredGhats = ghats.slice(0, 4);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Hero Section with River Blue Aesthetic */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Smart Digital Pilgrim Management System</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              A Safer, Smarter <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 bg-clip-text text-transparent">
                Godavari Pushkaralu
              </span>{' '}
              Experience
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Discover optimal ghats, check real-time crowd risk scores, reserve 30-minute family bathing passes (General & VIP), and access emergency family safety services.
            </p>

            {/* Quick Search Input */}
            <form onSubmit={handleSearch} className="pt-2 max-w-xl mx-auto">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search ghat name (e.g. Pushkar Ghat, Kovvur, Kotilingala)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-32 py-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-xl"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg hover:brightness-110 transition"
                >
                  Search Ghats
                </button>
              </div>
            </form>

            {/* Call to Action Grid */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <Link
                to="/recommend"
                className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/10 hover:scale-[1.02] transition"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Smart Ghat Recommendation</span>
              </Link>
              <Link
                to="/ghats"
                className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 shadow-xl hover:scale-[1.02] transition"
              >
                <Navigation className="w-4 h-4 text-cyan-400" />
                <span>Find Ghats Near Me</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="py-12 bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Sparkles className="w-6 h-6 text-amber-400" />}
              title="Weighted Ghat Recommender"
              desc="Evaluates crowd levels, mobility access, parking, and distance to pick your best slot."
            />
            <FeatureCard
              icon={<Ticket className="w-6 h-6 text-cyan-400" />}
              title="50% Online Quota & VIP Pass"
              desc="Prevents queue conflicts by capping online passes at 50% capacity with dedicated VIP passes."
            />
            <FeatureCard
              icon={<Clock className="w-6 h-6 text-sky-400" />}
              title="30-Min Slot Booking"
              desc="Book exact 30-minute sacred bath intervals for your entire family using Aadhaar verification."
            />
            <FeatureCard
              icon={<ShieldAlert className="w-6 h-6 text-rose-400" />}
              title="Missing Person Safety Desk"
              desc="Instant alert broadcasting and sighting updates to reunite separated family members fast."
            />
          </div>
        </div>
      </section>

      {/* Smart Ghat Recommendation Banner Callout */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 rounded-3xl p-8 border border-cyan-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              AI & Rule-Based Smart Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Avoid Overcrowded Ghats — Get Recommended Slot
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Input your desired bathing time, family size, wheelchair accessibility needs, and vehicle parking requirements. Our algorithm recommends the quietest, safest ghat with transparent scoring.
            </p>
          </div>
          <Link
            to="/recommend"
            className="shrink-0 px-6 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-xl flex items-center space-x-2 transition hover:scale-105"
          >
            <span>Launch Smart Recommendation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Featured Ghats Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Major Pushkaralu Bathing Ghats</h2>
            <p className="text-xs text-slate-400 mt-1">Live crowd status & capacity estimates for Rajamahendravaram & Kovvur</p>
          </div>
          <Link to="/ghats" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1">
            <span>View All Ghats ({ghats.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredGhats.map((ghat) => {
            const occPct = Math.round((ghat.currentCrowd / ghat.physicalCapacity) * 100);
            return (
              <div
                key={ghat.id}
                className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={ghat.image}
                      alt={ghat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <CrowdBadge ghat={ghat} currentSlotOccupancy={occPct} />
                    </div>
                    <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg text-[11px] font-semibold text-cyan-300 border border-slate-700">
                      {ghat.city}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition">
                      {ghat.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {ghat.description}
                    </p>

                    {/* Capacity & Quota metrics */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Physical Capacity:</span>
                        <span className="font-semibold text-white">{ghat.physicalCapacity.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">50% Online Quota:</span>
                        <span className="font-semibold text-cyan-400">
                          {Math.floor(ghat.physicalCapacity * (ghat.onlineQuotaPercentage / 100)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/ghats/${ghat.id}`}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center space-x-1 border border-slate-700 transition"
                  >
                    <span>View Slots & Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2 hover:border-slate-700 transition">
      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-bold text-sm text-white">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
