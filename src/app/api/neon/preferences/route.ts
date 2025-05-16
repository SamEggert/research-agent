import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET: Fetch preferences (assume only one row)
export async function GET() {
  try {
    const preferences = await sql`SELECT * FROM preferences LIMIT 1`;
    return NextResponse.json(preferences[0]);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT: Update llm_notes (expects { llm_notes: string[] })
export async function PUT(req: NextRequest) {
  try {
    const { llm_notes } = await req.json();
    // Update the only row (id=1)
    const result = await sql`
      UPDATE preferences SET llm_notes = ${llm_notes} WHERE id = 1 RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 