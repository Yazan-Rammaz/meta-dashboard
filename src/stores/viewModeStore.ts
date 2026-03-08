import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ViewMode = 'list' | 'table';

interface ViewModeStore {
    mode: ViewMode;
    setMode: (mode: ViewMode) => void;
}

export const useViewModeStore = create<ViewModeStore>()(
    persist(
        (set) => ({
            mode: 'list',
            setMode: (mode) => set({ mode }),
        }),
        {
            name: 'view-mode-store',
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
