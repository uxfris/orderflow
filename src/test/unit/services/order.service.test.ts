import * as repository from "../../../repositories/order.repository.js";
import * as productRepository from "../../../repositories/product.repository.js";
import * as service from "../../../services/order.service.js";
import { describe, expect, it, vi } from "vitest";
import type { Prisma, OrderStatus } from "../../../generated/prisma/client.js";
import type { UpdateOrderStatusDTO } from "../../../validators/order.validator.js";
import { beforeEach } from "node:test";

vi.mock("../../../repositories/order.repository.js");
vi.mock("../../../repositories/product.repository.js");

const order: Prisma.OrderGetPayload<{}> = {
  id: "1",
  userId: "1",
  totalPrice: 99,
  status: "PENDING",
  cancelReason: null,
  cancelledAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const orderWithItems: Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}> = {
  cancelReason: null,
  cancelledAt: null,
  createdAt: new Date("2026-07-16T07:33:24.896Z"),
  id: "cmrn6zu8r00039g8oebtgo5vq",

  status: "PENDING",
  totalPrice: 30,
  updatedAt: new Date("2026-07-16T07:33:24.896Z"),
  userId: "cmrn6ztie00009g8obk0447te",
  items: [
    {
      id: "cmrn6zub300049g8or8svb0al",
      orderId: "cmrn6zu8r00039g8oebtgo5vq",
      price: 30,
      product: {
        createdAt: new Date("2026-07-16T07:33:24.896Z"),
        updatedAt: new Date("2026-07-16T07:33:25.245Z"),
        deletedAt: null,
        id: "cmrn6zu3k00029g8ob7q6vm3n",
        name: "Keyboard",
        price: 30,
        stock: 9,
        version: 1,
      },
      productId: "cmrn6zu3k00029g8ob7q6vm3n",
      quantity: 1,
      subtotal: 30,
    },
  ],
};

const products: Prisma.ProductGetPayload<{}>[] = [
  {
    id: "cmrn6zu3k00029g8ob7q6vm3n",
    createdAt: new Date("2026-07-16T07:33:24.896Z"),
    updatedAt: new Date("2026-07-16T07:33:25.245Z"),
    name: "Keyboard",
    price: 30,
    stock: 9,
    version: 1,
    deletedAt: null,
  },
];

const createOrderDTO = {
  items: [
    {
      productId: products[0].id,
      quantity: 1,
    },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getOrder()", () => {
  it("should return order", async () => {
    vi.mocked(repository.findByIdWithItems).mockResolvedValue(orderWithItems);
    const result = await service.getOrder(order.id);
    expect(result).toEqual(orderWithItems);
    expect(repository.findByIdWithItems).toHaveBeenCalledOnce();
  });

  it("should throw if order not found", async () => {
    vi.mocked(repository.findByIdWithItems).mockResolvedValue(null);
    await expect(service.getOrder("not-found")).rejects.toThrow(
      "Order not found",
    );
  });
});

describe("createOrder()", () => {
  it("should create order sucessfully", async () => {
    vi.mocked(productRepository.findManyByIds).mockResolvedValue(products);
    vi.mocked(repository.create).mockResolvedValue(orderWithItems);
    const result = await service.createOrder("1", createOrderDTO);
    expect(result).toEqual(orderWithItems);
    expect(repository.create).toHaveBeenCalledWith({
      userId: "1",
      totalPrice: 30,
      items: expect.any(Array),
    });
  });
  it("should throw if product not found", async () => {
    vi.mocked(productRepository.findManyByIds).mockResolvedValue([]);
    await expect(service.createOrder("1", createOrderDTO)).rejects.toThrow(
      "Product not found",
    );
  });
  it("should throw if product insufficient", async () => {
    vi.mocked(productRepository.findManyByIds).mockResolvedValue(products);
    const createOrderDTO = {
      items: [
        {
          productId: products[0].id,
          quantity: 9999,
        },
      ],
    };
    await expect(service.createOrder("1", createOrderDTO)).rejects.toThrow(
      `${products[0].name} stock is not enough`,
    );
  });
  it("Should calculate total correctly", async () => {
    vi.mocked(productRepository.findManyByIds).mockResolvedValue(products);
    vi.mocked(repository.create).mockResolvedValue(orderWithItems);
    const result = await service.createOrder("1", createOrderDTO);
    expect(repository.create).toHaveBeenCalledWith({
      userId: "1",
      totalPrice: 30,
      items: [
        {
          productId: products[0].id,
          quantity: 1,
          price: 30,
          subtotal: 30,
        },
      ],
    });
  });
  it("Should throw repository failed", async () => {
    vi.mocked(productRepository.findManyByIds).mockResolvedValue(products);
    vi.mocked(repository.create).mockResolvedValue(null);
    await expect(service.createOrder("1", createOrderDTO)).rejects.toThrow(
      "Failed to create order",
    );
  });
});

describe("updateStatus()", () => {
  it("should update status successfully", async () => {
    const orderStatus: UpdateOrderStatusDTO = { status: "PROCESSING" };
    const updatedOrder: Prisma.OrderGetPayload<{}> = {
      id: "1",
      userId: "1",
      totalPrice: 99,
      status: "PENDING",
      cancelReason: null,
      cancelledAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    vi.mocked(repository.findById).mockResolvedValue(order);
    vi.mocked(repository.updateStatus).mockResolvedValue(updatedOrder);

    const result = await service.updateOrderStatus(order.id, orderStatus);
    expect(result).toEqual(updatedOrder);
    expect(repository.updateStatus).toHaveBeenCalledOnce();
  });
  it("should throw if order not found", async () => {
    const orderStatus: UpdateOrderStatusDTO = { status: "PROCESSING" };

    vi.mocked(repository.findById).mockResolvedValue(null);
    await expect(
      service.updateOrderStatus(order.id, orderStatus),
    ).rejects.toThrow("Order not found");
  });
  it("should reject cancelled order", async () => {
    const orderStatus: UpdateOrderStatusDTO = { status: "PROCESSING" };
    const order: Prisma.OrderGetPayload<{}> = {
      id: "1",
      userId: "1",
      totalPrice: 99,
      status: "CANCELLED",
      cancelReason: null,
      cancelledAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(repository.findById).mockResolvedValue(order);

    await expect(
      service.updateOrderStatus(order.id, orderStatus),
    ).rejects.toThrow("Cancelled order cannot be updated");
  });
  it("should reject delivered order", async () => {
    const orderStatus: UpdateOrderStatusDTO = { status: "PROCESSING" };
    const newOrder: Prisma.OrderGetPayload<{}> = {
      ...order,
      status: "DELIVERED",
    };

    vi.mocked(repository.findById).mockResolvedValue(newOrder);

    await expect(
      service.updateOrderStatus(order.id, orderStatus),
    ).rejects.toThrow("Delivered order cannot be updated");
  });
  it("should reject invalid transition", async () => {
    const orderStatus: UpdateOrderStatusDTO = { status: "DELIVERED" };
    vi.mocked(repository.findById).mockResolvedValue(order);
    await expect(
      service.updateOrderStatus(order.id, orderStatus),
    ).rejects.toThrow("Invalid status transition");
  });
});

describe("cancelOrder()", () => {
  it("should cancel order successfully", async () => {
    const cancelledOrder: Prisma.OrderGetPayload<{}> = {
      id: "1",
      userId: "cmrn6ztie00009g8obk0447te",
      totalPrice: 99,
      status: "CANCELLED",
      cancelReason: "Want to change quantity",
      cancelledAt: new Date("2026-07-16T07:33:24.896Z"),
      createdAt: new Date("2026-07-16T07:33:24.896Z"),
      updatedAt: new Date("2026-07-16T07:33:24.896Z"),
    };
    vi.mocked(repository.findByIdWithItems).mockResolvedValue(orderWithItems);
    vi.mocked(repository.cancelOrder).mockResolvedValue(cancelledOrder);
    const result = await service.cancelOrder(
      orderWithItems.id,
      "Want to change quantity",
    );
    expect(result).toEqual(cancelledOrder);
    expect(repository.cancelOrder).toHaveBeenCalledOnce();
  });

  const invalidStatuses: OrderStatus[] = ["PROCESSING", "SHIPPED", "DELIVERED"];
  it.each(invalidStatuses)("should reject %s order", async (status) => {
    vi.mocked(repository.findByIdWithItems).mockResolvedValue({
      ...orderWithItems,
      status,
    });

    await expect(service.cancelOrder(order.id, "reason")).rejects.toThrow(
      "Order cannot be cancelled",
    );
  });

  it("should throw if order not found", async () => {
    vi.mocked(repository.findByIdWithItems).mockResolvedValue(null);
    await expect(
      service.cancelOrder(order.id, "Want to change quantity"),
    ).rejects.toThrow("Order not found");
  });
});
