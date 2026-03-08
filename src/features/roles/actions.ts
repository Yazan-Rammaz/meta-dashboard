'use server';

import type { ServerActionResult } from '@/lib/apiFetch';
import { apiFetch } from '@/lib/apiFetch';
import type { Role } from '@/models/roles';
import { revalidatePath } from 'next/cache';

export async function createRoleAction(body: Omit<Role, 'id'>): Promise<ServerActionResult> {
    try {
        await apiFetch('/roles', { method: 'POST', body });
        revalidatePath('/roles');
        return { success: true, invalidateKeys: ['roles'] };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to create role',
        };
    }
}

export async function updateRoleAction(
    id: number | string,
    body: Partial<Role>,
): Promise<ServerActionResult> {
    try {
        await apiFetch(`/roles/update/${id}`, { method: 'PUT', body });
        revalidatePath('/roles');
        return { success: true, invalidateKeys: ['roles'] };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to update role',
        };
    }
}

export async function deleteRoleAction(id: number | string): Promise<ServerActionResult> {
    try {
        await apiFetch(`/roles/destroy/${id}`, { method: 'DELETE' });
        revalidatePath('/roles');
        return { success: true, invalidateKeys: ['roles'] };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to delete role',
        };
    }
}
