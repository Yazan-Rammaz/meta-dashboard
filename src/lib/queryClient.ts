import { notifyError } from '@/contexts/toastContext';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => {
            notifyError(error.message);
        },
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            notifyError(error.message);
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
