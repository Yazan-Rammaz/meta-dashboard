import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { code, login_type } = await req.json();

        if (!code || !login_type) {
            return NextResponse.json(
                { error: 'Missing required fields: code and login_type' },
                { status: 400 },
            );
        }

        if (login_type !== 'whatsapp' && login_type !== 'meta') {
            return NextResponse.json(
                { error: 'login_type must be "whatsapp" or "meta"' },
                { status: 400 },
            );
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Cookie'] = `access_token=${token}`;
        }

        const backendRes = await fetch(`${baseUrl}/clients/exchange-token`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ code, login_type }),
        });

        const data = await backendRes.json();

        if (!backendRes.ok) {
            return NextResponse.json(
                { error: data?.message ?? 'Token exchange failed' },
                { status: backendRes.status },
            );
        }

        return NextResponse.json(data);
    } catch (_err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
