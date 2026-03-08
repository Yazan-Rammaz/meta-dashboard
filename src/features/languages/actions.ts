'use server';

import type { ServerActionResult } from '@/lib/apiFetch';
import { apiFetch } from '@/lib/apiFetch';
import type { Language } from '@/models/languages';
import { revalidatePath } from 'next/cache';

export async function createLanguageAction(body: Partial<Language>): Promise<ServerActionResult> {
    try {
        await apiFetch('/languages/create', { method: 'POST', body });
        revalidatePath('/languages');
        return { success: true, invalidateKeys: ['languages'] };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to create language',
        };
    }
}

export async function updateLanguageAction(
    language_code: string,
    body: Partial<Language>,
): Promise<ServerActionResult> {
    try {
        await apiFetch(`/languages/update/${language_code}`, {
            method: 'PUT',
            body,
        });
        revalidatePath('/languages');
        return { success: true, invalidateKeys: ['languages'] };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to update language',
        };
    }
}

export async function deleteLanguageAction(language_code: string): Promise<ServerActionResult> {
    try {
        await apiFetch(`/languages/destroy/${language_code}`, {
            method: 'DELETE',
        });
        revalidatePath('/languages');
        return { success: true, invalidateKeys: ['languages'] };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to delete language',
        };
    }
}
