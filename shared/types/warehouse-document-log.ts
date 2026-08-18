export interface WarehouseDocumentLog {
    id: number;
    warehouseDocumentId: number;
    action: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}