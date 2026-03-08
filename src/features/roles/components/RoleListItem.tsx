import ListItemComponent from '@/components/List/ListItem';
import { Role } from '@/models/roles';
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
    handleDeleteRole: (role: Role) => void; // Add handleDeleteRole prop
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
    handleDeleteRole, // Destructure handleDeleteRole
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
            handleDelete={() => handleDeleteRole(one)} // Pass role to handleDeleteRole
        >
            <div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{one.name || one.title}</div>
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
