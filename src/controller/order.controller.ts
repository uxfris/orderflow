import { asyncHandler } from "../utils/async-handler.js";
import * as service from "../services/order.service.js";
import type {
  CancelReasonDTO,
  CreateOrderDTO,
  UpdateOrderStatusDTO,
} from "../validators/order.validator.js";
import type { Request } from "express";

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await service.getOrders();
  res.success(orders);
});
export const getOrder = asyncHandler<Request<{ id: string }>>(
  async (req, res) => {
    const order = await service.getOrder(req.params.id);
    res.success(order);
  },
);
export const createOrder = asyncHandler<Request<{}, {}, CreateOrderDTO>>(
  async (req, res) => {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error("User not found", 404);
    }
    const order = await service.createOrder(userId, req.body);
    res.success(order, "Order created", 201);
  },
);
export const updateOrderStatus = asyncHandler<
  Request<{ id: string }, {}, UpdateOrderStatusDTO>
>(async (req, res) => {
  const result = await service.updateOrderStatus(req.params.id, req.body);
  res.success(result);
});

export const cancelOrder = asyncHandler<
  Request<{ id: string }, {}, CancelReasonDTO>
>(async (req, res) => {
  const result = await service.cancelOrder(req.params.id, req.body.reason);
  res.success(result);
});
