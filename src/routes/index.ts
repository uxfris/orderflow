import { Router } from "express";
import productRoutes from "./product.route.js";
import orderRoutes from "./order.route.js";
import userRoutes from "./user.route.js";
import authRoutes from "./auth.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/users", userRoutes);

export default router;
