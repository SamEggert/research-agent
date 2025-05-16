import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET: Fetch preferences (assume only one row)
export async function GET() {
  try {
    const preferences = await sql`SELECT * FROM preferences LIMIT 1`;
    let pref = preferences[0];
    if (!pref) {
      // Return a default preferences object if none found
      pref = {
        id: null,
        llm_notes: [],
        created_at: null,
        updated_at: null,
      };
    }
    // Robustly handle llm_notes
    if (pref.llm_notes) {
      if (typeof pref.llm_notes === 'string') {
        // Handle Postgres array string format
        pref.llm_notes = pref.llm_notes
          .replace(/^{|}$/g, '') // remove curly braces
          .split(',')
          .map(s => s.trim())
          .filter(Boolean); // remove empty strings
      } else if (!Array.isArray(pref.llm_notes)) {
        // If it's not an array or string, force to array
        pref.llm_notes = [String(pref.llm_notes)];
      }
      // If it's already an array, do nothing
    } else {
      pref.llm_notes = [];
    }
    return NextResponse.json(pref);
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