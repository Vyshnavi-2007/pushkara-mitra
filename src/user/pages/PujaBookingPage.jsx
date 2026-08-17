import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, MapPin, UserCheck, ShieldCheck, HeartHandshake, CheckCircle2, Ticket } from 'lucide-react';
import { INITIAL_PUJAS } from '../../data/initialPujas';
import { OfflineQRCode } from '../../shared/components/OfflineQRCode';

export const PujaBookingPage = () => {
  const [selectedPuja, setSelectedPuja] = useState(INITIAL_PUJAS[0]);
  const [tier, setTier] = useState('STANDARD'); // 'STANDARD' | 'VIP'
  const [selectedSlot, setSelectedSlot] = useState(INITIAL_PUJAS[0].timeSlots[0]);
  
  // Sankalpam Form
  const [primaryName, setPrimaryName] = useState('');
  const [gothram, setGothram] = useState('');
  const [nakshatram, setNakshatram] = useState('');
  const [familyNames, setFamilyNames] = useState('');
  const [phone, setPhone] = useState('');

  const [bookingPass, setBookingPass] = useState(null);

  const price = tier === 'VIP' ? selectedPuja.vipPricePerFamily : selectedPuja.pricePerFamily;

  const handleBookPuja = (e) => {
    e.preventDefault();
    if (!primaryName || !gothram || !phone) {
      alert("Please fill in Primary Devotee Name, Gothram, and Contact Phone.");
      return;
    }

    const passId = `PUJA-2027-${Math.floor(100000 + Math.random() * 900000)}`;
    const passData = {
      passId,
      pujaName: selectedPuja.name,
      location: selectedPuja.location,
      timeSlot: selectedSlot,
      tier,
      price,
      primaryName,
      gothram,
      nakshatram,
      familyNames,
      phone,
      date: "2027-07-15",
      qrPayload: JSON.stringify({ passId, puja: selectedPuja.name, devotee: primaryName, gothram })
    };

    setBookingPass(passData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Devotional Sector 2: Veda Pathashala Rituals & Pujas
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white">Devotional Pujas & Harati Booking</h1>
        <p className="text-slate-300 text-sm">
          Reserve sacred Godavari Maha Harati passes, Pitru Tharpanam, and Chandi Homam with family Sankalpam conducted by certified Veda Pandits.
        </p>
      </div>

      {bookingPass ? (
        <div className="glass-card max-w-2xl mx-auto p-8 border-2 border-amber-500/50 space-y-6 bg-slate-900/95 shadow-2xl">
          <div className="text-center space-y-2 border-b border-slate-800 pb-4">
            <span className="text-[10px] uppercase font-bold px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              CONFIRMED PUJA SANKALPAM PASS
            </span>
            <h2 className="font-heading font-black text-3xl text-white">{bookingPass.pujaName}</h2>
            <p className="text-xs text-slate-400">📍 {bookingPass.location} • Date: {bookingPass.date}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Devotee Name</span>
              <span className="font-bold text-white">{bookingPass.primaryName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Gothram & Nakshatram</span>
              <span className="font-bold text-amber-300 font-mono">{bookingPass.gothram} ({bookingPass.nakshatram || 'N/A'})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Time Slot</span>
              <span className="font-bold text-sky-400 font-mono">{bookingPass.timeSlot}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Seva Tier & Fee</span>
              <span className="font-bold text-emerald-400 font-mono">{bookingPass.tier} PASS (₹{bookingPass.price})</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
            <OfflineQRCode value={bookingPass.qrPayload} size={180} />
            <p className="text-[11px] text-slate-400 font-mono text-center">Pass ID: {bookingPass.passId} (Scannable Offline)</p>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full gradient-saffron text-slate-950 font-bold text-sm py-3.5 rounded-xl shadow-lg"
          >
            Print Devotional Pass
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Puja Selection List */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white">Select Sacred Ritual</h3>
            {INITIAL_PUJAS.map(puja => (
              <div
                key={puja.id}
                onClick={() => {
                  setSelectedPuja(puja);
                  setSelectedSlot(puja.timeSlots[0]);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  selectedPuja.id === puja.id 
                    ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/40' 
                    : 'glass-card border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-base">{puja.name}</h4>
                  <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {puja.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{puja.description}</p>
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-slate-300">Standard: ₹{puja.pricePerFamily}</span>
                  <span className="text-purple-300 font-bold">VIP Seva: ₹{puja.vipPricePerFamily}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Booking & Sankalpam Form */}
          <div className="glass-card p-8 border-amber-500/30 space-y-6 lg:col-span-2">
            <h2 className="font-bold text-xl text-white">Sankalpam Registration: {selectedPuja.name}</h2>

            <form onSubmit={handleBookPuja} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Puja Time Slot</label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none"
                  >
                    {selectedPuja.timeSlots.map((ts, idx) => (
                      <option key={idx} value={ts}>{ts}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Seva Category Tier</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  >
                    <option value="STANDARD">Standard Family Pass (₹{selectedPuja.pricePerFamily})</option>
                    <option value="VIP">VIP Mandapam Priority Pass (₹{selectedPuja.vipPricePerFamily})</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-4">
                <h3 className="font-bold text-sm text-amber-300">Devotee Family Sankalpam Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Devotee Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Subba Rao Pasupuleti"
                      value={primaryName}
                      onChange={(e) => setPrimaryName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Gothram *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bharadwaja / Kaushika"
                      value={gothram}
                      onChange={(e) => setGothram(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Janma Nakshatram (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Rohini / Uttara"
                      value={nakshatram}
                      onChange={(e) => setNakshatram(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98480 XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Family Members Names for Chanting (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Lakshmi, Venkatesh, Ananya"
                    value={familyNames}
                    onChange={(e) => setFamilyNames(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold">Total Devotional Dakshina / Pass Fee:</span>
                <span className="font-mono font-black text-amber-400 text-lg">₹{price}</span>
              </div>

              <button
                type="submit"
                className="w-full gradient-saffron hover:opacity-90 text-slate-950 font-bold text-base py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20"
              >
                Confirm Puja Booking & Generate Pass (₹{price})
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};
