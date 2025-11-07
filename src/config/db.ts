import mongoose from "mongoose";

export async function connectMongo(uri?: string) {
  if (!uri) throw new Error("MONGODB_URI no está definido");

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);

  const { connection } = mongoose;

  connection.on("connected", () => {
    console.log(`[mongo] Conectado a ${connection.host}/${connection.name}`);
  });

  connection.on("error", (err) => {
    console.error("[mongo] Error conexión:", (err as any)?.message || err);
  });
}
