import ListItemComponent from '@/components/List/ListItem';
import { Role } from '@/models/roles';

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
  setOpen
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
    >
      <>{one.name || one.title}</>
    </ListItemComponent>
  );
};

export default RoleListItem;
