import { SensorDataProvider } from './types';
import { MockSensorProvider } from './mockProvider';
import { Esp32SensorProvider } from './esp32Provider';

// In-memory singletons to maintain drift state across requests
const mockInstance = new MockSensorProvider();
const esp32Instance = new Esp32SensorProvider();

export function getSensorProvider(type: 'mock' | 'esp32-stub' = 'mock'): SensorDataProvider {
  if (type === 'esp32-stub') {
    return esp32Instance;
  }
  return mockInstance;
}

export { MockSensorProvider, Esp32SensorProvider };
export * from './types';
