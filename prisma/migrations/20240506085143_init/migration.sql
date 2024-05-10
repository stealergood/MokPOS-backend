/*
  Warnings:

  - Added the required column `image_public_id` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `image_public_id` VARCHAR(191) NOT NULL;
