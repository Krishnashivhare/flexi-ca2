import { FieldData, IrrigationRecord } from '@/types/irrigation';

let currentField: FieldData = {
  id: 'FIELD-ALPHA-01',
  name: 'North Sector Wheat Field',
  location: 'Karnal, Haryana, India',
  latitude: 29.6857,
  longitude: 76.9905,
  areaHectares: 1.5,
  crop: 'wheat',
  growthStage: 'vegetative',
  soilType: 'loam',
  currentMoisturePercent: 28,
  currentTempC: 31.0,
  currentHumidityPercent: 48,
  rainProbabilityPercent: 10,
  lastIrrigatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
};

const recentRecords: IrrigationRecord[] = [
  {
    id: 'IRR-101',
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    crop: 'wheat',
    soilMoisture: 27,
    decision: 'IRRIGATE',
    waterLitres: 45000,
    durationMinutes: 75,
    executed: true,
    triggerSource: 'agent',
  },
  {
    id: 'IRR-102',
    date: new Date(Date.now() - 6 * 86400000).toISOString(),
    crop: 'wheat',
    soilMoisture: 26,
    decision: 'IRRIGATE',
    waterLitres: 40000,
    durationMinutes: 65,
    executed: true,
    triggerSource: 'scheduled',
  },
  {
    id: 'IRR-103',
    date: new Date(Date.now() - 9 * 86400000).toISOString(),
    crop: 'rice',
    soilMoisture: 62,
    decision: 'IRRIGATE',
    waterLitres: 95000,
    durationMinutes: 140,
    executed: true,
    triggerSource: 'manual',
  },
  {
    id: 'IRR-104',
    date: new Date(Date.now() - 12 * 86400000).toISOString(),
    crop: 'tomato',
    soilMoisture: 42,
    decision: 'IRRIGATE',
    waterLitres: 28000,
    durationMinutes: 45,
    executed: true,
    triggerSource: 'agent',
  },
  {
    id: 'IRR-105',
    date: new Date(Date.now() - 15 * 86400000).toISOString(),
    crop: 'cotton',
    soilMoisture: 33,
    decision: 'IRRIGATE',
    waterLitres: 52000,
    durationMinutes: 90,
    executed: true,
    triggerSource: 'agent',
  },
];

export function getFieldData(): FieldData {
  return { ...currentField };
}

export function updateFieldData(data: Partial<FieldData>): FieldData {
  currentField = { ...currentField, ...data };
  return { ...currentField };
}

export function getIrrigationRecords(): IrrigationRecord[] {
  return [...recentRecords];
}

export function addIrrigationRecord(record: Omit<IrrigationRecord, 'id'>): IrrigationRecord {
  const newRecord: IrrigationRecord = {
    ...record,
    id: 'IRR-' + Date.now().toString().slice(-4),
  };
  recentRecords.unshift(newRecord);
  return newRecord;
}
