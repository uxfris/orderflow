import * as controller from "../controller/order.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", controller.getOrders);
router.get("/:id", controller.getOrder);
router.post("/", controller.updateOrder);
router.patch("/:id", controller.updateOrder);
router.delete("/:id", controller.deleteOrder);

export default router;
