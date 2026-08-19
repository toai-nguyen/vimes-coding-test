import { pool } from '../config/database';
import type { WarehouseDocument } from '@shared/types/warehouse-document';
import type { WarehouseAsset } from '@shared/types/warehouse-assset';
import type { WarehouseDocumentLog } from '@shared/types/warehouse-document-log';
import type { WarehouseDocumentApprove } from '@shared/types/warehouse-document-approve';

export interface WarehouseDocumentDetail extends WarehouseDocument {
    assets: WarehouseAsset[];
    logs: WarehouseDocumentLog[];
    approves: WarehouseDocumentApprove[];
}

export interface AssetInput {
    assetName: string;
    assetCode: string;
    assetUnitName: string;
    evidentQuantity: number;
    realizedQuantity: number;
    unitPrice: number;
    totalAmount: number;
}

export interface CreateWarehouseDocumentInput {
    departmentName: string;
    unitName: string;
    numberOfDocuments: string;
    deliveryName: string;
    receivedWarehouseName: string;
    receivedLocationName: string;
    totalAmount: number;
    numberOfFiles: number;
    assets: AssetInput[];
}

const APPROVERS = ['Người lập phiếu', 'Người giao hàng', 'Thủ kho', 'Kế toán trưởng'];

export class WarehouseDocumentRepository {
    async getAllWarehouseDocuments(): Promise<WarehouseDocument[]> {
        const query = `
            SELECT
                id,
                department_name AS "departmentName",
                unit_name AS "unitName",
                number_of_documents AS "numberOfDocuments",
                delivery_name AS "deliveryName",
                received_warehouse_name AS "receivedWarehouseName",
                received_location_name AS "receivedLocationName",
                total_amount::float8 AS "totalAmount",
                number_of_files AS "numberOfFiles",
                created_at::text AS "createdAt",
                updated_at::text AS "updatedAt"
            FROM warehouse_document
            WHERE deleted_at IS NULL
            ORDER BY id DESC
        `;

        const { rows } = await pool.query<WarehouseDocument>(query);
        return rows;
    }
    async getWarehouseDocumentById(id: number): Promise<WarehouseDocumentDetail | null> {
        const docResult = await pool.query<WarehouseDocument>(`
            SELECT
                id,
                department_name        AS "departmentName",
                unit_name              AS "unitName",
                number_of_documents    AS "numberOfDocuments",
                delivery_name          AS "deliveryName",
                received_warehouse_name  AS "receivedWarehouseName",
                received_location_name   AS "receivedLocationName",
                total_amount::float8   AS "totalAmount",
                number_of_files        AS "numberOfFiles",
                created_at::text       AS "createdAt",
                updated_at::text       AS "updatedAt"
            FROM warehouse_document
            WHERE id = $1 AND deleted_at IS NULL
        `, [id]);

        const doc = docResult.rows[0];
        if (!doc) return null;

        const [assetsResult, logsResult, approvesResult] = await Promise.all([
            pool.query<WarehouseAsset>(`
                SELECT
                    id, warehouse_document_id AS "warehouseDocumentId",
                    asset_name AS "assetName", asset_code AS "assetCode",
                    asset_unit_name AS "assetUnitName",
                    evident_quantity AS "evidentQuantity",
                    realized_quantity AS "relizedQuantity",
                    unit_price::float8 AS "unitPrice",
                    total_amount::float8 AS "totalAmount",
                    created_at::text AS "createdAt", updated_at::text AS "updatedAt"
                FROM warehouse_assets
                WHERE warehouse_document_id = $1 AND deleted_at IS NULL
            `, [id]),
            pool.query<WarehouseDocumentLog>(`
                SELECT
                    id, warehouse_document_id AS "warehouseDocumentId",
                    actions AS "action",
                    created_at::text AS "createdAt", updated_at::text AS "updatedAt"
                FROM warehouse_document_logs
                WHERE warehouse_document_id = $1 AND deleted_at IS NULL
            `, [id]),
            pool.query<WarehouseDocumentApprove>(`
                SELECT
                    id, warehouse_document_id AS "warehouseDocumentId",
                    approve_status AS "approveStatus", approve_by AS "approveBy",
                    approve_at::text AS "approveAt",
                    created_at::text AS "createdAt", updated_at::text AS "updatedAt"
                FROM warehouse_document_approve
                WHERE warehouse_document_id = $1 AND deleted_at IS NULL
            `, [id]),
        ]);

        return {
            ...doc,
            assets: assetsResult.rows,
            logs: logsResult.rows,
            approves: approvesResult.rows,
        };
    }
    async createWarehouseDocument(input: CreateWarehouseDocumentInput): Promise<WarehouseDocument> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const { rows } = await client.query<WarehouseDocument>(`
                INSERT INTO warehouse_document
                    (department_name, unit_name, number_of_documents, delivery_name,
                     received_warehouse_name, received_location_name, total_amount, number_of_files)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING
                    id,
                    department_name        AS "departmentName",
                    unit_name              AS "unitName",
                    number_of_documents    AS "numberOfDocuments",
                    delivery_name          AS "deliveryName",
                    received_warehouse_name  AS "receivedWarehouseName",
                    received_location_name   AS "receivedLocationName",
                    total_amount::float8   AS "totalAmount",
                    number_of_files        AS "numberOfFiles",
                    created_at::text       AS "createdAt",
                    updated_at::text       AS "updatedAt"
            `, [
                input.departmentName, input.unitName, input.numberOfDocuments,
                input.deliveryName, input.receivedWarehouseName, input.receivedLocationName,
                input.totalAmount, input.numberOfFiles,
            ]);

            const doc = rows[0];
            if (!doc) throw new Error('Failed to create warehouse document');
            const docId = doc.id;

            for (const asset of input.assets) {
                await client.query(`
                    INSERT INTO warehouse_assets
                        (warehouse_document_id, asset_name, asset_code, asset_unit_name,
                         evident_quantity, realized_quantity, unit_price, total_amount)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `, [
                    docId, asset.assetName, asset.assetCode, asset.assetUnitName,
                    asset.evidentQuantity, asset.realizedQuantity, asset.unitPrice, asset.totalAmount,
                ]);
            }

            for (const approver of APPROVERS) {
                await client.query(`
                    INSERT INTO warehouse_document_approve (warehouse_document_id, approve_status, approve_by)
                    VALUES ($1, $2, $3)
                `, [docId, 'Chưa duyệt', approver]);
            }

            await client.query(`
                INSERT INTO warehouse_document_logs (warehouse_document_id, actions)
                VALUES ($1, $2)
            `, [docId, 'Thêm mới']);

            await client.query('COMMIT');
            return doc;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
    async deleteWarehouseDocument(id: number): Promise<void> {
        /**
         * 1. Xóa warehouse document khỏi cơ sở dữ liệu dựa trên id
         * 2. Xóa Log, Approve và Asset kèm theo warehouse document khỏi cơ sở dữ liệu
         */
        return;
    }
}