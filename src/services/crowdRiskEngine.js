// Rule-Based Crowd Risk Engine for GODAVARI SEVA prototype
// Note: Transparently labeled as Rule-Based Prototype Engine (not fake AI).

/**
 * Calculates a Crowd Risk Score (0-100) based on weighted operational parameters
 * @param {Object} ghat - The ghat data object
 * @param {number} currentSlotOccupancy - Occupancy percentage of active slot (0-100)
 * @param {boolean} isPeakHour - Whether current time falls in peak morning/evening hours
 * @returns {Object} { riskScore, riskLevel, badgeColor, textColor, explanation }
 */
export function calculateCrowdRisk(ghat, currentSlotOccupancy = 60, isPeakHour = true) {
  if (!ghat) {
    return { riskScore: 0, riskLevel: 'LOW', badgeColor: 'bg-emerald-500', textColor: 'text-emerald-500', explanation: 'No data' };
  }

  // 1. Historical Popularity Baseline (0-100) -> 25% weight
  const popularityWeight = (ghat.historicalPopularity || 70) * 0.25;

  // 2. Current Slot Occupancy (0-100) -> 35% weight
  const occupancyWeight = Math.min(100, currentSlotOccupancy) * 0.35;

  // 3. Expected Peak Demand (0-100) -> 25% weight
  const demandWeight = (ghat.expectedDemand || 75) * 0.25;

  // 4. Time Bottleneck Factor -> 15% weight
  const timeFactor = isPeakHour ? 15 : 5;

  // Compute final risk score
  const totalScore = Math.min(100, Math.round(popularityWeight + occupancyWeight + demandWeight + timeFactor));

  let riskLevel = 'LOW';
  let badgeColor = 'bg-emerald-500';
  let textColor = 'text-emerald-600';
  let borderStyle = 'border-emerald-300';

  if (totalScore >= 90) {
    riskLevel = 'CRITICAL';
    badgeColor = 'bg-rose-600';
    textColor = 'text-rose-600';
    borderStyle = 'border-rose-400';
  } else if (totalScore >= 80) {
    riskLevel = 'HIGH';
    badgeColor = 'bg-red-500';
    textColor = 'text-red-500';
    borderStyle = 'border-red-300';
  } else if (totalScore >= 55) {
    riskLevel = 'MEDIUM';
    badgeColor = 'bg-amber-500';
    textColor = 'text-amber-600';
    borderStyle = 'border-amber-300';
  }

  return {
    riskScore: totalScore,
    riskLevel,
    badgeColor,
    textColor,
    borderStyle,
    explanation: `Calculated from Historical Popularity (${ghat.historicalPopularity}), Live Slot Occupancy (${currentSlotOccupancy}%), Expected Demand (${ghat.expectedDemand}) & Peak Hour Multiplier.`
  };
}
