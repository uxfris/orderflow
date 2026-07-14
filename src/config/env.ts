import dotenv from "dotenv";

dotenv.config();

export default {
  accessSecret: process.env.ACCESS_SECRET!,
  refreshSecret: process.env.REFRESH_SECRET!,
  redisUrl: process.env.REDIS_URL || "redis://127.0.0.1:6379",
};
