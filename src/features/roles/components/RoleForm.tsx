import {
  useGetAllPermissionsBySearchMutation,
  useGetpermissionsQuery
} from '@/services/permissions';
import { Role } from '@/types/roles';
import ModalActionButton from '@/ui/Button/modalActionButton';
import Input from '@/ui/Input';
import ModalBody from '@/ui/Modal/ModalBody';
import ModalSection from '@/ui/ModalSection';
import AsyncMultiSelect from '@/ui/MultiSelect';
import useTrans from '@/utils/translation_util';
import { useEffect, useState } from 'react';

interface Props {
  currentData: Role;
  setCurrentData: (data: Role) => void;
  add_button_clk: () => void;
  edit_button_clk: () => void;
  mode: 'add' | 'update' | 'preview';
}

interface SelectedPermissionElement {
  value?: string;
  title?: string;
  description?: string;
}

export default function RoleForm({
  currentData,
  setCurrentData,
  mode,
  add_button_clk,
  edit_button_clk
}: Props) {
  const trans = useTrans();
  const { data: allPermissions, isLoading: isLoadingAllPermissions } =
    useGetpermissionsQuery();
  const [
    searchPermissions,
    { isLoading: isFetchingPermissions, data: searchedPermissions }
  ] = useGetAllPermissionsBySearchMutation();
  const [searchPermission, setSearchPermission] = useState<string>('');
  const [selectedPermission, setSelectedPermission] = useState<
    SelectedPermissionElement[]
  >([]);

  const displayedPermissions = searchPermission
    ? searchedPermissions
    : allPermissions;

  useEffect(() => {
    setSelectedPermission(
      currentData?.permissions?.map((one) => {
        const matchingPermission = allPermissions?.find((p) => p.key === one);
        return {
          value: one as unknown as string,
          title: matchingPermission?.description || one,
          description: matchingPermission?.description || one
        };
      }) ?? []
    );
  }, [currentData, allPermissions]);

  return (
    <ModalBody>
      <>
        <ModalSection title={trans('Role Title & Name')}>
          <>
            <Input
              title={trans('Name')}
              size={4}
              value={currentData.name || ''}
              disabled={mode === 'preview'}
              clear={() => {
                setCurrentData({
                  ...currentData,
                  name: ''
                });
              }}
              onChange={(value: any) => {
                setCurrentData({
                  ...currentData,
                  name: value
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
        <ModalSection title={trans('Role Permissions')}>
          <AsyncMultiSelect
            clear={() => {
              setSelectedPermission([]);
              setSearchPermission('');
              setCurrentData({
                ...currentData,
                permissions: []
              });
            }}
            disabled={mode === 'preview'}
            type="text"
            onChange={(value: any) => {
              setSearchPermission(value);
              searchPermissions(value);
            }}
            data={
              isFetchingPermissions || isLoadingAllPermissions
                ? []
                : displayedPermissions?.map((one) => {
                    return {
                      value: one.key as unknown as string, // Use one.key
                      title: one.description, // Use one.description for display
                      description: one.description
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
                  (one) => one === selected.value // Compare string directly
                )
              ) {
                setSelectedPermission([
                  ...selectedPermission.filter(
                    (one) => one.value !== selected.value
                  )
                ]);
                setCurrentData({
                  ...currentData,
                  permissions: [
                    ...currentData.permissions.filter(
                      (one) => one !== selected.value
                    )
                  ]
                });
              } else {
                setSelectedPermission([...selectedPermission, selected]);
                setCurrentData({
                  ...currentData,
                  permissions: [
                    ...(currentData?.permissions ?? []),
                    selected.value || '' // Add string directly
                  ]
                });
              }
            }}
            value={searchPermission}
            selected={selectedPermission}
          />
        </ModalSection>
        {mode !== 'preview' ? (
          <ModalActionButton
            text={mode === 'add' ? trans('Add Role') : trans('Edit Role')}
            disabled={false}
            onClick={() => {
              if (mode === 'add') {
                add_button_clk();
              } else {
                edit_button_clk();
              }
            }}
          />
        ) : (
          <></>
        )}
      </>
    </ModalBody>
  );
}
