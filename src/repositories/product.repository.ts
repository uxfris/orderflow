import { prisma } from "../config/database.js";
import type {
  CreateProductDTO,
  UpdateProductDTO,
} from "../validators/product.validator.js";

export async function findAll() {
  return prisma.product.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
}
export async function findById(id: string) {
  return prisma.product.findUnique({
    where: { id },
  });
}
export async function create(data: CreateProductDTO) {
  return prisma.product.create({ data });
}
export async function update(id: string, data: UpdateProductDTO) {
  return prisma.product.update({
    where: { id },
    data,
  });
}
export async function remove(id: string) {
  return prisma.product.delete({
    where: { id },
  });
}
