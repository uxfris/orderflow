import rateLimit from "express-rate-limit";
// import client from "../config/redis.js";
// import { RedisStore } from "rate-limit-redis";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 mins
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
  // store: new RedisStore({
  //   sendCommand: (...args) => client.sendCommand(args),
  // }),
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 mins
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
    // store: new RedisStore({
    //   sendCommand: (...args) => client.sendCommand(args),
    // }),
  },
});
