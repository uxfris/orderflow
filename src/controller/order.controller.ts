import { asyncHandler } from "../utils/async-handler.js";
import * as service from "../services/order.service.js";
import type { CreateOrderDTO } from "../validators/order.validator.js";
import type { Request } from "express";

export const getOrders = asyncHandler(async (req, res) => {});
export const getOrder = asyncHandler(async (req, res) => {});
export const createOrder = asyncHandler<Request<{}, {}, CreateOrderDTO>>(
  async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.error("User not found", 404);
    }
    const order = await service.createOrder(userId, req.body);
    res.success(order);
  },
);
export const updateOrder = asyncHandler(async (req, res) => {});
export const deleteOrder = asyncHandler(async (req, res) => {});
