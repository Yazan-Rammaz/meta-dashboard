'use client';

import InfiniteScrollTrigger from '@/components/InfiniteScrollTrigger';
import ListComponent from '@/components/List';
import ListItemComponent from '@/components/List/ListItem';
import SuspenseLoader from '@/components/SuspenseLoader';
import TableComponent, { TableColumn } from '@/components/TableComponent';
import { useToast } from '@/contexts/toastContext';
import { deleteRoleAction } from '@/features/roles/actions';
import RoleForm from '@/features/roles/components/RoleForm';
import RoleListItem from '@/features/roles/components/RoleListItem';
import { TopNav } from '@/features/shared/components/DashboardShared';
import { queryClient } from '@/lib/queryClient';
import type { PaginatedResponse } from '@/models/pagination';
import { Role } from '@/models/roles';
import { useGetRolesInfiniteQuery, useGetRolesQuery } from '@/services/roles';
import { useViewModeStore } from '@/stores/viewModeStore';
import HRMIcon from '@/ui/icons/HRM.svg';
import ModalComponent from '@/ui/Modal';
import ModalHeader from '@/ui/Modal/ModalHeader';
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
    initialData?: PaginatedResponse<Role>;
}

const initialState: Role = {
    id: undefined,
    permissions: [],
    title: '',
};

const roleTableColumns: TableColumn<Role>[] = [
    { id: 'name', label: 'Role Name', minWidth: 170 },
    { id: 'description', label: 'Description', minWidth: 200 },
    {
        id: 'permissions',
        label: 'Permissions',
        minWidth: 100,
        format: (value: string[]) => value?.length.toString() || '0',
    },
    { id: 'actions', label: 'Actions', minWidth: 170, align: 'center' },
];

function HRM({ initialData }: Props) {
    const { showSuccess, showError } = useToast();
    const [isPending, startTransition] = useTransition();
    const [page, setPage] = useState<number>(1);

    const { data: Roles, isLoading: isLoadingRoles } = useGetRolesQuery({
        page,
        initialData: page === 1 ? initialData?.data : undefined,
    });
    const {
        data: infiniteData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetRolesInfiniteQuery();

    const [open, setOpen] = useState<boolean>(false);
    const [mode, setMode] = useState<'add' | 'update' | 'preview'>('preview');
    const [currentData, setCurrentData] = useState<Role>(initialState);
    const viewMode = useViewModeStore((state) => state.mode);
    const setViewMode = useViewModeStore((state) => state.setMode);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

    const listRoles =
        viewMode === 'list' ? (infiniteData?.pages.flatMap((p) => p.data) ?? []) : (Roles ?? []);

    const handleViewModeChange = (mode: 'list' | 'table') => {
        if (mode === 'table') setPage(1);
        setViewMode(mode);
    };

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
            const id = roleToDelete.id!;
            setOpenConfirm(false);
            setRoleToDelete(null);
            startTransition(async () => {
                const result = await deleteRoleAction(id);
                if (result.success) {
                    queryClient.invalidateQueries({ queryKey: ['roles'] });
                    showSuccess('Role deleted');
                    setOpen(false);
                    setCurrentData(initialState);
                } else {
                    showError(result.error ?? 'Failed');
                }
            });
        }
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
        setRoleToDelete(null);
    };

    return (
        <>
            <Helmet>
                <title>Roles</title>
            </Helmet>
            <TopNav
                add_permission=""
                table_icon={HRMIcon}
                table_name="Roles"
                top_name_clk={() => {}}
                open_button_clk={() => {
                    setCurrentData(initialState);
                    setMode('add');
                    setOpen(true);
                }}
                onFilterClick={() => handleViewModeChange('list')}
                onApplicationClick={() => handleViewModeChange('table')}
                activeViewMode={viewMode}
                haveView={false}
            />
            {isPending ? <SuspenseLoader /> : <></>}
            <div style={{ padding: '70px 20px 20px 20px' }}>
                {isLoadingRoles ? (
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
                                        <>{currentData.description || currentData.title}</>
                                    </ListItemComponent>
                                ) : (
                                    <></>
                                )}
                                {listRoles.map((one, index) => (
                                    <RoleListItem
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
                                        handleDeleteRole={handleDeleteRole}
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
                        columns={roleTableColumns}
                        data={Roles || []}
                        onEdit={handleEditRole}
                        onDelete={handleDeleteRole}
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
                                    handleDeleteRole(currentData); // Call handleDeleteRole to open confirmation modal
                                }}
                                close={() => {
                                    setOpen(false);
                                    setCurrentData(initialState);
                                }}
                                title={
                                    currentData?.name ? `${'Role'}: ${currentData.name}` : 'Role'
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
                                        if (Roles?.filter((one) => one.id === currentData.id)[0])
                                            setCurrentData(
                                                Roles?.filter(
                                                    (one) => one.id === currentData.id,
                                                )[0],
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
                    <DialogTitle id="alert-dialog-title">{'Confirm Delete'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            `Are you sure you want to delete role "$
                            {roleToDelete?.name || roleToDelete?.title}"? This action cannot be
                            undone.`,
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseConfirm} color="primary">
                            {'Cancel'}
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            color="primary"
                            autoFocus
                            disabled={isPending}
                        >
                            {'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}

export default HRM;
