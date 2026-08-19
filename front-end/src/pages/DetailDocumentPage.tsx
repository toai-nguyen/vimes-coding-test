import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import CustomTable from "../components/general/CustomTable";
import { warehouseDocumentService, type WarehouseDocumentDetail } from "../services/warehouse-document.service";
import { ASSET_COLUMNS } from "../components/warehouse_module/assetTableColumns";
import { LOG_COLUMNS } from "../components/warehouse_module/logTableColumns";
import { APPROVE_COLUMNS } from "../components/warehouse_module/approveTableColumns";

function InfoRow({ label, value }: { label: string; value: string | number }) {
    return (
        <Box>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{value}</Typography>
        </Box>
    );
}

export default function DetailDocumentPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [doc, setDoc] = useState<WarehouseDocumentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        warehouseDocumentService.getWarehouseDocumentById(Number(id))
            .then(setDoc)
            .catch(() => setError('Không thể tải thông tin đơn nhập kho.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !doc) {
        return (
            <Box sx={{ maxWidth: 980, mx: 'auto', px: 3, py: 4 }}>
                <Typography color="error">{error || 'Không tìm thấy đơn nhập kho.'}</Typography>
                <Button sx={{ mt: 2 }} onClick={() => navigate('/')}>Quay lại danh sách</Button>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', px: 3, py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Chi tiết đơn nhập kho #{doc.id}
                </Typography>
                <Button variant="outlined" onClick={() => navigate('/')}>Quay lại</Button>
            </Box>

            <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#fff', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Thông tin chung</Typography>
                <Grid container spacing={2}>
                    {([
                        ["Số văn bản", doc.numberOfDocuments],
                        ["Bộ phận", doc.departmentName],
                        ["Đơn vị", doc.unitName],
                        ["Người giao", doc.deliveryName],
                        ["Kho nhập", doc.receivedWarehouseName],
                        ["Địa điểm", doc.receivedLocationName],
                        ["Tổng thành tiền", doc.totalAmount.toLocaleString("vi-VN") + " đ"],
                        ["Ngày tạo", new Date(doc.createdAt).toLocaleString("vi-VN")],
                    ] as [string, string | number][]).map(([label, value]) => (
                        <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
                            <InfoRow label={label} value={value} />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#fff', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Danh sách sản phẩm</Typography>
                <CustomTable
                    columns={ASSET_COLUMNS}
                    rows={doc.assets}
                    getRowKey={(row) => row.id}
                    emptyMessage="Không có sản phẩm nào."
                />
            </Box>

                {/* Nhật ký */}
                    <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#fff' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Nhật ký</Typography>
                        <CustomTable
                            columns={LOG_COLUMNS}
                            rows={doc.logs}
                            getRowKey={(row) => row.id}
                            emptyMessage="Không có nhật ký."
                        />
                    </Box>
                {/* </Grid> */}

                {/* Trạng thái duyệt */}
                    <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#fff' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Trạng thái duyệt</Typography>
                        <CustomTable
                            columns={APPROVE_COLUMNS}
                            rows={doc.approves}
                            getRowKey={(row) => row.id}
                            emptyMessage="Không có thông tin duyệt."
                        />
                    </Box>
        </Box>
    );
}