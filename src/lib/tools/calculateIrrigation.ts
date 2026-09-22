import { tool } from 'ai';
import { z } from 'zod';
import { IrrigationCalcResult, UrgencyLevel } from '@/types/irrigation';

export const calculateIrrigationInputSchema = z.object({
  currentMoisture: z.number().min(0).max(100).describe('Current soil moisture percentage'),
  targetMoisture: z.number().min(0).max(100).describe('Target optimal moisture percentage for crop and stage'),
  cropWaterRequirement: z.enum(['LOW', 'MEDIUM', 'HIGH', 'FLOODED']).describe('Crop water requirement rating'),
  fieldSizeHectares: z.number().min(0.01).max(500).describe('Field area in hectares (default: 1.5 ha)'),
  temperature: z.number().describe('Ambient temperature in Celsius'),
  rainProbability: z.number().min(0).max(100).describe('Probability of precipitation forecast (%)'),
  daysSinceLastIrrigation: z.number().min(0).max(60).describe('Number of days elapsed since previous irrigation'),
});

export async function executeCalculateIrrigation({
  currentMoisture,
  targetMoisture,
  cropWaterRequirement,
  fieldSizeHectares,
  temperature,
  rainProbability,
  daysSinceLastIrrigation,
}: z.infer<typeof calculateIrrigationInputSchema>): Promise<IrrigationCalcResult> {
  // 1. Deficit calculation
  const deficitPercentage = Math.max(0, targetMoisture - currentMoisture);

  // If current moisture is already at or above target, no water needed
  if (deficitPercentage <= 0) {
    return {
      recommendedWaterLitres: 0,
      recommendedDurationMinutes: 0,
      urgency: 'LOW',
      calculationFormula: `No moisture deficit (Current: ${currentMoisture}% >= Target: ${targetMoisture}%). Hydration adequate.`,
      isEstimate: true,
    };
  }

  // 2. Hydrological parameters
  // Effective active root depth Zr (assumed ~0.5m for standard agronomic row crops)
  const activeRootDepthMeters = cropWaterRequirement === 'FLOODED' ? 0.3 : 0.5;

  // Base deficit depth in mm = (deficit % / 100) * root depth (m) * 1000 mm/m
  const baseDeficitMm = (deficitPercentage / 100) * activeRootDepthMeters * 1000;

  // 3. Evapotranspiration ET adjustment based on ambient temperature
  // Standard baseline at 25°C. For each °C above 25°C, ET increases ~2.5%
  const tempFactor = 1.0 + Math.max(0, (temperature - 25) * 0.025);

  // 4. Precipitation discount factor
  // If rain probability is high, reduce irrigation volume to avoid wasteful runoff and waterlogging
  let rainDiscount = 1.0;
  if (rainProbability >= 70) {
    rainDiscount = 0.15; // 85% discount if impending rain is very likely
  } else if (rainProbability >= 40) {
    rainDiscount = 0.60; // 40% discount
  } else if (rainProbability >= 20) {
    rainDiscount = 0.85; // 15% discount
  }

  // 5. Net irrigation depth (mm)
  const netDepthMm = Number((baseDeficitMm * tempFactor * rainDiscount).toFixed(2));

  // 6. Volume conversion: 1 mm depth over 1 hectare = 10,000 Litres
  const totalLitres = Math.round(netDepthMm * fieldSizeHectares * 10000);

  // 7. Pump duration calculation
  // Assuming standard agricultural drip/sprinkler system rated at 35,000 Litres/hour per hectare
  const systemFlowRateLitresPerHour = 35000 * fieldSizeHectares;
  const durationHours = totalLitres / systemFlowRateLitresPerHour;
  const durationMinutes = Math.round(durationHours * 60);

  // 8. Urgency classification
  let urgency: UrgencyLevel = 'LOW';
  if (cropWaterRequirement === 'FLOODED' && deficitPercentage > 20) {
    urgency = 'CRITICAL';
  } else if (deficitPercentage > 25 || (daysSinceLastIrrigation >= 6 && deficitPercentage > 15)) {
    urgency = 'HIGH';
  } else if (deficitPercentage > 12 || daysSinceLastIrrigation >= 4) {
    urgency = 'MEDIUM';
  }

  // If impending rain is >= 60%, downgrade urgency
  if (rainProbability >= 60 && urgency !== 'CRITICAL') {
    urgency = 'LOW';
  }

  const formula = `V = Area(${fieldSizeHectares} ha) * Deficit(${deficitPercentage.toFixed(1)}%) * RootDepth(${activeRootDepthMeters}m) * ET_factor(${tempFactor.toFixed(2)}) * RainDiscount(${rainDiscount.toFixed(2)}) * 10,000 L/mm-ha = ${totalLitres.toLocaleString()} Litres`;

  return {
    recommendedWaterLitres: totalLitres,
    recommendedDurationMinutes: durationMinutes,
    urgency,
    calculationFormula: formula,
    isEstimate: true,
  };
}

export const calculateIrrigationTool = tool({
  description:
    'Perform deterministic agronomic hydrological arithmetic to calculate precise irrigation water volume in Litres and pump run duration in minutes based on root-zone moisture deficit, evapotranspiration, and rain probability discount.',
  inputSchema: calculateIrrigationInputSchema,
  execute: executeCalculateIrrigation,
});
