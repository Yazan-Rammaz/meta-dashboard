import { Client } from '@/types/clients';
import Badge from '@/ui/Badge';
import ListItemComponent from '@/ui/List/ListItem';
import ToolTip from '@/ui/Tooltip';
import KeyIcon from '@mui/icons-material/Key';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

interface ClientListItemProps {
  one: Client;
  index: number;
  currentData: Client;
  isUpdateLoading: boolean;
  isDeleteLoading: boolean;
  isUpdateSuccess: boolean;
  isDeleteSuccess: boolean;
  isUpdateError: boolean;
  isDeleteError: boolean;
  setMode: (mode: 'add' | 'update' | 'preview') => void;
  setCurrentData: (data: Client) => void;
  setOpen: (open: boolean) => void;
  handleDeleteClient: (client: Client) => void; // Add handleDeleteClient prop
  edit_permission: string; // Add edit_permission
  delete_permission: string; // Add delete_permission
}

const ClientListItem: React.FC<ClientListItemProps> = ({
  one,
  index,
  currentData,
  isUpdateLoading,
  isDeleteLoading,
  isUpdateSuccess,
  isDeleteSuccess,
  isUpdateError,
  isDeleteError,
  setMode,
  setCurrentData,
  setOpen,
  handleDeleteClient, // Destructure handleDeleteClient
  edit_permission, // Destructure edit_permission
  delete_permission // Destructure delete_permission
}) => {
  const router = useRouter();

  const handleViewApiKeys = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation
    if (one.id) {
      router.push(`/api-keys/${one.id}`);
    }
  };

  return (
    <ListItemComponent
      isLoading={
        (currentData.id === one.id && isUpdateLoading) ||
        (currentData.id === one.id && isDeleteLoading)
      }
      isSuccess={
        (currentData.id === one.id && isUpdateSuccess) ||
        (currentData.id === one.id && isDeleteSuccess)
      }
      isError={
        (currentData.id === one.id && isUpdateError) ||
        (currentData.id === one.id && isDeleteError)
      }
      key={index}
      openItem={() => {
        setMode('preview');
        setCurrentData(one);
        setOpen(true);
      }}
      handleDelete={() => handleDeleteClient(one)} // Pass client to handleDeleteClient
      edit_permission={edit_permission}
      delete_permission={delete_permission}
    >
      <div>
        <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{one.name}</div>
        {one.display_phone_number && (
          <div style={{ fontSize: '0.8em', color: '#888' }}>
            Phone Number: {one.display_phone_number}
          </div>
        )}
        {one.whatsapp_business_id && (
          <div style={{ fontSize: '0.8em', color: '#555', marginTop: '4px' }}>
            WhatsApp Business ID: {one.whatsapp_business_id}
          </div>
        )}
        {one.webhook_url && (
          <ToolTip text={one.webhook_url}>
            <div style={{ fontSize: '0.8em', color: '#555' }}>
              Webhook URL: {one.webhook_url}
            </div>
          </ToolTip>
        )}
        {one.rate_limit_per_minute && (
          <div style={{ fontSize: '0.8em', color: '#555' }}>
            Rate Limit Per Minute: {one.rate_limit_per_minute}
          </div>
        )}
        {one.status && (
          <div style={{ fontSize: '0.8em', color: '#555' }}>
            Status:{' '}
            {one.status === 'active' ? (
              <Badge color="success" label="Active" />
            ) : (
              <Badge color="error" label="Inactive" />
            )}
          </div>
        )}
        {one.id && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<KeyIcon />}
            onClick={handleViewApiKeys}
            style={{ marginTop: '10px' }}
          >
            View API Keys
          </Button>
        )}
      </div>
    </ListItemComponent>
  );
};

export default ClientListItem;
