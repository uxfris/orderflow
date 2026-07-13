import { Router } from "express";
import * as controller from "../controller/product.controller.js";
import validate from "../middleware/validate.js";
import { createProductSchema } from "../validators/product.validator.js";

const router = Router();

router.get("/", controller.getProducts);
router.get("/:id", controller.getProduct);
router.post("/", validate(createProductSchema), controller.createProduct);
router.patch("/:id", controller.updateProduct);
router.delete("/:id", controller.deleteProduct);

export default router;
