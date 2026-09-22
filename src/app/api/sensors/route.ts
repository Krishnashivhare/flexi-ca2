import { NextResponse } from 'next/server';
import { getSensorProvider } from '@/lib/sensors';
import { getFieldData, updateFieldData } from '@/lib/state/fieldStore';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const providerType = (searchParams.get('provider') as 'mock' | 'esp32-stub') || 'mock';
    const provider = getSensorProvider(providerType);

    const latest = await provider.getLatestReading();
    const history = await provider.getHistoricalReadings(24);
    const field = getFieldData();

    return NextResponse.json({
      success: true,
      provider: {
        name: provider.name,
        type: provider.providerType,
      },
      latest: {
        ...latest,
        soilMoisture: field.currentMoisturePercent,
        temperature: field.currentTempC,
        humidity: field.currentHumidityPercent,
        rainProbability: field.rainProbabilityPercent,
      },
      history,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const provider = getSensorProvider(body.providerType || 'mock');
    const field = getFieldData();

    // Trigger drift or override
    let updated;
    if (body.action === 'drift') {
      const currentReading = {
        timestamp: new Date().toISOString(),
        soilMoisture: field.currentMoisturePercent,
        temperature: field.currentTempC,
        humidity: field.currentHumidityPercent,
        rainProbability: field.rainProbabilityPercent,
        provider: 'mock' as const,
      };
      const drifted = provider.simulateDrift(currentReading, body.bias);
      updated = updateFieldData({
        currentMoisturePercent: drifted.soilMoisture,
        currentTempC: drifted.temperature,
        currentHumidityPercent: drifted.humidity,
        rainProbabilityPercent: drifted.rainProbability,
      });
    } else if (body.reading) {
      updated = updateFieldData({
        currentMoisturePercent: body.reading.soilMoisture ?? field.currentMoisturePercent,
        currentTempC: body.reading.temperature ?? field.currentTempC,
        currentHumidityPercent: body.reading.humidity ?? field.currentHumidityPercent,
        rainProbabilityPercent: body.reading.rainProbability ?? field.rainProbabilityPercent,
      });
    }

    return NextResponse.json({
      success: true,
      field: updated || field,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
