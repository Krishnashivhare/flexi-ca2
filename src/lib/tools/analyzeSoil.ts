import { tool } from 'ai';
import { z } from 'zod';
import { SoilAnalysisResult } from '@/types/irrigation';

export const analyzeSoilInputSchema = z.object({
  soilMoisture: z.number().min(0).max(100).describe('Volumetric soil moisture percentage (0-100%)'),
  soilType: z.enum(['sandy', 'clay', 'loam']).describe('Soil classification: sandy, clay, or loam'),
  temperature: z.number().describe('Ambient temperature in degrees Celsius'),
  humidity: z.number().min(0).max(100).describe('Relative ambient humidity percentage'),
});

export async function executeSoilAnalysis({
  soilMoisture,
  soilType,
  temperature,
  humidity,
}: z.infer<typeof analyzeSoilInputSchema>): Promise<SoilAnalysisResult> {
  // Soil physics thresholds:
  // Sandy: Permanent Wilting Point (PWP) ~ 8%, Field Capacity (FC) ~ 18%, Saturation ~ 35%
  // Clay: PWP ~ 22%, FC ~ 40%, Saturation ~ 55%
  // Loam: PWP ~ 14%, FC ~ 30%, Saturation ~ 45%

  let pwp = 14;
  let fc = 30;
  let saturation = 45;
  let percolation = 'Balanced drainage and moderate water-holding capacity (15-25 mm/hr).';

  if (soilType === 'sandy') {
    pwp = 9;
    fc = 20;
    saturation = 35;
    percolation = 'High percolation rate (>30 mm/hr); rapid gravitational drainage; low water retention.';
  } else if (soilType === 'clay') {
    pwp = 22;
    fc = 42;
    saturation = 55;
    percolation = 'Very slow percolation rate (<5 mm/hr); high capillary retention; elevated risk of root hypoxia/waterlogging.';
  }

  let moistureStatus: SoilAnalysisResult['moistureStatus'] = 'OPTIMAL';
  let estimatedRequirement: SoilAnalysisResult['estimatedRequirement'] = 'NONE';
  let severity: SoilAnalysisResult['severity'] = 'NORMAL';
  let conditionDesc = '';

  if (soilMoisture <= pwp) {
    moistureStatus = 'CRITICALLY_DRY';
    estimatedRequirement = 'HIGH';
    severity = 'CRITICAL';
    conditionDesc = `Soil moisture (${soilMoisture}%) is at or below the Permanent Wilting Point (${pwp}% for ${soilType} soil). Plants cannot extract water against capillary tension. Immediate stress occurring.`;
  } else if (soilMoisture < fc - 3) {
    moistureStatus = 'DEFICIT';
    estimatedRequirement = soilMoisture < (pwp + fc) / 2 ? 'HIGH' : 'MODERATE';
    severity = estimatedRequirement === 'HIGH' ? 'ELEVATED' : 'NORMAL';
    conditionDesc = `Soil moisture (${soilMoisture}%) is below Field Capacity (${fc}%). Available water is depleting under ambient temperature of ${temperature}°C and ${humidity}% RH.`;
  } else if (soilMoisture <= fc + 5) {
    moistureStatus = 'OPTIMAL';
    estimatedRequirement = 'NONE';
    severity = 'NORMAL';
    conditionDesc = `Soil moisture (${soilMoisture}%) is in the optimal agronomic zone for ${soilType} soil (target ${fc}%). Excellent root aeration and water availability.`;
  } else if (soilMoisture < saturation) {
    moistureStatus = 'SATURATED';
    estimatedRequirement = 'NONE';
    severity = 'NORMAL';
    conditionDesc = `Soil is saturated (${soilMoisture}%). Pores are largely filled with water. Additional irrigation is unnecessary and would leach nutrients.`;
  } else {
    moistureStatus = 'WATERLOGGED';
    estimatedRequirement = 'NONE';
    severity = soilType === 'clay' ? 'CRITICAL' : 'ELEVATED';
    conditionDesc = `Soil is severely waterlogged (${soilMoisture}% > saturation threshold of ${saturation}%). Root respiration is inhibited. High disease and root rot risk for non-aquatic crops.`;
  }

  return {
    moistureStatus,
    soilCondition: conditionDesc,
    estimatedRequirement,
    severity,
    percolationRate: percolation,
  };
}

export const analyzeSoilTool = tool({
  description:
    'Analyze soil physics, volumetric moisture deficit, and percolation behavior based on soil texture classification (sandy, clay, or loam) and micro-climate.',
  inputSchema: analyzeSoilInputSchema,
  execute: executeSoilAnalysis,
});
