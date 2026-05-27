import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'allig8or',
    timestamp: new Date().toISOString(),
  });
}
