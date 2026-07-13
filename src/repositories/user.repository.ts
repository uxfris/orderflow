import { prisma } from "../config/database.js";
import type {
  CreateUserDTO,
  UpdateUserDTO,
} from "../validators/user.validator.js";

export async function findAll() {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "asc",
    },
    omit: { password: true },
  });
}
export async function findById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    omit: { password: true },
  });
}
export async function findByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}
export async function create(data: CreateUserDTO) {
  return prisma.user.create({
    data,
    omit: { password: true },
  });
}
export async function update(id: string, data: UpdateUserDTO) {
  return prisma.user.update({
    where: { id },
    data,
    omit: { password: true },
  });
}
export async function remove(id: string) {
  return prisma.user.delete({
    where: { id },
  });
}
