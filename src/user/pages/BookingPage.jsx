import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Ticket,
  Clock,
  ShieldCheck,
  Plus,
  Trash2,
  CreditCard,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useData } from '../../shared/context/DataContext';

export const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { ghats, slots, bookSlot } = useData();

  // =========================================================
  // GHAT & SLOT SELECTION
  // =========================================================

  const selectedGhatId =
    searchParams.get('ghat') ||
    ghats[0]?.id ||
    'pushkar-ghat';

  const selectedSlotId =
    searchParams.get('slot') || null;

  const [ghatId, setGhatId] =
    useState(selectedGhatId);

  const ghat =
    ghats.find(g => g.id === ghatId) ||
    ghats[0];

  const ghatSlots =
    slots.filter(s => s.ghatId === ghat?.id);

  const [slotId, setSlotId] = useState(
    selectedSlotId ||
    (ghatSlots[0]?.id || '')
  );

  const slot =
    ghatSlots.find(s => s.id === slotId) ||
    ghatSlots[0];

  // =========================================================
  // TICKET TYPE
  // =========================================================

  const [ticketType, setTicketType] =
    useState('GENERAL');

  // =========================================================
  // PRIMARY BOOKER
  // =========================================================

  const [primaryName, setPrimaryName] =
    useState('');

  const [primaryPhone, setPrimaryPhone] =
    useState('');

  const [primaryEmail, setPrimaryEmail] =
    useState('');

  const [primaryCity, setPrimaryCity] =
    useState('');

  const [primaryAadhaar, setPrimaryAadhaar] =
    useState('');

  // =========================================================
  // FAMILY MEMBERS
  // =========================================================

  const [familyMembers, setFamilyMembers] =
    useState([]);

  const [newMemberName, setNewMemberName] =
    useState('');

  const [newMemberAge, setNewMemberAge] =
    useState('');

  const [newMemberGender, setNewMemberGender] =
    useState('Male');

  const [newMemberAadhaar, setNewMemberAadhaar] =
    useState('');

  const [newMemberRelation, setNewMemberRelation] =
    useState('Spouse');

  // =========================================================
  // FORM STATE
  // =========================================================

  const [errorMsg, setErrorMsg] =
    useState('');

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // =========================================================
  // ADD FAMILY MEMBER
  // =========================================================

  const handleAddFamilyMember = () => {

    if (
      !newMemberName.trim() ||
      !newMemberAge ||
      !newMemberAadhaar.trim()
    ) {
      alert(
        'Please fill in family member Name, Age, and Aadhaar Number.'
      );
      return;
    }

    if (familyMembers.length >= 5) {
      alert(
        'Maximum 6 pilgrims allowed per booking pass.'
      );
      return;
    }

    setFamilyMembers([
      ...familyMembers,
      {
        name: newMemberName.trim(),
        age: parseInt(newMemberAge),
        gender: newMemberGender,
        aadhaarNumber: newMemberAadhaar.trim(),
        relation: newMemberRelation
      }
    ]);

    setNewMemberName('');
    setNewMemberAge('');
    setNewMemberAadhaar('');
  };

  // =========================================================
  // REMOVE FAMILY MEMBER
  // =========================================================

  const handleRemoveFamilyMember = (index) => {

    setFamilyMembers(
      familyMembers.filter(
        (_, i) => i !== index
      )
    );

  };

  // =========================================================
  // TOTAL PILGRIMS
  // =========================================================

  const totalPilgrims =
    1 + familyMembers.length;

  // =========================================================
  // PRICE CALCULATION
  //
  // GENERAL = ₹0
  // VIP     = ₹50
  // =========================================================

  const pricePerHead =
    ticketType === 'VIP'
      ? (ghat?.vipTicketPrice ?? 50)
      : (ghat?.generalTicketPrice ?? 0);

  const totalAmount =
    totalPilgrims * pricePerHead;

  // =========================================================
  // SUBMIT BOOKING
  // =========================================================

  const handleSubmitBooking = (e) => {

    e.preventDefault();

    setErrorMsg('');

    // Validate primary booker
    if (
      !primaryName.trim() ||
      !primaryPhone.trim() ||
      !primaryCity.trim() ||
      !primaryAadhaar.trim()
    ) {

      setErrorMsg(
        'Please fill in all primary booker required fields including Aadhaar number.'
      );

      return;
    }

    // Validate slot
    if (!slot) {

      setErrorMsg(
        'Please select a valid 30-minute bathing slot.'
      );

      return;
    }

    setIsSubmitting(true);

    try {

      // Generate booking ID
      const bookingId =
        `PUSH-2027-${Math.floor(
          100000 + Math.random() * 900000
        )}`;

      // =====================================================
      // ALL PILGRIMS
      // =====================================================

      const allMembers = [

        {
          name: primaryName.trim(),
          age: 40,
          gender: 'Male',
          aadhaarNumber:
            primaryAadhaar.trim(),
          relation: 'Primary Booker'
        },

        ...familyMembers

      ];

      // =====================================================
      // BOOKING PAYLOAD
      // =====================================================

      const payload = {

        bookingId,

        ghatId: ghat.id,

        ghatName: ghat.name,

        slotId: slot.id,

        date:
          slot.date ||
          '2027-07-15',

        startTime:
          slot.startTime,

        endTime:
          slot.endTime,

        // Ticket information
        ticketType,

        // Price per pilgrim
        ticketPricePerHead:
          pricePerHead,

        // IMPORTANT:
        // This is the value that becomes b.totalAmount
        // in MyBookingsPage
        totalAmount:

          totalAmount,

        totalPilgrimsCount:
          totalPilgrims,

        // ===================================================
        // PRIMARY BOOKER
        // ===================================================

        primaryBooker: {

          name:
            primaryName.trim(),

          phone:
            primaryPhone.trim(),

          email:
            primaryEmail.trim(),

          city:
            primaryCity.trim(),

          aadhaarNumber:
            primaryAadhaar.trim()

        },

        // ===================================================
        // FAMILY MEMBERS
        // ===================================================

        familyMembers:
          allMembers,

        // ===================================================
        // STATUS
        // ===================================================

        paymentStatus:
          totalAmount === 0
            ? 'NOT_REQUIRED'
            : 'PAID',

        bookingStatus:
          'CONFIRMED',

        createdAt:
          new Date().toISOString()

      };

      // =====================================================
      // SAVE BOOKING
      // =====================================================

      bookSlot(payload);

      // =====================================================
      // GO TO TICKET
      // =====================================================

      navigate(
        `/ticket/${bookingId}`
      );

    } catch (err) {

      setErrorMsg(
        err.message ||
        'Failed to process booking.'
      );

      setIsSubmitting(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">

      {/* Decorative background */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">

        <div className="
          absolute
          top-20
          left-1/4
          w-96
          h-96
          bg-sky-400/5
          rounded-full
          blur-3xl
        " />

        <div className="
          absolute
          top-96
          right-1/4
          w-96
          h-96
          bg-amber-400/5
          rounded-full
          blur-3xl
        " />

      </div>


      <div className="
        max-w-4xl
        mx-auto
        space-y-8
      ">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="text-center space-y-3">

          <div className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            bg-sky-100/10
            border
            border-sky-300/20
            text-sky-200
            text-xs
            font-bold
            uppercase
            tracking-widest
          ">

            <Ticket className="w-4 h-4" />

            Godavari Pushkaralu 2027

          </div>


          <h1 className="
            font-heading
            font-black
            text-3xl
            sm:text-4xl
            text-amber-50
          ">

            Digital Slot Booking

          </h1>


          <p className="
            text-slate-300
            text-sm
            max-w-2xl
            mx-auto
            leading-relaxed
          ">

            Reserve your sacred 30-minute
            Godavari bathing slot for you
            and your family.

          </p>


          <div className="
            flex
            justify-center
            items-center
            gap-2
            text-xs
            text-sky-200/80
          ">

            <ShieldCheck className="w-4 h-4" />

            Safe • Organized • Family Friendly

          </div>

        </div>


        {/* =====================================================
            ERROR
        ===================================================== */}

        {errorMsg && (

          <div className="
            bg-rose-500/10
            border
            border-rose-300/20
            text-rose-200
            p-4
            rounded-2xl
            text-sm
            font-semibold
          ">

            ⚠️ {errorMsg}

          </div>

        )}


        <form
          onSubmit={handleSubmitBooking}
          className="space-y-7"
        >

          {/* =====================================================
              STEP 1
          ===================================================== */}

          <div className="
            bg-white/[0.035]
            backdrop-blur-xl
            border
            border-sky-200/10
            rounded-3xl
            p-6
            shadow-xl
            space-y-6
          ">

            <h2 className="
              font-bold
              text-lg
              text-amber-50
              flex
              items-center
              gap-3
            ">

              <span className="
                w-8
                h-8
                rounded-full
                bg-sky-400/20
                border
                border-sky-300/30
                text-sky-200
                flex
                items-center
                justify-center
                text-xs
                font-bold
              ">

                1

              </span>

              Select Ghat & 30-Minute Bathing Slot

            </h2>


            {/* Ghat + Slot */}

            <div className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-5
            ">

              {/* GHAT */}

              <div>

                <label className="
                  block
                  text-xs
                  font-semibold
                  text-amber-100/80
                  mb-2
                ">

                  Pilgrimage Ghat

                </label>


                <select
                  value={ghatId}
                  onChange={(e) => {

                    const newGhatId =
                      e.target.value;

                    setGhatId(
                      newGhatId
                    );

                    const first =
                      slots.find(
                        s =>
                          s.ghatId ===
                          newGhatId
                      );

                    if (first) {

                      setSlotId(
                        first.id
                      );

                    }

                  }}
                  className="
                    w-full
                    bg-[#172b32]
                    border
                    border-sky-200/15
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    text-amber-50
                    outline-none
                    focus:border-sky-300/60
                    focus:ring-2
                    focus:ring-sky-300/10
                  "
                >

                  {ghats.map(g => (

                    <option
                      key={g.id}
                      value={g.id}
                    >

                      {g.name} ({g.city})

                    </option>

                  ))}

                </select>

              </div>


              {/* SLOT */}

              <div>

                <label className="
                  block
                  text-xs
                  font-semibold
                  text-amber-100/80
                  mb-2
                ">

                  Available 30-min Slot

                </label>


                <select
                  value={slotId}
                  onChange={(e) =>
                    setSlotId(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    bg-[#172b32]
                    border
                    border-sky-200/15
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    text-amber-50
                    outline-none
                    focus:border-sky-300/60
                    focus:ring-2
                    focus:ring-sky-300/10
                    font-mono
                  "
                >

                  {ghatSlots.map(s => (

                    <option
                      key={s.id}
                      value={s.id}
                      disabled={
                        s.status === 'FULL'
                      }
                    >

                      {s.startTime}
                      {' - '}
                      {s.endTime}

                      {' ('}

                      {s.status === 'FULL'
                        ? 'FULL'
                        : `${s.generalRemaining} Gen / ${s.vipRemaining} VIP left`
                      }

                      {')'}

                    </option>

                  ))}

                </select>

              </div>

            </div>


            {/* =================================================
                TICKET TYPE
            ================================================= */}

            <div className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-5
              pt-2
            ">

              {/* GENERAL */}

              <div
                onClick={() =>
                  setTicketType(
                    'GENERAL'
                  )
                }
                className={`
                  p-5
                  rounded-2xl
                  border
                  cursor-pointer
                  transition-all
                  space-y-3

                  ${
                    ticketType ===
                    'GENERAL'

                      ? `
                        bg-sky-300/10
                        border-sky-300/50
                        ring-2
                        ring-sky-300/10
                      `

                      : `
                        bg-white/[0.025]
                        border-sky-200/10
                        hover:border-sky-300/30
                      `
                  }
                `}
              >

                <div className="
                  flex
                  justify-between
                  items-center
                ">

                  <div>

                    <span className="
                      font-bold
                      text-amber-50
                      text-base
                    ">

                      General Slot

                    </span>


                    <p className="
                      text-[10px]
                      text-sky-200/70
                      uppercase
                      tracking-wider
                      mt-1
                    ">

                      Standard Access

                    </p>

                  </div>


                  <span className="
                    font-mono
                    font-black
                    text-sky-200
                    text-xl
                  ">

                    ₹{ghat?.generalTicketPrice ?? 0}

                  </span>

                </div>


                <p className="
                  text-xs
                  text-slate-300
                  leading-relaxed
                ">

                  Standard bathing queue access.
                  No ticket charge for General pilgrims.

                </p>


                <div className="
                  flex
                  items-center
                  gap-2
                  text-[11px]
                  text-emerald-200/80
                ">

                  <CheckCircle
                    className="w-3.5 h-3.5"
                  />

                  ₹{ghat?.generalTicketPrice ?? 0}
                  {' '}per person

                </div>

              </div>


              {/* VIP */}

              <div
                onClick={() =>
                  setTicketType('VIP')
                }
                className={`
                  p-5
                  rounded-2xl
                  border
                  cursor-pointer
                  transition-all
                  space-y-3

                  ${
                    ticketType === 'VIP'

                      ? `
                        bg-amber-300/10
                        border-amber-300/50
                        ring-2
                        ring-amber-300/10
                      `

                      : `
                        bg-white/[0.025]
                        border-amber-200/10
                        hover:border-amber-300/30
                      `
                  }
                `}
              >

                <div className="
                  flex
                  justify-between
                  items-center
                ">

                  <div>

                    <span className="
                      font-bold
                      text-amber-100
                      text-base
                    ">

                      🪔 VIP Priority Pass

                    </span>


                    <p className="
                      text-[10px]
                      text-amber-200/70
                      uppercase
                      tracking-wider
                      mt-1
                    ">

                      Priority Access

                    </p>

                  </div>


                  <span className="
                    font-mono
                    font-black
                    text-amber-300
                    text-xl
                  ">

                    ₹{ghat?.vipTicketPrice ?? 50}

                  </span>

                </div>


                <p className="
                  text-xs
                  text-slate-300
                  leading-relaxed
                ">

                  Express queue access with
                  priority assistance for a smoother
                  pilgrimage.

                </p>


                <div className="
                  flex
                  items-center
                  gap-2
                  text-[11px]
                  text-amber-200/80
                ">

                  <ShieldCheck
                    className="w-3.5 h-3.5"
                  />

                  ₹{ghat?.vipTicketPrice ?? 50}
                  {' '}per person

                </div>

              </div>

            </div>

          </div>


          {/* =====================================================
              STEP 2
          ===================================================== */}

          <div className="
            bg-white/[0.035]
            backdrop-blur-xl
            border
            border-amber-200/10
            rounded-3xl
            p-6
            shadow-xl
            space-y-6
          ">

            <h2 className="
              font-bold
              text-lg
              text-amber-50
              flex
              items-center
              gap-3
            ">

              <span className="
                w-8
                h-8
                rounded-full
                bg-amber-400/15
                border
                border-amber-300/20
                text-amber-200
                flex
                items-center
                justify-center
                text-xs
                font-bold
              ">

                2

              </span>

              Primary Booker & Family Details

            </h2>


            <div className="
              text-xs
              text-amber-200/70
              bg-amber-300/5
              border
              border-amber-200/10
              rounded-xl
              px-4
              py-3
            ">

              Aadhaar number is mandatory for all
              pilgrims included in the booking.

            </div>


            {/* PRIMARY FIELDS */}

            <div className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-4
            ">

              <div>

                <label className="soft-label">
                  Primary Booker Full Name *
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Varma"
                  value={primaryName}
                  onChange={(e) =>
                    setPrimaryName(
                      e.target.value
                    )
                  }
                  className="soft-input"
                />

              </div>


              <div>

                <label className="soft-label">
                  Mobile Phone Number *
                </label>

                <input
                  type="tel"
                  required
                  placeholder="+91 XXXXXXXXXX"
                  value={primaryPhone}
                  onChange={(e) =>
                    setPrimaryPhone(
                      e.target.value
                    )
                  }
                  className="soft-input"
                />

              </div>


              <div>

                <label className="soft-label">
                  City / Hometown *
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad / Vijayawada"
                  value={primaryCity}
                  onChange={(e) =>
                    setPrimaryCity(
                      e.target.value
                    )
                  }
                  className="soft-input"
                />

              </div>


              <div>

                <label className="soft-label">
                  Aadhaar Card Number *
                </label>

                <input
                  type="text"
                  required
                  placeholder="12-digit Aadhaar Number"
                  value={primaryAadhaar}
                  onChange={(e) =>
                    setPrimaryAadhaar(
                      e.target.value
                    )
                  }
                  className="
                    soft-input
                    font-mono
                  "
                />

              </div>

            </div>


            {/* FAMILY */}

            <div className="
              border-t
              border-amber-100/10
              pt-6
              space-y-4
            ">

              <h3 className="
                font-bold
                text-sm
                text-amber-50
                flex
                items-center
                justify-between
              ">

                <span>

                  Family Members Accompanying
                  ({familyMembers.length}/5)

                </span>


                <span className="
                  text-xs
                  font-normal
                  text-sky-200/70
                ">

                  Total Pilgrims:
                  {' '}
                  {totalPilgrims}

                </span>

              </h3>


              {/* ADDED MEMBERS */}

              {familyMembers.length > 0 && (

                <div className="space-y-2">

                  {familyMembers.map(
                    (m, idx) => (

                      <div
                        key={idx}
                        className="
                          flex
                          items-center
                          justify-between
                          bg-sky-200/[0.035]
                          p-3
                          rounded-xl
                          border
                          border-sky-200/10
                          text-xs
                        "
                      >

                        <div className="space-y-1">

                          <span className="
                            font-bold
                            text-amber-50
                          ">

                            {m.name}
                            {' '}
                            ({m.relation})

                          </span>


                          <p className="
                            text-slate-400
                          ">

                            Age:
                            {' '}
                            {m.age}
                            {' • '}
                            Gender:
                            {' '}
                            {m.gender}

                            {' • '}

                            Aadhaar:
                            {' '}
                            XXXX-XXXX-
                            {m.aadhaarNumber.slice(-4)}

                          </p>

                        </div>


                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveFamilyMember(
                              idx
                            )
                          }
                          className="
                            text-rose-300
                            hover:text-rose-200
                            p-2
                            rounded-lg
                            hover:bg-rose-300/10
                          "
                        >

                          <Trash2
                            className="w-4 h-4"
                          />

                        </button>

                      </div>

                    )
                  )}

                </div>

              )}


              {/* ADD MEMBER */}

              {familyMembers.length < 5 && (

                <div className="
                  bg-sky-200/[0.025]
                  p-4
                  rounded-2xl
                  border
                  border-sky-200/10
                  space-y-3
                ">

                  <span className="
                    text-xs
                    font-semibold
                    text-amber-100/80
                    block
                  ">

                    Add Family Member

                  </span>


                  <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-5
                    gap-3
                  ">

                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newMemberName}
                      onChange={(e) =>
                        setNewMemberName(
                          e.target.value
                        )
                      }
                      className="
                        soft-small-input
                        sm:col-span-2
                      "
                    />


                    <input
                      type="number"
                      placeholder="Age"
                      value={newMemberAge}
                      onChange={(e) =>
                        setNewMemberAge(
                          e.target.value
                        )
                      }
                      className="soft-small-input"
                    />


                    <select
                      value={newMemberGender}
                      onChange={(e) =>
                        setNewMemberGender(
                          e.target.value
                        )
                      }
                      className="soft-small-input"
                    >

                      <option value="Male">
                        Male
                      </option>

                      <option value="Female">
                        Female
                      </option>

                    </select>


                    <select
                      value={newMemberRelation}
                      onChange={(e) =>
                        setNewMemberRelation(
                          e.target.value
                        )
                      }
                      className="soft-small-input"
                    >

                      <option value="Spouse">
                        Spouse
                      </option>

                      <option value="Son">
                        Son
                      </option>

                      <option value="Daughter">
                        Daughter
                      </option>

                      <option value="Parent">
                        Parent
                      </option>

                    </select>

                  </div>


                  <div className="flex gap-3">

                    <input
                      type="text"
                      placeholder="Aadhaar Number"
                      value={newMemberAadhaar}
                      onChange={(e) =>
                        setNewMemberAadhaar(
                          e.target.value
                        )
                      }
                      className="
                        flex-1
                        soft-small-input
                        font-mono
                      "
                    />


                    <button
                      type="button"
                      onClick={
                        handleAddFamilyMember
                      }
                      className="
                        bg-sky-500/20
                        hover:bg-sky-500/30
                        border
                        border-sky-300/20
                        text-sky-100
                        text-xs
                        font-bold
                        px-4
                        py-2
                        rounded-lg
                        flex
                        items-center
                        gap-1
                        shrink-0
                        transition-all
                      "
                    >

                      <Plus className="w-4 h-4" />

                      Add Member

                    </button>

                  </div>

                </div>

              )}

            </div>

          </div>


          {/* =====================================================
              STEP 3
          ===================================================== */}

          <div className="
            bg-white/[0.035]
            backdrop-blur-xl
            border
            border-emerald-200/10
            rounded-3xl
            p-6
            shadow-xl
            space-y-5
          ">

            <h2 className="
              font-bold
              text-lg
              text-amber-50
              flex
              items-center
              gap-3
            ">

              <span className="
                w-8
                h-8
                rounded-full
                bg-emerald-400/15
                border
                border-emerald-300/20
                text-emerald-200
                flex
                items-center
                justify-center
                text-xs
                font-bold
              ">

                3

              </span>

              Payment & Confirmation Summary

            </h2>


            {/* SUMMARY */}

            <div className="
              bg-[#162b2c]
              p-5
              rounded-2xl
              space-y-3
              text-xs
              border
              border-emerald-200/10
            ">

              <div className="
                flex
                justify-between
                gap-4
                text-slate-300
              ">

                <span>
                  Ghat & Slot:
                </span>


                <span className="
                  font-bold
                  text-amber-50
                  text-right
                ">

                  {ghat?.name}

                  {' '}

                  (
                  {slot?.startTime}
                  {' - '}
                  {slot?.endTime}
                  )

                </span>

              </div>


              <div className="
                flex
                justify-between
                text-slate-300
              ">

                <span>
                  Ticket Type:
                </span>


                <span className={`
                  font-bold
                  ${
                    ticketType === 'VIP'
                      ? 'text-amber-300'
                      : 'text-sky-200'
                  }
                `}>

                  {ticketType === 'VIP'
                    ? 'VIP Priority Pass'
                    : 'General Free Pass'
                  }

                </span>

              </div>


              <div className="
                flex
                justify-between
                text-slate-300
              ">

                <span>
                  Price Per Person:
                </span>


                <span className="
                  font-mono
                  font-bold
                  text-amber-50
                ">

                  ₹{pricePerHead}

                </span>

              </div>


              <div className="
                flex
                justify-between
                text-slate-300
              ">

                <span>
                  Total Pilgrims:
                </span>


                <span className="
                  font-mono
                  font-bold
                  text-amber-50
                ">

                  {totalPilgrims}
                  {' '}
                  Person(s)

                </span>

              </div>


              <div className="
                flex
                justify-between
                border-t
                border-emerald-100/10
                pt-3
                text-sm
              ">

                <span className="
                  font-bold
                  text-amber-50
                ">

                  Total Amount:

                </span>


                <span className="
                  font-mono
                  font-black
                  text-amber-300
                  text-lg
                ">

                  ₹{totalAmount}

                </span>

              </div>

            </div>


            {/* BOOKING BUTTON */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full
                bg-gradient-to-r
                from-sky-600
                via-teal-600
                to-emerald-600
                hover:from-sky-500
                hover:via-teal-500
                hover:to-emerald-500
                disabled:opacity-60
                text-white
                font-bold
                text-base
                py-4
                rounded-2xl
                transition-all
                shadow-xl
                shadow-sky-900/20
                flex
                items-center
                justify-center
                gap-2
              "
            >

              {isSubmitting ? (

                <>

                  <Clock
                    className="
                      w-5
                      h-5
                      animate-pulse
                    "
                  />

                  Processing Reservation...

                </>

              ) : (

                <>

                  <CreditCard
                    className="w-5 h-5"
                  />


                  {totalAmount === 0

                    ? 'Confirm Free Booking'

                    : `Confirm Booking (₹${totalAmount})`

                  }


                  <ArrowRight
                    className="w-4 h-4"
                  />

                </>

              )}

            </button>


            <p className="
              text-center
              text-[11px]
              text-slate-400
            ">

              🙏 May your journey along the
              sacred Godavari be peaceful
              and blessed.

            </p>

          </div>

        </form>

      </div>


      {/* =====================================================
          LOCAL STYLES
      ===================================================== */}

      <style>{`

        .soft-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(254, 243, 199, 0.8);
          margin-bottom: 0.4rem;
        }

        .soft-input {
          width: 100%;
          background: rgba(23, 43, 50, 0.9);
          border: 1px solid rgba(186, 230, 253, 0.12);
          border-radius: 0.75rem;
          padding: 0.7rem 1rem;
          font-size: 0.875rem;
          color: #fff7ed;
          outline: none;
          transition: all 0.2s ease;
        }

        .soft-input::placeholder {
          color: rgba(203, 213, 225, 0.45);
        }

        .soft-input:focus {
          border-color: rgba(125, 211, 252, 0.55);
          box-shadow:
            0 0 0 3px
            rgba(125, 211, 252, 0.08);
        }

        .soft-small-input {
          width: 100%;
          background: rgba(10, 25, 30, 0.8);
          border: 1px solid rgba(186, 230, 253, 0.1);
          border-radius: 0.6rem;
          padding: 0.55rem 0.75rem;
          font-size: 0.75rem;
          color: #fff7ed;
          outline: none;
        }

        .soft-small-input::placeholder {
          color: rgba(203, 213, 225, 0.4);
        }

        .soft-small-input:focus {
          border-color: rgba(125, 211, 252, 0.45);
          box-shadow:
            0 0 0 2px
            rgba(125, 211, 252, 0.06);
        }

        select option {
          background: #172b32;
          color: #fff7ed;
        }

      `}</style>

    </div>
  );
};