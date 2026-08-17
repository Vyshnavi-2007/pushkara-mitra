// Generates initial 30-min slots for Pushkaralu demo date (2027-07-15)

const generateSlotsForGhat = (ghatId, effectiveCap) => {
  const onlineCap = Math.floor(effectiveCap * 0.5); // 50% online allocation rule
  const offlineCap = effectiveCap - onlineCap; // 50% offline walk-in buffer
  const vipCap = Math.floor(onlineCap * 0.2); // 20% VIP
  const generalCap = onlineCap - vipCap; // 80% General

  const times = [
    { start: "05:00", end: "05:30", occRatio: 0.4 },
    { start: "05:30", end: "06:00", occRatio: 0.65 },
    { start: "06:00", end: "06:30", occRatio: 0.85 },
    { start: "06:30", end: "07:00", occRatio: 0.92 },
    { start: "07:00", end: "07:30", occRatio: 0.78 },
    { start: "07:30", end: "08:00", occRatio: 0.60 },
    { start: "08:00", end: "08:30", occRatio: 0.55 },
    { start: "08:30", end: "09:00", occRatio: 0.45 },
    { start: "09:00", end: "09:30", occRatio: 0.40 },
    { start: "09:30", end: "10:00", occRatio: 0.35 },
    { start: "16:00", end: "16:30", occRatio: 0.50 },
    { start: "16:30", end: "17:00", occRatio: 0.75 },
    { start: "17:00", end: "17:30", occRatio: 0.95 },
    { start: "17:30", end: "18:00", occRatio: 0.88 },
    { start: "18:00", end: "18:30", occRatio: 0.70 }
  ];

  return times.map((t, idx) => {
    const totalBooked = Math.floor(onlineCap * t.occRatio);
    const vipBooked = Math.floor(totalBooked * 0.2);
    const generalBooked = totalBooked - vipBooked;

    let status = "AVAILABLE";
    const occPct = (totalBooked / onlineCap) * 100;
    if (occPct >= 100) status = "FULL";
    else if (occPct >= 80) status = "NEAR_CAPACITY";

    return {
      id: `${ghatId}-2027-07-15-${t.start.replace(":", "")}`,
      ghatId,
      date: "2027-07-15",
      startTime: t.start,
      endTime: t.end,
      totalEffectiveCapacity: effectiveCap,
      onlineAllocatedCapacity: onlineCap,
      offlineBufferCapacity: offlineCap,
      generalQuotaTotal: generalCap,
      generalBookedCount: generalBooked,
      generalRemaining: generalCap - generalBooked,
      vipQuotaTotal: vipCap,
      vipBookedCount: vipBooked,
      vipRemaining: vipCap - vipBooked,
      totalBookedCount: totalBooked,
      occupancyPercentage: Math.round(occPct),
      status
    };
  });
};

export const INITIAL_SLOTS = [
  ...generateSlotsForGhat("pushkar-ghat", 35000),
  ...generateSlotsForGhat("kotilingala-revu", 27000),
  ...generateSlotsForGhat("saraswati-ghat", 18000),
  ...generateSlotsForGhat("gowthami-ghat", 20000),
  ...generateSlotsForGhat("goshpada-kshetram", 32000),
  ...generateSlotsForGhat("subrahmanyeswara-ghat", 15000),
  ...generateSlotsForGhat("pattiseema-ghat", 19000)
];
