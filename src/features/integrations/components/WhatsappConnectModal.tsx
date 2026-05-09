'use client';

import CloseIcon from '@mui/icons-material/Close';
import { CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  /** Called with the OAuth code returned by Facebook */
  onCode: (code: string) => void;
  isLoading?: boolean;
}

export default function WhatsappConnectModal({ open, onClose, onCode, isLoading }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      // Only accept messages from our own origin
      if (event.origin !== window.location.origin) return;

      console.log('WhatsApp Group Data Received in Modal:', event.data);
      const { type, code, error } = event.data ?? {};

      if (type === 'success' && code) {
        console.log('WhatsApp Success - Code:', code);
        onCode(code);
      } else if (type === 'error') {
        console.error('WhatsApp login error:', error);
        onClose();
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onCode, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Connect WhatsApp Business
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, minHeight: 320, position: 'relative' }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 320, gap: 16 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Connecting your WhatsApp account...
            </Typography>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src="/whatsapp-login"
            style={{ width: '100%', height: 320, border: 'none' }}
            title="WhatsApp Login"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
