import { SensorReading } from '@/types/irrigation';

export interface SensorDataProvider {
  readonly name: string;
  readonly providerType: 'mock' | 'esp32-stub';
  
  getLatestReading(): Promise<SensorReading>;
  getHistoricalReadings(hoursBack?: number): Promise<SensorReading[]>;
  simulateDrift(current: SensorReading, bias?: { moistureDelta?: number; tempDelta?: number }): SensorReading;
}
