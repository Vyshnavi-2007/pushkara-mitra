import React, { useState } from 'react';
import { Users, Search, Download, ShieldCheck, Ticket, Filter, Eye } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';

export const CustomerLedger = () => {
  const { bookings } = useData();

  const [query, setQuery] = useState('');
  const [filterTicketType, setFilterTicketType] = useState('ALL');
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

  const filteredBookings = bookings.filter(b => {
    const q = query.toLowerCase();
    const matchesQuery = b.primaryBooker?.name.toLowerCase().includes(q) ||
                         b.primaryBooker?.city.toLowerCase().includes(q) ||
                         b.primaryBooker?.aadhaarNumber.includes(q) ||
                         b.bookingId.toLowerCase().includes(q) ||
                         b.ghatName.toLowerCase().includes(q);

    const matchesType = filterTicketType === 'ALL' || b.ticketType === filterTicketType;
    return matchesQuery && matchesType;
  });

  const exportCSV = () => {
    const headers = ["Booking ID", "Primary Booker", "Phone", "City", "Primary Aadhaar", "Ghat", "Date", "Slot", "Ticket Type", "Total Pilgrims", "Amount Paid"];
    const rows = filteredBookings.map(b => [
      b.bookingId,
      `"${b.primaryBooker?.name}"`,
      `"${b.primaryBooker?.phone}"`,
      `"${b.primaryBooker?.city}"`,
      `"${b.primaryBooker?.aadhaarNumber}"`,
      `"${b.ghatName}"`,
      b.date,
      `"${b.startTime}-${b.endTime}"`,
      b.ticketType,
      b.totalPilgrimsCount,
      b.totalAmount
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Godavari_Seva_Customer_Ledger_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-900/40 pb-6">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">Customer & Aadhaar Master Ledger</h1>
          <p className="text-xs text-slate-400">Searchable dataset of registered pilgrims, Aadhaar records, family lists, and ticket revenues.</p>
        </div>

        <button
          onClick={exportCSV}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-emerald-500/40 flex items-center gap-2 shadow-lg shadow-emerald-600/20 shrink-0"
        >
          <Download className="w-4 h-4" /> Export Customer Ledger (CSV)
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-6 border-slate-800 space-y-4 bg-slate-900/90">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="relative md:col-span-2">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search by customer name, Aadhaar number, city, or booking ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <select
              value={filterTicketType}
              onChange={(e) => setFilterTicketType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
            >
              <option value="ALL">All Ticket Types</option>
              <option value="GENERAL">General Tickets (₹0)</option>
              <option value="VIP">VIP Priority Passes (₹50)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Customer Dataset Table */}
      <div className="glass-card overflow-hidden border-slate-800 bg-slate-900/90">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Primary Booker</th>
                <th className="p-4">City</th>
                <th className="p-4">Aadhaar Number</th>
                <th className="p-4">Ghat & Slot</th>
                <th className="p-4">Pilgrims</th>
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4 text-center">Family Breakdown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredBookings.map(b => (
                <tr key={b.bookingId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-sky-400">{b.bookingId}</td>
                  <td className="p-4 font-sans font-bold text-white">
                    {b.primaryBooker?.name}
                    <span className="block text-[10px] text-slate-400 font-mono">{b.primaryBooker?.phone}</span>
                  </td>
                  <td className="p-4 font-sans text-slate-300">{b.primaryBooker?.city}</td>
                  <td className="p-4 font-bold text-amber-300">{b.primaryBooker?.aadhaarNumber}</td>
                  <td className="p-4 font-sans">
                    <span className="font-bold text-white block">{b.ghatName}</span>
                    <span className="text-[10px] text-slate-400">{b.startTime} - {b.endTime}</span>
                  </td>
                  <td className="p-4 font-bold text-white">{b.totalPilgrimsCount} Head(s)</td>
                  <td className="p-4 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.ticketType === 'VIP' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-sky-500/20 text-sky-300'
                    }`}>
                      {b.ticketType}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-amber-400">₹{b.totalAmount}</td>
                  <td className="p-4 text-center font-sans">
                    <button
                      onClick={() => setSelectedBookingDetails(b)}
                      className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-lg text-xs font-semibold border border-slate-700 inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-400" /> View ({b.familyMembers.length})
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Family Breakdown Modal Popup */}
      {selectedBookingDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 border-slate-700 space-y-4 bg-slate-900">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">Family Members Ledger</h3>
              <button onClick={() => setSelectedBookingDetails(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-400">Primary Booker: <span className="font-bold text-white">{selectedBookingDetails.primaryBooker?.name}</span> ({selectedBookingDetails.primaryBooker?.city})</p>
              
              <div className="space-y-2 pt-2">
                {selectedBookingDetails.familyMembers.map((m, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>{m.name} ({m.relation})</span>
                      <span className="font-mono text-amber-300">Aadhaar: {m.aadhaarNumber}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">Age: {m.age} yrs • Gender: {m.gender}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedBookingDetails(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
