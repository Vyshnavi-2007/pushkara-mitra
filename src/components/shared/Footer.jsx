import React from 'react';
import { Waves, Shield, PhoneCall, Info, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-bold">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">GODAVARI SEVA</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official digital crowd management & pilgrim safety platform for Godavari Pushkaralu 2027. Empowering safer holy baths across Rajamahendravaram & Kovvur.
            </p>
            <div className="flex items-center space-x-2 text-xs text-amber-400 bg-amber-950/40 p-2 rounded border border-amber-500/20">
              <Info className="w-4 h-4 shrink-0" />
              <span>Operational Hackathon Prototype — Historical & Configurable Model</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Pilgrim Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/ghats" className="hover:text-cyan-400 transition">Explore Godavari Ghats</Link></li>
              <li><Link to="/recommend" className="hover:text-amber-400 transition">Smart Ghat Recommendation</Link></li>
              <li><Link to="/book" className="hover:text-cyan-400 transition">Digital Slot Pass Booking</Link></li>
              <li><Link to="/my-bookings" className="hover:text-cyan-400 transition">My Digital Passes & Tickets</Link></li>
              <li><Link to="/safety" className="hover:text-rose-400 transition">Report Missing Family Member</Link></li>
            </ul>
          </div>

          {/* Col 3: Admin & Control */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Control Center
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/admin/dashboard" className="hover:text-amber-400 transition">Control Dashboard</Link></li>
              <li><Link to="/admin/pilgrims" className="hover:text-amber-400 transition">Master Pilgrim Registry</Link></li>
              <li><Link to="/admin/ghats" className="hover:text-amber-400 transition">Ghat Capacity Configurator</Link></li>
              <li><Link to="/admin/crowd-monitor" className="hover:text-amber-400 transition">Real-Time Crowd Heatmap</Link></li>
              <li><Link to="/admin/missing-persons" className="hover:text-rose-400 transition">Missing Person Control Center</Link></li>
            </ul>
          </div>

          {/* Col 4: Emergency Contacts & Zones */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Pushkaralu Helplines
            </h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center text-slate-300">
                <PhoneCall className="w-3.5 h-3.5 mr-2 text-rose-400" />
                Control Room: <strong>1800-425-2027</strong>
              </p>
              <p className="flex items-center text-slate-300">
                <Shield className="w-3.5 h-3.5 mr-2 text-cyan-400" />
                Missing Person Desk: <strong>108 / 100</strong>
              </p>
              <p className="flex items-center text-slate-300">
                <MapPin className="w-3.5 h-3.5 mr-2 text-amber-400" />
                Districts: East & West Godavari, AP
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center">
          <p>© 2027 GODAVARI SEVA. Built for Pushkaralu Hackathon Innovation.</p>
          <p className="mt-2 sm:mt-0 flex items-center">
            Designed with <Heart className="w-3 h-3 text-rose-500 mx-1 inline" /> for Pilgrim Safety & Digital Governance
          </p>
        </div>
      </div>
    </footer>
  );
}
