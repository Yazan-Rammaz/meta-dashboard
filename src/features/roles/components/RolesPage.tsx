import ListComponent from '@/components/List';
import ListItemComponent from '@/components/List/ListItem';
import SuspenseLoader from '@/components/SuspenseLoader';
import RoleListItem from '@/features/roles/components/RoleListItem';
import RoleModal from '@/features/roles/components/RoleModal';
import { TopNav } from '@/features/shared/components/DashboardShared';
import { Role, RoleTranslation } from '@/models/roles';
import HRMIcon from '@/ui/icons/HRM.svg';
import ModalComponent from '@/ui/Modal';
import ModalHeader from '@/ui/Modal/ModalHeader';
import ShowTrans, { transformTranslations } from '@/utils/showTrans';
import useTrans from '@/utils/translation_util';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  useAddRoleMutation,
  useDeleteRoleMutation,
  useGetRolesQuery,
  useUpdateRoleMutation
} from 'src/services/roles';

const initialState: Role = {
  id: undefined,
  permissions: [],
  role_translations: [],
  title: ''
};

function HRM() {
  const trans = useTrans();

  const { data: Roles, isLoading: isLoadingRoles } = useGetRolesQuery();
  const [
    addRole,
    {
      isLoading: isAddLoading,
      isSuccess: isAddSuccess,
      isError: isAddError,
      reset: resetAdd
    }
  ] = useAddRoleMutation();
  const [
    updateRole,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      reset: resetUpdate
    }
  ] = useUpdateRoleMutation();
  const [
    deleteRole,
    {
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess,
      isError: isDeleteError,
      reset: resetDelete
    }
  ] = useDeleteRoleMutation();
  const [open, setOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<'add' | 'update' | 'preview'>('preview');
  const [currentData, setCurrentData] = useState<Role>(initialState);

  const translatedRoleName = useMemo(() => {
    if (!currentData.role_translations) {
      return {};
    }
    return transformTranslations<RoleTranslation>(
      currentData.role_translations
    );
  }, [currentData.role_translations]);

  useEffect(() => {
    if (
      currentData.id === undefined &&
      JSON.stringify(currentData) !== JSON.stringify(initialState)
    ) {
      setCurrentData(initialState);
    }
  }, [currentData]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      resetAdd();
      resetDelete();
      resetUpdate();
    }, 1500);
    return () => clearTimeout(timeout);
  }, [
    isAddSuccess,
    isAddError,
    isUpdateError,
    isUpdateSuccess,
    isDeleteSuccess,
    isDeleteError
  ]);

  return (
    <>
      <Helmet>
        <title>{trans('Roles')}</title>
      </Helmet>
      <TopNav
        add_permission="CREATE_ROLES"
        table_icon={HRMIcon}
        table_name={trans('Roles')}
        top_name_clk={() => {}}
        open_button_clk={() => {
          setCurrentData(initialState);
          setMode('add');
          setOpen(true);
        }}
        haveView={false}
      />
      {isAddLoading || isUpdateLoading || isDeleteLoading ? (
        <SuspenseLoader />
      ) : (
        <></>
      )}
      <div style={{ padding: '70px 20px 20px 20px' }}>
        {isLoadingRoles ? (
          <SuspenseLoader />
        ) : (
          <ListComponent>
            <>
              {mode === 'add' && open ? (
                <ListItemComponent
                  isLoading={isAddLoading}
                  isSuccess={isAddSuccess}
                  isError={isAddError}
                  hasDelete={false}
                  hasAddChild={false}
                >
                  <>
                    {(ShowTrans({
                      Translations: translatedRoleName,
                      field_name: 'name'
                    }) ?? ''.length > 0)
                      ? ShowTrans({
                          Translations: translatedRoleName,
                          field_name: 'name'
                        })
                      : currentData.title}
                  </>
                </ListItemComponent>
              ) : (
                <></>
              )}
              {Roles?.map((one, index) => (
                <RoleListItem
                  key={one.id}
                  one={one}
                  index={index}
                  currentData={currentData}
                  isUpdateLoading={isUpdateLoading}
                  isDeleteLoading={isDeleteLoading}
                  isUpdateSuccess={isUpdateSuccess}
                  isDeleteSuccess={isDeleteSuccess}
                  isUpdateError={isUpdateError}
                  isDeleteError={isDeleteError}
                  setMode={setMode}
                  setCurrentData={setCurrentData}
                  setOpen={setOpen}
                />
              ))}
            </>
          </ListComponent>
        )}
        {
          <ModalComponent open={open}>
            <>
              <ModalHeader
                add_permission="CREATE_ROLES"
                update_permission="UPDATE_ROLES"
                delete_permission="DELETE_ROLES"
                Delete={() => {
                  deleteRole(currentData);
                  setOpen(false);
                }}
                close={() => {
                  setOpen(false);
                  setCurrentData(initialState);
                }}
                title={currentData?.title ? currentData.title : trans('Role')}
                mode={mode}
                icon={<></>}
                edit={() => {
                  setOpen(true);
                  setMode('update');
                }}
                hasAddSub={false}
                addChild={() => {}}
                clear_button_clk={() => {
                  if (mode === 'update') {
                    if (Roles?.filter((one) => one.id === currentData.id)[0])
                      setCurrentData(
                        Roles?.filter((one) => one.id === currentData.id)[0]
                      );
                  } else {
                    setCurrentData(initialState);
                  }
                }}
              />
              <RoleModal
                currentData={currentData}
                setCurrentData={setCurrentData}
                mode={mode}
                add_button_clk={() => {
                  addRole(currentData);
                  setOpen(false);
                  setCurrentData(initialState);
                }}
                edit_button_clk={() => {
                  updateRole(currentData);
                  setOpen(false);
                  setMode('preview');
                }}
              />
            </>
          </ModalComponent>
        }
      </div>
    </>
  );
}

export default HRM;
