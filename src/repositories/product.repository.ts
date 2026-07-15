import { prisma } from "../config/database.js";
import type {
  CreateProductDTO,
  GetProductsQueryDTO,
  UpdateProductDTO,
} from "../validators/product.validator.js";

export async function findAll(query: GetProductsQueryDTO, offset: number) {
  const { limit, search, sortBy, order } = query;
  return prisma.product.findMany({
    skip: offset,
    take: limit,
    where: {
      deletedAt: null,
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    orderBy: {
      [sortBy]: order,
    },
  });
}

export async function findManyByIds(ids: string[]) {
  return prisma.product.findMany({
    where: {
      deletedAt: null,
      id: {
        in: ids,
      },
    },
  });
}

export async function findById(id: string) {
  return prisma.product.findUnique({
    where: { id, deletedAt: null },
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
  return prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
