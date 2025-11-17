import { Role } from '@/types/roles';
import ListItemComponent from '@/ui/List/ListItem';
import ToolTip from '@/ui/Tooltip';

interface RoleListItemProps {
  one: Role;
  index: number;
  currentData: Role;
  isUpdateLoading: boolean;
  isDeleteLoading: boolean;
  isUpdateSuccess: boolean;
  isDeleteSuccess: boolean;
  isUpdateError: boolean;
  isDeleteError: boolean;
  setMode: (mode: 'add' | 'update' | 'preview') => void;
  setCurrentData: (data: Role) => void;
  setOpen: (open: boolean) => void;
  handleDeleteClick: (role: Role) => void; // Change prop name to handleDeleteClick
  edit_permission: string; // Add edit_permission
  delete_permission: string; // Add delete_permission
}

const RoleListItem: React.FC<RoleListItemProps> = ({
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
  // const translatedOneRoleName = useMemo(() => {
  //   if (!one.role_translations) {
  //     return {};
  //   }
  //   return transformTranslations<RoleTranslation>(one.role_translations);
  // }, [one.role_translations]);

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
      handleDelete={() => handleDeleteClick(one)} // Pass role to handleDeleteClick
      edit_permission={edit_permission}
      delete_permission={delete_permission}
    >
      <div>
        <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
          {one.name || one.title}
        </div>
        {one.description && (
          <div style={{ fontSize: '0.8em', color: '#555', marginTop: '4px' }}>
            Description: {one.description}
          </div>
        )}
        {one.permissions && (
          <ToolTip text={one.permissions.join(', ')}>
            <div style={{ fontSize: '0.8em', color: '#555' }}>
              Permissions: {one.permissions.length}
            </div>
          </ToolTip>
        )}
      </div>
    </ListItemComponent>
  );
};

export default RoleListItem;
