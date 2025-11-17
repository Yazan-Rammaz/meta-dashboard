import type { RootState } from '@/app/store';
import SuspenseLoader from '@/components/SuspenseLoader';
import { TopNav } from '@/features/shared/components/DashboardShared';
import UserForm from '@/features/users/components/UserForm';
import UserListItem from '@/features/users/components/UserListItem';
import { User } from '@/types/users';
import Badge from '@/ui/Badge';
import UsersIcon from '@/ui/icons/user.svg';
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
  useAddUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation
} from 'src/services/users';
import { PermissionKey } from 'src/types/permissions'; // Import PermissionKey enum

const initialState: User = {
  id: undefined,
  name: '',
  email: '',
  password: '',
  role: 'admin',
  status: 'active'
};

const userTableColumns: TableColumn<User>[] = [
  { id: 'name', label: 'User Name', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 100 },
  { id: 'role', label: 'Role', minWidth: 170 },
  {
    id: 'status',
    label: 'Status',
    minWidth: 100,
    format: (value: string) =>
      value === 'active' ? (
        <Badge color="success" label="Active" />
      ) : (
        <Badge color="error" label="Inactive" />
      )
  },
  { id: 'actions', label: 'Actions', minWidth: 170, align: 'center' }
];

function Users() {
  const trans = useTrans();

  const { data: Users, isLoading: isLoadingUsers } = useGetUsersQuery();
  const [
    addUser,
    {
      isLoading: isAddLoading,
      isSuccess: isAddSuccess,
      isError: isAddError,
      reset: resetAdd
    }
  ] = useAddUserMutation();
  const [
    updateUser,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      reset: resetUpdate
    }
  ] = useUpdateUserMutation();
  const [
    deleteUser,
    {
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess,
      isError: isDeleteError,
      reset: resetDelete
    }
  ] = useDeleteUserMutation();
  const [open, setOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<'add' | 'update' | 'preview'>('preview');
  const [currentData, setCurrentData] = useState<User>(initialState);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false); // State for confirmation modal
  const [userToDelete, setUserToDelete] = useState<User | null>(null); // State to store user to delete

  const viewMode = useSelector((state: RootState) => state.viewMode.mode);

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

  const handleEditUser = (user: User) => {
    setCurrentData(user);
    setMode('update');
    setOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      setOpenConfirm(false);
      setOpen(false);
      setUserToDelete(null);
    }
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setUserToDelete(null);
  };

  return (
    <>
      <Helmet>
        <title>{trans('Users')}</title>
      </Helmet>
      <TopNav
        add_permission={PermissionKey.USERS_CREATE}
        table_icon={UsersIcon}
        table_name={trans('Users')}
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
        {isLoadingUsers ? (
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
              {Users?.map((one, index) => (
                <UserListItem
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
                  handleDeleteClick={handleDeleteUser}
                  edit_permission={PermissionKey.USERS_UPDATE}
                  delete_permission={PermissionKey.USERS_DELETE}
                />
              ))}
            </>
          </ListComponent>
        ) : (
          <TableComponent
            columns={userTableColumns}
            data={Users || []}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            edit_permission={PermissionKey.USERS_UPDATE}
            delete_permission={PermissionKey.USERS_DELETE}
            deleteText="Delete"
          />
        )}
        {
          <ModalComponent open={open}>
            <>
              <ModalHeader
                add_permission={PermissionKey.USERS_CREATE}
                update_permission={PermissionKey.USERS_UPDATE}
                delete_permission={PermissionKey.USERS_DELETE}
                Delete={() => {
                  handleDeleteUser(currentData); // Call handleDeleteUser to open confirmation modal
                }}
                close={() => {
                  setOpen(false);
                  setCurrentData(initialState);
                }}
                title={
                  currentData?.name
                    ? `${trans('User')}: ${currentData.name}`
                    : trans('User')
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
                    if (Users?.filter((one) => one.id === currentData.id)[0])
                      setCurrentData(
                        Users?.filter((one) => one.id === currentData.id)[0]
                      );
                  } else {
                    setCurrentData(initialState);
                  }
                }}
              />
              <UserForm
                currentData={currentData}
                setCurrentData={setCurrentData}
                mode={mode}
                add_button_clk={() => {
                  addUser(currentData);
                  setOpen(false);
                  setCurrentData(initialState);
                }}
                edit_button_clk={() => {
                  updateUser(currentData);
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
            `Are you sure you want to delete user "${userToDelete?.name}"? This action cannot be undone.`
          )}
        />
      </div>
    </>
  );
}

export default Users;
