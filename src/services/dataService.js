import { INITIAL_GHATS } from '../data/initialGhats';
import { INITIAL_SLOTS } from '../data/initialSlots';
import { INITIAL_BOOKINGS } from '../data/initialBookings';
import { INITIAL_MISSING_PERSONS } from '../data/initialMissingPersons';

const STORAGE_KEYS = {
  GHATS: 'godavari_seva_ghats_v1',
  SLOTS: 'godavari_seva_slots_v1',
  BOOKINGS: 'godavari_seva_bookings_v1',
  MISSING_PERSONS: 'godavari_seva_missing_persons_v1',
  ANNOUNCEMENTS: 'godavari_seva_announcements_v1',
  NOTIFICATIONS: 'godavari_seva_notifications_v1'
};


/* =========================================================
   LOAD INITIAL DATA
========================================================= */

export const loadInitialData = () => {

  if (!localStorage.getItem(STORAGE_KEYS.GHATS)) {
    localStorage.setItem(
      STORAGE_KEYS.GHATS,
      JSON.stringify(INITIAL_GHATS)
    );
  }

  if (!localStorage.getItem(STORAGE_KEYS.SLOTS)) {
    localStorage.setItem(
      STORAGE_KEYS.SLOTS,
      JSON.stringify(INITIAL_SLOTS)
    );
  }

  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(
      STORAGE_KEYS.BOOKINGS,
      JSON.stringify(INITIAL_BOOKINGS)
    );
  }

  if (!localStorage.getItem(STORAGE_KEYS.MISSING_PERSONS)) {
    localStorage.setItem(
      STORAGE_KEYS.MISSING_PERSONS,
      JSON.stringify(INITIAL_MISSING_PERSONS)
    );
  }

  if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
    localStorage.setItem(
      STORAGE_KEYS.ANNOUNCEMENTS,
      JSON.stringify([
        {
          id: "A-1",
          title: "Heavy Crowds expected at Pushkar Ghat between 06:00-08:00 AM",
          priority: "HIGH",
          timestamp: "2027-07-15T06:00:00Z"
        },
        {
          id: "A-2",
          title: "Saraswati Ghat has open VIP slots & 100% wheelchair ramp access",
          priority: "INFO",
          timestamp: "2027-07-15T07:15:00Z"
        }
      ])
    );
  }

  /* ---------------------------------------------------------
     NOTIFICATIONS
  --------------------------------------------------------- */

  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify([])
    );
  }
};


/* =========================================================
   DATA SERVICE
========================================================= */

export const dataService = {

  /* =======================================================
     GHATS
  ======================================================= */

  getGhats: () =>
    JSON.parse(
      localStorage.getItem(STORAGE_KEYS.GHATS) || '[]'
    ),

  saveGhat: (updatedGhat) => {

    const ghats = dataService.getGhats();

    const idx = ghats.findIndex(
      g => g.id === updatedGhat.id
    );

    if (idx >= 0) {
      ghats[idx] = updatedGhat;
    } else {
      ghats.push(updatedGhat);
    }

    localStorage.setItem(
      STORAGE_KEYS.GHATS,
      JSON.stringify(ghats)
    );

    return ghats;
  },


  /* =======================================================
     SLOTS
  ======================================================= */

  getSlots: () =>
    JSON.parse(
      localStorage.getItem(STORAGE_KEYS.SLOTS) || '[]'
    ),

  getSlotsByGhat: (ghatId) => {

    const slots = dataService.getSlots();

    return slots.filter(
      s => s.ghatId === ghatId
    );
  },


  /* =======================================================
     BOOKINGS
  ======================================================= */

  getBookings: () =>
    JSON.parse(
      localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]'
    ),

  createBooking: (bookingPayload) => {

    const bookings = dataService.getBookings();
    const slots = dataService.getSlots();

    const slotIdx = slots.findIndex(
      s => s.id === bookingPayload.slotId
    );

    if (slotIdx === -1) {
      throw new Error("Slot not found");
    }

    const targetSlot = slots[slotIdx];

    const count =
      bookingPayload.totalPilgrimsCount;

    if (bookingPayload.ticketType === 'VIP') {

      if (
        targetSlot.vipBookedCount + count >
        targetSlot.vipQuotaTotal
      ) {
        throw new Error(
          "Insufficient VIP quota remaining for this slot"
        );
      }

      targetSlot.vipBookedCount += count;
      targetSlot.vipRemaining -= count;

    } else {

      if (
        targetSlot.generalBookedCount + count >
        targetSlot.generalQuotaTotal
      ) {
        throw new Error(
          "Insufficient General quota remaining for this slot"
        );
      }

      targetSlot.generalBookedCount += count;
      targetSlot.generalRemaining -= count;
    }

    targetSlot.totalBookedCount += count;

    targetSlot.occupancyPercentage =
      Math.round(
        (targetSlot.totalBookedCount /
          targetSlot.onlineAllocatedCapacity) *
          100
      );

    if (targetSlot.occupancyPercentage >= 100) {
      targetSlot.status = "FULL";
    } else if (
      targetSlot.occupancyPercentage >= 80
    ) {
      targetSlot.status = "NEAR_CAPACITY";
    }

    slots[slotIdx] = targetSlot;

    localStorage.setItem(
      STORAGE_KEYS.SLOTS,
      JSON.stringify(slots)
    );

    bookings.unshift(bookingPayload);

    localStorage.setItem(
      STORAGE_KEYS.BOOKINGS,
      JSON.stringify(bookings)
    );

    return bookingPayload;
  },


  cancelBooking: (bookingId) => {

    const bookings = dataService.getBookings();

    const idx = bookings.findIndex(
      b => b.bookingId === bookingId
    );

    if (idx === -1) {
      return false;
    }

    const booking = bookings[idx];

    booking.bookingStatus = "CANCELLED";

    bookings[idx] = booking;

    localStorage.setItem(
      STORAGE_KEYS.BOOKINGS,
      JSON.stringify(bookings)
    );

    const slots = dataService.getSlots();

    const slotIdx = slots.findIndex(
      s => s.id === booking.slotId
    );

    if (slotIdx !== -1) {

      const slot = slots[slotIdx];

      const count =
        booking.totalPilgrimsCount;

      if (booking.ticketType === 'VIP') {

        slot.vipBookedCount =
          Math.max(
            0,
            slot.vipBookedCount - count
          );

        slot.vipRemaining += count;

      } else {

        slot.generalBookedCount =
          Math.max(
            0,
            slot.generalBookedCount - count
          );

        slot.generalRemaining += count;
      }

      slot.totalBookedCount =
        Math.max(
          0,
          slot.totalBookedCount - count
        );

      slot.occupancyPercentage =
        Math.round(
          (slot.totalBookedCount /
            slot.onlineAllocatedCapacity) *
            100
        );

      if (slot.occupancyPercentage < 80) {
        slot.status = "AVAILABLE";
      }

      slots[slotIdx] = slot;

      localStorage.setItem(
        STORAGE_KEYS.SLOTS,
        JSON.stringify(slots)
      );
    }

    return true;
  },


  /* =======================================================
     MISSING PERSONS
  ======================================================= */

  getMissingPersons: () =>
    JSON.parse(
      localStorage.getItem(
        STORAGE_KEYS.MISSING_PERSONS
      ) || '[]'
    ),


  createMissingPerson: (casePayload) => {

    const cases =
      dataService.getMissingPersons();

    /*
      IMPORTANT:
      Make sure photo is stored as "photo".

      Your MissingPersonControl currently uses:
          c.photo

      So we normalize photoUrl/photo here.
    */

    const newCase = {
      ...casePayload,

      photo:
        casePayload.photo ||
        casePayload.photoUrl ||
        '',

      createdAt:
        casePayload.createdAt ||
        new Date().toISOString()
    };

    cases.unshift(newCase);

    localStorage.setItem(
      STORAGE_KEYS.MISSING_PERSONS,
      JSON.stringify(cases)
    );

    /*
      Create notification for ADMIN
      immediately when a missing person is reported.
    */

    dataService.createNotification({

      title: '🚨 New Missing Person Report',

      message:
        `${newCase.personName}, Age ${newCase.age} ` +
        `has been reported missing at ` +
        `${newCase.lastSeenGhatName}.`,

      type: 'CRITICAL',

      caseId: newCase.caseId,

      personName: newCase.personName,

      age: newCase.age,

      photo: newCase.photo,

      status: newCase.status,

      location: newCase.lastSeenGhatName
    });

    return newCase;
  },


  /* =======================================================
     UPDATE MISSING PERSON STATUS
  ======================================================= */

  updateMissingPersonStatus:
    (caseId, newStatus) => {

      const cases =
        dataService.getMissingPersons();

      const idx =
        cases.findIndex(
          c => c.caseId === caseId
        );

      if (idx === -1) {
        return cases;
      }

      cases[idx].status = newStatus;

      cases[idx].updatedAt =
        new Date().toISOString();

      const caseItem = cases[idx];

      localStorage.setItem(
        STORAGE_KEYS.MISSING_PERSONS,
        JSON.stringify(cases)
      );


      /* ---------------------------------------------------
         WHEN ADMIN BROADCASTS ALERT
      --------------------------------------------------- */

      if (newStatus === 'ALERT_BROADCASTED') {

        dataService.createNotification({

          title:
            `🚨 MISSING PERSON ALERT`,

          message:
            `${caseItem.personName}, Age ${caseItem.age} ` +
            `was last seen at ` +
            `${caseItem.lastSeenGhatName}. ` +
            `Please alert nearby staff.`,

          type: 'CRITICAL',

          caseId:
            caseItem.caseId,

          personName:
            caseItem.personName,

          age:
            caseItem.age,

          photo:
            caseItem.photo ||
            caseItem.photoUrl ||
            '',

          status:
            'ALERT_BROADCASTED',

          location:
            caseItem.lastSeenGhatName
        });
      }


      /* ---------------------------------------------------
         WHEN PERSON IS REUNITED
      --------------------------------------------------- */

      if (
        newStatus === 'REUNITED' ||
        newStatus === 'PERSON_FOUND'
      ) {

        dataService.createNotification({

          title:
            `✅ PERSON FOUND: ${caseItem.personName}`,

          message:
            `${caseItem.personName} has been ` +
            `successfully reunited with family.`,

          type: 'SUCCESS',

          caseId:
            caseItem.caseId,

          personName:
            caseItem.personName,

          age:
            caseItem.age,

          photo:
            caseItem.photo ||
            caseItem.photoUrl ||
            '',

          status:
            newStatus,

          location:
            caseItem.lastSeenGhatName
        });
      }

      return cases;
    },


  /* =======================================================
     SIGHTINGS
  ======================================================= */

  addSighting:
    (caseId, sightingPayload) => {

      const cases =
        dataService.getMissingPersons();

      const idx =
        cases.findIndex(
          c => c.caseId === caseId
        );

      if (idx !== -1) {

        if (!cases[idx].sightings) {
          cases[idx].sightings = [];
        }

        cases[idx].sightings.push(
          sightingPayload
        );

        cases[idx].status =
          "POSSIBLE_SIGHTING";

        cases[idx].updatedAt =
          new Date().toISOString();

        localStorage.setItem(
          STORAGE_KEYS.MISSING_PERSONS,
          JSON.stringify(cases)
        );

        const person = cases[idx];

        dataService.createNotification({

          title:
            '👁️ Possible Sighting Reported',

          message:
            `A possible sighting of ` +
            `${person.personName} was reported.`,

          type: 'INFO',

          caseId:
            person.caseId,

          personName:
            person.personName,

          age:
            person.age,

          photo:
            person.photo ||
            person.photoUrl ||
            '',

          status:
            'POSSIBLE_SIGHTING',

          location:
            sightingPayload.locationDetails || ''
        });
      }

      return cases;
    },


  /* =======================================================
     ANNOUNCEMENTS
  ======================================================= */

  getAnnouncements: () =>
    JSON.parse(
      localStorage.getItem(
        STORAGE_KEYS.ANNOUNCEMENTS
      ) || '[]'
    ),


  createAnnouncement: (announcement) => {

    const list =
      dataService.getAnnouncements();

    list.unshift(announcement);

    localStorage.setItem(
      STORAGE_KEYS.ANNOUNCEMENTS,
      JSON.stringify(list)
    );

    return list;
  },


  /* =======================================================
     ADMIN NOTIFICATIONS
  ======================================================= */

  getNotifications: () =>
    JSON.parse(
      localStorage.getItem(
        STORAGE_KEYS.NOTIFICATIONS
      ) || '[]'
    ),


  createNotification: (notification) => {

    const notifications =
      dataService.getNotifications();

    const newNotification = {

      id:
        `N-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 7)}`,

      title:
        notification.title || 'Notification',

      message:
        notification.message || '',

      type:
        notification.type || 'INFO',

      timestamp:
        new Date().toISOString(),

      read: false,

      /*
        THIS IS THE IMPORTANT PART
        The photo travels with the notification.
      */

      photo:
        notification.photo ||
        notification.photoUrl ||
        '',

      caseId:
        notification.caseId || '',

      personName:
        notification.personName || '',

      age:
        notification.age || '',

      status:
        notification.status || '',

      location:
        notification.location || ''
    };

    notifications.unshift(newNotification);

    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(notifications)
    );

    return newNotification;
  },


  /* =======================================================
     MARK NOTIFICATION READ
  ======================================================= */

  markNotificationRead: (notificationId) => {

    const notifications =
      dataService.getNotifications();

    const idx =
      notifications.findIndex(
        n => n.id === notificationId
      );

    if (idx !== -1) {

      notifications[idx].read = true;

      localStorage.setItem(
        STORAGE_KEYS.NOTIFICATIONS,
        JSON.stringify(notifications)
      );
    }

    return notifications;
  }
};

/*import { INITIAL_GHATS } from '../data/initialGhats';
import { INITIAL_SLOTS } from '../data/initialSlots';
import { INITIAL_BOOKINGS } from '../data/initialBookings';
import { INITIAL_MISSING_PERSONS } from '../data/initialMissingPersons';

const STORAGE_KEYS = {
  GHATS: 'godavari_seva_ghats_v1',
  SLOTS: 'godavari_seva_slots_v1',
  BOOKINGS: 'godavari_seva_bookings_v1',
  MISSING_PERSONS: 'godavari_seva_missing_persons_v1',
  ANNOUNCEMENTS: 'godavari_seva_announcements_v1'
};

export const loadInitialData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.GHATS)) {
    localStorage.setItem(STORAGE_KEYS.GHATS, JSON.stringify(INITIAL_GHATS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SLOTS)) {
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(INITIAL_SLOTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MISSING_PERSONS)) {
    localStorage.setItem(STORAGE_KEYS.MISSING_PERSONS, JSON.stringify(INITIAL_MISSING_PERSONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify([
      { id: "A-1", title: "Heavy Crowds expected at Pushkar Ghat between 06:00-08:00 AM", priority: "HIGH", timestamp: "2027-07-15T06:00:00Z" },
      { id: "A-2", title: "Saraswati Ghat has open VIP slots & 100% wheelchair ramp access", priority: "INFO", timestamp: "2027-07-15T07:15:00Z" }
    ]));
  }
};

export const dataService = {
  getGhats: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.GHATS) || '[]'),
  
  saveGhat: (updatedGhat) => {
    const ghats = dataService.getGhats();
    const idx = ghats.findIndex(g => g.id === updatedGhat.id);
    if (idx >= 0) ghats[idx] = updatedGhat;
    else ghats.push(updatedGhat);
    localStorage.setItem(STORAGE_KEYS.GHATS, JSON.stringify(ghats));
    return ghats;
  },

  getSlots: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.SLOTS) || '[]'),

  getSlotsByGhat: (ghatId) => {
    const slots = dataService.getSlots();
    return slots.filter(s => s.ghatId === ghatId);
  },

  getBookings: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]'),

  createBooking: (bookingPayload) => {
    const bookings = dataService.getBookings();
    const slots = dataService.getSlots();
    
    // 1. Find target slot
    const slotIdx = slots.findIndex(s => s.id === bookingPayload.slotId);
    if (slotIdx === -1) throw new Error("Slot not found");

    const targetSlot = slots[slotIdx];
    const count = bookingPayload.totalPilgrimsCount;

    if (bookingPayload.ticketType === 'VIP') {
      if (targetSlot.vipBookedCount + count > targetSlot.vipQuotaTotal) {
        throw new Error("Insufficient VIP quota remaining for this slot");
      }
      targetSlot.vipBookedCount += count;
      targetSlot.vipRemaining -= count;
    } else {
      if (targetSlot.generalBookedCount + count > targetSlot.generalQuotaTotal) {
        throw new Error("Insufficient General quota remaining for this slot");
      }
      targetSlot.generalBookedCount += count;
      targetSlot.generalRemaining -= count;
    }

    targetSlot.totalBookedCount += count;
    targetSlot.occupancyPercentage = Math.round((targetSlot.totalBookedCount / targetSlot.onlineAllocatedCapacity) * 100);
    if (targetSlot.occupancyPercentage >= 100) targetSlot.status = "FULL";
    else if (targetSlot.occupancyPercentage >= 80) targetSlot.status = "NEAR_CAPACITY";

    slots[slotIdx] = targetSlot;
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slots));

    // Save Booking
    bookings.unshift(bookingPayload);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    return bookingPayload;
  },

  cancelBooking: (bookingId) => {
    const bookings = dataService.getBookings();
    const idx = bookings.findIndex(b => b.bookingId === bookingId);
    if (idx === -1) return false;

    const booking = bookings[idx];
    booking.bookingStatus = "CANCELLED";
    bookings[idx] = booking;
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    // Restore slot count
    const slots = dataService.getSlots();
    const slotIdx = slots.findIndex(s => s.id === booking.slotId);
    if (slotIdx !== -1) {
      const slot = slots[slotIdx];
      const count = booking.totalPilgrimsCount;
      if (booking.ticketType === 'VIP') {
        slot.vipBookedCount = Math.max(0, slot.vipBookedCount - count);
        slot.vipRemaining += count;
      } else {
        slot.generalBookedCount = Math.max(0, slot.generalBookedCount - count);
        slot.generalRemaining += count;
      }
      slot.totalBookedCount = Math.max(0, slot.totalBookedCount - count);
      slot.occupancyPercentage = Math.round((slot.totalBookedCount / slot.onlineAllocatedCapacity) * 100);
      if (slot.occupancyPercentage < 80) slot.status = "AVAILABLE";
      slots[slotIdx] = slot;
      localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slots));
    }
    return true;
  },

  getMissingPersons: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.MISSING_PERSONS) || '[]'),

  createMissingPerson: (casePayload) => {
    const cases = dataService.getMissingPersons();
    cases.unshift(casePayload);
    localStorage.setItem(STORAGE_KEYS.MISSING_PERSONS, JSON.stringify(cases));
    return casePayload;
  },

  updateMissingPersonStatus: (caseId, newStatus) => {
    const cases = dataService.getMissingPersons();
    const idx = cases.findIndex(c => c.caseId === caseId);
    if (idx !== -1) {
      cases[idx].status = newStatus;
      localStorage.setItem(STORAGE_KEYS.MISSING_PERSONS, JSON.stringify(cases));
    }
    return cases;
  },

  addSighting: (caseId, sightingPayload) => {
    const cases = dataService.getMissingPersons();
    const idx = cases.findIndex(c => c.caseId === caseId);
    if (idx !== -1) {
      cases[idx].sightings.push(sightingPayload);
      cases[idx].status = "POSSIBLE_SIGHTING";
      localStorage.setItem(STORAGE_KEYS.MISSING_PERSONS, JSON.stringify(cases));
    }
    return cases;
  },

  getAnnouncements: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS) || '[]'),
  
  createAnnouncement: (announcement) => {
    const list = dataService.getAnnouncements();
    list.unshift(announcement);
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(list));
    return list;
  }
};
*/