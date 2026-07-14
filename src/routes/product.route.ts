import { Router } from "express";
import * as controller from "../controller/product.controller.js";
import validate from "../middleware/validate.js";
import {
  createProductSchema,
  getProductsQuerySchema,
} from "../validators/product.validator.js";
import authorize from "../middleware/authorize.js";
import validateQuery from "../middleware/validate-query.js";

const router = Router();

router.get("/", validateQuery(getProductsQuerySchema), controller.getProducts);
router.get("/:id", controller.getProduct);
router.use(authorize("ADMIN"));
router.post("/", validate(createProductSchema), controller.createProduct);
router.patch("/:id", controller.updateProduct);
router.delete("/:id", controller.deleteProduct);

export default router;
