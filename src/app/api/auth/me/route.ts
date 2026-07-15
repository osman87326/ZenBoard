import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-request';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    const dbMode = db.getMode();

    if (!user) {
      return NextResponse.json({ authenticated: false, dbMode }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user,
      dbMode,
    });
  } catch (error) {
    console.error('Auth Me API Error:', error);
    return NextResponse.json({ authenticated: false, error: 'Internal server error' }, { status: 500 });
  }
}
