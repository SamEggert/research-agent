import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST() {
  await kv.del('latest-map-markers');
  return NextResponse.json({ success: true });
} 