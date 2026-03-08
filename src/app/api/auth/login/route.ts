import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

        const backendRes = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await backendRes.json();

        if (!backendRes.ok) {
            return NextResponse.json(
                { error: data?.message ?? 'Login failed' },
                { status: backendRes.status },
            );
        }

        const token: string = data?.token?.access_token ?? data?.access_token;
        if (token) {
            const cookieStore = await cookies();
            cookieStore.set('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
            });
        }

        return NextResponse.json({
            user: data.user,
            access_token: token,
        });
    } catch (_err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
