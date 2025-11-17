import { ApiKey } from '@/types/api_keys';
import Badge from '@/ui/Badge'; // Corrected import path
import ListItemComponent from '@/ui/List/ListItem';
import ToolTip from '@/ui/Tooltip';
import { truncateMiddle } from '@/utils/string_utils'; // Import truncateMiddle
import { format } from 'date-fns';

interface ApiKeysListItemProps {
  one: ApiKey;
  index: number;
  currentData: ApiKey;
  isUpdateLoading: boolean;
  isRevokeLoading: boolean;
  isUpdateSuccess: boolean;
  isRevokeSuccess: boolean;
  isUpdateError: boolean;
  isRevokeError: boolean;
  setMode: (mode: 'add' | 'update' | 'preview') => void;
  setCurrentData: (data: ApiKey) => void;
  setOpen: (open: boolean) => void;
  handleRevokeClick: ((apiKey: ApiKey) => void) | undefined;
  edit_permission: string;
  revoke_permission: string;
}

const ApiKeysListItem: React.FC<ApiKeysListItemProps> = ({
  one,
  index,
  currentData,
  isUpdateLoading,
  isRevokeLoading,
  isUpdateSuccess,
  isRevokeSuccess,
  isUpdateError,
  isRevokeError,
  setMode,
  setCurrentData,
  setOpen,
  handleRevokeClick
}) => {
  const formattedCreatedAt = one.created_at
    ? format(new Date(one.created_at), 'PPpp')
    : 'N/A';
  const formattedLastUsedAt = one.last_used_at
    ? format(new Date(one.last_used_at), 'PPpp')
    : 'Never';

  return (
    <ListItemComponent
      isLoading={
        (currentData.id === one.id && isUpdateLoading) ||
        (currentData.id === one.id && isRevokeLoading)
      }
      isSuccess={
        (currentData.id === one.id && isUpdateSuccess) ||
        (currentData.id === one.id && isRevokeSuccess)
      }
      isError={
        (currentData.id === one.id && isUpdateError) ||
        (currentData.id === one.id && isRevokeError)
      }
      key={index}
      openItem={() => {
        setMode('preview');
        setCurrentData(one);
        setOpen(true);
      }}
      handleDelete={() => handleRevokeClick && handleRevokeClick(one)}
      deleteText="Revoke"
      hasDelete={!one.revoked}
    >
      <div>
        <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{one.label}</div>
        {one.client_id && (
          <div style={{ fontSize: '0.8em', color: '#888' }}>
            Client ID: {one.client_id}
          </div>
        )}
        {one.key_hash && (
          <ToolTip text={one.key_hash}>
            <div style={{ fontSize: '0.8em', color: '#555', marginTop: '4px' }}>
              Key Hash: {truncateMiddle(one.key_hash, 30)}
            </div>
          </ToolTip>
        )}
        {one.hmac_secret && (
          <ToolTip text={one.hmac_secret}>
            <div style={{ fontSize: '0.8em', color: '#555' }}>
              HMAC Secret: {truncateMiddle(one.hmac_secret, 30)}
            </div>
          </ToolTip>
        )}
        {one.rate_limit_per_minute && (
          <div style={{ fontSize: '0.8em', color: '#555' }}>
            Rate Limit Per Minute: {one.rate_limit_per_minute}
          </div>
        )}
        <div style={{ fontSize: '0.8em', color: '#555' }}>
          Created At: {formattedCreatedAt}
        </div>
        <div style={{ fontSize: '0.8em', color: '#555' }}>
          Last Used At: {formattedLastUsedAt}
        </div>
        <div style={{ fontSize: '0.8em', color: '#555' }}>
          Status:{' '}
          {one.revoked ? (
            <Badge color="error" label="Revoked" />
          ) : (
            <Badge color="success" label="Active" />
          )}
        </div>
      </div>
    </ListItemComponent>
  );
};

export default ApiKeysListItem;
