// import redis from "../config/redis.js";
import * as repository from "../repositories/product.repository.js";
import AppError from "../utils/app-error.js";
import type {
  CreateProductDTO,
  GetProductsQueryDTO,
  UpdateProductDTO,
} from "../validators/product.validator.js";

// async function invalidateProductsCache() {
//   const iterator = redis.scanIterator({
//     MATCH: "products:*",
//   });

//   for await (const key of iterator) {
//     await redis.del(key);
//   }
// }
export async function getProducts(query: GetProductsQueryDTO) {
  const { page, limit, search, sortBy, order } = query;
  // const cacheKey = `products:${page}:${limit}:${search}:${sortBy}:${order}`;
  // const cache = await redis.get(cacheKey);
  // if (cache) {
  //   return JSON.parse(cache);
  // }
  const offset = (page - 1) * limit;
  const products = await repository.findAll(query, offset);
  // await redis.set(cacheKey, JSON.stringify(products), { EX: 300 });
  return products;
}
export async function getProduct(id: string) {
  // const cacheKey = `product:${id}`;
  // const cache = await redis.get(cacheKey);
  // if (cache) {
  //   return JSON.parse(cache);
  // }

  const product = await repository.findById(id);
  if (!product) {
    throw AppError.notFound("Product not found");
  }

  // redis.set(cacheKey, JSON.stringify(product), { EX: 300 });

  return product;
}
export async function createProduct(data: CreateProductDTO) {
  const product = await repository.create(data);
  // await invalidateProductsCache();
  return product;
}
export async function updateProduct(id: string, data: UpdateProductDTO) {
  const product = await repository.findById(id);
  if (!product) {
    throw AppError.notFound("Product not found");
  }
  const result = await repository.update(id, data);
  // await invalidateProductsCache();
  return result;
}
export async function deleteProduct(id: string) {
  const product = await repository.findById(id);
  if (!product) {
    throw AppError.notFound("Product not found");
  }
  await repository.remove(id);
  // await invalidateProductsCache();
}
