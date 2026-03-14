'use client';

import { useToast } from '@/contexts/toastContext';
import {
    META_LOGIN_FRAME_SOURCE,
    MetaLoginFrameMessage,
} from '@/features/clients/components/metaLoginFrameMessages';
import { MetaAuthResponse } from '@/models/metaAuth';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';

interface MetaLoginDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (data: MetaAuthResponse) => void;
    loginType: 'whatsapp' | 'meta';
}

export default function MetaLoginDialog({
    open,
    onClose,
    onSuccess,
    loginType,
}: MetaLoginDialogProps) {
    const { showError } = useToast();
    const [showWhoerFrame, setShowWhoerFrame] = useState(false);

    useEffect(() => {
        if (open) {
            setShowWhoerFrame(false);
        }
    }, [open]);

    useEffect(() => {
        if (!open || typeof window === 'undefined') {
            return;
        }

        function handleFrameMessage(event: MessageEvent<MetaLoginFrameMessage>) {
            if (event.origin !== window.location.origin) {
                return;
            }

            const data = event.data;
            if (!data || data.source !== META_LOGIN_FRAME_SOURCE) {
                return;
            }

            if (data.type === 'success') {
                onSuccess(data.payload as MetaAuthResponse);
                return;
            }

            if (data.type === 'error') {
                showError(data.message);
            }
        }

        window.addEventListener('message', handleFrameMessage);

        return () => {
            window.removeEventListener('message', handleFrameMessage);
        };
    }, [open, onSuccess, showError]);

    function handleTest() {
        setShowWhoerFrame(true);
    }

    const dialogTitle = loginType === 'whatsapp' ? 'Connect WhatsApp' : 'Connect Meta';
    const loginFrameSrc = `/meta-login-frame?loginType=${loginType}`;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ zIndex: 1300 }}>
            <DialogTitle
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                {dialogTitle}
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                {showWhoerFrame ? (
                    <div className="w-full">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <span className="text-sm font-medium text-gray-700">
                                whoer.net iframe test
                            </span>
                            <button
                                className="px-3 py-1 font-medium text-xs rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                                onClick={() => setShowWhoerFrame(false)}
                            >
                                Back
                            </button>
                        </div>
                        <div className="h-[420px] w-full bg-gray-50">
                            <iframe
                                title="Whoer Test"
                                src="https://whoer.net/"
                                className="h-full w-full border-0"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <p className="px-4 py-3 text-xs text-gray-500">
                            If the iframe stays blank or shows a browser error, whoer.net is
                            blocking embedding with security headers.
                        </p>
                    </div>
                ) : (
                    <div className="w-full">
                        <div className="flex items-center justify-end border-b px-4 py-3">
                            <button
                                className="px-4 py-2 font-medium text-xs rounded-lg bg-indigo-600 hover:bg-indigo-400 text-white"
                                onClick={handleTest}
                            >
                                Open whoer test
                            </button>
                        </div>
                        <div className="h-[420px] w-full bg-white">
                            <iframe
                                key={loginType}
                                title={`${dialogTitle} iframe`}
                                src={loginFrameSrc}
                                className="h-full w-full border-0"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
