/*
  Warnings:

  - The values [CREDIT_CARD,PAYPAL,BANK_TRANSFER,CASH_ON_DELIVERY] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('CART_TO_CART', 'DIRECT_PAY');
ALTER TABLE "Transaction" ALTER COLUMN "method" TYPE "PaymentMethod_new" USING ("method"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "PaymentMethod_old";
COMMIT;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "method" SET DEFAULT 'DIRECT_PAY';
