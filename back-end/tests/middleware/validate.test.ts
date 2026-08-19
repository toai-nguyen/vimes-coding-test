import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { validate } from '../../middleware/validate';
import { CreateWarehouseDocumentSchema } from '../../validations/warehouse-document.schema';

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

const makeRes = () => ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
});

describe('validate middleware — CreateWarehouseDocumentSchema', () => {
    const middleware = validate(CreateWarehouseDocumentSchema);

    it('gọi next() khi body hợp lệ', () => {
        const req = { body: { ...validBody } } as Request;
        const next = vi.fn() as NextFunction;

        middleware(req, makeRes() as unknown as Response, next);

        expect(next).toHaveBeenCalledOnce();
        expect(next).toHaveBeenCalledWith();
    });

    it('gán parsed data vào req.body', () => {
        const req = { body: { ...validBody } } as Request;
        const next = vi.fn() as NextFunction;

        middleware(req, makeRes() as unknown as Response, next);

        expect(req.body).toEqual(validBody);
    });

    it('trả về 400 khi body rỗng', () => {
        const req = { body: {} } as Request;
        const res = makeRes();
        const next = vi.fn() as NextFunction;

        middleware(req, res as unknown as Response, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ errors: expect.any(Object) }),
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('trả về 400 khi assets là mảng rỗng', () => {
        const req = { body: { ...validBody, assets: [] } } as Request;
        const res = makeRes();

        middleware(req, res as unknown as Response, vi.fn());

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('trả về 400 khi totalAmount âm', () => {
        const req = { body: { ...validBody, totalAmount: -1 } } as Request;
        const res = makeRes();

        middleware(req, res as unknown as Response, vi.fn());

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('trả về 400 khi asset thiếu trường bắt buộc', () => {
        const req = {
            body: {
                ...validBody,
                assets: [{ assetName: 'Laptop' }], // thiếu các trường còn lại
            },
        } as Request;
        const res = makeRes();

        middleware(req, res as unknown as Response, vi.fn());

        expect(res.status).toHaveBeenCalledWith(400);
    });
});
