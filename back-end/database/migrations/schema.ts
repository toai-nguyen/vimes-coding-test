import { numeric, pgTable, serial, timestamp, varchar, integer } from "drizzle-orm/pg-core";

export const warehouseDocument = pgTable("warehouse_document", {
  id: serial("id").primaryKey(),
  departmentName: varchar("department_name", { length: 255 }).notNull(),
  unitName: varchar("unit_name", { length: 255 }).notNull(),
  numberOfDocuments: varchar("number_of_documents", { length: 255 }).notNull(),
  deliveryName: varchar("delivery_name", { length: 255 }).notNull(),
  receivedWarehouseName: varchar("received_warehouse_name", { length: 255 }).notNull(),
  receivedLocationName: varchar("received_location_name", { length: 255 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  numberOfFiles: integer("number_of_files").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const warehouseAssets = pgTable("warehouse_assets", {
  id: serial("id").primaryKey(),
  warehouseDocumentId: integer("warehouse_document_id")
    .notNull()
    .references(() => warehouseDocument.id, { onDelete: "cascade" }),
  assetName: varchar("asset_name", { length: 255 }).notNull(),
  assetCode: varchar("asset_code", { length: 255 }).notNull(),
  assetUnitName: varchar("asset_unit_name", { length: 255 }).notNull(),
  evidentQuantity: integer("evident_quantity").notNull(),
  realizedQuantity: integer("realized_quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const warehouseDocumentLogs = pgTable("warehouse_document_logs", {
  id: serial("id").primaryKey(),
  warehouseDocumentId: integer("warehouse_document_id")
    .notNull()
    .references(() => warehouseDocument.id, { onDelete: "cascade" }),
  actions: varchar("actions", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const warehouseDocumentApprove = pgTable("warehouse_document_approve", {
  id: serial("id").primaryKey(),
  warehouseDocumentId: integer("warehouse_document_id")
    .notNull()
    .references(() => warehouseDocument.id, { onDelete: "cascade" }),
  approveStatus: varchar("approve_status", { length: 255 }).notNull(),
  approveBy: varchar("approve_by", { length: 255 }).notNull(),
  approveAt: timestamp("approve_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});