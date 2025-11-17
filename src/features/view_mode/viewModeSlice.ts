import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ViewModeState {
  mode: 'list' | 'table';
}

const initialState: ViewModeState = {
  mode:
    typeof window !== 'undefined'
      ? (localStorage.getItem('viewMode') as 'list' | 'table') || 'list'
      : 'list'
};

const viewModeSlice = createSlice({
  name: 'viewMode',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<'list' | 'table'>) => {
      state.mode = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('viewMode', action.payload);
      }
    }
  }
});

export const { setViewMode } = viewModeSlice.actions;

export default viewModeSlice.reducer;
