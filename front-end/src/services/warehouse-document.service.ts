import apiClient from "../api/client";
import type { WarehouseDocument } from "../../../shared/types/warehouse-document";
import type { WarehouseAsset } from "../../../shared/types/warehouse-assset";

export interface CreateWarehouseDocumentPayload {
    departmentName: string;
    unitName: string;
    numberOfDocuments: string;
    documentDate: string;
    deliveryName: string;
    receivedWarehouseName: string;
    receivedLocationName: string;
    totalAmount: number;
    numberOfFiles: number;
    assets: Omit<WarehouseAsset, 'id' | 'warehouseDocumentId' | 'createdAt' | 'updatedAt' | 'deletedAt'>[];
}

export interface WarehouseDocumentDetail extends WarehouseDocument {
    assets: WarehouseAsset[];
}

const BASE = "/warehouse-documents";

export const warehouseDocumentService = {
    getAllWarehouseDocuments(): Promise<WarehouseDocument[]> {
        return apiClient.get<WarehouseDocument[]>(BASE).then((res) => res.data);
    },

    getWarehouseDocumentById(id: number): Promise<WarehouseDocumentDetail> {
        return apiClient.get<WarehouseDocumentDetail>(`${BASE}/${id}`).then((res) => res.data);
    },

    createWarehouseDocument(payload: CreateWarehouseDocumentPayload): Promise<WarehouseDocument> {
        return apiClient.post<WarehouseDocument>(BASE, payload).then((res) => res.data);
    },

    deleteWarehouseDocument(id: number): Promise<void> {
        return apiClient.delete(`${BASE}/${id}`).then(() => undefined);
    },
};