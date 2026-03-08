import { apiFetch } from '@/lib/apiFetch';
import { queryClient } from '@/lib/queryClient';
import { Client } from '@/models/clients';
import type { PaginatedResponse } from '@/models/pagination';
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

export function useGetClientsQuery(options?: { initialData?: Client[]; page?: number }) {
    const page = options?.page ?? 1;
    return useQuery({
        queryKey: ['clients', { page }],
        queryFn: async () => {
            const result = await apiFetch<PaginatedResponse<Client>>(`/clients?page=${page}`);
            return result?.data ?? [];
        },
        placeholderData: keepPreviousData,
        ...(options?.initialData !== undefined ? { initialData: options.initialData } : {}),
    });
}

export function useGetClientsInfiniteQuery() {
    return useInfiniteQuery({
        queryKey: ['clients', 'infinite'],
        queryFn: ({ pageParam }) =>
            apiFetch<PaginatedResponse<Client>>(`/clients?page=${pageParam}&per_page=12`).then(
                (r) => r!,
            ),
        initialPageParam: 1,
        getNextPageParam: (last) =>
            last.current_page < last.last_page ? last.current_page + 1 : undefined,
    });
}

export function useAddClientMutation() {
    return useMutation({
        mutationKey: ['clients', 'add'],
        mutationFn: async (client: Partial<Client>) => {
            return apiFetch('/clients', { method: 'POST', body: client });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
    });
}

export function useUpdateClientMutation() {
    return useMutation({
        mutationKey: ['clients', 'update'],
        mutationFn: async (client: Partial<Client>) => {
            return apiFetch(`/clients/${client.id}`, { method: 'PUT', body: client });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
    });
}

export function useDeleteClientMutation() {
    return useMutation({
        mutationKey: ['clients', 'delete'],
        mutationFn: async (client: Partial<Client>) => {
            return apiFetch(`/clients/${client.id}`, { method: 'DELETE' });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
    });
}
