import type { User } from '@/services/auth';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
    user: User | null;
    access_token: string | null;
}

interface AuthActions {
    setCredentials: (credentials: { user: User; access_token: string }) => void;
    logout: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            access_token: null,
            setCredentials: ({ user, access_token }) => set({ user, access_token }),
            logout: () => set({ user: null, access_token: null }),
        }),
        {
            name: 'auth-store',
            storage: createJSONStorage(() => localStorage),
            skipHydration: true,
        },
    ),
);
