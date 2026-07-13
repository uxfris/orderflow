/*
  Warnings:

  - You are about to drop the column `userid` on the `refresh_tokens` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "refresh_tokens_userid_idx";

-- AlterTable
ALTER TABLE "refresh_tokens" DROP COLUMN "userid";

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");
