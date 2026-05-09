'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Button, Stack, Typography } from '@mui/material';
import WhatsappConnectModal from './WhatsappConnectModal';

export default function IntegrationSlide() {
  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  function handleOpen() {
    setStatus(null);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setConnecting(false);
  }

  function handleCode(code: string) {
    console.log('WhatsApp integration code received:', code);
    setStatus('Connected (code received)');
    setOpen(false);
  }

  return (
    <>
      <Card>
        <CardHeader title="Integrations" subheader="Connect external services" />
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <div>
              <Typography variant="subtitle1">WhatsApp Business</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Connect your WhatsApp Business account to send messages and manage templates.
              </Typography>
              {status && (
                <Typography variant="caption" color="success.main">
                  {status}
                </Typography>
              )}
            </div>

            <Button variant="contained" onClick={handleOpen}>
              Connect WhatsApp
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <WhatsappConnectModal open={open} onClose={handleClose} onCode={handleCode} isLoading={connecting} />
    </>
  );
}
