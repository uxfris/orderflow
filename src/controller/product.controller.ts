import type { NextFunction, Request, Response } from "express";
import * as service from "../services/product.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import type {
  CreateProductDTO,
  UpdateProductDTO,
} from "../validators/product.validator.js";

export const getProducts = asyncHandler(async (req, res) => {
  const products = await service.getProducts();
  res.success(products);
});

export const getProduct = asyncHandler<Request<{ id: string }>>(
  async (req, res) => {
    const product = await service.getProduct(req.params.id);
    return res.success(product);
  },
);

export const createProduct = asyncHandler<Request<{}, {}, CreateProductDTO>>(
  async (req, res) => {
    const product = await service.createProduct(req.body);
    return res.success(product, "Product created", 201);
  },
);

export const updateProduct = asyncHandler<
  Request<{ id: string }, {}, UpdateProductDTO>
>(async (req, res) => {
  const product = await service.updateProduct(req.params.id, req.body);
  res.success(product, "Product updated");
});

export const deleteProduct = asyncHandler<Request<{ id: string }>>(
  async (req, res) => {
    await service.deleteProduct(req.params.id);
    res.status(204).send();
  },
);
