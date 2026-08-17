// Initial baseline data for GODAVARI SEVA prototype
// Note: Historical 2015 data vs Operational 2027 prototype values are explicitly demarcated.

export const INITIAL_GHATS = [
  {
    id: 'kotilingala-revu',
    name: 'Kotilingala Revu',
    city: 'Rajamahendravaram',
    district: 'East Godavari',
    latitude: 17.0051,
    longitude: 81.7778,

    // Historical Reference (2015)
    historicalCapacity2015: 45000,
    historicalPopularity: 92,

    // Prototype / Operational Setup (2027)
    prototypeCapacity2027: 50000,
    officialCapacity2027: null, // Awaiting official government release

    // Bottleneck Physical & Dynamic Metrics
    physicalCapacity: 50000,
    entryCapacity: 42000,
    exitCapacity: 40000,
    safetyFactor: 0.85,          // 85% safety threshold
    
    // Online Quota & Pass Settings
    onlineQuotaPercentage: 50,    // 50% reserved for online booking to avoid offline queue conflict
    vipQuotaPercentage: 20,       // 20% of online quota for VIP passes
    generalTicketPrice: 0,        // Free general pass
    vipTicketPrice: 50,          // ₹200 for VIP pass

    famousLevel: 'CRITICAL_HUB',
    expectedDemand: 94,
    currentCrowd: 28500,

    parkingAvailable: true,
    medicalAvailable: true,
    toiletAvailable: true,
    drinkingWaterAvailable: true,
    wheelchairAccessible: true,

    operatingHours: '04:00 - 23:00',
    status: 'ACTIVE',
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pushkara_ghat_rajamahendravaram.jpg?width=1200",
    description: 'One of the longest and largest bathing ghats in Asia, equipped with comprehensive pilgrim amenities.'
  },
  {
    id: 'pushkar-ghat',
    name: 'Pushkar Ghat',
    city: 'Rajamahendravaram',
    district: 'East Godavari',
    latitude: 16.9984,
    longitude: 81.7725,

    historicalCapacity2015: 60000,
    historicalPopularity: 98,

    prototypeCapacity2027: 65000,
    officialCapacity2027: null,

    physicalCapacity: 65000,
    entryCapacity: 50000,
    exitCapacity: 45000,
    safetyFactor: 0.80,

    onlineQuotaPercentage: 50,
    vipQuotaPercentage: 25,
    generalTicketPrice: 0,
    vipTicketPrice: 50,

    famousLevel: 'CRITICAL_HUB',
    expectedDemand: 98,
    currentCrowd: 38200,

    parkingAvailable: true,
    medicalAvailable: true,
    toiletAvailable: true,
    drinkingWaterAvailable: true,
    wheelchairAccessible: false,

    operatingHours: '04:00 - 23:00',
    status: 'ACTIVE',
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pushkara_ghat_rajamahendravaram.jpg?width=1200",
    description: 'The primary spiritual epicenter of Godavari Pushkaralu, located near Rajahmundry railway station.'
  },
  {
    id: 'saraswati-ghat',
    name: 'Saraswati Ghat',
    city: 'Rajamahendravaram',
    district: 'East Godavari',
    latitude: 17.0012,
    longitude: 81.7751,

    historicalCapacity2015: 25000,
    historicalPopularity: 82,

    prototypeCapacity2027: 30000,
    officialCapacity2027: null,

    physicalCapacity: 30000,
    entryCapacity: 28000,
    exitCapacity: 26000,
    safetyFactor: 0.85,

    onlineQuotaPercentage: 50,
    vipQuotaPercentage: 15,
    generalTicketPrice: 0,
    vipTicketPrice: 50,

    famousLevel: 'MAJOR',
    expectedDemand: 75,
    currentCrowd: 11400,

    parkingAvailable: true,
    medicalAvailable: true,
    toiletAvailable: true,
    drinkingWaterAvailable: true,
    wheelchairAccessible: true,

    operatingHours: '05:00 - 22:00',
    status: 'ACTIVE',
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pushkara_ghat_rajamahendravaram.jpg?width=1200",
    description: 'A serene ghat preferred by families seeking easy accessibility and medical care.'
  },
  {
    id: 'gowthami-ghat',
    name: 'Gowthami Ghat',
    city: 'Rajamahendravaram',
    district: 'East Godavari',
    latitude: 17.0120,
    longitude: 81.7810,

    historicalCapacity2015: 20000,
    historicalPopularity: 78,

    prototypeCapacity2027: 25000,
    officialCapacity2027: null,

    physicalCapacity: 25000,
    entryCapacity: 22000,
    exitCapacity: 20000,
    safetyFactor: 0.85,

    onlineQuotaPercentage: 50,
    vipQuotaPercentage: 15,
    generalTicketPrice: 0,
    vipTicketPrice: 50,

    famousLevel: 'MAJOR',
    expectedDemand: 70,
    currentCrowd: 7800,

    parkingAvailable: true,
    medicalAvailable: true,
    toiletAvailable: true,
    drinkingWaterAvailable: true,
    wheelchairAccessible: true,

    operatingHours: '05:00 - 22:00',
    status: 'ACTIVE',
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pushkara_ghat_rajamahendravaram.jpg?width=1200",
    description: 'Spacious location near ISKCON temple with ample bus parking and visitor facilities.'
  },
  {
    id: 'tummalapalli-revu',
    name: 'Tummalapalli Vari Revu',
    city: 'Rajamahendravaram',
    district: 'East Godavari',
    latitude: 16.9930,
    longitude: 81.7690,

    historicalCapacity2015: 15000,
    historicalPopularity: 65,

    prototypeCapacity2027: 18000,
    officialCapacity2027: null,

    physicalCapacity: 18000,
    entryCapacity: 16000,
    exitCapacity: 15000,
    safetyFactor: 0.90,

    onlineQuotaPercentage: 50,
    vipQuotaPercentage: 10,
    generalTicketPrice: 0,
    vipTicketPrice: 50,

    famousLevel: 'LOCAL',
    expectedDemand: 60,
    currentCrowd: 4500,

    parkingAvailable: false,
    medicalAvailable: true,
    toiletAvailable: true,
    drinkingWaterAvailable: true,
    wheelchairAccessible: false,

    operatingHours: '05:30 - 21:30',
    status: 'ACTIVE',
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pushkara_ghat_rajamahendravaram.jpg?width=1200",
    description: 'Quiet heritage revu ideal for elderly pilgrims seeking peaceful ritual baths.'
  },
  {
    id: 'goshpada-kshetram',
    name: 'Goshpada Kshetram (Main Kovvur Ghat)',
    city: 'Kovvur',
    district: 'West Godavari',
    latitude: 17.0150,
    longitude: 81.7280,

    historicalCapacity2015: 40000,
    historicalPopularity: 90,

    prototypeCapacity2027: 45000,
    officialCapacity2027: null,

    physicalCapacity: 45000,
    entryCapacity: 40000,
    exitCapacity: 38000,
    safetyFactor: 0.85,

    onlineQuotaPercentage: 50,
    vipQuotaPercentage: 20,
    generalTicketPrice: 0,
    vipTicketPrice: 50,

    famousLevel: 'CRITICAL_HUB',
    expectedDemand: 91,
    currentCrowd: 19800,

    parkingAvailable: true,
    medicalAvailable: true,
    toiletAvailable: true,
    drinkingWaterAvailable: true,
    wheelchairAccessible: true,

    operatingHours: '04:00 - 23:00',
    status: 'ACTIVE',
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pushkara_ghat_rajamahendravaram.jpg?width=1200",
    description: 'Hallowed pilgrimage spot on the western bank of the river Godavari in Kovvur.'
  },
  {
    id: 'subrahmanyeswara-ghat',
    name: 'Subrahmanyeswara Ghat',
    city: 'Kovvur',
    district: 'West Godavari',
    latitude: 17.0180,
    longitude: 81.7310,

    historicalCapacity2015: 18000,
    historicalPopularity: 72,

    prototypeCapacity2027: 22000,
    officialCapacity2027: null,

    physicalCapacity: 22000,
    entryCapacity: 20000,
    exitCapacity: 19000,
    safetyFactor: 0.85,

    onlineQuotaPercentage: 50,
    vipQuotaPercentage: 15,
    generalTicketPrice: 0,
    vipTicketPrice: 50,

    famousLevel: 'MAJOR',
    expectedDemand: 68,
    currentCrowd: 6200,

    parkingAvailable: true,
    medicalAvailable: true,
    toiletAvailable: true,
    drinkingWaterAvailable: true,
    wheelchairAccessible: true,

    operatingHours: '05:00 - 22:00',
    status: 'ACTIVE',
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pushkara_ghat_rajamahendravaram.jpg?width=1200",
    description: 'Well-managed Kovvur ghat equipped with dedicated elder ramps and shaded seating.'
  },
  {
    id: 'pattiseema-ghat',
    name: 'Pattiseema Ghat',
    city: 'Nearby',
    district: 'West Godavari',
    latitude: 17.1500,
    longitude: 81.6167,

    historicalCapacity2015: 30000,
    historicalPopularity: 88,

    prototypeCapacity2027: 35000,
    officialCapacity2027: null,

    physicalCapacity: 35000,
    entryCapacity: 30000,
    exitCapacity: 28000,
    safetyFactor: 0.85,

    onlineQuotaPercentage: 50,
    vipQuotaPercentage: 20,
    generalTicketPrice: 0,
    vipTicketPrice: 50,

    famousLevel: 'MAJOR',
    expectedDemand: 86,
    currentCrowd: 14200,

    parkingAvailable: true,
    medicalAvailable: true,
    toiletAvailable: true,
    drinkingWaterAvailable: true,
    wheelchairAccessible: false,

    operatingHours: '05:00 - 21:00',
    status: 'ACTIVE',
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pushkara_ghat_rajamahendravaram.jpg?width=1200",
    description: 'Scenic island shrine ghat accessible by boats, famous for Sri Veerabhadra Swamy temple.'
  }
];

export const INITIAL_DEMO_SLOTS = (ghatId) => {
  const ghat = INITIAL_GHATS.find(g => g.id === ghatId) || INITIAL_GHATS[0];
  const effectiveCap = Math.floor(Math.min(ghat.physicalCapacity, ghat.entryCapacity, ghat.exitCapacity) * ghat.safetyFactor);
  const maxOnline = Math.floor(effectiveCap * (ghat.onlineQuotaPercentage / 100));
  const vipQuota = Math.floor(maxOnline * (ghat.vipQuotaPercentage / 100));
  const generalQuota = maxOnline - vipQuota;

  const times = [
    { start: '05:00', end: '05:30' },
    { start: '05:30', end: '06:00' },
    { start: '06:00', end: '06:30' },
    { start: '06:30', end: '07:00' },
    { start: '07:00', end: '07:30' },
    { start: '07:30', end: '08:00' },
    { start: '08:00', end: '08:30' },
    { start: '08:30', end: '09:00' },
    { start: '09:00', end: '09:30' },
    { start: '09:30', end: '10:00' },
    { start: '10:00', end: '10:30' },
    { start: '10:30', end: '11:00' },
  ];

  return times.map((t, index) => {
    // Generate realistic initial booking counts
    const occupancyFactor = index === 4 || index === 5 || index === 6 ? 0.85 : (0.3 + (index * 0.05));
    const bookedGeneral = Math.floor(generalQuota * occupancyFactor);
    const bookedVIP = Math.floor(vipQuota * (occupancyFactor * 0.9));
    const totalBooked = bookedGeneral + bookedVIP;
    const occupancyPct = Math.min(100, Math.round((totalBooked / maxOnline) * 100));

    let status = 'AVAILABLE';
    if (occupancyPct >= 100) status = 'FULL';
    else if (occupancyPct >= 80) status = 'NEAR_CAPACITY';

    return {
      id: `${ghatId}-2027-08-15-${t.start.replace(':', '')}`,
      ghatId,
      date: '2027-08-15',
      startTime: t.start,
      endTime: t.end,
      effectiveCapacity: effectiveCap,
      maxOnlineQuota: maxOnline,
      generalQuota,
      vipQuota,
      bookedGeneral,
      bookedVIP,
      totalBooked,
      remainingOnlineCapacity: maxOnline - totalBooked,
      occupancyPercentage: occupancyPct,
      status
    };
  });
};

export const INITIAL_BOOKINGS = [
  {
    id: 'PUSH-2027-AB1001',
    ghatId: 'pushkar-ghat',
    ghatName: 'Pushkar Ghat',
    date: '2027-08-15',
    timeSlot: '07:00 - 07:30',
    ticketType: 'VIP',
    totalPrice: 400,
    leadPilgrim: {
      fullName: 'Ramesh Chandra Rao',
      phone: '9848012345',
      email: 'ramesh.rao@example.com',
      aadhaarNumber: 'XXXX-XXXX-4589',
      city: 'Hyderabad',
      state: 'Telangana'
    },
    familyMembers: [
      { fullName: 'Sunitha Rao', age: 48, gender: 'Female', aadhaarNumber: 'XXXX-XXXX-8821', relation: 'Spouse' },
      { fullName: 'Ananya Rao', age: 21, gender: 'Female', aadhaarNumber: 'XXXX-XXXX-9912', relation: 'Child' }
    ],
    totalPilgrims: 3,
    bookingStatus: 'CONFIRMED',
    createdAt: '2026-08-14T10:30:00.000Z'
  },
  {
    id: 'PUSH-2027-AB1002',
    ghatId: 'kotilingala-revu',
    ghatName: 'Kotilingala Revu',
    date: '2027-08-15',
    timeSlot: '07:30 - 08:00',
    ticketType: 'GENERAL',
    totalPrice: 0,
    leadPilgrim: {
      fullName: 'Venkata Satyanarayana',
      phone: '9989054321',
      email: 'satya.v@example.com',
      aadhaarNumber: 'XXXX-XXXX-1144',
      city: 'Vijayawada',
      state: 'Andhra Pradesh'
    },
    familyMembers: [
      { fullName: 'Lakshmi Satyanarayana', age: 52, gender: 'Female', aadhaarNumber: 'XXXX-XXXX-3366', relation: 'Spouse' }
    ],
    totalPilgrims: 2,
    bookingStatus: 'CONFIRMED',
    createdAt: '2026-08-14T11:15:00.000Z'
  }
];

export const INITIAL_MISSING_CASES = [
  {
    caseId: 'MP-2027-10482',
    personName: 'Subba Rao K',
    age: 68,
    gender: 'Male',
    relationship: 'Father',
    lastSeenGhatId: 'pushkar-ghat',
    lastSeenGhatName: 'Pushkar Ghat',
    lastKnownLocation: 'Near Pillar 4 assistance booth',
    lastSeenTime: '07:15 AM',
    clothingDescription: 'White traditional dhoti, yellow towel over shoulder',
    identifyingFeatures: 'Silver wristwatch on left arm, wears reading glasses',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    
    // Privacy Protected Contact Data
    reporter: {
      fullName: 'Srinivas K',
      phone: '9876543210',
      bookingId: 'PUSH-2027-AB1001',
      aadhaarNumber: 'XXXX-XXXX-9900'
    },

    status: 'ALERT_BROADCASTED',
    priority: 'HIGH',
    sightings: [
      {
        sightingId: 'ST-901',
        reportedAt: '2026-08-14T12:10:00.000Z',
        ghatId: 'saraswati-ghat',
        locationDetails: 'Seated at Saraswati Ghat medical tent rest shade',
        description: 'Elderly gentleman matching description resting with drinking water provided by NGO',
        photoUrl: '',
        reportedByStaff: true
      }
    ],
    createdAt: '2026-08-14T08:00:00.000Z',
    updatedAt: '2026-08-14T12:10:00.000Z'
  }
];
