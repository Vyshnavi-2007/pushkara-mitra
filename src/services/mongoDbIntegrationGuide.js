export const MONGO_SCHEMAS_CODE = {
  ghatSchema: `
// models/Ghat.js - MongoDB Mongoose Schema
const mongoose = require('mongoose');

const ghatSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  historicalCapacity2015: { type: Number, default: 0 },
  prototypeCapacity2027: { type: Number, default: 0 },
  officialCapacity2027: { type: Number, default: 0 },
  physicalCapacity: { type: Number, required: true }, // e.g. 40,000 per 30-min slot
  entryCapacity: { type: Number, required: true },
  exitCapacity: { type: Number, required: true },
  effectiveCapacity: { type: Number, required: true }, // MIN(physical, entry, exit)
  onlineQuotaPercentage: { type: Number, default: 50 }, // 50% reserved for online booking
  vipQuotaPercentage: { type: Number, default: 20 }, // 20% of online quota for VIP
  generalTicketPrice: { type: Number, default: 20 },
  vipTicketPrice: { type: Number, default: 250 },
  historicalPopularity: { type: Number, default: 50 },
  famousLevel: { type: String, default: 'Major Ghat' },
  facilities: {
    parking: { type: Boolean, default: false },
    medical: { type: Boolean, default: false },
    toilet: { type: Boolean, default: false },
    drinkingWater: { type: Boolean, default: false },
    wheelchairAccessible: { type: Boolean, default: false },
    changingRooms: { type: Boolean, default: false }
  },
  status: { type: String, enum: ['ACTIVE', 'MAINTENANCE', 'CLOSED'], default: 'ACTIVE' }
}, { timestamps: true });

module.exports = mongoose.model('Ghat', ghatSchema);
`,

  bookingSchema: `
// models/Booking.js - MongoDB Customer & Family Schema
const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  aadhaarNumber: { type: String, required: true }, // Encrypted / Masked preview
  relation: { type: String, required: true }
});

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true }, // "PUSH-2027-XXXXXXXX"
  ghatId: { type: String, required: true, ref: 'Ghat' },
  ghatName: { type: String, required: true },
  slotId: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  ticketType: { type: String, enum: ['GENERAL', 'VIP'], required: true },
  ticketPricePerHead: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  totalPilgrimsCount: { type: Number, required: true },
  primaryBooker: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    city: { type: String, required: true },
    aadhaarNumber: { type: String, required: true }
  },
  familyMembers: [familyMemberSchema],
  paymentStatus: { type: String, enum: ['PAID', 'PENDING', 'FAILED'], default: 'PAID' },
  bookingStatus: { type: String, enum: ['CONFIRMED', 'CANCELLED', 'CHECKED_IN'], default: 'CONFIRMED' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
`,

  expressServerSnippet: `
// server.js - Node.js Express Server for Godavari Seva
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection String
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/godavari_seva";

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Godavari Seva Cluster'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// API Endpoint: Book Slot & Update Capacity atomically
app.post('/api/v1/bookings', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { ghatId, slotId, ticketType, pilgrimsCount, primaryBooker, familyMembers } = req.body;
    
    // 1. Verify Slot Availability
    const slot = await Slot.findOne({ id: slotId }).session(session);
    if (!slot) throw new Error('Slot not found');

    const quotaField = ticketType === 'VIP' ? 'vipRemaining' : 'generalRemaining';
    if (slot[quotaField] < pilgrimsCount) {
      throw new Error('Not enough remaining online capacity in this slot');
    }

    // 2. Create Booking
    const newBooking = new Booking(req.body);
    await newBooking.save({ session });

    // 3. Increment Booked Counts
    if (ticketType === 'VIP') {
      slot.vipBookedCount += pilgrimsCount;
    } else {
      slot.generalBookedCount += pilgrimsCount;
    }
    slot.totalBookedCount += pilgrimsCount;
    await slot.save({ session });

    await session.commitTransaction();
    res.status(201).json({ success: true, booking: newBooking });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ success: false, error: err.message });
  } finally {
    session.endSession();
  }
});

app.listen(5000, () => console.log('🚀 Godavari Seva Backend running on Port 5000'));
`
};
