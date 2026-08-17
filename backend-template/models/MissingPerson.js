const mongoose = require('mongoose');

const sightingSchema = new mongoose.Schema({
  sightingId: { type: String, required: true },
  reportedAt: { type: Date, default: Date.now },
  ghatId: String,
  locationDetails: { type: String, required: true },
  description: { type: String, required: true },
  photoUrl: String,
  reportedByStaff: { type: Boolean, default: false }
});

const missingPersonSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true }, // e.g. MP-2027-10482
  personName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  relationship: String,
  lastSeenGhatId: { type: String, required: true },
  lastSeenGhatName: { type: String, required: true },
  lastKnownLocation: { type: String, required: true },
  lastSeenTime: { type: String, required: true },
  clothingDescription: { type: String, required: true },
  identifyingFeatures: String,
  photoUrl: String,

  // Confidential Reporter Info (Admin Only)
  reporter: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    bookingId: String,
    aadhaarNumber: String
  },

  status: {
    type: String,
    enum: ['PENDING_VERIFICATION', 'VERIFIED', 'ALERT_BROADCASTED', 'POSSIBLE_SIGHTING', 'PERSON_FOUND', 'REUNITED', 'CLOSED'],
    default: 'PENDING_VERIFICATION'
  },
  priority: { type: String, enum: ['MEDIUM', 'HIGH', 'CRITICAL'], default: 'HIGH' },
  sightings: [sightingSchema]
}, { timestamps: true });

module.exports = mongoose.model('MissingPerson', missingPersonSchema);
