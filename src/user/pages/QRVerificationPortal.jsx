import React, { useState } from 'react';
import { QrCode, ShieldCheck, CheckCircle2, XCircle, Search, UserCheck, AlertTriangle, RefreshCw, Key, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../shared/context/DataContext';

export const QRVerificationPortal = () => {
  const { bookings, userAuth, t } = useData();

  const [inputCode, setInputCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [checkInStatus, setCheckInStatus] = useState(null);

  const handleVerifyCode = (e) => {
    e.preventDefault();
    setScanResult(null);
    setCheckInStatus(null);

    const code = inputCode.trim();
    if (!code) return;

    let targetBooking = null;

    // Try parsing as JSON QR payload or matching Booking ID
    try {
      if (code.startsWith('{')) {
        const parsed = JSON.parse(code);
        if (parsed.id || parsed.passId) {
          targetBooking = bookings.find(b => b.bookingId === (parsed.id || parsed.passId));
        }
      }
    } catch (err) {
      // ignore json parse error
    }

    if (!targetBooking) {
      targetBooking = bookings.find(b => b.bookingId.toLowerCase() === code.toLowerCase());
    }

    if (targetBooking) {
      setScanResult({
        valid: true,
        booking: targetBooking,
        message: "VALID DIGITAL PASSHOLDER CLEARANCE"
      });
    } else {
      setScanResult({
        valid: false,
        message: "INVALID OR UNREGISTERED TICKET PASS CODE"
      });
    }
  };

  const handleConfirmCheckIn = () => {
    if (scanResult && scanResult.booking) {
      setCheckInStatus(`CHECKED_IN_${scanResult.booking.bookingId}`);
      alert(`Pilgrim group (${scanResult.booking.totalPilgrimsCount} members) cleared for Ghat Entry Gate #4!`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Officer Header Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              OFFGROUND GATE SECURITY TERMINAL
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">{t('qrScanTitle')}</h1>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Staff: <span className="font-bold text-white">{userAuth.name}</span></span>
        </div>
      </div>

      {/* Verification Input Card */}
      <div className="glass-card p-8 border-2 border-emerald-500/40 space-y-6 bg-slate-900/90 shadow-2xl">
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Scan / Input Offline Ticket QR Payload or Booking ID
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g. PUSH-2027-89A102 or Paste QR JSON Payload string..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 shrink-0"
            >
              <QrCode className="w-4 h-4" /> Verify Pass
            </button>
          </div>
        </form>

        {/* Quick Demo Pre-fill Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold">Demo Quick Verification:</span>
          {bookings.slice(0, 3).map(b => (
            <button
              key={b.bookingId}
              onClick={() => { setInputCode(b.bookingId); setScanResult(null); }}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-300 font-mono text-xs px-3 py-1 rounded-lg border border-slate-700"
            >
              {b.bookingId} ({b.primaryBooker?.name})
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Display Card */}
      {scanResult && (
        <div className={`glass-card p-8 border-2 space-y-6 ${
          scanResult.valid ? 'border-emerald-500 bg-slate-900/95' : 'border-rose-500 bg-rose-950/20'
        }`}>
          
          {scanResult.valid ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      ✓ PASS VERIFIED VALID (OFFLINE READY)
                    </span>
                    <h2 className="font-heading font-black text-2xl text-white">{scanResult.booking.ghatName}</h2>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-lg font-mono font-bold text-xs ${
                  scanResult.booking.ticketType === 'VIP' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                }`}>
                  {scanResult.booking.ticketType} PASS
                </span>
              </div>

              {/* Booking Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Booking ID</span>
                  <span className="font-bold text-sky-400 font-mono">{scanResult.booking.bookingId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Allocated Slot</span>
                  <span className="font-bold text-white font-mono">{scanResult.booking.startTime} - {scanResult.booking.endTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Pilgrims Cleared</span>
                  <span className="font-bold text-emerald-400">{scanResult.booking.totalPilgrimsCount} Head(s)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Payment Status</span>
                  <span className="font-bold text-amber-400 font-mono">{scanResult.booking.paymentStatus} (₹{scanResult.booking.totalAmount})</span>
                </div>
              </div>

              {/* Family Aadhaar List */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Verified Family Members:</h4>
                <div className="space-y-1.5">
                  {scanResult.booking.familyMembers.map((m, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-lg flex justify-between items-center text-xs">
                      <span className="font-bold text-white">{m.name} ({m.relation})</span>
                      <span className="font-mono text-amber-300">Aadhaar: XXXX-XXXX-{m.aadhaarNumber?.slice(-4)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                {checkInStatus === `CHECKED_IN_${scanResult.booking.bookingId}` ? (
                  <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl text-center font-bold text-sm">
                    ✓ CHECKED IN & CLEARED FOR GHAT ENTRY
                  </div>
                ) : (
                  <button
                    onClick={handleConfirmCheckIn}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base py-4 rounded-xl shadow-xl flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-5 h-5" /> Grant Gate Check-in Clearance
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
              <h3 className="font-bold text-xl text-white">Verification Failed</h3>
              <p className="text-xs text-rose-300">{scanResult.message}</p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
