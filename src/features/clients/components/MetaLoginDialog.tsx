'use client';

import { MetaAuthResponse } from '@/models/metaAuth';
import { useToast } from '@/contexts/toastContext';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { useCallback, useEffect, useRef, useState } from 'react';

interface MetaLoginDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (data: MetaAuthResponse) => void;
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

export default function MetaLoginDialog({
    open,
    onClose,
    onSuccess,
    loginType,
}: MetaLoginDialogProps) {
    const { showError } = useToast();
    const [sdkStatus, setSdkStatus] = useState<SdkStatus>('loading');
    const [isExchanging, setIsExchanging] = useState(false);
    const scriptRef = useRef<HTMLScriptElement | null>(null);

    const config = getSdkConfig(loginType);
    const hasConfig = config.appId && config.configId;

    const initSdk = useCallback(() => {
        if (!hasConfig) {
            setSdkStatus('error');
            return;
        }

        if (typeof window === 'undefined') return;

        // If FB is already loaded, just reinit
        if (typeof FB !== 'undefined') {
            FB.init({
                appId: config.appId,
                cookie: true,
                xfbml: true,
                version: 'v18.0',
            });
            setSdkStatus('ready');
            return;
        }

        // Load the SDK script
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
                version: 'v18.0',
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
        if (open) {
            setSdkStatus('loading');
            setIsExchanging(false);
            initSdk();
        }

        return () => {
            if (scriptRef.current && document.body.contains(scriptRef.current)) {
                document.body.removeChild(scriptRef.current);
                scriptRef.current = null;
            }
        };
    }, [open, initSdk]);

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
                showError(data.error ?? 'Token exchange failed');
                setIsExchanging(false);
                return;
            }

            onSuccess(data as MetaAuthResponse);
        } catch {
            showError('Token exchange failed');
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
                showError('Authentication cancelled');
            }
        }, loginOptions);
    }

    const dialogTitle = loginType === 'whatsapp' ? 'Connect WhatsApp' : 'Connect Meta';

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            sx={{ zIndex: 1300 }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {dialogTitle}
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <div className="w-full h-[300px] flex justify-center items-center">
                    {sdkStatus === 'loading' && <CircularProgress />}

                    {sdkStatus === 'error' && (
                        <div className="text-center px-4">
                            <p className="text-red-500 text-sm mb-2">
                                {!hasConfig
                                    ? 'Facebook SDK configuration is missing. Please check environment variables.'
                                    : 'Failed to load Facebook SDK. Please check your network connection.'}
                            </p>
                            {hasConfig && (
                                <button
                                    className="px-4 py-2 font-medium text-xs rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                                    onClick={() => {
                                        setSdkStatus('loading');
                                        initSdk();
                                    }}
                                >
                                    Retry
                                </button>
                            )}
                        </div>
                    )}

                    {sdkStatus === 'ready' && !isExchanging && (
                        <button
                            className="px-4 py-2 font-medium text-xs rounded-lg bg-indigo-600 hover:bg-indigo-400 text-white"
                            onClick={handleLogin}
                        >
                            Login with Facebook
                        </button>
                    )}

                    {isExchanging && (
                        <div className="flex flex-col items-center gap-2">
                            <CircularProgress size={24} />
                            <span className="text-sm text-gray-500">Connecting...</span>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
