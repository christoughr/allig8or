import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'allig8tor',
    timestamp: new Date().toISOString(),
  });
}
