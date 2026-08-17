import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Filter,
  Ticket,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CreditCard,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet
} from 'lucide-react';

export function PilgrimRegistry() {
  const { bookings, ghats } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketTypeFilter, setTicketTypeFilter] = useState('ALL'); // 'ALL' | 'GENERAL' | 'VIP'
  const [ghatFilter, setGhatFilter] = useState('ALL');
  const [expandedBookingId, setExpandedBookingId] = useState(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Search filter
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const leadMatch = b.leadPilgrim.fullName.toLowerCase().includes(q) ||
                          b.leadPilgrim.phone.includes(q) ||
                          b.leadPilgrim.aadhaarNumber.toLowerCase().includes(q) ||
                          b.leadPilgrim.city.toLowerCase().includes(q);
        const idMatch = b.id.toLowerCase().includes(q);
        const ghatMatch = b.ghatName.toLowerCase().includes(q);
        
        let familyMatch = false;
        if (b.familyMembers) {
          familyMatch = b.familyMembers.some(m =>
            m.fullName.toLowerCase().includes(q) || m.aadhaarNumber.toLowerCase().includes(q)
          );
        }

        if (!leadMatch && !idMatch && !ghatMatch && !familyMatch) return false;
      }

      // Ticket category filter
      if (ticketTypeFilter !== 'ALL' && b.ticketType !== ticketTypeFilter) return false;

      // Ghat filter
      if (ghatFilter !== 'ALL' && b.ghatId !== ghatFilter) return false;

      return true;
    });
  }, [bookings, searchTerm, ticketTypeFilter, ghatFilter]);

  // Aggregate Stats
  const totalPilgrimsCount = bookings.reduce((sum, b) => sum + (b.bookingStatus === 'CONFIRMED' ? b.totalPilgrims : 0), 0);
  const totalVIPCount = bookings.reduce((sum, b) => sum + (b.ticketType === 'VIP' && b.bookingStatus === 'CONFIRMED' ? b.totalPilgrims : 0), 0);
  const totalGeneralCount = totalPilgrimsCount - totalVIPCount;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                Admin Control Deck
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1 flex items-center">
              <Users className="w-7 h-7 mr-2 text-cyan-400" />
              Master Pilgrim & Customer Registry
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Detailed registry of digital pass bookers, family member Aadhaar records, slot allocations, and revenue tracking.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-900 px-4 py-3 rounded-2xl border border-slate-800 text-xs">
            <div className="text-center">
              <span className="text-slate-400 text-[10px] block">Total Pilgrims</span>
              <span className="font-extrabold text-lg text-white">{totalPilgrimsCount.toLocaleString()}</span>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div className="text-center">
              <span className="text-slate-400 text-[10px] block">General Passes</span>
              <span className="font-extrabold text-lg text-cyan-400">{totalGeneralCount.toLocaleString()}</span>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div className="text-center">
              <span className="text-slate-400 text-[10px] block">VIP Passes</span>
              <span className="font-extrabold text-lg text-amber-400">{totalVIPCount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Name, Aadhaar (e.g. 1234), Phone, City or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <select
              value={ticketTypeFilter}
              onChange={(e) => setTicketTypeFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
            >
              <option value="ALL">All Pass Categories (General & VIP)</option>
              <option value="GENERAL">General Digital Passes (Standard)</option>
              <option value="VIP">VIP Priority Passes</option>
            </select>
          </div>

          <div>
            <select
              value={ghatFilter}
              onChange={(e) => setGhatFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
            >
              <option value="ALL">All Godavari Ghats</option>
              {ghats.map(g => (
                <option key={g.id} value={g.id}>{g.name} ({g.city})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Master Registry Customer List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 text-xs">
              No pilgrim bookings match your current search filter criteria.
            </div>
          ) : (
            filteredBookings.map((b) => {
              const isExpanded = expandedBookingId === b.id;
              return (
                <div
                  key={b.id}
                  className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden hover:border-slate-700 transition space-y-3"
                >
                  <div
                    onClick={() => setExpandedBookingId(isExpanded ? null : b.id)}
                    className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-extrabold text-xs text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/30">
                          {b.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold ${
                          b.ticketType === 'VIP' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}>
                          {b.ticketType} PASS ({b.totalPilgrims} Person(s))
                        </span>
                        <span className="text-[11px] text-slate-400">Paid: <strong className="text-white">₹{b.totalPrice}</strong></span>
                      </div>

                      <div className="flex items-center space-x-3 text-white font-extrabold text-base">
                        <span>Lead: {b.leadPilgrim.fullName}</span>
                        <span className="text-xs text-cyan-400 font-normal">📍 {b.leadPilgrim.city}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                        <span>Ghat: <strong>{b.ghatName}</strong></span>
                        <span>Date: <strong>{b.date}</strong></span>
                        <span>Slot: <strong className="text-cyan-300">{b.timeSlot}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right text-xs text-slate-400 hidden sm:block">
                        <p>Phone: <strong className="text-white">{b.leadPilgrim.phone}</strong></p>
                        <p>Aadhaar: <strong className="text-slate-200">{b.leadPilgrim.aadhaarNumber}</strong></p>
                      </div>
                      <button className="p-2 rounded-xl bg-slate-800 text-slate-300">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Family Details */}
                  {isExpanded && (
                    <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-4 text-xs">
                      <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-slate-400">
                        Complete Family Group Aadhaar & Identity Breakdown
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {/* Lead */}
                        <div className="p-3 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-1">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 uppercase">
                            Lead Pilgrim
                          </span>
                          <p className="font-bold text-white text-sm mt-1">{b.leadPilgrim.fullName}</p>
                          <p className="text-slate-400">Phone: {b.leadPilgrim.phone}</p>
                          <p className="text-slate-400">Aadhaar: <strong className="text-white">{b.leadPilgrim.aadhaarNumber}</strong></p>
                          <p className="text-slate-400">City: {b.leadPilgrim.city}, {b.leadPilgrim.state}</p>
                        </div>

                        {/* Family Members */}
                        {b.familyMembers && b.familyMembers.map((m, idx) => (
                          <div key={idx} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-300 uppercase">
                              Family Member #{idx + 1} • {m.relation}
                            </span>
                            <p className="font-bold text-white text-sm mt-1">{m.fullName}</p>
                            <p className="text-slate-400">Age: {m.age} • Gender: {m.gender}</p>
                            <p className="text-slate-400">Aadhaar: <strong className="text-white">{m.aadhaarNumber}</strong></p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
