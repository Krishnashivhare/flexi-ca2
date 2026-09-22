export type CropType = 'wheat' | 'rice' | 'maize' | 'cotton' | 'tomato' | 'sugarcane';

export type GrowthStage = 'germination' | 'vegetative' | 'flowering' | 'fruiting' | 'maturity';

export type SoilType = 'sandy' | 'clay' | 'loam';

export type DecisionType = 'IRRIGATE' | 'WAIT' | 'MONITOR';

export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface FieldData {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  areaHectares: number;
  crop: CropType;
  growthStage: GrowthStage;
  soilType: SoilType;
  currentMoisturePercent: number;
  currentTempC: number;
  currentHumidityPercent: number;
  rainProbabilityPercent: number;
  lastIrrigatedAt: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainProbability: number;
  rainfallForecastMm: number;
  windSpeed: number;
  condition: string;
  source: 'open-meteo' | 'simulated-fallback';
}

export interface SoilAnalysisResult {
  moistureStatus: 'CRITICALLY_DRY' | 'DEFICIT' | 'OPTIMAL' | 'SATURATED' | 'WATERLOGGED';
  soilCondition: string;
  estimatedRequirement: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH';
  severity: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
  percolationRate: string;
}

export interface CropKnowledgeResult {
  crop: CropType;
  growthStage: GrowthStage;
  soilType: SoilType;
  preferredMoistureRange: {
    min: number;
    max: number;
  };
  waterRequirement: 'LOW' | 'MEDIUM' | 'HIGH' | 'FLOODED';
  sensitivity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  idealIrrigationConditions: string;
}

export interface IrrigationCalcResult {
  recommendedWaterLitres: number;
  recommendedDurationMinutes: number;
  urgency: UrgencyLevel;
  calculationFormula: string;
  isEstimate: true;
}

export interface IrrigationRecord {
  id: string;
  date: string;
  crop: CropType;
  soilMoisture: number;
  decision: DecisionType;
  waterLitres: number;
  durationMinutes: number;
  executed: boolean;
  triggerSource: 'agent' | 'manual' | 'scheduled';
}

export interface IrrigationDecision {
  decision: DecisionType;
  confidence: number; // 0.0 - 1.0
  urgency: UrgencyLevel;
  waterLitres: number;
  durationMinutes: number;
  reasoningFactors: string[];
  warnings: string[];
  recommendation: string;
  timestamp: string;
}

export interface AgentToolResult<T = unknown> {
  toolName: string;
  status: 'success' | 'fallback' | 'error';
  data: T;
  summary: string;
}

export interface SensorReading {
  timestamp: string;
  soilMoisture: number;
  temperature: number;
  humidity: number;
  rainProbability: number;
  batteryLevel?: number;
  provider: 'mock' | 'esp32-stub';
}

export interface DemoPreset {
  id: string;
  name: string;
  description: string;
  crop: CropType;
  growthStage: GrowthStage;
  soilType: SoilType;
  moisture: number;
  temperature: number;
  humidity: number;
  rainProbability: number;
  rainfallForecastMm: number;
  daysSinceLastIrrigation: number;
  expectedDecision: DecisionType;
  agronomicRationale: string;
}
