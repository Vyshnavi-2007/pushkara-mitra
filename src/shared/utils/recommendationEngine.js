/**
 * Smart Ghat Recommendation Engine
 * Weighted Formula:
 * Recommendation Score = (Crowd Score * 0.40) + (Accessibility * 0.20) + (Facilities * 0.15) + (Parking * 0.15) + (Distance * 0.10)
 */

export const getSmartRecommendations = (ghats, userPreferences = {}) => {
  const {
    preferWheelchair = false,
    preferParking = false,
    maxCrowdLevel = 100,
    preferredTime = null,
    targetCity = null
  } = userPreferences;

  const scoredGhats = ghats.map(ghat => {
    // 1. Crowd Score (Lower crowd = Higher score)
    const occPct = ((ghat.currentCrowd || 0) / (ghat.effectiveCapacity || 1)) * 100;
    const crowdScore = Math.max(0, 100 - occPct);

    // 2. Accessibility Score
    let accessibilityScore = 50;
    if (ghat.facilities?.wheelchairAccessible) accessibilityScore += 40;
    if (ghat.facilities?.changingRooms) accessibilityScore += 10;

    // 3. Facility Score
    let facilityCount = 0;
    if (ghat.facilities?.medical) facilityCount += 25;
    if (ghat.facilities?.drinkingWater) facilityCount += 25;
    if (ghat.facilities?.toilet) facilityCount += 25;
    if (ghat.facilities?.changingRooms) facilityCount += 25;
    const facilityScore = facilityCount;

    // 4. Parking Score
    const parkingScore = ghat.facilities?.parking ? 100 : 20;

    // 5. Distance Score (Mock default 80 if no user location, or distance calculation)
    const distanceScore = 80;

    // Weighted Formula
    let totalScore = Math.round(
      (crowdScore * 0.40) +
      (accessibilityScore * 0.20) +
      (facilityScore * 0.15) +
      (parkingScore * 0.15) +
      (distanceScore * 0.10)
    );

    // Apply Boosts based on User Preferences
    if (preferWheelchair && ghat.facilities?.wheelchairAccessible) {
      totalScore += 10;
    }
    if (preferParking && ghat.facilities?.parking) {
      totalScore += 10;
    }
    if (targetCity && ghat.city.toLowerCase() === targetCity.toLowerCase()) {
      totalScore += 15;
    }

    const finalScore = Math.min(100, Math.max(0, totalScore));

    // Generate Explainable AI / Rule Card reasons
    const reasons = [];
    if (crowdScore >= 60) reasons.push(`🟢 Low Crowd Density (${Math.round(occPct)}% current occupancy)`);
    if (ghat.facilities?.wheelchairAccessible) reasons.push("♿ 100% Wheelchair & Ramp Accessible");
    if (ghat.facilities?.medical) reasons.push("🏥 On-site Medical Emergency Station");
    if (ghat.facilities?.parking) reasons.push("🚗 Ample Dedicated Parking Lots");

    return {
      ghat,
      score: finalScore,
      crowdPct: Math.round(occPct),
      reasons,
      breakdown: {
        crowdScore: Math.round(crowdScore),
        accessibilityScore,
        facilityScore,
        parkingScore
      }
    };
  });

  // Sort descending by score
  return scoredGhats.sort((a, b) => b.score - a.score);
};
