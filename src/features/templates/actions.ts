import { apiFetch, ServerActionResult } from '@/lib/apiFetch';
import { Template } from '@/models/templates';

export async function createTemplateAction(body: Omit<Template, 'id' | 'status'>): Promise<ServerActionResult> {
    try {
        await apiFetch('/templates', { method: 'POST', body });
        return { success: true, invalidateKeys: ['templates'] };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to create template',
        };
    }
}
