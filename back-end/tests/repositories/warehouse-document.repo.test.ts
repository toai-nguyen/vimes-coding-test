import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WarehouseDocumentRepository } from '../../repositories/warehouse-document.repo';

// mock toàn bộ module database, tránh kết nối thật
vi.mock('../../config/database', () => ({
    pool: { connect: vi.fn() },
}));

import { pool } from '../../config/database';

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

const fakeDoc = {
    id: 42,
    departmentName: validInput.departmentName,
    unitName: validInput.unitName,
    numberOfDocuments: validInput.numberOfDocuments,
    deliveryName: validInput.deliveryName,
    receivedWarehouseName: validInput.receivedWarehouseName,
    receivedLocationName: validInput.receivedLocationName,
    totalAmount: validInput.totalAmount,
    numberOfFiles: validInput.numberOfFiles,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
};

const makeMockClient = (docRows: unknown[] = [fakeDoc]) => ({
    query: vi.fn().mockImplementation((sql: string) => {
        if (typeof sql === 'string' && sql.includes('INSERT INTO warehouse_document')) {
            return Promise.resolve({ rows: docRows });
        }
        return Promise.resolve({ rows: [] });
    }),
    release: vi.fn(),
});

describe('WarehouseDocumentRepository.createWarehouseDocument', () => {
    let repo: WarehouseDocumentRepository;

    beforeEach(() => {
        repo = new WarehouseDocumentRepository();
        vi.clearAllMocks();
    });

    it('thực thi đúng thứ tự: BEGIN → INSERT doc → INSERT assets → INSERT approvers → INSERT log → COMMIT', async () => {
        const mockClient = makeMockClient();
        vi.mocked(pool.connect).mockResolvedValue(mockClient as any);

        await repo.createWarehouseDocument(validInput);

        const calls: string[] = mockClient.query.mock.calls.map((c: unknown[]) =>
            typeof c[0] === 'string' ? c[0].trim().split(/\s+/)[0] ?? '' : '',
        );

        expect(calls[0]).toBe('BEGIN');
        expect(mockClient.query.mock.calls[1]?.[0]).toMatch(/INSERT INTO warehouse_document/);
        expect(mockClient.query.mock.calls[2]?.[0]).toMatch(/INSERT INTO warehouse_assets/);
        // 4 approvers sau 1 asset  →  index 3-6
        expect(mockClient.query.mock.calls[3]?.[0]).toMatch(/INSERT INTO warehouse_document_approve/);
        expect(mockClient.query.mock.calls[6]?.[0]).toMatch(/INSERT INTO warehouse_document_approve/);
        expect(mockClient.query.mock.calls[7]?.[0]).toMatch(/INSERT INTO warehouse_document_logs/);
        expect(calls[8]).toBe('COMMIT');
    });

    it('trả về document sau khi tạo thành công', async () => {
        const mockClient = makeMockClient();
        vi.mocked(pool.connect).mockResolvedValue(mockClient as any);

        const result = await repo.createWarehouseDocument(validInput);

        expect(result).toEqual(fakeDoc);
    });

    it('insert đúng số lần cho assets (1 asset → 1 lần)', async () => {
        const mockClient = makeMockClient();
        vi.mocked(pool.connect).mockResolvedValue(mockClient as any);

        await repo.createWarehouseDocument(validInput);

        const assetInserts = mockClient.query.mock.calls.filter((c: unknown[]) =>
            typeof c[0] === 'string' && c[0].includes('INSERT INTO warehouse_assets'),
        );
        expect(assetInserts).toHaveLength(1);
    });

    it('insert đúng 4 approvers', async () => {
        const mockClient = makeMockClient();
        vi.mocked(pool.connect).mockResolvedValue(mockClient as any);

        await repo.createWarehouseDocument(validInput);

        const approverInserts = mockClient.query.mock.calls.filter((c: unknown[]) =>
            typeof c[0] === 'string' && c[0].includes('INSERT INTO warehouse_document_approve'),
        );
        expect(approverInserts).toHaveLength(4);
    });

    it('insert log với action "Thêm mới"', async () => {
        const mockClient = makeMockClient();
        vi.mocked(pool.connect).mockResolvedValue(mockClient as any);

        await repo.createWarehouseDocument(validInput);

        const logCall = mockClient.query.mock.calls.find((c: unknown[]) =>
            typeof c[0] === 'string' && c[0].includes('INSERT INTO warehouse_document_logs'),
        );
        expect(logCall?.[1]).toContain('Thêm mới');
    });

    it('gọi ROLLBACK và throw lỗi khi INSERT doc thất bại', async () => {
        const mockClient = {
            query: vi.fn().mockImplementation((sql: string) => {
                if (typeof sql === 'string' && sql.includes('INSERT INTO warehouse_document')) {
                    return Promise.reject(new Error('DB insert failed'));
                }
                return Promise.resolve({ rows: [] });
            }),
            release: vi.fn(),
        };
        vi.mocked(pool.connect).mockResolvedValue(mockClient as any);

        await expect(repo.createWarehouseDocument(validInput)).rejects.toThrow('DB insert failed');

        const rollbackCall = mockClient.query.mock.calls.find(
            (c: unknown[]) => c[0] === 'ROLLBACK',
        );
        expect(rollbackCall).toBeDefined();
    });

    it('gọi ROLLBACK khi INSERT doc trả về rows rỗng', async () => {
        const mockClient = makeMockClient([]);
        vi.mocked(pool.connect).mockResolvedValue(mockClient as any);

        await expect(repo.createWarehouseDocument(validInput)).rejects.toThrow(
            'Failed to create warehouse document',
        );

        const rollbackCall = mockClient.query.mock.calls.find(
            (c: unknown[]) => c[0] === 'ROLLBACK',
        );
        expect(rollbackCall).toBeDefined();
    });
});
