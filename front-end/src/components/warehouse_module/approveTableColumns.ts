import type { ColumnConfig } from "../general/CustomTable";
import type { WarehouseDocumentApprove } from "../../../../shared/types/warehouse-document-approve";

export const APPROVE_COLUMNS: ColumnConfig<WarehouseDocumentApprove>[] = [
    { key: "approveBy", label: "Người duyệt" },
    { key: "approveStatus", label: "Trạng thái", width: 140 },
    {
        key: "approveAt", label: "Thời gian duyệt",
        renderCell: (row) =>
            row.approveAt ? new Date(row.approveAt).toLocaleString("vi-VN") : "—",
    },
];
