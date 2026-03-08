'use server';

import type { ServerActionResult } from '@/lib/apiFetch';
import { apiFetch } from '@/lib/apiFetch';
import type { User } from '@/models/users';
import { revalidatePath } from 'next/cache';

export async function createUserAction(body: Omit<User, 'id'>): Promise<ServerActionResult> {
    try {
        await apiFetch('/users', { method: 'POST', body });
        revalidatePath('/users');
        return { success: true, invalidateKeys: ['users'] };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to create user',
        };
    }
}

export async function updateUserAction(
    id: string,
    body: Partial<User>,
): Promise<ServerActionResult> {
    try {
        await apiFetch(`/users/${id}`, { method: 'PUT', body });
        revalidatePath('/users');
        return { success: true, invalidateKeys: ['users'] };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to update user',
        };
    }
}

export async function deleteUserAction(id: string): Promise<ServerActionResult> {
    try {
        await apiFetch(`/users/${id}`, { method: 'DELETE' });
        revalidatePath('/users');
        return { success: true, invalidateKeys: ['users'] };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to delete user',
        };
    }
}
