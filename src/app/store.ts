import {
  configureStore,
  Middleware,
  isRejectedWithValue
} from '@reduxjs/toolkit';
import { api } from '@/services/auth';
import authReducer, { setErrorMessage } from '@/features/auth/authSlice';
import uploadReducer from '@/features/upload/uploadSlice';
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
    upload: uploadReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware).concat(rtkQueryErrorLogger)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
