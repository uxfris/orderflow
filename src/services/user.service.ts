import type {
  CreateUserDTO,
  UpdateUserDTO,
} from "../validators/user.validator.js";
import * as repository from "../repositories/user.repository.js";
import AppError from "../utils/app-error.js";

export async function getUsers() {
  return repository.findAll();
}
export async function getUser(id: string) {
  const user = await repository.findById(id);
  if (!user) {
    throw AppError.notFound("User not found");
  }
  return user;
}
export async function createUser(data: CreateUserDTO) {
  return repository.create(data);
}
export async function updateUser(id: string, data: UpdateUserDTO) {
  const product = await repository.findById(id);
  if (!product) {
    throw AppError.notFound("User not found");
  }
  return repository.update(id, data);
}
export async function deleteUser(id: string) {
  const product = await repository.findById(id);
  if (!product) {
    throw AppError.notFound("User not found");
  }
  return repository.remove(id);
}
