import type { ReactNode } from "react";
import {
    Box,
    CircularProgress,
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    type SxProps,
    type TableCellProps,
    type Theme,
} from "@mui/material";

export type TableRowData = object;

export interface ColumnConfig<T extends TableRowData = TableRowData> {
    key: keyof T | string;
    label: string;
    width?: number | string;
    align?: TableCellProps["align"];
    renderCell?: (row: T, rowIndex: number) => ReactNode;
}

interface CustomTableProps<T extends TableRowData = TableRowData> {
    columns: ColumnConfig<T>[];
    rows: T[];
    getRowKey?: (row: T, rowIndex: number) => string | number;
    renderActions?: (row: T, rowIndex: number) => ReactNode;
    actionColumnLabel?: string;
    actionColumnWidth?: number | string;
    emptyMessage?: string;
    loading?: boolean;
    loadingMessage?: string;
    sx?: SxProps<Theme>;
}

function CustomTable<T extends TableRowData = TableRowData>({
    columns,
    rows,
    getRowKey,
    renderActions,
    actionColumnLabel = "Actions",
    actionColumnWidth = 140,
    emptyMessage = "No data",
    loading = false,
    loadingMessage = "Loading data...",
    sx,
}: CustomTableProps<T>) {
    const hasActions = Boolean(renderActions);
    const columnCount = Math.max(columns.length + (hasActions ? 1 : 0), 1);
    const shouldShowLoadingRow = loading && rows.length === 0;

    const getCellValue = (row: T, key: keyof T | string): ReactNode => {
        const value = row[key as keyof T];

        if (value === null || value === undefined) {
            return "";
        }

        if (typeof value === "string" || typeof value === "number") {
            return value;
        }

        if (typeof value === "boolean") {
            return value ? "Yes" : "No";
        }

        return String(value);
    };

    return (
        <TableContainer component={Paper} elevation={0} sx={[styles.container, ...(Array.isArray(sx) ? sx : [sx])]}>
            {loading && !shouldShowLoadingRow && (
                <LinearProgress sx={styles.loadingBar} />
            )}
            <Table sx={styles.table}>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={String(column.key)}
                                align={column.align}
                                sx={{ ...styles.headerCell, width: column.width }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                        {hasActions && (
                            <TableCell
                                align="center"
                                sx={{ ...styles.headerCell, width: actionColumnWidth }}
                            >
                                {actionColumnLabel}
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {shouldShowLoadingRow ? (
                        <TableRow>
                            <TableCell colSpan={columnCount}>
                                <Box sx={styles.loadingContainer}>
                                    <CircularProgress size={24} />
                                    <Typography variant="body2" sx={styles.loadingText}>
                                        {loadingMessage}
                                    </Typography>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ) : rows.length > 0 ? (
                        rows.map((row, rowIndex) => (
                            <TableRow
                                key={getRowKey?.(row, rowIndex) ?? rowIndex}
                                hover
                                sx={styles.bodyRow}
                            >
                                {columns.map((column) => (
                                    <TableCell
                                        key={String(column.key)}
                                        align={column.align}
                                        sx={styles.bodyCell}
                                    >
                                        {column.renderCell
                                            ? column.renderCell(row, rowIndex)
                                            : getCellValue(row, column.key)}
                                    </TableCell>
                                ))}
                                {hasActions && (
                                    <TableCell align="center" sx={styles.actionCell}>
                                        <Box sx={styles.actionContainer}>
                                            {renderActions?.(row, rowIndex)}
                                        </Box>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columnCount}>
                                <Typography variant="body2" sx={styles.emptyText}>
                                    {emptyMessage}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const styles = {
    container: {
        position: "relative",
        width: "100%",
        mt: 2,
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        overflowX: "auto",
    },
    loadingBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    table: {
        minWidth: 720,
    },
    headerCell: {
        bgcolor: "#f5f5f5",
        fontWeight: 700,
        whiteSpace: "nowrap",
    },
    bodyRow: {
        "&:last-child td": {
            borderBottom: 0,
        },
    },
    bodyCell: {
        verticalAlign: "middle",
    },
    actionCell: {
        verticalAlign: "middle",
        whiteSpace: "nowrap",
    },
    actionContainer: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
    },
    loadingContainer: {
        minHeight: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
    },
    loadingText: {
        color: "text.secondary",
    },
    emptyText: {
        py: 4,
        color: "text.secondary",
        textAlign: "center",
    },
} satisfies Record<string, SxProps<Theme>>;

export default CustomTable;
