import { Router } from "express";
import { WarehouseDocumentController } from "../controllers/warehouse-document.controller";
import { WarehouseDocumentService } from "../services/warehouse-document.service";
import { WarehouseDocumentRepository } from "../repositories/warehouse-document.repo";
import { validate } from "../middleware/validate";
import { CreateWarehouseDocumentSchema } from "../validations/warehouse-document.schema";

const warehouseDocumentRepository = new WarehouseDocumentRepository();
const warehouseDocumentService = new WarehouseDocumentService(warehouseDocumentRepository);
const warehouseDocumentController = new WarehouseDocumentController(warehouseDocumentService);

const router = Router();

router.get("/", warehouseDocumentController.getAllWarehouseDocuments);
router.get("/:id", warehouseDocumentController.getWarehouseDocumentById);
router.post("/", validate(CreateWarehouseDocumentSchema), warehouseDocumentController.createWarehouseDocument);
router.delete("/:id", warehouseDocumentController.deleteWarehouseDocument);

export default router;