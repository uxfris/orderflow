import { Queue } from "bullmq";
import { connection } from "../config/redis.js";

const invoiceQueue = new Queue("invoice", { connection });
