/*
  Warnings:

  - You are about to drop the column `placement` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `placement_order` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `placement`,
    ADD COLUMN `placement_order` ENUM('dine_in', 'takeaway') NOT NULL;
