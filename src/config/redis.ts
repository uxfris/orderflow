import { RedisClient, createClient } from "redis";
import env from "./env.js";
import AppError from "../utils/app-error.js";

const client = createClient({
  url: env.redisUrl,
  socket: {
    // Retry strategy for production connection drops
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        return new AppError(503, "Redis reconnection attemps exhausted");
      }
      // Exponential backoff
      return Math.min(retries * 100, 3000);
    },
  },
});
// Production monitoring events
client.on("connect", () =>
  console.log("Redis client initiating connection..."),
);
client.on("ready", () => console.log("Redis client ready and connected."));
client.on("error", (err) => console.error("Redis Client Error:", err));
client.on("end", () => console.warn("Redis client disconnected."));

await client.connect().catch((err) => {
  console.error("Failed to establish initial Redis connection:", err);
});

export default client;
