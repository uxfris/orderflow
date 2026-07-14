import * as repository from "../repositories/product.repository.js";
import AppError from "../utils/app-error.js";
import type {
  CreateProductDTO,
  GetProductsQueryDTO,
  UpdateProductDTO,
} from "../validators/product.validator.js";

export async function getProducts(query: GetProductsQueryDTO) {
  const { page, limit } = query;
  const offset = (page - 1) * limit;
  return repository.findAll(query, offset);
}
export async function getProduct(id: string) {
  const product = await repository.findById(id);
  if (!product) {
    throw AppError.notFound("Product not found");
  }
  return product;
}
export async function createProduct(data: CreateProductDTO) {
  return repository.create(data);
}
export async function updateProduct(id: string, data: UpdateProductDTO) {
  const product = await repository.findById(id);
  if (!product) {
    throw AppError.notFound("Product not found");
  }
  return repository.update(id, data);
}
export async function deleteProduct(id: string) {
  const product = await repository.findById(id);
  if (!product) {
    throw AppError.notFound("Product not found");
  }
  return repository.remove(id);
}
