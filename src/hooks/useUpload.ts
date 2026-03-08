import { useUploadStore } from '@/stores/uploadStore';
import { useMemo } from 'react';

export const useUploadProgress = () => {
    const uploads = useUploadStore((s) => s.uploads);

    return useMemo(() => ({ uploads }), [uploads]);
};
