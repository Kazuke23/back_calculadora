import dotenv from "dotenv";
import app from "./app";
import { connectMongo } from "./config/db";

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const MONGO_URI = process.env.MONGODB_URI;

(async () => {
  try {
    console.log("[bootstrap] Levantando API…");
    await connectMongo();                // 👈 Asegura que se ejecuta
    app.listen(PORT, () => {
      console.log(`[api] http://localhost:${PORT}`);
    });
  } catch (err: any) {
    console.error("[bootstrap] No se pudo iniciar:", err?.message || err);
    process.exit(1);
  }
})();
