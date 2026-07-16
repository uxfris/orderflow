import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import request from "supertest";
import app from "../../app.js";
import { prisma } from "../../config/database.js";
import type { Prisma } from "../../generated/prisma/client.js";
import bcrypt from "bcrypt";

const agent = request.agent(app);

let product: Prisma.ProductGetPayload<{}>;
let userId: string;

beforeAll(async () => {
  const email = `admin-${Date.now()}@test.com`;
  const user = await prisma.user.create({
    data: {
      name: "Admin",
      email: email,
      password: await bcrypt.hash("admin12345", 10),
    },
  });
  userId = user.id;
  const login = await agent.post("/api/auth/signin").send({
    email: email,
    password: "admin12345",
  });
  expect(login.status).toBe(200);
});

beforeEach(async () => {
  product = await prisma.product.create({
    data: {
      name: "Keyboard",
      price: 30,
      stock: 10,
    },
  });
});

afterEach(async () => {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
});

afterAll(async () => {
  await prisma.user.delete({ where: { id: userId } });
  await prisma.$disconnect();
});

describe("POST /orders", () => {
  test("create order", async () => {
    const response = await agent.post("/api/orders").send({
      items: [{ productId: product.id, quantity: 1 }],
    });
    const order = await prisma.order.findFirst({
      include: {
        items: true,
      },
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      message: "Order created",
    });
    expect(order).not.toBeNull();
    expect(order!.items).toHaveLength(1);
    expect(order!.items[0].productId).toBe(product.id);
    expect(order!.items[0].quantity).toBe(1);
  });

  test("reject invalid body", async () => {
    const response = await agent.post("/api/orders").send({
      items: [],
    });
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      message: "Validation failed",
    });
  });

  test("unauthorized", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({
        items: [{ productId: product.id, quantity: 1 }],
      });
    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      success: false,
      message: "Unauthorized",
    });
  });

  test("Product not found", async () => {
    const response = await agent.post("/api/orders").send({
      items: [{ productId: "product-not-found", quantity: 1 }],
    });
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      success: false,
      message: "Product not found",
    });
  });
  test("Insufficient stock", async () => {
    const response = await agent.post("/api/orders").send({
      items: [
        {
          productId: product.id,
          quantity: 11,
        },
      ],
    });
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      message: `${product.name} stock is not enough`,
    });
  });
});
