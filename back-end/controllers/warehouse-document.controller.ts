import { Request, Response, NextFunction } from "express";
import { WarehouseDocumentService } from "../services/warehouse-document.service";

export class WarehouseDocumentController {
    constructor(private readonly warehouseDocumentService: WarehouseDocumentService) {}
    getAllWarehouseDocuments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const warehouseDocuments = await this.warehouseDocumentService.getAllWarehouseDocuments();
            res.status(200).json(warehouseDocuments);
        } catch (error) {
            next(error);
        }
    };
    getWarehouseDocumentById = async (req: Request, res: Response, next: NextFunction) => {}
    createWarehouseDocument = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const doc = await this.warehouseDocumentService.createWarehouseDocument(req.body);
            res.status(201).json(doc);
        } catch (error) {
            next(error);
        }
    };
    deleteWarehouseDocument = async (req: Request, res: Response, next: NextFunction) => {}
}