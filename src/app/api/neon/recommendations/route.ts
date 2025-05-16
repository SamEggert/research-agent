import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET: List all recommendations
export async function GET() {
  try {
    const recommendations = await sql`SELECT * FROM recommendations ORDER BY created_at DESC`;
    return NextResponse.json(recommendations);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST: Add a new recommendation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      preferences_id,
      place_id,
      display_name,
      latitude,
      longitude,
      business_status,
      rating,
      user_total_rating,
      address,
      google_maps_uri,
      api_response_data
    } = body;
    const result = await sql`
      INSERT INTO recommendations (
        preferences_id, place_id, display_name, latitude, longitude, business_status, rating, user_total_rating, address, google_maps_uri, api_response_data
      ) VALUES (
        ${preferences_id},
        ${place_id},
        ${display_name},
        ${latitude},
        ${longitude},
        ${business_status},
        ${rating},
        ${user_total_rating},
        ${address},
        ${google_maps_uri},
        ${api_response_data}
      ) RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE: Remove a recommendation by id
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await sql`DELETE FROM recommendations WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 