import { tool } from 'ai';
import { z } from 'zod';

export const getIrrigationHistoryInputSchema = z.object({
  crop: z.string().optional().describe('Optional crop filter'),
  limit: z.number().min(1).max(50).optional().describe('Number of recent history records to retrieve (default: 5)'),
});

export interface IrrigationHistoryEvent {
  id: string;
  date: string;
  crop: string;
  waterLitres: number;
  durationMinutes: number;
  decision: 'IRRIGATE' | 'WAIT' | 'MONITOR';
  hoursAgo: number;
  daysAgo: number;
  soilMoistureBefore: number;
  status: 'COMPLETED' | 'LOGGED';
}

// In-memory seeded history records (can be updated when irrigation runs)
export const IN_MEMORY_IRRIGATION_HISTORY: IrrigationHistoryEvent[] = [
  {
    id: 'IRR-2026-09-18-01',
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    crop: 'wheat',
    waterLitres: 45000,
    durationMinutes: 75,
    decision: 'IRRIGATE',
    hoursAgo: 72,
    daysAgo: 3,
    soilMoistureBefore: 27,
    status: 'COMPLETED',
  },
  {
    id: 'IRR-2026-09-15-02',
    date: new Date(Date.now() - 6 * 86400000).toISOString(),
    crop: 'wheat',
    waterLitres: 40000,
    durationMinutes: 65,
    decision: 'IRRIGATE',
    hoursAgo: 144,
    daysAgo: 6,
    soilMoistureBefore: 26,
    status: 'COMPLETED',
  },
  {
    id: 'IRR-2026-09-12-03',
    date: new Date(Date.now() - 9 * 86400000).toISOString(),
    crop: 'rice',
    waterLitres: 95000,
    durationMinutes: 140,
    decision: 'IRRIGATE',
    hoursAgo: 216,
    daysAgo: 9,
    soilMoistureBefore: 62,
    status: 'COMPLETED',
  },
  {
    id: 'IRR-2026-09-09-04',
    date: new Date(Date.now() - 12 * 86400000).toISOString(),
    crop: 'tomato',
    waterLitres: 28000,
    durationMinutes: 45,
    decision: 'IRRIGATE',
    hoursAgo: 288,
    daysAgo: 12,
    soilMoistureBefore: 42,
    status: 'COMPLETED',
  },
];

export async function executeIrrigationHistory({
  crop,
  limit = 5,
}: z.infer<typeof getIrrigationHistoryInputSchema>): Promise<{
  events: IrrigationHistoryEvent[];
  summary: string;
  lastIrrigationDaysAgo: number;
}> {
  let filtered = [...IN_MEMORY_IRRIGATION_HISTORY];
  if (crop) {
    filtered = filtered.filter(e => e.crop.toLowerCase() === crop.toLowerCase());
  }

  const events = filtered.slice(0, limit);
  const mostRecent = events[0];
  const daysAgo = mostRecent ? mostRecent.daysAgo : 99;

  let summary = `No recent irrigation records found for ${crop || 'all crops'}.`;
  if (mostRecent) {
    summary = `Last irrigation was ${daysAgo} day(s) ago on ${new Date(mostRecent.date).toLocaleDateString()} (${mostRecent.waterLitres.toLocaleString()} L applied for ${mostRecent.crop}).`;
    if (daysAgo < 2) {
      summary += ' WARNING: Field was irrigated within the last 48 hours. Strongly verify whether additional moisture is strictly required.';
    }
  }

  return {
    events,
    summary,
    lastIrrigationDaysAgo: daysAgo,
  };
}

export const getIrrigationHistoryTool = tool({
  description:
    'Retrieve recent irrigation history logs (previous water volume applied, duration, date, and elapsed days/hours) to prevent over-irrigation cycles and waterlogging.',
  inputSchema: getIrrigationHistoryInputSchema,
  execute: executeIrrigationHistory,
});
