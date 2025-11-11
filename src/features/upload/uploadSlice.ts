import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';

type UploadState = {
  uploads: Array<{ name: string; progress: number }>;
};

const slice = createSlice({
  name: 'upload',
  initialState: { uploads: [] } as UploadState,
  reducers: {
    setUploadProgress: (
      state,
      {
        payload: { name, progress }
      }: PayloadAction<{ name: string; progress: number }>
    ) => {
      state.uploads = state.uploads.some((one) => one.name === name)
        ? state.uploads?.map((one) => {
            if (one.name === name) {
              return {
                name: one.name,
                progress: progress
              };
            } else {
              return {
                ...one
              };
            }
          })
        : [...state.uploads, { name, progress }];
    }
  }
});

export const { setUploadProgress } = slice.actions;

export default slice.reducer;

export const selectCurrentUploads = (state: RootState) => state.upload.uploads;
