import { tool } from 'ai';
import { z } from 'zod';
import { CropKnowledgeResult, CropType, GrowthStage } from '@/types/irrigation';

export const getCropKnowledgeInputSchema = z.object({
  crop: z.enum(['wheat', 'rice', 'maize', 'cotton', 'tomato', 'sugarcane']).describe('Crop variety'),
  growthStage: z.enum(['germination', 'vegetative', 'flowering', 'fruiting', 'maturity']).describe('Current phenological growth stage'),
  soilType: z.enum(['sandy', 'clay', 'loam']).describe('Soil classification in field'),
});

// Comprehensive agronomic knowledge base
const CROP_DATABASE: Record<
  CropType,
  Record<
    GrowthStage,
    {
      minMoisture: number;
      maxMoisture: number;
      waterRequirement: 'LOW' | 'MEDIUM' | 'HIGH' | 'FLOODED';
      sensitivity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      notes: string;
    }
  >
> = {
  wheat: {
    germination: { minMoisture: 35, maxMoisture: 50, waterRequirement: 'LOW', sensitivity: 'MEDIUM', notes: 'Requires adequate seed-zone moisture for uniform emergence; avoid standing water.' },
    vegetative: { minMoisture: 40, maxMoisture: 60, waterRequirement: 'MEDIUM', sensitivity: 'MEDIUM', notes: 'Crown root initiation (CRI) stage is critical. Moisture below 30% significantly reduces tillering.' },
    flowering: { minMoisture: 45, maxMoisture: 65, waterRequirement: 'HIGH', sensitivity: 'CRITICAL', notes: 'Flowering/anthesis is peak water stress vulnerability. Moisture deficit causes grain abortion.' },
    fruiting: { minMoisture: 40, maxMoisture: 55, waterRequirement: 'MEDIUM', sensitivity: 'HIGH', notes: 'Grain filling stage (dough stage). Moisture required for test weight; taper off as grains harden.' },
    maturity: { minMoisture: 25, maxMoisture: 40, waterRequirement: 'LOW', sensitivity: 'LOW', notes: 'Dry-down phase. Withhold irrigation to allow golden ripening and prevent fungal head blight.' },
  },
  rice: {
    // Rice is semi-aquatic: flooded/saturated in vegetative & flowering
    germination: { minMoisture: 50, maxMoisture: 70, waterRequirement: 'MEDIUM', sensitivity: 'HIGH', notes: 'Needs saturated seedbed without deep flooding to allow coleoptile emergence.' },
    vegetative: { minMoisture: 70, maxMoisture: 90, waterRequirement: 'FLOODED', sensitivity: 'HIGH', notes: 'Tillering stage. Flooded shallow water layer (2-5 cm) suppresses weeds and maximizes panicles. 70-85% soil moisture is ideal, not waterlogging.' },
    flowering: { minMoisture: 75, maxMoisture: 95, waterRequirement: 'FLOODED', sensitivity: 'CRITICAL', notes: 'Panicle initiation and anthesis. Water stress causes high spikelet sterility. Continuous standing water needed.' },
    fruiting: { minMoisture: 60, maxMoisture: 80, waterRequirement: 'HIGH', sensitivity: 'MEDIUM', notes: 'Milk to dough stage. Maintain saturated soil; drain 10-14 days before harvest.' },
    maturity: { minMoisture: 35, maxMoisture: 55, waterRequirement: 'LOW', sensitivity: 'LOW', notes: 'Ripening phase. Field should be completely drained for mechanised harvesting.' },
  },
  maize: {
    germination: { minMoisture: 35, maxMoisture: 50, waterRequirement: 'LOW', sensitivity: 'MEDIUM', notes: 'Sensitive to cold saturated soil. Requires well-aerated seedbed.' },
    vegetative: { minMoisture: 45, maxMoisture: 65, waterRequirement: 'MEDIUM', sensitivity: 'MEDIUM', notes: 'Rapid biomass accumulation. Deep taproot development requires gradual deep watering.' },
    flowering: { minMoisture: 55, maxMoisture: 75, waterRequirement: 'HIGH', sensitivity: 'CRITICAL', notes: 'Tasseling and silking. Most vulnerable period: water stress wilts silks and prevents pollination.' },
    fruiting: { minMoisture: 50, maxMoisture: 70, waterRequirement: 'HIGH', sensitivity: 'HIGH', notes: 'Kernel development and blister stage. Moisture deficit reduces kernel depth and weight.' },
    maturity: { minMoisture: 30, maxMoisture: 45, waterRequirement: 'LOW', sensitivity: 'LOW', notes: 'Black layer formation indicates physiological maturity. Irrigation ceased.' },
  },
  cotton: {
    germination: { minMoisture: 30, maxMoisture: 45, waterRequirement: 'LOW', sensitivity: 'MEDIUM', notes: 'Vulnerable to soil crusting; needs moderate moisture to push taproot through.' },
    vegetative: { minMoisture: 35, maxMoisture: 55, waterRequirement: 'MEDIUM', sensitivity: 'LOW', notes: 'Moderate deficit encourages deep root penetration and avoids excessive vegetative rank growth.' },
    flowering: { minMoisture: 50, maxMoisture: 70, waterRequirement: 'HIGH', sensitivity: 'CRITICAL', notes: 'Peak squaring and flower blooming. Water deficit causes massive square/flower shedding.' },
    fruiting: { minMoisture: 45, maxMoisture: 65, waterRequirement: 'HIGH', sensitivity: 'HIGH', notes: 'Boll development. Requires steady moisture to fill bolls; avoid extreme wetting/drying cycles.' },
    maturity: { minMoisture: 25, maxMoisture: 40, waterRequirement: 'LOW', sensitivity: 'LOW', notes: 'Boll opening phase. Stop watering to prevent fiber discoloration and boll rot.' },
  },
  tomato: {
    germination: { minMoisture: 45, maxMoisture: 60, waterRequirement: 'LOW', sensitivity: 'HIGH', notes: 'Delicate seedling stage; requires fine moist seedbed with minimal mechanical disturbance.' },
    vegetative: { minMoisture: 45, maxMoisture: 65, waterRequirement: 'MEDIUM', sensitivity: 'MEDIUM', notes: 'Foliage and stem development. Consistent moisture prevents stunt.' },
    flowering: { minMoisture: 50, maxMoisture: 70, waterRequirement: 'HIGH', sensitivity: 'CRITICAL', notes: 'Flower blossom. Fluctuating water tension induces blossom drop.' },
    fruiting: { minMoisture: 55, maxMoisture: 70, waterRequirement: 'HIGH', sensitivity: 'CRITICAL', notes: 'Fruit enlargement. Inconsistent irrigation causes Blossom End Rot (calcium deficiency) and fruit cracking.' },
    maturity: { minMoisture: 40, maxMoisture: 55, waterRequirement: 'MEDIUM', sensitivity: 'MEDIUM', notes: 'Ripening/color turning. Controlled slight deficit concentrates soluble sugars and flavor.' },
  },
  sugarcane: {
    germination: { minMoisture: 40, maxMoisture: 60, waterRequirement: 'MEDIUM', sensitivity: 'MEDIUM', notes: 'Sett germination requires moist bed to initiate root primordia.' },
    vegetative: { minMoisture: 55, maxMoisture: 75, waterRequirement: 'HIGH', sensitivity: 'HIGH', notes: 'Tillering and grand growth phase. Heavy water consumer; high transpiration.' },
    flowering: { minMoisture: 50, maxMoisture: 70, waterRequirement: 'HIGH', sensitivity: 'MEDIUM', notes: 'Arrowing stage in varieties that flower. Steady water needed to maintain cane elongations.' },
    fruiting: { minMoisture: 45, maxMoisture: 65, waterRequirement: 'HIGH', sensitivity: 'MEDIUM', notes: 'Sugar accumulation in stalk internodes.' },
    maturity: { minMoisture: 30, maxMoisture: 45, waterRequirement: 'LOW', sensitivity: 'LOW', notes: 'Ripening stage. Gradual drying increases juice sucrose percentage prior to milling.' },
  },
};

export async function executeCropKnowledge({
  crop,
  growthStage,
  soilType,
}: z.infer<typeof getCropKnowledgeInputSchema>): Promise<CropKnowledgeResult> {
  const cropStages = CROP_DATABASE[crop] || CROP_DATABASE.wheat;
  const stageInfo = cropStages[growthStage] || cropStages.vegetative;

  // Adjust preferred moisture slightly for soil type retention
  let minMoisture = stageInfo.minMoisture;
  let maxMoisture = stageInfo.maxMoisture;

  if (soilType === 'sandy') {
    // Sandy soil has lower absolute volumetric capacity, slightly lower upper threshold
    minMoisture = Math.max(15, minMoisture - 5);
    maxMoisture = Math.max(30, maxMoisture - 5);
  } else if (soilType === 'clay') {
    // Clay soil holds more bound water, baseline percent reads higher
    minMoisture = minMoisture + 5;
    maxMoisture = Math.min(95, maxMoisture + 5);
  }

  const conditions = `${crop.toUpperCase()} (${growthStage.toUpperCase()}): Optimal moisture is ${minMoisture}% - ${maxMoisture}%. Water requirement is ${stageInfo.waterRequirement}, sensitivity is ${stageInfo.sensitivity}. ${stageInfo.notes} In ${soilType} soil, ensure irrigation cycle matches percolation rate.`;

  return {
    crop,
    growthStage,
    soilType,
    preferredMoistureRange: {
      min: minMoisture,
      max: maxMoisture,
    },
    waterRequirement: stageInfo.waterRequirement,
    sensitivity: stageInfo.sensitivity,
    idealIrrigationConditions: conditions,
  };
}

export const getCropKnowledgeTool = tool({
  description:
    'Query structured agronomic knowledge base for crop moisture requirements, phenological stage sensitivity, and special crop physiology (e.g. flooded paddy rice vs aerobic cereals).',
  inputSchema: getCropKnowledgeInputSchema,
  execute: executeCropKnowledge,
});
