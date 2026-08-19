import type { ColumnConfig } from "../general/CustomTable";
import type { WarehouseDocumentLog } from "../../../../shared/types/warehouse-document-log";

export const LOG_COLUMNS: ColumnConfig<WarehouseDocumentLog>[] = [
    { key: "id", label: "ID", width: 60 },
    { key: "action", label: "Hành động" },
    {
        key: "createdAt", label: "Thời gian",
        renderCell: (row) => new Date(row.createdAt).toLocaleString("vi-VN"),
    },
];
