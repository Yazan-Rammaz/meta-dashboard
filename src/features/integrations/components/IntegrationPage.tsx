'use client';

import MetaLoginDialog from '@/features/clients/components/MetaLoginDialog';
import { useToast } from '@/contexts/toastContext';
import { MetaAuthResponse } from '@/models/metaAuth';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useState } from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function IntegrationPage() {
    const { showSuccess } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [connected, setConnected] = useState(false);
    const [accountInfo, setAccountInfo] = useState<MetaAuthResponse | null>(null);

    const handleSuccess = (data: MetaAuthResponse) => {
        setAccountInfo(data);
        setConnected(true);
        setDialogOpen(false);
        showSuccess(data.message ?? 'WhatsApp account connected successfully');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={600} mb={1}>
                WhatsApp Integration
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
                Connect your WhatsApp Business account to enable messaging capabilities.
            </Typography>

            <Box
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 3,
                    maxWidth: 480,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <WhatsAppIcon sx={{ color: '#25D366', fontSize: 32 }} />
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                            WhatsApp Business
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Connect via Facebook Meta to link your WhatsApp Business account
                        </Typography>
                    </Box>
                </Box>

                {connected && accountInfo && (
                    <Box
                        sx={{
                            bgcolor: 'success.lighter',
                            border: '1px solid',
                            borderColor: 'success.light',
                            borderRadius: 1,
                            p: 1.5,
                        }}
                    >
                        <Typography variant="body2" color="success.dark" fontWeight={500}>
                            Connected successfully
                        </Typography>
                        {accountInfo.phoneNumber && (
                            <Typography variant="body2" color="text.secondary">
                                Phone: {accountInfo.phoneNumber}
                            </Typography>
                        )}
                        {accountInfo.accountId && (
                            <Typography variant="body2" color="text.secondary">
                                Business ID: {accountInfo.accountId}
                            </Typography>
                        )}
                    </Box>
                )}

                <Button
                    variant="contained"
                    startIcon={<WhatsAppIcon />}
                    onClick={() => setDialogOpen(true)}
                    sx={{
                        bgcolor: '#25D366',
                        '&:hover': { bgcolor: '#1ebe5d' },
                        alignSelf: 'flex-start',
                        textTransform: 'none',
                    }}
                >
                    {connected ? 'Reconnect WhatsApp' : 'Connect WhatsApp'}
                </Button>
            </Box>

            <MetaLoginDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSuccess={handleSuccess}
                loginType="whatsapp"
            />
        </Box>
    );
}
