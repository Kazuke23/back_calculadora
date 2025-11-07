import dotenv from "dotenv";
import app from "./app";
import { connectMongo } from "./config/db";

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const MONGO_URI = process.env.MONGODB_URI;

(async () => {
  try {
    await connectMongo(MONGO_URI);
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`[calculator-api-ts] http://localhost:${PORT}`);
    });
  } catch (err: any) {
    console.error("❌ Error al iniciar:", err?.message || err);
    process.exit(1);
  }
})();
