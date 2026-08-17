import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Ticket, Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

export function MyBookings() {
  const { bookings } = useApp();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center">
              <Ticket className="w-7 h-7 mr-2 text-cyan-400" />
              My Digital Passes ({bookings.length})
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Active and past digital slot passes reserved for Pushkaralu bathing ghats
            </p>
          </div>

          <Link
            to="/ghats"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg hover:brightness-110 transition"
          >
            Book New Pass
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
            <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="font-bold text-lg text-white">No Digital Passes Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't reserved any bathing passes yet. Use the Smart Recommendation tool to pick your preferred ghat slot.
            </p>
            <Link
              to="/recommend"
              className="inline-flex items-center space-x-1.5 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              <span>Get Recommended Slot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                      {booking.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      booking.ticketType === 'VIP' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {booking.ticketType} PASS
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-cyan-400 inline" />
                    {booking.ghatName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {booking.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                      {booking.timeSlot}
                    </span>
                    <span>Lead: <strong>{booking.leadPilgrim.fullName}</strong> ({booking.totalPilgrims} Person(s))</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center space-x-3">
                  <Link
                    to={`/ticket/${booking.id}`}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 flex items-center space-x-1"
                  >
                    <span>View Ticket & QR</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
