import { apiFetch } from '@/lib/apiFetch';
import { useUploadStore } from '@/stores/uploadStore';
import { useMutation } from '@tanstack/react-query';

export function useUploadMutation() {
    return useMutation({
        mutationFn: async ({ payload }: { payload: FormData }) => {
            useUploadStore.getState().setUploadProgress({ name: 'upload', progress: 0 });
            const result = await apiFetch<unknown>('/upload', {
                method: 'POST',
                body: payload,
            });
            useUploadStore.getState().setUploadProgress({ name: 'upload', progress: 100 });
            return result;
        },
    });
}
