'use server';

import type { ServerActionResult } from '@/lib/apiFetch';
import { apiFetch } from '@/lib/apiFetch';
import type { Client } from '@/models/clients';
import { revalidatePath } from 'next/cache';

export async function createClientAction(body: Omit<Client, 'id'>): Promise<ServerActionResult> {
    try {
        await apiFetch('/clients', { method: 'POST', body });
        revalidatePath('/clients');
        return { success: true, invalidateKeys: ['clients'] };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to create client',
        };
    }
}

export async function updateClientAction(
    id: string,
    body: Partial<Client>,
): Promise<ServerActionResult> {
    try {
        await apiFetch(`/clients/${id}`, { method: 'PUT', body });
        revalidatePath('/clients');
        return { success: true, invalidateKeys: ['clients'] };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to update client',
        };
    }
}

export async function deleteClientAction(id: string): Promise<ServerActionResult> {
    try {
        await apiFetch(`/clients/${id}`, { method: 'DELETE' });
        revalidatePath('/clients');
        return { success: true, invalidateKeys: ['clients'] };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to delete client',
        };
    }
}
