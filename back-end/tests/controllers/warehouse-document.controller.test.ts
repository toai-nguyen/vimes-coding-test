import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { WarehouseDocumentController } from '../../controllers/warehouse-document.controller';
import type { WarehouseDocumentService } from '../../services/warehouse-document.service';

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

const validBody = {
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

describe('WarehouseDocumentController.createWarehouseDocument', () => {
    let controller: WarehouseDocumentController;
    let mockService: { createWarehouseDocument: ReturnType<typeof vi.fn> };
    let mockRes: { status: ReturnType<typeof vi.fn>; json: ReturnType<typeof vi.fn> };
    let mockNext: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockService = { createWarehouseDocument: vi.fn() };
        controller = new WarehouseDocumentController(mockService as unknown as WarehouseDocumentService);
        mockRes = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        mockNext = vi.fn();
    });

    it('trả về 201 cùng document khi tạo thành công', async () => {
        mockService.createWarehouseDocument.mockResolvedValue(fakeDoc);

        await controller.createWarehouseDocument(
            { body: validBody } as Request,
            mockRes as unknown as Response,
            mockNext,
        );

        expect(mockService.createWarehouseDocument).toHaveBeenCalledWith(validBody);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(fakeDoc);
    });

    it('gọi next(error) khi service throw lỗi', async () => {
        const err = new Error('Service failed');
        mockService.createWarehouseDocument.mockRejectedValue(err);

        await controller.createWarehouseDocument(
            { body: validBody } as Request,
            mockRes as unknown as Response,
            mockNext,
        );

        expect(mockNext).toHaveBeenCalledWith(err);
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
    });
});
