// Smart Ghat Recommendation Engine for GODAVARI SEVA prototype
import { calculateCrowdRisk } from './crowdRiskEngine';

/**
 * Recommends best ghats based on user criteria (time, mobility, family, distance, parking)
 * Weighted Formula:
 * Crowd Score (Inverse Risk) : 40%
 * Accessibility               : 20%
 * Facility Matrix             : 15%
 * Parking Availability        : 15%
 * Proximity / Distance        : 10%
 *
 * @param {Array} ghats - List of available ghats
 * @param {Object} userPreferences - { needsWheelchair, needsParking, targetTime, maxDistanceKm }
 * @param {Object} userLocation - { latitude, longitude } optional
 * @returns {Array} List of ghats ranked by recommendation score with transparent explanations
 */
export function getSmartGhatRecommendations(ghats = [], userPreferences = {}, userLocation = null) {
  if (!ghats || ghats.length === 0) return [];

  const ratedGhats = ghats.map((ghat) => {
    // 1. Crowd Score (Inverse of Risk) -> 40%
    const riskData = calculateCrowdRisk(ghat, 55, true);
    const crowdScore = (100 - riskData.riskScore) * 0.40;

    // 2. Accessibility Score -> 20%
    let accessibilityScore = 50;
    if (userPreferences.needsWheelchair) {
      accessibilityScore = ghat.wheelchairAccessible ? 100 : 20;
    } else {
      accessibilityScore = ghat.wheelchairAccessible ? 90 : 70;
    }
    const accessibilityWeighted = accessibilityScore * 0.20;

    // 3. Facility Score (Medical, Toilet, Drinking Water) -> 15%
    let facilityCount = 0;
    if (ghat.medicalAvailable) facilityCount += 35;
    if (ghat.toiletAvailable) facilityCount += 35;
    if (ghat.drinkingWaterAvailable) facilityCount += 30;
    const facilityWeighted = facilityCount * 0.15;

    // 4. Parking Availability -> 15%
    let parkingScore = ghat.parkingAvailable ? 100 : 30;
    if (userPreferences.needsParking && !ghat.parkingAvailable) {
      parkingScore = 10;
    }
    const parkingWeighted = parkingScore * 0.15;

    // 5. Proximity / Distance Score -> 10%
    let distanceKm = 3.5; // Default reference distance
    let proximityScore = 80;
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      distanceKm = calculateHaversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        ghat.latitude,
        ghat.longitude
      );
      // Closer ghat gets higher proximity score
      proximityScore = Math.max(10, Math.min(100, Math.round(100 - (distanceKm * 5))));
    }
    const proximityWeighted = proximityScore * 0.10;

    // Total Recommendation Score (0 - 100)
    const finalScore = Math.min(100, Math.round(
      crowdScore + accessibilityWeighted + facilityWeighted + parkingWeighted + proximityWeighted
    ));

    // Construct human-readable reasoning
    const reasons = [];
    if (riskData.riskScore < 60) reasons.push(`🟢 Low Crowd Congestion (${riskData.riskScore}% risk)`);
    if (ghat.wheelchairAccessible && userPreferences.needsWheelchair) reasons.push('♿ Full Wheelchair & Senior Accessibility');
    if (ghat.parkingAvailable) reasons.push('🅿️ Dedicated Bus & Car Parking');
    if (ghat.medicalAvailable && ghat.drinkingWaterAvailable) reasons.push('🏥 24/7 Medical Post & RO Drinking Water');

    return {
      ghat,
      riskData,
      recommendationScore: finalScore,
      distanceKm: distanceKm.toFixed(1),
      reasons: reasons.length > 0 ? reasons : ['Good overall facilities and slot availability'],
      isTopPick: false
    };
  });

  // Sort descending by score
  ratedGhats.sort((a, b) => b.recommendationScore - a.recommendationScore);

  if (ratedGhats.length > 0) {
    ratedGhats[0].isTopPick = true;
  }

  return ratedGhats;
}

/**
 * Calculates Haversine distance in km between two geo points
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
