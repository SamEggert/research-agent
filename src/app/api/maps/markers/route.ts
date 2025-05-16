import { NextResponse } from 'next/server';
import { getLatestMarkers } from '../../../../mastra/tools/showMapMarkers';

export async function GET() {
  const markers = await getLatestMarkers();
  return NextResponse.json({ markers });
}