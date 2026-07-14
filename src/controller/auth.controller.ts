import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import type {
  AuthSigninDTO,
  AuthSignupDTO,
} from "../validators/auth.validator.js";
import * as service from "../services/auth.service.js";

const REFRESH_TOKEN = "refresh_token";
const ACCESS_TOKEN = "access_token";

function addCookie({
  res,
  id,
  value,
  maxAge,
}: {
  res: Response;
  id: string;
  value: string;
  maxAge: number;
}) {
  res.cookie(id, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: maxAge,
  });
}

export const signin = asyncHandler<Request<{}, {}, AuthSigninDTO>>(
  async (req, res) => {
    const result = await service.signin(req.body);
    addCookie({
      res,
      id: ACCESS_TOKEN,
      value: result.access_token,
      maxAge: 15 * 60 * 1000, //15min
    });
    addCookie({
      res,
      id: REFRESH_TOKEN,
      value: result.refresh_token,
      maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
    });

    res.success(result.user);
  },
);
export const signup = asyncHandler<Request<{}, {}, AuthSignupDTO>>(
  async (req, res) => {
    const result = await service.signup(req.body);
    addCookie({
      res,
      id: ACCESS_TOKEN,
      value: result.access_token,
      maxAge: 15 * 60 * 1000, //15min
    });
    addCookie({
      res,
      id: REFRESH_TOKEN,
      value: result.refresh_token,
      maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
    });
    res.success(result.user);
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
  addCookie({
    res,
    id: ACCESS_TOKEN,
    value: result.access_token,
    maxAge: 15 * 60 * 1000, //15min
  });
  addCookie({
    res,
    id: REFRESH_TOKEN,
    value: result.refresh_token,
    maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
  });
  res.success(null);
});
