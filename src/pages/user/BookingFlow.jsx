import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { dbService } from '../../services/dbService';
import confetti from 'canvas-confetti';
import {
  Ticket,
  User,
  Users,
  ShieldCheck,
  CreditCard,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export function BookingFlow() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { ghats, createBooking } = useApp();

  const defaultGhatId = searchParams.get('ghatId') || (ghats[0] ? ghats[0].id : '');
  const [selectedGhatId, setSelectedGhatId] = useState(defaultGhatId);
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || '2027-08-15');
  const [selectedSlotId, setSelectedSlotId] = useState(searchParams.get('slotId') || '');

  const [ticketType, setTicketType] = useState('GENERAL'); // 'GENERAL' | 'VIP'
  const [errorMsg, setErrorMsg] = useState('');

  // Lead Pilgrim Details
  const [leadPilgrim, setLeadPilgrim] = useState({
    fullName: '',
    phone: '',
    email: '',
    aadhaarNumber: '',
    city: 'Rajamahendravaram',
    state: 'Andhra Pradesh'
  });

  // Family / Group Members
  const [familyMembers, setFamilyMembers] = useState([]);

  const currentGhat = ghats.find(g => g.id === selectedGhatId) || ghats[0];
  const slots = dbService.getSlots(selectedGhatId, selectedDate);
  const currentSlot = slots.find(s => s.id === selectedSlotId) || slots[0];

  useEffect(() => {
    if (!selectedSlotId && slots.length > 0) {
      setSelectedSlotId(slots[0].id);
    }
  }, [selectedGhatId, selectedDate]);

  const handleAddFamilyMember = () => {
    if (familyMembers.length >= 10) {
      setErrorMsg('Maximum 10 family members allowed per single booking pass.');
      return;
    }
    setFamilyMembers([
      ...familyMembers,
      { fullName: '', age: '', gender: 'Male', aadhaarNumber: '', relation: 'Relative' }
    ]);
  };

  const handleRemoveFamilyMember = (index) => {
    const updated = [...familyMembers];
    updated.splice(index, 1);
    setFamilyMembers(updated);
  };

  const handleFamilyChange = (index, field, value) => {
    const updated = [...familyMembers];
    updated[index][field] = value;
    setFamilyMembers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!leadPilgrim.fullName || !leadPilgrim.phone || !leadPilgrim.aadhaarNumber) {
      setErrorMsg('Please complete Lead Pilgrim Name, Phone Number, and Aadhaar Number.');
      return;
    }

    if (leadPilgrim.aadhaarNumber.length < 12) {
      setErrorMsg('Aadhaar number must be at least 12 digits.');
      return;
    }

    // Validate family members
    for (let i = 0; i < familyMembers.length; i++) {
      const m = familyMembers[i];
      if (!m.fullName || !m.age || !m.aadhaarNumber) {
        setErrorMsg(`Please fill Name, Age, and Aadhaar for Family Member #${i + 1}.`);
        return;
      }
    }

    try {
      const booking = createBooking({
        ghatId: selectedGhatId,
        slotId: currentSlot ? currentSlot.id : selectedSlotId,
        date: selectedDate,
        timeSlot: currentSlot ? `${currentSlot.startTime} - ${currentSlot.endTime}` : '07:00 - 07:30',
        ticketType,
        leadPilgrim,
        familyMembers
      });

      // Celebration Effect
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      // Navigate to digital ticket page
      navigate(`/ticket/${booking.id}`);
    } catch (err) {
      setErrorMsg(err.message || 'Booking failed. Capacity limit reached.');
    }
  };

  const totalPilgrims = 1 + familyMembers.length;
  const pricePerPilgrim = ticketType === 'VIP' ? (currentGhat ? currentGhat.vipTicketPrice : 200) : 0;
  const totalPrice = pricePerPilgrim * totalPilgrims;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 inline-flex items-center">
            <Ticket className="w-3.5 h-3.5 mr-1 text-amber-400" />
            Digital Slot Pass Booking
          </span>
          <h1 className="text-3xl font-extrabold text-white">Reserve Family Bathing Pass</h1>
          <p className="text-xs text-slate-400">
            50% online quota active. Family Aadhaar details required for digital verification.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-700 text-rose-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Ghat & Slot Selector */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center border-b border-slate-800 pb-3">
              <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
              1. Select Ghat & Time Slot
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Ghat</label>
                <select
                  value={selectedGhatId}
                  onChange={(e) => setSelectedGhatId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:outline-none"
                >
                  {ghats.map((g) => (
                    <option key={g.id} value={g.id}>{g.name} ({g.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Pushkaralu Date</label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:outline-none"
                >
                  <option value="2027-08-15">Aug 15, 2027 (Peak Day 1)</option>
                  <option value="2027-08-16">Aug 16, 2027 (Day 2)</option>
                  <option value="2027-08-17">Aug 17, 2027 (Day 3)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">30-Min Slot</label>
                <select
                  value={selectedSlotId}
                  onChange={(e) => setSelectedSlotId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:outline-none"
                >
                  {slots.map((s) => (
                    <option key={s.id} value={s.id} disabled={s.status === 'FULL'}>
                      {s.startTime} - {s.endTime} ({s.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Ticket Category (General vs VIP) */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center border-b border-slate-800 pb-3">
              <Ticket className="w-4 h-4 mr-2 text-amber-400" />
              2. Choose Pass Type
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setTicketType('GENERAL')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                  ticketType === 'GENERAL'
                    ? 'bg-cyan-950/70 border-cyan-400 ring-2 ring-cyan-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-sm text-white">General Digital Pass</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    FREE / Standard
                  </span>
                </div>
                <p className="text-xs text-slate-400">Access standard digital entry queues for your 30-min slot.</p>
                <span className="text-xs font-extrabold text-emerald-400">₹0 Fee</span>
              </div>

              <div
                onClick={() => setTicketType('VIP')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                  ticketType === 'VIP'
                    ? 'bg-amber-950/70 border-amber-400 ring-2 ring-amber-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-sm text-white">VIP Priority Pass</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Priority Entry
                  </span>
                </div>
                <p className="text-xs text-slate-400">Priority fast-track entry lane + shaded family waiting lounge.</p>
                <span className="text-xs font-extrabold text-amber-400">
                  ₹{currentGhat ? currentGhat.vipTicketPrice : 200} / pilgrim
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Lead Pilgrim Details */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center border-b border-slate-800 pb-3">
              <User className="w-4 h-4 mr-2 text-cyan-400" />
              3. Lead Pilgrim Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Rao"
                  value={leadPilgrim.fullName}
                  onChange={(e) => setLeadPilgrim({ ...leadPilgrim, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={leadPilgrim.phone}
                  onChange={(e) => setLeadPilgrim({ ...leadPilgrim, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Aadhaar Card Number *</label>
                <input
                  type="text"
                  required
                  placeholder="12-digit Aadhaar number"
                  value={leadPilgrim.aadhaarNumber}
                  onChange={(e) => setLeadPilgrim({ ...leadPilgrim, aadhaarNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">City / Hometown *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad / Vijayawada"
                  value={leadPilgrim.city}
                  onChange={(e) => setLeadPilgrim({ ...leadPilgrim, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Additional Family Members */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center">
                <Users className="w-4 h-4 mr-2 text-cyan-400" />
                4. Family & Group Members ({familyMembers.length})
              </h3>
              <button
                type="button"
                onClick={handleAddFamilyMember}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center space-x-1 hover:bg-cyan-500/30 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Family Member</span>
              </button>
            </div>

            {familyMembers.length === 0 ? (
              <p className="text-xs text-slate-500 py-2 italic text-center">
                No extra family members added yet. Click "Add Family Member" above if travelling with group.
              </p>
            ) : (
              <div className="space-y-4">
                {familyMembers.map((member, index) => (
                  <div key={index} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                      <span>Family Member #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFamilyMember(index)}
                        className="text-rose-400 hover:text-rose-300 flex items-center"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={member.fullName}
                          onChange={(e) => handleFamilyChange(index, 'fullName', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Age"
                          value={member.age}
                          onChange={(e) => handleFamilyChange(index, 'age', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
                        />
                      </div>
                      <div>
                        <select
                          value={member.gender}
                          onChange={(e) => handleFamilyChange(index, 'gender', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Aadhaar Card Number"
                          value={member.aadhaarNumber}
                          onChange={(e) => handleFamilyChange(index, 'aadhaarNumber', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <select
                          value={member.relation}
                          onChange={(e) => handleFamilyChange(index, 'relation', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                        >
                          <option value="Spouse">Spouse</option>
                          <option value="Child">Child</option>
                          <option value="Parent">Parent</option>
                          <option value="Relative">Relative</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Order Summary & Confirmation CTA */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 p-6 rounded-3xl border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">Total Booking Summary</span>
              <p className="text-lg font-bold text-white">
                {totalPilgrims} Pilgrim{totalPilgrims > 1 ? 's' : ''} ({ticketType} Pass)
              </p>
              <p className="text-xs text-amber-400 font-semibold">Total Price: ₹{totalPrice}</p>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/20 transition cursor-pointer"
            >
              Confirm & Generate Digital Ticket
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
