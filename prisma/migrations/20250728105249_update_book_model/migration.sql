/*
  Warnings:

  - You are about to drop the column `publicationDate` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "publicationDate",
ALTER COLUMN "format" SET DEFAULT 'PHYSICAL';
