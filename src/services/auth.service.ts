import type {
  AuthSigninDTO,
  AuthSignupDTO,
} from "../validators/auth.validator.js";
import * as userRepository from "../repositories/user.repository.js";
import * as authRepository from "../repositories/auth.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import AppError from "../utils/app-error.js";

interface AccessTokenPayload {
  sub: string;
  role: string;
}
interface RefreshTokenPayload {
  sub: string;
  jti: string;
}
function createAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, env.accessSecret, { expiresIn: "15m" });
}
function createRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, env.refreshSecret, {
    expiresIn: "15d",
  });
}

export async function signin(data: AuthSigninDTO) {
  const user = await userRepository.findByEmail(data.email);
  if (!user) {
    throw AppError.notFound("User not found");
  }
  const valid = await bcrypt.compare(data.password, user.password);

  if (!valid) {
    throw AppError.unauthroized("Invalid email or password");
  }
  const accessTokenPayload: AccessTokenPayload = {
    sub: user.id,
    role: user.role,
  };
  const accessToken = createAccessToken(accessTokenPayload);

  const jti = crypto.randomUUID();
  const refreshTokenPayload: RefreshTokenPayload = {
    sub: user.id,
    jti: jti,
  };

  const refreshToken = createRefreshToken(refreshTokenPayload);

  await authRepository.saveRefreshToken(user.id, jti);

  const { password, ...safeUser } = user;

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    safeUser,
  };
}

export async function signup(data: AuthSignupDTO) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await userRepository.create({
    ...data,
    password: hashedPassword,
  });
  const accessTokenPayload: AccessTokenPayload = {
    sub: user.id,
    role: user.role,
  };
  const accessToken = createAccessToken(accessTokenPayload);

  const jti = crypto.randomUUID();
  const refreshTokenPayload: RefreshTokenPayload = { sub: user.id, jti: jti };
  const refreshToken = createRefreshToken(refreshTokenPayload);

  await authRepository.saveRefreshToken(user.id, jti);

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    user,
  };
}

export async function refreshToken(refreshToken: string) {
  let payload: RefreshTokenPayload;
  try {
    payload = jwt.verify(
      refreshToken,
      env.refreshSecret,
    ) as RefreshTokenPayload;
  } catch (error) {
    throw AppError.unauthroized("Invalid or expired token");
  }

  const data = await authRepository.getRefreshToken(payload.jti);

  if (!data) {
    throw AppError.unauthroized("Refresh Token is not found");
  }
  if (data.revokedAt) {
    throw AppError.unauthroized("Token has been rovoked");
  }
  if (data.expiredAt && data.expiredAt < new Date()) {
    throw AppError.unauthroized("Token has been expired");
  }

  const user = await userRepository.findById(payload.sub);
  if (!user) {
    throw AppError.unauthroized("User not found");
  }
  const accessTokenPayload: AccessTokenPayload = {
    sub: user.id,
    role: user.role,
  };
  const jti = crypto.randomUUID();
  const refreshTokenPayload: RefreshTokenPayload = {
    sub: user.id,
    jti: jti,
  };
  const accessToken = createAccessToken(accessTokenPayload);
  const newRefreshToken = createRefreshToken(refreshTokenPayload);

  await authRepository.rotateRefreshToken(user.id, payload.jti, jti);

  return {
    access_token: accessToken,
    refresh_token: newRefreshToken,
  };
}

export async function signout(refreshToken: string) {
  let payload: RefreshTokenPayload;
  try {
    payload = jwt.verify(
      refreshToken,
      env.refreshSecret,
    ) as RefreshTokenPayload;
  } catch (error) {
    return;
  }
  await authRepository.revokeRefreshToken(payload.jti);
}
