import * as controller from "../controller/order.controller.js";
import { Router } from "express";
import auth from "../middleware/auth.js";

const router = Router();

router.use(auth);
router.get("/", controller.getOrders);
router.get("/:id", controller.getOrder);
router.post("/", controller.createOrder);
router.patch("/:id", controller.updateOrder);
router.delete("/:id", controller.deleteOrder);

export default router;
