import type { RootState } from '@/app/store';
import type { User } from '@/services/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

interface AuthState {
  user: User | null;
  access_token: string | null;
  errorMessage: string | null;
}

const slice = createSlice({
  name: 'auth',
  initialState: {
    user:
      typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('user') || 'null')
        : null,
    access_token:
      typeof window !== 'undefined'
        ? localStorage.getItem('access_token')
        : null,
    errorMessage: null
  } as AuthState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: { user, access_token }
      }: PayloadAction<{ user: User; access_token: string }>
    ) => {
      state.user = user;
      state.access_token = access_token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('access_token', access_token);
      }
    },
    setErrorMessage: (state, { payload }) => {
      if (payload?.payload?.data?.message) {
        toast.error(payload?.payload?.data?.message);
      } else {
        toast.error('network error!');
      }
    },
    logout: (state) => {
      state.user = null;
      state.access_token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
      }
    }
  }
});

export const { setCredentials, setErrorMessage, logout } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
