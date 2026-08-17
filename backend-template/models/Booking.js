const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  aadhaarNumber: { type: String, required: true },
  relation: { type: String, default: 'Relative' }
});

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true }, // e.g. PUSH-2027-AB1234
  ghatId: { type: String, required: true },
  ghatName: { type: String, required: true },
  slotId: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  ticketType: { type: String, enum: ['GENERAL', 'VIP'], default: 'GENERAL' },
  totalPrice: { type: Number, default: 0 },

  leadPilgrim: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    aadhaarNumber: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: 'Andhra Pradesh' }
  },

  familyMembers: [familyMemberSchema],
  totalPilgrims: { type: Number, required: true, default: 1 },
  bookingStatus: { type: String, enum: ['CONFIRMED', 'CANCELLED', 'CHECKED_IN'], default: 'CONFIRMED' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
