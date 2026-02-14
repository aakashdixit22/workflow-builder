import { NextResponse } from 'next/server';
import { getRunHistory } from '../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 5;
    const history = await getRunHistory(limit);
    
    // Convert MongoDB ObjectId to string for JSON serialization
    const serializedHistory = history.map((run) => ({
      ...run,
      _id: run._id.toString(),
    }));
    
    return NextResponse.json({ success: true, history: serializedHistory });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
