export interface ServerActionResult<T = undefined> {
    success: boolean;
    error?: string;
    data?: T;
    invalidateKeys?: string[];
}

export class ApiFetchError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly data: unknown,
    ) {
        super(message);
        this.name = 'ApiFetchError';
    }
}

type ApiFetchOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
};

export async function apiFetch<T>(
    path: string,
    options: ApiFetchOptions = {},
): Promise<T | undefined> {
    const { method = 'GET', body, headers: extraHeaders = {} } = options;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
    const url = `${baseUrl}/${path.replace(/^\//, '')}`;

    const headers: Record<string, string> = { ...extraHeaders };

    if (body && !(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    // Server-side: read access_token from HttpOnly cookie
    if (typeof window === 'undefined') {
        const { cookies } = await import('next/headers');
        const token = (await cookies()).get('access_token')?.value;
        if (token) {
            headers['Cookie'] = `access_token=${token}`;
        }
    } else {
        // Client-side: read from Zustand auth store
        const { useAuthStore } = await import('@/stores/authStore');
        const token = useAuthStore.getState().access_token;
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const res = await fetch(url, {
        method,
        headers,
        body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 204) {
        return undefined;
    }

    if (!res.ok) {
        let data: unknown;
        try {
            data = await res.json();
        } catch {
            data = null;
        }

        const message = (data as { message?: string })?.message ?? `HTTP ${res.status}`;

        if (res.status === 401 && typeof window !== 'undefined') {
            const { useAuthStore } = await import('@/stores/authStore');
            useAuthStore.getState().logout();
            const { notifyError } = await import('@/contexts/toastContext');
            notifyError(message);
            return undefined;
        }

        if (typeof window !== 'undefined') {
            const { notifyError } = await import('@/contexts/toastContext');
            notifyError(message);
        }

        throw new ApiFetchError(message, res.status, data);
    }

    const json = await res.json();
    return json as T;
}
