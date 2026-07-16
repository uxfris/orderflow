import type {
  CreateOrderDTO,
  UpdateOrderStatusDTO,
} from "../validators/order.validator.js";
import * as productRepository from "../repositories/product.repository.js";
import * as orderRepository from "../repositories/order.repository.js";
// import { findById as findUserById } from "../repositories/user.repository.js";
import AppError from "../utils/app-error.js";

export async function getOrders() {
  return await orderRepository.findAll();
}
export async function getOrder(id: string) {
  const order = await orderRepository.findByIdWithItems(id);
  if (!order) {
    throw AppError.notFound("Order not found");
  }
  return order;
}
export async function createOrder(userId: string, data: CreateOrderDTO) {
  const productIds = data.items.map((i) => i.productId);

  const products = await productRepository.findManyByIds(productIds);

  if (products.length !== data.items.length) {
    throw AppError.notFound("Product not found");
  }

  let totalPrice = 0;

  const orderItems = data.items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    if (product.stock < item.quantity) {
      throw AppError.badRequest(`${product.name} stock is not enough`);
    }

    const subtotal = product.price * item.quantity;
    totalPrice += subtotal;
    return {
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
      subtotal: subtotal,
    };
  });

  const order = await orderRepository.create({
    userId,
    totalPrice,
    items: orderItems,
  });

  if (!order) {
    throw AppError.conflict("Failed to create order");
  }

  // const user = await findUserById(userId);
  // await emailQueue.add(
  //   "send-confirmation",
  //   {
  //     email: user?.email,
  //     orderId: order.id,
  //   },
  //   {
  //     attempts: 5,
  //     backoff: {
  //       type: "exponential",
  //       delay: 1000,
  //     },
  //   },
  // );

  return order;
}
export async function updateOrderStatus(
  id: string,
  data: UpdateOrderStatusDTO,
) {
  const order = await orderRepository.findById(id);
  if (!order) {
    throw AppError.notFound("Order not found");
  }
  if (order.status === "CANCELLED") {
    throw AppError.badRequest("Cancelled order cannot be updated");
  }
  if (order.status === "DELIVERED") {
    throw AppError.badRequest("Delivered order cannot be updated");
  }
  const allowedTransitions = {
    PENDING: ["PROCESSING"],
    PROCESSING: ["SHIPPED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };
  if (!allowedTransitions[order.status].includes(data.status)) {
    throw AppError.badRequest("Invalid status transition");
  }
  return await orderRepository.updateStatus(id, data);
}

export async function cancelOrder(id: string, reason: string) {
  const order = await orderRepository.findByIdWithItems(id);
  if (!order) {
    throw AppError.notFound("Order not found");
  }
  if (order.status !== "PENDING") {
    throw AppError.badRequest("Order cannot be cancelled");
  }
  return await orderRepository.cancelOrder(order, reason);
}
