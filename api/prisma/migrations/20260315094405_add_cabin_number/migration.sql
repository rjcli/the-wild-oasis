/*
  Warnings:

  - A unique constraint covering the columns `[cabin_number]` on the table `cabins` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "cabins" ADD COLUMN     "cabin_number" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "cabins_cabin_number_key" ON "cabins"("cabin_number");
