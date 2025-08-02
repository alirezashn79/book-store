-- AlterTable
ALTER TABLE "public"."Book" ADD COLUMN     "height" INTEGER,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "paperType" TEXT,
ADD COLUMN     "printEdition" INTEGER,
ADD COLUMN     "publishYear" TIMESTAMP(3),
ADD COLUMN     "weight" INTEGER,
ADD COLUMN     "width" INTEGER;
