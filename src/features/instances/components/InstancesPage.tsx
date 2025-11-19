import type { RootState } from '@/app/store';
import SuspenseLoader from '@/components/SuspenseLoader';
import InstanceForm from '@/features/instances/components/InstanceForm';
import InstanceListItem from '@/features/instances/components/InstanceListItem';
import { TopNav } from '@/features/shared/components/DashboardShared';
import { Instance } from '@/types/instances';
import Badge from '@/ui/Badge';
import CategoryIcon from '@/ui/icons/category.svg';
import ListComponent from '@/ui/List';
import ListItemComponent from '@/ui/List/ListItem';
import ModalComponent from '@/ui/Modal';
import ConfirmationModal from '@/ui/Modal/ConfirmationModal';
import ModalHeader from '@/ui/Modal/ModalHeader';
import TableComponent, { TableColumn } from '@/ui/Table/TableComponent';
import ToolTip from '@/ui/Tooltip';
import { truncateMiddle } from '@/utils/string_utils';
import useTrans from '@/utils/translation_util';
import KeyIcon from '@mui/icons-material/Key';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import {
  useAddInstanceMutation,
  useDeleteInstanceMutation,
  useGetInstancesQuery,
  useUpdateInstanceMutation
} from 'src/services/instances';
import { PermissionKey } from 'src/types/permissions';

const initialState: Instance = {
  id: undefined,
  name: '',
  phone_number_id: '',
  whatsapp_business_id: '',
  rate_limit_per_minute: 0,
  access_token:
    'm8jekB4E2GDwHozzhoSFxkhBLzz9XxPaA2OVsGCmSHpp3tT+MxgaOTwpv8pJSmlXk6xwK1WRtFrW4GWgZ7fqBKrQ9wx4uSFFigK0sfAYed/rhXBt43iqGFdlDlEPnm6HSuPzxyWXSircn29nOveptQZoIppR4wqXboAtgWtA3W3xJjjan871yekMnSeW8QhNt6DFLuPNRif2QqHnekmcq6/BrmhUwngH2fCabmd119/Y1ZTQpAJn8dgQUPhv6GSAHc/BpY6RszNhIONIPOd+d0f6OGxu2uyBb2N9/fHM12p+',
  webhook_url: null,
  display_phone_number: '',
  status: 'active'
};

const instanceTableColumns: TableColumn<Instance>[] = [
  { id: 'name', label: 'Instance Name', minWidth: 170 },
  { id: 'display_phone_number', label: 'Phone Number', minWidth: 100 },
  { id: 'whatsapp_business_id', label: 'WhatsApp Business ID', minWidth: 170 },
  {
    id: 'webhook_url',
    label: 'Webhook URL',
    minWidth: 170,
    format: (value: string | null | undefined) =>
      value ? (
        <ToolTip text={value}>
          <span>{truncateMiddle(value, 70)}</span>
        </ToolTip>
      ) : (
        ''
      )
  },
  {
    id: 'rate_limit_per_minute',
    label: 'Rate Limit/Minute',
    minWidth: 100,
    align: 'right'
  },
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
  {
    id: 'api_keys',
    label: 'API Keys',
    minWidth: 120,
    align: 'center',
    format: (value: any, row: Instance) => {
      const router = useRouter();
      const handleViewApiKeys = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (row.id) {
          router.push(`/api-keys/${row.id}`);
        }
      };
      return (
        <Button
          variant="outlined"
          size="small"
          startIcon={<KeyIcon />}
          onClick={handleViewApiKeys}
        >
          View API Keys
        </Button>
      );
    }
  },
  { id: 'actions', label: 'Actions', minWidth: 170, align: 'center' }
];

function Instances() {
  const trans = useTrans();

  const { data: Instances, isLoading: isLoadingInstances } =
    useGetInstancesQuery();
  const [
    addInstance,
    {
      isLoading: isAddLoading,
      isSuccess: isAddSuccess,
      isError: isAddError,
      reset: resetAdd
    }
  ] = useAddInstanceMutation();
  const [
    updateInstance,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      reset: resetUpdate
    }
  ] = useUpdateInstanceMutation();
  const [
    deleteInstance,
    {
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess,
      isError: isDeleteError,
      reset: resetDelete
    }
  ] = useDeleteInstanceMutation();
  const [open, setOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<'add' | 'update' | 'preview'>('preview');
  const [currentData, setCurrentData] = useState<Instance>(initialState);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false); // State for confirmation modal
  const [instanceToDelete, setInstanceToDelete] = useState<Instance | null>(
    null
  ); // State to store client to delete

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

  const handleEditClient = (client: Instance) => {
    setCurrentData(client);
    setMode('update');
    setOpen(true);
  };

  const handleDeleteClient = (client: Instance) => {
    setInstanceToDelete(client);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (instanceToDelete) {
      deleteInstance(instanceToDelete);
      setOpenConfirm(false);
      setOpen(false);
      setInstanceToDelete(null);
    }
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setInstanceToDelete(null);
  };

  return (
    <>
      <Helmet>
        <title>{trans('Instances')}</title>
      </Helmet>
      <TopNav
        add_permission={PermissionKey.CLIENTS_CREATE}
        table_icon={CategoryIcon}
        table_name={trans('Instances')}
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
        {isLoadingInstances ? (
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
              {Instances?.map((one, index) => (
                <InstanceListItem
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
                  handleDeleteClient={handleDeleteClient}
                  edit_permission={PermissionKey.CLIENTS_UPDATE}
                  delete_permission={PermissionKey.CLIENTS_DELETE}
                />
              ))}
            </>
          </ListComponent>
        ) : (
          <TableComponent
            columns={instanceTableColumns}
            data={Instances || []}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
            edit_permission={PermissionKey.CLIENTS_UPDATE}
            delete_permission={PermissionKey.CLIENTS_DELETE}
            deleteText="Delete"
          />
        )}
        {
          <ModalComponent open={open}>
            <>
              <ModalHeader
                add_permission={PermissionKey.CLIENTS_CREATE}
                update_permission={PermissionKey.CLIENTS_UPDATE}
                delete_permission={PermissionKey.CLIENTS_DELETE}
                Delete={() => {
                  handleDeleteClient(currentData);
                }}
                close={() => {
                  setOpen(false);
                  setCurrentData(initialState);
                }}
                title={
                  currentData?.name
                    ? `${trans('Instance')}: ${currentData.name}`
                    : trans('Instance')
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
                      Instances?.filter((one) => one.id === currentData.id)[0]
                    )
                      setCurrentData(
                        Instances?.filter((one) => one.id === currentData.id)[0]
                      );
                  } else {
                    setCurrentData(initialState);
                  }
                }}
              />
              <InstanceForm
                currentData={currentData}
                setCurrentData={setCurrentData}
                mode={mode}
                add_button_clk={() => {
                  addInstance(currentData);
                  setOpen(false);
                  setCurrentData(initialState);
                }}
                edit_button_clk={() => {
                  updateInstance(currentData);
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
          message={
            instanceToDelete
              ? `${trans('Are you sure you want to delete')} ${instanceToDelete.name}?`
              : trans('Are you sure you want to delete this item?')
          }
        />
      </div>
    </>
  );
}

export default Instances;
