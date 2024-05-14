/*
  Warnings:

  - You are about to drop the column `payment_method` on the `order` table. All the data in the column will be lost.
  - Added the required column `payment_method` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `payment_method`;

-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `payment_method` VARCHAR(191) NOT NULL;
