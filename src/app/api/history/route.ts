import { NextResponse } from 'next/server';
import { addIrrigationRecord, getIrrigationRecords } from '@/lib/state/fieldStore';

export async function GET() {
  return NextResponse.json({
    success: true,
    records: getIrrigationRecords(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newRecord = addIrrigationRecord(body);
    return NextResponse.json({
      success: true,
      record: newRecord,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
