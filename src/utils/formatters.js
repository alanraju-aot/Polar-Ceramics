/**
 * formatters.js
 * Utilities for formatting prices, dimensions, and area estimates.
 */

export function formatPrice(amount, unit = 'sq.ft', currency = '₹') {
  if (typeof amount !== 'number') return amount;
  return `${currency}${amount.toLocaleString('en-IN')}${unit ? ` / ${unit}` : ''}`;
}

export function calculateTileEstimate(lengthFt, widthFt, pricePerSqFt, coveragePerBox = 15.5, wastagePercent = 10) {
  const l = parseFloat(lengthFt) || 0;
  const w = parseFloat(widthFt) || 0;
  const baseArea = l * w;
  const wastageMultiplier = 1 + (wastagePercent / 100);
  const totalAreaWithWastage = baseArea * wastageMultiplier;

  const boxesNeeded = coveragePerBox > 0 ? Math.ceil(totalAreaWithWastage / coveragePerBox) : 1;
  const totalBilledArea = coveragePerBox > 0 ? boxesNeeded * coveragePerBox : totalAreaWithWastage;
  const totalMaterialCost = totalBilledArea * pricePerSqFt;

  // Estimated auxiliary costs (Adhesive & Grout ~ ₹18/sq.ft, Skilled Labor ~ ₹32/sq.ft)
  const estimatedAdhesiveGroutCost = totalBilledArea * 18;
  const estimatedLaborCost = totalBilledArea * 32;
  const estimatedTotalProjectCost = totalMaterialCost + estimatedAdhesiveGroutCost + estimatedLaborCost;

  return {
    baseArea: Math.round(baseArea * 10) / 10,
    totalAreaWithWastage: Math.round(totalAreaWithWastage * 10) / 10,
    boxesNeeded,
    totalBilledArea: Math.round(totalBilledArea * 10) / 10,
    totalMaterialCost: Math.round(totalMaterialCost),
    estimatedAdhesiveGroutCost: Math.round(estimatedAdhesiveGroutCost),
    estimatedLaborCost: Math.round(estimatedLaborCost),
    estimatedTotalProjectCost: Math.round(estimatedTotalProjectCost)
  };
}
