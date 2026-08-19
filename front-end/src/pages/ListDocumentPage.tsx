import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import CustomTable, { type ColumnConfig } from "../components/general/CustomTable";
import { warehouseDocumentService } from "../services/warehouse-document.service";
import type { WarehouseDocument } from "../../../shared/types/warehouse-document";

const COLUMNS: ColumnConfig<WarehouseDocument>[] = [
    { key: "id", label: "ID", width: 60 },
    { key: "numberOfDocuments", label: "Số văn bản" },
    { key: "departmentName", label: "Bộ phận" },
    { key: "unitName", label: "Đơn vị" },
    { key: "deliveryName", label: "Người giao" },
    { key: "receivedWarehouseName", label: "Kho nhập" },
    { key: "totalAmount", label: "Tổng tiền", align: "right",
        renderCell: (row) => row.totalAmount.toLocaleString("vi-VN") + " đ" },
    { key: "createdAt", label: "Ngày tạo",
        renderCell: (row) => new Date(row.createdAt).toLocaleDateString("vi-VN") },
];

export default function ListDocumentPage() {
    const navigate = useNavigate();
    const [rows, setRows] = useState<WarehouseDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        warehouseDocumentService.getAllWarehouseDocuments()
            .then(setRows)
            .catch(() => setError('Không thể tải danh sách đơn nhập kho.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Danh sách đơn nhập kho
                </Typography>
                <Button variant="contained" onClick={() => navigate('/add-warehouse-docs')}>
                    Tạo mới
                </Button>
            </Box>

            {error && (
                <Typography color="error" variant="body2" sx={{ mb: 1 }}>{error}</Typography>
            )}

            <CustomTable<WarehouseDocument>
                columns={COLUMNS}
                rows={rows}
                loading={loading}
                getRowKey={(row) => row.id}
                emptyMessage="Chưa có đơn nhập kho nào."
                renderActions={(row) => (
                    <Button size="small" variant="outlined"
                        onClick={() => navigate(`/view-warehouse-docs/${row.id}`)}>
                        Xem
                    </Button>
                )}
                actionColumnLabel="Thao tác"
            />
        </Box>
    );
}