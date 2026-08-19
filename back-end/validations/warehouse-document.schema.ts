import { z } from 'zod';

const AssetInputSchema = z.object({
    assetName: z.string().min(1),
    assetCode: z.string().min(1),
    assetUnitName: z.string().min(1),
    evidentQuantity: z.number().nonnegative(),
    realizedQuantity: z.number().nonnegative(),
    unitPrice: z.number().nonnegative(),
    totalAmount: z.number().nonnegative(),
});

export const CreateWarehouseDocumentSchema = z.object({
    departmentName: z.string().min(1),
    unitName: z.string().min(1),
    numberOfDocuments: z.string().min(1),
    deliveryName: z.string().min(1),
    receivedWarehouseName: z.string().min(1),
    receivedLocationName: z.string().min(1),
    totalAmount: z.number().nonnegative(),
    numberOfFiles: z.number().int().nonnegative(),
    assets: z.array(AssetInputSchema).min(1),
});
