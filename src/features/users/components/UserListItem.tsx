import ListItemComponent from '@/components/List/ListItem';
import { User } from '@/models/users';

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
  handleDeleteUser: (user: User) => void; // Add handleDeleteUser prop
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
  handleDeleteUser // Destructure handleDeleteUser
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
      handleDelete={() => handleDeleteUser(one)} // Pass user to handleDeleteUser
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
            Status: {one.status}
          </div>
        )}
      </div>
    </ListItemComponent>
  );
};

export default UserListItem;
