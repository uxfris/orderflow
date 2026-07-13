import dotenv from "dotenv";

dotenv.config();

export default {
  accessSecret: process.env.ACCESS_SECRET!,
  refreshSecret: process.env.REFRESH_SECRET!,
};
