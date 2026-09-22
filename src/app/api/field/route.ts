import { NextResponse } from 'next/server';
import { getFieldData, updateFieldData } from '@/lib/state/fieldStore';

export async function GET() {
  return NextResponse.json({
    success: true,
    field: getFieldData(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = updateFieldData(body);
    return NextResponse.json({
      success: true,
      field: updated,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
