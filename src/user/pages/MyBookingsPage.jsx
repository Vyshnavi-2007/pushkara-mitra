import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, ArrowRight, Plus } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';

export const MyBookingsPage = () => {
  const { bookings } = useData();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">My Digital Ticket Passes</h1>
          <p className="text-slate-400 text-sm">View, print, or manage your reserved 30-minute Pushkaralu bathing slots.</p>
        </div>

        <Link
          to="/book"
          className="gradient-river hover:opacity-90 text-white font-bold text-sm px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Book New Slot
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4 max-w-md mx-auto">
          <Ticket className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="font-bold text-lg text-white">No Tickets Found</h3>
          <p className="text-xs text-slate-400">You haven't reserved any Pushkaralu bathing slots yet.</p>
          <Link to="/book" className="inline-block gradient-river text-white font-bold text-xs px-5 py-2.5 rounded-xl">
            Book First Slot
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b.bookingId} className="glass-card p-6 border-slate-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded uppercase ${
                    b.ticketType === 'VIP' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  }`}>
                    {b.ticketType} PASS
                  </span>
                  <span className="font-mono font-bold text-xs text-white">{b.bookingId}</span>
                </div>

                <h3 className="font-bold text-xl text-white">{b.ghatName}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-3">
                  <span>📅 {b.date}</span>
                  <span>⏰ {b.startTime} - {b.endTime}</span>
                  <span>👥 {b.totalPilgrimsCount} Pilgrim(s)</span>
                </p>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Total Paid</span>
                  <span className="font-mono font-bold text-amber-400 text-lg">₹{b.totalAmount}</span>
                </div>

                <Link
                  to={`/ticket/${b.bookingId}`}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-600/50 flex items-center gap-1.5 transition-all"
                >
                  View Pass <ArrowRight className="w-4 h-4 text-sky-400" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
