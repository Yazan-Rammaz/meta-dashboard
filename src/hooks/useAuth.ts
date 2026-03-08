import { useAuthStore } from '@/stores/authStore';
import { useMemo } from 'react';

export const useAuth = () => {
    const user = useAuthStore((s) => s.user);
    const access_token = useAuthStore((s) => s.access_token);

    return useMemo(() => ({ user, access_token }), [user, access_token]);
};
