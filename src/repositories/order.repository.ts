import { prisma } from "../config/database.js";
import type { Prisma } from "../generated/prisma/client.js";
import type { UpdateOrderStatusDTO } from "../validators/order.validator.js";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: true;
  };
}>;

export async function findAll() {
  return prisma.order.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function findById(id: string) {
  return prisma.order.findUnique({
    where: { id },
  });
}
export async function findByIdWithItems(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function create(data: {
  userId: string;
  totalPrice: number;
  items: {
    productId: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
}) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId: data.userId,
        totalPrice: data.totalPrice,
        status: "PENDING",
      },
    });
    await tx.orderItem.createMany({
      data: data.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
    });

    for (const item of data.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }
    return tx.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  });
}

export async function updateStatus(id: string, data: UpdateOrderStatusDTO) {
  return prisma.order.update({
    where: { id },
    data: {
      status: data.status,
    },
  });
}

export async function cancelOrder(order: OrderWithItems, reason: string) {
  return prisma.$transaction(async (tx) => {
    await Promise.all(
      order.items.map((item) =>
        tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        }),
      ),
    );

    return tx.order.update({
      where: {
        id: order.id,
        status: "PENDING",
      },
      data: {
        status: "CANCELLED",
        cancelReason: reason,
        cancelledAt: new Date(),
      },
    });
  });
}
