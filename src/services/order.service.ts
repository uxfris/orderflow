import type { CreateOrderDTO } from "../validators/order.validator.js";
import * as productRepository from "../repositories/product.repository.js";
import * as orderRepository from "../repositories/order.repository.js";
import AppError from "../utils/app-error.js";

export async function getOrders() {}
export async function getOrder() {}
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

  return await orderRepository.create({
    userId,
    totalPrice,
    items: orderItems,
  });
}
export async function updateOrder() {}
export async function deleteOrder() {}
