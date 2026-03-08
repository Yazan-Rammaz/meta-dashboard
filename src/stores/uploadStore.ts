import { create } from 'zustand';

interface UploadEntry {
    name: string;
    progress: number;
}

interface UploadStore {
    uploads: UploadEntry[];
    setUploadProgress: (entry: { name: string; progress: number }) => void;
    clearUpload: (name: string) => void;
}

export const useUploadStore = create<UploadStore>()((set) => ({
    uploads: [],
    setUploadProgress: ({ name, progress }) =>
        set((state) => ({
            uploads: state.uploads.some((u) => u.name === name)
                ? state.uploads.map((u) => (u.name === name ? { name, progress } : u))
                : [...state.uploads, { name, progress }],
        })),
    clearUpload: (name) =>
        set((state) => ({
            uploads: state.uploads.filter((u) => u.name !== name),
        })),
}));
