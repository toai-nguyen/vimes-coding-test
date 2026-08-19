import { WarehouseDocumentRepository, type CreateWarehouseDocumentInput } from "../repositories/warehouse-document.repo";

export class WarehouseDocumentService {
    constructor(private readonly warehouseDocumentRepository: WarehouseDocumentRepository) {}

    async getAllWarehouseDocuments() {
        return this.warehouseDocumentRepository.getAllWarehouseDocuments();
    }

    async getWarehouseDocumentById(id: number) {
        return this.warehouseDocumentRepository.getWarehouseDocumentById(id);
    }

    async createWarehouseDocument(input: CreateWarehouseDocumentInput) {
        return this.warehouseDocumentRepository.createWarehouseDocument(input);
    }
}
