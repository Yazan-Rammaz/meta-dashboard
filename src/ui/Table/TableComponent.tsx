import DeleteIcon from '@/ui/Modal/icons/deleteIcon';
import EditIcon from '@/ui/Modal/icons/editIcon';
import ToolTip from '@/ui/Tooltip';
import CanCall from '@/utils/ability';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

export interface TableColumn<T> {
  id: keyof T | 'actions' | 'api_keys';
  label: string;
  minWidth?: number;
  align?: 'right' | 'center' | 'left';
  format?: (value: any, row: T) => string | JSX.Element;
}

interface TableComponentProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onRevoke?: ((row: T) => void) | undefined;
  deleteText?: string; // Add deleteText prop
  edit_permission?: string;
  delete_permission?: string;
  revoke_permission?: string;
}

function TableComponent<T extends { id?: string | number; revoked?: boolean }>({
  columns,
  data,
  onEdit,
  onDelete,
  onRevoke,
  deleteText = 'Delete',
  edit_permission,
  delete_permission,
  revoke_permission
}: TableComponentProps<T>) {
  return (
    console.log(data, 'data'),
    (
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: T) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id as keyof T];
                    return (
                      <TableCell key={String(column.id)} align={column.align}>
                        {column.id === 'actions' ? (
                          <>
                            {onEdit && (
                              <CanCall permission={edit_permission}>
                                <ToolTip text="Edit">
                                  <Button onClick={() => onEdit(row)}>
                                    <EditIcon />
                                  </Button>
                                </ToolTip>
                              </CanCall>
                            )}
                            {onDelete && (
                              <CanCall permission={delete_permission}>
                                <ToolTip text={deleteText}>
                                  <Button onClick={() => onDelete(row)}>
                                    <DeleteIcon />
                                  </Button>
                                </ToolTip>
                              </CanCall>
                            )}
                            {onRevoke && !row.revoked && (
                              <CanCall permission={revoke_permission}>
                                <ToolTip text={deleteText}>
                                  <Button onClick={() => onRevoke(row)}>
                                    <DeleteIcon />
                                  </Button>
                                </ToolTip>
                              </CanCall>
                            )}
                          </>
                        ) : column.format ? (
                          column.format(value, row)
                        ) : (
                          String(value)
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    )
  );
}

export default TableComponent;
