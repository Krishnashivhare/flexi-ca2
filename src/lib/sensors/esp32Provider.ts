import { SensorReading } from '@/types/irrigation';
import { SensorDataProvider } from './types';

/**
 * Expected JSON payload format sent by ESP32 / ESP8266 IoT nodes
 * via MQTT topic `agri/sensors/{device_id}/telemetry` or HTTP POST `/api/iot/telemetry`.
 */
export interface Esp32TelemetryPayload {
  deviceId: string;
  firmwareVersion: string;
  timestampMs: number;
  rawAnalogMoisture: number; // ADC 0 - 4095
  calibratedMoisturePercent: number; // 0 - 100%
  dhtTempC: number;
  dhtHumidityPercent: number;
  rainSensorDigital: 0 | 1;
  batteryMillivolts: number;
  rssi: number;
}

/**
 * Physical IoT Sensor Provider Stub.
 * When physical ESP32 nodes are deployed in future iterations,
 * this provider parses incoming MQTT packets or buffered telemetry.
 */
export class Esp32SensorProvider implements SensorDataProvider {
  readonly name = 'ESP32 IoT Gateway (LoRaWAN / Wi-Fi Stub)';
  readonly providerType = 'esp32-stub' as const;

  private lastPayload: Esp32TelemetryPayload = {
    deviceId: 'ESP32-NODE-AGRI-01',
    firmwareVersion: '1.4.2-rel',
    timestampMs: Date.now(),
    rawAnalogMoisture: 2450,
    calibratedMoisturePercent: 36.5,
    dhtTempC: 29.2,
    dhtHumidityPercent: 52,
    rainSensorDigital: 1, // 1 = dry, 0 = wet
    batteryMillivolts: 3850, // 3.85V LiPo
    rssi: -68,
  };

  /**
   * Parse incoming raw ESP32 packet into the unified SensorReading format
   */
  public parseEsp32Packet(payload: Esp32TelemetryPayload): SensorReading {
    this.lastPayload = payload;
    return {
      timestamp: new Date(payload.timestampMs).toISOString(),
      soilMoisture: payload.calibratedMoisturePercent,
      temperature: payload.dhtTempC,
      humidity: payload.dhtHumidityPercent,
      rainProbability: payload.rainSensorDigital === 0 ? 90 : 15,
      batteryLevel: Math.min(100, Math.max(0, Math.round(((payload.batteryMillivolts - 3300) / 900) * 100))),
      provider: 'esp32-stub',
    };
  }

  async getLatestReading(): Promise<SensorReading> {
    return this.parseEsp32Packet(this.lastPayload);
  }

  async getHistoricalReadings(hoursBack = 24): Promise<SensorReading[]> {
    const list: SensorReading[] = [];
    const now = Date.now();
    for (let i = hoursBack; i >= 0; i--) {
      list.push({
        timestamp: new Date(now - i * 3600 * 1000).toISOString(),
        soilMoisture: Number((35 + Math.sin(i / 3) * 6).toFixed(1)),
        temperature: Number((28 + Math.cos(i / 4) * 4).toFixed(1)),
        humidity: Math.round(55 + Math.sin(i / 5) * 10),
        rainProbability: 20,
        batteryLevel: 92,
        provider: 'esp32-stub',
      });
    }
    return list;
  }

  simulateDrift(current: SensorReading): SensorReading {
    // In hardware mode, readings update on hardware interrupt/ping.
    // For simulation preview:
    return {
      ...current,
      timestamp: new Date().toISOString(),
      soilMoisture: Math.max(10, Number((current.soilMoisture - 0.2).toFixed(1))),
      temperature: Number((current.temperature + (Math.random() * 0.4 - 0.2)).toFixed(1)),
    };
  }
}
