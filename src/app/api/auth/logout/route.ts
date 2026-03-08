import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// This API route handles user logout by deleting the access token cookie
export async function POST() {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    return NextResponse.json({ ok: true });
}
