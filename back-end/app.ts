import express from "express";
import warehouseDocumentRoutes from "./routes/warehouse-document.route";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

app.use("/api/warehouse-documents", warehouseDocumentRoutes);

export default app;