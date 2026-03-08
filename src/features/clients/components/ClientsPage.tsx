'use client';

import InfiniteScrollTrigger from '@/components/InfiniteScrollTrigger';
import ListComponent from '@/components/List';
import ListItemComponent from '@/components/List/ListItem';
import SuspenseLoader from '@/components/SuspenseLoader';
import TableComponent, { TableColumn } from '@/components/TableComponent';
import { useToast } from '@/contexts/toastContext';
import { deleteClientAction } from '@/features/clients/actions';
import ClientForm from '@/features/clients/components/ClientForm';
import ClientListItem from '@/features/clients/components/ClientListItem';
import { TopNav } from '@/features/shared/components/DashboardShared';
import { queryClient } from '@/lib/queryClient';
import { Client } from '@/models/clients';
import type { PaginatedResponse } from '@/models/pagination';
import { useGetClientsInfiniteQuery, useGetClientsQuery } from '@/services/clients';
import ClientsIcon from '@/ui/icons/user.svg';
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
    initialData?: PaginatedResponse<Client>;
}

const initialState: Client = {
    id: undefined,
    name: '',
    phone_number_id: '',
    whatsapp_business_id: '',
    rate_limit_per_minute: 0,
    access_token:
        'm8jekB4E2GDwHozzhoSFxkhBLzz9XxPaA2OVsGCmSHpp3tT+MxgaOTwpv8pJSmlXk6xwK1WRtFrW4GWgZ7fqBKrQ9wx4uSFFigK0sfAYed/rhXBt43iqGFdlDlEPnm6HSuPzxyWXSircn29nOveptQZoIppR4wqXboAtgWtA3W3xJjjan871yekMnSeW8QhNt6DFLuPNRif2QqHnekmcq6/BrmhUwngH2fCabmd119/Y1ZTQpAJn8dgQUPhv6GSAHc/BpY6RszNhIONIPOd+d0f6OGxu2uyBb2N9/fHM12p+',
    webhook_url: null,
    display_phone_number: '',
    status: 'active',
};

const clientTableColumns: TableColumn<Client>[] = [
    { id: 'name', label: 'Client Name', minWidth: 170 },
    { id: 'display_phone_number', label: 'Phone Number', minWidth: 100 },
    { id: 'whatsapp_business_id', label: 'WhatsApp Business ID', minWidth: 170 },
    { id: 'webhook_url', label: 'Webhook URL', minWidth: 170 },
    {
        id: 'rate_limit_per_minute',
        label: 'Rate Limit/Minute',
        minWidth: 100,
        align: 'right',
    },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'actions', label: 'Actions', minWidth: 170, align: 'center' },
];

function Clients({ initialData }: Props) {
    const trans = useTrans();
    const { showError } = useToast();
    const [isPending, startTransition] = useTransition();

    const [page, setPage] = useState<number>(1);

    const { data: Clients, isLoading: isLoadingClients } = useGetClientsQuery({
        page,
        initialData: page === 1 ? initialData?.data : undefined,
    });
    const {
        data: infiniteData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetClientsInfiniteQuery();
    const [open, setOpen] = useState<boolean>(false);
    const [mode, setMode] = useState<'add' | 'update' | 'preview'>('preview');
    const [currentData, setCurrentData] = useState<Client>(initialState);
    const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

    const listClients =
        viewMode === 'list' ? (infiniteData?.pages.flatMap((p) => p.data) ?? []) : (Clients ?? []);

    const handleViewModeChange = (mode: 'list' | 'table') => {
        if (mode === 'table') setPage(1);
        setViewMode(mode);
    };

    const handleEditClient = (client: Client) => {
        setCurrentData(client);
        setMode('update');
        setOpen(true);
    };

    const handleDeleteClient = (client: Client) => {
        setClientToDelete(client);
        setOpenConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (clientToDelete) {
            const target = clientToDelete;
            startTransition(async () => {
                const result = await deleteClientAction(target.id!);
                if (result.success) {
                    result.invalidateKeys?.forEach((k) =>
                        queryClient.invalidateQueries({ queryKey: [k] }),
                    );
                } else {
                    showError(result.error ?? trans('Failed to delete client'));
                }
            });
            setOpenConfirm(false);
            setOpen(false);
            setClientToDelete(null);
        }
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
        setClientToDelete(null);
    };

    return (
        <>
            <Helmet>
                <title>{trans('Clients')}</title>
            </Helmet>
            <TopNav
                add_permission=""
                table_icon={ClientsIcon}
                table_name={trans('Clients')}
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

                {isLoadingClients ? (
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
                                {listClients.map((one, index) => (
                                    <ClientListItem
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
                                        handleDeleteClient={handleDeleteClient}
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
                        columns={clientTableColumns}
                        data={Clients || []}
                        onEdit={handleEditClient}
                        onDelete={handleDeleteClient}
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
                                    handleDeleteClient(currentData); // Call handleDeleteClient to open confirmation modal
                                }}
                                close={() => {
                                    setOpen(false);
                                    setCurrentData(initialState);
                                }}
                                title={
                                    currentData?.name
                                        ? `${trans('Client')}: ${currentData.name}`
                                        : trans('Client')
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
                                        if (Clients?.filter((one) => one.id === currentData.id)[0])
                                            setCurrentData(
                                                Clients?.filter(
                                                    (one) => one.id === currentData.id,
                                                )[0],
                                            );
                                    } else {
                                        setCurrentData(initialState);
                                    }
                                }}
                            />
                            <ClientForm
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
                                `Are you sure you want to delete client "${clientToDelete?.name}"? This action cannot be undone.`,
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

export default Clients;
