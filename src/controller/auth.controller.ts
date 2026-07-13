import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import type {
  AuthSigninDTO,
  AuthSignupDTO,
} from "../validators/auth.validator.js";
import * as service from "../services/auth.service.js";

const REFRESH_TOKEN = "refresh_token";

function addCookie(res: Response, id: string, value: string) {
  res.cookie(id, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
  });
}

export const signin = asyncHandler<Request<{}, {}, AuthSigninDTO>>(
  async (req, res) => {
    const result = await service.signin(req.body);
    addCookie(res, REFRESH_TOKEN, result.refresh_token);
    res.success(result);
  },
);
export const signup = asyncHandler<Request<{}, {}, AuthSignupDTO>>(
  async (req, res) => {
    const result = await service.signup(req.body);
    addCookie(res, REFRESH_TOKEN, result.refresh_token);
    res.success(result);
  },
);

export const signout = asyncHandler<Request<{}, {}, { refresh_token: string }>>(
  async (req, res) => {
    const result = await service.signout(req.body.refresh_token);
    res.clearCookie("refresh_token");
    res.success(result, "Signed out");
  },
);

export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  const result = await service.refreshToken(refreshToken);
  addCookie(res, REFRESH_TOKEN, result.refresh_token);
  res.success(result.access_token);
});
