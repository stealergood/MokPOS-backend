/*
  Warnings:

  - The primary key for the `order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `order_id` on the `order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `order` DROP PRIMARY KEY,
    MODIFY `order_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`order_id`);
