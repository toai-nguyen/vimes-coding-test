import app from "./app";
import { pool } from "./config/database";
import { env } from "./config/env";

async function startServer() {
  try {
    await pool.query("SELECT 1");

    console.log("Database connected");

    app.listen(env.port, () => {
      console.log(`Server running at http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

startServer();