import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { dbService } from '../../services/dbService';
import {
  Ticket,
  QrCode,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  ShieldCheck,
  Printer,
  ArrowLeft
} from 'lucide-react';

export function DigitalTicket() {
  const { id } = useParams();
  const { bookings } = useApp();

  const booking = bookings.find(b => b.id === id) || dbService.getBookingById(id) || bookings[0];

  if (!booking) {
    return (
      <div className="bg-slate-950 text-white min-h-screen p-10 text-center">
        <h2 className="text-xl font-bold">Booking Not Found</h2>
        <Link to="/ghats" className="text-cyan-400 text-xs mt-2 inline-block">Return to Ghats</Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Top Back Navigation */}
        <div className="flex justify-between items-center print:hidden">
          <Link to="/my-bookings" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to My Passes
          </Link>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center space-x-1.5 border border-slate-700 shadow"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print Digital Pass</span>
          </button>
        </div>

        {/* Digital Pass Printable Card */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl border-2 border-cyan-500/40 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Watermark / Badge */}
          <div className="flex justify-between items-start border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl text-white tracking-tight">GODAVARI SEVA</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  OFFICIAL PASS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Godavari Pushkaralu 2027 Pilgrim Gate Pass</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Pass ID</span>
              <p className="text-sm font-mono font-extrabold text-amber-400">{booking.id}</p>
            </div>
          </div>

          {/* QR Code & Main Pass Metadata */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="space-y-3 max-w-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <h3 className="font-extrabold text-lg text-white">{booking.ghatName}</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">Date</span>
                  <span className="font-bold text-white">{booking.date}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">30-Min Slot</span>
                  <span className="font-bold text-cyan-300">{booking.timeSlot}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Ticket Category</span>
                  <span className={`font-bold ${booking.ticketType === 'VIP' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {booking.ticketType} Pass
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Total Pilgrims</span>
                  <span className="font-bold text-white">{booking.totalPilgrims} Person(s)</span>
                </div>
              </div>
            </div>

            {/* QR Mockup */}
            <div className="shrink-0 flex flex-col items-center bg-white p-3 rounded-2xl text-slate-950 text-center">
              <div className="w-32 h-32 bg-slate-900 p-2 rounded-xl flex items-center justify-center text-cyan-400 font-mono text-[9px] break-all border">
                [QR VALIDATED: {booking.id}]
              </div>
              <span className="text-[10px] font-bold text-slate-700 mt-1">SCAN AT GATE</span>
            </div>
          </div>

          {/* Lead Pilgrim & Family Details */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
              Verified Pilgrim Registry Details
            </h4>

            {/* Lead */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between font-bold text-white">
                <span>Lead: {booking.leadPilgrim.fullName}</span>
                <span className="text-cyan-400">{booking.leadPilgrim.city}</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Phone: {booking.leadPilgrim.phone} • Aadhaar: {booking.leadPilgrim.aadhaarNumber}
              </p>
            </div>

            {/* Family members */}
            {booking.familyMembers && booking.familyMembers.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400">Accompanying Family Members:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {booking.familyMembers.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                      <p className="font-bold text-white">{m.fullName} ({m.age}y, {m.gender})</p>
                      <p className="text-[10px] text-slate-400">Aadhaar: {m.aadhaarNumber} • {m.relation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Entry Security Instructions */}
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200 space-y-1">
            <div className="flex items-center font-bold text-cyan-300">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-cyan-400" />
              <span>Gate Entrance Instructions</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Please arrive 15 minutes before your slot time at <strong>{booking.ghatName}</strong>. Carry physical or digital Aadhaar for security verification at the digital entry turnstiles.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
