import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, Printer, XCircle, ArrowLeft, ShieldCheck, UserCheck } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';
import { OfflineQRCode } from '../../shared/components/OfflineQRCode';

export const TicketView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings, cancelBooking } = useData();

  const booking = bookings.find(b => b.bookingId === id) || bookings[0];

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Ticket Not Found</h2>
        <Link to="/bookings" className="text-sky-400 underline">View My Bookings</Link>
      </div>
    );
  }

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this booking? This will release the slot back to the public pool.")) {
      cancelBooking(booking.bookingId);
      navigate('/bookings');
    }
  };

  const qrPayloadString = JSON.stringify({
    id: booking.bookingId,
    ghat: booking.ghatName,
    slot: `${booking.startTime}-${booking.endTime}`,
    pilgrims: booking.totalPilgrimsCount,
    type: booking.ticketType,
    primary: booking.primaryBooker?.name
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Actions Bar */}
      <div className="flex items-center justify-between no-print">
        <Link to="/bookings" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> My Bookings
        </Link>
        <button
          onClick={() => window.print()}
          className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-4 py-2 rounded-xl border border-slate-600/50 flex items-center gap-2"
        >
          <Printer className="w-4 h-4 text-sky-400" /> Print Digital Ticket Pass
        </button>
      </div>

      {/* Main Digital Ticket Pass Card */}
      <div className="glass-card p-8 border-2 border-sky-500/50 space-y-8 relative overflow-hidden bg-slate-900/95 shadow-2xl">
        
        {/* Ticket Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
              OFFICIAL DIGITAL PUSHKARALU PASS
            </span>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">{booking.ghatName}</h1>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400" /> Rajamahendravaram / Kovvur Circle
            </p>
          </div>

          <div className="text-right">
            <span className={`text-xs font-mono font-black px-3 py-1 rounded-lg uppercase ${
              booking.ticketType === 'VIP' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
            }`}>
              {booking.ticketType} PASS
            </span>
            <p className="font-mono font-bold text-lg text-white mt-1">{booking.bookingId}</p>
          </div>
        </div>

        {/* Slot Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date</span>
            <span className="font-bold text-white font-mono">{booking.date}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Bathing Slot</span>
            <span className="font-bold text-sky-400 font-mono">{booking.startTime} - {booking.endTime}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Pilgrims</span>
            <span className="font-bold text-white">{booking.totalPilgrimsCount} Person(s)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Pass Status</span>
            <span className={`font-bold uppercase ${booking.bookingStatus === 'CANCELLED' ? 'text-rose-400' : 'text-emerald-400'}`}>
              {booking.bookingStatus}
            </span>
          </div>
        </div>

        {/* Itemized Family Members List */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-sky-400" />
            Registered Family Members & Aadhaar Ledger
          </h3>

          <div className="space-y-2">
            {booking.familyMembers.map((m, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-white">{m.name}</span>
                  <span className="text-slate-400 text-[11px] ml-2">({m.relation}) • {m.gender}, {m.age} yrs</span>
                </div>
                <div className="font-mono text-amber-300 font-bold">
                  Aadhaar: XXXX-XXXX-{m.aadhaarNumber?.slice(-4) || '1234'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offline Canvas QR Code Section */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <OfflineQRCode value={qrPayloadString} size={150} />
            <div className="space-y-1 text-xs">
              <p className="font-bold text-white">Offline Verification QR Code</p>
              <p className="text-slate-400 text-[11px]">Present this QR code at Ghat Entry Checkpoint Gate #4.</p>
              <p className="text-slate-400 text-[10px] font-mono">Payload: {booking.bookingId}</p>
              <span className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ✓ Scannable Without Internet
              </span>
            </div>
          </div>

          <div className="text-right space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Amount Paid</span>
            <p className="font-mono font-black text-amber-400 text-2xl">₹{booking.totalAmount}</p>
            <p className="text-[10px] text-emerald-400">✓ Verified Reservation</p>
          </div>
        </div>

        {/* Cancellation Option */}
        {booking.bookingStatus !== 'CANCELLED' && (
          <div className="pt-4 border-t border-slate-800/80 text-right no-print">
            <button
              onClick={handleCancel}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold inline-flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" /> Cancel Ticket Pass
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
