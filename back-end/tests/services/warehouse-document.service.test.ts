import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WarehouseDocumentService } from '../../services/warehouse-document.service';
import type { WarehouseDocumentRepository } from '../../repositories/warehouse-document.repo';

const fakeDoc = {
    id: 1,
    departmentName: 'Phòng IT',
    unitName: 'Đơn vị A',
    numberOfDocuments: 'DOC-001',
    deliveryName: 'Nguyễn Văn A',
    receivedWarehouseName: 'Kho A',
    receivedLocationName: 'Vị trí A',
    totalAmount: 1000000,
    numberOfFiles: 1,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
};

const validInput = {
    departmentName: 'Phòng IT',
    unitName: 'Đơn vị A',
    numberOfDocuments: 'DOC-001',
    deliveryName: 'Nguyễn Văn A',
    receivedWarehouseName: 'Kho A',
    receivedLocationName: 'Vị trí A',
    totalAmount: 1000000,
    numberOfFiles: 1,
    assets: [
        {
            assetName: 'Laptop',
            assetCode: 'LP-001',
            assetUnitName: 'Cái',
            evidentQuantity: 1,
            realizedQuantity: 1,
            unitPrice: 1000000,
            totalAmount: 1000000,
        },
    ],
};

describe('WarehouseDocumentService.createWarehouseDocument', () => {
    let service: WarehouseDocumentService;
    let mockRepo: { createWarehouseDocument: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        mockRepo = { createWarehouseDocument: vi.fn() };
        service = new WarehouseDocumentService(mockRepo as unknown as WarehouseDocumentRepository);
    });

    it('ủy thác đúng input xuống repository', async () => {
        mockRepo.createWarehouseDocument.mockResolvedValue(fakeDoc);

        await service.createWarehouseDocument(validInput);

        expect(mockRepo.createWarehouseDocument).toHaveBeenCalledOnce();
        expect(mockRepo.createWarehouseDocument).toHaveBeenCalledWith(validInput);
    });

    it('trả về đúng kết quả từ repository', async () => {
        mockRepo.createWarehouseDocument.mockResolvedValue(fakeDoc);

        const result = await service.createWarehouseDocument(validInput);

        expect(result).toBe(fakeDoc);
    });

    it('propagate lỗi khi repository throw', async () => {
        const err = new Error('DB error');
        mockRepo.createWarehouseDocument.mockRejectedValue(err);

        await expect(service.createWarehouseDocument(validInput)).rejects.toThrow('DB error');
    });
});
