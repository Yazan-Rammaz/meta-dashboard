import { apiFetch } from '@/lib/apiFetch';
import { queryClient } from '@/lib/queryClient';
import type { PaginatedResponse } from '@/models/pagination';
import { Role } from '@/models/roles';
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

export function useGetRolesQuery(options?: { initialData?: Role[]; page?: number }) {
    const page = options?.page ?? 1;
    return useQuery({
        queryKey: ['roles', { page }],
        queryFn: async () => {
            const result = await apiFetch<PaginatedResponse<Role>>(`/roles?page=${page}`);
            return result?.data ?? [];
        },
        placeholderData: keepPreviousData,
        ...(options?.initialData !== undefined ? { initialData: options.initialData } : {}),
    });
}

export function useGetRolesInfiniteQuery() {
    return useInfiniteQuery({
        queryKey: ['roles', 'infinite'],
        queryFn: ({ pageParam }) =>
            apiFetch<PaginatedResponse<Role>>(`/roles?page=${pageParam}&per_page=12`).then(
                (r) => r!,
            ),
        initialPageParam: 1,
        getNextPageParam: (last) =>
            last.current_page < last.last_page ? last.current_page + 1 : undefined,
    });
}

export function useAddRoleMutation() {
    return useMutation({
        mutationKey: ['roles', 'add'],
        mutationFn: async (role: Partial<Role>) => {
            return apiFetch('/roles', { method: 'POST', body: role });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
    });
}

export function useUpdateRoleMutation() {
    return useMutation({
        mutationKey: ['roles', 'update'],
        mutationFn: async (role: Partial<Role>) => {
            return apiFetch(`/roles/update/${role.id}`, { method: 'PUT', body: role });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
    });
}

export function useDeleteRoleMutation() {
    return useMutation({
        mutationKey: ['roles', 'delete'],
        mutationFn: async (role: Partial<Role>) => {
            return apiFetch(`/roles/destroy/${role.id}`, { method: 'DELETE' });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
    });
}
