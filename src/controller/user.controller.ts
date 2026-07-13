import { asyncHandler } from "../utils/async-handler.js";
import * as service from "../services/user.service.js";
import type { Request } from "express";
import type {
  CreateUserDTO,
  UpdateUserDTO,
} from "../validators/user.validator.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await service.getUsers();
  res.success(users);
});
export const getUser = asyncHandler<Request<{ id: string }>>(
  async (req, res) => {
    const user = await service.getUser(req.params.id);
    res.success(user);
  },
);
export const createUser = asyncHandler<Request<{}, {}, CreateUserDTO>>(
  async (req, res) => {
    const user = await service.createUser(req.body);
    res.success(user, "User created", 201);
  },
);
export const updateUser = asyncHandler<
  Request<{ id: string }, {}, UpdateUserDTO>
>(async (req, res) => {
  const user = await service.updateUser(req.params.id, req.body);
  res.success(user, "User updated");
});
export const deleteUser = asyncHandler<Request<{ id: string }>>(
  async (req, res) => {
    await service.deleteUser(req.params.id);
    res.status(204).send();
  },
);
