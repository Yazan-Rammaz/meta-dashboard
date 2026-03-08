import { apiFetch } from '@/lib/apiFetch';
import { queryClient } from '@/lib/queryClient';
import type { PaginatedResponse } from '@/models/pagination';
import { User } from '@/models/users';
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

export function useGetUsersQuery(options?: { initialData?: User[]; page?: number }) {
    const page = options?.page ?? 1;
    return useQuery({
        queryKey: ['users', { page }],
        queryFn: async () => {
            const result = await apiFetch<PaginatedResponse<User>>(`/users?page=${page}`);
            return result?.data ?? [];
        },
        placeholderData: keepPreviousData,
        ...(options?.initialData !== undefined ? { initialData: options.initialData } : {}),
    });
}

export function useGetUsersInfiniteQuery() {
    return useInfiniteQuery({
        queryKey: ['users', 'infinite'],
        queryFn: ({ pageParam }) =>
            apiFetch<PaginatedResponse<User>>(`/users?page=${pageParam}&per_page=12`).then(
                (r) => r!,
            ),
        initialPageParam: 1,
        getNextPageParam: (last) =>
            last.current_page < last.last_page ? last.current_page + 1 : undefined,
    });
}

export function useAddUserMutation() {
    return useMutation({
        mutationKey: ['users', 'add'],
        mutationFn: async (user: Partial<User>) => {
            return apiFetch('/users', { method: 'POST', body: user });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    });
}

export function useUpdateUserMutation() {
    return useMutation({
        mutationKey: ['users', 'update'],
        mutationFn: async (user: Partial<User>) => {
            return apiFetch(`/users/${user.id}`, { method: 'PUT', body: user });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    });
}

export function useDeleteUserMutation() {
    return useMutation({
        mutationKey: ['users', 'delete'],
        mutationFn: async (user: Partial<User>) => {
            return apiFetch(`/users/${user.id}`, { method: 'DELETE' });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    });
}
