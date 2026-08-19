import CustomTextField from "../components/general/CustomTextField";
import CustomCalendarField from "../components/general/CustomCalendarField";
import { useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import type { Dayjs } from "dayjs";
import WarehouseFormTable, { type AssetRow, type WarehouseFormTableHandle } from "../components/warehouse_module/WarehouseFormTable";
import { warehouseDocumentService } from "../services/warehouse-document.service";
import { useNavigate } from "react-router-dom";
export interface WarehouseDocument {
    departmentName: string;
    unitName: string;
    numberOfDocuments: string;
    documentDate: Dayjs | null;
    deliveryName: string;
    receivedWarehouseName: string;
    receivedLocationName: string;
    totalAmount: number;
    numberOfFiles: number;
    assets: AssetRow[];
}

type WarehouseDocumentErrors = Partial<Record<keyof WarehouseDocument, string>>;

const initialDocumentState: WarehouseDocument = {
    departmentName: '',
    unitName: '',
    numberOfDocuments: '',
    documentDate: null,
    deliveryName: '',
    receivedWarehouseName: '',
    receivedLocationName: '',
    totalAmount: 0,
    numberOfFiles: 0,
    assets: [],
};

const validateDocument = (values: WarehouseDocument): WarehouseDocumentErrors => {
    const errors: WarehouseDocumentErrors = {};
    const requiredFieldMap: Array<[keyof WarehouseDocument, string]> = [
        ["departmentName", "Bộ phận"],
        ["unitName", "Đơn vị"],
        ["numberOfDocuments", "Số văn bản"],
        ["deliveryName", "Họ và tên người giao"],
        ["receivedWarehouseName", "Nhập tại kho"],
        ["receivedLocationName", "Địa điểm"],
    ];

    requiredFieldMap.forEach(([key, label]) => {
        const value = String(values[key] ?? '').trim();

        if (!value) {
            errors[key] = `${label} không được để trống.`;
        }
    });

    if (!values.documentDate) {
        errors.documentDate = 'Ngày tháng năm không được để trống.';
    }

    return errors;
};

export default function CreateDocumentPage() {
    const navigate = useNavigate();
    const tableRef = useRef<WarehouseFormTableHandle>(null);
    const [document, setDocument] = useState<WarehouseDocument>(initialDocumentState);
    const [errors, setErrors] = useState<WarehouseDocumentErrors>({});
    const [assetError, setAssetError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const fieldName = name as keyof WarehouseDocument;

        setDocument((prevDocument) => ({
            ...prevDocument,
            [fieldName]: value,
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: undefined,
        }));
    };

    const handleDateChange = (value: Dayjs | null) => {
        setDocument((prevDocument) => ({
            ...prevDocument,
            documentDate: value,
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            documentDate: undefined,
        }));
    };

    const handleRowsChange = (rows: AssetRow[]) => {
        const total = rows.reduce((sum, row) => sum + (Number(row.totalAmount) || 0), 0);
        setDocument((prev) => ({ ...prev, totalAmount: total, assets: rows }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateDocument(document);
        setErrors(nextErrors);

        const rows = tableRef.current?.getRows();
        const hasAssetError = rows === null || rows === undefined;
        if (hasAssetError) {
            setAssetError('Danh sách tài sản có lỗi, vui lòng kiểm tra lại.');
        } else {
            setAssetError('');
        }

        if (Object.keys(nextErrors).length > 0 || hasAssetError) return;

        try {
            setIsSubmitting(true);
            setSubmitError('');
            await warehouseDocumentService.createWarehouseDocument({
                departmentName: document.departmentName,
                unitName: document.unitName,
                numberOfDocuments: document.numberOfDocuments,
                documentDate: document.documentDate!.format('YYYY-MM-DD'),
                deliveryName: document.deliveryName,
                receivedWarehouseName: document.receivedWarehouseName,
                receivedLocationName: document.receivedLocationName,
                totalAmount: document.totalAmount,
                numberOfFiles: document.numberOfFiles,
                assets: rows!.map((row) => ({
                    assetName: row.assetName,
                    assetCode: row.assetCode,
                    assetUnitName: row.assetUnitName,
                    evidentQuantity: Number(row.evidentQuantity),
                    realizedQuantity: Number(row.realizedQuantity),
                    unitPrice: Number(row.unitPrice),
                    totalAmount: Number(row.totalAmount),
                })),
            });
            navigate('/');
        } catch {
            setSubmitError('Tạo đơn thất bại, vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 980, mx: 'auto', px: 3, py: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Tạo đơn nhập kho
            </Typography>

            <Box
                id="create-document-form"
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                    gap: 3,
                    p: 3,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#fff',
                }}
            >
                <CustomTextField
                    label="Bộ phận"
                    name="departmentName"
                    value={document.departmentName}
                    onChange={handleOnChange}
                    placeholder="Nhập bộ phận"
                    error={Boolean(errors.departmentName)}
                    helperText={errors.departmentName}
                />

                <CustomTextField
                    label="Đơn vị"
                    name="unitName"
                    value={document.unitName}
                    onChange={handleOnChange}
                    placeholder="Nhập đơn vị"
                    error={Boolean(errors.unitName)}
                    helperText={errors.unitName}
                />

                <CustomTextField
                    label="Số văn bản"
                    name="numberOfDocuments"
                    value={document.numberOfDocuments}
                    onChange={handleOnChange}
                    placeholder="Nhập số văn bản"
                    error={Boolean(errors.numberOfDocuments)}
                    helperText={errors.numberOfDocuments}
                />

                <CustomCalendarField
                    label="Ngày tháng năm"
                    value={document.documentDate}
                    onChange={handleDateChange}
                    error={Boolean(errors.documentDate)}
                    helperText={errors.documentDate}
                    required
                />

                <CustomTextField
                    label="Họ và tên người giao"
                    name="deliveryName"
                    value={document.deliveryName}
                    onChange={handleOnChange}
                    placeholder="Nhập họ và tên người giao"
                    error={Boolean(errors.deliveryName)}
                    helperText={errors.deliveryName}
                />

                <CustomTextField
                    label="Nhập tại kho"
                    name="receivedWarehouseName"
                    value={document.receivedWarehouseName}
                    onChange={handleOnChange}
                    placeholder="Nhập tên kho"
                    error={Boolean(errors.receivedWarehouseName)}
                    helperText={errors.receivedWarehouseName}
                />

                <Box sx={{ gridColumn: { xs: 'auto', md: '1 / -1' } }}>
                    <CustomTextField
                        label="Địa điểm"
                        name="receivedLocationName"
                        value={document.receivedLocationName}
                        onChange={handleOnChange}
                        placeholder="Nhập địa điểm"
                        error={Boolean(errors.receivedLocationName)}
                        helperText={errors.receivedLocationName}
                    />
                </Box>

            </Box>

            <Box sx={{ mt: 3, p: 3, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#fff' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Danh sách tài sản
                </Typography>

                <WarehouseFormTable ref={tableRef} onRowsChange={handleRowsChange} />

                {assetError && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        {assetError}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Tổng thành tiền: {document.totalAmount.toLocaleString('vi-VN')} đ
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            type="submit"
                            form="create-document-form"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            sx={{ minWidth: 150, py: 1.25 }}
                        >
                            {isSubmitting ? 'Đang tạo...' : 'Tạo đơn'}
                        </Button>
                    </Box>
                </Box>

                {submitError && (
                    <Typography variant="body2" color="error" sx={{ fontWeight: 600, mt: 1 }}>
                        {submitError}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}