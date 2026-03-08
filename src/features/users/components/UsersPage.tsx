'use client';

import InfiniteScrollTrigger from '@/components/InfiniteScrollTrigger';
import ListComponent from '@/components/List';
import ListItemComponent from '@/components/List/ListItem';
import SuspenseLoader from '@/components/SuspenseLoader';
import TableComponent, { TableColumn } from '@/components/TableComponent';
import { useToast } from '@/contexts/toastContext';
import { TopNav } from '@/features/shared/components/DashboardShared';
import { deleteUserAction } from '@/features/users/actions';
import UserForm from '@/features/users/components/UserForm';
import UserListItem from '@/features/users/components/UserListItem';
import { queryClient } from '@/lib/queryClient';
import type { PaginatedResponse } from '@/models/pagination';
import { User } from '@/models/users';
import { useGetUsersInfiniteQuery, useGetUsersQuery } from '@/services/users';
import UsersIcon from '@/ui/icons/user.svg';
import ModalComponent from '@/ui/Modal';
import ModalHeader from '@/ui/Modal/ModalHeader';
import useTrans from '@/utils/translation_util';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { useState, useTransition } from 'react';
import { Helmet } from 'react-helmet-async';

interface Props {
    initialData?: PaginatedResponse<User>;
}

const initialState: User = {
    id: undefined,
    name: '',
    email: '',
    password: '',
    role: 'admin',
    status: 'active',
};

const userTableColumns: TableColumn<User>[] = [
    { id: 'name', label: 'User Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 100 },
    { id: 'role', label: 'Role', minWidth: 170 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'actions', label: 'Actions', minWidth: 170, align: 'center' },
];

function Users({ initialData }: Props) {
    const trans = useTrans();
    const { showSuccess, showError } = useToast();
    const [isPending, startTransition] = useTransition();
    const [page, setPage] = useState<number>(1);

    const { data: Users, isLoading: isLoadingUsers } = useGetUsersQuery({
        page,
        initialData: page === 1 ? initialData?.data : undefined,
    });
    const {
        data: infiniteData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetUsersInfiniteQuery();

    const [open, setOpen] = useState<boolean>(false);
    const [mode, setMode] = useState<'add' | 'update' | 'preview'>('preview');
    const [currentData, setCurrentData] = useState<User>(initialState);
    const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const listUsers =
        viewMode === 'list' ? (infiniteData?.pages.flatMap((p) => p.data) ?? []) : (Users ?? []);

    const handleViewModeChange = (mode: 'list' | 'table') => {
        if (mode === 'table') setPage(1);
        setViewMode(mode);
    };

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
            const id = userToDelete.id!;
            setOpenConfirm(false);
            setUserToDelete(null);
            startTransition(async () => {
                const result = await deleteUserAction(id);
                if (result.success) {
                    queryClient.invalidateQueries({ queryKey: ['users'] });
                    showSuccess(trans('User deleted'));
                    setOpen(false);
                    setCurrentData(initialState);
                } else {
                    showError(result.error ?? trans('Failed'));
                }
            });
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
                add_permission=""
                table_icon={UsersIcon}
                table_name={trans('Users')}
                top_name_clk={() => {}}
                open_button_clk={() => {
                    setCurrentData(initialState);
                    setMode('add');
                    setOpen(true);
                }}
                haveView={false}
            />
            {isPending ? <SuspenseLoader /> : <></>}
            <div style={{ padding: '70px 20px 20px 20px' }}>
                <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                    <Button
                        onClick={() => handleViewModeChange('list')}
                        variant={viewMode === 'list' ? 'contained' : 'outlined'}
                        startIcon={<ViewListIcon />}
                    >
                        List View
                    </Button>
                    <Button
                        onClick={() => handleViewModeChange('table')}
                        variant={viewMode === 'table' ? 'contained' : 'outlined'}
                        startIcon={<ViewModuleIcon />}
                        style={{ marginLeft: '10px' }}
                    >
                        Table View
                    </Button>
                </div>

                {isLoadingUsers ? (
                    <SuspenseLoader />
                ) : viewMode === 'list' ? (
                    <>
                        <ListComponent>
                            <>
                                {mode === 'add' && open ? (
                                    <ListItemComponent
                                        isLoading={isPending}
                                        isSuccess={false}
                                        isError={false}
                                        hasDelete={false}
                                        hasAddChild={false}
                                    >
                                        <>{currentData.name}</>
                                    </ListItemComponent>
                                ) : (
                                    <></>
                                )}
                                {listUsers.map((one, index) => (
                                    <UserListItem
                                        key={one.id}
                                        one={one}
                                        index={index}
                                        currentData={currentData}
                                        isUpdateLoading={isPending}
                                        isDeleteLoading={isPending}
                                        isUpdateSuccess={false}
                                        isDeleteSuccess={false}
                                        isUpdateError={false}
                                        isDeleteError={false}
                                        setMode={setMode}
                                        setCurrentData={setCurrentData}
                                        setOpen={setOpen}
                                        handleDeleteUser={handleDeleteUser}
                                    />
                                ))}
                            </>
                        </ListComponent>

                        <InfiniteScrollTrigger
                            onIntersect={fetchNextPage}
                            isLoading={isFetchingNextPage}
                            hasMore={hasNextPage ?? false}
                        />
                    </>
                ) : (
                    <TableComponent
                        columns={userTableColumns}
                        data={Users || []}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                        total={initialData?.total}
                        page={page}
                        onPageChange={setPage}
                    />
                )}
                {
                    <ModalComponent open={open}>
                        <>
                            <ModalHeader
                                add_permission=""
                                update_permission={''}
                                delete_permission={''}
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
                                                Users?.filter(
                                                    (one) => one.id === currentData.id,
                                                )[0],
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
                                onClose={() => {
                                    setOpen(false);
                                    setCurrentData(initialState);
                                    setMode('preview');
                                }}
                            />
                        </>
                    </ModalComponent>
                }

                {/* Confirmation Modal */}
                <Dialog
                    open={openConfirm}
                    onClose={handleCloseConfirm}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{trans('Confirm Delete')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {trans(
                                `Are you sure you want to delete user "${userToDelete?.name}"? This action cannot be undone.`,
                            )}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseConfirm} color="primary">
                            {trans('Cancel')}
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            color="primary"
                            autoFocus
                            disabled={isPending}
                        >
                            {trans('Delete')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}

export default Users;
