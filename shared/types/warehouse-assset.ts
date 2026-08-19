export interface WarehouseAsset {
    id: number;
    warehouseDocumentId: number;
    assetName: string;
    assetCode: string;
    assetUnitName: string;
    evidentQuantity: number;
    realizedQuantity: number;
    unitPrice: number;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}