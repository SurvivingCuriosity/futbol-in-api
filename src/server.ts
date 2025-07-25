import { connectDB, disconnectDB } from "@/config/db";
import { DEVELOPMENT, SERVER } from "@/config";
import { app } from "@/index";

(async () => {
  await connectDB(); // 1️⃣  abre el pool

  const server = app.listen(SERVER.PORT, () => {
    console.log(process.env.NODE_ENV)
    console.log("Dev mode: ", DEVELOPMENT);
    console.log(`🚀 API en http://${SERVER.HOSTNAME}:${SERVER.PORT}`);
  });

  // 2️⃣  apaga limpio al recibir Ctrl‑C / Docker stop
  const shutdown = async () => {
    console.log("\n⏳ Cerrando conexiones…");
    await disconnectDB();
    server.close(() => {
      console.log("✅ Bye!");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
})();
