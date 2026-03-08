import {
    Box,
    Button,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';

export interface TableColumn<T> {
    id: keyof T | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right' | 'center' | 'left';
    format?: (value: any) => string;
}

interface TableComponentProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    total?: number;
    page?: number;
    onPageChange?: (page: number) => void;
    perPage?: number;
}

function TableComponent<T extends { id?: string | number }>({
    columns,
    data,
    onEdit,
    onDelete,
    total,
    page = 1,
    onPageChange,
    perPage = 15,
}: TableComponentProps<T>) {
    const pageCount = total ? Math.ceil(total / perPage) : 0;

    return (
        <Box>
            {total !== undefined && (
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Total: {total}
                </Typography>
            )}
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
                        {data.map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                    {columns.map((column) => {
                                        const value = row[column.id as keyof T];
                                        return (
                                            <TableCell key={String(column.id)} align={column.align}>
                                                {column.id === 'actions' ? (
                                                    <>
                                                        {onEdit && (
                                                            <Button onClick={() => onEdit(row)}>
                                                                Edit
                                                            </Button>
                                                        )}
                                                        {onDelete && (
                                                            <Button onClick={() => onDelete(row)}>
                                                                Delete
                                                            </Button>
                                                        )}
                                                    </>
                                                ) : column.format ? (
                                                    column.format(value)
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
            {onPageChange && pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(_, value) => onPageChange(value)}
                        color="primary"
                    />
                </Box>
            )}
        </Box>
    );
}

export default TableComponent;
