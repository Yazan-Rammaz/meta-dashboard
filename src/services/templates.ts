import { apiFetch } from '@/lib/apiFetch';
import type { PaginatedResponse } from '@/models/pagination';
import type { Template, TemplatePaginatedResponse } from '@/models/templates';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';

// Map API response to internal PaginatedResponse format
function mapToPaginatedResponse(response: TemplatePaginatedResponse): PaginatedResponse<Template> {
    return {
        data: response.data,
        total: response.pagination.total,
        per_page: response.pagination.limit,
        current_page: response.pagination.page,
        last_page: response.pagination.total_pages,
    };
}

export function useGetTemplatesQuery(options?: { initialData?: PaginatedResponse<Template>; page?: number }) {
    const page = options?.page ?? 1;
    return useQuery({
        queryKey: ['templates', { page }],
        queryFn: async () => {
            const result = await apiFetch<TemplatePaginatedResponse>(`/templates?page=${page}`);
            if (!result) return { data: [], total: 0, per_page: 10, current_page: 1, last_page: 1 };
            return mapToPaginatedResponse(result);
        },
        placeholderData: keepPreviousData,
        ...(options?.initialData !== undefined ? { initialData: options.initialData } : {}),
    });
}

export function useGetTemplatesInfiniteQuery() {
    return useInfiniteQuery({
        queryKey: ['templates', 'infinite'],
        queryFn: async ({ pageParam }) => {
            const result = await apiFetch<TemplatePaginatedResponse>(`/templates?page=${pageParam}&limit=12`);
            if (!result) throw new Error('Failed to fetch templates');
            return mapToPaginatedResponse(result);
        },
        initialPageParam: 1,
        getNextPageParam: (last) =>
            last.current_page < last.last_page ? last.current_page + 1 : undefined,
    });
}
