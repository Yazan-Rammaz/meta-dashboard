'use client';

import {
    META_LOGIN_FRAME_SOURCE,
    MetaLoginFrameMessage,
} from '@/features/clients/components/metaLoginFrameMessages';
import { MetaAuthResponse } from '@/models/metaAuth';
import CircularProgress from '@mui/material/CircularProgress';
import { useCallback, useEffect, useRef, useState } from 'react';

interface MetaLoginFrameContentProps {
    loginType: 'whatsapp' | 'meta';
}

type SdkStatus = 'loading' | 'ready' | 'error';

function getSdkConfig(loginType: 'whatsapp' | 'meta') {
    if (loginType === 'whatsapp') {
        return {
            appId: process.env.NEXT_PUBLIC_WHATSAPP_APP_ID ?? '',
            configId: process.env.NEXT_PUBLIC_WHATSAPP_CONFIG_ID ?? '',
        };
    }

    return {
        appId: process.env.NEXT_PUBLIC_META_APP_ID ?? '',
        configId: process.env.NEXT_PUBLIC_META_CONFIG_ID ?? '',
    };
}

function postFrameMessage(message: MetaLoginFrameMessage) {
    if (typeof window === 'undefined' || window.parent === window) {
        return;
    }

    window.parent.postMessage(message, window.location.origin);
}

export default function MetaLoginFrameContent({ loginType }: MetaLoginFrameContentProps) {
    const [sdkStatus, setSdkStatus] = useState<SdkStatus>('loading');
    const [isExchanging, setIsExchanging] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const scriptRef = useRef<HTMLScriptElement | null>(null);

    const config = getSdkConfig(loginType);
    const hasConfig = config.appId && config.configId;

    const reportError = useCallback((message: string) => {
        setErrorMessage(message);
        postFrameMessage({
            source: META_LOGIN_FRAME_SOURCE,
            type: 'error',
            message,
        });
    }, []);

    const initSdk = useCallback(() => {
        if (!hasConfig) {
            setSdkStatus('error');
            return;
        }

        if (typeof window === 'undefined') return;

        if (typeof FB !== 'undefined') {
            FB.init({
                appId: config.appId,
                cookie: true,
                xfbml: true,
                version: 'v23.0',
            });
            setSdkStatus('ready');
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';

        window.fbAsyncInit = function () {
            FB.init({
                appId: config.appId,
                cookie: true,
                xfbml: true,
                version: 'v23.0',
            });
            setSdkStatus('ready');
        };

        script.onerror = () => {
            setSdkStatus('error');
        };

        document.body.appendChild(script);
        scriptRef.current = script;
    }, [config.appId, hasConfig]);

    useEffect(() => {
        setSdkStatus('loading');
        setIsExchanging(false);
        setErrorMessage(null);
        initSdk();

        return () => {
            if (scriptRef.current && document.body.contains(scriptRef.current)) {
                document.body.removeChild(scriptRef.current);
                scriptRef.current = null;
            }
        };
    }, [initSdk]);

    async function exchangeCode(code: string) {
        setIsExchanging(true);

        try {
            const res = await fetch('/api/clients/exchange-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, login_type: loginType }),
            });

            const data = await res.json();

            if (!res.ok) {
                reportError(data.error ?? 'Token exchange failed');
                setIsExchanging(false);
                return;
            }

            setIsExchanging(false);
            postFrameMessage({
                source: META_LOGIN_FRAME_SOURCE,
                type: 'success',
                payload: data as MetaAuthResponse,
            });
        } catch {
            reportError('Token exchange failed');
            setIsExchanging(false);
        }
    }

    function handleLogin() {
        const loginOptions: fb.LoginOptions & { extras?: unknown } =
            loginType === 'whatsapp'
                ? {
                      config_id: config.configId,
                      response_type: 'code',
                      override_default_response_type: true,
                      extras: {
                          version: 'v3',
                          featureType: 'whatsapp_business_app_onboarding',
                          features: [
                              { name: 'marketing_messages_lite' },
                              { name: 'app_only_install' },
                          ],
                      },
                  }
                : {
                      config_id: config.configId,
                      response_type: 'code',
                      override_default_response_type: true,
                      extras: {
                          setup: {},
                      },
                  };

        FB.login(function (response: fb.StatusResponse) {
            if (response.authResponse) {
                const code = (response.authResponse as unknown as { code: string }).code;
                exchangeCode(code);
            } else {
                reportError('Authentication cancelled');
            }
        }, loginOptions);
    }

    return (
        <div className="flex h-[420px] w-full items-center justify-center bg-white px-6">
            {sdkStatus === 'loading' && <CircularProgress />}

            {sdkStatus === 'error' && (
                <div className="text-center">
                    <p className="mb-3 text-sm text-red-500">
                        {errorMessage ??
                            (!hasConfig
                                ? 'Facebook SDK configuration is missing. Please check environment variables.'
                                : 'Failed to load Facebook SDK. Please check your network connection.')}
                    </p>
                    {hasConfig && (
                        <button
                            className="px-4 py-2 font-medium text-xs rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                            onClick={() => {
                                setSdkStatus('loading');
                                setErrorMessage(null);
                                initSdk();
                            }}
                        >
                            Retry
                        </button>
                    )}
                </div>
            )}

            {sdkStatus === 'ready' && !isExchanging && (
                <div className="text-center">
                    <button
                        className="px-4 py-2 font-medium text-xs rounded-lg bg-indigo-600 hover:bg-indigo-400 text-white"
                        onClick={handleLogin}
                    >
                        Login with Facebook
                    </button>
                </div>
            )}

            {isExchanging && (
                <div className="flex flex-col items-center gap-2">
                    <CircularProgress size={24} />
                    <span className="text-sm text-gray-500">Connecting...</span>
                </div>
            )}
        </div>
    );
}
