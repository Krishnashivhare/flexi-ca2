import { SensorReading } from '@/types/irrigation';
import { SensorDataProvider } from './types';

export class MockSensorProvider implements SensorDataProvider {
  readonly name = 'Simulated IoT In-Memory Provider';
  readonly providerType = 'mock' as const;

  private currentReading: SensorReading = {
    timestamp: new Date().toISOString(),
    soilMoisture: 38,
    temperature: 28.5,
    humidity: 55,
    rainProbability: 20,
    batteryLevel: 94,
    provider: 'mock',
  };

  async getLatestReading(): Promise<SensorReading> {
    return {
      ...this.currentReading,
      timestamp: new Date().toISOString(),
    };
  }

  async getHistoricalReadings(hoursBack = 24): Promise<SensorReading[]> {
    const history: SensorReading[] = [];
    const now = Date.now();
    const startMoisture = 44;

    for (let i = hoursBack; i >= 0; i--) {
      const time = new Date(now - i * 3600 * 1000);
      const hourOfDay = time.getHours();
      
      // Diurnal temperature cycle (peaks around 14:00, coolest at 05:00)
      const diurnalFactor = Math.sin(((hourOfDay - 8) / 24) * 2 * Math.PI);
      const temp = Number((26 + diurnalFactor * 6 + (Math.random() * 0.8 - 0.4)).toFixed(1));
      
      // Humidity tends to be inverse of temperature
      const humidity = Math.min(95, Math.max(30, Math.round(75 - diurnalFactor * 25 + (Math.random() * 6 - 3))));
      
      // Moisture steadily drops due to evapotranspiration, with slight noise
      const moistureLoss = (hoursBack - i) * 0.25;
      const moisture = Math.max(15, Math.round(startMoisture - moistureLoss + (Math.random() * 2 - 1)));

      history.push({
        timestamp: time.toISOString(),
        soilMoisture: moisture,
        temperature: temp,
        humidity: humidity,
        rainProbability: Math.min(80, Math.max(5, Math.round(15 + Math.random() * 15))),
        batteryLevel: Math.max(20, Math.round(98 - ((hoursBack - i) * 0.15))),
        provider: 'mock',
      });
    }

    return history;
  }

  simulateDrift(
    current: SensorReading,
    bias?: { moistureDelta?: number; tempDelta?: number }
  ): SensorReading {
    // Realistic bounded drift: moisture decreases slightly (evaporation) unless biased
    const moistureDelta = bias?.moistureDelta ?? (Math.random() * 1.5 - 2.0);
    const tempDelta = bias?.tempDelta ?? (Math.random() * 1.0 - 0.5);
    const humidityDelta = -tempDelta * 1.5 + (Math.random() * 2 - 1);
    const rainDelta = Math.random() * 6 - 3;

    const newMoisture = Math.min(95, Math.max(10, Number((current.soilMoisture + moistureDelta).toFixed(1))));
    const newTemp = Math.min(48, Math.max(10, Number((current.temperature + tempDelta).toFixed(1))));
    const newHumidity = Math.min(99, Math.max(20, Math.round(current.humidity + humidityDelta)));
    const newRain = Math.min(95, Math.max(0, Math.round(current.rainProbability + rainDelta)));

    this.currentReading = {
      timestamp: new Date().toISOString(),
      soilMoisture: newMoisture,
      temperature: newTemp,
      humidity: newHumidity,
      rainProbability: newRain,
      batteryLevel: Math.max(10, (current.batteryLevel ?? 95) - 0.1),
      provider: 'mock',
    };

    return this.currentReading;
  }

  setManualReading(reading: Partial<SensorReading>): SensorReading {
    this.currentReading = {
      ...this.currentReading,
      ...reading,
      timestamp: new Date().toISOString(),
    };
    return this.currentReading;
  }
}
