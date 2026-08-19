import express from "express";
import warehouseDocumentRoutes from "./routes/warehouse-document.route";
import cors from "cors";


const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

app.use("/api/warehouse-documents", warehouseDocumentRoutes);

export default app;