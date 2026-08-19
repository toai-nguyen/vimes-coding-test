import type { ColumnConfig } from "../general/CustomTable";
import type { WarehouseAsset } from "../../../../shared/types/warehouse-assset";

export const ASSET_COLUMNS: ColumnConfig<WarehouseAsset>[] = [
    { key: "assetCode", label: "Mã số", width: 120 },
    { key: "assetName", label: "Tên sản phẩm" },
    { key: "assetUnitName", label: "Đơn vị tính", width: 110 },
    { key: "evidentQuantity", label: "SL chứng từ", align: "right", width: 120 },
    { key: "relizedQuantity", label: "SL thực tế", align: "right", width: 110 },
    {
        key: "unitPrice", label: "Đơn giá", align: "right", width: 130,
        renderCell: (row) => row.unitPrice.toLocaleString("vi-VN") + " đ",
    },
    {
        key: "totalAmount", label: "Thành tiền", align: "right", width: 140,
        renderCell: (row) => row.totalAmount.toLocaleString("vi-VN") + " đ",
    },
];
