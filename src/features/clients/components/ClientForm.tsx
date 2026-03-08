'use client';

import { useToast } from '@/contexts/toastContext';
import { createClientAction, updateClientAction } from '@/features/clients/actions';
import { queryClient } from '@/lib/queryClient';
import { Client } from '@/models/clients';
import ModalActionButton from '@/ui/Button/modalActionButton';
import Input from '@/ui/Input';
import ModalBody from '@/ui/Modal/ModalBody';
import ModalSection from '@/ui/ModalSection';
import useTrans from '@/utils/translation_util';
import { useTransition } from 'react';

interface Props {
    currentData: Client;
    setCurrentData: (data: Client) => void;
    onClose: () => void;
    mode: 'add' | 'update' | 'preview';
}

export default function ClientForm({ currentData, setCurrentData, mode, onClose }: Props) {
    const trans = useTrans();
    const { showSuccess, showError } = useToast();
    const [isPending, startTransition] = useTransition();

    return (
        <ModalBody>
            <>
                <ModalSection title={trans('Client Details')}>
                    <>
                        <Input
                            size={4}
                            title={trans('Name')}
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
                            title={trans('Display Phone Number')}
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
                            title={trans('Phone Number ID')}
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
                            title={trans('WhatsApp Business ID')}
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
                            title={trans('Webhook URL')}
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
                            title={trans('Rate Limit Per Minute')}
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
                            title={trans('Status')}
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
                {mode !== 'preview' ? (
                    <ModalActionButton
                        text={mode === 'add' ? trans('Add Client') : trans('Edit Client')}
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
                                    showSuccess(
                                        trans(mode === 'add' ? 'Client saved' : 'Client updated'),
                                    );
                                    onClose();
                                } else {
                                    showError(result.error ?? trans('Failed'));
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
