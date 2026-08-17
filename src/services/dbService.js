// Central Data & Service Layer for GODAVARI SEVA
// Handles local persistent state with full support for MongoDB Express API backend bridging.
// Central Data & Service Layer for GODAVARI SEVA
// Handles local persistent state with full support for MongoDB Express API backend bridging.

import {
  INITIAL_GHATS,
  INITIAL_DEMO_SLOTS,
  INITIAL_BOOKINGS,
  INITIAL_MISSING_CASES
} from '../data/initialData';

const STORAGE_KEYS = {
  GHATS: 'godavari_seva_ghats_v1',
  SLOTS: 'godavari_seva_slots_v1',
  BOOKINGS: 'godavari_seva_bookings_v1',
  MISSING_CASES: 'godavari_seva_missing_cases_v1',
  NOTIFICATIONS: 'godavari_seva_notifications_v1',
  ADMIN_SETTINGS: 'godavari_seva_admin_settings_v1'
};

class DBService {
  constructor() {
    this.initStorage();
  }

  // =========================================================
  // INITIAL STORAGE
  // =========================================================

  initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.GHATS)) {
      localStorage.setItem(
        STORAGE_KEYS.GHATS,
        JSON.stringify(INITIAL_GHATS)
      );
    }

    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(
        STORAGE_KEYS.BOOKINGS,
        JSON.stringify(INITIAL_BOOKINGS)
      );
    }

    if (!localStorage.getItem(STORAGE_KEYS.MISSING_CASES)) {
      localStorage.setItem(
        STORAGE_KEYS.MISSING_CASES,
        JSON.stringify(INITIAL_MISSING_CASES)
      );
    }

    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      const initialNotifs = [
        {
          id: 'N-101',
          title: '🚨 Missing Person Broadcast',
          message:
            'Case MP-2027-10482 (Subba Rao K, age 68) last seen near Pushkar Ghat.',
          photoUrl:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
          type: 'CRITICAL',
          timestamp: new Date().toISOString(),
          read: false
        },
        {
          id: 'N-102',
          title: '⚠️ High Crowd Alert',
          message:
            'Pushkar Ghat occupancy reached 85%. Online slots nearing capacity.',
          photoUrl: '',
          type: 'WARNING',
          timestamp: new Date().toISOString(),
          read: false
        }
      ];

      localStorage.setItem(
        STORAGE_KEYS.NOTIFICATIONS,
        JSON.stringify(initialNotifs)
      );
    }
  }

  // =========================================================
  // GHATS MANAGEMENT
  // =========================================================

  getGhats() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GHATS);
      return data ? JSON.parse(data) : INITIAL_GHATS;
    } catch (e) {
      console.error('Error reading ghats:', e);
      return INITIAL_GHATS;
    }
  }

  getGhatById(id) {
    const ghats = this.getGhats();

    return ghats.find(g => g.id === id) || null;
  }

  updateGhat(id, updatedFields) {
    const ghats = this.getGhats();

    const index = ghats.findIndex(g => g.id === id);

    if (index !== -1) {
      ghats[index] = {
        ...ghats[index],
        ...updatedFields
      };

      localStorage.setItem(
        STORAGE_KEYS.GHATS,
        JSON.stringify(ghats)
      );

      return ghats[index];
    }

    return null;
  }

  addGhat(newGhatData) {
    const ghats = this.getGhats();

    const newGhat = {
      id: newGhatData.id || `ghat-${Date.now()}`,
      historicalCapacity2015: 20000,
      historicalPopularity: 70,
      prototypeCapacity2027:
        newGhatData.physicalCapacity || 25000,
      officialCapacity2027: null,
      safetyFactor: 0.85,
      onlineQuotaPercentage: 50,
      vipQuotaPercentage: 20,
      generalTicketPrice: 0,
      vipTicketPrice: 150,
      status: 'ACTIVE',
      ...newGhatData
    };

    ghats.push(newGhat);

    localStorage.setItem(
      STORAGE_KEYS.GHATS,
      JSON.stringify(ghats)
    );

    return newGhat;
  }

  // =========================================================
  // SLOTS MANAGEMENT
  // =========================================================

  getSlots(ghatId, date = '2027-08-15') {
    const key = `${STORAGE_KEYS.SLOTS}_${ghatId}_${date}`;

    const stored = localStorage.getItem(key);

    if (stored) {
      return JSON.parse(stored);
    }

    const initialSlots = INITIAL_DEMO_SLOTS(ghatId);

    localStorage.setItem(
      key,
      JSON.stringify(initialSlots)
    );

    return initialSlots;
  }

  getSlotById(
    ghatId,
    slotId,
    date = '2027-08-15'
  ) {
    const slots = this.getSlots(ghatId, date);

    return slots.find(s => s.id === slotId) || null;
  }

  // =========================================================
  // BOOKING ENGINE
  // =========================================================

  createBooking({
    ghatId,
    slotId,
    date,
    timeSlot,
    ticketType,
    leadPilgrim,
    familyMembers = []
  }) {
    const ghat = this.getGhatById(ghatId);

    if (!ghat) {
      throw new Error('Invalid Ghat selected');
    }

    const slots = this.getSlots(ghatId, date);

    const slotIndex = slots.findIndex(
      s => s.id === slotId
    );

    if (slotIndex === -1) {
      throw new Error('Invalid Time Slot selected');
    }

    const slot = slots[slotIndex];

    const totalPilgrims =
      1 + familyMembers.length;

    // Check remaining capacity
    if (
      slot.remainingOnlineCapacity <
      totalPilgrims
    ) {
      throw new Error(
        `Insufficient capacity in selected slot. Only ${slot.remainingOnlineCapacity} passes remaining.`
      );
    }

    // Check VIP quota
    if (
      ticketType === 'VIP' &&
      (slot.vipQuota - slot.bookedVIP) <
        totalPilgrims
    ) {
      throw new Error(
        'VIP quota exhausted for this slot. Please select General pass or another slot.'
      );
    }

    // Pricing
    const pricePerPilgrim =
      ticketType === 'VIP'
        ? ghat.vipTicketPrice
        : ghat.generalTicketPrice;

    const totalPrice =
      pricePerPilgrim * totalPilgrims;

    // Unique booking ID
    const bookingId = `PUSH-2027-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    const newBooking = {
      id: bookingId,
      ghatId,
      ghatName: ghat.name,
      slotId,
      date,
      timeSlot,
      ticketType,
      totalPrice,

      leadPilgrim: {
        ...leadPilgrim,
        aadhaarNumber: maskAadhaar(
          leadPilgrim.aadhaarNumber
        )
      },

      familyMembers: familyMembers.map(m => ({
        ...m,
        aadhaarNumber: maskAadhaar(
          m.aadhaarNumber
        )
      })),

      totalPilgrims,
      bookingStatus: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };

    // Update slot counts
    if (ticketType === 'VIP') {
      slot.bookedVIP += totalPilgrims;
    } else {
      slot.bookedGeneral += totalPilgrims;
    }

    slot.totalBooked += totalPilgrims;

    slot.remainingOnlineCapacity = Math.max(
      0,
      slot.maxOnlineQuota - slot.totalBooked
    );

    slot.occupancyPercentage = Math.min(
      100,
      Math.round(
        (slot.totalBooked /
          slot.maxOnlineQuota) *
          100
      )
    );

    if (slot.occupancyPercentage >= 100) {
      slot.status = 'FULL';
    } else if (
      slot.occupancyPercentage >= 80
    ) {
      slot.status = 'NEAR_CAPACITY';
    }

    slots[slotIndex] = slot;

    localStorage.setItem(
      `${STORAGE_KEYS.SLOTS}_${ghatId}_${date}`,
      JSON.stringify(slots)
    );

    // Save booking
    const bookings = this.getBookings();

    bookings.unshift(newBooking);

    localStorage.setItem(
      STORAGE_KEYS.BOOKINGS,
      JSON.stringify(bookings)
    );

    // Update crowd
    ghat.currentCrowd =
      (ghat.currentCrowd || 0) +
      totalPilgrims;

    this.updateGhat(ghatId, {
      currentCrowd: ghat.currentCrowd
    });

    return newBooking;
  }

  getBookings() {
    try {
      const data = localStorage.getItem(
        STORAGE_KEYS.BOOKINGS
      );

      return data
        ? JSON.parse(data)
        : INITIAL_BOOKINGS;
    } catch (e) {
      return INITIAL_BOOKINGS;
    }
  }

  getBookingById(id) {
    const bookings = this.getBookings();

    return (
      bookings.find(b => b.id === id) ||
      null
    );
  }

  cancelBooking(bookingId) {
    const bookings = this.getBookings();

    const booking = bookings.find(
      b => b.id === bookingId
    );

    if (!booking) {
      return false;
    }

    booking.bookingStatus = 'CANCELLED';

    localStorage.setItem(
      STORAGE_KEYS.BOOKINGS,
      JSON.stringify(bookings)
    );

    return true;
  }

  // =========================================================
  // MISSING PERSONS & SAFETY ENGINE
  // =========================================================

  getMissingCases() {
    try {
      const data = localStorage.getItem(
        STORAGE_KEYS.MISSING_CASES
      );

      return data
        ? JSON.parse(data)
        : INITIAL_MISSING_CASES;
    } catch (e) {
      return INITIAL_MISSING_CASES;
    }
  }

  getMissingCaseById(caseId) {
    const cases = this.getMissingCases();

    return (
      cases.find(c => c.caseId === caseId) ||
      null
    );
  }

  // =========================================================
  // CREATE MISSING PERSON CASE
  // =========================================================

  createMissingCase(reportData) {
    const caseId = `MP-2027-${Math.floor(
      10000 + Math.random() * 90000
    )}`;

    const newCase = {
      caseId,

      personName: reportData.personName,

      age: parseInt(reportData.age, 10),

      gender: reportData.gender,

      relationship: reportData.relationship,

      lastSeenGhatId:
        reportData.lastSeenGhatId,

      lastSeenGhatName:
        reportData.lastSeenGhatName,

      lastKnownLocation:
        reportData.lastKnownLocation,

      lastSeenTime:
        reportData.lastSeenTime,

      clothingDescription:
        reportData.clothingDescription,

      identifyingFeatures:
        reportData.identifyingFeatures,

      // PERSON PHOTO
      photoUrl:
        reportData.photoUrl ||
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',

      reporter: {
        fullName:
          reportData.reporterName,

        phone:
          reportData.reporterPhone,

        bookingId:
          reportData.bookingId || '',

        aadhaarNumber: maskAadhaar(
          reportData.reporterAadhaar || ''
        )
      },

      status: 'PENDING_VERIFICATION',

      priority: 'HIGH',

      sightings: [],

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString()
    };

    // Save case
    const cases = this.getMissingCases();

    cases.unshift(newCase);

    localStorage.setItem(
      STORAGE_KEYS.MISSING_CASES,
      JSON.stringify(cases)
    );

    // =====================================================
    // ADMIN ALERT WITH PERSON PHOTO
    // =====================================================

    this.addNotification({
      title: '🚨 NEW MISSING PERSON REPORT',

      message:
        `New case ${caseId} ` +
        `(${newCase.personName}, age ${newCase.age}) ` +
        `reported at ${newCase.lastSeenGhatName}. ` +
        `Verification required.`,

      photoUrl: newCase.photoUrl,

      type: 'CRITICAL'
    });

    return newCase;
  }

  // =========================================================
  // UPDATE MISSING CASE STATUS
  // =========================================================

  updateCaseStatus(caseId, status) {
    const cases = this.getMissingCases();

    const caseIndex = cases.findIndex(
      c => c.caseId === caseId
    );

    if (caseIndex !== -1) {
      cases[caseIndex].status = status;

      cases[caseIndex].updatedAt =
        new Date().toISOString();

      localStorage.setItem(
        STORAGE_KEYS.MISSING_CASES,
        JSON.stringify(cases)
      );

      // =====================================================
      // ALERT BROADCAST
      // =====================================================

      if (status === 'ALERT_BROADCASTED') {
        this.addNotification({
          title:
            `🚨 ALERT BROADCAST: ` +
            `${cases[caseIndex].personName}`,

          message:
            `Official alert broadcasted for ` +
            `${cases[caseIndex].personName} ` +
            `(Age ${cases[caseIndex].age}) ` +
            `last seen at ` +
            `${cases[caseIndex].lastSeenGhatName}.`,

          // PERSON PHOTO
          photoUrl:
            cases[caseIndex].photoUrl,

          type: 'CRITICAL'
        });
      }

      // =====================================================
      // PERSON FOUND / REUNITED
      // =====================================================

      else if (
        status === 'REUNITED' ||
        status === 'PERSON_FOUND'
      ) {
        this.addNotification({
          title:
            `✅ REUNITED: ` +
            `${cases[caseIndex].personName}`,

          message:
            `Pilgrim ` +
            `${cases[caseIndex].personName} ` +
            `(Case ${caseId}) ` +
            `successfully verified and reunited with family!`,

          // Keep photo in notification
          photoUrl:
            cases[caseIndex].photoUrl,

          type: 'SUCCESS'
        });
      }

      return cases[caseIndex];
    }

    return null;
  }

  // =========================================================
  // ADD SIGHTING
  // =========================================================

  addSighting(caseId, sightingData) {
    const cases = this.getMissingCases();

    const c = cases.find(
      item => item.caseId === caseId
    );

    if (c) {
      const newSighting = {
        sightingId:
          `ST-${Date.now()
            .toString()
            .slice(-4)}`,

        reportedAt:
          new Date().toISOString(),

        ghatId:
          sightingData.ghatId,

        locationDetails:
          sightingData.locationDetails,

        description:
          sightingData.description,

        photoUrl:
          sightingData.photoUrl || '',

        reportedByStaff:
          Boolean(
            sightingData.reportedByStaff
          )
      };

      c.sightings.push(newSighting);

      if (
        c.status === 'ALERT_BROADCASTED' ||
        c.status === 'VERIFIED'
      ) {
        c.status = 'POSSIBLE_SIGHTING';
      }

      c.updatedAt =
        new Date().toISOString();

      localStorage.setItem(
        STORAGE_KEYS.MISSING_CASES,
        JSON.stringify(cases)
      );

      // =====================================================
      // SIGHTING NOTIFICATION
      // =====================================================

      this.addNotification({
        title: '🔎 POSSIBLE SIGHTING REPORTED',

        message:
          `New sighting logged for Case ` +
          `${caseId} (${c.personName}) ` +
          `at ${sightingData.locationDetails}.`,

        // Use sighting photo if available,
        // otherwise use missing person's photo
        photoUrl:
          sightingData.photoUrl ||
          c.photoUrl ||
          '',

        type: 'INFO'
      });

      return newSighting;
    }

    return null;
  }

  // =========================================================
  // NOTIFICATIONS SYSTEM
  // =========================================================

  getNotifications() {
    try {
      const data = localStorage.getItem(
        STORAGE_KEYS.NOTIFICATIONS
      );

      return data
        ? JSON.parse(data)
        : [];
    } catch (e) {
      return [];
    }
  }

  // =========================================================
  // ADD NOTIFICATION WITH PHOTO SUPPORT
  // =========================================================

  addNotification({
    title,
    message,
    type = 'INFO',
    photoUrl = ''
  }) {
    const notifs =
      this.getNotifications();

    const newNotif = {
      id:
        `N-${Date.now()
          .toString()
          .slice(-4)}`,

      title,

      message,

      type,

      // IMPORTANT:
      // Save photo URL inside notification
      photoUrl: photoUrl || '',

      timestamp:
        new Date().toISOString(),

      read: false
    };

    notifs.unshift(newNotif);

    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(notifs)
    );

    return newNotif;
  }

  // =========================================================
  // MARK NOTIFICATION AS READ
  // =========================================================

  markNotificationAsRead(notificationId) {
    const notifications =
      this.getNotifications();

    const notification =
      notifications.find(
        n => n.id === notificationId
      );

    if (!notification) {
      return false;
    }

    notification.read = true;

    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(notifications)
    );

    return true;
  }

  // =========================================================
  // MARK ALL NOTIFICATIONS AS READ
  // =========================================================

  markAllNotificationsAsRead() {
    const notifications =
      this.getNotifications();

    notifications.forEach(
      notification => {
        notification.read = true;
      }
    );

    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(notifications)
    );

    return true;
  }

  // =========================================================
  // DELETE NOTIFICATION
  // =========================================================

  deleteNotification(notificationId) {
    const notifications =
      this.getNotifications();

    const filtered =
      notifications.filter(
        n => n.id !== notificationId
      );

    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(filtered)
    );

    return true;
  }

  // =========================================================
  // ADMIN ANALYTICS SUMMARY
  // =========================================================

  getAdminSummary() {
    const ghats =
      this.getGhats();

    const bookings =
      this.getBookings();

    const missingCases =
      this.getMissingCases();

    const totalGhats =
      ghats.length;

    const activeGhats =
      ghats.filter(
        g => g.status === 'ACTIVE'
      ).length;

    let totalVisitorsBooked = 0;

    let totalVIPBookings = 0;

    bookings.forEach(b => {
      if (
        b.bookingStatus === 'CONFIRMED'
      ) {
        totalVisitorsBooked +=
          b.totalPilgrims;

        if (
          b.ticketType === 'VIP'
        ) {
          totalVIPBookings +=
            b.totalPilgrims;
        }
      }
    });

    const activeMissingCases =
      missingCases.filter(
        c =>
          c.status !== 'REUNITED' &&
          c.status !== 'CLOSED'
      ).length;

    const pendingVerification =
      missingCases.filter(
        c =>
          c.status ===
          'PENDING_VERIFICATION'
      ).length;

    const reunitedCount =
      missingCases.filter(
        c =>
          c.status === 'REUNITED'
      ).length;

    const highCrowdGhats =
      ghats.filter(g => {
        const occPct =
          (g.currentCrowd /
            g.physicalCapacity) *
          100;

        return occPct >= 70;
      }).length;

    return {
      totalGhats,

      activeGhats,

      totalBookings:
        bookings.length,

      totalVisitorsBooked,

      totalVIPBookings,

      activeMissingCases,

      pendingVerification,

      reunitedCount,

      highCrowdGhats
    };
  }
}

// =========================================================
// AADHAAR MASKING
// =========================================================

function maskAadhaar(
  aadhaarStr = ''
) {
  const clean =
    aadhaarStr.replace(/\D/g, '');

  if (clean.length >= 4) {
    return `XXXX-XXXX-${clean.slice(-4)}`;
  }

  return 'XXXX-XXXX-1234';
}

// =========================================================
// EXPORT SERVICE
// =========================================================

export const dbService =
  new DBService();



/*import { INITIAL_GHATS, INITIAL_DEMO_SLOTS, INITIAL_BOOKINGS, INITIAL_MISSING_CASES } from '../data/initialData';

const STORAGE_KEYS = {
  GHATS: 'godavari_seva_ghats_v1',
  SLOTS: 'godavari_seva_slots_v1',
  BOOKINGS: 'godavari_seva_bookings_v1',
  MISSING_CASES: 'godavari_seva_missing_cases_v1',
  NOTIFICATIONS: 'godavari_seva_notifications_v1',
  ADMIN_SETTINGS: 'godavari_seva_admin_settings_v1'
};

class DBService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.GHATS)) {
      localStorage.setItem(STORAGE_KEYS.GHATS, JSON.stringify(INITIAL_GHATS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MISSING_CASES)) {
      localStorage.setItem(STORAGE_KEYS.MISSING_CASES, JSON.stringify(INITIAL_MISSING_CASES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      const initialNotifs = [
        {
          id: 'N-101',
          title: 'Missing Person Broadcast',
          message: 'Case MP-2027-10482 (Subba Rao K, age 68) last seen near Pushkar Ghat.',
          type: 'CRITICAL',
          timestamp: new Date().toISOString(),
          read: false
        },
        {
          id: 'N-102',
          title: '⚠️ High Crowd Alert',
          message: 'Pushkar Ghat occupancy reached 85%. Online slots nearing capacity.',
          type: 'WARNING',
          timestamp: new Date().toISOString(),
          read: false
        }
      ];
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifs));
    }
  }

  // --- GHATS MANAGEMENT ---
  getGhats() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GHATS);
      return data ? JSON.parse(data) : INITIAL_GHATS;
    } catch (e) {
      console.error('Error reading ghats:', e);
      return INITIAL_GHATS;
    }
  }

  getGhatById(id) {
    const ghats = this.getGhats();
    return ghats.find(g => g.id === id) || null;
  }

  updateGhat(id, updatedFields) {
    const ghats = this.getGhats();
    const index = ghats.findIndex(g => g.id === id);
    if (index !== -1) {
      ghats[index] = { ...ghats[index], ...updatedFields };
      localStorage.setItem(STORAGE_KEYS.GHATS, JSON.stringify(ghats));
      return ghats[index];
    }
    return null;
  }

  addGhat(newGhatData) {
    const ghats = this.getGhats();
    const newGhat = {
      id: newGhatData.id || `ghat-${Date.now()}`,
      historicalCapacity2015: 20000,
      historicalPopularity: 70,
      prototypeCapacity2027: newGhatData.physicalCapacity || 25000,
      officialCapacity2027: null,
      safetyFactor: 0.85,
      onlineQuotaPercentage: 50,
      vipQuotaPercentage: 20,
      generalTicketPrice: 0,
      vipTicketPrice: 150,
      status: 'ACTIVE',
      ...newGhatData
    };
    ghats.push(newGhat);
    localStorage.setItem(STORAGE_KEYS.GHATS, JSON.stringify(ghats));
    return newGhat;
  }

  // --- SLOTS MANAGEMENT ---
  getSlots(ghatId, date = '2027-08-15') {
    const key = `${STORAGE_KEYS.SLOTS}_${ghatId}_${date}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    // Generate initial demo slots if not present
    const initialSlots = INITIAL_DEMO_SLOTS(ghatId);
    localStorage.setItem(key, JSON.stringify(initialSlots));
    return initialSlots;
  }

  getSlotById(ghatId, slotId, date = '2027-08-15') {
    const slots = this.getSlots(ghatId, date);
    return slots.find(s => s.id === slotId) || null;
  }

  // --- BOOKING ENGINE ---
  createBooking({ ghatId, slotId, date, timeSlot, ticketType, leadPilgrim, familyMembers = [] }) {
    const ghat = this.getGhatById(ghatId);
    if (!ghat) throw new Error('Invalid Ghat selected');

    const slots = this.getSlots(ghatId, date);
    const slotIndex = slots.findIndex(s => s.id === slotId);
    if (slotIndex === -1) throw new Error('Invalid Time Slot selected');

    const slot = slots[slotIndex];
    const totalPilgrims = 1 + familyMembers.length;

    // Check remaining capacity
    if (slot.remainingOnlineCapacity < totalPilgrims) {
      throw new Error(`Insufficient capacity in selected slot. Only ${slot.remainingOnlineCapacity} passes remaining.`);
    }

    // Check VIP quota specifically
    if (ticketType === 'VIP' && (slot.vipQuota - slot.bookedVIP) < totalPilgrims) {
      throw new Error(`VIP quota exhausted for this slot. Please select General pass or another slot.`);
    }

    // Pricing calculation
    const pricePerPilgrim = ticketType === 'VIP' ? ghat.vipTicketPrice : ghat.generalTicketPrice;
    const totalPrice = pricePerPilgrim * totalPilgrims;

    // Unique Booking ID
    const bookingId = `PUSH-2027-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newBooking = {
      id: bookingId,
      ghatId,
      ghatName: ghat.name,
      slotId,
      date,
      timeSlot,
      ticketType,
      totalPrice,
      leadPilgrim: {
        ...leadPilgrim,
        aadhaarNumber: maskAadhaar(leadPilgrim.aadhaarNumber)
      },
      familyMembers: familyMembers.map(m => ({
        ...m,
        aadhaarNumber: maskAadhaar(m.aadhaarNumber)
      })),
      totalPilgrims,
      bookingStatus: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };

    // Update slot booking counts
    if (ticketType === 'VIP') {
      slot.bookedVIP += totalPilgrims;
    } else {
      slot.bookedGeneral += totalPilgrims;
    }
    slot.totalBooked += totalPilgrims;
    slot.remainingOnlineCapacity = Math.max(0, slot.maxOnlineQuota - slot.totalBooked);
    slot.occupancyPercentage = Math.min(100, Math.round((slot.totalBooked / slot.maxOnlineQuota) * 100));
    
    if (slot.occupancyPercentage >= 100) slot.status = 'FULL';
    else if (slot.occupancyPercentage >= 80) slot.status = 'NEAR_CAPACITY';

    slots[slotIndex] = slot;
    localStorage.setItem(`${STORAGE_KEYS.SLOTS}_${ghatId}_${date}`, JSON.stringify(slots));

    // Save booking
    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    // Update Ghat live crowd simulation slightly
    ghat.currentCrowd = (ghat.currentCrowd || 0) + totalPilgrims;
    this.updateGhat(ghatId, { currentCrowd: ghat.currentCrowd });

    return newBooking;
  }

  getBookings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return data ? JSON.parse(data) : INITIAL_BOOKINGS;
    } catch (e) {
      return INITIAL_BOOKINGS;
    }
  }

  getBookingById(id) {
    const bookings = this.getBookings();
    return bookings.find(b => b.id === id) || null;
  }

  cancelBooking(bookingId) {
    const bookings = this.getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return false;

    booking.bookingStatus = 'CANCELLED';
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return true;
  }

  // --- MISSING PERSONS & SAFETY ENGINE ---
  getMissingCases() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MISSING_CASES);
      return data ? JSON.parse(data) : INITIAL_MISSING_CASES;
    } catch (e) {
      return INITIAL_MISSING_CASES;
    }
  }

  getMissingCaseById(caseId) {
    const cases = this.getMissingCases();
    return cases.find(c => c.caseId === caseId) || null;
  }

  createMissingCase(reportData) {
    const caseId = `MP-2027-${Math.floor(10000 + Math.random() * 90000)}`;
    const newCase = {
      caseId,
      personName: reportData.personName,
      age: parseInt(reportData.age, 10),
      gender: reportData.gender,
      relationship: reportData.relationship,
      lastSeenGhatId: reportData.lastSeenGhatId,
      lastSeenGhatName: reportData.lastSeenGhatName,
      lastKnownLocation: reportData.lastKnownLocation,
      lastSeenTime: reportData.lastSeenTime,
      clothingDescription: reportData.clothingDescription,
      identifyingFeatures: reportData.identifyingFeatures,
      photoUrl: reportData.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      
      reporter: {
        fullName: reportData.reporterName,
        phone: reportData.reporterPhone,
        bookingId: reportData.bookingId || '',
        aadhaarNumber: maskAadhaar(reportData.reporterAadhaar || '')
      },

      status: 'PENDING_VERIFICATION',
      priority: 'HIGH',
      sightings: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const cases = this.getMissingCases();
    cases.unshift(newCase);
    localStorage.setItem(STORAGE_KEYS.MISSING_CASES, JSON.stringify(cases));

    // Send admin alert
    this.addNotification({
      title: ' New Missing Person Report',
      message: `New case ${caseId} (${newCase.personName}, age ${newCase.age}) reported at ${newCase.lastSeenGhatName}. Verification required.`,
      type: 'CRITICAL'
    });

    return newCase;
  }

  updateCaseStatus(caseId, status) {
    const cases = this.getMissingCases();
    const caseIndex = cases.findIndex(c => c.caseId === caseId);
    if (caseIndex !== -1) {
      cases[caseIndex].status = status;
      cases[caseIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.MISSING_CASES, JSON.stringify(cases));

      // Broadcast notification
      if (status === 'ALERT_BROADCASTED') {
        this.addNotification({
  title: `🚨 ALERT BROADCAST: ${cases[caseIndex].personName}`,
  message: `Official alert broadcasted for ${cases[caseIndex].personName} (Age ${cases[caseIndex].age}) last seen at ${cases[caseIndex].lastSeenGhatName}.`,
  photoUrl: cases[caseIndex].photoUrl,
  type: 'CRITICAL'
});
      } else if (status === 'REUNITED' || status === 'PERSON_FOUND') {
        this.addNotification({
          title: `✅ REUNITED: ${cases[caseIndex].personName}`,
          message: `Pilgrim ${cases[caseIndex].personName} (Case ${caseId}) successfully verified and reunited with family!`,
          type: 'SUCCESS'
        });
      }

      return cases[caseIndex];
    }
    return null;
  }

  addSighting(caseId, sightingData) {
    const cases = this.getMissingCases();
    const c = cases.find(item => item.caseId === caseId);
    if (c) {
      const newSighting = {
        sightingId: `ST-${Date.now().toString().slice(-4)}`,
        reportedAt: new Date().toISOString(),
        ghatId: sightingData.ghatId,
        locationDetails: sightingData.locationDetails,
        description: sightingData.description,
        photoUrl: sightingData.photoUrl || '',
        reportedByStaff: Boolean(sightingData.reportedByStaff)
      };
      c.sightings.push(newSighting);
      if (c.status === 'ALERT_BROADCASTED' || c.status === 'VERIFIED') {
        c.status = 'POSSIBLE_SIGHTING';
      }
      c.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.MISSING_CASES, JSON.stringify(cases));

      this.addNotification({
        title: ' Possible Sighting Reported',
        message: `New sighting logged for Case ${caseId} (${c.personName}) at ${sightingData.locationDetails}.`,
        type: 'INFO'
      });

      return newSighting;
    }
    return null;
  }

  // --- NOTIFICATIONS SYSTEM ---
  getNotifications() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  addNotification({ title, message, type = 'INFO' }) {
    const notifs = this.getNotifications();
    const newNotif = {
      id: `N-${Date.now().toString().slice(-4)}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    notifs.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    return newNotif;
  }

  // --- ADMIN ANALYTICS SUMMARY ---
  getAdminSummary() {
    const ghats = this.getGhats();
    const bookings = this.getBookings();
    const missingCases = this.getMissingCases();

    const totalGhats = ghats.length;
    const activeGhats = ghats.filter(g => g.status === 'ACTIVE').length;
    
    let totalVisitorsBooked = 0;
    let totalVIPBookings = 0;
    bookings.forEach(b => {
      if (b.bookingStatus === 'CONFIRMED') {
        totalVisitorsBooked += b.totalPilgrims;
        if (b.ticketType === 'VIP') totalVIPBookings += b.totalPilgrims;
      }
    });

    const activeMissingCases = missingCases.filter(c => c.status !== 'REUNITED' && c.status !== 'CLOSED').length;
    const pendingVerification = missingCases.filter(c => c.status === 'PENDING_VERIFICATION').length;
    const reunitedCount = missingCases.filter(c => c.status === 'REUNITED').length;

    const highCrowdGhats = ghats.filter(g => {
      const occPct = (g.currentCrowd / g.physicalCapacity) * 100;
      return occPct >= 70;
    }).length;

    return {
      totalGhats,
      activeGhats,
      totalBookings: bookings.length,
      totalVisitorsBooked,
      totalVIPBookings,
      activeMissingCases,
      pendingVerification,
      reunitedCount,
      highCrowdGhats
    };
  }
}

function maskAadhaar(aadhaarStr = '') {
  const clean = aadhaarStr.replace(/\D/g, '');
  if (clean.length >= 4) {
    return `XXXX-XXXX-${clean.slice(-4)}`;
  }
  return 'XXXX-XXXX-1234';
}

export const dbService = new DBService();*/
