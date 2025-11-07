import mongoose from "mongoose";

export async function connectMongo(uri?: string) {
  if (!uri) throw new Error("MONGODB_URI no está definido");

  console.log("[mongo] Intentando conectar a:", uri);
  mongoose.set("strictQuery", true);
  mongoose.set('debug', true);

  await mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000,  // evita que se quede pegado
});

  

  const { connection } = mongoose;

  connection.on("connected", () => {
    console.log(`[mongo] Conectado a ${connection.host}/${connection.name}`);
  });

  connection.on("error", (err) => {
    console.error("[mongo] Error de conexión:", (err as any)?.message || err);
  });

  connection.on("disconnected", () => {
    console.warn("[mongo] Desconectado");
  });
}

/** Estado legible de la conexión de Mongoose */
export function mongoStatus(): "disconnected" | "connecting" | "connected" | "disconnecting" | "uninitialized" {
  switch (mongoose.connection.readyState) {
    case 0: return "disconnected";
    case 1: return "connected";
    case 2: return "connecting";
    case 3: return "disconnecting";
    default: return "uninitialized";
  }
}
