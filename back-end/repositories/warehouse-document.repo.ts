import { pool } from '../config/database';
import type { WarehouseDocument } from '@shared/types/warehouse-document';

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
    async getWarehouseDocumentById(id: number): Promise<WarehouseDocument | null> {
        /**
         * 1. Lấy thông tin warehouse document từ cơ sở dữ liệu dựa trên id
         * 2. Lấy thông tin Log, Approve và Asset kèm theo warehouse document từ cơ sở dữ liệu dựa trên warehouse document id
         * 3. Trả về toàn bộ dữ liệu.
         */
        return null;
    }
    async createWarehouseDocument(warehouseDocument: WarehouseDocument): Promise<WarehouseDocument> {
        /**
         * 1. Thêm warehouse document vào cơ sở dữ liệu
         * 2. Thêm Log, Approve và Asset kèm theo warehouse document vào cơ sở dữ liệu
         * 3. Trả về warehouse document vừa được tạo.
         */
        return warehouseDocument;
    }
    async deleteWarehouseDocument(id: number): Promise<void> {
        /**
         * 1. Xóa warehouse document khỏi cơ sở dữ liệu dựa trên id
         * 2. Xóa Log, Approve và Asset kèm theo warehouse document khỏi cơ sở dữ liệu
         */
        return;
    }
}