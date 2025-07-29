/*
  Warnings:

  - You are about to drop the column `status` on the `Cart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "status";

-- DropEnum
DROP TYPE "CartStatus";
