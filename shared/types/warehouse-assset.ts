export interface WarehouseAsset {
    id: number;
    warehouseDocumentId: number;
    assetName: string;
    assetCode: string;
    assetUnitName: string;
    evidentQuantity: number;
    relizedQuantity: number;
    unitPrice: number;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}