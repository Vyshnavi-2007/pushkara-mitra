const mongoose = require('mongoose');

const ghatSchema = new mongoose.Schema({
  ghatId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  
  // Historical Reference vs Operational 2027
  historicalCapacity2015: { type: Number, default: 0 },
  prototypeCapacity2027: { type: Number, default: 0 },
  officialCapacity2027: { type: Number, default: null },
  
  // Effective Capacity Bottlenecks
  physicalCapacity: { type: Number, required: true },
  entryCapacity: { type: Number, required: true },
  exitCapacity: { type: Number, required: true },
  safetyFactor: { type: Number, default: 0.85 },
  
  // Quota & Pass Configuration
  onlineQuotaPercentage: { type: Number, default: 50 }, // 50% reserved for online booking
  vipQuotaPercentage: { type: Number, default: 20 },
  generalTicketPrice: { type: Number, default: 0 },
  vipTicketPrice: { type: Number, default: 200 },
  
  historicalPopularity: { type: Number, default: 70 },
  famousLevel: { type: String, enum: ['CRITICAL_HUB', 'MAJOR', 'LOCAL'], default: 'MAJOR' },
  expectedDemand: { type: Number, default: 75 },
  currentCrowd: { type: Number, default: 0 },
  
  parkingAvailable: { type: Boolean, default: false },
  medicalAvailable: { type: Boolean, default: false },
  toiletAvailable: { type: Boolean, default: false },
  drinkingWaterAvailable: { type: Boolean, default: false },
  wheelchairAccessible: { type: Boolean, default: false },
  
  operatingHours: { type: String, default: '04:00 - 23:00' },
  status: { type: String, enum: ['ACTIVE', 'RESTRICTED', 'CLOSED'], default: 'ACTIVE' },
  image: String,
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Ghat', ghatSchema);
