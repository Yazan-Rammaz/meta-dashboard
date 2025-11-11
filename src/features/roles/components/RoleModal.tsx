import { useEffect, useState } from 'react';
import { useGetlanguagesQuery } from '@/services/languages';
import { useGetAllPermissionsBySearchMutation } from '@/services/permissions';
import ModalActionButton from '@/ui/Button/modalActionButton';
import Input from '@/ui/Input';
import ModalBody from '@/ui/Modal/ModalBody';
import ModalSection from '@/ui/ModalSection';
import AsyncMultiSelect from '@/ui/MultiSelect';
import { Role, RoleTranslation } from '@/models/roles';
import useTrans from '@/utils/translation_util';

interface Props {
  currentData: Role;
  setCurrentData: (data: Role) => void;
  add_button_clk: () => void;
  edit_button_clk: () => void;
  mode: 'add' | 'update' | 'preview';
}

interface SelectedPermissionElement {
  value?: number;
  title?: string;
  description?: string;
}

export default function RoleModal({
  currentData,
  setCurrentData,
  mode,
  add_button_clk,
  edit_button_clk
}: Props) {
  const trans = useTrans();
  const { data: languages, isLoading: isLoadingLanguages } =
    useGetlanguagesQuery();
  const [
    searchPermissions,
    { isLoading: isFetchingPermissions, data: Permissions }
  ] = useGetAllPermissionsBySearchMutation();
  const [searchPermission, setSearchPermission] = useState<string>('');
  const [selectedPermission, setSelectedPermission] = useState<
    SelectedPermissionElement[]
  >([]);

  const initialRoleTranslationState: RoleTranslation = {
    id: 0, // Assuming a default ID for new translations
    name: '',
    language_code: '', // Will be overridden by language.language_code
    role_id: 0 // Assuming a default role_id
  };

  useEffect(() => {
    setSelectedPermission(
      currentData?.permissions?.map((one) => {
        return {
          value: one.id ? Number(one.id) : undefined,
          title: one.title,
          description: one.description
        };
      }) ?? []
    );
  }, [currentData]);

  return (
    <ModalBody>
      <>
        <ModalSection title={trans('Role Title & Name')}>
          <>
            <Input
              size={4}
              value={currentData.title || ''}
              disabled={mode === 'preview'}
              clear={() => {
                setCurrentData({
                  ...currentData,
                  title: ''
                });
              }}
              onChange={(value: any) => {
                setCurrentData({
                  ...currentData,
                  title: value
                });
              }}
              type="text"
            />
            {!isLoadingLanguages &&
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
              ))}
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
              isFetchingPermissions
                ? []
                : Permissions?.map((one) => {
                    return {
                      value: Number(one.id),
                      title: one.title,
                      description: one.description
                    };
                  })
            }
            size={10}
            onSelect={(selected: {
              value?: number;
              title?: string;
              description?: string;
            }) => {
              if (
                currentData?.permissions?.some(
                  (one) => one.id && Number(one.id) === selected.value
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
                      (one) => one.id && Number(one.id) !== selected.value
                    )
                  ]
                });
              } else {
                setSelectedPermission([...selectedPermission, selected]);
                setCurrentData({
                  ...currentData,
                  permissions: [
                    ...(currentData?.permissions ?? []),
                    {
                      id: selected.value?.toString() ?? '',
                      title: selected.title || ''
                    }
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
