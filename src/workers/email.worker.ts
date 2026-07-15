import { Worker } from "bullmq";
import { connection } from "../config/redis.js";

new Worker(
  "email",
  async (job) => {
    switch (job.name) {
      case "send-confirmation":
        console.log(job.data);
        //kirim email
        break;
    }
  },
  {
    connection,
    concurrency: 20,
  },
);
