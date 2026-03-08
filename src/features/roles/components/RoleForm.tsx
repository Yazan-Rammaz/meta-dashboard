'use client';

import { useToast } from '@/contexts/toastContext';
import { createRoleAction, updateRoleAction } from '@/features/roles/actions';
import { queryClient } from '@/lib/queryClient';
import { Role } from '@/models/roles';
import { useGetAllPermissionsBySearchQuery, useGetpermissionsQuery } from '@/services/permissions';
import ModalActionButton from '@/ui/Button/modalActionButton';
import Input from '@/ui/Input';
import ModalBody from '@/ui/Modal/ModalBody';
import ModalSection from '@/ui/ModalSection';
import AsyncMultiSelect from '@/ui/MultiSelect';
import { useEffect, useState, useTransition } from 'react';

interface Props {
    currentData: Role;
    setCurrentData: (data: Role) => void;
    onClose: () => void;
    mode: 'add' | 'update' | 'preview';
}

interface SelectedPermissionElement {
    value?: string;
    title?: string;
    description?: string;
}

export default function RoleForm({ currentData, setCurrentData, mode, onClose }: Props) {
    const { showSuccess, showError } = useToast();
    const [isPending, startTransition] = useTransition();
    const { data: allPermissions, isLoading: isLoadingAllPermissions } = useGetpermissionsQuery();
    const [searchPermission, setSearchPermission] = useState<string>('');
    const { isLoading: isFetchingPermissions, data: searchedPermissions } =
        useGetAllPermissionsBySearchQuery(searchPermission);
    const [selectedPermission, setSelectedPermission] = useState<SelectedPermissionElement[]>([]);

    const displayedPermissions = searchPermission ? searchedPermissions : allPermissions;

    useEffect(() => {
        setSelectedPermission(
            currentData?.permissions?.map((one) => {
                const matchingPermission = allPermissions?.find((p) => p.key === one);
                return {
                    value: one as unknown as string,
                    title: matchingPermission?.description || one,
                    description: matchingPermission?.description || one,
                };
            }) ?? [],
        );
    }, [currentData, allPermissions]);

    return (
        <ModalBody>
            <>
                <ModalSection title={'Role Title & Name'}>
                    <>
                        <Input
                            title={'Name'}
                            size={4}
                            value={currentData.name || ''}
                            disabled={mode === 'preview'}
                            clear={() => {
                                setCurrentData({
                                    ...currentData,
                                    name: '',
                                });
                            }}
                            onChange={(value: any) => {
                                setCurrentData({
                                    ...currentData,
                                    name: value,
                                });
                            }}
                            type="text"
                        />
                        {/* {!isLoadingLanguages &&
              languages?.length &&
              languages?.map((language, index) => (
                <Input
                  size={index === 0 ? 6 : 5}
                  key={index}
                  title={language.language_code}
                  value={
                    currentData.role_translations?.filter(
                      (one) => one.language_code === language.language_code
                    )[0]?.name || ''
                  }
                  disabled={mode === 'preview'}
                  clear={() => {
                    if (
                      currentData.role_translations?.filter(
                        (one) => one.language_code === language.language_code
                      )?.length
                    ) {
                      setCurrentData({
                        ...currentData,
                        role_translations: currentData.role_translations?.map(
                          (one) => {
                            if (one.language_code === language.language_code) {
                              return { ...one, name: '' };
                            } else {
                              return { ...one };
                            }
                          }
                        )
                      });
                    } else {
                      setCurrentData({
                        ...currentData,
                        role_translations: [
                          ...(currentData?.role_translations ?? []),
                          {
                            ...initialRoleTranslationState,
                            language_code: language.language_code,
                            name: ''
                          }
                        ]
                      });
                    }
                  }}
                  onChange={(value: any) => {
                    if (
                      currentData?.role_translations?.filter(
                        (one) => one.language_code === language.language_code
                      )?.length
                    ) {
                      setCurrentData({
                        ...currentData,
                        role_translations: currentData.role_translations?.map(
                          (one) => {
                            if (one.language_code === language.language_code) {
                              return { ...one, name: String(value) };
                            } else {
                              return { ...one };
                            }
                          }
                        )
                      });
                    } else {
                      setCurrentData({
                        ...currentData,
                        role_translations: [
                          ...(currentData.role_translations ?? []),
                          {
                            ...initialRoleTranslationState,
                            language_code: language.language_code,
                            name: String(value)
                          }
                        ]
                      });
                    }
                  }}
                  type="text"
                />
              ))} */}
                    </>
                </ModalSection>
                <ModalSection title={'Role Permissions'}>
                    <AsyncMultiSelect
                        clear={() => {
                            setSelectedPermission([]);
                            setSearchPermission('');
                            setCurrentData({
                                ...currentData,
                                permissions: [],
                            });
                        }}
                        disabled={mode === 'preview'}
                        type="text"
                        onChange={(value: any) => {
                            setSearchPermission(value);
                        }}
                        data={
                            isFetchingPermissions || isLoadingAllPermissions
                                ? []
                                : displayedPermissions?.map((one) => {
                                      return {
                                          value: one.key as unknown as string, // Use one.key
                                          title: one.description, // Use one.description for display
                                          description: one.description,
                                      };
                                  })
                        }
                        size={10}
                        onSelect={(selected: {
                            value?: string;
                            title?: string;
                            description?: string;
                        }) => {
                            if (
                                currentData?.permissions?.some(
                                    (one) => one === selected.value, // Compare string directly
                                )
                            ) {
                                setSelectedPermission([
                                    ...selectedPermission.filter(
                                        (one) => one.value !== selected.value,
                                    ),
                                ]);
                                setCurrentData({
                                    ...currentData,
                                    permissions: [
                                        ...currentData.permissions.filter(
                                            (one) => one !== selected.value,
                                        ),
                                    ],
                                });
                            } else {
                                setSelectedPermission([...selectedPermission, selected]);
                                setCurrentData({
                                    ...currentData,
                                    permissions: [
                                        ...(currentData?.permissions ?? []),
                                        selected.value || '', // Add string directly
                                    ],
                                });
                            }
                        }}
                        value={searchPermission}
                        selected={selectedPermission}
                    />
                </ModalSection>
                {mode !== 'preview' ? (
                    <ModalActionButton
                        text={mode === 'add' ? 'Add Role' : 'Edit Role'}
                        disabled={isPending}
                        loading={isPending}
                        onClick={() => {
                            startTransition(async () => {
                                const result =
                                    mode === 'add'
                                        ? await createRoleAction(currentData as Omit<Role, 'id'>)
                                        : await updateRoleAction(currentData.id!, currentData);
                                if (result.success) {
                                    result.invalidateKeys?.forEach((k) =>
                                        queryClient.invalidateQueries({ queryKey: [k] }),
                                    );
                                    showSuccess(
                                        mode === 'add' ? 'Role saved' : 'Role updated'
                                    );
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
