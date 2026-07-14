import * as controller from "../controller/order.controller.js";
import { Router } from "express";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import validate from "../middleware/validate.js";
import {
  cancelReasonSchema,
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validators/order.validator.js";

const router = Router();

router.use(auth);
router.post("/", validate(createOrderSchema), controller.createOrder);
router.get("/:id", controller.getOrder);

// router.use(authorize("ADMIN"));
router.get("/", controller.getOrders);
router.patch(
  "/:id/status",
  validate(updateOrderStatusSchema),
  controller.updateOrderStatus,
);
router.patch(
  "/:id/cancel",
  validate(cancelReasonSchema),
  controller.cancelOrder,
);

export default router;
