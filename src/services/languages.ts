import { apiFetch } from '@/lib/apiFetch';
import { queryClient } from '@/lib/queryClient';
import { Language } from '@/models/languages';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useGetlanguagesQuery(options?: {
    staleTime?: number;
    enabled?: boolean;
    initialData?: Language[];
}) {
    return useQuery({
        queryKey: ['languages'],
        queryFn: async () => {
            const result = await apiFetch<{ data: Language[] }>('/languages/all_languages');
            return result?.data ?? [];
        },
        ...options,
    });
}

export function useAddLanguageMutation() {
    return useMutation({
        mutationKey: ['languages', 'add'],
        mutationFn: async (language: Partial<Language>) => {
            return apiFetch('/languages/create', { method: 'POST', body: language });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['languages'] }),
    });
}

export function useUpdateLanguageMutation() {
    return useMutation({
        mutationKey: ['languages', 'update'],
        mutationFn: async (language: Partial<Language>) => {
            return apiFetch(`/languages/update/${language.language_code}`, {
                method: 'PUT',
                body: language,
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['languages'] }),
    });
}

export function useDeleteLanguageMutation() {
    return useMutation({
        mutationKey: ['languages', 'delete'],
        mutationFn: async (language: Partial<Language>) => {
            return apiFetch(`/languages/destroy/${language.language_code}`, {
                method: 'DELETE',
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['languages'] }),
    });
}
