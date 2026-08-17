import React from 'react';
import { calculateCrowdRisk } from '../../services/crowdRiskEngine';
import { AlertTriangle, CheckCircle, ShieldAlert, Zap } from 'lucide-react';

export function CrowdBadge({ ghat, currentSlotOccupancy = 65, showDetails = false }) {
  const risk = calculateCrowdRisk(ghat, currentSlotOccupancy, true);

  return (
    <div className="inline-flex flex-col">
      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold border shadow-sm ${risk.badgeColor} text-white ${risk.borderStyle}`}>
        {risk.riskLevel === 'LOW' && <CheckCircle className="w-3.5 h-3.5 mr-1" />}
        {risk.riskLevel === 'MEDIUM' && <Zap className="w-3.5 h-3.5 mr-1" />}
        {risk.riskLevel === 'HIGH' && <AlertTriangle className="w-3.5 h-3.5 mr-1" />}
        {risk.riskLevel === 'CRITICAL' && <ShieldAlert className="w-3.5 h-3.5 mr-1 animate-pulse" />}
        <span>{risk.riskLevel} RISK ({risk.riskScore}/100)</span>
      </div>

      {showDetails && (
        <p className="text-[11px] text-slate-400 mt-1 leading-tight">
          Rule-Based Score: {risk.explanation}
        </p>
      )}
    </div>
  );
}
