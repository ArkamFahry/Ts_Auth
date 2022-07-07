/*
  Warnings:

  - You are about to drop the column `metedata` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "metedata",
ADD COLUMN     "metadata" JSONB;
