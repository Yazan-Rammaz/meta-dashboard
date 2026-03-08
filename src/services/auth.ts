import { apiFetch } from '@/lib/apiFetch';
import { useAuthStore } from '@/stores/authStore';
import { EnterOtpTokenResponse } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';

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

export function useLoginMutation() {
    return useMutation({
        mutationKey: ['auth', 'login'],
        mutationFn: async (credentials: LoginRequest): Promise<UserResponse> => {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error ?? 'Login failed');
            }
            return {
                user: data.user,
                access_token: data.access_token,
            };
        },
        onSuccess: ({ user, access_token }) => {
            useAuthStore.getState().setCredentials({ user, access_token });
        },
    });
}

export function useLogoutMutation() {
    return useMutation({
        mutationKey: ['auth', 'logout'],
        mutationFn: async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
        },
        onSuccess: () => {
            useAuthStore.getState().logout();
        },
    });
}

export function useProtectedMutation() {
    return useMutation({
        mutationKey: ['auth', 'protected'],
        mutationFn: async (): Promise<{ message: string }> => {
            const result = await apiFetch<{ message: string }>('/protected', { method: 'POST' });
            return result ?? { message: '' };
        },
    });
}

export function useCheckUserNameMutation() {
    return useMutation({
        mutationKey: ['auth', 'checkUsername'],
        mutationFn: async (username: string): Promise<User> => {
            const result = await apiFetch<{ data: User }>(`/users/profile_by_username/${username}`);
            return result!.data;
        },
    });
}

export function useSendOtpTokenMutation() {
    return useMutation({
        mutationKey: ['auth', 'sendOtp'],
        mutationFn: async (username: string): Promise<SendOtpTokenResponse> => {
            const result = await apiFetch<{ data: SendOtpTokenResponse }>(
                '/auth/password_reset/send_token',
                { method: 'POST', body: { username } },
            );
            return result!.data;
        },
    });
}

export function useEnterOtpTokenMutation() {
    return useMutation({
        mutationKey: ['auth', 'enterOtp'],
        mutationFn: async (payload: EnterOtpTokenRequest): Promise<EnterOtpTokenResponse> => {
            const result = await apiFetch<{ data: EnterOtpTokenResponse }>(
                '/auth/password_reset/check_token',
                { method: 'POST', body: payload },
            );
            return result!.data;
        },
    });
}

export function useResetPasswordUsingOtpMutation() {
    return useMutation({
        mutationKey: ['auth', 'resetPassword'],
        mutationFn: async (
            payload: ResetPasswordUsingOtpRequest,
        ): Promise<ResetPasswordUsingOtpResponse> => {
            const result = await apiFetch<{ data: ResetPasswordUsingOtpResponse }>(
                '/auth/resetPasswordUsingOTP',
                { method: 'POST', body: payload },
            );
            return result!.data;
        },
    });
}
