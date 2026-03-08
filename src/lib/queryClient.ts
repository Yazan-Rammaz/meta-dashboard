import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => {
            // Errors are already handled by apiFetch with detailed messages
            // Just log to console for debugging
            console.error('Query error:', error);
        },
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            // Errors are already handled by apiFetch with detailed messages
            // Just log to console for debugging
            console.error('Mutation error:', error);
        },
    }),
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            retry: 1,
        },
    },
});
