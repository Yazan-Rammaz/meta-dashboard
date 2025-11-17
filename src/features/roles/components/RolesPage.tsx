import type { RootState } from '@/app/store';
import SuspenseLoader from '@/components/SuspenseLoader';
import RoleForm from '@/features/roles/components/RoleForm';
import RoleListItem from '@/features/roles/components/RoleListItem';
import { TopNav } from '@/features/shared/components/DashboardShared';
import { Role } from '@/types/roles';
import RolesIcon from '@/ui/icons/RolesIcon.js'; // Corrected import for RolesIcon
import ListComponent from '@/ui/List';
import ListItemComponent from '@/ui/List/ListItem';
import ModalComponent from '@/ui/Modal';
import ConfirmationModal from '@/ui/Modal/ConfirmationModal'; // Import ConfirmationModal
import ModalHeader from '@/ui/Modal/ModalHeader';
import TableComponent, { TableColumn } from '@/ui/Table/TableComponent';
import useTrans from '@/utils/translation_util';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import {
  useAddRoleMutation,
  useDeleteRoleMutation,
  useGetRolesQuery,
  useUpdateRoleMutation
} from 'src/services/roles';
import { PermissionKey } from 'src/types/permissions'; // Import PermissionKey enum

const initialState: Role = {
  id: undefined,
  permissions: [],
  // role_translations: [],
  title: ''
};

const roleTableColumns: TableColumn<Role>[] = [
  { id: 'name', label: 'Role Name', minWidth: 170 },
  { id: 'description', label: 'Description', minWidth: 200 },
  {
    id: 'permissions',
    label: 'Permissions',
    minWidth: 100,
    format: (value: string[]) => value?.length.toString() || '0'
  },
  { id: 'actions', label: 'Actions', minWidth: 170, align: 'center' }
];

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
  const [openConfirm, setOpenConfirm] = useState<boolean>(false); // State for confirmation modal
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null); // State to store role to delete

  const viewMode = useSelector((state: RootState) => state.viewMode.mode);

  // const translatedRoleName = useMemo(() => {
  //   if (!currentData.role_translations) {
  //     return {};
  //   }
  //   return transformTranslations<RoleTranslation>(
  //     currentData.role_translations
  //   );
  // }, [currentData.role_translations]);

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

  const handleEditRole = (role: Role) => {
    setCurrentData(role);
    setMode('update');
    setOpen(true);
  };

  const handleDeleteRole = (role: Role) => {
    setRoleToDelete(role);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (roleToDelete) {
      deleteRole(roleToDelete);
      setOpenConfirm(false);
      setOpen(false);
      setRoleToDelete(null);
    }
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setRoleToDelete(null);
  };

  return (
    <>
      <Helmet>
        <title>{trans('Roles')}</title>
      </Helmet>
      <TopNav
        add_permission={PermissionKey.ROLES_CREATE}
        table_icon={RolesIcon}
        table_name={trans('Roles')}
        top_name_clk={() => {}}
        open_button_clk={() => {
          setCurrentData({ ...initialState });
          setMode('add');
          setOpen(true);
        }}
      />
      {isAddLoading || isUpdateLoading || isDeleteLoading ? (
        <SuspenseLoader />
      ) : (
        <></>
      )}
      <div style={{ padding: '70px 20px 20px 20px' }}>
        {isLoadingRoles ? (
          <SuspenseLoader />
        ) : viewMode === 'list' ? (
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
                  <>{currentData.name}</>
                </ListItemComponent>
              ) : (
                <></>
              )}
              {Roles?.map((one, index: number) => (
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
                  handleDeleteClick={handleDeleteRole} // Pass handleDeleteRole to handleDeleteClick prop
                  edit_permission={PermissionKey.ROLES_UPDATE}
                  delete_permission={PermissionKey.ROLES_DELETE}
                />
              ))}
            </>
          </ListComponent>
        ) : (
          <TableComponent
            columns={roleTableColumns}
            data={Roles || []}
            onEdit={handleEditRole}
            onDelete={handleDeleteRole}
            edit_permission={PermissionKey.ROLES_UPDATE}
            delete_permission={PermissionKey.ROLES_DELETE}
            deleteText="Delete"
          />
        )}
        {
          <ModalComponent open={open}>
            <>
              <ModalHeader
                add_permission={PermissionKey.ROLES_CREATE}
                update_permission={PermissionKey.ROLES_UPDATE}
                delete_permission={PermissionKey.ROLES_DELETE}
                Delete={() => {
                  handleDeleteRole(currentData); // Call handleDeleteRole to open confirmation modal
                }}
                close={() => {
                  setOpen(false);
                  setCurrentData(initialState);
                }}
                title={
                  currentData?.name
                    ? `${trans('Role')}: ${currentData.name}`
                    : trans('Role')
                }
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
                    if (
                      Roles?.filter((one: Role) => one.id === currentData.id)[0]
                    )
                      setCurrentData(
                        Roles?.filter(
                          (one: Role) => one.id === currentData.id
                        )[0]
                      );
                  } else {
                    setCurrentData(initialState);
                  }
                }}
              />
              <RoleForm
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

        <ConfirmationModal
          open={openConfirm}
          onClose={handleCloseConfirm}
          onConfirm={handleConfirmDelete}
          title={trans('Confirm Delete')}
          message={trans(
            `Are you sure you want to delete role "${roleToDelete?.name || roleToDelete?.title}"? This action cannot be undone.`
          )}
        />
      </div>
    </>
  );
}

export default HRM;
