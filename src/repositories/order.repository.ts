import { prisma } from "../config/database.js";

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
