'use client';

import { useToast } from '@/contexts/toastContext';
import { createUserAction, updateUserAction } from '@/features/users/actions';
import { queryClient } from '@/lib/queryClient';
import { User } from '@/models/users';
import ModalActionButton from '@/ui/Button/modalActionButton';
import Input from '@/ui/Input';
import ModalBody from '@/ui/Modal/ModalBody';
import ModalSection from '@/ui/ModalSection';
import useTrans from '@/utils/translation_util';
import { useTransition } from 'react';

interface Props {
    currentData: User;
    setCurrentData: (data: User) => void;
    onClose: () => void;
    mode: 'add' | 'update' | 'preview';
}

export default function UserForm({ currentData, setCurrentData, mode, onClose }: Props) {
    const trans = useTrans();
    const { showSuccess, showError } = useToast();
    const [isPending, startTransition] = useTransition();

    return (
        <ModalBody>
            <>
                <ModalSection title={trans('User Details')}>
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
                            title={trans('Email')}
                            value={currentData.email || ''}
                            disabled={mode === 'preview'}
                            clear={() => {
                                setCurrentData({
                                    ...currentData,
                                    email: '',
                                });
                            }}
                            onChange={(value: string | number) => {
                                setCurrentData({
                                    ...currentData,
                                    email: String(value),
                                });
                            }}
                            type="email"
                        />
                        {mode === 'add' && (
                            <Input
                                size={4}
                                title={trans('Password')}
                                value={currentData.password || ''}
                                disabled={false} // Changed from mode === 'preview' to false
                                clear={() => {
                                    setCurrentData({
                                        ...currentData,
                                        password: '',
                                    });
                                }}
                                onChange={(value: string | number) => {
                                    setCurrentData({
                                        ...currentData,
                                        password: String(value),
                                    });
                                }}
                                type="password"
                                showPasswordToggle={true}
                            />
                        )}

                        <Input
                            size={4}
                            title={trans('Role')}
                            value={currentData.role || ''}
                            disabled={mode === 'preview'}
                            clear={() => {
                                setCurrentData({
                                    ...currentData,
                                    role: '',
                                });
                            }}
                            onChange={(value: string | number) => {
                                setCurrentData({
                                    ...currentData,
                                    role: String(value),
                                });
                            }}
                            type="text"
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
                        text={mode === 'add' ? trans('Add User') : trans('Edit User')}
                        disabled={isPending}
                        loading={isPending}
                        onClick={() => {
                            startTransition(async () => {
                                const result =
                                    mode === 'add'
                                        ? await createUserAction(currentData as Omit<User, 'id'>)
                                        : await updateUserAction(currentData.id!, currentData);
                                if (result.success) {
                                    result.invalidateKeys?.forEach((k) =>
                                        queryClient.invalidateQueries({ queryKey: [k] }),
                                    );
                                    showSuccess(
                                        trans(mode === 'add' ? 'User saved' : 'User updated'),
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
