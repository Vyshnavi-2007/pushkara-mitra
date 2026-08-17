/**
 * Crowd Risk Calculation Engine (Rule-Based Algorithm)
 * Evaluates Ghat Occupancy, Historical Popularity, Peak Hours, and Physical Constraints
 * Returns normalized Risk Score (0-100), Status Level, Color, and Factors Breakdown
 */

export const calculateCrowdRisk = (ghat, currentSlotOccupancyPct = null) => {
  if (!ghat) return { score: 0, level: "LOW", color: "green" };

  // 1. Occupancy Factor (Weight: 40%)
  const occPct = currentSlotOccupancyPct !== null 
    ? currentSlotOccupancyPct 
    : ((ghat.currentCrowd || 0) / (ghat.effectiveCapacity || 1)) * 100;
  
  const occScore = Math.min(100, Math.max(0, occPct));

  // 2. Historical Popularity Factor (Weight: 25%)
  const popScore = ghat.historicalPopularity || 50;

  // 3. Expected Demand Factor (Weight: 20%)
  const demandScore = ghat.expectedDemand || 50;

  // 4. Physical Bottleneck Risk (Entry/Exit difference) (Weight: 15%)
  const entryCap = ghat.entryCapacity || ghat.physicalCapacity;
  const exitCap = ghat.exitCapacity || ghat.physicalCapacity;
  const bottleneckScore = exitCap < entryCap ? 85 : 30;

  // Weighted Risk Score Calculation
  const totalRiskScore = Math.round(
    (occScore * 0.40) +
    (popScore * 0.25) +
    (demandScore * 0.20) +
    (bottleneckScore * 0.15)
  );

  let level = "LOW";
  let statusText = "🟢 Low Crowd Risk";
  let badgeClass = "badge-low";
  let color = "#10B981";

  if (totalRiskScore >= 85) {
    level = "CRITICAL";
    statusText = "⚠️ CRITICAL CROWD RISK";
    badgeClass = "badge-full";
    color = "#EF4444";
  } else if (totalRiskScore >= 70) {
    level = "HIGH";
    statusText = "🔴 HIGH CROWD RISK";
    badgeClass = "badge-high";
    color = "#EF4444";
  } else if (totalRiskScore >= 45) {
    level = "MODERATE";
    statusText = "🟡 MODERATE RISK";
    badgeClass = "badge-med";
    color = "#F59E0B";
  }

  return {
    score: totalRiskScore,
    level,
    statusText,
    badgeClass,
    color,
    factors: [
      { name: "Current Occupancy", score: Math.round(occScore), weight: "40%" },
      { name: "Historical Popularity", score: popScore, weight: "25%" },
      { name: "Expected Pushkaralu Demand", score: demandScore, weight: "20%" },
      { name: "Entry/Exit Flow Safety", score: bottleneckScore, weight: "15%" }
    ]
  };
};
