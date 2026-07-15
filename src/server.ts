import app from "./app.js";
import { prisma } from "./config/database.js";
import { logger } from "./logger/logger.js";
// import redis from "./config/redis.js";

const server = app.listen(3001, () => {
  logger.info(`Server running on port 3001`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received. Shutting down...`);

  server.close(async () => {
    try {
      await prisma.$disconnect();
      // await redis.quit();
      process.exit(0);
    } catch (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
