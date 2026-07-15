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

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: page
 *
 *         schema:
 *           type: integer
 *           default: 1
 *
 *       - in: query
 *         name: limit
 *
 *         schema:
 *           type: integer
 *           default: 10
 *
 *       - in: query
 *         name: search
 *
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: sortBy
 *
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: order
 *
 *         schema:
 *           type: string
 *           enum:
 *              - asc
 *              - desc
 *
 *     responses:
 *       200:
 *         description: Success
 *
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", validateQuery(getProductsQuerySchema), controller.getProducts);

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Get product
 *
 *     tags:
 *       - Product
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/:id", controller.getProduct);

router.use(authorize("ADMIN"));

/**
 * @openapi
 * /api/products:
 *   post:
 *     security:
 *     - cookieAuth: []
 *     summary: Create product
 *
 *     tags:
 *       - Product
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *
 *     responses:
 *       201:
 *         description: Product created
 *
 *         content:
 *           application/json:
 *
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.post("/", validate(createProductSchema), controller.createProduct);
router.patch("/:id", controller.updateProduct);
router.delete("/:id", controller.deleteProduct);

export default router;
