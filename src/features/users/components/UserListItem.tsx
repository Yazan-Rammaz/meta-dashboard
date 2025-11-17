import { User } from '@/types/users';
import Badge from '@/ui/Badge';
import ListItemComponent from '@/ui/List/ListItem';

interface UserListItemProps {
  one: User;
  index: number;
  currentData: User;
  isUpdateLoading: boolean;
  isDeleteLoading: boolean;
  isUpdateSuccess: boolean;
  isDeleteSuccess: boolean;
  isUpdateError: boolean;
  isDeleteError: boolean;
  setMode: (mode: 'add' | 'update' | 'preview') => void;
  setCurrentData: (data: User) => void;
  setOpen: (open: boolean) => void;
  handleDeleteClick: (user: User) => void; // Change prop name to handleDeleteClick
  edit_permission: string; // Add edit_permission
  delete_permission: string; // Add delete_permission
}

const UserListItem: React.FC<UserListItemProps> = ({
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
  handleDeleteClick, // Destructure handleDeleteClick
  edit_permission, // Destructure edit_permission
  delete_permission // Destructure delete_permission
}) => {
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
      handleDelete={() => handleDeleteClick(one)} // Pass user to handleDeleteClick
      edit_permission={edit_permission}
      delete_permission={delete_permission}
    >
      <div>
        <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{one.name}</div>
        {one.email && (
          <div style={{ fontSize: '0.8em', color: '#888' }}>
            Email: {one.email}
          </div>
        )}
        {one.role && (
          <div style={{ fontSize: '0.8em', color: '#555', marginTop: '4px' }}>
            Role: {one.role}
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
      </div>
    </ListItemComponent>
  );
};

export default UserListItem;
