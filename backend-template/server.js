// GODAVARI SEVA Express + MongoDB API Server Template
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Ghat = require('./models/Ghat');
const Booking = require('./models/Booking');
const MissingPerson = require('./models/MissingPerson');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/godavari_seva';

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Database: godavari_seva'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- GHAT ENDPOINTS ---
app.get('/api/ghats', async (req, res) => {
  try {
    const ghats = await Ghat.find();
    res.json(ghats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/ghats/:id', async (req, res) => {
  try {
    const updated = await Ghat.findOneAndUpdate({ ghatId: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- BOOKING ENDPOINTS (FAMILY & SLOTS) ---
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- MISSING PERSONS ENDPOINTS ---
app.get('/api/missing-persons', async (req, res) => {
  try {
    const cases = await MissingPerson.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/missing-persons', async (req, res) => {
  try {
    const newCase = new MissingPerson(req.body);
    await newCase.save();
    res.status(201).json(newCase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/missing-persons/:caseId/status', async (req, res) => {
  try {
    const updated = await MissingPerson.findOneAndUpdate(
      { caseId: req.params.caseId },
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 GODAVARI SEVA API Server running on port ${PORT}`);
});
