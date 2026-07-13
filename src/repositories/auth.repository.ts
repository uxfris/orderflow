import { prisma } from "../config/database.js";

export async function getRefreshToken(jti: string) {
  return prisma.refreshToken.findUnique({
    where: { jti },
  });
}

export async function rotateRefreshToken(
  userId: string,
  oldJti: string,
  newJti: string,
) {
  return prisma.$transaction(async (tx) => {
    await tx.refreshToken.delete({
      where: { jti: oldJti },
    });
    await tx.refreshToken.create({ data: { userId, jti: newJti } });
  });
}

export async function saveRefreshToken(userId: string, jti: string) {
  return prisma.refreshToken.create({ data: { userId, jti } });
}

export async function revokeRefreshToken(jti: string) {
  return prisma.refreshToken.update({
    where: { jti },
    data: { revokedAt: new Date() },
  });
}
