import {
    Box,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
} from '@mui/material';

import { forwardRef, useImperativeHandle, useState } from 'react';

export interface AssetRow {
    id: number;
    assetName: string;
    assetCode: string;
    assetUnitName: string;
    evidentQuantity: string;
    realizedQuantity: string;
    unitPrice: string;
    totalAmount: string;
}

type AssetRowErrors = Partial<Record<keyof Omit<AssetRow, 'id'>, string>>;

export interface WarehouseFormTableHandle {
    getRows: () => AssetRow[] | null;
}

const COLUMNS: { key: keyof Omit<AssetRow, 'id'>; label: string; type?: string }[] = [
    { key: 'assetName', label: 'Tên sản phẩm' },
    { key: 'assetCode', label: 'Mã số' },
    { key: 'assetUnitName', label: 'Đơn vị tính' },
    { key: 'evidentQuantity', label: 'SL theo chứng từ', type: 'number' },
    { key: 'realizedQuantity', label: 'SL thực tế', type: 'number' },
    { key: 'unitPrice', label: 'Đơn giá', type: 'number' },
    { key: 'totalAmount', label: 'Thành tiền', type: 'number' },
];

const createEmptyRow = (id: number): AssetRow => ({
    id,
    assetName: '',
    assetCode: '',
    assetUnitName: '',
    evidentQuantity: '',
    realizedQuantity: '',
    unitPrice: '',
    totalAmount: '',
});

let nextId = 1;

const validateRow = (row: AssetRow): AssetRowErrors => {
    const errors: AssetRowErrors = {};
    const requiredText: Array<keyof Omit<AssetRow, 'id'>> = ['assetName', 'assetCode', 'assetUnitName'];
    const requiredNumber: Array<keyof Omit<AssetRow, 'id'>> = ['evidentQuantity', 'realizedQuantity', 'unitPrice', 'totalAmount'];

    requiredText.forEach((key) => {
        if (!String(row[key]).trim()) {
            errors[key] = 'Không được để trống';
        }
    });

    requiredNumber.forEach((key) => {
        const val = row[key];
        if (val === '' || val === null) {
            errors[key] = 'Không được để trống';
        } else if (isNaN(Number(val)) || Number(val) < 0) {
            errors[key] = 'Phải là số không âm';
        }
    });

    return errors;
};

interface WarehouseFormTableProps {
    onRowsChange?: (rows: AssetRow[]) => void;
}

const WarehouseFormTable = forwardRef<WarehouseFormTableHandle, WarehouseFormTableProps>(({ onRowsChange }, ref) => {
    const [rows, setRows] = useState<AssetRow[]>([createEmptyRow(nextId++)]);
    const [rowErrors, setRowErrors] = useState<Record<number, AssetRowErrors>>({});

    useImperativeHandle(ref, () => ({
        getRows: () => {
            const allErrors: Record<number, AssetRowErrors> = {};
            let hasError = false;

            rows.forEach((row) => {
                const errors = validateRow(row);
                if (Object.keys(errors).length > 0) {
                    allErrors[row.id] = errors;
                    hasError = true;
                }
            });

            setRowErrors(allErrors);
            return hasError ? null : rows;
        },
    }));

    const handleAddRow = () => {
        setRows((prev) => {
            const next = [...prev, createEmptyRow(nextId++)];
            onRowsChange?.(next);
            return next;
        });
    };

    const handleDeleteRow = (id: number) => {
        setRows((prev) => {
            const next = prev.filter((r) => r.id !== id);
            onRowsChange?.(next);
            return next;
        });
        setRowErrors((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    const handleChange = (id: number, key: keyof Omit<AssetRow, 'id'>, value: string) => {
        setRows((prev) => {
            const next = prev.map((row) => (row.id === id ? { ...row, [key]: value } : row));
            onRowsChange?.(next);
            return next;
        });
        setRowErrors((prev) => {
            if (!prev[id]?.[key]) return prev;
            const next = { ...prev, [id]: { ...prev[id], [key]: undefined } };
            return next;
        });
    };

    return (
        <Box>
            <TableContainer component={Paper} variant="outlined">
                <Table size="small" sx={{ minWidth: 900 }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'grey.100' }}>
                            <TableCell sx={{ width: 48 }} />
                            {COLUMNS.map((col) => (
                                <TableCell key={col.key} sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id} sx={{ verticalAlign: 'top' }}>
                                <TableCell sx={{ pt: 1.5 }}>
                                    <Tooltip title="Xóa dòng">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteRow(row.id)}
                                            disabled={rows.length === 1}
                                        >
                                            ✕
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                {COLUMNS.map((col) => (
                                    <TableCell key={col.key} sx={{ py: 1 }}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            type={col.type ?? 'text'}
                                            value={row[col.key]}
                                            onChange={(e) => handleChange(row.id, col.key, e.target.value)}
                                            error={!!rowErrors[row.id]?.[col.key]}
                                            helperText={rowErrors[row.id]?.[col.key] ?? ' '}
                                            slotProps={{ htmlInput: { min: 0 } }}
                                            sx={{ minWidth: 110 }}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 1 }}>
                <Button
                    variant="outlined"
                    onClick={handleAddRow}
                    size="small"
                >
                    Thêm dòng
                </Button>
            </Box>
        </Box>
    );
});

WarehouseFormTable.displayName = 'WarehouseFormTable';

export default WarehouseFormTable;