import type { RootState } from '@/app/store';
import SuspenseLoader from '@/components/SuspenseLoader';
import { TopNav } from '@/features/shared/components/DashboardShared';
import { ApiKey, ApiKeyCreationRequest } from '@/types/api_keys'; // Import ApiKeyCreationRequest
import Badge from '@/ui/Badge'; // Corrected import path
import ApiKeysIcon from '@/ui/icons/Links'; // Assuming a suitable icon
import ListComponent from '@/ui/List';
import ListItemComponent from '@/ui/List/ListItem';
import ModalComponent from '@/ui/Modal';
import ConfirmationModal from '@/ui/Modal/ConfirmationModal';
import ModalHeader from '@/ui/Modal/ModalHeader';
import TableComponent, { TableColumn } from '@/ui/Table/TableComponent';
import { truncateMiddle } from '@/utils/string_utils'; // Import truncateMiddle
import useTrans from '@/utils/translation_util';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import {
  useAddApiKeyMutation,
  useGetApiKeysQuery,
  useRevokeApiKeyMutation,
  useUpdateApiKeyMutation
} from 'src/services/api_keys';
import { PermissionKey } from 'src/types/permissions'; // Re-import PermissionKey enum
import ApiKeyForm from './ApiKeyForm';
import ApiKeyListItem from './ApiKeysListItem';

const initialState: ApiKey = {
  id: undefined,
  client_id: '',
  label: '',
  rate_limit_per_minute: 0,
  key_hash: undefined,
  hmac_secret: undefined,
  api_key: undefined,
  created_at: undefined,
  last_used_at: undefined,
  revoked: false
};

const apiKeyTableColumns: TableColumn<ApiKey>[] = [
  { id: 'label', label: 'Label', minWidth: 170 },
  { id: 'client_id', label: 'Client ID', minWidth: 170 },
  {
    id: 'key_hash',
    label: 'Key Hash',
    minWidth: 170,
    format: (value: string) => truncateMiddle(value, 30) || ''
  },
  {
    id: 'hmac_secret',
    label: 'HMAC Secret',
    minWidth: 170,
    format: (value: string) => truncateMiddle(value, 30) || ''
  },
  {
    id: 'rate_limit_per_minute',
    label: 'Rate Limit/Minute',
    minWidth: 100,
    align: 'right'
  },
  {
    id: 'created_at',
    label: 'Created At',
    minWidth: 170,
    format: (value: string) =>
      value ? new Date(value).toLocaleString() : 'N/A'
  },
  {
    id: 'last_used_at',
    label: 'Last Used At',
    minWidth: 170,
    format: (value: string) =>
      value ? new Date(value).toLocaleString() : 'Never'
  },
  {
    id: 'revoked',
    label: 'Revoked',
    minWidth: 100,
    format: (value: boolean) =>
      value ? (
        <Badge color="error" label="Revoked" />
      ) : (
        <Badge color="success" label="Active" />
      )
  },
  { id: 'actions', label: 'Actions', minWidth: 170, align: 'center' }
];

function ApiKeysPage() {
  const trans = useTrans();
  const params = useParams();
  const clientId = params.clientId as string;

  const { data: ApiKeys, isLoading: isLoadingApiKeys } =
    useGetApiKeysQuery(clientId);
  const [
    addApiKey,
    {
      isLoading: isAddLoading,
      isSuccess: isAddSuccess,
      isError: isAddError,
      reset: resetAdd,
      data: addApiKeyResponse // Capture the response data
    }
  ] = useAddApiKeyMutation();
  const [
    updateApiKey,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      reset: resetUpdate
    }
  ] = useUpdateApiKeyMutation();
  const [
    revokeApiKey,
    {
      isLoading: isRevokeLoading,
      isSuccess: isRevokeSuccess,
      isError: isRevokeError,
      reset: resetRevoke
    }
  ] = useRevokeApiKeyMutation();

  const [open, setOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<'add' | 'update' | 'preview'>('preview');
  const [currentData, setCurrentData] = useState<ApiKey>(initialState);
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false);
  const [createdApiKey, setCreatedApiKey] = useState<{
    apiKey: string;
    hmacSecret: string;
  } | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false); // State for confirmation modal
  const [apiKeyToRevoke, setApiKeyToRevoke] = useState<ApiKey | null>(null); // State to hold API key to be revoked

  const viewMode = useSelector((state: RootState) => state.viewMode.mode);

  useEffect(() => {
    const timeout = setTimeout(() => {
      resetAdd();
      resetRevoke();
      resetUpdate();
    }, 1500);
    return () => clearTimeout(timeout);
  }, [
    isAddSuccess,
    isAddError,
    isUpdateError,
    isUpdateSuccess,
    isRevokeSuccess,
    isRevokeError
  ]);

  useEffect(() => {
    if (
      isAddSuccess &&
      addApiKeyResponse?.data?.api_key &&
      addApiKeyResponse?.data?.hmac_secret
    ) {
      setCreatedApiKey({
        apiKey: addApiKeyResponse.data.api_key,
        hmacSecret: addApiKeyResponse.data.hmac_secret
      });
      setSuccessModalOpen(true);
    }
  }, [isAddSuccess, addApiKeyResponse]);

  const handleEditApiKey = (apiKey: ApiKey) => {
    setCurrentData(apiKey);
    setMode('update');
    setOpen(true);
  };

  // This function now triggers the confirmation modal
  const handleRevokeClick = (apiKey: ApiKey) => {
    setApiKeyToRevoke(apiKey);
    setConfirmModalOpen(true);
  };

  // This function is called when the user confirms revocation
  const handleConfirmRevoke = () => {
    if (apiKeyToRevoke?.id && apiKeyToRevoke?.client_id) {
      revokeApiKey({
        id: apiKeyToRevoke.id,
        client_id: apiKeyToRevoke.client_id
      });
      setConfirmModalOpen(false);
      setOpen(false); // Close main modal if open
      setApiKeyToRevoke(null);
    }
  };

  const handleAddApiKey = () => {
    if (clientId) {
      addApiKey({
        ...currentData,
        client_id: clientId
      } as ApiKeyCreationRequest);
      setOpen(false);
      setCurrentData(initialState);
    }
  };

  const handleUpdateApiKey = () => {
    if (currentData.id && clientId) {
      updateApiKey({ ...currentData, client_id: clientId });
      setOpen(false);
      setMode('preview');
    }
  };

  return (
    <>
      <Helmet>
        <title>{trans('API Keys')}</title>
      </Helmet>
      <TopNav
        add_permission={PermissionKey.API_KEYS_CREATE}
        table_icon={ApiKeysIcon}
        table_name={trans('API Keys')}
        top_name_clk={() => {}}
        open_button_clk={() => {
          setCurrentData({ ...initialState, client_id: clientId }); // Pre-fill client_id
          setMode('add');
          setOpen(true);
        }}
      />
      {isLoadingApiKeys ? <SuspenseLoader /> : <></>}
      <div style={{ padding: '70px 20px 20px 20px' }}>
        {isLoadingApiKeys ? (
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
                  <>{currentData.label}</>
                </ListItemComponent>
              ) : (
                <></>
              )}
              {ApiKeys?.map((one, index) => (
                <ApiKeyListItem
                  key={one.id}
                  one={one}
                  index={index}
                  currentData={currentData}
                  isUpdateLoading={isUpdateLoading}
                  isRevokeLoading={isRevokeLoading}
                  isUpdateSuccess={isUpdateSuccess}
                  isRevokeSuccess={isRevokeSuccess}
                  isUpdateError={isUpdateError}
                  isRevokeError={isRevokeError}
                  setMode={setMode}
                  setCurrentData={setCurrentData}
                  setOpen={setOpen}
                  handleRevokeClick={
                    currentData?.revoked ? undefined : handleRevokeClick
                  }
                  edit_permission={PermissionKey.API_KEYS_UPDATE}
                  revoke_permission={PermissionKey.API_KEYS_REVOKE}
                />
              ))}
            </>
          </ListComponent>
        ) : (
          <TableComponent
            columns={apiKeyTableColumns}
            data={ApiKeys || []}
            onEdit={handleEditApiKey}
            onRevoke={handleRevokeClick}
            edit_permission={PermissionKey.API_KEYS_UPDATE}
            revoke_permission={PermissionKey.API_KEYS_REVOKE}
            deleteText="Revoke"
          />
        )}
        {
          <ModalComponent open={open}>
            <>
              <ModalHeader
                add_permission={PermissionKey.API_KEYS_CREATE}
                update_permission={PermissionKey.API_KEYS_UPDATE}
                delete_permission={
                  currentData.revoked
                    ? undefined
                    : PermissionKey.API_KEYS_REVOKE
                }
                Revoke={() => {
                  handleRevokeClick(currentData); // Call handleDeleteClient to open confirmation modal
                }}
                close={() => {
                  setOpen(false);
                  setCurrentData(initialState);
                }}
                title={
                  currentData?.label
                    ? `${trans('API Key')}: ${currentData.label}`
                    : trans('API Key')
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
                    if (ApiKeys?.filter((one) => one.id === currentData.id)[0])
                      setCurrentData(
                        ApiKeys?.filter((one) => one.id === currentData.id)[0]
                      );
                  } else {
                    setCurrentData(initialState);
                  }
                }}
              />
              <ApiKeyForm
                currentData={currentData}
                setCurrentData={setCurrentData}
                mode={mode}
                add_button_clk={handleAddApiKey}
                edit_button_clk={handleUpdateApiKey}
              />
            </>
          </ModalComponent>
        }
        <ConfirmationModal
          open={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={handleConfirmRevoke}
          title={trans('Confirm Revocation')}
          message={trans(
            `Are you sure you want to revoke API Key "${apiKeyToRevoke?.label}"? This action cannot be undone.`
          )}
        />
      </div>
    </>
  );
}

export default ApiKeysPage;
