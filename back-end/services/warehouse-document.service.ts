import { WarehouseDocumentRepository } from "../repositories/warehouse-document.repo";

export class WarehouseDocumentService {
    constructor(private readonly warehouseDocumentRepository: WarehouseDocumentRepository) {}

    async getAllWarehouseDocuments() {
        return this.warehouseDocumentRepository.getAllWarehouseDocuments();
    }
}
