'use client';

import { useToast } from '@/contexts/toastContext';
import { createClientAction, updateClientAction } from '@/features/clients/actions';
import { queryClient } from '@/lib/queryClient';
import { Client } from '@/models/clients';
import { MetaAuthResponse } from '@/models/metaAuth';
import MetaLoginDialog from '@/features/clients/components/MetaLoginDialog';
import ModalActionButton from '@/ui/Button/modalActionButton';
import Input from '@/ui/Input';
import ModalBody from '@/ui/Modal/ModalBody';
import ModalSection from '@/ui/ModalSection';
import Button from '@mui/material/Button';
import { useState, useTransition } from 'react';

interface Props {
    currentData: Client;
    setCurrentData: (data: Client) => void;
    onClose: () => void;
    mode: 'add' | 'update' | 'preview';
}

export default function ClientForm({ currentData, setCurrentData, mode, onClose }: Props) {
    const { showSuccess, showError } = useToast();
    const [isPending, startTransition] = useTransition();
    const [metaDialogOpen, setMetaDialogOpen] = useState(false);
    const [metaLoginType, setMetaLoginType] = useState<'whatsapp' | 'meta'>('whatsapp');

    const handleMetaSuccess = (data: MetaAuthResponse) => {
        setCurrentData({
            ...currentData,
            access_token: data.access_token,
            whatsapp_business_id: data.whatsapp_business_id,
            phone_number_id: data.phone_number_id,
            display_phone_number: data.display_phone_number,
        });
        setMetaDialogOpen(false);
        showSuccess('Account connected successfully');
    };

    return (
        <ModalBody>
            <>
                <ModalSection title={'Client Details'}>
                    <>
                        <Input
                            size={4}
                            title={'Name'}
                            value={currentData.name || ''}
                            disabled={mode === 'preview'}
                            clear={() => {
                                setCurrentData({
                                    ...currentData,
                                    name: '',
                                });
                            }}
                            onChange={(value: string | number) => {
                                setCurrentData({
                                    ...currentData,
                                    name: String(value),
                                });
                            }}
                            type="text"
                        />
                        <Input
                            size={4}
                            title={'Display Phone Number'}
                            value={currentData.display_phone_number || ''}
                            disabled={mode === 'preview'}
                            clear={() => {
                                setCurrentData({
                                    ...currentData,
                                    display_phone_number: '',
                                });
                            }}
                            onChange={(value: string | number) => {
                                setCurrentData({
                                    ...currentData,
                                    display_phone_number: String(value),
                                });
                            }}
                            type="text"
                        />
                        <Input
                            size={4}
                            title={'Phone Number ID'}
                            value={currentData.phone_number_id || ''}
                            disabled={mode === 'preview'}
                            clear={() => {
                                setCurrentData({
                                    ...currentData,
                                    phone_number_id: '',
                                });
                            }}
                            onChange={(value: string | number) => {
                                setCurrentData({
                                    ...currentData,
                                    phone_number_id: String(value),
                                });
                            }}
                            type="text"
                        />
                        <Input
                            size={4}
                            title={'WhatsApp Business ID'}
                            value={currentData.whatsapp_business_id || ''}
                            disabled={mode === 'preview'}
                            clear={() => {
                                setCurrentData({
                                    ...currentData,
                                    whatsapp_business_id: '',
                                });
                            }}
                            onChange={(value: string | number) => {
                                setCurrentData({
                                    ...currentData,
                                    whatsapp_business_id: String(value),
                                });
                            }}
                            type="text"
                        />
                        <Input
                            size={4}
                            title={'Webhook URL'}
                            value={currentData.webhook_url || ''}
                            disabled={mode === 'preview'}
                            clear={() => {
                                setCurrentData({
                                    ...currentData,
                                    webhook_url: null,
                                });
                            }}
                            onChange={(value: string | number) => {
                                setCurrentData({
                                    ...currentData,
                                    webhook_url: value === '' ? null : String(value),
                                });
                            }}
                            type="text"
                        />
                        <Input
                            size={4}
                            title={'Rate Limit Per Minute'}
                            value={currentData.rate_limit_per_minute?.toString() || ''}
                            disabled={mode === 'preview'}
                            clear={() => {
                                setCurrentData({
                                    ...currentData,
                                    rate_limit_per_minute: 0,
                                });
                            }}
                            onChange={(value: string | number) => {
                                setCurrentData({
                                    ...currentData,
                                    rate_limit_per_minute: Number(value),
                                });
                            }}
                            type="number"
                        />
                        <Input
                            size={4}
                            title={'Status'}
                            value={currentData.status || ''}
                            disabled={mode === 'preview'}
                            clear={() => {
                                setCurrentData({
                                    ...currentData,
                                    status: '',
                                });
                            }}
                            onChange={(value: string | number) => {
                                setCurrentData({
                                    ...currentData,
                                    status: String(value),
                                });
                            }}
                            type="text"
                        />
                    </>
                </ModalSection>
                {mode !== 'preview' && (
                    <ModalSection title={'Meta Integration'}>
                        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                    setMetaLoginType('whatsapp');
                                    setMetaDialogOpen(true);
                                }}
                                sx={{ flex: 1, textTransform: 'none' }}
                            >
                                Connect WhatsApp
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                    setMetaLoginType('meta');
                                    setMetaDialogOpen(true);
                                }}
                                sx={{ flex: 1, textTransform: 'none' }}
                            >
                                Connect Meta
                            </Button>
                        </div>
                    </ModalSection>
                )}
                <MetaLoginDialog
                    open={metaDialogOpen}
                    onClose={() => setMetaDialogOpen(false)}
                    onSuccess={handleMetaSuccess}
                    loginType={metaLoginType}
                />
                {mode !== 'preview' ? (
                    <ModalActionButton
                        text={mode === 'add' ? 'Add Client' : 'Edit Client'}
                        disabled={isPending}
                        loading={isPending}
                        onClick={() => {
                            startTransition(async () => {
                                const result =
                                    mode === 'add'
                                        ? await createClientAction(
                                              currentData as Omit<Client, 'id'>,
                                          )
                                        : await updateClientAction(currentData.id!, currentData);
                                if (result.success) {
                                    result.invalidateKeys?.forEach((k) =>
                                        queryClient.invalidateQueries({ queryKey: [k] }),
                                    );
                                    showSuccess(mode === 'add' ? 'Client saved' : 'Client updated');
                                    onClose();
                                } else {
                                    showError(result.error ?? 'Failed');
                                }
                            });
                        }}
                    />
                ) : (
                    <></>
                )}
            </>
        </ModalBody>
    );
}
