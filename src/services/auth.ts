import { RootState } from '@/app/store';
import { logout } from '@/features/auth/authSlice';
import { EnterOtpTokenResponse } from '@/types/auth';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  is_blocked_by_admin?: boolean;
  account_status?: string;
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  user: User;
  access_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SendOtpTokenResponse {
  message: string;
}

export interface EnterOtpTokenRequest {
  username: string;
  token: string;
  session_token: string;
}

export interface ResetPasswordUsingOtpRequest {
  id_token: string;
  password: string;
}

export interface ResetPasswordUsingOtpResponse {
  message: string;
}

// Create a custom baseQuery that handles 401 Unauthorized errors
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const access_token = (getState() as RootState)?.auth?.access_token;
    if (access_token) {
      headers.set('authorization', `Bearer ${access_token}`);
    }
    return headers;
  }
});

const unauthBaseQuery = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // Dispatch the logout action
    api.dispatch(logout());
    // Redirect to the login page
    window.location.href = '/login';
  }
  return result;
};

export const api = createApi({
  tagTypes: ['Roles', 'Languages'],
  refetchOnMountOrArgChange: 30,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: unauthBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<UserResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials
      }),
      transformResponse: (response: {
        user: User;
        token: { access_token: string };
      }) => {
        return {
          user: response.user,
          access_token: response.token?.access_token
        };
      }
    }),
    protected: builder.mutation<{ message: string }, void>({
      query: () => 'protected'
    }),
    checkUserName: builder.mutation<User, string>({
      query: (username) => ({
        url: `/users/profile_by_username/${username}`,
        method: 'GET'
      }),
      transformResponse: (response: { data: User }) => {
        return response.data;
      }
    }),
    sendOtpToken: builder.mutation<SendOtpTokenResponse, string>({
      query: (username) => ({
        url: `/auth/password_reset/send_token`,
        method: 'POST',
        body: { username }
      }),
      transformResponse: (response: { data: { message: string } }) => {
        return response.data;
      }
    }),
    enterOtpToken: builder.mutation<
      EnterOtpTokenResponse,
      EnterOtpTokenRequest
    >({
      query: (payload) => ({
        url: `/auth/password_reset/check_token`,
        method: 'POST',
        body: payload
      }),
      transformResponse: (response: { data: EnterOtpTokenResponse }) => {
        return response.data;
      }
    }),
    resetPasswordUsingOtp: builder.mutation<
      ResetPasswordUsingOtpResponse,
      ResetPasswordUsingOtpRequest
    >({
      query: (payload) => ({
        url: `/auth/resetPasswordUsingOTP`,
        method: 'POST',
        body: payload
      }),
      transformResponse: (response: { data: { message: string } }) => {
        return response.data;
      }
    })
  })
});

export const {
  useLoginMutation,
  useProtectedMutation,
  useCheckUserNameMutation,
  useSendOtpTokenMutation,
  useEnterOtpTokenMutation,
  useResetPasswordUsingOtpMutation
} = api;
