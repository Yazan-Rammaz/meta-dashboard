import authReducer, { setErrorMessage } from '@/features/auth/authSlice';
import uploadReducer from '@/features/upload/uploadSlice';
import viewModeReducer from '@/features/view_mode/viewModeSlice';
import { api } from '@/services/auth';
import {
  configureStore,
  isRejectedWithValue,
  Middleware
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
  if (isRejectedWithValue(action)) {
    console.warn('We got a rejected action!');
    store.dispatch(
      setErrorMessage({
        payload: action.payload
      })
    );
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    upload: uploadReducer,
    viewMode: viewModeReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, rtkQueryErrorLogger)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
