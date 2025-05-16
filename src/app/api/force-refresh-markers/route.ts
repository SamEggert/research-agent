import { NextResponse } from 'next/server';
import { refreshMarkers } from '../../../mastra/tools/showMapMarkers';

export async function POST() {
  // Real Google Place IDs for pizza places in SF
  const placeIds = [
    'ChIJHXHcEvGAhYARQPuHNN78s78', // Tony's Pizza Napoletana
    'ChIJmx3iW_GAhYARrlV9H2vyE-E', // Golden Boy Pizza
    // Add more valid place IDs as needed
  ];
  console.log('Calling refreshMarkers with:', placeIds);
  const result = await refreshMarkers(placeIds);
  console.log('refreshMarkers result:', result);
  return NextResponse.json({ success: true, result });
} 