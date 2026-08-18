export interface WarehouseDocument {
    id: number;
    departmentName: string;
    unitName: string;
    numberOfDocuments: string;
    deliveryName: string;
    receivedWarehouseName: string;
    receivedLocationName: string
    totalAmount: number;
    numberOfFiles: number;
    createdAt: string;
    updatedAt: string;
}