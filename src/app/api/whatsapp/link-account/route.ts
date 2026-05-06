import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

type Body = {
    code?: string;
    login_type?: 'whatsapp' | 'meta';
    waba_id?: string;
    phone_number_id?: string;
};

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as Body;
        const { code, login_type, waba_id, phone_number_id } = body;

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

        const gatewayBase = process.env.WHATSAPP_GATEWAY_URL;
        const frontURL = process.env.NEXT_PUBLIC_APP_URL;
        const apiURL = process.env.NEXT_PUBLIC_API_URL;

        if (!gatewayBase || !frontURL || !apiURL) {
            return NextResponse.json({ error: 'Server env is not configured' }, { status: 500 });
        }

        const token = (await cookies()).get('access_token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized: missing access token' },
                { status: 401 },
            );
        }

        const hasEmbedded = Boolean(waba_id && phone_number_id);
        const endpoint = hasEmbedded
            ? '/api/v1/whatsapp/embedded-signup'
            : '/api/v1/whatsapp/integrate-account';

        const payload = hasEmbedded
            ? { code, waba_id, phone_number_id, apiURL, frontURL }
            : { code, apiURL, frontURL };

        const gatewayRes = await fetch(`${gatewayBase}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
            cache: 'no-store',
        });

        const data = await gatewayRes.json();

        if (!gatewayRes.ok) {
            return NextResponse.json(
                { error: data?.message ?? data?.error ?? 'Account linking failed' },
                { status: gatewayRes.status },
            );
        }

        return NextResponse.json({
            success: true,
            accountId: data?.data?.accountId,
            phoneNumberId: data?.data?.phoneNumberId,
            phoneNumber: data?.data?.phoneNumber,
            message: data?.data?.message ?? 'Account linked successfully',
        });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
