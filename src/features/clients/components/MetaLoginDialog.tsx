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
import { useEffect } from 'react';

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
                <div className="h-[420px] w-full bg-white">
                    <iframe
                        key={loginType}
                        title={`${dialogTitle} iframe`}
                        src={loginFrameSrc}
                        className="h-full w-full border-0"
                        referrerPolicy="no-referrer"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
