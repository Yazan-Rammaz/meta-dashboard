import { apiFetch } from '@/lib/apiFetch';
import { useQuery } from '@tanstack/react-query';

export interface Permission {
    id: string;
    key: string;
    description: string;
    created_at: string;
}

export function useGetpermissionsQuery(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ['permissions', 'me'],
        queryFn: async () => {
            const result = await apiFetch<{ data: Permission[] }>('/users/me/permissions', {
                silent: true, // Don't show toast for permission check errors
            });
            return result?.data ?? [];
        },
        enabled: options?.enabled ?? true,
    });
}

export function useGetAllPermissionsQuery() {
    return useQuery({
        queryKey: ['permissions', 'all'],
        queryFn: async () => {
            const result = await apiFetch<{ data: Permission[] }>('/permissions');
            return result?.data ?? [];
        },
    });
}

export function useGetAllPermissionsBySearchQuery(keyword: string) {
    return useQuery({
        queryKey: ['permissions', 'search', keyword],
        queryFn: async () => {
            const result = await apiFetch<{ data: Permission[] }>(
                `/permissions?search_word=${keyword}`,
            );
            return result?.data ?? [];
        },
        enabled: !!keyword,
    });
}
